/**
 * Husbandry Log — Care guide knowledge base
 * Scope: #section-husbandry-log only (via MCHusbandryCareGuide API)
 */
(function (global) {
  'use strict';

  var CATEGORY_IDS = [
    'amphibians',
    'insects_beetles',
    'reptiles',
    'freshwater_aquatics',
    'marine_aquatics',
    'birds',
    'small_mammals',
    'arthropod_exotics',
    'plants_terrarium',
    'general',
  ];

  var GUIDE_CONTENT_VERSION = 2;

  var ACCORDION_SECTIONS = [
    { id: 'quickstart', icon: 'spark', titleKey: 'guideAccQuickStart', summaryKey: 'guideAccQuickStart' },
    { id: 'dailycare', icon: 'check', titleKey: 'guideAccDailyCare', summaryKey: 'guideAccToday' },
    { id: 'weeklymonthly', icon: 'note', titleKey: 'guideAccWeeklyMonthly', summaryKey: 'guideAccWeeklyMonthly' },
    { id: 'environment', icon: 'thermometer', titleKey: 'guideAccEnv', summaryKey: 'guideAccEnv' },
    { id: 'feeding', icon: 'feeding', titleKey: 'guideAccFeed', summaryKey: 'guideAccFeed' },
    { id: 'lifestage', icon: 'larva', titleKey: 'guideAccLifeStage', summaryKey: 'guideAccLifeStage' },
    { id: 'health', icon: 'activity', titleKey: 'guideAccHealth', summaryKey: 'guideAccHealth' },
    { id: 'danger', icon: 'alert', titleKey: 'guideAccDanger', summaryKey: 'guideAccDanger' },
    { id: 'mistakes', icon: 'alert', titleKey: 'guideAccMistakes', summaryKey: 'guideAccMistakes' },
    { id: 'records', icon: 'check', titleKey: 'guideAccRecords', summaryKey: 'guideAccRecords' },
    { id: 'tutorial', icon: 'book', titleKey: 'guideAccTutorial', summaryKey: 'guideAccTutorial' },
    { id: 'disclaimer', icon: 'note', titleKey: 'guideAccDisclaimer', summaryKey: 'guideAccDisclaimer' },
  ];

  var GUIDE_QUEST_RECORDS = {
    GUIDE_CHECK_HUMIDITY: 'humidity',
    GUIDE_CHECK_SKIN: 'skin',
    GUIDE_CHECK_FEEDING: 'feeding',
    GUIDE_REMOVE_UNEATEN: 'feeding',
    GUIDE_CHECK_HIDE_SUBSTRATE: 'substrate',
    GUIDE_CHECK_WATER_TEMP: 'water_temp',
    GUIDE_CHECK_GILLS: 'gill',
    GUIDE_CHECK_WATER_QUALITY: 'ph',
    GUIDE_CHECK_SUBSTRATE: 'substrate',
    GUIDE_CHECK_JELLY_DRY: 'feeding',
    GUIDE_CHECK_ACTIVITY: 'insect_status',
    GUIDE_REMOVE_MOLDY_FOOD: 'feeding',
    GUIDE_CHECK_UPSIDE_DOWN: 'insect_status',
    GUIDE_CHECK_SUBSTRATE_MOISTURE: 'substrate',
    GUIDE_CHECK_MOLD: 'substrate',
    GUIDE_CHECK_LARVA_ACTIVITY: 'frass',
    GUIDE_LOG_WEIGHT_DUE: 'weight',
    GUIDE_PUPA_QUIET: 'pupation',
    GUIDE_CHECK_VENTILATION: 'note',
    GUIDE_CHECK_MOLT_SPACE: 'instar',
    GUIDE_CHECK_MOLT_SIGNS: 'instar',
    GUIDE_REFRESH_FOOD_PLANT: 'feeding',
    GUIDE_LOG_EGGS: 'egg_laying',
    GUIDE_CHECK_NEST_HUMIDITY: 'humidity',
    GUIDE_CHECK_ESCAPE_PROOF: 'note',
    GUIDE_CHECK_QUEEN: 'insect_status',
    GUIDE_COUNT_BROOD: 'note',
    GUIDE_MINIMIZE_VIBRATION: 'note',
    GUIDE_OBSERVE_EGG_LAYING: 'egg_laying',
    GUIDE_WATCH_PAIR_BEHAVIOR: 'insect_status',
    GUIDE_CHECK_TEMP_GRADIENT: 'hotspot',
    GUIDE_CHECK_SHED_RETENTION: 'shedding',
    GUIDE_CHECK_STOOL: 'stool',
    GUIDE_CHECK_HOT_COLD: 'hotspot',
    GUIDE_CHECK_HIDE: 'note',
    GUIDE_CHECK_FEEDING_SCHEDULE: 'feeding',
    GUIDE_CHECK_SHEDDING: 'shedding',
    GUIDE_CHECK_UVB: 'uvb',
    GUIDE_CHECK_BASKING: 'basking',
    GUIDE_CHECK_CALCIUM: 'calcium',
    GUIDE_CHECK_SOAK: 'basking',
    GUIDE_CHECK_SHELL: 'shell',
    GUIDE_CHECK_FILTER_QUALITY: 'water_change',
    GUIDE_CHECK_SHELL_EYES: 'shell',
    GUIDE_CHECK_RESPIRATION: 'activity',
    GUIDE_CHECK_WATER_STABILITY: 'ph',
    GUIDE_CHECK_MOLT: 'molt',
    GUIDE_MINIMIZE_STRESS: 'note',
    GUIDE_CHECK_AGGRESSION: 'activity',
    GUIDE_CHECK_LIGHTING: 'uvb',
    GUIDE_CHECK_CO2: 'note',
    GUIDE_CHECK_ALGAE: 'abnormality',
    GUIDE_CHECK_TRIM: 'note',
    GUIDE_CHECK_SALINITY: 'salinity',
    GUIDE_CHECK_MARINE_SURFACE: 'skin',
    GUIDE_CHECK_SKIMMER_FILTER: 'note',
    GUIDE_CHECK_FLOW: 'water_flow',
    GUIDE_CHECK_AQUARIUM_LIGHT: 'aquarium_light',
    GUIDE_CHECK_ALKALINITY_MINERALS: 'kh',
    GUIDE_CHECK_CORAL_OPEN: 'coral_open',
    GUIDE_CHECK_ANEMONE_TENTACLES: 'coral_open',
    GUIDE_CHECK_ANEMONE_POSITION: 'activity',
    GUIDE_CHECK_SHELL_OPTIONS: 'note',
    GUIDE_CHECK_NUTRIENTS: 'nitrate',
    GUIDE_CHECK_EQUIPMENT: 'note',
    GUIDE_CHECK_FOOD_WATER: 'feeding',
    GUIDE_CHECK_DROPPINGS: 'stool',
    GUIDE_CHECK_FEATHERS_SPIRIT: 'feather',
    GUIDE_CLEAN_TRAY: 'cage_clean',
    GUIDE_CHECK_CAGE_SAFETY: 'note',
    GUIDE_CHECK_TOYS_CHEW: 'note',
    GUIDE_CHECK_SOCIAL: 'activity',
    GUIDE_CHECK_WARMTH: 'temperature',
    GUIDE_CHECK_FEEDING_FREQUENCY: 'feeding',
    GUIDE_CHECK_CROP: 'crop',
    GUIDE_CHECK_WEIGHT: 'weight',
    GUIDE_CHECK_DRINKING: 'drinking',
    GUIDE_CHECK_WHEEL_SAFETY: 'note',
    GUIDE_CHECK_SUBSTRATE_DROPPINGS: 'stool',
    GUIDE_CHECK_HAY: 'feeding',
    GUIDE_CHECK_TEETH: 'teeth',
    GUIDE_CHECK_FUR: 'fur',
    GUIDE_CHECK_TEMPERATURE: 'temperature',
    GUIDE_CHECK_FOOT_PADS: 'skin',
    GUIDE_CHECK_DUST_BATH: 'cage_clean',
    GUIDE_CHECK_MAMMAL_ACTIVITY: 'activity',
    GUIDE_CHECK_WATER_DISH: 'substrate',
    GUIDE_CHECK_PREMOLT: 'premolt',
    GUIDE_CHECK_WET_DRY_ZONE: 'humidity',
    GUIDE_CHECK_LEAF_LITTER: 'substrate',
    GUIDE_CHECK_COLONY_DENSITY: 'note',
    GUIDE_CHECK_FRESH_SALT_WATER: 'note',
    GUIDE_CHECK_DEEP_SUBSTRATE: 'substrate',
    GUIDE_CHECK_PLANT_STATUS: 'plant_status',
  };

  var DAILY_TASK_LAND_AMPHIBIAN = [
    'GUIDE_CHECK_HUMIDITY',
    'GUIDE_CHECK_SKIN',
    'GUIDE_CHECK_FEEDING',
    'GUIDE_REMOVE_UNEATEN',
    'GUIDE_CHECK_HIDE_SUBSTRATE',
  ];

  var DAILY_TASK_AQUATIC_AMPHIBIAN = [
    'GUIDE_CHECK_WATER_TEMP',
    'GUIDE_CHECK_GILLS',
    'GUIDE_REMOVE_UNEATEN',
    'GUIDE_CHECK_WATER_QUALITY',
    'GUIDE_CHECK_FEEDING',
  ];

  var DAILY_TASK_BEETLE_ADULT = [
    'GUIDE_CHECK_JELLY_DRY',
    'GUIDE_CHECK_HUMIDITY',
    'GUIDE_CHECK_ACTIVITY',
    'GUIDE_CHECK_UPSIDE_DOWN',
    'GUIDE_REMOVE_MOLDY_FOOD',
  ];

  var DAILY_TASK_BEETLE_LARVA = [
    'GUIDE_CHECK_SUBSTRATE',
    'GUIDE_CHECK_HUMIDITY',
    'GUIDE_LOG_WEIGHT_DUE',
    'GUIDE_CHECK_MOLD',
    'GUIDE_PUPA_QUIET',
  ];

  var DAILY_TASK_REPTILE = [
    'GUIDE_CHECK_HOT_COLD',
    'GUIDE_CHECK_HUMIDITY',
    'GUIDE_CHECK_UVB',
    'GUIDE_CHECK_FEEDING',
    'GUIDE_CHECK_STOOL',
  ];

  var DAILY_TASK_FRESHWATER = [
    'GUIDE_CHECK_WATER_TEMP',
    'GUIDE_CHECK_FEEDING',
    'GUIDE_CHECK_RESPIRATION',
    'GUIDE_REMOVE_UNEATEN',
    'GUIDE_CHECK_WATER_QUALITY',
  ];

  var DAILY_TASK_MARINE = [
    'GUIDE_CHECK_WATER_TEMP',
    'GUIDE_CHECK_SALINITY',
    'GUIDE_CHECK_MARINE_SURFACE',
    'GUIDE_CHECK_SKIMMER_FILTER',
    'GUIDE_CHECK_ALKALINITY_MINERALS',
  ];

  var DAILY_TASK_BIRD = [
    'GUIDE_CHECK_FOOD_WATER',
    'GUIDE_CHECK_DROPPINGS',
    'GUIDE_CHECK_FEATHERS_SPIRIT',
    'GUIDE_CLEAN_TRAY',
    'GUIDE_CHECK_CAGE_SAFETY',
  ];

  var DAILY_TASK_MAMMAL = [
    'GUIDE_CHECK_DRINKING',
    'GUIDE_CHECK_FEEDING',
    'GUIDE_CHECK_MAMMAL_ACTIVITY',
    'GUIDE_CHECK_SUBSTRATE_DROPPINGS',
    'GUIDE_CHECK_WHEEL_SAFETY',
  ];

  var DAILY_TASK_ARTHROPOD = [
    'GUIDE_CHECK_HUMIDITY',
    'GUIDE_CHECK_ESCAPE_PROOF',
    'GUIDE_REMOVE_UNEATEN',
    'GUIDE_CHECK_MOLT_SIGNS',
    'GUIDE_CHECK_HIDE',
  ];

  var DAILY_TASK_TERRARIUM = [
    'GUIDE_CHECK_PLANT_STATUS',
    'GUIDE_CHECK_HUMIDITY',
    'GUIDE_CHECK_CO2',
    'GUIDE_CHECK_ALGAE',
    'GUIDE_CHECK_TRIM',
  ];

  var DAILY_TASK_GENERAL = [
    'GUIDE_CHECK_FEEDING',
    'GUIDE_CHECK_HUMIDITY',
    'GUIDE_CHECK_TEMPERATURE',
    'GUIDE_CHECK_ACTIVITY',
    'GUIDE_CHECK_HIDE',
  ];

  var DAILY_TASK_BY_CATEGORY = {
    amphibians: DAILY_TASK_LAND_AMPHIBIAN,
    reptiles: DAILY_TASK_REPTILE,
    freshwater_aquatics: DAILY_TASK_FRESHWATER,
    marine_aquatics: DAILY_TASK_MARINE,
    birds: DAILY_TASK_BIRD,
    small_mammals: DAILY_TASK_MAMMAL,
    arthropod_exotics: DAILY_TASK_ARTHROPOD,
    plants_terrarium: DAILY_TASK_TERRARIUM,
    general: DAILY_TASK_GENERAL,
  };

  var CANONICAL_LIFE_STAGES = [
    'egg', 'larva', 'nymph', 'juvenile', 'subadult', 'adult', 'senior', 'pupa', 'breeding', 'unknown',
  ];

  var LIFE_STAGE_TASKS = {
    beetle: {
      egg: ['GUIDE_LOG_EGGS', 'GUIDE_CHECK_SUBSTRATE', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_MINIMIZE_VIBRATION'],
      larva: ['GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_SUBSTRATE', 'GUIDE_CHECK_MOLD', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_LARVA_ACTIVITY'],
      pupa: ['GUIDE_PUPA_QUIET', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_SUBSTRATE'],
      nymph: ['GUIDE_CHECK_MOLT_SIGNS', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_HUMIDITY'],
      juvenile: ['GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_SUBSTRATE', 'GUIDE_CHECK_MOLD'],
      subadult: ['GUIDE_CHECK_JELLY_DRY', 'GUIDE_CHECK_ACTIVITY', 'GUIDE_CHECK_UPSIDE_DOWN'],
      adult: ['GUIDE_CHECK_JELLY_DRY', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_ACTIVITY', 'GUIDE_CHECK_UPSIDE_DOWN', 'GUIDE_REMOVE_MOLDY_FOOD'],
      breeding: ['GUIDE_WATCH_PAIR_BEHAVIOR', 'GUIDE_OBSERVE_EGG_LAYING', 'GUIDE_CHECK_JELLY_DRY', 'GUIDE_CHECK_ACTIVITY', 'GUIDE_CHECK_UPSIDE_DOWN'],
      senior: ['GUIDE_CHECK_ACTIVITY', 'GUIDE_CHECK_JELLY_DRY', 'GUIDE_CHECK_HUMIDITY'],
      unknown: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_ACTIVITY'],
    },
    reptile: {
      egg: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_HIDE', 'GUIDE_MINIMIZE_VIBRATION'],
      juvenile: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_CALCIUM', 'GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_HOT_COLD'],
      nymph: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_MOLT_SIGNS', 'GUIDE_CHECK_HUMIDITY'],
      subadult: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_HOT_COLD', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_LOG_WEIGHT_DUE'],
      adult: ['GUIDE_CHECK_HOT_COLD', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_UVB', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_STOOL'],
      breeding: ['GUIDE_OBSERVE_EGG_LAYING', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_STOOL', 'GUIDE_CHECK_HOT_COLD', 'GUIDE_LOG_WEIGHT_DUE'],
      senior: ['GUIDE_CHECK_ACTIVITY', 'GUIDE_CHECK_FEEDING', 'GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_STOOL'],
      larva: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_FEEDING'],
      pupa: ['GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_HUMIDITY'],
      unknown: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_HUMIDITY'],
    },
    bird: {
      egg: ['GUIDE_CHECK_NEST_HUMIDITY', 'GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_HUMIDITY'],
      juvenile: ['GUIDE_CHECK_FOOD_WATER', 'GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_DROPPINGS', 'GUIDE_CHECK_CAGE_SAFETY', 'GUIDE_CHECK_HUMIDITY'],
      nymph: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_MOLT_SIGNS'],
      subadult: ['GUIDE_CHECK_FOOD_WATER', 'GUIDE_CHECK_FEATHERS_SPIRIT', 'GUIDE_LOG_WEIGHT_DUE'],
      adult: ['GUIDE_CHECK_FOOD_WATER', 'GUIDE_CHECK_DROPPINGS', 'GUIDE_CHECK_FEATHERS_SPIRIT', 'GUIDE_CLEAN_TRAY', 'GUIDE_CHECK_CAGE_SAFETY'],
      breeding: ['GUIDE_OBSERVE_EGG_LAYING', 'GUIDE_CHECK_FOOD_WATER', 'GUIDE_CHECK_DROPPINGS', 'GUIDE_CHECK_CAGE_SAFETY'],
      senior: ['GUIDE_CHECK_ACTIVITY', 'GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_DROPPINGS'],
      larva: ['GUIDE_CHECK_FOOD_WATER', 'GUIDE_LOG_WEIGHT_DUE'],
      pupa: ['GUIDE_MINIMIZE_VIBRATION'],
      unknown: ['GUIDE_CHECK_FOOD_WATER', 'GUIDE_CHECK_DROPPINGS'],
    },
    freshwater: {
      egg: ['GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_WATER_QUALITY', 'GUIDE_MINIMIZE_STRESS'],
      juvenile: ['GUIDE_CHECK_WATER_QUALITY', 'GUIDE_CHECK_WATER_TEMP', 'GUIDE_REMOVE_UNEATEN', 'GUIDE_CHECK_RESPIRATION'],
      nymph: ['GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_FEEDING'],
      subadult: ['GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_WATER_QUALITY'],
      adult: ['GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_RESPIRATION', 'GUIDE_CHECK_WATER_QUALITY', 'GUIDE_REMOVE_UNEATEN'],
      breeding: ['GUIDE_CHECK_WATER_QUALITY', 'GUIDE_CHECK_FEEDING', 'GUIDE_MINIMIZE_STRESS'],
      senior: ['GUIDE_CHECK_RESPIRATION', 'GUIDE_CHECK_WATER_QUALITY', 'GUIDE_CHECK_FEEDING'],
      larva: ['GUIDE_CHECK_WATER_QUALITY', 'GUIDE_CHECK_WATER_TEMP'],
      pupa: ['GUIDE_MINIMIZE_STRESS', 'GUIDE_CHECK_WATER_TEMP'],
      unknown: ['GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_WATER_QUALITY'],
    },
    marine: {
      egg: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_WATER_TEMP', 'GUIDE_MINIMIZE_STRESS'],
      juvenile: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_ALKALINITY_MINERALS', 'GUIDE_CHECK_MARINE_SURFACE'],
      nymph: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_WATER_TEMP'],
      subadult: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_ALKALINITY_MINERALS'],
      adult: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_MARINE_SURFACE', 'GUIDE_CHECK_SKIMMER_FILTER', 'GUIDE_CHECK_ALKALINITY_MINERALS'],
      breeding: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_WATER_QUALITY', 'GUIDE_MINIMIZE_STRESS'],
      senior: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_RESPIRATION', 'GUIDE_CHECK_MARINE_SURFACE'],
      larva: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_WATER_TEMP'],
      pupa: ['GUIDE_MINIMIZE_STRESS', 'GUIDE_CHECK_SALINITY'],
      unknown: ['GUIDE_CHECK_SALINITY', 'GUIDE_CHECK_WATER_TEMP'],
    },
    mammal: {
      egg: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_MINIMIZE_VIBRATION'],
      juvenile: ['GUIDE_CHECK_DRINKING', 'GUIDE_CHECK_FEEDING', 'GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_MAMMAL_ACTIVITY'],
      nymph: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_MOLT_SIGNS'],
      subadult: ['GUIDE_CHECK_DRINKING', 'GUIDE_CHECK_FEEDING', 'GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_MAMMAL_ACTIVITY'],
      adult: ['GUIDE_CHECK_DRINKING', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_MAMMAL_ACTIVITY', 'GUIDE_CHECK_SUBSTRATE_DROPPINGS', 'GUIDE_CHECK_WHEEL_SAFETY'],
      breeding: ['GUIDE_CHECK_FEEDING', 'GUIDE_LOG_EGGS', 'GUIDE_CHECK_MAMMAL_ACTIVITY'],
      senior: ['GUIDE_CHECK_MAMMAL_ACTIVITY', 'GUIDE_LOG_WEIGHT_DUE', 'GUIDE_CHECK_FEEDING'],
      larva: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_HUMIDITY'],
      pupa: ['GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_HUMIDITY'],
      unknown: ['GUIDE_CHECK_DRINKING', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_MAMMAL_ACTIVITY'],
    },
    amphibian: {
      egg: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_HIDE_SUBSTRATE'],
      juvenile: ['GUIDE_CHECK_WATER_QUALITY', 'GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_GILLS', 'GUIDE_MINIMIZE_STRESS'],
      nymph: ['GUIDE_CHECK_WATER_TEMP', 'GUIDE_CHECK_GILLS'],
      subadult: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_SKIN', 'GUIDE_CHECK_FEEDING'],
      adult: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_SKIN', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_ACTIVITY', 'GUIDE_REMOVE_UNEATEN'],
      breeding: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_LOG_EGGS', 'GUIDE_CHECK_FEEDING'],
      senior: ['GUIDE_CHECK_ACTIVITY', 'GUIDE_CHECK_SKIN', 'GUIDE_CHECK_FEEDING'],
      larva: ['GUIDE_CHECK_WATER_QUALITY', 'GUIDE_CHECK_GILLS'],
      pupa: ['GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_HUMIDITY'],
      unknown: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_FEEDING'],
    },
    amphibian_land: {
      egg: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_HIDE_SUBSTRATE'],
      juvenile: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_SKIN', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_ACTIVITY'],
      nymph: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_FEEDING'],
      subadult: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_SKIN', 'GUIDE_CHECK_FEEDING'],
      adult: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_SKIN', 'GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_ACTIVITY', 'GUIDE_REMOVE_UNEATEN'],
      breeding: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_LOG_EGGS', 'GUIDE_CHECK_FEEDING'],
      senior: ['GUIDE_CHECK_ACTIVITY', 'GUIDE_CHECK_SKIN', 'GUIDE_CHECK_FEEDING'],
      larva: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_SKIN'],
      pupa: ['GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_HUMIDITY'],
      unknown: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_FEEDING'],
    },
    general: {
      egg: ['GUIDE_CHECK_HUMIDITY', 'GUIDE_MINIMIZE_VIBRATION'],
      larva: ['GUIDE_CHECK_SUBSTRATE', 'GUIDE_CHECK_HUMIDITY'],
      nymph: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_HUMIDITY'],
      juvenile: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_ACTIVITY'],
      subadult: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_TEMPERATURE', 'GUIDE_CHECK_ACTIVITY'],
      adult: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_HUMIDITY', 'GUIDE_CHECK_TEMPERATURE', 'GUIDE_CHECK_ACTIVITY'],
      breeding: ['GUIDE_CHECK_FEEDING', 'GUIDE_LOG_EGGS'],
      senior: ['GUIDE_CHECK_ACTIVITY', 'GUIDE_CHECK_FEEDING'],
      pupa: ['GUIDE_MINIMIZE_VIBRATION', 'GUIDE_CHECK_HUMIDITY'],
      unknown: ['GUIDE_CHECK_FEEDING', 'GUIDE_CHECK_ACTIVITY'],
    },
  };

  var LIFE_STAGE_RECORDS = {
    beetle: {
      egg: ['photo', 'note', 'humidity', 'substrate', 'egg_laying'],
      larva: ['weight', 'substrate', 'frass', 'humidity', 'substrate_change', 'instar', 'molt'],
      pupa: ['pupation', 'humidity', 'photo', 'note'],
      nymph: ['instar', 'feeding', 'molt', 'photo'],
      juvenile: ['weight', 'substrate', 'humidity', 'frass'],
      subadult: ['feeding', 'insect_status', 'humidity', 'photo'],
      adult: ['feeding', 'humidity', 'insect_status', 'substrate', 'photo'],
      breeding: ['egg_laying', 'feeding', 'insect_status', 'photo', 'note'],
      senior: ['insect_status', 'feeding', 'humidity', 'photo'],
      unknown: ['photo', 'note', 'humidity'],
    },
    reptile: {
      egg: ['photo', 'humidity', 'temperature', 'note'],
      juvenile: ['weight', 'feeding', 'calcium', 'hotspot', 'humidity', 'shedding'],
      nymph: ['instar', 'feeding', 'humidity'],
      subadult: ['weight', 'feeding', 'hotspot', 'humidity', 'shedding'],
      adult: ['weight', 'feeding', 'hotspot', 'humidity', 'uvb', 'calcium', 'shedding', 'stool'],
      breeding: ['egg_laying', 'weight', 'feeding', 'photo', 'stool'],
      senior: ['weight', 'stool', 'activity', 'feeding'],
      larva: ['weight', 'feeding'],
      pupa: ['photo', 'humidity'],
      unknown: ['photo', 'feeding', 'weight'],
    },
    bird: {
      egg: ['photo', 'humidity', 'note', 'egg_laying'],
      juvenile: ['weight', 'feeding', 'crop', 'stool', 'temperature', 'activity'],
      nymph: ['feeding', 'instar', 'photo'],
      subadult: ['weight', 'feeding', 'feather', 'stool'],
      adult: ['weight', 'feeding', 'feather', 'stool', 'activity', 'cage_clean'],
      breeding: ['egg_laying', 'weight', 'feeding', 'stool', 'photo'],
      senior: ['weight', 'stool', 'activity', 'feeding'],
      larva: ['weight', 'feeding'],
      pupa: ['photo'],
      unknown: ['weight', 'feeding', 'stool'],
    },
    freshwater: {
      egg: ['photo', 'water_temp', 'ph', 'note'],
      juvenile: ['water_temp', 'ph', 'ammonia', 'nitrite', 'feeding', 'activity'],
      nymph: ['water_temp', 'feeding'],
      subadult: ['water_temp', 'ph', 'feeding', 'activity'],
      adult: ['water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'feeding', 'activity'],
      breeding: ['water_temp', 'ph', 'feeding', 'egg_laying', 'photo'],
      senior: ['water_temp', 'activity', 'feeding'],
      larva: ['water_temp', 'ph'],
      pupa: ['photo'],
      unknown: ['water_temp', 'ph', 'feeding'],
    },
    marine: {
      egg: ['photo', 'salinity', 'water_temp', 'note'],
      juvenile: ['salinity', 'water_temp', 'ph', 'kh', 'ca', 'mg', 'feeding'],
      nymph: ['salinity', 'water_temp'],
      subadult: ['salinity', 'water_temp', 'kh', 'ca', 'mg', 'feeding'],
      adult: ['salinity', 'water_temp', 'ph', 'kh', 'ca', 'mg', 'nitrate', 'po4', 'coral_open'],
      breeding: ['salinity', 'water_temp', 'feeding', 'egg_laying', 'photo'],
      senior: ['salinity', 'water_temp', 'activity', 'feeding'],
      larva: ['salinity', 'water_temp'],
      pupa: ['photo', 'salinity'],
      unknown: ['salinity', 'water_temp', 'feeding'],
    },
    mammal: {
      egg: ['photo', 'humidity', 'note'],
      juvenile: ['weight', 'feeding', 'drinking', 'stool', 'activity', 'fur'],
      nymph: ['feeding', 'instar'],
      subadult: ['weight', 'feeding', 'drinking', 'stool', 'activity'],
      adult: ['weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean'],
      breeding: ['egg_laying', 'weight', 'feeding', 'stool', 'photo'],
      senior: ['weight', 'stool', 'activity', 'feeding'],
      larva: ['weight', 'feeding'],
      pupa: ['photo', 'humidity'],
      unknown: ['weight', 'feeding', 'stool', 'activity'],
    },
    amphibian: {
      egg: ['photo', 'humidity', 'note'],
      juvenile: ['water_temp', 'ph', 'ammonia', 'gill', 'skin', 'activity'],
      nymph: ['water_temp', 'gill', 'skin'],
      subadult: ['humidity', 'skin', 'feeding', 'weight'],
      adult: ['humidity', 'skin', 'feeding', 'activity', 'stool', 'photo'],
      breeding: ['egg_laying', 'humidity', 'feeding', 'photo'],
      senior: ['activity', 'skin', 'feeding'],
      larva: ['water_temp', 'gill'],
      pupa: ['humidity', 'photo'],
      unknown: ['humidity', 'feeding', 'photo'],
    },
    amphibian_land: {
      egg: ['photo', 'humidity', 'note'],
      juvenile: ['humidity', 'skin', 'feeding', 'activity', 'photo'],
      nymph: ['humidity', 'feeding'],
      subadult: ['humidity', 'skin', 'feeding', 'activity'],
      adult: ['humidity', 'skin', 'feeding', 'activity', 'stool', 'photo'],
      breeding: ['egg_laying', 'humidity', 'feeding', 'photo'],
      senior: ['activity', 'skin', 'feeding'],
      larva: ['humidity', 'skin'],
      pupa: ['humidity', 'photo'],
      unknown: ['humidity', 'feeding', 'photo'],
    },
    general: {
      egg: ['photo', 'note', 'humidity'],
      larva: ['weight', 'substrate', 'photo'],
      nymph: ['feeding', 'instar'],
      juvenile: ['photo', 'feeding', 'weight', 'humidity'],
      subadult: ['photo', 'feeding', 'weight'],
      adult: ['photo', 'feeding', 'weight', 'activity'],
      breeding: ['egg_laying', 'photo', 'feeding'],
      senior: ['weight', 'activity', 'feeding'],
      pupa: ['photo', 'humidity'],
      unknown: ['photo', 'note', 'feeding'],
    },
  };

  function resolveCanonicalLifeStage_(pet, guide, state) {
    if (!pet) return 'unknown';
    if (state && activePairForPet_(state, pet.id)) return 'breeding';
    if (pet.lifeStage === 'breeding') return 'breeding';
    if (pet.lifeStage && CANONICAL_LIFE_STAGES.indexOf(pet.lifeStage) >= 0) {
      if (pet.lifeStage !== 'juvenile' && pet.lifeStage !== 'unknown') return pet.lifeStage;
    }
    var blob = [
      pet.lifeStage,
      pet.instarLabel,
      pet.profileNote,
    ].join(' ').toLowerCase();
    if (pet.lifeStage === 'egg' || /(^|\s)egg(\s|$)|卵/.test(blob)) return 'egg';
    if (pet.lifeStage === 'pupa' || /pupa|蛹|pupation|化蛹|pre_pupa/.test(blob)) return 'pupa';
    if (pet.lifeStage === 'larva' || /^l[123]$/.test(String(pet.instarLabel || '').trim()) ||
        /幼蟲|larva|grub/.test(blob)) return 'larva';
    if (pet.lifeStage === 'nymph' || /nymph|若蟲/.test(blob)) return 'nymph';
    if (pet.lifeStage === 'senior') return 'senior';
    if (pet.lifeStage === 'subadult') return 'subadult';
    if (pet.lifeStage === 'adult' || /成蟲|成体|成體|adult/.test(blob)) return 'adult';
    var gid = guide && guide.id ? guide.id : '';
    if (gid === 'chick_general') return 'juvenile';
    if (/beetle_larva/.test(gid)) return 'larva';
    if (/beetle_adult/.test(gid)) return pet.lifeStage === 'subadult' ? 'subadult' : 'adult';
    if (pet.lifeStage === 'juvenile') return 'juvenile';
    if (pet.lifeStage === 'unknown') return 'unknown';
    return pet.lifeStage || 'juvenile';
  }

  function lifeStageProfileKey_(pet, guide) {
    if (!guide) return 'general';
    var gid = guide.id || '';
    var stage = resolveCanonicalLifeStage_(pet, guide, null);
    if (/beetle_larva/.test(gid) || (guide.category === 'insects_beetles' && stage === 'larva')) return 'beetle';
    if (/beetle_adult/.test(gid) || guide.category === 'insects_beetles') return 'beetle';
    if (guide.category === 'reptiles') return 'reptile';
    if (guide.category === 'birds') return 'bird';
    if (guide.category === 'freshwater_aquatics') return 'freshwater';
    if (guide.category === 'marine_aquatics') return 'marine';
    if (guide.category === 'small_mammals') return 'mammal';
    if (guide.category === 'arthropod_exotics') return 'arthropod';
    if (gid === 'aquatic_amphibian_general') return 'amphibian';
    if (guide.category === 'amphibians') return 'amphibian_land';
    return 'general';
  }

  function tipsFromI18nProfile_(h, profile, stage) {
    if (!h || typeof h.t !== 'function') return [];
    var key = 'guideLsTips_' + profile + '_' + stage;
    var raw = h.t(key);
    if (!raw || raw === key) return [];
    return String(raw).split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function getLifeStageTips_(state, pet, careGuide, h) {
    if (!pet) return [];
    var guide = careGuide;
    if (!guide && state && h) guide = getAppliedGuideForPet_(state, pet, h);
    if (!guide) return [];
    var stage = resolveCanonicalLifeStage_(pet, guide, state);
    var profile = lifeStageProfileKey_(pet, guide);
    var tips = tipsFromI18nProfile_(h, profile, stage).slice();
    var enriched = guide.lifeStageTips && guide.lifeStageTips[stage];
    if (enriched && enriched.length) {
      enriched.forEach(function (t) {
        if (t && tips.indexOf(t) < 0) tips.push(t);
      });
    }
    var note = lifeStageNoteForPet_(guide, pet, h);
    if (note && tips.indexOf(note) < 0) tips.unshift(note);
    if (stage === 'juvenile' && profile === 'bird' && h) {
      var risk = h.t('guideLsTips_bird_juvenile_risk');
      if (risk && risk !== 'guideLsTips_bird_juvenile_risk' && tips.indexOf(risk) < 0) tips.push(risk);
    }
    return tips;
  }

  function getLifeStageTasks_(state, pet, careGuide, h) {
    if (!pet) return [];
    var guide = careGuide;
    if (!guide && state && h) guide = getAppliedGuideForPet_(state, pet, h);
    var stage = resolveCanonicalLifeStage_(pet, guide, state);
    var profile = lifeStageProfileKey_(pet, guide);
    var profileTasks = LIFE_STAGE_TASKS[profile] || LIFE_STAGE_TASKS.general;
    var tasks = (profileTasks[stage] || profileTasks.juvenile || profileTasks.adult || []).slice();
    if (!guide) return tasks.slice(0, 5);
    if (state) {
      tasks = tasks.concat(breedingGuideQuestExtras_(state, pet, guide));
    }
    return uniqueQuestKeys_(filterQuestKeys_(guide, tasks)).slice(0, 7);
  }

  function getLifeStageRecommendedRecords_(state, pet, careGuide, h) {
    if (!pet) return [];
    var guide = careGuide;
    if (!guide && state && h) guide = getAppliedGuideForPet_(state, pet, h);
    var stage = resolveCanonicalLifeStage_(pet, guide, state);
    var profile = lifeStageProfileKey_(pet, guide);
    var profileRecs = LIFE_STAGE_RECORDS[profile] || LIFE_STAGE_RECORDS.general;
    var recs = (profileRecs[stage] || profileRecs.juvenile || profileRecs.adult || []).slice();
    if (!guide) return recs;
    return filterRecordsForGuide_(guide, recs);
  }

  function getLifeStageFocusTip_(state, pet, h) {
    var tips = getLifeStageTips_(state, pet, null, h);
    return tips.length ? tips[0] : '';
  }

  function renderLifeStageReminderCallout_(state, pet, guide, h) {
    if (!pet || !guide) return '';
    var stage = resolveCanonicalLifeStage_(pet, guide, state);
    var stageKey = 'guideLifeStage_' + stage;
    var stageLabel = h.t(stageKey) !== stageKey ? h.t(stageKey) : (
      h.t('wizardLifeStage_' + stage) !== 'wizardLifeStage_' + stage ? h.t('wizardLifeStage_' + stage) : stage
    );
    var tips = getLifeStageTips_(pet, guide, h, state);
    if (!tips.length) return '';
    var list = tips.slice(0, 5).map(function (tip) {
      return '<li>' + h.esc(tip) + '</li>';
    }).join('');
    return (
      '<div class="hlc-guide-lifestage-callout">' +
      '<p class="hlc-guide-lifestage-callout__title">' +
      h.esc(h.t('guideLifeStageReminderTitle')) +
      ' · <span class="hlc-guide-lifestage-callout__stage">' + h.esc(stageLabel) + '</span></p>' +
      '<ul class="hlc-guide-lifestage-callout__list">' + list + '</ul></div>'
    );
  }

  function taskTodayKey_(h) {
    if (h && h.todayKey) return h.todayKey();
    return new Date().toISOString().slice(0, 10);
  }

  function uniqueQuestKeys_(keys) {
    var out = [];
    (keys || []).forEach(function (k) {
      if (k && out.indexOf(k) < 0) out.push(k);
    });
    return out;
  }

  function petLifeStageKind_(pet) {
    return resolveCanonicalLifeStage_(pet, null, null);
  }

  function isBeetleLarvaPet_(pet, guide) {
    var gid = guide && guide.id ? guide.id : '';
    if (/beetle_larva|larva_general/.test(gid)) return true;
    if (guide && guide.category === 'insects_beetles' && petLifeStageKind_(pet) === 'larva') return true;
    return false;
  }

  function isBeetleAdultPet_(pet, guide) {
    var gid = guide && guide.id ? guide.id : '';
    if (/beetle_adult/.test(gid)) return true;
    if (guide && guide.category === 'insects_beetles' && !isBeetleLarvaPet_(pet, guide)) return true;
    return false;
  }

  function resolveDailyTaskTemplate_(pet, guide) {
    if (!guide) return DAILY_TASK_GENERAL.slice();
    var gid = guide.id || '';
    if (gid === 'aquatic_amphibian_general') return DAILY_TASK_AQUATIC_AMPHIBIAN.slice();
    if (gid === 'frog_general' || gid === 'toad_general') return DAILY_TASK_LAND_AMPHIBIAN.slice();
    if (isBeetleLarvaPet_(pet, guide)) {
      var larvaTasks = DAILY_TASK_BEETLE_LARVA.slice();
      if (petLifeStageKind_(pet) !== 'pupa') {
        larvaTasks = larvaTasks.filter(function (k) { return k !== 'GUIDE_PUPA_QUIET'; });
      }
      return larvaTasks;
    }
    if (isBeetleAdultPet_(pet, guide)) return DAILY_TASK_BEETLE_ADULT.slice();
    if (guide.category && DAILY_TASK_BY_CATEGORY[guide.category]) {
      return DAILY_TASK_BY_CATEGORY[guide.category].slice();
    }
    return DAILY_TASK_GENERAL.slice();
  }

  function buildTaskSignature_(pet, guide) {
    return [
      guide ? guide.id : '',
      guide ? guide.category : '',
      pet.lifeStage || '',
      pet.instarLabel || '',
      resolveCanonicalLifeStage_(pet, guide, null),
    ].join('|');
  }

  function customQuestKeysForPet_(pet) {
    return (pet.enabledQuestKeys || []).filter(function (k) {
      return String(k).indexOf('WIZARD_CUSTOM:') === 0;
    });
  }

  function buildDailyTasksForPet_(state, pet, careGuide, h) {
    return getLifeStageTasks_(state, pet, careGuide, h).slice(0, 5);
  }

  function syncCareGuideTasksToPet_(state, pet, h) {
    if (!pet) return [];
    if (h) ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    var newTasks = getLifeStageTasks_(state, pet, guide, h);
    var extras = breedingGuideQuestExtras_(state, pet, guide);
    if (guide) newTasks = filterQuestKeys_(guide, newTasks.concat(extras));
    else newTasks = newTasks.concat(extras);
    newTasks = uniqueQuestKeys_(newTasks.concat(customQuestKeysForPet_(pet))).slice(0, 7);

    var today = taskTodayKey_(h);
    var sig = buildTaskSignature_(pet, guide);

    if (pet.dailyTaskSignature === sig && pet.enabledQuestKeys && pet.enabledQuestKeys.length) {
      if (guide) return filterQuestKeys_(guide, pet.enabledQuestKeys).slice(0, 7);
      return pet.enabledQuestKeys.slice(0, 7);
    }

    if (pet.questProgress && pet.questProgress.date === today &&
        pet.dailyTaskSignature && pet.dailyTaskSignature !== sig) {
      var prevDone = pet.questProgress.done || [];
      var prevSkipped = pet.questProgress.skipped || [];
      pet.questProgress.done = prevDone.filter(function (k) { return newTasks.indexOf(k) >= 0; });
      pet.questProgress.skipped = prevSkipped.filter(function (k) { return newTasks.indexOf(k) >= 0; });
    }

    pet.enabledQuestKeys = newTasks.slice();
    pet.dailyTaskSignature = sig;
    pet.dailyTaskDate = today;
    return newTasks.slice();
  }

  function buildDailyTasksForAllPets_(state, pets, h) {
    var petList = petsArray_(pets || (state && state.pets));
    var out = {};
    petList.forEach(function (pet) {
      out[pet.id] = syncCareGuideTasksToPet_(state, pet, h);
    });
    return out;
  }

  var REC_LAND_AMPHIBIAN = [
    'photo', 'feeding', 'humidity', 'temperature', 'skin', 'activity', 'stool',
  ];

  var REC_AQUATIC_AMPHIBIAN = [
    'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'gill', 'skin',
  ];

  var REC_BEETLE_ADULT = [
    'feeding', 'humidity', 'insect_status', 'substrate', 'egg_laying', 'photo',
  ];

  var REC_BEETLE_LARVA = [
    'weight', 'substrate', 'humidity', 'substrate_change', 'molt', 'pupation',
  ];

  var REC_REPTILE = [
    'weight', 'feeding', 'hotspot', 'cold_zone', 'humidity', 'uvb', 'calcium', 'shedding', 'stool',
  ];

  var REC_FRESHWATER = [
    'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'feeding', 'activity',
  ];

  var REC_MARINE = [
    'salinity', 'water_temp', 'ph', 'kh', 'ca', 'mg', 'nitrate', 'po4', 'coral_open',
  ];

  var REC_BIRD = [
    'weight', 'feeding', 'drinking', 'feather', 'stool', 'activity', 'cage_clean',
  ];

  var REC_MAMMAL = [
    'weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean',
  ];

  var REC_ARTHROPOD = [
    'feeding', 'humidity', 'molt', 'insect_status', 'hiding', 'substrate', 'photo',
  ];

  var REC_TERRARIUM = [
    'photo', 'humidity', 'plant_status', 'substrate', 'aquarium_light', 'note',
  ];

  var REC_GENERAL = [
    'photo', 'feeding', 'weight', 'humidity', 'temperature', 'activity', 'note',
  ];

  var REC_BY_CATEGORY = {
    amphibians: REC_LAND_AMPHIBIAN,
    reptiles: REC_REPTILE,
    freshwater_aquatics: REC_FRESHWATER,
    marine_aquatics: REC_MARINE,
    birds: REC_BIRD,
    small_mammals: REC_MAMMAL,
    arthropod_exotics: REC_ARTHROPOD,
    plants_terrarium: REC_TERRARIUM,
    general: REC_GENERAL,
  };

  function resolveRecommendedRecordTemplate_(pet, guide) {
    if (!guide) return REC_GENERAL.slice();
    var gid = guide.id || '';
    if (gid === 'aquatic_amphibian_general') return REC_AQUATIC_AMPHIBIAN.slice();
    if (gid === 'frog_general' || gid === 'toad_general') return REC_LAND_AMPHIBIAN.slice();
    if (isBeetleLarvaPet_(pet, guide)) return REC_BEETLE_LARVA.slice();
    if (isBeetleAdultPet_(pet, guide)) return REC_BEETLE_ADULT.slice();
    if (guide.category && REC_BY_CATEGORY[guide.category]) {
      return REC_BY_CATEGORY[guide.category].slice();
    }
    return REC_GENERAL.slice();
  }

  function getRecommendedRecordTypesForPet_(state, pet, careGuide, h) {
    if (!pet) return [];
    if (h) ensureKnowledgeBase_(state, h);
    var guide = careGuide || getAppliedGuideForPet_(state, pet, h);
    if (pet.enabledRecordIds && pet.enabledRecordIds.length) {
      if (guide) return filterRecordsForGuide_(guide, pet.enabledRecordIds.slice());
      return pet.enabledRecordIds.slice();
    }
    var template = getLifeStageRecommendedRecords_(state, pet, guide, h);
    if (!guide) return template.slice();
    return filterRecordsForGuide_(guide, template);
  }

  function defaultCareGuideState_() {
    return {
      careGuides: {},
      careGuideCategories: CATEGORY_IDS.slice(),
      careGuideProgress: {},
      activeCareGuideId: null,
      activeCareGuideIds: [],
      activeCareCategories: [],
      careReminderSettings: {},
      selectedCareCategory: 'all',
      selectedCareDifficulty: 'all',
      selectedCareLifeStage: 'all',
      searchKeyword: '',
      browseGuideDetailId: null,
    };
  }

  function emptySectionBlock_() {
    return {
      summary: '',
      notes: '',
      ranges: null,
      items: [],
    };
  }

  function createEmptyCareGuide_(id, category) {
    var now = new Date().toISOString();
    return {
      id: id || '',
      category: category || 'general',
      group: category || 'general',
      commonNames: [],
      scientificKeywords: [],
      lifeStages: [],
      difficulty: '',
      suitableFor: [],
      notSuitableFor: [],
      title: '',
      summary: '',
      beginnerNotice: '',
      quickStart: null,
      environment: emptySectionBlock_(),
      feeding: emptySectionBlock_(),
      dailyCare: emptySectionBlock_(),
      weeklyCare: emptySectionBlock_(),
      monthlyCare: emptySectionBlock_(),
      lifeStageTips: {},
      waterQuality: emptySectionBlock_(),
      humidity: emptySectionBlock_(),
      temperature: emptySectionBlock_(),
      lighting: emptySectionBlock_(),
      substrate: emptySectionBlock_(),
      enclosure: emptySectionBlock_(),
      behavior: emptySectionBlock_(),
      health: emptySectionBlock_(),
      breeding: emptySectionBlock_(),
      commonMistakes: [],
      dangerSigns: [],
      recommendedRecords: [],
      suggestedTasks: [],
      tutorialSteps: [],
      setupChecklist: [],
      purchaseChecklist: [],
      faq: [],
      emergencyAdvice: [],
      disclaimer: '',
      recordHints: {},
      updatedAt: now,
    };
  }

  function migrateLegacyGuideState_(state) {
    if (!state.careGuide || typeof state.careGuide !== 'object') {
      state.careGuide = defaultCareGuideState_();
    }
    var cg = state.careGuide;
    if (!cg.careGuides || typeof cg.careGuides !== 'object') cg.careGuides = {};
    if (!Array.isArray(cg.careGuideCategories) || !cg.careGuideCategories.length) {
      cg.careGuideCategories = CATEGORY_IDS.slice();
    }
    if (!cg.careGuideProgress || typeof cg.careGuideProgress !== 'object') {
      cg.careGuideProgress = {};
    }
    if (typeof cg.activeCareGuideId !== 'string' && cg.activeCareGuideId !== null) {
      cg.activeCareGuideId = null;
    }
    if (!Array.isArray(cg.activeCareGuideIds)) cg.activeCareGuideIds = [];
    if (!Array.isArray(cg.activeCareCategories)) cg.activeCareCategories = [];
    if (!cg.careReminderSettings || typeof cg.careReminderSettings !== 'object') {
      cg.careReminderSettings = {};
    }
    if (!cg.selectedCareCategory) cg.selectedCareCategory = 'all';
    if (!cg.selectedCareDifficulty) cg.selectedCareDifficulty = 'all';
    if (!cg.selectedCareLifeStage) cg.selectedCareLifeStage = 'all';
    if (typeof cg.searchKeyword !== 'string') cg.searchKeyword = '';
    if (cg.browseGuideDetailId !== null && typeof cg.browseGuideDetailId !== 'string') {
      cg.browseGuideDetailId = null;
    }
    if (state.careGuides && typeof state.careGuides === 'object') {
      Object.keys(state.careGuides).forEach(function (k) {
        if (!cg.careGuides[k]) cg.careGuides[k] = state.careGuides[k];
      });
    }
    if (state.tutorialProgress && typeof state.tutorialProgress === 'object') {
      Object.keys(state.tutorialProgress).forEach(function (petId) {
        var leg = state.tutorialProgress[petId];
        if (!cg.careGuideProgress[petId]) {
          cg.careGuideProgress[petId] = {
            careGuideId: leg.careGuideId || null,
            completedStepIds: leg.completedStepIds || [],
            updatedAt: leg.updatedAt || new Date().toISOString(),
          };
        }
      });
    }
  }

  function seedGuidePack_(state, h, module, flagKey) {
    var cg = careGuideState_(state);
    if (cg[flagKey]) return;
    if (!module || typeof module.buildGuides !== 'function') return;
    var guides = module.buildGuides(h);
    Object.keys(guides).forEach(function (id) {
      if (!cg.careGuides[id]) cg.careGuides[id] = guides[id];
    });
    cg[flagKey] = true;
  }

  function ensureKnowledgeBase_(state, h) {
    if (!h || typeof h.t !== 'function') return;
    seedGuidePack_(state, h, global.MCHusbandryCareGuideAmphibians, '_amphibiansSeeded');
    seedGuidePack_(state, h, global.MCHusbandryCareGuideInsects, '_insectsSeeded');
    seedGuidePack_(state, h, global.MCHusbandryCareGuideReptiles, '_reptilesSeeded');
    seedGuidePack_(state, h, global.MCHusbandryCareGuideFreshwater, '_freshwaterSeeded');
    seedGuidePack_(state, h, global.MCHusbandryCareGuideMarine, '_marineSeeded');
    seedGuidePack_(state, h, global.MCHusbandryCareGuideBirds, '_birdsSeeded');
    seedGuidePack_(state, h, global.MCHusbandryCareGuideSmallMammals, '_smallMammalsSeeded');
    seedGuidePack_(state, h, global.MCHusbandryCareGuideArthropodTerrarium, '_arthropodTerrariumSeeded');
    seedGuidePack_(state, h, global.MCHusbandryCareGuideGeneral, '_generalSeeded');
    enrichAllGuides_(state, h);
  }

  function enrichAllGuides_(state, h) {
    var cg = careGuideState_(state);
    if (cg._guideContentVersion >= GUIDE_CONTENT_VERSION) return;
    var ENRICH = global.MCHusbandryCareGuideEnrich;
    if (!ENRICH || typeof ENRICH.enrichAllGuides !== 'function') return;
    cg.careGuides = ENRICH.enrichAllGuides(cg.careGuides, h);
    cg._guideContentVersion = GUIDE_CONTENT_VERSION;
  }

  function ensureState(state, h) {
    migrateLegacyGuideState_(state);
    if (!state.ui) state.ui = {};
    if (!Array.isArray(state.ui.guideAccordionOpen)) state.ui.guideAccordionOpen = [];
    if (h) {
      ensureKnowledgeBase_(state, h);
      syncActiveCareGuides_(state, h);
    }
  }

  function careGuideState_(state) {
    migrateLegacyGuideState_(state);
    return state.careGuide;
  }

  function inferCategoryForPet_(pet) {
    if (!pet) return 'general';
    var blob = [
      pet.category,
      pet.careTypeKey,
      pet.commonName,
      pet.chineseName,
      pet.scientificName,
      pet.petName,
    ].join(' ').toLowerCase();
    if (/amphibian|frog|toad|axolotl|salamander|兩棲|蛙/.test(blob)) return 'amphibians';
    if (/marine|salt|海水|珊瑚|海葵|anemone|reef|clownfish|小丑|寄居蟹|marine_aquatics/.test(blob)) {
      return 'marine_aquatics';
    }
    if (/shrimp|蝦|crayfish|螯蝦|planted tank|水草|freshwater|betta|guppy|tetra|淡水/.test(blob)) {
      return 'freshwater_aquatics';
    }
    if (/aquarium|fish|魚/.test(blob) && !/marine|salt|海水/.test(blob)) return 'freshwater_aquatics';
    if (/chick|幼鳥|raptor|猛禽|owl|hawk|eagle|finch|文鳥|parrot|鸚鵡|cockatiel|budgie|bird|鳥|canary|sparrow/.test(blob)) {
      return 'birds';
    }
    if (/rabbit|兔子|hamster|倉鼠|guinea pig|天竺鼠|hedgehog|刺蝟|sugar glider|蜜袋鼯|chinchilla|龍貓|gerbil|沙鼠|mouse|小鼠|rat|大鼠|small mammal|small_mammals/.test(blob)) {
      return 'small_mammals';
    }
    if (/land hermit|陸寄居蟹|tarantula|捕鳥蛛|scorpion|蠍|centipede|蜈蚣|isopod|等足|鼠婦|潮蟲|millipede|馬陸/.test(blob)) {
      return 'arthropod_exotics';
    }
    if (/terrarium|vivarium|生態缸|雨林缸|bioactive|plant|食蟲植物|蘭花|moss|植物/.test(blob) && !/planted tank|水草/.test(blob)) {
      return 'plants_terrarium';
    }
    if (/gecko|snake|turtle|reptile|爬|守宮/.test(blob)) return 'reptiles';
    if (/beetle|insect|mantis|larva|昆蟲|甲蟲|螳螂/.test(blob)) return 'insects_beetles';
    return 'general';
  }

  function matchCareGuide_(pet) {
    var MATCH = global.MCHusbandryCareGuideMatcher;
    if (MATCH && typeof MATCH.matchCareGuide === 'function') {
      return MATCH.matchCareGuide(pet);
    }
    return 'general_care';
  }

  function matchCareGuideForPet_(pet) {
    if (!pet) return 'general_care';
    if (pet.careGuideId) return pet.careGuideId;
    return matchCareGuide_(pet);
  }

  function petsArray_(pets) {
    if (Array.isArray(pets)) return pets.filter(Boolean);
    return [];
  }

  function explicitGuideIdForPet_(pet) {
    if (!pet || !pet.careGuideId) return null;
    return pet.careGuideId;
  }

  function syncActiveCareGuides_(state, h, pets) {
    if (state && state.phase === 'wizard') {
      return careGuideState_(state);
    }
    if (h) ensureKnowledgeBase_(state, h);
    var cg = careGuideState_(state);
    var petList = petsArray_(pets || (state && state.pets));
    var ids = [];
    var catMap = {};
    petList.forEach(function (pet) {
      var gid = explicitGuideIdForPet_(pet);
      if (!gid || ids.indexOf(gid) >= 0) return;
      ids.push(gid);
      var guide = cg.careGuides[gid];
      var cat = guide && guide.category ? guide.category : inferCategoryForPet_(pet);
      if (cat) catMap[cat] = true;
    });
    cg.activeCareGuideIds = ids;
    cg.activeCareCategories = Object.keys(catMap);
    if (ids.length === 1) cg.activeCareGuideId = ids[0];
    else if (!ids.length) cg.activeCareGuideId = null;
    return cg;
  }

  function getActiveCareGuides_(state, pets, h) {
    if (h) ensureKnowledgeBase_(state, h);
    var petList = petsArray_(pets || (state && state.pets));
    syncActiveCareGuides_(state, h, petList);
    var cg = careGuideState_(state);
    return cg.activeCareGuideIds.map(function (gid) {
      return cg.careGuides[gid];
    }).filter(Boolean);
  }

  function getActiveCareCategories_(state, pets, h) {
    syncActiveCareGuides_(state, h, pets);
    return careGuideState_(state).activeCareCategories.slice();
  }

  function shouldShowCareGuide_(careGuideId, state, pets, h) {
    if (!careGuideId) return false;
    var petList = petsArray_(pets || (state && state.pets));
    if (!petList.length) return false;
    if (h) ensureKnowledgeBase_(state, h);
    return petList.some(function (pet) {
      return explicitGuideIdForPet_(pet) === careGuideId;
    });
  }

  function getSuggestedTasksForPet_(state, pet, h) {
    return syncCareGuideTasksToPet_(state, pet, h);
  }

  function getCareGuideRemindersForPets_(state, pets, h) {
    var petList = petsArray_(pets || (state && state.pets));
    if (!petList.length) return [];
    if (h) ensureKnowledgeBase_(state, h);
    syncActiveCareGuides_(state, h, petList);
    var reminders = [];
    petList.forEach(function (pet) {
      if (pet.todayReminderEnabled === false || pet.careReminder === false) return;
      var guide = getAppliedGuideForPet_(state, pet, h);
      if (!guide) return;
      getSuggestedTasksForPet_(state, pet, h).forEach(function (qKey) {
        reminders.push({
          petId: pet.id,
          petName: pet.petName,
          type: 'task',
          questKey: qKey,
          guideId: guide.id,
          category: guide.category,
          recordId: questRecordForKey_(qKey),
        });
      });
      (guide.dangerSigns || []).forEach(function (d) {
        if (typeof d !== 'object' || !d.sign) return;
        if (d.severity !== 'urgent' && d.severity !== 'warning') return;
        reminders.push({
          petId: pet.id,
          petName: pet.petName,
          type: 'danger',
          sign: d.sign,
          severity: d.severity,
          guideId: guide.id,
          category: guide.category,
        });
      });
    });
    return reminders;
  }

  function resolveGuideIdForPet_(state, pet) {
    if (!pet) return null;
    return explicitGuideIdForPet_(pet);
  }

  function pairInvolvesPetId_(pair, petId) {
    if (!pair) return false;
    return pair.malePetId === petId || pair.femalePetId === petId ||
      (Array.isArray(pair.unknownParentIds) && pair.unknownParentIds.indexOf(petId) >= 0);
  }

  function activePairForPet_(state, petId) {
    var pairs = state.breedingPairs || [];
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i].status !== 'ended' && pairInvolvesPetId_(pairs[i], petId)) return pairs[i];
    }
    return null;
  }

  function breedingEventsForPet_(state, petId, pairId) {
    return (state.breedingEvents || []).filter(function (e) {
      return e.petId === petId || (pairId && e.pairId === pairId);
    });
  }

  function breedingGuideQuestExtras_(state, pet, guide) {
    if (!guide || guide.id !== 'beetle_adult_general') return [];
    var pair = activePairForPet_(state, pet.id);
    if (!pair) return [];
    var evs = breedingEventsForPet_(state, pet.id, pair.id);
    var hasMating = evs.some(function (e) { return e.type === 'mating'; });
    var hasLaying = evs.some(function (e) { return e.type === 'egg_laying'; });
    var extras = [];
    if (!hasMating && pair.status === 'active') extras.push('GUIDE_WATCH_PAIR_BEHAVIOR');
    if (hasMating && !hasLaying) extras.push('GUIDE_OBSERVE_EGG_LAYING');
    return extras;
  }

  function breedingTipHtml_(state, pet, guide, h) {
    if (!guide || guide.id !== 'beetle_adult_general') return '';
    var pair = activePairForPet_(state, pet.id);
    if (!pair) return '';
    var evs = breedingEventsForPet_(state, pet.id, pair.id);
    var hasMating = evs.some(function (e) { return e.type === 'mating'; });
    var hasLaying = evs.some(function (e) { return e.type === 'egg_laying'; });
    var tipKey = 'guideData_beetle_breed_tip_active';
    if (hasMating && !hasLaying) tipKey = 'guideData_beetle_breed_tip_laying';
    else if (hasLaying) tipKey = 'guideData_beetle_breed_tip_incubate';
    return '<p class="hlc-guide-breed-tip">' + h.esc(h.t(tipKey)) + '</p>';
  }

  function lifeStageNoteForPet_(guide, pet, h) {
    if (!guide || !guide.lifeStageNotes) return '';
    var notes = guide.lifeStageNotes;
    var blob = [
      pet.instarLabel,
      pet.profileNote,
      pet.lifeStage,
    ].join(' ').toLowerCase();
    if (/pupa|蛹|pupation|化蛹/.test(blob) && notes.pupa) return notes.pupa;
    if (/egg|卵/.test(blob) && notes.egg) return notes.egg;
    if (/^l[123]$/.test(String(pet.instarLabel || '').trim().toLowerCase()) && notes.juvenile) {
      return notes.juvenile;
    }
    var stage = pet.lifeStage || 'juvenile';
    if (notes[stage]) return notes[stage];
    if (stage === 'juvenile' && notes.juvenile) return notes.juvenile;
    if (notes.adult) return notes.adult;
    return '';
  }

  function getGuideById_(state, guideId) {
    var cg = careGuideState_(state);
    if (!guideId) return null;
    return cg.careGuides[guideId] || null;
  }

  function getAppliedGuideForPet_(state, pet, h) {
    if (!pet) return null;
    if (h) ensureKnowledgeBase_(state, h);
    var cg = careGuideState_(state);
    var linkedId = resolveGuideIdForPet_(state, pet);
    if (linkedId && cg.careGuides[linkedId]) return cg.careGuides[linkedId];
    return null;
  }

  function isRecordAllowedForGuide_(guide, recordId) {
    if (!guide || !recordId) return false;
    var cat = guide.category;
    var gid = guide.id || '';
    var aquaRec = {
      water_temp: 1, ph: 1, ammonia: 1, nitrite: 1, nitrate: 1, salinity: 1,
      kh: 1, ca: 1, mg: 1, po4: 1, tds: 1, gh: 1, water_change: 1, water_flow: 1,
    };
    var reptileRec = {
      uvb: 1, calcium: 1, basking: 1, hotspot: 1, cold_zone: 1, shedding: 1, shell: 1,
    };
    var birdRec = { feather: 1, crop: 1, cage_clean: 1 };
    if (cat === 'birds' || cat === 'small_mammals') {
      if (aquaRec[recordId] || reptileRec[recordId]) return false;
    }
    if (cat === 'freshwater_aquatics') {
      if (reptileRec[recordId] || birdRec[recordId] || recordId === 'feather' || recordId === 'fur') return false;
    }
    if (cat === 'marine_aquatics') {
      if (reptileRec[recordId] || birdRec[recordId] || recordId === 'feather') return false;
    }
    if (cat === 'insects_beetles' || cat === 'arthropod_exotics') {
      if (aquaRec[recordId] || reptileRec[recordId] || birdRec[recordId]) return false;
    }
    if (cat === 'amphibians' && gid !== 'aquatic_amphibian_general') {
      if (aquaRec[recordId] && recordId !== 'water_temp') return false;
      if (reptileRec[recordId]) return false;
    }
    if (/beetle_larva|larva_general/.test(gid)) {
      if (recordId === 'uvb' || recordId === 'salinity' || recordId === 'hotspot') return false;
    }
    if (gid === 'tortoise_general' && recordId === 'salinity') return false;
    if (gid === 'gecko_general' && recordId === 'salinity') return false;
    var birdOnly = { feather: 1, crop: 1 };
    var mammalOnly = { teeth: 1, fur: 1 };
    if (cat !== 'birds' && birdOnly[recordId]) return false;
    if (cat !== 'small_mammals' && mammalOnly[recordId]) return false;
    if (recordId === 'drinking' && cat !== 'birds' && cat !== 'small_mammals') return false;
    if (recordId === 'cage_clean' && cat !== 'birds' && cat !== 'small_mammals') return false;
    if (recordId === 'coral_open' && cat !== 'marine_aquatics') return false;
    if (recordId === 'gill' && gid !== 'aquatic_amphibian_general' &&
        cat !== 'freshwater_aquatics' && cat !== 'marine_aquatics') return false;
    if (recordId === 'plant_status' && cat !== 'plants_terrarium') return false;
    return true;
  }

  function resolveGuideForRecordFilter_(state, pet, h) {
    if (!pet) return null;
    if (h) ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    if (guide) return guide;
    var matchId = matchCareGuide_(pet);
    return getGuideById_(state, matchId);
  }

  function getAllowedRecordTypesForPet_(state, pet, allRecordIds, h) {
    if (!pet) return (allRecordIds || []).slice();
    var guide = resolveGuideForRecordFilter_(state, pet, h);
    if (!guide) return (allRecordIds || []).slice();
    return filterRecordsForGuide_(guide, allRecordIds || []);
  }

  function filterRecordsForGuide_(guide, recordIds) {
    return (recordIds || []).filter(function (rid) {
      return isRecordAllowedForGuide_(guide, rid);
    });
  }

  function getRecommendedRecordsForPet_(state, pet, h) {
    return getRecommendedRecordTypesForPet_(state, pet, null, h);
  }

  function progressForPet_(state, petId) {
    var cg = careGuideState_(state);
    if (!cg.careGuideProgress[petId]) {
      cg.careGuideProgress[petId] = {
        careGuideId: null,
        completedStepIds: [],
        updatedAt: new Date().toISOString(),
      };
    }
    var prog = cg.careGuideProgress[petId];
    if (!Array.isArray(prog.completedStepIds)) prog.completedStepIds = [];
    if (!prog.updatedAt) prog.updatedAt = new Date().toISOString();
    if (prog.careGuideId === undefined) prog.careGuideId = null;
    return prog;
  }

  function syncProgressGuideId_(state, pet, guide) {
    if (!pet || !guide) return;
    var prog = progressForPet_(state, pet.id);
    if (prog.careGuideId !== guide.id) {
      prog.careGuideId = guide.id;
      prog.updatedAt = new Date().toISOString();
    }
  }

  function isQuestAllowedForGuide_(guide, qKey) {
    if (!guide || !qKey) return true;
    var rec = GUIDE_QUEST_RECORDS[qKey];
    if (!rec) return true;
    var cat = guide.category;
    var aquaRec = { water_temp: 1, ph: 1, ammonia: 1, nitrite: 1, nitrate: 1, salinity: 1, kh: 1, ca: 1, mg: 1, water_change: 1, water_flow: 1 };
    var reptileRec = { uvb: 1, calcium: 1, basking: 1, hotspot: 1, shedding: 1, shell: 1 };
    if (cat === 'birds' || cat === 'small_mammals') {
      if (aquaRec[rec]) return false;
      if (qKey === 'GUIDE_CHECK_WATER_TEMP' || qKey === 'GUIDE_CHECK_WATER_QUALITY' ||
          qKey === 'GUIDE_CHECK_SALINITY') return false;
    }
    if (cat === 'freshwater_aquatics' || cat === 'marine_aquatics') {
      if (reptileRec[rec]) return false;
      if (qKey === 'GUIDE_CHECK_UVB' || qKey === 'GUIDE_CHECK_LIGHTING' ||
          qKey === 'GUIDE_CHECK_HOT_COLD' || qKey === 'GUIDE_CHECK_TEMP_GRADIENT') return false;
    }
    if (cat === 'insects_beetles' || cat === 'arthropod_exotics') {
      if (aquaRec[rec]) return false;
      if (reptileRec[rec]) return false;
      if (qKey === 'GUIDE_CHECK_WATER_TEMP' || qKey === 'GUIDE_CHECK_WATER_QUALITY' ||
          qKey === 'GUIDE_CHECK_SALINITY' || qKey === 'GUIDE_CHECK_UVB') return false;
    }
    if (guide.id === 'tortoise_general' && rec === 'salinity') return false;
    if (guide.id === 'gecko_general' && rec === 'salinity') return false;
    if (/beetle_larva|larva_general/.test(guide.id || '')) {
      if (qKey === 'GUIDE_CHECK_JELLY_DRY' || qKey === 'GUIDE_CHECK_UPSIDE_DOWN') return false;
    }
    if (/beetle_adult/.test(guide.id || '')) {
      if (qKey === 'GUIDE_CHECK_LARVA_ACTIVITY' || qKey === 'GUIDE_CHECK_MOLD') return false;
    }
    return true;
  }

  function filterQuestKeys_(guide, tasks) {
    return tasks.filter(function (k) { return isQuestAllowedForGuide_(guide, k); });
  }

  function tutorialCompletion_(state, pet, guide) {
    if (!pet || !guide) return 0;
    var steps = guide.tutorialSteps || [];
    if (!steps.length) return 0;
    syncProgressGuideId_(state, pet, guide);
    var prog = progressForPet_(state, pet.id);
    return Math.round((prog.completedStepIds.length / steps.length) * 100);
  }

  function sectionEmptyText_(sectionId, h) {
    return h.t('guideSectionEmpty_' + sectionId);
  }

  function formatRangeHint_(hint, h) {
    if (!hint) return '';
    if (hint.textKey) return h.t(hint.textKey);
    var parts = [];
    if (hint.min != null && hint.max != null) {
      parts.push(String(hint.min) + '–' + String(hint.max) + (hint.unit || ''));
    } else if (hint.max != null) {
      parts.push('≤ ' + String(hint.max) + (hint.unit || ''));
    } else if (hint.min != null) {
      parts.push('≥ ' + String(hint.min) + (hint.unit || ''));
    }
    if (!parts.length) return '';
    return h.t('guideHintRange').replace('{range}', parts.join(''));
  }

  function envRangeHtml_(guide, h) {
    if (!guide) return '';
    var bits = [];
    if (guide.humidity && guide.humidity.ranges) {
      var hr = guide.humidity.ranges;
      bits.push(h.t('guideHintHumidity') + ': ' + hr.min + '–' + hr.max + (hr.unit || ''));
    }
    if (guide.temperature && guide.temperature.ranges) {
      var tr = guide.temperature.ranges;
      bits.push(h.t('guideHintTemperature') + ': ' + tr.min + '–' + tr.max + (tr.unit || ''));
    }
    if (!bits.length) return '';
    return '<p class="hlc-guide-range-line">' + bits.map(function (b) { return h.esc(b); }).join(' · ') + '</p>';
  }

  function accordionSummary_(guide, pet, secId, h) {
    if (!guide) return '';
    if (secId === 'quickstart' && guide.quickStart && guide.quickStart.points && guide.quickStart.points[0]) {
      return guide.quickStart.points[0];
    }
    if (secId === 'dailycare') {
      return guide.todayFocus || (guide.dailyCare && guide.dailyCare.items && guide.dailyCare.items[0]) || '';
    }
    if (secId === 'weeklymonthly') {
      var w = guide.weeklyCare && guide.weeklyCare.items && guide.weeklyCare.items[0];
      return w || '';
    }
    if (secId === 'environment') return guide.environment.notes || '';
    if (secId === 'feeding') return guide.feeding.notes || '';
    if (secId === 'lifestage') {
      var st = pet && resolveCanonicalLifeStage_(pet, guide, null);
      var lsTips = getLifeStageTips_(null, pet, guide, h);
      if (lsTips.length) return lsTips[0];
      var tips = guide.lifeStageTips && st && guide.lifeStageTips[st];
      return tips && tips[0] ? tips[0] : '';
    }
    if (secId === 'health') return guide.health.notes || '';
    if (secId === 'danger') {
      var d0 = guide.dangerSigns && guide.dangerSigns[0];
      return d0 ? (typeof d0 === 'string' ? d0 : d0.sign) : '';
    }
    if (secId === 'mistakes') return guide.commonMistakes && guide.commonMistakes[0] ? guide.commonMistakes[0] : '';
    if (secId === 'records') {
      return guide.recommendedRecords && guide.recommendedRecords.length
        ? String(guide.recommendedRecords.length) + ' ' + h.t('guideAccRecords') : '';
    }
    if (secId === 'tutorial') {
      var steps = guide.tutorialSteps || [];
      return steps.length ? String(steps.length) + ' steps' : '';
    }
    return '';
  }

  function renderGuideActions_(recordIds, h, extra) {
    var ids = (recordIds || []).filter(Boolean);
    var uniq = [];
    ids.forEach(function (rid) { if (uniq.indexOf(rid) < 0) uniq.push(rid); });
    if (!uniq.length && !extra) return '';
    var btns = uniq.slice(0, 6).map(function (rid) {
      var label = h.recordLabel ? h.recordLabel(rid) : rid;
      return '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-record="' + h.esc(rid) + '">' + h.esc(label) + '</button>';
    }).join('');
    btns += '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="open-reminder-settings">' + h.esc(h.t('guideActionReminder')) + '</button>';
    if (extra && extra.indexOf('photo') >= 0) {
      btns += '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-record="photo">' + h.esc(h.t('guideActionPhoto')) + '</button>';
    }
    return '<div class="hlc-guide-acc-actions">' + btns + '</div>';
  }

  function renderItemList_(items, emptyKey, h) {
    if (!items || !items.length) {
      return '<p class="hlc-guide-empty-inline">' + h.esc(h.t(emptyKey || 'guideSectionEmpty_dailycare')) + '</p>';
    }
    return '<ul class="hlc-guide-list">' + items.map(function (it) {
      return '<li>' + h.esc(it) + '</li>';
    }).join('') + '</ul>';
  }

  function renderGuideMetaHeader_(guide, h) {
    if (!guide) return '';
    var diff = difficultyLabel_(guide.difficulty, h);
    var bits = [
      '<span class="hlc-guide-meta-chip">' + h.esc(h.t('guideProfileDifficulty')) + ': ' + h.esc(diff) + '</span>',
    ];
    if (guide.suitableFor && guide.suitableFor.length) {
      bits.push('<span class="hlc-guide-meta-chip">' + h.esc(h.t('guideAccSuitable')) + ': ' + h.esc(guide.suitableFor.slice(0, 2).join(' · ')) + '</span>');
    }
    if (guide.beginnerNotice) {
      bits.push('<p class="hlc-guide-beginner">' + h.esc(guide.beginnerNotice) + '</p>');
    }
    return '<div class="hlc-guide-meta">' + bits.join('') + '</div>';
  }

  function renderQuickStartBody_(guide, h) {
    var qs = guide.quickStart;
    if (!qs) return '<p class="hlc-guide-empty-inline">' + h.esc(h.t('guideSectionEmpty_quickstart')) + '</p>';
    var html = qs.title ? '<h4 class="hlc-guide-subhead">' + h.esc(qs.title) + '</h4>' : '';
    html += renderItemList_(qs.points, 'guideSectionEmpty_quickstart', h);
    if (qs.firstDayTips && qs.firstDayTips.length) {
      html += '<p class="hlc-guide-subsection__label">' + h.esc(h.t('guideTpl_firstDayLabel')) + '</p>' + renderItemList_(qs.firstDayTips, '', h);
    }
    if (qs.firstWeekTips && qs.firstWeekTips.length) {
      html += '<p class="hlc-guide-subsection__label">' + h.esc(h.t('guideTpl_firstWeekLabel')) + '</p>' + renderItemList_(qs.firstWeekTips, '', h);
    }
    if (qs.avoidImmediately && qs.avoidImmediately.length) {
      html += '<p class="hlc-guide-subsection__label">' + h.esc(h.t('guideTpl_avoidLabel')) + '</p>' + renderItemList_(qs.avoidImmediately, '', h);
    }
    if (guide.setupChecklist && guide.setupChecklist.length) {
      html += '<p class="hlc-guide-subsection__label">' + h.esc(h.t('guideAccSetup')) + '</p><ul class="hlc-guide-setup-list">';
      guide.setupChecklist.forEach(function (item) {
        var pri = h.t('guidePriority_' + item.priority) !== 'guidePriority_' + item.priority
          ? h.t('guidePriority_' + item.priority) : item.priority;
        html += '<li class="hlc-guide-setup-item hlc-guide-setup-item--' + h.esc(item.priority || 'recommended') + '">' +
          '<strong>' + h.esc(item.title) + '</strong>' +
          (item.description && item.description.indexOf('guideTpl_') !== 0 ? '<span>' + h.esc(item.description) + '</span>' : '') +
          '<em class="hlc-guide-setup-item__pri">' + h.esc(pri) + '</em></li>';
      });
      html += '</ul>';
    }
    html += renderGuideActions_(guide.recommendedRecords, h, 'photo');
    return html;
  }

  function renderLifeStageBody_(guide, pet, h, state) {
    var tips = getLifeStageTips_(state, pet, guide, h);
    if (tips.length) {
      return renderItemList_(tips, 'guideSectionEmpty_lifestage', h);
    }
    var stage = resolveCanonicalLifeStage_(pet, guide, state);
    var enriched = guide.lifeStageTips || {};
    if (stage && enriched[stage] && enriched[stage].length) {
      return renderItemList_(enriched[stage], 'guideSectionEmpty_lifestage', h);
    }
    var keys = Object.keys(enriched);
    if (!keys.length) {
      return '<p class="hlc-guide-empty-inline">' + h.esc(h.t('guideSectionEmpty_lifestage')) + '</p>';
    }
    return keys.map(function (k) {
      var lk = 'wizardLifeStage_' + k;
      var label = h.t(lk) !== lk ? h.t(lk) : k;
      return '<p class="hlc-guide-subsection__label">' + h.esc(label) + '</p>' + renderItemList_(enriched[k], '', h);
    }).join('');
  }

  function renderDangerBody_(guide, h, state, pet) {
    var signs = pet && state
      ? getDangerSignsForPet_(state, pet, h)
      : (guide.dangerSigns || []).map(function (d, i) { return normalizeDangerSign_(d, i, h); }).filter(Boolean);
    if (!signs.length) {
      return '<p class="hlc-guide-empty-inline">' + h.esc(h.t('guideSectionEmpty_danger')) + '</p>';
    }
    var recs = [];
    var html = '<ul class="hlc-guide-danger-list">' + signs.map(function (d) {
      if (d.relatedRecordType) recs.push(d.relatedRecordType);
      var sev = d.severity || 'warning';
      var sevLabel = h.t('guideSeverity_' + sev) !== 'guideSeverity_' + sev ? h.t('guideSeverity_' + sev) : sev;
      return (
        '<li class="hlc-guide-danger-item hlc-guide-danger-item--' + h.esc(sev) + '">' +
        '<span class="hlc-guide-danger-item__sev">' + h.esc(sevLabel) + '</span>' +
        '<strong>' + h.esc(d.sign) + '</strong>' +
        (d.advice ? '<p>' + h.esc(d.advice) + '</p>' : '') +
        '</li>'
      );
    }).join('') + '</ul>';
    if (guide.emergencyAdvice && guide.emergencyAdvice.length) {
      html += '<p class="hlc-guide-subsection__label">' + h.esc(h.t('guideAccEmergency')) + '</p>' + renderItemList_(guide.emergencyAdvice, 'guideSectionEmpty_emergency', h);
    }
    html += '<p class="hlc-guide-danger-disclaimer">' + h.esc(h.t('guideDangerDisclaimer')) + '</p>';
    html += renderGuideActions_(recs.concat(['abnormality']), h);
    return html;
  }

  function accordionItem_(id, icon, title, summary, body, openIds, h) {
    var open = openIds.indexOf(id) >= 0;
    return (
      '<div class="hlc-guide-acc' + (open ? ' is-open' : '') + '">' +
      '<button type="button" class="hlc-guide-acc__head" data-hl-action="guide-toggle-acc" data-hl-guide-acc="' + h.esc(id) + '">' +
      '<span class="hlc-guide-acc__icon">' + h.svgIcon(icon) + '</span>' +
      '<span class="hlc-guide-acc__head-text">' +
      '<span class="hlc-guide-acc__title">' + h.esc(title) + '</span>' +
      (summary ? '<span class="hlc-guide-acc__summary">' + h.esc(summary) + '</span>' : '') +
      '</span></button>' +
      '<div class="hlc-guide-acc__body">' + body + '</div></div>'
    );
  }

  function questLabel_(h, qKey) {
    if (!qKey) return '';
    var gk = 'guideQuest_' + qKey;
    return h.t(gk) !== gk ? h.t(gk) : qKey;
  }

  function joinPhraseList_(h, parts) {
    if (!parts || !parts.length) return '';
    if (parts.length === 1) return parts[0];
    if (h.isEn && h.isEn()) {
      if (parts.length === 2) return parts[0] + ' and ' + parts[1];
      return parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
    }
    if (parts.length === 2) return parts[0] + '\u8207' + parts[1];
    return parts.slice(0, -1).join('\u3001') + '\u8207' + parts[parts.length - 1];
  }

  function petsWithActiveGuides_(state, petList, h) {
    return petList.filter(function (pet) {
      return !!getAppliedGuideForPet_(state, pet, h);
    });
  }

  function normalizeDangerSign_(d, idx, h) {
    if (typeof d === 'string') {
      return {
        id: 'ds_' + idx,
        sign: d,
        severity: 'warning',
        advice: h.t('guideDangerDefaultAdvice'),
        relatedRecordType: 'abnormality',
      };
    }
    if (!d || !d.sign) return null;
    return {
      id: d.id || ('ds_' + idx),
      sign: d.sign,
      severity: d.severity || 'warning',
      advice: d.advice || h.t('guideDangerDefaultAdvice'),
      relatedRecordType: d.relatedRecordType || 'abnormality',
    };
  }

  function getDangerSignsForPet_(state, pet, h) {
    if (!pet) return [];
    ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    if (!guide || !guide.dangerSigns || !guide.dangerSigns.length) return [];
    return guide.dangerSigns.map(function (d, i) {
      return normalizeDangerSign_(d, i, h);
    }).filter(Boolean);
  }

  function logsForDangerAlerts_(records, petId, h) {
    if (Array.isArray(records)) {
      return records.filter(function (l) {
        return !l.petId || l.petId === petId;
      });
    }
    if (records && typeof records === 'object' && records[petId]) {
      return records[petId] || [];
    }
    if (h && typeof h.petLogs === 'function') return h.petLogs(petId) || [];
    return [];
  }

  function signMatchesText_(sign, text) {
    if (!sign || !text) return false;
    var s = String(sign);
    var t = String(text);
    if (t.indexOf(s) >= 0 || s.indexOf(t) >= 0) return true;
    var chunks = s.split(/[\s/·、，,]+/).filter(function (c) { return c.length >= 2; });
    return chunks.some(function (c) { return t.indexOf(c) >= 0; });
  }

  function pickDangerSignForHealthStatus_(healthStatus, signs, log, h) {
    if (!signs.length) return null;
    var sym = ((log && log.values && log.values.symptoms) || (log && log.note) || '').toLowerCase();
    var urgent = signs.filter(function (s) { return s.severity === 'urgent'; });
    var warning = signs.filter(function (s) { return s.severity === 'warning'; });
    if (sym) {
      var symHit = signs.find(function (s) { return signMatchesText_(s.sign, sym); });
      if (symHit) return symHit;
    }
    if (healthStatus === 'injured') {
      return signs.find(function (s) {
        return /skin|潰|紅|破|limb|肢|足|gill|鰓|shell|殼|tissue|組織/i.test(s.sign);
      }) || urgent[0] || signs[0];
    }
    if (healthStatus === 'weak') {
      return signs.find(function (s) {
        return /活動|無力|遲緩|letharg|weak|閉眼|炸毛|fluff/i.test(s.sign);
      }) || warning[0] || signs[0];
    }
    if (healthStatus === 'watch') return warning[0] || signs[0];
    if (healthStatus === 'abnormal') return urgent[0] || warning[0] || signs[0];
    return signs[0];
  }

  function isAbnormalFeedingLog_(log) {
    if (!log || log.recordId !== 'feeding') return false;
    var st = (log.values && log.values.feedingStatus) || log.status || '';
    return st === 'refused' || st === 'none' || st === 'partial';
  }

  function getActiveDangerAlerts_(state, pets, records, h) {
    var petList = petsArray_(pets || (state && state.pets));
    if (!petList.length) return [];
    ensureKnowledgeBase_(state, h);
    syncActiveCareGuides_(state, h, petList);
    var alerts = [];
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    var cutoffKey = cutoff.toISOString().slice(0, 10);

    petList.forEach(function (pet) {
      var signs = getDangerSignsForPet_(state, pet, h);
      if (!signs.length) return;
      var logs = logsForDangerAlerts_(records, pet.id, h);

      logs.forEach(function (log) {
        if (String(log.date || '') < cutoffKey) return;
        if (log.type === 'abnormality' || log.recordId === 'abnormality') {
          var hs = (log.values && log.values.healthStatus) || log.status || '';
          if (!hs || hs === 'normal' || hs === 'dead') return;
          var matched = pickDangerSignForHealthStatus_(hs, signs, log, h);
          alerts.push({
            petId: pet.id,
            petName: pet.petName,
            sign: matched ? matched.sign : h.t('guideDangerAlertAbnormal'),
            severity: matched ? matched.severity : 'warning',
            advice: matched ? matched.advice : h.t('guideDangerDefaultAdvice'),
            active: true,
            recordId: 'abnormality',
            logDate: log.date,
            healthStatus: hs,
          });
          return;
        }
        if (isAbnormalFeedingLog_(log)) {
          var feedSign = signs.find(function (s) {
            return s.relatedRecordType === 'feeding' || /拒食|refus|appetite/i.test(s.sign);
          });
          if (feedSign) {
            alerts.push({
              petId: pet.id,
              petName: pet.petName,
              sign: feedSign.sign,
              severity: feedSign.severity,
              advice: feedSign.advice,
              active: true,
              recordId: 'feeding',
              logDate: log.date,
            });
          }
        }
      });
    });
    return alerts;
  }

  function renderDangerAlertWidget_(state, pets, h) {
    var petList = petsArray_(pets || (state && state.pets));
    syncActiveCareGuides_(state, h, petList);
    var activePets = petsWithActiveGuides_(state, petList, h);
    if (!activePets.length) return '';

    var alerts = getActiveDangerAlerts_(state, activePets, null, h);
    var lines = [];

    activePets.forEach(function (pet) {
      var signs = getDangerSignsForPet_(state, pet, h);
      if (!signs.length) return;
      var petAlerts = alerts.filter(function (a) { return a.petId === pet.id; });

      if (petAlerts.length) {
        petAlerts.slice(0, 3).forEach(function (a) {
          lines.push(
            '<li class="hlc-danger-widget__item hlc-danger-widget__item--active">' +
            '<strong>' + h.esc(pet.petName) + ':</strong> ' +
            '<span class="hlc-danger-widget__sign">' + h.esc(a.sign) + '</span>' +
            (a.advice ? ' <span class="hlc-danger-widget__advice">' + h.esc(a.advice) + '</span>' : '') +
            '</li>'
          );
        });
        return;
      }

      var preview = signs.slice(0, 3).map(function (s) { return s.sign; });
      lines.push(
        '<li class="hlc-danger-widget__item">' +
        '<strong>' + h.esc(pet.petName) + ':</strong> ' +
        h.esc(preview.join(' · ')) +
        '</li>'
      );
    });

    if (!lines.length) {
      return (
        '<div class="hlc-danger-widget hlc-danger-widget--empty">' +
        '<p class="hlc-guide-center__val hlc-guide-center__val--muted">' +
        h.esc(h.t('guideCenterFocusEmpty')) + '</p></div>'
      );
    }

    return (
      '<div class="hlc-danger-widget">' +
      '<ul class="hlc-danger-widget__list">' + lines.join('') + '</ul>' +
      '<p class="hlc-danger-widget__disclaimer">' + h.esc(h.t('guideDangerDisclaimer')) + '</p>' +
      '</div>'
    );
  }

  function renderAbnormalityDangerHint_(state, pet, healthStatus, h) {
    if (!pet || !healthStatus || healthStatus === 'normal' || healthStatus === 'dead') return '';
    var signs = getDangerSignsForPet_(state, pet, h);
    if (!signs.length) return '';
    var matched = pickDangerSignForHealthStatus_(healthStatus, signs, { values: {} }, h);
    var advice = matched ? matched.advice : h.t('guideDangerDefaultAdvice');
    var signLabel = matched ? matched.sign : '';
    return (
      '<div class="hlc-danger-record-hint">' +
      (signLabel
        ? '<p class="hlc-danger-record-hint__sign"><strong>' + h.esc(signLabel) + '</strong></p>'
        : '') +
      '<p class="hlc-danger-record-hint__step">' +
      h.esc(h.t('guideDangerNextStepPrefix')) + h.esc(advice) + '</p>' +
      '<p class="hlc-danger-record-hint__disclaimer">' + h.esc(h.t('guideDangerDisclaimer')) + '</p>' +
      '</div>'
    );
  }

  function buildPetTodayTip_(state, pet, h, compact) {
    var maxTasks = compact ? 2 : 3;
    var labels = getSuggestedTasksForPet_(state, pet, h).slice(0, maxTasks).map(function (k) {
      return questLabel_(h, k);
    }).filter(Boolean);
    if (!labels.length) {
      var guide = getAppliedGuideForPet_(state, pet, h);
      if (guide && guide.todayFocus) return guide.todayFocus;
      if (guide && guide.dailyCare && guide.dailyCare.items && guide.dailyCare.items[0]) {
        return guide.dailyCare.items[0];
      }
      return '';
    }
    var joined = joinPhraseList_(h, labels);
    if (compact) return joined;
    var prefix = h.t('guideTodayAdvicePrefix');
    return prefix + joined;
  }

  function renderGuideCenterBlock_(label, bodyHtml, extraClass) {
    return (
      '<div class="hlc-guide-center__block' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<span class="hlc-guide-center__label">' + label + '</span>' +
      bodyHtml + '</div>'
    );
  }

  function renderCenterWidget_(state, pets, h) {
    ensureKnowledgeBase_(state, h);
    var petList = petsArray_(pets || (state && state.pets));
    syncActiveCareGuides_(state, h, petList);
    var activeGuides = getActiveCareGuides_(state, petList, h);
    var activePets = petsWithActiveGuides_(state, petList, h);
    var widgetTitle = h.esc(h.t('guideTodayAdviceTitle'));

    if (!petList.length) {
      return (
        '<aside class="hlc-guide-widget hlc-guide-center hlc-guide-center--empty hlc-guide-today-advice">' +
        '<h3 class="hlc-guide-widget__title">' + widgetTitle + '</h3>' +
        '<p class="hlc-guide-empty">' + h.esc(h.t('guideCenterEmptyActivation')) + '</p>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="start-create">' +
        h.esc(h.t('addPet')) + '</button></aside>'
      );
    }

    if (!activeGuides.length || !activePets.length) {
      return (
        '<aside class="hlc-guide-widget hlc-guide-center hlc-guide-center--empty hlc-guide-today-advice">' +
        '<h3 class="hlc-guide-widget__title">' + widgetTitle + '</h3>' +
        '<p class="hlc-guide-empty">' + h.esc(h.t('guideCenterRecEmpty')) + '</p>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-open-all">' +
        h.esc(h.t('guideCenterBrowse')) + '</button></aside>'
      );
    }

    var reminders = getCareGuideRemindersForPets_(state, activePets, h);
    var compactTips = activePets.length > 1;
    var reminderLines = activePets.map(function (pet) {
      var tip = buildPetTodayTip_(state, pet, h, compactTips);
      if (!tip) return '';
      return '<li><strong>' + h.esc(pet.petName) + ':</strong> ' + h.esc(tip) + '</li>';
    }).filter(Boolean).join('');
    var remindersHtml = reminderLines
      ? '<ul class="hlc-guide-center__list">' + reminderLines + '</ul>'
      : '<p class="hlc-guide-center__val hlc-guide-center__val--muted">' + h.esc(h.t('guideTodayRemindersEmpty')) + '</p>';

    var needFn = h.petNeedsAttention || function () { return false; };
    var statusFn = h.petStatusLabel || function (pet) { return pet.petName; };
    var needPets = activePets.filter(function (pet) { return needFn(pet); });
    var needHtml = needPets.length
      ? (
        '<ul class="hlc-guide-center__list hlc-guide-center__list--need">' + needPets.map(function (pet) {
          return (
            '<li><button type="button" class="hlc-guide-center__need-link" data-hl-open-pet="' +
            h.esc(pet.id) + '"><strong>' + h.esc(pet.petName) + '</strong> · ' + h.esc(statusFn(pet)) + '</button></li>'
          );
        }).join('') + '</ul>'
      )
      : '<p class="hlc-guide-center__val hlc-guide-center__val--muted">' + h.esc(h.t('guideTodayNeedEmpty')) + '</p>';

    var recordLines = activePets.map(function (pet) {
      var recIds = getRecommendedRecordsForPet_(state, pet, h).slice(0, 5);
      if (!recIds.length) return '';
      var labels = recIds.map(function (rid) {
        return h.recordLabel ? h.recordLabel(rid) : rid;
      });
      return (
        '<li><strong>' + h.esc(pet.petName) + ':</strong> ' +
        h.esc(h.t('guideTodayRecPrefix')) + h.esc(joinPhraseList_(h, labels)) + '</li>'
      );
    }).filter(Boolean).join('');
    var recordsHtml = recordLines
      ? '<ul class="hlc-guide-center__list">' + recordLines + '</ul>'
      : '<p class="hlc-guide-center__val hlc-guide-center__val--muted">' + h.esc(h.t('guideCenterRecEmpty')) + '</p>';

    var pendingSteps = [];
    activePets.forEach(function (pet) {
      var guide = getAppliedGuideForPet_(state, pet, h);
      if (!guide || !guide.tutorialSteps || !guide.tutorialSteps.length) return;
      var prog = progressForPet_(state, pet.id);
      guide.tutorialSteps.forEach(function (step) {
        if (prog.completedStepIds.indexOf(step.id) >= 0) return;
        if (pendingSteps.length >= 4) return;
        var title = step.titleKey ? h.t(step.titleKey) : (step.title || step.id);
        pendingSteps.push('<li><strong>' + h.esc(pet.petName) + ':</strong> ' + h.esc(title) + '</li>');
      });
    });
    var pendingHtml = pendingSteps.length
      ? '<ul class="hlc-guide-center__list">' + pendingSteps.join('') + '</ul>'
      : '<p class="hlc-guide-center__val hlc-guide-center__val--muted">' + h.esc(h.t('guideTutorialStepsEmpty')) + '</p>';

    var dangerHtml = renderDangerAlertWidget_(state, activePets, h);

    return (
      '<aside class="hlc-guide-widget hlc-guide-center hlc-guide-today-advice">' +
      '<h3 class="hlc-guide-widget__title">' + widgetTitle + '</h3>' +
      renderGuideCenterBlock_(h.esc(h.t('guideTodayTopReminders')), remindersHtml) +
      renderGuideCenterBlock_(h.esc(h.t('guideTodayNeedAttention')), needHtml) +
      renderGuideCenterBlock_(h.esc(h.t('guideTodaySuggestedRecords')), recordsHtml) +
      renderGuideCenterBlock_(h.esc(h.t('guideCenterTutorialPending')), pendingHtml) +
      renderGuideCenterBlock_(h.esc(h.t('guideDangerWidgetTitle')), dangerHtml, 'hlc-guide-center__block--danger') +
      '<p class="hlc-guide-today-advice__browse-note">' + h.esc(h.t('guideTodayBrowseNote')) + '</p>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm hlc-guide-today-advice__browse" data-hl-action="guide-open-all">' +
      h.esc(h.t('guideCenterBrowse')) + '</button></aside>'
    );
  }

  function renderCareGuideEmptyHint_(h) {
    return (
      '<p class="hlc-guide-activation-empty">' + h.esc(h.t('guideCenterEmptyActivation')) + '</p>'
    );
  }

  function renderAdviceSectionHead_(guide, catId, h, extraActions) {
    return (
      '<div class="hlc-guide-section__head">' +
      '<h2 class="hlc-section-title hlc-section-title--sm">' + h.esc(h.t('guideAdviceTitle')) + '</h2>' +
      (guide
        ? '<span class="hlc-guide-badge">' + h.esc(guide.title || guide.id) + '</span>'
        : '<span class="hlc-guide-badge hlc-guide-badge--muted">' + h.esc(h.t('guideCat_' + catId)) + '</span>') +
      (extraActions || '') +
      '</div>'
    );
  }

  function renderPetContextAdvice_(state, pet, guide, h) {
    if (!guide || !pet) return '';
    var parts = [];
    var focus = guide.todayFocus || '';
    if (focus) {
      parts.push('<p class="hlc-guide-compact__focus">' + h.esc(focus) + '</p>');
    }
    var stageTip = getLifeStageFocusTip_(state, pet, h);
    if (stageTip && stageTip !== focus) {
      parts.push('<p class="hlc-guide-compact__stage">' + h.esc(stageTip) + '</p>');
    }
    var alerts = getActiveDangerAlerts_(state, [pet], null, h);
    if (alerts.length) {
      parts.push(
        '<div class="hlc-guide-compact__alerts">' +
        alerts.slice(0, 2).map(function (a) {
          return (
            '<p class="hlc-guide-compact__alert">' +
            '<strong>' + h.esc(a.sign) + '</strong> ' +
            h.esc(a.advice || '') + '</p>'
          );
        }).join('') +
        '<p class="hlc-guide-compact__disclaimer">' + h.esc(h.t('guideDangerDisclaimer')) + '</p>' +
        '</div>'
      );
    }
    if (!parts.length) return '';
    return '<div class="hlc-guide-compact__context">' + parts.join('') + '</div>';
  }

  function renderAdviceCompactRecs_(state, pet, guide, h) {
    if (!guide || !pet) return '';
    var recs = getRecommendedRecordsForPet_(state, pet, h).slice(0, 4);
    if (!recs.length) return '';
    var chips = recs.map(function (rid) {
      var label = h.recordLabel ? h.recordLabel(rid) : rid;
      return '<button type="button" class="hlc-chip hlc-chip--compact" data-hl-record="' + h.esc(rid) + '">' + h.esc(label) + '</button>';
    }).join('');
    return '<div class="hlc-guide-compact__recs">' + chips + '</div>';
  }

  function renderAdviceAccordion_(state, pet, guide, h) {
    if (!guide) return '';
    var openIds = state.ui.guideAccordionOpen || [];
    return ACCORDION_SECTIONS.map(function (sec) {
      var body = '';
      var summary = accordionSummary_(guide, pet, sec.id, h);
      if (sec.id === 'quickstart') {
        body = renderQuickStartBody_(guide, h);
      } else if (sec.id === 'dailycare') {
        body = renderItemList_(guide.dailyCare && guide.dailyCare.items, 'guideSectionEmpty_dailycare', h);
        if (guide.todayFocus) {
          body = '<p class="hlc-guide-focus">' + h.esc(guide.todayFocus) + '</p>' + body;
        }
        body += renderGuideActions_(guide.recommendedRecords, h, 'photo');
      } else if (sec.id === 'weeklymonthly') {
        body = '<p class="hlc-guide-subsection__label">' + h.esc(h.t('guideCareWeeklyLabel')) + '</p>';
        body += renderItemList_(guide.weeklyCare && guide.weeklyCare.items, 'guideSectionEmpty_weeklymonthly', h);
        body += '<p class="hlc-guide-subsection__label">' + h.esc(h.t('guideCareMonthlyLabel')) + '</p>';
        body += renderItemList_(guide.monthlyCare && guide.monthlyCare.items, 'guideSectionEmpty_weeklymonthly', h);
        body += renderGuideActions_(['weight', 'photo', 'note'], h);
      } else if (sec.id === 'environment') {
        body = '<p>' + h.esc(guide.environment.notes || sectionEmptyText_(sec.id, h)) + '</p>' + envRangeHtml_(guide, h);
        if (guide.waterQuality && guide.waterQuality.notes) {
          body += '<p class="hlc-guide-subsection"><strong>' + h.esc(h.t('guideAccWater')) + '</strong> ' + h.esc(guide.waterQuality.notes) + '</p>';
        }
        body += renderGuideActions_(['temperature', 'humidity', 'water_temp', 'ph'], h);
      } else if (sec.id === 'feeding') {
        body = '<p>' + h.esc(guide.feeding.notes || sectionEmptyText_(sec.id, h)) + '</p>';
        if (guide.breeding && guide.breeding.notes && guide.breeding.notes !== h.t('guideData_insect_emptySection')) {
          body += '<p class="hlc-guide-subsection"><strong>' + h.esc(h.t('guideAccBreeding')) + '</strong> ' + h.esc(guide.breeding.notes) + '</p>';
        }
        body += renderGuideActions_(['feeding'], h);
      } else if (sec.id === 'lifestage') {
        body = breedingTipHtml_(state, pet, guide, h) + renderLifeStageBody_(guide, pet, h, state);
      } else if (sec.id === 'health') {
        body = '<p>' + h.esc(guide.health.notes || sectionEmptyText_(sec.id, h)) + '</p>';
        if (guide.category === 'birds' && !guide.isPlaceholder) {
          body += '<p class="hlc-guide-health-disclaimer hlc-guide-health-disclaimer--bird">' +
            h.esc(h.t('guideHealthDisclaimerBird')) + '</p>';
        }
        if (guide.category === 'small_mammals') {
          body += '<p class="hlc-guide-health-disclaimer hlc-guide-health-disclaimer--mammal">' +
            h.esc(h.t('guideHealthDisclaimerMammal')) + '</p>';
        }
        if (guide.safetyNotice) {
          body += '<p class="hlc-guide-health-disclaimer hlc-guide-health-disclaimer--arthropod">' +
            h.esc(guide.safetyNotice) + '</p>';
        } else if (guide.category === 'arthropod_exotics') {
          body += '<p class="hlc-guide-health-disclaimer hlc-guide-health-disclaimer--arthropod">' +
            h.esc(h.t('guideHealthDisclaimerArthropod')) + '</p>';
        }
        if (guide.highRiskNotice) {
          body += '<p class="hlc-guide-health-disclaimer hlc-guide-health-disclaimer--high-risk">' +
            h.esc(guide.highRiskNotice) + '</p>';
        }
        if (guide.isPlaceholder) {
          body += '<p class="hlc-guide-health-disclaimer">' + h.esc(h.t('guideHealthDisclaimerRaptor')) + '</p>';
        }
        if (guide.category === 'reptiles') {
          body += '<p class="hlc-guide-health-disclaimer">' + h.esc(h.t('guideHealthDisclaimerReptile')) + '</p>';
        }
        body += renderGuideActions_(['activity', 'abnormality', 'weight'], h);
      } else if (sec.id === 'mistakes') {
        body = guide.commonMistakes.length
          ? renderItemList_(guide.commonMistakes, 'guideSectionEmpty_mistakes', h)
          : '<p class="hlc-guide-empty-inline">' + h.esc(sectionEmptyText_(sec.id, h)) + '</p>';
      } else if (sec.id === 'danger') {
        body = renderDangerBody_(guide, h, state, pet);
      } else if (sec.id === 'records') {
        body = guide.recommendedRecords.length
          ? '<div class="hlc-guide-rec-chips">' + guide.recommendedRecords.map(function (rid) {
            var label = h.recordLabel ? h.recordLabel(rid) : rid;
            return '<button type="button" class="hlc-chip hlc-chip--compact" data-hl-record="' + h.esc(rid) + '">' + h.esc(label) + '</button>';
          }).join('') + '</div>'
          : '<p class="hlc-guide-empty-inline">' + h.esc(sectionEmptyText_(sec.id, h)) + '</p>';
        body += renderGuideActions_(guide.recommendedRecords, h);
      } else if (sec.id === 'tutorial') {
        body = renderTutorialPanel_(state, pet, guide, h);
        body += renderGuideActions_(guide.recommendedRecords, h, 'photo');
      } else if (sec.id === 'disclaimer') {
        body = '<p class="hlc-guide-disclaimer">' + h.esc(guide.disclaimer || h.t('guideDisclaimer')) + '</p>';
      }
      if (!body || body.indexOf('hlc-guide-empty-inline') >= 0) return '';
      return accordionItem_(sec.id, sec.icon, h.t(sec.titleKey), summary, body, openIds, h);
    }).filter(Boolean).join('');
  }

  function renderAdviceBlock_(state, pet, h) {
    ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    if (guide) syncProgressGuideId_(state, pet, guide);
    var catId = inferCategoryForPet_(pet);
    var expanded = !!(state.ui && state.ui.guideAdviceExpanded &&
      state.ui.guideAdviceExpandedPetId === (pet && pet.id));

    if (!guide) {
      return (
        '<section class="hlc-guide-section hlc-guide-section--compact">' +
        renderAdviceSectionHead_(null, catId, h) +
        '<div class="hlc-guide-compact">' +
        '<p class="hlc-guide-compact__hint">' + h.esc(h.t('guideAdviceEmpty')) + '</p>' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-open-all">' +
        h.esc(h.t('guideCenterBrowse')) + '</button></div></section>'
      );
    }

    if (expanded) {
      var sections = renderAdviceAccordion_(state, pet, guide, h);
      return (
        '<section class="hlc-guide-section hlc-guide-section--expanded">' +
        renderAdviceSectionHead_(guide, catId, h,
          '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-advice-collapse">' +
          h.esc(h.t('guideAdviceCollapse')) + '</button>') +
        renderLifeStageReminderCallout_(state, pet, guide, h) +
        (sections ? '<div class="hlc-guide-acc-list">' + sections + '</div>' : '') +
        '<p class="hlc-guide-disclaimer hlc-guide-disclaimer--compact">' +
        h.esc(guide.disclaimer || h.t('guideDisclaimer')) + '</p></section>'
      );
    }

    var context = renderPetContextAdvice_(state, pet, guide, h);
    var recs = renderAdviceCompactRecs_(state, pet, guide, h);
    return (
      '<section class="hlc-guide-section hlc-guide-section--compact">' +
      renderAdviceSectionHead_(guide, catId, h) +
      '<div class="hlc-guide-compact">' +
      (context || ('<p class="hlc-guide-compact__hint">' + h.esc(h.t('guideAdviceContextEmpty')) + '</p>')) +
      recs +
      '<div class="hlc-guide-compact__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-advice-expand">' +
      h.esc(h.t('guideAdviceViewFull')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-open-all">' +
      h.esc(h.t('guideCenterBrowse')) + '</button></div></div></section>'
    );
  }

  function renderTutorialPanel_(state, pet, guide, h) {
    var steps = guide.tutorialSteps || [];
    var pct = tutorialCompletion_(state, pet, guide);
    if (!steps.length) {
      return '<p class="hlc-guide-empty-inline">' + h.esc(h.t('guideTutorialStepsEmpty')) + '</p>';
    }
    var prog = progressForPet_(state, pet.id);
    var list = steps.map(function (step) {
      var done = prog.completedStepIds.indexOf(step.id) >= 0;
      var title = step.titleKey ? h.t(step.titleKey) : (step.title || step.id);
      return (
        '<div class="hlc-guide-tutorial-step' + (done ? ' is-done' : '') + '">' +
        '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-tutorial-toggle" data-hl-step-id="' + h.esc(step.id) + '">' +
        (done ? h.esc(h.t('guideTutorialStepDone')) : h.esc(h.t('guideTutorialStepMark'))) +
        '</button>' +
        '<span class="hlc-guide-tutorial-step__title">' + h.esc(title) + '</span></div>'
      );
    }).join('');
    return (
      '<p class="hlc-guide-tutorial__progress">' + h.esc(h.t('guideTutorialProgress')) + ' <strong>' + h.esc(String(pct)) + '%</strong></p>' +
      '<div class="hlc-guide-tutorial-steps">' + list + '</div>'
    );
  }

  function difficultyLabel_(diff, h) {
    if (!diff) return h.t('guideNotSet');
    var key = 'guideDiff_' + diff;
    return h.t(key) !== key ? h.t(key) : diff;
  }

  function guideSpeciesLabel_(guide) {
    if (!guide) return '';
    var parts = (guide.commonNames || []).slice(0, 4);
    if (guide.scientificKeywords && guide.scientificKeywords.length) {
      parts = parts.concat(guide.scientificKeywords.slice(0, 2));
    }
    return parts.join(' · ') || '—';
  }

  function appliedGuideIdsForPets_(pets) {
    var ids = [];
    petsArray_(pets).forEach(function (pet) {
      var gid = explicitGuideIdForPet_(pet);
      if (gid && ids.indexOf(gid) < 0) ids.push(gid);
    });
    return ids;
  }

  function petsWithGuide_(guideId, pets) {
    if (!guideId) return [];
    return petsArray_(pets).filter(function (pet) {
      return explicitGuideIdForPet_(pet) === guideId;
    });
  }

  function petsEligibleForGuide_(state, guide, pets) {
    if (!guide || !guide.id) return [];
    return petsArray_(pets).filter(function (pet) {
      return matchCareGuide_(pet) === guide.id;
    });
  }

  function guideCompletionForPets_(state, guide, pets) {
    var linked = petsWithGuide_(guide.id, pets);
    if (!linked.length) return 0;
    var sum = 0;
    linked.forEach(function (pet) {
      sum += tutorialCompletion_(state, pet, guide);
    });
    return Math.round(sum / linked.length);
  }

  function applyGuideToPet_(state, pet, guideId, h, ctx) {
    if (!pet || !guideId) return false;
    if (h) ensureKnowledgeBase_(state, h);
    var guide = getGuideById_(state, guideId);
    if (!guide) return false;
    pet.careGuideId = guideId;
    var prog = progressForPet_(state, pet.id);
    prog.careGuideId = guideId;
    prog.updatedAt = new Date().toISOString();
    syncProgressGuideId_(state, pet, guide);
    syncCareGuideTasksToPet_(state, pet, h);
    var petList = (ctx && ctx.state && ctx.state.pets) || (state && state.pets);
    syncActiveCareGuides_(state, h, petList);
    return true;
  }

  function filteredGuides_(state) {
    var cg = careGuideState_(state);
    var kw = String(cg.searchKeyword || '').trim().toLowerCase();
    var cat = cg.selectedCareCategory || 'all';
    var diff = cg.selectedCareDifficulty || 'all';
    var stage = cg.selectedCareLifeStage || 'all';
    return Object.keys(cg.careGuides).filter(function (gid) {
      var g = cg.careGuides[gid];
      if (!g) return false;
      if (cat !== 'all' && g.category !== cat) return false;
      if (diff !== 'all' && g.difficulty !== diff) return false;
      if (stage !== 'all') {
        if (g.lifeStages && g.lifeStages.length && g.lifeStages.indexOf(stage) < 0) return false;
      }
      if (!kw) return true;
      var blob = [
        g.id,
        g.title,
        g.summary,
        g.category,
        (g.commonNames || []).join(' '),
        (g.scientificKeywords || []).join(' '),
      ].join(' ').toLowerCase();
      return blob.indexOf(kw) >= 0;
    }).sort(function (a, b) {
      return String(cg.careGuides[a].title || a).localeCompare(String(cg.careGuides[b].title || b));
    });
  }

  function renderMyPetGuideCard_(state, guide, pets, h) {
    var linked = petsWithGuide_(guide.id, pets);
    var pct = guideCompletionForPets_(state, guide, pets);
    var catLabel = h.t('guideCat_' + (guide.category || 'general'));
    var petLinks = linked.map(function (pet) {
      return '<button type="button" class="hlc-chip hlc-chip--pet" data-hl-action="guide-open-pet" data-hl-pet-id="' +
        h.esc(pet.id) + '">' + h.esc(pet.petName || pet.id) + '</button>';
    }).join('');
    return (
      '<article class="hlc-guide-card hlc-guide-card--mine" data-hl-guide-id="' + h.esc(guide.id) + '">' +
      '<span class="hlc-guide-card__cat">' + h.esc(catLabel) + '</span>' +
      '<h3 class="hlc-guide-card__title">' + h.esc(guide.title || guide.id) + '</h3>' +
      '<p class="hlc-guide-card__meta">' +
      h.esc(h.t('guideMyGuideCompletion')) + ': ' + h.esc(String(pct) + '%') +
      '</p>' +
      (petLinks
        ? '<p class="hlc-guide-card__pets"><span class="hlc-guide-card__pets-label">' +
          h.esc(h.t('guideMyGuidePets')) + '</span> <span class="hlc-chips hlc-chips--inline">' + petLinks + '</span></p>'
        : '') +
      '<div class="hlc-guide-card__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-view" data-hl-guide-id="' +
      h.esc(guide.id) + '">' + h.esc(h.t('guideBrowseView')) + '</button>' +
      '</div></article>'
    );
  }

  function renderGuideBrowseCard_(state, guide, h) {
    var recLabels = (guide.recommendedRecords || []).slice(0, 4).map(function (rid) {
      return h.recordLabel ? h.recordLabel(rid) : rid;
    }).join(' · ');
    var catLabel = h.t('guideCat_' + (guide.category || 'general'));
    var focus = guide.todayFocus || guide.summary || '';
    return (
      '<article class="hlc-guide-card" data-hl-guide-id="' + h.esc(guide.id) + '">' +
      '<span class="hlc-guide-card__cat">' + h.esc(catLabel) + '</span>' +
      '<h3 class="hlc-guide-card__title">' + h.esc(guide.title || guide.id) + '</h3>' +
      '<p class="hlc-guide-card__species">' + h.esc(h.t('guideBrowseSpecies')) + ' ' + h.esc(guideSpeciesLabel_(guide)) + '</p>' +
      '<p class="hlc-guide-card__meta">' +
      h.esc(h.t('guideProfileDifficulty')) + ': ' + h.esc(difficultyLabel_(guide.difficulty, h)) +
      '</p>' +
      (focus
        ? '<p class="hlc-guide-card__focus">' + h.esc(h.t('guideBrowseTodayFocus')) + ': ' + h.esc(focus) + '</p>'
        : '') +
      (recLabels ? '<p class="hlc-guide-card__recs">' + h.esc(h.t('guideAccRecords')) + ': ' + h.esc(recLabels) + '</p>' : '') +
      '<div class="hlc-guide-card__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-view" data-hl-guide-id="' + h.esc(guide.id) + '">' +
      h.esc(h.t('guideBrowseView')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--sm" data-hl-action="guide-apply-pet" data-hl-guide-id="' + h.esc(guide.id) + '">' +
      h.esc(h.t('guideBrowseApply')) + '</button>' +
      '</div></article>'
    );
  }

  function renderGuideApplyPickSheet_(state, h) {
    var guideId = state.ui.guideApplyTargetId;
    var guide = guideId ? getGuideById_(state, guideId) : null;
    if (!guide) return null;
    var eligible = petsEligibleForGuide_(state, guide, state.pets);
    var rows = eligible.map(function (pet) {
      return (
        '<button type="button" class="hlc-guide-apply-pick__row" data-hl-action="guide-apply-select" data-hl-pet-id="' +
        h.esc(pet.id) + '" data-hl-guide-id="' + h.esc(guide.id) + '">' +
        '<span class="hlc-guide-apply-pick__name">' + h.esc(pet.petName || pet.id) + '</span>' +
        (pet.commonName ? '<span class="hlc-guide-apply-pick__sub">' + h.esc(pet.commonName) + '</span>' : '') +
        '</button>'
      );
    }).join('');
    return (
      '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
      '<div class="hlc-sheet hlc-sheet--guide hlc-sheet--guide-apply-pick" role="dialog">' +
      '<div class="hlc-sheet__handle"></div>' +
      '<h2 class="hlc-sheet__title">' + h.esc(h.t('guideApplyPickTitle')) + '</h2>' +
      '<p class="hlc-guide-disclaimer hlc-guide-disclaimer--compact">' + h.esc(guide.title || guide.id) + '</p>' +
      '<div class="hlc-guide-apply-pick__list">' + rows + '</div>' +
      '<div class="hlc-sheet__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="guide-apply-pick-back">' +
      h.esc(h.t('guideBrowseBackList')) + '</button>' +
      '</div></div></div>'
    );
  }

  function renderGuideDetailBlock_(guide, h) {
    if (!guide) return '';
    var mistakes = guide.commonMistakes && guide.commonMistakes.length
      ? '<ul class="hlc-guide-list">' + guide.commonMistakes.map(function (m) {
        return '<li>' + h.esc(m) + '</li>';
      }).join('') + '</ul>' : '';
    var dangers = guide.dangerSigns && guide.dangerSigns.length
      ? '<ul class="hlc-guide-list hlc-guide-list--danger">' + guide.dangerSigns.map(function (d) {
        return '<li>' + h.esc(d) + '</li>';
      }).join('') + '</ul>' : '';
    return (
      '<div class="hlc-guide-detail">' +
      '<p class="hlc-guide-focus">' + h.esc(guide.todayFocus || guide.summary || '') + '</p>' +
      '<p><strong>' + h.esc(h.t('guideAccEnv')) + '</strong> ' + h.esc(guide.environment.notes || '—') + '</p>' +
      '<p><strong>' + h.esc(h.t('guideAccFeed')) + '</strong> ' + h.esc(guide.feeding.notes || '—') + '</p>' +
      '<p><strong>' + h.esc(h.t('guideAccHealth')) + '</strong> ' + h.esc(guide.health.notes || '—') + '</p>' +
      (mistakes ? '<p><strong>' + h.esc(h.t('guideAccMistakes')) + '</strong></p>' + mistakes : '') +
      (dangers ? '<p><strong>' + h.esc(h.t('guideAccDanger')) + '</strong></p>' + dangers : '') +
      '<p class="hlc-guide-disclaimer">' + h.esc(guide.disclaimer || h.t('guideDisclaimer')) + '</p></div>'
    );
  }

  function resolveRecordAdviceProfile_(pet, guide) {
    if (!guide) return 'general';
    var gid = guide.id || '';
    var cat = guide.category || 'general';
    if (gid === 'aquatic_amphibian_general') return 'aquatic_amphibian';
    if (gid === 'frog_general' || gid === 'toad_general') return 'land_amphibian';
    if (isBeetleLarvaPet_(pet, guide)) return 'beetle_larva';
    if (isBeetleAdultPet_(pet, guide)) return 'beetle_adult';
    if (cat === 'freshwater_aquatics') return 'freshwater';
    if (cat === 'marine_aquatics') return 'marine';
    if (cat === 'reptiles') return 'reptile';
    if (cat === 'birds') return 'bird';
    if (cat === 'small_mammals') return 'mammal';
    if (cat === 'arthropod_exotics') return 'arthropod';
    if (cat === 'amphibians') return 'land_amphibian';
    return cat;
  }

  var RECORD_ADVICE_PROFILE_KEY = {
    humidity: {
      land_amphibian: 'guideRecordAdvice_humidity_land_amphibian',
      amphibians: 'guideRecordAdvice_humidity_land_amphibian',
    },
    water_temp: {
      aquatic_amphibian: 'guideRecordAdvice_water_temp_aquatic_amphibian',
      freshwater: 'guideRecordAdvice_water_temp_freshwater',
      freshwater_aquatics: 'guideRecordAdvice_water_temp_freshwater',
      marine: 'guideRecordAdvice_water_temp_marine',
      marine_aquatics: 'guideRecordAdvice_water_temp_marine',
    },
    ph: {
      aquatic_amphibian: 'guideRecordAdvice_ph_aquatic_amphibian',
      freshwater: 'guideRecordAdvice_ph_freshwater',
      freshwater_aquatics: 'guideRecordAdvice_ph_freshwater',
      marine: 'guideRecordAdvice_ph_marine',
      marine_aquatics: 'guideRecordAdvice_ph_marine',
    },
    ammonia: {
      freshwater: 'guideRecordAdvice_ammonia_freshwater',
      freshwater_aquatics: 'guideRecordAdvice_ammonia_freshwater',
      marine: 'guideRecordAdvice_ammonia_marine',
      marine_aquatics: 'guideRecordAdvice_ammonia_marine',
      aquatic_amphibian: 'guideRecordAdvice_ammonia_freshwater',
    },
    nitrite: {
      freshwater: 'guideRecordAdvice_ammonia_freshwater',
      freshwater_aquatics: 'guideRecordAdvice_ammonia_freshwater',
      marine: 'guideRecordAdvice_ammonia_marine',
      marine_aquatics: 'guideRecordAdvice_ammonia_marine',
      aquatic_amphibian: 'guideRecordAdvice_ammonia_freshwater',
    },
    salinity: {
      marine: 'guideRecordAdvice_salinity_marine',
      marine_aquatics: 'guideRecordAdvice_salinity_marine',
    },
    uvb: {
      reptile: 'guideRecordAdvice_uvb_reptile',
      reptiles: 'guideRecordAdvice_uvb_reptile',
    },
    weight: {
      bird: 'guideRecordAdvice_weight_bird',
      birds: 'guideRecordAdvice_weight_bird',
      beetle_larva: 'guideRecordAdvice_weight_beetle_larva',
      mammal: 'guideRecordAdvice_weight_mammal',
      small_mammals: 'guideRecordAdvice_weight_mammal',
    },
  };

  function lookupRecordAdviceTextKey_(pet, guide, recordType, h) {
    if (!guide || !recordType) return null;
    var hint = guide.recordHints && guide.recordHints[recordType];
    if (hint && hint.textKey) return hint.textKey;
    var profile = resolveRecordAdviceProfile_(pet, guide);
    var cat = guide.category || 'general';
    var map = RECORD_ADVICE_PROFILE_KEY[recordType];
    if (!map) return null;
    var key = map[profile] || map[cat] || map[guide.id];
    if (!key) return null;
    return h.t(key) !== key ? key : null;
  }

  function getCareAdviceForRecordType_(state, pet, recordType, h) {
    if (!pet || !recordType) return null;
    if (h) ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    if (!guide || !isRecordAllowedForGuide_(guide, recordType)) return null;
    var textKey = lookupRecordAdviceTextKey_(pet, guide, recordType, h);
    var hint = guide.recordHints && guide.recordHints[recordType];
    var adviceText = '';
    if (textKey) adviceText = h.t(textKey);
    var rangeText = hint ? formatRangeHint_(hint, h) : '';
    if (!adviceText && rangeText) {
      adviceText = rangeText;
      rangeText = '';
    }
    if (!adviceText) return null;
    if (rangeText && adviceText === rangeText) rangeText = '';
    return {
      adviceText: adviceText,
      rangeText: rangeText || '',
      allowed: true,
    };
  }

  function validateRecordValueAgainstGuide_(state, pet, recordType, rawValue, h) {
    if (!pet || !recordType) return { level: 'ok' };
    if (h) ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    if (!guide || !isRecordAllowedForGuide_(guide, recordType)) return { level: 'ok' };
    var hint = guide.recordHints && guide.recordHints[recordType];
    if (!hint || (hint.min == null && hint.max == null)) return { level: 'ok' };
    var n = parseFloat(String(rawValue || '').replace(',', '.'));
    if (isNaN(n)) return { level: 'ok' };
    var min = hint.min;
    var max = hint.max;
    var inRange = true;
    if (min != null && n < min) inRange = false;
    if (max != null && n > max) inRange = false;
    if (inRange) return { level: 'ok' };
    var span = 1;
    if (min != null && max != null) span = Math.max(max - min, 0.001);
    else if (max != null) span = Math.max(max, 0.001);
    else if (min != null) span = Math.max(min, 0.001);
    var deviation = 0;
    if (min != null && n < min) deviation = (min - n) / span;
    else if (max != null && n > max) deviation = (n - max) / span;
    var level = deviation > 0.35 ? 'urgent' : 'warn';
    return {
      level: level,
      messageKey: level === 'urgent' ? 'guideRecordUrgentDisclaimer' : 'guideHintOutOfRange',
    };
  }

  function renderRecordAdviceHint_(state, pet, recordType, h, rawValue) {
    var advice = getCareAdviceForRecordType_(state, pet, recordType, h);
    if (!advice) return '';
    var val = rawValue;
    if (val === undefined && state && state.ui) {
      val = state.ui.envValue != null ? state.ui.envValue : '';
    }
    var validation = validateRecordValueAgainstGuide_(state, pet, recordType, val, h);
    var badgeHtml = '';
    if (validation.level === 'warn') {
      badgeHtml = '<span class="hlc-record-advice__badge hlc-record-advice__badge--warn">' +
        h.esc(h.t('guideHintOutOfRange')) + '</span>';
    }
    var urgentHtml = validation.level === 'urgent'
      ? (
        '<span class="hlc-record-advice__badge hlc-record-advice__badge--urgent">' +
        h.esc(h.t('guideHintOutOfRange')) + '</span>' +
        '<p class="hlc-record-advice__urgent">' + h.esc(h.t('guideRecordUrgentDisclaimer')) + '</p>'
      )
      : '';
    var rangeHtml = advice.rangeText
      ? '<p class="hlc-record-advice__range">' + h.esc(advice.rangeText) + '</p>'
      : '';
    return (
      '<div class="hlc-record-advice">' +
      '<p class="hlc-record-advice__tip">' + h.esc(advice.adviceText) + '</p>' +
      rangeHtml + badgeHtml + urgentHtml +
      '</div>'
    );
  }

  function checkRecordValueWarning_(state, pet, recordId, rawValue, h) {
    var v = validateRecordValueAgainstGuide_(state, pet, recordId, rawValue, h);
    return v.level === 'warn' || v.level === 'urgent';
  }

  function missedRecommendedRecords_(state, pet, h, days) {
    var guide = getAppliedGuideForPet_(state, pet, h);
    if (!guide || !h.petLogs) return [];
    var recs = guide.recommendedRecords || [];
    if (!recs.length) return [];
    var logs = h.petLogs(pet.id) || [];
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days || 7));
    var cutoffKey = cutoff.toISOString().slice(0, 10);
    return recs.filter(function (rid) {
      return !logs.some(function (l) {
        return l.recordId === rid && String(l.date || '') >= cutoffKey;
      });
    });
  }

  function renderTrendsGuideMetrics_(state, pet, h) {
    ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    if (!guide) return '';
    syncProgressGuideId_(state, pet, guide);
    var pct = tutorialCompletion_(state, pet, guide);
    var series = h.buildDailyCompletionSeries && typeof h.buildDailyCompletionSeries === 'function'
      ? h.buildDailyCompletionSeries(pet, 7)
      : (h.weeklyCareStats && typeof h.weeklyCareStats === 'function'
        ? h.weeklyCareStats(pet).map(function (w) { return w.meta || w; })
        : []);
    var rated = series.filter(function (d) {
      return d && d.source === 'snapshot' && d.plannedTaskCount > 0 && typeof d.completionRate === 'number';
    });
    var questDisplay = rated.length
      ? (String(Math.round(rated.reduce(function (s, d) { return s + d.completionRate; }, 0) / rated.length * 100)) + '%')
      : h.t('trendNoPreciseRate');
    var missed = missedRecommendedRecords_(state, pet, h, 7);
    var missedLabels = missed.slice(0, 4).map(function (rid) {
      return h.recordLabel ? h.recordLabel(rid) : rid;
    }).join(' · ');
    var logs = h.petLogs ? h.petLogs(pet.id) || [] : [];
    var abn = logs.filter(function (l) { return l.type === 'abnormality'; }).length;
    var catId = inferCategoryForPet_(pet);
    return (
      '<article class="hlc-trend-card hlc-trend-card--wide hlc-guide-metrics">' +
      '<h3>' + h.esc(h.t('guideTrendLearningTitle')) + '</h3>' +
      '<div class="hlc-guide-metrics__grid">' +
      '<p><span>' + h.esc(h.t('guideTutorialProgress')) + '</span><strong>' + h.esc(String(pct)) + '%</strong></p>' +
      '<p><span>' + h.esc(h.t('guideTrendQuest7d')) + '</span><strong>' + h.esc(questDisplay) + '</strong></p>' +
      '<p><span>' + h.esc(h.t('guideTrendAbnCount')) + '</span><strong>' + h.esc(String(abn)) + '</strong></p>' +
      '<p><span>' + h.esc(h.t('guideProfileCategory')) + '</span><strong>' + h.esc(h.t('guideCat_' + catId)) + '</strong></p>' +
      '</div>' +
      (missedLabels
        ? '<p class="hlc-guide-metrics__missed"><span>' + h.esc(h.t('guideTrendMissedRecs')) + '</span> ' + h.esc(missedLabels) + '</p>'
        : '<p class="hlc-guide-metrics__missed hlc-guide-metrics__missed--ok">' + h.esc(h.t('guideTrendMissedNone')) + '</p>') +
      '</article>'
    );
  }

  function exportGuideArchiveJson_(state, pet, h) {
    var guide = getAppliedGuideForPet_(state, pet, h);
    var prog = progressForPet_(state, pet.id);
    return JSON.stringify({
      petId: pet.id,
      petName: pet.petName,
      careGuideId: guide ? guide.id : null,
      guideTitle: guide ? guide.title : null,
      category: guide ? guide.category : inferCategoryForPet_(pet),
      difficulty: guide ? guide.difficulty : null,
      recommendedRecords: guide ? guide.recommendedRecords : [],
      tutorialProgress: prog,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  function exportTutorialProgressCsv_(state, pet, h) {
    var guide = getAppliedGuideForPet_(state, pet, h);
    var prog = progressForPet_(state, pet.id);
    var steps = guide && guide.tutorialSteps ? guide.tutorialSteps : [];
    var lines = ['step_id,title,completed,updated_at'];
    steps.forEach(function (step) {
      var title = step.titleKey ? h.t(step.titleKey) : (step.title || step.id);
      var done = prog.completedStepIds.indexOf(step.id) >= 0 ? 'yes' : 'no';
      lines.push([
        step.id,
        '"' + String(title).replace(/"/g, '""') + '"',
        done,
        prog.updatedAt || '',
      ].join(','));
    });
    if (!steps.length) {
      lines.push(['—', '"—"', '0', prog.updatedAt || ''].join(','));
    }
    return lines.join('\n');
  }

  function renderProfileArchive_(state, pet, h) {
    ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    var catId = inferCategoryForPet_(pet);
    var pct = guide ? tutorialCompletion_(state, pet, guide) : 0;
    var stageNote = guide ? lifeStageNoteForPet_(guide, pet, h) : '';
    var recHtml = '';
    if (guide && guide.recommendedRecords && guide.recommendedRecords.length) {
      recHtml = '<div class="hlc-guide-rec-chips">' + guide.recommendedRecords.map(function (rid) {
        var label = h.recordLabel ? h.recordLabel(rid) : rid;
        return '<span class="hlc-chip hlc-chip--compact">' + h.esc(label) + '</span>';
      }).join('') + '</div>';
    }
    var envWizardHtml = '';
    if (pet.wizardEnvSetup && typeof pet.wizardEnvSetup === 'object') {
      var envLines = Object.keys(pet.wizardEnvSetup).filter(function (k) { return pet.wizardEnvSetup[k]; }).map(function (k) {
        var lk = 'wizardEnv_' + k;
        var label = h.t(lk) !== lk ? h.t(lk) : k;
        return label + ': ' + pet.wizardEnvSetup[k];
      });
      if (envLines.length) {
        envWizardHtml = '<div><dt>' + h.esc(h.t('wizardProfileEnvSetup')) + '</dt><dd>' +
          h.esc(envLines.join(' · ')) + '</dd></div>';
      }
    }
    return (
      '<dl class="hlc-dl hlc-dl--guide">' +
      '<div><dt>' + h.esc(h.t('guideProfileCategory')) + '</dt><dd>' + h.esc(h.t('guideCat_' + catId)) + '</dd></div>' +
      '<div><dt>' + h.esc(h.t('lifeStage')) + '</dt><dd>' + h.esc(pet.lifeStage || '—') + '</dd></div>' +
      (stageNote ? '<div><dt>' + h.esc(h.t('guideProfileLifeStageNote')) + '</dt><dd>' + h.esc(stageNote) + '</dd></div>' : '') +
      '<div><dt>' + h.esc(h.t('guideProfileDifficulty')) + '</dt><dd>' + h.esc(guide ? difficultyLabel_(guide.difficulty, h) : h.t('guideNotSet')) + '</dd></div>' +
      '<div><dt>' + h.esc(h.t('guideProfileApplied')) + '</dt><dd>' + h.esc(guide ? (guide.title || guide.id) : h.t('guideNotApplied')) + '</dd></div>' +
      envWizardHtml +
      (guide && guide.systemInfo ? '<div><dt>' + h.esc(h.t('guideProfileMarineSystem')) + '</dt><dd>' + h.esc(guide.systemInfo) + '</dd></div>' : '') +
      (guide && guide.profileEnclosure ? '<div><dt>' + h.esc(h.t('guideProfileMammalEnclosure')) + '</dt><dd>' + h.esc(guide.profileEnclosure) + '</dd></div>' : '') +
      (guide && guide.profileFeeding ? '<div><dt>' + h.esc(h.t('guideProfileMammalFeeding')) + '</dt><dd>' + h.esc(guide.profileFeeding) + '</dd></div>' : '') +
      (guide && guide.profileCleaning ? '<div><dt>' + h.esc(h.t('guideProfileMammalCleaning')) + '</dt><dd>' + h.esc(guide.profileCleaning) + '</dd></div>' : '') +
      (guide && guide.profileHealth ? '<div><dt>' + h.esc(h.t('guideProfileMammalHealthWatch')) + '</dt><dd>' + h.esc(guide.profileHealth) + '</dd></div>' : '') +
      (guide && guide.riskLevel ? '<div><dt>' + h.esc(h.t('guideProfileRiskLevel')) + '</dt><dd>' + h.esc(guide.riskLevel) + '</dd></div>' : '') +
      (guide && guide.profileOperationReminder ? '<div><dt>' + h.esc(h.t('guideProfileOperationReminder')) + '</dt><dd>' + h.esc(guide.profileOperationReminder) + '</dd></div>' : '') +
      (recHtml ? '<div class="hlc-dl--full"><dt>' + h.esc(h.t('guideAccRecords')) + '</dt><dd>' + recHtml + '</dd></div>' : '') +
      '<div><dt>' + h.esc(h.t('guideTutorialProgress')) + '</dt><dd>' + h.esc(guide ? String(pct) + '%' : '—') + '</dd></div>' +
      '</dl>' +
      '<div class="hlc-profile-actions hlc-profile-actions--guide">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="guide-export-json">' + h.esc(h.t('guideExportJson')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="guide-export-tutorial-csv">' + h.esc(h.t('guideExportTutorialCsv')) + '</button>' +
      '</div>'
    );
  }

  function renderSheetHintHtml_(state, pet, recordId, h) {
    return renderRecordAdviceHint_(state, pet, recordId, h);
  }

  function renderSheet_(state, pet, h) {
    ensureKnowledgeBase_(state, h);
    if (state.ui.sheet === 'guide-apply-pick') {
      return renderGuideApplyPickSheet_(state, h);
    }
    if (state.ui.sheet !== 'guide-browse') return null;
    var cg = careGuideState_(state);
    var petList = petsArray_(state.pets);
    syncActiveCareGuides_(state, h, petList);
    var myGuideIds = appliedGuideIdsForPets_(petList);
    var myCards = myGuideIds.map(function (gid) {
      var g = cg.careGuides[gid];
      if (!g) return '';
      return renderMyPetGuideCard_(state, g, petList, h);
    }).filter(Boolean).join('');
    var mySection = (
      '<section class="hlc-guide-browse-section hlc-guide-browse-section--mine">' +
      '<h3 class="hlc-guide-browse-section__title">' + h.esc(h.t('guideMyPetsSection')) + '</h3>' +
      (myCards
        ? '<div class="hlc-guide-card-grid hlc-guide-card-grid--mine">' + myCards + '</div>'
        : '<p class="hlc-guide-empty-inline">' + h.esc(h.t('guideMyPetsEmpty')) + '</p>') +
      '</section>'
    );
    var cats = cg.careGuideCategories.map(function (cid) {
      var active = cg.selectedCareCategory === cid ? ' is-active' : '';
      return '<button type="button" class="hlc-chip' + active + '" data-hl-action="guide-filter-cat" data-hl-guide-cat="' + h.esc(cid) + '">' +
        h.esc(h.t('guideCat_' + cid)) + '</button>';
    }).join('');
    var diffs = ['all', 'easy', 'moderate', 'advanced', 'restricted'].map(function (d) {
      var active = cg.selectedCareDifficulty === d ? ' is-active' : '';
      var label = d === 'all' ? h.t('guideFilterAll') : difficultyLabel_(d, h);
      return '<button type="button" class="hlc-chip' + active + '" data-hl-action="guide-filter-diff" data-hl-guide-diff="' + h.esc(d) + '">' +
        h.esc(label) + '</button>';
    }).join('');
    var stages = ['all', 'juvenile', 'subadult', 'adult', 'egg', 'larva', 'pupa'].map(function (s) {
      var active = cg.selectedCareLifeStage === s ? ' is-active' : '';
      var label = s === 'all' ? h.t('guideFilterAll') : (h.t('guideLifeStage_' + s) !== 'guideLifeStage_' + s ? h.t('guideLifeStage_' + s) : s);
      return '<button type="button" class="hlc-chip' + active + '" data-hl-action="guide-filter-stage" data-hl-guide-stage="' + h.esc(s) + '">' +
        h.esc(label) + '</button>';
    }).join('');
    var ids = filteredGuides_(state);
    var cards = ids.map(function (gid) {
      return renderGuideBrowseCard_(state, cg.careGuides[gid], h);
    }).join('');
    var detailGuide = cg.browseGuideDetailId ? getGuideById_(state, cg.browseGuideDetailId) : null;
    var detailHtml = detailGuide ? (
      '<div class="hlc-guide-browse-detail">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="guide-view-close">' + h.esc(h.t('guideBrowseBackList')) + '</button>' +
      '<h3>' + h.esc(detailGuide.title || detailGuide.id) + '</h3>' +
      renderGuideDetailBlock_(detailGuide, h) +
      '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="guide-apply-pet" data-hl-guide-id="' + h.esc(detailGuide.id) + '">' +
      h.esc(h.t('guideBrowseApply')) + '</button>' +
      '</div>'
    ) : '';
    var libraryBody = detailHtml || (
      '<div class="hlc-guide-card-grid hlc-guide-card-grid--library">' +
      (cards || '<p class="hlc-guide-empty-inline">' + h.esc(h.t('guideBrowseNoResults')) + '</p>') +
      '</div>'
    );
    return (
      '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
      '<div class="hlc-sheet hlc-sheet--guide hlc-sheet--guide-browse" role="dialog">' +
      '<div class="hlc-sheet__handle"></div>' +
      '<h2 class="hlc-sheet__title">' + h.esc(h.t('guideCenterBrowse')) + '</h2>' +
      '<p class="hlc-guide-disclaimer hlc-guide-disclaimer--compact">' + h.esc(h.t('guideBrowseHint')) + '</p>' +
      mySection +
      '<section class="hlc-guide-browse-section hlc-guide-browse-section--library">' +
      '<h3 class="hlc-guide-browse-section__title">' + h.esc(h.t('guideLibrarySection')) + '</h3>' +
      '<p class="hlc-guide-disclaimer hlc-guide-disclaimer--compact">' + h.esc(h.t('guideBrowseLibraryHint')) + '</p>' +
      '<label class="hlc-sheet-field hlc-guide-search">' +
      '<span class="hlc-sheet-section__label">' + h.esc(h.t('guideBrowseSearch')) + '</span>' +
      '<input type="search" class="hlc-sheet-input" value="' + h.esc(cg.searchKeyword || '') + '" data-hl-field="guideSearch" placeholder="' + h.esc(h.t('guideBrowseSearchPlaceholder')) + '" /></label>' +
      '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + h.esc(h.t('guideBrowseFilterCat')) + '</span>' +
      '<div class="hlc-chips hlc-chips--wrap"><button type="button" class="hlc-chip' + (cg.selectedCareCategory === 'all' ? ' is-active' : '') + '" data-hl-action="guide-filter-cat" data-hl-guide-cat="all">' + h.esc(h.t('guideFilterAll')) + '</button>' + cats + '</div></div>' +
      '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + h.esc(h.t('guideBrowseFilterDiff')) + '</span><div class="hlc-chips hlc-chips--wrap">' + diffs + '</div></div>' +
      '<div class="hlc-sheet-section"><span class="hlc-sheet-section__label">' + h.esc(h.t('guideBrowseFilterStage')) + '</span><div class="hlc-chips hlc-chips--wrap">' + stages + '</div></div>' +
      libraryBody +
      '</section>' +
      '<div class="hlc-sheet__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="close-sheet">' + h.esc(h.t('cancel')) + '</button>' +
      '</div></div></div>'
    );
  }

  function getQuestKeys_(state, pet, h) {
    return syncCareGuideTasksToPet_(state, pet, h);
  }

  function questRecordForKey_(qKey) {
    return GUIDE_QUEST_RECORDS[qKey] || '';
  }

  function logNumericValue_(log) {
    if (!log) return 0;
    var v = log.value != null ? log.value : (log.values && log.values.value);
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function trendValuesForRecord_(logs, recordId, limit) {
    return logs.filter(function (l) { return l.recordId === recordId; })
      .slice(0, limit || 7)
      .reverse()
      .map(function (l) { return logNumericValue_(l); })
      .filter(function (n) { return n > 0; });
  }

  function trendRangeLabel_(values, unit) {
    if (!values.length) return '';
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    if (min === max) return String(min) + (unit || '');
    return String(min) + '–' + String(max) + (unit || '');
  }

  function trendSparklineHtml_(values, width, height) {
    if (!values.length) return '';
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    var span = max - min || 1;
    var pts = values.map(function (v, i) {
      var x = values.length === 1 ? width / 2 : (i / (values.length - 1)) * width;
      var y = height - ((v - min) / span) * (height - 4) - 2;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    return '<svg class="hlc-spark hlc-spark--guide" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none"><polyline fill="none" stroke="currentColor" stroke-width="2" points="' + pts + '"/></svg>';
  }

  function trendUnitForRecord_(rid) {
    if (rid === 'ph') return '';
    if (rid === 'water_temp') return '°C';
    if (rid === 'salinity') return '';
    if (rid === 'kh') return ' dKH';
    if (rid === 'ca' || rid === 'mg') return ' ppm';
    if (rid === 'tds' || rid === 'gh') return '';
    if (rid === 'po4' || rid === 'ammonia' || rid === 'nitrite' || rid === 'nitrate') return ' ppm';
    if (rid === 'weight') return ' g';
    return ' ppm';
  }

  function trendPresenceValues_(logs, recordId, limit) {
    return logs.filter(function (l) { return l.recordId === recordId; })
      .slice(0, limit || 7)
      .reverse()
      .map(function () { return 1; });
  }

  function renderVitalsTrends_(state, pet, guide, h, titleKey, emptyKey, captionKey) {
    if (!h.petLogs || typeof h.petLogs !== 'function') return '';
    var logs = h.petLogs(pet.id) || [];
    var ids = guide.trendRecordIds || ['weight', 'stool'];
    var rows = ids.map(function (rid) {
      var label = h.recordLabel ? h.recordLabel(rid) : rid;
      if (rid === 'weight') {
        var wVals = trendValuesForRecord_(logs, rid, 7);
        if (!wVals.length) return '';
        return (
          '<div class="hlc-guide-water-row">' +
          '<span class="hlc-guide-water-row__label">' + h.esc(label) + '</span>' +
          trendSparklineHtml_(wVals, 88, 28) +
          '<strong class="hlc-guide-water-row__val">' + h.esc(trendRangeLabel_(wVals, trendUnitForRecord_(rid))) + '</strong></div>'
        );
      }
      var presence = trendPresenceValues_(logs, rid, 7);
      if (!presence.length) return '';
      return (
        '<div class="hlc-guide-water-row">' +
        '<span class="hlc-guide-water-row__label">' + h.esc(label) + '</span>' +
        trendSparklineHtml_(presence, 88, 28) +
        '<strong class="hlc-guide-water-row__val">' + h.esc(String(presence.length) + ' ' + h.t('guideTrendVitalsLogCount')) + '</strong></div>'
      );
    }).filter(Boolean).join('');
    if (!rows) {
      return (
        '<article class="hlc-trend-card hlc-trend-card--wide hlc-guide-water-trend">' +
        '<h3>' + h.esc(h.t(titleKey)) + '</h3>' +
        '<p class="hlc-empty--inline">' + h.esc(h.t(emptyKey)) + '</p></article>'
      );
    }
    return (
      '<article class="hlc-trend-card hlc-trend-card--wide hlc-guide-water-trend">' +
      '<h3>' + h.esc(h.t(titleKey)) + '</h3>' +
      '<div class="hlc-guide-water-rows">' + rows + '</div>' +
      '<span class="hlc-trend-caption">' + h.esc(h.t(captionKey)) + '</span></article>'
    );
  }

  function renderTrendsLearning_(state, pet, h) {
    ensureKnowledgeBase_(state, h);
    var guide = getAppliedGuideForPet_(state, pet, h);
    if (!guide) return '';
    var metrics = renderTrendsGuideMetrics_(state, pet, h);
    if (guide.category === 'birds') {
      return metrics + renderVitalsTrends_(state, pet, guide, h, 'guideTrendBirdVitals', 'guideTrendBirdEmpty', 'guideTrendBirdCaption');
    }
    if (guide.category === 'small_mammals') {
      return metrics + renderVitalsTrends_(state, pet, guide, h, 'guideTrendMammalVitals', 'guideTrendMammalEmpty', 'guideTrendMammalCaption');
    }
    if (guide.category !== 'freshwater_aquatics' && guide.category !== 'marine_aquatics') return metrics;
    if (!h.petLogs || typeof h.petLogs !== 'function') return '';
    var logs = h.petLogs(pet.id) || [];
    var ids = guide.trendRecordIds || ['water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate'];
    var rows = ids.map(function (rid) {
      var vals = trendValuesForRecord_(logs, rid, 7);
      if (!vals.length) return '';
      var label = h.recordLabel ? h.recordLabel(rid) : rid;
      var unit = trendUnitForRecord_(rid);
      return (
        '<div class="hlc-guide-water-row">' +
        '<span class="hlc-guide-water-row__label">' + h.esc(label) + '</span>' +
        trendSparklineHtml_(vals, 88, 28) +
        '<strong class="hlc-guide-water-row__val">' + h.esc(trendRangeLabel_(vals, unit)) + '</strong></div>'
      );
    }).filter(Boolean).join('');
    if (!rows) {
      return (
        metrics +
        '<article class="hlc-trend-card hlc-trend-card--wide hlc-guide-water-trend">' +
        '<h3>' + h.esc(h.t('guideTrendWaterQuality')) + '</h3>' +
        '<p class="hlc-empty--inline">' + h.esc(h.t('guideTrendWaterEmpty')) + '</p></article>'
      );
    }
    return (
      metrics +
      '<article class="hlc-trend-card hlc-trend-card--wide hlc-guide-water-trend">' +
      '<h3>' + h.esc(h.t('guideTrendWaterQuality')) + '</h3>' +
      '<div class="hlc-guide-water-rows">' + rows + '</div>' +
      '<span class="hlc-trend-caption">' + h.esc(h.t('guideTrendWaterCaption')) + '</span></article>'
    );
  }

  function handleAction_(act, ctx) {
    var state = ctx.state;
    ensureState(state, ctx);
    var cg = careGuideState_(state);
    if (act === 'guide-toggle-acc') {
      var accId = ctx.el && ctx.el.getAttribute('data-hl-guide-acc');
      if (accId) {
        var idx = state.ui.guideAccordionOpen.indexOf(accId);
        if (idx >= 0) state.ui.guideAccordionOpen.splice(idx, 1);
        else state.ui.guideAccordionOpen.push(accId);
      }
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-open-all') {
      state.ui.sheet = 'guide-browse';
      cg.browseGuideDetailId = null;
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-advice-expand') {
      var expandPet = ctx.getActivePet && ctx.getActivePet();
      state.ui.guideAdviceExpanded = true;
      state.ui.guideAdviceExpandedPetId = expandPet ? expandPet.id : '';
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-advice-collapse') {
      state.ui.guideAdviceExpanded = false;
      state.ui.guideAdviceExpandedPetId = '';
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-open-pet') {
      var openPid = ctx.el && ctx.el.getAttribute('data-hl-pet-id');
      if (openPid) {
        state.activePetId = openPid;
        state.phase = 'board';
        state.boardTab = 'cards';
        ctx.saveState(); ctx.render(); return true;
      }
    }
    if (act === 'guide-filter-cat') {
      cg.selectedCareCategory = (ctx.el && ctx.el.getAttribute('data-hl-guide-cat')) || 'all';
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-filter-diff') {
      cg.selectedCareDifficulty = (ctx.el && ctx.el.getAttribute('data-hl-guide-diff')) || 'all';
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-filter-stage') {
      cg.selectedCareLifeStage = (ctx.el && ctx.el.getAttribute('data-hl-guide-stage')) || 'all';
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-view') {
      cg.browseGuideDetailId = ctx.el && ctx.el.getAttribute('data-hl-guide-id');
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-view-close') {
      cg.browseGuideDetailId = null;
      ctx.saveState(); ctx.render(); return true;
    }
    if (act === 'guide-apply-pet') {
      var gid = ctx.el && ctx.el.getAttribute('data-hl-guide-id');
      if (state.phase === 'wizard' && gid) {
        var w = state.ui.wizard;
        if (w) {
          w.careGuideId = gid;
          w.applyGuide = true;
          w.guideManualPick = true;
          w.recordsInitialized = false;
          state.ui.sheet = null;
        }
        ctx.saveState(); ctx.render(); return true;
      }
      if (!gid) return true;
      var guideToApply = getGuideById_(state, gid);
      if (!guideToApply) return true;
      var eligiblePets = petsEligibleForGuide_(state, guideToApply, state.pets);
      if (!eligiblePets.length) {
        state.toast = ctx.t('guideBrowseNoEligiblePet');
        ctx.saveState(); ctx.render();
        if (ctx.clearToast) ctx.clearToast();
        return true;
      }
      if (eligiblePets.length === 1) {
        applyGuideToPet_(state, eligiblePets[0], gid, ctx, ctx);
        state.ui.sheet = null;
        state.ui.guideApplyTargetId = null;
        cg.browseGuideDetailId = null;
        state.toast = ctx.t('guideApplyDone');
        ctx.saveState(); ctx.render();
        if (ctx.clearToast) ctx.clearToast();
        return true;
      }
      state.ui.sheet = 'guide-apply-pick';
      state.ui.guideApplyTargetId = gid;
      ctx.saveState(); ctx.render();
      return true;
    }
    if (act === 'guide-apply-select') {
      var selPid = ctx.el && ctx.el.getAttribute('data-hl-pet-id');
      var selGid = (ctx.el && ctx.el.getAttribute('data-hl-guide-id')) || state.ui.guideApplyTargetId;
      var selPet = petsArray_(state.pets).filter(function (p) { return p.id === selPid; })[0];
      if (selPet && selGid) {
        applyGuideToPet_(state, selPet, selGid, ctx, ctx);
        state.ui.sheet = 'guide-browse';
        state.ui.guideApplyTargetId = null;
        cg.browseGuideDetailId = null;
        state.toast = ctx.t('guideApplyDone');
        ctx.saveState(); ctx.render();
        if (ctx.clearToast) ctx.clearToast();
      }
      return true;
    }
    if (act === 'guide-apply-pick-back') {
      state.ui.sheet = 'guide-browse';
      state.ui.guideApplyTargetId = null;
      ctx.saveState(); ctx.render();
      return true;
    }
    if (act === 'guide-tutorial-toggle') {
      var stepId = ctx.el && ctx.el.getAttribute('data-hl-step-id');
      var petT = ctx.getActivePet && ctx.getActivePet();
      if (petT && stepId) {
        var progT = progressForPet_(state, petT.id);
        var si = progT.completedStepIds.indexOf(stepId);
        if (si >= 0) progT.completedStepIds.splice(si, 1);
        else progT.completedStepIds.push(stepId);
        progT.updatedAt = new Date().toISOString();
        ctx.saveState(); ctx.render();
      }
      return true;
    }
    if (act === 'guide-export-json') {
      var petJ = ctx.getActivePet && ctx.getActivePet();
      if (petJ && ctx.downloadText) {
        ctx.downloadText((petJ.petName || 'pet') + '-care-guide.json', exportGuideArchiveJson_(state, petJ, ctx), 'application/json');
        state.toast = ctx.t('guideExportJsonDone');
        ctx.saveState(); ctx.render();
        if (ctx.clearToast) ctx.clearToast();
      }
      return true;
    }
    if (act === 'guide-export-tutorial-csv') {
      var petC = ctx.getActivePet && ctx.getActivePet();
      if (petC && ctx.downloadText) {
        ctx.downloadText((petC.petName || 'pet') + '-tutorial-progress.csv', exportTutorialProgressCsv_(state, petC, ctx), 'text/csv');
        state.toast = ctx.t('guideExportTutorialCsvDone');
        ctx.saveState(); ctx.render();
        if (ctx.clearToast) ctx.clearToast();
      }
      return true;
    }
    return false;
  }

  global.MCHusbandryCareGuide = {
    defaultCareGuideState: defaultCareGuideState_,
    createEmptyCareGuide: createEmptyCareGuide_,
    CATEGORY_IDS: CATEGORY_IDS,
    ensureState: function (state, h) { ensureState(state, h || null); },
    careGuideState: careGuideState_,
    syncActiveCareGuides: syncActiveCareGuides_,
    inferCategoryForPet: inferCategoryForPet_,
    matchCareGuide: matchCareGuide_,
    matchCareGuideForPet: matchCareGuideForPet_,
    petsEligibleForGuide: function (state, guide, pets) {
      return petsEligibleForGuide_(state, guide, pets);
    },
    applyGuideToPet: function (state, pet, guideId, h, ctx) {
      return applyGuideToPet_(state, pet, guideId, h || null, ctx || null);
    },
    getActiveCareGuides: getActiveCareGuides_,
    getActiveCareCategories: getActiveCareCategories_,
    shouldShowCareGuide: shouldShowCareGuide_,
    getCareGuideRemindersForPets: getCareGuideRemindersForPets_,
    getSuggestedTasksForPet: getSuggestedTasksForPet_,
    buildDailyTasksForPet: buildDailyTasksForPet_,
    buildDailyTasksForAllPets: buildDailyTasksForAllPets_,
    syncCareGuideTasksToPet: syncCareGuideTasksToPet_,
    getGuideById: getGuideById_,
    getAppliedGuideForPet: function (state, pet, h) { return getAppliedGuideForPet_(state, pet, h || null); },
    getRecommendedRecordsForPet: getRecommendedRecordsForPet_,
    getAllowedRecordTypesForPet: function (state, pet, allRecordIds, h) {
      return getAllowedRecordTypesForPet_(state, pet, allRecordIds, h || null);
    },
    isRecordAllowedForGuide: function (guide, recordId) {
      return isRecordAllowedForGuide_(guide, recordId);
    },
    getRecommendedRecordTypesForPet: getRecommendedRecordTypesForPet_,
    getQuestKeys: getQuestKeys_,
    questRecordForKey: questRecordForKey_,
    checkRecordValueWarning: checkRecordValueWarning_,
    getCareAdviceForRecordType: getCareAdviceForRecordType_,
    validateRecordValueAgainstGuide: validateRecordValueAgainstGuide_,
    renderRecordAdviceHint: renderRecordAdviceHint_,
    getDangerSignsForPet: getDangerSignsForPet_,
    getActiveDangerAlerts: getActiveDangerAlerts_,
    renderDangerAlertWidget: renderDangerAlertWidget_,
    renderAbnormalityDangerHint: renderAbnormalityDangerHint_,
    getLifeStageTips: getLifeStageTips_,
    getLifeStageTasks: getLifeStageTasks_,
    getLifeStageRecommendedRecords: getLifeStageRecommendedRecords_,
    getLifeStageFocusTip: getLifeStageFocusTip_,
    resolveCanonicalLifeStage: resolveCanonicalLifeStage_,
    renderCareGuideEmptyHint: renderCareGuideEmptyHint_,
    renderCenterWidget: renderCenterWidget_,
    renderTodayWidget: renderCenterWidget_,
    renderAdviceBlock: renderAdviceBlock_,
    renderProfileArchive: renderProfileArchive_,
    renderTrendsLearning: renderTrendsLearning_,
    renderTutorialPanel: renderTutorialPanel_,
    renderSheetHintHtml: renderSheetHintHtml_,
    renderSheet: renderSheet_,
    handleAction: handleAction_,
  };
})(typeof window !== 'undefined' ? window : this);
