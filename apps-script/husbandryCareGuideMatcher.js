/**
 * Care guide matcher — stable priority resolution across all guide packs.
 */
(function (global) {
  'use strict';

  var GENERAL_ID = 'general_care';

  var MODULES_ = [
    'MCHusbandryCareGuideAmphibians',
    'MCHusbandryCareGuideInsects',
    'MCHusbandryCareGuideReptiles',
    'MCHusbandryCareGuideBirds',
    'MCHusbandryCareGuideSmallMammals',
    'MCHusbandryCareGuideArthropodTerrarium',
    'MCHusbandryCareGuideMarine',
    'MCHusbandryCareGuideFreshwater',
  ];

  function pickPetFields_(pet, keys) {
    var o = {
      id: pet.id,
      careGuideId: null,
      category: '',
      careTypeKey: '',
      commonName: '',
      chineseName: '',
      scientificName: '',
      petName: '',
      lifeStage: '',
      instarLabel: '',
      profileNote: '',
    };
    keys.forEach(function (k) {
      if (pet[k] != null && pet[k] !== '') o[k] = pet[k];
    });
    return o;
  }

  function delegateModuleMatch_(pet) {
    var i;
    for (i = 0; i < MODULES_.length; i++) {
      var mod = global[MODULES_[i]];
      if (mod && typeof mod.matchGuideId === 'function') {
        var id = mod.matchGuideId(pet);
        if (id) return id;
      }
    }
    return null;
  }

  function quickKeywordMatch_(text) {
    var blob = String(text || '').toLowerCase();
    if (!blob) return null;

    if (/axolotl|六角恐龍|mexican walking fish|salamander|蠑螈|newt/.test(blob) && !/toad|蟾/.test(blob)) {
      if (/axolotl|六角|ambystoma/.test(blob)) return 'aquatic_amphibian_general';
    }
    if (/toad|蟾蜍/.test(blob)) return 'toad_general';
    if (/horned frog|角蛙|dart frog|箭毒蛙|tree frog|樹蛙|rain frog|雨蛙|stream frog|溪蛙|pacman|litoria|rana|hyla|dendrobates|phyllomedusa|frog|蛙|哇哇/.test(blob) && !/bullfrog plant/.test(blob)) {
      return 'frog_general';
    }

    if (/mantis|螳螂|stick insect|竹節蟲|walking stick|ant colony|螞蟻群|formicarium/.test(blob)) {
      if (/mantis|螳螂/.test(blob)) return 'mantis_general';
      if (/stick|竹節/.test(blob)) return 'stick_insect_general';
      if (/ant|螞蟻/.test(blob)) return 'ant_colony_general';
    }
    if (/beetle|甲蟲|鍬形蟲|兜蟲|兜虫|rhinoceros|dynastes|stag beetle|獨角仙|金龜子|scarab|larva|幼蟲|幼体|幼體|grub|蠶|silkworm/.test(blob)) {
      if (/larva|幼蟲|幼体|幼體|grub|蠶|silkworm/.test(blob)) return 'beetle_larva_general';
      return 'beetle_adult_general';
    }

    if (/crested gecko|睫角|leopard gecko|豹紋|gecko|守宮/.test(blob)) return 'gecko_general';
    if (/ball python|球蟒|corn snake|玉米蛇|python|boa|snake|蛇/.test(blob)) return 'snake_general';
    if (/bearded dragon|鬃獅蜥|lizard|蜥蜴|monitor|巨蜥/.test(blob)) return 'lizard_general';
    if (/hermann|赫曼|tortoise|陸龜|greek tortoise|蘇卡達|sulcata/.test(blob)) return 'tortoise_general';
    if (/aquatic turtle|水龜|red.?ear|slider|龜/.test(blob) && !/tortoise|陸龜/.test(blob)) return 'aquatic_turtle_general';

    if (/shrimp|米蝦|水晶蝦|cherry shrimp|bee shrimp|蝦/.test(blob)) return 'shrimp_general';
    if (/crayfish|螯蝦|lobster.*fresh|fresh.*cray/.test(blob)) return 'crayfish_general';
    if (/planted tank|水草缸|aquascape|水草/.test(blob)) return 'planted_tank_general';
    if (/betta|鬥魚|guppy|孔雀魚|goldfish|金魚|tetra|燈魚|freshwater|淡水魚|freshwater fish/.test(blob)) return 'freshwater_fish_general';

    if (/anemone|海葵/.test(blob)) return 'anemone_general';
    if (/coral|珊瑚|lps|sps/.test(blob) && !/fish|魚/.test(blob)) return 'coral_general';
    if (/clownfish|小丑魚|marine fish|海水魚|tang|倒吊|reef fish|saltwater fish|marine_aquatics/.test(blob)) return 'marine_fish_general';
    if (/hermit.*marine|marine.*hermit|海水寄居/.test(blob)) return 'hermit_crab_marine_general';
    if (/reef tank|海水缸|sps tank|lps tank/.test(blob)) return 'reef_tank_general';

    if (/chick|幼鳥|hand feed|手養/.test(blob)) return 'chick_general';
    if (/cockatiel|玄鳳|budgie|虎皮|parrot|鸚鵡|lovebird|非洲灰|macaw|conure/.test(blob)) return 'parrot_general';
    if (/finch|文鳥|canary|java sparrow|zebra finch/.test(blob)) return 'finch_general';

    if (/guinea pig|天竺鼠|cavy/.test(blob)) return 'guinea_pig_general';
    if (/rabbit|兔子/.test(blob)) return 'rabbit_general';
    if (/hedgehog|刺蝟/.test(blob)) return 'hedgehog_general';
    if (/sugar glider|蜜袋鼯/.test(blob)) return 'sugar_glider_general';
    if (/chinchilla|龍貓/.test(blob)) return 'chinchilla_general';
    if (/gerbil|沙鼠/.test(blob)) return 'hamster_general';
    if (/hamster|倉鼠|syrian|dwarf hamster/.test(blob)) return 'hamster_general';

    if (/scorpion|蠍/.test(blob)) return 'scorpion_general';
    if (/centipede|蜈蚣/.test(blob)) return 'centipede_general';
    if (/millipede|馬陸/.test(blob)) return 'millipede_general';
    if (/land hermit|陸寄居蟹/.test(blob)) return 'land_hermit_crab_general';
    if (/tarantula|捕鳥蛛/.test(blob)) return 'tarantula_general';
    if (/isopod|等足|鼠婦|潮蟲|pill bug|roly.?poly/.test(blob)) return 'isopod_general';
    if (/spider|蜘蛛/.test(blob) && !/crab|寄居/.test(blob)) return 'tarantula_general';

    if (/carnivorous plant|食蟲植物|moss|苔蘚|orchid|蘭花|plant care|植物/.test(blob) && !/planted tank|水草/.test(blob)) {
      return 'plant_care_general';
    }
    if (/terrarium|vivarium|生態缸|雨林缸|bioactive|paludarium/.test(blob)) return 'terrarium_general';

    return null;
  }

  function matchCareGuide_(pet) {
    if (!pet) return GENERAL_ID;
    if (pet.careGuideId) return pet.careGuideId;

    var fieldSlices = [
      ['scientificName'],
      ['commonName', 'chineseName'],
      ['petName'],
      ['category', 'careTypeKey'],
      ['lifeStage', 'instarLabel'],
    ];

    var i;
    var text;
    for (i = 0; i < fieldSlices.length; i++) {
      var slice = pickPetFields_(pet, fieldSlices[i]);
      var blobParts = fieldSlices[i].map(function (k) { return slice[k]; }).filter(Boolean);
      text = blobParts.join(' ');
      if (!text) continue;
      var quick = quickKeywordMatch_(text);
      if (quick) return quick;
      var modId = delegateModuleMatch_(slice);
      if (modId) return modId;
    }

    var fullId = delegateModuleMatch_(pet);
    if (fullId) return fullId;

    var allText = [
      pet.scientificName,
      pet.commonName,
      pet.chineseName,
      pet.petName,
      pet.category,
      pet.lifeStage,
    ].filter(Boolean).join(' ');
    var fallbackQuick = quickKeywordMatch_(allText);
    if (fallbackQuick) return fallbackQuick;

    return GENERAL_ID;
  }

  global.MCHusbandryCareGuideMatcher = {
    GENERAL_ID: GENERAL_ID,
    matchCareGuide: matchCareGuide_,
    quickKeywordMatch: quickKeywordMatch_,
  };
})(typeof window !== 'undefined' ? window : this);
