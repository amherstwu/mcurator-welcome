/**
 * Dashboard — SAT market / specimen passports (not the public marketplace listing).
 */
(function (global) {
  'use strict';

  var _root = null;
  var _ctx = {};
  var _view = 'grid';
  var _editingId = null;
  var _draft = null;

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

  function toast(msg) {
    if (_ctx.toast) {
      try {
        _ctx.toast(msg);
      } catch (e1) {}
    } else if (global.toast) {
      try {
        global.toast(msg);
      } catch (e2) {}
    }
  }

  function getPassports() {
    if (typeof global.MCSAT_getPassports !== 'function') return [];
    return global.MCSAT_getPassports();
  }

  function requiredComplete(p) {
    return !!(
      p.satId &&
      p.imageUrl &&
      p.title &&
      p.scientificName &&
      p.category &&
      p.origin &&
      p.licenseType &&
      (p.verificationStatus === 'Verified' ||
        p.verificationStatus === 'Pending Review' ||
        p.verificationStatus === 'Pending')
    );
  }

  function passportToAsset(p) {
    return {
      id: String(p.satId || p.id),
      title: p.title,
      scientificName: p.scientificName,
      commonName: p.commonName || '',
      category: p.category,
      assetType: 'Specimen Image',
      origin: p.origin,
      collection: p.collection || 'Owner collection',
      verificationStatus: p.verificationStatus === 'Pending Review' ? 'Pending' : p.verificationStatus || 'Pending',
      licenseType: p.licenseType,
      price: Number(p.price) || 0,
      currency: 'USD',
      availability: p.inquiryOnly ? 'Inquiry only' : 'Listed',
      imageUrl: p.imageUrl,
      thumbnailUrl: p.imageUrl,
      description: p.description || '',
      provenance: (p.provenanceNotes ? [{ date: p.acquisitionDate || '—', event: p.provenanceNotes }] : []).concat(
        p.custodyNotes ? [{ date: '—', event: p.custodyNotes }] : []
      ),
      metadata: {
        family: p.family || '',
        genus: p.genus || '',
        species: p.species || '',
      },
      ownerId: p.ownerId || 'current-user',
      isPublished: true,
      updatedAt: new Date().toISOString().slice(0, 10),
      scientificGrade: 'Grade B',
      rarity: 'Owner',
    };
  }

  function dashNavTitle_() {
    try {
      if (_ctx.t && typeof _ctx.t === 'function') return String(_ctx.t('nav_passports') || 'SAT市場');
    } catch (e0) {}
    return 'SAT市場';
  }

  function renderHeader_() {
    return (
      '<div class="mc-pass-dash__header">' +
      '<div><h2>' +
      esc(dashNavTitle_()) +
      '</h2><p class="mc-pass-dash__sub">管理你的標本卡片、SAT ID、來源、授權、圖片與驗證狀態。</p></div>' +
      '<div class="mc-pass-dash__actions">' +
      '<button type="button" data-mc-pass-header="new">新增標本護照</button>' +
      '<button type="button" data-mc-pass-header="import">匯入資料</button>' +
      '<button type="button" data-mc-pass-header="batch">批次管理</button>' +
      '<button type="button" data-mc-pass-header="export-json">匯出 JSON</button>' +
      '<button type="button" data-mc-pass-header="export-csv">匯出 CSV</button>' +
      '<button type="button" class="mc-pass-dash__primary" data-route="/marketplace">前往公開 SAT 市集</button>' +
      '</div></div>'
    );
  }

  function statusBadge(st) {
    return '<span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.15);">' + esc(st || '') + '</span>';
  }

  function renderGrid_() {
    var list = getPassports();
    var cards = list
      .map(function (p) {
        var pct = Math.min(100, Math.max(0, Number(p.completionRate) || 0));
        return (
          '<article class="mc-pass-card" data-mc-pass-card="' +
          escAttr(p.id) +
          '">' +
          '<div class="mc-pass-card__media">' +
          (p.imageUrl
            ? '<img src="' + escAttr(p.imageUrl) + '" alt="" loading="lazy" decoding="async"/>'
            : '<div style="height:100%;background:#111;"></div>') +
          '</div><div class="mc-pass-card__body">' +
          '<div class="mc-pass-card__id">' +
          esc(p.satId || '') +
          '</div>' +
          '<h3 class="mc-pass-card__title">' +
          esc(p.title || '') +
          '</h3>' +
          '<p class="mc-pass-card__sci">' +
          esc(p.scientificName || '') +
          '</p>' +
          '<div class="mc-pass-card__meta">' +
          statusBadge(p.status) +
          ' · ' +
          esc(p.collection || '') +
          '</div>' +
          '<div class="mc-pass-card__meta">Updated ' +
          esc(p.updatedAt || '') +
          '</div>' +
          '<div class="mc-pass-card__bar"><span style="width:' +
          esc(String(pct)) +
          '%;"></span></div>' +
          '<div class="mc-pass-card__meta">Completion ' +
          esc(String(pct)) +
          '%</div>' +
          '<div class="mc-pass-card__actions">' +
          '<button type="button" data-mc-pass-act="edit" data-id="' +
          escAttr(p.id) +
          '">Edit</button>' +
          '<button type="button" data-mc-pass-act="preview" data-id="' +
          escAttr(p.id) +
          '">Preview Passport</button>' +
          '<button type="button" data-mc-pass-act="publish" data-id="' +
          escAttr(p.id) +
          '">Publish to Marketplace</button>' +
          '<button type="button" data-mc-pass-act="dup" data-id="' +
          escAttr(p.id) +
          '">Duplicate</button>' +
          '<button type="button" data-mc-pass-act="archive" data-id="' +
          escAttr(p.id) +
          '">Archive</button>' +
          '</div></div></article>'
        );
      })
      .join('');
    return '<div class="mc-pass-dash">' + renderHeader_() + '<div class="mc-pass-dash__grid">' + cards + '</div></div>';
  }

  function field_(label, key, val, type) {
    type = type || 'text';
    if (type === 'textarea') {
      return (
        '<div><label>' +
        esc(label) +
        '</label><textarea data-mc-pass-f="' +
        escAttr(key) +
        '">' +
        esc(val || '') +
        '</textarea></div>'
      );
    }
    if (type === 'checkbox') {
      return (
        '<div><label><input type="checkbox" data-mc-pass-f="' +
        escAttr(key) +
        '"' +
        (val ? ' checked' : '') +
        '/> ' +
        esc(label) +
        '</label></div>'
      );
    }
    return (
      '<div><label>' +
      esc(label) +
      '</label><input type="' +
      escAttr(type) +
      '" data-mc-pass-f="' +
      escAttr(key) +
      '" value="' +
      escAttr(val) +
      '"/></div>'
    );
  }

  function renderEditor_() {
    var p = _draft || {};
    var warn = !requiredComplete(p)
      ? '<div class="mc-pass-warn">此標本護照尚未完成，請補齊必要欄位後再上架。</div>'
      : '';
    return (
      '<div class="mc-pass-dash mc-pass-editor">' +
      renderHeader_() +
      warn +
      '<div class="mc-pass-editor__bar">' +
      '<button type="button" data-mc-pass-nav="grid">← 返回列表</button>' +
      '<button type="button" data-mc-pass-nav="preview">Preview Passport</button>' +
      '<button type="button" class="mc-pass-dash__primary" data-mc-pass-save="1">儲存</button>' +
      '<button type="button" data-mc-pass-publish="1">Publish to Marketplace</button>' +
      '</div>' +
      '<fieldset class="mc-pass-fieldset"><h3>A. Basic identity</h3><div class="mc-pass-fields">' +
      field_('SAT ID', 'satId', p.satId) +
      field_('Specimen name', 'title', p.title) +
      field_('Scientific name', 'scientificName', p.scientificName) +
      field_('Common name', 'commonName', p.commonName) +
      field_('Category', 'category', p.category) +
      field_('Taxonomy', 'taxonomy', p.taxonomy) +
      field_('Description', 'description', p.description, 'textarea') +
      '</div></fieldset>' +
      '<fieldset class="mc-pass-fieldset"><h3>B. Image & media</h3><div class="mc-pass-fields">' +
      field_('Main image URL', 'imageUrl', p.imageUrl) +
      field_('Image license', 'licenseType', p.licenseType) +
      '</div></fieldset>' +
      '<fieldset class="mc-pass-fieldset"><h3>C. Provenance</h3><div class="mc-pass-fields">' +
      field_('Origin country / region', 'origin', p.origin) +
      field_('Collection location', 'collection', p.collection) +
      field_('Collector', 'collector', p.collector) +
      field_('Acquisition method', 'acquisitionMethod', p.acquisitionMethod) +
      field_('Date', 'acquisitionDate', p.acquisitionDate) +
      field_('Chain of custody notes', 'custodyNotes', p.custodyNotes, 'textarea') +
      field_('Provenance narrative', 'provenanceNotes', p.provenanceNotes, 'textarea') +
      '</div></fieldset>' +
      '<fieldset class="mc-pass-fieldset"><h3>D. Scientific metadata</h3><div class="mc-pass-fields">' +
      field_('Family', 'family', p.family) +
      field_('Genus', 'genus', p.genus) +
      field_('Species', 'species', p.species) +
      field_('Size', 'size', p.size) +
      field_('Sex', 'sex', p.sex) +
      field_('Condition', 'condition', p.condition) +
      field_('Preservation', 'preservation', p.preservation) +
      field_('Reference notes', 'referenceNotes', p.referenceNotes, 'textarea') +
      '</div></fieldset>' +
      '<fieldset class="mc-pass-fieldset"><h3>E. License & rights</h3><div class="mc-pass-fields">' +
      field_('Personal display', 'licensePersonal', p.licensePersonal, 'checkbox') +
      field_('Educational use', 'licenseEducation', p.licenseEducation, 'checkbox') +
      field_('Research citation', 'licenseResearch', p.licenseResearch, 'checkbox') +
      field_('Commercial use', 'licenseCommercial', p.licenseCommercial, 'checkbox') +
      field_('Custom license notes', 'licenseCustomNotes', p.licenseCustomNotes, 'textarea') +
      '</div></fieldset>' +
      '<fieldset class="mc-pass-fieldset"><h3>F. Marketplace publishing</h3><div class="mc-pass-fields">' +
      field_('Listed (yes if checked)', 'listed', p.listed, 'checkbox') +
      field_('Price (USD)', 'price', p.price) +
      field_('Inquiry only', 'inquiryOnly', p.inquiryOnly, 'checkbox') +
      field_('Public visibility', 'publicVisibility', p.publicVisibility, 'checkbox') +
      '</div></fieldset>' +
      '<fieldset class="mc-pass-fieldset"><h3>G. Verification</h3><div class="mc-pass-fields">' +
      field_('Verification status', 'verificationStatus', p.verificationStatus) +
      field_('Reviewer notes', 'reviewerNotes', p.reviewerNotes, 'textarea') +
      field_('Confidence score', 'confidenceScore', p.confidenceScore, 'number') +
      '</div></fieldset>' +
      '</div>'
    );
  }

  function renderPreview_() {
    var p = _draft || {};
    return (
      '<div class="mc-pass-dash">' +
      renderHeader_() +
      '<div class="mc-pass-editor__bar">' +
      '<button type="button" data-mc-pass-nav="grid">← 返回列表</button>' +
      '<button type="button" data-mc-pass-nav="editor">Back to editor</button>' +
      '</div>' +
      '<div class="mc-pass-preview">' +
      '<div class="mc-pass-preview__head">' +
      (p.imageUrl ? '<img src="' + escAttr(p.imageUrl) + '" alt=""/>' : '<div></div>') +
      '<div><div class="mc-pass-preview__seal">' +
      esc(p.verificationStatus || 'Draft') +
      '</div><h2 style="margin:8px 0 4px;">' +
      esc(p.title || '') +
      '</h2><div style="font-style:italic;color:#9aa89a;">' +
      esc(p.scientificName || '') +
      '</div><div class="mc-pass-card__id" style="margin-top:8px;">' +
      esc(p.satId || '') +
      '</div></div></div>' +
      '<p style="font-size:13px;color:#c5c9c2;">Taxonomy: ' +
      esc(p.taxonomy || '—') +
      '</p>' +
      '<p style="font-size:13px;">Origin: ' +
      esc(p.origin || '—') +
      ' · License: ' +
      esc(p.licenseType || '—') +
      '</p>' +
      '<div style="margin-top:14px;padding:12px;border:1px dashed rgba(255,255,255,.2);border-radius:8px;font-size:12px;color:#9aa89a;">QR code placeholder · Origin map placeholder</div>' +
      '<p style="font-size:12px;margin-top:12px;color:#8eb8d4;">Owner / collection: ' +
      esc(p.collection || '') +
      '</p></div></div>'
    );
  }

  function readDraftFromDom_() {
    if (!_root || !_draft) return;
    _root.querySelectorAll('[data-mc-pass-f]').forEach(function (el) {
      var k = el.getAttribute('data-mc-pass-f');
      if (!k) return;
      if (el.type === 'checkbox') {
        _draft[k] = !!el.checked;
      } else {
        _draft[k] = el.value;
      }
    });
  }

  function wire_() {
    if (!_root) return;
    _root.onclick = function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var hdr = t.closest('[data-mc-pass-header]');
      if (hdr) {
        e.preventDefault();
        var k = hdr.getAttribute('data-mc-pass-header');
        if (k === 'new') {
          var np = {
            id: 'pp-' + String(Date.now()),
            satId: 'SAT-P-' + String(Math.floor(Math.random() * 900000 + 100000)),
            ownerId: 'current-user',
            title: 'New specimen passport',
            scientificName: '',
            commonName: '',
            category: 'Insect',
            origin: '',
            imageUrl: '',
            status: 'Draft',
            collection: 'My collection',
            updatedAt: new Date().toISOString().slice(0, 10),
            isPublished: false,
            verificationStatus: 'Pending Review',
            licenseType: 'Educational use',
            description: '',
            collector: '',
            family: '',
            genus: '',
            species: '',
            taxonomy: '',
            provenanceNotes: '',
            acquisitionMethod: '',
            acquisitionDate: '',
            custodyNotes: '',
            size: '',
            sex: '',
            condition: '',
            preservation: '',
            referenceNotes: '',
            licensePersonal: true,
            licenseEducation: false,
            licenseResearch: false,
            licenseCommercial: false,
            licenseCustomNotes: '',
            listed: false,
            price: '',
            inquiryOnly: true,
            publicVisibility: false,
            reviewerNotes: '',
            missingWarnings: [],
            confidenceScore: 10,
          };
          if (global.MCSAT_upsertPassport) global.MCSAT_upsertPassport(np);
          toast('已新增草稿護照');
          refresh();
          return;
        }
        if (k === 'import' || k === 'batch') {
          toast('示範環境：此功能將連接匯入管線。');
          return;
        }
        if (k === 'export-json') {
          var blob = new Blob([JSON.stringify(getPassports(), null, 2)], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'specimen-passports.json';
          a.click();
          URL.revokeObjectURL(url);
          return;
        }
        if (k === 'export-csv') {
          var rows = getPassports();
          var cols = ['id', 'satId', 'title', 'scientificName', 'status', 'updatedAt', 'completionRate'];
          var escCsv = function (v) {
            var s = String(v == null ? '' : v);
            if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
            return s;
          };
          var lines = [cols.join(',')].concat(
            rows.map(function (r) {
              return cols
                .map(function (c) {
                  return escCsv(r[c]);
                })
                .join(',');
            })
          );
          var blob2 = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
          var url2 = URL.createObjectURL(blob2);
          var a2 = document.createElement('a');
          a2.href = url2;
          a2.download = 'specimen-passports.csv';
          a2.click();
          URL.revokeObjectURL(url2);
          return;
        }
      }
      var nav = t.closest('[data-mc-pass-nav]');
      if (nav) {
        e.preventDefault();
        var nk = nav.getAttribute('data-mc-pass-nav');
        if (nk === 'grid') {
          _view = 'grid';
          _editingId = null;
          _draft = null;
        } else if (nk === 'editor') {
          _view = 'editor';
        } else if (nk === 'preview') {
          readDraftFromDom_();
          _view = 'preview';
        }
        paint_();
        return;
      }
      var save = t.closest('[data-mc-pass-save]');
      if (save) {
        e.preventDefault();
        readDraftFromDom_();
        if (global.MCSAT_upsertPassport) global.MCSAT_upsertPassport(_draft);
        toast('已儲存');
        return;
      }
      var pub = t.closest('[data-mc-pass-publish]');
      if (pub) {
        e.preventDefault();
        readDraftFromDom_();
        tryPublish_(_draft);
        return;
      }
      var card = t.closest('[data-mc-pass-card]');
      if (card && !t.closest('.mc-pass-card__actions')) {
        e.preventDefault();
        var cid = card.getAttribute('data-mc-pass-card');
        var pOpen = global.MCSAT_getPassportById ? global.MCSAT_getPassportById(cid) : null;
        if (pOpen) {
          _view = 'editor';
          _editingId = cid;
          _draft = JSON.parse(JSON.stringify(pOpen));
          paint_();
        }
        return;
      }
      var act = t.closest('[data-mc-pass-act]');
      if (act) {
        e.preventDefault();
        var id = act.getAttribute('data-id');
        var ak = act.getAttribute('data-mc-pass-act');
        var p0 = global.MCSAT_getPassportById ? global.MCSAT_getPassportById(id) : null;
        if (ak === 'edit') {
          _view = 'editor';
          _editingId = id;
          _draft = p0 ? JSON.parse(JSON.stringify(p0)) : null;
          paint_();
          return;
        }
        if (ak === 'preview') {
          _view = 'preview';
          _editingId = id;
          _draft = p0 ? JSON.parse(JSON.stringify(p0)) : null;
          paint_();
          return;
        }
        if (ak === 'publish') {
          tryPublish_(global.MCSAT_getPassportById ? global.MCSAT_getPassportById(id) : p0);
          return;
        }
        if (ak === 'dup' && p0) {
          var copy = JSON.parse(JSON.stringify(p0));
          copy.id = 'pp-' + String(Date.now());
          copy.satId = 'SAT-P-' + String(Math.floor(Math.random() * 900000 + 100000));
          copy.status = 'Draft';
          copy.isPublished = false;
          if (global.MCSAT_upsertPassport) global.MCSAT_upsertPassport(copy);
          toast('已複製護照');
          refresh();
          return;
        }
        if (ak === 'archive' && p0 && global.MCSAT_upsertPassport) {
          global.MCSAT_upsertPassport({ id: p0.id, status: 'Archived', isPublished: false, listed: false });
          toast('已封存');
          refresh();
          return;
        }
      }
    };
  }

  function tryPublish_(p) {
    if (!p || !global.MCSAT_upsertPassport) return;
    if (!requiredComplete(p)) {
      toast('此標本護照尚未完成，請補齊必要欄位後再上架。');
      return;
    }
    var asset = passportToAsset(p);
    if (global.MCSAT_appendRuntimePublishedAsset) global.MCSAT_appendRuntimePublishedAsset(asset);
    global.MCSAT_upsertPassport({
      id: p.id,
      isPublished: true,
      status: 'Listed',
      listed: true,
      publicVisibility: true,
    });
    toast('已上架至公開 SAT 市集（示範資料）。');
    _view = 'grid';
    _editingId = null;
    _draft = null;
    paint_();
  }

  function paint_() {
    if (!_root) return;
    if (_view === 'editor') {
      _root.innerHTML = renderEditor_();
    } else if (_view === 'preview') {
      _root.innerHTML = renderPreview_();
    } else {
      _root.innerHTML = renderGrid_();
    }
    wire_();
  }

  function refresh() {
    _view = 'grid';
    _editingId = null;
    _draft = null;
    paint_();
  }

  function mount(root, ctx) {
    _root = root;
    _ctx = ctx || {};
    if (_root) {
      _root.className = 'mc-pass-dash';
      _root.setAttribute('aria-label', dashNavTitle_());
    }
    refresh();
  }

  global.MCSatPassportDash = {
    mount: mount,
    refresh: refresh,
    paint: paint_,
  };
})(typeof window !== 'undefined' ? window : this);
