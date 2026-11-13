/**
 * Herbarium workflow bridge — single React mount (#mcHerbariumWorkflowRoot), routes & scroll.
 */
(function (global) {
  'use strict';

  function prefersReducedMotion() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function scrollToWorkflow() {
    var el = document.getElementById('mcHerbariumWorkflowRoot');
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (global.MCHerbariumWorkflow && typeof global.MCHerbariumWorkflow.mount === 'function') {
      global.MCHerbariumWorkflow.mount();
    }
  }

  function goToStage(stage) {
    var n = parseInt(stage, 10);
    if (isNaN(n) || n < 1 || n > 5) return;
    scrollToWorkflow();
    if (global.MCHerbariumWorkflow && typeof global.MCHerbariumWorkflow.goToStage === 'function') {
      global.MCHerbariumWorkflow.goToStage(n);
    } else {
      document.dispatchEvent(
        new CustomEvent('mc-herbarium-workflow:go', { bubbles: true, detail: { stage: n } })
      );
    }
  }

  function parseRouteStage() {
    try {
      var hash = String(global.location.hash || '');
      var m = hash.match(/[?&]stage=(\d)/i) || hash.match(/stage[=\/](\d)/i);
      if (m && m[1]) return parseInt(m[1], 10);
      if (/\/section\/(herbarium|specimen-workflow)/.test(hash)) return 1;
    } catch (eR) {
      void eR;
    }
    return null;
  }

  function init() {
    global.document.addEventListener('mc-herbarium-workflow:mounted', function () {
      var rs = parseRouteStage();
      if (rs && rs >= 1 && rs <= 5) goToStage(rs);
    });

    var routeStage = parseRouteStage();
    if (routeStage) {
      global.setTimeout(function () {
        goToStage(routeStage);
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.MCHerbariumWorkflowBridge = { goToStage: goToStage, scrollToWorkflow: scrollToWorkflow };
})(typeof window !== 'undefined' ? window : globalThis);
