/**
 * One-click specimen plate stack (marketing before/after):
 * Rembg (danielgatis/rembg class) -> enhance-pro -> optional 2x upscale.
 */
(function (global) {
  'use strict';

  function runPlateStack(imageUrl, options) {
    options = options || {};
    var rembg = global.MCPrlRembg;
    var enhance = global.MCPrlEnhancePro;
    var upscale = global.MCPrlUpscale;
    var onProgress = options.onProgress;
    var strength = options.strength;
    var doUpscale = options.upscale !== false;

    if (!rembg || !enhance) {
      return Promise.resolve({ ok: false, message: 'oss modules unavailable', provider: 'plate-stack' });
    }

    function report(phase, current, total) {
      if (onProgress) onProgress({ phase: phase, current: current, total: total });
    }

    report('rembg', 0, doUpscale ? 3 : 2);
    return rembg
      .processUrl(imageUrl, {
        mode: 'white',
        fileName: options.fileName,
        onProgress: function (p) {
          if (onProgress) onProgress({ phase: 'rembg', inner: p });
        }
      })
      .then(function (cut) {
        if (!cut || !cut.ok || !cut.imageUrl) {
          return cut || { ok: false, message: 'cutout failed', provider: 'plate-stack' };
        }
        report('enhance', 1, doUpscale ? 3 : 2);
        return enhance.processUrl(cut.imageUrl, 'specimen', strength).then(function (enh) {
          try {
            if (cut.imageUrl.indexOf('blob:') === 0) URL.revokeObjectURL(cut.imageUrl);
          } catch (e0) {
            void 0;
          }
          if (!enh || !enh.ok || !enh.imageUrl) {
            return enh || { ok: false, message: 'enhance failed', provider: 'plate-stack' };
          }
          if (!doUpscale || !upscale) {
            report('done', doUpscale ? 3 : 2, doUpscale ? 3 : 2);
            return {
              ok: true,
              imageUrl: enh.imageUrl,
              provider: 'plate-stack',
              op: 'plateStack',
              steps: ['rembg-white', 'specimen-plate']
            };
          }
          report('upscale', 2, 3);
          return upscale.processUrl(enh.imageUrl, { scale: 2, onProgress: options.onProgress }).then(function (up) {
            try {
              if (enh.imageUrl.indexOf('blob:') === 0) URL.revokeObjectURL(enh.imageUrl);
            } catch (e1) {
              void 0;
            }
            if (!up || !up.ok || !up.imageUrl) {
              return {
                ok: true,
                imageUrl: enh.imageUrl,
                provider: 'plate-stack',
                op: 'plateStack',
                steps: ['rembg-white', 'specimen-plate'],
                note: 'upscale skipped'
              };
            }
            report('done', 3, 3);
            return {
              ok: true,
              imageUrl: up.imageUrl,
              provider: 'plate-stack',
              op: 'plateStack',
              steps: ['rembg-white', 'enhance-pro', 'upscale-2x']
            };
          });
        });
      })
      .catch(function (err) {
        return {
          ok: false,
          provider: 'plate-stack',
          message: String(err && err.message ? err.message : err)
        };
      });
  }

  global.MCPrlPlateStack = {
    run: runPlateStack
  };
})(typeof window !== 'undefined' ? window : this);
