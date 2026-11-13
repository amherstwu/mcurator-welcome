/**
 * Care guide knowledge — Marine aquatics category content
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = [
    'marine_fish_general',
    'coral_general',
    'anemone_general',
    'hermit_crab_marine_general',
    'reef_tank_general',
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
      category: 'marine_aquatics',
      group: 'marine_aquatics',
      commonNames: opts.commonNames || [],
      scientificKeywords: opts.scientificKeywords || [],
      lifeStages: opts.lifeStages || [],
      difficulty: opts.difficulty || 'moderate',
      title: h.t(opts.titleKey),
      summary: h.t(opts.summaryKey),
      todayFocus: h.t(opts.todayFocusKey),
      beginnerNotice: h.t(opts.beginnerKey || 'guideData_marine_beginner'),
      systemInfo: opts.systemInfoKey ? h.t(opts.systemInfoKey) : '',
      environment: section_(h.t(opts.envKey), opts.envRanges || null),
      feeding: section_(h.t(opts.feedingKey || 'guideData_marine_emptySection')),
      waterQuality: section_(h.t(opts.waterQualityKey || 'guideData_marine_emptySection')),
      humidity: section_('', null),
      temperature: section_('', opts.tempRange ? { min: opts.tempRange[0], max: opts.tempRange[1], unit: '°C' } : null),
      lighting: section_(h.t(opts.lightingKey || 'guideData_marine_emptySection')),
      substrate: section_(h.t(opts.substrateKey || 'guideData_marine_emptySection')),
      enclosure: section_(h.t(opts.enclosureKey || 'guideData_marine_emptySection')),
      behavior: section_(h.t(opts.behaviorKey || 'guideData_marine_emptySection')),
      health: section_(h.t(opts.healthKey || 'guideData_marine_emptySection')),
      breeding: section_(h.t('guideData_marine_emptySection')),
      commonMistakes: splitLines_(h.t(opts.mistakesKey || 'guideData_marine_emptySection')),
      dangerSigns: splitLines_(h.t(opts.dangersKey || 'guideData_marine_emptySection')),
      recommendedRecords: opts.recommendedRecords || [],
      suggestedTasks: opts.suggestedTasks || [],
      tutorialSteps: opts.tutorialSteps || [],
      lifeStageNotes: opts.lifeStageNotes || {},
      faq: [],
      disclaimer: h.t('guideDisclaimer'),
      recordHints: opts.recordHints || {},
      trendRecordIds: opts.trendRecordIds || ['salinity', 'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate'],
      updatedAt: new Date().toISOString(),
    };
  }

  function buildGuides_(h) {
    var marineHints = {
      salinity: { min: 1.023, max: 1.026, unit: '' },
      water_temp: { min: 24, max: 26, unit: '°C' },
      ph: { min: 8.0, max: 8.4, unit: '' },
      ammonia: { max: 0, unit: ' ppm' },
      nitrite: { max: 0, unit: ' ppm' },
      nitrate: { max: 10, unit: ' ppm' },
      kh: { min: 7, max: 11, unit: ' dKH' },
      ca: { min: 400, max: 450, unit: ' ppm' },
      mg: { min: 1250, max: 1350, unit: ' ppm' },
      po4: { max: 0.05, unit: ' ppm' },
    };

    return {
      marine_fish_general: buildGuide_('marine_fish_general', h, {
        titleKey: 'guideData_marine_fish_title',
        summaryKey: 'guideData_marine_fish_summary',
        todayFocusKey: 'guideData_marine_fish_todayFocus',
        envKey: 'guideData_marine_fish_env',
        waterQualityKey: 'guideData_marine_fish_water',
        feedingKey: 'guideData_marine_fish_feeding',
        healthKey: 'guideData_marine_fish_health',
        mistakesKey: 'guideData_marine_fish_mistakes',
        dangersKey: 'guideData_marine_fish_dangers',
        systemInfoKey: 'guideData_marine_fish_system',
        difficulty: 'moderate',
        commonNames: ['marine fish', 'clownfish', 'tang', 'angelfish', '海水魚', '小丑魚', '倒吊', '神仙魚'],
        tempRange: [24, 26],
        recommendedRecords: ['salinity', 'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'feeding', 'activity', 'skin'],
        suggestedTasks: [
          'GUIDE_CHECK_WATER_TEMP',
          'GUIDE_CHECK_SALINITY',
          'GUIDE_CHECK_MARINE_SURFACE',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_SKIMMER_FILTER',
        ],
        recordHints: Object.assign({}, marineHints, {
          feeding: { textKey: 'guideHint_marine_fish_feeding' },
          activity: { textKey: 'guideHint_marine_respiration' },
          skin: { textKey: 'guideHint_marine_ich' },
        }),
      }),
      coral_general: buildGuide_('coral_general', h, {
        titleKey: 'guideData_coral_title',
        summaryKey: 'guideData_coral_summary',
        todayFocusKey: 'guideData_coral_todayFocus',
        envKey: 'guideData_coral_env',
        waterQualityKey: 'guideData_coral_water',
        lightingKey: 'guideData_coral_lighting',
        healthKey: 'guideData_coral_health',
        mistakesKey: 'guideData_coral_mistakes',
        dangersKey: 'guideData_coral_dangers',
        systemInfoKey: 'guideData_coral_system',
        difficulty: 'advanced',
        commonNames: ['coral', 'LPS', 'SPS', 'soft coral', '珊瑚', '軟珊瑚'],
        tempRange: [24, 26],
        recommendedRecords: ['salinity', 'water_temp', 'kh', 'ca', 'mg', 'nitrate', 'po4', 'aquarium_light', 'coral_open', 'photo'],
        suggestedTasks: [
          'GUIDE_CHECK_AQUARIUM_LIGHT',
          'GUIDE_CHECK_FLOW',
          'GUIDE_CHECK_SALINITY',
          'GUIDE_CHECK_ALKALINITY_MINERALS',
          'GUIDE_CHECK_CORAL_OPEN',
        ],
        trendRecordIds: ['salinity', 'kh', 'ca', 'mg', 'nitrate', 'po4'],
        recordHints: Object.assign({}, marineHints, {
          aquarium_light: { textKey: 'guideHint_coral_light' },
          water_flow: { textKey: 'guideHint_coral_flow' },
          coral_open: { textKey: 'guideHint_coral_open' },
        }),
      }),
      anemone_general: buildGuide_('anemone_general', h, {
        titleKey: 'guideData_anemone_title',
        summaryKey: 'guideData_anemone_summary',
        todayFocusKey: 'guideData_anemone_todayFocus',
        envKey: 'guideData_anemone_env',
        lightingKey: 'guideData_anemone_lighting',
        healthKey: 'guideData_anemone_health',
        behaviorKey: 'guideData_anemone_behavior',
        mistakesKey: 'guideData_anemone_mistakes',
        dangersKey: 'guideData_anemone_dangers',
        systemInfoKey: 'guideData_anemone_system',
        difficulty: 'advanced',
        commonNames: ['anemone', '海葵'],
        tempRange: [24, 26],
        recommendedRecords: ['salinity', 'water_temp', 'aquarium_light', 'water_flow', 'coral_open', 'activity', 'photo'],
        suggestedTasks: [
          'GUIDE_CHECK_AQUARIUM_LIGHT',
          'GUIDE_CHECK_FLOW',
          'GUIDE_CHECK_ANEMONE_TENTACLES',
          'GUIDE_CHECK_SALINITY',
          'GUIDE_CHECK_ANEMONE_POSITION',
        ],
        trendRecordIds: ['salinity', 'water_temp', 'kh'],
        recordHints: Object.assign({}, marineHints, {
          coral_open: { textKey: 'guideHint_anemone_tentacles' },
          water_flow: { textKey: 'guideHint_anemone_flow' },
        }),
      }),
      hermit_crab_marine_general: buildGuide_('hermit_crab_marine_general', h, {
        titleKey: 'guideData_hermit_marine_title',
        summaryKey: 'guideData_hermit_marine_summary',
        todayFocusKey: 'guideData_hermit_marine_todayFocus',
        envKey: 'guideData_hermit_marine_env',
        waterQualityKey: 'guideData_hermit_marine_water',
        feedingKey: 'guideData_hermit_marine_feeding',
        healthKey: 'guideData_hermit_marine_health',
        mistakesKey: 'guideData_hermit_marine_mistakes',
        dangersKey: 'guideData_hermit_marine_dangers',
        systemInfoKey: 'guideData_hermit_marine_system',
        difficulty: 'moderate',
        commonNames: ['hermit crab marine', 'marine hermit crab', '海水寄居蟹', '寄居蟹'],
        tempRange: [24, 26],
        recommendedRecords: ['salinity', 'water_temp', 'feeding', 'molt', 'activity', 'abnormality', 'note'],
        suggestedTasks: [
          'GUIDE_CHECK_SHELL_OPTIONS',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_WATER_QUALITY',
          'GUIDE_CHECK_MOLT',
          'GUIDE_CHECK_AGGRESSION',
        ],
        recordHints: Object.assign({}, marineHints, {
          feeding: { textKey: 'guideHint_hermit_feeding' },
        }),
      }),
      reef_tank_general: buildGuide_('reef_tank_general', h, {
        titleKey: 'guideData_reef_tank_title',
        summaryKey: 'guideData_reef_tank_summary',
        todayFocusKey: 'guideData_reef_tank_todayFocus',
        envKey: 'guideData_reef_tank_env',
        waterQualityKey: 'guideData_reef_tank_water',
        lightingKey: 'guideData_reef_tank_lighting',
        healthKey: 'guideData_reef_tank_health',
        mistakesKey: 'guideData_reef_tank_mistakes',
        dangersKey: 'guideData_reef_tank_dangers',
        systemInfoKey: 'guideData_reef_tank_system',
        difficulty: 'advanced',
        commonNames: ['reef tank', 'marine aquarium', '海水缸', 'reef'],
        tempRange: [24, 26],
        recommendedRecords: ['salinity', 'water_temp', 'kh', 'ca', 'mg', 'nitrate', 'po4', 'water_change', 'aquarium_light', 'note'],
        suggestedTasks: [
          'GUIDE_CHECK_SALINITY',
          'GUIDE_CHECK_ALKALINITY_MINERALS',
          'GUIDE_CHECK_NUTRIENTS',
          'GUIDE_CHECK_FILTER_QUALITY',
          'GUIDE_CHECK_EQUIPMENT',
        ],
        trendRecordIds: ['salinity', 'kh', 'ca', 'mg', 'nitrate', 'po4', 'water_temp'],
        recordHints: marineHints,
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

  function isMarineBlob_(blob) {
    return /marine|saltwater|salt water|海水|珊瑚|海葵|reef|clownfish|小丑|寄居蟹|anemone|coral/.test(blob);
  }

  function matchGuideId_(pet) {
    if (!pet) return null;
    var blob = petBlob_(pet);
    if (/anemone|海葵/.test(blob)) return 'anemone_general';
    if (/coral|lps|sps|soft coral|珊瑚|軟珊瑚/.test(blob) && !/fish|魚/.test(blob)) {
      return 'coral_general';
    }
    if (/hermit crab|marine hermit|海水寄居蟹/.test(blob)) {
      return 'hermit_crab_marine_general';
    }
    if (/reef tank|海水缸|marine aquarium/.test(blob) && !/fish|魚|clown|小丑/.test(blob)) {
      return 'reef_tank_general';
    }
    if (/marine fish|海水魚|clownfish|tang|angelfish|小丑魚|倒吊|神仙魚/.test(blob)) {
      return 'marine_fish_general';
    }
    if (/marine_aquatics|marine-aquatics/.test(blob)) return 'marine_fish_general';
    if (isMarineBlob_(blob) && !/freshwater|淡水|betta|guppy|tetra|鬥魚|孔雀/.test(blob)) {
      return 'marine_fish_general';
    }
    return null;
  }

  global.MCHusbandryCareGuideMarine = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
  };
})(typeof window !== 'undefined' ? window : this);
