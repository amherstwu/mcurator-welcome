/**
 * MCurator local preview shell guard — runs before the main UI bundle.
 * Prevents black screen when mc-entered hides welcome but the app shell is empty,
 * and when public marketing routes (#/section/specimen-workflow, etc.) load with a stale session.
 */
(function (global) {
  'use strict';

  var BOOT_MIN_MS = 2400;
  var BOOT_FADE_MS = 480;
  var MESSAGE_MS = 1000;
  var bootStartedAt = Date.now();
  var bootDismissScheduled = false;
  var bootAnimStarted = false;

  var LOADING_MESSAGES = {
    zh: [
      '正在建立標本護照環境...',
      '正在同步分類學資料...',
      '正在整理來源與典藏脈絡...',
      '正在啟動科學資產工作區...',
      '即將進入 MCurator...',
    ],
    en: [
      'Initializing specimen passport system...',
      'Syncing taxonomy context...',
      'Preparing provenance layers...',
      'Activating scientific asset workspace...',
      'Entering MCurator...',
    ],
  };

  function bootLocaleKey_() {
    try {
      if (typeof global.mcGetLang === 'function') return global.mcGetLang() === 'en' ? 'en' : 'zh';
      var s = global.localStorage.getItem('MC_USER_LANG');
      if (s === 'en') return 'en';
      if (s === 'zh-TW') return 'zh';
      var lang = String(global.document.documentElement.lang || '').toLowerCase();
      if (lang.indexOf('en') === 0) return 'en';
    } catch (e) {}
    return 'zh';
  }

  function bootMessages_() {
    return LOADING_MESSAGES[bootLocaleKey_()] || LOADING_MESSAGES.zh;
  }

  function isEditorPreviewRoute_() {
    try {
      var qs = String(global.location && global.location.search ? global.location.search : '');
      return /(?:[?&])(?:editor|editorPreview|staticPreview)=1(?:&|$)/.test(qs);
    } catch (e) {
      return false;
    }
  }

  function forceEditorPreviewReady_() {
    try {
      var html = global.document.documentElement;
      html.classList.remove('mc-boot-active');
      var splash = global.document.getElementById('mcBootSplash');
      if (splash) {
        splash.classList.add('mc-boot-splash--out', 'mc-loader--out');
        splash.setAttribute('aria-busy', 'false');
        global.setTimeout(function () {
          try {
            splash.remove();
          } catch (eRm) {}
        }, 80);
      }
      var ws = global.document.getElementById('welcomeShell');
      if (ws) {
        ws.style.removeProperty('visibility');
        ws.style.removeProperty('pointer-events');
        ws.removeAttribute('inert');
      }
      var rs = global.document.getElementById('responsiveShell');
      if (rs) {
        rs.style.removeProperty('visibility');
        rs.style.removeProperty('pointer-events');
      }
    } catch (e) {}
  }

  function pathFromHash() {
    var h = String(global.location && global.location.hash ? global.location.hash : '').replace(/^#/, '');
    if (!h || h === '/') return '/';
    return h.charAt(0) === '/' ? h : '/' + h;
  }

  function isPublicMarketingRoute(path) {
    var p = String(path || pathFromHash()).replace(/^#/, '');
    if (p.charAt(0) !== '/') p = '/' + p;
    if (!p || p === '/') return true;
    if (p === '/home') return true;
    if (p === '/section/about' || p === '/section/story' || p === '/section/founder-story') return true;
    if (p === '/section/online-exhibition' || p === '/section/museum-collections' || p === '/section/online-museum') return true;
    if (p === '/origin' || p.indexOf('/origin/') === 0 || p === '/section/origin' || p.indexOf('/section/origin/') === 0) return true;
    if (p === '/section/specimen-workflow' || p.indexOf('/section/specimen-workflow/') === 0) return true;
    if (p === '/section/workflow' || p.indexOf('/section/workflow/') === 0) return true;
    if (p === '/section/herbarium-workflow') return true;
    if (p === '/section/card-generator' || p === '/card-generator' || p.indexOf('/section/card-generator') === 0) return true;
    if (p === '/marketplace' || p.indexOf('/marketplace/') === 0) return true;
    if (p === '/sat-marketplace' || p.indexOf('/sat-marketplace/') === 0) return true;
    if (p === '/sat-market' || p.indexOf('/sat-market/') === 0) return true;
    return false;
  }

  function portalEntryModalEarly_() {
    try {
      var d = global.document.getElementById('mcEntryModal');
      if (!d) return;
      d.removeAttribute('inert');
      if (d.parentElement !== global.document.body) {
        global.document.body.appendChild(d);
      }
    } catch (e) {}
  }

  function milestoneIndexForProgress_(pct) {
    if (pct >= 100) return 4;
    if (pct >= 80) return 3;
    if (pct >= 60) return 2;
    if (pct >= 40) return 1;
    if (pct >= 20) return 0;
    return -1;
  }

  function updateBootMilestones_(pct) {
    try {
      var root = global.document.getElementById('mcBootSplash');
      if (!root) return;
      var active = milestoneIndexForProgress_(pct);
      var nodes = root.querySelectorAll('.mc-loader__milestone');
      for (var i = 0; i < nodes.length; i++) {
        if (i <= active) nodes[i].classList.add('is-active');
        else nodes[i].classList.remove('is-active');
      }
    } catch (e) {}
  }

  function setBootProgress_(pct) {
    try {
      var fill = global.document.getElementById('mcBootProgressFill');
      if (fill) fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
      updateBootMilestones_(pct);
    } catch (e) {}
  }

  function setBootStatus_(text, fading) {
    try {
      var el = global.document.getElementById('mcBootSplashStatus');
      if (!el) return;
      if (fading) el.classList.add('is-fading');
      else {
        el.classList.remove('is-fading');
        el.textContent = text;
      }
    } catch (e) {}
  }

  function initMcBootLoaderAnimation_() {
    if (bootAnimStarted) return;
    var splash = global.document.getElementById('mcBootSplash');
    if (!splash) {
      if (global.document.readyState === 'loading') {
        global.document.addEventListener('DOMContentLoaded', initMcBootLoaderAnimation_, { once: true });
      }
      return;
    }
    bootAnimStarted = true;

    var messages = bootMessages_();
    var msgIdx = 0;
    var progress = 0;
    var readyToFinish = false;

    setBootStatus_(messages[0], false);
    setBootProgress_(0);

    var progressTick = global.setInterval(function () {
      if (readyToFinish) return;
      var elapsed = Date.now() - bootStartedAt;
      progress = Math.min(92, (elapsed / BOOT_MIN_MS) * 100);
      setBootProgress_(progress);
    }, 40);

    var messageTick = global.setInterval(function () {
      setBootStatus_(messages[msgIdx], true);
      global.setTimeout(function () {
        msgIdx = (msgIdx + 1) % messages.length;
        setBootStatus_(messages[msgIdx], false);
      }, 420);
    }, MESSAGE_MS);

    var finishWhenReady = function () {
      readyToFinish = true;
      global.clearInterval(progressTick);
      global.clearInterval(messageTick);
      setBootProgress_(100);
      setBootStatus_(messages[messages.length - 1], false);
    };

    global.McPreviewShell.finishBootLoader = finishWhenReady;

    return finishWhenReady;
  }

  function dismissMcBootSplash() {
    try {
      var el = global.document.getElementById('mcBootSplash');
      var html = global.document.documentElement;
      html.classList.remove('mc-boot-active');
      if (!el) return;
      if (global.McPreviewShell && global.McPreviewShell.finishBootLoader) {
        global.McPreviewShell.finishBootLoader();
      }
      setBootProgress_(100);
      el.classList.add('mc-boot-splash--out', 'mc-loader--out');
      el.setAttribute('aria-busy', 'false');
      global.setTimeout(function () {
        try {
          el.remove();
        } catch (e) {}
      }, BOOT_FADE_MS);
    } catch (e) {}
  }

  function scheduleMcBootSplashDismiss() {
    if (bootDismissScheduled) return;
    bootDismissScheduled = true;
    initMcBootLoaderAnimation_();
    var run = function () {
      var elapsed = Date.now() - bootStartedAt;
      var wait = Math.max(0, BOOT_MIN_MS - elapsed);
      global.setTimeout(function () {
        global.requestAnimationFrame(function () {
          global.requestAnimationFrame(dismissMcBootSplash);
        });
      }, wait);
    };
    if (global.document.readyState === 'complete') {
      run();
    } else {
      global.addEventListener('load', run, { once: true });
    }
  }

  function shouldRestoreAppSession() {
    try {
      if (global.sessionStorage.getItem('MC_APP_ENTERED_V1') !== '1') return false;
    } catch (e) {
      return false;
    }
    if (isPublicMarketingRoute()) return false;
    try {
      if (global.location.protocol === 'file:') {
        var qs = String(global.location.search || '');
        if (!/(?:[?&])(?:app|guest|admin)=1(?:&|$)/.test(qs)) return false;
      }
    } catch (e2) {}
    return true;
  }

  function clearStaleAppEnteredChrome() {
    try {
      global.sessionStorage.removeItem('MC_APP_ENTERED_V1');
    } catch (e) {}
    try {
      global.document.documentElement.classList.remove('mc-entered');
    } catch (e2) {}
    try {
      global.document.documentElement.dataset.mcMode = 'landing';
      global.MC_MODE = 'landing';
    } catch (e3) {}
    try {
      var ws = global.document.getElementById('welcomeShell');
      if (ws) {
        ws.style.removeProperty('display');
        ws.removeAttribute('inert');
      }
    } catch (e4) {}
    try {
      global.document.getElementById('loadingMask')?.classList.remove('show');
    } catch (e5) {}
  }

  function hasMountedAppShell() {
    try {
      var shell = global.document.getElementById('responsiveShell');
      var frag = global.__mcAppShellFragment;
      if (shell && (shell.querySelector('#appShellRoot') || shell.querySelector('.app-shell') || shell.firstChild)) {
        return true;
      }
      if (frag && frag.childNodes && frag.childNodes.length > 0) return true;
    } catch (e) {}
    return false;
  }

  function restoreLandingIfBroken() {
    try {
      if (global.document.readyState !== 'complete') {
        global.addEventListener('load', restoreLandingIfBroken, { once: true });
        return;
      }
      var html = global.document.documentElement;
      if (!html.classList.contains('mc-entered')) return;
      if (hasMountedAppShell()) return;
      clearStaleAppEnteredChrome();
      var hero = global.document.getElementById('mcWelcomeHero');
      if (hero) {
        hero.classList.add('is-hero-entered');
        hero.classList.remove('is-hero-entrance-running');
        hero.setAttribute('data-hero-entrance', 'done');
      }
    } catch (e) {}
  }

  function ensureWelcomePhaseVisible() {
    try {
      if (global.document.documentElement.classList.contains('mc-entered')) return;
      var ws = global.document.getElementById('welcomeShell');
      if (!ws) return;
      var path = pathFromHash();

      if (path !== '/' && path !== '/home') {
        if (
          path.indexOf('/section/specimen-workflow') === 0 ||
          path.indexOf('/section/workflow') === 0 ||
          path === '/section/herbarium-workflow'
        ) {
          var swf = global.document.getElementById('welcomePhaseSpecimenWorkflow');
          if (swf) swf.style.display = 'block';
          var introSwf = global.document.getElementById('welcomePhaseIntro');
          if (introSwf) introSwf.style.display = 'none';
        }
        return;
      }

      var phaseIds = ['welcomePhaseIntro', 'welcomePhaseAbout', 'welcomePhaseFounderStory', 'welcomePhaseSpecimenWorkflow'];
      var anyVisible = false;
      for (var i = 0; i < phaseIds.length; i++) {
        var el = global.document.getElementById(phaseIds[i]);
        if (!el) continue;
        var disp = el.style.display;
        if (disp !== 'none' && global.getComputedStyle(el).display !== 'none') {
          anyVisible = true;
          break;
        }
      }
      if (anyVisible) return;
      var introEl = global.document.getElementById('welcomePhaseIntro');
      if (introEl) introEl.style.removeProperty('display');
    } catch (e) {}
  }

  function onInitialBoot() {
    portalEntryModalEarly_();
    if (isPublicMarketingRoute() && global.document.documentElement.classList.contains('mc-entered')) {
      clearStaleAppEnteredChrome();
    }
    restoreLandingIfBroken();
    ensureWelcomePhaseVisible();
    scheduleMcBootSplashDismiss();
  }

  function onHashBoot() {
    if (isPublicMarketingRoute() && global.document.documentElement.classList.contains('mc-entered')) {
      clearStaleAppEnteredChrome();
    }
    restoreLandingIfBroken();
  }

  global.McPreviewShell = {
    pathFromHash: pathFromHash,
    isPublicMarketingRoute: isPublicMarketingRoute,
    shouldRestoreAppSession: shouldRestoreAppSession,
    clearStaleAppEnteredChrome: clearStaleAppEnteredChrome,
    restoreLandingIfBroken: restoreLandingIfBroken,
    ensureWelcomePhaseVisible: ensureWelcomePhaseVisible,
    dismissMcBootSplash: dismissMcBootSplash,
    scheduleMcBootSplashDismiss: scheduleMcBootSplashDismiss,
    finishBootLoader: null,
  };

  try {
    if (global.sessionStorage.getItem('MC_APP_ENTERED_V1') === '1' && isPublicMarketingRoute()) {
      clearStaleAppEnteredChrome();
    }
  } catch (eEarly) {}

  if (isEditorPreviewRoute_()) {
    bootDismissScheduled = true;
    forceEditorPreviewReady_();
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', forceEditorPreviewReady_, { once: true });
    }
  } else {
    scheduleMcBootSplashDismiss();
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', onInitialBoot);
  } else {
    onInitialBoot();
  }

  global.addEventListener('hashchange', function () {
    global.setTimeout(onHashBoot, 0);
  });
})(typeof window !== 'undefined' ? window : this);
