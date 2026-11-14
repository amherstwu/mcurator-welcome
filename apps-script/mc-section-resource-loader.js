/**
 * MCurator Apps Script / static shell — section resource loader (Prompt 05).
 *
 * Idempotent CSS/JS loaders + section registry. Preserves existing section IDs,
 * globals, and google.script.run contracts. Does not evaluate the same URL twice.
 *
 * Public API (window.MCSectionResources):
 *   ensureSectionLoaded(sectionId) -> Promise
 *   loadScriptOnce(resourceKey, url, opts?) -> Promise
 *   loadStyleOnce(resourceKey, url, opts?) -> Promise
 *   loadCdnScriptOnce(resourceKey, url, opts?) -> Promise
 *   prefetchSection(sectionId) -> void
 *   getSectionState(sectionId) -> { status, error? }
 *   retrySection(sectionId) -> Promise
 */
(function (global) {
  'use strict';

  if (global.MCSectionResources && global.MCSectionResources.__ready) return;

  var DEV =
    !!(global.MC_IS_LOCAL_PREVIEW || global.location?.protocol === 'file:' || /[?&]mcDebug=1/.test(String(global.location?.search || '')));

  function log() {
    if (!DEV) return;
    try {
      console.info.apply(console, ['[MCSectionResources]'].concat([].slice.call(arguments)));
    } catch (e) {
      void 0;
    }
  }

  function warn() {
    try {
      console.warn.apply(console, ['[MCSectionResources]'].concat([].slice.call(arguments)));
    } catch (e) {
      void 0;
    }
  }

  /** @type {Record<string, Promise<void>>} */
  var scriptPromises = Object.create(null);
  /** @type {Record<string, Promise<void>>} */
  var stylePromises = Object.create(null);
  /** @type {Record<string, { status: string, error?: string, gen: number }>} */
  var sectionState = Object.create(null);
  /** @type {Record<string, Promise<void>>} */
  var sectionPromises = Object.create(null);
  var sectionGen = Object.create(null);

  function absUrl(url) {
    try {
      return new URL(url, global.location.href).href;
    } catch (e) {
      return String(url || '');
    }
  }

  function resourceKeyFromUrl(url) {
    return absUrl(url);
  }

  function markDom(el, key, kind) {
    try {
      el.setAttribute('data-mc-resource-key', key);
      el.setAttribute('data-mc-resource-kind', kind);
      el.setAttribute('data-mc-resource-loaded', '1');
    } catch (e) {
      void 0;
    }
  }

  function findExistingScript(url) {
    var abs = absUrl(url);
    var nodes = document.querySelectorAll('script[src]');
    for (var i = 0; i < nodes.length; i++) {
      try {
        if (absUrl(nodes[i].getAttribute('src') || '') === abs) return nodes[i];
      } catch (e) {
        void 0;
      }
    }
    return null;
  }

  function findExistingStyle(url) {
    var abs = absUrl(url);
    var nodes = document.querySelectorAll('link[rel="stylesheet"][href]');
    for (var i = 0; i < nodes.length; i++) {
      try {
        if (absUrl(nodes[i].getAttribute('href') || '') === abs) return nodes[i];
      } catch (e) {
        void 0;
      }
    }
    return null;
  }

  function loadStyleOnce(resourceKey, url, opts) {
    opts = opts || {};
    var key = resourceKey || resourceKeyFromUrl(url);
    if (stylePromises[key]) return stylePromises[key];

    var existing = findExistingStyle(url);
    if (existing) {
      markDom(existing, key, 'css');
      stylePromises[key] = Promise.resolve();
      return stylePromises[key];
    }

    stylePromises[key] = new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      if (opts.media) link.media = opts.media;
      link.onload = function () {
        markDom(link, key, 'css');
        log('style ok', key);
        resolve();
      };
      link.onerror = function () {
        stylePromises[key] = null;
        reject(new Error('Failed to load stylesheet: ' + url));
      };
      (document.head || document.documentElement).appendChild(link);
    });
    return stylePromises[key];
  }

  function loadScriptOnce(resourceKey, url, opts) {
    opts = opts || {};
    var key = resourceKey || resourceKeyFromUrl(url);
    if (scriptPromises[key]) return scriptPromises[key];

    var existing = findExistingScript(url);
    if (existing) {
      markDom(existing, key, 'js');
      // If already in DOM, assume ready (eager/defer boot paths).
      scriptPromises[key] = Promise.resolve();
      return scriptPromises[key];
    }

    scriptPromises[key] = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = url;
      if (opts.async !== false) s.async = true;
      if (opts.defer) s.defer = true;
      if (opts.id) s.id = opts.id;
      if (opts.type) s.type = opts.type;
      if (opts.integrity) {
        s.integrity = opts.integrity;
        s.crossOrigin = opts.crossOrigin || 'anonymous';
      }
      s.onload = function () {
        markDom(s, key, 'js');
        log('script ok', key);
        resolve();
      };
      s.onerror = function () {
        scriptPromises[key] = null;
        reject(new Error('Failed to load script: ' + url));
      };
      (document.head || document.documentElement).appendChild(s);
    });
    return scriptPromises[key];
  }

  function loadModuleOnce(resourceKey, url) {
    var key = resourceKey || resourceKeyFromUrl(url);
    if (scriptPromises[key]) return scriptPromises[key];
    // Classic scripts cannot call `import()` directly; Function() evaluates it in module scope.
    // Do NOT use global.import — that property does not exist and breaks Earth / ESM sections.
    scriptPromises[key] = Promise.resolve()
      .then(function () {
        return new Function('u', 'return import(u)')(url);
      })
      .then(function (mod) {
        log('module ok', key);
        return mod;
      })
      .catch(function (err) {
        scriptPromises[key] = null;
        throw err;
      });
    return scriptPromises[key];
  }

  function loadCdnScriptOnce(resourceKey, url, opts) {
    return loadScriptOnce(resourceKey, url, opts || {});
  }

  function runSequential(fns) {
    return fns.reduce(function (p, fn) {
      return p.then(fn);
    }, Promise.resolve());
  }

  /**
   * Section → ordered styles + scripts.
   * Keys match switchSection / welcome phase / marketing route ids.
   */
  var REGISTRY = {
    'passport-studio': {
      css: ['specimen-card-generator.css?v=2026-phone-preview-v1', 'locked-passport-standard.css?v=2026-embed-height-v4'],
      js: [
        'i18n/specimenCardGeneratorCopy.js?v=de-r6',
        'card-generator-background-matcher.js',
        'card-generator-background-registry.js',
        'species-verification-service.js',
        'mc-locality-enrichment.js',
        'specimen-card-generator.js?v=2026-phone-preview-v1',
      ],
    },
    'paleo-reconstruction': {
      css: ['paleo-reconstruction.css'],
      js: ['i18n/paleoReconstructionCopy.js?v=de-r4', 'paleo-wildlife-photo-prompt.js', 'paleo-reconstruction.js'],
    },
    'photo-restoration-lab': {
      css: ['photo-restoration-lab.css'],
      js: [
        'i18n/photoRestorationLabCopy.js?v=de-r5',
        'photo-restoration-lab-rembg.js',
        'photo-restoration-lab-canvas.js',
        'photo-restoration-lab-enhance-pro.js',
        'photo-restoration-lab-upscale.js',
        'photo-restoration-lab-plate-stack.js',
        'photo-restoration-lab-local-inpaint.js',
        'photo-restoration-lab-oss-health.js',
        'photo-restoration-lab-pipeline.js',
        'photo-restoration-lab.js',
      ],
    },
    'taxonomy-manuscript-studio': {
      css: ['taxonomy-manuscript-studio.css'],
      js: ['i18n/taxonomyManuscriptStudioCopy.js?v=de-r4', 'taxonomy-manuscript-studio.js'],
    },
    'evolution-tree-lab': {
      css: ['evolution-tree-lab.css'],
      js: [
        'i18n/evolutionTreeLabCopy.js?v=etl-v2',
        'evolution-tree-services.js',
        'evolution-tree-afriGis-client.js',
        'evolution-tree-lab-layouts.js',
        'evolution-tree-lab.js',
      ],
    },
    'husbandry-log': {
      css: [
        'husbandry-log-foundation.css?v=hl-v84',
        'husbandry-log-wizard.css?v=hl-v84',
        'husbandry-log-careguide.css?v=hl-v84',
        'husbandry-log-breeding.css?v=hl-v84',
        'husbandry-log-console.css?v=hl-v84',
        'husbandry-log-dashboard.css?v=hl-v84',
        'husbandry-log-command-center.css?v=hl-v84',
      ],
      js: [
        'i18n/husbandryLogCopy.js?v=hl-v86',
        'i18n/husbandryLogI18n.js?v=hl-v86',
        'i18n/husbandryCareGuideI18n.js?v=hl-v87',
        'i18n/husbandryCareGuideEnrichI18n.js?v=hl-v87',
        'i18n/husbandryCareGuideRound6.js?v=hl-v87',
        'i18n/husbandryWizardI18n.js?v=hl-v86',
        'husbandryPetIllustrations.js?v=hl-v84',
        'husbandrySpeciesCatalog.js?v=hl-v84',
        'speciesCareProfiles.js',
        'husbandrySpeciesSearch.js?v=hl-v84',
        'husbandryCareCategories.js?v=hl-v84',
        'husbandryRecordDecks.js?v=hl-v84',
        'husbandryRecordChoices.js?v=hl-v84',
        'husbandryLabelTemplates.js?v=hl-v84',
        'husbandryBreeding.js?v=hl-v84',
        'husbandryCareGuideAmphibians.js?v=hl-v84',
        'husbandryCareGuideInsects.js?v=hl-v84',
        'husbandryCareGuideReptiles.js?v=hl-v84',
        'husbandryCareGuideFreshwater.js?v=hl-v84',
        'husbandryCareGuideMarine.js?v=hl-v84',
        'husbandryCareGuideBirds.js?v=hl-v84',
        'husbandryCareGuideSmallMammals.js?v=hl-v84',
        'husbandryCareGuideArthropodTerrarium.js?v=hl-v84',
        'husbandryCareGuideGeneral.js?v=hl-v84',
        'husbandryCareGuideMatcher.js?v=hl-v84',
        'husbandryCareGuideEnrich.js?v=hl-v84',
        'husbandryCareGuide.js?v=hl-v84',
        'insectStatusOptions.js',
        'husbandryAssetVersion.js?v=hl-v84',
        'husbandryActionRegistry.js?v=hl-v84',
        'husbandryHealthFollowUp.js?v=hl-v84',
        'husbandryAddPetWizard.js?v=hl-v84',
        'husbandry-export-contract.js?v=hl-v84',
        'husbandryDataExport.js?v=hl-v84',
        'husbandryOffline.js?v=hl-v84',
        'husbandryQr.js?v=hl-v84',
        'husbandryTrends.js?v=hl-v84',
        'husbandryBatch.js?v=hl-v84',
        'husbandry-log.js?v=hl-v84',
      ],
    },
    sat: {
      css: [],
      js: [
        'data/sat-about-content.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-extra.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-checklist.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-deliverables.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-licenses.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-seller-checklist.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-badges.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-physical-delivery.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-sensitive-data.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-dispute-guide.js?v=sat-v3-faq-third-party1',
        'data/sat-about-faq-third-party.js?v=sat-v3-faq-risk1',
        'data/sat-about-faq-risk-control.js?v=sat-v3-faq-risk1',
        'data/sat-about-faq-jurisdictions.js?v=sat-v3-faq-juris1',
        'data/sat-about-jurisdictional-regions.js?v=sat-v3-juris-regions1',
        'data/sat-about-high-risk-legal.js?v=sat-v3-high-risk1',
        'data/sat-market-named-specimens.js?v=sat-v3-passport-ref2',
        'data/sat-assets-data.js?v=sat-v3-passport-ref2',
        'data/specimen-passports-data.js',
        'data/sat-market-specimen-manifest.js?v=sat-v3-passport-ref2',
        'mc-sat-v3-marketplace-ui.js?v=sat-v3-no-catalog-passport',
      ],
    },
    'founder-story': {
      css: ['founder-story-bundle.css?v=founder-story-v62-locale-body'],
      js: [{ url: 'founder-story-bundle.js?v=founder-story-v62-locale-body', id: 'mcFounderStoryBundle' }],
    },
    'online-exhibition': {
      css: ['online-exhibition-bundle.css?v=online-exhibition-v84-collab-labels'],
      js: [{ url: 'online-exhibition-bundle.js?v=online-exhibition-v84-collab-labels', id: 'mcOnlineExhibitionBundle' }],
    },
    origin: {
      css: ['mc-origin.css?v=origin-home-paper-v2'],
      js: [
        { url: 'data/sat-market-named-specimens.js?v=sat-v3-passport-ref2', id: 'mcOriginSpecimenPhotos' },
        { url: 'data/sat-assets-data.js?v=origin-stage9-workspace', id: 'mcSatAssetCatalog' },
        { url: 'mc-origin.js?v=origin-home-paper-v2', id: 'mcOriginBundle' },
      ],
    },
    'specimen-workflow': {
      css: [
        'herbarium-workflow-scene.css',
        'specimen-workflow-page.css',
        'herbarium-workflow-bundle.css?v=specimen-workflow-mount-v26',
      ],
      js: [
        { url: 'herbarium-workflow-bundle.js?v=specimen-workflow-mount-v26', id: 'mcHerbariumWorkflowBundle' },
        'specimen-workflow-page.js',
        'herbarium-workflow-bridge.js?v=herbarium-workflow-story-v1',
      ],
    },
    'welcome-earth': {
      css: [],
      js: [],
      modules: [
        {
          key: 'cdn:three@0.160.0',
          url: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
          assign: function (mod) {
            if (mod && mod.default) global.THREE = mod.default;
            else if (mod) global.THREE = mod;
          },
        },
      ],
      afterModules: ['mc-hero-earth-three.js?v=passport-hero-file-protocol-fix'],
    },
    xlsx: {
      css: [],
      js: [
        {
          url: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
          key: 'cdn:xlsx@0.18.5',
          async: false,
        },
      ],
    },
    game: {
      css: ['researcher-progress-center.css'],
      js: ['i18n/researcherProgressCopy.js?v=de-r4', 'researcher-progress-config.js', 'researcher-progress-center.js'],
    },
  };

  // Aliases used by hash routes / nav
  REGISTRY['card-generator'] = REGISTRY['passport-studio'];
  REGISTRY['specimen-passport'] = REGISTRY['passport-studio'];
  REGISTRY['marketplace'] = REGISTRY.sat;
  REGISTRY['dashboard/marketplace'] = REGISTRY.sat;
  REGISTRY.story = REGISTRY['founder-story'];
  REGISTRY.about = null; // boot chrome — no heavy pack
  REGISTRY.exhibitions = REGISTRY['online-exhibition'];
  REGISTRY['museum-collections'] = REGISTRY['online-exhibition'];
  REGISTRY['online-museum'] = REGISTRY['online-exhibition'];
  REGISTRY.herbarium = REGISTRY['specimen-workflow'];
  REGISTRY['herbarium-workflow'] = REGISTRY['specimen-workflow'];

  function normalizeSectionId(sectionId) {
    var id = String(sectionId || '')
      .replace(/^#?\/?section\//, '')
      .replace(/^\//, '')
      .split('?')[0]
      .split('#')[0];
    if (id === 'workbench') id = 'dashboard';
    return id;
  }

  function entryUrl(entry) {
    if (!entry) return '';
    if (typeof entry === 'string') return entry;
    return entry.url || '';
  }

  function entryKey(entry) {
    if (!entry) return '';
    if (typeof entry === 'string') return resourceKeyFromUrl(entry);
    return entry.key || resourceKeyFromUrl(entry.url || '');
  }

  function showSectionLoading(sectionId, on) {
    try {
      var live = document.getElementById('mcSectionLoadLive');
      if (live) {
        live.setAttribute('aria-busy', on ? 'true' : 'false');
        if (on) live.textContent = live.getAttribute('data-mc-loading-label') || 'Loading section...';
        else if (live.getAttribute('data-mc-clear-on-idle') === '1') live.textContent = '';
      }
      var sec = document.getElementById('section-' + sectionId);
      if (sec) sec.setAttribute('data-mc-resources', on ? 'loading' : 'ready');
    } catch (e) {
      void 0;
    }
  }

  function showSectionFailure(sectionId, err) {
    var msg = (err && err.message) || 'Section resources failed to load';
    sectionState[sectionId] = { status: 'error', error: msg, gen: sectionGen[sectionId] || 0 };
    try {
      var live = document.getElementById('mcSectionLoadLive');
      if (live) {
        live.setAttribute('aria-busy', 'false');
        live.textContent = live.getAttribute('data-mc-error-label') || 'Section failed to load. Retry.';
      }
      var host =
        document.getElementById('section-' + sectionId) ||
        document.getElementById('welcomePhaseFounderStory') ||
        document.getElementById('welcomePhaseOnlineExhibition') ||
        document.getElementById('welcomePhaseSpecimenWorkflow');
      if (!host) return;
      var bannerId = 'mcSectionLoadError-' + sectionId;
      var existing = document.getElementById(bannerId);
      if (existing) existing.remove();
      var banner = document.createElement('div');
      banner.id = bannerId;
      banner.className = 'mc-section-load-error';
      banner.setAttribute('role', 'alert');
      banner.style.cssText =
        'margin:12px;padding:12px 14px;border-radius:12px;border:1px solid rgba(217,198,111,.35);background:rgba(8,14,12,.92);color:#eef5e6;display:flex;gap:12px;align-items:center;flex-wrap:wrap;';
      var text = document.createElement('span');
      text.textContent = msg;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'secondary-btn';
      btn.textContent =
        typeof global.mcPick === 'function'
          ? global.mcPick({ zh: '重試', en: 'Retry', ja: '再試行', de: 'Erneut versuchen' })
          : 'Retry';
      btn.onclick = function () {
        banner.remove();
        retrySection(sectionId);
      };
      banner.appendChild(text);
      banner.appendChild(btn);
      host.insertBefore(banner, host.firstChild);
    } catch (e) {
      warn('failure UI', e);
    }
  }

  function clearSectionFailure(sectionId) {
    try {
      var el = document.getElementById('mcSectionLoadError-' + sectionId);
      if (el) el.remove();
    } catch (e) {
      void 0;
    }
  }

  function loadSectionPack(def) {
    if (!def) return Promise.resolve();
    var styleJobs = (def.css || []).map(function (href) {
      return function () {
        return loadStyleOnce(resourceKeyFromUrl(href), href);
      };
    });
    var moduleJobs = (def.modules || []).map(function (mod) {
      return function () {
        return loadModuleOnce(mod.key || resourceKeyFromUrl(mod.url), mod.url).then(function (m) {
          if (typeof mod.assign === 'function') mod.assign(m);
        });
      };
    });
    var afterModuleJobs = (def.afterModules || []).map(function (src) {
      return function () {
        return loadScriptOnce(resourceKeyFromUrl(src), src, { async: true });
      };
    });
    var scriptJobs = (def.js || []).map(function (entry) {
      return function () {
        var url = entryUrl(entry);
        var key = entryKey(entry);
        var opts = typeof entry === 'object' && entry ? entry : {};
        return loadScriptOnce(key, url, {
          id: opts.id,
          async: opts.async !== false,
          defer: !!opts.defer,
          integrity: opts.integrity,
          crossOrigin: opts.crossOrigin,
          type: opts.type,
        });
      };
    });
    return runSequential(styleJobs.concat(moduleJobs).concat(afterModuleJobs).concat(scriptJobs));
  }

  var SECTION_LOAD_TIMEOUT_MS = 45000;

  function withTimeout(promise, ms, label) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timer = global.setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error(label || 'Section load timed out'));
      }, ms);
      promise.then(
        function (value) {
          if (settled) return;
          settled = true;
          global.clearTimeout(timer);
          resolve(value);
        },
        function (err) {
          if (settled) return;
          settled = true;
          global.clearTimeout(timer);
          reject(err);
        },
      );
    });
  }

  function ensureSectionLoaded(sectionId) {
    var id = normalizeSectionId(sectionId);
    var def = REGISTRY[id];
    if (def === null || def === undefined) {
      // Unknown / lightweight section — no deferred pack.
      sectionState[id] = { status: 'ready', gen: sectionGen[id] || 0 };
      return Promise.resolve();
    }
    if (sectionPromises[id] && sectionState[id] && sectionState[id].status === 'ready') {
      return sectionPromises[id];
    }
    if (sectionPromises[id] && sectionState[id] && sectionState[id].status === 'loading') {
      return sectionPromises[id];
    }

    sectionGen[id] = (sectionGen[id] || 0) + 1;
    var gen = sectionGen[id];
    sectionState[id] = { status: 'loading', gen: gen };
    showSectionLoading(id, true);
    clearSectionFailure(id);
    log('ensure', id);

    var timeoutLabel =
      typeof global.mcPick === 'function'
        ? global.mcPick({
            zh: '區塊資源載入逾時。請重試。',
            en: 'Section resources timed out. Please retry.',
            ja: 'セクション資源の読み込みがタイムアウトしました。再試行してください。',
            de: 'Abschnittsressourcen-Zeitüberschreitung. Bitte erneut versuchen.',
          })
        : 'Section resources timed out. Please retry.';

    sectionPromises[id] = withTimeout(loadSectionPack(def), SECTION_LOAD_TIMEOUT_MS, timeoutLabel)
      .then(function () {
        if (gen !== sectionGen[id]) return;
        sectionState[id] = { status: 'ready', gen: gen };
        showSectionLoading(id, false);
        try {
          global.dispatchEvent(new CustomEvent('mc-section-resources:ready', { detail: { sectionId: id } }));
        } catch (eEv) {
          void 0;
        }
      })
      .catch(function (err) {
        if (gen !== sectionGen[id]) throw err;
        sectionPromises[id] = null;
        showSectionLoading(id, false);
        showSectionFailure(id, err);
        warn('ensure failed', id, err && err.message);
        throw err;
      });

    return sectionPromises[id];
  }

  function retrySection(sectionId) {
    var id = normalizeSectionId(sectionId);
    sectionPromises[id] = null;
    if (sectionState[id]) sectionState[id].status = 'idle';
    return ensureSectionLoaded(id).then(function () {
      try {
        if (typeof global.switchSection === 'function' && document.documentElement.classList.contains('mc-entered')) {
          global.switchSection(id);
        } else if (id === 'founder-story' && typeof global.showWelcomePhaseFounderStory === 'function') {
          global.showWelcomePhaseFounderStory();
        } else if (id === 'online-exhibition' && typeof global.showWelcomePhaseOnlineExhibition === 'function') {
          global.showWelcomePhaseOnlineExhibition();
        } else if (id === 'origin' && typeof global.showWelcomePhaseOrigin === 'function') {
          global.showWelcomePhaseOrigin();
        } else if (id === 'specimen-workflow' && typeof global.showWelcomePhaseSpecimenWorkflow === 'function') {
          global.showWelcomePhaseSpecimenWorkflow();
        }
      } catch (e) {
        warn('retry remount', e);
      }
    });
  }

  function prefetchSection(sectionId) {
    try {
      var conn = global.navigator && global.navigator.connection;
      if (conn && (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) return;
    } catch (e) {
      void 0;
    }
    ensureSectionLoaded(sectionId).catch(function () {
      /* prefetch failures are non-fatal */
    });
  }

  function getSectionState(sectionId) {
    var id = normalizeSectionId(sectionId);
    return sectionState[id] || { status: 'idle' };
  }

  /**
   * Wrap switchSection so heavy packs load before mount hooks run.
   * Idempotent — safe if called more than once.
   */
  function installSwitchSectionHook() {
    if (global.__mcSectionResourcesHookInstalled) return;
    var original = global.switchSection;
    if (typeof original !== 'function') return;
    global.__mcSectionResourcesHookInstalled = true;

    global.switchSection = function (name) {
      var args = arguments;
      var self = this;
      var id = normalizeSectionId(name);
      var needs = REGISTRY[id] != null && typeof REGISTRY[id] === 'object';
      // Always activate the existing section shell immediately (DOM contract).
      var first = original.apply(self, args);
      if (!needs) return first;

      showSectionLoading(id, true);
      ensureSectionLoaded(id)
        .then(function () {
          showSectionLoading(id, false);
          // Second pass: mount hooks now that deferred globals exist.
          return original.apply(self, args);
        })
        .catch(function (err) {
          showSectionFailure(id, err);
        });
      return first;
    };
    log('switchSection hook installed');
  }

  function wrapWelcome(fnName, sectionId) {
    var original = global[fnName];
    if (typeof original !== 'function' || original.__mcSectionWrapped) return;
    var wrapped = function () {
      var args = arguments;
      var self = this;
      return ensureSectionLoaded(sectionId)
        .then(function () {
          return original.apply(self, args);
        })
        .catch(function (err) {
          showSectionFailure(sectionId, err);
        });
    };
    wrapped.__mcSectionWrapped = true;
    global[fnName] = wrapped;
  }

  function installWelcomeHooks() {
    wrapWelcome('showWelcomePhaseFounderStory', 'founder-story');
    wrapWelcome('showWelcomePhaseOnlineExhibition', 'online-exhibition');
    wrapWelcome('showWelcomePhaseOrigin', 'origin');
    wrapWelcome('showWelcomePhaseSpecimenWorkflow', 'specimen-workflow');
  }

  function ensureXlsx() {
    if (typeof global.XLSX !== 'undefined') return Promise.resolve(global.XLSX);
    return ensureSectionLoaded('xlsx').then(function () {
      return global.XLSX;
    });
  }

  function ensureWelcomeEarth() {
    if (global.THREE && document.querySelector('script[src*="mc-hero-earth-three"]')) {
      return Promise.resolve();
    }
    return ensureSectionLoaded('welcome-earth');
  }

  var api = {
    __ready: true,
    REGISTRY: REGISTRY,
    ensureSectionLoaded: ensureSectionLoaded,
    loadScriptOnce: loadScriptOnce,
    loadStyleOnce: loadStyleOnce,
    loadCdnScriptOnce: loadCdnScriptOnce,
    loadModuleOnce: loadModuleOnce,
    prefetchSection: prefetchSection,
    getSectionState: getSectionState,
    retrySection: retrySection,
    installSwitchSectionHook: installSwitchSectionHook,
    installWelcomeHooks: installWelcomeHooks,
    ensureXlsx: ensureXlsx,
    ensureWelcomeEarth: ensureWelcomeEarth,
  };

  global.MCSectionResources = api;

  function installRouterHook() {
    if (!global.MCRouter || typeof global.MCRouter.render !== 'function') return false;
    if (global.MCRouter.render.__mcSectionWrapped) return true;

    var PATH_TO_SECTION = {
      '/section/photo-restoration-lab': 'photo-restoration-lab',
      '/section/taxonomy-manuscript-studio': 'taxonomy-manuscript-studio',
      '/section/evolution-tree-lab': 'evolution-tree-lab',
      '/section/husbandry-log': 'husbandry-log',
      '/section/paleo-reconstruction': 'paleo-reconstruction',
      '/section/passport-studio': 'passport-studio',
      '/section/card-generator': 'passport-studio',
      '/card-generator': 'passport-studio',
      '/section/online-exhibition': 'online-exhibition',
      '/section/exhibitions': 'online-exhibition',
      '/section/online-museum': 'online-exhibition',
      '/origin': 'origin',
      '/section/origin': 'origin',
      '/section/specimen-workflow': 'specimen-workflow',
      '/section/herbarium-workflow': 'specimen-workflow',
      '/marketplace': 'sat',
      '/sat-marketplace': 'sat',
      '/sat-market': 'sat',
      '/marketplace/about': 'sat',
      '/dashboard/marketplace': 'sat',
      '/section/sat': 'sat',
      '/section/game': 'game',
    };

    var original = global.MCRouter.render;
    global.MCRouter.render = function () {
      var path = '';
      try {
        path =
          typeof global.normalizeInitialRoute === 'function'
            ? global.normalizeInitialRoute()
            : String(global.location.hash || '')
                .replace(/^#/, '')
                .split('?')[0] || '/';
      } catch (ePath) {
        path = '/';
      }
      var sectionId = PATH_TO_SECTION[path];
      if (!sectionId && /^\/marketplace\//.test(path)) sectionId = 'sat';
      if (!sectionId && /^\/sat-market\//.test(path)) sectionId = 'sat';
      if (!sectionId && (path === '/origin' || path.indexOf('/origin/') === 0 || path.indexOf('/section/origin/') === 0)) {
        sectionId = 'origin';
      }
      if (!sectionId || REGISTRY[sectionId] == null) {
        return original.apply(this, arguments);
      }
      var self = this;
      var args = arguments;
      var pathAtStart = path;
      ensureSectionLoaded(sectionId)
        .then(function () {
          var now = pathAtStart;
          try {
            now =
              typeof global.normalizeInitialRoute === 'function'
                ? global.normalizeInitialRoute()
                : pathAtStart;
          } catch (eNow) {
            void 0;
          }
          if (now !== pathAtStart) {
            log('render superseded', pathAtStart, '->', now);
            return;
          }
          return original.apply(self, args);
        })
        .catch(function (err) {
          showSectionFailure(sectionId, err);
        });
    };
    global.MCRouter.render.__mcSectionWrapped = true;
    log('MCRouter.render hook installed');
    return true;
  }

  function bootHooks() {
    installSwitchSectionHook();
    installWelcomeHooks();
    installRouterHook();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootHooks);
  } else {
    bootHooks();
  }
  // Late: switchSection is defined in a large inline script after this file may load.
  global.setTimeout(bootHooks, 0);
  global.setTimeout(bootHooks, 500);
  global.setTimeout(bootHooks, 2000);

  // Idle prefetch for Earth only after first paint (landing).
  global.setTimeout(function () {
    try {
      if (!document.documentElement.classList.contains('mc-entered')) {
        prefetchSection('welcome-earth');
      }
    } catch (e) {
      void 0;
    }
  }, 2500);
})(typeof window !== 'undefined' ? window : this);
