/**
 * Husbandry Log — selectable status options (coded values + zhTW/en labels).
 */
(function (global) {
  'use strict';

  function opt(value, zhTW, en) {
    return { value: value, zhTW: zhTW, en: en };
  }

  var SHARED = {
    instar: [
      opt('L1', 'L1', 'L1'),
      opt('L2', 'L2', 'L2'),
      opt('L3', 'L3', 'L3'),
      opt('L4', 'L4', 'L4'),
      opt('L5', 'L5', 'L5'),
      opt('L6', 'L6', 'L6'),
      opt('L7_PLUS', 'L7+', 'L7+'),
      opt('unknown', '不確定', 'Unknown'),
    ],
    feedingStatus: [
      opt('ate', '已進食', 'Ate'),
      opt('ate_less', '少量進食', 'Ate Less'),
      opt('refused', '拒食', 'Refused'),
      opt('not_fed', '未餵食', 'Not Fed'),
      opt('na', '不適用', 'N/A'),
    ],
    moltStatus: [
      opt('normal', '正常', 'Normal'),
      opt('premolt', '脫皮前', 'Premolt'),
      opt('molting', '脫皮中', 'Molting'),
      opt('completed', '脫皮完成', 'Completed'),
      opt('failed', '脫皮失敗', 'Failed Molt'),
      opt('unknown', '不確定', 'Unknown'),
    ],
    activityStatus: [
      opt('active', '活躍', 'Active'),
      opt('normal', '正常', 'Normal'),
      opt('hiding', '躲藏', 'Hiding'),
      opt('slow', '遲緩', 'Slow'),
      opt('abnormal', '異常', 'Abnormal'),
    ],
    healthStatus: [
      opt('normal', '正常', 'Normal'),
      opt('watch', '觀察中', 'Watch'),
      opt('injured', '受傷', 'Injured'),
      opt('weak', '虛弱', 'Weak'),
      opt('dead', '死亡', 'Dead'),
    ],
    substrateStatus: [
      opt('dry', '乾燥', 'Dry'),
      opt('normal', '正常', 'Normal'),
      opt('moist', '偏濕', 'Moist'),
      opt('moldy', '發霉', 'Moldy'),
      opt('replace', '需更換', 'Needs Replacement'),
    ],
  };

  var PANELS = {
    general_insect: {
      type: 'general_insect',
      sections: [
        { key: 'lifeStage', options: [
          opt('egg', '卵', 'Egg'),
          opt('larva_nymph', '幼蟲 / 若蟲', 'Larva / Nymph'),
          opt('pupa', '蛹', 'Pupa'),
          opt('adult', '成蟲', 'Adult'),
        ]},
        { key: 'instar', options: SHARED.instar },
        { key: 'feedingStatus', options: SHARED.feedingStatus.filter(function (o) { return o.value !== 'na'; }) },
        { key: 'moltStatus', options: SHARED.moltStatus },
        { key: 'activityStatus', options: SHARED.activityStatus },
        { key: 'healthStatus', options: SHARED.healthStatus },
        { key: 'substrateStatus', options: SHARED.substrateStatus },
      ],
    },
    beetle_larva: {
      type: 'beetle_larva',
      sections: [
        { key: 'lifeStage', options: [
          opt('L1', 'L1', 'L1'),
          opt('L2', 'L2', 'L2'),
          opt('L3', 'L3', 'L3'),
          opt('pre_pupa', '前蛹', 'Prepupa'),
          opt('pupa', '蛹', 'Pupa'),
          opt('emerged', '羽化', 'Emerged'),
          opt('adult', '成蟲', 'Adult'),
          opt('unknown', '不確定', 'Unknown'),
        ]},
        { key: 'feedingStatus', options: SHARED.feedingStatus.filter(function (o) { return o.value !== 'na'; }) },
        { key: 'substrateStatus', options: [
          opt('normal', '正常', 'Normal'),
          opt('too_dry', '偏乾', 'Too Dry'),
          opt('too_wet', '偏濕', 'Too Wet'),
          opt('moldy', '發霉', 'Moldy'),
          opt('frass_heavy', '糞便過多', 'Too Much Frass'),
          opt('replace', '需要換土', 'Needs Replacement'),
        ]},
        { key: 'activityStatus', options: SHARED.activityStatus },
        { key: 'healthStatus', options: SHARED.healthStatus },
      ],
    },
    mantis: {
      type: 'mantis',
      sections: [
        { key: 'instar', options: SHARED.instar.concat([opt('adult', '成蟲', 'Adult')]) },
        { key: 'moltStatus', options: SHARED.moltStatus.filter(function (o) { return o.value !== 'unknown'; }) },
        { key: 'perchingCondition', options: [
          opt('normal', '正常攀附', 'Normal Perch'),
          opt('unstable', '攀附不穩', 'Unstable Perch'),
          opt('fallen', '掉落', 'Fallen'),
          opt('watch', '需要觀察', 'Needs Watch'),
        ]},
        { key: 'feedingResponse', options: [
          opt('active_hunt', '主動捕食', 'Active Hunt'),
          opt('ate_less', '少量進食', 'Ate Less'),
          opt('refused', '拒食', 'Refused'),
          opt('not_fed', '未餵食', 'Not Fed'),
        ]},
      ],
    },
    arachnid: {
      type: 'arachnid',
      sections: [
        { key: 'feedingStatus', options: [
          opt('ate', '已進食', 'Ate'),
          opt('refused', '拒食', 'Refused'),
          opt('not_fed', '未餵食', 'Not Fed'),
        ]},
        { key: 'moltStatus', options: [
          opt('normal', '正常', 'Normal'),
          opt('premolt', '預脫皮', 'Premolt'),
          opt('molting', '脫皮中', 'Molting'),
          opt('completed', '脫皮完成', 'Completed'),
          opt('failed', '脫皮失敗', 'Failed Molt'),
        ]},
        { key: 'behavior', options: [
          opt('hiding', '躲藏', 'Hiding'),
          opt('normal', '正常活動', 'Normal Activity'),
          opt('defensive', '防禦反應', 'Defensive'),
          opt('aggressive', '攻擊反應', 'Aggressive'),
          opt('slow', '遲緩', 'Slow'),
        ]},
        { key: 'bodyCondition', options: [
          opt('normal', '正常', 'Normal'),
          opt('thin', '偏瘦', 'Thin'),
          opt('plump', '飽滿', 'Plump'),
          opt('abnormal', '異常', 'Abnormal'),
          opt('watch', '需觀察', 'Needs Watch'),
        ]},
      ],
    },
    general_health: {
      type: 'general_health',
      sections: [
        { key: 'healthStatus', options: SHARED.healthStatus },
        { key: 'activityStatus', options: SHARED.activityStatus },
      ],
    },
  };

  function resolvePanelType(profile) {
    if (!profile) return 'general_health';
    var key = profile.careTypeKey || '';
    var cat = profile.category || '';
    if (key === 'beetle-larva' || cat === 'beetle-larva') return 'beetle_larva';
    if (key === 'mantis' || cat === 'mantis') return 'mantis';
    if (key === 'tarantula' || cat === 'arachnid') return 'arachnid';
    if (key === 'general-insect' || cat === 'insect') return 'general_insect';
    return 'general_health';
  }

  function getPanel(profile) {
    var type = resolvePanelType(profile);
    return PANELS[type] || PANELS.general_health;
  }

  function labelOption(option, lang) {
    if (!option) return '';
    return lang === 'en' ? option.en : option.zhTW;
  }

  function findLabel(panelType, sectionKey, value, lang) {
    var panel = PANELS[panelType];
    if (!panel) return value;
    var sec = panel.sections.filter(function (s) { return s.key === sectionKey; })[0];
    if (!sec) return value;
    var o = sec.options.filter(function (x) { return x.value === value; })[0];
    return o ? labelOption(o, lang) : value;
  }

  global.MCInsectStatusOptions = {
    panels: PANELS,
    shared: SHARED,
    getPanel: getPanel,
    resolvePanelType: resolvePanelType,
    labelOption: labelOption,
    findLabel: findLabel,
  };
})(typeof window !== 'undefined' ? window : this);
