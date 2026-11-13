/**
 * Vitrine hero — pipeline steps highlight regions on #mcProductHeroPassport
 */
(function () {
  'use strict';

  var ROOT = '#mcWelcomeHero[data-mc-hero-layout="vitrine"]';

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function Pipeline(hero) {
    this.hero = hero;
    this.card = qs('#mcProductHeroPassport', hero);
    this.steps = qsa('.mc-hero-vitrine__step', hero);
    this._bind();
  }

  Pipeline.prototype.activate = function (zone, lock) {
    if (!zone) zone = 'photo';
    this.hero.setAttribute('data-zone', zone);
    this.steps.forEach(function (step) {
      var on = step.getAttribute('data-zone') === zone && lock;
      step.classList.toggle('is-on', on);
      step.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (this.card) {
      if (zone === 'passport' || zone === 'export') {
        this.card.classList.add('is-flipped');
      } else {
        this.card.classList.remove('is-flipped');
      }
    }
  };

  Pipeline.prototype._bind = function () {
    var self = this;
    var locked = 'photo';

    this.steps.forEach(function (step) {
      var zone = step.getAttribute('data-zone') || 'photo';
      step.addEventListener('mouseenter', function () {
        self.hero.setAttribute('data-zone', zone);
        self.steps.forEach(function (s) {
          s.classList.toggle('is-on', s.getAttribute('data-zone') === zone);
        });
      });
      step.addEventListener('mouseleave', function () {
        self.activate(locked, true);
      });
      step.addEventListener('click', function () {
        locked = zone;
        self.activate(zone, true);
      });
    });

    this.activate('photo', true);
  };

  function init() {
    var hero = qs(ROOT);
    if (!hero) return;
    new Pipeline(hero);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
