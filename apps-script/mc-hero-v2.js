/**
 * MCurator passport hero — 3D card + hotspots + multi-type specimen demos.
 */
(function () {
  'use strict';

  var ROOT = '#mcWelcomeHero[data-hero-version="passport-hero-rebuild-v3"]';
  var CYCLE_MS = 9000;
  var heroRoot = null;
  var heroSpecimenCtrl = null;

  function isPhoneHeroLayout() {
    try {
      if (document.documentElement.classList.contains('ui-layout-mobile')) return true;
    } catch (eClass) {
      void 0;
    }
    try {
      return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    } catch (eMq) {
      return false;
    }
  }

  function getLang() {
    try {
      if (typeof window.mcGetLang === 'function') return window.mcGetLang();
    } catch (eMc) {
      void 0;
    }
    try {
      if (typeof state !== 'undefined' && state && state.lang) return state.lang;
      if (window.MC_LOCALE) return window.MC_LOCALE;
      var s = localStorage.getItem('MC_USER_LANG');
      if (s === 'en' || s === 'zh-TW' || s === 'ja-JP' || s === 'de-DE') return s;
    } catch (e0) {
      void 0;
    }
    return 'zh-TW';
  }

  function isZh() {
    return getLang() === 'zh-TW';
  }

  function isJa() {
    return getLang() === 'ja-JP';
  }

  function isDe() {
    return getLang() === 'de-DE';
  }

  function wfI18nPack() {
    try {
      if (getLang() === 'de-DE' && window.MCWorkflowScreenshotDeI18n) return window.MCWorkflowScreenshotDeI18n;
      return window.MCWorkflowScreenshotI18n || null;
    } catch (e) {
      return null;
    }
  }

  function L(zh, en, ja) {
    var lang = getLang();
    if (lang === 'zh-TW') return zh;
    if (lang === 'ja-JP') {
      if (ja != null && String(ja).length) return ja;
      var packJa = wfI18nPack();
      if (packJa && packJa.zhJa && packJa.zhJa[zh] != null) return packJa.zhJa[zh];
      if (packJa && packJa.enJa && packJa.enJa[en] != null) return packJa.enJa[en];
      return en;
    }
    if (lang === 'de-DE') {
      var packDe = wfI18nPack();
      if (packDe && packDe.zhDe && packDe.zhDe[zh] != null) return packDe.zhDe[zh];
      if (packDe && packDe.enDe && packDe.enDe[en] != null) return packDe.enDe[en];
      return en;
    }
    return en;
  }

  function t(key, zh, en, ja) {
    try {
      if (typeof window.MCt === 'function') {
        var v = window.MCt(key);
        if (v != null && String(v).length && v !== '—' && String(v).indexOf('待補譯') === -1 && String(v) !== key) return v;
      }
    } catch (e) {
      void 0;
    }
    return L(zh, en, ja);
  }

  var SPECIMEN_LABELS = {
    insect: ['昆蟲', 'Insects', '昆虫'],
    plant: ['植物', 'Plants', '植物'],
    marine: ['海洋', 'Marine', '海洋'],
    fossil: ['化石', 'Fossils', '化石'],
    bird: ['鳥類', 'Birds', '鳥類'],
    mineral: ['礦石', 'Minerals', '鉱物'],
    crustacean: ['甲殼類', 'Crustaceans', '甲殻類'],
    shell: ['貝殼', 'Shells', '貝殻'],
    dino: ['恐龍復原', 'Dinosaur reconstruction', '恐竜復元'],
    paleo: ['學術復原', 'Academic reconstruction', '学術復元'],
    lepidoptera: ['鱗翅目', 'Lepidoptera', '鱗翅目'],
    paleobio: ['古生物', 'Paleobiology', '古生物'],
    extinct: ['絕種生物', 'Extinct species', '絶滅種'],
    chondrichthyes: ['軟骨魚', 'Cartilaginous fish', '軟骨魚類'],
    acanthodii: ['棘魚綱', 'Acanthodii', '棘魚綱'],
    mammal: ['哺乳類', 'Mammals', '哺乳類'],
    seed: ['種子', 'Seeds', '種子'],
    fungi: ['菌菇', 'Fungi', '菌類'],
    skeleton: ['骨骼標本', 'Skeletal specimens', '骨格標本'],
  };

  function specimenLabel(key) {
    var triple = SPECIMEN_LABELS[key];
    if (!triple) return key;
    return L(triple[0], triple[1], triple[2]);
  }

  var VISIBILITY_EN = {
    '館藏級示範': 'Museum-grade demo',
    '研究資料共享': 'Research data sharing',
    '研究館藏公開': 'Research collection (public)',
    '博物館數位館藏': 'Museum digital collection',
    '學術復原示範': 'Academic reconstruction demo',
    '常規種': 'Common species',
    '稀有': 'Rare',
    '公開': 'Public',
    '館內主要': 'Internal (primary)',
    '教育展示': 'Educational display',
    '產地常見': 'Common at locality',
    '保護區內': 'Within protected area',
    '潮間帶': 'Intertidal zone',
    '館藏複製': 'Collection replica',
  };

  var VISIBILITY_JA = {
    '館藏級示範': '館蔵級デモ',
    '研究資料共享': '研究データ共有',
    '研究館藏公開': '研究館蔵（公開）',
    '博物館數位館藏': '博物館デジタル館蔵',
    '學術復原示範': '学術復元デモ',
    '常規種': '一般種',
    '稀有': '希少',
    '公開': '公開',
    '館內主要': '館内主要',
    '教育展示': '教育展示',
    '產地常見': '産地で一般的',
    '保護區內': '保護区内',
    '潮間帶': '潮間帯',
    '館藏複製': '館蔵複製',
  };

  var VISIBILITY_DE = {
    '館藏級示範': 'Museumsqualitäts-Demo',
    '研究資料共享': 'Forschungsdaten teilen',
    '研究館藏公開': 'Forschungssammlung (öffentlich)',
    '博物館數位館藏': 'Digitale Museumsammlung',
    '學術復原示範': 'Akademische Rekonstruktions-Demo',
    '常規種': 'Häufige Art',
    '稀有': 'Selten',
    '公開': 'Öffentlich',
    '館內主要': 'Intern (Hauptbestand)',
    '教育展示': 'Bildungsausstellung',
    '產地常見': 'Am Fundort häufig',
    '保護區內': 'In Schutzgebiet',
    '潮間帶': 'Gezeitenzone',
    '館藏複製': 'Sammlungsreplikat',
  };

  function localizeVisibility(val) {
    var s = String(val || '').trim();
    if (!s) return t('hero_vis_not_set', '未設定', 'Not set', 'Nicht festgelegt');
    if (isZh()) return s;
    if (isJa()) return VISIBILITY_JA[s] || VISIBILITY_EN[s] || s;
    if (isDe()) return VISIBILITY_DE[s] || VISIBILITY_EN[s] || s;
    return VISIBILITY_EN[s] || s;
  }

  var LOCALITY_GEO_EN = {
    '\u99ac\u4f86\u897f\u4e9e': 'Malaysia', '\u9732\u9731': 'Raub', '\u81fa\u7063': 'Taiwan', '\u53f0\u7063': 'Taiwan', '\u5357\u6295': 'Nantou',
    '\u6cf0\u570b': 'Thailand', '\u6e05\u9081': 'Chiang Mai', '\u5370\u5c3c': 'Indonesia', '\u8607\u62c9\u5a01\u897f': 'Sulawesi',
    '\u667a\u5229': 'Chile', '\u5357\u90e8\u6eab\u5e36\u6797': 'Southern temperate forest', '\u6c99\u5df4': 'Sabah',
    '\u5384\u74dc\u591a': 'Ecuador', '\u4e9e\u99ac\u905c\u4f4e\u5730': 'Amazon lowlands', '\u5fb7\u570b': 'Germany',
    '\u5df4\u4f10\u5229\u4e9e': 'Bavaria', '\u525b\u679c\uff08\u91d1\uff09': 'DR Congo', '\u4e2d\u975e\u71b1\u5e36\u6797': 'Central African rainforest',
    '\u83f2\u5f8b\u8cd3': 'Philippines', '\u5442\u5b8b': 'Luzon', '\u8d8a\u5357': 'Vietnam', '\u4e2d\u90e8\u9ad8\u539f': 'Central highlands',
    '\u7802\u62c9\u8d8a': 'Sarawak', '\u6fb3\u6d32': 'Australia', '\u6606\u58eb\u862d': 'Queensland', '\u8607\u9580\u7b54\u81e8': 'Sumatra',
    '\u5df4\u897f': 'Brazil', '\u4e9e\u99ac\u905c': 'Amazonia', '\u6b50\u6d32': 'Europe', '\u6eab\u5e36\u6797\u8fb9\u7de3': 'Temperate forest margin',
    '\u54e5\u65af\u5927\u9ece\u52a0': 'Costa Rica', '\u5854\u62c9\u66fc\u5361': 'Talamanca', '\u79d8\u9b6f': 'Peru',
    '\u6469\u9e7f\u52a0\u7fa4\u5cf6': 'Moluccas', '\u6771\u90e8\u96e8\u6797': 'Eastern rainforest', '\u5df4\u62ff\u99ac': 'Panama',
    '\u5317\u7f8e\u6d32': 'North America', '\u6eab\u5e36\u8349\u7538': 'Temperate meadow', '\u897f\u90e8\u6cbf\u5cb8': 'Western coast',
    '\u745e\u5178': 'Sweden', '\u5967\u5fb7\u7dad\u65af\u671f': 'Ordovician', '\u53f0\u5317': 'Taipei', '\u5df4\u897f\u7c73\u7d0d\u5409\u62c9\u65af': 'Minas Gerais',
    '\u5854\u65af\u99ac\u5c3c\u4e9e': 'Tasmania', '\u632a\u5a01': 'Norway', '\u5351\u723e\u6839': 'Bergen', '\u4e2d\u570b': 'China',
    '\u907c\u5be7': 'Liaoning', '\u52a0\u62ff\u5927': 'Canada', '\u4f2f\u683c\u65af\u9801\u5ca9': 'Burgess Shale',
    '\u7f8e\u570b': 'United States', '\u7336\u4ed6\u5dde': 'Utah', '\u5bc6\u8607\u91cc\u5dde': 'Missouri', '\u4fc4\u4ea5\u5dde': 'Ohio',
    '\u76ae\u79d1\u6c99\u76c6\u5730': 'Pisco Basin', '\u6cd5\u570b': 'France', '\u963f\u97cc\u9f8d': 'Aveyron',
    '\u5357\u7f8e\u6d32': 'South America', '\u539f\u7522\u5730': 'Native range',
    '\u82d7\u6817': 'Miaoli', '\u5357\u6295': 'Nantou', '\u6c96\u7e04 \u6176\u826f\u9593\u8af8\u5cf6': 'Kerama Islands, Okinawa',
    '\u9732\u9727': 'Raub', '\u9732\u9731': 'Raub', '\u9739\u9742': 'Perak', '\u9732\u7c73\u4e9e': 'Perak',
    '\u99ac\u4f86\u897f\u4e9e\u30fb\u9732\u9727': 'Raub, Malaysia', '\u99ac\u4f86\u897f\u4e9e\u30fb\u9732\u9731': 'Raub, Malaysia',
    '\u99ac\u4f86\u897f\u4e9e\u30fb\u9739\u9742': 'Perak, Malaysia', '\u99ac\u4f86\u897f\u4e9e\u30fb\u9732\u7c73\u4e9e': 'Perak, Malaysia',
    '\u99ac\u4f86\u897f\u4e9e \u00b7 \u9739\u9742': 'Malaysia \u00b7 Perak', '\u99ac\u4f86\u897f\u4e9e \u00b7 \u9732\u7c73\u4e9e': 'Malaysia \u00b7 Perak',
    '\u81fa\u7063\u30fb\u5357\u6295': 'Nantou, Taiwan', '\u81fa\u7063 \u00b7 \u5357\u6295': 'Taiwan \u00b7 Nantou',
    '\u53f0\u7063\u30fb\u5357\u6295': 'Nantou, Taiwan', '\u53f0\u7063 \u00b7 \u5357\u6295': 'Taiwan \u00b7 Nantou',
    '\u6cf0\u570b\u30fb\u6e05\u9081': 'Chiang Mai, Thailand', '\u6cf0\u570b \u00b7 \u6e05\u9081': 'Thailand \u00b7 Chiang Mai'
  };

  var DATE_DISPLAY_EN = {
    '\u767d\u5805\u7d00\u65e9\u671f': 'Early Cretaceous',
    '\u767d\u5805\u7d00\u665a\u671f': 'Late Cretaceous',
    '\u767d\u5805\u7d00\u65e9\u671f \u00b7 \u5730\u8cea\u5fa9\u539f': 'Early Cretaceous · geological reconstruction',
    '\u5730\u8cea\u6a19\u672c \u00b7 \u7121\u63a1\u96c6\u65e5': 'Geological specimen · no collection date',
    '\u745e\u5178 \u00b7 \u5967\u5fb7\u7dad\u65af\u671f': 'Sweden · Ordovician',
    '\u767d\u5805\u7d00\u665a\u671f \u00b7 \u5730\u8cea\u5fa9\u539f': 'Late Cretaceous · geological reconstruction',
    '\u1936 \u00b7 \u6700\u5f8c\u7d00\u9304': '1936 · last record'
  };

  var EXPORT_LINE_JA = {
    'QR \u00b7 CSV \u00b7 JSON - \u7686\u7dad\u6301\u89e3\u9396': 'QR \u2022 CSV \u2022 JSON \u2014 すべてアンロック',
    'QR \u00b7 CSV \u00b7 JSON \u2014 \u53ef\u8ffd\u6eaf\u532f\u51fa': 'QR \u2022 CSV \u2022 JSON \u2014 追跡可能なエクスポート',
    'QR \u00b7 CSV \u00b7 JSON \u2014 \u5f85\u532f\u51fa': 'QR \u2022 CSV \u2022 JSON \u2014 エクスポート待ち'
  };

  var EXPORT_LINE_DE = {
    'QR \u00b7 CSV \u00b7 JSON - \u7686\u7dad\u6301\u89e3\u9396': 'QR \u2022 CSV \u2022 JSON \u2014 alles freigeschaltet',
    'QR \u00b7 CSV \u00b7 JSON \u2014 \u53ef\u8ffd\u6eaf\u532f\u51fa': 'QR \u2022 CSV \u2022 JSON \u2014 nachverfolgbarer Export',
    'QR \u00b7 CSV \u00b7 JSON \u2014 \u5f85\u532f\u51fa': 'QR \u2022 CSV \u2022 JSON \u2014 Export ausstehend'
  };

  var EXPORT_LINE_EN = {
    'QR \u00b7 CSV \u00b7 JSON - \u7686\u7dad\u6301\u89e3\u9396': 'QR \u2022 CSV \u2022 JSON \u2014 all unlocked',
    'QR \u00b7 CSV \u00b7 JSON \u2014 \u53ef\u8ffd\u6eaf\u532f\u51fa': 'QR \u2022 CSV \u2022 JSON \u2014 traceable export',
    'QR \u00b7 CSV \u00b7 JSON \u2014 \u5f85\u532f\u51fa': 'QR \u2022 CSV \u2022 JSON \u2014 export pending'
  };

  function translateLocalityPart_(trimmed) {
    if (!trimmed) return trimmed;
    if (LOCALITY_GEO_EN[trimmed]) return LOCALITY_GEO_EN[trimmed];
    if (!/[\u4e00-\u9fff]/.test(trimmed)) return trimmed;
    var out = trimmed;
    var keys = Object.keys(LOCALITY_GEO_EN).sort(function (a, b) {
      return b.length - a.length;
    });
    keys.forEach(function (key) {
      if (out.indexOf(key) >= 0) out = out.split(key).join(LOCALITY_GEO_EN[key]);
    });
    return out.replace(/[\u4e00-\u9fff]+/g, '').replace(/\s{2,}/g, ' ').trim() || trimmed;
  }

  function translateLocality(raw) {
    if (!raw || raw === '\u2014') return raw;
    if (isZh() || isJa()) return raw;
    var whole = String(raw).trim();
    if (LOCALITY_GEO_EN[whole]) return LOCALITY_GEO_EN[whole];
    return whole.split(/[\u00b7\u30fb]/).map(function (part) {
      return translateLocalityPart_(part.trim());
    }).join(' \u00b7 ');
  }

  function localizeDate(val) {
    if (!val || val === '\u2014') return val || '\u2014';
    var geoFn =
      (typeof window !== 'undefined' && typeof window.mcTranslateGeologicalDate === 'function'
        ? window.mcTranslateGeologicalDate
        : null) ||
      (typeof global !== 'undefined' && typeof global.mcTranslateGeologicalDate === 'function'
        ? global.mcTranslateGeologicalDate
        : null);
    if (geoFn) return geoFn(val);
    if (isZh() || isJa() || isDe()) return val;
    return DATE_DISPLAY_EN[val] || val;
  }

  /** Demo catalog photos — paths under assets/images/ (local preview). */
  var HERO_PASSPORT_DEMO_RELS = {
    plant: 'assets/images/plant/hero-passport/solidago-canadensis.png',
    marine: 'assets/images/marine/hero-passport/tachypleus-tridentatus.png',
    fossil: 'assets/images/fossil/hero-passport/harpides-grimmi.png',
    bird: 'assets/images/bird/hero-passport/copsychus-saularis.png',
    mineral: 'assets/images/mineral/hero-passport/amethyst-quartz.png',
    crustacean: 'assets/images/crustacean/hero-passport/pseudocarcinus-gigas.png',
    shell: 'assets/images/shell/hero-passport/buccinum-undatum.png',
    dino: 'assets/images/dino/hero-passport/yutyrannus-huali.png',
    paleo: 'assets/images/paleo/hero-passport/ovatiovermis-cribratus.png',
    lepidoptera: 'assets/images/lepidoptera/hero-passport/kaniska-canace.png',
    paleobio: 'assets/images/paleobio/hero-passport/utahnax-vannieri.png',
    extinct: 'assets/images/extinct/hero-passport/thylacinus-potens.png',
    chondrichthyes: 'assets/images/chondrichthyes/hero-passport/stethacanthus-altonensis.png',
    acanthodii: 'assets/images/acanthodii/hero-passport/dinichthys-terrelli.png',
    mammal: 'assets/images/mammal/hero-passport/odobenocetops-peruvianus.png',
    seed: 'assets/images/seed/hero-passport/castanospermum-australis.png',
    fungi: 'assets/images/fungi/hero-passport/craterellus-cornucopioides.png',
    skeleton: 'assets/images/skeleton/hero-passport/manis-pentadactyla.png',
  };

  var HERO_PASSPORT_FALLBACKS = {
    plant: [
      'assets/images/plant/hero-passport/solidago-canadensis.png',
      'assets/images/herbarium/herbarium-complete-fp-hero-v2.jpg',
      'assets/images/herbarium/herbarium-frame-fp-hero-v2.jpg',
    ],
    marine: [
      'assets/images/marine/hero-passport/tachypleus-tridentatus.png',
      'assets/images/marine/marine-shoot-fp-hero.jpg',
      'assets/images/marine/marine-identify-fp-hero.jpg',
    ],
    fossil: [
      'assets/images/fossil/hero-passport/harpides-grimmi.png',
      'assets/images/fossil/fossil-exhibit-fp-hero.jpg',
      'assets/images/fossil/fossil-register-fp-hero.jpg',
    ],
    bird: ['assets/images/bird/hero-passport/copsychus-saularis.png'],
    mineral: ['assets/images/mineral/hero-passport/amethyst-quartz.png'],
    crustacean: ['assets/images/crustacean/hero-passport/pseudocarcinus-gigas.png'],
    shell: ['assets/images/shell/hero-passport/buccinum-undatum.png'],
    dino: [
      'assets/images/dino/hero-passport/yutyrannus-huali.png',
      'assets/images/dino/hero-passport/zhuchengtyrannus-magnus.png',
      'assets/images/dino/hero-passport/zuniceratops-christopheri.png',
    ],
    paleo: ['assets/images/paleo/hero-passport/ovatiovermis-cribratus.png'],
    lepidoptera: ['assets/images/lepidoptera/hero-passport/kaniska-canace.png'],
    paleobio: ['assets/images/paleobio/hero-passport/utahnax-vannieri.png'],
    extinct: ['assets/images/extinct/hero-passport/thylacinus-potens.png'],
    chondrichthyes: ['assets/images/chondrichthyes/hero-passport/stethacanthus-altonensis.png'],
    acanthodii: ['assets/images/acanthodii/hero-passport/dinichthys-terrelli.png'],
    mammal: ['assets/images/mammal/hero-passport/odobenocetops-peruvianus.png'],
    seed: ['assets/images/seed/hero-passport/castanospermum-australis.png'],
    fungi: ['assets/images/fungi/hero-passport/craterellus-cornucopioides.png'],
    skeleton: ['assets/images/skeleton/hero-passport/manis-pentadactyla.png'],
  };

  var INSECT_HERO_BASE = 'assets/images/insect/hero-passport/';

  function mcInsectHeroEntry_(opts) {
    var o = opts || {};
    var mcId = o.mcId || 'MC-64101';
    var num = String(mcId).replace(/\D/g, '');
    var progress = o.progress != null ? o.progress : 58;
    return {
      label: '昆蟲',
      mcId: mcId,
      sat: o.sat || (o.satId ? o.satId : 'SAT ID pending'),
      statusPill: 'SPECIMEN PASSPORT',
      taxon: o.taxon || 'INSECTA',
      sci: o.sci,
      common: o.common,
      locality: o.locality,
      date: o.date,
      collector: o.collector,
      visibility: o.visibility || '館藏級示範',
      progress: progress,
      progressNote: o.progressNote || (progress >= 85 ? '已連結 SAT' : '等待 SAT ID'),
      taxonomy: o.taxonomy,
      satId: o.satId || '',
      asset: o.asset || 'MC-ASSET-' + num.slice(-6).padStart(6, '0'),
      license: o.license || 'CC BY-NC 4.0',
      imageRel: INSECT_HERO_BASE + o.slug + '.png',
      imageFallbacks: [],
      photoFit: 'contain',
      exportLine:
        o.exportLine ||
        (progress >= 85 ? 'QR · CSV · JSON — 可追溯匯出' : 'QR · CSV · JSON — 管線待解鎖'),
      catalogLine: o.catalogLine || '典藏編碼 MC-GEO-' + num,
      verifiedFrom: 85,
    };
  }

  /** Entomology hero deck — image slug matches assets/images/insect/hero-passport/{slug}.png */
  var INSECT_SHOWCASE = [
    mcInsectHeroEntry_({
      slug: 'allotopus-moellenkampi-babai',
      sci: 'Allotopus moellenkampi babai',
      common: 'Golden stag beetle',
      taxon: 'ALLOTOPUS',
      mcId: 'MC-64101',
      satId: 'SAT-MC-000601',
      locality: '馬來西亞・霹靂',
      date: '2018/09/12',
      collector: 'MCurator Studio',
      visibility: '館藏級示範',
      progress: 100,
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Allotopus',
      catalogLine: '典藏編碼 MC-GEO-64101',
    }),
    mcInsectHeroEntry_({
      slug: 'ampedus-sp',
      sci: 'Ampedus sp.',
      common: 'Click beetle',
      taxon: 'AMPEDUS',
      mcId: 'MC-64102',
      satId: 'SAT-MC-000602',
      locality: '台灣・南投',
      date: '2021/06/18',
      collector: 'Chen Yu',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Elateridae → Ampedus',
    }),
    mcInsectHeroEntry_({
      slug: 'cheirotonus-jansoni',
      sci: 'Cheirotonus jansoni',
      common: "Janson's long-armed scarab",
      taxon: 'CHEIROTONUS',
      mcId: 'MC-64103',
      satId: 'SAT-MC-000603',
      locality: '泰國・清邁',
      date: '2019/05/22',
      collector: 'Field collection team',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Scarabaeidae → Cheirotonus',
    }),
    mcInsectHeroEntry_({
      slug: 'cyclommatus-metallifer',
      sci: 'Cyclommatus metallifer',
      common: 'Metallic stag beetle',
      taxon: 'CYCLOMMATUS',
      mcId: 'MC-64104',
      satId: 'SAT-MC-000604',
      locality: '印尼・蘇拉威西',
      date: '2020/08/03',
      collector: 'MCurator Studio',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Cyclommatus',
    }),
    mcInsectHeroEntry_({
      slug: 'chiasognathus-grantii',
      sci: 'Chiasognathus grantii',
      common: "Darwin's beetle",
      taxon: 'CHIASOGNATHUS',
      mcId: 'MC-64105',
      satId: 'SAT-MC-000605',
      locality: '智利・南部溫帶林',
      date: '2017/12/11',
      collector: 'Museum digitization',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Chiasognathus',
    }),
    mcInsectHeroEntry_({
      slug: 'hexarthrius-mandibularis',
      sci: 'Hexarthrius mandibularis',
      common: 'Giraffe stag beetle',
      taxon: 'HEXARTHRIUS',
      mcId: 'MC-64106',
      satId: 'SAT-MC-000606',
      locality: '馬來西亞・沙巴',
      date: '2019/03/28',
      collector: 'MCurator Studio',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Hexarthrius',
    }),
    mcInsectHeroEntry_({
      slug: 'dynastes-neptunus',
      sci: 'Dynastes neptunus',
      common: 'Neptune beetle',
      taxon: 'DYNASTES',
      mcId: 'MC-64107',
      satId: 'SAT-MC-000607',
      locality: '厄瓜多・亞馬遜低地',
      date: '2022/01/15',
      collector: 'Research collection',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Scarabaeidae → Dynastes',
    }),
    mcInsectHeroEntry_({
      slug: 'lucanus-cervus',
      sci: 'Lucanus cervus',
      common: 'European stag beetle',
      taxon: 'LUCANUS',
      mcId: 'MC-64108',
      satId: 'SAT-MC-000608',
      locality: '歐洲・溫帶林緣',
      date: '2016/07/09',
      collector: 'Herbarium digitization',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Lucanus',
    }),
    mcInsectHeroEntry_({
      slug: 'mesotopus-tarandus',
      sci: 'Mesotopus tarandus',
      common: 'Mesotopus stag beetle',
      taxon: 'MESOTOPUS',
      mcId: 'MC-64109',
      satId: 'SAT-MC-000609',
      locality: '剛果（金）・中非熱帶林',
      date: '2018/11/20',
      collector: 'MCurator Studio',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Mesotopus',
    }),
    mcInsectHeroEntry_({
      slug: 'odontolabis-dalmanni-intermedia',
      sci: 'Odontolabis dalmanni intermedia',
      common: 'Golden stag beetle',
      taxon: 'ODONTOLABIS',
      mcId: 'MC-64110',
      satId: 'SAT-MC-000610',
      locality: '菲律賓・呂宋',
      date: '2020/04/07',
      collector: 'Field collection team',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Odontolabis',
    }),
    mcInsectHeroEntry_({
      slug: 'odontolabis-lacordairei',
      sci: 'Odontolabis lacordairei',
      common: 'Lacordaire stag beetle',
      taxon: 'ODONTOLABIS',
      mcId: 'MC-64111',
      satId: 'SAT-MC-000611',
      locality: '越南・中部高原',
      date: '2019/09/14',
      collector: 'MCurator Studio',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Odontolabis',
    }),
    mcInsectHeroEntry_({
      slug: 'prosopocoilus-lafertei',
      sci: 'Prosopocoilus lafertei',
      common: "Lafertei's stag beetle",
      taxon: 'PROSOPOCOILUS',
      mcId: 'MC-64112',
      satId: 'SAT-MC-000612',
      locality: '馬來西亞・砂拉越',
      date: '2021/02/26',
      collector: 'Research collection',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Prosopocoilus',
    }),
    mcInsectHeroEntry_({
      slug: 'phalacrognathus-muelleri',
      sci: 'Phalacrognathus muelleri',
      common: 'Rainbow stag beetle',
      taxon: 'PHALACROGNATHUS',
      mcId: 'MC-64113',
      satId: 'SAT-MC-000613',
      locality: '澳洲・昆士蘭',
      date: '2023/05/30',
      collector: 'MCurator Studio',
      progress: 91,
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Phalacrognathus',
    }),
    mcInsectHeroEntry_({
      slug: 'prosopocoilus-kannegieteri',
      sci: 'Prosopocoilus kannegieteri',
      common: "Kannegieter's stag beetle",
      taxon: 'PROSOPOCOILUS',
      mcId: 'MC-64114',
      satId: 'SAT-MC-000614',
      locality: '印尼・蘇門答臘',
      date: '2018/08/18',
      collector: 'Field collection team',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Prosopocoilus',
    }),
    mcInsectHeroEntry_({
      slug: 'sphaenognathus-feisthamelii',
      sci: 'Sphaenognathus feisthamelii',
      common: "Feisthamel's stag beetle",
      taxon: 'SPHAENOGNATHUS',
      mcId: 'MC-64115',
      satId: 'SAT-MC-000615',
      locality: '巴西・亞馬遜',
      date: '2017/10/05',
      collector: 'Museum digitization',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Sphaenognathus',
    }),
    mcInsectHeroEntry_({
      slug: 'kaniska-canace',
      sci: 'Kaniska canace',
      common: 'Blue admiral',
      taxon: 'KANISKA',
      mcId: 'MC-64116',
      satId: 'SAT-MC-000616',
      locality: '台灣・南投',
      date: '2022/08/30',
      collector: 'Lin Mei-hua',
      visibility: '研究資料共享',
      progress: 83,
      taxonomy: 'Animalia → Arthropoda → Insecta → Lepidoptera → Nymphalidae → Kaniska',
    }),
    mcInsectHeroEntry_({
      slug: 'plusiotis-chrysargirea',
      sci: 'Plusiotis chrysargirea',
      common: 'Jewel scarab',
      taxon: 'PLUSIOTIS',
      mcId: 'MC-64124',
      satId: 'SAT-MC-000624',
      locality: '哥斯大黎加・塔拉曼卡',
      date: '2021/04/18',
      collector: 'Rainforest Field Unit',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Scarabaeidae → Plusiotis',
    }),
    mcInsectHeroEntry_({
      slug: 'paraponera-clavata',
      sci: 'Paraponera clavata',
      common: 'Bullet ant',
      taxon: 'PARAPONERA',
      mcId: 'MC-64125',
      satId: 'SAT-MC-000625',
      locality: '秘魯・亞馬遜低地',
      date: '2022/02/27',
      collector: 'Rainforest Field Unit',
      taxonomy: 'Animalia → Arthropoda → Insecta → Hymenoptera → Formicidae → Paraponera',
    }),
    mcInsectHeroEntry_({
      slug: 'ixorida-venerea',
      sci: 'Ixorida venerea',
      common: 'Sulawesi flower chafer',
      taxon: 'IXORIDA',
      mcId: 'MC-64126',
      satId: 'SAT-MC-000626',
      locality: '印尼・蘇拉威西',
      date: '2021/03/26',
      collector: 'Island Biodiversity Archive',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Scarabaeidae → Ixorida',
    }),
    mcInsectHeroEntry_({
      slug: 'dorcus-ternatensis',
      sci: 'Dorcus ternatensis',
      common: 'Ternate stag beetle',
      taxon: 'DORCUS',
      mcId: 'MC-64127',
      satId: 'SAT-MC-000627',
      locality: '印尼・摩鹿加群島',
      date: '2020/11/14',
      collector: 'MCurator Studio',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Dorcus',
    }),
    mcInsectHeroEntry_({
      slug: 'brachysiderus-quadrimaculatus',
      sci: 'Brachysiderus quadrimaculatus',
      common: 'Four-spotted jewel beetle',
      taxon: 'BRACHYSIDERUS',
      mcId: 'MC-64128',
      satId: 'SAT-MC-000628',
      locality: '澳洲・東部雨林',
      date: '2019/08/07',
      collector: 'Research collection',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Buprestidae → Brachysiderus',
    }),
    mcInsectHeroEntry_({
      slug: 'aegus-acuminatus-acuminatus',
      sci: 'Aegus acuminatus acuminatus',
      common: 'Aegus stag beetle',
      taxon: 'AEGUS',
      mcId: 'MC-64129',
      satId: 'SAT-MC-000629',
      locality: '馬來西亞・沙巴',
      date: '2020/07/14',
      collector: 'North Borneo Plate Archive',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Aegus',
    }),
    mcInsectHeroEntry_({
      slug: 'aegus-parallelus',
      sci: 'Aegus parallelus',
      common: 'Parallel stag beetle',
      taxon: 'AEGUS',
      mcId: 'MC-64130',
      satId: 'SAT-MC-000630',
      locality: '印尼・蘇門答臘',
      date: '2019/06/22',
      collector: 'Field collection team',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Lucanidae → Aegus',
    }),
    mcInsectHeroEntry_({
      slug: 'plusiotis-victorina',
      sci: 'Plusiotis victorina',
      common: 'Victorina jewel scarab',
      taxon: 'PLUSIOTIS',
      mcId: 'MC-64131',
      satId: 'SAT-MC-000631',
      locality: '巴拿馬・低地雨林',
      date: '2022/05/08',
      collector: 'Rainforest Field Unit',
      taxonomy: 'Animalia → Arthropoda → Insecta → Coleoptera → Scarabaeidae → Plusiotis',
    }),
  ];

  var insectShowcaseIndex = 0;

  function syncInsectSpecimenFromShowcase_(idx) {
    var entry = INSECT_SHOWCASE[((idx % INSECT_SHOWCASE.length) + INSECT_SHOWCASE.length) % INSECT_SHOWCASE.length];
    if (!entry || !SPECIMENS.insect) return;
    Object.keys(entry).forEach(function (key) {
      SPECIMENS.insect[key] = entry[key];
    });
    SPECIMENS.insect.label = '昆蟲';
    SPECIMENS.insect.imageRel = entry.imageRel;
    SPECIMENS.insect.imageFallbacks =
      entry.imageFallbacks && entry.imageFallbacks.length ? entry.imageFallbacks.slice() : [entry.imageRel];
  }

  function advanceInsectShowcase_() {
    insectShowcaseIndex = (insectShowcaseIndex + 1) % INSECT_SHOWCASE.length;
    syncInsectSpecimenFromShowcase_(insectShowcaseIndex);
  }

  var INSECT_IMAGE_FALLBACKS = INSECT_SHOWCASE.map(function (row) {
    return row.imageRel;
  });

  function buildDisciplineFallbacks_(key, primary) {
    var rels = [primary];
    (HERO_PASSPORT_FALLBACKS[key] || []).forEach(function (rel) {
      if (rel && rels.indexOf(rel) < 0) rels.push(rel);
    });
    return rels;
  }

  var SPECIMENS = {
    insect: Object.assign({}, INSECT_SHOWCASE[0]),
    plant: {
      label: '植物',
      mcId: 'MC-33012',
      sat: 'SAT-MC-000412',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'SOLIDAGO',
      sci: 'Solidago canadensis',
      common: 'Canada goldenrod',
      locality: '北美洲・溫帶草甸',
      date: '2022/04/18',
      collector: 'Herbarium digitization',
      visibility: '研究館藏公開',
      progress: 91,
      progressNote: '已連結 SAT',
      taxonomy: 'Plantae → Angiospermae → Asteraceae → Astereae → Solidago',
      satId: 'SAT-MC-000412',
      asset: 'MC-ASSET-000412',
      license: 'CC BY-SA 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.plant,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.plant.slice(),
      exportLine: 'QR · CSV · JSON - 皆維持解鎖',
      catalogLine: '典藏編碼 MC-GEO-33012',
      verifiedFrom: 85,
    },
    marine: {
      label: '海洋',
      mcId: 'MC-88204',
      sat: 'SAT-MC-000788',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'TACHYPLEUS',
      sci: 'Tachypleus tridentatus',
      common: 'Tri-spine horseshoe crab',
      locality: '台灣・西部沿岸',
      date: '2023/11/08',
      collector: 'Coastal survey team',
      visibility: '研究資料共享',
      progress: 83,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Arthropoda → Merostomata → Limulidae → Tachypleus',
      satId: 'SAT-MC-000788',
      asset: 'MC-ASSET-000788',
      license: 'CC BY 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.marine,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.marine.slice(),
      exportLine: 'QR · CSV · JSON - 皆維持解鎖',
      catalogLine: '典藏編碼 MC-GEO-88204',
      verifiedFrom: 85,
    },
    fossil: {
      label: '化石',
      mcId: 'MC-10550',
      sat: 'SAT-MC-000205',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'TRILOBITA',
      sci: 'Harpides grimmi',
      common: 'Ordovician trilobite',
      locality: '瑞典 · 奧德維斯期',
      date: '地質標本 · 無採集日',
      collector: 'NRM Palaeo archive',
      visibility: '博物館數位館藏',
      progress: 100,
      progressNote: '已驗證匯出',
      taxonomy: 'Animalia → Arthropoda → Trilobita → Harpididae',
      satId: 'SAT-MC-000205',
      asset: 'MC-ASSET-000205',
      license: 'CC0 1.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.fossil,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.fossil.slice(),
      exportLine: 'QR · CSV · JSON - 皆維持解鎖',
      catalogLine: '典藏編碼 MC-GEO-10550',
      verifiedFrom: 85,
    },
    bird: {
      label: '鳥類',
      mcId: 'MC-22018',
      sat: 'SAT-MC-000218',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'COPSYCHUS',
      sci: 'Copsychus saularis',
      common: 'Oriental magpie-robin',
      locality: '台灣・台北',
      date: '2024/03/14',
      collector: 'Bird banding team',
      visibility: '研究資料共享',
      progress: 88,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Chordata → Aves → Passeriformes → Muscicapidae → Copsychus',
      satId: 'SAT-MC-000218',
      asset: 'MC-ASSET-000218',
      license: 'CC BY 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.bird,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.bird.slice(),
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-22018',
      verifiedFrom: 85,
    },
    mineral: {
      label: '礦石',
      mcId: 'MC-51003',
      sat: 'SAT-MC-000503',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'QUARTZ',
      sci: 'Amethyst',
      common: 'Purple quartz crystal',
      locality: '巴西・米納斯吉拉斯',
      date: '2020/09/06',
      collector: 'Mineralogy collection',
      visibility: '館藏級示範',
      progress: 94,
      progressNote: '已連結 SAT',
      taxonomy: 'Mineral → Silicate → Quartz → Amethyst',
      satId: 'SAT-MC-000503',
      asset: 'MC-ASSET-000503',
      license: 'CC BY-NC 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.mineral,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.mineral.slice(),
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-51003',
      verifiedFrom: 85,
    },
    crustacean: {
      label: '甲殼類',
      mcId: 'MC-77041',
      sat: 'SAT-MC-000741',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'PSEUDOCARCINUS',
      sci: 'Pseudocarcinus gigas',
      common: 'Tasmanian giant crab',
      locality: '澳洲・塔斯馬尼亞',
      date: '2023/07/22',
      collector: 'Marine survey team',
      visibility: '研究館藏公開',
      progress: 86,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Arthropoda → Malacostraca → Decapoda → Oziidae → Pseudocarcinus',
      satId: 'SAT-MC-000741',
      asset: 'MC-ASSET-000741',
      license: 'CC BY-SA 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.crustacean,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.crustacean.slice(),
      photoFit: 'contain',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-77041',
      verifiedFrom: 85,
    },
    shell: {
      label: '貝殼',
      mcId: 'MC-66022',
      sat: 'SAT-MC-000622',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'BUCCINUM',
      sci: 'Buccinum undatum',
      common: 'Common whelk',
      locality: '挪威・卑爾根',
      date: '2022/11/03',
      collector: 'Malacology archive',
      visibility: '博物館數位館藏',
      progress: 92,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Mollusca → Gastropoda → Neogastropoda → Buccinidae → Buccinum',
      satId: 'SAT-MC-000622',
      asset: 'MC-ASSET-000622',
      license: 'CC0 1.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.shell,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.shell.slice(),
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-66022',
      verifiedFrom: 85,
    },
    dino: {
      label: '恐龍復原',
      mcId: 'MC-99001',
      sat: 'SAT-MC-000901',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'YUTYRANNUS',
      sci: 'Yutyrannus huali',
      common: 'Feathered tyrannosaur',
      locality: '中國・遼寧',
      date: '白堊紀早期 · 地質復原',
      collector: 'Paleo reconstruction studio',
      visibility: '學術復原示範',
      progress: 100,
      progressNote: '已驗證匯出',
      taxonomy: 'Animalia → Chordata → Dinosauria → Tyrannosauroidea → Yutyrannus',
      satId: 'SAT-MC-000901',
      asset: 'MC-ASSET-000901',
      license: 'CC BY-NC 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.dino,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.dino.slice(),
      photoFit: 'cover',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-99001',
      verifiedFrom: 85,
    },
    paleo: {
      label: '學術復原',
      mcId: 'MC-99002',
      sat: 'SAT-MC-000902',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'OVATIOVERMIS',
      sci: 'Ovatiovermis cribratus',
      common: 'Cambrian lobopodian',
      locality: '加拿大・伯吉斯頁岩',
      date: '寒武紀 · 化石復原',
      collector: 'Paleo illustration lab',
      visibility: '研究資料共享',
      progress: 95,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Lobopodia → Ovatiovermis',
      satId: 'SAT-MC-000902',
      asset: 'MC-ASSET-000902',
      license: 'CC BY 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.paleo,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.paleo.slice(),
      photoFit: 'cover',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-99002',
      verifiedFrom: 85,
    },
    lepidoptera: {
      label: '鱗翅目',
      mcId: 'MC-64201',
      sat: 'SAT-MC-000616',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'KANISKA',
      sci: 'Kaniska canace',
      common: 'Blue admiral',
      locality: '台灣・南投',
      date: '2022/08/30',
      collector: 'Lin Mei-hua',
      visibility: '研究資料共享',
      progress: 83,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Arthropoda → Insecta → Lepidoptera → Nymphalidae → Kaniska',
      satId: 'SAT-MC-000616',
      asset: 'MC-ASSET-000616',
      license: 'CC BY 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.lepidoptera,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.lepidoptera.slice(),
      photoFit: 'contain',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-64201',
      verifiedFrom: 85,
    },
    paleobio: {
      label: '古生物',
      mcId: 'MC-99101',
      sat: 'SAT-MC-000911',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'UTAHNAX',
      sci: 'Utahnax vannieri',
      common: 'Anomalocarid predator',
      locality: '美國・猶他州',
      date: '寒武紀 · 化石復原',
      collector: 'Paleo reconstruction studio',
      visibility: '學術復原示範',
      progress: 97,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Radiodonta → Anomalocarididae → Utahnax',
      satId: 'SAT-MC-000911',
      asset: 'MC-ASSET-000911',
      license: 'CC BY-NC 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.paleobio,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.paleobio.slice(),
      photoFit: 'cover',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-99101',
      verifiedFrom: 85,
    },
    extinct: {
      label: '絕種生物',
      mcId: 'MC-99102',
      sat: 'SAT-MC-000912',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'THYLACINUS',
      sci: 'Thylacinus potens',
      common: 'Tasmanian tiger',
      locality: '澳洲・塔斯馬尼亞',
      date: '1936 · 最後紀錄',
      collector: 'Museum archive',
      visibility: '館藏級示範',
      progress: 100,
      progressNote: '已驗證匯出',
      taxonomy: 'Animalia → Chordata → Mammalia → Dasyuromorphia → Thylacinidae',
      satId: 'SAT-MC-000912',
      asset: 'MC-ASSET-000912',
      license: 'CC0 1.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.extinct,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.extinct.slice(),
      photoFit: 'cover',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-99102',
      verifiedFrom: 85,
    },
    chondrichthyes: {
      label: '軟骨魚',
      mcId: 'MC-99103',
      sat: 'SAT-MC-000913',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'STETHACANTHUS',
      sci: 'Stethacanthus altonensis',
      common: 'Ironing-board shark',
      locality: '美國・密蘇里',
      date: '石炭紀 · 化石復原',
      collector: 'Paleo illustration lab',
      visibility: '研究資料共享',
      progress: 94,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Chondrichthyes → Stethacanthidae → Stethacanthus',
      satId: 'SAT-MC-000913',
      asset: 'MC-ASSET-000913',
      license: 'CC BY 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.chondrichthyes,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.chondrichthyes.slice(),
      photoFit: 'cover',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-99103',
      verifiedFrom: 85,
    },
    acanthodii: {
      label: '棘魚綱',
      mcId: 'MC-99104',
      sat: 'SAT-MC-000914',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'DINICHTHYS',
      sci: 'Dinichthys terrelli',
      common: 'Devonian armored fish',
      locality: '美國・俄亥俄',
      date: '泥盆紀晚期 · 化石復原',
      collector: 'Paleo reconstruction studio',
      visibility: '學術復原示範',
      progress: 96,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Chordata → Placodermi → Arthrodira → Dinichthys',
      satId: 'SAT-MC-000914',
      asset: 'MC-ASSET-000914',
      license: 'CC BY-NC 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.acanthodii,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.acanthodii.slice(),
      photoFit: 'cover',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-99104',
      verifiedFrom: 85,
    },
    mammal: {
      label: '哺乳類',
      mcId: 'MC-99105',
      sat: 'SAT-MC-000915',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'ODOBENOCETOPS',
      sci: 'Odobenocetops peruvianus',
      common: 'Prehistoric walrus whale',
      locality: '秘魯・皮斯科盆地',
      date: '中新世 · 古環境復原',
      collector: 'Paleo illustration lab',
      visibility: '研究資料共享',
      progress: 93,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Chordata → Mammalia → Cetacea → Odobenocetops',
      satId: 'SAT-MC-000915',
      asset: 'MC-ASSET-000915',
      license: 'CC BY 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.mammal,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.mammal.slice(),
      photoFit: 'cover',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-99105',
      verifiedFrom: 85,
    },
    seed: {
      label: '種子',
      mcId: 'MC-64301',
      sat: 'SAT-MC-000617',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'CASTANOSPERMUM',
      sci: 'Castanospermum australe',
      common: 'Moreton Bay chestnut seed',
      locality: '澳洲・昆士蘭',
      date: '2023/03/14',
      collector: 'Seed bank digitization',
      visibility: '研究館藏公開',
      progress: 88,
      progressNote: '已連結 SAT',
      taxonomy: 'Plantae → Angiospermae → Fabaceae → Castanospermum',
      satId: 'SAT-MC-000617',
      asset: 'MC-ASSET-000617',
      license: 'CC BY-SA 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.seed,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.seed.slice(),
      photoFit: 'contain',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-64301',
      verifiedFrom: 85,
    },
    fungi: {
      label: '菌菇',
      mcId: 'MC-64401',
      sat: 'SAT-MC-000618',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'CRATERELLUS',
      sci: 'Craterellus cornucopioides',
      common: 'Black trumpet',
      locality: '法國・阿韋龍',
      date: '2023/10/06',
      collector: 'Mycology digitization lab',
      visibility: '研究館藏公開',
      progress: 86,
      progressNote: '已連結 SAT',
      taxonomy: 'Fungi → Basidiomycota → Agaricomycetes → Cantharellales → Craterellaceae',
      satId: 'SAT-MC-000618',
      asset: 'MC-ASSET-000618',
      license: 'CC BY-SA 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.fungi,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.fungi.slice(),
      photoFit: 'contain',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-64401',
      verifiedFrom: 85,
    },
    skeleton: {
      label: '骨骼標本',
      mcId: 'MC-64402',
      sat: 'SAT-MC-000619',
      statusPill: 'SPECIMEN PASSPORT',
      taxon: 'MANIS',
      sci: 'Manis pentadactyla',
      common: 'Chinese pangolin skeleton',
      locality: '台灣・台北',
      date: '2019/04/22',
      collector: 'Vertebrate collections',
      visibility: '館藏級示範',
      progress: 91,
      progressNote: '已連結 SAT',
      taxonomy: 'Animalia → Chordata → Mammalia → Pholidota → Manidae → Manis',
      satId: 'SAT-MC-000619',
      asset: 'MC-ASSET-000619',
      license: 'CC BY-NC 4.0',
      imageRel: HERO_PASSPORT_DEMO_RELS.skeleton,
      imageFallbacks: HERO_PASSPORT_FALLBACKS.skeleton.slice(),
      photoFit: 'contain',
      exportLine: 'QR · CSV · JSON — 可追溯匯出',
      catalogLine: '典藏編碼 MC-GEO-64402',
      verifiedFrom: 85,
    },
  };

  var HERO_ASSET_TYPE_FILTERS = {
    insect: function (rel) {
      return (
        /assets\/images\/insect\/hero-passport\//i.test(rel) ||
        /assets\/images\/Specimen\//i.test(rel) ||
        /insect-specimens_|dorcus-nepalensis|papilio-blumei|butterfly-ypthima|moth-family-limacodidae/i.test(rel)
      );
    },
    plant: function (rel) {
      return /assets\/images\/(plant\/hero-passport|herbarium)\//i.test(rel);
    },
    marine: function (rel) {
      return /assets\/images\/(marine\/hero-passport|marine)\//i.test(rel);
    },
    fossil: function (rel) {
      return /assets\/images\/(fossil\/hero-passport|fossil)\//i.test(rel);
    },
  };

  var HERO_ASSET_EXCLUDE = /(chameleon|plestiodon|rudis|spb-ui|menagerie-hero|reference-2026|hero-sat-passport-back|landing\s*page-1|mcwhe-passport|picturepiz)/i;

  function mcHeroCollectAssetRels_() {
    var acc = [];
    var i;
    if (typeof window.mcGetSpecimenCardRels_ === 'function') {
      acc = acc.concat(window.mcGetSpecimenCardRels_());
    } else {
      if (window.MC_LOCAL_DEMO_RELPATHS && window.MC_LOCAL_DEMO_RELPATHS.length) {
        for (i = 0; i < window.MC_LOCAL_DEMO_RELPATHS.length; i++) {
          acc.push(window.MC_LOCAL_DEMO_RELPATHS[i]);
        }
      }
      if (window.MC_LANDING_PAGE_IMAGE_RELS && window.MC_LANDING_PAGE_IMAGE_RELS.length) {
        for (i = 0; i < window.MC_LANDING_PAGE_IMAGE_RELS.length; i++) {
          acc.push(window.MC_LANDING_PAGE_IMAGE_RELS[i]);
        }
      }
    }
    var seen = Object.create(null);
    var out = [];
    for (i = 0; i < acc.length; i++) {
      var r = String(acc[i] || '')
        .trim()
        .replace(/\\/g, '/');
      if (!r || seen[r] || HERO_ASSET_EXCLUDE.test(r)) continue;
      if (!/\.(jpe?g|png|webp)$/i.test(r)) continue;
      seen[r] = 1;
      out.push(r);
    }
    return out;
  }

  function pickHeroSpecimenRel(type, seed) {
    var pred = HERO_ASSET_TYPE_FILTERS[type];
    if (!pred) return '';
    var rels = mcHeroCollectAssetRels_();
    var hits = [];
    var i;
    for (i = 0; i < rels.length; i++) {
      if (pred(rels[i])) hits.push(rels[i]);
    }
    if (!hits.length) return '';
    var hash =
      typeof window.mcStringHash32_ === 'function' ? window.mcStringHash32_(String(seed || type)) : 0;
    return hits[hash % hits.length];
  }

  function wireHeroSpecimenAssets() {
    ORDER.forEach(function (key) {
      var data = SPECIMENS[key];
      if (!data) return;

      if (key === 'insect') {
        syncInsectSpecimenFromShowcase_(insectShowcaseIndex);
        return;
      }

      var primary = data.imageRel || HERO_PASSPORT_DEMO_RELS[key];
      if (!primary) return;
      data.imageRel = primary;
      data.imageFallbacks = buildDisciplineFallbacks_(key, primary);
    });
  }

  function applyPhotoFrame_(wrap, data) {
    if (!wrap) return;
    var fill = data && data.photoFit === 'cover';
    wrap.classList.toggle('mc-passport-card__photo--fill', fill);
    wrap.classList.toggle('mc-passport-card__photo--catalog', !fill);
  }

  function resolveHeroAsset(rel) {
    var path = String(rel || '').replace(/^\//, '');
    if (!path) return '';
    if (typeof window.resolveAssetImage === 'function') {
      return window.resolveAssetImage(path, 'specimen');
    }
    if (typeof window.mcResolveLocalRelToPage_ === 'function') {
      return window.mcResolveLocalRelToPage_(path);
    }
    return '../' + path;
  }

  function cleanupPhotoCrossLayers_(wrap) {
    if (!wrap) return;
    qsa('img.mc-passport-card__photo-cross', wrap).forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    wrap.classList.remove('is-photo-crossfading');
  }

  function preloadSpecimenPhotoUrl_(data, done) {
    var rels = [data.imageRel].concat(data.imageFallbacks || []).filter(Boolean);
    var i = 0;
    function next() {
      if (i >= rels.length) {
        if (typeof window.mcGetFallbackSpecimenImageUrl_ === 'function') {
          done(window.mcGetFallbackSpecimenImageUrl_(data.mcId || data.sci || 'hero') || '');
        } else {
          done('');
        }
        return;
      }
      var url = resolveHeroAsset(rels[i]);
      i += 1;
      if (!url) {
        next();
        return;
      }
      var probe = new Image();
      probe.onload = function () {
        done(url);
      };
      probe.onerror = function () {
        next();
      };
      probe.src = url;
    }
    next();
  }

  function commitSpecimenPhotoUrl_(img, data, url) {
    if (!img || !data) return;
    var wrap = img.closest ? img.closest('.mc-passport-card__photo') : null;
    cleanupPhotoCrossLayers_(wrap);
    applyPhotoFrame_(wrap, data);
    img.alt = data.sci || img.alt || '';
    if (url) {
      img.src = url;
      img.classList.add('is-photo-loaded');
      if (wrap) {
        wrap.classList.add('has-photo');
        applyPhotoFrame_(wrap, data);
      }
    } else {
      img.removeAttribute('src');
      img.classList.remove('is-photo-loaded');
      if (wrap) {
        wrap.classList.remove('has-photo');
        applyPhotoFrame_(wrap, data);
      }
    }
  }

  function setSpecimenPhoto(img, data, opts) {
    if (!img || !data) return;
    opts = opts || {};
    var wrap = img.closest ? img.closest('.mc-passport-card__photo') : null;
    var reduced = isReducedMotion();
    var hold = !!opts.holdUntilReady && !reduced;
    var onReady = typeof opts.onReady === 'function' ? opts.onReady : null;
    var gen = (img.__mcPhotoGen = (img.__mcPhotoGen || 0) + 1);

    cleanupPhotoCrossLayers_(wrap);

    if (hold) {
      preloadSpecimenPhotoUrl_(data, function (url) {
        if (gen !== img.__mcPhotoGen) return;
        commitSpecimenPhotoUrl_(img, data, url);
        if (onReady) onReady();
      });
      return;
    }

    applyPhotoFrame_(wrap, data);

    var rels = [data.imageRel].concat(data.imageFallbacks || []).filter(Boolean);
    var idx = 0;

    function applyLoaded() {
      img.classList.add('is-photo-loaded');
      var loadedWrap = img.closest ? img.closest('.mc-passport-card__photo') : null;
      if (loadedWrap) {
        loadedWrap.classList.add('has-photo');
        applyPhotoFrame_(loadedWrap, data);
      }
      if (onReady) onReady();
    }

    function clearPhotoWrap() {
      img.classList.remove('is-photo-loaded');
      var emptyWrap = img.closest ? img.closest('.mc-passport-card__photo') : null;
      if (emptyWrap) {
        emptyWrap.classList.remove('has-photo');
        applyPhotoFrame_(emptyWrap, data);
      }
      if (onReady) onReady();
    }

    function commitSrc_(url) {
      if (gen !== img.__mcPhotoGen) return;
      img.alt = data.sci || img.alt || '';
      img.src = url;
      applyLoaded();
    }

    function tryNext() {
      if (idx >= rels.length) {
        if (typeof window.mcGetFallbackSpecimenImageUrl_ === 'function') {
          commitSrc_(window.mcGetFallbackSpecimenImageUrl_(data.mcId || data.sci || 'hero'));
          return;
        }
        clearPhotoWrap();
        return;
      }
      var url = resolveHeroAsset(rels[idx]);
      idx += 1;
      if (!url) {
        tryNext();
        return;
      }
      /* Single-buffer swap: never twin-layer during specimen switches (cross caused mash). */
      var probe = new Image();
      probe.onload = function () {
        commitSrc_(url);
      };
      probe.onerror = function () {
        tryNext();
      };
      probe.src = url;
    }

    tryNext();
  }

  function formatMcId(id) {
    var num = String(id || '').replace(/\D/g, '');
    if (!num) return 'MC - 000000';
    return 'MC - ' + num.slice(-6).padStart(6, '0');
  }

  function formatSatLine(data) {
    if (data.sat && /pending/i.test(data.sat)) return L('SAT ID 待產生', 'SAT ID pending');
    if (data.satId) return data.satId;
    return L('SAT ID 待產生', 'SAT ID pending');
  }

  function isCardVerified_(data) {
    return data.progress >= (data.verifiedFrom || 85);
  }

  function formatReviewLabel_(data) {
    return isCardVerified_(data) ? L('已審核', 'Reviewed') : L('未審核', 'Draft');
  }

  function formatReviewMini_(data) {
    return isCardVerified_(data) ? L('已審', 'OK') : L('未審', '—');
  }

  function formatPublicLabel_(data) {
    return localizeVisibility(data.publicLabel || data.visibility);
  }

  function formatCatalogRegLine_(data) {
    if (data.catalogLine && /NHM\s*•/i.test(data.catalogLine)) return data.catalogLine;
    var num = String(data.mcId || '').replace(/\D/g, '').slice(-6).padStart(6, '0');
    if (data.catalogLine && !isZh() && !isJa()) {
      var raw = String(data.catalogLine);
      if (/[\u4e00-\u9fff]/.test(raw) || /典藏編碼/.test(raw)) {
        return 'Catalog ref MC-GEO-' + num;
      }
    }
    return 'NHM • MC • REG-' + num + ' • β';
  }

  function formatExportLine_(data) {
    var line = data.exportLine;
    if (line) {
      var raw = String(line);
      if (isJa() && EXPORT_LINE_JA[raw]) return EXPORT_LINE_JA[raw];
      if (isDe() && EXPORT_LINE_DE[raw]) return EXPORT_LINE_DE[raw];
      if (!isZh() && !isJa() && !isDe() && EXPORT_LINE_EN[raw]) return EXPORT_LINE_EN[raw];
      var s = raw
        .replace(/[·•]/g, '•')
        .replace(/\s*-\s*/g, ' — ')
        .replace(/—+/g, ' — ')
        .trim();
      if (!isZh() && !isJa() && !isDe()) {
        s = s
          .replace(/\u7686\u7dad\u6301\u89e3\u9396/g, 'all unlocked')
          .replace(/\u53ef\u8ffd\u6eaf\u532f\u51fa/g, 'traceable export')
          .replace(/\u5f85\u532f\u51fa/g, 'export pending');
      }
      if (isDe()) {
        s = s
          .replace(/\u7686\u7dad\u6301\u89e3\u9396/g, 'alles freigeschaltet')
          .replace(/\u53ef\u8ffd\u6eaf\u532f\u51fa/g, 'nachverfolgbarer Export')
          .replace(/\u5f85\u532f\u51fa/g, 'Export ausstehend');
      }
      return s;
    }
    return isCardVerified_(data)
      ? L('QR • CSV • JSON — 可追溯匯出', 'QR • CSV • JSON — traceable export', 'QR • CSV • JSON — 追跡可能なエクスポート')
      : L('QR • CSV • JSON — 待匯出', 'QR • CSV • JSON — export pending', 'QR • CSV • JSON — エクスポート待ち');
  }

  function buildPassportCardFrontBodyHTML() {
    return (
      '<div class="mc-passport-card__body">' +
      '<header class="mc-passport-card__head">' +
      '<span class="mc-passport-card__review">' + L('未審核', 'Not reviewed') + '</span>' +
      '<div class="mc-passport-card__headActions">' +
      '<span class="mc-passport-card__reviewMini">' + L('未審', '—') + '</span>' +
      '<span class="mc-passport-card__netBadge" aria-hidden="true">N</span>' +
      '</div></header>' +
      '<div class="mc-passport-card__ids">' +
      '<p class="mc-passport-card__mcId">MC - 000000</p>' +
      '<p class="mc-passport-card__sat">' + L('SAT ID 待產生', 'SAT ID pending') + '</p>' +
      '</div>' +
      '<figure class="mc-passport-card__photo mc-passport-card__photo--catalog"><img src="" alt="" width="600" height="420" loading="lazy" decoding="async" /></figure>' +
      '<div class="mc-passport-card__nameplate">' +
      '<span class="mc-passport-card__taxon">TAXON</span>' +
      '<h2 class="mc-passport-card__sci">' + L('學名', 'Scientific name') + '</h2>' +
      '<p class="mc-passport-card__common">' + L('俗名', 'Common name') + '</p>' +
      '</div>' +
      '<dl class="mc-passport-card__meta">' +
      '<div><dt>' + L('產地', 'Locality') + '</dt><dd>\u2014</dd></div>' +
      '<div><dt>' + L('日期', 'Date') + '</dt><dd>\u2014</dd></div>' +
      '<div><dt>' + L('採集者', 'Collector') + '</dt><dd>\u2014</dd></div>' +
      '<div><dt>' + L('是否公開', 'Visibility') + '</dt><dd>' + L('未設定', 'Not set') + '</dd></div>' +
      '</dl>' +
      '<footer class="mc-passport-card__footer">' +
      '<div class="mc-passport-card__progress">' +
      '<span class="mc-passport-card__progressPct">' + L('完成度 ', 'Completeness ') + '<strong>0%</strong></span>' +
      '<em class="mc-passport-card__progressNote">' + L('未審核', 'Not reviewed') + '</em>' +
      '<div class="mc-passport-card__bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><span></span></div>' +
      '</div>' +
      '<p class="mc-passport-card__exportLine">' + L('QR \u2022 CSV \u2022 JSON \u2014 \u5f85\u532f\u51fa', 'QR \u2022 CSV \u2022 JSON \u2014 export pending') + '</p>' +
      '<p class="mc-passport-card__catalog">NHM \u2022 MC \u2022 REG-000000 \u2022 \u03b2</p>' +
      '</footer></div>'
    );
  }

  var ORDER = [
    'insect',
    'plant',
    'marine',
    'fossil',
    'bird',
    'mineral',
    'crustacean',
    'shell',
    'dino',
    'paleo',
    'lepidoptera',
    'paleobio',
    'extinct',
    'chondrichthyes',
    'acanthodii',
    'mammal',
    'seed',
    'fungi',
    'skeleton',
  ];

  var DECK_SLOTS = [
    { side: 'left', depth: 2, key: 'mineral' },
    { side: 'left', depth: 1, key: 'bird' },
    { side: 'right', depth: 1, key: 'shell' },
    { side: 'right', depth: 2, key: 'crustacean' },
  ];

  function buildDeckCardInnerHTML() {
    return (
      '<div class="mc-passport-card__face mc-passport-card__face--front">' +
      buildPassportCardFrontBodyHTML() +
      '</div>'
    );
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function isReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setText(root, selector, text) {
    var el = qs(selector, root);
    if (el) el.textContent = text;
    return el;
  }

  function updateCardChromeLabels_(hero) {
    var metaLabels = [
      L('產地', 'Locality'),
      L('日期', 'Date'),
      L('採集者', 'Collector'),
      L('是否公開', 'Visibility'),
    ];
    qsa('.mc-passport-card__meta dt', hero).forEach(function (dt, i) {
      if (metaLabels[i]) dt.textContent = metaLabels[i];
    });

    qsa('.mc-passport-card__progressPct', hero).forEach(function (el) {
      var strong = qs('strong', el);
      var pct = strong ? strong.textContent : '0%';
      el.innerHTML = L('完成度 ', 'Completeness ') + '<strong>' + pct + '</strong>';
    });

    var placeholderSci = L('學名', 'Scientific name');
    var placeholderCommon = L('俗名', 'Common name');
    qsa('.mc-passport-card__sci', hero).forEach(function (el) {
      if (el.textContent === '學名' || el.textContent === 'Scientific name') {
        el.textContent = placeholderSci;
      }
    });
    qsa('.mc-passport-card__common', hero).forEach(function (el) {
      if (el.textContent === '俗名' || el.textContent === 'Common name') {
        el.textContent = placeholderCommon;
      }
    });

    var card = qs('#mcHeroPassportCard', hero);
    if (card) {
      card.setAttribute(
        'aria-label',
        L(
          '標本護照卡 — 點擊翻面，方向鍵切換範例',
          'Specimen passport card — click to flip, arrow keys to change example'
        )
      );
      setText(card, '.mc-passport-card__backTitle', L('標本護照', 'Specimen passport'));
      setText(
        card,
        '.mc-passport-card__backSub',
        L('標本護照卡 · 背面', 'SPECIMEN PASSPORT CARD · back')
      );
      setText(
        card,
        '.mc-passport-card__backFoot',
        L('已驗證可機構匯出（示範）', 'Verified for institutional export (demo)')
      );
    }

    var backSpans = [
      'SAT ID',
      L('資產編號', 'Asset ID'),
      L('館號', 'Catalog ID'),
      L('學名', 'Scientific name'),
      L('俗名', 'Common name'),
      L('分類階層', 'Taxonomy'),
      L('產地', 'Locality'),
      L('授權', 'License'),
      L('審查', 'Review'),
      L('匯出狀態', 'Export status'),
    ];
    qsa('#mcHeroPassportCard .mc-passport-card__backList li span', hero).forEach(function (sp, i) {
      if (backSpans[i]) sp.textContent = backSpans[i];
    });

    qsa('.mc-hero-v2__hotspot--photo b', hero).forEach(function (el) {
      el.textContent = L('照片', 'PHOTO');
    });
    qsa('.mc-hero-v2__hotspot--label b', hero).forEach(function (el) {
      el.textContent = L('標籤', 'LABEL');
    });
    qsa('.mc-hero-v2__hotspot--locality b', hero).forEach(function (el) {
      el.textContent = L('產地', 'LOCALITY');
    });

    qsa('.mc-passport-card--deck-back', hero).forEach(function (card) {
      setText(card, '.mc-passport-card__review', L('未審核', 'Not reviewed'));
      setText(card, '.mc-passport-card__reviewMini', L('未審', '—'));
      setText(card, '.mc-passport-card__progressNote', L('未審核', 'Not reviewed'));
      setText(
        card,
        '.mc-passport-card__exportLine',
        L('QR \u2022 CSV \u2022 JSON \u2014 \u5f85\u532f\u51fa', 'QR \u2022 CSV \u2022 JSON \u2014 export pending')
      );
      var visDd = qs('.mc-passport-card__meta [data-meta="visibility"] dd', card) ||
        qs('.mc-passport-card__meta div:nth-child(4) dd', card);
      if (visDd && (visDd.textContent === '未設定' || visDd.textContent === 'Not set')) {
        visDd.textContent = L('未設定', 'Not set');
      }
    });
  }

  function applyHeroStaticCopy(hero) {
    setText(
      hero,
      '#welcomeHeroBadge',
      t('lp_clean_hero_badge', '標本護照平台', 'SPECIMEN PASSPORT PLATFORM')
    );

    var title = qs('#welcomeContentTitle', hero);
    if (title) {
      title.innerHTML =
        '<span>' +
        t('lp_hero_v2_h1_line1', '把照片、標籤與產地，', 'Turn photos, labels, and locality') +
        '</span><br><em>' +
        t('lp_hero_v2_h1_line2', '整理成可查詢的標本護照。', 'into searchable specimen passports.') +
        '</em>';
    }

    setText(
      hero,
      '#welcomeContentLead',
      t(
        'lp_hero_v2_subcopy',
        '19 類標本示範，把影像與欄位整理成可查詢、可追溯的數位護照。',
        '19 specimen demos — images and fields organized into searchable, traceable digital passports.'
      )
    );
    setText(
      hero,
      '#btnWelcomeHeroDemo',
      t('lp_hero_v2_cta_primary', '開始建立標本護照', 'Start a specimen passport')
    );
    setText(hero, '#btnWelcomeHeroStart', t('lp_hero_v2_cta_secondary', '查看範例', 'View examples'));
    setText(hero, '.mc-hero-v2__hotspot--photo span', t('lp_hero_v2_chip_photo', '影像匯入', 'Image import'));
    setText(hero, '.mc-hero-v2__hotspot--label span', t('lp_hero_v2_chip_label', '標籤解析', 'Label parsing'));
    setText(
      hero,
      '.mc-hero-v2__hotspot--locality span',
      t('lp_hero_v2_chip_locality', '產地定位', 'Locality georeference')
    );

    var usp = qs('#mcProductHeroGuide', hero);
    if (usp) {
      if (isZh()) {
        usp.innerHTML =
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">01</span><div><strong>跨類群，欄位一致</strong><span>19 類示範，同一套護照格式。</span></div></li>' +
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">02</span><div><strong>全球標準，互通無礙</strong><span>多語欄位，可引用、可匯出。</span></div></li>' +
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">03</span><div><strong>一份護照，持續進化</strong><span>從採集到審查，脈絡完整保留。</span></div></li>';
      } else if (isJa()) {
        usp.innerHTML =
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">01</span><div><strong>分類群横断、フィールド統一</strong><span>19 種のデモ、同一パスポート形式。</span></div></li>' +
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">02</span><div><strong>グローバル標準、シームレス連携</strong><span>多言語フィールド — 引用・エクスポート対応。</span></div></li>' +
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">03</span><div><strong>1 枚のパスポート、継続的に進化</strong><span>採集から審査まで — 文脈を完全に保持。</span></div></li>';
      } else {
        usp.innerHTML =
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">01</span><div><strong>Cross-taxa, one schema</strong><span>19 demos, one passport format.</span></div></li>' +
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">02</span><div><strong>Global standards</strong><span>Multilingual fields — citable and exportable.</span></div></li>' +
          '<li><span class="mc-hero-v2__uspIcon" aria-hidden="true">03</span><div><strong>One passport, evolving</strong><span>From collection to review — full context preserved.</span></div></li>';
      }
    }

    var nav = qs('#mcHeroSpecimenNav', hero);
    if (nav) {
      nav.setAttribute(
        'aria-label',
        L('標本類型示範（19 類）', 'Specimen type demos (19 categories)', '標本タイプデモ（19 分類）')
      );
      qsa('[data-mc-specimen]', nav).forEach(function (btn) {
        var key = btn.getAttribute('data-mc-specimen');
        if (key) btn.textContent = specimenLabel(key);
      });
    }

    updateCardChromeLabels_(hero);
  }

  function refreshHeroI18n() {
    var hero = heroRoot || qs(ROOT);
    if (!hero) return;
    applyHeroStaticCopy(hero);
    updateCardChromeLabels_(hero);
    qsa('.mc-passport-card--deck-back', hero).forEach(function (backCard) {
      var backKey = backCard.getAttribute('data-mc-specimen');
      if (backKey) {
        backCard.setAttribute(
          'aria-label',
          specimenLabel(backKey) +
            L(' 標本護照範例 — ', ' specimen passport demo — ') +
            (SPECIMENS[backKey] ? SPECIMENS[backKey].sci : '')
        );
      }
    });
    if (heroSpecimenCtrl && typeof heroSpecimenCtrl.getCurrent === 'function') {
      applySpecimen(hero, heroSpecimenCtrl.getCurrent(), false);
    }
  }

  function setCardSide(card, side) {
    var back = side === 'back';
    card.classList.toggle('is-flipped', back);
    card.setAttribute('data-side', back ? 'back' : 'front');
    card.setAttribute('aria-pressed', back ? 'true' : 'false');
  }

  function applySpecimenToCard(card, key, animate, photoOpts) {
    var data = SPECIMENS[key];
    if (!data || !card) return;

    card.setAttribute('data-specimen', key);

    if (animate && !isReducedMotion()) {
      card.classList.add('is-switching');
      window.setTimeout(function () {
        card.classList.remove('is-switching');
      }, 640);
    }

    setText(card, '.mc-passport-card__review', formatReviewLabel_(data));
    setText(card, '.mc-passport-card__reviewMini', formatReviewMini_(data));

    setText(card, '.mc-passport-card__mcId', formatMcId(data.mcId));

    var satEl = qs('.mc-passport-card__sat', card);
    if (satEl) {
      satEl.textContent = formatSatLine(data);
      satEl.classList.toggle('is-ready', !/pending/i.test(satEl.textContent));
    }

    var taxonEl = qs('.mc-passport-card__taxon', card);
    if (taxonEl) {
      taxonEl.textContent = data.taxon;
      taxonEl.classList.toggle('is-pending', /pending/i.test(data.taxon));
    }

    setText(card, '.mc-passport-card__sci', data.sci);
    setText(card, '.mc-passport-card__common', data.common);

    var meta = qsa('.mc-passport-card__meta div', card);
    var metaVals = [
      translateLocality(data.locality || '\u2014'),
      localizeDate(data.date || '\u2014'),
      data.collector || '\u2014',
      formatPublicLabel_(data),
    ];
    meta.forEach(function (row, i) {
      var dd = qs('dd', row);
      if (dd) dd.textContent = metaVals[i];
    });

    var progStrong = qs('.mc-passport-card__progressPct strong', card);
    if (progStrong) progStrong.textContent = data.progress + '%';
    setText(card, '.mc-passport-card__progressNote', formatReviewLabel_(data));
    setText(card, '.mc-passport-card__exportLine', formatExportLine_(data));
    setText(card, '.mc-passport-card__catalog', formatCatalogRegLine_(data));

    var bar = qs('.mc-passport-card__bar', card);
    var barFill = bar && qs('span', bar);
    if (bar) {
      bar.setAttribute('aria-valuenow', String(data.progress));
      if (barFill) barFill.style.width = data.progress + '%';
    }

    card.classList.toggle('is-verified', isCardVerified_(data));

    var photo = qs('.mc-passport-card__photo', card);
    if (photo && !(photoOpts && (photoOpts.deferPhotoFrame || photoOpts.skipPhoto))) {
      applyPhotoFrame_(photo, data);
    }

    if (photoOpts && photoOpts.skipPhoto) return;

    var img = qs('.mc-passport-card__photo img:not(.mc-passport-card__photo-cross)', card);
    if (!img) img = qs('.mc-passport-card__photo img', card);
    if (img) {
      img.alt = data.sci;
      setSpecimenPhoto(img, data, photoOpts || null);
    }
  }

  var leadHandoffGen_ = 0;
  var LEAD_REST_TRANSFORM_ =
    'translate(-50%, -50%) translate3d(0, -12px, 56px) rotateX(-3deg) rotateY(-5deg) scale(1)';

  function clearLeadHandoffArtifacts_(deck, lead) {
    if (deck) {
      qsa('.mc-passport-card--handoff-ghost', deck).forEach(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });
      deck.classList.remove('is-deck-handoff', 'is-deck-crossfade', 'is-deck-cutting', 'is-deck-swapping');
      deck.removeAttribute('data-handoff-dir');
      if (deck.__mcHandoffTimer) {
        window.clearTimeout(deck.__mcHandoffTimer);
        deck.__mcHandoffTimer = 0;
      }
      if (deck.__mcHandoffResumeTimer) {
        window.clearTimeout(deck.__mcHandoffResumeTimer);
        deck.__mcHandoffResumeTimer = 0;
      }
    }
    if (lead) {
      lead.classList.remove(
        'is-handoff-settle',
        'is-handoff-in-left',
        'is-handoff-in-right',
        'is-handoff-out-left',
        'is-handoff-out-right',
        'is-handoff-fade',
        'is-specimen-swap',
        'is-specimen-swap-out',
        'is-specimen-swap-in'
      );
      lead.style.animationPlayState = '';
    }
  }

  function finishLeadSwap_(deck, lead, gen) {
    if (gen !== leadHandoffGen_) return;
    if (deck && deck.__mcHandoffTimer) {
      window.clearTimeout(deck.__mcHandoffTimer);
      deck.__mcHandoffTimer = 0;
    }
    if (lead) {
      lead.classList.remove('is-specimen-swap', 'is-specimen-swap-out', 'is-specimen-swap-in');
      /* Resume idle float from the paused pose — do not snap to rest transform. */
      lead.style.animationPlayState = '';
      lead.style.transition = '';
    }
    if (deck) deck.classList.remove('is-deck-swapping', 'is-deck-cutting');
    if (deck) {
      deck.__mcHandoffResumeTimer = window.setTimeout(function () {
        if (gen !== leadHandoffGen_) return;
        deck.__mcHandoffResumeTimer = 0;
        if (lead) {
          lead.style.animationPlayState = '';
          lead.style.transform = '';
          lead.style.animation = '';
        }
        if (typeof deck.__mcOnHandoffDone === 'function') {
          try {
            deck.__mcOnHandoffDone();
          } catch (eDone) {
            /* ignore */
          }
        }
      }, 48);
    }
  }

  var SWAP_OUT_MS_ = 220;
  var SWAP_IN_MS_ = 380;

  /**
   * In-place body dissolve: fade body opacity only → swap decoded photo+copy → fade in.
   * Shell stays at the current float pose (paused) — no rest-pose snap, no translate.
   */
  function runLeadDissolveSwap_(deck, lead, key, data, gen) {
    if (!deck || !lead || !data) return;

    deck.classList.add('is-deck-swapping');
    /* Pause float in place. Clearing animation / forcing LEAD_REST caused a visible shell jump. */
    lead.style.animationPlayState = 'paused';
    lead.style.transition = '';

    lead.classList.remove('is-specimen-swap', 'is-specimen-swap-in');
    lead.classList.add('is-specimen-swap-out');

    var outDone = false;
    var urlGot = false;
    var urlReady = '';
    var committed = false;

    function commitSwap_() {
      if (gen !== leadHandoffGen_ || committed || !outDone || !urlGot) return;
      committed = true;

      applySpecimenToCard(lead, key, false, { skipPhoto: true });
      var img = qs('.mc-passport-card__photo img:not(.mc-passport-card__photo-cross)', lead);
      if (!img) img = qs('.mc-passport-card__photo img', lead);
      commitSpecimenPhotoUrl_(img, data, urlReady);

      lead.classList.remove('is-specimen-swap-out');
      void lead.offsetWidth;
      lead.classList.add('is-specimen-swap-in');

      if (deck.__mcHandoffTimer) window.clearTimeout(deck.__mcHandoffTimer);
      deck.__mcHandoffTimer = window.setTimeout(function () {
        finishLeadSwap_(deck, lead, gen);
      }, SWAP_IN_MS_);
    }

    window.setTimeout(function () {
      outDone = true;
      commitSwap_();
    }, SWAP_OUT_MS_);

    preloadSpecimenPhotoUrl_(data, function (url) {
      if (gen !== leadHandoffGen_) return;
      urlReady = url || '';
      urlGot = true;
      commitSwap_();
    });

    deck.__mcHandoffTimer = window.setTimeout(function () {
      if (gen !== leadHandoffGen_ || committed) return;
      outDone = true;
      urlGot = true;
      commitSwap_();
    }, 2400);
  }

  function resolveSwitchDir_(fromKey, toKey, explicitDir) {
    if (explicitDir === 1 || explicitDir === -1) return explicitDir;
    var fromIdx = ORDER.indexOf(fromKey);
    var toIdx = ORDER.indexOf(toKey);
    if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return 0;
    if (fromIdx === ORDER.length - 1 && toIdx === 0) return 1;
    if (fromIdx === 0 && toIdx === ORDER.length - 1) return -1;
    return toIdx > fromIdx ? 1 : -1;
  }

  function syncOutgoingDeckBack_(hero, previousKey, dir) {
    if (!previousKey || !SPECIMENS[previousKey] || !dir) return;
    var side = dir > 0 ? 'left' : 'right';
    var back = qs('.mc-passport-card--deck-back[data-deck-side="' + side + '"][data-deck-depth="1"]', hero);
    if (!back) return;
    back.setAttribute('data-mc-specimen', previousKey);
    back.setAttribute(
      'aria-label',
      specimenLabel(previousKey) +
        L(' 標本護照範例 — ', ' specimen passport demo — ') +
        SPECIMENS[previousKey].sci
    );
    applySpecimenToCard(back, previousKey, false);
  }

  function applySpecimen(hero, key, animate, dir, previousKey) {
    var data = SPECIMENS[key];
    if (!data) return;

    var deck = qs('#mcHeroPassportDeck', hero);
    var lead = qs('#mcHeroPassportCard', hero);
    var live = qs('#mcHeroSpecimenLive', hero);
    var switchDir = resolveSwitchDir_(previousKey || '', key, dir);

    hero.setAttribute('data-specimen', key);
    leadHandoffGen_ += 1;
    var gen = leadHandoffGen_;
    clearLeadHandoffArtifacts_(deck, lead);

    if (lead) lead.classList.add('is-active');

    var doAnimate = !!(animate && lead && !isReducedMotion());
    if (doAnimate) {
      runLeadDissolveSwap_(deck, lead, key, data, gen);
    } else if (lead) {
      applySpecimenToCard(lead, key, false);
    }

    if (switchDir) syncOutgoingDeckBack_(hero, previousKey, switchDir);

    qsa('.mc-passport-card--deck-back', hero).forEach(function (backCard) {
      if (backCard.getAttribute('data-mc-specimen') === previousKey && switchDir) return;
      var backKey = backCard.getAttribute('data-mc-specimen');
      if (backKey && SPECIMENS[backKey]) {
        applySpecimenToCard(backCard, backKey, false);
      }
    });

    var backItems = qsa('#mcHeroPassportCard .mc-passport-card__backList li', hero);
    var backVals = [
      data.satId,
      data.asset,
      data.mcId,
      data.sci,
      data.common,
      data.taxonomy,
      data.locality ? translateLocality(data.locality) : '\u2014',
      data.license,
      L('館方已審', 'Curator verified'),
      L('CSV / JSON 就緒', 'CSV / JSON ready'),
    ];
    backItems.forEach(function (li, i) {
      var em = qs('em', li);
      if (em && backVals[i]) em.textContent = backVals[i];
    });

    qsa('.mc-hero-v2__specimenNav [data-mc-specimen]', hero).forEach(function (btn) {
      var on = btn.getAttribute('data-mc-specimen') === key;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    var pagerLabel = qs('.mc-hero-v2__phonePagerLabel', hero);
    if (pagerLabel) {
      var orderIdxPager = ORDER.indexOf(key);
      var n = orderIdxPager >= 0 ? orderIdxPager + 1 : 1;
      pagerLabel.textContent = specimenLabel(key) + ' · ' + n + '/' + ORDER.length;
    }

    if (live) {
      var orderIdx = ORDER.indexOf(key);
      var orderTag = orderIdx >= 0 ? L('（', ' (') + (orderIdx + 1) + '/' + ORDER.length + L('）', ')') : '';
      var insectTag =
        key === 'insect' && INSECT_SHOWCASE.length
          ? L(' · 圖鑑 ', ' · catalog ') + (insectShowcaseIndex + 1) + '/' + INSECT_SHOWCASE.length
          : '';
      live.textContent =
        L('目前示範', 'Now showing') +
        orderTag +
        L('：', ': ') +
        specimenLabel(key) +
        ' · ' +
        data.sci +
        insectTag;
    }
  }

  function initDeck(hero, selectFn) {
    var deck = qs('#mcHeroPassportDeck', hero);
    var lead = qs('#mcHeroPassportCard', hero);
    if (!deck || !lead) return;
    if (deck.querySelector('.mc-passport-card--deck-back')) return;

    DECK_SLOTS.forEach(function (slot) {
      var data = SPECIMENS[slot.key];
      if (!data) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mc-passport-card mc-passport-card--deck-back';
      btn.setAttribute('data-deck-side', slot.side);
      btn.setAttribute('data-deck-depth', String(slot.depth));
      btn.setAttribute('data-mc-specimen', slot.key);
      btn.setAttribute(
        'aria-label',
        specimenLabel(slot.key) +
          L(' 標本護照範例 — ', ' specimen passport demo — ') +
          data.sci
      );
      btn.innerHTML = buildDeckCardInnerHTML();
      btn.addEventListener('click', function (event) {
        event.stopPropagation();
        selectFn(slot.key, true);
      });
      deck.insertBefore(btn, lead);
      applySpecimenToCard(btn, slot.key, false);
    });
  }

  function bindSpecimenNav_(hero, selectFn) {
    var nav = qs('#mcHeroSpecimenNav', hero);
    if (!nav || nav.__mcSpecimenNavBound) return;
    nav.__mcSpecimenNavBound = true;
    nav.addEventListener('click', function (event) {
      var btn =
        event.target && event.target.closest ? event.target.closest('[data-mc-specimen]') : null;
      if (!btn || !nav.contains(btn)) return;
      event.preventDefault();
      event.stopPropagation();
      selectFn(btn.getAttribute('data-mc-specimen'), true);
    });
  }

  function bindPhoneHeroPager_(hero, api) {
    var visual = qs('.mc-hero-v2__visual', hero);
    if (!visual) return;
    var pager = qs('.mc-hero-v2__phonePager', hero);
    if (!pager) {
      pager = document.createElement('div');
      pager.className = 'mc-hero-v2__phonePager';
      pager.setAttribute('aria-label', L('標本切換', 'Specimen pager'));
      pager.innerHTML =
        '<button type="button" class="mc-hero-v2__phonePagerBtn" data-hero-cycle="-1" aria-label="' +
        L('上一個標本', 'Previous specimen') +
        '">\u2039</button>' +
        '<p class="mc-hero-v2__phonePagerLabel"></p>' +
        '<button type="button" class="mc-hero-v2__phonePagerBtn" data-hero-cycle="1" aria-label="' +
        L('下一個標本', 'Next specimen') +
        '">\u203A</button>';
      visual.appendChild(pager);
      pager.addEventListener('click', function (event) {
        var btn = event.target && event.target.closest ? event.target.closest('[data-hero-cycle]') : null;
        if (!btn) return;
        event.preventDefault();
        event.stopPropagation();
        var dir = Number(btn.getAttribute('data-hero-cycle'));
        if (dir < 0) api.prev();
        else api.next();
      });
    }
    var pagerLabel = qs('.mc-hero-v2__phonePagerLabel', hero);
    if (pagerLabel) {
      var key = api.getCurrent();
      var orderIdxPager = ORDER.indexOf(key);
      var n = orderIdxPager >= 0 ? orderIdxPager + 1 : 1;
      pagerLabel.textContent = specimenLabel(key) + ' · ' + n + '/' + ORDER.length;
    }

    var stage = qs('#mcHeroPassportStage', hero);
    if (!stage || stage.__mcPhoneSwipeBound) return;
    stage.__mcPhoneSwipeBound = true;
    var startX = 0;
    var startY = 0;
    var tracking = false;
    var usedSwipe = false;
    stage.addEventListener('pointerdown', function (event) {
      if (!isPhoneHeroLayout()) return;
      if (event.target && event.target.closest && event.target.closest('.mc-hero-v2__phonePager')) return;
      tracking = true;
      usedSwipe = false;
      startX = event.clientX;
      startY = event.clientY;
    });
    stage.addEventListener('pointerup', function (event) {
      if (!tracking) return;
      tracking = false;
      if (!isPhoneHeroLayout()) return;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.15) {
        usedSwipe = true;
        if (dx < 0) api.next();
        else api.prev();
      }
    });
    stage.addEventListener('pointercancel', function () {
      tracking = false;
    });
    stage.addEventListener(
      'click',
      function (event) {
        if (!usedSwipe) return;
        usedSwipe = false;
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );
  }

  function initSpecimens(hero) {
    var current = ORDER[0];
    var cycleTimer = null;
    var paused = false;

    function select(key, animate, dir) {
      if (!SPECIMENS[key]) return;
      var deck = qs('#mcHeroPassportDeck', hero);
      /* Queue latest pick while a handoff is mid-flight — avoids stacked snaps. */
      if (deck && deck.classList.contains('is-deck-handoff') && animate !== false && !isReducedMotion()) {
        deck.__mcPendingSpecimen = { key: key, animate: animate, dir: dir };
        deck.__mcOnHandoffDone = function () {
          var pending = deck.__mcPendingSpecimen;
          deck.__mcPendingSpecimen = null;
          deck.__mcOnHandoffDone = null;
          if (pending && pending.key && pending.key !== current) {
            select(pending.key, pending.animate !== false, pending.dir);
          }
        };
        return;
      }
      var previousKey = current;
      if (key === current) {
        if (key === 'insect') {
          advanceInsectShowcase_();
          applySpecimen(hero, 'insect', animate !== false, dir || 1, previousKey);
          resetCycle();
        }
        return;
      }
      if (key === 'insect') syncInsectSpecimenFromShowcase_(insectShowcaseIndex);
      current = key;
      setCardSide(qs('#mcHeroPassportCard', hero), 'front');
      applySpecimen(hero, key, animate !== false, dir, previousKey);
      resetCycle();
    }

    function next() {
      var idx = ORDER.indexOf(current);
      var nextKey = ORDER[(idx + 1) % ORDER.length];
      if (nextKey === 'insect') advanceInsectShowcase_();
      select(nextKey, true, 1);
    }

    function prev() {
      var idx = ORDER.indexOf(current);
      var prevKey = ORDER[(idx - 1 + ORDER.length) % ORDER.length];
      select(prevKey, true, -1);
    }

    function resetCycle() {
      if (cycleTimer) window.clearInterval(cycleTimer);
      if (isReducedMotion() || paused) return;
      cycleTimer = window.setInterval(next, CYCLE_MS);
    }

    bindSpecimenNav_(hero, select);

    try {
      applySpecimen(hero, current, false);
    } catch (eApplyInit) {
      console.error('[MCurator] mc-hero-v2 applySpecimen init failed', eApplyInit);
    }

    var stage = qs('#mcHeroPassportStage', hero);
    if (stage) {
      stage.addEventListener('mouseenter', function () {
        paused = true;
        if (cycleTimer) window.clearInterval(cycleTimer);
      });
      stage.addEventListener('mouseleave', function () {
        paused = false;
        resetCycle();
      });
    }

    var demoBtn = qs('#btnWelcomeHeroStart', hero);
    if (demoBtn) {
      demoBtn.addEventListener('click', function (event) {
        event.preventDefault();
        next();
        var stageEl = qs('#mcHeroPassportStage', hero);
        if (stageEl && stageEl.scrollIntoView) {
          stageEl.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
        }
      });
    }

    initDeck(hero, select);

    var api = {
      select: select,
      next: next,
      prev: prev,
      getCurrent: function () { return current; },
    };
    bindPhoneHeroPager_(hero, api);

    resetCycle();
    return api;
  }

  function initCard(hero) {
    var card = qs('#mcHeroPassportCard', hero);
    var stage = qs('#mcHeroPassportStage', hero);
    var flip = qs('.mc-hero-v2__flipHint', hero);
    if (!card || card.__mcHeroCardBound) return;
    card.__mcHeroCardBound = true;

    function shouldIgnoreFlip(event) {
      return (
        event.target &&
        (event.target.closest('.mc-hero-v2__hotspot') ||
          event.target.closest('.mc-hero-v2__specimenNav') ||
          event.target.closest('.mc-hero-v2__specimenNav *') ||
          event.target.closest('.mc-hero-v2__phonePager') ||
          event.target.closest('.mc-passport-card--deck-back'))
      );
    }

    function toggle(event) {
      if (event && shouldIgnoreFlip(event)) return;
      setCardSide(card, card.getAttribute('data-side') === 'back' ? 'front' : 'back');
    }

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle(event);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        var nav = qsa('.mc-hero-v2__specimenNav [data-mc-specimen]', hero);
        var idx = nav.findIndex(function (b) { return b.classList.contains('is-active'); });
        if (idx < 0) return;
        var nextIdx = event.key === 'ArrowRight' ? (idx + 1) % nav.length : (idx - 1 + nav.length) % nav.length;
        nav[nextIdx].click();
      }
    });
    if (flip) {
      flip.addEventListener('click', function (event) {
        event.stopPropagation();
        toggle(event);
      });
    }

    if (isReducedMotion()) return;

    var targetRx = 0;
    var targetRy = 0;
    var currentRx = 0;
    var currentRy = 0;
    var mx = 48;
    var my = 24;
    var hovering = false;
    var rafId = 0;

    function applyTilt() {
      var ease = hovering ? 0.14 : 0.1;
      currentRx += (targetRx - currentRx) * ease;
      currentRy += (targetRy - currentRy) * ease;
      var flipped = card.classList.contains('is-flipped');
      var rxMul = flipped ? 0.4 : 1;
      var ryMul = flipped ? 0.4 : 1;

      card.style.setProperty('--rx', (currentRx * rxMul).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (currentRy * ryMul).toFixed(2) + 'deg');
      card.style.setProperty('--mx', mx.toFixed(1) + '%');
      card.style.setProperty('--my', my.toFixed(1) + '%');

      if (stage) {
        stage.style.setProperty('--stage-rx', (currentRx * 0.35).toFixed(2) + 'deg');
        stage.style.setProperty('--stage-ry', (currentRy * 0.35).toFixed(2) + 'deg');
      }

      if (hovering || Math.abs(targetRx - currentRx) > 0.04 || Math.abs(targetRy - currentRy) > 0.04) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        rafId = 0;
      }
    }

    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    }

    card.addEventListener('pointerenter', function () {
      hovering = true;
      card.classList.add('is-tilting');
      startLoop();
    });

    card.addEventListener('pointermove', function (event) {
      var bounds = card.getBoundingClientRect();
      var x = (event.clientX - bounds.left) / bounds.width;
      var y = (event.clientY - bounds.top) / bounds.height;
      targetRy = (x - 0.5) * 14;
      targetRx = (0.5 - y) * 10;
      mx = x * 100;
      my = y * 100;
      hovering = true;
      card.classList.add('is-tilting');
      startLoop();
    });

    card.addEventListener('pointerleave', function () {
      hovering = false;
      targetRx = 0;
      targetRy = 0;
      card.classList.remove('is-tilting');
      startLoop();
    });
  }

  function initCallouts(hero) {
    if (hero.__mcHeroCalloutsBound) return;
    hero.__mcHeroCalloutsBound = true;
    var active = 'photo';
    qsa('.mc-hero-v2__hotspot[data-mc-spot]', hero).forEach(function (button) {
      var key = button.getAttribute('data-mc-spot');
      function preview() {
        hero.setAttribute('data-zone', key);
      }
      button.addEventListener('mouseenter', preview);
      button.addEventListener('focus', preview);
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        active = key;
        qsa('.mc-hero-v2__hotspot[data-mc-spot]', hero).forEach(function (candidate) {
          var selected = candidate.getAttribute('data-mc-spot') === active;
          candidate.classList.toggle('is-active', selected);
          candidate.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
        preview();
        setCardSide(qs('#mcHeroPassportCard', hero), 'front');
      });
      button.addEventListener('mouseleave', function () {
        hero.setAttribute('data-zone', active);
      });
    });
    hero.setAttribute('data-zone', active);
    var first = qs('.mc-hero-v2__hotspot--photo', hero);
    if (first) {
      first.classList.add('is-active');
      first.setAttribute('aria-pressed', 'true');
    }
  }

  function ensureHeroVisible_(hero) {
    if (!hero) return;
    hero.classList.add('is-hero-entered');
    hero.classList.remove('is-hero-entrance-running');
    hero.setAttribute('data-hero-entrance', 'done');
  }

  function initHeroEntrance_(hero) {
    if (!hero) return;
    if (hero.getAttribute('data-hero-entrance') === 'done') return;

    if (isReducedMotion()) {
      ensureHeroVisible_(hero);
      return;
    }

    hero.classList.remove('is-hero-entered');
    hero.setAttribute('data-hero-entrance', 'pending');
    hero.classList.add('is-hero-entrance-running');

    var failsafe = window.setTimeout(function () {
      ensureHeroVisible_(hero);
    }, 8000);

    function finishEntrance_() {
      hero.classList.add('is-hero-entered');
      hero.setAttribute('data-hero-entrance', 'done');
      window.setTimeout(function () {
        hero.classList.remove('is-hero-entrance-running');
        window.clearTimeout(failsafe);
      }, 1600);
    }

    function whenLandingUncovered_(callback) {
      var html = document.documentElement;
      var fired = false;
      function go() {
        if (fired) return;
        fired = true;
        window.clearTimeout(giveUp);
        if (observer) observer.disconnect();
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(callback);
        });
      }
      function covered() {
        return html.classList.contains('mc-boot-active') || !!document.getElementById('mcBootSplash');
      }
      var observer = null;
      var giveUp = window.setTimeout(go, 7000);
      if (!covered()) {
        go();
        return;
      }
      observer = new MutationObserver(function () {
        if (!covered()) go();
      });
      observer.observe(html, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      });
    }

    function scheduleEntrance_() {
      whenLandingUncovered_(finishEntrance_);
    }

    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise(function (resolve) {
          window.setTimeout(resolve, 900);
        }),
      ]).then(scheduleEntrance_, scheduleEntrance_);
    } else {
      scheduleEntrance_();
    }
  }

  function scheduleHeroInitRetry_() {
    window.setTimeout(function () {
      var hero = qs(ROOT);
      if (!hero || hero.getAttribute('data-hero-js')) return;
      init();
    }, 120);
  }

  function init() {
    var hero = qs(ROOT);
    if (!hero) {
      scheduleHeroInitRetry_();
      return;
    }
    if (hero.getAttribute('data-hero-js')) return;

    heroRoot = hero;
    try {
      wireHeroSpecimenAssets();
      applyHeroStaticCopy(hero);
      heroSpecimenCtrl = initSpecimens(hero);
      initCard(hero);
      initCallouts(hero);
      initHeroEntrance_(hero);
      hero.setAttribute('data-hero-js', 'passport-hero-card-ref-v92');
      hero.setAttribute('data-hero-layout', 'passport-deck-v33');
      hero.setAttribute('data-hero-asset-source', 'assets-images-library');
      var insect = SPECIMENS.insect;
      if (insect && insect.imageRel) {
        hero.setAttribute('data-hero-photo-rel', insect.imageRel);
      }
    } catch (eInit) {
      console.error('[MCurator] mc-hero-v2 init failed', eInit);
      scheduleHeroInitRetry_();
    }
  }

  window.McWelcomeHeroDemo = window.McWelcomeHeroDemo || {};
  window.McWelcomeHeroDemo.refreshI18n = refreshHeroI18n;
  window.McWelcomeHeroDemo.translateLocality = translateLocality;
  window.McWelcomeHeroDemo.ensureReady = init;
  window.McWelcomeHeroDemo.selectSpecimen = function (key, animate) {
    if (heroSpecimenCtrl && typeof heroSpecimenCtrl.select === 'function') {
      heroSpecimenCtrl.select(key, animate);
      return true;
    }
    init();
    if (heroSpecimenCtrl && typeof heroSpecimenCtrl.select === 'function') {
      heroSpecimenCtrl.select(key, animate);
      return true;
    }
    return false;
  };

  window.MCHeroPassportCatalog = {
    backdropKeys: ORDER.filter(function (key) { return key !== 'insect'; }),
    getSpecimen: function (key) { return SPECIMENS[key] || null; },
    imageSrc: function (key) {
      var data = SPECIMENS[key];
      if (!data || !data.imageRel) return '';
      return '../' + String(data.imageRel).replace(/^\//, '');
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', function () {
    if (!qs(ROOT) || qs(ROOT).getAttribute('data-hero-js')) return;
    init();
  });

  window.addEventListener('mc:localechange', function () {
    refreshHeroI18n();
    if (heroRoot && heroRoot.getAttribute('data-hero-js')) return;
    if (qs(ROOT) && !qs(ROOT).getAttribute('data-hero-js')) init();
  });
  window.addEventListener('mc:locale', function () {
    refreshHeroI18n();
    if (heroRoot && heroRoot.getAttribute('data-hero-js')) return;
    if (qs(ROOT) && !qs(ROOT).getAttribute('data-hero-js')) init();
  });
})();
