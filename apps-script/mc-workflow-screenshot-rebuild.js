(function () {
  'use strict';

  window.__MCURATOR_CODEX_WORKFLOW_REBUILD_VISIBLE__ = true;
  console.log("MCurator Codex workflow rebuild marker visible");
  console.log("MCurator workflow screenshot rebuild loaded v2026-mineral-png-cutout");

  function normalizeWorkflowLang_(lang) {
    var s = String(lang == null ? '' : lang).trim();
    if (!s) return '';
    var low = s.toLowerCase().replace(/_/g, '-');
    if (low === 'zh' || low.indexOf('zh-') === 0) return 'zh-TW';
    if (low === 'ja' || low.indexOf('ja-') === 0) return 'ja-JP';
    if (low === 'de' || low.indexOf('de-') === 0) return 'de-DE';
    if (low === 'en-us' || low.indexOf('en-us-') === 0) return 'en-US';
    if (low === 'en-gb' || low.indexOf('en-gb-') === 0) return 'en-GB';
    if (low === 'en' || low === 'en-001' || low.indexOf('en-') === 0) return 'en-001';
    if (low === 'zh-tw' || low === 'ja-jp' || low === 'de-de') return s;
    if (s === 'zh-TW' || s === 'ja-JP' || s === 'de-DE' || s === 'en-001' || s === 'en-US' || s === 'en-GB') return s;
    return '';
  }

  function getLang() {
    try {
      if (typeof window.mcGetLang === 'function') {
        var fromMc = normalizeWorkflowLang_(window.mcGetLang());
        if (fromMc) return fromMc;
      }
    } catch (eMc) {
      void 0;
    }
    try {
      if (typeof state !== 'undefined' && state && state.lang) {
        var fromState = normalizeWorkflowLang_(state.lang);
        if (fromState) return fromState;
      }
      if (window.MC_LOCALE) {
        var fromLocale = normalizeWorkflowLang_(window.MC_LOCALE);
        if (fromLocale) return fromLocale;
      }
      var stored = normalizeWorkflowLang_(localStorage.getItem('MC_USER_LANG'));
      if (stored) return stored;
    } catch (e0) {
      void 0;
    }
    return 'zh-TW';
  }

  function applyEnglishVariant_(text) {
    if (text == null) return text;
    var lang = getLang();
    var api = window.MCEnglishSpelling;
    if (!api) return text;
    if (lang === 'en-US' && typeof api.applyAmericanSpelling === 'function') {
      return api.applyAmericanSpelling(text) || text;
    }
    if (lang === 'en-GB' && typeof api.applyBritishSpelling === 'function') {
      return api.applyBritishSpelling(text) || text;
    }
    return text;
  }

  function isZh() {
    return getLang() === 'zh-TW';
  }

  function isJa() {
    return getLang() === 'ja-JP';
  }

  function wfI18nPack() {
    try {
      var lang = getLang();
      if (lang === 'de-DE') return window.MCWorkflowScreenshotDeI18n || null;
      if (lang === 'ja-JP') return window.MCWorkflowScreenshotI18n || null;
      return null;
    } catch (e) {
      return null;
    }
  }

  function isDe() {
    return getLang() === 'de-DE';
  }

  function hasKana_(value) {
    return /[\u3040-\u30ff]/.test(String(value));
  }

  function deMapHit_(key, value) {
    if (value == null) return false;
    var text = String(value);
    if (!text.length || text === key) return false;
    if (hasKana_(text)) return false;
    return true;
  }

  function L(zh, en, loc) {
    var lang = getLang();
    if (lang === 'zh-TW') return zh;
    if (lang === 'ja-JP') {
      if (loc != null && String(loc).length) return loc;
      var packJa = wfI18nPack();
      if (packJa && packJa.zhJa && packJa.zhJa[zh] != null) return packJa.zhJa[zh];
      if (packJa && packJa.enJa && packJa.enJa[en] != null) return packJa.enJa[en];
      return en;
    }
    if (lang === 'de-DE') {
      var packDe = wfI18nPack();
      if (packDe && packDe.zhDe && deMapHit_(zh, packDe.zhDe[zh])) return packDe.zhDe[zh];
      if (packDe && packDe.enDe && deMapHit_(en, packDe.enDe[en])) return packDe.enDe[en];
      if (loc != null && String(loc).length && !hasKana_(loc)) return loc;
      return applyEnglishVariant_(en);
    }
    return applyEnglishVariant_(en);
  }

  function disciplineTitle(discipline) {
    var pack = wfI18nPack();
    var ja = pack && pack.disciplines && pack.disciplines[discipline.id];
    return L(discipline.titleZh, discipline.titleEn, ja && ja.title);
  }

  function disciplineSubtitle(discipline) {
    if (isZh()) return discipline.titleEn;
    return '';
  }

  var interactiveCardSelector = '.mcwf-evolving-card, .mcwf-mini, .mcwf-discipline-pick, .mc-stage-photo-option';

  function cardMotionWrap(innerHtml) {
    return '<span class="mcwf-card-sway-wrap"><span class="mcwf-card-tilt">' + innerHtml + '</span></span>';
  }

  var CARD_BACK_IMAGE_BASE = 'card-back-image/';
  var backImage = CARD_BACK_IMAGE_BASE + 'Lepidoptera.png';
  var fossilImage = CARD_BACK_IMAGE_BASE + 'fossil.png';
  var entomologyDisciplineImage = '../assets/Research Disciplines/Entomology.png';
  var paleontologyDisciplineImage = '../assets/Research Disciplines/Paleontology  Fossils.png';
  var botanyDisciplineImage = '../assets/Research Disciplines/Botany.png';
  var dinopediaDisciplineImage = '../assets/Research Disciplines/Dinopedia.png';
  var zoologyDisciplineImage = 'workflow-discipline-images/zoology.jpg?v=field-v3';
  var mineralogyDisciplineImage = 'workflow-discipline-images/mineralogy.jpg?v=field-v1';
  var marineBiologyDisciplineImage = 'workflow-discipline-images/marine-biology.jpg?v=field-v2';
  var microbiologyDisciplineImage = 'workflow-discipline-images/microbiology.jpg?v=field-v1';
  var WORKFLOW_MICRO_IMAGE_BASE = 'workflow-microbiology-images/';
  var INSECT_IMAGE_BASE = '../assets/images/insect/hero-passport/';
  var WORKFLOW_INSECT_IMAGE_BASE = 'workflow-insect-images/';
  var PLANT_HERO_IMAGE_BASE = '../assets/images/plant/hero-passport/';
  var WORKFLOW_PLANT_IMAGE_BASE = 'workflow-plant-images/';
  var SEED_HERO_IMAGE_BASE = '../assets/images/seed/hero-passport/';
  var PALEO_HERO_IMAGE_BASE = '../assets/images/paleo/hero-passport/';
  var FOSSIL_HERO_IMAGE_BASE = '../assets/images/fossil/hero-passport/';
  var WORKFLOW_PALEO_IMAGE_BASE = 'workflow-paleo-images/';
  var DINO_HERO_IMAGE_BASE = '../assets/images/dino/hero-passport/';
  var WORKFLOW_ZOOLOGY_IMAGE_BASE = 'workflow-zoology-images/';
  var HERBARIUM_HERO_IMAGE = '../assets/images/herbarium/herbarium-complete-fp-hero-v2.jpg';

  /** Verified locality strings (country/region · habitat or formation). Key = image slug. */
  var VERIFIED_SPECIMEN_LOCALITIES = {
    'allotopus-moellenkampi-babai': '\u99ac\u4f86\u897f\u4e9e \u00b7 \u9739\u9742',
    'ampedus-sp': '\u81fa\u7063 \u00b7 \u5357\u6295',
    'cheirotonus-jansoni': '\u6cf0\u570b \u00b7 \u6e05\u9081',
    'cyclommatus-metallifer': '\u5370\u5c3c \u00b7 \u8607\u62c9\u5a01\u897f',
    'chiasognathus-grantii': '\u667a\u5229 \u00b7 \u5357\u90e8\u6eab\u5e36\u6797',
    'hexarthrius-mandibularis': '\u99ac\u4f86\u897f\u4e9e \u00b7 \u6c99\u5df4',
    'dynastes-neptunus': '\u5384\u74dc\u591a \u00b7 \u5b89\u7b2c\u65af',
    'lucanus-cervus': '\u5fb7\u570b \u00b7 \u5df4\u4f10\u5229\u4e9e',
    'mesotopus-tarandus': '\u525b\u679c\uff08\u91d1\uff09 \u00b7 \u4e2d\u975e\u71b1\u5e36\u6797',
    'odontolabis-dalmanni-intermedia': '\u83f2\u5f8b\u8cd3 \u00b7 \u5442\u5b8b',
    'odontolabis-lacordairei': '\u8d8a\u5357 \u00b7 \u4e2d\u90e8\u9ad8\u539f',
    'prosopocoilus-lafertei': '\u99ac\u4f86\u897f\u4e9e \u00b7 \u7802\u62c9\u8d8a',
    'phalacrognathus-muelleri': '\u6fb3\u6d32 \u00b7 \u6606\u58eb\u862d',
    'prosopocoilus-kannegieteri': '\u5370\u5c3c \u00b7 \u8607\u9580\u7b54\u81e8',
    'sphaenognathus-feisthamelii': '\u54e5\u502b\u6bd4\u4e9e \u00b7 \u5b89\u7b2c\u65af',
    'kaniska-canace': '\u81fa\u7063 \u00b7 \u5357\u6295',
    'borbo-cinnara': '\u81fa\u7063 \u00b7 \u4f4e\u6d77\u62d4',
    'graphium-antiphates': '\u81fa\u7063 \u00b7 \u6771\u90e8\u4f4e\u5c71',
    'acytolepsis-puspa-myla': '\u81fa\u7063 \u00b7 \u5357\u6295',
    'heliophorus-ila-matsumurae': '\u81fa\u7063 \u00b7 \u4e2d\u90e8\u5c71\u5340',
    'graphium-agamemnon': '\u6771\u5357\u4e9e \u00b7 \u4f4e\u5730\u96e8\u6797',
    'polyura-athamas': '\u6cf0\u570b \u00b7 \u5317\u90e8\u68ee\u6797',
    'athyma-selenophora': '\u81fa\u7063 \u00b7 \u9ad8\u96c4',
    'plusiotis-chrysargirea': '\u54e5\u65af\u5927\u9ece\u52a0 \u00b7 \u5854\u62c9\u66fc\u5361',
    'paraponera-clavata': '\u79d8\u9b6f \u00b7 \u4e9e\u99ac\u905c\u4f4e\u5730',
    'ixorida-venerea': '\u5370\u5c3c \u00b7 \u8607\u62c9\u5a01\u897f',
    'dorcus-ternatensis': '\u5370\u5c3c \u00b7 \u6469\u9e7f\u52a0\u7fa4\u5cf6',
    'brachysiderus-quadrimaculatus': '\u5df4\u897f',
    'aegus-acuminatus-acuminatus': '\u99ac\u4f86\u897f\u4e9e \u00b7 \u6c99\u5df4',
    'aegus-parallelus': '\u5370\u5c3c \u00b7 \u8607\u9580\u7b54\u81e8',
    'plusiotis-victorina': '\u5df4\u62ff\u99ac \u00b7 \u4f4e\u5730\u96e8\u6797',
    'pseudoscortizus-incredibilis': 'Peru: Jun\u00edn: San Luis',
    'aesalus-imanishii': '\u65e5\u672c \u00b7 \u672c\u5dde',
    'hexarthrius-parryi': '\u6cf0\u570b \u00b7 \u5317\u90e8\u68ee\u6797',
    'xylotrupes-pubescens': '\u5370\u5c3c \u00b7 \u8607\u62c9\u5a01\u897f',
    'dorcus-alcides': '\u5c3c\u6cca\u723e \u00b7 \u4e2d\u90e8\u5c71\u8108',
    'adiantum-capillus-veneris': '\u81fa\u7063 \u00b7 \u9670\u6fd5\u5ca9\u58c1',
    'drosera-spp': '\u81fa\u7063 \u00b7 \u5927\u5c6b\u5c71\u6e7f\u5730',
    'ginkgo-biloba': '\u4e2d\u570b \u00b7 \u6d59\u6c5f\u897f\u5929\u76ee\u5c71',
    'koelreuteria-elegans': '\u81fa\u7063 \u00b7 \u4f4e\u6d77\u62d4\u6eaa\u8c37',
    'mimosa-pudica': '\u5357\u7f8e\u6d32 \u00b7 \u539f\u7522\u5730',
    'nelumbo-nucifera': '\u81fa\u7063 \u00b7 \u6c60\u5858\u6e7f\u5730',
    'nepenthes-spp': '\u99ac\u4f86\u897f\u4e9e \u00b7 \u6c99\u5df4\u5c71',
    'nephrolepis-cordifolia': '\u81fa\u7063 \u00b7 \u4f4e\u6d77\u62d4\u6797\u4e0b',
    'pinus-spp': '\u65e5\u672c \u00b7 \u6eab\u5e36\u91dd\u8449\u6797',
    'platycerium-spp': '\u99ac\u4f86\u897f\u4e9e \u00b7 \u71b1\u5e36\u9644\u751f\u6809\u6885',
    'linhenykus-monodactylus': '\u4e2d\u570b \u00b7 \u5167\u8499\u53e4\u5df4\u4e39\u6e56\u7fa4',
    'balaur-bondoc': '\u7f85\u99ac\u5c3c\u4e9e \u00b7 \u54c8\u5922\u5cf6',
    'eoabelisaurus-mefi': '\u963f\u6839\u5ef7 \u00b7 \u4e18\u5e03\u7279',
    'eocursor-parvus': '\u5357\u975e \u00b7 \u827e\u7565\u7279\u7d44',
    'stegosaurus-stenops': '\u7f8e\u570b \u00b7 \u79d1\u7f85\u62c9\u591a\u83ab\u91cc\u68ee',
    'tarbosaurus-bataar': '\u8499\u53e4 \u00b7 \u6208\u58c1',
    'vallibonavenatrix-cani': '\u897f\u73ed\u7259 \u00b7 \u5df4\u5229\u535a\u7d0d',
    'ambopteryx-longibrachium': '\u4e2d\u570b \u00b7 \u907c\u5be7\u51cc\u6e90',
    'yutyrannus-huali': '\u4e2d\u570b \u00b7 \u907c\u5be7\u5317\u7968',
    'yamaceratops-dorngobiensis': '\u8499\u53e4 \u00b7 \u6771\u6208\u58c1',
    'yutyrannus-huali-pack': '\u4e2d\u570b \u00b7 \u907c\u5be7\u5317\u7968',
    'zhenyuanlong-suni': '\u4e2d\u570b \u00b7 \u907c\u5be7\u5efa\u660c',
    'zalmoxes-robustus': '\u7f85\u99ac\u5c3c\u4e9e \u00b7 \u54c8\u5922\u5cf6',
    'zuniceratops-christopheri': '\u7f8e\u570b \u00b7 \u65b0\u58a8\u897f\u54e5',
    'zhuchengtyrannus-magnus': '\u4e2d\u570b \u00b7 \u5c71\u6771\u8af8\u57ce',
    'wiwaxia-corrugata': '\u52a0\u62ff\u5927 \u00b7 \u4f2f\u683c\u65af\u987d\u9875\u5ca9',
    'yohoia-tenuis': '\u52a0\u62ff\u5927 \u00b7 \u4f2f\u683c\u65af\u987d\u9875\u5ca9',
    'peytoia-nathorsti': '\u52a0\u62ff\u5927 \u00b7 \u4f2f\u683c\u65af\u987d\u9875\u5ca9',
    'ovatiovermis-cribratus': '\u52a0\u62ff\u5927 \u00b7 \u4f2f\u683c\u65af\u987d\u9875\u5ca9',
    'cardiodictyon-catenulatum': '\u4e2d\u570b \u00b7 \u6f84\u6c5f',
    'proterosuchus-fergusi': '\u5357\u975e \u00b7 \u5361\u9b6f',
    'hyperodapedon-gordoni': '\u82f1\u570b \u00b7 \u57c3\u723e\u91d1',
    'pseudocarcinus-karlraubenheimeri': '\u65b0\u897f\u862d \u00b7 \u683c\u96f7\u8305\u65af',
    'parapuzosia-seppenradensis': '\u5fb7\u570b \u00b7 \u585e\u5f6d\u62c9\u5fb7',
    'dickinsonia-costata': '\u6fb3\u5927\u5229\u4e9e \u00b7 \u5f17\u6797\u5fb7\u65af',
    'hieraaetus-moorei': '\u65b0\u897f\u862d \u00b7 \u5357\u5cf6\u5c71\u8109',
    'caryosyntrips-serratus': '\u52a0\u62ff\u5927 \u00b7 \u4f2f\u683c\u65af\u987d\u9875\u5ca9',
    'dinichthys-terrelli': '\u7f8e\u570b \u00b7 \u4fc4\u4ea5\u4fc4',
    'collinsium-ciliosum': '\u4e2d\u570b \u00b7 \u96f2\u5357\u856d\u5bfa\u5821',
    'titanichthys-agassizii': '\u7f8e\u570b \u00b7 \u4fc4\u4ea5\u4fc4',
    'priscomyzon-riniensis': '\u5357\u975e \u00b7 \u6c83\u7279\u76e7',
    'naraoia-compacta': '\u52a0\u62ff\u5927 \u00b7 \u4f2f\u683c\u65af\u987d\u9875\u5ca9',
    'attercopus-fimbriunguis': '\u7f8e\u570b \u00b7 \u7d10\u7d04\u5409\u723e\u535a',
    'koneprusia-brutoni': '\u6469\u6d1b\u54e5 \u00b7 \u963f\u7279\u62c9\u65af\u5c71\u8108',
    'whiteia-woodwardi': '\u99ac\u9054\u52a0\u65af\u52a0 \u00b7 \u85a9\u5361\u6885\u7d0d',
    'trilobite-sp': '\u6469\u6d1b\u54e5',
    'gerastos-granulosos': '\u6469\u6d1b\u54e5 \u00b7 \u5091\u8c9d\u52d2\u5967\u6cd5\u7279',
    'pleistocene-jinshi-longdong': '\u81fa\u7063 \u00b7 \u897f\u6e56\u9109\u91d1\u77f3\u6751\u9f8d\u6d1e\u6eaa',
    'scaphechinus-mirabilis': '\u81fa\u7063 \u00b7 \u897f\u6e56\u9109\u91d1\u77f3\u6751\u9f8d\u6d1e\u6eaa',
    'calymeme-sp': '\u6469\u6d1b\u54e5 \u00b7 \u53cd\u963f\u7279\u62c9\u65af',
    'chunerpeton-tianyiensis': '\u4e2d\u570b \u00b7 \u5167\u8499\u53e4\u5be7\u57ce',
    'aioloceras-besairei': '\u99ac\u9054\u52a0\u65af\u52a0 \u00b7 \u99ac\u54c8\u8d0a\u52a0',
    'muntiacus-sp': '\u81fa\u7063 \u00b7 \u81fa\u5357\u5de6\u93ae',
    'mammuthus-primigenius': '\u4e2d\u570b \u00b7 \u9ed1\u9f8d\u6c5f\u9867\u9109\u5c6f\u7d44',
    'dinocrocuta-sp': '\u4e2d\u570b \u00b7 \u7518\u8085\u81e8\u590f\u548c\u653f',
    'coleoptera-indet-amber': '\u7dec\u7538',
    'insecta-indet-amber': '\u7dec\u7538',
    'mosasauroidea-sp': '\u6469\u6d1b\u54e5',
    'spinosaurus-aegyptiacus': '\u6469\u6d1b\u54e5 \u00b7 \u51f1\u59c6\u51f1\u59c6',
    'borealosuchus-sternbergii': '\u7f8e\u570b \u00b7 \u61f7\u4fc4\u660e',
    'lophophyllidium-plummeri': '\u7f8e\u570b \u00b7 \u5fb7\u5dde\u5e03\u91cc\u5947\u6ce2\u7279',
    'globidens-sp': '\u6469\u6d1b\u54e5',
    'beelzebufo-ampinga': '\u99ac\u9054\u52a0\u65af\u52a0 \u00b7 \u99ac\u57c3\u74e6\u8afe',
    'asaphus-kowalewskii': '\u4fc4\u7f85\u65af \u00b7 \u8056\u5f7c\u5f97\u5821',
    'nipponites-mirabilis': '\u65e5\u672c \u00b7 \u5317\u6d77\u9053',
    'ammonoidea-sp': '\u5fb7\u570b',
    'nimbadon-lavarackorum': '\u6fb3\u6d32 \u00b7 \u6606\u58eb\u862d\u91cc\u5f17\u65af\u5229',
    'drepanaspis-gemuendenensis': '\u5fb7\u570b \u00b7 \u6d2a\u65af\u5442\u514b',
    'edestus-heinrichi': '\u7f8e\u570b \u00b7 \u4f0a\u5229\u8afe\u4f0a',
    'mimetaster-hexagonalis': '\u5fb7\u570b \u00b7 \u6d2a\u65af\u5442\u514b',
    'paroedura-picta': '\u99ac\u9054\u52a0\u65af\u52a0 \u00b7 \u65f1\u751f\u6797',
    'nephrurus-levis': '\u6fb3\u6d32 \u00b7 \u4e7e\u65f1\u704c\u53e2',
    'nephrurus-levis-2': '\u6fb3\u6d32 \u00b7 \u5167\u9678\u6c99\u5730',
    'varanus-salvator-penang': '\u99ac\u4f86\u897f\u4e9e \u00b7 \u6ab3\u57ce',
    'varanus-salvator-thailand': '\u6cf0\u570b \u00b7 \u4f4e\u5730\u6c34\u57df',
    'cuora-flavomarginata': '\u65e5\u672c \u00b7 \u7409\u7403',
    'eublepharis-macularius': '\u5df4\u57fa\u65af\u5766 \u00b7 \u65f1\u5730\u5ca9\u5340',
    'cynomys-ludovicianus': '\u7f8e\u570b \u00b7 \u5927\u5e73\u539f',
    'megaceryle-lugubris-pallida': '\u65e5\u672c \u00b7 \u6cb3\u5ddd',
    'petaurus-breviceps': '\u6fb3\u6d32 \u00b7 \u758f\u6797',
    'polypedates-megacephalus': '\u67ec\u57d4\u5be8 \u00b7 \u5433\u54e5\u7a9f',
    'rhacodactylus-leachianus': '\u65b0\u5580\u91cc\u591a\u5c3c\u4e9e \u00b7 \u96e8\u6797',
    'tarentola-chazaliae': '\u6469\u6d1b\u54e5 \u00b7 \u5927\u897f\u6d0b\u6cbf\u5cb8'
  };

  function verifiedLocalityForSlug(slug, fallback) {
    if (slug && VERIFIED_SPECIMEN_LOCALITIES[slug]) return VERIFIED_SPECIMEN_LOCALITIES[slug];
    return fallback || '\u2014';
  }

  var LOCALITY_GEO_EN = {
    '\u99ac\u4f86\u897f\u4e9e': 'Malaysia',
    '\u7522\u5730\u672a\u8a18\u9304': 'Locality not recorded',
    '\u9732\u9731': 'Raub',
    '\u81fa\u7063': 'Taiwan',
    '\u5357\u6295': 'Nantou',
    '\u6cf0\u570b': 'Thailand',
    '\u6e05\u9081': 'Chiang Mai',
    '\u5370\u5c3c': 'Indonesia',
    '\u8607\u62c9\u5a01\u897f': 'Sulawesi',
    '\u667a\u5229': 'Chile',
    '\u5357\u90e8\u6eab\u5e36\u6797': 'Southern temperate forest',
    '\u6c99\u5df4': 'Sabah',
    '\u5384\u74dc\u591a': 'Ecuador',
    '\u4e9e\u99ac\u905c\u4f4e\u5730': 'Amazon lowlands',
    '\u5fb7\u570b': 'Germany',
    '\u5df4\u4f10\u5229\u4e9e': 'Bavaria',
    '\u525b\u679c\uff08\u91d1\uff09': 'DR Congo',
    '\u4e2d\u975e\u71b1\u5e36\u6797': 'Central African rainforest',
    '\u83f2\u5f8b\u8cd3': 'Philippines',
    '\u5442\u5b8b': 'Luzon',
    '\u8d8a\u5357': 'Vietnam',
    '\u4e2d\u90e8\u9ad8\u539f': 'Central highlands',
    '\u7802\u62c9\u8d8a': 'Sarawak',
    '\u6fb3\u6d32': 'Australia',
    '\u6606\u58eb\u862d': 'Queensland',
    '\u8607\u9580\u7b54\u81e8': 'Sumatra',
    '\u5df4\u897f': 'Brazil',
    '\u4e9e\u99ac\u905c': 'Amazonia',
    '\u4f4e\u6d77\u62d4': 'Lowland plains',
    '\u6771\u90e8\u4f4e\u5c71': 'Eastern foothills',
    '\u4e2d\u90e8\u5c71\u5340': 'Central mountains',
    '\u6771\u5357\u4e9e': 'Southeast Asia',
    '\u4f4e\u5730\u96e8\u6797': 'Lowland rainforest',
    '\u5317\u90e8\u68ee\u6797': 'Northern forest',
    '\u9ad8\u96c4': 'Kaohsiung',
    '\u82b1\u84ee': 'Hualien',
    '\u68ee\u6797': 'Forest',
    '\u54e5\u65af\u5927\u9ece\u52a0': 'Costa Rica',
    '\u5854\u62c9\u66fc\u5361': 'Talamanca',
    '\u79d8\u9b6f': 'Peru',
    '\u6469\u9e7f\u52a0\u7fa4\u5cf6': 'Moluccas',
    '\u6771\u90e8\u96e8\u6797': 'Eastern rainforest',
    '\u5df4\u62ff\u99ac': 'Panama',
    '\u6b50\u6d32': 'Europe',
    '\u6eab\u5e36\u6797\u8fb9\u7de3': 'Temperate forest margin',
    '\u52a0\u91cc\u66fc\u4e39': 'Kalimantan',
    '\u81fa\u7063': 'Taiwan',
    '\u9670\u6fd5\u5ca9\u58c1': 'Shaded rock face',
    '\u5927\u5c6b\u5c71\u6e7f\u5730': 'Datun Mountain wetland',
    '\u4e2d\u570b': 'China',
    '\u5167\u8499\u53e4': 'Inner Mongolia',
    '\u4e2d\u570b \u00b7 \u5167\u8499\u53e4': 'China \u00b7 Inner Mongolia',
    '\u99ac\u9054\u52a0\u65af\u52a0': 'Madagascar',
    '\u99ac\u54c8\u8d0a\u52a0': 'Mahajanga',
    '\u99ac\u9054\u52a0\u65af\u52a0 \u00b7 \u99ac\u54c8\u8d0a\u52a0': 'Madagascar \u00b7 Mahajanga',
    '\u81fa\u5357\u5de6\u93ae': 'Tainan, Zuozhen',
    '\u81fa\u7063 \u00b7 \u81fa\u5357\u5de6\u93ae': 'Taiwan \u00b7 Tainan, Zuozhen',
    '\u9867\u9109\u5c6f\u7d44': 'Guxiangtun Formation',
    '\u7518\u8085\u81e8\u590f\u548c\u653f': 'Hezheng, Linxia, Gansu',
    '\u4e2d\u570b \u00b7 \u7518\u8085\u81e8\u590f\u548c\u653f': 'China \u00b7 Hezheng, Linxia, Gansu',
    '\u6d59\u6c5f\u897f\u5929\u76ee\u5c71': 'Zhejiang West Tianmu',
    '\u4f4e\u6d77\u62d4\u6eaa\u8c37': 'Lowland ravine',
    '\u5357\u7f8e\u6d32': 'South America',
    '\u539f\u7522\u5730': 'Native range',
    '\u6c60\u5858\u6e7f\u5730': 'Pond wetland',
    '\u99ac\u4f86\u897f\u4e9e\u5c71': 'Sabah highlands',
    '\u4f4e\u6d77\u62d4\u6797\u4e0b': 'Lowland understory',
    '\u65e5\u672c': 'Japan',
    '\u6eab\u5e36\u91dd\u8449\u6797': 'Temperate conifer forest',
    '\u71b1\u5e36\u9644\u751f\u6809\u6885': 'Tropical epiphytic tree',
    '\u5167\u8499\u53e4\u5df4\u4e39\u6e56\u7fa4': 'Inner Mongolia Bayan Mandahu',
    '\u7f85\u99ac\u5c3c\u4e9e': 'Romania',
    '\u54c8\u5922\u5cf6': 'Ha\u021beg Island',
    '\u963f\u6839\u5ef7': 'Argentina',
    '\u5167\u70cf\u6839': 'Neuqu\u00e9n',
    '\u82f1\u570b': 'United Kingdom',
    '\u5a01\u723e\u65af': 'Wales',
    '\u7f8e\u570b': 'United States',
    '\u79d1\u7f85\u62c9\u591a\u83ab\u91cc\u68ee': 'Colorado Morrison',
    '\u8499\u53e4': 'Mongolia',
    '\u6208\u58c1': 'Gobi',
    '\u6771\u6208\u58c1': 'East Gobi',
    '\u5317\u7968': 'Beipiao',
    '\u5efa\u660c': 'Jianchang',
    '\u585e\u5f6d\u62c9\u5fb7': 'Seppenrade',
    '\u5f17\u6797\u5fb7\u65af': 'Flinders Ranges',
    '\u61f7\u4fc4\u660e': 'Wyoming',
    '\u5be7\u57ce': 'Ningcheng',
    '\u897f\u73ed\u7259': 'Spain',
    '\u8056\u5df4\u5df4\u62c9': 'Santa Barbara',
    '\u907c\u5be7\u671d\u967d': 'Liaoning Jehol',
    '\u5357\u6208\u58c1': 'South Gobi',
    '\u65b0\u58a8\u897f\u54e5': 'New Mexico',
    '\u5c71\u6771\u8af8\u57ce': 'Shandong Zhucheng',
    '\u52a0\u62ff\u5927': 'Canada',
    '\u4f2f\u683c\u65af\u987d\u9875\u5ca9': 'Burgess Shale',
    '\u5357\u975e': 'South Africa',
    '\u4e09\u758a\u7d00\u9678\u5730': 'Triassic Karoo',
    '\u827e\u7565\u7279\u7d44': 'Elliot Formation',
    '\u57c3\u723e\u91d1': 'Elgin',
    '\u6c83\u7279\u76e7': 'Waterloo Farm',
    '\u7d10\u7d04\u5409\u723e\u535a': 'Gilboa, New York',
    '\u85a9\u5361\u6885\u7d0d': 'Sakamena',
    '\u4fc4\u4ea5\u4fc4': 'Ohio',
    '\u6d2a\u65af\u5442\u514b': 'Hunsr\u00fcck',
    '\u4e18\u5e03\u7279': 'Chubut',
    '\u51cc\u6e90': 'Lingyuan',
    '\u5361\u9b6f': 'Karoo',
    '\u683c\u96f7\u8305\u65af': 'Greymouth',
    '\u4fc4\u7f85\u65af': 'Russia',
    '\u8056\u5f7c\u5f97\u5821': 'Saint Petersburg',
    '\u4f0a\u5229\u8afe\u4f0a': 'Illinois',
    '\u96f2\u5357': 'Yunnan',
    '\u99ac\u57c3\u74e6\u8afe': 'Maevarano',
    '\u5091\u8c9d\u52d2\u5967\u6cd5\u7279': 'Jebel Ofatn',
    '\u5e03\u91cc\u5947\u6ce2\u7279': 'Bridgeport',
    '\u6f84\u6c5f': 'Chengjiang',
    '\u856d\u5bfa\u5821': 'Xiaoshiba',
    '\u5df4\u5229\u535a\u7d0d': 'Vallibona',
    '\u897f\u5357\u6d77\u5cb8': 'Southwest coast',
    '\u767d\u57a9\u7d00\u6d77\u76ca\u5730': 'Cretaceous seafloor',
    '\u6fb3\u5927\u5229\u4e9e': 'Australia',
    '\u57c3\u8fea\u5361\u7d00': 'Ediacaran',
    '\u65b0\u897f\u862d': 'New Zealand',
    '\u5357\u5cf6\u5c71\u8108': 'Southern Alps',
    '\u6ce5\u76c6\u7d00\u6d77\u76ca\u5730': 'Devonian seafloor',
    '\u6469\u6d1b\u54e5': 'Morocco',
    '\u963f\u7279\u62c9\u65af\u5c71\u8108': 'Anti-Atlas',
    '\u8607\u683c\u862d': 'Scotland',
    '\u5967\u9676\u7d00': 'Ordovician',
    '\u99ac\u9054\u52a0\u65af\u52a0': 'Madagascar',
    '\u99ac\u9054\u52a0\u65af\u6eaa\u8c37': 'Maevarano Formation',
    '\u745e\u5178': 'Sweden',
    '\u54e5\u5f97\u862d\u5cf6': 'Gotland',
    '\u5317\u6d77\u9053': 'Hokkaido',
    '\u91cc\u5f17\u65af\u5229': 'Riversleigh',
    '\u6606\u58eb\u862d\u91cc\u5f17\u65af\u5229': 'Queensland, Riversleigh',
    '\u9ed1\u9f8d\u6c5f\u9867\u9109\u5c6f\u7d44': 'Heilongjiang, Guxiangtun Formation',
    '\u907c\u5be7\u5317\u7968': 'Liaoning, Beipiao',
    '\u907c\u5be7\u5efa\u660c': 'Liaoning, Jianchang',
    '\u907c\u5be7\u51cc\u6e90': 'Liaoning, Lingyuan',
    '\u5167\u8499\u53e4\u5be7\u57ce': 'Inner Mongolia, Ningcheng',
    '\u96f2\u5357\u856d\u5bfa\u5821': 'Xiaoshiba, Yunnan',
    '\u5fb7\u5dde\u5e03\u91cc\u5947\u6ce2\u7279': 'Bridgeport, Texas',
    '\u672c\u5dde': 'Honshu',
    '\u5b89\u7b2c\u65af': 'Andes',
    '\u54e5\u502b\u6bd4\u4e9e': 'Colombia',
    '\u9ed1\u9f8d\u6c5f': 'Heilongjiang',
    '\u51f1\u59c6\u51f1\u59c6': 'Kem Kem',
    '\u6d2a\u65af\u514b\u6ce5\u76c6\u7d00': 'Hunsr\u00fcck Slate',
    '\u6377\u514b': 'Czech Republic',
    '\u6ce2\u5e0c\u7c73\u4e9e': 'Bohemia',
    '\u77f3\u70ad\u7d00': 'Carboniferous',
    '\u6771\u90e8\u5c71\u5340': 'Eastern mountains',
    '\u9739\u9742': 'Perak',
    '\u9732\u7c73\u4e9e': 'Perak',
    '\u99ac\u4f86\u897f\u4e9e\u30fb\u9739\u9742': 'Perak, Malaysia',
    '\u99ac\u4f86\u897f\u4e9e\u30fb\u9732\u7c73\u4e9e': 'Perak, Malaysia',
    '\u99ac\u4f86\u897f\u4e9e \u00b7 \u9739\u9742': 'Malaysia \u00b7 Perak',
    '\u99ac\u4f86\u897f\u4e9e \u00b7 \u9732\u7c73\u4e9e': 'Malaysia \u00b7 Perak',
    '\u81fa\u7063\u30fb\u5357\u6295': 'Nantou, Taiwan',
    '\u81fa\u7063 \u00b7 \u5357\u6295': 'Taiwan \u00b7 Nantou',
    'Jebel Ofatn': 'Jebel Ofatn',
    '\u53cd\u963f\u7279\u62c9\u65af': 'Anti-Atlas',
    '\u897f\u6e56\u9109\u91d1\u77f3\u6751\u9f8d\u6d1e\u6eaa': 'Jinshi Village, Xihu Township, Longdong Creek',
    '\u6469\u6d1b\u54e5 \u00b7 Jebel Ofatn': 'Morocco \u00b7 Jebel Ofatn',
    '\u6469\u6d1b\u54e5 \u00b7 \u53cd\u963f\u7279\u62c9\u65af': 'Morocco \u00b7 Anti-Atlas',
    '\u81fa\u7063 \u00b7 \u897f\u6e56\u9109\u91d1\u77f3\u6751\u9f8d\u6d1e\u6eaa': 'Taiwan \u00b7 Jinshi Village, Xihu Township, Longdong Creek',
    '\u7dec\u7538': 'Myanmar',
    '\u5fb7\u5dde': 'Texas',
    '\u7f8e\u570b \u00b7 \u5fb7\u5dde Bridgeport': 'United States \u00b7 Bridgeport, Texas',
    '\u65f1\u751f\u6797': 'dry forest',
    '\u4e7e\u65f1\u704c\u53e2': 'arid scrub',
    '\u5167\u9678\u6c99\u5730': 'inland sand',
    '\u6ab3\u57ce': 'Penang',
    '\u4f4e\u5730\u6c34\u57df': 'lowland waters',
    '\u7409\u7403': 'Ryukyu Islands',
    '\u6cb3\u5ddd': 'river',
    '\u5df4\u57fa\u65af\u5766': 'Pakistan',
    '\u65f1\u5730\u5ca9\u5340': 'arid rock',
    '\u5927\u5e73\u539f': 'Great Plains',
    '\u758f\u6797': 'open woodland',
    '\u67ec\u57d4\u5be8': 'Cambodia',
    '\u5433\u54e5\u7a9f': 'Angkor Wat',
    '\u65b0\u5580\u91cc\u591a\u5c3c\u4e9e': 'New Caledonia',
    '\u96e8\u6797': 'rainforest',
    '\u5927\u897f\u6d0b\u6cbf\u5cb8': 'Atlantic coast'
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
    var whole = String(raw).trim();
    if (whole === 'Mcurator lab') return whole;
    if (LOCALITY_GEO_EN[whole]) return LOCALITY_GEO_EN[whole];
    return whole.split(/[\u00b7\u30fb]/).map(function (part) {
      return translateLocalityPart_(part.trim());
    }).join(' \u00b7 ');
  }

  function originLocaleTable() {
    var lang = getLang();
    if (lang === 'zh-TW') return window.MC_I18N_ORIGIN_ZH || null;
    if (lang === 'ja-JP') return window.MC_I18N_ORIGIN_JA || null;
    if (lang === 'de-DE') return window.MC_I18N_ORIGIN_DE || null;
    return window.MC_I18N_ORIGIN_EN || null;
  }

  function originText(key, fallback) {
    var table = originLocaleTable();
    if (key && table && table[key]) return table[key];
    return fallback || '';
  }

  function displayLocality(specimen) {
    if (!specimen) return '\u2014';
    if (specimen.localityKey) {
      var namedPlace = originText(specimen.localityKey, specimen.locality || '');
      if (namedPlace) return namedPlace;
    }
    var raw = verifiedLocalityForSlug(specimen.slug || specimen.id, specimen.locality);
    if (specimen.category === 'microbiology' || String(raw).trim() === 'Mcurator lab') return 'Mcurator lab';
    if (isZh()) return raw;
    var en = translateLocality(raw);
    if (isJa()) return applyPlaceNames(en, PLACE_JA);
    if (isDe()) return applyPlaceNames(en, PLACE_DE);
    return en;
  }

  var PLACE_DE = {
    'Locality not recorded': 'Fundort nicht erfasst',
    'United States': 'Vereinigte Staaten',
    'United Kingdom': 'Vereinigtes K\u00f6nigreich',
    'South Africa': 'S\u00fcdafrika',
    'South America': 'S\u00fcdamerika',
    'New Zealand': 'Neuseeland',
    'Czech Republic': 'Tschechien',
    'Inner Mongolia': 'Innere Mongolei',
    'Saint Petersburg': 'Sankt Petersburg',
    'Germany': 'Deutschland',
    'Madagascar': 'Madagaskar',
    'Morocco': 'Marokko',
    'Australia': 'Australien',
    'Spain': 'Spanien',
    'Argentina': 'Argentinien',
    'Mongolia': 'Mongolei',
    'Romania': 'Rum\u00e4nien',
    'Canada': 'Kanada',
    'Sweden': 'Schweden',
    'Brazil': 'Brasilien',
    'Russia': 'Russland',
    'Philippines': 'Philippinen',
    'Indonesia': 'Indonesien',
    'Europe': 'Europa',
    'China': 'China',
    'Japan': 'Japan',
    'Taiwan': 'Taiwan',
    'Thailand': 'Thailand',
    'Vietnam': 'Vietnam',
    'Malaysia': 'Malaysia',
    'Myanmar': 'Myanmar',
    'Chile': 'Chile',
    'Ecuador': 'Ecuador',
    'Peru': 'Peru',
    'Colombia': 'Kolumbien',
    'Nepal': 'Nepal',
    'Andes': 'Anden',
    'Honshu': 'Honshu',
    'DR Congo': 'Demokratische Republik Kongo'
  };

  var PLACE_JA = {
    'Locality not recorded': '\u7523\u5730\u672a\u8a18\u9332',
    'United States': '\u30a2\u30e1\u30ea\u30ab',
    'United Kingdom': '\u30a4\u30ae\u30ea\u30b9',
    'South Africa': '\u5357\u30a2\u30d5\u30ea\u30ab',
    'South America': '\u5357\u30a2\u30e1\u30ea\u30ab',
    'New Zealand': '\u30cb\u30e5\u30fc\u30b8\u30fc\u30e9\u30f3\u30c9',
    'Czech Republic': '\u30c1\u30a7\u30b3',
    'Inner Mongolia': '\u5185\u30e2\u30f3\u30b4\u30eb',
    'Saint Petersburg': '\u30b5\u30f3\u30af\u30c8\u30da\u30c6\u30eb\u30d6\u30eb\u30af',
    'Germany': '\u30c9\u30a4\u30c4',
    'China': '\u4e2d\u56fd',
    'Madagascar': '\u30de\u30c0\u30ac\u30b9\u30ab\u30eb',
    'Morocco': '\u30e2\u30ed\u30c3\u30b3',
    'Australia': '\u30aa\u30fc\u30b9\u30c8\u30e9\u30ea\u30a2',
    'Spain': '\u30b9\u30da\u30a4\u30f3',
    'Argentina': '\u30a2\u30eb\u30bc\u30f3\u30c1\u30f3',
    'Mongolia': '\u30e2\u30f3\u30b4\u30eb',
    'Romania': '\u30eb\u30fc\u30de\u30cb\u30a2',
    'Canada': '\u30ab\u30ca\u30c0',
    'Sweden': '\u30b9\u30a6\u30a7\u30fc\u30c7\u30f3',
    'Brazil': '\u30d6\u30e9\u30b8\u30eb',
    'Russia': '\u30ed\u30b7\u30a2',
    'Japan': '\u65e5\u672c',
    'Taiwan': '\u53f0\u6e7e',
    'Malaysia': '\u30de\u30ec\u30fc\u30b7\u30a2',
    'Indonesia': '\u30a4\u30f3\u30c9\u30cd\u30b7\u30a2',
    'Thailand': '\u30bf\u30a4',
    'Vietnam': '\u30d9\u30c8\u30ca\u30e0',
    'Philippines': '\u30d5\u30a3\u30ea\u30d4\u30f3',
    'Myanmar': '\u30df\u30e3\u30f3\u30de\u30fc',
    'Europe': '\u30e8\u30fc\u30ed\u30c3\u30d1',
    'Peru': '\u30da\u30eb\u30fc',
    'Chile': '\u30c1\u30ea',
    'Ecuador': '\u30a8\u30af\u30a2\u30c9\u30eb',
    'Costa Rica': '\u30b3\u30b9\u30bf\u30ea\u30ab',
    'Panama': '\u30d1\u30ca\u30de',
    'Nepal': '\u30cd\u30d1\u30fc\u30eb',
    'Colombia': '\u30b3\u30ed\u30f3\u30d3\u30a2',
    'Andes': '\u30a2\u30f3\u30c7\u30b9',
    'Honshu': '\u672c\u5dde',
    'DR Congo': '\u30b3\u30f3\u30b4\u6c11\u4e3b\u5171\u548c\u56fd'
  };

  function applyPlaceNames(text, table) {
    var keys = Object.keys(table).sort(function (a, b) { return b.length - a.length; });
    keys.forEach(function (key) {
      if (text.indexOf(key) >= 0) text = text.split(key).join(table[key]);
    });
    return text;
  }

  function provLabel(zh, en) {
    return L(zh, en);
  }

  function localizeVisibility(value) {
    if (!value) return value;
    var map = {
      '\u7a00\u6709': L('\u7a00\u6709', 'Rare'),
      '\u9650\u7814\u7a76\u53ef\u898b': L('\u9650\u7814\u7a76\u53ef\u898b', 'Research visibility'),
      '\u535a\u7269\u9928\u6578\u4f4d\u5178\u85cf': L('\u535a\u7269\u9928\u6578\u4f4d\u5178\u85cf', 'Museum digital collection'),
      '\u516c\u958b': L('\u516c\u958b', 'Public'),
      '\u9928\u5167': L('\u9928\u5167', 'In-house'),
      '\u79c1\u6709': L('\u79c1\u6709', 'Private'),
      Rare: L('\u7a00\u6709', 'Rare'),
      'Research visibility': L('\u9650\u7814\u7a76\u53ef\u898b', 'Research visibility')
    };
    return map[value] || value;
  }

  function scientificNameFromFilename(filename) {
    var base = String(filename || '').replace(/\.[^.]+$/, '').trim();
    base = base.replace(/\.+$/, '').replace(/\s+/g, ' ').trim();
    base = base.replace(/\s+[A-Z][A-Za-z.-]*(?:\s+(?:&|et al\.?)\s+[A-Z][A-Za-z.-]*)?\s*,?\s*\d{4}.*$/, '').trim();
    if (base && !/[\s]/.test(base) && /[-_]/.test(base)) {
      var parts = base.split(/[-_]+/).filter(Boolean);
      if (parts.length >= 2) {
        return parts
          .map(function (part, index) {
            part = part.toLowerCase();
            return index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part;
          })
          .join(' ');
      }
    }
    return base;
  }

  function scientificNameFromImagePath(path) {
    var name = String(path || '').split('/').pop() || String(path || '');
    return scientificNameFromFilename(name);
  }

  function resolveCoverflowImageUrl(path) {
    path = String(path || '').trim();
    if (!path) return '';
    if (/^https?:\/\//i.test(path) || path.indexOf('data:') === 0) return path;
    if (path.indexOf('../') === 0) return path;
    if (/^(assets|workflow-)/.test(path)) return '../' + path;
    return path;
  }

  function coverflowCardDataToSpecimen(data) {
    data = data || {};
    var imagePath = resolveCoverflowImageUrl(data.image || data.coverImage || data.thumbUrl || '');
    var sci =
      String(data.scientificName || data.title || '').trim() ||
      scientificNameFromImagePath(imagePath) ||
      '\u2014';
    var mc = data.mc || data.museumNo || data.number || data.catalogNumber || '';
    return {
      id: data.sourceSpecimenId || data.id || '',
      mc: mc,
      scientificName: sci,
      commonName: data.commonName || data.common || '',
      taxon: data.taxon || data.type || '',
      taxonomy: data.taxonomy || '',
      category: data.specimenCategory || data.workflowCategory || (data.category === 'plant' ? 'botany' : data.category) || 'entomology',
      locality: data.locality || data.origin || '',
      date: data.date || '',
      collector: data.collector || '',
      visibility: data.visibility || data.visibilityLabel || '',
      image: imagePath,
    };
  }

  function coverflowVisibilityLabel(specimen, verified) {
    if (specimen && specimen.visibility) return localizeVisibility(specimen.visibility);
    if (verified) return L('\u9650\u7814\u7a76\u53ef\u898b', 'Research visibility');
    return L('\u672a\u8a2d\u5b9a', 'Not set');
  }

  function renderPassportCoverflowCard(data) {
    data = data || {};
    var specimen = coverflowCardDataToSpecimen(data);
    var verified =
      data.statusKey === 'verified' ||
      data.status === '\u5df2\u6838' ||
      data.verificationStatus === 'verified';
    var progress =
      typeof data.progress === 'number'
        ? data.progress
        : typeof data.completionPct === 'number'
          ? data.completionPct
          : 74;
    progress = Math.max(0, Math.min(100, Math.round(progress)));
    var satIssued = verified || !!(data.id && String(data.id).indexOf('SAT-MC-') === 0 && data.id !== 'SAT-MC-000000');
    var satLine = satIssued ? formatSatLine(data.id || data.satId || 'SAT-MC-000507', false) : formatSatLine('', true);
    var reviewBadge = verified ? L('\u5df2\u5be9\u6838', 'Reviewed') : L('\u672a\u5be9\u6838', 'Not reviewed');
    var statusBadge = verified ? L('\u5df2\u5be9', 'OK') : L('\u672a\u5be9', '\u2014');
    var reviewLabel = reviewBadge;
    var exportLine = verified || progress >= 100 ? L('\u53ef\u8ffd\u6eaf\u532f\u51fa', 'traceable export') : L('\u5f85\u532f\u51fa', 'export pending');
    var metaRows = [
      ['locality', L('\u7522\u5730', 'Locality'), escapeHtml(displayLocality(specimen))],
      ['date', L('\u65e5\u671f', 'Date'), escapeHtml(displayDate(specimen))],
      ['collector', L('\u63a1\u96c6\u8005', 'Collector'), escapeHtml(displayCollector(specimen))],
      ['visibility', L('\u662f\u5426\u516c\u958b', 'Visibility'), escapeHtml(coverflowVisibilityLabel(specimen, verified))],
    ];
    var metaGrid =
      '<dl class="mc-passport-card__meta">' +
      metaRows
        .map(function (row) {
          return '<div data-meta="' + row[0] + '"' + (row[0] === 'date' && isZh() ? ' lang="zh-Hant"' : '') + '><dt>' + row[1] + '</dt><dd>' + row[2] + '</dd></div>';
        })
        .join('') +
      '</dl>';
    var photoClasses =
      'mc-passport-card__photo mc-passport-card__photo--catalog mc-passport-card__photo--specimen-panel' +
      (specimen.image ? ' has-photo' : '') +
      (photoFillsFrame(specimen) ? ' is-photo-cover' : '');
    var photoFigure = specimen.image
      ? '<figure class="' +
        photoClasses +
        '"><span class="mc-passport-card__photo-panel"><img src="' +
        escapeHtml(displayCutoutSrc(specimen)) +
        '"' + cutoutImgAttrs(specimen) + ' alt="' +
        escapeHtml(specimen.scientificName) +
        '" loading="eager" decoding="async" class="is-photo-loaded"></span></figure>'
      : '<figure class="' +
        photoClasses +
        '"><span class="mc-passport-card__photo-panel"><img src="" alt="" loading="lazy" decoding="async" /></span></figure>';
    var body =
      '<div class="mc-passport-card__body">' +
      '<header class="mc-passport-card__head">' +
      '<span class="mc-passport-card__review">' +
      reviewBadge +
      '</span>' +
      '<div class="mc-passport-card__headActions">' +
      '<span class="mc-passport-card__reviewMini">' +
      statusBadge +
      '</span>' +
      '<span class="mc-passport-card__netBadge" aria-hidden="true">N</span>' +
      '</div></header>' +
      '<div class="mc-passport-card__ids">' +
      '<p class="mc-passport-card__mcId">' +
      formatMcDisplay(specimen.mc, false) +
      '</p>' +
      '<p class="mc-passport-card__sat' +
      (satIssued ? ' is-ready' : '') +
      '">' +
      satLine +
      '</p></div>' +
      photoFigure +
      '<div class="mc-passport-card__nameplate">' +
      '<span class="mc-passport-card__taxon">' +
      escapeHtml(taxonGenus(specimen)) +
      '</span>' +
      '<h2 class="mc-passport-card__sci">' +
      escapeHtml(specimen.scientificName) +
      '</h2>' +
      '<p class="mc-passport-card__common">' +
      escapeHtml(displayCommonName(specimen)) +
      '</p></div>' +
      metaGrid +
      '<footer class="mc-passport-card__footer">' +
      '<div class="mc-passport-card__progress">' +
      '<span class="mc-passport-card__progressPct">' +
      L('\u5b8c\u6210\u5ea6 ', 'Completeness ') +
      '<strong>' +
      progress +
      '%</strong></span>' +
      '<em class="mc-passport-card__progressNote">' +
      reviewLabel +
      '</em>' +
      '<div class="mc-passport-card__bar" role="progressbar" aria-valuenow="' +
      progress +
      '" aria-valuemin="0" aria-valuemax="100">' +
      '<span style="width:' +
      progress +
      '%;"></span></div></div>' +
      '<p class="mc-passport-card__exportLine">QR \u2022 CSV \u2022 JSON  \u2014  ' +
      exportLine +
      '</p>' +
      '<p class="mc-passport-card__catalog">' +
      registryFooter(specimen, false) +
      '</p></footer></div>';
    var html =
      '<div class="mc-workflow-screenshot-rebuild mc-passport-coverflow-host">' +
      '<article class="mc-passport-card mc-passport-card--workflow mc-passport-card--coverflow is-revealed' +
      (verified ? ' is-verified' : '') +
      '">' +
      '<div class="mc-passport-card__face mc-passport-card__face--front">' +
      body +
      '</div></article></div>';
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstChild;
  }

  function botanyCommonName(scientificName) {
    var zhMap = {
      'Adiantum capillus-veneris': '\u9435\u7dda\u8568',
      'Drosera spp.': '\u8305\u818f\u83dc',
      'Drosera spp': '\u8305\u818f\u83dc',
      'Ginkgo biloba': '\u9280\u674f',
      'Koelreuteria elegans': '\u81fa\u7063\u6b12\u6a39',
      'Mimosa pudica': '\u542b\u7b9e\u8349',
      'Nelumbo nucifera': '\u84ee',
      'Nepenthes spp.': '\u8c6c\u7c60\u8349',
      'Nepenthes spp': '\u8c6c\u7c60\u8349',
      'Nephrolepis cordifolia': '\u814e\u8568',
      'Pinus spp.': '\u677e',
      'Pinus spp': '\u677e',
      'Platycerium spp.': '\u9e7f\u89d2\u8568',
      'Platycerium spp': '\u9e7f\u89d2\u8568'
    };
    var jaMap = {
      'Adiantum capillus-veneris': '\u30db\u30a6\u30e9\u30a4\u30b7\u30c0',
      'Drosera spp.': '\u30e2\u30a6\u30bb\u30f3\u30b4\u30b1',
      'Drosera spp': '\u30e2\u30a6\u30bb\u30f3\u30b4\u30b1',
      'Ginkgo biloba': '\u30a4\u30c1\u30e7\u30a6',
      'Koelreuteria elegans': '\u30bf\u30a4\u30ef\u30f3\u30e2\u30af\u30b2\u30f3\u30b8',
      'Mimosa pudica': '\u30aa\u30b8\u30ae\u30bd\u30a6',
      'Nelumbo nucifera': '\u30cf\u30b9',
      'Nepenthes spp.': '\u30a6\u30c4\u30dc\u30ab\u30ba\u30e9',
      'Nepenthes spp': '\u30a6\u30c4\u30dc\u30ab\u30ba\u30e9',
      'Nephrolepis cordifolia': '\u30bf\u30de\u30b7\u30c0',
      'Pinus spp.': '\u30de\u30c4',
      'Pinus spp': '\u30de\u30c4',
      'Platycerium spp.': '\u30d3\u30ab\u30af\u30b7\u30c0',
      'Platycerium spp': '\u30d3\u30ab\u30af\u30b7\u30c0'
    };
    var deMap = {
      'Adiantum capillus-veneris': 'Frauenhaarfarn',
      'Drosera spp.': 'Sonnentau',
      'Drosera spp': 'Sonnentau',
      'Ginkgo biloba': 'Ginkgo',
      'Koelreuteria elegans': 'Taiwanesische Blasenesche',
      'Mimosa pudica': 'Sinnpflanze',
      'Nelumbo nucifera': 'Lotos',
      'Nepenthes spp.': 'Kannenpflanze',
      'Nepenthes spp': 'Kannenpflanze',
      'Nephrolepis cordifolia': 'Knollen-Schwertfarn',
      'Pinus spp.': 'Kiefer',
      'Pinus spp': 'Kiefer',
      'Platycerium spp.': 'Geweihfarn',
      'Platycerium spp': 'Geweihfarn'
    };
    var enMap = {
      'Adiantum capillus-veneris': 'Maidenhair fern',
      'Drosera spp.': 'Sundew',
      'Drosera spp': 'Sundew',
      'Ginkgo biloba': 'Ginkgo',
      'Koelreuteria elegans': 'Flamegold',
      'Mimosa pudica': 'Sensitive plant',
      'Nelumbo nucifera': 'Sacred lotus',
      'Nepenthes spp.': 'Pitcher plant',
      'Nepenthes spp': 'Pitcher plant',
      'Nephrolepis cordifolia': 'Tuberous sword fern',
      'Pinus spp.': 'Pine',
      'Pinus spp': 'Pine',
      'Platycerium spp.': 'Staghorn fern',
      'Platycerium spp': 'Staghorn fern'
    };
    if (isZh()) return zhMap[scientificName] || scientificName;
    if (isJa()) return jaMap[scientificName] || enMap[scientificName] || scientificName;
    if (isDe()) return deMap[scientificName] || enMap[scientificName] || scientificName;
    return enMap[scientificName] || scientificName;
  }

  function zoologyCommonName(specimen) {
    var zh = {
      'zoology-paroedura-picta': '\u8c79\u7d0b\u5730\u5b88\u5bae',
      'zoology-nephrurus-levis': '\u5e73\u6ed1\u7624\u5c3e\u5b88\u5bae',
      'zoology-nephrurus-levis-2': '\u5e73\u6ed1\u7624\u5c3e\u5b88\u5bae',
      'zoology-varanus-salvator-penang': '\u6fa4\u5de8\u8725\uff08\u5e7c\u9ad4\uff09',
      'zoology-varanus-salvator-thailand': '\u6fa4\u5de8\u8725',
      'zoology-cuora-flavomarginata': '\u9ec3\u7de3\u9589\u6bbc\u9f9c',
      'zoology-eublepharis-macularius': '\u8c79\u7d0b\u5b88\u5bae',
      'zoology-cynomys-ludovicianus': '\u9ed1\u5c3e\u571f\u64a5\u9f20',
      'zoology-megaceryle-lugubris-pallida': '\u51a0\u9b5a\u72d7',
      'zoology-petaurus-breviceps': '\u871c\u888b\u9f2c',
      'zoology-polypedates-megacephalus': '\u5927\u982d\u6a39\u86d9',
      'zoology-rhacodactylus-leachianus': '\u65b0\u5580\u91cc\u591a\u5c3c\u4e9e\u5de8\u5b88\u5bae',
      'zoology-tarentola-chazaliae': '\u76d4\u982d\u58c1\u864e'
    };
    var ja = {
      'zoology-paroedura-picta': '\u30aa\u30bb\u30ed\u30c3\u30c8\u30e4\u30e2\u30ea',
      'zoology-nephrurus-levis': '\u30b9\u30d9\u30b9\u30d9\u30ce\u30d6\u30aa\u30c8\u30ab\u30b2',
      'zoology-nephrurus-levis-2': '\u30b9\u30d9\u30b9\u30d9\u30ce\u30d6\u30aa\u30c8\u30ab\u30b2',
      'zoology-varanus-salvator-penang': '\u30df\u30ba\u30aa\u30aa\u30c8\u30ab\u30b2\uff08\u5e7c\u4f53\uff09',
      'zoology-varanus-salvator-thailand': '\u30df\u30ba\u30aa\u30aa\u30c8\u30ab\u30b2',
      'zoology-cuora-flavomarginata': '\u30bb\u30de\u30eb\u30cf\u30b3\u30ac\u30e1',
      'zoology-eublepharis-macularius': '\u30d2\u30e7\u30a6\u30e2\u30f3\u30c8\u30ab\u30b2\u30e2\u30c9\u30ad',
      'zoology-cynomys-ludovicianus': '\u30aa\u30b0\u30ed\u30d7\u30ec\u30fc\u30ea\u30fc\u30c9\u30c3\u30b0',
      'zoology-megaceryle-lugubris-pallida': '\u30e4\u30de\u30bb\u30df',
      'zoology-petaurus-breviceps': '\u30d5\u30af\u30ed\u30e2\u30e2\u30f3\u30ac',
      'zoology-polypedates-megacephalus': '\u30aa\u30aa\u30a2\u30bf\u30de\u30a2\u30aa\u30ac\u30a8\u30eb',
      'zoology-rhacodactylus-leachianus': '\u30c4\u30ae\u30aa\u30df\u30ab\u30c9\u30e4\u30e2\u30ea',
      'zoology-tarentola-chazaliae': '\u30d8\u30eb\u30e1\u30c3\u30c8\u30e4\u30e2\u30ea'
    };
    var de = {
      'zoology-paroedura-picta': 'Ozelotgecko',
      'zoology-nephrurus-levis': 'Glatter Knopfschwanzgecko',
      'zoology-nephrurus-levis-2': 'Glatter Knopfschwanzgecko',
      'zoology-varanus-salvator-penang': 'Bindenwaran (Jungtier)',
      'zoology-varanus-salvator-thailand': 'Bindenwaran',
      'zoology-cuora-flavomarginata': 'Gelbrand-Scharnierschildkr\u00f6te',
      'zoology-eublepharis-macularius': 'Leopardgecko',
      'zoology-cynomys-ludovicianus': 'Schwarzschwanz-Pr\u00e4riehund',
      'zoology-megaceryle-lugubris-pallida': 'Riesenfischer',
      'zoology-petaurus-breviceps': 'Kurzkopf-Gleitbeutler',
      'zoology-polypedates-megacephalus': 'Hongkong-Peitschenfrosch',
      'zoology-rhacodactylus-leachianus': 'Neukaledonischer Riesengecko',
      'zoology-tarentola-chazaliae': 'Helmgecko'
    };
    var id = specimen && specimen.id;
    if (isZh()) return zh[id] || specimen.commonName || specimen.scientificName;
    if (isJa()) return ja[id] || specimen.commonName || specimen.scientificName;
    if (isDe()) return de[id] || specimen.commonName || specimen.scientificName;
    return specimen.commonName || specimen.scientificName;
  }

  function entomologyCommonName(specimen) {
    var sci = specimen && specimen.scientificName;
    var zh = {
      'Allotopus moellenkampi babai': '\u5df4\u62dc\u5de8\u6241\u936c\u5f62\u87f2',
      'Ampedus sp.': '\u53e9\u982d\u87f2',
      'Cheirotonus jansoni': '\u9577\u81c2\u91d1\u9f9c',
      'Cyclommatus metallifer': '\u7d30\u8eab\u8d64\u936c\u5f62\u87f2',
      'Chiasognathus grantii': '\u667a\u5229\u936c\u5f62\u87f2',
      'Hexarthrius mandibularis': '\u5927\u984e\u936c\u5f62\u87f2',
      'Dynastes neptunus': '\u6d77\u795e\u5927\u515c\u87f2',
      'Lucanus cervus': '\u6b50\u6d32\u6df1\u5c71\u936c\u5f62\u87f2',
      'Mesotopus tarandus': '\u975e\u6d32\u9577\u7259\u936c\u5f62\u87f2',
      'Odontolabis dalmanni intermedia': '\u9054\u6c0f\u9b3c\u8c54\u936c\u5f62\u87f2',
      'Odontolabis lacordairei': '\u62c9\u79d1\u5cb1\u9b3c\u8c54\u936c\u5f62\u87f2',
      'Prosopocoilus lafertei': '\u62c9\u8cbb\u6cf0\u92f8\u936c\u5f62\u87f2',
      'Phalacrognathus muelleri': '\u5f69\u8679\u936c\u5f62\u87f2',
      'Prosopocoilus kannegieteri': '\u80af\u5c3c\u5409\u92f8\u936c\u5f62\u87f2',
      'Sphaenognathus feisthamelii': '\u8cbb\u6c0f\u5b89\u7b2c\u65af\u936c\u5f62\u87f2',
      'Kaniska canace': '\u7409\u7483\u86ea\u8776',
      'Borbo cinnara': '\u55ae\u5e36\u5f04\u8776',
      'Graphium antiphates': '\u5bec\u5e36\u9752\u9cf3\u8776',
      'Acytolepis puspa myla': '\u7409\u7483\u7070\u8776',
      'Heliophorus ila matsumurae': '\u53f0\u7063\u7d2b\u65e5\u7070\u8776',
      'Graphium agamemnon': '\u6728\u862d\u9752\u9cf3\u8776',
      'Polyura athamas': '\u7a84\u5e36\u7fe0\u86ea\u8776',
      'Athyma selenophora': '\u7384\u73e0\u5e36\u86ea\u8776',
      'Chrysina chrysargirea': '\u91d1\u7da0\u5bf6\u77f3\u91d1\u9f9c',
      'Paraponera clavata': '\u5b50\u5f48\u87fb',
      'Ixorida venerea': '\u8607\u62c9\u5a01\u897f\u82b1\u91d1\u9f9c',
      'Dorcus ternatensis': '\u7279\u7d0d\u7279\u936c\u5f62\u87f2',
      'Brachysiderus quadrimaculatus': '\u56db\u6591\u9e97\u91d1\u9f9c',
      'Aegus acuminatus acuminatus': '\u5c16\u984e\u936c\u5f62\u87f2',
      'Aegus parallelus': '\u5e73\u884c\u5c16\u984e\u936c\u5f62\u87f2',
      'Chrysina victorina': '\u7dad\u591a\u8389\u5a1c\u5bf6\u77f3\u91d1\u9f9c',
      'Pseudoscortizus incredibilis': '\u79d8\u9b6f\u5947\u936c\u5f62\u87f2',
      'Aesalus imanishii': '\u4eca\u897f\u9ed1\u8c54\u936c\u5f62\u87f2',
      'Hexarthrius parryi': '\u5e15\u745e\u9577\u984e\u936c\u5f62\u87f2',
      'Xylotrupes pubescens': '\u6bdb\u515c\u87f2',
      'Dorcus alcides': '\u963f\u723e\u57fa\u5fb7\u65af\u6241\u936c\u5f62\u87f2'
    };
    var ja = {
      'Kaniska canace': '\u30eb\u30ea\u30bf\u30c6\u30cf',
      'Borbo cinnara': '\u30bf\u30a4\u30ef\u30f3\u30a4\u30c1\u30e2\u30f3\u30b8\u30bb\u30bb\u30ea',
      'Graphium antiphates': '\u30b4\u30b7\u30ad\u30a2\u30b2\u30cf',
      'Acytolepis puspa myla': '\u30bf\u30a4\u30ef\u30f3\u30eb\u30ea\u30b7\u30b8\u30df',
      'Heliophorus ila matsumurae': '\u30e0\u30e9\u30b5\u30ad\u30b7\u30b8\u30df',
      'Graphium agamemnon': '\u30a2\u30ac\u30e1\u30e0\u30ce\u30f3\u30a2\u30b2\u30cf',
      'Polyura athamas': '\u30c4\u30de\u30d9\u30cb\u30b8\u30e3\u30ce\u30e1',
      'Athyma selenophora': '\u30b2\u30f3\u30b8\u30e5\u30b8\u30df\u30bf\u30c6\u30cf',
      'Lucanus cervus': '\u30e8\u30fc\u30ed\u30c3\u30d1\u30af\u30ef\u30ac\u30bf',
      'Phalacrognathus muelleri': '\u30cb\u30b8\u30a4\u30ed\u30af\u30ef\u30ac\u30bf',
      'Dynastes neptunus': '\u30cd\u30d7\u30c1\u30e5\u30fc\u30f3\u30aa\u30aa\u30ab\u30d6\u30c8',
      'Paraponera clavata': '\u30d2\u30a2\u30ea\u30a2\u30ea',
      'Chiasognathus grantii': '\u30c0\u30fc\u30a6\u30a3\u30f3\u30af\u30ef\u30ac\u30bf',
      'Cyclommatus metallifer': '\u30e1\u30bf\u30ea\u30d5\u30a7\u30eb\u30db\u30bd\u30a2\u30ab\u30df\u30ad\u30ea'
    };
    var de = {
      'Kaniska canace': 'Blauer Admiral',
      'Lucanus cervus': 'Hirschk\u00e4fer',
      'Phalacrognathus muelleri': 'Regenbogen-Hirschk\u00e4fer',
      'Dynastes neptunus': 'Neptunk\u00e4fer',
      'Paraponera clavata': '24-Stunden-Ameise',
      'Chiasognathus grantii': 'Darwins Hirschk\u00e4fer',
      'Cheirotonus jansoni': 'Jansons Langarmk\u00e4fer',
      'Ampedus sp.': 'Schnellk\u00e4fer'
    };
    if (isZh()) return (sci && zh[sci]) || (specimen && specimen.commonName) || sci || '';
    if (isJa()) return (sci && ja[sci]) || (specimen && specimen.commonName) || sci || '';
    if (isDe()) return (sci && de[sci]) || (specimen && specimen.commonName) || sci || '';
    return (specimen && specimen.commonName) || sci || '';
  }

  function displayCommonName(specimen) {
    if (!specimen) return L('\u4fd7\u540d', 'Common name');
    if (specimen.nameKey) {
      var named = originText(specimen.nameKey, specimen.commonName || '');
      if (named) return named;
    }
    if (specimen.category === 'botany') return botanyCommonName(specimen.scientificName);
    if (specimen.category === 'zoology') return zoologyCommonName(specimen);
    if (specimen.category === 'microbiology') return microbiologyCommonName(specimen);
    if (specimen.category === 'entomology') return entomologyCommonName(specimen);
    if (specimen.category === 'dinopedia') return dinopediaCommonName(specimen);
    if (specimen.category === 'paleontology') return paleontologyCommonName(specimen.scientificName);
    return specimen.commonName || specimen.scientificName || L('\u4fd7\u540d', 'Common name');
  }

  function microbiologyCommonName(specimen) {
    var id = specimen && specimen.id;
    var zh = {
      'microbiology-chlamydomonas-reinhardtii': '\u840a\u8335\u8863\u85fb',
      'microbiology-staphylococcus-aureus': '\u91d1\u9ec3\u8272\u8461\u8404\u7403\u83cc',
      'microbiology-euglena-gracilis': '\u7e96\u7d30\u773c\u87f2',
      'microbiology-volvox-carteri': '\u5718\u85fb',
      'microbiology-aspergillus-niger': '\u9ed1\u9eb4\u9ef4',
      'microbiology-bacillus-subtilis': '\u67af\u8349\u687f\u83cc',
      'microbiology-escherichia-coli': '\u5927\u8178\u687f\u83cc',
      'microbiology-paramecium-caudatum': '\u5c3e\u8349\u5c65\u87f2',
      'microbiology-nostoc-commune': '\u5730\u6728\u8033',
      'microbiology-saccharomyces-cerevisiae': '\u91c0\u9152\u9175\u6bcd'
    };
    var ja = {
      'microbiology-chlamydomonas-reinhardtii': '\u30b3\u30ca\u30df\u30c9\u30ea\u30e0\u30b7',
      'microbiology-staphylococcus-aureus': '\u9ec4\u8272\u30d6\u30c9\u30a6\u7403\u83cc',
      'microbiology-euglena-gracilis': '\u30df\u30c9\u30ea\u30e0\u30b7',
      'microbiology-volvox-carteri': '\u30dc\u30eb\u30dc\u30c3\u30af\u30b9',
      'microbiology-aspergillus-niger': '\u30af\u30ed\u30b3\u30a6\u30b8\u30ab\u30d3',
      'microbiology-bacillus-subtilis': '\u67af\u8349\u83cc',
      'microbiology-escherichia-coli': '\u5927\u8178\u83cc',
      'microbiology-paramecium-caudatum': '\u30be\u30a6\u30ea\u30e0\u30b7',
      'microbiology-nostoc-commune': '\u30a4\u30b7\u30af\u30e9\u30b2',
      'microbiology-saccharomyces-cerevisiae': '\u51fa\u82bd\u9175\u6bcd'
    };
    var de = {
      'microbiology-chlamydomonas-reinhardtii': 'Gr\u00fcnalge',
      'microbiology-staphylococcus-aureus': 'Goldgelber Staphylokokkus',
      'microbiology-euglena-gracilis': 'Augentierchen',
      'microbiology-volvox-carteri': 'Volvox',
      'microbiology-aspergillus-niger': 'Schwarzschimmel',
      'microbiology-bacillus-subtilis': 'Heubazillus',
      'microbiology-escherichia-coli': 'Escherichia coli',
      'microbiology-paramecium-caudatum': 'Pantoffeltierchen',
      'microbiology-nostoc-commune': 'Nostoc',
      'microbiology-saccharomyces-cerevisiae': 'Backhefe'
    };
    if (id && zh[id]) {
      if (isZh()) return zh[id];
      if (isJa()) return ja[id];
      if (isDe()) return de[id];
      return specimen.commonName || specimen.scientificName;
    }
    if (isZh()) return '\u5fae\u751f\u7269\uff08\u672a\u9451\u5b9a\uff09';
    if (isJa()) return '\u5fae\u751f\u7269\uff08\u672a\u540c\u5b9a\uff09';
    if (isDe()) return 'Mikroorganismus (unbestimmt)';
    return 'Microbe (unidentified)';
  }

  function displayDate(specimen) {
    if (!specimen) return '\u2014';
    if (specimen.formedKey) {
      var formed = originText(specimen.formedKey, '');
      if (formed) return formed;
    }
    if (!specimen.date) return '\u2014';
    var geoFn =
      (typeof window !== 'undefined' && typeof window.mcTranslateGeologicalDate === 'function'
        ? window.mcTranslateGeologicalDate
        : null) ||
      (typeof global !== 'undefined' && typeof global.mcTranslateGeologicalDate === 'function'
        ? global.mcTranslateGeologicalDate
        : null);
    if (geoFn) return geoFn(specimen.date);
    if (isZh()) return specimen.date;
    return specimen.date;
  }

  function displayCollector(specimen) {
    var raw = specimen && specimen.collector ? String(specimen.collector).trim() : '';
    if (!raw) return '\u2014';
    var roles = {
      'Museum digitization': ['\u9928\u65b9\u6578\u4f4d\u5316', 'Museum digitization', '\u9928\u306e\u30c7\u30b8\u30bf\u30eb\u5316', 'Museumsdigitalisierung'],
      'Herbarium digitization': ['\u6a19\u672c\u9928\u6578\u4f4d\u5316', 'Herbarium digitization', '\u6a19\u672c\u9928\u306e\u30c7\u30b8\u30bf\u30eb\u5316', 'Herbariumdigitalisierung'],
      'Field collection team': ['\u91ce\u5916\u63a1\u96c6\u7d44', 'Field collection team', '\u91ce\u5916\u63a1\u96c6\u30c1\u30fc\u30e0', 'Feldteam'],
      'Living collection team': ['\u6d3b\u9ad4\u8490\u85cf\u7d44', 'Living collection team', '\u751f\u4f53\u30b3\u30ec\u30af\u30b7\u30e7\u30f3', 'Lebendsammlung'],
      'Research collection': ['\u7814\u7a76\u8490\u85cf', 'Research collection', '\u7814\u7a76\u30b3\u30ec\u30af\u30b7\u30e7\u30f3', 'Forschungssammlung'],
      'Field documentation': ['\u91ce\u5916\u8a18\u9304', 'Field documentation', '\u91ce\u5916\u8a18\u9332', 'Felddokumentation'],
      'Liaoning field survey': ['\u907c\u5be7\u91ce\u5916\u8abf\u67e5', 'Liaoning field survey', '\u907c\u5be7\u91ce\u5916\u8abf\u67fb', 'Gel\u00e4ndeaufnahme Liaoning'],
      'Gobi expedition archive': ['\u6208\u58c1\u8003\u5bdf\u6a94\u6848', 'Gobi expedition archive', '\u30b4\u30d3\u8abf\u67fb\u30a2\u30fc\u30ab\u30a4\u30d6', 'Gobi-Expeditionsarchiv'],
      'Winter habitat documentation': ['\u51ac\u5b63\u68f2\u606f\u5730\u8a18\u9304', 'Winter habitat documentation', '\u51ac\u671f\u306e\u751f\u606f\u5730\u8a18\u9332', 'Winterhabitat-Dokumentation'],
      'Shandong paleo reconstruction': ['\u5c71\u6771\u53e4\u751f\u7269\u5fa9\u539f', 'Shandong paleo reconstruction', '\u5c71\u6771\u306e\u53e4\u751f\u7269\u5fa9\u5143', 'Shandong-Rekonstruktion'],
      'Ha\u021beg Basin survey': ['\u54c8\u6cf0\u683c\u76c6\u5730\u8abf\u67e5', 'Ha\u021beg Basin survey', '\u30cf\u30c6\u30b0\u76c6\u5730\u8abf\u67fb', 'Ha\u021beg-Becken'],
      'Burgess Shale archive': ['\u4f2f\u5409\u65af\u9801\u5ca9\u6a94\u6848', 'Burgess Shale archive', '\u30d0\u30fc\u30b8\u30a7\u30b9\u9801\u5ca9\u30a2\u30fc\u30ab\u30a4\u30d6', 'Burgess-Schiefer-Archiv'],
      'Chengjiang archive': ['\u6f84\u6c5f\u6a94\u6848', 'Chengjiang archive', '\u6f84\u6c5f\u30a2\u30fc\u30ab\u30a4\u30d6', 'Chengjiang-Archiv'],
      'Karoo survey': ['\u5361\u9b6f\u8abf\u67e5', 'Karoo survey', '\u30ab\u30eb\u30fc\u8abf\u67fb', 'Karoo-Aufnahme'],
      'Rainforest Field Unit': ['\u96e8\u6797\u91ce\u5916\u7d44', 'Rainforest Field Unit', '\u71b1\u5e2f\u96e8\u6797\u30c1\u30fc\u30e0', 'Regenwald-Feldteam'],
      'Island Biodiversity Archive': ['\u5cf6\u5dbc\u751f\u7269\u591a\u6a23\u6027\u6a94\u6848', 'Island Biodiversity Archive', '\u5cf6\u5d8b\u306e\u751f\u7269\u591a\u69d8\u6027\u30a2\u30fc\u30ab\u30a4\u30d6', 'Insel-Biodiversit\u00e4tsarchiv'],
      'North Borneo Plate Archive': ['\u5317\u5a46\u7f85\u677f\u584a\u6a94\u6848', 'North Borneo Plate Archive', '\u5317\u30dc\u30eb\u30cd\u30aa\u30d7\u30ec\u30fc\u30c8\u30a2\u30fc\u30ab\u30a4\u30d6', 'Nordborneo-Plattenarchiv'],
      'Lin Mei-hua': ['\u6797\u7f8e\u83ef', 'Lin Mei-hua', '\u30ea\u30f3\u30fb\u30e1\u30a4\u30d5\u30a1', 'Lin Mei-hua'],
      'Chen Yu': ['\u9673\u745c', 'Chen Yu', '\u30c1\u30a7\u30f3\u30fb\u30e6\u30fc', 'Chen Yu']
    };
    var row = roles[raw];
    if (!row) return raw;
    if (isZh()) return row[0];
    if (isJa()) return row[2];
    if (isDe()) return row[3];
    return row[1];
  }

  function botanySpecimenFromHero(entry, overrides) {
    overrides = overrides || {};
    var genus = String(entry.sci.split(/\s+/)[0] || 'Plant').replace(/[^A-Za-z]/g, '');
    return {
      id: overrides.id || entry.id,
      category: 'botany',
      mc: overrides.mc || entry.mc || 'MC - B64101',
      scientificName: entry.sci,
      commonName: entry.common || botanyCommonName(entry.sci),
      image: entry.image || (entry.imageLocal ? WORKFLOW_PLANT_IMAGE_BASE + entry.slug + '.png' : PLANT_HERO_IMAGE_BASE + entry.slug + '.png'),
      taxon: entry.taxon || (genus ? genus.toUpperCase() : 'PLANTAE'),
      taxonomy: entry.taxonomy || ('Plantae \u2192 Tracheophyta \u2192 Magnoliopsida \u2192 ' + genus + ' \u2192 ' + entry.sci),
      date: entry.date || '2023/11/08',
      collector: entry.collector || 'Herbarium digitization',
      locality: verifiedLocalityForSlug(entry.slug, entry.locality)
    };
  }

  var BOTANY_HERO_SPECIMENS = [
    { id: 'botany-adiantum-capillus-veneris', slug: 'adiantum-capillus-veneris', sci: 'Adiantum capillus-veneris', common: '\u9435\u7dda\u8568', taxon: 'ADIANTUM', mc: 'MC - B64101', date: '2023/04/18', collector: 'Herbarium digitization' },
    { id: 'botany-drosera-spp', slug: 'drosera-spp', sci: 'Drosera spp.', common: '\u8305\u818f\u83dc', taxon: 'DROSERA', mc: 'MC - B64102', date: '2022/07/11', collector: 'Field collection team' },
    { id: 'botany-ginkgo-biloba', slug: 'ginkgo-biloba', sci: 'Ginkgo biloba', common: '\u9280\u674f', taxon: 'GINKGO', mc: 'MC - B64103', date: '2021/10/05', collector: 'Museum digitization' },
    { id: 'botany-koelreuteria-elegans', slug: 'koelreuteria-elegans', sci: 'Koelreuteria elegans', common: '\u81fa\u7063\u6b12\u6a39', taxon: 'KOELREUTERIA', mc: 'MC - B64104', date: '2023/06/22', collector: 'Lin Mei-hua' },
    { id: 'botany-mimosa-pudica', slug: 'mimosa-pudica', sci: 'Mimosa pudica', common: '\u542b\u7b9e\u8349', taxon: 'MIMOSA', mc: 'MC - B64105', date: '2020/03/14', collector: 'Herbarium digitization' },
    { id: 'botany-nelumbo-nucifera', slug: 'nelumbo-nucifera', sci: 'Nelumbo nucifera', common: '\u84ee', taxon: 'NELUMBO', mc: 'MC - B64106', date: '2022/08/30', collector: 'Chen Yu' },
    { id: 'botany-nepenthes-spp', slug: 'nepenthes-spp', sci: 'Nepenthes spp.', common: '\u8c6c\u7c60\u8349', taxon: 'NEPENTHES', mc: 'MC - B64107', date: '2019/05/18', collector: 'Research collection' },
    { id: 'botany-nephrolepis-cordifolia', slug: 'nephrolepis-cordifolia', sci: 'Nephrolepis cordifolia', common: '\u814e\u8568', taxon: 'NEPHROLEPIS', mc: 'MC - B64108', date: '2023/11/08', collector: 'Herbarium digitization' },
    { id: 'botany-pinus-spp', slug: 'pinus-spp', sci: 'Pinus spp.', common: '\u677e', taxon: 'PINUS', mc: 'MC - B64109', date: '2024/02/16', collector: 'Herbarium digitization', taxonomy: 'Plantae \u2192 Tracheophyta \u2192 Pinopsida \u2192 Pinales \u2192 Pinaceae \u2192 Pinus \u2192 Pinus spp.' },
    { id: 'botany-platycerium-spp', slug: 'platycerium-spp', sci: 'Platycerium spp.', common: '\u9e7f\u89d2\u8568', taxon: 'PLATYCERIUM', mc: 'MC - B64110', date: '2023/09/04', collector: 'Living collection team', taxonomy: 'Plantae \u2192 Polypodiopsida \u2192 Polypodiaceae \u2192 Platycerium \u2192 Platycerium spp.' }
  ];

  var botanySpecimens = BOTANY_HERO_SPECIMENS.map(function (entry) {
    return botanySpecimenFromHero(entry, { id: entry.id, mc: entry.mc });
  });

  var botanySpecimenDefault = botanySpecimens[0];

  function dinopediaCommonName(scientificNameOrSpecimen) {
    var specimen = scientificNameOrSpecimen && scientificNameOrSpecimen.scientificName ? scientificNameOrSpecimen : null;
    var scientificName = specimen ? specimen.scientificName : scientificNameOrSpecimen;
    var id = specimen && specimen.id;
    var en = {
      'Linhenykus monodactylus': 'Linhenykus',
      'Balaur bondoc': 'Balaur',
      'Eoabelisaurus mefi': 'Eoabelisaurus',
      'Eocursor parvus': 'Eocursor',
      'Stegosaurus stenops': 'Stegosaurus',
      'Tarbosaurus bataar': 'Tarbosaurus',
      'Vallibonavenatrix cani': 'Vallibonavenatrix',
      'Ambopteryx longibrachium': 'Ambopteryx',
      'Yutyrannus huali': 'Yutyrannus',
      'Yamaceratops dorngobiensis': 'Yamaceratops',
      'Zhenyuanlong suni': 'Zhenyuanlong',
      'Zalmoxes robustus': 'Zalmoxes',
      'Zuniceratops christopheri': 'Zuniceratops',
      'Zhuchengtyrannus magnus': 'Zhuchengtyrannus'
    };
    var zh = {
      'Linhenykus monodactylus': '\u81e8\u6cb3\u722a\u9f8d',
      'Balaur bondoc': '\u5df4\u62c9\u70cf\u723e\u9f8d',
      'Eoabelisaurus mefi': '\u59cb\u963f\u8c9d\u529b\u9f8d',
      'Eocursor parvus': '\u59cb\u5954\u9f8d',
      'Stegosaurus stenops': '\u528d\u9f8d',
      'Tarbosaurus bataar': '\u7279\u66b4\u9f8d',
      'Vallibonavenatrix cani': '\u74e6\u5229\u535a\u7d0d\u5973\u7375\u9f8d',
      'Ambopteryx longibrachium': '\u5947\u7ffc\u9f8d',
      'Yutyrannus huali': '\u83ef\u9e97\u7fbd\u738b\u9f8d',
      'Yamaceratops dorngobiensis': '\u95bb\u738b\u89d2\u9f8d',
      'Zhenyuanlong suni': '\u632f\u5143\u9f8d',
      'Zalmoxes robustus': '\u67e5\u6469\u897f\u65af\u9f8d',
      'Zuniceratops christopheri': '\u7956\u5c3c\u89d2\u9f8d',
      'Zhuchengtyrannus magnus': '\u8af8\u57ce\u66b4\u9f8d'
    };
    var ja = {
      'Stegosaurus stenops': '\u30b9\u30c6\u30b4\u30b5\u30a6\u30eb\u30b9',
      'Tarbosaurus bataar': '\u30bf\u30eb\u30dc\u30b5\u30a6\u30eb\u30b9',
      'Yutyrannus huali': '\u30e6\u30a6\u30c6\u30a3\u30e9\u30cc\u30b9',
      'Zhuchengtyrannus magnus': '\u30b8\u30e5\u30c1\u30a7\u30f3\u30c6\u30a3\u30e9\u30f3\u30cc\u30b9',
      'Ambopteryx longibrachium': '\u30a2\u30f3\u30dc\u30d7\u30c6\u30ea\u30af\u30b9',
      'Zhenyuanlong suni': '\u30b8\u30a7\u30f3\u30e6\u30a2\u30f3\u30ed\u30f3'
    };
    var de = {
      'Yutyrannus huali': 'Gefiederter Tyrannosaurier',
      'Stegosaurus stenops': 'Stegosaurus',
      'Tarbosaurus bataar': 'Tarbosaurus'
    };
    if (id === 'dinopedia-yutyrannus-huali-pack') {
      if (isZh()) return '\u83ef\u9e97\u7fbd\u738b\u9f8d\uff08\u7fa4\uff09';
      if (isJa()) return '\u30e6\u30a6\u30c6\u30a3\u30e9\u30cc\u30b9\uff08\u7fa4\uff09';
      if (isDe()) return 'Yutyrannus (Rudel)';
      return 'Yutyrannus (pack)';
    }
    if (isZh() && zh[scientificName]) return zh[scientificName];
    if (isJa() && ja[scientificName]) return ja[scientificName];
    if (isDe() && de[scientificName]) return de[scientificName];
    return en[scientificName] || scientificName;
  }

  function dinopediaSpecimenFromHero(entry, overrides) {
    overrides = overrides || {};
    var genus = String(entry.sci.split(/\s+/)[0] || 'Dinosaur').replace(/[^A-Za-z]/g, '');
    return {
      id: overrides.id || entry.id,
      category: 'dinopedia',
      mc: overrides.mc || entry.mc || 'MC - D64101',
      scientificName: entry.sci,
      commonName: entry.common || dinopediaCommonName(entry.sci),
      image: DINO_HERO_IMAGE_BASE + entry.slug + '.png',
      taxon: entry.taxon || (genus ? genus.toUpperCase() : 'DINOSAURIA'),
      taxonomy: entry.taxonomy || ('Animalia \u2192 Chordata \u2192 Dinosauria \u2192 ' + genus + ' \u2192 ' + entry.sci),
      date: entry.date || '2024/03/18',
      collector: entry.collector || 'Lin Mei-hua',
      locality: verifiedLocalityForSlug(entry.slug, entry.locality)
    };
  }

  var DINOPEDIA_HERO_SPECIMENS = [
    { id: 'dinopedia-linhenykus-monodactylus', slug: 'linhenykus-monodactylus', sci: 'Linhenykus monodactylus', common: 'Linhenykus', taxon: 'LINHENYKUS', mc: 'MC - D64101', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization' },
    { id: 'dinopedia-balaur-bondoc', slug: 'balaur-bondoc', sci: 'Balaur bondoc', common: 'Balaur', taxon: 'BALAUR', mc: 'MC - D64102', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization' },
    { id: 'dinopedia-eoabelisaurus-mefi', slug: 'eoabelisaurus-mefi', sci: 'Eoabelisaurus mefi', common: 'Eoabelisaurus', taxon: 'EOABELISAURUS', mc: 'MC - D64103', date: '\u4f8f\u7f85\u7d00\u4e2d\u671f', collector: 'Research collection' },
    { id: 'dinopedia-eocursor-parvus', slug: 'eocursor-parvus', sci: 'Eocursor parvus', common: 'Eocursor', taxon: 'EOCURSOR', mc: 'MC - D64104', date: '\u4e09\u758a\u7d00\u665a\u671f', collector: 'Museum digitization' },
    { id: 'dinopedia-stegosaurus-stenops', slug: 'stegosaurus-stenops', sci: 'Stegosaurus stenops', common: 'Stegosaurus', taxon: 'STEGOSAURUS', mc: 'MC - D64105', date: '\u4f8f\u7f85\u7d00\u665a\u671f\u83ab\u91cc\u68ee', collector: 'Museum digitization' },
    { id: 'dinopedia-tarbosaurus-bataar', slug: 'tarbosaurus-bataar', sci: 'Tarbosaurus bataar', common: 'Tarbosaurus', taxon: 'TARBOSAURUS', mc: 'MC - D64106', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Field collection team' },
    { id: 'dinopedia-vallibonavenatrix-cani', slug: 'vallibonavenatrix-cani', sci: 'Vallibonavenatrix cani', common: 'Vallibonavenatrix', taxon: 'VALLIBONAVENATRIX', mc: 'MC - D64107', date: '\u767d\u57a9\u7d00\u65e9\u671f', collector: 'Museum digitization' },
    { id: 'dinopedia-ambopteryx-longibrachium', slug: 'ambopteryx-longibrachium', sci: 'Ambopteryx longibrachium', common: 'Ambopteryx', taxon: 'AMBOPTERYX', mc: 'MC - D64108', date: '\u4f8f\u7f85\u7d00\u665a\u671f', collector: 'Research collection' },
    { id: 'dinopedia-yutyrannus-huali', slug: 'yutyrannus-huali', sci: 'Yutyrannus huali', common: 'Feathered tyrannosaur', taxon: 'YUTYRANNUS', mc: 'MC - D64109', date: '\u767d\u57a9\u7d00\u65e9\u671f', collector: 'Liaoning field survey' },
    { id: 'dinopedia-yamaceratops-dorngobiensis', slug: 'yamaceratops-dorngobiensis', sci: 'Yamaceratops dorngobiensis', common: 'Yamaceratops', taxon: 'YAMACERATOPS', mc: 'MC - D64110', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Gobi expedition archive' },
    { id: 'dinopedia-yutyrannus-huali-pack', slug: 'yutyrannus-huali-pack', sci: 'Yutyrannus huali', common: 'Yutyrannus (pack)', taxon: 'YUTYRANNUS', mc: 'MC - D64111', date: '\u767d\u57a9\u7d00\u65e9\u671f', collector: 'Winter habitat documentation' },
    { id: 'dinopedia-zhenyuanlong-suni', slug: 'zhenyuanlong-suni', sci: 'Zhenyuanlong suni', common: 'Zhenyuanlong', taxon: 'ZHENYUANLONG', mc: 'MC - D64112', date: '\u767d\u57a9\u7d00\u65e9\u671f', collector: 'Research collection' },
    { id: 'dinopedia-zalmoxes-robustus', slug: 'zalmoxes-robustus', sci: 'Zalmoxes robustus', common: 'Zalmoxes', taxon: 'ZALMOXES', mc: 'MC - D64113', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Ha\u021beg Basin survey' },
    { id: 'dinopedia-zuniceratops-christopheri', slug: 'zuniceratops-christopheri', sci: 'Zuniceratops christopheri', common: 'Zuniceratops', taxon: 'ZUNICERATOPS', mc: 'MC - D64114', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization' },
    { id: 'dinopedia-zhuchengtyrannus-magnus', slug: 'zhuchengtyrannus-magnus', sci: 'Zhuchengtyrannus magnus', common: 'Zhuchengtyrannus', taxon: 'ZHUCHENGTYRANNUS', mc: 'MC - D64115', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Shandong paleo reconstruction' }
  ];

  var dinopediaSpecimens = DINOPEDIA_HERO_SPECIMENS.map(function (entry) {
    return dinopediaSpecimenFromHero(entry, { id: entry.id, mc: entry.mc });
  });

  var dinopediaSpecimenDefault = dinopediaSpecimens[0];

  function paleontologyCommonName(scientificName) {
    var map = {
      'Wiwaxia corrugata': 'Wiwaxia',
      'Yohoia tenuis': 'Yohoia',
      'Peytoia nathorsti': 'Peytoia',
      'Ovatiovermis cribratus': 'Ovatiovermis',
      'Cardiodictyon catenulatum': 'Cardiodictyon',
      'Proterosuchus fergusi': 'Proterosuchus',
      'Hyperodapedon gordoni': 'Hyperodapedon',
      'Pseudocarcinus karlraubenheimeri': 'Giant crab',
      'Parapuzosia seppenradensis': 'Giant ammonite',
      'Dickinsonia costata': 'Dickinsonia',
      'Hieraaetus moorei': "Haast's eagle",
      'Caryosyntrips serratus': 'Caryosyntrips',
      'Dunkleosteus terrelli': 'Dunkleosteus',
      'Collinsium ciliosum': 'Collinsium',
      'Titanichthys agassizii': 'Titanichthys',
      'Priscomyzon riniensis': 'Priscomyzon',
      'Naraoia compacta': 'Naraoia',
      'Attercopus fimbriunguis': 'Attercopus',
      'Gerastos granulosus': 'Gerastos',
      'Scaphechinus mirabilis': 'Scaphechinus',
      'Calymene sp.': 'Calymene',
      'Coleoptera indet.': 'Coleoptera',
      'Insecta indet.': 'Insecta',
      'Mosasauroidea sp.': 'Mosasauroidea',
      'Spinosaurus aegyptiacus': 'Spinosaurus',
      'Borealosuchus sternbergii': 'Borealosuchus',
      'Lophophyllidium plummeri': 'Lophophyllidium',
      'Globidens sp.': 'Globidens',
      'Hemipristis serra': 'Snaggletooth shark',
      'Ammonoidea indet.': 'Goniatite',
      'Diodon sigma': 'Porcupinefish'
    };
    var zh = {
      'Hemipristis serra': '\u92f8\u9f52\u9b5a',
      'Ammonoidea indet.': '\u8179\u83ca\u77f3',
      'Diodon sigma': '\u523a\u9b69',
      'Dunkleosteus terrelli': '\u9127\u6c0f\u9b5a',
      'Pseudocarcinus karlraubenheimeri': '\u64ec\u5de8\u87f9',
      'Parapuzosia seppenradensis': '\u5de8\u578b\u83ca\u77f3',
      'Hieraaetus moorei': '\u54c8\u65af\u7279\u9df9',
      'Peytoia nathorsti': '\u4f69\u6258\u8766',
      'Spinosaurus aegyptiacus': '\u68d8\u9f8d',
      'Borealosuchus sternbergii': '\u5317\u65b9\u9c31',
      'Dickinsonia costata': '\u72c4\u66f4\u905c\u87f2',
      'Naraoia compacta': '\u7d0d\u7f85\u87f2'
    };
    var ja = {
      'Dunkleosteus terrelli': '\u30c0\u30f3\u30af\u30eb\u30aa\u30b9\u30c6\u30a6\u30b9',
      'Spinosaurus aegyptiacus': '\u30b9\u30d4\u30ce\u30b5\u30a6\u30eb\u30b9',
      'Hieraaetus moorei': '\u30cf\u30fc\u30b9\u30c8\u30ef\u30b7',
      'Peytoia nathorsti': '\u30da\u30a4\u30c8\u30a4\u30a2'
    };
    var de = {
      'Dunkleosteus terrelli': 'Dunkleosteus',
      'Pseudocarcinus karlraubenheimeri': 'Riesenkrabbe',
      'Parapuzosia seppenradensis': 'Riesenammonit',
      'Hieraaetus moorei': 'Haastadler',
      'Peytoia nathorsti': 'Peytoia',
      'Spinosaurus aegyptiacus': 'Spinosaurus'
    };
    if (isZh() && zh[scientificName]) return zh[scientificName];
    if (isJa() && ja[scientificName]) return ja[scientificName];
    if (isDe() && de[scientificName]) return de[scientificName];
    return map[scientificName] || scientificName;
  }

  function paleontologySpecimenFromHero(entry, overrides) {
    overrides = overrides || {};
    var genus = String(entry.sci.split(/\s+/)[0] || 'Fossil').replace(/[^A-Za-z]/g, '');
    return {
      id: overrides.id || entry.id,
      category: 'paleontology',
      mc: overrides.mc || entry.mc || 'MC - F10550',
      scientificName: entry.sci,
      commonName: entry.common || paleontologyCommonName(entry.sci),
      image: entry.image || (entry.imageLocal ? WORKFLOW_PALEO_IMAGE_BASE + entry.slug + '.png' : FOSSIL_HERO_IMAGE_BASE + entry.slug + '.png'),
      taxon: entry.taxon || (genus ? genus.toUpperCase() : 'FOSSIL'),
      taxonomy: entry.taxonomy || ('Animalia \u2192 Paleobiota \u2192 ' + genus + ' \u2192 ' + entry.sci),
      date: entry.date || '\u5730\u8cea\u6a19\u672c',
      collector: entry.collector || 'Museum digitization',
      locality: entry.locality || verifiedLocalityForSlug(entry.slug, entry.locality),
      mediaKind: entry.mediaKind || (entry.imageLocal ? 'restoration' : 'fossil'),
      cutout: !!entry.cutout,
      rail: entry.rail || '',
      nameKey: entry.nameKey || '',
      localityKey: entry.localityKey || '',
      formedKey: entry.formedKey || '',
      eraKey: entry.eraKey || '',
      country: entry.country || '',
      region: entry.region || '',
      town: entry.town || '',
      restoration: entry.restoration || ''
    };
  }

  var PALEO_RIGHT_RAIL_TOP_FOSSILS = [
    { id: 'paleo-hemipristis-serra', slug: 'hemipristis-serra', sci: 'Hemipristis serra', common: 'Snaggletooth shark', taxon: 'HEMIPRISTIS', mc: 'MC - F10601', collector: 'Museum digitization', eraKey: 'pleistocene', formedKey: 'wf_field_pleistocene_age', nameKey: 'wf_field_hemipristis_name', localityKey: 'wf_field_hemipristis_place', locality: 'Zuozhen, Tainan, Taiwan', country: 'Taiwan', region: 'Tainan', town: 'Zuozhen', image: WORKFLOW_PALEO_IMAGE_BASE + 'hemipristis-serra.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'hemipristis-serra-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Chordata \u2192 Chondrichthyes \u2192 Carcharhiniformes \u2192 Hemigaleidae \u2192 Hemipristis \u2192 Hemipristis serra' },
    { id: 'paleo-ammonoidea-indet-goniatites-morocco', slug: 'ammonoidea-indet-goniatites-morocco', sci: 'Ammonoidea indet.', common: 'Goniatite', taxon: 'AMMONOIDEA', mc: 'MC - F10602', collector: 'Museum digitization', eraKey: 'devonian-middle', formedKey: 'wf_field_devonian_middle_age', nameKey: 'wf_field_goniatite_name', localityKey: 'wf_field_goniatite_place', locality: 'Morocco', country: 'Morocco', region: 'Morocco', town: 'Morocco', image: WORKFLOW_PALEO_IMAGE_BASE + 'ammonoidea-indet-goniatites-morocco.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'ammonoidea-indet-goniatites-morocco-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Mollusca \u2192 Cephalopoda \u2192 Ammonoidea \u2192 Goniatitida \u2192 Ammonoidea indet.' },
    { id: 'paleo-diodon-sigma', slug: 'diodon-sigma', sci: 'Diodon sigma', common: 'Porcupinefish', taxon: 'DIODON', mc: 'MC - F10603', collector: 'Museum digitization', eraKey: 'miocene', formedKey: 'wf_field_miocene_age', nameKey: 'wf_field_diodon_name', localityKey: 'wf_field_diodon_place', locality: 'Java, Indonesia', country: 'Indonesia', region: 'Java', town: 'Java', image: WORKFLOW_PALEO_IMAGE_BASE + 'diodon-sigma.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'diodon-sigma-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Chordata \u2192 Actinopterygii \u2192 Tetraodontiformes \u2192 Diodontidae \u2192 Diodon \u2192 Diodon sigma' },
    { id: 'paleo-dastilbe-sp', slug: 'dastilbe-sp', sci: 'Dastilbe sp.', common: 'Dastilbe', taxon: 'DASTILBE', mc: 'MC - F10595', collector: 'Museum digitization', eraKey: 'cretaceous-early', formedKey: 'wf_field_early_cretaceous_age', nameKey: 'wf_field_dastilbe_name', localityKey: 'wf_field_dastilbe_place', locality: 'Brazil', country: 'Brazil', region: 'Brazil', town: 'Brazil', image: WORKFLOW_PALEO_IMAGE_BASE + 'dastilbe-sp.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'dastilbe-sp-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Chordata \u2192 Actinopterygii \u2192 Gonorynchiformes \u2192 Chanidae \u2192 Dastilbe \u2192 Dastilbe sp.' },
    { id: 'paleo-shuraboprosbole-minuta-a', slug: 'shuraboprosbole-minuta-a', sci: 'Shuraboprosbole minuta', common: 'Shuraboprosbole', taxon: 'SHURABOPROSBOLE', mc: 'MC - F10596', collector: 'Museum digitization', eraKey: 'jurassic-late', formedKey: 'wf_field_late_jurassic_age', nameKey: 'wf_field_shuraboprosbole_name', localityKey: 'wf_field_weichang_place', locality: 'Weichang Manchu and Mongolian Autonomous County, Hebei, China', country: 'China', region: 'Hebei', town: 'Weichang Manchu and Mongolian Autonomous County', image: WORKFLOW_PALEO_IMAGE_BASE + 'shuraboprosbole-minuta-a.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'shuraboprosbole-minuta-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Hemiptera \u2192 Procercopidae \u2192 Shuraboprosbole \u2192 Shuraboprosbole minuta' },
    { id: 'paleo-shuraboprosbole-minuta-b', slug: 'shuraboprosbole-minuta-b', sci: 'Shuraboprosbole minuta', common: 'Shuraboprosbole', taxon: 'SHURABOPROSBOLE', mc: 'MC - F10597', collector: 'Museum digitization', eraKey: 'jurassic-late', formedKey: 'wf_field_late_jurassic_age', nameKey: 'wf_field_shuraboprosbole_name', localityKey: 'wf_field_weichang_place', locality: 'Weichang Manchu and Mongolian Autonomous County, Hebei, China', country: 'China', region: 'Hebei', town: 'Weichang Manchu and Mongolian Autonomous County', image: WORKFLOW_PALEO_IMAGE_BASE + 'shuraboprosbole-minuta-b.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'shuraboprosbole-minuta-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Hemiptera \u2192 Procercopidae \u2192 Shuraboprosbole \u2192 Shuraboprosbole minuta' },
    { id: 'paleo-douvilleiceras-sp', slug: 'douvilleiceras-sp', sci: 'Douvilleiceras sp.', common: 'Douvilleiceras', taxon: 'DOUVILLEICERAS', mc: 'MC - F10598', collector: 'Museum digitization', eraKey: 'cretaceous-early', formedKey: 'wf_field_early_cretaceous_age', nameKey: 'wf_field_douvilleiceras_name', localityKey: 'wf_field_douvilleiceras_place', locality: 'Mahajanga, Madagascar', country: 'Madagascar', region: 'Mahajanga', town: 'Mahajanga', image: WORKFLOW_PALEO_IMAGE_BASE + 'douvilleiceras-sp.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'douvilleiceras-sp-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Mollusca \u2192 Cephalopoda \u2192 Ammonoidea \u2192 Ammonitida \u2192 Douvilleiceratidae \u2192 Douvilleiceras \u2192 Douvilleiceras sp.' },
    { id: 'paleo-cf-tabanidae-a', slug: 'cf-tabanidae-a', sci: 'cf. Tabanidae', common: 'Horsefly (cf.)', taxon: 'TABANIDAE', mc: 'MC - F10599', collector: 'Museum digitization', eraKey: 'jurassic-late', formedKey: 'wf_field_late_jurassic_age', nameKey: 'wf_field_tabanidae_name', localityKey: 'wf_field_weichang_place', locality: 'Weichang Manchu and Mongolian Autonomous County, Hebei, China', country: 'China', region: 'Hebei', town: 'Weichang Manchu and Mongolian Autonomous County', image: WORKFLOW_PALEO_IMAGE_BASE + 'cf-tabanidae-a.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'cf-tabanidae-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Diptera \u2192 Tabanidae \u2192 cf. Tabanidae' },
    { id: 'paleo-cf-tabanidae-b', slug: 'cf-tabanidae-b', sci: 'cf. Tabanidae', common: 'Horsefly (cf.)', taxon: 'TABANIDAE', mc: 'MC - F10600', collector: 'Museum digitization', eraKey: 'jurassic-late', formedKey: 'wf_field_late_jurassic_age', nameKey: 'wf_field_tabanidae_name', localityKey: 'wf_field_weichang_place', locality: 'Weichang Manchu and Mongolian Autonomous County, Hebei, China', country: 'China', region: 'Hebei', town: 'Weichang Manchu and Mongolian Autonomous County', image: WORKFLOW_PALEO_IMAGE_BASE + 'cf-tabanidae-b.png', restoration: WORKFLOW_PALEO_IMAGE_BASE + 'cf-tabanidae-restoration.jpg', mediaKind: 'fossil', cutout: true, rail: 'right', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Diptera \u2192 Tabanidae \u2192 cf. Tabanidae' }
  ];

  var PALEO_FOSSIL_HERO_SPECIMENS = [
    { id: 'paleo-beelzebufo-ampinga', slug: 'beelzebufo-ampinga', sci: 'Beelzebufo ampinga', common: 'Beelzebufo', taxon: 'BEELZEBUFO', mc: 'MC - F10553', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Research collection' },
    { id: 'paleo-asaphus-kowalewskii', slug: 'asaphus-kowalewskii', sci: 'Asaphus kowalewskii', common: 'Asaphus', taxon: 'ASAPHUS', mc: 'MC - F10554', date: '\u5967\u9676\u7d00\u4e2d\u671f', collector: 'Museum digitization' },
    { id: 'paleo-nipponites-mirabilis', slug: 'nipponites-mirabilis', sci: 'Nipponites mirabilis', common: 'Nipponites', taxon: 'NIPPONITES', mc: 'MC - F10555', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization' },
    { id: 'paleo-nimbadon-lavarackorum', slug: 'nimbadon-lavarackorum', sci: 'Nimbadon lavarackorum', common: 'Nimbadon', taxon: 'NIMBADON', mc: 'MC - F10557', date: '\u4e2d\u65b0\u4e16\u65e9\u4e2d\u671f', collector: 'Research collection' },
    { id: 'paleo-drepanaspis-gemuendenensis', slug: 'drepanaspis-gemuendenensis', sci: 'Drepanaspis gemuendenensis', common: 'Drepanaspis', taxon: 'DREPANASPIS', mc: 'MC - F10558', date: '\u6ce5\u76c6\u7d00\u65e9\u671f', collector: 'Museum digitization' },
    { id: 'paleo-edestus-heinrichi', slug: 'edestus-heinrichi', sci: 'Edestus heinrichi', common: 'Edestus', taxon: 'EDESTUS', mc: 'MC - F10559', date: '\u77f3\u70ad\u7d00\u665a\u671f', collector: 'Museum digitization' },
    { id: 'paleo-mimetaster-hexagonalis', slug: 'mimetaster-hexagonalis', sci: 'Mimetaster hexagonalis', common: 'Mimetaster', taxon: 'MIMETASTER', mc: 'MC - F10560', date: '\u6ce5\u76c6\u7d00\u65e9\u671f', collector: 'Field collection team' },
    { id: 'paleo-wiwaxia-corrugata', slug: 'wiwaxia-corrugata', sci: 'Wiwaxia corrugata', taxon: 'WIWAXIA', mc: 'MC - F10561', date: '\u5bd2\u6b66\u7d00', collector: 'Burgess Shale archive', imageLocal: true, taxonomy: 'Animalia \u2192 Halwaxiida \u2192 Wiwaxia \u2192 Wiwaxia corrugata' },
    { id: 'paleo-yohoia-tenuis', slug: 'yohoia-tenuis', sci: 'Yohoia tenuis', taxon: 'YOHOIA', mc: 'MC - F10562', date: '\u5bd2\u6b66\u7d00', collector: 'Burgess Shale archive', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Yohoia \u2192 Yohoia tenuis' },
    { id: 'paleo-peytoia-nathorsti', slug: 'peytoia-nathorsti', sci: 'Peytoia nathorsti', common: 'Radiodont', taxon: 'PEYTOIA', mc: 'MC - F10563', date: '\u5bd2\u6b66\u7d00', collector: 'Burgess Shale archive', imageLocal: true, taxonomy: 'Animalia \u2192 Radiodonta \u2192 Peytoia \u2192 Peytoia nathorsti' },
    { id: 'paleo-ovatiovermis-cribratus', slug: 'ovatiovermis-cribratus', sci: 'Ovatiovermis cribratus', taxon: 'OVATIOVERMIS', mc: 'MC - F10564', date: '\u5bd2\u6b66\u7d00', collector: 'Burgess Shale archive', imageLocal: true, taxonomy: 'Animalia \u2192 Lobopodia \u2192 Ovatiovermis \u2192 Ovatiovermis cribratus' },
    { id: 'paleo-cardiodictyon-catenulatum', slug: 'cardiodictyon-catenulatum', sci: 'Cardiodictyon catenulatum', taxon: 'CARDIODICTYON', mc: 'MC - F10565', date: '\u5bd2\u6b66\u7d00', collector: 'Chengjiang archive', imageLocal: true, taxonomy: 'Animalia \u2192 Lobopodia \u2192 Cardiodictyon \u2192 Cardiodictyon catenulatum' },
    { id: 'paleo-proterosuchus-fergusi', slug: 'proterosuchus-fergusi', sci: 'Proterosuchus fergusi', taxon: 'PROTEROSUCHUS', mc: 'MC - F10566', date: '\u4e09\u758a\u7d00\u65e9\u671f', collector: 'Karoo survey', imageLocal: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Proterosuchus \u2192 Proterosuchus fergusi' },
    { id: 'paleo-hyperodapedon-gordoni', slug: 'hyperodapedon-gordoni', sci: 'Hyperodapedon gordoni', common: 'Rhynchosaur', taxon: 'HYPERODAPEDON', mc: 'MC - F10567', date: '\u4e09\u758a\u7d00\u665a\u671f', collector: 'Elgin Sandstone archive', imageLocal: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Reptilia \u2192 Rhynchosauria \u2192 Hyperodapedon gordoni' },
    { id: 'paleo-pseudocarcinus-karlraubenheimeri', slug: 'pseudocarcinus-karlraubenheimeri', sci: 'Pseudocarcinus karlraubenheimeri', taxon: 'PSEUDOCARCINUS', mc: 'MC - F10568', date: '\u4e2d\u65b0\u4e16', collector: 'Marine survey', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Pseudocarcinus \u2192 Pseudocarcinus karlraubenheimeri' },
    { id: 'paleo-parapuzosia-seppenradensis', slug: 'parapuzosia-seppenradensis', sci: 'Parapuzosia seppenradensis', taxon: 'PARAPUZOSIA', mc: 'MC - F10569', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization', imageLocal: true, taxonomy: 'Animalia \u2192 Mollusca \u2192 Cephalopoda \u2192 Ammonoidea \u2192 Ammonitida \u2192 Ammonitina \u2192 Desmoceratoidea \u2192 Pachydiscidae \u2192 Pachydiscinae \u2192 Parapuzosia seppenradensis' },
    { id: 'paleo-dickinsonia-costata', slug: 'dickinsonia-costata', sci: 'Dickinsonia costata', taxon: 'DICKINSONIA', mc: 'MC - F10570', date: '\u57c3\u8fea\u5361\u7d00', collector: 'Ediacaran survey', imageLocal: true, taxonomy: 'Animalia \u2192 Proarticulata \u2192 Dickinsoniidae \u2192 Dickinsonia costata' },
    { id: 'paleo-hieraaetus-moorei', slug: 'hieraaetus-moorei', sci: 'Hieraaetus moorei', common: "Haast's eagle", taxon: 'HIERAAETUS', mc: 'MC - F10571', date: '\u5168\u65b0\u4e16', collector: 'Holocene archive', imageLocal: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Aves \u2192 Accipitriformes \u2192 Hieraaetus moorei' },
    { id: 'paleo-caryosyntrips-serratus', slug: 'caryosyntrips-serratus', sci: 'Caryosyntrips serratus', taxon: 'CARYOSYNTRIPS', mc: 'MC - F10572', date: '\u5bd2\u6b66\u7d00', collector: 'Burgess Shale archive', imageLocal: true, taxonomy: 'Animalia \u2192 Radiodonta \u2192 Caryosyntrips \u2192 Caryosyntrips serratus' },
    { id: 'paleo-dinichthys-terrelli', slug: 'dinichthys-terrelli', sci: 'Dunkleosteus terrelli', common: 'Dunkleosteus', taxon: 'DINICHTHYS', mc: 'MC - F10573', date: '\u6ce5\u76c6\u7d00\u665a\u671f', collector: 'Museum digitization', imageLocal: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Placodermi \u2192 Arthrodira \u2192 Dunkleosteidae \u2192 Dunkleosteus terrelli' },
    { id: 'paleo-collinsium-ciliosum', slug: 'collinsium-ciliosum', sci: 'Collinsium ciliosum', taxon: 'COLLINSIUM', mc: 'MC - F10574', date: '\u5bd2\u6b66\u7d00', collector: 'Xiaoshiba archive', imageLocal: true, taxonomy: 'Animalia \u2192 Lobopodia \u2192 Collinsium \u2192 Collinsium ciliosum' },
    { id: 'paleo-titanichthys-agassizii', slug: 'titanichthys-agassizii', sci: 'Titanichthys agassizii', taxon: 'TITANICHTHYS', mc: 'MC - F10575', date: '\u6ce5\u76c6\u7d00\u665a\u671f', collector: 'Museum digitization', imageLocal: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Placodermi \u2192 Titanichthys agassizii' },
    { id: 'paleo-priscomyzon-riniensis', slug: 'priscomyzon-riniensis', sci: 'Priscomyzon riniensis', common: 'Early lamprey', taxon: 'PRISCOMYZON', mc: 'MC - F10576', date: '\u6ce5\u76c6\u7d00\u665a\u671f', collector: 'Waterloo Farm archive', imageLocal: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Hyperoartia \u2192 Priscomyzon riniensis' },
    { id: 'paleo-naraoia-compacta', slug: 'naraoia-compacta', sci: 'Naraoia compacta', taxon: 'NARAOIA', mc: 'MC - F10577', date: '\u5bd2\u6b66\u7d00', collector: 'Burgess Shale archive', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Naraoia \u2192 Naraoia compacta' },
    { id: 'paleo-attercopus-fimbriunguis', slug: 'attercopus-fimbriunguis', sci: 'Attercopus fimbriunguis', taxon: 'ATTERCOPUS', mc: 'MC - F10578', date: '\u6ce5\u76c6\u7d00\u4e2d\u671f', collector: 'Field collection team', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Arachnida \u2192 Uraraneida \u2192 Attercopus fimbriunguis' }
  ];

  var PALEO_LEFT_RAIL_TOP_FOSSILS = [
    { id: 'paleo-dinocrocuta-sp', slug: 'dinocrocuta-sp', sci: 'Dinocrocuta gigantea', common: 'Dinocrocuta', taxon: 'DINOCROCUTA', mc: 'MC - F10594', date: '\u4e2d\u65b0\u4e16\u665a\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'dinocrocuta-sp.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Mammalia \u2192 Carnivora \u2192 Dinocrocuta \u2192 Dinocrocuta gigantea' },
    { id: 'paleo-mammuthus-primigenius', slug: 'mammuthus-primigenius', sci: 'Mammuthus primigenius', common: 'Mammuthus', taxon: 'MAMMUTHUS', mc: 'MC - F10593', date: '\u66f4\u65b0\u4e16\u665a\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'mammuthus-primigenius.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Mammalia \u2192 Proboscidea \u2192 Mammuthus \u2192 Mammuthus primigenius' },
    { id: 'paleo-muntiacus-sp', slug: 'muntiacus-sp', sci: 'cf. Muntiacus sp.', common: 'Muntiacus', taxon: 'MUNTIACUS', mc: 'MC - F10592', date: '\u66f4\u65b0\u4e16', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'muntiacus-sp.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Mammalia \u2192 Artiodactyla \u2192 Muntiacus \u2192 cf. Muntiacus sp.' },
    { id: 'paleo-aioloceras-besairei', slug: 'aioloceras-besairei', sci: 'Aioloceras besairiei', common: 'Aioloceras', taxon: 'AIOLOCERAS', mc: 'MC - F10591', date: '\u767d\u57a9\u7d00\u65e9\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'aioloceras-besairei.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Mollusca \u2192 Cephalopoda \u2192 Ammonoidea \u2192 Ammonitida \u2192 Ancyloceratina \u2192 Douvilleiceratoidea \u2192 Douvilleiceratidae \u2192 Douvilleiceratinae \u2192 Aioloceras \u2192 Aioloceras besairiei' },
    { id: 'paleo-chunerpeton-tianyiensis', slug: 'chunerpeton-tianyiensis', sci: 'Chunerpeton tianyiensis', common: 'Chunerpeton', taxon: 'CHUNERPETON', mc: 'MC - F10590', date: '\u4f8f\u7f85\u7d00\u4e2d\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'chunerpeton-tianyiensis.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Amphibia \u2192 Caudata \u2192 Cryptobranchidae \u2192 Chunerpeton \u2192 Chunerpeton tianyiensis' },
    { id: 'paleo-mosasauroidea-sp', slug: 'mosasauroidea-sp', sci: 'Mosasauroidea sp.', common: 'Mosasauroidea', taxon: 'MOSASAUROIDEA', mc: 'MC - F10585', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'mosasauroidea-sp.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Squamata \u2192 Mosasauroidea \u2192 Mosasauroidea sp.' },
    { id: 'paleo-spinosaurus-aegyptiacus', slug: 'spinosaurus-aegyptiacus', sci: 'Spinosaurus aegyptiacus', common: 'Spinosaurus', taxon: 'SPINOSAURUS', mc: 'MC - F10586', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'spinosaurus-aegyptiacus.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Dinosauria \u2192 Spinosauridae \u2192 Spinosaurus \u2192 Spinosaurus aegyptiacus' },
    { id: 'paleo-borealosuchus-sternbergii', slug: 'borealosuchus-sternbergii', sci: 'Borealosuchus sternbergii', common: 'Borealosuchus', taxon: 'BOREALOSUCHUS', mc: 'MC - F10587', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'borealosuchus-sternbergii.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Eusuchia \u2192 Borealosuchus \u2192 Borealosuchus sternbergii' },
    { id: 'paleo-lophophyllidium-plummeri', slug: 'lophophyllidium-plummeri', sci: 'Lophophyllidium plummeri', common: 'Lophophyllidium', taxon: 'LOPHOPHYLLIDIUM', mc: 'MC - F10588', date: '\u77f3\u70ad\u7d00\u665a\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'lophophyllidium-plummeri.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Cnidaria \u2192 Anthozoa \u2192 Rugosa \u2192 Lophophyllidae \u2192 Lophophyllidium \u2192 Lophophyllidium plummeri' },
    { id: 'paleo-globidens-sp', slug: 'globidens-sp', sci: 'Globidens sp.', common: 'Globidens', taxon: 'GLOBIDENS', mc: 'MC - F10589', date: '\u767d\u57a9\u7d00\u665a\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'globidens-sp.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Chordata \u2192 Squamata \u2192 Mosasauridae \u2192 Globidens \u2192 Globidens sp.' },
    { id: 'paleo-gerastos-granulosos', slug: 'gerastos-granulosos', sci: 'Gerastos granulosus', common: 'Gerastos', taxon: 'GERASTOS', mc: 'MC - F10579', date: '\u6ce5\u76c6\u7d00\u4e2d\u671f', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'gerastos-granulosos.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Trilobita \u2192 Proetidae \u2192 Gerastos \u2192 Gerastos granulosus' },
    { id: 'paleo-scaphechinus-mirabilis-cluster', slug: 'pleistocene-jinshi-longdong', sci: 'Scaphechinus mirabilis', common: 'Scaphechinus', taxon: 'SCAPHECHINUS', mc: 'MC - F10580', date: '\u66f4\u65b0\u4e16', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'pleistocene-jinshi-longdong.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Echinodermata \u2192 Echinoidea \u2192 Scaphechinus \u2192 Scaphechinus mirabilis' },
    { id: 'paleo-scaphechinus-mirabilis', slug: 'scaphechinus-mirabilis', sci: 'Scaphechinus mirabilis', common: 'Scaphechinus', taxon: 'SCAPHECHINUS', mc: 'MC - F10581', date: '\u66f4\u65b0\u4e16', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'scaphechinus-mirabilis.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Echinodermata \u2192 Echinoidea \u2192 Scaphechinus \u2192 Scaphechinus mirabilis' },
    { id: 'paleo-calymeme-sp', slug: 'calymeme-sp', sci: 'Calymene sp.', common: 'Calymene', taxon: 'CALYMENE', mc: 'MC - F10582', date: '\u5967\u9676\u7d00', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'calymeme-sp.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Trilobita \u2192 Calymenidae \u2192 Calymene \u2192 Calymene sp.' },
    { id: 'paleo-coleoptera-indet-amber', slug: 'coleoptera-indet-amber', sci: 'Coleoptera indet.', common: 'Coleoptera', taxon: 'COLEOPTERA', mc: 'MC - F10583', date: '\u767d\u57a9\u7d00', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'coleoptera-indet-amber.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Coleoptera indet.' },
    { id: 'paleo-insecta-indet-amber', slug: 'insecta-indet-amber', sci: 'Insecta indet.', common: 'Insecta', taxon: 'INSECTA', mc: 'MC - F10584', date: '\u767d\u57a9\u7d00', collector: 'Museum digitization', image: WORKFLOW_PALEO_IMAGE_BASE + 'insecta-indet-amber.jpg', mediaKind: 'fossil', cutout: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Insecta indet.' }
  ];

  function orderPaleoSpecimens(base, pinnedFossils, rightRailFossils) {
    var fossils = (rightRailFossils || []).concat(pinnedFossils);
    var restorations = [];
    base.forEach(function (entry) {
      if (entry.imageLocal) {
        entry.mediaKind = 'restoration';
        restorations.push(entry);
      } else {
        entry.mediaKind = 'fossil';
        fossils.push(entry);
      }
    });
    return fossils.concat(restorations);
  }

  var paleontologySpecimens = orderPaleoSpecimens(PALEO_FOSSIL_HERO_SPECIMENS, PALEO_LEFT_RAIL_TOP_FOSSILS, PALEO_RIGHT_RAIL_TOP_FOSSILS).map(function (entry) {
    return paleontologySpecimenFromHero(entry, { id: entry.id, mc: entry.mc });
  });

  var paleontologySpecimenDefault = paleontologySpecimens[0];

  function insectSpecimen(opts) {
    return {
      id: opts.slug,
      category: 'entomology',
      mc: opts.mc,
      scientificName: opts.sci,
      commonName: opts.common,
      image: opts.image || (opts.imageLocal ? WORKFLOW_INSECT_IMAGE_BASE + opts.slug + '.png' : INSECT_IMAGE_BASE + opts.slug + '.png'),
      taxon: opts.taxon || 'INSECTA',
      taxonomy: opts.taxonomy,
      date: opts.date,
      collector: opts.collector,
      locality: verifiedLocalityForSlug(opts.slug, opts.locality)
    };
  }

  var entomologySpecimens = [
    insectSpecimen({ slug: 'allotopus-moellenkampi-babai', mc: 'MC - 64101', sci: 'Allotopus moellenkampi babai', common: 'Golden stag beetle', locality: '\u99ac\u4f86\u897f\u4e9e \u00b7 \u9739\u9742', date: '2018/09/12', collector: 'MCurator Studio', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Allotopus moellenkampi babai' }),
    insectSpecimen({ slug: 'ampedus-sp', mc: 'MC - 64102', sci: 'Ampedus sp.', common: 'Click beetle', locality: '\u81fa\u7063 \u00b7 \u5357\u6295', date: '2021/06/18', collector: 'Chen Yu', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Elateridae \u2192 Ampedus sp.' }),
    insectSpecimen({ slug: 'cheirotonus-jansoni', mc: 'MC - 64103', sci: 'Cheirotonus jansoni', common: "Janson's long-armed scarab", locality: '\u6cf0\u570b \u00b7 \u6e05\u9081', date: '2019/05/22', collector: 'Field collection team', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Scarabaeidae \u2192 Cheirotonus jansoni' }),
    insectSpecimen({ slug: 'cyclommatus-metallifer', mc: 'MC - 64104', sci: 'Cyclommatus metallifer', common: 'Metallic stag beetle', locality: '\u5370\u5c3c \u00b7 \u8607\u62c9\u5a01\u897f', date: '2020/08/03', collector: 'MCurator Studio', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Cyclommatus metallifer' }),
    insectSpecimen({ slug: 'chiasognathus-grantii', mc: 'MC - 64105', sci: 'Chiasognathus grantii', common: "Darwin's beetle", locality: '\u667a\u5229 \u00b7 \u5357\u90e8\u6eab\u5e36\u6797', date: '2017/12/11', collector: 'Museum digitization', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Chiasognathus grantii' }),
    insectSpecimen({ slug: 'hexarthrius-mandibularis', mc: 'MC - 64106', sci: 'Hexarthrius mandibularis', common: 'Giraffe stag beetle', locality: '\u99ac\u4f86\u897f\u4e9e \u00b7 \u6c99\u5df4', date: '2019/03/28', collector: 'MCurator Studio', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Hexarthrius mandibularis' }),
    insectSpecimen({ slug: 'dynastes-neptunus', mc: 'MC - 64107', sci: 'Dynastes neptunus', common: 'Neptune beetle', locality: '\u5384\u74dc\u591a \u00b7 \u5b89\u7b2c\u65af', date: '2022/01/15', collector: 'Research collection', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Scarabaeidae \u2192 Dynastes neptunus' }),
    insectSpecimen({ slug: 'lucanus-cervus', mc: 'MC - 64108', sci: 'Lucanus cervus', common: 'European stag beetle', locality: '\u5fb7\u570b \u00b7 \u5df4\u4f10\u5229\u4e9e', date: '2016/07/09', collector: 'Herbarium digitization', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Lucanus cervus' }),
    insectSpecimen({ slug: 'mesotopus-tarandus', mc: 'MC - 64109', sci: 'Mesotopus tarandus', common: 'Mesotopus stag beetle', locality: '\u525b\u679c\uff08\u91d1\uff09 \u00b7 \u4e2d\u975e\u71b1\u5e36\u6797', date: '2018/11/20', collector: 'MCurator Studio', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Mesotopus tarandus' }),
    insectSpecimen({ slug: 'odontolabis-dalmanni-intermedia', mc: 'MC - 64110', sci: 'Odontolabis dalmanni intermedia', common: 'Golden stag beetle', locality: '\u83f2\u5f8b\u8cd3 \u00b7 \u5442\u5b8b', date: '2020/04/07', collector: 'Field collection team', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Odontolabis dalmanni intermedia' }),
    insectSpecimen({ slug: 'odontolabis-lacordairei', mc: 'MC - 64111', sci: 'Odontolabis lacordairei', common: 'Lacordaire stag beetle', locality: '\u8d8a\u5357 \u00b7 \u4e2d\u90e8\u9ad8\u539f', date: '2019/09/14', collector: 'MCurator Studio', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Odontolabis lacordairei' }),
    insectSpecimen({ slug: 'prosopocoilus-lafertei', mc: 'MC - 64112', sci: 'Prosopocoilus lafertei', common: "Lafertei's stag beetle", locality: '\u99ac\u4f86\u897f\u4e9e \u00b7 \u7802\u62c9\u8d8a', date: '2021/02/26', collector: 'Research collection', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Prosopocoilus lafertei' }),
    insectSpecimen({ slug: 'phalacrognathus-muelleri', mc: 'MC - 64113', sci: 'Phalacrognathus muelleri', common: 'Rainbow stag beetle', locality: '\u6fb3\u6d32 \u00b7 \u6606\u58eb\u862d', date: '2023/05/30', collector: 'MCurator Studio', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Phalacrognathus muelleri' }),
    insectSpecimen({ slug: 'prosopocoilus-kannegieteri', mc: 'MC - 64114', sci: 'Prosopocoilus kannegieteri', common: "Kannegieter's stag beetle", locality: '\u5370\u5c3c \u00b7 \u8607\u9580\u7b54\u81e8', date: '2018/08/18', collector: 'Field collection team', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Prosopocoilus kannegieteri' }),
    insectSpecimen({ slug: 'sphaenognathus-feisthamelii', mc: 'MC - 64115', sci: 'Sphaenognathus feisthamelii', common: "Feisthamel's stag beetle", locality: '\u54e5\u502b\u6bd4\u4e9e \u00b7 \u5b89\u7b2c\u65af', date: '2017/10/05', collector: 'Museum digitization', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Sphaenognathus feisthamelii' }),
    insectSpecimen({ slug: 'kaniska-canace', mc: 'MC - 64116', sci: 'Kaniska canace', common: 'Blue admiral', taxon: 'LEPIDOPTERA', locality: '\u81fa\u7063 \u00b7 \u5357\u6295', date: '2022/08/30', collector: 'Lin Mei-hua', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Lepidoptera \u2192 Nymphalidae \u2192 Kaniska canace' }),
    insectSpecimen({ slug: 'borbo-cinnara', mc: 'MC - 64117', sci: 'Borbo cinnara', common: 'Rice swift', taxon: 'LEPIDOPTERA', locality: '\u81fa\u7063 \u00b7 \u4f4e\u6d77\u62d4', date: '2023/06/12', collector: 'Lin Mei-hua', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Lepidoptera \u2192 Hesperiidae \u2192 Borbo cinnara' }),
    insectSpecimen({ slug: 'graphium-antiphates', mc: 'MC - 64118', sci: 'Graphium antiphates', common: 'Five-bar swordtail', taxon: 'LEPIDOPTERA', locality: '\u81fa\u7063 \u00b7 \u6771\u90e8\u5c71\u5340', date: '2022/11/05', collector: 'Field collection team', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Lepidoptera \u2192 Papilionidae \u2192 Graphium antiphates' }),
    insectSpecimen({ slug: 'acytolepsis-puspa-myla', mc: 'MC - 64119', sci: 'Acytolepis puspa myla', common: 'Common hedge blue', taxon: 'LEPIDOPTERA', locality: '\u81fa\u7063 \u00b7 \u5357\u6295', date: '2021/09/18', collector: 'Chen Yu', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Lepidoptera \u2192 Lycaenidae \u2192 Acytolepsis puspa myla' }),
    insectSpecimen({ slug: 'heliophorus-ila-matsumurae', mc: 'MC - 64120', sci: 'Heliophorus ila matsumurae', common: 'Purple sapphire', taxon: 'LEPIDOPTERA', locality: '\u81fa\u7063 \u00b7 \u82b1\u84ee', date: '2020/07/22', collector: 'MCurator Studio', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Lepidoptera \u2192 Lycaenidae \u2192 Heliophorus ila matsumurae' }),
    insectSpecimen({ slug: 'graphium-agamemnon', mc: 'MC - 64121', sci: 'Graphium agamemnon', common: 'Tailed jay', taxon: 'LEPIDOPTERA', locality: '\u99ac\u4f86\u897f\u4e9e \u00b7 \u68ee\u6797', date: '2019/04/14', collector: 'Research collection', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Lepidoptera \u2192 Papilionidae \u2192 Graphium agamemnon' }),
    insectSpecimen({ slug: 'polyura-athamas', mc: 'MC - 64122', sci: 'Polyura athamas', common: 'Common nawab', taxon: 'LEPIDOPTERA', locality: '\u6cf0\u570b \u00b7 \u5317\u90e8\u68ee\u6797', date: '2018/12/03', collector: 'Museum digitization', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Lepidoptera \u2192 Nymphalidae \u2192 Polyura athamas' }),
    insectSpecimen({ slug: 'athyma-selenophora', mc: 'MC - 64123', sci: 'Athyma selenophora', common: 'Staff sergeant', taxon: 'LEPIDOPTERA', locality: '\u81fa\u7063 \u00b7 \u9ad8\u96c4', date: '2023/03/09', collector: 'Lin Mei-hua', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Lepidoptera \u2192 Nymphalidae \u2192 Athyma selenophora' }),
    insectSpecimen({ slug: 'plusiotis-chrysargirea', mc: 'MC - 64124', sci: 'Chrysina chrysargirea', common: 'Jewel scarab', taxon: 'PLUSIOTIS', locality: '\u54e5\u65af\u5927\u9ece\u52a0 \u00b7 \u5854\u62c9\u66fc\u5361', date: '2021/04/18', collector: 'Rainforest Field Unit', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Scarabaeidae \u2192 Chrysina chrysargirea' }),
    insectSpecimen({ slug: 'paraponera-clavata', mc: 'MC - 64125', sci: 'Paraponera clavata', common: 'Bullet ant', taxon: 'PARAPONERA', locality: '\u79d8\u9b6f \u00b7 \u4e9e\u99ac\u905c\u4f4e\u5730', date: '2022/02/27', collector: 'Rainforest Field Unit', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Hymenoptera \u2192 Formicidae \u2192 Paraponera clavata' }),
    insectSpecimen({ slug: 'ixorida-venerea', mc: 'MC - 64126', sci: 'Ixorida venerea', common: 'Sulawesi flower chafer', taxon: 'IXORIDA', locality: '\u5370\u5c3c \u00b7 \u8607\u62c9\u5a01\u897f', date: '2021/03/26', collector: 'Island Biodiversity Archive', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Scarabaeidae \u2192 Ixorida venerea' }),
    insectSpecimen({ slug: 'dorcus-ternatensis', mc: 'MC - 64127', sci: 'Dorcus ternatensis', common: 'Ternate stag beetle', taxon: 'DORCUS', locality: '\u5370\u5c3c \u00b7 \u6469\u9e7f\u52a0\u7fa4\u5cf6', date: '2020/11/14', collector: 'MCurator Studio', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Dorcus ternatensis' }),
    insectSpecimen({ slug: 'brachysiderus-quadrimaculatus', mc: 'MC - 64128', sci: 'Brachysiderus quadrimaculatus', common: 'Four-spotted ruteline', taxon: 'BRACHYSIDERUS', locality: '\u5df4\u897f', date: '2019/08/07', collector: 'Research collection', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Scarabaeidae \u2192 Brachysiderus quadrimaculatus' }),
    insectSpecimen({ slug: 'aegus-acuminatus-acuminatus', mc: 'MC - 64129', sci: 'Aegus acuminatus acuminatus', common: 'Aegus stag beetle', taxon: 'AEGUS', locality: '\u99ac\u4f86\u897f\u4e9e \u00b7 \u6c99\u5df4', date: '2020/07/14', collector: 'North Borneo Plate Archive', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Aegus acuminatus acuminatus' }),
    insectSpecimen({ slug: 'aegus-parallelus', mc: 'MC - 64130', sci: 'Aegus parallelus', common: 'Parallel stag beetle', taxon: 'AEGUS', locality: '\u5370\u5c3c \u00b7 \u8607\u9580\u7b54\u81e8', date: '2019/06/22', collector: 'Field collection team', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Aegus parallelus' }),
    insectSpecimen({ slug: 'plusiotis-victorina', mc: 'MC - 64131', sci: 'Chrysina victorina', common: 'Victorina jewel scarab', taxon: 'PLUSIOTIS', locality: '\u5df4\u62ff\u99ac \u00b7 \u4f4e\u5730\u96e8\u6797', date: '2022/05/08', collector: 'Rainforest Field Unit', taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Scarabaeidae \u2192 Chrysina victorina' }),
    insectSpecimen({ slug: 'pseudoscortizus-incredibilis', mc: 'MC - 64132', sci: 'Pseudoscortizus incredibilis', common: 'Incredible stag beetle', taxon: 'PSEUDOSCORTIZUS', locality: 'Peru: Jun\u00edn: San Luis', date: '2024/01/20', collector: 'MCurator Studio', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Pseudoscortizus incredibilis' }),
    insectSpecimen({ slug: 'aesalus-imanishii', mc: 'MC - 64133', sci: 'Aesalus imanishii', common: 'Imanishii aesalus', taxon: 'AESALUS', locality: '\u65e5\u672c \u00b7 \u672c\u5dde', date: '2023/08/14', collector: 'Museum digitization', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Aesalus imanishii' }),
    insectSpecimen({ slug: 'hexarthrius-parryi', mc: 'MC - 64134', sci: 'Hexarthrius parryi', common: "Parry's stag beetle", taxon: 'HEXARTHRIUS', locality: '\u6cf0\u570b \u00b7 \u5317\u90e8\u68ee\u6797', date: '2020/10/11', collector: 'MCurator Studio', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Hexarthrius parryi' }),
    insectSpecimen({ slug: 'xylotrupes-pubescens', mc: 'MC - 64135', sci: 'Xylotrupes pubescens', common: 'Hairy rhinoceros beetle', taxon: 'XYLOTRUPES', locality: '\u5370\u5c3c \u00b7 \u8607\u62c9\u5a01\u897f', date: '2019/07/23', collector: 'Field collection team', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Scarabaeidae \u2192 Xylotrupes pubescens' }),
    insectSpecimen({ slug: 'dorcus-alcides', mc: 'MC - 64136', sci: 'Dorcus alcides', common: 'Alcides stag beetle', taxon: 'DORCUS', locality: '\u5c3c\u6cca\u723e \u00b7 \u4e2d\u90e8\u5c71\u8108', date: '2021/05/17', collector: 'MCurator Studio', imageLocal: true, taxonomy: 'Animalia \u2192 Arthropoda \u2192 Insecta \u2192 Coleoptera \u2192 Lucanidae \u2192 Dorcus alcides' })
  ];

  function zoologySpecimen(opts) {
    return {
      id: opts.id,
      category: 'zoology',
      mc: opts.mc,
      scientificName: opts.sci,
      commonName: opts.commonEn,
      photoLabel: opts.photoLabel || '',
      image: WORKFLOW_ZOOLOGY_IMAGE_BASE + opts.file + '?v=src-v1',
      taxon: opts.taxon,
      taxonomy: 'Animalia',
      date: opts.date,
      collector: opts.collector || 'Field documentation',
      locality: verifiedLocalityForSlug(opts.slug, '')
    };
  }

  var zoologySpecimens = [
    zoologySpecimen({ id: 'zoology-paroedura-picta', slug: 'paroedura-picta', file: 'paroedura-picta.png', mc: 'MC - Z74101', sci: 'Paroedura picta', commonEn: 'Ocelot gecko', taxon: 'PAROEDURA', date: '2024/08/12' }),
    zoologySpecimen({ id: 'zoology-nephrurus-levis', slug: 'nephrurus-levis', file: 'nephrurus-levis.png', mc: 'MC - Z74102', sci: 'Nephrurus levis', commonEn: 'Smooth knob-tailed gecko', taxon: 'NEPHRURUS', date: '2023/11/03' }),
    zoologySpecimen({ id: 'zoology-nephrurus-levis-2', slug: 'nephrurus-levis-2', file: 'nephrurus-levis-2.png', mc: 'MC - Z74103', sci: 'Nephrurus levis', commonEn: 'Smooth knob-tailed gecko', taxon: 'NEPHRURUS', date: '2024/02/19' }),
    zoologySpecimen({ id: 'zoology-varanus-salvator-penang', slug: 'varanus-salvator-penang', file: 'varanus-salvator-penang.png', mc: 'MC - Z74104', sci: 'Varanus salvator', commonEn: 'Asian water monitor (juvenile)', photoLabel: 'Varanus salvator (Penang)', taxon: 'VARANUS', date: '2024/06/08' }),
    zoologySpecimen({ id: 'zoology-varanus-salvator-thailand', slug: 'varanus-salvator-thailand', file: 'varanus-salvator-thailand.png', mc: 'MC - Z74105', sci: 'Varanus salvator', commonEn: 'Asian water monitor', photoLabel: 'Varanus salvator (Thailand)', taxon: 'VARANUS', date: '2023/09/27' }),
    zoologySpecimen({ id: 'zoology-cuora-flavomarginata', slug: 'cuora-flavomarginata', file: 'cuora-flavomarginata.png', mc: 'MC - Z74106', sci: 'Cuora flavomarginata', commonEn: 'Yellow-margined box turtle', taxon: 'CUORA', date: '2022/05/16' }),
    zoologySpecimen({ id: 'zoology-eublepharis-macularius', slug: 'eublepharis-macularius', file: 'eublepharis-macularius.png', mc: 'MC - Z74107', sci: 'Eublepharis macularius', commonEn: 'Leopard gecko', taxon: 'EUBLEPHARIS', date: '2024/01/22' }),
    zoologySpecimen({ id: 'zoology-cynomys-ludovicianus', slug: 'cynomys-ludovicianus', file: 'cynomys-ludovicianus.png', mc: 'MC - Z74108', sci: 'Cynomys ludovicianus', commonEn: 'Black-tailed prairie dog', taxon: 'CYNOMYS', date: '2023/07/14' }),
    zoologySpecimen({ id: 'zoology-megaceryle-lugubris-pallida', slug: 'megaceryle-lugubris-pallida', file: 'megaceryle-lugubris-pallida.png', mc: 'MC - Z74109', sci: 'Megaceryle lugubris pallida', commonEn: 'Crested kingfisher', taxon: 'MEGACERYLE', date: '2024/04/02' }),
    zoologySpecimen({ id: 'zoology-petaurus-breviceps', slug: 'petaurus-breviceps', file: 'petaurus-breviceps.png', mc: 'MC - Z74110', sci: 'Petaurus breviceps', commonEn: 'Sugar glider', taxon: 'PETAURUS', date: '2023/12/11' }),
    zoologySpecimen({ id: 'zoology-polypedates-megacephalus', slug: 'polypedates-megacephalus', file: 'polypedates-megacephalus.png', mc: 'MC - Z74111', sci: 'Polypedates megacephalus', commonEn: 'Hong Kong whipping frog', taxon: 'POLYPEDATES', date: '2024/03/21' }),
    zoologySpecimen({ id: 'zoology-rhacodactylus-leachianus', slug: 'rhacodactylus-leachianus', file: 'rhacodactylus-leachianus.png', mc: 'MC - Z74112', sci: 'Rhacodactylus leachianus', commonEn: 'New Caledonian giant gecko', taxon: 'RHACODACTYLUS', date: '2022/10/09' }),
    zoologySpecimen({ id: 'zoology-tarentola-chazaliae', slug: 'tarentola-chazaliae', file: 'tarentola-chazaliae.png', mc: 'MC - Z74113', sci: 'Tarentola chazaliae', commonEn: 'Helmethead gecko', taxon: 'TARENTOLA', date: '2023/04/30' })
  ];

  function fieldSpecimen(opts) {
    return {
      id: opts.id,
      category: opts.category,
      mc: opts.mc,
      scientificName: opts.sci,
      commonName: opts.commonEn,
      photoLabel: opts.photoLabel || opts.commonEn,
      nameKey: opts.nameKey,
      localityKey: opts.localityKey,
      formedKey: opts.formedKey || '',
      image: 'origin-marketing/' + opts.file,
      taxon: opts.taxon,
      taxonomy: opts.taxonomy || opts.sci,
      date: '',
      eraKey: opts.eraKey || '',
      timeArrival: opts.eraKey ? 'age' : '',
      collector: 'Field documentation',
      locality: opts.localityEn,
      country: opts.country || '',
      region: opts.region || '',
      town: opts.town || '',
      cutout: !!opts.cutout,
      cutoutMode: opts.cutoutMode || '',
      cutoutLimit: opts.cutoutLimit || 0
    };
  }

  var mineralogySpecimens = [
    fieldSpecimen({ id: 'mineralogy-calcite', category: 'mineralogy', mc: 'MC - M74103', sci: 'Calcite', commonEn: 'Calcite', taxon: 'CALCITE', nameKey: 'origin_mineral_calcite_name', localityKey: 'wf_field_calcite_place', formedKey: 'origin_mineral_calcite_formed', file: 'mineral-calcite.png', eraKey: 'ordovician-middle', localityEn: 'Elmwood mine, Tennessee', country: 'United States', region: 'Tennessee', town: 'Elmwood', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-rhodochrosite', category: 'mineralogy', mc: 'MC - M74111', sci: 'Rhodochrosite', commonEn: 'Rhodochrosite', taxon: 'RHODOCHROSITE', nameKey: 'origin_mineral_rhodochrosite_name', localityKey: 'wf_field_rhodochrosite_place', formedKey: 'origin_mineral_rhodochrosite_formed', file: 'mineral-rhodochrosite.png', eraKey: 'oligocene', localityEn: 'Sweet Home Mine, Alma, Colorado', country: 'United States', region: 'Colorado', town: 'Alma', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-quartz', category: 'mineralogy', mc: 'MC - M74101', sci: 'Quartz', commonEn: 'Quartz', taxon: 'QUARTZ', nameKey: 'origin_mineral_quartz_name', localityKey: 'wf_field_quartz_place', formedKey: 'origin_mineral_quartz_formed', file: 'mineral-quartz.png', eraKey: 'penn-late', localityEn: 'Mount Ida, Arkansas', country: 'United States', region: 'Arkansas', town: 'Mount Ida', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-stibnite', category: 'mineralogy', mc: 'MC - M74112', sci: 'Stibnite', commonEn: 'Stibnite', taxon: 'STIBNITE', nameKey: 'origin_mineral_stibnite_name', localityKey: 'wf_field_stibnite_place', formedKey: 'origin_mineral_stibnite_formed', file: 'mineral-stibnite.png', eraKey: 'jurassic-late', localityEn: 'Xikuangshan, Lengshuijiang, Hunan', country: 'China', region: 'Hunan', town: 'Lengshuijiang', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-pyrite', category: 'mineralogy', mc: 'MC - M74108', sci: 'Pyrite', commonEn: 'Pyrite', taxon: 'PYRITE', nameKey: 'origin_mineral_pyrite_name', localityKey: 'wf_field_pyrite_place', formedKey: 'origin_mineral_pyrite_formed', file: 'mineral-pyrite.png', eraKey: 'cretaceous-early', localityEn: 'Navajun, La Rioja, Spain', country: 'Spain', region: 'La Rioja', town: 'Navajun', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-sulfur', category: 'mineralogy', mc: 'MC - M74113', sci: 'Sulfur', commonEn: 'Sulfur', taxon: 'SULFUR', nameKey: 'origin_mineral_sulfur_name', localityKey: 'wf_field_sulfur_place', formedKey: 'origin_mineral_sulfur_formed', file: 'mineral-sulfur.png', eraKey: 'miocene', localityEn: 'Agrigento, Sicily', country: 'Italy', region: 'Sicily', town: 'Agrigento', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-galena', category: 'mineralogy', mc: 'MC - M74104', sci: 'Galena', commonEn: 'Galena', taxon: 'GALENA', nameKey: 'origin_mineral_galena_name', localityKey: 'wf_field_galena_place', formedKey: 'origin_mineral_galena_formed', file: 'mineral-galena.png', eraKey: 'miss-middle', localityEn: 'Joplin, Tri-State, Missouri', country: 'United States', region: 'Missouri', town: 'Joplin', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-malachite', category: 'mineralogy', mc: 'MC - M74110', sci: 'Malachite', commonEn: 'Malachite', taxon: 'MALACHITE', nameKey: 'origin_mineral_malachite_name', localityKey: 'wf_field_malachite_place', formedKey: 'origin_mineral_malachite_formed', file: 'mineral-malachite.png', eraKey: 'tonian', localityEn: 'Kolwezi, Lualaba, DR Congo', country: 'DR Congo', region: 'Lualaba', town: 'Kolwezi', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-fluorite', category: 'mineralogy', mc: 'MC - M74102', sci: 'Fluorite', commonEn: 'Fluorite', taxon: 'FLUORITE', nameKey: 'origin_mineral_fluorite_name', localityKey: 'wf_field_fluorite_place', formedKey: 'origin_mineral_fluorite_formed', file: 'mineral-fluorite.png', eraKey: 'miss-late', localityEn: 'Cave-in-Rock, Hardin County, Illinois', country: 'United States', region: 'Illinois', town: 'Cave-in-Rock', cutout: true }),
    fieldSpecimen({ id: 'mineralogy-azurite', category: 'mineralogy', mc: 'MC - M74109', sci: 'Azurite', commonEn: 'Azurite', taxon: 'AZURITE', nameKey: 'origin_mineral_azurite_name', localityKey: 'wf_field_azurite_place', formedKey: 'origin_mineral_azurite_formed', file: 'mineral-azurite.png', eraKey: 'paleocene', localityEn: 'Bisbee, Arizona', country: 'United States', region: 'Arizona', town: 'Bisbee', cutout: true })
  ];

  var marineSpecimens = [
    fieldSpecimen({ id: 'marine-rhincodon', category: 'marine', mc: 'MC - MB74108', sci: 'Rhincodon typus', commonEn: 'Whale shark', photoLabel: 'Rhincodon typus', taxon: 'RHINCODON', nameKey: 'origin_marine_rhincodon_name', localityKey: 'wf_field_rhincodon_place', file: 'Rhincodon_typus-habitat.jpg', localityEn: 'Ningaloo Reef, Western Australia', country: 'Australia', region: 'Western Australia', town: 'Ningaloo Reef' }),
    fieldSpecimen({ id: 'marine-tursiops', category: 'marine', mc: 'MC - MB74102', sci: 'Tursiops truncatus', commonEn: 'Bottlenose dolphin', photoLabel: 'Tursiops truncatus', taxon: 'TURSIOPS', nameKey: 'origin_marine_tursiops_name', localityKey: 'wf_field_tursiops_place', file: 'Tursiops_truncatus-habitat.jpg', localityEn: 'Coastal Gulf of Mexico', country: 'Gulf of Mexico', region: 'Coastal waters', town: 'Gulf of Mexico' }),
    fieldSpecimen({ id: 'marine-asterias', category: 'marine', mc: 'MC - MB74101', sci: 'Asterias rubens', commonEn: 'Common starfish', photoLabel: 'Asterias rubens', taxon: 'ASTERIAS', nameKey: 'origin_marine_asterias_name', localityKey: 'wf_field_asterias_place', file: 'Asterias_rubens-habitat.jpg', localityEn: 'Rocky shores of the North Sea', country: 'North Sea', region: 'Rocky shores', town: 'North Sea' }),
    fieldSpecimen({ id: 'marine-aurelia', category: 'marine', mc: 'MC - MB74104', sci: 'Aurelia aurita', commonEn: 'Moon jelly', photoLabel: 'Aurelia aurita', taxon: 'AURELIA', nameKey: 'origin_marine_aurelia_name', localityKey: 'wf_field_aurelia_place', file: 'Aurelia_aurita-habitat.jpg', localityEn: 'North Sea and Baltic coasts', country: 'North Sea', region: 'Baltic coasts', town: 'North Sea' }),
    fieldSpecimen({ id: 'marine-diadema', category: 'marine', mc: 'MC - MB74106', sci: 'Diadema setosum', commonEn: 'Long-spined sea urchin', photoLabel: 'Diadema setosum', taxon: 'DIADEMA', nameKey: 'origin_marine_diadema_name', localityKey: 'wf_field_diadema_place', file: 'Diadema_setosum-habitat.jpg', localityEn: 'Shallow reefs of the Red Sea', country: 'Red Sea', region: 'Shallow reefs', town: 'Red Sea' }),
    fieldSpecimen({ id: 'marine-octopus', category: 'marine', mc: 'MC - MB74109', sci: 'Octopus vulgaris', commonEn: 'Common octopus', photoLabel: 'Octopus vulgaris', taxon: 'OCTOPUS', nameKey: 'origin_marine_octopus_name', localityKey: 'wf_field_octopus_place', file: 'Octopus_vulgaris-habitat.jpg', localityEn: 'Rocky Mediterranean coasts', country: 'Mediterranean Sea', region: 'Rocky coasts', town: 'Mediterranean Sea' }),
    fieldSpecimen({ id: 'marine-tridacna', category: 'marine', mc: 'MC - MB74110', sci: 'Tridacna maxima', commonEn: 'Small giant clam', photoLabel: 'Tridacna maxima', taxon: 'TRIDACNA', nameKey: 'origin_marine_tridacna_name', localityKey: 'wf_field_tridacna_place', file: 'Tridacna_maxima-habitat.jpg', localityEn: 'Reef flats of the Great Barrier Reef', country: 'Australia', region: 'Great Barrier Reef', town: 'Reef flats' }),
    fieldSpecimen({ id: 'marine-amphiprion', category: 'marine', mc: 'MC - MB74103', sci: 'Amphiprion ocellaris', commonEn: 'Clown anemonefish', photoLabel: 'Amphiprion ocellaris', taxon: 'AMPHIPRION', nameKey: 'origin_marine_amphiprion_name', localityKey: 'wf_field_amphiprion_place', file: 'Amphiprion_ocellaris-habitat.jpg', localityEn: 'Coral reefs of Indonesia and the Philippines', country: 'Indonesia', region: 'Coral reefs', town: 'Indonesia and the Philippines' }),
    fieldSpecimen({ id: 'marine-hippocampus', category: 'marine', mc: 'MC - MB74107', sci: 'Hippocampus kuda', commonEn: 'Spotted seahorse', photoLabel: 'Hippocampus kuda', taxon: 'HIPPOCAMPUS', nameKey: 'origin_marine_hippocampus_name', localityKey: 'wf_field_hippocampus_place', file: 'Hippocampus_kuda-habitat.jpg', localityEn: 'Seagrass of the Strait of Malacca', country: 'Strait of Malacca', region: 'Seagrass beds', town: 'Strait of Malacca' }),
    fieldSpecimen({ id: 'marine-chelonia', category: 'marine', mc: 'MC - MB74105', sci: 'Chelonia mydas', commonEn: 'Green sea turtle', photoLabel: 'Chelonia mydas', taxon: 'CHELONIA', nameKey: 'origin_marine_chelonia_name', localityKey: 'wf_field_chelonia_place', file: 'Chelonia_mydas-habitat.jpg', localityEn: 'Raine Island, northern Great Barrier Reef', country: 'Australia', region: 'Great Barrier Reef', town: 'Raine Island' })
  ];

  function microSpecimen(id, mc, scientificName, commonName, file, date) {
    return {
      id: id,
      category: 'microbiology',
      mc: mc,
      scientificName: scientificName,
      commonName: commonName,
      photoLabel: scientificName,
      image: WORKFLOW_MICRO_IMAGE_BASE + file + '?v=src-v1',
      taxon: scientificName.split(' ')[0].toUpperCase(),
      taxonomy: scientificName,
      date: date,
      timeArrival: 'age',
      collector: 'Laboratory documentation',
      locality: 'Mcurator lab'
    };
  }

  var microbiologySpecimens = [
    microSpecimen('microbiology-chlamydomonas-reinhardtii', 'MC - MI74102', 'Chlamydomonas reinhardtii', 'Chlamydomonas', 'chlamydomonas-reinhardtii.jpg', '\u4e09\u758a\u7d00\u665a\u671f'),
    microSpecimen('microbiology-staphylococcus-aureus', 'MC - MI74103', 'Staphylococcus aureus', 'Staphylococcus aureus', 'staphylococcus-aureus.jpg', '\u4e2d\u5143\u53e4\u4ee3'),
    microSpecimen('microbiology-euglena-gracilis', 'MC - MI74104', 'Euglena gracilis', 'Euglena', 'euglena-gracilis.jpg', '\u5967\u9676\u7d00\u665a\u671f'),
    microSpecimen('microbiology-volvox-carteri', 'MC - MI74105', 'Volvox carteri', 'Volvox', 'volvox-carteri.jpg', '\u4f8f\u7f85\u7d00\u65e9\u671f'),
    microSpecimen('microbiology-aspergillus-niger', 'MC - MI74106', 'Aspergillus niger', 'black mold', 'aspergillus-niger.jpg', '\u6ce5\u76c6\u7d00\u65e9\u671f'),
    microSpecimen('microbiology-bacillus-subtilis', 'MC - MI74107', 'Bacillus subtilis', 'Bacillus subtilis', 'bacillus-subtilis.jpg', '\u4e2d\u5143\u53e4\u4ee3'),
    microSpecimen('microbiology-escherichia-coli', 'MC - MI74108', 'Escherichia coli', 'Escherichia coli', 'escherichia-coli.jpg', '\u4e2d\u5143\u53e4\u4ee3'),
    microSpecimen('microbiology-paramecium-caudatum', 'MC - MI74109', 'Paramecium caudatum', 'Paramecium', 'paramecium-caudatum.jpg', '\u5967\u9676\u7d00\u665a\u671f'),
    microSpecimen('microbiology-nostoc-commune', 'MC - MI74110', 'Nostoc commune', 'Nostoc', 'nostoc-commune.jpg', '\u65b0\u5143\u53e4\u4ee3'),
    microSpecimen('microbiology-saccharomyces-cerevisiae', 'MC - MI74111', 'Saccharomyces cerevisiae', "baker's yeast", 'saccharomyces-cerevisiae.jpg', '\u4e09\u758a\u7d00\u665a\u671f')
  ];

  const specimenCandidates = entomologySpecimens.concat(paleontologySpecimens, botanySpecimens, dinopediaSpecimens, zoologySpecimens, mineralogySpecimens, marineSpecimens, microbiologySpecimens);
  var workflowDisciplines = [
    { id: 'mineralogy', side: 'left', slot: 'upper', column: 'outer', titleZh: '\u7926\u7269\u5b78', titleEn: 'Mineralogy', image: mineralogyDisciplineImage, theme: 'mineral' },
    { id: 'entomology', side: 'left', slot: 'upper', titleZh: '\u6606\u87f2\u5b78', titleEn: 'Entomology', image: entomologyDisciplineImage, theme: '' },
    { id: 'marine', side: 'left', slot: 'lower', column: 'outer', titleZh: '\u6d77\u6d0b\u751f\u7269\u5b78', titleEn: 'Marine biology', image: marineBiologyDisciplineImage, theme: 'marine' },
    { id: 'botany', side: 'left', slot: 'lower', titleZh: '\u690d\u7269\u5b78', titleEn: 'Botany', image: botanyDisciplineImage, theme: 'botany' },
    { id: 'paleontology', side: 'right', slot: 'upper', titleZh: '\u53e4\u751f\u7269\u5b78', titleEn: 'Paleontology', image: paleontologyDisciplineImage, theme: 'warm' },
    { id: 'dinopedia', side: 'right', slot: 'upper', column: 'outer', titleZh: '\u6050\u9f8d\u5b78', titleEn: 'Dinosaurs', image: dinopediaDisciplineImage, theme: 'violet' },
    { id: 'zoology', side: 'right', slot: 'lower', titleZh: '\u52d5\u7269\u5b78', titleEn: 'Zoology', image: zoologyDisciplineImage, theme: 'zoology' },
    { id: 'microbiology', side: 'right', slot: 'lower', column: 'outer', titleZh: '\u5fae\u751f\u7269\u5b78', titleEn: 'Microbiology', image: microbiologyDisciplineImage, theme: 'micro' }
  ];

  function disciplineById(id) {
    return workflowDisciplines.filter(function (discipline) { return discipline.id === id; })[0] || workflowDisciplines[0];
  }
  const apiSources = {
    GBIF: { titleZh: '物種比對', titleEn: 'Species match', path: 'GET /v1/species/match?name=', resultZh: '出現紀錄與分類已比對', resultEn: 'Occurrence + taxonomy matched', confidence: '98.4%' },
    PBDB: { titleZh: '化石紀錄', titleEn: 'Fossil occurrence', path: 'GET /data1.2/occs/list?base_name=', resultZh: '古生物紀錄已連結', resultEn: 'Paleontology record linked', confidence: '91.2%' },
    ELC: { titleZh: '\u540d\u9304\u6bd4\u5c0d', titleEn: 'Taxonomy check', path: 'GET /elc/taxon?q=', resultZh: '\u81fa\u7063\u7269\u7a2e\u540d\u9304\u547d\u4e2d', resultEn: 'Taiwan species list match', confidence: '96.7%' },
    CoL: { titleZh: '接受學名', titleEn: 'Accepted name', path: 'GET /catalogue/name?q=', resultZh: '同物異名狀態：已接受', resultEn: 'Synonym status accepted', confidence: '99.1%' }
  };
  function apiSourceTitle(source) {
    var s = apiSources[source];
    if (!s) return source;
    var pack = wfI18nPack();
    var loc = pack && pack.apiSources && pack.apiSources[source];
    return L(s.titleZh || s.titleEn || source, s.titleEn || s.title || source, loc && loc.title);
  }
  function apiSourceResult(source) {
    var s = apiSources[source];
    if (!s) return '';
    var pack = wfI18nPack();
    var loc = pack && pack.apiSources && pack.apiSources[source];
    return L(s.resultZh || s.resultEn || '', s.resultEn || s.result || '', loc && loc.result);
  }
  const archivePatterns = [
    { id: 'lepidoptera-archive', label: '\u8776\u7ffc\u5178\u85cf', labelEn: 'Lepidoptera archive', className: 'is-butterfly', image: CARD_BACK_IMAGE_BASE + 'Lepidoptera.png', autoFor: 'lepidoptera' },
    { id: 'coleoptera-archive', label: '\u9798\u7fc5\u5178\u85cf', labelEn: 'Coleoptera archive', className: 'is-beetle', image: CARD_BACK_IMAGE_BASE + 'Coleoptera.png', autoFor: 'coleoptera' },
    { id: 'plantae-archive', label: '\u690d\u7269\u5178\u85cf', labelEn: 'Plant archive', className: 'is-botany', image: CARD_BACK_IMAGE_BASE + 'Plantae.png', autoFor: 'botany' },
    { id: 'fossil-archive', label: '\u5316\u77f3\u5ca9\u5c64', labelEn: 'Fossil strata', className: 'is-fossil', image: fossilImage, autoFor: 'paleontology' },
    { id: 'dinosauria-archive', label: '\u6050\u9f8d\u7d00\u5c64', labelEn: 'Dinosauria strata', className: 'is-dinosaur', image: CARD_BACK_IMAGE_BASE + 'Dinosauria.png', autoFor: 'dinopedia' },
    { id: 'academic-green', label: '\u5b78\u8853\u7da0', labelEn: 'Academic green', className: 'is-academic', image: '' },
    { id: 'dark-specimen', label: '\u6df1\u8272\u6a19\u672c', labelEn: 'Dark specimen', className: 'is-dark', image: backImage },
    { id: 'transparent-export', label: '\u900f\u660e\u532f\u51fa', labelEn: 'Transparent export', className: 'is-export', image: '' }
  ];
  function archivePatternLabel(pattern) {
    var pack = wfI18nPack();
    var lang = getLang();
    if (pack && pack.archivePatterns && pack.archivePatterns[pattern.id]) {
      if (lang === 'ja-JP' || lang === 'de-DE') return pack.archivePatterns[pattern.id];
    }
    var ja = pack && pack.archivePatterns && pack.archivePatterns[pattern.id];
    return L(pattern.label, pattern.labelEn || pattern.label, ja);
  }
  const capabilityDetailsSrc = {
    collection: { zh: ['\u53ef\u6536\u85cf', '\u5178\u85cf\u5df2\u958b\u555f \u00b7 \u4e00\u7b46\u8cc7\u6599', '\u5b78\u540d\u3001\u7522\u5730\u8207\u6a19\u672c\u7de8\u865f\u5beb\u5165\u53ef\u67e5\u8a62\u6a94\u4f4d\uff0c\u9069\u5408\u9928\u85cf\u7ba1\u7406\u3002'], en: ['Collectible', 'Archive enabled · one record', 'Scientific name, locality, and catalog numbers in searchable slots — suited to collection management.'] },
    traceability: { zh: ['\u53ef\u8ffd\u6eaf', '\u4f86\u6e90\u93c8\u5b8c\u6574', 'SAT ID \u4e32\u63a5 provenance \u3001\u63a1\u96c6\u8cc7\u6599\u8207\u8986\u6838\u8a18\u9304\uff0c\u53ef\u56de\u6eaf\u539f\u59cb\u6a19\u672c\u3002'], en: ['Traceable', 'Complete provenance chain', 'SAT ID links provenance, collection data, and review logs back to the original specimen.'] },
    export: { zh: ['\u53ef\u532f\u51fa', 'QR / CSV / JSON \u53ef\u7528', '\u532f\u51fa\u5217\u3001\u6a19\u7c64\u53ca\u6a5f\u5668\u53ef\u8b80\u8cc7\u6599\u53ef\u4f9b\u5c55\u793a\u8207\u7814\u7a76\u7cfb\u7d71\u4ea4\u63db\u3002'], en: ['Exportable', 'QR / CSV / JSON ready', 'Columns, labels, and machine-readable exports for exhibits and research systems.'] },
    citation: { zh: ['\u53ef\u8de8\u57df\u5f15\u7528', '\u5f15\u7528\u683c\u5f0f\u5c0d\u61c9\u5b8c\u6210', '\u79d1\u5b78\u540d\u3001\u8cc7\u7522\u8b58\u5225\u78bc\u8207\u7a69\u5b9a\u51fa\u8655\u5df2\u6574\u5408\u65bc\u5f15\u7528\u8cc7\u6599\u5c64\u3002'], en: ['Citable', 'Citation fields aligned', 'Scientific names, asset IDs, and stable identifiers integrated for formal citation.'] },
    archive: { zh: ['\u53ef\u5178\u85cf', '\u80cc\u9762\u8cc7\u6599\u5c64\u5df2\u4fdd\u5b58', '\u6a19\u672c\u8cc7\u6599\u3001\u6388\u6b0a\u8207\u5178\u85cf\u5716\u7d0b\u53ef\u5171\u540c\u5c01\u5b58\u70ba\u6a94\u6848\u7248\u672c\u3002'], en: ['Archivable', 'Back layer saved', 'Specimen data, license, and archive patterns sealed as an archival version.'] },
    proof: { zh: ['SAT \u8cc7\u7522\u8b49\u660e', '\u8cc7\u7522\u9a57\u8b49\u958b\u555f', 'SAT-MC-000507 \u5df2\u7d81\u5b9a\u6a19\u672c\u8cc7\u6599\u8207\u8ffd\u6eaf\u93c8\uff0c\u53ef\u4f5c\u70ba\u79d1\u5b78\u8cc7\u7522\u8b49\u660e\u3002'], en: ['SAT asset proof', 'Verification enabled', 'SAT-MC-000507 binds specimen data and trace chain as scientific asset proof.'] },
    format: { zh: ['\u5b78\u8853\u683c\u5f0f\u5316', '\u683c\u5f0f\u5316\u5b8c\u6210', '\u5206\u985e\u3001\u63a1\u96c6\u8207\u5f15\u7528\u6b04\u4f4d\u5df2\u4f9d\u5b78\u8853\u5c55\u793a\u898f\u5247\u5c0d\u9f4a\u3002'], en: ['Scholarly formatting', 'Formatting complete', 'Taxonomy, collection, and citation fields aligned to display standards.'] }
  };
  function getCapabilityDetails() {
    var out = {};
    var lang = getLang();
    var pack = wfI18nPack();
    Object.keys(capabilityDetailsSrc).forEach(function (key) {
      var src = capabilityDetailsSrc[key];
      if (lang === 'zh-TW') {
        out[key] = src.zh;
      } else if (lang === 'de-DE' && pack && pack.capabilities && pack.capabilities[key]) {
        out[key] = pack.capabilities[key];
      } else if (lang === 'ja-JP' && pack && pack.capabilities && pack.capabilities[key]) {
        out[key] = pack.capabilities[key];
      } else {
        out[key] = src.en;
      }
    });
    return out;
  }

  const mcuratorWorkflowStageDefs = [
    { id: 'blank', kickerZh: '01 / 空白樣本', kickerEn: '01 / Blank specimen', titleZh: '從一張空白護照原型開始', titleEn: 'Start from a blank passport prototype', descZh: '一張等待研究資料進駐的樣本護照，將在流程中逐層成形。', descEn: 'A specimen passport waiting for research data — taking shape step by step through the workflow.', layout: 'fan', cardVariant: 'blank', progress: 0, sideContent: 'fanned completed cards', transform: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 1 } },
    { id: 'disciplines', kickerZh: '02 / 研究領域', kickerEn: '02 / RESEARCH DISCIPLINES', titleZh: '\u516b\u689d\u7814\u7a76\u7dda\u7d22\uff0c\u9ede\u9078\u5207\u63db\u6558\u4e8b', titleEn: 'Eight research tracks — click to switch the narrative', descZh: '\u7926\u7269\u5b78\u3001\u6606\u87f2\u5b78\u3001\u6d77\u6d0b\u751f\u7269\u5b78\u3001\u690d\u7269\u5b78\u3001\u53e4\u751f\u7269\u5b78\u3001\u6050\u9f8d\u5b78\u3001\u52d5\u7269\u5b78\u8207\u5fae\u751f\u7269\u5b78\uff0c\u63d0\u4f9b\u5f71\u50cf\u5c0e\u5165\u524d\u7684\u7814\u7a76\u8108\u7d61\u3002', descEn: 'Mineralogy, entomology, marine biology, botany, paleontology, dinosaurs, zoology, and microbiology set context before image import.', layout: 'disciplines', cardVariant: 'template', progress: 0, sideContent: 'mineralogy entomology marine botany paleontology dinopedia zoology microbiology disciplines', transform: { x: 0, y: -12, z: 72, rx: 1, ry: -2, rz: -1, scale: 1.02 } },
    { id: 'photos', kickerZh: '03 / 影像導入', kickerEn: '03 / IMAGE IMPORT', titleZh: '選擇標本照片', titleEn: 'Choose a specimen photo', descZh: '從影像列選入標本，讓辨識與後設資料流程開始運作。', descEn: 'Pick a specimen from the image column to start recognition and metadata matching.', layout: 'photo-columns', cardVariant: 'beetle', progress: 18, sideContent: 'vertical specimen thumbnail columns', transform: { x: 0, y: -2, z: 40, rx: 1, ry: -3, rz: -3, scale: 1.02 } },
    { id: 'metadata', kickerZh: '04 / 後設資料', kickerEn: '04 / METADATA', titleZh: '比對外部資料庫', titleEn: 'Match external databases', descZh: 'GBIF、PBDB、ELC 與 CoL 回傳的匹配結果，開始寫入護照。', descEn: 'Matches from GBIF, PBDB, ELC, and CoL begin filling the passport.', layout: 'api', cardVariant: 'butterfly', progress: 42, sideContent: 'API match panel', transform: { x: 132, y: -32, z: 52, rx: 2.5, ry: -5.5, rz: -3.5, scale: 1.01 } },
    { id: 'tree', kickerZh: '05 / 演化樹', kickerEn: '05 / PHYLOGENETIC TREE', titleZh: '分類脈絡變得可視化', titleEn: 'Taxonomic context becomes visible', descZh: '少數高階類群從左側匯入，穿過護照後在右側逐級分成許多物種。', descEn: 'A few higher ranks enter from the left, cross the passport, and split step by step into many species on the right.', layout: 'taxonomy', cardVariant: 'butterfly', progress: 58, sideContent: 'phylogenetic tree lines', transform: { x: 0, y: -36, z: 50, rx: 1.5, ry: -2, rz: -.5, scale: 1.02 } },
    { id: 'provenance', kickerZh: '06 / 產地追溯', kickerEn: '06 / PROVENANCE', titleZh: '補上產地與環境脈絡', titleEn: 'Add locality and environmental context', descZh: '產地、GPS 與採集資訊成為可查驗的田野證據。', descEn: 'Locality, GPS, and collection data become verifiable field evidence.', layout: 'provenance', cardVariant: 'butterfly', progress: 74, sideContent: 'locality record panel', transform: { x: 168, y: -32, z: 52, rx: 2.5, ry: -5.5, rz: -4, scale: 1.01 } },
    { id: 'sat-id', kickerZh: '07 / SAT ID', kickerEn: '07 / SAT ID', titleZh: '生成一組可追蹤的科學資產識別碼', titleEn: 'Generate a traceable scientific asset ID', descZh: '識別鏈完成，護照成為可以交換與引用的資產紀錄。', descEn: 'The identity chain completes — the passport becomes a citable, exchangeable asset record.', layout: 'identity', cardVariant: 'verified', progress: 86, sideContent: 'identity chain', transform: { x: 0, y: -48, z: 56, rx: 0, ry: -1, rz: -3, scale: 1.06 } },
    { id: 'archive-back', kickerZh: '08 / 典藏背面', kickerEn: '08 / ARCHIVE BACK', titleZh: '翻到背面的典藏資料層', titleEn: 'Flip to the archive data layer', descZh: '典藏背景、授權與 provenance 欄位保存在護照背面。', descEn: 'Archive background, license, and provenance fields live on the back of the passport.', layout: 'archive', cardVariant: 'back', progress: 94, sideContent: 'archive background controls', transform: { x: -168, y: -40, z: 54, rx: 1, ry: 5, rz: -6, scale: 1.04 } },
    { id: 'finished', kickerZh: '09 / 完成資產', kickerEn: '09 / COMPLETE ASSET', titleZh: '完成，成為科學資產', titleEn: 'Complete — a scientific asset', descZh: '可收藏、可追溯、可匯出，也能成為學術引用與典藏憑證。', descEn: 'Collectible, traceable, exportable — ready for citation and institutional archive.', layout: 'finished', cardVariant: 'back', progress: 100, sideContent: 'scientific asset capabilities', transform: { x: -180, y: -38, z: 52, rx: 1, ry: 4, rz: -5, scale: 1.02 } }
  ];
  var mcuratorWorkflowStages = [];

  function rebuildWorkflowStages() {
    var jaStages = wfI18nPack() && wfI18nPack().stages ? wfI18nPack().stages : {};
    mcuratorWorkflowStages = mcuratorWorkflowStageDefs.map(function (s) {
      var ja = jaStages[s.id] || {};
      return {
        id: s.id,
        kicker: L(s.kickerZh, s.kickerEn, ja.kicker),
        title: L(s.titleZh, s.titleEn, ja.title),
        description: L(s.descZh, s.descEn, ja.description),
        layout: s.layout,
        cardVariant: s.cardVariant,
        progress: s.progress,
        sideContent: s.sideContent,
        transform: s.transform
      };
    });
  }
  rebuildWorkflowStages();

  var workflowState = {
    index: -1,
    stage: 0,
    selectedSpecimenId: 'kaniska-canace',
    selectedDiscipline: 'entomology',
    selectedCardTab: 'specimen',
    selectedApiSource: 'GBIF',
    selectedTaxonomyNode: 'Kaniska canace',
    selectedProvenanceField: 'locality',
    satGenerated: false,
    cardSide: 'front',
    selectedArchiveBg: 'lepidoptera-archive',
    archiveBgManual: false,
    selectedCapability: 'traceability',
    blankPreviewSelected: false,
    specimenTouched: false,
    hovered: false,
    focused: false,
    pointerTiltX: 0,
    pointerTiltY: 0,
    activeSideCard: null,
    phoneSwipeBound: false,
    root: null,
    frame: null,
    card: null,
    cardInner: null,
    cardFloat: null,
    front: null,
    scroller: window,
    steps: [],
    observer: null,
    raf: 0,
    swapTimer: 0,
    revealTimer: 0,
    typingSession: 0,
    typingQueue: [],
    typingTimer: 0,
    provenanceRevealSession: 0,
    provenanceRevealQueue: [],
    blankRevealSession: 0,
    provLeafletMap: null,
    provLeafletMarker: null,
    provLeafletBasemapCleanup: null
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
    });
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function specimenById(id) {
    return specimenCandidates.filter(function (specimen) { return specimen.id === id; })[0] || entomologySpecimens[entomologySpecimens.length - 1];
  }

  function entomologySpecimenIds() {
    return entomologySpecimens.map(function (specimen) { return specimen.id; });
  }

  function disciplinePhotoThumbIds(disciplineId) {
    var discipline = disciplineId || workflowState.selectedDiscipline || 'entomology';
    if (discipline === 'botany') {
      return botanySpecimens.map(function (specimen) { return specimen.id; });
    }
    if (discipline === 'dinopedia') {
      return dinopediaSpecimens.map(function (specimen) { return specimen.id; });
    }
    if (discipline === 'paleontology') {
      return paleontologySpecimens.map(function (specimen) { return specimen.id; });
    }
    if (discipline === 'zoology') {
      return zoologySpecimens.map(function (specimen) { return specimen.id; });
    }
    if (discipline === 'mineralogy') {
      return mineralogySpecimens.map(function (specimen) { return specimen.id; });
    }
    if (discipline === 'marine') {
      return marineSpecimens.map(function (specimen) { return specimen.id; });
    }
    if (discipline === 'microbiology') {
      return microbiologySpecimens.map(function (specimen) { return specimen.id; });
    }
    return entomologySpecimenIds();
  }

  function defaultPhotoSpecimenId(disciplineId) {
    var discipline = disciplineId || 'entomology';
    if (discipline === 'mineralogy') return 'mineralogy-quartz';
    if (discipline === 'marine') return 'marine-asterias';
    var ids = disciplinePhotoThumbIds(discipline);
    return ids[0] || 'kaniska-canace';
  }

  function disciplineSpecimenId(disciplineId) {
    return defaultPhotoSpecimenId(disciplineId || 'entomology');
  }

  function disciplinePreviewImage(disciplineId) {
    return specimenById(defaultPhotoSpecimenId(disciplineId || 'entomology')).image;
  }

  function disciplinePickButton(discipline) {
    var selected = workflowState.selectedDiscipline === discipline.id;
    var title = disciplineTitle(discipline);
    var subtitle = disciplineSubtitle(discipline);
    return '<button type="button" data-select-discipline="' + discipline.id + '" class="mcwf-discipline-pick mcwf-discipline-pick--' +
      discipline.side + ' mcwf-discipline-pick--' + discipline.slot +
      (discipline.column ? ' mcwf-discipline-pick--' + discipline.column : '') +
      (discipline.theme ? ' ' + discipline.theme : '') +
      (selected ? ' is-selected' : '') + '" aria-label="' + escapeHtml(title) + '">' +
      cardMotionWrap(
        '<span class="mcwf-discipline-pick__thumb"><img src="' + escapeHtml(discipline.image) + '" alt=""></span>' +
        '<span class="mcwf-discipline-pick__meta">' +
        '<b class="mcwf-discipline-pick__title-zh">' + escapeHtml(title) + '</b>' +
        (subtitle
          ? '<small class="mcwf-discipline-pick__title-en">' + escapeHtml(subtitle) + '</small>'
          : '') +
        '</span>'
      ) + '<i aria-hidden="true">&#10003;</i></button>';
  }

  function disciplineLayerMarkup() {
    return workflowDisciplines.map(disciplinePickButton).join('');
  }

  var WORKFLOW_HERO_BACKDROP_KEYS = [
    'plant', 'marine', 'fossil', 'bird', 'mineral', 'crustacean', 'shell', 'dino', 'paleo',
    'lepidoptera', 'paleobio', 'extinct', 'chondrichthyes', 'acanthodii', 'mammal', 'seed', 'fungi', 'skeleton'
  ];

  var WORKFLOW_HERO_BACKGROUND_KEYS = [
    'plant', 'marine', 'bird', 'mineral', 'shell', 'lepidoptera'
  ];

  /* Wings only: three solid cards each side, tucked just behind the blank passport edges. */
  var STAGE01_HERO_SLOTS = [
    { x: -448, y: 16, ry: 0, rz: -6, scale: 0.92, z: 1, bright: 0.92 },
    { x: -332, y: 6, ry: 0, rz: -3, scale: 0.96, z: 2, bright: 0.96 },
    { x: -224, y: 0, ry: 0, rz: -0.6, scale: 1, z: 3, bright: 1 },
    { x: 224, y: 0, ry: 0, rz: 0.6, scale: 1, z: 3, bright: 1 },
    { x: 332, y: 6, ry: 0, rz: 3, scale: 0.96, z: 2, bright: 0.96 },
    { x: 448, y: 16, ry: 0, rz: 6, scale: 0.92, z: 1, bright: 0.92 }
  ];

  function heroCatalogEntry(key) {
    var catalog = window.MCHeroPassportCatalog;
    if (!catalog || typeof catalog.getSpecimen !== 'function') return null;
    var data = catalog.getSpecimen(key);
    if (!data) return null;
    return {
      key: key,
      label: data.label,
      sci: data.sci,
      common: data.common,
      taxon: data.taxon,
      image: catalog.imageSrc ? catalog.imageSrc(key) : ('../' + data.imageRel),
      progress: data.progress
    };
  }

  function heroBackdropEntries() {
    return WORKFLOW_HERO_BACKDROP_KEYS.map(heroCatalogEntry).filter(Boolean);
  }

  function heroBackgroundEntries() {
    return WORKFLOW_HERO_BACKGROUND_KEYS.map(heroCatalogEntry).filter(Boolean);
  }

  function heroBackdropCommon(entry) {
    var sci = entry && entry.sci;
    var insect = entomologyCommonName({ scientificName: sci, commonName: entry && entry.common });
    if (insect && insect !== (entry && entry.common)) return insect;
    var zh = {
      'Solidago canadensis': '\u52a0\u62ff\u5927\u4e00\u679d\u9ec3\u82b1',
      'Tachypleus tridentatus': '\u4e09\u68d8\u9c54',
      'Harpides grimmi': '\u54c8\u666e\u4e09\u8449\u87f2',
      'Copsychus saularis': '\u9d72\u9d1f',
      'Amethyst': '\u7d2b\u6c34\u6676',
      'Pseudocarcinus gigas': '\u5854\u65af\u99ac\u5c3c\u4e9e\u5de8\u87f9',
      'Buccinum undatum': '\u666e\u901a\u86fe\u87ba',
      'Yutyrannus huali': '\u83ef\u9e97\u7fbd\u738b\u9f8d',
      'Ovatiovermis cribratus': '\u5375\u5f62\u8815\u87f2',
      'Utahnax vannieri': '\u7336\u4ed6\u5947\u8766',
      'Thylacinus potens': '\u5f37\u529b\u888b\u72fc',
      'Stethacanthus altonensis': '\u7827\u982d\u9bca',
      'Dinichthys terrelli': '\u76fe\u76ae\u9b5a',
      'Odobenocetops peruvianus': '\u6d77\u8c61\u9be8',
      'Castanospermum australe': '\u6817\u8c46',
      'Craterellus cornucopioides': '\u9ed1\u5587\u53ed\u83cc',
      'Manis pentadactyla': '\u7a7f\u5c71\u7532'
    };
    var ja = {
      'Solidago canadensis': '\u30ab\u30ca\u30c0\u30a2\u30ad\u30ce\u30ad\u30ea\u30bd\u30a6',
      'Tachypleus tridentatus': '\u30ab\u30d6\u30c8\u30ac\u30cb',
      'Copsychus saularis': '\u30b7\u30ad\u30c1\u30e7\u30a6',
      'Amethyst': '\u7d2b\u6c34\u6676',
      'Buccinum undatum': '\u30a8\u30be\u30d0\u30a4',
      'Yutyrannus huali': '\u30e6\u30a6\u30c6\u30a3\u30e9\u30cc\u30b9',
      'Manis pentadactyla': '\u30df\u30df\u30ba\u30af\u30d3'
    };
    var de = {
      'Solidago canadensis': 'Kanadische Goldrute',
      'Tachypleus tridentatus': 'Dreistachliger Pfeilschwanzkrebs',
      'Copsychus saularis': 'Dajaldrossel',
      'Amethyst': 'Amethyst',
      'Pseudocarcinus gigas': 'Tasmanische Riesenkrabbe',
      'Buccinum undatum': 'Wellhornschnecke',
      'Yutyrannus huali': 'Gefiederter Tyrannosaurier',
      'Craterellus cornucopioides': 'Totentrompete',
      'Manis pentadactyla': 'Chinesisches Schuppentier'
    };
    if (isZh() && zh[sci]) return zh[sci];
    if (isJa() && ja[sci]) return ja[sci];
    if (isDe() && de[sci]) return de[sci];
    return (entry && (entry.common || entry.label)) || '';
  }

  function heroBackdropCardBody(entry) {
    var verified = (entry.progress || 0) >= 85;
    return '<div class="mc-passport-card__body">' +
      '<header class="mc-passport-card__head">' +
      '<span class="mc-passport-card__review">' + (verified ? L('已審核', 'Reviewed') : L('未審核', 'Not reviewed')) + '</span>' +
      '<div class="mc-passport-card__headActions">' +
      '<span class="mc-passport-card__reviewMini">' + (verified ? L('已審', 'OK') : L('未審', '—')) + '</span>' +
      '<span class="mc-passport-card__netBadge" aria-hidden="true">N</span>' +
      '</div></header>' +
      '<figure class="mc-passport-card__photo mc-passport-card__photo--catalog mc-passport-card__photo--specimen-panel">' +
      '<span class="mc-passport-card__photo-panel"><img src="' + escapeHtml(entry.image) + '" alt="' + escapeHtml(entry.label) + '" loading="lazy" decoding="async" /></span></figure>' +
      '<div class="mc-passport-card__nameplate">' +
      '<span class="mc-passport-card__taxon">' + escapeHtml(entry.taxon || entry.label) + '</span>' +
      '<h2 class="mc-passport-card__sci">' + escapeHtml(entry.sci) + '</h2>' +
      '<p class="mc-passport-card__common">' + escapeHtml(heroBackdropCommon(entry)) + '</p>' +
      '</div></div>';
  }

  function heroDeckSpread(index, total) {
    var center = (total - 1) / 2;
    var offset = index - center;
    return {
      x: Math.round(offset * 38),
      ry: Math.round(offset * -2.4),
      rz: Math.round(offset * 0.55)
    };
  }

  function heroBackdropCard(entry, index, total) {
    var spread = heroDeckSpread(index, total);
    return '<article class="mc-passport-card mc-passport-card--workflow mcwf-hero-backdrop' + (entry.progress >= 85 ? ' is-verified' : '') +
      '" data-hero-specimen="' + escapeHtml(entry.key) + '" aria-hidden="true" style="--hero-idx:' + index +
      ';--hero-x:' + spread.x + ';--hero-ry:' + spread.ry + 'deg;--hero-rz:' + spread.rz + 'deg;z-index:' + index + '">' +
      '<div class="mc-passport-card__face mc-passport-card__face--front">' + heroBackdropCardBody(entry) + '</div></article>';
  }

  function disciplineSpecimenHeroEntries() {
    return disciplinePhotoThumbIds().map(function (id) {
      var specimen = specimenById(id);
      return {
        key: id,
        label: specimen.taxon || specimen.commonName,
        sci: specimen.scientificName,
        common: specimen.commonName,
        taxon: specimen.taxon,
        image: specimen.image,
        progress: 18
      };
    });
  }

  function heroPickCard(entry, index, total) {
    var spread = heroDeckSpread(index, total);
    var selected = workflowState.selectedSpecimenId === entry.key;
    return '<button type="button" class="mc-passport-card mc-passport-card--workflow mcwf-hero-backdrop mcwf-hero-pick' +
      (selected ? ' is-selected' : '') + '" data-select-thumbnail="' + escapeHtml(entry.key) +
      '" aria-label="' + escapeHtml(entry.sci) + '" style="--hero-idx:' + index + ';--hero-x:' + spread.x +
      ';--hero-ry:' + spread.ry + 'deg;--hero-rz:' + spread.rz + 'deg;z-index:' + index + '">' +
      cardMotionWrap('<div class="mc-passport-card__face mc-passport-card__face--front">' + heroBackdropCardBody(entry) + '</div>') +
      '<i aria-hidden="true">&#10003;</i></button>';
  }

  function heroDeckRowMarkup(entries, renderCard, deckClass) {
    if (!entries.length) return '';
    deckClass = deckClass || '';
    return '<div class="mcwf-hero-deck' + (deckClass ? ' ' + deckClass : '') + '" aria-hidden="true"><div class="mcwf-hero-deck__row">' +
      entries.map(function (entry, index) { return renderCard(entry, index, entries.length); }).join('') +
      '</div></div>';
  }

  function heroStage01BackdropCard(entry, slot, index) {
    return '<article class="mc-passport-card mc-passport-card--workflow mcwf-hero-backdrop mcwf-hero-backdrop--stage01' +
      (entry.progress >= 85 ? ' is-verified' : '') + '" data-hero-specimen="' + escapeHtml(entry.key) +
      '" aria-hidden="true" style="--hero-x:' + slot.x + 'px;--hero-y:' + slot.y + 'px;--hero-ry:0deg;--hero-rz:' + slot.rz +
      'deg;--hero-scale:' + slot.scale + ';--hero-bright:' + (slot.bright || 1) + ';z-index:' + (slot.z || 1) + '">' +
      '<div class="mc-passport-card__face mc-passport-card__face--front">' + heroBackdropCardBody(entry) + '</div></article>';
  }

  function heroFanLayerMarkup() {
    var entries = heroBackgroundEntries();
    if (!entries.length) return '';
    return '<div class="mcwf-hero-deck mcwf-hero-deck--stage01" aria-hidden="true">' +
      entries.map(function (entry, index) {
        var slot = STAGE01_HERO_SLOTS[index] || STAGE01_HERO_SLOTS[STAGE01_HERO_SLOTS.length - 1];
        return heroStage01BackdropCard(entry, slot, index);
      }).join('') + '</div>';
  }

  function splitPhotoThumbColumns(ids) {
    if ((workflowState.selectedDiscipline || '') === 'paleontology') {
      var uploaded = [];
      var rightPinned = [];
      var priorExtinct = [];
      ids.forEach(function (id) {
        var specimen = specimenById(id);
        if (specimen && specimen.rail === 'right') rightPinned.push(id);
        else if (specimen && specimen.cutout) uploaded.push(id);
        else priorExtinct.push(id);
      });
      return { left: uploaded, right: rightPinned.concat(priorExtinct) };
    }
    var split = Math.ceil(ids.length / 2);
    return { left: ids.slice(0, split), right: ids.slice(split) };
  }

  var cutoutWhiteCache = {};

  function photoFillsFrame(specimen) {
    return !!(specimen && (specimen.category === 'marine' || specimen.category === 'microbiology'));
  }

  function cutoutImgAttrs(specimen) {
    if (!specimen || !specimen.cutout) return '';
    var mode = specimen.cutoutMode === 'studio' ? 'studio' : 'black';
    var limit = specimen.cutoutLimit || 24;
    return ' data-cutout="1" data-cutout-mode="' + mode + '" data-cutout-limit="' + limit + '" data-cutout-src="' + escapeHtml(specimen.image) + '"';
  }

  function displayCutoutSrc(specimen) {
    if (specimen && specimen.cutout && cutoutWhiteCache[specimen.image]) return cutoutWhiteCache[specimen.image];
    return specimen ? specimen.image : '';
  }

  function channelSpread(r, g, b) {
    var maxChannel = r > g ? (r > b ? r : b) : (g > b ? g : b);
    var minChannel = r < g ? (r < b ? r : b) : (g < b ? g : b);
    return maxChannel - minChannel;
  }

  function channelLuma(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function knockStudioGroundToWhite(data, width, height) {
    var margin = Math.max(8, Math.round(width * 0.025));
    var expected = new Float32Array(height);
    var y;
    var x;
    for (y = 0; y < height; y += 1) {
      var samples = [];
      for (x = 0; x < margin; x += 1) {
        var left = (y * width + x) * 4;
        var right = (y * width + (width - 1 - x)) * 4;
        samples.push(channelLuma(data[left], data[left + 1], data[left + 2]));
        samples.push(channelLuma(data[right], data[right + 1], data[right + 2]));
      }
      samples.sort(function (a, b) { return a - b; });
      expected[y] = samples[(samples.length / 2) | 0];
    }
    var smooth = new Float32Array(height);
    for (y = 0; y < height; y += 1) {
      var from = Math.max(0, y - 6);
      var to = Math.min(height, y + 7);
      var sum = 0;
      var sampleIndex;
      for (sampleIndex = from; sampleIndex < to; sampleIndex += 1) sum += expected[sampleIndex];
      smooth[y] = sum / (to - from);
    }
    var seen = new Uint8Array(width * height);
    var queue = [];
    var chromaLimit = 14;
    var lumaLimit = 24;
    function consider(px, py) {
      if (px < 0 || py < 0 || px >= width || py >= height) return;
      var index = py * width + px;
      if (seen[index]) return;
      var pixel = index * 4;
      var red = data[pixel];
      var green = data[pixel + 1];
      var blue = data[pixel + 2];
      if (channelSpread(red, green, blue) > chromaLimit) return;
      if (Math.abs(channelLuma(red, green, blue) - smooth[py]) > lumaLimit) return;
      seen[index] = 1;
      queue.push(index);
    }
    for (x = 0; x < width; x += 1) {
      consider(x, 0);
      consider(x, height - 1);
    }
    for (y = 0; y < height; y += 1) {
      consider(0, y);
      consider(width - 1, y);
    }
    var head = 0;
    while (head < queue.length) {
      var index = queue[head];
      head += 1;
      x = index % width;
      y = (index / width) | 0;
      consider(x + 1, y);
      consider(x - 1, y);
      consider(x, y + 1);
      consider(x, y - 1);
    }
    var fringeChroma = 16;
    var fringeLuma = 36;
    var pass;
    for (pass = 0; pass < 2; pass += 1) {
      var extra = [];
      for (y = 1; y < height - 1; y += 1) {
        for (x = 1; x < width - 1; x += 1) {
          var fringeIndex = y * width + x;
          if (seen[fringeIndex]) continue;
          if (!seen[fringeIndex - 1] && !seen[fringeIndex + 1] && !seen[fringeIndex - width] && !seen[fringeIndex + width]) continue;
          var fringePixel = fringeIndex * 4;
          var red = data[fringePixel];
          var green = data[fringePixel + 1];
          var blue = data[fringePixel + 2];
          if (channelSpread(red, green, blue) > fringeChroma) continue;
          if (Math.abs(channelLuma(red, green, blue) - smooth[y]) > fringeLuma) continue;
          extra.push(fringeIndex);
        }
      }
      extra.forEach(function (fringeIndex) { seen[fringeIndex] = 1; });
    }
    var paint;
    for (paint = 0; paint < seen.length; paint += 1) {
      if (!seen[paint]) continue;
      var paintPixel = paint * 4;
      data[paintPixel] = 255;
      data[paintPixel + 1] = 255;
      data[paintPixel + 2] = 255;
      data[paintPixel + 3] = 255;
    }
  }

  var nativeMineralCutoutSrc = {};

  function mineralPngSrc(src) {
    var path = String(src || '').split('?')[0].split('#')[0];
    return /(?:^|\/)mineral-[^/]+\.png$/i.test(path);
  }

  function rasterIsTransparentCutout(data, width, height) {
    var step = Math.max(1, Math.floor(Math.sqrt((width * height) / 4000)));
    var edgeClear = 0;
    var edgeCount = 0;
    var x;
    var y;
    for (x = 0; x < width; x += step) {
      edgeCount += 2;
      if (data[x * 4 + 3] < 16) edgeClear += 1;
      if (data[((height - 1) * width + x) * 4 + 3] < 16) edgeClear += 1;
    }
    for (y = 0; y < height; y += step) {
      edgeCount += 2;
      if (data[(y * width) * 4 + 3] < 16) edgeClear += 1;
      if (data[(y * width + (width - 1)) * 4 + 3] < 16) edgeClear += 1;
    }
    return edgeCount > 0 && (edgeClear / edgeCount) >= 0.75;
  }

  function keepNativeMineralCutout(src) {
    nativeMineralCutoutSrc[src] = true;
    Array.prototype.forEach.call(document.querySelectorAll('img[data-cutout="1"]'), function (node) {
      if (node.getAttribute('data-cutout-src') !== src) return;
      node.removeAttribute('data-cutout-pending');
    });
  }

  function paintCutoutImage(img) {
    if (!img || img.getAttribute('data-cutout') !== '1') return;
    var src = img.getAttribute('data-cutout-src');
    if (!src) return;
    if (nativeMineralCutoutSrc[src]) return;
    if (cutoutWhiteCache[src]) {
      if (img.src !== cutoutWhiteCache[src]) img.src = cutoutWhiteCache[src];
      return;
    }
    if (img.getAttribute('data-cutout-pending') === src) return;
    img.setAttribute('data-cutout-pending', src);
    var probe = new Image();
    probe.onload = function () {
      var width = probe.naturalWidth || probe.width;
      var height = probe.naturalHeight || probe.height;
      if (!width || !height) return;
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(probe, 0, 0, width, height);
      var frame = context.getImageData(0, 0, width, height);
      var data = frame.data;
      if (mineralPngSrc(src) && rasterIsTransparentCutout(data, width, height)) {
        keepNativeMineralCutout(src);
        return;
      }
      if ((img.getAttribute('data-cutout-mode') || 'black') === 'studio') {
        knockStudioGroundToWhite(data, width, height);
        context.putImageData(frame, 0, 0);
        cutoutWhiteCache[src] = canvas.toDataURL('image/jpeg', 0.92);
        Array.prototype.forEach.call(document.querySelectorAll('img[data-cutout="1"]'), function (node) {
          if (node.getAttribute('data-cutout-src') === src) node.src = cutoutWhiteCache[src];
        });
        return;
      }
      var seen = new Uint8Array(width * height);
      var queue = [];
      var head = 0;
      var threshold = parseInt(img.getAttribute('data-cutout-limit') || '24', 10);
      if (!threshold || threshold < 1) threshold = 24;
      function push(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        var index = y * width + x;
        if (seen[index]) return;
        var pixel = index * 4;
        if (data[pixel] > threshold || data[pixel + 1] > threshold || data[pixel + 2] > threshold) return;
        seen[index] = 1;
        queue.push(index);
      }
      var x;
      var y;
      for (x = 0; x < width; x += 1) {
        push(x, 0);
        push(x, height - 1);
      }
      for (y = 0; y < height; y += 1) {
        push(0, y);
        push(width - 1, y);
      }
      while (head < queue.length) {
        var index = queue[head];
        head += 1;
        var pixel = index * 4;
        data[pixel] = 255;
        data[pixel + 1] = 255;
        data[pixel + 2] = 255;
        data[pixel + 3] = 255;
        x = index % width;
        y = (index / width) | 0;
        push(x + 1, y);
        push(x - 1, y);
        push(x, y + 1);
        push(x, y - 1);
      }
      if (threshold <= 10) {
        var fringeLimit = 28;
        var extra = [];
        var fx;
        var fy;
        for (fy = 1; fy < height - 1; fy += 1) {
          for (fx = 1; fx < width - 1; fx += 1) {
            var fringeIndex = fy * width + fx;
            if (seen[fringeIndex]) continue;
            var fringePixel = fringeIndex * 4;
            if (data[fringePixel] > fringeLimit || data[fringePixel + 1] > fringeLimit || data[fringePixel + 2] > fringeLimit) continue;
            if (seen[fringeIndex - 1] || seen[fringeIndex + 1] || seen[fringeIndex - width] || seen[fringeIndex + width]) extra.push(fringeIndex);
          }
        }
        extra.forEach(function (fringeIndex) {
          var fringePixel = fringeIndex * 4;
          data[fringePixel] = 255;
          data[fringePixel + 1] = 255;
          data[fringePixel + 2] = 255;
          data[fringePixel + 3] = 255;
        });
      }
      context.putImageData(frame, 0, 0);
      cutoutWhiteCache[src] = canvas.toDataURL('image/jpeg', 0.92);
      Array.prototype.forEach.call(document.querySelectorAll('img[data-cutout="1"]'), function (node) {
        if (node.getAttribute('data-cutout-src') === src) node.src = cutoutWhiteCache[src];
      });
    };
    probe.src = src;
  }

  function paintCutoutImages(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll('img[data-cutout="1"]'), paintCutoutImage);
  }

  function assignSpecimenPhoto(img, specimen) {
    if (!img || !specimen) return;
    img.alt = specimen.scientificName || '';
    var well = img.closest ? img.closest('.mc-passport-card__photo') : null;
    if (well) well.classList.toggle('is-photo-cover', photoFillsFrame(specimen));
    if (specimen.cutout) {
      img.setAttribute('data-cutout', '1');
      img.setAttribute('data-cutout-mode', specimen.cutoutMode === 'studio' ? 'studio' : 'black');
      img.setAttribute('data-cutout-limit', String(specimen.cutoutLimit || 24));
      img.setAttribute('data-cutout-src', specimen.image);
      img.src = displayCutoutSrc(specimen);
      paintCutoutImage(img);
      return;
    }
    img.removeAttribute('data-cutout');
    img.removeAttribute('data-cutout-mode');
    img.removeAttribute('data-cutout-limit');
    img.removeAttribute('data-cutout-src');
    img.src = specimen.image;
  }

  function photoOptionButton(id) {
    var specimen = specimenById(id);
    var selected = workflowState.selectedSpecimenId === id;
    var thumbLabel = specimen.category === 'mineralogy' ? displayCommonName(specimen) : (specimen.photoLabel || specimen.scientificName);
    return '<button type="button" class="mc-stage-photo-option mc-stage-photo-option--gallery' + (selected ? ' is-selected' : '') +
      (photoFillsFrame(specimen) ? ' is-photo-cover' : '') +
      '" data-select-thumbnail="' + escapeHtml(specimen.id) + '" aria-label="' + escapeHtml(thumbLabel) + '">' +
      '<span class="mc-stage-photo-option__thumb">' +
      '<img src="' + escapeHtml(displayCutoutSrc(specimen)) + '"' + cutoutImgAttrs(specimen) + ' alt="" loading="lazy" decoding="async"></span>' +
      '<span class="mc-stage-photo-option__label">' + escapeHtml(thumbLabel) + '</span></button>';
  }

  function photoRailMarkup(ids) {
    return ids.map(photoOptionButton).join('');
  }

  function photosLayerMarkup() {
    var columns = splitPhotoThumbColumns(disciplinePhotoThumbIds());
    return '<div class="mc-stage-photo-scene">' +
      '<aside class="mc-stage-photo-rail mc-stage-photo-rail--left">' + photoRailMarkup(columns.left) + '</aside>' +
      '<div class="mc-stage-photo-main" aria-hidden="true"></div>' +
      '<aside class="mc-stage-photo-rail mc-stage-photo-rail--right">' + photoRailMarkup(columns.right) + '</aside>' +
      '</div>';
  }

  function taxonomyTreeNodes(specimen) {
    return buildTaxonomyContext(specimen).lineage.concat([specimen.scientificName]);
  }

  var GENUS_FAMILY = {
    Paroedura: 'Gekkonidae', Nephrurus: 'Carphodactylidae', Varanus: 'Varanidae', Cuora: 'Geoemydidae', Eublepharis: 'Eublepharidae', Cynomys: 'Sciuridae', Megaceryle: 'Alcedinidae', Petaurus: 'Petauridae', Polypedates: 'Rhacophoridae', Rhacodactylus: 'Diplodactylidae', Tarentola: 'Phyllodactylidae',
    Koneprusia: 'Odontopleuridae', Leonaspis: 'Odontopleuridae', Radiaspis: 'Odontopleuridae', Dicranurus: 'Odontopleuridae', Selenopeltis: 'Odontopleuridae', Odontopleura: 'Odontopleuridae', Miraspis: 'Odontopleuridae', Ceratonurus: 'Odontopleuridae',
    Gerastos: 'Proetidae', Dechenella: 'Proetidae', Cornuproetus: 'Proetidae', Proetus: 'Proetidae', Longiproetus: 'Proetidae',
    Calymene: 'Calymenidae', Flexicalymene: 'Calymenidae', Gravicalymene: 'Calymenidae', Neseuretus: 'Calymenidae',
    Asaphus: 'Asaphidae', Neoasaphus: 'Asaphidae', Ogmasaphus: 'Asaphidae', Pseudasaphus: 'Asaphidae',
    Naraoia: 'Naraoiidae', Misszhouia: 'Naraoiidae',
    Trilobite: 'Trilobita',
    Whiteia: 'Whiteiidae', Piveteauia: 'Whiteiidae',
    Beelzebufo: 'Ceratophryidae', Ceratophrys: 'Ceratophryidae', Lepidobatrachus: 'Ceratophryidae',
    Nipponites: 'Nostoceratidae', Eubostrychoceras: 'Nostoceratidae', Didymoceras: 'Nostoceratidae', Nostoceras: 'Nostoceratidae',
    Ammonoidea: 'Ammonoidea', Dactylioceras: 'Ammonoidea', Hildoceras: 'Ammonoidea', Cardioceras: 'Ammonoidea', Baculites: 'Ammonoidea',
    Parapuzosia: 'Pachydiscidae', Pachydiscus: 'Pachydiscidae', Menuites: 'Pachydiscidae',
    Nimbadon: 'Diprotodontidae', Neohelos: 'Diprotodontidae', Diprotodon: 'Diprotodontidae', Zygomaturus: 'Diprotodontidae',
    Drepanaspis: 'Pteraspidiformes', Pteraspis: 'Pteraspidiformes', Errivaspis: 'Pteraspidiformes', Rhinopteraspis: 'Pteraspidiformes',
    Edestus: 'Eugeneodontiformes', Helicoprion: 'Eugeneodontiformes', Sarcoprion: 'Eugeneodontiformes',
    Mimetaster: 'Marrellomorpha', Marrella: 'Marrellomorpha', Furca: 'Marrellomorpha', Vachonisia: 'Marrellomorpha',
    Wiwaxia: 'Halwaxiida', Orthrozanclus: 'Halwaxiida', Halkieria: 'Halwaxiida',
    Yohoia: 'Megacheira', Leanchoilia: 'Megacheira', Alalcomenaeus: 'Megacheira', Jianfengia: 'Megacheira', Haikoucaris: 'Megacheira', Fortiforceps: 'Megacheira',
    Peytoia: 'Radiodonta', Anomalocaris: 'Radiodonta', Hurdia: 'Radiodonta', Amplectobelua: 'Radiodonta', Cambroraster: 'Radiodonta', Caryosyntrips: 'Radiodonta', Stanleycaris: 'Radiodonta',
    Ovatiovermis: 'Lobopodia', Collinsium: 'Lobopodia', Hallucigenia: 'Lobopodia', Microdictyon: 'Lobopodia', Cardiodictyon: 'Lobopodia', Luolishania: 'Lobopodia', Onychodictyon: 'Lobopodia',
    Proterosuchus: 'Proterosuchidae', Archosaurus: 'Proterosuchidae',
    Hyperodapedon: 'Rhynchosauridae', Teyumbaita: 'Rhynchosauridae', Stenaulorhynchus: 'Rhynchosauridae', Rhynchosaurus: 'Rhynchosauridae',
    Pseudocarcinus: 'Menippidae', Tumidocarcinus: 'Menippidae',
    Dickinsonia: 'Dickinsoniidae', Andiva: 'Dickinsoniidae', Yorgia: 'Dickinsoniidae',
    Hieraaetus: 'Accipitridae', Aquila: 'Accipitridae',
    Dunkleosteus: 'Dunkleosteidae', Titanichthys: 'Titanichthyidae', Gorgonichthys: 'Dunkleosteidae', Heintzichthys: 'Dunkleosteidae',
    Priscomyzon: 'Petromyzontiformes', Mayomyzon: 'Petromyzontiformes', Mesomyzon: 'Petromyzontiformes', Lampetra: 'Petromyzontiformes', Petromyzon: 'Petromyzontiformes',
    Attercopus: 'Uraraneida', Permarachne: 'Uraraneida', Palaeothele: 'Uraraneida',
    Scaphechinus: 'Echinarachniidae', Echinarachnius: 'Echinarachniidae', Astriclypeus: 'Scutellidae', Dendraster: 'Scutellidae',
    Borealosuchus: 'Eusuchia',
    Shuraboprosbole: 'Procercopidae', Dastilbe: 'Chanidae', Douvilleiceras: 'Douvilleiceratidae',
    Hemipristis: 'Hemigaleidae', Diodon: 'Diodontidae',
    Chunerpeton: 'Cryptobranchidae',
    Lophophyllidium: 'Lophophyllidae',
    Globidens: 'Mosasauridae', Mosasaurus: 'Mosasauridae', Tylosaurus: 'Mosasauridae', Platecarpus: 'Mosasauridae', Prognathodon: 'Mosasauridae',
    Mosasauroidea: 'Mosasauroidea',
    Allotopus: 'Lucanidae', Cyclommatus: 'Lucanidae', Chiasognathus: 'Lucanidae', Hexarthrius: 'Lucanidae', Lucanus: 'Lucanidae', Mesotopus: 'Lucanidae', Odontolabis: 'Lucanidae', Prosopocoilus: 'Lucanidae', Phalacrognathus: 'Lucanidae', Sphaenognathus: 'Lucanidae', Dorcus: 'Lucanidae', Aegus: 'Lucanidae', Pseudoscortizus: 'Lucanidae', Aesalus: 'Lucanidae', Lamprima: 'Lucanidae',
    Ampedus: 'Elateridae',
    Cheirotonus: 'Scarabaeidae', Dynastes: 'Scarabaeidae', Plusiotis: 'Scarabaeidae', Ixorida: 'Scarabaeidae', Xylotrupes: 'Scarabaeidae', Chrysina: 'Scarabaeidae',
    Brachysiderus: 'Scarabaeidae',
    Kaniska: 'Nymphalidae', Polyura: 'Nymphalidae', Athyma: 'Nymphalidae',
    Borbo: 'Hesperiidae',
    Graphium: 'Papilionidae',
    Acytolepis: 'Lycaenidae', Heliophorus: 'Lycaenidae',
    Paraponera: 'Formicidae',
    Adiantum: 'Pteridaceae', Drosera: 'Droseraceae', Ginkgo: 'Ginkgoaceae', Koelreuteria: 'Sapindaceae', Mimosa: 'Fabaceae', Nelumbo: 'Nelumbonaceae', Nepenthes: 'Nepenthaceae', Nephrolepis: 'Nephrolepidaceae', Pinus: 'Pinaceae', Platycerium: 'Polypodiaceae',
    Linhenykus: 'Alvarezsauridae', Mononykus: 'Alvarezsauridae', Shuvuuia: 'Alvarezsauridae',
    Balaur: 'Dromaeosauridae', Zhenyuanlong: 'Dromaeosauridae', Velociraptor: 'Dromaeosauridae', Microraptor: 'Dromaeosauridae',
    Eoabelisaurus: 'Abelisauridae', Carnotaurus: 'Abelisauridae', Majungasaurus: 'Abelisauridae',
    Eocursor: 'Ornithischia', Lesothosaurus: 'Ornithischia',
    Stegosaurus: 'Stegosauridae', Kentrosaurus: 'Stegosauridae', Tuojiangosaurus: 'Stegosauridae',
    Tarbosaurus: 'Tyrannosauridae', Yutyrannus: 'Proceratosauridae', Zhuchengtyrannus: 'Tyrannosauridae', Tyrannosaurus: 'Tyrannosauridae', Gorgosaurus: 'Tyrannosauridae',
    Dinocrocuta: 'Hyaenidae', Mammuthus: 'Elephantidae', Muntiacus: 'Cervidae', Aioloceras: 'Douvilleiceratidae',
    Vallibonavenatrix: 'Spinosauridae', Spinosaurus: 'Spinosauridae', Baryonyx: 'Spinosauridae', Suchomimus: 'Spinosauridae',
    Ambopteryx: 'Scansoriopterygidae', Yi: 'Scansoriopterygidae', Epidexipteryx: 'Scansoriopterygidae',
    Yamaceratops: 'Ceratopsia', Zuniceratops: 'Ceratopsia', Protoceratops: 'Ceratopsia', Psittacosaurus: 'Ceratopsia',
    Zalmoxes: 'Rhabdodontidae', Mochlodon: 'Rhabdodontidae', Rhabdodon: 'Rhabdodontidae'
  };

  var CLOSE_KIN = {
    Odontopleuridae: ['Koneprusia subterarmata', 'Koneprusia chlupaci', 'Leonaspis williamsi', 'Radiaspis radiata', 'Dicranurus monstrosus', 'Selenopeltis buchii', 'Odontopleura ovata', 'Miraspis mira', 'Ceratonurus krejcii'],
    Gerastos: ['Gerastos cuvieri', 'Gerastos tuberculatus', 'Gerastos hammii', 'Gerastos confragosus', 'Gerastos couvinensis'],
    Borealosuchus: ['Borealosuchus formidabilis', 'Borealosuchus threeensis', 'Borealosuchus wilsoni', 'Borealosuchus acutidentatus', 'Borealosuchus griffithi'],
    Lophophyllidium: ['Lophophyllidium proliferum', 'Lophophyllidium dunbari', 'Lophophyllidium profundum'],
    Lophophyllidae: ['Lophophyllidium proliferum', 'Lophophyllidium dunbari', 'Lophophyllidium profundum'],
    Globidens: ['Globidens alabamensis', 'Globidens dakotensis', 'Globidens phosphaticus', 'Globidens schurmanni', 'Globidens simplex'],
    Mosasauroidea: ['Mosasaurus hoffmannii', 'Tylosaurus proriger', 'Platecarpus tympaniticus', 'Prognathodon solvayi', 'Globidens phosphaticus'],
    Calymene: ['Calymene blumenbachii', 'Calymene niagarensis', 'Calymene celebra'],
    Proetidae: ['Gerastos cuvieri', 'Gerastos tuberculatus', 'Gerastos hammii', 'Gerastos confragosus', 'Gerastos couvinensis'],
    Calymenidae: ['Calymene blumenbachii', 'Flexicalymene ouzregui', 'Flexicalymene senaria', 'Gravicalymene arcuata', 'Neseuretus tristani', 'Diacalymene diademata', 'Colpocoryphe grandis'],
    Asaphidae: ['Asaphus expansus', 'Asaphus lepidurus', 'Asaphus raniceps', 'Asaphus cornutus', 'Asaphus kowalewskii', 'Neoasaphus punctatus', 'Ogmasaphus praetextus', 'Pseudasaphus globifrons'],
    Naraoiidae: ['Naraoia spinosa', 'Naraoia bertiensis', 'Naraoia halia', 'Misszhouia longicaudata', 'Naraoia compacta'],
    Trilobita: ['Elrathia kingii', 'Eldredgeops rana', 'Calymene blumenbachii', 'Asaphus expansus', 'Isotelus gigas', 'Ogygiocarella debuchii', 'Gerastos tuberculatus', 'Flexicalymene senaria'],
    Whiteiidae: ['Whiteia tuberculata', 'Whiteia africana', 'Whiteia nielseni', 'Piveteauia madagascariensis'],
    Ceratophryidae: ['Ceratophrys aurita', 'Ceratophrys ornata', 'Ceratophrys cranwelli', 'Lepidobatrachus laevis', 'Lepidobatrachus asper', 'Chacophrys pierottii', 'Baurubatrachus pricei', 'Beelzebufo ampinga'],
    Nostoceratidae: ['Nipponites sachalinensis', 'Eubostrychoceras japonicum', 'Didymoceras nebrascense', 'Nostoceras helicinum', 'Hyphantoceras reussianum', 'Bostrychoceras polyplocum', 'Axonoceras compressum'],
    Ammonoidea: ['Dactylioceras commune', 'Hildoceras bifrons', 'Cardioceras cordatum', 'Perisphinctes variocostatus', 'Baculites compressus', 'Pachydiscus neubergicus', 'Harpoceras falciferum', 'Amaltheus margaritatus'],
    Pachydiscidae: ['Parapuzosia daubreei', 'Parapuzosia leptophylla', 'Pachydiscus neubergicus', 'Pachydiscus jacquoti', 'Menuites menu', 'Eupachydiscus levyi', 'Anapachydiscus wittekindi', 'Canadoceras newberryanum'],
    Diprotodontidae: ['Neohelos stirtoni', 'Ngapakaldia tedfordi', 'Diprotodon optatum', 'Zygomaturus trilobus', 'Kolopsis torus', 'Alkwertatherium webbi', 'Silvabestius michaelbirti'],
    Pteraspidiformes: ['Pteraspis rostrata', 'Errivaspis waynensis', 'Protopteraspis gosseleti', 'Rhinopteraspis dunensis', 'Doryaspis nathorsti', 'Podolaspis podolica', 'Europrotaspis crenulata', 'Drepanaspis gemuendenensis'],
    Eugeneodontiformes: ['Edestus minor', 'Edestus giganteus', 'Helicoprion bessonowi', 'Helicoprion ferrieri', 'Sarcoprion edax', 'Campyloprion ivanovi', 'Toxoprion lecontei', 'Lestrodus sarlei'],
    Marrellomorpha: ['Marrella splendens', 'Furca bohemica', 'Vachonisia rogeri', 'Xylokorys chledophilia', 'Mimetaster hexagonalis', 'Austromarrella klausmuelleri'],
    Halwaxiida: ['Wiwaxia foliosa', 'Wiwaxia taijiangensis', 'Orthrozanclus reburrus', 'Halkieria evangelista', 'Odontogriphus omalus', 'Wiwaxia corrugata'],
    Megacheira: ['Leanchoilia superlata', 'Leanchoilia illecebrosa', 'Alalcomenaeus cambricus', 'Jianfengia multisegmentalis', 'Haikoucaris ercaiensis', 'Fortiforceps foliosa', 'Kootenichela deppi', 'Yohoia tenuis'],
    Radiodonta: ['Anomalocaris canadensis', 'Hurdia victoria', 'Amplectobelua symbrachiata', 'Cambroraster falcatus', 'Stanleycaris hirpex', 'Caryosyntrips serratus', 'Peytoia nathorsti'],
    Lobopodia: ['Hallucigenia sparsa', 'Hallucigenia fortis', 'Microdictyon sinicum', 'Luolishania longicruris', 'Onychodictyon ferox', 'Collinsium ciliosum', 'Ovatiovermis cribratus', 'Cardiodictyon catenulatum'],
    Proterosuchidae: ['Archosaurus rossicus', 'Tasmaniosaurus triassicus', 'Sarmatosuchus otschevi', 'Fugusuchus hejiapanensis', 'Proterosuchus fergusi'],
    Rhynchosauridae: ['Hyperodapedon huxleyi', 'Hyperodapedon sanjuanensis', 'Hyperodapedon huenei', 'Teyumbaita sulcognathus', 'Stenaulorhynchus stockleyi', 'Rhynchosaurus articeps', 'Hyperodapedon gordoni'],
    Menippidae: ['Pseudocarcinus gigas', 'Tumidocarcinus giganteus', 'Tumidocarcinus tumidus', 'Menippe mercenaria', 'Menippe adina', 'Pseudocarcinus karlraubenheimeri'],
    Dickinsoniidae: ['Dickinsonia tenuis', 'Dickinsonia rex', 'Dickinsonia lissa', 'Dickinsonia menneri', 'Andiva ivantsovi', 'Yorgia waggoneri', 'Dickinsonia costata'],
    Accipitridae: ['Hieraaetus morphnoides', 'Hieraaetus pennatus', 'Hieraaetus wahlbergi', 'Hieraaetus ayresii', 'Aquila chrysaetos', 'Aquila audax', 'Aquila fasciata', 'Hieraaetus moorei'],
    Dinichthyidae: ['Dunkleosteus intermedius', 'Titanichthys clarki', 'Titanichthys agassizii', 'Gorgonichthys clarki', 'Heintzichthys gouldii', 'Gymnotrachelus hydei', 'Holdenius holdeni'],
    Petromyzontiformes: ['Hardistiella montanensis', 'Mayomyzon pieckoensis', 'Mesomyzon mengae', 'Pipiscius zangerli', 'Lampetra fluviatilis', 'Petromyzon marinus', 'Geotria australis', 'Priscomyzon riniensis'],
    Uraraneida: ['Permarachne novokshonovi', 'Palaeothele montceauensis', 'Attercopus fimbriunguis'],
    Echinarachniidae: ['Scaphechinus griseus', 'Scaphechinus tenuis', 'Echinarachnius parma', 'Scaphechinus mirabilis'],
    Lucanidae: ['Lucanus elaphus', 'Lucanus capreolus', 'Lucanus maculifemoratus', 'Lucanus tetraodon', 'Odontolabis cuvera', 'Odontolabis gazella', 'Prosopocoilus giraffa', 'Prosopocoilus astacoides', 'Hexarthrius parryi', 'Hexarthrius mandibularis', 'Dorcus titanus', 'Dorcus parallelipipedus', 'Cyclommatus metallifer', 'Lamprima adolphinae', 'Phalacrognathus muelleri', 'Aegus laevicollis'],
    Elateridae: ['Ampedus sanguineus', 'Ampedus balteatus', 'Ampedus nigerrimus', 'Ampedus pomorum', 'Ampedus cardinalis', 'Agriotes lineatus', 'Agriotes obscurus', 'Melanotus villosus'],
    Scarabaeidae: ['Dynastes hercules', 'Dynastes tityus', 'Dynastes neptunus', 'Xylotrupes gideon', 'Xylotrupes ulysses', 'Cheirotonus parryi', 'Cheirotonus jansoni', 'Chrysina resplendens', 'Chrysina gloriosa', 'Ixorida mouhotii'],
    Buprestidae: ['Chrysochroa fulgidissima', 'Chrysochroa buqueti', 'Julodis cirrosa', 'Sternocera aequisignata', 'Cyphogastra javanica'],
    Nymphalidae: ['Kaniska canace', 'Vanessa atalanta', 'Vanessa cardui', 'Athyma selenophora', 'Athyma perius', 'Polyura athamas', 'Polyura eudamippus', 'Nymphalis antiopa'],
    Hesperiidae: ['Borbo cinnara', 'Borbo borbonica', 'Pelopidas mathias', 'Parnara guttata', 'Potanthus omaha'],
    Papilionidae: ['Graphium sarpedon', 'Graphium doson', 'Graphium agamemnon', 'Graphium antiphates', 'Papilio machaon', 'Papilio memnon', 'Papilio polytes'],
    Lycaenidae: ['Acytolepis puspa', 'Celastrina argiolus', 'Heliophorus brahma', 'Heliophorus ila', 'Zizeeria karsandra', 'Jamides bochus'],
    Formicidae: ['Paraponera clavata', 'Dinoponera gigantea', 'Dinoponera australis', 'Neoponera villosa', 'Pachycondyla harpax'],
    Pteridaceae: ['Adiantum raddianum', 'Adiantum pedatum', 'Adiantum hispidulum', 'Adiantum aleuticum', 'Adiantum caudatum', 'Adiantum formosum', 'Adiantum peruvianum', 'Adiantum capillus-veneris'],
    Droseraceae: ['Drosera rotundifolia', 'Drosera spatulata', 'Drosera capensis', 'Drosera binata', 'Drosera burmannii', 'Drosera peltata', 'Drosera tokaiensis', 'Drosera indica'],
    Ginkgoaceae: ['Ginkgo adiantoides', 'Ginkgo yimaensis', 'Ginkgo apodes', 'Ginkgo digitata', 'Ginkgo huttonii', 'Ginkgo biloba'],
    Sapindaceae: ['Koelreuteria paniculata', 'Koelreuteria bipinnata', 'Koelreuteria elegans', 'Sapindus saponaria', 'Acer rubrum'],
    Fabaceae: ['Mimosa pigra', 'Mimosa diplotricha', 'Mimosa pudica', 'Albizia julibrissin', 'Senna alata'],
    Nelumbonaceae: ['Nelumbo lutea', 'Nelumbo nucifera'],
    Nepenthaceae: ['Nepenthes rafflesiana', 'Nepenthes ampullaria', 'Nepenthes mirabilis', 'Nepenthes gracilis', 'Nepenthes tentaculata', 'Nepenthes rajah'],
    Nephrolepidaceae: ['Nephrolepis exaltata', 'Nephrolepis biserrata', 'Nephrolepis cordifolia', 'Nephrolepis falcata'],
    Pinaceae: ['Pinus densiflora', 'Pinus thunbergii', 'Pinus sylvestris', 'Pinus tabuliformis', 'Pinus massoniana', 'Pinus nigra'],
    Polypodiaceae: ['Platycerium bifurcatum', 'Platycerium superbum', 'Platycerium coronarium', 'Platycerium alcicorne', 'Platycerium grande'],
    Alvarezsauridae: ['Mononykus olecranus', 'Shuvuuia deserti', 'Alvarezsaurus calvoi', 'Parvicursor remotus', 'Albertonykus borealis', 'Bannykus wulatensis', 'Linhenykus monodactylus'],
    Dromaeosauridae: ['Velociraptor mongoliensis', 'Deinonychus antirrhopus', 'Dromaeosaurus albertensis', 'Microraptor zhaoianus', 'Saurornitholestes langstoni', 'Zhenyuanlong suni', 'Balaur bondoc', 'Pyroraptor olympius'],
    Abelisauridae: ['Carnotaurus sastrei', 'Majungasaurus crenatissimus', 'Abelisaurus comahuensis', 'Aucasaurus garridoi', 'Rugops primus', 'Skorpiovenator bustingorryi', 'Eoabelisaurus mefi'],
    Ornithischia: ['Lesothosaurus diagnosticus', 'Heterodontosaurus tucki', 'Scutellosaurus lawleri', 'Eocursor parvus', 'Agilisaurus louderbacki'],
    Stegosauridae: ['Kentrosaurus aethiopicus', 'Tuojiangosaurus multispinus', 'Miragaia longicollum', 'Hesperosaurus mjosi', 'Wuerhosaurus homheni', 'Stegosaurus stenops'],
    Tyrannosauridae: ['Tyrannosaurus rex', 'Tarbosaurus bataar', 'Gorgosaurus libratus', 'Albertosaurus sarcophagus', 'Daspletosaurus torosus', 'Zhuchengtyrannus magnus', 'Alioramus remotus'],
    Proceratosauridae: ['Guanlong wucaii', 'Sinotyrannus kazuoensis', 'Proceratosaurus bradleyi', 'Yutyrannus huali'],
    Hieraaetus: ['Hieraaetus morphnoides', 'Hieraaetus pennatus', 'Hieraaetus wahlbergi', 'Hieraaetus ayresii'],
    Dinocrocuta: ['Dinocrocuta algeriensis', 'Dinocrocuta gigantea', 'Dinocrocuta salonicae', 'Dinocrocuta senyureki'],
    Dunkleosteus: ['Dunkleosteus intermedius', 'Dunkleosteus amblyodoratus'],
    Mammuthus: ['Mammuthus primigenius', 'Mammuthus columbi', 'Mammuthus meridionalis', 'Mammuthus trogontherii'],
    Koelreuteria: ['Koelreuteria paniculata', 'Koelreuteria bipinnata'],
    Mimosa: ['Mimosa pigra', 'Mimosa diplotricha'],
    Dickinsonia: ['Dickinsonia tenuis', 'Dickinsonia rex', 'Dickinsonia lissa', 'Dickinsonia menneri'],
    Muntiacus: ['Muntiacus muntjak', 'Muntiacus reevesi', 'Muntiacus vuquangensis', 'Muntiacus crinifrons'],
    Spinosauridae: ['Spinosaurus aegyptiacus', 'Baryonyx walkeri', 'Suchomimus tenerensis', 'Irritator challengeri', 'Ichthyovenator laosensis', 'Vallibonavenatrix cani'],
    Scansoriopterygidae: ['Yi qi', 'Epidexipteryx hui', 'Scansoriopteryx heilmanni', 'Ambopteryx longibrachium'],
    Ceratopsia: ['Protoceratops andrewsi', 'Psittacosaurus mongoliensis', 'Yinlong downsi', 'Auroraceratops rugosus', 'Zuniceratops christopheri', 'Yamaceratops dorngobiensis', 'Leptoceratops gracilis'],
    Rhabdodontidae: ['Mochlodon suessi', 'Rhabdodon priscus', 'Zalmoxes shqiperorum', 'Zalmoxes robustus'],
    Aioloceras: ['Aioloceras jonesi'],
    Wiwaxia: ['Wiwaxia foliosa', 'Wiwaxia taijiangensis'],
    Edestus: ['Edestus minor', 'Edestus giganteus'],
    Hurdiidae: ['Hurdia victoria', 'Cambroraster falcatus', 'Stanleycaris hirpex'],
    Luolishaniidae: ['Luolishania longicruris', 'Collinsium ciliosum', 'Ovatiovermis cribratus'],
    Psammosteidae: ['Psammosteus megalopteryx', 'Psammolepis paradoxa', 'Drepanaspis gemuendenensis'],
    Paroedura: ['Paroedura androyensis', 'Paroedura bastardi', 'Paroedura gracilis', 'Paroedura masobe', 'Paroedura oviceps', 'Paroedura stumpffi'],
    Nephrurus: ['Nephrurus amyae', 'Nephrurus asper', 'Nephrurus deleani', 'Nephrurus laevissimus', 'Nephrurus stellatus', 'Nephrurus vertebralis', 'Nephrurus wheeleri'],
    Varanus: ['Varanus komodoensis', 'Varanus niloticus', 'Varanus bengalensis', 'Varanus rudicollis', 'Varanus prasinus', 'Varanus salvadorii'],
    Cuora: ['Cuora trifasciata', 'Cuora mouhotii', 'Cuora amboinensis', 'Cuora galbinifrons', 'Cuora zhoui', 'Cuora mccordi'],
    Eublepharis: ['Eublepharis angramainyu', 'Eublepharis hardwickii', 'Eublepharis fuscus', 'Eublepharis satpuraensis'],
    Cynomys: ['Cynomys leucurus', 'Cynomys gunnisoni', 'Cynomys mexicanus', 'Cynomys parvidens'],
    Megaceryle: ['Megaceryle alcyon', 'Megaceryle torquata', 'Megaceryle maxima'],
    Petaurus: ['Petaurus norfolcensis', 'Petaurus australis', 'Petaurus notatus', 'Petaurus ariel'],
    Polypedates: ['Polypedates leucomystax', 'Polypedates maculatus', 'Polypedates otilophus', 'Polypedates colletti'],
    Rhacodactylus: ['Rhacodactylus auriculatus', 'Rhacodactylus trachyrhynchus', 'Rhacodactylus trachycephalus'],
    Tarentola: ['Tarentola mauritanica', 'Tarentola annularis', 'Tarentola deserti', 'Tarentola boehmei'],
    Quartz: ['Cristobalite', 'Tridymite', 'Coesite', 'Stishovite', 'Moganite'],
    Asteroidea: ['Forcipulatida', 'Valvatida', 'Paxillosida', 'Velatida', 'Spinulosida'],
    Dastilbe: ['Chanos chanos', 'Tharrhias araripis'],
    Chanidae: ['Chanos chanos', 'Tharrhias araripis'],
    Shuraboprosbole: ['Anthoscytina longa', 'Jurocercopis grandis'],
    Procercopidae: ['Anthoscytina longa', 'Jurocercopis grandis'],
    Douvilleiceras: ['Douvilleiceras mammillatum', 'Douvilleiceras inaequinodum'],
    Douvilleiceratidae: ['Douvilleiceras mammillatum', 'Cheloniceras cornuelianum'],
    Tabanidae: ['Tabanus bovinus', 'Haematopota pluvialis'],
    Hemipristis: ['Hemipristis elongata', 'Hemipristis serra'],
    Hemigaleidae: ['Hemipristis elongata', 'Hemigaleus microstoma', 'Paragaleus randalli'],
    Diodon: ['Diodon hystrix', 'Diodon holocanthus', 'Diodon sigma'],
    Diodontidae: ['Diodon hystrix', 'Diodon holocanthus', 'Chilomycterus reticulatus']
  };

  function genusOfName(name) {
    var parts = String(name || '').replace(/^\u2020/, '').trim().split(/\s+/);
    if (/^(cf\.|aff\.)$/i.test(parts[0])) parts.shift();
    return parts[0] || '';
  }

  function familyFromTaxonomy(taxonomy) {
    var parts = String(taxonomy || '').split(' \u2192 ');
    var i;
    for (i = parts.length - 1; i >= 0; i -= 1) {
      var part = parts[i].trim();
      if (/idae$|aceae$|iformes$|omorpha$|ida$|podia$/i.test(part) && part.indexOf(' ') < 0) return part;
    }
    return '';
  }

  function closeKinNames(specimen, limit) {
    var selected = String(specimen.scientificName || '').trim();
    var genus = genusOfName(selected);
    var family = familyFromTaxonomy(specimen.taxonomy) || GENUS_FAMILY[genus] || '';
    var names = [];
    function add(name) {
      name = String(name || '').replace(/\s+/g, ' ').trim();
      if (!name || name === selected) return;
      if (names.indexOf(name) !== -1) return;
      if (/^(Trilobite|Ammonoidea)\s+sp\.?$/i.test(name)) return;
      names.push(name);
    }
    specimenCandidates.forEach(function (item) {
      if (item.id === specimen.id) return;
      if (genusOfName(item.scientificName) === genus) add(item.scientificName);
    });
    var cap = limit || 8;
    (CLOSE_KIN[genus] || []).forEach(add);
    if (names.length < cap) (CLOSE_KIN[family] || []).forEach(add);
    if (names.length < cap && family) {
      specimenCandidates.forEach(function (item) {
        if (item.id === specimen.id) return;
        var itemFamily = familyFromTaxonomy(item.taxonomy) || GENUS_FAMILY[genusOfName(item.scientificName)] || '';
        if (itemFamily && itemFamily === family) add(item.scientificName);
      });
    }
    return names.slice(0, cap);
  }

  function relatedSpecimensFor(specimen) {
    var names = closeKinNames(specimen, 2);
    var genus = genusOfName(specimen.scientificName);
    while (names.length < 2) names.push(genus);
    return names.slice(0, 2).map(function (name, index) {
      return {
        id: 'related-' + specimen.id + '-' + index,
        scientificName: name,
        commonName: '',
        category: specimen.category
      };
    });
  }

  var FAMILY_CLADE = {
    Odontopleuridae: 'Trilobita', Proetidae: 'Trilobita', Calymenidae: 'Trilobita', Asaphidae: 'Trilobita',
    Naraoiidae: 'Artiopoda', Trilobita: 'Arthropoda', Whiteiidae: 'Actinistia', Ceratophryidae: 'Anura',
    Nostoceratidae: 'Ammonitida', Ammonoidea: 'Cephalopoda', Pachydiscidae: 'Ammonitida',
    Diprotodontidae: 'Diprotodontia', Pteraspidiformes: 'Pteraspidomorphi', Eugeneodontiformes: 'Chondrichthyes',
    Marrellomorpha: 'Arthropoda', Halwaxiida: 'Halwaxiida', Megacheira: 'Arthropoda', Radiodonta: 'Arthropoda',
    Lobopodia: 'Panarthropoda', Proterosuchidae: 'Archosauromorpha', Rhynchosauridae: 'Archosauromorpha',
    Menippidae: 'Decapoda', Dickinsoniidae: 'Proarticulata', Accipitridae: 'Aves', Dinichthyidae: 'Placodermi',
    Petromyzontiformes: 'Cyclostomi', Uraraneida: 'Arachnida', Scutellidae: 'Echinoidea',
    Crocodylia: 'Archosauria', Cryptobranchidae: 'Caudata', Lophophyllidae: 'Rugosa', Mosasauridae: 'Mosasauroidea', Mosasauroidea: 'Squamata',
    Lucanidae: 'Coleoptera', Elateridae: 'Coleoptera', Scarabaeidae: 'Coleoptera', Buprestidae: 'Coleoptera',
    Nymphalidae: 'Lepidoptera', Hesperiidae: 'Lepidoptera', Papilionidae: 'Lepidoptera', Lycaenidae: 'Lepidoptera',
    Formicidae: 'Hymenoptera', Pteridaceae: 'Polypodiopsida', Droseraceae: 'Caryophyllales', Ginkgoaceae: 'Ginkgoopsida',
    Sapindaceae: 'Sapindales', Fabaceae: 'Fabales', Nelumbonaceae: 'Proteales', Nepenthaceae: 'Caryophyllales',
    Nephrolepidaceae: 'Polypodiopsida', Pinaceae: 'Pinales', Polypodiaceae: 'Polypodiopsida',
    Alvarezsauridae: 'Theropoda', Dromaeosauridae: 'Theropoda', Abelisauridae: 'Theropoda', Ornithischia: 'Dinosauria',
    Stegosauridae: 'Ornithischia', Tyrannosauridae: 'Theropoda', Spinosauridae: 'Theropoda',
    Scansoriopterygidae: 'Theropoda', Ceratopsia: 'Ornithischia', Rhabdodontidae: 'Ornithischia'
  };

  function rankRow(zh, latin, author) {
    return { zh: zh, latin: latin, author: author || '' };
  }

  var RANK = {
    animal: ['\u52d5\u7269\u754c', 'Animalia'],
    plant: ['\u690d\u7269\u754c', 'Plantae'],
    chord: ['\u810a\u7d22\u52d5\u7269\u9580', 'Chordata'],
    arth: ['\u7bc0\u80a2\u52d5\u7269\u9580', 'Arthropoda'],
    moll: ['\u8edf\u9ad4\u52d5\u7269\u9580', 'Mollusca'],
    cnid: ['\u523a\u80de\u52d5\u7269\u9580', 'Cnidaria'],
    echin: ['\u68d8\u76ae\u52d5\u7269\u9580', 'Echinodermata'],
    trach: ['\u7dad\u7ba1\u690d\u7269\u9580', 'Tracheophyta'],
    mammal: ['\u54fa\u4e73\u7db1', 'Mammalia'],
    reptile: ['\u722c\u884c\u7db1', 'Reptilia'],
    bird: ['\u9ce5\u7db1', 'Aves'],
    amph: ['\u5169\u68f2\u7db1', 'Amphibia'],
    insect: ['\u6606\u87f2\u7db1', 'Insecta'],
    trilobite: ['\u4e09\u8449\u87f2\u7db1', 'Trilobita'],
    ceph: ['\u982d\u8db3\u7db1', 'Cephalopoda'],
    anth: ['\u73ca\u745a\u87f2\u7db1', 'Anthozoa'],
    echinoidea: ['\u6d77\u81bd\u7db1', 'Echinoidea'],
    malaco: ['\u8edf\u7532\u7db1', 'Malacostraca'],
    arach: ['\u86db\u5f62\u7db1', 'Arachnida'],
    chond: ['\u8edf\u9aa8\u9b5a\u7db1', 'Chondrichthyes'],
    sarco: ['\u8089\u9c2d\u9b5a\u7db1', 'Sarcopterygii'],
    placo: ['\u76fe\u76ae\u9b5a\u7db1', 'Placodermi'],
    fern: ['\u771f\u8568\u7db1', 'Polypodiopsida'],
    pine: ['\u677e\u67cf\u7db1', 'Pinopsida'],
    ginkgoC: ['\u9280\u674f\u7db1', 'Ginkgoopsida'],
    magno: ['\u6728\u862d\u7db1', 'Magnoliopsida'],
    coleoptera: ['\u9798\u7fc5\u76ee', 'Coleoptera'],
    lepidoptera: ['\u9c57\u7fc5\u76ee', 'Lepidoptera'],
    hymenoptera: ['\u819c\u7fc5\u76ee', 'Hymenoptera'],
    saurischia: ['\u8725\u81c0\u76ee', 'Saurischia'],
    ornithischia: ['\u9ce5\u81c0\u76ee', 'Ornithischia'],
    theropod: ['\u7378\u8173\u4e9e\u76ee', 'Theropoda'],
    squamata: ['\u6709\u9c57\u76ee', 'Squamata'],
    ammonitida: ['\u83ca\u77f3\u76ee', 'Ammonitida'],
    dino: ['\u6050\u9f8d\u985e', 'Dinosauria'],
    archosaur: ['\u4e3b\u9f8d\u985e', 'Archosauria'],
    lepido: ['\u9c57\u9f8d\u985e', 'Lepidosauria'],
    placenta: ['\u80ce\u76e4\u4e0b\u7db1', 'Placentalia'],
    scarabIF: ['\u91d1\u9f9c\u4e0b\u76ee', 'Scarabaeiformia'],
    elaterIF: ['\u53e9\u7532\u4e0b\u76ee', 'Elateriformia'],
    polyphaga: ['\u591a\u98df\u4e9e\u76ee', 'Polyphaga'],
    glossata: ['\u6709\u5599\u4e9e\u76ee', 'Glossata'],
    papilioSF: ['\u9cf3\u8776\u8d85\u79d1', 'Papilionoidea'],
    scarabSF: ['\u91d1\u9f9c\u8d85\u79d1', 'Scarabaeoidea'],
    gekkota: ['\u58c1\u864e\u4e0b\u76ee', 'Gekkota'],
    testudines: ['\u9f9c\u9c1c\u76ee', 'Testudines'],
    anguimorpha: ['\u86c7\u8725\u4e0b\u76ee', 'Anguimorpha'],
    rodentia: ['\u9f67\u9f52\u76ee', 'Rodentia'],
    coracii: ['\u4f5b\u6cd5\u50e7\u76ee', 'Coraciiformes'],
    anura: ['\u7121\u5c3e\u76ee', 'Anura']
  };

  function rankChain(pairs) {
    return pairs.map(function (pair) { return rankRow(pair[0], pair[1]); });
  }

  var FAMILY_RANKS = {
    Odontopleuridae: [RANK.animal, RANK.arth, RANK.trilobite, ['\u9f52\u808b\u87f2\u76ee', 'Odontopleurida'], ['\u9f52\u808b\u87f2\u79d1', 'Odontopleuridae']],
    Proetidae: [RANK.animal, RANK.arth, RANK.trilobite, ['\u7811\u982d\u87f2\u76ee', 'Proetida'], ['\u7811\u982d\u87f2\u4e9e\u76ee', 'Proetina'], ['\u7811\u982d\u87f2\u79d1', 'Proetidae']],
    Calymenidae: [RANK.animal, RANK.arth, RANK.trilobite, ['\u93e1\u773c\u87f2\u76ee', 'Phacopida'], ['\u96b1\u982d\u87f2\u4e9e\u76ee', 'Calymenina'], ['\u96b1\u982d\u87f2\u79d1', 'Calymenidae']],
    Asaphidae: [RANK.animal, RANK.arth, RANK.trilobite, ['\u6adb\u87f2\u76ee', 'Asaphida'], ['\u6adb\u87f2\u4e9e\u76ee', 'Asaphina'], ['\u6adb\u87f2\u79d1', 'Asaphidae']],
    Naraoiidae: [RANK.animal, RANK.arth, ['\u7d0d\u7f85\u87f2\u76ee', 'Nektaspida'], ['\u7d0d\u7f85\u87f2\u79d1', 'Naraoiidae']],
    Whiteiidae: [RANK.animal, RANK.chord, RANK.sarco, ['\u8154\u68d8\u9b5a\u4e9e\u7db1', 'Actinistia'], ['\u8154\u68d8\u9b5a\u76ee', 'Coelacanthiformes'], ['\u61f7\u7279\u9b5a\u79d1', 'Whiteiidae']],
    Ceratophryidae: [RANK.animal, RANK.chord, RANK.amph, ['\u7121\u5c3e\u76ee', 'Anura'], ['\u65b0\u86d9\u4e9e\u76ee', 'Neobatrachia'], ['\u89d2\u82b1\u87fe\u79d1', 'Ceratophryidae']],
    Nostoceratidae: [RANK.animal, RANK.moll, RANK.ceph, ['\u83ca\u77f3\u4e9e\u7db1', 'Ammonoidea'], RANK.ammonitida, ['\u9264\u83ca\u77f3\u4e9e\u76ee', 'Ancyloceratina'], ['\u5854\u83ca\u77f3\u8d85\u79d1', 'Turrilitoidea'], ['\u5ff5\u73e0\u83ca\u77f3\u79d1', 'Nostoceratidae']],
    Pachydiscidae: [RANK.animal, RANK.moll, RANK.ceph, ['\u83ca\u77f3\u4e9e\u7db1', 'Ammonoidea'], RANK.ammonitida, ['\u83ca\u77f3\u4e9e\u76ee', 'Ammonitina'], ['\u5e36\u83ca\u77f3\u8d85\u79d1', 'Desmoceratoidea'], ['\u539a\u76e4\u83ca\u77f3\u79d1', 'Pachydiscidae']],
    Douvilleiceratidae: [RANK.animal, RANK.moll, RANK.ceph, ['\u83ca\u77f3\u4e9e\u7db1', 'Ammonoidea'], RANK.ammonitida, ['\u9264\u83ca\u77f3\u4e9e\u76ee', 'Ancyloceratina'], ['\u675c\u7dad\u723e\u83ca\u77f3\u8d85\u79d1', 'Douvilleiceratoidea'], ['\u675c\u7dad\u723e\u83ca\u77f3\u79d1', 'Douvilleiceratidae']],
    Diprotodontidae: [RANK.animal, RANK.chord, RANK.mammal, ['\u6709\u888b\u4e0b\u7db1', 'Marsupialia'], ['\u96d9\u9580\u9f52\u76ee', 'Diprotodontia'], ['\u888b\u718a\u4e9e\u76ee', 'Vombatiformes'], ['\u96d9\u9580\u9f52\u79d1', 'Diprotodontidae']],
    Hyaenidae: [RANK.animal, RANK.chord, RANK.mammal, RANK.placenta, ['\u98df\u8089\u76ee', 'Carnivora'], ['\u8c93\u578b\u4e9e\u76ee', 'Feliformia'], ['\u9b2a\u72d7\u79d1', 'Hyaenidae']],
    Elephantidae: [RANK.animal, RANK.chord, RANK.mammal, RANK.placenta, ['\u9577\u9f3b\u76ee', 'Proboscidea'], ['\u8c61\u79d1', 'Elephantidae']],
    Cervidae: [RANK.animal, RANK.chord, RANK.mammal, RANK.placenta, ['\u5076\u8e44\u76ee', 'Artiodactyla'], ['\u53cd\u82bb\u4e9e\u76ee', 'Ruminantia'], ['\u6709\u89d2\u4e0b\u76ee', 'Pecora'], ['\u9e7f\u79d1', 'Cervidae']],
    Proterosuchidae: [RANK.animal, RANK.chord, RANK.reptile, ['\u4e3b\u9f8d\u578b\u985e', 'Archosauromorpha'], ['\u4e3b\u9f8d\u5f62\u985e', 'Archosauriformes'], ['\u539f\u9c31\u79d1', 'Proterosuchidae']],
    Rhynchosauridae: [RANK.animal, RANK.chord, RANK.reptile, ['\u4e3b\u9f8d\u578b\u985e', 'Archosauromorpha'], ['\u5599\u982d\u9f8d\u76ee', 'Rhynchosauria'], ['\u5599\u982d\u9f8d\u79d1', 'Rhynchosauridae']],
    Menippidae: [RANK.animal, RANK.arth, RANK.malaco, ['\u5341\u8173\u76ee', 'Decapoda'], ['\u62b1\u5375\u4e9e\u76ee', 'Pleocyemata'], ['\u77ed\u5c3e\u4e0b\u76ee', 'Brachyura'], ['\u54f2\u87f9\u8d85\u79d1', 'Eriphioidea'], ['\u54f2\u87f9\u79d1', 'Menippidae']],
    Dickinsoniidae: [RANK.animal, ['\u524d\u5206\u7bc0\u52d5\u7269\u985e', 'Proarticulata'], ['\u72c4\u66f4\u905c\u87f2\u79d1', 'Dickinsoniidae']],
    Accipitridae: [RANK.animal, RANK.chord, RANK.bird, ['\u9df9\u5f62\u76ee', 'Accipitriformes'], ['\u9df9\u79d1', 'Accipitridae']],
    Cryptobranchidae: [RANK.animal, RANK.chord, RANK.amph, ['\u6709\u5c3e\u76ee', 'Caudata'], ['\u96b1\u9c13\u9be2\u4e9e\u76ee', 'Cryptobranchoidea'], ['\u96b1\u9c13\u9be2\u79d1', 'Cryptobranchidae']],
    Lophophyllidae: [RANK.animal, RANK.cnid, RANK.anth, ['\u76ba\u7d0b\u73ca\u745a\u4e9e\u7db1', 'Rugosa'], ['\u67f1\u73ca\u745a\u76ee', 'Stauriida'], ['\u9802\u67f1\u73ca\u745a\u79d1', 'Lophophyllidae']],
    Mosasauridae: [RANK.animal, RANK.chord, RANK.reptile, RANK.lepido, RANK.squamata, ['\u6ec4\u9f8d\u8d85\u79d1', 'Mosasauroidea'], ['\u6ec4\u9f8d\u79d1', 'Mosasauridae']],
    Echinarachniidae: [RANK.animal, RANK.echin, RANK.echinoidea, ['\u76fe\u5f62\u76ee', 'Clypeasteroida'], ['\u76fe\u6d77\u81bd\u4e9e\u76ee', 'Scutellina'], ['\u9905\u6d77\u81bd\u79d1', 'Echinarachniidae']],
    Lucanidae: [RANK.animal, RANK.arth, RANK.insect, RANK.coleoptera, RANK.polyphaga, RANK.scarabIF, RANK.scarabSF, ['\u936c\u5f62\u87f2\u79d1', 'Lucanidae']],
    Elateridae: [RANK.animal, RANK.arth, RANK.insect, RANK.coleoptera, RANK.polyphaga, RANK.elaterIF, ['\u53e9\u7532\u8d85\u79d1', 'Elateroidea'], ['\u53e9\u982d\u87f2\u79d1', 'Elateridae']],
    Scarabaeidae: [RANK.animal, RANK.arth, RANK.insect, RANK.coleoptera, RANK.polyphaga, RANK.scarabIF, RANK.scarabSF, ['\u91d1\u9f9c\u5b50\u79d1', 'Scarabaeidae']],
    Buprestidae: [RANK.animal, RANK.arth, RANK.insect, RANK.coleoptera, RANK.polyphaga, RANK.elaterIF, ['\u5409\u4e01\u8d85\u79d1', 'Buprestoidea'], ['\u5409\u4e01\u87f2\u79d1', 'Buprestidae']],
    Nymphalidae: [RANK.animal, RANK.arth, RANK.insect, RANK.lepidoptera, RANK.glossata, RANK.papilioSF, ['\u86fa\u8776\u79d1', 'Nymphalidae']],
    Hesperiidae: [RANK.animal, RANK.arth, RANK.insect, RANK.lepidoptera, RANK.glossata, RANK.papilioSF, ['\u5f04\u8776\u79d1', 'Hesperiidae']],
    Papilionidae: [RANK.animal, RANK.arth, RANK.insect, RANK.lepidoptera, RANK.glossata, RANK.papilioSF, ['\u9cf3\u8776\u79d1', 'Papilionidae']],
    Lycaenidae: [RANK.animal, RANK.arth, RANK.insect, RANK.lepidoptera, RANK.glossata, RANK.papilioSF, ['\u7070\u8776\u79d1', 'Lycaenidae']],
    Formicidae: [RANK.animal, RANK.arth, RANK.insect, RANK.hymenoptera, ['\u7d30\u8170\u4e9e\u76ee', 'Apocrita'], ['\u87fb\u8d85\u79d1', 'Formicoidea'], ['\u87fb\u79d1', 'Formicidae']],
    Pteridaceae: [RANK.plant, RANK.trach, RANK.fern, ['\u6c34\u9f8d\u9aa8\u76ee', 'Polypodiales'], ['\u6c34\u9f8d\u9aa8\u4e9e\u76ee', 'Polypodiineae'], ['\u9cf3\u5c3e\u8568\u79d1', 'Pteridaceae']],
    Droseraceae: [RANK.plant, RANK.trach, RANK.magno, ['\u77f3\u7af9\u76ee', 'Caryophyllales'], ['\u8305\u818f\u83dc\u79d1', 'Droseraceae']],
    Ginkgoaceae: [RANK.plant, RANK.trach, RANK.ginkgoC, ['\u9280\u674f\u76ee', 'Ginkgoales'], ['\u9280\u674f\u79d1', 'Ginkgoaceae']],
    Sapindaceae: [RANK.plant, RANK.trach, RANK.magno, ['\u7121\u60a3\u5b50\u76ee', 'Sapindales'], ['\u7121\u60a3\u5b50\u79d1', 'Sapindaceae']],
    Fabaceae: [RANK.plant, RANK.trach, RANK.magno, ['\u8c46\u76ee', 'Fabales'], ['\u8c46\u79d1', 'Fabaceae']],
    Nelumbonaceae: [RANK.plant, RANK.trach, RANK.magno, ['\u5c71\u9f8d\u773c\u76ee', 'Proteales'], ['\u84ee\u79d1', 'Nelumbonaceae']],
    Nepenthaceae: [RANK.plant, RANK.trach, RANK.magno, ['\u77f3\u7af9\u76ee', 'Caryophyllales'], ['\u8c6c\u7c60\u8349\u79d1', 'Nepenthaceae']],
    Nephrolepidaceae: [RANK.plant, RANK.trach, RANK.fern, ['\u6c34\u9f8d\u9aa8\u76ee', 'Polypodiales'], ['\u6c34\u9f8d\u9aa8\u4e9e\u76ee', 'Polypodiineae'], ['\u814e\u8568\u79d1', 'Nephrolepidaceae']],
    Pinaceae: [RANK.plant, RANK.trach, RANK.pine, ['\u677e\u67cf\u76ee', 'Pinales'], ['\u677e\u79d1', 'Pinaceae']],
    Polypodiaceae: [RANK.plant, RANK.trach, RANK.fern, ['\u6c34\u9f8d\u9aa8\u76ee', 'Polypodiales'], ['\u6c34\u9f8d\u9aa8\u4e9e\u76ee', 'Polypodiineae'], ['\u6c34\u9f8d\u9aa8\u79d1', 'Polypodiaceae']],
    Alvarezsauridae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.saurischia, RANK.theropod, ['\u865b\u9aa8\u9f8d\u985e', 'Coelurosauria'], ['\u624b\u76dc\u9f8d\u985e', 'Maniraptora'], ['\u963f\u74e6\u62c9\u6148\u9f8d\u79d1', 'Alvarezsauridae']],
    Dromaeosauridae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.saurischia, RANK.theropod, ['\u865b\u9aa8\u9f8d\u985e', 'Coelurosauria'], ['\u624b\u76dc\u9f8d\u985e', 'Maniraptora'], ['\u8fd1\u9ce5\u985e', 'Paraves'], ['\u99b3\u9f8d\u79d1', 'Dromaeosauridae']],
    Abelisauridae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.saurischia, RANK.theropod, ['\u89d2\u9f3b\u9f8d\u985e', 'Ceratosauria'], ['\u963f\u8c9d\u529b\u9f8d\u8d85\u79d1', 'Abelisauroidea'], ['\u963f\u8c9d\u529b\u9f8d\u79d1', 'Abelisauridae']],
    Stegosauridae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.ornithischia, ['\u8986\u76fe\u7532\u9f8d\u985e', 'Thyreophora'], ['\u528d\u9f8d\u4e9e\u76ee', 'Stegosauria'], ['\u528d\u9f8d\u79d1', 'Stegosauridae']],
    Tyrannosauridae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.saurischia, RANK.theropod, ['\u865b\u9aa8\u9f8d\u985e', 'Coelurosauria'], ['\u66b4\u9f8d\u8d85\u79d1', 'Tyrannosauroidea'], ['\u66b4\u9f8d\u79d1', 'Tyrannosauridae']],
    Proceratosauridae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.saurischia, RANK.theropod, ['\u865b\u9aa8\u9f8d\u985e', 'Coelurosauria'], ['\u66b4\u9f8d\u8d85\u79d1', 'Tyrannosauroidea'], ['\u539f\u89d2\u9f3b\u9f8d\u79d1', 'Proceratosauridae']],
    Spinosauridae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.saurischia, RANK.theropod, ['\u5805\u5c3e\u9f8d\u985e', 'Tetanurae'], ['\u6591\u9f8d\u8d85\u79d1', 'Megalosauroidea'], ['\u68d8\u9f8d\u79d1', 'Spinosauridae']],
    Scansoriopterygidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.saurischia, RANK.theropod, ['\u865b\u9aa8\u9f8d\u985e', 'Coelurosauria'], ['\u624b\u76dc\u9f8d\u985e', 'Maniraptora'], ['\u64c5\u6500\u9ce5\u9f8d\u79d1', 'Scansoriopterygidae']],
    Rhabdodontidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.ornithischia, ['\u9ce5\u8173\u4e9e\u76ee', 'Ornithopoda'], ['\u79bd\u9f8d\u985e', 'Iguanodontia'], ['\u51f9\u9f52\u9f8d\u79d1', 'Rhabdodontidae'], ['\u51f9\u9f52\u9f8d\u4e9e\u79d1', 'Rhabdodontinae']],
    Gekkonidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.lepido, RANK.squamata, RANK.gekkota, ['\u58c1\u864e\u8d85\u79d1', 'Gekkonoidea'], ['\u58c1\u864e\u79d1', 'Gekkonidae']],
    Carphodactylidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.lepido, RANK.squamata, RANK.gekkota, ['\u9c57\u8173\u864e\u8d85\u79d1', 'Pygopodoidea'], ['\u7624\u8dbe\u864e\u79d1', 'Carphodactylidae']],
    Eublepharidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.lepido, RANK.squamata, RANK.gekkota, ['\u58c1\u864e\u8d85\u79d1', 'Gekkonoidea'], ['\u77bc\u864e\u79d1', 'Eublepharidae']],
    Diplodactylidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.lepido, RANK.squamata, RANK.gekkota, ['\u9c57\u8173\u864e\u8d85\u79d1', 'Pygopodoidea'], ['\u96d9\u8dbe\u864e\u79d1', 'Diplodactylidae']],
    Phyllodactylidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.lepido, RANK.squamata, RANK.gekkota, ['\u58c1\u864e\u8d85\u79d1', 'Gekkonoidea'], ['\u8449\u8dbe\u864e\u79d1', 'Phyllodactylidae']],
    Varanidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.lepido, RANK.squamata, ['\u6bd2\u8725\u985e', 'Toxicofera'], RANK.anguimorpha, ['\u53e4\u86c7\u8725\u985e', 'Paleoanguimorpha'], ['\u5de8\u8725\u8d85\u79d1', 'Varanoidea'], ['\u5de8\u8725\u79d1', 'Varanidae']],
    Geoemydidae: [RANK.animal, RANK.chord, RANK.reptile, RANK.testudines, ['\u96b1\u9838\u4e9e\u76ee', 'Cryptodira'], ['\u9678\u9f9c\u8d85\u79d1', 'Testudinoidea'], ['\u5730\u9f9c\u79d1', 'Geoemydidae']],
    Sciuridae: [RANK.animal, RANK.chord, RANK.mammal, RANK.placenta, RANK.rodentia, ['\u677e\u9f20\u4e9e\u76ee', 'Sciuromorpha'], ['\u677e\u9f20\u79d1', 'Sciuridae']],
    Alcedinidae: [RANK.animal, RANK.chord, RANK.bird, RANK.coracii, ['\u7fe0\u9ce5\u79d1', 'Alcedinidae']],
    Petauridae: [RANK.animal, RANK.chord, RANK.mammal, ['\u6709\u888b\u4e0b\u7db1', 'Marsupialia'], ['\u96d9\u9580\u9f52\u76ee', 'Diprotodontia'], ['\u888b\u8c82\u4e9e\u76ee', 'Phalangeriformes'], ['\u888b\u9f2c\u8d85\u79d1', 'Petauroidea'], ['\u888b\u9f2c\u79d1', 'Petauridae']],
    Rhacophoridae: [RANK.animal, RANK.chord, RANK.amph, RANK.anura, ['\u65b0\u86d9\u4e9e\u76ee', 'Neobatrachia'], ['\u86d9\u8d85\u79d1', 'Ranoidea'], ['\u6a39\u86d9\u79d1', 'Rhacophoridae']],
    Procercopidae: [RANK.animal, RANK.arth, RANK.insect, ['\u534a\u7fc5\u76ee', 'Hemiptera'], ['\u6cab\u87ec\u7e3d\u79d1', 'Cercopoidea'], ['\u539f\u87ec\u79d1', 'Procercopidae']],
    Tabanidae: [RANK.animal, RANK.arth, RANK.insect, ['\u96d9\u7fc5\u76ee', 'Diptera'], ['\u77ed\u89d2\u4e9e\u76ee', 'Brachycera'], ['\u866b\u79d1', 'Tabanidae']],
    Chanidae: [RANK.animal, RANK.chord, ['\u8f3b\u9c2d\u9b5a\u7db1', 'Actinopterygii'], ['\u9f20\u9c60\u76ee', 'Gonorynchiformes'], ['\u906e\u76ee\u9b5a\u79d1', 'Chanidae']],
    Hemigaleidae: [RANK.animal, RANK.chord, RANK.chond, ['\u771f\u9b5a\u76ee', 'Carcharhiniformes'], ['\u534a\u92f8\u9f52\u9b5a\u79d1', 'Hemigaleidae']],
    Diodontidae: [RANK.animal, RANK.chord, ['\u8f3b\u9c2d\u9b5a\u7db1', 'Actinopterygii'], ['\u9c27\u5f62\u76ee', 'Tetraodontiformes'], ['\u523a\u9b69\u79d1', 'Diodontidae']]
  };

  var GENUS_LADDER = {
    Trilobite: [RANK.animal, RANK.arth, RANK.trilobite],
    Ammonoidea: [RANK.animal, RANK.moll, RANK.ceph, ['\u83ca\u77f3\u4e9e\u7db1', 'Ammonoidea']],
    Insecta: [RANK.animal, RANK.arth, RANK.insect],
    Coleoptera: [RANK.animal, RANK.arth, RANK.insect, RANK.coleoptera],
    Mosasauroidea: [RANK.animal, RANK.chord, RANK.reptile, RANK.lepido, RANK.squamata, ['\u6ec4\u9f8d\u8d85\u79d1', 'Mosasauroidea']],
    Borealosuchus: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, ['\u507d\u9c31\u985e', 'Pseudosuchia'], ['\u9c31\u5f62\u985e', 'Crocodylomorpha'], ['\u9c31\u578b\u985e', 'Crocodyliformes'], ['\u771f\u9c31\u985e', 'Eusuchia']],
    Eocursor: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.ornithischia],
    Yamaceratops: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.ornithischia, ['\u982d\u98fe\u9f8d\u985e', 'Marginocephalia'], ['\u89d2\u9f8d\u4e0b\u76ee', 'Ceratopsia']],
    Zuniceratops: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.ornithischia, ['\u982d\u98fe\u9f8d\u985e', 'Marginocephalia'], ['\u89d2\u9f8d\u4e0b\u76ee', 'Ceratopsia']],
    Protoceratops: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.ornithischia, ['\u982d\u98fe\u9f8d\u985e', 'Marginocephalia'], ['\u89d2\u9f8d\u4e0b\u76ee', 'Ceratopsia'], ['\u539f\u89d2\u9f8d\u79d1', 'Protoceratopsidae']],
    Psittacosaurus: [RANK.animal, RANK.chord, RANK.reptile, RANK.archosaur, RANK.dino, RANK.ornithischia, ['\u982d\u98fe\u9f8d\u985e', 'Marginocephalia'], ['\u89d2\u9f8d\u4e0b\u76ee', 'Ceratopsia'], ['\u9e1a\u9d61\u9f8d\u79d1', 'Psittacosauridae']],
    Drepanaspis: [RANK.animal, RANK.chord, ['\u7ffc\u7532\u9b5a\u985e', 'Pteraspidomorphi'], ['\u7ffc\u7532\u9b5a\u76ee', 'Pteraspidiformes'], ['\u938c\u7532\u9b5a\u79d1', 'Psammosteidae']],
    Edestus: [RANK.animal, RANK.chord, RANK.chond, ['\u5c24\u91d1\u9f52\u9b5a\u76ee', 'Eugeneodontiformes'], ['\u526a\u9f52\u9b6a\u79d1', 'Edestidae']],
    Mimetaster: [RANK.animal, RANK.arth, ['\u99ac\u96f7\u62c9\u5f62\u985e', 'Marrellomorpha'], ['\u99ac\u96f7\u62c9\u87f2\u76ee', 'Marrellida'], ['\u64ec\u661f\u87f2\u79d1', 'Mimetasteridae']],
    Wiwaxia: [RANK.animal, ['\u54c8\u74e6\u590f\u985e', 'Halwaxiida'], ['\u5a01\u74e6\u897f\u4e9e\u87f2\u79d1', 'Wiwaxiidae']],
    Yohoia: [RANK.animal, RANK.arth, ['\u5927\u9644\u80a2\u985e', 'Megacheira'], ['\u7d04\u970d\u4e9e\u87f2\u76ee', 'Yohoiida'], ['\u7d04\u970d\u4e9e\u87f2\u79d1', 'Yohoiidae']],
    Peytoia: [RANK.animal, RANK.arth, ['\u5c04\u9f52\u76ee', 'Radiodonta'], ['\u8d6b\u5fb7\u8766\u79d1', 'Hurdiidae']],
    Caryosyntrips: [RANK.animal, RANK.arth, ['\u5c04\u9f52\u76ee', 'Radiodonta']],
    Ovatiovermis: [RANK.animal, RANK.arth, ['\u8449\u8db3\u985e', 'Lobopodia'], ['\u7f85\u54e9\u5c71\u87f2\u79d1', 'Luolishaniidae']],
    Collinsium: [RANK.animal, RANK.arth, ['\u8449\u8db3\u985e', 'Lobopodia'], ['\u7f85\u54e9\u5c71\u87f2\u79d1', 'Luolishaniidae']],
    Cardiodictyon: [RANK.animal, RANK.arth, ['\u8449\u8db3\u985e', 'Lobopodia'], ['\u5fc3\u7db2\u87f2\u79d1', 'Cardiodictyidae']],
    Dunkleosteus: [RANK.animal, RANK.chord, RANK.placo, ['\u7bc0\u7532\u9b5a\u76ee', 'Arthrodira'], ['\u77ed\u80f8\u4e9e\u76ee', 'Brachythoraci'], ['\u9127\u6c0f\u9b5a\u8d85\u79d1', 'Dunkleosteoidea'], ['\u9127\u6c0f\u9b5a\u79d1', 'Dunkleosteidae']],
    Titanichthys: [RANK.animal, RANK.chord, RANK.placo, ['\u7bc0\u7532\u9b5a\u76ee', 'Arthrodira'], ['\u77ed\u80f8\u4e9e\u76ee', 'Brachythoraci'], ['\u6cf0\u5766\u9b5a\u79d1', 'Titanichthyidae']],
    Priscomyzon: [RANK.animal, RANK.chord, ['\u4e03\u9c13\u9c3b\u7db1', 'Hyperoartia'], ['\u4e03\u9c13\u9c3b\u76ee', 'Petromyzontiformes'], ['\u539f\u4e03\u9c13\u9c3b\u79d1', 'Priscomyzontidae']],
    Attercopus: [RANK.animal, RANK.arth, RANK.arach, ['\u70cf\u62c9\u86db\u76ee', 'Uraraneida']],
    Quartz: [['\u6c27\u5316\u7269\u7db1', 'Oxides'], ['\u77f3\u82f1\u7fa4', 'Quartz group']],
    Calcite: [['\u78b3\u9178\u9e7d\u7db1', 'Carbonates'], ['\u65b9\u89e3\u77f3\u7fa4', 'Calcite group']],
    Rhodochrosite: [['\u78b3\u9178\u9e7d\u7db1', 'Carbonates'], ['\u65b9\u89e3\u77f3\u7fa4', 'Calcite group']],
    Azurite: [['\u78b3\u9178\u9e7d\u7db1', 'Carbonates']],
    Malachite: [['\u78b3\u9178\u9e7d\u7db1', 'Carbonates'], ['\u5b54\u96c0\u77f3\u7fa4', 'Malachite group']],
    Fluorite: [['\u9e75\u5316\u7269\u7db1', 'Halides'], ['\u87a2\u77f3\u7fa4', 'Fluorite group']],
    Galena: [['\u786b\u5316\u7269\u7db1', 'Sulfides'], ['\u65b9\u925b\u7926\u7fa4', 'Galena group']],
    Pyrite: [['\u786b\u5316\u7269\u7db1', 'Sulfides'], ['\u9ec3\u9435\u7926\u7fa4', 'Pyrite group']],
    Stibnite: [['\u786b\u5316\u7269\u7db1', 'Sulfides'], ['\u8f1d\u92af\u7926\u7fa4', 'Stibnite group']],
    Sulfur: [['\u81ea\u7136\u5143\u7d20\u7db1', 'Native elements'], ['\u786b\u7fa4', 'Sulfur group']],
    Asteroidea: [['\u52d5\u7269\u754c', 'Animalia'], ['\u68d8\u76ae\u52d5\u7269\u9580', 'Echinodermata'], ['\u6d77\u661f\u4e9e\u9580', 'Asterozoa'], ['\u6d77\u661f\u7db1', 'Asteroidea']],
    Bacteria: [['\u7d30\u83cc\u57df', 'Bacteria']],
    Chlamydomonas: [['\u771f\u6838\u751f\u7269\u57df', 'Eukaryota'], ['\u7da0\u8272\u690d\u7269\u754c', 'Viridiplantae'], ['\u7da0\u85fb\u9580', 'Chlorophyta'], ['\u7da0\u85fb\u7db1', 'Chlorophyceae'], ['\u8863\u85fb\u76ee', 'Chlamydomonadales'], ['\u8863\u85fb\u79d1', 'Chlamydomonadaceae']],
    Volvox: [['\u771f\u6838\u751f\u7269\u57df', 'Eukaryota'], ['\u7da0\u8272\u690d\u7269\u754c', 'Viridiplantae'], ['\u7da0\u85fb\u9580', 'Chlorophyta'], ['\u7da0\u85fb\u7db1', 'Chlorophyceae'], ['\u8863\u85fb\u76ee', 'Chlamydomonadales'], ['\u5718\u85fb\u79d1', 'Volvocaceae']],
    Euglena: [['\u771f\u6838\u751f\u7269\u57df', 'Eukaryota'], ['\u773c\u87f2\u9580', 'Euglenozoa'], ['\u773c\u87f2\u7db1', 'Euglenida'], ['\u773c\u87f2\u76ee', 'Euglenales'], ['\u773c\u87f2\u79d1', 'Euglenaceae']],
    Paramecium: [['\u771f\u6838\u751f\u7269\u57df', 'Eukaryota'], ['\u56ca\u6ce1\u87f2\u985e', 'Alveolata'], ['\u7e96\u6bdb\u87f2\u9580', 'Ciliophora'], ['\u5be1\u819c\u7db1', 'Oligohymenophorea'], ['\u7b46\u6bdb\u76ee', 'Peniculida'], ['\u8349\u5c65\u87f2\u79d1', 'Parameciidae']],
    Aspergillus: [['\u771f\u6838\u751f\u7269\u57df', 'Eukaryota'], ['\u771f\u83cc\u754c', 'Fungi'], ['\u5b50\u56ca\u83cc\u9580', 'Ascomycota'], ['\u6563\u56ca\u83cc\u7db1', 'Eurotiomycetes'], ['\u6563\u56ca\u83cc\u76ee', 'Eurotiales'], ['\u9eb4\u9ef4\u79d1', 'Aspergillaceae']],
    Saccharomyces: [['\u771f\u6838\u751f\u7269\u57df', 'Eukaryota'], ['\u771f\u83cc\u754c', 'Fungi'], ['\u5b50\u56ca\u83cc\u9580', 'Ascomycota'], ['\u9175\u6bcd\u7db1', 'Saccharomycetes'], ['\u9175\u6bcd\u76ee', 'Saccharomycetales'], ['\u9175\u6bcd\u79d1', 'Saccharomycetaceae']],
    Staphylococcus: [['\u7d30\u83cc\u57df', 'Bacteria'], ['\u539a\u58c1\u83cc\u9580', 'Bacillota'], ['\u82bd\u5b62\u687f\u83cc\u7db1', 'Bacilli'], ['\u82bd\u5b62\u687f\u83cc\u76ee', 'Caryophanales'], ['\u8461\u8404\u7403\u83cc\u79d1', 'Staphylococcaceae']],
    Bacillus: [['\u7d30\u83cc\u57df', 'Bacteria'], ['\u539a\u58c1\u83cc\u9580', 'Bacillota'], ['\u82bd\u5b62\u687f\u83cc\u7db1', 'Bacilli'], ['\u82bd\u5b62\u687f\u83cc\u76ee', 'Caryophanales'], ['\u82bd\u5b62\u687f\u83cc\u79d1', 'Bacillaceae']],
    Escherichia: [['\u7d30\u83cc\u57df', 'Bacteria'], ['\u5047\u55ae\u80de\u83cc\u9580', 'Pseudomonadota'], ['\u4f3d\u99ac\u8b8a\u5f62\u83cc\u7db1', 'Gammaproteobacteria'], ['\u8178\u687f\u83cc\u76ee', 'Enterobacterales'], ['\u8178\u687f\u83cc\u79d1', 'Enterobacteriaceae']],
    Nostoc: [['\u7d30\u83cc\u57df', 'Bacteria'], ['\u85cd\u83cc\u9580', 'Cyanobacteriota'], ['\u85cd\u83cc\u7db1', 'Cyanophyceae'], ['\u5ff5\u73e0\u85fb\u76ee', 'Nostocales'], ['\u5ff5\u73e0\u85fb\u79d1', 'Nostocaceae']]
  };

  var GENUS_FACE = {
    Dinocrocuta: { zh: '\u2020\u6050\u9b2a\u72d7\u5c6c', author: 'Schmidt-Kittler, 1975', extra: [['\u2020\u4e2d\u9b2a\u72d7\u4e9e\u79d1', 'Percrocutinae']] },
    Mammuthus: { zh: '\u2020\u731b\u7341\u8c61\u5c6c', extra: [['\u8c61\u4e9e\u79d1', 'Elephantinae']] },
    Muntiacus: { zh: '\u9e90\u5c6c', extra: [['\u9e7f\u4e9e\u79d1', 'Cervinae']] },
    Chunerpeton: { zh: '\u521d\u8788\u5c6c', extra: [['\u96b1\u9c13\u9be2\u4e9e\u79d1', 'Cryptobranchinae']] },
    Spinosaurus: { zh: '\u68d8\u9f8d\u5c6c', extra: [['\u68d8\u9f8d\u4e9e\u79d1', 'Spinosaurinae']] },
    Vallibonavenatrix: { extra: [['\u91cd\u722a\u9f8d\u4e9e\u79d1', 'Baryonychinae']] },
    Globidens: { extra: [['\u6ec4\u9f8d\u4e9e\u79d1', 'Mosasaurinae']] },
    Mosasaurus: { extra: [['\u6ec4\u9f8d\u4e9e\u79d1', 'Mosasaurinae']] },
    Prognathodon: { extra: [['\u6ec4\u9f8d\u4e9e\u79d1', 'Mosasaurinae']] },
    Tylosaurus: { extra: [['\u6d77\u738b\u9f8d\u4e9e\u79d1', 'Tylosaurinae']] },
    Platecarpus: { extra: [['\u6241\u638c\u9f8d\u4e9e\u79d1', 'Plioplatecarpinae']] },
    Aioloceras: { zh: '\u2020\u5c6c', author: 'Whitehouse, 1926', extra: [['\u675c\u7dad\u723e\u83ca\u77f3\u4e9e\u79d1', 'Douvilleiceratinae']] },
    Parapuzosia: { zh: '\u2020\u5c6c', author: 'Nowak, 1913', extra: [['\u539a\u76e4\u83ca\u77f3\u4e9e\u79d1', 'Pachydiscinae']] },
    Nipponites: { zh: '\u2020\u5c6c', author: 'Yabe, 1904', extra: [['\u5ff5\u73e0\u83ca\u77f3\u4e9e\u79d1', 'Nostoceratinae']] },
    Ginkgo: { zh: '\u9280\u674f\u5c6c' },
    Pinus: { zh: '\u677e\u5c6c', extra: [['\u677e\u4e9e\u79d1', 'Pinoideae']] },
    Nelumbo: { zh: '\u84ee\u5c6c' },
    Adiantum: { extra: [['\u66f8\u5e36\u8568\u4e9e\u79d1', 'Vittarioideae']] },
    Platycerium: { extra: [['\u9e7f\u89d2\u8568\u4e9e\u79d1', 'Platycerioideae']] },
    Drosera: { extra: [['\u8305\u818f\u83dc\u4e9e\u79d1', 'Droseroideae']] },
    Mimosa: { extra: [['\u8607\u6728\u4e9e\u79d1', 'Caesalpinioideae']] },
    Koelreuteria: { extra: [['\u7121\u60a3\u5b50\u4e9e\u79d1', 'Sapindoideae']] },
    Beelzebufo: { extra: [['\u89d2\u82b1\u87fe\u4e9e\u79d1', 'Ceratophryinae']] },
    Nimbadon: { extra: [['\u4e2d\u7378\u888b\u9f20\u4e9e\u79d1', 'Zygomaturinae']] },
    Hieraaetus: { extra: [['\u9d70\u4e9e\u79d1', 'Aquilinae']] },
    Hyperodapedon: { extra: [['\u8d85\u5599\u982d\u9f8d\u4e9e\u79d1', 'Hyperodapedontinae']] },
    Pseudocarcinus: { extra: [['\u54f2\u87f9\u4e9e\u79d1', 'Menippinae']] },
    Koneprusia: { extra: [['\u6708\u7259\u87f2\u4e9e\u79d1', 'Selenopeltinae']] },
    Gerastos: { extra: [['\u7811\u982d\u87f2\u4e9e\u79d1', 'Proetinae']] },
    Calymene: { extra: [['\u96b1\u982d\u87f2\u4e9e\u79d1', 'Calymeninae']] },
    Asaphus: { extra: [['\u6adb\u87f2\u4e9e\u79d1', 'Asaphinae']] },
    Linhenykus: { extra: [['\u5c0f\u99b3\u9f8d\u4e9e\u79d1', 'Parvicursorinae']] },
    Zhenyuanlong: { extra: [['\u5c0f\u76dc\u9f8d\u4e9e\u79d1', 'Microraptorinae']] },
    Stegosaurus: { extra: [['\u528d\u9f8d\u4e9e\u79d1', 'Stegosaurinae']] },
    Tarbosaurus: { extra: [['\u66b4\u9f8d\u4e9e\u79d1', 'Tyrannosaurinae']] },
    Zhuchengtyrannus: { extra: [['\u66b4\u9f8d\u4e9e\u79d1', 'Tyrannosaurinae']] },
    Ampedus: { extra: [['\u53e9\u982d\u87f2\u4e9e\u79d1', 'Elaterinae']] },
    Cheirotonus: { extra: [['\u9577\u81c2\u91d1\u9f9c\u4e9e\u79d1', 'Euchirinae']] },
    Dynastes: { extra: [['\u7280\u91d1\u9f9c\u4e9e\u79d1', 'Dynastinae']] },
    Xylotrupes: { extra: [['\u7280\u91d1\u9f9c\u4e9e\u79d1', 'Dynastinae']] },
    Chrysina: { extra: [['\u9e97\u91d1\u9f9c\u4e9e\u79d1', 'Rutelinae']] },
    Plusiotis: { extra: [['\u9e97\u91d1\u9f9c\u4e9e\u79d1', 'Rutelinae']] },
    Brachysiderus: { extra: [['\u9e97\u91d1\u9f9c\u4e9e\u79d1', 'Rutelinae']] },
    Ixorida: { extra: [['\u82b1\u91d1\u9f9c\u4e9e\u79d1', 'Cetoniinae']] },
    Paraponera: { extra: [['\u5b50\u5f48\u87fb\u4e9e\u79d1', 'Paraponerinae']] },
    Kaniska: { extra: [['\u86fa\u8776\u4e9e\u79d1', 'Nymphalinae']] },
    Polyura: { extra: [['\u87af\u86fa\u8776\u4e9e\u79d1', 'Charaxinae']] },
    Athyma: { extra: [['\u7dda\u86fa\u8776\u4e9e\u79d1', 'Limenitidinae']] },
    Borbo: { extra: [['\u5f04\u8776\u4e9e\u79d1', 'Hesperiinae']] },
    Graphium: { extra: [['\u9cf3\u8776\u4e9e\u79d1', 'Papilioninae']] },
    Acytolepis: { extra: [['\u773c\u7070\u8776\u4e9e\u79d1', 'Polyommatinae']] },
    Heliophorus: { extra: [['\u7070\u8776\u4e9e\u79d1', 'Lycaeninae']] },
    Phalacrognathus: { extra: [['\u5f69\u8679\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lampriminae']] },
    Aesalus: { extra: [['\u5967\u936c\u5f62\u87f2\u4e9e\u79d1', 'Aesalinae']] },
    Allotopus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Cyclommatus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Chiasognathus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Hexarthrius: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Lucanus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Mesotopus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Odontolabis: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Prosopocoilus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Sphaenognathus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Dorcus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Aegus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Pseudoscortizus: { extra: [['\u936c\u5f62\u87f2\u4e9e\u79d1', 'Lucaninae']] },
    Paroedura: { zh: '\u5730\u5b88\u5bae\u5c6c', extra: [['\u58c1\u864e\u4e9e\u79d1', 'Gekkoninae']] },
    Nephrurus: { zh: '\u7624\u5c3e\u5b88\u5bae\u5c6c' },
    Varanus: { zh: '\u5de8\u8725\u5c6c' },
    Cuora: { zh: '\u9589\u6bbc\u9f9c\u5c6c', extra: [['\u5730\u9f9c\u4e9e\u79d1', 'Geoemydinae']] },
    Eublepharis: { zh: '\u77bc\u864e\u5c6c', extra: [['\u77bc\u864e\u4e9e\u79d1', 'Eublepharinae']] },
    Cynomys: { zh: '\u571f\u64a5\u9f20\u5c6c', extra: [['\u5730\u677e\u9f20\u4e9e\u79d1', 'Xerinae'], ['\u65f1\u7378\u65cf', 'Marmotini']] },
    Megaceryle: { zh: '\u9b5a\u72d7\u5c6c', extra: [['\u9b5a\u72d7\u4e9e\u79d1', 'Cerylinae']] },
    Petaurus: { zh: '\u888b\u9f2c\u5c6c', extra: [['\u888b\u9f2c\u4e9e\u79d1', 'Petaurinae']] },
    Polypedates: { zh: '\u6cdb\u6a39\u86d9\u5c6c', extra: [['\u6a39\u86d9\u4e9e\u79d1', 'Rhacophorinae']] },
    Rhacodactylus: { zh: '\u5de8\u5b88\u5bae\u5c6c', extra: [['\u96d9\u8dbe\u864e\u4e9e\u79d1', 'Diplodactylinae']] },
    Tarentola: { zh: '\u5854\u862d\u6258\u864e\u5c6c' },
    Quartz: { zh: '\u77f3\u82f1\u7a2e' }
  };

  var COARSE_GENUS = { Trilobite: 1, Ammonoidea: 1, Insecta: 1, Coleoptera: 1, Mosasauroidea: 1, Bacteria: 1, Tabanidae: 1 };
  var EXTANT_GENUS = {
    Muntiacus: 1, Scaphechinus: 1, Echinarachnius: 1, Hieraaetus: 1, Chanos: 1, Tabanus: 1, Haematopota: 1, Ginkgo: 1,
    Hemipristis: 1, Diodon: 1
  };
  var EXTINCT_BINOMIAL = {
    'Hieraaetus moorei': 1,
    'Ginkgo adiantoides': 1,
    'Ginkgo yimaensis': 1,
    'Ginkgo apodes': 1,
    'Ginkgo digitata': 1,
    'Ginkgo huttonii': 1,
    'Hemipristis serra': 1,
    'Diodon sigma': 1
  };
  var LIVING_RANK = {
    Animalia: 1, Plantae: 1, Fungi: 1, Bacteria: 1, Archaea: 1,
    Chordata: 1, Arthropoda: 1, Mollusca: 1, Cnidaria: 1, Echinodermata: 1, Tracheophyta: 1,
    Mammalia: 1, Reptilia: 1, Aves: 1, Amphibia: 1, Insecta: 1, Cephalopoda: 1, Anthozoa: 1,
    Echinoidea: 1, Malacostraca: 1, Arachnida: 1, Chondrichthyes: 1, Sarcopterygii: 1,
    Polypodiopsida: 1, Pinopsida: 1, Ginkgoopsida: 1, Magnoliopsida: 1,
    Coleoptera: 1, Lepidoptera: 1, Hymenoptera: 1, Diptera: 1, Hemiptera: 1,
    Squamata: 1, Archosauria: 1, Lepidosauria: 1, Placentalia: 1,
    Scarabaeiformia: 1, Elateriformia: 1, Polyphaga: 1, Glossata: 1, Papilionoidea: 1, Scarabaeoidea: 1,
    Gekkota: 1, Testudines: 1, Anguimorpha: 1, Rodentia: 1, Coraciiformes: 1, Anura: 1,
    Actinopterygii: 1, Gonorynchiformes: 1, Chanidae: 1, Carcharhiniformes: 1, Hemigaleidae: 1, Tetraodontiformes: 1, Diodontidae: 1, Eusuchia: 1, Crocodylia: 1,
    Pseudosuchia: 1, Crocodylomorpha: 1, Crocodyliformes: 1, Carnivora: 1, Feliformia: 1,
    Hyaenidae: 1, Cervidae: 1, Elephantidae: 1, Proboscidea: 1, Tabanidae: 1,
    Cryptobranchidae: 1, Caudata: 1, Neobatrachia: 1, Marsupialia: 1,
    Brachycera: 1, Cercopoidea: 1, Accipitridae: 1, Echinarachniidae: 1,
    Lucanidae: 1, Elateridae: 1, Scarabaeidae: 1, Buprestidae: 1,
    Nymphalidae: 1, Hesperiidae: 1, Papilionidae: 1, Lycaenidae: 1, Formicidae: 1,
    Gekkonidae: 1, Eublepharidae: 1, Varanidae: 1, Geoemydidae: 1, Sciuridae: 1,
    Alcedinidae: 1, Petauridae: 1, Rhacophoridae: 1, Pinaceae: 1, Fabaceae: 1,
    Ginkgoaceae: 1, Droseraceae: 1, Pteridaceae: 1, Polypodiaceae: 1
  };

  function taxonRanks(specimen) {
    var genus = genusOfName(specimen.scientificName);
    if (specimen && specimen.category === 'mineralogy') {
      var mineralLadder = genus && GENUS_LADDER[genus];
      if (mineralLadder) {
        return mineralLadder.map(function (pair) { return rankRow(pair[0], pair[1]); });
      }
      var mineralRows = [rankRow('\u7926\u7269', 'Mineral')];
      if (genus) mineralRows.push(rankRow('\u7926\u7269\u7a2e', genus));
      return mineralRows;
    }
    var family = GENUS_FAMILY[genus] || familyFromTaxonomy(specimen.taxonomy) || '';
    var source = GENUS_LADDER[genus] || FAMILY_RANKS[family] || null;
    var rows = [];
    if (source) {
      source.forEach(function (pair) { rows.push(rankRow(pair[0], pair[1])); });
    } else {
      rows.push(rankRow(specimen.category === 'botany' ? RANK.plant[0] : RANK.animal[0], specimen.category === 'botany' ? 'Plantae' : 'Animalia'));
      if (family && family !== genus) rows.push(rankRow('\u79d1', family));
    }
    var face = GENUS_FACE[genus];
    if (face && face.extra) {
      face.extra.forEach(function (pair) { rows.push(rankRow(pair[0], pair[1])); });
    }
    if (genus && !COARSE_GENUS[genus] && rows[rows.length - 1].latin !== genus) {
      var extinct = (specimen.category === 'paleontology' || specimen.category === 'dinopedia') && !EXTANT_GENUS[genus];
      var zh = face && face.zh ? face.zh : ((extinct ? '\u2020' : '') + '\u5c6c');
      rows.push(rankRow(zh, genus, face && face.author));
    }
    return rows;
  }

  var RANK_WORD = {
    domain: { en: 'Domain', ja: '\u30c9\u30e1\u30a4\u30f3', de: 'Dom\u00e4ne' },
    kingdom: { en: 'Kingdom', ja: '\u754c', de: 'Reich' },
    phylum: { en: 'Phylum', ja: '\u9580', de: 'Stamm' },
    subphylum: { en: 'Subphylum', ja: '\u4e9c\u9580', de: 'Unterstamm' },
    class: { en: 'Class', ja: '\u7db1', de: 'Klasse' },
    subclass: { en: 'Subclass', ja: '\u4e9c\u7db1', de: 'Unterklasse' },
    order: { en: 'Order', ja: '\u76ee', de: 'Ordnung' },
    suborder: { en: 'Suborder', ja: '\u4e9c\u76ee', de: 'Unterordnung' },
    infraorder: { en: 'Infraorder', ja: '\u4e0b\u76ee', de: 'Infraordnung' },
    superfamily: { en: 'Superfamily', ja: '\u4e0a\u79d1', de: '\u00dcberfamilie' },
    family: { en: 'Family', ja: '\u79d1', de: 'Familie' },
    infraclass: { en: 'Infraclass', ja: '\u4e0b\u7db1', de: 'Infraklasse' },
    tribe: { en: 'Tribe', ja: '\u65cf', de: 'Tribus' },
    group: { en: 'Group', ja: '\u7fa4', de: 'Gruppe' },
    subfamily: { en: 'Subfamily', ja: '\u4e9c\u79d1', de: 'Unterfamilie' },
    genus: { en: 'Genus', ja: '\u5c5e', de: 'Gattung' },
    species: { en: 'Species', ja: '\u7a2e', de: 'Art' },
    clade: { en: 'Clade', ja: '\u7cfb\u7d71\u7fa4', de: 'Klade' }
  };

  function rankKind(zh) {
    var s = String(zh || '').replace(/^\u2020/, '');
    if (/\u4e9e\u7db1$/.test(s) || /\u4e9c\u7db1$/.test(s)) return 'subclass';
    if (/\u8d85\u79d1$/.test(s) || /\u4e0a\u79d1$/.test(s)) return 'superfamily';
    if (/\u4e9e\u79d1$/.test(s) || /\u4e9c\u79d1$/.test(s)) return 'subfamily';
    if (/\u65cf$/.test(s)) return 'tribe';
    if (/\u7fa4$/.test(s)) return 'group';
    if (/\u4e0b\u76ee$/.test(s)) return 'infraorder';
    if (/\u4e9e\u76ee$/.test(s) || /\u4e9c\u76ee$/.test(s)) return 'suborder';
    if (/\u57df$/.test(s)) return 'domain';
    if (/\u754c$/.test(s)) return 'kingdom';
    if (/\u4e9e\u9580$/.test(s) || /\u4e9c\u9580$/.test(s)) return 'subphylum';
    if (/\u9580$/.test(s)) return 'phylum';
    if (/\u4e0b\u7db1$/.test(s)) return 'infraclass';
    if (/\u7db1$/.test(s)) return 'class';
    if (/\u76ee$/.test(s)) return 'order';
    if (/\u79d1$/.test(s)) return 'family';
    if (/\u5c6c$/.test(s) || /\u5c5e$/.test(s)) return 'genus';
    if (/\u7a2e$/.test(s)) return 'species';
    return 'clade';
  }

  function localizeRank(row) {
    var dagger = /^\u2020/.test(row.zh) ? '\u2020' : '';
    if (isZh()) return { title: row.zh, sub: row.latin };
    var kind = rankKind(row.zh);
    var pack = isJa() ? 'ja' : (isDe() ? 'de' : 'en');
    var word = (RANK_WORD[kind] || RANK_WORD.clade)[pack];
    return { title: word, sub: dagger + row.latin };
  }

  function exampleKingdom(specimen) {
    return specimen && specimen.category === 'botany' ? 'Plantae' : 'Animalia';
  }

  function lineageRanks(specimen) {
    return taxonRanks(specimen).map(function (row) { return row.latin; });
  }

  function syncExampleTaxonomy(specimen) {
    var authored = String(specimen.taxonomy || '').split(/\s*(?:\u2192|->)\s*/).map(function (part) {
      return part.trim();
    }).filter(Boolean);
    specimen.taxonomyAuthored = authored;
    var chain = lineageRanks(specimen);
    if (!chain.length) return;
    if (authored.length > chain.length + 1) return;
    if (chain[chain.length - 1] !== specimen.scientificName) chain.push(specimen.scientificName);
    specimen.taxonomy = chain.join(' \u2192 ');
  }

  specimenCandidates.forEach(syncExampleTaxonomy);

  function buildTaxonomyContext(specimen) {
    var lineage = lineageRanks(specimen);
    var related = relatedSpecimensFor(specimen);
    return {
      lineage: lineage,
      selectedSpecies: {
        name: specimen.scientificName,
        role: 'selected',
        color: 'primary'
      },
      relatedSpecies: [
        { name: related[0].scientificName, role: 'comparison', color: 'accent1', common: related[0].commonName || '' },
        { name: related[1].scientificName, role: 'comparison', color: 'accent2', common: related[1].commonName || '' }
      ]
    };
  }

  function taxonomyNodeButton(label, className, selected, italic) {
    return '<button type="button" data-select-taxonomy="' + escapeHtml(label) + '" class="node mcwf-tax-node ' +
      className + (selected ? ' is-selected' : '') + '">' +
      (italic ? '<i>' + escapeHtml(label) + '</i>' : escapeHtml(label)) + '</button>';
  }

  function treeBranch(d, delayMs, durMs, extra) {
    return '<path class="mcwf-tree-branch' + (extra ? ' ' + extra : '') + '" style="--delay:' +
      delayMs + 'ms;--grow:' + durMs + 'ms" d="' + d + '"/>';
  }

  function treeNodeAt(label, className, selected, italic, x, y, anchor, delay, sub, value, author) {
    var key = value || label;
    var pos = anchor === 'end'
      ? 'left:auto;right:' + x + '%;top:' + y + '%;margin-top:-14px;'
      : 'left:' + x + '%;right:auto;top:' + y + '%;margin-top:-16px;';
    var anchorClass = anchor === 'end'
      ? ' mcwf-tax-node--end'
      : (anchor === 'chain' ? ' mcwf-tax-node--chain' : ' mcwf-tax-node--start');
    var body = italic ? '<i>' + escapeHtml(label) + '</i>' : escapeHtml(label);
    if (sub) body += '<small>' + escapeHtml(sub) + '</small>';
    if (author) body += '<small class="mcwf-tax-author">' + escapeHtml(author) + '</small>';
    return '<button type="button" data-select-taxonomy="' + escapeHtml(key) + '" class="node mcwf-tax-node ' +
      className + anchorClass +
      (selected ? ' is-selected' : '') + '" style="--arrive:' + (delay == null ? 0 : delay) + 'ms;' + pos + '">' +
      body + '</button>';
  }

  var CLADE_SPLITS = [
    { child: 'Ornithischia', parent: 'Dinosauria', zh: '\u8725\u81c0\u76ee', latin: 'Saurischia' },
    { child: 'Saurischia', parent: 'Dinosauria', zh: '\u9ce5\u81c0\u76ee', latin: 'Ornithischia' },
    { child: 'Theropoda', parent: 'Saurischia', zh: '\u8725\u8173\u5f62\u4e9e\u76ee', latin: 'Sauropodomorpha' },
    { child: 'Ceratopsia', parent: 'Marginocephalia', zh: '\u816b\u982d\u9f8d\u985e', latin: 'Pachycephalosauria' },
    { child: 'Stegosauria', parent: 'Thyreophora', zh: '\u7532\u9f8d\u4e9e\u76ee', latin: 'Ankylosauria' },
    { child: 'Feliformia', parent: 'Carnivora', zh: '\u72ac\u578b\u4e9e\u76ee', latin: 'Caniformia' },
    { child: 'Percrocutinae', parent: 'Hyaenidae', zh: '\u9b2a\u72d7\u4e9e\u79d1', latin: 'Hyaeninae' },
    { child: 'Ciliophora', parent: 'Alveolata', zh: '\u9802\u8907\u52d5\u7269\u9580', latin: 'Apicomplexa' },
    { child: 'Chlorophyta', parent: 'Viridiplantae', zh: '\u93c8\u5f62\u690d\u7269', latin: 'Streptophyta' },
    { child: 'Volvocaceae', parent: 'Chlamydomonadales', zh: '\u8863\u85fb\u79d1', latin: 'Chlamydomonadaceae' },
    { child: 'Chlamydomonadaceae', parent: 'Chlamydomonadales', zh: '\u5718\u85fb\u79d1', latin: 'Volvocaceae' },
    { child: 'Squamata', parent: 'Lepidosauria', zh: '\u5599\u982d\u76ee', latin: 'Rhynchocephalia' },
    { child: 'Euglenida', parent: 'Euglenozoa', zh: '\u52d5\u57fa\u9ad4\u7db1', latin: 'Kinetoplastea' },
    { child: 'Ammonoidea', parent: 'Cephalopoda', zh: '\u9798\u4e9e\u7db1', latin: 'Coleoidea' },
    { child: 'Pseudosuchia', parent: 'Archosauria', zh: '\u9ce5\u8e1d\u985e', latin: 'Avemetatarsalia' },
    { child: 'Dinosauria', parent: 'Archosauria', zh: '\u507d\u9c31\u985e', latin: 'Pseudosuchia' },
    { child: 'Bacilli', parent: 'Bacillota', zh: '\u68ad\u83cc\u7db1', latin: 'Clostridia' },
    { child: 'Asteroidea', parent: 'Asterozoa', zh: '\u86c7\u5c3e\u7db1', latin: 'Ophiuroidea' },
    { child: 'Placentalia', parent: 'Mammalia', zh: '\u6709\u888b\u4e0b\u7db1', latin: 'Marsupialia' }
  ];

  function cladogramStem(specimen, lineage) {
    var species = String((specimen && specimen.scientificName) || '');
    var genus = genusOfName(species);
    var safe = lineage && lineage.length ? lineage : [''];
    var rankA = safe[0] || '';
    var rankB = safe[Math.min(1, safe.length - 1)] || rankA;
    var rankC = safe[Math.min(2, safe.length - 1)] || rankB;
    var collapsed = !rankA || rankA === rankB || rankB === rankC || rankC === genus || rankC === species;
    var authored = (specimen && specimen.taxonomyAuthored) || [];
    if (!collapsed || authored.length < 3) return [rankA, rankB, rankC];
    var chain = authored.filter(function (part) { return part && part !== species; });
    if (chain.length >= 3 && chain[chain.length - 1] === genus) chain = chain.slice(0, -1);
    if (chain.length < 3) return [rankA, rankB, rankC];
    return [chain[0], chain[1], chain[2]];
  }

  function cladogramTips(specimen) {
    var focal = String((specimen && specimen.scientificName) || '').trim();
    var genus = genusOfName(focal);
    var kin = closeKinNames(specimen, 5).filter(function (name) {
      return name && name !== focal && name !== genus;
    });
    var tips = kin.slice(0, 5);
    tips.splice(Math.floor(tips.length / 2), 0, focal || 'Specimen');
    return tips;
  }

  function higherRanksForTree(specimen) {
    var focal = String((specimen && specimen.scientificName) || '').trim();
    var chain = lineageRanks(specimen).filter(function (name, index, list) {
      return name && name !== focal && list.indexOf(name) === index;
    });
    if (chain.length > 2) chain = chain.slice(-2);
    if (!chain.length) {
      var genus = genusOfName(focal);
      if (genus && genus !== focal) chain = [genus];
    }
    return chain.slice().reverse();
  }

  function taxonIsExtinct(name, specimen) {
    var clean = String(name || '').replace(/^\u2020\s*/, '').trim();
    if (!clean) return false;
    if (LIVING_RANK[clean]) return false;
    if (EXTINCT_BINOMIAL[clean]) return true;
    var genus = genusOfName(clean);
    var binomial = clean.indexOf(' ') >= 0 || /\bsp\.?$/i.test(clean);
    if (EXTANT_GENUS[genus]) return binomial && !!EXTINCT_BINOMIAL[clean];
    if (specimen && (specimen.category === 'paleontology' || specimen.category === 'dinopedia')) return true;
    return false;
  }

  function taxonLabelHtml(name, specimen, italic) {
    var dagger = taxonIsExtinct(name, specimen) ? '<span class="mcwf-extinct">\u2020</span>' : '';
    var text = escapeHtml(name);
    return dagger + (italic ? '<i>' + text + '</i>' : text);
  }

  function treePanel() {
    var specimen = specimenById(workflowState.selectedSpecimenId);
    var ranks = higherRanksForTree(specimen);
    var tips = cladogramTips(specimen);
    var focal = String(specimen.scientificName || '').trim();
    var selectedTaxon = workflowState.selectedTaxonomyNode || focal;
    var yJoin = 50;
    var rankCount = Math.max(ranks.length, 1);
    var yRanks = ranks.map(function (_, index) {
      if (rankCount < 2) return yJoin;
      return Math.round(yJoin - 9 + (18 * index) / (rankCount - 1));
    });
    var stem = [];
    var xJoin = 86;
    ranks.forEach(function (_, index) {
      stem.push(treeBranch('M0 ' + yRanks[index] + 'H' + xJoin, 180 + index * 320, 1400, 'branch-mint'));
    });
    if (rankCount > 1) {
      stem.push(treeBranch('M' + xJoin + ' ' + yRanks[0] + 'V' + yRanks[rankCount - 1], 1280, 900, 'branch-mint'));
    }
    stem.push(treeBranch('M' + xJoin + ' ' + yJoin + 'H100', 2000, 700, 'branch-mint'));
    var rankButtons = ranks.map(function (name, index) {
      return '<button type="button" data-select-taxonomy="' + escapeHtml(name) + '" class="node mcwf-tax-node mcwf-tax-node--lineage mcwf-tax-node--start n' +
        (index + 1) + (selectedTaxon === name ? ' is-selected' : '') + '" style="--arrive:' + (360 + index * 320) +
        'ms;top:' + yRanks[index] + '%;">' + taxonLabelHtml(name, specimen, false) + '</button>';
    }).join('');
    var count = tips.length;
    var y0 = 16;
    var y1 = 84;
    var xTip = 78;
    var xStep = 14;
    function yAt(index) {
      if (count < 2) return yJoin;
      return Math.round(y0 + (y1 - y0) * (index / (count - 1)));
    }
    var fan = [];
    var focalIndex = tips.indexOf(focal);
    function bracket(start, end, x, depth) {
      if (start === end) {
        var tone = start === focalIndex ? 'branch-selected' : (start < focalIndex ? 'branch-related-a' : 'branch-related-b');
        fan.push(treeBranch('M' + x + ' ' + yAt(start) + 'H' + xTip, 3600 + depth * 180 + start * 160, 1100, tone));
        return yAt(start);
      }
      var leftCount = Math.ceil((end - start + 1) / 2);
      var split = start + leftCount - 1;
      var xChild = Math.min(x + xStep, xTip - 6);
      var yLeft = bracket(start, split, xChild, depth + 1);
      var yRight = bracket(split + 1, end, xChild, depth + 1);
      var yMid = Math.round((yLeft + yRight) / 2);
      fan.push(treeBranch('M' + xChild + ' ' + yLeft + 'V' + yRight, 3000 + depth * 180, 900, 'branch-fork'));
      fan.push(treeBranch('M' + x + ' ' + yMid + 'H' + xChild, 2700 + depth * 160, 1000, ''));
      return yMid;
    }
    var rootY = count ? bracket(0, count - 1, 8, 0) : yJoin;
    fan.unshift(treeBranch('M0 ' + yJoin + 'H8' + (rootY === yJoin ? '' : 'V' + rootY), 2500, 1000, 'branch-mint'));
    var tipButtons = tips.map(function (name, index) {
      var accent = name === focal
        ? 'mcwf-tax-node--terminal mcwf-tax-node--primary'
        : (index < focalIndex
          ? 'mcwf-tax-node--terminal mcwf-tax-node--accent-gold'
          : 'mcwf-tax-node--terminal mcwf-tax-node--accent-violet');
      return '<button type="button" data-select-taxonomy="' + escapeHtml(name) + '" class="node mcwf-tax-node mcwf-clad-tip ' +
        accent + (selectedTaxon === name ? ' is-selected' : '') + '" style="--arrive:' + (4300 + index * 180) +
        'ms;top:' + yAt(index) + '%;">' + taxonLabelHtml(name, specimen, true) + '</button>';
    }).join('');
    return '<div class="mcwf-taxonomy-scene mcwf-cladogram" aria-label="Taxonomy context diagram">' +
      '<div class="mcwf-clad-in">' +
      '<svg class="mcwf-tree-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      stem.join('') +
      '</svg>' +
      rankButtons +
      '</div>' +
      '<span class="mcwf-clad-spine" aria-hidden="true"></span>' +
      '<div class="mcwf-clad-fan">' +
      '<svg class="mcwf-tree-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      fan.join('') +
      '</svg>' +
      tipButtons +
      '</div>' +
      fossilTimeRestoreMarkup(specimen) +
      '</div>';
  }

  function isFossilSpecimen(specimen) {
    return !!(specimen && specimen.category === 'paleontology' && specimen.mediaKind !== 'restoration');
  }

  function fossilRestorationSrc(specimen) {
    if (specimen && specimen.restoration) return specimen.restoration;
    var plates = {
      'paleo-mosasauroidea-sp': 'mosasauroidea-sp-restoration.jpg',
      'paleo-spinosaurus-aegyptiacus': 'spinosaurus-aegyptiacus-restoration.jpg',
      'paleo-borealosuchus-sternbergii': 'borealosuchus-sternbergii-restoration.jpg',
      'paleo-gerastos-granulosos': 'gerastos-granulosus-restoration.jpg',
      'paleo-globidens-sp': 'globidens-sp-restoration.jpg',
      'paleo-calymeme-sp': 'calymene-sp-restoration.jpg',
      'paleo-lophophyllidium-plummeri': 'lophophyllidium-plummeri-restoration.jpg',
      'paleo-scaphechinus-mirabilis': 'scaphechinus-mirabilis-restoration.jpg',
      'paleo-scaphechinus-mirabilis-cluster': 'scaphechinus-mirabilis-restoration.jpg',
      'paleo-chunerpeton-tianyiensis': 'chunerpeton-tianyiensis-restoration.jpg',
      'paleo-aioloceras-besairei': 'aioloceras-besairei-restoration.jpg',
      'paleo-muntiacus-sp': 'muntiacus-sp-restoration.jpg',
      'paleo-mammuthus-primigenius': 'mammuthus-primigenius-restoration.jpg',
      'paleo-dinocrocuta-sp': 'dinocrocuta-sp-restoration.jpg'
    };
    var file = specimen && plates[specimen.id];
    return file ? WORKFLOW_PALEO_IMAGE_BASE + file : '';
  }

  function fossilTimeLadder() {
    return [
      { label: '\u73fe\u4ee3', ma: '0' },
      { label: '\u5168\u65b0\u4e16', ma: '0.012' },
      { label: '\u66f4\u65b0\u4e16', ma: '2.6' },
      { label: '\u4e0a\u65b0\u4e16', ma: '5.3' },
      { label: '\u4e2d\u65b0\u4e16', ma: '23' },
      { label: '\u6f38\u65b0\u4e16', ma: '34' },
      { label: '\u59cb\u65b0\u4e16', ma: '56' },
      { label: '\u53e4\u65b0\u4e16', ma: '66' },
      { label: '\u767d\u57a9\u7d00\u665a\u671f', ma: '72' },
      { label: '\u767d\u57a9\u7d00', ma: '100' },
      { label: '\u767d\u57a9\u7d00\u65e9\u671f', ma: '130' },
      { label: '\u4f8f\u7f85\u7d00\u665a\u671f', ma: '161' },
      { label: '\u4f8f\u7f85\u7d00\u4e2d\u671f', ma: '174' },
      { label: '\u4f8f\u7f85\u7d00\u65e9\u671f', ma: '201' },
      { label: '\u4e09\u758a\u7d00\u665a\u671f', ma: '227' },
      { label: '\u4e09\u758a\u7d00\u4e2d\u671f', ma: '242' },
      { label: '\u4e09\u758a\u7d00\u65e9\u671f', ma: '252' },
      { label: '\u6a02\u5e73\u4e16', ma: '254' },
      { label: '\u74dc\u5fb7\u9b6f\u666e\u4e16', ma: '273' },
      { label: '\u70cf\u62c9\u723e\u4e16', ma: '290' },
      { label: '\u8cd3\u5915\u6cd5\u5c3c\u4e9e\u4e16\u665a\u671f', ma: '305' },
      { label: '\u8cd3\u5915\u6cd5\u5c3c\u4e9e\u4e16\u4e2d\u671f', ma: '315' },
      { label: '\u8cd3\u5915\u6cd5\u5c3c\u4e9e\u4e16\u65e9\u671f', ma: '323' },
      { label: '\u5bc6\u897f\u897f\u6bd4\u4e16\u665a\u671f', ma: '331' },
      { label: '\u5bc6\u897f\u897f\u6bd4\u4e16\u4e2d\u671f', ma: '346' },
      { label: '\u5bc6\u897f\u897f\u6bd4\u4e16\u65e9\u671f', ma: '359' },
      { label: '\u6ce5\u76c6\u7d00\u665a\u671f', ma: '372' },
      { label: '\u6ce5\u76c6\u7d00\u4e2d\u671f', ma: '393' },
      { label: '\u6ce5\u76c6\u7d00\u65e9\u671f', ma: '419' },
      { label: '\u7f85\u5fb7\u6d1b\u4e16', ma: '427' },
      { label: '\u6eab\u6d1b\u514b\u4e16', ma: '433' },
      { label: '\u862d\u591a\u7dad\u5229\u4e16', ma: '443' },
      { label: '\u5967\u9676\u7d00\u665a\u671f', ma: '453' },
      { label: '\u5967\u9676\u7d00\u4e2d\u671f', ma: '470' },
      { label: '\u5967\u9676\u7d00\u65e9\u671f', ma: '485' },
      { label: '\u8299\u84c9\u4e16', ma: '497' },
      { label: '\u82d7\u5dba\u4e16', ma: '509' },
      { label: '\u7b2c\u4e8c\u4e16', ma: '521' },
      { label: '\u7d10\u82ac\u862d\u4e16', ma: '538' },
      { label: '\u57c3\u8fea\u5361\u7d00', ma: '635' },
      { label: '\u65b0\u5143\u53e4\u4ee3', ma: '1000' },
      { label: '\u4e2d\u5143\u53e4\u4ee3', ma: '1600' }
    ];
  }

  function fossilEraScenes() {
    return [
      { key: 'today', file: 'era-today.jpg' },
      { key: 'holocene', file: 'era-holocene.jpg' },
      { key: 'pleistocene', file: 'era-pleistocene.jpg' },
      { key: 'pliocene', file: 'era-pliocene.jpg' },
      { key: 'miocene', file: 'era-miocene.jpg' },
      { key: 'oligocene', file: 'era-oligocene.jpg' },
      { key: 'eocene', file: 'era-eocene.jpg' },
      { key: 'paleocene', file: 'era-paleocene.jpg' },
      { key: 'cretaceous-late', file: 'era-cretaceous-late.jpg' },
      { key: 'cretaceous', file: 'era-cretaceous.jpg' },
      { key: 'cretaceous-early', file: 'era-cretaceous-early.jpg' },
      { key: 'jurassic-late', file: 'era-jurassic-late.jpg' },
      { key: 'jurassic-middle', file: 'era-jurassic-middle.jpg' },
      { key: 'jurassic-early', file: 'era-jurassic-early.jpg' },
      { key: 'triassic-late', file: 'era-triassic-late.jpg' },
      { key: 'triassic-middle', file: 'era-triassic-middle.jpg' },
      { key: 'triassic-early', file: 'era-triassic-early.jpg' },
      { key: 'lopingian', file: 'era-lopingian.jpg' },
      { key: 'guadalupian', file: 'era-guadalupian.jpg' },
      { key: 'cisuralian', file: 'era-cisuralian.jpg' },
      { key: 'penn-late', file: 'era-penn-late.jpg' },
      { key: 'penn-middle', file: 'era-penn-middle.jpg' },
      { key: 'penn-early', file: 'era-penn-early.jpg' },
      { key: 'miss-late', file: 'era-miss-late.jpg' },
      { key: 'miss-middle', file: 'era-miss-middle.jpg' },
      { key: 'miss-early', file: 'era-miss-early.jpg' },
      { key: 'devonian-late', file: 'era-devonian-late.jpg' },
      { key: 'devonian-middle', file: 'era-devonian-middle.jpg' },
      { key: 'devonian-early', file: 'era-devonian-early.jpg' },
      { key: 'ludlow', file: 'era-ludlow.jpg' },
      { key: 'wenlock', file: 'era-wenlock.jpg' },
      { key: 'llandovery', file: 'era-llandovery.jpg' },
      { key: 'ordovician-late', file: 'era-ordovician-late.jpg' },
      { key: 'ordovician-middle', file: 'era-ordovician-middle.jpg' },
      { key: 'ordovician-early', file: 'era-ordovician-early.jpg' },
      { key: 'furongian', file: 'era-furongian.jpg' },
      { key: 'miaolingian', file: 'era-miaolingian.jpg' },
      { key: 'cambrian-2', file: 'era-cambrian-2.jpg' },
      { key: 'terreneuvian', file: 'era-terreneuvian.jpg' },
      { key: 'ediacaran', file: 'era-ediacaran.jpg' },
      { key: 'neoproterozoic', file: 'era-neoproterozoic.jpg' },
      { key: 'mesoproterozoic', file: 'era-mesoproterozoic.jpg' },
      { key: 'period-cambrian', file: 'era-cambrian.jpg' },
      { key: 'period-ordovician', file: 'era-ordovician.jpg' },
      { key: 'period-silurian', file: 'era-silurian.jpg' },
      { key: 'period-devonian', file: 'era-devonian-sea.jpg' },
      { key: 'period-carboniferous', file: 'era-carboniferous.jpg' },
      { key: 'period-permian', file: 'era-permian.jpg' },
      { key: 'period-triassic', file: 'era-triassic.jpg' },
      { key: 'period-jurassic', file: 'era-jurassic.jpg' },
      { key: 'period-cretaceous', file: 'era-cretaceous.jpg' },
      { key: 'period-paleogene', file: 'era-paleogene.jpg' },
      { key: 'period-neogene', file: 'era-neogene.jpg' },
      { key: 'period-quaternary', file: 'era-quaternary.jpg' }
    ];
  }

  function fossilPeriodId(label) {
    var key = fossilEraSceneKey(label);
    var map = {
      today: 'quaternary',
      holocene: 'quaternary',
      pleistocene: 'quaternary',
      pliocene: 'neogene',
      miocene: 'neogene',
      oligocene: 'paleogene',
      eocene: 'paleogene',
      paleocene: 'paleogene',
      'cretaceous-late': 'cretaceous',
      cretaceous: 'cretaceous',
      'cretaceous-early': 'cretaceous',
      'jurassic-late': 'jurassic',
      'jurassic-middle': 'jurassic',
      'jurassic-early': 'jurassic',
      'triassic-late': 'triassic',
      'triassic-middle': 'triassic',
      'triassic-early': 'triassic',
      lopingian: 'permian',
      guadalupian: 'permian',
      cisuralian: 'permian',
      'penn-late': 'carboniferous',
      'penn-middle': 'carboniferous',
      'penn-early': 'carboniferous',
      'miss-late': 'carboniferous',
      'miss-middle': 'carboniferous',
      'miss-early': 'carboniferous',
      'devonian-late': 'devonian',
      'devonian-middle': 'devonian',
      'devonian-early': 'devonian',
      ludlow: 'silurian',
      wenlock: 'silurian',
      llandovery: 'silurian',
      'ordovician-late': 'ordovician',
      'ordovician-middle': 'ordovician',
      'ordovician-early': 'ordovician',
      furongian: 'cambrian',
      miaolingian: 'cambrian',
      'cambrian-2': 'cambrian',
      terreneuvian: 'cambrian'
    };
    return map[key] || '';
  }

  function fossilPeriodName(periodId) {
    var names = {
      cambrian: '\u5bd2\u6b66\u7d00',
      ordovician: '\u5967\u9676\u7d00',
      silurian: '\u5fd7\u7559\u7d00',
      devonian: '\u6ce5\u76c6\u7d00',
      carboniferous: '\u77f3\u70ad\u7d00',
      permian: '\u4e8c\u758a\u7d00',
      triassic: '\u4e09\u758a\u7d00',
      jurassic: '\u4f8f\u7f85\u7d00',
      cretaceous: '\u767d\u57a9\u7d00',
      paleogene: '\u53e4\u8fd1\u7d00',
      neogene: '\u65b0\u8fd1\u7d00',
      quaternary: '\u7b2c\u56db\u7d00'
    };
    return names[periodId] || '';
  }

  function fossilEraSceneKey(label) {
    var map = {
      '\u73fe\u4ee3': 'today',
      '\u5168\u65b0\u4e16': 'holocene',
      '\u66f4\u65b0\u4e16': 'pleistocene',
      '\u4e0a\u65b0\u4e16': 'pliocene',
      '\u4e2d\u65b0\u4e16': 'miocene',
      '\u65b0\u8fd1\u7d00\u65e9\u4e2d\u671f': 'miocene',
      '\u6f38\u65b0\u4e16': 'oligocene',
      '\u59cb\u65b0\u4e16': 'eocene',
      '\u53e4\u65b0\u4e16': 'paleocene',
      '\u767d\u57a9\u7d00\u665a\u671f': 'cretaceous-late',
      '\u767d\u57a9\u7d00': 'cretaceous',
      '\u767d\u57a9\u7d00\u65e9\u671f': 'cretaceous-early',
      '\u4f8f\u7f85\u7d00\u665a\u671f': 'jurassic-late',
      '\u4f8f\u7f85\u7d00\u4e2d\u671f': 'jurassic-middle',
      '\u4f8f\u7f85\u7d00\u65e9\u671f': 'jurassic-early',
      '\u4e09\u758a\u7d00\u665a\u671f': 'triassic-late',
      '\u4e09\u758a\u7d00\u4e2d\u671f': 'triassic-middle',
      '\u4e09\u758a\u7d00\u65e9\u671f': 'triassic-early',
      '\u6a02\u5e73\u4e16': 'lopingian',
      '\u74dc\u5fb7\u9b6f\u666e\u4e16': 'guadalupian',
      '\u70cf\u62c9\u723e\u4e16': 'cisuralian',
      '\u8cd3\u5915\u6cd5\u5c3c\u4e9e\u4e16\u665a\u671f': 'penn-late',
      '\u8cd3\u5915\u6cd5\u5c3c\u4e9e\u4e16\u4e2d\u671f': 'penn-middle',
      '\u8cd3\u5915\u6cd5\u5c3c\u4e9e\u4e16\u65e9\u671f': 'penn-early',
      '\u5bc6\u897f\u897f\u6bd4\u4e16\u665a\u671f': 'miss-late',
      '\u5bc6\u897f\u897f\u6bd4\u4e16\u4e2d\u671f': 'miss-middle',
      '\u5bc6\u897f\u897f\u6bd4\u4e16\u65e9\u671f': 'miss-early',
      '\u6ce5\u76c6\u7d00\u665a\u671f': 'devonian-late',
      '\u6ce5\u76c6\u7d00\u4e2d\u671f': 'devonian-middle',
      '\u6ce5\u76c6\u7d00\u65e9\u671f': 'devonian-early',
      '\u7f85\u5fb7\u6d1b\u4e16': 'ludlow',
      '\u6eab\u6d1b\u514b\u4e16': 'wenlock',
      '\u862d\u591a\u7dad\u5229\u4e16': 'llandovery',
      '\u5967\u9676\u7d00\u665a\u671f': 'ordovician-late',
      '\u5967\u9676\u7d00\u4e2d\u671f': 'ordovician-middle',
      '\u5967\u9676\u7d00\u65e9\u671f': 'ordovician-early',
      '\u8299\u84c9\u4e16': 'furongian',
      '\u82d7\u5dba\u4e16': 'miaolingian',
      '\u7b2c\u4e8c\u4e16': 'cambrian-2',
      '\u7d10\u82ac\u862d\u4e16': 'terreneuvian',
      '\u57c3\u8fea\u5361\u7d00': 'ediacaran',
      '\u65b0\u5143\u53e4\u4ee3': 'neoproterozoic',
      '\u4e2d\u5143\u53e4\u4ee3': 'mesoproterozoic'
    };
    return map[label] || '';
  }

  function eraSceneFile(key) {
    var scenes = fossilEraScenes();
    var i;
    for (i = 0; i < scenes.length; i++) {
      if (scenes[i].key === key) return scenes[i].file;
    }
    return '';
  }

  function sceneKeyForMark(mark) {
    if (!mark) return '';
    var key = fossilEraSceneKey(mark.label);
    if (key && eraSceneFile(key)) return key;
    var period = fossilPeriodId(mark.label);
    if (period && eraSceneFile('period-' + period)) return 'period-' + period;
    return '';
  }

  function fossilTimePathForEraKey(eraKey) {
    var ladder = fossilTimeLadder();
    var target = eraKey === 'tonian' ? 'neoproterozoic' : eraKey;
    var stop = 0;
    var found = false;
    var i;
    for (i = 0; i < ladder.length; i += 1) {
      if (fossilEraSceneKey(ladder[i].label) === target) {
        stop = i;
        found = true;
      }
    }
    if (!found) return ladder.slice(0, 1);
    return ladder.slice(0, stop + 1);
  }

  function fossilTimePath(specimen) {
    if (specimen && specimen.eraKey) return fossilTimePathForEraKey(specimen.eraKey);
    var ladder = fossilTimeLadder();
    var date = String(specimen && specimen.date || '');
    var aliases = [
      { label: '\u65b0\u8fd1\u7d00\u65e9\u4e2d\u671f', ma: '18', after: '\u4e0a\u65b0\u4e16' },
      { label: '\u65b0\u8fd1\u7d00', stop: '\u4e2d\u65b0\u4e16' },
      { label: '\u53e4\u8fd1\u7d00', stop: '\u53e4\u65b0\u4e16' },
      { label: '\u4f8f\u7f85\u7d00', stop: '\u4f8f\u7f85\u7d00\u4e2d\u671f' },
      { label: '\u4e09\u758a\u7d00', stop: '\u4e09\u758a\u7d00\u4e2d\u671f' },
      { label: '\u4e8c\u758a\u7d00', stop: '\u74dc\u5fb7\u9b6f\u666e\u4e16' },
      { label: '\u77f3\u70ad\u7d00\u665a\u671f', stop: '\u8cd3\u5915\u6cd5\u5c3c\u4e9e\u4e16\u665a\u671f' },
      { label: '\u77f3\u70ad\u7d00', stop: '\u8cd3\u5915\u6cd5\u5c3c\u4e9e\u4e16\u4e2d\u671f' },
      { label: '\u6ce5\u76c6\u7d00', stop: '\u6ce5\u76c6\u7d00\u4e2d\u671f' },
      { label: '\u5fd7\u7559\u7d00', stop: '\u6eab\u6d1b\u514b\u4e16' },
      { label: '\u5967\u9676\u7d00', stop: '\u5967\u9676\u7d00\u665a\u671f' },
      { label: '\u5bd2\u6b66\u7d00', stop: '\u8299\u84c9\u4e16' }
    ];
    var stop = 4;
    var best = 0;
    var extraHit = null;
    var i;
    for (i = 0; i < ladder.length; i++) {
      if (ladder[i].label === '\u4e2d\u65b0\u4e16') stop = i;
    }
    for (i = 1; i < ladder.length; i++) {
      if (date.indexOf(ladder[i].label) !== -1 && ladder[i].label.length >= best) {
        best = ladder[i].label.length;
        stop = i;
        extraHit = null;
      }
    }
    for (i = 0; i < aliases.length; i++) {
      if (date.indexOf(aliases[i].label) === -1 || aliases[i].label.length <= best) continue;
      best = aliases[i].label.length;
      if (aliases[i].after) {
        extraHit = aliases[i];
      } else {
        extraHit = null;
        for (var j = 0; j < ladder.length; j++) {
          if (ladder[j].label === aliases[i].stop) stop = j;
        }
      }
    }
    if (!extraHit) return ladder.slice(0, stop + 1);
    var cut = 0;
    for (i = 0; i < ladder.length; i++) {
      if (ladder[i].label === extraHit.after) cut = i;
    }
    var path = ladder.slice(0, cut + 1);
    path.push({ label: extraHit.label, ma: extraHit.ma });
    return path;
  }

  function fossilDwellMs(index, total) {
    if (total <= 1) return 980;
    var head = Math.min(2, total - 1);
    var tail = Math.min(3, Math.max(1, total - head));
    if (head + tail >= total) {
      return Math.round(620 + (index / (total - 1)) * 320);
    }
    if (index < head) return index === 0 ? 480 : 620;
    if (index >= total - tail) return 520 + (index - (total - tail)) * 180;
    var span = Math.max(1, total - head - tail);
    var rush = (index - head) / span;
    return Math.round(420 - Math.pow(rush, 0.85) * 100);
  }

  function traditionalGeoText(text) {
    return String(text || '').replace(/\u57e9/g, '\u57a9').replace(/\u7eaa/g, '\u7d00');
  }

  function fossilAgeZh(ma, withAgo) {
    var text = String(ma == null ? '' : ma);
    if (text.indexOf('\u2013') !== -1) {
      var bits = text.split('\u2013');
      return fossilAgeZh(bits[1], false) + '\u81f3' + fossilAgeZh(bits[0], false);
    }
    var n = parseFloat(text);
    if (!isFinite(n) || n <= 0) return '\u73fe\u5728';
    var wan = Math.round(n * 100);
    if (wan < 1) wan = 1;
    function grouped(num) {
      return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    var body;
    if (wan < 10000) {
      body = (wan % 1000 === 0)
        ? ((wan / 1000) + ' \u5343\u842c\u5e74')
        : (grouped(wan) + ' \u842c\u5e74');
    } else {
      var yi = Math.floor(wan / 10000);
      var rest = wan % 10000;
      if (!rest) body = yi + ' \u5104\u5e74';
      else if (rest % 1000 === 0) body = yi + ' \u5104 ' + (rest / 1000) + ' \u5343\u842c\u5e74';
      else body = yi + ' \u5104 ' + grouped(rest) + ' \u842c\u5e74';
    }
    return withAgo ? ('\u8ddd\u4eca ' + body + '\u524d') : body;
  }

  function fossilAgeNote(ma) {
    if (isZh()) return fossilAgeZh(ma, false);
    var n = parseFloat(ma);
    if (!isFinite(n) || n <= 0) return 'Today';
    return ma + ' Ma';
  }

  function fossilAgeClock(ma) {
    if (isZh()) return fossilAgeZh(ma, true);
    return fossilAgeNote(ma);
  }

  function isTimeRewindSpecimen(specimen) {
    return isFossilSpecimen(specimen) || !!(specimen && specimen.timeArrival === 'age');
  }

  function timeMachineIconMarkup() {
    return '<img class="mc-time-rewind__mark" src="' + WORKFLOW_PALEO_IMAGE_BASE + 'time-rewind-mark.jpg" alt="" width="44" height="44" decoding="async">';
  }

  function fossilTimeRestoreMarkup(specimen) {
    if (!isTimeRewindSpecimen(specimen)) return '';
    var ageOnly = specimen.timeArrival === 'age';
    var src = ageOnly ? '' : fossilRestorationSrc(specimen);
    var caption = specimen.scientificName;
    var path = fossilTimePath(specimen);
    var figure = src
      ? '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(caption) + '">'
      : (ageOnly ? '' : '<p class="mcwf-time-plate__empty">\u5c1a\u7121\u5df2\u6838\u5c0d\u7684\u751f\u6d3b\u5fa9\u539f\u5716</p>');
    var restoreButton =
      '<button type="button" class="mcwf-time-restore is-age-launch mc-time-rewind" data-fossil-restore aria-label="' + escapeHtml(L('\u6642\u5149\u56de\u6eaf', 'Time rewind')) + '">' +
      timeMachineIconMarkup() +
      '<span class="mc-time-rewind__cue">' + escapeHtml(L('\u6642\u5149\u56de\u6eaf', 'Time rewind')) + '</span>' +
      '</button>';
    return restoreButton +
      '<aside class="mcwf-time-plate" lang="zh-Hant" data-time-plate hidden>' +
      '<figure class="mcwf-time-plate__result">' + figure +
      '<figcaption><span>\u53e4\u751f\u7269\u6642\u5149\u6a5f</span><strong>' + escapeHtml(caption) + '</strong></figcaption></figure>' +
      '<div class="mcwf-time-plate__scan">' +
      '<div class="mcwf-time-eras" aria-hidden="true">' +
      fossilEraScenes().map(function (scene) {
        return '<img data-era-scene="' + scene.key + '" src="' + escapeHtml(WORKFLOW_PALEO_IMAGE_BASE + scene.file) + '" alt="">';
      }).join('') +
      '</div>' +
      '<div class="mcwf-time-strata" aria-hidden="true"></div>' +
      '<div class="mcwf-time-veil" aria-hidden="true"></div>' +
      '<span class="mcwf-time-plate__beam" aria-hidden="true"></span>' +
      '<div class="mcwf-time-vortex" aria-hidden="true"></div>' +
      '<div class="mcwf-time-streaks" aria-hidden="true"></div>' +
      '<div class="mcwf-time-grain" aria-hidden="true"></div>' +
      '<div class="mcwf-time-readout" lang="zh-Hant">' +
      '<p class="mcwf-time-plate__phase" data-time-phase>\u96e2\u958b\u73fe\u4e16</p>' +
      '<strong class="mcwf-time-plate__era" data-time-era lang="zh-Hant">\u73fe\u4ee3</strong>' +
      '<strong class="mcwf-time-plate__clock" data-time-clock>' + escapeHtml(fossilAgeClock('0')) + '</strong>' +
      '<small class="mcwf-time-plate__ma" data-time-ma>' + escapeHtml(isZh() ? '' : '0 Ma') + '</small>' +
      '<div class="mcwf-time-plate__horizon" aria-hidden="true"><span data-time-bar></span></div>' +
      '</div>' +
      '<ol class="mcwf-time-track" data-time-track lang="zh-Hant">' +
      path.map(function (mark, index) {
        return '<li data-time-index="' + index + '"><b>' + escapeHtml(traditionalGeoText(mark.label)) + '</b><small>' + escapeHtml(fossilAgeNote(mark.ma)) + '</small></li>';
      }).join('') +
      '</ol></div>' +
      '<button type="button" class="mcwf-time-skip" data-fossil-skip hidden>' +
      '<svg class="mcwf-time-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.5 7v10M9.5 8.2 16 12l-6.5 3.8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>' +
      '<span>' + escapeHtml(L('\u8df3\u904e\u6642\u7a7a\u56de\u6eaf', 'Skip the rewind')) + '</span>' +
      '</button>' +
      '<button type="button" class="mcwf-time-close" data-fossil-close aria-label="' + escapeHtml(L('\u95dc\u9589', 'Close')) + '">' +
      '<svg class="mcwf-time-glyph" viewBox="4 4 16 16" aria-hidden="true" focusable="false"><path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/></svg>' +
      '</button></aside>';
  }

  function syncTimePlateLabelCover() {
    if (!workflowState.frame) return;
    var plate = workflowState.frame.querySelector('[data-time-plate]');
    var nodes = workflowState.frame.querySelectorAll('.mcwf-tax-node--end');
    var open = !!(plate && !plate.hidden && (plate.classList.contains('is-scanning') || plate.classList.contains('is-revealed') || plate.classList.contains('is-age-hold')));
    var plateRect = open ? plate.getBoundingClientRect() : null;
    Array.prototype.forEach.call(nodes, function (node) {
      if (!plateRect || plateRect.width < 8) {
        node.classList.remove('is-under-plate');
        return;
      }
      var rect = node.getBoundingClientRect();
      var overlap = rect.width > 2 && rect.height > 2 &&
        rect.right > plateRect.left + 6 && rect.left < plateRect.right - 6 &&
        rect.bottom > plateRect.top + 6 && rect.top < plateRect.bottom - 6;
      node.classList.toggle('is-under-plate', overlap);
    });
  }

  function clearTimePlateCover() {
    if (!workflowState.frame) return;
    workflowState.frame.classList.remove('is-time-live');
    var covered = workflowState.frame.querySelectorAll('.is-under-plate');
    Array.prototype.forEach.call(covered, function (node) {
      node.classList.remove('is-under-plate');
    });
  }

  function setEraScene(plate, sceneKey) {
    var prev = plate.getAttribute('data-era-live') || '';
    Array.prototype.forEach.call(plate.querySelectorAll('[data-era-scene]'), function (img) {
      var on = img.getAttribute('data-era-scene') === sceneKey;
      if (on) {
        img.classList.remove('is-leaving');
        img.classList.add('is-on');
      } else if (img.classList.contains('is-on')) {
        img.classList.remove('is-on');
        img.classList.add('is-leaving');
      } else {
        img.classList.remove('is-leaving');
      }
    });
    if (sceneKey && sceneKey !== prev) {
      plate.setAttribute('data-era-live', sceneKey);
      plate.classList.remove('is-shift');
      if (prev) {
        void plate.offsetWidth;
        plate.classList.add('is-shift');
      }
    }
  }

  function runFossilTimeRestore() {
    if (!workflowState.frame) return;
    var specimen = specimenById(workflowState.selectedSpecimenId);
    if (!isTimeRewindSpecimen(specimen)) return;
    var plate = workflowState.frame.querySelector('[data-time-plate]');
    var button = workflowState.frame.querySelector('[data-fossil-restore]');
    if (!plate) return;
    var path = fossilTimePath(specimen);
    var rows = plate.querySelectorAll('[data-time-index]');
    var era = plate.querySelector('[data-time-era]');
    var clock = plate.querySelector('[data-time-clock]');
    var maNote = plate.querySelector('[data-time-ma]');
    var phase = plate.querySelector('[data-time-phase]');
    var bar = plate.querySelector('[data-time-bar]');
    var skipBtn = plate.querySelector('[data-fossil-skip]');
    workflowState.fossilRestoreToken = (workflowState.fossilRestoreToken || 0) + 1;
    var token = workflowState.fossilRestoreToken;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var step = 0;
    var ageOnly = specimen.timeArrival === 'age';
    plate.hidden = false;
    plate.classList.remove('is-revealed', 'is-age-hold', 'is-horizon', 'is-blitz', 'is-warp', 'is-epoch');
    plate.classList.add('is-scanning', 'is-arming');
    workflowState.frame.classList.add('is-time-live', 'is-time-arming');
    if (button) {
      button.setAttribute('aria-busy', 'true');
      button.classList.add('is-launch');
    }
    if (skipBtn) skipBtn.hidden = false;
    if (phase) phase.textContent = ageOnly ? '\u9396\u5b9a\u986f\u5fae\u5f71\u50cf' : '\u9396\u5b9a\u5316\u77f3\u5f71\u50cf';
    if (era) era.textContent = '\u73fe\u4ee3';
    if (clock) clock.textContent = fossilAgeClock('0');
    plate.removeAttribute('data-era-live');
    setEraScene(plate, 'today');
    function paint(index, arrived) {
      Array.prototype.forEach.call(rows, function (row) {
        var at = Number(row.getAttribute('data-time-index'));
        row.classList.toggle('is-passed', at < index);
        row.classList.toggle('is-active', at === index);
        row.classList.toggle('is-arrived', arrived && at === index);
      });
      var mark = path[index];
      var depth = (index + 1) / path.length;
      var dwell = fossilDwellMs(index, path.length);
      plate.style.setProperty('--time-progress', String(depth));
      plate.classList.toggle('is-horizon', !!arrived);
      plate.classList.toggle('is-blitz', !arrived && dwell <= 220);
      plate.classList.toggle('is-warp', !arrived && dwell > 220 && dwell < 520);
      plate.classList.toggle('is-epoch', arrived || dwell >= 520);
      plate.classList.remove('is-period');
      var sceneKey = mark ? sceneKeyForMark(mark) : '';
      plate.classList.toggle('is-era', !!sceneKey);
      setEraScene(plate, sceneKey);
      if (era && mark) {
        era.textContent = traditionalGeoText(mark.label);
        era.classList.remove('is-rush');
        if (!reduce) {
          void era.offsetWidth;
          era.classList.add('is-rush');
        }
      }
      if (clock && mark) clock.textContent = fossilAgeClock(mark.ma);
      if (maNote && mark) maNote.textContent = isZh() ? '' : fossilAgeNote(mark.ma);
      if (bar) bar.style.width = Math.round(depth * 100) + '%';
      if (phase) {
        var near = index > 0 && index >= path.length - Math.min(3, path.length - 1);
        phase.textContent = arrived
          ? '\u62b5\u9054\u751f\u5b58\u5e74\u4ee3'
          : (index === 0
            ? '\u96e2\u958b\u73fe\u4e16'
            : (near
              ? '\u63a5\u8fd1\u751f\u5b58\u5e74\u4ee3'
              : (dwell < 480
                ? '\u6642\u5149\u52a0\u901f\u5012\u6d41'
                : '\u6642\u9593\u958b\u59cb\u5012\u6d41')));
      }
      var active = plate.querySelector('[data-time-index="' + index + '"]');
      var track = plate.querySelector('[data-time-track]');
      if (active && track) track.scrollTop = Math.max(0, active.offsetTop - track.clientHeight * 0.45);
      syncTimePlateLabelCover();
    }
    function holdAge() {
      if (workflowState.fossilRestoreToken !== token || !plate) return;
      var held = path[path.length - 1];
      var heldKey = sceneKeyForMark(held);
      plate.classList.remove('is-arming', 'is-blitz', 'is-warp', 'is-period', 'is-revealed');
      plate.classList.add('is-age-hold', 'is-horizon', 'is-epoch');
      plate.classList.toggle('is-era', !!heldKey);
      if (heldKey) setEraScene(plate, heldKey);
      workflowState.frame.classList.remove('is-time-arming');
      if (button) {
        button.removeAttribute('aria-busy');
        button.classList.remove('is-launch');
      }
      if (skipBtn) skipBtn.hidden = true;
      if (phase) phase.textContent = '\u62b5\u9054\u751f\u5b58\u5e74\u4ee3';
      workflowState.fossilRestoreSkip = null;
      window.requestAnimationFrame(function () {
        syncTimePlateLabelCover();
      });
    }
    function finish() {
      if (ageOnly) holdAge();
      else reveal();
    }
    function reveal() {
      if (workflowState.fossilRestoreToken !== token || !plate) return;
      plate.classList.remove('is-scanning', 'is-arming');
      plate.classList.add('is-revealed');
      workflowState.frame.classList.remove('is-time-arming');
      if (button) {
        button.removeAttribute('aria-busy');
        button.classList.remove('is-launch');
      }
      if (skipBtn) skipBtn.hidden = true;
      workflowState.fossilRestoreSkip = null;
      window.requestAnimationFrame(function () {
        syncTimePlateLabelCover();
      });
    }
    function showPeriodGate(periodId, done) {
      if (workflowState.fossilRestoreToken !== token) return;
      if (reduce || !periodId) {
        done();
        return;
      }
      var sceneKey = 'period-' + periodId;
      plate.classList.add('is-period', 'is-era');
      plate.classList.remove('is-blitz');
      setEraScene(plate, sceneKey);
      if (era) era.textContent = fossilPeriodName(periodId);
      if (phase) phase.textContent = '\u9019\u500b\u4e16\u63db\u5230\u53e6\u4e00\u500b\u7d00';
      workflowState.fossilRestoreTimer = window.setTimeout(function () {
        if (workflowState.fossilRestoreToken !== token) return;
        plate.classList.remove('is-period');
        done();
      }, 1100);
    }
    function tick() {
      if (workflowState.fossilRestoreToken !== token) return;
      step += 1;
      var arrived = step >= path.length - 1;
      var prev = path[step - 1];
      var mark = path[step];
      var prevPeriod = prev ? fossilPeriodId(prev.label) : '';
      var nextPeriod = mark ? fossilPeriodId(mark.label) : '';
      function go() {
        if (workflowState.fossilRestoreToken !== token) return;
        paint(step, arrived);
        if (arrived) {
          workflowState.fossilRestoreTimer = window.setTimeout(finish, reduce ? 0 : fossilDwellMs(step, path.length));
          return;
        }
        workflowState.fossilRestoreTimer = window.setTimeout(tick, reduce ? 0 : fossilDwellMs(step, path.length));
      }
      if (prevPeriod && nextPeriod && prevPeriod !== nextPeriod) {
        showPeriodGate(nextPeriod, go);
        return;
      }
      go();
    }
    function begin() {
      if (workflowState.fossilRestoreToken !== token) return;
      plate.classList.remove('is-arming');
      workflowState.frame.classList.remove('is-time-arming');
      paint(0, path.length === 1);
      if (path.length === 1) {
        workflowState.fossilRestoreTimer = window.setTimeout(finish, reduce ? 0 : fossilDwellMs(0, 1));
      } else {
        workflowState.fossilRestoreTimer = window.setTimeout(tick, reduce ? 0 : fossilDwellMs(0, path.length));
      }
    }
    window.clearTimeout(workflowState.fossilRestoreTimer);
    workflowState.fossilRestoreSkip = function () {
      if (workflowState.fossilRestoreToken !== token) return;
      window.clearTimeout(workflowState.fossilRestoreTimer);
      paint(Math.max(0, path.length - 1), true);
      finish();
    };
    workflowState.fossilRestoreTimer = window.setTimeout(begin, reduce ? 0 : 780);
  }

  function skipFossilTimeRestore() {
    if (typeof workflowState.fossilRestoreSkip === 'function') workflowState.fossilRestoreSkip();
  }

  function closeFossilTimePlate() {
    if (!workflowState.frame) return;
    workflowState.fossilRestoreToken = (workflowState.fossilRestoreToken || 0) + 1;
    window.clearTimeout(workflowState.fossilRestoreTimer);
    workflowState.fossilRestoreSkip = null;
    var plate = workflowState.frame.querySelector('[data-time-plate]');
    var button = workflowState.frame.querySelector('[data-fossil-restore]');
    if (plate) {
      plate.hidden = true;
      plate.classList.remove('is-scanning', 'is-arming', 'is-revealed', 'is-age-hold', 'is-horizon', 'is-blitz', 'is-warp', 'is-epoch', 'is-era', 'is-shift', 'is-period');
      plate.removeAttribute('data-era-live');
    }
    workflowState.frame.classList.remove('is-time-live', 'is-time-arming');
    if (button) {
      button.removeAttribute('aria-busy');
      button.classList.remove('is-launch');
    }
    clearTimePlateCover();
  }

  function syncTaxonomyFromSpecimen(specimen) {
    var nodes = taxonomyTreeNodes(specimen);
    workflowState.selectedTaxonomyNode = nodes[nodes.length - 1];
  }
  function archivePatternById(id) {
    return archivePatterns.filter(function (pattern) { return pattern.id === id; })[0] || archivePatterns[0];
  }

  function recommendedArchiveBgId(specimen) {
    if (!specimen) return 'academic-green';
    var tax = String(specimen.taxonomy || '').toLowerCase();
    var taxon = String(specimen.taxon || '').toUpperCase();
    var category = String(specimen.category || '');
    if (category === 'dinopedia' || tax.indexOf('dinosauria') >= 0) return 'dinosauria-archive';
    if (category === 'paleontology' || tax.indexOf('paleobiota') >= 0 || tax.indexOf('trilobit') >= 0) return 'fossil-archive';
    if (category === 'botany' || tax.indexOf('plantae') >= 0) return 'plantae-archive';
    if (taxon === 'LEPIDOPTERA' || tax.indexOf('lepidoptera') >= 0) return 'lepidoptera-archive';
    if (category === 'entomology' || tax.indexOf('coleoptera') >= 0 || tax.indexOf('insecta') >= 0) return 'coleoptera-archive';
    return 'academic-green';
  }

  function syncArchiveBgFromSpecimen() {
    if (workflowState.archiveBgManual) return;
    var specimen = specimenById(workflowState.selectedSpecimenId);
    workflowState.selectedArchiveBg = recommendedArchiveBgId(specimen);
  }
  function displayedProgress(stage) {
    return stage.id === 'sat-id' && !workflowState.satGenerated ? 74 : stage.progress;
  }
  function isPhoneLandingWorkflow() {
    try {
      if (document.documentElement.classList.contains('ui-layout-mobile')) return true;
    } catch (ePhoneClass) {
      void 0;
    }
    return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  }

  function applyCardTransform() {
    if (!workflowState.card || workflowState.index < 0) return;
    var stage = mcuratorWorkflowStages[workflowState.index];
    var t = stage.transform;
    var back = workflowState.cardSide === 'back';
    var lift = workflowState.hovered ? -8 : (workflowState.focused ? -3 : 0);
    var scale = t.scale * (1 + (workflowState.hovered ? 0.012 : 0) + (workflowState.focused ? 0.008 : 0));
    var depthZ = t.z + (workflowState.hovered ? 12 : 0) + (workflowState.focused ? 6 : 0);
    var card = workflowState.card;
    if (isPhoneLandingWorkflow()) {
      card.style.transform = 'none';
    } else {
      card.style.transform = 'translate3d(' + t.x + 'px,' + (t.y + lift) + 'px,' + depthZ + 'px) rotateX(' +
        (t.rx + workflowState.pointerTiltX) + 'deg) rotateY(' + (t.ry + workflowState.pointerTiltY) +
        'deg) rotateZ(' + t.rz + 'deg) scale(' + scale + ')';
    }
    card.classList.toggle('is-back', back);
    card.classList.toggle('is-hovered', workflowState.hovered);
    card.classList.toggle('is-focused', workflowState.focused);
    var cardInner = workflowState.cardInner;
    if (cardInner) {
      cardInner.style.transform = back ? 'rotateY(180deg)' : 'rotateY(0deg)';
    }
    if (workflowState.cardFloat) {
      workflowState.cardFloat.classList.toggle('is-interactive', workflowState.hovered);
    }
  }

  function resetCardReveal() {
    if (!workflowState.front) return;
    var card = workflowState.front.querySelector('.mc-passport-card--workflow');
    if (card) card.classList.remove('is-revealed', 'is-typing-entry');
  }

  function cancelCardTyping() {
    workflowState.typingSession += 1;
    window.clearTimeout(workflowState.typingTimer);
    if (workflowState.typingQueue && workflowState.typingQueue.length) {
      workflowState.typingQueue.forEach(function (timer) { window.clearTimeout(timer); });
    }
    workflowState.typingQueue = [];
    if (workflowState.front) {
      Array.prototype.forEach.call(workflowState.front.querySelectorAll('[data-typing-active]'), function (node) {
        node.removeAttribute('data-typing-active');
      });
    }
  }

  function queueTypingStep(fn, delay) {
    var timer = window.setTimeout(fn, delay);
    workflowState.typingQueue.push(timer);
    return timer;
  }

  function typeIntoElement(element, text, session, done) {
    if (!element || session !== workflowState.typingSession) {
      if (done) done();
      return;
    }
    element.setAttribute('data-typing-active', '');
    element.textContent = '';
    var chars = String(text || '');
    var index = 0;
    function step() {
      if (session !== workflowState.typingSession) {
        element.removeAttribute('data-typing-active');
        return;
      }
      if (index >= chars.length) {
        element.removeAttribute('data-typing-active');
        if (done) done();
        return;
      }
      var chunk = chars.length > 40 ? 2 : 1;
      var added = 0;
      while (added < chunk && index < chars.length) {
        element.textContent += chars.charAt(index);
        index += 1;
        added += 1;
      }
      var speed = chars.charAt(index - 1) === ' ' ? 6 : 10;
      speed += Math.floor(Math.random() * 6);
      workflowState.typingTimer = window.setTimeout(step, speed);
      workflowState.typingQueue.push(workflowState.typingTimer);
    }
    step();
  }

  function runPhotosCardTyping(stage, progressFrom, progressTo) {
    cancelCardTyping();
    var session = workflowState.typingSession;
    var card = workflowState.front && workflowState.front.querySelector('.mc-passport-card--workflow');
    if (!card) return;
    var specimen = specimenById(workflowState.selectedSpecimenId);
    progressFrom = progressFrom || 0;
    progressTo = progressTo == null ? displayedProgress(stage) : progressTo;
    var body = card.querySelector('.mc-passport-card__body');
    var alreadyRevealed = card.classList.contains('is-revealed');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var photo = card.querySelector('.mc-passport-card__photo');
    var img = photo && photo.querySelector('img');
    if (photo) {
      photo.classList.add('has-photo');
      photo.classList.toggle('is-photo-cover', photoFillsFrame(specimen));
    }

    var fields = [
      { el: card.querySelector('.mc-passport-card__mcId'), text: formatMcPlain(specimen.mc) },
      { el: card.querySelector('.mc-passport-card__taxon'), text: taxonGenus(specimen) },
      { el: card.querySelector('.mc-passport-card__sci'), text: specimen.scientificName },
      { el: card.querySelector('.mc-passport-card__common'), text: displayCommonName(specimen) },
      { el: card.querySelector('[data-meta="locality"] dd'), text: displayLocality(specimen) },
      { el: card.querySelector('[data-meta="date"] dd'), text: displayDate(specimen) },
      { el: card.querySelector('[data-meta="collector"] dd'), text: displayCollector(specimen) },
      { el: card.querySelector('[data-meta="visibility"] dd'), text: workflowVisibility(stage, false, true, specimen) },
      { el: card.querySelector('.mc-passport-card__catalog'), text: registryFooter(specimen, false) }
    ];

    function applyFieldsInstant() {
      fields.forEach(function (field) {
        if (field.el) field.el.textContent = field.text;
      });
    }

    function finishTypingEntry() {
      if (session !== workflowState.typingSession) return;
      card.classList.remove('is-typing-entry');
      card.classList.add('is-revealed');
      if (img) img.style.opacity = '1';
      if (body) {
        body.classList.remove('is-content-swap-out', 'is-content-swap-in');
        body.classList.add('is-content-swap-settled');
        window.setTimeout(function () {
          if (session !== workflowState.typingSession) return;
          body.classList.remove('is-content-swap-settled');
        }, 420);
      }
      animateProgressBar(progressFrom, progressTo);
    }

    /* Option change on an already-shown photos card: fade body in place — do not blank fields. */
    if (alreadyRevealed && !reduceMotion) {
      if (body) body.classList.add('is-content-swap-out');
      queueTypingStep(function () {
        if (session !== workflowState.typingSession) return;
        if (img) {
          img.classList.add('is-photo-loaded');
          assignSpecimenPhoto(img, specimen);
          img.style.opacity = '1';
        }
        applyFieldsInstant();
        if (body) {
          body.classList.remove('is-content-swap-out');
          body.classList.add('is-content-swap-in');
          window.requestAnimationFrame(function () {
            body.classList.remove('is-content-swap-in');
            body.classList.add('is-content-swap-settled');
            finishTypingEntry();
          });
        } else {
          finishTypingEntry();
        }
      }, 220);
      return;
    }

    card.classList.remove('is-revealed');
    card.classList.add('is-typing-entry');
    if (img) {
      img.classList.add('is-photo-loaded');
      img.style.opacity = '0';
      assignSpecimenPhoto(img, specimen);
    }

    if (reduceMotion) {
      applyFieldsInstant();
      finishTypingEntry();
      return;
    }

    fields.forEach(function (field) {
      if (field.el) field.el.textContent = '';
    });

    function startFieldTyping() {
      function typeFields(index) {
        if (session !== workflowState.typingSession) return;
        if (index >= fields.length) {
          finishTypingEntry();
          return;
        }
        var field = fields[index];
        if (!field.el) {
          typeFields(index + 1);
          return;
        }
        typeIntoElement(field.el, field.text, session, function () {
          queueTypingStep(function () { typeFields(index + 1); }, 48);
        });
      }
      typeFields(0);
    }

    function revealPhoto() {
      if (session !== workflowState.typingSession) return;
      if (!img) {
        queueTypingStep(startFieldTyping, 120);
        return;
      }
      var showPhoto = function () {
        if (session !== workflowState.typingSession) return;
        img.style.opacity = '1';
        queueTypingStep(startFieldTyping, 160);
      };
      if (img.complete && img.naturalWidth) showPhoto();
      else img.onload = showPhoto;
    }

    queueTypingStep(revealPhoto, 80);
  }

  function cancelBlankReveal() {
    workflowState.blankRevealSession += 1;
  }

  function runBlankStageEntrance(stage, progressFrom, progressTo) {
    cancelBlankReveal();
    cancelCardTyping();
    var session = workflowState.blankRevealSession;
    var card = workflowState.front && workflowState.front.querySelector('.mc-passport-card--workflow');
    var evolving = workflowState.card;
    var cardFloat = workflowState.cardFloat;
    if (!card || !evolving) return;

    if (cardFloat) {
      cardFloat.classList.remove('is-blank-revealed');
      cardFloat.classList.add('is-blank-entering');
    }
    evolving.classList.remove('is-blank-revealed', 'is-revealed');
    evolving.classList.add('is-blank-entering');
    evolving.style.filter = '';
    evolving.style.opacity = '';
    /* Keep the current pose. A hard transform reset makes the card jump. */
    card.classList.remove('is-revealed', 'is-typing-entry');

    var meter = card.querySelector('.mc-passport-card__bar > span');
    if (meter) meter.style.width = '0%';

    var fields = [
      { el: card.querySelector('.mc-passport-card__mcId'), text: 'MC - 000000' },
      { el: card.querySelector('.mc-passport-card__sat'), text: 'SAT-MC-000000' },
      { el: card.querySelector('.mc-passport-card__taxon'), text: L('標本', 'SPECIMEN', wfI18nPack() ? wfI18nPack().specimenPill : '標本') },
      { el: card.querySelector('.mc-passport-card__sci'), text: L('\u5b78\u540d', 'Scientific name', '学名') },
      { el: card.querySelector('.mc-passport-card__common'), text: L('\u4fd7\u540d', 'Common name', '一般名') },
      { el: card.querySelector('[data-meta="locality"] dd'), text: '\u2014' },
      { el: card.querySelector('[data-meta="date"] dd'), text: '\u2014' },
      { el: card.querySelector('[data-meta="collector"] dd'), text: '\u2014' },
      { el: card.querySelector('[data-meta="visibility"] dd'), text: '\u2014' },
      { el: card.querySelector('.mc-passport-card__catalog'), text: 'NHM \u2022 MC \u2022 REG-000000 \u2022 \u03b2' }
    ];
    fields.forEach(function (field) {
      if (field.el) field.el.textContent = '';
    });

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      evolving.classList.remove('is-blank-entering');
      evolving.classList.add('is-blank-revealed', 'is-revealed');
      evolving.style.opacity = '';
      evolving.style.transition = '';
      evolving.style.filter = '';
      if (cardFloat) {
        cardFloat.classList.remove('is-blank-entering');
        cardFloat.classList.add('is-blank-revealed');
      }
      card.classList.add('is-revealed');
      fields.forEach(function (field) {
        if (field.el) field.el.textContent = field.text;
      });
      applyCardTransform();
      if (meter) meter.style.width = (progressTo || 0) + '%';
      return;
    }

    function startBlankSettle() {
      if (session !== workflowState.blankRevealSession) return;
      evolving.classList.remove('is-blank-entering');
      evolving.classList.add('is-blank-revealed');
      if (cardFloat) {
        cardFloat.classList.remove('is-blank-entering');
        cardFloat.classList.add('is-blank-revealed');
      }
      evolving.style.transition = 'transform 780ms cubic-bezier(0.22, 1, 0.36, 1), opacity 680ms cubic-bezier(0.22, 1, 0.36, 1)';
      evolving.style.opacity = '1';
      evolving.style.filter = '';
      applyCardTransform();
      window.setTimeout(function () {
        if (session !== workflowState.blankRevealSession) return;
        evolving.style.transition = '';
        evolving.style.filter = '';
        evolving.style.opacity = '';
      }, 780);
      card.classList.add('is-typing-entry');
      function typeFields(index) {
        if (session !== workflowState.blankRevealSession) return;
        if (index >= fields.length) {
          card.classList.remove('is-typing-entry');
          card.classList.add('is-revealed');
          evolving.classList.add('is-revealed');
          animateProgressBar(progressFrom || 0, progressTo || 0);
          return;
        }
        var field = fields[index];
        if (!field.el) {
          queueTypingStep(function () { typeFields(index + 1); }, 24);
          return;
        }
        typeIntoElement(field.el, field.text, workflowState.typingSession, function () {
          queueTypingStep(function () { typeFields(index + 1); }, 36);
        });
      }
      /* Let the card mostly settle before typewriter begins */
      queueTypingStep(function () { typeFields(0); }, 320);
    }

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(startBlankSettle);
    });
  }

  function triggerCardReveal(progressTo, progressFrom) {
    window.clearTimeout(workflowState.revealTimer);
    resetCardReveal();
    if (!workflowState.front) return;
    var card = workflowState.front.querySelector('.mc-passport-card--workflow');
    if (!card) return;
    var stage = mcuratorWorkflowStages[workflowState.index];
    if (stage && stage.id === 'blank') {
      workflowState.revealTimer = window.setTimeout(function () {
        runBlankStageEntrance(stage, progressFrom || 0, progressTo);
      }, 80);
      return;
    }
    if (stage && stage.id === 'photos') {
      workflowState.revealTimer = window.setTimeout(function () {
        runPhotosCardTyping(stage, progressFrom || 0, progressTo);
      }, 56);
      return;
    }
    if (stage && stage.id === 'provenance') {
      workflowState.revealTimer = window.setTimeout(function () {
        runProvenanceCardTyping(stage, progressFrom || 0, progressTo);
      }, 420);
      return;
    }
    if (stage && stage.id === 'disciplines') {
      card.classList.add('is-revealed');
      return;
    }
    var meter = workflowState.front.querySelector('.mc-passport-card__bar > span');
    if (meter) meter.style.width = (progressFrom || 0) + '%';
    workflowState.revealTimer = window.setTimeout(function () {
      card.classList.add('is-revealed');
      window.setTimeout(function () {
        animateProgressBar(progressFrom || 0, progressTo);
      }, 120);
    }, 56);
  }

  function taxonGenus(specimen) {
    if (!specimen) return L('標本', 'SPECIMEN', wfI18nPack() ? wfI18nPack().specimenPill : '標本');
    if (specimen.taxon) return String(specimen.taxon).toUpperCase();
    var genus = String(specimen.scientificName || '').trim().split(/\s+/)[0] || '';
    genus = genus.replace(/[^A-Za-z]/g, '');
    return genus ? genus.toUpperCase() : 'SPECIMEN';
  }

  function taxonomicClassPill(specimen) {
    if (!specimen) return 'SPECIMEN';
    if (specimen.taxonomicClass) return String(specimen.taxonomicClass).toUpperCase();
    var blob = String(specimen.taxonomy || '') + ' ' + String(specimen.scientificName || '') +
      ' ' + String(specimen.category || '');
    if (/trilobit/i.test(blob)) return 'TRILOBITA';
    if (/lepidoptera|nymphalidae|papilionidae|\u9c57\u7fc5/i.test(blob)) return 'LEPIDOPTERA';
    if (/coleoptera|lucanidae|scarabaeidae|elateridae|\u7532\u866b|\u8247\u7fc5/i.test(blob)) return 'COLEOPTERA';
    if (/ammonoidea|ammonite/i.test(blob)) return 'AMMONOIDEA';
    if (/dinosauria|tyrannosaurus|dinopedia/i.test(blob)) return 'DINOSAURIA';
    if (/plantae|ginkgo|quercus|nelumbo|adiantum|drosera|mimosa|nepenthes|pinus|platycerium|koelreuteria|nephrolepis|botany/i.test(blob)) return 'MAGNOLIOPSIDA';
    if (/insecta|\u6606\u87f2/i.test(blob)) return 'INSECTA';
    if (/arthropoda|\u7bc0\u80a2/i.test(blob)) return 'ARTHROPODA';
    var parts = String(specimen.taxonomy || '').split(' \u2192 ').map(function (part) {
      return part.trim();
    }).filter(Boolean);
    if (parts.length >= 4) {
      var order = parts[3].replace(/[^A-Za-z]/g, '').toUpperCase();
      if (order.length >= 4) return order;
    }
    if (parts.length >= 3) {
      var cls = parts[2].replace(/[^A-Za-z]/g, '').toUpperCase();
      if (cls.length >= 4) return cls;
    }
    return 'SPECIMEN';
  }

  function workflowExportLine(stage, progress, verified) {
    var pack = wfI18nPack();
    if (verified || stage.id === 'finished' || progress >= 100) {
      return L('可追溯匯出', 'traceable export', pack ? pack.traceableExport : '追跡可能なエクスポート');
    }
    return L('待匯出', 'export pending', pack ? pack.exportPending : 'エクスポート待ち');
  }

  function formatMcDisplay(code, pending) {
    if (pending) return 'MC - 000000';
    var raw = String(code || '').trim().replace(/\s+/g, '');
    if (!raw) return 'MC - 000000';
    var match = /^MC[\s\-]*([\dA-Za-z].*)$/i.exec(raw);
    if (match) return 'MC - ' + escapeHtml(String(match[1]).replace(/^[\s\-]+/, ''));
    if (/^\d+$/.test(raw)) return 'MC - ' + escapeHtml(raw);
    return escapeHtml(raw);
  }

  function formatMcPlain(code) {
    var raw = String(code || '').trim().replace(/\s+/g, '');
    if (!raw) return 'MC - 000000';
    var match = /^MC[\s\-]*([\dA-Za-z].*)$/i.exec(raw);
    if (match) return 'MC - ' + String(match[1]).replace(/^[\s\-]+/, '');
    if (/^\d+$/.test(raw)) return 'MC - ' + raw;
    return raw;
  }

  function formatSatLine(sat, pending) {
    if (pending) return 'SAT-MC-000000';
    var text = String(sat || 'SAT-MC-000507').trim();
    if (!text) return 'SAT-MC-000507';
    if (/^SAT-MC/i.test(text)) return escapeHtml(text.replace(/\s+/g, ''));
    return escapeHtml('SAT-MC-' + text.replace(/^SAT[\s\-]*MC[\s\-]*/i, '').replace(/\s+/g, ''));
  }

  function registryFooter(specimen, pending) {
    if (pending) return 'NHM \u2022 MC \u2022 REG-000000 \u2022 \u03b2';
    var num = String(specimen.mc || '').replace(/^MC[\s\-]*/i, '').replace(/\s+/g, '') || '000000';
    var taxBlob = String(specimen.taxonomy || '') + String(specimen.scientificName || '');
    var prefix = /LEP|LEPIDOPTERA|\u9c57\u7fc5|Nymphalidae|Kaniska/i.test(taxBlob) ? 'LEP'
      : (/plantae|ginkgo|quercus|nelumbo|adiantum|drosera|mimosa|nepenthes|pinus|platycerium|koelreuteria|nephrolepis|botany/i.test(taxBlob) ? 'BOT'
        : (/dinosauria|tyrannosaurus|nyctosaurus|shringasaurus|anningasaura|dinopedia/i.test(taxBlob) ? 'DINO' : 'REG'));
    return 'NHM \u2022 MC \u2022 ' + prefix + '-' + num + ' \u2022 \u03b2';
  }

  function workflowRarityGem() {
    return '<div class="ppc-rarity-gem ppc-rarity-gem--medal ppc-rarity-gem--tier-n" data-tier="N" role="img" aria-label="' +
      escapeHtml(L('稀有度 N', 'Rarity N')) + '">' +
      '<div class="ppc-rarity-gem__plate"><span class="ppc-rarity-gem__code">N</span></div></div>';
  }

  function workflowVisibility(stage, verified, showSpecimen, specimen) {
    if (!showSpecimen) return '\u2014';
    if (specimen && specimen.visibility) return localizeVisibility(specimen.visibility);
    if (stage.id === 'finished') return L('博物館數位典藏', 'Museum digital collection');
    if (verified) return L('限研究可見', 'Research visibility');
    if (stage.progress >= 18) return L('未設定', 'Not set');
    return '\u2014';
  }

  function disciplinePreviewFace() {
    var discipline = disciplineById(workflowState.selectedDiscipline);
    var themeClass = discipline.theme ? ' mcwf-discipline-preview--' + discipline.theme : '';
    var title = disciplineTitle(discipline);
    var subtitle = disciplineSubtitle(discipline);
    return '<div class="mc-passport-card mc-passport-card--workflow mcwf-discipline-preview' + themeClass + ' is-revealed">' +
      '<div class="mc-passport-card__face mc-passport-card__face--front">' +
      '<div class="mcwf-discipline-preview__body">' +
      '<span class="mcwf-discipline-preview__eyebrow">' + L('\u5b78\u985e', 'Research category') + '</span>' +
      '<figure class="mcwf-discipline-preview__photo">' +
      '<img src="' + escapeHtml(discipline.image) + '" alt="' + escapeHtml(title) +
      '" width="600" height="420" loading="eager" decoding="async" class="is-photo-loaded"></figure>' +
      '<div class="mcwf-discipline-preview__copy">' +
      '<h2 class="mcwf-discipline-preview__title-zh">' + escapeHtml(title) + '</h2>' +
      (subtitle ? '<p class="mcwf-discipline-preview__title-en">' + escapeHtml(subtitle) + '</p>' : '') +
      '</div></div></div></div>';
  }

  function frontFace(stage) {
    if (stage.id === 'disciplines') {
      return disciplinePreviewFace();
    }
    var specimen = specimenById(workflowState.selectedSpecimenId);
    var blank = stage.id === 'blank';
    var isPhotosStage = stage.id === 'photos';
    var hasBlankPreview = blank && workflowState.blankPreviewSelected;
    var showSpecimen = !blank || hasBlankPreview;
    var pending = blank && !hasBlankPreview;
    var cardImage = showSpecimen ? specimen.image : '';
    var satIssued = !pending && (workflowState.satGenerated || stage.id === 'archive-back' || stage.id === 'finished');
    var verified = satIssued || stage.id === 'archive-back' || stage.id === 'finished';
    var progress = displayedProgress(stage);
    var reviewBadge = verified
      ? L('已審核', 'Reviewed', wfI18nPack() ? wfI18nPack().reviewed : '審査済み')
      : L('未審核', 'Not reviewed', wfI18nPack() ? wfI18nPack().notReviewed : '未レビュー');
    var statusBadge = verified ? L('已審', 'OK', '審済') : L('未審', '—', '—');
    var reviewLabel = reviewBadge;
    var exportHighlight = workflowState.selectedCapability === 'export' ? ' is-export-highlight' : '';
    var chainHighlight = workflowState.selectedCapability === 'traceability' ? ' is-chain-highlight' : '';
    var metaRows = [
      ['locality', L('產地', 'Locality', '産地'), isPhotosStage ? '' : (showSpecimen ? escapeHtml(displayLocality(specimen)) : '\u2014')],
      ['date', L('日期', 'Date', '日付'), isPhotosStage ? '' : (showSpecimen ? escapeHtml(displayDate(specimen)) : '\u2014')],
      ['collector', L('\u63a1\u96c6\u8005', 'Collector', '\u63a1\u96c6\u8005'), isPhotosStage ? '' : (showSpecimen ? escapeHtml(displayCollector(specimen)) : '\u2014')],
      ['visibility', L('是否公開', 'Visibility', '公開範囲'), isPhotosStage ? '' : escapeHtml(workflowVisibility(stage, verified, showSpecimen, specimen))]
    ];
    var exportLine = workflowExportLine(stage, progress, verified);
    var metaGrid = '<dl class="mc-passport-card__meta">' + metaRows.map(function (row) {
      return '<div data-meta="' + row[0] + '"' + (row[0] === 'date' && isZh() ? ' lang="zh-Hant"' : '') + '><dt>' + row[1] + '</dt><dd>' + row[2] + '</dd></div>';
    }).join('') + '</dl>';
    var photoClasses = 'mc-passport-card__photo mc-passport-card__photo--catalog mc-passport-card__photo--specimen-panel' +
      (showSpecimen ? ' has-photo' : '') +
      (showSpecimen && photoFillsFrame(specimen) ? ' is-photo-cover' : '');
    var photoFigure = showSpecimen
      ? '<figure class="' + photoClasses + '"><span class="mc-passport-card__photo-panel">' +
        '<img src="' + escapeHtml(displayCutoutSrc(specimen) || cardImage) + '"' + cutoutImgAttrs(specimen) + ' alt="' + escapeHtml(specimen.scientificName) +
        '" loading="eager" decoding="async" class="is-photo-loaded"></span></figure>'
      : '<figure class="' + photoClasses + '"><span class="mc-passport-card__photo-panel">' +
        '<img src="" alt="" loading="lazy" decoding="async" /></span></figure>';
    var body =
      '<div class="mc-passport-card__body">' +
      '<header class="mc-passport-card__head">' +
      '<span class="mc-passport-card__review">' + reviewBadge + '</span>' +
      '<div class="mc-passport-card__headActions">' +
      '<span class="mc-passport-card__reviewMini">' + statusBadge + '</span>' +
      '<span class="mc-passport-card__netBadge" aria-hidden="true">N</span>' +
      '</div></header>' +
      '<div class="mc-passport-card__ids">' +
      '<p class="mc-passport-card__mcId">' + (isPhotosStage ? '' : formatMcDisplay(showSpecimen ? specimen.mc : '', pending)) + '</p>' +
      '<p class="mc-passport-card__sat' + (satIssued ? ' is-ready' : '') + '">' +
      formatSatLine(satIssued ? 'SAT-MC-000507' : '', pending || !satIssued) + '</p></div>' +
      photoFigure +
      '<div class="mc-passport-card__nameplate">' +
      '<span class="mc-passport-card__taxon">' + (isPhotosStage ? '' : escapeHtml(taxonGenus(showSpecimen ? specimen : null))) + '</span>' +
      '<h2 class="mc-passport-card__sci">' + (isPhotosStage ? '' : escapeHtml(showSpecimen ? specimen.scientificName : L('學名', 'Scientific name', '学名'))) + '</h2>' +
      '<p class="mc-passport-card__common">' + (isPhotosStage ? '' : escapeHtml(showSpecimen ? displayCommonName(specimen) : L('俗名', 'Common name', '一般名'))) + '</p></div>' +
      metaGrid +
      '<footer class="mc-passport-card__footer">' +
      '<div class="mc-passport-card__progress">' +
      '<span class="mc-passport-card__progressPct">' + L('完成度 ', 'Completeness ', '完成度 ') + '<strong>' + progress + '%</strong></span>' +
      '<em class="mc-passport-card__progressNote">' + reviewLabel + '</em>' +
      '<div class="mc-passport-card__bar" role="progressbar" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100">' +
      '<span style="width:' + progress + '%;"></span></div></div>' +
      '<p class="mc-passport-card__exportLine' + exportHighlight + chainHighlight + '">QR \u2022 CSV \u2022 JSON  \u2014  ' + exportLine + '</p>' +
      '<p class="mc-passport-card__catalog">' + (isPhotosStage ? '' : registryFooter(specimen, pending)) + '</p></footer></div>';
    return '<div class="mc-passport-card mc-passport-card--workflow' + (verified ? ' is-verified' : '') +
      (isPhotosStage ? ' is-typing-entry' : '') + '">' +
      '<div class="mc-passport-card__face mc-passport-card__face--front">' + body + '</div></div>';
  }

  function backFace() {
    var specimen = specimenById(workflowState.selectedSpecimenId);
    var pattern = archivePatternById(workflowState.selectedArchiveBg);
    return '<div class="mcwf-archive-surface ' + pattern.className + '" data-archive-surface>' +
      (pattern.image ? '<img src="' + pattern.image + '" alt="' + escapeHtml(archivePatternLabel(pattern)) + ' archive pattern">' : '') +
      '</div><div class="mcwf-back-card__data"><h3>' + L('標本護照', 'Specimen passport') + '</h3><small>' +
      L('標本護照卡 · 背面', 'SPECIMEN PASSPORT CARD · back') + '</small>' +
      '<dl><dt>SAT ID</dt><dd>SAT-MC-000507</dd><dt>' + L('資產編號', 'Asset ID') + '</dt><dd>MC-ASSET-000507</dd><dt>' +
      L('標本', 'Specimen') + '</dt><dd>' + specimen.mc + '</dd>' +
      '<dt>' + L('學名', 'Scientific name') + '</dt><dd><i>' + specimen.scientificName + '</i></dd><dt>' + L('俗名', 'Common name') + '</dt><dd>' + escapeHtml(displayCommonName(specimen)) + '</dd><dt>' +
      L('分類脈絡', 'Taxonomy') + '</dt>' +
      '<dd>' + specimen.taxonomy.replace(/ \u2192 /g, ' &rarr; ') + '</dd>' +
      '<dt>' + L('授權', 'License') + '</dt><dd>' + L('CC BY-NC 4.0（示範）', 'CC BY-NC 4.0 (demo)') + '</dd><dt>' +
      L('覆核', 'Review') + '</dt><dd>' + L('館方已審', 'Curator verified') + '</dd></dl><footer>' +
      L('已驗證可機構匯出（示範）', 'Verified for institutional export (demo)') + '</footer></div>';
  }

  function miniCard(specimenId, rotation) {
    var specimen = specimenById(specimenId);
    var active = workflowState.selectedSpecimenId === specimen.id && workflowState.blankPreviewSelected;
    return '<button type="button" class="mcwf-mini' + (active ? ' is-selected' : '') + '" data-select-specimen="' + specimen.id +
      '" style="--rot:' + rotation + 'deg">' + cardMotionWrap(
        '<strong>' + L('標本護照', 'SPECIMEN PASSPORT') + '</strong><b>' + specimen.mc +
        '</b><img src="' + displayCutoutSrc(specimen) + '"' + cutoutImgAttrs(specimen) + ' alt=""><span>' + escapeHtml(displayCommonName(specimen)) + '</span>'
      ) + '<i aria-hidden="true">&#10003;</i></button>';
  }

  function apiPanel() {
    var specimen = specimenById(workflowState.selectedSpecimenId);
    var selected = apiSources[workflowState.selectedApiSource];
    return '<aside class="mcwf-panel mcwf-api"><p>' + L('智慧後設資料匯入', 'Smart metadata import') + '</p><h3>' +
      L('選定標本，快速匹配資料庫', 'Select a specimen and match databases quickly') + '</h3><div class="mcwf-api__sources">' +
      Object.keys(apiSources).map(function (source) {
        return '<button type="button" data-select-api="' + source + '" class="' + (workflowState.selectedApiSource === source ? 'is-selected' : '') + '">' +
          source + '<small>' + apiSourceTitle(source) + '</small><i aria-hidden="true">&#10003;</i></button>';
      }).join('') + '</div><label>' + L('查詢（學名）', 'Query (scientific name)') + '<strong>' + specimen.scientificName + '</strong></label><label>' +
      L('API 路徑', 'API PATH') + '<strong>' +
      selected.path + encodeURIComponent(specimen.scientificName) + '</strong></label><div class="mcwf-match"><img src="' +
      displayCutoutSrc(specimen) + '"' + cutoutImgAttrs(specimen) + ' alt=""><p>' + apiSourceTitle(workflowState.selectedApiSource) + '<br><b>' +
      L('信心度', 'confidence') + ' ' + selected.confidence + '</b><br>' +
      apiSourceResult(workflowState.selectedApiSource) + '</p></div></aside>';
  }

  function localityParts(specimen) {
    var raw = String(specimen && specimen.locality ? specimen.locality : '—');
    var bits = raw.split('\u00b7').map(function (part) { return part.trim(); }).filter(Boolean);
    return { primary: bits[0] || raw, secondary: bits[1] || bits[0] || raw, raw: raw };
  }

  function hashSeed(value) {
    var hash = 0;
    value = String(value || 'mc');
    for (var i = 0; i < value.length; i++) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
    return Math.abs(hash);
  }

  function seasonFromDate(dateStr) {
    var match = String(dateStr || '').match(/(\d{4})[\/\-](\d{1,2})/);
    if (!match) return '\u2014';
    var month = parseInt(match[2], 10);
    if (month >= 3 && month <= 5) return L('\u6625', 'Spring');
    if (month >= 6 && month <= 8) return L('\u590f', 'Summer');
    if (month >= 9 && month <= 11) return L('\u79cb', 'Autumn');
    return L('\u51ac', 'Winter');
  }

  function formatCoordinate(value, positiveSuffix, negativeSuffix) {
    if (value == null || isNaN(value)) return '—';
    var abs = Math.abs(value);
    var suffix = value >= 0 ? positiveSuffix : negativeSuffix;
    return abs.toFixed(3) + '\u00b0 ' + suffix;
  }

  function outcropProfile(match, fields) {
    return {
      match: match,
      country: fields.country,
      region: fields.region,
      nearestTown: fields.town,
      protectedArea: fields.protect || 'Documented exposure',
      siteLabel: fields.site || 'Outcrop ref',
      lat: fields.lat,
      lng: fields.lng,
      elevation: fields.elev == null ? 200 : fields.elev,
      terrainType: fields.terrain || 'Geological outcrop',
      landform: fields.landform || 'Exposure face',
      biome: 'Paleoenvironment context',
      habitatType: fields.habitat || 'Fossil-bearing horizon',
      vegetation: fields.vegetation || '\u2014',
      substrate: fields.rock || 'Sedimentary rock',
      waterProximity: 'Contextual',
      climate: 'Paleoclimate (contextual)',
      ecozone: fields.zone || '\u2014',
      weather: 'Field archive record'
    };
  }

  function geoProfileForSpecimen(specimen) {
    var parts = localityParts(specimen);
    var seed = hashSeed(specimen.id || specimen.mc);
    var blob = parts.primary + ' ' + parts.secondary;
    var profiles = [
      { match: /\u65f1\u751f\u6797/, country: 'Madagascar', region: 'Southern dry forest', nearestTown: 'Spiny forest margin', protectedArea: 'Dry forest reserve', siteLabel: 'Plot MG-Z1', lat: -25.02, lng: 46.3, elevation: 80, terrainType: 'Dry deciduous woodland', landform: 'Sandy plain', biome: 'Madagascar dry forest', habitatType: 'Spiny and dry forest floor', vegetation: 'Didiereaceae scrub', substrate: 'Sandy soil', waterProximity: 'Seasonal pool', climate: 'Tropical dry (Aw)', ecozone: 'Afrotropical', weather: 'Hot, dry' },
      { match: /\u4e7e\u65f1\u704c\u53e2|\u5167\u9678\u6c99\u5730/, country: 'Australia', region: 'Central arid zone', nearestTown: 'Inland scrub', protectedArea: 'Arid reserve', siteLabel: 'Plot AU-Z2', lat: -25.3, lng: 133.2, elevation: 420, terrainType: 'Arid shrubland', landform: 'Sand plain', biome: 'Australian desert and scrub', habitatType: 'Spinifex and shrub cover', vegetation: 'Sparse acacia and spinifex', substrate: 'Red sand', waterProximity: 'Dry', climate: 'Hot desert (BWh)', ecozone: 'Australasian', weather: 'Hot, clear' },
      { match: /\u6ab3\u57ce/, country: 'Malaysia', region: 'Penang', nearestTown: 'George Town fringe', protectedArea: 'Coastal wetland margin', siteLabel: 'Plot MY-Z3', lat: 5.41, lng: 100.33, elevation: 8, terrainType: 'Coastal lowland', landform: 'Mangrove and canal edge', biome: 'Tropical coastal wetland', habitatType: 'Riparian and canal bank', vegetation: 'Mangrove and secondary growth', substrate: 'Mud and sand', waterProximity: 'Tidal creek', climate: 'Tropical rainforest (Af)', ecozone: 'Indo-Malayan', weather: 'Warm, humid' },
      { match: /\u4f4e\u5730\u6c34\u57df/, country: 'Thailand', region: 'Central lowlands', nearestTown: 'Chao Phraya floodplain', protectedArea: 'Lowland waterway', siteLabel: 'Plot TH-Z4', lat: 14.0, lng: 100.5, elevation: 12, terrainType: 'Floodplain', landform: 'Canal and pond margin', biome: 'Tropical seasonal wetland', habitatType: 'Still and slow water edge', vegetation: 'Riparian grass and scrub', substrate: 'Alluvial mud', waterProximity: 'Water margin', climate: 'Tropical savanna (Aw)', ecozone: 'Indo-Malayan', weather: 'Warm, humid' },
      { match: /\u7409\u7403/, country: 'Japan', region: 'Ryukyu Islands', nearestTown: 'Okinawa forest', protectedArea: 'Subtropical forest', siteLabel: 'Plot JP-Z5', lat: 26.5, lng: 127.9, elevation: 90, terrainType: 'Subtropical forest', landform: 'Forested hills', biome: 'Ryukyu subtropical forest', habitatType: 'Moist forest floor', vegetation: 'Broadleaf evergreen forest', substrate: 'Forest soil', waterProximity: 'Forest stream', climate: 'Humid subtropical (Cfa)', ecozone: 'Palearctic', weather: 'Warm, humid' },
      { match: /\u6cb3\u5ddd/, country: 'Japan', region: 'Honshu', nearestTown: 'Mountain river', protectedArea: 'Riparian corridor', siteLabel: 'Plot JP-Z6', lat: 36.6, lng: 138.8, elevation: 280, terrainType: 'Forested river valley', landform: 'Boulder riverbank', biome: 'Cool temperate forest', habitatType: 'Fast clear river', vegetation: 'Riparian broadleaf trees', substrate: 'Boulder and gravel', waterProximity: 'River edge', climate: 'Humid continental margin', ecozone: 'Palearctic', weather: 'Cool, clear' },
      { match: /\u5df4\u57fa\u65af\u5766/, country: 'Pakistan', region: 'Balochistan / Punjab margin', nearestTown: 'Rocky arid hills', protectedArea: 'Arid range', siteLabel: 'Plot PK-Z7', lat: 30.2, lng: 67.0, elevation: 1100, terrainType: 'Rocky desert hills', landform: 'Scree slope', biome: 'Hot desert and scrub', habitatType: 'Rocky crevice habitat', vegetation: 'Sparse scrub', substrate: 'Rock and sand', waterProximity: 'Dry', climate: 'Hot desert (BWh)', ecozone: 'Palearctic', weather: 'Hot, dry' },
      { match: /\u5927\u5e73\u539f/, country: 'United States', region: 'Great Plains', nearestTown: 'Shortgrass prairie', protectedArea: 'Prairie dog town', siteLabel: 'Plot US-Z8', lat: 40.8, lng: -104.0, elevation: 1500, terrainType: 'Shortgrass prairie', landform: 'Rolling plain', biome: 'Temperate grassland', habitatType: 'Prairie dog colony', vegetation: 'Short grasses', substrate: 'Loam and burrow spoil', waterProximity: 'Seasonal draw', climate: 'Semi-arid continental', ecozone: 'Nearctic', weather: 'Dry, sunny' },
      { match: /\u758f\u6797/, country: 'Australia', region: 'Eastern woodland', nearestTown: 'Open eucalypt woodland', protectedArea: 'Woodland reserve', siteLabel: 'Plot AU-Z9', lat: -33.7, lng: 150.3, elevation: 420, terrainType: 'Open woodland', landform: 'Forested ridge', biome: 'Temperate eucalypt woodland', habitatType: 'Tree hollows and canopy', vegetation: 'Eucalyptus woodland', substrate: 'Forest soil', waterProximity: 'Creek line', climate: 'Temperate', ecozone: 'Australasian', weather: 'Mild, clear' },
      { match: /\u5433\u54e5\u7a9f/, country: 'Cambodia', region: 'Siem Reap', nearestTown: 'Angkor Wat', protectedArea: 'Angkor temple forest', siteLabel: 'Plot KH-Z10', lat: 13.41, lng: 103.87, elevation: 25, terrainType: 'Temple forest', landform: 'Moat and gallery margin', biome: 'Tropical seasonal forest', habitatType: 'Forest and stonework edge', vegetation: 'Secondary tropical forest', substrate: 'Laterite and leaf litter', waterProximity: 'Temple moat', climate: 'Tropical savanna (Aw)', ecozone: 'Indo-Malayan', weather: 'Warm, humid' },
      { match: /\u65b0\u5580\u91cc\u591a\u5c3c\u4e9e/, country: 'France', region: 'New Caledonia', nearestTown: 'Grande Terre forest', protectedArea: 'Humid forest', siteLabel: 'Plot NC-Z11', lat: -21.5, lng: 165.5, elevation: 360, terrainType: 'Humid tropical forest', landform: 'Forested slope', biome: 'New Caledonian rainforest', habitatType: 'Canopy and tree hollows', vegetation: 'Humid forest', substrate: 'Forest soil', waterProximity: 'Forest creek', climate: 'Tropical', ecozone: 'Australasian', weather: 'Warm, humid' },
      { match: /\u5927\u897f\u6d0b\u6cbf\u5cb8/, country: 'Morocco', region: 'Atlantic coast', nearestTown: 'Coastal dunes', protectedArea: 'Coastal scrub', siteLabel: 'Plot MA-Z12', lat: 28.0, lng: -11.6, elevation: 20, terrainType: 'Coastal desert scrub', landform: 'Dune and rocky shore', biome: 'Atlantic coastal desert', habitatType: 'Coastal rock and scrub', vegetation: 'Sparse coastal shrubs', substrate: 'Sand and rock', waterProximity: 'Atlantic shore', climate: 'Hot desert coast (BWh)', ecozone: 'Palearctic', weather: 'Warm, breezy' },
      outcropProfile(/\u5317\u6d77\u9053/, { country: 'Japan', region: 'Hokkaido', town: 'Yubari', protect: 'Yezo Group', lat: 43.06, lng: 141.97, elev: 120, habitat: 'Late Cretaceous marine shale', rock: 'Shale', zone: 'Palearctic' }),
      outcropProfile(/\u672c\u5dde/, { country: 'Japan', region: 'Honshu', town: 'Honshu', protect: 'Temperate forest', lat: 36.2, lng: 138.2, elev: 600, terrain: 'Temperate forest', habitat: 'Deciduous woodland', rock: 'Forest soil', zone: 'Palearctic', vegetation: 'Mixed broadleaf forest' }),
      outcropProfile(/\u91dd\u8449/, { country: 'Japan', region: 'Honshu', town: 'Temperate conifer forest', protect: 'Conifer stand', lat: 36.0, lng: 138.5, elev: 800, terrain: 'Temperate conifer forest', habitat: 'Pine forest', rock: 'Forest soil', zone: 'Palearctic', vegetation: 'Pinus canopy' }),
      outcropProfile(/\u5317\u7968/, { country: 'China', region: 'Liaoning', town: 'Beipiao', protect: 'Yixian Formation', lat: 41.8, lng: 120.8, elev: 200, habitat: 'Early Cretaceous lake beds', rock: 'Tuffaceous shale', zone: 'Palearctic' }),
      outcropProfile(/\u5efa\u660c/, { country: 'China', region: 'Liaoning', town: 'Jianchang', protect: 'Yixian Formation', lat: 40.82, lng: 119.8, elev: 300, habitat: 'Early Cretaceous lake beds', rock: 'Tuffaceous shale', zone: 'Palearctic' }),
      outcropProfile(/\u79d1\u7f85\u62c9\u591a|\u83ab\u91cc\u68ee/, { country: 'United States', region: 'Colorado', town: 'Morrison', protect: 'Morrison Formation', lat: 39.65, lng: -105.2, elev: 1800, habitat: 'Late Jurassic fluvial beds', rock: 'Sandstone and mudstone', zone: 'Nearctic' }),
      outcropProfile(/\u65b0\u58a8\u897f\u54e5/, { country: 'United States', region: 'New Mexico', town: 'Moreno Hill', protect: 'Moreno Hill Formation', lat: 34.2, lng: -108.5, elev: 2100, habitat: 'Turonian terrestrial beds', rock: 'Sandstone', zone: 'Nearctic' }),
      outcropProfile(/\u5df4\u4f10\u5229\u4e9e/, { country: 'Germany', region: 'Bavaria', town: 'Franconian uplands', protect: 'Deciduous woodland', lat: 49.45, lng: 11.08, elev: 420, terrain: 'Temperate deciduous woodland', habitat: 'Oak-beech woodland', rock: 'Calcareous forest soil', zone: 'Palearctic', vegetation: 'Mixed deciduous canopy' }),
      outcropProfile(/\u9739\u9742/, { country: 'Malaysia', region: 'Perak', town: 'Perak', protect: 'Lowland and hill forest', lat: 4.6, lng: 101.1, elev: 200, terrain: 'Hill dipterocarp forest', habitat: 'Lowland rainforest', rock: 'Lateritic soil', zone: 'Indo-Malayan', vegetation: 'Dipterocarp forest' }),
      outcropProfile(/\u6c99\u5df4/, { country: 'Malaysia', region: 'Sabah', town: 'Crocker Range', protect: 'Montane forest', lat: 5.85, lng: 116.3, elev: 1200, terrain: 'Montane rainforest', habitat: 'Oak-dipterocarp forest', rock: 'Forest soil', zone: 'Indo-Malayan', vegetation: 'Montane broadleaf forest' }),
      outcropProfile(/\u7802\u62c9\u8d8a/, { country: 'Malaysia', region: 'Sarawak', town: 'Sarawak', protect: 'Lowland rainforest', lat: 2.2, lng: 113.0, elev: 80, terrain: 'Lowland rainforest', habitat: 'Dipterocarp forest', rock: 'Lateritic soil', zone: 'Indo-Malayan', vegetation: 'Mixed dipterocarp' }),
      outcropProfile(/\u8607\u62c9\u5a01\u897f/, { country: 'Indonesia', region: 'Sulawesi', town: 'Sulawesi', protect: 'Lowland and hill forest', lat: -1.4, lng: 120.2, elev: 400, terrain: 'Tropical rainforest', habitat: 'Primary forest', rock: 'Forest soil', zone: 'Wallacea', vegetation: 'Mixed rainforest' }),
      outcropProfile(/\u8607\u9580\u7b54\u81e8/, { country: 'Indonesia', region: 'Sumatra', town: 'Sumatra', protect: 'Lowland rainforest', lat: -0.5, lng: 101.4, elev: 200, terrain: 'Lowland rainforest', habitat: 'Dipterocarp forest', rock: 'Lateritic soil', zone: 'Indo-Malayan', vegetation: 'Mixed dipterocarp' }),
      outcropProfile(/\u6469\u9e7f\u52a0/, { country: 'Indonesia', region: 'Moluccas', town: 'Ternate', protect: 'Island forest', lat: 0.79, lng: 127.38, elev: 150, terrain: 'Island rainforest', habitat: 'Lowland forest', rock: 'Volcanic soil', zone: 'Wallacea', vegetation: 'Mixed rainforest' }),
      outcropProfile(/\u5442\u5b8b/, { country: 'Philippines', region: 'Luzon', town: 'Luzon', protect: 'Lowland and montane forest', lat: 16.2, lng: 121.1, elev: 400, terrain: 'Tropical moist forest', habitat: 'Lowland forest', rock: 'Forest soil', zone: 'Indo-Malayan', vegetation: 'Mixed hardwoods' }),
      outcropProfile(/\u7dec\u7538/, { country: 'Myanmar', region: 'Kachin', town: 'Hukawng Valley', protect: 'Burmese amber', lat: 26.25, lng: 96.55, elev: 150, habitat: 'Cretaceous amber forest', rock: 'Amber in shale', zone: 'Indo-Malayan' }),
      outcropProfile(/\u54e5\u65af\u5927\u9ece\u52a0/, { country: 'Costa Rica', region: 'Talamanca', town: 'Talamanca', protect: 'Montane forest', lat: 9.5, lng: -83.5, elev: 1400, terrain: 'Cloud forest', habitat: 'Montane rainforest', rock: 'Forest soil', zone: 'Neotropical', vegetation: 'Cloud forest' }),
      outcropProfile(/\u5df4\u62ff\u99ac/, { country: 'Panama', region: 'Panama', town: 'Lowland rainforest', protect: 'Lowland forest', lat: 8.7, lng: -80.1, elev: 120, terrain: 'Lowland rainforest', habitat: 'Primary forest', rock: 'Lateritic soil', zone: 'Neotropical', vegetation: 'Rainforest' }),
      outcropProfile(/\u5c3c\u6cca\u723e/, { country: 'Nepal', region: 'Central Himalaya', town: 'Mid-hills', protect: 'Montane forest', lat: 28.1, lng: 84.3, elev: 1800, terrain: 'Himalayan montane forest', habitat: 'Oak-rhododendron forest', rock: 'Forest soil', zone: 'Palearctic', vegetation: 'Montane broadleaf forest' }),
      outcropProfile(/Jun\u00edn|San Luis/, { country: 'Peru', region: 'Jun\u00edn', town: 'San Luis', protect: 'Andean forest', lat: -11.2, lng: -75.4, elev: 1600, terrain: 'Andean montane forest', habitat: 'Cloud forest', rock: 'Forest soil', zone: 'Neotropical', vegetation: 'Montane forest' }),
      outcropProfile(/\u4e18\u5e03\u7279/, { country: 'Argentina', region: 'Chubut', town: 'Cerro C\u00f3ndor', protect: 'Ca\u00f1ad\u00f3n Asfalto Formation', lat: -43.4, lng: -69.2, elev: 500, habitat: 'Middle Jurassic lacustrine beds', rock: 'Tuff and mudstone', zone: 'Neotropical' }),
      outcropProfile(/\u57c3\u723e\u91d1/, { country: 'United Kingdom', region: 'Scotland', town: 'Elgin', protect: 'Lossiemouth Sandstone', lat: 57.65, lng: -3.32, elev: 30, habitat: 'Late Triassic dune sandstone', rock: 'Sandstone', zone: 'Palearctic' }),
      outcropProfile(/\u5df4\u5229\u535a\u7d0d/, { country: 'Spain', region: 'Castell\u00f3n', town: 'Vallibona', protect: 'Arcillas de Morella Formation', lat: 40.55, lng: 0.05, elev: 670, habitat: 'Early Cretaceous continental beds', rock: 'Clay and sandstone', zone: 'Palearctic' }),
      outcropProfile(/\u6771\u6208\u58c1/, { country: 'Mongolia', region: 'Dornogovi', town: 'East Gobi', protect: 'Javkhlant Formation', lat: 44.2, lng: 109.8, elev: 1100, habitat: 'Late Cretaceous fluvial beds', rock: 'Sandstone', zone: 'Palearctic' }),
      outcropProfile(/\u85a9\u5361\u6885\u7d0d/, { country: 'Madagascar', region: 'Morondava Basin', town: 'Sakamena', protect: 'Sakamena Group', lat: -23.4, lng: 44.6, elev: 180, habitat: 'Early Triassic floodplain', rock: 'Mudstone', zone: 'Afrotropical' }),
      outcropProfile(/\u99ac\u57c3\u74e6\u8afe/, { country: 'Madagascar', region: 'Mahajanga Basin', town: 'Berivotra', protect: 'Maevarano Formation', lat: -16.0, lng: 46.3, elev: 180, habitat: 'Late Cretaceous fluvial beds', rock: 'Sandstone', zone: 'Afrotropical' }),
      outcropProfile(/\u99ac\u54c8\u8d0a\u52a0/, { country: 'Madagascar', region: 'Mahajanga Basin', town: 'Mahajanga', protect: 'Albian marine beds', lat: -15.7, lng: 46.3, elev: 40, habitat: 'Early Cretaceous marine shale', rock: 'Shale', zone: 'Afrotropical' }),
      outcropProfile(/\u5f17\u6797\u5fb7\u65af|\u6fb3\u5927\u5229\u4e9e/, { country: 'Australia', region: 'South Australia', town: 'Flinders Ranges', protect: 'Ediacara Member', lat: -30.6, lng: 138.1, elev: 120, habitat: 'Ediacaran seafloor', rock: 'Sandstone', zone: 'Australasian' }),
      outcropProfile(/\u91cc\u5f17\u65af\u5229/, { country: 'Australia', region: 'Queensland', town: 'Riversleigh', protect: 'Riversleigh World Heritage Area', lat: -19.03, lng: 138.7, elev: 200, habitat: 'Miocene limestone cave', rock: 'Limestone', zone: 'Australasian' }),
      outcropProfile(/\u6d2a\u65af\u5442\u514b/, { country: 'Germany', region: 'Rhineland-Palatinate', town: 'Bundenbach', protect: 'Hunsr\u00fcck Slate', lat: 49.84, lng: 7.37, elev: 400, habitat: 'Early Devonian marine slate', rock: 'Slate', zone: 'Palearctic' }),
      outcropProfile(/\u585e\u5f6d\u62c9\u5fb7/, { country: 'Germany', region: 'North Rhine-Westphalia', town: 'Seppenrade', protect: 'Campanian chalk', lat: 51.68, lng: 7.34, elev: 60, habitat: 'Late Cretaceous marine chalk', rock: 'Chalk', zone: 'Palearctic' }),
      outcropProfile(/\u4fc4\u4ea5\u4fc4/, { country: 'United States', region: 'Ohio', town: 'Cleveland', protect: 'Cleveland Shale', lat: 41.5, lng: -81.7, elev: 200, habitat: 'Late Devonian marine shale', rock: 'Black shale', zone: 'Nearctic' }),
      outcropProfile(/\u61f7\u4fc4\u660e/, { country: 'United States', region: 'Wyoming', town: 'Lance Creek', protect: 'Lance Formation', lat: 43.3, lng: -104.4, elev: 1400, habitat: 'Maastrichtian fluvial beds', rock: 'Sandstone', zone: 'Nearctic' }),
      outcropProfile(/\u5e03\u91cc\u5947\u6ce2\u7279|\u5fb7\u5dde/, { country: 'United States', region: 'Texas', town: 'Bridgeport', protect: 'Graham Formation', lat: 33.21, lng: -97.75, elev: 250, habitat: 'Late Carboniferous marine beds', rock: 'Limestone', zone: 'Nearctic' }),
      outcropProfile(/\u5409\u723e\u535a/, { country: 'United States', region: 'New York', town: 'Gilboa', protect: 'Moscow Formation', lat: 42.4, lng: -74.45, elev: 400, habitat: 'Middle Devonian delta', rock: 'Sandstone', zone: 'Nearctic' }),
      outcropProfile(/\u4f0a\u5229\u8afe\u4f0a/, { country: 'United States', region: 'Illinois', town: 'Illinois Basin', protect: 'Pennsylvanian marine beds', lat: 39.8, lng: -89.6, elev: 180, habitat: 'Late Carboniferous marine shale', rock: 'Shale', zone: 'Nearctic' }),
      outcropProfile(/\u548c\u653f|\u81e8\u590f|\u7518\u8085/, { country: 'China', region: 'Gansu', town: 'Hezheng', protect: 'Linxia Basin', lat: 35.45, lng: 103.35, elev: 2000, habitat: 'Late Miocene red beds', rock: 'Siltstone', zone: 'Palearctic' }),
      outcropProfile(/\u5df4\u4e39\u6e56/, { country: 'China', region: 'Inner Mongolia', town: 'Bayan Mandahu', protect: 'Wulansuhai Formation', lat: 41.7, lng: 106.7, elev: 1200, habitat: 'Campanian dune and interdune', rock: 'Sandstone', zone: 'Palearctic' }),
      outcropProfile(/\u5be7\u57ce/, { country: 'China', region: 'Inner Mongolia', town: 'Ningcheng', protect: 'Daohugou Beds', lat: 41.32, lng: 119.14, elev: 500, habitat: 'Middle Jurassic lake beds', rock: 'Tuffaceous shale', zone: 'Palearctic' }),
      outcropProfile(/\u51cc\u6e90/, { country: 'China', region: 'Liaoning', town: 'Lingyuan', protect: 'Tiaojishan / Haifanggou beds', lat: 41.24, lng: 119.4, elev: 400, habitat: 'Late Jurassic lake beds', rock: 'Tuffaceous shale', zone: 'Palearctic' }),
      outcropProfile(/\u6f84\u6c5f/, { country: 'China', region: 'Yunnan', town: 'Chengjiang', protect: 'Yu\'anshan Formation', lat: 24.67, lng: 102.91, elev: 1800, habitat: 'Cambrian marine mudstone', rock: 'Mudstone', zone: 'Palearctic' }),
      outcropProfile(/\u856d\u5bfa\u5821/, { country: 'China', region: 'Yunnan', town: 'Xiaoshiba', protect: 'Hongjingshao Formation', lat: 24.95, lng: 102.8, elev: 1900, habitat: 'Cambrian marine mudstone', rock: 'Mudstone', zone: 'Palearctic' }),
      outcropProfile(/\u8af8\u57ce|\u5c71\u6771/, { country: 'China', region: 'Shandong', town: 'Zhucheng', protect: 'Wangshi Group', lat: 36.0, lng: 119.4, elev: 80, habitat: 'Campanian fluvial beds', rock: 'Conglomerate and sandstone', zone: 'Palearctic' }),
      outcropProfile(/\u5929\u76ee/, { country: 'China', region: 'Zhejiang', town: 'West Tianmu Mountain', protect: 'Tianmu Mountain reserve', lat: 30.34, lng: 119.44, elev: 900, habitat: 'Temperate mountain forest', rock: 'Forest soil', zone: 'Palearctic', vegetation: 'Mixed broadleaf forest' }),
      outcropProfile(/\u9867\u9109\u5c6f|\u9ed1\u9f8d\u6c5f/, { country: 'China', region: 'Heilongjiang', town: 'Harbin', protect: 'Guxiangtun Formation', lat: 45.75, lng: 126.63, elev: 140, habitat: 'Late Pleistocene alluvium', rock: 'Sand and silt', zone: 'Palearctic' }),
      outcropProfile(/\u6c83\u7279\u76e7/, { country: 'South Africa', region: 'Eastern Cape', town: 'Waterloo Farm', protect: 'Witpoort Formation', lat: -33.32, lng: 26.53, elev: 500, habitat: 'Late Devonian estuary', rock: 'Black shale', zone: 'Afrotropical' }),
      outcropProfile(/\u827e\u7565\u7279/, { country: 'South Africa', region: 'Free State / Eastern Cape', town: 'Elliot Formation', protect: 'Lower Elliot Formation', lat: -30.6, lng: 27.2, elev: 1400, habitat: 'Late Triassic floodplain', rock: 'Mudstone', zone: 'Afrotropical' }),
      outcropProfile(/\u5361\u9b6f/, { country: 'South Africa', region: 'Karoo Basin', town: 'Karoo', protect: 'Beaufort Group', lat: -31.6, lng: 24.8, elev: 1200, habitat: 'Early Triassic floodplain', rock: 'Mudstone', zone: 'Afrotropical' }),
      outcropProfile(/\u8056\u5f7c\u5f97\u5821/, { country: 'Russia', region: 'Leningrad Oblast', town: 'Saint Petersburg', protect: 'Middle Ordovician limestone', lat: 59.6, lng: 30.2, elev: 40, habitat: 'Ordovician marine limestone', rock: 'Limestone', zone: 'Palearctic' }),
      outcropProfile(/\u683c\u96f7\u8305\u65af/, { country: 'New Zealand', region: 'West Coast', town: 'Greymouth', protect: 'Early Miocene marine beds', lat: -42.45, lng: 171.21, elev: 20, habitat: 'Miocene marine sediment', rock: 'Siltstone', zone: 'Australasian' }),
      outcropProfile(/\u5357\u5cf6\u5c71\u8108/, { country: 'New Zealand', region: 'South Island', town: 'Southern Alps', protect: 'Holocene dune and forest sites', lat: -43.5, lng: 170.2, elev: 400, habitat: 'Holocene terrestrial', rock: 'Alluvium', zone: 'Australasian' }),
      outcropProfile(/\u4f2f\u683c\u65af/, { country: 'Canada', region: 'British Columbia', town: 'Field', protect: 'Burgess Shale', lat: 51.44, lng: -116.47, elev: 2300, habitat: 'Cambrian marine mudstone', rock: 'Shale', zone: 'Nearctic' }),
      outcropProfile(/\u53cd\u963f\u7279\u62c9\u65af/, { country: 'Morocco', region: 'Anti-Atlas', town: 'Anti-Atlas', protect: 'Ordovician marine beds', lat: 30.6, lng: -6.2, elev: 1200, habitat: 'Ordovician sandstone and shale', rock: 'Sandstone', zone: 'Palearctic' }),
      outcropProfile(/\u51f1\u59c6\u51f1\u59c6/, { country: 'Morocco', region: 'Kem Kem Group', town: 'Tafilalt', protect: 'Kem Kem beds', lat: 31.4, lng: -4.2, elev: 750, habitat: 'Cenomanian fluvial beds', rock: 'Sandstone', zone: 'Palearctic' }),
      outcropProfile(/\u5091\u8c9d\u52d2\u5967\u6cd5\u7279|\u963f\u7279\u62c9\u65af\u5c71/, { country: 'Morocco', region: 'Anti-Atlas', town: 'Jebel Ofatn', protect: 'Middle Devonian limestone', lat: 31.08, lng: -5.42, elev: 1180, habitat: 'Devonian marine limestone', rock: 'Limestone', zone: 'Palearctic' }),
      outcropProfile(/\u54e5\u502b\u6bd4\u4e9e/, { country: 'Colombia', region: 'Andes', town: 'Andean forest', protect: 'Montane forest', lat: 4.6, lng: -74.1, elev: 1800, terrain: 'Andean cloud forest', habitat: 'Montane forest', rock: 'Forest soil', zone: 'Neotropical', vegetation: 'Cloud forest' }),
      outcropProfile(/\u79d8\u9b6f/, { country: 'Peru', region: 'Amazon lowlands', town: 'Amazonian Peru', protect: 'Lowland rainforest', lat: -4.5, lng: -73.5, elev: 120, terrain: 'Amazonian lowland rainforest', habitat: 'Primary forest', rock: 'Alluvial soil', zone: 'Neotropical', vegetation: 'Rainforest' }),
      { match: /摩洛哥|Morocco/i, country: 'Morocco', region: 'Anti-Atlas', nearestTown: 'Jebel Issoumour area', protectedArea: 'Devonian outcrop belt', siteLabel: 'Outcrop MA-2', lat: 31.08, lng: -5.42, elevation: 1180, terrainType: 'Arid mountain outcrop', landform: 'Limestone bench', biome: 'Desert mountain', habitatType: 'Fossiliferous limestone', vegetation: 'Sparse desert scrub', substrate: 'Limestone and shale', waterProximity: 'Dry wadi 2 km', climate: 'Hot arid (BWh)', ecozone: 'Palearctic', weather: 'Dry, clear, light wind' },
      { match: /瑞典|Sweden|哥得蘭/i, country: 'Sweden', region: 'Gotland', nearestTown: 'Visby margin', protectedArea: 'Ordovician limestone belt', siteLabel: 'Section SE-4', lat: 57.634, lng: 18.294, elevation: 12, terrainType: 'Coastal limestone plateau', landform: 'Karstic bench', biome: 'Boreal coastal', habitatType: 'Marine fossil beds', vegetation: 'Coastal meadow', substrate: 'Limestone pavement', waterProximity: 'Baltic coast 1 km', climate: 'Oceanic cool (Cfb)', ecozone: 'Palearctic', weather: 'Cool, breezy' },
      { match: /馬達加斯加|Madagascar/i, country: 'Madagascar', region: 'Mahajanga Basin', nearestTown: 'Maevarano Formation', protectedArea: 'Cretaceous field exposure', siteLabel: 'Horizon MG-7', lat: -16.25, lng: 46.35, elevation: 180, terrainType: 'Semi-arid badlands', landform: 'Eroded mudstone', biome: 'Dry deciduous forest margin', habitatType: 'Fluvial overbank', vegetation: 'Sparse baobab scrub', substrate: 'Mudstone and sandstone', waterProximity: 'Seasonal river 500 m', climate: 'Tropical dry (Aw)', ecozone: 'Afrotropical', weather: 'Hot, dusty' },
      { match: /日本|Japan/i, country: 'Japan', region: 'Honshu', nearestTown: 'Temperate forest', protectedArea: 'Living collection site', siteLabel: 'Plot JP-1', lat: 36.2, lng: 138.2, elevation: 400, terrainType: 'Temperate forest', landform: 'Forested slope', biome: 'Cool temperate forest', habitatType: 'Deciduous or conifer woodland', vegetation: 'Mixed forest', substrate: 'Forest soil', waterProximity: 'Mountain stream', climate: 'Humid continental margin', ecozone: 'Palearctic', weather: 'Cool, overcast' },
      { match: /阿根廷|Argentina|巴塔哥尼亞|內烏肯/i, country: 'Argentina', region: 'Chubut', nearestTown: 'Cerro C\u00f3ndor', protectedArea: 'Ca\u00f1ad\u00f3n Asfalto Formation', siteLabel: 'Camp AR-1', lat: -43.4, lng: -69.2, elevation: 500, terrainType: 'Patagonian steppe', landform: 'Badlands escarpment', biome: 'Temperate semi-arid', habitatType: 'Middle Jurassic lacustrine beds', vegetation: 'Low shrubs and grasses', substrate: 'Tuff and mudstone', waterProximity: 'Ephemeral arroyo', climate: 'Semi-arid (BSk)', ecozone: 'Neotropical', weather: 'Windy, clear' },
      { match: /英國|United Kingdom|威爾斯/i, country: 'United Kingdom', region: 'Scotland', nearestTown: 'Elgin', protectedArea: 'Lossiemouth Sandstone', siteLabel: 'Quarry UK-2', lat: 57.65, lng: -3.32, elevation: 30, terrainType: 'Temperate upland', landform: 'Quarry face', biome: 'Atlantic temperate', habitatType: 'Late Triassic dune sandstone', vegetation: 'Pasture and hedgerow', substrate: 'Sandstone', waterProximity: 'Farm stream 80 m', climate: 'Oceanic (Cfb)', ecozone: 'Palearctic', weather: 'Cool, damp' },
      { match: /蒙古|Gobi|戈壁/i, country: 'Mongolia', region: 'South Gobi', nearestTown: 'Nemegt Basin', protectedArea: 'Cretaceous dinosaur beds', siteLabel: 'Camp MN-5', lat: 43.5, lng: 101.0, elevation: 1100, terrainType: 'Gobi desert badlands', landform: 'Eroded escarpment', biome: 'Cold desert steppe', habitatType: 'Sandstone outcrop', vegetation: 'Sparse desert grass', substrate: 'Sandstone and siltstone', waterProximity: 'Dry', climate: 'Cold desert (BWk)', ecozone: 'Palearctic', weather: 'Dry, windy' },
      { match: /西班牙|Spain|聖巴巴拉/i, country: 'Spain', region: 'Castell\u00f3n', nearestTown: 'Vallibona', protectedArea: 'Arcillas de Morella Formation', siteLabel: 'Section ES-1', lat: 40.55, lng: 0.05, elevation: 670, terrainType: 'Mediterranean scrubland', landform: 'Limestone ridge', biome: 'Mediterranean', habitatType: 'Early Cretaceous continental beds', vegetation: 'Maquis scrub', substrate: 'Clay and sandstone', waterProximity: 'Seasonal creek', climate: 'Mediterranean (Csa)', ecozone: 'Palearctic', weather: 'Warm, dry' },
      { match: /羅馬尼亞|Romania|哈夢島/i, country: 'Romania', region: 'Hațeg Basin', nearestTown: 'Hațeg Island', protectedArea: 'Maastrichtian continental', siteLabel: 'Outcrop RO-3', lat: 45.6, lng: 22.95, elevation: 520, terrainType: 'Volcanic-influenced basin', landform: 'River terrace', biome: 'Temperate forest', habitatType: 'Volcaniclastic beds', vegetation: 'Mixed forest', substrate: 'Tuff and mudstone', waterProximity: 'River margin', climate: 'Continental (Dfb)', ecozone: 'Palearctic', weather: 'Mild, cloudy' },
      { match: /中國|China|遼寧|內蒙古/i, country: 'China', region: 'Liaoning / Inner Mongolia', nearestTown: 'Jehol or Bayan Mandahu', protectedArea: 'Cretaceous Jehol beds', siteLabel: 'Section CN-8', lat: 41.8, lng: 120.0, elevation: 480, terrainType: 'Volcanic lake margin', landform: 'Lacustrine shale', biome: 'Temperate steppe-forest', habitatType: 'Fine-grained lake beds', vegetation: 'Steppe shrubs', substrate: 'Shale and tuff', waterProximity: 'Ancient lake (extinct)', climate: 'Continental', ecozone: 'Palearctic', weather: 'Dry, cool' },
      { match: /美國|United States|科羅拉多/i, country: 'United States', region: 'Western interior', nearestTown: 'Morrison', protectedArea: 'Morrison Formation', siteLabel: 'Sector US-6', lat: 39.74, lng: -105.2, elevation: 1850, terrainType: 'Badlands and prairie', landform: 'Eroded sandstone', biome: 'Temperate grassland', habitatType: 'Sedimentary outcrop', vegetation: 'Sage and grasses', substrate: 'Sandstone and shale', waterProximity: 'Seasonal draw', climate: 'Semi-arid continental', ecozone: 'Nearctic', weather: 'Dry, sunny' },
      { match: /捷克|Czech|波希米亞/i, country: 'Czech Republic', region: 'Bohemia', nearestTown: 'Prague Basin', protectedArea: 'Devonian mudstone', siteLabel: 'Section CZ-2', lat: 50.08, lng: 14.42, elevation: 220, terrainType: 'Temperate lowland', landform: 'Quarry bench', biome: 'Temperate forest', habitatType: 'Marine mudstone', vegetation: 'Deciduous margin', substrate: 'Mudstone', waterProximity: 'River 200 m', climate: 'Continental (Dfb)', ecozone: 'Palearctic', weather: 'Cool, overcast' },
      { match: /澳洲|Australia|昆士蘭/i, country: 'Australia', region: 'Queensland', nearestTown: 'Atherton Tableland', protectedArea: 'Wet tropics', siteLabel: 'Plot AU-9', lat: -17.3, lng: 145.6, elevation: 700, terrainType: 'Wet tropical forest', landform: 'Tableland slope', biome: 'Wet tropics rainforest', habitatType: 'Rainforest', vegetation: 'Rainforest canopy', substrate: 'Ferrosol', waterProximity: 'Seasonal creek', climate: 'Tropical', ecozone: 'Australasian', weather: 'Hot, humid' },
      { match: /厄瓜多|Ecuador/i, country: 'Ecuador', region: 'Andes', nearestTown: 'Andean cloud forest', protectedArea: 'Montane forest reserve', siteLabel: 'Plot EC-4', lat: -0.4, lng: -78.4, elevation: 1600, terrainType: 'Andean cloud forest', landform: 'Montane slope', biome: 'Tropical montane forest', habitatType: 'Cloud forest', vegetation: 'Montane broadleaf forest', substrate: 'Volcanic forest soil', waterProximity: 'Mountain stream', climate: 'Tropical montane', ecozone: 'Neotropical', weather: 'Cool, humid' },
      { match: /剛果|喀麥隆|中非|Congo|Cameroon|Central Africa/i, country: 'Democratic Republic of the Congo', region: 'Central African rainforest', nearestTown: 'Congo Basin margin', protectedArea: 'Lowland forest plot', siteLabel: 'Plot CG-3', lat: -2.5, lng: 23.5, elevation: 380, terrainType: 'Central African lowland forest', landform: 'River terrace', biome: 'Tropical rainforest', habitatType: 'Decaying hardwood forest', vegetation: 'High-canopy rainforest with rotting logs', substrate: 'Organic-rich forest soil', waterProximity: 'Forest creek', climate: 'Tropical rainforest (Af)', ecozone: 'Afrotropical', weather: 'Humid, warm' },
      { match: /歐洲|Europe/i, country: 'Europe', region: parts.secondary || 'Temperate woodland', nearestTown: 'Deciduous forest margin', protectedArea: 'Woodland reserve edge', siteLabel: 'Plot EU-2', lat: 48.5, lng: 10.2, elevation: 450, terrainType: 'Temperate deciduous woodland', landform: 'Valley slope', biome: 'Temperate broadleaf forest', habitatType: 'Oak-beech woodland', vegetation: 'Mixed deciduous canopy', substrate: 'Forest soil with deadwood', waterProximity: 'Woodland stream', climate: 'Temperate (Cfb)', ecozone: 'Palearctic', weather: 'Cool, humid' },
      { match: /東南亞/i, country: 'Southeast Asia', region: 'Indo-Malayan lowlands', nearestTown: 'Rainforest margin', protectedArea: 'Lowland forest buffer', siteLabel: 'Plot SEA-6', lat: 5.5, lng: 100.5, elevation: 280, terrainType: 'Tropical lowland rainforest', landform: 'Alluvial terrace', biome: 'Tropical rainforest', habitatType: 'Primary forest edge', vegetation: 'Mixed broadleaf canopy', substrate: 'Lateritic soil', waterProximity: 'Seasonal creek', climate: 'Tropical (Af)', ecozone: 'Indo-Malayan', weather: 'Warm, humid' },
      { match: /南美洲|South America|原產/i, country: 'South America', region: 'Neotropical native range', nearestTown: 'Tropical lowlands', protectedArea: 'Native range reference', siteLabel: 'Range ref SA-1', lat: -10.0, lng: -55.0, elevation: 200, terrainType: 'Tropical lowland', landform: 'Floodplain terrace', biome: 'Tropical rainforest and savanna', habitatType: 'Native range', vegetation: 'Secondary growth', substrate: 'Lateritic soil', waterProximity: 'Seasonal wetland', climate: 'Tropical (Af)', ecozone: 'Neotropical', weather: 'Humid, warm' },
      { match: /白堊紀|三疊紀|泥盆紀|奧陶紀|石炭紀|寒武紀|新近紀|地質|Formation|組|世/i, country: '—', region: parts.secondary || parts.primary, nearestTown: 'Type locality reference', protectedArea: 'Stratigraphic exposure', siteLabel: 'Outcrop reference', lat: 0, lng: 0, elevation: 0, terrainType: 'Geological outcrop', landform: 'Exposure face', biome: 'Paleoenvironment context', habitatType: 'Fossil-bearing horizon', vegetation: '—', substrate: 'Sedimentary rock', waterProximity: 'Contextual', climate: 'Paleoclimate (contextual)', ecozone: '—', weather: 'Field archive record' },
      { match: /台灣|臺灣|Taiwan/i, country: 'Taiwan', region: parts.secondary || 'Taiwan field site', nearestTown: (function () {
        if (/高雄/i.test(blob)) return 'Kaohsiung foothills';
        if (/花蓮/i.test(blob)) return 'Hualien County';
        if (/南投/i.test(blob)) return 'Nantou County';
        if (/大屯/i.test(blob)) return 'Yangmingshan';
        if (/低海拔|平原/i.test(blob)) return 'Western Taiwan lowlands';
        return 'Field collection locality';
      }()), protectedArea: (function () {
        if (/大屯/i.test(blob)) return 'Yangmingshan National Park margin';
        if (/溪谷|溪頭|陰濕/i.test(blob)) return 'Montane ravine plot';
        return 'Documented field site';
      }()), siteLabel: 'Plot TW-' + (seed % 90 + 10), lat: (function () {
        if (/高雄/i.test(blob)) return 22.92;
        if (/花蓮/i.test(blob)) return 23.99;
        if (/南投/i.test(blob)) return 23.91;
        if (/大屯/i.test(blob)) return 25.17;
        return 23.7 + (seed % 40) / 100;
      }()), lng: (function () {
        if (/高雄/i.test(blob)) return 120.58;
        if (/花蓮/i.test(blob)) return 121.60;
        if (/南投/i.test(blob)) return 120.85;
        if (/大屯/i.test(blob)) return 121.55;
        return 120.9 + (seed % 40) / 100;
      }()), elevation: (function () {
        if (/低海拔|平原|池/i.test(blob)) return 80 + (seed % 120);
        if (/大屯/i.test(blob)) return 650 + (seed % 200);
        if (/花蓮|東部/i.test(blob)) return 200 + (seed % 400);
        return 300 + (seed % 800);
      }()), terrainType: 'Subtropical field habitat', landform: 'Local slope or wetland', biome: 'Subtropical forest / wetland', habitatType: 'Documented collection habitat', vegetation: 'Native understory per field notes', substrate: 'Local soil / rock', waterProximity: 'Per field notes', climate: 'Humid subtropical (Cfa)', ecozone: 'East Asian subtropical', weather: 'Per collection record' },
      { match: /馬來西亞|Malaysia/i, country: 'Malaysia', region: 'Peninsular Malaysia', nearestTown: 'Lowland forest', protectedArea: 'Forest reserve', siteLabel: 'Plot M-12', lat: 4.2, lng: 101.5, elevation: 200, terrainType: 'Lowland dipterocarp forest', landform: 'Alluvial terrace', biome: 'Tropical rainforest', habitatType: 'Lowland forest', vegetation: 'Mixed dipterocarp', substrate: 'Lateritic soil', waterProximity: 'Seasonal seep nearby', climate: 'Tropical rainforest (Af)', ecozone: 'Indo-Malayan', weather: 'Warm, humid, intermittent rain' },
      { match: /泰國|Thailand/i, country: 'Thailand', region: 'Chiang Mai', nearestTown: 'Doi Suthep fringe', protectedArea: 'Northern highland forest', siteLabel: 'Transect T-07', lat: 18.804, lng: 98.921, elevation: 980, terrainType: 'Highland forest edge', landform: 'Colluvial slope', biome: 'Tropical dry forest transition', habitatType: 'Oak-dipterocarp margin', vegetation: 'Mixed evergreen with bamboo understory', substrate: 'Sandy loam', waterProximity: 'Ephemeral creek 40 m', climate: 'Tropical savanna margin', ecozone: 'Indo-Malayan', weather: 'Warm, partly cloudy' },
      { match: /印尼|Indonesia/i, country: 'Indonesia', region: 'Indonesian archipelago', nearestTown: 'Forest locality', protectedArea: 'Lowland forest', siteLabel: 'Grid ID-3', lat: -2.5, lng: 118.0, elevation: 200, terrainType: 'Tropical rainforest', landform: 'Forested slope', biome: 'Tropical rainforest', habitatType: 'Primary forest', vegetation: 'Mixed rainforest', substrate: 'Forest soil', waterProximity: 'Forest creek', climate: 'Tropical rainforest (Af)', ecozone: 'Indo-Malayan', weather: 'Humid, still air' },
      { match: /越南|Vietnam/i, country: 'Vietnam', region: 'Central Highlands', nearestTown: 'Da Lat fringe', protectedArea: 'Montane pine transition', siteLabel: 'Camp V-2', lat: 12.245, lng: 108.442, elevation: 1420, terrainType: 'Montane plateau edge', landform: 'Basaltic slope', biome: 'Montane conifer transition', habitatType: 'Open pine-oak margin', vegetation: 'Pine with grass understory', substrate: 'Volcanic basalt soil', waterProximity: 'Reservoir margin 120 m', climate: 'Subtropical highland', ecozone: 'Indo-Malayan', weather: 'Cool, misty morning' },
      { match: /菲律賓|Philippines/i, country: 'Philippines', region: 'Philippines', nearestTown: 'Forest locality', protectedArea: 'Forest reserve', siteLabel: 'Station PH-5', lat: 14.6, lng: 121.0, elevation: 300, terrainType: 'Tropical moist forest', landform: 'Forested slope', biome: 'Tropical moist forest', habitatType: 'Lowland forest', vegetation: 'Mixed native hardwoods', substrate: 'Clay-rich upland soil', waterProximity: 'Spring seep downslope', climate: 'Tropical monsoon', ecozone: 'Indo-Malayan', weather: 'Warm, humid after rain' },
      { match: /德國|Germany/i, country: 'Germany', region: 'Germany', nearestTown: 'Documented locality', protectedArea: 'Per specimen record', siteLabel: 'Site DE', lat: 51.2, lng: 10.4, elevation: 200, terrainType: 'Per field notes', landform: 'Per field notes', biome: 'Per field notes', habitatType: 'Per field notes', vegetation: 'Per field notes', substrate: 'Per field notes', waterProximity: 'Per field notes', climate: 'Temperate', ecozone: 'Palearctic', weather: 'Per collection record' },
      { match: /智利|Chile/i, country: 'Chile', region: 'Los Lagos', nearestTown: 'Andean foothills', protectedArea: 'Valdivian forest margin', siteLabel: 'Transect CL-4', lat: -41.142, lng: -72.982, elevation: 540, terrainType: 'Valdivian temperate rainforest', landform: 'River terrace', biome: 'Temperate rainforest', habitatType: 'Nothofagus riparian zone', vegetation: 'Nothofagus with bryophyte carpet', substrate: 'Volcanic ash soil', waterProximity: 'Riverbank 15 m', climate: 'Oceanic temperate', ecozone: 'Neotropical temperate', weather: 'Cool, light rain' },
      { match: /巴西|Brazil/i, country: 'Brazil', region: 'Brazil', nearestTown: 'Documented locality', protectedArea: 'Per specimen record', siteLabel: 'Plot BR-6', lat: -15.8, lng: -47.9, elevation: 400, terrainType: 'Tropical seasonal forest', landform: 'Forested slope', biome: 'Tropical forest and savanna', habitatType: 'Documented collection habitat', vegetation: 'Mixed native vegetation', substrate: 'Lateritic soil', waterProximity: 'Seasonal stream', climate: 'Tropical', ecozone: 'Neotropical', weather: 'Warm, humid' },
      { match: /館藏|Archive|reference vault/i, country: 'Taiwan', region: 'Taipei', nearestTown: 'MCurator reference archive', protectedArea: 'Institutional research vault', siteLabel: 'Archive shelf A-17', lat: 25.033, lng: 121.565, elevation: 12, terrainType: 'Institutional archive', landform: 'Urban research campus', biome: 'Urban reference context', habitatType: 'Curated museum record', vegetation: '—', substrate: '—', waterProximity: '—', climate: 'Urban subtropical', ecozone: 'East Asian subtropical', weather: 'Controlled interior record' }
    ];
    var pinId = specimen && specimen.id;
    var forced = null;
    if (pinId === 'paleo-dastilbe-sp') {
      forced = outcropProfile(/./, { country: 'Brazil', region: 'Araripe Basin', town: 'Brazil', lat: -7.23, lng: -39.41, elev: 500, habitat: 'Early Cretaceous lake beds', rock: 'Laminated limestone', zone: 'Neotropical' });
    } else if (pinId === 'paleo-shuraboprosbole-minuta-a' || pinId === 'paleo-shuraboprosbole-minuta-b' || pinId === 'paleo-cf-tabanidae-a' || pinId === 'paleo-cf-tabanidae-b') {
      forced = outcropProfile(/./, { country: 'China', region: 'Hebei', town: 'Weichang Manchu and Mongolian Autonomous County', lat: 41.93, lng: 117.76, elev: 900, habitat: 'Late Jurassic lake beds', rock: 'Tuffaceous shale', zone: 'Palearctic' });
    } else if (pinId === 'paleo-douvilleiceras-sp') {
      forced = outcropProfile(/./, { country: 'Madagascar', region: 'Mahajanga', town: 'Mahajanga', lat: -15.72, lng: 46.32, elev: 40, habitat: 'Early Cretaceous marine beds', rock: 'Limestone', zone: 'Afrotropical' });
    } else if (pinId === 'paleo-trilobite-sp') {
      forced = outcropProfile(/./, { country: 'Morocco', region: 'Anti-Atlas', town: 'Ordovician collection', lat: 30.9, lng: -5.5, elev: 1100, habitat: 'Ordovician marine limestone', rock: 'Limestone', zone: 'Palearctic' });
    } else if (pinId === 'paleo-globidens-sp' || pinId === 'paleo-mosasauroidea-sp') {
      forced = outcropProfile(/./, { country: 'Morocco', region: 'Late Cretaceous marine beds', town: 'Morocco', lat: 32.9, lng: -6.9, elev: 400, habitat: 'Late Cretaceous marine horizon', rock: 'Marl', zone: 'Palearctic' });
    }
    var base = forced || profiles.filter(function (profile) { return profile.match.test(blob); })[0] || {
      country: parts.primary || '—',
      region: parts.secondary || parts.primary || '—',
      nearestTown: 'Documented locality',
      protectedArea: 'Per specimen record',
      siteLabel: 'Site ref',
      lat: 20 + (seed % 50) / 10,
      lng: 100 + (seed % 80) / 10,
      elevation: 200 + (seed % 500),
      terrainType: 'Per field notes',
      landform: 'Per field notes',
      biome: 'Per field notes',
      habitatType: 'Per field notes',
      vegetation: 'Per field notes',
      substrate: 'Per field notes',
      waterProximity: 'Per field notes',
      climate: 'Per field notes',
      ecozone: '—',
      weather: 'Per collection record'
    };
    return {
      country: base.country,
      region: base.region,
      nearestTown: base.nearestTown,
      protectedArea: base.protectedArea,
      siteLabel: base.siteLabel,
      lat: base.lat + (seed % 97) / 1000 - 0.048,
      lng: base.lng + ((seed >> 4) % 97) / 1000 - 0.048,
      elevation: base.elevation + (seed % 36) - 18,
      terrainType: base.terrainType,
      landform: base.landform,
      biome: base.biome,
      habitatType: base.habitatType,
      vegetation: base.vegetation,
      substrate: base.substrate,
      waterProximity: base.waterProximity,
      climate: base.climate,
      ecozone: base.ecozone,
      weather: base.weather
    };
  }

  function mineralSpeciesDossier(sci) {
    var table = {
      Quartz: { formula: 'SiO\u2082', crystalSystem: 'Trigonal', mohs: '7', lustre: 'Vitreous', streak: 'White', sg: '2.65', habit: 'Prismatic crystals / massive', mineralClass: 'Oxide (tectosilicate)', hostRock: 'Hydrothermal quartz veins in sandstone', depositType: 'Hot-springs / pegmatite vein', association: 'Feldspar, mica, chlorite' },
      Calcite: { formula: 'CaCO\u2083', crystalSystem: 'Trigonal', mohs: '3', lustre: 'Vitreous to pearly', streak: 'White', sg: '2.71', habit: 'Rhombohedral / scalenohedral', mineralClass: 'Carbonate', hostRock: 'Mississippi Valley-type carbonate', depositType: 'Hydrothermal carbonate cavity', association: 'Fluorite, sphalerite, barite' },
      Rhodochrosite: { formula: 'MnCO\u2083', crystalSystem: 'Trigonal', mohs: '3.5\u20134', lustre: 'Vitreous', streak: 'White', sg: '3.7', habit: 'Rhombohedral crystals', mineralClass: 'Carbonate', hostRock: 'Hydrothermal sulfide veins', depositType: 'Epithermal Mn carbonate pocket', association: 'Fluorite, tetrahedrite, quartz' },
      Stibnite: { formula: 'Sb\u2082S\u2083', crystalSystem: 'Orthorhombic', mohs: '2', lustre: 'Metallic', streak: 'Lead-gray', sg: '4.6', habit: 'Bladed prismatic crystals', mineralClass: 'Sulfide', hostRock: 'Antimony ore body in limestone', depositType: 'Hydrothermal Sb deposit', association: 'Quartz, calcite, pyrite' },
      Pyrite: { formula: 'FeS\u2082', crystalSystem: 'Isometric', mohs: '6\u20136.5', lustre: 'Metallic', streak: 'Greenish-black', sg: '5.0', habit: 'Cubic / pyritohedral', mineralClass: 'Sulfide', hostRock: 'Marl and gypsum host', depositType: 'Sedimentary diagenetic cubes', association: 'Marl matrix, gypsum' },
      Sulfur: { formula: 'S', crystalSystem: 'Orthorhombic', mohs: '1.5\u20132.5', lustre: 'Resinous', streak: 'White to yellow', sg: '2.07', habit: 'Massive / dipyramidal', mineralClass: 'Native element', hostRock: 'Evaporite / volcanic fumarole beds', depositType: 'Sedimentary sulfur deposit', association: 'Gypsum, celestine, bitumen' },
      Galena: { formula: 'PbS', crystalSystem: 'Isometric', mohs: '2.5', lustre: 'Metallic', streak: 'Lead-gray', sg: '7.4\u20137.6', habit: 'Cubic cleavage fragments', mineralClass: 'Sulfide', hostRock: 'Tri-State MVT carbonate', depositType: 'Mississippi Valley-type Pb-Zn', association: 'Sphalerite, dolomite, calcite' },
      Malachite: { formula: 'Cu\u2082CO\u2083(OH)\u2082', crystalSystem: 'Monoclinic', mohs: '3.5\u20134', lustre: 'Silky to vitreous', streak: 'Light green', sg: '3.6\u20134.0', habit: 'Botryoidal / fibrous', mineralClass: 'Carbonate', hostRock: 'Oxidized copper ore', depositType: 'Supergene Cu oxide zone', association: 'Azurite, cuprite, chrysocolla' },
      Fluorite: { formula: 'CaF\u2082', crystalSystem: 'Isometric', mohs: '4', lustre: 'Vitreous', streak: 'White', sg: '3.18', habit: 'Cubic crystals', mineralClass: 'Halide', hostRock: 'Fluorspar district limestone', depositType: 'Hydrothermal fluorite vein', association: 'Calcite, sphalerite, barite' },
      Azurite: { formula: 'Cu\u2083(CO\u2083)\u2082(OH)\u2082', crystalSystem: 'Monoclinic', mohs: '3.5\u20134', lustre: 'Vitreous', streak: 'Light blue', sg: '3.77', habit: 'Prismatic / massive', mineralClass: 'Carbonate', hostRock: 'Oxidized copper carbonate zone', depositType: 'Supergene Cu carbonate', association: 'Malachite, cuprite, limonite' }
    };
    return table[sci] || {
      formula: '\u2014', crystalSystem: '\u2014', mohs: '\u2014', lustre: '\u2014', streak: '\u2014', sg: '\u2014',
      habit: 'Hand specimen', mineralClass: 'Mineral specimen', hostRock: 'Documented host rock',
      depositType: 'Documented mineral locality', association: 'Per locality notes'
    };
  }

  function mineralLocalityCoords(specimen) {
    var map = {
      'mineralogy-quartz': { lat: 34.55, lng: -93.63, elev: 220 },
      'mineralogy-calcite': { lat: 36.18, lng: -85.85, elev: 180 },
      'mineralogy-rhodochrosite': { lat: 39.28, lng: -106.1, elev: 3200 },
      'mineralogy-stibnite': { lat: 27.69, lng: 111.44, elev: 220 },
      'mineralogy-pyrite': { lat: 42.11, lng: -2.1, elev: 560 },
      'mineralogy-sulfur': { lat: 37.31, lng: 13.58, elev: 80 },
      'mineralogy-galena': { lat: 37.08, lng: -94.51, elev: 300 },
      'mineralogy-malachite': { lat: -10.72, lng: 25.47, elev: 1400 },
      'mineralogy-fluorite': { lat: 37.48, lng: -88.17, elev: 140 },
      'mineralogy-azurite': { lat: 31.45, lng: -109.92, elev: 1650 }
    };
    return map[specimen && specimen.id] || null;
  }

  function marineLocalityCoords(specimen) {
    var map = {
      'marine-rhincodon': { lat: -22.68, lng: 113.65, elev: 0 },
      'marine-tursiops': { lat: 27.8, lng: -90.5, elev: 0 },
      'marine-asterias': { lat: 54.2, lng: 7.9, elev: 0 },
      'marine-aurelia': { lat: 54.5, lng: 10.2, elev: 0 },
      'marine-diadema': { lat: 27.3, lng: 34.0, elev: 0 },
      'marine-octopus': { lat: 40.8, lng: 14.3, elev: 0 },
      'marine-tridacna': { lat: -18.3, lng: 147.5, elev: 0 },
      'marine-amphiprion': { lat: -1.5, lng: 124.8, elev: 0 },
      'marine-hippocampus': { lat: 3.0, lng: 100.8, elev: 0 },
      'marine-chelonia': { lat: -11.59, lng: 144.04, elev: 0 }
    };
    return map[specimen && specimen.id] || null;
  }

  function fossilStratigraphyDossier(specimen) {
    var sci = String(specimen.scientificName || '');
    var id = String(specimen.id || '');
    var byId = {
      'paleo-hemipristis-serra': { formation: 'Chiting Formation / coastal terrace', unit: 'Pleistocene shark-tooth lag', age: 'Pleistocene', stage: 'Calabrian\u2013Chibanian (contextual)', lithology: 'Sandy conglomerate and shell lag', deposition: 'Nearshore marine lag deposit', taphonomy: 'Isolated teeth in lag concentrate', biozone: 'Coastal vertebrate assemblage', basin: 'Western Taiwan foothills' },
      'paleo-ammonoidea-indet-goniatites-morocco': { formation: 'Anti-Atlas Devonian limestone', unit: 'Goniatite-bearing carbonate beds', age: 'Middle Devonian', stage: 'Eifelian\u2013Givetian', lithology: 'Fossiliferous limestone', deposition: 'Shallow marine carbonate ramp', taphonomy: 'Articulated to compressed shells', biozone: 'Goniatite ammonoid fauna', basin: 'Anti-Atlas' },
      'paleo-diodon-sigma': { formation: 'Miocene marine beds of Java', unit: 'Coastal vertebrate horizon', age: 'Miocene', stage: 'Middle\u2013Late Miocene (contextual)', lithology: 'Calcareous sandstone', deposition: 'Shallow marine shelf', taphonomy: 'Dental plates and jaw fragments', biozone: 'Indo-Pacific teleost fauna', basin: 'Java Basin' },
      'paleo-dastilbe-sp': { formation: 'Crato Formation', unit: 'Laminated limestone member', age: 'Early Cretaceous', stage: 'Aptian', lithology: 'Laminated limestone', deposition: 'Restricted lacustrine basin', taphonomy: 'Articulated fish in lagerst\u00e4tte', biozone: 'Araripe ichthyofauna', basin: 'Araripe Basin' },
      'paleo-shuraboprosbole-minuta-a': { formation: 'Tiaojishan / Daohugou beds', unit: 'Volcanic lacustrine shale', age: 'Late Jurassic', stage: 'Oxfordian\u2013Kimmeridgian (contextual)', lithology: 'Tuffaceous shale', deposition: 'Volcanic lake margin', taphonomy: 'Compressed insect on bedding plane', biozone: 'Yanliao biota', basin: 'Ningcheng\u2013Weichang' },
      'paleo-shuraboprosbole-minuta-b': { formation: 'Tiaojishan / Daohugou beds', unit: 'Volcanic lacustrine shale', age: 'Late Jurassic', stage: 'Oxfordian\u2013Kimmeridgian (contextual)', lithology: 'Tuffaceous shale', deposition: 'Volcanic lake margin', taphonomy: 'Compressed insect on bedding plane', biozone: 'Yanliao biota', basin: 'Ningcheng\u2013Weichang' },
      'paleo-douvilleiceras-sp': { formation: 'Mahajanga Basin marine sequence', unit: 'Albian ammonite beds', age: 'Early Cretaceous', stage: 'Albian', lithology: 'Limestone and marl', deposition: 'Open marine shelf', taphonomy: 'Internal molds and shell steinkerns', biozone: 'Douvilleiceratid ammonites', basin: 'Mahajanga Basin' },
      'paleo-cf-tabanidae-a': { formation: 'Tiaojishan / Daohugou beds', unit: 'Fine lacustrine shale', age: 'Late Jurassic', stage: 'Oxfordian\u2013Kimmeridgian (contextual)', lithology: 'Tuffaceous shale', deposition: 'Volcanic lake', taphonomy: 'Compression fossil', biozone: 'Yanliao insect fauna', basin: 'Ningcheng\u2013Weichang' },
      'paleo-cf-tabanidae-b': { formation: 'Tiaojishan / Daohugou beds', unit: 'Fine lacustrine shale', age: 'Late Jurassic', stage: 'Oxfordian\u2013Kimmeridgian (contextual)', lithology: 'Tuffaceous shale', deposition: 'Volcanic lake', taphonomy: 'Compression fossil', biozone: 'Yanliao insect fauna', basin: 'Ningcheng\u2013Weichang' },
      'paleo-wiwaxia-corrugata': { formation: 'Stephen Formation (Burgess Shale)', unit: 'Walcott Quarry shale', age: 'Cambrian', stage: 'Miaolingian (Wuliuan)', lithology: 'Fine mudstone / shale', deposition: 'Deep-water mudflow burial', taphonomy: 'Soft-bodied lagerst\u00e4tte', biozone: 'Burgess Shale biota', basin: 'Canadian Rockies' },
      'paleo-yohoia-tenuis': { formation: 'Stephen Formation (Burgess Shale)', unit: 'Walcott Quarry shale', age: 'Cambrian', stage: 'Miaolingian (Wuliuan)', lithology: 'Fine mudstone / shale', deposition: 'Deep-water mudflow burial', taphonomy: 'Soft-bodied lagerst\u00e4tte', biozone: 'Burgess Shale biota', basin: 'Canadian Rockies' },
      'paleo-peytoia-nathorsti': { formation: 'Stephen Formation (Burgess Shale)', unit: 'Radiodont-bearing shale', age: 'Cambrian', stage: 'Miaolingian (Wuliuan)', lithology: 'Fine mudstone / shale', deposition: 'Deep-water mudflow burial', taphonomy: 'Soft-bodied lagerst\u00e4tte', biozone: 'Burgess Shale biota', basin: 'Canadian Rockies' },
      'paleo-cardiodictyon-catenulatum': { formation: 'Yu\'anshan Formation', unit: 'Chengjiang Maotianshan Shale', age: 'Cambrian', stage: 'Series 2 (Stage 3)', lithology: 'Mudstone', deposition: 'Shallow marine mud', taphonomy: 'Soft-bodied Chengjiang preservation', biozone: 'Chengjiang biota', basin: 'Eastern Yunnan' },
      'paleo-collinsium-ciliosum': { formation: 'Hongjingshao Formation', unit: 'Xiaoshiba beds', age: 'Cambrian', stage: 'Series 2', lithology: 'Mudstone', deposition: 'Shallow marine', taphonomy: 'Soft-bodied preservation', biozone: 'Xiaoshiba biota', basin: 'Eastern Yunnan' },
      'paleo-spinosaurus-aegyptiacus': { formation: 'Kem Kem Group', unit: 'Fluvial sandstone and mudstone', age: 'Late Cretaceous', stage: 'Cenomanian', lithology: 'Sandstone and mudstone', deposition: 'Fluvial\u2013deltaic', taphonomy: 'Isolated bones / teeth in channel lag', biozone: 'Kem Kem vertebrate fauna', basin: 'Kem Kem' },
      'paleo-mosasauroidea-sp': { formation: 'Late Cretaceous marine phosphate beds', unit: 'Mosasaur-bearing marl', age: 'Late Cretaceous', stage: 'Maastrichtian (contextual)', lithology: 'Marl and chalk', deposition: 'Open marine shelf', taphonomy: 'Isolated cranial / postcranial elements', biozone: 'Mosasaur marine fauna', basin: 'Moroccan phosphate basin' },
      'paleo-globidens-sp': { formation: 'Late Cretaceous marine phosphate beds', unit: 'Mosasaur-bearing marl', age: 'Late Cretaceous', stage: 'Maastrichtian (contextual)', lithology: 'Marl', deposition: 'Open marine shelf', taphonomy: 'Isolated teeth and jaw fragments', biozone: 'Mosasaur marine fauna', basin: 'Moroccan phosphate basin' },
      'paleo-mammuthus-primigenius': { formation: 'Late Pleistocene alluvium', unit: 'Mammal-bearing terrace', age: 'Late Pleistocene', stage: 'Late Pleistocene', lithology: 'Sand and silt', deposition: 'Fluvial terrace / loess margin', taphonomy: 'Isolated tusk and dental plates', biozone: 'Mammoth steppe fauna', basin: 'Northeast Asia' },
      'paleo-dinocrocuta-sp': { formation: 'Linxia Basin red beds', unit: 'Late Miocene mammal horizon', age: 'Late Miocene', stage: 'Turolian (contextual)', lithology: 'Siltstone and mudstone', deposition: 'Fluvial\u2013lacustrine red beds', taphonomy: 'Cranial / dental remains', biozone: 'Hipparion fauna', basin: 'Linxia Basin' },
      'paleo-chunerpeton-tianyiensis': { formation: 'Daohugou Beds / Tiaojishan', unit: 'Lacustrine volcaniclastic shale', age: 'Middle\u2013Late Jurassic', stage: 'Callovian\u2013Oxfordian (contextual)', lithology: 'Tuffaceous shale', deposition: 'Volcanic lake', taphonomy: 'Articulated salamander', biozone: 'Yanliao biota', basin: 'Ningcheng' },
      'paleo-beelzebufo-ampinga': { formation: 'Maevarano Formation', unit: 'Continental sandstone', age: 'Late Cretaceous', stage: 'Maastrichtian', lithology: 'Sandstone', deposition: 'Seasonal fluvial plain', taphonomy: 'Cranial / postcranial fragments', biozone: 'Madagascar vertebrate fauna', basin: 'Mahajanga Basin' },
      'paleo-asaphus-kowalewskii': { formation: 'Middle Ordovician limestone', unit: 'Asaphid trilobite beds', age: 'Middle Ordovician', stage: 'Darriwilian (contextual)', lithology: 'Limestone', deposition: 'Shallow marine carbonate', taphonomy: 'Enrolled / articulated trilobites', biozone: 'Baltic trilobite fauna', basin: 'St. Petersburg region' },
      'paleo-dickinsonia-costata': { formation: 'Ediacara Member / Rawnsley Quartzite', unit: 'Ediacaran fossil surfaces', age: 'Ediacaran', stage: 'Late Ediacaran', lithology: 'Sandstone', deposition: 'Shallow marine / microbial mat', taphonomy: 'External molds on bedding planes', biozone: 'Ediacara biota', basin: 'Flinders Ranges' },
      'paleo-dinichthys-terrelli': { formation: 'Cleveland Shale Member, Ohio Shale', unit: 'Black shale fish beds', age: 'Late Devonian', stage: 'Famennian', lithology: 'Black shale', deposition: 'Anoxic marine basin', taphonomy: 'Armor plates and jaws', biozone: 'Cleveland Shale fauna', basin: 'Appalachian Basin' },
      'paleo-lophophyllidium-plummeri': { formation: 'Graham Formation / Cisco Group', unit: 'Pennsylvanian marine limestone', age: 'Late Carboniferous', stage: 'Kasimovian\u2013Gzhelian (contextual)', lithology: 'Limestone', deposition: 'Shallow marine shelf', taphonomy: 'Solitary rugosan coralla', biozone: 'Midcontinent coral fauna', basin: 'Texas Midcontinent' },
      'paleo-gerastos-granulosos': { formation: 'Middle Devonian limestone (Anti-Atlas)', unit: 'Proetid trilobite beds', age: 'Middle Devonian', stage: 'Eifelian\u2013Givetian', lithology: 'Limestone', deposition: 'Shallow marine', taphonomy: 'Enrolled trilobites', biozone: 'Devonian trilobite fauna', basin: 'Anti-Atlas' },
      'paleo-aioloceras-besairei': { formation: 'Mahajanga Basin marine beds', unit: 'Early Cretaceous ammonite horizon', age: 'Early Cretaceous', stage: 'Albian (contextual)', lithology: 'Limestone', deposition: 'Marine shelf', taphonomy: 'Steinkern ammonites', biozone: 'Madagascar ammonites', basin: 'Mahajanga Basin' },
      'paleo-borealosuchus-sternbergii': { formation: 'Hell Creek / Lance equivalent', unit: 'Fluvial mudstone', age: 'Late Cretaceous', stage: 'Maastrichtian', lithology: 'Mudstone and sandstone', deposition: 'Fluvial floodplain', taphonomy: 'Cranial and osteoderm remains', biozone: 'Lancian vertebrate fauna', basin: 'Western Interior' },
      'paleo-nipponites-mirabilis': { formation: 'Upper Cretaceous Yezo Group (contextual)', unit: 'Heteromorph ammonite beds', age: 'Late Cretaceous', stage: 'Turonian\u2013Campanian (contextual)', lithology: 'Mudstone', deposition: 'Offshore marine', taphonomy: 'Heteromorph ammonite shells', biozone: 'North Pacific ammonites', basin: 'Hokkaido Yezo' },
      'paleo-coleoptera-indet-amber': { formation: 'Cretaceous amber-bearing beds', unit: 'Amber inclusion horizon', age: 'Cretaceous', stage: 'Mid\u2013Late Cretaceous (contextual)', lithology: 'Amber in sediment matrix', deposition: 'Resin entrapment / forest floor', taphonomy: 'Amber inclusion', biozone: 'Amber arthropod fauna', basin: 'Amber deposit (contextual)' },
      'paleo-insecta-indet-amber': { formation: 'Cretaceous amber-bearing beds', unit: 'Amber inclusion horizon', age: 'Cretaceous', stage: 'Mid\u2013Late Cretaceous (contextual)', lithology: 'Amber in sediment matrix', deposition: 'Resin entrapment', taphonomy: 'Amber inclusion', biozone: 'Amber arthropod fauna', basin: 'Amber deposit (contextual)' },
      'paleo-trilobite-sp': { formation: 'Ordovician marine limestone', unit: 'Trilobite-bearing carbonate', age: 'Ordovician', stage: 'Middle Ordovician (contextual)', lithology: 'Limestone', deposition: 'Shallow marine', taphonomy: 'Articulated to disarticulated sclerites', biozone: 'Trilobite fauna', basin: 'Anti-Atlas' }
    };
    if (byId[id]) return byId[id];
    if (/Wiwaxia|Yohoia|Peytoia|Ovatiovermis|Naraoia|Caryosyntrips/i.test(sci)) {
      return { formation: 'Stephen Formation (Burgess Shale)', unit: 'Walcott Quarry shale', age: 'Cambrian', stage: 'Miaolingian (Wuliuan)', lithology: 'Fine mudstone / shale', deposition: 'Deep-water mudflow burial', taphonomy: 'Soft-bodied lagerst\u00e4tte', biozone: 'Burgess Shale biota', basin: 'Canadian Rockies' };
    }
    if (/Cardiodictyon|Collinsium/i.test(sci)) {
      return { formation: 'Yu\'anshan / Hongjingshao Formations', unit: 'Chengjiang\u2013Xiaoshiba mudstone', age: 'Cambrian', stage: 'Series 2', lithology: 'Mudstone', deposition: 'Shallow marine mud', taphonomy: 'Soft-bodied preservation', biozone: 'Chengjiang biota', basin: 'Eastern Yunnan' };
    }
    if (/Proterosuchus/i.test(sci)) {
      return { formation: 'Lower Beaufort / Katberg equivalent', unit: 'Early Triassic mudstone', age: 'Early Triassic', stage: 'Induan', lithology: 'Mudstone', deposition: 'Fluvial floodplain', taphonomy: 'Cranial / postcranial bones', biozone: 'Karoo tetrapod fauna', basin: 'Karoo Basin' };
    }
    if (/Hyperodapedon/i.test(sci)) {
      return { formation: 'Lossiemouth Sandstone Formation', unit: 'Aeolian sandstone', age: 'Late Triassic', stage: 'Carnian\u2013Norian (contextual)', lithology: 'Sandstone', deposition: 'Dune and interdune', taphonomy: 'Articulated skeletons in sandstone', biozone: 'Elgin reptile fauna', basin: 'Moray Firth' };
    }
    if (/Drepanaspis|Mimetaster|Priscomyzon/i.test(sci)) {
      return { formation: 'Hunsr\u00fcck Slate / Witpoort (contextual)', unit: 'Early Devonian marine beds', age: 'Early Devonian', stage: 'Emsian (contextual)', lithology: 'Slate / black shale', deposition: 'Marine basin', taphonomy: 'Pyritized / compressed fossils', biozone: 'Early Devonian marine fauna', basin: 'Rhenish / Waterloo Farm' };
    }
    if (/Edestus/i.test(sci)) {
      return { formation: 'Pennsylvanian marine shale', unit: 'Tooth-whorl horizon', age: 'Late Carboniferous', stage: 'Moscovian (contextual)', lithology: 'Shale', deposition: 'Marine basin', taphonomy: 'Isolated dental whorls', biozone: 'Pennsylvanian chondrichthyans', basin: 'Illinois Basin' };
    }
    if (/Scaphechinus|Muntiacus/i.test(sci)) {
      return { formation: 'Pleistocene coastal / fluvial deposits', unit: 'Quaternary fossil horizon', age: 'Pleistocene', stage: 'Middle\u2013Late Pleistocene', lithology: 'Sand and gravel', deposition: 'Coastal or fluvial terrace', taphonomy: 'Disarticulated skeletal elements', biozone: 'Quaternary fauna', basin: 'East Asia' };
    }
    if (/Calymene/i.test(sci)) {
      return { formation: 'Silurian\u2013Ordovician limestone', unit: 'Calymenid trilobite beds', age: 'Silurian / Ordovician (contextual)', stage: 'Wenlock / Katian (contextual)', lithology: 'Limestone', deposition: 'Shallow marine', taphonomy: 'Enrolled trilobites', biozone: 'Calymenid fauna', basin: 'Documented locality' };
    }
    if (/Parapuzosia|Nipponites|Aioloceras|Douvilleiceras/i.test(sci)) {
      return { formation: 'Cretaceous marine mudstone / limestone', unit: 'Ammonite-bearing horizon', age: 'Cretaceous', stage: 'Albian\u2013Campanian (contextual)', lithology: 'Mudstone or limestone', deposition: 'Offshore marine', taphonomy: 'Shells and steinkerns', biozone: 'Ammonite fauna', basin: 'Documented marine basin' };
    }
    return {
      formation: 'Documented fossil-bearing formation',
      unit: 'Fossiliferous member / horizon',
      age: displayDate(specimen) || 'Geological age (contextual)',
      stage: 'Per locality stratigraphy',
      lithology: 'Sedimentary host rock',
      deposition: 'Documented depositional setting',
      taphonomy: 'Field-collected fossil remains',
      biozone: 'Associated fossil assemblage',
      basin: 'Documented sedimentary basin'
    };
  }

  function dinopediaStratigraphyDossier(specimen) {
    var sci = String(specimen.scientificName || '');
    var table = {
      'Linhenykus monodactylus': { formation: 'Wulansuhai Formation', unit: 'Bayan Mandahu beds', age: 'Late Cretaceous', stage: 'Campanian', lithology: 'Sandstone', deposition: 'Aeolian dune and interdune', paleoenv: 'Semi-arid desert margin', biozone: 'Bayan Mandahu fauna' },
      'Balaur bondoc': { formation: 'Sebe\u0219 Formation (Ha\u021beg)', unit: 'Continental Maastrichtian', age: 'Late Cretaceous', stage: 'Maastrichtian', lithology: 'Mudstone and sandstone', deposition: 'Island fluvial plain', paleoenv: 'Insular forested floodplain', biozone: 'Ha\u021beg Island fauna' },
      'Eoabelisaurus mefi': { formation: 'Ca\u00f1ad\u00f3n Asfalto Formation', unit: 'Middle Jurassic lacustrine', age: 'Middle Jurassic', stage: 'Toarcian\u2013Bajocian (contextual)', lithology: 'Tuff and mudstone', deposition: 'Lacustrine basin', paleoenv: 'Volcanic lake margin', biozone: 'Patagonian Jurassic fauna' },
      'Eocursor parvus': { formation: 'Lower Elliot Formation', unit: 'Late Triassic mudstone', age: 'Late Triassic', stage: 'Norian', lithology: 'Mudstone', deposition: 'Fluvial floodplain', paleoenv: 'Semi-arid floodplain', biozone: 'Elliot Formation fauna' },
      'Stegosaurus stenops': { formation: 'Morrison Formation', unit: 'Brushy Basin Member (contextual)', age: 'Late Jurassic', stage: 'Kimmeridgian\u2013Tithonian', lithology: 'Mudstone and sandstone', deposition: 'Fluvial floodplain', paleoenv: 'Seasonal river plain', biozone: 'Morrison dinosaur fauna' },
      'Tarbosaurus bataar': { formation: 'Nemegt Formation', unit: 'Fluvial sandstone', age: 'Late Cretaceous', stage: 'Maastrichtian', lithology: 'Sandstone and mudstone', deposition: 'Fluvial channels', paleoenv: 'Riverine woodland', biozone: 'Nemegt fauna' },
      'Vallibonavenatrix cani': { formation: 'Arcillas de Morella Formation', unit: 'Early Cretaceous continental', age: 'Early Cretaceous', stage: 'Barremian', lithology: 'Clay and sandstone', deposition: 'Coastal plain', paleoenv: 'Wetland margin', biozone: 'Iberian Early Cretaceous fauna' },
      'Ambopteryx longibrachium': { formation: 'Tiaojishan Formation', unit: 'Lacustrine volcaniclastic', age: 'Late Jurassic', stage: 'Oxfordian', lithology: 'Tuffaceous shale', deposition: 'Volcanic lake', paleoenv: 'Forest lake margin', biozone: 'Yanliao biota' },
      'Yutyrannus huali': { formation: 'Yixian Formation', unit: 'Lujiatun / lacustrine beds', age: 'Early Cretaceous', stage: 'Barremian\u2013Aptian', lithology: 'Tuffaceous mudstone', deposition: 'Volcanic lake / alluvial', paleoenv: 'Cool temperate forest', biozone: 'Jehol Biota' },
      'Yamaceratops dorngobiensis': { formation: 'Javkhlant Formation', unit: 'Continental sandstone', age: 'Late Cretaceous', stage: 'Santonian\u2013Campanian (contextual)', lithology: 'Sandstone', deposition: 'Fluvial plain', paleoenv: 'Semi-arid floodplain', biozone: 'Gobi ceratopsian fauna' },
      'Zhenyuanlong suni': { formation: 'Yixian Formation', unit: 'Jehol lacustrine beds', age: 'Early Cretaceous', stage: 'Barremian\u2013Aptian', lithology: 'Fine shale', deposition: 'Volcanic lake', paleoenv: 'Lake-margin forest', biozone: 'Jehol Biota' },
      'Zalmoxes robustus': { formation: 'S\u00e2npetru / Densu\u0219-Ciula (Ha\u021beg)', unit: 'Maastrichtian continental', age: 'Late Cretaceous', stage: 'Maastrichtian', lithology: 'Mudstone', deposition: 'Island fluvial', paleoenv: 'Insular woodland', biozone: 'Ha\u021beg Island fauna' },
      'Zuniceratops christopheri': { formation: 'Moreno Hill Formation', unit: 'Continental sandstone', age: 'Late Cretaceous', stage: 'Turonian', lithology: 'Sandstone', deposition: 'Fluvial plain', paleoenv: 'Coastal plain', biozone: 'Zuni Basin fauna' },
      'Zhuchengtyrannus magnus': { formation: 'Wangshi Group', unit: 'Xingezhuang Formation (contextual)', age: 'Late Cretaceous', stage: 'Campanian', lithology: 'Conglomerate and sandstone', deposition: 'Fluvial', paleoenv: 'Riverine plain', biozone: 'Zhucheng dinosaur fauna' }
    };
    return table[sci] || {
      formation: 'Documented dinosaur-bearing formation',
      unit: 'Continental vertebrate horizon',
      age: displayDate(specimen) || 'Mesozoic',
      stage: 'Per locality chronostratigraphy',
      lithology: 'Sandstone / mudstone',
      deposition: 'Fluvial\u2013lacustrine',
      paleoenv: 'Mesozoic continental setting',
      biozone: 'Dinosaur-bearing assemblage'
    };
  }

  function marineHabitatDossier(specimen) {
    var id = String(specimen.id || '');
    var table = {
      'marine-rhincodon': { zone: 'Neritic / reef slope', depth: '0\u201330 m (surface feeding)', salinity: '~35 PSU', tide: 'Open ocean / reef pass', seafloor: 'Coral reef and pelagic water column', waterTemp: '24\u201329 \u00b0C', current: 'Seasonal reef-pass flow', associates: 'Remoras, reef fishes' },
      'marine-tursiops': { zone: 'Coastal neritic', depth: '2\u201350 m', salinity: '30\u201336 PSU', tide: 'Coastal shelf', seafloor: 'Sand and mud shelf', waterTemp: '18\u201328 \u00b0C', current: 'Tidal coastal currents', associates: 'Schooling fish prey' },
      'marine-asterias': { zone: 'Intertidal to subtidal', depth: '0\u2013200 m (common 0\u201350 m)', salinity: '30\u201335 PSU', tide: 'Rocky shore / subtidal', seafloor: 'Rock and shell gravel', waterTemp: '5\u201315 \u00b0C', current: 'Tidal surge', associates: 'Mussels, barnacles' },
      'marine-aurelia': { zone: 'Coastal epipelagic', depth: '0\u201320 m', salinity: '20\u201335 PSU', tide: 'Coastal embayment', seafloor: 'Water column over soft bottom', waterTemp: '10\u201322 \u00b0C', current: 'Wind-driven surface flow', associates: 'Plankton assemblage' },
      'marine-diadema': { zone: 'Shallow reef flat', depth: '1\u201310 m', salinity: '~40 PSU (Red Sea)', tide: 'Reef flat / lagoon', seafloor: 'Coral rubble and sand', waterTemp: '24\u201330 \u00b0C', current: 'Gentle lagoon flow', associates: 'Coral and algae grazers' },
      'marine-octopus': { zone: 'Rocky infralittoral', depth: '1\u201350 m', salinity: '~38 PSU', tide: 'Rocky Mediterranean coast', seafloor: 'Rock crevices and rubble', waterTemp: '14\u201326 \u00b0C', current: 'Coastal tidal', associates: 'Crustaceans, molluscs' },
      'marine-tridacna': { zone: 'Reef flat / lagoon', depth: '0.5\u201310 m', salinity: '~35 PSU', tide: 'Intertidal reef flat', seafloor: 'Coral limestone', waterTemp: '24\u201329 \u00b0C', current: 'Reef-flat surge', associates: 'Symbiotic zooxanthellae, reef corals' },
      'marine-amphiprion': { zone: 'Coral reef lagoon', depth: '1\u201315 m', salinity: '~34 PSU', tide: 'Protected lagoon', seafloor: 'Live coral with host anemones', waterTemp: '26\u201330 \u00b0C', current: 'Gentle lagoon circulation', associates: 'Host sea anemones' },
      'marine-hippocampus': { zone: 'Seagrass meadow', depth: '0.5\u20138 m', salinity: '28\u201334 PSU', tide: 'Sheltered coastal', seafloor: 'Seagrass and muddy sand', waterTemp: '26\u201331 \u00b0C', current: 'Weak tidal', associates: 'Seagrass fauna' },
      'marine-chelonia': { zone: 'Reef nesting / foraging', depth: '0\u201320 m (foraging)', salinity: '~35 PSU', tide: 'Coral cay / reef', seafloor: 'Seagrass and reef', waterTemp: '25\u201329 \u00b0C', current: 'Reef current', associates: 'Seagrass beds, nesting colony' }
    };
    return table[id] || { zone: 'Coastal marine', depth: 'Shallow neritic', salinity: 'Marine (~35 PSU)', tide: 'Documented coastal habitat', seafloor: 'Documented substrate', waterTemp: 'Per field notes', current: 'Coastal', associates: 'Habitat associates logged' };
  }

  function microLabDossier(specimen) {
    var sci = String(specimen.scientificName || '');
    var table = {
      'Chlamydomonas reinhardtii': { medium: 'TAP / Sueoka medium', stain: 'Unstained / brightfield', mag: '400\u00d7', culture: 'Axenic culture, 22 \u00b0C, 12:12 light', morph: 'Biflagellate green alga', biosafety: 'BSL-1', prep: 'Wet mount' },
      'Staphylococcus aureus': { medium: 'Tryptic soy agar / blood agar', stain: 'Gram stain (positive cocci)', mag: '1000\u00d7 oil', culture: '37 \u00b0C aerobic', morph: 'Grape-like cocci clusters', biosafety: 'BSL-2', prep: 'Colony smear' },
      'Euglena gracilis': { medium: 'Euglena medium', stain: 'Unstained / phase contrast', mag: '400\u00d7', culture: 'Room temperature, light', morph: 'Flagellate protist with eyespot', biosafety: 'BSL-1', prep: 'Wet mount' },
      'Volvox carteri': { medium: 'Volvox / soil-water medium', stain: 'Unstained', mag: '100\u2013200\u00d7', culture: 'Lighted culture flask', morph: 'Spherical colonial green alga', biosafety: 'BSL-1', prep: 'Wet mount' },
      'Aspergillus niger': { medium: 'Potato dextrose agar', stain: 'Lactophenol cotton blue', mag: '400\u00d7', culture: '25 \u00b0C', morph: 'Black conidial heads', biosafety: 'BSL-1', prep: 'Tape mount / tease mount' },
      'Bacillus subtilis': { medium: 'Nutrient agar', stain: 'Gram stain (positive rods)', mag: '1000\u00d7 oil', culture: '30\u201337 \u00b0C', morph: 'Rods; endospores possible', biosafety: 'BSL-1', prep: 'Colony smear' },
      'Escherichia coli': { medium: 'LB / MacConkey agar', stain: 'Gram stain (negative rods)', mag: '1000\u00d7 oil', culture: '37 \u00b0C', morph: 'Short rods', biosafety: 'BSL-1 / BSL-2 strain-dependent', prep: 'Colony smear' },
      'Paramecium caudatum': { medium: 'Hay infusion / wheat medium', stain: 'Neutral red / unstained', mag: '100\u2013400\u00d7', culture: 'Room temperature', morph: 'Ciliate with oral groove', biosafety: 'BSL-1', prep: 'Wet mount' },
      'Nostoc commune': { medium: 'BG-11 medium', stain: 'Unstained', mag: '400\u00d7', culture: 'Lighted culture', morph: 'Filamentous cyanobacteria with heterocysts', biosafety: 'BSL-1', prep: 'Wet mount' },
      'Saccharomyces cerevisiae': { medium: 'YPD agar', stain: 'Simple / methylene blue', mag: '400\u20131000\u00d7', culture: '30 \u00b0C', morph: 'Budding yeast cells', biosafety: 'BSL-1', prep: 'Wet mount / smear' }
    };
    return table[sci] || { medium: 'Standard culture medium', stain: 'Per protocol', mag: '400\u00d7', culture: 'Controlled lab conditions', morph: 'Documented micrograph', biosafety: 'BSL-1', prep: 'Laboratory mount' };
  }

  function applyDisciplineProvenanceFields(data, specimen, category, parts) {
    var sci = String(specimen.scientificName || '');
    data.taxonomyPath = specimen.taxonomy || '\u2014';
    data.recordClass = category;
    if (category === 'entomology') {
      var isLep = /Lepidoptera|canace|Borbo|Graphium|Acytolepis|Heliophorus|Polyura|Athyma/i.test(sci + ' ' + (specimen.taxon || ''));
      var isLucanid = /Lucanidae|Allotopus|Dorcus|Hexarthrius|Odontolabis|Prosopocoilus|Phalacrognathus|Cyclommatus|Chiasognathus|Mesotopus|Aegus|Aesalus|Pseudoscortizus/i.test(sci + ' ' + (specimen.taxonomy || ''));
      data.hostPlant = isLep
        ? (/canace/i.test(sci) ? 'Lantana camara and native Rubus margin' : /Borbo/i.test(sci) ? 'Poaceae (rice / grasses)' : /Graphium/i.test(sci) ? 'Annonaceae / Lauraceae hosts' : 'Documented larval host plants')
        : isLucanid ? 'Decaying hardwood / sap flows' : /Paraponera/i.test(sci) ? 'Lowland rainforest understory' : 'Canopy gap and rotting wood interface';
      data.microhabitat = isLep ? 'Forest edge sun-patch / trail margin' : isLucanid ? 'Trunk crevice and rotting log' : 'Substrate interface near leaf litter';
      data.captureContext = isLep ? 'Hand-netted during diurnal transect' : 'Hand collected / light sheet as logged';
      data.lifeStage = isLep ? 'Adult imago' : 'Adult';
      data.sex = '\u2014';
      data.collectionMethod = isLep ? 'Aerial net' : 'Hand collecting';
      data.activityPeriod = isLep ? 'Diurnal' : 'Crepuscular to nocturnal (contextual)';
      data.voucherPrep = 'Pinned / spread specimen with locality label';
    } else if (category === 'botany') {
      data.canopyCondition = /Pinus|Ginkgo|Koelreuteria/i.test(sci) ? 'Open to partial canopy' : /Nelumbo/i.test(sci) ? 'Open wetland / full sun' : /Nepenthes|Drosera/i.test(sci) ? 'Open bog / edge light' : 'Partial canopy with filtered light';
      data.moisture = /Nelumbo/i.test(sci) ? 'Aquatic to saturated mud' : /Drosera|Nepenthes/i.test(sci) ? 'Oligotrophic wet peat / seep' : 'Mesic substrate with leaf litter moisture';
      data.associatedFlora = /Nelumbo/i.test(sci) ? 'Emergent aquatics and shoreline herbs' : /Pinus/i.test(sci) ? 'Pine understory grasses and ericads' : 'Ferns, grasses, and early-succession shrubs';
      data.phenophase = /Nelumbo|Koelreuteria/i.test(sci) ? 'Flowering / fruiting' : /Ginkgo/i.test(sci) ? 'Foliage / seed season' : 'Vegetative with fertile structures';
      data.soilType = /Nelumbo/i.test(sci) ? 'Organic pond mud' : /Pinus/i.test(sci) ? 'Acidic sandy loam' : 'Forest loam';
      data.herbariumPrep = 'Pressed, dried, and mounted sheet';
      data.collectorNumber = String(specimen.mc || '').replace(/\s+/g, '');
    } else if (category === 'paleontology') {
      var fs = fossilStratigraphyDossier(specimen);
      data.stratigraphicUnit = fs.unit;
      data.geologicalFormation = fs.formation;
      data.geologicalAge = fs.age;
      data.chronostratStage = fs.stage;
      data.lithology = fs.lithology;
      data.depositionalEnvironment = fs.deposition;
      data.taphonomy = fs.taphonomy;
      data.biozone = fs.biozone;
      data.sedimentaryBasin = fs.basin;
      data.localityType = 'Outcrop / quarry exposure';
      data.fossilElement = /shark|Hemipristis|Edestus|Globidens/i.test(sci) ? 'Dental / jaw elements' : /trilobite|Asaphus|Calymene|Gerastos/i.test(sci) ? 'Exoskeleton (cephalon\u2013pygidium)' : /ammon|Douvilleiceras|Nipponites|Parapuzosia|Aioloceras|Goniat/i.test(sci) ? 'Shell / steinkern' : /amber|Coleoptera|Insecta|Shuraboprosbole|Tabanidae/i.test(sci) ? 'Compression or amber inclusion' : 'Skeletal / shell remains';
      data.associatedFinds = 'Co-occurring fossils logged from the same horizon';
    } else if (category === 'dinopedia') {
      var ds = dinopediaStratigraphyDossier(specimen);
      data.stratigraphicUnit = ds.unit;
      data.geologicalFormation = ds.formation;
      data.geologicalAge = ds.age;
      data.chronostratStage = ds.stage;
      data.lithology = ds.lithology;
      data.depositionalEnvironment = ds.deposition;
      data.paleoenvironment = ds.paleoenv;
      data.biozone = ds.biozone;
      data.localityType = 'Dinosaur-bearing outcrop';
      data.fossilElement = 'Skeletal reconstruction reference / occurrence record';
      data.associatedFinds = 'Associated vertebrates and sediment context logged';
    } else if (category === 'mineralogy') {
      var min = mineralSpeciesDossier(sci);
      var mCoords = mineralLocalityCoords(specimen);
      if (mCoords) {
        data.latitude = mCoords.lat;
        data.longitude = mCoords.lng;
        data.elevation = mCoords.elev;
      }
      data.chemicalFormula = min.formula;
      data.crystalSystem = min.crystalSystem;
      data.mohsHardness = min.mohs;
      data.lustre = min.lustre;
      data.streak = min.streak;
      data.specificGravity = min.sg;
      data.crystalHabit = min.habit;
      data.mineralClass = min.mineralClass;
      data.hostRock = min.hostRock;
      data.depositType = min.depositType;
      data.mineralAssociation = min.association;
      data.localityType = 'Mine / mineral locality';
      data.coordinatePrecision = '\u00b1500 m (locality centroid)';
      data.uncertaintyRadius = '1 km';
      data.associatedFinds = min.association;
      data.environmentNotes = 'Mineral hand specimen photographed with documented mine / outcrop locality.';
    } else if (category === 'marine') {
      var mh = marineHabitatDossier(specimen);
      var cCoords = marineLocalityCoords(specimen);
      if (cCoords) {
        data.latitude = cCoords.lat;
        data.longitude = cCoords.lng;
        data.elevation = cCoords.elev;
      }
      data.marineZone = mh.zone;
      data.waterDepth = mh.depth;
      data.salinity = mh.salinity;
      data.tideContext = mh.tide;
      data.seafloor = mh.seafloor;
      data.waterTemperature = mh.waterTemp;
      data.currentRegime = mh.current;
      data.marineAssociates = mh.associates;
      data.localityType = 'Marine observation locality';
      data.coordinatePrecision = '\u00b11 km (habitat centroid)';
      data.uncertaintyRadius = '2 km';
      data.associatedFinds = mh.associates;
      data.environmentNotes = 'In-situ marine habitat photograph with locality and water-column context.';
    } else if (category === 'zoology') {
      data.observationType = 'Living voucher photograph';
      data.behaviorNote = /Varanus|Cynomys|Megaceryle/i.test(sci) ? 'Active diurnal observation' : /gecko|Paroedura|Nephrurus|Eublepharis|Rhacodactylus|Tarentola/i.test(sci) ? 'Nocturnal / crepuscular resting posture' : 'Documented at rest or in habitat';
      data.habitatStratum = /Megaceryle/i.test(sci) ? 'Riparian canopy / water edge' : /Polypedates/i.test(sci) ? 'Vegetation above temporary water' : /Cynomys/i.test(sci) ? 'Grassland burrow colony' : 'Ground / low vegetation';
      data.bodyCondition = 'Apparently healthy voucher individual';
      data.markingNotes = 'No tags; photo voucher only';
      data.associatedFinds = 'Habitat notes logged with the voucher photograph';
    } else if (category === 'microbiology') {
      var lab = microLabDossier(specimen);
      data.latitude = 25.033;
      data.longitude = 121.565;
      data.elevation = 12;
      data.cultureMedium = lab.medium;
      data.stainMethod = lab.stain;
      data.magnification = lab.mag;
      data.cultureCondition = lab.culture;
      data.microMorphology = lab.morph;
      data.biosafetyLevel = lab.biosafety;
      data.prepMethod = lab.prep;
      data.localityType = 'Laboratory culture / imaging station';
      data.expedition = 'Laboratory documentation';
      data.verificationStatus = L('\u5716\u7248\u5df2\u767b\u9304', 'Plate recorded', '\u56f3\u7248\u3092\u767b\u9332\u6e08\u307f');
      data.source = 'Laboratory photograph + culture log';
      data.coordinatePrecision = 'Institutional lab pin';
      data.uncertaintyRadius = 'Building footprint';
      data.associatedFinds = L('\u5178\u85cf\u5be6\u9a57\u5ba4\u986f\u5fae\u5f71\u50cf\uff1b\u7121\u7530\u91ce\u4f34\u751f\u8a18\u9304', 'Named laboratory micrograph recorded at Mcurator lab; no field associates recorded', '\u30e9\u30dc\u986f\u5fae\u93e1\u5199\u771f\u3002\u91ce\u5916\u4f34\u751f\u306e\u8a18\u9332\u306f\u306a\u3057');
      data.environmentNotes = L('\u65bc\u5178\u85cf\u5be6\u9a57\u5ba4\u62cd\u651d\u7684\u986f\u5fae\u5f71\u50cf\u3002', 'Laboratory micrograph recorded at Mcurator lab.', '\u30e9\u30dc\u3067\u8a18\u9332\u3057\u305f\u9855\u5fae\u93e1\u5199\u771f\u3002');
    }
    if (parts && parts.secondary && (category === 'paleontology' || category === 'dinopedia') && (!data.geologicalFormation || /Documented/.test(data.geologicalFormation))) {
      data.geologicalFormation = parts.secondary;
    }
  }

  function buildProvenanceData(specimen) {
    var geo = geoProfileForSpecimen(specimen);
    var parts = localityParts(specimen);
    var category = specimen.category || 'entomology';
    var data = {
      localityName: displayLocality(specimen),
      localityType: category === 'paleontology' || category === 'dinopedia' ? 'Outcrop / field exposure' : category === 'mineralogy' ? 'Mine / mineral locality' : category === 'marine' ? 'Marine observation locality' : category === 'microbiology' ? 'Laboratory culture' : 'Field site',
      country: geo.country,
      region: geo.region,
      nearestTown: geo.nearestTown,
      protectedArea: geo.protectedArea,
      siteLabel: geo.siteLabel,
      latitude: geo.lat,
      longitude: geo.lng,
      coordinateSystem: 'WGS84',
      coordinatePrecision: '\u00b115 m',
      uncertaintyRadius: '20 m',
      elevation: geo.elevation,
      terrainType: geo.terrainType,
      landform: geo.landform,
      slopeAspect: category === 'marine' ? 'Seaward aspect' : category === 'microbiology' ? '\u2014' : 'NE-facing slope \u00b7 12\u00b0',
      biome: geo.biome,
      habitatType: geo.habitatType,
      vegetation: geo.vegetation,
      substrate: geo.substrate,
      waterProximity: geo.waterProximity,
      environmentNotes: category === 'botany'
        ? L('\u6a19\u672c\u9928\u7b49\u7d1a\u7d00\u9304\uff0c\u63a1\u96c6\u6642\u5df2\u767b\u9304\u68f2\u5730\u8207\u6797\u4e0b\u4f34\u751f\u985e\u7fa4\u3002', 'Herbarium-grade record with habitat notes and associated understory taxa logged at collection.', '\u6a19\u672c\u9928\u30ec\u30d9\u30eb\u306e\u8a18\u9332\u3002\u63a1\u96c6\u6642\u306e\u751f\u606f\u5730\u3068\u6797\u5e8a\u306e\u4f34\u751f\u7fa4\u3092\u8a18\u3059\u3002')
        : category === 'entomology'
          ? L('\u6a19\u672c\u65bc\u57fa\u8cea\u4ea4\u754c\u8655\u6d3b\u52d5\uff1b\u5fae\u68f2\u5730\u8207\u5bc4\u4e3b\u5df2\u8a18\u5165\u91ce\u5916\u7b46\u8a18\u3002', 'Specimen observed active near substrate interface; microhabitat and host context recorded in field notes.', '\u57fa\u8cea\u306e\u5883\u754c\u3067\u6d3b\u52d5\u3002\u5fae\u751f\u606f\u5730\u3068\u5bc4\u4e3b\u3092\u91ce\u5916\u30ce\u30fc\u30c8\u306b\u8a18\u9332\u3002')
          : category === 'zoology'
            ? L('\u6d3b\u9ad4\u6191\u8b49\u7167\uff0c\u5f62\u614b\u8207\u7522\u5730\u96a8\u5f71\u50cf\u767b\u9304\u3002', 'Living animal photographed as a voucher; morphology and locality recorded with the image.', '\u751f\u4f53\u306e\u8a3c\u62e0\u5199\u771f\u3002\u5f62\u614b\u3068\u7523\u5730\u3092\u753b\u50cf\u3068\u3068\u3082\u306b\u8a18\u9332\u3002')
            : category === 'mineralogy'
              ? L('\u7926\u7269\u624b\u6a19\u672c\u7167\u7247\uff0c\u9644\u7522\u5730\u8207\u5bc4\u4e3b\u5ca9\u8cc7\u6599\u3002', 'Mineral hand specimen photograph with locality and host-rock context.', '\u9271\u7269\u6a19\u672c\u5199\u771f\u3002\u7523\u5730\u3068\u5bc4\u4e3b\u5ca9\u60c5\u5831\u3092\u4ed8\u8a18\u3002')
            : category === 'marine'
              ? L('\u6d77\u6d0b\u68f2\u5730\u5be6\u5883\u7167\u7247\uff0c\u9644\u6c34\u5c64\u8207\u5e95\u8cea\u8cc7\u6599\u3002', 'In-situ marine habitat photograph with water-column and substrate context.', '\u6d77\u6d0b\u751f\u606f\u5730\u306e\u73fe\u5834\u5199\u771f\u3002\u6c34\u5c64\u3068\u5e95\u8cea\u60c5\u5831\u3092\u4ed8\u8a18\u3002')
            : category === 'microbiology'
              ? L('\u65bc\u5178\u85cf\u5be6\u9a57\u5ba4\u62cd\u651d\u7684\u986f\u5fae\u5f71\u50cf\u3002', 'Laboratory micrograph recorded at Mcurator lab.', '\u30e9\u30dc\u3067\u8a18\u9332\u3057\u305f\u9855\u5fae\u93e1\u5199\u771f\u3002')
            : L('\u51fa\u73fe\u7d00\u9304\u5c0d\u61c9\u7522\u5730\u9732\u982d\uff0c\u5730\u5c64\u8207\u6c89\u7a4d\u74b0\u5883\u5df2\u8a18\u5165\u91ce\u5916\u7b46\u8a18\u3002', 'Occurrence tied to locality exposure with stratigraphic and depositional context documented in field notes.', '\u7523\u5730\u306e\u9732\u982d\u306b\u7d50\u3073\u3064\u304f\u7523\u51fa\u8a18\u9332\u3002\u5730\u5c64\u3068\u5806\u7a4d\u74b0\u5883\u3092\u91ce\u5916\u30ce\u30fc\u30c8\u306b\u8a18\u3059\u3002'),
      collectionDate: category === 'microbiology' ? '\u2014' : displayDate(specimen),
      collectionTime: category === 'microbiology' ? '\u2014' : '09:42',
      season: seasonFromDate(specimen.date),
      weather: geo.weather,
      expedition: L('\u5178\u85cf\u91ce\u5916\u6838\u67e5', 'MCurator Field Verification Survey', '\u5178\u85cf\u91ce\u5916\u7167\u67fb'),
      collector: specimen.collector || 'Lin Mei-hua',
      verifiedBy: 'MCurator Studio',
      provenanceConfidence: L('\u9ad8', 'High', '\u9ad8'),
      verificationStatus: L('\u91ce\u5916\u5df2\u6838\u67e5', 'Field verified', '\u91ce\u5916\u78ba\u8a8d\u6e08\u307f'),
      source: L('\u91ce\u5916\u7b46\u8a18\u8207\u9928\u65b9\u8986\u6838', 'Field notes + curator review', '\u91ce\u5916\u30ce\u30fc\u30c8\u3068\u5b66\u82b8\u54e1\u306e\u78ba\u8a8d'),
      citation: L('\u5178\u85cf\u7522\u5730\u7d00\u9304', 'MCurator provenance record', '\u5178\u85cf\u306e\u7523\u5730\u8a18\u9332'),
      ecozone: geo.ecozone,
      climate: geo.climate,
      associatedFinds: L('\u540c\u6a23\u5340\u7684\u6797\u4e0b\u4f34\u751f\u8207\u57fa\u8cea\u6a23\u54c1\u5df2\u767b\u9304', 'Associated understory taxa and substrate samples logged', '\u540c\u533a\u306e\u6797\u5e8a\u4f34\u751f\u3068\u57fa\u8cea\u8a66\u6599\u3092\u8a18\u9332'),
      specimenNumber: specimen.mc,
      scientificName: specimen.scientificName || '\u2014',
      commonName: specimen.commonName || specimen.common || '\u2014',
      discipline: category,
      mapX: clamp(((geo.lng + 180) / 360) * 100, 14, 86),
      mapY: clamp(((90 - geo.lat) / 180) * 100, 16, 84)
    };

    if (specimen.country) {
      data.country = specimen.country;
      data.region = specimen.region || specimen.country;
      data.nearestTown = specimen.town || data.localityName;
      data.siteLabel = specimen.town || data.localityName;
    }

    applyDisciplineProvenanceFields(data, specimen, category, parts);
    if (isFinite(Number(data.latitude)) && isFinite(Number(data.longitude))) {
      data.mapX = clamp(((Number(data.longitude) + 180) / 360) * 100, 14, 86);
      data.mapY = clamp(((90 - Number(data.latitude)) / 180) * 100, 16, 84);
    }
    return data;
  }

  function provenanceDisplayValue(value) {
    if (value == null || value === '') return '\u2014';
    if (typeof value === 'number') {
      if (Math.abs(value) >= 100) return String(Math.round(value));
      return value.toFixed(3);
    }
    return String(value);
  }

  function provenanceRow(fieldKey, label, value, dimmed) {
    var display = provenanceDisplayValue(value);
    var dimClass = dimmed || display === '\u2014' ? ' is-dimmed' : '';
    var claim = workflowState.selectedProvenanceField === fieldKey && !workflowState._provDefaultClaimed;
    if (claim) workflowState._provDefaultClaimed = true;
    var span = String(display).length > 24 ? ' mcwf-prov-row--span' : '';
    return '<button type="button" class="mcwf-prov-row' + dimClass + span +
      (claim ? ' is-selected' : '') +
      '" data-select-provenance="' + escapeHtml(fieldKey) + '" aria-pressed="' + (claim ? 'true' : 'false') + '">' +
      '<span class="mcwf-prov-row__stripe" aria-hidden="true"></span>' +
      '<span class="mcwf-prov-row__inner">' +
      '<span class="mcwf-prov-row__label">' + escapeHtml(label) + '</span>' +
      '<strong class="mcwf-prov-row__value" data-prov-typed data-prov-text="' + escapeHtml(display) + '"></strong>' +
      '</span></button>';
  }

  function provenanceBlock(titleEn, titleZh, groupKey, rowsHtml, extraClass) {
    return '<section class="mcwf-prov-block is-pending' + (extraClass ? ' ' + extraClass : '') +
      '" data-prov-group="' + escapeHtml(groupKey) + '">' +
      '<header class="mcwf-prov-block__head"><span class="mcwf-prov-block__eyebrow">' + escapeHtml(titleEn) + '</span>' +
      '<h4 class="mcwf-prov-block__title">' + escapeHtml(titleZh) + '</h4></header>' +
      '<div class="mcwf-prov-block__body">' + rowsHtml + '</div></section>';
  }

  function destroyProvenanceLeafletMap() {
    try {
      if (workflowState.provLeafletBasemapCleanup) {
        workflowState.provLeafletBasemapCleanup();
        workflowState.provLeafletBasemapCleanup = null;
      }
    } catch (e0) { /* ignore */ }
    try {
      if (workflowState.provLeafletMap && typeof workflowState.provLeafletMap.remove === 'function') {
        workflowState.provLeafletMap.remove();
      }
    } catch (e1) { /* ignore */ }
    workflowState.provLeafletMap = null;
    workflowState.provLeafletMarker = null;
  }

  function resolveWorkflowMapSettings() {
    var raw = typeof window !== 'undefined' && window.__MC_APP_STATE__ && window.__MC_APP_STATE__.settings
      ? window.__MC_APP_STATE__.settings
      : {};
    if (typeof window !== 'undefined' && window.MCMapService && window.MCMapService.resolveSettings) {
      return window.MCMapService.resolveSettings(raw);
    }
    return {
      providerName: 'OpenStreetMap',
      mapProviderMode: 'interactive',
      tileUrlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      tileSubdomains: '',
      fallbackEnabled: true,
      fallbackTileUrlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      fallbackTileAttribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, GIS User Community',
      defaultZoom: 6,
      defaultLat: 23.6978,
      defaultLng: 120.9605
    };
  }

  function workflowProvenanceBasemap(cfg) {
    var next = {
      providerName: cfg.providerName,
      mapProviderMode: cfg.mapProviderMode,
      tileUrlTemplate: cfg.tileUrlTemplate,
      tileAttribution: cfg.tileAttribution,
      tileSubdomains: cfg.tileSubdomains,
      fallbackEnabled: cfg.fallbackEnabled,
      fallbackTileUrlTemplate: cfg.fallbackTileUrlTemplate,
      fallbackTileAttribution: cfg.fallbackTileAttribution,
      defaultZoom: cfg.defaultZoom,
      defaultLat: cfg.defaultLat,
      defaultLng: cfg.defaultLng
    };
    var url = String(next.tileUrlTemplate || '');
    var cartoBlocked = !url || (/cartocdn\.com/i.test(url) && !/[?&]api_key=/i.test(url));
    if (cartoBlocked) {
      next.providerName = 'OpenStreetMap';
      next.tileUrlTemplate = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      next.tileAttribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      next.tileSubdomains = '';
      next.fallbackEnabled = true;
      if (!next.fallbackTileUrlTemplate || /cartocdn\.com/i.test(next.fallbackTileUrlTemplate)) {
        next.fallbackTileUrlTemplate = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
        next.fallbackTileAttribution = 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, GIS User Community';
      }
    }
    return next;
  }

  function provenanceMapPinIcon(L) {
    return L.divIcon({
      className: 'mcwf-prov-map__pin',
      html: '<span class="mcwf-prov-map__pin-ring" aria-hidden="true"></span><span class="mcwf-prov-map__pin-core" aria-hidden="true"></span>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }

  function provenanceMapZoomFor(data, cfg) {
    var lat = Number(data.latitude);
    var lng = Number(data.longitude);
    if (!isFinite(lat) || !isFinite(lng)) return Number(cfg.defaultZoom || 6);
    if (Math.abs(lat) < 0.001 && Math.abs(lng) < 0.001) return 2;
    var absLat = Math.abs(lat);
    if (absLat > 55) return 4;
    if (absLat > 35) return 5;
    return Math.min(9, Math.max(5, Number(cfg.defaultZoom || 6)));
  }

  function initProvenanceLeafletMap(data) {
    destroyProvenanceLeafletMap();
    var root = workflowState.frame && workflowState.frame.querySelector('.mcwf-prov-map[data-prov-map-root]');
    var mapEl = root && root.querySelector('.mcwf-prov-map__leaflet');
    var fallback = root && root.querySelector('.mcwf-prov-map__fallback');
    if (!root || !mapEl) return;
    root.classList.remove('has-leaflet', 'is-map-degraded', 'is-map-off');
    if (fallback) fallback.hidden = true;

    var L = typeof window !== 'undefined' ? window.L : null;
    var cfg = workflowProvenanceBasemap(resolveWorkflowMapSettings());
    if (!L || typeof L.map !== 'function' || cfg.mapProviderMode === 'off') {
      root.classList.add(cfg.mapProviderMode === 'off' ? 'is-map-off' : 'is-map-degraded');
      if (fallback) {
        fallback.hidden = false;
        fallback.textContent = cfg.mapProviderMode === 'off'
          ? '\u5730\u5716\u5df2\u95dc\u9589\uff08\u7cfb\u7d71\u8a2d\u5b9a\uff09'
          : '\u7121\u6cd5\u8f09\u5165\u7dda\u4e0a\u5730\u5716';
      }
      return;
    }

    var lat = Number(data.latitude);
    var lng = Number(data.longitude);
    if (!isFinite(lat) || !isFinite(lng)) {
      root.classList.add('is-map-degraded');
      if (fallback) {
        fallback.hidden = false;
        fallback.textContent = String(data.localityName || '') === 'Mcurator lab'
          ? 'Mcurator lab \u2014 no map pin'
          : isZh()
            ? '\u7522\u5730\u672a\u8a18\u9304\uff0c\u5730\u5716\u4e0d\u6a19\u9ede'
            : isJa()
              ? '\u7523\u5730\u672a\u8a18\u9332\u306e\u305f\u3081\u3001\u5730\u56f3\u306b\u30d4\u30f3\u3092\u7f6e\u304d\u307e\u305b\u3093'
              : isDe()
                ? 'Fundort nicht erfasst \u2014 keine Kartenmarkierung'
                : 'Locality not recorded \u2014 no map pin';
      }
      return;
    }
    var zoom = provenanceMapZoomFor(data, cfg);

    var map = L.map(mapEl, {
      zoomControl: true,
      attributionControl: true,
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      touchZoom: true
    });
    workflowState.provLeafletMap = map;
    workflowState.provLeafletMarker = L.marker([lat, lng], {
      icon: provenanceMapPinIcon(L),
      draggable: false,
      zIndexOffset: 800
    }).addTo(map);
    map.setView([lat, lng], zoom);

    if (window.MCMapService && window.MCMapService.attachBasemap) {
      var ctrl = window.MCMapService.attachBasemap(L, map, cfg, function (status) {
        if (status === 'failed') {
          root.classList.add('is-map-degraded');
          if (fallback) {
            fallback.hidden = false;
            fallback.textContent = '\u7dda\u4e0a\u5730\u5716\u5716\u5c64\u7121\u6cd5\u8f09\u5165';
          }
        }
      });
      workflowState.provLeafletBasemapCleanup = ctrl.cleanup;
    } else {
      L.tileLayer(cfg.tileUrlTemplate, {
        attribution: cfg.tileAttribution,
        subdomains: cfg.tileSubdomains || 'abcd',
        maxZoom: 19
      }).addTo(map);
    }

    map.scrollWheelZoom.disable();
    mapEl.addEventListener('mouseenter', function () {
      if (workflowState.provLeafletMap) workflowState.provLeafletMap.scrollWheelZoom.enable();
    });
    mapEl.addEventListener('mouseleave', function () {
      if (workflowState.provLeafletMap) workflowState.provLeafletMap.scrollWheelZoom.disable();
    });

    root.classList.add('has-leaflet');
    window.setTimeout(function () {
      if (workflowState.provLeafletMap) workflowState.provLeafletMap.invalidateSize();
    }, 80);
    window.setTimeout(function () {
      if (workflowState.provLeafletMap) workflowState.provLeafletMap.invalidateSize();
    }, 420);
  }

  function syncProvenanceLeafletMap(data) {
    if (!workflowState.provLeafletMap || !workflowState.provLeafletMarker || !data) return;
    var lat = Number(data.latitude);
    var lng = Number(data.longitude);
    if (!isFinite(lat) || !isFinite(lng)) return;
    workflowState.provLeafletMarker.setLatLng([lat, lng]);
    try {
      workflowState.provLeafletMap.setView([lat, lng], provenanceMapZoomFor(data, resolveWorkflowMapSettings()), { animate: false });
      workflowState.provLeafletMap.invalidateSize();
    } catch (eSync) { /* ignore */ }
  }

  function scheduleProvenanceLeafletInit() {
    var stage = mcuratorWorkflowStages[workflowState.index];
    if (!stage || stage.id !== 'provenance') return;
    var data = buildProvenanceData(specimenById(workflowState.selectedSpecimenId));
    function tryInit(attempt) {
      if (stage.id !== 'provenance') return;
      if (typeof window !== 'undefined' && window.L && typeof window.L.map === 'function') {
        initProvenanceLeafletMap(data);
        window.setTimeout(function () { syncProvenanceLeafletMap(data); }, 360);
        return;
      }
      if (attempt < 24) window.setTimeout(function () { tryInit(attempt + 1); }, 100);
    }
    window.setTimeout(function () { tryInit(0); }, 72);
  }

  function provenanceMapMarkup(data) {
    var lat = formatCoordinate(data.latitude, 'N', 'S');
    var lng = formatCoordinate(data.longitude, 'E', 'W');
    var elev = provenanceDisplayValue(data.elevation) + ' m';
    var pulse = /locality|gps|coordinates|site|terrain|habitat|elevation/.test(workflowState.selectedProvenanceField);
    var metaRows = provenanceRow('gps', provLabel('\u6d3b\u52d5\u7522\u5730', 'Active locality'), data.localityName + ' \u00b7 ' + data.siteLabel, false) +
      provenanceRow('coordinates', provLabel('\u5ea7\u6a19\u8b80\u6578', 'Coordinate readout'), lat + ' / ' + lng, false) +
      provenanceRow('elevation', provLabel('\u6d77\u62d4\u8b80\u6578', 'Elevation readout'), elev + ' \u00b7 ' + data.coordinateSystem, false);
    return '<section class="mcwf-prov-block mcwf-prov-block--map is-pending" data-prov-group="map">' +
      '<header class="mcwf-prov-block__head"><span class="mcwf-prov-block__eyebrow">OpenStreetMap</span>' +
      '<h4 class="mcwf-prov-block__title">' + L('\u7522\u5730\u5be6\u666f\u5730\u5716', 'Locality field map', '\u7523\u5730\u30d5\u30a3\u30fc\u30eb\u30c9\u30de\u30c3\u30d7') + '</h4></header>' +
      '<div class="mcwf-prov-map' + (pulse ? ' is-pulsing' : '') + '" data-prov-map-root>' +
      '<div class="mcwf-prov-map__leaflet" id="mcwfProvLeafletMap" role="application" aria-label="' + escapeHtml(L('\u6a19\u672c\u7522\u5730\u5be6\u666f\u5730\u5716', 'Specimen locality map', '\u6a19\u672c\u7523\u5730\u30de\u30c3\u30d7')) + '"></div>' +
      '<div class="mcwf-prov-map__atmosphere" aria-hidden="true"></div>' +
      '<p class="mcwf-prov-map__fallback" hidden>' + L('\u7121\u6cd5\u8f09\u5165\u7dda\u4e0a\u5730\u5716\u5716\u5c64', 'Online map tiles unavailable', '\u30aa\u30f3\u30e9\u30a4\u30f3\u5730\u56f3\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093') + '</p>' +
      '<dl class="mcwf-prov-map__hud">' +
      '<div data-prov-hud="lat"><dt>' + L('\u7def\u5ea6', 'Lat', '\u7def\u5ea6') + '</dt><dd class="mcwf-prov-map__mono" data-prov-typed data-prov-text="' + escapeHtml(lat) + '"></dd></div>' +
      '<div data-prov-hud="lng"><dt>' + L('\u7d93\u5ea6', 'Lng', '\u7d4c\u5ea6') + '</dt><dd class="mcwf-prov-map__mono" data-prov-typed data-prov-text="' + escapeHtml(lng) + '"></dd></div>' +
      '<div data-prov-hud="elev"><dt>' + L('\u6d77\u62d4', 'Elev', '\u6a19\u9ad8') + '</dt><dd class="mcwf-prov-map__mono" data-prov-typed data-prov-text="' + escapeHtml(elev) + '"></dd></div>' +
      '</dl>' +
      '<div class="mcwf-prov-map__overlay">' +
      '<span class="mcwf-prov-map__label" data-prov-typed data-prov-text="' + escapeHtml(data.localityName) + '"></span>' +
      '<span class="mcwf-prov-map__region" data-prov-typed data-prov-text="' + escapeHtml(data.region + ', ' + data.country) + '"></span>' +
      '<span class="mcwf-prov-map__badge">' + escapeHtml(data.coordinateSystem + ' \u00b7 ' + data.coordinatePrecision) + '</span>' +
      '</div></div>' +
      '<div class="mcwf-prov-map__meta">' + metaRows + '</div></section>';
  }

  function scrollProvenanceRevealTarget(target) {
    var scroll = workflowState.frame && workflowState.frame.querySelector('.mcwf-prov-scroll');
    if (!scroll || !target || !scroll.contains(target)) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      var scrollRect = scroll.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      var padding = Math.max(28, scrollRect.height * 0.22);
      var deltaTop = targetRect.top - scrollRect.top - padding;
      var deltaBottom = targetRect.bottom - (scrollRect.bottom - 18);
      var delta = 0;
      if (deltaTop < 0) delta = deltaTop;
      else if (deltaBottom > 0) delta = deltaBottom;
      if (Math.abs(delta) < 6) return;
      var nextTop = Math.max(0, scroll.scrollTop + delta);
      if (typeof scroll.scrollTo === 'function') {
        scroll.scrollTo({ top: nextTop, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        scroll.scrollTop = nextTop;
      }
    } catch (eScroll) { /* ignore */ }
  }

  function updateProvenanceRevealProgress(panel, index, total) {
    if (!panel) return;
    var bar = panel.querySelector('.mcwf-prov-head__progress > i');
    var status = panel.querySelector('.mcwf-prov-head__status');
    var count = panel.querySelector('.mcwf-prov-head__count');
    var pct = total > 0 ? Math.round(((index + 1) / total) * 100) : 0;
    if (bar) bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    if (count) count.textContent = Math.min(total, index + 1) + ' / ' + total;
    if (status && index + 1 >= total) {
      status.textContent = L('\u7530\u91ce\u8cc7\u6599\u5df2\u88dc\u5f37', 'Field enrichment complete', '\u91ce\u5916\u30c7\u30fc\u30bf\u88dc\u5f37\u6e08\u307f');
      status.classList.add('is-complete');
    }
  }

  function cancelProvenanceReveal() {
    workflowState.provenanceRevealSession += 1;
    if (workflowState.provenanceRevealQueue && workflowState.provenanceRevealQueue.length) {
      workflowState.provenanceRevealQueue.forEach(function (timer) { window.clearTimeout(timer); });
    }
    workflowState.provenanceRevealQueue = [];
  }

  function queueProvenanceStep(fn, delay) {
    var timer = window.setTimeout(fn, delay);
    workflowState.provenanceRevealQueue.push(timer);
    return timer;
  }

  function typeProvenanceFields(fields, index, session, done) {
    if (session !== workflowState.provenanceRevealSession) return;
    if (index >= fields.length) {
      if (done) done();
      return;
    }
    var field = fields[index];
    if (!field) {
      typeProvenanceFields(fields, index + 1, session, done);
      return;
    }
    var text = field.getAttribute('data-prov-text') || '\u2014';
    field.setAttribute('data-typing-active', '');
    field.textContent = '';
    scrollProvenanceRevealTarget(field.closest('.mcwf-prov-row') || field);
    var chars = String(text);
    var charIndex = 0;
    function step() {
      if (session !== workflowState.provenanceRevealSession) {
        field.removeAttribute('data-typing-active');
        return;
      }
      if (charIndex >= chars.length) {
        field.removeAttribute('data-typing-active');
        queueProvenanceStep(function () { typeProvenanceFields(fields, index + 1, session, done); }, 32);
        return;
      }
      var chunk = chars.length > 40 ? 2 : 1;
      var added = 0;
      while (added < chunk && charIndex < chars.length) {
        field.textContent += chars.charAt(charIndex);
        charIndex += 1;
        added += 1;
      }
      if (charIndex === chunk || charIndex % 12 === 0) {
        scrollProvenanceRevealTarget(field.closest('.mcwf-prov-row') || field);
      }
      var speed = chars.charAt(charIndex - 1) === ' ' ? 5 : 9;
      speed += Math.floor(Math.random() * 5);
      queueProvenanceStep(step, speed);
    }
    step();
  }

  function revealProvenanceGroups(groups, index, session, done, panel) {
    if (session !== workflowState.provenanceRevealSession) return;
    if (index >= groups.length) {
      if (done) done();
      return;
    }
    var block = groups[index];
    block.classList.remove('is-pending');
    block.classList.add('is-visible');
    updateProvenanceRevealProgress(panel, index, groups.length);
    scrollProvenanceRevealTarget(block);
    if (block.getAttribute('data-prov-group') === 'map' && workflowState.provLeafletMap) {
      window.setTimeout(function () {
        if (workflowState.provLeafletMap) workflowState.provLeafletMap.invalidateSize();
      }, 140);
    }
    var fields = block.querySelectorAll('[data-prov-typed]');
    if (!fields.length) {
      queueProvenanceStep(function () { revealProvenanceGroups(groups, index + 1, session, done, panel); }, 48);
      return;
    }
    typeProvenanceFields(fields, 0, session, function () {
      queueProvenanceStep(function () { revealProvenanceGroups(groups, index + 1, session, done, panel); }, 56);
    });
  }

  function runProvenancePanelReveal() {
    cancelProvenanceReveal();
    var session = workflowState.provenanceRevealSession;
    var layer = workflowState.frame && workflowState.frame.querySelector('[data-layer="5"]');
    var panel = layer && layer.querySelector('.mcwf-provenance-console');
    if (!panel) return;
    var blocks = panel.querySelectorAll('[data-prov-group]');
    var scroll = panel.querySelector('.mcwf-prov-scroll');
    if (scroll) scroll.scrollTop = 0;
    panel.classList.remove('is-revealed');
    panel.classList.add('is-revealing');
    Array.prototype.forEach.call(blocks, function (block) {
      block.classList.remove('is-visible');
      block.classList.add('is-pending');
    });
    Array.prototype.forEach.call(panel.querySelectorAll('[data-prov-typed]'), function (node) {
      node.textContent = '';
    });
    updateProvenanceRevealProgress(panel, -1, blocks.length);
    var status = panel.querySelector('.mcwf-prov-head__status');
    if (status) {
      status.textContent = L('\u7530\u91ce\u8cc7\u6599\u88dc\u5f37\u4e2d', 'Field enrichment active', '\u91ce\u5916\u30c7\u30fc\u30bf\u88dc\u5f37\u4e2d');
      status.classList.remove('is-complete');
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Array.prototype.forEach.call(panel.querySelectorAll('[data-prov-typed]'), function (node) {
        node.textContent = node.getAttribute('data-prov-text') || '\u2014';
      });
      Array.prototype.forEach.call(blocks, function (block) {
        block.classList.remove('is-pending');
        block.classList.add('is-visible');
      });
      updateProvenanceRevealProgress(panel, blocks.length - 1, blocks.length);
      panel.classList.add('is-revealed');
      if (scroll) scroll.scrollTop = scroll.scrollHeight;
      return;
    }
    queueProvenanceStep(function () {
      if (session !== workflowState.provenanceRevealSession) return;
      revealProvenanceGroups(Array.prototype.slice.call(blocks), 0, session, function () {
        if (session !== workflowState.provenanceRevealSession) return;
        panel.classList.add('is-revealed');
        updateProvenanceRevealProgress(panel, blocks.length - 1, blocks.length);
      }, panel);
    }, 100);
  }

  function runProvenanceCardTyping(stage, progressFrom, progressTo) {
    cancelCardTyping();
    var session = workflowState.typingSession;
    var card = workflowState.front && workflowState.front.querySelector('.mc-passport-card--workflow');
    if (!card) return;
    var specimen = specimenById(workflowState.selectedSpecimenId);
    var data = buildProvenanceData(specimen);
    progressFrom = progressFrom || 0;
    progressTo = progressTo == null ? displayedProgress(stage) : progressTo;
    card.classList.remove('is-revealed');
    card.classList.add('is-typing-entry');
    var fields = [
      { el: card.querySelector('[data-meta="locality"] dd'), text: specimen && specimen.category === 'microbiology' ? data.localityName : (data.localityName + ' \u00b7 ' + data.protectedArea) },
      { el: card.querySelector('[data-meta="date"] dd'), text: data.collectionDate },
      { el: card.querySelector('[data-meta="collector"] dd'), text: displayCollector(specimen) },
      { el: card.querySelector('[data-meta="visibility"] dd'), text: workflowVisibility(stage, false, true, specimen) }
    ];
    function finishTypingEntry() {
      if (session !== workflowState.typingSession) return;
      card.classList.remove('is-typing-entry');
      card.classList.add('is-revealed');
      animateProgressBar(progressFrom, progressTo);
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fields.forEach(function (field) { if (field.el) field.el.textContent = field.text; });
      finishTypingEntry();
      return;
    }
    fields.forEach(function (field) { if (field.el) field.el.textContent = ''; });
    function typeFields(index) {
      if (session !== workflowState.typingSession) return;
      if (index >= fields.length) {
        finishTypingEntry();
        return;
      }
      var field = fields[index];
      if (!field.el) {
        typeFields(index + 1);
        return;
      }
      typeIntoElement(field.el, field.text, session, function () {
        queueTypingStep(function () { typeFields(index + 1); }, 40);
      });
    }
    queueTypingStep(function () { typeFields(0); }, 80);
  }

  function provenanceHudKey(field) {
    if (field === 'coordinates') return 'lat';
    if (field === 'gps') return 'lng';
    if (field === 'elevation') return 'elev';
    if (field === 'locality' || field === 'site') return 'place';
    return '';
  }

  function provenanceFocusZoom(field, baseZoom) {
    var base = Number(baseZoom || 6);
    if (field === 'coordinates' || field === 'gps') return Math.min(12, base + 2);
    if (field === 'elevation' || field === 'terrain') return Math.min(11, base + 1);
    if (field === 'locality' || field === 'site') return Math.max(5, base - 1);
    return base;
  }

  function applyProvenanceFieldSelection(field, row) {
    if (!workflowState.frame || !field) return;
    workflowState.selectedProvenanceField = field;
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-select-provenance]'), function (item) {
      var on = row ? item === row : item.getAttribute('data-select-provenance') === field;
      item.classList.toggle('is-selected', on);
      if (item.classList.contains('mcwf-prov-row')) item.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('.mcwf-prov-block'), function (block) {
      block.classList.toggle('is-field-active', !!block.querySelector('.mcwf-prov-row.is-selected'));
    });
    var metaMap = {
      locality: 'locality', site: 'locality', gps: 'locality', coordinates: 'locality',
      elevation: 'locality', terrain: 'locality', habitat: 'locality', environment: 'locality',
      verification: 'collector', collector: 'collector', number: 'collector', notes: 'collector'
    };
    var activeField = metaMap[field] || field;
    var activeMeta = workflowState.front && workflowState.front.querySelector('[data-meta="' + activeField + '"]');
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-meta]'), function (meta) {
      meta.classList.remove('is-highlighted');
    });
    if (activeMeta) activeMeta.classList.add('is-highlighted');
    var hudKey = provenanceHudKey(field);
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-prov-hud]'), function (cell) {
      cell.classList.toggle('is-linked', cell.getAttribute('data-prov-hud') === hudKey);
    });
    var placeLabel = workflowState.frame.querySelector('.mcwf-prov-map__label');
    if (placeLabel) placeLabel.classList.toggle('is-linked', hudKey === 'place');
    var provMap = workflowState.frame.querySelector('.mcwf-prov-map');
    if (provMap) {
      provMap.classList.toggle('is-pulsing', /locality|gps|coordinates|site|terrain|habitat|environment|elevation/.test(field));
    }
    if (row && row.scrollIntoView) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    var map = workflowState.provLeafletMap;
    var marker = workflowState.provLeafletMarker;
    if (!map || !marker) return;
    var latlng = marker.getLatLng();
    var specimen = specimenById(workflowState.selectedSpecimenId);
    var baseZoom = provenanceMapZoomFor(buildProvenanceData(specimen), resolveWorkflowMapSettings());
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      map.flyTo(latlng, provenanceFocusZoom(field, baseZoom), { duration: reduceMotion ? 0 : 0.55 });
    } catch (eFly) { /* ignore */ }
  }

  function provenancePanel() {
    workflowState._provDefaultClaimed = false;
    var specimen = specimenById(workflowState.selectedSpecimenId);
    var data = buildProvenanceData(specimen);
    var category = specimen.category || 'entomology';
    var localityRows = provenanceRow('number', provLabel('\u6a19\u672c\u7de8\u865f', 'Specimen number'), data.specimenNumber, false) +
      provenanceRow('locality', provLabel('\u5b78\u540d', 'Scientific name'), data.scientificName, false) +
      provenanceRow('locality', provLabel('\u4fd7\u540d', 'Common name'), data.commonName, false) +
      provenanceRow('locality', provLabel('\u7522\u5730\u540d\u7a31', 'Locality name'), data.localityName, false) +
      provenanceRow('site', provLabel('\u7522\u5730\u985e\u578b', 'Locality type'), data.localityType, false) +
      provenanceRow('locality', provLabel('\u570b\u5bb6\uff0f\u5730\u5340', 'Country / region'), data.country + ' \u00b7 ' + data.region, false) +
      provenanceRow('site', provLabel('\u4fdd\u8b77\u5340\uff0f\u57ce\u93ae', 'Protected area / town'), data.protectedArea + ' \u00b7 ' + data.nearestTown, false) +
      provenanceRow('site', provLabel('\u5730\u9ede\u6a19\u7c64\uff0f\u6e2c\u7ad9', 'Site label / station'), data.siteLabel, false);
    var coordinateRows = provenanceRow('coordinates', provLabel('\u7def\u5ea6', 'Latitude'), formatCoordinate(data.latitude, 'N', 'S'), false) +
      provenanceRow('gps', provLabel('\u7d93\u5ea6', 'Longitude'), formatCoordinate(data.longitude, 'E', 'W'), false) +
      provenanceRow('coordinates', provLabel('\u5ea7\u6a19\u7cfb\u7d71', 'Coordinate system'), data.coordinateSystem, false) +
      provenanceRow('gps', provLabel('\u7cbe\u5ea6', 'Precision'), data.coordinatePrecision, false) +
      provenanceRow('gps', provLabel('\u4e0d\u78ba\u5b9a\u534a\u5f91', 'Uncertainty radius'), data.uncertaintyRadius, false);
    var terrainRows = provenanceRow('elevation', provLabel('\u6d77\u62d4', 'Elevation'), data.elevation + ' m', false) +
      provenanceRow('terrain', provLabel('\u5730\u5f62\u985e\u578b', 'Terrain type'), data.terrainType, false) +
      provenanceRow('terrain', provLabel('\u5730\u8c8c', 'Landform'), data.landform, false) +
      provenanceRow('terrain', provLabel('\u5761\u5ea6\uff0f\u5761\u5411', 'Slope / aspect'), data.slopeAspect, true);
    var habitatRows = provenanceRow('habitat', provLabel('\u751f\u7269\u7fa4\u7cfb', 'Biome'), data.biome, false) +
      provenanceRow('habitat', provLabel('\u68f2\u5730\u985e\u578b', 'Habitat type'), data.habitatType, false) +
      provenanceRow('environment', provLabel('\u690d\u88ab', 'Vegetation'), data.vegetation, false) +
      provenanceRow('environment', provLabel('\u57fa\u8cea', 'Substrate'), data.substrate, false) +
      provenanceRow('environment', provLabel('\u6c34\u6e90\u8ddd\u96e2', 'Water proximity'), data.waterProximity, false) +
      provenanceRow('notes', provLabel('\u74b0\u5883\u5099\u8a3b', 'Environmental notes'), data.environmentNotes, false);
    var collectionRows = provenanceRow('number', provLabel('\u63a1\u96c6\u65e5\u671f', 'Collection date'), data.collectionDate, false) +
      provenanceRow('number', provLabel('\u63a1\u96c6\u6642\u9593', 'Collection time'), data.collectionTime, true) +
      provenanceRow('number', provLabel('\u5b63\u7bc0', 'Season'), data.season, false) +
      provenanceRow('notes', provLabel('\u5929\u6c23', 'Weather'), data.weather, false) +
      provenanceRow('notes', provLabel('\u8003\u5bdf\uff0f\u8abf\u67e5', 'Expedition / survey'), data.expedition, false);
    var verificationRows = provenanceRow('collector', provLabel('\u63a1\u96c6\u8005\uff0f\u7d00\u9304\u8005', 'Collector / recorder'), displayCollector(specimen), false) +
      provenanceRow('verification', provLabel('\u6838\u67e5\u8005', 'Verified by'), data.verifiedBy, false) +
      provenanceRow('verification', provLabel('\u4fe1\u5fc3', 'Confidence'), data.provenanceConfidence, false) +
      provenanceRow('verification', provLabel('\u72c0\u614b', 'Status'), data.verificationStatus, false) +
      provenanceRow('notes', provLabel('\u4f86\u6e90', 'Source'), data.source, false) +
      provenanceRow('notes', provLabel('\u5f15\u7528', 'Citation'), data.citation, false);
    var contextRows = provenanceRow('environment', provLabel('\u751f\u614b\u5340', 'Ecozone'), data.ecozone, false) +
      provenanceRow('environment', provLabel('\u6c23\u5019\u985e\u578b', 'Climate class'), data.climate, false) +
      provenanceRow('notes', provLabel('\u4f34\u751f\u767c\u73fe', 'Associated finds'), data.associatedFinds, false) +
      provenanceRow('notes', provLabel('\u5206\u985e\u968e\u5c64', 'Taxonomy path'), data.taxonomyPath, false);
    var disciplineRows = '';
    var disciplineTitle = L('\u5b78\u79d1\u5c08\u5c6c\u6b04\u4f4d', 'Discipline dossier');
    var disciplineEyebrow = provLabel('\u5b78\u79d1\u8cc7\u6599', 'Discipline fields');
    if (category === 'entomology') {
      disciplineRows =
        provenanceRow('habitat', provLabel('\u5bc4\u4e3b\u690d\u7269', 'Host plant'), data.hostPlant, false) +
        provenanceRow('habitat', provLabel('\u5fae\u68f2\u5730', 'Microhabitat'), data.microhabitat, false) +
        provenanceRow('notes', provLabel('\u63a1\u96c6\u60c5\u5883', 'Capture context'), data.captureContext, false) +
        provenanceRow('notes', provLabel('\u751f\u547d\u53f2\u968e\u6bb5', 'Life stage'), data.lifeStage, false) +
        provenanceRow('notes', provLabel('\u63a1\u96c6\u65b9\u6cd5', 'Collection method'), data.collectionMethod, false) +
        provenanceRow('notes', provLabel('\u6d3b\u52d5\u6642\u6bb5', 'Activity period'), data.activityPeriod, false) +
        provenanceRow('notes', provLabel('\u6a19\u672c\u88fd\u5099', 'Voucher prep'), data.voucherPrep, false);
    } else if (category === 'botany') {
      disciplineRows =
        provenanceRow('habitat', provLabel('\u6797\u51a0\u72c0\u614b', 'Canopy condition'), data.canopyCondition, false) +
        provenanceRow('environment', provLabel('\u6fd5\u5ea6', 'Moisture'), data.moisture, false) +
        provenanceRow('environment', provLabel('\u4f34\u751f\u690d\u7269', 'Associated flora'), data.associatedFlora, false) +
        provenanceRow('notes', provLabel('\u7269\u5019\u671f', 'Phenophase'), data.phenophase, false) +
        provenanceRow('environment', provLabel('\u571f\u58e4\u985e\u578b', 'Soil type'), data.soilType, false) +
        provenanceRow('notes', provLabel('\u6a19\u672c\u9928\u88fd\u5099', 'Herbarium prep'), data.herbariumPrep, false) +
        provenanceRow('number', provLabel('\u63a1\u96c6\u865f', 'Collector number'), data.collectorNumber, false);
    } else if (category === 'paleontology' || category === 'dinopedia') {
      disciplineRows =
        provenanceRow('terrain', provLabel('\u5730\u8cea\u7d44', 'Geological formation'), data.geologicalFormation, false) +
        provenanceRow('terrain', provLabel('\u5730\u5c64\u55ae\u4f4d', 'Stratigraphic unit'), data.stratigraphicUnit, false) +
        provenanceRow('terrain', provLabel('\u5730\u8cea\u5e74\u4ee3', 'Geological age'), data.geologicalAge, false) +
        provenanceRow('terrain', provLabel('\u968e\uff0f\u671f', 'Stage / age'), data.chronostratStage, false) +
        provenanceRow('environment', provLabel('\u5ca9\u6027', 'Lithology'), data.lithology, false) +
        provenanceRow('environment', provLabel('\u6c89\u7a4d\u74b0\u5883', 'Depositional environment'), data.depositionalEnvironment, false) +
        (category === 'dinopedia'
          ? provenanceRow('environment', provLabel('\u53e4\u74b0\u5883', 'Paleoenvironment'), data.paleoenvironment, false)
          : provenanceRow('notes', provLabel('\u57cb\u85cf\u5b78', 'Taphonomy'), data.taphonomy, false)) +
        provenanceRow('notes', provLabel('\u751f\u7269\u5e36', 'Biozone / fauna'), data.biozone, false) +
        (data.sedimentaryBasin ? provenanceRow('terrain', provLabel('\u6c89\u7a4d\u76c6\u5730', 'Sedimentary basin'), data.sedimentaryBasin, false) : '') +
        provenanceRow('notes', provLabel('\u5316\u77f3\u90e8\u4f4d', 'Fossil element'), data.fossilElement, false);
    } else if (category === 'mineralogy') {
      disciplineRows =
        provenanceRow('notes', provLabel('\u5316\u5b78\u5f0f', 'Chemical formula'), data.chemicalFormula, false) +
        provenanceRow('notes', provLabel('\u6676\u7cfb', 'Crystal system'), data.crystalSystem, false) +
        provenanceRow('notes', provLabel('Mohs \u786c\u5ea6', 'Mohs hardness'), data.mohsHardness, false) +
        provenanceRow('notes', provLabel('\u5149\u6fa4', 'Lustre'), data.lustre, false) +
        provenanceRow('notes', provLabel('\u65c1\u75d5', 'Streak'), data.streak, false) +
        provenanceRow('notes', provLabel('\u6bd4\u91cd', 'Specific gravity'), data.specificGravity, false) +
        provenanceRow('notes', provLabel('\u6676\u5f62', 'Crystal habit'), data.crystalHabit, false) +
        provenanceRow('notes', provLabel('\u7926\u7269\u985e\u5225', 'Mineral class'), data.mineralClass, false) +
        provenanceRow('terrain', provLabel('\u5bc4\u4e3b\u5ca9', 'Host rock'), data.hostRock, false) +
        provenanceRow('terrain', provLabel('\u7926\u5e8a\u985e\u578b', 'Deposit type'), data.depositType, false) +
        provenanceRow('notes', provLabel('\u4f34\u751f\u7926\u7269', 'Mineral association'), data.mineralAssociation, false);
    } else if (category === 'marine') {
      disciplineRows =
        provenanceRow('habitat', provLabel('\u6d77\u6d0b\u5e36', 'Marine zone'), data.marineZone, false) +
        provenanceRow('elevation', provLabel('\u6c34\u6df1', 'Water depth'), data.waterDepth, false) +
        provenanceRow('environment', provLabel('\u9e7d\u5ea6', 'Salinity'), data.salinity, false) +
        provenanceRow('environment', provLabel('\u6f6e\u6c50\u60c5\u5883', 'Tide context'), data.tideContext, false) +
        provenanceRow('terrain', provLabel('\u6d77\u5e95\u5e95\u8cea', 'Seafloor'), data.seafloor, false) +
        provenanceRow('environment', provLabel('\u6c34\u6eab', 'Water temperature'), data.waterTemperature, false) +
        provenanceRow('environment', provLabel('\u6d41\u6c34\u5236\u5ea6', 'Current regime'), data.currentRegime, false) +
        provenanceRow('notes', provLabel('\u6d77\u6d0b\u4f34\u751f', 'Marine associates'), data.marineAssociates, false);
    } else if (category === 'zoology') {
      disciplineRows =
        provenanceRow('notes', provLabel('\u89c0\u6e2c\u985e\u578b', 'Observation type'), data.observationType, false) +
        provenanceRow('notes', provLabel('\u884c\u70ba\u5099\u8a3b', 'Behavior note'), data.behaviorNote, false) +
        provenanceRow('habitat', provLabel('\u68f2\u5730\u5c64\u6b21', 'Habitat stratum'), data.habitatStratum, false) +
        provenanceRow('notes', provLabel('\u9ad4\u6cc1', 'Body condition'), data.bodyCondition, false) +
        provenanceRow('notes', provLabel('\u6a19\u8a18\u5099\u8a3b', 'Marking notes'), data.markingNotes, false);
    } else if (category === 'microbiology') {
      disciplineRows =
        provenanceRow('notes', provLabel('\u57f9\u990a\u57fa', 'Culture medium'), data.cultureMedium, false) +
        provenanceRow('notes', provLabel('\u67d3\u8272\u65b9\u6cd5', 'Stain method'), data.stainMethod, false) +
        provenanceRow('notes', provLabel('\u653e\u5927\u500d\u7387', 'Magnification'), data.magnification, false) +
        provenanceRow('notes', provLabel('\u57f9\u990a\u689d\u4ef6', 'Culture condition'), data.cultureCondition, false) +
        provenanceRow('notes', provLabel('\u5fae\u89c0\u5f62\u614b', 'Micro morphology'), data.microMorphology, false) +
        provenanceRow('notes', provLabel('\u751f\u7269\u5b89\u5168\u7b49\u7d1a', 'Biosafety level'), data.biosafetyLevel, false) +
        provenanceRow('notes', provLabel('\u88fd\u7247\u65b9\u6cd5', 'Prep method'), data.prepMethod, false);
    }
    return '<aside class="mcwf-panel mcwf-provenance mcwf-provenance-console is-revealing" data-prov-dossier>' +
      '<header class="mcwf-prov-head">' +
      '<div class="mcwf-prov-head__top">' +
      '<div><p>' + L('06 / \u7522\u5730\u8ffd\u6eaf', '06 / PROVENANCE') + '</p>' +
      '<h3>' + L('\u7522\u5730\u8207\u74b0\u5883\u8108\u7d61', 'Locality & environment') + '</h3></div>' +
      '<div class="mcwf-prov-head__meta">' +
      '<span class="mcwf-prov-head__status">' + L('\u7530\u91ce\u8cc7\u6599\u88dc\u5f37\u4e2d', 'Field enrichment active') + '</span>' +
      '<span class="mcwf-prov-head__count" aria-live="polite">0 / 9</span></div></div>' +
      '<div class="mcwf-prov-head__progress" aria-hidden="true"><i></i></div>' +
      '<p class="mcwf-prov-head__summary">' + escapeHtml(data.scientificName) + ' \u00b7 ' + escapeHtml(data.specimenNumber) + '</p></header>' +
      '<div class="mcwf-prov-scroll">' +
      provenanceMapMarkup(data) +
      provenanceBlock(provLabel('\u7522\u5730\u8eab\u5206', 'Locality identity'), L('\u7522\u5730\u8207\u5730\u9ede\u8eab\u5206', 'Locality identity'), 'locality', localityRows) +
      provenanceBlock(provLabel('\u5ea7\u6a19', 'Coordinates'), L('\u5ea7\u6a19\u8207\u5b9a\u4f4d', 'Coordinates'), 'coordinates', coordinateRows) +
      provenanceBlock(provLabel('\u6d77\u62d4\uff0f\u5730\u5f62', 'Elevation / terrain'), L('\u6d77\u62d4\u8207\u5730\u5f62', 'Elevation / terrain'), 'terrain', terrainRows) +
      provenanceBlock(provLabel('\u68f2\u5730\uff0f\u74b0\u5883', 'Habitat / environment'), L('\u68f2\u5730\u8207\u74b0\u5883', 'Habitat / environment'), 'habitat', habitatRows) +
      provenanceBlock(provLabel('\u63a1\u96c6\u8108\u7d61', 'Collection context'), L('\u63a1\u96c6\u8207\u6642\u9593\u8108\u7d61', 'Collection context'), 'collection', collectionRows) +
      provenanceBlock(provLabel('\u4f86\u6e90\uff0f\u6838\u67e5', 'Provenance / verification'), L('\u4f86\u6e90\u8207\u6838\u67e5', 'Provenance / verification'), 'verification', verificationRows) +
      provenanceBlock(provLabel('\u79d1\u5b78\u8108\u7d61', 'Scientific context'), L('\u79d1\u5b78\u8108\u7d61\u8207\u985e\u578b\u7279\u5b9a\u6b04\u4f4d', 'Scientific context'), 'context', contextRows) +
      (disciplineRows
        ? provenanceBlock(disciplineEyebrow, disciplineTitle, 'discipline', disciplineRows)
        : '') +
      '</div></aside>';
  }

  function satControls() {
    return '<aside class="mcwf-sat-controls"><p>' + L('身份識別鏈', 'Identity chain') + '</p><button type="button" data-generate-sat ' +
      (workflowState.satGenerated ? 'disabled class="is-generated"' : '') + '>' +
      (workflowState.satGenerated ? L('已生成', 'Generated') : L('生成 SAT ID', 'Generate SAT ID')) + '</button>' +
      (workflowState.satGenerated ? '<strong class="mcwf-success-chip">' + L('已生成', 'Generated') + '</strong><small>NHM \u2192 MC \u2192 LEP-200441 \u2192 \u2713</small>' :
        '<small>' + L('SAT ID 待產生 · 點擊啟用追蹤鏈', 'SAT ID pending · click to enable trace chain') + '</small>') + '</aside>';
  }

  function archiveControls() {
    var specimen = specimenById(workflowState.selectedSpecimenId);
    var recommendedId = recommendedArchiveBgId(specimen);
    var selected = archivePatternById(workflowState.selectedArchiveBg);
    var modeNote = workflowState.archiveBgManual
      ? L('已手動選擇背板。點「依分類自動」可恢復對應分類。', 'Back pattern chosen manually. Click “Auto by taxonomy” to restore the matched pattern.')
      : L('依分類自動：', 'Auto by taxonomy: ') + archivePatternLabel(archivePatternById(recommendedId)) +
        L('（切換標本會更新）', ' (updates when specimen changes)');
    return '<aside class="mcwf-panel mcwf-archive-controls"><p>' + L('08 / 背景圖層', '08 / BACKGROUND') + '</p><h3>' +
      L('典藏背景', 'Archive background') + '</h3>' +
      '<span>' + L('預設依分類與學名自動套用背板；亦可手動選擇其他紋理。', 'Defaults follow taxonomy and scientific name; you can pick another pattern manually.') + '</span>' +
      '<p class="mcwf-archive-mode' + (workflowState.archiveBgManual ? ' is-manual' : ' is-auto') + '">' + modeNote + '</p>' +
      '<label>' + L('目前背景圖', 'Current pattern') + '<strong>' + archivePatternLabel(selected) + '</strong></label>' +
      '<div class="mcwf-pattern-preview ' + selected.className + '">' +
      (selected.image ? '<img src="' + selected.image + '" alt="Archive pattern preview">' : '') + '</div>' +
      '<div class="mcwf-pattern-options">' +
      archivePatterns.map(function (pattern) {
        var isSelected = selected.id === pattern.id;
        var isRecommended = !workflowState.archiveBgManual && pattern.id === recommendedId;
        return '<button type="button" data-select-archive-bg="' + pattern.id + '" class="' +
          (isSelected ? 'is-selected' : '') + (isRecommended ? ' is-recommended' : '') + '">' +
          archivePatternLabel(pattern) + (isRecommended ? '<em class="mcwf-pattern-tag">' + L('推薦', 'Recommended') + '</em>' : '') +
          '<i aria-hidden="true">&#10003;</i></button>';
      }).join('') + '</div>' +
      '<button type="button" class="mcwf-archive-reset" data-reset-archive-bg-auto' +
      (workflowState.archiveBgManual ? '' : ' disabled') + '>' + L('依分類自動', 'Auto by taxonomy') + '</button></aside>';
  }

  function capabilities() {
    var capabilityDetails = getCapabilityDetails();
    var detail = capabilityDetails[workflowState.selectedCapability];
    return '<aside class="mcwf-capabilities"><p>' + L('貼近實務，支援對應能力', 'Practical capabilities supported') + '</p><div>' +
      Object.keys(capabilityDetails).map(function (key) {
        return '<button class="' + (workflowState.selectedCapability === key ? 'is-active' : '') +
          '" data-select-capability="' + key + '" type="button">' + capabilityDetails[key][0] + '</button>';
      }).join('') + '</div><section><b>' + detail[0] + '</b><strong>' + detail[1] + '</strong><span>' + detail[2] + '</span></section></aside>';
  }

  function sceneMarkup() {
    return '<div class="mcwf-live-layer mcwf-live-layer--fan" data-layer="0">' + heroFanLayerMarkup() + '</div>' +
      '<div class="mcwf-live-layer mcwf-live-layer--discipline" data-layer="1">' + disciplineLayerMarkup() + '</div>' +
      '<div class="mcwf-live-layer mcwf-live-layer--photos" data-layer="2">' + photosLayerMarkup() + '</div>' +
      '<div class="mcwf-live-layer mcwf-live-layer--left" data-layer="3">' + apiPanel() + '</div>' +
      '<div class="mcwf-live-layer mcwf-live-layer--tree" data-layer="4">' + treePanel() + '</div>' +
      '<div class="mcwf-live-layer mcwf-live-layer--left" data-layer="5">' + provenancePanel() + '</div>' +
      '<div class="mcwf-live-layer mcwf-live-layer--identity" data-layer="6">' + satControls() + '</div>' +
      '<div class="mcwf-live-layer mcwf-live-layer--right" data-layer="7">' + archiveControls() + '</div>' +
      '<div class="mcwf-live-layer mcwf-live-layer--right" data-layer="8">' + capabilities() + '</div>';
  }

  function phonePagerMarkup() {
    var ids = disciplinePhotoThumbIds();
    return '<div class="mcwf-phone-pager" aria-label="' + escapeHtml(L('標本切換', 'Specimen pager')) + '">' +
      '<button type="button" class="mcwf-phone-pager__btn" data-cycle-specimen="-1" aria-label="' +
      escapeHtml(L('上一張標本', 'Previous specimen')) + '">&#8249;</button>' +
      '<div class="mcwf-phone-pager__dots">' +
      ids.map(function (id) {
        return '<button type="button" class="mcwf-phone-pager__dot" data-select-specimen="' + escapeHtml(id) +
          '" aria-label="' + escapeHtml(id) + '"></button>';
      }).join('') +
      '</div>' +
      '<button type="button" class="mcwf-phone-pager__btn" data-cycle-specimen="1" aria-label="' +
      escapeHtml(L('下一張標本', 'Next specimen')) + '">&#8250;</button></div>';
  }

  function storyPanels() {
    return '<div class="mcwf-story-stack"><div class="mcwf-story-foot">' + mcuratorWorkflowStages.map(function (stage, index) {
      return '<article class="mcwf-story-panel" data-copy="' + index + '"><small>' + stage.kicker + '</small><h2>' +
        stage.title + '</h2><p>' + stage.description + '</p></article>';
    }).join('') + '</div>' + phonePagerMarkup() + '</div>';
  }

  function renderMCuratorWorkflowStage() {
    if (!workflowState.frame) return;
    workflowState.frame.innerHTML =
      '<div class="mcwf-composition">' + sceneMarkup() +
        '<div class="mcwf-card-float"><article class="mcwf-evolving-card" data-flip-card role="button" tabindex="0" aria-label="' +
        escapeHtml(L('互動標本護照卡', 'Interactive specimen passport card')) + '"><div class="mcwf-card-inner"><div class="mcwf-card-face mcwf-card-face--front"></div><div class="mcwf-card-face mcwf-card-face--back">' + backFace() + '</div></div></article></div>' +
      '</div>' + storyPanels();
    workflowState.card = workflowState.frame.querySelector('.mcwf-evolving-card');
    workflowState.cardInner = workflowState.card && workflowState.card.querySelector('.mcwf-card-inner');
    workflowState.cardFloat = workflowState.frame.querySelector('.mcwf-card-float');
    workflowState.front = workflowState.frame.querySelector('.mcwf-card-face--front');
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-layer], [data-copy]'), function (element) {
      element.classList.add('is-hidden');
    });
  }

  function refreshSelectedStates() {
    if (!workflowState.frame) return;
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-select-specimen], [data-select-thumbnail]'), function (item) {
      var selected = item.getAttribute('data-select-specimen') || item.getAttribute('data-select-thumbnail');
      var fanAllowed = !item.hasAttribute('data-select-specimen') || workflowState.blankPreviewSelected;
      item.classList.toggle('is-selected', fanAllowed && selected === workflowState.selectedSpecimenId);
    });
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-select-discipline]'), function (item) {
      item.classList.toggle('is-selected', item.getAttribute('data-select-discipline') === workflowState.selectedDiscipline);
    });
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-select-taxonomy]'), function (item) {
      item.classList.toggle('is-selected', item.getAttribute('data-select-taxonomy') === workflowState.selectedTaxonomyNode);
    });
    var metaMap = {
      locality: 'locality', site: 'locality', gps: 'locality', coordinates: 'locality',
      elevation: 'locality', terrain: 'locality', habitat: 'locality', environment: 'locality',
      verification: 'collector', collector: 'collector', number: 'collector', notes: 'collector'
    };
    var activeField = metaMap[workflowState.selectedProvenanceField] || workflowState.selectedProvenanceField;
    var activeMeta = workflowState.front && workflowState.front.querySelector('[data-meta="' + activeField + '"]');
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-meta]'), function (meta) { meta.classList.remove('is-highlighted'); });
    if (activeMeta) activeMeta.classList.add('is-highlighted');
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-select-provenance]'), function (item) {
      item.classList.toggle('is-selected', item.getAttribute('data-select-provenance') === workflowState.selectedProvenanceField);
    });
    var provMap = workflowState.frame.querySelector('.mcwf-prov-map');
    if (provMap) {
      provMap.classList.toggle('is-pulsing', /locality|gps|coordinates|site|terrain|habitat|environment|elevation/.test(workflowState.selectedProvenanceField));
    }
    if (mcuratorWorkflowStages[workflowState.index] && mcuratorWorkflowStages[workflowState.index].id === 'provenance') {
      syncProvenanceLeafletMap(buildProvenanceData(specimenById(workflowState.selectedSpecimenId)));
    }
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('.mcwf-phone-pager__dot'), function (dot) {
      dot.classList.toggle('is-selected', dot.getAttribute('data-select-specimen') === workflowState.selectedSpecimenId);
    });
  }

  function refreshInteractivePanels(options) {
    options = options || {};
    var api = workflowState.frame.querySelector('[data-layer="3"]');
    var tree = workflowState.frame.querySelector('[data-layer="4"]');
    var provenance = workflowState.frame.querySelector('[data-layer="5"]');
    var sat = workflowState.frame.querySelector('[data-layer="6"]');
    var archive = workflowState.frame.querySelector('[data-layer="7"]');
    var finalPanel = workflowState.frame.querySelector('[data-layer="8"]');
    var photos = workflowState.frame.querySelector('[data-layer="2"]');
    if (api) api.innerHTML = apiPanel();
    if (photos) photos.innerHTML = photosLayerMarkup();
    if (tree && !(workflowState.index === 4 && tree.classList.contains('is-active') && options.rebuildTree === false)) {
      tree.innerHTML = treePanel();
    }
    if (provenance) {
      destroyProvenanceLeafletMap();
      provenance.innerHTML = provenancePanel();
      scheduleProvenanceLeafletInit();
    }
    if (sat) sat.innerHTML = satControls();
    if (archive) archive.innerHTML = archiveControls();
    if (finalPanel) finalPanel.innerHTML = capabilities();
    workflowState.card.querySelector('.mcwf-card-face--back').innerHTML = backFace();
    refreshSelectedStates();
    paintCutoutImages(workflowState.frame);
  }

  function updateInteractiveCardContent() {
    var stage = mcuratorWorkflowStages[workflowState.index];
    if (stage.id === 'photos') {
      runPhotosCardTyping(stage, displayedProgress(stage), displayedProgress(stage));
      refreshInteractivePanels();
      return;
    }
    transitionFrontFace(stage, false, displayedProgress(stage));
    refreshInteractivePanels();
  }

  function selectSpecimen(id, blankPreview) {
    if (id !== workflowState.selectedSpecimenId) {
      workflowState.fossilRestoreToken = (workflowState.fossilRestoreToken || 0) + 1;
      window.clearTimeout(workflowState.fossilRestoreTimer);
      clearTimePlateCover();
    }
    workflowState.selectedSpecimenId = id;
    workflowState.specimenTouched = true;
    syncTaxonomyFromSpecimen(specimenById(id));
    syncArchiveBgFromSpecimen();
    if (blankPreview) workflowState.blankPreviewSelected = true;
    updateInteractiveCardContent();
  }

  function cycleSpecimen(direction) {
    var ids = disciplinePhotoThumbIds();
    var current = ids.indexOf(workflowState.selectedSpecimenId);
    if (current < 0) current = 0;
    selectSpecimen(ids[(current + direction + ids.length) % ids.length], false);
  }

  function handleWorkflowInteraction(event) {
    var control = event.target.closest('[data-fossil-close], [data-fossil-skip], [data-select-specimen], [data-select-discipline], [data-select-thumbnail], [data-cycle-specimen], [data-select-api], [data-select-taxonomy], [data-select-provenance], [data-fossil-restore], [data-generate-sat], [data-select-archive-bg], [data-reset-archive-bg-auto], [data-select-capability], [data-flip-card], [data-mcwf-stage]');
    if (!control || !workflowState.root.contains(control)) return;
    if (control.hasAttribute('data-mcwf-stage')) {
      jumpToStage(Number(control.getAttribute('data-mcwf-stage')));
      return;
    }
    if (control.hasAttribute('data-select-specimen')) {
      selectSpecimen(control.getAttribute('data-select-specimen'), true);
    } else if (control.hasAttribute('data-select-thumbnail')) {
      selectSpecimen(control.getAttribute('data-select-thumbnail'), false);
    } else if (control.hasAttribute('data-cycle-specimen')) {
      cycleSpecimen(Number(control.getAttribute('data-cycle-specimen')));
    } else if (control.hasAttribute('data-select-discipline')) {
      workflowState.fossilRestoreToken = (workflowState.fossilRestoreToken || 0) + 1;
      window.clearTimeout(workflowState.fossilRestoreTimer);
      clearTimePlateCover();
      workflowState.selectedDiscipline = control.getAttribute('data-select-discipline');
      workflowState.selectedSpecimenId = defaultPhotoSpecimenId(workflowState.selectedDiscipline);
      workflowState.specimenTouched = true;
      syncTaxonomyFromSpecimen(specimenById(workflowState.selectedSpecimenId));
      syncArchiveBgFromSpecimen();
      refreshSelectedStates();
      updateInteractiveCardContent();
    } else if (control.hasAttribute('data-select-api')) {
      workflowState.selectedApiSource = control.getAttribute('data-select-api');
      updateInteractiveCardContent();
    } else if (control.hasAttribute('data-select-taxonomy')) {
      workflowState.selectedTaxonomyNode = control.getAttribute('data-select-taxonomy');
      refreshInteractivePanels({ rebuildTree: false });
      refreshSelectedStates();
    } else if (control.hasAttribute('data-select-provenance')) {
      applyProvenanceFieldSelection(control.getAttribute('data-select-provenance'), control);
    } else if (control.hasAttribute('data-fossil-close')) {
      closeFossilTimePlate();
    } else if (control.hasAttribute('data-fossil-skip')) {
      skipFossilTimeRestore();
    } else if (control.hasAttribute('data-fossil-restore')) {
      runFossilTimeRestore();
    } else if (control.hasAttribute('data-generate-sat')) {
      if (!workflowState.satGenerated) {
        workflowState.satGenerated = true;
        updateInteractiveCardContent();
      }
    } else if (control.hasAttribute('data-select-archive-bg')) {
      workflowState.selectedArchiveBg = control.getAttribute('data-select-archive-bg');
      workflowState.archiveBgManual = true;
      refreshInteractivePanels();
    } else if (control.hasAttribute('data-reset-archive-bg-auto')) {
      workflowState.archiveBgManual = false;
      syncArchiveBgFromSpecimen();
      refreshInteractivePanels();
    } else if (control.hasAttribute('data-select-capability')) {
      workflowState.selectedCapability = control.getAttribute('data-select-capability');
      updateInteractiveCardContent();
    } else if (control.hasAttribute('data-flip-card')) {
      if (workflowState.index >= 7) {
        workflowState.cardSide = workflowState.cardSide === 'back' ? 'front' : 'back';
      } else {
        workflowState.focused = !workflowState.focused;
      }
      applyCardTransform();
    }
  }

  function resetSideCardTilt(card) {
    if (!card) return;
    card.classList.remove('is-card-hovered');
    var tilt = card.querySelector('.mcwf-card-tilt');
    if (tilt) {
      tilt.style.setProperty('--tilt-x', '0deg');
      tilt.style.setProperty('--tilt-y', '0deg');
    }
  }

  function applySideCardTilt(card, event) {
    var tilt = card.querySelector('.mcwf-card-tilt');
    if (!tilt) return;
    var rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    var y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    var tiltStrength = card.classList.contains('mcwf-discipline-pick') ? 14 : (card.closest('.mcwf-thumbs') ? 12 : 13);
    tilt.style.setProperty('--tilt-x', ((0.5 - y) * tiltStrength).toFixed(2) + 'deg');
    tilt.style.setProperty('--tilt-y', ((x - 0.5) * (tiltStrength + 2)).toFixed(2) + 'deg');
    card.classList.add('is-card-hovered');
  }

  function handleCardPointerMove(event) {
    if (isPhoneLandingWorkflow()) return;
    if (!workflowState.card) return;
    var rect = workflowState.card.getBoundingClientRect();
    var x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    var y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    workflowState.hovered = true;
    workflowState.pointerTiltX = (0.5 - y) * 10;
    workflowState.pointerTiltY = (x - 0.5) * 14;
    applyCardTransform();
  }

  function handleCardPointerLeave() {
    workflowState.hovered = false;
    workflowState.pointerTiltX = 0;
    workflowState.pointerTiltY = 0;
    applyCardTransform();
  }

  function handleWorkflowPointerMove(event) {
    if (!workflowState.frame) return;
    var card = event.target.closest(interactiveCardSelector);
    if (card && card.classList.contains('mcwf-evolving-card')) {
      if (workflowState.activeSideCard) {
        resetSideCardTilt(workflowState.activeSideCard);
        workflowState.activeSideCard = null;
      }
      handleCardPointerMove(event);
      return;
    }
    if (workflowState.hovered) handleCardPointerLeave();
    if (!card) {
      if (workflowState.activeSideCard) {
        resetSideCardTilt(workflowState.activeSideCard);
        workflowState.activeSideCard = null;
      }
      return;
    }
    if (workflowState.activeSideCard && workflowState.activeSideCard !== card) {
      resetSideCardTilt(workflowState.activeSideCard);
    }
    workflowState.activeSideCard = card;
    applySideCardTilt(card, event);
  }

  function handleWorkflowPointerLeave(event) {
    if (!workflowState.root) return;
    if (event.relatedTarget && workflowState.root.contains(event.relatedTarget)) return;
    handleCardPointerLeave();
    if (workflowState.activeSideCard) {
      resetSideCardTilt(workflowState.activeSideCard);
      workflowState.activeSideCard = null;
    }
  }

  function bindPhoneWorkflowSwipe() {
    if (!workflowState.root || workflowState.phoneSwipeBound) return;
    workflowState.phoneSwipeBound = true;
    var startX = 0;
    var startY = 0;
    var tracking = false;
    workflowState.root.addEventListener('pointerdown', function (event) {
      if (!isPhoneLandingWorkflow()) return;
      if (!event.target.closest('.mcwf-card-float, .mcwf-phone-pager')) return;
      tracking = true;
      startX = event.clientX;
      startY = event.clientY;
    });
    workflowState.root.addEventListener('pointerup', function (event) {
      if (!tracking) return;
      tracking = false;
      if (!isPhoneLandingWorkflow()) return;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy)) return;
      cycleSpecimen(dx < 0 ? 1 : -1);
    });
    workflowState.root.addEventListener('pointercancel', function () {
      tracking = false;
    });
  }

  function handleWorkflowKeydown(event) {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('[data-flip-card]')) {
      event.preventDefault();
      handleWorkflowInteraction({ target: event.target });
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    var row = event.target.closest && event.target.closest('.mcwf-prov-row');
    if (!row || !workflowState.frame) return;
    var rows = Array.prototype.slice.call(workflowState.frame.querySelectorAll('.mcwf-prov-row'));
    var index = rows.indexOf(row);
    var next = rows[index + (event.key === 'ArrowDown' ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    next.focus();
    applyProvenanceFieldSelection(next.getAttribute('data-select-provenance'), next);
  }

  function transitionElementSet(selector, stageIndex) {
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll(selector), function (element) {
      var active = Number(element.getAttribute(selector === '[data-layer]' ? 'data-layer' : 'data-copy')) === stageIndex;
      window.clearTimeout(element._mcwfHideTimer);
      if (active) {
        element.classList.remove('is-hidden', 'is-leaving', 'is-active');
        element.classList.add('is-entering');
        window.requestAnimationFrame(function () {
          element.classList.remove('is-entering');
          element.classList.add('is-active');
        });
        return;
      }
      if (element.classList.contains('is-active') || element.classList.contains('is-entering')) {
        element.classList.remove('is-active', 'is-entering');
        if (selector === '[data-copy]') {
          element.classList.add('is-hidden');
          return;
        }
        element.classList.add('is-leaving');
        element._mcwfHideTimer = window.setTimeout(function () {
          element.classList.remove('is-leaving');
          element.classList.add('is-hidden');
        }, 920);
      } else {
        element.classList.add('is-hidden');
      }
    });
  }

  function animateProgressBar(progressFrom, progressTo) {
    var meter = workflowState.front.querySelector('.mc-passport-card__bar > span');
    if (!meter) return;
    meter.style.width = progressFrom + '%';
    meter.getBoundingClientRect();
    window.requestAnimationFrame(function () {
      meter.style.width = progressTo + '%';
    });
  }

  function transitionFrontFace(stage, immediate, priorProgress) {
    window.clearTimeout(workflowState.swapTimer);
    cancelCardTyping();
    resetCardReveal();
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function commitFrontFace() {
      workflowState.front.innerHTML = frontFace(stage);
      workflowState.front.classList.remove('is-leaving', 'is-entering', 'is-content-fading');
      workflowState.front.classList.add('is-active');
      refreshSelectedStates();
      paintCutoutImages(workflowState.front);
      triggerCardReveal(displayedProgress(stage), priorProgress || 0);
    }
    if (immediate || reduceMotion) {
      commitFrontFace();
      return;
    }
    /* Keep the opaque face shell locked. Only the passport body dissolves in place —
       fading the whole .mcwf-card-face caused a ghost flash through sibling panels. */
    workflowState.front.classList.remove('is-leaving', 'is-entering');
    workflowState.front.classList.add('is-active', 'is-content-fading');
    var body = workflowState.front.querySelector('.mc-passport-card__body');
    if (body) {
      body.classList.add('is-content-swap-out');
    }
    workflowState.swapTimer = window.setTimeout(function () {
      workflowState.front.innerHTML = frontFace(stage);
      workflowState.front.classList.remove('is-leaving', 'is-entering');
      workflowState.front.classList.add('is-active', 'is-content-fading');
      refreshSelectedStates();
      paintCutoutImages(workflowState.front);
      var nextBody = workflowState.front.querySelector('.mc-passport-card__body');
      if (nextBody) {
        nextBody.classList.add('is-content-swap-in');
        window.requestAnimationFrame(function () {
          nextBody.classList.remove('is-content-swap-in');
          nextBody.classList.add('is-content-swap-settled');
          triggerCardReveal(displayedProgress(stage), priorProgress || 0);
          window.setTimeout(function () {
            nextBody.classList.remove('is-content-swap-settled');
            workflowState.front.classList.remove('is-content-fading');
          }, 420);
        });
      } else {
        workflowState.front.classList.remove('is-content-fading');
        triggerCardReveal(displayedProgress(stage), priorProgress || 0);
      }
    }, 220);
  }

  function separateSidePanelsFromCard() {
    if (!workflowState.frame || isPhoneLandingWorkflow()) return;
    var card = workflowState.card;
    if (!card) return;
    var gap = 32;
    var panels = workflowState.frame.querySelectorAll(
      '.mcwf-live-layer--left.is-active > .mcwf-panel, .mcwf-live-layer--right.is-active > .mcwf-panel'
    );
    Array.prototype.forEach.call(panels, function (panel) {
      var layer = panel.parentElement;
      if (!layer) return;
      var isRight = layer.classList.contains('mcwf-live-layer--right');
      var box = panel.getBoundingClientRect();
      var cardBox = card.getBoundingClientRect();
      if (!box.width || !cardBox.width) return;
      var current = parseFloat(panel.style.marginLeft) || 0;
      var clearance = isRight ? (box.left - cardBox.right) : (cardBox.left - box.right);
      if (clearance >= gap) {
        if (!current) return;
        var extra = clearance - gap;
        var relaxed = isRight ? Math.max(0, current - extra) : Math.min(0, current + extra);
        if (Math.abs(relaxed - current) < 1) return;
        panel.style.marginLeft = Math.round(relaxed) + 'px';
        return;
      }
      if (clearance >= 0 && !current) return;
      var shift = (isRight ? 1 : -1) * (gap - clearance);
      panel.style.marginLeft = Math.round(current + shift) + 'px';
    });
  }

  function schedulePanelClearance(waitForCard) {
    if (workflowState.panelClearTimer) window.clearTimeout(workflowState.panelClearTimer);
    workflowState.panelClearTimer = window.setTimeout(function () {
      workflowState.panelClearTimer = 0;
      separateSidePanelsFromCard();
    }, waitForCard ? 820 : 48);
  }

  var STAGE_SWAP_MS = 620;

  function workflowMotionReduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function workflowBootCovered() {
    var html = document.documentElement;
    return html.classList.contains('mc-boot-active') || !!document.getElementById('mcBootSplash');
  }

  function canCrossfadeStages() {
    if (workflowMotionReduced() || workflowBootCovered()) return false;
    if (workflowState.root && workflowState.root.classList.contains('is-scene-hold')) return false;
    return true;
  }

  function clearStageGhost(sticky) {
    if (!sticky) return;
    var previous = sticky.querySelector('.mcwf-stage-ghost');
    if (!previous) return;
    if (previous._mcwfGhostTimer) window.clearTimeout(previous._mcwfGhostTimer);
    if (previous.parentNode) previous.parentNode.removeChild(previous);
  }

  function freezeGhostMotion(source, ghost) {
    var selector = '.mcwf-card-float, .mcwf-card-sway-wrap, .mcwf-hero-deck__row';
    var liveNodes = source.querySelectorAll(selector);
    var ghostNodes = ghost.querySelectorAll(selector);
    Array.prototype.forEach.call(liveNodes, function (node, index) {
      var twin = ghostNodes[index];
      if (!twin) return;
      var computed = window.getComputedStyle(node);
      if (computed.transform && computed.transform !== 'none') twin.style.transform = computed.transform;
      twin.style.animation = 'none';
    });
  }

  function mountStageGhost(stageEl) {
    var sticky = stageEl && stageEl.parentElement;
    if (!sticky) return null;
    clearStageGhost(sticky);
    var box = stageEl.getBoundingClientRect();
    if (!box.width || !box.height) return null;
    var ghost = stageEl.cloneNode(true);
    ghost.removeAttribute('id');
    ghost.classList.remove('is-stage-swap');
    ghost.classList.add('mcwf-stage-ghost');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.setAttribute('inert', '');
    Array.prototype.forEach.call(ghost.querySelectorAll('[id]'), function (node) {
      node.removeAttribute('id');
    });
    freezeGhostMotion(stageEl, ghost);
    var stickyBox = sticky.getBoundingClientRect();
    ghost.style.left = (box.left - stickyBox.left) + 'px';
    ghost.style.top = (box.top - stickyBox.top) + 'px';
    ghost.style.width = box.width + 'px';
    ghost.style.height = box.height + 'px';
    ghost.style.margin = '0';
    sticky.appendChild(ghost);
    return ghost;
  }

  function animationPaused(node) {
    if (!node || !node.getAnimations) return false;
    var anims = node.getAnimations();
    for (var i = 0; i < anims.length; i++) {
      if (anims[i].playState === 'paused') return true;
    }
    return false;
  }

  function releaseStageGhost(ghost) {
    if (!ghost) return;
    function drop(event) {
      if (event && event.target !== ghost) return;
      if (!event && animationPaused(ghost)) return;
      if (ghost._mcwfGhostTimer) window.clearTimeout(ghost._mcwfGhostTimer);
      ghost.removeEventListener('animationend', drop);
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    }
    ghost.addEventListener('animationend', drop);
    ghost._mcwfGhostTimer = window.setTimeout(function () { drop(null); }, 8000);
  }

  function restartStageSwapFade(stageEl) {
    if (!stageEl) return;
    if (workflowMotionReduced() || workflowBootCovered()) {
      stageEl.classList.remove('is-stage-swap');
      return;
    }
    workflowState.swapFadeToken = (workflowState.swapFadeToken || 0) + 1;
    var token = workflowState.swapFadeToken;
    if (stageEl._mcwfSwapFinish) {
      stageEl.removeEventListener('animationend', stageEl._mcwfSwapFinish);
      stageEl._mcwfSwapFinish = null;
    }
    stageEl.classList.remove('is-stage-swap');
    void stageEl.offsetWidth;
    stageEl.classList.add('is-stage-swap');
    function finish(event) {
      if (event && event.target !== stageEl) return;
      if (workflowState.swapFadeToken !== token) return;
      if (!event && animationPaused(stageEl)) return;
      stageEl.classList.remove('is-stage-swap');
      stageEl.removeEventListener('animationend', finish);
      if (stageEl._mcwfSwapFinish === finish) stageEl._mcwfSwapFinish = null;
    }
    stageEl._mcwfSwapFinish = finish;
    stageEl.addEventListener('animationend', finish);
    window.setTimeout(function () { finish(null); }, 8000);
  }

  function updateMCuratorWorkflowStage(stageIndex, immediate) {
    if (!workflowState.frame || !workflowState.card) return;
    var next = clamp(Math.round(stageIndex), 0, mcuratorWorkflowStages.length - 1);
    if (!immediate && workflowState.index === next) return;
    var stage = mcuratorWorkflowStages[next];
    var previous = workflowState.index >= 0 ? mcuratorWorkflowStages[workflowState.index] : stage;
    var stageChanged = workflowState.index !== next;
    var crossfade = stageChanged && !immediate && canCrossfadeStages();
    var stageGhost = crossfade ? mountStageGhost(workflowState.frame) : null;
    if (crossfade) workflowState.frame.classList.add('is-stage-swap');
    if (stageChanged && next === 2) {
      workflowState.selectedSpecimenId = defaultPhotoSpecimenId(workflowState.selectedDiscipline);
      syncTaxonomyFromSpecimen(specimenById(workflowState.selectedSpecimenId));
      workflowState.specimenTouched = true;
    } else if (stageChanged && !workflowState.specimenTouched) {
      workflowState.selectedSpecimenId = 'kaniska-canace';
      syncTaxonomyFromSpecimen(specimenById(workflowState.selectedSpecimenId));
    }
    if (workflowState.index >= 0) workflowState.frame.classList.remove('stage-0' + (workflowState.index + 1));
    workflowState.index = next;
    workflowState.stage = next;
    workflowState.frame.classList.add('stage-0' + (next + 1));
    workflowState.frame.setAttribute('data-stage', stage.id);
    workflowState.root.setAttribute('data-stage', stage.id);
    if (stageChanged) {
      workflowState.cardSide = next >= 7 ? 'back' : 'front';
      workflowState.focused = false;
      workflowState.hovered = false;
      workflowState.pointerTiltX = 0;
      workflowState.pointerTiltY = 0;
    }
    if (stage.id !== 'blank') {
      cancelBlankReveal();
      if (workflowState.card) {
        workflowState.card.classList.remove('is-blank-entering', 'is-blank-revealed');
        workflowState.card.style.opacity = '';
        workflowState.card.style.filter = '';
        if (workflowState.card.style.transition === 'none') workflowState.card.style.transition = '';
      }
      if (workflowState.cardFloat) {
        workflowState.cardFloat.classList.remove('is-blank-revealed', 'is-blank-entering');
      }
    }
    applyCardTransform();
    transitionFrontFace(stage, !!immediate || crossfade, previous.progress);
    refreshInteractivePanels();
    transitionElementSet('[data-layer]', next);
    transitionElementSet('[data-copy]', next);
    if (stage.id === 'provenance') {
      scheduleProvenanceLeafletInit();
      window.setTimeout(runProvenancePanelReveal, 380);
    } else {
      cancelProvenanceReveal();
      destroyProvenanceLeafletMap();
    }
    Array.prototype.forEach.call(workflowState.frame.querySelectorAll('[data-mcwf-stage]'), function (dot, index) {
      dot.classList.toggle('active', index === next);
    });
    schedulePanelClearance(!immediate);
    if (crossfade) {
      if (stageGhost) {
        stageGhost.classList.add('is-ghost-fade');
        releaseStageGhost(stageGhost);
      }
      restartStageSwapFade(workflowState.frame);
    }
  }

  function findScrollParent(element) {
    var node = element.parentElement;
    while (node && node !== document.body) {
      var overflow = window.getComputedStyle(node).overflowY;
      if (/(auto|scroll)/.test(overflow) && node.scrollHeight > node.clientHeight) return node;
      node = node.parentElement;
    }
    return window;
  }

  function nearestScrollStep() {
    var viewportTop = workflowState.scroller === window ? 0 : workflowState.scroller.getBoundingClientRect().top;
    var viewportHeight = workflowState.scroller === window ? window.innerHeight : workflowState.scroller.clientHeight;
    var center = viewportTop + viewportHeight * .54;
    var best = 0;
    var distance = Infinity;
    workflowState.steps.forEach(function (step, index) {
      var rect = step.getBoundingClientRect();
      var current = Math.abs(rect.top + rect.height / 2 - center);
      if (current < distance) {
        best = index;
        distance = current;
      }
    });
    return best;
  }

  function queueProgressUpdate() {
    if (workflowState.raf) return;
    workflowState.raf = window.requestAnimationFrame(function () {
      workflowState.raf = 0;
      updateMCuratorWorkflowStage(nearestScrollStep());
    });
  }

  function jumpToStage(index) {
    var step = workflowState.steps[clamp(index, 0, 8)];
    if (step) step.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function observeMCuratorWorkflowSteps() {
    if (!('IntersectionObserver' in window)) return;
    workflowState.observer = new IntersectionObserver(function (entries) {
      var strongest = null;
      entries.forEach(function (entry) {
        if (entry.isIntersecting && (!strongest || entry.intersectionRatio > strongest.intersectionRatio)) strongest = entry;
      });
      if (strongest) updateMCuratorWorkflowStage(Number(strongest.target.getAttribute('data-stage')));
    }, {
      root: workflowState.scroller === window ? null : workflowState.scroller,
      rootMargin: '-25% 0px -25% 0px',
      threshold: [0.35, 0.5, 0.65]
    });
    workflowState.steps.forEach(function (step) { workflowState.observer.observe(step); });
  }

  function initMCuratorWorkflowScreenshotRebuild() {
    var host = document.getElementById('mcPassportStoryRoot');
    if (!host) return false;
    if (host.querySelector('#mc-workflow-screenshot-rebuild')) return true;
    host.innerHTML =
      '<!-- OLD MCURATOR WORKFLOW SECTION DISABLED BY CODEX REBUILD -->' +
      '<!-- MCURATOR WORKFLOW SCREENSHOT REBUILD v2026-disciplines-v1 -->' +
      '<!-- MCURATOR_WORKFLOW_SCREENSHOT_REBUILD_VERSION_2026_CODEX_LOCKED -->' +
      '<section id="mc-workflow-screenshot-rebuild" class="mc-workflow-screenshot-rebuild is-scene-hold" data-passport-cinema="1">' +
        '<div class="mc-workflow-scroll-track">' +
          '<div class="mcwf-atmosphere" aria-hidden="true"></div>' +
          '<div class="mc-workflow-sticky-viewport mcwf-sticky"><div class="mcwf-stage"></div></div>' +
          '<div class="mc-workflow-scroll-steps" aria-hidden="true">' +
            mcuratorWorkflowStages.map(function (stage, index) {
              return '<section class="mc-workflow-scroll-step" data-stage="' + index + '"></section>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>';
    workflowState.root = host.querySelector('#mc-workflow-screenshot-rebuild');
    workflowState.frame = workflowState.root.querySelector('.mcwf-stage');
    workflowState.scroller = findScrollParent(workflowState.root);
    workflowState.steps = Array.prototype.slice.call(workflowState.root.querySelectorAll('.mc-workflow-scroll-step'));
    syncArchiveBgFromSpecimen();
    renderMCuratorWorkflowStage();
    updateMCuratorWorkflowStage(0, true);
    observeMCuratorWorkflowSteps();
    window.addEventListener('scroll', queueProgressUpdate, { passive: true });
    if (workflowState.scroller !== window) workflowState.scroller.addEventListener('scroll', queueProgressUpdate, { passive: true });
    window.addEventListener('resize', queueProgressUpdate);
    workflowState.root.addEventListener('click', handleWorkflowInteraction);
    workflowState.root.addEventListener('keydown', handleWorkflowKeydown);
    workflowState.root.addEventListener('pointermove', handleWorkflowPointerMove, { passive: true });
    workflowState.root.addEventListener('pointerleave', handleWorkflowPointerLeave);
    bindPhoneWorkflowSwipe();
    window.addEventListener('resize', function () {
      applyCardTransform();
      schedulePanelClearance(false);
    });
    queueProgressUpdate();
    armWorkflowSceneFade();
    host.dispatchEvent(new CustomEvent('mc-passport-story:mounted', { bubbles: true }));
    return true;
  }

  function armWorkflowSceneFade() {
    var root = workflowState.root;
    var sticky = root && root.querySelector('.mcwf-sticky');
    if (!root || !sticky) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      root.classList.remove('is-scene-hold');
      return;
    }
    var revealed = false;
    function reveal() {
      root.classList.remove('is-scene-hold');
      if (root.classList.contains('is-scene-fade')) {
        root.classList.remove('is-scene-fade');
        void root.offsetWidth;
      }
      root.classList.add('is-scene-fade');
    }
    function whenUncovered(callback) {
      var html = document.documentElement;
      function covered() {
        return html.classList.contains('mc-boot-active') || !!document.getElementById('mcBootSplash');
      }
      if (!covered()) {
        callback();
        return;
      }
      var done = false;
      function go() {
        if (done || covered()) return;
        done = true;
        observer.disconnect();
        window.clearTimeout(giveUp);
        callback();
      }
      var observer = new MutationObserver(go);
      var giveUp = window.setTimeout(function () {
        done = true;
        observer.disconnect();
        callback();
      }, 7000);
      observer.observe(html, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      });
    }
    var observer = new IntersectionObserver(function (entries) {
      if (revealed) return;
      var visible = false;
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) visible = true;
      });
      if (!visible) return;
      revealed = true;
      observer.disconnect();
      whenUncovered(reveal);
    }, { threshold: [0, 0.35, 0.6] });
    observer.observe(sticky);
  }

  window.initMCuratorWorkflowScreenshotRebuild = initMCuratorWorkflowScreenshotRebuild;
  window.renderMCuratorWorkflowStage = renderMCuratorWorkflowStage;
  window.updateMCuratorWorkflowStage = updateMCuratorWorkflowStage;
  window.mcuratorWorkflowStages = mcuratorWorkflowStages;
  window.mcuratorSpecimenCandidates = specimenCandidates;
  window.mcuratorWorkflowInteractionState = workflowState;
  window.MCPassportStory = { mount: initMCuratorWorkflowScreenshotRebuild };
  window.mcPaintSpecimenCutout = paintCutoutImage;
  window.MCWorkflowPassport = {
    renderCoverflowCard: renderPassportCoverflowCard,
    scientificNameFromImagePath: scientificNameFromImagePath,
  };
  try {
    if (typeof window.mcReloadSpecimenCoverflow === 'function') {
      window.mcReloadSpecimenCoverflow();
    }
  } catch (eCfReload) {
    void 0;
  }

  function refreshWorkflowI18n() {
    rebuildWorkflowStages();
    if (!workflowState.frame) return;
    var foot = workflowState.frame.querySelector('.mcwf-story-foot');
    if (foot) {
      foot.innerHTML = mcuratorWorkflowStages.map(function (stage, index) {
        return '<article class="mcwf-story-panel" data-copy="' + index + '"><small>' + stage.kicker + '</small><h2>' +
          stage.title + '</h2><p>' + stage.description + '</p></article>';
      }).join('');
    }
    if (workflowState.index >= 0) {
      var stage = mcuratorWorkflowStages[workflowState.index];
      refreshInteractivePanels({ rebuildTree: true });
      if (workflowState.front && stage) {
        transitionFrontFace(stage, true, stage.progress);
      }
      transitionElementSet('[data-copy]', workflowState.index);
    }
  }
  window.refreshMCuratorWorkflowI18n = refreshWorkflowI18n;

  window.addEventListener('mc:localechange', refreshWorkflowI18n);
  window.addEventListener('mc:locale', refreshWorkflowI18n);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMCuratorWorkflowScreenshotRebuild);
  else initMCuratorWorkflowScreenshotRebuild();
})();
