/**
 * Husbandry Log — trends (Phase 14 split).
 * Loaded before husbandry-log.js. Host: MCMCHusbandryTrends.create(api).
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
    function BREEDING() {
      try {
        if (typeof api.breeding === 'function') return api.breeding();
        if (api.getBreeding) return api.getBreeding();
      } catch (eBreed) {}
      return null;
    }
    function CARE_GUIDE() {
      try {
        if (typeof api.careGuide === 'function') return api.careGuide();
        if (api.getCareGuide) return api.getCareGuide();
      } catch (eCg) {}
      return null;
    }
    function recordLabel_(id) {
      return api.recordLabel ? api.recordLabel(id) : String(id || '');
    }
    function careGuideCtx_() {
      return api.careGuideCtx ? api.careGuideCtx() : {};
    }
    function breedingCtx_() {
      return api.breedingCtx ? api.breedingCtx() : {};
    }
    function renderCompactHeader(pet) {
      return api.renderCompactHeader ? api.renderCompactHeader(pet) : '';
    }

    function logsInTrendRange_(pet, recordId, dayCount) {
      var span = dayCount || _gs().ui.trendRange || 7;
      var cutoff = Date.now() - span * 86400000;
      return petLogs(pet.id).filter(function (l) {
        if (recordId && l.recordId !== recordId) return false;
        return new Date(l.date).getTime() >= cutoff;
      }).sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
    }
    function summarizeCompletionSeries_(series) {
      var rated = [];
      var activityTotal = 0;
      var estimatedDays = 0;
      var missingDays = 0;
      var overdueTotal = 0;
      var skippedTotal = 0;
      var plannedTotal = 0;
      var completedTotal = 0;
      series.forEach(function (d) {
        activityTotal += d.activityCount || 0;
        if (d.source === 'snapshot' && d.plannedTaskCount > 0 && d.completionRate != null) {
          rated.push(d);
          plannedTotal += d.plannedTaskCount;
          completedTotal += d.completedTaskCount;
          overdueTotal += d.overdueTaskCount || 0;
          skippedTotal += d.skippedTaskCount || 0;
        } else if (d.source === 'estimated' || d.source === 'activity') {
          estimatedDays += 1;
        } else if (d.source === 'missing' || d.source === 'empty-plan') {
          missingDays += 1;
        }
      });
      var avgRate = rated.length
        ? rated.reduce(function (sum, d) { return sum + d.completionRate; }, 0) / rated.length
        : null;
      var mode = 'empty';
      if (rated.length && estimatedDays) mode = 'mixed';
      else if (rated.length) mode = 'precise';
      else if (activityTotal > 0 || estimatedDays) mode = 'activity';
      return {
        mode: mode,
        ratedCount: rated.length,
        avgRate: avgRate,
        avgPct: avgRate == null ? null : Math.round(avgRate * 100),
        activityTotal: activityTotal,
        estimatedDays: estimatedDays,
        missingDays: missingDays,
        overdueTotal: overdueTotal,
        skippedTotal: skippedTotal,
        plannedTotal: plannedTotal,
        completedTotal: completedTotal,
      };
    }
    function trendDayDetailHtml_(d) {
      if (!d) return '';
      var lines = [];
      lines.push('<strong>' + esc(d.dateKey) + '</strong>');
      if (d.source === 'snapshot' && d.plannedTaskCount > 0) {
        lines.push(esc(t('trendMetricCompleted')) + ': ' + esc(String(d.completedTaskCount)) + ' / ' + esc(String(d.plannedTaskCount)));
        lines.push(esc(t('trendMetricRate')) + ': ' + esc(String(Math.round(d.completionRate * 100))) + '%');
        lines.push(esc(t('trendMetricOverdue')) + ': ' + esc(String(d.overdueTaskCount || 0)));
        lines.push(esc(t('trendMetricSkipped')) + ': ' + esc(String(d.skippedTaskCount || 0)));
      } else if (d.source === 'empty-plan') {
        lines.push(esc(t('trendNoPlannedTasks')));
      } else if (d.source === 'activity' || d.source === 'estimated') {
        lines.push(esc(t('trendActivityVolume')) + ': ' + esc(String(d.activityCount || 0)));
        lines.push(esc(t('trendEstimatedBadge')));
      } else {
        lines.push(esc(t('trendMissingDay')));
      }
      lines.push('<button type="button" class="hlc-btn hlc-btn--ghost hlc-trend-day-detail__open" data-hl-trend-open-day="' + esc(d.dateKey) + '">' + esc(t('trendOpenDayTimeline')) + '</button>');
      return '<div class="hlc-trend-day-detail" role="status">' + lines.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div>';
    }
    function renderTrendBarChart_(series, summary) {
      if (!series || !series.length) {
        return '<p class="hlc-empty--inline">' + esc(t('trendChartEmpty')) + '</p>';
      }
      var range = _gs().ui.trendRange || 7;
      var maxActivity = 1;
      series.forEach(function (d) {
        if ((d.activityCount || 0) > maxActivity) maxActivity = d.activityCount;
      });
      var focus = _gs().ui.trendDetailDay || '';
      var bars = series.map(function (d) {
        var selected = focus === d.dateKey;
        var fillClass = 'hlc-trend-day__fill';
        var heightPx = 4;
        var title = d.dateKey;
        var modeAttr = d.source;
        if (d.source === 'snapshot' && d.plannedTaskCount > 0 && d.completionRate != null) {
          heightPx = Math.max(6, Math.round(d.completionRate * 56));
          fillClass += ' hlc-trend-day__fill--rate';
          title = d.dateKey + ' · ' + Math.round(d.completionRate * 100) + '%';
        } else if (d.source === 'activity' || d.source === 'estimated') {
          heightPx = Math.max(6, Math.round(((d.activityCount || 0) / maxActivity) * 40));
          fillClass += ' hlc-trend-day__fill--activity';
          title = d.dateKey + ' · ' + t('trendActivityVolume') + ' ' + (d.activityCount || 0);
        } else if (d.source === 'empty-plan') {
          fillClass += ' hlc-trend-day__fill--empty-plan';
          heightPx = 6;
          title = d.dateKey + ' · ' + t('trendNoPlannedTasks');
        } else {
          fillClass += ' hlc-trend-day__fill--missing';
          heightPx = 4;
          title = d.dateKey + ' · ' + t('trendMissingDay');
        }
        var showLabel = range <= 7 || series.indexOf(d) % Math.ceil(series.length / 7) === 0 || d === series[series.length - 1];
        return (
          '<button type="button" class="hlc-trend-day' + (selected ? ' is-selected' : '') + '" data-hl-trend-day="' + esc(d.dateKey) + '" data-hl-trend-source="' + esc(modeAttr) + '" title="' + esc(title) + '" aria-label="' + esc(title) + '">' +
          '<span class="hlc-trend-day__track"><span class="' + fillClass + '" style="height:' + heightPx + 'px"></span></span>' +
          (showLabel ? '<span class="hlc-trend-day__label">' + esc(d.label) + '</span>' : '<span class="hlc-trend-day__label hlc-trend-day__label--sr">' + esc(d.label) + '</span>') +
          '</button>'
        );
      }).join('');
      var unitLabel = summary && summary.mode === 'precise'
        ? t('trendUnitPercent')
        : (summary && summary.mode === 'activity' ? t('trendUnitActivity') : t('trendUnitMixed'));
      var aria = t('trendChartAria')
        .replace('{days}', String(range))
        .replace('{unit}', unitLabel)
        .replace('{summary}', summary && summary.avgPct != null
          ? (String(summary.avgPct) + '%')
          : (summary ? String(summary.activityTotal) : '0'));
      var selectedDay = null;
      if (focus) {
        series.forEach(function (d) { if (d.dateKey === focus) selectedDay = d; });
      }
      return (
        '<div class="hlc-trend-chart-wrap">' +
        '<div class="hlc-trend-chart-meta">' +
        '<span class="hlc-trend-chart-meta__axis">' + esc(t('trendAxisDate')) + '</span>' +
        '<span class="hlc-trend-chart-meta__unit">' + esc(unitLabel) + '</span></div>' +
        '<div class="hlc-trend-chart" role="img" aria-label="' + esc(aria) + '">' + bars + '</div>' +
        (selectedDay ? trendDayDetailHtml_(selectedDay) : '<p class="hlc-trend-chart-hint">' + esc(t('trendTapHint')) + '</p>') +
        '</div>'
      );
    }
    function humidityReadingSeries_(logs) {
      return (logs || []).map(function (l) {
        var v = parseFloat(l.values && l.values.value);
        if (!(v > 0) || v > 100) return null;
        return { value: v, at: l.date || '' };
      }).filter(Boolean);
    }
    function humidityAnomalyBand_() {
      return { min: 30, max: 90 };
    }
    function renderHumiditySparkCard_(readings) {
      if (!readings.length) {
        return '<p class="hlc-empty--inline">' + esc(t('noDataYet')) + '</p>';
      }
      var values = readings.map(function (r) { return r.value; });
      var min = Math.min.apply(null, values);
      var max = Math.max.apply(null, values);
      var avg = values.reduce(function (s, v) { return s + v; }, 0) / values.length;
      var band = humidityAnomalyBand_();
      var anomalies = readings.filter(function (r) {
        return r.value < band.min || r.value > band.max;
      });
      var last = readings[readings.length - 1];
      var stats =
        '<dl class="hlc-humid-stats">' +
        '<div><dt>' + esc(t('trendHumidMin')) + '</dt><dd>' + esc(String(Math.round(min))) + '%</dd></div>' +
        '<div><dt>' + esc(t('trendHumidMax')) + '</dt><dd>' + esc(String(Math.round(max))) + '%</dd></div>' +
        '<div><dt>' + esc(t('trendHumidAvg')) + '</dt><dd>' + esc(String(Math.round(avg))) + '%</dd></div>' +
        '<div><dt>' + esc(t('trendHumidLastAt')) + '</dt><dd>' + esc(formatRelative(last.at) || last.at || '—') + '</dd></div>' +
        '</dl>';
      var anomalyHint = anomalies.length
        ? '<p class="hlc-humid-anomaly" role="status">' + esc(t('trendHumidAnomaly').replace('{n}', String(anomalies.length)).replace('{min}', String(band.min)).replace('{max}', String(band.max))) + '</p>'
        : '<p class="hlc-humid-anomaly hlc-humid-anomaly--ok">' + esc(t('trendHumidAnomalyOk').replace('{min}', String(band.min)).replace('{max}', String(band.max))) + '</p>';
      var chart = '';
      if (readings.length < 3) {
        chart = '<p class="hlc-empty--inline">' + esc(t('trendHumidInsufficient')) + '</p>';
      } else {
        chart = trendSparkline_(values, 160, 36);
      }
      return stats + chart + anomalyHint;
    }
    function trendRangeLabel_(values, unit) {
      if (!values.length) return '';
      var min = Math.min.apply(null, values);
      var max = Math.max.apply(null, values);
      unit = unit || '';
      if (min === max) return String(min) + unit;
      return String(min) + unit + ' – ' + String(max) + unit;
    }
    function renderTrendFeedRows_(stats) {
      var total = stats.ate + stats.ate_less + stats.refuse;
      if (!total) {
        return '<p class="hlc-empty--inline">' + esc(t('noDataYet')) + '</p>';
      }
      var rows = [
        { key: 'ate', label: t('trendFeedAte'), tone: 'ok' },
        { key: 'ate_less', label: t('trendFeedAteLess'), tone: 'watch' },
        { key: 'refuse', label: t('trendFeedRefused'), tone: 'danger' },
      ];
      return rows.map(function (row) {
        var count = stats[row.key] || 0;
        var pct = Math.round((count / total) * 100);
        return (
          '<div class="hlc-trend-feed-row">' +
          '<span class="hlc-trend-feed-row__label">' + esc(row.label) + '</span>' +
          '<div class="hlc-trend-bar hlc-trend-bar--inline"><span class="hlc-trend-bar__fill hlc-trend-bar__fill--' + row.tone + '" style="width:' + pct + '%"></span></div>' +
          '<span class="hlc-trend-feed-row__count">' + esc(String(count)) + '</span></div>'
        );
      }).join('');
    }
    function trendSparkline_(values, width, height) {
      if (!values || values.length < 3) return '';
      var min = Math.min.apply(null, values);
      var max = Math.max.apply(null, values);
      var range = max - min || 1;
      var pts = values.map(function (v, i) {
        var x = (i / Math.max(values.length - 1, 1)) * width;
        var y = height - ((v - min) / range) * height;
        return x.toFixed(1) + ',' + y.toFixed(1);
      }).join(' ');
      return '<svg class="hlc-spark" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="currentColor" stroke-width="2" points="' + pts + '"/></svg>';
    }
    function renderTrendRangeChips_() {
      var cur = _gs().ui.trendRange || 7;
      var opts = [
        { id: 7, key: 'trendRange7d' },
        { id: 30, key: 'trendRange30d' },
        { id: 90, key: 'trendRange90d' },
      ];
      return (
        '<div class="hlc-trend-range" role="group" aria-label="' + esc(t('trendRangeLabel')) + '">' +
        opts.map(function (o) {
          return '<button type="button" class="hlc-pet-toolbar__chip' + (cur === o.id ? ' is-active' : '') + '" data-hl-trend-range="' + o.id + '" aria-pressed="' + (cur === o.id ? 'true' : 'false') + '">' + esc(t(o.key)) + '</button>';
        }).join('') + '</div>'
      );
    }
    function completionSummaryCaption_(summary, range) {
      if (!summary || summary.mode === 'empty') {
        return t('trendSummaryEmpty');
      }
      if (summary.mode === 'precise') {
        return t('trendSummaryPrecise')
          .replace('{pct}', String(summary.avgPct))
          .replace('{days}', String(summary.ratedCount))
          .replace('{range}', String(range));
      }
      if (summary.mode === 'mixed') {
        return t('trendSummaryMixed')
          .replace('{pct}', String(summary.avgPct))
          .replace('{days}', String(summary.ratedCount))
          .replace('{activity}', String(summary.activityTotal));
      }
      return t('trendSummaryActivity')
        .replace('{count}', String(summary.activityTotal))
        .replace('{range}', String(range));
    }
    function renderBoardTrendsBody_(pet) {
      var logs = petLogs(pet.id);
      var range = _gs().ui.trendRange || 7;
      var weightLogs = logsInTrendRange_(pet, 'weight', range);
      var weights = weightLogs.map(function (l) {
        return parseFloat(l.values && l.values.value) || parseFloat(l.note) || 0;
      }).filter(function (n) { return n > 0; });
      var tempLogs = logsInTrendRange_(pet, null, range).filter(function (l) {
        return l.recordId === 'temperature' || l.recordId === 'water_temp';
      });
      var temps = tempLogs.map(function (l) {
        return parseFloat(l.values && l.values.value) || 0;
      }).filter(function (n) { return n > 0; });
      var humidLogs = logsInTrendRange_(pet, 'humidity', range);
      var humidReadings = humidityReadingSeries_(humidLogs);
      var feedStats = { ate: 0, ate_less: 0, refuse: 0 };
      logsInTrendRange_(pet, null, range).filter(function (l) { return l.type === 'feeding'; }).forEach(function (l) {
        var st = l.values && l.values.feedingStatus;
        if (st === 'refused' || st === 'vomit') feedStats.refuse += 1;
        else if (st === 'ate_less') feedStats.ate_less += 1;
        else feedStats.ate += 1;
      });
      var abn = logsInTrendRange_(pet, null, range).filter(function (l) { return l.type === 'abnormality'; }).length;
      var series = buildDailyCompletionSeries_(pet, range);
      var summary = summarizeCompletionSeries_(series);
      var titleKey = summary.mode === 'activity' ? 'trendActivityTitle' : 'trendCompletion';
      var badge = summary.mode === 'precise'
        ? ''
        : (summary.mode === 'mixed'
          ? '<span class="hlc-trend-badge">' + esc(t('trendMixedBadge')) + '</span>'
          : '<span class="hlc-trend-badge">' + esc(t('trendEstimatedBadge')) + '</span>');
      var tempRange = trendRangeLabel_(temps, '°C');
      var trendEmpty = logs.length < 3 && !series.some(function (d) { return d.source === 'snapshot'; });
      if (trendEmpty) {
        return (
          '<div class="hlc-trends-empty hlc-trends-empty--full" role="status">' +
          '<p class="hlc-trends-empty__lead">' + esc(t('trendsEmptyLead')) + '</p></div>'
        );
      }
      return (
        renderTrendRangeChips_() +
        '<div class="hlc-trends-grid">' +
        '<article class="hlc-trend-card hlc-trend-card--wide">' +
        '<h3>' + esc(t(titleKey)) + ' ' + badge + '</h3>' +
        renderTrendBarChart_(series, summary) +
        '<span class="hlc-trend-caption">' + esc(completionSummaryCaption_(summary, range)) + '</span></article>' +
        '<article class="hlc-trend-card"><h3>' + esc(t('trendWeight')) + '</h3>' +
        (weights.length >= 3
          ? trendSparkline_(weights, 120, 40) + '<span class="hlc-trend-caption">' + esc(trendRangeLabel_(weights, 'g')) + '</span>'
          : (weights.length
            ? '<span class="hlc-trend-caption">' + esc(trendRangeLabel_(weights, 'g')) + ' · ' + esc(t('trendSparkInsufficient')) + '</span>'
            : '<p class="hlc-empty--inline">' + esc(t('noDataYet')) + '</p>')) +
        '</article>' +
        '<article class="hlc-trend-card"><h3>' + esc(t('trendHumidity')) + '</h3>' +
        renderHumiditySparkCard_(humidReadings) +
        '</article>' +
        '<article class="hlc-trend-card"><h3>' + esc(t('trendTemp')) + '</h3>' +
        (temps.length >= 3
          ? trendSparkline_(temps, 120, 32) + '<span class="hlc-trend-caption">' + esc(tempRange) + '</span>'
          : (tempRange
            ? '<span class="hlc-trend-caption">' + esc(tempRange) + (temps.length < 3 ? ' · ' + esc(t('trendSparkInsufficient')) : '') + '</span>'
            : '<p class="hlc-empty--inline">' + esc(t('noDataYet')) + '</p>')) +
        '</article>' +
        '<article class="hlc-trend-card hlc-trend-card--wide"><h3>' + esc(t('trendFeedingReaction')) + '</h3>' +
        renderTrendFeedRows_(feedStats) +
        '</article>' +
        '<article class="hlc-trend-card"><h3>' + esc(t('trendAbnormal')) + '</h3>' +
        '<p class="hlc-trend-stat">' + esc(String(abn)) + '</p>' +
        '<span class="hlc-trend-caption">' + esc(t('trendAbnormalCaption')) + '</span></article>' +
        '<article class="hlc-trend-card hlc-trend-card--wide"><h3>' + esc(t('trendMolting')) + '</h3>' +
        renderTrendMilestoneTimeline_(pet) +
        '</article>' +
        (BREEDING() ? BREEDING().renderTrends(_gs(), pet, breedingCtx_()) : '') +
        (CARE_GUIDE() ? CARE_GUIDE().renderTrendsLearning(_gs(), pet, careGuideCtx_()) : '') +
        '</div>'
      );
    }
    function renderBoardTrends(pet) {
      return (
        renderCompactHeader(pet) +
        '<div id="hlcTrendsPanel" class="hlc-trends-panel">' +
        renderBoardTrendsBody_(pet) +
        '</div>'
      );
    }
    function refreshTrendsPanel_() {
      var panel = global.document.getElementById('hlcTrendsPanel');
      var pet = getActivePet();
      if (!panel || !pet || _gs().boardTab !== 'trends' || _gs().phase !== 'board') {
        render();
        return false;
      }
      panel.innerHTML = renderBoardTrendsBody_(pet);
      return true;
    }
    function renderTrendMilestoneTimeline_(pet) {
      var logs = petLogs(pet.id);
      var milestoneIds = ['molt', 'pupation', 'instar', 'shedding', 'premolt', 'egg_laying'];
      var items = logs.filter(function (l) {
        return milestoneIds.indexOf(l.recordId) >= 0 || milestoneIds.indexOf(l.type) >= 0;
      }).slice(0, 8).map(function (l) {
        return {
          date: String(l.date || '').slice(0, 10),
          label: l.recordType || recordLabel_(l.recordId || l.type),
        };
      });
      if (BREEDING()) {
        BREEDING().ensureState(_gs());
        _gs().breedingEvents.forEach(function (e) {
          var involves = e.petId === pet.id;
          if (!involves && e.pairId) {
            var pair = _gs().breedingPairs.filter(function (p) { return p.id === e.pairId; })[0];
            involves = !!(pair && (pair.malePetId === pet.id || pair.femalePetId === pet.id));
          }
          if (!involves) return;
          if (['egg_laying', 'birth', 'hatching', 'emergence', 'pupa', 'larva_found'].indexOf(e.type) < 0) return;
          var evKey = 'breedEvent_' + e.type;
          items.push({
            date: String(e.date || '').slice(0, 10),
            label: t(evKey) !== evKey ? t(evKey) : e.type,
          });
        });
      }
      items.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      items = items.slice(0, 8);
      if (!items.length) {
        return '<p class="hlc-empty--inline">' + esc(t('noDataYet')) + '</p>';
      }
      return (
        '<ol class="hlc-trend-milestones">' + items.map(function (it) {
          return (
            '<li class="hlc-trend-milestone">' +
            '<time datetime="' + esc(it.date) + '">' + esc(it.date.replace(/-/g, '/')) + '</time>' +
            '<span>' + esc(it.label) + '</span></li>'
          );
        }).join('') + '</ol>'
      );
    }

    return {
      logsInTrendRange: logsInTrendRange_,
      summarizeCompletionSeries: summarizeCompletionSeries_,
      trendDayDetailHtml: trendDayDetailHtml_,
      renderTrendBarChart: renderTrendBarChart_,
      humidityReadingSeries: humidityReadingSeries_,
      humidityAnomalyBand: humidityAnomalyBand_,
      renderHumiditySparkCard: renderHumiditySparkCard_,
      trendRangeLabel: trendRangeLabel_,
      renderTrendFeedRows: renderTrendFeedRows_,
      trendSparkline: trendSparkline_,
      renderTrendRangeChips: renderTrendRangeChips_,
      completionSummaryCaption: completionSummaryCaption_,
      renderBoardTrendsBody: renderBoardTrendsBody_,
      renderBoardTrends: renderBoardTrends,
      refreshTrendsPanel: refreshTrendsPanel_,
      renderTrendMilestoneTimeline: renderTrendMilestoneTimeline_,
    };
  }

  global.MCHusbandryTrends = { create: create };
})(typeof window !== 'undefined' ? window : this);
