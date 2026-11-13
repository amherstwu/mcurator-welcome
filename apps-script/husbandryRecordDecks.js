/**
 * Husbandry Log — record card decks per care type.
 */
(function (global) {
  'use strict';

  var DECKS = {
    'beetle-larva': ['photo', 'feeding', 'substrate', 'frass', 'humidity', 'weight', 'instar', 'molt', 'pupation', 'egg_laying', 'abnormality', 'note'],
    'beetle-adult': ['photo', 'feeding', 'substrate', 'humidity', 'weight', 'molt', 'pupation', 'egg_laying', 'insect_status', 'abnormality', 'note'],
    mantis: ['photo', 'feeding', 'insect_status', 'instar', 'substrate', 'humidity', 'weight', 'molt', 'abnormality', 'note'],
    tarantula: ['photo', 'feeding', 'humidity', 'molt', 'premolt', 'insect_status', 'refused', 'substrate', 'activity', 'note', 'abnormality'],
    turtle: ['photo', 'feeding', 'basking', 'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'uvb', 'shell', 'stool', 'activity', 'abnormality'],
    tortoise: ['photo', 'feeding', 'basking', 'temperature', 'humidity', 'substrate', 'shell', 'stool', 'activity', 'abnormality'],
    'aquatic-amphibian': ['photo', 'feeding', 'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'humidity', 'skin', 'gill', 'activity', 'weight', 'abnormality', 'note'],
    snake: ['photo', 'feeding', 'refused', 'weight', 'hotspot', 'cold_zone', 'temperature', 'humidity', 'shedding', 'stool', 'activity', 'abnormality'],
    'arboreal-gecko': ['photo', 'feeding', 'insect_status', 'humidity', 'hotspot', 'temperature', 'uvb', 'calcium', 'weight', 'shedding', 'stool', 'activity', 'abnormality'],
    'general-reptile': ['photo', 'feeding', 'hotspot', 'cold_zone', 'temperature', 'humidity', 'uvb', 'calcium', 'weight', 'shedding', 'substrate', 'activity', 'abnormality', 'note'],
    aquarium: ['photo', 'feeding', 'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'activity', 'skin', 'abnormality', 'note'],
    'shrimp-aquarium': ['photo', 'water_temp', 'ph', 'tds', 'gh', 'kh', 'ammonia', 'water_change', 'molt', 'egg_laying', 'activity', 'note', 'abnormality'],
    'crayfish-aquarium': ['photo', 'feeding', 'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'molt', 'activity', 'abnormality', 'note'],
    'planted-tank': ['photo', 'water_temp', 'ph', 'nitrate', 'water_change', 'activity', 'note', 'abnormality'],
    'marine-fish': ['photo', 'feeding', 'salinity', 'water_temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'water_change', 'activity', 'skin', 'abnormality', 'note'],
    'coral-reef': ['photo', 'salinity', 'water_temp', 'kh', 'ca', 'mg', 'nitrate', 'po4', 'aquarium_light', 'water_flow', 'coral_open', 'abnormality', 'note'],
    'anemone-marine': ['photo', 'salinity', 'water_temp', 'aquarium_light', 'water_flow', 'coral_open', 'activity', 'abnormality', 'note'],
    'hermit-marine': ['photo', 'feeding', 'salinity', 'water_temp', 'molt', 'activity', 'abnormality', 'note'],
    'reef-tank': ['photo', 'salinity', 'water_temp', 'kh', 'ca', 'mg', 'nitrate', 'po4', 'water_change', 'aquarium_light', 'note', 'abnormality'],
    'finch-bird': ['photo', 'weight', 'feeding', 'drinking', 'feather', 'stool', 'activity', 'cage_clean', 'note', 'abnormality'],
    'parrot-bird': ['photo', 'weight', 'feeding', 'drinking', 'feather', 'stool', 'activity', 'cage_clean', 'note', 'abnormality'],
    'chick-bird': ['photo', 'weight', 'feeding', 'crop', 'stool', 'temperature', 'activity', 'note', 'abnormality'],
    'raptor-bird': ['photo', 'weight', 'note', 'abnormality'],
    'hamster-mammal': ['photo', 'weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean', 'note', 'abnormality'],
    'guinea-pig-mammal': ['photo', 'weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean', 'note', 'abnormality'],
    'rabbit-mammal': ['photo', 'weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean', 'note', 'abnormality'],
    'hedgehog-mammal': ['photo', 'weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean', 'temperature', 'note', 'abnormality'],
    'sugar-glider-mammal': ['photo', 'weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean', 'note', 'abnormality'],
    'chinchilla-mammal': ['photo', 'weight', 'feeding', 'drinking', 'stool', 'activity', 'teeth', 'fur', 'cage_clean', 'temperature', 'note', 'abnormality'],
    'scorpion-arthropod': ['photo', 'feeding', 'humidity', 'temperature', 'molt', 'premolt', 'substrate', 'hiding', 'refused', 'insect_status', 'note', 'abnormality'],
    'centipede-arthropod': ['photo', 'feeding', 'humidity', 'molt', 'premolt', 'substrate', 'hiding', 'refused', 'insect_status', 'note', 'abnormality'],
    'isopod-arthropod': ['photo', 'humidity', 'feeding', 'substrate', 'egg_laying', 'mortality', 'insect_status', 'note', 'abnormality'],
    'millipede-arthropod': ['photo', 'humidity', 'feeding', 'substrate', 'molt', 'calcium', 'insect_status', 'note', 'abnormality'],
    'land-hermit-arthropod': ['photo', 'humidity', 'temperature', 'feeding', 'substrate', 'shell', 'molt', 'salinity', 'note', 'abnormality'],
    'terrarium-vivarium': ['photo', 'humidity', 'aquarium_light', 'substrate', 'plant_status', 'water_change', 'note', 'abnormality'],
    'plant-terrarium': ['photo', 'aquarium_light', 'humidity', 'substrate', 'plant_status', 'note', 'abnormality'],
    'general-insect': ['photo', 'feeding', 'insect_status', 'instar', 'substrate', 'humidity', 'weight', 'molt', 'pupation', 'egg_laying', 'abnormality', 'note'],
    default: ['photo', 'feeding', 'weight', 'note', 'temperature', 'humidity', 'insect_status', 'activity', 'abnormality'],
  };

  var EXTRA_META = {
    refused: { titleKey: 'recordRefused', hintKey: 'hintFeeding', icon: 'feeding', logType: 'feeding' },
    premolt: { titleKey: 'recordPremolt', hintKey: 'hintStatus', icon: 'instar', logType: 'record', recordKey: 'Premolt signs' },
    molt: { titleKey: 'recordMolt', hintKey: 'hintStatus', icon: 'instar', logType: 'record', recordKey: 'Molting' },
    abdomen: { titleKey: 'recordAbdomen', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Abdomen condition' },
    hiding: { titleKey: 'recordHiding', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Hiding behavior' },
    defensive: { titleKey: 'recordDefensive', hintKey: 'hintAbnormality', icon: 'alert', logType: 'record', recordKey: 'Defensive response' },
    basking: { titleKey: 'recordBasking', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Basking' },
    water_temp: { titleKey: 'recordWaterTemp', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Water temperature' },
    water_quality: { titleKey: 'recordWaterQuality', hintKey: 'hintSubstrate', icon: 'substrate', logType: 'environment', envKey: 'Water quality' },
    water_change: { titleKey: 'recordWaterChange', hintKey: 'hintSubstrateChange', icon: 'substrate', logType: 'environment', envKey: 'Water change' },
    uvb: { titleKey: 'recordUvb', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'UVB' },
    shell: { titleKey: 'recordShell', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Shell condition' },
    stool: { titleKey: 'recordStool', hintKey: 'hintSubstrate', icon: 'substrate', logType: 'record', recordKey: 'Stool' },
    activity: { titleKey: 'recordActivity', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Activity' },
    ph: { titleKey: 'recordPh', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'pH' },
    ammonia: { titleKey: 'recordAmmonia', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Ammonia' },
    nitrite: { titleKey: 'recordNitrite', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Nitrite' },
    nitrate: { titleKey: 'recordNitrate', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Nitrate' },
    gill: { titleKey: 'recordGill', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Gill condition' },
    skin: { titleKey: 'recordSkin', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Skin condition' },
    shedding: { titleKey: 'recordShedding', hintKey: 'hintInstar', icon: 'instar', logType: 'record', recordKey: 'Shedding' },
    molt: { titleKey: 'recordMolt', hintKey: 'hintInstar', icon: 'instar', logType: 'record', recordKey: 'Molting' },
    egg_laying: { titleKey: 'recordEggLaying', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Egg laying' },
    medication: { titleKey: 'recordMedication', hintKey: 'hintAbnormality', icon: 'alert', logType: 'record', recordKey: 'Medication' },
    vet: { titleKey: 'recordVet', hintKey: 'hintAbnormality', icon: 'alert', logType: 'record', recordKey: 'Vet visit' },
    hotspot: { titleKey: 'recordHotspot', hintKey: 'hintSubstrate', icon: 'thermometer', logType: 'environment', envKey: 'Hot spot' },
    cold_zone: { titleKey: 'recordColdZone', hintKey: 'hintSubstrate', icon: 'thermometer', logType: 'environment', envKey: 'Cool zone' },
    calcium: { titleKey: 'recordCalcium', hintKey: 'hintFeeding', icon: 'feeding', logType: 'record', recordKey: 'Calcium supplement' },
    tds: { titleKey: 'recordTds', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'TDS' },
    gh: { titleKey: 'recordGh', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'GH' },
    kh: { titleKey: 'recordKh', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'KH' },
    salinity: { titleKey: 'recordSalinity', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Salinity' },
    ca: { titleKey: 'recordCa', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Calcium' },
    mg: { titleKey: 'recordMg', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Magnesium' },
    po4: { titleKey: 'recordPo4', hintKey: 'hintSubstrate', icon: 'status', logType: 'environment', envKey: 'Phosphate' },
    aquarium_light: { titleKey: 'recordAquariumLight', hintKey: 'hintSubstrate', icon: 'sun', logType: 'environment', envKey: 'Lighting' },
    water_flow: { titleKey: 'recordWaterFlow', hintKey: 'hintSubstrate', icon: 'waves', logType: 'environment', envKey: 'Water flow' },
    coral_open: { titleKey: 'recordCoralOpen', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Polyp extension' },
    drinking: { titleKey: 'recordDrinking', hintKey: 'hintFeeding', icon: 'feeding', logType: 'feeding', recordKey: 'Drinking' },
    feather: { titleKey: 'recordFeather', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Feather condition' },
    cage_clean: { titleKey: 'recordCageClean', hintKey: 'hintSubstrate', icon: 'substrate', logType: 'environment', envKey: 'Cage cleaning' },
    crop: { titleKey: 'recordCrop', hintKey: 'hintStatus', icon: 'feeding', logType: 'record', recordKey: 'Crop condition' },
    teeth: { titleKey: 'recordTeeth', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Teeth condition' },
    fur: { titleKey: 'recordFur', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Coat condition' },
    mortality: { titleKey: 'recordMortality', hintKey: 'hintAbnormality', icon: 'alert', logType: 'record', recordKey: 'Mortality count' },
    plant_status: { titleKey: 'recordPlantStatus', hintKey: 'hintStatus', icon: 'status', logType: 'record', recordKey: 'Plant condition' },
  };

  function getDeck(careTypeKey) {
    var key = careTypeKey || 'default';
    var main = DECKS[key] || DECKS.default;
    return { main: main.slice(), more: [] };
  }

  function mergeRecordMeta(base) {
    var out = Object.assign({}, base || {});
    Object.keys(EXTRA_META).forEach(function (k) {
      if (!out[k]) out[k] = EXTRA_META[k];
    });
    return out;
  }

  global.MCHusbandryRecordDecks = {
    decks: DECKS,
    extraMeta: EXTRA_META,
    getDeck: getDeck,
    mergeRecordMeta: mergeRecordMeta,
  };
})(typeof window !== 'undefined' ? window : this);
