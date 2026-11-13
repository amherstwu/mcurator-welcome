/**
 * Husbandry Log — Phase 7 health follow-up closed loop.
 * Local scheduling + optional Notification API (never claims reliable background push).
 */
(function (global) {
  'use strict';

  var OPEN = { pending: 1, viewed: 1, deferred: 1, observing: 1 };

  function create(api) {
    function state() { return api.getState(); }
    function t(k) { return api.t(k); }
    function esc(s) { return api.esc(s); }
    function todayKey() { return api.todayKey(); }

    function localActorLabel() {
      try {
        var stored = global.localStorage.getItem('mc_hl_local_actor');
        if (stored && String(stored).trim()) return String(stored).trim();
      } catch (e) {}
      return t('healthHandleLocalUser');
    }

    function statusOf(log) {
      var v = (log && log.values) || {};
      if (v.followUpStatus) return String(v.followUpStatus);
      if (v.reminderResolved) return 'closed';
      if (v.reminder) return 'pending';
      return 'closed';
    }

    function isOpen(log) {
      return !!OPEN[statusOf(log)];
    }

    function statusLabel(status) {
      var key = 'healthStatus_' + status;
      var label = t(key);
      return label === key ? status : label;
    }

    function migrate() {
      var st = state();
      (st.careLogs || []).forEach(function (log) {
        if (!log || log.type !== 'abnormality') return;
        if (!log.values || typeof log.values !== 'object') log.values = {};
        var v = log.values;
        if (!v.followUpStatus) {
          if (v.reminderResolved) v.followUpStatus = 'closed';
          else if (v.reminder) v.followUpStatus = 'pending';
          else v.followUpStatus = 'closed';
        }
        if (v.reminder && !v.followUpDate && log.date) {
          var d = new Date(log.date);
          if (!isNaN(d.getTime())) {
            d.setDate(d.getDate() + 7);
            v.followUpDate = d.toISOString().slice(0, 10);
          }
        }
        if (!v.discoveredAt && log.date) v.discoveredAt = String(log.date).slice(0, 10);
      });
    }

    function dueDate(log) {
      var v = (log && log.values) || {};
      if (v.followUpDate) return String(v.followUpDate).slice(0, 10);
      if (log && log.date) {
        var d = new Date(log.date);
        if (!isNaN(d.getTime())) {
          d.setDate(d.getDate() + 7);
          return d.toISOString().slice(0, 10);
        }
      }
      return todayKey();
    }

    function isDue(log, today) {
      if (!isOpen(log)) return false;
      return dueDate(log) <= (today || todayKey());
    }

    function pending() {
      migrate();
      var st = state();
      var today = todayKey();
      var items = [];
      (st.careLogs || []).forEach(function (log) {
        if (!log || log.type !== 'abnormality') return;
        if (!isOpen(log)) return;
        var stt = statusOf(log);
        if ((stt === 'deferred' || stt === 'observing') && !isDue(log, today)) return;
        var pet = (st.pets || []).filter(function (p) { return p.id === log.petId; })[0];
        if (!pet) return;
        items.push({
          pet: pet,
          log: log,
          status: stt,
          dueDate: dueDate(log),
          severity: parseInt((log.values && log.values.severity) || '3', 10) || 3,
        });
      });
      items.sort(function (a, b) {
        if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
        return b.severity - a.severity;
      });
      return items.slice(0, 12);
    }

    function sysSupport() {
      if (typeof global.Notification !== 'function') return 'unsupported';
      try { return global.Notification.permission || 'default'; }
      catch (e) { return 'unsupported'; }
    }

    function sysPref() {
      try { return global.localStorage.getItem('mc_hl_sys_notif_pref') || 'unset'; }
      catch (e) { return 'unset'; }
    }

    function setSysPref(v) {
      try { global.localStorage.setItem('mc_hl_sys_notif_pref', v); } catch (e) {}
    }

    function maybeNotify(force) {
      if (sysSupport() !== 'granted') return;
      if (sysPref() !== 'granted' && !force) return;
      var due = pending().filter(function (it) { return isDue(it.log); });
      if (!due.length) return;
      try {
        var n = new global.Notification(t('healthNotifTitle'), {
          body: t('healthNotifBody').replace('{n}', String(due.length)),
          tag: 'mc-hl-health-due',
          renotify: false,
        });
        if (n && typeof n.close === 'function') {
          global.setTimeout(function () { try { n.close(); } catch (e2) {} }, 8000);
        }
      } catch (e) {}
    }

    function requestPermissionOnce() {
      var support = sysSupport();
      if (support === 'unsupported') {
        setSysPref('unsupported');
        api.showToast(t('healthNotifUnsupported'), 2800);
        return;
      }
      if (support === 'granted') {
        setSysPref('granted');
        maybeNotify(true);
        api.showToast(t('healthNotifGranted'), 2200);
        api.render();
        return;
      }
      if (support === 'denied') {
        setSysPref('denied');
        api.showToast(t('healthNotifDenied'), 2800);
        api.render();
        return;
      }
      if (typeof global.Notification.requestPermission !== 'function') {
        setSysPref('unsupported');
        api.showToast(t('healthNotifUnsupported'), 2800);
        return;
      }
      global.Notification.requestPermission().then(function (perm) {
        if (perm === 'granted') {
          setSysPref('granted');
          maybeNotify(true);
          api.showToast(t('healthNotifGranted'), 2200);
        } else {
          setSysPref('denied');
          api.showToast(t('healthNotifDenied'), 2800);
        }
        api.render();
      }).catch(function () {
        setSysPref('denied');
        api.showToast(t('healthNotifDenied'), 2800);
      });
    }

    function markViewed(logId) {
      var st = state();
      var log = (st.careLogs || []).filter(function (l) { return l.id === logId; })[0];
      if (!log) return;
      if (!log.values) log.values = {};
      if (statusOf(log) === 'pending') {
        log.values.followUpStatus = 'viewed';
        api.saveState();
      }
    }

    function openHandle(logId) {
      var st = state();
      var log = (st.careLogs || []).filter(function (l) { return l.id === logId; })[0];
      if (!log) return;
      markViewed(logId);
      st.activePetId = log.petId;
      st.ui.healthHandleLogId = logId;
      st.ui.healthHandleResult = (log.values && log.values.handleResult) || '';
      st.ui.healthHandleNext = false;
      st.ui.healthHandleNextDate = '';
      st.ui.sheet = 'health-handle';
      st.ui.recordId = null;
      api.saveState();
      api.render();
    }

    function applyStatus(logId, status, extra) {
      extra = extra || {};
      var st = state();
      var log = (st.careLogs || []).filter(function (l) { return l.id === logId; })[0];
      if (!log) return false;
      if (!log.values) log.values = {};
      var v = log.values;
      if (extra.result != null) v.handleResult = extra.result;
      if (extra.handledAt) v.handledAt = extra.handledAt;
      if (extra.handledBy) v.handledBy = extra.handledBy;
      if (status === 'deferred' || status === 'observing' || status === 'pending' || status === 'viewed') {
        v.followUpStatus = status;
        v.reminder = true;
        v.reminderResolved = false;
        if (extra.followUpDate) v.followUpDate = extra.followUpDate;
        return true;
      }
      if (status === 'handled' || status === 'closed') {
        if (extra.followUpDate) {
          v.followUpStatus = 'observing';
          v.followUpDate = extra.followUpDate;
          v.reminder = true;
          v.reminderResolved = false;
        } else {
          v.followUpStatus = 'closed';
          v.reminder = false;
          v.reminderResolved = true;
        }
        return true;
      }
      v.followUpStatus = status;
      return true;
    }

    function commitHandled() {
      var st = state();
      var logId = st.ui.healthHandleLogId;
      if (!logId) return;
      var result = st.ui.healthHandleResult || '';
      var nextDate = st.ui.healthHandleNext ? (st.ui.healthHandleNextDate || '') : '';
      var log = (st.careLogs || []).filter(function (l) { return l.id === logId; })[0];
      if (!log) return;
      applyStatus(logId, 'handled', {
        result: result,
        handledAt: new Date().toISOString(),
        handledBy: localActorLabel(),
        followUpDate: nextDate || null,
      });
      api.addLog(log.petId, {
        type: 'note',
        recordId: 'note',
        recordType: t('healthHandleTimelineTitle'),
        values: { choice: 'followup', linkedAbnormalityId: logId, handleResult: result },
        note: t('healthHandleTimelineNote')
          .replace('{status}', statusLabel(nextDate ? 'observing' : 'closed'))
          .replace('{result}', result || t('healthHandleResultEmpty')),
      });
      st.ui.sheet = null;
      st.ui.healthHandleLogId = '';
      if (!api.saveState()) {
        api.showToast(t('batchWriteFailed'), 3200);
        return;
      }
      api.showToast(t('healthHandleDone'), 2200);
    }

    function defer(logId, days) {
      days = parseInt(days, 10) || 3;
      var d = new Date();
      d.setDate(d.getDate() + days);
      var dateStr = d.toISOString().slice(0, 10);
      if (!applyStatus(logId, 'deferred', { followUpDate: dateStr })) return;
      api.saveState();
      api.showToast(t('healthDeferDone').replace('{date}', dateStr), 2200);
    }

    function observe(logId) {
      var st = state();
      var log = (st.careLogs || []).filter(function (l) { return l.id === logId; })[0];
      if (!log) return;
      var dateStr = dueDate(log);
      if (dateStr < todayKey()) {
        var d = new Date();
        d.setDate(d.getDate() + 3);
        dateStr = d.toISOString().slice(0, 10);
      }
      applyStatus(logId, 'observing', { followUpDate: dateStr });
      api.saveState();
      api.showToast(t('healthObserveDone'), 2200);
    }

    function closeCase(logId) {
      if (!applyStatus(logId, 'closed')) return;
      var st = state();
      var log = (st.careLogs || []).filter(function (l) { return l.id === logId; })[0];
      if (log && log.values) {
        log.values.handledAt = log.values.handledAt || new Date().toISOString();
        log.values.handledBy = log.values.handledBy || localActorLabel();
      }
      api.saveState();
      api.showToast(t('healthCloseDone'), 2200);
    }

    function renderStrip() {
      var items = pending();
      if (!items.length) return '';
      return (
        '<aside class="hlc-health-reminders" role="status">' +
        '<div class="hlc-health-reminders__head">' +
        '<h3 class="hlc-health-reminders__title">' + esc(t('healthRemindersTitle')) + '</h3>' +
        '<span class="hlc-health-reminders__badge">' + esc(t('healthNotifInApp')) + '</span></div>' +
        '<ul class="hlc-health-reminders__list">' + items.map(function (it) {
          var meta = statusLabel(it.status) + ' · ' + it.dueDate;
          return (
            '<li class="hlc-health-reminder__row">' +
            '<button type="button" class="hlc-health-reminder__item" data-hl-action="health-followup-open" data-hl-log-id="' + esc(it.log.id) + '">' +
            '<span class="hlc-health-reminder__pet">' + esc(it.pet.petName) + '</span>' +
            '<span class="hlc-health-reminder__meta">' + esc(meta) + '</span></button>' +
            '<div class="hlc-health-reminder__actions">' +
            '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--xs" data-hl-action="health-followup-handle" data-hl-log-id="' + esc(it.log.id) + '">' +
            esc(t('healthMarkHandled')) + '</button>' +
            '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--xs" data-hl-action="health-followup-defer" data-hl-log-id="' + esc(it.log.id) + '" data-hl-defer-days="3">' +
            esc(t('healthDefer')) + '</button>' +
            '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--xs" data-hl-action="health-followup-observe" data-hl-log-id="' + esc(it.log.id) + '">' +
            esc(t('healthObserve')) + '</button>' +
            '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--xs" data-hl-action="health-followup-close" data-hl-log-id="' + esc(it.log.id) + '">' +
            esc(t('healthClose')) + '</button></div></li>'
          );
        }).join('') + '</ul></aside>'
      );
    }

    function renderHandleSheet() {
      var st = state();
      var logId = st.ui.healthHandleLogId;
      var log = (st.careLogs || []).filter(function (l) { return l.id === logId; })[0];
      if (!log) return '';
      var pet = (st.pets || []).filter(function (p) { return p.id === log.petId; })[0];
      return (
        '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
        '<div class="hlc-sheet hlc-sheet--health-handle" role="dialog" aria-modal="true">' +
        '<div class="hlc-sheet__handle"></div>' +
        '<h2 class="hlc-sheet__title">' + esc(t('healthMarkHandled')) + '</h2>' +
        '<p class="hlc-sheet__hint">' + esc((pet && pet.petName) || '') + ' · ' + esc(statusLabel(statusOf(log))) + '</p>' +
        '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('healthHandleResultLabel')) + '</span>' +
        '<textarea class="hlc-sheet-textarea" rows="3" data-hl-field="healthHandleResult" placeholder="' + esc(t('healthHandleResultPlaceholder')) + '">' +
        esc(st.ui.healthHandleResult || '') + '</textarea></label>' +
        '<p class="hlc-sheet__meta">' + esc(t('healthHandleActor').replace('{name}', localActorLabel())) + '</p>' +
        '<label class="hlc-sheet-check"><input type="checkbox"' + (st.ui.healthHandleNext ? ' checked' : '') + ' data-hl-field="healthHandleNext" /> ' +
        esc(t('healthHandleScheduleNext')) + '</label>' +
        (st.ui.healthHandleNext
          ? (
            '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('healthFollowUpDateLabel')) + '</span>' +
            '<input type="date" class="hlc-sheet-input" value="' + esc(st.ui.healthHandleNextDate || '') + '" data-hl-field="healthHandleNextDate" /></label>'
          )
          : '') +
        '<div class="hlc-sheet__actions">' +
        '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="close-sheet">' + esc(t('cancel')) + '</button>' +
        '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="health-followup-commit">' + esc(t('healthMarkHandled')) + '</button>' +
        '</div></div></div>'
      );
    }

    function renderNotifBlock() {
      var support = sysSupport();
      var pref = sysPref();
      var line;
      if (support === 'unsupported' || pref === 'unsupported') line = t('healthNotifUnsupported');
      else if (support === 'granted' || pref === 'granted') line = t('healthNotifSystemOn');
      else if (support === 'denied' || pref === 'denied') line = t('healthNotifPermissionOff');
      else line = t('healthNotifPermissionOff');
      var canAsk = support === 'default' || (support !== 'unsupported' && support !== 'granted' && support !== 'denied' && pref === 'unset');
      return (
        '<div class="hlc-health-notif">' +
        '<h3 class="hlc-health-notif__title">' + esc(t('healthNotifSettingsTitle')) + '</h3>' +
        '<ul class="hlc-health-notif__list">' +
        '<li><strong>' + esc(t('healthNotifInApp')) + '</strong> — ' + esc(t('healthNotifInAppHint')) + '</li>' +
        '<li><strong>' + esc(t('healthNotifSystem')) + '</strong> — ' + esc(t('healthNotifSystemHint')) + '</li>' +
        '<li>' + esc(line) + '</li></ul>' +
        (canAsk
          ? '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="health-notif-enable">' + esc(t('healthNotifEnable')) + '</button>'
          : '') +
        '<p class="hlc-health-notif__note">' + esc(t('healthNotifNoBackgroundClaim')) + '</p></div>'
      );
    }

    function onBoot() {
      migrate();
      maybeNotify(false);
    }

    return {
      pending: pending,
      migrate: migrate,
      markViewed: markViewed,
      openHandle: openHandle,
      commitHandled: commitHandled,
      defer: defer,
      observe: observe,
      close: closeCase,
      renderStrip: renderStrip,
      renderHandleSheet: renderHandleSheet,
      renderNotifBlock: renderNotifBlock,
      requestPermissionOnce: requestPermissionOnce,
      onBoot: onBoot,
      statusOf: statusOf,
      statusLabel: statusLabel,
      dueDate: dueDate,
      localActorLabel: localActorLabel,
    };
  }

  global.MCHusbandryHealthFollowUp = { create: create };
})(typeof window !== 'undefined' ? window : this);
