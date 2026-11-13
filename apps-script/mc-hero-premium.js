/**
 * Premium hero — passport card tilt, flip, specimen deck
 */
(function (global) {
  'use strict';

  function poolPhoto(sectionId, variant) {
    if (typeof global.mcGetSectionAsset === 'function') {
      var rel = global.mcGetSectionAsset(sectionId, variant);
      if (rel) return '../' + rel;
    }
    return '';
  }

  var ROOT = '#mcWelcomeHero[data-mc-hero-layout="premium"]';
  var DECK = [
    {
      sci: 'Troides helena',
      common: 'Common birdwing butterfly',
      family: 'PAPILIONIDAE',
      id: 'MCU-2024-000123',
      sat: 'SAT-MCU-2024-000123',
      photo: poolPhoto('landing-hero', 1),
      alt: 'Troides helena',
      locality: 'Indonesia, West Papua',
      coords: '1.1234° S, 132.5678° E',
      date: '2024-05-12',
      habitat: 'Lowland Rainforest',
      elevation: '420 m',
      collector: 'A. M. Curator',
      method: 'Hand Net',
      taxonomy: 'Animalia → Arthropoda → Insecta → Lepidoptera',
      export: 'QR / CSV / JSON ready'
    },
    {
      sci: 'Allotopus moellenkampi moseri',
      common: 'Golden stag beetle',
      family: 'LUCANIDAE',
      id: 'MC-64101',
      sat: 'SAT-MC-000601',
      photo: '../assets/images/Specimen/photos/Allotopus%20moellenkampi%20moseri.png',
      alt: 'Allotopus moellenkampi moseri',
      locality: '馬來西亞・露霧',
      coords: '—',
      date: '2018/09/12',
      habitat: 'Lowland forest',
      elevation: '—',
      collector: 'MCurator Studio',
      method: '—',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae',
      export: 'CSV / JSON'
    }
  ];

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    void 0;
  }

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function fillCard(card, data) {
    if (!card || !data) return;
    var img = qs('.mchp-card__photo img', card);
    if (img) {
      img.src = data.photo;
      img.alt = data.alt;
    }
    var sci = qs('[data-mchp="sci"]', card);
    if (sci) sci.textContent = data.sci;
    var common = qs('[data-mchp="common"]', card);
    if (common) common.textContent = data.common;
    var family = qs('[data-mchp="family"]', card);
    if (family) family.textContent = data.family;
    var id = qs('[data-mchp="id"]', card);
    if (id) id.textContent = data.id;
    var sat = qs('[data-mchp="sat"]', card);
    if (sat) sat.textContent = data.sat;
    qsa('[data-mchp-field]', card).forEach(function (el) {
      var key = el.getAttribute('data-mchp-field');
      if (data[key] != null) el.textContent = data[key];
    });
    var tax = qs('[data-mchp="taxonomy"]', card);
    if (tax) tax.textContent = data.taxonomy;
    var exp = qs('[data-mchp="export"]', card);
    if (exp) exp.textContent = data.export;
  }

  function PremiumCard(hero) {
    this.hero = hero;
    this.card = qs('#mcHeroPremiumCard', hero);
    this.index = 0;
    this.flipped = false;
    this._bind();
    this.show(0, true);
  }

  PremiumCard.prototype.show = function (idx, silent) {
    idx = ((idx % DECK.length) + DECK.length) % DECK.length;
    this.index = idx;
    fillCard(this.card, DECK[idx]);
    if (!silent && this.card) {
      this.card.classList.add('is-switching');
      var self = this;
      window.setTimeout(function () {
        self.card.classList.remove('is-switching');
      }, reduceMotion ? 0 : 380);
    }
    if (this.flipped) this.setFlipped(false);
  };

  PremiumCard.prototype.setFlipped = function (on) {
    this.flipped = !!on;
    if (this.card) this.card.classList.toggle('is-flipped', this.flipped);
  };

  PremiumCard.prototype.toggleFlip = function () {
    this.setFlipped(!this.flipped);
  };

  PremiumCard.prototype.next = function () {
    this.show(this.index + 1);
  };

  PremiumCard.prototype.prev = function () {
    this.show(this.index - 1);
  };

  PremiumCard.prototype._bind = function () {
    var self = this;
    if (!this.card) return;

    this.card.addEventListener('click', function (e) {
      if (e.target.closest('.mc-hero-premium__deckBtn')) return;
      self.toggleFlip();
    });

    this.card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        self.toggleFlip();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        self.prev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        self.next();
      }
    });

    var prev = qs('[data-mchp-prev]', this.hero);
    var next = qs('[data-mchp-next]', this.hero);
    if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); self.prev(); });
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); self.next(); });

    if (reduceMotion) return;

    this.card.addEventListener('mousemove', function (e) {
      var r = self.card.getBoundingClientRect();
      if (!r.width) return;
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      self.card.style.setProperty('--ry', (10 + px * 14).toFixed(2) + 'deg');
      self.card.style.setProperty('--rx', (-4 + py * -10).toFixed(2) + 'deg');
      self.card.style.setProperty('--mx', ((px + 0.5) * 100).toFixed(0));
      self.card.style.setProperty('--my', ((py + 0.5) * 100).toFixed(0));
      self.card.classList.add('is-tilt');
    });

    this.card.addEventListener('mouseleave', function () {
      self.card.style.setProperty('--ry', '10deg');
      self.card.style.setProperty('--rx', '-4deg');
      self.card.classList.remove('is-tilt');
    });

    var startX = 0;
    this.card.addEventListener('touchstart', function (e) {
      if (e.touches[0]) startX = e.touches[0].clientX;
    }, { passive: true });
    this.card.addEventListener('touchend', function (e) {
      if (!e.changedTouches[0]) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) self.next();
      else self.prev();
    });
  };

  function init() {
    var hero = qs(ROOT);
    if (!hero) return;
    new PremiumCard(hero);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
