/**
 * Care guide knowledge — Small mammals category content
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = [
    'hamster_general',
    'guinea_pig_general',
    'rabbit_general',
    'hedgehog_general',
    'sugar_glider_general',
    'chinchilla_general',
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
      category: 'small_mammals',
      group: 'small_mammals',
      commonNames: opts.commonNames || [],
      scientificKeywords: opts.scientificKeywords || [],
      lifeStages: opts.lifeStages || [],
      difficulty: opts.difficulty || 'moderate',
      highRiskNotice: opts.highRiskNoticeKey ? h.t(opts.highRiskNoticeKey) : '',
      title: h.t(opts.titleKey),
      summary: h.t(opts.summaryKey),
      todayFocus: h.t(opts.todayFocusKey),
      beginnerNotice: h.t(opts.beginnerKey || 'guideData_mammal_beginner'),
      profileEnclosure: opts.profileEnclosureKey ? h.t(opts.profileEnclosureKey) : '',
      profileFeeding: opts.profileFeedingKey ? h.t(opts.profileFeedingKey) : '',
      profileCleaning: opts.profileCleaningKey ? h.t(opts.profileCleaningKey) : '',
      profileHealth: opts.profileHealthKey ? h.t(opts.profileHealthKey) : '',
      environment: section_(h.t(opts.envKey), opts.envRanges || null),
      feeding: section_(h.t(opts.feedingKey || 'guideData_mammal_emptySection')),
      waterQuality: section_(h.t('guideData_mammal_emptySection')),
      humidity: section_('', opts.humidityRange ? { min: opts.humidityRange[0], max: opts.humidityRange[1], unit: '%' } : null),
      temperature: section_('', opts.tempRange ? { min: opts.tempRange[0], max: opts.tempRange[1], unit: '°C' } : null),
      lighting: section_(h.t(opts.lightingKey || 'guideData_mammal_emptySection')),
      substrate: section_(h.t(opts.substrateKey || 'guideData_mammal_emptySection')),
      enclosure: section_(h.t(opts.enclosureKey || 'guideData_mammal_emptySection')),
      behavior: section_(h.t(opts.behaviorKey || 'guideData_mammal_emptySection')),
      health: section_(h.t(opts.healthKey || 'guideData_mammal_emptySection')),
      breeding: section_(h.t('guideData_mammal_emptySection')),
      commonMistakes: splitLines_(h.t(opts.mistakesKey || 'guideData_mammal_emptySection')),
      dangerSigns: splitLines_(h.t(opts.dangersKey || 'guideData_mammal_emptySection')),
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
    var mammalRecords = ['weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean', 'photo'];
    var mammalHints = {
      weight: { textKey: 'guideHint_mammal_weight' },
      feeding: { textKey: 'guideHint_mammal_feeding' },
      drinking: { textKey: 'guideHint_mammal_drinking' },
      stool: { textKey: 'guideHint_mammal_stool' },
      activity: { textKey: 'guideHint_mammal_activity' },
      teeth: { textKey: 'guideHint_mammal_teeth' },
      fur: { textKey: 'guideHint_mammal_fur' },
      cage_clean: { textKey: 'guideHint_mammal_clean' },
    };
    var hamsterTasks = [
      'GUIDE_CHECK_DRINKING',
      'GUIDE_CHECK_FOOD_WATER',
      'GUIDE_CHECK_MAMMAL_ACTIVITY',
      'GUIDE_CHECK_WHEEL_SAFETY',
      'GUIDE_CHECK_SUBSTRATE_DROPPINGS',
    ];
    var profileKeys = function (prefix) {
      return {
        profileEnclosureKey: 'guideProfile_' + prefix + '_enclosure',
        profileFeedingKey: 'guideProfile_' + prefix + '_feeding',
        profileCleaningKey: 'guideProfile_' + prefix + '_cleaning',
        profileHealthKey: 'guideProfile_' + prefix + '_health',
      };
    };

    return {
      hamster_general: buildGuide_('hamster_general', h, Object.assign({
        titleKey: 'guideData_hamster_title',
        summaryKey: 'guideData_hamster_summary',
        todayFocusKey: 'guideData_hamster_todayFocus',
        envKey: 'guideData_hamster_env',
        feedingKey: 'guideData_hamster_feeding',
        enclosureKey: 'guideData_hamster_enclosure',
        substrateKey: 'guideData_hamster_substrate',
        behaviorKey: 'guideData_hamster_behavior',
        healthKey: 'guideData_hamster_health',
        mistakesKey: 'guideData_hamster_mistakes',
        dangersKey: 'guideData_hamster_dangers',
        difficulty: 'moderate',
        commonNames: ['hamster', 'syrian hamster', 'dwarf hamster', 'gerbil', 'mouse', 'rat', '倉鼠', '黃金鼠', '侏儒倉鼠', '沙鼠', '小鼠', '大鼠'],
        tempRange: [18, 24],
        recommendedRecords: mammalRecords,
        suggestedTasks: hamsterTasks,
        recordHints: mammalHints,
        trendRecordIds: ['weight', 'stool'],
      }, profileKeys('hamster'))),
      guinea_pig_general: buildGuide_('guinea_pig_general', h, Object.assign({
        titleKey: 'guideData_guinea_pig_title',
        summaryKey: 'guideData_guinea_pig_summary',
        todayFocusKey: 'guideData_guinea_pig_todayFocus',
        envKey: 'guideData_guinea_pig_env',
        feedingKey: 'guideData_guinea_pig_feeding',
        enclosureKey: 'guideData_guinea_pig_enclosure',
        healthKey: 'guideData_guinea_pig_health',
        behaviorKey: 'guideData_guinea_pig_behavior',
        mistakesKey: 'guideData_guinea_pig_mistakes',
        dangersKey: 'guideData_guinea_pig_dangers',
        difficulty: 'moderate',
        commonNames: ['guinea pig', 'cavy', '天竺鼠'],
        tempRange: [18, 24],
        recommendedRecords: mammalRecords,
        suggestedTasks: [
          'GUIDE_CHECK_HAY',
          'GUIDE_CHECK_FOOD_WATER',
          'GUIDE_CHECK_DROPPINGS',
          'GUIDE_CHECK_WEIGHT',
          'GUIDE_CHECK_SOCIAL',
        ],
        recordHints: Object.assign({}, mammalHints, {
          feeding: { textKey: 'guideHint_guinea_feeding' },
        }),
        trendRecordIds: ['weight', 'stool'],
      }, profileKeys('guinea_pig'))),
      rabbit_general: buildGuide_('rabbit_general', h, Object.assign({
        titleKey: 'guideData_rabbit_title',
        summaryKey: 'guideData_rabbit_summary',
        todayFocusKey: 'guideData_rabbit_todayFocus',
        envKey: 'guideData_rabbit_env',
        feedingKey: 'guideData_rabbit_feeding',
        enclosureKey: 'guideData_rabbit_enclosure',
        healthKey: 'guideData_rabbit_health',
        behaviorKey: 'guideData_rabbit_behavior',
        mistakesKey: 'guideData_rabbit_mistakes',
        dangersKey: 'guideData_rabbit_dangers',
        highRiskNoticeKey: 'guideHealthDisclaimerRabbitEmergency',
        difficulty: 'moderate',
        commonNames: ['rabbit', 'bunny', '兔子'],
        tempRange: [15, 22],
        recommendedRecords: mammalRecords,
        suggestedTasks: [
          'GUIDE_CHECK_HAY',
          'GUIDE_CHECK_FOOD_WATER',
          'GUIDE_CHECK_DROPPINGS',
          'GUIDE_CHECK_MAMMAL_ACTIVITY',
          'GUIDE_CHECK_WEIGHT',
        ],
        recordHints: Object.assign({}, mammalHints, {
          feeding: { textKey: 'guideHint_rabbit_feeding' },
          stool: { textKey: 'guideHint_rabbit_stool' },
        }),
        trendRecordIds: ['weight', 'stool'],
      }, profileKeys('rabbit'))),
      hedgehog_general: buildGuide_('hedgehog_general', h, Object.assign({
        titleKey: 'guideData_hedgehog_title',
        summaryKey: 'guideData_hedgehog_summary',
        todayFocusKey: 'guideData_hedgehog_todayFocus',
        envKey: 'guideData_hedgehog_env',
        feedingKey: 'guideData_hedgehog_feeding',
        enclosureKey: 'guideData_hedgehog_enclosure',
        healthKey: 'guideData_hedgehog_health',
        mistakesKey: 'guideData_hedgehog_mistakes',
        dangersKey: 'guideData_hedgehog_dangers',
        difficulty: 'moderate',
        commonNames: ['hedgehog', 'african pygmy hedgehog', '刺蝟'],
        tempRange: [22, 26],
        recommendedRecords: mammalRecords.concat(['temperature']),
        suggestedTasks: [
          'GUIDE_CHECK_TEMPERATURE',
          'GUIDE_CHECK_FOOD_WATER',
          'GUIDE_CHECK_WHEEL_SAFETY',
          'GUIDE_CHECK_FOOT_PADS',
          'GUIDE_CHECK_WEIGHT',
        ],
        recordHints: Object.assign({}, mammalHints, {
          temperature: { min: 22, max: 26, unit: '°C' },
          fur: { textKey: 'guideHint_hedgehog_skin' },
        }),
        trendRecordIds: ['weight', 'stool'],
      }, profileKeys('hedgehog'))),
      sugar_glider_general: buildGuide_('sugar_glider_general', h, Object.assign({
        titleKey: 'guideData_sugar_glider_title',
        summaryKey: 'guideData_sugar_glider_summary',
        todayFocusKey: 'guideData_sugar_glider_todayFocus',
        envKey: 'guideData_sugar_glider_env',
        feedingKey: 'guideData_sugar_glider_feeding',
        enclosureKey: 'guideData_sugar_glider_enclosure',
        behaviorKey: 'guideData_sugar_glider_behavior',
        healthKey: 'guideData_sugar_glider_health',
        mistakesKey: 'guideData_sugar_glider_mistakes',
        dangersKey: 'guideData_sugar_glider_dangers',
        difficulty: 'advanced',
        commonNames: ['sugar glider', '蜜袋鼯'],
        tempRange: [24, 30],
        recommendedRecords: mammalRecords,
        suggestedTasks: [
          'GUIDE_CHECK_FOOD_WATER',
          'GUIDE_CHECK_DROPPINGS',
          'GUIDE_CHECK_SOCIAL',
          'GUIDE_CHECK_WEIGHT',
          'GUIDE_CHECK_FUR',
        ],
        recordHints: Object.assign({}, mammalHints, {
          feeding: { textKey: 'guideHint_glider_feeding' },
        }),
        trendRecordIds: ['weight', 'stool'],
      }, profileKeys('sugar_glider'))),
      chinchilla_general: buildGuide_('chinchilla_general', h, Object.assign({
        titleKey: 'guideData_chinchilla_title',
        summaryKey: 'guideData_chinchilla_summary',
        todayFocusKey: 'guideData_chinchilla_todayFocus',
        envKey: 'guideData_chinchilla_env',
        feedingKey: 'guideData_chinchilla_feeding',
        enclosureKey: 'guideData_chinchilla_enclosure',
        healthKey: 'guideData_chinchilla_health',
        mistakesKey: 'guideData_chinchilla_mistakes',
        dangersKey: 'guideData_chinchilla_dangers',
        difficulty: 'moderate',
        commonNames: ['chinchilla', '龍貓'],
        tempRange: [16, 22],
        humidityRange: [40, 60],
        recommendedRecords: mammalRecords.concat(['temperature']),
        suggestedTasks: [
          'GUIDE_CHECK_TEMPERATURE',
          'GUIDE_CHECK_HAY',
          'GUIDE_CHECK_DUST_BATH',
          'GUIDE_CHECK_DROPPINGS',
          'GUIDE_CHECK_TEETH',
        ],
        recordHints: Object.assign({}, mammalHints, {
          temperature: { max: 25, unit: '°C' },
          feeding: { textKey: 'guideHint_chinchilla_feeding' },
        }),
        trendRecordIds: ['weight', 'stool'],
      }, profileKeys('chinchilla'))),
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
    if (/rabbit|bunny|兔子/.test(blob)) return 'rabbit_general';
    if (/guinea pig|cavy|天竺鼠/.test(blob)) return 'guinea_pig_general';
    if (/chinchilla|龍貓/.test(blob)) return 'chinchilla_general';
    if (/hedgehog|刺蝟/.test(blob)) return 'hedgehog_general';
    if (/sugar glider|蜜袋鼯/.test(blob)) return 'sugar_glider_general';
    if (/hamster|syrian|dwarf hamster|gerbil|mouse|rat|倉鼠|黃金鼠|侏儒倉鼠|沙鼠|小鼠|大鼠/.test(blob)) {
      return 'hamster_general';
    }
    if (/small mammal|small_mammals|small-mammals/.test(blob)) return 'hamster_general';
    return null;
  }

  global.MCHusbandryCareGuideSmallMammals = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
  };
})(typeof window !== 'undefined' ? window : this);
