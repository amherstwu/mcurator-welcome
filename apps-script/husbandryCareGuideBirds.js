/**
 * Care guide knowledge — Birds category content
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = [
    'finch_general',
    'parrot_general',
    'chick_general',
    'raptor_placeholder',
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
      category: 'birds',
      group: 'birds',
      commonNames: opts.commonNames || [],
      scientificKeywords: opts.scientificKeywords || [],
      lifeStages: opts.lifeStages || [],
      difficulty: opts.difficulty || 'moderate',
      isPlaceholder: !!opts.isPlaceholder,
      highRiskNotice: opts.highRiskNoticeKey ? h.t(opts.highRiskNoticeKey) : '',
      title: h.t(opts.titleKey),
      summary: h.t(opts.summaryKey),
      todayFocus: h.t(opts.todayFocusKey),
      beginnerNotice: h.t(opts.beginnerKey || 'guideData_bird_beginner'),
      environment: section_(h.t(opts.envKey), opts.envRanges || null),
      feeding: section_(h.t(opts.feedingKey || 'guideData_bird_emptySection')),
      waterQuality: section_(h.t(opts.waterQualityKey || 'guideData_bird_emptySection')),
      humidity: section_('', opts.humidityRange ? { min: opts.humidityRange[0], max: opts.humidityRange[1], unit: '%' } : null),
      temperature: section_('', opts.tempRange ? { min: opts.tempRange[0], max: opts.tempRange[1], unit: '°C' } : null),
      lighting: section_(h.t(opts.lightingKey || 'guideData_bird_emptySection')),
      substrate: section_(h.t(opts.substrateKey || 'guideData_bird_emptySection')),
      enclosure: section_(h.t(opts.enclosureKey || 'guideData_bird_emptySection')),
      behavior: section_(h.t(opts.behaviorKey || 'guideData_bird_emptySection')),
      health: section_(h.t(opts.healthKey || 'guideData_bird_emptySection')),
      breeding: section_(h.t('guideData_bird_emptySection')),
      commonMistakes: splitLines_(h.t(opts.mistakesKey || 'guideData_bird_emptySection')),
      dangerSigns: splitLines_(h.t(opts.dangersKey || 'guideData_bird_emptySection')),
      recommendedRecords: opts.recommendedRecords || [],
      suggestedTasks: opts.suggestedTasks || [],
      tutorialSteps: opts.tutorialSteps || [],
      lifeStageNotes: opts.lifeStageNotes || {},
      faq: [],
      disclaimer: h.t('guideDisclaimer'),
      recordHints: opts.recordHints || {},
      trendRecordIds: opts.trendRecordIds || ['weight', 'stool'],
      updatedAt: new Date().toISOString(),
    };
  }

  function buildGuides_(h) {
    var finchTasks = [
      'GUIDE_CHECK_FOOD_WATER',
      'GUIDE_CHECK_DROPPINGS',
      'GUIDE_CHECK_FEATHERS_SPIRIT',
      'GUIDE_CLEAN_TRAY',
      'GUIDE_CHECK_CAGE_SAFETY',
    ];
    var finchRecords = ['weight', 'feeding', 'drinking', 'feather', 'stool', 'activity', 'cage_clean', 'photo'];
    var finchHints = {
      weight: { textKey: 'guideHint_bird_weight' },
      feeding: { textKey: 'guideHint_finch_feeding' },
      drinking: { textKey: 'guideHint_bird_drinking' },
      feather: { textKey: 'guideHint_bird_feather' },
      stool: { textKey: 'guideHint_bird_stool' },
      activity: { textKey: 'guideHint_bird_activity' },
    };

    return {
      finch_general: buildGuide_('finch_general', h, {
        titleKey: 'guideData_finch_title',
        summaryKey: 'guideData_finch_summary',
        todayFocusKey: 'guideData_finch_todayFocus',
        envKey: 'guideData_finch_env',
        feedingKey: 'guideData_finch_feeding',
        enclosureKey: 'guideData_finch_enclosure',
        healthKey: 'guideData_finch_health',
        behaviorKey: 'guideData_finch_behavior',
        mistakesKey: 'guideData_finch_mistakes',
        dangersKey: 'guideData_finch_dangers',
        difficulty: 'moderate',
        commonNames: ['finch', 'java sparrow', 'canary', '文鳥', '十姊妹', '金絲雀'],
        tempRange: [18, 26],
        recommendedRecords: finchRecords,
        suggestedTasks: finchTasks,
        recordHints: finchHints,
        trendRecordIds: ['weight', 'stool'],
      }),
      parrot_general: buildGuide_('parrot_general', h, {
        titleKey: 'guideData_parrot_title',
        summaryKey: 'guideData_parrot_summary',
        todayFocusKey: 'guideData_parrot_todayFocus',
        envKey: 'guideData_parrot_env',
        feedingKey: 'guideData_parrot_feeding',
        enclosureKey: 'guideData_parrot_enclosure',
        behaviorKey: 'guideData_parrot_behavior',
        healthKey: 'guideData_parrot_health',
        mistakesKey: 'guideData_parrot_mistakes',
        dangersKey: 'guideData_parrot_dangers',
        difficulty: 'moderate',
        commonNames: ['parrot', 'cockatiel', 'budgie', 'lovebird', '鸚鵡', '玄鳳', '虎皮', '小鸚'],
        tempRange: [18, 28],
        recommendedRecords: ['weight', 'feeding', 'drinking', 'feather', 'stool', 'activity', 'cage_clean', 'photo'],
        suggestedTasks: [
          'GUIDE_CHECK_FOOD_WATER',
          'GUIDE_CHECK_DROPPINGS',
          'GUIDE_CHECK_FEATHERS_SPIRIT',
          'GUIDE_CHECK_TOYS_CHEW',
          'GUIDE_CHECK_SOCIAL',
        ],
        recordHints: Object.assign({}, finchHints, {
          feeding: { textKey: 'guideHint_parrot_feeding' },
        }),
        trendRecordIds: ['weight', 'stool'],
      }),
      chick_general: buildGuide_('chick_general', h, {
        titleKey: 'guideData_chick_title',
        summaryKey: 'guideData_chick_summary',
        todayFocusKey: 'guideData_chick_todayFocus',
        envKey: 'guideData_chick_env',
        feedingKey: 'guideData_chick_feeding',
        healthKey: 'guideData_chick_health',
        mistakesKey: 'guideData_chick_mistakes',
        dangersKey: 'guideData_chick_dangers',
        highRiskNoticeKey: 'guideHealthDisclaimerChick',
        difficulty: 'advanced',
        commonNames: ['chick', 'hand feeding bird', '幼鳥', 'hand-feeding bird'],
        tempRange: [32, 35],
        recommendedRecords: ['weight', 'feeding', 'crop', 'stool', 'temperature', 'activity', 'photo', 'note'],
        suggestedTasks: [
          'GUIDE_CHECK_WARMTH',
          'GUIDE_CHECK_FEEDING_FREQUENCY',
          'GUIDE_CHECK_CROP',
          'GUIDE_CHECK_WEIGHT',
          'GUIDE_CHECK_DROPPINGS',
        ],
        recordHints: {
          weight: { textKey: 'guideHint_chick_weight' },
          feeding: { textKey: 'guideHint_chick_feeding' },
          crop: { textKey: 'guideHint_chick_crop' },
          temperature: { min: 32, max: 35, unit: '°C' },
          stool: { textKey: 'guideHint_bird_stool' },
        },
        trendRecordIds: ['weight', 'stool'],
      }),
      raptor_placeholder: buildGuide_('raptor_placeholder', h, {
        titleKey: 'guideData_raptor_title',
        summaryKey: 'guideData_raptor_summary',
        todayFocusKey: 'guideData_raptor_todayFocus',
        envKey: 'guideData_raptor_env',
        feedingKey: 'guideData_raptor_feeding',
        healthKey: 'guideData_raptor_health',
        mistakesKey: 'guideData_raptor_emptySection',
        dangersKey: 'guideData_raptor_emptySection',
        isPlaceholder: true,
        difficulty: 'restricted',
        commonNames: ['raptor', 'owl', 'hawk', 'eagle', '猛禽', '貓頭鷹', '老鷹'],
        recommendedRecords: ['weight', 'note', 'photo'],
        suggestedTasks: [],
        trendRecordIds: ['weight'],
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
      pet.lifeStage,
    ].join(' ').toLowerCase();
  }

  function matchGuideId_(pet) {
    if (!pet) return null;
    var blob = petBlob_(pet);
    if (/chick|幼鳥|hand feeding|hand-feeding|hand rearing/.test(blob)) {
      return 'chick_general';
    }
    if (/raptor|猛禽|\bowl\b|hawk|eagle|falcon|鷹|貓頭鷹|老鷹|隼/.test(blob)) {
      return 'raptor_placeholder';
    }
    if (/parrot|cockatiel|budgie|lovebird|鸚鵡|玄鳳|虎皮|小鸚|conure|macaw|cockatoo/.test(blob)) {
      return 'parrot_general';
    }
    if (/finch|java sparrow|canary|文鳥|十姊妹|金絲雀|sparrow|zebra finch|雀/.test(blob)) {
      return 'finch_general';
    }
    if (/bird|鳥|passerine|avian/.test(blob) && !/fish|魚|aquarium|水族/.test(blob)) {
      return 'finch_general';
    }
    return null;
  }

  global.MCHusbandryCareGuideBirds = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
  };
})(typeof window !== 'undefined' ? window : this);
