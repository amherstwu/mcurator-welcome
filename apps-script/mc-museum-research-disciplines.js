/**
 * MCurator — Museum Collection: 12 academic research disciplines + cover asset mapping.
 * Loaded after mc-asset-resolver.js (uses mcResolveLocalRelToPage_).
 * Project-relative paths only (no absolute Windows paths).
 */
(function (global) {
  'use strict';

  var RD_BASE = 'assets/Research%20Disciplines/';

  /**
   * Canonical discipline hero images (博物館典藏分類圖) under RD_BASE — filenames match shipped assets.
   * Listed before cover-{id}.jpg so the UI prefers these PNGs when present.
   */
  var FILENAME_ALIASES = {
    botany: ['Botany.png', 'linnaeus.jpg', 'theophrastus.jpg', 'plants.jpg', 'botany.jpg'],
    entomology: ['Entomology.png', 'fabre.jpg', 'insect.jpg', 'entomology.jpg', 'beetle.jpg'],
    'invertebrate-zoology': [
      'Invertebrate Zoology.png',
      'Invertebrate%20Zoology.png',
      'haeckel.jpg',
      'marine-invertebrate.jpg',
      'invertebrate.jpg',
      'mollusk.jpg'
    ],
    'vertebrate-zoology': [
      'Vertebrate Zoology.png',
      'Vertebrate%20Zoology.png',
      'cuvier.jpg',
      'vertebrate.jpg',
      'anatomy.jpg',
      'bird.jpg'
    ],
    /* Shipped files use two spaces between words (not &). */
    'paleontology-fossils': [
      'Paleontology  Fossils.png',
      'Paleontology%20%20Fossils.png',
      'anning.jpg',
      'fossil.jpg',
      'ammonite.jpg',
      'paleontology.jpg'
    ],
    'mineralogy-geology': ['Mineralogy.png', 'mineral.jpg', 'crystal.jpg', 'hauy.jpg', 'geology.jpg'],
    microbiology: ['Microbiology.png', 'leeuwenhoek.jpg', 'microscope.jpg', 'microbiology.jpg', 'pasteur.jpg'],
    virology: ['Virology.png', 'twort.jpg', 'virus.jpg', 'bacteriophage.jpg', 'virology.jpg'],
    'taxonomy-systematics': [
      'Taxonomy  Systematics.png',
      'Taxonomy%20%20Systematics.png',
      'linnaeus-taxonomy.jpg',
      'hennig.jpg',
      'taxonomy.jpg',
      'systematics.jpg'
    ],
    'evolutionary-biology': [
      'Evolutionary Biology.png',
      'Evolutionary%20Biology.png',
      'darwin.jpg',
      'galapagos.jpg',
      'evolution.jpg',
      'wallace.jpg'
    ],
    ecology: ['Ecology.png', 'humboldt.jpg', 'mountain.jpg', 'ecology.jpg', 'fieldwork.jpg'],
    genetics: ['Genetics.png', 'mendel.jpg', 'pea.jpg', 'genetics.jpg', 'dna.jpg']
  };

  var LEGACY_SLUG_MAP = {
    invertebrate: 'invertebrate-zoology',
    vertebrate: 'vertebrate-zoology',
    paleo: 'paleontology-fossils',
    mineral: 'mineralogy-geology'
  };

  var RESEARCH_DISCIPLINES = [
    {
      id: 'botany',
      titleZh: '植物學',
      titleEn: 'Botany',
      heroPersonZh: 'Carl Linnaeus／Theophrastus',
      heroPersonEn: 'Carl Linnaeus / Theophrastus',
      descriptionZh: '維管植物、隱花植物、藻類、種子、果實與植物標本收藏。',
      descriptionEn: 'Plants, herbarium sheets, algae, seeds, fruits, and botanical specimens.',
      tagsZh: ['壓花', '種子', '果實', '蕨類', '藻類'],
      tagsEn: ['Herbarium', 'Seeds', 'Fruits', 'Ferns', 'Algae'],
      subs: [
        { slug: 'herbarium', name: 'Herbarium sheets', nameZh: '壓花標本' },
        { slug: 'bryophytes', name: 'Bryophytes', nameZh: '苔蘚與地錢' },
        { slug: 'algae', name: 'Algae', nameZh: '藻類' },
        { slug: 'seeds', name: 'Seeds / fruits', nameZh: '種子與果實' },
        { slug: 'wood', name: 'Wood / economic botany', nameZh: '木材與經濟植物' }
      ]
    },
    {
      id: 'entomology',
      titleZh: '昆蟲學',
      titleEn: 'Entomology',
      heroPersonZh: 'Jean-Henri Fabre',
      heroPersonEn: 'Jean-Henri Fabre',
      descriptionZh: '昆蟲標本、採集影像、分類紀錄與 SAT 昆蟲收藏。',
      descriptionEn: 'Insect vouchers, field images, taxonomic records, and SAT insect holdings.',
      tagsZh: ['甲蟲', '蝶蛾', '膜翅目', '雙翅目', '標本盒'],
      tagsEn: ['Beetles', 'Butterflies & moths', 'Hymenoptera', 'Diptera', 'Pinning'],
      subs: [
        { slug: 'beetles', name: 'Beetles (Coleoptera)', nameZh: '鞘翅目' },
        { slug: 'lepidoptera', name: 'Lepidoptera', nameZh: '鱗翅目' },
        { slug: 'hymenoptera', name: 'Hymenoptera', nameZh: '膜翅目' },
        { slug: 'diptera', name: 'Diptera', nameZh: '雙翅目' },
        { slug: 'odonata', name: 'Odonata', nameZh: '蜻蜓目' },
        { slug: 'orthoptera', name: 'Orthoptera', nameZh: '直翅目' },
        { slug: 'other_insects', name: 'Other insects', nameZh: '其他昆蟲' }
      ]
    },
    {
      id: 'invertebrate-zoology',
      titleZh: '無脊椎動物學',
      titleEn: 'Invertebrate Zoology',
      heroPersonZh: 'Ernst Haeckel',
      heroPersonEn: 'Ernst Haeckel',
      descriptionZh: '非昆蟲類無脊椎動物收藏，包含軟體動物、珊瑚、甲殼類與海洋標本。',
      descriptionEn: 'Non-insect invertebrates: mollusks, corals, crustaceans, and marine vouchers.',
      tagsZh: ['軟體動物', '珊瑚', '甲殼類', '棘皮動物', '海洋標本'],
      tagsEn: ['Mollusks', 'Corals', 'Crustaceans', 'Echinoderms', 'Marine'],
      subs: [
        { slug: 'mollusks', name: 'Mollusks', nameZh: '軟體動物' },
        { slug: 'crustaceans', name: 'Crustaceans', nameZh: '甲殼類' },
        { slug: 'corals', name: 'Corals / Cnidaria', nameZh: '珊瑚與刺絲胞' },
        { slug: 'echinoderms', name: 'Echinoderms', nameZh: '棘皮動物' },
        { slug: 'worms', name: 'Worms', nameZh: '蠕形動物' },
        { slug: 'sponges', name: 'Sponges', nameZh: '海綿' }
      ]
    },
    {
      id: 'vertebrate-zoology',
      titleZh: '脊椎動物學',
      titleEn: 'Vertebrate Zoology',
      heroPersonZh: 'Georges Cuvier',
      heroPersonEn: 'Georges Cuvier',
      descriptionZh: '哺乳類、鳥類、爬行類、兩生類與魚類標本收藏。',
      descriptionEn: 'Mammals, birds, reptiles, amphibians, and fishes.',
      tagsZh: ['哺乳類', '鳥類', '爬行類', '兩生類', '魚類'],
      tagsEn: ['Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fishes'],
      subs: [
        { slug: 'mammals', name: 'Mammals', nameZh: '哺乳類' },
        { slug: 'birds', name: 'Birds', nameZh: '鳥類' },
        { slug: 'reptiles', name: 'Reptiles', nameZh: '爬行類' },
        { slug: 'amphibians', name: 'Amphibians', nameZh: '兩生類' },
        { slug: 'fishes', name: 'Fishes', nameZh: '魚類' }
      ]
    },
    {
      id: 'paleontology-fossils',
      titleZh: '古生物學・化石',
      titleEn: 'Paleontology & Fossils',
      heroPersonZh: 'Mary Anning／Georges Cuvier',
      heroPersonEn: 'Mary Anning / Georges Cuvier',
      descriptionZh: '化石、古生物、地層紀錄與滅絕生物相關收藏。',
      descriptionEn: 'Fossils, paleontology, stratigraphy, and extinct organisms.',
      tagsZh: ['化石', '菊石', '恐龍', '古植物', '滅絕生物'],
      tagsEn: ['Fossils', 'Ammonites', 'Dinosaurs', 'Paleobotany', 'Extinction'],
      subs: [
        { slug: 'fossil_invert', name: 'Fossil invertebrates', nameZh: '無脊椎化石' },
        { slug: 'fossil_vert', name: 'Fossil vertebrates', nameZh: '脊椎化石' },
        { slug: 'paleobotany', name: 'Paleobotany', nameZh: '古植物' },
        { slug: 'microfossils', name: 'Microfossils', nameZh: '微體化石' },
        { slug: 'trace', name: 'Trace fossils', nameZh: '生痕化石' }
      ]
    },
    {
      id: 'mineralogy-geology',
      titleZh: '礦物學・地質材料',
      titleEn: 'Mineralogy & Geology',
      heroPersonZh: 'René Just Haüy／Georgius Agricola',
      heroPersonEn: 'René Just Haüy / Georgius Agricola',
      descriptionZh: '礦物、晶體、岩石、隕石與地質材料收藏。',
      descriptionEn: 'Minerals, crystals, rocks, meteorites, and geologic materials.',
      tagsZh: ['礦物', '晶體', '岩石', '隕石', '地層'],
      tagsEn: ['Minerals', 'Crystals', 'Rocks', 'Meteorites', 'Stratigraphy'],
      subs: [
        { slug: 'minerals', name: 'Minerals', nameZh: '礦物' },
        { slug: 'gems', name: 'Gems', nameZh: '寶石' },
        { slug: 'meteorites', name: 'Meteorites', nameZh: '隕石' },
        { slug: 'rocks', name: 'Rocks', nameZh: '岩石' },
        { slug: 'sediment', name: 'Sediment samples', nameZh: '沉積物樣本' }
      ]
    },
    {
      id: 'microbiology',
      titleZh: '微生物學',
      titleEn: 'Microbiology',
      heroPersonZh: 'Antonie van Leeuwenhoek／Louis Pasteur',
      heroPersonEn: 'Antonie van Leeuwenhoek / Louis Pasteur',
      descriptionZh: '細菌、古菌、真菌培養物、型株與顯微影像收藏。',
      descriptionEn: 'Bacteria, archaea, fungal cultures, type strains, and microscopy.',
      tagsZh: ['細菌', '古菌', '真菌', '型株', '顯微影像'],
      tagsEn: ['Bacteria', 'Archaea', 'Fungi', 'Type strains', 'Micrographs'],
      subs: [
        { slug: 'bacteria', name: 'Bacteria', nameZh: '細菌' },
        { slug: 'archaea', name: 'Archaea', nameZh: '古菌' },
        { slug: 'type_strains', name: 'Type strains', nameZh: '模式株' },
        { slug: 'environmental', name: 'Environmental vouchers', nameZh: '環境樣本' }
      ]
    },
    {
      id: 'virology',
      titleZh: '病毒學',
      titleEn: 'Virology',
      heroPersonZh: 'Frederick William Twort／Martinus Beijerinck',
      heroPersonEn: 'Frederick William Twort / Martinus Beijerinck',
      descriptionZh: '病毒、噬菌體、病毒分離株、宿主紀錄與感染研究相關收藏。',
      descriptionEn: 'Viruses, phages, isolates, host records, and infection studies.',
      tagsZh: ['病毒', '噬菌體', '分離株', '宿主', '感染紀錄'],
      tagsEn: ['Viruses', 'Phages', 'Isolates', 'Hosts', 'Infection logs'],
      subs: [
        { slug: 'viral_isolates', name: 'Viral isolates', nameZh: '病毒分離株' },
        { slug: 'phage', name: 'Bacteriophage', nameZh: '噬菌體' },
        { slug: 'tissue_culture', name: 'Cell / tissue reference', nameZh: '細胞／組織參考' }
      ]
    },
    {
      id: 'taxonomy-systematics',
      titleZh: '分類學・系統學',
      titleEn: 'Taxonomy & Systematics',
      heroPersonZh: 'Carl Linnaeus／Willi Hennig',
      heroPersonEn: 'Carl Linnaeus / Willi Hennig',
      descriptionZh: '學名、模式標本、分類階層、鑑定紀錄與系統分類研究收藏。',
      descriptionEn: 'Scientific names, types, ranks, identifications, and phylogenetic systematics.',
      tagsZh: ['學名', '模式標本', '鑑定', '分類階層', '系統樹'],
      tagsEn: ['Nomenclature', 'Types', 'IDs', 'Ranks', 'Trees'],
      subs: [
        { slug: 'types', name: 'Type specimens', nameZh: '模式標本' },
        { slug: 'nomenclature', name: 'Nomenclature', nameZh: '命名法' },
        { slug: 'keys', name: 'Identification keys', nameZh: '鑑定檢索' },
        { slug: 'phylo_refs', name: 'Phylogenetic references', nameZh: '系統發育參考' }
      ]
    },
    {
      id: 'evolutionary-biology',
      titleZh: '演化生物學',
      titleEn: 'Evolutionary Biology',
      heroPersonZh: 'Charles Darwin／Alfred Russel Wallace',
      heroPersonEn: 'Charles Darwin / Alfred Russel Wallace',
      descriptionZh: '演化關係、適應特徵、島嶼物種、比較研究與演化樹收藏。',
      descriptionEn: 'Evolutionary relationships, adaptation, island taxa, comparisons, and trees.',
      tagsZh: ['Darwin', 'Galápagos', '適應', '比較', '演化樹'],
      tagsEn: ['Darwin', 'Galápagos', 'Adaptation', 'Comparison', 'Phylogeny'],
      subs: [
        { slug: 'adaptation', name: 'Adaptation', nameZh: '適應' },
        { slug: 'islands', name: 'Island biogeography', nameZh: '島嶼生物地理' },
        { slug: 'trees', name: 'Phylogenetic trees', nameZh: '演化樹' },
        { slug: 'comparative', name: 'Comparative morphology', nameZh: '比較形態' }
      ]
    },
    {
      id: 'ecology',
      titleZh: '生態學',
      titleEn: 'Ecology',
      heroPersonZh: 'Alexander von Humboldt',
      heroPersonEn: 'Alexander von Humboldt',
      descriptionZh: '棲地、野外調查、環境照片、GPS 地點與生態關係紀錄。',
      descriptionEn: 'Habitats, surveys, environmental imagery, GPS, and ecological interactions.',
      tagsZh: ['棲地', '野外調查', 'GPS', '環境照片', '生態系'],
      tagsEn: ['Habitat', 'Field survey', 'GPS', 'Habitat photos', 'Ecosystems'],
      subs: [
        { slug: 'habitat', name: 'Habitat vouchers', nameZh: '棲地紀錄' },
        { slug: 'survey', name: 'Field surveys', nameZh: '野外調查' },
        { slug: 'gps', name: 'Georeferenced sets', nameZh: '地理座標集' },
        { slug: 'community', name: 'Community ecology', nameZh: '群聚生態' }
      ]
    },
    {
      id: 'genetics',
      titleZh: '遺傳學',
      titleEn: 'Genetics',
      heroPersonZh: 'Gregor Mendel',
      heroPersonEn: 'Gregor Mendel',
      descriptionZh: '遺傳紀錄、性狀資料、育種紀錄、DNA 與族群變異相關收藏。',
      descriptionEn: 'Heredity records, traits, breeding logs, DNA, and population variation.',
      tagsZh: ['Mendel', '性狀', '遺傳', '育種', '族群變異'],
      tagsEn: ['Mendel', 'Traits', 'Heredity', 'Breeding', 'Population variation'],
      subs: [
        { slug: 'pedigree', name: 'Pedigrees', nameZh: '譜系' },
        { slug: 'traits', name: 'Trait datasets', nameZh: '性狀資料' },
        { slug: 'dna', name: 'Molecular vouchers', nameZh: '分子樣本' },
        { slug: 'breeding', name: 'Breeding records', nameZh: '育種紀錄' }
      ]
    }
  ];

  function resolveRelUrl(rel) {
    try {
      if (typeof global.mcResolveLocalRelToPage_ === 'function') {
        return global.mcResolveLocalRelToPage_(rel);
      }
    } catch (e0) {
      void 0;
    }
    try {
      return new URL('../' + String(rel || '').replace(/^\//, ''), global.location.href).href;
    } catch (e1) {
      return '../' + String(rel || '');
    }
  }

  function coverCandidateRels(id) {
    var out = [];
    var al = FILENAME_ALIASES[id];
    if (al && al.length) {
      for (var i = 0; i < al.length; i++) {
        out.push(RD_BASE + al[i]);
      }
    }
    out.push(RD_BASE + 'cover-' + id + '.jpg');
    return out;
  }

  function normalizeMuseumDepartmentSlug(slug) {
    var s = String(slug || '').trim();
    if (!s) return '';
    if (LEGACY_SLUG_MAP[s]) return LEGACY_SLUG_MAP[s];
    return s;
  }

  /**
   * Step through coverCandidate URLs (absolute) then Flickr fallback — used by Museum UI <img onerror>.
   */
  function mcMuseumDeptCoverImgOnError_(img) {
    if (!img) return;
    try {
      var rels = JSON.parse(img.getAttribute('data-mc-cover-rels') || '[]');
      var cur = Number(img.dataset.mcCoverIdx || '0');
      var next = cur + 1;
      if (rels.length && next < rels.length) {
        img.dataset.mcCoverIdx = String(next);
        img.src = rels[next];
        return;
      }
    } catch (e0) {
      void 0;
    }
    var fb = img.getAttribute('data-mc-cover-fb');
    if (fb) img.src = fb;
  }

  function mcBuildMuseumDepartmentsWithFlickrFallback(flickrPool) {
    var pool = Array.isArray(flickrPool) && flickrPool.length ? flickrPool : [];
    return RESEARCH_DISCIPLINES.map(function (d, idx) {
      var rels = coverCandidateRels(d.id);
      var primaryAbs = resolveRelUrl(rels[0]);
      var fb = pool.length ? pool[idx % pool.length] : primaryAbs;
      return {
        slug: d.id,
        name: d.titleEn,
        nameZh: d.titleZh,
        blurb: d.descriptionEn,
        blurbZh: d.descriptionZh,
        heroPersonZh: d.heroPersonZh,
        heroPersonEn: d.heroPersonEn,
        tagsZh: d.tagsZh,
        tagsEn: d.tagsEn,
        subs: (d.subs || []).map(function (s) {
          return { slug: s.slug, name: s.name, nameZh: s.nameZh || '' };
        }),
        cover: primaryAbs,
        coverRels: rels,
        coverFallback: fb,
        coverCandidatesJson: JSON.stringify(rels.map(resolveRelUrl))
      };
    });
  }

  function mcGetResearchDisciplineById(id) {
    var want = String(id || '');
    for (var i = 0; i < RESEARCH_DISCIPLINES.length; i++) {
      if (RESEARCH_DISCIPLINES[i].id === want) return RESEARCH_DISCIPLINES[i];
    }
    return null;
  }

  global.MC_RESEARCH_DISCIPLINES = RESEARCH_DISCIPLINES;
  global.mcBuildMuseumDepartmentsWithFlickrFallback = mcBuildMuseumDepartmentsWithFlickrFallback;
  global.mcNormalizeMuseumDepartmentSlug = normalizeMuseumDepartmentSlug;
  global.mcGetResearchDisciplineById = mcGetResearchDisciplineById;
  global.mcMuseumResearchDisciplineCoverRels = coverCandidateRels;
  global.mcMuseumDeptCoverImgOnError_ = mcMuseumDeptCoverImgOnError_;
  global.mcMuseumResearchDisciplinesVersion = '1.0.1';
})(typeof window !== 'undefined' ? window : this);
