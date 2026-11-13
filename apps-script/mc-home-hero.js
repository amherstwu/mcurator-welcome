/**
 * MCurator Home Hero — Earth motion, passport tilt & flip
 */
(function () {
  'use strict';

  var MAX_TILT_Y = 8;
  var MAX_TILT_X = 6;
  var BASE_ROT_Y = -6;
  var BASE_ROT_X = 2;

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function isCoarsePointer() {
    try {
      return window.matchMedia('(pointer: coarse)').matches;
    } catch (e) {
      return false;
    }
  }

  function initEarth(hero) {
    if (!prefersReducedMotion()) return;
    var strip = hero.querySelector('.mc-home-hero__earthStrip');
    var wrap = hero.querySelector('.mc-home-hero__earthWrap');
    if (strip) strip.style.animation = 'none';
    if (wrap) wrap.style.animation = 'none';
  }

  function initPassportCard(hero) {
    var card = hero.querySelector('#mcHeroPassportCard');
    var flipBtn = hero.querySelector('.mc-passport-flipHint');
    var sampleBtn = document.getElementById('btnWelcomeHeroStart');
    if (!card) return;

    var faces = card.querySelectorAll('.mc-passport-face');
    var reduce = prefersReducedMotion();
    var coarse = isCoarsePointer();

    function setFlipped(on) {
      card.classList.toggle('is-flipped', on);
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
      card.setAttribute('data-side', on ? 'back' : 'front');
    }

    function toggleFlip() {
      setFlipped(!card.classList.contains('is-flipped'));
    }

    card.addEventListener('click', function (e) {
      if (e.target.closest('.mc-passport-flipHint')) return;
      toggleFlip();
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    });

    if (flipBtn) {
      flipBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleFlip();
      });
    }

    if (sampleBtn) {
      sampleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleFlip();
      });
    }

    if (reduce || coarse) return;

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      var rotY = BASE_ROT_Y + px * MAX_TILT_Y * 2;
      var rotX = BASE_ROT_X - py * MAX_TILT_X * 2;
      var mx = (50 + px * 40).toFixed(1) + '%';
      var my = (20 + py * 30).toFixed(1) + '%';

      card.classList.add('is-tilting');
      card.style.transform =
        'translate(-50%, -50%) rotateY(' + rotY + 'deg) rotateX(' + rotX + 'deg)';

      for (var i = 0; i < faces.length; i++) {
        faces[i].style.setProperty('--mx', mx);
        faces[i].style.setProperty('--my', my);
      }
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('is-tilting');
      card.style.transform = '';
    });
  }

  function init() {
    var hero = document.querySelector('#mcWelcomeHero[data-mc-hero-layout="home-v2"]');
    if (!hero) return;
    initEarth(hero);
    initPassportCard(hero);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
