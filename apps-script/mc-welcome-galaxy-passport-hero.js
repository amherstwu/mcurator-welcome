/**
 * Welcome hero — Milky Way backdrop, default-visible specimen passport card (no Earth globe).
 * Scope: #mcWelcomeHero[data-mc-galaxy-single-card="1"]
 */
(function (global) {
  'use strict';

  function poolImg(sectionId, variant) {
    if (typeof global.mcGetSectionAsset !== 'function') return '';
    var rel = global.mcGetSectionAsset(sectionId, variant);
    return rel ? '../' + rel : '';
  }

  var demoPassportCards = [
    {
      id: 'node-1',
      image: poolImg('landing-hero', 1),
      taxonGroup: 'LEPIDOPTERA',
      scientificName: 'Papilio blumei',
      commonName: '青鳳蝶',
      locality: 'Demo locality — Borneo highlands',
      date: '2024/07/15',
      collector: 'Demo Collector',
      specimenType: 'Pinned voucher',
      preservation: 'Dry cabinet · climate monitored',
      status: 'Verified demo record',
      completion: 86,
      recordId: 'SPP-24-7F3A8C',
      chipLabel: 'P. blumei',
    },
    {
      id: 'node-2',
      image: poolImg('passport-studio', 0),
      taxonGroup: 'LEPIDOPTERA',
      scientificName: 'Lamproptera curius',
      commonName: '燕鳳蝶',
      locality: 'Demo locality — montane stream',
      date: '2024/06/02',
      collector: 'Demo Collector',
      specimenType: 'Spread specimen',
      preservation: 'UV-filtered display',
      status: 'Verified demo record',
      completion: 82,
      recordId: 'MC-DEMO-002',
      chipLabel: 'L. curius',
    },
    {
      id: 'node-3',
      image: poolImg('passport-studio', 1),
      taxonGroup: 'COLEOPTERA',
      scientificName: 'Demo Specimen Three',
      commonName: '甲蟲示範標本',
      locality: 'Demo locality — field station',
      date: '2024/05/18',
      collector: 'Demo Collector',
      specimenType: 'Point-mounted',
      preservation: 'Pinned · archival drawer',
      status: 'Verified demo record',
      completion: 79,
      recordId: 'MC-DEMO-003',
      chipLabel: 'Beetle',
    },
    {
      id: 'node-4',
      image: poolImg('passport-studio', 3),
      taxonGroup: 'REPTILIA',
      scientificName: 'Plestiodon elegans',
      commonName: '麗紋石龍子',
      locality: 'Demo locality — lowland forest',
      date: '2024/04/09',
      collector: 'Demo Collector',
      specimenType: 'Fluid prep aliquot',
      preservation: 'Ethanol 70% · sealed vial',
      status: 'Verified demo record',
      completion: 74,
      recordId: 'MC-DEMO-004',
      chipLabel: 'P. elegans',
    },
    {
      id: 'node-5',
      image: poolImg('earth-galaxy', 1),
      taxonGroup: 'PLANTAE',
      scientificName: 'Demo Specimen Five',
      commonName: '植物示範壓標',
      locality: 'Demo locality — botanical plot',
      date: '2024/03/22',
      collector: 'Demo Collector',
      specimenType: 'Herbarium sheet',
      preservation: 'Pressed · fumigated storage',
      status: 'Verified demo record',
      completion: 88,
      recordId: 'MC-DEMO-005',
      chipLabel: 'Plant',
    },
    {
      id: 'node-6',
      image: poolImg('landing-hero', 1),
      taxonGroup: 'LEPIDOPTERA',
      scientificName: 'Ypthima sp. (demo)',
      commonName: '矍眼蝶示範',
      locality: 'Demo locality — meadow transect',
      date: '2024/02/11',
      collector: 'Demo Collector',
      specimenType: 'Pinned voucher',
      preservation: 'Climate cabinet',
      status: 'Verified demo record',
      completion: 81,
      recordId: 'MC-DEMO-006',
      chipLabel: 'Ypthima',
    },
  ];

  global.McWelcomePassportDemoData = {
    cards: demoPassportCards,
    cardSwitchMs: 380,
    defaultV2NodeId: 'node-4',
  };
})(typeof window !== 'undefined' ? window : globalThis);
