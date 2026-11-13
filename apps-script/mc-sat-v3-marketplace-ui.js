/**
 * SAT Marketplace V3 — isolated public layer (.mc-sat-v3 namespace).
 * Mounted by UI.html renderMarketplacePageSafe() / renderMarketplaceAssetDetailSafe().
 * Light academic catalog UX; no global CSS overrides.
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'mcSatV3MarketplaceRoot';
  var STYLE_ID = 'mcSatV3MarketplaceStyles';
  var WATCH_KEY = 'mcSatV3MarketplaceWatch';
  var PAGE_SIZE = 12;
  var LOAD_STEP = 6;
  var CARD_BACK = '../assets/Card back image/thumbs/';
  var SPEC_BASE = '../assets/images/Specimen/';

  var state = {
    q: '',
    tab: 'all',
    sort: 'recently-listed',
    visible: PAGE_SIZE,
    filterOpen: false,
    detailTab: 'overview',
    passportFace: 'front',
    toast: '',
    watch: {},
    filters: {
      category: '',
      verification: '',
      completeness: '',
      license: '',
      researchLinked: false,
      hasPassport: false,
      hasQr: false,
      hasPhysicalSpecimen: false,
      priceMin: '',
      priceMax: '',
    },
    route: { view: 'home', assetId: '', collectionSlug: '' },
    sidebarNav: 'catalog',
    pendingAboutAnchor: '',
    sidebarOpen: false,
    railExpanded: false,
    heroStackFan: false,
    heroCardFocus: '',
    collectionTab: 'assets',
    catalogView: 'grid',
    listForm: {
      scientificName: '',
      commonName: '',
      category: 'Insects',
      price: '',
      licenseType: 'Academic use',
      hasPhysicalSpecimen: false,
      description: '',
      paymentMethods: ['card', 'usdc', 'usdt'],
    },
    checkout: { assetId: '', method: '' },
  };

  var PAYMENT_METHODS = ['card', 'bank_transfer', 'usdc', 'usdt', 'eth'];
  var DEFAULT_PAYMENT_METHODS = ['card', 'usdc', 'usdt'];

  var searchTimer = null;
  var toastTimer = null;

  /* ---- unique visual pool (no dupes in first 12 grid cards) ---- */
  var VISUAL_POOL = [].concat(
    typeof global.MC_SAT_namedSpecimenPhotoUrls === 'function' ? global.MC_SAT_namedSpecimenPhotoUrls() : [],
    [
    encodeURI(SPEC_BASE + 'thumbs/insect.svg'),
    encodeURI(SPEC_BASE + 'detail/insect.svg'),
    encodeURI(SPEC_BASE + 'thumbs/plant.svg'),
    encodeURI(SPEC_BASE + 'detail/plant.svg'),
    encodeURI(SPEC_BASE + 'thumbs/marine.svg'),
    encodeURI(SPEC_BASE + 'detail/marine.svg'),
    encodeURI(SPEC_BASE + 'thumbs/fossil.svg'),
    encodeURI(SPEC_BASE + 'detail/fossil.svg'),
    encodeURI(SPEC_BASE + 'thumbs/neutral.svg'),
    encodeURI(SPEC_BASE + 'detail/neutral.svg'),
    encodeURI(CARD_BACK + 'coleoptera.jpg'),
    encodeURI(CARD_BACK + 'fossil.jpg'),
    encodeURI(CARD_BACK + 'plantae.jpg'),
    encodeURI(CARD_BACK + 'mollusca.jpg'),
    encodeURI(CARD_BACK + 'common.jpg'),
  ]);

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escAttr(v) { return esc(v).replace(/'/g, '&#39;'); }
  function lower(v) { return String(v || '').toLowerCase(); }

  function paymentMethodLabel(method) {
    var map = {
      card: v3T('Credit / debit card', '信用卡／借记卡'),
      bank_transfer: v3T('Bank transfer', '銀行匯款'),
      usdc: 'USDC',
      usdt: 'USDT',
      eth: v3T('Crypto (ETH)', '虛擬貨幣（ETH）'),
    };
    return map[method] || method;
  }

  function normalizePaymentMethods(methods) {
    if (!methods || !methods.length) return DEFAULT_PAYMENT_METHODS.slice();
    var seen = {};
    var out = [];
    methods.forEach(function (m) {
      if (PAYMENT_METHODS.indexOf(m) >= 0 && !seen[m]) {
        seen[m] = true;
        out.push(m);
      }
    });
    return out.length ? out : DEFAULT_PAYMENT_METHODS.slice();
  }

  function paymentMethodsSummary(methods) {
    return normalizePaymentMethods(methods).map(paymentMethodLabel).join(' · ');
  }

  function slugify(s) {
    return lower(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function specimenFallback(kind) {
    kind = kind || 'neutral';
    return {
      thumb: encodeURI(SPEC_BASE + 'thumbs/' + kind + '.svg'),
      detail: encodeURI(SPEC_BASE + 'detail/' + kind + '.svg'),
      kind: kind,
    };
  }

  function defaultProvenance(a) {
    return [
      { type: 'collected', date: a.date, actor: a.collector || a.holder, note: 'Field acquisition recorded.' },
      { type: 'digitized', date: '2024-06-01', actor: 'MCurator Digitization', note: 'High-resolution capture.' },
      { type: 'taxonomy', date: '2024-08-12', actor: 'Taxonomy Review', note: 'Scientific name verified.' },
      { type: 'sat-created', date: a.listedAt || '2025-01-15', actor: 'MCurator Registry', note: 'Scientific Asset Token issued.' },
      { type: 'listed', date: a.listedAt || '2025-02-01', actor: a.holder, note: 'Listed on SAT Marketplace.' },
    ];
  }

  function defaultActivity(a) {
    return [
      { type: 'listing', date: a.listedAt || '2025-02-01', note: 'Listing created.' },
      { type: 'verification', date: '2025-02-03', note: 'Verification updated — ' + a.verificationStatus + '.' },
    ];
  }

  function mkAsset(d) {
    var base = {
      currency: 'TWD',
      verificationStatus: 'Curator verified',
      completeness: 85,
      licenseType: 'Academic use',
      isResearchLinked: false,
      hasPassport: true,
      hasQr: true,
      hasPhysicalSpecimen: false,
      paymentMethods: DEFAULT_PAYMENT_METHODS.slice(),
      price: 1200,
      inquiryOnly: false,
      listedAt: '2025-03-01',
      holder: 'MCurator Archive',
      collector: '',
      description: '',
      provenanceEvents: null,
      metadata: {},
      activity: null,
      image: '',
      detailImage: '',
      views: 100,
      trending: false,
    };
    Object.keys(d).forEach(function (k) { base[k] = d[k]; });
    base.satId = base.satId || base.id;
    base.completeness = base.completeness != null ? base.completeness : base.completionRate || 80;
    if (!base.provenanceEvents) base.provenanceEvents = defaultProvenance(base);
    if (!base.activity) base.activity = defaultActivity(base);
    return base;
  }

  function mkPaleo(id, sci, common, title, collectionId, collectionName, price, opts) {
    opts = opts || {};
    return mkAsset({
      id: id,
      satId: id,
      title: title,
      scientificName: sci,
      commonName: common,
      category: 'Fossils',
      collectionId: collectionId,
      collectionName: collectionName,
      price: opts.inquiryOnly ? 0 : (price != null ? price : 1200),
      inquiryOnly: !!opts.inquiryOnly,
      verificationStatus: opts.verification || 'Curator verified',
      completeness: opts.completeness != null ? opts.completeness : 88,
      licenseType: opts.license || 'Education use',
      isResearchLinked: !!opts.research,
      hasPhysicalSpecimen: !!opts.physical,
      trending: !!opts.trending,
      locality: opts.locality || 'Museum research collection',
      date: opts.date || '2020-06-01',
      holder: opts.holder || 'Atlas Paleontology Unit',
      description: opts.description || 'Paleontology teaching plate with passport metadata and stratigraphic notes.',
      listedAt: opts.listedAt || '2025-03-20',
    });
  }

  var COLLECTIONS = [
    { id: 'lucanidae-reference', name: 'Lucanidae Reference Collection', curator: 'MCurator Coleoptera Lab', category: 'Insects', image: '', assetCount: 0, verificationRatio: 0, researchLinked: 0, avgCompleteness: 0 },
    { id: 'dinosaur-paleo-gallery', name: 'Dinosaur & Paleontology Gallery', curator: 'Atlas Paleontology Unit', category: 'Fossils', image: '', assetCount: 0, verificationRatio: 0, researchLinked: 0, avgCompleteness: 0 },
    { id: 'fossil-trilobite-archive', name: 'Fossil Trilobite Archive', curator: 'Atlas Paleontology Unit', category: 'Fossils', image: '', assetCount: 0, verificationRatio: 0, researchLinked: 0, avgCompleteness: 0 },
    { id: 'botanical-voucher-series', name: 'Botanical Voucher Series', curator: 'Kyoto Teaching Herbarium', category: 'Plants', image: '', assetCount: 0, verificationRatio: 0, researchLinked: 0, avgCompleteness: 0 },
    { id: 'marine-arthropod-records', name: 'Marine Arthropod Records', curator: 'Marine Reference Lab', category: 'Marine', image: '', assetCount: 0, verificationRatio: 0, researchLinked: 0, avgCompleteness: 0 },
    { id: 'mineral-provenance-set', name: 'Mineral Provenance Set', curator: 'Mineral Registry Consortium', category: 'Minerals', image: '', assetCount: 0, verificationRatio: 0, researchLinked: 0, avgCompleteness: 0 },
    { id: 'educational-license-pack', name: 'Educational License Pack', curator: 'MCurator Education', category: 'Teaching', image: '', assetCount: 0, verificationRatio: 0, researchLinked: 0, avgCompleteness: 0 },
  ];

  var ASSETS = [
    mkAsset({ id: 'SAT-MC-000128', satId: 'SAT-MC-000128', title: 'White dragontail specimen', scientificName: 'Lamproptera curius', commonName: 'White dragontail', category: 'Insects', collectionId: 'educational-license-pack', collectionName: 'Educational License Pack', price: 1200, currency: 'TWD', verificationStatus: 'Curator verified', completeness: 86, licenseType: 'Education use', isResearchLinked: true, hasPassport: true, hasQr: true, hasPhysicalSpecimen: true, paymentMethods: ['card', 'bank_transfer', 'usdc'], locality: 'Sarawak, Malaysia', date: '2021-11-02', holder: 'James Aldridge', collector: 'Mira Chen', description: 'High-resolution teaching specimen image with passport linkage. Pinned voucher included — SAT and physical specimen transfer together.', listedAt: '2025-03-18' }),
    mkAsset({ id: 'SAT-MC-000129', satId: 'SAT-MC-000129', title: 'Golden metallic stag beetle plate', scientificName: 'Cyclommatus metallifer finae', commonName: 'Golden metallic stag beetle', category: 'Insects', collectionId: 'lucanidae-reference', collectionName: 'Lucanidae Reference Collection', price: 1400, verificationStatus: 'SAT graded', completeness: 92, licenseType: 'Academic use', isResearchLinked: true, hasPhysicalSpecimen: true, locality: 'Biak, Indonesia', date: '2019-04-21', holder: 'MCurator Archive', description: 'Archive-grade reference plate with locality and rights metadata. Museum-pinned holotype lot ships with SAT.', listedAt: '2025-03-10', trending: true }),
    mkAsset({ id: 'SAT-MC-000130', satId: 'SAT-MC-000130', title: 'Museum butterfly teaching plate', scientificName: 'Papilio memnon', commonName: 'Great Mormon', category: 'Insects', collectionId: 'educational-license-pack', collectionName: 'Educational License Pack', price: 2100, verificationStatus: 'Curator verified', completeness: 96, licenseType: 'Education use', paymentMethods: ['card'], locality: 'Nantou, Taiwan', date: '2023-03-18', holder: 'Lin Field Studio', listedAt: '2025-03-05' }),
    mkAsset({ id: 'SAT-MC-000131', satId: 'SAT-MC-000131', title: 'Research dataset shell lot', scientificName: 'Nerita albicilla', commonName: 'Toothed nerite', category: 'Marine', collectionId: 'marine-arthropod-records', collectionName: 'Marine Arthropod Records', price: 650, verificationStatus: 'Provenance complete', completeness: 81, licenseType: 'Academic use', isResearchLinked: true, paymentMethods: ['card', 'bank_transfer'], locality: 'Okinawa intertidal zone', date: '2020-11-08', holder: 'Okinawa Coastal Survey', listedAt: '2025-02-28' }),
    mkAsset({ id: 'SAT-MC-000132', satId: 'SAT-MC-000132', title: 'Greenland lobopodian plate (physical)', scientificName: 'Hadranax', commonName: 'Greenland lobopodian', category: 'Fossils', collectionId: 'fossil-trilobite-archive', collectionName: 'Fossil Trilobite Archive', price: 0, inquiryOnly: true, verificationStatus: 'SAT graded', completeness: 89, licenseType: 'Collector edition', hasPhysicalSpecimen: true, locality: 'North Greenland, Cambrian Sirius Passet', date: '2019-04-12', holder: 'Atlas Fossil Bench', description: 'Physical fossil plate — SAT and specimen transfer together. Request access for logistics and export review.', listedAt: '2025-02-20' }),
    mkAsset({ id: 'SAT-MC-000133', satId: 'SAT-MC-000133', title: 'Botanical scan teaching set', scientificName: 'Ginkgo biloba', commonName: 'Ginkgo leaf set', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 480, verificationStatus: 'Curator verified', completeness: 78, licenseType: 'Education use', paymentMethods: ['usdc', 'usdt', 'eth'], locality: 'Kyoto botanical collection', date: '2022-10-04', holder: 'Kyoto Teaching Herbarium', listedAt: '2025-03-01' }),
    mkAsset({ id: 'SAT-MC-000134', satId: 'SAT-MC-000134', title: 'Forked-jawed stag beetle license', scientificName: 'Hexarthrius mandibularis', commonName: 'Forked-jawed stag beetle', category: 'Insects', collectionId: 'lucanidae-reference', collectionName: 'Lucanidae Reference Collection', price: 2900, verificationStatus: 'Curator verified', completeness: 91, licenseType: 'Commercial use', hasPhysicalSpecimen: true, locality: 'Sulawesi, Indonesia', date: '2016-06-18', holder: 'A. Rahman', listedAt: '2025-02-15' }),
    mkAsset({ id: 'SAT-MC-000135', satId: 'SAT-MC-000135', title: 'Ant field record', scientificName: 'Paraponera clavata', commonName: 'Bullet ant', category: 'Insects', collectionId: 'lucanidae-reference', collectionName: 'Lucanidae Reference Collection', price: 720, verificationStatus: 'Provenance complete', completeness: 84, licenseType: 'Academic use', isResearchLinked: true, locality: 'Amazon basin, Peru', date: '2022-02-27', holder: 'Rainforest Field Unit', listedAt: '2025-03-12' }),
    mkAsset({ id: 'SAT-MC-000136', satId: 'SAT-MC-000136', title: 'Iridescent scarab collection edition', scientificName: 'Plusiotis chrysargirea', commonName: 'Silver gold scarab', category: 'Insects', collectionId: 'lucanidae-reference', collectionName: 'Lucanidae Reference Collection', price: 3800, verificationStatus: 'SAT graded', completeness: 95, licenseType: 'Collector edition', hasPhysicalSpecimen: true, locality: 'Talamanca, Costa Rica', date: '2021-04-06', holder: 'Bajo Chirripo Archive', trending: true, listedAt: '2025-03-08' }),
    mkAsset({ id: 'SAT-MC-000137', satId: 'SAT-MC-000137', title: 'Moth teaching image set', scientificName: 'Saturnia pyri', commonName: 'Great peacock moth', category: 'Insects', collectionId: 'educational-license-pack', collectionName: 'Educational License Pack', price: 980, verificationStatus: 'Curator verified', completeness: 83, licenseType: 'Education use', locality: 'Provence, France', date: '2020-05-28', holder: 'Camille Rousseau', listedAt: '2025-02-25' }),
    mkAsset({ id: 'SAT-MC-000138', satId: 'SAT-MC-000138', title: 'Morpho wing reference', scientificName: 'Morpho menelaus', commonName: 'Blue morpho', category: 'Insects', collectionId: 'educational-license-pack', collectionName: 'Educational License Pack', price: 2100, verificationStatus: 'Curator verified', completeness: 88, licenseType: 'Academic use', locality: 'Amazon, Brazil', date: '2022-08-11', holder: 'Amazon Visual Archive', listedAt: '2025-03-14' }),
    mkAsset({ id: 'SAT-MC-000139', satId: 'SAT-MC-000139', title: 'Marine data package', scientificName: 'Turbo marmoratus', commonName: 'Green turban snail', category: 'Marine', collectionId: 'marine-arthropod-records', collectionName: 'Marine Arthropod Records', price: 1800, verificationStatus: 'Provenance complete', completeness: 90, licenseType: 'Academic use', isResearchLinked: true, locality: 'Palawan, Philippines', date: '2023-01-18', holder: 'Marine Reference Lab', listedAt: '2025-03-06' }),
    mkAsset({ id: 'SAT-MC-000140', satId: 'SAT-MC-000140', title: 'Fungal teaching record', scientificName: 'Amanita muscaria', commonName: 'Fly agaric', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 320, verificationStatus: 'Provenance complete', completeness: 69, licenseType: 'Education use', locality: 'Hehuanshan, Taiwan', date: '2021-11-23', holder: 'Mountain Teaching Survey', listedAt: '2025-02-18' }),
    mkAsset({ id: 'SAT-MC-000141', satId: 'SAT-MC-000141', title: 'Museum beetle reference', scientificName: 'Aegus acuminatus', commonName: 'Aegus stag beetle', category: 'Insects', collectionId: 'lucanidae-reference', collectionName: 'Lucanidae Reference Collection', price: 1500, verificationStatus: 'Curator verified', completeness: 87, licenseType: 'Academic use', locality: 'Sabah, Malaysia', date: '2020-07-14', holder: 'North Borneo Plate Archive', listedAt: '2025-03-02' }),
    mkAsset({ id: 'SAT-MC-000142', satId: 'SAT-MC-000142', title: 'Botanical license sheet', scientificName: 'Ficus elastica', commonName: 'Rubber plant', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 860, verificationStatus: 'Curator verified', completeness: 79, licenseType: 'Commercial use', locality: 'Singapore greenhouse collection', date: '2022-06-09', holder: 'Teaching Herbarium Team', listedAt: '2025-02-22' }),
    mkAsset({ id: 'SAT-MC-000143', satId: 'SAT-MC-000143', title: 'Bumblebee provenance record', scientificName: 'Bombus terrestris', commonName: 'Buff-tailed bumblebee', category: 'Insects', collectionId: 'educational-license-pack', collectionName: 'Educational License Pack', price: 1100, verificationStatus: 'Provenance complete', completeness: 85, licenseType: 'Academic use', isResearchLinked: true, locality: 'Yorkshire, United Kingdom', date: '2023-05-13', holder: 'Pollinator Survey Unit', listedAt: '2025-03-11' }),
    mkAsset({ id: 'SAT-MC-000144', satId: 'SAT-MC-000144', title: 'Archive collection edition', scientificName: 'Ixorida venerea', commonName: 'Sulawesi flower chafer', category: 'Insects', collectionId: 'lucanidae-reference', collectionName: 'Lucanidae Reference Collection', price: 2400, verificationStatus: 'SAT graded', completeness: 93, licenseType: 'Collector edition', hasPhysicalSpecimen: true, locality: 'Sulawesi, Indonesia', date: '2021-03-26', holder: 'Island Biodiversity Archive', listedAt: '2025-03-07' }),
    mkAsset({ id: 'SAT-MC-000145', satId: 'SAT-MC-000145', title: 'Teaching fossil microplate', scientificName: 'Knightia eocaena', commonName: 'Fossil fish plate', category: 'Fossils', collectionId: 'fossil-trilobite-archive', collectionName: 'Fossil Trilobite Archive', price: 1650, verificationStatus: 'Curator verified', completeness: 82, licenseType: 'Education use', isResearchLinked: true, hasPhysicalSpecimen: true, locality: 'Wyoming, United States', date: '2018-07-19', holder: 'Green River Teaching Set', listedAt: '2025-03-09' }),
    mkAsset({ id: 'SAT-MC-000146', satId: 'SAT-MC-000146', title: 'Field station conservation allocation', scientificName: 'Lucanidae sp.', commonName: 'Stag beetle reference lot', category: 'Insects', collectionId: 'lucanidae-reference', collectionName: 'Lucanidae Reference Collection', price: 0, inquiryOnly: true, verificationStatus: 'Curator verified', completeness: 88, licenseType: 'Academic use', isResearchLinked: true, locality: 'Mindanao, Philippines', date: '2024-01-10', holder: 'Field Station Cooperative', description: 'Conservation-linked allocation — request license for terms.', listedAt: '2025-03-15' }),
    mkAsset({ id: 'SAT-MC-000147', satId: 'SAT-MC-000147', title: 'Quartz provenance specimen', scientificName: 'Quartz var. amethyst', commonName: 'Amethyst cluster', category: 'Minerals', collectionId: 'mineral-provenance-set', collectionName: 'Mineral Provenance Set', price: 2200, verificationStatus: 'Provenance complete', completeness: 94, licenseType: 'Display only', hasPhysicalSpecimen: true, locality: 'Minas Gerais, Brazil', date: '2017-03-04', holder: 'Mineral Registry Consortium', listedAt: '2025-03-13' }),
    mkAsset({ id: 'SAT-MC-000148', satId: 'SAT-MC-000148', title: 'Calcite teaching slab', scientificName: 'Calcite', commonName: 'Optical calcite', category: 'Minerals', collectionId: 'mineral-provenance-set', collectionName: 'Mineral Provenance Set', price: 890, verificationStatus: 'Curator verified', completeness: 76, licenseType: 'Education use', locality: 'Iceland spar locality', date: '2019-09-11', holder: 'Mineral Registry Consortium', listedAt: '2025-03-04' }),
    mkAsset({ id: 'SAT-MC-000149', satId: 'SAT-MC-000149', title: 'Maidenhair fern herbarium voucher', scientificName: 'Adiantum capillus-veneris', commonName: 'Maidenhair fern', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 540, verificationStatus: 'Curator verified', completeness: 88, licenseType: 'Education use', hasPhysicalSpecimen: true, locality: 'Taipei botanical garden', date: '2023-04-18', holder: 'Kyoto Teaching Herbarium', listedAt: '2025-03-19' }),
    mkAsset({ id: 'SAT-MC-000150', satId: 'SAT-MC-000150', title: 'Golden rain tree teaching plate', scientificName: 'Koelreuteria elegans', commonName: 'Golden rain tree', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 620, verificationStatus: 'Curator verified', completeness: 85, licenseType: 'Education use', hasPhysicalSpecimen: true, locality: 'Taichung, Taiwan', date: '2023-06-22', holder: 'Lin Mei-hua', listedAt: '2025-03-18' }),
    mkAsset({ id: 'SAT-MC-000151', satId: 'SAT-MC-000151', title: 'Pitcher plant reference voucher', scientificName: 'Nepenthes spp.', commonName: 'Pitcher plant', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 980, verificationStatus: 'SAT graded', completeness: 91, licenseType: 'Academic use', hasPhysicalSpecimen: true, isResearchLinked: true, locality: 'Borneo highland collection', date: '2019-05-18', holder: 'Research collection', listedAt: '2025-03-17' }),
    mkAsset({ id: 'SAT-MC-000152', satId: 'SAT-MC-000152', title: 'Sword fern classroom voucher', scientificName: 'Nephrolepis cordifolia', commonName: 'Sword fern', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 410, verificationStatus: 'Curator verified', completeness: 80, licenseType: 'Education use', hasPhysicalSpecimen: true, locality: 'Kyoto greenhouse', date: '2023-11-08', holder: 'Herbarium digitization', listedAt: '2025-03-16' }),
    mkAsset({ id: 'SAT-MC-000153', satId: 'SAT-MC-000153', title: 'Sensitive plant teaching voucher', scientificName: 'Mimosa pudica', commonName: 'Sensitive plant', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 390, verificationStatus: 'Provenance complete', completeness: 77, licenseType: 'Education use', hasPhysicalSpecimen: true, locality: 'Tropical greenhouse accession', date: '2022-03-14', holder: 'Teaching Herbarium Team', listedAt: '2025-03-15' }),
    mkAsset({ id: 'SAT-MC-000154', satId: 'SAT-MC-000154', title: 'Sundew carnivorous plant plate', scientificName: 'Drosera spp.', commonName: 'Sundew', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 720, verificationStatus: 'Curator verified', completeness: 86, licenseType: 'Academic use', hasPhysicalSpecimen: true, isResearchLinked: true, locality: 'Field collection team', date: '2022-07-11', holder: 'Kyoto Teaching Herbarium', listedAt: '2025-03-14' }),
    mkAsset({ id: 'SAT-MC-000155', satId: 'SAT-MC-000155', title: 'Sacred lotus morphology set', scientificName: 'Nelumbo nucifera', commonName: 'Sacred lotus', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 850, verificationStatus: 'Curator verified', completeness: 89, licenseType: 'Education use', hasPhysicalSpecimen: true, locality: 'Lotus pond teaching set', date: '2022-08-30', holder: 'Chen Yu', listedAt: '2025-03-13', trending: true }),
    mkAsset({ id: 'SAT-MC-000156', satId: 'SAT-MC-000156', title: 'Pine sapling herbarium voucher', scientificName: 'Pinus spp.', commonName: 'Pine', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 560, verificationStatus: 'Curator verified', completeness: 82, licenseType: 'Education use', hasPhysicalSpecimen: true, locality: 'Conifer teaching collection', date: '2024-02-16', holder: 'Herbarium digitization', listedAt: '2025-03-12' }),
    mkAsset({ id: 'SAT-MC-000157', satId: 'SAT-MC-000157', title: 'Staghorn fern living collection plate', scientificName: 'Platycerium spp.', commonName: 'Staghorn fern', category: 'Plants', collectionId: 'botanical-voucher-series', collectionName: 'Botanical Voucher Series', price: 1100, verificationStatus: 'SAT graded', completeness: 90, licenseType: 'Collector edition', hasPhysicalSpecimen: true, locality: 'Living collection greenhouse', date: '2023-09-04', holder: 'Living collection team', listedAt: '2025-03-11' }),
    mkPaleo('SAT-MC-000158', 'Yutyrannus huali', 'Feathered tyrannosaur', 'Feathered tyrannosaur restoration plate', 'dinosaur-paleo-gallery', 'Dinosaur & Paleontology Gallery', 3200, { trending: true, research: true, description: 'Early Cretaceous feathered tyrannosaur — scientific restoration with locality and citation metadata.', locality: 'Liaoning Province, China', date: '2012-04-13', listedAt: '2025-03-21' }),
    mkPaleo('SAT-MC-000159', 'Stegosaurus stenops', 'Stegosaurus', 'Stegosaurus stenops teaching plate', 'dinosaur-paleo-gallery', 'Dinosaur & Paleontology Gallery', 2800, { completeness: 91, description: 'Jurassic stegosaur restoration for museum education and licensed publication.', locality: 'Morrison Formation, USA', date: '1877-08-01', listedAt: '2025-03-21' }),
    mkPaleo('SAT-MC-000160', 'Tarbosaurus bataar', 'Tarbosaurus', 'Tarbosaurus bataar reference plate', 'dinosaur-paleo-gallery', 'Dinosaur & Paleontology Gallery', 3500, { trending: true, verification: 'SAT graded', description: 'Late Cretaceous tyrannosaurid reference imagery with provenance-forward metadata.', locality: 'Nemegt Formation, Mongolia', date: '1946-01-01', listedAt: '2025-03-20' }),
    mkPaleo('SAT-MC-000161', 'Zhenyuanlong suni', 'Zhenyuanlong', 'Zhenyuanlong feathered dromaeosaur plate', 'dinosaur-paleo-gallery', 'Dinosaur & Paleontology Gallery', 2100, { research: true, description: 'Feathered dromaeosaur restoration linked to research citation workflows.', locality: 'Liaoning, China', listedAt: '2025-03-20' }),
    mkPaleo('SAT-MC-000162', 'Zhuchengtyrannus magnus', 'Zhuchengtyrannus', 'Zhuchengtyrannus magnus gallery plate', 'dinosaur-paleo-gallery', 'Dinosaur & Paleontology Gallery', 2900, { verification: 'SAT graded', locality: 'Shandong, China', listedAt: '2025-03-19' }),
    mkPaleo('SAT-MC-000163', 'Zuniceratops christopheri', 'Zuniceratops', 'Zuniceratops ceratopsian teaching set', 'dinosaur-paleo-gallery', 'Dinosaur & Paleontology Gallery', 2400, { locality: 'New Mexico, USA', listedAt: '2025-03-19' }),
    mkPaleo('SAT-MC-000164', 'Balaur bondoc', 'Balaur', 'Balaur bondoc island theropod plate', 'dinosaur-paleo-gallery', 'Dinosaur & Paleontology Gallery', 1800, { research: true, locality: 'Hațeg Island, Romania', listedAt: '2025-03-18' }),
    mkPaleo('SAT-MC-000165', 'Yamaceratops dorngobiensis', 'Yamaceratops', 'Yamaceratops ceratopsian voucher', 'dinosaur-paleo-gallery', 'Dinosaur & Paleontology Gallery', 1900, { locality: 'Gobi Desert, Mongolia', listedAt: '2025-03-18' }),
    mkPaleo('SAT-MC-000166', 'Trilobita spp.', 'Trilobite', 'Trilobite reference teaching plate', 'fossil-trilobite-archive', 'Fossil Trilobite Archive', 980, { physical: true, description: 'Ordovician–Devonian trilobite slab documentation for comparative paleontology.', locality: 'Morocco', listedAt: '2025-03-17' }),
    mkPaleo('SAT-MC-000167', 'Asaphus kowalewskii', 'Asaphus trilobite', 'Asaphus kowalewskii museum plate', 'fossil-trilobite-archive', 'Fossil Trilobite Archive', 1450, { physical: true, research: true, locality: 'St. Petersburg region, Russia', listedAt: '2025-03-17' }),
    mkPaleo('SAT-MC-000168', 'Ammonoidea spp.', 'Ammonite', 'Ammonite spiral teaching plate', 'fossil-trilobite-archive', 'Fossil Trilobite Archive', 860, { description: 'Mesozoic ammonoid morphology series for stratigraphy teaching.', locality: 'Madagascar', listedAt: '2025-03-16' }),
    mkPaleo('SAT-MC-000169', 'Beelzebufo ampinga', 'Devil frog', 'Beelzebufo paleo amphibian plate', 'fossil-trilobite-archive', 'Fossil Trilobite Archive', 1320, { research: true, description: 'Cretaceous giant frog reconstruction with PBDB-linked stratigraphic context.', locality: 'Mahajanga Basin, Madagascar', listedAt: '2025-03-16' }),
    mkPaleo('SAT-MC-000170', 'Nipponites mirabilis', 'Nipponites ammonite', 'Nipponites mirabilis heteromorph ammonite', 'fossil-trilobite-archive', 'Fossil Trilobite Archive', 1750, { verification: 'SAT graded', research: true, locality: 'Japan', listedAt: '2025-03-15' }),
    mkPaleo('SAT-MC-000171', 'Ovatiovermis cribratus', 'Ovatiovermis', 'Ovatiovermis Cambrian animal plate', 'fossil-trilobite-archive', 'Fossil Trilobite Archive', 0, { inquiryOnly: true, research: true, description: 'Cambrian cycloneuralian — request access for research licensing and export review.', locality: 'Burgess Shale context, Canada', listedAt: '2025-03-15' }),
  ];

  var COLLECTION_I18N = {
    'lucanidae-reference': {
      name: '鍬形蟲參考典藏', curator: 'MCurator 鞘翅目實驗室',
      about: { en: 'Reference-grade lucanid plates and field lots with locality, taxonomy, and rights metadata for teaching and research citation.', zh: '典藏級鍬形蟲科參考圖版與田野批次，含產地、分類與權利元資料，供教學與研究引用。' },
      focus: { en: 'Stag beetles (Lucanidae), morphology series, population genetics vouchers.', zh: '鍬形蟲科、形態系列、族群遺傳標本。' },
    },
    'fossil-trilobite-archive': {
      name: '三葉蟲化石檔案', curator: 'Atlas 古生物單位',
      about: { en: 'Fossil plates and teaching microplates with stratigraphic context and export-ready provenance records.', zh: '化石圖版與教學微圖版，附地層背景與可匯出來源紀錄。' },
      focus: { en: 'Trilobites, ammonites, and associated Palaeozoic teaching sets.', zh: '三葉蟲、菊石及古生代教學套件。' },
    },
    'dinosaur-paleo-gallery': {
      name: '恐龍與古生物圖庫', curator: 'Atlas 古生物單位',
      about: { en: 'Scientific dinosaur restorations and paleontology teaching plates with stratigraphic metadata and research citation support.', zh: '科學復原恐龍與古生物教學圖版，附地層元資料與研究引用支援。' },
      focus: { en: 'Theropods, ceratopsians, stegosaurs, and Mesozoic teaching reconstructions.', zh: '獸腳類、角龍類、劍龍類及中生代教學復原。' },
    },
    'botanical-voucher-series': {
      name: '植物標本系列', curator: '京都教學標本館',
      about: { en: 'Herbarium-linked scans and voucher sheets for classroom and license workflows.', zh: '連結標本館的掃描與標本單，支援教室與授權流程。' },
      focus: { en: 'Voucher plants, leaf sets, and greenhouse teaching accessions.', zh: '植物標本、葉片組與溫室教學藏品。' },
    },
    'marine-arthropod-records': {
      name: '海洋節肢動物紀錄', curator: '海洋參考實驗室',
      about: { en: 'Intertidal and coastal lots with research-linked dataset shells and passport metadata.', zh: '潮間帶與沿岸批次，含研究連結資料殼層與護照元資料。' },
      focus: { en: 'Marine gastropods, intertidal surveys, and coastal reference imagery.', zh: '海洋腹足類、潮間帶調查與沿岸參考影像。' },
    },
    'mineral-provenance-set': {
      name: '礦物來源套件', curator: '礦物登錄聯盟',
      about: { en: 'Provenance-documented mineral specimens with chain-of-custody and display licensing options.', zh: '具來源文件的礦物標本，含保管鏈與展示授權選項。' },
      focus: { en: 'Quartz varieties, calcite teaching slabs, and registry-grade locality records.', zh: '石英類、冰洲石教學板與登錄級產地紀錄。' },
    },
    'educational-license-pack': {
      name: '教學授權套件', curator: 'MCurator 教育',
      about: { en: 'Curated teaching assets with education-use licenses and passport-linked imagery.', zh: '精選教學資產，含教學授權與護照連結影像。' },
      focus: { en: 'Butterfly plates, teaching scans, and classroom-ready SAT bundles.', zh: '蝴蝶圖版、教學掃描與教室就緒 SAT 套件。' },
    },
  };

  var SEARCH_ALIASES = {
    '鍬形蟲': 'lucanidae stag beetle dorcus cyclommatus aegus lucanidae-reference',
    '三葉蟲': 'trilobite trilobita fossil-trilobite',
    '化石': 'fossil fossils trilobite knightia dinosaur yutyrannus stegosaurus tarbosaurus ammonite',
    '恐龍': 'dinosaur yutyrannus stegosaurus tarbosaurus ceratops zuniceratops zhuchengtyrannus balaur',
    '古生物': 'paleontology fossil dinosaur trilobite ammonite cambrian hadranax ovatiovermis',
    paleontology: 'paleontology fossil dinosaur trilobite ammonite yutyrannus stegosaurus tarbosaurus',
    dinosaur: 'dinosaur yutyrannus stegosaurus tarbosaurus ceratops zuniceratops zhuchengtyrannus',
    dinosaurs: 'dinosaur yutyrannus stegosaurus tarbosaurus ceratops zuniceratops zhuchengtyrannus',
    '實體標本': 'physical specimen hasphysical',
    '實體': 'physical specimen hasphysical',
    '護照': 'passport haspassport',
    '昆蟲': 'insect insects',
    '植物': 'plant plants botanical ginkgo ficus adiantum nepenthes nelumbo koelreuteria mimosa drosera pinus platycerium nephrolepis',
    '海洋': 'marine nerita turbo mollusc',
    '礦物': 'mineral quartz calcite amethyst',
    '弄蝶': 'meges dragontail lamproptera',
    '鍬形虫': 'lucanidae stag beetle',
  };

  var ASSET_I18N = {
    'SAT-MC-000128': { commonName: '白點綠弄蝶', description: '高解析教學標本影像，連結護照。含針插標本 — SAT 與實體標本須一併移交。' },
    'SAT-MC-000129': { commonName: '金屬光鍬形蟲', description: '典藏級參考圖版，含產地與權利元資料。博物館針插模式標本與 SAT 一併交付。', keywords: '鍬形蟲 cyclommatus stag lucanidae' },
    'SAT-MC-000130': { commonName: '異型紫斑蝶' },
    'SAT-MC-000131': { commonName: '齒紋蜒螺' },
    'SAT-MC-000132': { commonName: '格陵蘭葉足類', description: '實體化石圖版 — SAT 與標本須一併移交。請申請存取以安排物流與出口審查。', keywords: '化石 hadranax cambrian lobopodian' },
    'SAT-MC-000133': { commonName: '銀杏葉組' },
    'SAT-MC-000134': { commonName: '坦特島鍬形蟲' },
    'SAT-MC-000135': { commonName: '子彈蟻' },
    'SAT-MC-000136': { commonName: '金綠金龜' },
    'SAT-MC-000137': { commonName: '大孔雀蛾' },
    'SAT-MC-000138': { commonName: '大藍閃蝶' },
    'SAT-MC-000139': { commonName: '球蝸牛', description: '海洋研究資料套件，含完整來源與授權元資料。' },
    'SAT-MC-000140': { commonName: '毒蠅傘' },
    'SAT-MC-000141': { commonName: '細角鍬形蟲', keywords: '鍬形蟲 lucanidae stag' },
    'SAT-MC-000142': { commonName: '橡膠樹' },
    'SAT-MC-000143': { commonName: '熊蜂' },
    'SAT-MC-000144': { commonName: '蘇拉威西花金龜' },
    'SAT-MC-000145': { commonName: '化石魚板' },
    'SAT-MC-000146': { commonName: '鍬形蟲參考批', description: '保育連結分配 — 請申請授權以了解條款。' },
    'SAT-MC-000147': { commonName: '紫水晶簇', description: '含完整來源紀錄的展示級礦物標本；SAT 與實體一併移交。' },
    'SAT-MC-000148': { commonName: '冰洲石' },
    'SAT-MC-000149': { commonName: '維毛鐵角蕨', keywords: 'adiantum fern 蕨類' },
    'SAT-MC-000150': { commonName: '台灣欒樹', keywords: 'koelreuteria golden rain 植物' },
    'SAT-MC-000151': { commonName: '豬籠草', keywords: 'nepenthes pitcher 食蟲植物' },
    'SAT-MC-000152': { commonName: '腎蕨', keywords: 'nephrolepis fern 蕨類' },
    'SAT-MC-000153': { commonName: '含羞草', keywords: 'mimosa sensitive plant' },
    'SAT-MC-000154': { commonName: '茅膏菜', keywords: 'drosera sundew 食蟲植物' },
    'SAT-MC-000155': { commonName: '蓮', keywords: 'nelumbo lotus 植物' },
    'SAT-MC-000156': { commonName: '松', keywords: 'pinus pine 植物' },
    'SAT-MC-000157': { commonName: '鹿角蕨', keywords: 'platycerium staghorn fern 蕨類' },
    'SAT-MC-000158': { commonName: '羽暴龍', keywords: 'yutyrannus 恐龍 古生物 tyrannosaur' },
    'SAT-MC-000159': { commonName: '劍龍', keywords: 'stegosaurus 恐龍 古生物' },
    'SAT-MC-000160': { commonName: '塔爾博斯龍', keywords: 'tarbosaurus 恐龍 古生物 tyrannosaur' },
    'SAT-MC-000161': { commonName: '緯元龍', keywords: 'zhenyuanlong 恐龍 古生物 dromaeosaur' },
    'SAT-MC-000162': { commonName: '諸城暴龍', keywords: 'zhuchengtyrannus 恐龍 古生物' },
    'SAT-MC-000163': { commonName: '祖尼角龍', keywords: 'zuniceratops 恐龍 古生物 ceratopsian' },
    'SAT-MC-000164': { commonName: '巴拉烏爾龍', keywords: 'balaur 恐龍 古生物' },
    'SAT-MC-000165': { commonName: '馬鞍山角龍', keywords: 'yamaceratops 恐龍 古生物' },
    'SAT-MC-000166': { commonName: '三葉蟲', keywords: 'trilobite 化石 古生物' },
    'SAT-MC-000167': { commonName: '阿薩夫三葉蟲', keywords: 'asaphus trilobite 化石 古生物' },
    'SAT-MC-000168': { commonName: '菊石', keywords: 'ammonite ammonoidea 化石 古生物' },
    'SAT-MC-000169': { commonName: '魔鬼蛙', keywords: 'beelzebufo 古生物 化石 amphibian' },
    'SAT-MC-000170': { commonName: '日本菊石', keywords: 'nipponites ammonite 化石 古生物' },
    'SAT-MC-000171': { commonName: '奧瓦蟲', keywords: 'ovatiovermis cambrian 古生物 化石' },
  };

  var TABS = [
    ['all', 'all-tab'],
    ['verified', 'verified'],
    ['research', 'research'],
    ['fossils', 'fossils'],
    ['insects', 'insects'],
    ['plants', 'plants'],
    ['marine', 'marine'],
    ['minerals', 'minerals'],
    ['new', 'new'],
    ['trending', 'trending'],
    ['recent-verified', 'recent-verified'],
  ];

  var DETAIL_TAB_LABELS = {
    overview: { en: 'Overview', zh: '概覽' },
    passport: { en: 'Passport', zh: '護照' },
    provenance: { en: 'Provenance', zh: '來源履歷' },
    rights: { en: 'Rights', zh: '權利' },
    metadata: { en: 'Metadata', zh: '元資料' },
    activity: { en: 'Activity', zh: '動態' },
  };

  function tabLabel(key) {
    return railLabel(key, key);
  }

  function detailTabLabel(key) {
    var pack = DETAIL_TAB_LABELS[key];
    if (!pack) return key;
    return v3IsZh() ? pack.zh : pack.en;
  }

  var HERO_PICKS = ['SAT-MC-000158', 'SAT-MC-000160', 'SAT-MC-000132', 'SAT-MC-000159', 'SAT-MC-000166'];

  var SORTS = [
    ['recently-listed', 'sort-recently-listed'],
    ['recently-verified', 'sort-recently-verified'],
    ['completeness-desc', 'sort-completeness-desc'],
    ['price-asc', 'sort-price-asc'],
    ['price-desc', 'sort-price-desc'],
    ['research-value', 'sort-research-value'],
  ];

  var SORT_LABELS = {
    'sort-recently-listed': { en: 'Recently listed', zh: '最近上架' },
    'sort-recently-verified': { en: 'Recently verified', zh: '近期驗證' },
    'sort-completeness-desc': { en: 'Completeness high to low', zh: '完整度由高到低' },
    'sort-price-asc': { en: 'Price low to high', zh: '價格由低到高' },
    'sort-price-desc': { en: 'Price high to low', zh: '價格由高到低' },
    'sort-research-value': { en: 'Research value', zh: '研究價值' },
  };

  function sortLabel(key) {
    var pack = SORT_LABELS[key];
    if (!pack) return key;
    return v3IsZh() ? pack.zh : pack.en;
  }

  function categoryOptLabel(val) {
    var map = {
      Insects: { en: 'Insects', zh: '昆蟲' },
      Plants: { en: 'Plants', zh: '植物' },
      Marine: { en: 'Marine', zh: '海洋' },
      Fossils: { en: 'Fossils & Paleontology', zh: '化石與古生物' },
      Minerals: { en: 'Minerals', zh: '礦物' },
    };
    var pack = map[val];
    if (!pack) return val;
    return v3IsZh() ? pack.zh : pack.en;
  }

  function verificationOptLabel(val) {
    var map = {
      'Curator verified': { en: 'Curator verified', zh: '策展人驗證' },
      'SAT graded': { en: 'SAT graded', zh: 'SAT 分級' },
      'Provenance complete': { en: 'Provenance complete', zh: '來源完整' },
    };
    var pack = map[val];
    if (!pack) return val;
    return v3IsZh() ? pack.zh : pack.en;
  }

  function licenseOptLabel(val) {
    var map = {
      'Academic use': { en: 'Academic use', zh: '學術使用' },
      'Education use': { en: 'Education use', zh: '教學使用' },
      'Commercial use': { en: 'Commercial use', zh: '商業使用' },
      'Collector edition': { en: 'Collector edition', zh: '典藏版' },
      'Display only': { en: 'Display only', zh: '僅展示' },
    };
    var pack = map[val];
    if (!pack) return val;
    return v3IsZh() ? pack.zh : pack.en;
  }

  function completenessOptLabel(val) {
    var map = {
      high: { en: 'High (80%+)', zh: '高（80%+）' },
      mid: { en: 'Medium (60–79%)', zh: '中（60–79%）' },
      low: { en: 'Below 60%', zh: '低於 60%' },
    };
    var pack = map[val];
    if (!pack) return val;
    return v3IsZh() ? pack.zh : pack.en;
  }

  function categorySelectPairs(includeAny) {
    var cats = ['Insects', 'Plants', 'Marine', 'Fossils', 'Minerals'];
    var pairs = cats.map(function (c) { return [c, categoryOptLabel(c)]; });
    if (includeAny) pairs.unshift(['', v3T('Any', '全部')]);
    return pairs;
  }

  function licenseSelectPairs(includeAny) {
    var opts = ['Academic use', 'Education use', 'Commercial use', 'Collector edition', 'Display only'];
    var pairs = opts.map(function (o) { return [o, licenseOptLabel(o)]; });
    if (includeAny) pairs.unshift(['', v3T('Any', '全部')]);
    return pairs;
  }

  function collectionDisplayName(c) {
    if (!c) return '';
    if (!v3IsZh()) return c.name;
    var pack = COLLECTION_I18N[c.id];
    return (pack && pack.name) || c.name;
  }

  function collectionDisplayCurator(c) {
    if (!c) return '';
    if (!v3IsZh()) return c.curator;
    var pack = COLLECTION_I18N[c.id];
    return (pack && pack.curator) || c.curator;
  }

  function assetCollectionDisplayName(a) {
    if (!a) return '';
    if (!v3IsZh()) return a.collectionName;
    var pack = COLLECTION_I18N[a.collectionId];
    return (pack && pack.name) || a.collectionName;
  }

  function assetDisplayCommonName(a) {
    if (!a || !a.commonName) return '';
    if (!v3IsZh()) return a.commonName;
    var pack = ASSET_I18N[a.id];
    return (pack && pack.commonName) || a.commonName;
  }

  function assetDisplayTitle(a) {
    if (!a) return '';
    var cn = assetDisplayCommonName(a);
    if (cn) return cn;
    return a.title || a.commonName || a.scientificName || '';
  }

  function assetDisplayDescription(a) {
    var fallback = v3T(
      'Verified specimen-linked scientific asset with export-ready metadata.',
      '已驗證的標本連結科學資產，含可匯出元資料。'
    );
    if (!a || !a.description) return fallback;
    if (!v3IsZh()) return a.description;
    var pack = ASSET_I18N[a.id];
    return (pack && pack.description) || a.description;
  }

  function provenanceTypeLabel(type) {
    var map = {
      collected: { en: 'Collected', zh: '採集' },
      digitized: { en: 'Digitized', zh: '數位化' },
      taxonomy: { en: 'Taxonomy', zh: '分類學' },
      'sat-created': { en: 'SAT issued', zh: 'SAT 發行' },
      listed: { en: 'Listed', zh: '上架' },
    };
    var pack = map[type];
    if (!pack) return type;
    return v3IsZh() ? pack.zh : pack.en;
  }

  function provenanceNoteDisplay(e, a) {
    if (!v3IsZh()) return e.note || '';
    if (e.type === 'collected') return '田野採集已記錄。';
    if (e.type === 'digitized') return '高解析影像採集。';
    if (e.type === 'taxonomy') return '學名已驗證。';
    if (e.type === 'sat-created') return '科學資產代幣（SAT）已發行。';
    if (e.type === 'listed') return '已於 SAT 市集上架。';
    if (e.type === 'verification') {
      return '驗證狀態更新 — ' + (verificationOptLabel(a.verificationStatus) || a.verificationStatus) + '。';
    }
    return e.note || '';
  }

  function activityTypeLabel(type) {
    var map = {
      listing: { en: 'Listing', zh: '上架' },
      verification: { en: 'Verification', zh: '驗證' },
    };
    var pack = map[type];
    if (!pack) return type;
    return v3IsZh() ? pack.zh : pack.en;
  }

  function activityNoteDisplay(ev, a) {
    if (!v3IsZh()) return ev.note || '';
    if (ev.type === 'listing') return '上架已建立。';
    if (ev.type === 'verification') {
      return '驗證狀態更新 — ' + (verificationOptLabel(a.verificationStatus) || a.verificationStatus) + '。';
    }
    return ev.note || '';
  }

  function collectionI18nText(c, field) {
    var pack = COLLECTION_I18N[c.id];
    if (!pack || !pack[field]) return '';
    var val = pack[field];
    if (typeof val === 'string') return val;
    return v3IsZh() ? val.zh : val.en;
  }

  function assetSearchBlob(a) {
    var parts = [
      a.id, a.satId, a.title, a.scientificName, a.commonName, a.locality,
      a.collectionName, a.category, a.description, a.holder, a.collector, a.licenseType,
    ];
    var pack = ASSET_I18N[a.id];
    if (pack) {
      if (pack.commonName) parts.push(pack.commonName);
      if (pack.description) parts.push(pack.description);
      if (pack.keywords) parts.push(pack.keywords);
    }
    var coll = COLLECTION_I18N[a.collectionId];
    if (coll) {
      if (coll.name) parts.push(coll.name);
      if (coll.curator) parts.push(coll.curator);
      if (coll.about) parts.push(coll.about.zh, coll.about.en);
      if (coll.focus) parts.push(coll.focus.zh, coll.focus.en);
    }
    parts.push(
      categoryOptLabel(a.category), licenseOptLabel(a.licenseType),
      verificationOptLabel(a.verificationStatus)
    );
    if (a.hasPhysicalSpecimen) parts.push('physical specimen', '實體標本', 'hasphysical');
    if (a.hasPassport) parts.push('passport', '護照');
    if (a.isResearchLinked) parts.push('research', '研究');
    return lower(parts.join(' '));
  }

  function searchTermsFromQuery(q) {
    q = lower(String(q || '').trim());
    if (!q) return { alias: false, terms: [] };
    if (SEARCH_ALIASES[q]) {
      return { alias: true, terms: SEARCH_ALIASES[q].split(/\s+/).filter(Boolean) };
    }
    return { alias: false, terms: q.split(/\s+/).filter(Boolean) };
  }

  function assetMatchesSearch(a, q) {
    var parsed = searchTermsFromQuery(q);
    if (!parsed.terms.length) return true;
    var blob = assetSearchBlob(a);
    if (parsed.alias) {
      for (var i = 0; i < parsed.terms.length; i++) {
        if (blob.indexOf(parsed.terms[i]) >= 0) return true;
      }
      return false;
    }
    for (var j = 0; j < parsed.terms.length; j++) {
      if (blob.indexOf(parsed.terms[j]) < 0) return false;
    }
    return true;
  }

  function highlightText(text, q) {
    var safe = esc(String(text == null ? '' : text));
    q = String(q || '').trim();
    if (!q || !safe) return safe;
    var parsed = searchTermsFromQuery(q);
    var terms = parsed.terms.slice();
    if (!terms.length) terms = [lower(q)];
    if (!parsed.alias) terms.unshift(lower(q));
    terms = terms.filter(function (t, idx, arr) {
      return t && (t.length >= 2 || /[0-9]/.test(t)) && arr.indexOf(t) === idx;
    });
    terms.sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      safe = safe.replace(re, '<mark class="mc-sat-v3-hl">$1</mark>');
    }
    return safe;
  }

  function cardHighlight(text) {
    var q = String(state.q || '').trim();
    if (!q) return esc(text);
    return highlightText(text, q);
  }

  function searchContextHtml(count) {
    var q = String(state.q || '').trim();
    if (!q) return '';
    return '<p class="mc-sat-v3-search-context">' +
      esc(v3T('Results for', '搜尋結果')) + ': <strong>' + esc(q) + '</strong> · ' +
      esc(String(count)) + ' ' + esc(v3T('matches', '筆符合')) +
      ' <button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-text" data-v3-clear-search>' +
      esc(v3T('Clear search', '清除搜尋')) + '</button></p>';
  }

  function hasActiveFilters() {
    var f = state.filters;
    return !!(f.category || f.verification || f.completeness || f.license ||
      f.researchLinked || f.hasPassport || f.hasQr || f.hasPhysicalSpecimen ||
      f.priceMin || f.priceMax || String(state.q || '').trim());
  }

  function emptySearchSuggestionsHtml() {
    var chips = ['鍬形蟲', '巨叉鍬形蟲', '銀杏', '蓮', '豬籠草', 'Nelumbo', 'SAT-MC-000151'];
    return '<div class="mc-sat-v3-search-suggestions"><span class="mc-sat-v3-search-suggestions-label">' +
      esc(v3T('Try searching for', '試試搜尋')) + '</span>' +
      chips.map(function (c) {
        return '<button type="button" class="mc-sat-v3-search-chip" data-v3-search-suggest="' + escAttr(c) + '">' + esc(c) + '</button>';
      }).join('') + '</div>';
  }

  function emptyGridHtml() {
    var msg = v3T('No assets match your filters.', '沒有符合篩選的資產。');
    if (String(state.q || '').trim()) {
      msg = v3T('No results for your search.', '找不到符合搜尋的資產。');
    }
    return '<div class="mc-sat-v3-empty">' +
      '<p>' + esc(msg) + '</p>' +
      (hasActiveFilters() ? emptySearchSuggestionsHtml() : '') +
      (hasActiveFilters() ? '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline" data-v3-clear-filters>' +
        esc(v3T('Clear all filters', '清除所有篩選')) + '</button>' : '') +
      '</div>';
  }

  var langWatchBound = false;
  function bindLangWatch() {
    if (langWatchBound) return;
    langWatchBound = true;
    var last = v3IsZh() ? 'zh' : 'en';
    setInterval(function () {
      if (!document.getElementById(ROOT_ID)) return;
      var cur = v3IsZh() ? 'zh' : 'en';
      if (cur !== last) {
        last = cur;
        paint();
      }
    }, 600);
    try {
      var obs = new MutationObserver(function () {
        if (document.getElementById(ROOT_ID)) paint();
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    } catch (eObs) {}
  }

  function loadWatch() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(WATCH_KEY);
      if (raw) state.watch = JSON.parse(raw) || {};
    } catch (e) {}
  }
  function saveWatch() {
    try { if (global.localStorage) global.localStorage.setItem(WATCH_KEY, JSON.stringify(state.watch)); } catch (e) {}
  }
  loadWatch();

  try {
    var railPref = global.sessionStorage && global.sessionStorage.getItem('mcSatV3RailExpanded');
    if (railPref === '1') state.railExpanded = true;
  } catch (eRail) {}

  function saveRailExpanded() {
    try {
      if (global.sessionStorage) global.sessionStorage.setItem('mcSatV3RailExpanded', state.railExpanded ? '1' : '0');
    } catch (e) {}
  }

  function toggleRailExpanded(force) {
    state.railExpanded = typeof force === 'boolean' ? force : !state.railExpanded;
    saveRailExpanded();
    syncRailExpandedDom();
  }

  function syncRailExpandedDom() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var app = root.querySelector('.mc-sat-v3-app');
    var rail = root.querySelector('.mc-sat-v3-catalog-rail');
    if (app) app.classList.toggle('is-rail-expanded', !!state.railExpanded);
    if (rail) rail.classList.toggle('is-expanded', !!state.railExpanded || !!state.sidebarOpen);
    var expandBtn = root.querySelector('[data-v3-rail-expand]');
    if (expandBtn) expandBtn.setAttribute('aria-expanded', state.railExpanded ? 'true' : 'false');
  }

  function assignHeroPhoto(a) {
    if (typeof global.MC_SAT_findHeroPhoto === 'function') {
      var heroUrl = global.MC_SAT_findHeroPhoto(a.scientificName);
      if (heroUrl) {
        a.image = heroUrl;
        a.detailImage = heroUrl;
        return true;
      }
    }
    if (typeof global.MC_SAT_findNamedSpecimen === 'function' && typeof global.MC_SAT_namedSpecimenPhotoUrl === 'function') {
      var named = global.MC_SAT_findNamedSpecimen(a.scientificName);
      if (named) {
        a.image = global.MC_SAT_namedSpecimenPhotoUrl(named);
        a.detailImage = a.image;
        return true;
      }
    }
    return false;
  }

  function enrichImages() {
    ASSETS.forEach(function (a) {
      a.hasHeroPhoto = assignHeroPhoto(a);
    });
    var photoAssets = ASSETS.filter(function (a) {
      return !!a.hasHeroPhoto;
    });
    ASSETS.length = 0;
    photoAssets.forEach(function (a) {
      ASSETS.push(a);
    });
    var heroIds = [];
    ASSETS.filter(function (a) {
      return !!a.trending;
    }).forEach(function (a) {
      if (heroIds.indexOf(a.id) < 0) heroIds.push(a.id);
    });
    ASSETS.slice(0, 12).forEach(function (a) {
      if (heroIds.length >= 5) return;
      if (heroIds.indexOf(a.id) < 0) heroIds.push(a.id);
    });
    HERO_PICKS = heroIds.slice(0, 5);
    COLLECTIONS.forEach(function (c) {
      var items = ASSETS.filter(function (a) {
        return a.collectionId === c.id;
      });
      c.image = items.length && items[0].image ? items[0].image : '';
      refreshCollectionStats(c);
    });
  }

  function refreshCollectionStats(c) {
    var items = ASSETS.filter(function (a) { return a.collectionId === c.id; });
    c.assetCount = items.length;
    var verified = 0;
    var research = 0;
    var compSum = 0;
    items.forEach(function (a) {
      if (isVerified(a)) verified++;
      if (a.isResearchLinked) research++;
      compSum += Number(a.completeness) || 0;
    });
    c.verificationRatio = items.length ? Math.round(100 * verified / items.length) : 0;
    c.researchLinked = research;
    c.avgCompleteness = items.length ? Math.round(compSum / items.length) : 0;
  }

  function refreshAllCollectionStats() {
    COLLECTIONS.forEach(refreshCollectionStats);
  }

  enrichImages();
  refreshAllCollectionStats();

  function isVerified(a) {
    return /verified|graded|complete/i.test(String(a.verificationStatus || ''));
  }

  function priceLabel(a) {
    if (a.inquiryOnly || Number(a.price) === 0) return v3T('Request access', '申請存取');
    if (a.currency === 'TWD') return 'NT$ ' + Number(a.price).toLocaleString();
    return a.currency + ' ' + Number(a.price).toLocaleString();
  }

  function findAsset(id) {
    for (var i = 0; i < ASSETS.length; i++) if (ASSETS[i].id === id || ASSETS[i].satId === id) return ASSETS[i];
    return null;
  }

  function findCollection(slug) {
    slug = lower(slug);
    for (var i = 0; i < COLLECTIONS.length; i++) {
      if (COLLECTIONS[i].id === slug || slugify(COLLECTIONS[i].name) === slug) return COLLECTIONS[i];
    }
    return null;
  }

  function parseRoute() {
    var raw = String(global.location.hash || '').replace(/^#\/?/, '');
    var out = { view: 'home', assetId: '', collectionSlug: '' };
    if (/^marketplace\/about\/?$/.test(raw) || /^sat-market\/about\/?$/.test(raw)) {
      out.view = 'about';
      return out;
    }
    if (/^marketplace\/asset\//.test(raw) || /^sat-market\/asset\//.test(raw)) {
      out.view = 'asset';
      out.assetId = decodeURIComponent(raw.split('/asset/')[1].split('/')[0] || '');
      return out;
    }
    if (/^marketplace\/collection\//.test(raw) || /^sat-market\/collection\//.test(raw)) {
      out.view = 'collection';
      out.collectionSlug = decodeURIComponent(raw.split('/collection/')[1].split('/')[0] || '');
      return out;
    }
    if (/^sat\//.test(raw)) {
      out.view = 'asset';
      out.assetId = decodeURIComponent(raw.replace(/^sat\//, ''));
      return out;
    }
    if (/^dashboard\/marketplace(\/(new|list))?$/.test(raw) || raw === 'dashboard/marketplace') {
      out.view = 'list';
      return out;
    }
    return out;
  }

  function matchesTab(a, tab) {
    if (!tab || tab === 'all') return true;
    if (tab === 'verified') return isVerified(a);
    if (tab === 'research') return !!a.isResearchLinked;
    if (tab === 'fossils') return lower(a.category) === 'fossils';
    if (tab === 'insects') return lower(a.category) === 'insects';
    if (tab === 'plants') return lower(a.category) === 'plants';
    if (tab === 'marine') return lower(a.category) === 'marine';
    if (tab === 'minerals') return lower(a.category) === 'minerals';
    if (tab === 'new') return String(a.listedAt || '') >= '2025-03-01';
    if (tab === 'trending') return !!a.trending;
    if (tab === 'recent-verified') return isVerified(a) && String(a.listedAt || '') >= '2025-03-01';
    return true;
  }

  function filterPass(a) {
    if (!matchesTab(a, state.tab)) return false;
    if (state.route.view === 'collection' && state.route.collectionSlug) {
      var col = findCollection(state.route.collectionSlug);
      if (col && a.collectionId !== col.id) return false;
    }
    var f = state.filters;
    if (f.category && lower(a.category) !== lower(f.category)) return false;
    if (f.verification && lower(a.verificationStatus) !== lower(f.verification)) return false;
    if (f.license && lower(a.licenseType) !== lower(f.license)) return false;
    if (f.researchLinked && !a.isResearchLinked) return false;
    if (f.hasPassport && !a.hasPassport) return false;
    if (f.hasQr && !a.hasQr) return false;
    if (f.hasPhysicalSpecimen && !a.hasPhysicalSpecimen) return false;
    if (f.completeness === 'high' && Number(a.completeness) < 85) return false;
    if (f.completeness === 'mid' && (Number(a.completeness) < 70 || Number(a.completeness) >= 85)) return false;
    if (f.completeness === 'low' && Number(a.completeness) >= 70) return false;
    if (f.priceMin && Number(a.price) < Number(f.priceMin)) return false;
    if (f.priceMax && Number(a.price) > Number(f.priceMax)) return false;
    var q = state.q;
    if (q && !assetMatchesSearch(a, q)) return false;
    return true;
  }

  function sorted(list) {
    var out = list.slice();
    if (state.sort === 'recently-verified') out.sort(function (x, y) { return String(y.listedAt).localeCompare(String(x.listedAt)); });
    else if (state.sort === 'completeness-desc') out.sort(function (x, y) { return Number(y.completeness) - Number(x.completeness); });
    else if (state.sort === 'price-asc') out.sort(function (x, y) { return Number(x.price) - Number(y.price); });
    else if (state.sort === 'price-desc') out.sort(function (x, y) { return Number(y.price) - Number(x.price); });
    else if (state.sort === 'research-value') out.sort(function (x, y) { return (y.isResearchLinked ? 1 : 0) - (x.isResearchLinked ? 1 : 0) || Number(y.completeness) - Number(x.completeness); });
    else out.sort(function (x, y) { return String(y.listedAt).localeCompare(String(x.listedAt)); });
    return out;
  }

  function filtered() { return sorted(ASSETS.filter(filterPass)); }

  function isLoggedIn() {
    try { return document.documentElement.classList.contains('mc-entered'); } catch (e) { return false; }
  }

  function loginToastLabel(label) {
    var map = {
      'sign in': { en: 'Please sign in', zh: '請登入' },
      'list a record': { en: 'Sign in to list a record', zh: '請登入以上架紀錄' },
      'publish a listing': { en: 'Sign in to publish a listing', zh: '請登入以發布上架' },
      purchase: { en: 'Sign in to purchase', zh: '請登入以購買' },
    };
    var pack = map[label];
    if (pack) return v3IsZh() ? pack.zh : pack.en;
    return v3T('Sign in to ' + label, '請登入以' + label);
  }

  function requireLogin(label) {
    if (isLoggedIn()) return true;
    showToast(loginToastLabel(label));
    if (typeof global.openMcEntryModal_ === 'function') global.openMcEntryModal_('login');
    return false;
  }

  function showToast(text) {
    state.toast = text;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { state.toast = ''; syncToast(); });
    syncToast();
  }

  function syncToast() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var el = root.querySelector('.mc-sat-v3-toast');
    if (state.toast) {
      if (!el) { el = document.createElement('div'); el.className = 'mc-sat-v3-toast'; root.appendChild(el); }
      el.textContent = state.toast;
    } else if (el) el.remove();
  }

  function go(path) {
    try { global.location.hash = '#/' + String(path || 'marketplace').replace(/^\/+/, ''); } catch (e) {}
    if (global.MCRouter && typeof global.MCRouter.render === 'function') global.MCRouter.render();
    else render();
  }

  function sidebarActiveKey() {
    if (state.sidebarNav) return state.sidebarNav;
    if (state.route.view === 'about') return 'about';
    if (state.route.view === 'list') return 'list-record';
    if (state.route.view === 'collection') return 'archives';
    if (state.filters.hasQr) return 'export';
    if (state.filters.hasPassport) return 'has-passport';
    if (state.filters.hasPhysicalSpecimen) return 'physical';
    if (state.sort === 'completeness-desc' && state.tab === 'all' && state.filters.completeness === 'high') return 'completeness';
    if (state.tab === 'all') return 'catalog';
    if (['verified', 'research', 'new', 'trending', 'recent-verified', 'insects', 'plants', 'marine', 'fossils', 'minerals'].indexOf(state.tab) >= 0) return state.tab;
    return 'catalog';
  }

  var RAIL_ICONS = {
    catalog: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    archives: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v12H5z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 7V5h8v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    verified: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    research: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    new: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    trending: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18l5-6 4 3 7-10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'recent-verified': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    completeness: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="6" y="10" width="3" height="8" rx="1" fill="currentColor" opacity=".5"/><rect x="11" y="6" width="3" height="12" rx="1" fill="currentColor" opacity=".75"/><rect x="16" y="8" width="3" height="10" rx="1" fill="currentColor"/></svg>',
    insects: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="13" rx="5" ry="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7V4M7 9L4 7M17 9l3-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    plants: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 10C12 10 8 8 7 4c4 1 5 4 5 6M12 10c0 0 4-2 5-6-4 1-5 4-5 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    marine: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14c2-2 4-3 8-3s6 1 8 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 17c1.5-1 3.5-2 6-2s4.5 1 6 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    fossils: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 18c-2-4 0-10 4-12 4 2 6 8 4 12H8z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    minerals: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 7-7 11L5 10l7-7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    passports: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="11" r="2.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    export: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 10l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 18h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    'has-passport': '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    physical: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 12v9M12 12L4 7.5M12 12l8-4.5" stroke="currentColor" stroke-width="1.6"/></svg>',
    about: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16H6z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 8h6M9 12h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    'list-record': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    account: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 19c1.4-2.8 3.6-4 6-4s4.6 1.2 6 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  function v3IsZh() {
    try {
      if (typeof global.mcIsZhTW === 'function') return global.mcIsZhTW();
      if (typeof global.mcGetLang === 'function') return global.mcGetLang() === 'zh-TW';
      var s = global.__MC_APP_STATE__ && global.__MC_APP_STATE__.lang;
      if (s === 'zh-TW' || s === 'zh' || s === 'zh_Hant') return true;
      if (s === 'en') return false;
      var stored = global.localStorage && global.localStorage.getItem('MC_USER_LANG');
      if (stored === 'en') return false;
      if (stored === 'zh-TW') return true;
    } catch (e) {}
    return true;
  }

  function v3T(en, zh) {
    return v3IsZh() ? zh : en;
  }

  var RAIL_LABELS = {
    catalog: { en: 'All assets', zh: '全部資產' },
    'all-tab': { en: 'All assets', zh: '全部標本' },
    new: { en: 'New listings', zh: '最新上架' },
    trending: { en: 'Trending', zh: '熱門' },
    'recent-verified': { en: 'Recently verified', zh: '近期驗證' },
    verified: { en: 'Verified specimens', zh: '已驗證標本' },
    research: { en: 'Research-linked', zh: '研究連結' },
    completeness: { en: 'High completeness', zh: '高完整度' },
    physical: { en: 'With physical specimen', zh: '含實體標本' },
    insects: { en: 'Insects', zh: '昆蟲' },
    plants: { en: 'Plants', zh: '植物' },
    marine: { en: 'Marine', zh: '海洋' },
    fossils: { en: 'Fossils & Paleontology', zh: '化石與古生物' },
    minerals: { en: 'Minerals', zh: '礦物' },
    archives: { en: 'Featured collections', zh: '精選典藏' },
    passports: { en: 'Specimen passports', zh: '標本護照' },
    'has-passport': { en: 'Has passport', zh: '含護照' },
    export: { en: 'Export-ready', zh: '可匯出' },
    about: { en: 'SAT guide & legal', zh: 'SAT 說明與法律' },
    'list-record': { en: 'List a record', zh: '上架紀錄' },
    account: { en: 'Sign in', zh: '登入' },
  };

  var RAIL_SECTION_LABELS = {
    Browse: { en: 'Browse', zh: '瀏覽' },
    'Record quality': { en: 'Record quality', zh: '紀錄品質' },
    Disciplines: { en: 'Disciplines', zh: '學科' },
    Collections: { en: 'Collections', zh: '典藏' },
    'Passport & metadata': { en: 'Passport & metadata', zh: '護照與元資料' },
  };

  function railLabel(key, fallback) {
    var pack = RAIL_LABELS[key];
    if (!pack) return fallback || key;
    return v3IsZh() ? pack.zh : pack.en;
  }

  function railSectionLabel(label) {
    var pack = RAIL_SECTION_LABELS[label];
    if (!pack) return label;
    return v3IsZh() ? pack.zh : pack.en;
  }

  var RAIL_SECTIONS = [
    { label: 'Browse', items: [['catalog', 'catalog'], ['new', 'new'], ['trending', 'trending'], ['recent-verified', 'recent-verified']] },
    { label: 'Record quality', items: [['verified', 'verified'], ['research', 'research'], ['completeness', 'completeness'], ['physical', 'physical']] },
    { label: 'Disciplines', items: [['insects', 'insects'], ['plants', 'plants'], ['marine', 'marine'], ['fossils', 'fossils'], ['minerals', 'minerals']] },
    { label: 'Collections', items: [['archives', 'archives']] },
    { label: 'Passport & metadata', items: [['passports', 'passports'], ['has-passport', 'has-passport'], ['export', 'export']] },
  ];

  var RAIL_FOOT = [
    ['about', 'about'],
    ['list-record', 'list-record'],
    ['account', 'account'],
  ];

  function sidebarItemHtml(key, labelKey) {
    var label = railLabel(labelKey, labelKey);
    var active = sidebarActiveKey() === key ? ' is-active' : '';
    var icon = RAIL_ICONS[key] || RAIL_ICONS.catalog;
    return '<button type="button" class="mc-sat-v3-rail-item' + active + '" data-v3-nav="' + escAttr(key) + '" aria-label="' + escAttr(label) + '" title="' + escAttr(label) + '">' +
      '<span class="mc-sat-v3-rail-icon">' + icon + '</span>' +
      '<span class="mc-sat-v3-rail-label">' + esc(label) + '</span></button>';
  }

  function railSectionHtml(section) {
    return '<div class="mc-sat-v3-rail-group"><span class="mc-sat-v3-rail-group-label">' + esc(railSectionLabel(section.label)) +
      '</span>' + section.items.map(function (i) { return sidebarItemHtml(i[0], i[1]); }).join('') + '</div>';
  }

  function sidebarHtml() {
    var openCls = state.sidebarOpen ? ' is-drawer-open' : '';
    var expCls = state.railExpanded || state.sidebarOpen ? ' is-expanded' : '';
    return '<div class="mc-sat-v3-app' + (state.railExpanded || state.sidebarOpen ? ' is-rail-expanded' : '') + '">' +
      '<nav class="mc-sat-v3-catalog-rail' + openCls + expCls + '" aria-label="' + escAttr(v3T('SAT marketplace', 'SAT 市集')) + '">' +
      '<div class="mc-sat-v3-rail-top">' +
      '<button type="button" class="mc-sat-v3-rail-mark" data-v3-rail-expand aria-expanded="' + (state.railExpanded ? 'true' : 'false') + '" aria-label="' + escAttr(v3T('Expand navigation', '展開導覽')) + '">' +
      '<span class="mc-sat-v3-rail-mark-text">SAT</span>' +
      '<span class="mc-sat-v3-rail-expand-icon">' + RAIL_ICONS.expand + '</span></button>' +
      '<span class="mc-sat-v3-rail-title">' + esc(v3T('Market', '市集')) + '</span>' +
      '<button type="button" class="mc-sat-v3-rail-close" data-v3-sidebar-close aria-label="' + escAttr(v3T('Close', '關閉')) + '">\u00d7</button></div>' +
      '<div class="mc-sat-v3-rail-body">' + RAIL_SECTIONS.map(railSectionHtml).join('') + '</div>' +
      '<div class="mc-sat-v3-rail-foot">' + RAIL_FOOT.map(function (i) { return sidebarItemHtml(i[0], i[1]); }).join('') + '</div></nav>' +
      '<button type="button" class="mc-sat-v3-rail-fab" data-v3-sidebar-open aria-label="' + escAttr(v3T('Open navigation', '開啟導覽')) + '">' +
      '<span class="mc-sat-v3-rail-fab-icon">' + RAIL_ICONS.catalog + '</span></button>' +
      (state.sidebarOpen ? '<div class="mc-sat-v3-rail-backdrop" data-v3-sidebar-close></div>' : '') +
      '<div class="mc-sat-v3-main"><div class="mc-sat-v3-shell">';
  }

  function wrapPage(content, extras) {
    return sidebarHtml() + content + '</div></div></div>' + (extras || '');
  }

  function scrollToSection(id) {
    setTimeout(function () {
      var el = document.getElementById(id);
      if (!el) return;
      var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }, 80);
  }

  var FAQ_GROUP_IDS = [
    'faq-group-basics',
    'faq-group-buyer',
    'faq-group-deliverables',
    'faq-group-licenses',
    'faq-group-precheck',
    'faq-group-seller',
    'faq-group-seller-precheck',
    'faq-group-badges-mgs',
    'faq-group-verification',
    'faq-group-third-party',
    'faq-group-physical-delivery',
    'faq-group-physical',
    'faq-group-payments',
    'faq-group-sensitive-data',
    'faq-group-privacy',
    'faq-group-dispute-guide',
    'faq-group-risk-control',
    'faq-group-jurisdictions',
    'faq-group-disputes',
  ];

  var FAQ_CHIP_NAV = [
    { id: 'faq-group-basics', zh: 'SAT 定位', en: 'SAT basics' },
    { id: 'faq-group-buyer', zh: '買方權利', en: 'Buyer rights' },
    { id: 'faq-group-deliverables', zh: '成交交付', en: 'Deliverables' },
    { id: 'faq-group-licenses', zh: '授權類型', en: 'License types' },
    { id: 'faq-group-precheck', zh: '購買前檢查', en: 'Pre-purchase' },
    { id: 'faq-group-seller', zh: '賣方責任', en: 'Seller duties' },
    { id: 'faq-group-seller-precheck', zh: '上架前檢查', en: 'Pre-listing' },
    { id: 'faq-group-badges-mgs', zh: '驗證與 MGS', en: 'Badges & MGS' },
    { id: 'faq-group-verification', zh: '驗證資料', en: 'Verification' },
    { id: 'faq-group-third-party', zh: '第三方資料', en: 'Third-party data' },
    { id: 'faq-group-physical-delivery', zh: '實體交付', en: 'Physical delivery' },
    { id: 'faq-group-physical', zh: '實體與 CITES', en: 'Physical & CITES' },
    { id: 'faq-group-payments', zh: '付款退款', en: 'Payments' },
    { id: 'faq-group-sensitive-data', zh: '敏感資料', en: 'Sensitive data' },
    { id: 'faq-group-privacy', zh: '隱私下架', en: 'Privacy' },
    { id: 'faq-group-dispute-guide', zh: '爭議處理', en: 'Disputes' },
    { id: 'faq-group-risk-control', zh: '風控規範', en: 'Risk controls' },
    { id: 'faq-group-jurisdictions', zh: '三法域法律', en: 'Tri-jurisdiction law' },
    { id: 'faq-group-disputes', zh: '爭議責任', en: 'Liability' },
  ];

  var FAQ_BADGE_RULES = [
    { key: 'non-investment', zh: '非投資', en: 'Non-investment', re: /投資|NFT|金融商品|證券|升值|投機|investment|security|speculative|appreciation/i },
    { key: 'license', zh: '授權限制', en: 'License', re: /授權|著作權|商用|轉售|下載|license|copyright|commercial|resell|download/i },
    { key: 'cites', zh: 'CITES', en: 'CITES', re: /CITES|進出口|跨境|cross-border|import|export/i },
    { key: 'privacy', zh: '隱私', en: 'Privacy', re: /個資|GPS|隱私|匿名|遮蔽|privacy|personal data|obfuscat/i },
    { key: 'dispute', zh: '爭議', en: 'Dispute', re: /爭議|申訴|退款|詐騙|責任|dispute|appeal|refund|fraud|liability/i },
    { key: 'demo', zh: '示範環境', en: 'Demo', re: /示範|mock|測試資料|正式上線|正式環境|demo|test data|production launch/i },
  ];

  function satFaqBadgeLabel(rule) {
    return v3T(rule.en, rule.zh);
  }

  function satFaqBadgesHtml(item) {
    var text = item.q + ' ' + (item.paragraphs || []).join(' ') + ' ' + (item.bullets || []).join(' ');
    var seen = {};
    var badges = [];
    FAQ_BADGE_RULES.forEach(function (rule) {
      if (badges.length >= 3) return;
      if (rule.re.test(text) && !seen[rule.key]) {
        seen[rule.key] = true;
        badges.push(satFaqBadgeLabel(rule));
      }
    });
    if (!badges.length) return '';
    return '<span class="mc-sat-v3-faq-badges">' + badges.map(function (b) {
      return '<span class="mc-sat-v3-faq-badge">' + esc(b) + '</span>';
    }).join('') + '</span>';
  }

  function satFaqChecklistCardHtml(card) {
    if (!card || !card.sections || !card.sections.length) return '';
    var sections = card.sections.map(function (sec) {
      return '<div class="mc-sat-v3-faq-checklist-section">' +
        '<h4>' + esc(sec.title) + '</h4>' +
        '<ul class="mc-sat-v3-faq-checklist-items">' +
        (sec.items || []).map(function (item) {
          return '<li>' + esc(item) + '</li>';
        }).join('') +
        '</ul></div>';
    }).join('');
    var jump = '';
    if (card.linkLabel && card.linkTarget) {
      jump = '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline mc-sat-v3-faq-checklist-jump" data-faq-chip="' +
        escAttr(card.linkTarget) + '">' + esc(card.linkLabel) + '</button>';
    }
    var themeMeta = {
      seller: {
        className: ' mc-sat-v3-faq-checklist-card--seller',
        cardId: 'mc-sat-faq-seller-precheck-card',
        titleId: 'mc-sat-faq-seller-precheck-title',
      },
      deliverables: {
        className: ' mc-sat-v3-faq-checklist-card--deliverables',
        cardId: 'mc-sat-faq-deliverables-card',
        titleId: 'mc-sat-faq-deliverables-title',
      },
      dispute: {
        className: ' mc-sat-v3-faq-checklist-card--dispute',
        cardId: 'mc-sat-faq-dispute-evidence-card',
        titleId: 'mc-sat-faq-dispute-evidence-title',
      },
    };
    var meta = themeMeta[card.theme] || {
      className: '',
      cardId: 'mc-sat-faq-precheck-card',
      titleId: 'mc-sat-faq-precheck-title',
    };
    return '<aside class="mc-sat-v3-faq-checklist-card' + meta.className + '" id="' + escAttr(meta.cardId) +
      '" aria-labelledby="' + escAttr(meta.titleId) + '">' +
      '<div class="mc-sat-v3-faq-checklist-head">' +
      '<h3 id="' + escAttr(meta.titleId) + '">' + esc(card.title) + '</h3>' + jump +
      '</div>' +
      (card.intro ? '<p class="mc-sat-v3-faq-checklist-intro">' + esc(card.intro) + '</p>' : '') +
      '<div class="mc-sat-v3-faq-checklist-grid">' + sections + '</div>' +
      (card.footnote ? '<p class="mc-sat-v3-faq-checklist-foot">' + esc(card.footnote) + '</p>' : '') +
      '</aside>';
  }

  function satFaqLicenseMatrixHtml(matrix) {
    if (!matrix || !matrix.rows || !matrix.rows.length) return '';
    var cols = matrix.columns || [];
    var head = cols.map(function (col) {
      return '<th scope="col">' + esc(col.label) + '</th>';
    }).join('');
    var body = matrix.rows.map(function (row) {
      return '<tr>' + cols.map(function (col, idx) {
        var tag = idx === 0 ? 'th scope="row"' : 'td';
        return '<' + tag + '>' + esc(row[col.key] || '') + '</' + (idx === 0 ? 'th' : 'td') + '>';
      }).join('') + '</tr>';
    }).join('');
    var jump = '';
    if (matrix.linkLabel && matrix.linkTarget) {
      jump = '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline mc-sat-v3-faq-checklist-jump" data-faq-chip="' +
        escAttr(matrix.linkTarget) + '">' + esc(matrix.linkLabel) + '</button>';
    }
    return '<aside class="mc-sat-v3-faq-license-matrix" id="mc-sat-faq-license-matrix" aria-labelledby="mc-sat-faq-license-matrix-title">' +
      '<div class="mc-sat-v3-faq-checklist-head">' +
      '<h3 id="mc-sat-faq-license-matrix-title">' + esc(matrix.title) + '</h3>' + jump +
      '</div>' +
      (matrix.intro ? '<p class="mc-sat-v3-faq-checklist-intro">' + esc(matrix.intro) + '</p>' : '') +
      '<div class="mc-sat-v3-faq-matrix-scroll" tabindex="0" role="region" aria-label="' + escAttr(matrix.title) + '">' +
      '<table class="mc-sat-v3-faq-matrix-table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
      (matrix.footnote ? '<p class="mc-sat-v3-faq-checklist-foot">' + esc(matrix.footnote) + '</p>' : '') +
      '</aside>';
  }

  function initSatFaqUi(root) {
    var faqRoot = root.querySelector('#mc-sat-about-faq');
    if (!faqRoot) return;

    var searchInput = faqRoot.querySelector('.mc-sat-v3-faq-search');
    var emptyEl = faqRoot.querySelector('.mc-sat-v3-faq-empty');
    var expandBtn = faqRoot.querySelector('.mc-sat-v3-faq-expand-all');
    var collapseBtn = faqRoot.querySelector('.mc-sat-v3-faq-collapse-all');
    var items = faqRoot.querySelectorAll('.mc-sat-v3-faq-item');
    var groups = faqRoot.querySelectorAll('.mc-sat-v3-faq-group');
    var preSearchOpen = null;

    function prefersReducedMotion() {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function scrollToFaqGroup(id) {
      var el = faqRoot.querySelector('#' + id);
      if (!el) return;
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }

    function setEmptyVisible(show) {
      if (!emptyEl) return;
      if (show) emptyEl.removeAttribute('hidden');
      else emptyEl.setAttribute('hidden', 'hidden');
    }

    function filterFaq(query) {
      var q = query.trim().toLowerCase();
      var any = false;

      if (!q) {
        items.forEach(function (item) {
          item.classList.remove('mc-sat-v3-faq-item--hidden');
          if (preSearchOpen) item.open = !!preSearchOpen.get(item);
        });
        groups.forEach(function (g) { g.classList.remove('mc-sat-v3-faq-group--hidden'); });
        preSearchOpen = null;
        setEmptyVisible(false);
        return;
      }

      if (!preSearchOpen) {
        preSearchOpen = new Map();
        items.forEach(function (item) { preSearchOpen.set(item, item.open); });
      }

      items.forEach(function (item) {
        var match = (item.textContent || '').toLowerCase().indexOf(q) >= 0;
        item.classList.toggle('mc-sat-v3-faq-item--hidden', !match);
        if (match) {
          item.open = true;
          any = true;
        }
      });

      groups.forEach(function (g) {
        var visible = g.querySelector('.mc-sat-v3-faq-item:not(.mc-sat-v3-faq-item--hidden)');
        g.classList.toggle('mc-sat-v3-faq-group--hidden', !visible);
      });

      setEmptyVisible(!any);
    }

    faqRoot.querySelectorAll('[data-faq-chip]').forEach(function (chip) {
      chip.onclick = function () {
        if (searchInput && searchInput.value.trim()) {
          searchInput.value = '';
          filterFaq('');
        }
        var target = chip.getAttribute('data-faq-chip');
        scrollToFaqGroup(target);
        faqRoot.querySelectorAll('[data-faq-chip]').forEach(function (c) {
          c.classList.toggle('is-active', c === chip);
        });
      };
    });

    if (searchInput) {
      searchInput.setAttribute('aria-label', v3T('Search FAQ', '搜尋 FAQ'));
      searchInput.oninput = function () { filterFaq(searchInput.value); };
    }

    if (expandBtn) {
      expandBtn.onclick = function () {
        faqRoot.querySelectorAll('.mc-sat-v3-faq-item:not(.mc-sat-v3-faq-item--hidden)').forEach(function (item) {
          item.open = true;
        });
      };
    }

    if (collapseBtn) {
      collapseBtn.onclick = function () {
        items.forEach(function (item) { item.open = false; });
        if (searchInput && searchInput.value.trim()) filterFaq(searchInput.value);
      };
    }
  }

  function resetFiltersForNav() {
    state.filters = {
      category: '', verification: '', completeness: '', license: '',
      researchLinked: false, hasPassport: false, hasQr: false, hasPhysicalSpecimen: false, priceMin: '', priceMax: '',
    };
    state.q = '';
  }

  function goHomeAndPaint() {
    state.visible = PAGE_SIZE;
    if (state.route.view !== 'home') go('/marketplace');
    else paint();
  }

  function handleSidebarNav(key, fromIconClick) {
    if (fromIconClick && !state.railExpanded && !state.sidebarOpen) {
      toggleRailExpanded(true);
    }
    state.sidebarOpen = false;
    if (key === 'account') {
      requireLogin('sign in');
      return;
    }
    if (key === 'list-record') {
      if (!requireLogin('list a record')) return;
      go('/dashboard/marketplace/new');
      return;
    }
    state.sidebarNav = key;
    if (key === 'catalog') {
      resetFiltersForNav();
      state.tab = 'all';
      state.sort = 'recently-listed';
      goHomeAndPaint();
      return;
    }
    if (key === 'research' || key === 'verified' || key === 'new' || key === 'trending' || key === 'recent-verified') {
      resetFiltersForNav();
      state.tab = key;
      goHomeAndPaint();
      scrollToSection('mc-sat-v3-grid');
      return;
    }
    if (key === 'insects' || key === 'plants' || key === 'marine' || key === 'fossils' || key === 'minerals') {
      resetFiltersForNav();
      state.tab = key;
      var catMap = { insects: 'Insects', plants: 'Plants', marine: 'Marine', fossils: 'Fossils', minerals: 'Minerals' };
      state.filters.category = catMap[key] || '';
      goHomeAndPaint();
      scrollToSection('mc-sat-v3-grid');
      return;
    }
    if (key === 'completeness') {
      resetFiltersForNav();
      state.tab = 'all';
      state.sort = 'completeness-desc';
      state.filters.completeness = 'high';
      goHomeAndPaint();
      scrollToSection('mc-sat-v3-grid');
      return;
    }
    if (key === 'export') {
      resetFiltersForNav();
      state.tab = 'all';
      state.filters.hasQr = true;
      goHomeAndPaint();
      scrollToSection('mc-sat-v3-grid');
      return;
    }
    if (key === 'has-passport') {
      resetFiltersForNav();
      state.tab = 'all';
      state.filters.hasPassport = true;
      goHomeAndPaint();
      scrollToSection('mc-sat-v3-grid');
      return;
    }
    if (key === 'physical') {
      resetFiltersForNav();
      state.tab = 'all';
      state.filters.hasPhysicalSpecimen = true;
      goHomeAndPaint();
      scrollToSection('mc-sat-v3-grid');
      return;
    }
    if (key === 'archives') {
      resetFiltersForNav();
      state.tab = 'all';
      if (state.route.view !== 'home') {
        go('/marketplace');
        scrollToSection('mc-sat-v3-collections');
      } else {
        paint();
        scrollToSection('mc-sat-v3-collections');
      }
      return;
    }
    if (key === 'passports') {
      state.sidebarNav = 'about';
      state.pendingAboutAnchor = 'passport';
      go('/marketplace/about');
      return;
    }
    if (key === 'about') {
      state.sidebarNav = 'about';
      go('/marketplace/about');
      return;
    }
  }

  /* ---- HTML builders ---- */
  function imgHtml(src, alt, cls) {
    var fb = encodeURI(SPEC_BASE + 'thumbs/neutral.svg');
    return '<div class="mc-sat-v3-media' + (cls ? ' ' + cls : '') + '" data-v3-media data-fb="' + escAttr(fb) + '">' +
      '<img loading="lazy" decoding="async" src="' + escAttr(src || fb) + '" alt="' + escAttr(alt || '') + '" data-v3-img />' +
      '<div class="mc-sat-v3-skeleton" aria-hidden="true"></div></div>';
  }

  function verifyBadge(a) {
    var s = String(a.verificationStatus || '');
    var cls = /complete/i.test(s) ? 'is-provenance' : /graded/i.test(s) ? 'is-graded' : 'is-verified';
    return '<span class="mc-sat-v3-badge ' + cls + '">' + esc(verificationOptLabel(s) || s) + '</span>';
  }

  function physicalBadge(a) {
    if (!a.hasPhysicalSpecimen) return '';
    return '<span class="mc-sat-v3-badge is-physical" title="' + escAttr(v3T('SAT and physical specimen transfer together', 'SAT 與實體標本須一併移交')) + '">' + esc(v3T('Physical specimen', '含實體標本')) + '</span>';
  }

  function physicalTransferAlert(a) {
    if (!a.hasPhysicalSpecimen) return '';
    return '<div class="mc-sat-v3-physical-alert" role="note">' +
      '<strong>' + esc(v3T('Physical specimen included', '含實體標本')) + '</strong>' +
      '<p>' + esc(v3T(
        'Upon transfer, the SAT record and the physical specimen are transferred together to the buyer. Shipping, CITES permits, storage, and customs must be agreed separately.',
        '交易完成時，SAT 與實體標本須一併移交買方；運送、CITES 許可證、保管與報關須另行約定。'
      )) + '</p>' +
      '<p class="mc-sat-v3-physical-alert-zh">' + esc(v3T(
        'Shipping, CITES permits, storage, and customs must be agreed separately.',
        '運送、許可證與保管須另行約定。'
      )) + '</p></div>';
  }

  function buyLabel(a) {
    if (a.inquiryOnly) return v3T('Request license', '申請授權');
    if (a.hasPhysicalSpecimen) return v3T('Buy (SAT + physical)', '購買（SAT + 實體）');
    return v3T('Buy', '購買');
  }

  function assetMcCatalogId(a) {
    if (a.mcId) {
      var raw = String(a.mcId).replace(/^MC[-\s]*/i, '').replace(/\D/g, '').slice(-6).padStart(6, '0');
      return 'MC - ' + raw;
    }
    if (a.mcCatalogId) return String(a.mcCatalogId);
    var id = String(a.satId || a.id || '');
    var num = id.replace(/^SAT-MC-/i, '').replace(/^SAT-/i, '').replace(/\D/g, '').slice(-6).padStart(6, '0');
    return 'MC - ' + num;
  }

  function assetGenusTag(a) {
    var sci = String(a.scientificName || '').trim();
    var genus = sci.split(/\s+/)[0];
    return (genus || String(a.category || 'SPECIMEN')).toUpperCase();
  }

  function assetCatalogRegLine(a) {
    if (a.mcId) {
      var mcNum = String(a.mcId).replace(/^MC[-\s]*/i, '').replace(/\D/g, '').slice(-6).padStart(6, '0');
      return 'NHM • MC • REG-' + mcNum + ' • β';
    }
    var id = String(a.satId || a.id || '');
    var num = id.replace(/^SAT-MC-/i, '').replace(/^SAT-/i, '').replace(/\D/g, '').slice(-6).padStart(6, '0');
    return 'NHM • MC • REG-' + num + ' • β';
  }

  function assetCardBackUrl(a) {
    var cat = lower(a.category || '');
    var coll = lower(a.collectionId || '');
    var file = 'common.jpg';
    if (/insect|coleoptera|beetle|lepidoptera|arthropod/.test(cat)) file = 'coleoptera.jpg';
    else if (/plant|botany|herb|flora/.test(cat)) file = 'plantae.jpg';
    else if (/marine|mollus|shell|fish|cnidaria/.test(cat) || /marine|intertidal|coastal/.test(coll)) file = 'mollusca.jpg';
    else if (/fossil|paleo|dinosaur|mineral|trilobite/.test(cat) || /fossil|paleo|dinosaur/.test(coll)) file = 'fossil.jpg';
    return encodeURI(CARD_BACK + file);
  }

  function passportBackCell(label, value) {
    return '<div class="mc-passport-card__backCell"><span>' + esc(label) + '</span><strong>' + esc(value || '—') + '</strong></div>';
  }

  function passportCardBackBodyHtml(a) {
    var backUrl = assetCardBackUrl(a);
    return '<div class="mc-passport-card__body mc-passport-card__body--back">' +
      '<div class="mc-passport-card__backPlate" style="background-image:url(\'' + escAttr(backUrl) + '\')"></div>' +
      '<div class="mc-passport-card__backOverlay">' +
      '<h3 class="mc-passport-card__backTitle">' + esc(v3T('Specimen record', '標本紀錄')) + '</h3>' +
      passportBackCell(v3T('SAT ID', 'SAT ID'), a.satId || a.id) +
      passportBackCell(v3T('Scientific name', '學名'), a.scientificName) +
      passportBackCell(v3T('Common name', '俗名'), assetDisplayCommonName(a) || a.commonName) +
      passportBackCell(v3T('Taxonomy', '分類學'), (a.metadata && a.metadata.taxonomy) || a.category) +
      passportBackCell(v3T('Locality', '產地'), a.locality) +
      passportBackCell(v3T('License', '授權'), licenseOptLabel(a.licenseType) || a.licenseType) +
      '<p class="mc-passport-card__backFoot">' + esc(v3T('Verified specimen-linked SAT metadata', '已驗證標本連結 SAT 元資料')) + '</p>' +
      '</div></div>';
  }

  function assetVisibilityLabel(a) {
    if (a.visibility) return a.visibility;
    if (a.isResearchLinked) return v3T('Research data sharing', '研究資料共享');
    if (isVerified(a)) return v3T('Collection visible', '館藏可見');
    return v3T('Pending', '待公開');
  }

  function passportCardBodyHtml(a, opts) {
    opts = opts || {};
    var verified = isVerified(a);
    var review = verified ? v3T('Reviewed', '已審核') : v3T('Not reviewed', '未審核');
    var reviewMini = verified ? v3T('OK', '已審') : v3T('—', '未審');
    var pct = Math.min(100, Math.max(0, Number(a.completeness) || 0));
    var satId = String(a.satId || a.id || '');
    var satClass = 'mc-passport-card__sat' + (satId && !/pending/i.test(satId) ? ' is-ready' : '');
    var netBadge = 'N';
    var imgUrl = opts.image || a.detailImage || a.image;
    var img = imgUrl
      ? '<img src="' + escAttr(imgUrl) + '" alt="' + escAttr(a.scientificName) + '" width="600" height="420" loading="lazy" decoding="async" class="is-photo-loaded" />'
      : '';
    return '<div class="mc-passport-card__body">' +
      '<header class="mc-passport-card__head">' +
      '<span class="mc-passport-card__review">' + esc(review) + '</span>' +
      '<div class="mc-passport-card__headActions">' +
      '<span class="mc-passport-card__reviewMini">' + esc(reviewMini) + '</span>' +
      '<span class="mc-passport-card__netBadge" aria-hidden="true">' + esc(netBadge) + '</span>' +
      '</div></header>' +
      '<div class="mc-passport-card__ids">' +
      '<p class="mc-passport-card__mcId">' + esc(assetMcCatalogId(a)) + '</p>' +
      '<p class="' + satClass + '">' + esc(satId) + '</p></div>' +
      '<figure class="mc-passport-card__photo has-photo mc-passport-card__photo--catalog">' + img + '</figure>' +
      '<div class="mc-passport-card__nameplate">' +
      '<span class="mc-passport-card__taxon">' + esc(assetGenusTag(a)) + '</span>' +
      '<h2 class="mc-passport-card__sci">' + cardHighlight(a.scientificName) + '</h2>' +
      '<p class="mc-passport-card__common">' + esc(assetDisplayCommonName(a) || a.commonName || a.category || '') + '</p>' +
      '</div>' +
      '<dl class="mc-passport-card__meta">' +
      '<div><dt>' + esc(v3T('Locality', '產地')) + '</dt><dd>' + esc(a.locality || '—') + '</dd></div>' +
      '<div><dt>' + esc(v3T('Date', '日期')) + '</dt><dd>' + esc(a.date || '—') + '</dd></div>' +
      '<div><dt>' + esc(v3T('Collector', '採集者')) + '</dt><dd>' + esc(a.collector || a.holder || '—') + '</dd></div>' +
      '<div><dt>' + esc(v3T('Visibility', '是否公開')) + '</dt><dd>' + esc(assetVisibilityLabel(a)) + '</dd></div>' +
      '</dl>' +
      '<footer class="mc-passport-card__footer">' +
      '<div class="mc-passport-card__progress">' +
      '<span class="mc-passport-card__progressPct">' + esc(v3T('Completion ', '完成度 ')) + '<strong>' + esc(String(pct)) + '%</strong></span>' +
      '<em class="mc-passport-card__progressNote">' + esc(review) + '</em>' +
      '<div class="mc-passport-card__bar" role="progressbar" aria-valuenow="' + escAttr(String(pct)) + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + escAttr(String(pct)) + '%;"></span></div>' +
      '</div>' +
      '<p class="mc-passport-card__exportLine">' + esc(v3T('QR • CSV • JSON — traceable export', 'QR • CSV • JSON — 可追溯匯出')) + '</p>' +
      '<p class="mc-passport-card__catalog">' + esc(assetCatalogRegLine(a)) + '</p>' +
      '</footer></div>';
  }

  function passportCardShellHtml(a, opts) {
    opts = opts || {};
    var verified = isVerified(a);
    var isDetail = !!opts.detail;
    var typeClass = isDetail ? ' mc-passport-card--detail' : ' mc-passport-card--catalog';
    var attrs = '';
    if (!isDetail) {
      attrs = ' data-v3-card="' + escAttr(a.id) + '" tabindex="0"';
    }
    var body = isDetail && opts.flipFace === 'back'
      ? passportCardBackBodyHtml(a)
      : passportCardBodyHtml(a, opts);
    return '<article class="mc-passport-card' + typeClass + (verified ? ' is-verified' : '') + '"' + attrs + '>' +
      body + '</article>';
  }

  function passportDetailFlipHtml(a) {
    var face = state.passportFace || 'front';
    var flipped = face === 'back';
    return '<div class="mc-sat-v3-passport-tools">' +
      '<div class="mc-sat-v3-passport-toggle" role="group" aria-label="' + escAttr(v3T('Passport side', '護照正背面')) + '">' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-ghost' + (face === 'front' ? ' is-active' : '') + '" data-v3-passport="front">' + esc(v3T('Front', '正面')) + '</button>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-ghost' + (face === 'back' ? ' is-active' : '') + '" data-v3-passport="back">' + esc(v3T('Back', '背面')) + '</button>' +
      '</div>' +
      '<p class="mc-sat-v3-passport-flip-hint">' + esc(v3T('Click card to flip', '點擊卡片翻面')) + '</p>' +
      '</div>' +
      '<div class="mc-sat-v3-detail-passport">' +
      '<div class="mc-sat-v3-passport-flip-scene mc-passport-card-catalog-scope">' +
      '<div class="mc-sat-v3-passport-flip-card' + (flipped ? ' is-flipped' : '') + '" data-v3-passport-flip tabindex="0" role="button" aria-pressed="' + (flipped ? 'true' : 'false') + '" aria-label="' + escAttr(v3T('Flip specimen passport', '翻轉標本護照')) + '">' +
      '<div class="mc-sat-v3-passport-flip-face mc-sat-v3-passport-flip-face--front">' +
      passportCardShellHtml(a, { detail: true, flipFace: 'front', image: a.detailImage || a.image }) +
      '</div>' +
      '<div class="mc-sat-v3-passport-flip-face mc-sat-v3-passport-flip-face--back">' +
      passportCardShellHtml(a, { detail: true, flipFace: 'back' }) +
      '</div></div></div></div>';
  }

  function heroStackCardHtml(a, opts) {
    opts = opts || {};
    return '<article class="mc-sat-v3-hero-stack-card' + (opts.isFront ? ' is-front' : '') + '" style="--stack-i:' + escAttr(String(opts.stackIndex)) + '" data-v3-hero-card="' + escAttr(a.id) + '" tabindex="0" role="button" aria-label="' + escAttr(a.scientificName + ', ' + (a.satId || a.id)) + '">' +
      imgHtml(a.image, a.scientificName, 'mc-sat-v3-hero-stack-media') +
      '<div class="mc-sat-v3-hero-stack-body">' +
      verifyBadge(a) +
      '<span class="mc-sat-v3-satid">' + cardHighlight(a.satId) + '</span>' +
      '<h3 class="mc-sat-v3-sciname"><em>' + cardHighlight(a.scientificName) + '</em></h3>' +
      (a.commonName ? '<p class="mc-sat-v3-common">' + cardHighlight(assetDisplayCommonName(a)) + '</p>' : '') +
      '</div></article>';
  }

  function assetCardHtml(a, compact) {
    var watched = !!state.watch[a.id];
    return '<article class="mc-sat-v3-asset-card' + (compact ? ' is-compact' : '') + '" data-v3-card="' + escAttr(a.id) + '" tabindex="0">' +
      imgHtml(a.image, a.scientificName, 'mc-sat-v3-card-media') +
      '<div class="mc-sat-v3-card-body">' +
      '<div class="mc-sat-v3-card-top">' + verifyBadge(a) + physicalBadge(a) + '<span class="mc-sat-v3-satid">' + cardHighlight(a.satId) + '</span></div>' +
      '<h3 class="mc-sat-v3-sciname"><em>' + cardHighlight(a.scientificName) + '</em></h3>' +
      (a.commonName ? '<p class="mc-sat-v3-common">' + cardHighlight(assetDisplayCommonName(a)) + '</p>' : '') +
      '<div class="mc-sat-v3-card-meta">' +
      '<span class="mc-sat-v3-complete">' + esc(a.completeness) + '% ' + esc(v3T('provenance', '來源')) + '</span>' +
      '<span class="mc-sat-v3-license">' + esc(licenseOptLabel(a.licenseType) || a.licenseType) + '</span></div>' +
      '<div class="mc-sat-v3-card-foot">' +
      '<strong class="mc-sat-v3-price">' + esc(priceLabel(a)) + '</strong>' +
      '<div class="mc-sat-v3-card-actions">' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-ghost" data-v3-view="' + escAttr(a.id) + '">' + esc(v3T('View details', '查看詳情')) + '</button>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-text" data-v3-offer="' + escAttr(a.id) + '">' + esc(a.inquiryOnly ? v3T('Request access', '申請存取') : v3T('Make offer', '出價')) + '</button>' +
      '</div></div></div></article>';
  }

  function assetListRowHtml(a) {
    return '<tr class="mc-sat-v3-asset-row" data-v3-card="' + escAttr(a.id) + '" tabindex="0">' +
      '<td class="mc-sat-v3-list-thumb">' + imgHtml(a.image, a.scientificName, 'mc-sat-v3-thumb-img') + '</td>' +
      '<td class="mc-sat-v3-mono">' + cardHighlight(a.satId) + '</td>' +
      '<td>' + cardHighlight(assetDisplayTitle(a)) + '</td>' +
      '<td class="mc-sat-v3-sciname-cell"><em>' + cardHighlight(a.scientificName) + '</em></td>' +
      '<td>' + esc(categoryOptLabel(a.category) || a.category) + '</td>' +
      '<td class="mc-sat-v3-muted">' + esc(a.locality || '') + '</td>' +
      '<td>' + esc(isVerified(a) ? v3T('Yes', '是') : v3T('No', '否')) + '</td>' +
      '<td>' + (a.hasPhysicalSpecimen
        ? '<span class="mc-sat-v3-pill mc-sat-v3-pill-physical">' + esc(v3T('Physical', '實體')) + '</span>'
        : '—') + '</td>' +
      '<td><strong class="mc-sat-v3-price">' + esc(priceLabel(a)) + '</strong></td>' +
      '<td class="mc-sat-v3-muted">' + esc(a.holder || '') + '</td></tr>';
  }

  function catalogViewToggleHtml() {
    var v = state.catalogView === 'list' ? 'list' : 'grid';
    return '<div class="mc-sat-v3-view-toggle" role="group" aria-label="' + escAttr(v3T('View mode', '檢視模式')) + '">' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-ghost' + (v === 'grid' ? ' is-active' : '') + '" data-v3-catalog-view="grid">' + esc(v3T('Grid', '格狀')) + '</button>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-ghost' + (v === 'list' ? ' is-active' : '') + '" data-v3-catalog-view="list">' + esc(v3T('List', '列表')) + '</button></div>';
  }

  function catalogAssetsHtml(list, visible) {
    if (!visible.length) {
      if (state.route.view === 'collection' && !hasActiveFilters()) {
        return '<div class="mc-sat-v3-empty">' + esc(v3T('No assets in this collection.', '此典藏尚無資產。')) + '</div>';
      }
      return emptyGridHtml();
    }
    if (state.catalogView === 'list') {
      return '<div class="mc-sat-v3-table-wrap"><table class="mc-sat-v3-asset-table">' +
        '<thead><tr><th></th><th>' + esc(v3T('SAT ID', 'SAT ID')) + '</th><th>' + esc(v3T('Name', '名稱')) + '</th>' +
        '<th>' + esc(v3T('Scientific', '學名')) + '</th><th>' + esc(v3T('Category', '分類')) + '</th>' +
        '<th>' + esc(v3T('Locality', '產地')) + '</th><th>' + esc(v3T('Verified', '已驗證')) + '</th>' +
        '<th>' + esc(v3T('Physical', '實體')) + '</th><th>' + esc(v3T('Price', '價格')) + '</th>' +
        '<th>' + esc(v3T('Custody', '保管')) + '</th></tr></thead><tbody>' +
        visible.map(assetListRowHtml).join('') + '</tbody></table></div>';
    }
    return '<div class="mc-sat-v3-grid">' + visible.map(assetCardHtml).join('') + '</div>';
  }

  function collectionCardHtml(c) {
    return '<article class="mc-sat-v3-collection-card" data-v3-collection="' + escAttr(c.id) + '" tabindex="0">' +
      imgHtml(c.image, c.name, 'mc-sat-v3-coll-media') +
      '<div class="mc-sat-v3-coll-body">' +
      '<h3>' + esc(collectionDisplayName(c)) + '</h3>' +
      '<p class="mc-sat-v3-coll-curator">' + esc(collectionDisplayCurator(c)) + '</p>' +
      '<div class="mc-sat-v3-coll-stats">' +
      '<span>' + esc(c.assetCount) + ' ' + esc(v3T('assets', '項資產')) + '</span>' +
      '<span>' + esc(c.verificationRatio) + '% ' + esc(v3T('verified', '已驗證')) + '</span>' +
      '<span>' + esc(categoryOptLabel(c.category) || c.category) + '</span></div>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline" data-v3-collection="' + escAttr(c.id) + '">' + esc(v3T('View collection', '查看典藏')) + '</button>' +
      '</div></article>';
  }

  function cycleHeroCard(step) {
    var picks = HERO_PICKS;
    var cur = state.heroCardFocus || picks[picks.length - 1];
    var idx = picks.indexOf(cur);
    if (idx < 0) idx = picks.length - 1;
    state.heroCardFocus = picks[(idx + step + picks.length) % picks.length];
    state.heroStackFan = false;
    paint();
  }

  function heroStackHtml() {
    var picks = HERO_PICKS;
    var frontId = state.heroCardFocus || picks[picks.length - 1];
    return picks.map(function (id, i) {
      var a = findAsset(id);
      if (!a) return '';
      return heroStackCardHtml(a, {
        stackIndex: i,
        isFront: id === frontId,
      });
    }).join('');
  }

  function heroHtml() {
    return '<section class="mc-sat-v3-hero" aria-label="' + escAttr(v3T('Marketplace hero', '市集主視覺')) + '">' +
      '<div class="mc-sat-v3-hero-grid">' +
      '<div class="mc-sat-v3-hero-copy">' +
      '<span class="mc-sat-v3-kicker">' + esc(v3T('Scientific Asset Marketplace', '科學資產市集')) + '</span>' +
      '<h1>' + esc(v3T('Trade verified specimen-linked scientific assets.', '交易已驗證的標本連結科學資產。')) + '</h1>' +
      '<p class="mc-sat-v3-lead">' + esc(v3T(
        'Discover specimen passports, research-linked assets, usage rights, and verified provenance records.',
        '探索標本護照、研究連結資產、使用權利與已驗證來源紀錄。'
      )) + '</p>' +
      '<div class="mc-sat-v3-hero-cta">' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-primary" data-v3-scroll="grid">' + esc(v3T('Explore SAT Assets', '瀏覽 SAT 資產')) + '</button></div>' +
      '<ul class="mc-sat-v3-trust">' +
      '<li>' + esc(v3T('Verified provenance', '已驗證來源')) + '</li>' +
      '<li>' + esc(v3T('Specimen passport linked', '連結標本護照')) + '</li>' +
      '<li>' + esc(v3T('Rights & usage license', '權利與使用授權')) + '</li>' +
      '<li>' + esc(v3T('Export-ready metadata', '可匯出元資料')) + '</li></ul>' +
      '</div>' +
      '<div class="mc-sat-v3-hero-visual">' +
      '<div class="mc-sat-v3-passport-stack mc-sat-v3-hero-stack-scope' + (state.heroStackFan ? ' is-fanned' : '') + '" data-v3-hero-stack>' +
      heroStackHtml() +
      '<div class="mc-sat-v3-stack-nav" aria-label="' + escAttr(v3T('Browse stack', '瀏覽卡片堆')) + '">' +
      '<button type="button" class="mc-sat-v3-stack-arrow" data-v3-hero-prev aria-label="' + escAttr(v3T('Previous card', '上一張')) + '">\u2039</button>' +
      '<button type="button" class="mc-sat-v3-stack-arrow" data-v3-hero-next aria-label="' + escAttr(v3T('Next card', '下一張')) + '">\u203a</button></div></div>' +
      '<p class="mc-sat-v3-stack-hint">' + esc(v3T('Hover or tap Browse to spread · ◀ ▶ to cycle · Click to view', '滑鼠移入或點 Browse 展開 · 用箭頭切換 · 點擊查看')) + '</p>' +
      '<button type="button" class="mc-sat-v3-stack-toggle" data-v3-hero-fan aria-pressed="' + (state.heroStackFan ? 'true' : 'false') + '">' +
      esc(state.heroStackFan ? v3T('Stack cards', '收合卡片') : v3T('Browse cards', 'Browse 卡片')) + '</button></div>' +
      '</div></section>';
  }

  function tabsHtml() {
    return '<nav class="mc-sat-v3-tabs" aria-label="' + escAttr(v3T('Market categories', '市集分類')) + '">' +
      TABS.map(function (t) {
        return '<button type="button" class="mc-sat-v3-tab' + (state.tab === t[0] ? ' is-active' : '') + '" data-v3-tab="' + escAttr(t[0]) + '">' + esc(tabLabel(t[1])) + '</button>';
      }).join('') + '</nav>';
  }

  function metricsHtml() {
    var listed = ASSETS.length;
    var verified = ASSETS.filter(isVerified).length;
    var research = ASSETS.filter(function (a) { return a.isResearchLinked; }).length;
    var recent = ASSETS.filter(function (a) { return String(a.listedAt) >= '2025-03-01'; }).length;
    return '<section class="mc-sat-v3-metrics" aria-label="' + escAttr(v3T('Market summary', '市集摘要')) + '">' +
      '<p class="mc-sat-v3-demo-note">' + esc(v3T('Demo metrics — illustrative counts only.', '示範數據 — 僅供參考。')) + '</p>' +
      '<div class="mc-sat-v3-metrics-grid">' +
      metricCard(v3T('Listed SAT Assets', '已上架 SAT'), listed) +
      metricCard(v3T('Verified Passports', '已驗證護照'), verified) +
      metricCard(v3T('Research-linked Assets', '研究連結資產'), research) +
      metricCard(v3T('Recently Added', '近期新增'), recent) +
      '</div></section>';
  }
  function metricCard(label, val) {
    return '<div class="mc-sat-v3-metric"><span>' + esc(label) + '</span><strong>' + esc(val) + '</strong></div>';
  }

  function featuredCollectionsHtml() {
    var featured = COLLECTIONS.filter(function (c) {
      return (c.assetCount || 0) > 0;
    });
    if (!featured.length) return '';
    return '<section class="mc-sat-v3-featured" id="mc-sat-v3-collections">' +
      '<div class="mc-sat-v3-section-head"><h2>' + esc(v3T('Featured Scientific Collections', '精選科學典藏')) + '</h2></div>' +
      '<div class="mc-sat-v3-featured-grid">' + featured.map(collectionCardHtml).join('') + '</div></section>';
  }

  function filterPanelHtml(mobile) {
    var f = state.filters;
    var catPairs = categorySelectPairs(true);
    var verPairs = [['', v3T('Any', '全部')], ['Curator verified', verificationOptLabel('Curator verified')], ['SAT graded', verificationOptLabel('SAT graded')], ['Provenance complete', verificationOptLabel('Provenance complete')]];
    var compPairs = [['', v3T('Any', '全部')], ['high', completenessOptLabel('high')], ['mid', completenessOptLabel('mid')], ['low', completenessOptLabel('low')]];
    var licPairs = licenseSelectPairs(true);
    var sortPairs = SORTS.map(function (s) { return [s[0], sortLabel(s[1])]; });
    return '<aside class="mc-sat-v3-filter-panel' + (mobile ? ' is-sheet' : '') + '" id="mc-sat-v3-filters" aria-label="' + escAttr(v3T('Filters', '篩選')) + '">' +
      (mobile ? '<div class="mc-sat-v3-sheet-head"><strong>' + esc(v3T('Filters', '篩選')) + '</strong><button type="button" data-v3-filter-close aria-label="' + escAttr(v3T('Close', '關閉')) + '">\u00d7</button></div>' : '') +
      '<label class="mc-sat-v3-field"><span>' + esc(v3T('Search', '搜尋')) + '</span><input type="search" data-v3-search placeholder="' + escAttr(v3T('Scientific name, SAT ID, locality\u2026', '學名、SAT ID、產地\u2026')) + '" value="' + escAttr(state.q) + '" /></label>' +
      selectField(v3T('Category', '分類'), 'category', catPairs.map(function (p) { return p[0]; }), f.category, catPairs) +
      selectField(v3T('Verification status', '驗證狀態'), 'verification', verPairs.map(function (p) { return p[0]; }), f.verification, verPairs) +
      selectField(v3T('Provenance completeness', '來源完整度'), 'completeness', compPairs.map(function (p) { return p[0]; }), f.completeness, compPairs) +
      selectField(v3T('License type', '授權類型'), 'license', licPairs.map(function (p) { return p[0]; }), f.license, licPairs) +
      checkField(v3T('Research-linked only', '僅研究連結'), 'researchLinked', f.researchLinked) +
      checkField(v3T('Has specimen passport', '含標本護照'), 'hasPassport', f.hasPassport) +
      checkField(v3T('Includes physical specimen', '含實體標本'), 'hasPhysicalSpecimen', f.hasPhysicalSpecimen) +
      checkField(v3T('Has QR / export metadata', '含 QR／可匯出'), 'hasQr', f.hasQr) +
      '<div class="mc-sat-v3-field mc-sat-v3-price-range"><span>' + esc(v3T('Price range (TWD)', '價格區間 (TWD)')) + '</span>' +
      '<div><input type="number" data-v3-price-min placeholder="' + escAttr(v3T('Min', '最低')) + '" value="' + escAttr(f.priceMin) + '" />' +
      '<input type="number" data-v3-price-max placeholder="' + escAttr(v3T('Max', '最高')) + '" value="' + escAttr(f.priceMax) + '" /></div></div>' +
      selectField(v3T('Sort by', '排序'), 'sort', sortPairs.map(function (p) { return p[0]; }), state.sort, sortPairs) +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-text" data-v3-clear-filters>' + esc(v3T('Clear filters', '清除篩選')) + '</button>' +
      (mobile ? '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-primary" data-v3-filter-close>' + esc(v3T('Apply', '套用')) + '</button>' : '') +
      '</aside>';
  }

  function selectField(label, key, opts, val, pairs) {
    var html = '<label class="mc-sat-v3-field"><span>' + esc(label) + '</span><select data-v3-filter="' + escAttr(key) + '">';
    for (var i = 0; i < opts.length; i++) {
      var v = opts[i];
      var lbl = pairs ? (pairs[i] ? pairs[i][1] : v) : (v || v3T('Any', '全部'));
      if (!v && !pairs) lbl = v3T('Any', '全部');
      html += '<option value="' + escAttr(v) + '"' + (String(val) === String(v) ? ' selected' : '') + '>' + esc(lbl) + '</option>';
    }
    return html + '</select></label>';
  }

  function checkField(label, key, on) {
    return '<label class="mc-sat-v3-check"><input type="checkbox" data-v3-filter="' + escAttr(key) + '"' + (on ? ' checked' : '') + ' /><span>' + esc(label) + '</span></label>';
  }

  function discoveryModule(title, assets) {
    if (!assets.length) return '';
    return '<section class="mc-sat-v3-discovery"><div class="mc-sat-v3-section-head"><h3>' + esc(title) + '</h3></div>' +
      '<div class="mc-sat-v3-discovery-scroll">' +
      assets.slice(0, 6).map(function (a) { return assetCardHtml(a, true); }).join('') +
      '</div></section>';
  }

  function discoveryModulesHtml() {
    var all = ASSETS.slice();
    return       discoveryModule(v3T('Dinosaurs & Paleontology', '恐龍與古生物'), all.filter(function (a) {
        return a.collectionId === 'dinosaur-paleo-gallery' || a.collectionId === 'fossil-trilobite-archive';
      })) +
      discoveryModule(v3T('Recently Verified', '近期驗證'), sorted(all.filter(isVerified)).slice(0, 6)) +
      discoveryModule(v3T('Research-linked Highlights', '研究連結精選'), all.filter(function (a) { return a.isResearchLinked; })) +
      discoveryModule(v3T('New Listings', '最新上架'), sorted(all).slice(0, 6)) +
      discoveryModule(v3T('Highest Completeness', '完整度最高'), sorted(all).sort(function (a, b) { return b.completeness - a.completeness; }).slice(0, 6)) +
      discoveryModule(v3T('Physical Specimens', '含實體標本'), all.filter(function (a) { return a.hasPhysicalSpecimen; })) +
      discoveryModule(v3T('Rare Taxa Spotlight', '稀有類群'), all.filter(function (a) { return /sp\.|var\./i.test(a.scientificName); }));
  }

  function gridSectionHtml() {
    var list = filtered();
    var visible = list.slice(0, state.visible);
    return '<section class="mc-sat-v3-market-grid" id="mc-sat-v3-grid">' +
      '<div class="mc-sat-v3-layout">' +
      filterPanelHtml(false) +
      '<div class="mc-sat-v3-results">' +
      '<div class="mc-sat-v3-results-head">' +
      '<div class="mc-sat-v3-results-head-left"><strong>' + esc(list.length) + '</strong> ' + esc(v3T('SAT assets', '項 SAT 資產')) + '</div>' +
      '<div class="mc-sat-v3-results-head-actions">' + catalogViewToggleHtml() +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline mc-sat-v3-filter-toggle" data-v3-filter-open>' + esc(v3T('Filters', '篩選')) + '</button></div></div>' +
      searchContextHtml(list.length) +
      catalogAssetsHtml(list, visible) +
      (list.length > state.visible ? '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline mc-sat-v3-load-more" data-v3-more>' + esc(v3T('Load more', '載入更多') + ' (' + (list.length - state.visible) + ')') + '</button>' : '') +
      '</div></div></section>';
  }

  function satAboutTeaserHtml() {
    return '<section class="mc-sat-v3-about-teaser">' +
      '<h2>' + esc(v3T('Scientific Asset Tokens (SAT)', '科學資產代幣（SAT）')) + '</h2>' +
      '<p>' + esc(v3T(
        'Verified metadata, specimen passports, provenance, licensing, and legal FAQs — on a dedicated page.',
        '已驗證元資料、標本護照、來源履歷、授權與法律常見問答 — 請見獨立說明頁。'
      )) + '</p>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline" data-v3-go-about>' +
      esc(v3T('Open full SAT guide', '開啟完整 SAT 說明')) + '</button></section>';
  }

  function satJurisdictionalLegalHtml(j) {
    if (!j || !j.intro) return '';
    var body = '<p class="mc-sat-v3-legal-juris-intro">' + esc(j.intro) + '</p>';
    (j.sections || []).forEach(function (sec) {
      body += '<div class="mc-sat-v3-legal-juris-section">' +
        '<h3>' + esc(sec.title) + '</h3>' +
        (sec.paragraphs || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      if (sec.bullets && sec.bullets.length) {
        body += '<ul class="mc-sat-v3-legal-juris-list">' +
          sec.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') +
          '</ul>';
      }
      if (sec.closing) body += '<p class="mc-sat-v3-legal-juris-closing">' + esc(sec.closing) + '</p>';
      body += '</div>';
    });
    if (j.regionsTitle || (j.regionCards && j.regionCards.length)) {
      body += '<div class="mc-sat-v3-legal-juris-section mc-sat-v3-legal-juris-section--regions">';
      if (j.regionsTitle) body += '<h3>' + esc(j.regionsTitle) + '</h3>';
      if (j.regionCards && j.regionCards.length) {
        body += '<div class="mc-sat-v3-legal-region-grid">';
        j.regionCards.forEach(function (card) {
          body += '<article class="mc-sat-v3-legal-region-card"><h3>' + esc(card.title) + '</h3>';
          (card.subsections || []).forEach(function (sub) {
            body += '<div class="mc-sat-v3-legal-region-sub"><h4>' + esc(sub.title) + '</h4>';
            if (sub.paragraphs && sub.paragraphs.length) {
              body += sub.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
            }
            if (sub.bullets && sub.bullets.length) {
              body += '<ul class="mc-sat-v3-legal-region-list">' +
                sub.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') +
                '</ul>';
            }
            body += '</div>';
          });
          body += '</article>';
        });
        body += '</div>';
      }
      body += '</div>';
    }
    if (j.regionsSummary) {
      body += '<p class="mc-sat-v3-legal-juris-summary">' + esc(j.regionsSummary) + '</p>';
    }
    return body;
  }

  function satHighRiskLegalHtml(h) {
    if (!h) return '';
    var body = '<div class="mc-sat-v3-risk-legal-alert" role="note">' +
      '<strong>' + esc(h.alertTitle) + '</strong>' +
      '<p>' + esc(h.alertBody) + '</p></div>';
    body += '<div class="mc-sat-v3-risk-legal-grid">';
    if (h.riskTypes && h.riskTypes.length) {
      body += '<article class="mc-sat-v3-risk-legal-card mc-sat-v3-risk-legal-card--types">' +
        '<h3>' + esc(h.riskTypesTitle) + '</h3>' +
        '<ul class="mc-sat-v3-risk-legal-type-list">' +
        h.riskTypes.map(function (item) {
          return '<li><span class="mc-sat-v3-risk-legal-badge">' +
            esc(v3T('High risk', '高風險')) + '</span> ' + esc(item) + '</li>';
        }).join('') +
        '</ul></article>';
    }
    (h.cards || []).forEach(function (card) {
      var cls = 'mc-sat-v3-risk-legal-card' + (card.prominent ? ' mc-sat-v3-risk-legal-card--prohibited' : '');
      body += '<article class="' + cls + '"><h3>' + esc(card.title) + '</h3>';
      if (card.intro) body += '<p class="mc-sat-v3-risk-legal-card-intro">' + esc(card.intro) + '</p>';
      if (card.bullets && card.bullets.length) {
        body += '<ul class="mc-sat-v3-risk-legal-list">' +
          card.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') +
          '</ul>';
      }
      body += '</article>';
    });
    body += '</div>';
    return body;
  }

  function satAboutPageHtml() {
    var c = typeof global.MC_SAT_getAboutContent === 'function'
      ? global.MC_SAT_getAboutContent(v3IsZh())
      : null;
    if (!c) {
      return '<div class="mc-sat-v3-empty">' + esc(v3T('SAT guide content unavailable.', 'SAT 說明內容無法載入。')) + '</div>';
    }
    var toc = c.sections.map(function (s) {
      return '<a href="#mc-sat-about-' + escAttr(s.id) + '">' + esc(s.title) + '</a>';
    }).join('');
    toc += '<a href="#mc-sat-about-faq">' + esc(c.faqTitle) + '</a>';
    toc += '<a href="#mc-sat-about-legal">' + esc(c.legalTitle) + '</a>';
    if (c.jurisdictionalLegalTitle) {
      toc += '<a href="#mc-sat-about-jurisdictional-legal">' + esc(c.jurisdictionalLegalTitle) + '</a>';
    }
    if (c.highRiskLegalTitle) {
      toc += '<a href="#mc-sat-about-high-risk-legal">' + esc(c.highRiskLegalTitle) + '</a>';
    }
    toc += '<a href="#mc-sat-about-glossary">' + esc(c.glossaryTitle) + '</a>';

    var sections = c.sections.map(function (s) {
      var body = (s.paragraphs || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      var bullets = (s.bullets || []).length
        ? '<ul>' + s.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>'
        : '';
      var steps = (s.steps || []).length
        ? '<ol class="mc-sat-v3-about-steps">' + s.steps.map(function (st) {
          return '<li><strong>' + esc(st.title) + '</strong><p>' + esc(st.body) + '</p></li>';
        }).join('') + '</ol>'
        : '';
      return '<section class="mc-sat-v3-about-block" id="mc-sat-about-' + escAttr(s.id) + '">' +
        '<h2>' + esc(s.title) + '</h2>' + body + bullets + steps + '</section>';
    }).join('');

    function satFaqItemBodyHtml(item) {
      var body = '';
      if (item.paragraphs && item.paragraphs.length) {
        body = item.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      } else if (item.a) {
        body = '<p>' + esc(item.a) + '</p>';
      }
      if (item.bullets && item.bullets.length) {
        body += '<ul>' + item.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
      }
      return body;
    }

    function satFaqItemHtml(item) {
      var badges = satFaqBadgesHtml(item);
      return '<details class="mc-sat-v3-faq-item">' +
        '<summary><span class="mc-sat-v3-faq-summary-text">' + esc(item.q) + '</span>' + badges + '</summary>' +
        satFaqItemBodyHtml(item) + '</details>';
    }

    var faqChips = '<nav class="mc-sat-v3-faq-chips" aria-label="' + escAttr(v3T('FAQ categories', 'FAQ 分類')) + '">' +
      FAQ_CHIP_NAV.map(function (chip) {
        return '<button type="button" class="mc-sat-v3-faq-chip" data-faq-chip="' + escAttr(chip.id) + '">' +
          esc(v3T(chip.en, chip.zh)) + '</button>';
      }).join('') + '</nav>';

    var faqToolbar = '<div class="mc-sat-v3-faq-toolbar">' +
      '<input type="search" class="mc-sat-v3-faq-search" placeholder="' +
      escAttr(v3T(
        'Search checklist, license, CITES, Taiwan, Japan, tax, securities…',
        '搜尋檢查表、授權、CITES、台灣、日本、稅務、證券法、特定商取引...'
      )) + '" autocomplete="off" />' +
      '<div class="mc-sat-v3-faq-tools">' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline mc-sat-v3-faq-expand-all">' +
      esc(v3T('Expand all', '展開全部')) + '</button>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline mc-sat-v3-faq-collapse-all">' +
      esc(v3T('Collapse all', '收合全部')) + '</button>' +
      '</div></div>';

    var faqEmpty = '<p class="mc-sat-v3-faq-empty" hidden>' +
      esc(v3T(
        'No matching FAQ. Try keywords such as "license", "physical", "CITES", "refund", or "verification".',
        '找不到符合的 FAQ，請嘗試「授權」、「實體」、「CITES」、「退款」、「驗證」等關鍵字。'
      )) + '</p>';

    var faqIntro = (c.faqIntro || []).map(function (p) {
      return '<p class="mc-sat-v3-faq-intro">' + esc(p) + '</p>';
    }).join('');
    var faqNotice = '';
    if ((c.faqNoticeIntro || (c.faqNoticeBullets && c.faqNoticeBullets.length))) {
      faqNotice = '<div class="mc-sat-v3-faq-notice" role="note">';
      if (c.faqNoticeIntro) faqNotice += '<p>' + esc(c.faqNoticeIntro) + '</p>';
      if (c.faqNoticeBullets && c.faqNoticeBullets.length) {
        faqNotice += '<ul>' + c.faqNoticeBullets.map(function (b) {
          return '<li>' + esc(b) + '</li>';
        }).join('') + '</ul>';
      }
      faqNotice += '</div>';
    }
    var faqChecklistCard = satFaqChecklistCardHtml(c.faqPrePurchaseCard) +
      satFaqChecklistCardHtml(c.faqDeliverablesCard) +
      satFaqChecklistCardHtml(c.faqSellerListingCard) +
      satFaqChecklistCardHtml(c.faqDisputeEvidenceCard);
    var faqLicenseMatrix = satFaqLicenseMatrixHtml(c.faqLicenseMatrix);
    var faqGroups = (c.faqGroups || []).map(function (group, idx) {
      var gid = FAQ_GROUP_IDS[idx] || ('faq-group-' + idx);
      return '<div class="mc-sat-v3-faq-group" id="' + escAttr(gid) + '">' +
        '<h3>' + esc(group.title) + '</h3>' +
        (group.items || []).map(satFaqItemHtml).join('') + '</div>';
    }).join('');
    var faqLegacy = (!c.faqGroups && c.faq) ? c.faq.map(satFaqItemHtml).join('') : '';

    var faq = '<section class="mc-sat-v3-about-block mc-sat-v3-about-faq" id="mc-sat-about-faq">' +
      '<h2>' + esc(c.faqTitle) + '</h2>' + faqIntro + faqChips + faqNotice + faqChecklistCard + faqLicenseMatrix + faqToolbar + faqEmpty +
      '<div class="mc-sat-v3-faq-groups">' + faqGroups + faqLegacy + '</div></section>';

    var legal = '<section class="mc-sat-v3-about-block mc-sat-v3-about-legal" id="mc-sat-about-legal">' +
      '<h2>' + esc(c.legalTitle) + '</h2>' +
      c.legal.map(function (block) {
        return '<div class="mc-sat-v3-legal-block"><h3>' + esc(block.title) + '</h3>' +
          block.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>';
      }).join('') + '</section>';

    var jurisdictionalLegal = '';
    if (c.jurisdictionalLegalTitle && c.jurisdictionalLegal) {
      jurisdictionalLegal = '<section class="mc-sat-v3-about-block mc-sat-v3-legal-jurisdictions" id="mc-sat-about-jurisdictional-legal">' +
        '<h2>' + esc(c.jurisdictionalLegalTitle) + '</h2>' +
        satJurisdictionalLegalHtml(c.jurisdictionalLegal) +
        '</section>';
    }

    var highRiskLegal = '';
    if (c.highRiskLegalTitle && c.highRiskLegal) {
      highRiskLegal = '<section class="mc-sat-v3-about-block mc-sat-v3-risk-legal" id="mc-sat-about-high-risk-legal">' +
        '<h2>' + esc(c.highRiskLegalTitle) + '</h2>' +
        satHighRiskLegalHtml(c.highRiskLegal) +
        '</section>';
    }

    var glossary = '<section class="mc-sat-v3-about-block" id="mc-sat-about-glossary">' +
      '<h2>' + esc(c.glossaryTitle) + '</h2><dl class="mc-sat-v3-glossary">' +
      c.glossary.map(function (g) {
        return '<div><dt>' + esc(g.term) + '</dt><dd>' + esc(g.def) + '</dd></div>';
      }).join('') + '</dl></section>';

    return '<article class="mc-sat-v3-about-page">' +
      '<header class="mc-sat-v3-about-head">' +
      '<span class="mc-sat-v3-kicker">SAT</span>' +
      '<h1>' + esc(c.title) + '</h1>' +
      '<p class="mc-sat-v3-lead">' + esc(c.subtitle) + '</p>' +
      '<p class="mc-sat-v3-about-updated">' + esc(c.lastUpdated) + '</p>' +
      '<div class="mc-sat-v3-about-banner" role="note">' + esc(c.demoBanner) + '</div>' +
      '<div class="mc-sat-v3-about-actions">' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-primary" data-v3-go-market>' + esc(c.backToMarket) + '</button></div>' +
      '</header>' +
      '<nav class="mc-sat-v3-about-toc" aria-label="' + escAttr(c.toc) + '"><strong>' + esc(c.toc) + '</strong>' + toc + '</nav>' +
      '<div class="mc-sat-v3-about-body">' + sections + faq + legal + jurisdictionalLegal + highRiskLegal + glossary +
      '<footer class="mc-sat-v3-about-foot"><h2>' + esc(c.contactTitle) + '</h2><p>' + esc(c.contactBody) + '</p></footer>' +
      '</div></article>';
  }

  function howSatHtml() {
    return satAboutTeaserHtml();
  }

  function listFormPaymentFieldsHtml() {
    var selected = normalizePaymentMethods(state.listForm.paymentMethods);
    var set = {};
    selected.forEach(function (m) { set[m] = true; });
    return '<div class="mc-sat-v3-field mc-sat-v3-field-full mc-sat-v3-payment-methods">' +
      '<span>' + esc(v3T('Accepted payment methods', '接受的付款方式')) + '</span>' +
      '<p class="mc-sat-v3-check-sub">' + esc(v3T(
        'You decide which payment options buyers may use (virtual currency, card, bank transfer, etc.). Select at least one.',
        '賣家決定買家可用的付款方式（虛擬貨幣、刷卡、匯款等，至少選一項）。'
      )) + '</p>' +
      '<div class="mc-sat-v3-payment-grid">' +
      PAYMENT_METHODS.map(function (m) {
        return '<label class="mc-sat-v3-check mc-sat-v3-check-inline"><input type="checkbox" data-v3-list-pay="' + m + '"' + (set[m] ? ' checked' : '') + ' />' +
          '<span>' + esc(paymentMethodLabel(m)) + '</span></label>';
      }).join('') +
      '</div></div>';
  }

  function checkoutOverlayHtml() {
    if (!state.checkout.assetId) return '';
    var a = findAsset(state.checkout.assetId);
    if (!a || a.inquiryOnly) return '';
    var methods = normalizePaymentMethods(a.paymentMethods);
    var method = state.checkout.method && methods.indexOf(state.checkout.method) >= 0 ? state.checkout.method : methods[0];
    state.checkout.method = method || '';
    return '<div class="mc-sat-v3-sheet-backdrop" data-v3-checkout-close></div>' +
      '<div class="mc-sat-v3-checkout-sheet" role="dialog" aria-labelledby="mc-sat-v3-checkout-title">' +
      '<div class="mc-sat-v3-sheet-head"><h2 id="mc-sat-v3-checkout-title">' + esc(v3T('Checkout', '結帳')) + '</h2>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-text" data-v3-checkout-close>' + esc(v3T('Close', '關閉')) + '</button></div>' +
      '<p class="mc-sat-v3-checkout-sci"><em>' + esc(a.scientificName) + '</em></p>' +
      '<p class="mc-sat-v3-checkout-price">' + esc(priceLabel(a)) + '</p>' +
      (a.hasPhysicalSpecimen ? physicalTransferAlert(a) : '') +
      '<p class="mc-sat-v3-muted">' + esc(v3T('Seller accepts', '賣家接受')) + ': ' + esc(paymentMethodsSummary(a.paymentMethods)) + '</p>' +
      '<p class="mc-sat-v3-checkout-pay-label">' + esc(v3T('Payment method', '付款方式')) + '</p>' +
      '<div class="mc-sat-v3-payment-grid mc-sat-v3-payment-grid--checkout">' +
      methods.map(function (m) {
        return '<button type="button" class="mc-sat-v3-pay-chip' + (method === m ? ' is-active' : '') + '" data-v3-checkout-pay="' + m + '">' + esc(paymentMethodLabel(m)) + '</button>';
      }).join('') +
      '</div>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-primary mc-sat-v3-checkout-confirm" data-v3-checkout-confirm' + (!method ? ' disabled' : '') + '>' +
      esc(a.hasPhysicalSpecimen ? v3T('Confirm purchase (SAT + physical)', '確認購買（SAT + 實體）') : v3T('Confirm purchase', '確認購買')) +
      '</button></div>';
  }

  function openCheckout(assetId) {
    var a = findAsset(assetId);
    if (!a || a.inquiryOnly) return;
    var methods = normalizePaymentMethods(a.paymentMethods);
    state.checkout = { assetId: String(assetId), method: methods[0] || '' };
    paint();
  }

  function closeCheckout() {
    state.checkout = { assetId: '', method: '' };
    paint();
  }

  function confirmCheckout() {
    if (!state.checkout.assetId) return;
    var a = findAsset(state.checkout.assetId);
    if (!a) return;
    var methods = normalizePaymentMethods(a.paymentMethods);
    var picked = state.checkout.method;
    if (!picked || methods.indexOf(picked) < 0) {
      showToast(v3T('Payment method not accepted', '此上架不接受所選付款方式'));
      return;
    }
    var label = paymentMethodLabel(picked);
    state.checkout = { assetId: '', method: '' };
    showToast(v3T('Order created (demo) — ' + label, '訂單已建立（示範）— ' + label));
    paint();
  }

  function listFormHtml() {
    var f = state.listForm;
    return '<div class="mc-sat-v3-list-form">' +
      '<button type="button" class="mc-sat-v3-back" data-v3-back-market>\u2190 ' + esc(v3T('Back to marketplace', '返回市集')) + '</button>' +
      '<span class="mc-sat-v3-kicker">' + esc(v3T('Seller dashboard', '賣家後台')) + '</span>' +
      '<h1>' + esc(v3T('List a SAT record', '上架 SAT 紀錄')) + '</h1>' +
      '<p class="mc-sat-v3-lead">' + esc(v3T(
        'Publish a verified specimen-linked asset. If a physical specimen is included, SAT and physical transfer together upon sale.',
        '發布已驗證的標本連結資產。若含實體標本，交易時 SAT 與實體須一併移交。'
      )) + '</p>' +
      '<form class="mc-sat-v3-list-grid" data-v3-list-form onsubmit="return false">' +
      '<label class="mc-sat-v3-field"><span>' + esc(v3T('Scientific name *', '學名 *')) + '</span><input type="text" data-v3-list="scientificName" required placeholder="e.g. Papilio memnon" value="' + escAttr(f.scientificName) + '" /></label>' +
      '<label class="mc-sat-v3-field"><span>' + esc(v3T('Common name', '俗名')) + '</span><input type="text" data-v3-list="commonName" placeholder="' + escAttr(v3T('Optional', '選填')) + '" value="' + escAttr(f.commonName) + '" /></label>' +
      selectField(v3T('Category', '分類'), 'category', categorySelectPairs(false).map(function (p) { return p[0]; }), f.category, categorySelectPairs(false)).replace(/data-v3-filter/g, 'data-v3-list') +
      '<label class="mc-sat-v3-field"><span>' + esc(v3T('Price (TWD)', '價格 (TWD)')) + '</span><input type="number" data-v3-list="price" min="0" step="1" placeholder="' + escAttr(v3T('0 for inquiry only', '0 表示僅詢價')) + '" value="' + escAttr(f.price) + '" /></label>' +
      selectField(v3T('License type', '授權類型'), 'licenseType', licenseSelectPairs(false).map(function (p) { return p[0]; }), f.licenseType, licenseSelectPairs(false)).replace(/data-v3-filter/g, 'data-v3-list') +
      '<label class="mc-sat-v3-field mc-sat-v3-field-full"><span>' + esc(v3T('Description', '描述')) + '</span><textarea data-v3-list="description" rows="4" placeholder="' + escAttr(v3T('Provenance, locality, usage notes\u2026', '來源、產地、使用說明\u2026')) + '">' + esc(f.description) + '</textarea></label>' +
      '<div class="mc-sat-v3-list-physical mc-sat-v3-field-full">' +
      '<label class="mc-sat-v3-check mc-sat-v3-check-block"><input type="checkbox" data-v3-list="hasPhysicalSpecimen"' + (f.hasPhysicalSpecimen ? ' checked' : '') + ' />' +
      '<span><strong>' + esc(v3T('Includes physical specimen', '含實體標本')) + '</strong><br><span class="mc-sat-v3-check-sub">' +
      esc(v3T('Upon sale, the SAT record and physical specimen must transfer together to the buyer.', '交易完成時，SAT 與實體標本須一併移交買方。')) +
      '</span></span></label>' +
      (f.hasPhysicalSpecimen ? physicalTransferAlert({ hasPhysicalSpecimen: true }) : '') +
      '</div>' +
      listFormPaymentFieldsHtml() +
      '<div class="mc-sat-v3-list-actions mc-sat-v3-field-full">' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline" data-v3-back-market>' + esc(v3T('Cancel', '取消')) + '</button>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-primary" data-v3-list-submit>' + esc(v3T('Publish listing', '發布上架')) + '</button></div>' +
      '</form></div>';
  }

  function submitListForm() {
    if (!requireLogin('publish a listing')) return;
    var f = state.listForm;
    var sci = String(f.scientificName || '').trim();
    if (!sci) {
      showToast(v3T('Scientific name is required', '請填寫學名'));
      return;
    }
    var priceNum = Number(f.price);
    var inquiryOnly = !f.price || isNaN(priceNum) || priceNum <= 0;
    var seq = 200000 + ASSETS.length + 1;
    var id = 'SAT-MC-' + String(seq);
    var desc = String(f.description || '').trim();
    if (f.hasPhysicalSpecimen && desc.indexOf('physical') < 0) {
      desc = (desc ? desc + ' ' : '') + 'SAT and physical specimen transfer together upon sale.';
    }
    var asset = mkAsset({
      id: id,
      satId: id,
      title: sci,
      scientificName: sci,
      commonName: String(f.commonName || '').trim(),
      category: f.category || 'Insects',
      collectionId: 'lucanidae-reference',
      collectionName: 'Lucanidae Reference Collection',
      price: inquiryOnly ? 0 : priceNum,
      inquiryOnly: inquiryOnly,
      licenseType: f.licenseType || 'Academic use',
      hasPhysicalSpecimen: !!f.hasPhysicalSpecimen,
      description: desc || 'Newly listed SAT record.',
      paymentMethods: normalizePaymentMethods(f.paymentMethods),
      listedAt: new Date().toISOString().slice(0, 10),
      locality: 'Pending curator review',
      date: new Date().toISOString().slice(0, 10),
      holder: 'Your collection',
    });
    ASSETS.unshift(asset);
    state.listForm = {
      scientificName: '', commonName: '', category: 'Insects', price: '',
      licenseType: 'Academic use', hasPhysicalSpecimen: false, description: '',
      paymentMethods: DEFAULT_PAYMENT_METHODS.slice(),
    };
    showToast(v3T('Listing published (demo)', '上架已發布（示範）'));
    go('/marketplace/asset/' + encodeURIComponent(id));
  }

  function syncListFormPaymentFromDom(root) {
    var selected = [];
    root.querySelectorAll('[data-v3-list-pay]').forEach(function (el) {
      if (el.checked) selected.push(el.getAttribute('data-v3-list-pay'));
    });
    if (selected.length) state.listForm.paymentMethods = selected;
  }

  function syncListFormFromDom(root) {
    root.querySelectorAll('[data-v3-list]').forEach(function (el) {
      var k = el.getAttribute('data-v3-list');
      if (el.type === 'checkbox') state.listForm[k] = el.checked;
      else state.listForm[k] = el.value;
    });
    syncListFormPaymentFromDom(root);
  }

  function homeHtml() {
    return heroHtml() + tabsHtml() + metricsHtml() + featuredCollectionsHtml() +
      discoveryModulesHtml() + gridSectionHtml() + howSatHtml();
  }

  function detailTabs() {
    return ['overview', 'passport', 'provenance', 'rights', 'metadata', 'activity'];
  }

  function detailTabHtml(a) {
    var tab = state.detailTab;
    if (tab === 'passport') {
      return '<div class="mc-sat-v3-tab-panel mc-sat-v3-tab-panel--passport">' + passportDetailFlipHtml(a) + '</div>';
    }
    if (tab === 'provenance') {
      return '<div class="mc-sat-v3-tab-panel"><h3>' + esc(detailTabLabel('provenance')) + '</h3><ol class="mc-sat-v3-timeline">' +
        (a.provenanceEvents || []).map(function (e) {
          return '<li><time>' + esc(e.date) + '</time><strong>' + esc(provenanceTypeLabel(e.type)) + '</strong><span>' + esc(e.actor) + '</span><p>' + esc(provenanceNoteDisplay(e, a)) + '</p></li>';
        }).join('') + '</ol></div>';
    }
    if (tab === 'rights') {
      var includedPhysical = a.hasPhysicalSpecimen
        ? '<li>' + esc(v3T('SAT record and physical specimen custody transfer together', 'SAT 與實體標本保管權一併移交')) + '</li>' +
          '<li>' + esc(v3T('Physical handover per platform transfer agreement', '依平台移交協議交付實體')) + '</li>'
        : '';
      var notIncludedPhysical = a.hasPhysicalSpecimen
        ? '<li>' + esc(v3T('Shipping, CITES permits, customs, and storage (separate agreement)', '運送、CITES 許可、報關與保管（另議）')) + '</li>'
        : '<li>' + esc(v3T('No automatic claim of physical specimen ownership unless stated', '未標示時不自動包含實體標本所有權')) + '</li>';
      return '<div class="mc-sat-v3-tab-panel"><h3>' + esc(detailTabLabel('rights')) + ' &amp; ' + esc(v3T('License', '授權')) + '</h3>' +
        physicalTransferAlert(a) +
        '<div class="mc-sat-v3-rights-grid"><section><h4>' + esc(v3T('Included', '包含')) + '</h4><ul>' +
        '<li>' + esc(v3T('Display rights for verified metadata', '已驗證元資料之展示權')) + '</li>' +
        '<li>' + esc(v3T('Usage license', '使用授權')) + ': ' + esc(licenseOptLabel(a.licenseType) || a.licenseType) + '</li>' +
        '<li>' + esc(v3T('Citation rights for academic reference', '學術引用之引述權')) + '</li>' +
        '<li>' + esc(v3T('Digital asset access per license terms', '依授權條款之數位資產存取')) + '</li>' +
        includedPhysical + '</ul></section>' +
        '<section><h4>' + esc(v3T('Not included / separate agreement', '不包含／另議')) + '</h4><ul>' +
        notIncludedPhysical +
        '<li>' + esc(v3T('No financial promise or investment return', '無投資報酬或財務承諾')) + '</li>' +
        '<li>' + esc(v3T('No scientific guarantee beyond verified metadata', '除已驗證元資料外無科學保證')) + '</li></ul></section></div></div>';
    }
    if (tab === 'metadata') {
      var rows = [
        [v3T('Scientific name', '學名'), a.scientificName],
        [v3T('Common name', '俗名'), assetDisplayCommonName(a) || a.commonName || '—'],
        [v3T('Taxonomy', '分類學'), a.metadata.taxonomy || '—'],
        [v3T('Locality', '產地'), a.locality],
        [v3T('Date', '日期'), a.date],
        [v3T('Collector / holder', '採集者／持有人'), a.collector || a.holder],
        [v3T('License', '授權'), licenseOptLabel(a.licenseType) || a.licenseType],
        [v3T('Verification', '驗證'), verificationOptLabel(a.verificationStatus) || a.verificationStatus],
        [v3T('Physical specimen', '實體標本'), a.hasPhysicalSpecimen ? v3T('Yes — transferred with SAT', '是 — 與 SAT 一併移交') : v3T('No — digital SAT only', '否 — 僅數位 SAT')],
        [v3T('Export formats', '匯出格式'), a.hasQr ? 'QR, CSV, JSON' : v3T('Pending', '待補')],
        [v3T('Token standard', '代幣標準'), v3T('SAT (Scientific Asset Token)', 'SAT（科學資產代幣）')],
      ];
      return '<div class="mc-sat-v3-tab-panel"><h3>' + esc(detailTabLabel('metadata')) + '</h3><table class="mc-sat-v3-table"><tbody>' +
        rows.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    }
    if (tab === 'activity') {
      return '<div class="mc-sat-v3-tab-panel"><h3>' + esc(detailTabLabel('activity')) + '</h3><ul class="mc-sat-v3-activity">' +
        (a.activity || []).map(function (ev) {
          return '<li><time>' + esc(ev.date) + '</time><span>' + esc(activityTypeLabel(ev.type)) + '</span><p>' + esc(activityNoteDisplay(ev, a)) + '</p></li>';
        }).join('') + '</ul></div>';
    }
    return '<div class="mc-sat-v3-tab-panel"><h3>' + esc(detailTabLabel('overview')) + '</h3>' + physicalTransferAlert(a) +
      '<p>' + esc(assetDisplayDescription(a)) + '</p>' +
      '<dl class="mc-sat-v3-facts">' +
      fact(v3T('Category', '分類'), categoryOptLabel(a.category) || a.category) + fact(v3T('Physical specimen', '實體標本'), a.hasPhysicalSpecimen ? v3T('Yes — bundled with SAT', '是（與 SAT 一併）') : v3T('No', '否')) +
      fact(v3T('Locality', '產地'), a.locality) + fact(v3T('Date', '日期'), a.date) +
      fact(v3T('Holder', '持有人'), a.holder) + fact(v3T('Collector', '採集者'), a.collector || '—') +
      fact(v3T('Collection', '典藏'), assetCollectionDisplayName(a)) +
      '</dl></div>';
  }
  function fact(k, v) { return v ? '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>' : ''; }

  function assetDetailHtml(a) {
    var tabs = detailTabs();
    return '<div class="mc-sat-v3-detail mc-sat-v3-detail-asset">' +
      '<button type="button" class="mc-sat-v3-back" data-v3-back>\u2190 ' + esc(v3T('Back to marketplace', '返回市集')) + '</button>' +
      '<div class="mc-sat-v3-detail-layout">' +
      '<div class="mc-sat-v3-detail-media">' + imgHtml(a.detailImage || a.image, a.scientificName, 'mc-sat-v3-detail-img') + '</div>' +
      '<aside class="mc-sat-v3-detail-panel">' +
      '<span class="mc-sat-v3-type">' + esc(v3T('Scientific Asset Token', '科學資產代幣 SAT')) + '</span>' +
      '<h1><em>' + esc(a.scientificName) + '</em></h1>' +
      (a.commonName ? '<p class="mc-sat-v3-common">' + esc(assetDisplayCommonName(a)) + '</p>' : '') +
      '<p class="mc-sat-v3-satid">' + esc(a.satId) + '</p>' +
      '<p class="mc-sat-v3-coll-link" data-v3-collection="' + escAttr(a.collectionId) + '">' + esc(assetCollectionDisplayName(a)) + '</p>' +
      '<div class="mc-sat-v3-detail-badges">' + verifyBadge(a) + physicalBadge(a) + '</div>' +
      (a.hasPhysicalSpecimen ? physicalTransferAlert(a) : '') +
      '<p class="mc-sat-v3-complete-line">' + esc(a.completeness) + '% ' + esc(v3T('provenance completeness', '來源完整度')) + '</p>' +
      '<strong class="mc-sat-v3-detail-price">' + esc(priceLabel(a)) + '</strong>' +
      '<p class="mc-sat-v3-payment-accept">' + esc(v3T('Seller accepts', '賣家接受')) + ': ' + esc(paymentMethodsSummary(a.paymentMethods)) + '</p>' +
      '<div class="mc-sat-v3-detail-actions">' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-primary" data-v3-buy="' + escAttr(a.id) + '">' + esc(buyLabel(a)) + '</button>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline" data-v3-protected="' + escAttr(v3T('Make offer', '出價')) + '">' + esc(v3T('Make offer', '出價')) + '</button>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-text" data-v3-save="' + escAttr(a.id) + '">' + esc(v3T('Save', '收藏')) + '</button>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-text" data-v3-share="' + escAttr(a.id) + '">' + esc(v3T('Share', '分享')) + '</button></div>' +
      '</aside></div>' +
      '<nav class="mc-sat-v3-detail-tabs">' + tabs.map(function (t) {
        return '<button type="button" class="mc-sat-v3-detail-tab' + (state.detailTab === t ? ' is-active' : '') + '" data-v3-detail-tab="' + t + '">' + esc(detailTabLabel(t)) + '</button>';
      }).join('') + '</nav>' +
      detailTabHtml(a) +
      '<div class="mc-sat-v3-mobile-bar"><strong>' + esc(priceLabel(a)) + '</strong>' +
      '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-primary" data-v3-buy="' + escAttr(a.id) + '">' + esc(buyLabel(a)) + '</button></div>' +
      '</div>';
  }

  function collectionAboutHtml(c) {
    var about = collectionI18nText(c, 'about') || v3T(
      'Curated scientific assets with verified provenance and usage rights metadata.',
      '精選科學資產，含已驗證來源與使用權利元資料。'
    );
    var focus = collectionI18nText(c, 'focus');
    var physicalCount = ASSETS.filter(function (a) { return a.collectionId === c.id && a.hasPhysicalSpecimen; }).length;
    return '<div class="mc-sat-v3-coll-about">' +
      '<h3>' + esc(v3T('About this collection', '典藏說明')) + '</h3>' +
      '<p>' + esc(about) + '</p>' +
      (focus ? '<h4>' + esc(v3T('Collection focus', '典藏重點')) + '</h4><p>' + esc(focus) + '</p>' : '') +
      '<dl class="mc-sat-v3-facts">' +
      fact(v3T('Category', '分類'), categoryOptLabel(c.category) || c.category) +
      fact(v3T('Curator', '策展單位'), collectionDisplayCurator(c)) +
      fact(v3T('Total assets', '資產總數'), String(c.assetCount)) +
      (physicalCount ? fact(v3T('With physical specimen', '含實體標本'), String(physicalCount)) : '') +
      '</dl></div>';
  }

  function collectionDetailHtml(c) {
    var items = ASSETS.filter(function (a) { return a.collectionId === c.id; });
    var list = sorted(items.filter(filterPass));
    var visible = list.slice(0, state.visible);
    var tab = state.collectionTab || 'assets';
    return '<div class="mc-sat-v3-detail mc-sat-v3-detail-collection">' +
      '<button type="button" class="mc-sat-v3-back" data-v3-back>\u2190 ' + esc(v3T('Back to marketplace', '返回市集')) + '</button>' +
      '<header class="mc-sat-v3-coll-banner">' + imgHtml(c.image, c.name, 'mc-sat-v3-banner-img') +
      '<div><h1>' + esc(collectionDisplayName(c)) + '</h1><p>' + esc(collectionDisplayCurator(c)) + '</p>' +
      '<p class="mc-sat-v3-coll-desc">' + esc(collectionI18nText(c, 'about') || v3T(
        'Curated scientific assets with verified provenance and usage rights metadata.',
        '精選科學資產，含已驗證來源與使用權利元資料。'
      )) + '</p></div></header>' +
      '<div class="mc-sat-v3-coll-metrics">' +
      metricCard(v3T('Assets', '資產'), c.assetCount) +
      metricCard(v3T('Verified ratio', '驗證比例'), c.verificationRatio + '%') +
      metricCard(v3T('Research-linked', '研究連結'), c.researchLinked) +
      metricCard(v3T('Avg completeness', '平均完整度'), c.avgCompleteness + '%') +
      '</div>' +
      '<nav class="mc-sat-v3-detail-tabs">' +
      '<button type="button" class="mc-sat-v3-detail-tab' + (tab === 'assets' ? ' is-active' : '') + '" data-v3-coll-tab="assets">' + esc(v3T('Assets', '資產')) + '</button>' +
      '<button type="button" class="mc-sat-v3-detail-tab' + (tab === 'about' ? ' is-active' : '') + '" data-v3-coll-tab="about">' + esc(v3T('About', '關於')) + '</button></nav>' +
      (tab === 'about'
        ? collectionAboutHtml(c)
        : '<div class="mc-sat-v3-coll-toolbar">' +
          '<label class="mc-sat-v3-field mc-sat-v3-coll-search-field"><span>' + esc(v3T('Search in collection', '典藏內搜尋')) + '</span>' +
          '<input type="search" data-v3-search placeholder="' + escAttr(v3T('Scientific name, SAT ID, locality\u2026', '學名、SAT ID、產地\u2026')) + '" value="' + escAttr(state.q) + '" /></label>' +
          catalogViewToggleHtml() + '</div>' +
          searchContextHtml(list.length) +
          catalogAssetsHtml(list, visible) +
          (list.length > state.visible ? '<button type="button" class="mc-sat-v3-btn mc-sat-v3-btn-outline mc-sat-v3-load-more" data-v3-more>' + esc(v3T('Load more', '載入更多') + ' (' + (list.length - state.visible) + ')') + '</button>' : '')) +
      '</div>';
  }

  function renderHtml() {
    var r = state.route;
    if (r.view === 'asset') {
      var asset = findAsset(r.assetId);
      if (!asset) return wrapPage('<div class="mc-sat-v3-empty">' + esc(v3T('Asset not found.', '找不到資產。')) + '</div>');
      return wrapPage(assetDetailHtml(asset));
    }
    if (r.view === 'collection') {
      var col = findCollection(r.collectionSlug);
      if (!col) return wrapPage('<div class="mc-sat-v3-empty">' + esc(v3T('Collection not found.', '找不到典藏。')) + '</div>');
      return wrapPage(collectionDetailHtml(col));
    }
    if (r.view === 'list') {
      return wrapPage(listFormHtml());
    }
    if (r.view === 'about') {
      return wrapPage(satAboutPageHtml());
    }
    var extras = state.filterOpen ? '<div class="mc-sat-v3-sheet-backdrop" data-v3-filter-close></div>' + filterPanelHtml(true) : '';
    return wrapPage(homeHtml(), extras);
  }

  var MARKET_HIDE = '#welcomeShell,.welcome-shell,.lp-shell,.landing-shell,#mcWelcomeHero,.mc-welcome-hero,#mcEntryModal,[data-mc-public-landing]';

  function ensureStyles() {
    var el = document.getElementById(STYLE_ID);
    if (el) el.remove();
    el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = [
      'html.mc-sat-market-active ' + MARKET_HIDE.split(',').join(',html.mc-sat-market-active ') + '{display:none!important}',
      'html.mc-sat-market-active{background:#fafafa!important}',
      '#mcSatV3MarketplaceRoot{--v3-bg:#fafafa;--v3-surface:#fff;--v3-ink:#1a1a1f;--v3-muted:#5c5c66;--v3-line:#e8e8ec;--v3-indigo:#2c3e6b;--v3-blue:#3d5a80;--v3-green:#3a6b52;--v3-amber:#b8860b;--v3-shadow:0 8px 24px rgba(26,26,31,.08);--v3-rail-collapsed:68px;--v3-rail-expanded:228px;--v3-rail-w:var(--v3-rail-collapsed);position:fixed;inset:0;z-index:12000;overflow:auto;background:var(--v3-bg);color:var(--v3-ink);font-family:Inter,"Noto Sans TC",system-ui,sans-serif;isolation:isolate}',
      '.mc-sat-v3-app{display:flex;min-height:100vh;--v3-rail-w:var(--v3-rail-collapsed)}',
      '.mc-sat-v3-app.is-rail-expanded{--v3-rail-w:var(--v3-rail-expanded)}',
      '.mc-sat-v3-catalog-rail{position:fixed;left:0;top:var(--mc-global-header-height,72px);bottom:0;width:var(--v3-rail-w);background:var(--v3-surface);border-right:1px solid var(--v3-line);display:flex;flex-direction:column;z-index:12001;transition:width .28s cubic-bezier(.4,0,.2,1),box-shadow .28s ease;overflow:hidden}',
      '@media(prefers-reduced-motion:reduce){.mc-sat-v3-catalog-rail{transition:none}}',
      '.mc-sat-v3-catalog-rail.is-expanded{box-shadow:4px 0 24px rgba(26,26,31,.06)}',
      '.mc-sat-v3-rail-top{display:flex;align-items:center;gap:8px;padding:12px 10px;border-bottom:1px solid var(--v3-line);min-height:52px}',
      '.mc-sat-v3-rail-mark{position:relative;display:grid;place-items:center;width:40px;height:40px;flex:0 0 40px;border:none;border-radius:10px;background:var(--v3-indigo);color:#fff;cursor:pointer;padding:0;transition:transform .2s ease,box-shadow .2s ease}',
      '.mc-sat-v3-rail-mark:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(44,62,107,.25)}',
      '.mc-sat-v3-rail-mark-text{font-size:10px;font-weight:700;letter-spacing:.08em;transition:opacity .2s ease}',
      '.mc-sat-v3-rail-expand-icon{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transform:scale(.8);transition:opacity .2s ease,transform .2s ease}',
      '.mc-sat-v3-rail-expand-icon svg{width:16px;height:16px}',
      '.mc-sat-v3-catalog-rail.is-expanded .mc-sat-v3-rail-mark-text{opacity:0}',
      '.mc-sat-v3-catalog-rail.is-expanded .mc-sat-v3-rail-expand-icon{opacity:1;transform:scale(1) rotate(180deg)}',
      '.mc-sat-v3-rail-title{font-size:13px;font-weight:650;color:var(--v3-ink);white-space:nowrap;opacity:0;transform:translateX(-6px);transition:opacity .25s ease .05s,transform .25s ease .05s;pointer-events:none}',
      '.mc-sat-v3-catalog-rail.is-expanded .mc-sat-v3-rail-title{opacity:1;transform:translateX(0)}',
      '.mc-sat-v3-rail-close{display:none;margin-left:auto;border:none;background:none;font-size:20px;color:var(--v3-muted);cursor:pointer;line-height:1;padding:0}',
      '.mc-sat-v3-rail-body{flex:1;padding:6px 6px 8px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}',
      '.mc-sat-v3-rail-group{padding:2px 0 6px}',
      '.mc-sat-v3-rail-group-label{display:block;font-size:10px;font-weight:650;letter-spacing:.1em;text-transform:uppercase;color:var(--v3-muted);padding:6px 10px 4px;opacity:0;max-height:0;overflow:hidden;transition:opacity .2s ease,max-height .25s ease}',
      '.mc-sat-v3-catalog-rail.is-expanded .mc-sat-v3-rail-group-label,.mc-sat-v3-catalog-rail:not(.is-expanded):hover .mc-sat-v3-rail-group-label{opacity:1;max-height:24px}',
      '.mc-sat-v3-rail-foot{padding:8px 6px 14px;border-top:1px solid var(--v3-line);display:flex;flex-direction:column;gap:2px;flex-shrink:0}',
      '.mc-sat-v3-rail-item{position:relative;display:flex;align-items:center;gap:10px;width:100%;border:none;background:transparent;border-radius:10px;padding:8px 10px;cursor:pointer;text-align:left;color:var(--v3-muted);transition:background .18s ease,color .18s ease,transform .18s ease}',
      '.mc-sat-v3-rail-item:before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:var(--v3-indigo);opacity:0;transform:scaleY(.4);transition:opacity .2s ease,transform .2s ease}',
      '.mc-sat-v3-rail-icon{display:grid;place-items:center;width:28px;height:28px;flex:0 0 28px;transition:transform .2s ease,color .2s ease}',
      '.mc-sat-v3-rail-icon svg{width:20px;height:20px;display:block}',
      '.mc-sat-v3-rail-label{font-size:13px;font-weight:550;white-space:nowrap;opacity:0;max-width:0;overflow:hidden;transform:translateX(-4px);transition:opacity .25s ease,max-width .28s ease,transform .25s ease}',
      '.mc-sat-v3-catalog-rail.is-expanded .mc-sat-v3-rail-label,.mc-sat-v3-catalog-rail:not(.is-expanded):hover .mc-sat-v3-rail-label{opacity:1;max-width:168px;transform:translateX(0)}',
      '.mc-sat-v3-rail-item:hover{color:var(--v3-ink);background:#f4f4f7}',
      '@media(prefers-reduced-motion:no-preference){.mc-sat-v3-rail-item:hover .mc-sat-v3-rail-icon{transform:scale(1.08)}}',
      '.mc-sat-v3-rail-item.is-active{color:var(--v3-indigo);background:#eef1f8}',
      '.mc-sat-v3-rail-item.is-active:before{opacity:1;transform:scaleY(1)}',
      '.mc-sat-v3-rail-item.is-active .mc-sat-v3-rail-icon{color:var(--v3-indigo)}',
      '.mc-sat-v3-rail-fab,.mc-sat-v3-rail-backdrop{display:none}',
      '.mc-sat-v3-main{flex:1;min-width:0;margin-left:var(--v3-rail-w);transition:margin-left .28s cubic-bezier(.4,0,.2,1)}',
      '@media(prefers-reduced-motion:reduce){.mc-sat-v3-main{transition:none}}',
      '.mc-sat-v3-shell{width:min(1180px,calc(100vw - var(--v3-rail-w) - 32px));margin:0 auto;padding:calc(var(--mc-global-header-height,72px) + 20px) 0 64px;transition:width .28s cubic-bezier(.4,0,.2,1)}',
      '.mc-sat-v3-kicker{display:block;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--v3-indigo);margin-bottom:10px}',
      '.mc-sat-v3-hero{margin-bottom:28px;overflow:visible}.mc-sat-v3-hero-grid{display:grid;grid-template-columns:1fr minmax(260px,.85fr);gap:24px;align-items:center;overflow:visible}',
      '.mc-sat-v3-hero h1{margin:0 0 12px;font-size:clamp(26px,3.2vw,36px);line-height:1.15;font-weight:650;color:var(--v3-ink)}',
      '.mc-sat-v3-lead{margin:0 0 16px;color:var(--v3-muted);font-size:15px;line-height:1.6;max-width:46ch}',
      '.mc-sat-v3-hero-cta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}',
      '.mc-sat-v3-trust{display:flex;flex-wrap:wrap;gap:8px 14px;margin:0;padding:0;list-style:none;font-size:12px;color:var(--v3-muted)}',
      '.mc-sat-v3-trust li:before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--v3-green);margin-right:6px;vertical-align:middle}',
      '.mc-sat-v3-passport-stack{position:relative;height:min(430px,54vh);min-height:320px;cursor:default;overflow:visible;isolation:isolate}',
      '.mc-sat-v3-passport-stack.is-fanned,.mc-sat-v3-passport-stack:hover{z-index:4}',
      '.mc-sat-v3-hero-visual{align-self:center;width:100%;min-width:0;position:relative;overflow:visible;padding-bottom:8px}',
      '.mc-sat-v3-stack-nav{position:absolute;left:50%;bottom:4px;transform:translateX(-50%);display:flex;gap:10px;z-index:20}',
      '.mc-sat-v3-stack-arrow{width:34px;height:34px;border:1px solid var(--v3-line);background:rgba(255,255,255,.94);border-radius:50%;cursor:pointer;font-size:18px;line-height:1;color:var(--v3-indigo);box-shadow:0 2px 8px rgba(26,26,31,.08);transition:background .18s ease,transform .18s ease}',
      '.mc-sat-v3-stack-arrow:hover{background:#fff;transform:scale(1.06)}',
      '.mc-sat-v3-stack-hint{margin:10px 0 0;font-size:11px;color:var(--v3-muted);text-align:center;line-height:1.5}',
      '.mc-sat-v3-stack-hint-zh{display:block;margin-top:2px;font-size:10px;color:var(--v3-muted);opacity:.9}',
      '.mc-sat-v3-stack-toggle{display:none;margin:8px auto 0;border:1px solid var(--v3-line);background:var(--v3-surface);border-radius:999px;padding:6px 14px;font-size:12px;color:var(--v3-indigo);cursor:pointer}',
      '@media(max-width:900px),(hover:none){.mc-sat-v3-stack-toggle{display:block}}',
      '.mc-sat-v3-stack-toggle[aria-pressed="true"]{background:var(--v3-indigo);color:#fff;border-color:var(--v3-indigo)}',
      '.mc-sat-v3-passport-info{font-size:11px;margin-top:8px;display:grid;gap:4px}.mc-sat-v3-passport-info em{font-style:italic;font-size:12px}',
      '.mc-sat-v3-tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:16px;-webkit-overflow-scrolling:touch;scrollbar-width:none}',
      '.mc-sat-v3-tab{flex:0 0 auto;border:1px solid var(--v3-line);background:var(--v3-surface);border-radius:999px;padding:8px 14px;font-size:13px;cursor:pointer;color:var(--v3-muted)}',
      '.mc-sat-v3-tab.is-active{background:var(--v3-ink);color:#fff;border-color:var(--v3-ink)}',
      '.mc-sat-v3-demo-note{font-size:11px;color:var(--v3-muted);margin:0 0 8px}',
      '.mc-sat-v3-metrics-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px}',
      '.mc-sat-v3-metric{background:var(--v3-surface);border:1px solid var(--v3-line);border-radius:10px;padding:12px 14px}',
      '.mc-sat-v3-metric span{display:block;font-size:11px;color:var(--v3-muted);margin-bottom:4px}.mc-sat-v3-metric strong{font-size:22px;font-weight:650}',
      '.mc-sat-v3-section-head h2,.mc-sat-v3-section-head h3{margin:0 0 12px;font-size:18px;font-weight:650}',
      '.mc-sat-v3-featured-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:28px}',
      '.mc-sat-v3-collection-card,.mc-sat-v3-asset-card{background:var(--v3-surface);border:1px solid var(--v3-line);border-radius:12px;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease,border-color .2s}',
      '@media(prefers-reduced-motion:no-preference){.mc-sat-v3-asset-card:hover,.mc-sat-v3-collection-card:hover{transform:translateY(-4px);box-shadow:var(--v3-shadow);border-color:#d0d0d8}}',
      '.mc-sat-v3-media{position:relative;aspect-ratio:1/1;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px;box-sizing:border-box}',
      '.mc-sat-v3-media img{width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain;object-position:center;position:relative;z-index:1}',
      '.mc-sat-v3-list-thumb .mc-sat-v3-media{width:52px;height:52px;aspect-ratio:auto;padding:4px}',
      '.mc-sat-v3-detail-media .mc-sat-v3-media{aspect-ratio:4/3;max-height:360px;padding:14px}',
      '.mc-sat-v3-passport-preview.mc-sat-v3-media,.mc-sat-v3-card-media.mc-sat-v3-media{padding:12px}',
      '.mc-sat-v3-coll-banner .mc-sat-v3-media{aspect-ratio:4/3;max-height:180px}',
      '.mc-sat-v3-skeleton{position:absolute;inset:0;background:linear-gradient(90deg,#f0f0f4 25%,#e8e8ee 50%,#f0f0f4 75%);background-size:200% 100%;animation:mcV3Sk 1.2s ease infinite;z-index:0}',
      '@keyframes mcV3Sk{0%{background-position:200% 0}100%{background-position:-200% 0}}',
      '.mc-sat-v3-media img[data-loaded="1"]+.mc-sat-v3-skeleton{display:none}',
      '@media(prefers-reduced-motion:reduce){.mc-sat-v3-skeleton{animation:none}}',
      '.mc-sat-v3-card-body{padding:12px 14px 14px}.mc-sat-v3-sciname{margin:0;font-size:15px;line-height:1.3}.mc-sat-v3-sciname em{font-style:italic}',
      '.mc-sat-v3-common{margin:2px 0 8px;font-size:12px;color:var(--v3-muted)}',
      '.mc-sat-v3-card-top{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;margin-bottom:6px}',
      '.mc-sat-v3-satid{font-size:10px;color:var(--v3-muted);font-family:ui-monospace,monospace}',
      '.mc-sat-v3-badge{font-size:10px;font-weight:600;padding:3px 8px;border-radius:999px;background:#eef1f8;color:var(--v3-indigo)}',
      '.mc-sat-v3-badge.is-provenance{background:#fef6e4;color:var(--v3-amber)}.mc-sat-v3-badge.is-graded{background:#e8f2ec;color:var(--v3-green)}',
      '.mc-sat-v3-badge.is-physical{background:#f3ebe8;color:#7a4a32}',
      '.mc-sat-v3-physical-alert{background:#fef8f5;border:1px solid #e8d4cc;border-radius:10px;padding:14px 16px;margin:0 0 16px}',
      '.mc-sat-v3-physical-alert strong{display:block;font-size:14px;margin-bottom:6px;color:#7a4a32}',
      '.mc-sat-v3-physical-alert p{margin:0;font-size:13px;line-height:1.55;color:var(--v3-ink)}',
      '.mc-sat-v3-physical-alert-zh{margin-top:8px!important;color:var(--v3-muted)!important}',
      '.mc-sat-v3-card-meta{display:flex;flex-wrap:wrap;gap:6px;font-size:11px;color:var(--v3-muted);margin-bottom:10px}',
      '.mc-sat-v3-card-foot{display:flex;flex-direction:column;gap:8px}.mc-sat-v3-price{font-size:16px}',
      '.mc-sat-v3-card-actions{display:flex;gap:6px;flex-wrap:wrap}',
      '.mc-sat-v3-btn{border-radius:8px;border:1px solid transparent;padding:8px 14px;font-size:13px;font-weight:550;cursor:pointer;background:transparent;color:var(--v3-ink)}',
      '.mc-sat-v3-btn-primary{background:var(--v3-ink);color:#fff;border-color:var(--v3-ink)}',
      '.mc-sat-v3-btn-outline{border-color:var(--v3-line);background:var(--v3-surface)}',
      '.mc-sat-v3-btn-text{padding:8px 10px;text-decoration:underline;text-underline-offset:2px}',
      '.mc-sat-v3-layout{display:grid;grid-template-columns:260px 1fr;gap:20px;align-items:start}',
      '.mc-sat-v3-filter-panel{background:var(--v3-surface);border:1px solid var(--v3-line);border-radius:12px;padding:14px;position:sticky;top:calc(var(--mc-global-header-height,72px) + 12px);display:grid;gap:10px}',
      '.mc-sat-v3-field span{display:block;font-size:11px;font-weight:600;color:var(--v3-muted);margin-bottom:4px}',
      '.mc-sat-v3-field input,.mc-sat-v3-field select{width:100%;border:1px solid var(--v3-line);border-radius:8px;padding:8px 10px;font-size:13px;background:#fff}',
      '.mc-sat-v3-check{display:flex;align-items:center;gap:8px;font-size:13px}',
      '.mc-sat-v3-check-block{align-items:flex-start;padding:12px;border:1px solid var(--v3-line);border-radius:10px;background:#fafafa}',
      '.mc-sat-v3-check-sub{font-size:12px;color:var(--v3-muted);font-weight:400;line-height:1.45}',
      '.mc-sat-v3-list-form{max-width:720px}',
      '.mc-sat-v3-list-form h1{margin:0 0 8px;font-size:clamp(22px,2.8vw,28px)}',
      '.mc-sat-v3-list-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}',
      '.mc-sat-v3-field-full{grid-column:1/-1}',
      '.mc-sat-v3-field textarea{width:100%;border:1px solid var(--v3-line);border-radius:8px;padding:8px 10px;font-size:13px;background:#fff;resize:vertical;min-height:96px;font-family:inherit}',
      '.mc-sat-v3-list-physical .mc-sat-v3-physical-alert{margin-top:12px}',
      '.mc-sat-v3-list-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:4px}',
      '.mc-sat-v3-price-range div{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
      '.mc-sat-v3-results-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;font-size:14px}',
      '.mc-sat-v3-results-head-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}',
      '.mc-sat-v3-view-toggle{display:inline-flex;border:1px solid var(--v3-line);border-radius:999px;overflow:hidden}',
      '.mc-sat-v3-view-toggle .mc-sat-v3-btn{border:none;border-radius:0;min-height:34px;padding:0 12px;font-size:12px}',
      '.mc-sat-v3-view-toggle .mc-sat-v3-btn.is-active{background:rgba(61,90,128,.12);color:var(--v3-indigo);font-weight:650}',
      '.mc-sat-v3-table-wrap{overflow:auto;border:1px solid var(--v3-line);border-radius:12px;background:var(--v3-surface)}',
      '.mc-sat-v3-asset-table{width:100%;border-collapse:collapse;font-size:13px;min-width:860px}',
      '.mc-sat-v3-asset-table th,.mc-sat-v3-asset-table td{border-bottom:1px solid var(--v3-line);padding:10px 12px;text-align:left;vertical-align:middle}',
      '.mc-sat-v3-asset-table th{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--v3-muted);font-weight:600;background:#fafafb}',
      '.mc-sat-v3-asset-row{cursor:pointer;transition:background .15s ease}',
      '.mc-sat-v3-asset-row:hover{background:rgba(61,90,128,.04)}',
      '.mc-sat-v3-list-thumb{width:60px;padding:8px!important;vertical-align:middle}',
      '.mc-sat-v3-list-thumb .mc-sat-v3-media{margin:0 auto}',
      '.mc-sat-v3-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}',
      '.mc-sat-v3-sciname-cell{font-style:italic;color:var(--v3-muted)}',
      '.mc-sat-v3-muted{color:var(--v3-muted);font-size:12px}',
      '.mc-sat-v3-pill-physical{display:inline-block;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:600;background:rgba(58,107,82,.12);color:var(--v3-green);border:1px solid rgba(58,107,82,.25)}',
      '.mc-sat-v3-coll-toolbar{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px;margin-bottom:12px}',
      '.mc-sat-v3-coll-search-field{flex:1;min-width:200px;margin:0}',
      '.mc-sat-v3-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}',
      '.mc-sat-v3-passport-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;align-items:start}',
      '.mc-sat-v3-discovery{margin-bottom:22px}.mc-sat-v3-discovery-scroll{display:flex;gap:12px;overflow-x:auto;padding-bottom:6px}',
      '.mc-sat-v3-asset-card.is-compact{min-width:200px;flex:0 0 200px}',
      '.mc-sat-v3-about-teaser,.mc-sat-v3-about-page{margin-top:32px;padding:20px;background:var(--v3-surface);border:1px solid var(--v3-line);border-radius:12px}',
      '.mc-sat-v3-about-teaser h2,.mc-sat-v3-about-head h1{margin:0 0 10px;font-size:22px}',
      '.mc-sat-v3-about-page{padding:28px 24px 40px;max-width:880px}',
      '.mc-sat-v3-about-head{margin-bottom:24px}',
      '.mc-sat-v3-about-updated{font-size:13px;color:var(--v3-muted);margin:0 0 12px}',
      '.mc-sat-v3-about-banner{padding:12px 14px;border-radius:10px;background:#fff8e6;border:1px solid #e8d9a8;color:#5c4a12;font-size:14px;line-height:1.55;margin:0 0 16px}',
      '.mc-sat-v3-about-actions{display:flex;gap:10px;flex-wrap:wrap}',
      '.mc-sat-v3-about-toc{display:flex;flex-wrap:wrap;gap:8px 14px;padding:14px 0 20px;border-bottom:1px solid var(--v3-line);margin-bottom:24px;font-size:14px}',
      '.mc-sat-v3-about-toc strong{width:100%;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--v3-muted)}',
      '.mc-sat-v3-about-toc a{color:var(--v3-indigo);text-decoration:none}',
      '.mc-sat-v3-about-toc a:hover{text-decoration:underline}',
      '.mc-sat-v3-about-block{margin-bottom:28px;scroll-margin-top:calc(var(--mc-global-header-height,72px) + 16px)}',
      '.mc-sat-v3-about-block h2{margin:0 0 12px;font-size:20px;color:var(--v3-indigo)}',
      '.mc-sat-v3-about-block p,.mc-sat-v3-about-block li{line-height:1.6;color:var(--v3-muted)}',
      '.mc-sat-v3-about-steps{padding-left:20px}',
      '.mc-sat-v3-about-steps li{margin-bottom:12px}',
      '.mc-sat-v3-faq-intro{margin:0 0 10px;font-size:15px;line-height:1.65;color:var(--v3-muted)}',
      '.mc-sat-v3-faq-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}',
      '.mc-sat-v3-faq-chip{appearance:none;border:1px solid var(--v3-line);background:var(--v3-surface);color:var(--v3-ink);font-size:13px;font-weight:550;line-height:1.3;padding:7px 12px;border-radius:999px;cursor:pointer;transition:border-color .15s,background .15s,color .15s}',
      '.mc-sat-v3-faq-chip:hover{border-color:var(--v3-indigo);color:var(--v3-indigo)}',
      '.mc-sat-v3-faq-chip.is-active{background:#eef0ff;border-color:var(--v3-indigo);color:var(--v3-indigo)}',
      '.mc-sat-v3-faq-chip:focus-visible{outline:2px solid var(--v3-indigo);outline-offset:2px}',
      '.mc-sat-v3-faq-notice{margin:0 0 20px;padding:14px 16px 14px 18px;border:1px solid #dde3f0;border-left:4px solid var(--v3-indigo);border-radius:10px;background:#f6f8fc;font-size:14px;line-height:1.65;color:var(--v3-ink)}',
      '.mc-sat-v3-faq-notice p{margin:0 0 8px}',
      '.mc-sat-v3-faq-notice ul{margin:8px 0 0;padding-left:20px}',
      '.mc-sat-v3-faq-notice li{margin-bottom:6px}',
      '.mc-sat-v3-faq-checklist-card{margin:0 0 20px;padding:16px 18px;border:1px solid #d4e4dc;border-left:4px solid var(--v3-green);border-radius:12px;background:linear-gradient(180deg,#f7fbf9 0%,#fff 100%);box-shadow:0 1px 4px rgba(58,107,82,.06)}',
      '.mc-sat-v3-faq-checklist-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 12px;margin:0 0 10px}',
      '.mc-sat-v3-faq-checklist-head h3{margin:0;font-size:17px;font-weight:650;color:var(--v3-green);letter-spacing:.01em}',
      '.mc-sat-v3-faq-checklist-jump{font-size:13px;padding:7px 12px;white-space:nowrap}',
      '.mc-sat-v3-faq-checklist-intro{margin:0 0 14px;font-size:14px;line-height:1.65;color:var(--v3-ink)}',
      '.mc-sat-v3-faq-checklist-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px 16px}',
      '.mc-sat-v3-faq-checklist-section{margin:0;padding:12px 14px;border:1px solid #e2ebe6;border-radius:10px;background:#fff}',
      '.mc-sat-v3-faq-checklist-section h4{margin:0 0 8px;font-size:13px;font-weight:650;color:var(--v3-indigo);line-height:1.4}',
      '.mc-sat-v3-faq-checklist-items{margin:0;padding:0;list-style:none}',
      '.mc-sat-v3-faq-checklist-items li{position:relative;margin:0 0 7px;padding-left:22px;font-size:13px;line-height:1.55;color:var(--v3-muted)}',
      '.mc-sat-v3-faq-checklist-items li:last-child{margin-bottom:0}',
      '.mc-sat-v3-faq-checklist-items li::before{content:"";position:absolute;left:0;top:3px;width:14px;height:14px;border:1.5px solid #9ab5a8;border-radius:3px;background:#fff}',
      '.mc-sat-v3-faq-checklist-foot{margin:12px 0 0;font-size:12px;line-height:1.55;color:var(--v3-muted)}',
      '.mc-sat-v3-faq-checklist-card--seller{border-color:#dde3f0;border-left-color:var(--v3-indigo);background:linear-gradient(180deg,#f6f8fc 0%,#fff 100%);box-shadow:0 1px 4px rgba(61,90,128,.06)}',
      '.mc-sat-v3-faq-checklist-card--seller .mc-sat-v3-faq-checklist-head h3{color:var(--v3-indigo)}',
      '.mc-sat-v3-faq-checklist-card--seller .mc-sat-v3-faq-checklist-section{border-color:#e4e8f2}',
      '.mc-sat-v3-faq-checklist-card--seller .mc-sat-v3-faq-checklist-items li::before{border-color:#a8b4d4}',
      '.mc-sat-v3-faq-checklist-card--deliverables{border-color:#e8dcc4;border-left-color:#9a7b4f;background:linear-gradient(180deg,#fdfbf7 0%,#fff 100%);box-shadow:0 1px 4px rgba(154,123,79,.08)}',
      '.mc-sat-v3-faq-checklist-card--deliverables .mc-sat-v3-faq-checklist-head h3{color:#7a5c32}',
      '.mc-sat-v3-faq-checklist-card--deliverables .mc-sat-v3-faq-checklist-section{border-color:#ece4d8}',
      '.mc-sat-v3-faq-checklist-card--deliverables .mc-sat-v3-faq-checklist-items li::before{border-color:#c4b59a}',
      '.mc-sat-v3-faq-checklist-card--dispute{border-color:#e8d4d4;border-left-color:#b45454;background:linear-gradient(180deg,#fdf8f8 0%,#fff 100%);box-shadow:0 1px 4px rgba(180,84,84,.08)}',
      '.mc-sat-v3-faq-checklist-card--dispute .mc-sat-v3-faq-checklist-head h3{color:#8b3a3a}',
      '.mc-sat-v3-faq-checklist-card--dispute .mc-sat-v3-faq-checklist-section{border-color:#ecdcdc}',
      '.mc-sat-v3-faq-checklist-card--dispute .mc-sat-v3-faq-checklist-items li::before{border-color:#d4a0a0}',
      '.mc-sat-v3-faq-license-matrix{margin:0 0 20px;padding:16px 18px;border:1px solid #ddd8f0;border-left:4px solid #6366f1;border-radius:12px;background:linear-gradient(180deg,#f8f7ff 0%,#fff 100%);box-shadow:0 1px 4px rgba(99,102,241,.08)}',
      '.mc-sat-v3-faq-license-matrix .mc-sat-v3-faq-checklist-head h3{color:#4338ca}',
      '.mc-sat-v3-faq-matrix-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 0 4px}',
      '.mc-sat-v3-faq-matrix-table{width:100%;min-width:720px;border-collapse:collapse;font-size:13px;line-height:1.45}',
      '.mc-sat-v3-faq-matrix-table th,.mc-sat-v3-faq-matrix-table td{border:1px solid #e4e4ef;padding:8px 10px;text-align:left;vertical-align:top}',
      '.mc-sat-v3-faq-matrix-table thead th{background:#eef0ff;color:#3730a3;font-weight:650;font-size:12px;white-space:nowrap}',
      '.mc-sat-v3-faq-matrix-table tbody th{background:#fafafb;color:var(--v3-ink);font-weight:600;min-width:9rem}',
      '.mc-sat-v3-faq-matrix-table tbody tr:nth-child(even) td,.mc-sat-v3-faq-matrix-table tbody tr:nth-child(even) th{background:#fcfcfe}',
      '.mc-sat-v3-faq-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px;margin:0 0 16px}',
      '.mc-sat-v3-faq-search{flex:1 1 220px;min-width:0;padding:10px 12px;border:1px solid var(--v3-line);border-radius:10px;font-size:14px;line-height:1.4;background:#fff;color:var(--v3-ink)}',
      '.mc-sat-v3-faq-search:focus{outline:2px solid rgba(79,70,229,.35);border-color:var(--v3-indigo)}',
      '.mc-sat-v3-faq-tools{display:flex;flex-wrap:wrap;gap:8px}',
      '.mc-sat-v3-faq-tools .mc-sat-v3-btn{font-size:13px;padding:8px 12px}',
      '.mc-sat-v3-faq-empty{margin:0 0 16px;padding:12px 14px;border-radius:10px;background:#f4f5f8;border:1px dashed var(--v3-line);font-size:14px;line-height:1.55;color:var(--v3-muted)}',
      '.mc-sat-v3-faq-groups{display:flex;flex-direction:column;gap:4px}',
      '.mc-sat-v3-faq-group{margin:0 0 24px;padding:0 0 20px;border-bottom:1px solid #ececf2;scroll-margin-top:calc(var(--mc-global-header-height,72px) + 20px)}',
      '.mc-sat-v3-faq-group:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0}',
      '.mc-sat-v3-faq-group--hidden{display:none}',
      '.mc-sat-v3-faq-group h3{margin:0 0 14px;font-size:16px;font-weight:650;color:var(--v3-indigo);letter-spacing:.01em}',
      '.mc-sat-v3-faq-item{border:1px solid var(--v3-line);border-radius:12px;padding:0;margin:0 0 10px;background:#fafafb;transition:border-color .15s,box-shadow .15s,background .15s}',
      '.mc-sat-v3-faq-item:hover{border-color:#c9c9d4;background:#fff}',
      '.mc-sat-v3-faq-item[open]{background:#fff;box-shadow:0 2px 10px rgba(17,17,17,.04)}',
      '.mc-sat-v3-faq-item[open] summary{margin-bottom:0;border-bottom:1px solid #ececf2}',
      '.mc-sat-v3-faq-item--hidden{display:none!important}',
      '.mc-sat-v3-faq-item summary{cursor:pointer;font-weight:600;color:#111;list-style:none;display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;padding:12px 36px 12px 14px;position:relative;line-height:1.45}',
      '.mc-sat-v3-faq-item summary::-webkit-details-marker{display:none}',
      '.mc-sat-v3-faq-item summary::marker{content:""}',
      '.mc-sat-v3-faq-item summary::after{content:"+";position:absolute;right:14px;top:50%;transform:translateY(-50%);width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:#eef0f4;color:var(--v3-muted);font-size:16px;font-weight:600;line-height:1}',
      '.mc-sat-v3-faq-item[open] summary::after{content:"−";background:#eef0ff;color:var(--v3-indigo)}',
      '.mc-sat-v3-faq-summary-text{flex:1 1 12rem;min-width:0}',
      '.mc-sat-v3-faq-badges{display:inline-flex;flex-wrap:wrap;gap:6px}',
      '.mc-sat-v3-faq-badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;line-height:1.4;letter-spacing:.02em;background:#eef0ff;color:#4338ca;border:1px solid #d9ddff}',
      '.mc-sat-v3-faq-item p{margin:0;padding:0 14px 10px;font-size:14px;color:#2a2a33;line-height:1.65}',
      '.mc-sat-v3-faq-item p:last-of-type{padding-bottom:14px}',
      '.mc-sat-v3-faq-item ul{margin:0;padding:0 14px 14px 30px;font-size:14px;color:#2a2a33;line-height:1.65}',
      '.mc-sat-v3-faq-item li{margin-bottom:8px}',
      '.mc-sat-v3-faq-item li:last-child{margin-bottom:0}',
      '.mc-sat-v3-faq-item[open] > p,.mc-sat-v3-faq-item[open] > ul{animation:mcSatV3FaqFadeIn .22s ease}',
      '@keyframes mcSatV3FaqFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}',
      '@media (prefers-reduced-motion:reduce){.mc-sat-v3-faq-item[open] > p,.mc-sat-v3-faq-item[open] > ul{animation:none}}',
      '@media (max-width:480px){.mc-sat-v3-about-faq .mc-sat-v3-faq-intro{font-size:14px;line-height:1.7}.mc-sat-v3-faq-checklist-grid{grid-template-columns:1fr}.mc-sat-v3-faq-checklist-head{align-items:flex-start}.mc-sat-v3-faq-checklist-jump{width:100%}.mc-sat-v3-faq-chip{font-size:12px;padding:6px 10px}.mc-sat-v3-faq-toolbar{flex-direction:column;align-items:stretch}.mc-sat-v3-faq-tools{width:100%}.mc-sat-v3-faq-tools .mc-sat-v3-btn{flex:1 1 auto}.mc-sat-v3-faq-item summary{padding:12px 34px 12px 12px;font-size:14px}.mc-sat-v3-faq-item p,.mc-sat-v3-faq-item ul{font-size:14px;line-height:1.7;padding-left:12px;padding-right:12px}.mc-sat-v3-faq-item ul{padding-left:26px}}',
      '.mc-sat-v3-legal-block{margin-bottom:18px}',
      '.mc-sat-v3-legal-block h3{margin:0 0 8px;font-size:15px}',
      '.mc-sat-v3-legal-jurisdictions{padding:22px 20px 24px;border:1px solid #d8dce8;border-left:4px solid #4a5568;border-radius:12px;background:linear-gradient(180deg,#f8f9fc 0%,#fff 100%);box-shadow:0 2px 8px rgba(26,32,44,.05)}',
      '.mc-sat-v3-legal-juris-intro{margin:0 0 20px;padding:14px 16px;border-radius:10px;background:#fff;border:1px solid #e2e6ef;font-size:15px;line-height:1.7;color:var(--v3-ink)}',
      '.mc-sat-v3-legal-juris-section{margin:0 0 22px;padding:0 0 18px;border-bottom:1px solid #e8ebf2}',
      '.mc-sat-v3-legal-juris-section:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}',
      '.mc-sat-v3-legal-juris-section h3{margin:0 0 10px;font-size:16px;font-weight:650;color:#2d3748;letter-spacing:.01em}',
      '.mc-sat-v3-legal-juris-section p{margin:0 0 10px;font-size:14px;line-height:1.7;color:var(--v3-muted)}',
      '.mc-sat-v3-legal-juris-list{margin:8px 0 12px;padding-left:22px;font-size:14px;line-height:1.65;color:var(--v3-muted)}',
      '.mc-sat-v3-legal-juris-list li{margin-bottom:8px}',
      '.mc-sat-v3-legal-juris-closing{margin:10px 0 0;padding:12px 14px;border-radius:8px;background:#f4f6fa;border:1px solid #e4e8f0;font-size:14px;line-height:1.65;color:var(--v3-ink)}',
      '.mc-sat-v3-legal-juris-section--regions{margin-top:8px}',
      '.mc-sat-v3-legal-region-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:14px 0 0}',
      '.mc-sat-v3-legal-region-card{padding:16px 18px;border:1px solid #dfe3ec;border-radius:12px;background:#fff;box-shadow:0 1px 4px rgba(26,32,44,.04)}',
      '.mc-sat-v3-legal-region-card>h3{margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid #e8ebf2;font-size:16px;font-weight:650;color:#2d3748}',
      '.mc-sat-v3-legal-region-sub{margin:0 0 16px}',
      '.mc-sat-v3-legal-region-sub:last-child{margin-bottom:0}',
      '.mc-sat-v3-legal-region-sub h4{margin:0 0 8px;font-size:14px;font-weight:650;color:#4a5568;line-height:1.45}',
      '.mc-sat-v3-legal-region-sub p{margin:0 0 8px;font-size:13px;line-height:1.65;color:var(--v3-muted)}',
      '.mc-sat-v3-legal-region-list{margin:0;padding-left:20px;font-size:13px;line-height:1.65;color:var(--v3-muted)}',
      '.mc-sat-v3-legal-region-list li{margin-bottom:7px}',
      '.mc-sat-v3-legal-juris-summary{margin:20px 0 0;padding:14px 16px;border-radius:10px;background:#f0f3f8;border:1px solid #dde2ec;font-size:14px;line-height:1.7;color:var(--v3-ink)}',
      '@media (max-width:1024px){.mc-sat-v3-legal-region-grid{grid-template-columns:1fr}}',
      '.mc-sat-v3-risk-legal{padding:22px 20px 24px;border:1px solid #d8dce8;border-left:4px solid #6b7280;border-radius:12px;background:linear-gradient(180deg,#f9fafb 0%,#fff 100%);box-shadow:0 2px 8px rgba(26,32,44,.05);scroll-margin-top:calc(var(--mc-global-header-height,72px) + 20px)}',
      '.mc-sat-v3-risk-legal-alert{margin:0 0 20px;padding:14px 16px;border-radius:10px;background:#f4f6fa;border:1px solid #dde3ec}',
      '.mc-sat-v3-risk-legal-alert strong{display:block;margin:0 0 8px;font-size:15px;font-weight:650;color:#374151}',
      '.mc-sat-v3-risk-legal-alert p{margin:0;font-size:14px;line-height:1.7;color:var(--v3-muted)}',
      '.mc-sat-v3-risk-legal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}',
      '.mc-sat-v3-risk-legal-card{padding:16px 18px;border:1px solid #dfe3ec;border-radius:12px;background:#fff}',
      '.mc-sat-v3-risk-legal-card--types{grid-column:1/-1}',
      '.mc-sat-v3-risk-legal-card--prohibited{border-color:#d9cfc0;background:linear-gradient(180deg,#faf8f5 0%,#fff 100%);border-left:3px solid #b8956b}',
      '.mc-sat-v3-risk-legal-card h3{margin:0 0 10px;font-size:15px;font-weight:650;color:#2d3748;line-height:1.45}',
      '.mc-sat-v3-risk-legal-card-intro{margin:0 0 10px;font-size:13px;line-height:1.65;color:var(--v3-muted)}',
      '.mc-sat-v3-risk-legal-list,.mc-sat-v3-risk-legal-type-list{margin:0;padding-left:20px;font-size:13px;line-height:1.65;color:var(--v3-muted)}',
      '.mc-sat-v3-risk-legal-list li,.mc-sat-v3-risk-legal-type-list li{margin-bottom:8px}',
      '.mc-sat-v3-risk-legal-type-list{list-style:none;padding-left:0;display:flex;flex-direction:column;gap:8px}',
      '.mc-sat-v3-risk-legal-type-list li{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;background:#f8f9fc;border:1px solid #eceef4}',
      '.mc-sat-v3-risk-legal-badge{display:inline-block;flex-shrink:0;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:650;letter-spacing:.03em;text-transform:uppercase;background:#eef1f6;color:#4b5563;border:1px solid #d5dbe6}',
      '@media (max-width:768px){.mc-sat-v3-risk-legal-grid{grid-template-columns:1fr}.mc-sat-v3-risk-legal-card--types{grid-column:auto}}',
      '.mc-sat-v3-glossary{display:grid;gap:10px}',
      '.mc-sat-v3-glossary dt{font-weight:650;color:var(--v3-ink)}',
      '.mc-sat-v3-glossary dd{margin:4px 0 0;font-size:14px;color:var(--v3-muted)}',
      '.mc-sat-v3-about-foot{margin-top:32px;padding-top:20px;border-top:1px solid var(--v3-line)}',
      '.mc-sat-v3-about{margin-top:32px;padding:20px;background:var(--v3-surface);border:1px solid var(--v3-line);border-radius:12px}',
      '.mc-sat-v3-detail-asset .mc-sat-v3-detail-layout{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;margin-bottom:20px}',
      '.mc-sat-v3-detail-panel{background:var(--v3-surface);border:1px solid var(--v3-line);border-radius:12px;padding:18px}',
      '.mc-sat-v3-type{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--v3-indigo);font-weight:600}',
      '.mc-sat-v3-detail-panel h1{margin:8px 0 4px;font-size:24px}.mc-sat-v3-detail-price{display:block;font-size:22px;margin:12px 0}',
      '.mc-sat-v3-detail-badges{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:8px 0}',
      '.mc-sat-v3-detail-panel .mc-sat-v3-physical-alert{margin:0 0 12px}',
      '.mc-sat-v3-detail-actions{display:flex;flex-wrap:wrap;gap:8px}',
      '.mc-sat-v3-tab-panel--passport{padding:0 0 16px}',
      '.mc-sat-v3-passport-tools{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:0 0 12px}',
      '.mc-sat-v3-passport-toggle{display:inline-flex;gap:8px}',
      '.mc-sat-v3-passport-flip-hint{margin:0;font-size:11px;color:var(--v3-muted)}',
      '.mc-sat-v3-detail-passport{display:block;padding:0 0 20px}',
      '.mc-sat-v3-passport-flip-scene{width:min(360px,100%);margin:0 auto;perspective:1200px}',
      '.mc-sat-v3-passport-flip-card{display:grid;grid-template-columns:1fr;align-items:stretch;transform-style:preserve-3d;transition:transform .58s cubic-bezier(.2,.8,.2,1);cursor:pointer}',
      '.mc-sat-v3-passport-flip-card.is-flipped{transform:rotateY(180deg)}',
      '.mc-sat-v3-passport-flip-face{grid-area:1/1;display:flex;flex-direction:column;min-height:100%;backface-visibility:hidden;-webkit-backface-visibility:hidden}',
      '.mc-sat-v3-passport-flip-face--back{transform:rotateY(180deg)}',
      '.mc-sat-v3-detail-passport .mc-passport-card--detail{max-width:100%;width:100%;cursor:pointer}',
      '.mc-sat-v3-detail-passport .mc-passport-card--detail:hover{transform:none}',
      '@media(prefers-reduced-motion:reduce){.mc-sat-v3-passport-flip-card{transition:none}}',
      '.mc-sat-v3-detail-tab{border:none;background:none;padding:8px 12px;font-size:13px;cursor:pointer;color:var(--v3-muted);border-bottom:2px solid transparent;margin-bottom:-9px}',
      '.mc-sat-v3-detail-tab.is-active{color:var(--v3-ink);border-bottom-color:var(--v3-indigo);font-weight:600}',
      '.mc-sat-v3-timeline,.mc-sat-v3-activity{margin:0;padding:0;list-style:none;display:grid;gap:12px}',
      '.mc-sat-v3-timeline li,.mc-sat-v3-activity li{background:var(--v3-surface);border:1px solid var(--v3-line);border-radius:10px;padding:12px}',
      '.mc-sat-v3-table{width:100%;border-collapse:collapse;font-size:13px}.mc-sat-v3-table th,.mc-sat-v3-table td{border-bottom:1px solid var(--v3-line);padding:10px;text-align:left}',
      '.mc-sat-v3-table th{width:34%;color:var(--v3-muted);font-weight:550}',
      '.mc-sat-v3-rights-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}',
      '.mc-sat-v3-back{border:none;background:none;padding:0;margin-bottom:16px;font-size:14px;cursor:pointer;color:var(--v3-indigo)}',
      '.mc-sat-v3-coll-banner{display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:center;margin-bottom:16px}',
      '.mc-sat-v3-coll-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}',
      '.mc-sat-v3-coll-desc{font-size:14px;color:var(--v3-muted);margin:8px 0 0;line-height:1.5}',
      '.mc-sat-v3-coll-about{padding:0 0 24px;max-width:720px}',
      '.mc-sat-v3-coll-about h3{margin:0 0 8px;font-size:18px}',
      '.mc-sat-v3-coll-about h4{margin:16px 0 6px;font-size:14px;color:var(--v3-indigo)}',
      '.mc-sat-v3-coll-about p{margin:0 0 12px;line-height:1.55;color:var(--v3-muted)}',
      '.mc-sat-v3-hl{background:rgba(61,90,128,.2);color:inherit;border-radius:3px;padding:0 2px;font-style:inherit;font-weight:inherit}',
      '.mc-sat-v3-search-context{font-size:13px;color:var(--v3-muted);margin:-4px 0 14px;line-height:1.5}',
      '.mc-sat-v3-search-context strong{color:var(--v3-ink)}',
      '.mc-sat-v3-search-suggestions{margin:12px 0 0;display:flex;flex-wrap:wrap;align-items:center;gap:8px;justify-content:center}',
      '.mc-sat-v3-search-suggestions-label{font-size:12px;color:var(--v3-muted);width:100%;text-align:center}',
      '.mc-sat-v3-search-chip{border:1px solid var(--v3-line);background:var(--v3-surface);border-radius:999px;padding:6px 12px;font-size:12px;cursor:pointer;color:var(--v3-indigo)}',
      '.mc-sat-v3-search-chip:hover{border-color:var(--v3-indigo);background:rgba(61,90,128,.06)}',
      '.mc-sat-v3-empty .mc-sat-v3-btn{margin-top:12px}',
      '.mc-sat-v3-detail-collection .mc-sat-v3-detail-tabs{position:sticky;top:calc(var(--mc-global-header-height, 72px) - 1px);z-index:3;background:var(--v3-bg);padding:4px 0 10px;margin-bottom:4px;border-bottom:1px solid var(--v3-line)}',
      '.mc-sat-v3-filter-toggle{display:none}',
      '.mc-sat-v3-sheet-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:12001}',
      '.mc-sat-v3-filter-panel.is-sheet{position:fixed;left:0;right:0;bottom:0;z-index:12002;border-radius:16px 16px 0 0;max-height:78vh;overflow:auto}',
      '.mc-sat-v3-sheet-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}',
      '.mc-sat-v3-mobile-bar{display:none;position:fixed;left:0;right:0;bottom:0;z-index:12003;background:var(--v3-surface);border-top:1px solid var(--v3-line);padding:10px 16px;align-items:center;justify-content:space-between;gap:12px}',
      '.mc-sat-v3-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--v3-ink);color:#fff;padding:10px 16px;border-radius:8px;font-size:13px;z-index:12010}',
      '.mc-sat-v3-payment-accept{font-size:13px;color:var(--v3-muted);margin:0 0 12px;line-height:1.45}',
      '.mc-sat-v3-payment-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}',
      '.mc-sat-v3-payment-methods .mc-sat-v3-check-sub{margin:4px 0 0;font-size:12px;color:var(--v3-muted);line-height:1.45}',
      '.mc-sat-v3-pay-chip{border:1px solid var(--v3-line);background:var(--v3-surface);border-radius:999px;padding:8px 14px;font-size:13px;cursor:pointer;color:var(--v3-ink)}',
      '.mc-sat-v3-pay-chip.is-active{border-color:var(--v3-indigo);background:rgba(61,90,128,.08);color:var(--v3-indigo);font-weight:600}',
      '.mc-sat-v3-checkout-sheet{position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:min(480px,calc(100vw - 24px));z-index:12004;background:var(--v3-surface);border:1px solid var(--v3-line);border-radius:16px 16px 0 0;padding:18px 18px 24px;box-shadow:var(--v3-shadow)}',
      '.mc-sat-v3-checkout-sheet h2{margin:0;font-size:18px}',
      '.mc-sat-v3-checkout-sci{margin:8px 0 4px;font-size:15px}',
      '.mc-sat-v3-checkout-price{font-size:20px;margin:0 0 10px;display:block}',
      '.mc-sat-v3-checkout-pay-label{font-size:13px;font-weight:600;margin:12px 0 6px}',
      '.mc-sat-v3-checkout-confirm{width:100%;margin-top:16px}',
      '.mc-sat-v3-payment-grid--checkout{margin-bottom:4px}',
      '#mcSatV2MarketplaceRoot{display:none!important}',
      '@media(min-width:901px){.mc-sat-v3-catalog-rail:not(.is-expanded):hover{width:var(--v3-rail-expanded)}.mc-sat-v3-catalog-rail:not(.is-expanded):hover .mc-sat-v3-rail-label{opacity:1;max-width:140px;transform:translateX(0)}.mc-sat-v3-catalog-rail:not(.is-expanded):hover .mc-sat-v3-rail-title{opacity:1;transform:translateX(0)}.mc-sat-v3-app:not(.is-rail-expanded):has(.mc-sat-v3-catalog-rail:not(.is-expanded):hover) .mc-sat-v3-main{margin-left:var(--v3-rail-expanded)}.mc-sat-v3-app:not(.is-rail-expanded):has(.mc-sat-v3-catalog-rail:not(.is-expanded):hover) .mc-sat-v3-shell{width:min(1180px,calc(100vw - var(--v3-rail-expanded) - 32px))}}',
      '@media(max-width:900px){.mc-sat-v3-catalog-rail{transform:translateX(-105%);width:min(240px,82vw);--v3-rail-w:240px!important}.mc-sat-v3-catalog-rail.is-drawer-open{transform:translateX(0)}.mc-sat-v3-catalog-rail.is-drawer-open,.mc-sat-v3-catalog-rail.is-drawer-open.is-expanded{width:min(240px,82vw)}.mc-sat-v3-catalog-rail.is-drawer-open .mc-sat-v3-rail-label{opacity:1;max-width:160px;transform:none}.mc-sat-v3-catalog-rail.is-drawer-open .mc-sat-v3-rail-title{opacity:1;transform:none}.mc-sat-v3-rail-close{display:block}.mc-sat-v3-rail-backdrop{display:block;position:fixed;inset:0;background:rgba(26,26,31,.32);z-index:12000}.mc-sat-v3-rail-fab{display:grid;place-items:center;position:fixed;left:14px;bottom:16px;z-index:12002;width:44px;height:44px;border:1px solid var(--v3-line);background:#fff;border-radius:12px;cursor:pointer;box-shadow:var(--v3-shadow);color:var(--v3-indigo)}.mc-sat-v3-rail-fab-icon svg{width:20px;height:20px}.mc-sat-v3-main{margin-left:0!important}',
      '.mc-sat-v3-main{margin-left:0}',
      '.mc-sat-v3-shell{width:min(1180px,calc(100vw - 24px));padding-bottom:80px}',
      '.mc-sat-v3-hero-grid,.mc-sat-v3-layout,.mc-sat-v3-detail-asset .mc-sat-v3-detail-layout,.mc-sat-v3-rights-grid,.mc-sat-v3-metrics-grid,.mc-sat-v3-coll-metrics,.mc-sat-v3-list-grid{grid-template-columns:1fr}',
      '.mc-sat-v3-filter-panel:not(.is-sheet){display:none}.mc-sat-v3-filter-toggle{display:inline-flex}.mc-sat-v3-passport-stack{height:min(380px,46vh);min-height:280px}.mc-sat-v3-stack-hint{font-size:10px}',
      '.mc-sat-v3-mobile-bar{display:flex}.mc-sat-v3-detail-asset{padding-bottom:72px}.mc-sat-v3-detail-asset .mc-sat-v3-catalog-rail,.mc-sat-v3-detail-asset .mc-sat-v3-rail-fab{display:none}.mc-sat-v3-detail-asset .mc-sat-v3-main{margin-left:0!important}',
      '.mc-sat-v3-detail-collection .mc-sat-v3-coll-banner{grid-template-columns:1fr;text-align:left;gap:12px}',
      '.mc-sat-v3-detail-collection .mc-sat-v3-coll-banner .mc-sat-v3-banner-img,.mc-sat-v3-detail-collection .mc-sat-v3-coll-banner .mc-sat-v3-media{max-width:min(100%,220px);margin:0 auto}',
      '.mc-sat-v3-detail-collection .mc-sat-v3-coll-desc{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
      '.mc-sat-v3-detail-collection .mc-sat-v3-coll-metrics{grid-template-columns:repeat(2,1fr)}',
      '.mc-sat-v3-detail-collection .mc-sat-v3-detail-tabs{top:0}',
      '.mc-sat-v3-detail-collection{padding-bottom:88px}}',
    ].join('\n');
    document.head.appendChild(el);
  }

  function setIsolation(on) {
    document.documentElement.classList.toggle('mc-sat-market-active', on);
    document.body.classList.toggle('mc-sat-market-active', on);
    if (on && global.McSatV2Marketplace && global.McSatV2Marketplace.hide) global.McSatV2Marketplace.hide();
    MARKET_HIDE.split(',').forEach(function (sel) {
      document.querySelectorAll(sel.trim()).forEach(function (node) {
        if (node.id === ROOT_ID) return;
        if (on) { node.setAttribute('hidden', ''); node.setAttribute('inert', ''); }
        else { node.removeAttribute('hidden'); node.removeAttribute('inert'); }
      });
    });
  }

  function ensureRoot() {
    var root = document.getElementById(ROOT_ID);
    if (!root) { root = document.createElement('div'); root.id = ROOT_ID; document.body.appendChild(root); }
    root.className = 'mc-sat-v3-root';
    root.style.display = 'block';
    return root;
  }

  function bindImages(root) {
    root.querySelectorAll('[data-v3-media]').forEach(function (wrap) {
      var img = wrap.querySelector('[data-v3-img]');
      if (!img || img.getAttribute('data-v3-bound')) return;
      img.setAttribute('data-v3-bound', '1');
      function done(ok) {
        if (ok) img.setAttribute('data-loaded', '1');
        else img.src = wrap.getAttribute('data-fb') || '';
      }
      if (img.complete && img.naturalWidth) done(true);
      else {
        img.addEventListener('load', function () { done(true); }, { once: true });
        img.addEventListener('error', function () { done(false); }, { once: true });
      }
    });
  }

  function wire(root) {
    root.querySelectorAll('[data-v3-nav]').forEach(function (btn) {
      btn.onclick = function () { handleSidebarNav(btn.getAttribute('data-v3-nav'), true); };
    });
    root.querySelectorAll('[data-v3-rail-expand]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        toggleRailExpanded();
      };
    });
    root.querySelectorAll('[data-v3-sidebar-open]').forEach(function (btn) {
      btn.onclick = function () { state.sidebarOpen = true; state.railExpanded = true; paint(); };
    });
    root.querySelectorAll('[data-v3-sidebar-close]').forEach(function (btn) {
      btn.onclick = function () { state.sidebarOpen = false; paint(); };
    });
    root.querySelectorAll('[data-v3-tab]').forEach(function (btn) {
      btn.onclick = function () {
        var t = btn.getAttribute('data-v3-tab');
        var catMap = { insects: 'Insects', plants: 'Plants', marine: 'Marine', fossils: 'Fossils', minerals: 'Minerals' };
        state.tab = t;
        state.visible = PAGE_SIZE;
        if (t === 'all') {
          resetFiltersForNav();
          state.sidebarNav = 'catalog';
        } else if (catMap[t]) {
          resetFiltersForNav();
          state.filters.category = catMap[t];
          state.sidebarNav = t;
        } else if (['verified', 'research', 'new', 'trending', 'recent-verified'].indexOf(t) >= 0) {
          resetFiltersForNav();
          state.sidebarNav = t;
        } else {
          state.sidebarNav = '';
        }
        paint();
      };
    });
    var heroDefaultFront = HERO_PICKS[HERO_PICKS.length - 1];
    root.querySelectorAll('[data-v3-hero-prev]').forEach(function (btn) {
      btn.onclick = function (e) { e.stopPropagation(); cycleHeroCard(-1); };
    });
    root.querySelectorAll('[data-v3-hero-next]').forEach(function (btn) {
      btn.onclick = function (e) { e.stopPropagation(); cycleHeroCard(1); };
    });
    root.querySelectorAll('[data-v3-hero-card]').forEach(function (el) {
      function activate() {
        var id = el.getAttribute('data-v3-hero-card');
        var stack = el.closest('.mc-sat-v3-passport-stack');
        var fanned = state.heroStackFan || (stack && stack.matches(':hover'));
        var frontId = state.heroCardFocus || heroDefaultFront;
        if (fanned || frontId === id) {
          go('/marketplace/asset/' + encodeURIComponent(id));
          return;
        }
        state.heroCardFocus = id;
        paint();
      }
      el.onclick = function (e) { e.stopPropagation(); activate(); };
      el.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } };
    });
    root.querySelectorAll('[data-v3-hero-fan]').forEach(function (btn) {
      btn.onclick = function () {
        state.heroStackFan = !state.heroStackFan;
        if (!state.heroStackFan) state.heroCardFocus = '';
        paint();
      };
    });
    root.querySelectorAll('[data-v3-card]').forEach(function (el) {
      function open() { go('/marketplace/asset/' + encodeURIComponent(el.getAttribute('data-v3-card'))); }
      el.onclick = function (e) { if (e.target.closest('button')) return; open(); };
      el.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
    });
    root.querySelectorAll('[data-v3-view]').forEach(function (btn) {
      btn.onclick = function (e) { e.stopPropagation(); go('/marketplace/asset/' + encodeURIComponent(btn.getAttribute('data-v3-view'))); };
    });
    root.querySelectorAll('[data-v3-collection]').forEach(function (el) {
      el.onclick = function (e) {
        e.stopPropagation();
        go('/marketplace/collection/' + encodeURIComponent(el.getAttribute('data-v3-collection')));
      };
    });
    root.querySelectorAll('[data-v3-buy]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-v3-buy');
        var asset = findAsset(id);
        if (asset && asset.inquiryOnly) {
          if (!requireLogin('purchase')) return;
          showToast(v3T('License request submitted (demo)', '授權申請已送出（示範）'));
          return;
        }
        if (!requireLogin('purchase')) return;
        openCheckout(id);
      };
    });
    root.querySelectorAll('[data-v3-checkout-close]').forEach(function (btn) {
      btn.onclick = function () { closeCheckout(); };
    });
    root.querySelectorAll('[data-v3-checkout-pay]').forEach(function (btn) {
      btn.onclick = function () {
        state.checkout.method = btn.getAttribute('data-v3-checkout-pay') || '';
        paint();
      };
    });
    root.querySelectorAll('[data-v3-checkout-confirm]').forEach(function (btn) {
      btn.onclick = function () { confirmCheckout(); };
    });
    root.querySelectorAll('[data-v3-offer],[data-v3-protected]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        requireLogin(btn.getAttribute('data-v3-protected') || btn.getAttribute('data-v3-offer') || 'continue');
      };
    });
    root.querySelectorAll('[data-v3-save]').forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute('data-v3-save');
        state.watch[id] = !state.watch[id];
        saveWatch();
        showToast(state.watch[id] ? v3T('Saved to watchlist', '已加入收藏') : v3T('Removed from watchlist', '已移出收藏'));
        paint();
      };
    });
    root.querySelectorAll('[data-v3-share]').forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute('data-v3-share');
        try {
          var url = global.location.href.split('#')[0] + '#/marketplace/asset/' + encodeURIComponent(id);
          if (global.navigator.clipboard) global.navigator.clipboard.writeText(url);
          showToast(v3T('Link copied', '連結已複製'));
        } catch (e) { showToast(v3T('Share link ready', '分享連結就緒')); }
      };
    });
    root.querySelectorAll('[data-v3-back]').forEach(function (btn) { btn.onclick = function () { go('/marketplace'); }; });
    root.querySelectorAll('[data-v3-back-market]').forEach(function (btn) { btn.onclick = function () { go('/marketplace'); }; });
    root.querySelectorAll('[data-v3-list-submit]').forEach(function (btn) {
      btn.onclick = function () { syncListFormFromDom(root); submitListForm(); };
    });
    root.querySelectorAll('[data-v3-list]').forEach(function (el) {
      function syncList() {
        syncListFormFromDom(root);
        if (el.getAttribute('data-v3-list') === 'hasPhysicalSpecimen') paint();
      }
      el.onchange = syncList;
      if (el.tagName !== 'SELECT') el.oninput = function () { syncListFormFromDom(root); };
    });
    root.querySelectorAll('[data-v3-list-pay]').forEach(function (el) {
      el.onchange = function () {
        syncListFormPaymentFromDom(root);
        var selected = normalizePaymentMethods(state.listForm.paymentMethods);
        if (!selected.length) {
          el.checked = true;
          syncListFormPaymentFromDom(root);
          showToast(v3T('Select at least one payment method', '至少選擇一種付款方式'));
        }
      };
    });
    root.querySelectorAll('[data-v3-detail-tab]').forEach(function (btn) {
      btn.onclick = function () {
        state.detailTab = btn.getAttribute('data-v3-detail-tab');
        if (state.detailTab !== 'passport') state.passportFace = 'front';
        paint();
      };
    });
    root.querySelectorAll('[data-v3-coll-tab]').forEach(function (btn) {
      btn.onclick = function () { state.collectionTab = btn.getAttribute('data-v3-coll-tab'); paint(); };
    });
    root.querySelectorAll('[data-v3-passport]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        state.passportFace = btn.getAttribute('data-v3-passport') || 'front';
        paint();
      };
    });
    root.querySelectorAll('[data-v3-passport-flip]').forEach(function (el) {
      el.onclick = function (e) {
        if (e.target.closest('[data-v3-passport]')) return;
        state.passportFace = state.passportFace === 'back' ? 'front' : 'back';
        paint();
      };
      el.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.passportFace = state.passportFace === 'back' ? 'front' : 'back';
          paint();
        }
      };
    });
    root.querySelectorAll('[data-v3-go-about]').forEach(function (btn) {
      btn.onclick = function () {
        state.sidebarNav = 'about';
        go('/marketplace/about');
      };
    });
    root.querySelectorAll('[data-v3-go-market]').forEach(function (btn) {
      btn.onclick = function () {
        state.sidebarNav = '';
        go('/marketplace');
      };
    });
    root.querySelectorAll('[data-v3-scroll]').forEach(function (btn) {
      btn.onclick = function () {
        var target = btn.getAttribute('data-v3-scroll');
        if (target === 'about') {
          state.sidebarNav = 'about';
          go('/marketplace/about');
          return;
        }
        var id = target === 'about' ? 'mc-sat-v3-about' : 'mc-sat-v3-grid';
        var t = document.getElementById(id);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    });
    root.querySelectorAll('[data-v3-filter-open],[data-v3-filter-close]').forEach(function (btn) {
      btn.onclick = function () { state.filterOpen = btn.hasAttribute('data-v3-filter-open'); paint(); };
    });
    root.querySelectorAll('[data-v3-catalog-view]').forEach(function (btn) {
      btn.onclick = function () {
        state.catalogView = btn.getAttribute('data-v3-catalog-view') || 'grid';
        paint();
      };
    });
    root.querySelectorAll('.mc-sat-v3-asset-row').forEach(function (row) {
      row.onclick = function (e) {
        if (e.target.closest('button,a')) return;
        var id = row.getAttribute('data-v3-card');
        if (id) openDetail(id);
      };
      row.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var id = row.getAttribute('data-v3-card');
          if (id) openDetail(id);
        }
      };
    });
    root.querySelectorAll('[data-v3-clear-search]').forEach(function (btn) {
      btn.onclick = function () { state.q = ''; state.visible = PAGE_SIZE; paint(); };
    });
    root.querySelectorAll('[data-v3-search-suggest]').forEach(function (btn) {
      btn.onclick = function () {
        state.q = btn.getAttribute('data-v3-search-suggest') || '';
        state.visible = PAGE_SIZE;
        paint();
        scrollToSection('mc-sat-v3-grid');
      };
    });
    root.querySelectorAll('[data-v3-clear-filters]').forEach(function (btn) {
      btn.onclick = function () {
        state.filters = { category: '', verification: '', completeness: '', license: '', researchLinked: false, hasPassport: false, hasQr: false, hasPhysicalSpecimen: false, priceMin: '', priceMax: '' };
        state.q = ''; state.tab = 'all'; state.sort = 'recently-listed'; state.sidebarNav = 'catalog'; state.visible = PAGE_SIZE; paint();
      };
    });
    root.querySelectorAll('[data-v3-more]').forEach(function (btn) { btn.onclick = function () { state.visible += LOAD_STEP; paint(); }; });
    var search = root.querySelector('[data-v3-search]');
    if (search) {
      search.oninput = function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () { state.q = search.value; state.visible = PAGE_SIZE; paint(); });
      };
    }
    root.querySelectorAll('[data-v3-filter]').forEach(function (el) {
      el.onchange = function () {
        var k = el.getAttribute('data-v3-filter');
        if (k === 'sort') state.sort = el.value;
        else if (el.type === 'checkbox') {
          state.filters[k] = el.checked;
          if (k === 'hasPhysicalSpecimen') state.sidebarNav = el.checked ? 'physical' : (state.sidebarNav === 'physical' ? 'catalog' : state.sidebarNav);
        }
        else state.filters[k] = el.value;
        state.visible = PAGE_SIZE;
        paint();
      };
    });
    var pmin = root.querySelector('[data-v3-price-min]');
    var pmax = root.querySelector('[data-v3-price-max]');
    if (pmin) pmin.onchange = function () { state.filters.priceMin = pmin.value; state.visible = PAGE_SIZE; paint(); };
    if (pmax) pmax.onchange = function () { state.filters.priceMax = pmax.value; state.visible = PAGE_SIZE; paint(); };
    bindImages(root);
    initSatFaqUi(root);
  }

  function paint() {
    bindLangWatch();
    ensureStyles();
    setIsolation(true);
    if (state.catalogView === 'passport') state.catalogView = 'grid';
    state.route = parseRoute();
    var root = ensureRoot();
    root.innerHTML = renderHtml() + checkoutOverlayHtml();
    if (state.toast) syncToast();
    wire(root);
    syncRailExpandedDom();
    if (state.pendingAboutAnchor) {
      scrollToSection('mc-sat-about-' + state.pendingAboutAnchor);
      state.pendingAboutAnchor = '';
    }
  }

  function render() {
    state.route = parseRoute();
    if (state.route.view === 'collection') {
      if (state._lastCollSlug !== state.route.collectionSlug) {
        state.collectionTab = 'assets';
        state._lastCollSlug = state.route.collectionSlug;
      }
    } else {
      state._lastCollSlug = '';
    }
    if (state.route.view === 'asset' && state.route.assetId && !findAsset(state.route.assetId)) {
      go('/marketplace');
      return;
    }
    paint();
  }

  function openDetail(id) {
    state.route = { view: 'asset', assetId: String(id || ''), collectionSlug: '' };
    state.detailTab = 'overview';
    state.passportFace = 'front';
    paint();
  }

  function hide() {
    setIsolation(false);
    var root = document.getElementById(ROOT_ID);
    if (root) { root.style.display = 'none'; root.innerHTML = ''; }
    state.filterOpen = false;
    state.sidebarOpen = false;
  }

  global.addEventListener('mc:localechange', function () {
    var root = global.document.getElementById(ROOT_ID);
    if (root && root.style.display !== 'none' && root.innerHTML) render();
  });

  global.McSatV3Marketplace = { render: render, openDetail: openDetail, hide: hide, assets: ASSETS, collections: COLLECTIONS };
})(typeof window !== 'undefined' ? window : this);
