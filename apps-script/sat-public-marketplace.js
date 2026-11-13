(function (global) {
  'use strict';

  var HOST_ID = 'satPublicMarketplaceHost';
  var PAGE_SIZE = 12;
  var DEBOUNCE_MS = 260;
  /** No <img> in grid/hero/collection strip — CSS placeholders (performance). */
  var MC_SAT_MP_GRID_NO_IMAGES = true;
  var timer = null;
  var toastTimer = null;

  var ui = {
    q: '',
    sort: 'newest',
    categoryTab: 'all',
    visible: PAGE_SIZE,
    collectionSlug: null,
    drawerAssetId: null,
    viewLayout: 'grid',
    filterSheet: false,
    sfCat: [],
    sfAType: [],
    sfLicense: [],
    sfVerify: [],
    sfPriceBand: '',
    watchlist: {},
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escAttr(s) {
    return esc(s).replace(/'/g, '&#39;');
  }
  function lower(s) {
    return String(s || '').trim().toLowerCase();
  }
  function getAssets() {
    return typeof global.MCSAT_getPublishedAssets === 'function' ? global.MCSAT_getPublishedAssets() || [] : [];
  }
  function getCollections() {
    return typeof global.MCSAT_getCollections === 'function' ? global.MCSAT_getCollections() || [] : [];
  }
  function findAsset(id) {
    if (typeof global.MCSAT_findAssetById === 'function') return global.MCSAT_findAssetById(id);
    return getAssets().find(function (a) {
      return String(a.id) === String(id);
    });
  }
  function pathHash(p) {
    return ('#/' + String(p || '/marketplace').replace(/^\/+/, '')).replace(/^#\/#/, '#/');
  }
  function go(p) {
    try {
      global.location.hash = pathHash(p);
    } catch (e) {}
  }
  function normalizeHashFragment() {
    var raw = String(global.location.hash || '').replace(/^#/, '');
    try {
      raw = decodeURIComponent(raw);
    } catch (e0) {}
    raw = String(raw || '').replace(/^\/+/, '').trim();
    if (raw.indexOf('sat-marketplace') === 0) return 'marketplace' + raw.slice('sat-marketplace'.length);
    if (raw.indexOf('sat-market') === 0) return 'marketplace' + raw.slice('sat-market'.length);
    return raw;
  }
  function parseRoute() {
    var h = normalizeHashFragment();
    if (h === 'marketplace') return { mode: 'browse', assetId: null, collectionSlug: null };
    if (h.indexOf('marketplace/collection/') === 0)
      return { mode: 'browse', assetId: null, collectionSlug: decodeURIComponent(h.split('/').slice(2).join('/')) };
    if (h.indexOf('marketplace/asset/') === 0)
      return { mode: 'detail', assetId: decodeURIComponent(h.split('/').slice(2).join('/')), collectionSlug: null };
    return null;
  }
  function suppressOverlay_() {
    try {
      if (typeof global.mcShouldSuppressSatPublicOverlay === 'function') {
        return !!global.mcShouldSuppressSatPublicOverlay();
      }
    } catch (eSo) {}
    return false;
  }

  function quickTabs() {
    return [
      ['all', '全部'],
      ['Specimen Image', '標本影像'],
      ['Research Data', '研究資料'],
      ['Usage License', '使用授權'],
      ['Collection Edition', '收藏版本'],
      ['Education Material', '教學素材'],
      ['Verified', '已驗證'],
      ['Graded', '已評分'],
    ];
  }

  function tabOk(a) {
    if (ui.categoryTab === 'all') return true;
    if (ui.categoryTab === 'Verified') return lower(a.verificationStatus) === 'verified';
    if (ui.categoryTab === 'Graded') return !!String(a.scientificGrade || '').trim();
    return String(a.assetType || '') === ui.categoryTab;
  }

  function collectionPass(a) {
    if (!ui.collectionSlug) return true;
    var cols = getCollections();
    for (var i = 0; i < cols.length; i++) {
      if (cols[i].slug === ui.collectionSlug) return a.collection === cols[i].filterCollection;
    }
    return true;
  }

  function licensePass(a) {
    if (!ui.sfLicense.length) return true;
    var lt = lower(a.licenseType || '');
    for (var i = 0; i < ui.sfLicense.length; i++) {
      var key = ui.sfLicense[i];
      if (key === 'display' && lt.indexOf('personal') >= 0) return true;
      if (key === 'academic' && (lt.indexOf('research') >= 0 || lt.indexOf('citation') >= 0)) return true;
      if (key === 'education' && lt.indexOf('educational') >= 0) return true;
      if (key === 'commercial' && lt.indexOf('commercial') >= 0) return true;
      if (key === 'collector' && lt.indexOf('personal') >= 0) return true;
    }
    return false;
  }

  function verifyPass(a) {
    if (!ui.sfVerify.length) return true;
    var ok = false;
    for (var i = 0; i < ui.sfVerify.length; i++) {
      var v = ui.sfVerify[i];
      if (v === 'curator' && lower(a.verificationStatus).indexOf('verified') >= 0) ok = true;
      if (v === 'graded' && String(a.scientificGrade || '').trim()) ok = true;
      if (v === 'provenance' && a.provenance && a.provenance.length >= 2) ok = true;
    }
    return ok;
  }

  function priceBandPass(a) {
    if (!ui.sfPriceBand) return true;
    var p = Number(a.price) || 0;
    var av = String(a.availability || '');
    if (ui.sfPriceBand === 'free') return p === 0 && av.indexOf('Inquiry') < 0;
    if (ui.sfPriceBand === 'u25') return p > 0 && p < 25;
    if (ui.sfPriceBand === 'u100') return p >= 25 && p <= 100;
    if (ui.sfPriceBand === 'inquiry') return av.indexOf('Inquiry') >= 0;
    return true;
  }

  function pass(a) {
    if (!tabOk(a)) return false;
    if (!collectionPass(a)) return false;
    if (!passSfCats(a)) return false;
    if (ui.sfAType.length) {
      var at = String(a.assetType || '');
      var okAt = false;
      for (var j = 0; j < ui.sfAType.length; j++) {
        var want = ui.sfAType[j];
        if (want === 'Educational Pack' && at === 'Education Material') okAt = true;
        else if (at === want) okAt = true;
      }
      if (!okAt) return false;
    }
    if (!licensePass(a)) return false;
    if (!verifyPass(a)) return false;
    if (!priceBandPass(a)) return false;
    var q = lower(ui.q);
    if (!q) return true;
    return (
      lower(
        [a.id, a.title, a.scientificName, a.commonName, a.category, a.origin, a.collection, a.assetType, a.licenseType, a.verificationStatus].join(' ')
      ).indexOf(q) >= 0
    );
  }

  function pseudoViews(id) {
    var s = String(id || '');
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return 180 + (h % 4200);
  }

  function gradeRank(g) {
    var x = lower(String(g || ''));
    if (x.indexOf('a') >= 0) return 3;
    if (x.indexOf('b') >= 0) return 2;
    if (x.indexOf('c') >= 0) return 1;
    return 0;
  }

  function sorted(list) {
    var out = list.slice();
    if (ui.sort === 'priceAsc') out.sort(function (a, b) { return Number(a.price) - Number(b.price); });
    else if (ui.sort === 'priceDesc') out.sort(function (a, b) { return Number(b.price) - Number(a.price); });
    else if (ui.sort === 'views') out.sort(function (a, b) { return pseudoViews(b.id) - pseudoViews(a.id); });
    else if (ui.sort === 'grade')
      out.sort(function (a, b) {
        return gradeRank(b.scientificGrade) - gradeRank(a.scientificGrade);
      });
    else out.sort(function (a, b) { return String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')); });
    return out;
  }

  function filtered() {
    return sorted(getAssets().filter(pass));
  }

  function priceLabel(a) {
    if (!a) return '—';
    if (a.availability === 'Inquiry only') return '詢價';
    if (a.availability === 'Free display') return '免費';
    return Number(a.price) > 0 ? esc(String(a.currency || 'USD')) + ' ' + Number(a.price) : '—';
  }

  function typeBadgeZh(t) {
    var m = {
      'Specimen Image': '標本影像',
      'Research Data': '研究資料',
      'Usage License': '使用授權',
      'Collection Edition': '收藏版本',
      'Education Material': '教學素材',
      'Educational Pack': '教學授權包',
    };
    return m[t] || t || '資產';
  }

  function categoryMatchesFilter(sel, a) {
    if (!sel) return true;
    var blob = lower((a.category || '') + ' ' + (a.title || '') + ' ' + (a.scientificName || '') + ' ' + (a.commonName || ''));
    if (sel === 'Beetle') return a.category === 'Insect' && /beetle|甲蟲|鍬形|coleoptera|scarab|lucanid/i.test(blob);
    if (sel === 'Shell' || sel === 'Fish') return a.category === 'Marine' || /fish|shell|marine|jar|deep/i.test(blob);
    if (sel === 'Seed') return a.category === 'Plant' && /seed|種子/i.test(blob);
    return a.category === sel;
  }

  function passSfCats(a) {
    if (!ui.sfCat.length) return true;
    for (var i = 0; i < ui.sfCat.length; i++) {
      if (categoryMatchesFilter(ui.sfCat[i], a)) return true;
    }
    return false;
  }

  function phKind_(a) {
    var blob = lower((a.category || '') + ' ' + (a.assetType || '') + ' ' + (a.title || '') + ' ' + (a.commonName || ''));
    if (/fossil|trilobit|三葉|古生物/.test(blob)) return 'fossil';
    if (/marine|fish|shell|jar|deep|sea|rattail|macrouridae/.test(blob)) return 'marine';
    if (/plant|botanical|seed|herbarium|fern/.test(blob)) return 'plant';
    if (/research|data|venation|stack|paper|digitized/.test(blob)) return 'research';
    if (/beetle|insect|scarab|butterfly|coleoptera|lucanid|ant|dragon/.test(blob)) return 'beetle';
    return 'neutral';
  }

  function gridThumbOnly(a) {
    return String((a && a.thumbnailUrl) || '').trim();
  }

  function rarityTierCode(a) {
    var r = lower(a.rarity || '');
    if (r.indexOf('sensitive') >= 0 || r.indexOf('embargo') >= 0) return 'SEC';
    if (r.indexOf('reference') >= 0) return 'SR';
    if (r.indexOf('collector') >= 0) return 'R';
    if (r.indexOf('bundle') >= 0) return 'C';
    if (r.indexOf('teaching') >= 0 || r.indexOf('common') >= 0) return 'U';
    return 'R';
  }

  function categoryRibbonZh(a) {
    var c = String(a.category || '');
    var m = { Insect: 'INSECTA', Plant: 'PLANTAE', Fossil: 'FOSSILIA', Marine: 'MARINE' };
    return m[c] || c.toUpperCase() || 'ASSET';
  }

  function mediaHtml(a, tall) {
    var badgesTop =
      '<div class="sat-asset-badges"><span class="sat-badge sat-badge--muted">' +
      esc(typeBadgeZh(a.assetType)) +
      '</span>' +
      (lower(a.verificationStatus) === 'verified'
        ? '<span class="sat-badge">' + esc('已驗證') + '</span>'
        : a.scientificGrade
          ? '<span class="sat-badge sat-badge--gold">' + esc(a.scientificGrade) + '</span>'
          : '<span class="sat-badge sat-badge--gold">SAT</span>') +
      '</div>';
    var hover =
      '<div class="sat-asset-hover-actions">' +
      '<button type="button" data-mc-drawer="' +
      escAttr(a.id) +
      '">查看詳情</button>' +
      '<button type="button" data-mc-watch="' +
      escAttr(a.id) +
      '">加入關注</button></div>';
    if (MC_SAT_MP_GRID_NO_IMAGES) {
      return (
        '<div class="sat-asset-media sat-card-media sat-card-media-placeholder sat-passport-card__stage sat-ph--' +
        escAttr(phKind_(a)) +
        '">' +
        badgesTop +
        '<div class="sat-placeholder-mark" aria-hidden="true">SAT</div>' +
        '<div class="sat-placeholder-label">Specimen Image Preview Disabled</div>' +
        hover +
        '</div>'
      );
    }
    var url = gridThumbOnly(a);
    if (url) {
      return (
        '<div class="sat-asset-media sat-passport-card__stage">' +
        badgesTop +
        '<img class="sat-asset-image" loading="lazy" decoding="async" width="600" height="420" src="' +
        escAttr(url) +
        '" alt="' +
        escAttr(a.title || '') +
        '"/>' +
        hover +
        '</div>'
      );
    }
    var k = phKind_(a);
    return (
      '<div class="sat-asset-media sat-asset-media--ph sat-ph--' +
      escAttr(k) +
      '">' +
      badgesTop +
      '<div class="sat-ph-icon" aria-hidden="true"></div><div class="sat-ph-label">' +
      esc(typeBadgeZh(a.assetType)) +
      ' · ' +
      esc(a.category || 'Scientific asset') +
      '</div>' +
      hover +
      '</div>'
    );
  }

  function card(a) {
    var wl = !!ui.watchlist[a.id];
    var tier = esc(rarityTierCode(a));
    var ribbon = esc(categoryRibbonZh(a));
    return (
      '<article class="sat-passport-card sat-asset-card" tabindex="0" role="group" data-asset-id="' +
      escAttr(a.id) +
      '"><div class="sat-passport-card__frame">' +
      '<div class="sat-passport-card__top"><span class="sat-passport-card__id">' +
      esc(a.id || '') +
      '</span><span class="sat-passport-card__tier" aria-label="Rarity">' +
      tier +
      '</span></div>' +
      mediaHtml(a) +
      '<div class="sat-passport-card__ribbon">' +
      ribbon +
      '</div><div class="sat-passport-card__titles"><p class="sat-passport-card__sci">' +
      esc(a.scientificName || '—') +
      '</p><p class="sat-passport-card__common">' +
      esc(a.commonName || a.title || '') +
      '</p></div><div class="sat-passport-card__meta-grid"><div><span class="sat-passport-card__lbl">產地</span><span class="sat-passport-card__val">' +
      esc(a.origin || '—') +
      '</span></div><div><span class="sat-passport-card__lbl">授權</span><span class="sat-passport-card__val">' +
      esc(typeBadgeZh(a.assetType)) +
      '</span></div><div><span class="sat-passport-card__lbl">審查</span><span class="sat-passport-card__val">' +
      esc(a.verificationStatus || '—') +
      '</span></div><div><span class="sat-passport-card__lbl">價格</span><span class="sat-passport-card__val sat-price">' +
      esc(priceLabel(a)) +
      '</span></div></div><div class="sat-passport-card__bar" aria-hidden="true"><span class="sat-passport-card__bar-fill"></span></div><div class="sat-asset-footer sat-passport-card__actions"><button type="button" class="sat-asset-footer__btn" data-mc-drawer="' +
      escAttr(a.id) +
      '">查看詳情</button><button type="button" class="sat-icon-btn" data-mc-watch="' +
      escAttr(a.id) +
      '" title="關注">' +
      (wl ? '★' : '☆') +
      '</button><span class="sat-license-ready">' +
      (a.licenseType ? '授權就緒' : '') +
      '</span></div></div></article>'
    );
  }

  function collThumbs(c) {
    var pub = getAssets().filter(function (a) {
      return a.collection === c.filterCollection;
    });
    var bits = pub
      .slice(0, 3)
      .map(function (a) {
        if (MC_SAT_MP_GRID_NO_IMAGES) {
          return '<span class="sat-coll-thumb sat-coll-thumb--ph sat-ph--' + escAttr(phKind_(a)) + '"></span>';
        }
        var u = gridThumbOnly(a);
        if (u) return '<span style="background-image:url(' + escAttr(u) + ');background-size:cover;background-position:center;"></span>';
        return '<span class="sat-ph--' + escAttr(phKind_(a)) + '" style="background:linear-gradient(145deg,#1a2420,#0a1010);"></span>';
      })
      .join('');
    return bits || '<span></span><span></span><span></span>';
  }

  function collectionRail() {
    var cols = getCollections().slice(0, 5);
    return (
      '<section class="sat-coll-section" id="collections"><div class="sat-coll-section__head"><h2>Featured Collections</h2></div><div class="sat-coll-rail">' +
      cols
        .map(function (c) {
          var cat = esc(c.filterCollection || 'Collection');
          return (
            '<button type="button" class="sat-coll-card" data-route="/marketplace/collection/' +
            escAttr(c.slug) +
            '"><div class="sat-coll-card__bg sat-ph--beetle"></div><div class="sat-coll-card__inner"><div><h3>' +
            esc(c.title) +
            '</h3><p style="margin:4px 0 0;font-size:12px;opacity:.85">' +
            cat +
            '</p></div><div class="sat-coll-card__row"><span>' +
            esc(String(c.itemCount)) +
            ' 件</span>' +
            (c.verified ? '<span class="sat-badge">已驗證</span>' : '') +
            '</div><div class="sat-coll-card__thumbs">' +
            collThumbs(c) +
            '</div></div></button>'
          );
        })
        .join('') +
      '</div></section>'
    );
  }

  function heroPreviewMedia(a) {
    if (MC_SAT_MP_GRID_NO_IMAGES) {
      var hk = a ? phKind_(a) : 'beetle';
      return (
        '<div class="sat-market-card__media sat-card-media sat-card-media-placeholder sat-ph--' +
        escAttr(hk) +
        '"><div class="sat-placeholder-mark" aria-hidden="true">SAT</div><div class="sat-placeholder-label">Specimen Image Preview Disabled</div></div>'
      );
    }
    if (!a) return '<div class="sat-market-card__media sat-asset-media--ph sat-ph--beetle"><div class="sat-ph-icon"></div><div class="sat-ph-label">Scientific asset preview</div></div>';
    var url = gridThumbOnly(a);
    if (url) {
      return (
        '<div class="sat-market-card__media"><img class="sat-asset-image" loading="lazy" decoding="async" width="600" height="420" src="' +
        escAttr(url) +
        '" alt="' +
        escAttr(a.title || '') +
        '"/></div>'
      );
    }
    return (
      '<div class="sat-market-card__media sat-asset-media--ph sat-ph--' +
      escAttr(phKind_(a)) +
      '"><div class="sat-ph-icon"></div><div class="sat-ph-label">' +
      esc(typeBadgeZh(a.assetType)) +
      '</div></div>'
    );
  }

  function heroBlock(heroAsset) {
    var previewInner = heroPreviewMedia(heroAsset);
    return (
      '<section class="sat-market-hero"><div class="sat-market-hero__text"><p class="sat-market-kicker">SAT Scientific Asset Marketplace</p><h1 class="sat-market-title">SAT 科學資產市集</h1><p class="sat-market-sub">收藏、授權與探索可追溯的標本影像、研究資料與科學收藏版本。</p><p class="sat-market-desc">以詮釋資料與授權條款為核心：連結學名、產地、審查紀錄與館方／研究用途，支援教學、研究與機構展示。</p><div class="sat-market-hero__cta"><button type="button" class="sat-btn sat-btn--primary" data-mc-jump="grid">探索資產</button><button type="button" class="sat-btn sat-btn--ghost" data-mc-jump="collections">查看精選收藏</button><button type="button" class="sat-btn sat-btn--ghost" data-route="/section/workflow">了解 SAT 證照</button></div><div class="sat-market-stats"><span>1,280+ 科學資產</span><span>86 已驗證收藏</span><span>42 授權素材包</span><span>12 博物館典藏合作</span></div><div class="sat-market-trust"><span class="sat-trust-badge">來源追溯</span><span class="sat-trust-badge">詮釋資料已驗證</span><span class="sat-trust-badge">授權就緒</span><span class="sat-trust-badge">研究引用友善</span></div></div><div class="sat-market-hero__preview"><div class="sat-market-card">' +
      previewInner +
      '<div class="sat-market-card__body"><h3>' +
      esc(heroAsset ? heroAsset.title : '精選標本資產') +
      '</h3><p class="sci">' +
      esc(heroAsset ? heroAsset.scientificName : '—') +
      '</p><div class="sat-market-card__meta"><span>' +
      esc(heroAsset ? heroAsset.origin : '') +
      '</span><span class="sat-price">' +
      esc(heroAsset ? priceLabel(heroAsset) : '') +
      '</span></div></div></div></div></section>'
    );
  }

  function commandBar() {
    return (
      '<div class="sat-command"><input class="sat-command__search" type="search" data-mc-search placeholder="搜尋學名、SAT ID、產地、分類、授權類型…" value="' +
      escAttr(ui.q) +
      '"/><div class="sat-command__pills">' +
      quickTabs()
        .map(function (t) {
          return (
            '<button type="button" class="sat-pill' +
            (ui.categoryTab === t[0] ? ' is-active' : '') +
            '" data-mc-tab="' +
            escAttr(t[0]) +
            '">' +
            esc(t[1]) +
            '</button>'
          );
        })
        .join('') +
      '</div><div class="sat-command__right"><button type="button" class="sat-btn sat-command__filter-mob" data-mc-filter-sheet>篩選</button><select class="sat-command__sort" data-mc-sort>' +
      '<option value="newest"' +
      (ui.sort === 'newest' ? ' selected' : '') +
      '>最新上架</option>' +
      '<option value="views"' +
      (ui.sort === 'views' ? ' selected' : '') +
      '>最受關注</option>' +
      '<option value="grade"' +
      (ui.sort === 'grade' ? ' selected' : '') +
      '>評分最高</option>' +
      '<option value="priceAsc"' +
      (ui.sort === 'priceAsc' ? ' selected' : '') +
      '>價格由低至高</option>' +
      '<option value="priceDesc"' +
      (ui.sort === 'priceDesc' ? ' selected' : '') +
      '>價格由高至低</option></select><div class="sat-view-toggle"><button type="button" class="' +
      (ui.viewLayout === 'grid' ? 'is-active' : '') +
      '" data-mc-view="grid">網格</button><button type="button" class="' +
      (ui.viewLayout === 'compact' ? 'is-active' : '') +
      '" data-mc-view="compact">緊湊</button></div></div></div>'
    );
  }

  function chk(name, value, arr, labelZh) {
    var on = arr.indexOf(value) >= 0;
    return (
      '<label><input type="checkbox" data-mc-sf="' +
      escAttr(name) +
      '" value="' +
      escAttr(value) +
      '"' +
      (on ? ' checked' : '') +
      '/> ' +
      esc(labelZh || value) +
      '</label>'
    );
  }

  function sidebar() {
    var cats = ['Insect', 'Beetle', 'Shell', 'Seed', 'Fish', 'Plant', 'Fossil'];
    var atypes = ['Specimen Image', 'Research Data', 'Usage License', 'Collection Edition', 'Educational Pack'];
    var licenses = [
      ['display', '僅展示'],
      ['academic', '學術使用'],
      ['education', '教育使用'],
      ['commercial', '商業使用'],
      ['collector', '收藏版本'],
    ];
    var vers = [
      ['curator', '館方已驗證'],
      ['graded', 'SAT 已評分'],
      ['provenance', '來源鏈完整'],
    ];
    return (
      '<aside class="sat-sidebar' +
      (ui.filterSheet ? ' is-open' : '') +
      '"><div class="sat-sidebar__head"><h3>篩選</h3><button type="button" class="sat-sidebar__clear" data-mc-clear>清除全部</button></div><div class="sat-filter-block"><h4>資產類型</h4>' +
      atypes
        .map(function (x) {
          var store = x === 'Educational Pack' ? 'Educational Pack' : x;
          return chk('atype', store, ui.sfAType, typeBadgeZh(x === 'Educational Pack' ? 'Educational Pack' : x));
        })
        .join('') +
      '</div><div class="sat-filter-block"><h4>類別</h4>' +
      cats
        .map(function (c) {
          return chk('cat', c, ui.sfCat, c);
        })
        .join('') +
      '</div><div class="sat-filter-block"><h4>授權</h4>' +
      licenses
        .map(function (L) {
          return chk('lic', L[0], ui.sfLicense, L[1]);
        })
        .join('') +
      '</div><div class="sat-filter-block"><h4>驗證</h4>' +
      vers
        .map(function (L) {
          return chk('ver', L[0], ui.sfVerify, L[1]);
        })
        .join('') +
      '</div><div class="sat-filter-block"><h4>價格</h4>' +
      '<label><input type="radio" name="sat-pr" data-mc-price="" value=""' +
      (!ui.sfPriceBand ? ' checked' : '') +
      '/> 不限</label>' +
      '<label><input type="radio" name="sat-pr" data-mc-price="free" value="free"' +
      (ui.sfPriceBand === 'free' ? ' checked' : '') +
      '/> 免費</label>' +
      '<label><input type="radio" name="sat-pr" data-mc-price="u25" value="u25"' +
      (ui.sfPriceBand === 'u25' ? ' checked' : '') +
      '/> 低於 USD 25</label>' +
      '<label><input type="radio" name="sat-pr" data-mc-price="u100" value="u100"' +
      (ui.sfPriceBand === 'u100' ? ' checked' : '') +
      '/> USD 25–100</label>' +
      '<label><input type="radio" name="sat-pr" data-mc-price="inquiry" value="inquiry"' +
      (ui.sfPriceBand === 'inquiry' ? ' checked' : '') +
      '/> 詢價</label></div></aside>'
    );
  }

  function drawerPanel(a) {
    if (!a) {
      return (
        '<div class="sat-drawer-backdrop is-open" data-mc-drawer-close></div><aside class="sat-drawer is-open"><div class="sat-drawer__head"><span>資產</span><button type="button" class="sat-drawer__close" data-mc-drawer-close>關閉</button></div><div class="sat-drawer__scroll"><p>找不到此資產。</p></div></aside>'
      );
    }
    var prov =
      (a.provenance || [])
        .map(function (p) {
          return '<li><strong>' + esc(p.date || '') + '</strong> · ' + esc(p.event || '') + '</li>';
        })
        .join('') || '<li>—</li>';
    var img = String(a.imageUrl || a.thumbnailUrl || '').trim();
    var big;
    if (MC_SAT_MP_GRID_NO_IMAGES) {
      big =
        '<div class="sat-drawer__media sat-card-media sat-card-media-placeholder sat-ph--' +
        escAttr(phKind_(a)) +
        '"><div class="sat-placeholder-mark" aria-hidden="true">SAT</div><div class="sat-placeholder-label">Detail image preview disabled</div></div>';
    } else if (img) {
      big =
        '<div class="sat-drawer__media"><img class="sat-asset-image" loading="lazy" src="' +
        escAttr(img) +
        '" alt="' +
        escAttr(a.title || '') +
        '"/></div>';
    } else {
      big =
        '<div class="sat-drawer__media sat-asset-media--ph sat-ph--' +
        escAttr(phKind_(a)) +
        '"><div class="sat-ph-icon"></div><div class="sat-ph-label">' +
        esc(typeBadgeZh(a.assetType)) +
        '</div></div>';
    }
    return (
      '<div class="sat-drawer-backdrop is-open" data-mc-drawer-close></div><aside class="sat-drawer is-open"><div class="sat-drawer__head"><span style="font-size:13px;opacity:.85">' +
      esc(a.id || '') +
      '</span><button type="button" class="sat-drawer__close" data-mc-drawer-close>關閉</button></div><div class="sat-drawer__scroll">' +
      big +
      '<h2>' +
      esc(a.title || '') +
      '</h2><p class="sci">' +
      esc(a.scientificName || '') +
      '</p><div class="sat-drawer__price">' +
      esc(priceLabel(a)) +
      ' · ' +
      esc(a.licenseType || '') +
      '</div><div class="sat-drawer__section"><h4>資產資訊</h4><dl class="sat-drawer__dl"><div><dt>SAT ID</dt><dd>' +
      esc(a.id || '') +
      '</dd></div><div><dt>類別</dt><dd>' +
      esc(a.category || '') +
      '</dd></div><div><dt>產地</dt><dd>' +
      esc(a.origin || '') +
      '</dd></div><div><dt>更新</dt><dd>' +
      esc(a.updatedAt || '') +
      '</dd></div><div><dt>建立者</dt><dd>' +
      esc(a.ownerId || '—') +
      '</dd></div></dl></div><div class="sat-drawer__section"><h4>授權摘要</h4><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(210,218,205,.9)">' +
      esc(a.licenseType || '') +
      ' · ' +
      esc(a.availability || '') +
      '</p></div><div class="sat-drawer__section"><h4>SAT 評分</h4><p style="margin:0">' +
      esc(a.scientificGrade || '—') +
      ' · ' +
      esc(a.rarity || '') +
      '</p></div><div class="sat-drawer__section"><h4>來源與流傳</h4><ul style="margin:0;padding-left:18px;color:rgba(210,218,205,.9);font-size:14px;line-height:1.55">' +
      prov +
      '</ul></div><div class="sat-drawer__section"><h4>付款方式</h4><p style="margin:0;font-size:13px;color:rgba(190,200,185,.9)">Card · USDC · USDT（示範介面）</p></div><p style="font-size:14px;line-height:1.65;color:rgba(200,210,195,.92)">' +
      esc(a.description || '') +
      '</p></div><div class="sat-drawer__cta-bar"><button type="button" class="sat-btn sat-btn--primary" data-mc-toast="已記錄授權請求（示範）">取得授權</button><button type="button" class="sat-btn sat-btn--ghost" data-mc-toast="已傳送聯絡請求（示範）">聯絡擁有者</button><button type="button" class="sat-btn sat-btn--ghost" data-mc-watch="' +
      escAttr(a.id) +
      '" data-mc-toast="已加入收藏（示範）">收藏</button></div></aside>'
    );
  }

  function trustBand() {
    return (
      '<section class="sat-trust-band"><h3>授權與信任</h3><p>本平台以<strong>可追溯詮釋資料</strong>與<strong>授權優先</strong>為核心：資產附帶審查狀態、授權條款與學名／產地等科學欄位。實際交易、進出口與機構政策仍須遵循所在地法規與館方規範。</p><div class="sat-trust-list"><span class="sat-trust-badge">附錄式敘事</span><span class="sat-trust-badge">詮釋資料可追溯</span><span class="sat-trust-badge">教育示範優先</span></div></section>'
    );
  }

  function creatorCta() {
    return (
      '<section class="sat-creator-cta"><div><strong style="font-size:16px">上架科學資產</strong><p>於標本護照完成資料與審查後，即可將授權就緒的影像與文件帶入市集展示區（示範流程）。</p></div><button type="button" class="sat-btn sat-btn--primary" data-route="/section/card-generator">前往護照工作台</button></section>'
    );
  }

  function browse() {
    var all = filtered();
    var show = all.slice(0, ui.visible);
    var hasMore = all.length > ui.visible;
    var heroA = all[0] || getAssets()[0];
    var gridCls = 'sat-asset-grid' + (ui.viewLayout === 'compact' ? ' sat-asset-grid--compact' : '');
    var drawer = ui.drawerAssetId ? drawerPanel(findAsset(ui.drawerAssetId)) : '';
    var empty =
      '<div class="sat-empty"><h3>找不到符合條件的資產</h3><p>請調整搜尋關鍵字、快速篩選或左側條件；亦可清除全部後重新探索。</p><button type="button" class="sat-btn sat-btn--ghost" data-mc-clear>清除全部條件</button></div>';
    return (
      '<div class="sat-public-marketplace">' +
      drawer +
      '<div class="sat-marketplace-shell">' +
      heroBlock(heroA) +
      collectionRail() +
      commandBar() +
      '<div class="sat-layout"><div class="sat-sidebar-backdrop' +
      (ui.filterSheet ? ' is-visible' : '') +
      '" data-mc-filter-close></div>' +
      sidebar() +
      '<div class="sat-main"><div class="sat-main-toolbar"><span class="sat-main-toolbar__count">共 ' +
      esc(String(all.length)) +
      ' 項科學資產</span></div><div id="grid" class="' +
      gridCls +
      '">' +
      (show.length ? show.map(card).join('') : empty) +
      '</div>' +
      (hasMore ? '<button type="button" class="sat-load-more" data-mc-more>載入更多</button>' : '') +
      trustBand() +
      creatorCta() +
      '</div></div></div><div class="sat-toast-host"><div id="satMcToastInner" class="sat-toast"></div></div></div>'
    );
  }

  function showToast(msg) {
    try {
      var el = document.getElementById('satMcToastInner');
      if (!el) return;
      el.textContent = msg;
      el.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        el.classList.remove('is-visible');
      }, 2400);
    } catch (eT) {}
  }

  function auditReport_() {
    var assets = getAssets();
    var host = document.getElementById(HOST_ID);
    var renderedImgCount = host ? host.querySelectorAll('img').length : 0;
    var report = {
      totalAssetCount: assets.length,
      initialImageLoadCount: Math.min(PAGE_SIZE, assets.length),
      detailAsThumbnailCount: assets.filter(function (a) {
        return a.thumbnailUrl && a.imageUrl && String(a.thumbnailUrl) === String(a.imageUrl);
      }).length,
      thumbnailMissingCount: assets.filter(function (a) {
        return !a.thumbnailUrl;
      }).length,
      gridNoImagesMode: MC_SAT_MP_GRID_NO_IMAGES,
      imageDownloadsExpected: MC_SAT_MP_GRID_NO_IMAGES ? 0 : Math.min(PAGE_SIZE, assets.length),
      renderedImgTagCount: renderedImgCount,
      lazyLoadingEnabled: true,
    };
    try {
      console.info('[SAT Marketplace Performance Report]', report);
    } catch (e1) {}
    return report;
  }

  function ensureHost() {
    var el = document.getElementById(HOST_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = HOST_ID;
      el.setAttribute('data-public-root', '1');
      document.body.appendChild(el);
    }
    el.className = 'mc-sat-pub-host';
    el.style.display = 'block';
    return el;
  }
  function hidePublicPage() {
    var el = document.getElementById(HOST_ID);
    if (el) {
      el.style.display = 'none';
      el.innerHTML = '';
    }
    clearTimeout(timer);
    timer = null;
  }

  function paint(opts) {
    opts = opts || {};
    if (suppressOverlay_()) {
      hidePublicPage();
      return;
    }
    var r = parseRoute();
    if (!r) {
      hidePublicPage();
      return;
    }
    try {
      if (typeof global.ensureGlobalHeader === 'function') {
        global.ensureGlobalHeader('/marketplace');
      }
    } catch (eHdr) {}
    ui.collectionSlug = r.mode === 'browse' ? r.collectionSlug || null : null;
    if (r.mode === 'detail' && r.assetId) ui.drawerAssetId = r.assetId;
    else if (r.mode === 'browse') ui.drawerAssetId = null;
    var host = ensureHost();
    host.innerHTML = browse();
    if (!opts.keepScroll) {
      try {
        global.scrollTo(0, 0);
      } catch (eS) {}
    }
    auditReport_();
  }

  function toggleArr(arr, v, on) {
    var i = arr.indexOf(v);
    if (on && i === -1) arr.push(v);
    if (!on && i >= 0) arr.splice(i, 1);
  }

  document.addEventListener(
    'click',
    function (e) {
      var host = document.getElementById(HOST_ID);
      if (!host || host.style.display === 'none') return;
      var t = e.target;
      if (!host.contains(t)) return;
      var routeEl = t.closest('[data-route]');
      if (routeEl) {
        e.preventDefault();
        go(routeEl.getAttribute('data-route') || '/marketplace');
        paint({});
        return;
      }
      if (t.closest('[data-mc-drawer-close]')) {
        e.preventDefault();
        ui.drawerAssetId = null;
        go('/marketplace');
        paint({ keepScroll: true });
        return;
      }
      var dr = t.closest('[data-mc-drawer]');
      if (dr) {
        e.preventDefault();
        var id = dr.getAttribute('data-mc-drawer');
        ui.drawerAssetId = id;
        go('/marketplace/asset/' + encodeURIComponent(String(id || '')));
        paint({ keepScroll: true });
        return;
      }
      if (t.closest('[data-mc-clear]')) {
        e.preventDefault();
        ui.q = '';
        ui.categoryTab = 'all';
        ui.visible = PAGE_SIZE;
        ui.sfCat = [];
        ui.sfAType = [];
        ui.sfLicense = [];
        ui.sfVerify = [];
        ui.sfPriceBand = '';
        paint({ keepScroll: true });
        return;
      }
      if (t.closest('[data-mc-more]')) {
        e.preventDefault();
        ui.visible += PAGE_SIZE;
        paint({ keepScroll: true });
        return;
      }
      var tab = t.closest('[data-mc-tab]');
      if (tab) {
        e.preventDefault();
        ui.categoryTab = tab.getAttribute('data-mc-tab') || 'all';
        ui.visible = PAGE_SIZE;
        paint({ keepScroll: true });
        return;
      }
      var jump = t.closest('[data-mc-jump]');
      if (jump) {
        e.preventDefault();
        var id = jump.getAttribute('data-mc-jump') === 'collections' ? 'collections' : 'grid';
        var node = document.getElementById(id);
        if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      var vw = t.closest('[data-mc-view]');
      if (vw) {
        e.preventDefault();
        ui.viewLayout = vw.getAttribute('data-mc-view') === 'compact' ? 'compact' : 'grid';
        paint({ keepScroll: true });
        return;
      }
      if (t.closest('[data-mc-filter-sheet]')) {
        e.preventDefault();
        ui.filterSheet = true;
        paint({ keepScroll: true });
        return;
      }
      if (t.closest('[data-mc-filter-close]')) {
        e.preventDefault();
        ui.filterSheet = false;
        paint({ keepScroll: true });
        return;
      }
      var wt = t.closest('[data-mc-watch]');
      if (wt) {
        e.preventDefault();
        var wid = wt.getAttribute('data-mc-watch');
        ui.watchlist[wid] = !ui.watchlist[wid];
        var tw = wt.getAttribute('data-mc-toast');
        showToast(tw || (ui.watchlist[wid] ? '已加入關注清單（示範）' : '已從關注清單移除（示範）'));
        paint({ keepScroll: true });
        return;
      }
      var toastBtn = t.closest('[data-mc-toast]');
      if (toastBtn) {
        e.preventDefault();
        showToast(toastBtn.getAttribute('data-mc-toast') || '已處理');
        return;
      }
      var ac = t.closest('.sat-asset-card');
      if (ac && !t.closest('button')) {
        e.preventDefault();
        var aid = ac.getAttribute('data-asset-id');
        if (aid) {
          ui.drawerAssetId = aid;
          go('/marketplace/asset/' + encodeURIComponent(aid));
          paint({ keepScroll: true });
        }
        return;
      }
    },
    true
  );

  document.addEventListener(
    'input',
    function (e) {
      var t = e.target;
      var host = document.getElementById(HOST_ID);
      if (!host || host.style.display === 'none' || !host.contains(t)) return;
      if (t.matches('[data-mc-search]')) {
        var v = String(t.value || '');
        clearTimeout(timer);
        timer = setTimeout(function () {
          ui.q = v;
          ui.visible = PAGE_SIZE;
          paint({ keepScroll: true });
        }, DEBOUNCE_MS);
      }
    },
    true
  );

  document.addEventListener(
    'change',
    function (e) {
      var t = e.target;
      var host = document.getElementById(HOST_ID);
      if (!host || host.style.display === 'none' || !host.contains(t)) return;
      if (t.matches('[data-mc-sort]')) {
        ui.sort = String(t.value || 'newest');
        ui.visible = PAGE_SIZE;
        paint({ keepScroll: true });
      }
      if (t.matches('[data-mc-sf]')) {
        var k = t.getAttribute('data-mc-sf');
        var v = t.value;
        var on = !!t.checked;
        if (k === 'cat') toggleArr(ui.sfCat, v, on);
        if (k === 'atype') toggleArr(ui.sfAType, v, on);
        if (k === 'lic') toggleArr(ui.sfLicense, v, on);
        if (k === 'ver') toggleArr(ui.sfVerify, v, on);
        ui.visible = PAGE_SIZE;
        paint({ keepScroll: true });
      }
      if (t.matches('[data-mc-price]')) {
        ui.sfPriceBand = t.getAttribute('data-mc-price') || '';
        ui.visible = PAGE_SIZE;
        paint({ keepScroll: true });
      }
    },
    true
  );

  global.addEventListener('hashchange', function () {
    var r = parseRoute();
    if (r) paint({ keepScroll: true });
    else hidePublicPage();
  });

  global.MCSatPublicMarketplace = {
    hidePublicPage: hidePublicPage,
    renderPublicPage: function () {
      paint({});
    },
    renderPublicAssetDetail: function (id) {
      go('/marketplace/asset/' + encodeURIComponent(String(id || '')));
      paint({});
    },
    renderRoute: function () {
      paint({});
    },
    goTo: function (path) {
      go(path || '/marketplace');
      paint({});
    },
    resolveTradeItem: function (id) {
      var a = findAsset(id);
      if (!a) return null;
      return {
        id: a.id,
        name: a.title || a.scientificName,
        creator: a.ownerId || 'MCurator',
        price: priceLabel(a),
        description: (a.assetType || '') + ' · ' + (a.origin || ''),
      };
    },
    getUi: function () {
      return { q: ui.q, sort: ui.sort, visible: ui.visible, viewLayout: ui.viewLayout };
    },
    resetUi: function () {
      ui.q = '';
      ui.sort = 'newest';
      ui.visible = PAGE_SIZE;
      ui.categoryTab = 'all';
      ui.sfCat = [];
      ui.sfAType = [];
      ui.sfLicense = [];
      ui.sfVerify = [];
      ui.sfPriceBand = '';
      ui.viewLayout = 'grid';
      ui.drawerAssetId = null;
      ui.filterSheet = false;
      try {
        go('/marketplace');
      } catch (eR) {}
      paint({});
    },
    getPerfAudit: auditReport_,
    openGuideModal: function () {
      var mask = document.getElementById('satGuideMask');
      var body = document.getElementById('satGuideBody');
      if (body) {
        body.innerHTML =
          '<section style="padding:8px 0;"><h4>關於 SAT 市集</h4><p style="color:#9aa89a;line-height:1.55;">公開市集與「SAT市場」（控制台標本護照）分開：此處瀏覽已發布的科學資產；於 SAT市場編輯後可上架。</p></section>';
      }
      if (mask) mask.style.display = 'flex';
    },
  };
  global.SatMarketplace = global.MCSatPublicMarketplace;
})(typeof window !== 'undefined' ? window : this);
