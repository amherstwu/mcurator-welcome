/**
 * Homepage journey line — disabled (removed sitewide).
 * Keeps destroy/no-op exports so legacy callers do not throw.
 */
(function (global) {
  'use strict';

  function cleanupJourneyLine_() {
    try {
      var shell = document.getElementById('welcomeShell');
      if (!shell) return;
      var layer = shell.querySelector('.mc-journey-line');
      if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
      shell.classList.remove('is-journey-drawn');
      shell.removeAttribute('data-mc-journey');
      shell.removeAttribute('data-mc-journey-tone');
    } catch (e) {}
  }

  function noopInit_() {
    cleanupJourneyLine_();
    return null;
  }

  global.initHomepageArrowPath = noopInit_;
  global.updateHomepageArrowPath = function () {};
  global.destroyHomepageArrowPath = cleanupJourneyLine_;
  global.rebuildHomepageArrowPath = cleanupJourneyLine_;

  cleanupJourneyLine_();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupJourneyLine_);
  }
  global.addEventListener('load', function () {
    cleanupJourneyLine_();
  });
})(typeof window !== 'undefined' ? window : globalThis);
