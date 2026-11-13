/**
 * MCurator — Husbandry Log: Living Care Card Console (v6)
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'mcHusbandryLogRoot';
  var SHELL_ID = 'mcHusbandryLogShell';
  var TOUR_HOST_ID = 'hlcTourHost';
  var LS_KEY = 'mc_hl_v7';
  var INTRO_TOUR_VERSION = 3;
  var I18N = function () { return global.MCHusbandryLogI18n || { zhTW: {}, en: {}, filterChips: {}, recordLabels: { zhTW: {}, en: {} }, sectionKeys: {} }; };
  var STATUS_API = function () { return global.MCInsectStatusOptions || null; };
  var PROFILES = function () { return global.MCSpeciesCareProfiles || null; };
  var SPECIES_SEARCH = function () { return global.MCHusbandrySpeciesSearch || null; };
  var CATEGORIES = function () { return global.MCHusbandryCareCategories || null; };
  var LABEL_API = function () { return global.MCHusbandryLabelTemplates || null; };
  var CHOICES_API = function () { return global.MCHusbandryRecordChoices || null; };
  var ILLUSTRATIONS = function () { return global.MCHusbandryPetIllustrations || null; };
  var BREEDING = function () { return global.MCHusbandryBreeding || null; };
  var CARE_GUIDE = function () { return global.MCHusbandryCareGuide || null; };
  var WIZARD = function () { return global.MCHusbandryAddPetWizard || null; };
  var DATA_EXPORT = function () { return global.MCHusbandryDataExport || null; };
  var OFFLINE = function () { return global.MCHusbandryOffline || null; };
  var QR_MOD = function () { return global.MCHusbandryQr || null; };
  var TRENDS_MOD = function () { return global.MCHusbandryTrends || null; };
  var BATCH_MOD = function () { return global.MCHusbandryBatch || null; };

  function moduleCtx_() {
    return {
      state: state,
      t: t,
      esc: esc,
      isEn: isEn,
      genId: genId,
      todayKey: todayKey,
      svgIcon: svgIcon,
      getActivePet: getActivePet,
      saveState: saveState,
      render: render,
      closeSheet: closeSheet,
      clearToast: function () {
        global.setTimeout(function () { state.toast = null; render(); }, 2000);
      },
      downloadText: function (filename, text, mime) {
        var blob = new Blob([text], { type: mime || 'text/plain' });
        var a = global.document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      },
      el: null,
      recordLabel: recordLabel_,
      petLogs: petLogs,
      weeklyCareStats: weeklyCareStats_,
      buildDailyCompletionSeries: buildDailyCompletionSeries_,
      priorityTasks: priorityTasks,
    };
  }

  function breedingCtx_() { return moduleCtx_(); }
  function careGuideCtx_() {
    var ctx = moduleCtx_();
    ctx.petNeedsAttention = function (pet) { return cardStatusTone_(pet) !== 'ok'; };
    ctx.petStatusLabel = function (pet) { return cardTodayStatus(pet); };
    return ctx;
  }
  function wizardCtx_() {
    var ctx = moduleCtx_();
    ctx.genHusbandryId = genHusbandryId;
    ctx.enrichPet = enrichPet;
    ctx.addLog = addLog;
    ctx.petQrUrl = petQrUrl;
    ctx.defaultLabelSettings = defaultLabelSettings;
    return ctx;
  }

  var STAGE_OPTS = [
    { value: 'egg', labelKey: 'guideLifeStage_egg' },
    { value: 'larva', labelKey: 'guideLifeStage_larva' },
    { value: 'nymph', labelKey: 'guideLifeStage_nymph' },
    { value: 'juvenile', labelKey: 'stageJuvenile' },
    { value: 'subadult', labelKey: 'stageSubadult' },
    { value: 'adult', labelKey: 'stageAdult' },
    { value: 'pupa', labelKey: 'guideLifeStage_pupa' },
    { value: 'senior', labelKey: 'guideLifeStage_senior' },
    { value: 'breeding', labelKey: 'wizardLifeStage_breeding' },
    { value: 'unknown', labelKey: 'wizardLifeStage_unknown' },
  ];

  var STAGE_OPTS_BY_DECK = {
    'beetle-larva': ['egg', 'larva', 'pupa', 'unknown'],
    'beetle-adult': ['subadult', 'adult', 'breeding', 'egg', 'unknown'],
    'chick-bird': ['egg', 'juvenile', 'unknown'],
    'finch-bird': ['egg', 'juvenile', 'subadult', 'adult', 'breeding', 'senior', 'unknown'],
    'parrot-bird': ['egg', 'juvenile', 'subadult', 'adult', 'breeding', 'senior', 'unknown'],
    aquarium: ['juvenile', 'subadult', 'adult', 'breeding', 'unknown'],
    'marine-fish': ['juvenile', 'subadult', 'adult', 'breeding', 'unknown'],
    mantis: ['egg', 'nymph', 'subadult', 'adult', 'unknown'],
    'general-insect': ['egg', 'larva', 'nymph', 'pupa', 'subadult', 'adult', 'unknown'],
  };

  var STAGE_OPTS_DEFAULT = ['juvenile', 'subadult', 'adult', 'senior', 'breeding', 'unknown'];

  var PHOTO_OPTS = [
    { value: 'growth', labelKey: 'photoGrowth' },
    { value: 'health', labelKey: 'photoBody' },
    { value: 'enclosure', labelKey: 'photoEnclosure' },
    { value: 'abnormal', labelKey: 'photoAbnormal' },
    { value: 'molting', labelKey: 'photoMolting' },
    { value: 'breeding', labelKey: 'photoBreeding' },
    { value: 'daily', labelKey: 'photoDaily' },
    { value: 'other', labelKey: 'photoOther' },
  ];

  var FEED_OPTS = [
    { value: 'ate', labelKey: 'feedAte' },
    { value: 'ate_less', labelKey: 'feedAteLess' },
    { value: 'refused', labelKey: 'feedRefused' },
    { value: 'vomit', labelKey: 'feedVomit' },
  ];

  var FEED_SUPPLEMENT_OPTS = [
    { value: 'calcium', labelKey: 'supplementCalcium' },
    { value: 'vitamin', labelKey: 'supplementVitamin' },
    { value: 'none', labelKey: 'supplementNone' },
  ];

  var RECORD_META = {
    photo: { titleKey: 'recordPhoto', hintKey: 'hintPhoto', icon: 'camera', logType: 'photo' },
    insect_status: { titleKey: 'recordInsectStatus', hintKey: 'hintStatus', icon: 'status', logType: 'insect_status' },
    feeding: { titleKey: 'recordFeeding', hintKey: 'hintFeeding', icon: 'feeding', logType: 'feeding' },
    substrate: { titleKey: 'recordSubstrate', hintKey: 'hintSubstrate', icon: 'substrate', logType: 'environment', envKey: 'Substrate condition' },
    instar: { titleKey: 'recordInstar', hintKey: 'hintInstar', icon: 'instar', logType: 'instar' },
    weight: { titleKey: 'recordWeight', hintKey: 'hintWeight', icon: 'weight', logType: 'weight' },
    substrate_change: { titleKey: 'recordSubstrateChange', hintKey: 'hintSubstrateChange', icon: 'substrate', logType: 'environment', envKey: 'Substrate replacement' },
    abnormality: { titleKey: 'recordAbnormality', hintKey: 'hintAbnormality', icon: 'alert', logType: 'abnormality' },
    frass: { titleKey: 'recordFrass', hintKey: 'hintSubstrate', icon: 'substrate', logType: 'environment', envKey: 'Frass amount' },
    pupation: { titleKey: 'recordPupation', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Pupation' },
    temperature: { titleKey: 'recordTemperature', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Temperature' },
    humidity: { titleKey: 'recordHumidity', hintKey: 'hintSubstrate', icon: 'substrate', logType: 'environment', envKey: 'Humidity' },
    note: { titleKey: 'recordNote', hintKey: 'hintStatus', icon: 'note', logType: 'note' },
  };

  (function mergeRecordMeta_() {
    var ext = global.MCHusbandryRecordDecks;
    if (ext && ext.extraMeta) {
      Object.keys(ext.extraMeta).forEach(function (k) {
        if (!RECORD_META[k]) RECORD_META[k] = ext.extraMeta[k];
      });
    }
  })();

  var RECORD_DECKS = {
    'beetle-larva': {
      main: ['photo', 'insect_status', 'feeding', 'instar', 'weight', 'substrate', 'substrate_change', 'frass', 'pupation', 'abnormality'],
      more: [],
    },
    mantis: {
      main: ['photo', 'insect_status', 'feeding', 'substrate', 'instar', 'weight', 'abnormality', 'note'],
      more: ['temperature', 'humidity'],
    },
    arachnid: {
      main: ['photo', 'insect_status', 'feeding', 'substrate', 'weight', 'abnormality', 'note', 'temperature'],
      more: ['humidity'],
    },
    default: {
      main: ['photo', 'insect_status', 'feeding', 'substrate', 'weight', 'abnormality', 'note', 'temperature'],
      more: ['humidity'],
    },
  };

  var QUEST_ICONS = {
    'Check substrate moisture': 'substrate',
    'Log weight or size': 'weight',
    'Observe frass amount': 'substrate',
    'Check temperature': 'status',
    'Note activity level': 'status',
    'Log feeding response': 'feeding',
    'Check humidity': 'substrate',
    'Observe perching condition': 'status',
    'Watch for molting signs': 'instar',
    'Upload daily photo': 'camera',
    GUIDE_CHECK_HUMIDITY: 'substrate',
    GUIDE_CHECK_SKIN: 'status',
    GUIDE_CHECK_FEEDING: 'feeding',
    GUIDE_REMOVE_UNEATEN: 'feeding',
    GUIDE_CHECK_HIDE_SUBSTRATE: 'substrate',
    GUIDE_CHECK_WATER_TEMP: 'status',
    GUIDE_CHECK_GILLS: 'status',
    GUIDE_CHECK_WATER_QUALITY: 'flask',
    GUIDE_CHECK_SUBSTRATE: 'substrate',
    GUIDE_CHECK_JELLY_DRY: 'feeding',
    GUIDE_CHECK_ACTIVITY: 'status',
    GUIDE_REMOVE_MOLDY_FOOD: 'feeding',
    GUIDE_CHECK_UPSIDE_DOWN: 'status',
    GUIDE_CHECK_SUBSTRATE_MOISTURE: 'substrate',
    GUIDE_CHECK_MOLD: 'substrate',
    GUIDE_CHECK_LARVA_ACTIVITY: 'substrate',
    GUIDE_LOG_WEIGHT_DUE: 'weight',
    GUIDE_PUPA_QUIET: 'instar',
    GUIDE_CHECK_VENTILATION: 'status',
    GUIDE_CHECK_MOLT_SPACE: 'instar',
    GUIDE_CHECK_MOLT_SIGNS: 'instar',
    GUIDE_REFRESH_FOOD_PLANT: 'feeding',
    GUIDE_LOG_EGGS: 'status',
    GUIDE_CHECK_NEST_HUMIDITY: 'substrate',
    GUIDE_CHECK_ESCAPE_PROOF: 'alert',
    GUIDE_CHECK_QUEEN: 'status',
    GUIDE_COUNT_BROOD: 'note',
    GUIDE_MINIMIZE_VIBRATION: 'status',
    GUIDE_OBSERVE_EGG_LAYING: 'status',
    GUIDE_WATCH_PAIR_BEHAVIOR: 'status',
    GUIDE_CHECK_TEMP_GRADIENT: 'thermometer',
    GUIDE_CHECK_SHED_RETENTION: 'instar',
    GUIDE_CHECK_STOOL: 'substrate',
    GUIDE_CHECK_HOT_COLD: 'thermometer',
    GUIDE_CHECK_HIDE: 'status',
    GUIDE_CHECK_FEEDING_SCHEDULE: 'feeding',
    GUIDE_CHECK_SHEDDING: 'instar',
    GUIDE_CHECK_UVB: 'sun',
    GUIDE_CHECK_BASKING: 'thermometer',
    GUIDE_CHECK_CALCIUM: 'feeding',
    GUIDE_CHECK_SOAK: 'droplet',
    GUIDE_CHECK_SHELL: 'status',
    GUIDE_CHECK_FILTER_QUALITY: 'waves',
    GUIDE_CHECK_SHELL_EYES: 'status',
    GUIDE_CHECK_RESPIRATION: 'activity',
    GUIDE_CHECK_WATER_STABILITY: 'flask',
    GUIDE_CHECK_MOLT: 'instar',
    GUIDE_MINIMIZE_STRESS: 'status',
    GUIDE_CHECK_AGGRESSION: 'activity',
    GUIDE_CHECK_LIGHTING: 'sun',
    GUIDE_CHECK_CO2: 'flask',
    GUIDE_CHECK_ALGAE: 'alert',
    GUIDE_CHECK_TRIM: 'substrate',
    GUIDE_CHECK_SALINITY: 'flask',
    GUIDE_CHECK_MARINE_SURFACE: 'status',
    GUIDE_CHECK_SKIMMER_FILTER: 'waves',
    GUIDE_CHECK_FLOW: 'waves',
    GUIDE_CHECK_AQUARIUM_LIGHT: 'sun',
    GUIDE_CHECK_ALKALINITY_MINERALS: 'flask',
    GUIDE_CHECK_CORAL_OPEN: 'status',
    GUIDE_CHECK_ANEMONE_TENTACLES: 'status',
    GUIDE_CHECK_ANEMONE_POSITION: 'activity',
    GUIDE_CHECK_SHELL_OPTIONS: 'status',
    GUIDE_CHECK_NUTRIENTS: 'flask',
    GUIDE_CHECK_EQUIPMENT: 'waves',
    GUIDE_CHECK_FOOD_WATER: 'feeding',
    GUIDE_CHECK_DROPPINGS: 'substrate',
    GUIDE_CHECK_FEATHERS_SPIRIT: 'status',
    GUIDE_CLEAN_TRAY: 'substrate',
    GUIDE_CHECK_CAGE_SAFETY: 'alert',
    GUIDE_CHECK_TOYS_CHEW: 'status',
    GUIDE_CHECK_SOCIAL: 'activity',
    GUIDE_CHECK_WARMTH: 'thermometer',
    GUIDE_CHECK_FEEDING_FREQUENCY: 'feeding',
    GUIDE_CHECK_CROP: 'feeding',
    GUIDE_CHECK_WEIGHT: 'weight',
    GUIDE_CHECK_DRINKING: 'feeding',
    GUIDE_CHECK_WHEEL_SAFETY: 'status',
    GUIDE_CHECK_SUBSTRATE_DROPPINGS: 'substrate',
    GUIDE_CHECK_HAY: 'feeding',
    GUIDE_CHECK_TEETH: 'status',
    GUIDE_CHECK_FUR: 'status',
    GUIDE_CHECK_TEMPERATURE: 'thermometer',
    GUIDE_CHECK_FOOT_PADS: 'status',
    GUIDE_CHECK_DUST_BATH: 'substrate',
    GUIDE_CHECK_MAMMAL_ACTIVITY: 'activity',
    GUIDE_CHECK_WATER_DISH: 'substrate',
    GUIDE_CHECK_PREMOLT: 'instar',
    GUIDE_CHECK_WET_DRY_ZONE: 'substrate',
    GUIDE_CHECK_LEAF_LITTER: 'substrate',
    GUIDE_CHECK_COLONY_DENSITY: 'note',
    GUIDE_CHECK_FRESH_SALT_WATER: 'flask',
    GUIDE_CHECK_DEEP_SUBSTRATE: 'substrate',
    GUIDE_CHECK_PLANT_STATUS: 'status',
  };

  function lang() {
    try {
      if (typeof global.mcGetLang === 'function') {
        var mc = global.mcGetLang();
        if (mc === 'en' || mc === 'en-001' || mc === 'en-US' || mc === 'en-GB') return 'en';
        if (mc === 'ja-JP') return 'ja';
        if (mc === 'de-DE') return 'de';
        return 'zhTW';
      }
    } catch (eMc) {
      void 0;
    }
    try {
      var sl = typeof global.state !== 'undefined' && global.state && global.state.lang;
      if (sl === 'en' || sl === 'en-001' || sl === 'en-US' || sl === 'en-GB') return 'en';
      if (sl === 'ja-JP') return 'ja';
      if (sl === 'de-DE') return 'de';
      if (sl === 'zh-TW') return 'zhTW';
    } catch (e0) {
      void 0;
    }
    try {
      var loc = global.MC_LOCALE;
      if (loc === 'en' || loc === 'en-001' || loc === 'en-US' || loc === 'en-GB') return 'en';
      if (loc === 'ja-JP') return 'ja';
      if (loc === 'de-DE') return 'de';
      if (loc === 'zh-TW') return 'zhTW';
    } catch (e1) {
      void 0;
    }
    return 'zhTW';
  }

  function isEn() { return lang() === 'en'; }

  function hlVernacularRecord_(rec) {
    rec = rec || {};
    var snap = rec.profileSnapshot || {};
    return {
      scientificName: rec.scientificName || snap.scientificName || '',
      commonName: rec.commonName || snap.commonName || '',
      commonNameZh: rec.chineseName || rec.commonNameZh || snap.chineseName || snap.commonNameZh || '',
      commonNameEn: rec.commonNameEn || snap.commonNameEn || '',
      commonNameJa: rec.commonNameJa || snap.commonNameJa || '',
      commonNameDe: rec.commonNameDe || snap.commonNameDe || '',
      localizedNames: rec.localizedNames,
    };
  }

  function hlLocalizedCommonName_(rec) {
    if (typeof mcLocalizedCommonNameForUi === 'function') {
      return mcLocalizedCommonNameForUi(hlVernacularRecord_(rec));
    }
    var vr = hlVernacularRecord_(rec);
    var l = lang();
    if (l === 'en') return vr.commonNameEn || vr.scientificName || '';
    if (l === 'ja') return vr.commonNameJa || vr.scientificName || '';
    if (l === 'de') return vr.commonNameDe || vr.scientificName || '';
    return vr.commonNameZh || vr.scientificName || '';
  }

  /** Locale key for choice/label APIs that expect zhTW | en | ja | de. */
  function labelLang_() {
    var l = lang();
    if (l === 'en') return 'en';
    if (l === 'ja') return 'ja';
    if (l === 'de') return 'de';
    return 'zhTW';
  }

  function pickBi_(o) {
    if (!o) return '';
    if (typeof global.mcPick === 'function' && (o.zh != null || o.en != null || o.ja != null || o.de != null)) {
      return global.mcPick(o);
    }
    var l = lang();
    if (l === 'en') return o.en || o.zhTW || o.zh || '';
    if (l === 'ja') return o.ja || o.en || o.zhTW || o.zh || '';
    if (l === 'de') return o.de || o.en || o.zhTW || o.zh || '';
    return o.zhTW || o.zh || o.en || o.ja || o.de || '';
  }

  function englishLocaleCode_() {
    try {
      if (typeof global.mcGetLang === 'function') {
        var mc = global.mcGetLang();
        if (mc === 'en-GB' || mc === 'en-US' || mc === 'en-001' || mc === 'en') return mc === 'en' ? 'en-001' : mc;
      }
    } catch (e0) {}
    try {
      var sl = global.state && global.state.lang;
      if (sl === 'en-GB' || sl === 'en-US' || sl === 'en-001') return sl;
      if (sl === 'en') return 'en-001';
    } catch (e1) {}
    return 'en-001';
  }

  function applyEnglishRegional_(text) {
    if (!text) return text;
    var api = global.MCEnglishSpelling;
    if (!api) return text;
    var code = englishLocaleCode_();
    if (code === 'en-GB' && typeof api.applyBritishSpelling === 'function') {
      return api.applyBritishSpelling(text);
    }
    if (code === 'en-US' && typeof api.applyAmericanSpelling === 'function') {
      return api.applyAmericanSpelling(text);
    }
    return text;
  }

  function t(key) {
    var copy = global.MCHusbandryLogCopy;
    if (copy && copy[key] && typeof global.mcPick === 'function') {
      var picked = global.mcPick(copy[key]);
      return lang() === 'en' ? applyEnglishRegional_(picked) : picked;
    }
    var l = lang();
    var bag = I18N();
    var pack = bag[l] || {};
    var enPack = bag.en || {};
    var val = pack[key];
    /* ja/de must never fall back to zh-TW for product UI. */
    if (val == null || val === '') {
      if (l === 'ja' || l === 'de') val = enPack[key];
      else if (l === 'en') val = enPack[key];
      else val = (bag.zhTW && bag.zhTW[key]) || enPack[key];
    }
    if (val == null || val === '') {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[husbandry-i18n] missing key:', key, 'locale:', l);
      }
      val = enPack[key] != null ? enPack[key] : '';
    }
    if (l === 'en') val = applyEnglishRegional_(val);
    return val;
  }

  function chipT(id) {
    var c = I18N().filterChips[id];
    return c ? pickBi_(c) : id;
  }

  function questT(k, pet) {
    if (pet && pet.customQuestLabels && pet.customQuestLabels[k]) return pet.customQuestLabels[k];
    if (String(k).indexOf('BREED_') === 0) {
      var bk = 'breedQuest_' + k;
      var v = t(bk);
      if (v !== bk) return v;
    }
    if (String(k).indexOf('GUIDE_') === 0) {
      var gk = 'guideQuest_' + k;
      var gv = t(gk);
      if (gv !== gk) return gv;
    }
    var q = I18N().questLabels && I18N().questLabels[k];
    return q ? pickBi_(q) : k;
  }

  function meterT(k) {
    var m = I18N().meterLabels && I18N().meterLabels[k];
    return m ? pickBi_(m) : k;
  }

  function focusT(k) {
    var f = I18N().focusLabels && I18N().focusLabels[k];
    return f ? pickBi_(f) : k;
  }

  function difficultyT(k) {
    var d = I18N().difficultyLabels && I18N().difficultyLabels[k];
    return d ? pickBi_(d) : k;
  }

  function recordT(k) {
    var rl = I18N().recordLabels[lang()] || I18N().recordLabels.en || I18N().recordLabels.zhTW || {};
    return rl[k] || k;
  }

  function sectionT(sk) {
    var keys = I18N().sectionKeys[sk];
    return keys ? t(keys) : sk;
  }

  function optLabel(o) {
    if (!o) return '';
    var api = STATUS_API();
    var ll = labelLang_();
    if (api && api.labelOption) return api.labelOption(o, ll);
    if (ll === 'en') return o.en || o.zhTW || o.zh || '';
    if (ll === 'ja') return o.ja || o.en || o.zhTW || o.zh || '';
    return o.zhTW || o.zh || o.en || o.ja || '';
  }

  function stageOptsForPet(pet) {
    if (!pet) return STAGE_OPTS.filter(function (o) { return STAGE_OPTS_DEFAULT.indexOf(o.value) >= 0; });
    var deck = inferCareTypeKey_(pet);
    var allowed = STAGE_OPTS_BY_DECK[deck] || STAGE_OPTS_DEFAULT;
    return STAGE_OPTS.filter(function (o) { return allowed.indexOf(o.value) >= 0; });
  }

  function stageLabel(pet) {
    if (pet.instarLabel && !STAGE_OPTS.some(function (o) { return o.value === pet.instarLabel; })) {
      return pet.instarLabel;
    }
    var o = STAGE_OPTS.filter(function (x) { return x.value === pet.lifeStage; })[0];
    return o ? t(o.labelKey) : (pet.lifeStage ? pet.lifeStage : '');
  }

  function lifeStageFocusLine_(pet) {
    if (!CARE_GUIDE() || !pet) return '';
    var tip = CARE_GUIDE().getLifeStageFocusTip(state, pet, careGuideCtx_());
    if (!tip) return '';
    return isEn() ? (t('guideLifeStageFocusLabel') + ': ' + tip) : (t('guideLifeStageFocusLabel') + '：' + tip);
  }

  function canPickLifeStage(pet) {
    if (!pet) return false;
    var deck = inferCareTypeKey_(pet);
    if (STAGE_OPTS_BY_DECK[deck]) return true;
    if (!pet.instarLabel) return true;
    var inst = String(pet.instarLabel).trim();
    return STAGE_OPTS.some(function (o) {
      return o.value === inst || t(o.labelKey) === inst;
    });
  }

  function renderLifeStageChips(activeValue, attr, pet) {
    var current = activeValue || 'juvenile';
    var compact = attr === 'data-hl-life-stage';
    var opts = pet ? stageOptsForPet(pet) : STAGE_OPTS.filter(function (o) {
      return STAGE_OPTS_DEFAULT.indexOf(o.value) >= 0;
    });
    return opts.map(function (o) {
      var active = current === o.value ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + (compact ? ' hlc-chip--compact' : '') + active + '" ' + attr + '="' + esc(o.value) + '">' + esc(t(o.labelKey)) + '</button>';
    }).join('');
  }

  function renderLifeStagePipeline_(pet) {
    if (!pet || !canPickLifeStage(pet)) return '';
    var opts = stageOptsForPet(pet);
    if (opts.length < 2) return '';
    var current = pet.lifeStage || 'juvenile';
    var currentIdx = -1;
    opts.forEach(function (o, idx) { if (o.value === current) currentIdx = idx; });
    var steps = opts.map(function (o, idx) {
      var cls = 'hlc-stage-pipe__step';
      if (o.value === current) cls += ' is-current';
      else if (currentIdx >= 0 && idx < currentIdx) cls += ' is-done';
      var arrow = idx < opts.length - 1 ? '<span class="hlc-stage-pipe__arrow" aria-hidden="true">→</span>' : '';
      return '<span class="' + cls + '">' + esc(t(o.labelKey)) + '</span>' + arrow;
    }).join('');
    return (
      '<div class="hlc-stage-pipe">' +
      '<p class="hlc-stage-pipe__label">' + esc(t('lifeStagePipelineLabel')) + '</p>' +
      '<div class="hlc-stage-pipe__track" role="list">' + steps + '</div>' +
      '<p class="hlc-stage-pipe__current">' + esc(t('lifeStageCurrentLabel')) + esc(stageLabel(pet)) + '</p>' +
      '</div>'
    );
  }

  function renderTrendMilestoneTimeline_(pet) {
    var api = trendsApi_();
    if (api) return api.renderTrendMilestoneTimeline(pet);
  }


  function syncPetDailyTasks_(pet) {
    if (CARE_GUIDE() && pet) CARE_GUIDE().syncCareGuideTasksToPet(state, pet, careGuideCtx_());
  }

  function setPetLifeStage(pet, value) {
    if (!pet || !value) return;
    pet.lifeStage = value;
    if (canPickLifeStage(pet)) pet.instarLabel = '';
    syncPetDailyTasks_(pet);
    saveState();
    render();
  }

  function isLikelyScientificName(value) {
    var text = String(value || '').trim();
    if (!text || text.length < 3) return false;
    if (/^(幼體|亞成體|成體|juvenile|subadult|adult)$/i.test(text)) return false;
    if (/^[\u4e00-\u9fff\u3000\s，、：；]+$/.test(text)) return false;
    return /[A-Za-z]{2,}/.test(text);
  }

  function speciesDisplayName(p) {
    return hlLocalizedCommonName_(p);
  }

  function petScientificName(pet) {
    if (!pet) return '';
    var candidates = [
      pet.scientificName,
      pet.profileSnapshot && pet.profileSnapshot.scientificName,
    ];
    var api = PROFILES();
    if (api && pet.speciesId && typeof api.getProfile === 'function') {
      var prof = api.getProfile(pet.speciesId);
      if (prof && prof.scientificName) candidates.unshift(prof.scientificName);
    }
    if (api && typeof api.findByVernacular === 'function') {
      var names = [pet.chineseName, pet.commonName, pet.petName];
      for (var i = 0; i < names.length; i++) {
        if (!names[i]) continue;
        var hit = api.findByVernacular(names[i]);
        if (hit && hit.scientificName) candidates.unshift(hit.scientificName);
      }
    }
    for (var i = 0; i < candidates.length; i++) {
      if (isLikelyScientificName(candidates[i])) return String(candidates[i]).trim();
    }
    return '';
  }

  function syncPetTaxonomy(pet) {
    if (!pet) return false;
    var changed = false;
    var api = PROFILES();
    var snap = pet.profileSnapshot;
    var speciesId = pet.speciesId || '';
    var fromCatalog = speciesId && api && typeof api.getProfile === 'function' &&
      speciesId.indexOf('care-type-') !== 0 &&
      speciesId.indexOf('tax-') !== 0 &&
      speciesId.indexOf('custom-') !== 0;

    function set(field, value) {
      if (value == null || value === '') return;
      if (pet[field] !== value) {
        pet[field] = value;
        changed = true;
      }
    }

    if (fromCatalog) {
      var catalogProf = api.getProfile(speciesId);
      if (catalogProf) {
        applyCatalogProf_(catalogProf);
      }
    } else if (api) {
      var catalogEntry = null;
      var sciCandidate = pet.scientificName || (snap && snap.scientificName) || '';
      if (isLikelyScientificName(sciCandidate) && typeof api.findByScientificName === 'function') {
        catalogEntry = api.findByScientificName(sciCandidate);
      }
      if (!catalogEntry && typeof api.findByVernacular === 'function') {
        var names = [pet.chineseName, pet.commonName, snap && snap.chineseName, snap && snap.commonName, pet.petName];
        for (var ni = 0; ni < names.length && !catalogEntry; ni++) {
          if (names[ni]) catalogEntry = api.findByVernacular(names[ni]);
        }
      }
      if (catalogEntry && typeof api.getProfile === 'function') {
        var matchedProf = api.getProfile(catalogEntry.id);
        if (matchedProf) {
          applyCatalogProf_(matchedProf);
          if (pet.speciesId !== catalogEntry.id) {
            pet.speciesId = catalogEntry.id;
            changed = true;
          }
        }
      } else if (snap) {
        set('chineseName', snap.chineseName);
        set('commonName', snap.commonName);
        if (isLikelyScientificName(snap.scientificName)) set('scientificName', snap.scientificName);
        set('careTypeKey', snap.careTypeKey);
        set('category', snap.category);
      }
    } else if (snap) {
      set('chineseName', snap.chineseName);
      set('commonName', snap.commonName);
      if (isLikelyScientificName(snap.scientificName)) set('scientificName', snap.scientificName);
      set('careTypeKey', snap.careTypeKey);
      set('category', snap.category);
    }

    function applyCatalogProf_(catalogProf) {
      set('chineseName', catalogProf.chineseName);
      set('commonName', catalogProf.commonName);
      if (isLikelyScientificName(catalogProf.scientificName)) {
        set('scientificName', catalogProf.scientificName);
      }
      set('careTypeKey', catalogProf.careTypeKey);
      set('category', catalogProf.category);
      if (!snap || snap.id !== catalogProf.id) {
        pet.profileSnapshot = catalogProf;
        changed = true;
      }
    }

    if (!isLikelyScientificName(pet.scientificName) && pet.scientificName) {
      pet.scientificName = '';
      changed = true;
    }

    var illApi = ILLUSTRATIONS();
    if (illApi) {
      var slug = illApi.resolveSlug(pet);
      if (slug && pet.illustrationCategory !== slug) {
        pet.illustrationCategory = slug;
        changed = true;
      }
    }
    return changed;
  }

  function speciesSearchPrimary(item) {
    return hlLocalizedCommonName_(item) || (item && item.scientificName) || '';
  }

  function speciesSearchSecondary(item) {
    if (!item) return '';
    var rec = hlVernacularRecord_(item);
    var primary = hlLocalizedCommonName_(item);
    var alt = '';
    var l = lang();
    if (l === 'en') alt = rec.commonNameZh;
    else if (l === 'ja') alt = rec.commonNameEn || rec.commonNameZh;
    else if (l === 'de') alt = rec.commonNameEn;
    else alt = rec.commonNameEn;
    alt = String(alt || '').trim();
    if (!alt || alt === primary) return '';
    return alt;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function genId() {
    return 'hl-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function defaultState() {
    return {
      phase: 'collection',
      boardTab: 'cards',
      activePetId: null,
      pets: [],
      search: '',
      category: 'all',
      selectedCareTypeId: null,
      expandedGroupId: null,
      selectedSpeciesId: null,
      profile: null,
      card: { nickname: '', sex: 'unknown', lifeStage: 'juvenile', enclosure: 'terrarium', startDate: todayKey(), profilePhoto: '', instarLabel: '' },
      careLogs: [],
      breedingPairs: [],
      breedingEvents: [],
      offspring: [],
      careGuide: {
        careGuides: {},
        careGuideCategories: [],
        careGuideProgress: {},
        activeCareGuideId: null,
        activeCareGuideIds: [],
        activeCareCategories: [],
        careReminderSettings: {},
        selectedCareCategory: 'all',
        selectedCareDifficulty: 'all',
        searchKeyword: '',
      },
      ui: {
        sheet: null,
        recordId: null,
        showMoreRecords: false,
        statusDraft: {},
        photoUrl: '',
        photoType: 'daily',
        noteText: '',
        noteExpanded: false,
        feedValue: '',
        feedFood: '',
        feedAmount: '',
        feedUnit: 'count',
        envValue: '',
        abnormalValue: '',
        instarValue: '',
        logFilter: 'all',
        missingPetId: '',
        labelTemplate: 'standard_enclosure',
        privacyDraft: 'private',
        speciesLocal: [],
        speciesRemote: [],
        speciesLoading: false,
        speciesSearchSeq: 0,
        choiceValue: '',
        editingLogId: '',
        expandedLogId: '',
        confirmDeleteLogId: '',
        logDate: '',
        severity: '3',
        healthReminder: false,
        healthSymptoms: '',
        healthTreatment: '',
        healthDiscoveredAt: '',
        healthFollowUpDate: '',
        healthLinkedLogIds: [],
        healthHandleLogId: '',
        healthHandleResult: '',
        healthHandleNext: false,
        healthHandleNextDate: '',
        healthDeferDays: 3,
        useTemplate: false,
        collectionSearch: '',
        collectionFilter: 'all',
        collectionSort: 'recent',
        feedSupplement: '',
        lightboxUrl: null,
        tourActive: false,
        tourStep: 0,
        pendingReprint: false,
        returnToScan: false,
        envStatus: '',
        healthSymptoms: '',
        breedingDraft: {},
        guideAccordionOpen: [],
        guideAdviceExpanded: false,
        guideAdviceExpandedPetId: '',
        batchMode: false,
        batchSelected: [],
        photoWallFilter: 'all',
        photoCompareA: '',
        photoCompareB: '',
        scanTab: 'overview',
        importDraft: null,
        importSummary: null,
        offlineOnline: true,
        trendRange: 7,
        trendDetailDay: '',
        timelineFocusDate: '',
        qrImportText: '',
        qrImportMode: 'paste',
        qrImportDraft: null,
        qrImportError: '',
        qrImportBusy: false,
        templatePickBusy: false,
        qrPreviewPetId: '',
        dismissedHealthReminderIds: [],
      },
      questHistory: {},
      meta: {
        lastSavedAt: null,
        saveStatus: 'ok',
        saveError: null,
      },
      toast: null,
      introTourDone: false,
      introTourVersion: 0,
      filters: {
        status: 'all',
        search: '',
        sort: 'recent',
        category: 'all',
        lifeStage: 'all',
      },
    };
  }

  function collectionFilters_() {
    if (!state.filters || typeof state.filters !== 'object') {
      state.filters = {
        status: (state.ui && state.ui.collectionFilter) || 'all',
        search: (state.ui && state.ui.collectionSearch) || '',
        sort: (state.ui && state.ui.collectionSort) || 'recent',
        category: 'all',
        lifeStage: 'all',
      };
    }
    if (!state.filters.status) state.filters.status = 'all';
    if (typeof state.filters.search !== 'string') state.filters.search = '';
    if (!state.filters.sort) state.filters.sort = 'recent';
    if (!state.filters.category) state.filters.category = 'all';
    if (!state.filters.lifeStage) state.filters.lifeStage = 'all';
    return state.filters;
  }

  function syncCollectionFiltersToUi_() {
    var filters = collectionFilters_();
    if (!state.ui) state.ui = defaultState().ui;
    state.ui.collectionSearch = filters.search;
    state.ui.collectionFilter = filters.status;
    state.ui.collectionSort = filters.sort;
  }

  function clearCollectionFilters_() {
    state.filters = { status: 'all', search: '', sort: 'recent', category: 'all', lifeStage: 'all' };
    syncCollectionFiltersToUi_();
    saveState();
    render();
  }

  function petCommonName_(pet) {
    return hlLocalizedCommonName_(pet);
  }

  function speciesStageLine_(pet) {
    var species = speciesDisplayName(pet);
    var stage = stageLabel(pet);
    if (species && stage) return species + ' · ' + stage;
    return species || stage || '';
  }

  function formatLogDateTime_(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var now = new Date();
    var startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    if (d >= startToday) return t('timeToday') + ' ' + hm;
    var startYesterday = new Date(startToday.getTime() - 86400000);
    if (d >= startYesterday) return t('timeYesterday') + ' ' + hm;
    var datePart = typeof mcFormatDate === 'function'
      ? mcFormatDate(d, { month: 'numeric', day: 'numeric' }, typeof mcGetLang === 'function' ? mcGetLang() : undefined)
      : d.toLocaleDateString(typeof mcLocaleToIntlTag === 'function' ? mcLocaleToIntlTag(typeof mcGetLang === 'function' ? mcGetLang() : undefined) : 'zh-TW', { month: 'numeric', day: 'numeric' });
    return datePart + ' ' + hm;
  }

  function photoTypeLabel_(type) {
    var hit = PHOTO_OPTS.filter(function (o) { return o.value === type; })[0];
    return hit ? t(hit.labelKey) : (type || t('photoDaily'));
  }

  function petIsBreeding_(pet) {
    if (!pet || !state.breedingPairs) return false;
    var i;
    for (i = 0; i < state.breedingPairs.length; i++) {
      var pair = state.breedingPairs[i];
      if (pair.malePetId !== pet.id && pair.femalePetId !== pet.id) continue;
      if (pair.status === 'active' || pair.status === 'observing') return true;
    }
    return false;
  }

  function petHasRecentAbnormality_(pet) {
    var logs = petLogs(pet.id);
    var cutoff = Date.now() - 14 * 86400000;
    var i;
    for (i = 0; i < logs.length; i++) {
      if (logs[i].type !== 'abnormality' && logs[i].recordId !== 'abnormality') continue;
      if (new Date(logs[i].date).getTime() >= cutoff) return true;
    }
    return false;
  }

  function lifeStageSortRank_(stage) {
    var order = ['egg', 'larva', 'nymph', 'pupa', 'juvenile', 'subadult', 'adult', 'senior', 'breeding', 'unknown'];
    var idx = order.indexOf(stage || 'unknown');
    return idx >= 0 ? idx : order.length;
  }

  var UNDO_TTL_MS = 12000;
  var pendingUndo_ = null;
  var toastClearTimer_ = null;

  function batchSelectedIds_() {
    var api = batchApi_();
    return api ? api.batchSelectedIds() : [];
  }


  function toggleBatchSelect_(petId, selected) {
    var api = batchApi_();
    if (api) return api.toggleBatchSelect(petId, selected);
  }


  function clearPendingUndo_() {
    pendingUndo_ = null;
  }

  function isPendingUndoLive_() {
    return !!(pendingUndo_ && pendingUndo_.expiresAt && Date.now() < pendingUndo_.expiresAt);
  }

  function cloneJson_(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (e) {
      return null;
    }
  }

  function snapshotQuestProgressForPets_(petIds) {
    var api = batchApi_();
    if (api) return api.snapshotQuestProgressForPets(petIds);
  }


  function restoreQuestProgressSnapshots_(snaps) {
    var api = batchApi_();
    if (api) return api.restoreQuestProgressSnapshots(snaps);
  }


  function clearToastTimer_() {
    if (toastClearTimer_) {
      global.clearTimeout(toastClearTimer_);
      toastClearTimer_ = null;
    }
  }

  function renderToastHtml_() {
    if (!state.toast) return '';
    var live = isPendingUndoLive_();
    var undoBtn = live
      ? (
        '<button type="button" class="hlc-toast__undo" data-hl-action="undo-batch">' +
        esc(t('batchUndo')) + '</button>'
      )
      : '';
    return (
      '<div class="hlc-toast' + (live ? ' hlc-toast--with-undo' : '') + '" role="status">' +
      '<span class="hlc-toast__msg">' + esc(state.toast) + '</span>' +
      undoBtn +
      '</div>'
    );
  }

  function showToast_(msg, ms) {
    clearToastTimer_();
    clearPendingUndo_();
    state.toast = msg;
    render();
    toastClearTimer_ = global.setTimeout(function () {
      state.toast = null;
      clearPendingUndo_();
      toastClearTimer_ = null;
      render();
    }, ms || 2200);
  }

  function showUndoToast_(msg, undoPayload, ms) {
    clearToastTimer_();
    var ttl = typeof ms === 'number' ? ms : UNDO_TTL_MS;
    pendingUndo_ = Object.assign({}, undoPayload || {}, {
      id: genId(),
      createdAt: Date.now(),
      expiresAt: Date.now() + ttl,
    });
    state.toast = msg;
    render();
    toastClearTimer_ = global.setTimeout(function () {
      state.toast = null;
      clearPendingUndo_();
      toastClearTimer_ = null;
      render();
    }, ttl);
  }

  function performBatchUndo_() {
    if (!isPendingUndoLive_()) {
      clearPendingUndo_();
      showToast_(t('batchUndoExpired'), 2600);
      return;
    }
    var undo = pendingUndo_;
    clearToastTimer_();
    clearPendingUndo_();
    var backupPets = cloneJson_(state.pets);
    var backupLogs = cloneJson_(state.careLogs);
    var backupBreeding = {
      breedingPairs: cloneJson_(state.breedingPairs || []),
      breedingEvents: cloneJson_(state.breedingEvents || []),
      offspring: cloneJson_(state.offspring || []),
    };
    try {
      if (undo.kind === 'batch-logs') {
        var removeSet = {};
        (undo.logIds || []).forEach(function (id) { removeSet[id] = true; });
        state.careLogs = (state.careLogs || []).filter(function (l) { return !removeSet[l.id]; });
        restoreQuestProgressSnapshots_(undo.questSnapshots);
      } else if (undo.kind === 'batch-quests') {
        restoreQuestProgressSnapshots_(undo.questSnapshots);
      } else if (undo.kind === 'batch-delete') {
        state.pets = (undo.petsSnapshot || []).concat(state.pets || []);
        state.careLogs = (undo.logsSnapshot || []).concat(state.careLogs || []);
      } else {
        throw new Error('unknown_undo');
      }
      if (!saveState()) throw new Error('persist_failed');
      showToast_(t('batchUndoDone'), 2200);
    } catch (e) {
      state.pets = backupPets || state.pets;
      state.careLogs = backupLogs || state.careLogs;
      state.breedingPairs = backupBreeding.breedingPairs || state.breedingPairs;
      state.breedingEvents = backupBreeding.breedingEvents || state.breedingEvents;
      state.offspring = backupBreeding.offspring || state.offspring;
      try { saveState(); } catch (e2) {}
      showToast_(t('batchUndoFailed'), 3200);
    }
  }

  function batchLogRecord_(petIds, recordId, logType, note) {
    var api = batchApi_();
    if (api) return api.batchLogRecord(petIds, recordId, logType, note);
  }


  function runLowRiskBatchLog_(petIds, recordId, logType, note, doneMsg) {
    var api = batchApi_();
    if (api) return api.runLowRiskBatchLog(petIds, recordId, logType, note, doneMsg);
  }


  function runLowRiskBatchCompleteTasks_(petIds) {
    var api = batchApi_();
    if (api) return api.runLowRiskBatchCompleteTasks(petIds);
  }


  function runHighRiskBatchDelete_(petIds) {
    var api = batchApi_();
    if (api) return api.runHighRiskBatchDelete(petIds);
  }


  function confirmBatch_(message) {
    var api = batchApi_();
    return api ? api.confirmBatch(message) : false;
  }


  function confirmHighRisk_(message) {
    return confirmBatch_(message);
  }

  function exportBatchCsv_(petIds) {
    var api = batchApi_();
    if (api) return api.exportBatchCsv(petIds);
  }


  function batchPrintLabels_(petIds) {
    var api = batchApi_();
    if (api) return api.batchPrintLabels(petIds);
  }


  function scanTabLocked_(pet, tab) {
    var priv = pet.privacy || 'private';
    if (priv === 'readonly' || priv === 'caregiver' || priv === 'share_code') return false;
    if (priv === 'private' && tab !== 'overview') return true;
    if (priv === 'public_summary' && (tab === 'logs' || tab === 'lineage')) return true;
    return false;
  }

  function petPhotoLogs_(pet) {
    return petLogs(pet.id).filter(function (l) { return l.photoUrl; }).sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }

  function petCollectionSearchHaystack_(pet) {
    var snap = pet.profileSnapshot;
    return [
      pet.petName,
      pet.chineseName,
      pet.commonName,
      pet.scientificName,
      pet.husbandryId,
      pet.id,
      pet.qrUrl,
      labelQrData(pet),
      snap && snap.chineseName,
      snap && snap.commonName,
      snap && snap.scientificName,
      speciesDisplayName(pet),
      petScientificName(pet),
    ].filter(Boolean).join(' ').toLowerCase();
  }

  function petMatchesCollectionSearch_(pet, query) {
    if (!query) return true;
    return petCollectionSearchHaystack_(pet).indexOf(query) >= 0;
  }

  var TOUR_STEPS = [
    {
      mode: 'welcome',
      icon: '🪴',
      titleKey: 'tourWelcomeTitle',
      leadKey: 'tourWelcomeLead',
      bulletKeys: ['tourBulletCard', 'tourBulletLog', 'tourBulletLabel'],
    },
    {
      mode: 'spotlight',
      icon: '📋',
      target: '#hlcTourShellNav',
      titleKey: 'tourNavTitle',
      bodyKey: 'tourNavBody',
      chipKeys: ['tourChipCards', 'tourChipLogs', 'tourChipTrends', 'tourChipProfile'],
    },
    {
      mode: 'spotlight',
      icon: '🃏',
      target: '#hlcTourCardZone',
      titleKey: 'tourCardsTitle',
      bodyKey: 'tourCardsBody',
    },
    {
      mode: 'spotlight',
      icon: '➕',
      target: '#hlcTourAddPet',
      titleKey: 'tourAddTitle',
      bodyKey: 'tourAddBody',
      ctaKey: 'tourAddCta',
    },
  ];

  var state = defaultState();

  function saveState() {
    if (CARE_GUIDE()) {
      CARE_GUIDE().syncActiveCareGuides(state, careGuideCtx_());
      CARE_GUIDE().buildDailyTasksForAllPets(state, state.pets, careGuideCtx_());
    }
    if (!state.meta || typeof state.meta !== 'object') {
      state.meta = { lastSavedAt: null, saveStatus: 'ok', saveError: null };
    }
    if (!state.questHistory || typeof state.questHistory !== 'object') state.questHistory = {};
    (state.pets || []).forEach(function (pet) {
      if (pet && pet.questProgress && pet.questProgress.date === todayKey()) {
        snapshotQuestDay_(pet, pet.questProgress);
      }
    });
    /* Never persist ephemeral toast / undo affordance across reload. */
    var heldToast = state.toast;
    state.toast = null;
    try {
      global.localStorage.setItem(LS_KEY, JSON.stringify(state));
      state.meta.lastSavedAt = new Date().toISOString();
      state.meta.saveStatus = 'ok';
      state.meta.saveError = null;
      if (global.MCHusbandryOffline && typeof global.MCHusbandryOffline.recordLocalSave === 'function') {
        global.MCHusbandryOffline.recordLocalSave({
          at: state.meta.lastSavedAt,
          online: !(state.ui && state.ui.offlineOnline === false),
        });
      }
      state.toast = heldToast;
      return true;
    } catch (e) {
      state.meta.saveStatus = 'error';
      state.meta.saveError = (e && e.message) ? e.message : 'storage_failed';
      state.toast = heldToast;
      return false;
    }
  }

  function downloadText_(filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    var a = global.document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportHelpers_() {
    return {
      petLogs: petLogs,
      petScientificName: petScientificName,
      cardCareBadge: cardCareBadge_,
      ensureQuestProgress: ensureQuestProgress,
      genId: genId,
      genHusbandryId: genHusbandryId,
      isEn: isEn,
      storageKey: LS_KEY,
    };
  }

  function loadState() {
    try {
      var raw = global.localStorage.getItem(LS_KEY) ||
        global.localStorage.getItem('mc_hl_v6') ||
        global.localStorage.getItem('mc_hl_v5') ||
        global.localStorage.getItem('mc_hl_v4');
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;
      state = Object.assign(defaultState(), parsed);
      if (!state.ui) state.ui = defaultState().ui;
      if (!Array.isArray(state.ui.speciesLocal)) state.ui.speciesLocal = [];
      if (!Array.isArray(state.ui.speciesRemote)) state.ui.speciesRemote = [];
      if (typeof state.ui.speciesLoading !== 'boolean') state.ui.speciesLoading = false;
      if (typeof state.ui.choiceValue !== 'string') state.ui.choiceValue = '';
      if (typeof state.introTourDone !== 'boolean') state.introTourDone = false;
      if (typeof state.introTourVersion !== 'number') state.introTourVersion = 0;
      if (state.introTourVersion < INTRO_TOUR_VERSION && !state.pets.length) {
        state.introTourDone = false;
        state.introTourVersion = INTRO_TOUR_VERSION;
      }
      if (typeof state.ui.tourActive !== 'boolean') state.ui.tourActive = false;
      if (typeof state.ui.tourStep !== 'number') state.ui.tourStep = 0;
      if (typeof state.ui.pendingReprint !== 'boolean') state.ui.pendingReprint = false;
      if (typeof state.ui.returnToScan !== 'boolean') state.ui.returnToScan = false;
      if (state.introTourDone) state.ui.tourActive = false;
      if (!state.pets) state.pets = [];
      if (state.pets.length > 0 && !state.introTourDone) state.introTourDone = true;
      if (!state.careLogs) state.careLogs = [];
      /* Ephemeral UI: never revive toast/undo after refresh. */
      state.toast = null;
      clearPendingUndo_();
      clearToastTimer_();
      if (BREEDING()) BREEDING().ensureState(state);
      if (CARE_GUIDE()) {
        CARE_GUIDE().ensureState(state, careGuideCtx_());
        CARE_GUIDE().syncActiveCareGuides(state, careGuideCtx_());
        CARE_GUIDE().buildDailyTasksForAllPets(state, state.pets, careGuideCtx_());
      }
      migrateLegacyPet(parsed);
      collectionFilters_();
      syncCollectionFiltersToUi_();
      if (state.phase === 'dashboard' || state.phase === 'board') {
        state.phase = state.activePetId ? 'board' : 'collection';
      }
      if (state.boardTab === 'care') state.boardTab = 'cards';
      if (state.phase !== 'onboard' && state.phase !== 'profile' && state.phase !== 'wizard' && !state.pets.length) {
        state.phase = 'collection';
      }
    } catch (e) {}
  }

  function migrateLegacyPet(parsed) {
    if (state.pets.length) return;
    var pet = parsed.pet;
    var profile = parsed.profile;
    if (!pet && !profile) return;
    var p = pet || {};
    var prof = profile || {};
    state.pets.push({
      id: p.id || genId(),
      petName: p.petName || parsed.card && parsed.card.nickname || '',
      speciesId: p.speciesId || parsed.selectedSpeciesId,
      chineseName: p.chineseName || prof.chineseName,
      commonName: p.commonName || prof.commonName,
      scientificName: p.scientificName || prof.scientificName,
      careTypeKey: p.careTypeKey || prof.careTypeKey,
      category: p.category || prof.category,
      lifeStage: p.lifeStage || (parsed.card && parsed.card.lifeStage) || 'juvenile',
      instarLabel: p.instarLabel || (parsed.card && parsed.card.instarLabel) || '',
      profilePhoto: p.profilePhoto || (parsed.card && parsed.card.profilePhoto) || '',
      profileSnapshot: prof,
    });
    state.activePetId = null;
    state.phase = 'collection';
  }

  function getActivePet() {
    return state.pets.filter(function (p) { return p.id === state.activePetId; })[0] || null;
  }

  function getPetProfile(pet) {
    if (!pet) return null;
    if (pet.profileSnapshot) return pet.profileSnapshot;
    var api = PROFILES();
    return api && pet.speciesId ? api.getProfile(pet.speciesId) : null;
  }

  function petLogs(petId) {
    return state.careLogs.filter(function (l) { return l.petId === petId; });
  }

  function lastLogFor(petId, types) {
    var list = typeof types === 'string' ? [types] : types;
    var logs = petLogs(petId);
    for (var i = 0; i < logs.length; i++) {
      if (list.indexOf(logs[i].type) >= 0 || list.indexOf(logs[i].recordId) >= 0) return logs[i];
    }
    return null;
  }

  function formatRelative(iso) {
    if (!iso) return t('notLoggedYet');
    var ms = Date.now() - new Date(iso).getTime();
    if (ms < 60000) return t('justNow');
    var hrs = Math.floor(ms / 3600000);
    if (hrs < 24) return t('hoursAgo').replace('{n}', String(hrs));
    var days = Math.floor(ms / 86400000);
    return t('daysAgo').replace('{n}', String(Math.max(1, days)));
  }

  function cardTodayStatus(pet) {
    var today = todayKey();
    var logs = petLogs(pet.id);
    var hasToday = logs.some(function (l) { return String(l.date).slice(0, 10) === today; });
    if (hasToday) return t('cardStatusOk');
    var lastSub = lastLogFor(pet.id, ['environment', 'insect_status']);
    if (!lastSub) return t('cardStatusNeedSubstrate');
    return t('cardStatusWatch');
  }

  function todayStatusCompact(pet) {
    var s = cardTodayStatus(pet);
    return isEn() ? (t('cardTodayPrefix') + ': ' + s) : (t('cardTodayPrefix') + s);
  }

  function ensureQuestProgress(pet) {
    var today = todayKey();
    if (!pet.questProgress || pet.questProgress.date !== today) {
      if (pet.questProgress && pet.questProgress.date) {
        snapshotQuestDay_(pet, pet.questProgress);
      }
      pet.questProgress = { date: today, done: [], skipped: [] };
    }
    if (!Array.isArray(pet.questProgress.skipped)) pet.questProgress.skipped = [];
    return pet.questProgress;
  }

  function buildQuestDaySnapshot_(pet, qp) {
    if (!pet || !qp || !qp.date) return null;
    var quests = priorityTasks(pet);
    var planned = quests.length;
    var doneKeys = Array.isArray(qp.done) ? qp.done.slice() : [];
    var skippedKeys = Array.isArray(qp.skipped) ? qp.skipped.slice() : [];
    var completed = 0;
    var skipped = 0;
    quests.forEach(function (q) {
      if (doneKeys.indexOf(q) >= 0) completed += 1;
      else if (skippedKeys.indexOf(q) >= 0) skipped += 1;
    });
    var overdue = Math.max(0, planned - completed - skipped);
    var rate = planned > 0 ? (completed / planned) : null;
    return {
      version: 2,
      source: 'snapshot',
      plannedTaskCount: planned,
      completedTaskCount: completed,
      skippedTaskCount: skipped,
      overdueTaskCount: overdue,
      completionRate: rate,
      doneKeys: doneKeys,
      skippedKeys: skippedKeys,
      /* Legacy mirrors for older readers */
      done: completed,
      total: planned,
      pct: rate == null ? null : Math.round(rate * 100),
    };
  }

  function snapshotQuestDay_(pet, qp) {
    if (!pet || !qp || !qp.date) return;
    if (!state.questHistory || typeof state.questHistory !== 'object') state.questHistory = {};
    if (!state.questHistory[pet.id]) state.questHistory[pet.id] = {};
    var snap = buildQuestDaySnapshot_(pet, qp);
    if (snap) state.questHistory[pet.id][qp.date] = snap;
  }

  function normalizeDaySnapshot_(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw.version >= 2 && raw.source === 'snapshot') {
      return {
        version: 2,
        source: 'snapshot',
        plannedTaskCount: Number(raw.plannedTaskCount) || 0,
        completedTaskCount: Number(raw.completedTaskCount) || 0,
        skippedTaskCount: Number(raw.skippedTaskCount) || 0,
        overdueTaskCount: Number(raw.overdueTaskCount) || 0,
        completionRate: raw.plannedTaskCount > 0
          ? (Number(raw.completedTaskCount) || 0) / Number(raw.plannedTaskCount)
          : (typeof raw.completionRate === 'number' ? raw.completionRate : null),
      };
    }
    /* Pre-v2 history used log-approximated or faked totals — never treat as precise rate. */
    return {
      version: 1,
      source: 'estimated',
      plannedTaskCount: null,
      completedTaskCount: typeof raw.done === 'number' ? raw.done : null,
      skippedTaskCount: null,
      overdueTaskCount: null,
      completionRate: null,
      legacyPct: typeof raw.pct === 'number' ? raw.pct : null,
    };
  }

  function dayActivityCount_(pet, dayKey) {
    return petLogs(pet.id).filter(function (l) {
      return String(l.date || '').slice(0, 10) === dayKey;
    }).length;
  }

  function buildDailyCompletionSeries_(pet, dayCount) {
    var span = dayCount || state.ui.trendRange || 7;
    if (span < 1) span = 7;
    if (span > 90) span = 90;
    var result = [];
    var now = new Date();
    var todayKeyVal = todayKey();
    var hist = (state.questHistory && state.questHistory[pet.id]) || {};
    var i;
    for (i = span - 1; i >= 0; i--) {
      var dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      var dayKey = dayStart.getFullYear() + '-' + String(dayStart.getMonth() + 1).padStart(2, '0') + '-' + String(dayStart.getDate()).padStart(2, '0');
      var label = String(dayStart.getMonth() + 1) + '/' + String(dayStart.getDate());
      var activityCount = dayActivityCount_(pet, dayKey);
      var entry = {
        dateKey: dayKey,
        label: label,
        activityCount: activityCount,
        plannedTaskCount: 0,
        completedTaskCount: 0,
        skippedTaskCount: 0,
        overdueTaskCount: 0,
        completionRate: null,
        source: 'missing',
        pct: null,
      };
      if (dayKey === todayKeyVal) {
        var qp = ensureQuestProgress(pet);
        var live = buildQuestDaySnapshot_(pet, qp);
        if (live) {
          entry.source = live.plannedTaskCount > 0 ? 'snapshot' : 'empty-plan';
          entry.plannedTaskCount = live.plannedTaskCount;
          entry.completedTaskCount = live.completedTaskCount;
          entry.skippedTaskCount = live.skippedTaskCount;
          entry.overdueTaskCount = live.overdueTaskCount;
          entry.completionRate = live.completionRate;
          entry.pct = live.pct;
        }
      } else if (hist[dayKey]) {
        var norm = normalizeDaySnapshot_(hist[dayKey]);
        if (norm) {
          entry.source = norm.source;
          entry.plannedTaskCount = norm.plannedTaskCount;
          entry.completedTaskCount = norm.completedTaskCount;
          entry.skippedTaskCount = norm.skippedTaskCount;
          entry.overdueTaskCount = norm.overdueTaskCount;
          entry.completionRate = norm.completionRate;
          entry.pct = norm.completionRate == null ? null : Math.round(norm.completionRate * 100);
          entry.legacyPct = norm.legacyPct;
        }
      } else if (activityCount > 0) {
        entry.source = 'activity';
      }
      result.push(entry);
    }
    return result;
  }

  /** @deprecated use buildDailyCompletionSeries_ */
  function weeklyCareStats_(pet, dayCount) {
    return buildDailyCompletionSeries_(pet, dayCount).map(function (d) {
      return {
        label: d.label,
        pct: d.pct == null ? 0 : d.pct,
        dateKey: d.dateKey,
        source: d.source,
        meta: d,
      };
    });
  }

  function recordTodayQuestSnapshot_(pet) {
    if (!pet) return;
    var qp = ensureQuestProgress(pet);
    snapshotQuestDay_(pet, qp);
  }

  function isQuestSkipped(pet, questKey) {
    return ensureQuestProgress(pet).skipped.indexOf(questKey) >= 0;
  }

  function toggleQuestSkip(petId, questKey) {
    var pet = state.pets.filter(function (p) { return p.id === petId; })[0];
    if (!pet) return;
    var qp = ensureQuestProgress(pet);
    var sIdx = qp.skipped.indexOf(questKey);
    var dIdx = qp.done.indexOf(questKey);
    if (sIdx >= 0) qp.skipped.splice(sIdx, 1);
    else {
      qp.skipped.push(questKey);
      if (dIdx >= 0) qp.done.splice(dIdx, 1);
    }
    saveState();
    render();
  }

  function questMatchesRecord_(qKey, recordId) {
    if (String(qKey).indexOf('GUIDE_') === 0 && CARE_GUIDE()) {
      var mapped = CARE_GUIDE().questRecordForKey(qKey);
      if (mapped && mapped === recordId) return true;
      if (qKey === 'GUIDE_CHECK_FOOD_WATER' && (recordId === 'feeding' || recordId === 'drinking')) {
        return true;
      }
    }
    var q = String(qKey).toLowerCase();
    var rules = {
      feeding: /feed|uneaten|leftover/,
      photo: /photo|upload|picture/,
      substrate: /substrate|moisture|bedding|clean|hide/,
      substrate_change: /substrate|replace|change|clean/,
      weight: /weight|size|weigh/,
      temperature: /temperature|temp/,
      humidity: /humidity|humid/,
      instar: /instar|stage|molt|larva/,
      abnormality: /health|abnormal|symptom|skin/,
      insect_status: /status|observe|activity|check/,
      water_change: /water|change|quality/,
      water_temp: /water.*temp|temp/,
      ph: /water.*qual|quality|ph/,
      ammonia: /ammonia|water.*qual|quality/,
      nitrite: /nitrite|water.*qual|quality/,
      nitrate: /nitrate|water.*qual|quality/,
      gill: /gill/,
      skin: /skin/,
      frass: /frass|waste/,
      note: /note|journal/,
    };
    var re = rules[recordId];
    return re ? re.test(q) : false;
  }

  function autoCompleteQuestsForRecord_(pet, recordId) {
    if (!pet || !recordId) return;
    var qp = ensureQuestProgress(pet);
    priorityTasks(pet).forEach(function (qKey) {
      if (questMatchesRecord_(qKey, recordId) &&
          qp.done.indexOf(qKey) < 0 &&
          qp.skipped.indexOf(qKey) < 0) {
        qp.done.push(qKey);
      }
    });
  }

  function isQuestDone(pet, questKey) {
    return ensureQuestProgress(pet).done.indexOf(questKey) >= 0;
  }

  function toggleQuest(petId, questKey) {
    var pet = state.pets.filter(function (p) { return p.id === petId; })[0];
    if (!pet) return;
    var qp = ensureQuestProgress(pet);
    var idx = qp.done.indexOf(questKey);
    if (idx >= 0) qp.done.splice(idx, 1);
    else {
      qp.done.push(questKey);
      var sIdx = qp.skipped.indexOf(questKey);
      if (sIdx >= 0) qp.skipped.splice(sIdx, 1);
    }
    saveState();
    render();
  }

  function lastLogByRecordId(petId, recordId) {
    var logs = petLogs(petId);
    for (var i = 0; i < logs.length; i++) {
      if (logs[i].recordId === recordId) return logs[i];
    }
    return null;
  }

  function inferCareTypeKey_(pet) {
    if (!pet) return 'default';
    if (pet.careTypeKey) return pet.careTypeKey;
    var hay = [
      pet.category,
      pet.chineseName,
      pet.commonName,
      pet.petName,
      speciesDisplayName(pet),
    ].filter(Boolean).join(' ').toLowerCase();
    if (/frog|amphib|蛙|角蛙|樹蛙|蠑螈|axolotl|newt|salamander|兩棲/.test(hay)) return 'aquatic-amphibian';
    if (/chick|幼鳥|hand feeding|hand-feeding/.test(hay)) return 'chick-bird';
    if (/raptor|猛禽|\bowl\b|hawk|eagle|falcon|鷹|貓頭鷹|老鷹|隼/.test(hay)) return 'raptor-bird';
    if (/parrot|鸚鵡|cockatiel|budgie|lovebird|玄鳳|虎皮|小鸚|conure|macaw/.test(hay)) return 'parrot-bird';
    if (/finch|文鳥|canary|sparrow|十姊妹|金絲雀|java sparrow|雀/.test(hay)) return 'finch-bird';
    if (/bird|鳥|avian|passerine/.test(hay) && !/fish|魚|aquarium|水族/.test(hay)) return 'finch-bird';
    if (/rabbit|bunny|兔子/.test(hay)) return 'rabbit-mammal';
    if (/guinea pig|天竺鼠|cavy/.test(hay)) return 'guinea-pig-mammal';
    if (/chinchilla|龍貓/.test(hay)) return 'chinchilla-mammal';
    if (/hedgehog|刺蝟/.test(hay)) return 'hedgehog-mammal';
    if (/sugar glider|蜜袋鼯/.test(hay)) return 'sugar-glider-mammal';
    if (/hamster|倉鼠|gerbil|沙鼠|mouse|小鼠|rat|大鼠|syrian|dwarf/.test(hay)) return 'hamster-mammal';
    if (/small mammal|small_mammals/.test(hay)) return 'hamster-mammal';
    if (/land hermit|陸寄居蟹/.test(hay)) return 'land-hermit-arthropod';
    if (/centipede|蜈蚣/.test(hay)) return 'centipede-arthropod';
    if (/scorpion|蠍/.test(hay)) return 'scorpion-arthropod';
    if (/isopod|等足|鼠婦|潮蟲/.test(hay)) return 'isopod-arthropod';
    if (/millipede|馬陸/.test(hay)) return 'millipede-arthropod';
    if (/terrarium|vivarium|生態缸|雨林缸/.test(hay)) return 'terrarium-vivarium';
    if (/plant|食蟲植物|蘭花|moss|植物/.test(hay) && !/planted tank|水草/.test(hay)) return 'plant-terrarium';
    if (/tarantula|捕鳥蛛|spider|蜘蛛/.test(hay) && !/crab|寄居/.test(hay)) return 'tarantula';
    if (/marine|salt|海水|珊瑚|海葵|anemone|reef|clownfish|小丑|寄居蟹/.test(hay)) {
      if (/coral|珊瑚|lps|sps|軟珊瑚/.test(hay)) return 'coral-reef';
      if (/anemone|海葵/.test(hay)) return 'anemone-marine';
      if (/hermit|寄居蟹/.test(hay) && !/land|陸/.test(hay)) return 'hermit-marine';
      if (/reef tank|海水缸|reef/.test(hay) && !/fish|魚|clown|小丑/.test(hay)) return 'reef-tank';
      return 'marine-fish';
    }
    if (/shrimp|蝦|neocaridina|caridina|水晶蝦|米蝦/.test(hay)) return 'shrimp-aquarium';
    if (/crayfish|螯蝦/.test(hay)) return 'crayfish-aquarium';
    if (/planted tank|水草缸|水草/.test(hay)) return 'planted-tank';
    if (/freshwater|淡水|betta|guppy|tetra|goldfish|鬥魚|孔雀|燈魚|金魚|熱帶魚|aquarium|fish|魚/.test(hay)) return 'aquarium';
    if (/beetle|甲蟲|rhinoceros|dynastes|獨角仙|鍬形蟲|stag/.test(hay)) {
      if (pet.lifeStage === 'juvenile' || pet.category === 'beetle-larva' || /larva|幼蟲|幼体|幼體/.test(hay)) {
        return 'beetle-larva';
      }
      if (pet.lifeStage === 'adult' || /adult|成蟲|成体|成體/.test(hay)) return 'beetle-adult';
      return 'beetle-adult';
    }
    if (/larva|幼蟲|幼体|幼體/.test(hay)) return 'beetle-larva';
    if (/snake|蛇/.test(hay)) return 'snake';
    if (/gecko|守宮/.test(hay)) return 'arboreal-gecko';
    if (/turtle|龜/.test(hay) && !/tortoise|陸龜/.test(hay)) return 'turtle';
    if (/tortoise|陸龜/.test(hay)) return 'tortoise';
    if (/mantis|螳螂/.test(hay)) return 'mantis';
    if (/tarantula|蜘蛛|scorpion|蠍|捕鳥蛛/.test(hay)) return 'tarantula';
    if (/reptile|蜥蜴|變色龍|chameleon|lizard|爬蟲/.test(hay)) return 'general-reptile';
    if (/insect|昆蟲|roach|cricket/.test(hay)) return 'general-insect';
    return pet.category || 'default';
  }

  function deckForPet(pet) {
    var key = inferCareTypeKey_(pet);
    var api = global.MCHusbandryRecordDecks;
    if (api && api.getDeck) return api.getDeck(key);
    if (key === 'beetle-larva' || (pet && pet.category === 'beetle-larva')) return RECORD_DECKS['beetle-larva'];
    if (key === 'mantis') return RECORD_DECKS.mantis;
    if (key === 'tarantula' || (pet && pet.category === 'arachnid')) return RECORD_DECKS.tarantula;
    return RECORD_DECKS.default;
  }

  function genHusbandryId() {
    var year = new Date().getFullYear();
    var prefix = 'HL-' + year + '-';
    var max = 0;
    state.pets.forEach(function (p) {
      if (p.husbandryId && p.husbandryId.indexOf(prefix) === 0) {
        var n = parseInt(p.husbandryId.slice(prefix.length), 10);
        if (!isNaN(n) && n > max) max = n;
      }
    });
    return prefix + String(max + 1).padStart(4, '0');
  }

  function petQrUrl(petId) {
    var api = LABEL_API();
    if (api && api.petDeepLink) return api.petDeepLink(petId);
    return '#/section/husbandry-log?petId=' + encodeURIComponent(petId || '');
  }

  function labelQrData(pet) {
    if (!pet) return '';
    return pet.qrUrl || petQrUrl(pet.id);
  }

  var RECORD_GROUP_MAP = {
    photo: 'general', feeding: 'general', weight: 'general', note: 'general',
    temperature: 'environment', humidity: 'environment', substrate: 'environment',
    substrate_change: 'environment', water_change: 'environment', water_quality: 'environment',
    water_temp: 'environment', ph: 'environment', ammonia: 'environment',
    nitrite: 'environment', nitrate: 'environment', uvb: 'environment',
    salinity: 'environment', ca: 'environment', mg: 'environment', po4: 'environment',
    tds: 'environment', gh: 'environment', kh: 'environment',
    aquarium_light: 'environment', water_flow: 'environment',
    hotspot: 'environment', cold_zone: 'environment', frass: 'environment', basking: 'environment',
    abnormality: 'health', insect_status: 'health', skin: 'health', gill: 'health',
    shell: 'health', refused: 'health', premolt: 'health', activity: 'health',
    coral_open: 'health',
    drinking: 'general', feather: 'health', cage_clean: 'environment', crop: 'health',
    teeth: 'health', fur: 'health',
    mortality: 'health', plant_status: 'health',
    medication: 'health', vet: 'health', abdomen: 'health', defensive: 'health',
    hiding: 'health', stool: 'health',
    molt: 'lifecycle', pupation: 'lifecycle', shedding: 'lifecycle',
    instar: 'lifecycle', egg_laying: 'lifecycle', calcium: 'lifecycle',
  };

  var RECORD_GROUP_ORDER = ['general', 'environment', 'health', 'lifecycle'];

  var RECORD_GROUP_SORT = {
    general: ['photo', 'feeding', 'weight', 'note'],
    environment: ['temperature', 'humidity', 'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'substrate_change', 'substrate', 'hotspot', 'cold_zone', 'uvb', 'frass', 'water_quality', 'basking'],
    health: ['insect_status', 'activity', 'skin', 'gill', 'shell', 'abnormality', 'medication', 'vet', 'refused', 'premolt', 'abdomen', 'defensive', 'hiding', 'stool'],
    lifecycle: ['molt', 'shedding', 'pupation', 'egg_laying', 'instar'],
  };

  function recordGroupKey_(rid) {
    return RECORD_GROUP_MAP[rid] || 'general';
  }

  function sortGroupRecordIds_(groupKey, ids) {
    var order = RECORD_GROUP_SORT[groupKey] || [];
    return ids.slice().sort(function (a, b) {
      var ia = order.indexOf(a);
      var ib = order.indexOf(b);
      if (ia < 0) ia = 999;
      if (ib < 0) ib = 999;
      return ia - ib;
    });
  }

  function groupedRecordIdsForList_(ids) {
    var seen = {};
    var groups = {};
    RECORD_GROUP_ORDER.forEach(function (g) { groups[g] = []; });
    (ids || []).forEach(function (rid) {
      if (seen[rid] || !RECORD_META[rid]) return;
      seen[rid] = true;
      var g = recordGroupKey_(rid);
      if (!groups[g]) groups[g] = [];
      groups[g].push(rid);
    });
    var out = [];
    RECORD_GROUP_ORDER.forEach(function (g) {
      if (groups[g] && groups[g].length) {
        out.push({ key: g, ids: sortGroupRecordIds_(g, groups[g]) });
      }
    });
    return out;
  }

  function groupedRecordIds_(pet) {
    var deck = deckForPet(pet);
    return groupedRecordIdsForList_((deck.main || []).concat(deck.more || []));
  }

  function getAllRecordTypes_() {
    return Object.keys(RECORD_META).filter(function (rid) {
      return RECORD_META[rid];
    });
  }

  function getFilteredAllRecordTypesForPet_(pet) {
    var all = getAllRecordTypes_();
    if (CARE_GUIDE()) {
      return CARE_GUIDE().getAllowedRecordTypesForPet(state, pet, all, careGuideCtx_());
    }
    return all;
  }

  function getRecommendedRecordTypesForPet_(pet, careGuide) {
    if (CARE_GUIDE()) {
      return CARE_GUIDE().getRecommendedRecordTypesForPet(
        state, pet, careGuide || null, careGuideCtx_()
      );
    }
    var deck = deckForPet(pet);
    return (deck.main || []).slice(0, 8);
  }

  function collectionTodayStats_() {
    var stats = collectionStats_();
    if (!state.pets.length) {
      return {
        stats: stats,
        questPct: 0,
        questDone: 0,
        questTotal: 0,
        nextTodo: null,
        lastLog: null,
        needCount: 0,
        needPets: [],
      };
    }
    var totalQuests = 0;
    var doneQuests = 0;
    var needPets = [];
    var lastLog = null;
    state.pets.forEach(function (pet) {
      var quests = priorityTasks(pet);
      var qp = ensureQuestProgress(pet);
      totalQuests += quests.length;
      doneQuests += qp.done.length;
      if (cardStatusTone_(pet) !== 'ok') needPets.push(pet);
      var logs = petLogs(pet.id);
      if (logs[0] && (!lastLog || logs[0].date > lastLog.date)) lastLog = logs[0];
    });
    var nextTodo = null;
    state.pets.some(function (pet) {
      var quests = priorityTasks(pet);
      var qp = ensureQuestProgress(pet);
      for (var i = 0; i < quests.length; i++) {
        if (qp.done.indexOf(quests[i]) < 0) {
          nextTodo = { pet: pet, quest: quests[i] };
          return true;
        }
      }
      return false;
    });
    return {
      stats: stats,
      questPct: totalQuests ? Math.round((doneQuests / totalQuests) * 100) : 0,
      questDone: doneQuests,
      questTotal: totalQuests,
      nextTodo: nextTodo,
      lastLog: lastLog,
      needCount: needPets.length,
      needPets: needPets.slice(0, 3),
    };
  }

  function chipTone_(kind, val) {
    if (kind === 'progress') {
      var parts = String(val).split('/');
      var done = parseInt(parts[0], 10) || 0;
      var total = parseInt(parts[1], 10) || 1;
      if (done >= total) return 'ok';
      if (done > 0) return 'watch';
      return 'muted';
    }
    if (kind === 'env') {
      var envText = String(val || '');
      if (envText === t('chipNotLogged')) return 'muted';
      if (envText === t('stateNeedsUpdate')) return 'watch';
      return 'ok';
    }
    if (kind === 'feed') {
      if (String(val || '') === t('chipNotLogged')) return 'muted';
      return 'ok';
    }
    if (kind === 'health') {
      var healthText = String(val || '');
      if (healthText === t('cardStatusOk')) return 'ok';
      if (healthText === t('cardStatusWatch')) return 'watch';
      return 'need';
    }
    var text = String(val || '');
    if (text === t('chipNotLogged') || text === t('stateNeedsUpdate')) return 'muted';
    if (text === t('cardStatusOk') || text === t('stateUpToDate')) return 'ok';
    if (text === t('cardStatusWatch')) return 'watch';
    return 'need';
  }

  function feedChipValue_(pet) {
    var lastFeed = lastLogFor(pet.id, ['feeding']);
    return lastFeed ? formatRelative(lastFeed.date) : t('chipNotLogged');
  }

  function envChipValue_(pet) {
    var lastEnv = lastLogFor(pet.id, ['environment']);
    if (!lastEnv) return t('chipNotLogged');
    var ms = Date.now() - new Date(lastEnv.date).getTime();
    if (ms > 86400000) return t('stateNeedsUpdate');
    return formatRelative(lastEnv.date);
  }

  function questRecordButtonLabel_(recId) {
    var label = recordLabel_(recId);
    return isEn() ? (t('questAddRecord') + ' · ' + label) : ('新增' + label);
  }

  function questStatusLabel_(done, skipped) {
    if (done) return t('questStatusDone');
    if (skipped) return t('questStatusSkipped');
    return t('questStatusPending');
  }

  function renderPetHeroStages_(pet) {
    if (canPickLifeStage(pet)) {
      return (
        '<div class="hlc-pet-hero__stages" role="group" aria-label="' + esc(t('lifeStage')) + '">' +
        renderLifeStageChips(pet.lifeStage, 'data-hl-life-stage', pet) +
        '</div>'
      );
    }
    var stage = stageLabel(pet);
    if (!stage) return '';
    return (
      '<div class="hlc-pet-hero__stages">' +
      '<span class="hlc-chip hlc-chip--compact is-active">' + esc(stage) + '</span></div>'
    );
  }

  function logSummaryLine_(log) {
    if (!log) return '';
    var parts = [];
    if (log.type === 'breeding') {
      if (log.pairName) parts.push(log.pairName);
      if (log.note) parts.push(String(log.note).trim());
      return parts.join(' · ');
    }
    if (log.note && String(log.note).trim() && log.note !== log.recordType) {
      parts.push(String(log.note).trim());
    }
    if (log.values && log.values.feedingStatus) {
      var fo = FEED_OPTS.filter(function (f) { return f.value === log.values.feedingStatus; })[0];
      if (fo) parts.push(t(fo.labelKey));
    } else if (log.values && log.values.value != null && log.values.value !== '') {
      parts.push(String(log.values.value) + (log.values.unit ? log.values.unit : ''));
    } else if (log.values && log.values.choice) {
      var choiceApi = CHOICES_API();
      var choiceRid = log.recordId || log.type || '';
      var choiceVal = log.values.choice;
      parts.push(choiceApi ? choiceApi.findLabel(choiceRid, choiceVal, labelLang_()) : String(choiceVal));
    } else if (log.values && log.values.food) {
      var feedParts = [log.values.food];
      if (log.values.amount) feedParts.push(String(log.values.amount) + (log.values.unit ? (t('unit_' + log.values.unit) !== 'unit_' + log.values.unit ? t('unit_' + log.values.unit) : log.values.unit) : ''));
      if (log.values.feedingStatus) {
        var feedOpt = FEED_OPTS.filter(function (f) { return f.value === log.values.feedingStatus; })[0];
        if (feedOpt) feedParts.push(t(feedOpt.labelKey));
      }
      parts.push(feedParts.join(' '));
    }
    if (!parts.length && log.photoUrl) parts.push(t('recordPhoto'));
    return parts.join(' · ');
  }

  function logStatusBadge_(log) {
    if (!log) return { label: t('logBadgeLogged'), tone: 'info' };
    if (log.type === 'breeding') return { label: t('logBadgeBreeding'), tone: 'info' };
    if (log.type === 'abnormality') return { label: t('logBadgeAbnormal'), tone: 'danger' };
    if (log.type === 'photo') return { label: t('logBadgePhoto'), tone: 'info' };
    if (log.type === 'feeding') {
      var st = log.values && log.values.feedingStatus;
      if (st === 'refused' || st === 'vomit') return { label: t('logBadgeWatch'), tone: 'watch' };
      if (st === 'ate_less') return { label: t('logBadgePartial'), tone: 'watch' };
      return { label: t('logBadgeOk'), tone: 'ok' };
    }
    if (log.status === 'high' || log.status === 'low') return { label: t('logBadgeWatch'), tone: 'watch' };
    return { label: t('logBadgeLogged'), tone: 'info' };
  }

  function renderLogStatusBadge_(log) {
    var badge = logStatusBadge_(log);
    return '<span class="hlc-log-status hlc-log-status--' + badge.tone + '">' + esc(badge.label) + '</span>';
  }

  function renderTimelineEmpty_() {
    return '<p class="hlc-empty hlc-empty--timeline">' + esc(t('timelineEmptyLead')) + '</p>';
  }

  function renderTimelinePhotoThumb_(url, cls) {
    if (!url) return '';
    return (
      '<button type="button" class="' + cls + '-btn" data-hl-photo-lightbox="' + esc(url) + '">' +
      '<img class="' + cls + '" src="' + url + '" alt="" loading="lazy" /></button>'
    );
  }

  function renderHomeRecentItem_(log) {
    var summary = logSummaryLine_(log);
    return (
      '<article class="hlc-home-recent__item">' +
      '<span class="hlc-home-recent__icon">' + svgIcon(recordIcon_(log.recordId)) + '</span>' +
      '<div class="hlc-home-recent__body">' +
      '<div class="hlc-home-recent__row">' +
      '<strong class="hlc-home-recent__pet">' + esc(log.petName || '') + '</strong>' +
      renderLogStatusBadge_(log) +
      '<span class="hlc-home-recent__type">' + esc(log.recordType) + '</span>' +
      '<time datetime="' + esc(log.date || '') + '">' + esc(formatRelative(log.date)) + '</time></div>' +
      (summary ? '<p class="hlc-home-recent__summary">' + esc(summary) + '</p>' : '') +
      '</div>' +
      renderTimelinePhotoThumb_(log.photoUrl, 'hlc-home-recent__thumb') +
      '</article>'
    );
  }

  function renderTimelineItem_(log) {
    var expanded = state.ui.expandedLogId === log.id;
    var confirming = state.ui.confirmDeleteLogId === log.id;
    var summary = logSummaryLine_(log);
    var detail = expanded ? (
      '<div class="hlc-timeline-item__detail">' +
      (log.note ? '<p>' + esc(log.note) + '</p>' : '') +
      (log.values ? '<pre class="hlc-timeline-item__json">' + esc(JSON.stringify(log.values, null, 0)) + '</pre>' : '') +
      '</div>'
    ) : '';
    var deleteActions = confirming
      ? (
        '<div class="hlc-timeline-item__confirm">' +
        '<span class="hlc-timeline-item__confirm-text">' + esc(t('deleteLogConfirm')) + '</span>' +
        '<button type="button" class="hlc-timeline-item__btn hlc-timeline-item__btn--danger" data-hl-log-delete-confirm="' + esc(log.id) + '">' + esc(t('confirmDeleteLog')) + '</button>' +
        '<button type="button" class="hlc-timeline-item__btn" data-hl-log-delete-cancel="' + esc(log.id) + '">' + esc(t('cancel')) + '</button>' +
        '</div>'
      )
      : '<button type="button" class="hlc-timeline-item__btn hlc-timeline-item__btn--danger" data-hl-log-delete="' + esc(log.id) + '">' + esc(t('deleteLog')) + '</button>';
    return (
      '<article class="hlc-timeline-item' + (expanded ? ' is-expanded' : '') + (confirming ? ' is-confirming' : '') + '">' +
      '<span class="hlc-timeline-item__icon">' + svgIcon(recordIcon_(log.recordId)) + '</span>' +
      '<div class="hlc-timeline-item__body">' +
      '<div class="hlc-timeline-item__head">' +
      '<div class="hlc-timeline-item__title-row">' +
      '<strong>' + esc(log.recordType) + '</strong>' +
      renderLogStatusBadge_(log) +
      '</div>' +
      '<time datetime="' + esc(log.date || '') + '">' + esc(formatRelative(log.date)) + '</time></div>' +
      (summary ? '<p class="hlc-timeline-item__summary">' + esc(summary) + '</p>' : '') +
      renderTimelinePhotoThumb_(log.photoUrl, 'hlc-timeline-item__thumb') +
      detail +
      '<div class="hlc-timeline-item__actions">' +
      '<button type="button" class="hlc-timeline-item__btn" data-hl-log-expand="' + esc(log.id) + '">' + esc(expanded ? t('collapseLog') : t('expandLog')) + '</button>' +
      '<button type="button" class="hlc-timeline-item__btn" data-hl-log-edit="' + esc(log.id) + '">' + esc(t('editLog')) + '</button>' +
      deleteActions +
      '</div></div></article>'
    );
  }

  function logsInTrendRange_(pet, recordId, dayCount) {
    var api = trendsApi_();
    return api ? api.logsInTrendRange(pet, recordId, dayCount) : '';
  }


  function HEALTH_FU() {
    return global.MCHusbandryHealthFollowUp || null;
  }

  var healthFollowUpCtl_ = null;
  function healthFollowUp_() {
    if (!HEALTH_FU()) return null;
    if (!healthFollowUpCtl_) {
      healthFollowUpCtl_ = HEALTH_FU().create({
        getState: function () { return state; },
        t: t,
        esc: esc,
        todayKey: todayKey,
        saveState: saveState,
        render: render,
        showToast: showToast_,
        addLog: addLog,
      });
    }
    return healthFollowUpCtl_;
  }

  function pendingHealthReminders_() {
    var ctl = healthFollowUp_();
    if (ctl) return ctl.pending();
    return [];
  }

  function dismissHealthReminder_(logId) {
    var ctl = healthFollowUp_();
    if (ctl) ctl.openHandle(logId);
  }

  function renderHealthRemindersStrip_() {
    var ctl = healthFollowUp_();
    if (ctl) return ctl.renderStrip();
    return '';
  }

  var qrCtl_ = null;
  function qrApi_() {
    if (!QR_MOD()) return null;
    if (!qrCtl_) {
      qrCtl_ = QR_MOD().create({
        getState: function () { return state; },
        t: t,
        esc: esc,
        saveState: saveState,
        render: render,
        showToast: showToast_,
        dataExport: DATA_EXPORT,
        labelApi: LABEL_API,
        petQrUrl: petQrUrl,
        labelQrData: labelQrData,
        enrichPet: enrichPet,
        genId: genId,
        genHusbandryId: genHusbandryId,
        todayKey: todayKey,
        getActivePet: getActivePet,
        confirmHighRisk: confirmHighRisk_,
        exportHelpers: exportHelpers_,
        clearPendingUndo: clearPendingUndo_,
      });
    }
    return qrCtl_;
  }

  var trendsCtl_ = null;
  function trendsApi_() {
    if (!TRENDS_MOD()) return null;
    if (!trendsCtl_) {
      trendsCtl_ = TRENDS_MOD().create({
        getState: function () { return state; },
        t: t,
        esc: esc,
        saveState: saveState,
        render: render,
        showToast: showToast_,
        petLogs: petLogs,
        getActivePet: getActivePet,
        buildDailyCompletionSeries: buildDailyCompletionSeries_,
        fmtDate: typeof fmtDate === 'function' ? fmtDate : function (d) { return String(d || ''); },
        lifeStageLabel: typeof lifeStageLabel === 'function' ? lifeStageLabel : function () { return ''; },
        addLog: addLog,
        autoCompleteQuestsForRecord: autoCompleteQuestsForRecord_,
        recordTodayQuestSnapshot: recordTodayQuestSnapshot_,
        ensureQuestProgress: ensureQuestProgress,
        priorityTasks: priorityTasks,
        cloneJson: cloneJson_,
        showUndoToast: showUndoToast_,
        filteredSortedPets: filteredSortedPets_,
        dataExport: DATA_EXPORT,
        downloadText: downloadText_,
        labelApi: LABEL_API,
        exportHelpers: exportHelpers_,
        confirmHighRisk: confirmHighRisk_,
        breeding: BREEDING,
        careGuide: CARE_GUIDE,
        recordLabel: recordLabel_,
        careGuideCtx: careGuideCtx_,
        breedingCtx: function () { return {}; },
        renderCompactHeader: typeof renderCompactHeader === 'function' ? renderCompactHeader : function () { return ''; },
      });
    }
    return trendsCtl_;
  }

  var batchCtl_ = null;
  function batchApi_() {
    if (!BATCH_MOD()) return null;
    if (!batchCtl_) {
      batchCtl_ = BATCH_MOD().create({
        getState: function () { return state; },
        t: t,
        esc: esc,
        saveState: saveState,
        render: render,
        showToast: showToast_,
        addLog: addLog,
        autoCompleteQuestsForRecord: autoCompleteQuestsForRecord_,
        recordTodayQuestSnapshot: recordTodayQuestSnapshot_,
        ensureQuestProgress: ensureQuestProgress,
        priorityTasks: priorityTasks,
        cloneJson: cloneJson_,
        showUndoToast: showUndoToast_,
        filteredSortedPets: filteredSortedPets_,
        dataExport: DATA_EXPORT,
        downloadText: downloadText_,
        labelApi: LABEL_API,
        exportHelpers: exportHelpers_,
        confirmHighRisk: confirmHighRisk_,
        clearPendingUndo: clearPendingUndo_,
        getActivePet: getActivePet,
        petLogs: petLogs,
        buildDailyCompletionSeries: buildDailyCompletionSeries_,
      });
    }
    return batchCtl_;
  }


  function summarizeCompletionSeries_(series) {
    var api = trendsApi_();
    return api ? api.summarizeCompletionSeries(series) : null;
  }


  function trendDayDetailHtml_(d) {
    var api = trendsApi_();
    return api ? api.trendDayDetailHtml(d) : '';
  }


  function renderTrendBarChart_(series, summary) {
    var api = trendsApi_();
    return api ? api.renderTrendBarChart(series, summary) : '';
  }


  function humidityReadingSeries_(logs) {
    var api = trendsApi_();
    return api ? api.humidityReadingSeries(logs) : '';
  }


  function humidityAnomalyBand_() {
    var api = trendsApi_();
    return api ? api.humidityAnomalyBand() : null;
  }


  function renderHumiditySparkCard_(readings) {
    var api = trendsApi_();
    return api ? api.renderHumiditySparkCard(readings) : '';
  }


  function trendRangeLabel_(values, unit) {
    var api = trendsApi_();
    return api ? api.trendRangeLabel(values, unit) : '';
  }


  function renderTrendFeedRows_(stats) {
    var api = trendsApi_();
    return api ? api.renderTrendFeedRows(stats) : '';
  }


  function petCategoryLabel_(pet) {
    if (!pet || !pet.category) return '—';
    return chipT(pet.category);
  }

  function timelineBucket_(iso) {
    var d = new Date(iso);
    var now = new Date();
    var startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var startYesterday = new Date(startToday.getTime() - 86400000);
    var startWeek = new Date(startToday.getTime() - 6 * 86400000);
    if (d >= startToday) return 'today';
    if (d >= startYesterday) return 'yesterday';
    if (d >= startWeek) return 'week';
    return 'earlier';
  }

  function recordLabel_(rid) {
    var meta = RECORD_META[rid];
    return meta && meta.titleKey ? t(meta.titleKey) : rid;
  }

  function numericQuickValues_(rid) {
    if (rid === 'temperature') return [22, 24, 26, 28, 30];
    if (rid === 'humidity') return [40, 50, 60, 70, 80];
    if (rid === 'water_temp') return [20, 22, 24, 26, 28];
    if (rid === 'ph') return [6.5, 7.0, 7.5, 8.0];
    if (rid === 'salinity') return [1.023, 1.024, 1.025, 1.026];
    if (rid === 'kh') return [7, 8, 9, 10, 11];
    if (rid === 'ca') return [400, 420, 440, 450];
    if (rid === 'mg') return [1250, 1300, 1350];
    if (rid === 'po4') return [0, 0.03, 0.05];
    if (rid === 'tds') return [100, 150, 200, 250];
    if (rid === 'gh') return [4, 6, 8, 10];
    if (rid === 'weight') return [];
    return [1, 2, 3, 5];
  }

  function numericUnit_(rid) {
    if (rid === 'temperature' || rid === 'water_temp') return '°C';
    if (rid === 'humidity') return '%';
    if (rid === 'weight') return 'g';
    if (rid === 'ph') return 'pH';
    if (rid === 'salinity') return ' SG';
    if (rid === 'kh') return ' dKH';
    if (rid === 'ca' || rid === 'mg' || rid === 'po4' || rid === 'ammonia' || rid === 'nitrite' || rid === 'nitrate') return ' ppm';
    if (rid === 'tds') return ' ppm';
    if (rid === 'gh') return ' dGH';
    return '';
  }

  function isNumericRecord_(rid) {
    return rid === 'temperature' || rid === 'humidity' || rid === 'water_temp' ||
      rid === 'ph' || rid === 'ammonia' || rid === 'nitrite' || rid === 'nitrate' ||
      rid === 'salinity' || rid === 'kh' || rid === 'ca' || rid === 'mg' || rid === 'po4' ||
      rid === 'tds' || rid === 'gh' || rid === 'weight';
  }

  function petSexLabel_(sex) {
    if (sex === 'male') return t('sexMale');
    if (sex === 'female') return t('sexFemale');
    return t('sexUnknown');
  }

  function questRecordId_(qKey) {
    if (String(qKey).indexOf('BREED_') === 0) return '';
    if (String(qKey).indexOf('GUIDE_') === 0 && CARE_GUIDE()) {
      var mapped = CARE_GUIDE().questRecordForKey(qKey);
      if (mapped) return mapped;
    }
    var q = String(qKey).toLowerCase();
    if (/feed/.test(q)) return 'feeding';
    if (/photo|upload|picture/.test(q)) return 'photo';
    if (/gill/.test(q)) return 'gill';
    if (/skin/.test(q)) return 'skin';
    if (/humid/.test(q)) return 'humidity';
    if (/water.*qual|quality|ph|ammonia|nitrite|nitrate/.test(q)) return 'ph';
    if (/water/.test(q)) return 'water_temp';
    if (/substrate|moisture|bedding|hide/.test(q)) return 'substrate';
    if (/weight|size/.test(q)) return 'weight';
    if (/temp/.test(q)) return 'temperature';
    if (/molt|instar|pupa/.test(q)) return 'instar';
    return 'note';
  }

  function questHint_(qKey) {
    var q = String(qKey).toLowerCase();
    if (/water|temp/.test(q)) return t('questHintWaterTemp');
    if (/feed/.test(q)) return t('questHintFeed');
    if (/photo|upload/.test(q)) return t('questHintPhoto');
    if (/substrate|moisture/.test(q)) return t('questHintSubstrate');
    return '';
  }

  function petAttentionLine_(pet) {
    var next = petNextAction_(pet);
    if (next && next.label) return next.label;
    var today = todayKey();
    var logsToday = petLogs(pet.id).filter(function (l) {
      return String(l.date).slice(0, 10) === today;
    });
    if (CARE_GUIDE()) {
      var recs = CARE_GUIDE().getRecommendedRecordsForPet(state, pet, careGuideCtx_()).slice(0, 4);
      var ri;
      for (ri = 0; ri < recs.length; ri++) {
        var rid = recs[ri];
        var logged = logsToday.some(function (l) { return l.recordId === rid; });
        if (!logged) {
          return t('attentionRecordPending').replace('{record}', recordLabel_(rid));
        }
      }
      var tip = CARE_GUIDE().getLifeStageFocusTip(state, pet, careGuideCtx_());
      if (tip) return tip;
      var guide = CARE_GUIDE().getAppliedGuideForPet(state, pet, careGuideCtx_());
      if (guide && guide.todayFocus) return guide.todayFocus;
    }
    return cardTodayStatus(pet);
  }

  function petNextAction_(pet) {
    var quests = priorityTasks(pet);
    var qp = ensureQuestProgress(pet);
    var i;
    for (i = 0; i < quests.length; i++) {
      if (qp.done.indexOf(quests[i]) < 0 && qp.skipped.indexOf(quests[i]) < 0) {
        return { label: questT(quests[i]), recordId: questRecordId_(quests[i]) };
      }
    }
    if (!lastLogFor(pet.id, ['feeding'])) return { label: t('quickFeeding'), recordId: 'feeding' };
    if (cardStatusTone_(pet) !== 'ok') return { label: t('actionLog'), recordId: 'insect_status' };
    return null;
  }

  function findTargetPetForCare_() {
    var target = null;
    state.pets.some(function (p) {
      if (cardStatusTone_(p) !== 'ok') { target = p; return true; }
      return false;
    });
    if (!target) {
      state.pets.some(function (p) {
        var quests = priorityTasks(p);
        var qp = ensureQuestProgress(p);
        if (quests.length && qp.done.length < quests.length) { target = p; return true; }
        return false;
      });
    }
    return target || state.pets[0] || null;
  }

  function homePrimaryAction_(dash) {
    if (!state.pets.length) return { action: 'start-create', label: t('tourAddCta'), primary: true };
    if (dash.questTotal && dash.questDone >= dash.questTotal) {
      return { action: 'none', label: t('todayCareComplete'), primary: false };
    }
    if (dash.needCount) return { action: 'start-today-care', label: t('startTodayCare'), primary: true };
    if (!dash.lastLog) return { action: 'quick-log-collection', label: t('addFirstLog'), primary: true };
    return { action: 'start-today-care', label: t('startTodayCare'), primary: true };
  }

  function filteredSortedPets_() {
    var filters = collectionFilters_();
    var pets = state.pets.slice();
    var q = String(filters.search || '').trim().toLowerCase();
    if (q) {
      pets = pets.filter(function (p) { return petMatchesCollectionSearch_(p, q); });
    }
    var f = filters.status || 'all';
    if (f === 'need') {
      pets = pets.filter(function (p) { return cardStatusTone_(p) !== 'ok'; });
    } else if (f === 'incomplete') {
      pets = pets.filter(function (p) {
        var quests = priorityTasks(p);
        var qp = ensureQuestProgress(p);
        return quests.length > 0 && qp.done.length < quests.length;
      });
    } else if (f === 'recent') {
      pets = pets.filter(function (p) { return petLogs(p.id).length > 0; });
    } else if (f === 'breeding') {
      pets = pets.filter(function (p) { return petIsBreeding_(p); });
    } else if (f === 'abnormal') {
      pets = pets.filter(function (p) { return petHasRecentAbnormality_(p); });
    }
    var catF = filters.category || 'all';
    if (catF !== 'all') {
      pets = pets.filter(function (p) { return String(p.category || '') === catF; });
    }
    var stageF = filters.lifeStage || 'all';
    if (stageF !== 'all') {
      pets = pets.filter(function (p) { return String(p.lifeStage || '') === stageF; });
    }
    var sort = filters.sort || 'recent';
    pets.sort(function (a, b) {
      if (sort === 'name') {
        return (a.petName || '').localeCompare(b.petName || '', undefined, { sensitivity: 'base' });
      }
      if (sort === 'need') {
        var rank = { need: 0, watch: 1, ok: 2 };
        var ta = rank[cardStatusTone_(a)] || 2;
        var tb = rank[cardStatusTone_(b)] || 2;
        if (ta !== tb) return ta - tb;
      }
      if (sort === 'startDate') {
        var sa = String(a.careStartDate || a.startDate || '');
        var sb = String(b.careStartDate || b.startDate || '');
        if (sa !== sb) return sb.localeCompare(sa);
      }
      if (sort === 'lifeStage') {
        var ra = lifeStageSortRank_(a.lifeStage);
        var rb = lifeStageSortRank_(b.lifeStage);
        if (ra !== rb) return ra - rb;
      }
      if (sort === 'breeding') {
        var ba = petIsBreeding_(a) ? 0 : 1;
        var bb = petIsBreeding_(b) ? 0 : 1;
        if (ba !== bb) return ba - bb;
      }
      var la = petLogs(a.id)[0];
      var lb = petLogs(b.id)[0];
      var da = la ? new Date(la.date).getTime() : 0;
      var db = lb ? new Date(lb.date).getTime() : 0;
      if (db !== da) return db - da;
      return (a.petName || '').localeCompare(b.petName || '', undefined, { sensitivity: 'base' });
    });
    return pets;
  }

  function tabBadgeCount_(tabId) {
    if (tabId === 'cards') return state.pets.length;
    if (tabId === 'logs') {
      var pending = 0;
      state.pets.forEach(function (pet) {
        var quests = priorityTasks(pet);
        var qp = ensureQuestProgress(pet);
        var total = quests.length;
        pending += Math.max(0, total - qp.done.length);
      });
      return pending;
    }
    return -1;
  }

  function statDotsHtml_(pct) {
    var filled = Math.min(4, Math.max(0, Math.round(pct / 25)));
    var html = '';
    var i;
    for (i = 0; i < 4; i++) {
      html += '<span class="hlc-home-stat__dot' + (i < filled ? ' is-on' : '') + '"></span>';
    }
    return '<span class="hlc-home-stat__dots" aria-hidden="true">' + html + '</span>';
  }

  function recordIcon_(rid) {
    var map = {
      photo: 'camera', feeding: 'feeding', weight: 'weight', temperature: 'thermometer',
      humidity: 'droplet', water_temp: 'thermometer', ph: 'flask', ammonia: 'testtube',
      nitrite: 'testtube', nitrate: 'testtube', water_change: 'waves', water_quality: 'flask',
      activity: 'activity', abnormality: 'heart', skin: 'heart', gill: 'heart', note: 'note',
      breeding: 'heart', uvb: 'sun', substrate: 'substrate', instar: 'instar', molt: 'instar', pupation: 'instar',
    };
    if (map[rid]) return map[rid];
    var meta = RECORD_META[rid];
    return (meta && meta.icon) || 'status';
  }

  function exportPetCsv_(pet) {
    var api = DATA_EXPORT();
    var csv = api
      ? api.exportPetRecordsCsv(pet, exportHelpers_())
      : '';
    if (!csv) {
      var rows = [['date', 'type', 'recordId', 'note']];
      petLogs(pet.id).forEach(function (log) {
        rows.push([log.date, log.type, log.recordId || '', (log.note || '').replace(/"/g, '""')]);
      });
      csv = rows.map(function (r) {
        return r.map(function (c) { return '"' + String(c) + '"'; }).join(',');
      }).join('\n');
    }
    downloadText_((pet.petName || 'pet') + '-husbandry.csv', csv, 'text/csv;charset=utf-8');
  }

  function exportAllRecordsCsv_() {
    var api = DATA_EXPORT();
    if (!api) return;
    downloadText_('husbandry-all-records.csv', api.exportAllRecordsCsv(state, exportHelpers_()), 'text/csv;charset=utf-8');
  }

  function exportFullBackupJson_() {
    var api = DATA_EXPORT();
    if (!api) return;
    var payload = api.buildFullBackup(state, exportHelpers_());
    downloadText_('husbandry-backup-' + todayKey() + '.json', JSON.stringify(payload, null, 2), 'application/json');
  }

  function exportPetJson_(pet) {
    var api = DATA_EXPORT();
    if (!api) return;
    var payload = api.buildPetExport(pet, state, exportHelpers_());
    downloadText_((pet.petName || 'pet') + '-husbandry.json', JSON.stringify(payload, null, 2), 'application/json');
  }

  function exportPhotoIndexCsv_() {
    var api = DATA_EXPORT();
    if (!api) return;
    downloadText_('husbandry-photo-index.csv', api.exportPhotoIndexCsv(state, exportHelpers_()), 'text/csv;charset=utf-8');
  }

  function renderSaveStatusBar_() {
    var meta = state.meta || {};
    var isError = meta.saveStatus === 'error';
    var offline = state.ui.offlineOnline === false;
    var pendingOffline = offline && global.MCHusbandryOffline &&
      typeof global.MCHusbandryOffline.pendingCount === 'function' &&
      global.MCHusbandryOffline.pendingCount() > 0;
    var last = meta.lastSavedAt ? formatLogDateTime_(meta.lastSavedAt) : '';
    var statusKey = isError
      ? 'saveStatusError'
      : (pendingOffline ? 'saveStatusOfflineQueued' : (offline ? 'saveStatusOffline' : 'saveStatusLocal'));
    var tone = isError ? 'error' : (offline ? 'offline' : 'ok');
    return (
      '<div class="hlc-save-status hlc-save-status--' + tone + '" role="status">' +
      '<span class="hlc-save-status__dot" aria-hidden="true"></span>' +
      '<span class="hlc-save-status__label">' + esc(t(statusKey)) + '</span>' +
      (last
        ? '<span class="hlc-save-status__time">' + esc(t('saveLastUpdated')) + (isEn() ? ': ' : '：') + esc(last) + '</span>'
        : '') +
      '</div>'
    );
  }

  function renderCollectionBackupSection_() {
    if (!state.pets.length) return '';
    return (
      '<section class="hlc-backup-panel">' +
      '<div class="hlc-backup-panel__head">' +
      '<h2 class="hlc-section-title">' + esc(t('backupSectionTitle')) + '</h2>' +
      '<p class="hlc-backup-panel__hint">' + esc(t('backupSectionHint')) + '</p></div>' +
      '<div class="hlc-backup-panel__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="export-all-csv">' + esc(t('exportAllCsv')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="export-full-backup">' + esc(t('exportFullBackup')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="export-photo-index">' + esc(t('exportPhotoIndex')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--sm" data-hl-action="import-backup-pick">' + esc(t('importJsonRestore')) + '</button>' +
      '<input type="file" class="hlc-sr-only" id="hlcImportBackupInput" accept=".json,application/json" data-hl-import-backup />' +
      '</div></section>'
    );
  }

  function renderImportBackupSheet_() {
    var summary = state.ui.importSummary;
    if (!summary) return '';
    var body = t('importConfirmBody')
      .replace('{pets}', String(summary.petCount || 0))
      .replace('{records}', String(summary.recordCount || 0));
    return (
      '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
      '<div class="hlc-sheet hlc-sheet--import" role="dialog">' +
      '<div class="hlc-sheet__handle"></div>' +
      '<h2 class="hlc-sheet__title">' + esc(t('importConfirmTitle')) + '</h2>' +
      '<p class="hlc-sheet__hint">' + esc(body) + '</p>' +
      '<div class="hlc-sheet__actions hlc-sheet__actions--stack">' +
      '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="import-backup-merge">' + esc(t('importConfirmMerge')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="import-backup-replace">' + esc(t('importConfirmReplace')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="import-backup-cancel">' + esc(t('cancel')) + '</button>' +
      '</div></div></div>'
    );
  }

  function parseRouteParams() {
    try {
      var hash = global.location.hash || '';
      var q = hash.indexOf('?');
      if (q < 0) return {};
      var params = new URLSearchParams(hash.slice(q + 1));
      return {
        petId: params.get('petId') || '',
        view: params.get('view') || '',
      };
    } catch (e) { return {}; }
  }

  function applyDeepLink() {
    var p = parseRouteParams();
    if (p.view === 'label' && p.petId) {
      state.activePetId = p.petId;
      state.phase = 'label';
      state.boardTab = 'cards';
      return;
    }
    if (p.petId) {
      var pet = state.pets.filter(function (x) { return x.id === p.petId; })[0];
      if (pet) {
        state.activePetId = pet.id;
        state.boardTab = 'cards';
        if (p.view === 'scan') {
          state.phase = 'scan';
        } else {
          state.phase = 'board';
        }
      } else {
        state.phase = 'notfound';
        state.ui.missingPetId = p.petId;
      }
    }
  }

  function markScanStatusUpdated_() {
    if (state.phase !== 'scan') return;
    state.ui.pendingReprint = true;
    saveState();
  }

  function finishLogSave_(toastMsg) {
    var pet = getActivePet();
    var rid = state.ui.recordId;
    if (pet && rid) autoCompleteQuestsForRecord_(pet, rid);
    markScanStatusUpdated_();
    closeSheet();
    if (!saveState()) {
      showToast_(t('batchWriteFailed'), 3200);
      return;
    }
    showToast_(toastMsg, state.phase === 'scan' ? 4000 : 2000);
  }

  function defaultLabelSettings() {
    return {
      template: 'standard_enclosure',
      showScientificName: true,
      showCareStartDate: true,
      showCurrentStatus: true,
      showQrCode: true,
      showEmergencyNote: false,
      showCoordinates: true,
    };
  }

  function ensurePetLocation(pet) {
    if (!pet) return;
    if (pet.latitude == null) pet.latitude = '';
    if (pet.longitude == null) pet.longitude = '';
    if (pet.altitude == null) pet.altitude = '';
    if (pet.locality == null) pet.locality = '';
    if (pet.address == null) pet.address = '';
  }

  function formatCoordField(value, decimals) {
    var tplApi = LABEL_API();
    if (tplApi && tplApi.formatCoord) return tplApi.formatCoord(value, decimals);
    var n = Number(String(value || '').replace(',', '.'));
    if (!isFinite(n)) return '';
    return n.toFixed(decimals == null ? 6 : decimals);
  }

  function petHasCoordinates(pet) {
    return !!(formatCoordField(pet && pet.latitude, 6) && formatCoordField(pet && pet.longitude, 6));
  }

  function petLocalityLine(pet) {
    return String((pet && (pet.locality || pet.address)) || '').trim();
  }

  function petCoordinatesLine(pet) {
    var lat = formatCoordField(pet && pet.latitude, 6);
    var lng = formatCoordField(pet && pet.longitude, 6);
    if (!lat || !lng) return '';
    var alt = formatCoordField(pet && pet.altitude, 1);
    var line = lat + ', ' + lng;
    if (alt) line += ' · ' + t('coordAlt') + ' ' + alt + ' m';
    return line;
  }

  function applySpeciesToPet(pet, profile, speciesId) {
    if (!pet || !profile) return;
    pet.speciesId = speciesId || profile.id || pet.speciesId;
    pet.chineseName = profile.chineseName || pet.chineseName;
    pet.commonName = profile.commonName || pet.commonName;
    if (isLikelyScientificName(profile.scientificName)) pet.scientificName = profile.scientificName;
    pet.careTypeKey = profile.careTypeKey || pet.careTypeKey;
    pet.category = profile.category || pet.category;
    pet.profileSnapshot = profile;
    syncPetTaxonomy(pet);
    saveState();
    render();
  }

  function applySpeciesToDraft(profile, speciesId) {
    if (!profile) return;
    state.profile = profile;
    state.selectedSpeciesId = speciesId || profile.id || null;
    saveState();
    render();
  }

  function geocodePetAddress_(pet) {
    if (!pet) return;
    var q = String(pet.address || pet.locality || '').trim();
    if (!q) {
      state.toast = t('coordNeedAddress');
      saveState();
      render();
      global.setTimeout(function () { state.toast = null; render(); }, 2200);
      return;
    }
    if (typeof global.fetch !== 'function') {
      state.toast = t('coordGeocodeUnavailable');
      saveState();
      render();
      return;
    }
    state.toast = t('coordGeocoding');
    saveState();
    render();
    global.fetch(
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q),
      { headers: { 'Accept-Language': isEn() ? 'en' : 'zh-TW,en', 'User-Agent': 'MCuratorHusbandryLog/1.0' } },
    )
      .then(function (r) { return r.json(); })
      .then(function (arr) {
        if (arr && arr[0]) {
          pet.latitude = String(arr[0].lat);
          pet.longitude = String(arr[0].lon);
          if (!pet.locality && arr[0].display_name) pet.locality = arr[0].display_name;
          state.toast = t('coordGeocodeOk');
        } else {
          state.toast = t('coordGeocodeFail');
        }
        saveState();
        render();
        global.setTimeout(function () { state.toast = null; render(); }, 2200);
      })
      .catch(function () {
        state.toast = t('coordGeocodeUnavailable');
        saveState();
        render();
        global.setTimeout(function () { state.toast = null; render(); }, 2200);
      });
  }

  function useCurrentLocationForPet_(pet) {
    if (!pet) return;
    if (!global.navigator || !global.navigator.geolocation) {
      state.toast = t('coordGpsUnavailable');
      saveState();
      render();
      return;
    }
    global.navigator.geolocation.getCurrentPosition(
      function (pos) {
        pet.latitude = String(pos.coords.latitude);
        pet.longitude = String(pos.coords.longitude);
        if (pos.coords.altitude != null && isFinite(pos.coords.altitude)) {
          pet.altitude = String(Math.round(pos.coords.altitude * 10) / 10);
        }
        state.toast = t('coordGpsOk');
        saveState();
        render();
        global.setTimeout(function () { state.toast = null; render(); }, 2200);
      },
      function () {
        state.toast = t('coordGpsDenied');
        saveState();
        render();
        global.setTimeout(function () { state.toast = null; render(); }, 2200);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  function enrichPet(pet) {
    var changed = syncPetTaxonomy(pet);
    if (!pet.husbandryId) { pet.husbandryId = genHusbandryId(); changed = true; }
    if (!pet.privacy) pet.privacy = 'private';
    if (!pet.careStartDate) pet.careStartDate = todayKey();
    var nextQr = petQrUrl(pet.id);
    if (pet.qrUrl !== nextQr) { pet.qrUrl = nextQr; changed = true; }
    if (!pet.labelSettings) { pet.labelSettings = defaultLabelSettings(); changed = true; }
    ensurePetLocation(pet);
    return changed;
  }

  function petHasUploadedPhoto(pet) {
    var photo = pet && pet.profilePhoto;
    return !!(photo && String(photo).indexOf('data:') === 0);
  }

  function getPetIllustrationUrl(pet) {
    var api = ILLUSTRATIONS();
    return api ? api.getIllustrationUrl(pet) : null;
  }

  function renderIllustrationHtml(url, imgClass) {
    var cls = (imgClass ? imgClass + ' ' : '') + 'hlc-pet-illus';
    return (
      '<span class="hlc-pet-illus-wrap">' +
      '<img class="' + esc(cls.trim()) + '" src="' + esc(url) + '" alt="" loading="lazy" />' +
      '</span>'
    );
  }

  function renderPetPhotoHtml(pet, imgClass) {
    if (petHasUploadedPhoto(pet)) {
      return '<img class="' + esc(imgClass || '') + '" src="' + pet.profilePhoto + '" alt="" />';
    }
    var illus = getPetIllustrationUrl(pet);
    if (illus) return renderIllustrationHtml(illus, imgClass);
    return renderPhotoPlaceholder();
  }

  function renderPetThumbHtml(pet) {
    if (petHasUploadedPhoto(pet)) {
      return '<img class="hlc-pet-head__thumb" src="' + pet.profilePhoto + '" alt="" />';
    }
    var illus = getPetIllustrationUrl(pet);
    if (illus) {
      return (
        '<span class="hlc-pet-head__thumb hlc-pet-illus-wrap hlc-pet-illus-wrap--thumb">' +
        '<img class="hlc-pet-head__thumb hlc-pet-illus" src="' + esc(illus) + '" alt="" loading="lazy" />' +
        '</span>'
      );
    }
    return '<span class="hlc-pet-head__thumb hlc-pet-head__thumb--ph">' + svgIcon('larva') + '</span>';
  }

  function renderCreatedPhotoHtml(pet) {
    if (petHasUploadedPhoto(pet)) {
      return '<img class="hlc-created__photo" src="' + pet.profilePhoto + '" alt="" />';
    }
    var illus = getPetIllustrationUrl(pet);
    if (illus) {
      return (
        '<div class="hlc-created__photo-wrap">' +
        renderIllustrationHtml(illus, 'hlc-created__photo') +
        '</div>'
      );
    }
    return '<div class="hlc-created__photo-wrap hlc-created__photo-wrap--ph">' + renderPhotoPlaceholder() + '</div>';
  }

  function priorityTasks(pet) {
    var breed = BREEDING() ? BREEDING().getQuestKeys(state, pet, breedingCtx_()) : [];
    if (CARE_GUIDE()) {
      var guideTasks = CARE_GUIDE().getSuggestedTasksForPet(state, pet, careGuideCtx_());
      if (guideTasks.length) return guideTasks.concat(breed).slice(0, 7);
      return breed.slice(0, 7);
    }
    return breed.slice(0, 7);
  }

  function questIcon(key) {
    return QUEST_ICONS[key] || 'status';
  }

  function renderPhotoPlaceholder() {
    return (
      '<div class="hlc-photo-ph">' +
      '<span class="hlc-photo-ph__larva">' + svgIcon('larva') + '</span>' +
      '<span class="hlc-photo-ph__cam">' + svgIcon('camera') + '</span>' +
      '<span class="hlc-photo-ph__label">' + esc(t('addPhotoLabel')) + '</span></div>'
    );
  }

  function svgIcon(name) {
    var paths = {
      plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
      qr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><path d="M13 13h3v3M16 16h4v4M13 19h3"/></svg>',
      label: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h4"/></svg>',
      larva: '<svg viewBox="0 0 64 64"><path d="M14 36c8-10 18-14 28-14 6 0 12 2 16 6M18 40c6 8 14 12 24 12 8 0 14-3 18-8M22 28c2-6 8-10 16-10M38 24c4 2 6 6 6 10"/><ellipse cx="32" cy="38" rx="20" ry="10"/></svg>',
      specimen: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="32" cy="36" rx="18" ry="22"/><path d="M32 14v8M20 28l-6-4M44 28l6-4"/></svg>',
      camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L19 7"/></svg>',
      status: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
      feeding: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 14h16M8 10h8M6 18h12"/></svg>',
      substrate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 18h16M6 14l3-8h6l3 8"/></svg>',
      instar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M6 4v16M12 2v20M18 6v12"/></svg>',
      weight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M9 10V7a3 3 0 016 0v3"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 4l9 16H3L12 4z"/><path d="M12 10v4M12 17h.01"/></svg>',
      note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6"/></svg>',
      thermometer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M14 14.76V5a2 2 0 00-4 0v9.76a4 4 0 104 0z"/></svg>',
      droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3c4 6 7 9 7 12a7 7 0 11-14 0c0-3 3-6 7-12z"/></svg>',
      flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M9 3h6M10 3v7l-4 9a2 2 0 001.8 3h8.4a2 2 0 001.8-3l-4-9V3"/></svg>',
      testtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M9 3h6M12 3v3m-4 8l-2 7h12l-2-7"/></svg>',
      waves: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>',
      activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>',
      sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      tabCards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 9h8M8 13h5"/></svg>',
      tabLogs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
      tabTrends: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 17l5-5 4 4 9-10"/></svg>',
      tabProfile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="8" r="3"/><path d="M5 20a7 7 0 0114 0"/></svg>',
      export: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
      search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>',
      link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M10 13a5 5 0 007 0l1-1a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-1 1a5 5 0 007 7l1-1"/></svg>',
      egg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3c4 4 6 8 6 12a6 6 0 11-12 0c0-4 2-8 6-12z"/></svg>',
      spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7z"/></svg>',
      baby: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>',
      tree: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 22V12M8 12c-2-3-1-6 4-6s6 3 4 6M6 18h12"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
      compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M16 8l-2.5 6.5L8 16l2.5-6.5z"/></svg>',
      chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>',
    };
    return paths[name] || paths.status;
  }

  function buildNormalizedLogFields_(entry) {
    var values = entry.values || {};
    var photoUrl = entry.photoUrl || '';
    var tags = entry.tags || [];
    if (!tags.length && entry.photoType) tags = [entry.photoType];
    var photos = entry.photos || (photoUrl ? [photoUrl] : []);
    return {
      value: entry.value != null ? entry.value : (values.value != null ? values.value : (values.amount != null ? values.amount : '')),
      unit: entry.unit || values.unit || '',
      status: entry.status || values.feedingStatus || values.healthStatus || values.envStatus || values.choice || '',
      tags: tags,
      photos: photos,
      createdAt: entry.date || new Date().toISOString(),
    };
  }

  function addLog(petId, entry) {
    if (state.ui.editingLogId) {
      updateLog_(state.ui.editingLogId, entry);
      return state.ui.editingLogId;
    }
    var pet = state.pets.filter(function (p) { return p.id === petId; })[0];
    var meta = RECORD_META[entry.recordId || ''] || {};
    var normalized = buildNormalizedLogFields_(entry);
    var logId = genId();
    state.careLogs.unshift({
      id: logId,
      petId: petId,
      petName: pet ? pet.petName : '',
      type: entry.type || meta.logType || 'note',
      recordId: entry.recordId || '',
      recordType: entry.recordType || t(meta.titleKey || 'recordNote'),
      values: entry.values || null,
      note: entry.note || '',
      photoUrl: entry.photoUrl || '',
      photoType: entry.photoType || '',
      date: normalized.createdAt,
      value: normalized.value,
      unit: normalized.unit,
      status: normalized.status,
      tags: normalized.tags,
      photos: normalized.photos,
      createdAt: normalized.createdAt,
    });
    if (state.careLogs.length > 200) state.careLogs.length = 200;
    return logId;
  }

  function updateLog_(logId, entry) {
    for (var i = 0; i < state.careLogs.length; i++) {
      if (state.careLogs[i].id !== logId) continue;
      var prev = state.careLogs[i];
      state.careLogs[i] = Object.assign({}, prev, entry, {
        id: logId,
        petId: prev.petId,
        petName: prev.petName,
        date: entry.date || prev.date,
      });
      return;
    }
  }

  function deleteLog_(logId) {
    state.careLogs = state.careLogs.filter(function (l) { return l.id !== logId; });
    if (state.ui.expandedLogId === logId) state.ui.expandedLogId = '';
    saveState();
    state.toast = t('logDeletedToast');
    render();
    global.setTimeout(function () { state.toast = null; render(); }, 2000);
  }

  function openLogForEdit_(logId) {
    var log = state.careLogs.filter(function (l) { return l.id === logId; })[0];
    if (!log) return;
    state.activePetId = log.petId;
    state.ui.editingLogId = logId;
    openRecord(log.recordId || log.type, true);
    if (log.values) {
      if (log.values.feedingStatus) state.ui.feedValue = log.values.feedingStatus;
      if (log.values.food) state.ui.feedFood = log.values.food;
      if (log.values.amount != null) state.ui.feedAmount = String(log.values.amount);
      if (log.values.unit) state.ui.feedUnit = log.values.unit;
      if (log.values.value != null) state.ui.envValue = String(log.values.value);
      if (log.values.healthStatus) state.ui.abnormalValue = log.values.healthStatus;
      if (log.values.severity) state.ui.severity = String(log.values.severity);
      if (log.values.symptoms) state.ui.healthSymptoms = log.values.symptoms;
      if (log.values.treatment) state.ui.healthTreatment = log.values.treatment;
      if (log.values.discoveredAt) state.ui.healthDiscoveredAt = String(log.values.discoveredAt).slice(0, 10);
      if (log.values.followUpDate) state.ui.healthFollowUpDate = String(log.values.followUpDate).slice(0, 10);
      state.ui.healthReminder = !!(log.values.reminder || (log.values.followUpStatus && log.values.followUpStatus !== 'closed'));
      if (Array.isArray(log.values.linkedLogIds)) state.ui.healthLinkedLogIds = log.values.linkedLogIds.slice();
      if (log.values.envStatus) state.ui.envStatus = log.values.envStatus;
      if (log.values.choice) state.ui.choiceValue = log.values.choice;
      if (log.values.lifeStage) state.ui.instarValue = log.values.lifeStage;
      if (log.values.lifeStage) state.ui.statusDraft.lifeStage = log.values.lifeStage;
    }
    state.ui.noteText = log.note || '';
    state.ui.photoUrl = log.photoUrl || '';
    state.ui.photoType = log.photoType || 'daily';
    state.ui.logDate = log.date ? log.date.slice(0, 10) : todayKey();
    saveState();
    render();
  }

  function formatStatusSummary(values, profile) {
    var api = STATUS_API();
    if (!api || !values) return '';
    var panelType = api.resolvePanelType(profile);
    var parts = [];
    Object.keys(values).forEach(function (k) {
      if (values[k]) parts.push(api.findLabel(panelType, k, values[k], labelLang_()));
    });
    return parts.join(' · ');
  }

  function closeSheet() {
    state.ui.sheet = null;
    state.ui.recordId = null;
    state.ui.showMoreRecords = false;
    state.ui.statusDraft = {};
    state.ui.photoUrl = '';
    state.ui.noteText = '';
    state.ui.noteExpanded = false;
    state.ui.feedValue = '';
    state.ui.feedFood = '';
    state.ui.feedAmount = '';
    state.ui.feedUnit = 'count';
    state.ui.envValue = '';
    state.ui.abnormalValue = '';
    state.ui.instarValue = '';
    state.ui.choiceValue = '';
    state.ui.editingLogId = '';
    saveState();
    render();
  }

  function saveChipLog() {
    var pet = getActivePet();
    var rid = state.ui.recordId;
    if (!pet || !Object.keys(state.ui.statusDraft).length) return;
    var profile = getPetProfile(pet);
    var summary = formatStatusSummary(state.ui.statusDraft, profile);
    if (state.ui.statusDraft.lifeStage && /^L[123]$/.test(state.ui.statusDraft.lifeStage)) {
      pet.instarLabel = state.ui.statusDraft.lifeStage;
      syncPetDailyTasks_(pet);
    }
    if (rid === 'substrate') {
      addLog(pet.id, {
        type: 'environment',
        recordId: 'substrate',
        recordType: t('recordSubstrate'),
        values: Object.assign({}, state.ui.statusDraft),
        note: state.ui.noteText || summary,
        photoUrl: state.ui.photoUrl,
      });
      state.toast = t('logged') + ' · ' + t('recordSubstrate');
    } else if (rid === 'substrate_change') {
      addLog(pet.id, {
        type: 'environment',
        recordId: 'substrate_change',
        recordType: t('recordSubstrateChange'),
        values: Object.assign({}, state.ui.statusDraft),
        note: state.ui.noteText || summary || t('recordSubstrateChange'),
        photoUrl: state.ui.photoUrl,
      });
      state.toast = t('logged') + ' · ' + t('recordSubstrateChange');
    } else if (rid === 'frass') {
      addLog(pet.id, {
        type: 'environment',
        recordId: 'frass',
        recordType: t('recordFrass'),
        values: Object.assign({}, state.ui.statusDraft),
        note: state.ui.noteText || summary || t('recordFrass'),
        photoUrl: state.ui.photoUrl,
      });
      state.toast = t('logged') + ' · ' + t('recordFrass');
    } else if (rid === 'pupation') {
      addLog(pet.id, {
        type: 'record',
        recordId: 'pupation',
        recordType: t('recordPupation'),
        values: Object.assign({}, state.ui.statusDraft),
        note: state.ui.noteText || summary || t('recordPupation'),
        photoUrl: state.ui.photoUrl,
      });
      if (state.ui.statusDraft.lifeStage) {
        var api = STATUS_API();
        pet.instarLabel = api ? api.findLabel('beetle_larva', 'lifeStage', state.ui.statusDraft.lifeStage, labelLang_()) : state.ui.statusDraft.lifeStage;
        syncPetDailyTasks_(pet);
      }
      state.toast = t('logged') + ' · ' + t('recordPupation');
    } else {
      addLog(pet.id, {
        type: 'insect_status',
        recordId: 'insect_status',
        recordType: t('recordInsectStatus'),
        values: Object.assign({}, state.ui.statusDraft),
        note: state.ui.noteText || summary,
        photoUrl: state.ui.photoUrl,
      });
      state.toast = t('logged') + ' · ' + t('recordInsectStatus');
    }
    finishLogSave_(state.toast);
  }

  function savePhotoLog() {
    var pet = getActivePet();
    if (!pet || !state.ui.photoUrl) return;
    var po = PHOTO_OPTS.filter(function (p) { return p.value === state.ui.photoType; })[0];
    var logDate = state.ui.logDate ? new Date(state.ui.logDate + 'T12:00:00').toISOString() : new Date().toISOString();
    addLog(pet.id, {
      type: 'photo',
      recordId: 'photo',
      recordType: t('recordPhoto'),
      photoUrl: state.ui.photoUrl,
      photoType: state.ui.photoType,
      tags: state.ui.photoType ? [state.ui.photoType] : [],
      photos: [state.ui.photoUrl],
      note: state.ui.noteText || (po ? t(po.labelKey) : ''),
      date: logDate,
    });
    finishLogSave_(t('logSavedToast'));
  }

  function saveFeedingLog() {
    var pet = getActivePet();
    if (!pet || !state.ui.feedValue) return;
    var fo = FEED_OPTS.filter(function (f) { return f.value === state.ui.feedValue; })[0];
    var summary = [];
    if (state.ui.feedFood) summary.push(state.ui.feedFood);
    if (state.ui.feedAmount) summary.push(state.ui.feedAmount + (state.ui.feedUnit ? t('unit_' + state.ui.feedUnit) : ''));
    if (state.ui.feedSupplement && state.ui.feedSupplement !== 'none') {
      var sup = FEED_SUPPLEMENT_OPTS.filter(function (f) { return f.value === state.ui.feedSupplement; })[0];
      if (sup) summary.push(t(sup.labelKey));
    }
    if (fo) summary.push(t(fo.labelKey));
    addLog(pet.id, {
      type: 'feeding',
      recordId: 'feeding',
      recordType: t('recordFeeding'),
      values: {
        feedingStatus: state.ui.feedValue,
        food: state.ui.feedFood || '',
        amount: state.ui.feedAmount || '',
        unit: state.ui.feedUnit || '',
        supplement: state.ui.feedSupplement || '',
      },
      status: state.ui.feedValue,
      note: state.ui.noteText || summary.join(' · ') || (fo ? t(fo.labelKey) : ''),
      photoUrl: state.ui.photoUrl || '',
      photos: state.ui.photoUrl ? [state.ui.photoUrl] : [],
    });
    finishLogSave_(t('logSavedToast'));
  }

  function saveChoiceLog() {
    var pet = getActivePet();
    var rid = state.ui.recordId;
    var val = state.ui.choiceValue;
    if (!pet || !rid) return;
    if (isNumericRecord_(rid)) {
      saveEnvLog_();
      return;
    }
    if (!val) return;
    var meta = RECORD_META[rid] || {};
    var choiceApi = CHOICES_API();
    var label = choiceApi ? choiceApi.findLabel(rid, val, labelLang_()) : val;
    var title = meta.titleKey ? t(meta.titleKey) : label;
    var logType = meta.logType || 'record';
    var payload = {
      type: logType,
      recordId: rid,
      recordType: title,
      values: { choice: val },
      note: label,
      photoUrl: state.ui.photoUrl || '',
    };
    if (meta.envKey) payload.values.env = meta.envKey;
    if (meta.recordKey) payload.values.recordKey = meta.recordKey;
    addLog(pet.id, payload);
    finishLogSave_(t('logged') + ' · ' + title);
  }

  function saveEnvLog_() {
    var pet = getActivePet();
    var rid = state.ui.recordId;
    var val = state.ui.envValue;
    if (!pet || !rid || val === '' || val == null) return;
    var meta = RECORD_META[rid] || {};
    var unit = numericUnit_(rid);
    var title = meta.titleKey ? t(meta.titleKey) : rid;
    var noteParts = [String(val) + (unit ? unit : '')];
    if (state.ui.noteText) noteParts.push(state.ui.noteText);
    addLog(pet.id, {
      type: meta.logType || 'environment',
      recordId: rid,
      recordType: title,
      values: { value: val, unit: unit, env: meta.envKey || '', envStatus: state.ui.envStatus || '' },
      value: val,
      unit: unit,
      status: state.ui.envStatus || '',
      note: noteParts.join(' · '),
      photoUrl: state.ui.photoUrl || '',
      photos: state.ui.photoUrl ? [state.ui.photoUrl] : [],
    });
    finishLogSave_(t('logSavedToast'));
  }

  function saveWeightLog() {
    saveEnvLog_();
  }

  function saveNoteLog() {
    var pet = getActivePet();
    if (!pet) return;
    var text = String(state.ui.noteText || '').trim();
    var choice = state.ui.choiceValue || '';
    if (!text && !choice) return;
    var choiceApi = CHOICES_API();
    var choiceLabel = choice && choiceApi ? choiceApi.findLabel('note', choice, labelLang_()) : choice;
    addLog(pet.id, {
      type: 'note',
      recordId: 'note',
      recordType: t('recordNote'),
      values: { choice: choice || '' },
      note: text || choiceLabel || '',
      photoUrl: state.ui.photoUrl || '',
      photos: state.ui.photoUrl ? [state.ui.photoUrl] : [],
    });
    finishLogSave_(t('logSavedToast'));
  }

  function saveAbnormalityLog() {
    var pet = getActivePet();
    if (!pet || !state.ui.abnormalValue) return;
    var prev = state.ui.editingLogId
      ? (state.careLogs || []).filter(function (l) { return l.id === state.ui.editingLogId; })[0]
      : null;
    var prevV = (prev && prev.values) || {};
    var needsFollowUp = !!state.ui.healthReminder;
    var followUpDate = state.ui.healthFollowUpDate || '';
    var followUpStatus = 'closed';
    if (needsFollowUp) {
      followUpStatus = prevV.followUpStatus && prevV.followUpStatus !== 'closed'
        ? prevV.followUpStatus
        : 'pending';
      if (!followUpDate) {
        var d = new Date();
        d.setDate(d.getDate() + 7);
        followUpDate = d.toISOString().slice(0, 10);
      }
    }
    addLog(pet.id, {
      type: 'abnormality',
      recordId: 'abnormality',
      recordType: t('recordAbnormality'),
      values: {
        healthStatus: state.ui.abnormalValue,
        severity: state.ui.severity || '3',
        symptoms: state.ui.healthSymptoms || '',
        treatment: state.ui.healthTreatment || '',
        discoveredAt: state.ui.healthDiscoveredAt || state.ui.logDate || todayKey(),
        reminder: needsFollowUp,
        followUpDate: needsFollowUp ? followUpDate : (prevV.followUpDate || ''),
        followUpStatus: followUpStatus,
        linkedLogIds: Array.isArray(state.ui.healthLinkedLogIds) ? state.ui.healthLinkedLogIds.slice() : [],
        reminderResolved: !needsFollowUp,
        handledAt: prevV.handledAt || '',
        handledBy: prevV.handledBy || '',
        handleResult: prevV.handleResult || '',
      },
      status: state.ui.abnormalValue,
      note: [state.ui.healthSymptoms, state.ui.healthTreatment, state.ui.noteText].filter(Boolean).join(' · '),
      photoUrl: state.ui.photoUrl || '',
      photos: state.ui.photoUrl ? [state.ui.photoUrl] : [],
      date: state.ui.logDate ? (state.ui.logDate + 'T12:00:00.000Z') : undefined,
    });
    finishLogSave_(t('logSavedToast'));
  }

  function saveInstarLog() {
    var pet = getActivePet();
    if (!pet || !state.ui.instarValue) return;
    pet.instarLabel = state.ui.instarValue;
    syncPetDailyTasks_(pet);
    addLog(pet.id, {
      type: 'instar',
      recordId: 'instar',
      recordType: t('recordInstar'),
      values: { lifeStage: state.ui.instarValue },
      note: state.ui.noteText || state.ui.instarValue,
    });
    finishLogSave_(t('logged'));
  }

  function openQuickRecord(petId, recordId) {
    state.activePetId = petId;
    if (state.phase !== 'scan') {
      state.phase = 'board';
      state.boardTab = 'cards';
    }
    openRecord(recordId);
  }

  function openRecord(id, keepDraft) {
    state.ui.recordId = id;
    state.ui.sheet = id;
    if (!keepDraft) {
      state.ui.editingLogId = '';
      state.ui.statusDraft = {};
      state.ui.photoUrl = '';
      state.ui.noteText = '';
      state.ui.noteExpanded = false;
      state.ui.feedValue = '';
      state.ui.feedFood = '';
      state.ui.feedAmount = '';
      state.ui.feedUnit = 'count';
      state.ui.envValue = '';
      state.ui.abnormalValue = '';
      state.ui.instarValue = '';
      state.ui.choiceValue = '';
      state.ui.logDate = todayKey();
      state.ui.severity = '3';
      state.ui.healthReminder = false;
      state.ui.envStatus = '';
      state.ui.healthSymptoms = '';
      state.ui.healthTreatment = '';
      state.ui.healthDiscoveredAt = todayKey();
      state.ui.healthFollowUpDate = '';
      state.ui.healthLinkedLogIds = [];
    }
    state.ui.showMoreRecords = false;
    saveState();
    render();
  }

  function renderOptionalNote() {
    return (
      '<div class="hlc-sheet-note">' +
      '<label class="hlc-sheet-note__label">' + esc(t('optionalNote')) + '</label>' +
      '<textarea class="hlc-sheet-note__input" rows="3" placeholder="' + esc(t('notePlaceholder')) + '" data-hl-field="noteText">' + esc(state.ui.noteText || '') + '</textarea>' +
      '</div>'
    );
  }

  function phBandLabel_(val) {
    var n = parseFloat(String(val || '').replace(',', '.'));
    if (!isFinite(n)) return '';
    if (n < 6.5) return t('phBandLow');
    if (n > 7.5) return t('phBandHigh');
    return t('phBandNormal');
  }

  function renderSheetPhotoField_() {
    var prev = state.ui.photoUrl && state.ui.photoUrl.indexOf('data:') === 0
      ? '<img class="hlc-sheet-photo-preview" src="' + state.ui.photoUrl + '" alt="" />'
      : '';
    return (
      '<div class="hlc-sheet-section">' +
      '<span class="hlc-sheet-section__label">' + esc(t('addPhoto')) + '</span>' +
      prev +
      '<label class="hlc-btn hlc-btn--ghost hlc-sheet-photo-btn">' +
      '<span>' + esc(t('uploadPhoto')) + '</span>' +
      '<input type="file" accept="image/*" capture="environment" class="hlc-sr" data-hl-photo="sheet" /></label></div>'
    );
  }

  function renderEnvNormalChips_() {
    var opts = [
      { v: 'ok', key: 'envStatusOk' },
      { v: 'low', key: 'envStatusLow' },
      { v: 'high', key: 'envStatusHigh' },
    ];
    var chips = opts.map(function (o) {
      var active = state.ui.envStatus === o.v ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + active + '" data-hl-env-status="' + esc(o.v) + '">' + esc(t(o.key)) + '</button>';
    }).join('');
    return (
      '<div class="hlc-sheet-section">' +
      '<span class="hlc-sheet-section__label">' + esc(t('envNormalLabel')) + '</span>' +
      '<div class="hlc-chips">' + chips + '</div></div>'
    );
  }

  function renderRecordAdviceHint_(pet, recordType, rawValue) {
    if (!CARE_GUIDE() || !pet) return '';
    return CARE_GUIDE().renderRecordAdviceHint(state, pet, recordType, careGuideCtx_(), rawValue);
  }

  function renderAbnormalityDangerHint_(pet, healthStatus) {
    if (!CARE_GUIDE() || !pet) return '';
    var hs = healthStatus != null ? healthStatus : state.ui.abnormalValue;
    return CARE_GUIDE().renderAbnormalityDangerHint(state, pet, hs, careGuideCtx_());
  }

  function renderNumericSheetField_(rid) {
    var unit = numericUnit_(rid);
    var val = state.ui.envValue || '';
    var quick = numericQuickValues_(rid);
    var quickHtml = quick.map(function (v) {
      var active = String(val) === String(v) ? ' is-active' : '';
      return '<button type="button" class="hlc-chip hlc-chip--num' + active + '" data-hl-env-num="' + esc(String(v)) + '">' + esc(String(v)) + '</button>';
    }).join('');
    var phBand = rid === 'ph' ? phBandLabel_(val) : '';
    var phBandHtml = phBand
      ? '<p class="hlc-sheet-ph-band hlc-sheet-ph-band--' + (phBand === t('phBandNormal') ? 'ok' : 'watch') + '">' + esc(phBand) + '</p>'
      : '';
    var inputAttrs = rid === 'ph' ? ' min="0" max="14" step="0.1"' : ' step="any"';
    var normalHtml = (rid === 'temperature' || rid === 'water_temp') ? renderEnvNormalChips_() : '';
    var guideHint = (getActivePet())
      ? renderRecordAdviceHint_(getActivePet(), rid, val)
      : '';
    return (
      guideHint +
      '<div class="hlc-sheet-section">' +
      '<label class="hlc-sheet-field">' +
      '<span class="hlc-sheet-section__label">' + esc(t('recordValueLabel')) + '</span>' +
      '<div class="hlc-sheet-field__row">' +
      '<input type="number" class="hlc-sheet-input" value="' + esc(val) + '" data-hl-field="envValue"' + inputAttrs + ' inputmode="decimal" />' +
      (unit ? '<span class="hlc-sheet-field__unit">' + esc(unit) + '</span>' : '') +
      '</div></label>' +
      phBandHtml +
      (quickHtml ? '<div class="hlc-chips hlc-chips--quick">' + quickHtml + '</div>' : '') +
      '</div>' + normalHtml + renderOptionalNote() + renderSheetPhotoField_()
    );
  }

  function renderHealthSheetFields_() {
    var hs = STATUS_API() ? STATUS_API().shared.healthStatus : [];
    var abChips = hs.map(function (o) {
      var active = state.ui.abnormalValue === o.value ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + active + '" data-hl-abnormal="' + esc(o.value) + '">' + esc(optLabel(o)) + '</button>';
    }).join('');
    var sev = parseInt(state.ui.severity || '3', 10);
    var sevHtml = [1, 2, 3, 4, 5].map(function (n) {
      var active = sev === n ? ' is-active' : '';
      return '<button type="button" class="hlc-chip hlc-chip--num' + active + '" data-hl-severity="' + n + '">' + esc(String(n)) + '</button>';
    }).join('');
    var pet = getActivePet();
    var linked = Array.isArray(state.ui.healthLinkedLogIds) ? state.ui.healthLinkedLogIds : [];
    var recent = pet
      ? petLogs(pet.id).filter(function (l) { return l.type !== 'abnormality' || l.id !== state.ui.editingLogId; }).slice(0, 8)
      : [];
    var linkHtml = recent.length
      ? (
        '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + esc(t('healthLinkedRecordsLabel')) + '</span>' +
        '<div class="hlc-health-linked">' + recent.map(function (l) {
          var checked = linked.indexOf(l.id) >= 0 ? ' checked' : '';
          var label = (l.recordType || l.type || '') + ' · ' + String(l.date || '').slice(0, 10);
          return '<label class="hlc-sheet-check hlc-sheet-check--compact"><input type="checkbox" data-hl-health-link="' + esc(l.id) + '"' + checked + ' /> ' + esc(label) + '</label>';
        }).join('') + '</div></div>'
      )
      : '';
    var followBlock = state.ui.healthReminder
      ? (
        '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('healthFollowUpDateLabel')) + '</span>' +
        '<input type="date" class="hlc-sheet-input" value="' + esc(state.ui.healthFollowUpDate || '') + '" data-hl-field="healthFollowUpDate" /></label>'
      )
      : '';
    return (
      renderRecordAdviceHint_(getActivePet(), 'abnormality') +
      '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + esc(t('sectionHealthStatus')) + '</span><div class="hlc-chips">' + abChips + '</div></div>' +
      renderAbnormalityDangerHint_(getActivePet(), state.ui.abnormalValue) +
      '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('healthDiscoveredAtLabel')) + '</span>' +
      '<input type="date" class="hlc-sheet-input" value="' + esc(state.ui.healthDiscoveredAt || state.ui.logDate || todayKey()) + '" data-hl-field="healthDiscoveredAt" /></label>' +
      '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('healthSymptomsLabel')) + '</span>' +
      '<input type="text" class="hlc-sheet-input" value="' + esc(state.ui.healthSymptoms || '') + '" data-hl-field="healthSymptoms" placeholder="' + esc(t('healthSymptomsPlaceholder')) + '" /></label>' +
      '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + esc(t('healthSeverityLabel')) + '</span><div class="hlc-chips hlc-chips--quick">' + sevHtml + '</div></div>' +
      '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('healthTreatmentLabel')) + '</span>' +
      '<input type="text" class="hlc-sheet-input" value="' + esc(state.ui.healthTreatment || '') + '" data-hl-field="healthTreatment" placeholder="' + esc(t('healthTreatmentPlaceholder')) + '" /></label>' +
      '<label class="hlc-sheet-check"><input type="checkbox"' + (state.ui.healthReminder ? ' checked' : '') + ' data-hl-field="healthReminder" /> ' + esc(t('healthReminderLabel')) + '</label>' +
      followBlock +
      linkHtml +
      renderOptionalNote() + renderSheetPhotoField_()
    );
  }

  function renderFeedingSheetFields_() {
    var feedChips = FEED_OPTS.map(function (f) {
      var active = state.ui.feedValue === f.value ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + active + '" data-hl-feed="' + esc(f.value) + '">' + esc(t(f.labelKey)) + '</button>';
    }).join('');
    var suppChips = FEED_SUPPLEMENT_OPTS.map(function (f) {
      var active = state.ui.feedSupplement === f.value ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + active + '" data-hl-supplement="' + esc(f.value) + '">' + esc(t(f.labelKey)) + '</button>';
    }).join('');
    return (
      renderRecordAdviceHint_(getActivePet(), 'feeding') +
      '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + esc(t('sectionFeedingStatus')) + '</span><div class="hlc-chips">' + feedChips + '</div></div>' +
      '<div class="hlc-sheet-grid-2">' +
      '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('feedFoodLabel')) + '</span>' +
      '<input type="text" class="hlc-sheet-input" value="' + esc(state.ui.feedFood || '') + '" data-hl-field="feedFood" placeholder="' + esc(t('feedFoodPlaceholder')) + '" /></label>' +
      '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('feedAmountLabel')) + '</span>' +
      '<div class="hlc-sheet-field__row">' +
      '<input type="number" class="hlc-sheet-input" value="' + esc(state.ui.feedAmount || '') + '" data-hl-field="feedAmount" min="0" step="any" />' +
      '<select class="hlc-sheet-select" data-hl-field="feedUnit">' +
      ['count', 'g', 'ml'].map(function (u) {
        var sel = state.ui.feedUnit === u ? ' selected' : '';
        return '<option value="' + u + '"' + sel + '>' + esc(t('unit_' + u)) + '</option>';
      }).join('') +
      '</select></div></label></div>' +
      '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + esc(t('feedSupplementLabel')) + '</span><div class="hlc-chips">' + suppChips + '</div></div>' +
      renderOptionalNote() + renderSheetPhotoField_()
    );
  }

  function recordChoiceOptions_(recordId) {
    var api = CHOICES_API();
    return api ? api.getOptions(recordId) : [];
  }

  function renderSingleChoiceSection(recordId, labelText) {
    var opts = recordChoiceOptions_(recordId);
    if (!opts.length) return '';
    var chips = opts.map(function (o) {
      var active = state.ui.choiceValue === o.value ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + active + '" data-hl-choice="' + esc(o.value) + '">' + esc(optLabel(o)) + '</button>';
    }).join('');
    return (
      '<div class="hlc-sheet-section">' +
      '<span class="hlc-sheet-section__label">' + esc(labelText) + '</span>' +
      '<div class="hlc-chips">' + chips + '</div></div>'
    );
  }

  function renderChoiceSheet_(recordId) {
    var meta = RECORD_META[recordId];
    if (!meta) return { title: '', inner: '', saveAction: '' };
    var opts = recordChoiceOptions_(recordId);
    if (!opts.length) return { title: '', inner: '', saveAction: '' };
    return {
      title: t(meta.titleKey),
      inner: renderRecordAdviceHint_(getActivePet(), recordId) + renderSingleChoiceSection(recordId, t('pickOneOption')),
      saveAction: 'save-choice',
    };
  }

  function renderChipSection(label, sectionKey, options, draftKey) {
    var draft = draftKey === 'instar' ? { lifeStage: state.ui.instarValue } : state.ui.statusDraft;
    var selected = draftKey === 'instar' ? state.ui.instarValue : draft[sectionKey];
    var chips = options.map(function (o) {
      var active = selected === o.value ? ' is-active' : '';
      var attr = draftKey === 'instar' ? 'data-hl-instar' : 'data-hl-status-key="' + esc(sectionKey) + '" data-hl-status-value';
      if (draftKey === 'instar') {
        return '<button type="button" class="hlc-chip' + active + '" data-hl-instar="' + esc(o.value) + '">' + esc(optLabel(o)) + '</button>';
      }
      return '<button type="button" class="hlc-chip' + active + '" data-hl-status-key="' + esc(sectionKey) + '" data-hl-status-value="' + esc(o.value) + '">' + esc(optLabel(o)) + '</button>';
    }).join('');
    return '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + esc(label) + '</span><div class="hlc-chips">' + chips + '</div></div>';
  }

  function renderSheet() {
    if (!state.ui.sheet) return '';
    var pet = getActivePet();
    if (CARE_GUIDE()) {
      var guideSheet = CARE_GUIDE().renderSheet(state, pet, careGuideCtx_());
      if (guideSheet) return guideSheet;
    }
    if (BREEDING()) {
      var breedSheet = BREEDING().renderSheet(state, pet, breedingCtx_());
      if (breedSheet) return breedSheet;
    }
    var profile = getPetProfile(pet);
    var rid = state.ui.recordId;
    var inner = '';
    var title = '';
    var saveAction = '';

    if (state.ui.sheet === 'import-backup') {
      return renderImportBackupSheet_();
    }
    if (state.ui.sheet === 'qr-import') {
      return renderQrImportSheet_();
    }
    if (state.ui.sheet === 'qr-import-preview') {
      return renderQrImportPreviewSheet_();
    }
    if (state.ui.sheet === 'qr-preview') {
      return renderQrPreviewSheet_();
    }
    if (state.ui.sheet === 'template-picker') {
      return renderTemplatePickerSheet_();
    }

    if (state.ui.sheet === 'reminder-settings') {
      if (!pet) return '';
      var reminderOn = !!pet.careReminder;
      var notifBlock = healthFollowUp_() ? healthFollowUp_().renderNotifBlock() : '';
      return (
        '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
        '<div class="hlc-sheet hlc-sheet--reminder" role="dialog">' +
        '<div class="hlc-sheet__handle"></div>' +
        '<h2 class="hlc-sheet__title">' + esc(t('reminderSettingsTitle')) + '</h2>' +
        '<p class="hlc-sheet__hint">' + esc(t('reminderSettingsHint')) + '</p>' +
        '<label class="hlc-sheet-check"><input type="checkbox"' + (reminderOn ? ' checked' : '') + ' data-hl-pet-field="careReminder" /> ' + esc(t('healthReminderLabel')) + '</label>' +
        notifBlock +
        '<div class="hlc-sheet__actions">' +
        '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="close-sheet">' + esc(t('saveLog')) + '</button>' +
        '</div></div></div>'
      );
    }

    if (state.ui.sheet === 'health-handle') {
      return healthFollowUp_() ? healthFollowUp_().renderHandleSheet() : '';
    }

    if (state.ui.showMoreRecords) {
      title = t('moreRecordsTitle');
      inner = renderRecordGrid(pet, deckForPet(pet).more, true);
      return (
        '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
        '<div class="hlc-sheet" role="dialog">' +
        '<div class="hlc-sheet__handle"></div>' +
        '<h2 class="hlc-sheet__title">' + esc(title) + '</h2>' +
        inner +
        '<div class="hlc-sheet__actions">' +
        '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="close-sheet">' + esc(t('cancel')) + '</button>' +
        '</div></div></div>'
      );
    }

    if (rid === 'insect_status') {
      title = t('recordInsectStatus');
      var api = STATUS_API();
      var panel = api ? api.getPanel(profile) : null;
      inner = (panel ? panel.sections : []).map(function (sec) {
        return renderChipSection(sectionT(sec.key), sec.key, sec.options, 'status');
      }).join('') + renderOptionalNote();
      saveAction = 'save-chips';
    } else if (rid === 'photo') {
      title = t('recordPhoto');
      var prev = state.ui.photoUrl && state.ui.photoUrl.indexOf('data:') === 0 ? '<img src="' + state.ui.photoUrl + '" style="width:100%;border-radius:12px;margin-bottom:12px" alt="" />' : '';
      var photoChips = PHOTO_OPTS.map(function (o) {
        var active = state.ui.photoType === o.value ? ' is-active' : '';
        return '<button type="button" class="hlc-chip' + active + '" data-hl-chip="photoType" data-hl-value="' + esc(o.value) + '">' + esc(t(o.labelKey)) + '</button>';
      }).join('');
      inner = prev +
        '<label class="hlc-btn hlc-btn--ghost"><span>' + esc(t('takePhoto')) + '</span><input type="file" accept="image/*" capture="environment" class="hlc-sr" data-hl-photo="capture" /></label>' +
        '<label class="hlc-btn hlc-btn--ghost" style="margin-top:8px"><span>' + esc(t('uploadPhoto')) + '</span><input type="file" accept="image/*" class="hlc-sr" data-hl-photo="upload" /></label>' +
        '<div class="hlc-sheet-section" style="margin-top:12px"><span class="hlc-sheet-section__label">' + esc(t('photoTypeLabel')) + '</span><div class="hlc-chips">' + photoChips + '</div></div>' +
        '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('photoDateLabel')) + '</span>' +
        '<input type="date" class="hlc-sheet-input" value="' + esc(state.ui.logDate || todayKey()) + '" data-hl-field="logDate" /></label>' +
        renderOptionalNote();
      saveAction = 'save-photo';
    } else if (rid === 'feeding') {
      title = t('recordFeeding');
      inner = renderFeedingSheetFields_();
      saveAction = 'save-feeding';
    } else if (rid === 'substrate') {
      title = t('recordSubstrate');
      var subOpts = (STATUS_API() && STATUS_API().panels.beetle_larva) ? STATUS_API().panels.beetle_larva.sections.filter(function (s) { return s.key === 'substrateStatus'; })[0].options : [];
      inner = renderRecordAdviceHint_(pet, 'substrate') + renderChipSection(t('sectionSubstrateStatus'), 'substrateStatus', subOpts, 'status') + renderOptionalNote();
      saveAction = 'save-chips';
    } else if (rid === 'substrate_change') {
      title = t('recordSubstrateChange');
      var repOpts = (STATUS_API() && STATUS_API().panels.beetle_larva) ? STATUS_API().panels.beetle_larva.sections.filter(function (s) { return s.key === 'substrateStatus'; })[0].options.filter(function (o) {
        return o.value === 'replace' || o.value === 'normal';
      }) : [];
      inner = renderRecordAdviceHint_(pet, 'substrate_change') + renderChipSection(t('sectionSubstrateStatus'), 'substrateStatus', repOpts, 'status') + renderOptionalNote();
      saveAction = 'save-chips';
    } else if (rid === 'instar') {
      title = t('recordInstar');
      var ls = (STATUS_API() && STATUS_API().panels.beetle_larva) ? STATUS_API().panels.beetle_larva.sections.filter(function (s) { return s.key === 'lifeStage'; })[0].options : [];
      inner = renderChipSection(t('sectionLifeStage'), 'lifeStage', ls, 'instar') + renderOptionalNote();
      saveAction = 'save-instar';
    } else if (rid === 'abnormality') {
      title = t('recordAbnormality');
      inner = renderHealthSheetFields_();
      saveAction = 'save-abnormality';
    } else if (rid === 'weight') {
      title = t('recordWeight');
      inner = renderNumericSheetField_('weight');
      saveAction = 'save-weight';
    } else if (rid === 'pupation') {
      title = t('recordPupation');
      var pupOpts = (STATUS_API() && STATUS_API().panels.beetle_larva) ? STATUS_API().panels.beetle_larva.sections.filter(function (s) { return s.key === 'lifeStage'; })[0].options.filter(function (o) {
        return o.value === 'pre_pupa' || o.value === 'pupa' || o.value === 'emerged' || o.value === 'adult';
      }) : [];
      inner = renderChipSection(t('sectionLifeStage'), 'lifeStage', pupOpts, 'status') + renderOptionalNote();
      saveAction = 'save-chips';
    } else if (rid === 'note') {
      title = t('recordNote');
      inner = renderSingleChoiceSection('note', t('noteCategoryLabel')) +
        '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + esc(t('noteTextLabel')) + '</span>' +
        '<textarea class="hlc-sheet-textarea" rows="4" data-hl-field="noteText" placeholder="' + esc(t('notePlaceholder')) + '">' + esc(state.ui.noteText || '') + '</textarea></label>' +
        renderSheetPhotoField_();
      saveAction = 'save-note';
    } else if (RECORD_META[rid] && RECORD_META[rid].envKey) {
      title = t(RECORD_META[rid].titleKey);
      if (rid === 'frass') {
        inner = renderChipSection(t('recordFrass'), 'substrateStatus', (STATUS_API() && STATUS_API().panels.beetle_larva) ? STATUS_API().panels.beetle_larva.sections.filter(function (s) { return s.key === 'substrateStatus'; })[0].options.filter(function (o) { return o.value === 'frass_heavy' || o.value === 'normal'; }) : [], 'status') + renderOptionalNote();
        saveAction = 'save-chips';
      } else if (isNumericRecord_(rid)) {
        inner = renderNumericSheetField_(rid);
        saveAction = 'save-env';
      } else {
        var choiceSheet = renderChoiceSheet_(rid);
        title = choiceSheet.title || title;
        inner = choiceSheet.inner;
        saveAction = choiceSheet.saveAction || 'save-choice';
      }
    } else if (RECORD_META[rid]) {
      var genericChoice = renderChoiceSheet_(rid);
      title = genericChoice.title;
      inner = genericChoice.inner;
      saveAction = genericChoice.saveAction;
    }

    var photoBtn = (saveAction === 'save-chips' || saveAction === 'save-abnormality' || saveAction === 'save-choice') ?
      '<label class="hlc-btn hlc-btn--ghost">' + esc(t('addPhoto')) + '<input type="file" accept="image/*" capture="environment" class="hlc-sr" data-hl-photo="sheet" /></label>' : '';
    var primaryLabel = state.ui.editingLogId ? t('updateLog') : t('saveLog');
    var primary = saveAction ? '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="' + saveAction + '">' + esc(primaryLabel) + '</button>' : '';

    return (
      '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
      '<div class="hlc-sheet hlc-sheet--drawer hlc-sheet--' + esc(state.ui.recordId || 'form') + '" role="dialog" aria-modal="true">' +
      '<div class="hlc-sheet__handle"></div>' +
      '<h2 class="hlc-sheet__title">' + esc(title) + '</h2>' +
      inner +
      '<div class="hlc-sheet__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="close-sheet">' + esc(t('cancel')) + '</button>' +
      photoBtn + primary +
      '</div></div></div>'
    );
  }

  function shouldShowIntroTour_() {
    /* Phase 5: empty home uses a short collapsible tip — do not auto-open the multi-step tour. */
    return false;
  }

  function ensureIntroTour_() {
    if (!shouldShowIntroTour_()) {
      if (state.ui && state.ui.tourActive && !state.pets.length) {
        state.ui.tourActive = false;
      }
      return;
    }
    state.ui.tourActive = true;
    if (typeof state.ui.tourStep !== 'number' || state.ui.tourStep < 0) state.ui.tourStep = 0;
    if (state.ui.tourStep >= TOUR_STEPS.length) state.ui.tourStep = 0;
  }

  function finishIntroTour_() {
    destroyTourOverlay_();
    state.introTourDone = true;
    state.introTourVersion = INTRO_TOUR_VERSION;
    state.ui.tourActive = false;
    state.ui.tourStep = 0;
    saveState();
  }

  function clearTourTargetPulse_() {
    var root = global.document.getElementById(ROOT_ID);
    if (!root) return;
    root.querySelectorAll('.hlc-tour-target-pulse').forEach(function (el) {
      el.classList.remove('hlc-tour-target-pulse');
    });
  }

  function destroyTourOverlay_() {
    clearTourTargetPulse_();
    var host = global.document.getElementById(TOUR_HOST_ID);
    if (host) host.remove();
  }

  /** Mount tour on document.body so fixed positioning matches viewport (section transform breaks in-root fixed). */
  function syncTourOverlay_() {
    if (!state.ui.tourActive) {
      destroyTourOverlay_();
      return;
    }
    var host = global.document.getElementById(TOUR_HOST_ID);
    if (!host) {
      host = global.document.createElement('div');
      host.id = TOUR_HOST_ID;
      global.document.body.appendChild(host);
    }
    host.innerHTML = renderTourOverlay_();
    global.requestAnimationFrame(function () {
      global.requestAnimationFrame(function () { positionTourSpotlight_(); });
    });
  }

  function resetTourPanelLayout_(panel) {
    if (!panel) return;
    panel.style.position = '';
    panel.style.top = '';
    panel.style.left = '';
    panel.style.right = '';
    panel.style.bottom = '';
    panel.style.width = '';
    panel.style.maxWidth = '';
    panel.style.transform = '';
  }

  function positionTourPanel_(panel, holeBox) {
    if (!panel || !holeBox) return;
    var margin = 14;
    var vw = global.innerWidth;
    var vh = global.innerHeight;
    var panelW = Math.min(440, vw - 24);
    panel.style.position = 'fixed';
    panel.style.width = panelW + 'px';
    panel.style.maxWidth = 'calc(100vw - 24px)';
    var panelH = panel.offsetHeight || 260;
    var holeBottom = holeBox.top + holeBox.height;
    var spaceBelow = vh - holeBottom - margin;
    var spaceAbove = holeBox.top - margin;
    var placeBelow = spaceBelow >= panelH || spaceBelow >= spaceAbove;
    var top = placeBelow ? holeBottom + margin : holeBox.top - panelH - margin;
    top = Math.max(8, Math.min(top, vh - panelH - 8));
    var left = holeBox.left + holeBox.width / 2 - panelW / 2;
    left = Math.max(12, Math.min(left, vw - panelW - 12));
    panel.style.top = top + 'px';
    panel.style.left = left + 'px';
    panel.style.bottom = 'auto';
    panel.style.right = 'auto';
    panel.style.transform = 'none';
  }

  function renderTourDots_(activeIdx, total) {
    var html = '';
    for (var i = 0; i < total; i++) {
      html += '<span class="hlc-tour-v2__dot' + (i === activeIdx ? ' is-active' : '') + '" aria-hidden="true"></span>';
    }
    return '<div class="hlc-tour-v2__dots" role="tablist" aria-label="' + esc(t('tourProgressAria')) + '">' + html + '</div>';
  }

  function renderTourBullets_(keys) {
    if (!keys || !keys.length) return '';
    return '<ul class="hlc-tour-v2__bullets">' + keys.map(function (key) {
      return '<li>' + esc(t(key)) + '</li>';
    }).join('') + '</ul>';
  }

  function renderTourChips_(keys) {
    if (!keys || !keys.length) return '';
    return '<div class="hlc-tour-v2__chips">' + keys.map(function (key) {
      return '<span class="hlc-tour-v2__chip">' + esc(t(key)) + '</span>';
    }).join('') + '</div>';
  }

  function renderTourOverlay_() {
    if (!state.ui.tourActive) return '';
    var step = TOUR_STEPS[state.ui.tourStep] || TOUR_STEPS[0];
    var total = TOUR_STEPS.length;
    var idx = state.ui.tourStep;
    var isWelcome = step.mode === 'welcome';
    var isLast = idx >= total - 1;
    var bodyHtml = '';
    if (step.leadKey) {
      bodyHtml += '<p class="hlc-tour-v2__lead">' + esc(t(step.leadKey)) + '</p>';
    }
    bodyHtml += renderTourBullets_(step.bulletKeys);
    if (step.bodyKey) {
      bodyHtml += '<p class="hlc-tour-v2__body">' + esc(t(step.bodyKey)) + '</p>';
    }
    bodyHtml += renderTourChips_(step.chipKeys);
    var primaryAction = isLast && step.ctaKey
      ? '<button type="button" class="hlc-btn hlc-btn--primary hlc-tour-v2__cta" data-hl-action="tour-start-add">' + esc(t(step.ctaKey)) + '</button>'
      : (isLast
        ? '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="tour-done">' + esc(t('tourDone')) + '</button>'
        : '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="tour-next">' + esc(t('tourNext')) + '</button>');
    return (
      '<div class="hlc-tour-v2' + (isWelcome ? ' hlc-tour-v2--welcome' : '') + '" id="hlcTourOverlay" role="dialog" aria-modal="true" aria-labelledby="hlcTourTitle">' +
      '<div class="hlc-tour-v2__backdrop" aria-hidden="true"></div>' +
      '<div class="hlc-tour-v2__hole" id="hlcTourHole" hidden></div>' +
      '<div class="hlc-tour-v2__panel" id="hlcTourPanel">' +
      '<div class="hlc-tour-v2__panel-head">' +
      renderTourDots_(idx, total) +
      '<button type="button" class="hlc-tour-v2__close" data-hl-action="tour-skip" aria-label="' + esc(t('tourSkip')) + '">×</button>' +
      '</div>' +
      '<div class="hlc-tour-v2__icon" aria-hidden="true">' + esc(step.icon || '✨') + '</div>' +
      '<p class="hlc-tour-v2__step-label">' + esc(t('tourStepLabel').replace('{n}', String(idx + 1)).replace('{total}', String(total))) + '</p>' +
      '<h2 class="hlc-tour-v2__title" id="hlcTourTitle">' + esc(t(step.titleKey)) + '</h2>' +
      bodyHtml +
      '<div class="hlc-tour-v2__actions">' +
      '<button type="button" class="hlc-tour-v2__link" data-hl-action="tour-skip">' + esc(t('tourSkip')) + '</button>' +
      '<div class="hlc-tour-v2__actions-main">' +
      (isWelcome ? '' : '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="tour-prev">' + esc(t('tourPrev')) + '</button>') +
      primaryAction +
      '</div></div></div></div>'
    );
  }

  function positionTourSpotlight_() {
    if (!state.ui.tourActive) return;
    clearTourTargetPulse_();
    var overlay = global.document.getElementById('hlcTourOverlay');
    var hole = global.document.getElementById('hlcTourHole');
    var panel = global.document.getElementById('hlcTourPanel');
    if (!overlay || !hole || !panel) return;
    resetTourPanelLayout_(panel);
    var step = TOUR_STEPS[state.ui.tourStep] || TOUR_STEPS[0];
    var root = global.document.getElementById(ROOT_ID);
    if (step.mode === 'welcome' || !step.target) {
      overlay.classList.add('hlc-tour-v2--welcome');
      overlay.classList.remove('hlc-tour-v2--spotlight');
      hole.hidden = true;
      return;
    }
    overlay.classList.remove('hlc-tour-v2--welcome');
    overlay.classList.add('hlc-tour-v2--spotlight');
    var target = root ? root.querySelector(step.target) : null;
    if (!target) {
      hole.hidden = true;
      return;
    }
    target.classList.add('hlc-tour-target-pulse');
    try { target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' }); } catch (eScroll) {}
    var pad = step.target === '#hlcTourAddPet' ? 12 : 8;
    function applyLayout_() {
      var rect = target.getBoundingClientRect();
      if (rect.width < 2 && rect.height < 2) return;
      var top = Math.max(8, rect.top - pad);
      var left = Math.max(8, rect.left - pad);
      var width = Math.min(global.innerWidth - 16, rect.width + pad * 2);
      var height = Math.min(global.innerHeight - 16, rect.height + pad * 2);
      hole.hidden = false;
      hole.style.top = top + 'px';
      hole.style.left = left + 'px';
      hole.style.width = width + 'px';
      hole.style.height = height + 'px';
      positionTourPanel_(panel, { top: top, left: left, width: width, height: height });
    }
    global.requestAnimationFrame(function () {
      global.requestAnimationFrame(applyLayout_);
    });
  }

  function renderShellNav() {
    var tabs = [
      { id: 'cards', label: t('tabCards'), icon: 'tabCards' },
      { id: 'logs', label: t('tabLogs'), icon: 'tabLogs' },
      { id: 'trends', label: t('tabTrends'), icon: 'tabTrends' },
      { id: 'profile', label: t('tabProfile'), icon: 'tabProfile' },
    ];
    var activeIdx = 0;
    for (var ti = 0; ti < tabs.length; ti++) {
      if (state.boardTab === tabs[ti].id) { activeIdx = ti; break; }
    }
    return (
      '<div class="hlc-shell-nav-wrap hlc-shell-nav-wrap--dash">' +
      '<nav class="hlc-shell-nav hlc-shell-nav--dash" id="hlcTourShellNav" aria-label="' + esc(t('hl_shell_nav_aria')) + '">' +
      '<span class="hlc-shell-nav__indicator" style="--hlc-tab-index:' + activeIdx + ';--hlc-tab-count:' + tabs.length + '"></span>' +
      tabs.map(function (tab) {
        var count = tabBadgeCount_(tab.id);
        var badge = count >= 0
          ? (
            '<span class="hlc-shell-nav__badge' +
            (tab.id === 'logs' && count > 0 ? ' hlc-shell-nav__badge--alert' : '') +
            (tab.id === 'cards' ? ' hlc-shell-nav__badge--count' : '') +
            '">' + esc(String(count)) + '</span>'
          )
          : '';
        return (
          '<button type="button" class="hlc-shell-nav__btn' + (state.boardTab === tab.id ? ' is-active' : '') + '" data-hl-board-tab="' + tab.id + '">' +
          '<span class="hlc-shell-nav__icon">' + svgIcon(tab.icon) + '</span>' +
          '<span class="hlc-shell-nav__text">' +
          '<span class="hlc-shell-nav__label">' + esc(tab.label) + '</span>' + badge +
          '</span></button>'
        );
      }).join('') +
      '</nav></div>'
    );
  }

  function statProgressPct_(itemKey, stats, dash) {
    if (!stats.total) return 0;
    if (itemKey === 'homeStatPets') return 100;
    if (itemKey === 'homeStatOk') return dash && dash.questTotal ? Math.round((dash.questDone / dash.questTotal) * 100) : Math.round((stats.ok / stats.total) * 100);
    if (itemKey === 'homeStatNeedCare') return Math.round((stats.needCare / stats.total) * 100);
    if (itemKey === 'homeStatWatch') return Math.round((stats.watch / stats.total) * 100);
    return 0;
  }

  function buildQuickDockItems_(context, pet, primary) {
    var items;
    var logItem;
    if (context === 'board' && pet) {
      items = [
        { icon: 'plus', key: 'addPet', action: 'start-create' },
        { icon: 'camera', key: 'quickPhoto', action: 'quick-photo-board' },
        { icon: 'tabLogs', key: 'quickLog', action: 'quick-log-board' },
        { icon: 'qr', key: 'actionQr', action: 'import-qr' },
        { icon: 'export', key: 'exportCsv', action: 'export-csv' },
      ];
      items.forEach(function (item) {
        if (item.action === 'quick-log-board') item.primary = true;
      });
      return items;
    }
    logItem = primary && primary.action === 'start-today-care'
      ? { icon: 'activity', key: 'startTodayCare', action: 'start-today-care' }
      : { icon: 'tabLogs', key: 'quickLog', action: 'quick-log-collection' };
    items = [
      { icon: 'plus', key: 'addPet', action: 'start-create' },
      { icon: 'camera', key: 'quickPhoto', action: 'quick-photo-collection' },
      logItem,
      { icon: 'qr', key: 'actionQr', action: 'import-qr' },
      { icon: 'export', key: 'exportFullBackup', action: 'export-full-backup' },
    ];
    items.forEach(function (item) {
      item.primary = !!(primary && primary.action === item.action);
    });
    if (primary && primary.action === 'start-create') {
      items[0].primary = true;
    }
    if (!items.some(function (item) { return item.primary; })) {
      items[2].primary = true;
    }
    return items;
  }

  function quickDockContext_() {
    var pet = getActivePet();
    if (pet && state.phase === 'board') return { context: 'board', pet: pet };
    return { context: 'collection', pet: null };
  }

  function shouldShowQuickDock_() {
    var ctx = quickDockContext_();
    if (ctx.context === 'board') return true;
    return state.phase === 'collection' && state.boardTab === 'cards' && state.pets.length > 0;
  }

  function renderQuickActionDock_(modifier) {
    var ctx = quickDockContext_();
    var primary = ctx.context === 'board'
      ? { action: 'quick-log-board', label: t('quickAddLog') }
      : homePrimaryAction_(collectionTodayStats_());
    var items = buildQuickDockItems_(ctx.context, ctx.pet, primary);
    var modClass = modifier ? (' hlc-action-dock--' + modifier) : '';
    return (
      '<div class="hlc-action-dock' + modClass + '" aria-label="' + esc(t('todayActions')) + '">' +
      '<p class="hlc-action-dock__title">' + esc(t('actionDockTitle')) + '</p>' +
      '<div class="hlc-action-dock__track">' +
      items.map(function (item) {
        var isPrimary = !!item.primary;
        return (
          '<button type="button" class="hlc-action-dock__item' + (isPrimary ? ' hlc-action-dock__item--primary' : '') + '" data-hl-action="' + esc(item.action) + '">' +
          '<span class="hlc-action-dock__icon">' + svgIcon(item.icon) + '</span>' +
          '<span class="hlc-action-dock__label">' + esc(t(item.key)) + '</span></button>'
        );
      }).join('') +
      '</div></div>'
    );
  }

  function renderHomeFeatures_() {
    return renderQuickActionDock_('hero');
  }

  function renderAppChrome_() {
    var dash = collectionTodayStats_();
    var petCount = state.pets.length;
    var metaLine = petCount
      ? t('appChromeMeta')
        .replace('{n}', String(petCount))
        .replace('{pct}', String(dash.questPct))
      : t('appChromeEmptyMeta');
    var progressChip = petCount && dash.questPct < 100
      ? (
        '<span class="hlc-app-chrome__progress" title="' + esc(t('heroTodayCompletion')) + '">' +
        esc(String(dash.questPct)) + '%</span>'
      )
      : (petCount && dash.questPct >= 100
        ? '<span class="hlc-app-chrome__progress hlc-app-chrome__progress--done" title="' + esc(t('todayCareComplete')) + '">' + svgIcon('check') + '</span>'
        : '');
    return (
      '<header class="hlc-app-chrome">' +
      '<div class="hlc-app-chrome__brand">' +
      '<span class="hlc-app-chrome__mark" aria-hidden="true">' + svgIcon('specimen') + '</span>' +
      '<div class="hlc-app-chrome__text">' +
      '<h2 class="hlc-app-chrome__title">' + esc(t('appChromeTitle')) + '</h2>' +
      '<p class="hlc-app-chrome__meta">' + esc(metaLine) + '</p>' +
      '</div></div>' +
      '<div class="hlc-app-chrome__actions">' + progressChip +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--sm hlc-app-chrome__add" data-hl-action="start-create">' +
      '<span class="hlc-app-chrome__add-icon" aria-hidden="true">' + svgIcon('plus') + '</span>' +
      '<span>' + esc(t('addPet')) + '</span></button>' +
      '</div></header>'
    );
  }

  function shouldShowAppChrome_() {
    var pet = getActivePet();
    if (pet && state.phase === 'board') return false;
    /* Empty collection: keep chrome minimal — primary CTA lives in the welcome panel. */
    if (state.phase === 'collection' && state.boardTab === 'cards' && !state.pets.length) return false;
    return true;
  }

  function shouldShowShellNav_() {
    if (state.phase === 'collection' && state.boardTab === 'cards' && !state.pets.length) return false;
    return true;
  }

  function renderCommandAlerts_(dash) {
    var petLines = state.pets.map(function (pet) {
      var tone = cardStatusTone_(pet);
      var task = petAttentionLine_(pet);
      if (tone === 'ok' && task !== t('cardStatusOk') && task !== t('summaryAllDone')) tone = 'watch';
      return (
        '<li><button type="button" class="hlc-command-alert hlc-command-alert--' + tone + '" data-hl-open-pet="' + esc(pet.id) + '" aria-label="' + esc(pet.petName + ' — ' + task) + '">' +
        '<span class="hlc-command-alert__pet">' + esc(pet.petName) + '</span>' +
        '<span class="hlc-command-alert__sep" aria-hidden="true">：</span>' +
        '<span class="hlc-command-alert__task">' + esc(task) + '</span>' +
        '<span class="hlc-command-alert__chev" aria-hidden="true">' + svgIcon('chevronRight') + '</span></button></li>'
      );
    }).join('');
    var banner = dash.needCount
      ? (
        '<li class="hlc-command-alert hlc-command-alert--banner">' +
        '<strong>' + esc(String(dash.needCount) + ' ' + t('commandAlertNeed')) + '</strong></li>'
      )
      : '';
    return (
      '<div class="hlc-command-alerts-block">' +
      '<h3 class="hlc-command-alerts__title">' + esc(t('commandAlertsTitle')) + '</h3>' +
      '<ul class="hlc-command-alerts">' + banner + petLines + '</ul></div>'
    );
  }

  function renderTodaySummaryCard_(dash) {
    if (!state.pets.length) {
      return (
        '<aside class="hlc-summary-card hlc-summary-card--widget hlc-summary-card--care-empty">' +
        '<header class="hlc-summary-card__head">' +
        '<h3 class="hlc-summary-card__title">' + esc(t('todayCareSummary')) + '</h3>' +
        '</header>' +
        (CARE_GUIDE() ? CARE_GUIDE().renderCareGuideEmptyHint(careGuideCtx_()) : '') +
        '</aside>'
      );
    }
    var pct = dash.questPct;
    var ringStyle = 'background:conic-gradient(var(--hlc-accent, var(--hl-green)) ' + pct + '%, color-mix(in srgb, var(--hl-line) 55%, transparent) 0)';
    var nextLine = dash.nextTodo
      ? esc(dash.nextTodo.pet.petName) + ' · ' + esc(questT(dash.nextTodo.quest))
      : esc(t('summaryAllDone'));
    var lastLine = dash.lastLog
      ? esc(logSummaryLine_(dash.lastLog)) + ' · ' + esc(formatRelative(dash.lastLog.date))
      : esc(t('summaryNoLogYet'));
    var incomplete = Math.max(0, dash.questTotal - dash.questDone);
    var needList = dash.needPets.length
      ? (
        '<ul class="hlc-summary-card__need-list">' + dash.needPets.map(function (pet) {
          return (
            '<li><button type="button" class="hlc-summary-card__need-item hlc-summary-card__need-item--' + cardStatusTone_(pet) + '" data-hl-open-pet="' + esc(pet.id) + '">' +
            '<span>' + esc(pet.petName) + '</span>' +
            '<em>' + esc(cardTodayStatus(pet)) + '</em></button></li>'
          );
        }).join('') + '</ul>'
      )
      : '<p class="hlc-summary-card__all-clear">' + esc(t('summaryAllClear')) + '</p>';
    var alertHtml = dash.needCount
      ? '<span class="hlc-summary-card__alert">' + esc(String(dash.needCount)) + ' ' + esc(t('summaryNeedBadge')) + '</span>'
      : '';
    var incompleteHint = incomplete
      ? '<p class="hlc-summary-card__progress-hint">' + esc(String(incomplete) + ' ' + t('summaryIncompleteHint')) + '</p>'
      : '';
    return (
      '<aside class="hlc-summary-card hlc-summary-card--widget">' +
      '<header class="hlc-summary-card__head">' +
      '<h3 class="hlc-summary-card__title">' + esc(t('todayCareSummary')) + '</h3>' + alertHtml +
      '</header>' +
      '<div class="hlc-summary-card__top">' +
      '<div class="hlc-summary-card__ring" style="' + ringStyle + '" aria-hidden="true">' +
      '<span class="hlc-summary-card__ring-val">' + esc(String(pct)) + '%</span></div>' +
      '<div class="hlc-summary-card__progress-meta">' +
      '<p class="hlc-summary-card__progress-label">' + esc(t('summaryQuestProgress')) + '</p>' +
      '<p class="hlc-summary-card__progress-val"><strong>' + esc(String(dash.questDone) + '/' + String(dash.questTotal)) + '</strong></p>' +
      incompleteHint +
      '</div></div>' +
      '<div class="hlc-summary-card__rows">' +
      '<div class="hlc-summary-card__row hlc-summary-card__row--next">' +
      '<span class="hlc-summary-card__row-label">' + esc(t('summaryNextTodo')) + '</span>' +
      '<strong class="hlc-summary-card__row-val">' + nextLine + '</strong></div>' +
      '<div class="hlc-summary-card__row">' +
      '<span class="hlc-summary-card__row-label">' + esc(t('summaryNeedList')) + '</span>' +
      needList + '</div>' +
      '<div class="hlc-summary-card__row">' +
      '<span class="hlc-summary-card__row-label">' + esc(t('summaryLastLog')) + '</span>' +
      '<strong class="hlc-summary-card__row-val">' + lastLine + '</strong></div>' +
      '</div>' +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-summary-card__cta" data-hl-action="start-today-care">' +
      esc(t('viewTodayTasks')) + '</button>' +
      '</aside>'
    );
  }

  function renderHeroDeckVisual_() {
    return renderTodaySummaryCard_(collectionTodayStats_());
  }

  function cardCareBadge_(pet) {
    var logs = petLogs(pet.id);
    var i;
    for (i = 0; i < logs.length; i++) {
      var log = logs[i];
      var age = Date.now() - new Date(log.date).getTime();
      if (age > 7 * 86400000) break;
      if (log.recordId === 'pupation' || (log.recordType && /pupa|羽化/i.test(log.recordType))) {
        return { label: t('cardStatusPupating'), tone: 'lifecycle' };
      }
      if (log.recordId === 'molt' || log.recordId === 'instar' || log.recordId === 'shedding' ||
          (log.note && /molt|shed|蛻|脫皮/i.test(log.note))) {
        return { label: t('cardStatusMolting'), tone: 'lifecycle' };
      }
      if (log.type === 'abnormality' || log.recordId === 'abnormality') {
        var abnAge = Date.now() - new Date(log.date).getTime();
        if (abnAge < 3 * 86400000) return { label: t('cardStatusSick'), tone: 'danger' };
      }
    }
    var base = cardTodayStatus(pet);
    if (base === t('cardStatusOk')) return { label: t('cardStatusNormal'), tone: 'ok' };
    if (base === t('cardStatusWatch')) return { label: t('cardStatusWatch'), tone: 'info' };
    return { label: t('cardStatusNeedCheck'), tone: 'need' };
  }

  function cardStatusTone_(pet) {
    var tone = cardCareBadge_(pet).tone;
    if (tone === 'ok') return 'ok';
    if (tone === 'need' || tone === 'danger') return 'need';
    return 'watch';
  }

  function collectionStats_() {
    var stats = { total: state.pets.length, needCare: 0, ok: 0, watch: 0 };
    state.pets.forEach(function (pet) {
      var tone = cardStatusTone_(pet);
      if (tone === 'ok') stats.ok += 1;
      else if (tone === 'watch') stats.watch += 1;
      else stats.needCare += 1;
    });
    return stats;
  }

  function statIconKey_(itemKey) {
    if (itemKey === 'homeStatPets') return 'specimen';
    if (itemKey === 'homeStatOk') return 'check';
    if (itemKey === 'homeStatNeedCare') return 'alert';
    if (itemKey === 'homeStatWatch') return 'status';
    return 'status';
  }

  function renderCollectionStats_(stats, dash) {
    if (!stats.total) return '';
    var items = [
      { key: 'homeStatPets', val: String(stats.total), tone: 'neutral', hint: 'homeStatPetsHint' },
      { key: 'homeStatOk', val: String(dash ? dash.questDone : stats.ok), tone: 'ok', hint: 'homeStatOkHint' },
      { key: 'homeStatNeedCare', val: String(stats.needCare), tone: 'need', hint: 'homeStatNeedCareHint' },
      { key: 'homeStatWatch', val: String(stats.watch), tone: 'watch', hint: 'homeStatWatchHint' },
    ];
    return (
      '<div class="hlc-home-stats hlc-home-stats--command" role="list">' +
      items.map(function (item) {
        var prog = statProgressPct_(item.key, stats, dash);
        return (
          '<div class="hlc-home-stat hlc-home-stat--' + item.tone + '" role="listitem">' +
          '<span class="hlc-home-stat__icon">' + svgIcon(statIconKey_(item.key)) + '</span>' +
          '<span class="hlc-home-stat__body">' +
          '<span class="hlc-home-stat__val-row">' +
          '<span class="hlc-home-stat__val">' + esc(item.val) + '</span>' +
          statDotsHtml_(prog) +
          '</span>' +
          '<span class="hlc-home-stat__key">' + esc(t(item.key)) + '</span>' +
          '<span class="hlc-home-stat__hint">' + esc(t(item.hint)) + '</span>' +
          '<span class="hlc-home-stat__bar" role="presentation"><span style="width:' + prog + '%"></span></span></span></div>'
        );
      }).join('') +
      '</div>'
    );
  }

  function homeTodoKind_(qKey) {
    var q = String(qKey || '').toLowerCase();
    if (/abnormal|health|sick|vet|remind|症状|異常|健康/.test(q)) return 'track';
    if (/mist|spray|霧|喷|sprüh|besprüh/.test(q)) return 'mist';
    if (/clean|substrate|bedding|換土|清潔|reinig|substrat/.test(q)) return 'clean';
    if (/water|換水|水質|wasser/.test(q) && !/mist|spray|霧|sprüh/.test(q)) return 'water';
    if (/feed|餌|餵|饲|fütter|food/.test(q)) return 'feed';
    var rec = questRecordId_(qKey);
    if (rec === 'feeding' || rec === 'drinking') return 'feed';
    if (rec === 'water_temp' || rec === 'ph') return 'water';
    if (rec === 'substrate') return 'clean';
    if (rec === 'humidity') return 'mist';
    if (rec === 'abnormality') return 'track';
    return 'urgent';
  }

  function petIsOverdueForHome_(pet) {
    var logs = petLogs(pet.id);
    if (!logs.length) return true;
    var age = Date.now() - new Date(logs[0].date).getTime();
    return age > 36 * 3600000;
  }

  function buildHomeTodayTodoGroups_() {
    var groups = {
      urgent: [],
      overdue: [],
      health: [],
      feed: [],
      water: [],
      clean: [],
      mist: [],
      track: [],
    };
    var healthItems = pendingHealthReminders_();
    healthItems.forEach(function (it) {
      var ctl = healthFollowUp_();
      var stLabel = ctl ? ctl.statusLabel(it.status || ctl.statusOf(it.log)) : t('healthRemindersDue');
      groups.health.push({
        pet: it.pet,
        quest: null,
        recordId: 'abnormality',
        label: stLabel + (it.dueDate ? (' · ' + it.dueDate) : ''),
        tone: 'danger',
        healthLogId: it.log && it.log.id,
      });
    });
    state.pets.forEach(function (pet) {
      var tone = cardStatusTone_(pet);
      var quests = priorityTasks(pet);
      var qp = ensureQuestProgress(pet);
      var overdue = petIsOverdueForHome_(pet);
      var pending = [];
      quests.forEach(function (qKey) {
        if (isQuestDone(pet, qKey) || isQuestSkipped(pet, qKey)) return;
        pending.push(qKey);
      });
      if (!pending.length) {
        if (tone !== 'ok') {
          groups.urgent.push({
            pet: pet,
            quest: null,
            recordId: 'insect_status',
            label: petAttentionLine_(pet),
            tone: tone,
          });
        }
        return;
      }
      pending.forEach(function (qKey, idx) {
        var kind = homeTodoKind_(qKey);
        var item = {
          pet: pet,
          quest: qKey,
          recordId: questRecordId_(qKey) || 'note',
          label: questT(qKey, pet),
          tone: tone === 'ok' ? 'watch' : tone,
        };
        if (idx === 0 && (tone === 'need' || tone === 'danger')) {
          groups.urgent.push(item);
        } else if (overdue && idx === 0) {
          groups.overdue.push(item);
        } else if (kind === 'feed') groups.feed.push(item);
        else if (kind === 'water') groups.water.push(item);
        else if (kind === 'clean') groups.clean.push(item);
        else if (kind === 'mist') groups.mist.push(item);
        else if (kind === 'track') groups.track.push(item);
        else if (kind === 'urgent') groups.urgent.push(item);
        else groups.urgent.push(item);
      });
    });
    return groups;
  }

  function renderHomeTodoRow_(item) {
    var completeBtn = item.quest
      ? (
        '<button type="button" class="hlc-home-todo__complete" data-hl-quest="' + esc(item.quest) + '" data-hl-pet-id="' + esc(item.pet.id) + '" title="' + esc(t('homeTodoComplete')) + '">' +
        esc(t('homeTodoComplete')) + '</button>'
      )
      : (item.healthLogId
        ? (
          '<button type="button" class="hlc-home-todo__complete" data-hl-action="health-followup-handle" data-hl-log-id="' + esc(item.healthLogId) + '">' +
          esc(t('healthMarkHandled')) + '</button>'
        )
        : '');
    var openBtn = item.healthLogId
      ? (
        '<button type="button" class="hlc-home-todo__open" data-hl-action="health-followup-open" data-hl-log-id="' + esc(item.healthLogId) + '">' +
        esc(t('homeTodoOpen')) + '</button>'
      )
      : (item.recordId
        ? (
          '<button type="button" class="hlc-home-todo__open" data-hl-home-todo-pet="' + esc(item.pet.id) + '" data-hl-home-todo-record="' + esc(item.recordId) + '">' +
          esc(t('homeTodoOpen')) + '</button>'
        )
        : (
          '<button type="button" class="hlc-home-todo__open" data-hl-open-pet="' + esc(item.pet.id) + '">' +
          esc(t('homeTodoOpen')) + '</button>'
        ));
    return (
      '<li class="hlc-home-todo__item hlc-home-todo__item--' + esc(item.tone || 'watch') + '">' +
      '<div class="hlc-home-todo__text">' +
      '<span class="hlc-home-todo__pet">' + esc(item.pet.petName) + '</span>' +
      '<span class="hlc-home-todo__label">' + esc(item.label) + '</span></div>' +
      '<div class="hlc-home-todo__actions">' + completeBtn + openBtn + '</div></li>'
    );
  }

  function renderHomeTodayTodos_() {
    var groups = buildHomeTodayTodoGroups_();
    var order = [
      { id: 'urgent', key: 'homeTodoUrgent' },
      { id: 'overdue', key: 'homeTodoOverdue' },
      { id: 'health', key: 'homeTodoHealth' },
      { id: 'feed', key: 'homeTodoFeed' },
      { id: 'water', key: 'homeTodoWater' },
      { id: 'clean', key: 'homeTodoClean' },
      { id: 'mist', key: 'homeTodoMist' },
      { id: 'track', key: 'homeTodoTrack' },
    ];
    var total = 0;
    var chipParts = [];
    var blocks = order.map(function (g) {
      var allInGroup = groups[g.id] || [];
      if (!allInGroup.length) return '';
      total += allInGroup.length;
      chipParts.push(t(g.key) + ' ' + String(allInGroup.length));
      var items = allInGroup.slice(0, 3);
      return (
        '<section class="hlc-home-todo-group" data-hl-todo-group="' + g.id + '">' +
        '<header class="hlc-home-todo-group__head">' +
        '<h3 class="hlc-home-todo-group__title">' + esc(t(g.key)) + '</h3>' +
        '<span class="hlc-home-todo-group__count">' + esc(t('homeTodoCount').replace('{n}', String(allInGroup.length))) + '</span>' +
        '</header>' +
        '<ul class="hlc-home-todo__list">' + items.map(renderHomeTodoRow_).join('') + '</ul></section>'
      );
    }).join('');
    var primary = homePrimaryAction_(collectionTodayStats_());
    var cta = primary.action === 'none'
      ? ''
      : (
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-home-todos__cta-btn" data-hl-action="' + esc(primary.action) + '">' +
        esc(primary.label) + '</button>'
      );

    if (!total) {
      return (
        '<section class="hlc-home-todos hlc-home-todos--reminder hlc-home-todos--done" aria-label="' + esc(t('homeTodosTitle')) + '">' +
        '<p class="hlc-home-todos__empty">' + svgIcon('check') + '<span>' + esc(t('homeTodoEmpty')) + '</span></p>' +
        '</section>'
      );
    }

    var chips = chipParts.slice(0, 4).map(function (c) {
      return '<span class="hlc-home-todos__chip">' + esc(c) + '</span>';
    }).join('');
    var moreChip = chipParts.length > 4
      ? '<span class="hlc-home-todos__chip hlc-home-todos__chip--more">+' + esc(String(chipParts.length - 4)) + '</span>'
      : '';

    return (
      '<section class="hlc-home-todos hlc-home-todos--reminder" aria-label="' + esc(t('homeTodosTitle')) + '">' +
      '<div class="hlc-home-todos__bar">' +
      '<details class="hlc-home-todos__details">' +
      '<summary class="hlc-home-todos__summary">' +
      '<span class="hlc-home-todos__summary-main">' +
      '<span class="hlc-home-todos__summary-title">' + esc(t('homeTodosTitle')) + '</span>' +
      '<span class="hlc-home-todos__summary-count">' + esc(t('homeTodoSummaryPending').replace('{n}', String(total))) + '</span>' +
      '</span>' +
      '<span class="hlc-home-todos__chips" aria-hidden="true">' + chips + moreChip + '</span>' +
      '<span class="hlc-home-todos__summary-hint">' + esc(t('homeTodoExpandDetails')) + '</span>' +
      '</summary>' +
      '<div class="hlc-home-todos__body">' + blocks + '</div>' +
      '</details>' +
      cta +
      '</div></section>'
    );
  }

  function renderHomePriorityStrip_() {
    /* Compact health reminders only — daily todos live in the collapsed reminder bar. */
    var healthStrip = renderHealthRemindersStrip_();
    if (!healthStrip) return '';
    return (
      '<section class="hlc-home-priority hlc-home-priority--compact" aria-label="' + esc(t('homePriorityTitle')) + '">' +
      healthStrip +
      '</section>'
    );
  }

  function renderHomeQuickAddStrip_() {
    return (
      '<section class="hlc-home-quick hlc-home-section--secondary" aria-label="' + esc(t('homeQuickAddTitle')) + '">' +
      '<header class="hlc-home-section__head">' +
      '<h2 class="hlc-home-section__title">' + esc(t('homeQuickAddTitle')) + '</h2>' +
      '</header>' +
      renderQuickActionDock_('inline') +
      '</section>'
    );
  }

  function renderHomeInsightsSection_(stats) {
    var dash = collectionTodayStats_();
    return (
      '<details class="hlc-home-insights hlc-home-section--tertiary">' +
      '<summary class="hlc-home-insights__summary">' +
      '<span>' + esc(t('homeInsightsTitle')) + '</span>' +
      '<span class="hlc-home-insights__pct">' + esc(String(dash.questPct)) + '%</span></summary>' +
      '<div class="hlc-home-insights__body">' +
      '<div class="hlc-home-insights__stats">' +
      '<h3 class="hlc-command-center__stats-title">' + esc(t('commandStatsTitle')) + '</h3>' +
      renderCollectionStats_(stats, dash) +
      '</div>' +
      '<div class="hlc-home-insights__widget">' + renderTodaySummaryCard_(dash) +
      (CARE_GUIDE() ? CARE_GUIDE().renderTodayWidget(state, state.pets, careGuideCtx_()) : '') +
      '</div></div></details>'
    );
  }

  function renderCollectionHero_(stats) {
    /* Legacy command-center bundle — kept for compatibility; home now uses priority + todos. */
    return renderHomePriorityStrip_() + renderHomeTodayTodos_();
  }

  function renderCollectionLanding_() {
    var tip =
      '<details class="hlc-welcome__tip">' +
      '<summary class="hlc-welcome__tip-summary">' + esc(t('homeEmptyTipSummary')) + '</summary>' +
      '<ul class="hlc-welcome__tip-list">' +
      '<li>' + esc(t('homeEmptyBullet1')) + '</li>' +
      '<li>' + esc(t('homeEmptyBullet2')) + '</li>' +
      '<li>' + esc(t('homeEmptyBullet3')) + '</li>' +
      '</ul></details>';
    return (
      '<section class="hlc-welcome hlc-welcome--focused" id="hlcTourCardHead">' +
      '<div class="hlc-welcome__backdrop" aria-hidden="true">' +
      '<div class="hlc-welcome__orb hlc-welcome__orb--1"></div>' +
      '<div class="hlc-welcome__orb hlc-welcome__orb--2"></div>' +
      '<div class="hlc-welcome__grid"></div>' +
      '</div>' +
      '<div class="hlc-welcome__layout hlc-welcome__layout--focused">' +
      '<div class="hlc-welcome__copy">' +
      '<header class="hlc-welcome__head">' +
      '<p class="hlc-welcome__badge">' + esc(t('homeHeroTag')) + '</p>' +
      '<h1 class="hlc-welcome__title">' + esc(t('homeEmptyTitle')) + '</h1>' +
      '<p class="hlc-welcome__lead">' + esc(t('homeEmptyLead')) + '</p>' +
      '</header>' +
      '<div class="hlc-welcome__actions" id="hlcTourCardZone">' +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-welcome__cta" id="hlcTourAddPet" data-hl-action="start-create">' +
      svgIcon('plus') + '<span>' + esc(t('tourAddCta')) + '</span></button>' +
      '<div class="hlc-welcome__secondary" role="group" aria-label="' + esc(t('homeEmptyTipSummary')) + '">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-welcome__secondary-btn" data-hl-action="start-template">' +
      esc(t('homeEmptySecondaryTemplate')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-welcome__secondary-btn" data-hl-action="import-qr">' +
      esc(t('homeEmptySecondaryQr')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-welcome__secondary-btn" data-hl-action="import-backup-pick">' +
      esc(t('homeEmptySecondaryBackup')) + '</button>' +
      '</div></div>' +
      tip +
      '</div></div></section>'
    );
  }

  function renderCardWall() {
    var stats = collectionStats_();
    if (!stats.total) {
      return '<div class="hlc-collection-stage hlc-collection-stage--empty">' + renderCollectionLanding_() + '</div>';
    }
    var pets = filteredSortedPets_();
    var cards = pets.map(renderLivingCard).join('');
    var emptyFilter = pets.length === 0 && state.pets.length > 0
      ? renderCollectionFilterEmpty_()
      : '';
    return (
      '<div class="hlc-collection-stage hlc-collection-stage--ia">' +
      renderHomePriorityStrip_() +
      renderHomeTodayTodos_() +
      '<div class="hlc-collection-section hlc-collection-section--pets hlc-home-section--secondary">' +
      '<div class="hlc-collection-section__head hlc-collection-section__head--toolbar">' +
      '<div class="hlc-collection-section__title-wrap">' +
      '<span class="hlc-collection-section__eyebrow">' + esc(t('homeSectionPetsEyebrow')) + '</span>' +
      '<h2 class="hlc-collection-section__title">' + esc(t('homeSectionPets')) +
      '<span class="hlc-collection-section__count">' + esc(t('homeSectionPetCount').replace('{n}', String(pets.length))) + '</span></h2>' +
      '</div>' +
      renderPetSectionToolbar_() +
      '</div>' +
      emptyFilter +
      renderBatchBar_() +
      '<div class="hlc-grid-pets" id="hlcTourCardZone">' + cards + renderCreatePetCard_() + '</div></div>' +
      renderHomeQuickAddStrip_() +
      renderGlobalRecentTimeline_(5) +
      renderHomeInsightsSection_(stats) +
      '<details class="hlc-home-advanced hlc-home-section--tertiary">' +
      '<summary class="hlc-home-advanced__summary">' + esc(t('homeAdvancedTitle')) + '</summary>' +
      '<div class="hlc-home-advanced__body">' +
      renderCollectionBackupSection_() +
      '</div></details>' +
      '</div>'
    );
  }

  function renderPetSectionToolbar_() {
    var filters = collectionFilters_();
    var chipFilters = [
      { id: 'all', key: 'filterAll' },
      { id: 'need', key: 'filterNeed' },
      { id: 'incomplete', key: 'filterIncomplete' },
      { id: 'recent', key: 'filterRecent' },
      { id: 'breeding', key: 'filterBreeding' },
      { id: 'abnormal', key: 'filterAbnormal' },
    ];
    var curFilter = filters.status || 'all';
    var curSort = filters.sort || 'recent';
    var categories = ['all'];
    var catSeen = {};
    state.pets.forEach(function (p) {
      if (p.category && !catSeen[p.category]) {
        catSeen[p.category] = true;
        categories.push(p.category);
      }
    });
    var stageOpts = ['all'].concat(STAGE_OPTS.map(function (o) { return o.value; }));
    var sortOpts = [
      { id: 'recent', key: 'sortRecent' },
      { id: 'need', key: 'sortNeed' },
      { id: 'name', key: 'sortName' },
      { id: 'startDate', key: 'sortStartDate' },
      { id: 'lifeStage', key: 'sortLifeStage' },
      { id: 'breeding', key: 'sortBreeding' },
    ];
    var advancedOpen = (filters.category && filters.category !== 'all') ||
      (filters.lifeStage && filters.lifeStage !== 'all') ||
      curSort !== 'recent';
    return (
      '<div class="hlc-pet-toolbar" role="search">' +
      '<label class="hlc-pet-toolbar__search">' +
      '<span class="hlc-pet-toolbar__search-icon" aria-hidden="true">' + svgIcon('search') + '</span>' +
      '<input type="search" class="hlc-pet-toolbar__input" id="hlcCollectionSearch" data-hl-collection-search value="' + esc(filters.search || '') + '" placeholder="' + esc(t('searchPetsPlaceholder')) + '" autocomplete="off" aria-label="' + esc(t('searchPetsPlaceholder')) + '" />' +
      '</label>' +
      '<div class="hlc-pet-toolbar__filters" role="group" aria-label="' + esc(t('filterPets')) + '">' +
      chipFilters.map(function (f) {
        return '<button type="button" class="hlc-pet-toolbar__chip' + (curFilter === f.id ? ' is-active' : '') + '" data-hl-home-filter="' + f.id + '">' + esc(t(f.key)) + '</button>';
      }).join('') +
      '<button type="button" class="hlc-pet-toolbar__chip hlc-pet-toolbar__chip--batch' + (state.ui.batchMode ? ' is-active' : '') + '" data-hl-action="toggle-batch-mode">' + esc(t('batchMode')) + '</button>' +
      '</div>' +
      '<details class="hlc-pet-toolbar__advanced-wrap"' + (advancedOpen ? ' open' : '') + '>' +
      '<summary class="hlc-pet-toolbar__advanced-toggle">' + esc(t('filterAdvancedToggle')) + '</summary>' +
      '<div class="hlc-pet-toolbar__advanced">' +
      '<label class="hlc-pet-toolbar__sort">' +
      '<span class="hlc-pet-toolbar__sort-label">' + esc(t('profileCategory')) + '</span>' +
      '<select data-hl-collection-category aria-label="' + esc(t('profileCategory')) + '">' +
      categories.map(function (id) {
        var label = id === 'all' ? t('filterCategoryAll') : chipT(id);
        return '<option value="' + esc(id) + '"' + ((filters.category || 'all') === id ? ' selected' : '') + '>' + esc(label) + '</option>';
      }).join('') +
      '</select></label>' +
      '<label class="hlc-pet-toolbar__sort">' +
      '<span class="hlc-pet-toolbar__sort-label">' + esc(t('lifeStage')) + '</span>' +
      '<select data-hl-collection-stage aria-label="' + esc(t('lifeStage')) + '">' +
      stageOpts.map(function (id) {
        var label = id === 'all' ? t('filterStageAll') : stageLabel({ lifeStage: id });
        return '<option value="' + esc(id) + '"' + ((filters.lifeStage || 'all') === id ? ' selected' : '') + '>' + esc(label) + '</option>';
      }).join('') +
      '</select></label>' +
      '<label class="hlc-pet-toolbar__sort">' +
      '<span class="hlc-pet-toolbar__sort-label">' + esc(t('sortLabel')) + '</span>' +
      '<select data-hl-collection-sort aria-label="' + esc(t('sortLabel')) + '">' +
      sortOpts.map(function (o) {
        return '<option value="' + o.id + '"' + (curSort === o.id ? ' selected' : '') + '>' + esc(t(o.key)) + '</option>';
      }).join('') +
      '</select></label></div></details></div>'
    );
  }

  function renderBatchBar_() {
    var api = batchApi_();
    return api ? api.renderBatchBar() : '';
  }


  function renderPhotoWall_(pet) {
    var photos = petPhotoLogs_(pet);
    var filter = state.ui.photoWallFilter || 'all';
    var filtered = filter === 'all'
      ? photos
      : photos.filter(function (l) { return (l.photoType || 'daily') === filter; });
    var filterChips = [{ v: 'all', key: 'filterAll' }].concat(PHOTO_OPTS.map(function (o) {
      return { v: o.value, key: o.labelKey };
    }));
    var compareA = state.ui.photoCompareA || '';
    var compareB = state.ui.photoCompareB || '';
    var compareHtml = '';
    if (compareA && compareB) {
      compareHtml =
        '<div class="hlc-photo-compare">' +
        '<div class="hlc-photo-compare__frame">' +
        '<img class="hlc-photo-compare__img hlc-photo-compare__img--a" src="' + esc(compareA) + '" alt="" />' +
        '<img class="hlc-photo-compare__img hlc-photo-compare__img--b" src="' + esc(compareB) + '" alt="" />' +
        '<input type="range" class="hlc-photo-compare__slider" min="0" max="100" value="50" data-hl-photo-slider aria-label="' + esc(t('photoWallCompare')) + '" />' +
        '</div>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="photo-compare-clear">' + esc(t('photoWallCompareClear')) + '</button>' +
        '</div>';
    } else {
      compareHtml = '<p class="hlc-photo-wall__compare-hint">' + esc(t('photoWallComparePick')) + '</p>';
    }
    var grid = filtered.length
      ? filtered.map(function (l) {
        var tag = photoTypeLabel_(l.photoType || 'daily');
        var when = formatLogDateTime_(l.date);
        var picked = l.photoUrl === compareA || l.photoUrl === compareB;
        return (
          '<article class="hlc-photo-wall__card' + (picked ? ' is-picked' : '') + '">' +
          '<button type="button" class="hlc-photo-wall__btn" data-hl-photo-lightbox="' + esc(l.photoUrl) + '">' +
          '<img class="hlc-photo-wall__item" src="' + l.photoUrl + '" alt="" loading="lazy" /></button>' +
          '<div class="hlc-photo-wall__meta">' +
          '<span class="hlc-photo-wall__tag">' + esc(tag) + '</span>' +
          '<time class="hlc-photo-wall__date">' + esc(when) + '</time></div>' +
          '<div class="hlc-photo-wall__card-actions">' +
          '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--xs" data-hl-photo-compare="' + esc(l.photoUrl) + '">' + esc(t('photoWallCompare')) + '</button>' +
          (l.id ? '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--xs" data-hl-action="photo-to-timeline" data-hl-log-id="' + esc(l.id) + '">' + esc(t('photoWallAddTimeline')) + '</button>' : '') +
          '</div></article>'
        );
      }).join('')
      : '<p class="hlc-profile-photos-empty">' + esc(filter === 'all' ? t('profilePhotosEmpty') : t('photoWallEmptyFilter')) + '</p>';
    return (
      '<div class="hlc-photo-wall-panel">' +
      '<div class="hlc-photo-wall__filters" role="group" aria-label="' + esc(t('photoWallFilterLabel')) + '">' +
      filterChips.map(function (c) {
        return '<button type="button" class="hlc-chip' + (filter === c.v ? ' is-active' : '') + '" data-hl-photo-wall-filter="' + esc(c.v) + '">' + esc(t(c.key)) + '</button>';
      }).join('') +
      '</div>' +
      compareHtml +
      '<div class="hlc-photo-wall hlc-photo-wall--rich">' + grid + '</div></div>'
    );
  }

  function renderScanPassportTabs_(pet) {
    var tab = state.ui.scanTab || 'overview';
    var tabs = [
      { id: 'overview', key: 'scanTabOverview' },
      { id: 'logs', key: 'scanTabLogs' },
      { id: 'profile', key: 'scanTabProfile' },
      { id: 'lineage', key: 'scanTabLineage' },
      { id: 'photos', key: 'scanTabPhotos' },
    ];
    var nav = tabs.map(function (tb) {
      var locked = scanTabLocked_(pet, tb.id);
      return (
        '<button type="button" class="hlc-scan-tab' + (tab === tb.id ? ' is-active' : '') + (locked ? ' is-locked' : '') + '" data-hl-scan-tab="' + tb.id + '">' +
        esc(t(tb.key)) + (locked ? ' 🔒' : '') + '</button>'
      );
    }).join('');
    var body = '';
    if (scanTabLocked_(pet, tab)) {
      body = '<div class="hlc-scan-tab-locked"><p>' + esc(t('scanTabLocked')) + '</p></div>';
    } else if (tab === 'overview') {
      var deck = deckForPet(pet);
      body =
        renderScanStatusPanel_(pet) +
        renderStatusChips(pet) +
        '<h2 class="hlc-section-title">' + esc(t('scanUpdateTitle')) + '</h2>' +
        renderRecordGrid(pet, deck.main, false);
    } else if (tab === 'logs') {
      body = renderTimeline_(pet, 30);
    } else if (tab === 'profile') {
      body =
        '<dl class="hlc-dl">' +
        '<div><dt>' + esc(t('petName')) + '</dt><dd>' + esc(pet.petName) + '</dd></div>' +
        '<div><dt>' + esc(t('species')) + '</dt><dd>' + esc(speciesDisplayName(pet)) + '</dd></div>' +
        '<div><dt>' + esc(t('scientificName')) + '</dt><dd><em>' + esc(petScientificName(pet) || '—') + '</em></dd></div>' +
        '<div><dt>' + esc(t('lifeStage')) + '</dt><dd>' + esc(stageLabel(pet)) + '</dd></div>' +
        '<div><dt>' + esc(t('husbandryId')) + '</dt><dd><code>' + esc(pet.husbandryId || '—') + '</code></dd></div>' +
        '</dl>';
    } else if (tab === 'lineage') {
      body = BREEDING() ? BREEDING().renderFamilyTree(state, pet, breedingCtx_()) : '';
    } else if (tab === 'photos') {
      body = renderPhotoWall_(pet);
    }
    return (
      '<section class="hlc-scan-passport">' +
      '<header class="hlc-scan-passport__head">' +
      '<h2 class="hlc-section-title">' + esc(t('scanPassportTitle')) + '</h2>' +
      '<p class="hlc-scan-passport__hint">' + esc(t('scanPassportHint')) + '</p></header>' +
      '<nav class="hlc-scan-tabs" role="tablist">' + nav + '</nav>' +
      '<div class="hlc-scan-tab-panel" role="tabpanel">' + body + '</div></section>'
    );
  }

  function renderCollectionFilterEmpty_() {
    return (
      '<div class="hlc-empty hlc-empty--filter hlc-empty--filter-action">' +
      '<p class="hlc-empty__text">' + esc(t('filterNoResults')) + '</p>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-empty__action" data-hl-action="clear-collection-filters">' + esc(t('clearCollectionFilters')) + '</button>' +
      '</div>'
    );
  }

  function renderGlobalRecentTimeline_(limit) {
    var logs = state.careLogs.slice(0, limit || 5);
    if (!logs.length) {
      return (
        '<section class="hlc-home-recent">' +
        '<div class="hlc-home-recent__head">' +
        '<h2 class="hlc-section-title">' + esc(t('homeRecentLogs')) + '</h2>' +
        '</div>' +
        renderTimelineEmpty_() + '</section>'
      );
    }
    var items = logs.map(renderHomeRecentItem_).join('');
    return (
      '<section class="hlc-home-recent">' +
      '<div class="hlc-home-recent__head">' +
      '<h2 class="hlc-section-title">' + esc(t('homeRecentLogs')) + '</h2>' +
      '<span class="hlc-home-recent__hint">' + esc(t('homeRecentHint')) + '</span></div>' +
      '<div class="hlc-home-recent__list">' + items + '</div></section>'
    );
  }

  function renderWelcomeShowcase_() {
    return (
      '<div class="hlc-welcome__card-stack">' +
      '<div class="hlc-welcome__card hlc-welcome__card--ghost hlc-welcome__card--b" aria-hidden="true"></div>' +
      '<div class="hlc-welcome__card hlc-welcome__card--ghost hlc-welcome__card--a" aria-hidden="true"></div>' +
      '<article class="hlc-welcome__card hlc-welcome__card--lead">' +
      '<header class="hlc-welcome__card-head">' +
      '<span class="hlc-welcome__card-dot"></span>' +
      '<span class="hlc-welcome__card-label">' + esc(t('homeCardLabel')) + '</span>' +
      '<span class="hlc-welcome__card-status">' + esc(t('cardStatusOk')) + '</span>' +
      '</header>' +
      '<div class="hlc-welcome__card-photo">' + svgIcon('specimen') + '</div>' +
      '<footer class="hlc-welcome__card-foot">' +
      '<strong>' + esc(t('myPet')) + '</strong>' +
      '<span>' + esc(t('homeCardEdition')) + '</span>' +
      '</footer></article></div>'
    );
  }

  function renderWelcomePath_() {
    var steps = [
      { num: '01', icon: 'specimen', key: 'tourBulletCard' },
      { num: '02', icon: 'camera', key: 'tourBulletLog' },
      { num: '03', icon: 'qr', key: 'tourBulletLabel' },
    ];
    return (
      '<ol class="hlc-welcome__path" id="hlcTourCardZone">' +
      steps.map(function (step, idx) {
        var trail = idx < steps.length - 1 ? '<span class="hlc-welcome__path-line" aria-hidden="true"></span>' : '';
        return (
          '<li class="hlc-welcome__path-item">' +
          trail +
          '<span class="hlc-welcome__path-num">' + esc(step.num) + '</span>' +
          '<span class="hlc-welcome__path-icon">' + svgIcon(step.icon) + '</span>' +
          '<p class="hlc-welcome__path-text">' + esc(t(step.key)) + '</p></li>'
        );
      }).join('') +
      '</ol>'
    );
  }

  function renderCollectionEmptyPanel_() {
    return renderWelcomePath_();
  }

  function renderCollectionEmpty_() {
    return renderCollectionEmptyPanel_();
  }

  function renderLivingCard(pet) {
    var photoHtml = renderPetPhotoHtml(pet, '');
    var last = petLogs(pet.id)[0];
    var badge = cardCareBadge_(pet);
    var cardTone = cardStatusTone_(pet);
    var lastSummary = last ? logSummaryLine_(last) : t('chipNotLogged');
    var lastWhen = last ? formatLogDateTime_(last.date) : '';
    var lastLine = last
      ? (isEn()
        ? (t('cardRecentPrefix') + ': ' + lastWhen + ' ' + lastSummary)
        : (t('cardRecentPrefix') + '：' + lastWhen + ' ' + lastSummary))
      : (isEn() ? (t('cardRecentPrefix') + ': ' + lastSummary) : (t('cardRecentPrefix') + '：' + lastSummary));
    var healthLine = isEn()
      ? (t('cardHealthPrefix') + ': ' + badge.label)
      : (t('cardHealthPrefix') + '：' + badge.label);
    var sci = petScientificName(pet);
    var common = petCommonName_(pet);
    var speciesStage = speciesStageLine_(pet);
    var quests = priorityTasks(pet);
    var qp = ensureQuestProgress(pet);
    var qTotal = Math.max(quests.length, 5);
    var qDone = qp.done.length;
    var qPct = Math.round((qDone / qTotal) * 100);
    var nextText = petAttentionLine_(pet);
    var nextLine = nextText
      ? (isEn() ? (t('cardNextPrefix') + ': ' + nextText) : (t('cardNextPrefix') + '：' + nextText))
      : '';
    var sciText = sci || '—';
    var batchSel = state.ui.batchMode && batchSelectedIds_().indexOf(pet.id) >= 0;
    var batchHtml = state.ui.batchMode
      ? '<label class="hlc-pet-card__batch-check" data-hl-batch-wrap="' + esc(pet.id) + '">' +
        '<input type="checkbox" data-hl-batch-select="' + esc(pet.id) + '"' + (batchSel ? ' checked' : '') + ' />' +
        '<span class="hlc-sr-only">' + esc(t('batchSelectPet')) + '</span></label>'
      : '';
    var quickActions = [
      { icon: 'camera', label: t('actionPhoto'), attr: 'data-hl-quick-photo="' + esc(pet.id) + '"' },
      { icon: 'feeding', label: t('quickFeeding'), attr: 'data-hl-quick-feed="' + esc(pet.id) + '"' },
      { icon: 'tabLogs', label: t('actionLog'), attr: 'data-hl-quick-log="' + esc(pet.id) + '"' },
      { icon: 'qr', label: t('actionQr'), attr: 'data-hl-show-qr="' + esc(pet.id) + '"' },
    ];
    return (
      '<article class="hlc-pet-card hlc-pet-card--living hlc-pet-card--status-' + cardTone + ' hlc-pet-card--badge-' + badge.tone + (state.ui.batchMode ? ' hlc-pet-card--batch' : '') + (batchSel ? ' is-batch-selected' : '') + '">' +
      batchHtml +
      '<div class="hlc-pet-card__shine" aria-hidden="true"></div>' +
      '<button type="button" class="hlc-pet-card__main" data-hl-open-pet="' + esc(pet.id) + '">' +
      '<div class="hlc-pet-card__cover">' +
      '<div class="hlc-pet-card__cover-glow" aria-hidden="true"></div>' +
      '<div class="hlc-pet-card__photo-frame">' +
      '<div class="hlc-pet-card__photo-media">' + photoHtml + '</div>' +
      '</div>' +
      '<span class="hlc-pet-card__status-pill hlc-pet-card__status-pill--' + badge.tone + '">' + esc(badge.label) + '</span>' +
      '</div>' +
      '<div class="hlc-pet-card__body">' +
      '<div class="hlc-pet-card__identity">' +
      '<h3 class="hlc-pet-card__name">' + esc(pet.petName) + '</h3>' +
      (common ? '<p class="hlc-pet-card__common">' + esc(common) + '</p>' : '') +
      '<p class="hlc-pet-card__category' + (speciesStage ? '' : ' hlc-pet-card__slot--empty') + '">' + esc(speciesStage || '—') + '</p>' +
      '<p class="hlc-pet-card__sci' + (sci ? '' : ' hlc-pet-card__slot--empty') + '"><em>' + esc(sciText) + '</em></p>' +
      '</div>' +
      '<div class="hlc-pet-card__quest">' +
      '<div class="hlc-pet-card__quest-head">' +
      '<span class="hlc-pet-card__quest-label">' + esc(t('todayTaskProgress')) + '</span>' +
      '<span class="hlc-pet-card__quest-count">' + esc(String(qDone) + '/' + String(qTotal)) + '</span></div>' +
      '<div class="hlc-pet-card__quest-bar" role="progressbar" aria-valuenow="' + qDone + '" aria-valuemin="0" aria-valuemax="' + qTotal + '">' +
      '<span class="hlc-pet-card__quest-fill' + (qDone >= qTotal ? ' is-complete' : '') + '" style="width:' + qPct + '%"></span></div>' +
      '</div>' +
      '<p class="hlc-pet-card__next' + (nextLine ? '' : ' hlc-pet-card__slot--empty') + '">' + esc(nextLine || '\u00a0') + '</p>' +
      '<p class="hlc-pet-card__meta">' + esc(lastLine) + '</p>' +
      '<p class="hlc-pet-card__health hlc-pet-card__health--' + badge.tone + '">' + esc(healthLine) + '</p>' +
      (BREEDING() ? BREEDING().renderCardStrip(state, pet, breedingCtx_()) : '') +
      '</div></button>' +
      '<div class="hlc-pet-card__quick-bar" role="toolbar" aria-label="' + esc(t('todayActions')) + '">' +
      quickActions.map(function (qa) {
        return (
          '<button type="button" class="hlc-pet-card__quick" ' + qa.attr + ' title="' + esc(qa.label) + '" aria-label="' + esc(qa.label) + '">' +
          '<span class="hlc-pet-card__quick-icon">' + svgIcon(qa.icon) + '</span>' +
          '<span class="hlc-pet-card__quick-label">' + esc(qa.label) + '</span></button>'
        );
      }).join('') +
      '</div></article>'
    );
  }

  function renderCreatePetCard_() {
    return (
      '<article class="hlc-pet-card hlc-pet-card--create" id="hlcTourAddPet">' +
      '<div class="hlc-pet-card--create__inner">' +
      '<header class="hlc-pet-card--create__head">' +
      '<span class="hlc-pet-card--create__icon" aria-hidden="true">' + svgIcon('plus') + '</span>' +
      '<h3 class="hlc-pet-card--create__title">' + esc(t('createCardTitle')) + '</h3>' +
      '</header>' +
      '<div class="hlc-pet-card--create__actions">' +
      '<button type="button" class="hlc-pet-card--create__opt" data-hl-action="start-create">' +
      '<span class="hlc-pet-card--create__opt-icon">' + svgIcon('plus') + '</span>' +
      '<span class="hlc-pet-card--create__opt-label">' + esc(t('addPet')) + '</span></button>' +
      '<button type="button" class="hlc-pet-card--create__opt" data-hl-action="import-qr">' +
      '<span class="hlc-pet-card--create__opt-icon">' + svgIcon('qr') + '</span>' +
      '<span class="hlc-pet-card--create__opt-label">' + esc(t('importQr')) + '</span></button>' +
      '<button type="button" class="hlc-pet-card--create__opt" data-hl-action="start-template">' +
      '<span class="hlc-pet-card--create__opt-icon">' + svgIcon('label') + '</span>' +
      '<span class="hlc-pet-card--create__opt-label">' + esc(t('startFromTemplate')) + '</span></button>' +
      '</div>' +
      '<p class="hlc-pet-card--create__hint">' + esc(t('createCardHint')) + '</p>' +
      '</div></article>'
    );
  }

  function renderStatusChips(pet) {
    var quests = priorityTasks(pet);
    var qp = ensureQuestProgress(pet);
    var doneCount = qp.done.length;
    var total = quests.length;
    var feedVal = feedChipValue_(pet);
    var envVal = envChipValue_(pet);
    var healthVal = cardTodayStatus(pet);
    var chips = [
      { key: t('chipTodayProgress'), val: doneCount + '/' + total, tone: chipTone_('progress', doneCount + '/' + total) },
      { key: t('chipLastFeed'), val: feedVal, tone: chipTone_('feed', feedVal) },
      { key: t('chipEnvironment'), val: envVal, tone: chipTone_('env', envVal) },
      { key: t('chipHealth'), val: healthVal, tone: chipTone_('health', healthVal) },
    ];
    return '<div class="hlc-status-chips hlc-status-chips--toned">' + chips.map(function (c) {
      return '<div class="hlc-status-chip hlc-status-chip--' + c.tone + '"><span class="hlc-status-chip__key">' + esc(c.key) + '</span><span class="hlc-status-chip__val">' + esc(c.val) + '</span></div>';
    }).join('') + '</div>';
  }

  function renderQuestCards(pet) {
    var quests = priorityTasks(pet);
    if (!quests.length) return '';
    var qp = ensureQuestProgress(pet);
    var html = quests.map(function (qKey) {
      var done = isQuestDone(pet, qKey);
      var skipped = isQuestSkipped(pet, qKey);
      var cls = 'hlc-check-item' + (done ? ' is-done' : '') + (skipped ? ' is-skipped' : '');
      var hint = done ? '' : (skipped ? t('questSkipped') : (questHint_(qKey) || t('questPending')));
      var recId = questRecordId_(qKey);
      var statusLabel = questStatusLabel_(done, skipped);
      var recBtn = (!done && !skipped)
        ? (String(qKey).indexOf('BREED_') === 0
          ? '<button type="button" class="hlc-check-item__record" data-hl-action="breed-open-log">' + esc(t('breedAddLog')) + '</button>'
          : '<button type="button" class="hlc-check-item__record" data-hl-record="' + esc(recId) + '">' + esc(questRecordButtonLabel_(recId)) + '</button>')
        : '';
      return (
        '<div class="hlc-check-item-wrap">' +
        '<button type="button" class="' + cls + '" data-hl-quest="' + esc(qKey) + '" data-hl-pet-id="' + esc(pet.id) + '"' +
        ' aria-checked="' + (done ? 'true' : 'false') + '" role="checkbox">' +
        '<span class="hlc-check-item__box" aria-hidden="true">' + (done ? svgIcon('check') : '') + '</span>' +
        '<span class="hlc-check-item__body">' +
        '<span class="hlc-check-item__row">' +
        '<span class="hlc-check-item__title">' + esc(questT(qKey, pet)) + '</span>' +
        '<span class="hlc-check-item__status hlc-check-item__status--' + (done ? 'done' : (skipped ? 'skipped' : 'pending')) + '">' + esc(statusLabel) + '</span>' +
        '</span>' +
        (hint ? '<span class="hlc-check-item__hint">' + esc(hint) + '</span>' : '') +
        '</span></button>' + recBtn +
        '<button type="button" class="hlc-check-item__skip" data-hl-quest-skip="' + esc(qKey) + '" data-hl-pet-id="' + esc(pet.id) + '" title="' + esc(t('questSkip')) + '">' + esc(t('questSkipShort')) + '</button>' +
        '</div>'
      );
    }).join('');
    return (
      '<section class="hlc-checklist-section">' +
      '<div class="hlc-checklist-section__head">' +
      '<h2 class="hlc-section-title">' + esc(t('todayFocus')) + '</h2>' +
      '<span class="hlc-checklist-section__count">' + esc(String(qp.done.length) + '/' + String(quests.length)) + '</span>' +
      '</div>' +
      '<div class="hlc-checklist">' + html + '</div></section>'
    );
  }

  function recordCardState(petId, rid) {
    var meta = RECORD_META[rid];
    if (!meta) return '';
    var last = lastLogFor(petId, [meta.logType, rid]);
    if (!last) return t('stateNeedsUpdate');
    var ms = Date.now() - new Date(last.date).getTime();
    if (ms > 86400000) return t('stateNeedsUpdate');
    return t('stateUpToDate');
  }

  function renderCompactHeader(pet) {
    var thumb = renderPetThumbHtml(pet);
    var quests = priorityTasks(pet);
    var qp = ensureQuestProgress(pet);
    var qTotal = quests.length;
    var qDone = qp.done.length;
    var qPct = qTotal ? Math.round((qDone / qTotal) * 100) : 0;
    var next = petNextAction_(pet);
    var nextLabel = next ? next.label : t('todayCareComplete');
    var feedVal = feedChipValue_(pet);
    var envVal = envChipValue_(pet);
    var healthTone = cardStatusTone_(pet);
    var quickRec = next && next.recordId ? next.recordId : 'feeding';
    return (
      '<header class="hlc-pet-hero">' +
      '<div class="hlc-pet-hero__left">' + thumb +
      '<div class="hlc-pet-hero__identity">' +
      '<h2 class="hlc-pet-hero__name">' + esc(pet.petName) + '</h2>' +
      '<p class="hlc-pet-hero__species">' + esc(speciesDisplayName(pet)) + '</p>' +
      (petScientificName(pet) ? '<p class="hlc-pet-hero__sci"><em>' + esc(petScientificName(pet)) + '</em></p>' : '') +
      renderPetHeroStages_(pet) +
      '</div></div>' +
      '<div class="hlc-pet-hero__mid">' +
      '<div class="hlc-pet-hero__completion">' +
      '<div class="hlc-pet-hero__metric-head">' +
      '<span>' + esc(t('heroTodayCompletion')) + '</span>' +
      '<strong>' + esc(String(qDone) + '/' + String(qTotal)) + '</strong></div>' +
      '<div class="hlc-pet-hero__progress" role="progressbar" aria-valuenow="' + qDone + '" aria-valuemin="0" aria-valuemax="' + qTotal + '">' +
      '<span class="hlc-pet-hero__progress-fill' + (qDone >= qTotal ? ' is-complete' : '') + '" style="width:' + qPct + '%"></span></div>' +
      '</div>' +
      '<p class="hlc-pet-hero__metric"><span>' + esc(t('heroNextTask')) + '</span><strong>' + esc(nextLabel) + '</strong></p>' +
      '<p class="hlc-pet-hero__metric"><span>' + esc(t('heroLastFeed')) + '</span><strong>' + esc(feedVal) + '</strong></p>' +
      '<p class="hlc-pet-hero__metric"><span>' + esc(t('heroLastEnv')) + '</span><strong>' + esc(envVal) + '</strong></p>' +
      '</div>' +
      '<div class="hlc-pet-hero__right">' +
      '<span class="hlc-pet-hero__health hlc-pet-hero__health--' + healthTone + '">' + esc(cardTodayStatus(pet)) + '</span>' +
      (BREEDING() ? BREEDING().renderHeroBlock(state, pet, breedingCtx_()) : '') +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--sm" data-hl-record="' + esc(quickRec) + '">' + esc(t('heroQuickAddLog')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="open-reminder-settings">' + esc(t('reminderSettingsBtn')) + '</button>' +
      '</div></header>'
    );
  }

  function renderRecordCard(pet, rid, compact) {
    var meta = RECORD_META[rid];
    if (!meta) return '';
    var stateText = recordCardState(pet.id, rid);
    var tone = stateText === t('stateUpToDate') ? 'ok' : (stateText === t('stateNeedsUpdate') ? 'watch' : 'muted');
    var bento = (!compact && (rid === 'photo' || rid === 'feeding')) ? ' hlc-record-card--bento-wide' : '';
    var recClass = '';
    var recIds = getRecommendedRecordTypesForPet_(pet);
    if (recIds.indexOf(rid) >= 0) recClass = ' hlc-record-card--recommended';
    var compactClass = compact ? ' hlc-record-card--compact' : '';
    return (
      '<button type="button" class="hlc-record-card hlc-record-card--' + tone + bento + recClass + compactClass + '" data-hl-record="' + esc(rid) + '">' +
      '<span class="hlc-record-card__icon">' + svgIcon(recordIcon_(rid)) + '</span>' +
      '<span class="hlc-record-card__body">' +
      '<span class="hlc-record-card__title">' + esc(t(meta.titleKey)) + '</span>' +
      '<span class="hlc-record-card__meta">' + esc(stateText) + '</span></span>' +
      '</button>'
    );
  }

  function renderRecommendedRecordCards_(pet) {
    var recIds = getRecommendedRecordTypesForPet_(pet).filter(function (rid) {
      return RECORD_META[rid];
    });
    if (!recIds.length) {
      return '<p class="hlc-empty--inline">' + esc(t('guideRecordsRecEmpty')) + '</p>';
    }
    return (
      '<div class="hlc-record-grid hlc-record-grid--recommended hlc-record-strip">' +
      recIds.map(function (rid) { return renderRecordCard(pet, rid, true); }).join('') +
      '</div>'
    );
  }

  function renderGroupedRecordGridFromIds_(pet, ids, inSheet) {
    var groups = groupedRecordIdsForList_(ids);
    return groups.map(function (grp) {
      return (
        '<section class="hlc-record-group">' +
        '<h3 class="hlc-record-group__title">' + esc(t('recordGroup_' + grp.key)) + '</h3>' +
        '<div class="hlc-record-grid hlc-record-grid--bento">' +
        grp.ids.map(function (rid) { return renderRecordCard(pet, rid, false); }).join('') +
        '</div></section>'
      );
    }).join('');
  }

  function renderAllRecordCards_(pet) {
    var ids = getFilteredAllRecordTypesForPet_(pet);
    if (!ids.length) {
      return '<p class="hlc-empty--inline">' + esc(t('guideRecordsAllEmpty')) + '</p>';
    }
    return renderGroupedRecordGridFromIds_(pet, ids, false);
  }

  function renderSplitRecordSections_(pet) {
    return (
      '<section class="hlc-record-section hlc-record-section--recommended">' +
      '<h2 class="hlc-section-title">' + esc(t('whatToLog')) + '</h2>' +
      '<p class="hlc-record-section__eyebrow">' + esc(t('guideRecordsRecommended')) + '</p>' +
      renderRecommendedRecordCards_(pet) +
      '</section>' +
      '<section class="hlc-record-section hlc-record-section--all">' +
      '<details class="hlc-record-all-details">' +
      '<summary class="hlc-record-all-details__summary">' + esc(t('guideRecordsAll')) + '</summary>' +
      '<div class="hlc-record-all-details__body">' +
      renderAllRecordCards_(pet) +
      '</div></details></section>'
    );
  }

  function renderGroupedRecordGrid(pet, inSheet) {
    var groups = groupedRecordIds_(pet);
    var deck = deckForPet(pet);
    var html = groups.map(function (grp) {
      return (
        '<section class="hlc-record-group">' +
        '<h3 class="hlc-record-group__title">' + esc(t('recordGroup_' + grp.key)) + '</h3>' +
        '<div class="hlc-record-grid hlc-record-grid--bento">' +
        grp.ids.map(function (rid) { return renderRecordCard(pet, rid); }).join('') +
        '</div></section>'
      );
    }).join('');
    if (!inSheet && deck.more && deck.more.length) {
      html += '<button type="button" class="hlc-btn hlc-btn--ghost hlc-record-more" data-hl-action="more-records">' + esc(t('recordMore')) + '</button>';
    }
    return html;
  }

  function renderRecordGrid(pet, ids, inSheet) {
    var deck = deckForPet(pet);
    var html = ids.map(function (rid) { return renderRecordCard(pet, rid); }).join('');
    if (!inSheet && deck.more && deck.more.length) {
      html += '<button type="button" class="hlc-record-card hlc-record-card--more" data-hl-action="more-records">' +
        '<span class="hlc-record-card__icon">' + svgIcon('plus') + '</span>' +
        '<span class="hlc-record-card__title">' + esc(t('recordMore')) + '</span>' +
        '<span class="hlc-record-card__hint">' + esc(t('moreRecordsTitle')) + '</span></button>';
    }
    return '<div class="hlc-record-grid">' + html + '</div>';
  }

  function renderIdentityStrip(pet) {
    return renderCompactHeader(pet);
  }

  function renderBoardPageWrap_(html) {
    return (
      '<button type="button" class="hlc-back" data-hl-action="back-collection">← ' + esc(t('backToCollection')) + '</button>' +
      renderQuickActionDock_('board') +
      html
    );
  }

  function renderBoardCare(pet) {
    return (
      renderCompactHeader(pet) +
      (CARE_GUIDE() ? CARE_GUIDE().renderAdviceBlock(state, pet, careGuideCtx_()) : '') +
      renderStatusChips(pet) +
      renderQuestCards(pet) +
      (CARE_GUIDE() ? renderSplitRecordSections_(pet) : (
        '<section class="hlc-record-section hlc-record-section--recommended">' +
        '<h2 class="hlc-section-title">' + esc(t('whatToLog')) + '</h2>' +
        '<p class="hlc-record-section__eyebrow">' + esc(t('guideRecordsRecommended')) + '</p>' +
        renderRecommendedRecordCards_(pet) +
        '</section>' +
        '<section class="hlc-record-section hlc-record-section--all">' +
        '<details class="hlc-record-all-details">' +
        '<summary class="hlc-record-all-details__summary">' + esc(t('guideRecordsAll')) + '</summary>' +
        '<div class="hlc-record-all-details__body">' +
        renderAllRecordCards_(pet) +
        '</div></details></section>'
      )) +
      renderTimeline_(pet, 8)
    );
  }

  function renderTimeline_(pet, limit) {
    var focusDate = state.ui.timelineFocusDate || '';
    var allLogs = petLogs(pet.id);
    var logs = focusDate
      ? allLogs.filter(function (l) { return String(l.date || '').slice(0, 10) === focusDate; })
      : allLogs.slice(0, limit || 12);
    var focusBanner = focusDate
      ? (
        '<div class="hlc-timeline-focus" role="status">' +
        '<p>' + esc(t('trendTimelineFocus').replace('{date}', focusDate)) + '</p>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="clear-timeline-focus">' + esc(t('trendTimelineClearFocus')) + '</button>' +
        '</div>'
      )
      : '';
    if (!logs.length) {
      return (
        '<section class="hlc-timeline-section">' +
        '<h2 class="hlc-section-title">' + esc(t('recentLogs')) + '</h2>' +
        focusBanner +
        (focusDate
          ? '<p class="hlc-empty--inline">' + esc(t('trendTimelineEmptyDay')) + '</p>'
          : renderTimelineEmpty_()) +
        '</section>'
      );
    }
    if (focusDate) {
      return (
        '<section class="hlc-timeline-section">' +
        '<h2 class="hlc-section-title">' + esc(t('recentLogs')) + '</h2>' +
        focusBanner +
        '<div class="hlc-timeline-group">' +
        logs.map(renderTimelineItem_).join('') +
        '</div></section>'
      );
    }
    var buckets = { today: [], yesterday: [], week: [], earlier: [] };
    logs.forEach(function (log) {
      buckets[timelineBucket_(log.date)].push(log);
    });
    var order = ['today', 'yesterday', 'week', 'earlier'];
    var html = order.map(function (key) {
      if (!buckets[key].length) return '';
      return (
        '<div class="hlc-timeline-group">' +
        '<h3 class="hlc-timeline-group__label">' + esc(t('timeline_' + key)) + '</h3>' +
        buckets[key].map(renderTimelineItem_).join('') +
        '</div>'
      );
    }).join('');
    return '<section class="hlc-timeline-section"><h2 class="hlc-section-title">' + esc(t('recentLogs')) + '</h2>' + html + '</section>';
  }

  function renderScanReprintBanner_() {
    if (!state.ui.pendingReprint) return '';
    return (
      '<div class="hlc-scan-reprint" role="status">' +
      '<p class="hlc-scan-reprint__text">' + esc(t('scanReprintBanner')) + '</p>' +
      '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="open-label">' + esc(t('reprintLabel')) + '</button>' +
      '</div>'
    );
  }

  function renderScanStatusPanel_(pet) {
    var status = cardTodayStatus(pet);
    var stage = stageLabel(pet);
    return (
      '<section class="hlc-scan-status">' +
      '<p class="hlc-scan-status__eyebrow">' + esc(t('scanCurrentStatus')) + '</p>' +
      '<p class="hlc-scan-status__value">' + esc(status) + '</p>' +
      (stage ? '<p class="hlc-scan-status__stage">' + esc(stage) + '</p>' : '') +
      '<p class="hlc-scan-status__hint">' + esc(t('scanStatusHint')) + '</p>' +
      '</section>'
    );
  }

  function renderScanView(root) {
    var pet = getActivePet();
    if (!pet) { state.phase = 'collection'; render(root); return; }
    enrichPet(pet);
    root.innerHTML =
      '<div class="hlc-app hlc-scan-view">' +
      renderToastHtml_() +
      renderSheet() +
      '<button type="button" class="hlc-back" data-hl-action="back-collection">← ' + esc(t('backToCollection')) + '</button>' +
      renderScanReprintBanner_() +
      renderCompactHeader(pet) +
      renderScanPassportTabs_(pet) +
      '<div class="hlc-scan-actions">' +
      '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="open-label">' + esc(t('reprintLabel')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="scan-full-board">' + esc(t('scanOpenFull')) + '</button>' +
      '</div></div>';
  }

  function renderBoardLogs(pet) {
    return (
      renderCompactHeader(pet) +
      '<section class="hlc-record-section hlc-record-section--recommended">' +
      '<h2 class="hlc-section-title">' + esc(t('whatToLog')) + '</h2>' +
      '<p class="hlc-record-section__eyebrow">' + esc(t('guideRecordsRecommended')) + '</p>' +
      renderRecommendedRecordCards_(pet) +
      '</section>' +
      '<section class="hlc-record-section hlc-record-section--all">' +
      '<details class="hlc-record-all-details" open>' +
      '<summary class="hlc-record-all-details__summary">' + esc(t('guideRecordsAll')) + '</summary>' +
      '<div class="hlc-record-all-details__body">' +
      renderAllRecordCards_(pet) +
      '</div></details></section>' +
      (BREEDING() ? BREEDING().renderLogsSection(state, pet, breedingCtx_()) : '') +
      renderTimeline_(pet, 50)
    );
  }

  function trendSparkline_(values, width, height) {
    var api = trendsApi_();
    return api ? api.trendSparkline(values, width, height) : '';
  }


  function renderTrendRangeChips_() {
    var api = trendsApi_();
    return api ? api.renderTrendRangeChips() : '';
  }


  function completionSummaryCaption_(summary, range) {
    var api = trendsApi_();
    return api ? api.completionSummaryCaption(summary, range) : '';
  }


  function renderBoardTrendsBody_(pet) {
    var api = trendsApi_();
    return api ? api.renderBoardTrendsBody(pet) : '';
  }


  function renderBoardTrends(pet) {
    var api = trendsApi_();
    return api ? api.renderBoardTrends(pet) : '';
  }


  function refreshTrendsPanel_() {
    var api = trendsApi_();
    if (api) return api.refreshTrendsPanel();
  }


  function renderBoardProfile(pet) {
    var prof = getPetProfile(pet);
    return renderCompactHeader(pet) +
      '<div class="hlc-profile-grid">' +
      '<div class="hlc-panel"><h3 class="hlc-section-title">' + esc(t('profileTitle')) + '</h3>' +
      '<dl class="hlc-dl">' +
      '<div><dt>' + esc(t('petName')) + '</dt><dd>' + esc(pet.petName) + '</dd></div>' +
      '<div><dt>' + esc(t('profileCategory')) + '</dt><dd>' + esc(petCategoryLabel_(pet)) + '</dd></div>' +
      '<div><dt>' + esc(t('species')) + '</dt><dd>' + esc(speciesDisplayName(pet)) + '</dd></div>' +
      '<div><dt>' + esc(t('scientificName')) + '</dt><dd><em>' + esc(petScientificName(pet) || '—') + '</em></dd></div>' +
      '<div><dt>' + esc(t('lifeStage')) + '</dt><dd>' +
      renderLifeStagePipeline_(pet) +
      (canPickLifeStage(pet)
        ? '<span class="hlc-pet-head__stage-pick" role="group">' + renderLifeStageChips(pet.lifeStage, 'data-hl-life-stage', pet) + '</span>'
        : esc(stageLabel(pet))) +
      '</dd></div>' +
      '<div><dt>' + esc(t('sex')) + '</dt><dd>' + esc(petSexLabel_(pet.sex)) + '</dd></div>' +
      '<div><dt>' + esc(t('profileSource')) + '</dt><dd><input class="hlc-profile-input" type="text" value="' + esc(pet.source || '') + '" data-hl-pet-field="source" placeholder="' + esc(t('profileSourcePlaceholder')) + '" /></dd></div>' +
      '<div><dt>' + esc(t('startDate')) + '</dt><dd>' + esc(pet.careStartDate || '—') + '</dd></div>' +
      '<div><dt>' + esc(t('profileNote')) + '</dt><dd><textarea class="hlc-profile-input" rows="3" data-hl-pet-field="profileNote" placeholder="' + esc(t('notePlaceholder')) + '">' + esc(pet.profileNote || '') + '</textarea></dd></div>' +
      '<div><dt>' + esc(t('husbandryId')) + '</dt><dd><code>' + esc(pet.husbandryId || '—') + '</code></dd></div>' +
      '<div><dt>' + esc(t('passportLinkLabel')) + '</dt><dd><input class="hlc-profile-input" type="text" value="' + esc(pet.specimenPassportId || '') + '" data-hl-pet-field="specimenPassportId" placeholder="' + esc(t('passportLinkPlaceholder')) + '" /></dd></div>' +
      '</dl></div>' +
      (BREEDING() && BREEDING().renderProfileBreedingSummary(state, pet, breedingCtx_())
        ? '<div class="hlc-panel"><h3 class="hlc-section-title">' + esc(t('breedSummaryTitle')) + '</h3>' +
          BREEDING().renderProfileBreedingSummary(state, pet, breedingCtx_()) + '</div>'
        : '') +
      '<div class="hlc-panel"><h3 class="hlc-section-title">' + esc(t('breedParentsTitle')) + '</h3>' +
      (BREEDING() ? BREEDING().renderProfileParents(state, pet, breedingCtx_()) : '') +
      '</div>' +
      '<div class="hlc-panel"><h3 class="hlc-section-title">' + esc(t('breedOffspringTitle')) + '</h3>' +
      (BREEDING() ? BREEDING().renderProfileOffspring(state, pet, breedingCtx_()) : '') +
      '</div>' +
      (BREEDING() ? '<div class="hlc-panel hlc-panel--wide"><h3 class="hlc-section-title">' + esc(t('breedTreeTitle')) + '</h3>' + BREEDING().renderFamilyTree(state, pet, breedingCtx_()) + '</div>' : '') +
      '<div class="hlc-panel hlc-panel--wide"><h3 class="hlc-section-title">' + esc(t('guideArchiveTitle')) + '</h3>' +
      (CARE_GUIDE() ? CARE_GUIDE().renderProfileArchive(state, pet, careGuideCtx_()) : '') +
      '</div>' +
      '<div class="hlc-panel"><h3 class="hlc-section-title">' + esc(t('profileQrTitle')) + '</h3>' +
      '<p class="hlc-profile-qr-url"><code>' + esc(labelQrData(pet)) + '</code></p>' +
      '<div class="hlc-profile-actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="share-qr">' + esc(t('shareQr')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="copy-qr-link">' + esc(t('copyQrLink')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="open-label">' + esc(t('makeLabel')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="label-png">' + esc(t('downloadLabel')) + '</button>' +
      '</div></div>' +
      '<div class="hlc-panel hlc-panel--wide"><h3 class="hlc-section-title">' + esc(t('profilePhotos')) + '</h3>' +
      renderPhotoWall_(pet) +
      '</div>' +
      (prof ? '<div class="hlc-panel"><h3 class="hlc-section-title">' + esc(t('speciesCareTitle')) + '</h3>' +
      '<dl class="hlc-dl"><div><dt>' + esc(t('careType')) + '</dt><dd>' + esc(isEn() ? prof.careType : prof.careTypeZh) + '</dd></div>' +
      '<div><dt>' + esc(t('difficulty')) + '</dt><dd>' + esc(difficultyT(prof.difficulty)) + '</dd></div></dl></div>' : '') +
      '<div class="hlc-panel"><h3 class="hlc-section-title">' + esc(t('profileBackupTitle')) + '</h3>' +
      '<div class="hlc-profile-actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="export-json">' + esc(t('exportJsonPet')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="export-csv">' + esc(t('exportCsv')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="export-photo-index">' + esc(t('exportPhotoIndex')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="export-full-backup">' + esc(t('exportFullBackup')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="export-stub" title="' + esc(t('saveOrPrintReport')) + '">' + esc(t('printCareReport')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="import-backup-pick">' + esc(t('importJsonRestore')) + '</button>' +
      '</div>' +
      '<p class="hlc-profile-hint">' + esc(t('printReportOpenHint')) + ' ' + esc(t('printReportPdfHint')) + '</p>' +
      '</div>' +
      '<div class="hlc-panel"><h3 class="hlc-section-title">' + esc(t('profileExportTitle')) + '</h3>' +
      '<div class="hlc-profile-actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="breed-export-csv">' + esc(t('breedExportCsv')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="breed-export-lineage">' + esc(t('breedExportLineage')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="breed-export-offspring">' + esc(t('breedExportOffspring')) + '</button>' +
      '</div></div></div>';
  }

  function renderHomeContent() {
    var pet = getActivePet();
    if (state.boardTab === 'cards') {
      if (pet && state.phase === 'board') {
        return renderBoardPageWrap_(renderBoardCare(pet));
      }
      return renderCardWall();
    }
    if (!pet) {
      return '<p class="hlc-empty">' + esc(t('selectPetFirst')) + '</p>';
    }
    if (state.boardTab === 'logs') return renderBoardPageWrap_(renderBoardLogs(pet));
    if (state.boardTab === 'trends') return renderBoardPageWrap_(renderBoardTrends(pet));
    if (state.boardTab === 'profile') return renderBoardPageWrap_(renderBoardProfile(pet));
    return renderCardWall();
  }

  function renderAppQuickDock_() {
    if (!shouldShowQuickDock_()) return '';
    return renderQuickActionDock_('fixed');
  }

  function renderMobileQuickBar_(pet) {
    return renderAppQuickDock_();
  }

  function renderLightbox_() {
    if (!state.ui.lightboxUrl) return '';
    return (
      '<div class="hlc-lightbox" role="dialog" aria-modal="true">' +
      '<button type="button" class="hlc-lightbox__backdrop" data-hl-action="close-lightbox" aria-label="' + esc(t('closeSheet')) + '"></button>' +
      '<figure class="hlc-lightbox__frame">' +
      '<img src="' + state.ui.lightboxUrl + '" alt="" />' +
      '<button type="button" class="hlc-lightbox__close" data-hl-action="close-lightbox">' + esc(t('closeSheet')) + '</button>' +
      '</figure></div>'
    );
  }

  function renderHome(root) {
    ensureIntroTour_();
    var pet = getActivePet();
    var isCollectionHome = state.boardTab === 'cards' && !(pet && state.phase === 'board');
    var isEmptyCollection = isCollectionHome && !state.pets.length;
    var hasDock = shouldShowQuickDock_();
    var appClass = 'hlc-app hlc-app--dash' +
      (state.ui.tourActive ? ' hlc-app--tour' : '') +
      (isCollectionHome ? ' hlc-app--collection' : '') +
      (isEmptyCollection ? ' hlc-app--collection-empty' : '') +
      (pet && state.phase === 'board' ? ' hlc-app--board' : '') +
      (hasDock ? ' hlc-app--has-dock' : '');
    root.innerHTML =
      '<div class="' + appClass + '">' +
      '<div class="hlc-app__inner">' +
      renderToastHtml_() +
      renderLightbox_() +
      renderSheet() +
      '<div class="hlc-sticky-head">' +
      (shouldShowAppChrome_() ? renderAppChrome_() : '') +
      (shouldShowShellNav_() ? renderShellNav() : '') + renderSaveStatusBar_() + '</div>' +
      '<div class="hlc-app__content">' + renderHomeContent() + '</div>' +
      '<input type="file" class="hlc-sr-only" id="hlcImportBackupInputGlobal" accept=".json,application/json" data-hl-import-backup />' +
      renderMobileQuickBar_(pet) +
      '</div></div>';
  }

  function renderBoard(root) {
    renderHome(root);
  }

  function renderCollection(root) {
    renderHome(root);
  }

  function renderCreatedFact_(label, valueHtml) {
    return (
      '<div class="hlc-created-success__fact">' +
      '<span class="hlc-created-success__fact-key">' + esc(label) + '</span>' +
      '<span class="hlc-created-success__fact-val">' + valueHtml + '</span></div>'
    );
  }

  function renderCreated(root) {
    var pet = getActivePet();
    if (!pet) { state.phase = 'collection'; render(root); return; }
    enrichPet(pet);
    var prof = getPetProfile(pet);
    var photoHtml = renderCreatedPhotoHtml(pet);
    var careLabel = prof ? (isEn() ? prof.careType : prof.careTypeZh) : '';
    if (pet.profileSnapshot && pet.profileSnapshot.careTypePickerLabel) careLabel = pet.profileSnapshot.careTypePickerLabel;
    if (!careLabel && pet.guideCategorySnapshot && CARE_GUIDE()) {
      careLabel = t('guideCat_' + pet.guideCategorySnapshot);
    }
    var guideTitle = '';
    if (pet.careGuideId && CARE_GUIDE()) {
      var g = CARE_GUIDE().getGuideById(state, pet.careGuideId);
      if (g) guideTitle = g.title || pet.careGuideId;
    }
    var sci = petScientificName(pet) || '—';
    root.innerHTML =
      '<div class="hlc-app hlc-created">' +
      renderToastHtml_() +
      '<section class="hlc-created-success">' +
      '<div class="hlc-created-success__backdrop" aria-hidden="true">' +
      '<div class="hlc-created-success__orb hlc-created-success__orb--a"></div>' +
      '<div class="hlc-created-success__orb hlc-created-success__orb--b"></div>' +
      '</div>' +
      '<header class="hlc-created-success__hero">' +
      '<span class="hlc-created-success__badge" aria-hidden="true">' + svgIcon('check') + '</span>' +
      '<div class="hlc-created-success__hero-copy">' +
      '<p class="hlc-created-success__eyebrow">' + esc(t('homeCardLabel')) + '</p>' +
      '<h1 class="hlc-created-success__title">' + esc(t('cardCreatedTitle')) + '</h1>' +
      '<p class="hlc-created-success__lead">' + esc(t('cardCreatedSubtitle')) + '</p>' +
      '</div></header>' +
      '<div class="hlc-created-success__grid">' +
      '<article class="hlc-created-success__preview">' +
      '<div class="hlc-created-success__preview-chrome">' +
      '<span class="hlc-created-success__preview-label">' + esc(t('homeCardLabel')) + '</span>' +
      '<span class="hlc-created-success__preview-dot" aria-hidden="true"></span>' +
      '</div>' +
      '<div class="hlc-created-success__preview-photo">' + photoHtml +
      '<div class="hlc-created-success__preview-shade" aria-hidden="true"></div>' +
      '<div class="hlc-created-success__preview-name">' +
      '<strong>' + esc(pet.petName) + '</strong>' +
      '<span>' + esc(speciesDisplayName(pet)) + '</span>' +
      '</div></div>' +
      '<footer class="hlc-created-success__preview-foot">' +
      '<span class="hlc-created-success__preview-id-label">' + esc(t('husbandryId')) + '</span>' +
      '<code class="hlc-created-success__preview-id">' + esc(pet.husbandryId) + '</code>' +
      '</footer></article>' +
      '<div class="hlc-created-success__panel">' +
      '<div class="hlc-created-success__facts">' +
      renderCreatedFact_(t('petName'), esc(pet.petName)) +
      renderCreatedFact_(t('species'), esc(speciesDisplayName(pet))) +
      renderCreatedFact_(t('scientificName'), '<em>' + esc(sci) + '</em>') +
      renderCreatedFact_(t('careType'), esc(careLabel)) +
      (guideTitle ? renderCreatedFact_(t('guideProfileApplied'), esc(guideTitle)) : '') +
      '</div>' +
      '<div class="hlc-created-success__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-created-success__cta" data-hl-action="start-logging">' +
      svgIcon('status') + '<span>' + esc(t('startLogging')) + '</span></button>' +
      '<div class="hlc-created-success__action-row">' +
      '<button type="button" class="hlc-created-success__action" data-hl-action="open-label">' +
      '<span class="hlc-created-success__action-icon">' + svgIcon('label') + '</span>' +
      '<span class="hlc-created-success__action-text">' + esc(t('makeLabel')) + '</span></button>' +
      (pet.qrSharingEnabled !== false
        ? '<button type="button" class="hlc-created-success__action" data-hl-action="share-qr">' +
          '<span class="hlc-created-success__action-icon">' + svgIcon('qr') + '</span>' +
          '<span class="hlc-created-success__action-text">' + esc(t('shareQr')) + '</span></button>'
        : '') +
      '</div></div></div></div></section>' +
      (WIZARD() ? WIZARD().renderOnboardingCard(pet, wizardCtx_()) : '') +
      '</div>';
  }

  function renderSpeciesSearchBlock_(inputId, wrapClass) {
    return (
      '<div class="' + esc(wrapClass) + '">' +
      '<input type="search" class="hlc-search" id="' + esc(inputId) + '" value="' + esc(state.search) + '" placeholder="' + esc(t('searchSpeciesPlaceholder')) + '" autocomplete="off" />' +
      '<div class="hlc-spec-results-wrap">' + speciesResultsHtml_() + '</div></div>'
    );
  }

  function renderLabelCoordsForm_(pet) {
    return (
      '<section class="hlc-coords-form">' +
      '<h2 class="hlc-section-title">' + esc(t('coordTitle')) + '</h2>' +
      '<p class="hlc-coords-form__hint">' + esc(t('coordHint')) + '</p>' +
      '<label class="hlc-field"><span>' + esc(t('coordAddress')) + '</span>' +
      '<input data-hl-coord-field="address" value="' + esc(pet.address || '') + '" placeholder="' + esc(t('coordAddressPlaceholder')) + '" /></label>' +
      '<label class="hlc-field"><span>' + esc(t('coordLocality')) + '</span>' +
      '<input data-hl-coord-field="locality" value="' + esc(pet.locality || '') + '" placeholder="' + esc(t('coordLocalityPlaceholder')) + '" /></label>' +
      '<div class="hlc-coords-form__grid">' +
      '<label class="hlc-field"><span>' + esc(t('coordLatitude')) + '</span>' +
      '<input data-hl-coord-field="latitude" type="number" step="any" value="' + esc(pet.latitude || '') + '" /></label>' +
      '<label class="hlc-field"><span>' + esc(t('coordLongitude')) + '</span>' +
      '<input data-hl-coord-field="longitude" type="number" step="any" value="' + esc(pet.longitude || '') + '" /></label>' +
      '<label class="hlc-field"><span>' + esc(t('coordAltitude')) + '</span>' +
      '<input data-hl-coord-field="altitude" type="number" step="any" value="' + esc(pet.altitude || '') + '" /></label>' +
      '</div>' +
      '<div class="hlc-coords-form__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="coord-geocode">' + esc(t('coordGeocode')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="coord-gps">' + esc(t('coordGps')) + '</button>' +
      '</div></section>'
    );
  }

  function renderLabelPreview(pet) {
    enrichPet(pet);
    var tplId = (pet.labelSettings && pet.labelSettings.template) || state.ui.labelTemplate || 'standard_enclosure';
    var tplApi = LABEL_API();
    var qrData = labelQrData(pet);
    var qrSrc = tplApi ? tplApi.qrImageUrl(qrData, 128) : '';
    var statusNow = cardTodayStatus(pet);
    var coordsLine = petCoordinatesLine(pet);
    var localityLine = petLocalityLine(pet);
    var showCoords = tplId === 'coordinates_label' || petHasCoordinates(pet);
    return (
      '<div class="hlc-label-preview" id="hlcLabelPreview">' +
      '<div class="hlc-label-preview__inner">' +
      '<p class="hlc-label-preview__title">' + esc(tplId === 'coordinates_label' ? t('labelCoordinates') : t('labelTitle')) + '</p>' +
      '<p class="hlc-label-preview__name">' + esc(pet.petName) + '</p>' +
      '<p class="hlc-label-preview__species">' + esc(speciesDisplayName(pet)) + '</p>' +
      '<p class="hlc-label-preview__sci"><em>' + esc(petScientificName(pet) || '') + '</em></p>' +
      (showCoords && localityLine ? '<p class="hlc-label-preview__locality">' + esc(localityLine) + '</p>' : '') +
      (showCoords && coordsLine ? '<p class="hlc-label-preview__coords">' + esc(coordsLine) + '</p>' : '') +
      (showCoords && !coordsLine ? '<p class="hlc-label-preview__coords hlc-label-preview__coords--warn">' + esc(t('coordMissing')) + '</p>' : '') +
      '<p class="hlc-label-preview__status"><strong>' + esc(t('labelStatusNow')) + '</strong> ' + esc(statusNow) +
      (stageLabel(pet) ? ' · ' + esc(stageLabel(pet)) : '') + '</p>' +
      '<p class="hlc-label-preview__id"><code>' + esc(pet.husbandryId) + '</code></p>' +
      (qrSrc
        ? '<div class="hlc-label-preview__qr-wrap">' +
          '<img class="hlc-label-preview__qr" src="' + qrSrc + '" alt="QR" crossorigin="anonymous" />' +
          '<p class="hlc-label-preview__qr-hint">' + esc(t('labelQrScanHint')) + '</p></div>'
        : '') +
      '</div></div>'
    );
  }

  function renderLabel(root) {
    var pet = getActivePet();
    if (!pet) { state.phase = 'collection'; render(root); return; }
    enrichPet(pet);
    var qLabel = (state.search || '').trim();
    if (qLabel.length >= 2 && !state.ui.speciesLocal.length && !state.ui.speciesRemote.length && !state.ui.speciesLoading) {
      runSpeciesSearch_(qLabel);
    }
    var tplApi = LABEL_API();
    var templates = tplApi ? tplApi.getTemplates() : [];
    var tplHtml = templates.map(function (tpl) {
      var active = ((pet.labelSettings && pet.labelSettings.template) || state.ui.labelTemplate) === tpl.id ? ' is-active' : '';
      return '<button type="button" class="hlc-label-tpl' + active + '" data-hl-label-tpl="' + esc(tpl.id) + '">' + esc(t(tpl.labelKey)) + '</button>';
    }).join('');
    var privacyOpts = [
      { v: 'private', key: 'privacyPrivate' },
      { v: 'public_summary', key: 'privacyPublic' },
      { v: 'readonly', key: 'privacyReadonly' },
      { v: 'share_code', key: 'privacyShareCode' },
      { v: 'caregiver', key: 'privacyCaregiver' },
    ];
    var privHtml = privacyOpts.map(function (o) {
      var active = (pet.privacy || 'private') === o.v ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + active + '" data-hl-privacy="' + esc(o.v) + '">' + esc(t(o.key)) + '</button>';
    }).join('');
    root.innerHTML =
      '<div class="hlc-app hlc-label-page">' +
      renderToastHtml_() +
      '<button type="button" class="hlc-back" data-hl-action="back-board">← ' + esc(t('backToPet')) + '</button>' +
      '<header class="hlc-head"><h1 class="hlc-head__title">' + esc(t('labelTitle')) + '</h1>' +
      '<p class="hlc-head__sub">' + esc(pet.petName) + '</p></header>' +
      '<section class="hlc-label-qr-info">' +
      '<p class="hlc-label-qr-info__title">' + esc(t('labelQrTitle')) + '</p>' +
      '<p class="hlc-label-qr-info__body">' + esc(t('labelQrBody')) + '</p>' +
      '<p class="hlc-label-qr-info__url"><code>' + esc(pet.qrUrl || labelQrData(pet)) + '</code></p>' +
      '</section>' +
      '<h2 class="hlc-section-title">' + esc(t('labelPickTemplate')) + '</h2>' +
      '<div class="hlc-label-tpls">' + tplHtml + '</div>' +
      '<h2 class="hlc-section-title">' + esc(t('labelSpeciesTitle')) + '</h2>' +
      '<p class="hlc-coords-form__hint">' + esc(t('labelSpeciesHint')) + '</p>' +
      renderSpeciesSearchBlock_('mcHlLabelSearch', 'hlc-label-spec-search') +
      renderLabelCoordsForm_(pet) +
      renderLabelPreview(pet) +
      '<h2 class="hlc-section-title">' + esc(t('privacyTitle')) + '</h2>' +
      '<div class="hlc-chips">' + privHtml + '</div>' +
      '<div class="hlc-label-actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="label-print">' + esc(t('labelPrint')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="label-png">' + esc(t('labelDownloadPng')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="copy-qr-link">' + esc(t('copyQrLink')) + '</button>' +
      '</div></div>';
  }

  function renderNotFound(root) {
    root.innerHTML =
      '<div class="hlc-app">' +
      renderToastHtml_() +
      renderShellNav() +
      '<p class="hlc-empty">' + esc(t('petNotFound')) + '</p>' +
      '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="back-collection">' + esc(t('backToCollection')) + '</button></div>';
  }

  function onboardGroupsHtml_() {
    var catApi = CATEGORIES();
    var groups = catApi ? catApi.getGroups() : [];
    var q = (state.search || '').toLowerCase().trim();
    return groups.map(function (grp) {
      var open = state.expandedGroupId === grp.id || !!q;
      var typesHtml = grp.types.map(function (tp) {
        var label = t(tp.labelKey);
        if (q && label.toLowerCase().indexOf(q) < 0) return '';
        return '<button type="button" class="hlc-type-pick" data-hl-care-type="' + esc(tp.id) + '">' + esc(label) + '</button>';
      }).join('');
      if (q && !typesHtml) return '';
      return (
        '<section class="hlc-cat-group' + (open ? ' is-open' : '') + '">' +
        '<button type="button" class="hlc-cat-group__head" data-hl-toggle-group="' + esc(grp.id) + '">' +
        '<span class="hlc-cat-group__title">' + esc(t(grp.labelKey)) + '</span>' +
        '<span class="hlc-cat-group__chev" aria-hidden="true">' + (open ? '−' : '+') + '</span></button>' +
        (open ? '<div class="hlc-cat-group__types">' + typesHtml + '</div>' : '') +
        '</section>'
      );
    }).join('') || '<p class="hlc-empty">' + esc(t('noResults')) + '</p>';
  }

  function onboardSpecCardHtml_(item, pickAttr, pickValue, meta) {
    var title = speciesSearchPrimary(item);
    var secondary = speciesSearchSecondary(item);
    var sub = item.scientificName || '';
    var metaHtml = meta ? '<span class="hlc-spec-pick__meta">' + esc(meta) + '</span>' : '';
    return (
      '<button type="button" class="hlc-spec-pick" ' + pickAttr + '="' + esc(pickValue) + '">' +
      '<strong>' + esc(title) + '</strong>' +
      (secondary ? '<br/><span class="hlc-spec-pick__alt">' + esc(secondary) + '</span>' : '') +
      (sub ? '<br/><em>' + esc(sub) + '</em>' : '') +
      metaHtml +
      '</button>'
    );
  }

  function speciesPickAttrs_() {
    if (state.phase === 'label') {
      return { localAttr: 'data-hl-label-spec-pick', remoteAttr: 'data-hl-label-spec-tax' };
    }
    if (state.phase === 'profile') {
      return { localAttr: 'data-hl-profile-pick', remoteAttr: 'data-hl-profile-tax' };
    }
    return { localAttr: 'data-hl-pick', remoteAttr: 'data-hl-taxonomy-idx' };
  }

  function speciesResultsHtml_() {
    var q = (state.search || '').trim();
    if (q.length < 2) return '';
    var picks = speciesPickAttrs_();
    var local = state.ui.speciesLocal || [];
    var remote = state.ui.speciesRemote || [];
    var loading = !!state.ui.speciesLoading;
    var cards = local.map(function (s) {
      return onboardSpecCardHtml_(s, picks.localAttr, s.id, t('speciesLocalMatch'));
    }).join('');
    cards += remote.map(function (r, idx) {
      var display = {
        commonName: r.commonName || parseTaxonomyLabel_(r.label).common || r.scientificName,
        chineseName: r.chineseName || r.commonName || parseTaxonomyLabel_(r.label).common || r.scientificName,
        scientificName: r.scientificName,
        localSpeciesId: r.localSpeciesId || '',
      };
      var meta = (r.source || 'GBIF') + (r.family ? ' · ' + r.family : '');
      return onboardSpecCardHtml_(display, picks.remoteAttr, String(idx), meta);
    }).join('');
    if (!cards && !loading) {
      cards = '<p class="hlc-empty">' + esc(t('noSpeciesResults')) + '</p>';
    }
    var loadingHtml = loading ? '<p class="hlc-spec-loading">' + esc(t('speciesSearching')) + '</p>' : '';
    return (
      '<section class="hlc-spec-results">' +
      '<h2 class="hlc-section-title">' + esc(t('speciesSearchTitle')) + '</h2>' +
      loadingHtml +
      '<div class="hlc-spec-grid">' + cards + '</div>' +
      '</section>'
    );
  }

  function parseTaxonomyLabel_(label) {
    var raw = String(label || '').trim();
    if (!raw) return { common: '', sci: '' };
    var parts = raw.split(' — ');
    if (parts.length >= 2) return { common: parts[0].trim(), sci: parts.slice(1).join(' — ').trim() };
    return { common: '', sci: raw };
  }

  function runSpeciesSearch_(q) {
    var query = String(q || '').trim();
    var searchApi = SPECIES_SEARCH();
    state.ui.speciesSearchSeq = (state.ui.speciesSearchSeq || 0) + 1;
    var seq = state.ui.speciesSearchSeq;
    if (query.length < 2) {
      state.ui.speciesLocal = [];
      state.ui.speciesRemote = [];
      state.ui.speciesLoading = false;
      patchSpeciesSearchUi_();
      return;
    }
    state.ui.speciesLoading = true;
    state.ui.speciesLocal = searchApi ? searchApi.searchLocal(query, state.category) : [];
    state.ui.speciesRemote = [];
    patchSpeciesSearchUi_();
    if (!searchApi || typeof searchApi.searchRemote !== 'function') {
      state.ui.speciesLoading = false;
      patchSpeciesSearchUi_();
      return;
    }
    searchApi.searchRemote(query).then(function (remote) {
      if (seq !== state.ui.speciesSearchSeq) return;
      var local = state.ui.speciesLocal || [];
      state.ui.speciesRemote = searchApi.dedupeRemote ? searchApi.dedupeRemote(local, remote) : remote;
      state.ui.speciesLoading = false;
      patchSpeciesSearchUi_();
    });
  }

  /** Update species search results without rebuilding the whole page. */
  function patchSpeciesSearchUi_() {
    var root = global.document.getElementById(ROOT_ID);
    if (!root) return;
    if (state.phase !== 'onboard' && state.phase !== 'profile' && state.phase !== 'label') return;
    var q = (state.search || '').trim();
    root.querySelectorAll('.hlc-spec-results-wrap').forEach(function (specEl) {
      specEl.innerHTML = speciesResultsHtml_();
    });
    if (state.phase === 'label') {
      var preview = root.querySelector('#hlcLabelPreview');
      var pet = getActivePet();
      if (preview && pet) {
        var fresh = global.document.createElement('div');
        fresh.innerHTML = renderLabelPreview(pet);
        var inner = fresh.querySelector('#hlcLabelPreview');
        if (inner) preview.outerHTML = inner.outerHTML;
      }
      return;
    }
    var browse = root.querySelector('.hlc-onboard-browse');
    if (browse) browse.hidden = q.length >= 2;
    if (q.length < 2 && state.phase === 'onboard') {
      var groups = root.querySelector('.hlc-cat-groups');
      if (groups) groups.innerHTML = onboardGroupsHtml_();
    }
  }

  function renderOnboard(root) {
    var q = (state.search || '').trim();
    if (q.length >= 2 && !state.ui.speciesLocal.length && !state.ui.speciesRemote.length && !state.ui.speciesLoading) {
      runSpeciesSearch_(q);
    }
    root.innerHTML =
      '<div class="hlc-app hlc-onboard">' +
      '<header class="hlc-head"><h1 class="hlc-head__title">' + esc(t('chooseSpeciesTitle')) + '</h1>' +
      '<p class="hlc-head__sub">' + esc(t('chooseSpeciesSubtitleSearch')) + '</p></header>' +
      '<button type="button" class="hlc-back" data-hl-action="back-collection">' + esc(t('cancel')) + '</button>' +
      '<input type="search" class="hlc-search" id="mcHlSearch" value="' + esc(state.search) + '" placeholder="' + esc(t('searchSpeciesPlaceholder')) + '" autocomplete="off" />' +
      '<div class="hlc-spec-results-wrap">' + speciesResultsHtml_() + '</div>' +
      '<div class="hlc-onboard-browse"' + (q.length >= 2 ? ' hidden' : '') + '>' +
      '<h2 class="hlc-section-title">' + esc(t('browseCareTypesTitle')) + '</h2>' +
      '<div class="hlc-cat-groups">' + onboardGroupsHtml_() + '</div></div></div>';
  }

  function renderProfileForm(root) {
    var p = state.profile;
    if (!p) { state.phase = 'onboard'; render(root); return; }
    var qProf = (state.search || '').trim();
    if (qProf.length >= 2 && !state.ui.speciesLocal.length && !state.ui.speciesRemote.length && !state.ui.speciesLoading) {
      runSpeciesSearch_(qProf);
    }
    var photo = state.card.profilePhoto;
    var photoInner = '';
    if (photo && photo.indexOf('data:') === 0) {
      photoInner = '<img src="' + photo + '" class="hlc-profile-photo" alt="" />';
    } else {
      var draftPet = {
        profileSnapshot: p,
        careTypeKey: p.careTypeKey,
        category: p.category,
        careTypePickerId: p.careTypePickerId,
      };
      var illus = getPetIllustrationUrl(draftPet);
      if (illus) photoInner = renderIllustrationHtml(illus, 'hlc-profile-photo');
    }
    root.innerHTML =
      '<div class="hlc-app"><header class="hlc-head"><h1 class="hlc-head__title">' + esc(t('namePetTitle')) + '</h1></header>' +
      '<button type="button" class="hlc-back" data-hl-action="back-onboard">' + esc(t('cancel')) + '</button>' +
      '<div class="hlc-profile-card">' + photoInner +
      '<label class="hlc-field"><span>' + esc(t('petName')) + '</span><input data-hl-field="nickname" value="' + esc(state.card.nickname) + '" placeholder="' + esc(t('petNamePlaceholder')) + '" /></label>' +
      '<div class="hlc-field"><span>' + esc(t('lifeStage')) + '</span><div class="hlc-chips">' +
      renderLifeStageChips(state.card.lifeStage, 'data-hl-card-life-stage') + '</div></div>' +
      '<p><strong>' + esc(speciesDisplayName(p)) + '</strong>' +
      (isLikelyScientificName(p.scientificName) ? '<br/><em>' + esc(p.scientificName) + '</em>' : '') +
      '</p>' +
      '<h2 class="hlc-section-title" style="margin-top:16px">' + esc(t('profileSpeciesSearchTitle')) + '</h2>' +
      '<p class="hlc-coords-form__hint">' + esc(t('profileSpeciesSearchHint')) + '</p>' +
      renderSpeciesSearchBlock_('mcHlProfileSearch', 'hlc-profile-spec-search') +
      '<label class="hlc-btn" style="margin-top:12px">' + esc(t('takePhoto')) + '<input type="file" accept="image/*" capture="environment" class="hlc-sr" data-hl-photo="capture" /></label> ' +
      '<label class="hlc-btn hlc-btn--ghost">' + esc(t('uploadPhoto')) + '<input type="file" accept="image/*" class="hlc-sr" data-hl-photo="upload" /></label>' +
      '<button type="button" class="hlc-btn hlc-btn--primary" style="margin-top:16px;width:100%" data-hl-action="complete-profile">' + esc(t('addPet')) + '</button></div></div>';
  }

  function completeProfile() {
    if (!state.profile) return;
    if (!state.card.nickname.trim()) {
      state.card.nickname = speciesDisplayName(state.profile);
    }
    var petId = genId();
    var pet = {
      id: petId,
      petName: state.card.nickname.trim(),
      speciesId: state.selectedSpeciesId || state.profile.id,
      chineseName: state.profile.chineseName,
      commonName: state.profile.commonName,
      scientificName: isLikelyScientificName(state.profile.scientificName) ? state.profile.scientificName : '',
      careTypeKey: state.profile.careTypeKey,
      category: state.profile.category,
      lifeStage: state.card.lifeStage,
      instarLabel: state.card.instarLabel || '',
      profilePhoto: state.card.profilePhoto || '',
      profileSnapshot: state.profile,
      illustrationCategory: (function () {
        var api = ILLUSTRATIONS();
        return api ? api.resolveSlug({ profileSnapshot: state.profile, careTypeKey: state.profile.careTypeKey, category: state.profile.category, careTypePickerId: state.profile.careTypePickerId }) || '' : '';
      })(),
      careStartDate: state.card.startDate || todayKey(),
      sex: state.card.sex || 'unknown',
      source: '',
      profileNote: '',
      husbandryId: genHusbandryId(),
      privacy: 'private',
      qrUrl: petQrUrl(petId),
      labelSettings: defaultLabelSettings(),
    };
    enrichPet(pet);
    state.pets.push(pet);
    if (pet.profilePhoto) {
      addLog(pet.id, { type: 'photo', recordId: 'photo', recordType: t('recordPhoto'), photoUrl: pet.profilePhoto, photoType: 'daily' });
    }
    state.activePetId = pet.id;
    state.phase = 'created';
    state.boardTab = 'cards';
    state.profile = null;
    state.selectedCareTypeId = null;
    state.card = defaultState().card;
    saveState();
    render();
  }

  function render() {
    var root = global.document.getElementById(ROOT_ID);
    if (!root) return;
    var taxonomyDirty = false;
    state.pets.forEach(function (p) {
      if (enrichPet(p)) taxonomyDirty = true;
    });
    if (taxonomyDirty) saveState();
    if (state.phase === 'onboard') renderOnboard(root);
    else if (state.phase === 'wizard' && WIZARD()) {
      var draftPet = null;
      if (state.ui.wizard) {
        draftPet = WIZARD().draftPet(state.ui.wizard);
        draftPet.id = 'wizard-draft';
      }
      root.innerHTML = WIZARD().render(state, wizardCtx_()) +
        (CARE_GUIDE() ? (CARE_GUIDE().renderSheet(state, draftPet, careGuideCtx_()) || '') : '');
    }
    else if (state.phase === 'profile') renderProfileForm(root);
    else if (state.phase === 'created') renderCreated(root);
    else if (state.phase === 'label') renderLabel(root);
    else if (state.phase === 'scan') renderScanView(root);
    else if (state.phase === 'notfound') renderNotFound(root);
    else if (state.phase === 'board') renderBoard(root);
    else renderCollection(root);
    if (state.ui.tourActive && state.phase === 'collection' && state.boardTab === 'cards' && !getActivePet()) {
      syncTourOverlay_();
    } else {
      destroyTourOverlay_();
    }
  }

  function openLabelForPet(petId) {
    state.activePetId = petId;
    state.ui.returnToScan = state.phase === 'scan';
    state.phase = 'label';
    saveState();
    render();
  }

  function copyQrLink(pet) {
    var api = qrApi_();
    if (api) return api.copyQrLink(pet);
  }

  function shareQrLink(pet) {
    var api = qrApi_();
    if (api) return api.shareQrLink(pet);
  }

  function canUseQrCamera_() {
    var api = qrApi_();
    return api ? api.canUseQrCamera() : false;
  }

  function normalizeQrImportText_(text) {
    var api = qrApi_();
    return api ? api.normalizeQrImportText(text) : String(text == null ? '' : text).trim();
  }

  function parseQrImportPayload_(text) {
    var api = qrApi_();
    if (api) return api.parseQrImportPayload(text);
    return { ok: false, errorKey: 'qrImportInvalid' };
  }

  function buildQrImportDraft_(text) {
    var api = qrApi_();
    if (api) return api.buildQrImportDraft(text);
    return { ok: false, errorKey: 'qrImportInvalid', raw: String(text || '') };
  }

  function openQrImportSheet_() {
    var api = qrApi_();
    if (api) return api.openQrImportSheet();
  }

  function submitQrImportPreview_() {
    var api = qrApi_();
    if (api) return api.submitQrImportPreview();
  }

  function commitQrImportOpen_() {
    var api = qrApi_();
    if (api) return api.commitQrImportOpen();
  }

  function commitQrImportCopy_() {
    var api = qrApi_();
    if (api) return api.commitQrImportCopy();
  }

  function commitQrImportBackup_(mode) {
    var api = qrApi_();
    if (api) return api.commitQrImportBackup(mode);
  }

  function startQrCameraScan_() {
    var api = qrApi_();
    if (api) return api.startQrCameraScan();
  }

  function openQrPreviewSheet_(pet) {
    var api = qrApi_();
    if (api) return api.openQrPreviewSheet(pet);
  }

  function renderQrImportSheet_() {
    var api = qrApi_();
    return api ? api.renderQrImportSheet() : '';
  }

  function renderQrImportPreviewSheet_() {
    var api = qrApi_();
    return api ? api.renderQrImportPreviewSheet() : '';
  }

  function renderQrPreviewSheet_() {
    var api = qrApi_();
    return api ? api.renderQrPreviewSheet() : '';
  }

  function renderTemplatePickerSheet_() {
    var presets = WIZARD() && WIZARD().listTemplatePresets
      ? WIZARD().listTemplatePresets()
      : [
        { id: 'reptile', key: 'templateReptile' },
        { id: 'amphibian', key: 'templateAmphibian' },
        { id: 'insect', key: 'templateInsect' },
        { id: 'arthropod', key: 'templateArthropod' },
        { id: 'freshwater', key: 'templateFreshwater' },
        { id: 'marine', key: 'templateMarine' },
        { id: 'bird', key: 'templateBird' },
        { id: 'mammal', key: 'templateMammal' },
        { id: 'plant', key: 'templatePlant' },
        { id: 'custom', key: 'templateCustom' },
      ];
    return (
      '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
      '<div class="hlc-sheet hlc-sheet--template" role="dialog" aria-modal="true">' +
      '<div class="hlc-sheet__handle"></div>' +
      '<h2 class="hlc-sheet__title">' + esc(t('templatePickerTitle')) + '</h2>' +
      '<p class="hlc-sheet__hint">' + esc(t('templatePickerHint')) + '</p>' +
      '<div class="hlc-template-picker">' + presets.map(function (p) {
        return '<button type="button" class="hlc-btn hlc-btn--ghost hlc-template-picker__btn" data-hl-action="wizard-template-pick" data-hl-template-id="' + esc(p.id) + '"' +
          (state.ui.templatePickBusy ? ' disabled' : '') + '>' + esc(t(p.key)) + '</button>';
      }).join('') + '</div>' +
      '<div class="hlc-sheet__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="close-sheet">' + esc(t('cancel')) + '</button>' +
      '</div></div></div>'
    );
  }

  function printReportRows_(logs) {
    if (!logs || !logs.length) {
      return '<tr><td colspan="3">' + esc(t('summaryNoLogYet')) + '</td></tr>';
    }
    return logs.map(function (l) {
      return (
        '<tr><td>' + esc(formatLogDateTime_(l.date)) + '</td>' +
        '<td>' + esc(l.recordType || l.type || '') + '</td>' +
        '<td>' + esc(logSummaryLine_(l) || l.note || '') + '</td></tr>'
      );
    }).join('');
  }

  function printReportSection_(title, bodyHtml) {
    if (!bodyHtml) return '';
    return '<section class="hlc-print-section"><h2>' + esc(title) + '</h2>' + bodyHtml + '</section>';
  }

  function printPetReport_(pet) {
    if (!pet) return;
    enrichPet(pet);
    var allLogs = petLogs(pet.id);
    var recent = allLogs.slice(0, 40);
    var feedLogs = allLogs.filter(function (l) { return l.type === 'feeding' || l.recordId === 'feeding'; }).slice(0, 12);
    var envLogs = allLogs.filter(function (l) {
      return l.recordId === 'temperature' || l.recordId === 'humidity' || l.recordId === 'water_temp' ||
        l.recordId === 'ph' || l.recordId === 'substrate';
    }).slice(0, 12);
    var abnLogs = allLogs.filter(function (l) { return l.type === 'abnormality' || l.recordId === 'abnormality'; }).slice(0, 12);
    var feedStats = { ate: 0, ate_less: 0, refuse: 0 };
    feedLogs.forEach(function (l) {
      var st = l.values && l.values.feedingStatus;
      if (st === 'refused' || st === 'vomit') feedStats.refuse += 1;
      else if (st === 'ate_less') feedStats.ate_less += 1;
      else feedStats.ate += 1;
    });
    var humidVals = envLogs.filter(function (l) { return l.recordId === 'humidity'; }).map(function (l) {
      return parseFloat(l.values && l.values.value) || 0;
    }).filter(function (n) { return n > 0; });
    var tempVals = envLogs.filter(function (l) {
      return l.recordId === 'temperature' || l.recordId === 'water_temp';
    }).map(function (l) {
      return parseFloat(l.values && l.values.value) || 0;
    }).filter(function (n) { return n > 0; });
    var pendingHealth = pendingHealthReminders_().filter(function (item) {
      return item && item.pet && item.pet.id === pet.id;
    });
    var tplApi = LABEL_API();
    var qrData = labelQrData(pet);
    var qrSrc = (tplApi && tplApi.qrImageUrl && qrData) ? tplApi.qrImageUrl(qrData, 160) : '';
    var photoSrc = pet.profilePhoto || '';
    var generatedAt = formatLogDateTime_(new Date().toISOString());
    var localeCode = String(lang() || 'zh-TW');
    var fontStack = '"Segoe UI","Noto Sans TC","Noto Sans JP","Hiragino Sans","Yu Gothic","Microsoft JhengHei","PingFang TC","Helvetica Neue",sans-serif';
    var healthSummary =
      '<ul class="hlc-print-list">' +
      '<li>' + esc(t('printReportHealthStatus')) + ': ' + esc(cardTodayStatus(pet)) + '</li>' +
      '<li>' + esc(t('trendAbnormal')) + ': ' + esc(String(abnLogs.length)) + '</li>' +
      '<li>' + esc(t('printReportPendingReminders')) + ': ' + esc(String(pendingHealth.length)) + '</li>' +
      '</ul>';
    var feedSummary =
      '<ul class="hlc-print-list">' +
      '<li>' + esc(t('trendFeedAte')) + ': ' + esc(String(feedStats.ate)) + '</li>' +
      '<li>' + esc(t('trendFeedAteLess')) + ': ' + esc(String(feedStats.ate_less)) + '</li>' +
      '<li>' + esc(t('trendFeedRefused')) + ': ' + esc(String(feedStats.refuse)) + '</li>' +
      '</ul>' +
      (feedLogs.length
        ? '<table><thead><tr><th>' + esc(t('photoDateLabel')) + '</th><th>' + esc(t('recordFeeding')) + '</th><th>' + esc(t('notePlaceholder')) + '</th></tr></thead><tbody>' +
          printReportRows_(feedLogs) + '</tbody></table>'
        : '<p>' + esc(t('noDataYet')) + '</p>');
    var envSummary =
      '<ul class="hlc-print-list">' +
      (tempVals.length ? '<li>' + esc(t('trendTemp')) + ': ' + esc(trendRangeLabel_(tempVals, '°C')) + '</li>' : '') +
      (humidVals.length ? '<li>' + esc(t('trendHumidity')) + ': ' + esc(trendRangeLabel_(humidVals, '%')) + '</li>' : '') +
      (!tempVals.length && !humidVals.length ? '<li>' + esc(t('noDataYet')) + '</li>' : '') +
      '</ul>' +
      (envLogs.length
        ? '<table><thead><tr><th>' + esc(t('photoDateLabel')) + '</th><th>' + esc(t('careType')) + '</th><th>' + esc(t('notePlaceholder')) + '</th></tr></thead><tbody>' +
          printReportRows_(envLogs) + '</tbody></table>'
        : '');
    var reminderHtml = pendingHealth.length
      ? '<ul class="hlc-print-list">' + pendingHealth.map(function (item) {
        var label = (item.log && (item.log.recordType || item.log.note)) || t('healthReminderLabel');
        return '<li>' + esc(label) + (item.dueDate ? ' · ' + esc(item.dueDate) : '') + '</li>';
      }).join('') + '</ul>'
      : '<p>' + esc(t('printReportNoReminders')) + '</p>';
    var cover =
      '<header class="hlc-print-cover">' +
      '<p class="hlc-print-cover__brand">MCurator · Husbandry Log</p>' +
      '<h1>' + esc(t('petReportTitle')) + '</h1>' +
      '<p class="hlc-print-cover__name">' + esc(pet.petName || '') + '</p>' +
      '<p><em>' + esc(speciesDisplayName(pet) || '') + '</em></p>' +
      (petScientificName(pet) ? '<p class="hlc-print-cover__sci">' + esc(petScientificName(pet)) + '</p>' : '') +
      '<dl class="hlc-print-meta">' +
      '<div><dt>' + esc(t('husbandryId')) + '</dt><dd>' + esc(pet.husbandryId || '—') + '</dd></div>' +
      '<div><dt>' + esc(t('lifeStage')) + '</dt><dd>' + esc(stageLabel(pet) || '—') + '</dd></div>' +
      '<div><dt>' + esc(t('sex')) + '</dt><dd>' + esc(petSexLabel_(pet.sex) || '—') + '</dd></div>' +
      '<div><dt>' + esc(t('startDate')) + '</dt><dd>' + esc(pet.careStartDate || '—') + '</dd></div>' +
      '<div><dt>' + esc(t('printReportGeneratedAt')) + '</dt><dd>' + esc(generatedAt) + '</dd></div>' +
      '<div><dt>' + esc(t('printReportLocale')) + '</dt><dd>' + esc(localeCode) + '</dd></div>' +
      '</dl></header>';
    var photoBlock = photoSrc
      ? printReportSection_(t('profilePhotos'), '<img class="hlc-print-photo" src="' + photoSrc + '" alt="" />')
      : '';
    var qrBlock = printReportSection_(
      t('profileQrTitle'),
      (qrSrc ? '<img class="hlc-print-qr" src="' + qrSrc + '" alt="QR" />' : '') +
      '<p class="hlc-print-qr-url"><code>' + esc(qrData || '—') + '</code></p>' +
      '<p class="hlc-print-hint">' + esc(t('printReportPdfHint')) + '</p>'
    );
    var html =
      '<!DOCTYPE html><html lang="' + esc(localeCode) + '"><head><meta charset="utf-8"/>' +
      '<title>' + esc(t('petReportTitle')) + ' — ' + esc(pet.petName || '') + '</title>' +
      '<style>' +
      'body{font-family:' + fontStack + ';padding:28px;color:#111;line-height:1.45;max-width:860px;margin:0 auto}' +
      'h1{margin:0 0 6px;font-size:1.6rem}h2{margin:1.4rem 0 0.55rem;font-size:1.1rem;border-bottom:1px solid #ddd;padding-bottom:4px}' +
      '.hlc-print-cover__brand{margin:0;color:#555;font-size:0.8rem;letter-spacing:0.04em}' +
      '.hlc-print-cover__name{margin:10px 0 4px;font-size:1.35rem;font-weight:700}' +
      '.hlc-print-cover__sci{font-style:italic;color:#444;margin:0 0 12px}' +
      '.hlc-print-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 16px;margin:12px 0 0}' +
      '.hlc-print-meta dt{font-size:0.72rem;color:#666}.hlc-print-meta dd{margin:0;font-size:0.92rem}' +
      '.hlc-print-list{margin:0;padding-left:1.1rem}.hlc-print-list li{margin:0.2rem 0}' +
      'table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12.5px}' +
      'th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top}th{background:#f4f4f4}' +
      '.hlc-print-photo{max-width:220px;max-height:220px;object-fit:cover;border-radius:8px;border:1px solid #ddd}' +
      '.hlc-print-qr{width:140px;height:140px;image-rendering:pixelated}' +
      '.hlc-print-qr-url{font-size:0.75rem;word-break:break-all}' +
      '.hlc-print-hint{font-size:0.8rem;color:#555;margin-top:8px}' +
      '.hlc-print-footer{margin-top:24px;font-size:0.75rem;color:#666;border-top:1px solid #ddd;padding-top:10px}' +
      '@media print{body{padding:12px} .hlc-print-section{page-break-inside:avoid}}' +
      '</style></head><body>' +
      cover +
      photoBlock +
      printReportSection_(t('printReportHealthSummary'), healthSummary) +
      printReportSection_(t('printReportFeedingSummary'), feedSummary) +
      printReportSection_(t('printReportEnvSummary'), envSummary) +
      printReportSection_(t('printReportAbnormalSection'), abnLogs.length
        ? '<table><thead><tr><th>' + esc(t('photoDateLabel')) + '</th><th>' + esc(t('recordAbnormality')) + '</th><th>' + esc(t('notePlaceholder')) + '</th></tr></thead><tbody>' +
          printReportRows_(abnLogs) + '</tbody></table>'
        : '<p>' + esc(t('printReportNoAbnormal')) + '</p>') +
      printReportSection_(t('printReportRemindersSection'), reminderHtml) +
      qrBlock +
      printReportSection_(t('recentLogs'),
        '<table><thead><tr><th>' + esc(t('photoDateLabel')) + '</th><th>' + esc(t('careType')) + '</th><th>' + esc(t('notePlaceholder')) + '</th></tr></thead><tbody>' +
        printReportRows_(recent) + '</tbody></table>') +
      '<footer class="hlc-print-footer">' +
      '<p>' + esc(t('printReportFooter')) + '</p>' +
      '<p>' + esc(t('printReportPdfHint')) + '</p>' +
      '</footer></body></html>';
    var w = global.open('', '_blank', 'width=820,height=960');
    if (!w) {
      showToast_(t('printReportPopupBlocked'), 2800);
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    global.setTimeout(function () {
      try { w.print(); } catch (ePrint) { /* ignore */ }
    }, 250);
    showToast_(t('printCareReportDone'), 2800);
  }

  function printLabel() {
    var el = global.document.getElementById('hlcLabelPreview');
    if (!el) return;
    var pet = getActivePet();
    if (pet) {
      state.ui.pendingReprint = false;
      saveState();
    }
    var w = global.open('', '_blank', 'width=480,height=640');
    if (!w) return;
    w.document.write(
      '<html><head><title>' + esc(t('labelTitle')) + '</title>' +
      '<style>body{font-family:sans-serif;padding:16px;max-width:360px}' +
      'img{max-width:128px}.hlc-label-preview__coords{font-family:monospace;font-size:12px}' +
      '.hlc-label-preview__locality{font-weight:600;color:#333}' +
      '.hlc-label-preview__status{font-size:14px;margin:8px 0}.hlc-label-preview__qr-hint{font-size:11px;color:#555}</style></head><body>' +
      el.innerHTML + '</body></html>',
    );
    w.document.close();
    w.focus();
    w.print();
  }

  function downloadLabelPng() {
    var pet = getActivePet();
    var tplApi = LABEL_API();
    if (!pet || !tplApi) return;
    enrichPet(pet);
    var qrSrc = tplApi.qrImageUrl(labelQrData(pet), 200);
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      var w = 400;
      var h = 520;
      var canvas = global.document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(pet.petName || '', 20, 36);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#444444';
      ctx.fillText(speciesDisplayName(pet) || '', 20, 58);
      var sci = petScientificName(pet);
      if (sci) {
        ctx.font = 'italic 13px sans-serif';
        ctx.fillText(sci, 20, 78);
      }
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#222222';
      ctx.fillText(t('labelStatusNow') + ' ' + cardTodayStatus(pet), 20, 104);
      ctx.fillText(pet.husbandryId || '', 20, 126);
      ctx.drawImage(img, 20, 150, 160, 160);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#666666';
      wrapLabelText_(ctx, t('labelQrScanHint'), 20, 330, w - 40);
      try {
        var link = global.document.createElement('a');
        link.download = (pet.petName || 'label').replace(/[^\w\u4e00-\u9fff-]+/g, '_') + '-label.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        state.ui.pendingReprint = false;
        state.toast = t('labelPngSaved');
        saveState();
        render();
        global.setTimeout(function () { state.toast = null; render(); }, 2000);
      } catch (e) {
        state.toast = t('labelPngFailed');
        saveState();
        render();
        global.setTimeout(function () { state.toast = null; render(); }, 2200);
      }
    };
    img.onerror = function () { printLabel(); };
    img.src = qrSrc;
  }

  function wrapLabelText_(ctx, text, x, y, maxWidth) {
    var words = String(text || '').split('');
    var line = '';
    var lineY = y;
    for (var i = 0; i < words.length; i++) {
      var test = line + words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, lineY);
        line = words[i];
        lineY += 14;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, lineY);
  }

  function compressPhoto(file, cb) {
    if (!file || file.type.indexOf('image') !== 0) { cb(''); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 640, w = img.width, h = img.height;
        if (w > max || h > max) {
          if (w > h) { h = Math.round(h * max / w); w = max; } else { w = Math.round(w * max / h); h = max; }
        }
        var c = global.document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        try { cb(c.toDataURL('image/jpeg', 0.82)); } catch (e) { cb(String(reader.result || '')); }
      };
      img.onerror = function () { cb(String(reader.result || '')); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  var speciesSearchTimer_ = null;
  var collectionSearchTimer_ = null;
  var wizardBannerTimer_ = null;

  function wizardFieldNeedsBannerRefresh_(field) {
    return field === 'petName' || field === 'commonName' || field === 'scientificName';
  }

  function scheduleWizardBannerRefresh_() {
    if (wizardBannerTimer_) global.clearTimeout(wizardBannerTimer_);
    wizardBannerTimer_ = global.setTimeout(function () {
      if (state.phase === 'wizard' && WIZARD() && WIZARD().patchMatchBanner) {
        WIZARD().patchMatchBanner(state, wizardCtx_());
      }
    }, 320);
  }

  function isHlUiEvent_(el) {
    if (!el) return false;
    return !!(el.closest('#' + ROOT_ID) || el.closest('#' + TOUR_HOST_ID));
  }


  function registryApi_() {
    return global.MCHusbandryActionRegistry || null;
  }

  function installHusbandryActions_() {
    var R = registryApi_();
    if (!R || R.__husbandryInstalled) return;
    R.__husbandryInstalled = true;

    function reg(name, fn) { R.register(name, fn); }

    R.alias('batch-water-change', 'batch-water');
    R.alias('batch-complete-task', 'batch-complete-tasks');
    R.alias('export-collection-stub', 'export-full-backup');
    R.alias('export-pdf', 'export-stub');
    R.alias('print-care-report', 'export-stub');

    R.registerModule({
      prefix: 'wizard-',
      name: 'wizard',
      handle: function (act, ctx) {
        if (!WIZARD()) return false;
        if (act === 'wizard-template-pick' || act === 'wizard-back-to-templates') return false;
        var wctx = wizardCtx_();
        wctx.el = ctx.el;
        return !!WIZARD().handleAction(act, wctx);
      },
    });
    R.registerModule({
      prefix: 'breed-',
      name: 'breeding',
      handle: function (act, ctx) {
        if (!BREEDING()) return false;
        var bctx = breedingCtx_();
        bctx.el = ctx.el;
        return !!BREEDING().handleAction(act, bctx);
      },
    });
    R.registerModule({
      prefix: 'guide-',
      name: 'care-guide',
      handle: function (act, ctx) {
        if (!CARE_GUIDE()) return false;
        var gctx = careGuideCtx_();
        gctx.el = ctx.el;
        return !!CARE_GUIDE().handleAction(act, gctx);
      },
    });

    reg('close-sheet', function (ctx) {
      if (ctx.el && ctx.el.classList.contains('hlc-sheet-backdrop') && ctx.target && ctx.target !== ctx.el) return;
      closeSheet();
    });
    reg('clear-collection-filters', function () { clearCollectionFilters_(); });
    reg('toggle-batch-mode', function () {
      state.ui.batchMode = !state.ui.batchMode;
      if (!state.ui.batchMode) state.ui.batchSelected = [];
      saveState();
      render();
    });
    reg('batch-select-all', function () {
      state.ui.batchSelected = filteredSortedPets_().map(function (p) { return p.id; });
      saveState();
      render();
    });
    reg('batch-clear', function () {
      state.ui.batchSelected = [];
      saveState();
      render();
    });
    reg('batch-feed', function () {
      var idsFeed = batchSelectedIds_();
      if (!idsFeed.length) return;
      runLowRiskBatchLog_(idsFeed, 'feeding', 'feeding', t('batchFeedDefaultNote'), t('batchFeedDone').replace('{n}', String(idsFeed.length)));
    });
    reg('batch-water', function () {
      var idsWater = batchSelectedIds_();
      if (!idsWater.length) return;
      runLowRiskBatchLog_(idsWater, 'water_change', 'environment', '', t('batchWaterDone').replace('{n}', String(idsWater.length)));
    });
    reg('batch-clean', function () {
      var idsClean = batchSelectedIds_();
      if (!idsClean.length) return;
      runLowRiskBatchLog_(idsClean, 'cage_clean', 'environment', '', t('batchCleanDone').replace('{n}', String(idsClean.length)));
    });
    reg('batch-mist', function () {
      var idsMist = batchSelectedIds_();
      if (!idsMist.length) return;
      runLowRiskBatchLog_(idsMist, 'humidity', 'environment', t('batchMistDefaultNote'), t('batchMistDone').replace('{n}', String(idsMist.length)));
    });
    reg('batch-print-labels', function () {
      var idsLbl = batchSelectedIds_();
      if (idsLbl.length) {
        batchPrintLabels_(idsLbl);
        showToast_(t('batchPrintLabelsDone').replace('{n}', String(idsLbl.length)));
      }
    });
    reg('batch-complete-tasks', function () {
      var idsTasks = batchSelectedIds_();
      if (!idsTasks.length) return;
      runLowRiskBatchCompleteTasks_(idsTasks);
    });
    reg('batch-delete', function () {
      runHighRiskBatchDelete_(batchSelectedIds_());
    });
    reg('undo-batch', function () {
      performBatchUndo_();
    });
    reg('dismiss-health-reminder', function (ctx) {
      dismissHealthReminder_(ctx.el && ctx.el.getAttribute('data-hl-log-id'));
    });
    reg('health-followup-open', function (ctx) {
      var idOpen = ctx.el && ctx.el.getAttribute('data-hl-log-id');
      var ctlOpen = healthFollowUp_();
      if (ctlOpen && idOpen) {
        ctlOpen.markViewed(idOpen);
        var logOpen = (state.careLogs || []).filter(function (l) { return l.id === idOpen; })[0];
        if (logOpen) {
          state.activePetId = logOpen.petId;
          state.phase = 'board';
          state.boardTab = 'logs';
          state.ui.expandedLogId = idOpen;
          saveState();
          render();
        }
      }
    });
    reg('health-followup-handle', function (ctx) {
      var idH = ctx.el && ctx.el.getAttribute('data-hl-log-id');
      if (healthFollowUp_() && idH) healthFollowUp_().openHandle(idH);
    });
    reg('health-followup-commit', function () {
      if (healthFollowUp_()) healthFollowUp_().commitHandled();
    });
    reg('health-followup-defer', function (ctx) {
      var idD = ctx.el && ctx.el.getAttribute('data-hl-log-id');
      var days = (ctx.el && ctx.el.getAttribute('data-hl-defer-days')) || '3';
      if (healthFollowUp_() && idD) healthFollowUp_().defer(idD, days);
    });
    reg('health-followup-observe', function (ctx) {
      var idO = ctx.el && ctx.el.getAttribute('data-hl-log-id');
      if (healthFollowUp_() && idO) healthFollowUp_().observe(idO);
    });
    reg('health-followup-close', function (ctx) {
      var idC = ctx.el && ctx.el.getAttribute('data-hl-log-id');
      if (healthFollowUp_() && idC) healthFollowUp_().close(idC);
    });
    reg('health-notif-enable', function () {
      if (healthFollowUp_()) healthFollowUp_().requestPermissionOnce();
    });
    reg('batch-export', function () {
      var idsExport = batchSelectedIds_();
      if (idsExport.length) {
        exportBatchCsv_(idsExport);
        showToast_(t('batchExportDone').replace('{n}', String(idsExport.length)));
      }
    });
    reg('photo-compare-clear', function () {
      state.ui.photoCompareA = '';
      state.ui.photoCompareB = '';
      saveState();
      render();
    });
    reg('photo-to-timeline', function (ctx) {
      var logId = ctx.el && ctx.el.getAttribute('data-hl-log-id');
      if (logId) {
        state.ui.expandedLogId = logId;
        state.phase = 'board';
        state.boardTab = 'logs';
        saveState();
        render();
      }
    });
    reg('back-collection', function () {
      state.phase = 'collection';
      state.activePetId = null;
      state.boardTab = 'cards';
      state.search = '';
      state.profile = null;
      state.selectedSpeciesId = null;
      state.selectedCareTypeId = null;
      state.ui.sheet = null;
      state.ui.recordId = null;
      state.ui.showMoreRecords = false;
      state.ui.timelineFocusDate = '';
      state.ui.trendDetailDay = '';
      saveState();
      render();
    });
    reg('clear-timeline-focus', function () {
      state.ui.timelineFocusDate = '';
      saveState();
      render();
    });
    reg('back-onboard', function () {
      state.phase = 'onboard';
      state.profile = null;
      state.selectedSpeciesId = null;
      state.selectedCareTypeId = null;
      state.card = defaultState().card;
      saveState();
      render();
    });
    reg('start-create', function () {
      if (state.ui.tourActive) finishIntroTour_();
      if (WIZARD()) {
        WIZARD().startWizard(state);
        state.phase = 'wizard';
        state.search = '';
      } else {
        state.phase = 'onboard';
        state.search = '';
        state.ui.speciesLocal = [];
        state.ui.speciesRemote = [];
        state.ui.speciesLoading = false;
      }
      saveState();
      render();
    });
    reg('complete-profile', function () { completeProfile(); });
    reg('toggle-note', function () {
      state.ui.noteExpanded = !state.ui.noteExpanded;
      saveState();
      render();
    });
    reg('open-reminder-settings', function () {
      state.ui.sheet = 'reminder-settings';
      state.ui.recordId = null;
      state.ui.showMoreRecords = false;
      saveState();
      render();
    });
    reg('more-records', function () {
      state.ui.sheet = 'more';
      state.ui.showMoreRecords = true;
      saveState();
      render();
    });
    reg('save-chips', function () { saveChipLog(); });
    reg('save-photo', function () { savePhotoLog(); });
    reg('save-feeding', function () { saveFeedingLog(); });
    reg('save-env', function () { saveEnvLog_(); });
    reg('save-abnormality', function () { saveAbnormalityLog(); });
    reg('save-instar', function () { saveInstarLog(); });
    reg('save-weight', function () { saveWeightLog(); });
    reg('save-note', function () { saveNoteLog(); });
    reg('save-choice', function () { saveChoiceLog(); });
    reg('export-stub', function () {
      var pPdf = getActivePet();
      if (pPdf) printPetReport_(pPdf);
    });
    reg('export-csv', function () {
      var pCsv = getActivePet();
      if (pCsv) {
        exportPetCsv_(pCsv);
        showToast_(t('exportCsvDone'));
      } else {
        showToast_(t('exportCollectionHint'), 2500);
      }
    });
    reg('export-all-csv', function () {
      exportAllRecordsCsv_();
      showToast_(t('exportAllCsvDone'));
    });
    reg('export-full-backup', function () {
      exportFullBackupJson_();
      showToast_(t('exportFullBackupDone'));
    });
    reg('export-photo-index', function () {
      exportPhotoIndexCsv_();
      showToast_(t('exportPhotoIndexDone'));
    });
    reg('import-backup-pick', function () {
      var pick = global.document.getElementById('hlcImportBackupInput') ||
        global.document.getElementById('hlcImportBackupInputGlobal');
      if (pick) pick.click();
    });
    reg('import-backup-cancel', function () {
      state.ui.sheet = null;
      state.ui.importDraft = null;
      state.ui.importSummary = null;
      saveState();
      render();
    });
    reg('import-backup-merge', function () {
      var apiImp = DATA_EXPORT();
      if (apiImp && state.ui.importDraft) {
        apiImp.applyImport(state, state.ui.importDraft, 'merge', exportHelpers_());
        state.ui.sheet = null;
        state.ui.importDraft = null;
        state.ui.importSummary = null;
        saveState();
        showToast_(t('importDone'));
      }
    });
    reg('import-backup-replace', function () {
      var apiRep = DATA_EXPORT();
      if (!apiRep || !state.ui.importDraft) return;
      if (!confirmHighRisk_(t('importReplaceConfirm'))) return;
      var backup = {
        pets: cloneJson_(state.pets),
        careLogs: cloneJson_(state.careLogs),
        breedingPairs: cloneJson_(state.breedingPairs || []),
        breedingEvents: cloneJson_(state.breedingEvents || []),
        offspring: cloneJson_(state.offspring || []),
      };
      try {
        apiRep.applyImport(state, state.ui.importDraft, 'replace', exportHelpers_());
        state.ui.sheet = null;
        state.ui.importDraft = null;
        state.ui.importSummary = null;
        if (!saveState()) throw new Error('persist_failed');
        clearPendingUndo_();
        showToast_(t('importDone'));
      } catch (e) {
        state.pets = backup.pets || [];
        state.careLogs = backup.careLogs || [];
        state.breedingPairs = backup.breedingPairs || [];
        state.breedingEvents = backup.breedingEvents || [];
        state.offspring = backup.offspring || [];
        try { saveState(); } catch (e2) {}
        showToast_(t('batchWriteFailed'), 3200);
      }
    });
    reg('export-json', function () {
      var pJson = getActivePet();
      if (pJson) {
        exportPetJson_(pJson);
        showToast_(t('exportJsonDone'));
      }
    });
    reg('quick-photo-collection', function () {
      var pPhoto = findTargetPetForCare_();
      if (pPhoto) openQuickRecord(pPhoto.id, 'photo');
      else { state.phase = 'onboard'; saveState(); render(); }
    });
    reg('quick-photo-board', function () {
      var pPhotoBoard = getActivePet();
      if (pPhotoBoard) openQuickRecord(pPhotoBoard.id, 'photo');
      else {
        state.toast = t('selectPetFirst');
        saveState();
        render();
        global.setTimeout(function () { state.toast = null; render(); }, 2200);
      }
    });
    reg('quick-log-collection', function () {
      var pLogCol = findTargetPetForCare_();
      if (pLogCol) {
        state.activePetId = pLogCol.id;
        state.phase = 'board';
        state.boardTab = 'logs';
        saveState();
        render();
      } else { state.phase = 'onboard'; saveState(); render(); }
    });
    reg('quick-log-board', function () {
      var pLogBoard = getActivePet();
      if (pLogBoard) {
        state.boardTab = 'logs';
        saveState();
        render();
      } else {
        state.toast = t('selectPetFirst');
        saveState();
        render();
        global.setTimeout(function () { state.toast = null; render(); }, 2200);
      }
    });
    reg('start-today-care', function () {
      var targetPet = findTargetPetForCare_();
      if (targetPet) {
        state.activePetId = targetPet.id;
        state.phase = 'board';
        state.boardTab = 'cards';
      }
      saveState();
      render();
    });
    reg('close-lightbox', function () {
      state.ui.lightboxUrl = null;
      saveState();
      render();
    });
    reg('start-template', function () {
      state.ui.sheet = 'template-picker';
      state.ui.recordId = null;
      state.ui.showMoreRecords = false;
      state.ui.templatePickBusy = false;
      saveState();
      render();
    });
    reg('wizard-template-pick', function (ctx) {
      if (state.ui.templatePickBusy) return;
      var tplId = (ctx.el && ctx.el.getAttribute('data-hl-template-id')) || '';
      if (!WIZARD() || typeof WIZARD().hasTemplatePreset !== 'function' || !WIZARD().hasTemplatePreset(tplId)) {
        showToast_(t('templateInvalid'), 2600);
        return;
      }
      state.ui.templatePickBusy = true;
      state.ui.sheet = null;
      if (WIZARD().startWizardFromTemplate(state, tplId)) {
        state.phase = 'wizard';
        state.search = '';
        state.ui.templatePickBusy = false;
        saveState();
        render();
      } else {
        state.ui.templatePickBusy = false;
        state.ui.sheet = 'template-picker';
        saveState();
        render();
        showToast_(t('templateInvalid'), 2600);
      }
    });
    reg('wizard-back-to-templates', function () {
      if (state.ui.wizard) state.ui.wizard = null;
      state.phase = 'collection';
      state.ui.sheet = 'template-picker';
      state.ui.templatePickBusy = false;
      saveState();
      render();
    });
    reg('import-qr', function () { openQrImportSheet_(); });
    reg('qr-import-mode', function (ctx) {
      state.ui.qrImportMode = (ctx.el && ctx.el.getAttribute('data-hl-qr-mode')) || 'paste';
      state.ui.qrImportError = '';
      saveState();
      render();
    });
    reg('qr-import-camera', function () { startQrCameraScan_(); });
    reg('qr-import-submit', function () { submitQrImportPreview_(); });
    reg('qr-import-open', function () { commitQrImportOpen_(); });
    reg('qr-import-copy', function () { commitQrImportCopy_(); });
    reg('qr-import-merge', function () { commitQrImportBackup_('merge'); });
    reg('qr-import-replace', function () { commitQrImportBackup_('replace'); });
    reg('qr-import-back', function () {
      state.ui.sheet = 'qr-import';
      state.ui.qrImportDraft = null;
      saveState();
      render();
    });
    reg('qr-import-cancel', function () {
      state.ui.sheet = null;
      state.ui.qrImportDraft = null;
      state.ui.qrImportText = '';
      state.ui.qrImportError = '';
      saveState();
      render();
    });
    reg('start-logging', function () {
      state.phase = 'board';
      state.boardTab = 'cards';
      saveState();
      render();
    });
    reg('open-label', function () {
      state.ui.returnToScan = state.phase === 'scan';
      state.phase = 'label';
      saveState();
      render();
    });
    reg('share-qr', function () {
      var pShare = getActivePet() || state.pets.filter(function (p) { return p.id === state.ui.qrPreviewPetId; })[0];
      if (pShare) {
        if (!pShare.qrUrl) {
          enrichPet(pShare);
          pShare.qrUrl = petQrUrl(pShare.id);
          saveState();
        }
        shareQrLink(pShare);
      }
    });
    reg('back-board', function () {
      if (state.ui.returnToScan) {
        state.phase = 'scan';
        state.ui.returnToScan = false;
      } else {
        state.phase = 'board';
      }
      saveState();
      render();
    });
    reg('scan-full-board', function () {
      state.phase = 'board';
      state.boardTab = 'cards';
      state.ui.pendingReprint = false;
      state.ui.returnToScan = false;
      saveState();
      render();
    });
    reg('label-print', function () { printLabel(); });
    reg('label-png', function () { downloadLabelPng(); });
    reg('copy-qr-link', function () {
      var p1 = getActivePet();
      if (p1) copyQrLink(p1);
    });
    reg('coord-geocode', function () {
      var pGeo = getActivePet();
      if (pGeo) geocodePetAddress_(pGeo);
    });
    reg('coord-gps', function () {
      var pGps = getActivePet();
      if (pGps) useCurrentLocationForPet_(pGps);
    });
    reg('tour-next', function () {
      state.ui.tourStep = Math.min(TOUR_STEPS.length - 1, (state.ui.tourStep || 0) + 1);
      saveState();
      render();
    });
    reg('tour-prev', function () {
      state.ui.tourStep = Math.max(0, (state.ui.tourStep || 0) - 1);
      saveState();
      render();
    });
    reg('tour-skip', function () {
      clearTourTargetPulse_();
      finishIntroTour_();
      render();
    });
    reg('tour-done', function () {
      clearTourTargetPulse_();
      finishIntroTour_();
      render();
    });
    reg('tour-start-add', function () {
      clearTourTargetPulse_();
      finishIntroTour_();
      state.phase = 'onboard';
      state.search = '';
      state.ui.speciesLocal = [];
      state.ui.speciesRemote = [];
      state.ui.speciesLoading = false;
      saveState();
      render();
    });
    reg('none', function () { /* intentional no-op CTA when care is complete */ });
  }

  function dispatchHusbandryAction_(act, ctx) {
    installHusbandryActions_();
    var R = registryApi_();
    if (!R) {
      console.error('[husbandry] MCHusbandryActionRegistry missing');
      showToast_(t('actionFailed'), 2800);
      return false;
    }
    return R.dispatch(act, Object.assign({
      onError: function () {
        showToast_(t('actionFailed'), 2800);
      },
      onUnknown: function (raw) {
        showToast_(t('actionUnknown').replace('{action}', String(raw || '')), 2800);
      },
    }, ctx || {}));
  }

  function bindActions() {
    if (global.__mcHusbandryLogV7) return;
    global.__mcHusbandryLogV7 = true;

    global.document.addEventListener('input', function (ev) {
      var el = ev.target;
      if (!el || !el.closest('#' + ROOT_ID)) return;
      if (el.getAttribute('data-hl-collection-search') !== null) {
        collectionFilters_().search = el.value;
        syncCollectionFiltersToUi_();
        saveState();
        if (collectionSearchTimer_) global.clearTimeout(collectionSearchTimer_);
        collectionSearchTimer_ = global.setTimeout(function () { render(); }, 220);
        return;
      }
      if (el.id === 'mcHlSearch' || el.id === 'mcHlLabelSearch' || el.id === 'mcHlProfileSearch') {
        state.search = el.value;
        saveState();
        if (String(state.search || '').trim().length >= 2) state.ui.speciesLoading = true;
        patchSpeciesSearchUi_();
        if (speciesSearchTimer_) global.clearTimeout(speciesSearchTimer_);
        speciesSearchTimer_ = global.setTimeout(function () {
          runSpeciesSearch_(state.search);
        }, 280);
        return;
      }
      var coordField = el.getAttribute('data-hl-coord-field');
      if (coordField) {
        var petCoord = getActivePet();
        if (petCoord) {
          petCoord[coordField] = el.value;
          saveState();
          patchSpeciesSearchUi_();
        }
        return;
      }
      var f = el.getAttribute('data-hl-field');
      if (f === 'nickname') state.card.nickname = el.value;
      if (f === 'noteText') state.ui.noteText = el.value;
      if (f === 'feedFood') state.ui.feedFood = el.value;
      if (f === 'feedAmount') state.ui.feedAmount = el.value;
      if (f === 'envValue') {
        state.ui.envValue = el.value;
        saveState();
        if (state.ui.sheet && CARE_GUIDE()) {
          if (collectionSearchTimer_) global.clearTimeout(collectionSearchTimer_);
          collectionSearchTimer_ = global.setTimeout(function () { render(); }, 180);
        }
        return;
      }
      if (f === 'guideSearch' && CARE_GUIDE()) {
        if (state.careGuide) {
          state.careGuide.searchKeyword = el.value;
          saveState();
          if (collectionSearchTimer_) global.clearTimeout(collectionSearchTimer_);
          collectionSearchTimer_ = global.setTimeout(function () { render(); }, 220);
        }
        return;
      }
      var wf = el.getAttribute('data-hl-wizard-field');
      if (wf && WIZARD() && state.phase === 'wizard') {
        if (ev.isComposing) return;
        WIZARD().handleField(wf, el.value, state, wizardCtx_());
        if (wizardFieldNeedsBannerRefresh_(wf)) scheduleWizardBannerRefresh_();
        return;
      }
      var we = el.getAttribute('data-hl-wizard-env');
      if (we && WIZARD() && state.phase === 'wizard') {
        WIZARD().handleEnvField(we, el.value, state, wizardCtx_());
        return;
      }
      if (f === 'healthSymptoms') state.ui.healthSymptoms = el.value;
      if (f === 'healthTreatment') state.ui.healthTreatment = el.value;
      if (f === 'healthDiscoveredAt') state.ui.healthDiscoveredAt = el.value;
      if (f === 'healthFollowUpDate') state.ui.healthFollowUpDate = el.value;
      if (f === 'healthHandleResult') state.ui.healthHandleResult = el.value;
      if (f === 'healthHandleNextDate') state.ui.healthHandleNextDate = el.value;
      if (f === 'qrImportText') state.ui.qrImportText = el.value;
      if (f === 'feedUnit') state.ui.feedUnit = el.value;
      if (f === 'logDate') state.ui.logDate = el.value;
      var petField = el.getAttribute && el.getAttribute('data-hl-pet-field');
      if (petField) {
        var petFieldPet = getActivePet();
        if (petFieldPet) {
          petFieldPet[petField] = el.value;
          saveState();
        }
        return;
      }
      var breedField = el.getAttribute && el.getAttribute('data-hl-breed-field');
      if (breedField && BREEDING()) {
        BREEDING().handleField(state, breedField, el.type === 'checkbox' ? el.checked : el.value, el);
        saveState();
        if (el.type === 'checkbox' || el.tagName === 'SELECT') render();
        return;
      }
      saveState();
    });

    global.document.addEventListener('compositionend', function (ev) {
      var el = ev.target;
      if (!el || !el.closest('#' + ROOT_ID)) return;
      var wf = el.getAttribute('data-hl-wizard-field');
      if (!wf || !WIZARD() || state.phase !== 'wizard') return;
      WIZARD().handleField(wf, el.value, state, wizardCtx_());
      if (wizardFieldNeedsBannerRefresh_(wf)) scheduleWizardBannerRefresh_();
    });

    global.document.addEventListener('focusout', function (ev) {
      var el = ev.target;
      if (!el || !el.closest('#' + ROOT_ID)) return;
      var wf = el.getAttribute('data-hl-wizard-field');
      if (!wf || !WIZARD() || state.phase !== 'wizard') return;
      if (!wizardFieldNeedsBannerRefresh_(wf)) return;
      WIZARD().handleField(wf, el.value, state, wizardCtx_());
      scheduleWizardBannerRefresh_();
    }, true);

    global.document.addEventListener('change', function (ev) {
      var el = ev.target;
      if (!el || !el.closest('#' + ROOT_ID)) return;
      if (el.getAttribute('data-hl-photo')) {
        compressPhoto(el.files && el.files[0], function (url) {
          if (!url) return;
          var kind = el.getAttribute('data-hl-photo');
          if (kind === 'capture' || kind === 'upload') state.card.profilePhoto = url;
          else state.ui.photoUrl = url;
          saveState(); render();
        });
        return;
      }
      if (el.getAttribute('data-hl-field') === 'healthReminder') {
        state.ui.healthReminder = !!el.checked;
        if (el.checked && !state.ui.healthFollowUpDate) {
          var dFu = new Date();
          dFu.setDate(dFu.getDate() + 7);
          state.ui.healthFollowUpDate = dFu.toISOString().slice(0, 10);
        }
        saveState();
        render();
        return;
      }
      if (el.getAttribute('data-hl-field') === 'healthHandleNext') {
        state.ui.healthHandleNext = !!el.checked;
        if (el.checked && !state.ui.healthHandleNextDate) {
          var dNx = new Date();
          dNx.setDate(dNx.getDate() + 7);
          state.ui.healthHandleNextDate = dNx.toISOString().slice(0, 10);
        }
        saveState();
        render();
        return;
      }
      if (el.getAttribute('data-hl-health-link')) {
        var linkId = el.getAttribute('data-hl-health-link');
        if (!Array.isArray(state.ui.healthLinkedLogIds)) state.ui.healthLinkedLogIds = [];
        var li = state.ui.healthLinkedLogIds.indexOf(linkId);
        if (el.checked && li < 0) state.ui.healthLinkedLogIds.push(linkId);
        if (!el.checked && li >= 0) state.ui.healthLinkedLogIds.splice(li, 1);
        return;
      }
      if (el.getAttribute('data-hl-wizard-photo')) {
        compressPhoto(el.files && el.files[0], function (url) {
          if (!url || !state.ui.wizard) return;
          state.ui.wizard.profilePhoto = url;
          saveState(); render();
        });
        return;
      }
      var wRec = el.getAttribute('data-hl-wizard-record');
      if (wRec && WIZARD() && state.phase === 'wizard') {
        WIZARD().handleToggle('record', wRec, !!el.checked, state, wizardCtx_());
        render();
        return;
      }
      var wQuest = el.getAttribute('data-hl-wizard-quest');
      if (wQuest && WIZARD() && state.phase === 'wizard') {
        WIZARD().handleToggle('quest', wQuest, !!el.checked, state, wizardCtx_());
        render();
        return;
      }
      var wConf = el.getAttribute('data-hl-wizard-confirm');
      if (wConf && WIZARD() && state.phase === 'wizard') {
        WIZARD().handleToggle('confirm', wConf, !!el.checked, state, wizardCtx_());
        return;
      }
      if (el.getAttribute('data-hl-pet-field') === 'careReminder') {
        var petRem = getActivePet();
        if (petRem) {
          petRem.careReminder = !!el.checked;
          saveState();
        }
        return;
      }
      var breedFieldCh = el.getAttribute('data-hl-breed-field');
      if (breedFieldCh && BREEDING()) {
        BREEDING().handleField(state, breedFieldCh, el.type === 'checkbox' ? el.checked : el.value, el);
        saveState();
        render();
        return;
      }
      var cf = el.getAttribute('data-hl-field');
      if (cf === 'feedUnit') {
        state.ui.feedUnit = el.value;
        saveState();
      }
      if (el.getAttribute('data-hl-import-backup') !== null) {
        var file = el.files && el.files[0];
        el.value = '';
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          var api = DATA_EXPORT();
          if (!api) return;
          try {
            var payload = api.parseImportPayload(String(reader.result || ''));
            state.ui.importDraft = payload;
            state.ui.importSummary = api.summarizeImport(payload);
            state.ui.sheet = 'import-backup';
            saveState();
            render();
          } catch (readErr) {
            showToast_(t('importFailed'), 2800);
          }
        };
        reader.readAsText(file);
        return;
      }
      if (el.getAttribute('data-hl-collection-sort') !== null) {
        collectionFilters_().sort = el.value;
        syncCollectionFiltersToUi_();
        saveState();
        render();
      }
      if (el.getAttribute('data-hl-collection-category') !== null) {
        collectionFilters_().category = el.value;
        saveState();
        render();
      }
      if (el.getAttribute('data-hl-collection-stage') !== null) {
        collectionFilters_().lifeStage = el.value;
        saveState();
        render();
      }
      if (el.getAttribute('data-hl-trend-range') !== null) {
        return;
      }
      if (el.getAttribute('data-hl-batch-select') !== null) {
        toggleBatchSelect_(el.getAttribute('data-hl-batch-select'), !!el.checked);
      }
      if (el.getAttribute('data-hl-photo-slider') !== null) {
        var pct = parseInt(el.value, 10) || 50;
        var frame = el.closest('.hlc-photo-compare__frame');
        if (frame) {
          var imgB = frame.querySelector('.hlc-photo-compare__img--b');
          if (imgB) imgB.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
        }
      }
    });

    global.document.addEventListener('click', function (ev) {
      var el = ev.target;
      if (!isHlUiEvent_(el)) return;

      var actEl = el.closest('[data-hl-action]');
      /* Clicks inside the sheet bubble to backdrop's close-sheet — ignore that wrapper. */
      if (actEl && actEl.classList.contains('hlc-sheet-backdrop') && el.closest('.hlc-sheet')) {
        actEl = null;
      }
      if (actEl) {
        ev.preventDefault();
        var act = actEl.getAttribute('data-hl-action');
        dispatchHusbandryAction_(act, {
          el: actEl,
          event: ev,
          target: el,
        });
        return;
      }

      var homeTodo = el.closest('[data-hl-home-todo-pet]');
      if (homeTodo) {
        ev.preventDefault();
        ev.stopPropagation();
        var todoPetId = homeTodo.getAttribute('data-hl-home-todo-pet');
        var todoRec = homeTodo.getAttribute('data-hl-home-todo-record');
        if (todoRec) openQuickRecord(todoPetId, todoRec);
        else {
          state.activePetId = todoPetId;
          state.phase = 'board';
          state.boardTab = 'cards';
          saveState();
          render();
        }
        return;
      }

      var openPet = el.closest('[data-hl-open-pet]');
      if (openPet) {
        ev.preventDefault();
        state.activePetId = openPet.getAttribute('data-hl-open-pet');
        state.phase = 'board';
        state.boardTab = 'cards';
        saveState(); render();
        return;
      }

      var quickPhoto = el.closest('[data-hl-quick-photo]');
      if (quickPhoto) {
        ev.preventDefault();
        ev.stopPropagation();
        openQuickRecord(quickPhoto.getAttribute('data-hl-quick-photo'), 'photo');
        return;
      }

      var quickFeed = el.closest('[data-hl-quick-feed]');
      if (quickFeed) {
        ev.preventDefault();
        ev.stopPropagation();
        openQuickRecord(quickFeed.getAttribute('data-hl-quick-feed'), 'feeding');
        return;
      }

      var envNum = el.closest('[data-hl-env-num]');
      if (envNum) {
        ev.preventDefault();
        state.ui.envValue = envNum.getAttribute('data-hl-env-num');
        saveState();
        render();
        return;
      }

      var envStatus = el.closest('[data-hl-env-status]');
      if (envStatus) {
        ev.preventDefault();
        state.ui.envStatus = envStatus.getAttribute('data-hl-env-status');
        saveState();
        render();
        return;
      }

      var quickLog = el.closest('[data-hl-quick-log]');
      if (quickLog) {
        ev.preventDefault();
        ev.stopPropagation();
        openQuickRecord(quickLog.getAttribute('data-hl-quick-log'), 'insect_status');
        return;
      }

      var openLabel = el.closest('[data-hl-open-label]');
      if (openLabel) {
        ev.preventDefault();
        ev.stopPropagation();
        openLabelForPet(openLabel.getAttribute('data-hl-open-label'));
        return;
      }

      var showQr = el.closest('[data-hl-show-qr]');
      if (showQr) {
        ev.preventDefault();
        ev.stopPropagation();
        var qrPetId = showQr.getAttribute('data-hl-show-qr');
        var pQrCard = state.pets.filter(function (p) { return p.id === qrPetId; })[0];
        if (pQrCard) openQrPreviewSheet_(pQrCard);
        return;
      }

      var careType = el.closest('[data-hl-care-type]');
      if (careType) {
        ev.preventDefault();
        var typeId = careType.getAttribute('data-hl-care-type');
        var catApi = CATEGORIES();
        state.selectedCareTypeId = typeId;
        state.profile = catApi ? catApi.buildProfileFromCareType(typeId, lang()) : null;
        state.selectedSpeciesId = null;
        state.phase = 'profile';
        saveState(); render();
        return;
      }

      var toggleGrp = el.closest('[data-hl-toggle-group]');
      if (toggleGrp) {
        ev.preventDefault();
        var gid = toggleGrp.getAttribute('data-hl-toggle-group');
        state.expandedGroupId = state.expandedGroupId === gid ? null : gid;
        saveState(); render();
        return;
      }

      var labelTpl = el.closest('[data-hl-label-tpl]');
      if (labelTpl) {
        ev.preventDefault();
        var petLt = getActivePet();
        if (petLt) {
          if (!petLt.labelSettings) petLt.labelSettings = defaultLabelSettings();
          petLt.labelSettings.template = labelTpl.getAttribute('data-hl-label-tpl');
          state.ui.labelTemplate = petLt.labelSettings.template;
          saveState(); render();
        }
        return;
      }

      var privBtn = el.closest('[data-hl-privacy]');
      if (privBtn) {
        ev.preventDefault();
        var petPr = getActivePet();
        if (petPr) {
          petPr.privacy = privBtn.getAttribute('data-hl-privacy');
          saveState(); render();
        }
        return;
      }

      var questBtn = el.closest('[data-hl-quest]');
      if (questBtn) {
        ev.preventDefault();
        toggleQuest(questBtn.getAttribute('data-hl-pet-id'), questBtn.getAttribute('data-hl-quest'));
        return;
      }

      var questSkip = el.closest('[data-hl-quest-skip]');
      if (questSkip) {
        ev.preventDefault();
        ev.stopPropagation();
        toggleQuestSkip(questSkip.getAttribute('data-hl-pet-id'), questSkip.getAttribute('data-hl-quest-skip'));
        return;
      }

      var logEdit = el.closest('[data-hl-log-edit]');
      if (logEdit) {
        ev.preventDefault();
        openLogForEdit_(logEdit.getAttribute('data-hl-log-edit'));
        return;
      }

      var logDelete = el.closest('[data-hl-log-delete]');
      if (logDelete) {
        ev.preventDefault();
        state.ui.confirmDeleteLogId = logDelete.getAttribute('data-hl-log-delete');
        saveState();
        render();
        return;
      }

      var logDeleteConfirm = el.closest('[data-hl-log-delete-confirm]');
      if (logDeleteConfirm) {
        ev.preventDefault();
        deleteLog_(logDeleteConfirm.getAttribute('data-hl-log-delete-confirm'));
        state.ui.confirmDeleteLogId = '';
        return;
      }

      var logDeleteCancel = el.closest('[data-hl-log-delete-cancel]');
      if (logDeleteCancel) {
        ev.preventDefault();
        state.ui.confirmDeleteLogId = '';
        saveState();
        render();
        return;
      }

      var logExpand = el.closest('[data-hl-log-expand]');
      if (logExpand) {
        ev.preventDefault();
        var lid = logExpand.getAttribute('data-hl-log-expand');
        state.ui.expandedLogId = state.ui.expandedLogId === lid ? '' : lid;
        saveState();
        render();
        return;
      }

      var sevBtn = el.closest('[data-hl-severity]');
      if (sevBtn) {
        ev.preventDefault();
        state.ui.severity = sevBtn.getAttribute('data-hl-severity');
        saveState();
        render();
        return;
      }

      var rec = el.closest('[data-hl-record]');
      if (rec) {
        ev.preventDefault();
        ev.stopPropagation();
        state.ui.showMoreRecords = false;
        openRecord(rec.getAttribute('data-hl-record'));
        return;
      }

      var tab = el.closest('[data-hl-board-tab]');
      if (tab) { ev.preventDefault(); state.boardTab = tab.getAttribute('data-hl-board-tab'); saveState(); render(); return; }

      function resolveTaxonomyPick_(idx) {
        var hit = (state.ui.speciesRemote || [])[idx];
        var searchApi = SPECIES_SEARCH();
        var api = PROFILES();
        if (hit && hit.localSpeciesId && api) {
          return { speciesId: hit.localSpeciesId, profile: api.getProfile(hit.localSpeciesId) };
        }
        return {
          speciesId: null,
          profile: searchApi && hit ? searchApi.getProfileFromTaxonomyHit(hit) : null,
        };
      }

      var pick = el.closest('[data-hl-pick]');
      if (pick) {
        ev.preventDefault();
        var api = PROFILES();
        state.selectedSpeciesId = pick.getAttribute('data-hl-pick');
        state.profile = api ? api.getProfile(state.selectedSpeciesId) : null;
        state.phase = 'profile';
        saveState(); render();
        return;
      }

      var taxPick = el.closest('[data-hl-taxonomy-idx]');
      if (taxPick) {
        ev.preventDefault();
        var idx = parseInt(taxPick.getAttribute('data-hl-taxonomy-idx'), 10);
        var resolved = resolveTaxonomyPick_(idx);
        state.selectedSpeciesId = resolved.speciesId;
        state.profile = resolved.profile;
        if (state.profile) {
          state.phase = 'profile';
          saveState();
          render();
        }
        return;
      }

      var profilePick = el.closest('[data-hl-profile-pick]');
      if (profilePick) {
        ev.preventDefault();
        var apiPp = PROFILES();
        var pid = profilePick.getAttribute('data-hl-profile-pick');
        var profPp = apiPp ? apiPp.getProfile(pid) : null;
        if (profPp) applySpeciesToDraft(profPp, pid);
        return;
      }

      var profileTax = el.closest('[data-hl-profile-tax]');
      if (profileTax) {
        ev.preventDefault();
        var idxP = parseInt(profileTax.getAttribute('data-hl-profile-tax'), 10);
        var resP = resolveTaxonomyPick_(idxP);
        if (resP.profile) applySpeciesToDraft(resP.profile, resP.speciesId);
        return;
      }

      var labelSpecPick = el.closest('[data-hl-label-spec-pick]');
      if (labelSpecPick) {
        ev.preventDefault();
        var petSp = getActivePet();
        var apiSp = PROFILES();
        var spId = labelSpecPick.getAttribute('data-hl-label-spec-pick');
        var profSp = apiSp ? apiSp.getProfile(spId) : null;
        if (petSp && profSp) {
          state.search = '';
          state.ui.speciesLocal = [];
          state.ui.speciesRemote = [];
          applySpeciesToPet(petSp, profSp, spId);
        }
        return;
      }

      var labelSpecTax = el.closest('[data-hl-label-spec-tax]');
      if (labelSpecTax) {
        ev.preventDefault();
        var idxL = parseInt(labelSpecTax.getAttribute('data-hl-label-spec-tax'), 10);
        var resL = resolveTaxonomyPick_(idxL);
        var petLtSp = getActivePet();
        if (petLtSp && resL.profile) {
          state.search = '';
          state.ui.speciesLocal = [];
          state.ui.speciesRemote = [];
          applySpeciesToPet(petLtSp, resL.profile, resL.speciesId);
        }
        return;
      }

      var cat = el.closest('[data-hl-cat]');
      if (cat) { ev.preventDefault(); state.category = cat.getAttribute('data-hl-cat'); saveState(); render(); return; }

      var chip = el.closest('[data-hl-chip]');
      if (chip) {
        ev.preventDefault();
        if (chip.getAttribute('data-hl-chip') === 'photoType') state.ui.photoType = chip.getAttribute('data-hl-value');
        saveState(); render();
        return;
      }

      var st = el.closest('[data-hl-status-key]');
      if (st) {
        ev.preventDefault();
        state.ui.statusDraft[st.getAttribute('data-hl-status-key')] = st.getAttribute('data-hl-status-value');
        saveState(); render();
        return;
      }

      var inst = el.closest('[data-hl-instar]');
      if (inst) { ev.preventDefault(); state.ui.instarValue = inst.getAttribute('data-hl-instar'); saveState(); render(); return; }

      var ab = el.closest('[data-hl-abnormal]');
      if (ab) { ev.preventDefault(); state.ui.abnormalValue = ab.getAttribute('data-hl-abnormal'); saveState(); render(); return; }

      var feedChip = el.closest('[data-hl-feed]');
      if (feedChip) { ev.preventDefault(); state.ui.feedValue = feedChip.getAttribute('data-hl-feed'); saveState(); render(); return; }

      var suppChip = el.closest('[data-hl-supplement]');
      if (suppChip) { ev.preventDefault(); state.ui.feedSupplement = suppChip.getAttribute('data-hl-supplement'); saveState(); render(); return; }

      var homeFilter = el.closest('[data-hl-home-filter]');
      if (homeFilter) {
        ev.preventDefault();
        collectionFilters_().status = homeFilter.getAttribute('data-hl-home-filter');
        syncCollectionFiltersToUi_();
        saveState();
        render();
        return;
      }

      var trendRangeBtn = el.closest('[data-hl-trend-range]');
      if (trendRangeBtn) {
        ev.preventDefault();
        state.ui.trendRange = parseInt(trendRangeBtn.getAttribute('data-hl-trend-range'), 10) || 7;
        state.ui.trendDetailDay = '';
        saveState();
        refreshTrendsPanel_();
        return;
      }

      var trendDayBtn = el.closest('[data-hl-trend-day]');
      if (trendDayBtn) {
        ev.preventDefault();
        var dayKey = trendDayBtn.getAttribute('data-hl-trend-day') || '';
        if (state.ui.trendDetailDay === dayKey) {
          state.ui.timelineFocusDate = dayKey;
          state.boardTab = 'logs';
          state.ui.trendDetailDay = '';
          saveState();
          render();
          return;
        }
        state.ui.trendDetailDay = dayKey;
        saveState();
        refreshTrendsPanel_();
        return;
      }

      var trendOpenDay = el.closest('[data-hl-trend-open-day]');
      if (trendOpenDay) {
        ev.preventDefault();
        state.ui.timelineFocusDate = trendOpenDay.getAttribute('data-hl-trend-open-day') || '';
        state.boardTab = 'logs';
        state.ui.trendDetailDay = '';
        saveState();
        render();
        return;
      }

      var batchWrap = el.closest('[data-hl-batch-wrap]');
      if (batchWrap) {
        ev.stopPropagation();
        return;
      }

      var batchSelectBtn = el.closest('[data-hl-batch-select]');
      if (batchSelectBtn && batchSelectBtn.tagName === 'INPUT') {
        ev.stopPropagation();
        return;
      }

      var scanTabBtn = el.closest('[data-hl-scan-tab]');
      if (scanTabBtn) {
        ev.preventDefault();
        state.ui.scanTab = scanTabBtn.getAttribute('data-hl-scan-tab');
        saveState();
        render();
        return;
      }

      var photoWallFilterBtn = el.closest('[data-hl-photo-wall-filter]');
      if (photoWallFilterBtn) {
        ev.preventDefault();
        state.ui.photoWallFilter = photoWallFilterBtn.getAttribute('data-hl-photo-wall-filter');
        saveState();
        render();
        return;
      }

      var photoCompareBtn = el.closest('[data-hl-photo-compare]');
      if (photoCompareBtn) {
        ev.preventDefault();
        var url = photoCompareBtn.getAttribute('data-hl-photo-compare');
        if (!state.ui.photoCompareA) state.ui.photoCompareA = url;
        else if (!state.ui.photoCompareB && state.ui.photoCompareA !== url) state.ui.photoCompareB = url;
        else {
          state.ui.photoCompareA = url;
          state.ui.photoCompareB = '';
        }
        saveState();
        render();
        return;
      }

      var lightboxBtn = el.closest('[data-hl-photo-lightbox]');
      if (lightboxBtn) {
        ev.preventDefault();
        state.ui.lightboxUrl = lightboxBtn.getAttribute('data-hl-photo-lightbox');
        saveState();
        render();
        return;
      }

      var lifeStageBtn = el.closest('[data-hl-life-stage]');
      if (lifeStageBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        var petLs = getActivePet();
        if (petLs) setPetLifeStage(petLs, lifeStageBtn.getAttribute('data-hl-life-stage'));
        return;
      }

      var cardLifeStageBtn = el.closest('[data-hl-card-life-stage]');
      if (cardLifeStageBtn) {
        ev.preventDefault();
        state.card.lifeStage = cardLifeStageBtn.getAttribute('data-hl-card-life-stage');
        saveState();
        render();
        return;
      }

      var choiceBtn = el.closest('[data-hl-choice]');
      if (choiceBtn) {
        ev.preventDefault();
        state.ui.choiceValue = choiceBtn.getAttribute('data-hl-choice');
        saveState();
        render();
        return;
      }
    });

    function rerenderIfVisible() {
      var shell = global.document.getElementById(SHELL_ID);
      if (shell && !shell.hidden) render();
    }
    global.addEventListener('mc:localechange', rerenderIfVisible);
    global.addEventListener('mc:locale', rerenderIfVisible);
    global.addEventListener('hashchange', function () {
      var shell = global.document.getElementById(SHELL_ID);
      if (!shell || shell.hidden) return;
      applyDeepLink();
      render();
    });
    if (!global.__mcHlTourResize) {
      global.__mcHlTourResize = true;
      global.addEventListener('resize', function () {
        if (state.ui.tourActive) positionTourSpotlight_();
      });
      global.addEventListener('scroll', function () {
        if (state.ui.tourActive) positionTourSpotlight_();
      }, true);
    }
  }

  function mountShell() {
    var shell = global.document.getElementById(SHELL_ID);
    var sec = global.document.getElementById('section-husbandry-log');
    if (shell) {
      shell.hidden = false;
      /* Prompt 09: living-green tool accent via Museum OS bridge; status colors stay semantic. */
      try {
        shell.classList.add('mco-token-bridge', 'hlc-bridge');
      } catch (eBridge) {}
      try {
        var honestyId = 'mcHusbandryLocalOnlyBanner';
        var existing = global.document.getElementById(honestyId);
        if (!existing) {
          var banner = global.document.createElement('div');
          banner.id = honestyId;
          banner.setAttribute('role', 'status');
          banner.setAttribute('data-testid', 'husbandry-as-local-only');
          banner.style.cssText =
            'margin:0.75rem 1rem;padding:0.65rem 0.85rem;border-radius:10px;border:1px solid rgba(183,121,31,0.45);background:rgba(183,121,31,0.12);font-size:0.875rem;';
          var msg =
            typeof global.mcPick === 'function'
              ? global.mcPick({
                  zh: '飼育紀錄只儲存在此瀏覽器，不會與手機或其他裝置自動同步。請使用匯出／匯入轉移。',
                  en: 'Husbandry records stay only in this browser and do not auto-sync with mobile or other devices. Use export/import to transfer.',
                  ja: '飼育記録はこのブラウザのみに保存され、モバイル他端末とは自動同期しません。移行にはエクスポート／インポートを使用してください。',
                  de: 'Haltungsprotokolle bleiben nur in diesem Browser und synchronisieren nicht automatisch mit Mobile oder anderen Geräten. Export/Import zur Übertragung nutzen.',
                })
              : 'Husbandry records stay only in this browser and do not auto-sync with mobile or other devices.';
          banner.textContent = msg;
          shell.insertBefore(banner, shell.firstChild);
        }
      } catch (eHonesty) {}
    }
    if (sec) { sec.classList.add('active'); try { sec.inert = false; } catch (e) {} }
    loadState();
    healthFollowUpCtl_ = null;
    if (healthFollowUp_()) healthFollowUp_().onBoot();
    if (OFFLINE()) {
      OFFLINE().init();
      state.ui.offlineOnline = OFFLINE().isOnline();
      OFFLINE().subscribe(function (online) {
        state.ui.offlineOnline = online;
        render();
      });
    }
    applyDeepLink();
    render();
    bindActions();
  }

  function hideShell() {
    var shell = global.document.getElementById(SHELL_ID);
    if (shell) shell.hidden = true;
  }

  function refreshHusbandryLogI18n() {
    var shell = global.document.getElementById(SHELL_ID);
    if (!shell || shell.hidden) return;
    render();
  }

  global.refreshHusbandryLogI18n = refreshHusbandryLogI18n;

  global.renderHusbandryLogRoute_ = function () {
    try { if (typeof global.enterApp === 'function') global.enterApp(); } catch (e) {}
    try { if (typeof global.switchSection === 'function') global.switchSection('husbandry-log'); } catch (e2) {}
    mountShell();
  };

  try {
    if (global.MCRoute && global.MCRoute.subscribe) {
      global.MCRoute.subscribe(function (name) {
        if (name === 'husbandry-log') {
          try { global.location.hash = '#/section/husbandry-log'; } catch (eH) {}
          mountShell();
        } else hideShell();
      });
    }
  } catch (eSub) {}

  global.MCHusbandryLog = { mount: mountShell, hideShell: hideShell, render: render, reset: function () { state = defaultState(); saveState(); render(); } };
})(typeof window !== 'undefined' ? window : this);
