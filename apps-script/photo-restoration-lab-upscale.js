/**
 * Upscale — canvas (always) + optional UpscalerJS / Real-ESRGAN-class (thekevinscott/UpscalerJS).
 * Preserves aspect ratio (no independent width/height clamp).
 */
(function (global) {
  'use strict';

  var UPSCALER_ESMS = [
    'https://cdn.jsdelivr.net/npm/upscaler@0.12.3/+esm',
    'https://esm.sh/upscaler@0.12.3'
  ];
  var MODEL_ESMS = [
    'https://cdn.jsdelivr.net/npm/@upscalerjs/default-model@0.12.3/+esm',
    'https://esm.sh/@upscalerjs/default-model@0.12.3'
  ];

  function importFirst(urls) {
    var idx = 0;
    function attempt() {
      return import(urls[idx]).catch(function (err) {
        idx += 1;
        if (idx < urls.length) return attempt();
        throw err;
      });
    }
    return attempt();
  }
  var MAX_OUTPUT_SIDE = 4096;
  var upscalerPromise = null;

  function blobFromUrl(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('fetch failed');
      return r.blob();
    });
  }

  function loadImageBlob(blob) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(blob);
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('decode failed'));
      };
      img.src = url;
    });
  }

  function readImageSize(blob) {
    return loadImageBlob(blob).then(function (img) {
      return {
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      };
    });
  }

  /**
   * Scale by factor, then shrink uniformly if longest side exceeds maxSide.
   */
  function computeOutputSize(srcW, srcH, scale, maxSide) {
    maxSide = maxSide || MAX_OUTPUT_SIDE;
    scale = scale === 4 ? 4 : 2;
    var sw = Math.max(1, Math.round(srcW * scale));
    var sh = Math.max(1, Math.round(srcH * scale));
    var longest = Math.max(sw, sh);
    if (longest > maxSide) {
      var r = maxSide / longest;
      sw = Math.max(1, Math.round(sw * r));
      sh = Math.max(1, Math.round(sh * r));
    }
    return { width: sw, height: sh, scale: scale };
  }

  function canvasToJpeg(canvas, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(
        function (b) {
          if (b) resolve(b);
          else reject(new Error('encode failed'));
        },
        'image/jpeg',
        quality != null ? quality : 0.92
      );
    });
  }

  function drawImageContain(canvas, img, outW, outH) {
    var ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas unavailable');
    var iw = img.naturalWidth || img.width;
    var ih = img.naturalHeight || img.height;
    if (!iw || !ih) throw new Error('invalid image dimensions');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW, outH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    var ir = iw / ih;
    var or = outW / outH;
    var drawW;
    var drawH;
    if (Math.abs(ir - or) < 0.002) {
      drawW = outW;
      drawH = outH;
    } else if (ir > or) {
      drawW = outW;
      drawH = Math.max(1, Math.round(outW / ir));
    } else {
      drawH = outH;
      drawW = Math.max(1, Math.round(outH * ir));
    }
    var ox = Math.round((outW - drawW) / 2);
    var oy = Math.round((outH - drawH) / 2);
    ctx.drawImage(img, ox, oy, drawW, drawH);
    return { drawW: drawW, drawH: drawH };
  }

  function canvasUpscale(blob, scale) {
    scale = scale === 4 ? 4 : 2;
    return loadImageBlob(blob).then(function (img) {
      var w = img.naturalWidth || img.width;
      var h = img.naturalHeight || img.height;
      var out = computeOutputSize(w, h, scale, MAX_OUTPUT_SIDE);
      var c = document.createElement('canvas');
      c.width = out.width;
      c.height = out.height;
      drawImageContain(c, img, out.width, out.height);
      return canvasToJpeg(c);
    });
  }

  function normalizeUpscaleBlob(outBlob, srcW, srcH, scale) {
    var target = computeOutputSize(srcW, srcH, scale, MAX_OUTPUT_SIDE);
    return loadImageBlob(outBlob).then(function (img) {
      var w = img.naturalWidth || img.width;
      var h = img.naturalHeight || img.height;
      var srcRatio = srcW / srcH;
      var outRatio = w / h;
      var targetRatio = target.width / target.height;
      var ratioOk = Math.abs(outRatio - srcRatio) < 0.015;
      var sizeOk =
        Math.abs(w - target.width) <= Math.max(4, target.width * 0.02) &&
        Math.abs(h - target.height) <= Math.max(4, target.height * 0.02);
      if (ratioOk && sizeOk) {
        return outBlob;
      }
      var c = document.createElement('canvas');
      c.width = target.width;
      c.height = target.height;
      drawImageContain(c, img, target.width, target.height);
      return canvasToJpeg(c);
    });
  }

  function loadUpscaler() {
    if (!upscalerPromise) {
      upscalerPromise = Promise.all([importFirst(UPSCALER_ESMS), importFirst(MODEL_ESMS)])
        .then(function (mods) {
          var UpscalerCtor = mods[0].default || mods[0].Upscaler || mods[0];
          var model = mods[1].default || mods[1];
          return new UpscalerCtor({ model: model });
        })
        .catch(function (err) {
          upscalerPromise = null;
          throw err;
        });
    }
    return upscalerPromise;
  }

  function tensorOrCanvasToBlob(tensorOrCanvas) {
    if (tensorOrCanvas && typeof tensorOrCanvas.toDataURL === 'function') {
      return fetch(tensorOrCanvas.toDataURL('image/jpeg', 0.92)).then(function (r) {
        return r.blob();
      });
    }
    if (tensorOrCanvas instanceof HTMLCanvasElement) {
      return canvasToJpeg(tensorOrCanvas);
    }
    if (tensorOrCanvas instanceof Blob) {
      return Promise.resolve(tensorOrCanvas);
    }
    return Promise.reject(new Error('unexpected upscale output'));
  }

  function aiUpscale(blob, scale, onProgress) {
    scale = scale === 4 ? 4 : 2;
    return loadUpscaler().then(function (upscaler) {
      return upscaler.upscale(blob, {
        scale: scale,
        output: { format: 'image/jpeg', quality: 0.92 },
        progress: function (p) {
          if (onProgress) onProgress({ phase: 'esrgan', inner: p });
        },
        patchSize: 64,
        padding: 2
      });
    }).then(tensorOrCanvasToBlob);
  }

  function processUrl(imageUrl, options) {
    options = options || {};
    var scale = options.scale === 4 ? 4 : 2;
    var srcSize;
    return blobFromUrl(imageUrl)
      .then(function (blob) {
        return readImageSize(blob).then(function (size) {
          srcSize = size;
          return blob;
        });
      })
      .then(function (blob) {
        return aiUpscale(blob, scale, options.onProgress)
          .then(function (outBlob) {
            return normalizeUpscaleBlob(outBlob, srcSize.width, srcSize.height, scale);
          })
          .catch(function () {
            return canvasUpscale(blob, scale);
          });
      })
      .then(function (outBlob) {
        var target = srcSize
          ? computeOutputSize(srcSize.width, srcSize.height, scale, MAX_OUTPUT_SIDE)
          : null;
        var full = srcSize
          ? computeOutputSize(srcSize.width, srcSize.height, scale, 16384)
          : null;
        var clamped =
          target && full && (target.width !== full.width || target.height !== full.height);
        return {
          ok: true,
          imageUrl: URL.createObjectURL(outBlob),
          blob: outBlob,
          provider: 'browser-esrgan',
          op: scale === 4 ? 'up4' : 'upscale',
          outputSize: target,
          clamped: clamped
        };
      })
      .catch(function (err) {
        return {
          ok: false,
          provider: 'browser-esrgan',
          message: String(err && err.message ? err.message : err)
        };
      });
  }

  global.MCPrlUpscale = {
    preload: function () {
      return loadUpscaler().catch(function () {});
    },
    processUrl: processUrl,
    canvasUpscale: canvasUpscale,
    computeOutputSize: computeOutputSize
  };
})(typeof window !== 'undefined' ? window : this);
