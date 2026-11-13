/**
 * Husbandry Log — category-based care type picker (zhTW / en i18n keys).
 */
(function (global) {
  'use strict';

  var GROUPS = [
    {
      id: 'reptiles',
      labelKey: 'grpReptiles',
      types: [
        { id: 'gecko', careTypeKey: 'arboreal-gecko', labelKey: 'typeGecko' },
        { id: 'lizard', careTypeKey: 'general-reptile', labelKey: 'typeLizard' },
        { id: 'bearded_dragon', careTypeKey: 'general-reptile', labelKey: 'typeBeardedDragon', speciesId: 'pogona-vitticeps' },
        { id: 'chameleon', careTypeKey: 'arboreal-gecko', labelKey: 'typeChameleon' },
        { id: 'skink', careTypeKey: 'general-reptile', labelKey: 'typeSkink' },
        { id: 'monitor', careTypeKey: 'snake', labelKey: 'typeMonitor' },
        { id: 'snake', careTypeKey: 'snake', labelKey: 'typeSnake' },
        { id: 'ball_python', careTypeKey: 'snake', labelKey: 'typeBallPython', speciesId: 'python-regius' },
        { id: 'tortoise', careTypeKey: 'tortoise', labelKey: 'typeTortoise' },
        { id: 'aquatic_turtle', careTypeKey: 'turtle', labelKey: 'typeAquaticTurtle' },
        { id: 'softshell_turtle', careTypeKey: 'turtle', labelKey: 'typeSoftshellTurtle', speciesId: 'pelodiscus-sinensis' },
      ],
    },
    {
      id: 'amphibians',
      labelKey: 'grpAmphibians',
      types: [
        { id: 'frog', careTypeKey: 'aquatic-amphibian', labelKey: 'typeFrog' },
        { id: 'poison_dart_frog', careTypeKey: 'aquatic-amphibian', labelKey: 'typePoisonDartFrog', speciesId: 'dendrobates-tinctorius' },
        { id: 'salamander', careTypeKey: 'aquatic-amphibian', labelKey: 'typeSalamander' },
        { id: 'axolotl', careTypeKey: 'aquatic-amphibian', labelKey: 'typeAxolotl', speciesId: 'ambystoma-mexicanum' },
        { id: 'toad', careTypeKey: 'aquatic-amphibian', labelKey: 'typeToad' },
      ],
    },
    {
      id: 'insects',
      labelKey: 'grpInsects',
      types: [
        { id: 'beetle_larva', careTypeKey: 'beetle-larva', labelKey: 'typeBeetleLarva' },
        { id: 'stag_beetle', careTypeKey: 'beetle-larva', labelKey: 'typeStagBeetle', speciesId: 'prosopocoilus-giraffa-larva' },
        { id: 'beetle_adult', careTypeKey: 'beetle-adult', labelKey: 'typeBeetleAdult' },
        { id: 'mantis', careTypeKey: 'mantis', labelKey: 'typeMantis' },
        { id: 'butterfly', careTypeKey: 'general-insect', labelKey: 'typeButterfly', speciesId: 'danaus-plexippus' },
        { id: 'stick_insect', careTypeKey: 'general-insect', labelKey: 'typeStickInsect', speciesId: 'extatosoma-tiaratum' },
        { id: 'leaf_insect', careTypeKey: 'general-insect', labelKey: 'typeLeafInsect', speciesId: 'phyllium-giganteum' },
        { id: 'cricket', careTypeKey: 'general-insect', labelKey: 'typeCricket', speciesId: 'acheta-domesticus' },
        { id: 'katydid', careTypeKey: 'general-insect', labelKey: 'typeKatydid', speciesId: 'mecopoda-elongata' },
        { id: 'roach', careTypeKey: 'general-insect', labelKey: 'typeRoach' },
        { id: 'ant_colony', careTypeKey: 'general-insect', labelKey: 'typeAntColony', speciesId: 'formica-fusca-colony' },
        { id: 'lepidoptera_larva', careTypeKey: 'beetle-larva', labelKey: 'typeLepidopteraLarva' },
        { id: 'lepidoptera_adult', careTypeKey: 'general-insect', labelKey: 'typeLepidopteraAdult' },
      ],
    },
    {
      id: 'arachnids',
      labelKey: 'grpArachnids',
      types: [
        { id: 'tarantula', careTypeKey: 'tarantula', labelKey: 'typeTarantula' },
        { id: 'scorpion', careTypeKey: 'tarantula', labelKey: 'typeScorpion' },
        { id: 'jumping_spider', careTypeKey: 'tarantula', labelKey: 'typeJumpingSpider' },
        { id: 'isopod', careTypeKey: 'general-insect', labelKey: 'typeIsopod', speciesId: 'porcellio-scaber' },
        { id: 'millipede', careTypeKey: 'general-insect', labelKey: 'typeMillipede', speciesId: 'archispirostreptus-gigas' },
        { id: 'centipede', careTypeKey: 'tarantula', labelKey: 'typeCentipede', speciesId: 'scolopendra-subspinipes' },
      ],
    },
    {
      id: 'aquatic',
      labelKey: 'grpAquatic',
      types: [
        { id: 'freshwater_fish', careTypeKey: 'aquarium', labelKey: 'typeFreshwaterFish' },
        { id: 'marine_fish', careTypeKey: 'aquarium', labelKey: 'typeMarineFish', speciesId: 'clownfish-ocellaris' },
        { id: 'sea_anemone', careTypeKey: 'aquarium', labelKey: 'typeSeaAnemone', speciesId: 'entacmaea-quadricolor' },
        { id: 'shrimp', careTypeKey: 'aquarium', labelKey: 'typeShrimp', speciesId: 'caridina-cantonensis' },
        { id: 'snail_aquatic', careTypeKey: 'aquarium', labelKey: 'typeSnailAquatic' },
        { id: 'crab', careTypeKey: 'aquarium', labelKey: 'typeCrab', speciesId: 'aquarium-crab' },
        { id: 'octopus', careTypeKey: 'aquarium', labelKey: 'typeOctopus' },
        { id: 'pufferfish', careTypeKey: 'aquarium', labelKey: 'typePufferfish' },
        { id: 'planted_tank', careTypeKey: 'display-plant', labelKey: 'typePlantedTank' },
        { id: 'house_plant', careTypeKey: 'display-plant', labelKey: 'typeHousePlant' },
        { id: 'coral_reef', careTypeKey: 'aquarium', labelKey: 'typeCoralReef', speciesId: 'acropora-coral' },
      ],
    },
    {
      id: 'mammals',
      labelKey: 'grpMammals',
      types: [
        { id: 'sugar_glider', careTypeKey: 'small-mammal', labelKey: 'typeSugarGlider', speciesId: 'petaurus-breviceps' },
        { id: 'hamster', careTypeKey: 'companion-mammal', labelKey: 'typeHamster' },
        { id: 'gerbil', careTypeKey: 'companion-mammal', labelKey: 'typeGerbil', speciesId: 'meriones-unguiculatus' },
        { id: 'capybara', careTypeKey: 'companion-mammal', labelKey: 'typeCapybara', speciesId: 'hydrochoerus-hydrochaeris' },
        { id: 'sika_deer', careTypeKey: 'companion-mammal', labelKey: 'typeSikaDeer', speciesId: 'cervus-nippon' },
        { id: 'horse', careTypeKey: 'companion-mammal', labelKey: 'typeHorse', speciesId: 'equus-caballus' },
        { id: 'sheep', careTypeKey: 'companion-mammal', labelKey: 'typeSheep', speciesId: 'ovis-aries' },
        { id: 'guinea_pig', careTypeKey: 'companion-mammal', labelKey: 'typeGuineaPig' },
        { id: 'rabbit', careTypeKey: 'companion-mammal', labelKey: 'typeRabbit' },
        { id: 'rat', careTypeKey: 'companion-mammal', labelKey: 'typeRat' },
        { id: 'hedgehog', careTypeKey: 'companion-mammal', labelKey: 'typeHedgehog' },
        { id: 'chinchilla', careTypeKey: 'companion-mammal', labelKey: 'typeChinchilla' },
        { id: 'ferret', careTypeKey: 'companion-mammal', labelKey: 'typeFerret' },
        { id: 'cat', careTypeKey: 'companion-mammal', labelKey: 'typeCat' },
        { id: 'dog', careTypeKey: 'companion-mammal', labelKey: 'typeDog' },
        { id: 'pig', careTypeKey: 'companion-mammal', labelKey: 'typePigPet' },
        { id: 'fox', careTypeKey: 'companion-mammal', labelKey: 'typeFox' },
        { id: 'meerkat', careTypeKey: 'companion-mammal', labelKey: 'typeMeerkat' },
        { id: 'monkey', careTypeKey: 'companion-mammal', labelKey: 'typeMonkey', speciesId: 'chlorocebus-pygerythrus' },
        { id: 'kangaroo', careTypeKey: 'companion-mammal', labelKey: 'typeKangaroo' },
      ],
    },
    {
      id: 'birds',
      labelKey: 'grpBirds',
      types: [
        { id: 'parrot', careTypeKey: 'companion-bird', labelKey: 'typeParrot' },
        { id: 'java_sparrow', careTypeKey: 'companion-bird', labelKey: 'typeJavaSparrow', speciesId: 'lonchura-oryzivora' },
        { id: 'hawk', careTypeKey: 'companion-bird', labelKey: 'typeHawk' },
        { id: 'goose', careTypeKey: 'companion-bird', labelKey: 'typeGoose' },
      ],
    },
    {
      id: 'other',
      labelKey: 'grpOther',
      types: [
        { id: 'custom', careTypeKey: 'general-insect', labelKey: 'typeCustom', isCustom: true },
        { id: 'unknown', careTypeKey: 'general-insect', labelKey: 'typeUnknown', isUnknown: true },
      ],
    },
  ];

  function getGroups() {
    return GROUPS;
  }

  function findType(typeId) {
    for (var g = 0; g < GROUPS.length; g++) {
      for (var t = 0; t < GROUPS[g].types.length; t++) {
        if (GROUPS[g].types[t].id === typeId) {
          return { group: GROUPS[g], type: GROUPS[g].types[t] };
        }
      }
    }
    return null;
  }

  function buildProfileFromCareType(typeId, lang) {
    var found = findType(typeId);
    if (!found) return null;
    var type = found.type;
    var api = global.MCSpeciesCareProfiles;
    if (type.speciesId && api && typeof api.getProfile === 'function') {
      var speciesProf = api.getProfile(type.speciesId);
      if (speciesProf) {
        var pack = global.MCHusbandryLogI18n || { zhTW: {}, en: {} };
        var labels = pack[lang === 'en' ? 'en' : 'zhTW'] || {};
        speciesProf.careTypePickerId = typeId;
        speciesProf.careTypePickerLabel = labels[type.labelKey] || type.labelKey;
        return speciesProf;
      }
    }
    var prof = api && api.getCareTypeProfile ? api.getCareTypeProfile(type.careTypeKey) : null;
    if (!prof) return null;
    var pack = global.MCHusbandryLogI18n || { zhTW: {}, en: {} };
    var labels = pack[lang === 'en' ? 'en' : 'zhTW'] || {};
    var typeLabel = labels[type.labelKey] || type.labelKey;
    if (type.isCustom) {
      prof.commonName = lang === 'en' ? 'Custom Species' : '自訂物種';
      prof.chineseName = '自訂物種';
      prof.scientificName = '';
    } else if (type.isUnknown) {
      prof.commonName = lang === 'en' ? 'Unknown Species' : '尚未確認物種';
      prof.chineseName = '尚未確認物種';
      prof.scientificName = '';
    } else {
      prof.commonName = typeLabel;
      prof.chineseName = typeLabel;
    }
    prof.careTypePickerId = typeId;
    prof.careTypePickerLabel = typeLabel;
    prof.id = 'care-type-' + typeId;
    return prof;
  }

  global.MCHusbandryCareCategories = {
    groups: GROUPS,
    getGroups: getGroups,
    findType: findType,
    buildProfileFromCareType: buildProfileFromCareType,
  };
})(typeof window !== 'undefined' ? window : this);
