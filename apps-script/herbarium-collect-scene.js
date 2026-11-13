/**
 * Herbarium workflow — Stage 1 Collect: pull-down card on enter-view, hero URL resolution.
 */
(function (global) {
  'use strict';

  var HB_HERO_PRIMARY = 'assets/images/herbarium/herbarium-collect-fp-hero.jpg';
  var HB_HERO_FALLBACK =
    typeof global.mcGetSectionAsset === 'function'
      ? global.mcGetSectionAsset('field-collection', 0)
      : 'assets/images/field/field-shoot-fp-hero.jpg';

  function resolveRel(rel) {
    try {
      if (typeof global.mcResolveLocalRelToPage_ === 'function') {
        return global.mcResolveLocalRelToPage_(rel);
      }
      return new URL('../' + String(rel || '').replace(/^\//, ''), global.location.href).href;
    } catch (e) {
      return String(rel || '');
    }
  }

  function prefersReducedMotion() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e2) {
      return false;
    }
  }

  function setHeroBackground(scene, url) {
    var field = scene && scene.querySelector('.hb-collect-scene__field');
    if (!field || !url) return;
    field.style.setProperty('--hb-hero-url', 'url("' + String(url).replace(/"/g, '%22') + '")');
  }

  function probeImage(url, onOk, onFail) {
    var img = new Image();
    img.onload = function () {
      onOk(url);
    };
    img.onerror = function () {
      onFail();
    };
    img.src = url;
  }

  function initHero(scene) {
    var primary = resolveRel(HB_HERO_PRIMARY);
    var fallback = resolveRel(HB_HERO_FALLBACK);
    probeImage(
      primary,
      function (url) {
        setHeroBackground(scene, url);
      },
      function () {
        probeImage(
          fallback,
          function (url2) {
            setHeroBackground(scene, url2);
          },
          function () {
            scene.classList.add('is-hero-missing');
          }
        );
      }
    );
  }

  function initCardDrop(scene) {
    var card = scene.querySelector('[data-hb-card]');
    if (!card) return;

    if (prefersReducedMotion()) {
      scene.classList.add('is-card-revealed', 'is-card-dropped');
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      scene.classList.add('is-card-revealed', 'is-card-dropped');
      return;
    }

    var revealed = false;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (revealed) return;
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
          revealed = true;
          scene.classList.add('is-card-revealed');
          global.setTimeout(function () {
            scene.classList.add('is-card-dropped');
          }, 80);
          observer.disconnect();
        });
      },
      { threshold: [0, 0.2, 0.35, 0.5] }
    );
    observer.observe(scene);
  }

  function init() {
    var scene = document.getElementById('mcHerbariumCollectScene');
    if (!scene || scene.getAttribute('data-hb-init') === '1') return;
    scene.setAttribute('data-hb-init', '1');
    initHero(scene);
    initCardDrop(scene);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.MCHerbariumCollectScene = { init: init, resolveRel: resolveRel };
})(typeof window !== 'undefined' ? window : globalThis);
