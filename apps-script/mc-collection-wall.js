/**
 * MCurator — Collection Wall (public + shared card VM).
 * Unified card chrome, data-driven filters, grid mode, detail modal.
 * Depends: window.getSpecimenCoverflowConfig (welcome-museum.js)
 */
(function (W) {
  'use strict';

  var FILTER_DEFS = [
    { id: 'all', lab: '全部' },
    { id: 'insect', lab: '昆蟲學' },
    { id: 'plant', lab: '植物學' },
    { id: 'paleontology', lab: '古生物學' },
    { id: 'dinopedia', lab: '恐龍學' },
  ];

  function isEditorPreviewWall_() {
    try {
      if (W.__MC_EDITOR_PREVIEW_RUNTIME__ || W.__MC_EDITOR_PREVIEW_INSPECT__) return true;
      var p = new URLSearchParams(String((W.location && W.location.search) || ''));
      return p.get('editorPreview') === '1' || p.get('editor') === '1';
    } catch (eEdWall) {
      return false;
    }
  }

  function mcWallT(key) {
    try {
      if (typeof W.MCt === 'function') {
        var v = W.MCt(key);
        if (v != null && String(v).length) return String(v);
      }
      if (typeof W.mcT === 'function') {
        var v2 = W.mcT(key);
        if (v2 != null && String(v2).length) return String(v2);
      }
    } catch (eT) {
      void 0;
    }
    return '';
  }

  function wallLangEn_() {
    try {
      if (typeof W.mcGetLang === 'function') return W.mcGetLang() === 'en';
      if (W.MC_LOCALE === 'en') return true;
      if (typeof state !== 'undefined' && state && state.lang === 'en') return true;
      if (W.localStorage && W.localStorage.getItem('MC_USER_LANG') === 'en') return true;
    } catch (eLe) {
      void 0;
    }
    return false;
  }

  function wallFallback_(en, zh) {
    return wallLangEn_() ? en : zh;
  }

  function wallMetaLabel_(key, en, zh) {
    var t = mcWallT(key);
    if (t) return t;
    return wallFallback_(en, zh);
  }

  function displayCommonName_(common) {
    var c = String(common || '').trim();
    if (wallLangEn_() && c && /[\u4e00-\u9fff]/.test(c)) {
      var slash = c.indexOf(' / ');
      if (slash >= 0) return c.slice(slash + 3).trim();
      return '';
    }
    return c;
  }

  function cfDisplayLocalityWall_(text) {
    if (!text || text === '—') return text || '—';
    if (!wallLangEn_()) return text;
    try {
      if (W.McWelcomeHeroDemo && typeof W.McWelcomeHeroDemo.translateLocality === 'function') {
        return W.McWelcomeHeroDemo.translateLocality(text);
      }
    } catch (eLoc) {
      void 0;
    }
    return text;
  }

  var FILTER_DEFS_EN = {
    all: 'All',
    insect: 'Entomology',
    plant: 'Botany',
    paleontology: 'Paleontology',
    dinopedia: 'Dinosaurs',
    verified: 'Verified',
    featured: 'Featured',
    beetle: 'Beetles',
    fossil: 'Paleontology',
    botany: 'Botany',
    entomology: 'Entomology',
    mineral: 'Minerals',
    fish: 'Fish',
    shell: 'Shells',
    mammal: 'Mammals',
    bird: 'Birds',
    reptile: 'Reptiles',
    seed: 'Seeds',
    other: 'Other',
  };

  function filterLabel(id) {
    var t = mcWallT('cw_filter_' + id);
    if (t) return t;
    if (wallLangEn_()) return FILTER_DEFS_EN[id] || id;
    var def = FILTER_DEFS.filter(function (f) {
      return f.id === id;
    })[0];
    return def ? def.lab : id;
  }

  function verifyStatusLabel(status) {
    if (status === 'verified') {
      return mcWallT('cw_status_verified') || (wallLangEn_() ? 'Verified' : '已核');
    }
    if (status === 'pending') {
      return mcWallT('cw_status_pending') || (wallLangEn_() ? 'In review' : '審核中');
    }
    return mcWallT('cw_status_unverified') || (wallLangEn_() ? 'Unverified' : '未核');
  }

  function reduceMotion() {
    try {
      return W.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolveImg_(rel) {
    rel = String(rel || '').replace(/^\.\.\/+/, '');
    var path = '../' + rel.replace(/^\/+/, '');
    if (typeof W.mcResolveLocalRelToPage_ === 'function') {
      try {
        var u = W.mcResolveLocalRelToPage_(rel.replace(/^\.\.\//, ''));
        if (u) return u;
      } catch (eR) {
        void 0;
      }
    }
    return path;
  }

  function isLikelyFilenameTitle_(s) {
    return /\.(png|jpe?g|webp|gif|svg)$/i.test(String(s || '').trim());
  }

  function normalizeCategoryKey_(cat, tags) {
    var c = String(cat || '').toLowerCase().trim();
    var t = (tags || []).map(function (x) {
      return String(x || '').toLowerCase();
    });
    var map = {
      insect: 'insect',
      entomology: 'insect',
      beetle: 'beetle',
      shell: 'shell',
      seed: 'seed',
      fish: 'fish',
      plant: 'plant',
      botany: 'plant',
      fossil: 'paleontology',
      paleontology: 'paleontology',
      dinopedia: 'dinopedia',
      mineral: 'mineral',
      mammal: 'mammal',
      bird: 'bird',
      reptile: 'reptile',
      lepid: 'insect',
      odonata: 'insect',
      other: 'other',
    };
    if (map[c]) return map[c];
    for (var i = 0; i < t.length; i++) {
      if (map[t[i]]) return map[t[i]];
    }
    if (t.indexOf('beetle') >= 0 || t.indexOf('coleopt') >= 0) return 'beetle';
    if (t.indexOf('dinopedia') >= 0 || t.indexOf('dinosaur') >= 0) return 'dinopedia';
    if (t.indexOf('paleontology') >= 0 || t.indexOf('fossil') >= 0) return 'paleontology';
    if (t.indexOf('shell') >= 0 || t.indexOf('mollus') >= 0) return 'shell';
    if (t.indexOf('fish') >= 0) return 'fish';
    if (t.indexOf('seed') >= 0 || t.indexOf('plant') >= 0) return 'plant';
    if (c && c !== 'insect') return 'other';
    return c || 'other';
  }

  function verificationFromItem_(it) {
    if (it.statusKey === 'verified' || it.status === '已核') return 'verified';
    if (it.status === '審中' || it.statusKey === 'pending') return 'pending';
    return 'unverified';
  }

  function visibilityFromItem_(it) {
    var v = it.cardVisibility || it.wallVisibility;
    if (v === 'draft' || v === 'public' || v === 'hidden') return v;
    var v2 = it.visibility;
    if (v2 === 'draft' || v2 === 'public' || v2 === 'hidden') return v2;
    return 'public';
  }

  /** @param {object} it normalized coverflow item */
  function normalizeWallVm(it, sortIdx) {
    it = it || {};
    var scientific = String(it.scientificName || it.title || '').trim();
    if (isLikelyFilenameTitle_(scientific)) scientific = '';
    var zhTitle = String(it.displayTitle || it.titleZh || it.title || '').trim();
    var displayTitle = scientific || zhTitle || mcWallT('cw_specimen') || 'Specimen';
    try {
      if (typeof window !== 'undefined' && window.MC_LOCALE === 'en' && /[\u4e00-\u9fff]/.test(displayTitle)) {
        displayTitle = scientific || mcWallT('cw_specimen') || 'Specimen';
      }
    } catch (eLoc) {
      void 0;
    }
    if (isLikelyFilenameTitle_(displayTitle)) displayTitle = scientific || mcWallT('cw_specimen') || 'Specimen';
    var common = String(it.common || '').trim();
    common = displayCommonName_(common);
    var satId = String(it.id || it.satId || '').trim();
    var catalog = String(it.museumNo || it.number || it.catalogNumber || '').trim();
    var categoryKey =
      typeof W.mcResolveDisciplineCategory === 'function'
        ? W.mcResolveDisciplineCategory(it)
        : normalizeCategoryKey_(it.category, it.tags);
    var vis = visibilityFromItem_(it);
    var visibilityLabel =
      vis === 'public'
        ? mcWallT('cw_visibility_public')
        : vis === 'draft'
          ? mcWallT('cw_visibility_draft')
          : vis === 'hidden'
            ? mcWallT('cw_visibility_hidden')
            : mcWallT('cw_visibility_public');
    var verification = verificationFromItem_(it);
    var featured = !!it.featured;
    var pinned = !!it.pinned;
    var sortOrder = typeof it.sortOrder === 'number' && it.sortOrder === it.sortOrder ? it.sortOrder : sortIdx | 0;
    var cover = it.coverImage || it.image || '';
    var thumb = it.thumbnailUrl || cover;
    var holder = String(it.holder || it.registry || '').trim();
    var description = String(it.description || it.reviewHint || '').trim();
    var ctaUrl = String(it.ctaUrl || '').trim();
    var sourceSpecimenId = String(it.sourceSpecimenId || '').trim();

    return {
      raw: it,
      cfConfigIndex: sortIdx,
      displayTitle: displayTitle,
      scientificName: scientific || '—',
      commonName: common,
      satId: satId,
      catalogNumber: catalog,
      categoryKey: categoryKey,
      taxonomyGroup: String(it.type || '').trim(),
      locality: cfDisplayLocalityWall_(String(it.locality || it.origin || '—').trim()),
      date: String(it.date || '—').trim(),
      collector: wallLangEn_() && /[\u4e00-\u9fff]/.test(String(it.collector || ''))
        ? 'MCurator Demo'
        : String(it.collector || '—').trim(),
      holder: holder || '—',
      visibility: vis,
      visibilityLabel: visibilityLabel,
      verificationStatus: verification,
      coverImage: cover,
      thumbUrl: thumb,
      fit: it.fit || it.photoFit || 'cover',
      description: description,
      ctaUrl: ctaUrl,
      sourceSpecimenId: sourceSpecimenId,
      featured: featured,
      pinned: pinned,
      sortOrder: sortOrder,
      completionPct: typeof it.progress === 'number' ? Math.max(0, Math.min(100, it.progress)) : null,
      tags: Array.isArray(it.tags) ? it.tags.slice() : [],
    };
  }

  function categoryPlaceholderSvg_(key) {
    key = String(key || 'other');
    var colors = {
      insect: '38,120,90',
      beetle: '56,100,78',
      plant: '72,130,64',
      fossil: '120,100,70',
      paleontology: '120,100,70',
      dinopedia: '130,90,55',
      mineral: '100,120,140',
      fish: '50,100,130',
      shell: '90,110,120',
      seed: '100,120,70',
      mammal: '110,90,80',
      bird: '90,100,130',
      reptile: '80,110,70',
      other: '60,80,76',
    };
    var rgb = colors[key] || colors.other;
    return (
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200">' +
          '<rect fill="rgb(' +
          rgb +
          ')" width="800" height="1200"/>' +
          '<text x="400" y="620" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="system-ui" font-size="42">' +
          key +
          '</text></svg>'
      )
    );
  }

  function resolveDisplayImage_(vm) {
    if (vm.coverImage) return resolveImg_(vm.coverImage);
    return categoryPlaceholderSvg_(vm.categoryKey);
  }

  function passportHref_(vm) {
    if (vm.ctaUrl) return vm.ctaUrl;
    if (vm.sourceSpecimenId) return '#/specimen/' + encodeURIComponent(vm.sourceSpecimenId);
    if (vm.catalogNumber && vm.catalogNumber !== '—') return '#/specimen/' + encodeURIComponent(vm.catalogNumber);
    return '#/dashboard/specimen-passports';
  }

  function satHref_(vm) {
    if (vm.satId) return '#/sat/' + encodeURIComponent(vm.satId);
    return '#/marketplace';
  }

  function verifyHref_(vm) {
    if (vm.satId) return '#/verify/' + encodeURIComponent(vm.satId);
    return '#/dashboard/specimen-passports';
  }

  function resolveDisciplineKey_(vm) {
    if (typeof W.mcResolveDisciplineCategory === 'function') {
      try {
        var src = vm.raw || vm;
        return W.mcResolveDisciplineCategory(src);
      } catch (eDisc) {
        void 0;
      }
    }
    return normalizeCategoryKey_(vm.categoryKey || (vm.raw && vm.raw.category), vm.tags);
  }

  function itemMatchesFilter_(vm, filterId) {
    if (filterId === 'all') return true;
    if (filterId === 'verified') return vm.verificationStatus === 'verified';
    if (filterId === 'featured') return vm.featured;
    var discipline = resolveDisciplineKey_(vm);
    if (discipline === filterId) return true;
    var tags = (vm.tags || []).map(function (x) {
      return String(x || '').toLowerCase();
    });
    var rawCat = vm.raw && vm.raw.category ? String(vm.raw.category).toLowerCase() : '';
    var rawSpec =
      vm.raw && vm.raw.specimenCategory ? String(vm.raw.specimenCategory).toLowerCase() : '';
    if (filterId === 'insect') {
      if (vm.categoryKey === 'insect' || vm.categoryKey === 'beetle') return true;
      if (rawCat === 'entomology' || rawCat === 'insect' || rawSpec === 'entomology') return true;
      return tags.indexOf('insect') >= 0 || tags.indexOf('entomology') >= 0;
    }
    if (filterId === 'plant') {
      if (vm.categoryKey === 'plant' || vm.categoryKey === 'seed') return true;
      if (rawCat === 'botany' || rawCat === 'plant' || rawSpec === 'botany') return true;
      return tags.indexOf('plant') >= 0 || tags.indexOf('botany') >= 0;
    }
    if (filterId === 'paleontology') {
      if (discipline === 'paleontology') return true;
      if (vm.categoryKey === 'paleontology') return true;
      if (rawCat === 'paleontology' || rawSpec === 'paleontology') return true;
      if (tags.indexOf('paleontology') >= 0) return true;
      if (vm.categoryKey === 'fossil' && tags.indexOf('dinopedia') < 0 && tags.indexOf('dinosaur') < 0) return true;
      return false;
    }
    if (filterId === 'dinopedia') {
      if (discipline === 'dinopedia') return true;
      if (vm.categoryKey === 'dinopedia') return true;
      if (rawCat === 'dinopedia' || rawSpec === 'dinopedia') return true;
      return tags.indexOf('dinopedia') >= 0 || tags.indexOf('dinosaur') >= 0;
    }
    if (filterId === 'fossil') {
      return itemMatchesFilter_(vm, 'paleontology') || itemMatchesFilter_(vm, 'dinopedia');
    }
    return vm.categoryKey === filterId;
  }

  function deriveVisibleFilterIds_(vms, previewMode) {
    var out = ['all'];
    var counts = {};
    var fi;
    for (fi = 0; fi < FILTER_DEFS.length; fi++) {
      counts[FILTER_DEFS[fi].id] = 0;
    }
    var i;
    for (i = 0; i < vms.length; i++) {
      var vm = vms[i];
      if (!previewMode && (vm.visibility === 'draft' || vm.visibility === 'hidden')) continue;
      for (fi = 1; fi < FILTER_DEFS.length; fi++) {
        var fid = FILTER_DEFS[fi].id;
        if (itemMatchesFilter_(vm, fid)) counts[fid]++;
      }
    }
    for (fi = 1; fi < FILTER_DEFS.length; fi++) {
      var id = FILTER_DEFS[fi].id;
      if (counts[id] > 0 || previewMode) out.push(id);
    }
    return out;
  }

  function filterWallList_(vms, filterId) {
    return vms.filter(function (vm) {
      return itemMatchesFilter_(vm, filterId);
    });
  }

  function sortWallVms_(vms) {
    return vms.slice().sort(function (a, b) {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return 0;
    });
  }

  function renderItunesCover_(vm) {
    var card = document.createElement('article');
    card.className = 'cw-itunes-cover';
    card.setAttribute('data-cw-cover', '1');
    card.setAttribute('data-interactive-card', '');

    var art = document.createElement('div');
    art.className = 'cw-itunes-cover__art';
    var img = document.createElement('img');
    img.className = 'cw-itunes-cover__img';
    img.alt = vm.scientificName || '';
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    img.src = resolveDisplayImage_(vm);
    img.setAttribute('data-fit', vm.fit === 'contain' ? 'contain' : 'cover');
    art.appendChild(img);

    var cap = document.createElement('div');
    cap.className = 'cw-itunes-cover__caption';
    cap.innerHTML =
      '<strong class="cw-itunes-cover__title">' +
      esc(vm.scientificName || '—') +
      '</strong>' +
      '<span class="cw-itunes-cover__sub">' +
      esc(displayCommonName_(vm.commonName) || vm.catalogNumber || '') +
      '</span>';

    card.appendChild(art);
    card.appendChild(cap);
    return card;
  }

  function renderPublicCard(vm, extraClass) {
    var card = document.createElement('article');
    card.className = 'cw-showcase-card' + (extraClass ? ' ' + extraClass : '');
    card.setAttribute('data-interactive-card', '');
    card.setAttribute('data-cw-card', '1');

    var verClass = 'cw-showcase-card__verify--' + vm.verificationStatus;
    var verLab = verifyStatusLabel(vm.verificationStatus);

    var top = document.createElement('header');
    top.className = 'cw-showcase-card__top';
    top.innerHTML =
      '<div class="cw-showcase-card__topRow">' +
      '<span class="cw-showcase-card__verify ' +
      verClass +
      '" title="' + esc(wallMetaLabel_('cw_verify_status_title', 'Verification status', '驗證狀態')) + '">' +
      esc(verLab) +
      '</span>' +
      '<span class="cw-showcase-card__cat">' +
      esc(filterLabel(vm.categoryKey)) +
      '</span>' +
      '</div>' +
      '<div class="cw-showcase-card__ids">' +
      '<span class="cw-showcase-card__catalog" title="' + esc(wallMetaLabel_('cw_catalog_no_title', 'Catalog no.', '館號')) + '">' +
      esc(vm.catalogNumber || '—') +
      '</span>' +
      '<span class="cw-showcase-card__sat" title="SAT ID">' +
      esc(vm.satId || '—') +
      '</span>' +
      '</div>';

    var fig = document.createElement('div');
    fig.className = 'cw-showcase-card__figure';
    var img = document.createElement('img');
    img.className = 'cw-showcase-card__img';
    img.alt = '';
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    img.src = resolveDisplayImage_(vm);
    img.setAttribute('data-fit', vm.fit === 'contain' ? 'contain' : 'cover');
    fig.appendChild(img);

    var body = document.createElement('div');
    body.className = 'cw-showcase-card__body';
    var cfIdx = vm.cfConfigIndex != null && vm.cfConfigIndex === vm.cfConfigIndex ? String(vm.cfConfigIndex) : '';
    var sci = document.createElement('h3');
    sci.className = 'cw-showcase-card__sci';
    sci.textContent = vm.scientificName;
    if (cfIdx) {
      sci.setAttribute('data-mc-cf-field', 'scientificName');
      sci.setAttribute('data-mc-cf-index', cfIdx);
    }
    var com = document.createElement('p');
    com.className = 'cw-showcase-card__common';
    com.textContent = displayCommonName_(vm.commonName) || vm.displayTitle || '';
    if (cfIdx) {
      com.setAttribute('data-mc-cf-field', 'common');
      com.setAttribute('data-mc-cf-index', cfIdx);
    }
    var tax = document.createElement('p');
    tax.className = 'cw-showcase-card__tax';
    tax.textContent = vm.taxonomyGroup || '';

    var meta = document.createElement('dl');
    meta.className = 'cw-showcase-card__meta';
    function metaRowEl(dt, dd, fieldKey) {
      var w = document.createElement('div');
      w.className = 'cw-showcase-card__metaRow';
      var dtEl = document.createElement('dt');
      dtEl.textContent = dt;
      var ddEl = document.createElement('dd');
      ddEl.textContent = dd;
      if (fieldKey && cfIdx) {
        ddEl.setAttribute('data-mc-cf-field', fieldKey);
        ddEl.setAttribute('data-mc-cf-index', cfIdx);
      }
      w.appendChild(dtEl);
      w.appendChild(ddEl);
      return w;
    }
    meta.appendChild(metaRowEl(wallMetaLabel_('cw_meta_locality', 'Locality', '產地'), vm.locality, 'locality'));
    meta.appendChild(metaRowEl(wallMetaLabel_('cw_meta_date', 'Date', '日期'), vm.date, 'date'));
    meta.appendChild(metaRowEl(wallMetaLabel_('cw_meta_collection', 'Collector', '採集者'), vm.collector, 'collector'));
    meta.appendChild(
      metaRowEl(wallMetaLabel_('cw_meta_visibility', 'Visibility', '能見度'), vm.visibilityLabel || vm.visibility, 'visibility')
    );

    var foot = document.createElement('footer');
    foot.className = 'cw-showcase-card__foot';
    var pct = vm.completionPct != null ? vm.completionPct : null;
    var pctText = pct != null ? pct + '%' : '—';
    foot.innerHTML =
      '<div class="cw-showcase-card__footMain">' +
      '<span class="cw-showcase-card__complete">' +
      esc(wallMetaLabel_('cw_completion', 'Completeness', '完成度')) +
      ' <strong>' +
      esc(pctText) +
      '</strong></span>' +
      (pct != null
        ? '<i class="cw-showcase-card__progress" style="--value:' + esc(String(pct)) + '%"></i>'
        : '') +
      '</div>' +
      '<span class="cw-showcase-card__ctaHint">' +
      esc(wallMetaLabel_('cw_view_details', 'View details', '檢視詳情')) +
      '</span>';

    body.appendChild(sci);
    body.appendChild(com);
    if (tax.textContent) body.appendChild(tax);
    body.appendChild(meta);

    card.appendChild(top);
    card.appendChild(fig);
    card.appendChild(body);
    card.appendChild(foot);
    return card;
  }

  function ensureModal_() {
    var el = document.getElementById('cwDetailModal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'cwDetailModal';
    el.className = 'cw-detail-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<div class="cw-detail-modal__backdrop" data-cw-close="1"></div>' +
      '<div class="cw-detail-modal__panel">' +
      '<button type="button" class="cw-detail-modal__x" data-cw-close="1" aria-label="' + esc(mcWallT('cw_close') || '關閉') + '">×</button>' +
      '<div class="cw-detail-modal__layout">' +
      '<div class="cw-detail-modal__visual"><img class="cw-detail-modal__hero" alt="" /></div>' +
      '<div class="cw-detail-modal__content">' +
      '<h2 class="cw-detail-modal__sci"></h2>' +
      '<p class="cw-detail-modal__common"></p>' +
      '<dl class="cw-detail-modal__dl"></dl>' +
      '<p class="cw-detail-modal__desc"></p>' +
      '<div class="cw-detail-modal__actions">' +
      '<a class="cw-detail-modal__btn" data-cw-pass href="#">' + esc(mcWallT('cw_passport_btn') || '標本護照') + '</a>' +
      '<a class="cw-detail-modal__btn" data-cw-sat href="#">SAT</a>' +
      '<a class="cw-detail-modal__btn cw-detail-modal__btn--ghost" data-cw-verify href="#">' + esc(mcWallT('cw_verify_btn') || '驗證') + '</a>' +
      '</div></div></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target.getAttribute('data-cw-close') === '1') closeModal_();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && el.getAttribute('aria-hidden') === 'false') closeModal_();
    });
    return el;
  }

  function closeModal_() {
    var el = document.getElementById('cwDetailModal');
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
  }

  function openDetailModal_(vm) {
    var el = ensureModal_();
    var hero = el.querySelector('.cw-detail-modal__hero');
    var sci = el.querySelector('.cw-detail-modal__sci');
    var com = el.querySelector('.cw-detail-modal__common');
    var dl = el.querySelector('.cw-detail-modal__dl');
    var desc = el.querySelector('.cw-detail-modal__desc');
    var aPass = el.querySelector('[data-cw-pass]');
    var aSat = el.querySelector('[data-cw-sat]');
    var aVer = el.querySelector('[data-cw-verify]');
    if (hero) {
      hero.src = resolveDisplayImage_(vm);
      hero.alt = vm.scientificName;
    }
    if (sci) sci.textContent = vm.scientificName;
    if (com) com.textContent = vm.commonName || vm.displayTitle || '';
    if (dl) {
      function drow(k, v) {
        return '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>';
      }
      dl.innerHTML =
        drow('SAT ID', vm.satId || '—') +
        drow(mcWallT('cw_catalog_no_title') || '館號', vm.catalogNumber || '—') +
        drow(mcWallT('cw_modal_visibility') || '公開狀態', vm.visibilityLabel || vm.visibility) +
        drow(mcWallT('cw_modal_category') || '類別', filterLabel(vm.categoryKey)) +
        drow(mcWallT('cw_modal_taxonomy') || '分類', vm.taxonomyGroup || '—') +
        drow(mcWallT('cw_meta_locality') || '產地', vm.locality) +
        drow(mcWallT('cw_meta_date') || '日期', vm.date) +
        drow(mcWallT('cw_modal_collector') || '典藏／採集', vm.collector) +
        drow(mcWallT('cw_modal_holder') || '持有者', vm.holder) +
        drow(mcWallT('cw_modal_verify') || '驗證', verifyStatusLabel(vm.verificationStatus));
    }
    if (desc) desc.textContent = vm.description || '';
    if (aPass) aPass.href = passportHref_(vm);
    if (aSat) aSat.href = satHref_(vm);
    if (aVer) aVer.href = verifyHref_(vm);
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
  }

  function initSpecimenCoverflow() {
    if (typeof W.isLandingMode === 'function' && !W.isLandingMode()) return;
    var root = document.getElementById('mcSpecimenCoverflow');
    if (!root || root.getAttribute('data-specimen-coverflow-ready') === '1') return;
    var gridHost = root.querySelector('[data-cw-grid]');
    if (!gridHost) return;
    root.setAttribute('data-specimen-coverflow-ready', '1');
    root.setAttribute('data-cw-display', 'grid');
    if (reduceMotion()) root.classList.add('specimen-coverflow-section--reduce');

    var cfg = typeof W.getSpecimenCoverflowConfig === 'function' ? W.getSpecimenCoverflowConfig() : {};
    var previewMode = !!W.__MC_COLLECTION_WALL_PREVIEW__;

    var rawItems = cfg.items || [];
    var allVms = [];
    var ii;
    for (ii = 0; ii < rawItems.length; ii++) {
      allVms.push(normalizeWallVm(rawItems[ii], ii));
    }
    allVms = sortWallVms_(allVms);
    var publicVms = allVms.filter(function (vm) {
      if (previewMode) return true;
      return vm.visibility !== 'draft' && vm.visibility !== 'hidden';
    });

    var emptyEl = root.querySelector('[data-cw-empty]');
    var countEl = root.querySelector('[data-cw-count]');

    function applyHeader_() {
      var ey = root.querySelector('#mcSpecimenCoverflowEyebrow');
      var h = root.querySelector('#mcSpecimenCoverflowH');
      var useCmsTitle = !wallLangEn_();
      if (ey) {
        ey.textContent = mcWallT('cw_eyebrow') || (wallLangEn_() ? 'Collection wall' : '典藏牆');
        ey.hidden = true;
      }
      if (h) {
        h.textContent =
          useCmsTitle && cfg.title && !/[\u4e00-\u9fff]/.test(String(cfg.title))
            ? cfg.title
            : mcWallT('cw_default_title') || '';
      }
    }
    applyHeader_();
    root.setAttribute('data-coverflow-bg', String(cfg.backgroundMode || 'dark'));

    var activeFilter = 'all';
    if (cfg.filters && cfg.filters.length && cfg.filters.indexOf('all') < 0) {
      activeFilter = cfg.filters[0];
    }
    var filtered = filterWallList_(publicVms, activeFilter);

    function applyFilter_(fid) {
      activeFilter = fid || 'all';
      filtered = filterWallList_(publicVms, activeFilter);
      filtered = sortWallVms_(filtered);
      root.querySelectorAll('.specimen-coverflow-filters [data-filter]').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-filter') === activeFilter);
      });
      root.setAttribute('data-coverflow-active-filter', activeFilter);
      renderGrid_();
      updateCount_();
    }

    root.__mcCwApplyFilter = applyFilter_;

    function rebuildFilters_() {
      var nav = root.querySelector('.specimen-coverflow-filters');
      if (!nav) return;
      var keys =
        cfg.filters && cfg.filters.length
          ? cfg.filters.slice()
          : deriveVisibleFilterIds_(publicVms, previewMode);
      if (cfg.showFilters === false) {
        nav.style.display = 'none';
        return;
      }
      nav.style.display = '';
      var html = '';
      for (var fi = 0; fi < keys.length; fi++) {
        var fk = keys[fi];
        var lab = filterLabel(fk);
        html +=
          '<button type="button" class="' +
          (fk === activeFilter ? 'is-active' : '') +
          '" data-filter="' +
          String(fk).replace(/"/g, '&quot;') +
          '">' +
          esc(lab) +
          '</button>';
      }
      nav.innerHTML = html;
    }

    rebuildFilters_();

    function updateCount_() {
      if (countEl) {
        countEl.textContent =
          (mcWallT('cw_count_prefix') || (wallLangEn_() ? '' : '共 ')) +
          String(filtered.length) +
          (mcWallT('cw_count_suffix') || (wallLangEn_() ? ' records' : ' 筆'));
      }
      if (emptyEl) {
        emptyEl.hidden = filtered.length > 0;
        if (!filtered.length) {
          emptyEl.textContent =
            mcWallT('cw_empty') || wallFallback_('No matching public specimen cards.', '目前沒有符合條件的公開標本卡。');
        }
      }
    }

    function renderGrid_() {
      gridHost.innerHTML = '';
      if (!filtered.length) return;
      var gi;
      for (gi = 0; gi < filtered.length; gi++) {
        (function (vm) {
          var cell = document.createElement('div');
          cell.className = 'cw-wall-grid__cell';
          var c = renderPublicCard(vm, 'cw-showcase-card--grid');
          cell.appendChild(c);
          cell.addEventListener('click', function () {
            openDetailModal_(vm);
          });
          gridHost.appendChild(cell);
        })(filtered[gi]);
      }
    }

    if (root.getAttribute('data-cf-filter-delegation') !== '1') {
      root.setAttribute('data-cf-filter-delegation', '1');
      root.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.specimen-coverflow-filters [data-filter]');
        if (!btn || !root.contains(btn)) return;
        var filter = btn.getAttribute('data-filter') || 'all';
        root.querySelectorAll('.specimen-coverflow-filters [data-filter]').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        applyFilter_(filter);
      });
    }

    applyFilter_('all');

    root.__mcCwRefreshI18n = function () {
      applyHeader_();
      rebuildFilters_();
      updateCount_();
      renderGrid_();
    };
  }

  function refreshCollectionWallI18n_() {
    var root = document.getElementById('mcSpecimenCoverflow');
    if (root && typeof root.__mcCwRefreshI18n === 'function') root.__mcCwRefreshI18n();
  }

  W.MCCollectionWall = {
    initSpecimenCoverflow: initSpecimenCoverflow,
    renderPublicCard: renderPublicCard,
    renderItunesCover: renderItunesCover_,
    normalizeWallVm: normalizeWallVm,
    FILTER_DEFS: FILTER_DEFS,
    refreshI18n: refreshCollectionWallI18n_,
  };
})(window);
