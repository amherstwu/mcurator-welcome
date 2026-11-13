/**
 * Achievement Center — default rule objects (merge with CMS / settings JSON later).
 * Loaded before researcher-progress-center.js
 */
(function () {
  'use strict';

  var _rpcC = (typeof window !== 'undefined' && window.MCResearcherProgressCopy) || {};
  function rpcPickPair(obj) {
    if (!obj) return '';
    if (typeof mcPick === 'function') return mcPick({ zh: obj.zhAlt || obj.zh || '', en: obj.en || '' });
    var en = false;
    try {
      if (typeof mcGetLang === 'function') en = mcGetLang() === 'en';
      else if (typeof state !== 'undefined' && state && state.lang === 'en') en = true;
    } catch (eLang) {
      void 0;
    }
    return en ? String(obj.en || '') : String(obj.zhAlt || obj.zh || '');
  }

  var C = {
    meta: {
      id: 'researcher-progress-defaults',
      version: 1,
      nameEn: 'Achievement Center',
      nameZh: '成就中心'
    },

    xpRules: {
      daily_sign_in: 10,
      create_specimen_record: 30,
      upload_specimen_photo: 15,
      add_scientific_name: 20,
      add_classification: 20,
      add_locality: 20,
      add_gps_coordinates: 30,
      add_collection_date_or_collector: 15,
      complete_high_quality_specimen: 80,
      fossil_before_after_photo: 40,
      photo_restoration_lab: 50,
      create_passport_card: 50,
      create_sat_asset: 80,
      publish_museum_showcase: 100,
      taxonomy_note: 60,
      taxonomy_manuscript_draft: 200,
      admin_approved_record: 150,
      admin_featured_record: 100,
      favorited_by_user: 10
    },

    researchPointRules: {
      complete_specimen_record: 5,
      gps_record: 3,
      high_quality_photo: 3,
      approved_record: 10,
      rare_species_record: 15,
      taxonomy_completion: 8,
      public_showcase: 5,
      featured_collection: 30
    },

    completenessWeights: {
      nameOrTemp: 10,
      scientificName: 15,
      classification: 15,
      specimenPhoto: 15,
      collectionDate: 10,
      locality: 10,
      gps: 10,
      collectorOrSource: 5,
      descriptionOrNotes: 5,
      passportCard: 5
    },

    completenessStatus: [
      { max: 39, key: 'draft' },
      { max: 69, key: 'basic' },
      { max: 89, key: 'complete' },
      { max: 100, key: 'high_quality' }
    ],

    levelStages: [
      { minLevel: 1, maxLevel: 3, key: 'beginner', en: 'Beginner Collector', zh: '初學收藏者' },
      { minLevel: 4, maxLevel: 7, key: 'field', en: 'Field Recorder', zh: '田野紀錄者' },
      { minLevel: 8, maxLevel: 12, key: 'keeper', en: 'Specimen Keeper', zh: '標本守護者' },
      { minLevel: 13, maxLevel: 18, key: 'archive', en: 'Archive Curator', zh: '典藏整理師' },
      { minLevel: 19, maxLevel: 25, key: 'tax_app', en: 'Taxonomy Apprentice', zh: '分類學見習者' },
      { minLevel: 26, maxLevel: 35, key: 'curator', en: 'Museum Curator', zh: '博物館策展人' },
      { minLevel: 36, maxLevel: 50, key: 'guardian', en: 'Scientific Asset Guardian', zh: '科學資產守護者' },
      { minLevel: 51, maxLevel: 9999, key: 'grand', en: 'Grand Naturalist', zh: '大博物學家' }
    ],

    levelXpFormula: { base: 500, perLevel: 180 },

    streakRewards: [
      { days: 3, xp: 30, titleId: '', badgeId: '' },
      { days: 7, xp: 0, titleId: 'title_checkin_master', badgeId: '' },
      { days: 14, xp: 100, rp: 20, titleId: '', badgeId: '' },
      { days: 30, xp: 0, titleId: '', badgeId: 'badge_monthly_streak' },
      { days: 60, xp: 0, titleId: 'title_streak_scholar', badgeId: '' },
      { days: 100, xp: 0, titleId: '', badgeId: 'badge_legendary_streak' }
    ],

    collectionMilestones: [
      { id: 'm10', count: 10, key: 'mini', en: 'Mini collection', zh: '小型典藏', zhAlt: '小型典藏', rewardEn: 'Novice collector badge', rewardZh: '新手收藏家徽章' },
      { id: 'm50', count: 50, key: 'cabinet', en: 'Cabinet collection', zh: '標本典藏', zhAlt: '標本典藏', rewardEn: 'Cabinet frame', rewardZh: '標本櫃外觀' },
      { id: 'm120', count: 120, key: 'archive', en: 'Archive collection', zh: '典藏達成', zhAlt: '典藏達成', rewardEn: 'Archive room background + gold badge', rewardZh: '典藏室背景 + 金章' },
      { id: 'm300', count: 300, key: 'museum', en: 'Museum collection', zh: '博物館級', zhAlt: '博物館級', rewardEn: 'Curator title unlock', rewardZh: '館長稱號解鎖' },
      { id: 'm1000', count: 1000, key: 'grand', en: 'Grand archive', zh: '總典藏', zhAlt: '總典藏', rewardEn: 'Mythic archive badge', rewardZh: '傳奇典藏徽章' }
    ],

    dailyQuestPool: [
      { id: 'dq_sign_in', icon: 'calendar', category: 'core', target: 1, xp: 10, rp: 0, i18nKey: 'rpc_dq_sign_in' },
      { id: 'dq_specimen', icon: 'microscope', category: 'specimen', target: 1, xp: 30, rp: 2, i18nKey: 'rpc_dq_specimen' },
      { id: 'dq_photo', icon: 'image', category: 'specimen', target: 1, xp: 15, rp: 0, i18nKey: 'rpc_dq_photo' },
      { id: 'dq_restore', icon: 'sparkles', category: 'restoration', target: 1, xp: 40, rp: 3, i18nKey: 'rpc_dq_restore' },
      { id: 'dq_collection_view', icon: 'eye', category: 'museum', target: 1, xp: 5, rp: 0, i18nKey: 'rpc_dq_collection_view' }
    ],

    dailyBonus: { completeCount: 3, xp: 50, rp: 5 },

    weeklyQuestPool: [
      { id: 'wq_specimens', icon: 'layers', target: 5, xp: 150, rp: 10, i18nKey: 'rpc_wq_specimens' },
      { id: 'wq_restore', icon: 'wand', target: 10, xp: 200, rp: 12, i18nKey: 'rpc_wq_restore' },
      { id: 'wq_scinames', icon: 'dna', target: 10, xp: 180, rp: 10, i18nKey: 'rpc_wq_scinames' },
      { id: 'wq_gps', icon: 'map-pin', target: 10, xp: 200, rp: 10, i18nKey: 'rpc_wq_gps' },
      { id: 'wq_showcase', icon: 'layout', target: 1, xp: 250, rp: 15, i18nKey: 'rpc_wq_showcase' }
    ],

    weeklyBonus: { xp: 500, rp: 30, streakShield: 1 },

    mainQuestChapters: [
      {
        id: 'ch1',
        order: 1,
        en: 'Chapter 1 · Build Your First Collection',
        zh: '第一章 · 建立你的第一個典藏',
        nodes: [
          { id: 'ch1n1', en: 'Create your first specimen', zh: '建立第一筆標本', xp: 50, check: 'specimen_count>=1' },
          { id: 'ch1n2', en: 'Upload a specimen photo', zh: '上傳標本照片', xp: 30, check: 'photo_count>=1' },
          { id: 'ch1n3', en: 'Add scientific name', zh: '補上學名', xp: 30, check: 'sci_name_count>=1' },
          { id: 'ch1n4', en: 'Add locality', zh: '補上採集地', xp: 30, check: 'locality_count>=1' },
          { id: 'ch1n5', en: 'Create a Passport Card', zh: '建立一張 Passport Card', xp: 100, check: 'passport_hints>=1' }
        ],
        chapterReward: { en: 'Title: First Archive Keeper · First Collection badge', zh: '稱號：初代標本守護者 · First Collection 徽章' }
      },
      {
        id: 'ch2',
        order: 2,
        en: 'Chapter 2 · Become a Field Recorder',
        zh: '第二章 · 成為田野紀錄者',
        nodes: [
          { id: 'ch2n1', en: 'Create 10 specimen records', zh: '建立 10 筆標本', xp: 200, check: 'specimen_count>=10' },
          { id: 'ch2n2', en: '10 records with GPS', zh: '10 筆含 GPS', xp: 150, check: 'gps_count>=10' },
          { id: 'ch2n3', en: '3 habitat descriptions', zh: '3 筆棲地描述', xp: 100, check: 'habitat_count>=3' },
          { id: 'ch2n4', en: 'One map-ready locality set', zh: '完成地圖級地理資訊', xp: 100, check: 'gps_count>=5' },
          { id: 'ch2n5', en: 'Curate a public highlight', zh: '建立公開展示重點', xp: 150, check: 'showcase_count>=1' }
        ],
        chapterReward: { en: 'Field Recorder badge · map profile module', zh: '田野紀錄者徽章 · 地圖展示模組' }
      },
      {
        id: 'ch3',
        order: 3,
        en: 'Chapter 3 · Build a Digital Museum',
        zh: '第三章 · 建立數位博物館',
        nodes: [
          { id: 'ch3n1', en: '20 Passport Cards (tracked)', zh: '20 張護照卡（累計）', xp: 300, check: 'passport_hints>=20' },
          { id: 'ch3n2', en: 'Publish a collection showcase', zh: '發布收藏展示', xp: 300, check: 'showcase_count>=1' },
          { id: 'ch3n3', en: '10 photo restorations', zh: '完成 10 次影像修復', xp: 200, check: 'restore_count>=10' },
          { id: 'ch3n4', en: 'Set a collection cover', zh: '設定收藏館封面', xp: 100, check: 'hq_count>=3' }
        ],
        chapterReward: { en: 'Digital Museum Founder · showcase frame', zh: '數位博物館創立者 · 展覽框' }
      },
      {
        id: 'ch4',
        order: 4,
        en: 'Chapter 4 · Taxonomy Workflow',
        zh: '第四章 · 分類學工作流',
        nodes: [
          { id: 'ch4n1', en: '1 taxonomy manuscript draft', zh: '1 份分類學草稿', xp: 200, check: 'taxonomy_draft>=1' },
          { id: 'ch4n2', en: '10 morphology notes', zh: '10 則形態描述', xp: 200, check: 'rich_description>=10' },
          { id: 'ch4n3', en: 'High-quality records (90+)', zh: '5 筆高品質紀錄（90+）', xp: 150, check: 'hq_count>=5' },
          { id: 'ch4n4', en: '20 scientific names completed', zh: '完成 20 筆學名', xp: 150, check: 'sci_name_count>=20' }
        ],
        chapterReward: { en: 'Taxonomy Apprentice · manuscript theme', zh: '分類學見習者 · 手稿主題' }
      },
      {
        id: 'ch5',
        order: 5,
        en: 'Chapter 5 · Scientific Asset Guardian',
        zh: '第五章 · 科學資產守護者',
        nodes: [
          { id: 'ch5n1', en: 'Create SAT asset', zh: '建立 SAT 資產', xp: 200, check: 'sat_count>=1' },
          { id: 'ch5n2', en: '50 GPS-class records', zh: '50 筆 GPS 級紀錄', xp: 250, check: 'gps_count>=50' },
          { id: 'ch5n3', en: '20 approved-quality specimens', zh: '20 筆審核級標本', xp: 300, check: 'hq_count>=20' },
          { id: 'ch5n4', en: '5 public showcases', zh: '5 次公開展示', xp: 350, check: 'showcase_count>=5' }
        ],
        chapterReward: { en: 'Guardian crest · SAT trust label', zh: '守護者徽記 · SAT 信任標章' }
      }
    ],

    badgeDefinitions: [
      {
        id: 'bdg_first_record',
        family: 'first_record',
        category: 'specimen',
        progressKey: 'specimen_count',
        rarity: 'Common',
        tiers: [
          { tier: 'Bronze', target: 1, xp: 50, rp: 0, en: 'First Record', zh: '初次建檔' }
        ]
      },
      {
        id: 'bdg_field_recorder',
        family: 'field_recorder',
        category: 'specimen',
        rarity: 'Uncommon',
        tiers: [
          { tier: 'Bronze', target: 10, xp: 40, rp: 5, en: 'Field Recorder', zh: '田野紀錄者' },
          { tier: 'Silver', target: 50, xp: 80, rp: 10, en: 'Field Recorder', zh: '田野紀錄者' },
          { tier: 'Gold', target: 100, xp: 140, rp: 20, en: 'Field Recorder', zh: '田野紀錄者' },
          { tier: 'Mythic', target: 500, xp: 400, rp: 60, en: 'Field Recorder', zh: '田野紀錄者' }
        ],
        progressKey: 'specimen_count'
      },
      {
        id: 'bdg_gps_hunter',
        family: 'gps_hunter',
        category: 'gps',
        rarity: 'Rare',
        tiers: [
          { tier: 'Bronze', target: 10, xp: 50, rp: 5, en: 'GPS Hunter', zh: '座標獵人' },
          { tier: 'Silver', target: 50, xp: 100, rp: 12, en: 'GPS Hunter', zh: '座標獵人' },
          { tier: 'Gold', target: 100, xp: 180, rp: 24, en: 'GPS Hunter', zh: '座標獵人' },
          { tier: 'Mythic', target: 500, xp: 500, rp: 80, en: 'GPS Hunter', zh: '座標獵人' }
        ],
        progressKey: 'gps_count'
      },
      {
        id: 'bdg_photo_restore',
        family: 'photo_restore',
        category: 'restoration',
        rarity: 'Rare',
        tiers: [
          { tier: 'Bronze', target: 5, xp: 60, rp: 6, en: 'Photo Restoration Specialist', zh: '影像修復專家' },
          { tier: 'Silver', target: 30, xp: 120, rp: 14, en: 'Photo Restoration Specialist', zh: '影像修復專家' },
          { tier: 'Gold', target: 100, xp: 220, rp: 28, en: 'Photo Restoration Specialist', zh: '影像修復專家' },
          { tier: 'Mythic', target: 500, xp: 600, rp: 90, en: 'Photo Restoration Specialist', zh: '影像修復專家' }
        ],
        progressKey: 'restore_count'
      },
      {
        id: 'bdg_taxonomy',
        family: 'taxonomy_notes',
        category: 'taxonomy',
        rarity: 'Epic',
        tiers: [
          { tier: 'Bronze', target: 1, xp: 80, rp: 10, en: 'Taxonomy Apprentice', zh: '分類學見習' },
          { tier: 'Silver', target: 5, xp: 140, rp: 18, en: 'Taxonomy Apprentice', zh: '分類學見習' },
          { tier: 'Gold', target: 20, xp: 260, rp: 35, en: 'Taxonomy Apprentice', zh: '分類學見習' },
          { tier: 'Mythic', target: 100, xp: 700, rp: 100, en: 'Taxonomy Apprentice', zh: '分類學見習' }
        ],
        progressKey: 'taxonomy_notes'
      },
      {
        id: 'bdg_museum',
        family: 'digital_museum',
        category: 'museum',
        rarity: 'Epic',
        tiers: [
          { tier: 'Bronze', target: 1, xp: 100, rp: 12, en: 'Digital Museum Founder', zh: '數位博物館創立者' },
          { tier: 'Silver', target: 5, xp: 200, rp: 25, en: 'Digital Museum Founder', zh: '數位博物館創立者' },
          { tier: 'Gold', target: 20, xp: 380, rp: 50, en: 'Digital Museum Founder', zh: '數位博物館創立者' },
          { tier: 'Mythic', target: 100, xp: 900, rp: 120, en: 'Digital Museum Founder', zh: '數位博物館創立者' }
        ],
        progressKey: 'showcase_count'
      },
      {
        id: 'bdg_hq_archivist',
        family: 'hq_archivist',
        category: 'specimen',
        rarity: 'Legendary',
        tiers: [
          { tier: 'Bronze', target: 10, xp: 120, rp: 15, en: 'High Quality Archivist', zh: '高品質建檔師' },
          { tier: 'Silver', target: 50, xp: 240, rp: 35, en: 'High Quality Archivist', zh: '高品質建檔師' },
          { tier: 'Gold', target: 100, xp: 420, rp: 60, en: 'High Quality Archivist', zh: '高品質建檔師' },
          { tier: 'Mythic', target: 500, xp: 1200, rp: 200, en: 'High Quality Archivist', zh: '高品質建檔師' }
        ],
        progressKey: 'hq_90_count'
      }
    ],

    titleDefinitions: [
      { id: 'title_stage', fromLevelStage: true },
      { id: 'title_coord_hunter', en: 'Coordinate Hunter', zh: '座標獵人', unlock: 'gps_count>=10' },
      { id: 'title_archive_organizer', en: 'Archive Organizer', zh: '典藏整理師', unlock: 'specimen_count>=30' },
      { id: 'title_tax_intern', en: 'Taxonomy Intern', zh: '分類學見習者', unlock: 'taxonomy_notes>=1' },
      { id: 'title_curator', en: 'Museum Curator', zh: '博物館策展人', unlock: 'showcase_count>=3' },
      { id: 'title_asset_guardian', en: 'Scientific Asset Guardian', zh: '科學資產守護者', unlock: 'sat_count>=3' },
      { id: 'title_grand_naturalist', en: 'Grand Naturalist', zh: '大博物學家', unlock: 'level>=51' },
      { id: 'title_checkin_master', en: 'Check-in Adept', zh: '簽到達人', unlock: 'streak>=7' },
      { id: 'title_streak_scholar', en: 'Streak Scholar', zh: '連續紀錄學人', unlock: 'streak>=60' }
    ],

    leaderboardSettings: {
      enabled: false,
      boards: [
        { id: 'weekly_gps', en: 'Weekly field GPS', zh: '本週田野 GPS 榜' },
        { id: 'monthly_restore', en: 'Monthly restoration', zh: '本月修復榜' },
        { id: 'taxonomy_contrib', en: 'Taxonomy contribution', zh: '分類貢獻榜' },
        { id: 'showcase_popular', en: 'Showcase engagement', zh: '策展人氣榜' },
        { id: 'quality_records', en: 'High-quality records', zh: '高品質紀錄榜' },
        { id: 'rookie_growth', en: 'Rookie growth (30d)', zh: '新手成長榜' }
      ]
    },

    rewardItems: [
      { id: 'rw_passport_frame_bronze', en: 'Passport frame · Archive Bronze', zh: '護照卡邊框 · 典藏銅' },
      { id: 'rw_profile_showcase', en: 'Profile showcase slot', zh: '個人頁展示位' },
      { id: 'rw_collection_bg_archive', en: 'Collection hall · archive room', zh: '收藏館 · 典藏室背景' }
    ],

    avatarDefinitions: [
      {
        id: 'av_default',
        icon: 'microscope',
        gradient: 'linear-gradient(135deg,#1a2744 0%,#3d5a80 100%)',
        zh: '預設研究員',
        en: 'Default Researcher',
        alwaysUnlocked: true,
        rarity: 'Common'
      },
      {
        id: 'av_field_recorder',
        icon: 'map-pin',
        gradient: 'linear-gradient(135deg,#1e3a2f 0%,#4ade80 100%)',
        zh: '田野紀錄者',
        en: 'Field Recorder',
        unlock: 'specimen_count>=10',
        rarity: 'Uncommon'
      },
      {
        id: 'av_gps_hunter',
        icon: 'compass',
        gradient: 'linear-gradient(135deg,#1e293b 0%,#38bdf8 100%)',
        zh: '座標獵人',
        en: 'GPS Hunter',
        unlock: 'gps_count>=10',
        rarity: 'Rare'
      },
      {
        id: 'av_photo_restore',
        icon: 'sparkles',
        gradient: 'linear-gradient(135deg,#312e81 0%,#c084fc 100%)',
        zh: '影像修復師',
        en: 'Photo Restorer',
        unlock: 'restore_count>=5',
        rarity: 'Rare'
      },
      {
        id: 'av_taxonomy',
        icon: 'dna',
        gradient: 'linear-gradient(135deg,#14532d 0%,#86efac 100%)',
        zh: '分類學見習',
        en: 'Taxonomy Apprentice',
        unlock: 'taxonomy_notes>=1',
        rarity: 'Epic'
      },
      {
        id: 'av_museum',
        icon: 'layout',
        gradient: 'linear-gradient(135deg,#431407 0%,#fb923c 100%)',
        zh: '數位策展人',
        en: 'Digital Curator',
        unlock: 'showcase_count>=1',
        rarity: 'Epic'
      },
      {
        id: 'av_checkin',
        icon: 'calendar',
        gradient: 'linear-gradient(135deg,#422006 0%,#fbbf24 100%)',
        zh: '簽到達人',
        en: 'Check-in Adept',
        unlock: 'streak>=7',
        rarity: 'Uncommon'
      },
      {
        id: 'av_archive',
        icon: 'layers',
        gradient: 'linear-gradient(135deg,#312e81 0%,#818cf8 100%)',
        zh: '典藏整理師',
        en: 'Archive Curator',
        unlock: 'specimen_count>=30',
        rarity: 'Rare'
      },
      {
        id: 'av_curator',
        icon: 'award',
        gradient: 'linear-gradient(135deg,#4c1d95 0%,#e879f9 100%)',
        zh: '博物鑑賞人',
        en: 'Museum Connoisseur',
        unlock: 'level>=13',
        rarity: 'Legendary'
      },
      {
        id: 'av_grand',
        icon: 'crown',
        gradient: 'linear-gradient(135deg,#713f12 0%,#fde047 100%)',
        zh: '大博物學家',
        en: 'Grand Naturalist',
        unlock: 'level>=51',
        rarity: 'Legendary'
      }
    ]
  };

  window.MCResearcherProgressConfig = C;
  window.MCResearcherProgressConfigPick = function (key) {
    var p = _rpcC[key];
    if (p && typeof mcPick === 'function') return mcPick(p);
    if (p) return (typeof mcGetLang === 'function' && mcGetLang() === 'en' ? p.en : p.zh) || key;
    return key;
  };
})();
