/**
 * Care guide knowledge — Insects / beetles category content
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = [
    'beetle_adult_general',
    'beetle_larva_general',
    'mantis_general',
    'stick_insect_general',
    'ant_colony_general',
  ];

  function splitLines_(text) {
    return String(text || '').split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function section_(notes, ranges) {
    return { summary: '', notes: notes || '', ranges: ranges || null, items: [] };
  }

  function lifeStageNotes_(h, keys) {
    var out = {};
    if (keys.adult) out.adult = h.t(keys.adult);
    if (keys.juvenile) out.juvenile = h.t(keys.juvenile);
    if (keys.subadult) out.subadult = h.t(keys.subadult);
    if (keys.egg) out.egg = h.t(keys.egg);
    if (keys.pupa) out.pupa = h.t(keys.pupa);
    return out;
  }

  function buildGuide_(id, h, opts) {
    return {
      id: id,
      category: 'insects_beetles',
      group: 'insects_beetles',
      commonNames: opts.commonNames || [],
      scientificKeywords: opts.scientificKeywords || [],
      lifeStages: opts.lifeStages || [],
      difficulty: opts.difficulty || 'moderate',
      title: h.t(opts.titleKey),
      summary: h.t(opts.summaryKey),
      todayFocus: h.t(opts.todayFocusKey),
      beginnerNotice: h.t(opts.beginnerKey || 'guideData_insect_beginner'),
      environment: section_(h.t(opts.envKey), opts.envRanges || null),
      feeding: section_(h.t(opts.feedingKey)),
      waterQuality: section_(h.t('guideData_insect_emptySection')),
      humidity: section_('', opts.humidityRange ? { min: opts.humidityRange[0], max: opts.humidityRange[1], unit: '%' } : null),
      temperature: section_('', opts.tempRange ? { min: opts.tempRange[0], max: opts.tempRange[1], unit: '°C' } : null),
      lighting: section_(h.t('guideData_insect_emptySection')),
      substrate: section_(h.t(opts.substrateKey || 'guideData_insect_emptySection')),
      enclosure: section_(h.t(opts.enclosureKey || 'guideData_insect_emptySection')),
      behavior: section_(h.t(opts.behaviorKey || 'guideData_insect_emptySection')),
      health: section_(h.t(opts.healthKey)),
      breeding: section_(h.t(opts.breedingKey || 'guideData_insect_emptySection')),
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
      beetle_adult_general: buildGuide_('beetle_adult_general', h, {
        titleKey: 'guideData_beetle_adult_title',
        summaryKey: 'guideData_beetle_adult_summary',
        todayFocusKey: 'guideData_beetle_adult_todayFocus',
        envKey: 'guideData_beetle_adult_env',
        feedingKey: 'guideData_beetle_adult_feeding',
        healthKey: 'guideData_beetle_adult_health',
        breedingKey: 'guideData_beetle_adult_breeding',
        substrateKey: 'guideData_beetle_adult_substrate',
        behaviorKey: 'guideData_beetle_adult_behavior',
        mistakesKey: 'guideData_beetle_adult_mistakes',
        dangersKey: 'guideData_beetle_adult_dangers',
        difficulty: 'moderate',
        commonNames: ['beetle', 'stag beetle', 'rhinoceros beetle', 'scarab beetle', '甲蟲', '兜蟲', '鍬形蟲', '金龜子', '獨角仙', '甲蟲成蟲'],
        humidityRange: [60, 80],
        tempRange: [18, 26],
        recommendedRecords: ['feeding', 'humidity', 'insect_status', 'weight', 'egg_laying', 'substrate', 'photo'],
        suggestedTasks: [
          'GUIDE_CHECK_JELLY_DRY',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_ACTIVITY',
          'GUIDE_REMOVE_MOLDY_FOOD',
          'GUIDE_CHECK_UPSIDE_DOWN',
        ],
        lifeStageNotes: lifeStageNotes_(h, {
          adult: 'guideData_beetle_adult_stage_adult',
          subadult: 'guideData_beetle_adult_stage_subadult',
          egg: 'guideData_beetle_stage_egg',
          pupa: 'guideData_beetle_stage_pupa',
        }),
        recordHints: {
          humidity: { min: 60, max: 80, unit: '%' },
          temperature: { min: 18, max: 26, unit: '°C' },
          feeding: { textKey: 'guideHint_beetle_adult_feeding' },
          substrate: { textKey: 'guideHint_beetle_substrate' },
          weight: { textKey: 'guideHint_beetle_weight' },
        },
      }),
      beetle_larva_general: buildGuide_('beetle_larva_general', h, {
        titleKey: 'guideData_beetle_larva_title',
        summaryKey: 'guideData_beetle_larva_summary',
        todayFocusKey: 'guideData_beetle_larva_todayFocus',
        envKey: 'guideData_beetle_larva_env',
        feedingKey: 'guideData_beetle_larva_feeding',
        healthKey: 'guideData_beetle_larva_health',
        substrateKey: 'guideData_beetle_larva_substrate',
        mistakesKey: 'guideData_beetle_larva_mistakes',
        dangersKey: 'guideData_beetle_larva_dangers',
        difficulty: 'moderate',
        commonNames: ['beetle larva', 'grub', '甲蟲幼蟲', '兜蟲幼蟲', '鍬形蟲幼蟲'],
        humidityRange: [65, 85],
        recommendedRecords: ['weight', 'substrate', 'frass', 'humidity', 'substrate_change', 'instar', 'pupation', 'molt'],
        suggestedTasks: [
          'GUIDE_CHECK_SUBSTRATE_MOISTURE',
          'GUIDE_CHECK_MOLD',
          'GUIDE_CHECK_LARVA_ACTIVITY',
          'GUIDE_LOG_WEIGHT_DUE',
          'GUIDE_PUPA_QUIET',
        ],
        lifeStageNotes: lifeStageNotes_(h, {
          juvenile: 'guideData_beetle_larva_stage_juvenile',
          subadult: 'guideData_beetle_larva_stage_subadult',
          egg: 'guideData_beetle_stage_egg',
          pupa: 'guideData_beetle_stage_pupa',
        }),
        recordHints: {
          humidity: { min: 65, max: 85, unit: '%' },
          weight: { textKey: 'guideHint_beetle_larva_weight' },
          substrate: { textKey: 'guideHint_beetle_larva_substrate' },
          frass: { textKey: 'guideHint_beetle_larva_frass' },
        },
      }),
      mantis_general: buildGuide_('mantis_general', h, {
        titleKey: 'guideData_mantis_title',
        summaryKey: 'guideData_mantis_summary',
        todayFocusKey: 'guideData_mantis_todayFocus',
        envKey: 'guideData_mantis_env',
        feedingKey: 'guideData_mantis_feeding',
        healthKey: 'guideData_mantis_health',
        breedingKey: 'guideData_mantis_breeding',
        enclosureKey: 'guideData_mantis_enclosure',
        mistakesKey: 'guideData_mantis_mistakes',
        dangersKey: 'guideData_mantis_dangers',
        difficulty: 'moderate',
        commonNames: ['mantis', '螳螂', '蟋蟀', '螽斯', 'cricket', 'grasshopper'],
        humidityRange: [50, 70],
        recommendedRecords: ['feeding', 'humidity', 'instar', 'insect_status', 'photo', 'egg_laying'],
        suggestedTasks: [
          'GUIDE_CHECK_VENTILATION',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_MOLT_SPACE',
          'GUIDE_CHECK_MOLT_SIGNS',
        ],
        lifeStageNotes: lifeStageNotes_(h, {
          adult: 'guideData_mantis_stage_adult',
          juvenile: 'guideData_mantis_stage_juvenile',
          egg: 'guideData_mantis_stage_egg',
        }),
        recordHints: {
          humidity: { min: 50, max: 70, unit: '%' },
          feeding: { textKey: 'guideHint_mantis_feeding' },
        },
      }),
      stick_insect_general: buildGuide_('stick_insect_general', h, {
        titleKey: 'guideData_stick_insect_title',
        summaryKey: 'guideData_stick_insect_summary',
        todayFocusKey: 'guideData_stick_insect_todayFocus',
        envKey: 'guideData_stick_insect_env',
        feedingKey: 'guideData_stick_insect_feeding',
        healthKey: 'guideData_stick_insect_health',
        enclosureKey: 'guideData_stick_insect_enclosure',
        mistakesKey: 'guideData_stick_insect_mistakes',
        dangersKey: 'guideData_stick_insect_dangers',
        difficulty: 'easy',
        commonNames: ['stick insect', 'leaf insect', '竹節蟲', '葉脩', '叶脩'],
        humidityRange: [55, 75],
        recommendedRecords: ['feeding', 'humidity', 'instar', 'photo', 'egg_laying'],
        suggestedTasks: [
          'GUIDE_REFRESH_FOOD_PLANT',
          'GUIDE_CHECK_VENTILATION',
          'GUIDE_CHECK_HUMIDITY',
          'GUIDE_CHECK_MOLT_SPACE',
          'GUIDE_LOG_EGGS',
        ],
        lifeStageNotes: lifeStageNotes_(h, {
          adult: 'guideData_stick_stage_adult',
          juvenile: 'guideData_stick_stage_juvenile',
          egg: 'guideData_stick_stage_egg',
        }),
        recordHints: {
          humidity: { min: 55, max: 75, unit: '%' },
          feeding: { textKey: 'guideHint_stick_feeding' },
        },
      }),
      ant_colony_general: buildGuide_('ant_colony_general', h, {
        titleKey: 'guideData_ant_colony_title',
        summaryKey: 'guideData_ant_colony_summary',
        todayFocusKey: 'guideData_ant_colony_todayFocus',
        envKey: 'guideData_ant_colony_env',
        feedingKey: 'guideData_ant_colony_feeding',
        healthKey: 'guideData_ant_colony_health',
        behaviorKey: 'guideData_ant_colony_behavior',
        mistakesKey: 'guideData_ant_colony_mistakes',
        dangersKey: 'guideData_ant_colony_dangers',
        difficulty: 'advanced',
        commonNames: ['ant', 'ant colony', '螞蟻', '蚁'],
        humidityRange: [50, 70],
        recommendedRecords: ['feeding', 'humidity', 'insect_status', 'photo', 'note'],
        suggestedTasks: [
          'GUIDE_CHECK_NEST_HUMIDITY',
          'GUIDE_CHECK_ESCAPE_PROOF',
          'GUIDE_CHECK_FEEDING',
          'GUIDE_CHECK_QUEEN',
          'GUIDE_MINIMIZE_VIBRATION',
        ],
        lifeStageNotes: lifeStageNotes_(h, {
          adult: 'guideData_ant_stage_adult',
          juvenile: 'guideData_ant_stage_brood',
          egg: 'guideData_ant_stage_egg',
        }),
        recordHints: {
          humidity: { min: 50, max: 70, unit: '%' },
          feeding: { textKey: 'guideHint_ant_feeding' },
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
      pet.instarLabel,
      pet.lifeStage,
    ].join(' ').toLowerCase();
  }

  function isBeetleBlob_(blob) {
    return /beetle|甲蟲|兜蟲|鍬形蟲|金龜|獨角仙|rhinoceros|stag|scarab|dynastes|prosopocoilus|allomyrina/.test(blob);
  }

  function isBeetleLarva_(pet, blob) {
    if (pet.category === 'beetle-larva') return true;
    if (/^l[123]$/.test(String(pet.instarLabel || '').trim().toLowerCase())) return true;
    if (/larva|grub|幼蟲|幼虫|幼体|幼體/.test(blob)) return true;
    if (pet.lifeStage === 'juvenile' && isBeetleBlob_(blob)) return true;
    if (/pupa|蛹|pupation|化蛹/.test(blob) && isBeetleBlob_(blob)) return true;
    return false;
  }

  function isBeetleAdult_(pet, blob) {
    if (pet.category === 'beetle-adult') return true;
    if (pet.lifeStage === 'adult' && isBeetleBlob_(blob)) return true;
    if (/成蟲|成虫|adult beetle|甲蟲成蟲/.test(blob)) return true;
    if (isBeetleBlob_(blob) && !isBeetleLarva_(pet, blob)) return true;
    return false;
  }

  function matchGuideId_(pet) {
    if (!pet) return null;
    var blob = petBlob_(pet);
    if (/ant colony|螞蟻|蚂蚁|\bant\b/.test(blob) && !/mantis|螳螂/.test(blob)) {
      return 'ant_colony_general';
    }
    if (/mantis|螳螂/.test(blob)) return 'mantis_general';
    if (/stick insect|leaf insect|竹節蟲|葉脩|叶脩|phasmid/.test(blob)) {
      return 'stick_insect_general';
    }
    if (/cricket|grasshopper|蟋蟀|螽斯|katydid/.test(blob)) return 'mantis_general';
    if (isBeetleLarva_(pet, blob)) return 'beetle_larva_general';
    if (isBeetleAdult_(pet, blob)) return 'beetle_adult_general';
    if (/insect|昆蟲|虫类|蟲類/.test(blob)) return 'beetle_adult_general';
    return null;
  }

  global.MCHusbandryCareGuideInsects = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
    isBeetleLarva: function (pet) { return isBeetleLarva_(pet, petBlob_(pet)); },
  };
})(typeof window !== 'undefined' ? window : this);
