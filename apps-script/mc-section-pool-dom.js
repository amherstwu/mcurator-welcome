/**
 * Apply section-pool imagery from data-mc-section-asset="sectionId:variant".
 * Requires ../assets/mc-section-visual-pools.js (mcGetSectionAsset).
 */
(function (global) {
  'use strict';

  function resolvePoolUrl(rel) {
    if (!rel) return '';
    if (typeof global.mcResolveLocalRelToPage_ === 'function') {
      return global.mcResolveLocalRelToPage_(rel);
    }
    return '../' + String(rel).replace(/^\//, '');
  }

  function applyPoolImages(root) {
    if (typeof global.mcGetSectionAsset !== 'function') return;
    var scope = root || global.document;
    if (!scope || !scope.querySelectorAll) return;
    var nodes = scope.querySelectorAll('[data-mc-section-asset]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var spec = String(el.getAttribute('data-mc-section-asset') || '');
      var parts = spec.split(':');
      var rel = global.mcGetSectionAsset(parts[0], parseInt(parts[1], 10) || 0);
      if (!rel) continue;
      var url = resolvePoolUrl(rel);
      if (el.tagName === 'IMG') {
        el.src = url;
      } else {
        el.style.backgroundImage = 'url("' + url.replace(/"/g, '%22') + '")';
      }
    }
  }

  global.mcApplySectionPoolImages_ = applyPoolImages;

  function onReady() {
    applyPoolImages();
  }

  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
