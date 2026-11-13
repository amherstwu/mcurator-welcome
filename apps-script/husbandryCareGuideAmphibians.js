/**
 * Care guide knowledge — Amphibians category content
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = ['frog_general', 'aquatic_amphibian_general', 'toad_general'];

  function splitLines_(text) {
    return String(text || '').split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function section_(notes, ranges) {
    return { summary: '', notes: notes || '', ranges: ranges || null, items: [] };
  }

  function buildGuide_(id, h, opts) {
    return {
      id: id,
      category: 'amphibians',
      group: 'amphibians',
      commonNames: opts.commonNames || [],
      scientificKeywords: opts.scientificKeywords || [],
      lifeStages: opts.lifeStages || [],
      difficulty: opts.difficulty || 'moderate',
      title: h.t(opts.titleKey),
      summary: h.t(opts.summaryKey),
      todayFocus: h.t(opts.todayFocusKey),
      beginnerNotice: h.t(opts.beginnerKey || 'guideData_amph_beginner'),
      environment: section_(h.t(opts.envKey), opts.envRanges || null),
      feeding: section_(h.t(opts.feedingKey)),
      waterQuality: section_(h.t(opts.waterQualityKey || 'guideData_amph_emptySection')),
      humidity: section_('', opts.humidityRange ? { min: opts.humidityRange[0], max: opts.humidityRange[1], unit: '%' } : null),
      temperature: section_('', opts.tempRange ? { min: opts.tempRange[0], max: opts.tempRange[1], unit: '°C' } : null),
      lighting: section_(h.t(opts.lightingKey || 'guideData_amph_emptySection')),
      substrate: section_(h.t(opts.substrateKey || 'guideData_amph_emptySection')),
      enclosure: section_(h.t(opts.enclosureKey || 'guideData_amph_emptySection')),
      behavior: section_(h.t(opts.behaviorKey || 'guideData_amph_emptySection')),
      health: section_(h.t(opts.healthKey)),
      breeding: section_(h.t('guideData_amph_emptySection')),
      commonMistakes: splitLines_(h.t(opts.mistakesKey)),
      dangerSigns: splitLines_(h.t(opts.dangersKey)),
      recommendedRecords: opts.recommendedRecords || [],
      suggestedTasks: opts.suggestedTasks || [],
      tutorialSteps: opts.tutorialSteps || [],
      faq: [],
      disclaimer: h.t('guideDisclaimer'),
      recordHints: opts.recordHints || {},
      updatedAt: new Date().toISOString(),
    };
  }

  function buildGuides_(h) {
    return {
      frog_general: buildGuide_('frog_general', h, {
        titleKey: 'guideData_frog_general_title',
        summaryKey: 'guideData_frog_general_summary',
        todayFocusKey: 'guideData_frog_general_todayFocus',
        envKey: 'guideData_frog_general_env',
        feedingKey: 'guideData_frog_general_feeding',
        healthKey: 'guideData_frog_general_health',
        mistakesKey: 'guideData_frog_general_mistakes',
        dangersKey: 'guideData_frog_general_dangers',
        difficulty: 'moderate',
        commonNames: ['frog', 'tree frog', 'horned frog', 'dart frog', 'rain frog', 'stream frog', '蛙', '樹蛙', '角蛙', '箭毒蛙', '雨蛙', '溪蛙'],
        scientificKeywords: ['anura', 'hylidae', 'ceratophrys', 'dendrobatidae'],
        humidityRange: [70, 85],
        tempRange: [22, 28],
        recommendedRecords: ['photo', 'feeding', 'humidity', 'temperature', 'skin', 'activity', 'frass', 'weight'],
        suggestedTasks: [
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_SKIN',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_REMOVE_UNEATEN',
          'GUIDE_CHECK_HIDE_SUBSTRATE',
        ],
        recordHints: {
          humidity: { min: 70, max: 85, unit: '%' },
          temperature: { min: 22, max: 28, unit: '°C' },
          feeding: { textKey: 'guideHint_frog_feeding' },
          skin: { textKey: 'guideHint_frog_skin' },
          abnormality: { textKey: 'guideHint_frog_health' },
          insect_status: { textKey: 'guideHint_frog_health' },
        },
      }),
      aquatic_amphibian_general: buildGuide_('aquatic_amphibian_general', h, {
        titleKey: 'guideData_aquatic_amphibian_title',
        summaryKey: 'guideData_aquatic_amphibian_summary',
        todayFocusKey: 'guideData_aquatic_amphibian_todayFocus',
        envKey: 'guideData_aquatic_amphibian_env',
        waterQualityKey: 'guideData_aquatic_amphibian_water',
        feedingKey: 'guideData_aquatic_amphibian_feeding',
        healthKey: 'guideData_aquatic_amphibian_health',
        mistakesKey: 'guideData_aquatic_amphibian_mistakes',
        dangersKey: 'guideData_aquatic_amphibian_dangers',
        difficulty: 'moderate',
        commonNames: ['axolotl', 'newt', 'salamander', '六角恐龍', '蠑螈', '美西螈', '水棲蠑螈'],
        scientificKeywords: ['ambystoma', 'caudata', 'urodele'],
        recommendedRecords: ['water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'gill', 'skin', 'feeding', 'activity'],
        suggestedTasks: [
          'GUIDE_CHECK_WATER_TEMP',
          'GUIDE_CHECK_GILLS',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_WATER_QUALITY',
          'GUIDE_REMOVE_UNEATEN',
        ],
        recordHints: {
          water_temp: { min: 16, max: 22, unit: '°C' },
          ph: { min: 6.5, max: 7.5, unit: '' },
          ammonia: { max: 0.25, unit: ' ppm' },
          nitrite: { max: 0.25, unit: ' ppm' },
          nitrate: { max: 40, unit: ' ppm' },
          feeding: { textKey: 'guideHint_aquatic_feeding' },
          gill: { textKey: 'guideHint_aquatic_gill' },
          skin: { textKey: 'guideHint_aquatic_skin' },
        },
      }),
      toad_general: buildGuide_('toad_general', h, {
        titleKey: 'guideData_toad_general_title',
        summaryKey: 'guideData_toad_general_summary',
        todayFocusKey: 'guideData_toad_general_todayFocus',
        envKey: 'guideData_toad_general_env',
        feedingKey: 'guideData_toad_general_feeding',
        healthKey: 'guideData_toad_general_health',
        mistakesKey: 'guideData_toad_general_mistakes',
        dangersKey: 'guideData_toad_general_dangers',
        difficulty: 'easy',
        commonNames: ['toad', '蟾蜍'],
        humidityRange: [60, 75],
        tempRange: [20, 26],
        recommendedRecords: ['photo', 'feeding', 'humidity', 'temperature', 'skin', 'activity', 'frass', 'substrate'],
        suggestedTasks: [
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_SKIN',
          'GUIDE_CHECK_SUBSTRATE',
        ],
        recordHints: {
          humidity: { min: 60, max: 75, unit: '%' },
          temperature: { min: 20, max: 26, unit: '°C' },
          feeding: { textKey: 'guideHint_toad_feeding' },
        },
      }),
    };
  }

  function petBlob_(pet) {
    if (!pet) return '';
    return [
      pet.category,
      pet.careTypeKey,
      pet.commonName,
      pet.chineseName,
      pet.scientificName,
      pet.petName,
      pet.profileNote,
    ].join(' ').toLowerCase();
  }

  function matchGuideId_(pet) {
    if (!pet) return null;
    var blob = petBlob_(pet);
    if (/axolotl|六角|美西螈|ambystoma|salamander aquatic|aquatic salamander|水棲蠑螈|newt larva|蠑螈幼體/.test(blob)) {
      return 'aquatic_amphibian_general';
    }
    if (/toad|蟾蜍/.test(blob)) return 'toad_general';
    if (/frog|tree frog|horned frog|dart frog|rain frog|stream frog|角蛙|樹蛙|箭毒蛙|雨蛙|溪蛙|蛙/.test(blob)) {
      return 'frog_general';
    }
    if (/newt|salamander|蠑螈|螈/.test(blob) && !/陸棲|terrestrial|land/.test(blob)) {
      return 'aquatic_amphibian_general';
    }
    if (/amphibian|兩棲/.test(blob)) return 'frog_general';
    if (/aquatic-amphibian|aquatic_amphibian|aquatic amphibian/.test(blob)) {
      return 'aquatic_amphibian_general';
    }
    return null;
  }

  global.MCHusbandryCareGuideAmphibians = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
  };
})(typeof window !== 'undefined' ? window : this);
