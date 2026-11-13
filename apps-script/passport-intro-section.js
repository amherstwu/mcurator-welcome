/**
 * MCurator — Interactive "From Photo to Passport" product block (#mcHomeStory).
 * Bilingual zh-TW / EN, scoped to narrative passport card + intro column.
 */
(function (global) {
  'use strict';

  var passportIntroCopy = {
    zhTW: {
      eyebrow: '從照片到標本護照',
      headline: '一張照片，不只是影像；它保存了身分、時間與地點。',
      subheadline:
        'MCurator 將標本照片、分類學名、採集地、採集者與佐證資料整合成可搜尋、可追溯、可驗證的自然史紀錄。',
      ctaPrimary: '建立標本護照',
      ctaSecondary: '查看互動示範',
      flip: '翻面',
      zoomIn: '放大',
      zoomOut: '縮小',
      reset: '重置',
      inspect: '檢視細節',
      inspectClose: '關閉檢視',
      lock: '鎖定位置',
      unlock: '解除鎖定',
      rotateL: '向左旋轉',
      rotateR: '向右旋轉',
      photoEvidence: '影像證據',
      photoCueTitle: '影像證據與詮釋資料',
      statusPending: '待審核',
      dataCompleteness: '資料完整度',
      localityDt: '採集地',
      dateDt: '日期',
      observerDt: '觀察者／採集者',
      passportIdDt: 'SAT 護照 ID',
      toolbarAria: '標本護照卡片操作',
      langGroupAria: '介面語言',
      stepsAria: '標本護照建立流程',
      cardAria: '互動標本護照示範卡片，可使用翻面、縮放與拖移',
      taxonomyBlock: '分類階層',
      evidenceBlock: '證據檢核',
      exifBlock: 'EXIF / GPS',
      provenanceBlock: '來源與履歷',
      integrityBlock: '資料完整性',
      reviewStatus: '審核狀態',
      verifiedPending: '待複核',
      steps: ['上傳照片', '補齊資料', '生成護照', '建立可追溯紀錄'],
      usps: [
        {
          title: '影像證據',
          titleEn: 'Photo Evidence',
          body:
            '「保留標本被觀察或拍攝當下的真實狀態，包含比例尺、姿態、光線、棲地背景與照片佐證。」',
          bodyEn:
            'Preserves the real encounter behind the specimen, including scale, posture, lighting, habitat context, and photographic evidence.'
        },
        {
          title: '科學身分',
          titleEn: 'Scientific Identity',
          body:
            '「將學名、分類階層、鑑定狀態與參考資料連結起來，讓每件標本不只是圖片，而是可被查證的科學身分。」',
          bodyEn:
            'Links scientific names, taxonomy, identification status, and references so each specimen becomes a verifiable scientific identity, not just an image.'
        },
        {
          title: '地點與時間',
          titleEn: 'Locality & Time',
          body: '「整合採集地、GPS、日期、海拔或水深等資訊，建立標本與真實世界位置的關聯。」',
          bodyEn:
            'Connects each specimen to real-world context through locality, GPS, date, elevation, depth, and field notes.'
        },
        {
          title: '採集者與來源脈絡',
          titleEn: 'Collector & Provenance',
          body: '「記錄採集者、觀察者、來源、轉讓與審核紀錄，形成可追溯的標本履歷。」',
          bodyEn:
            'Records collector, observer, source, transfer, and review history to create a traceable specimen provenance.'
        },
        {
          title: '資料完整度',
          titleEn: 'Data Completeness',
          body:
            '「系統自動檢查照片、學名、地點、日期、來源與佐證欄位，協助使用者補齊關鍵資料。」',
          bodyEn:
            'Automatically checks photos, scientific name, locality, date, source, and evidence fields to help users complete critical data.'
        },
        {
          title: 'SAT 標本護照',
          titleEn: 'SAT Passport',
          body:
            '「每件完成的標本都能生成唯一 SAT Passport ID，作為收藏、展示、交易、研究引用與長期管理的基礎。」',
          bodyEn:
            'Each completed specimen can receive a unique SAT Passport ID for collection, display, trading, research reference, and long-term management.'
        }
      ],
      backTaxList: [
        '界　Animalia',
        '門　Arthropoda',
        '綱　Insecta',
        '目　Lepidoptera',
        '科　Papilionidae',
        '屬　Lamproptera',
        '種　L. meges'
      ],
      evidenceItems: [
        '照片已上傳',
        '比例尺可見',
        '採集地已填',
        '日期已填',
        '採集者已填',
        '分類待複核'
      ],
      exifLine: 'GPS：與採集地一致（示範） · EXIF：日期與紀錄相符',
      provLines: ['影像擷取', '詮釋資料補齊', '護照產生', '等待驗證'],
      integrityScore: '完整性指標（示範）：78 / 100',
      microScale: '偵測到比例尺（示範）',
      microOrient: '標本姿態：側向停棲',
      microEvidence: '照片可作為觀察證據',
      microMeta: '部分詮釋資料仍可補強',
      commonTaxonLine: '綠弄蝶 · 鱗翅目'
    },
    en: {
      eyebrow: 'From Photo to Passport',
      headline: 'A photo is more than an image; it preserves identity, time, and place.',
      subheadline:
        'MCurator transforms specimen photos, taxonomy, locality, collector data, and evidence into searchable, traceable, and verifiable natural history records.',
      ctaPrimary: 'Create Specimen Passport',
      ctaSecondary: 'View Interactive Demo',
      flip: 'Flip',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      reset: 'Reset',
      inspect: 'Inspect Details',
      inspectClose: 'Close Inspect',
      lock: 'Lock Position',
      unlock: 'Unlock',
      rotateL: 'Rotate Left',
      rotateR: 'Rotate Right',
      photoEvidence: 'Photo Evidence',
      photoCueTitle: 'Photo evidence & metadata',
      statusPending: 'Pending Review',
      dataCompleteness: 'Data completeness',
      localityDt: 'Locality',
      dateDt: 'Date',
      observerDt: 'Observer / collector',
      passportIdDt: 'SAT Passport ID',
      toolbarAria: 'Specimen passport card controls',
      langGroupAria: 'Interface language',
      stepsAria: 'Specimen passport workflow',
      cardAria: 'Interactive specimen passport demo — flip, zoom, and drag',
      taxonomyBlock: 'Taxonomy',
      evidenceBlock: 'Evidence checklist',
      exifBlock: 'EXIF / GPS',
      provenanceBlock: 'Provenance',
      integrityBlock: 'Data integrity',
      reviewStatus: 'Review status',
      verifiedPending: 'Pending verification',
      steps: ['Upload Photo', 'Complete Metadata', 'Generate Passport', 'Create Traceable Record'],
      usps: [
        {
          title: 'Photo Evidence',
          titleEn: '影像證據',
          body:
            'Preserves the real encounter behind the specimen, including scale, posture, lighting, habitat context, and photographic evidence.',
          bodyEn:
            '「保留標本被觀察或拍攝當下的真實狀態，包含比例尺、姿態、光線、棲地背景與照片佐證。」'
        },
        {
          title: 'Scientific Identity',
          titleEn: '科學身分',
          body:
            'Links scientific names, taxonomy, identification status, and references so each specimen becomes a verifiable scientific identity, not just an image.',
          bodyEn:
            '「將學名、分類階層、鑑定狀態與參考資料連結起來，讓每件標本不只是圖片，而是可被查證的科學身分。」'
        },
        {
          title: 'Locality & Time',
          titleEn: '地點與時間',
          body:
            'Connects each specimen to real-world context through locality, GPS, date, elevation, depth, and field notes.',
          bodyEn: '「整合採集地、GPS、日期、海拔或水深等資訊，建立標本與真實世界位置的關聯。」'
        },
        {
          title: 'Collector & Provenance',
          titleEn: '採集者與來源脈絡',
          body:
            'Records collector, observer, source, transfer, and review history to create a traceable specimen provenance.',
          bodyEn: '「記錄採集者、觀察者、來源、轉讓與審核紀錄，形成可追溯的標本履歷。」'
        },
        {
          title: 'Data Completeness',
          titleEn: '資料完整度',
          body:
            'Automatically checks photos, scientific name, locality, date, source, and evidence fields to help users complete critical data.',
          bodyEn:
            '「系統自動檢查照片、學名、地點、日期、來源與佐證欄位，協助使用者補齊關鍵資料。」'
        },
        {
          title: 'SAT Passport',
          titleEn: 'SAT 標本護照',
          body:
            'Each completed specimen can receive a unique SAT Passport ID for collection, display, trading, research reference, and long-term management.',
          bodyEn:
            '「每件完成的標本都能生成唯一 SAT Passport ID，作為收藏、展示、交易、研究引用與長期管理的基礎。」'
        }
      ],
      backTaxList: [
        'Kingdom Animalia',
        'Phylum Arthropoda',
        'Class Insecta',
        'Order Lepidoptera',
        'Family Papilionidae',
        'Genus Lamproptera',
        'Species L. meges'
      ],
      evidenceItems: [
        'Photo uploaded',
        'Scale bar visible',
        'Locality added',
        'Date added',
        'Collector added',
        'Taxonomy pending review'
      ],
      exifLine: 'GPS: consistent with locality (demo) · EXIF: date aligns with record',
      provLines: ['Image captured', 'Metadata enriched', 'Passport generated', 'Awaiting verification'],
      integrityScore: 'Integrity score (demo): 78 / 100',
      microScale: 'Scale bar detected (demo)',
      microOrient: 'Specimen orientation: lateral perch',
      microEvidence: 'Photo usable as observational evidence',
      microMeta: 'Some metadata can still be enriched',
      commonTaxonLine: 'Green dragontail · Lepidoptera'
    }
  };

  var HIGHLIGHT_MAP = ['photo', 'name', 'locality', 'date', 'collector', 'idcode', 'meter', 'sat'];

  function q(root, sel) {
    return (root || document).querySelector(sel);
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function applyIntroColumnLang(root, lang) {
    var pack = lang === 'en' ? passportIntroCopy.en : passportIntroCopy.zhTW;
    root.setAttribute('lang', lang === 'en' ? 'en' : 'zh-Hant');
    root.querySelectorAll('[data-passport-text]').forEach(function (el) {
      var k = el.getAttribute('data-passport-text');
      if (k && pack[k] != null) el.textContent = pack[k];
    });
    root.querySelectorAll('[data-passport-aria]').forEach(function (el) {
      var k = el.getAttribute('data-passport-aria');
      if (k && pack[k] != null) el.setAttribute('aria-label', pack[k]);
    });
    var steps = root.querySelectorAll('.passport-intro-steps [data-passport-step-idx]');
    steps.forEach(function (btn) {
      var i = parseInt(btn.getAttribute('data-passport-step-idx'), 10);
      if (!isNaN(i) && pack.steps && pack.steps[i]) {
        var t = btn.querySelector('.passport-intro-steps__t');
        if (t) t.textContent = pack.steps[i];
      }
    });
    root.querySelectorAll('.passport-intro-usp[data-passport-usp-idx]').forEach(function (uspEl) {
      var i = parseInt(uspEl.getAttribute('data-passport-usp-idx'), 10);
      var u = pack.usps && pack.usps[i];
      if (!u) return;
      var th = uspEl.querySelector('.passport-intro-usp__titleMain');
      var te = uspEl.querySelector('.passport-intro-usp__titleSub');
      var bh = uspEl.querySelector('.passport-intro-usp__bodyZh');
      var be = uspEl.querySelector('.passport-intro-usp__bodyEn');
      if (th) th.textContent = u.title;
      if (te) te.textContent = u.titleEn;
      if (bh) bh.textContent = u.body;
      if (be) be.textContent = u.bodyEn;
    });
  }

  function fillListUl(ul, lines) {
    if (!ul || !lines) return;
    ul.textContent = '';
    lines.forEach(function (line) {
      var li = document.createElement('li');
      li.textContent = line;
      ul.appendChild(li);
    });
  }

  function fillProv(div, lines) {
    if (!div || !lines) return;
    div.textContent = '';
    lines.forEach(function (line, j) {
      var row = document.createElement('div');
      var a = document.createElement('span');
      a.textContent = String(j + 1);
      var b = document.createElement('span');
      b.textContent = line;
      row.appendChild(a);
      row.appendChild(b);
      div.appendChild(row);
    });
  }

  function updatePassportCardLang(card, lang) {
    if (!card) return;
    var pack = lang === 'en' ? passportIntroCopy.en : passportIntroCopy.zhTW;
    var badge = card.querySelector('.mc-home-passport__badge');
    if (badge) badge.textContent = pack.statusPending;
    var mLabel = card.querySelector('[data-passport-meter-label]');
    if (mLabel) mLabel.textContent = pack.dataCompleteness;
    var commonLine = card.querySelector('[data-passport-text="commonTaxonLine"]');
    if (commonLine && pack.commonTaxonLine) commonLine.textContent = pack.commonTaxonLine;
    card.querySelectorAll('[data-passport-dt]').forEach(function (dt) {
      var k = dt.getAttribute('data-passport-dt');
      if (k && pack[k]) dt.textContent = pack[k];
    });
    var backH = card.querySelectorAll('.passport-intro-back__h');
    var keys = ['taxonomyBlock', 'evidenceBlock', 'exifBlock', 'provenanceBlock', 'integrityBlock', 'reviewStatus'];
    keys.forEach(function (key, idx) {
      if (backH[idx] && pack[key]) backH[idx].textContent = pack[key];
    });
    fillListUl(card.querySelector('[data-passport-back-tax-list]'), pack.backTaxList);
    if (pack.cardAria) card.setAttribute('aria-label', pack.cardAria);
    var tbA = card.querySelector('[data-passport-toolbar]');
    if (tbA && pack.toolbarAria) tbA.setAttribute('aria-label', pack.toolbarAria);
    fillListUl(card.querySelector('[data-passport-evidence-list]'), pack.evidenceItems);
    var exif = card.querySelector('[data-passport-exif]');
    if (exif && pack.exifLine) exif.textContent = pack.exifLine;
    fillProv(card.querySelector('[data-passport-prov]'), pack.provLines);
    var integ = card.querySelector('[data-passport-integrity]');
    if (integ && pack.integrityScore) integ.textContent = pack.integrityScore;
    var rev = card.querySelector('[data-passport-review-line]');
    if (rev && pack.verifiedPending) rev.textContent = pack.verifiedPending;
    var cue = card.querySelector('[data-passport-photo-cue]');
    if (cue) {
      var ul = cue.querySelector('ul');
      fillListUl(ul, [pack.microScale, pack.microOrient, pack.microEvidence, pack.microMeta]);
      var cht = cue.querySelector('[data-passport-cue-h]');
      if (cht) cht.textContent = pack.photoCueTitle;
    }
    var peBtn = card.querySelector('[data-passport-photo-evidence-btn]');
    if (peBtn) {
      peBtn.textContent = pack.photoEvidence;
      peBtn.setAttribute('aria-label', pack.photoEvidence);
    }
    var flipB = card.querySelector('[data-passport-flip-btn]');
    if (flipB) {
      flipB.textContent = pack.flip;
      flipB.setAttribute('aria-label', pack.flip);
    }
    var zi = q(card, '[data-passport-zoom-in]');
    var zo = q(card, '[data-passport-zoom-out]');
    var rs = q(card, '[data-passport-reset]');
    if (zi) {
      zi.textContent = pack.zoomIn;
      zi.setAttribute('aria-label', pack.zoomIn);
    }
    if (zo) {
      zo.textContent = pack.zoomOut;
      zo.setAttribute('aria-label', pack.zoomOut);
    }
    if (rs) {
      rs.textContent = pack.reset;
      rs.setAttribute('aria-label', pack.reset);
    }
    var ins = q(card, '[data-passport-inspect]');
    if (ins) {
      var insOpen = card.classList.contains('passport-intro-card--inspect');
      ins.textContent = insOpen ? pack.inspectClose : pack.inspect;
      ins.setAttribute('aria-label', insOpen ? pack.inspectClose : pack.inspect);
    }
    var lk = q(card, '[data-passport-lock]');
    if (lk) {
      var locked = lk.getAttribute('aria-pressed') === 'true';
      lk.textContent = locked ? pack.unlock : pack.lock;
      lk.setAttribute('aria-label', locked ? pack.unlock : pack.lock);
    }
    var rl = q(card, '[data-passport-rot-l]');
    var rr = q(card, '[data-passport-rot-r]');
    if (rl) rl.setAttribute('aria-label', pack.rotateL);
    if (rr) rr.setAttribute('aria-label', pack.rotateR);
  }

  function refreshAllLang(root, card, lang) {
    applyIntroColumnLang(root, lang);
    updatePassportCardLang(card, lang);
  }

  function setHoverHighlight(card, key) {
    if (!card) return;
    if (!key) {
      card.removeAttribute('data-passport-hover');
      return;
    }
    card.setAttribute('data-passport-hover', key);
  }

  function initPassportIntroSection() {
    var story = document.getElementById('mcHomeStory');
    var root = document.querySelector('#mcHomeS2[data-passport-intro]');
    var card = document.getElementById('mcHomePassportCard');
    if (!story || !root || !card || !root.classList.contains('passport-intro-section')) return;
    if (root.getAttribute('data-passport-intro-init') === '1') return;
    root.setAttribute('data-passport-intro-init', '1');

    var lang = 'zh-TW';
    try {
      if (global.state && global.state.lang === 'en') lang = 'en';
    } catch (e0) {
      void 0;
    }
    try {
      global.passportIntroLang = lang;
    } catch (eLang) {
      void 0;
    }

    var reduceMotion = false;
    try {
      reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e1) {
      void 0;
    }

    var scene = q(card, '[data-passport-scene]');
    var tilt = q(card, '[data-passport-tilt]');
    var flipInner = q(card, '[data-passport-flip]');
    var gloss = q(card, '[data-passport-gloss]');

    var state = {
      rz: 0,
      sc: 1,
      dx: 0,
      dy: 0,
      locked: false,
      dragging: false,
      dragStart: null,
      inspect: false,
      photoZoom: false
    };

    function paintTransform() {
      if (!tilt) return;
      tilt.style.setProperty('--pi-rz', state.rz + 'deg');
      tilt.style.setProperty('--pi-sc', String(state.sc));
      tilt.style.setProperty('--pi-dx', state.dx + 'px');
      tilt.style.setProperty('--pi-dy', state.dy + 'px');
    }

    function snapBack() {
      if (state.locked || state.dragging) return;
      state.dx = 0;
      state.dy = 0;
      paintTransform();
    }

    root.querySelectorAll('[data-passport-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        lang = btn.getAttribute('data-passport-lang') === 'en' ? 'en' : 'zh-TW';
        root.setAttribute('lang', lang === 'en' ? 'en' : 'zh-Hant');
        try {
          global.passportIntroLang = lang;
        } catch (eL2) {
          void 0;
        }
        root.querySelectorAll('[data-passport-lang]').forEach(function (b) {
          b.classList.toggle('is-active', b.getAttribute('data-passport-lang') === (lang === 'en' ? 'en' : 'zh-TW'));
        });
        refreshAllLang(root, card, lang);
      });
    });

    refreshAllLang(root, card, lang);

    root.querySelectorAll('[data-passport-step-idx]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var step = parseInt(btn.getAttribute('data-passport-step-idx'), 10);
        root.querySelectorAll('[data-passport-step-idx]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        var phase = 'photo';
        if (step === 1) phase = 'collector';
        if (step === 2) phase = 'idcode';
        if (step === 3) phase = 'idcode';
        card.setAttribute('data-mc-phase', phase);
        if (step >= 2) {
          card.setAttribute('data-mc-meter', step >= 3 ? '100' : '70');
          var mf = q(card, '[data-mc-meter-fill]');
          var mv = q(card, '[data-mc-meter-val]');
          if (mf) mf.style.width = (step >= 3 ? 100 : 70) + '%';
          if (mv) mv.textContent = (step >= 3 ? 100 : 70) + '%';
        } else {
          card.setAttribute('data-mc-meter', '40');
          var mf0 = q(card, '[data-mc-meter-fill]');
          var mv0 = q(card, '[data-mc-meter-val]');
          if (mf0) mf0.style.width = '40%';
          if (mv0) mv0.textContent = '40%';
        }
        var hi = { 0: 'photo', 1: 'metadata', 2: 'passport', 3: 'trace' }[step];
        setHoverHighlight(card, hi);
        setTimeout(function () {
          setHoverHighlight(card, '');
        }, 900);
      });
    });

    root.querySelectorAll('.passport-intro-usp[data-passport-usp-idx]').forEach(function (usp) {
      var hi = usp.getAttribute('data-passport-highlight');
      usp.addEventListener('mouseenter', function () {
        setHoverHighlight(card, hi);
      });
      usp.addEventListener('mouseleave', function () {
        setHoverHighlight(card, '');
      });
      usp.addEventListener('focusin', function () {
        setHoverHighlight(card, hi);
      });
      usp.addEventListener('focusout', function () {
        setHoverHighlight(card, '');
      });
      usp.addEventListener(
        'touchstart',
        function () {
          setHoverHighlight(card, hi);
        },
        { passive: true }
      );
      usp.addEventListener('touchend', function () {
        global.setTimeout(function () {
          setHoverHighlight(card, '');
        }, 650);
      });
    });

    var flipBtn = q(card, '[data-passport-flip-btn]');
    var backFace = q(card, '.passport-intro-card__face--back');
    function syncFlipA11y(open) {
      if (flipBtn) flipBtn.setAttribute('aria-pressed', open ? 'true' : 'false');
      if (backFace) backFace.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    if (flipBtn && flipInner) {
      flipBtn.addEventListener('click', function () {
        card.classList.toggle('passport-intro-card--flipped');
        syncFlipA11y(card.classList.contains('passport-intro-card--flipped'));
      });
    }

    q(card, '[data-passport-zoom-in]')?.addEventListener('click', function () {
      state.sc = clamp(state.sc + 0.08, 0.85, 1.35);
      paintTransform();
    });
    q(card, '[data-passport-zoom-out]')?.addEventListener('click', function () {
      state.sc = clamp(state.sc - 0.08, 0.85, 1.35);
      paintTransform();
    });
    q(card, '[data-passport-reset]')?.addEventListener('click', function () {
      state.rz = 0;
      state.sc = 1;
      state.dx = 0;
      state.dy = 0;
      state.inspect = false;
      state.photoZoom = false;
      card.classList.remove('passport-intro-card--inspect', 'passport-intro-card--photoZoom', 'passport-intro-card--flipped');
      syncFlipA11y(false);
      if (tilt) {
        tilt.style.removeProperty('--pi-rx');
        tilt.style.removeProperty('--pi-ry');
      }
      paintTransform();
      q(card, '[data-passport-inspect]')?.setAttribute('aria-pressed', 'false');
      updatePassportCardLang(card, lang);
    });
    q(card, '[data-passport-rot-l]')?.addEventListener('click', function () {
      state.rz -= 90;
      paintTransform();
    });
    q(card, '[data-passport-rot-r]')?.addEventListener('click', function () {
      state.rz += 90;
      paintTransform();
    });
    var lockBtn = q(card, '[data-passport-lock]');
    if (lockBtn) {
      lockBtn.addEventListener('click', function () {
        state.locked = !state.locked;
        lockBtn.setAttribute('aria-pressed', state.locked ? 'true' : 'false');
        updatePassportCardLang(card, lang);
      });
    }
    var insBtn = q(card, '[data-passport-inspect]');
    if (insBtn) {
      insBtn.addEventListener('click', function () {
        state.inspect = !state.inspect;
        card.classList.toggle('passport-intro-card--inspect', state.inspect);
        insBtn.setAttribute('aria-pressed', state.inspect ? 'true' : 'false');
        updatePassportCardLang(card, lang);
      });
    }

    q(card, '[data-passport-photo-evidence-btn]')?.addEventListener('click', function () {
      state.photoZoom = !state.photoZoom;
      card.classList.toggle('passport-intro-card--photoZoom', state.photoZoom);
      var cue = q(card, '[data-passport-photo-cue]');
      if (cue) cue.hidden = !state.photoZoom;
    });

    if (scene && tilt && !reduceMotion && global.matchMedia && !global.matchMedia('(pointer:coarse)').matches) {
      scene.addEventListener(
        'pointermove',
        function (e) {
          if (!e.isPrimary) return;
          var r = scene.getBoundingClientRect();
          var nx = (e.clientX - r.left) / (r.width || 1) - 0.5;
          var ny = (e.clientY - r.top) / (r.height || 1) - 0.5;
          var max = 5;
          tilt.style.setProperty('--pi-rx', -ny * max * 2 + 'deg');
          tilt.style.setProperty('--pi-ry', nx * max * 2 + 'deg');
          if (gloss) {
            gloss.style.setProperty('--pi-gx', nx * 14 + 'px');
            gloss.style.setProperty('--pi-gy', ny * 10 + 'px');
          }
        },
        { passive: true }
      );
      scene.addEventListener('pointerleave', function () {
        tilt.style.setProperty('--pi-rx', '0deg');
        tilt.style.setProperty('--pi-ry', '0deg');
        if (gloss) {
          gloss.style.setProperty('--pi-gx', '0px');
          gloss.style.setProperty('--pi-gy', '0px');
        }
      });
    }

    if (scene && tilt) {
      scene.addEventListener('pointerdown', function (e) {
        if (state.locked || e.button !== 0) return;
        if (e.target.closest('button,a,input,textarea')) return;
        state.dragging = true;
        state.dragStart = { x: e.clientX - state.dx, y: e.clientY - state.dy };
        card.classList.add('passport-intro-card--dragging');
        try {
          scene.setPointerCapture(e.pointerId);
        } catch (e2) {
          void 0;
        }
      });
      scene.addEventListener('pointermove', function (e) {
        if (!state.dragging || !state.dragStart) return;
        state.dx = e.clientX - state.dragStart.x;
        state.dy = e.clientY - state.dragStart.y;
        paintTransform();
      });
      scene.addEventListener('pointerup', function () {
        if (!state.dragging) return;
        state.dragging = false;
        state.dragStart = null;
        card.classList.remove('passport-intro-card--dragging');
        if (!state.locked) {
          state.dx *= 0.2;
          state.dy *= 0.2;
          global.requestAnimationFrame(function ease() {
            state.dx *= 0.65;
            state.dy *= 0.65;
            paintTransform();
            if (Math.abs(state.dx) > 0.6 || Math.abs(state.dy) > 0.6) {
              global.requestAnimationFrame(ease);
            } else {
              snapBack();
            }
          });
        }
      });
      scene.addEventListener('pointercancel', function () {
        state.dragging = false;
        card.classList.remove('passport-intro-card--dragging');
        snapBack();
      });
    }

    var pinch0 = null;
    if (scene && tilt) {
      scene.addEventListener(
        'touchstart',
        function (e) {
          if (e.touches && e.touches.length === 2) {
            var a = e.touches[0];
            var b = e.touches[1];
            pinch0 = {
              d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
              sc: state.sc
            };
          }
        },
        { passive: true }
      );
      scene.addEventListener(
        'touchmove',
        function (e) {
          if (!pinch0 || !e.touches || e.touches.length !== 2) return;
          var a = e.touches[0];
          var b = e.touches[1];
          var d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
          if (pinch0.d > 6) {
            state.sc = clamp(pinch0.sc * (d / pinch0.d), 0.82, 1.48);
            paintTransform();
          }
        },
        { passive: true }
      );
      var endPinch = function (e) {
        if (!e.touches || e.touches.length < 2) pinch0 = null;
      };
      scene.addEventListener('touchend', endPinch, { passive: true });
      scene.addEventListener('touchcancel', function () {
        pinch0 = null;
      }, { passive: true });
    }

    card.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.code === 'Space') {
        var t = e.target;
        if (t && t.closest && t.closest('button')) return;
        e.preventDefault();
        card.classList.toggle('passport-intro-card--flipped');
        syncFlipA11y(card.classList.contains('passport-intro-card--flipped'));
      }
    });

    function goPrimary() {
      if (typeof global.goTo === 'function') {
        global.goTo('/section/card-generator');
        return;
      }
      if (global.MCRouter && typeof global.MCRouter.go === 'function') {
        global.MCRouter.go('/section/card-generator');
        return;
      }
      global.location.hash = '#/section/card-generator';
    }
    function goSecondary() {
      var hero = document.getElementById('mcWelcomeHero');
      if (hero && hero.scrollIntoView) {
        hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    q(root, '#mcPassportIntroCtaPrimary')?.addEventListener('click', goPrimary);
    q(root, '#mcPassportIntroCtaSecondary')?.addEventListener('click', goSecondary);

    paintTransform();
  }

  global.passportIntroCopy = passportIntroCopy;
  global.initPassportIntroSection = initPassportIntroSection;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPassportIntroSection);
  else initPassportIntroSection();
})(typeof window !== 'undefined' ? window : this);
