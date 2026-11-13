(function () {
  'use strict';

  function openEditorWithQuery_(section) {
    try {
      if (section) window.__MC_EDITOR_OPEN_SECTION__ = section;
      if (typeof window.openVisualEditorOverlay === 'function') {
        window.openVisualEditorOverlay();
        return !!document.getElementById('mcVisualEditor');
      }
      var u = new URL(window.location.href);
      u.searchParams.set('editor', '1');
      u.searchParams.set('staticPreview', '1');
      if (section) u.searchParams.set('editorSection', section);
      window.location.href = u.toString();
      return true;
    } catch (e) {
      return false;
    }
  }

  function openWithRetry_(section, attempt) {
    if (openEditorWithQuery_(section)) return true;
    if (attempt >= 40) return false;
    setTimeout(function () {
      openWithRetry_(section, attempt + 1);
    }, 250);
    return false;
  }

  window.MCuratorVisualEditorLauncher = {
    open: function (opts) {
      opts = opts || {};
      return openWithRetry_(opts.section || '', 0);
    },
    openProjectEditor: function () {
      return openWithRetry_('project', 0);
    },
    openLandingEditor: function () {
      return openWithRetry_('hero', 0);
    },
  };

  window.addEventListener('mc:open-visual-editor', function (ev) {
    var detail = (ev && ev.detail) || {};
    openWithRetry_(detail.section || '', 0);
  });
})();
