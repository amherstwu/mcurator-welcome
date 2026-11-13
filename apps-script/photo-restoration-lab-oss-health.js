/**
 * OSS module registry + preload for Photo Restoration Lab.
 */
(function (global) {
  'use strict';

  var status = {
    rembg: 'unknown',
    enhance: 'unknown',
    upscale: 'unknown',
    inpaint: 'unknown',
    lastCheck: ''
  };

  function setStatus(key, val) {
    status[key] = val;
    status.lastCheck = new Date().toISOString();
  }

  function getStatus() {
    return {
      rembg: status.rembg,
      enhance: status.enhance,
      upscale: status.upscale,
      inpaint: status.inpaint,
      lastCheck: status.lastCheck
    };
  }

  function checkEnhance() {
    if (global.MCPrlEnhancePro && typeof global.MCPrlEnhancePro.processUrl === 'function') {
      setStatus('enhance', 'ready');
      return Promise.resolve(true);
    }
    setStatus('enhance', 'missing');
    return Promise.resolve(false);
  }

  function checkRembg() {
    var rembg = global.MCPrlRembg;
    if (!rembg || typeof rembg.preload !== 'function') {
      setStatus('rembg', 'missing');
      return Promise.resolve(false);
    }
    setStatus('rembg', 'loading');
    return rembg
      .preload()
      .then(function () {
        setStatus('rembg', 'ready');
        return true;
      })
      .catch(function (err) {
        setStatus('rembg', 'error');
        return false;
      });
  }

  function checkUpscale() {
    if (!global.MCPrlUpscale) {
      setStatus('upscale', 'missing');
      return Promise.resolve(false);
    }
    setStatus('upscale', 'loading');
    return global.MCPrlUpscale
      .preload()
      .then(function () {
        setStatus('upscale', 'ready');
        return true;
      })
      .catch(function () {
        setStatus('upscale', 'canvas');
        return true;
      });
  }

  function checkInpaint() {
    var api = global.MCPrlLocalInpaint;
    if (!api || typeof api.ping !== 'function') {
      setStatus('inpaint', 'missing');
      return Promise.resolve(false);
    }
    setStatus('inpaint', 'loading');
    return api.ping().then(function (r) {
      setStatus('inpaint', r && r.ok ? 'ready' : 'offline');
      return !!(r && r.ok);
    });
  }

  function preloadAll() {
    return Promise.all([
      checkEnhance(),
      checkRembg(),
      checkUpscale(),
      checkInpaint()
    ]).then(function () {
      return getStatus();
    });
  }

  function isOpAvailable(uiOp) {
    if (
      uiOp === 'removeBackground' ||
      uiOp === 'whiteBg' ||
      uiOp === 'transparentBg'
    ) {
      return status.rembg === 'ready';
    }
    if (
      uiOp === 'enhance' ||
      uiOp === 'grade' ||
      uiOp === 'glare' ||
      uiOp === 'correctColor' ||
      uiOp === 'denoise' ||
      uiOp === 'deblur' ||
      uiOp === 'dust' ||
      uiOp === 'derain' ||
      uiOp === 'jpeg' ||
      uiOp === 'exportImage'
    ) {
      return status.enhance === 'ready';
    }
    if (uiOp === 'upscale' || uiOp === 'up4') {
      return status.upscale === 'ready' || status.upscale === 'canvas';
    }
    if (uiOp === 'inpaint') {
      return status.inpaint === 'ready';
    }
    return false;
  }

  global.MCPrlOssHealth = {
    preloadAll: preloadAll,
    getStatus: getStatus,
    isOpAvailable: isOpAvailable,
    checkInpaint: checkInpaint,
    checkRembg: checkRembg
  };
})(typeof window !== 'undefined' ? window : this);
