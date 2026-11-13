/**
 * Husbandry Log — PWA registration, online/offline hooks, write ledger, SW update prompt.
 */
(function (global) {
  'use strict';

  var QUEUE_KEY = 'mc_hl_offline_queue_v1';
  var listeners = [];
  var updateBannerEl = null;

  function assetVer_() {
    return global.MCHusbandryAssetVersion || null;
  }

  function versionTag_() {
    var api = assetVer_();
    return api && api.VERSION ? api.VERSION : 'hl-dev';
  }

  function withV_(path) {
    var api = assetVer_();
    if (api && typeof api.withVersion === 'function') return api.withVersion(path);
    return path + (path.indexOf('?') >= 0 ? '&' : '?') + 'v=' + versionTag_();
  }

  function isOnline() {
    return typeof navigator === 'undefined' ? true : navigator.onLine !== false;
  }

  function notifyListeners() {
    listeners.forEach(function (fn) {
      try { fn(isOnline()); } catch (e) {}
    });
  }

  function onStatusChange() {
    if (isOnline()) flushQueue_();
    notifyListeners();
  }

  function subscribe(fn) {
    if (typeof fn === 'function') listeners.push(fn);
    return function () {
      listeners = listeners.filter(function (f) { return f !== fn; });
    };
  }

  function readQueue_() {
    try {
      var raw = global.localStorage.getItem(QUEUE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeQueue_(items) {
    try {
      global.localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-100)));
    } catch (e) {}
  }

  function recordLocalSave(meta) {
    var online = meta && typeof meta.online === 'boolean' ? meta.online : isOnline();
    if (online) return;
    var q = readQueue_();
    q.push({
      type: 'local_save',
      at: (meta && meta.at) || new Date().toISOString(),
      pending: true,
    });
    writeQueue_(q);
  }

  function flushQueue_() {
    var q = readQueue_();
    if (!q.length) return { flushed: 0 };
    var flushed = q.length;
    writeQueue_([]);
    return { flushed: flushed, localDurable: true };
  }

  function pendingCount() {
    return readQueue_().length;
  }

  function t_(key, fallback) {
    try {
      if (global.MCHusbandryLogI18n) {
        var lang = (global.localStorage && global.localStorage.getItem('MC_USER_LANG')) || 'zh-TW';
        var pack = global.MCHusbandryLogI18n.zhTW;
        if (lang.indexOf('ja') === 0) pack = global.MCHusbandryLogI18n.ja || pack;
        else if (lang.indexOf('de') === 0) pack = global.MCHusbandryLogI18n.de || pack;
        else if (lang.indexOf('en') === 0) pack = global.MCHusbandryLogI18n.en || pack;
        if (pack && pack[key]) return pack[key];
      }
    } catch (e) {}
    return fallback;
  }

  function hideUpdateBanner_() {
    if (updateBannerEl && updateBannerEl.parentNode) {
      updateBannerEl.parentNode.removeChild(updateBannerEl);
    }
    updateBannerEl = null;
  }

  function showUpdateBanner_(registration) {
    if (updateBannerEl || !global.document || !global.document.body) return;
    var bar = global.document.createElement('div');
    bar.id = 'hlcSwUpdateBanner';
    bar.setAttribute('role', 'status');
    bar.style.cssText = [
      'position:fixed', 'z-index:99999', 'left:12px', 'right:12px', 'bottom:12px',
      'padding:12px 14px', 'border-radius:12px', 'background:#0f766e', 'color:#fff',
      'display:flex', 'gap:10px', 'align-items:center', 'justify-content:space-between',
      'box-shadow:0 8px 24px rgba(0,0,0,.28)', 'font:14px/1.4 system-ui,sans-serif',
    ].join(';');
    var msg = global.document.createElement('span');
    msg.textContent = t_('swUpdateAvailable', 'A newer Husbandry Log is ready.');
    var btn = global.document.createElement('button');
    btn.type = 'button';
    btn.textContent = t_('swReloadNow', 'Reload');
    btn.style.cssText = 'border:0;border-radius:8px;padding:8px 12px;background:#fff;color:#0f766e;font-weight:600;cursor:pointer';
    btn.addEventListener('click', function () {
      hideUpdateBanner_();
      var waiting = registration && registration.waiting;
      if (waiting) {
        waiting.postMessage({ type: 'HUSBANDRY_SKIP_WAITING' });
      }
      global.setTimeout(function () {
        global.location.reload();
      }, 120);
    });
    var dismiss = global.document.createElement('button');
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', t_('cancel', 'Cancel'));
    dismiss.textContent = '×';
    dismiss.style.cssText = 'border:0;background:transparent;color:#fff;font-size:20px;cursor:pointer;line-height:1';
    dismiss.addEventListener('click', hideUpdateBanner_);
    bar.appendChild(msg);
    bar.appendChild(btn);
    bar.appendChild(dismiss);
    global.document.body.appendChild(bar);
    updateBannerEl = bar;
  }

  function watchRegistration_(registration) {
    if (!registration) return;
    if (registration.waiting) showUpdateBanner_(registration);
    registration.addEventListener('updatefound', function () {
      var installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', function () {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateBanner_(registration);
        }
      });
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    var swUrl = withV_('./husbandry-sw.js');
    navigator.serviceWorker.register(swUrl, { scope: './' }).then(function (reg) {
      watchRegistration_(reg);
      try {
        reg.update();
      } catch (e) {}
    }).catch(function () {});

    navigator.serviceWorker.addEventListener('controllerchange', function () {
      /* New SW took control — one reload if user already confirmed, else soft banner next visit. */
    });

    navigator.serviceWorker.addEventListener('message', function (ev) {
      var data = ev.data || {};
      if (data.type === 'HUSBANDRY_SW_ACTIVATED' && navigator.serviceWorker.controller) {
        /* Activated after skipWaiting; page may still hold old scripts until reload. */
        if (!updateBannerEl) {
          showUpdateBanner_({ waiting: null });
        }
      }
    });
  }

  function init() {
    if (global.__mcHusbandryOfflineInit) return;
    global.__mcHusbandryOfflineInit = true;
    registerServiceWorker();
    global.addEventListener('online', onStatusChange);
    global.addEventListener('offline', onStatusChange);
    if (isOnline()) flushQueue_();
  }

  global.MCHusbandryOffline = {
    init: init,
    isOnline: isOnline,
    subscribe: subscribe,
    recordLocalSave: recordLocalSave,
    flushQueue: flushQueue_,
    pendingCount: pendingCount,
    assetVersion: versionTag_,
  };
})(typeof window !== 'undefined' ? window : global);
