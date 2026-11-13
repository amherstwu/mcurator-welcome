/**
 * Local IOPaint / LaMa inpaint client (Sanster/IOPaint FastAPI).
 * Default base: same-origin /iopaint-proxy when UI is served on localhost (see serve-ui.mjs).
 */
(function (global) {
  'use strict';

  var STORAGE_BASE = 'mcurator_prl_iopaint_base_v1';
  var DIRECT_DEFAULT = 'http://127.0.0.1:8080';

  function detectDefaultBase() {
    try {
      var loc = global.location;
      if (loc && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(loc.origin)) {
        return loc.origin + '/iopaint-proxy';
      }
    } catch (e0) {
      void 0;
    }
    return DIRECT_DEFAULT;
  }

  function normalizeBase(url) {
    var s = String(url == null ? '' : url).trim();
    if (!s) return detectDefaultBase();
    if (!/^https?:\/\//i.test(s)) {
      s = 'http://' + s;
    }
    return s.replace(/\/+$/, '');
  }

  function getBaseUrl() {
    try {
      var stored = localStorage.getItem(STORAGE_BASE);
      if (stored) return normalizeBase(stored);
    } catch (e1) {
      void 0;
    }
    return detectDefaultBase();
  }

  function setBaseUrl(url) {
    var n = normalizeBase(url);
    try {
      localStorage.setItem(STORAGE_BASE, n);
    } catch (e2) {
      void 0;
    }
    return n;
  }

  function apiUrl(path) {
    return getBaseUrl() + (path.indexOf('/') === 0 ? path : '/' + path);
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () {
        resolve(fr.result);
      };
      fr.onerror = function () {
        reject(new Error('read blob failed'));
      };
      fr.readAsDataURL(blob);
    });
  }

  function urlToBlob(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('fetch image failed');
      return r.blob();
    });
  }

  function maskDataUrlToInpaintMask(maskDataUrl) {
    return new Promise(function (resolve, reject) {
      var maskImg = new Image();
      maskImg.crossOrigin = 'anonymous';
      maskImg.onload = function () {
        var w = maskImg.naturalWidth || maskImg.width;
        var h = maskImg.naturalHeight || maskImg.height;
        if (!w || !h) {
          reject(new Error('invalid mask size'));
          return;
        }
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        var ctx = c.getContext('2d');
        if (!ctx) {
          reject(new Error('canvas unavailable'));
          return;
        }
        ctx.drawImage(maskImg, 0, 0, w, h);
        var id = ctx.getImageData(0, 0, w, h);
        var d = id.data;
        var hasMask = false;
        var i;
        for (i = 0; i < d.length; i += 4) {
          var painted = d[i + 3] > 24 || d[i] > 72 || d[i + 1] > 72;
          var v = painted ? 255 : 0;
          if (painted) hasMask = true;
          d[i] = v;
          d[i + 1] = v;
          d[i + 2] = v;
          d[i + 3] = 255;
        }
        if (!hasMask) {
          reject(new Error('empty_mask'));
          return;
        }
        ctx.putImageData(id, 0, 0);
        resolve(c.toDataURL('image/png'));
      };
      maskImg.onerror = function () {
        reject(new Error('mask decode failed'));
      };
      maskImg.src = maskDataUrl;
    });
  }

  function parseErrorBody(res) {
    return res
      .json()
      .catch(function () {
        return {};
      })
      .then(function (j) {
        var detail = j && (j.detail || j.errors || j.error);
        throw new Error(detail ? String(detail) : 'HTTP ' + res.status);
      });
  }

  function ping() {
    return fetch(apiUrl('/api/v1/server-config'), { method: 'GET', cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return parseErrorBody(r);
        return r.json().then(function () {
          return fetch(apiUrl('/api/v1/model'), { method: 'GET', cache: 'no-store' })
            .then(function (mr) {
              return mr.ok ? mr.json() : null;
            })
            .catch(function () {
              return null;
            })
            .then(function (current) {
              return {
                ok: true,
                currentModel: current && current.name ? current.name : '',
                pluginCount: cfg && cfg.plugins ? cfg.plugins.length : 0
              };
            });
        });
      })
      .catch(function (err) {
        return { ok: false, message: String(err && err.message ? err.message : err) };
      });
  }

  function switchModel(name) {
    if (!name) return Promise.resolve({ ok: true });
    return fetch(apiUrl('/api/v1/model'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name }),
      cache: 'no-store'
    }).then(function (r) {
      if (!r.ok) return parseErrorBody(r);
      return r.json().then(function () {
        return { ok: true, model: name };
      });
    });
  }

  function inpaint(imageUrl, maskDataUrl, options) {
    options = options || {};
    var model = options.model;
    return switchModel(model)
      .then(function () {
        return urlToBlob(imageUrl);
      })
      .then(function (imgBlob) {
        return blobToDataUrl(imgBlob);
      })
      .then(function (imageB64) {
        return maskDataUrlToInpaintMask(maskDataUrl).then(function (maskB64) {
          return { image: imageB64, mask: maskB64 };
        });
      })
      .then(function (payload) {
        return fetch(apiUrl('/api/v1/inpaint'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: payload.image,
            mask: payload.mask,
            hd_strategy: 'Crop',
            hd_strategy_crop_trigger_size: 800,
            hd_strategy_crop_margin: 128,
            sd_keep_unmasked_area: true
          }),
          cache: 'no-store'
        });
      })
      .then(function (res) {
        if (!res.ok) return parseErrorBody(res);
        return res.blob();
      })
      .then(function (outBlob) {
        return {
          ok: true,
          imageUrl: URL.createObjectURL(outBlob),
          blob: outBlob,
          provider: model ? 'iopaint-' + model : 'iopaint-local',
          op: 'inpaint'
        };
      })
      .catch(function (err) {
        var msg = String(err && err.message ? err.message : err);
        if (msg === 'empty_mask') {
          msg = 'empty_mask';
        }
        return { ok: false, message: msg, provider: 'iopaint-local' };
      });
  }

  global.MCPrlLocalInpaint = {
    STORAGE_BASE: STORAGE_BASE,
    DIRECT_DEFAULT: DIRECT_DEFAULT,
    detectDefaultBase: detectDefaultBase,
    getBaseUrl: getBaseUrl,
    setBaseUrl: setBaseUrl,
    ping: ping,
    switchModel: switchModel,
    inpaint: inpaint
  };
})(typeof window !== 'undefined' ? window : this);
