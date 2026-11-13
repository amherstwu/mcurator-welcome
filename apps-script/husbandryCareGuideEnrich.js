/**
 * Care guide content enrichment — deep handbook fields by archetype template.
 */
(function (global) {
  'use strict';

  var GUIDE_ARCHETYPE = {
    frog_general: 'frog',
    toad_general: 'toad',
    aquatic_amphibian_general: 'aquatic_amphibian',
    beetle_adult_general: 'beetle_adult',
    beetle_larva_general: 'beetle_larva',
    mantis_general: 'insect_other',
    stick_insect_general: 'insect_other',
    ant_colony_general: 'insect_other',
    gecko_general: 'gecko',
    snake_general: 'snake',
    lizard_general: 'lizard',
    tortoise_general: 'tortoise',
    aquatic_turtle_general: 'aquatic_turtle',
    freshwater_fish_general: 'freshwater_fish',
    shrimp_general: 'freshwater_other',
    crayfish_general: 'freshwater_other',
    planted_tank_general: 'freshwater_other',
    marine_fish_general: 'marine_fish',
    coral_general: 'marine_reef',
    anemone_general: 'marine_reef',
    reef_tank_general: 'marine_reef',
    hermit_crab_marine_general: 'marine_hermit',
    finch_general: 'finch',
    parrot_general: 'parrot',
    chick_general: 'chick',
    raptor_placeholder: 'bird_other',
    hamster_general: 'hamster',
    guinea_pig_general: 'mammal_other',
    rabbit_general: 'rabbit',
    hedgehog_general: 'mammal_other',
    sugar_glider_general: 'mammal_other',
    chinchilla_general: 'mammal_other',
    tarantula_general: 'tarantula',
    scorpion_general: 'arthropod_other',
    centipede_general: 'arthropod_other',
    isopod_general: 'isopod',
    millipede_general: 'arthropod_other',
    land_hermit_crab_general: 'arthropod_other',
    terrarium_general: 'terrarium',
    plant_care_general: 'plant',
    general_care: 'general',
  };

  var CATEGORY_FALLBACK = {
    amphibians: 'frog',
    insects_beetles: 'beetle_adult',
    reptiles: 'gecko',
    freshwater_aquatics: 'freshwater_fish',
    marine_aquatics: 'marine_fish',
    birds: 'finch',
    small_mammals: 'hamster',
    arthropod_exotics: 'tarantula',
    plants_terrarium: 'terrarium',
    general: 'general',
  };

  function lines_(h, key) {
    var raw = h.t(key);
    if (!raw || raw === key) return [];
    return String(raw).split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function careBlock_(h, tpl, suffix) {
    var key = 'guideTpl_' + tpl + '_' + suffix;
    return { summary: '', notes: '', items: lines_(h, key) };
  }

  function quickStart_(h, tpl) {
    return {
      title: h.t('guideTpl_' + tpl + '_quickStart_title'),
      points: lines_(h, 'guideTpl_' + tpl + '_quickStart_points'),
      firstDayTips: lines_(h, 'guideTpl_' + tpl + '_quickStart_day1'),
      firstWeekTips: lines_(h, 'guideTpl_' + tpl + '_quickStart_week1'),
      avoidImmediately: lines_(h, 'guideTpl_' + tpl + '_quickStart_avoid'),
    };
  }

  function setupChecklist_(h, tpl) {
    var out = [];
    var i;
    for (i = 1; i <= 8; i++) {
      var titleKey = 'guideTpl_' + tpl + '_setup_' + i + '_title';
      var title = h.t(titleKey);
      if (title === titleKey) break;
      out.push({
        id: tpl + '_setup_' + i,
        title: title,
        description: h.t('guideTpl_' + tpl + '_setup_' + i + '_desc'),
        priority: h.t('guideTpl_' + tpl + '_setup_' + i + '_priority') || 'recommended',
        relatedRecordType: h.t('guideTpl_' + tpl + '_setup_' + i + '_record') || 'note',
      });
    }
    return out;
  }

  function dangersFromTpl_(h, tpl) {
    var out = [];
    var i;
    for (i = 1; i <= 12; i++) {
      var key = 'guideTpl_' + tpl + '_danger_' + i;
      var line = h.t(key);
      if (line === key) break;
      var parts = line.split('|');
      if (parts.length < 3) continue;
      out.push({
        severity: parts[0].trim(),
        sign: parts[1].trim(),
        advice: parts[2].trim(),
        relatedRecordType: (parts[3] || 'abnormality').trim(),
      });
    }
    return out;
  }

  function lifeStageTips_(h, tpl) {
    var stages = ['egg', 'larva', 'nymph', 'pupa', 'juvenile', 'subadult', 'adult', 'senior', 'breeding'];
    var out = {};
    stages.forEach(function (st) {
      var items = lines_(h, 'guideTpl_' + tpl + '_stage_' + st);
      if (items.length) out[st] = items;
    });
    return out;
  }

  function tutorialSteps_(h, tpl) {
    var out = [];
    var i;
    for (i = 1; i <= 8; i++) {
      var key = 'guideTpl_' + tpl + '_tutorial_' + i;
      var title = h.t(key);
      if (title === key) break;
      out.push({ id: tpl + '_tut_' + i, titleKey: key, title: title });
    }
    return out;
  }

  function mergeLegacyDangers_(guide, structured, h) {
    if (structured && structured.length) return structured;
    if (!guide.dangerSigns || !guide.dangerSigns.length) return [];
    if (typeof guide.dangerSigns[0] === 'object') return guide.dangerSigns;
    return guide.dangerSigns.map(function (sign) {
      return {
        sign: sign,
        severity: 'warning',
        advice: h.t('guideDangerDefaultAdvice'),
        relatedRecordType: 'abnormality',
      };
    });
  }

  function mergeLifeStageTips_(guide, tplTips, h) {
    var out = Object.assign({}, tplTips);
    if (guide.lifeStageNotes) {
      Object.keys(guide.lifeStageNotes).forEach(function (k) {
        var note = guide.lifeStageNotes[k];
        if (note) out[k] = [note].concat(out[k] || []);
      });
    }
    return out;
  }

  function resolveArchetype_(guide) {
    if (!guide) return 'general';
    if (GUIDE_ARCHETYPE[guide.id]) return GUIDE_ARCHETYPE[guide.id];
    return CATEGORY_FALLBACK[guide.category] || 'general';
  }

  function enrichGuide_(guide, h) {
    if (!guide || !h || typeof h.t !== 'function') return guide;
    var tpl = resolveArchetype_(guide);
    var g = Object.assign({}, guide);

    g.suitableFor = lines_(h, 'guideTpl_' + tpl + '_suitableFor');
    g.notSuitableFor = lines_(h, 'guideTpl_' + tpl + '_notSuitableFor');
    g.quickStart = quickStart_(h, tpl);
    g.setupChecklist = setupChecklist_(h, tpl);
    g.dailyCare = careBlock_(h, tpl, 'dailyCare');
    g.weeklyCare = careBlock_(h, tpl, 'weeklyCare');
    g.monthlyCare = careBlock_(h, tpl, 'monthlyCare');
    g.lifeStageTips = mergeLifeStageTips_(guide, lifeStageTips_(h, tpl), h);
    g.dangerSigns = mergeLegacyDangers_(guide, dangersFromTpl_(h, tpl), h);
    g.emergencyAdvice = lines_(h, 'guideTpl_' + tpl + '_emergencyAdvice');
    g.purchaseChecklist = lines_(h, 'guideTpl_' + tpl + '_purchaseChecklist');

    if (!g.tutorialSteps || !g.tutorialSteps.length) {
      g.tutorialSteps = tutorialSteps_(h, tpl);
    }

    if (!g.todayFocus && g.quickStart.points && g.quickStart.points[0]) {
      g.todayFocus = g.quickStart.points[0];
    }

    g._contentArchetype = tpl;
    g._contentEnriched = true;
    return g;
  }

  function enrichAllGuides_(guides, h) {
    if (!guides || !h) return guides;
    var out = {};
    Object.keys(guides).forEach(function (id) {
      out[id] = enrichGuide_(guides[id], h);
    });
    return out;
  }

  global.MCHusbandryCareGuideEnrich = {
    GUIDE_ARCHETYPE: GUIDE_ARCHETYPE,
    resolveArchetype: resolveArchetype_,
    enrichGuide: enrichGuide_,
    enrichAllGuides: enrichAllGuides_,
  };
})(typeof window !== 'undefined' ? window : this);
