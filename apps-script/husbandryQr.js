/**
 * Husbandry Log — QR import / camera / preview (Phase 14 split).
 * Loaded before husbandry-log.js. Host wires via MCHusbandryQr.create(api).
 * Does not change public action names or MCHusbandryLog API.
 */
(function (global) {
  'use strict';

  function create(api) {
    function state() { return api.getState(); }
    function t(k) { return api.t(k); }
    function esc(s) { return api.esc(s); }
    function saveState() { return api.saveState(); }
    function render() { return api.render(); }
    function showToast_(msg, ms) { return api.showToast(msg, ms); }
    function DATA_EXPORT() { return api.dataExport(); }
    function LABEL_API() { return api.labelApi(); }
    function petQrUrl(id) { return api.petQrUrl(id); }
    function labelQrData(pet) { return api.labelQrData(pet); }
    function enrichPet(pet) { return api.enrichPet(pet); }
    function genId() { return api.genId(); }
    function genHusbandryId() { return api.genHusbandryId(); }
    function todayKey() { return api.todayKey(); }
    function getActivePet() { return api.getActivePet(); }
    function confirmHighRisk_(msg) { return api.confirmHighRisk(msg); }
    function exportHelpers_() { return api.exportHelpers(); }
    function clearPendingUndo_() { return api.clearPendingUndo(); }

    function canUseQrCamera_() {
      try {
        if (typeof global.BarcodeDetector === 'function') return true;
        return !!(global.navigator && global.navigator.mediaDevices && global.navigator.mediaDevices.getUserMedia);
      } catch (e) {
        return false;
      }
    }

    function normalizeQrImportText_(text) {
      return String(text == null ? '' : text).replace(/^\uFEFF/, '').trim();
    }

    function parseQrImportPayload_(text) {
      var st = state();
      var raw = normalizeQrImportText_(text);
      if (!raw) {
        return { ok: false, errorKey: 'qrImportEmpty' };
      }
      if (raw.charAt(0) === '{' || raw.charAt(0) === '[') {
        try {
          var json = JSON.parse(raw);
          var rawVer = json && (json.schemaVersion != null ? json.schemaVersion : json.version);
          if (rawVer != null && Number(rawVer) > 1) {
            return { ok: false, errorKey: 'qrImportSchemaUnsupported' };
          }
          var exp = DATA_EXPORT();
          if (exp && typeof exp.parseImportPayload === 'function') {
            var parsedBackup;
            try {
              parsedBackup = exp.parseImportPayload(json);
            } catch (eParse) {
              var issues = (eParse && eParse.issues) || [];
              var unsupported = issues.some(function (iss) {
                return iss && (iss.code === 'unsupported_version' || iss.code === 'unsupported_schema');
              });
              if (!unsupported && eParse && /unsupported_version|schema/i.test(String(eParse.message || ''))) {
                unsupported = true;
              }
              if (unsupported) return { ok: false, errorKey: 'qrImportSchemaUnsupported' };
              return { ok: false, errorKey: 'qrImportInvalid' };
            }
            var schema = parsedBackup && (parsedBackup.schemaVersion || parsedBackup.version);
            if (schema != null && Number(schema) > 1) {
              return { ok: false, errorKey: 'qrImportSchemaUnsupported' };
            }
            var summary = exp.summarizeImport
              ? exp.summarizeImport(parsedBackup)
              : { petCount: (parsedBackup.pets || []).length, recordCount: (parsedBackup.records || parsedBackup.careLogs || []).length };
            return {
              ok: true,
              kind: 'backup',
              schemaVersion: schema || 1,
              payload: parsedBackup,
              summary: summary,
            };
          }
          if (json && (json.pets || json.careLogs || json.records)) {
            return {
              ok: true,
              kind: 'backup',
              schemaVersion: json.schemaVersion || json.version || 1,
              payload: json,
              summary: {
                petCount: (json.pets || []).length,
                recordCount: (json.records || json.careLogs || []).length,
              },
            };
          }
          return { ok: false, errorKey: 'qrImportInvalid' };
        } catch (eJson) {
          return { ok: false, errorKey: 'qrImportInvalidJson' };
        }
      }
      var link = null;
      try {
        var params;
        if (raw.indexOf('http') === 0 || raw.indexOf('//') === 0) {
          var url = new URL(raw.indexOf('//') === 0 ? 'https:' + raw : raw);
          var qs = url.hash && url.hash.indexOf('?') >= 0
            ? url.hash.slice(url.hash.indexOf('?') + 1)
            : (url.search ? url.search.replace(/^\?/, '') : '');
          if (!qs && raw.indexOf('petId=') < 0) {
            return { ok: false, errorKey: 'qrImportInvalidUrl' };
          }
          params = new URLSearchParams(qs || '');
        } else if (raw.indexOf('petId=') >= 0 || raw.indexOf('husbandryId=') >= 0) {
          var qStart = raw.indexOf('?');
          params = new URLSearchParams(qStart >= 0 ? raw.slice(qStart + 1) : raw);
        } else if (raw.indexOf('#') >= 0 && raw.indexOf('petId=') >= 0) {
          var hashQ = raw.indexOf('?');
          params = new URLSearchParams(hashQ >= 0 ? raw.slice(hashQ + 1) : '');
        } else if (/^[a-zA-Z0-9_-]{4,64}$/.test(raw)) {
          link = { petId: raw, view: '', schemaVersion: 1 };
        } else {
          return { ok: false, errorKey: 'qrImportInvalid' };
        }
        if (!link) {
          var petId = params.get('petId') || params.get('husbandryId') || '';
          if (!petId) return { ok: false, errorKey: 'qrImportInvalidUrl' };
          link = {
            petId: petId,
            view: params.get('view') || '',
            schemaVersion: Number(params.get('schema') || params.get('v') || 1) || 1,
          };
        }
      } catch (eUrl) {
        return { ok: false, errorKey: 'qrImportInvalidUrl' };
      }
      if (link.schemaVersion > 1) {
        return { ok: false, errorKey: 'qrImportSchemaUnsupported' };
      }
      var matched = (st.pets || []).filter(function (p) {
        return p.id === link.petId || p.husbandryId === link.petId;
      })[0] || null;
      return {
        ok: true,
        kind: matched ? 'local_pet' : 'missing_pet',
        schemaVersion: link.schemaVersion,
        link: link,
        matchedPet: matched,
      };
    }

    function buildQrImportDraft_(text) {
      var result = parseQrImportPayload_(text);
      if (!result.ok) {
        return { ok: false, errorKey: result.errorKey || 'qrImportInvalid', raw: normalizeQrImportText_(text) };
      }
      return Object.assign({ ok: true, raw: normalizeQrImportText_(text) }, result);
    }

    function openQrImportSheet_() {
      var st = state();
      st.ui.sheet = 'qr-import';
      st.ui.qrImportText = '';
      st.ui.qrImportError = '';
      st.ui.qrImportDraft = null;
      st.ui.qrImportBusy = false;
      st.ui.qrImportMode = st.ui.qrImportMode || 'paste';
      st.ui.recordId = null;
      st.ui.showMoreRecords = false;
      saveState();
      render();
    }

    function submitQrImportPreview_() {
      var st = state();
      if (st.ui.qrImportBusy) return;
      st.ui.qrImportBusy = true;
      var draft = buildQrImportDraft_(st.ui.qrImportText);
      st.ui.qrImportBusy = false;
      if (!draft.ok) {
        st.ui.qrImportError = t(draft.errorKey || 'qrImportInvalid');
        st.ui.qrImportDraft = null;
        saveState();
        render();
        return;
      }
      st.ui.qrImportError = '';
      st.ui.qrImportDraft = draft;
      st.ui.sheet = 'qr-import-preview';
      saveState();
      render();
    }

    function commitQrImportOpen_() {
      var st = state();
      var draft = st.ui.qrImportDraft;
      if (!draft || draft.kind !== 'local_pet' || !draft.matchedPet) return;
      var pet = draft.matchedPet;
      var view = draft.link && draft.link.view;
      st.ui.sheet = null;
      st.ui.qrImportDraft = null;
      st.ui.qrImportText = '';
      st.ui.qrImportError = '';
      st.activePetId = pet.id;
      st.boardTab = 'cards';
      st.phase = view === 'scan' ? 'scan' : 'board';
      saveState();
      render();
      showToast_(t('qrImportOpen'));
    }

    function commitQrImportCopy_() {
      var st = state();
      var draft = st.ui.qrImportDraft;
      if (!draft || !draft.matchedPet) return;
      var src = draft.matchedPet;
      var clone = JSON.parse(JSON.stringify(src));
      clone.id = genId();
      clone.husbandryId = genHusbandryId();
      clone.petName = (src.petName || t('addPet')) + ' ' + t('qrImportCopySuffix');
      clone.qrUrl = petQrUrl(clone.id);
      clone.questProgress = { date: todayKey(), done: [], skipped: [] };
      enrichPet(clone);
      st.pets.push(clone);
      st.ui.sheet = null;
      st.ui.qrImportDraft = null;
      st.ui.qrImportText = '';
      st.activePetId = clone.id;
      st.phase = 'board';
      st.boardTab = 'cards';
      saveState();
      render();
      showToast_(t('qrImportCopyDone'));
    }

    function commitQrImportBackup_(mode) {
      var st = state();
      var draft = st.ui.qrImportDraft;
      var exp = DATA_EXPORT();
      if (!draft || draft.kind !== 'backup' || !exp || !draft.payload) return;
      if (mode === 'replace' && !confirmHighRisk_(t('importReplaceConfirm'))) return;
      var snapshot = null;
      try {
        snapshot = JSON.parse(JSON.stringify({
          pets: st.pets,
          careLogs: st.careLogs,
          breedingPairs: st.breedingPairs,
          breedingEvents: st.breedingEvents,
          offspring: st.offspring,
          activePetId: st.activePetId,
        }));
        exp.applyImport(st, draft.payload, mode === 'replace' ? 'replace' : 'merge', exportHelpers_());
        st.ui.sheet = null;
        st.ui.qrImportDraft = null;
        st.ui.qrImportText = '';
        st.ui.qrImportError = '';
        if (!saveState()) throw new Error('persist_failed');
        clearPendingUndo_();
        render();
        showToast_(t('importDone'));
      } catch (e) {
        if (snapshot) {
          st.pets = snapshot.pets || [];
          st.careLogs = snapshot.careLogs || [];
          st.breedingPairs = snapshot.breedingPairs || [];
          st.breedingEvents = snapshot.breedingEvents || [];
          st.offspring = snapshot.offspring || [];
          st.activePetId = snapshot.activePetId;
        }
        st.ui.qrImportError = t('importFailed');
        st.ui.sheet = 'qr-import';
        try { saveState(); } catch (e2) {}
        render();
        showToast_(t('batchWriteFailed'), 3200);
      }
    }

    function startQrCameraScan_() {
      if (!canUseQrCamera_()) {
        showToast_(t('qrImportCameraUnavailable'), 2800);
        return;
      }
      if (typeof global.BarcodeDetector !== 'function') {
        showToast_(t('qrImportCameraHint'), 3200);
        return;
      }
      var detector = new global.BarcodeDetector({ formats: ['qr_code'] });
      global.navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (stream) {
        var video = global.document.createElement('video');
        video.setAttribute('playsinline', 'true');
        video.srcObject = stream;
        video.play();
        var tries = 0;
        var timer = global.setInterval(function () {
          tries += 1;
          detector.detect(video).then(function (codes) {
            if (!codes || !codes.length) {
              if (tries > 40) {
                global.clearInterval(timer);
                stream.getTracks().forEach(function (tr) { tr.stop(); });
                showToast_(t('qrImportCameraTimeout'), 2800);
              }
              return;
            }
            global.clearInterval(timer);
            stream.getTracks().forEach(function (tr) { tr.stop(); });
            var value = codes[0].rawValue || '';
            var st = state();
            st.ui.qrImportText = value;
            st.ui.qrImportMode = 'paste';
            saveState();
            submitQrImportPreview_();
          }).catch(function () {
            if (tries > 40) {
              global.clearInterval(timer);
              stream.getTracks().forEach(function (tr) { tr.stop(); });
              showToast_(t('qrImportCameraUnavailable'), 2800);
            }
          });
        }, 350);
      }).catch(function () {
        showToast_(t('qrImportCameraUnavailable'), 2800);
      });
    }

    function openQrPreviewSheet_(pet) {
      if (!pet) return;
      if (!pet.qrUrl) {
        enrichPet(pet);
        pet.qrUrl = petQrUrl(pet.id);
      }
      var st = state();
      st.ui.sheet = 'qr-preview';
      st.ui.qrPreviewPetId = pet.id;
      saveState();
      render();
    }

    function copyQrLink(pet) {
      enrichPet(pet);
      var url = pet.qrUrl || petQrUrl(pet.id);
      if (url.indexOf('#') === 0) {
        try { url = global.location.origin + global.location.pathname + url; } catch (e2) {}
      }
      try {
        if (global.navigator && global.navigator.clipboard) {
          global.navigator.clipboard.writeText(url).then(function () {
            var st = state();
            st.toast = t('qrLinkCopied');
            saveState(); render();
            global.setTimeout(function () { st.toast = null; render(); }, 2000);
          });
          return;
        }
      } catch (e2) {}
      var st2 = state();
      st2.toast = url;
      saveState(); render();
    }

    function shareQrLink(pet) {
      if (!pet) return;
      enrichPet(pet);
      if (!pet.qrUrl) pet.qrUrl = petQrUrl(pet.id);
      var url = pet.qrUrl || petQrUrl(pet.id);
      if (url.indexOf('#') === 0) {
        try { url = global.location.origin + global.location.pathname + url; } catch (e2) {}
      }
      try {
        if (global.navigator && typeof global.navigator.share === 'function') {
          global.navigator.share({
            title: pet.petName || t('appChromeTitle'),
            text: t('shareQrText').replace('{name}', pet.petName || ''),
            url: url,
          }).then(function () {
            showToast_(t('shareQrDone'));
          }).catch(function (err) {
            var name = err && err.name ? String(err.name) : '';
            if (name === 'AbortError' || name === 'NotAllowedError') return;
            copyQrLink(pet);
          });
          return;
        }
      } catch (e3) {}
      copyQrLink(pet);
    }

    function renderQrImportSheet_() {
      var st = state();
      var mode = st.ui.qrImportMode || 'paste';
      var camOk = canUseQrCamera_();
      var err = st.ui.qrImportError
        ? '<p class="hlc-sheet__error" role="alert">' + esc(st.ui.qrImportError) + '</p>'
        : '';
      var modeBtns = [
        { id: 'paste', key: 'qrImportModePaste' },
        { id: 'url', key: 'qrImportModeUrl' },
        { id: 'manual', key: 'qrImportModeManual' },
      ].map(function (m) {
        return '<button type="button" class="hlc-pet-toolbar__chip' + (mode === m.id ? ' is-active' : '') + '" data-hl-action="qr-import-mode" data-hl-qr-mode="' + m.id + '">' + esc(t(m.key)) + '</button>';
      }).join('');
      var inputLabel = t('qrImportPasteLabel');
      var inputPh = t('qrImportPlaceholder');
      var inputType = 'text';
      if (mode === 'url') {
        inputLabel = t('qrImportUrlLabel');
        inputPh = t('qrImportUrlPlaceholder');
        inputType = 'url';
      } else if (mode === 'manual') {
        inputLabel = t('qrImportManualLabel');
        inputPh = t('qrImportManualPlaceholder');
      }
      return (
        '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
        '<div class="hlc-sheet hlc-sheet--qr-import" role="dialog" aria-modal="true">' +
        '<div class="hlc-sheet__handle"></div>' +
        '<h2 class="hlc-sheet__title">' + esc(t('importQr')) + '</h2>' +
        '<p class="hlc-sheet__hint">' + esc(t('importQrHint')) + '</p>' +
        '<div class="hlc-qr-import-modes" role="group" aria-label="' + esc(t('qrImportModeLabel')) + '">' + modeBtns + '</div>' +
        err +
        '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(inputLabel) + '</span>' +
        '<input type="' + inputType + '" class="hlc-sheet-input" value="' + esc(st.ui.qrImportText || '') + '" data-hl-field="qrImportText" placeholder="' + esc(inputPh) + '" autocomplete="off" /></label>' +
        '<div class="hlc-qr-import-extra">' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm"' + (camOk ? '' : ' disabled') + ' data-hl-action="qr-import-camera" title="' + esc(camOk ? t('qrImportCamera') : t('qrImportCameraUnavailable')) + '">' +
        esc(t('qrImportCamera')) + '</button>' +
        '<details class="hlc-qr-import-image">' +
        '<summary>' + esc(t('qrImportFromImage')) + '</summary>' +
        '<p class="hlc-sheet__hint">' + esc(t('qrImportFromImageHint')) + '</p>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" disabled>' + esc(t('qrImportFromImageSoon')) + '</button>' +
        '</details></div>' +
        '<div class="hlc-sheet__actions hlc-sheet__actions--stack">' +
        '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="qr-import-submit"' + (st.ui.qrImportBusy ? ' disabled' : '') + '>' +
        esc(t('qrImportPreview')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="close-sheet">' + esc(t('cancel')) + '</button>' +
        '</div></div></div>'
      );
    }

    function renderQrImportPreviewSheet_() {
      var st = state();
      var draft = st.ui.qrImportDraft;
      if (!draft || !draft.ok) {
        return renderQrImportSheet_();
      }
      var body = '';
      var actions = '';
      if (draft.kind === 'local_pet' && draft.matchedPet) {
        body =
          '<p class="hlc-sheet__hint">' + esc(t('qrImportFoundLocal')) + '</p>' +
          '<dl class="hlc-dl hlc-qr-import-preview">' +
          '<div><dt>' + esc(t('petName')) + '</dt><dd>' + esc(draft.matchedPet.petName || '') + '</dd></div>' +
          '<div><dt>' + esc(t('husbandryId')) + '</dt><dd><code>' + esc(draft.matchedPet.husbandryId || draft.matchedPet.id) + '</code></dd></div>' +
          '</dl>';
        actions =
          '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="qr-import-open">' + esc(t('qrImportOpenPet')) + '</button>' +
          '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="qr-import-copy">' + esc(t('qrImportCreateCopy')) + '</button>';
      } else if (draft.kind === 'missing_pet') {
        body =
          '<p class="hlc-sheet__error" role="alert">' + esc(t('qrImportNotFoundBody').replace('{id}', draft.link && draft.link.petId ? draft.link.petId : '')) + '</p>';
        actions = '';
      } else if (draft.kind === 'backup') {
        var sum = draft.summary || {};
        body =
          '<p class="hlc-sheet__hint">' + esc(t('qrImportBackupPreview')) + '</p>' +
          '<p><strong>' + esc(t('qrImportSchemaVersion')) + ':</strong> ' + esc(String(draft.schemaVersion || 1)) + '</p>' +
          '<p>' + esc(t('importConfirmBody').replace('{pets}', String(sum.petCount || 0)).replace('{records}', String(sum.recordCount || 0))) + '</p>';
        actions =
          '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="qr-import-merge">' + esc(t('importConfirmMerge')) + '</button>' +
          '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="qr-import-replace">' + esc(t('importConfirmReplace')) + '</button>';
      }
      return (
        '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
        '<div class="hlc-sheet hlc-sheet--qr-import-preview" role="dialog" aria-modal="true">' +
        '<div class="hlc-sheet__handle"></div>' +
        '<h2 class="hlc-sheet__title">' + esc(t('qrImportPreviewTitle')) + '</h2>' +
        body +
        '<div class="hlc-sheet__actions hlc-sheet__actions--stack">' +
        actions +
        '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="qr-import-back">' + esc(t('qrImportBack')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="qr-import-cancel">' + esc(t('cancel')) + '</button>' +
        '</div></div></div>'
      );
    }

    function renderQrPreviewSheet_() {
      var st = state();
      var pet = (st.pets || []).filter(function (p) { return p.id === st.ui.qrPreviewPetId; })[0] || getActivePet();
      if (!pet) return '';
      enrichPet(pet);
      if (!pet.qrUrl) pet.qrUrl = petQrUrl(pet.id);
      var tplApi = LABEL_API();
      var qrData = labelQrData(pet);
      var qrSrc = tplApi ? tplApi.qrImageUrl(qrData, 220) : '';
      return (
        '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
        '<div class="hlc-sheet hlc-sheet--qr" role="dialog">' +
        '<div class="hlc-sheet__handle"></div>' +
        '<h2 class="hlc-sheet__title">' + esc(t('qrPreviewTitle')) + '</h2>' +
        '<p class="hlc-sheet__hint">' + esc(pet.petName) + '</p>' +
        (qrSrc ? '<div class="hlc-qr-preview"><img src="' + qrSrc + '" alt="" width="220" height="220" /></div>' : '') +
        '<p class="hlc-profile-qr-url"><code>' + esc(qrData) + '</code></p>' +
        '<div class="hlc-sheet__actions hlc-sheet__actions--stack">' +
        '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="share-qr">' + esc(t('shareQr')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="copy-qr-link">' + esc(t('qrCopyLink')) + '</button>' +
        '</div></div></div>'
      );
    }

    return {
      canUseQrCamera: canUseQrCamera_,
      normalizeQrImportText: normalizeQrImportText_,
      parseQrImportPayload: parseQrImportPayload_,
      buildQrImportDraft: buildQrImportDraft_,
      openQrImportSheet: openQrImportSheet_,
      submitQrImportPreview: submitQrImportPreview_,
      commitQrImportOpen: commitQrImportOpen_,
      commitQrImportCopy: commitQrImportCopy_,
      commitQrImportBackup: commitQrImportBackup_,
      startQrCameraScan: startQrCameraScan_,
      openQrPreviewSheet: openQrPreviewSheet_,
      copyQrLink: copyQrLink,
      shareQrLink: shareQrLink,
      renderQrImportSheet: renderQrImportSheet_,
      renderQrImportPreviewSheet: renderQrImportPreviewSheet_,
      renderQrPreviewSheet: renderQrPreviewSheet_,
    };
  }

  global.MCHusbandryQr = { create: create };
})(typeof window !== 'undefined' ? window : this);
