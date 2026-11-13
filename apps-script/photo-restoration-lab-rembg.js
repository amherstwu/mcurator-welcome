/**
 * Browser-local background removal for Photo Restoration Lab.
 * Uses @imgly/background-removal (ISNet) — same on-device privacy model as Rembg / RMBG (ruanyf/weekly).
 */
(function (global) {
  'use strict';

  var ESM_URLS = [
    'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm',
    'https://esm.sh/@imgly/background-removal@1.7.0'
  ];
  var UTIF_URLS = ['https://cdn.jsdelivr.net/npm/utif@3.1.0/+esm', 'https://esm.sh/utif@3.1.0'];
  var libPromise = null;
  var preloadPromise = null;
  var utifPromise = null;

  var REMBG_INPUT_TYPES = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/webp': true
  };

  function fileExt(name) {
    var m = String(name || '')
      .toLowerCase()
      .match(/\.([a-z0-9]+)$/);
    return m ? m[1] : '';
  }

  function isTiffLike(blob, fileName) {
    var t = String((blob && blob.type) || '').toLowerCase();
    var ext = fileExt(fileName);
    return t === 'image/tiff' || t === 'image/tif' || ext === 'tif' || ext === 'tiff';
  }

  function needsNormalizeForRembg(blob, fileName) {
    if (!blob) return true;
    var t = String(blob.type || '').toLowerCase();
    if (REMBG_INPUT_TYPES[t]) return false;
    if (isTiffLike(blob, fileName)) return true;
    if (t === 'image/heic' || t === 'image/heif' || fileExt(fileName) === 'heic' || fileExt(fileName) === 'heif') {
      return true;
    }
    if (!t || t === 'application/octet-stream') return true;
    return !REMBG_INPUT_TYPES[t];
  }

  function canvasToJpegBlob(canvas, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(
        function (b) {
          if (b) resolve(b);
          else reject(new Error('jpeg encode failed'));
        },
        'image/jpeg',
        quality != null ? quality : 0.92
      );
    });
  }

  function blobToJpegViaCanvas(blob) {
    if (typeof createImageBitmap === 'function') {
      return createImageBitmap(blob)
        .then(function (bitmap) {
          var c = document.createElement('canvas');
          var w = bitmap.width;
          var h = bitmap.height;
          if (!w || !h) {
            if (bitmap.close) bitmap.close();
            throw new Error('invalid dimensions');
          }
          var maxSide = 4096;
          var scale = Math.min(1, maxSide / Math.max(w, h));
          c.width = Math.max(1, Math.round(w * scale));
          c.height = Math.max(1, Math.round(h * scale));
          var ctx = c.getContext('2d');
          if (!ctx) {
            if (bitmap.close) bitmap.close();
            throw new Error('canvas unavailable');
          }
          ctx.drawImage(bitmap, 0, 0, c.width, c.height);
          if (bitmap.close) bitmap.close();
          return canvasToJpegBlob(c);
        })
        .catch(function () {
          return blobToJpegViaImageElement(blob);
        });
    }
    return blobToJpegViaImageElement(blob);
  }

  function blobToJpegViaImageElement(blob) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var objUrl = URL.createObjectURL(blob);
      img.onload = function () {
        try {
          var w = img.naturalWidth || img.width;
          var h = img.naturalHeight || img.height;
          if (!w || !h) {
            reject(new Error('invalid dimensions'));
            return;
          }
          var maxSide = 4096;
          var scale = Math.min(1, maxSide / Math.max(w, h));
          var c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(w * scale));
          c.height = Math.max(1, Math.round(h * scale));
          var ctx = c.getContext('2d');
          if (!ctx) {
            reject(new Error('canvas unavailable'));
            return;
          }
          ctx.drawImage(img, 0, 0, c.width, c.height);
          canvasToJpegBlob(c).then(resolve, reject);
        } catch (e) {
          reject(e);
        } finally {
          URL.revokeObjectURL(objUrl);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(objUrl);
        reject(new Error('image decode failed'));
      };
      img.src = objUrl;
    });
  }

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

  function loadUtif() {
    if (!utifPromise) {
      utifPromise = importFirst(UTIF_URLS).catch(function (err) {
        utifPromise = null;
        throw err;
      });
    }
    return utifPromise;
  }

  function tiffBlobToJpeg(blob) {
    return blob.arrayBuffer().then(function (buf) {
      return loadUtif().then(function (UTIF) {
        var ifds = UTIF.decode(buf);
        if (!ifds || !ifds.length) throw new Error('tiff decode failed');
        UTIF.decodeImages(buf, ifds);
        var page = ifds[0];
        var rgba = UTIF.toRGBA8(page);
        var w = page.width;
        var h = page.height;
        if (!w || !h || !rgba) throw new Error('tiff decode failed');
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        var ctx = c.getContext('2d');
        if (!ctx) throw new Error('canvas unavailable');
        var id = ctx.createImageData(w, h);
        id.data.set(rgba);
        ctx.putImageData(id, 0, 0);
        return canvasToJpegBlob(c);
      });
    });
  }

  function normalizeBlobForRembg(blob, fileName) {
    if (!needsNormalizeForRembg(blob, fileName)) {
      return Promise.resolve(blob);
    }
    if (isTiffLike(blob, fileName)) {
      return tiffBlobToJpeg(blob).catch(function () {
        return blobToJpegViaCanvas(blob);
      });
    }
    return blobToJpegViaCanvas(blob).catch(function () {
      return Promise.reject(new Error('unsupported image format; use JPG or PNG'));
    });
  }

  function bgConfig(onProgress, device) {
    return {
      model: 'isnet_quint8',
      device: device || 'cpu',
      proxyToWorker: true,
      output: { format: 'image/png', quality: 0.92 },
      progress: function (phase, current, total) {
        if (typeof onProgress === 'function') {
          onProgress({ phase: phase, current: current, total: total });
        }
      }
    };
  }

  function loadLib() {
    if (!libPromise) {
      libPromise = importFirst(ESM_URLS).catch(function (err) {
        libPromise = null;
        throw err;
      });
    }
    return libPromise;
  }

  function removeWithDevice(input, onProgress, device) {
    return loadLib().then(function (mod) {
      return mod.removeBackground(input, bgConfig(onProgress, device));
    });
  }

  function urlToBlob(url) {
    if (!url) return Promise.reject(new Error('missing image url'));
    if (String(url).indexOf('blob:') === 0 || String(url).indexOf('data:') === 0) {
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error('fetch failed');
        return r.blob();
      });
    }
    return fetch(url, { mode: 'cors' }).then(function (r) {
      if (!r.ok) throw new Error('fetch failed');
      return r.blob();
    });
  }

  function blobToFile(blob, name) {
    var type = blob.type || 'image/jpeg';
    var base = String(name || 'prl-input').replace(/\.[^.]+$/, '');
    var ext = type === 'image/png' ? '.png' : type === 'image/webp' ? '.webp' : '.jpg';
    return new File([blob], base + ext, { type: type });
  }

  function compositeWhiteJpeg(pngBlob, quality) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var objUrl = URL.createObjectURL(pngBlob);
      img.onload = function () {
        try {
          var c = document.createElement('canvas');
          c.width = img.naturalWidth || img.width;
          c.height = img.naturalHeight || img.height;
          var ctx = c.getContext('2d');
          if (!ctx) {
            reject(new Error('canvas unavailable'));
            return;
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0);
          c.toBlob(
            function (b) {
              URL.revokeObjectURL(objUrl);
              if (b) resolve(b);
              else reject(new Error('jpeg encode failed'));
            },
            'image/jpeg',
            quality != null ? quality : 0.92
          );
        } catch (e) {
          URL.revokeObjectURL(objUrl);
          reject(e);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(objUrl);
        reject(new Error('image decode failed'));
      };
      img.src = objUrl;
    });
  }

  function runRemove(blob, onProgress, fileName) {
    return normalizeBlobForRembg(blob, fileName).then(function (normalized) {
      var input =
        normalized instanceof File ? normalized : blobToFile(normalized, fileName || 'prl-source.jpg');
      return removeWithDevice(input, onProgress, 'cpu').catch(function () {
        return removeWithDevice(input, onProgress, 'gpu');
      });
    });
  }

  global.MCPrlRembg = {
    providerId: 'browser-rembg',
    normalizeBlobForRembg: normalizeBlobForRembg,
    needsNormalizeForRembg: needsNormalizeForRembg,

    preload: function (onProgress) {
      if (!preloadPromise) {
        preloadPromise = loadLib().then(function (mod) {
          if (typeof mod.preload === 'function') {
            return mod.preload(bgConfig(onProgress));
          }
        });
      }
      return preloadPromise;
    },

    /**
     * @param {string} imageUrl
     * @param {{ mode?: 'transparent'|'white', onProgress?: function, fileName?: string }} options
     * @returns {Promise<{ ok: boolean, imageUrl?: string, blob?: Blob, provider: string, op: string, message?: string }>}
     */
    processUrl: function (imageUrl, options) {
      options = options || {};
      var mode = options.mode === 'white' ? 'white' : 'transparent';
      return urlToBlob(imageUrl)
        .then(function (blob) {
          return runRemove(blob, options.onProgress, options.fileName);
        })
        .then(function (pngBlob) {
          if (mode === 'white') {
            return compositeWhiteJpeg(pngBlob, 0.92).then(function (jpegBlob) {
              return { blob: jpegBlob, mime: 'image/jpeg' };
            });
          }
          return { blob: pngBlob, mime: 'image/png' };
        })
        .then(function (out) {
          var imageUrlOut = URL.createObjectURL(out.blob);
          return {
            ok: true,
            imageUrl: imageUrlOut,
            blob: out.blob,
            provider: 'browser-rembg',
            op: mode === 'white' ? 'whiteBg' : 'removeBackground',
            mime: out.mime
          };
        })
        .catch(function (err) {
          return {
            ok: false,
            provider: 'browser-rembg',
            message: String(err && err.message ? err.message : err)
          };
        });
    }
  };
})(typeof window !== 'undefined' ? window : this);
