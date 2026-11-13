/**
 * Dashboard specimen passports (demo). Mutable via MCSAT_passportStore API.
 */
(function (global) {
  'use strict';

  var IMG = {
    scarab: '../assets/Card demo images/Plusiotis chrysargirea Silver Bajo Chirripo Talamanca Costa Rica 2021.04.jpg',
    butterfly: '../assets/Card demo images/Ixorida venerea venerea Sulawesi.jpg',
    lucanid: '../assets/Card demo images/Dorcus ternatensis.jpg',
    beetle2: '../assets/Card demo images/Brachysiderus quadrimaculatus.jpg',
  };

  function computeRequiredComplete(p) {
    return !!(
      p.satId &&
      p.imageUrl &&
      p.title &&
      p.scientificName &&
      p.category &&
      p.origin &&
      p.licenseType &&
      (p.verificationStatus === 'Verified' ||
        p.verificationStatus === 'Pending Review' ||
        p.verificationStatus === 'Pending')
    );
  }

  function computeCompletion(p) {
    var fields = [
      p.satId,
      p.title,
      p.scientificName,
      p.commonName,
      p.category,
      p.origin,
      p.imageUrl,
      p.licenseType,
      p.verificationStatus,
      p.description,
      p.collector,
      p.family,
      p.genus,
      p.species,
    ];
    var ok = fields.filter(Boolean).length;
    return Math.min(100, Math.round((ok / fields.length) * 100));
  }

  function normalizePassport(raw) {
    var p = Object.assign({}, raw);
    p.requiredFieldsComplete = computeRequiredComplete(p);
    p.completionRate = computeCompletion(p);
    if (p.isPublished && !p.requiredFieldsComplete) {
      p.isPublished = false;
    }
    return p;
  }

  var SEED = [
    normalizePassport({
      id: 'pp-001',
      satId: 'SAT-P-000301',
      ownerId: 'current-user',
      title: 'Draft scarab record',
      scientificName: 'Plusiotis chrysargirea',
      commonName: 'Golden scarab',
      category: 'Insect',
      origin: 'Costa Rica',
      imageUrl: IMG.scarab,
      status: 'Draft',
      collection: 'Personal cabinet',
      updatedAt: '2026-04-28',
      isPublished: false,
      verificationStatus: 'Pending Review',
      licenseType: 'Educational use',
      description: '',
      collector: '',
      family: 'Scarabaeidae',
      genus: 'Plusiotis',
      species: 'chrysargirea',
      taxonomy: 'Coleoptera > Scarabaeidae',
      provenanceNotes: '',
      acquisitionMethod: '',
      acquisitionDate: '',
      custodyNotes: '',
      size: '',
      sex: '',
      condition: '',
      preservation: '',
      referenceNotes: '',
      licensePersonal: true,
      licenseEducation: false,
      licenseResearch: false,
      licenseCommercial: false,
      licenseCustomNotes: '',
      listed: false,
      price: '',
      inquiryOnly: true,
      publicVisibility: false,
      reviewerNotes: '',
      missingWarnings: ['Description empty', 'Collector empty'],
      confidenceScore: 42,
    }),
    normalizePassport({
      id: 'pp-002',
      satId: 'SAT-P-000302',
      ownerId: 'current-user',
      title: 'Stag beetle — pending review',
      scientificName: 'Dorcus ternatensis',
      commonName: 'Stag beetle',
      category: 'Insect',
      origin: 'Indonesia',
      imageUrl: IMG.lucanid,
      status: 'Pending Review',
      collection: 'Teaching set A',
      updatedAt: '2026-04-20',
      isPublished: false,
      verificationStatus: 'Pending Review',
      licenseType: 'Research citation',
      description: 'Accessioned for morphology lab.',
      collector: 'Demo curator',
      family: 'Lucanidae',
      genus: 'Dorcus',
      species: 'ternatensis',
      taxonomy: 'Coleoptera > Lucanidae',
      provenanceNotes: 'Purchased from licensed dealer (demo).',
      acquisitionMethod: 'Purchase',
      acquisitionDate: '2023-06',
      custodyNotes: 'Stored dry, pinned.',
      size: '48 mm',
      sex: 'Male',
      condition: 'Good',
      preservation: 'Pinned dry',
      referenceNotes: 'Compare with SAT-000003',
      licensePersonal: true,
      licenseEducation: true,
      licenseResearch: true,
      licenseCommercial: false,
      licenseCustomNotes: '',
      listed: false,
      price: 55,
      inquiryOnly: false,
      publicVisibility: false,
      reviewerNotes: '',
      missingWarnings: [],
      confidenceScore: 78,
    }),
    normalizePassport({
      id: 'pp-003',
      satId: 'SAT-000001',
      ownerId: 'current-user',
      title: 'Plusiotis chrysargirea specimen image',
      scientificName: 'Plusiotis chrysargirea',
      commonName: 'Golden scarab beetle',
      category: 'Insect',
      origin: 'Costa Rica',
      imageUrl: IMG.scarab,
      status: 'Listed',
      collection: 'Beetle Archive',
      updatedAt: '2026-04-29',
      isPublished: true,
      verificationStatus: 'Verified',
      licenseType: 'Educational use',
      description: 'Matches public catalog SAT-000001 (demo link).',
      collector: 'Field team A',
      family: 'Scarabaeidae',
      genus: 'Plusiotis',
      species: 'chrysargirea',
      taxonomy: 'Coleoptera > Scarabaeidae > Plusiotis',
      provenanceNotes: 'Photographed 2021.',
      acquisitionMethod: 'Field',
      acquisitionDate: '2021-04',
      custodyNotes: 'Imaging completed.',
      size: '32 mm',
      sex: 'Unknown',
      condition: 'Excellent',
      preservation: 'Dry',
      referenceNotes: '',
      licensePersonal: true,
      licenseEducation: true,
      licenseResearch: true,
      licenseCommercial: false,
      licenseCustomNotes: '',
      listed: true,
      price: 38,
      inquiryOnly: false,
      publicVisibility: true,
      reviewerNotes: 'Approved',
      missingWarnings: [],
      confidenceScore: 96,
    }),
    normalizePassport({
      id: 'pp-004',
      satId: 'SAT-P-000299',
      ownerId: 'current-user',
      title: 'Archived butterfly scan',
      scientificName: 'Ixorida venerea',
      commonName: 'Butterfly',
      category: 'Insect',
      origin: 'Sulawesi',
      imageUrl: IMG.butterfly,
      status: 'Archived',
      collection: 'Legacy folder',
      updatedAt: '2025-08-01',
      isPublished: false,
      verificationStatus: 'Verified',
      licenseType: 'Personal viewing',
      description: 'Old scan — superseded.',
      collector: 'Legacy',
      family: 'Lycaenidae',
      genus: 'Ixorida',
      species: 'venerea',
      taxonomy: '—',
      provenanceNotes: '',
      acquisitionMethod: '',
      acquisitionDate: '',
      custodyNotes: '',
      size: '',
      sex: '',
      condition: 'Fair',
      preservation: 'Pinned',
      referenceNotes: '',
      licensePersonal: true,
      licenseEducation: false,
      licenseResearch: false,
      licenseCommercial: false,
      licenseCustomNotes: '',
      listed: false,
      price: 0,
      inquiryOnly: true,
      publicVisibility: false,
      reviewerNotes: 'Archived by owner',
      missingWarnings: [],
      confidenceScore: 55,
    }),
  ];

  var passports = SEED.map(function (p) {
    return JSON.parse(JSON.stringify(p));
  });

  global.MCSAT_getPassports = function () {
    return passports.map(function (p) {
      return normalizePassport(p);
    });
  };

  global.MCSAT_getPassportById = function (id) {
    var want = String(id || '');
    var found = passports.find(function (p) {
      return String(p.id) === want || String(p.satId) === want;
    });
    return found ? normalizePassport(found) : null;
  };

  global.MCSAT_upsertPassport = function (patch) {
    if (!patch || !patch.id) return null;
    var idx = passports.findIndex(function (p) {
      return String(p.id) === String(patch.id);
    });
    var next = Object.assign({}, idx >= 0 ? passports[idx] : {}, patch);
    next = normalizePassport(next);
    if (idx >= 0) passports[idx] = next;
    else passports.push(next);
    return next;
  };

  global.MCSAT_appendRuntimePublishedAsset = function (asset) {
    if (!asset || !asset.id) return false;
    global.__MCSAT_runtimePublishedAssets = global.__MCSAT_runtimePublishedAssets || [];
    var list = global.__MCSAT_runtimePublishedAssets;
    var i = list.findIndex(function (x) {
      return x && String(x.id) === String(asset.id);
    });
    var copy = JSON.parse(JSON.stringify(asset));
    copy.isPublished = true;
    if (i >= 0) list[i] = copy;
    else list.push(copy);
    return true;
  };
})(typeof window !== 'undefined' ? window : this);
