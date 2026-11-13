/**
 * Care guide knowledge — Freshwater aquatics category content
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = [
    'freshwater_fish_general',
    'shrimp_general',
    'crayfish_general',
    'planted_tank_general',
  ];

  function splitLines_(text) {
    return String(text || '').split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function section_(notes, ranges) {
    return { summary: '', notes: notes || '', ranges: ranges || null, items: [] };
  }

  function buildGuide_(id, h, opts) {
    return {
      id: id,
      category: 'freshwater_aquatics',
      group: 'freshwater_aquatics',
      commonNames: opts.commonNames || [],
      scientificKeywords: opts.scientificKeywords || [],
      lifeStages: opts.lifeStages || [],
      difficulty: opts.difficulty || 'moderate',
      title: h.t(opts.titleKey),
      summary: h.t(opts.summaryKey),
      todayFocus: h.t(opts.todayFocusKey),
      beginnerNotice: h.t(opts.beginnerKey || 'guideData_fresh_beginner'),
      environment: section_(h.t(opts.envKey), opts.envRanges || null),
      feeding: section_(h.t(opts.feedingKey || 'guideData_fresh_emptySection')),
      waterQuality: section_(h.t(opts.waterQualityKey || 'guideData_fresh_emptySection')),
      humidity: section_('', null),
      temperature: section_('', opts.tempRange ? { min: opts.tempRange[0], max: opts.tempRange[1], unit: '°C' } : null),
      lighting: section_(h.t(opts.lightingKey || 'guideData_fresh_emptySection')),
      substrate: section_(h.t(opts.substrateKey || 'guideData_fresh_emptySection')),
      enclosure: section_(h.t(opts.enclosureKey || 'guideData_fresh_emptySection')),
      behavior: section_(h.t(opts.behaviorKey || 'guideData_fresh_emptySection')),
      health: section_(h.t(opts.healthKey || 'guideData_fresh_emptySection')),
      breeding: section_(h.t('guideData_fresh_emptySection')),
      commonMistakes: splitLines_(h.t(opts.mistakesKey || 'guideData_fresh_emptySection')),
      dangerSigns: splitLines_(h.t(opts.dangersKey || 'guideData_fresh_emptySection')),
      recommendedRecords: opts.recommendedRecords || [],
      suggestedTasks: opts.suggestedTasks || [],
      tutorialSteps: opts.tutorialSteps || [],
      lifeStageNotes: opts.lifeStageNotes || {},
      faq: [],
      disclaimer: h.t('guideDisclaimer'),
      recordHints: opts.recordHints || {},
      trendRecordIds: opts.trendRecordIds || ['water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate'],
      updatedAt: new Date().toISOString(),
    };
  }

  function buildGuides_(h) {
    return {
      freshwater_fish_general: buildGuide_('freshwater_fish_general', h, {
        titleKey: 'guideData_freshwater_fish_title',
        summaryKey: 'guideData_freshwater_fish_summary',
        todayFocusKey: 'guideData_freshwater_fish_todayFocus',
        envKey: 'guideData_freshwater_fish_env',
        waterQualityKey: 'guideData_freshwater_fish_water',
        feedingKey: 'guideData_freshwater_fish_feeding',
        healthKey: 'guideData_freshwater_fish_health',
        mistakesKey: 'guideData_freshwater_fish_mistakes',
        dangersKey: 'guideData_freshwater_fish_dangers',
        difficulty: 'moderate',
        commonNames: ['freshwater fish', 'tropical fish', 'betta', 'guppy', 'tetra', 'goldfish', '淡水魚', '熱帶魚', '鬥魚', '孔雀魚', '燈魚', '金魚'],
        tempRange: [22, 26],
        recommendedRecords: ['water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'feeding', 'activity', 'skin', 'abnormality'],
        suggestedTasks: [
          'GUIDE_CHECK_WATER_TEMP',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_RESPIRATION',
          'GUIDE_REMOVE_UNEATEN',
          'GUIDE_CHECK_WATER_QUALITY',
        ],
        recordHints: {
          water_temp: { min: 22, max: 26, unit: '°C' },
          ph: { min: 6.5, max: 7.5, unit: '' },
          ammonia: { max: 0.25, unit: ' ppm' },
          nitrite: { max: 0.25, unit: ' ppm' },
          nitrate: { max: 40, unit: ' ppm' },
          feeding: { textKey: 'guideHint_fish_feeding' },
          activity: { textKey: 'guideHint_fish_respiration' },
        },
      }),
      shrimp_general: buildGuide_('shrimp_general', h, {
        titleKey: 'guideData_shrimp_title',
        summaryKey: 'guideData_shrimp_summary',
        todayFocusKey: 'guideData_shrimp_todayFocus',
        envKey: 'guideData_shrimp_env',
        waterQualityKey: 'guideData_shrimp_water',
        healthKey: 'guideData_shrimp_health',
        mistakesKey: 'guideData_shrimp_mistakes',
        dangersKey: 'guideData_shrimp_dangers',
        difficulty: 'advanced',
        commonNames: ['shrimp', 'neocaridina', 'caridina', '米蝦', '水晶蝦', '觀賞蝦'],
        tempRange: [22, 24],
        recommendedRecords: ['water_temp', 'ph', 'tds', 'gh', 'kh', 'water_change', 'molt', 'egg_laying', 'note'],
        suggestedTasks: [
          'GUIDE_CHECK_WATER_STABILITY',
          'GUIDE_CHECK_WATER_TEMP',
          'GUIDE_CHECK_MOLT',
          'GUIDE_CHECK_WATER_QUALITY',
          'GUIDE_MINIMIZE_STRESS',
        ],
        trendRecordIds: ['water_temp', 'ph', 'tds', 'gh', 'kh'],
        recordHints: {
          water_temp: { min: 22, max: 24, unit: '°C' },
          ph: { min: 6.2, max: 7.0, unit: '' },
          tds: { textKey: 'guideHint_shrimp_tds' },
          gh: { textKey: 'guideHint_shrimp_gh' },
          kh: { textKey: 'guideHint_shrimp_kh' },
        },
      }),
      crayfish_general: buildGuide_('crayfish_general', h, {
        titleKey: 'guideData_crayfish_title',
        summaryKey: 'guideData_crayfish_summary',
        todayFocusKey: 'guideData_crayfish_todayFocus',
        envKey: 'guideData_crayfish_env',
        waterQualityKey: 'guideData_crayfish_water',
        feedingKey: 'guideData_crayfish_feeding',
        healthKey: 'guideData_crayfish_health',
        enclosureKey: 'guideData_crayfish_enclosure',
        mistakesKey: 'guideData_crayfish_mistakes',
        dangersKey: 'guideData_crayfish_dangers',
        difficulty: 'moderate',
        commonNames: ['crayfish', '螯蝦'],
        tempRange: [20, 24],
        recommendedRecords: ['water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'feeding', 'molt', 'activity', 'abnormality'],
        suggestedTasks: [
          'GUIDE_CHECK_MOLT',
          'GUIDE_CHECK_HIDE',
          'GUIDE_CHECK_WATER_QUALITY',
          'GUIDE_REMOVE_UNEATEN',
          'GUIDE_CHECK_AGGRESSION',
        ],
        recordHints: {
          water_temp: { min: 20, max: 24, unit: '°C' },
          ammonia: { max: 0.25, unit: ' ppm' },
          nitrite: { max: 0.25, unit: ' ppm' },
          feeding: { textKey: 'guideHint_crayfish_feeding' },
        },
      }),
      planted_tank_general: buildGuide_('planted_tank_general', h, {
        titleKey: 'guideData_planted_tank_title',
        summaryKey: 'guideData_planted_tank_summary',
        todayFocusKey: 'guideData_planted_tank_todayFocus',
        envKey: 'guideData_planted_tank_env',
        waterQualityKey: 'guideData_planted_tank_water',
        lightingKey: 'guideData_planted_tank_lighting',
        feedingKey: 'guideData_planted_tank_feeding',
        healthKey: 'guideData_planted_tank_health',
        mistakesKey: 'guideData_planted_tank_mistakes',
        dangersKey: 'guideData_planted_tank_dangers',
        difficulty: 'advanced',
        commonNames: ['planted tank', 'aquatic plants', '水草缸', '水草'],
        tempRange: [22, 26],
        recommendedRecords: ['water_temp', 'ph', 'nitrate', 'water_change', 'activity', 'note', 'photo'],
        suggestedTasks: [
          'GUIDE_CHECK_LIGHTING',
          'GUIDE_CHECK_CO2',
          'GUIDE_CHECK_ALGAE',
          'GUIDE_CHECK_WATER_QUALITY',
          'GUIDE_CHECK_TRIM',
        ],
        trendRecordIds: ['water_temp', 'ph', 'nitrate'],
        recordHints: {
          water_temp: { min: 22, max: 26, unit: '°C' },
          ph: { min: 6.5, max: 7.5, unit: '' },
          nitrate: { max: 30, unit: ' ppm' },
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
    if (/marine|saltwater|salt water|海水|珊瑚|海葵|reef|clownfish|小丑|anemone|lps|sps/.test(blob)) {
      return null;
    }
    if (/planted tank|水草缸|aquatic plants|水草/.test(blob) && !/shrimp|蝦|crayfish|螯/.test(blob)) {
      return 'planted_tank_general';
    }
    if (/shrimp|neocaridina|caridina|米蝦|水晶蝦|觀賞蝦|蝦/.test(blob) && !/crayfish|螯蝦|螯/.test(blob)) {
      return 'shrimp_general';
    }
    if (/crayfish|螯蝦/.test(blob)) return 'crayfish_general';
    if (/freshwater fish|淡水魚|熱帶魚|鬥魚|孔雀魚|燈魚|金魚|betta|guppy|tetra|goldfish|tropical fish/.test(blob)) {
      return 'freshwater_fish_general';
    }
    if (/freshwater_aquatics|freshwater-aquatics/.test(blob)) return 'freshwater_fish_general';
    if (/\bfish\b|魚/.test(blob) && !/catfish|goldfish plant/.test(blob)) {
      return 'freshwater_fish_general';
    }
    return null;
  }

  global.MCHusbandryCareGuideFreshwater = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
  };
})(typeof window !== 'undefined' ? window : this);
