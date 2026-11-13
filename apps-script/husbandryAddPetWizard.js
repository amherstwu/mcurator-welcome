/**
 * Husbandry Log — Add Pet Wizard
 */
(function (global) {
  'use strict';

  var CARE = function () { return global.MCHusbandryCareGuide || null; };

  var WIZARD_CATEGORIES = [
    'amphibians',
    'insects_beetles',
    'reptiles',
    'freshwater_aquatics',
    'marine_aquatics',
    'birds',
    'small_mammals',
    'arthropod_exotics',
    'plants_terrarium',
    'general',
  ];

  var WIZARD_LIFE_STAGES = [
    'egg', 'juvenile', 'larva', 'nymph', 'pupa', 'subadult', 'adult', 'senior', 'breeding', 'unknown',
  ];

  var ENV_GROUPS = {
    amphibian: ['temperature', 'humidity', 'waterSource', 'substrate', 'hide'],
    aquatic: ['water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change'],
    beetle: ['substrate', 'humidity', 'food', 'climb', 'pairing'],
    reptile: ['hotspot', 'cool_zone', 'humidity', 'uvb', 'calcium', 'hide'],
    bird: ['cage', 'food', 'water', 'perch', 'weight_log'],
    mammal: ['cage', 'bedding', 'water', 'food', 'wheel', 'clean_cycle'],
    arthropod: ['humidity', 'ventilation', 'hide', 'escape_proof', 'molt_space'],
    terrarium: ['humidity', 'ventilation', 'lighting', 'plants', 'drainage'],
    general: ['temperature', 'humidity', 'note'],
  };

  var TEMPLATE_PRESETS = {
    reptile: { guideCategory: 'reptiles', lifeStage: 'juvenile' },
    amphibian: { guideCategory: 'amphibians', lifeStage: 'juvenile' },
    insect: { guideCategory: 'insects_beetles', lifeStage: 'adult' },
    beetle_larva: { guideCategory: 'insects_beetles', lifeStage: 'larva' },
    beetle_adult: { guideCategory: 'insects_beetles', lifeStage: 'adult' },
    arthropod: { guideCategory: 'arthropod_exotics', lifeStage: 'juvenile' },
    freshwater: { guideCategory: 'freshwater_aquatics', lifeStage: 'juvenile' },
    marine: { guideCategory: 'marine_aquatics', lifeStage: 'juvenile' },
    bird: { guideCategory: 'birds', lifeStage: 'juvenile' },
    mammal: { guideCategory: 'small_mammals', lifeStage: 'juvenile' },
    plant: { guideCategory: 'plants_terrarium', lifeStage: 'juvenile' },
    custom: { guideCategory: 'general', lifeStage: 'unknown' },
    gecko: { guideCategory: 'reptiles', lifeStage: 'juvenile' },
  };

  function listTemplatePresets_() {
    return [
      { id: 'reptile', key: 'templateReptile' },
      { id: 'amphibian', key: 'templateAmphibian' },
      { id: 'insect', key: 'templateInsect' },
      { id: 'beetle_larva', key: 'templateBeetleLarva' },
      { id: 'arthropod', key: 'templateArthropod' },
      { id: 'freshwater', key: 'templateFreshwater' },
      { id: 'marine', key: 'templateMarine' },
      { id: 'bird', key: 'templateBird' },
      { id: 'mammal', key: 'templateMammal' },
      { id: 'plant', key: 'templatePlant' },
      { id: 'custom', key: 'templateCustom' },
    ];
  }

  function hasTemplatePreset_(presetId) {
    return !!(presetId && TEMPLATE_PRESETS[presetId]);
  }

  function defaultWizardState_() {
    return {
      step: 1,
      petName: '',
      commonName: '',
      scientificName: '',
      profilePhoto: '',
      source: '',
      specimenPassportId: '',
      startDate: '',
      guideCategory: '',
      categoryManual: false,
      lifeStage: 'juvenile',
      careGuideId: null,
      applyGuide: true,
      envSetup: {},
      envSkipped: false,
      selectedRecords: [],
      selectedQuests: [],
      customQuests: [],
      customQuestDraft: '',
      recordsInitialized: false,
      initTutorial: true,
      createQr: true,
      addHomeReminder: true,
      showGuideDetail: false,
      matchDetected: false,
      guideManualPick: false,
    };
  }

  function ensureWizard_(state) {
    if (!state.ui) state.ui = {};
    if (!state.ui.wizard || typeof state.ui.wizard !== 'object') {
      state.ui.wizard = defaultWizardState_();
    }
    var w = state.ui.wizard;
    if (!w.envSetup) w.envSetup = {};
    if (!Array.isArray(w.selectedRecords)) w.selectedRecords = [];
    if (!Array.isArray(w.selectedQuests)) w.selectedQuests = [];
    if (!Array.isArray(w.customQuests)) w.customQuests = [];
    return w;
  }

  function draftPet_(w) {
    return {
      petName: w.petName || '',
      commonName: w.commonName || '',
      chineseName: w.commonName || '',
      scientificName: w.scientificName || '',
      category: w.guideCategory || '',
      careTypeKey: w.guideCategory || '',
      lifeStage: w.lifeStage === 'larva' ? 'larva' : w.lifeStage,
      instarLabel: w.lifeStage === 'larva' ? 'larva' : '',
    };
  }

  function draftPetWithGuide_(w) {
    var d = draftPet_(w);
    if (w.applyGuide !== false && w.careGuideId) d.careGuideId = w.careGuideId;
    return d;
  }

  function syncWizardMatch_(state, h) {
    var w = ensureWizard_(state);
    if (CARE()) CARE().ensureState(state, h);
    var draft = draftPet_(w);
    var guideId = CARE() ? CARE().matchCareGuideForPet(draft) : 'general_care';
    if (!w.guideManualPick) {
      w.careGuideId = guideId;
      w.matchDetected = guideId !== 'general_care';
    } else {
      w.matchDetected = w.careGuideId && w.careGuideId !== 'general_care';
    }
    if (!w.categoryManual && CARE()) {
      w.guideCategory = CARE().inferCategoryForPet(draft);
    }
    if (w.applyGuide !== false) w.applyGuide = true;
    return w;
  }

  function guideForWizard_(state, h) {
    syncWizardMatch_(state, h);
    var w = ensureWizard_(state);
    if (!CARE() || !w.careGuideId) return null;
    CARE().ensureState(state, h);
    return CARE().getGuideById(state, w.careGuideId);
  }

  function initStepSelections_(state, h) {
    var w = ensureWizard_(state);
    if (!CARE() || w.recordsInitialized) return;
    var draft = draftPetWithGuide_(w);
    w.selectedRecords = CARE().getRecommendedRecordsForPet(state, draft, h);
    w.selectedQuests = CARE().getSuggestedTasksForPet(state, draft, h);
    w.recordsInitialized = true;
  }

  function renderPreviewNotice_(h) {
    return (
      '<p class="hlc-wizard-preview-notice" role="note">' + h.esc(h.t('wizardPreviewNotice')) + '</p>'
    );
  }

  function envGroupForCategory_(cat) {
    if (cat === 'amphibians') return 'amphibian';
    if (cat === 'insects_beetles') return 'beetle';
    if (cat === 'reptiles') return 'reptile';
    if (cat === 'freshwater_aquatics' || cat === 'marine_aquatics') return 'aquatic';
    if (cat === 'birds') return 'bird';
    if (cat === 'small_mammals') return 'mammal';
    if (cat === 'arthropod_exotics') return 'arthropod';
    if (cat === 'plants_terrarium') return 'terrarium';
    return 'general';
  }

  function stepLabels_(h) {
    return [
      h.t('wizardStep1'),
      h.t('wizardStep2'),
      h.t('wizardStep3'),
      h.t('wizardStep4'),
      h.t('wizardStep5'),
      h.t('wizardStep6'),
    ];
  }

  function renderStepper_(w, h) {
    var labels = stepLabels_(h);
    var html = labels.map(function (label, idx) {
      var n = idx + 1;
      var cls = 'hlc-wizard-step';
      if (n === w.step) cls += ' is-current';
      else if (n < w.step) cls += ' is-done';
      return (
        '<div class="' + cls + '">' +
        '<span class="hlc-wizard-step__num">' + String(n) + '</span>' +
        '<span class="hlc-wizard-step__label">' + h.esc(label) + '</span></div>'
      );
    }).join('');
    return '<nav class="hlc-wizard-stepper" aria-label="' + h.esc(h.t('wizardNavLabel')) + '">' + html + '</nav>';
  }

  function renderMatchBanner_(w, h, guide) {
    if (!w.petName && !w.commonName && !w.scientificName) return '';
    if (w.matchDetected && guide) {
      return (
        '<div class="hlc-wizard-match hlc-wizard-match--ok" data-hl-wizard-match>' +
        '<strong>' + h.esc(h.t('wizardMatchFound')) + '</strong>' +
        '<p>' + h.esc(h.t('guideCat_' + (w.guideCategory || guide.category || 'general'))) +
        ' · ' + h.esc(guide.title || w.careGuideId) + '</p>' +
        (w.careGuideId ? '<p class="hlc-wizard-match__id">' + h.esc(h.t('wizardMatchGuideId')) + ': ' + h.esc(w.careGuideId) + '</p>' : '') +
        '</div>'
      );
    }
    return (
      '<div class="hlc-wizard-match hlc-wizard-match--warn" data-hl-wizard-match>' +
      '<p>' + h.esc(h.t('wizardMatchUnknown')) + '</p></div>'
    );
  }

  function patchMatchBanner_(state, ctx) {
    var w = ensureWizard_(state);
    if (w.step !== 1 && w.step !== 2) return;
    var body = global.document.querySelector('#mcHusbandryLogRoot .hlc-wizard__body');
    if (!body) return;
    syncWizardMatch_(state, ctx);
    var guide = guideForWizard_(state, ctx);
    var html = renderMatchBanner_(w, ctx, guide);
    var existing = body.querySelector('[data-hl-wizard-match]');
    if (existing) {
      if (!html) {
        existing.remove();
        return;
      }
      var wrap = global.document.createElement('div');
      wrap.innerHTML = html;
      var next = wrap.firstElementChild;
      if (next) existing.replaceWith(next);
      else existing.remove();
      return;
    }
    if (!html) return;
    var fields = body.querySelector('.hlc-wizard-fields');
    if (!fields) return;
    var insert = global.document.createElement('div');
    insert.innerHTML = html;
    if (insert.firstElementChild) body.insertBefore(insert.firstElementChild, fields);
  }

  function renderStep1_(state, w, h) {
    syncWizardMatch_(state, h);
    var guide = guideForWizard_(state, h);
    var photo = w.profilePhoto && w.profilePhoto.indexOf('data:') === 0
      ? '<img class="hlc-wizard-photo" src="' + w.profilePhoto + '" alt="" />' : '';
    return (
      renderMatchBanner_(w, h, guide) +
      '<div class="hlc-wizard-fields">' +
      '<label class="hlc-field"><span>' + h.esc(h.t('petName')) + '</span>' +
      '<input data-hl-wizard-field="petName" value="' + h.esc(w.petName) + '" placeholder="' + h.esc(h.t('petNamePlaceholder')) + '" /></label>' +
      '<label class="hlc-field"><span>' + h.esc(h.t('wizardCommonName')) + '</span>' +
      '<input data-hl-wizard-field="commonName" value="' + h.esc(w.commonName) + '" placeholder="' + h.esc(h.t('wizardCommonNamePlaceholder')) + '" /></label>' +
      '<label class="hlc-field"><span>' + h.esc(h.t('scientificName')) + ' <em>(' + h.esc(h.t('wizardOptional')) + ')</em></span>' +
      '<input data-hl-wizard-field="scientificName" value="' + h.esc(w.scientificName) + '" placeholder="' + h.esc(h.t('wizardScientificPlaceholder')) + '" /></label>' +
      '<label class="hlc-field"><span>' + h.esc(h.t('profileSource')) + ' <em>(' + h.esc(h.t('wizardOptional')) + ')</em></span>' +
      '<input data-hl-wizard-field="source" value="' + h.esc(w.source) + '" placeholder="' + h.esc(h.t('profileSourcePlaceholder')) + '" /></label>' +
      '<label class="hlc-field"><span>' + h.esc(h.t('passportLinkLabel')) + ' <em>(' + h.esc(h.t('wizardOptional')) + ')</em></span>' +
      '<input data-hl-wizard-field="specimenPassportId" value="' + h.esc(w.specimenPassportId || '') + '" placeholder="' + h.esc(h.t('passportLinkPlaceholder')) + '" /></label>' +
      '<label class="hlc-field"><span>' + h.esc(h.t('startDate')) + ' <em>(' + h.esc(h.t('wizardOptional')) + ')</em></span>' +
      '<input type="date" data-hl-wizard-field="startDate" value="' + h.esc(w.startDate || h.todayKey()) + '" /></label>' +
      '<div class="hlc-wizard-photo-row">' + photo +
      '<label class="hlc-btn hlc-btn--ghost">' + h.esc(h.t('uploadPhoto')) +
      '<input type="file" accept="image/*" capture="environment" class="hlc-sr" data-hl-wizard-photo="upload" /></label></div></div>'
    );
  }

  function renderStep2_(state, w, h) {
    syncWizardMatch_(state, h);
    var cats = WIZARD_CATEGORIES.map(function (cid) {
      var active = w.guideCategory === cid ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + active + '" data-hl-action="wizard-pick-cat" data-hl-wizard-cat="' + h.esc(cid) + '">' +
        h.esc(h.t('guideCat_' + cid)) + '</button>';
    }).join('');
    var stages = WIZARD_LIFE_STAGES.map(function (sid) {
      var active = w.lifeStage === sid ? ' is-active' : '';
      var lk = 'wizardLifeStage_' + sid;
      var label = h.t(lk) !== lk ? h.t(lk) : sid;
      return '<button type="button" class="hlc-chip' + active + '" data-hl-action="wizard-pick-stage" data-hl-wizard-stage="' + h.esc(sid) + '">' +
        h.esc(label) + '</button>';
    }).join('');
    var guide = guideForWizard_(state, h);
    return (
      renderMatchBanner_(w, h, guide) +
      '<div class="hlc-wizard-fields">' +
      '<div class="hlc-field"><span>' + h.esc(h.t('wizardPickCategory')) + '</span><div class="hlc-chips hlc-chips--wrap">' + cats + '</div></div>' +
      '<div class="hlc-field"><span>' + h.esc(h.t('lifeStage')) + '</span><div class="hlc-chips hlc-chips--wrap">' + stages + '</div></div></div>'
    );
  }

  function listItemsHtml_(items, h, limit) {
    var slice = (items || []).slice(0, limit || 3);
    if (!slice.length) return '<p class="hlc-wizard-empty">' + h.esc(h.t('wizardListEmpty')) + '</p>';
    return '<ol class="hlc-wizard-list">' + slice.map(function (it) {
      return '<li>' + h.esc(it) + '</li>';
    }).join('') + '</ol>';
  }

  function displayTextItems_(items, limit) {
    return (items || []).slice(0, limit || 3).map(function (it) {
      if (typeof it === 'string') return it;
      if (it && it.sign) return it.sign;
      return '';
    }).filter(Boolean);
  }

  function questLabelsForGuide_(guide, h, limit) {
    if (!guide || !guide.suggestedTasks) return [];
    return guide.suggestedTasks.slice(0, limit || 3).map(function (k) {
      var gk = 'guideQuest_' + k;
      return h.t(gk) !== gk ? h.t(gk) : k;
    });
  }

  function todayTopItems_(guide, h, limit) {
    if (!guide) return [];
    var n = limit || 3;
    if (guide.dailyCare && guide.dailyCare.items && guide.dailyCare.items.length) {
      return guide.dailyCare.items.slice(0, n);
    }
    if (guide.quickStart && guide.quickStart.points && guide.quickStart.points.length) {
      return guide.quickStart.points.slice(0, n);
    }
    var quests = questLabelsForGuide_(guide, h, n);
    if (quests.length) return quests;
    if (guide.todayFocus) return [guide.todayFocus];
    if (guide.summary) return [guide.summary];
    return [];
  }

  function speciesLabelForGuide_(guide, h) {
    if (!guide) return '';
    var names = (guide.commonNames || []).slice(0, 4);
    if (names.length) return names.join(' · ');
    return h.t('guideCat_' + (guide.category || 'general'));
  }

  function envGroupForWizard_(w, guide) {
    var gid = (guide && guide.id) || w.careGuideId || '';
    if (/aquatic_amphibian|freshwater|marine|shrimp|crayfish|planted|reef|anemone|coral|hermit_crab_marine/.test(gid)) {
      return 'aquatic';
    }
    if (/beetle|mantis|stick_insect|ant_colony/.test(gid)) return 'beetle';
    if (/gecko|snake|lizard|tortoise|aquatic_turtle/.test(gid)) return 'reptile';
    if (/finch|parrot|chick|raptor/.test(gid)) return 'bird';
    if (/hamster|guinea_pig|rabbit|hedgehog|sugar_glider|chinchilla/.test(gid)) return 'mammal';
    if (/tarantula|scorpion|centipede|isopod|millipede|land_hermit/.test(gid)) return 'arthropod';
    if (/terrarium|plant_care/.test(gid)) return 'terrarium';
    return envGroupForCategory_(w.guideCategory);
  }

  function renderSetupChecklist_(guide, h) {
    if (!guide || !guide.setupChecklist || !guide.setupChecklist.length) return '';
    var items = guide.setupChecklist.slice(0, 6).map(function (item) {
      var pri = h.t('guidePriority_' + item.priority) !== 'guidePriority_' + item.priority
        ? h.t('guidePriority_' + item.priority) : item.priority;
      return '<li class="hlc-wizard-setup-item"><strong>' + h.esc(item.title) + '</strong>' +
        '<span class="hlc-wizard-setup-item__pri">' + h.esc(pri) + '</span></li>';
    }).join('');
    return (
      '<div class="hlc-wizard-setup">' +
      '<p class="hlc-wizard-subtitle">' + h.esc(h.t('guideAccSetup')) + '</p>' +
      '<ul class="hlc-wizard-setup-list">' + items + '</ul></div>'
    );
  }

  function renderStep3_(state, w, h) {
    var guide = guideForWizard_(state, h);
    if (!guide) {
      return '<p class="hlc-wizard-empty">' + h.esc(h.t('wizardNoGuide')) + '</p>';
    }
    var draft = draftPetWithGuide_(w);
    var recIds = CARE() ? CARE().getRecommendedRecordsForPet(state, draft, h) : (guide.recommendedRecords || []).slice(0, 6);
    var recLabels = recIds.slice(0, 6).map(function (rid) {
      return h.recordLabel ? h.recordLabel(rid) : rid;
    }).join(' · ');
    var todayItems = todayTopItems_(guide, h, 3);
    var diffKey = guide.difficulty ? ('guideDiff_' + guide.difficulty) : '';
    var diffLabel = diffKey && h.t(diffKey) !== diffKey ? h.t(diffKey) : (guide.difficulty || h.t('guideNotSet'));
    var speciesLine = speciesLabelForGuide_(guide, h);
    var detail = w.showGuideDetail ? (
      '<div class="hlc-wizard-guide-detail">' +
      '<p><strong>' + h.esc(h.t('guideAccEnv')) + '</strong> ' + h.esc(guide.environment.notes || '—') + '</p>' +
      '<p><strong>' + h.esc(h.t('guideAccFeed')) + '</strong> ' + h.esc(guide.feeding.notes || '—') + '</p>' +
      '<p><strong>' + h.esc(h.t('guideAccHealth')) + '</strong> ' + h.esc(guide.health.notes || '—') + '</p></div>'
    ) : '';
    return (
      renderPreviewNotice_(h) +
      '<article class="hlc-wizard-rec-card">' +
      '<span class="hlc-wizard-rec-card__eyebrow">' + h.esc(h.t('wizardRecPlan')) + '</span>' +
      '<h3 class="hlc-wizard-rec-card__title">' + h.esc(guide.title || guide.id) + '</h3>' +
      (speciesLine ? '<p class="hlc-wizard-rec-card__species">' + h.esc(h.t('wizardRecSpecies')) + ': ' + h.esc(speciesLine) + '</p>' : '') +
      '<p class="hlc-wizard-rec-card__meta">' + h.esc(h.t('guideProfileDifficulty')) + ': ' + h.esc(diffLabel) + '</p>' +
      (guide.beginnerNotice ? '<p class="hlc-wizard-rec-card__notice">' + h.esc(guide.beginnerNotice) + '</p>' : '') +
      '<div class="hlc-wizard-rec-card__block"><strong>' + h.esc(h.t('wizardTop3Today')) + '</strong>' +
      listItemsHtml_(todayItems, h, 3) + '</div>' +
      '<div class="hlc-wizard-rec-card__block"><strong>' + h.esc(h.t('guideAccMistakes')) + '</strong>' +
      listItemsHtml_(guide.commonMistakes, h, 3) + '</div>' +
      '<div class="hlc-wizard-rec-card__block"><strong>' + h.esc(h.t('guideAccDanger')) + '</strong>' +
      listItemsHtml_(displayTextItems_(guide.dangerSigns, 3), h, 3) + '</div>' +
      (recLabels ? '<p class="hlc-wizard-rec-card__recs"><strong>' + h.esc(h.t('guideAccRecords')) + '</strong> ' + h.esc(recLabels) + '</p>' : '') +
      detail +
      '<div class="hlc-wizard-rec-card__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--sm" data-hl-action="wizard-apply-guide">' + h.esc(h.t('wizardApplyGuide')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="wizard-browse-guides">' + h.esc(h.t('wizardPickOtherGuide')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="wizard-toggle-detail">' +
      h.esc(w.showGuideDetail ? h.t('wizardHideGuide') : h.t('wizardViewGuide')) + '</button>' +
      '</div></article>'
    );
  }

  function renderEnvFields_(w, h, guide) {
    var group = envGroupForWizard_(w, guide);
    var keys = ENV_GROUPS[group] || ENV_GROUPS.general;
    return keys.map(function (key) {
      var lk = 'wizardEnv_' + key;
      var label = h.t(lk) !== lk ? h.t(lk) : key;
      var val = w.envSetup[key] || '';
      return (
        '<label class="hlc-field"><span>' + h.esc(label) + '</span>' +
        '<input data-hl-wizard-env="' + h.esc(key) + '" value="' + h.esc(val) + '" placeholder="' + h.esc(h.t('wizardEnvPlaceholder')) + '" /></label>'
      );
    }).join('');
  }

  function renderStep4_(state, w, h) {
    var guide = guideForWizard_(state, h);
    return (
      '<p class="hlc-wizard-hint">' + h.esc(h.t('wizardEnvHint')) + '</p>' +
      renderSetupChecklist_(guide, h) +
      '<div class="hlc-wizard-fields">' + renderEnvFields_(w, h, guide) + '</div>' +
      '<p class="hlc-wizard-skip-note">' + h.esc(h.t('wizardEnvSkipNote')) + '</p>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="wizard-skip-env">' + h.esc(h.t('wizardSkipEnv')) + '</button>'
    );
  }

  function renderCheckList_(items, selected, attr, h, labelFn) {
    if (!items.length) return '<p class="hlc-wizard-empty">' + h.esc(h.t('wizardListEmpty')) + '</p>';
    return '<div class="hlc-wizard-checklist">' + items.map(function (id) {
      var checked = selected.indexOf(id) >= 0;
      var label = labelFn(id);
      return (
        '<label class="hlc-wizard-check">' +
        '<input type="checkbox"' + (checked ? ' checked' : '') + ' ' + attr + '="' + h.esc(id) + '" />' +
        '<span>' + h.esc(label) + '</span></label>'
      );
    }).join('') + '</div>';
  }

  function renderStep5_(state, w, h) {
    initStepSelections_(state, h);
    var draft = draftPetWithGuide_(w);
    var recPool = CARE() ? CARE().getRecommendedRecordsForPet(state, draft, h) : [];
    var questPool = CARE() ? CARE().getSuggestedTasksForPet(state, draft, h) : [];
    w.customQuests.forEach(function (cq) {
      if (questPool.indexOf(cq.id) < 0) questPool.push(cq.id);
    });
    var petDraft = { petName: w.petName || h.t('wizardSamplePet') };
    var recHtml = renderCheckList_(recPool, w.selectedRecords, 'data-hl-wizard-record', h, function (rid) {
      return h.recordLabel ? h.recordLabel(rid) : rid;
    });
    var questHtml = renderCheckList_(questPool, w.selectedQuests, 'data-hl-wizard-quest', h, function (qid) {
      var custom = w.customQuests.filter(function (c) { return c.id === qid; })[0];
      if (custom) return custom.label;
      var gk = 'guideQuest_' + qid;
      return h.t(gk) !== gk ? h.t(gk) : qid;
    });
    return (
      '<p class="hlc-wizard-hint">' + h.esc(h.t('wizardStep5Hint').replace('{name}', w.petName || h.t('wizardSamplePet'))) + '</p>' +
      '<h3 class="hlc-wizard-subtitle">' + h.esc(h.t('guideAccRecords')) + '</h3>' + recHtml +
      '<h3 class="hlc-wizard-subtitle">' + h.esc(h.t('todayFocus')) + '</h3>' + questHtml +
      '<div class="hlc-wizard-custom-quest">' +
      '<label class="hlc-field"><span>' + h.esc(h.t('wizardCustomQuest')) + '</span>' +
      '<input data-hl-wizard-field="customQuestDraft" value="' + h.esc(w.customQuestDraft || '') + '" placeholder="' + h.esc(h.t('wizardCustomQuestPlaceholder')) + '" /></label>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="wizard-add-custom-quest">' + h.esc(h.t('wizardAddCustomQuest')) + '</button></div>'
    );
  }

  function renderConfirmRow_(label, value, h) {
    return '<div class="hlc-wizard-confirm-row"><span>' + h.esc(label) + '</span><strong>' + h.esc(value || '—') + '</strong></div>';
  }

  function renderStep6_(state, w, h) {
    initStepSelections_(state, h);
    var guide = guideForWizard_(state, h);
    var envLines = Object.keys(w.envSetup || {}).filter(function (k) { return w.envSetup[k]; }).map(function (k) {
      var lk = 'wizardEnv_' + k;
      var label = h.t(lk) !== lk ? h.t(lk) : k;
      return label + ': ' + w.envSetup[k];
    }).join(' · ');
    var recLabels = w.selectedRecords.map(function (rid) {
      return h.recordLabel ? h.recordLabel(rid) : rid;
    }).join(' · ');
    var questLabels = w.selectedQuests.map(function (qid) {
      var custom = w.customQuests.filter(function (c) { return c.id === qid; })[0];
      if (custom) return custom.label;
      var gk = 'guideQuest_' + qid;
      return h.t(gk) !== gk ? h.t(gk) : qid;
    }).join(' · ');
    var stageKey = 'wizardLifeStage_' + w.lifeStage;
    var stageLabel = h.t(stageKey) !== stageKey ? h.t(stageKey) : w.lifeStage;
    function toggle(id, key, on) {
      return (
        '<label class="hlc-wizard-check hlc-wizard-check--confirm">' +
        '<input type="checkbox"' + (on ? ' checked' : '') + ' data-hl-wizard-confirm="' + id + '" />' +
        '<span>' + h.esc(h.t(key)) + '</span></label>'
      );
    }
    return (
      '<div class="hlc-wizard-confirm">' +
      renderConfirmRow_(h.t('petName'), w.petName, h) +
      renderConfirmRow_(h.t('guideProfileCategory'), h.t('guideCat_' + (w.guideCategory || 'general')), h) +
      renderConfirmRow_(h.t('lifeStage'), stageLabel, h) +
      renderConfirmRow_(h.t('guideProfileApplied'), guide ? (guide.title || guide.id) : h.t('guideNotApplied'), h) +
      renderConfirmRow_(h.t('wizardEnvSummary'), w.envSkipped ? h.t('wizardSkipped') : (envLines || h.t('wizardNotSet')), h) +
      renderConfirmRow_(h.t('guideAccRecords'), recLabels || h.t('wizardNotSet'), h) +
      renderConfirmRow_(h.t('todayFocus'), questLabels || h.t('wizardNotSet'), h) +
      '<div class="hlc-wizard-confirm-toggles">' +
      toggle('initTutorial', 'wizardConfirmTutorial', w.initTutorial !== false) +
      toggle('createQr', 'wizardConfirmQr', w.createQr !== false) +
      toggle('addHomeReminder', 'wizardConfirmReminder', w.addHomeReminder !== false) +
      '</div></div>'
    );
  }

  function renderNav_(w, h) {
    var back;
    if (w.step > 1) {
      back = '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="wizard-back">' + h.esc(h.t('wizardBack')) + '</button>';
    } else if (w.fromTemplateId) {
      back = '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="wizard-back-to-templates">' +
        h.esc(h.t('wizardBackToTemplates')) + '</button>';
    } else {
      back = '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="wizard-cancel">' + h.esc(h.t('cancel')) + '</button>';
    }
    var nextLabel = w.step >= 6 ? h.t('wizardCreatePet') : h.t('wizardNext');
    var nextAct = w.step >= 6 ? 'wizard-complete' : 'wizard-next';
    return (
      '<footer class="hlc-wizard-nav">' + back +
      (w.step > 1 && w.step < 6 ? '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="wizard-cancel">' + h.esc(h.t('cancel')) + '</button>' : '') +
      '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="' + nextAct + '"' +
      (w.completing ? ' disabled' : '') + '>' + h.esc(nextLabel) + '</button></footer>'
    );
  }

  function renderStepBody_(state, w, h) {
    if (w.step === 6) return renderStep6_(state, w, h);
    var body = '';
    if (w.step === 1) body = renderStep1_(state, w, h);
    else if (w.step === 2) body = renderStep2_(state, w, h);
    else if (w.step === 3) body = renderStep3_(state, w, h);
    else if (w.step === 4) body = renderStep4_(state, w, h);
    else if (w.step === 5) body = renderStep5_(state, w, h);
    if (w.step === 3) return body;
    return renderPreviewNotice_(h) + body;
  }

  function onboardingTipGroup_(guideCategory) {
    if (guideCategory === 'amphibians') return 'amphibian';
    if (guideCategory === 'insects_beetles') return 'beetle';
    if (guideCategory === 'reptiles') return 'reptile';
    if (guideCategory === 'freshwater_aquatics' || guideCategory === 'marine_aquatics') return 'aquarium';
    if (guideCategory === 'birds') return 'bird';
    if (guideCategory === 'small_mammals') return 'mammal';
    return 'general';
  }

  function renderOnboardingCard_(pet, h) {
    if (!pet || !pet.showWizardOnboarding) return '';
    var grp = onboardingTipGroup_(pet.guideCategorySnapshot || pet.category || 'general');
    var tips = [1, 2, 3].map(function (n) {
      var k = 'wizardOnboard_' + grp + '_' + n;
      return h.t(k) !== k ? h.t(k) : '';
    }).filter(Boolean);
    if (!tips.length) return '';
    return (
      '<section class="hlc-wizard-onboard">' +
      '<h2 class="hlc-section-title">' + h.esc(h.t('wizardOnboardTitle')) + '</h2>' +
      '<ul class="hlc-wizard-onboard__list">' + tips.map(function (t) {
        return '<li>' + h.esc(t) + '</li>';
      }).join('') + '</ul>' +
      '<div class="hlc-wizard-onboard__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--sm" data-hl-action="wizard-onboard-log">' + h.esc(h.t('wizardOnboardLog')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="wizard-onboard-guide">' + h.esc(h.t('wizardOnboardGuide')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="wizard-onboard-dismiss">' + h.esc(h.t('wizardOnboardLater')) + '</button>' +
      '</div></section>'
    );
  }

  function startWizard_(state) {
    state.ui.wizard = defaultWizardState_();
    var w = state.ui.wizard;
    w.startDate = state.ui && state.ui.wizard && state.ui.wizard.startDate ? state.ui.wizard.startDate : '';
    if (!w.startDate && typeof state.todayKey === 'function') w.startDate = state.todayKey();
  }

  function startWizardFromTemplate_(state, presetId) {
    if (!hasTemplatePreset_(presetId)) return false;
    startWizard_(state);
    var preset = TEMPLATE_PRESETS[presetId];
    var w = state.ui.wizard;
    w.guideCategory = preset.guideCategory;
    w.lifeStage = preset.lifeStage;
    w.categoryManual = true;
    w.guideManualPick = false;
    w.fromTemplateId = presetId;
    w.step = 1;
    return true;
  }

  function validateStep_(w, h) {
    if (w.step === 1 && !String(w.petName || '').trim() && !String(w.commonName || '').trim()) {
      return h.t('wizardNeedName');
    }
    if (w.step === 2 && !w.guideCategory) {
      return h.t('wizardNeedCategory');
    }
    return '';
  }

  function completeWizard_(state, ctx) {
    var w = ensureWizard_(state);
    var h = ctx;
    if (!String(w.petName || '').trim()) w.petName = w.commonName || h.t('wizardSamplePet');
    var petId = ctx.genId();
    var guideId = w.applyGuide ? w.careGuideId : null;
    var customLabels = {};
    w.customQuests.forEach(function (cq) { customLabels[cq.id] = cq.label; });
    var pet = {
      id: petId,
      petName: String(w.petName).trim(),
      speciesId: null,
      chineseName: w.commonName || '',
      commonName: w.commonName || '',
      scientificName: w.scientificName || '',
      careTypeKey: w.guideCategory || '',
      category: w.guideCategory || '',
      guideCategorySnapshot: w.guideCategory || '',
      lifeStage: w.lifeStage || 'juvenile',
      instarLabel: w.lifeStage === 'larva' ? 'larva' : '',
      profilePhoto: w.profilePhoto || '',
      profileSnapshot: null,
      illustrationCategory: '',
      careStartDate: w.startDate || ctx.todayKey(),
      sex: 'unknown',
      source: w.source || '',
      specimenPassportId: w.specimenPassportId || '',
      profileNote: '',
      husbandryId: ctx.genHusbandryId(),
      privacy: 'private',
      qrUrl: ctx.petQrUrl(petId),
      labelSettings: ctx.defaultLabelSettings(),
      careGuideId: guideId,
      enabledQuestKeys: w.selectedQuests.slice(),
      enabledRecordIds: w.selectedRecords.slice(),
      customQuestLabels: customLabels,
      customQuestKeys: w.customQuests.map(function (c) { return c.id; }),
      wizardEnvSetup: w.envSkipped ? null : Object.assign({}, w.envSetup),
      qrSharingEnabled: w.createQr !== false,
      todayReminderEnabled: w.addHomeReminder !== false,
      showWizardOnboarding: true,
    };
    if (ctx.enrichPet) ctx.enrichPet(pet);
    state.pets.push(pet);
    if (CARE()) {
      CARE().ensureState(state, h);
      if (w.applyGuide && guideId) {
        var filteredRecs = CARE().getRecommendedRecordsForPet(state, pet, h);
        pet.enabledRecordIds = w.selectedRecords.filter(function (id) {
          return filteredRecs.indexOf(id) >= 0;
        });
        if (!pet.enabledRecordIds.length) pet.enabledRecordIds = filteredRecs.slice();
        var syncedQuests = CARE().syncCareGuideTasksToPet(state, pet, h);
        var customQuests = w.selectedQuests.filter(function (k) {
          return String(k).indexOf('WIZARD_CUSTOM:') === 0;
        });
        if (customQuests.length) {
          pet.enabledQuestKeys = syncedQuests.concat(customQuests).filter(function (k, i, arr) {
            return arr.indexOf(k) === i;
          }).slice(0, 7);
        }
      }
      var cg = CARE().careGuideState(state);
      if (w.initTutorial !== false && guideId) {
        cg.careGuideProgress[petId] = {
          careGuideId: guideId,
          completedStepIds: [],
          updatedAt: new Date().toISOString(),
        };
      }
      CARE().syncActiveCareGuides(state, h);
    }
    if (pet.profilePhoto && ctx.addLog) {
      ctx.addLog(pet.id, { type: 'photo', recordId: 'photo', recordType: h.t('recordPhoto'), photoUrl: pet.profilePhoto, photoType: 'daily' });
    }
    if (ctx.addLog) {
      ctx.addLog(pet.id, {
        type: 'note',
        recordId: 'note',
        recordType: h.t('recordNote'),
        note: h.t('wizardTimelineCreated'),
      });
    }
    state.activePetId = pet.id;
    state.phase = 'created';
    state.boardTab = 'cards';
    state.ui.wizard = defaultWizardState_();
    state.toast = h.t('wizardCreatedToast');
    ctx.saveState();
    ctx.render();
    if (ctx.clearToast) ctx.clearToast();
  }

  function handleAction_(act, ctx) {
    var state = ctx.state;
    var w = ensureWizard_(state);
    if (act === 'wizard-cancel') {
      state.phase = 'collection';
      state.ui.wizard = defaultWizardState_();
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-next') {
      var err = validateStep_(w, ctx);
      if (err) { state.toast = err; ctx.saveState(); ctx.render(); if (ctx.clearToast) ctx.clearToast(); return true; }
      if (w.step === 3) initStepSelections_(state, ctx);
      w.step = Math.min(6, w.step + 1);
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-back') {
      w.step = Math.max(1, w.step - 1);
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-complete') {
      if (w.completing) return true;
      w.completing = true;
      try {
        completeWizard_(state, ctx);
      } finally {
        w.completing = false;
      }
      return true;
    }
    if (act === 'wizard-pick-cat') {
      w.guideCategory = ctx.el && ctx.el.getAttribute('data-hl-wizard-cat');
      w.categoryManual = true;
      w.guideManualPick = false;
      w.recordsInitialized = false;
      syncWizardMatch_(state, ctx);
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-pick-stage') {
      w.lifeStage = ctx.el && ctx.el.getAttribute('data-hl-wizard-stage');
      w.guideManualPick = false;
      w.recordsInitialized = false;
      syncWizardMatch_(state, ctx);
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-apply-guide') {
      w.applyGuide = true;
      w.guideManualPick = true;
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-toggle-detail') {
      w.showGuideDetail = !w.showGuideDetail;
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-browse-guides') {
      state.ui.sheet = 'guide-browse';
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-skip-env') {
      w.envSkipped = true;
      w.step = 5;
      initStepSelections_(state, ctx);
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-add-custom-quest') {
      var label = String(w.customQuestDraft || '').trim();
      if (label) {
        var cid = 'WIZARD_CUSTOM:' + Date.now().toString(36);
        w.customQuests.push({ id: cid, label: label });
        w.selectedQuests.push(cid);
        w.customQuestDraft = '';
      }
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-onboard-log') {
      var petL = ctx.getActivePet && ctx.getActivePet();
      if (petL) {
        state.phase = 'board';
        state.boardTab = 'cards';
        petL.showWizardOnboarding = false;
      }
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-onboard-guide') {
      var petG = ctx.getActivePet && ctx.getActivePet();
      if (petG) {
        state.phase = 'board';
        state.boardTab = 'cards';
        petG.showWizardOnboarding = false;
        if (!state.ui.guideAccordionOpen) state.ui.guideAccordionOpen = [];
        if (state.ui.guideAccordionOpen.indexOf('tutorial') < 0) state.ui.guideAccordionOpen.push('tutorial');
      }
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'wizard-onboard-dismiss') {
      var petD = ctx.getActivePet && ctx.getActivePet();
      if (petD) petD.showWizardOnboarding = false;
      ctx.saveState(); ctx.render(); return true;
    }
    return false;
  }

  function handleField_(field, value, state, ctx) {
    var w = ensureWizard_(state);
    if (field === 'petName') w.petName = value;
    else if (field === 'commonName') w.commonName = value;
    else if (field === 'scientificName') w.scientificName = value;
    else if (field === 'source') w.source = value;
    else if (field === 'startDate') w.startDate = value;
    else if (field === 'customQuestDraft') w.customQuestDraft = value;
    if (field === 'petName' || field === 'commonName' || field === 'scientificName') {
      w.guideManualPick = false;
      w.recordsInitialized = false;
      syncWizardMatch_(state, ctx);
    }
    ctx.saveState();
  }

  function handleEnvField_(key, value, state, ctx) {
    var w = ensureWizard_(state);
    w.envSetup[key] = value;
    ctx.saveState();
  }

  function handleToggle_(kind, id, checked, state, ctx) {
    var w = ensureWizard_(state);
    if (kind === 'record') {
      var ri = w.selectedRecords.indexOf(id);
      if (checked && ri < 0) w.selectedRecords.push(id);
      if (!checked && ri >= 0) w.selectedRecords.splice(ri, 1);
    } else if (kind === 'quest') {
      var qi = w.selectedQuests.indexOf(id);
      if (checked && qi < 0) w.selectedQuests.push(id);
      if (!checked && qi >= 0) w.selectedQuests.splice(qi, 1);
    } else if (kind === 'confirm') {
      if (id === 'initTutorial') w.initTutorial = checked;
      if (id === 'createQr') w.createQr = checked;
      if (id === 'addHomeReminder') w.addHomeReminder = checked;
    }
    ctx.saveState();
  }

  function render_(state, ctx) {
    var w = ensureWizard_(state);
    var h = ctx;
    if (CARE()) CARE().ensureState(state, h);
    if (!w.startDate) w.startDate = h.todayKey();
    var titles = stepLabels_(h);
    return (
      (state.toast ? '<div class="hlc-toast">' + h.esc(state.toast) + '</div>' : '') +
      '<div class="hlc-app hlc-wizard">' +
      '<div class="hlc-wizard__panel" role="dialog" aria-modal="true">' +
      '<div class="hlc-wizard__handle" aria-hidden="true"></div>' +
      '<header class="hlc-wizard__head">' +
      '<h1 class="hlc-wizard__title">' + h.esc(h.t('wizardTitle')) + '</h1>' +
      '<p class="hlc-wizard__subtitle">' + h.esc(titles[w.step - 1] || '') + '</p></header>' +
      renderStepper_(w, h) +
      '<div class="hlc-wizard__body">' + renderStepBody_(state, w, h) + '</div>' +
      renderNav_(w, h) +
      '</div></div>'
    );
  }

  global.MCHusbandryAddPetWizard = {
    defaultWizardState: defaultWizardState_,
    startWizard: startWizard_,
    startWizardFromTemplate: startWizardFromTemplate_,
    hasTemplatePreset: hasTemplatePreset_,
    listTemplatePresets: listTemplatePresets_,
    render: render_,
    renderOnboardingCard: renderOnboardingCard_,
    handleAction: handleAction_,
    handleField: handleField_,
    handleEnvField: handleEnvField_,
    handleToggle: handleToggle_,
    patchMatchBanner: patchMatchBanner_,
    draftPet: draftPet_,
    syncMatch: syncWizardMatch_,
  };
})(typeof window !== 'undefined' ? window : this);
