/**
 * Published public SAT marketplace catalog (demo).
 * Only assets with isPublished === true appear on the public marketplace.
 */
(function (global) {
  'use strict';

  global.__MCSAT_runtimePublishedAssets = global.__MCSAT_runtimePublishedAssets || [];

  var SPEC_THUMB_BASE = '../assets/images/Specimen/thumbs/';
  var SPEC_DETAIL_BASE = '../assets/images/Specimen/detail/';
  var IMG = global.MCSAT_DEMO_IMAGE_REGISTRY || {
    scarab: SPEC_THUMB_BASE + 'insect.svg',
    butterfly: SPEC_THUMB_BASE + 'insect.svg',
    lucanid: SPEC_THUMB_BASE + 'insect.svg',
    beetle2: SPEC_THUMB_BASE + 'marine.svg',
    ant: SPEC_THUMB_BASE + 'insect.svg',
    fossil: SPEC_THUMB_BASE + 'fossil.svg',
    plant: SPEC_THUMB_BASE + 'plant.svg',
  };

  /** Lightweight SVG previews (grid uses thumbs only; detail uses larger SVG path). */
  function specimenImageStem_(a) {
    var c = String(a.category || '');
    if (c === 'Fossil') return 'fossil';
    if (c === 'Plant') return 'plant';
    if (c === 'Marine') return 'marine';
    if (c === 'Insect') return 'insect';
    return 'neutral';
  }

  function applySpecimenImageUrls_(a) {
    var stem = specimenImageStem_(a);
    a.thumbnailUrl = SPEC_THUMB_BASE + stem + '.svg';
    a.imageUrl = SPEC_DETAIL_BASE + stem + '.svg';
    a.originalImageUrl = a.imageUrl;
    if (!a.coverImage) a.coverImage = a.thumbnailUrl;
    a.imageMeta = {
      mode: 'specimen-svg-demo',
      thumbTarget: SPEC_THUMB_BASE + stem + '.svg',
      detailTarget: SPEC_DETAIL_BASE + stem + '.svg',
    };
  }

  function hasHeroPassport_(a) {
    if (!a || !a.scientificName) return false;
    if (typeof global.MC_SAT_findHeroPhoto !== 'function') return false;
    return !!global.MC_SAT_findHeroPhoto(a.scientificName);
  }

  function applyHeroPassportImage_(a) {
    if (!a || !a.scientificName) return false;
    if (typeof global.MC_SAT_findHeroPhoto !== 'function') return false;
    var url = global.MC_SAT_findHeroPhoto(a.scientificName);
    if (!url) return false;
    a.thumbnailUrl = url;
    a.imageUrl = url;
    a.originalImageUrl = url;
    a.coverImage = url;
    a.imageMeta = { mode: 'hero-passport', rel: url };
    return true;
  }

  function mkPaleontologyAsset(entry) {
    return {
      id: entry.id,
      title: entry.title,
      scientificName: entry.sci,
      commonName: entry.common,
      category: 'Fossil',
      assetType: entry.assetType || 'Specimen Image',
      origin: entry.origin || 'Museum research collection',
      collection: 'Fossil Reference Plates',
      verificationStatus: entry.verification || 'Verified',
      licenseType: entry.license || 'Educational use',
      price: entry.price != null ? entry.price : 1200,
      currency: 'USD',
      availability: entry.inquiry ? 'Inquiry only' : 'Listed',
      description: entry.description || 'Paleontology teaching plate with passport metadata and stratigraphic notes.',
      provenance: [{ date: entry.date || '2020', event: 'Paleontology plate digitization.' }],
      metadata: { family: '—', genus: String(entry.sci || '').split(' ')[0], species: entry.sci },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-29',
      scientificGrade: 'Grade A',
      rarity: entry.rarity || 'Teaching',
      hasPhysicalSpecimen: !!entry.physical,
    };
  }

  function mkBotanicalAsset(entry) {
    return {
      id: entry.id,
      title: entry.title,
      scientificName: entry.sci,
      commonName: entry.common,
      category: 'Plant',
      assetType: 'Specimen Image',
      origin: entry.origin || 'Taiwan',
      collection: 'Botanical Scans',
      verificationStatus: 'Verified',
      licenseType: entry.license || 'Educational use',
      price: entry.price != null ? entry.price : 480,
      currency: 'USD',
      availability: 'Listed',
      description: entry.description || 'Herbarium-style teaching voucher with passport metadata.',
      provenance: [{ date: entry.date || '2023', event: 'Herbarium voucher digitization.' }],
      metadata: { family: '—', genus: String(entry.sci || '').split(' ')[0], species: entry.sci },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-29',
      scientificGrade: 'Grade A',
      rarity: 'Teaching',
      hasPhysicalSpecimen: true,
    };
  }

  /** @type {MCSatAsset[]} */
  var MCSAT_ASSET_CATALOG = [
    {
      id: 'SAT-000001',
      title: 'Plusiotis chrysargirea specimen image',
      scientificName: 'Plusiotis chrysargirea',
      commonName: 'Golden scarab beetle',
      category: 'Insect',
      assetType: 'Specimen Image',
      origin: 'Costa Rica',
      collection: 'Beetle Archive',
      verificationStatus: 'Verified',
      licenseType: 'Educational use',
      price: 38,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.scarab,
      thumbnailUrl: IMG.scarab,
      description:
        'High-resolution dorsal habitus for teaching, exhibition backdrops, and licensed publications. Metadata includes locality and catalog cross-links.',
      provenance: [
        { date: '2021', event: 'Field collection and photography (permit-compliant demo).' },
        { date: '2024', event: 'Cataloged into private specimen archive with SAT metadata.' },
      ],
      metadata: { family: 'Scarabaeidae', genus: 'Plusiotis', species: 'chrysargirea', size: '32 mm', sex: 'Unknown', condition: 'Excellent' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-29',
      scientificGrade: 'Grade A',
      rarity: 'Reference',
    },
    {
      id: 'SAT-000002',
      title: 'Lamproptera meges research plate',
      scientificName: 'Lamproptera meges',
      commonName: 'Green dragontail',
      category: 'Insect',
      assetType: 'Research Data',
      origin: 'Philippines',
      collection: 'Beetle Archive',
      verificationStatus: 'Verified',
      licenseType: 'Research citation',
      price: 24,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.butterfly,
      thumbnailUrl: IMG.butterfly,
      description: 'Wing venation reference stack for morphology studies.',
      provenance: [{ date: '2023', event: 'Digitized for institutional exchange demo.' }],
      metadata: { family: 'Papilionidae', genus: 'Lamproptera', species: 'meges' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-20',
      scientificGrade: 'Grade B',
      rarity: 'Common reference',
    },
    {
      id: 'SAT-000003',
      title: 'Lucanidae sp. collection edition',
      scientificName: 'Lucanidae sp.',
      commonName: 'Stag beetle (unspecified)',
      category: 'Insect',
      assetType: 'Collection Edition',
      origin: 'Taiwan',
      collection: 'Beetle Archive',
      verificationStatus: 'Museum Archive',
      licenseType: 'Personal viewing',
      price: 55,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.lucanid,
      thumbnailUrl: IMG.lucanid,
      description: 'Curated scan package with alternate crops for collection display.',
      provenance: [{ date: '2022', event: 'Accessioned to demo collection.' }],
      metadata: { family: 'Lucanidae', genus: 'Lucanidae', species: 'sp.' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-03-15',
      scientificGrade: 'Grade B',
      rarity: 'Collector',
    },
    {
      id: 'SAT-000004',
      title: 'Trilobite reference plate (demo)',
      scientificName: 'Trilobita spp.',
      commonName: 'Trilobite fossil plate',
      category: 'Fossil',
      assetType: 'Specimen Image',
      origin: 'Morocco',
      collection: 'Fossil Reference Plates',
      verificationStatus: 'Verified',
      licenseType: 'Commercial license',
      price: 0,
      currency: 'USD',
      availability: 'Inquiry only',
      imageUrl: IMG.fossil,
      thumbnailUrl: IMG.fossil,
      description: 'Museum-grade slab documentation for comparative paleontology.',
      provenance: [{ date: '2025', event: 'Imaging for SAT reference catalog.' }],
      metadata: { family: '—', genus: '—', species: '—' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-01',
      scientificGrade: 'Grade A',
      rarity: 'Reference',
    },
    {
      id: 'SAT-000005',
      title: 'Botanical herbarium scan set',
      scientificName: 'Ficus elastica',
      commonName: 'Rubber plant',
      category: 'Plant',
      assetType: 'Research Data',
      origin: 'Taiwan',
      collection: 'Botanical Scans',
      verificationStatus: 'Pending',
      licenseType: 'Educational use',
      price: 12,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.plant,
      thumbnailUrl: IMG.plant,
      description: 'Flattened leaf and venation dataset for teaching labs.',
      provenance: [{ date: '2026-01', event: 'Community submitted — review in progress.' }],
      metadata: { family: 'Moraceae', genus: 'Ficus', species: 'elastica' },
      ownerId: 'community-1',
      isPublished: true,
      updatedAt: '2026-04-28',
      scientificGrade: 'Grade C',
      rarity: 'Teaching',
    },
    {
      id: 'SAT-000006',
      title: 'Marine specimen cross-section',
      scientificName: 'Turbo marmoratus',
      commonName: 'Green turban snail',
      category: 'Marine',
      assetType: 'Specimen Image',
      origin: 'Okinawa',
      collection: 'Marine Specimen Library',
      verificationStatus: 'Verified',
      licenseType: 'Research citation',
      price: 42,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.beetle2,
      thumbnailUrl: IMG.beetle2,
      description: 'Shell morphology imaging for malacology coursework.',
      provenance: [{ date: '2024', event: 'Imaged at marine teaching collection.' }],
      metadata: { family: 'Turbinidae', genus: 'Turbo', species: 'marmoratus' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-02-10',
      scientificGrade: 'Grade B',
      rarity: 'Reference',
    },
    {
      id: 'SAT-000007',
      title: 'Educational license pack — insects',
      scientificName: 'Various Insecta',
      commonName: 'Insect teaching pack',
      category: 'Insect',
      assetType: 'Education Material',
      origin: 'Global',
      collection: 'Educational License Pack',
      verificationStatus: 'Verified',
      licenseType: 'Educational use',
      price: 0,
      currency: 'USD',
      availability: 'Free display',
      imageUrl: IMG.ant,
      thumbnailUrl: IMG.ant,
      description: 'Curated thumbnails and captions for non-commercial classroom use.',
      provenance: [{ date: '2025', event: 'Released under educational SAT bundle.' }],
      metadata: { family: '—', genus: '—', species: '—' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2025-12-01',
      scientificGrade: 'Grade C',
      rarity: 'Bundle',
    },
    {
      id: 'SAT-000008',
      title: 'Mineral thin-section (demo)',
      scientificName: 'Quartz aggregate',
      commonName: 'Quartz hand sample',
      category: 'Mineral',
      assetType: 'Research Data',
      origin: 'Norway',
      collection: 'Fossil Reference Plates',
      verificationStatus: 'Community Submitted',
      licenseType: 'Personal viewing',
      price: 15,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.fossil,
      thumbnailUrl: IMG.fossil,
      description: 'Polarized light micrograph set for introductory mineralogy.',
      provenance: [{ date: '2026-03', event: 'Submitted by student curator demo account.' }],
      metadata: { family: '—', genus: '—', species: '—' },
      ownerId: 'community-2',
      isPublished: true,
      updatedAt: '2026-04-10',
      scientificGrade: 'Grade C',
      rarity: 'Teaching',
    },
    {
      id: 'SAT-000009',
      title: 'Mammal skull orthographic',
      scientificName: 'Vulpes vulpes',
      commonName: 'Red fox',
      category: 'Mammal',
      assetType: 'Specimen Image',
      origin: 'United Kingdom',
      collection: 'Marine Specimen Library',
      verificationStatus: 'Verified',
      licenseType: 'Commercial license',
      price: 120,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.scarab,
      thumbnailUrl: IMG.scarab,
      description: 'Orthographic views for veterinary anatomy references (demo).',
      provenance: [{ date: '2020', event: 'Museum teaching loan imaging.' }],
      metadata: { family: 'Canidae', genus: 'Vulpes', species: 'vulpes' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-01-22',
      scientificGrade: 'Grade A',
      rarity: 'Premium',
    },
    {
      id: 'SAT-000010',
      title: 'Passerine study skin (demo)',
      scientificName: 'Passer domesticus',
      commonName: 'House sparrow',
      category: 'Bird',
      assetType: 'Usage License',
      origin: 'Taiwan',
      collection: 'Educational License Pack',
      verificationStatus: 'Pending',
      licenseType: 'Educational use',
      price: 0,
      currency: 'USD',
      availability: 'Inquiry only',
      imageUrl: IMG.butterfly,
      thumbnailUrl: IMG.butterfly,
      description: 'Study skin documentation for ornithology labs — inquiry for terms.',
      provenance: [{ date: '2026-04', event: 'Pending verification.' }],
      metadata: { family: 'Passeridae', genus: 'Passer', species: 'domesticus' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-29',
      scientificGrade: 'Grade B',
      rarity: 'Reference',
    },
    {
      id: 'SAT-000011',
      title: 'Unlisted internal asset (hidden)',
      scientificName: 'Hidden sp.',
      commonName: 'Hidden',
      category: 'Other',
      assetType: 'Research Data',
      origin: '—',
      collection: 'Beetle Archive',
      verificationStatus: 'Draft',
      licenseType: 'Personal viewing',
      price: 0,
      currency: 'USD',
      availability: 'Sold / Archived',
      imageUrl: IMG.plant,
      thumbnailUrl: IMG.plant,
      description: 'Should not appear on public marketplace.',
      provenance: [],
      metadata: {},
      ownerId: 'demo-owner',
      isPublished: false,
      updatedAt: '2026-01-01',
      scientificGrade: '—',
      rarity: '—',
    },
    {
      id: 'SAT-000012',
      title: 'Shell usage license',
      scientificName: 'Conus spp.',
      commonName: 'Cone snail (representative)',
      category: 'Marine',
      assetType: 'Usage License',
      origin: 'Japan',
      collection: 'Marine Specimen Library',
      verificationStatus: 'Verified',
      licenseType: 'Commercial license',
      price: 90,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.lucanid,
      thumbnailUrl: IMG.lucanid,
      description: 'Single-project editorial license for print and digital.',
      provenance: [{ date: '2025', event: 'Rights cleared for SAT demo.' }],
      metadata: { family: 'Conidae', genus: 'Conus', species: 'spp.' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-05',
      scientificGrade: 'Grade A',
      rarity: 'Commercial',
    },
    {
      id: 'SAT-000013',
      title: 'Fossil microfossil slide',
      scientificName: 'Foraminifera indet.',
      commonName: 'Microfossil assemblage',
      category: 'Fossil',
      assetType: 'Collection Edition',
      origin: 'North Sea',
      collection: 'Fossil Reference Plates',
      verificationStatus: 'Museum Archive',
      licenseType: 'Research citation',
      price: 200,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.fossil,
      thumbnailUrl: IMG.fossil,
      description: 'High-magnification composite for micropaleontology.',
      provenance: [{ date: '2018', event: 'Museum slide digitization.' }],
      metadata: { family: '—', genus: '—', species: 'indet.' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-03-30',
      scientificGrade: 'Grade A',
      rarity: 'Archive',
    },
    {
      id: 'SAT-000014',
      title: 'Herbarium voucher — fern',
      scientificName: 'Cyathea sp.',
      commonName: 'Tree fern',
      category: 'Plant',
      assetType: 'Specimen Image',
      origin: 'Taiwan',
      collection: 'Botanical Scans',
      verificationStatus: 'Verified',
      licenseType: 'Educational use',
      price: 22,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.plant,
      thumbnailUrl: IMG.plant,
      description: 'Frond architecture for field botany comparisons.',
      provenance: [{ date: '2024', event: 'Voucher imaging at university herbarium.' }],
      metadata: { family: 'Cyatheaceae', genus: 'Cyathea', species: 'sp.' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-12',
      scientificGrade: 'Grade B',
      rarity: 'Reference',
    },
    {
      id: 'SAT-000015',
      title: 'Mixed teaching stills',
      scientificName: 'Various',
      commonName: 'Mixed taxa pack',
      category: 'Other',
      assetType: 'Education Material',
      origin: 'Various',
      collection: 'Educational License Pack',
      verificationStatus: 'Verified',
      licenseType: 'Educational use',
      price: 8,
      currency: 'USD',
      availability: 'Listed',
      imageUrl: IMG.ant,
      thumbnailUrl: IMG.ant,
      description: 'Low-res bundle for introductory biodiversity slides.',
      provenance: [{ date: '2025', event: 'Compiled for SAT education track.' }],
      metadata: {},
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2025-11-11',
      scientificGrade: 'Grade C',
      rarity: 'Bundle',
    },
    {
      id: 'SAT-000016',
      title: 'Deep-sea jar specimen (inquiry)',
      scientificName: 'Macrouridae gen. sp.',
      commonName: 'Rattail fish',
      category: 'Marine',
      assetType: 'Research Data',
      origin: 'Pacific',
      collection: 'Marine Specimen Library',
      verificationStatus: 'Pending',
      licenseType: 'Research citation',
      price: 0,
      currency: 'USD',
      availability: 'Inquiry only',
      imageUrl: IMG.beetle2,
      thumbnailUrl: IMG.beetle2,
      description: 'Institutional inquiry only — chain of custody documentation on request.',
      provenance: [{ date: '2026-04', event: 'Metadata embargo (demo).' }],
      metadata: { family: 'Macrouridae', genus: '—', species: 'sp.' },
      ownerId: 'demo-owner',
      isPublished: true,
      updatedAt: '2026-04-29',
      scientificGrade: 'Grade B',
      rarity: 'Sensitive',
    },
    mkBotanicalAsset({ id: 'SAT-B64101', title: 'Maidenhair fern herbarium voucher', sci: 'Adiantum capillus-veneris', common: 'Maidenhair fern', price: 540, date: '2023/04/18' }),
    mkBotanicalAsset({ id: 'SAT-B64102', title: 'Sundew carnivorous plant plate', sci: 'Drosera spp.', common: 'Sundew', price: 720, date: '2022/07/11' }),
    mkBotanicalAsset({ id: 'SAT-B64103', title: 'Ginkgo teaching voucher', sci: 'Ginkgo biloba', common: 'Ginkgo', price: 480, date: '2021/10/05' }),
    mkBotanicalAsset({ id: 'SAT-B64104', title: 'Golden rain tree teaching plate', sci: 'Koelreuteria elegans', common: 'Golden rain tree', price: 620, date: '2023/06/22' }),
    mkBotanicalAsset({ id: 'SAT-B64105', title: 'Sensitive plant teaching voucher', sci: 'Mimosa pudica', common: 'Sensitive plant', price: 390, date: '2020/03/14' }),
    mkBotanicalAsset({ id: 'SAT-B64106', title: 'Sacred lotus morphology set', sci: 'Nelumbo nucifera', common: 'Sacred lotus', price: 850, date: '2022/08/30' }),
    mkBotanicalAsset({ id: 'SAT-B64107', title: 'Pitcher plant reference voucher', sci: 'Nepenthes spp.', common: 'Pitcher plant', price: 980, date: '2019/05/18' }),
    mkBotanicalAsset({ id: 'SAT-B64108', title: 'Sword fern classroom voucher', sci: 'Nephrolepis cordifolia', common: 'Sword fern', price: 410, date: '2023/11/08' }),
    mkBotanicalAsset({ id: 'SAT-B64109', title: 'Pine sapling herbarium voucher', sci: 'Pinus spp.', common: 'Pine', price: 560, date: '2024/02/16' }),
    mkBotanicalAsset({ id: 'SAT-B64110', title: 'Staghorn fern living collection plate', sci: 'Platycerium spp.', common: 'Staghorn fern', price: 1100, date: '2023/09/04', license: 'Collector edition' }),
    mkPaleontologyAsset({ id: 'SAT-B64201', title: 'Feathered tyrannosaur restoration plate', sci: 'Yutyrannus huali', common: 'Feathered tyrannosaur', price: 3200, date: '2025/03/21' }),
    mkPaleontologyAsset({ id: 'SAT-B64202', title: 'Stegosaurus stenops teaching plate', sci: 'Stegosaurus stenops', common: 'Stegosaurus', price: 2800, date: '2025/03/21' }),
    mkPaleontologyAsset({ id: 'SAT-B64203', title: 'Tarbosaurus bataar reference plate', sci: 'Tarbosaurus bataar', common: 'Tarbosaurus', price: 3500, date: '2025/03/20' }),
    mkPaleontologyAsset({ id: 'SAT-B64204', title: 'Zhenyuanlong feathered dromaeosaur plate', sci: 'Zhenyuanlong suni', common: 'Zhenyuanlong', price: 2100, date: '2025/03/20' }),
    mkPaleontologyAsset({ id: 'SAT-B64205', title: 'Zuniceratops ceratopsian teaching set', sci: 'Zuniceratops christopheri', common: 'Zuniceratops', price: 2400, date: '2025/03/19' }),
    mkPaleontologyAsset({ id: 'SAT-B64206', title: 'Trilobite reference teaching plate', sci: 'Trilobita spp.', common: 'Trilobite', price: 980, date: '2025/03/17', physical: true }),
    mkPaleontologyAsset({ id: 'SAT-B64207', title: 'Asaphus kowalewskii museum plate', sci: 'Asaphus kowalewskii', common: 'Asaphus trilobite', price: 1450, date: '2025/03/17', physical: true }),
    mkPaleontologyAsset({ id: 'SAT-B64208', title: 'Ammonite spiral teaching plate', sci: 'Ammonoidea spp.', common: 'Ammonite', price: 860, date: '2025/03/16' }),
    mkPaleontologyAsset({ id: 'SAT-B64209', title: 'Nipponites mirabilis heteromorph ammonite', sci: 'Nipponites mirabilis', common: 'Nipponites ammonite', price: 1750, date: '2025/03/15' }),
    mkPaleontologyAsset({ id: 'SAT-B64210', title: 'Beelzebufo paleo amphibian plate', sci: 'Beelzebufo ampinga', common: 'Devil frog', price: 1320, date: '2025/03/16' }),
  ];

  var MCSAT_COLLECTIONS = [
    {
      slug: 'beetle-archive',
      title: 'Beetle Archive',
      itemCount: 0,
      verified: true,
      description: 'Curated coleoptera imagery and licensing tiers.',
      coverUrl: IMG.scarab,
      filterCollection: 'Beetle Archive',
    },
    {
      slug: 'fossil-reference-plates',
      title: 'Fossil Reference Plates',
      itemCount: 0,
      verified: true,
      description: 'Paleontology plates and microfossil documentation.',
      coverUrl: IMG.fossil,
      filterCollection: 'Fossil Reference Plates',
    },
    {
      slug: 'botanical-scans',
      title: 'Botanical Scans',
      itemCount: 0,
      verified: true,
      description: 'Herbarium-style scans for teaching and research.',
      coverUrl: IMG.plant,
      filterCollection: 'Botanical Scans',
    },
    {
      slug: 'marine-specimen-library',
      title: 'Marine Specimen Library',
      itemCount: 0,
      verified: true,
      description: 'Shells, jars, and marine morphology references.',
      coverUrl: IMG.beetle2,
      filterCollection: 'Marine Specimen Library',
    },
    {
      slug: 'educational-license-pack',
      title: 'Educational License Pack',
      itemCount: 0,
      verified: true,
      description: 'Classroom-safe bundles and captions.',
      coverUrl: IMG.ant,
      filterCollection: 'Educational License Pack',
    },
  ];

  MCSAT_ASSET_CATALOG.forEach(function (a) {
    if (!applyHeroPassportImage_(a)) applySpecimenImageUrls_(a);
  });

  MCSAT_COLLECTIONS.forEach(function (c) {
    var stem = 'neutral';
    var fc = String(c.filterCollection || '');
    if (fc.indexOf('Beetle') >= 0) stem = 'insect';
    else if (fc.indexOf('Fossil') >= 0) stem = 'fossil';
    else if (fc.indexOf('Botanical') >= 0) stem = 'plant';
    else if (fc.indexOf('Marine') >= 0) stem = 'marine';
    else if (fc.indexOf('Educational') >= 0) stem = 'insect';
    c.coverUrl = SPEC_THUMB_BASE + stem + '.svg';
  });

  function publishedBase() {
    return MCSAT_ASSET_CATALOG.filter(function (a) {
      return a.isPublished === true;
    });
  }

  /** Base catalog + runtime publishes; runtime wins on same `id`. */
  function publishedMergedList() {
    var map = {};
    publishedBase().forEach(function (a) {
      if (a && a.id) map[String(a.id)] = a;
    });
    (global.__MCSAT_runtimePublishedAssets || []).forEach(function (a) {
      if (a && a.id && a.isPublished) map[String(a.id)] = a;
    });
    return Object.keys(map).map(function (k) {
      return map[k];
    });
  }

  function refreshCollectionCounts() {
    var pub = publishedMergedList().filter(hasHeroPassport_);
    MCSAT_COLLECTIONS.forEach(function (c) {
      c.itemCount = pub.filter(function (a) {
        return a.collection === c.filterCollection;
      }).length;
      var first = pub.filter(function (a) {
        return a.collection === c.filterCollection;
      })[0];
      if (first && typeof global.MC_SAT_findHeroPhoto === 'function') {
        var cover = global.MC_SAT_findHeroPhoto(first.scientificName);
        if (cover) c.coverUrl = cover;
      }
    });
  }

  refreshCollectionCounts();

  global.MCSAT_getAssetCatalog = function () {
    return MCSAT_ASSET_CATALOG.slice();
  };

  global.MCSAT_getPublishedAssets = function () {
    refreshCollectionCounts();
    return publishedMergedList()
      .filter(hasHeroPassport_)
      .map(function (a) {
        var o = Object.assign({}, a);
        applyHeroPassportImage_(o);
        return o;
      });
  };

  global.MCSAT_getCollections = function () {
    refreshCollectionCounts();
    return MCSAT_COLLECTIONS.map(function (c) {
      var o = Object.assign({}, c);
      if (o.filterCollection === 'Botanical Scans' && typeof global.MC_SAT_findHeroPhoto === 'function') {
        var botCover = global.MC_SAT_findHeroPhoto('Ginkgo biloba');
        if (botCover) o.coverUrl = botCover;
      }
      return o;
    });
  };

  global.MCSAT_findAssetById = function (id) {
    var want = String(id || '');
    var list = global.MCSAT_getPublishedAssets();
    for (var i = 0; i < list.length; i++) {
      if (list[i] && String(list[i].id) === want) return list[i];
    }
    return null;
  };
})(typeof window !== 'undefined' ? window : this);
