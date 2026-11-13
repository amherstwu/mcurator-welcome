/**
 * Product hero — single flip passport card, source chips, guide panel, Earth + parallax.
 */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e0) {
    void 0;
  }

  var GUIDE = {
    front: {
      title: '建立標本護照',
      body: '把標本照片、標籤、學名、產地與採集資訊整理成清楚、可信、可查詢的數位標本護照。',
      bullets: ['整理資料', '建立可信紀錄', '匯出與追溯']
    },
    back: {
      title: '檢視背面資料',
      body: '查看 SAT ID、分類階層、授權、審查與匯出狀態，理解這張標本護照如何被驗證與流通。',
      bullets: ['分類階層', '審查狀態', '匯出資訊']
    }
  };

  function getFlipRoot() {
    return document.getElementById('mcHeroPassportFlip');
  }

  function getCardFace(flip) {
    return (flip && flip.getAttribute('data-card-face')) === 'back' ? 'back' : 'front';
  }

  function setCardFace(face) {
    var flip = getFlipRoot();
    var visual = document.getElementById('mcProductHeroVisual');
    if (!flip) return;

    var next = face === 'back' ? 'back' : 'front';
    flip.setAttribute('data-card-face', next);
    if (visual) visual.setAttribute('data-card-face', next);

    var btn = document.getElementById('mcHeroFlipControl');
    if (btn) {
      btn.setAttribute('aria-pressed', next === 'back' ? 'true' : 'false');
      var side = btn.querySelector('[data-flip-side-label]');
      if (side) {
        var onBack = next === 'back';
        side.setAttribute('data-i18n', onBack ? 'lp_cine_flip_side_back' : 'lp_cine_flip_side_front');
        var lang = (document.documentElement && document.documentElement.lang) || 'zh';
        var en = String(lang).toLowerCase().indexOf('en') === 0;
        side.textContent = onBack ? (en ? 'BACK' : '背面') : en ? 'FRONT' : '正面';
      }
    }

    updateGuide(next);
  }

  function toggleCardFace() {
    var flip = getFlipRoot();
    if (!flip) return;

    if (!reduceMotion) {
      flip.classList.add('is-flipping');
      window.setTimeout(function () {
        flip.classList.remove('is-flipping');
      }, 860);
    }

    setCardFace(getCardFace(flip) === 'back' ? 'front' : 'back');
  }

  function updateGuide(faceKey) {
    var guide = document.getElementById('mcProductHeroGuide');
    if (!guide) return;

    var data = GUIDE[faceKey] || GUIDE.front;
    var title = guide.querySelector('[data-guide-title]');
    var body = guide.querySelector('[data-guide-body]');
    var bullets = guide.querySelector('[data-guide-bullets]');

    guide.classList.add('is-updating');
    window.setTimeout(function () {
      if (title) title.textContent = data.title;
      if (body) body.textContent = data.body;
      if (bullets) {
        bullets.innerHTML = data.bullets
          .map(function (item) {
            return '<li>' + item + '</li>';
          })
          .join('');
      }
      guide.classList.remove('is-updating');
    }, reduceMotion ? 0 : 120);
  }

  function initSourceChips(visual) {
    var chips = visual.querySelectorAll('.mc-source-chip[data-source]');
    if (!chips.length) return;

    function setSource(source, persist) {
      if (!source) return;
      visual.setAttribute('data-active-source', source);
      if (persist) visual.setAttribute('data-input-focus', source);
      chips.forEach(function (item) {
        var on = item.getAttribute('data-source') === source && persist;
        item.classList.toggle('is-active', on);
        item.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('mouseenter', function () {
        setSource(chip.getAttribute('data-source') || '', false);
      });
      chip.addEventListener('focus', function () {
        setSource(chip.getAttribute('data-source') || '', false);
      });
      chip.addEventListener('click', function () {
        var source = chip.getAttribute('data-source') || '';
        setSource(source, true);
        if (source === 'label') {
          setCardFace('back');
        } else if (source === 'photo') {
          setCardFace('front');
        } else {
          var flip = getFlipRoot();
          if (getCardFace(flip) === 'front') {
            /* locality highlights on front meta */
          } else {
            setCardFace('back');
          }
        }
      });
      chip.addEventListener('mouseleave', function () {
        if (!visual.matches(':hover') && !visual.getAttribute('data-input-focus')) {
          visual.removeAttribute('data-active-source');
        } else if (visual.getAttribute('data-input-focus')) {
          visual.setAttribute('data-active-source', visual.getAttribute('data-input-focus'));
        }
      });
      chip.addEventListener('blur', function () {
        if (visual.getAttribute('data-input-focus')) {
          visual.setAttribute('data-active-source', visual.getAttribute('data-input-focus'));
        } else {
          visual.removeAttribute('data-active-source');
        }
      });
    });

    visual.addEventListener('mouseleave', function () {
      if (visual.getAttribute('data-input-focus')) {
        visual.setAttribute('data-active-source', visual.getAttribute('data-input-focus'));
      } else {
        visual.removeAttribute('data-active-source');
      }
    });
  }

  function initFlipControl() {
    var btn = document.getElementById('mcHeroFlipControl');
    if (!btn) return;
    btn.addEventListener('click', function () {
      toggleCardFace();
    });
  }

  function initCardTilt() {
    if (reduceMotion) return;

    var flip = getFlipRoot();
    var tilt = document.getElementById('mcHeroPassportTilt');
    if (!flip || !tilt) return;

    flip.addEventListener('mousemove', function (ev) {
      var rect = flip.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var px = (ev.clientX - rect.left) / rect.width - 0.5;
      var py = (ev.clientY - rect.top) / rect.height - 0.5;
      tilt.style.setProperty('--tilt-x', (py * -6).toFixed(2) + 'deg');
      tilt.style.setProperty('--tilt-y', (px * 9).toFixed(2) + 'deg');
      flip.classList.add('is-hover-lift');
    });

    flip.addEventListener('mouseleave', function () {
      tilt.style.setProperty('--tilt-x', '0deg');
      tilt.style.setProperty('--tilt-y', '0deg');
      flip.classList.remove('is-hover-lift');
    });
  }

  function initStageParallax() {
    if (reduceMotion) return;

    var visual = document.getElementById('mcProductHeroVisual');
    var stage = document.getElementById('mcCineShowcase');
    if (!visual || !stage) return;

    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;
    var raf = 0;

    function tick() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      stage.style.setProperty('--parallax-x', currentX.toFixed(2) + 'px');
      stage.style.setProperty('--parallax-y', currentY.toFixed(2) + 'px');

      if (Math.abs(targetX - currentX) > 0.04 || Math.abs(targetY - currentY) > 0.04) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    function queue() {
      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    visual.addEventListener('mousemove', function (ev) {
      var rect = stage.getBoundingClientRect();
      if (!rect.width) return;
      targetX = ((ev.clientX - rect.left) / rect.width - 0.5) * 8;
      targetY = ((ev.clientY - rect.top) / rect.height - 0.5) * 5;
      queue();
    });

    visual.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      queue();
    });
  }

  function init() {
    var visual = document.getElementById('mcProductHeroVisual');
    var flip = getFlipRoot();

    if (flip) {
      setCardFace('front');
      initFlipControl();
      initCardTilt();
    }

    if (visual) initSourceChips(visual);
    initStageParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
