/**
 * Local MCurator API — localStorage backend for UI.html (static / local dev).
 * Provides window.google.script.run-compatible shim; no Google Apps Script required.
 */
var MC_DEMO_INSECT_ALBUM_URL = '';
var MC_FLICKR_PICTUREPIZ;
var MC_FLICKR_PICTUREPIZ_REMOTE = [];

/* Sync with `../assets/mc-asset-resolver.js` (demo pool + fallbacks) */
/**
 * Centralized local image URLs for MCurator (specimens, cards, welcome mosaic, mock DB).
 * Prefer raster photos under `assets/images/`; optional remote URLs only when
 * `MC_ALLOW_REMOTE_DEMO_IMAGES` is true. SVG data URIs in `MC_DEFAULT_DEMO_IMAGE_URLS`
 * are a last resort when the repo has no local manifest.
 */
(function (global) {
  'use strict';

  if (global.__MC_ASSET_RESOLVER_INSTALLED__) return;
  global.__MC_ASSET_RESOLVER_INSTALLED__ = true;

  var MC_MINIMAL_INSECT_RELS = null;

  function mcBuildMinimalInsectRels_() {
    if (typeof global.mcGetSectionAsset !== 'function') return [];
    return _dedupeRels([
      global.mcGetSectionAsset('passport-studio', 1),
      global.mcGetSectionAsset('passport-studio', 0),
      global.mcGetSectionAsset('landing-hero', 1),
      global.mcGetSectionAsset('earth-galaxy', 2),
    ]);
  }

  function mcGetMinimalInsectRels_() {
    if (!MC_MINIMAL_INSECT_RELS) MC_MINIMAL_INSECT_RELS = mcBuildMinimalInsectRels_();
    return MC_MINIMAL_INSECT_RELS;
  }

  var MC_BRAND_LOGO_REL = 'assets/brand/mcurator-logo.png';
  var MC_BRAND_MARK_GREEN_REL = 'assets/brand/mcurator-cs-mark-green-trim.png';

  function mcResolveLocalRelToPage_(rel) {
    try {
      return new URL('../' + String(rel || '').replace(/^\//, ''), location.href).href;
    } catch (e) {
      return String(rel || '');
    }
  }
  global.mcResolveLocalRelToPage_ = mcResolveLocalRelToPage_;

  function _dedupeRels(rels) {
    var out = [];
    var seen = Object.create(null);
    for (var i = 0; i < rels.length; i++) {
      var r = String(rels[i] || '')
        .trim()
        .replace(/\\/g, '/');
      if (!r || seen[r]) continue;
      seen[r] = 1;
      out.push(r);
    }
    return out;
  }

  function mcGetRasterRelPaths_() {
    var acc = [];
    if (global.MC_LANDING_PAGE_IMAGE_RELS && global.MC_LANDING_PAGE_IMAGE_RELS.length) {
      for (var a = 0; a < global.MC_LANDING_PAGE_IMAGE_RELS.length; a++) {
        acc.push(global.MC_LANDING_PAGE_IMAGE_RELS[a]);
      }
    }
    if (global.MC_LOCAL_DEMO_RELPATHS && global.MC_LOCAL_DEMO_RELPATHS.length) {
      for (var b = 0; b < global.MC_LOCAL_DEMO_RELPATHS.length; b++) {
        acc.push(global.MC_LOCAL_DEMO_RELPATHS[b]);
      }
    }
    var minimal = mcGetMinimalInsectRels_();
    for (var c = 0; c < minimal.length; c++) {
      acc.push(minimal[c]);
    }
    return _dedupeRels(acc);
  }

  function _relsToAbsUrls(rels) {
    var o = [];
    for (var i = 0; i < rels.length; i++) {
      o.push(mcResolveLocalRelToPage_(rels[i]));
    }
    return o;
  }

  function mcGetUnifiedImagePoolUrls_() {
    return _relsToAbsUrls(mcGetRasterRelPaths_());
  }
  global.mcGetUnifiedImagePoolUrls_ = mcGetUnifiedImagePoolUrls_;

  function _djb2(str) {
    var h = 5381;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) + h + s.charCodeAt(i);
    }
    return h >>> 0;
  }
  global.mcStringHash32_ = function (str) {
    return _djb2(str);
  };

  function mcGetBrandLogoUrl_() {
    return mcResolveLocalRelToPage_(MC_BRAND_LOGO_REL);
  }
  function mcGetBrandMarkGreenUrl_() {
    return mcResolveLocalRelToPage_(MC_BRAND_MARK_GREEN_REL);
  }
  global.mcGetBrandLogoUrl_ = mcGetBrandLogoUrl_;
  global.mcGetCardBackImageUrl_ = mcGetBrandLogoUrl_;
  global.mcGetBrandMarkUrl_ = mcGetBrandMarkGreenUrl_;

  function mcGetFallbackSpecimenImageUrl_(specimenId) {
    var rels = mcGetRasterRelPaths_();
    if (!rels.length) {
      return mcGetBrandLogoUrl_();
    }
    var idx = _djb2(String(specimenId || '0')) % rels.length;
    return mcResolveLocalRelToPage_(rels[idx]);
  }
  global.mcGetFallbackSpecimenImageUrl_ = mcGetFallbackSpecimenImageUrl_;

  function _looksLikeBrokenOrWrongSrc(u) {
    if (u == null) return true;
    var s = String(u).trim();
    if (!s) return true;
    if (/[.]html?(\#|\?|$)/i.test(s)) return true;
    if (/^svg\s*%\s*3[Ee]\s*$/i.test(s)) return true;
    if (/svg%3E/i.test(s) && s.indexOf('data:') !== 0) return true;
    if (/^data:\s*text\//i.test(s)) return true;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(s) && /UI\.html/i.test(s)) return true;
    return false;
  }

  function mcResolveSpecimenDisplayImageUrl_(item) {
    var u = item && (item.imageUrl || item.primaryImageUrl || '');
    u = String(u || '').trim();
    if (u && !_looksLikeBrokenOrWrongSrc(u)) {
      return u;
    }
    return mcGetFallbackSpecimenImageUrl_(item && (item.id || item.specimenId));
  }
  global.mcResolveSpecimenDisplayImageUrl_ = mcResolveSpecimenDisplayImageUrl_;
  global.mcIsUnusableImageSrc_ = _looksLikeBrokenOrWrongSrc;

  function mcGetDemoImageUrlPool_() {
    var unified = mcGetUnifiedImagePoolUrls_();
    if (unified.length) {
      return unified;
    }
    if (
      global.MC_ALLOW_REMOTE_DEMO_IMAGES &&
      typeof global.MC_FLICKR_PICTUREPIZ_REMOTE !== 'undefined' &&
      global.MC_FLICKR_PICTUREPIZ_REMOTE &&
      global.MC_FLICKR_PICTUREPIZ_REMOTE.length
    ) {
      var o = [];
      for (var r = 0; r < global.MC_FLICKR_PICTUREPIZ_REMOTE.length; r++) {
        o.push(String(global.MC_FLICKR_PICTUREPIZ_REMOTE[r]));
      }
      return o;
    }
    var def = global.MC_DEFAULT_DEMO_IMAGE_URLS;
    if (def && def.length) {
      var out2 = [];
      for (var d = 0; d < def.length; d++) {
        out2.push(String(def[d]));
      }
      return out2;
    }
    return [mcGetBrandLogoUrl_()];
  }
  global.mcGetDemoImageUrlPool_ = mcGetDemoImageUrlPool_;
})(typeof self !== 'undefined' ? self : this);

(function () {
  'use strict';

  window.MC_IS_LOCAL_PREVIEW = true;
  /**
   * 本機未設定歡迎影片時：先試專案內 `assets/video/hero-background.mp4`，失敗則用公開範例 mp4。
   */
  window.MC_DEFAULT_WELCOME_VIDEO_URLS =
    '../assets/video/hero-background.mp4,https://assets.mixkit.co/videos/preview/mixkit-forest-sunset-with-a-wooden-bridge-4268-large.mp4';

  var MC_DB_KEY = 'mcurator_local_db_v1';

  function ok(d) {
    return { ok: true, data: d };
  }
  function fail(m) {
    return { ok: false, message: String(m || 'Error') };
  }
  function normEmail(e) {
    return String(e || '')
      .trim()
      .toLowerCase();
  }
  function nowIso() {
    return new Date().toISOString();
  }
  function todayYm() {
    return nowIso().slice(0, 7);
  }
  function uid(p) {
    return (p || 'id') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }
  function finiteNum(x) {
    var n = Number(x);
    return isFinite(n) ? n : NaN;
  }
  var LOCAL_BIOSPHERE_ORDER = [
    'animal',
    'plant',
    'fungi',
    'protist',
    'bacteria',
    'archaea',
    'virus',
    'unspecified'
  ];
  var LOCAL_BIOSPHERE_ZH = {
    動物: 'animal',
    植物: 'plant',
    真菌: 'fungi',
    原生生物: 'protist',
    細菌: 'bacteria',
    古菌: 'archaea',
    病毒: 'virus',
    未指定: 'unspecified'
  };
  function inferBiosphere(item) {
    var direct = String(item.biosphereGroup || '').trim();
    if (direct && LOCAL_BIOSPHERE_ORDER.indexOf(direct) !== -1) return direct;
    if (direct && LOCAL_BIOSPHERE_ZH[direct]) return LOCAL_BIOSPHERE_ZH[direct];
    var cat = String(item.category || '');
    var sub = String(item.subcategory || '');
    var blob = (cat + ' ' + sub).toLowerCase();
    if (/病毒|virus|viridae/.test(blob)) return 'virus';
    if (/古菌|archaea/.test(blob)) return 'archaea';
    if (/細菌|细菌|bacteria/.test(blob)) return 'bacteria';
    if (/真菌|fungi|mushroom/.test(blob)) return 'fungi';
    if (/原生|protist|algae|藻/.test(blob)) return 'protist';
    if (/植物|plantae|plant|樹|灌木|草本/.test(blob)) return 'plant';
    if (/動物|animal|aves|鳥|哺乳|昆蟲|昆虫|魚|脊索/.test(blob)) return 'animal';
    if (cat) return 'animal';
    return 'unspecified';
  }
  function specimenComplete(item) {
    var bg = String(item.biosphereGroup || '').trim() || inferBiosphere(item);
    return [item.name, bg, item.location, item.collector, item.collectedDate, item.description].every(Boolean);
  }
  function mcBuildDemoSpecimenImageUrls_() {
    var a = [];
    if (typeof mcGetDemoImageUrlPool_ === 'function') {
      try {
        a = mcGetDemoImageUrlPool_() || [];
      } catch (eP) {
        a = [];
      }
    }
    if (!a || !a.length) return [];
    var o = [];
    for (var i = 0; i < 24; i++) o[i] = a[i % a.length];
    return o;
  }
  MC_FLICKR_PICTUREPIZ = mcBuildDemoSpecimenImageUrls_();

  function buildDashboard(specimens, profile, settings) {
    var thisMonth = todayYm();
    var total = specimens.length;
    var favorites = specimens.filter(function (x) {
      return x.isFavorite === true || x.isFavorite === 'true';
    }).length;
    var completed = specimens.filter(specimenComplete).length;
    var thisMonthAdded = specimens.filter(function (x) {
      return String(x.createdAt || '').slice(0, 7) === thisMonth;
    }).length;
    var withCoordinates = specimens.filter(function (x) {
      var la = finiteNum(x.latitude);
      var lo = finiteNum(x.longitude);
      var dla = finiteNum(x.decimalLatitude);
      var dlo = finiteNum(x.decimalLongitude);
      return (isFinite(la) && isFinite(lo)) || (isFinite(dla) && isFinite(dlo));
    }).length;
    var withImages = specimens.filter(function (x) {
      return !!(x.imageUrl || x.galleryImageUrls || x.videoUrls);
    }).length;
    var collectionGoal = Number(settings.collectionGoal || 100);
    var progressPercent =
      collectionGoal > 0 ? Math.min(100, Math.round((total / collectionGoal) * 100)) : 0;
    var byCategory = {};
    var byStatus = {};
    var byRarity = {};
    var byCountry = {};
    specimens.forEach(function (s) {
      if (s.category) byCategory[s.category] = (byCategory[s.category] || 0) + 1;
      if (s.status) byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      if (s.rarity) byRarity[s.rarity] = (byRarity[s.rarity] || 0) + 1;
      if (s.country) byCountry[s.country] = (byCountry[s.country] || 0) + 1;
    });
    var biosphereCounts = {};
    LOCAL_BIOSPHERE_ORDER.forEach(function (k) {
      biosphereCounts[k] = 0;
    });
    specimens.forEach(function (s) {
      var g = inferBiosphere(s);
      if (biosphereCounts[g] == null) biosphereCounts[g] = 0;
      biosphereCounts[g] += 1;
    });
    return {
      totalSpecimens: total,
      completedSpecimens: completed,
      favoriteSpecimens: favorites,
      thisMonthAdded: thisMonthAdded,
      withCoordinates: withCoordinates,
      withImages: withImages,
      collectionGoal: collectionGoal,
      progressPercent: progressPercent,
      biosphereCounts: biosphereCounts,
      player: {
        displayName: profile.displayName || 'Preview User',
        points: Number(profile.points || 0),
        level: Number(profile.level || 1),
        exp: Number(profile.exp || 0),
        streakDays: Number(profile.streakDays || 0)
      },
      charts: { byCategory: byCategory, byStatus: byStatus, byRarity: byRarity, byCountry: byCountry }
    };
  }

  function defaultSeed() {
    var t = nowIso();
    return {
      settings: {
        appSubtitle: '本機預覽｜範本資料（localStorage）',
        collectionGoal: '120',
        allowAdminLogin: 'true',
        labelPaperWidthMm: 80,
        labelPaperHeightMm: 40,
        qrSizePx: 160,
        defaultMapZoom: 13,
        defaultMapLat: 23.6978,
        defaultMapLng: 120.9605,
        welcomeVideoUrl: [
          'assets/welcome-bg/cinematic-museum-bg.mp4',
          'assets/welcome-bg/abstract-scientific-museum-loop.mp4'
        ].join('|'),
        uiColorScheme: 'dark',
        learnIntroHtml: '',
        learnOpsHtml: '',
        learnCfgHtml: '',
        aboutPageByLang: '{}',
        featureSatMarketplace: 'true',
        publicSpecimenExport: 'true',
        contentStudioDraftJson: '',
        contentStudioPublishedJson: '',
        documentationContentJson: '',
        documentationPublishedJson: '',
        documentationVersionsJson: '',
        satMarketplaceJson: '',
        satMarketplacePublishedJson: '',
        contentStudioVersionsJson: ''
      },
      profile: {
        displayName: '預覽會員',
        points: 240,
        level: 4,
        exp: 820,
        streakDays: 44
      },
      researcherProgress: {
        version: 1,
        researchPoints: 220,
        equippedTitleId: 'title_checkin_master',
        equippedAvatarId: 'av_default',
        featuredBadgeKey: 'bdg_gps_hunter:Bronze',
        streakShields: 1,
        stats: { restores: 12, showcaseCount: 0, taxonomyNotes: 0 },
        feed: [],
        flags: { viewedCollectionProgress: true },
        daily: { dateKey: '', baseline: null, claimed: {}, claimedDailyBonus: false },
        weekly: { weekKey: '', baseline: null, claimed: {}, claimedWeeklyBonus: false, completedAt: '' }
      },
      specimens: [
        {
          id: 'sp_demo_1',
          specimenNo: 'MC-20260405-DEMO1',
          name: '外縣夜採蛾類存證',
          scientificName: 'Aglia sp.',
          acceptedScientificName: 'Aglia sp.',
          biosphereGroup: 'animal',
          category: '昆蟲',
          subcategory: 'Lepidoptera',
          status: 'complete',
          rarity: 'rare',
          iucnStatus: 'NE',
          location: '花蓮縣',
          country: 'TW',
          address: '溪谷邊坡',
          collector: '林研究員',
          collectedDate: '2026-03-12',
          tags: 'demo,夜採,蛾類',
          description: '本機示範：圖庫以專內昆蟲／標本攝影為主，與名稱一致以方便建檔解說。',
          notes: '本機預覽用；圖自 assets 池。',
          imageUrl: MC_FLICKR_PICTUREPIZ[0],
          assetImageKey: 'landing_moth_night_1',
          latitude: 23.558,
          longitude: 121.355,
          altitude: 80,
          basisOfRecord: 'PreservedSpecimen',
          sex: 'Unknown',
          lifeStage: 'Adult',
          habitat: '溪谷闊葉林',
          isFavorite: 'true',
          createdAt: t,
          updatedAt: t
        },
        {
          id: 'sp_demo_2',
          specimenNo: 'MC-20260405-DEMO2',
          name: '寬紋袖弄蝶示範',
          scientificName: 'Ypthima baldus',
          acceptedScientificName: 'Ypthima baldus',
          biosphereGroup: 'animal',
          category: '昆蟲',
          subcategory: 'Lepidoptera / Nymphalidae',
          status: 'pending',
          rarity: 'common',
          iucnStatus: 'LC',
          location: '新北市石碇',
          country: 'TW',
          address: '步道邊採樣點',
          collector: '陳同學',
          collectedDate: '2026-04-01',
          tags: '蝴蝶,寬紋,示範',
          description: '範本：日行性蝶類，附生態照與簡要棲地。',
          notes: '',
          imageUrl: MC_FLICKR_PICTUREPIZ[1],
          assetImageKey: 'landing_butterfly_ypthima_1',
          latitude: 24.967,
          longitude: 121.65,
          altitude: 200,
          basisOfRecord: 'PreservedSpecimen',
          sex: '',
          lifeStage: 'Adult',
          habitat: '中低海拔闊葉',
          isFavorite: 'false',
          createdAt: t,
          updatedAt: t
        },
        {
          id: 'sp_demo_3',
          specimenNo: 'MC-20260405-DEMO3',
          name: '獨角仙',
          scientificName: 'Trypoxylus dichotomus',
          biosphereGroup: 'animal',
          category: '昆蟲',
          subcategory: '金龜科',
          status: 'complete',
          rarity: 'common',
          iucnStatus: 'NE',
          location: '屏東縣潮州鎮',
          country: 'TW',
          address: '',
          collector: 'Demo Lab',
          collectedDate: '2026-02-20',
          tags: '鞘翅目',
          description: '範本：夜間燈光下採集。',
          notes: '本機批次匯入可參考此格式',
          imageUrl: MC_FLICKR_PICTUREPIZ[2],
          latitude: '',
          longitude: '',
          altitude: '',
          basisOfRecord: 'PreservedSpecimen',
          sex: 'Male',
          lifeStage: 'Adult',
          habitat: '闊葉林',
          isFavorite: 'true',
          createdAt: t,
          updatedAt: t
        },
        {
          id: 'sp_demo_4',
          specimenNo: 'MC-20260405-DEMO4',
          name: '翡翠樹蛙',
          scientificName: 'Zhangixalus prasinatus',
          biosphereGroup: 'animal',
          category: 'Amphibia',
          subcategory: 'Rhacophoridae',
          status: 'complete',
          rarity: 'rare',
          iucnStatus: 'VU',
          location: '新北市烏來區',
          country: 'TW',
          address: '溪谷步道',
          collector: '生態調查隊',
          collectedDate: '2026-01-05',
          tags: '兩棲,溪流',
          description: '範本：潮濕環境鳴叫紀錄。',
          notes: '',
          imageUrl: MC_FLICKR_PICTUREPIZ[3],
          latitude: 24.865,
          longitude: 121.551,
          altitude: 450,
          basisOfRecord: 'HumanObservation',
          sex: 'Unknown',
          lifeStage: 'Adult',
          habitat: '溪邊灌叢',
          isFavorite: 'false',
          createdAt: t,
          updatedAt: t
        },
        {
          id: 'sp_demo_5',
          specimenNo: 'MC-20260405-DEMO5',
          name: '未知種｜待鑑定',
          scientificName: '',
          biosphereGroup: 'unspecified',
          category: '未分類',
          subcategory: '',
          status: 'pending',
          rarity: 'uncommon',
          iucnStatus: 'DD',
          location: '',
          country: '',
          address: '',
          collector: '',
          collectedDate: '',
          tags: 'workflow',
          description: '範本：展示「未完成欄位」在列表中的呈現。',
          notes: '可於表單中補齊後儲存',
          imageUrl: MC_FLICKR_PICTUREPIZ[4],
          latitude: '',
          longitude: '',
          altitude: '',
          basisOfRecord: '',
          sex: '',
          lifeStage: '',
          habitat: '',
          isFavorite: 'false',
          createdAt: t,
          updatedAt: t
        }
      ],
      presets: [
        {
          id: 'pr_demo_1',
          name: '昆蟲野外採集',
          category: '昆蟲',
          subcategory: '',
          defaultStatus: 'pending',
          defaultRarity: 'common',
          defaultCountry: 'Taiwan',
          defaultLocation: '',
          defaultCollector: '野外隊',
          defaultTags: 'fieldwork',
          defaultDescription: '範本模板：請依實際修改。'
        },
        {
          id: 'pr_demo_2',
          name: '植物標本建檔',
          category: 'Plantae',
          subcategory: '',
          defaultStatus: 'complete',
          defaultRarity: 'common',
          defaultCountry: 'Taiwan',
          defaultLocation: '標本館',
          defaultCollector: '標本室',
          defaultTags: 'herbarium',
          defaultDescription: '範本模板：壓製標本。'
        }
      ],
      achievements: [
        {
          id: 'ach_demo_1',
          title: '初次建檔',
          description: '範本成就：建立第一筆標本。',
          icon: '🏅',
          unlocked: 'true',
          progress: '1',
          target: '1'
        },
        {
          id: 'ach_demo_2',
          title: '座標獵人',
          description: '範本成就：10 筆含 GPS 標本。',
          icon: '📍',
          unlocked: 'false',
          progress: '4',
          target: '10'
        },
        {
          id: 'ach_demo_3',
          title: '簽到達人',
          description: '範本成就：連續簽到 7 天。',
          icon: '🔥',
          unlocked: 'false',
          progress: '5',
          target: '7'
        }
      ],
      activities: [
        {
          id: 'act_1',
          type: 'bootstrap',
          targetId: '',
          title: '系統載入（本機預覽）',
          detail: '資料來自瀏覽器 localStorage',
          points: 0,
          createdAt: t
        },
        {
          id: 'act_2',
          type: 'specimen_updated',
          targetId: 'sp_demo_1',
          title: '更新標本',
          detail: '大緋胸鸚鵡',
          points: 5,
          createdAt: t
        }
      ],
      officialAccounts: [
        {
          id: 'oa_demo_1',
          email: 'admin1@official.local',
          password: 'Admin123!',
          passwordHash: '',
          status: 'active',
          displayName: '測試管理員',
          role: 'super'
        }
      ],
      cms: {
        announcements: [
          {
            id: 'ann_1',
            title: '歡迎使用 MCurator（範本公告）',
            body: '此為本機預覽公告。可在後台 CMS 分頁編輯並儲存至 localStorage。',
            pinned: 'true',
            status: 'published',
            audience: 'all',
            validFrom: '',
            validTo: '',
            publishAt: '',
            revision: '1',
            lastEditedBy: 'system',
            updatedAt: t
          },
          {
            id: 'ann_2',
            title: '草稿範例（不會出現在前台）',
            body: '僅控制台可見。',
            pinned: 'false',
            status: 'draft',
            audience: 'all',
            validFrom: '',
            validTo: '',
            updatedAt: t
          }
        ],
        rules: [
          {
            id: 'rule_1',
            title: '社群守則（範本）',
            body: '尊重版權、禁止騷擾。正式環境請於後台修改。',
            status: 'published',
            updatedAt: t
          }
        ],
        knowledge: [
          {
            id: 'know_1',
            title: '如何填寫標本欄位',
            body: '學名、採集地、日期、座標與媒體連結盡量完整；可使用「從照片讀取 GPS」。',
            category: '教學',
            status: 'published',
            updatedAt: t
          },
          {
            id: 'know_2',
            title: '本機預覽模式說明',
            body: '資料僅存在此瀏覽器。清除網站資料會重置；可用「下載 JSON」備份 CMS 設定。',
            category: '系統',
            status: 'published',
            updatedAt: t
          }
        ]
      },
      communityPosts: [
        {
          id: 'cp_1',
          author: 'Amherst Wu',
          time: '2 小時前',
          tag: '討論',
          title: '昆蟲標本固定流程請益',
          body: '想整理新手流程，歡迎分享工具與保存方式。',
          status: 'published',
          updatedAt: t
        },
        {
          id: 'cp_2',
          author: 'Specimen Club',
          time: '昨天',
          tag: '公告',
          title: '本週主題：標本保存與展示',
          body: '歡迎分享展示照片與心得。',
          status: 'published',
          updatedAt: t
        }
      ],
      satItems: [
        {
          id: 'sat_1',
          name: 'Lepidoptera display voucher (demo)',
          creator: 'MCurator Studio',
          price: 'Ref. 120 (demo only)',
          description: '教學用科學資產清單列項；參考價值不構成投資建議。',
          status: 'published',
          updatedAt: t
        },
        {
          id: 'sat_2',
          name: 'Specimen access pass (demo)',
          creator: 'Member Lab',
          price: 'Ref. 35 (demo only)',
          description: '會員示範登錄；實務審查依機構與法規辦理。',
          status: 'published',
          updatedAt: t
        }
      ],
      newsArticles: [
        {
          id: 'news_1',
          title: '平台更新：新聞與論文模組（本機預覽）',
          body: '儀表板可顯示新聞與論文摘要；管理員可在 CMS「新聞／論文」分頁編輯。',
          audience: 'all',
          priority: '5',
          status: 'published',
          pinned: 'false',
          validFrom: '',
          validTo: '',
          publishAt: '',
          updatedAt: t
        }
      ],
      papers: [
        {
          id: 'pap_1',
          title: 'Specimen digitization best practices',
          authors: 'MCurator Lab',
          venue: 'Digital Collections Journal',
          doi: '10.0000/demo.2026',
          url: 'https://example.com/paper',
          body: '示範論文摘要：標本數位化與中繼資料建議。',
          status: 'published',
          updatedAt: t
        }
      ],
      gameRewards: {
        checkInBase: 10,
        checkInWeekBonus: 20,
        specimenUpdatePoints: 5,
        specimenCreatePoints: 10,
        specimenCompleteBonus: 20
      },
      members: []
    };
  }

  function defaultGameRewards() {
    return {
      checkInBase: 10,
      checkInWeekBonus: 20,
      specimenUpdatePoints: 5,
      specimenCreatePoints: 10,
      specimenCompleteBonus: 20
    };
  }

  function ensureDbShape(db) {
    if (!db || typeof db !== 'object') return db;
    db.cms = db.cms || {};
    db.cms.announcements = db.cms.announcements || [];
    db.cms.rules = db.cms.rules || [];
    db.cms.knowledge = db.cms.knowledge || [];
    if (!Array.isArray(db.communityPosts)) db.communityPosts = [];
    var _legList = String.fromCharCode(110, 102, 116) + 'Items';
    if (Object.prototype.hasOwnProperty.call(db, _legList) && Array.isArray(db[_legList]) && db[_legList].length) {
      if (!Array.isArray(db.satItems) || !db.satItems.length) {
        db.satItems = db[_legList].slice();
      }
      try {
        delete db[_legList];
      } catch (e) {}
    }
    if (!Array.isArray(db.satItems)) db.satItems = [];
    if (!db.gameRewards || typeof db.gameRewards !== 'object') db.gameRewards = defaultGameRewards();
    else {
      var gr = defaultGameRewards();
      Object.keys(gr).forEach(function (k) {
        var v = db.gameRewards[k];
        if (v == null || v === '') db.gameRewards[k] = gr[k];
      });
    }
    if (!Array.isArray(db.members)) db.members = [];
    if (!Array.isArray(db.newsArticles)) db.newsArticles = [];
    if (!Array.isArray(db.papers)) db.papers = [];
    return db;
  }

  function gameRewardNum(db, key) {
    var gr = db.gameRewards || defaultGameRewards();
    var def = defaultGameRewards();
    var n = Number(gr[key]);
    if (!isFinite(n)) n = Number(def[key]);
    return isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  }

  function loadDb() {
    try {
      var raw = localStorage.getItem(MC_DB_KEY);
      if (!raw) {
        var s = defaultSeed();
        saveDb(s);
        return ensureDbShape(s);
      }
      var db = JSON.parse(raw);
      ensureDbShape(db);
      if (!db.specimens || !db.specimens.length) {
        var merged = Object.assign(defaultSeed(), db);
        ensureDbShape(merged);
        saveDb(merged);
        return merged;
      }
      return db;
    } catch (e) {
      try {
        localStorage.removeItem(MC_DB_KEY);
      } catch (e2) {}
      var d = defaultSeed();
      saveDb(d);
      return ensureDbShape(d);
    }
  }

  function saveDb(db) {
    try {
      localStorage.setItem(MC_DB_KEY, JSON.stringify(db));
    } catch (e) {}
  }

  function published(list) {
    return (list || []).filter(function (x) {
      return String(x.status || '').toLowerCase() === 'published';
    });
  }

  function isPublishAtReached_(p) {
    p = String(p || '').trim();
    if (!p) {
      return true;
    }
    return p <= new Date().toISOString();
  }

  function publishedAnnouncementsForFeed(list) {
    return (list || []).filter(function (x) {
      if (String(x.status || '').toLowerCase() !== 'published') {
        return false;
      }
      if (!isWithinCmsValidity(x.validFrom, x.validTo)) {
        return false;
      }
      if (!isPublishAtReached_(x.publishAt)) {
        return false;
      }
      var aud = String(x.audience || 'all').toLowerCase();
      return aud === 'all' || aud === 'public';
    });
  }

  function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function isWithinCmsValidity(validFrom, validTo) {
    var today = todayIsoDate();
    var from = String(validFrom || '').trim();
    var to = String(validTo || '').trim();
    if (from && from > today) return false;
    if (to && to < today) return false;
    return true;
  }

  function publishedNewsArticles(list) {
    return (list || []).filter(function (x) {
      if (String(x.status || '').toLowerCase() !== 'published') {
        return false;
      }
      if (!isWithinCmsValidity(x.validFrom, x.validTo)) {
        return false;
      }
      if (!isPublishAtReached_(x.publishAt)) {
        return false;
      }
      var aud = String(x.audience || 'all').toLowerCase();
      return aud === 'all' || aud === 'public';
    });
  }

  function publishedPapers(list) {
    return (list || []).filter(function (x) {
      return String(x.status || '').toLowerCase() === 'published';
    });
  }

  function sanitizeAccount(acc) {
    if (!acc) return null;
    return {
      id: acc.id,
      email: acc.email,
      displayName: acc.displayName,
      role: acc.role,
      status: acc.status
    };
  }

  function verifyAdmin(email, password) {
    var db = loadDb();
    if (String(db.settings.allowAdminLogin || '') !== 'true') return false;
    var em = normEmail(email);
    var pw = String(password || '');
    var acc = (db.officialAccounts || []).find(function (a) {
      return normEmail(a.email) === em && String(a.status || '').toLowerCase() === 'active';
    });
    if (!acc) return false;
    if (acc.password && pw === acc.password) return true;
    return false;
  }

  function findSpecimen(id) {
    var db = loadDb();
    return (db.specimens || []).find(function (s) {
      return String(s.id) === String(id);
    });
  }

  function qrServiceUrl(text, size) {
    var s = Number(size) || 160;
    return (
      'https://api.qrserver.com/v1/create-qr-code/?size=' +
      s +
      'x' +
      s +
      '&data=' +
      encodeURIComponent(String(text || ''))
    );
  }

  var MC_EXPORT_SPECIMEN_HEADERS = [
    'id',
    'specimenNo',
    'name',
    'scientificName',
    'biosphereGroup',
    'category',
    'subcategory',
    'status',
    'rarity',
    'iucnStatus',
    'location',
    'country',
    'address',
    'collector',
    'collectedDate',
    'tags',
    'description',
    'notes',
    'imageUrl',
    'latitude',
    'longitude',
    'altitude',
    'basisOfRecord',
    'sex',
    'lifeStage',
    'habitat',
    'isFavorite',
    'createdAt',
    'updatedAt',
    'decimalLatitude',
    'decimalLongitude',
    'elevation',
    'stateProvince',
    'county',
    'locality',
    'mapSearchText',
    'coverImageFileId',
    'galleryImageUrls',
    'galleryImageFileIds',
    'videoUrls',
    'videoFileIds',
    'createdBy',
    'updatedBy'
  ];

  function mcEscapeCsvCellForExport_(value) {
    var s = String(value == null ? '' : value).replace(/"/g, '""');
    return '"' + s + '"';
  }

  function exportBlobUrl(specimens, type) {
    if (type === 'json') {
      var jbody = JSON.stringify(specimens, null, 2);
      var jblob = new Blob([jbody], { type: 'application/json' });
      return URL.createObjectURL(jblob);
    }
    var list = Array.isArray(specimens) ? specimens : [];
    var headerRow = MC_EXPORT_SPECIMEN_HEADERS.map(function (h) {
      return mcEscapeCsvCellForExport_(h);
    });
    var rows = [headerRow.join(',')];
    list.forEach(function (r) {
      var line = MC_EXPORT_SPECIMEN_HEADERS.map(function (key) {
        var v = r && r[key] != null ? r[key] : '';
        return mcEscapeCsvCellForExport_(v);
      }).join(',');
      rows.push(line);
    });
    var cbody = '\uFEFF' + rows.join('\n');
    var cblob = new Blob([cbody], { type: 'text/csv;charset=utf-8' });
    return URL.createObjectURL(cblob);
  }

  function nominatimSearch(address) {
    var url =
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(address);
    return fetch(url, { headers: { 'Accept-Language': 'zh-TW,en' } }).then(function (r) {
      return r.json();
    });
  }

  function redactSettingsForClient(s) {
    s = s && typeof s === 'object' ? s : {};
    var o = Object.assign({}, s);
    if (o.mapGeocodingEndpoint) {
      var u = String(o.mapGeocodingEndpoint);
      var i = u.indexOf('?');
      o.mapGeocodingEndpoint = i === -1 ? u : u.slice(0, i);
    }
    return o;
  }

  function mergeGeocodingLocal_(incoming, previous) {
    incoming = String(incoming || '').trim();
    previous = String(previous || '').trim();
    if (!previous) {
      return incoming;
    }
    if (!incoming) {
      return '';
    }
    if (incoming.indexOf('?') !== -1) {
      return incoming;
    }
    var red = previous.indexOf('?') === -1 ? previous : previous.slice(0, previous.indexOf('?'));
    if (incoming === red) {
      return previous;
    }
    if (previous.indexOf(incoming) === 0 && previous.charAt(incoming.length) === '?') {
      return previous;
    }
    return incoming;
  }

  function nominatimReverse(lat, lng) {
    var url =
      'https://nominatim.openstreetmap.org/reverse?format=json&lat=' +
      encodeURIComponent(lat) +
      '&lon=' +
      encodeURIComponent(lng);
    return fetch(url, { headers: { 'Accept-Language': 'zh-TW,en' } }).then(function (r) {
      return r.json();
    });
  }

  var impl = {};

  impl.bootstrapApp = function () {
    var db = loadDb();
    var oa = db.officialAccounts || [];
    var st = db.settings || {};
    var allowExport = st.publicSpecimenExport !== 'false';
    var dash = buildDashboard(db.specimens || [], db.profile || {}, st);
    return ok({
      app: { name: 'MCurator', version: 'local-preview', subtitle: (db.settings && db.settings.appSubtitle) || '' },
      runtimeMeta: { dataBackend: 'local_preview' },
      settings: redactSettingsForClient(st),
      profile: db.profile || {},
      dashboard: dash,
      specimens: db.specimens || [],
      presets: db.presets || [],
      achievements: db.achievements || [],
      activities: (db.activities || []).slice().sort(function (a, b) {
        return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
      }),
      officialAccountCount: oa.length,
      officialAccounts: [],
      announcements: publishedAnnouncementsForFeed(db.cms && db.cms.announcements),
      rules: published(db.cms && db.cms.rules),
      knowledgeArticles: published(db.cms && db.cms.knowledge),
      communityPosts: published(db.communityPosts),
      satItems: published(db.satItems),
      newsArticles: publishedNewsArticles(db.newsArticles),
      papers: publishedPapers(db.papers),
      gameRewards: db.gameRewards || defaultGameRewards(),
      exportUrls: allowExport
        ? {
            csv: exportBlobUrl(db.specimens || [], 'csv'),
            json: exportBlobUrl(db.specimens || [], 'json')
          }
        : { csv: '', json: '' }
    });
  };

  impl.loginOfficialAccount = function (email, password) {
    var db = loadDb();
    if (String(db.settings.allowAdminLogin || '') !== 'true') return fail('目前未開放後台登入');
    var acc = (db.officialAccounts || []).find(function (a) {
      return normEmail(a.email) === normEmail(email) && String(a.status || '').toLowerCase() === 'active';
    });
    if (!acc || !password || password !== acc.password) return fail('官方帳號或密碼錯誤');
    db.activities = db.activities || [];
    db.activities.unshift({
      id: uid('act'),
      type: 'admin_login',
      targetId: acc.id,
      title: '官方帳號登入',
      detail: acc.email,
      points: 0,
      createdAt: nowIso()
    });
    saveDb(db);
    return ok(sanitizeAccount(acc));
  };

  impl.saveOfficialAccount = function (payload, adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    var p = payload || {};
    if (!p || typeof p !== 'object') return fail('官方帳號資料格式錯誤');
    var db = loadDb();
    db.officialAccounts = db.officialAccounts || [];
    var email = normEmail(p.email);
    var displayName = String(p.displayName || '').trim();
    var role = String(p.role || 'admin').trim() || 'admin';
    var status = String(p.status || 'active').trim() || 'active';
    if (!email) return fail('email 必填');

    if (p.id) {
      var ix = db.officialAccounts.findIndex(function (x) {
        return String(x.id) === String(p.id);
      });
      if (ix === -1) return fail('找不到官方帳號');
      var existing = db.officialAccounts[ix];
      var pw = String(p.password || '').trim();
      db.officialAccounts[ix] = Object.assign({}, existing, {
        email: email,
        displayName: displayName || existing.displayName || email,
        role: role,
        status: status,
        password: pw ? pw : existing.password
      });
      saveDb(db);
      return ok({ message: '官方帳號已更新', account: sanitizeAccount(db.officialAccounts[ix]) });
    }

    if (db.officialAccounts.some(function (x) {
      return normEmail(x.email) === email;
    })) {
      return fail('email 已存在');
    }

    var newId = uid('oa');
    db.officialAccounts.push({
      id: newId,
      email: email,
      password: String(p.password || 'Admin123!'),
      passwordHash: '',
      displayName: displayName || email,
      role: role,
      status: status
    });
    saveDb(db);
    return ok({
      message: '官方帳號已新增',
      account: sanitizeAccount(db.officialAccounts[db.officialAccounts.length - 1])
    });
  };

  impl.cmsLoadConsole = function (adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('後台驗證失敗，請重新登入');
    var db = loadDb();
    return ok({
      officialAccounts: (db.officialAccounts || []).map(sanitizeAccount),
      announcements: (db.cms && db.cms.announcements) || [],
      rules: (db.cms && db.cms.rules) || [],
      knowledge: (db.cms && db.cms.knowledge) || [],
      achievements: db.achievements || [],
      communityPosts: db.communityPosts || [],
      satItems: db.satItems || [],
      newsArticles: db.newsArticles || [],
      papers: db.papers || [],
      gameRewards: db.gameRewards || defaultGameRewards(),
      settings: db.settings || {}
    });
  };

  function cmsSaveList(kind, payload, adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    var db = loadDb();
    db.cms = db.cms || {};
    var arr = db.cms[kind] || (db.cms[kind] = []);
    var p = payload || {};
    var id = p.id;
    if (id) {
      var ix = arr.findIndex(function (x) {
        return x.id === id;
      });
      if (ix === -1) return fail('找不到項目');
      if (kind === 'announcements') {
        var rev0 = Number(arr[ix].revision || 0) + 1;
        arr[ix] = Object.assign({}, arr[ix], p, {
          updatedAt: nowIso(),
          revision: String(rev0 > 0 ? rev0 : 1),
          lastEditedBy: String(adminEmail || '')
        });
      } else {
        arr[ix] = Object.assign({}, arr[ix], p, { updatedAt: nowIso() });
      }
    } else {
      var nid = uid(kind === 'announcements' ? 'ann' : kind === 'rules' ? 'rule' : 'know');
      var row0 = Object.assign({}, p, {
        id: nid,
        status: p.status || 'draft',
        updatedAt: nowIso()
      });
      if (kind === 'announcements') {
        row0.revision = '1';
        row0.lastEditedBy = String(adminEmail || '');
      }
      arr.push(row0);
    }
    saveDb(db);
    return ok({ message: '已儲存' });
  }

  impl.cmsSaveAnnouncement = function (p, e, pw) {
    return cmsSaveList('announcements', p, e, pw);
  };
  impl.cmsSaveRule = function (p, e, pw) {
    return cmsSaveList('rules', p, e, pw);
  };
  impl.cmsSaveKnowledge = function (p, e, pw) {
    return cmsSaveList('knowledge', p, e, pw);
  };

  function cmsDel(kind, id, adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    var db = loadDb();
    db.cms = db.cms || {};
    var arr = db.cms[kind] || [];
    db.cms[kind] = arr.filter(function (x) {
      return x.id !== id;
    });
    saveDb(db);
    return ok({ message: '已刪除' });
  }

  impl.cmsDeleteAnnouncement = function (id, e, pw) {
    return cmsDel('announcements', id, e, pw);
  };
  impl.cmsDeleteRule = function (id, e, pw) {
    return cmsDel('rules', id, e, pw);
  };
  impl.cmsDeleteKnowledge = function (id, e, pw) {
    return cmsDel('knowledge', id, e, pw);
  };

  function cmsSaveTopArray(field, payload, adminEmail, adminPassword, uidPrefix) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    var db = loadDb();
    var arr = db[field] || (db[field] = []);
    var p = payload || {};
    var id = p.id;
    if (id) {
      var ix = arr.findIndex(function (x) {
        return x.id === id;
      });
      if (ix === -1) return fail('找不到項目');
      arr[ix] = Object.assign({}, arr[ix], p, { updatedAt: nowIso() });
    } else {
      var nid = uid(uidPrefix || field);
      arr.push(
        Object.assign({}, p, {
          id: nid,
          status: p.status || 'draft',
          updatedAt: nowIso()
        })
      );
    }
    saveDb(db);
    return ok({ message: '已儲存' });
  }

  function cmsDelTop(field, id, adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    var db = loadDb();
    db[field] = (db[field] || []).filter(function (x) {
      return x.id !== id;
    });
    saveDb(db);
    return ok({ message: '已刪除' });
  }

  impl.cmsSaveCommunityPost = function (p, e, pw) {
    return cmsSaveTopArray('communityPosts', p, e, pw, 'cp');
  };
  impl.cmsDeleteCommunityPost = function (id, e, pw) {
    return cmsDelTop('communityPosts', id, e, pw);
  };
  impl.cmsSaveSatItem = function (p, e, pw) {
    return cmsSaveTopArray('satItems', p, e, pw, 'sat');
  };
  impl.cmsDeleteSatItem = function (id, e, pw) {
    return cmsDelTop('satItems', id, e, pw);
  };

  impl.cmsSaveNewsArticle = function (p, e, pw) {
    return cmsSaveTopArray('newsArticles', p, e, pw, 'news');
  };
  impl.cmsDeleteNewsArticle = function (id, e, pw) {
    return cmsDelTop('newsArticles', id, e, pw);
  };
  impl.cmsSavePaper = function (p, e, pw) {
    return cmsSaveTopArray('papers', p, e, pw, 'pap');
  };
  impl.cmsDeletePaper = function (id, e, pw) {
    return cmsDelTop('papers', id, e, pw);
  };

  impl.cmsSaveGameRewards = function (payload, adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    var db = loadDb();
    var base = defaultGameRewards();
    var p = payload || {};
    db.gameRewards = Object.assign({}, base, db.gameRewards || {}, p);
    Object.keys(base).forEach(function (k) {
      var n = Number(db.gameRewards[k]);
      if (!isFinite(n) || n < 0) db.gameRewards[k] = base[k];
      else db.gameRewards[k] = Math.floor(n);
    });
    saveDb(db);
    return ok({ message: '獎勵設定已儲存', gameRewards: db.gameRewards });
  };

  function buildLocalCmsExportBundle() {
    var db = loadDb();
    return {
      exportedAt: nowIso(),
      v: 1,
      app: 'MCurator',
      dataBackend: 'local_preview',
      announcements: (db.cms && db.cms.announcements) || [],
      rules: (db.cms && db.cms.rules) || [],
      knowledge: (db.cms && db.cms.knowledge) || [],
      achievements: db.achievements || [],
      communityPosts: db.communityPosts || [],
      satItems: db.satItems || [],
      newsArticles: db.newsArticles || [],
      papers: db.papers || [],
      gameRewards: db.gameRewards || defaultGameRewards(),
      settings: db.settings || {}
    };
  }

  impl.exportCmsBundleJson = function (adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權：請使用後台官方帳號');
    try {
      var payload = buildLocalCmsExportBundle();
      return ok({
        json: JSON.stringify(payload, null, 2),
        filename: 'mcurator-cms-bundle.json'
      });
    } catch (e) {
      return fail(String(e && e.message ? e.message : e));
    }
  };

  impl.saveCmsBundleToDrive = function (adminEmail, adminPassword, folderId) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    return fail('本機模式不支援 Google Drive 寫入；請使用「下載 JSON」存到專案 cms-export/ 資料夾。');
  };

  impl.registerMember = function (payload) {
    var db = loadDb();
    var p = payload || {};
    var displayName = String(p.displayName || '').trim();
    var email = normEmail(p.email);
    var password = String(p.password || '');
    if (!displayName || !email || !password) return fail('請填寫顯示名稱、Email 與密碼');
    if (password.length < 6) return fail('密碼至少 6 字元');
    db.members = db.members || [];
    if (db.members.some(function (m) { return normEmail(m.email) === email; })) return fail('此 Email 已註冊');
    var row = {
      id: uid('mbr'),
      email: email,
      password: password,
      displayName: displayName,
      status: 'active',
      createdAt: nowIso()
    };
    db.members.push(row);
    saveDb(db);
    return ok({
      message: '註冊成功',
      member: { id: row.id, email: row.email, displayName: row.displayName }
    });
  };

  impl.loginMember = function (email, password) {
    var db = loadDb();
    var em = normEmail(email);
    var pw = String(password || '');
    if (!em || !pw) return fail('請輸入 Email 與密碼');
    var arr = db.members || [];
    var m = arr.find(function (x) {
      return (
        normEmail(x.email) === em &&
        String(x.password || '') === pw &&
        String(x.status || 'active').toLowerCase() === 'active'
      );
    });
    if (!m) return fail('帳號或密碼錯誤');
    return ok({
      message: '登入成功',
      member: { id: m.id, email: m.email, displayName: m.displayName }
    });
  };

  impl.cmsSaveAchievement = function (payload, adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    var db = loadDb();
    var arr = db.achievements || (db.achievements = []);
    var p = payload || {};
    if (p.id) {
      var ix = arr.findIndex(function (x) {
        return x.id === p.id;
      });
      if (ix === -1) return fail('找不到成就');
      arr[ix] = Object.assign({}, arr[ix], p);
    } else {
      arr.push(Object.assign({}, p, { id: uid('ach') }));
    }
    saveDb(db);
    return ok({ message: '已儲存' });
  };

  impl.cmsDeleteAchievement = function (id, adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) return fail('未授權');
    var db = loadDb();
    db.achievements = (db.achievements || []).filter(function (x) {
      return x.id !== id;
    });
    saveDb(db);
    return ok({ message: '已刪除' });
  };

  impl.saveSpecimen = function (payload) {
    var db = loadDb();
    var p = payload || {};
    var now = nowIso();
    var specimens = db.specimens || (db.specimens = []);
    var oldRow = null;
    if (p.id) {
      var ix = specimens.findIndex(function (s) {
        return String(s.id) === String(p.id);
      });
      if (ix === -1) return fail('找不到標本');
      oldRow = Object.assign({}, specimens[ix]);
      specimens[ix] = Object.assign({}, specimens[ix], p, { updatedAt: now });
    } else {
      specimens.push(
        Object.assign({}, p, {
          id: uid('sp'),
          specimenNo: p.specimenNo || 'MC-' + now.slice(0, 10).replace(/-/g, '') + '-LOCAL',
          createdAt: now,
          updatedAt: now
        })
      );
    }
    var ixFinal = p.id
      ? specimens.findIndex(function (s) {
          return String(s.id) === String(p.id);
        })
      : specimens.length - 1;
    var merged = specimens[ixFinal];
    var basePts = p.id ? gameRewardNum(db, 'specimenUpdatePoints') : gameRewardNum(db, 'specimenCreatePoints');
    var bonus = 0;
    if (specimenComplete(merged) && (!oldRow || !specimenComplete(oldRow))) {
      bonus = gameRewardNum(db, 'specimenCompleteBonus');
    }
    var pts = basePts + bonus;
    db.activities = db.activities || [];
    db.activities.unshift({
      id: uid('act'),
      type: 'specimen_updated',
      targetId: p.id || merged.id || '',
      title: p.id ? '更新標本' : '新增標本',
      detail: p.name || p.scientificName || '',
      points: pts,
      createdAt: now
    });
    saveDb(db);
    return ok({ message: '已儲存（本機）' });
  };

  impl.saveSpecimensBatch = function (rows) {
    var db = loadDb();
    var specimens = db.specimens || (db.specimens = []);
    var now = nowIso();
    (rows || []).forEach(function (r) {
      specimens.push(
        Object.assign({}, r, {
          id: uid('sp'),
          specimenNo: r.specimenNo || 'MC-BATCH-LOCAL',
          createdAt: now,
          updatedAt: now
        })
      );
    });
    saveDb(db);
    var n = (rows || []).length;
    var results = [];
    for (var ri = 0; ri < n; ri++) {
      results.push({ index: ri, ok: true, message: 'OK', specimenId: '', specimenNo: '' });
    }
    return ok({
      message: '批次已寫入本機',
      successCount: n,
      total: n,
      results: results
    });
  };

  impl.uploadImageToDrive = function (payload) {
    var b64 = payload && payload.base64 ? String(payload.base64) : '';
    var mime = (payload && payload.mimeType) || 'image/jpeg';
    if (!b64) return fail('缺少影像資料');
    var url = 'data:' + mime + ';base64,' + b64;
    if (url.length > 48000) {
      return fail('本機示範：影像過大，請改「僅加入名稱列」或壓縮後再上傳');
    }
    return ok({
      message: '本機已內嵌影像',
      media: {
        id: 'MED-LOCAL-' + Math.random().toString(36).slice(2, 8),
        fileUrl: url,
        fileId: '',
        previewUrl: url
      }
    });
  };

  impl.deleteSpecimen = function (id) {
    var db = loadDb();
    db.specimens = (db.specimens || []).filter(function (s) {
      return String(s.id) !== String(id);
    });
    saveDb(db);
    return ok({ message: '已刪除' });
  };

  impl.searchSpeciesTaxonomy = function (q) {
    function esc(s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;');
    }
    function localFallbackMerged_(query) {
      var queryLc = String(query || '')
        .trim()
        .toLowerCase();
      var merged = [
        {
          source: 'GBIF',
          rank: 'species',
          label: 'Papilio xuthus Linnaeus, 1767',
          scientificName: 'Papilio xuthus',
          kingdom: 'Animalia',
          family: 'Papilionidae'
        },
        {
          source: 'CoL',
          rank: 'species',
          label: 'Papilio xuthus (Asian swallowtail)',
          scientificName: 'Papilio xuthus',
          kingdom: 'Animalia',
          family: 'Papilionidae'
        },
        {
          source: 'PBDB',
          rank: 'class',
          label: 'Trilobita (Walch, 1771)',
          scientificName: 'Trilobita',
          phylum: 'Arthropoda',
          klass: 'Trilobita',
          pbdbTxnOid: 'txn:19100',
          geologicalPeriodEarly: 'Fortunian',
          geologicalPeriodLate: 'Rupelian'
        }
      ].filter(function (h) {
        return (
          !queryLc ||
          String(h.scientificName || '')
            .toLowerCase()
            .indexOf(queryLc) !== -1 ||
          String(h.label || '')
            .toLowerCase()
            .indexOf(queryLc) !== -1
        );
      });
      if (!merged.length) {
        merged.push({
          source: 'GBIF',
          rank: 'species',
          label: 'Demo taxon matching "' + esc(q) + '"',
          scientificName: 'Demoia previewii',
          kingdom: 'Animalia',
          family: 'Demoidae'
        });
      }
      return merged;
    }
    if (
      typeof window !== 'undefined' &&
      window.McTaxonomy &&
      typeof window.McTaxonomy.searchTaxonSuggestions === 'function'
    ) {
      return window.McTaxonomy.searchTaxonSuggestions(q).then(function (remote) {
        if (remote && remote.length) {
          return ok({ merged: remote });
        }
        return ok({ merged: localFallbackMerged_(q) });
      });
    }
    return Promise.resolve(ok({ merged: localFallbackMerged_(q) }));
  };

  impl.lookupSpeciesTaxonomyForForm = function (payload) {
    var p = payload || {};
    var desc = [];
    var tags = [];
    var sci =
      (p.gbifHit && p.gbifHit.scientificName) ||
      (p.colHit && p.colHit.scientificName) ||
      (p.pbdbHit && p.pbdbHit.scientificName) ||
      (p.elcHit && p.elcHit.scientificName) ||
      p.scientificName ||
      '';

    if (p.gbifHit) {
      var g = p.gbifHit;
      desc.push(
        'GBIF：' + [g.kingdom, g.phylum, g.klass, g.order, g.family].filter(Boolean).join(' → ')
      );
      if (g.taxonKey != null) tags.push('GBIF:' + g.taxonKey);
    }
    if (p.colHit) {
      desc.push('CoL：' + (p.colHit.label || p.colHit.scientificName));
    }
    if (p.pbdbHit) {
      var b = p.pbdbHit;
      desc.push(
        'PBDB：' + [b.phylum, b.klass, b.order, b.family, b.rank].filter(Boolean).join(' → ')
      );
      if (b.geologicalPeriodEarly || b.geologicalPeriodLate) {
        desc.push(
          'PBDB 時間帶：' + [b.geologicalPeriodEarly, b.geologicalPeriodLate].filter(Boolean).join(' – ')
        );
      }
      if (b.pbdbTxnOid || b.pbdbTxnNo) tags.push('PBDB:' + String(b.pbdbTxnOid || b.pbdbTxnNo).replace(/^txn:/, ''));
    }
    if (p.elcHit) {
      desc.push('ELC：' + (p.elcHit.label || p.elcHit.scientificName));
      if (p.elcHit.elcTaxonRef) tags.push('ELC:' + p.elcHit.elcTaxonRef);
      else tags.push('ELC');
    }

    var name =
      (p.gbifHit && p.gbifHit.label && String(p.gbifHit.label).split('—')[0].trim()) ||
      (p.elcHit && p.elcHit.label) ||
      sci ||
      '預覽用俗名';
    var category =
      (p.gbifHit && p.gbifHit.kingdom) ||
      (p.pbdbHit && p.pbdbHit.phylum) ||
      'Animalia';
    var sub =
      (p.gbifHit && p.gbifHit.family) ||
      (p.pbdbHit && (p.pbdbHit.family || p.pbdbHit.order)) ||
      'Demoidae';

    return ok({
      scientificName: sci || 'Demoia previewii',
      name: name,
      category: category,
      subcategory: sub,
      description: desc.length ? desc.join('\n\n') : '本機模式：分類資料來自開放 API 或內建示範結果。',
      tagsExtra: tags.length ? tags.join(', ') : 'taxonomy-preview',
      iucnStatus: (p.gbifHit && p.gbifHit.iucnStatus) || 'NT'
    });
  };

  impl.translateTextMachine = function (text, targetLang, sourceLang) {
    return ok({
      translatedText:
        '[local preview] target=' +
        String(targetLang || 'en') +
        ' ← ' +
        String(text || '').slice(0, 120) +
        (String(text || '').length > 120 ? '…' : ''),
      target: targetLang || 'en',
      detectedSource: sourceLang || 'auto',
      provider: 'local_mock',
      _note: '本機示範回傳；正式翻譯可接 Google Translate API 或其他服務'
    });
  };

  impl.geocodeAddress = function (address) {
    return nominatimSearch(address)
      .then(function (arr) {
        if (!arr || !arr.length) return fail('找不到地址');
        var j = arr[0];
        var lat = Number(j.lat);
        var lon = Number(j.lon);
        return ok({
          latitude: lat,
          longitude: lon,
          decimalLatitude: lat,
          decimalLongitude: lon,
          formattedAddress: j.display_name || '',
          country: '',
          locality: ''
        });
      })
      .catch(function () {
        return fail('地理編碼失敗（可能被瀏覽器或網路阻擋）');
      });
  };

  impl.reverseGeocode = function (lat, lng) {
    return nominatimReverse(lat, lng)
      .then(function (j) {
        if (!j || !j.display_name) return fail('逆地理編碼失敗');
        var addr = j.address || {};
        return ok({
          latitude: Number(lat),
          longitude: Number(lng),
          decimalLatitude: Number(lat),
          decimalLongitude: Number(lng),
          formattedAddress: j.display_name || '',
          country: addr.country || '',
          stateProvince: addr.state || '',
          county: addr.county || '',
          locality: addr.city || addr.town || addr.village || ''
        });
      })
      .catch(function () {
        return fail('逆地理編碼失敗');
      });
  };

  impl.getQrCodeUrl = function (text, sizePx) {
    return ok(qrServiceUrl(text, sizePx));
  };

  impl.getSpecimenQrCode = function (id, sizePx) {
    var sp = findSpecimen(id);
    var payload = JSON.stringify({
      id: id,
      specimenNo: sp && sp.specimenNo,
      name: sp && sp.name
    });
    var url = qrServiceUrl(payload, sizePx);
    return ok({ qrUrl: url, url: url });
  };

  impl.previewLabels = function (ids) {
    var db = loadDb();
    var list = (db.specimens || []).filter(function (s) {
      if (!ids || !ids.length) return true;
      var sid = String(s.id);
      return ids.some(function (x) {
        return String(x) === sid;
      });
    });
    var rows = list
      .map(function (s) {
        return (
          '<tr><td>' +
          [s.specimenNo, s.name, s.scientificName, s.collectedDate]
            .map(function (c) {
              return String(c || '');
            })
            .join('</td><td>') +
          '</td></tr>'
        );
      })
      .join('');
    var html =
      '<!doctype html><html><head><meta charset="utf-8"/><title>Labels preview</title></head><body style="font-family:system-ui;padding:16px"><h1>標籤預覽（本機）</h1><table border="1" cellpadding="6"><tr><th>No</th><th>Name</th><th>Scientific</th><th>Date</th></tr>' +
      rows +
      '</table><p>正式環境將由伺服器產生列印版面。</p></body></html>';
    var blob = new Blob([html], { type: 'text/html' });
    return ok({ url: URL.createObjectURL(blob) });
  };

  function buildSpecimenExportTextLocal(specimens, type) {
    if (String(type).toLowerCase() === 'json') {
      return JSON.stringify(specimens || [], null, 2);
    }
    if (!specimens || !specimens.length) {
      return '';
    }
    return specimens
      .map(function (r) {
        return [r.id, r.name, r.scientificName, r.category, r.location, r.collectedDate]
          .map(function (c) {
            return '"' + String(c || '').replace(/"/g, '""') + '"';
          })
          .join(',');
      })
      .join('\n');
  }

  impl.getSpecimenExportForAdmin = function (format, adminEmail, adminPassword) {
    if (!verifyAdmin(adminEmail, adminPassword)) {
      return fail('未授權：需要有效管理員帳號以匯出標本');
    }
    var db = loadDb();
    var kind = String(format || 'csv').toLowerCase() === 'json' ? 'json' : 'csv';
    var rows = (db.specimens && db.specimens.length) || 0;
    var detail = String(adminEmail || '') + ' · ' + kind + ' · ' + rows + ' rows';
    db.activities = db.activities || [];
    db.activities.unshift({
      id: uid('act'),
      type: 'admin_specimen_export',
      targetId: 'export',
      title: '管理員匯出標本',
      detail: detail,
      points: 0,
      createdAt: nowIso()
    });
    saveDb(db);
    if (kind === 'json') {
      return ok({
        content: JSON.stringify(db.specimens || [], null, 2),
        filename: 'mcurator-specimens.json',
        mime: 'application/json; charset=utf-8'
      });
    }
    return ok({
      content: '\uFEFF' + buildSpecimenExportTextLocal(db.specimens, 'csv'),
      filename: 'mcurator-specimens.csv',
      mime: 'text/csv; charset=utf-8'
    });
  };

  impl.saveSettings = function (payload) {
    var db = loadDb();
    var prior = db.settings || {};
    var p = Object.assign({}, payload || {});
    if (Object.prototype.hasOwnProperty.call(p, 'mapGeocodingEndpoint')) {
      p.mapGeocodingEndpoint = mergeGeocodingLocal_(String(p.mapGeocodingEndpoint), String(prior.mapGeocodingEndpoint || ''));
    }
    if (Object.prototype.hasOwnProperty.call(p, 'featureSatMarketplace') && p.featureSatMarketplace != null) {
      var v = String(p.featureSatMarketplace).toLowerCase();
      p.featureSatMarketplace = v === 'false' ? 'false' : 'true';
    }
    if (Object.prototype.hasOwnProperty.call(p, 'publicSpecimenExport') && p.publicSpecimenExport != null) {
      var v3 = String(p.publicSpecimenExport).toLowerCase();
      p.publicSpecimenExport = v3 === 'false' ? 'false' : 'true';
    }
    db.settings = Object.assign({}, prior, p);
    saveDb(db);
    return ok({ message: '設定已儲存（本機）', settings: redactSettingsForClient(db.settings) });
  };

  impl.dailyCheckIn = function () {
    var db = loadDb();
    db.profile = db.profile || {};
    var nextStreak = Number(db.profile.streakDays || 0) + 1;
    var pts = gameRewardNum(db, 'checkInBase');
    if (nextStreak > 0 && nextStreak % 7 === 0) pts += gameRewardNum(db, 'checkInWeekBonus');
    db.profile.points = Number(db.profile.points || 0) + pts;
    db.profile.streakDays = nextStreak;
    db.activities = db.activities || [];
    db.activities.unshift({
      id: uid('act'),
      type: 'checkin',
      targetId: '',
      title: '每日簽到',
      detail: '本機 +' + pts + ' pts',
      points: pts,
      createdAt: nowIso()
    });
    saveDb(db);
    return ok({ message: '簽到成功（本機）', pointsAwarded: pts });
  };

  impl.saveResearcherProgress = function (payload) {
    var db = loadDb();
    var p = payload || {};
    if (p.researcherProgress && typeof p.researcherProgress === 'object') {
      db.researcherProgress = Object.assign({}, db.researcherProgress || {}, p.researcherProgress);
    }
    if (p.profile && typeof p.profile === 'object') {
      db.profile = Object.assign({}, db.profile || {}, p.profile);
    }
    saveDb(db);
    return ok({ researcherProgress: db.researcherProgress, profile: db.profile });
  };

  impl.getUiStudioConfig = function () {
    try {
      return ok({ json: localStorage.getItem('MC_UI_STUDIO_CONFIG') || '' });
    } catch (e) {
      return ok({ json: '' });
    }
  };

  impl.saveUiStudioConfig = function (payloadJson) {
    try {
      localStorage.setItem('MC_UI_STUDIO_CONFIG', String(payloadJson || ''));
    } catch (e) {}
    return ok({ message: 'saved' });
  };

  impl.getGoogleElevationMeters = function () {
    return null;
  };

  var suc = function () {};
  var fl = function (e) {
    console.error(e);
  };
  /** 必須回傳同一個 Proxy，否則 .withSuccessHandler().withFailureHandler().bootstrapApp() 會落在純物件上而報「不是函式」 */
  var runApi;
  var chain = {
    withSuccessHandler: function (fn) {
      suc = fn;
      return runApi;
    },
    withFailureHandler: function (fn) {
      fl = fn;
      return runApi;
    }
  };

  runApi = new Proxy(chain, {
    get: function (target, prop) {
      if (prop === 'withSuccessHandler' || prop === 'withFailureHandler') return target[prop];
      return function () {
        var args = Array.prototype.slice.call(arguments);
        var method = String(prop);
        Promise.resolve()
          .then(function () {
            var fn = impl[method];
            if (!fn) return fail('Unknown method: ' + method);
            return fn.apply(impl, args);
          })
          .then(function (res) {
            suc(res);
          })
          .catch(function (e) {
            fl(e);
          });
        return runApi;
      };
    }
  });

  window.google = window.google || {};
  window.google.script = window.google.script || {};
  window.google.script.run = runApi;
  window.google.script.run.__mcLocalMock = true;
})();

if (MC_FLICKR_PICTUREPIZ == null || (MC_FLICKR_PICTUREPIZ && !MC_FLICKR_PICTUREPIZ.length)) {
  (function () {
    var a = mcGetDemoImageUrlPool_();
    MC_FLICKR_PICTUREPIZ = [];
    if (a && a.length) for (var i = 0; i < 24; i++) MC_FLICKR_PICTUREPIZ[i] = a[i % a.length];
  })();
}
try {
  window.MC_DEMO_INSECT_ALBUM_URL = typeof MC_DEMO_INSECT_ALBUM_URL !== 'undefined' ? MC_DEMO_INSECT_ALBUM_URL : '';
  window.MC_DEMO_SPECIMEN_IMAGES = MC_FLICKR_PICTUREPIZ;
} catch (e) {}
