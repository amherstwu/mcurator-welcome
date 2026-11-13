/**
 * Hero Earth — globe-explorer technique (CSS texture scroll).
 * Ref: https://github.com/alexandrayuyi/globe-explorer
 */
(function () {
  'use strict';

  function init() {
    var hero = document.querySelector('#mcWelcomeHero[data-mc-hero-layout="premium"]');
    var globe = document.getElementById('mcHeroGeGlobe');
    if (!hero || !globe) return;

    var strip = globe.querySelector('.mc-ge-globe__strip');
    if (!strip) return;

    var reduce = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      void 0;
    }

    if (reduce) {
      strip.style.animation = 'none';
      var orbit = hero.querySelector('.mc-hero-premium__earthOrbit');
      if (orbit) orbit.style.animation = 'none';
      return;
    }

    strip.style.animationPlayState = 'running';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
