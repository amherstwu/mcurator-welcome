/**
 * Placeholder for paleo wildlife photo prompt helpers (optional module).
 * Prevents 404 when UI.html loads this script in local preview.
 */
(function (global) {
  'use strict';
  if (global.MC_PALEo_WILDLIFE_PHOTO_PROMPT) return;
  global.MC_PALEo_WILDLIFE_PHOTO_PROMPT = {
    buildPrompt: function () {
      return '';
    },
  };
})(typeof self !== 'undefined' ? self : window);
