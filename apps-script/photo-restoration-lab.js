/**
 * MCurator — Photo Restoration Lab (isolated scientific restoration workspace).
 * Mock AI provider only; adapters are stubs for future Real-ESRGAN / Restormer / IOPaint / ComfyUI.
 * Does not modify Passport cards, SAT, Quest, museum collections UI, or specimen CRUD flows.
 */
(function (global) {
  'use strict';

  var _prlC = (global && global.MCPhotoRestorationLabCopy) || {};
  function prlT(k, fb) {
    if (typeof global.mcModuleT === 'function') return global.mcModuleT(_prlC, k, fb);
    var p = _prlC[k];
    if (p && typeof mcPick === 'function') return mcPick(p) || (fb != null ? fb : k);
    return fb != null ? fb : k;
  }

  var STORAGE_PROJECTS = 'mcurator_photo_restoration_projects_v1';
  var STORAGE_ACTIVE = 'mcurator_photo_restoration_active_v1';
  var ROOT_ID = 'mcPhotoRestorationLabRoot';
  var SHELL_ID = 'mcPhotoRestorationShell';

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function prlOpLabelZh(op) {
    var m = {
      enhance: prlT('opEnhance', 'Auto enhance'),
      denoise: prlT('opDenoise', 'Denoise'),
      deblur: prlT('opDeblur', 'Deblur'),
      derain: prlT('opDerain', 'Derain'),
      removeBackground: prlT('opRemoveBg', 'Remove background'),
      correctColor: prlT('opCorrectColor', 'Color / low-light'),
      upscale: prlT('opUpscale', 'Upscale 2×'),
      inpaint: prlT('opInpaint', 'Inpaint'),
      exportImage: prlT('opExportPrep', 'Export prep'),
      glare: prlT('opGlare', 'Remove glare'),
      grade: prlT('opGrade', 'Color grade'),
      dust: prlT('opDust', 'Dust removal'),
      jpeg: prlT('opJpeg', 'JPEG noise suppression'),
      clarity: prlT('opClarity', 'Clarity boost'),
      dehaze: prlT('opDehaze', 'Dehaze'),
      archive: prlT('opArchive', 'Archive restore'),
      exposure: prlT('opExposure', 'Exposure lift'),
      sharpen: prlT('opSharpen', 'Sharpen'),
      whiteBalance: prlT('opWhiteBalance', 'Auto white balance'),
      vignette: prlT('opVignette', 'Vignette removal'),
      castRemove: prlT('opCastRemove', 'Yellow cast removal'),
      quickEdit: prlT('opQuickEdit', 'Quick photo edit'),
      autoCrop: prlT('opAutoCrop', 'Auto crop'),
      borderClean: prlT('opBorderClean', 'Border cleanup'),
      padWhite: prlT('opPadWhite', 'Add white margin'),
      rotate90: prlT('toolRotate90', 'Rotate 90°'),
      flipH: prlT('toolFlipH', 'Flip horizontal'),
      flipV: prlT('toolFlipV', 'Flip vertical'),
      up4: prlT('opUp4', 'Upscale 4×'),
      whiteBg: prlT('opWhiteBg', 'White background'),
      transparentBg: prlT('opTransparentBg', 'Transparent background')
    };
    return m[op] || op;
  }

  function prlBatchStatusZh(st) {
    if (st === 'queued') return prlT('batchQueued');
    if (st === 'done') return prlT('batchDone');
    return String(st || '');
  }

  function prlPipe_(keys) {
    return keys.map(function (k) {
      return prlT(k);
    });
  }

  function getPresets_() {
    return [
      {
        id: 'passport_cleanup',
        name: prlT('presetPassportName'),
        desc: prlT('presetPassportDesc'),
        pipeline: prlPipe_(['presetPassportPipe1', 'presetPassportPipe2', 'presetPassportPipe3', 'presetPassportPipe4']),
        exportHint: prlT('presetPassportExport')
      },
      {
        id: 'fossil_slab',
        name: prlT('presetFossilName'),
        desc: prlT('presetFossilDesc'),
        pipeline: prlPipe_([
          'presetFossilPipe1',
          'presetFossilPipe2',
          'presetFossilPipe3',
          'presetFossilPipe4',
          'presetFossilPipe5'
        ]),
        exportHint: prlT('presetFossilExport'),
        warnInpaint: true
      },
      {
        id: 'field_rescue',
        name: prlT('presetFieldName'),
        desc: prlT('presetFieldDesc'),
        pipeline: prlPipe_([
          'presetFieldPipe1',
          'presetFieldPipe2',
          'presetFieldPipe3',
          'presetFieldPipe4',
          'presetFieldPipe5',
          'presetFieldPipe6'
        ]),
        exportHint: prlT('presetFieldExport')
      },
      {
        id: 'low_light_archive',
        name: prlT('presetLowLightName'),
        desc: prlT('presetLowLightDesc'),
        pipeline: prlPipe_([
          'presetLowLightPipe1',
          'presetLowLightPipe2',
          'presetLowLightPipe3',
          'presetLowLightPipe4',
          'presetLowLightPipe5'
        ]),
        exportHint: prlT('presetLowLightExport')
      },
      {
        id: 'safe_inpaint',
        name: prlT('presetSafeInpaintName'),
        desc: prlT('presetSafeInpaintDesc'),
        pipeline: prlPipe_(['presetSafeInpaintPipe1', 'presetSafeInpaintPipe2']),
        exportHint: prlT('presetSafeInpaintExport'),
        warnInpaint: true
      },
      {
        id: 'batch_archive',
        name: prlT('presetBatchName'),
        desc: prlT('presetBatchDesc'),
        pipeline: prlPipe_(['presetBatchPipe1', 'presetBatchPipe2', 'presetBatchPipe3', 'presetBatchPipe4']),
        exportHint: prlT('presetBatchExport')
      }
    ];
  }

  function getImageTypes_() {
    return [
      { id: 'specimen', label: prlT('typeSpecimen') },
      { id: 'fossil', label: prlT('typeFossil') },
      { id: 'field', label: prlT('typeField') },
      { id: 'archive', label: prlT('typeArchive') },
      { id: 'other', label: prlT('typeOther') }
    ];
  }

  function findPreset_(id) {
    var list = getPresets_();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function defaultProject() {
    return {
      id: uid('prj'),
      title: prlT('defaultProjectTitle'),
      sourceImageUrl: '',
      baselineImageUrl: '',
      originalFileName: '',
      imageType: 'specimen',
      preset: '',
      safeMode: true,
      versions: [],
      masks: [],
      exports: [],
      log: [],
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
  }

  function defaultVersion(label, imageUrl, ops) {
    return {
      id: uid('ver'),
      imageUrl: imageUrl,
      label: label || prlT('originalLabel'),
      operations: ops || [],
      createdAt: nowIso()
    };
  }

  function logEntry(type, parameters, provider, safeMode, affectedArea, extra) {
    return {
      id: uid('log'),
      type: type,
      parameters: parameters || {},
      provider: provider || 'mock',
      safeMode: !!safeMode,
      affectedArea: affectedArea || 'none',
      createdAt: nowIso(),
      extra: extra || {}
    };
  }

  /**
   * Abstract-style mock provider (replace with real adapters later).
   * @constructor
   */
  function MockAIPhotoRestorationProvider() {
    this.name = 'mock';
  }
  MockAIPhotoRestorationProvider.prototype._delay = function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms || 600 + Math.floor(Math.random() * 400));
    });
  };
  MockAIPhotoRestorationProvider.prototype.enhance = function (image, options) {
    var self = this;
    return self._delay().then(function () {
      return { ok: true, imageUrl: image, provider: self.name, op: 'enhance', options: options || {} };
    });
  };
  MockAIPhotoRestorationProvider.prototype.denoise = function (image, options) {
    var self = this;
    return self._delay().then(function () {
      return { ok: true, imageUrl: image, provider: self.name, op: 'denoise', options: options || {} };
    });
  };
  MockAIPhotoRestorationProvider.prototype.deblur = function (image, options) {
    var self = this;
    return self._delay().then(function () {
      return { ok: true, imageUrl: image, provider: self.name, op: 'deblur', options: options || {} };
    });
  };
  MockAIPhotoRestorationProvider.prototype.derain = function (image, options) {
    var self = this;
    return self._delay().then(function () {
      return { ok: true, imageUrl: image, provider: self.name, op: 'derain', options: options || {} };
    });
  };
  MockAIPhotoRestorationProvider.prototype.removeBackground = function (image, options) {
    var self = this;
    return self._delay().then(function () {
      return { ok: true, imageUrl: image, provider: self.name, op: 'removeBackground', options: options || {} };
    });
  };

  /** On-device ISNet cutout (Rembg-class privacy; ruanyf/weekly RMBG pattern). */
  function BrowserRembgProvider() {
    this.name = 'browser-rembg';
  }
  BrowserRembgProvider.prototype.removeBackground = function (image, options) {
    var rembg = global.MCPrlRembg;
    if (!rembg || typeof rembg.processUrl !== 'function') {
      return Promise.resolve({ ok: false, message: prlT('rembgUnavailable'), provider: this.name });
    }
    return rembg.processUrl(image, {
      mode: 'transparent',
      onProgress: options && options.onProgress,
      fileName: options && options.fileName
    });
  };
  BrowserRembgProvider.prototype.whiteBackground = function (image, options) {
    var rembg = global.MCPrlRembg;
    if (!rembg || typeof rembg.processUrl !== 'function') {
      return Promise.resolve({ ok: false, message: prlT('rembgUnavailable'), provider: this.name });
    }
    return rembg.processUrl(image, {
      mode: 'white',
      onProgress: options && options.onProgress,
      fileName: options && options.fileName
    });
  };

  var RMBG_UI_OPS = { removeBackground: true, whiteBg: true, transparentBg: true };
  var ENHANCE_UI_OPS = {
    enhance: true,
    denoise: true,
    deblur: true,
    glare: true,
    dust: true,
    jpeg: true,
    correctColor: true,
    grade: true,
    derain: true,
    clarity: true,
    dehaze: true,
    archive: true,
    exposure: true,
    sharpen: true,
    whiteBalance: true,
    vignette: true,
    castRemove: true,
    quickEdit: true,
    specimen: true,
    exportImage: true
  };
  var CANVAS_UI_OPS = { autoCrop: true, borderClean: true, padWhite: true };
  var TRANSFORM_UI_OPS = { rotate90: true, flipH: true, flipV: true };
  var GRADE_STORAGE_KEY = 'mcurator_prl_grade_params_v1';
  var UPSCALE_UI_OPS = { upscale: true, up4: true };
  var BROWSER_REAL_OPS = {};
  Object.keys(RMBG_UI_OPS).forEach(function (k) {
    BROWSER_REAL_OPS[k] = true;
  });
  Object.keys(ENHANCE_UI_OPS).forEach(function (k) {
    BROWSER_REAL_OPS[k] = true;
  });
  Object.keys(CANVAS_UI_OPS).forEach(function (k) {
    BROWSER_REAL_OPS[k] = true;
  });
  Object.keys(UPSCALE_UI_OPS).forEach(function (k) {
    BROWSER_REAL_OPS[k] = true;
  });

  function defaultGradeParams_() {
    if (global.MCPrlEnhancePro && global.MCPrlEnhancePro.DEFAULT_GRADE) {
      var d = global.MCPrlEnhancePro.DEFAULT_GRADE;
      return {
        temperature: d.temperature,
        tint: d.tint,
        saturation: d.saturation,
        contrast: d.contrast,
        vibrance: d.vibrance,
        shadows: d.shadows,
        highlights: d.highlights
      };
    }
    return {
      temperature: 0,
      tint: 0,
      saturation: 0,
      contrast: 0,
      vibrance: 0,
      shadows: 0,
      highlights: 0
    };
  }

  function readGradeParams_() {
    try {
      var raw = localStorage.getItem(GRADE_STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        return Object.assign(defaultGradeParams_(), parsed || {});
      }
    } catch (eG) {
      void 0;
    }
    return defaultGradeParams_();
  }

  function writeGradeParams_(params) {
    try {
      localStorage.setItem(GRADE_STORAGE_KEY, JSON.stringify(params || {}));
    } catch (eW) {
      void 0;
    }
  }

  function enhanceModeFromUiOp_(uiOp) {
    if (uiOp === 'grade') return 'grade';
    if (uiOp === 'glare') return 'glare';
    if (uiOp === 'correctColor') return 'correctColor';
    if (uiOp === 'derain') return 'derain';
    if (uiOp === 'dust') return 'dust';
    if (uiOp === 'jpeg') return 'jpeg';
    if (uiOp === 'denoise') return 'denoise';
    if (uiOp === 'deblur') return 'deblur';
    if (uiOp === 'clarity') return 'clarity';
    if (uiOp === 'dehaze') return 'dehaze';
    if (uiOp === 'archive') return 'archive';
    if (uiOp === 'exposure') return 'exposure';
    if (uiOp === 'sharpen') return 'sharpen';
    if (uiOp === 'whiteBalance') return 'whiteBalance';
    if (uiOp === 'vignette') return 'vignette';
    if (uiOp === 'castRemove') return 'castRemove';
    if (uiOp === 'quickEdit') return 'quickEdit';
    if (uiOp === 'specimen') return 'specimen';
    if (uiOp === 'exportImage') return 'exportPrep';
    return 'enhance';
  }

  function canvasOpFromUi_(uiOp) {
    if (uiOp === 'borderClean') return 'borderClean';
    if (uiOp === 'padWhite') return 'padWhite';
    return 'autoCrop';
  }

  function enhanceProgressLabel_(uiOp) {
    if (uiOp === 'glare') return prlT('glareProcessing');
    if (uiOp === 'grade') return prlT('gradeProcessing');
    if (uiOp === 'correctColor') return prlT('colorProcessing');
    if (uiOp === 'derain') return prlT('derainProcessing');
    if (uiOp === 'dust') return prlT('dustProcessing');
    if (uiOp === 'clarity') return prlT('clarityProcessing');
    if (uiOp === 'dehaze') return prlT('dehazeProcessing');
    if (uiOp === 'archive') return prlT('archiveProcessing');
    if (uiOp === 'exposure') return prlT('exposureProcessing');
    if (uiOp === 'sharpen') return prlT('sharpenProcessing');
    if (uiOp === 'whiteBalance') return prlT('whiteBalanceProcessing');
    if (uiOp === 'vignette') return prlT('vignetteProcessing');
    if (uiOp === 'castRemove') return prlT('castRemoveProcessing');
    if (uiOp === 'quickEdit') return prlT('quickEditProcessing');
    if (uiOp === 'autoCrop' || uiOp === 'borderClean' || uiOp === 'padWhite') return prlT('canvasProcessing');
    if (uiOp === 'exportImage') return prlT('exportPrepProcessing');
    return prlT('enhanceProcessing');
  }

  function ossStatusText_(key) {
    var st = (state.ossStatus && state.ossStatus[key]) || 'unknown';
    if (st === 'ready') return prlT('ossReady');
    if (st === 'loading') return prlT('ossLoading');
    if (st === 'canvas') return prlT('ossCanvasFallback');
    if (st === 'offline') return prlT('ossOffline');
    if (st === 'error' || st === 'missing') return prlT('ossError');
    return prlT('ossUnknown');
  }

  function renderOssStatusPanel_() {
    var rows = [
      ['rembg', prlT('ossRembgLabel')],
      ['enhance', prlT('ossEnhanceLabel')],
      ['upscale', prlT('ossUpscaleLabel')],
      ['inpaint', prlT('ossInpaintLabel')]
    ];
    return (
      '<div class="mc-prl-panel mc-prl-panel--nested">' +
      '<div class="mc-prl-panel__title">' +
      esc(prlT('ossStatusTitle')) +
      '</div>' +
      '<ul class="mc-prl-oss-status">' +
      rows
        .map(function (row) {
          var key = row[0];
          var st = (state.ossStatus && state.ossStatus[key]) || 'unknown';
          var cls =
            st === 'ready'
              ? 'mc-prl-oss-status__dot--ok'
              : st === 'loading'
                ? 'mc-prl-oss-status__dot--load'
                : st === 'canvas'
                  ? 'mc-prl-oss-status__dot--warn'
                  : 'mc-prl-oss-status__dot--bad';
          return (
            '<li class="mc-prl-oss-status__row">' +
            '<span class="mc-prl-oss-status__dot ' +
            cls +
            '" aria-hidden="true"></span>' +
            '<span class="mc-prl-oss-status__name">' +
            esc(row[1]) +
            '</span>' +
            '<span class="mc-prl-oss-status__state">' +
            esc(ossStatusText_(key)) +
            '</span></li>'
          );
        })
        .join('') +
      '</ul>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--secondary mc-prl-btn--block" data-action="refresh-oss">' +
      esc(prlT('ossRefreshBtn')) +
      '</button>' +
      '<p class="mc-prl-small">' +
      esc(prlT('ossStatusHint')) +
      '</p></div>'
    );
  }

  function refreshOssHealth_() {
    if (global.MCPrlOssHealth && typeof global.MCPrlOssHealth.preloadAll === 'function') {
      return global.MCPrlOssHealth.preloadAll().then(function (st) {
        state.ossStatus = st || state.ossStatus;
        if (st && st.inpaint === 'ready') state.localInpaintStatus = 'online';
        else if (st && st.inpaint === 'offline') state.localInpaintStatus = 'offline';
        render();
        return st;
      });
    }
    state.ossStatus.enhance = global.MCPrlEnhancePro ? 'ready' : 'missing';
    state.ossStatus.rembg = global.MCPrlRembg ? 'loading' : 'missing';
    state.ossStatus.upscale = global.MCPrlUpscale ? 'ready' : 'missing';
    return refreshLocalInpaintStatus_().then(function () {
      render();
    });
  }

  function shouldUseCanvasOp_(uiOp) {
    return !!CANVAS_UI_OPS[uiOp] && !!(global.MCPrlCanvas && typeof global.MCPrlCanvas.processUrl === 'function');
  }

  function shouldUseBrowserReal_(uiOp) {
    if (!BROWSER_REAL_OPS[uiOp]) return false;
    if (CANVAS_UI_OPS[uiOp]) return shouldUseCanvasOp_(uiOp);
    if (RMBG_UI_OPS[uiOp]) {
      return !!(global.MCPrlRembg && typeof global.MCPrlRembg.processUrl === 'function');
    }
    if (ENHANCE_UI_OPS[uiOp]) {
      return !!(global.MCPrlEnhancePro && typeof global.MCPrlEnhancePro.processUrl === 'function');
    }
    if (UPSCALE_UI_OPS[uiOp]) {
      return !!(global.MCPrlUpscale && typeof global.MCPrlUpscale.processUrl === 'function');
    }
    return false;
  }

  function runBrowserRealOp_(uiOp, imageUrl, params) {
    params = params || {};
    if (RMBG_UI_OPS[uiOp]) {
      var rembg = adapters.browserRembg;
      if (uiOp === 'whiteBg') return rembg.whiteBackground(imageUrl, params);
      return rembg.removeBackground(imageUrl, params);
    }
    if (ENHANCE_UI_OPS[uiOp]) {
      return global.MCPrlEnhancePro.processUrl(
        imageUrl,
        enhanceModeFromUiOp_(uiOp),
        params.strength != null ? params.strength : state.strength,
        { gradeParams: state.gradeParams }
      );
    }
    if (UPSCALE_UI_OPS[uiOp]) {
      return global.MCPrlUpscale.processUrl(imageUrl, {
        scale: uiOp === 'up4' ? 4 : 2,
        onProgress: params.onProgress
      });
    }
    if (CANVAS_UI_OPS[uiOp]) {
      return global.MCPrlCanvas.processUrl(imageUrl, canvasOpFromUi_(uiOp), {
        fillWhite: uiOp === 'autoCrop' || uiOp === 'borderClean',
        padPct: uiOp === 'padWhite' ? 0.1 : undefined
      });
    }
    return Promise.resolve({ ok: false, message: 'unsupported op' });
  }
  MockAIPhotoRestorationProvider.prototype.inpaint = function (image, mask, options) {
    var self = this;
    return self._delay(800).then(function () {
      return {
        ok: true,
        imageUrl: image,
        provider: self.name,
        op: 'inpaint',
        options: options || {},
        note: prlT('demoPixelsNote')
      };
    });
  };
  MockAIPhotoRestorationProvider.prototype.upscale = function (image, options) {
    var self = this;
    return self._delay().then(function () {
      return { ok: true, imageUrl: image, provider: self.name, op: 'upscale', options: options || {} };
    });
  };
  MockAIPhotoRestorationProvider.prototype.correctColor = function (image, options) {
    var self = this;
    return self._delay().then(function () {
      return { ok: true, imageUrl: image, provider: self.name, op: 'correctColor', options: options || {} };
    });
  };
  MockAIPhotoRestorationProvider.prototype.exportImage = function (image, options) {
    var self = this;
    return self._delay(200).then(function () {
      return { ok: true, imageUrl: image, provider: self.name, op: 'exportImage', options: options || {} };
    });
  };

  /** Stubs inherit mock behavior until a real backend is wired. */
  function stubAdapter_(className) {
    var base = new MockAIPhotoRestorationProvider();
    base.name = className;
    base.available = false;
    return base;
  }

  function BrowserRealESRGANProvider() {
    this.name = 'browser-esrgan';
  }
  BrowserRealESRGANProvider.prototype.upscale = function (image, options) {
    if (!global.MCPrlUpscale || typeof global.MCPrlUpscale.processUrl !== 'function') {
      return Promise.resolve({ ok: false, message: prlT('upscaleUnavailable'), provider: this.name });
    }
    var ui = options && options.uiOp === 'up4' ? 'up4' : 'upscale';
    return global.MCPrlUpscale.processUrl(image, {
      scale: ui === 'up4' ? 4 : 2,
      onProgress: options && options.onProgress
    });
  };

  function LocalInpaintProvider(modelName, name) {
    this.modelName = modelName || null;
    this.name = name || 'local-iopaint';
    this.available = true;
  }
  LocalInpaintProvider.prototype.inpaint = function (image, mask, options) {
    var api = global.MCPrlLocalInpaint;
    if (!api || typeof api.inpaint !== 'function') {
      return Promise.resolve({
        ok: false,
        message: prlT('iopaintUnavailable'),
        provider: this.name
      });
    }
    return api.inpaint(image, mask, {
      model: this.modelName,
      onProgress: options && options.onProgress
    });
  };

  var adapters = {
    mock: new MockAIPhotoRestorationProvider(),
    browserRembg: new BrowserRembgProvider(),
    browserOss: new BrowserRembgProvider(),
    realESRGAN: new BrowserRealESRGANProvider(),
    restormer: stubAdapter_('RestormerAdapter'),
    ioPaint: new LocalInpaintProvider(null, 'local-iopaint'),
    localLama: new LocalInpaintProvider('lama', 'local-lama'),
    browserInpaint: stubAdapter_('BrowserInpaintAdapter'),
    comfyUI: stubAdapter_('ComfyUIAdapter')
  };

  function getActiveProvider() {
    var id = state.providerId || 'mock';
    return adapters[id] || adapters.mock;
  }

  function shouldUseBrowserRembg_(uiOp) {
    return !!RMBG_UI_OPS[uiOp] && !!(global.MCPrlRembg && typeof global.MCPrlRembg.processUrl === 'function');
  }

  function shouldUseLocalInpaint_(uiOp) {
    if (uiOp !== 'inpaint') return false;
    if (!global.MCPrlLocalInpaint || typeof global.MCPrlLocalInpaint.inpaint !== 'function') {
      return false;
    }
    if (state.providerId === 'ioPaint' || state.providerId === 'localLama') return true;
    return state.localInpaintStatus === 'online';
  }

  function browserModuleMissingMessage_(uiOp) {
    if (RMBG_UI_OPS[uiOp] && !global.MCPrlRembg) return prlT('rembgUnavailable');
    if (CANVAS_UI_OPS[uiOp] && !global.MCPrlCanvas) return prlT('canvasUnavailable');
    if (ENHANCE_UI_OPS[uiOp] && !global.MCPrlEnhancePro) return prlT('enhanceUnavailable');
    if (UPSCALE_UI_OPS[uiOp] && !global.MCPrlUpscale) return prlT('upscaleUnavailable');
    return prlT('moduleMissing');
  }

  function getCompareBaselineUrl_() {
    return state.project.baselineImageUrl || state.project.sourceImageUrl || '';
  }

  function setBaselineIfEmpty_(url) {
    if (!state.project.baselineImageUrl && url) state.project.baselineImageUrl = url;
  }

  function getLocalInpaintProvider_() {
    if (state.providerId === 'localLama') return adapters.localLama;
    return adapters.ioPaint;
  }

  function refreshLocalInpaintStatus_() {
    var api = global.MCPrlLocalInpaint;
    if (!api || typeof api.ping !== 'function') {
      state.localInpaintStatus = 'offline';
      return Promise.resolve();
    }
    return api.ping().then(function (r) {
      state.localInpaintStatus = r && r.ok ? 'online' : 'offline';
      state.iopaintCurrentModel = (r && r.currentModel) || '';
      render();
    });
  }

  function revokeBlobUrlIfNeeded_(url) {
    if (url && String(url).indexOf('blob:') === 0) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
    }
  }

  function isUrlReferenced_(url) {
    if (!url) return false;
    if (url === state.project.baselineImageUrl) return true;
    var i;
    for (i = 0; i < state.project.versions.length; i++) {
      if (state.project.versions[i].imageUrl === url) return true;
    }
    for (i = 0; i < state.batchQueue.length; i++) {
      if (state.batchQueue[i].resultUrl === url) return true;
    }
    return false;
  }

  function safeRevokeBlob_(url) {
    if (!url || isUrlReferenced_(url)) return;
    revokeBlobUrlIfNeeded_(url);
  }

  function applyResultImage_(newUrl, uiOp) {
    var prev = state.project.sourceImageUrl;
    if (prev && prev !== newUrl) safeRevokeBlob_(prev);
    state.project.sourceImageUrl = newUrl;
    state.showCheckerboard = uiOp === 'removeBackground' || uiOp === 'transparentBg';
    if (state.showCheckerboard) state.project.imageBgMode = 'transparent';
    if (uiOp === 'whiteBg') {
      state.showCheckerboard = false;
      state.project.imageBgMode = 'white';
    }
    if (uiOp === 'upscale' || uiOp === 'up4') {
      state.zoom = 1;
      state.panX = 0;
      state.panY = 0;
    }
  }

  var state = {
    project: defaultProject(),
    providerId: 'browserOss',
    strength: 58,
    compare: 0.5,
    splitView: false,
    zoom: 1,
    panX: 0,
    panY: 0,
    tool: 'pan',
    brushSize: 28,
    maskOpacity: 0.45,
    processing: false,
    progress: 0,
    progressLabel: '',
    toast: '',
    exportModal: false,
    mobileSheet: false,
    inpaintAck: false,
    showCheckerboard: false,
    autoCapturePipeline: true,
    autoRunPreset: false,
    imageMeta: { w: 0, h: 0 },
    undoStack: [],
    redoStack: [],
    batchQueue: [],
    activeVersionId: '',
    lastError: '',
    iopaintBaseUrl: '',
    localInpaintStatus: 'unknown',
    iopaintCurrentModel: '',
    gradeParams: defaultGradeParams_(),
    ossStatus: { rembg: 'unknown', enhance: 'unknown', upscale: 'unknown', inpaint: 'unknown' }
  };

  function pushUndoMask_() {
    var c = document.getElementById('mcPrlMaskCanvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    try {
      var snap = ctx.getImageData(0, 0, c.width, c.height);
      state.undoStack.push(snap);
      if (state.undoStack.length > 24) state.undoStack.shift();
      state.redoStack.length = 0;
    } catch (e) {}
  }

  function restoreMaskImageData_(imgData) {
    var c = document.getElementById('mcPrlMaskCanvas');
    if (!c || !imgData) return;
    var ctx = c.getContext('2d');
    ctx.putImageData(imgData, 0, 0);
  }

  function toastMsg(msg) {
    state.toast = msg;
    render();
    setTimeout(function () {
      state.toast = '';
      render();
    }, 2400);
  }

  function appendIntegrityLog_(entry) {
    state.project.log.push(
      logEntry(entry.type, entry.parameters, entry.provider, state.project.safeMode, entry.affectedArea, entry.extra)
    );
    state.project.updatedAt = nowIso();
  }

  function resizeMaskToImage_() {
    var img = document.getElementById('mcPrlSourceImg');
    var c = document.getElementById('mcPrlMaskCanvas');
    if (!img || !c || !img.naturalWidth) return;
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    var ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, c.width, c.height);
  }

  function runProviderOp_(methodName, params) {
    if (state.processing) return;
    if (!state.project.sourceImageUrl) {
      toastMsg(prlT('toastNeedUpload'));
      return;
    }
    if (methodName === 'inpaint' && state.project.safeMode && !state.inpaintAck) {
      toastMsg(prlT('toastNeedInpaintAck'));
      return;
    }
    var uiOp = methodName;
    var useBrowserReal = shouldUseBrowserReal_(uiOp);
    var useLocalInpaint = shouldUseLocalInpaint_(uiOp);
    if (BROWSER_REAL_OPS[uiOp] && !useBrowserReal && uiOp !== 'inpaint') {
      toastMsg(browserModuleMissingMessage_(uiOp));
      return;
    }
    if (uiOp === 'inpaint' && !useLocalInpaint) {
      if (state.providerId === 'ioPaint' || state.providerId === 'localLama') {
        toastMsg(prlT('iopaintUnavailable'));
        return;
      }
      if (state.providerId === 'browserOss' || state.providerId === 'browserRembg') {
        toastMsg(prlT('inpaintNeedServer'));
        return;
      }
    }
    var methodMap = {
      glare: 'correctColor',
      dust: 'denoise',
      jpeg: 'denoise',
      up4: 'upscale',
      whiteBg: 'removeBackground',
      transparentBg: 'removeBackground'
    };
    methodName = methodMap[methodName] || methodName;
    state.progressLabel = useLocalInpaint
      ? prlT('inpaintProcessing')
      : useBrowserReal
        ? RMBG_UI_OPS[uiOp]
          ? prlT('rembgProcessing')
        : UPSCALE_UI_OPS[uiOp]
          ? prlT('upscaleProcessing')
          : ENHANCE_UI_OPS[uiOp]
            ? enhanceProgressLabel_(uiOp)
            : prlT('enhanceProcessing')
      : prlOpLabelZh(uiOp) + '…';
    var prov = useBrowserReal ? adapters.browserRembg : useLocalInpaint ? getLocalInpaintProvider_() : getActiveProvider();
    if (
      !useBrowserReal &&
      !useLocalInpaint &&
      state.providerId === 'mock'
    ) {
      prov = adapters.mock;
    } else if (
      !useBrowserReal &&
      !useLocalInpaint &&
      (state.providerId === 'browserRembg' || state.providerId === 'browserOss') &&
      BROWSER_REAL_OPS[uiOp]
    ) {
      toastMsg(browserModuleMissingMessage_(uiOp));
      return;
    }
    if (useBrowserReal) {
      /* routed via runBrowserRealOp_ */
    } else if (useLocalInpaint) {
      /* routed via LocalInpaintProvider */
    } else if (!prov[methodName]) {
      toastMsg(prlT('toastProviderUnsupported') + methodName);
      return;
    }
    state.processing = true;
    state.progress = 5;
    render();
    var tick = setInterval(function () {
      if (state.progress < 92) {
        state.progress += useBrowserReal || useLocalInpaint ? 4 : Math.random() * 12;
        var el = document.getElementById('mcPrlProgressBar');
        if (el) el.style.width = Math.min(95, state.progress) + '%';
      }
    }, useBrowserReal || useLocalInpaint ? 320 : 180);
    var img = state.project.sourceImageUrl;
    var maskCanvas = document.getElementById('mcPrlMaskCanvas');
    var maskData = null;
    if (methodName === 'inpaint' && maskCanvas) {
      try {
        maskData = maskCanvas.toDataURL('image/png');
      } catch (e) {
        maskData = null;
      }
    }
    var browserProgress = useBrowserReal
      ? function (p) {
          if (!p) return;
          if (p.inner && p.inner.total) {
            var pct = Math.round((p.inner.current / p.inner.total) * 88) + 5;
            state.progress = pct;
          } else if (p.total) {
            state.progress = Math.round((p.current / p.total) * 88) + 5;
          }
          var bar = document.getElementById('mcPrlProgressBar');
          if (bar) bar.style.width = state.progress + '%';
        }
      : null;
    var callParams = Object.assign(
      {
        onProgress: browserProgress,
        fileName: state.project.originalFileName,
        uiOp: uiOp,
        strength: state.strength
      },
      params || {}
    );
    Promise.resolve()
      .then(function () {
        if (methodName === 'inpaint' && (useLocalInpaint || prov.inpaint)) {
          return prov.inpaint(img, maskData, callParams);
        }
        if (useBrowserReal) return runBrowserRealOp_(uiOp, img, callParams);
        return prov[methodName](img, callParams);
      })
      .then(function (res) {
        clearInterval(tick);
        state.progress = 100;
        state.progressLabel = res && res.ok ? prlT('progressDone') : prlT('progressError');
        if (!res || !res.ok) {
          state.lastError = (res && res.message) || prlT('rembgFailed');
          var failMsg =
            res && res.message === 'empty_mask'
              ? prlT('inpaintEmptyMask')
              : useLocalInpaint
                ? prlT('inpaintFailed')
                : useBrowserReal
                  ? RMBG_UI_OPS[uiOp]
                    ? prlT('rembgFailed')
                    : prlT('opFailed')
                  : state.lastError;
          toastMsg(failMsg + (res && res.message && res.message !== 'empty_mask' ? res.message : ''));
          return;
        }
        var op = {
          id: uid('op'),
          type: uiOp,
          parameters: params || {},
          provider: res.provider || prov.name || 'mock',
          safeMode: state.project.safeMode,
          affectedArea: methodName === 'inpaint' ? 'masked' : 'global_process',
          createdAt: nowIso()
        };
        var verLabel =
          useBrowserReal || useLocalInpaint ? prlOpLabelZh(uiOp) : prlOpLabelZh(uiOp) + prlT('demoSuffix');
        if ((useBrowserReal || useLocalInpaint) && res.imageUrl) applyResultImage_(res.imageUrl, uiOp);
        var ver = defaultVersion(verLabel, res.imageUrl || img, [op]);
        state.project.versions.push(ver);
        state.activeVersionId = ver.id;
        appendIntegrityLog_({
          type: uiOp,
          parameters: params || {},
          provider: op.provider,
          affectedArea: op.affectedArea,
          extra: {
            versionId: ver.id,
            preset: state.project.preset,
            browserReal: useBrowserReal,
            localInpaint: useLocalInpaint
          }
        });
        toastMsg(
          useLocalInpaint
            ? prlT('inpaintDone')
            : useBrowserReal
              ? RMBG_UI_OPS[uiOp]
                ? prlT('rembgDone')
              : UPSCALE_UI_OPS[uiOp]
                ? prlT('upscaleDone') + (res.clamped ? ' ' + prlT('upscaleClamped') : '')
                : uiOp === 'glare'
                  ? prlT('glareDone')
                  : uiOp === 'grade'
                    ? prlT('gradeDone')
                    : uiOp === 'derain'
                      ? prlT('derainDone')
                      : uiOp === 'dust'
                        ? prlT('dustDone')
                        : uiOp === 'clarity'
                          ? prlT('clarityDone')
                          : uiOp === 'dehaze'
                            ? prlT('dehazeDone')
                            : uiOp === 'archive'
                              ? prlT('archiveDone')
                              : uiOp === 'exposure'
                                ? prlT('exposureDone')
                                : uiOp === 'sharpen'
                                  ? prlT('sharpenDone')
                                  : uiOp === 'whiteBalance'
                                    ? prlT('whiteBalanceDone')
                                    : uiOp === 'vignette'
                                      ? prlT('vignetteDone')
                                      : uiOp === 'castRemove'
                                        ? prlT('castRemoveDone')
                                        : uiOp === 'quickEdit'
                                          ? prlT('quickEditDone')
                                          : uiOp === 'padWhite'
                                          ? prlT('padWhiteDone')
                                          : uiOp === 'autoCrop'
                                        ? prlT('autoCropDone')
                                        : uiOp === 'borderClean'
                                          ? prlT('borderCleanDone')
                                          : uiOp === 'exportImage'
                                            ? prlT('exportPrepDone')
                                            : prlT('enhanceDone')
            : prlOpLabelZh(uiOp) + ' ' + prlT('toastDemoComplete')
        );
      })
      .catch(function (e) {
        clearInterval(tick);
        state.lastError = String(e && e.message ? e.message : e);
        toastMsg(state.lastError);
      })
      .finally(function () {
        state.processing = false;
        state.progress = 0;
        state.progressLabel = '';
        render();
      });
  }

  function syncAutoCapturePref_() {
    if (global.MCPrlPipeline && typeof global.MCPrlPipeline.readAutoCapturePipeline === 'function') {
      state.autoCapturePipeline = global.MCPrlPipeline.readAutoCapturePipeline();
    }
  }

  function renderCaptureInputsHtml_(inputId) {
    var id = inputId || 'mcPrlFileCapture';
    var checked = state.autoCapturePipeline ? ' checked' : '';
    return (
      '<label class="mc-prl-capture-hero" for="' +
      esc(id) +
      '">' +
      iconSvg('camera', 22) +
      '<span>' +
      esc(prlT('captureHero')) +
      '</span></label>' +
      '<input type="file" id="' +
      esc(id) +
      '" accept="image/*" capture="environment" hidden />' +
      '<div class="mc-prl-auto-capture">' +
      '<label class="mc-prl-check"><input type="checkbox" data-bind="autoCapture"' +
      checked +
      ' /><span>' +
      esc(prlT('autoCapturePipeline')) +
      '</span></label>' +
      '<span class="mc-prl-small">' +
      esc(prlT('autoCaptureHint')) +
      '</span></div>'
    );
  }

  function runCaptureAutoPipeline_(file) {
    if (state.processing || !file) return;
    var pipe = global.MCPrlPipeline;
    if (!pipe || typeof pipe.runCapturePipeline !== 'function') {
      toastMsg(prlT('rembgUnavailable'));
      loadFiles([file], { skipAuto: true });
      return;
    }
    state.processing = true;
    state.progress = 4;
    state.progressLabel = prlT('capturePipelineRunning');
    try {
      safeRevokeBlob_(state.project.baselineImageUrl);
      state.project.baselineImageUrl = URL.createObjectURL(file);
    } catch (eBase) {
      void 0;
    }
    render();
    if (global.MCPrlRembg && typeof global.MCPrlRembg.needsNormalizeForRembg === 'function') {
      if (global.MCPrlRembg.needsNormalizeForRembg(file, file.name)) {
        toastMsg(prlT('formatConverted'));
      }
    }
    var tick = setInterval(function () {
      if (state.progress < 90) {
        state.progress += 2;
        var el = document.getElementById('mcPrlProgressBar');
        if (el) el.style.width = Math.min(94, state.progress) + '%';
      }
    }, 280);
    pipe
      .runCapturePipeline(file, {
        strength: state.strength,
        onProgress: function (p) {
          if (!p) return;
          if (p.phase === 'rembg' && p.inner && p.inner.total) {
            state.progress = 8 + Math.round((p.inner.current / p.inner.total) * 42);
          } else if (p.phase === 'enhance') {
            state.progress = 58;
          } else if (p.phase === 'done') {
            state.progress = 92;
          }
          state.progressLabel = prlT('capturePipelineRunning');
          var bar = document.getElementById('mcPrlProgressBar');
          if (bar) bar.style.width = state.progress + '%';
        }
      })
      .then(function (res) {
        clearInterval(tick);
        if (!res || !res.ok || !res.imageUrl) {
          toastMsg(prlT('capturePipelineFailed') + (res && res.message ? res.message : ''));
          loadFiles([file], { skipAuto: true });
          return;
        }
        safeRevokeBlob_(state.project.sourceImageUrl);
        state.project.sourceImageUrl = res.imageUrl;
        state.showCheckerboard = false;
        state.project.imageBgMode = 'white';
        var baseUrl = state.project.baselineImageUrl || res.imageUrl;
        state.project.versions = [
          defaultVersion(prlT('originalLabel', 'Original'), baseUrl, []),
          defaultVersion(prlT('captureResultLabel', 'Specimen plate'), res.imageUrl, [
            {
              id: uid('op'),
              type: 'capturePipeline',
              parameters: { strength: state.strength, steps: res.steps || [] },
              provider: res.provider || 'capture-pipeline',
              safeMode: state.project.safeMode,
              affectedArea: 'global_process',
              createdAt: nowIso()
            }
          ])
        ];
        state.activeVersionId = state.project.versions[1].id;
        appendIntegrityLog_({
          type: 'capturePipeline',
          parameters: { strength: state.strength, fileName: file.name },
          provider: 'capture-pipeline',
          affectedArea: 'global_process',
          extra: { steps: res.steps || ['whiteBg', 'enhance'] }
        });
        toastMsg(prlT('capturePipelineDone'));
        setTimeout(function () {
          resizeMaskToImage_();
        }, 80);
      })
      .catch(function (e) {
        clearInterval(tick);
        toastMsg(prlT('capturePipelineFailed') + String(e && e.message ? e.message : e));
        loadFiles([file], { skipAuto: true });
      })
      .finally(function () {
        state.processing = false;
        state.progress = 0;
        state.progressLabel = '';
        render();
      });
  }

  function runArchiveRepair_() {
    if (state.processing) return;
    if (!state.project.sourceImageUrl) {
      toastMsg(prlT('plateStackNeedImage'));
      return;
    }
    runProviderOp_('archive', { quickRepair: true, strength: Math.max(state.strength, 86) });
  }

  function runCanvasTransform_(op) {
    if (state.processing || !state.project.sourceImageUrl) {
      if (!state.project.sourceImageUrl) toastMsg(prlT('toastNeedUpload'));
      return;
    }
    var api = global.MCPrlCanvas;
    if (!api || typeof api.processUrl !== 'function') {
      toastMsg(prlT('canvasUnavailable'));
      return;
    }
    state.processing = true;
    state.progressLabel = prlT('canvasProcessing');
    render();
    api
      .processUrl(state.project.sourceImageUrl, op, { fillWhite: true })
      .then(function (res) {
        if (!res || !res.ok || !res.imageUrl) {
          toastMsg(prlT('opFailed') + (res && res.message ? res.message : ''));
          return;
        }
        applyResultImage_(res.imageUrl, op);
        var ver = defaultVersion(prlOpLabelZh(op), res.imageUrl, [
          {
            id: uid('op'),
            type: op,
            parameters: {},
            provider: res.provider || 'browser-canvas',
            safeMode: state.project.safeMode,
            affectedArea: 'global_process',
            createdAt: nowIso()
          }
        ]);
        state.project.versions.push(ver);
        state.activeVersionId = ver.id;
        toastMsg(prlT('canvasTransformDone'));
        setTimeout(resizeMaskToImage_, 80);
      })
      .finally(function () {
        state.processing = false;
        state.progressLabel = '';
        render();
      });
  }

  function runOpChain_(ops, chainStrength) {
    if (state.processing || !state.project.sourceImageUrl) {
      if (!state.project.sourceImageUrl) toastMsg(prlT('toastNeedUpload'));
      return Promise.resolve();
    }
    var strength = chainStrength != null ? chainStrength : Math.max(state.strength, 84);
    var img = state.project.sourceImageUrl;
    var step = 0;
    state.processing = true;
    state.progressLabel = prlT('presetRunning');
    render();
    function runStep() {
      if (step >= ops.length) {
        state.processing = false;
        state.progressLabel = '';
        toastMsg(prlT('presetRunDone'));
        render();
        return Promise.resolve();
      }
      var op = ops[step];
      step += 1;
      state.progressLabel = prlOpLabelZh(op) + '…';
      render();
      if (!shouldUseBrowserReal_(op)) {
        throw new Error(browserModuleMissingMessage_(op));
      }
      return runBrowserRealOp_(op, img, { strength: strength }).then(function (res) {
        if (!res || !res.ok || !res.imageUrl) {
          throw new Error((res && res.message) || 'chain failed');
        }
        if (img !== res.imageUrl) safeRevokeBlob_(img);
        img = res.imageUrl;
        applyResultImage_(img, op);
        var ver = defaultVersion(prlOpLabelZh(op), img, [
          {
            id: uid('op'),
            type: op,
            parameters: { strength: strength, chain: true },
            provider: res.provider || 'chain',
            safeMode: state.project.safeMode,
            affectedArea: 'global_process',
            createdAt: nowIso()
          }
        ]);
        state.project.versions.push(ver);
        state.activeVersionId = ver.id;
        return runStep();
      });
    }
    return runStep().catch(function (err) {
      toastMsg(prlT('presetRunFailed') + String(err && err.message ? err.message : err));
    }).finally(function () {
      state.processing = false;
      state.progressLabel = '';
      render();
      setTimeout(resizeMaskToImage_, 80);
    });
  }

  function runQuickEdit_() {
    if (!state.project.sourceImageUrl) {
      toastMsg(prlT('toastNeedUpload'));
      return;
    }
    runProviderOp_('quickEdit', { strength: Math.min(state.strength, 58) });
  }

  function runSpecimenIsolate_() {
    runOpChain_(['whiteBg', 'autoCrop', 'specimen'], Math.min(state.strength, 76));
  }

  function runFieldRescueQuick_() {
    runOpChain_(['dehaze', 'whiteBalance', 'exposure', 'denoise'], Math.max(state.strength, 84));
  }

  function runFossilEnhanceQuick_() {
    runOpChain_(['castRemove', 'clarity', 'glare', 'sharpen', 'upscale'], Math.max(state.strength, 84));
  }

  function saveVersionSnapshot_() {
    if (!state.project.sourceImageUrl) {
      toastMsg(prlT('toastNeedUpload'));
      return;
    }
    var api = global.MCPrlCanvas;
    if (!api || typeof api.blobFromUrl !== 'function') {
      var ver0 = defaultVersion(prlT('snapshotLabel'), state.project.sourceImageUrl, []);
      state.project.versions.push(ver0);
      state.activeVersionId = ver0.id;
      toastMsg(prlT('snapshotSaved'));
      render();
      return;
    }
    api
      .blobFromUrl(state.project.sourceImageUrl)
      .then(function (blob) {
        var snapUrl = URL.createObjectURL(blob);
        var ver = defaultVersion(prlT('snapshotLabel'), snapUrl, [
          {
            id: uid('op'),
            type: 'snapshot',
            parameters: {},
            provider: 'local',
            safeMode: state.project.safeMode,
            affectedArea: 'none',
            createdAt: nowIso()
          }
        ]);
        state.project.versions.push(ver);
        state.activeVersionId = ver.id;
        toastMsg(prlT('snapshotSaved'));
        render();
      })
      .catch(function () {
        toastMsg(prlT('snapshotFailed'));
      });
  }

  function downloadAllBatch_() {
    var done = state.batchQueue.filter(function (r) {
      return r.status === 'done' && r.resultUrl;
    });
    if (!done.length) {
      toastMsg(prlT('toastBatchEmpty'));
      return;
    }
    if (!global.MCPrlCanvas || typeof global.MCPrlCanvas.downloadExport !== 'function') {
      toastMsg(prlT('canvasUnavailable'));
      return;
    }
    done.forEach(function (row, i) {
      setTimeout(function () {
        var baseName = (row.fileName || 'batch').replace(/\.[^.]+$/, '');
        global.MCPrlCanvas.downloadExport(row.resultUrl, 'jpg', 'batch-' + baseName);
      }, i * 450);
    });
    toastMsg(prlT('batchDownloadAllStarted') + done.length + prlT('batchDownloadAllSuffix'));
  }

  function syncAutoRunPresetPref_() {
    try {
      var v = localStorage.getItem('mcurator_prl_auto_run_preset_v1');
      state.autoRunPreset = v === '1';
    } catch (eAr) {
      void 0;
    }
  }

  function runPresetPipeline_() {
    if (!state.project.preset) {
      toastMsg(prlT('toastPickPreset'));
      return;
    }
    if (!state.project.sourceImageUrl) {
      toastMsg(prlT('toastNeedUpload'));
      return;
    }
    var id = state.project.preset;
    if (id === 'passport_cleanup') {
      runPlateStack_({ upscale: true });
      return;
    }
    if (id === 'fossil_slab') {
      runOpChain_(['clarity', 'glare', 'sharpen']);
      return;
    }
    if (id === 'field_rescue') {
      runOpChain_(['dehaze', 'whiteBalance', 'exposure', 'denoise']);
      return;
    }
    if (id === 'low_light_archive' || id === 'batch_archive') {
      runArchiveRepair_();
      return;
    }
    if (id === 'safe_inpaint') {
      toastMsg(prlT('presetInpaintHint'));
      return;
    }
    toastMsg(prlT('toastPresetSelected'));
  }

  function resetToOriginal_() {
    var base = state.project.baselineImageUrl;
    if (!base) {
      toastMsg(prlT('toastNoBaseline'));
      return;
    }
    if (state.project.sourceImageUrl !== base) safeRevokeBlob_(state.project.sourceImageUrl);
    state.project.sourceImageUrl = base;
    state.showCheckerboard = false;
    state.compare = 0.5;
    toastMsg(prlT('toastResetOriginal'));
    render();
    setTimeout(resizeMaskToImage_, 80);
  }

  function applyVersionById_(versionId) {
    var ver = null;
    for (var i = 0; i < state.project.versions.length; i++) {
      if (state.project.versions[i].id === versionId) {
        ver = state.project.versions[i];
        break;
      }
    }
    if (!ver || !ver.imageUrl) return;
    state.activeVersionId = versionId;
    if (state.project.sourceImageUrl !== ver.imageUrl) {
      applyResultImage_(ver.imageUrl, 'version');
    }
    render();
    setTimeout(resizeMaskToImage_, 80);
  }

  function runPlateStack_(opts) {
    opts = opts || {};
    if (state.processing) return;
    if (!state.project.sourceImageUrl) {
      toastMsg(prlT('plateStackNeedImage'));
      return;
    }
    var stack = global.MCPrlPlateStack;
    if (!stack || typeof stack.run !== 'function') {
      toastMsg(prlT('rembgUnavailable'));
      return;
    }
    state.processing = true;
    state.progress = 6;
    state.progressLabel = prlT('plateStackRunning');
    render();
    var tick = setInterval(function () {
      if (state.progress < 88) {
        state.progress += 2;
        var el = document.getElementById('mcPrlProgressBar');
        if (el) el.style.width = Math.min(92, state.progress) + '%';
      }
    }, 320);
    stack
      .run(state.project.sourceImageUrl, {
        strength: state.strength,
        upscale: opts.upscale !== false,
        fileName: state.project.originalFileName,
        onProgress: function (p) {
          if (!p) return;
          if (p.phase === 'rembg' && p.inner && p.inner.total) {
            state.progress = 10 + Math.round((p.inner.current / p.inner.total) * 28);
          } else if (p.phase === 'enhance') {
            state.progress = 48;
          } else if (p.phase === 'upscale') {
            state.progress = 72;
          } else if (p.phase === 'done') {
            state.progress = 90;
          }
          state.progressLabel = prlT('plateStackRunning');
          var bar = document.getElementById('mcPrlProgressBar');
          if (bar) bar.style.width = state.progress + '%';
        }
      })
      .then(function (res) {
        clearInterval(tick);
        if (!res || !res.ok || !res.imageUrl) {
          toastMsg(prlT('plateStackFailed') + (res && res.message ? res.message : ''));
          return;
        }
        applyResultImage_(res.imageUrl, 'whiteBg');
        state.showCheckerboard = false;
        state.project.imageBgMode = 'white';
        var op = {
          id: uid('op'),
          type: 'plateStack',
          parameters: { strength: state.strength, steps: res.steps || [] },
          provider: res.provider || 'plate-stack',
          safeMode: state.project.safeMode,
          affectedArea: 'global_process',
          createdAt: nowIso()
        };
        var ver = defaultVersion(prlT('captureResultLabel'), res.imageUrl, [op]);
        state.project.versions.push(ver);
        state.activeVersionId = ver.id;
        appendIntegrityLog_({
          type: 'plateStack',
          parameters: { strength: state.strength },
          provider: res.provider || 'plate-stack',
          affectedArea: 'global_process',
          extra: { steps: res.steps || [], note: res.note || '' }
        });
        toastMsg(prlT('plateStackDone'));
        setTimeout(function () {
          resizeMaskToImage_();
        }, 80);
      })
      .catch(function (e) {
        clearInterval(tick);
        toastMsg(prlT('plateStackFailed') + String(e && e.message ? e.message : e));
      })
      .finally(function () {
        state.processing = false;
        state.progress = 0;
        state.progressLabel = '';
        render();
      });
  }

  function blobFromUrlForPrl_(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('fetch failed');
      return r.blob();
    });
  }

  function applyPreset(id) {
    state.project.preset = id;
    var p = getPresets_().find(function (x) {
      return x.id === id;
    });
    if (p && p.warnInpaint) {
      state.inpaintAck = false;
      toastMsg(prlT('toastInpaintSafety'));
    }
    if (id === 'passport_cleanup') {
      toastMsg(prlT('presetPassportHint'));
    }
    state.project.updatedAt = nowIso();
    render();
  }

  function loadFiles(files, opts) {
    opts = opts || {};
    if (!files || !files.length) return;
    var f = files[0];
    if (
      !opts.skipAuto &&
      state.autoCapturePipeline &&
      global.MCPrlPipeline &&
      typeof global.MCPrlPipeline.runCapturePipeline === 'function'
    ) {
      state.project.originalFileName = f.name;
      state.project.title = (f.name || '').replace(/\.[^.]+$/, '') || state.project.title;
      state.project.preset = state.project.preset || 'passport_cleanup';
      appendIntegrityLog_({
        type: opts.fromCapture ? 'capture' : 'upload',
        parameters: { fileName: f.name, size: f.size, autoPipeline: true },
        provider: 'local',
        affectedArea: 'none',
        extra: {}
      });
      runCaptureAutoPipeline_(f);
      return;
    }
    var url = URL.createObjectURL(f);
    var vi;
    for (vi = 0; vi < state.project.versions.length; vi++) {
      safeRevokeBlob_(state.project.versions[vi].imageUrl);
    }
    safeRevokeBlob_(state.project.sourceImageUrl);
    safeRevokeBlob_(state.project.baselineImageUrl);
    state.project.sourceImageUrl = url;
    state.project.baselineImageUrl = url;
    state.project.originalFileName = f.name;
    state.project.title = f.name.replace(/\.[^.]+$/, '') || state.project.title;
    state.project.versions = [defaultVersion(prlT('originalLabel', 'Original'), url, [])];
    state.activeVersionId = state.project.versions[0].id;
    state.showCheckerboard = false;
    state.undoStack = [];
    state.redoStack = [];
    appendIntegrityLog_({
      type: 'upload',
      parameters: { fileName: f.name, size: f.size },
      provider: 'local',
      affectedArea: 'none',
      extra: {}
    });
    render();
    setTimeout(function () {
      resizeMaskToImage_();
    }, 80);
    if (state.autoRunPreset && state.project.preset) {
      setTimeout(function () {
        runPresetPipeline_();
      }, 200);
    }
  }

  function loadBatch(files) {
    if (!files || !files.length) return;
    Array.prototype.forEach.call(files, function (f) {
      state.batchQueue.push({
        id: uid('bq'),
        fileName: f.name,
        status: 'queued',
        progress: 0,
        file: f,
        resultUrl: ''
      });
    });
    toastMsg(prlT('toastBatchAdded') + files.length + prlT('toastBatchAddedSuffix'));
    render();
  }

  function processBatchReal_() {
    if (!state.batchQueue.length) {
      toastMsg(prlT('toastBatchEmpty'));
      return;
    }
    var pipe = global.MCPrlPipeline;
    var enhance = global.MCPrlEnhancePro;
    if (!pipe || !enhance) {
      toastMsg(prlT('enhanceUnavailable'));
      return;
    }
    if (state.processing) return;
    state.processing = true;
    state.progressLabel = prlT('batchRunning');
    var strength = Math.max(state.strength, 82);
    var idx = 0;
    function next() {
      while (idx < state.batchQueue.length && state.batchQueue[idx].status === 'done') idx += 1;
      if (idx >= state.batchQueue.length) {
        state.processing = false;
        state.progressLabel = '';
        toastMsg(prlT('toastBatchDone'));
        render();
        return Promise.resolve();
      }
      var row = state.batchQueue[idx];
      idx += 1;
      row.status = 'processing';
      row.progress = 10;
      render();
      if (!row.file) {
        row.status = 'error';
        return next();
      }
      return pipe
        .runCapturePipeline(row.file, { strength: strength })
        .then(function (res) {
          if (!res || !res.ok || !res.imageUrl) {
            row.status = 'error';
            return next();
          }
          row.status = 'done';
          row.progress = 100;
          row.resultUrl = res.imageUrl;
          return next();
        })
        .catch(function () {
          row.status = 'error';
          return next();
        });
    }
    return next();
  }

  function exportJsonLog() {
    var blob = new Blob([JSON.stringify(state.project, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'restoration-integrity-log.json';
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 2000);
    toastMsg(prlT('toastLogDownloaded'));
  }

  function downloadCurrent(format) {
    var url = state.project.sourceImageUrl;
    if (!url) {
      toastMsg(prlT('toastNoExport'));
      return;
    }
    var baseName = (state.project.originalFileName || 'image').replace(/\.[^.]+$/, '');
    var fileName = 'restored-' + baseName;
    if (global.MCPrlCanvas && typeof global.MCPrlCanvas.downloadExport === 'function') {
      global.MCPrlCanvas.downloadExport(url, format, fileName).then(function () {
        appendIntegrityLog_({
          type: 'export',
          parameters: { format: format },
          provider: 'browser-canvas',
          affectedArea: 'none',
          extra: {}
        });
        toastMsg(prlT('toastExportDone'));
      }).catch(function () {
        toastMsg(prlT('toastExportFailed'));
      });
      return;
    }
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.jpg';
    a.click();
    toastMsg(prlT('toastExportTriggered'));
  }

  function downloadBatchResult_(rowId) {
    var row = null;
    for (var i = 0; i < state.batchQueue.length; i++) {
      if (state.batchQueue[i].id === rowId) {
        row = state.batchQueue[i];
        break;
      }
    }
    if (!row || !row.resultUrl || !global.MCPrlCanvas) {
      toastMsg(prlT('toastNoExport'));
      return;
    }
    var baseName = (row.fileName || 'batch').replace(/\.[^.]+$/, '');
    global.MCPrlCanvas.downloadExport(row.resultUrl, 'jpg', 'batch-' + baseName).then(function () {
      toastMsg(prlT('toastExportDone'));
    });
  }

  function iconSvg(name, size) {
    var s = size || 18;
    var stroke = 'currentColor';
    var o = { sw: 1.6, c: stroke, s: s };
    var paths = {
      upload:
        '<path d="M12 16V8m0 0l-3 3m3-3l3 3M4 20h16" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/>',
      zoomIn:
        '<circle cx="10" cy="10" r="6" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/><path d="M14 14l6 6M10 7v6M7 10h6" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/>',
      zoomOut:
        '<circle cx="10" cy="10" r="6" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/><path d="M14 14l6 6M7 10h6" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/>',
      move: '<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l3-3-3-3M19 9l3 3-3 3" fill="none" stroke="' + o.c + '" stroke-width="' + o.sw + '"/>',
      brush:
        '<path d="M12 3l8 8-7 7H5v-8L12 3z" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/>',
      eraser:
        '<path d="M8 14l6-6 4 4-6 6H8v-4z" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/>',
      rotate:
        '<path d="M4 12a8 8 0 1112 7" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/><path d="M20 12h-4M16 8v4" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/>',
      flip: '<path d="M8 5v14M16 5v14M12 5v14" fill="none" stroke="' + o.c + '" stroke-width="' + o.sw + '"/>',
      compare: '<rect x="4" y="5" width="6" height="14" fill="none" stroke="' + o.c + '" stroke-width="' + o.sw + '"/><rect x="14" y="5" width="6" height="14" fill="none" stroke="' + o.c + '" stroke-width="' + o.sw + '"/>',
      shield:
        '<path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/>',
      package: '<path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" fill="none" stroke="' + o.c + '" stroke-width="' + o.sw + '"/><path d="M4 8l8 4 8-4M12 12v8" fill="none" stroke="' + o.c + '" stroke-width="' + o.sw + '"/>',
      camera:
        '<path d="M4 8h2l2-3h8l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V10a2 2 0 012-2z" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/><circle cx="12" cy="14" r="3.5" fill="none" stroke="' +
        o.c +
        '" stroke-width="' +
        o.sw +
        '"/>'
    };
    var d = paths[name] || paths.package;
    return (
      '<svg class="mc-prl-ic" width="' +
      s +
      '" height="' +
      s +
      '" viewBox="0 0 24 24" aria-hidden="true">' +
      d +
      '</svg>'
    );
  }

  function renderEmptyOnboarding() {
    return (
      '<div class="mc-prl-onboarding">' +
      '<div class="mc-prl-onboarding__inner">' +
      '<h1 class="mc-prl-onboarding__title">' + esc(prlT('onboardingTitle')) + '</h1>' +
      '<p class="mc-prl-onboarding__sub">' + esc(prlT('onboardingSub')) + '</p>' +
      '<div class="mc-prl-onboarding__actions">' +
      renderCaptureInputsHtml_('mcPrlFileCaptureHero') +
      '<label class="mc-prl-upload-hero mc-prl-upload-hero--secondary" for="mcPrlFileHero">' +
      iconSvg('upload', 22) +
      '<span>' + esc(prlT('uploadHero')) + '</span>' +
      '</label>' +
      '<input type="file" id="mcPrlFileHero" accept="image/jpeg,image/png,image/webp,.tif,.tiff" multiple hidden />' +
      (state.processing
        ? '<div class="mc-prl-progress mc-prl-progress--onboard"><div class="mc-prl-progress__bar" id="mcPrlProgressBar" style="width:8%"></div><span>' +
          esc(state.progressLabel || prlT('capturePipelineRunning')) +
          '</span></div>'
        : '') +
      '</div>' +
      '<div class="mc-prl-warn mc-prl-warn--hero">' +
      iconSvg('shield', 22) +
      '<span>' + esc(prlT('safeModeHero')) + '</span>' +
      '</div>' +
      '<div class="mc-prl-onboarding__presets">' +
      '<div class="mc-prl-onboarding__presets-title">' + esc(prlT('onboardingPresetsTitle')) + '</div>' +
      '<div class="mc-prl-demo-cards">' +
      ['passport_cleanup', 'fossil_slab', 'field_rescue']
        .map(function (pid) {
          var pr = getPresets_().find(function (p) {
            return p.id === pid;
          });
          return (
            '<button type="button" class="mc-prl-demo-card" data-demo-preset="' +
            esc(pid) +
            '">' +
            '<div class="mc-prl-demo-card__name">' +
            esc(pr.name) +
            '</div>' +
            '<div class="mc-prl-demo-card__desc">' +
            esc(pr.desc) +
            '</div></button>'
          );
        })
        .join('') +
      '</div></div>' +
      '</div></div>'
    );
  }

  function renderMainCenter_() {
    if (state.processing && !state.project.sourceImageUrl) {
      return (
        '<div class="mc-prl-capture-busy">' +
        '<div class="mc-prl-progress"><div class="mc-prl-progress__bar" id="mcPrlProgressBar" style="width:' +
        Math.max(8, state.progress) +
        '%"></div><span>' +
        esc(state.progressLabel || prlT('capturePipelineRunning')) +
        '</span></div>' +
        '<p class="mc-prl-muted">' +
        esc(prlT('autoCaptureHint')) +
        '</p></div>'
      );
    }
    return state.project.sourceImageUrl ? renderCanvasBlock() : renderEmptyOnboarding();
  }

  function renderWorkspace() {
    var center = renderMainCenter_();
    var layoutClass = 'mc-prl-layout' + (state.project.sourceImageUrl ? '' : ' mc-prl-layout--onboard');
    return (
      '<div class="mc-prl-app">' +
      '<header class="mc-prl-topbar">' +
      '<div class="mc-prl-brand"><span class="mc-prl-brand__mark">M</span><div><div class="mc-prl-brand__title">' + esc(prlT('brandTitle')) + '</div><div class="mc-prl-brand__sub">' + esc(prlT('brandSub')) + '</div></div></div>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--ghost" data-action="close-lab">' + esc(prlT('close')) + '</button>' +
      '</header>' +
      '<div class="mc-prl-warn mc-prl-warn--bar">' +
      iconSvg('shield', 20) +
      '<span>' + esc(prlT('safeModeLabel')) + '：' +
      (state.project.safeMode ? '<strong>' + esc(prlT('safeModeOn')) + '</strong>' : '<strong>' + esc(prlT('safeModeOff')) + '</strong>') +
      '。' +
      (state.project.safeMode ? esc(prlT('safeModeBarOn')) : esc(prlT('safeModeBarOff'))) +
      '</span></div>' +
      '<div class="' + layoutClass + '">' +
      renderLeftSidebar() +
      '<main class="mc-prl-main">' +
      center +
      renderBottomBar() +
      '</main>' +
      renderRightPanel() +
      '</div>' +
      (state.exportModal ? renderExportModal() : '') +
      (state.mobileSheet ? renderMobileSheet() : '') +
      '</div>'
    );
  }

  function renderLeftSidebar() {
    return (
      '<aside class="mc-prl-sidebar">' +
      '<div class="mc-prl-side-section"><div class="mc-prl-side-title">' + esc(prlT('sourceSection')) + '</div>' +
      '<label class="mc-prl-btn mc-prl-btn--block mc-prl-btn--primary"><input type="file" id="mcPrlFileCapture" accept="image/*" capture="environment" hidden />' +
      iconSvg('camera', 18) +
      ' ' +
      esc(prlT('captureSidebar')) +
      '</label>' +
      '<label class="mc-prl-check mc-prl-check--side"><input type="checkbox" data-bind="autoCapture"' +
      (state.autoCapturePipeline ? ' checked' : '') +
      ' /><span>' +
      esc(prlT('autoCapturePipeline')) +
      '</span></label>' +
      '<label class="mc-prl-btn mc-prl-btn--block"><input type="file" id="mcPrlFile" accept="image/jpeg,image/png,image/webp,.tif,.tiff" hidden />' +
      iconSvg('upload', 18) +
      ' ' + esc(prlT('uploadImage')) + '</label>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block" data-action="stub-asset">' + esc(prlT('stubAsset')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block" data-action="stub-specimen">' + esc(prlT('stubSpecimen')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block" data-action="stub-passport">' + esc(prlT('stubPassport')) + '</button>' +
      '<label class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary"><input type="file" id="mcPrlBatch" accept="image/*" multiple hidden />' + esc(prlT('batchUpload')) + '</label>' +
      '</div>' +
      '<div class="mc-prl-side-section"><div class="mc-prl-side-title">' + esc(prlT('presetFlowTitle')) + '</div>' +
      '<div class="mc-prl-preset-list">' +
      getPresets_().map(function (p) {
        var sel = state.project.preset === p.id ? ' is-active' : '';
        return (
          '<button type="button" class="mc-prl-preset-chip' +
          sel +
          '" data-preset="' +
          esc(p.id) +
          '">' +
          '<span class="mc-prl-preset-chip__n">' +
          esc(p.name) +
          '</span><span class="mc-prl-preset-chip__d">' +
          esc(p.desc) +
          '</span></button>'
        );
      }).join('') +
      '</div>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--primary" data-action="run-plate-stack"' +
      (state.processing ? ' disabled' : '') +
      '>' +
      esc(prlT('plateStackBtn')) +
      '</button>' +
      (state.project.sourceImageUrl
        ? '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="run-archive-repair"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('archiveRepairBtn')) +
          '</button>' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="run-preset"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('runPresetBtn')) +
          '</button>' +
          '<label class="mc-prl-check mc-prl-check--side"><input type="checkbox" data-bind="autoRunPreset"' +
          (state.autoRunPreset ? ' checked' : '') +
          ' /><span>' +
          esc(prlT('autoRunPreset')) +
          '</span></label>'
        : '') +
      '</div>' +
      '<div class="mc-prl-side-section"><div class="mc-prl-side-title">' +
      esc(prlT('quickStacksTitle')) +
      '</div>' +
      '<div class="mc-prl-quick-ops">' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm mc-prl-btn--accent" data-action="run-specimen-isolate"' +
      (state.processing || !state.project.sourceImageUrl ? ' disabled' : '') +
      '>' +
      esc(prlT('specimenIsolateBtn')) +
      '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="run-field-rescue"' +
      (state.processing || !state.project.sourceImageUrl ? ' disabled' : '') +
      '>' +
      esc(prlT('fieldRescueBtn')) +
      '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="run-fossil-enhance"' +
      (state.processing || !state.project.sourceImageUrl ? ' disabled' : '') +
      '>' +
      esc(prlT('fossilEnhanceBtn')) +
      '</button></div></div>' +
      (state.project.sourceImageUrl
        ? '<div class="mc-prl-side-section"><div class="mc-prl-side-title">' +
          esc(prlT('quickOpsTitle')) +
          '</div><div class="mc-prl-quick-ops">' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--sm mc-prl-btn--accent" data-action="run-quick-edit"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('quickEditBtn')) +
          '</button>' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--sm mc-prl-btn--accent" data-ai="archive"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('opArchive')) +
          '</button>' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-ai="enhance"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('opEnhance')) +
          '</button>' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-ai="clarity"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('opClarity')) +
          '</button>' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-ai="dehaze"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('opDehaze')) +
          '</button>' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-ai="glare"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('opGlare')) +
          '</button>' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-ai="grade"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('opGrade')) +
          '</button>' +
          '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-ai="dust"' +
          (state.processing ? ' disabled' : '') +
          '>' +
          esc(prlT('opDust')) +
          '</button></div></div>'
        : '') +
      '<div class="mc-prl-side-section"><div class="mc-prl-side-title">' + esc(prlT('canvasToolsTitle')) + '</div>' +
      '<div class="mc-prl-tool-grid">' +
      [
        ['zoom-in', prlT('zoomIn')],
        ['zoom-out', prlT('zoomOut')],
        ['fit', prlT('fitView')],
        ['pan', prlT('toolPan')],
        ['brush', prlT('toolBrushMask')],
        ['eraser', prlT('toolEraser')],
        ['rotate', prlT('toolRotate90')],
        ['flip-h', prlT('toolFlipH')],
        ['flip-v', prlT('toolFlipV')],
        ['reset', prlT('toolResetView')]
      ]
        .map(function (t) {
          return (
            '<button type="button" class="mc-prl-tool-btn' +
            (state.tool === t[0] ? ' is-active' : '') +
            '" data-tool="' +
            esc(t[0]) +
            '" title="' +
            esc(t[1]) +
            '">' +
            esc(t[1]) +
            '</button>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="mc-prl-quick-ops mc-prl-quick-ops--canvas">' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-ai="autoCrop"' +
      (state.processing ? ' disabled' : '') +
      '>' +
      esc(prlT('opAutoCrop')) +
      '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-ai="borderClean"' +
      (state.processing ? ' disabled' : '') +
      '>' +
      esc(prlT('opBorderClean')) +
      '</button></div>' +
      '<div class="mc-prl-side-meta">' + esc(prlT('canvasTransformNote')) + '</div>' +
      '</div>' +
      '</aside>'
    );
  }

  function renderCanvasBlock() {
    var comparePct = Math.round((state.compare || 0.5) * 100);
    return (
      '<div class="mc-prl-canvas-wrap">' +
      '<div class="mc-prl-canvas-toolbar">' +
      '<button type="button" class="mc-prl-icon-btn" data-canvas="zoom-in" title="' + esc(prlT('zoomIn')) + '">' +
      iconSvg('zoomIn') +
      '</button>' +
      '<button type="button" class="mc-prl-icon-btn" data-canvas="zoom-out" title="' + esc(prlT('zoomOut')) + '">' +
      iconSvg('zoomOut') +
      '</button>' +
      '<button type="button" class="mc-prl-icon-btn" data-canvas="fit" title="' + esc(prlT('fitView')) + '">' +
      iconSvg('compare') +
      '</button>' +
      '<span class="mc-prl-toolbar-sep"></span>' +
      '<button type="button" class="mc-prl-icon-btn' +
      (state.tool === 'pan' ? ' is-active' : '') +
      '" data-tool="pan" title="' + esc(prlT('toolPan')) + '">' +
      iconSvg('move') +
      '</button>' +
      '<button type="button" class="mc-prl-icon-btn' +
      (state.tool === 'brush' ? ' is-active' : '') +
      '" data-tool="brush" title="' + esc(prlT('toolBrush')) + '">' +
      iconSvg('brush') +
      '</button>' +
      '<button type="button" class="mc-prl-icon-btn' +
      (state.tool === 'eraser' ? ' is-active' : '') +
      '" data-tool="eraser" title="' + esc(prlT('toolEraser')) + '">' +
      iconSvg('eraser') +
      '</button>' +
      '<span class="mc-prl-toolbar-sep"></span>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="undo">' + esc(prlT('undoMask')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="redo">' + esc(prlT('redoMask')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="clear-mask">' + esc(prlT('clearMask')) + '</button>' +
      '</div>' +
      renderOpsDock_() +
      '<div class="mc-prl-compare-row">' +
      '<label class="mc-prl-compare-label"><span>' +
      iconSvg('compare', 16) +
      ' ' + esc(prlT('compareBeforeAfter')) + '</span>' +
      '<input type="range" min="0" max="100" value="' +
      comparePct +
      '" data-bind="compare" /></label>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm' +
      (state.splitView ? ' is-active' : '') +
      '" data-action="split-view">' +
      esc(prlT('splitView')) +
      '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="reset-original">' +
      esc(prlT('resetOriginal')) +
      '</button>' +
      '</div>' +
      (state.splitView
        ? '<div class="mc-prl-split">' +
          '<div class="mc-prl-split__pane"><span class="mc-prl-split__label">' +
          esc(prlT('compareBefore')) +
          '</span><img class="mc-prl-split__img" src="' +
          esc(getCompareBaselineUrl_()) +
          '" alt="" /></div>' +
          '<div class="mc-prl-split__pane"><span class="mc-prl-split__label">' +
          esc(prlT('compareAfter')) +
          '</span><img class="mc-prl-split__img" src="' +
          esc(state.project.sourceImageUrl) +
          '" alt="" /></div></div>'
        : '<div class="mc-prl-viewport' +
          (state.tool === 'brush' || state.tool === 'eraser' ? ' mc-prl-viewport--paint' : '') +
          (state.showCheckerboard ? ' mc-prl-viewport--checker' : '') +
          '" id="mcPrlViewport">' +
          '<div class="mc-prl-viewport__inner" id="mcPrlPanZoom" style="transform: translate(' +
          state.panX +
          'px,' +
          state.panY +
          'px) scale(' +
          state.zoom +
          ')">' +
          '<div class="mc-prl-img-stack">' +
          '<img id="mcPrlSourceImg" class="mc-prl-img mc-prl-img--base' +
          (state.showCheckerboard ? ' mc-prl-img--nobg' : '') +
          '" src="' +
          esc(state.project.sourceImageUrl) +
          '" alt="' +
          esc(prlT('altSourceImage')) +
          '" crossorigin="anonymous" />' +
          '<img class="mc-prl-img mc-prl-img--overlay" src="' +
          esc(getCompareBaselineUrl_()) +
          '" style="opacity:' +
          (1 - state.compare) +
          ';" alt="' +
          esc(prlT('altCompareOverlay')) +
          '" />' +
          '<canvas id="mcPrlMaskCanvas" class="mc-prl-mask-canvas"></canvas>' +
          '</div></div></div>') +
      (state.processing
        ? '<div class="mc-prl-progress"><div class="mc-prl-progress__bar" id="mcPrlProgressBar" style="width:5%"></div><span>' +
          esc(state.progressLabel || prlT('processingGeneric')) +
          '</span></div>'
        : '') +
      '</div>'
    );
  }

  function renderOpsDock_() {
    if (!state.project.sourceImageUrl) return '';
    return (
      '<div class="mc-prl-ops-dock">' +
      '<div class="mc-prl-ops-dock__strength">' +
      '<span class="mc-prl-ops-dock__label">' +
      esc(prlT('strength')) +
      '</span>' +
      '<input type="range" min="0" max="100" data-bind="strength" value="' +
      state.strength +
      '" />' +
      '<span class="mc-prl-ops-dock__val">' +
      state.strength +
      '%</span>' +
      '<span class="mc-prl-small mc-prl-ops-dock__hint">' +
      esc(prlT('strengthHint')) +
      ' ' +
      esc(prlT('dustHint')) +
      '</span></div>' +
      renderAiToolbar() +
      '</div>'
    );
  }

  function renderAiToolbarGroup_(label, tools) {
    return (
      '<div class="mc-prl-ai-group">' +
      '<span class="mc-prl-ai-group__label">' +
      esc(label) +
      '</span>' +
      '<div class="mc-prl-ai-group__row">' +
      tools
        .map(function (x) {
          return (
            '<button type="button" class="mc-prl-ai-btn' +
            (x[2] ? ' mc-prl-ai-btn--strong' : '') +
            '" data-ai="' +
            esc(x[0]) +
            '"' +
            (state.processing ? ' disabled' : '') +
            '>' +
            esc(x[1]) +
            '</button>'
          );
        })
        .join('') +
      '</div></div>'
    );
  }

  function renderAiToolbar() {
    return (
      '<div class="mc-prl-ai-bar">' +
      renderAiToolbarGroup_(prlT('toolbarGroupRestore'), [
        ['quickEdit', prlT('opQuickEdit'), true],
        ['archive', prlT('opArchive'), true],
        ['enhance', prlT('opEnhance'), true],
        ['clarity', prlT('opClarity'), true],
        ['exposure', prlT('opExposure'), true],
        ['whiteBalance', prlT('opWhiteBalance'), false],
        ['correctColor', prlT('opCorrectColor'), false],
        ['grade', prlT('opGrade'), false],
        ['exportImage', prlT('opExportPrep'), false]
      ]) +
      renderAiToolbarGroup_(prlT('toolbarGroupCleanup'), [
        ['glare', prlT('opGlare'), false],
        ['dehaze', prlT('opDehaze'), true],
        ['vignette', prlT('opVignette'), false],
        ['castRemove', prlT('opCastRemove'), true],
        ['sharpen', prlT('opSharpen'), true],
        ['denoise', prlT('opDenoise'), false],
        ['deblur', prlT('opDeblur'), false],
        ['dust', prlT('opDust'), false],
        ['derain', prlT('opDerain'), false],
        ['jpeg', prlT('opJpeg'), false]
      ]) +
      renderAiToolbarGroup_(prlT('toolbarGroupGeometry'), [
        ['autoCrop', prlT('opAutoCrop'), true],
        ['borderClean', prlT('opBorderClean'), false],
        ['padWhite', prlT('opPadWhite'), false]
      ]) +
      renderAiToolbarGroup_(prlT('toolbarGroupBgScale'), [
        ['removeBackground', prlT('opRemoveBg'), false],
        ['whiteBg', prlT('opWhiteBg'), false],
        ['transparentBg', prlT('opTransparentBg'), false],
        ['upscale', prlT('opUpscale'), false],
        ['up4', prlT('opUp4'), false],
        ['inpaint', prlT('opInpaint'), false]
      ]) +
      '</div>'
    );
  }

  function renderBottomBar() {
    if (!state.project.sourceImageUrl) {
      return '';
    }
    var thumbs = state.project.versions
      .slice(-6)
      .map(function (v) {
        var active = v.id === state.activeVersionId ? ' is-active' : '';
        return (
          '<button type="button" class="mc-prl-thumb' +
          active +
          '" data-version="' +
          esc(v.id) +
          '" title="' +
          esc(v.label) +
          '">' +
          '<img src="' +
          esc(v.imageUrl) +
          '" alt="" />' +
          '<span>' +
          esc(v.label) +
          '</span></button>'
        );
      })
      .join('');
    var batch = state.batchQueue
      .map(function (b) {
        var st =
          b.status === 'processing'
            ? prlT('batchProcessing')
            : b.status === 'error'
              ? prlT('batchError')
              : prlBatchStatusZh(b.status);
        var dl =
          b.status === 'done' && b.resultUrl
            ? '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-batch-dl="' +
              esc(b.id) +
              '">' +
              esc(prlT('batchDownload')) +
              '</button>'
            : '';
        return (
          '<div class="mc-prl-queue-row"><span>' +
          esc(b.fileName) +
          '</span><span class="mc-prl-queue-st">' +
          esc(st) +
          '</span>' +
          dl +
          '</div>'
        );
      })
      .join('');
    var compact = !state.batchQueue.length;
    return (
      '<footer class="mc-prl-bottom' +
      (compact ? ' mc-prl-bottom--compact' : '') +
      '">' +
      '<div class="mc-prl-bottom__col"><div class="mc-prl-bottom__title">' + esc(prlT('versionsTitle')) + '</div><div class="mc-prl-thumbs">' +
      (thumbs || '<span class="mc-prl-muted">' + esc(prlT('noVersionsYet')) + '</span>') +
      '</div></div>' +
      '<div class="mc-prl-bottom__col"><div class="mc-prl-bottom__title">' + esc(prlT('batchQueueTitle')) + '</div>' +
      '<div class="mc-prl-queue">' +
      (batch || '<span class="mc-prl-muted">' + esc(prlT('noBatchItems')) + '</span>') +
      '</div>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="batch-run">' + esc(prlT('batchRun')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="batch-download-all">' + esc(prlT('batchDownloadAll')) + '</button>' +
      '</div></footer>'
    );
  }

  function renderGradeSlider_(key, label) {
    var v = state.gradeParams[key] != null ? state.gradeParams[key] : 0;
    return (
      '<label class="mc-prl-field mc-prl-field--compact">' +
      esc(label) +
      '<input type="range" min="-100" max="100" data-grade="' +
      esc(key) +
      '" value="' +
      v +
      '" /></label>'
    );
  }

  function renderGradePanel_() {
    if (state.providerId !== 'browserOss' && state.providerId !== 'browserRembg') return '';
    return (
      '<div class="mc-prl-panel mc-prl-panel--nested mc-prl-panel--grade">' +
      '<div class="mc-prl-panel__title">' +
      esc(prlT('gradePanelTitle')) +
      '</div>' +
      '<p class="mc-prl-small">' +
      esc(prlT('gradePanelHint')) +
      '</p>' +
      renderGradeSlider_('temperature', prlT('gradeTemperature')) +
      renderGradeSlider_('tint', prlT('gradeTint')) +
      renderGradeSlider_('saturation', prlT('gradeSaturation')) +
      renderGradeSlider_('contrast', prlT('gradeContrast')) +
      renderGradeSlider_('vibrance', prlT('gradeVibrance')) +
      renderGradeSlider_('shadows', prlT('gradeShadows')) +
      renderGradeSlider_('highlights', prlT('gradeHighlights')) +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="apply-grade"' +
      (state.processing ? ' disabled' : '') +
      '>' +
      esc(prlT('gradeApplyBtn')) +
      '</button></div>'
    );
  }

  function renderIopaintPanel_() {
    var show =
      state.providerId === 'ioPaint' ||
      state.providerId === 'localLama' ||
      state.localInpaintStatus !== 'unknown';
    if (!show) return '';
    var statusLabel =
      state.localInpaintStatus === 'online'
        ? prlT('iopaintStatusOnline')
        : state.localInpaintStatus === 'offline'
          ? prlT('iopaintStatusOffline')
          : prlT('iopaintStatusUnknown');
    var modelLine = state.iopaintCurrentModel
      ? '<p class="mc-prl-small">' + esc(prlT('iopaintCurrentModel')) + esc(state.iopaintCurrentModel) + '</p>'
      : '';
    return (
      '<div class="mc-prl-panel mc-prl-panel--nested mc-prl-panel--iopaint">' +
      '<div class="mc-prl-panel__title">' +
      esc(prlT('iopaintPanelTitle')) +
      '</div>' +
      '<label class="mc-prl-field">' +
      esc(prlT('iopaintBaseLabel')) +
      '<input type="url" data-text="iopaintBase" value="' +
      esc(state.iopaintBaseUrl || '') +
      '" placeholder="' +
      esc(
        global.MCPrlLocalInpaint && global.MCPrlLocalInpaint.detectDefaultBase
          ? global.MCPrlLocalInpaint.detectDefaultBase()
          : 'http://127.0.0.1:8080'
      ) +
      '" /></label>' +
      '<p class="mc-prl-small">' +
      esc(prlT('iopaintBaseHint')) +
      '</p>' +
      '<div class="mc-prl-iopaint-row">' +
      '<span class="mc-prl-iopaint-dot mc-prl-iopaint-dot--' +
      esc(state.localInpaintStatus) +
      '" aria-hidden="true"></span>' +
      '<span class="mc-prl-small">' +
      esc(statusLabel) +
      '</span>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--sm" data-action="test-iopaint">' +
      esc(prlT('iopaintTestBtn')) +
      '</button></div>' +
      modelLine +
      '</div>'
    );
  }

  function renderRightPanel() {
    return (
      '<aside class="mc-prl-inspector">' +
      '<div class="mc-prl-panel">' +
      '<div class="mc-prl-panel__title">' + esc(prlT('scientificSafetyTitle')) + '</div>' +
      '<label class="mc-prl-toggle"><input type="checkbox" data-bind="safeMode"' +
      (state.project.safeMode ? ' checked' : '') +
      ' /><span>' + esc(prlT('safeModeLabel')) + '</span></label>' +
      '<p class="mc-prl-small">' + esc(prlT('safeModePanelDesc')) + '</p>' +
      '<div class="mc-prl-warn mc-prl-warn--panel">' +
      esc(prlT('inpaintExamplesWarn')) +
      '</div>' +
      '<label class="mc-prl-check"><input type="checkbox" data-bind="inpaintAck"' +
      (state.inpaintAck ? ' checked' : '') +
      ' /> ' + esc(prlT('inpaintAck')) + '</label>' +
      '</div>' +
      renderGradePanel_() +
      '<div class="mc-prl-panel">' +
      '<div class="mc-prl-panel__title">' + esc(prlT('aiProviderTitle')) + '</div>' +
      '<select class="mc-prl-select" data-bind="provider">' +
      '<option value="browserOss"' +
      (state.providerId === 'browserOss' ? ' selected' : '') +
      '>' +
      esc(prlT('providerOss')) +
      '</option>' +
      '<option value="mock"' +
      (state.providerId === 'mock' ? ' selected' : '') +
      '>' + esc(prlT('providerMock')) + '</option>' +
      '<option value="browserRembg"' +
      (state.providerId === 'browserRembg' ? ' selected' : '') +
      '>' +
      esc(prlT('providerRembg')) +
      '</option>' +
      '<option value="localLama"' +
      (state.providerId === 'localLama' ? ' selected' : '') +
      '>' +
      esc(prlT('providerLocalLama')) +
      '</option>' +
      '<option value="ioPaint"' +
      (state.providerId === 'ioPaint' ? ' selected' : '') +
      '>' +
      esc(prlT('providerIoPaint')) +
      '</option>' +
      '<option value="realESRGAN"' +
      (state.providerId === 'realESRGAN' ? ' selected' : '') +
      '>' +
      esc(prlT('providerEsrgan')) +
      '</option>' +
      '<option value="restormer"' +
      (state.providerId === 'restormer' ? ' selected' : '') +
      '>' + esc(prlT('providerRestormerStub')) + '</option>' +
      '<option value="browserInpaint"' +
      (state.providerId === 'browserInpaint' ? ' selected' : '') +
      '>' + esc(prlT('providerBrowserInpaintStub')) + '</option>' +
      '<option value="comfyUI"' +
      (state.providerId === 'comfyUI' ? ' selected' : '') +
      '>' + esc(prlT('providerComfyStub')) + '</option>' +
      '</select>' +
      '<p class="mc-prl-small">' +
      esc(
        state.providerId === 'browserOss'
          ? prlT('providerOssHint')
          : state.providerId === 'localLama' || state.providerId === 'ioPaint'
            ? prlT('providerInpaintHint')
            : prlT('providerRembgHint')
      ) +
      '</p>' +
      renderIopaintPanel_() +
      renderOssStatusPanel_() +
      '<div class="mc-prl-panel mc-prl-panel--nested">' +
      '<div class="mc-prl-panel__title">' +
      esc(prlT('ossCreditsTitle')) +
      '</div>' +
      '<p class="mc-prl-small mc-prl-oss-credits">' +
      esc(prlT('ossCreditsBody')) +
      '</p></div>' +
      '<p class="mc-prl-small">' +
      esc(prlT('strengthMovedHint')) +
      '</p>' +
      '</div>' +
      '<div class="mc-prl-panel">' +
      '<div class="mc-prl-panel__title">' + esc(prlT('metadataTitle')) + '</div>' +
      '<label class="mc-prl-field">' + esc(prlT('titleField')) + '<input data-text="title" value="' +
      esc(state.project.title) +
      '" /></label>' +
      '<label class="mc-prl-field">' + esc(prlT('imageType')) + '<select data-bind="imageType">' +
      getImageTypes_().map(function (it) {
        return (
          '<option value="' +
          esc(it.id) +
          '"' +
          (state.project.imageType === it.id ? ' selected' : '') +
          '>' +
          esc(it.label) +
          '</option>'
        );
      }).join('') +
      '</select></label>' +
      '<label class="mc-prl-field">' + esc(prlT('brushSize')) + '<input type="range" min="4" max="80" data-bind="brush" value="' +
      state.brushSize +
      '" /></label>' +
      '<label class="mc-prl-field">' + esc(prlT('maskOpacity')) + '<input type="range" min="10" max="90" data-bind="maskOp" value="' +
      Math.round(state.maskOpacity * 100) +
      '" /></label>' +
      (state.imageMeta && state.imageMeta.w
        ? '<p class="mc-prl-small mc-prl-image-meta">' +
          esc(prlT('imageMetaLabel')) +
          state.imageMeta.w +
          ' × ' +
          state.imageMeta.h +
          ' px</p>'
        : '') +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="save-snapshot">' +
      esc(prlT('saveSnapshot')) +
      '</button>' +
      '</div>' +
      '<div class="mc-prl-panel">' +
      '<div class="mc-prl-panel__title">' + esc(prlT('exportIntegrationTitle')) + '</div>' +
      '<p class="mc-prl-small">' + esc(prlT('exportIntegrationDesc')) + '</p>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block" data-action="open-export">' + esc(prlT('openExport')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="export-log">' + esc(prlT('downloadIntegrityJson')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="stub-save-asset">' + esc(prlT('stubSaveAsset')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="stub-passport-card">' + esc(prlT('stubPassportCard')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="stub-sat">' + esc(prlT('stubSat')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="stub-vm">' + esc(prlT('stubPublicVm')) + '</button>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block mc-prl-btn--secondary" data-action="stub-attach">' + esc(prlT('stubAttachSpecimen')) + '</button>' +
      '</div>' +
      '<button type="button" class="mc-prl-mobile-sheet-toggle mobile-only" data-action="toggle-sheet">' + esc(prlT('mobileSheetExport')) + '</button>' +
      '</aside>'
    );
  }

  function renderExportModal() {
    return (
      '<div class="mc-prl-modal" data-action="modal-bg">' +
      '<div class="mc-prl-modal__card" role="dialog">' +
      '<h3>' + esc(prlT('exportModalTitle')) + '</h3>' +
      '<p class="mc-prl-small">' + esc(prlT('exportModalDesc')) + '</p>' +
      '<div class="mc-prl-export-grid">' +
      [
        ['png', prlT('exportPng')],
        ['jpg', prlT('exportJpg')],
        ['png-tr', prlT('exportPngTr')],
        ['jpg-white', prlT('exportJpgWhite')],
        ['passport', prlT('exportPassport')],
        ['sat', prlT('exportSat')],
        ['thumb', prlT('exportThumb')],
        ['zip', prlT('exportZipStub')]
      ]
        .map(function (x) {
          return '<button type="button" class="mc-prl-btn" data-export="' + esc(x[0]) + '">' + esc(x[1]) + '</button>';
        })
        .join('') +
      '</div>' +
      '<button type="button" class="mc-prl-btn mc-prl-btn--ghost" data-action="close-export">' + esc(prlT('close')) + '</button>' +
      '</div></div>'
    );
  }

  function renderMobileSheet() {
    return (
      '<div class="mc-prl-sheet mobile-only" id="mcPrlSheet">' +
      '<div class="mc-prl-sheet__header"><span>' + esc(prlT('mobileSheetTitle')) + '</span><button type="button" data-action="toggle-sheet">✕</button></div>' +
      '<div class="mc-prl-sheet__body">' +
      getPresets_().map(function (p) {
        return (
          '<button type="button" class="mc-prl-preset-chip' +
          (state.project.preset === p.id ? ' is-active' : '') +
          '" data-preset="' +
          esc(p.id) +
          '">' +
          esc(p.name) +
          '</button>'
        );
      }).join('') +
      '<button type="button" class="mc-prl-btn mc-prl-btn--block" data-action="open-export">' + esc(prlT('openExport')) + '</button>' +
      '</div></div>'
    );
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var toast =
      state.toast &&
      '<div class="mc-prl-toast">' + esc(state.toast) + '</div>';
    root.innerHTML = renderWorkspace() + (state.toast ? '<div class="mc-prl-toast">' + esc(state.toast) + '</div>' : '');
    bind(root);
    applyPanZoomDom_();
  }

  function bind(root) {
    function bindCaptureInput(el, heroId) {
      if (!el) return;
      el.onchange = function () {
        if (el.files && el.files[0]) loadFiles(el.files, { fromCapture: true });
        el.value = '';
      };
    }
    bindCaptureInput(root.querySelector('#mcPrlFileCapture'));
    bindCaptureInput(root.querySelector('#mcPrlFileCaptureHero'));
    var f = root.querySelector('#mcPrlFile');
    if (f) {
      f.onchange = function () {
        if (f.files && f.files[0]) loadFiles(f.files);
        f.value = '';
      };
    }
    var fh = root.querySelector('#mcPrlFileHero');
    if (fh) {
      fh.onchange = function () {
        if (fh.files && fh.files[0]) loadFiles(fh.files);
        fh.value = '';
      };
    }
    var fb = root.querySelector('#mcPrlBatch');
    if (fb) {
      fb.onchange = function () {
        if (fb.files) loadBatch(fb.files);
        fb.value = '';
      };
    }
    root.querySelectorAll('[data-demo-preset]').forEach(function (b) {
      b.onclick = function () {
        applyPreset(b.getAttribute('data-demo-preset') || '');
        toastMsg(prlT('toastPresetSelected'));
      };
    });
    root.querySelectorAll('[data-preset]').forEach(function (b) {
      b.onclick = function () {
        applyPreset(b.getAttribute('data-preset') || '');
      };
    });
    root.querySelectorAll('[data-action]').forEach(function (b) {
      b.onclick = function (ev) {
        onAction(b.getAttribute('data-action'), ev);
      };
    });
    root.querySelectorAll('[data-ai]').forEach(function (b) {
      b.onclick = function () {
        runProviderOp_(b.getAttribute('data-ai'), { strength: state.strength });
      };
    });
    root.querySelectorAll('[data-tool]').forEach(function (b) {
      b.onclick = function () {
        onTool(b.getAttribute('data-tool') || '');
      };
    });
    root.querySelectorAll('[data-canvas]').forEach(function (b) {
      b.onclick = function () {
        onCanvasBtn(b.getAttribute('data-canvas') || '');
      };
    });
    root.querySelectorAll('[data-version]').forEach(function (b) {
      b.onclick = function () {
        applyVersionById_(b.getAttribute('data-version') || '');
      };
    });
    root.querySelectorAll('[data-batch-dl]').forEach(function (b) {
      b.onclick = function () {
        downloadBatchResult_(b.getAttribute('data-batch-dl') || '');
      };
    });
    root.querySelectorAll('[data-export]').forEach(function (b) {
      b.onclick = function () {
        var fmt = b.getAttribute('data-export') || 'png';
        if (fmt === 'zip') {
          toastMsg(prlT('toastZipDemo'));
          return;
        }
        downloadCurrent(fmt);
      };
    });
    root.querySelectorAll('[data-bind]').forEach(function (el) {
      var k = el.getAttribute('data-bind');
      if (k === 'autoCapture') {
        el.onchange = function () {
          state.autoCapturePipeline = !!el.checked;
          if (global.MCPrlPipeline && typeof global.MCPrlPipeline.writeAutoCapturePipeline === 'function') {
            global.MCPrlPipeline.writeAutoCapturePipeline(state.autoCapturePipeline);
          }
        };
      }
      if (k === 'autoRunPreset') {
        el.onchange = function () {
          state.autoRunPreset = !!el.checked;
          try {
            localStorage.setItem('mcurator_prl_auto_run_preset_v1', state.autoRunPreset ? '1' : '0');
          } catch (eRp) {
            void 0;
          }
        };
      }
      if (k === 'safeMode') {
        el.onchange = function () {
          state.project.safeMode = !!el.checked;
          render();
        };
      }
      if (k === 'inpaintAck') {
        el.onchange = function () {
          state.inpaintAck = !!el.checked;
        };
      }
      if (k === 'provider') {
        el.onchange = function () {
          state.providerId = el.value;
          if (
            (state.providerId === 'browserRembg' || state.providerId === 'browserOss') &&
            global.MCPrlRembg &&
            typeof global.MCPrlRembg.preload === 'function'
          ) {
            toastMsg(prlT('rembgLoadingModel'));
            global.MCPrlRembg.preload();
          }
          if (
            (state.providerId === 'browserOss' || state.providerId === 'realESRGAN') &&
            global.MCPrlUpscale &&
            typeof global.MCPrlUpscale.preload === 'function'
          ) {
            global.MCPrlUpscale.preload();
          }
          if (state.providerId === 'ioPaint' || state.providerId === 'localLama') {
            refreshLocalInpaintStatus_();
          } else if (
            state.providerId !== 'mock' &&
            state.providerId !== 'browserRembg' &&
            state.providerId !== 'browserOss' &&
            state.providerId !== 'realESRGAN'
          ) {
            toastMsg(prlT('providerStubToast'));
          }
          render();
        };
      }
      if (k === 'strength') {
        el.oninput = function () {
          state.strength = Number(el.value) || 0;
          root.querySelectorAll('.mc-prl-ops-dock__val').forEach(function (span) {
            span.textContent = state.strength + '%';
          });
        };
      }
      if (k === 'compare') {
        el.oninput = function () {
          state.compare = (Number(el.value) || 0) / 100;
          var ov = root.querySelector('.mc-prl-img--overlay');
          if (ov) ov.style.opacity = String(1 - state.compare);
        };
      }
      if (k === 'imageType') {
        el.onchange = function () {
          state.project.imageType = el.value;
        };
      }
      if (k === 'brush') {
        el.oninput = function () {
          state.brushSize = Number(el.value) || 20;
        };
      }
      if (k === 'maskOp') {
        el.oninput = function () {
          state.maskOpacity = (Number(el.value) || 45) / 100;
          var mc = root.querySelector('#mcPrlMaskCanvas');
          if (mc) mc.style.opacity = String(state.maskOpacity);
        };
      }
    });
    root.querySelectorAll('[data-grade]').forEach(function (el) {
      var gk = el.getAttribute('data-grade');
      el.oninput = function () {
        if (!state.gradeParams) state.gradeParams = defaultGradeParams_();
        state.gradeParams[gk] = Number(el.value) || 0;
        writeGradeParams_(state.gradeParams);
      };
    });
    root.querySelectorAll('[data-text]').forEach(function (el) {
      var k = el.getAttribute('data-text');
      el.onchange = function () {
        if (k === 'title') state.project.title = el.value;
        if (k === 'iopaintBase' && global.MCPrlLocalInpaint && typeof global.MCPrlLocalInpaint.setBaseUrl === 'function') {
          state.iopaintBaseUrl = global.MCPrlLocalInpaint.setBaseUrl(el.value);
          refreshLocalInpaintStatus_();
        }
      };
    });
    var img = root.querySelector('#mcPrlSourceImg');
    if (img) {
      img.onload = function () {
        state.imageMeta = {
          w: img.naturalWidth || img.width || 0,
          h: img.naturalHeight || img.height || 0
        };
        resizeMaskToImage_();
        var mc = document.getElementById('mcPrlMaskCanvas');
        if (mc) mc.style.opacity = String(state.maskOpacity);
        var metaEl = root.querySelector('.mc-prl-image-meta');
        if (metaEl && state.imageMeta.w) {
          metaEl.textContent = prlT('imageMetaLabel') + state.imageMeta.w + ' × ' + state.imageMeta.h + ' px';
        }
      };
    }
    setupPointerMask_(root);
    setupPan_(root);
  }

  function onCanvasBtn(act) {
    if (act === 'zoom-in') state.zoom = Math.min(4, state.zoom * 1.15);
    if (act === 'zoom-out') state.zoom = Math.max(0.25, state.zoom / 1.15);
    if (act === 'fit') {
      state.zoom = 1;
      state.panX = 0;
      state.panY = 0;
    }
    applyPanZoomDom_();
  }

  function onTool(t) {
    if (t === 'zoom-in' || t === 'zoom-out' || t === 'fit') return onCanvasBtn(t);
    if (t === 'rotate') {
      runCanvasTransform_('rotate90');
      return;
    }
    if (t === 'flip-h') {
      runCanvasTransform_('flipH');
      return;
    }
    if (t === 'flip-v') {
      runCanvasTransform_('flipV');
      return;
    }
    if (t === 'reset') {
      state.zoom = 1;
      state.panX = 0;
      state.panY = 0;
      applyPanZoomDom_();
      return;
    }
    state.tool = t === 'brush' || t === 'eraser' || t === 'pan' ? t : state.tool;
    render();
  }

  function applyPanZoomDom_() {
    var el = document.getElementById('mcPrlPanZoom');
    if (el) {
      el.style.transform = 'translate(' + state.panX + 'px,' + state.panY + 'px) scale(' + state.zoom + ')';
    }
  }

  function setupPan_(root) {
    var vp = root.querySelector('#mcPrlViewport');
    if (!vp || vp.getAttribute('data-pan-bound')) return;
    vp.setAttribute('data-pan-bound', '1');
    var drag = false;
    var lx = 0;
    var ly = 0;
    vp.addEventListener('mousedown', function (e) {
      if (state.tool !== 'pan') return;
      drag = true;
      lx = e.clientX;
      ly = e.clientY;
    });
    window.addEventListener('mouseup', function () {
      drag = false;
    });
    vp.addEventListener('mousemove', function (e) {
      if (!drag || state.tool !== 'pan') return;
      state.panX += e.clientX - lx;
      state.panY += e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      applyPanZoomDom_();
    });
  }

  function setupPointerMask_(root) {
    var vp = root.querySelector('#mcPrlViewport');
    var c = root.querySelector('#mcPrlMaskCanvas');
    var img = root.querySelector('#mcPrlSourceImg');
    if (!vp || !c || !img || c.getAttribute('data-mask-bound')) return;
    c.setAttribute('data-mask-bound', '1');
    var drawing = false;
    function pos(ev) {
      var r = img.getBoundingClientRect();
      var x = ((ev.clientX - r.left) / r.width) * c.width;
      var y = ((ev.clientY - r.top) / r.height) * c.height;
      return { x: x, y: y };
    }
    function paint(ev) {
      var ctx = c.getContext('2d');
      var p = pos(ev);
      ctx.globalCompositeOperation = state.tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.fillStyle = 'rgba(255,80,80,0.55)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, state.brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    c.addEventListener('mousedown', function (e) {
      if (state.tool !== 'brush' && state.tool !== 'eraser') return;
      drawing = true;
      pushUndoMask_();
      paint(e);
    });
    window.addEventListener('mouseup', function () {
      drawing = false;
    });
    c.addEventListener('mousemove', function (e) {
      if (!drawing) return;
      paint(e);
    });
  }

  function onAction(act, ev) {
    if (act === 'close-lab') {
      close();
      return;
    }
    if (act === 'stub-asset' || act === 'stub-specimen' || act === 'stub-passport') {
      toastMsg(prlT('toastIntegrationStub'));
      return;
    }
    if (act === 'stub-save-asset') {
      toastMsg(prlT('toastSaveAssetStub'));
      return;
    }
    if (act === 'stub-passport-card' || act === 'stub-sat' || act === 'stub-vm' || act === 'stub-attach') {
      toastMsg(prlT('toastDownstreamStub'));
      return;
    }
    if (act === 'modal-bg' && ev && ev.target && ev.target.getAttribute('data-action') === 'modal-bg') {
      state.exportModal = false;
      render();
      return;
    }
    if (act === 'open-export') {
      state.exportModal = true;
      render();
      return;
    }
    if (act === 'close-export') {
      state.exportModal = false;
      render();
      return;
    }
    if (act === 'export-log') {
      exportJsonLog();
      return;
    }
    if (act === 'undo') {
      var cU = document.getElementById('mcPrlMaskCanvas');
      if (!cU || !state.undoStack.length) return toastMsg(prlT('toastNoUndoMask'));
      var ctxU = cU.getContext('2d');
      var currentSnap;
      try {
        currentSnap = ctxU.getImageData(0, 0, cU.width, cU.height);
      } catch (e0) {
        return;
      }
      var prevSnap = state.undoStack.pop();
      state.redoStack.push(currentSnap);
      restoreMaskImageData_(prevSnap);
      return;
    }
    if (act === 'redo') {
      if (!state.redoStack.length) return toastMsg(prlT('toastNoRedoMask'));
      var cR = document.getElementById('mcPrlMaskCanvas');
      if (!cR) return;
      var ctxR = cR.getContext('2d');
      var curR;
      try {
        curR = ctxR.getImageData(0, 0, cR.width, cR.height);
      } catch (e1) {
        return;
      }
      var nextSnap = state.redoStack.pop();
      state.undoStack.push(curR);
      restoreMaskImageData_(nextSnap);
      return;
    }
    if (act === 'clear-mask') {
      var cv = document.getElementById('mcPrlMaskCanvas');
      if (cv) {
        pushUndoMask_();
        cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
      }
      return;
    }
    if (act === 'batch-run') {
      processBatchReal_();
      return;
    }
    if (act === 'run-preset') {
      runPresetPipeline_();
      return;
    }
    if (act === 'run-quick-edit') {
      runQuickEdit_();
      return;
    }
    if (act === 'run-specimen-isolate') {
      runSpecimenIsolate_();
      return;
    }
    if (act === 'run-field-rescue') {
      runFieldRescueQuick_();
      return;
    }
    if (act === 'run-fossil-enhance') {
      runFossilEnhanceQuick_();
      return;
    }
    if (act === 'save-snapshot') {
      saveVersionSnapshot_();
      return;
    }
    if (act === 'batch-download-all') {
      downloadAllBatch_();
      return;
    }
    if (act === 'reset-original') {
      resetToOriginal_();
      return;
    }
    if (act === 'run-plate-stack') {
      runPlateStack_({ upscale: true });
      return;
    }
    if (act === 'run-archive-repair') {
      runArchiveRepair_();
      return;
    }
    if (act === 'apply-grade') {
      runProviderOp_('grade', { fromPanel: true });
      return;
    }
    if (act === 'test-iopaint') {
      toastMsg(prlT('iopaintTesting'));
      refreshOssHealth_().then(function () {
        if (state.localInpaintStatus === 'online') {
          toastMsg(prlT('iopaintOnline') + (state.iopaintCurrentModel ? ' (' + state.iopaintCurrentModel + ')' : ''));
        } else {
          toastMsg(prlT('iopaintOffline'));
        }
      });
      return;
    }
    if (act === 'refresh-oss') {
      toastMsg(prlT('ossRefreshing'));
      refreshOssHealth_().then(function () {
        toastMsg(prlT('ossRefreshDone'));
      });
      return;
    }
    if (act === 'split-view') {
      state.splitView = !state.splitView;
      render();
      return;
    }
    if (act === 'toggle-sheet') {
      state.mobileSheet = !state.mobileSheet;
      render();
    }
  }

  function triggerCapturePicker_() {
    var el =
      document.getElementById('mcPrlFileCapture') ||
      document.getElementById('mcPrlFileCaptureHero');
    if (el) el.click();
  }

  function wantsCaptureDeepLink_() {
    try {
      var q = new URLSearchParams(String((global.location && global.location.search) || ''));
      if (q.get('capture') === '1') return true;
      var h = String((global.location && global.location.hash) || '');
      return /capture=1/.test(h);
    } catch (e) {
      return false;
    }
  }

  function mountPhotoRestorationLab() {
    var shell = document.getElementById(SHELL_ID);
    if (shell) shell.hidden = false;
    syncAutoCapturePref_();
    syncAutoRunPresetPref_();
    if (global.MCPrlLocalInpaint && typeof global.MCPrlLocalInpaint.getBaseUrl === 'function') {
      state.iopaintBaseUrl = global.MCPrlLocalInpaint.getBaseUrl();
    }
    state.gradeParams = readGradeParams_();
    refreshOssHealth_();
    try {
      localStorage.setItem(STORAGE_ACTIVE, state.project.id);
    } catch (e) {}
    render();
    if (wantsCaptureDeepLink_()) {
      setTimeout(function () {
        triggerCapturePicker_();
      }, 450);
    }
    try {
      if (shell) shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e2) {}
  }

  function hidePhotoRestorationShell() {
    var shell = document.getElementById(SHELL_ID);
    if (shell) shell.hidden = true;
  }

  function open() {
    try {
      if (typeof switchSection === 'function') switchSection('photo-restoration-lab');
    } catch (e) {}
  }

  function close() {
    hidePhotoRestorationShell();
    try {
      window.location.hash = '#/section/dashboard';
    } catch (e) {}
    try {
      if (typeof switchSection === 'function') switchSection('dashboard');
    } catch (e2) {}
    try {
      if (window.MCRouter && typeof window.MCRouter.render === 'function') window.MCRouter.render();
    } catch (e3) {}
  }

  function routeOpen() {
    try {
      if (typeof enterApp === 'function' && !document.documentElement.classList.contains('mc-entered')) {
        enterApp();
      }
    } catch (e) {}
    open();
    mountPhotoRestorationLab();
  }

  window.renderPhotoRestorationLabRoute_ = function () {
    routeOpen();
  };

  try {
    if (window.MCRoute && typeof window.MCRoute.subscribe === 'function') {
      window.MCRoute.subscribe(function (sectionName) {
        if (sectionName === 'photo-restoration-lab') {
          try {
            window.location.hash = '#/section/photo-restoration-lab';
          } catch (eH) {}
          mountPhotoRestorationLab();
        } else {
          hidePhotoRestorationShell();
        }
      });
    }
  } catch (eSub) {}

  global.addEventListener('mc:localechange', function () {
    var shell = global.document.getElementById(SHELL_ID);
    if (shell && !shell.hidden && typeof render === 'function') render();
  });

  function refreshPhotoRestorationLabI18n_() {
    if (typeof render === 'function') render();
  }

  global.refreshPhotoRestorationLabI18n = refreshPhotoRestorationLabI18n_;
  window.refreshPhotoRestorationLabI18n = refreshPhotoRestorationLabI18n_;

  window.MCPhotoRestorationLab = {
    open: open,
    close: close,
    mount: mountPhotoRestorationLab,
    hideShell: hidePhotoRestorationShell,
    refreshI18n: refreshPhotoRestorationLabI18n_,
    getState: function () {
      return state;
    },
    getProject: function () {
      return state.project;
    },
    adapters: adapters,
    MockAIPhotoRestorationProvider: MockAIPhotoRestorationProvider,
    BrowserRembgProvider: BrowserRembgProvider,
    getPresets: getPresets_,
    shouldUseBrowserRembg: shouldUseBrowserRembg_
  };
})(typeof window !== 'undefined' ? window : this);
