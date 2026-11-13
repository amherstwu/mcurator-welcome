/**
 * MCurator Hero v3 — Orbital Passport
 */
(function () {
  'use strict';

  var ROOT = '#mcWelcomeHero[data-mc-hero-layout="hero-v3"]';
  var reduceMotion = false;

  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    void 0;
  }

  var HINTS = {
    photo: '建立標本護照',
    label: '辨識標籤資訊',
    locality: '建立產地與來源',
    export: '匯出與追溯'
  };

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function PassportCard(hero) {
    this.hero = hero;
    this.el = qs('#mchCard', hero);
    this.cube = qs('.mch-card__cube', this.el);
    this.flipBtn = qs('#mchFlip', hero);
    this.sideTag = qs('[data-flip-tag]', hero);
    this.face = 'front';
    this._bind();
  }

  PassportCard.prototype.setFace = function (face, silent) {
    if (!this.el) return;
    var next = face === 'back' ? 'back' : 'front';
    this.face = next;
    this.el.setAttribute('data-face', next);
    if (this.flipBtn) this.flipBtn.setAttribute('aria-pressed', next === 'back' ? 'true' : 'false');
    if (this.sideTag) {
      var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
      this.sideTag.textContent = next === 'back' ? (en ? 'BACK' : '背面') : en ? 'FRONT' : '正面';
    }
    if (!silent && next === 'back') {
      this.hero.setAttribute('data-zone', 'export');
      var hint = qs('[data-hint]', this.hero);
      if (hint) hint.textContent = HINTS.export;
      qsa('.mch-rail__btn', this.hero).forEach(function (b) {
        var on = b.getAttribute('data-zone') === 'export';
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
  };

  PassportCard.prototype.toggle = function () {
    this.setFace(this.face === 'back' ? 'front' : 'back');
  };

  PassportCard.prototype._bind = function () {
    var self = this;
    if (!this.el) return;

    if (this.flipBtn) {
      this.flipBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.toggle();
      });
    }

    this.el.addEventListener('click', function () {
      self.toggle();
    });

    this.el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        self.toggle();
      }
    });

    if (reduceMotion) return;

    this.el.addEventListener('mousemove', function (e) {
      var r = self.el.getBoundingClientRect();
      if (!r.width) return;
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      self.el.style.setProperty('--rx', (py * -7).toFixed(2) + 'deg');
      self.el.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg');
      self.el.classList.add('is-tilt');
    });

    this.el.addEventListener('mouseleave', function () {
      self.el.style.setProperty('--rx', '0deg');
      self.el.style.setProperty('--ry', '0deg');
      self.el.classList.remove('is-tilt');
    });
  };

  function ZoneRail(hero, card) {
    this.hero = hero;
    this.card = card;
    this.btns = qsa('.mch-rail__btn', hero);
    this.hint = qs('[data-hint]', hero);
    this._bind();
  }

  ZoneRail.prototype.activate = function (zone, persist) {
    if (!HINTS[zone]) zone = 'photo';
    this.hero.setAttribute('data-zone', zone);
    if (this.hint) this.hint.textContent = HINTS[zone];
    this.btns.forEach(function (btn) {
      var on = btn.getAttribute('data-zone') === zone && persist;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (zone === 'export') {
      this.card.setFace('back', true);
    } else if (this.card.face === 'back') {
      this.card.setFace('front', true);
    }
  };

  ZoneRail.prototype._bind = function () {
    var self = this;
    var locked = 'photo';

    this.btns.forEach(function (btn) {
      var zone = btn.getAttribute('data-zone') || 'photo';

      btn.addEventListener('mouseenter', function () {
        self.hero.setAttribute('data-zone', zone);
      });

      btn.addEventListener('mouseleave', function () {
        self.hero.setAttribute('data-zone', locked);
      });

      btn.addEventListener('click', function () {
        locked = zone;
        self.activate(zone, true);
      });
    });

    this.activate('photo', true);
  };

  function init() {
    var hero = qs(ROOT);
    if (!hero) return;

    var card = new PassportCard(hero);
    new ZoneRail(hero, card);
    card.setFace('front', true);
    hero.setAttribute('data-zone', 'photo');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
