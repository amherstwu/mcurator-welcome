/**
 * Care guide — general fallback
 */
(function (global) {
  'use strict';

  var GUIDE_IDS = ['general_care'];

  function buildGuides_(h) {
    return {
      general_care: {
        id: 'general_care',
        category: 'general',
        group: 'general',
        commonNames: [],
        scientificKeywords: [],
        lifeStages: [],
        difficulty: 'easy',
        title: h.t('guideData_general_title'),
        summary: h.t('guideData_general_summary'),
        todayFocus: h.t('guideData_general_todayFocus'),
        beginnerNotice: h.t('guideData_general_beginner'),
        environment: { summary: '', notes: h.t('guideData_general_env'), ranges: null, items: [] },
        feeding: { summary: '', notes: h.t('guideData_general_feeding'), ranges: null, items: [] },
        waterQuality: { summary: '', notes: '', ranges: null, items: [] },
        humidity: { summary: '', notes: '', ranges: null, items: [] },
        temperature: { summary: '', notes: '', ranges: null, items: [] },
        lighting: { summary: '', notes: '', ranges: null, items: [] },
        substrate: { summary: '', notes: '', ranges: null, items: [] },
        enclosure: { summary: '', notes: '', ranges: null, items: [] },
        behavior: { summary: '', notes: '', ranges: null, items: [] },
        health: { summary: '', notes: h.t('guideData_general_health'), ranges: null, items: [] },
        breeding: { summary: '', notes: '', ranges: null, items: [] },
        commonMistakes: [],
        dangerSigns: [],
        recommendedRecords: ['photo', 'feeding', 'weight', 'note', 'activity', 'abnormality'],
        suggestedTasks: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_ACTIVITY', 'GUIDE_LOG_WEIGHT_DUE'],
        tutorialSteps: [
          { id: 'gen_observe', titleKey: 'guideTutorial_gen_observe' },
          { id: 'gen_setup', titleKey: 'guideTutorial_gen_setup' },
          { id: 'gen_log', titleKey: 'guideTutorial_gen_log' },
          { id: 'gen_review', titleKey: 'guideTutorial_gen_review' },
        ],
        faq: [],
        disclaimer: h.t('guideDisclaimer'),
        recordHints: {},
        trendRecordIds: ['weight'],
        updatedAt: new Date().toISOString(),
      },
    };
  }

  function matchGuideId_(pet) {
    return null;
  }

  global.MCHusbandryCareGuideGeneral = {
    GUIDE_IDS: GUIDE_IDS,
    buildGuides: buildGuides_,
    matchGuideId: matchGuideId_,
  };
})(typeof window !== 'undefined' ? window : this);
