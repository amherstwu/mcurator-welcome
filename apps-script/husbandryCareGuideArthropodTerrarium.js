/**
 * Care guide knowledge — Exotic arthropods and terrarium / plant setups
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = [
    'tarantula_general',
    'scorpion_general',
    'centipede_general',
    'isopod_general',
    'millipede_general',
    'land_hermit_crab_general',
    'terrarium_general',
    'plant_care_general',
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
      category: opts.category || 'arthropod_exotics',
      group: opts.category || 'arthropod_exotics',
      commonNames: opts.commonNames || [],
      scientificKeywords: opts.scientificKeywords || [],
      lifeStages: opts.lifeStages || [],
      difficulty: opts.difficulty || 'moderate',
      highRiskNotice: opts.highRiskNoticeKey ? h.t(opts.highRiskNoticeKey) : '',
      safetyNotice: opts.safetyNoticeKey ? h.t(opts.safetyNoticeKey) : '',
      riskLevel: opts.riskLevelKey ? h.t(opts.riskLevelKey) : '',
      profileOperationReminder: opts.profileOperationKey ? h.t(opts.profileOperationKey) : '',
      title: h.t(opts.titleKey),
      summary: h.t(opts.summaryKey),
      todayFocus: h.t(opts.todayFocusKey),
      beginnerNotice: h.t(opts.beginnerKey || 'guideData_arthropod_beginner'),
      environment: section_(h.t(opts.envKey), opts.envRanges || null),
      feeding: section_(h.t(opts.feedingKey || 'guideData_arthropod_emptySection')),
      waterQuality: section_(h.t('guideData_arthropod_emptySection')),
      humidity: section_('', opts.humidityRange ? { min: opts.humidityRange[0], max: opts.humidityRange[1], unit: '%' } : null),
      temperature: section_('', opts.tempRange ? { min: opts.tempRange[0], max: opts.tempRange[1], unit: '°C' } : null),
      lighting: section_(h.t(opts.lightingKey || 'guideData_arthropod_emptySection')),
      substrate: section_(h.t(opts.substrateKey || 'guideData_arthropod_emptySection')),
      enclosure: section_(h.t(opts.enclosureKey || 'guideData_arthropod_emptySection')),
      behavior: section_(h.t(opts.behaviorKey || 'guideData_arthropod_emptySection')),
      health: section_(h.t(opts.healthKey || 'guideData_arthropod_emptySection')),
      breeding: section_(h.t(opts.breedingKey || 'guideData_arthropod_emptySection')),
      commonMistakes: splitLines_(h.t(opts.mistakesKey || 'guideData_arthropod_emptySection')),
      dangerSigns: splitLines_(h.t(opts.dangersKey || 'guideData_arthropod_emptySection')),
      recommendedRecords: opts.recommendedRecords || [],
      suggestedTasks: opts.suggestedTasks || [],
      tutorialSteps: opts.tutorialSteps || [],
      lifeStageNotes: opts.lifeStageNotes || {},
      faq: [],
      disclaimer: h.t('guideDisclaimer'),
      recordHints: opts.recordHints || {},
      trendRecordIds: opts.trendRecordIds || [],
      updatedAt: new Date().toISOString(),
    };
  }

  function buildGuides_(h) {
    var spiderRecords = ['feeding', 'humidity', 'molt', 'premolt', 'insect_status', 'photo', 'refused'];
    var spiderHints = {
      humidity: { textKey: 'guideHint_tarantula_humidity' },
      feeding: { textKey: 'guideHint_tarantula_feeding' },
      molt: { textKey: 'guideHint_arthropod_molt' },
      premolt: { textKey: 'guideHint_arthropod_premolt' },
    };
    var colonyRecords = ['humidity', 'feeding', 'substrate', 'egg_laying', 'mortality', 'insect_status', 'photo', 'note'];
    var terrariumRecords = ['humidity', 'aquarium_light', 'substrate', 'plant_status', 'water_change', 'photo', 'note', 'abnormality'];
    var plantRecords = ['aquarium_light', 'humidity', 'substrate', 'plant_status', 'photo', 'note', 'abnormality'];

    return {
      tarantula_general: buildGuide_('tarantula_general', h, {
        titleKey: 'guideData_tarantula_title',
        summaryKey: 'guideData_tarantula_summary',
        todayFocusKey: 'guideData_tarantula_todayFocus',
        envKey: 'guideData_tarantula_env',
        feedingKey: 'guideData_tarantula_feeding',
        enclosureKey: 'guideData_tarantula_enclosure',
        healthKey: 'guideData_tarantula_health',
        mistakesKey: 'guideData_tarantula_mistakes',
        dangersKey: 'guideData_tarantula_dangers',
        safetyNoticeKey: 'guideSafety_tarantula',
        riskLevelKey: 'guideRisk_tarantula',
        profileOperationKey: 'guideProfile_op_tarantula',
        difficulty: 'moderate',
        commonNames: ['tarantula', 'spider', '捕鳥蛛', '蜘蛛'],
        humidityRange: [60, 80],
        recommendedRecords: spiderRecords,
        suggestedTasks: [
          'GUIDE_CHECK_WATER_DISH',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_PREMOLT',
          'GUIDE_REMOVE_UNEATEN',
        ],
        recordHints: spiderHints,
      }),
      scorpion_general: buildGuide_('scorpion_general', h, {
        titleKey: 'guideData_scorpion_title',
        summaryKey: 'guideData_scorpion_summary',
        todayFocusKey: 'guideData_scorpion_todayFocus',
        envKey: 'guideData_scorpion_env',
        feedingKey: 'guideData_scorpion_feeding',
        enclosureKey: 'guideData_scorpion_enclosure',
        healthKey: 'guideData_scorpion_health',
        mistakesKey: 'guideData_scorpion_mistakes',
        dangersKey: 'guideData_scorpion_dangers',
        safetyNoticeKey: 'guideSafety_scorpion',
        riskLevelKey: 'guideRisk_scorpion',
        profileOperationKey: 'guideProfile_op_scorpion',
        difficulty: 'moderate',
        commonNames: ['scorpion', '蠍子', '蠍'],
        tempRange: [24, 28],
        humidityRange: [50, 70],
        recommendedRecords: spiderRecords.concat(['substrate', 'hiding']),
        suggestedTasks: [
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_HIDE',
          'GUIDE_CHECK_TEMPERATURE',
          'GUIDE_CHECK_ESCAPE_PROOF',
          'GUIDE_REMOVE_UNEATEN',
        ],
        recordHints: Object.assign({}, spiderHints, {
          humidity: { textKey: 'guideHint_scorpion_humidity' },
        }),
      }),
      centipede_general: buildGuide_('centipede_general', h, {
        titleKey: 'guideData_centipede_title',
        summaryKey: 'guideData_centipede_summary',
        todayFocusKey: 'guideData_centipede_todayFocus',
        envKey: 'guideData_centipede_env',
        feedingKey: 'guideData_centipede_feeding',
        enclosureKey: 'guideData_centipede_enclosure',
        healthKey: 'guideData_centipede_health',
        mistakesKey: 'guideData_centipede_mistakes',
        dangersKey: 'guideData_centipede_dangers',
        safetyNoticeKey: 'guideSafety_centipede',
        highRiskNoticeKey: 'guideHealthDisclaimerCentipede',
        riskLevelKey: 'guideRisk_centipede',
        profileOperationKey: 'guideProfile_op_centipede',
        difficulty: 'advanced',
        commonNames: ['centipede', '蜈蚣'],
        humidityRange: [70, 85],
        recommendedRecords: spiderRecords.concat(['substrate', 'hiding']),
        suggestedTasks: [
          'GUIDE_CHECK_ESCAPE_PROOF',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_HIDE',
          'GUIDE_REMOVE_UNEATEN',
          'GUIDE_CHECK_PREMOLT',
        ],
        recordHints: spiderHints,
      }),
      isopod_general: buildGuide_('isopod_general', h, {
        titleKey: 'guideData_isopod_title',
        summaryKey: 'guideData_isopod_summary',
        todayFocusKey: 'guideData_isopod_todayFocus',
        envKey: 'guideData_isopod_env',
        feedingKey: 'guideData_isopod_feeding',
        substrateKey: 'guideData_isopod_substrate',
        breedingKey: 'guideData_isopod_breeding',
        healthKey: 'guideData_isopod_health',
        mistakesKey: 'guideData_isopod_mistakes',
        dangersKey: 'guideData_isopod_dangers',
        safetyNoticeKey: 'guideSafety_isopod',
        riskLevelKey: 'guideRisk_isopod',
        profileOperationKey: 'guideProfile_op_isopod',
        difficulty: 'easy',
        commonNames: ['isopod', 'woodlouse', '等足目', '鼠婦', '潮蟲'],
        humidityRange: [60, 80],
        recommendedRecords: colonyRecords,
        suggestedTasks: [
          'GUIDE_CHECK_WET_DRY_ZONE',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_LEAF_LITTER',
          'GUIDE_CHECK_COLONY_DENSITY',
          'GUIDE_CHECK_SUBSTRATE',
        ],
        recordHints: {
          humidity: { textKey: 'guideHint_isopod_humidity' },
          feeding: { textKey: 'guideHint_isopod_feeding' },
          substrate: { textKey: 'guideHint_isopod_substrate' },
          mortality: { textKey: 'guideHint_isopod_mortality' },
        },
      }),
      millipede_general: buildGuide_('millipede_general', h, {
        titleKey: 'guideData_millipede_title',
        summaryKey: 'guideData_millipede_summary',
        todayFocusKey: 'guideData_millipede_todayFocus',
        envKey: 'guideData_millipede_env',
        feedingKey: 'guideData_millipede_feeding',
        substrateKey: 'guideData_millipede_substrate',
        healthKey: 'guideData_millipede_health',
        mistakesKey: 'guideData_millipede_mistakes',
        dangersKey: 'guideData_millipede_dangers',
        safetyNoticeKey: 'guideSafety_millipede',
        riskLevelKey: 'guideRisk_millipede',
        profileOperationKey: 'guideProfile_op_millipede',
        difficulty: 'moderate',
        commonNames: ['millipede', '馬陸'],
        humidityRange: [70, 90],
        recommendedRecords: ['humidity', 'feeding', 'substrate', 'molt', 'calcium', 'insect_status', 'photo', 'note'],
        suggestedTasks: [
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_LEAF_LITTER',
          'GUIDE_CHECK_CALCIUM',
          'GUIDE_CHECK_PREMOLT',
          'GUIDE_CHECK_SUBSTRATE',
        ],
        recordHints: {
          humidity: { textKey: 'guideHint_millipede_humidity' },
          substrate: { textKey: 'guideHint_millipede_substrate' },
          calcium: { textKey: 'guideHint_millipede_calcium' },
        },
      }),
      land_hermit_crab_general: buildGuide_('land_hermit_crab_general', h, {
        titleKey: 'guideData_land_hermit_title',
        summaryKey: 'guideData_land_hermit_summary',
        todayFocusKey: 'guideData_land_hermit_todayFocus',
        envKey: 'guideData_land_hermit_env',
        feedingKey: 'guideData_land_hermit_feeding',
        enclosureKey: 'guideData_land_hermit_enclosure',
        healthKey: 'guideData_land_hermit_health',
        mistakesKey: 'guideData_land_hermit_mistakes',
        dangersKey: 'guideData_land_hermit_dangers',
        safetyNoticeKey: 'guideSafety_land_hermit',
        riskLevelKey: 'guideRisk_land_hermit',
        profileOperationKey: 'guideProfile_op_land_hermit',
        difficulty: 'moderate',
        commonNames: ['land hermit crab', 'hermit crab land', '陸寄居蟹'],
        tempRange: [24, 28],
        humidityRange: [70, 85],
        recommendedRecords: ['humidity', 'temperature', 'feeding', 'substrate', 'shell', 'molt', 'salinity', 'photo', 'note'],
        suggestedTasks: [
          'GUIDE_CHECK_FRESH_SALT_WATER',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_TEMPERATURE',
          'GUIDE_CHECK_DEEP_SUBSTRATE',
          'GUIDE_CHECK_SHELL_OPTIONS',
        ],
        recordHints: {
          humidity: { min: 70, max: 85, unit: '%' },
          temperature: { min: 24, max: 28, unit: '°C' },
          salinity: { textKey: 'guideHint_land_hermit_salt' },
        },
      }),
      terrarium_general: buildGuide_('terrarium_general', h, {
        category: 'plants_terrarium',
        titleKey: 'guideData_terrarium_title',
        summaryKey: 'guideData_terrarium_summary',
        todayFocusKey: 'guideData_terrarium_todayFocus',
        envKey: 'guideData_terrarium_env',
        lightingKey: 'guideData_terrarium_lighting',
        substrateKey: 'guideData_terrarium_substrate',
        healthKey: 'guideData_terrarium_health',
        mistakesKey: 'guideData_terrarium_mistakes',
        dangersKey: 'guideData_terrarium_dangers',
        safetyNoticeKey: 'guideSafety_terrarium',
        riskLevelKey: 'guideRisk_terrarium',
        profileOperationKey: 'guideProfile_op_terrarium',
        difficulty: 'moderate',
        commonNames: ['terrarium', 'vivarium', '生態缸', '雨林缸', 'bioactive'],
        humidityRange: [60, 90],
        recommendedRecords: terrariumRecords,
        suggestedTasks: [
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_VENTILATION',
          'GUIDE_CHECK_PLANT_STATUS',
          'GUIDE_CHECK_MOLD',
          'GUIDE_CHECK_AQUARIUM_LIGHT',
        ],
        recordHints: {
          humidity: { textKey: 'guideHint_terrarium_humidity' },
          aquarium_light: { textKey: 'guideHint_terrarium_light' },
          plant_status: { textKey: 'guideHint_plant_status' },
        },
      }),
      plant_care_general: buildGuide_('plant_care_general', h, {
        category: 'plants_terrarium',
        titleKey: 'guideData_plant_care_title',
        summaryKey: 'guideData_plant_care_summary',
        todayFocusKey: 'guideData_plant_care_todayFocus',
        envKey: 'guideData_plant_care_env',
        lightingKey: 'guideData_plant_care_lighting',
        substrateKey: 'guideData_plant_care_substrate',
        healthKey: 'guideData_plant_care_health',
        mistakesKey: 'guideData_plant_care_mistakes',
        dangersKey: 'guideData_plant_care_dangers',
        safetyNoticeKey: 'guideSafety_plant',
        riskLevelKey: 'guideRisk_plant',
        profileOperationKey: 'guideProfile_op_plant',
        difficulty: 'moderate',
        commonNames: ['plant', 'carnivorous plant', 'orchid', 'moss', '植物', '食蟲植物', '蘭花'],
        recommendedRecords: plantRecords,
        suggestedTasks: [
          'GUIDE_CHECK_AQUARIUM_LIGHT',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_PLANT_STATUS',
          'GUIDE_CHECK_SUBSTRATE',
          'GUIDE_CHECK_VENTILATION',
        ],
        recordHints: {
          aquarium_light: { textKey: 'guideHint_plant_light' },
          humidity: { textKey: 'guideHint_plant_humidity' },
          plant_status: { textKey: 'guideHint_plant_status' },
          substrate: { textKey: 'guideHint_plant_substrate' },
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
    if (/land hermit|陸寄居蟹|hermit crab land/.test(blob)) {
      return 'land_hermit_crab_general';
    }
    if (/centipede|蜈蚣/.test(blob)) return 'centipede_general';
    if (/scorpion|蠍子|蠍/.test(blob)) return 'scorpion_general';
    if (/tarantula|捕鳥蛛|spider|蜘蛛/.test(blob) && !/crab|寄居/.test(blob)) {
      return 'tarantula_general';
    }
    if (/isopod|woodlouse|等足|鼠婦|潮蟲/.test(blob)) return 'isopod_general';
    if (/millipede|馬陸/.test(blob)) return 'millipede_general';
    if (/terrarium|vivarium|生態缸|雨林缸|bioactive/.test(blob)) {
      return 'terrarium_general';
    }
    if (/plant|orchid|moss|carnivorous|食蟲植物|蘭花|植物/.test(blob) && !/planted tank|水草/.test(blob)) {
      return 'plant_care_general';
    }
    if (/arthropod_exotics|arthropod-exotics/.test(blob)) return 'tarantula_general';
    return null;
  }

  global.MCHusbandryCareGuideArthropodTerrarium = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
  };
})(typeof window !== 'undefined' ? window : this);
