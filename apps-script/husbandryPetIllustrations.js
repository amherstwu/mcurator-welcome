/**
 * Husbandry Log — default pet illustrations (filename = category slug).
 */
(function (global) {
  'use strict';

  var BASE = 'husbandry-pet-illustrations/';

  var SLUGS = [
    'Cat',
    'Dog',
    'Rabbit',
    'hamster',
    'guinea_pig',
    'Parrot',
    'mink',
    'Gecko',
    'lizard',
    'Snake',
    'fresh_water_fish',
    'Fish',
    'axolotl',
    'hedgehog',
    'Chinchilla',
    'Beetle',
    'Frog',
    'Pig',
    'Scorpions',
    'Tortoise',
    'Turtle',
    'Butterfly',
    'Moth',
    'goose',
    'Sugar_glider',
    'Scarabs',
    'Stag_beetle',
    'kangaroo',
    'Fox',
    'Toad',
    'Muroids',
    'Poison_dart_frog',
    'Hawk',
    'Cow',
    'Monkey',
    'Rhinoceros_beetles',
    'Pufferfish',
    'Meerkat',
    'Plantae',
    'Mantis',
    'Spider',
    'Octopus',
    'Ornamental_shrimp',
    'Anthozoa',
    'Centipedes',
    'Crab',
    'Millipede',
    'Isopoda',
    'Phyllium',
    'crickets',
    'Phasmatodea',
    'Ants',
    'Tettigoniidae',
    'Gerbil',
    'Capybara',
    'Sika_deer',
    'Horse',
    'Sheep',
    'Softshell_turtle',
    'Java_sparrow',
    'Ball_python',
    'Marine_fish',
    'Sea_anemone',
  ];

  var SPECIES_ID_TO_SLUG = {
    'ambystoma-mexicanum': 'axolotl',
    'dynastes-hercules-larva': 'Beetle',
    'dynastes-hercules-adult': 'Rhinoceros_beetles',
    'allomyrina-dichotoma-larva': 'Beetle',
    'prosopocoilus-giraffa-larva': 'Stag_beetle',
    'dorcus-hopei-larva': 'Stag_beetle',
    'pachnoda-marginata-larva': 'Beetle',
    'megasoma-actaeon-larva': 'Beetle',
    'xylotrupes-gideon-larva': 'Beetle',
    'cetonischema-pulchrum-larva': 'Beetle',
    'hierodula-patellifera': 'Mantis',
    'hierodula-membranacea': 'Mantis',
    'tenodera-sinensis': 'Mantis',
    'rhombodera-basalis': 'Mantis',
    'deroplatys-desiccata': 'Mantis',
    'orchid-mantis': 'Mantis',
    'hyla-japonica': 'Frog',
    'dendrobates-tinctorius': 'Poison_dart_frog',
    'bombina-orientalis': 'Toad',
    'clownfish-ocellaris': 'Marine_fish',
    'python-regius': 'Ball_python',
    'betta-splendens': 'Fish',
    'pandinus-imperator': 'Scorpions',
    'brachypelma-hamorii': 'Spider',
    'brachypelma-emilia': 'Spider',
    'chromatopelma-cyaneopubescens': 'Spider',
    'poecilotheria-regalis': 'Spider',
    'lasiodora-parahybana': 'Spider',
    'grammostola-pulchra': 'Spider',
    'heteroscodra-maculata': 'Spider',
    'acheta-domesticus': 'crickets',
    'extatosoma-tiaratum': 'Phasmatodea',
    'phyllium-giganteum': 'Phyllium',
    'carausius-morosus': 'Phasmatodea',
    'saga-pedos': 'Tettigoniidae',
    'mecopoda-elongata': 'Tettigoniidae',
    'formica-fusca-colony': 'Ants',
    'trachemys-scripta': 'Turtle',
    'chrysemys-picta': 'Turtle',
    'pelodiscus-sinensis': 'Softshell_turtle',
    'lonchura-oryzivora': 'Java_sparrow',
    'entacmaea-quadricolor': 'Sea_anemone',
    'testudo-hermanni': 'Tortoise',
    'geochelone-elephantopus': 'Tortoise',
    'indotestudo-elongata': 'Tortoise',
    'petaurus-breviceps': 'Sugar_glider',
    'meriones-unguiculatus': 'Gerbil',
    'hydrochoerus-hydrochaeris': 'Capybara',
    'cervus-nippon': 'Sika_deer',
    'equus-caballus': 'Horse',
    'ovis-aries': 'Sheep',
    'chlorocebus-pygerythrus': 'Monkey',
    'neocaridina-davidi': 'Ornamental_shrimp',
    'caridina-cantonensis': 'Ornamental_shrimp',
    'acropora-coral': 'Anthozoa',
    'scolopendra-subspinipes': 'Centipedes',
    'archispirostreptus-gigas': 'Millipede',
    'porcellio-scaber': 'Isopoda',
    'aquarium-crab': 'Crab',
    'danaus-plexippus': 'Butterfly',
    'attacus-atlas': 'Moth',
  };

  var PICKER_TO_SLUG = {
    gecko: 'Gecko',
    lizard: 'lizard',
    chameleon: 'lizard',
    skink: 'lizard',
    monitor: 'lizard',
    snake: 'Snake',
    tortoise: 'Tortoise',
    aquatic_turtle: 'Turtle',
    softshell_turtle: 'Softshell_turtle',
    ball_python: 'Ball_python',
    frog: 'Frog',
    salamander: 'Frog',
    axolotl: 'axolotl',
    toad: 'Toad',
    freshwater_fish: 'fresh_water_fish',
    marine_fish: 'Marine_fish',
    sea_anemone: 'Sea_anemone',
    shrimp: 'Ornamental_shrimp',
    snail_aquatic: 'fresh_water_fish',
    crab: 'Crab',
    planted_tank: 'Plantae',
    coral_reef: 'Anthozoa',
    octopus: 'Octopus',
    pufferfish: 'Pufferfish',
    beetle_larva: 'Beetle',
    stag_beetle: 'Stag_beetle',
    beetle_adult: 'Rhinoceros_beetles',
    mantis: 'Mantis',
    stick_insect: 'Phasmatodea',
    leaf_insect: 'Phyllium',
    cricket: 'crickets',
    katydid: 'Tettigoniidae',
    roach: 'Beetle',
    ant_colony: 'Ants',
    lepidoptera_larva: 'Beetle',
    lepidoptera_adult: 'Butterfly',
    tarantula: 'Spider',
    scorpion: 'Scorpions',
    jumping_spider: 'Spider',
    centipede: 'Centipedes',
    isopod: 'Isopoda',
    millipede: 'Millipede',
    cat: 'Cat',
    dog: 'Dog',
    rabbit: 'Rabbit',
    hamster: 'hamster',
    gerbil: 'Gerbil',
    capybara: 'Capybara',
    sika_deer: 'Sika_deer',
    horse: 'Horse',
    sheep: 'Sheep',
    guinea_pig: 'guinea_pig',
    parrot: 'Parrot',
    java_sparrow: 'Java_sparrow',
    bird: 'Parrot',
    ferret: 'mink',
    mink: 'mink',
    hedgehog: 'hedgehog',
    chinchilla: 'Chinchilla',
    pig: 'Pig',
    goose: 'goose',
    sugar_glider: 'Sugar_glider',
    kangaroo: 'kangaroo',
    rat: 'Muroids',
    meerkat: 'Meerkat',
    monkey: 'Monkey',
    fox: 'Fox',
    hawk: 'Hawk',
    house_plant: 'Plantae',
    bearded_dragon: 'lizard',
    poison_dart_frog: 'Poison_dart_frog',
    butterfly: 'Butterfly',
  };

  var CARE_TYPE_TO_SLUG = {
    'arboreal-gecko': 'Gecko',
    'general-reptile': 'lizard',
    snake: 'Snake',
    turtle: 'Turtle',
    tortoise: 'Tortoise',
    aquarium: 'fresh_water_fish',
    'aquatic-amphibian': 'Frog',
    'beetle-larva': 'Beetle',
    'beetle-adult': 'Rhinoceros_beetles',
    'general-insect': 'Beetle',
    mantis: 'Mantis',
    tarantula: 'Spider',
    'small-mammal': 'Sugar_glider',
    'companion-mammal': 'Cat',
    'companion-bird': 'Parrot',
    'display-plant': 'Plantae',
  };

  var CATEGORY_TO_SLUG = {
    gecko: 'Gecko',
    snake: 'Snake',
    turtle: 'Turtle',
    aquarium: 'fresh_water_fish',
    amphibian: 'Frog',
    'beetle-larva': 'Beetle',
    insect: 'Beetle',
    mantis: 'Mantis',
    arachnid: 'Spider',
    cat: 'Cat',
    dog: 'Dog',
    rabbit: 'Rabbit',
    hamster: 'hamster',
    guinea_pig: 'guinea_pig',
    bird: 'Parrot',
    parrot: 'Parrot',
    ferret: 'mink',
    mink: 'mink',
    hedgehog: 'hedgehog',
    chinchilla: 'Chinchilla',
    pig: 'Pig',
    sugar_glider: 'Sugar_glider',
    kangaroo: 'kangaroo',
    mammal: 'Sugar_glider',
  };

  var SCIENTIFIC_TO_SLUG = {
    'petaurus breviceps': 'Sugar_glider',
    'acheta domesticus': 'crickets',
    'extatosoma tiaratum': 'Phasmatodea',
    'phyllium giganteum': 'Phyllium',
    'mecopoda elongata': 'Tettigoniidae',
    'formica fusca': 'Ants',
    'porcellio scaber': 'Isopoda',
    'meriones unguiculatus': 'Gerbil',
    'hydrochoerus hydrochaeris': 'Capybara',
    'cervus nippon': 'Sika_deer',
    'equus caballus': 'Horse',
    'ovis aries': 'Sheep',
    'chlorocebus pygerythrus': 'Monkey',
    'python regius': 'Ball_python',
    'lonchura oryzivora': 'Java_sparrow',
    'entacmaea quadricolor': 'Sea_anemone',
    'pelodiscus sinensis': 'Softshell_turtle',
  };

  var VERNACULAR_TO_SLUG = {
    'sugar glider': 'Sugar_glider',
    '蜜袋鼯': 'Sugar_glider',
    '蜜袋鼠': 'Sugar_glider',
    '袋鼯': 'Sugar_glider',
    '蟋蟀': 'crickets',
    '竹節蟲': 'Phasmatodea',
    '竹节虫': 'Phasmatodea',
    '葉脩': 'Phyllium',
    '叶䗛': 'Phyllium',
    '螽斯': 'Tettigoniidae',
    '螞蟻': 'Ants',
    '等足目': 'Isopoda',
    '鼠婦': 'Isopoda',
    '鼠妇': 'Isopoda',
    '潮蟲': 'Isopoda',
    '潮虫': 'Isopoda',
    'isopod': 'Isopoda',
    'woodlouse': 'Isopoda',
    '沙鼠': 'Gerbil',
    '蒙古沙鼠': 'Gerbil',
    'gerbil': 'Gerbil',
    '水豚': 'Capybara',
    'capybara': 'Capybara',
    '梅花鹿': 'Sika_deer',
    '台灣梅花鹿': 'Sika_deer',
    '台湾梅花鹿': 'Sika_deer',
    'sika deer': 'Sika_deer',
    '馬': 'Horse',
    '马': 'Horse',
    'horse': 'Horse',
    '羊': 'Sheep',
    '綿羊': 'Sheep',
    '绵羊': 'Sheep',
    'sheep': 'Sheep',
    '猴子': 'Monkey',
    '猴': 'Monkey',
    '獼猴': 'Monkey',
    '猕猴': 'Monkey',
    '獮猴': 'Monkey',
    'monkey': 'Monkey',
    'vervet': 'Monkey',
    '綠猴': 'Monkey',
    '绿猴': 'Monkey',
    '鱉': 'Softshell_turtle',
    '鳖': 'Softshell_turtle',
    '甲鱼': 'Softshell_turtle',
    'softshell turtle': 'Softshell_turtle',
    '文鳥': 'Java_sparrow',
    '文鸟': 'Java_sparrow',
    'java sparrow': 'Java_sparrow',
    'munia': 'Java_sparrow',
    '球蟒': 'Ball_python',
    'ball python': 'Ball_python',
    '皇家蟒': 'Ball_python',
    '海水魚': 'Marine_fish',
    '海水鱼': 'Marine_fish',
    'marine fish': 'Marine_fish',
    '小丑魚': 'Marine_fish',
    '小丑鱼': 'Marine_fish',
    'clownfish': 'Marine_fish',
    '海葵': 'Sea_anemone',
    'sea anemone': 'Sea_anemone',
    '公主海葵': 'Sea_anemone',
    '鍬形蟲': 'Stag_beetle',
    '鍬形虫': 'Stag_beetle',
    '锹形虫': 'Stag_beetle',
    'stag beetle': 'Stag_beetle',
    '細身鍬': 'Stag_beetle',
    '巨細鍬': 'Stag_beetle',
  };

  function normSciKey(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/[,].*$/, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join(' ');
  }

  function slugFromVernacular(petOrProfile) {
    var fields = [
      petOrProfile.chineseName,
      petOrProfile.commonName,
      petOrProfile.petName,
    ];
    var snap = petOrProfile.profileSnapshot;
    if (snap) {
      fields.push(snap.chineseName, snap.commonName, snap.scientificName);
    }
    for (var i = 0; i < fields.length; i++) {
      var raw = String(fields[i] || '').trim();
      if (!raw) continue;
      var key = raw.toLowerCase();
      if (VERNACULAR_TO_SLUG[key]) return VERNACULAR_TO_SLUG[key];
      var compact = key.replace(/[\s\-_'./]/g, '');
      if (VERNACULAR_TO_SLUG[compact]) return VERNACULAR_TO_SLUG[compact];
    }
    var sci = normSciKey(petOrProfile.scientificName || (snap && snap.scientificName));
    if (sci && SCIENTIFIC_TO_SLUG[sci]) return SCIENTIFIC_TO_SLUG[sci];
    return null;
  }

  function normSlug(raw) {
    return String(raw || '').trim();
  }

  function hasSlug(slug) {
    return SLUGS.indexOf(slug) >= 0;
  }

  function resolveSlug(petOrProfile) {
    if (!petOrProfile) return null;
    var snap = petOrProfile.profileSnapshot || null;
    var picker = (snap && snap.careTypePickerId) || petOrProfile.careTypePickerId || '';
    if (picker && PICKER_TO_SLUG[picker]) return PICKER_TO_SLUG[picker];

    var direct = normSlug(petOrProfile.illustrationCategory || petOrProfile.illustrationSlug);
    if (direct && hasSlug(direct)) return direct;

    if (snap) {
      direct = normSlug(snap.illustrationCategory || snap.illustrationSlug);
      if (direct && hasSlug(direct)) return direct;
    }

    var speciesId = petOrProfile.speciesId || (snap && snap.id) || '';
    if (speciesId && SPECIES_ID_TO_SLUG[speciesId]) return SPECIES_ID_TO_SLUG[speciesId];

    var careTypeKey = petOrProfile.careTypeKey || (snap && snap.careTypeKey) || '';
    if (careTypeKey && CARE_TYPE_TO_SLUG[careTypeKey]) return CARE_TYPE_TO_SLUG[careTypeKey];

    var category = petOrProfile.category || (snap && snap.category) || '';
    if (category && CATEGORY_TO_SLUG[category]) return CATEGORY_TO_SLUG[category];

    var vernacularSlug = slugFromVernacular(petOrProfile);
    if (vernacularSlug && hasSlug(vernacularSlug)) return vernacularSlug;

    return null;
  }

  function getIllustrationUrl(petOrProfile) {
    var slug = resolveSlug(petOrProfile);
    if (!slug) return null;
    return BASE + slug + '.png';
  }

  global.MCHusbandryPetIllustrations = {
    slugs: SLUGS,
    basePath: BASE,
    resolveSlug: resolveSlug,
    getIllustrationUrl: getIllustrationUrl,
  };
})(typeof window !== 'undefined' ? window : this);
