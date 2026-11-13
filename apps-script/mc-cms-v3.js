/**
 * MCurator CMS Editor v3 — single-file, local static compatible.
 * Shared renderer: MCCms3.renderPage(pageData, options) — options.mode: 'editor' | 'preview' | 'public'
 */
(function (W) {
  'use strict';
  var UVER = 'mc-unified-1';
  var V2 = 'content-v2';

  function g(id) { return document.getElementById(id); }
  function t(k) { return typeof W.t === 'function' ? W.t(k) : k; }
  function now() { return new Date().toISOString(); }
  function uid(p) { return (p || 's') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escA(s) { return esc(s).replace(/'/g, '&#39;'); }
  function clone(x) { try { return JSON.parse(JSON.stringify(x)); } catch (e) { return x; } }
  function len(s) { return (s == null ? '' : String(s)).length; }

  W.MCCS_LANGS = W.MCCS_LANGS || 'zh-TW,en'.split(',');

  var SECT_LABEL = {
    hero: 'Hero', featureCards: 'Feature cards', story: 'About / story', about: 'About / story',
    museumCollections: 'Museum collections', specimenPassport: 'Specimen passport',
    communityCta: 'Community CTA', tutorial: 'Tutorials & guides', marketplaceTeaser: 'Marketplace', faq: 'FAQ', footer: 'Footer', placeholder: 'Section'
  };

  var PAGES = [
    { id: 'welcome', title: 'Welcome / Landing' },
    { id: 'about', title: 'About' },
    { id: 'collections', title: 'Museum collections' },
    { id: 'community', title: 'Community' },
    { id: 'tutorials', title: 'Tutorials' },
    { id: 'market', title: 'SAT marketplace' },
    { id: 'footer', title: 'Footer' }
  ];

  var HINTS = { heroTitle: [20, 60], heroSub: [60, 140], cardTitle: [10, 32], cardBody: [40, 120], cta: [20, 50] };

  var _doc = null;
  var _pageId = 'welcome';
  var _sel = '';
  var _dev = 'desktop';
  var _mode = 'edit';
  var _lang = 'zh-TW';
  var _hist = { past: [], cur: null, cap: 40 };
  var _fut = [];
  var _dirty = false;
  var _saving = false;
  var _inspAdvanced = false;
  var _cfSel = 0;
  var CF_FILTER_DEFS = [
    { id: 'all', lab: '全部' },
    { id: 'verified', lab: '已核' },
    { id: 'featured', lab: '精選' },
    { id: 'insect', lab: '昆蟲' },
    { id: 'beetle', lab: '甲蟲' },
    { id: 'plant', lab: '植物' },
    { id: 'fossil', lab: '化石' },
    { id: 'mineral', lab: '礦物' },
    { id: 'fish', lab: '魚類' },
    { id: 'shell', lab: '貝類' },
    { id: 'mammal', lab: '哺乳類' },
    { id: 'bird', lab: '鳥類' },
    { id: 'reptile', lab: '爬蟲類' },
    { id: 'seed', lab: '種子' },
    { id: 'other', lab: '其他' },
  ];

  function v2l(C, L) {
    C = C || {};
    if (C[L] && typeof C[L] === 'object') return C[L];
    if (C['zh-TW']) return C['zh-TW'];
    if (C['en']) return C['en'];
    return {};
  }
  function defHero() {
    return { id: uid('hero'), type: 'hero', name: SECT_LABEL.hero, visible: true, order: 1, content: {
      eyebrow: '', title: '', subtitle: '', primaryButtonText: '', primaryButtonUrl: '', secondaryButtonText: '', secondaryButtonUrl: '',
      backgroundImageUrl: '', backgroundVideoUrl: '', imageAlt: '' }, design: { layout: 'center', theme: 'dark', height: 'medium', imageFocus: 'center' } };
  }
  function defPage(id) {
    var m = PAGES.filter(function (p) { return p.id === id; })[0];
    return { id: id, title: (m && m.title) || id, slug: '/', locale: _lang, status: 'draft', sections: [defHero()] };
  }
  function emptyDoc() {
    return { schemaVersion: UVER, pages: [defPage('welcome')], mediaLibrary: [], specimenCoverflow: null, updatedAt: now() };
  }

  function v2toEM(d) {
    var W0 = d && d.contentAreas && d.contentAreas.welcome;
    if (!W0 || !Array.isArray(W0.sections)) return null;
    var p = defPage('welcome');
    p.sections = [];
    var o = 1;
    W0.sections.slice().sort(function (a, b) { return (a.order | 0) - (b.order | 0); }).forEach(function (S) {
      if (!S || S.visible === false) return;
      var c = v2l(S.content, _lang);
      var u = { id: S.id || uid('s'), type: S.type, name: (SECT_LABEL[S.type] || S.type), visible: true, order: o++, content: {}, design: { imageFocus: (S.media && S.media.objectPosition) ? 'custom' : 'center' } };
      if (S.type === 'hero') {
        u.name = t('label_sec_hero') || SECT_LABEL.hero;
        u.content.eyebrow = c.badge || ''; u.content.title = c.title || ''; u.content.subtitle = c.subtitle || '';
        u.content.primaryButtonText = c.primaryCta || ''; u.content.primaryButtonUrl = c.primaryCtaUrl || '';
        u.content.secondaryButtonText = c.secondaryCta || ''; u.content.secondaryButtonUrl = c.secondaryCtaUrl || '';
        u.content.backgroundImageUrl = (S.media && S.media.fallbackImageUrl) || '';
        u.content.backgroundVideoUrl = (S.media && S.media.backgroundVideoUrls && S.media.backgroundVideoUrls[0]) || '';
        if (S.media && S.media.objectPosition) u.design.customObjectPosition = S.media.objectPosition;
      } else if (S.type === 'featureCards') {
        u.name = t('cs_sec_fgrid') || SECT_LABEL.featureCards;
        u.content.sectionTitle = c.sectionTitle || ''; u.content.sectionDek = c.sectionDek || '';
        u.content.cards = Array.isArray(S.cards) ? clone(S.cards) : [];
      } else if (S.type === 'story') {
        u.type = 'story';
        u.content.heading = c.title || '';
        u.content.body = c.body != null ? String(c.body) : '';
        u.content.rich = !!c.bodyHtml;
        u.content.bodyHtml = c.bodyHtml || '';
        u.content.imageUrl = (S.media && S.media.imageUrl) || '';
      } else {
        u.type = 'placeholder';
        u.content = { head: S.type, note: t('mc3_sec_placeholder') || 'This block is not fully editable in the visual editor yet. Use Advanced JSON if needed.' };
      }
      p.sections.push(u);
    });
    if (!p.sections.length) p.sections = [defHero()];
    var outEm = {
      schemaVersion: UVER,
      pages: [p],
      mediaLibrary: (d && d.mediaLibrary) ? clone(d.mediaLibrary) : [],
      updatedAt: d.updatedAt || now(),
    };
    if (d && d.specimenCoverflow) outEm.specimenCoverflow = clone(d.specimenCoverflow);
    return outEm;
  }

  function emWelcomePage() {
    for (var i = 0; _doc && _doc.pages && i < _doc.pages.length; i++) {
      if (_doc.pages[i].id === 'welcome') return _doc.pages[i];
    }
    return _doc && _doc.pages[0] ? _doc.pages[0] : defPage('welcome');
  }

  function emToV2() {
    if (!W.MCContentV2 || !W.MCContentV2.getDefault) {
      return {
        schemaVersion: V2,
        contentAreas: { welcome: { type: 'welcome', status: 'draft', sections: [] } },
        mediaLibrary: (_doc && _doc.mediaLibrary) || [],
        versionHistory: [],
        updatedAt: now(),
        editorModel: _doc,
        specimenCoverflow: _doc && _doc.specimenCoverflow ? clone(_doc.specimenCoverflow) : undefined,
      };
    }
    var base = clone(W.MCContentV2.getDefault());
    base.mediaLibrary = (_doc && _doc.mediaLibrary) || base.mediaLibrary || [];
    var Wd = base.contentAreas.welcome;
    Wd.sections = [];
    var p0 = emWelcomePage();
    var L = p0.locale || _lang;
    var n = 1;
    p0.sections.slice().sort(function (a, b) { return (a.order | 0) - (b.order | 0); }).forEach(function (S) {
      if (!S) return;
      var ty = (S.type === 'placeholder' || S.type === 'about') ? 'story' : S.type;
      var v = { id: S.id, type: ty, visible: S.visible !== false, order: n++, content: {}, media: {} };
      if (S.type === 'hero') {
        v.content[L] = { badge: S.content.eyebrow, title: S.content.title, subtitle: S.content.subtitle, primaryCta: S.content.primaryButtonText, primaryCtaUrl: S.content.primaryButtonUrl, secondaryCta: S.content.secondaryButtonText, secondaryCtaUrl: S.content.secondaryButtonUrl };
        v.media = { fallbackImageUrl: S.content.backgroundImageUrl, backgroundVideoUrls: S.content.backgroundVideoUrl ? [S.content.backgroundVideoUrl] : [], overlay: 0.55 };
        if (S.design && S.design.imageFocus === 'custom' && S.design.customObjectPosition) v.media.objectPosition = S.design.customObjectPosition;
      } else if (S.type === 'featureCards') {
        v.content[L] = { sectionTitle: S.content.sectionTitle, sectionDek: S.content.sectionDek };
        v.cards = S.content.cards || [];
      } else if (S.type === 'story' || S.type === 'about') {
        v.content[L] = { title: S.content.heading, body: S.content.rich ? undefined : S.content.body, bodyHtml: S.content.rich ? S.content.bodyHtml : undefined };
        v.media = { imageUrl: S.content.imageUrl || '' };
      } else {
        v.content[L] = { title: (S.name || ''), body: String((S.content && (S.content.note || S.content.body)) || ''), bodyHtml: '' };
        v.type = 'story';
      }
      Wd.sections.push(v);
    });
    base.contentAreas.welcome = Wd;
    base.schemaVersion = V2;
    base.updatedAt = now();
    base.editorModel = _doc;
    if (_doc && _doc.specimenCoverflow) base.specimenCoverflow = clone(_doc.specimenCoverflow);
    return base;
  }

  function loadFromSettings() {
    _lang = (W.state && W.state.lang) || 'zh-TW';
    var d = null;
    try {
      var r = W.state && W.state.settings && W.state.settings.contentStudioDraftJson;
      d = r && String(r).trim() ? JSON.parse(String(r)) : null;
    } catch (e) { d = null; }
    if (d && d.editorModel && d.editorModel.schemaVersion === UVER) _doc = d.editorModel;
    else if (d && d.contentAreas && d.contentAreas.welcome) _doc = v2toEM(d) || emptyDoc();
    else _doc = emptyDoc();
    if (d && d.mediaLibrary) _doc.mediaLibrary = d.mediaLibrary;
    if (!_doc.mediaLibrary) _doc.mediaLibrary = [];
    if (!_doc.specimenCoverflow || !Array.isArray(_doc.specimenCoverflow.items)) {
      _doc.specimenCoverflow =
        typeof W.mcGetDefaultSpecimenCoverflowConfig === 'function' ? W.mcGetDefaultSpecimenCoverflowConfig() : { title: '', subtitle: '', showFilters: true, filters: ['all', 'insect', 'beetle', 'shell', 'seed', 'fish', 'verified'], items: [] };
    }
    _hist = { past: [], cur: JSON.stringify(_doc), cap: 40 };
    _fut = [];
    _dirty = false;
  }

  function snap() { return JSON.stringify(_doc); }
  function pushH() {
    var s = snap();
    if (_hist.cur === s) return;
    if (_hist.cur) _hist.past.push(_hist.cur);
    if (_hist.past.length > _hist.cap) _hist.past.shift();
    _fut = [];
    _hist.cur = s;
  }
  function undo() {
    if (_hist.past.length < 1) return;
    if (_hist.cur) _fut.push(_hist.cur);
    _doc = JSON.parse(_hist.past.pop());
    _hist.cur = snap();
    _dirty = true;
    refresh();
  }
  function redo() {
    if (!_fut.length) return;
    if (_hist.cur) _hist.past.push(_hist.cur);
    _doc = JSON.parse(_fut.pop());
    _hist.cur = snap();
    _dirty = true;
    refresh();
  }

  function curPage() {
    for (var i = 0; _doc && _doc.pages && i < _doc.pages.length; i++) { if (_doc.pages[i].id === _pageId) return _doc.pages[i]; }
    if (_doc && _doc.pages[0]) return _doc.pages[0];
    return defPage('welcome');
  }
  function ensurePage(pid) {
    if (!_doc) return;
    if (!Array.isArray(_doc.pages)) _doc.pages = [];
    if (!_doc.pages.some(function (p) { return p && p.id === pid; })) { _doc.pages.push(defPage(pid)); }
  }

  /** ---- Shared renderer (same HTML for editor / preview / public; editor adds hit layers) ---- */
  function hit(mode, path, userLabel, inner) {
    if (mode !== 'editor' && mode !== 'preview') return inner;
    if (mode === 'preview' || _mode === 'view') return inner;
    var on = _sel === path;
    return (
      '<span class="mc3-hit' + (on ? ' mc3-hit--sel' : '') + '" data-mc3-p="' + escA(path) + '">' + inner + '<span class="mc3-hit-ribbon" aria-hidden="true">' + esc(userLabel) + '</span></span>'
    );
  }
  function renderPage(page, opts) {
    opts = opts || {};
    var mode = opts.mode || 'public';
    var p = page || curPage();
    var o = (p.sections || []).filter(function (s) { return s && s.visible !== false; });
    o.sort(function (a, b) { return (a.order | 0) - (b.order | 0); });
    return o.map(function (s) { return renderSection(s, mode, p); }).join('');
  }
  function renderSection(S, mode, page) {
    var c = S.content || {};
    var sid = S.id;
    if (S.type === 'hero') {
      var bg = c.backgroundImageUrl ? 'url(' + escA(c.backgroundImageUrl) + ')' : 'linear-gradient(155deg,#0c1810 0%,#040806 100%)';
      return (
        '<section class="mc3-sec mc3-hero" data-sec-id="' + escA(sid) + '" style="position:relative;min-height:min(60vh,560px);border-radius:0 0 20px;overflow:hidden;color:#e8f0e8;">' +
        hit(mode, 'h:' + sid + ':bg', t('mc3_hero_bg') || 'Background', '<div class="mc3-hero-bg" style="position:absolute;inset:0;background-size:cover;background-position:' + (S.design && S.design.imageFocus === 'custom' && S.design.customObjectPosition ? escA(S.design.customObjectPosition) : (posToCss(S.design && S.design.imageFocus) || '50% 50%')) + ';background-image:' + bg + '"></div>') +
        '<div class="mc3-hero-shade" style="position:absolute;inset:0;opacity:0.55;background:linear-gradient(100deg,rgba(0,0,0,.78),rgba(0,0,0,.1))"></div>' +
        '<div class="mc3-hero-in" style="position:relative;z-index:1;padding:36px 22px;max-width:min(100%,720px)">' +
        hit(mode, 'h:' + sid + ':eyebrow', t('label_page_accent') || 'Eyebrow', '<p class="mc3-eyebrow" style="font-size:0.82rem;letter-spacing:0.12em;text-transform:uppercase;opacity:0.9;margin:0 0 8px">' + esc(c.eyebrow) + '</p>') +
        hit(mode, 'h:' + sid + ':title', t('mc3_hero_title') || 'Title', '<h1 class="mc3-h1" style="margin:0;font-size:clamp(1.45rem,4.2vw,2.5rem);font-weight:600;line-height:1.2">' + esc(c.title) + '</h1>') +
        hit(mode, 'h:' + sid + ':subtitle', t('mc3_hero_sub') || 'Subtitle', '<p class="mc3-sub" style="margin:12px 0 0;max-width:40ch;white-space:pre-wrap;opacity:0.92;font-size:1.05rem;line-height:1.6">' + esc(c.subtitle) + '</p>') +
        '<div class="mc3-btns" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:22px">' +
        hit(mode, 'h:' + sid + ':pbtn', t('mc3_btn_primary') || 'Primary button', '<span class="primary-btn" style="min-height:44px;display:inline-flex;align-items:center;opacity:0.9;pointer-events:none;padding:0 20px;border-radius:10px">' + esc(c.primaryButtonText) + '</span>') +
        hit(mode, 'h:' + sid + ':sbtn', t('mc3_btn_secondary') || 'Secondary button', '<span class="soft-btn" style="min-height:44px;display:inline-flex;align-items:center;opacity:0.9;pointer-events:none;padding:0 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.25)">' + esc(c.secondaryButtonText) + '</span>') +
        '</div></div></section>'
      );
    }
    if (S.type === 'featureCards') {
      var cards = c.cards || [];
      return (
        '<section class="mc3-sec" style="padding:28px 20px" data-sec-id="' + escA(sid) + '"><h2 style="font-size:1.35rem;margin:0 0 8px">' + esc(c.sectionTitle) + '</h2><p style="opacity:0.86;margin:0 0 18px">' + esc(c.sectionDek) + '</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">' +
        cards.map(function (cd, j) {
          if (!cd) return '';
          return hit(mode, 'f:' + sid + ':c:' + j, (t('mc3_card_n') || 'Card') + ' ' + (j + 1), '<div class="mc3-card" style="border:1px solid var(--line,#1e2a2a);border-radius:12px;padding:14px"><div style="font-size:1.4em">' + esc(cd.icon || '◇') + '</div><div style="font-weight:600;margin:6px 0 4px">' + esc(cd.title) + '</div><p style="margin:0;opacity:0.88;font-size:0.95rem;line-height:1.45">' + esc(cd.description) + '</p></div>');
        }).join('') + '</div></section>'
      );
    }
    if (S.type === 'story' || S.type === 'about') {
      return (
        '<section class="mc3-sec" data-sec-id="' + escA(sid) + '" style="padding:28px 20px">' +
        hit(mode, 's:' + sid + ':h', t('mc3_heading') || 'Heading', '<h2 style="font-size:1.25rem;margin:0 0 10px">' + esc(c.heading) + '</h2>') +
        hit(mode, 's:' + sid + ':b', t('mc3_body') || 'Body', '<div class="mc3-prose" style="margin-top:4px;line-height:1.7;font-size:1.02rem">' + (c.rich && c.bodyHtml ? c.bodyHtml : esc(c.body)) + '</div>') +
        '</section>'
      );
    }
    return (
      '<section class="mc3-sec mc3-ph" data-sec-id="' + escA(sid) + '" style="padding:22px;border:1px dashed var(--line);border-radius:12px;opacity:0.95"><p style="margin:0;font-size:0.95rem"><strong>' + esc(S.name || t('mc3_section') || 'Section') + '</strong> — ' + esc((c && c.note) || t('mc3_coming') || 'Visual editing for this layout is coming soon.') + '</p></section>'
    );
  }
  function posToCss(f) {
    var m = { center: '50% 50%', top: '50% 0%', bottom: '50% 100%', left: '0% 50%', right: '100% 50%' };
    return m[f] || '50% 50%';
  }
  W.MCCms3 = W.MCCms3 || {};
  W.MCCms3.renderPage = renderPage;

  function refreshPreviewOnly() {
    var host = g('mc3PreviewHost');
    if (host) {
      var m2 = _mode === 'view' ? 'preview' : 'editor';
      host.innerHTML = renderPage(curPage(), { mode: m2 });
      host.setAttribute('data-mc3-interact', _mode === 'view' ? 'off' : 'on');
    }
    layoutCanvas();
    setStatus();
    syncAdv();
  }
  function refresh() {
    var host = g('mc3PreviewHost');
    if (host) {
      var m = _mode === 'view' ? 'preview' : 'editor';
      host.innerHTML = renderPage(curPage(), { mode: m });
      host.setAttribute('data-mc3-interact', _mode === 'view' ? 'off' : 'on');
    }
    layoutCanvas();
    renderLeft();
    renderInsp();
    setStatus();
    syncAdv();
  }
  function layoutCanvas() {
    var c = g('mc3Canvas');
    if (!c) return;
    var z = (g('mc3Zoom') && g('mc3Zoom').value) || _dev;
    var Wmap = { desktop: 1440, tablet: 768, mobile: 390 };
    c.setAttribute('data-mc3-dev', z);
    c.style.maxWidth = (Wmap[z] || 1440) + 'px';
    c.style.width = '100%';
    c.style.margin = '0 auto';
    c.style.boxSizing = 'border-box';
  }
  function renderLeft() {
    var pl = g('mc3PageList');
    if (pl) pl.value = _pageId;
    var list = g('mc3SecList');
    if (!list) return;
    var p = curPage();
    (p.sections || []).sort(function (a, b) { return (a.order | 0) - (b.order | 0); });
    list.innerHTML = (p.sections || []).map(function (S) {
      if (!S) return '';
      return (
        '<div class="mc3-secrow" data-sid="' + escA(S.id) + '">' +
        '<span class="mc3-secrow-name">' + esc((SECT_LABEL[S.type] || S.name) || t('mc3_section')) + '</span>' +
        '<label class="mc3-secrow-vis"><input type="checkbox" ' + (S.visible !== false ? 'checked' : '') + ' onchange="MCCms3.toggleVis(\'' + String(S.id).replace(/'/g, "\\'") + '\',this.checked)"/> ' + (t('mc3_show') || 'Show') + '</label>' +
        '<span class="mc3-secrow-ops"><button type="button" class="soft-btn" onclick="MCCms3.moveSec(' + JSON.stringify(S.id) + ',-1)">↑</button> <button type="button" class="soft-btn" onclick="MCCms3.moveSec(' + JSON.stringify(S.id) + ',1)">↓</button> <button type="button" class="soft-btn" onclick="MCCms3.dupSec(' + JSON.stringify(S.id) + ')">⎘</button> <button type="button" class="soft-btn" style="color:var(--danger)" onclick="MCCms3.delSec(' + JSON.stringify(S.id) + ')">✕</button> <button type="button" class="soft-btn" onclick="MCCms3.pickSec(' + JSON.stringify('s:' + S.id) + ')">●</button></span></div>'
      );
    }).join('');
  }
  function setStatus() {
    var el = g('mc3Status');
    if (!el) return;
    if (_saving) { el.textContent = t('mc3_st_saving') || 'Saving…'; return; }
    if (!el) return;
    if (_dirty) el.textContent = t('mc3_st_unsaved') || 'Unsaved changes';
    else el.textContent = t('mc3_st_saved') || 'Saved';
    var b = g('mc3UnsavedPill');
    if (b) b.hidden = !_dirty;
  }
  function syncAdv() {
    var a = g('mccsDraftJsonTa'), p = g('mccsPubJsonTa');
    try { var o = emToV2(); if (a) a.value = JSON.stringify(o, null, 2); if (p) p.value = (W.state && W.state.settings && W.state.settings.contentStudioPublishedJson) || ''; } catch (e) {}
  }

  function cfEnsureDoc_() {
    if (!_doc) _doc = emptyDoc();
    if (!_doc.specimenCoverflow || !Array.isArray(_doc.specimenCoverflow.items)) {
      _doc.specimenCoverflow = W.mcGetDefaultSpecimenCoverflowConfig ? clone(W.mcGetDefaultSpecimenCoverflowConfig()) : { title: '', subtitle: '', showFilters: true, backgroundMode: 'dark', filters: ['all', 'insect', 'beetle', 'shell', 'seed', 'fish', 'verified'], items: [] };
    }
    return _doc.specimenCoverflow;
  }

  function cfImgFilename_(url) {
    try {
      var u = String(url || '').trim();
      if (!u) return '—';
      var q = u.split(/[?#]/)[0];
      var segs = q.split('/');
      return segs[segs.length - 1] || u;
    } catch (eCf) {
      return '—';
    }
  }

  function cfBlankItem_() {
    return {
      id: 'SAT-MC-NEW-' + Date.now().toString(36),
      number: 'MC-NEW',
      catalogNumber: 'MC-NEW',
      assetNo: '',
      title: 'New species',
      displayTitle: '',
      common: '',
      type: 'INSECTA',
      category: 'insect',
      tags: ['insect'],
      rarity: 'common',
      status: '',
      statusKey: '',
      origin: '',
      date: '',
      collector: '',
      holder: '',
      visibility: '館內主要',
      cardVisibility: 'public',
      featured: false,
      pinned: false,
      sortOrder: 0,
      sourceSpecimenId: '',
      description: '',
      ctaUrl: '',
      progress: 50,
      image: '',
      coverImage: '',
      fit: 'contain',
      photoFit: 'contain',
      registry: '',
      exportText: 'QR · CSV · JSON · 標籤就緒',
    };
  }

  function cfReadFormToDoc_() {
    if (!g('mc3CfTitle')) return;
    var c = cfEnsureDoc_();
    c.title = (g('mc3CfTitle').value) || '';
    c.subtitle = (g('mc3CfSubtitle').value) || '';
    c.showFilters = !!(g('mc3CfShowFilters') && g('mc3CfShowFilters').checked);
    c.backgroundMode = (g('mc3CfBg') && g('mc3CfBg').value) || 'dark';
    c.defaultDisplayMode = 'grid';
    var nf = ['all'];
    CF_FILTER_DEFS.forEach(function (F) {
      if (F.id === 'all') return;
      var el = g('mc3CfFilt_' + F.id);
      if (el && el.checked) nf.push(F.id);
    });
    c.filters = nf;
    var it = c.items[_cfSel];
    if (!it) return;
    it.image = (g('mc3CfImage') && g('mc3CfImage').value) || '';
    it.fit = (g('mc3CfFit') && g('mc3CfFit').value) || 'cover';
    it.photoFit = it.fit;
    it.id = (g('mc3CfSat') && g('mc3CfSat').value) || it.id;
    it.number = (g('mc3CfMc') && g('mc3CfMc').value) || it.number;
    it.assetNo = (g('mc3CfAsset') && g('mc3CfAsset').value) || '';
    it.title = (g('mc3CfSci') && g('mc3CfSci').value) || it.title;
    it.common = (g('mc3CfCommon') && g('mc3CfCommon').value) || '';
    it.type = (g('mc3CfType') && g('mc3CfType').value) || '';
    it.category = (g('mc3CfCategory') && g('mc3CfCategory').value) || 'insect';
    var tagsStr = (g('mc3CfTags') && g('mc3CfTags').value) || '';
    it.tags = tagsStr.split(',').map(function (x) { return String(x || '').trim(); }).filter(Boolean);
    it.rarity = (g('mc3CfRarity') && g('mc3CfRarity').value) || 'common';
    it.status = (g('mc3CfStatus') && g('mc3CfStatus').value) || '';
    it.statusKey = (g('mc3CfStatusKey') && g('mc3CfStatusKey').value) || '';
    it.origin = (g('mc3CfOrigin') && g('mc3CfOrigin').value) || '';
    it.date = (g('mc3CfDate') && g('mc3CfDate').value) || '';
    it.collector = (g('mc3CfCollector') && g('mc3CfCollector').value) || '';
    it.visibility = (g('mc3CfVis') && g('mc3CfVis').value) || '';
    var pr = parseInt((g('mc3CfProg') && g('mc3CfProg').value) || '', 10);
    it.progress = pr === pr && pr >= 0 && pr <= 100 ? pr : null;
    it.registry = (g('mc3CfReg') && g('mc3CfReg').value) || '';
    it.exportText = (g('mc3CfExport') && g('mc3CfExport').value) || '';
    it.displayTitle = (g('mc3CfDispTitle') && g('mc3CfDispTitle').value) || '';
    it.description = (g('mc3CfDesc') && g('mc3CfDesc').value) || '';
    it.ctaUrl = (g('mc3CfCta') && g('mc3CfCta').value) || '';
    it.sourceSpecimenId = (g('mc3CfSrcSpec') && g('mc3CfSrcSpec').value) || '';
    it.holder = (g('mc3CfHolder') && g('mc3CfHolder').value) || '';
    it.coverImage = (g('mc3CfCover') && g('mc3CfCover').value) || it.image;
    it.catalogNumber = (g('mc3CfCatalog') && g('mc3CfCatalog').value) || it.number;
    it.cardVisibility = (g('mc3CfCardVis') && g('mc3CfCardVis').value) || 'public';
    it.featured = !!(g('mc3CfFeat') && g('mc3CfFeat').checked);
    it.pinned = !!(g('mc3CfPin') && g('mc3CfPin').checked);
    var so = parseInt((g('mc3CfSort') && g('mc3CfSort').value) || '', 10);
    it.sortOrder = so === so ? so : 0;
    var nm = g('mc3CfImgName');
    if (nm) nm.textContent = cfImgFilename_(it.coverImage || it.image);
  }

  W.MCCms3.cfSelectItem = function (idx) {
    cfReadFormToDoc_();
    _cfSel = Math.max(0, idx | 0);
    W.MCCms3.renderCoverflowEditor();
  };
  W.MCCms3.cfAddItem = function () {
    cfReadFormToDoc_();
    var c = cfEnsureDoc_();
    c.items.push(cfBlankItem_());
    _cfSel = c.items.length - 1;
    pushH();
    _dirty = true;
    setStatus();
    W.MCCms3.renderCoverflowEditor();
  };
  W.MCCms3.cfDelItem = function () {
    var c = cfEnsureDoc_();
    if (c.items.length <= 1) {
      W.toast && W.toast(t('cs_coverflow_min1') || '至少保留一張卡片');
      return;
    }
    cfReadFormToDoc_();
    c.items.splice(_cfSel, 1);
    _cfSel = Math.min(_cfSel, c.items.length - 1);
    pushH();
    _dirty = true;
    setStatus();
    W.MCCms3.renderCoverflowEditor();
  };
  W.MCCms3.cfMoveItem = function (d) {
    cfReadFormToDoc_();
    var c = cfEnsureDoc_();
    var i = _cfSel;
    var j = i + (d | 0);
    if (j < 0 || j >= c.items.length) return;
    var t0 = c.items[i];
    c.items[i] = c.items[j];
    c.items[j] = t0;
    _cfSel = j;
    pushH();
    _dirty = true;
    setStatus();
    W.MCCms3.renderCoverflowEditor();
  };
  W.MCCms3.cfPickMedia = function (url) {
    if (!url) return;
    var inp = g('mc3CfImage');
    if (inp) inp.value = url;
    cfReadFormToDoc_();
    pushH();
    _dirty = true;
    setStatus();
    W.MCCms3.cfPreviewRefresh();
  };
  W.MCCms3.cfPreviewRefresh = function () {
    cfReadFormToDoc_();
    var host = g('mc3CfCardPreview');
    if (!host) return;
    var c = cfEnsureDoc_();
    var it = c.items[_cfSel];
    host.innerHTML = '';
    if (!it) {
      host.innerHTML = '<p class="panel-sub">—</p>';
      return;
    }
    try {
      if (W.MCCollectionWall && W.MCCollectionWall.normalizeWallVm && W.MCCollectionWall.renderPublicCard) {
        var vm = W.MCCollectionWall.normalizeWallVm(it, _cfSel);
        host.appendChild(W.MCCollectionWall.renderPublicCard(vm, 'cw-showcase-card--grid'));
      } else if (typeof W.renderSpecimenRecordCard === 'function') {
        host.appendChild(W.renderSpecimenRecordCard(it, 'specimen-record-card--grid', false));
      } else {
        host.innerHTML = '<p class="panel-sub">—</p>';
      }
    } catch (ePv) {
      host.innerHTML = '<p class="panel-sub">' + esc(String(ePv && ePv.message || 'preview')) + '</p>';
    }
  };
  W.MCCms3.saveSpecimenCoverflowLocal = function () {
    cfReadFormToDoc_();
    try {
      localStorage.setItem('mcurator.ui.specimenCoverflow', JSON.stringify(_doc.specimenCoverflow));
      var c2 = cfEnsureDoc_();
      localStorage.setItem('mcurator.collectionWall.items', JSON.stringify(c2.items));
      localStorage.setItem(
        'mcurator.collectionWall.settings',
        JSON.stringify({
          title: c2.title,
          subtitle: c2.subtitle,
          showFilters: c2.showFilters,
          backgroundMode: c2.backgroundMode,
          defaultDisplayMode: 'grid',
        })
      );
    } catch (eLs) {
      W.toast && W.toast('localStorage');
      return;
    }
    pushH();
    _dirty = true;
    setStatus();
    syncAdv();
    if (W.mcReloadSpecimenCoverflow) W.mcReloadSpecimenCoverflow();
    W.MCCms3.cfPreviewRefresh();
    W.toast && W.toast(t('cs_coverflow_local_ok') || '已寫入本機並刷新典藏牆');
  };
  W.MCCms3.renderCoverflowEditor = function () {
    var listEl = g('mc3CfColList');
    var formEl = g('mc3CfFormInner');
    if (!listEl || !formEl) return;
    var c = cfEnsureDoc_();
    if (!c.items.length) c.items.push(cfBlankItem_());
    if (_cfSel >= c.items.length) _cfSel = c.items.length - 1;
    if (_cfSel < 0) _cfSel = 0;
    var it = c.items[_cfSel];
    var nf = c.filters || [];

    listEl.innerHTML = c.items
      .map(function (x, idx) {
        var lab = esc((x && (x.displayTitle || x.title || x.number || x.id)) || '#' + (idx + 1));
        return (
          '<button type="button" class="soft-btn" style="min-height:40px;width:100%;text-align:left;margin-bottom:4px"' +
          (_cfSel === idx ? ' aria-current="true"' : '') +
          ' onclick="MCCms3.cfSelectItem(' +
          idx +
          ')">' +
          lab +
          '</button>'
        );
      })
      .join('');

    var filtChk = CF_FILTER_DEFS.map(function (F) {
      var on = F.id === 'all' ? true : nf.indexOf(F.id) >= 0;
      return (
        '<label style="display:inline-flex;align-items:center;gap:6px;margin:4px 12px 4px 0;font-size:13px"><input type="checkbox" id="mc3CfFilt_' +
        F.id +
        '"' +
        (on ? ' checked' : '') +
        (F.id === 'all' ? ' disabled' : '') +
        ' />' +
        esc(F.lab) +
        '</label>'
      );
    }).join('');

    var medOpts = '<option value="">— ' + esc(t('cs_tab_media') || '媒體庫') + ' —</option>';
    (_doc.mediaLibrary || []).forEach(function (m) {
      if (!m || !m.url) return;
      if (m.type && m.type !== 'image' && m.type !== 'gallery' && m.type !== 'backgroundVideo') return;
      medOpts += '<option value="' + escA(m.url) + '">' + esc(m.title || cfImgFilename_(m.url)) + '</option>';
    });

    var catKeys = ['insect', 'beetle', 'plant', 'fossil', 'mineral', 'fish', 'shell', 'mammal', 'bird', 'reptile', 'seed', 'other'];
    var catOpts = catKeys
      .map(function (cv) {
        return '<option value="' + cv + '"' + (it.category === cv ? ' selected' : '') + '>' + esc(cv) + '</option>';
      })
      .join('');
    var cvSel = it.cardVisibility || 'public';
    var rarityOpts = ['common', 'rare', 'epic', 'legendary', 'museum']
      .map(function (rv) {
        return '<option value="' + rv + '"' + (it.rarity === rv ? ' selected' : '') + '>' + esc(rv) + '</option>';
      })
      .join('');
    var skOpts = ['', 'verified']
      .map(function (sk) {
        return '<option value="' + escA(sk) + '"' + ((it.statusKey || '') === sk ? ' selected' : '') + '>' + esc(sk || '—') + '</option>';
      })
      .join('');

    formEl.innerHTML =
      '<div class="form-grid two" style="gap:10px">' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfTitle">標題</label><input class="input" id="mc3CfTitle" style="min-height:40px" value="' +
      escA(c.title) +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfSubtitle">副標</label><input class="input" id="mc3CfSubtitle" style="min-height:40px" value="' +
      escA(c.subtitle) +
      '" /></div>' +
      '<div class="field"><label><input type="checkbox" id="mc3CfShowFilters"' +
      (c.showFilters !== false ? ' checked' : '') +
      ' /> 顯示篩選 chips</label></div>' +
      '<div class="field"><label for="mc3CfBg">背景模式</label><select class="input" id="mc3CfBg" style="min-height:40px"><option value="dark"' +
      (c.backgroundMode === 'dark' || !c.backgroundMode ? ' selected' : '') +
      '>dark</option><option value="museum"' +
      (c.backgroundMode === 'museum' ? ' selected' : '') +
      '>museum</option><option value="minimal"' +
      (c.backgroundMode === 'minimal' ? ' selected' : '') +
      '>minimal</option></select></div>' +
      '<div class="field" style="grid-column:1/-1"><span class="subline">篩選列（至少含「全部」）</span><div style="margin-top:6px">' +
      filtChk +
      '</div></div>' +
      '</div>' +
      '<hr style="border:0;border-top:1px solid var(--line);margin:14px 0" />' +
      '<p class="subline" style="margin:0 0 8px">卡片 #' +
      (_cfSel + 1) +
      '</p>' +
      '<div class="form-grid two" style="gap:10px">' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfMediaPick">從媒體庫插入</label><select class="input" id="mc3CfMediaPick" style="min-height:40px">' +
      medOpts +
      '</select></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfImage">圖片 URL</label><input class="input" id="mc3CfImage" type="url" style="min-height:40px" value="' +
      escA(it.image) +
      '" placeholder="https://…" /><p class="subline" style="margin:4px 0 0">檔名：<span id="mc3CfImgName">' +
      esc(cfImgFilename_(it.image)) +
      '</span></p></div>' +
      '<div class="field"><label for="mc3CfFit">圖片 fit</label><select class="input" id="mc3CfFit" style="min-height:40px"><option value="cover"' +
      ((it.fit || it.photoFit) === 'cover' ? ' selected' : '') +
      '>cover</option><option value="contain"' +
      ((it.fit || it.photoFit) === 'contain' ? ' selected' : '') +
      '>contain</option></select></div>' +
      '<div class="field"><label for="mc3CfSat">SAT ID</label><input class="input" id="mc3CfSat" style="min-height:40px" value="' +
      escA(it.id) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfMc">MC 編號</label><input class="input" id="mc3CfMc" style="min-height:40px" value="' +
      escA(it.number) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfAsset">資產編號</label><input class="input" id="mc3CfAsset" style="min-height:40px" value="' +
      escA(it.assetNo) +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfSci">學名 title</label><input class="input" id="mc3CfSci" style="min-height:40px" value="' +
      escA(it.title) +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfCommon">俗名</label><input class="input" id="mc3CfCommon" style="min-height:40px" value="' +
      escA(it.common) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfType">分類 type</label><input class="input" id="mc3CfType" style="min-height:40px" value="' +
      escA(it.type) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfCategory">類別 category</label><select class="input" id="mc3CfCategory" style="min-height:40px">' +
      catOpts +
      '</select></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfTags">tags（逗號分隔）</label><input class="input" id="mc3CfTags" style="min-height:40px" value="' +
      escA((it.tags || []).join(', ')) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfRarity">rarity</label><select class="input" id="mc3CfRarity" style="min-height:40px">' +
      rarityOpts +
      '</select></div>' +
      '<div class="field"><label for="mc3CfStatus">狀態文字</label><input class="input" id="mc3CfStatus" style="min-height:40px" value="' +
      escA(it.status) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfStatusKey">statusKey</label><select class="input" id="mc3CfStatusKey" style="min-height:40px">' +
      skOpts +
      '</select></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfOrigin">產地</label><input class="input" id="mc3CfOrigin" style="min-height:40px" value="' +
      escA(it.origin) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfDate">日期</label><input class="input" id="mc3CfDate" style="min-height:40px" value="' +
      escA(it.date) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfCollector">採集者</label><input class="input" id="mc3CfCollector" style="min-height:40px" value="' +
      escA(it.collector) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfVis">能見度</label><input class="input" id="mc3CfVis" style="min-height:40px" value="' +
      escA(it.visibility) +
      '" /></div>' +
      '<div class="field"><label for="mc3CfProg">完成度 0–100</label><input class="input" id="mc3CfProg" type="number" min="0" max="100" style="min-height:40px" value="' +
      escA(it.progress != null && it.progress === it.progress ? String(it.progress) : '') +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfReg">registry</label><input class="input" id="mc3CfReg" style="min-height:40px" value="' +
      escA(it.registry) +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfExport">export 列</label><input class="input" id="mc3CfExport" style="min-height:40px" value="' +
      escA(it.exportText) +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfDispTitle">展示標題（避免顯示檔名）</label><input class="input" id="mc3CfDispTitle" style="min-height:40px" value="' +
      escA(it.displayTitle || '') +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfDesc">描述</label><textarea class="input" id="mc3CfDesc" rows="3" style="min-height:72px">' +
      escA(it.description || '') +
      '</textarea></div>' +
      '<div class="field"><label for="mc3CfCatalog">館號 catalogNumber</label><input class="input" id="mc3CfCatalog" style="min-height:40px" value="' +
      escA(it.catalogNumber || it.number || '') +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfCover">封面圖 URL（選填，覆寫主圖）</label><input class="input" id="mc3CfCover" style="min-height:40px" value="' +
      escA(it.coverImage || '') +
      '" /></div>' +
      '<div class="field"><label for="mc3CfHolder">持有者</label><input class="input" id="mc3CfHolder" style="min-height:40px" value="' +
      escA(it.holder || '') +
      '" /></div>' +
      '<div class="field"><label for="mc3CfSrcSpec">來源標本 ID</label><input class="input" id="mc3CfSrcSpec" style="min-height:40px" value="' +
      escA(it.sourceSpecimenId || '') +
      '" /></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="mc3CfCta">CTA 連結（選填）</label><input class="input" id="mc3CfCta" style="min-height:40px" value="' +
      escA(it.ctaUrl || '') +
      '" /></div>' +
      '<div class="field"><label for="mc3CfCardVis">典藏牆可見度</label><select class="input" id="mc3CfCardVis" style="min-height:40px">' +
      '<option value="public"' +
      (cvSel === 'public' ? ' selected' : '') +
      '>public</option><option value="draft"' +
      (cvSel === 'draft' ? ' selected' : '') +
      '>draft</option><option value="hidden"' +
      (cvSel === 'hidden' ? ' selected' : '') +
      '>hidden</option></select></div>' +
      '<div class="field"><label for="mc3CfSort">排序 sortOrder</label><input class="input" id="mc3CfSort" type="number" style="min-height:40px" value="' +
      escA(it.sortOrder != null && it.sortOrder === it.sortOrder ? String(it.sortOrder) : '0') +
      '" /></div>' +
      '<div class="field"><label><input type="checkbox" id="mc3CfFeat"' +
      (it.featured ? ' checked' : '') +
      ' /> 精選 featured</label></div>' +
      '<div class="field"><label><input type="checkbox" id="mc3CfPin"' +
      (it.pinned ? ' checked' : '') +
      ' /> 置頂 pinned</label></div>' +
      '</div>';

    W.MCCms3.cfPreviewRefresh();
  };

  function getSec(id) { var a = (curPage().sections || []); for (var i = 0; i < a.length; i++) if (a[i] && a[i].id === id) return a[i]; return null; }
  function getHeroField(path) { var p = path.split(':'); var s = getSec(p[1]); if (!s || s.type !== 'hero') return null; return s; }

  W.MCCms3.toggleVis = function (id, on) { var s = getSec(id); if (!s) return; s.visible = !!on; pushH(); _dirty = true; refresh(); };
  W.MCCms3.moveSec = function (id, d) { var a = curPage().sections, i = a.findIndex(function (x) { return x && x.id === id; }); if (i < 0) return; var j = i + d; if (j < 0 || j >= a.length) return; var t = a[i].order; a[i].order = a[j].order; a[j].order = t; a.sort(function (x, y) { return (x.order | 0) - (y.order | 0); }); pushH(); _dirty = true; refresh(); };
  W.MCCms3.dupSec = function (id) { var a = curPage().sections, s = getSec(id); if (!s) return; var n = clone(s); n.id = uid('s'); a.push(n); n.order = (a.length) + 1; pushH(); _dirty = true; refresh(); };
  W.MCCms3.delSec = function (id) { if (!confirm(t('mc3_del_confirm') || 'Delete this section?')) return; curPage().sections = (curPage().sections || []).filter(function (x) { return x && x.id !== id; }); _sel = ''; pushH(); _dirty = true; refresh(); };
  W.MCCms3.pickSec = function (path) { _sel = path; renderInsp(); var host = g('mc3PreviewHost'); if (host) { host.querySelectorAll('.mc3-hit--sel').forEach(function (n) { n.classList.remove('mc3-hit--sel'); }); var h = path === ('s:' + path.split(':')[1]) && path.indexOf(':b') < 0 ? null : [].slice.call(host.querySelectorAll('[data-mc3-p]')).find(function (n) { return n.getAttribute('data-mc3-p') === path; }); if (h) h.classList.add('mc3-hit--sel'); } };

  function charWarn(key, s) { var h = HINTS[key]; if (!h) return ''; var n = len(s), lo = h[0], hi = h[1]; if (n > hi) return '<p class="mc3-warn">' + (t('mc3_len_warn') || 'This may be too long on mobile') + ' (' + n + ' ' + (t('mc3_chars') || 'chars') + ')</p>'; if (n < lo && n > 0) return '<p class="mc3-hint-sub">' + (t('mc3_recommended') || 'Recommended') + ': ' + lo + '–' + hi + '</p>'; return '<p class="mc3-hint-sub">' + (t('mc3_recommended') || 'Recommended') + ': ' + lo + '–' + hi + ' · ' + (t('mc3_current') || 'Current') + ': ' + n + '</p>'; }

  function buildImgInsp(H, sid) {
    var u = (H.content && H.content.backgroundImageUrl) || '';
    var th = u ? ('<div class="mc3-thumb" style="border:1px solid var(--line);border-radius:10px;overflow:hidden;max-width:100%"><img src="' + escA(u) + '" alt="" onerror="this.setAttribute(&quot;data-broken&quot;,&quot;1&quot;)" style="max-width:100%;display:block"/></div>') : ('<p class="mc3-insp-p" style="color:var(--muted)">' + esc(t('mc3_no_image') || 'No image') + '</p>');
    if (u) th += '<p class="mc3-warn" id="mc3ImgBrk" style="display:none" role="status">' + esc(t('mce2_broken') || 'Image could not be loaded.') + '</p>';
    return th + '<p class="mc3-hint-sub">' + esc(t('img_rec_hero') || 'Recommended: 1600×900, JPG/PNG. Used on the hero background.') + '</p>' + '<label class="mc3-lb">' + esc(t('label_url') || 'Image URL') + '</label><input class="input" id="mc3ImgUrl" style="min-height:44px" value="' + escA(u) + '" oninput="MCCms3.hImg(' + JSON.stringify(sid) + ')" />' + '<label class="mc3-lb" style="margin-top:8px">' + esc(t('cs_med_alt') || 'Alt text') + '</label><input class="input" id="mc3Alt" style="min-height:44px" value="' + escA(H.content.imageAlt || '') + '" oninput="MCCms3.hImg(' + JSON.stringify(sid) + ')" />';
  }
  function renderInsp() {
    var th = g('mc3InspTitle'), b = g('mc3InspBody'), h = g('mc3InspHelp');
    if (h) h.style.display = _sel ? 'none' : 'block';
    if (!b || !th) return;
    if (!_sel) {
      th.textContent = t('mc3_insp_empty_t') || 'Edit';
      b.innerHTML = '<p class="mc3-insp-p">' + esc(t('ed_insp_empty') || 'Click the preview to edit text, images, and buttons.') + '</p>';
      return;
    }
    if (_sel === 'p') { th.textContent = t('mc3_page') || 'Page'; b.innerHTML = '<p class="mc3-insp-p">' + esc(t('mc3_page_help') || 'Select a page above. Manage sections on the left.') + '</p>'; return; }
    var parts, id, S, H, p, part, tkey, ukey;
    if (_sel.indexOf('s:') === 0 && _sel.split(':').length === 2) {
      id = _sel.split(':')[1];
      S = getSec(id);
      th.textContent = t('mc3_sec_settings') || 'Section';
      if (!S) { b.textContent = ''; return; }
      b.innerHTML =
        '<p class="field"><label class="mc3-lb">' + esc(t('mc3_sec_name') || 'Name shown to you') + '</label><input class="input" style="min-height:44px" value="' + escA(S.name) + '" oninput="MCCms3.inpName(' + JSON.stringify(S.id) + ',this.value)" /></p>' +
        '<div class="actions" style="flex-wrap:wrap;gap:6px">' +
        '<button type="button" class="soft-btn" onclick="MCCms3.toggleVis(' + JSON.stringify(S.id) + ', ' + (S.visible === false) + ')">' + (S.visible === false ? esc(t('mc3_show') || 'Show') : esc(t('cs_hide') || 'Hide')) + '</button> ' +
        '<button type="button" class="soft-btn" onclick="MCCms3.moveSec(' + JSON.stringify(S.id) + ',-1)">↑</button> ' +
        '<button type="button" class="soft-btn" onclick="MCCms3.moveSec(' + JSON.stringify(S.id) + ',1)">↓</button> ' +
        '<button type="button" class="soft-btn" onclick="MCCms3.dupSec(' + JSON.stringify(S.id) + ')">' + esc(t('cs_dup') || 'Duplicate') + '</button> ' +
        '<button type="button" class="soft-btn" style="color:var(--danger)" onclick="MCCms3.delSec(' + JSON.stringify(S.id) + ')">' + esc(t('mce2_del') || 'Delete') + '</button></div>' +
        (S.type === 'hero' ? '<div class="field" style="margin-top:10px"><label class="mc3-lb">Focus (background)</label><select class="input" style="min-height:44px" onchange="MCCms3.foc(this.value,' + JSON.stringify(S.id) + ')"><option value="center">Auto · Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></div>' : '');
      if (S.type === 'hero' && S.design) {
        var f = S.design.imageFocus || 'center', sl = b.querySelector('select');
        if (sl) { for (var i = 0; i < sl.options.length; i++) if (sl.options[i].value === f) sl.selectedIndex = i; }
      }
      return;
    }
    if (_sel.indexOf('h:') === 0) {
      parts = _sel.split(':');
      id = parts[1];
      part = parts[2];
      H = getSec(id);
      if (!H || H.type !== 'hero') { b.textContent = ''; return; }
      H.content = H.content || {};
      if (part === 'title' || part === 'eyebrow' || part === 'subtitle') {
        th.textContent = part === 'title' ? (t('mce2_hero_title') || 'Title') : part === 'eyebrow' ? (t('label_page_accent') || 'Eyebrow') : (t('mce2_hero_sub') || 'Subtitle');
        var fkey = part === 'eyebrow' ? 'eyebrow' : part;
        b.innerHTML = '<label class="mc3-lb">' + esc(th.textContent) + '</label><textarea class="textarea" id="mc3F" style="min-height:100px" oninput="MCCms3.hf(' + JSON.stringify(part) + ', ' + JSON.stringify(id) + ')">' + esc(H.content[fkey] || '') + '</textarea>' + charWarn(part === 'title' ? 'heroTitle' : 'heroSub', H.content[fkey] || '');
        return;
      }
      if (part === 'bg') { th.textContent = t('mc3_hero_bg') || 'Background'; b.innerHTML = buildImgInsp(H, id); return; }
      if (part === 'pbtn' || part === 'sbtn') {
        tkey = part === 'pbtn' ? 'primaryButtonText' : 'secondaryButtonText';
        ukey = part === 'pbtn' ? 'primaryButtonUrl' : 'secondaryButtonUrl';
        th.textContent = part === 'pbtn' ? (t('mce2_btn_pri') || 'Primary button') : (t('mce2_btn_sec') || 'Secondary button');
        var pfx = part === 'pbtn' ? 'p' : 's';
        b.innerHTML = '<label class="mc3-lb">' + esc(t('label_button') || 'Button text') + '</label><input class="input" id="mc3B1" style="min-height:44px" value="' + escA(H.content[tkey]) + '" oninput="MCCms3.hb(' + JSON.stringify('t') + ', ' + JSON.stringify(pfx) + ', ' + JSON.stringify(id) + ')" />' + '<label class="mc3-lb" style="margin-top:8px">' + esc(t('label_link') || 'Link') + '</label><input class="input" id="mc3B2" style="min-height:44px" value="' + escA(H.content[ukey]) + '" oninput="MCCms3.hb(' + JSON.stringify('u') + ', ' + JSON.stringify(pfx) + ', ' + JSON.stringify(id) + ')" />' + (!(H.content[ukey] || '').trim() ? '<p class="mc3-warn">' + esc(t('mce2_empty_href') || 'Button link is empty') + '</p>' : '');
        return;
      }
    }
    parts = _sel.split(':');
    if (parts[0] === 's' && parts.length === 3 && (parts[2] === 'h' || parts[2] === 'b')) { id = parts[1]; H = getSec(id); if (H && H.type === 'story') { th.textContent = parts[2] === 'h' ? (t('mce2_hero_title') || 'Heading') : (t('label_body') || 'Body'); b.innerHTML = '<label class="mc3-lb"></label><textarea class="textarea" id="mc3F" style="min-height:' + (parts[2] === 'b' ? '200' : '80') + 'px" oninput="MCCms3.story(' + JSON.stringify(parts[2]) + ', ' + JSON.stringify(id) + ')">' + esc(parts[2] === 'h' ? ((H.content && H.content.heading) || '') : ((H.content && H.content.body) || '')) + '</textarea>'; return; } }
    b.innerHTML = '<p class="mc3-insp-p">' + esc(t('mc3_nothing') || '—') + '</p>';
  }
  W.MCCms3.inpName = function (sid, v) { var s = getSec(sid); if (!s) return; s.name = v; pushH(); _dirty = true; refreshPreviewOnly(); };
  W.MCCms3.hf = function (part, sid) { var H = getSec(sid); if (!H) return; var v = (g('mc3F') && g('mc3F').value) || ''; if (part === 'eyebrow') H.content.eyebrow = v; else if (part === 'title') H.content.title = v; else if (part === 'subtitle') H.content.subtitle = v; pushH(); _dirty = true; refreshPreviewOnly(); };
  W.MCCms3.hb = function (ku, pfx, sid) { var H = getSec(sid); if (!H) return; if (ku === 't') { if (pfx === 'p') H.content.primaryButtonText = (g('mc3B1') && g('mc3B1').value) || ''; else H.content.secondaryButtonText = (g('mc3B1') && g('mc3B1').value) || ''; } else { if (pfx === 'p') H.content.primaryButtonUrl = (g('mc3B2') && g('mc3B2').value) || ''; else H.content.secondaryButtonUrl = (g('mc3B2') && g('mc3B2').value) || ''; } pushH(); _dirty = true; renderInsp(); refreshPreviewOnly(); };
  W.MCCms3.hImg = function (sid) { var H = getSec(sid); if (!H) return; H.content = H.content || {}; H.content.backgroundImageUrl = (g('mc3ImgUrl') && g('mc3ImgUrl').value) || ''; H.content.imageAlt = (g('mc3Alt') && g('mc3Alt').value) || ''; pushH(); _dirty = true; refreshPreviewOnly(); };
  W.MCCms3.foc = function (v, id) { var s = getSec(id); if (!s) return; s.design = s.design || {}; s.design.imageFocus = v; if (v !== 'custom') delete s.design.customObjectPosition; pushH(); _dirty = true; refresh(); };
  W.MCCms3.story = function (f, id) { var s = getSec(id); if (!s) return; s.content = s.content || {}; if (f === 'h') s.content.heading = (g('mc3F') && g('mc3F').value) || ''; else s.content.body = (g('mc3F') && g('mc3F').value) || ''; pushH(); _dirty = true; refreshPreviewOnly(); };
  W.MCCms3.pathField = function (field, v) { W.MCCms3.inpName(_sel.split(':')[1], v); };

  function gsr() { if (typeof google !== 'undefined' && google.script && google.script.run) return google.script.run; if (W.google && W.google.script && W.google.script.run) return W.google.script.run; return null; }
  W.MCCms3.saveDraft = function () { if (!_doc) return; var pcf = g('mc3PanelCoverflow'); if (pcf && pcf.style.display !== 'none') cfReadFormToDoc_(); _saving = true; setStatus(); var p = emToV2(); p.updatedAt = now(); var r = gsr(); if (!r) { W.setLoading && W.setLoading(false); _saving = false; setStatus(); W.toast && W.toast('?'); return; } W.setLoading && W.setLoading(true, t('saving') || '…'); r.withSuccessHandler(function (res) { W.setLoading && W.setLoading(false); _saving = false; if (!res || !res.ok) { W.toast && W.toast((res && res.message) || 'err'); setStatus(); return; } W.state = W.state || {}; W.state.settings = Object.assign({}, W.state.settings, (res.data && res.data.settings) || {}); _dirty = false; W.toast && W.toast(t('cs_saved_draft') || 'Saved'); setStatus(); syncAdv(); if (W.mcReloadSpecimenCoverflow) try { W.mcReloadSpecimenCoverflow(); } catch (eMc) {} }).withFailureHandler(function () { W.setLoading && W.setLoading(false); _saving = false; setStatus(); }).saveSettings({ contentStudioDraftJson: JSON.stringify(p) }); };
  W.MCCms3.publish = function () { if (!confirm(t('mc3_pubq') || 'Publish? Visitors will see the latest saved version.')) return; if (W.isAdminSession && !W.isAdminSession()) { W.toast && W.toast('admin'); return; } var pcf2 = g('mc3PanelCoverflow'); if (pcf2 && pcf2.style.display !== 'none') cfReadFormToDoc_(); var p = emToV2(); p.publishedAt = now(); if (p.contentAreas && p.contentAreas.welcome) p.contentAreas.welcome.status = 'published'; var cj = W.state && W.state.settings && W.state.settings.contentStudioVersionsJson; W.setLoading && W.setLoading(true, '…'); var r = gsr(); if (!r) { W.setLoading && W.setLoading(false); return; } r.withSuccessHandler(function (res) { W.setLoading && W.setLoading(false); if (!res || !res.ok) { W.toast && W.toast('err'); return; } W.state = W.state || {}; W.state.settings = Object.assign({}, W.state.settings, (res.data && res.data.settings) || {}); _dirty = false; W.MCContentV2 && W.MCContentV2.applyWelcome && W.MCContentV2.applyWelcome(W.state.lang); W.applyWelcomeVideo && W.applyWelcomeVideo(); W.toast && W.toast(t('cs_published') || 'Published'); setStatus(); syncAdv(); }).withFailureHandler(function () { W.setLoading && W.setLoading(false); }).saveSettings({ contentStudioDraftJson: JSON.stringify(p), contentStudioPublishedJson: JSON.stringify(clone(p)), contentStudioVersionsJson: cj || '[]' }); };

  W.MCCms3.setDevice = function (d) { _dev = d; if (g('mc3Zoom')) g('mc3Zoom').value = d; [ ['mc3Dsk', 'desktop'], ['mc3Tab', 'tablet'], ['mc3Mob', 'mobile'] ].forEach(function (x) { var b = g(x[0]); if (b) b.setAttribute('aria-pressed', _dev === x[1] ? 'true' : 'false'); }); layoutCanvas(); };
  W.MCCms3.setViewMode = function (m) { _mode = m === 'p' ? 'view' : 'edit'; g('mc3Ed') && g('mc3Ed').setAttribute('aria-pressed', _mode === 'edit' ? 'true' : 'false'); g('mc3Pv') && g('mc3Pv').setAttribute('aria-pressed', _mode === 'view' ? 'true' : 'false'); refresh(); };
  W.MCCms3.onPage = function () { _pageId = (g('mc3PageList') && g('mc3PageList').value) || 'welcome'; ensurePage(_pageId); _sel = ''; refresh(); };
  W.MCCms3.initShell = function () {
    loadFromSettings();
    if (g('mc3PageList')) g('mc3PageList').onchange = function () { W.MCCms3.onPage(); };
    W.MCCms3.setDevice('desktop');
    W.MCCms3.setViewMode('e');
    if (g('mc3UnsavedPill')) g('mc3UnsavedPill').hidden = true;
    if (g('mc3AddSecBtn')) g('mc3AddSecBtn').onclick = function () { if (g('mc3AddModal')) { g('mc3AddModal').classList.add('show'); g('mc3AddModal').setAttribute('aria-hidden', 'false'); } };
    if (g('mc3AddModalClose')) g('mc3AddModalClose').onclick = function () { if (g('mc3AddModal')) g('mc3AddModal').classList.remove('show'); };
    if (g('mc3AddModal')) g('mc3AddModal').onclick = function (e) { if (e.target === g('mc3AddModal')) g('mc3AddModal').classList.remove('show'); };
    if (g('mc3MedAdd')) g('mc3MedAdd').onclick = W.MCCms3.addMedia;
    if (g('mc3TopUndo')) g('mc3TopUndo').onclick = function () { W.MCCms3.undo(); };
    if (g('mc3TopRedo')) g('mc3TopRedo').onclick = function () { W.MCCms3.redo(); };
    if (g('mc3TopSave')) g('mc3TopSave').onclick = W.MCCms3.saveDraft;
    if (g('mc3TopPub')) g('mc3TopPub').onclick = W.MCCms3.publish;
    if (g('mc3Dsk')) g('mc3Dsk').onclick = function () { W.MCCms3.setDevice('desktop'); };
    if (g('mc3Tab')) g('mc3Tab').onclick = function () { W.MCCms3.setDevice('tablet'); };
    if (g('mc3Mob')) g('mc3Mob').onclick = function () { W.MCCms3.setDevice('mobile'); };
    if (g('mc3Ed')) g('mc3Ed').onclick = function () { W.MCCms3.setViewMode('e'); };
    if (g('mc3Pv')) g('mc3Pv').onclick = function () { W.MCCms3.setViewMode('p'); };
    var host = g('mc3PreviewHost');
    if (host) host.addEventListener('click', function (e) {
      if (_mode === 'view') return;
      var hit = e.target && e.target.closest && e.target.closest('.mc3-hit');
      if (!hit) return;
      e.preventDefault();
      e.stopPropagation();
      _sel = hit.getAttribute('data-mc3-p') || '';
      if (!_sel) return;
      host.querySelectorAll('.mc3-hit--sel').forEach(function (n) { n.classList.remove('mc3-hit--sel'); });
      hit.classList.add('mc3-hit--sel');
      renderInsp();
    }, true);
    var cfPan = g('mc3PanelCoverflow');
    if (cfPan) {
      cfPan.addEventListener(
        'input',
        function () {
          if (cfPan.style.display === 'none') return;
          cfReadFormToDoc_();
          if (W.MCCms3.cfPreviewRefresh) W.MCCms3.cfPreviewRefresh();
        },
        false
      );
      cfPan.addEventListener('change', function (e) {
        if (cfPan.style.display === 'none') return;
        var t = e.target;
        if (t && t.id === 'mc3CfMediaPick') {
          if (W.MCCms3.cfPickMedia) W.MCCms3.cfPickMedia((t.value || '').trim());
          t.selectedIndex = 0;
          return;
        }
        cfReadFormToDoc_();
        if (W.MCCms3.cfPreviewRefresh) W.MCCms3.cfPreviewRefresh();
      });
    }
  };
  W.MCCms3.addTmpl = function (type) { ensurePage(_pageId); var p = curPage(), s = p.sections, o = s.length + 1; var u = { id: uid('sec'), name: (SECT_LABEL[type] || type), type: type, visible: true, order: o, content: {}, design: {} }; if (type === 'hero') { u = defHero(); u.order = o; } else if (type === 'featureCards') { u.type = 'featureCards'; u.content = { sectionTitle: '', sectionDek: '', cards: [{ icon: '◇', title: '', description: '' }] }; } else if (type === 'story' || type === 'about') { u.type = 'story'; u.name = t('cs_sec_story') || 'About'; u.content = { heading: '', body: '', rich: false }; } else { u.type = 'placeholder'; u.content = { note: t('mc3_sec_placeholder') || 'Add content in the next version.' }; } s.push(u); g('mc3AddModal') && g('mc3AddModal').classList.remove('show'); pushH(); _dirty = true; refresh(); };
  W.MCCms3.addMedia = function () {
    if (!_doc.mediaLibrary) _doc.mediaLibrary = [];
    var T = (g('mccsMedType') && g('mccsMedType').value) || (g('mc3MedType') && g('mc3MedType').value) || 'image';
    _doc.mediaLibrary.push({ id: 'm' + Date.now(), type: T, title: (g('mccsMedTitle') && g('mccsMedTitle').value) || (g('mc3MedTitle') && g('mc3MedTitle').value) || '', url: (g('mccsMedUrl') && g('mccsMedUrl').value) || (g('mc3MedUrl') && g('mc3MedUrl').value) || '', alt: (g('mccsMedAlt') && g('mccsMedAlt').value) || '', credit: (g('mccsMedCredit') && g('mccsMedCredit').value) || '', createdAt: now() });
    pushH();
    _dirty = true;
    W.MCCms3.renderMediaList();
    setStatus();
  };
  W.MCCms3.openTool = function (k) { ['mc3TPage', 'mc3TMedia', 'mc3TTrans', 'mc3TPub', 'mc3TAdv'].forEach(function (id) { var e = g(id); if (e) e.hidden = (id !== 'mc3T' + k && id !== 'mc3Tool' + k); }); };

  W.MCCms3.undo = undo; W.MCCms3.redo = redo;
  W.MCCms3.mccsShim = function () {
    W.mccsSaveDraft = W.MCCms3.saveDraft; W.mccsPublish = W.MCCms3.publish; W.mccsSetDevice = W.MCCms3.setDevice; W.mccsSetEditMode = function (m) { W.MCCms3.setViewMode(m === 'preview' ? 'p' : 'e'); };
    W.mccsGetDraft_ = emToV2; W.mccsReadFormToDraft_ = function () {};
    W.mccsUpdatePreview_ = refreshPreviewOnly; W.mccsRenderSectionList_ = function () { renderLeft(); }; W.mccsLayoutPreview_ = layoutCanvas; W.mccsSyncSaveUi_ = setStatus; W.mccsTrRefresh = W.mccsTrMark = W.mccsTrCopy = W.mccsTrPathSet_ = W.mccsTrPathGet_ = function () {};
    W.mccsRenderMedia_ = W.MCCms3.renderMediaList; W.mccsOnArea = W.MCCms3.onPage; W.mccsMobSlab = function () {}; W.mccsExportDraft = function () { var a = document.createElement('a'); a.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(emToV2(), null, 2)); a.download = 'mcurator-content-draft.json'; a.click(); };
    W.mccsImportFile = function () { var f = g('mccsImportFile') && g('mccsImportFile').files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { try { var o = JSON.parse(r.result); if (o.editorModel && o.editorModel.schemaVersion === UVER) _doc = o.editorModel; else if (o.contentAreas) _doc = v2toEM(o) || emptyDoc(); if (o.mediaLibrary) _doc.mediaLibrary = o.mediaLibrary; if (o.specimenCoverflow) _doc.specimenCoverflow = clone(o.specimenCoverflow); if (!_doc.specimenCoverflow || !Array.isArray(_doc.specimenCoverflow.items)) { _doc.specimenCoverflow = W.mcGetDefaultSpecimenCoverflowConfig ? W.mcGetDefaultSpecimenCoverflowConfig() : _doc.specimenCoverflow; } _dirty = true; refresh(); syncAdv(); if (W.mcReloadSpecimenCoverflow) W.mcReloadSpecimenCoverflow(); } catch (e) { W.toast && W.toast('!'); } }; r.readAsText(f); };
    W.mccsSwitchSubtab = function (name) {
      var showMain = name === 'page' || !name;
      var main = g('mc3EditorMain');
      if (main) main.style.display = showMain ? 'flex' : 'none';
      [['mc3PanelMedia', 'media'], ['mc3PanelTrans', 'translate'], ['mc3PanelPub', 'publish'], ['mc3PanelAdv', 'adv']].forEach(function (p) { var n = g(p[0]); if (n) n.style.display = name === p[1] ? 'block' : 'none'; });
      [].forEach.call(document.querySelectorAll('.mc3-toplink') || [], function (btn) { btn.setAttribute('aria-selected', (btn.getAttribute('data-mc3-tab') || '') === name ? 'true' : 'false'); });
      if (name === 'media') W.MCCms3.renderMediaList();
      if (g('mccsVersionList') && W.state) { var h = (W.state.settings && W.state.settings.contentStudioVersionsJson); try { var ar = h ? JSON.parse(h) : []; g('mccsVersionList').innerHTML = (Array.isArray(ar) && ar.length) ? ar.slice(0, 8).map(function (v) { return '<li class="subline">' + esc(v && v.versionId) + '</li>'; }).join('') : '<li class="subline">—</li>'; } catch (e) {} }
      W.mccsReadFormToDraft_();
      syncAdv();
    };
    W.mccsParseDraftFromAdvanced = function () { var ta = g('mccsDraftJsonTa'); if (!ta) return; var o; try { o = JSON.parse(ta.value || '{}'); } catch (e) { return W.toast && W.toast('!'); } if (o.editorModel && o.editorModel.schemaVersion === UVER) _doc = o.editorModel; else if (o.contentAreas) _doc = v2toEM(o) || emptyDoc(); if (o.mediaLibrary) _doc.mediaLibrary = o.mediaLibrary; if (o.specimenCoverflow) _doc.specimenCoverflow = clone(o.specimenCoverflow); if (!_doc.specimenCoverflow || !Array.isArray(_doc.specimenCoverflow.items)) { _doc.specimenCoverflow = W.mcGetDefaultSpecimenCoverflowConfig ? W.mcGetDefaultSpecimenCoverflowConfig() : { title: '', subtitle: '', showFilters: true, filters: ['all', 'insect', 'beetle', 'shell', 'seed', 'fish', 'verified'], items: [] }; } _dirty = true; refresh(); syncAdv(); if (W.mcReloadSpecimenCoverflow) try { W.mcReloadSpecimenCoverflow(); } catch (eMc2) {} };
    W.mccsOnDraftJsonInput = function () { _dirty = true; setStatus(); };
    W.mccsSyncAdvancedTa_ = syncAdv;
    W.validateMccsDraftJson = function () { var ta = g('mccsDraftJsonTa'); if (!ta) return; try { JSON.parse(ta.value || '{}'); W.toast && W.toast('ok'); } catch (e) { W.toast && W.toast('!'); } };
  };

  W.MCCms3.renderMediaList = function () { var h = g('mccsMediaList') || g('mc3MediaList'); if (!h) return; var a = _doc.mediaLibrary || []; h.innerHTML = a.length ? a.map(function (m) { return '<div class=\\"admin-item\\"><div class=\\"name\\">' + esc(m && m.type) + '</div><div class=\\"subline\\">' + esc(m && m.title) + ' · ' + esc(m && m.url) + '</div></div>'; }).join('') : '<div class=\\"empty\\">—</div>'; };

  W.MCCms3.initAll = function () { W.MCCms3.mccsShim(); W.MCCms3.initShell(); refresh(); if (W.mccsSwitchSubtab) W.mccsSwitchSubtab('page'); };
  W.renderPage = renderPage;
})(window);
