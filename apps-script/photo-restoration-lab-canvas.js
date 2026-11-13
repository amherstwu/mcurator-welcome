/**
 * Canvas utilities for Photo Restoration Lab: transforms, trim, export encodes.
 */
(function (global) {
  'use strict';

  function blobFromUrl(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('fetch failed');
      return r.blob();
    });
  }

  function loadImage(blob) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var obj = URL.createObjectURL(blob);
      img.onload = function () {
        URL.revokeObjectURL(obj);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(obj);
        reject(new Error('decode failed'));
      };
      img.src = obj;
    });
  }

  function canvasToBlob(canvas, mime, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(
        function (b) {
          if (b) resolve(b);
          else reject(new Error('encode failed'));
        },
        mime || 'image/png',
        quality != null ? quality : 0.92
      );
    });
  }

  function drawImageToCanvas(img, w, h) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas unavailable');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas;
  }

  function rotate90Canvas(img) {
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var canvas = document.createElement('canvas');
    canvas.width = h;
    canvas.height = w;
    var ctx = canvas.getContext('2d');
    ctx.translate(h, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  function flipCanvas(img, horizontal) {
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    if (horizontal) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(0, h);
      ctx.scale(1, -1);
    }
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  function isContentPixel(r, g, b, a, mode) {
    if (a != null && a < 12) return false;
    if (mode === 'dark') {
      return r < 235 || g < 235 || b < 235;
    }
    return r < 250 || g < 250 || b < 250;
  }

  function findContentBounds(id, mode) {
    var d = id.data;
    var w = id.width;
    var h = id.height;
    var minX = w;
    var minY = h;
    var maxX = 0;
    var maxY = 0;
    var x;
    var y;
    var i;
    var found = false;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        i = (y * w + x) * 4;
        if (isContentPixel(d[i], d[i + 1], d[i + 2], d[i + 3], mode)) {
          found = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (!found) return null;
    return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
  }

  function autoCropCanvas(img, options) {
    options = options || {};
    var pad = options.pad != null ? options.pad : 8;
    var mode = options.mode || 'white';
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var src = document.createElement('canvas');
    src.width = w;
    src.height = h;
    var sctx = src.getContext('2d');
    sctx.drawImage(img, 0, 0);
    var id = sctx.getImageData(0, 0, w, h);
    var b = findContentBounds(id, mode === 'dark' ? 'dark' : 'white');
    if (!b) return src;
    var cw = Math.max(1, b.maxX - b.minX + 1 + pad * 2);
    var ch = Math.max(1, b.maxY - b.minY + 1 + pad * 2);
    var canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    var ctx = canvas.getContext('2d');
    if (options.fillWhite) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cw, ch);
    }
    ctx.drawImage(img, b.minX, b.minY, b.maxX - b.minX + 1, b.maxY - b.minY + 1, pad, pad, cw - pad * 2, ch - pad * 2);
    return canvas;
  }

  function fitPassportCanvas(img) {
    var cropped = autoCropCanvas(img, { pad: 16, fillWhite: true });
    var cw = cropped.width;
    var ch = cropped.height;
    var target = 1200;
    var aspect = 4 / 3;
    var outW;
    var outH;
    if (cw / ch > aspect) {
      outW = target;
      outH = Math.round(target / aspect);
    } else {
      outH = target;
      outW = Math.round(target * aspect);
    }
    var canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW, outH);
    var scale = Math.min((outW - 48) / cw, (outH - 48) / ch);
    var dw = Math.round(cw * scale);
    var dh = Math.round(ch * scale);
    ctx.drawImage(cropped, Math.round((outW - dw) / 2), Math.round((outH - dh) / 2), dw, dh);
    return canvas;
  }

  function thumbCanvas(img, maxSide) {
    maxSide = maxSide || 512;
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var scale = Math.min(1, maxSide / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * scale));
    var ch = Math.max(1, Math.round(h * scale));
    return drawImageToCanvas(img, cw, ch);
  }

  function padWhiteCanvas(img, options) {
    options = options || {};
    var pct = options.padPct != null ? options.padPct : 0.1;
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var px = Math.max(8, Math.round(w * pct));
    var py = Math.max(8, Math.round(h * pct));
    var cw = w + px * 2;
    var ch = h + py * 2;
    var canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, px, py, w, h);
    return canvas;
  }

  function compositeOnWhite(img) {
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  function processBlob(blob, op, options) {
    options = options || {};
    return loadImage(blob).then(function (img) {
      var canvas;
      if (op === 'rotate90') canvas = rotate90Canvas(img);
      else if (op === 'flipH') canvas = flipCanvas(img, true);
      else if (op === 'flipV') canvas = flipCanvas(img, false);
      else if (op === 'autoCrop') canvas = autoCropCanvas(img, options);
      else if (op === 'borderClean') canvas = autoCropCanvas(img, { mode: 'dark', pad: 4, fillWhite: true });
      else if (op === 'padWhite') canvas = padWhiteCanvas(img, options);
      else if (op === 'passport') canvas = fitPassportCanvas(img);
      else if (op === 'thumb') canvas = thumbCanvas(img, options.maxSide || 512);
      else throw new Error('unknown transform: ' + op);
      var mime = options.mime || 'image/jpeg';
      var q = options.quality != null ? options.quality : 0.92;
      return canvasToBlob(canvas, mime, q);
    });
  }

  function processUrl(imageUrl, op, options) {
    return blobFromUrl(imageUrl)
      .then(function (blob) {
        return processBlob(blob, op, options);
      })
      .then(function (outBlob) {
        return {
          ok: true,
          imageUrl: URL.createObjectURL(outBlob),
          blob: outBlob,
          provider: 'browser-canvas',
          op: op
        };
      })
      .catch(function (err) {
        return {
          ok: false,
          provider: 'browser-canvas',
          message: String(err && err.message ? err.message : err)
        };
      });
  }

  function exportBlob(imageUrl, format, options) {
    options = options || {};
    return blobFromUrl(imageUrl).then(function (blob) {
      return loadImage(blob).then(function (img) {
        var canvas;
        var mime;
        var quality = 0.92;
        if (format === 'png' || format === 'png-tr') {
          if (format === 'png-tr') {
            canvas = drawImageToCanvas(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
          } else {
            canvas = drawImageToCanvas(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
          }
          mime = 'image/png';
          quality = undefined;
        } else if (format === 'jpg-white') {
          canvas = compositeOnWhite(img);
          mime = 'image/jpeg';
          quality = 0.94;
        } else if (format === 'passport') {
          canvas = fitPassportCanvas(img);
          mime = 'image/jpeg';
          quality = 0.94;
        } else if (format === 'thumb' || format === 'sat') {
          canvas = thumbCanvas(img, format === 'sat' ? 1600 : 512);
          mime = 'image/jpeg';
          quality = 0.9;
        } else {
          canvas = drawImageToCanvas(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
          mime = 'image/jpeg';
        }
        return canvasToBlob(canvas, mime, quality);
      });
    });
  }

  function downloadExport(imageUrl, format, fileName) {
    return exportBlob(imageUrl, format).then(function (blob) {
      var ext =
        format === 'png' || format === 'png-tr'
          ? 'png'
          : format === 'passport'
            ? 'passport.jpg'
            : format === 'thumb'
              ? 'thumb.jpg'
              : format === 'sat'
                ? 'sat.jpg'
                : 'jpg';
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName || 'restored.' + ext;
      a.click();
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 4000);
      return { ok: true, blob: blob };
    });
  }

  global.MCPrlCanvas = {
    blobFromUrl: blobFromUrl,
    processUrl: processUrl,
    processBlob: processBlob,
    exportBlob: exportBlob,
    downloadExport: downloadExport
  };
})(typeof window !== 'undefined' ? window : this);
