/**
 * Husbandry Log — batch (Phase 14 split).
 * Loaded before husbandry-log.js. Host: MCHusbandryBatch.create(api).
 */
(function (global) {
  'use strict';

  function create(api) {

    function _gs() { return api.getState(); }
    function t(k) { return api.t(k); }
    function esc(s) { return api.esc(s); }
    function saveState() { return api.saveState(); }
    function render() { return api.render(); }
    function showToast_(msg, ms) { return api.showToast(msg, ms); }
    function petLogs(id) { return api.petLogs(id); }
    function getActivePet() { return api.getActivePet(); }
    function buildDailyCompletionSeries_(pet, days) { return api.buildDailyCompletionSeries(pet, days); }
    function fmtDate(d) { return api.fmtDate ? api.fmtDate(d) : String(d || ''); }
    function lifeStageLabel(pet) { return api.lifeStageLabel ? api.lifeStageLabel(pet) : ''; }
    function addLog(petId, payload) { return api.addLog(petId, payload); }
    function autoCompleteQuestsForRecord_(pet, recordId) { return api.autoCompleteQuestsForRecord(pet, recordId); }
    function recordTodayQuestSnapshot_(pet) { return api.recordTodayQuestSnapshot(pet); }
    function ensureQuestProgress(pet) { return api.ensureQuestProgress(pet); }
    function priorityTasks(pet) { return api.priorityTasks(pet); }
    function cloneJson_(v) { return api.cloneJson(v); }
    function showUndoToast_(msg, payload) { return api.showUndoToast(msg, payload); }
    function filteredSortedPets_() { return api.filteredSortedPets(); }
    function DATA_EXPORT() { return api.dataExport(); }
    function downloadText_(name, body, mime) { return api.downloadText(name, body, mime); }
    function LABEL_API() { return api.labelApi(); }
    function exportHelpers_() { return api.exportHelpers(); }
    function confirmHighRisk_(msg) { return api.confirmHighRisk(msg); }

    function batchSelectedIds_() {
      if (!_gs().ui.batchSelected || !Array.isArray(_gs().ui.batchSelected)) _gs().ui.batchSelected = [];
      return _gs().ui.batchSelected;
    }
    function toggleBatchSelect_(petId, selected) {
      var ids = batchSelectedIds_();
      var idx = ids.indexOf(petId);
      if (selected && idx < 0) ids.push(petId);
      else if (!selected && idx >= 0) ids.splice(idx, 1);
      _gs().ui.batchSelected = ids;
      saveState();
      render();
    }
    function snapshotQuestProgressForPets_(petIds) {
      return (petIds || []).map(function (id) {
        var pet = _gs().pets.filter(function (p) { return p.id === id; })[0];
        return {
          petId: id,
          questProgress: pet && pet.questProgress ? cloneJson_(pet.questProgress) : null,
        };
      });
    }
    function restoreQuestProgressSnapshots_(snaps) {
      (snaps || []).forEach(function (snap) {
        var pet = _gs().pets.filter(function (p) { return p.id === snap.petId; })[0];
        if (!pet) return;
        if (snap.questProgress) pet.questProgress = cloneJson_(snap.questProgress);
        else delete pet.questProgress;
      });
    }
    function batchLogRecord_(petIds, recordId, logType, note) {
      var createdIds = [];
      var backupLogs = _gs().careLogs.slice();
      var questSnaps = snapshotQuestProgressForPets_(petIds);
      try {
        petIds.forEach(function (id) {
          var pet = _gs().pets.filter(function (p) { return p.id === id; })[0];
          if (!pet) return;
          var logId = addLog(id, {
            type: logType,
            recordId: recordId,
            values: recordId === 'feeding' ? { feedingStatus: 'ate' } : null,
            note: note || '',
          });
          if (logId) createdIds.push(logId);
          autoCompleteQuestsForRecord_(pet, recordId);
          recordTodayQuestSnapshot_(pet);
        });
        if (!saveState()) throw new Error('persist_failed');
        return { logIds: createdIds, questSnapshots: questSnaps };
      } catch (e) {
        _gs().careLogs = backupLogs;
        restoreQuestProgressSnapshots_(questSnaps);
        try { saveState(); } catch (e2) {}
        throw e;
      }
    }
    function runLowRiskBatchLog_(petIds, recordId, logType, note, doneMsg) {
      if (!petIds || !petIds.length) return;
      try {
        var result = batchLogRecord_(petIds, recordId, logType, note);
        _gs().ui.sheet = null;
        _gs().ui.recordId = null;
        showUndoToast_(doneMsg, {
          kind: 'batch-logs',
          logIds: result.logIds,
          questSnapshots: result.questSnapshots,
        });
      } catch (e) {
        showToast_(t('batchWriteFailed'), 3200);
      }
    }
    function runLowRiskBatchCompleteTasks_(petIds) {
      if (!petIds || !petIds.length) return;
      var questSnaps = snapshotQuestProgressForPets_(petIds);
      var backupPets = cloneJson_(_gs().pets);
      try {
        petIds.forEach(function (id) {
          var petTask = _gs().pets.filter(function (p) { return p.id === id; })[0];
          if (!petTask) return;
          var qpTask = ensureQuestProgress(petTask);
          priorityTasks(petTask).forEach(function (q) {
            if (qpTask.done.indexOf(q) < 0 && qpTask.skipped.indexOf(q) < 0) qpTask.done.push(q);
          });
          recordTodayQuestSnapshot_(petTask);
        });
        if (!saveState()) throw new Error('persist_failed');
        showUndoToast_(t('batchTasksDone').replace('{n}', String(petIds.length)), {
          kind: 'batch-quests',
          questSnapshots: questSnaps,
        });
      } catch (e) {
        _gs().pets = backupPets || _gs().pets;
        try { saveState(); } catch (e2) {}
        showToast_(t('batchWriteFailed'), 3200);
      }
    }
    function runHighRiskBatchDelete_(petIds) {
      if (!petIds || !petIds.length) return;
      if (!confirmBatch_(t('batchConfirmDelete').replace('{n}', String(petIds.length)))) return;
      var idSet = {};
      petIds.forEach(function (id) { idSet[id] = true; });
      var removedPets = _gs().pets.filter(function (p) { return idSet[p.id]; });
      var removedLogs = (_gs().careLogs || []).filter(function (l) { return idSet[l.petId]; });
      var backupPets = _gs().pets.slice();
      var backupLogs = _gs().careLogs.slice();
      try {
        _gs().pets = _gs().pets.filter(function (p) { return !idSet[p.id]; });
        _gs().careLogs = (_gs().careLogs || []).filter(function (l) { return !idSet[l.petId]; });
        _gs().ui.batchSelected = [];
        if (_gs().activePetId && idSet[_gs().activePetId]) {
          _gs().activePetId = null;
          _gs().phase = 'collection';
        }
        if (!saveState()) throw new Error('persist_failed');
        showUndoToast_(t('batchDeleteDone').replace('{n}', String(removedPets.length)), {
          kind: 'batch-delete',
          petsSnapshot: cloneJson_(removedPets),
          logsSnapshot: cloneJson_(removedLogs),
        });
      } catch (e) {
        _gs().pets = backupPets;
        _gs().careLogs = backupLogs;
        try { saveState(); } catch (e2) {}
        showToast_(t('batchWriteFailed'), 3200);
      }
    }
    function confirmBatch_(message) {
      try {
        if (typeof global.confirm === 'function') return !!global.confirm(message);
      } catch (e) {}
      return true;
    }
    function exportBatchCsv_(petIds) {
      var api = DATA_EXPORT();
      if (api && api.exportBatchRecordsCsv) {
        var csv = api.exportBatchRecordsCsv(state, petIds, exportHelpers_());
        downloadText_('batch-husbandry.csv', csv, 'text/csv;charset=utf-8');
        return;
      }
      var rows = [['petName', 'husbandryId', 'date', 'type', 'recordId', 'note']];
      petIds.forEach(function (id) {
        var pet = _gs().pets.filter(function (p) { return p.id === id; })[0];
        if (!pet) return;
        petLogs(id).forEach(function (log) {
          rows.push([
            pet.petName,
            pet.husbandryId || '',
            log.date,
            log.type,
            log.recordId || '',
            (log.note || '').replace(/"/g, '""'),
          ]);
        });
      });
      var csvLegacy = rows.map(function (r) {
        return r.map(function (c) { return '"' + String(c) + '"'; }).join(',');
      }).join('\n');
      downloadText_('batch-husbandry.csv', csvLegacy, 'text/csv;charset=utf-8');
    }
    function batchPrintLabels_(petIds) {
      var tplApi = LABEL_API();
      if (!tplApi) return;
      var sections = petIds.map(function (id) {
        var pet = _gs().pets.filter(function (p) { return p.id === id; })[0];
        if (!pet) return '';
        enrichPet(pet);
        var qrSrc = tplApi.qrImageUrl(labelQrData(pet), 160);
        return (
          '<section style="page-break-after:always;padding:20px;max-width:360px;font-family:sans-serif">' +
          '<h2 style="margin:0 0 4px">' + esc(pet.petName || '') + '</h2>' +
          '<p style="margin:0 0 4px;color:#444">' + esc(speciesDisplayName(pet) || '') + '</p>' +
          '<p style="margin:0 0 8px;font-size:13px">' + esc(t('labelStatusNow')) + ' ' + esc(cardTodayStatus(pet)) + '</p>' +
          '<p style="margin:0 0 12px;font-family:monospace;font-size:12px">' + esc(pet.husbandryId || '') + '</p>' +
          (qrSrc ? '<img src="' + qrSrc + '" width="160" height="160" alt="" />' : '') +
          '<p style="margin-top:12px;font-size:11px;color:#666">' + esc(t('labelQrScanHint')) + '</p></section>'
        );
      }).join('');
      var w = global.open('', '_blank', 'width=520,height=720');
      if (!w) return;
      w.document.write('<html><head><title>' + esc(t('batchPrintLabels')) + '</title></head><body>' + sections + '</body></html>');
      w.document.close();
      w.focus();
      w.print();
    }
    function renderBatchBar_() {
      if (!_gs().ui.batchMode) return '';
      var ids = batchSelectedIds_();
      var n = ids.length;
      return (
        '<div class="hlc-batch-bar" role="toolbar" aria-label="' + esc(t('batchMode')) + '">' +
        '<p class="hlc-batch-bar__count">' + esc(t('batchSelected').replace('{n}', String(n))) + '</p>' +
        '<div class="hlc-batch-bar__actions">' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="batch-select-all">' + esc(t('batchSelectAll')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="batch-clear">' + esc(t('batchClear')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="batch-feed"' + (n ? '' : ' disabled') + '>' + esc(t('batchFeed')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="batch-water"' + (n ? '' : ' disabled') + '>' + esc(t('batchWater')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="batch-clean"' + (n ? '' : ' disabled') + '>' + esc(t('batchClean')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="batch-mist"' + (n ? '' : ' disabled') + '>' + esc(t('batchMist')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="batch-print-labels"' + (n ? '' : ' disabled') + '>' + esc(t('batchPrintLabels')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--sm" data-hl-action="batch-complete-tasks"' + (n ? '' : ' disabled') + '>' + esc(t('batchCompleteTasks')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="batch-export"' + (n ? '' : ' disabled') + '>' + esc(t('batchExport')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm hlc-btn--danger" data-hl-action="batch-delete"' + (n ? '' : ' disabled') + '>' + esc(t('batchDelete')) + '</button>' +
        '</div></div>'
      );
    }

    return {
      batchSelectedIds: batchSelectedIds_,
      toggleBatchSelect: toggleBatchSelect_,
      snapshotQuestProgressForPets: snapshotQuestProgressForPets_,
      restoreQuestProgressSnapshots: restoreQuestProgressSnapshots_,
      batchLogRecord: batchLogRecord_,
      runLowRiskBatchLog: runLowRiskBatchLog_,
      runLowRiskBatchCompleteTasks: runLowRiskBatchCompleteTasks_,
      runHighRiskBatchDelete: runHighRiskBatchDelete_,
      confirmBatch: confirmBatch_,
      exportBatchCsv: exportBatchCsv_,
      batchPrintLabels: batchPrintLabels_,
      renderBatchBar: renderBatchBar_,
    };
  }

  global.MCHusbandryBatch = { create: create };
})(typeof window !== 'undefined' ? window : this);
