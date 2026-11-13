(function (global) {
  'use strict';

  function safeSearchParams_() {
    try {
      return new URLSearchParams(String((global.location && global.location.search) || ''));
    } catch (e) {
      return new URLSearchParams('');
    }
  }

  function isEditorMode() {
    if (typeof global === 'undefined' || !global.document) return false;
    var params = safeSearchParams_();
    return (
      params.has('editor') ||
      params.get('editor') === '1' ||
      params.get('editorPreview') === '1' ||
      params.get('staticPreview') === '1' ||
      global.document.documentElement.getAttribute('data-editor-mode') === 'true' ||
      (global.document.body && global.document.body.getAttribute('data-editor-mode') === 'true')
    );
  }

  function isPreviewMotionEnabled() {
    var params = safeSearchParams_();
    return (
      params.get('previewMotion') === '1' ||
      params.get('staticPreview') === '0' ||
      (global.document &&
        global.document.documentElement &&
        global.document.documentElement.getAttribute('data-preview-motion') === 'on')
    );
  }

  function shouldEnableEditorStaticPreview() {
    if (!isEditorMode()) return false;
    return !isPreviewMotionEnabled();
  }

  function enableEditorStaticPreview() {
    if (!global.document || !global.document.documentElement || !global.document.body) return;
    global.document.documentElement.classList.add('editor-static-preview');
    global.document.body.classList.add('editor-static-preview');
    global.document.documentElement.setAttribute('data-editor-mode', 'true');
    global.document.body.setAttribute('data-editor-mode', 'true');
    global.document.documentElement.setAttribute('data-preview-motion', 'off');
  }

  function disableEditorStaticPreview() {
    if (!global.document || !global.document.documentElement || !global.document.body) return;
    global.document.documentElement.classList.remove('editor-static-preview');
    global.document.body.classList.remove('editor-static-preview');
    global.document.documentElement.setAttribute('data-preview-motion', 'on');
  }

  function freezePreviewVideos(root) {
    var scope = root && root.querySelectorAll ? root : global.document;
    if (!scope || !scope.querySelectorAll) return;
    var videos = scope.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      var video = videos[i];
      try {
        video.pause();
        video.removeAttribute('autoplay');
        video.autoplay = false;
        video.loop = false;
        video.muted = true;
        video.currentTime = 0;
      } catch (error) {
        console.warn('[MCurator] Could not freeze preview video', error);
      }
    }
  }

  var api = {
    isEditorMode: isEditorMode,
    shouldEnableEditorStaticPreview: shouldEnableEditorStaticPreview,
    enableEditorStaticPreview: enableEditorStaticPreview,
    disableEditorStaticPreview: disableEditorStaticPreview,
    freezePreviewVideos: freezePreviewVideos,
  };

  global.MCuratorEditorMode = api;
})(typeof window !== 'undefined' ? window : this);
