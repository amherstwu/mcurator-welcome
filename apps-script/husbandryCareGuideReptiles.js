/**
 * Care guide knowledge — Reptiles category content
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = [
    'gecko_general',
    'snake_general',
    'lizard_general',
    'tortoise_general',
    'aquatic_turtle_general',
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
      category: 'reptiles',
      group: 'reptiles',
      commonNames: opts.commonNames || [],
      scientificKeywords: opts.scientificKeywords || [],
      lifeStages: opts.lifeStages || [],
      difficulty: opts.difficulty || 'moderate',
      title: h.t(opts.titleKey),
      summary: h.t(opts.summaryKey),
      todayFocus: h.t(opts.todayFocusKey),
      beginnerNotice: h.t(opts.beginnerKey || 'guideData_reptile_beginner'),
      environment: section_(h.t(opts.envKey), opts.envRanges || null),
      feeding: section_(h.t(opts.feedingKey)),
      waterQuality: section_(h.t(opts.waterQualityKey || 'guideData_rept_emptySection')),
      humidity: section_('', opts.humidityRange ? { min: opts.humidityRange[0], max: opts.humidityRange[1], unit: '%' } : null),
      temperature: section_('', opts.tempRange ? { min: opts.tempRange[0], max: opts.tempRange[1], unit: '°C' } : null),
      lighting: section_(h.t(opts.lightingKey || 'guideData_rept_emptySection')),
      substrate: section_(h.t(opts.substrateKey || 'guideData_rept_emptySection')),
      enclosure: section_(h.t(opts.enclosureKey || 'guideData_rept_emptySection')),
      behavior: section_(h.t(opts.behaviorKey || 'guideData_rept_emptySection')),
      health: section_(h.t(opts.healthKey)),
      breeding: section_(h.t('guideData_rept_emptySection')),
      commonMistakes: splitLines_(h.t(opts.mistakesKey)),
      dangerSigns: splitLines_(h.t(opts.dangersKey)),
      recommendedRecords: opts.recommendedRecords || [],
      suggestedTasks: opts.suggestedTasks || [],
      tutorialSteps: opts.tutorialSteps || [],
      lifeStageNotes: opts.lifeStageNotes || {},
      faq: [],
      disclaimer: h.t('guideDisclaimer'),
      recordHints: opts.recordHints || {},
      updatedAt: new Date().toISOString(),
    };
  }

  function buildGuides_(h) {
    return {
      gecko_general: buildGuide_('gecko_general', h, {
        titleKey: 'guideData_gecko_title',
        summaryKey: 'guideData_gecko_summary',
        todayFocusKey: 'guideData_gecko_todayFocus',
        envKey: 'guideData_gecko_env',
        feedingKey: 'guideData_gecko_feeding',
        healthKey: 'guideData_gecko_health',
        behaviorKey: 'guideData_gecko_behavior',
        mistakesKey: 'guideData_gecko_mistakes',
        dangersKey: 'guideData_gecko_dangers',
        difficulty: 'moderate',
        commonNames: ['gecko', 'crested gecko', 'leopard gecko', '守宮', '睫角守宮', '豹紋守宮'],
        humidityRange: [40, 60],
        recommendedRecords: ['weight', 'feeding', 'calcium', 'humidity', 'hotspot', 'cold_zone', 'shedding', 'stool', 'activity'],
        suggestedTasks: [
          'GUIDE_CHECK_TEMP_GRADIENT',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_SHED_RETENTION',
          'GUIDE_CHECK_STOOL',
        ],
        recordHints: {
          hotspot: { min: 28, max: 32, unit: '°C' },
          cold_zone: { min: 22, max: 26, unit: '°C' },
          humidity: { min: 40, max: 60, unit: '%' },
          calcium: { textKey: 'guideHint_gecko_calcium' },
          feeding: { textKey: 'guideHint_gecko_feeding' },
          shedding: { textKey: 'guideHint_rept_shedding' },
        },
      }),
      snake_general: buildGuide_('snake_general', h, {
        titleKey: 'guideData_snake_title',
        summaryKey: 'guideData_snake_summary',
        todayFocusKey: 'guideData_snake_todayFocus',
        envKey: 'guideData_snake_env',
        feedingKey: 'guideData_snake_feeding',
        healthKey: 'guideData_snake_health',
        enclosureKey: 'guideData_snake_enclosure',
        behaviorKey: 'guideData_snake_behavior',
        mistakesKey: 'guideData_snake_mistakes',
        dangersKey: 'guideData_snake_dangers',
        difficulty: 'moderate',
        commonNames: ['snake', 'ball python', 'corn snake', 'python', '蛇', '球蟒', '玉米蛇'],
        humidityRange: [50, 60],
        recommendedRecords: ['weight', 'feeding', 'shedding', 'stool', 'hotspot', 'cold_zone', 'humidity'],
        suggestedTasks: [
          'GUIDE_CHECK_HOT_COLD',
          'GUIDE_CHECK_HIDE',
          'GUIDE_CHECK_FEEDING_SCHEDULE',
          'GUIDE_CHECK_SHEDDING',
          'GUIDE_CHECK_STOOL',
        ],
        recordHints: {
          hotspot: { min: 30, max: 32, unit: '°C' },
          cold_zone: { min: 24, max: 26, unit: '°C' },
          humidity: { min: 50, max: 60, unit: '%' },
          feeding: { textKey: 'guideHint_snake_feeding' },
          shedding: { textKey: 'guideHint_rept_shedding' },
        },
      }),
      lizard_general: buildGuide_('lizard_general', h, {
        titleKey: 'guideData_lizard_title',
        summaryKey: 'guideData_lizard_summary',
        todayFocusKey: 'guideData_lizard_todayFocus',
        envKey: 'guideData_lizard_env',
        feedingKey: 'guideData_lizard_feeding',
        healthKey: 'guideData_lizard_health',
        lightingKey: 'guideData_lizard_lighting',
        mistakesKey: 'guideData_lizard_mistakes',
        dangersKey: 'guideData_lizard_dangers',
        difficulty: 'moderate',
        commonNames: ['lizard', 'bearded dragon', 'skink', 'iguana', '蜥蜴', '鬃獅蜥', '石龍子'],
        humidityRange: [30, 40],
        recommendedRecords: ['weight', 'feeding', 'uvb', 'calcium', 'hotspot', 'shedding', 'activity'],
        suggestedTasks: [
          'GUIDE_CHECK_UVB',
          'GUIDE_CHECK_BASKING',
          'GUIDE_CHECK_CALCIUM',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_SHEDDING',
        ],
        recordHints: {
          hotspot: { min: 38, max: 42, unit: '°C' },
          cold_zone: { min: 24, max: 28, unit: '°C' },
          humidity: { min: 30, max: 40, unit: '%' },
          uvb: { textKey: 'guideHint_lizard_uvb' },
          calcium: { textKey: 'guideHint_lizard_calcium' },
          feeding: { textKey: 'guideHint_lizard_feeding' },
        },
      }),
      tortoise_general: buildGuide_('tortoise_general', h, {
        titleKey: 'guideData_tortoise_title',
        summaryKey: 'guideData_tortoise_summary',
        todayFocusKey: 'guideData_tortoise_todayFocus',
        envKey: 'guideData_tortoise_env',
        feedingKey: 'guideData_tortoise_feeding',
        healthKey: 'guideData_tortoise_health',
        lightingKey: 'guideData_tortoise_lighting',
        mistakesKey: 'guideData_tortoise_mistakes',
        dangersKey: 'guideData_tortoise_dangers',
        difficulty: 'moderate',
        commonNames: ['tortoise', 'hermann tortoise', 'sulcata', '陸龜', '赫曼陸龜', '蘇卡達', '箱龜', 'box turtle'],
        humidityRange: [40, 60],
        recommendedRecords: ['weight', 'feeding', 'basking', 'uvb', 'hotspot', 'shell', 'stool', 'activity'],
        suggestedTasks: [
          'GUIDE_CHECK_UVB',
          'GUIDE_CHECK_TEMP_GRADIENT',
          'GUIDE_CHECK_SOAK',
          'GUIDE_CHECK_SHELL',
          'GUIDE_CHECK_STOOL',
        ],
        recordHints: {
          hotspot: { min: 32, max: 35, unit: '°C' },
          cold_zone: { min: 20, max: 24, unit: '°C' },
          humidity: { min: 40, max: 60, unit: '%' },
          uvb: { textKey: 'guideHint_tortoise_uvb' },
          basking: { textKey: 'guideHint_tortoise_soak' },
          feeding: { textKey: 'guideHint_tortoise_feeding' },
          shell: { textKey: 'guideHint_tortoise_shell' },
        },
      }),
      aquatic_turtle_general: buildGuide_('aquatic_turtle_general', h, {
        titleKey: 'guideData_aquatic_turtle_title',
        summaryKey: 'guideData_aquatic_turtle_summary',
        todayFocusKey: 'guideData_aquatic_turtle_todayFocus',
        envKey: 'guideData_aquatic_turtle_env',
        waterQualityKey: 'guideData_aquatic_turtle_water',
        feedingKey: 'guideData_aquatic_turtle_feeding',
        healthKey: 'guideData_aquatic_turtle_health',
        lightingKey: 'guideData_aquatic_turtle_lighting',
        mistakesKey: 'guideData_aquatic_turtle_mistakes',
        dangersKey: 'guideData_aquatic_turtle_dangers',
        difficulty: 'moderate',
        commonNames: ['aquatic turtle', 'turtle', 'slider', '水龜', '澤龜'],
        recommendedRecords: ['basking', 'uvb', 'water_temp', 'ph', 'water_change', 'shell', 'activity', 'feeding'],
        suggestedTasks: [
          'GUIDE_CHECK_BASKING',
          'GUIDE_CHECK_UVB',
          'GUIDE_CHECK_WATER_TEMP',
          'GUIDE_CHECK_FILTER_QUALITY',
          'GUIDE_CHECK_SHELL_EYES',
        ],
        recordHints: {
          water_temp: { min: 24, max: 28, unit: '°C' },
          ph: { min: 6.5, max: 7.5, unit: '' },
          basking: { min: 32, max: 35, unit: '°C' },
          uvb: { textKey: 'guideHint_turtle_uvb' },
          shell: { textKey: 'guideHint_turtle_shell' },
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
    if (/gecko|守宮|睫角|豹紋|crested gecko|leopard gecko|crestie/.test(blob)) {
      return 'gecko_general';
    }
    if (/snake|python|corn snake|ball python|蛇|球蟒|玉米蛇/.test(blob)) {
      return 'snake_general';
    }
    if (/tortoise|陸龜|赫曼|蘇卡|sulcata|hermann|箱龜|box turtle/.test(blob)) {
      return 'tortoise_general';
    }
    if (/aquatic turtle|水龜|澤龜|red.?ear|slider/.test(blob)) {
      return 'aquatic_turtle_general';
    }
    if (/\bturtle\b|烏龜/.test(blob) && !/tortoise|陸龜/.test(blob)) {
      return 'aquatic_turtle_general';
    }
    if (/lizard|蜥蜴|鬃獅|bearded dragon|skink|石龍子|iguana|變色龍|chameleon/.test(blob)) {
      return 'lizard_general';
    }
    if (/reptile|reptiles|爬蟲/.test(blob)) return 'lizard_general';
    return null;
  }

  global.MCHusbandryCareGuideReptiles = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
  };
})(typeof window !== 'undefined' ? window : this);
