/**
 * MCurator — Species care profiles (single source for husbandry suggestions).
 * All care recommendations must come from this file — not hardcoded in UI.
 */
(function (global) {
  'use strict';

  var CARE_TYPES = {
    'arboreal-gecko': {
      careType: 'Arboreal Gecko',
      careTypeZh: '樹棲守宮',
      difficulty: 'Beginner–Intermediate',
      mainFocus: ['Humidity', 'Feeding', 'Shedding', 'Weight', 'Activity'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Shedding Cycle'],
      dailyQuests: [
        'Check humidity',
        'Mist enclosure',
        'Log feeding response',
        'Check water dish',
        'Observe night activity',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record current temperature',
        'Record current humidity',
        'Create first feeding baseline',
      ],
      recordMenu: [
        'Feeding',
        'Temperature',
        'Humidity',
        'Misting',
        'Weight',
        'Shedding',
        'Stool',
        'Activity',
        'Photo',
        'Health note',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
        humidity: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    tarantula: {
      careType: 'Terrestrial Tarantula',
      careTypeZh: '地棲蜘蛛',
      difficulty: 'Intermediate',
      mainFocus: ['Feeding', 'Premolt', 'Substrate moisture', 'Abdomen condition'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Molting Cycle'],
      dailyQuests: [
        'Check water dish',
        'Observe premolt signs',
        'Log feeding or refusal',
        'Check substrate moisture',
        'Note hiding behavior',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record enclosure temperature',
        'Check substrate moisture baseline',
        'Log first feeding response',
      ],
      recordMenu: [
        'Feeding',
        'Refused food',
        'Premolt signs',
        'Molting',
        'Substrate moisture',
        'Temperature',
        'Abdomen condition',
        'Hiding behavior',
        'Defensive response',
        'Photo',
        'Health note',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
        humidity: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    'beetle-larva': {
      careType: 'Beetle Larva',
      careTypeZh: '甲蟲幼蟲',
      difficulty: 'Intermediate',
      mainFocus: ['Instar', 'Weight', 'Substrate', 'Temperature', 'Frass'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Molting Cycle'],
      dailyQuests: [
        'Check substrate moisture',
        'Log weight or size',
        'Observe frass amount',
        'Check temperature',
        'Note activity level',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record substrate temperature',
        'Log initial weight',
        'Note current instar stage',
      ],
      recordMenu: [
        'Instar',
        'Weight',
        'Substrate replacement',
        'Substrate condition',
        'Frass amount',
        'Temperature',
        'Humidity',
        'Pupation',
        'Emergence',
        'Photo',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
        humidity: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    mantis: {
      careType: 'Praying Mantis',
      careTypeZh: '螳螂',
      difficulty: 'Beginner–Intermediate',
      mainFocus: ['Instar', 'Feeding', 'Molting', 'Humidity', 'Hunting response'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Molting Cycle'],
      dailyQuests: [
        'Log feeding response',
        'Check humidity',
        'Observe perching condition',
        'Watch for molting signs',
        'Upload daily photo',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record enclosure humidity',
        'Log current instar',
        'Create first feeding baseline',
      ],
      recordMenu: [
        'Instar',
        'Feeding',
        'Refused food',
        'Molting',
        'Adult emergence',
        'Humidity',
        'Perching condition',
        'Hunting response',
        'Breeding',
        'Photo',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
        humidity: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    'aquatic-amphibian': {
      careType: 'Aquatic Amphibian',
      careTypeZh: '水生兩棲類',
      difficulty: 'Intermediate–Advanced',
      mainFocus: ['Water quality', 'Temperature', 'Feeding', 'Gill/skin condition'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Molting Cycle'],
      dailyQuests: [
        'Check water temperature',
        'Observe feeding response',
        'Check activity level',
        'Note skin or gill condition',
        'Log water change if due',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record water temperature',
        'Log water quality baseline',
        'Create first feeding baseline',
      ],
      recordMenu: [
        'Feeding',
        'Water temperature',
        'pH',
        'Ammonia',
        'Nitrite',
        'Nitrate',
        'Water change',
        'Gill condition',
        'Skin condition',
        'Activity',
        'Photo',
        'Health note',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
        pH: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    snake: {
      careType: 'Snake',
      careTypeZh: '蛇類',
      difficulty: 'Intermediate',
      mainFocus: ['Feeding', 'Shedding', 'Temperature gradient', 'Weight'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Shedding Cycle'],
      dailyQuests: [
        'Check warm/cool side temps',
        'Check water bowl',
        'Observe activity',
        'Log feeding schedule',
        'Check shed cycle',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record warm-side temperature',
        'Record cool-side temperature',
        'Create first feeding baseline',
      ],
      recordMenu: [
        'Feeding',
        'Refused food',
        'Weight',
        'Shedding',
        'Stool',
        'Temperature gradient',
        'Humidity',
        'Defensive response',
        'Photo',
        'Health note',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
        humidity: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    turtle: {
      careType: 'Turtle',
      careTypeZh: '龜類',
      difficulty: 'Intermediate',
      mainFocus: ['Basking', 'Water quality', 'Feeding', 'Shell condition'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Shedding Cycle'],
      dailyQuests: [
        'Check basking temperature',
        'Check water temperature',
        'Log feeding',
        'Observe shell condition',
        'Check UV / lighting schedule',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record basking temperature',
        'Record water temperature',
        'Create first feeding baseline',
      ],
      recordMenu: [
        'Feeding',
        'Basking',
        'Water quality',
        'Water temperature',
        'UVB',
        'Weight',
        'Shell condition',
        'Stool',
        'Activity',
        'Photo',
        'Health note',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    aquarium: {
      careType: 'Aquarium',
      careTypeZh: '水族',
      difficulty: 'Varies',
      mainFocus: ['Water parameters', 'Feeding', 'Stocking', 'Maintenance'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Molting Cycle'],
      dailyQuests: [
        'Check water parameters',
        'Observe fish behavior',
        'Log feeding',
        'Check equipment',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record water parameters',
        'Log stocking baseline',
        'Create first feeding baseline',
      ],
      recordMenu: [
        'Water temperature',
        'pH',
        'Ammonia',
        'Nitrite',
        'Nitrate',
        'Water change',
        'Feeding',
        'Activity',
        'Health note',
        'Photo',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    'general-insect': {
      careType: 'General Insect',
      careTypeZh: '一般昆蟲',
      difficulty: 'Beginner–Intermediate',
      mainFocus: ['Instar', 'Feeding', 'Molting', 'Substrate', 'Activity'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Molting Cycle'],
      dailyQuests: [
        'Log feeding response',
        'Check substrate moisture',
        'Observe activity level',
        'Watch for molting signs',
        'Upload daily photo',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record current instar',
        'Log first feeding response',
        'Note substrate condition',
      ],
      recordMenu: [
        'Instar',
        'Feeding',
        'Refused food',
        'Molting',
        'Activity',
        'Substrate condition',
        'Photo',
        'Health note',
      ],
      recommendedRanges: {
        temperature: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
        humidity: { value: 'Refer to verified husbandry source before publishing exact range', confidence: 'Needs review' },
      },
    },
    tortoise: {
      careType: 'Tortoise',
      careTypeZh: '陸龜',
      difficulty: 'Intermediate',
      mainFocus: ['Basking', 'Humidity', 'Feeding', 'Shell condition'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Shedding Cycle'],
      dailyQuests: [
        'Check basking temperature',
        'Log feeding',
        'Observe shell condition',
        'Check humidity',
        'Observe activity',
      ],
      starterQuests: [
        'Create individual name',
        'Set care start date',
        'Upload first photo',
        'Record basking temperature',
        'Create first feeding baseline',
      ],
      recordMenu: ['Feeding', 'Basking', 'Humidity', 'Shell condition', 'Stool', 'Activity', 'Photo'],
      recommendedRanges: {},
    },
    'beetle-adult': {
      careType: 'Adult Beetle',
      careTypeZh: '甲蟲成蟲',
      difficulty: 'Intermediate',
      mainFocus: ['Feeding', 'Substrate', 'Temperature', 'Breeding'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Molting Cycle'],
      dailyQuests: [
        'Log feeding response',
        'Check substrate moisture',
        'Check temperature',
        'Upload daily photo',
      ],
      starterQuests: ['Create individual name', 'Set care start date', 'Upload first photo'],
      recordMenu: ['Feeding', 'Substrate condition', 'Temperature', 'Photo'],
      recommendedRanges: {},
    },
    'general-reptile': {
      careType: 'General Reptile',
      careTypeZh: '一般爬蟲類',
      difficulty: 'Intermediate',
      mainFocus: ['Temperature', 'Humidity', 'Feeding', 'Shedding'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Shedding Cycle'],
      dailyQuests: [
        'Check warm/cool side temps',
        'Log feeding',
        'Check humidity',
        'Observe activity',
      ],
      starterQuests: ['Create individual name', 'Set care start date', 'Upload first photo'],
      recordMenu: ['Feeding', 'Temperature', 'Humidity', 'Shedding', 'Activity', 'Photo'],
      recommendedRanges: {},
    },
    'small-mammal': {
      careType: 'Small Mammal',
      careTypeZh: '小型哺乳類',
      difficulty: 'Intermediate',
      mainFocus: ['Feeding', 'Weight', 'Activity', 'Environment', 'Social behavior'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Activity'],
      dailyQuests: [
        'Log feeding',
        'Check water',
        'Observe activity',
        'Check enclosure temperature',
        'Note social behavior',
      ],
      starterQuests: ['Create individual name', 'Set care start date', 'Upload first photo', 'Record weight baseline'],
      recordMenu: ['Feeding', 'Weight', 'Temperature', 'Activity', 'Photo', 'Health note'],
      recommendedRanges: {},
    },
    'companion-mammal': {
      careType: 'Companion Mammal',
      careTypeZh: '哺乳類寵物',
      difficulty: 'Beginner–Intermediate',
      mainFocus: ['Feeding', 'Weight', 'Activity', 'Environment'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Activity'],
      dailyQuests: ['Log feeding', 'Check water', 'Observe activity', 'Check enclosure cleanliness'],
      starterQuests: ['Create individual name', 'Set care start date', 'Upload first photo'],
      recordMenu: ['Feeding', 'Weight', 'Activity', 'Photo', 'Health note'],
      recommendedRanges: {},
    },
    'companion-bird': {
      careType: 'Companion Bird',
      careTypeZh: '鳥類',
      difficulty: 'Intermediate',
      mainFocus: ['Feeding', 'Activity', 'Feather condition', 'Environment'],
      statusMeters: ['Appetite', 'Hydration', 'Environment Stability', 'Growth', 'Health', 'Activity'],
      dailyQuests: ['Log feeding', 'Check water', 'Observe activity', 'Check perch and cage'],
      starterQuests: ['Create individual name', 'Set care start date', 'Upload first photo'],
      recordMenu: ['Feeding', 'Activity', 'Photo', 'Health note'],
      recommendedRanges: {},
    },
    'display-plant': {
      careType: 'Aquatic / House Plant',
      careTypeZh: '植物／水草',
      difficulty: 'Beginner',
      mainFocus: ['Lighting', 'Watering', 'Growth', 'Substrate'],
      statusMeters: ['Hydration', 'Environment Stability', 'Growth', 'Health'],
      dailyQuests: ['Check moisture or water level', 'Observe new growth', 'Check lighting'],
      starterQuests: ['Create individual name', 'Set care start date', 'Upload first photo'],
      recordMenu: ['Substrate condition', 'Photo', 'Health note'],
      recommendedRanges: {},
    },
  };

  var SPECIES = [
    {
      id: 'correlophus-ciliatus',
      scientificName: 'Correlophus ciliatus',
      commonName: 'Crested Gecko',
      chineseName: '睫角守宮',
      category: 'gecko',
      careTypeKey: 'arboreal-gecko',
      confidence: 'Needs review',
    },
    {
      id: 'rhacodactylus-auriculatus',
      scientificName: 'Rhacodactylus auriculatus',
      commonName: 'Gargoyle Gecko',
      chineseName: '蓋勾亞守宮',
      category: 'gecko',
      careTypeKey: 'arboreal-gecko',
      confidence: 'Needs review',
    },
    {
      id: 'brachypelma-hamorii',
      scientificName: 'Brachypelma hamorii',
      commonName: 'Mexican Red-Knee Tarantula',
      chineseName: '墨西哥紅膝蜘蛛',
      category: 'arachnid',
      careTypeKey: 'tarantula',
      confidence: 'Needs review',
    },
    {
      id: 'dynastes-hercules-larva',
      scientificName: 'Dynastes hercules (larva)',
      commonName: 'Hercules Beetle Larva',
      chineseName: '長戟大兜幼蟲',
      category: 'beetle-larva',
      careTypeKey: 'beetle-larva',
      confidence: 'Needs review',
    },
    {
      id: 'hierodula-patellifera',
      scientificName: 'Hierodula patellifera',
      commonName: 'Giant Asian Mantis',
      chineseName: '廣斧螳螂',
      category: 'mantis',
      careTypeKey: 'mantis',
      confidence: 'Needs review',
    },
    {
      id: 'acheta-domesticus',
      scientificName: 'Acheta domesticus',
      commonName: 'House Cricket',
      chineseName: '家蟋蟀',
      category: 'insect',
      careTypeKey: 'general-insect',
      confidence: 'Needs review',
    },
    {
      id: 'ambystoma-mexicanum',
      scientificName: 'Ambystoma mexicanum',
      commonName: 'Axolotl',
      chineseName: '墨西哥鈍口螈',
      category: 'amphibian',
      careTypeKey: 'aquatic-amphibian',
      confidence: 'Needs review',
    },
    {
      id: 'python-regius',
      scientificName: 'Python regius',
      commonName: 'Ball Python',
      chineseName: '球蟒',
      category: 'snake',
      careTypeKey: 'snake',
      confidence: 'Needs review',
    },
    {
      id: 'trachemys-scripta',
      scientificName: 'Trachemys scripta',
      commonName: 'Red-Eared Slider',
      chineseName: '紅耳龜',
      category: 'turtle',
      careTypeKey: 'turtle',
      confidence: 'Needs review',
    },
    {
      id: 'pachnoda-marginata-larva',
      scientificName: 'Pachnoda marginata (larva)',
      commonName: 'Sun Beetle Larva',
      chineseName: '太陽花金龜幼蟲',
      category: 'beetle-larva',
      careTypeKey: 'beetle-larva',
      confidence: 'User custom',
    },
    {
      id: 'tarentola-mauritanica',
      scientificName: 'Tarentola mauritanica',
      commonName: 'Moorish Gecko',
      chineseName: '壁虎',
      category: 'gecko',
      careTypeKey: 'arboreal-gecko',
      confidence: 'User custom',
    },
  ];

  var FILTER_CHIPS = [
    { id: 'all', icon: '✦' },
    { id: 'gecko', icon: '🦎' },
    { id: 'snake', icon: '🐍' },
    { id: 'turtle', icon: '🐢' },
    { id: 'insect', icon: '🐛' },
    { id: 'beetle-larva', icon: '🪲' },
    { id: 'mantis', icon: '🦗' },
    { id: 'arachnid', icon: '🕷' },
    { id: 'aquatic', icon: '💧' },
    { id: 'custom', icon: '✎' },
  ];

  var CATEGORY_ICONS = {
    gecko: '🦎',
    snake: '🐍',
    turtle: '🐢',
    arachnid: '🕷',
    insect: '🐛',
    'beetle-larva': '🪲',
    mantis: '🦗',
    amphibian: '🦎',
    aquarium: '🐠',
    mammal: '🐿',
  };

  function mergeProfile(speciesEntry, careType) {
    if (!speciesEntry || !careType) return null;
    return {
      id: speciesEntry.id,
      scientificName: speciesEntry.scientificName,
      commonName: speciesEntry.commonName,
      chineseName: speciesEntry.chineseName,
      category: speciesEntry.category,
      careType: careType.careType,
      careTypeZh: careType.careTypeZh,
      careTypeKey: speciesEntry.careTypeKey,
      confidence: speciesEntry.confidence || 'Needs review',
      difficulty: careType.difficulty,
      mainFocus: careType.mainFocus.slice(),
      statusMeters: careType.statusMeters.slice(),
      dailyQuests: careType.dailyQuests.slice(),
      recordMenu: careType.recordMenu.slice(),
      starterQuests: (careType.starterQuests || []).slice(),
      recommendedRanges: JSON.parse(JSON.stringify(careType.recommendedRanges || {})),
    };
  }

  function getProfile(speciesId) {
    var entry = SPECIES.filter(function (s) {
      return s.id === speciesId;
    })[0];
    if (!entry) return null;
    var ct = CARE_TYPES[entry.careTypeKey];
    return mergeProfile(entry, ct);
  }

  function getCareTypeProfile(careTypeKey) {
    var ct = CARE_TYPES[careTypeKey];
    if (!ct) return null;
    return mergeProfile(
      {
        id: 'custom-' + careTypeKey,
        scientificName: '',
        commonName: ct.careType,
        chineseName: ct.careTypeZh,
        category: careTypeKey,
        careTypeKey: careTypeKey,
        confidence: 'User custom',
      },
      ct,
    );
  }

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normCompact(s) {
    return norm(s).replace(/[\s\-_'./·、，,()（）]/g, '');
  }

  function dedupeAliases_(arr) {
    var seen = {};
    return (arr || []).filter(function (a) {
      var k = normCompact(a);
      if (!k || seen[k]) return false;
      seen[k] = true;
      return true;
    });
  }

  function matchesFilter(speciesEntry, categoryFilter) {
    if (!categoryFilter || categoryFilter === 'all') return true;
    if (categoryFilter === 'custom') return speciesEntry.confidence === 'User custom';
    if (categoryFilter === 'aquatic') {
      return speciesEntry.category === 'amphibian' || speciesEntry.category === 'aquarium' || speciesEntry.careTypeKey === 'aquatic-amphibian' || speciesEntry.careTypeKey === 'aquarium';
    }
    if (categoryFilter === 'insect') {
      return speciesEntry.category === 'insect';
    }
    return speciesEntry.category === categoryFilter;
  }

  function speciesSearchFields(entry) {
    var fields = [entry.scientificName, entry.commonName, entry.chineseName, entry.id];
    if (Array.isArray(entry.aliases)) fields = fields.concat(entry.aliases);
    var sci = String(entry.scientificName || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    if (sci) {
      fields.push(sci);
      var parts = sci.split(/\s+/);
      if (parts[0]) fields.push(parts[0]);
      if (parts[1]) fields.push(parts[1]);
    }
    var ct = CARE_TYPES[entry.careTypeKey];
    if (ct) {
      fields.push(ct.careType, ct.careTypeZh);
    }
    return fields.filter(function (f) {
      return f && String(f).trim();
    });
  }

  function scoreSpeciesQuery(entry, q, qCompact) {
    var best = 0;
    var tokens = q.split(/\s+/).filter(Boolean);
    speciesSearchFields(entry).forEach(function (f) {
      var n = norm(f);
      var nc = normCompact(f);
      if (!n) return;
      if (nc === qCompact || n === q) best = Math.max(best, 100);
      else if (qCompact.length >= 2 && nc.indexOf(qCompact) === 0) best = Math.max(best, 85);
      else if (q.length >= 2 && n.indexOf(q) === 0) best = Math.max(best, 80);
      else if (qCompact.length >= 2 && nc.indexOf(qCompact) >= 0) best = Math.max(best, 65);
      else if (q.length >= 2 && n.indexOf(q) >= 0) best = Math.max(best, 60);
      if (tokens.length > 1) {
        var all = tokens.every(function (tok) {
          var tc = normCompact(tok);
          return n.indexOf(tok) >= 0 || nc.indexOf(tc) >= 0;
        });
        if (all) best = Math.max(best, 72);
      }
    });
    return best;
  }

  function matchesSpeciesQuery(entry, q, qCompact) {
    if (!q) return true;
    return scoreSpeciesQuery(entry, q, qCompact) > 0;
  }

  function normScientificKey(name) {
    return norm(String(name || '').replace(/\s*\([^)]*\)\s*/g, ' '));
  }

  function binomialKey(name) {
    var parts = normScientificKey(name).split(/\s+/).filter(Boolean);
    if (parts.length < 2) return normScientificKey(name);
    return parts[0] + ' ' + parts[1];
  }

  function findByScientificName(scientificName) {
    var key = binomialKey(scientificName);
    if (!key) return null;
    for (var i = 0; i < SPECIES.length; i++) {
      if (binomialKey(SPECIES[i].scientificName) === key) return SPECIES[i];
    }
    var genus = key.split(/\s+/)[0];
    if (!genus) return null;
    var genusHits = SPECIES.filter(function (s) {
      return binomialKey(s.scientificName).indexOf(genus + ' ') === 0;
    });
    return genusHits.length === 1 ? genusHits[0] : null;
  }

  function findByVernacular(query) {
    var q = norm(query);
    var qCompact = normCompact(query);
    if (!q && !qCompact) return null;
    var best = null;
    var bestScore = 0;
    SPECIES.forEach(function (s) {
      var score = scoreSpeciesQuery(s, q, qCompact);
      if (score > bestScore) {
        bestScore = score;
        best = s;
      }
    });
    return bestScore >= 85 ? best : null;
  }

  function mergeCatalogEntries_() {
    var cat = global.MCHusbandrySpeciesCatalog;
    if (!cat || !Array.isArray(cat.entries)) return;
    cat.entries.forEach(function (entry) {
      if (!entry || !entry.id) return;
      var exists = SPECIES.some(function (s) {
        return s.id === entry.id;
      });
      if (!exists) SPECIES.push(entry);
      else {
        for (var i = 0; i < SPECIES.length; i++) {
          if (SPECIES[i].id === entry.id) {
            if (entry.aliases && entry.aliases.length) {
              SPECIES[i].aliases = dedupeAliases_((SPECIES[i].aliases || []).concat(entry.aliases));
            }
            if (entry.chineseName) SPECIES[i].chineseName = entry.chineseName;
            if (entry.commonName) SPECIES[i].commonName = entry.commonName;
            if (entry.scientificName) SPECIES[i].scientificName = entry.scientificName;
            break;
          }
        }
      }
    });
  }

  mergeCatalogEntries_();

  function searchSpecies(query, categoryFilter) {
    var q = norm(query);
    var qCompact = normCompact(query);
    if (!q && !qCompact) return [];
    var scored = [];
    SPECIES.forEach(function (s) {
      if (!matchesFilter(s, categoryFilter)) return;
      if (!matchesSpeciesQuery(s, q, qCompact)) return;
      scored.push({ entry: s, score: scoreSpeciesQuery(s, q, qCompact) });
    });
    scored.sort(function (a, b) {
      return b.score - a.score || String(a.entry.chineseName || a.entry.commonName).localeCompare(String(b.entry.chineseName || b.entry.commonName), 'zh-Hant');
    });
    return scored.map(function (row) {
      return row.entry;
    });
  }

  function getSpeciesIcon(category) {
    return CATEGORY_ICONS[category] || '🪴';
  }

  global.MCSpeciesCareProfiles = {
    careTypes: CARE_TYPES,
    species: SPECIES,
    categories: FILTER_CHIPS,
    filterChips: FILTER_CHIPS,
    getProfile: getProfile,
    getCareTypeProfile: getCareTypeProfile,
    searchSpecies: searchSpecies,
    findByScientificName: findByScientificName,
    findByVernacular: findByVernacular,
    getSpeciesIcon: getSpeciesIcon,
    listCareTypeKeys: function () {
      return Object.keys(CARE_TYPES);
    },
  };
})(typeof window !== 'undefined' ? window : this);
