/**
 * 標本 Workflow hub — track tabs, guided React mounts, deep links.
 */
(function (global) {
  'use strict';

  var TRACKS = ['herbarium', 'insect', 'fossil', 'field', 'wildlife', 'bird', 'marine', 'microbe'];
  var TRACK_ROOTS = {
    herbarium: 'mcHerbariumWorkflowRoot',
    insect: 'mcInsectWorkflowRoot',
    fossil: 'mcFossilWorkflowRoot',
    field: 'mcFieldWorkflowRoot',
    wildlife: 'mcWildlifeWorkflowRoot',
    bird: 'mcBirdWorkflowRoot',
    marine: 'mcMarineWorkflowRoot',
    microbe: 'mcMicrobeWorkflowRoot',
  };
  var activeTrack = 'herbarium';
  var pendingTrack = null;
  var readyBound = false;
  var bundleHooked = false;

  function $(id) {
    return document.getElementById(id);
  }

  function workflowApiReady() {
    return Boolean(global.MCSpecimenWorkflow && typeof global.MCSpecimenWorkflow.mount === 'function');
  }

  function isHostMounted(track) {
    var el = $(TRACK_ROOTS[track] || TRACK_ROOTS.herbarium);
    return Boolean(el && el.querySelector('[data-hb-track]'));
  }

  function clearHostFallback(track) {
    var el = $(TRACK_ROOTS[track] || TRACK_ROOTS.herbarium);
    if (!el || isHostMounted(track)) return;
    if (el.querySelector('[data-hb-mount-error]')) el.innerHTML = '';
  }

  function clearAllHostFallbacks() {
    TRACKS.forEach(clearHostFallback);
  }

  function t(key, zh, en) {
    if (global.MCI18n && typeof global.MCI18n.t === 'function') return global.MCI18n.t(key);
    if (typeof global.MCt === 'function') {
      var v = global.MCt(key);
      if (v) return v;
    }
    var lang = (global.MC_LOCALE || (global.state && global.state.lang) || 'zh-TW');
    return lang === 'en' ? en : zh;
  }

  function showMountFallback(track) {
    var rootId = TRACK_ROOTS[track] || TRACK_ROOTS.herbarium;
    var el = $(rootId);
    if (!el || isHostMounted(track)) return;
    if (el.querySelector('[data-hb-mount-error]')) return;
    el.innerHTML =
      '<div class="hb-workflow-host-loading" data-hb-mount-error="1">' +
      '<p>' +
      t('swf_workflow_loading', '工作流載入中…', 'Loading workflow…') +
      '</p>' +
      '<p class="hb-workflow-host-loading__hint">' +
      t(
        'swf_workflow_loading_hint',
        '若持續空白，請重新整理頁面（Ctrl+F5）',
        'If the panel stays blank, hard-refresh the page (Ctrl+F5).',
      ) +
      '</p>' +
      '</div>';
  }

  function mountGuidedNow(track) {
    if (TRACKS.indexOf(track) === -1) track = 'herbarium';
    var el = $(TRACK_ROOTS[track]);
    if (!el) return false;

    clearHostFallback(track);

    if (workflowApiReady()) {
      var ok = global.MCSpecimenWorkflow.mount(track);
      if (!ok && !isHostMounted(track)) showMountFallback(track);
      return ok;
    }

    if (track === 'herbarium' && global.MCHerbariumWorkflow && typeof global.MCHerbariumWorkflow.mount === 'function') {
      return global.MCHerbariumWorkflow.mount();
    }

    return false;
  }

  function mountGuided(track) {
    whenWorkflowReady(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          mountGuidedNow(track);
          if (!isHostMounted(track)) {
            global.setTimeout(function () {
              mountGuidedNow(track);
            }, 120);
            global.setTimeout(function () {
              if (!isHostMounted(track)) mountGuidedNow(track);
            }, 400);
          }
        });
      });
    });
  }

  function mountAllGuided() {
    whenWorkflowReady(function () {
      clearAllHostFallbacks();
      if (global.MCSpecimenWorkflow && typeof global.MCSpecimenWorkflow.mountAll === 'function') {
        global.MCSpecimenWorkflow.mountAll();
        return;
      }
      TRACKS.forEach(function (t) {
        mountGuidedNow(t);
      });
    });
  }

  function whenWorkflowReady(fn) {
    if (workflowApiReady()) {
      fn();
      return;
    }

    pendingTrack = pendingTrack || activeTrack;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (workflowApiReady()) {
        clearInterval(timer);
        fn();
      } else if (tries > 240) {
        clearInterval(timer);
        showMountFallback(pendingTrack || activeTrack);
      }
    }, 50);
  }

  function bootstrapMounts() {
    var track = pendingTrack || activeTrack;
    if (!workflowApiReady()) return;
    mountAllGuided();
    mountGuided(track);
  }

  function onWorkflowReadyEvent() {
    bootstrapMounts();
  }

  function hookBundleScript() {
    if (bundleHooked) return;
    bundleHooked = true;

    var bundle = $('mcHerbariumWorkflowBundle');
    if (bundle) {
      bundle.addEventListener('load', function () {
        global.setTimeout(bootstrapMounts, 0);
      });
      bundle.addEventListener('error', function () {
        showMountFallback(activeTrack);
      });
    }

    if (workflowApiReady()) {
      global.setTimeout(bootstrapMounts, 0);
      return;
    }

    var tries = 0;
    var poll = setInterval(function () {
      tries += 1;
      if (workflowApiReady()) {
        clearInterval(poll);
        bootstrapMounts();
      } else if (tries > 240) {
        clearInterval(poll);
      }
    }, 50);
  }

  function bindReadyListener() {
    if (readyBound) return;
    readyBound = true;

    global.document.addEventListener('mc-specimen-workflow:ready', onWorkflowReadyEvent);
    global.document.addEventListener('mc-specimen-workflow:mounted', function () {
      clearHostFallback(activeTrack);
    });

    hookBundleScript();
  }

  function scrollToTrackRoot(track) {
    var root = $(TRACK_ROOTS[track] || TRACK_ROOTS.herbarium);
    if (root) {
      requestAnimationFrame(function () {
        root.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }

  function updatePanelValue(track) {
    var painEl = $('swfPanelPain');
    var gainEl = $('swfPanelGain');
    var painKey = 'swf_track_' + track + '_pain_full';
    var gainKey = 'swf_track_' + track + '_gain';
    if (painEl) {
      painEl.setAttribute('data-i18n', painKey);
      painEl.textContent = t(painKey, painEl.textContent, painEl.textContent);
    }
    if (gainEl) {
      gainEl.setAttribute('data-i18n', gainKey);
      gainEl.textContent = t(gainKey, gainEl.textContent, gainEl.textContent);
    }
  }

  function setTrack(track) {
    if (TRACKS.indexOf(track) === -1) track = 'herbarium';
    activeTrack = track;
    pendingTrack = track;

    updatePanelValue(track);

    document.querySelectorAll('[data-swf-track]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-swf-track') === track);
    });

    document.querySelectorAll('[data-swf-panel]').forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-swf-panel') === track);
    });

    mountGuided(track);
    scrollToTrackRoot(track);
  }

  function bindTrackButtons() {
    document.querySelectorAll('[data-swf-track]').forEach(function (btn) {
      if (btn.dataset.swfBound === '1') return;
      btn.dataset.swfBound = '1';
      btn.addEventListener('click', function () {
        setTrack(btn.getAttribute('data-swf-track') || 'herbarium');
      });
    });

    document.querySelectorAll('[data-swf-open-tool]').forEach(function (btn) {
      if (btn.dataset.swfToolBound === '1') return;
      btn.dataset.swfToolBound = '1';
      btn.addEventListener('click', function () {
        var route = btn.getAttribute('data-swf-open-tool');
        if (!route) return;
        if (global.MCRouter && typeof global.MCRouter.go === 'function') {
          global.MCRouter.go(route);
          return;
        }
        try {
          global.location.hash = '#' + route;
        } catch (e) {}
      });
    });

    var back = $('btnSwfBackHome');
    if (back && back.dataset.swfBackBound !== '1') {
      back.dataset.swfBackBound = '1';
      back.addEventListener('click', function () {
        if (global.MCRouter && typeof global.MCRouter.go === 'function') {
          global.MCRouter.go('/');
          return;
        }
        try {
          global.location.hash = '#/';
        } catch (eH) {}
      });
    }
  }

  function parseTrackFromRoute() {
    try {
      var hash = String(global.location.hash || '');
      if (/\/section\/specimen-workflow\/microbe\b/.test(hash)) return 'microbe';
      if (/\/section\/specimen-workflow\/marine\b/.test(hash)) return 'marine';
      if (/\/section\/specimen-workflow\/bird\b/.test(hash)) return 'bird';
      if (/\/section\/specimen-workflow\/wildlife\b/.test(hash)) return 'wildlife';
      if (/\/section\/specimen-workflow\/insect\b/.test(hash)) return 'insect';
      if (/\/section\/specimen-workflow\/fossil\b/.test(hash)) return 'fossil';
      if (/\/section\/specimen-workflow\/field\b/.test(hash)) return 'field';
      if (/\/section\/specimen-workflow\/herbarium\b/.test(hash)) return 'herbarium';
      if (/\/section\/herbarium-workflow\b/.test(hash)) return 'herbarium';
    } catch (e) {}
    return 'herbarium';
  }

  function activate(opts) {
    opts = opts || {};
    bindTrackButtons();
    bindReadyListener();
    clearAllHostFallbacks();
    var track = opts.track || parseTrackFromRoute();
    setTrack(track);
    bootstrapMounts();
  }

  function init() {
    bindTrackButtons();
    bindReadyListener();
    hookBundleScript();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.MCSpecimenWorkflowPage = {
    activate: activate,
    setTrack: setTrack,
    mountHerbarium: function () {
      mountGuided('herbarium');
    },
    mountGuided: mountGuided,
    mountAllGuided: mountAllGuided,
  };
})(typeof window !== 'undefined' ? window : globalThis);
