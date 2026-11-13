/**
 * Welcome hero — earth-search / cinematic orbit (full-viewport Earth, CTAs, scroll hint, search).
 * Scope: #mcWelcomeHero[data-mc-hero-layout="earth-search" | "cinematic-orbit"]
 */
(function () {
  'use strict';

  function byId(id) {
    return document.getElementById(id);
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function scrollToPassportStory(reducedMotion) {
    var target =
      byId('mcPassportStoryRoot') || byId('mcHomeStory') || byId('mcHomeS2') || byId('mcPassportStory');
    if (!target || !target.scrollIntoView) return false;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    return true;
  }

  function bindScrollHint(reducedMotion) {
    var hint = byId('lpScrollHint');
    if (!hint || hint.getAttribute('data-mc-cine-bound') === '1') return;
    hint.setAttribute('data-mc-cine-bound', '1');
    hint.addEventListener('click', function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      scrollToPassportStory(reducedMotion);
    });
  }

  function bindHeroParallax(hero, reducedMotion) {
    if (reducedMotion) return;
    var earth = hero.querySelector('.earth-bg .hero-earth.mcwhe3');
    if (!earth) return;
    var ticking = false;
    function apply() {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      if (rect.height < 32) return;
      var progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      var shift = progress * 14;
      earth.style.setProperty('--mc-cine-earth-parallax', shift.toFixed(2) + 'px');
      earth.style.setProperty('--mc-es-earth-parallax', shift.toFixed(2) + 'px');
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }
    earth.style.willChange = 'transform';
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
  }

  function bindHeroSearch(reducedMotion) {
    var input = byId('lpHeroEarthSearch');
    if (!input || input.getAttribute('data-mc-es-search-bound') === '1') return;
    input.setAttribute('data-mc-es-search-bound', '1');
    input.addEventListener('keydown', function (ev) {
      if (!ev || ev.key !== 'Enter') return;
      if (ev.preventDefault) ev.preventDefault();
      var target =
        byId('welcomeFeatureGridSection') || byId('mcHomeS2') || byId('mcPassportStoryRoot');
      if (!target || !target.scrollIntoView) return;
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  function init() {
    var hero = document.querySelector(
      '#mcWelcomeHero[data-mc-hero-layout="earth-search"], #mcWelcomeHero[data-mc-hero-layout="cinematic-orbit"]'
    );
    if (!hero) return;

    var topnav = byId('welcomeLandingTopbarWrap');
    if (topnav) topnav.classList.add('mc-cine-topnav');

    var reducedMotion = prefersReducedMotion();

    bindScrollHint(reducedMotion);
    bindHeroParallax(hero, reducedMotion);
    if (hero.getAttribute('data-mc-hero-layout') === 'earth-search') {
      bindHeroSearch(reducedMotion);
    }

    window.McWelcomeHeroDemo = window.McWelcomeHeroDemo || {};
    window.McWelcomeHeroDemo.onPrimaryClick = function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      scrollToPassportStory(reducedMotion);
    };
    window.McWelcomeHeroDemo.onSecondaryClick = function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      if (typeof window.applyWelcomeVideo === 'function' && hero.getAttribute('data-mc-hero-gpu-stable') !== '1') {
        try {
          window.applyWelcomeVideo();
        } catch (eVid) {
          void 0;
        }
        var layer = byId('welcomeVideoLayer');
        var vid = byId('welcomeVideoBg');
        if (layer && vid && layer.style.display !== 'none') {
          try {
            vid.muted = false;
            vid.play().catch(function () {
              scrollToPassportStory(reducedMotion);
            });
          } catch (ePlay) {
            scrollToPassportStory(reducedMotion);
          }
          return;
        }
      }
      scrollToPassportStory(reducedMotion);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
