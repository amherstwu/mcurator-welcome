/**
 * SAT Market V2 public frontend.
 * Mounted only by apps-script/UI.html -> renderMarketplacePageSafe().
 * Scope: public SAT marketplace UI, asset cards, filters, sort, detail drawer.
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'mcSatV2MarketplaceRoot';
  var STYLE_ID = 'mcSatV2MarketplaceStyles';
  var INITIAL_VISIBLE = 9;
  var LOAD_STEP = 6;
  var SEARCH_DELAY = 180;
  var searchTimer = null;
  var toastTimer = null;
  var CARD_BACK_THUMB_BASE = '../assets/Card back image/thumbs/';

  var state = {
    q: '',
    tab: 'all',
    sort: 'newest',
    view: 'grid',
    visible: INITIAL_VISIBLE,
    collection: '',
    drawerId: '',
    filterOpen: false,
    watchOnly: false,
    watch: {},
    toast: '',
    filters: {
      assetType: {},
      category: {},
      license: {},
      verification: {},
      price: {},
    },
  };

  var WATCH_STORAGE_KEY = 'mcSatV2MarketplaceWatch';

  function specimenFallbackUrls(kind) {
    var base = '../assets/images/Specimen/';
    kind = kind || 'neutral';
    return {
      kind: kind,
      thumb: encodeURI(base + 'thumbs/' + kind + '.svg'),
      detail: encodeURI(base + 'detail/' + kind + '.svg'),
    };
  }

  function cardBackThumbPath(file) {
    return encodeURI(CARD_BACK_THUMB_BASE + (file || 'common.jpg'));
  }

  if (!global.MCSAT_CARD_BACK_IMAGES) {
    global.MCSAT_CARD_BACK_IMAGES = {
      base: CARD_BACK_THUMB_BASE,
      common: cardBackThumbPath('common.jpg'),
      collection: {
        coleoptera: cardBackThumbPath('coleoptera.jpg'),
        fossil: cardBackThumbPath('fossil.jpg'),
        plant: cardBackThumbPath('plantae.jpg'),
        marine: cardBackThumbPath('mollusca.jpg'),
        teaching: cardBackThumbPath('common.jpg'),
      },
    };
  }

  function loadWatchState() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(WATCH_STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') state.watch = parsed;
    } catch (e) {}
  }

  function saveWatchState() {
    try {
      if (global.localStorage) global.localStorage.setItem(WATCH_STORAGE_KEY, JSON.stringify(state.watch));
    } catch (e) {}
  }

  loadWatchState();

  function asset(data) {
    var base = {
      currency: 'USD',
      availability: 'Listed',
      exportStatus: 'QR / CSV / JSON ready',
      createdAt: '2026-04-01',
      views: 100,
      paymentMethods: '\u5361\u7247\u8207\u7a69\u5b9a\u5e63\u7d50\u7b97\uff08USDC / USDT\uff09\u652f\u63f4\uff0c\u4f4e\u8abf\u6574\u5408\u65bc\u6388\u6b0a\u8207\u8a18\u9304\u6d41\u7a0b\u3002',
      rights: '\u6388\u6b0a\u6458\u8981\u6db5\u84cb\u6559\u5b78\u3001\u7814\u7a76\u5f15\u7528\u3001\u5c55\u793a\u8207\u51fa\u7248\u652f\u63f4\u7b49\u7528\u9014\uff1b\u5177\u9ad4\u689d\u4ef6\u4ee5\u8cc7\u7522\u9801\u8207\u5408\u7d04\u70ba\u6e96\u3002',
      country: '',
      inquiryOnly: false,
      descriptionShort: '',
      academicUse: false,
      conservationLinked: false,
      physicalSpecimen: false,
      physicalSpecimenBinding: false,
      publicationLinked: false,
      curatorReviewed: false,
      museumArchive: false,
      researchReady: false,
      traceableRecord: true,
    };
    Object.keys(data).forEach(function (k) { base[k] = data[k]; });
    return base;
  }

  var ASSETS = [
    asset({ id: 'SAT-MC-000128', assetNumber: 'MC-ASSET-000128', specimenCode: 'MC-200441', title: 'Green dragontail specimen', scientificName: 'Lamproptera meges', commonName: 'Green dragontail', category: 'Insect', displayCategory: 'Lepidoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Lepidoptera > Papilionidae', locality: 'Luzon, Philippines', country: 'Philippines', creator: 'James Aldridge', date: '2022/05/16', assetType: 'Specimen Image', verificationStatus: 'Curator verified', licenseType: 'Academic use', price: 38, rarity: 'SR', scientificGrade: 'A', completionRate: 86, collection: 'Educational License Pack', views: 420, academicUse: true, curatorReviewed: true, researchReady: true, physicalSpecimenBinding: true, descriptionShort: '\u9ad8\u89e3\u6790\u5c55\u793a\u7528\u6a19\u672c\u5f71\u50cf\uff08\u5be6\u9ad4\u6a19\u672c\u7d81\u5b9a\u793a\u7bc4\uff09\uff1b\u9069\u5408\u6559\u5b78\u8207\u7814\u7a76\u53c3\u8003\u3002', thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000129', assetNumber: 'MC-ASSET-000129', specimenCode: 'MC-200442', title: 'Stag beetle reference plate', scientificName: 'Cyclommatus tarandus', commonName: 'Long-jawed stag beetle', category: 'Beetle', displayCategory: 'Coleoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Coleoptera > Lucanidae', locality: 'Sumatra, Indonesia', country: 'Indonesia', creator: 'MCurator Archive', date: '2021/09/02', assetType: 'Specimen Image', verificationStatus: 'SAT graded', licenseType: 'Education use', price: 42, rarity: 'HR', scientificGrade: 'A+', completionRate: 92, collection: 'Beetle Archive', views: 610, academicUse: true, museumArchive: true, descriptionShort: '\u7cbe\u9078\u5178\u85cf\u5f71\u50cf\uff0c\u9023\u7d50\u7522\u5730\u8207\u6388\u6b0a\u8981\u9ede\u3002', thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000130', assetNumber: 'MC-ASSET-000130', specimenCode: 'MC-200443', title: 'Museum butterfly teaching plate', scientificName: 'Papilio memnon', commonName: 'Great Mormon', category: 'Insect', displayCategory: 'Lepidoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Lepidoptera > Papilionidae', locality: 'Nantou, Taiwan', creator: 'Lin Field Studio', date: '2023/03/18', assetType: 'Educational Pack', verificationStatus: 'Curator verified', licenseType: 'Education use', price: 64, rarity: 'UR', scientificGrade: 'A', completionRate: 96, collection: 'Educational License Pack', views: 388, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000131', assetNumber: 'MC-ASSET-000131', specimenCode: 'MC-200444', title: 'Research dataset shell lot', scientificName: 'Nerita albicilla', commonName: 'Toothed nerite', category: 'Shell', displayCategory: 'Marine', taxonomy: 'Animalia > Mollusca > Gastropoda > Neritidae', locality: 'Okinawa intertidal zone', country: 'Japan', creator: 'Okinawa Coastal Survey', date: '2020/11/08', assetType: 'Research Data', verificationStatus: 'Provenance complete', licenseType: 'Academic use', price: 19, rarity: 'U', scientificGrade: 'B+', completionRate: 81, collection: 'Marine Specimen Library', views: 210, researchReady: true, conservationLinked: true, descriptionShort: '\u6f6e\u9593\u5e36\u89c0\u5bdf\u8207\u5143\u8cc7\u6599\u5305\uff1b\u90e8\u5206\u6536\u76ca\u9023\u7d50\u6d77\u5cb8\u751f\u614b\u8a08\u756b\u3002', thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000132', assetNumber: 'MC-ASSET-000132', specimenCode: 'MC-200445', title: 'Trilobite plate (physical)', scientificName: 'Trilobita gen. sp.', commonName: 'Trilobite plate', category: 'Fossil', displayCategory: 'Fossil', taxonomy: 'Animalia > Arthropoda > Trilobita', locality: 'Middle Atlas, Morocco', country: 'Morocco', creator: 'Atlas Fossil Bench', date: '2019/04/12', assetType: 'Physical Specimen', verificationStatus: 'SAT graded', licenseType: 'Collector edition', price: 0, availability: 'Inquiry', inquiryOnly: true, rarity: 'SEC', scientificGrade: 'A+', completionRate: 89, collection: 'Fossil Reference Plates', views: 734, physicalSpecimen: true, museumArchive: true, descriptionShort: '\u5be6\u9ad4\u5316\u77f3\u677f\uff1b\u904b\u9001\u3001\u5132\u5b58\u8207\u8de8\u5883\u6cd5\u898f\u9808\u5225\u6848\u6838\u53ef\u3002', thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000133', assetNumber: 'MC-ASSET-000133', specimenCode: 'MC-200446', title: 'Botanical scan teaching set', scientificName: 'Ginkgo biloba', commonName: 'Ginkgo leaf set', category: 'Plant', displayCategory: 'Botanical', taxonomy: 'Plantae > Ginkgophyta > Ginkgoopsida', locality: 'Kyoto botanical collection', creator: 'Kyoto Teaching Herbarium', date: '2022/10/04', assetType: 'Educational Pack', verificationStatus: 'Curator verified', licenseType: 'Education use', price: 15, rarity: 'U', scientificGrade: 'B', completionRate: 78, collection: 'Botanical Scans', views: 198, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000134', assetNumber: 'MC-ASSET-000134', specimenCode: 'MC-200447', title: 'Beetle morphology license', scientificName: 'Dorcus ternatensis', commonName: 'Ternate stag beetle', category: 'Beetle', displayCategory: 'Coleoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Coleoptera > Lucanidae', locality: 'Ternate, Indonesia', creator: 'A. Rahman', date: '2021/12/21', assetType: 'Usage License', verificationStatus: 'Curator verified', licenseType: 'Commercial use', price: 88, rarity: 'SR', scientificGrade: 'A', completionRate: 91, collection: 'Beetle Archive', views: 455, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000135', assetNumber: 'MC-ASSET-000135', specimenCode: 'MC-200448', title: 'Ant field record', scientificName: 'Paraponera clavata', commonName: 'Bullet ant', category: 'Insect', displayCategory: 'Hymenoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Hymenoptera > Formicidae', locality: 'Amazon basin, Peru', creator: 'Rainforest Field Unit', date: '2022/02/27', assetType: 'Specimen Image', verificationStatus: 'Provenance complete', licenseType: 'Academic use', price: 22, rarity: 'R', scientificGrade: 'B+', completionRate: 84, collection: 'Beetle Archive', views: 276, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000136', assetNumber: 'MC-ASSET-000136', specimenCode: 'MC-200449', title: 'Iridescent scarab collection version', scientificName: 'Plusiotis chrysargirea', commonName: 'Silver gold scarab', category: 'Beetle', displayCategory: 'Coleoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Coleoptera > Scarabaeidae', locality: 'Talamanca, Costa Rica', creator: 'Bajo Chirripo Archive', date: '2021/04/06', assetType: 'Collection Edition', verificationStatus: 'SAT graded', licenseType: 'Collector edition', price: 120, rarity: 'HR', scientificGrade: 'A+', completionRate: 95, collection: 'Beetle Archive', views: 811, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000137', assetNumber: 'MC-ASSET-000137', specimenCode: 'MC-200450', title: 'Moth teaching image set', scientificName: 'Saturnia pyri', commonName: 'Great peacock moth', category: 'Insect', displayCategory: 'Lepidoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Lepidoptera > Saturniidae', locality: 'Provence, France', creator: 'Camille Rousseau', date: '2020/05/28', assetType: 'Educational Pack', verificationStatus: 'Curator verified', licenseType: 'Education use', price: 31, rarity: 'R', scientificGrade: 'B+', completionRate: 83, collection: 'Educational License Pack', views: 167, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000138', assetNumber: 'MC-ASSET-000138', specimenCode: 'MC-200451', title: 'Morpho wing reference', scientificName: 'Morpho menelaus', commonName: 'Blue morpho', category: 'Insect', displayCategory: 'Lepidoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Lepidoptera > Nymphalidae', locality: 'Amazon, Brazil', creator: 'Amazon Visual Archive', date: '2022/08/11', assetType: 'Specimen Image', verificationStatus: 'Curator verified', licenseType: 'Academic use', price: 64, rarity: 'UR', scientificGrade: 'A', completionRate: 88, collection: 'Educational License Pack', views: 590, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000139', assetNumber: 'MC-ASSET-000139', specimenCode: 'MC-200452', title: 'Marine data package', scientificName: 'Turbo marmoratus', commonName: 'Green turban snail', category: 'Shell', displayCategory: 'Marine', taxonomy: 'Animalia > Mollusca > Gastropoda > Turbinidae', locality: 'Palawan, Philippines', creator: 'Marine Reference Lab', date: '2023/01/18', assetType: 'Research Data', verificationStatus: 'Provenance complete', licenseType: 'Academic use', price: 55, rarity: 'R', scientificGrade: 'A', completionRate: 90, collection: 'Marine Specimen Library', views: 352, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000140', assetNumber: 'MC-ASSET-000140', specimenCode: 'MC-200453', title: 'Fungal teaching record', scientificName: 'Amanita muscaria', commonName: 'Fly agaric', category: 'Plant', displayCategory: 'Fungi', taxonomy: 'Fungi > Basidiomycota > Agaricomycetes', locality: 'Hehuanshan, Taiwan', creator: 'Mountain Teaching Survey', date: '2021/11/23', assetType: 'Educational Pack', verificationStatus: 'Provenance complete', licenseType: 'Education use', price: 8, rarity: 'C', scientificGrade: 'C', completionRate: 69, collection: 'Botanical Scans', views: 91, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000141', assetNumber: 'MC-ASSET-000141', specimenCode: 'MC-200454', title: 'Museum beetle reference', scientificName: 'Aegus acuminatus', commonName: 'Aegus stag beetle', category: 'Beetle', displayCategory: 'Coleoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Coleoptera > Lucanidae', locality: 'Sabah, Malaysia', creator: 'North Borneo Plate Archive', date: '2020/07/14', assetType: 'Specimen Image', verificationStatus: 'Curator verified', licenseType: 'Academic use', price: 46, rarity: 'SR', scientificGrade: 'A', completionRate: 87, collection: 'Beetle Archive', views: 309, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000142', assetNumber: 'MC-ASSET-000142', specimenCode: 'MC-200455', title: 'Botanical license sheet', scientificName: 'Ficus elastica', commonName: 'Rubber plant', category: 'Plant', displayCategory: 'Botanical', taxonomy: 'Plantae > Angiosperms > Rosales', locality: 'Singapore greenhouse collection', creator: 'Teaching Herbarium Team', date: '2022/06/09', assetType: 'Usage License', verificationStatus: 'Curator verified', licenseType: 'Commercial use', price: 27, rarity: 'U', scientificGrade: 'B', completionRate: 79, collection: 'Botanical Scans', views: 144, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000143', assetNumber: 'MC-ASSET-000143', specimenCode: 'MC-200456', title: 'Bumblebee provenance record', scientificName: 'Bombus terrestris', commonName: 'Buff-tailed bumblebee', category: 'Insect', displayCategory: 'Hymenoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Hymenoptera > Apidae', locality: 'Yorkshire, United Kingdom', creator: 'Pollinator Survey Unit', date: '2023/05/13', assetType: 'Research Data', verificationStatus: 'Provenance complete', licenseType: 'Academic use', price: 34, rarity: 'R', scientificGrade: 'A', completionRate: 85, collection: 'Educational License Pack', views: 255, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000144', assetNumber: 'MC-ASSET-000144', specimenCode: 'MC-200457', title: 'Archive collection edition', scientificName: 'Ixorida venerea', commonName: 'Sulawesi flower chafer', category: 'Beetle', displayCategory: 'Coleoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Coleoptera > Scarabaeidae', locality: 'Sulawesi, Indonesia', creator: 'Island Biodiversity Archive', date: '2021/03/26', assetType: 'Collection Edition', verificationStatus: 'SAT graded', licenseType: 'Collector edition', price: 76, rarity: 'UR', scientificGrade: 'A+', completionRate: 93, collection: 'Beetle Archive', views: 501, thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000145', assetNumber: 'MC-ASSET-000145', specimenCode: 'MC-200458', title: 'Teaching fossil microplate', scientificName: 'Knightia eocaena', commonName: 'Fossil fish plate', category: 'Fossil', displayCategory: 'Fossil', taxonomy: 'Animalia > Chordata > Actinopterygii', locality: 'Wyoming, United States', country: 'United States', creator: 'Green River Teaching Set', date: '2018/07/19', assetType: 'Publication-Linked Content', verificationStatus: 'Curator verified', licenseType: 'Education use', price: 52, rarity: 'R', scientificGrade: 'B+', completionRate: 82, collection: 'Fossil Reference Plates', views: 288, publicationLinked: true, academicUse: true, descriptionShort: '\u6559\u5b78\u5716\u7248\u8207\u95dc\u806f\u8ad6\u6587\u9644\u5716\u96c6\u7d22\u5f15\uff0c\u9069\u5408\u8ab2\u5802\u8207\u5c55\u89bd\u3002', thumbnailUrl: '', imageUrl: '' }),
    asset({ id: 'SAT-MC-000146', assetNumber: 'MC-ASSET-000146', specimenCode: 'MC-200459', title: 'Field station conservation allocation', scientificName: 'Lucanidae sp.', commonName: 'Stag beetle reference lot', category: 'Beetle', displayCategory: 'Coleoptera', taxonomy: 'Animalia > Arthropoda > Insecta > Coleoptera > Lucanidae', locality: 'Mindanao, Philippines', country: 'Philippines', creator: 'Field Station Cooperative', date: '2024/01/10', assetType: 'Conservation-linked Asset', verificationStatus: 'Curator verified', licenseType: 'Academic use', price: 0, availability: 'Inquiry', inquiryOnly: true, rarity: 'SR', scientificGrade: 'A', completionRate: 88, collection: 'Beetle Archive', views: 140, conservationLinked: true, descriptionShort: '\u6536\u76ca\u5206\u914d\u652f\u6301\u68d2\u5730\u4fdd\u80b2\u8207\u6559\u5b78\u8ab2\u7a0b\uff1b\u8cc7\u7522\u70ba\u6388\u6b0a\u8207\u7d00\u9304\u5957\u7d44\u3002', thumbnailUrl: '', imageUrl: '' }),
  ];

  var COLLECTIONS = [
    { key: 'Beetle Archive', name: '\u7532\u87f2\u6a19\u672c\u5eab', nameEn: 'Beetle Archive', count: 0, category: 'COLEOPTERA', rate: '0%', purposeZh: '\u7814\u7a76 / \u5178\u85cf', imageUrl: '' },
    { key: 'Fossil Reference Plates', name: '\u5316\u77f3\u53c3\u8003\u5716\u7248', nameEn: 'Fossil Reference Plates', count: 0, category: 'FOSSIL', rate: '0%', purposeZh: '\u6559\u5b78 / \u5c55\u89bd', imageUrl: '' },
    { key: 'Botanical Scans', name: '\u690d\u7269\u6383\u63cf\u6536\u85cf', nameEn: 'Botanical Scans', count: 0, category: 'PLANT', rate: '0%', purposeZh: '\u6388\u6b0a / \u6559\u5b78', imageUrl: '' },
    { key: 'Marine Specimen Library', name: '\u6d77\u6d0b\u6a19\u672c\u5716\u66f8\u9928', nameEn: 'Marine Specimen Library', count: 0, category: 'MARINE', rate: '0%', purposeZh: '\u7814\u7a76 / \u4fdd\u80b2\u9023\u7d50', imageUrl: '' },
    { key: 'Educational License Pack', name: '\u6559\u5b78\u6388\u6b0a\u7d20\u6750\u5305', nameEn: 'Educational License Pack', count: 0, category: 'TEACHING', rate: '0%', purposeZh: '\u6559\u5b78 / \u5c55\u793a', imageUrl: '' },
  ];

  var TABS = [
    ['all', '\u5168\u90e8'],
    ['Specimen Image', '\u6a19\u672c\u5f71\u50cf'],
    ['Research Data', '\u7814\u7a76\u8cc7\u6599'],
    ['Usage License', '\u4f7f\u7528\u6388\u6b0a'],
    ['Collection Edition', '\u5178\u85cf\u7248\u672c'],
    ['Educational Pack', '\u6559\u5b78\u7d20\u6750'],
    ['Physical Specimen', '\u5be6\u9ad4\u6a19\u672c'],
    ['Publication-Linked Content', '\u8ad6\u6587\u76f8\u95dc'],
    ['Conservation-linked Asset', '\u4fdd\u80b2\u9023\u7d50'],
    ['verified', '\u5df2\u9a57\u8b49'],
    ['graded', 'SAT \u5b78\u8853\u5206\u7d1a'],
  ];

  var SORTS = [
    ['newest', '\u6700\u65b0\u4e0a\u67b6'],
    ['views', '\u6700\u53d7\u95dc\u6ce8'],
    ['grade', '\u8a55\u7d1a\u6700\u9ad8'],
    ['priceAsc', '\u50f9\u683c\u7531\u4f4e\u5230\u9ad8'],
    ['priceDesc', '\u50f9\u683c\u7531\u9ad8\u5230\u4f4e'],
  ];

  var FILTERS = [
    ['assetType', '\u8cc7\u7522\u985e\u578b', ['Specimen Image', 'Research Data', 'Usage License', 'Collection Edition', 'Educational Pack', 'Physical Specimen', 'Publication-Linked Content', 'Conservation-linked Asset']],
    ['category', '\u5206\u985e', ['Insect', 'Beetle', 'Shell', 'Seed', 'Fish', 'Plant', 'Fossil']],
    ['license', '\u6388\u6b0a\u689d\u4ef6', ['Display only', 'Academic use', 'Education use', 'Commercial use', 'Collector edition']],
    ['verification', '\u9a57\u8b49\u72c0\u614b', ['Curator verified', 'SAT graded', 'Provenance complete']],
    ['price', '\u50f9\u683c', ['Free', 'Under USD 25', 'USD 25-100', 'Inquiry']],
  ];

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escAttr(value) {
    return esc(value).replace(/'/g, '&#39;');
  }

  function lower(value) {
    return String(value || '').toLowerCase();
  }

  function gradeRank(value) {
    var v = String(value || '').toUpperCase();
    if (v === 'A+') return 5;
    if (v === 'A') return 4;
    if (v === 'B+') return 3;
    if (v === 'B') return 2;
    if (v === 'C') return 1;
    return 0;
  }

  function isVerified(asset) {
    return asset.verificationStatus === 'Curator verified' ||
      asset.verificationStatus === 'SAT graded' ||
      asset.verificationStatus === 'Provenance complete';
  }

  function applySpecimenUrlsToAssets() {
    ASSETS.forEach(function (a) {
      var u = null;
      if (typeof global.MCSAT_specimenUrlsForAsset === 'function') {
        u = global.MCSAT_specimenUrlsForAsset(a);
      }
      if (!u || !u.thumb) {
        var kind = typeof global.MCSAT_specimenVisualKind === 'function'
          ? global.MCSAT_specimenVisualKind(a.category, a.displayCategory, a.assetType, a.title)
          : 'neutral';
        u = specimenFallbackUrls(kind);
      }
      a.thumbnailUrl = u.thumb;
      a.imageUrl = u.detail;
      a._specimenVisualKind = u.kind;
    });
  }

  function refreshCollectionStats() {
    COLLECTIONS.forEach(function (c) {
      var items = ASSETS.filter(function (a) { return a.collection === c.key; });
      c.count = items.length;
      var v = 0;
      for (var i = 0; i < items.length; i++) if (isVerified(items[i])) v++;
      c.rate = items.length ? String(Math.round(100 * v / items.length)) + '%' : '0%';
      if (typeof global.MCSAT_specimenUrlsForCollectionKey === 'function') {
        var cu = global.MCSAT_specimenUrlsForCollectionKey(c.key);
        c.imageUrl = cu.thumb || cu.detail || c.imageUrl;
      }
    });
  }

  applySpecimenUrlsToAssets();
  refreshCollectionStats();

  function money(asset) {
    if (asset.inquiryOnly || asset.availability === 'Inquiry' || Number(asset.price) === 0) return '\u8a62\u50f9';
    return asset.currency + ' ' + Number(asset.price).toLocaleString();
  }

  function uiLabel(value) {
    return {
      'Specimen Image': '\u6a19\u672c\u5f71\u50cf',
      'Research Data': '\u7814\u7a76\u8cc7\u6599',
      'Usage License': '\u4f7f\u7528\u6388\u6b0a',
      'Collection Edition': '\u5178\u85cf\u7248\u672c',
      'Educational Pack': '\u6559\u5b78\u7d20\u6750',
      'Physical Specimen': '\u5be6\u9ad4\u6a19\u672c',
      'Publication-Linked Content': '\u8ad6\u6587\u76f8\u95dc\u5167\u5bb9',
      'Conservation-linked Asset': '\u4fdd\u80b2\u9023\u7d50\u9805\u76ee',
      'Curator verified': '\u7b56\u5c55\u5be9\u6838',
      'SAT graded': 'SAT \u5b78\u8853\u5206\u7d1a',
      'Provenance complete': '\u4f86\u6e90\u5b8c\u6574',
      'Academic use': '\u7814\u7a76\u7528\u9014',
      'Education use': '\u6559\u5b78\u7528\u9014',
      'Commercial use': '\u5546\u696d\u7528\u9014',
      'Collector edition': '\u5178\u85cf\u7248\u672c',
      'Display only': '\u50c5\u9650\u5c55\u793a',
      'Listed': '\u5df2\u4e0a\u67b6',
      'Inquiry': '\u8a62\u50f9',
      'Free': '\u514d\u8cbb',
      'Under USD 25': 'USD 25 \u4ee5\u4e0b',
      'USD 25-100': 'USD 25-100',
      'Insect': '\u6606\u87f2',
      'Beetle': '\u7532\u87f2',
      'Shell': '\u8c9d\u985e',
      'Seed': '\u7a2e\u5b50',
      'Fish': '\u9b5a\u985e',
      'Plant': '\u690d\u7269',
      'Fossil': '\u5316\u77f3',
    }[value] || value;
  }

  function verificationBadgeLabel(asset) {
    if (asset.verificationStatus === 'SAT graded') return 'SAT \u5b78\u8853\u5206\u7d1a';
    if (asset.verificationStatus === 'Curator verified') return '\u5be9\u6838';
    if (asset.verificationStatus === 'Provenance complete') return '\u4f86\u6e90';
    return uiLabel(asset.verificationStatus);
  }

  function assetOptionalChipsHtml(asset) {
    var chips = [];
    if (asset.museumArchive) chips.push('\u9928\u85cf\u6a94\u6848');
    if (asset.academicUse) chips.push('\u7814\u7a76\u5c31\u7dd2');
    if (asset.publicationLinked) chips.push('\u51fa\u7248\u652f\u63f4');
    if (asset.conservationLinked) chips.push('\u4fdd\u80b2\u9023\u7d50');
    if (asset.physicalSpecimenBinding) chips.push('\u5be6\u9ad4\u6a19\u672c\u7d81\u5b9a');
    if (asset.physicalSpecimen) chips.push('\u5be6\u9ad4\u6a19\u672c');
    if (asset.researchReady) chips.push('\u5143\u8cc7\u6599\u5c31\u7dd2');
    if (chips.length < 4 && asset.traceableRecord) chips.push('\u53ef\u8ffd\u6eaf');
    var out = '';
    for (var i = 0; i < Math.min(chips.length, 4); i++) {
      out += '<span class="sat-chip">' + esc(chips[i]) + '</span>';
    }
    return out ? '<div class="sat-card-chips">' + out + '</div>' : '';
  }

  function assetTypeLabel(value) {
    return uiLabel(value);
  }

  function matchesTab(asset, tabKey) {
    if (!tabKey || tabKey === 'all') return true;
    if (tabKey === 'verified') return isVerified(asset);
    if (tabKey === 'graded') return asset.verificationStatus === 'SAT graded';
    return asset.assetType === tabKey;
  }

  function tabPass(asset) {
    return matchesTab(asset, state.tab);
  }

  function filterPrice(asset, key) {
    if (key === 'Free') return Number(asset.price) === 0;
    if (key === 'Under USD 25') return Number(asset.price) > 0 && Number(asset.price) < 25;
    if (key === 'USD 25-100') return Number(asset.price) >= 25 && Number(asset.price) <= 100;
    if (key === 'Inquiry') return asset.availability === 'Inquiry';
    return true;
  }

  function groupPass(group, asset) {
    var selected = Object.keys(state.filters[group] || {}).filter(function (key) { return state.filters[group][key]; });
    if (!selected.length) return true;
    if (group === 'assetType') return selected.indexOf(asset.assetType) >= 0;
    if (group === 'category') {
      if (selected.indexOf(asset.category) >= 0) return true;
      if (selected.indexOf('Insect') >= 0 && (asset.category === 'Insect' || asset.category === 'Beetle')) return true;
      return false;
    }
    if (group === 'license') return selected.indexOf(asset.licenseType) >= 0 || selected.some(function (x) { return lower(asset.licenseType).indexOf(lower(x.replace(' use', ''))) >= 0; });
    if (group === 'verification') return selected.indexOf(asset.verificationStatus) >= 0;
    if (group === 'price') return selected.some(function (key) { return filterPrice(asset, key); });
    return true;
  }

  function filterPassWithTab(asset, tabKey) {
    if (state.watchOnly && !state.watch[asset.id]) return false;
    if (!matchesTab(asset, tabKey != null ? tabKey : state.tab)) return false;
    if (state.collection && asset.collection !== state.collection) return false;
    for (var i = 0; i < FILTERS.length; i++) {
      if (!groupPass(FILTERS[i][0], asset)) return false;
    }
    var q = lower(state.q);
    if (!q) return true;
    return lower([
      asset.id,
      asset.assetNumber,
      asset.specimenCode,
      asset.title,
      asset.scientificName,
      asset.commonName,
      asset.taxonomy,
      asset.locality,
      asset.creator,
      asset.licenseType,
      asset.category,
      asset.displayCategory,
      asset.assetType,
      asset.collection,
    ].join(' ')).indexOf(q) >= 0;
  }

  function filterPass(asset) {
    return filterPassWithTab(asset, state.tab);
  }

  function sorted(list) {
    var out = list.slice();
    if (state.sort === 'views') out.sort(function (a, b) { return Number(b.views) - Number(a.views); });
    else if (state.sort === 'grade') out.sort(function (a, b) { return gradeRank(b.scientificGrade) - gradeRank(a.scientificGrade); });
    else if (state.sort === 'priceAsc') out.sort(function (a, b) { return Number(a.price) - Number(b.price); });
    else if (state.sort === 'priceDesc') out.sort(function (a, b) { return Number(b.price) - Number(a.price); });
    else out.sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
    return out;
  }

  function filtered() {
    return sorted(ASSETS.filter(filterPass));
  }

  function findAsset(id) {
    for (var i = 0; i < ASSETS.length; i++) if (ASSETS[i].id === id) return ASSETS[i];
    return null;
  }

  function currentAssetFromHash() {
    try {
      var raw = String(global.location.hash || '').replace(/^#\/?/, '');
      if (raw.indexOf('marketplace/asset/') === 0) return decodeURIComponent(raw.split('marketplace/asset/')[1].split('/')[0] || '');
    } catch (e) {}
    return '';
  }

  function go(path) {
    try {
      global.location.hash = '#/' + String(path || '/marketplace').replace(/^\/+/, '');
    } catch (e) {}
    if (global.MCRouter && typeof global.MCRouter.render === 'function') global.MCRouter.render();
    else render();
  }

  function showToast(text) {
    state.toast = text;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      state.toast = '';
      syncToast();
    }, 1600);
    syncToast();
  }

  function syncToast() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var nodes = root.querySelectorAll('.sat-toast');
    nodes.forEach(function (node, index) {
      if (index > 0) node.remove();
    });
    var el = root.querySelector('.sat-toast');
    if (state.toast) {
      if (!el) {
        el = document.createElement('div');
        el.className = 'sat-toast';
        root.appendChild(el);
      }
      el.textContent = state.toast;
    } else if (el) {
      el.remove();
    }
  }

  function gradeClass(grade) {
    var g = String(grade || '').toUpperCase();
    if (g.indexOf('A+') >= 0 || g === 'A＋') return 'sat-grade-tier-aplus';
    if (g.charAt(0) === 'A') return 'sat-grade-tier-a';
    if (g.charAt(0) === 'B') return 'sat-grade-tier-b';
    return 'sat-grade-tier-c';
  }

  function catalogSpotlightHtml() {
    var a = findAsset('SAT-MC-000129') || ASSETS[0];
    if (!a) return '';
    return (
      '<article class="sat-catalog-spotlight sat-market-card" aria-label="\u7b56\u5c55\u7cbe\u9078\u8cc7\u7522">' +
      '<div class="sat-catalog-spotlight-media">' + mediaHtml(a, false, 'sat-catalog-image') + '</div>' +
      '<div class="sat-catalog-spotlight-body">' +
      '<span class="sat-catalog-label">\u7b56\u5c55\u7cbe\u9078</span>' +
      '<h2 class="sat-catalog-sciname">' + esc(a.scientificName) + '</h2>' +
      '<p class="sat-catalog-meta">' + esc(a.title) + ' · ' + esc(a.locality) + '</p>' +
      '<dl class="sat-catalog-facts">' +
      '<div><dt>\u6536\u85cf</dt><dd>' + esc(collectionLabel(a.collection)) + '</dd></div>' +
      '<div><dt>\u5b9a\u50f9</dt><dd>' + esc(money(a)) + '</dd></div>' +
      '<div><dt>\u5206\u7d1a</dt><dd><span class="sat-card-grade ' + gradeClass(a.scientificGrade) + '">' + esc(a.scientificGrade) + '</span></dd></div>' +
      '</dl>' +
      '<button type="button" class="sat-primary-action sat-catalog-cta" data-sat-drawer="' + escAttr(a.id) + '">\u67e5\u770b\u8cc7\u7522\u8a18\u9304</button>' +
      '</div></article>'
    );
  }

  function marketStatsHtml() {
    var verified = 0;
    var graded = 0;
    for (var i = 0; i < ASSETS.length; i++) {
      if (isVerified(ASSETS[i])) verified++;
      if (ASSETS[i].verificationStatus === 'SAT graded') graded++;
    }
    return (
      '<div class="sat-market-stats">' +
      '<div class="sat-stat"><strong>' + esc(ASSETS.length) + '</strong><span>\u53ef\u6d41\u901a\u8cc7\u7522</span></div>' +
      '<div class="sat-stat"><strong>' + esc(verified) + '</strong><span>\u5be9\u6838\u901a\u904e</span></div>' +
      '<div class="sat-stat"><strong>' + esc(COLLECTIONS.length) + '</strong><span>\u4e3b\u984c\u6536\u85cf</span></div>' +
      '<div class="sat-stat"><strong>' + esc(graded) + '</strong><span>SAT \u5206\u7d1a</span></div>' +
      '</div>'
    );
  }

  function clearFilters() {
    state.q = '';
    state.tab = 'all';
    state.collection = '';
    state.watchOnly = false;
    FILTERS.forEach(function (item) { state.filters[item[0]] = {}; });
    state.visible = INITIAL_VISIBLE;
    state.filterOpen = false;
  }

  function watchCount() {
    var n = 0;
    Object.keys(state.watch).forEach(function (k) { if (state.watch[k]) n++; });
    return n;
  }

  function activeFilterCount() {
    var n = 0;
    FILTERS.forEach(function (item) {
      Object.keys(state.filters[item[0]] || {}).forEach(function (key) {
        if (state.filters[item[0]][key]) n++;
      });
    });
    if (state.q) n++;
    if (state.collection) n++;
    if (state.watchOnly) n++;
    return n;
  }

  function countForTab(tabKey) {
    return ASSETS.filter(function (a) { return filterPassWithTab(a, tabKey); }).length;
  }

  function collectionLabel(key) {
    for (var i = 0; i < COLLECTIONS.length; i++) {
      if (COLLECTIONS[i].key === key) return COLLECTIONS[i].name;
    }
    return key;
  }

  function activeFilterChips() {
    var chips = [];
    if (state.q) chips.push({ kind: 'q', label: '\u641c\u5c0b\u300c' + state.q + '\u300d' });
    if (state.collection) chips.push({ kind: 'collection', label: collectionLabel(state.collection) });
    if (state.watchOnly) chips.push({ kind: 'watchOnly', label: '\u50c5\u8ffd\u8e64\u6e05\u55ae' });
    FILTERS.forEach(function (item) {
      var group = item[0];
      Object.keys(state.filters[group] || {}).forEach(function (key) {
        if (state.filters[group][key]) chips.push({ kind: 'filter', group: group, value: key, label: uiLabel(key) });
      });
    });
    return chips;
  }

  function activeFiltersBarHtml() {
    var chips = activeFilterChips();
    if (!chips.length) return '';
    return (
      '<div class="sat-active-filters" aria-label="\u5df2\u5957\u7528\u7be9\u9078">' +
      '<span class="sat-active-filters-label">\u5df2\u5957\u7528</span>' +
      chips.map(function (chip) {
        var attrs = ' data-sat-chip-remove="' + escAttr(chip.kind) + '"';
        if (chip.group) attrs += ' data-sat-chip-group="' + escAttr(chip.group) + '" data-sat-chip-value="' + escAttr(chip.value) + '"';
        return '<button type="button" class="sat-filter-chip"' + attrs + '>' + esc(chip.label) + '<span aria-hidden="true">\u00d7</span></button>';
      }).join('') +
      '<button type="button" class="sat-filter-chip sat-filter-chip--clear" data-sat-clear>\u5168\u90e8\u6e05\u9664</button>' +
      '</div>'
    );
  }

  function resultsMetaHtml(list) {
    var verified = 0;
    var inquiry = 0;
    for (var i = 0; i < list.length; i++) {
      if (isVerified(list[i])) verified++;
      if (list[i].inquiryOnly || list[i].availability === 'Inquiry') inquiry++;
    }
    return (
      '<div class="sat-results-meta">' +
      '<span class="sat-meta-pill sat-meta-pill--verified">' + verified + ' \u5df2\u9a57\u8b49</span>' +
      '<span class="sat-meta-pill">' + inquiry + ' \u8a62\u50f9</span>' +
      (watchCount() ? '<span class="sat-meta-pill sat-meta-pill--watch">' + watchCount() + ' \u8ffd\u8e64</span>' : '') +
      '</div>'
    );
  }

  function drawerNavHtml(list, currentId) {
    if (!list.length || !currentId) return '';
    var idx = -1;
    for (var i = 0; i < list.length; i++) if (list[i].id === currentId) { idx = i; break; }
    if (idx < 0) return '';
    var prev = idx > 0 ? list[idx - 1] : null;
    var next = idx < list.length - 1 ? list[idx + 1] : null;
    return (
      '<div class="sat-drawer-nav">' +
      '<button type="button" class="sat-drawer-nav-btn"' + (prev ? ' data-sat-drawer-nav="' + escAttr(prev.id) + '"' : ' disabled') + '>\u2190 ' + (prev ? esc(prev.id) : '\u7121\u4e0a\u4e00\u9805') + '</button>' +
      '<span>' + esc(idx + 1) + ' / ' + esc(list.length) + '</span>' +
      '<button type="button" class="sat-drawer-nav-btn"' + (next ? ' data-sat-drawer-nav="' + escAttr(next.id) + '"' : ' disabled') + '>' + (next ? esc(next.id) : '\u7121\u4e0b\u4e00\u9805') + ' \u2192</button>' +
      '</div>'
    );
  }

  function normalizeHeader() {
    try {
      var labels = {
        story: '\u6545\u4e8b',
        'card-generator': 'MCurator Passport Studio',
        workflow: '\u6d41\u7a0b',
        'online-exhibition': '\u7dda\u4e0a\u5c55\u89bd',
        'museum-collections': '\u7dda\u4e0a\u5c55\u89bd',
        marketplace: 'SAT \u5e02\u96c6',
        start: '\u958b\u59cb',
      };
      Object.keys(labels).forEach(function (key) {
        var selector = key === 'marketplace'
          ? '[data-global-header] [data-nav-key="marketplace"], [data-global-header] [data-route="/marketplace"]'
          : '[data-global-header] [data-nav-key="' + key + '"], [data-global-header] [data-route="/section/' + key + '"]';
        document.querySelectorAll(selector).forEach(function (node) { node.textContent = labels[key]; });
      });
      var lang = document.getElementById('mcGlobalLanguageSelect');
      if (lang && lang.options && lang.options.length) {
        lang.options[0].textContent = '\u6b63\u9ad4\u4e2d\u6587';
        lang.value = 'zh-TW';
      }
      document.querySelectorAll('[data-global-header] [data-action="login"]').forEach(function (node) { node.textContent = '\u767b\u5165'; });
    } catch (e) {}
  }

  function mediaHtml(asset, large, extraWrapClass) {
    var url = large ? asset.imageUrl : asset.thumbnailUrl;
    var fallback = specimenFallbackUrls(asset._specimenVisualKind || 'neutral').thumb;
    var baseCls = large ? 'sat-drawer-media' : 'sat-asset-media';
    var wrapCls = baseCls + ' sat-media-' + escAttr(asset.category).toLowerCase() + (extraWrapClass ? ' ' + extraWrapClass : '');
    return (
      '<div class="' + wrapCls + '" data-sat-media-frame data-sat-fallback-src="' + escAttr(fallback) + '">' +
      '<img loading="lazy" decoding="async" width="600" height="420" class="sat-asset-image" src="' + escAttr(url) + '" alt="' + escAttr(asset.scientificName || asset.title) + '" data-sat-img />' +
      '<div class="sat-asset-placeholder sat-placeholder-' + escAttr(asset.category).toLowerCase() + '" data-sat-placeholder hidden>' +
      '<span>' + esc(asset.displayCategory || asset.category) + '</span><strong>SAT</strong><em>\u6a19\u672c\u5f71\u50cf\u9810\u89bd\u66ab\u4e0d\u53ef\u7528</em>' +
      '</div>' +
      '<div class="sat-media-shade"></div>' +
      '</div>'
    );
  }

  function heroPreviewCard() {
    var a = findAsset('SAT-MC-000129') || ASSETS[1];
    var gradeBadge = esc(a.scientificGrade) + ' / ' + esc(a.rarity);
    var meta = esc(a.locality) + ' / ' + esc(uiLabel(a.licenseType));
    var valueStmt = '\u9023\u7d50\u5b78\u540d\u3001\u7522\u5730\u8207\u6388\u6b0a\u8981\u9ede\u7684\u53ef\u8ffd\u6eaf\u5178\u85cf\u8a18\u9304\uff1b\u9069\u5408\u6559\u5b78\u3001\u7814\u7a76\u5f15\u7528\u8207\u5c55\u89bd\u3002';
    return (
      '<article class="sat-hero-spotlight sat-market-card" aria-labelledby="satHeroSpotTitle">' +
      '<div class="sat-hero-spotlight-inner">' +
      '<div class="sat-hero-spotlight-frame">' +
      '<div class="sat-hero-spotlight-top">' +
      '<div class="sat-hero-spotlight-labels"><span class="sat-hero-label-tw">\u7cbe\u9078\u79d1\u5b78\u8cc7\u7522</span><span class="sat-hero-label-en" lang="en">Featured Scientific Asset</span></div>' +
      '<b class="sat-hero-grade-badge">' + gradeBadge + '</b></div>' +
      '<div class="sat-hero-image-stage">' + mediaHtml(a, false, 'sat-hero-media') + '</div></div>' +
      '<div class="sat-hero-spotlight-copy">' +
      '<p id="satHeroSpotTitle" class="sat-hero-sciname">' + esc(a.scientificName) + '</p>' +
      '<p class="sat-hero-meta">' + meta + '</p>' +
      '<p class="sat-hero-value">' + esc(valueStmt) + '</p>' +
      '<div class="sat-hero-spotlight-footer"><span class="sat-hero-satid">' + esc(a.id) + '</span>' +
      '<button type="button" class="sat-hero-cta" data-sat-drawer="' + escAttr(a.id) + '">\u67e5\u770b\u8cc7\u7522\u5167\u5bb9</button></div>' +
      '</div></div></article>'
    );
  }

  function collectionCard(col, index) {
    var active = state.collection === col.key;
    var img = col.imageUrl || specimenFallbackUrls('neutral').thumb;
    return (
      '<button type="button" class="sat-collection-card sat-collection-' + index + (active ? ' is-active' : '') + '" data-sat-collection="' + escAttr(col.key) + '">' +
      '<div class="sat-collection-thumb"><img class="sat-collection-image" src="' + escAttr(img) + '" alt="" loading="lazy" decoding="async" width="72" height="72" data-sat-collection-img /></div>' +
      '<div class="sat-collection-body">' +
      '<strong class="sat-collection-title">' + esc(col.name) + '</strong>' +
      '<p class="sat-collection-stats">' + esc(col.count) + ' \u9805\u8cc7\u7522</p>' +
      '<p class="sat-collection-purpose">' + esc(col.purposeZh || '') + '</p>' +
      '</div></button>'
    );
  }

  function commandBarHtml(listCount) {
    var fCount = activeFilterCount();
    var wCount = watchCount();
    return (
      '<section class="sat-command-bar" id="sat-command-bar" aria-label="SAT \u5e02\u96c6\u641c\u5c0b\u8207\u7be9\u9078">' +
      '<div class="sat-command-top">' +
      '<label class="sat-search"><span>\u641c\u5c0b\u8cc7\u7522</span><input type="search" data-sat-search aria-label="\u641c\u5c0b SAT \u8cc7\u7522" value="' + escAttr(state.q) + '" placeholder="\u5b78\u540d\u3001SAT ID\u3001\u7522\u5730\u3001\u6388\u6b0a\u985e\u578b\u2026" />' +
      (state.q ? '<button type="button" class="sat-search-clear" data-sat-search-clear aria-label="\u6e05\u9664\u641c\u5c0b">\u00d7</button>' : '') +
      '</label>' +
      '<div class="sat-command-tools">' +
      '<label class="sat-sort"><span>\u6392\u5e8f</span><select data-sat-sort aria-label="\u8cc7\u7522\u6392\u5e8f">' +
      SORTS.map(function (sort) { return '<option value="' + escAttr(sort[0]) + '"' + (state.sort === sort[0] ? ' selected' : '') + '>' + esc(sort[1]) + '</option>'; }).join('') +
      '</select></label>' +
      '<div class="sat-view-toggle" role="group" aria-label="\u986f\u793a\u6a21\u5f0f">' +
      '<button type="button" class="' + (state.view === 'grid' ? 'is-active' : '') + '" data-sat-view="grid">\u5361\u7247</button>' +
      '<button type="button" class="' + (state.view === 'compact' ? 'is-active' : '') + '" data-sat-view="compact">\u7dca\u6e4a</button>' +
      '<button type="button" class="' + (state.view === 'list' ? 'is-active' : '') + '" data-sat-view="list">\u5217\u8868</button>' +
      '</div>' +
      '<button type="button" class="sat-watch-toggle' + (state.watchOnly ? ' is-active' : '') + (wCount ? '' : ' is-empty') + '" data-sat-watch-only aria-pressed="' + (state.watchOnly ? 'true' : 'false') + '"' + (wCount ? '' : ' title="\u5148\u5728\u5361\u7247\u4e0a\u9ede\u9078 \u2606 \u52a0\u5165\u8ffd\u8e64"') + '>\u8ffd\u8e64' + (wCount ? ' (' + wCount + ')' : '') + '</button>' +
      '<button type="button" class="sat-filter-mobile" data-sat-filter-open>\u7be9\u9078' + (fCount ? ' <b>' + fCount + '</b>' : '') + '</button>' +
      '<strong class="sat-result-count">' + esc(listCount) + ' \u9805</strong>' +
      '</div></div>' +
      activeFiltersBarHtml() +
      '<div class="sat-quick-tabs" role="group" aria-label="\u5feb\u901f\u7be9\u9078">' +
      TABS.map(function (tab) {
        return '<button type="button" class="' + (state.tab === tab[0] ? 'is-active' : '') + '" data-sat-tab="' + escAttr(tab[0]) + '">' + esc(tab[1]) + '<em class="sat-tab-count">' + countForTab(tab[0]) + '</em></button>';
      }).join('') +
      '</div></section>'
    );
  }

  function filterGroupHtml(group, title, options) {
    var selected = state.filters[group] || {};
    return (
      '<fieldset class="sat-filter-group"><legend>' + esc(title) + '</legend>' +
      options.map(function (option) {
        var on = !!selected[option];
        return '<label class="sat-filter-pill' + (on ? ' is-active' : '') + '"><input type="checkbox" data-sat-filter-group="' + escAttr(group) + '" value="' + escAttr(option) + '"' + (on ? ' checked' : '') + ' /><span>' + esc(uiLabel(option)) + '</span></label>';
      }).join('') + '</fieldset>'
    );
  }

  function filterPanelHtml(drawer) {
    return (
      '<aside class="sat-filter-panel sat-market-card' + (drawer ? ' sat-filter-panel-drawer' : '') + '"' + (drawer ? '' : ' id="sat-filter-panel-block"') + '>' +
      '<div class="sat-filter-head"><div><span>\u7cbe\u6e96\u7be9\u9078</span><strong>\u79d1\u5b78\u8cc7\u7522</strong></div>' +
      '<div class="sat-filter-head-actions">' +
      (activeFilterCount() ? '<em class="sat-filter-count">' + activeFilterCount() + '</em>' : '') +
      (drawer ? '<button type="button" data-sat-filter-close aria-label="\u95dc\u9589\u7be9\u9078">\u00d7</button>' : '') +
      '</div></div>' +
      FILTERS.map(function (item) { return filterGroupHtml(item[0], item[1], item[2]); }).join('') +
      '<button type="button" class="sat-clear-filters' + (activeFilterCount() ? ' is-active' : '') + '" data-sat-clear>\u6e05\u9664\u7be9\u9078</button>' +
      '</aside>'
    );
  }

  function assetCardHtml(asset) {
    var watched = !!state.watch[asset.id];
    return (
      '<article class="sat-asset-card' + (watched ? ' is-saved' : '') + '" data-sat-card="' + escAttr(asset.id) + '" tabindex="0">' +
      '<div class="sat-card-media-wrap">' + mediaHtml(asset, false) +
      '<button type="button" class="sat-save-button' + (watched ? ' is-active' : '') + '" data-sat-watch="' + escAttr(asset.id) + '" aria-label="\u8ffd\u8e64\u8cc7\u7522">' + (watched ? '\u2605' : '\u2606') + '</button>' +
      '<div class="sat-card-floating"><span class="sat-verify-badge">' + esc(verificationBadgeLabel(asset)) + '</span></div>' +
      '</div>' +
      '<div class="sat-card-content">' +
      '<p class="sat-card-collection">' + esc(collectionLabel(asset.collection)) + '</p>' +
      '<h3>' + esc(asset.title) + '</h3>' +
      '<p class="sat-scientific">' + esc(asset.scientificName) + '</p>' +
      '<div class="sat-card-commerce">' +
      '<div class="sat-price-block"><span class="sat-price-label">\u5b9a\u50f9</span><strong class="sat-price">' + esc(money(asset)) + '</strong></div>' +
      '<span class="sat-card-grade ' + gradeClass(asset.scientificGrade) + '">' + esc(asset.scientificGrade) + '</span>' +
      '</div></div></article>'
    );
  }

  function assetListRowHtml(asset) {
    var watched = !!state.watch[asset.id];
    var url = asset.thumbnailUrl;
    var fallback = specimenFallbackUrls(asset._specimenVisualKind || 'neutral').thumb;
    return (
      '<article class="sat-asset-row' + (watched ? ' is-saved' : '') + '" data-sat-card="' + escAttr(asset.id) + '" tabindex="0">' +
      '<div class="sat-row-thumb" data-sat-media-frame data-sat-fallback-src="' + escAttr(fallback) + '"><img loading="lazy" decoding="async" src="' + escAttr(url) + '" alt="" data-sat-img /></div>' +
      '<div class="sat-row-main"><strong>' + esc(asset.title) + '</strong><em>' + esc(asset.scientificName) + '</em><span>' + esc(asset.locality) + '</span></div>' +
      '<div class="sat-row-meta"><span class="sat-badge">' + esc(assetTypeLabel(asset.assetType)) + '</span><span>' + esc(uiLabel(asset.verificationStatus)) + '</span></div>' +
      '<div class="sat-row-grade"><strong>' + esc(asset.scientificGrade) + '</strong><span>' + esc(asset.completionRate) + '%</span></div>' +
      '<div class="sat-row-price"><strong>' + esc(money(asset)) + '</strong><span class="sat-card-satid">' + esc(asset.id) + '</span></div>' +
      '<div class="sat-row-actions">' +
      '<button type="button" class="sat-save-button' + (watched ? ' is-active' : '') + '" data-sat-watch="' + escAttr(asset.id) + '" aria-label="\u8ffd\u8e64">' + (watched ? '\u2605' : '\u2606') + '</button>' +
      '<button type="button" class="sat-detail-button" data-sat-drawer="' + escAttr(asset.id) + '">\u8a73\u60c5</button>' +
      '</div></article>'
    );
  }

  function assetsGridHtml(list, view) {
    if (!list.length) return emptyHtml();
    if (view === 'list') return list.map(assetListRowHtml).join('');
    return list.map(assetCardHtml).join('');
  }

  function emptyHtml() {
    var hint = state.watchOnly
      ? '\u5c1a\u672a\u8ffd\u8e64\u4efb\u4f55\u8cc7\u7522\uff1b\u5728\u5361\u7247\u4e0a\u9ede\u9078 \u2606 \u5373\u53ef\u52a0\u5165\u6e05\u55ae\u3002'
      : state.q
        ? '\u8acb\u5617\u8a66\u5176\u4ed6\u95dc\u9375\u5b57\u6216\u6e05\u9664\u7be9\u9078\u689d\u4ef6\u3002'
        : '\u8acb\u8abf\u6574\u641c\u5c0b\u5b57\u8a5e\u3001\u5206\u985e\u6216\u6388\u6b0a\u689d\u4ef6\u3002';
    return (
      '<div class="sat-empty-state sat-market-card">' +
      '<span>SAT</span><strong>\u627e\u4e0d\u5230\u7b26\u5408\u689d\u4ef6\u7684\u79d1\u5b78\u8cc7\u7522</strong>' +
      '<p>' + esc(hint) + '</p>' +
      '<button type="button" class="sat-primary-action" data-sat-clear>\u6e05\u9664\u7be9\u9078</button>' +
      '</div>'
    );
  }

  function drawerHtml(asset, list) {
    if (!asset) return '';
    var watched = !!state.watch[asset.id];
    list = list || filtered();
    return (
      '<div class="sat-drawer-backdrop" data-sat-close-drawer></div>' +
      '<aside class="sat-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="satDrawerTitle">' +
      '<div class="sat-drawer-head"><div><span>\u8cc7\u7522\u8a73\u60c5</span><strong>' + esc(asset.id) + '</strong></div>' +
      '<div class="sat-drawer-head-actions"><button type="button" class="sat-drawer-copy" data-sat-copy-id="' + escAttr(asset.id) + '" aria-label="\u8907\u88fd SAT ID">\u8907\u88fd ID</button>' +
      '<button type="button" class="sat-drawer-close" data-sat-close-drawer aria-label="\u95dc\u9589\u8a73\u60c5">\u00d7</button></div></div>' +
      drawerNavHtml(list, asset.id) +
      '<div class="sat-drawer-body">' +
      mediaHtml(asset, true) +
      '<div class="sat-drawer-title-row"><div><h2 id="satDrawerTitle">' + esc(asset.title) + '</h2><p class="sat-drawer-sciname">' + esc(asset.scientificName) + '</p></div><strong class="sat-drawer-price">' + esc(money(asset)) + '</strong></div>' +
      (asset.descriptionShort ? '<p class="sat-drawer-lead">' + esc(asset.descriptionShort) + '</p>' : '') +
      '<div class="sat-drawer-cta"><button type="button" class="sat-primary-action" data-sat-license="' + escAttr(asset.id) + '">\u7533\u8acb\u6388\u6b0a</button><button type="button" data-sat-contact="' + escAttr(asset.id) + '">\u806f\u7d61\u63d0\u4f9b\u8005</button><button type="button" class="' + (watched ? 'is-active' : '') + '" data-sat-watch="' + escAttr(asset.id) + '">' + (watched ? '\u5df2\u8ffd\u8e64' : '\u8ffd\u8e64') + '</button></div>' +
      '<section class="sat-drawer-section"><h3>\u8cc7\u7522\u985e\u578b\u8207\u7528\u9014</h3><p class="sat-drawer-type-line"><strong>' + esc(assetTypeLabel(asset.assetType)) + '</strong> \u00b7 ' + esc(uiLabel(asset.licenseType)) + '</p>' + assetOptionalChipsHtml(asset) + '</section>' +
      '<section class="sat-drawer-section"><h3>\u8cc7\u7522\u8cc7\u8a0a</h3><dl class="sat-info-list">' +
      '<div><dt>SAT ID</dt><dd>' + esc(asset.id) + '</dd></div><div><dt>\u5206\u985e</dt><dd>' + esc(asset.displayCategory) + '</dd></div><div><dt>\u7522\u5730</dt><dd>' + esc(asset.locality) + '</dd></div><div><dt>\u65e5\u671f</dt><dd>' + esc(asset.date) + '</dd></div><div><dt>\u5efa\u6a94\u8005</dt><dd>' + esc(asset.creator) + '</dd></div><div><dt>\u6a19\u672c\u7de8\u865f</dt><dd>' + esc(asset.specimenCode) + '</dd></div><div><dt>\u6536\u85cf</dt><dd>' + esc(asset.collection) + '</dd></div>' +
      '</dl></section>' +
      (asset.physicalSpecimenBinding ? '<section class="sat-drawer-section sat-drawer-alert"><h3>\u5be6\u9ad4\u6a19\u672c\u7d81\u5b9a\u8207\u4ea4\u6613</h3><p>\u6b64\u985e\u76ee\u8072\u660e\u6578\u4f4d\u8cc7\u7522\u8207\u9928\u85cf\u5be6\u9ad4\u6a19\u672c\u9023\u52d5\u3002\u65bc SAT \u5e02\u96c6\u8cb7\u8ce3\u5354\u5546\u6642\uff0c\u8cb7\u5bb6\u5f97\u5019\u672c\u5e73\u53f0\u898f\u5247\u8207\u8ce3\u65b9\u5354\u5546\u662f\u5426\u4e00\u4f75\u4ea4\u4ed8\u5be6\u9ad4\u6a19\u672c\uff1b\u904b\u9001\u3001\u8a31\u53ef\u8b49\u3001\u5132\u5b58\u8207\u6cd5\u898f\u5408\u610f\u9808\u53e6\u6848\u7d04\u5b9a\uff0c\u4e0d\u56e0\u6578\u4f4d\u6388\u6b0a\u800c\u7576\u7136\u5305\u542b\u7269\u6d41\u3002</p></section>' : '') +
      (asset.physicalSpecimen ? '<section class="sat-drawer-section sat-drawer-alert"><h3>\u5be6\u9ad4\u6a19\u672c\u8207\u6cd5\u898f</h3><p>\u5be6\u9ad4\u904b\u9001\u3001\u5132\u5b58\u8207\u8de8\u5883\u8def\u7dda\u53d7\u6cd5\u898f\u8207\u9928\u969b\u5354\u8b70\u7d04\u675f\u3002\u8a62\u50f9\u5f8c\u7531\u5be9\u6838\u5718\u968a\u63d0\u4f9b\u9650\u5236\u6e05\u55ae\u3002</p></section>' : '') +
      '<section class="sat-drawer-section"><h3>\u6388\u6b0a\u6b0a\u5229\u6458\u8981</h3><p>' + esc(asset.rights) + '</p></section>' +
      '<section class="sat-grade-block"><div><span>SAT \u5b78\u8853\u5206\u7d1a</span><strong>' + esc(asset.scientificGrade) + ' / ' + esc(asset.rarity) + '</strong></div><i><b style="width:' + escAttr(asset.completionRate) + '%"></b></i><p>Metadata \u5b8c\u6574\u5ea6 ' + esc(asset.completionRate) + '% / ' + esc(uiLabel(asset.verificationStatus)) + '</p></section>' +
      '<section class="sat-provenance-block"><h3>\u4f86\u6e90\u8207\u5be9\u67e5</h3><div><b></b><strong>\u7d00\u9304\u5efa\u7acb</strong><span>' + esc(asset.date) + ' / ' + esc(asset.creator) + '</span></div><div><b></b><strong>\u5be9\u67e5\u72c0\u614b</strong><span>' + esc(uiLabel(asset.verificationStatus)) + '</span></div><div><b></b><strong>\u6388\u6b0a\u7bc4\u7587</strong><span>' + esc(uiLabel(asset.licenseType)) + '</span></div></section>' +
      '<section class="sat-drawer-section"><h3>\u7d50\u7b97\u8207\u652f\u4ed8</h3><p>' + esc(asset.paymentMethods) + '</p></section>' +
      '</div></aside>'
    );
  }

  function renderHtml() {
    var list = filtered();
    var visible = list.slice(0, state.visible);
    var activeAsset = state.drawerId ? findAsset(state.drawerId) : null;
    return (
      (activeAsset ? drawerHtml(activeAsset, list) : '') +
      (state.filterOpen ? '<div class="sat-filter-backdrop" data-sat-filter-close></div>' + filterPanelHtml(true) : '') +
      (state.toast ? '<div class="sat-toast">' + esc(state.toast) + '</div>' : '') +
      '<main class="sat-public-marketplace">' +
      '<div class="sat-marketplace-shell">' +
      '<section class="sat-os-hero">' +
      '<div class="sat-os-hero-grid">' +
      '<div class="sat-os-hero-main">' +
      '<span class="sat-market-kicker">\u53ef\u8ffd\u6eaf\u6a19\u672c\u8207\u6388\u6b0a\u5e02\u96c6</span>' +
      '<h1 class="sat-market-title">SAT \u79d1\u5b78\u8cc7\u7522\u5e02\u96c6</h1>' +
      '<p class="sat-market-lead">\u63a2\u7d22\u53ef\u6838\u5c0d\u3001\u53ef\u5f15\u7528\u7684\u6a19\u672c\u5f71\u50cf\u3001\u7814\u7a76\u8cc7\u6599\u8207\u4f7f\u7528\u6388\u6b0a\u3002\u4ee5\u5c55\u89bd\u76ee\u9304\u7684\u65b9\u5f0f\u700f\u89bd\u3001\u7be9\u9078\u8207\u8ffd\u8e64\u3002</p>' +
      marketStatsHtml() +
      '<div class="sat-market-actions">' +
      '<button type="button" class="sat-primary-action" data-route="/dashboard/marketplace/new">\u4e0a\u67b6\u8cc7\u7522</button>' +
      '<button type="button" class="sat-btn-ghost" data-sat-jump="collections">\u700f\u89bd\u6536\u85cf</button>' +
      '</div></div>' +
      catalogSpotlightHtml() +
      '</div></section>' +
      '<section class="sat-collections-rail" id="sat-collections-block"><div class="sat-section-title"><div class="sat-section-title-text"><span>\u6536\u85cf\u5957\u4ef6</span><p>\u6309\u4e3b\u984c\u700f\u89bd\u53ef\u4ea4\u6613\u7684\u79d1\u5b78\u8cc7\u7522\u96c6</p></div><button type="button" class="sat-section-clear' + (state.collection ? ' is-active' : '') + '" data-sat-collection="">' + (state.collection ? '\u6e05\u9664' : '\u5168\u90e8') + '</button></div><div class="sat-collection-scroll"><div class="sat-collection-row">' + COLLECTIONS.map(collectionCard).join('') + '</div></div></section>' +
      commandBarHtml(list.length) +
      '<section class="sat-market-layout">' +
      filterPanelHtml(false) +
      '<div class="sat-market-results"><div class="sat-results-head"><div class="sat-results-head-left"><div class="sat-results-head-main"><strong>' + esc(list.length) + '</strong><span>\u9805\u8cc7\u7522</span></div>' + resultsMetaHtml(list) + '</div></div>' +
      (state.view === 'list' ? '<div class="sat-list-head" aria-hidden="true"><span></span><span>\u8cc7\u7522</span><span>\u985e\u578b</span><span>\u5206\u7d1a</span><span>\u50f9\u683c</span><span>\u64cd\u4f5c</span></div>' : '') +
      '<div id="sat-market-grid" class="sat-asset-grid sat-view-' + escAttr(state.view) + '">' + assetsGridHtml(visible, state.view) + '</div><div class="sat-load-row">' + (list.length > state.visible ? '<button type="button" data-sat-more>\u8f09\u5165\u66f4\u591a\uFF08' + esc(list.length - state.visible) + '\uFF09</button>' : '<span>\u5df2\u986f\u793a\u6240\u6709\u79d1\u5b78\u8cc7\u7522</span>') + '</div></div>' +
      '</section>' +
      '</div></main>'
    );
  }

  function ensureStyles() {
    var existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      'html.mc-sat-market-active #welcomeShell,html.mc-sat-market-active .welcome-shell,html.mc-sat-market-active .lp-shell,html.mc-sat-market-active .landing-shell,html.mc-sat-market-active #mcWelcomeHero,html.mc-sat-market-active .mc-welcome-hero,html.mc-sat-market-active #mcEntryModal,html.mc-sat-market-active [data-mc-public-landing]:not(#mcSatV2MarketplaceRoot){display:none!important;visibility:hidden!important;pointer-events:none!important;position:absolute!important;width:0!important;height:0!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;padding:0!important;margin:0!important}html.mc-sat-market-active{background:#121816!important}#mcSatV2MarketplaceRoot.sat-v2-marketplace{--sat-bg:#121816;--sat-surface:#1a221e;--sat-surface-2:#222b27;--sat-line:rgba(255,255,255,.09);--sat-text:#ebe9e3;--sat-muted:rgba(235,233,227,.56);--sat-accent:#7ea892;--sat-accent-hover:#6a917f;--sat-accent-soft:#a8c4b8;--sat-warm:#c9bc98;--sat-warm-soft:#ddd5c0;--sat-media-bg:#e8e4dc;--sat-paper:var(--sat-warm);--sat-paper-light:var(--sat-warm-soft);--sat-sage:var(--sat-accent);--sat-sage-light:var(--sat-accent-soft);--sat-ink:#121816;position:fixed;inset:0;z-index:12000;overflow:auto;-webkit-overflow-scrolling:touch;background:var(--sat-bg);color:var(--sat-text);font-family:"Inter","Noto Sans TC",system-ui,sans-serif;contain:layout paint style;isolation:isolate}#mcSatV2MarketplaceRoot.sat-has-drawer,#mcSatV2MarketplaceRoot.sat-has-filter{overflow:hidden}',
      '.sat-public-marketplace{position:relative;min-height:100vh;color:var(--sat-text);background:var(--sat-bg)}.sat-public-marketplace:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(820px 420px at 10% -8%,rgba(126,168,146,.08),transparent 55%),radial-gradient(640px 360px at 90% 0%,rgba(201,188,152,.05),transparent 50%)}.sat-marketplace-shell{position:relative;z-index:1;width:min(1320px,calc(100vw - 48px));margin:0 auto;padding:calc(var(--mc-global-header-height,88px) + 28px) 0 88px}',
      '.sat-market-card{border-radius:14px;background:var(--sat-surface);border:1px solid var(--sat-line);box-shadow:0 1px 0 rgba(255,255,255,.03)}',
      '.sat-os-hero{margin:0 0 30px;padding-bottom:26px;border-bottom:1px solid var(--sat-line)}.sat-os-hero-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(300px,.92fr);gap:22px;align-items:stretch}.sat-os-hero-main{display:flex;flex-direction:column;gap:0;min-width:0}.sat-market-kicker{display:inline-block;width:fit-content;margin:0 0 14px;padding:0;color:var(--sat-accent-soft);font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}.sat-market-kicker:before{display:none}.sat-market-title{margin:0 0 12px;font-family:"Noto Serif TC",Georgia,serif;font-size:clamp(30px,3.6vw,42px);font-weight:600;line-height:1.12;letter-spacing:-.02em;color:var(--sat-text)}.sat-market-lead{margin:0 0 16px;max-width:52ch;color:var(--sat-muted);font-size:15px;line-height:1.7;font-weight:400}',
      '.sat-market-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:16px}.sat-primary-action,.sat-trust-license button,.sat-empty-state .sat-primary-action{border:1px solid rgba(255,255,255,.1);background:var(--sat-accent);color:#101412;min-height:42px;border-radius:10px;padding:0 20px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:none;transition:background .15s ease,border-color .15s ease}.sat-primary-action:hover,.sat-trust-license button:hover,.sat-empty-state .sat-primary-action:hover{background:var(--sat-accent-hover);border-color:transparent}.sat-btn-ghost,.sat-market-actions .sat-btn-ghost{border:1px solid var(--sat-line);background:transparent;color:var(--sat-muted);min-height:42px;border-radius:10px;padding:0 18px;font-size:14px;font-weight:500;cursor:pointer;transition:border-color .15s ease,color .15s ease,background .15s ease}.sat-btn-ghost:hover{border-color:rgba(255,255,255,.16);color:var(--sat-text);background:rgba(255,255,255,.03)}',
      '.sat-market-stats{display:flex;flex-wrap:wrap;gap:0;margin:0 0 4px;padding:14px 0;border-top:1px solid var(--sat-line);border-bottom:1px solid var(--sat-line)}.sat-stat{position:relative;flex:1 1 120px;padding:0 18px 0 0;margin-right:18px;border-right:1px solid var(--sat-line)}.sat-stat:last-child{border-right:0;margin-right:0;padding-right:0}.sat-stat strong{display:block;color:var(--sat-warm-soft);font-family:"Noto Serif TC",Georgia,serif;font-size:24px;font-weight:500;line-height:1.05;margin-bottom:4px;letter-spacing:-.02em}.sat-stat span{display:block;color:var(--sat-muted);font-size:11px;line-height:1.35;letter-spacing:.04em}',
      '.sat-catalog-spotlight{display:grid;grid-template-columns:minmax(120px,38%) minmax(0,1fr);gap:16px;align-items:stretch;padding:14px;overflow:hidden}.sat-catalog-spotlight-media{position:relative;border-radius:10px;overflow:hidden;background:var(--sat-media-bg);border:1px solid rgba(0,0,0,.06);min-height:180px}.sat-catalog-image.sat-asset-media{position:absolute;inset:0;height:100%}.sat-catalog-spotlight-body{display:flex;flex-direction:column;gap:8px;min-width:0;padding:2px 0}.sat-catalog-label{font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--sat-accent-soft)}.sat-catalog-sciname{margin:0;font-family:"Noto Serif TC",Georgia,serif;font-size:clamp(18px,2vw,22px);font-weight:500;font-style:italic;line-height:1.25;color:var(--sat-text)}.sat-catalog-meta{margin:0;font-size:12px;color:var(--sat-muted);line-height:1.5}.sat-catalog-facts{display:grid;gap:6px;margin:4px 0 0;padding:0}.sat-catalog-facts div{display:grid;grid-template-columns:52px 1fr;gap:8px;align-items:center}.sat-catalog-facts dt{margin:0;font-size:10px;color:var(--sat-muted);letter-spacing:.06em}.sat-catalog-facts dd{margin:0;font-size:12px;color:var(--sat-text)}.sat-catalog-cta{align-self:flex-start;margin-top:auto;min-height:36px;padding:0 14px;font-size:13px;color:#101412}',
      '.sat-collections-rail{margin:0 0 28px}.sat-section-title{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:14px}.sat-section-title-text span{font-size:18px;font-weight:600;color:var(--sat-text);letter-spacing:.02em}.sat-section-title-text p{margin:4px 0 0;color:var(--sat-muted);font-size:13px;font-weight:400}.sat-section-title-text span:before{display:none}.sat-section-title button{background:transparent;border:0;color:var(--sat-accent-soft);font-size:13px;font-weight:500;cursor:pointer;padding:0;border-bottom:1px solid transparent}.sat-section-clear.is-active{color:var(--sat-warm-soft);border-bottom-color:rgba(201,188,152,.35)}.sat-section-title button:hover{border-bottom-color:var(--sat-line)}.sat-collection-scroll{position:relative;margin:0 -2px;padding:0 2px}.sat-collection-scroll:before,.sat-collection-scroll:after{display:none}.sat-collection-row{display:flex;gap:10px;overflow-x:auto;padding:2px 0 8px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}.sat-collection-card{position:relative;flex:0 0 auto;display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px;min-width:min(280px,78vw);padding:10px;text-align:left;border-radius:12px;border:1px solid var(--sat-line);background:var(--sat-surface);color:var(--sat-text);cursor:pointer;transition:border-color .15s ease,background .15s ease}.sat-collection-card:hover{border-color:rgba(255,255,255,.14);background:var(--sat-surface-2)}.sat-collection-card.is-active{border-color:rgba(126,168,146,.35);background:rgba(126,168,146,.06)}.sat-collection-thumb{width:72px;height:72px;border-radius:10px;overflow:hidden;flex-shrink:0;background:var(--sat-media-bg);border:1px solid rgba(0,0,0,.08)}.sat-collection-image{position:static;width:100%;height:100%;object-fit:cover;opacity:1;filter:none;transform:none}.sat-collection-overlay,.sat-collection-art{display:none}.sat-collection-body{position:static;z-index:auto;padding:2px 0;display:flex;flex-direction:column;gap:2px;min-width:0}.sat-collection-title{margin:0;font-size:14px;line-height:1.3;color:var(--sat-text);font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.sat-collection-stats{margin:0;font-size:11px;color:var(--sat-muted);line-height:1.3}.sat-collection-purpose{margin:0;font-size:11px;color:var(--sat-accent-soft);line-height:1.3}.sat-collection-sub{display:none}',
      '.sat-command-bar{display:flex;flex-direction:column;gap:12px;margin:0 0 22px;padding:0;position:sticky;top:calc(var(--mc-global-header-height,88px) + 6px);z-index:15;background:linear-gradient(180deg,var(--sat-bg) 70%,rgba(18,24,22,0));border:none;box-shadow:none}.sat-command-top{display:grid;grid-template-columns:minmax(280px,1fr) auto;gap:12px;align-items:center;padding:12px 14px;border:1px solid var(--sat-line);border-radius:12px;background:var(--sat-surface)}.sat-command-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sat-search{display:block;position:relative;width:100%}.sat-search span,.sat-sort span{display:none}.sat-search input,.sat-sort select{min-height:44px;border-radius:10px;border:1px solid var(--sat-line);background:var(--sat-bg);color:var(--sat-text);font:inherit;font-size:14px;outline:none;transition:border-color .15s ease}.sat-search input{width:100%;padding:0 40px 0 42px}.sat-search input:focus,.sat-sort select:focus{border-color:rgba(126,168,146,.45)}.sat-sort select{padding:0 12px;min-width:128px}.sat-search:before{content:"";position:absolute;left:13px;top:50%;transform:translateY(-50%);width:16px;height:16px;opacity:.45;pointer-events:none;background:center/contain no-repeat url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23a8c4b8%27 stroke-width=%272%27%3E%3Ccircle cx=%2711%27 cy=%2711%27 r=%276.5%27/%3E%3Cpath stroke-linecap=%27round%27 d=%27M16.5 16.5L20 20%27/%3E%3C/svg%3E")}.sat-quick-tabs{display:flex;flex-wrap:wrap;gap:8px;padding:0}.sat-quick-tabs button{flex:0 0 auto;min-height:34px;border-radius:999px;border:1px solid var(--sat-line);background:transparent;color:var(--sat-muted);padding:0 12px;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s ease,color .15s ease,border-color .15s ease}.sat-quick-tabs button:hover{color:var(--sat-text);border-color:rgba(255,255,255,.14)}.sat-quick-tabs button.is-active{color:var(--sat-text);border-color:rgba(126,168,146,.35);background:rgba(126,168,146,.1)}.sat-view-toggle{display:flex;border:1px solid var(--sat-line);border-radius:10px;padding:2px;background:var(--sat-bg)}.sat-view-toggle button{border:0;background:transparent;color:var(--sat-muted);border-radius:8px;padding:8px 10px;font-size:12px;font-weight:500;cursor:pointer;transition:background .12s ease,color .12s ease}.sat-view-toggle button.is-active{background:rgba(255,255,255,.06);color:var(--sat-text)}.sat-filter-mobile{display:none;min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--sat-line);background:var(--sat-bg);color:var(--sat-text);font-weight:600;cursor:pointer}.sat-result-count{color:var(--sat-muted);font-size:13px;font-weight:500;white-space:nowrap}',
      '.sat-market-layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:20px}.sat-filter-panel{position:sticky;top:calc(var(--mc-global-header-height,88px) + 72px);align-self:start;padding:14px;background:var(--sat-surface);border:1px solid var(--sat-line);border-radius:12px}.sat-filter-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--sat-line)}.sat-filter-head-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}.sat-filter-head span{display:block;color:var(--sat-muted);font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-weight:600}.sat-filter-head strong{font-size:15px;color:var(--sat-text);font-weight:600}.sat-filter-head button{width:32px;height:32px;border-radius:8px;border:1px solid var(--sat-line);background:transparent;color:var(--sat-muted);font-size:20px;line-height:1;cursor:pointer;flex-shrink:0}.sat-filter-group{border:0;margin:0 0 14px;padding:0}.sat-filter-group legend{margin-bottom:8px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--sat-muted);font-weight:600}.sat-filter-pill{display:block;margin:2px 0;cursor:pointer}.sat-filter-pill input{position:absolute;opacity:0}.sat-filter-pill span{display:flex;align-items:center;justify-content:space-between;min-height:34px;border-radius:8px;border:1px solid transparent;background:transparent;padding:0 8px;color:var(--sat-muted);font-size:13px;font-weight:500;transition:background .12s ease,color .12s ease,border-color .12s ease}.sat-filter-pill span:after{content:"";width:10px;height:10px;border-radius:3px;border:1px solid var(--sat-line)}.sat-filter-pill.is-active span{border-color:rgba(126,168,146,.35);background:rgba(126,168,146,.08);color:var(--sat-text)}.sat-filter-pill.is-active span:after{background:var(--sat-accent);border-color:var(--sat-accent)}.sat-clear-filters{width:100%;min-height:36px;border-radius:10px;border:1px solid var(--sat-line);background:transparent;color:var(--sat-muted);font-size:13px;font-weight:600;cursor:pointer}.sat-clear-filters.is-active{border-color:rgba(126,168,146,.35);color:var(--sat-accent-soft)}',
      '.sat-results-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px;padding-bottom:0;border-bottom:none}.sat-results-head-main{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.sat-results-head-main strong{font-size:22px;color:var(--sat-text);font-weight:700;line-height:1;letter-spacing:-.01em}.sat-results-head-main>span{color:var(--sat-muted);font-size:14px;font-weight:400}.sat-results-head p{max-width:440px;margin:0;color:var(--sat-muted);font-size:12px;line-height:1.65;text-align:right}.sat-asset-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:18px}.sat-asset-grid.sat-view-compact{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}.sat-asset-card{position:relative;overflow:hidden;border-radius:12px;background:var(--sat-surface);border:1px solid var(--sat-line);transition:border-color .18s ease,background .18s ease;min-height:0;cursor:pointer;outline:none;content-visibility:auto;contain-intrinsic-size:320px;contain:layout paint;display:flex;flex-direction:column}.sat-asset-card:before{display:none}.sat-asset-card:hover,.sat-asset-card:focus-visible{border-color:rgba(255,255,255,.14);background:var(--sat-surface-2)}.sat-asset-card.is-saved{border-color:rgba(126,168,146,.35)}',
      '.sat-card-media-wrap{position:relative;background:var(--sat-media-bg);aspect-ratio:1/1;overflow:hidden;border-bottom:1px solid rgba(0,0,0,.06)}.sat-card-media-wrap:after{display:none}.sat-asset-media{position:absolute;inset:0;height:100%;overflow:hidden;border-radius:0;background:transparent;z-index:0}.sat-drawer-media{height:300px;border-radius:12px;margin-bottom:16px;background:var(--sat-media-bg);border:1px solid var(--sat-line);overflow:hidden}.sat-asset-image{width:100%;height:100%;object-fit:contain;padding:10px;background:transparent;display:block;transition:transform .3s ease;box-sizing:border-box}.sat-asset-image[src$=".svg"]{object-fit:cover;padding:0;background:var(--sat-surface-2)}.sat-asset-card:hover .sat-asset-image{transform:scale(1.02)}.sat-drawer-media .sat-asset-image{padding:12px;object-fit:contain;background:transparent}.sat-media-shade{display:none}.sat-asset-placeholder{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--sat-media-bg)}.sat-media-insect .sat-asset-placeholder,.sat-media-beetle .sat-asset-placeholder{background:#e6efe8}.sat-media-plant .sat-asset-placeholder{background:#e8efe6}.sat-media-fossil .sat-asset-placeholder{background:#efeae3}.sat-media-shell .sat-asset-placeholder,.sat-media-fish .sat-asset-placeholder{background:#e6ecef}.sat-asset-placeholder[hidden]{display:none!important}.sat-asset-placeholder span{font-size:10px;letter-spacing:.1em;color:var(--sat-muted);font-weight:600;text-transform:uppercase}.sat-asset-placeholder strong{font-size:28px;color:var(--sat-text);font-family:"Noto Serif TC",Georgia,serif;font-weight:500}.sat-asset-placeholder em{font-style:normal;color:var(--sat-muted);font-size:11px}.sat-card-floating{position:absolute;left:10px;bottom:10px;top:auto;right:auto;z-index:2;display:flex;justify-content:flex-start;flex-wrap:wrap;gap:4px;align-items:center}.sat-badge,.sat-verify-badge,.sat-grade-badge{display:inline-flex;align-items:center;min-height:22px;padding:0 8px;border-radius:6px;background:rgba(18,24,22,.78);backdrop-filter:blur(6px);font-size:10px;font-weight:600;letter-spacing:.02em}.sat-badge{border:1px solid var(--sat-line);color:var(--sat-muted)}.sat-verify-badge{border:1px solid rgba(126,168,146,.35);color:var(--sat-accent-soft)}.sat-grade-badge{border:1px solid var(--sat-line);color:var(--sat-text);margin-left:auto}.sat-card-hover{display:none}',
      '.sat-card-chips{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 8px}.sat-chip{font-size:10px;padding:2px 7px;border-radius:5px;border:1px solid var(--sat-line);background:transparent;color:var(--sat-muted);font-weight:500}.sat-card-content{padding:12px 12px 14px;flex:1;display:flex;flex-direction:column}.sat-card-collection{margin:0 0 5px;font-size:11px;color:var(--sat-muted);line-height:1.3;font-weight:500;letter-spacing:.02em}.sat-card-collection:before{display:none}.sat-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.sat-card-content h3,.sat-card-head h3{margin:0 0 3px;color:var(--sat-text);font-size:14px;line-height:1.35;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.sat-save-button{position:absolute;top:10px;right:10px;z-index:3;border:1px solid rgba(0,0,0,.08);background:rgba(255,255,255,.88);color:#4a4a48;border-radius:50%;width:34px;height:34px;padding:0;font-size:15px;line-height:1;cursor:pointer;flex-shrink:0;transition:border-color .15s ease,color .15s ease,background .15s ease}.sat-save-button:hover{border-color:rgba(0,0,0,.12);background:#fff}.sat-save-button.is-active{border-color:rgba(201,188,152,.55);color:#8a6f2e;background:#fff9ea}.sat-scientific{margin:0 0 10px;font-family:"Noto Serif TC",Georgia,serif;font-size:13px;font-style:italic;color:var(--sat-muted);line-height:1.3}.sat-card-facts{display:flex;flex-direction:column;gap:2px;color:var(--sat-muted);font-size:11px;line-height:1.4}.sat-card-locality{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.sat-card-license{color:rgba(126,168,146,.85)}.sat-card-commerce{display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto;padding-top:8px;border-top:1px solid var(--sat-line);gap:8px}.sat-price-block{display:flex;flex-direction:column;gap:1px;min-width:0}.sat-price-label{font-size:10px;color:var(--sat-muted);font-weight:500;letter-spacing:.04em}.sat-price{color:var(--sat-warm-soft);font-weight:600;font-size:15px;letter-spacing:-.01em;font-family:"Noto Serif TC",Georgia,serif}.sat-card-grade{font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid var(--sat-line);white-space:nowrap}.sat-grade-tier-aplus{color:var(--sat-warm-soft);border-color:rgba(201,188,152,.35);background:rgba(201,188,152,.08)}.sat-grade-tier-a{color:var(--sat-accent-soft);border-color:rgba(126,168,146,.35);background:rgba(126,168,146,.08)}.sat-grade-tier-b{color:#b8d4c8;border-color:rgba(126,168,146,.22);background:rgba(126,168,146,.05)}.sat-grade-tier-c{color:var(--sat-muted)}.sat-card-commerce .sat-card-satid{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10px;color:var(--sat-muted)!important;font-weight:500}.sat-card-footer{display:none}',
      '.sat-load-row{text-align:center;margin:24px 0 8px;color:var(--sat-muted)}.sat-load-row button{border:1px solid var(--sat-line);background:var(--sat-surface);color:var(--sat-text);border-radius:12px;min-width:180px;min-height:44px;font-size:14px;font-weight:600;cursor:pointer;transition:border-color .15s ease,background .15s ease}.sat-load-row button:hover{border-color:rgba(255,255,255,.18);background:var(--sat-surface-2)}.sat-empty-state{grid-column:1/-1;text-align:center;padding:48px 24px;border:1px dashed var(--sat-line);border-radius:12px;background:var(--sat-surface)}.sat-view-list .sat-empty-state{grid-column:unset;width:100%}.sat-empty-state span{color:var(--sat-muted);font-weight:600;font-size:11px;letter-spacing:.1em}.sat-empty-state strong{display:block;margin:10px 0;font-size:20px;color:var(--sat-text);font-weight:700}.sat-empty-state p{color:var(--sat-muted);font-size:14px;margin-bottom:16px}',
      '.sat-active-filters{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:8px 0 0}.sat-active-filters-label{font-size:11px;color:var(--sat-muted);font-weight:500;margin-right:4px}.sat-filter-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--sat-line);background:var(--sat-surface);color:var(--sat-muted);border-radius:999px;padding:4px 10px;font-size:12px;font-weight:500;cursor:pointer;transition:border-color .12s ease,color .12s ease}.sat-filter-chip span{font-size:14px;line-height:1;opacity:.7}.sat-filter-chip:hover{border-color:rgba(255,255,255,.18);color:var(--sat-text)}.sat-filter-chip--clear{border-color:transparent;color:var(--sat-accent)}.sat-search-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:28px;height:28px;border:0;border-radius:8px;background:transparent;color:var(--sat-muted);font-size:18px;line-height:1;cursor:pointer}.sat-search-clear:hover{color:var(--sat-text)}.sat-watch-toggle{min-height:44px;padding:0 12px;border-radius:10px;border:1px solid var(--sat-line);background:var(--sat-surface);color:var(--sat-muted);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s ease}.sat-watch-toggle.is-active{border-color:rgba(126,168,146,.35);background:rgba(126,168,146,.1);color:var(--sat-accent)}.sat-watch-toggle.is-empty:not(.is-active){opacity:.45;cursor:not-allowed}.sat-filter-mobile b{display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:var(--sat-accent);color:#fff;font-size:9px;font-weight:700;font-style:normal}.sat-tab-count{display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;margin-left:6px;padding:0 4px;border-radius:999px;background:rgba(255,255,255,.08);color:var(--sat-muted);font-size:10px;font-style:normal;font-weight:600}.sat-quick-tabs button.is-active .sat-tab-count{background:rgba(126,168,146,.18);color:var(--sat-accent-soft)}.sat-filter-count{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 5px;border-radius:6px;background:rgba(255,255,255,.08);color:var(--sat-text);font-size:10px;font-style:normal;font-weight:600}',
      '.sat-results-head-left{display:flex;flex-direction:column;gap:8px}.sat-results-meta{display:flex;flex-wrap:wrap;gap:6px}.sat-meta-pill{padding:3px 8px;border-radius:999px;border:1px solid var(--sat-line);background:var(--sat-surface);color:var(--sat-muted);font-size:11px;font-weight:500}.sat-meta-pill--verified{border-color:rgba(126,168,146,.28);color:var(--sat-accent-soft)}.sat-meta-pill--watch{border-color:rgba(126,168,146,.28);color:var(--sat-accent)}.sat-card-progress{display:none}',
      '.sat-asset-grid.sat-view-list{display:flex;flex-direction:column;gap:6px}.sat-list-head{display:grid;grid-template-columns:56px minmax(160px,1.4fr) minmax(120px,.9fr) 72px minmax(100px,.8fr) 88px;gap:10px;padding:0 14px 8px;font-size:11px;color:var(--sat-muted);font-weight:600;border-bottom:1px solid var(--sat-line)}.sat-asset-row{display:grid;grid-template-columns:56px minmax(160px,1.4fr) minmax(120px,.9fr) 72px minmax(100px,.8fr) 88px;gap:10px;align-items:center;padding:10px 14px;border-radius:10px;border:1px solid transparent;background:var(--sat-surface);cursor:pointer;transition:border-color .15s ease,background .15s ease}.sat-asset-row:hover{border-color:rgba(255,255,255,.14);background:var(--sat-surface-2)}.sat-asset-row.is-saved{border-color:rgba(126,168,146,.28)}.sat-row-thumb{width:48px;height:48px;border-radius:8px;overflow:hidden;background:var(--sat-surface-2);border:1px solid var(--sat-line)}.sat-row-thumb img{width:100%;height:100%;object-fit:cover;padding:0;box-sizing:border-box}.sat-row-main{display:flex;flex-direction:column;gap:2px;min-width:0}.sat-row-main strong{font-size:13px;color:var(--sat-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}.sat-row-main em{font-style:italic;font-size:12px;color:var(--sat-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sat-row-main span{font-size:11px;color:var(--sat-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sat-row-meta{display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--sat-muted)}.sat-row-grade{display:flex;flex-direction:column;gap:2px;text-align:center}.sat-row-grade strong{color:var(--sat-text);font-size:14px;font-weight:600}.sat-row-grade span{font-size:10px;color:var(--sat-muted)}.sat-row-price{display:flex;flex-direction:column;gap:2px}.sat-row-price strong{color:var(--sat-text);font-size:14px;font-weight:600}.sat-row-actions{display:flex;gap:6px;justify-content:flex-end}.sat-detail-button{border:1px solid var(--sat-line);background:transparent;color:var(--sat-text);border-radius:8px;min-height:32px;padding:0 12px;font-size:11px;font-weight:600;cursor:pointer}.sat-detail-button:hover{border-color:rgba(255,255,255,.16);background:rgba(255,255,255,.04)}.sat-row-actions .sat-save-button{position:static;width:32px;height:32px;border-radius:8px;backdrop-filter:none}',
      '.sat-drawer-head-actions{display:flex;align-items:center;gap:8px}.sat-drawer-copy{border:1px solid var(--sat-line);background:transparent;color:var(--sat-muted);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;cursor:pointer}.sat-drawer-copy:hover{border-color:rgba(255,255,255,.14);color:var(--sat-text)}.sat-drawer-nav{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--sat-line);background:transparent}.sat-drawer-nav span{text-align:center;font-size:11px;color:var(--sat-muted);font-weight:500}.sat-drawer-nav-btn{border:1px solid var(--sat-line);background:transparent;color:var(--sat-muted);border-radius:8px;padding:6px 9px;font-size:10px;font-weight:500;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sat-drawer-nav-btn:not(:disabled):hover{border-color:rgba(255,255,255,.14);color:var(--sat-text)}.sat-drawer-nav-btn:disabled{opacity:.3;cursor:not-allowed}',
      '.sat-drawer-backdrop,.sat-filter-backdrop{position:fixed;inset:var(--mc-global-header-height,88px) 0 0;z-index:12100;background:rgba(18,24,22,.72);backdrop-filter:blur(2px)}.sat-detail-drawer{position:fixed;top:var(--mc-global-header-height,88px);right:0;bottom:0;z-index:12110;width:min(500px,100%);background:var(--sat-surface);border-left:1px solid var(--sat-line);box-shadow:-12px 0 40px rgba(0,0,0,.35);display:flex;flex-direction:column;animation:satDrawerIn .18s ease both}.sat-drawer-head{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid var(--sat-line)}.sat-drawer-head span{display:block;color:var(--sat-muted);font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-weight:600}.sat-drawer-head strong{color:var(--sat-text);font-weight:600}.sat-drawer-close{width:36px;height:36px;border-radius:10px;border:1px solid var(--sat-line);background:transparent;color:var(--sat-muted);font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}.sat-drawer-body{padding:18px;overflow:auto}.sat-drawer-title-row{display:flex;justify-content:space-between;gap:16px;align-items:start;margin-bottom:16px}.sat-drawer-title-row h2{margin:0 0 5px;color:var(--sat-text);font-size:22px;font-weight:700}.sat-drawer-price{color:var(--sat-text);font-size:20px;font-weight:700}.sat-drawer-sciname{margin:0;font-style:italic;color:var(--sat-muted);font-size:16px;line-height:1.35}.sat-drawer-lead{margin:0 0 14px;color:var(--sat-muted);line-height:1.6;font-size:14px}.sat-drawer-type-line{margin:0 0 10px;color:var(--sat-text);font-size:14px}.sat-drawer-type-line strong{color:var(--sat-accent);font-weight:600}.sat-drawer-section .sat-card-chips{margin-top:8px}.sat-drawer-alert{border-color:rgba(126,168,146,.25)!important;background:rgba(126,168,146,.06)!important}.sat-drawer-alert p{margin:0;color:var(--sat-muted);line-height:1.65}.sat-drawer-cta{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:0 0 18px;padding:10px 0;background:var(--sat-surface);border-bottom:1px solid var(--sat-line)}.sat-drawer-cta button{border:1px solid var(--sat-line);background:transparent;color:var(--sat-text);border-radius:10px;min-height:40px;font-weight:600;cursor:pointer;font-size:12px}.sat-drawer-cta button.is-active{border-color:rgba(126,168,146,.35);color:var(--sat-accent);background:rgba(126,168,146,.08)}.sat-drawer-section,.sat-grade-block,.sat-provenance-block{border:1px solid var(--sat-line);background:var(--sat-bg);border-radius:12px;padding:14px;margin-bottom:12px}.sat-drawer-section h3,.sat-provenance-block h3{margin:0 0 10px;color:var(--sat-text);font-size:13px;font-weight:600}.sat-drawer-section p{margin:0;color:var(--sat-muted);line-height:1.65}.sat-info-list{display:grid;gap:8px;margin:0}.sat-info-list div{display:grid;grid-template-columns:112px 1fr;gap:8px}.sat-info-list dt{font-size:11px;text-transform:uppercase;color:var(--sat-muted);font-weight:600}.sat-info-list dd{margin:0;color:var(--sat-text)}.sat-grade-block span{display:block;font-size:11px;color:var(--sat-muted);text-transform:uppercase;font-weight:600}.sat-grade-block strong{display:block;font-size:22px;color:var(--sat-text);font-weight:700}.sat-grade-block i{display:block;height:4px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;margin:10px 0}.sat-grade-block b{display:block;height:100%;background:var(--sat-accent)}.sat-grade-block p{margin:0;color:var(--sat-muted)}.sat-provenance-block div{position:relative;padding:0 0 12px 18px}.sat-provenance-block b{position:absolute;left:0;top:6px;width:6px;height:6px;border-radius:50%;background:var(--sat-accent)}.sat-provenance-block strong{display:block;color:var(--sat-text);font-weight:600;font-size:13px}.sat-provenance-block span{display:block;color:var(--sat-muted);font-size:12px}',
      '.sat-filter-panel-drawer{position:fixed;top:var(--mc-global-header-height,88px);left:0;bottom:0;z-index:12120;width:min(360px,92vw);overflow:auto;border-radius:0;background:var(--sat-surface);border-right:1px solid var(--sat-line)}.sat-toast{position:fixed;right:24px;bottom:24px;z-index:12200;border:1px solid var(--sat-line);background:var(--sat-surface);color:var(--sat-text);border-radius:12px;padding:12px 16px;font-weight:600;font-size:13px;box-shadow:0 10px 28px rgba(0,0,0,.35)}@keyframes satDrawerIn{from{transform:translateX(16px);opacity:.8}to{transform:none;opacity:1}}',
      '.sat-view-compact .sat-asset-card{contain-intrinsic-size:280px}',
      '@media(max-width:1180px){.sat-os-hero-grid{grid-template-columns:1fr}.sat-catalog-spotlight{grid-template-columns:minmax(120px,34%) minmax(0,1fr)}.sat-market-actions{width:100%}.sat-stat{flex:1 1 45%}.sat-stat:nth-child(2){border-right:0}.sat-command-top{grid-template-columns:1fr}.sat-command-tools{width:100%}.sat-result-count{display:none}.sat-market-layout{grid-template-columns:1fr}.sat-market-layout>.sat-filter-panel{display:none}.sat-filter-mobile{display:inline-flex;align-items:center;justify-content:center}}',
      '@media(max-width:720px){.sat-marketplace-shell{width:calc(100vw - 24px);padding-top:calc(var(--mc-global-header-height,76px) + 12px)}.sat-market-title{font-size:clamp(26px,8vw,34px)}.sat-market-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 0}.sat-stat{flex:none;border-right:0;margin-right:0;padding-right:0}.sat-catalog-spotlight{grid-template-columns:1fr}.sat-catalog-spotlight-media{min-height:160px}.sat-market-actions{flex-direction:column;align-items:stretch}.sat-primary-action,.sat-btn-ghost{width:100%}.sat-command-tools{flex-direction:column;align-items:stretch}.sat-sort select,.sat-view-toggle,.sat-filter-mobile,.sat-watch-toggle{width:100%}.sat-asset-grid,.sat-asset-grid.sat-view-compact{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.sat-list-head{display:none}.sat-asset-row{grid-template-columns:48px 1fr auto;grid-template-areas:"thumb main actions" "thumb meta actions" "thumb price actions";gap:6px 10px;padding:12px}.sat-row-thumb{grid-area:thumb}.sat-row-main{grid-area:main}.sat-row-meta{grid-area:meta;flex-direction:row;flex-wrap:wrap}.sat-row-grade{display:none}.sat-row-price{grid-area:price;flex-direction:row;align-items:center;gap:8px}.sat-row-actions{grid-area:actions;flex-direction:column}.sat-results-head{flex-direction:column;align-items:flex-start;gap:6px}.sat-results-head p{text-align:left;max-width:none}.sat-drawer-cta{grid-template-columns:1fr}.sat-drawer-nav{grid-template-columns:1fr;gap:6px}.sat-drawer-nav-btn{font-size:11px}}',
      '@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function ensureRoot() {
    var root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement('div');
      root.id = ROOT_ID;
      document.body.appendChild(root);
    }
    root.className = 'sat-v2-marketplace';
    root.style.display = 'block';
    return root;
  }

  function hideLegacy() {
    // Legacy SAT market runtimes are no longer mounted by UI.html.
  }

  var MARKET_ISOLATION_SELECTORS = '#welcomeShell, .welcome-shell, .lp-shell, .landing-shell, #mcWelcomeHero, .mc-welcome-hero, #mcEntryModal, [data-mc-public-landing]';

  function setMarketplaceIsolation(active) {
    try {
      var on = !!active;
      document.documentElement.classList.toggle('mc-sat-market-active', on);
      document.body.classList.toggle('mc-sat-market-active', on);
      document.querySelectorAll(MARKET_ISOLATION_SELECTORS).forEach(function (node) {
        if (node.id === ROOT_ID) return;
        if (on) {
          node.setAttribute('aria-hidden', 'true');
          node.setAttribute('inert', '');
          node.setAttribute('hidden', '');
        } else {
          node.removeAttribute('aria-hidden');
          node.removeAttribute('inert');
          node.removeAttribute('hidden');
        }
      });
      var shell = document.getElementById('welcomeShell');
      if (!shell) return;
      if (on) {
        shell.setAttribute('inert', '');
        shell.setAttribute('hidden', '');
        shell.querySelectorAll('video').forEach(function (video) {
          try {
            if (!video.paused) {
              video.pause();
              video.setAttribute('data-sat-market-paused', '1');
            }
          } catch (e) {}
        });
      } else {
        shell.removeAttribute('inert');
        shell.removeAttribute('hidden');
        shell.querySelectorAll('video[data-sat-market-paused]').forEach(function (video) {
          try {
            video.removeAttribute('data-sat-market-paused');
            video.play();
          } catch (e) {}
        });
      }
    } catch (e) {}
  }

  function onImageError(img) {
    try {
      var frame = img.closest('[data-sat-media-frame]');
      var fallback = frame && frame.getAttribute('data-sat-fallback-src');
      if (fallback && img.getAttribute('src') !== fallback) {
        img.setAttribute('src', fallback);
        return;
      }
      img.style.display = 'none';
      var placeholder = frame && frame.querySelector('[data-sat-placeholder]');
      if (placeholder) placeholder.hidden = false;
    } catch (e) {}
  }

  function onCollectionImageError(img) {
    try {
      var neutral = '../assets/images/Specimen/thumbs/neutral.svg';
      if (img.getAttribute('src') !== neutral) {
        img.setAttribute('src', neutral);
        return;
      }
      img.style.display = 'none';
    } catch (e) {}
  }

  function wire(root) {
    root.querySelectorAll('[data-sat-img]').forEach(function (img) { img.addEventListener('error', function () { onImageError(img); }); });
    root.querySelectorAll('[data-sat-collection-img]').forEach(function (img) { img.addEventListener('error', function () { onCollectionImageError(img); }); });
    var search = root.querySelector('[data-sat-search]');
    if (search) search.addEventListener('input', function (event) {
      var value = String(event.target.value || '');
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        state.q = value;
        state.visible = INITIAL_VISIBLE;
        paint();
      }, SEARCH_DELAY);
    });
    root.querySelectorAll('[data-sat-tab]').forEach(function (btn) { btn.addEventListener('click', function () { state.tab = btn.getAttribute('data-sat-tab') || 'all'; state.visible = INITIAL_VISIBLE; paint(); }); });
    var sort = root.querySelector('[data-sat-sort]');
    if (sort) sort.addEventListener('change', function () { state.sort = sort.value || 'newest'; state.visible = INITIAL_VISIBLE; paint(); });
    root.querySelectorAll('[data-sat-view]').forEach(function (btn) { btn.addEventListener('click', function () { state.view = btn.getAttribute('data-sat-view') || 'grid'; paint(); }); });
    root.querySelectorAll('[data-sat-filter-group]').forEach(function (input) { input.addEventListener('change', function () { var group = input.getAttribute('data-sat-filter-group'); state.filters[group][input.value] = input.checked; state.visible = INITIAL_VISIBLE; paint(); }); });
    root.querySelectorAll('[data-sat-collection]').forEach(function (btn) { btn.addEventListener('click', function () { var key = btn.getAttribute('data-sat-collection') || ''; state.collection = state.collection === key ? '' : key; state.visible = INITIAL_VISIBLE; paint(); }); });
    root.querySelectorAll('[data-sat-clear]').forEach(function (btn) { btn.addEventListener('click', function () { clearFilters(); paint(); }); });
    root.querySelectorAll('[data-sat-more]').forEach(function (btn) { btn.addEventListener('click', function () { state.visible += LOAD_STEP; paint(); }); });
    root.querySelectorAll('[data-sat-drawer]').forEach(function (btn) { btn.addEventListener('click', function (event) { event.stopPropagation(); go('/marketplace/asset/' + encodeURIComponent(btn.getAttribute('data-sat-drawer') || '')); }); });
    root.querySelectorAll('[data-sat-card]').forEach(function (card) {
      card.addEventListener('click', function (event) { if (event.target.closest('button')) return; go('/marketplace/asset/' + encodeURIComponent(card.getAttribute('data-sat-card') || '')); });
      card.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go('/marketplace/asset/' + encodeURIComponent(card.getAttribute('data-sat-card') || '')); } });
    });
    root.querySelectorAll('[data-sat-search-clear]').forEach(function (btn) {
      btn.addEventListener('click', function () { state.q = ''; state.visible = INITIAL_VISIBLE; paint(); });
    });
    root.querySelectorAll('[data-sat-watch-only]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!watchCount() && !state.watchOnly) {
          showToast('\u5148\u5728\u5361\u7247\u4e0a\u9ede\u9078 \u2606 \u52a0\u5165\u8ffd\u8e64');
          return;
        }
        state.watchOnly = !state.watchOnly;
        state.visible = INITIAL_VISIBLE;
        paint();
      });
    });
    root.querySelectorAll('[data-sat-chip-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var kind = btn.getAttribute('data-sat-chip-remove') || '';
        if (kind === 'q') state.q = '';
        else if (kind === 'collection') state.collection = '';
        else if (kind === 'watchOnly') state.watchOnly = false;
        else if (kind === 'filter') {
          var group = btn.getAttribute('data-sat-chip-group') || '';
          var value = btn.getAttribute('data-sat-chip-value') || '';
          if (state.filters[group]) state.filters[group][value] = false;
        }
        state.visible = INITIAL_VISIBLE;
        paint();
      });
    });
    root.querySelectorAll('[data-sat-copy-id]').forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.stopPropagation();
        var id = btn.getAttribute('data-sat-copy-id') || '';
        try {
          if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
            global.navigator.clipboard.writeText(id).then(function () { showToast('SAT ID \u5df2\u8907\u88fd'); });
          } else {
            showToast(id);
          }
        } catch (e) { showToast(id); }
      });
    });
    root.querySelectorAll('[data-sat-drawer-nav]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        go('/marketplace/asset/' + encodeURIComponent(btn.getAttribute('data-sat-drawer-nav') || ''));
      });
    });
    root.querySelectorAll('[data-sat-watch]').forEach(function (btn) { btn.addEventListener('click', function (event) { event.stopPropagation(); var id = btn.getAttribute('data-sat-watch') || ''; state.watch[id] = !state.watch[id]; saveWatchState(); showToast(state.watch[id] ? '\u5df2\u52a0\u5165\u8ffd\u8e64' : '\u5df2\u79fb\u9664\u8ffd\u8e64'); paint(); }); });
    root.querySelectorAll('[data-sat-license]').forEach(function (btn) { btn.addEventListener('click', function (event) { event.stopPropagation(); showToast('\u6388\u6b0a\u7533\u8acb\u5df2\u6e96\u5099'); }); });
    root.querySelectorAll('[data-sat-contact]').forEach(function (btn) { btn.addEventListener('click', function (event) { event.stopPropagation(); showToast('\u5df2\u6e96\u5099\u806f\u7d61\u64c1\u6709\u8005'); }); });
    root.querySelectorAll('[data-sat-close-drawer]').forEach(function (btn) { btn.addEventListener('click', function () { go('/marketplace'); }); });
    root.querySelectorAll('[data-sat-filter-open]').forEach(function (btn) { btn.addEventListener('click', function () { state.filterOpen = true; paint(); }); });
    root.querySelectorAll('[data-sat-filter-close]').forEach(function (btn) { btn.addEventListener('click', function () { state.filterOpen = false; paint(); }); });
    root.querySelectorAll('[data-sat-jump]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var j = btn.getAttribute('data-sat-jump') || 'grid';
        var target = j === 'grid' ? root.querySelector('#sat-market-grid')
          : j === 'collections' ? root.querySelector('#sat-collections-block')
          : j === 'trust' ? root.querySelector('#sat-trust-license-block')
          : j === 'filters' ? root.querySelector('#sat-filter-panel-block')
          : null;
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    root.querySelectorAll('[data-sat-hero-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.tab = btn.getAttribute('data-sat-hero-tab') || 'all';
        state.visible = INITIAL_VISIBLE;
        paint();
        setTimeout(function () {
          var g = document.getElementById('sat-market-grid');
          if (g) g.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      });
    });
    root.querySelectorAll('[data-route]').forEach(function (btn) { btn.addEventListener('click', function () { var route = btn.getAttribute('data-route') || '/'; if (global.MCRouter && typeof global.MCRouter.go === 'function') global.MCRouter.go(route); }); });
  }

  function paint() {
    hideLegacy();
    ensureStyles();
    setMarketplaceIsolation(true);
    normalizeHeader();
    var root = ensureRoot();
    var scrollY = root.scrollTop || 0;
    var prevDrawerId = state.drawerId || currentAssetFromHash();
    var drawerBody = root.querySelector('.sat-drawer-body');
    var drawerScroll = drawerBody ? drawerBody.scrollTop : 0;
    var searchEl = root.querySelector('[data-sat-search]');
    var hadSearchFocus = searchEl && document.activeElement === searchEl;
    var searchCaret = hadSearchFocus && typeof searchEl.selectionStart === 'number' ? searchEl.selectionStart : null;
    state.drawerId = currentAssetFromHash();
    root.innerHTML = renderHtml();
    root.scrollTop = scrollY;
    wire(root);
    var newDrawerBody = root.querySelector('.sat-drawer-body');
    if (newDrawerBody && state.drawerId && state.drawerId === prevDrawerId && drawerScroll) {
      newDrawerBody.scrollTop = drawerScroll;
    }
    if (hadSearchFocus) {
      var s = root.querySelector('[data-sat-search]');
      if (s) {
        s.focus();
        if (searchCaret != null) {
          try { s.setSelectionRange(searchCaret, searchCaret); } catch (e) {}
        }
      }
    }
    root.classList.toggle('sat-has-drawer', !!(state.drawerId && findAsset(state.drawerId)));
    root.classList.toggle('sat-has-filter', state.filterOpen);
    var mainEl = root.querySelector('.sat-public-marketplace');
    var hasDrawer = !!(state.drawerId && findAsset(state.drawerId));
    if (mainEl) {
      if (hasDrawer) mainEl.setAttribute('aria-hidden', 'true');
      else mainEl.removeAttribute('aria-hidden');
    }
    if (hasDrawer && !hadSearchFocus) {
      var closeBtn = root.querySelector('.sat-drawer-close');
      if (closeBtn) {
        try { closeBtn.focus(); } catch (e) {}
      }
    }
  }

  function render() {
    state.drawerId = currentAssetFromHash();
    if (state.drawerId && !findAsset(state.drawerId)) {
      try { global.location.hash = '#/marketplace'; } catch (e) {}
      state.drawerId = '';
    }
    paint();
  }

  function openDetail(id) {
    state.drawerId = String(id || '');
    paint();
  }

  function hide() {
    setMarketplaceIsolation(false);
    var root = document.getElementById(ROOT_ID);
    if (root) {
      root.style.display = 'none';
      root.innerHTML = '';
    }
    state.drawerId = '';
    state.filterOpen = false;
  }

  function onKeydown(event) {
    var tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || (event.target && event.target.isContentEditable)) return;
    if (event.key === 'Escape') {
      if (state.filterOpen) {
        state.filterOpen = false;
        paint();
        return;
      }
      if (state.drawerId || currentAssetFromHash()) go('/marketplace');
      return;
    }
    if (!state.drawerId && !currentAssetFromHash()) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    var list = filtered();
    var id = state.drawerId || currentAssetFromHash();
    var idx = -1;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) { idx = i; break; }
    if (idx < 0) return;
    var target = event.key === 'ArrowLeft' ? list[idx - 1] : list[idx + 1];
    if (!target) return;
    event.preventDefault();
    go('/marketplace/asset/' + encodeURIComponent(target.id));
  }

  if (!global.__MC_SAT_MARKET_V2_KEYDOWN__) {
    global.__MC_SAT_MARKET_V2_KEYDOWN__ = true;
    document.addEventListener('keydown', onKeydown);
  }

  global.McSatV2Marketplace = {
    render: render,
    openDetail: openDetail,
    hide: hide,
    assets: ASSETS,
  };
})(typeof window !== 'undefined' ? window : this);
