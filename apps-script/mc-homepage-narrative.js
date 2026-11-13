/**
 * Homepage narrative: coverflow filters, optional legacy passport card IO, interactive story tail (S3–S5).
 */
(function () {
  'use strict';

  function q(root, sel) {
    return (root || document).querySelector(sel);
  }
  function qa(root, sel) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function isZh() {
    try {
      if (typeof window.mcIsZhTW === 'function') return window.mcIsZhTW();
      if (typeof window.mcGetLang === 'function') return window.mcGetLang() === 'zh-TW';
    } catch (eMc) {
      void 0;
    }
    try {
      if (typeof state !== 'undefined' && state && state.lang === 'zh-TW') return true;
      if (window.MC_LOCALE === 'zh-TW') return true;
      var s = localStorage.getItem('MC_USER_LANG');
      if (s === 'en') return false;
      if (s === 'zh-TW') return true;
    } catch (e0) {
      void 0;
    }
    return true;
  }

  function L(zh, en) {
    return isZh() ? zh : en;
  }

  function reviewLabelsForIntro() {
    return {
      incomplete: L('待補齊', 'Pending'),
      reviewing: L('審核中', 'Reviewing'),
      verified: L('已驗證', 'Verified'),
    };
  }

  function initCoverflowFilters() {
    var nav = document.querySelector('.specimen-coverflow-filters');
    if (!nav || nav.getAttribute('data-mc-home-filters') === '1') return;
    nav.setAttribute('data-mc-home-filters', '1');
    nav.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-mc-home-filter]');
      if (!btn || !nav.contains(btn)) return;
      qa(nav, 'button[data-mc-home-filter]').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
    });
  }

  function initStoryIO() {
    var story = document.getElementById('mcHomeStory');
    if (!story) return;
    var card = document.getElementById('mcHomePassportCard');
    if (!card) return;

    var meterFill = q(card, '[data-mc-meter-fill]');
    var meterVal = q(card, '[data-mc-meter-val]');
    var badge = q(card, '.mc-home-passport__badge');

    var reduceMotion = false;
    try {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      void 0;
    }

    var ioOpts = { root: null, rootMargin: reduceMotion ? '0px' : '-18% 0px -32% 0px', threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] };

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || en.intersectionRatio < 0.2) return;
        var el = en.target;
        var phase = el.getAttribute('data-mc-home-io');
        if (phase) card.setAttribute('data-mc-phase', phase);
        var meter = el.getAttribute('data-mc-home-meter');
        if (meter) {
          card.setAttribute('data-mc-meter', meter);
          if (meterVal) meterVal.textContent = meter + '%';
          if (meterFill) meterFill.style.width = meter + '%';
        }
        var rev = el.getAttribute('data-mc-home-review');
        if (rev) {
          card.setAttribute('data-mc-review', rev);
          if (badge) badge.textContent = reviewLabelsForIntro()[rev] || rev;
        }
      });
    }, ioOpts);

    qa(story, '[data-mc-home-io], [data-mc-home-meter], [data-mc-home-review]').forEach(function (el) {
      if (el.closest && el.closest('.mc-home-story__tail')) return;
      obs.observe(el);
    });
  }

  /** Virtual museum: shelve demo passport + interactive advantage / usage panels */
  function initVirtualMuseumAsset() {
    var root = document.getElementById('mcVirtualMuseumAsset');
    if (!root || root.getAttribute('data-mc-vm-init') === '1') return;
    root.setAttribute('data-mc-vm-init', '1');

    function isZhVm() {
      return isZh();
    }

    var STR = {
      cabFull: isZhVm()
        ? '六格已滿，可按下「重新示範」再體驗一次上架流程。'
        : 'All six slots are filled. Press Reset demo to try again.',
      slotEmpty: L('空格 · 可典藏', 'Empty slot · ready to shelve'),
      slotFilled: L('已典藏 · Papilio blumei（示範）', 'Shelved · Papilio blumei (demo)'),
    };

    var slots = qa(root, '[data-mc-vm-slot]');
    var passport = document.getElementById('mcVmPassportCard');
    var collectBtn = document.getElementById('mcVmCollectBtn');
    var resetBtn = document.getElementById('mcVmResetBtn');
    var countEl = document.getElementById('mcVmFilledCount');
    var hintEl = document.getElementById('mcVmCabHint');
    var hintOrig = hintEl ? String(hintEl.textContent || '').trim() : '';
    if (hintEl && hintEl.getAttribute('data-i18n')) {
      root.setAttribute('data-mc-vm-hint-key', hintEl.getAttribute('data-i18n'));
    }

    var filled = [false, false, false, false, false, false];

    function filledCount() {
      var n = 0;
      for (var i = 0; i < filled.length; i++) {
        if (filled[i]) n++;
      }
      return n;
    }

    function syncCount() {
      if (countEl) countEl.textContent = String(filledCount());
    }

    function setHintFull(isFull) {
      if (!hintEl) return;
      hintEl.textContent = isFull
        ? L('六格已滿，可按下「重新示範」再體驗一次上架流程。', 'All six slots are filled. Press Reset demo to try again.')
        : hintOrig;
    }

    function thumbHtml() {
      var img = passport && passport.querySelector('img');
      var src =
        img && img.getAttribute('src')
          ? String(img.getAttribute('src'))
          : '../assets/images/landing_page/papilio-blumei-hero.jpg';
      return (
        '<span class="mc-vm-asset__slotThumb"><img src="' +
        src.replace(/"/g, '&quot;') +
        '" alt="" loading="lazy" decoding="async" width="120" height="90" /></span>'
      );
    }

    function renderSlot(i) {
      var s = slots[i];
      if (!s) return;
      if (filled[i]) {
        s.classList.add('is-filled');
        s.setAttribute('data-mc-vm-empty', '0');
        s.setAttribute('aria-label', STR.slotFilled);
        s.innerHTML =
          '<span class="mc-vm-asset__slotInner" aria-hidden="true">' +
          thumbHtml() +
          '<span class="mc-vm-asset__slotCheck" aria-hidden="true">✓</span>' +
          '</span>';
      } else {
        s.classList.remove('is-filled');
        s.setAttribute('data-mc-vm-empty', '1');
        s.setAttribute('aria-label', STR.slotEmpty);
        s.innerHTML = '';
      }
    }

    function fillAtIndex(i) {
      if (i < 0 || i >= filled.length || filled[i]) return false;
      filled[i] = true;
      renderSlot(i);
      syncCount();
      root.classList.add('mc-vm-asset--pulse');
      window.setTimeout(function () {
        root.classList.remove('mc-vm-asset--pulse');
      }, 520);
      if (filledCount() >= 6) setHintFull(true);
      return true;
    }

    function fillNext() {
      for (var i = 0; i < filled.length; i++) {
        if (!filled[i]) return fillAtIndex(i);
      }
      return false;
    }

    function resetAll() {
      for (var i = 0; i < filled.length; i++) {
        filled[i] = false;
        renderSlot(i);
      }
      syncCount();
      setHintFull(false);
    }

    slots.forEach(function (s, i) {
      renderSlot(i);
      s.addEventListener('click', function () {
        if (!filled[i]) fillAtIndex(i);
      });
      s.addEventListener('dragover', function (ev) {
        if (filled[i]) return;
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'copy';
        s.classList.add('is-droptarget');
      });
      s.addEventListener('dragleave', function () {
        s.classList.remove('is-droptarget');
      });
      s.addEventListener('drop', function (ev) {
        ev.preventDefault();
        s.classList.remove('is-droptarget');
        if (!filled[i]) fillAtIndex(i);
      });
    });

    if (passport) {
      passport.addEventListener('dragstart', function (ev) {
        try {
          ev.dataTransfer.setData('text/plain', 'mc-vm-passport');
          ev.dataTransfer.effectAllowed = 'copy';
        } catch (e1) {
          void 0;
        }
        passport.setAttribute('aria-grabbed', 'true');
        root.classList.add('mc-vm-asset--drag');
      });
      passport.addEventListener('dragend', function () {
        passport.setAttribute('aria-grabbed', 'false');
        root.classList.remove('mc-vm-asset--drag');
        slots.forEach(function (s) {
          s.classList.remove('is-droptarget');
        });
      });
    }

    if (collectBtn) {
      collectBtn.addEventListener('click', function () {
        fillNext();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        resetAll();
      });
    }

    /* Advantage tabs */
    var advTabs = qa(root, '[data-mc-vm-adv]');
    var advPanes = qa(root, '[data-mc-vm-adv-pane]');
    function setAdv(key) {
      advTabs.forEach(function (b) {
        var on = b.getAttribute('data-mc-vm-adv') === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      advPanes.forEach(function (p) {
        var on = p.getAttribute('data-mc-vm-adv-pane') === key;
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('hidden');
        else p.setAttribute('hidden', 'hidden');
      });
    }
    advTabs.forEach(function (b) {
      b.addEventListener('click', function () {
        setAdv(b.getAttribute('data-mc-vm-adv') || 'trace');
      });
    });
    setAdv('trace');

    /* Use-case chips */
    var useBtns = qa(root, '[data-mc-vm-use]');
    var usePanes = qa(root, '[data-mc-vm-use-pane]');
    function setUse(key) {
      useBtns.forEach(function (b) {
        var on = b.getAttribute('data-mc-vm-use') === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      usePanes.forEach(function (p) {
        var on = p.getAttribute('data-mc-vm-use-pane') === key;
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('hidden');
        else p.setAttribute('hidden', 'hidden');
      });
    }
    useBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        setUse(b.getAttribute('data-mc-vm-use') || 'search');
      });
    });
    setUse('search');

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (ents) {
          ents.forEach(function (en) {
            if (en.isIntersecting) root.classList.add('is-inview');
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
      );
      io.observe(root);
    } else {
      root.classList.add('is-inview');
    }

    syncCount();
  }

  function initHomeStoryTail() {
    var tail = document.querySelector('.mc-home-story__tail');
    if (!tail || tail.getAttribute('data-mc-tail-init') === '1') return;
    tail.setAttribute('data-mc-tail-init', '1');

    var finePointer = true;
    try {
      finePointer = window.matchMedia('(pointer: fine)').matches;
    } catch (e) {
      void 0;
    }

    var chapters = qa(tail, '.mc-home-chapter--interactive');
    if (chapters.length) {
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) en.target.classList.add('is-visible');
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );
        chapters.forEach(function (ch) {
          io.observe(ch);
        });
      } else {
        chapters.forEach(function (ch) {
          ch.classList.add('is-visible');
        });
      }
    }

    function s3DekTextMap() {
      return {
        40: L(
          '已有影像與工作名稱的初稿紀錄 — 在工作區即可搜尋。',
          'Stub record with image and working name — already discoverable in your workspace.'
        ),
        70: L(
          '分類、產地、媒體與參考文獻對齊 — 可跨資料集與機構比對。',
          'Taxonomy, locality, media, and references align — comparable across datasets and institutions.'
        ),
        100: L(
          '可引用的中繼資料、匯出、展覽標籤與 SAT 身份 — 就緒供研究與典藏使用。',
          'Citation-ready metadata, exports, exhibition labels, and SAT identity — ready for research and collections.'
        ),
      };
    }

    var s3Fields = {
      40: { photo: 'on', taxonomy: 'partial', locality: 'off', sources: 'off', review: 'off', export: 'off' },
      70: { photo: 'on', taxonomy: 'on', locality: 'on', sources: 'on', review: 'off', export: 'off' },
      100: { photo: 'on', taxonomy: 'on', locality: 'on', sources: 'on', review: 'on', export: 'on' }
    };

    var s3root = document.getElementById('mcHomeS3');
    if (s3root) {
      var s3prev = document.getElementById('mcHomeS3Preview');
      var s3btns = qa(s3root, 'button[data-mc-home-meter]');
      function applyS3(meterStr) {
        var pct = parseInt(meterStr, 10);
        if (isNaN(pct)) return;
        if (s3prev) {
          s3prev.setAttribute('data-mc-meter', String(pct));
          var fill = s3prev.querySelector('[data-mc-meter-fill]');
          var val = s3prev.querySelector('[data-mc-meter-val]');
          if (fill) fill.style.width = pct + '%';
          if (val) val.textContent = pct + '%';
          var dek = s3prev.querySelector('[data-mc-s3-dek]');
          if (dek) dek.textContent = s3DekTextMap()[pct] || '';
          var fmap = s3Fields[pct];
          if (fmap) {
            qa(s3prev, '[data-mc-field]').forEach(function (li) {
              var k = li.getAttribute('data-mc-field');
              var st = fmap[k] || 'off';
              li.classList.remove('is-on', 'is-partial');
              if (st === 'on') li.classList.add('is-on');
              else if (st === 'partial') li.classList.add('is-partial');
            });
          }
        }
        s3btns.forEach(function (b) {
          var m = b.getAttribute('data-mc-home-meter');
          var on = m === String(pct);
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }
      s3btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          applyS3(btn.getAttribute('data-mc-home-meter'));
        });
        if (finePointer) {
          btn.addEventListener('mouseenter', function () {
            applyS3(btn.getAttribute('data-mc-home-meter'));
          });
        }
      });
      applyS3('40');
    }

    function s4copyMap() {
      return {
        incomplete: {
          flow: 'incomplete',
          badge: L('草稿', 'Draft'),
          lead: L('私人工作區 · 關鍵欄位尚待補齊', 'Private workspace · key fields still open'),
        },
        reviewing: {
          flow: 'reviewing',
          badge: L('審核中', 'Reviewing'),
          lead: L(
            '策展人與同儕審查學名、產地、媒體與來源後再發布',
            'Curators and peers examine names, locality, media, and sources before promotion'
          ),
        },
        verified: {
          flow: 'verified',
          badge: L('已驗證', 'Verified'),
          lead: L(
            '就緒供展覽標籤、資料集、正式引用與 SAT 資產流程',
            'Ready for exhibition labels, datasets, formal citation, and SAT asset flows'
          ),
        },
      };
    }

    var s4root = document.getElementById('mcHomeS4');
    if (s4root) {
      var s4prev = document.getElementById('mcHomeS4Preview');
      var s4btns = qa(s4root, 'button[data-mc-home-review]');
      var s4nodes = s4prev ? qa(s4prev, '.mc-home-reviewTimeline__node') : [];
      function applyS4(rev) {
        var info = s4copyMap()[rev];
        if (!info || !s4prev) return;
        s4prev.setAttribute('data-mc-review-flow', info.flow);
        var badgeEl = s4prev.querySelector('[data-mc-review-badge]');
        var leadEl = s4prev.querySelector('[data-mc-review-lead]');
        if (badgeEl) badgeEl.textContent = info.badge;
        if (leadEl) leadEl.textContent = info.lead;
        s4nodes.forEach(function (n) {
          n.classList.remove('is-active', 'is-done');
        });
        if (rev === 'incomplete') {
          if (s4nodes[0]) s4nodes[0].classList.add('is-active');
        } else if (rev === 'reviewing') {
          if (s4nodes[0]) s4nodes[0].classList.add('is-done');
          if (s4nodes[1]) s4nodes[1].classList.add('is-active');
        } else if (rev === 'verified') {
          if (s4nodes[0]) s4nodes[0].classList.add('is-done');
          if (s4nodes[1]) s4nodes[1].classList.add('is-done');
          if (s4nodes[2]) s4nodes[2].classList.add('is-done');
          if (s4nodes[3]) s4nodes[3].classList.add('is-active');
        }
        s4btns.forEach(function (b) {
          var r = b.getAttribute('data-mc-home-review');
          var on = r === rev;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }
      s4btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          applyS4(btn.getAttribute('data-mc-home-review'));
        });
        if (finePointer) {
          btn.addEventListener('mouseenter', function () {
            applyS4(btn.getAttribute('data-mc-home-review'));
          });
        }
      });
      applyS4('incomplete');
    }

    window.refreshMcHomeStoryTailI18n = function () {
      var activeS3 = document.querySelector('#mcHomeS3 button[data-mc-home-meter].is-active');
      if (activeS3) applyS3(activeS3.getAttribute('data-mc-home-meter'));
      var activeS4 = document.querySelector('#mcHomeS4 button[data-mc-home-review].is-active');
      if (activeS4) applyS4(activeS4.getAttribute('data-mc-home-review'));
    };

    var cab = document.getElementById('mcHomeCabinet');
    if (cab) {
      var filtBtns = qa(cab, '[data-mc-cabinet-filter]');
      var cards = qa(cab, '.mc-home-cabinetCard');
      function applyCabFilter(key) {
        filtBtns.forEach(function (b) {
          var on = b.getAttribute('data-mc-cabinet-filter') === key;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        cards.forEach(function (card) {
          var tags = (card.getAttribute('data-mc-cabinet-tags') || '').toLowerCase().split(/\s+/).filter(Boolean);
          var show = key === 'all' || tags.indexOf(key) !== -1;
          card.classList.toggle('is-hidden', !show);
        });
      }
      filtBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          applyCabFilter(btn.getAttribute('data-mc-cabinet-filter') || 'all');
        });
      });
      applyCabFilter('all');
    }
  }

  function boot() {
    initCoverflowFilters();
    initStoryIO();
    initVirtualMuseumAsset();
    initHomeStoryTail();
  }

  function onLocaleChange() {
    try {
      if (typeof window.refreshMcHomeStoryTailI18n === 'function') {
        window.refreshMcHomeStoryTailI18n();
      }
    } catch (eTail) {
      void 0;
    }
    try {
      var root = document.getElementById('mcVirtualMuseumAsset');
      if (root && root.getAttribute('data-mc-vm-init') === '1') {
        var hintEl = document.getElementById('mcVmCabHint');
        var hintOrigKey = root.getAttribute('data-mc-vm-hint-key');
        if (hintEl && hintOrigKey && typeof window.MCt === 'function') {
          hintEl.textContent = window.MCt(hintOrigKey);
        }
        qa(root, '[data-mc-vm-slot]').forEach(function (s) {
          var empty = s.getAttribute('data-mc-vm-empty') === '1';
          s.setAttribute(
            'aria-label',
            empty ? L('空格 · 可典藏', 'Empty slot · ready to shelve') : L('已典藏 · Papilio blumei（示範）', 'Shelved · Papilio blumei (demo)')
          );
        });
      } else {
        initVirtualMuseumAsset();
      }
    } catch (e0) {
      void 0;
    }
    try {
      var card = document.getElementById('mcHomePassportCard');
      if (card) {
        var badge = card.querySelector('.mc-home-passport__badge');
        var rev = card.getAttribute('data-mc-review');
        if (badge && rev) badge.textContent = reviewLabelsForIntro()[rev] || rev;
      }
    } catch (e1) {
      void 0;
    }
  }

  window.addEventListener('mc:localechange', onLocaleChange);
  window.addEventListener('mc:locale', onLocaleChange);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
