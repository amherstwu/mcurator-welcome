/**
 * Welcome hero — specimen-passport-v1 (mockup layout: CTAs, search, scroll, small Earth).
 * Scope: #mcWelcomeHero[data-mc-hero-layout="specimen-passport-v1"]
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

  function scrollToEl(el, reducedMotion) {
    if (!el || !el.scrollIntoView) return false;
    el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    return true;
  }

  function scrollToPassportStory(reducedMotion) {
    return (
      scrollToEl(byId('mcPassportStoryRoot'), reducedMotion) ||
      scrollToEl(byId('mcHomeStory'), reducedMotion) ||
      scrollToEl(byId('mcHomeS2'), reducedMotion)
    );
  }

  function scrollToDemoExample(reducedMotion) {
    return (
      scrollToEl(byId('welcomeFeatureGridSection'), reducedMotion) ||
      scrollToEl(byId('lp-media'), reducedMotion) ||
      scrollToEl(byId('mcHomeStory'), reducedMotion)
    );
  }

  function scrollBelowHero(reducedMotion) {
    return scrollToPassportStory(reducedMotion) || scrollToDemoExample(reducedMotion);
  }

  function bindScrollHint(reducedMotion) {
    var hint = byId('lpScrollHint');
    if (!hint || hint.getAttribute('data-mc-sp-bound') === '1') return;
    hint.setAttribute('data-mc-sp-bound', '1');
    hint.addEventListener('click', function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      scrollBelowHero(reducedMotion);
    });
  }

  function bindHeroSearch(reducedMotion) {
    var input = byId('lpHeroEarthSearch');
    if (!input || input.getAttribute('data-mc-sp-search-bound') === '1') return;
    input.setAttribute('data-mc-sp-search-bound', '1');
    input.addEventListener('keydown', function (ev) {
      if (!ev || ev.key !== 'Enter') return;
      if (ev.preventDefault) ev.preventDefault();
      var q = String(input.value || '').trim();
      if (q && typeof window.goTo === 'function') {
        try {
          window.goTo('/dashboard/specimen-passports?q=' + encodeURIComponent(q));
          return;
        } catch (eGo) {
          void 0;
        }
      }
      scrollToDemoExample(reducedMotion);
      try {
        input.focus({ preventScroll: true });
      } catch (eFocus) {
        void 0;
      }
    });
  }

  function init() {
    var hero = document.querySelector('#mcWelcomeHero[data-mc-hero-layout="specimen-passport-v1"]');
    if (!hero) return;

    var topnav = byId('welcomeLandingTopbarWrap');
    if (topnav) topnav.classList.add('mc-cine-topnav');

    var reducedMotion = prefersReducedMotion();

    bindScrollHint(reducedMotion);
    bindHeroSearch(reducedMotion);

    window.McWelcomeHeroDemo = window.McWelcomeHeroDemo || {};
    window.McWelcomeHeroDemo.onPrimaryClick = function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      if (typeof window.goTo === 'function') {
        try {
          window.goTo('/section/workflow');
          return;
        } catch (eRoute) {
          void 0;
        }
      }
      scrollToPassportStory(reducedMotion);
    };
    window.McWelcomeHeroDemo.onSecondaryClick = function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      scrollToDemoExample(reducedMotion);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
