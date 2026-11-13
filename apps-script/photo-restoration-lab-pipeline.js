/**
 * Photo Restoration Lab — capture pipeline: on-device cutout + specimen enhance (canvas).
 */
(function (global) {
  'use strict';

  var AUTO_CAPTURE_KEY = 'mcurator_prl_auto_capture_pipeline_v1';

  function readAutoCapturePipeline() {
    try {
      var v = localStorage.getItem(AUTO_CAPTURE_KEY);
      if (v === '0') return false;
    } catch (e) {
      void 0;
    }
    return true;
  }

  function writeAutoCapturePipeline(enabled) {
    try {
      localStorage.setItem(AUTO_CAPTURE_KEY, enabled ? '1' : '0');
    } catch (e) {
      void 0;
    }
  }

  function blobFromImageUrl(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('fetch failed');
      return r.blob();
    });
  }

  /**
   * Auto contrast, mild gamma, saturation — specimen plate style (non-generative).
   */
  function enhanceSpecimenBlob(blob, strengthPct) {
    var strength = Math.max(0, Math.min(100, strengthPct == null ? 55 : strengthPct)) / 100;
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
          var maxSide = 2048;
          var scale = Math.min(1, maxSide / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * scale));
          var ch = Math.max(1, Math.round(h * scale));
          var canvas = document.createElement('canvas');
          canvas.width = cw;
          canvas.height = ch;
          var ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('canvas unavailable'));
            return;
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, cw, ch);
          ctx.drawImage(img, 0, 0, cw, ch);
          var id = ctx.getImageData(0, 0, cw, ch);
          var d = id.data;
          var hist = new Array(256);
          var i;
          for (i = 0; i < 256; i++) hist[i] = 0;
          var pixels = cw * ch;
          for (i = 0; i < d.length; i += 4) {
            var lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            hist[Math.min(255, lum | 0)]++;
          }
          function percentile(p) {
            var need = (pixels * p) / 100;
            var acc = 0;
            var j;
            for (j = 0; j < 256; j++) {
              acc += hist[j];
              if (acc >= need) return j;
            }
            return 255;
          }
          var lo = percentile(2);
          var hi = percentile(98);
          var range = Math.max(18, hi - lo);
          var gamma = 1 - strength * 0.14;
          var sat = 1 + strength * 0.22;
          var sharpen = strength * 0.35;
          for (i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            r = ((r - lo) * 255) / range;
            g = ((g - lo) * 255) / range;
            b = ((b - lo) * 255) / range;
            r = 255 * Math.pow(Math.max(0, Math.min(255, r)) / 255, gamma);
            g = 255 * Math.pow(Math.max(0, Math.min(255, g)) / 255, gamma);
            b = 255 * Math.pow(Math.max(0, Math.min(255, b)) / 255, gamma);
            var avg = (r + g + b) / 3;
            r = avg + (r - avg) * sat;
            g = avg + (g - avg) * sat;
            b = avg + (b - avg) * sat;
            if (sharpen > 0.05) {
              r = Math.min(255, r * (1 + sharpen * 0.08));
              g = Math.min(255, g * (1 + sharpen * 0.08));
              b = Math.min(255, b * (1 + sharpen * 0.08));
            }
            d[i] = Math.max(0, Math.min(255, r));
            d[i + 1] = Math.max(0, Math.min(255, g));
            d[i + 2] = Math.max(0, Math.min(255, b));
          }
          ctx.putImageData(id, 0, 0);
          canvas.toBlob(
            function (out) {
              URL.revokeObjectURL(objUrl);
              if (out) resolve(out);
              else reject(new Error('encode failed'));
            },
            'image/jpeg',
            0.92
          );
        } catch (err) {
          URL.revokeObjectURL(objUrl);
          reject(err);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(objUrl);
        reject(new Error('decode failed'));
      };
      img.src = objUrl;
    });
  }

  /**
   * @param {File|Blob} file
   * @param {{ strength?: number, onProgress?: function }} options
   */
  function runCapturePipeline(file, options) {
    options = options || {};
    var rembg = global.MCPrlRembg;
    var onProgress = options.onProgress;
    if (!rembg || typeof rembg.processUrl !== 'function') {
      return Promise.resolve({ ok: false, message: 'rembg unavailable', provider: 'capture-pipeline' });
    }
    var srcUrl = URL.createObjectURL(file);
    function report(phase, current, total) {
      if (onProgress) onProgress({ phase: phase, current: current, total: total });
    }
    report('rembg', 0, 2);
    return rembg
      .processUrl(srcUrl, {
        mode: 'white',
        fileName: file.name,
        onProgress: function (p) {
          if (onProgress) onProgress({ phase: 'rembg', current: p.current, total: p.total, inner: p });
        }
      })
      .then(function (cutRes) {
        try {
          URL.revokeObjectURL(srcUrl);
        } catch (e0) {
          void 0;
        }
        if (!cutRes || !cutRes.ok || !cutRes.imageUrl) {
          return cutRes || { ok: false, message: 'cutout failed', provider: 'capture-pipeline' };
        }
        report('enhance', 1, 2);
        return blobFromImageUrl(cutRes.imageUrl).then(function (whiteBlob) {
          try {
            if (cutRes.imageUrl.indexOf('blob:') === 0) URL.revokeObjectURL(cutRes.imageUrl);
          } catch (e1) {
            void 0;
          }
          var enhanceFn =
            global.MCPrlEnhancePro && typeof global.MCPrlEnhancePro.processBlob === 'function'
              ? function (b, s) {
                  return global.MCPrlEnhancePro.processBlob(b, 'specimen', s);
                }
              : enhanceSpecimenBlob;
          return enhanceFn(whiteBlob, options.strength).then(function (enhanced) {
            report('done', 2, 2);
            return {
              ok: true,
              imageUrl: URL.createObjectURL(enhanced),
              blob: enhanced,
              provider: 'capture-pipeline',
              op: 'capturePipeline',
              steps: ['rembg-white', 'specimen-plate']
            };
          });
        });
      })
      .catch(function (err) {
        try {
          URL.revokeObjectURL(srcUrl);
        } catch (e2) {
          void 0;
        }
        return {
          ok: false,
          message: String(err && err.message ? err.message : err),
          provider: 'capture-pipeline'
        };
      });
  }

  global.MCPrlPipeline = {
    readAutoCapturePipeline: readAutoCapturePipeline,
    writeAutoCapturePipeline: writeAutoCapturePipeline,
    enhanceSpecimenBlob: enhanceSpecimenBlob,
    runCapturePipeline: runCapturePipeline
  };
})(typeof window !== 'undefined' ? window : this);
