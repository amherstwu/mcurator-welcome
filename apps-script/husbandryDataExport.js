/**
 * Husbandry Log — normalized export/import schema (v1).
 * Canonical cross-surface contract for Apps Script and Mobile React.
 * Runtime validation/normalization: husbandry-export-contract.js
 * (shared/husbandry-export/husbandryExportContract.js).
 * Do not rename persistent fields without a migration path.
 */
(function (global) {
  'use strict';

  function CONTRACT() {
    return global.MCHusbandryExportContract || null;
  }

  var SCHEMA_VERSION = (CONTRACT() && CONTRACT().SCHEMA_VERSION) || 1;
  var SCHEMA_NAME = (CONTRACT() && CONTRACT().SCHEMA_NAME) || 'mcurator.husbandry';

  function normalizeRecord(log) {
    var c = CONTRACT();
    if (c && c.normalizeRecordForExchange) return c.normalizeRecordForExchange(log);
    if (!log) return null;
    var photos = [];
    if (Array.isArray(log.photos) && log.photos.length) {
      photos = log.photos.map(function (p) {
        if (typeof p === 'string') return { url: p, type: log.photoType || 'daily' };
        return { url: p.url || p.photoUrl || '', type: p.type || p.photoType || 'daily' };
      });
    } else if (log.photoUrl) {
      photos = [{ url: log.photoUrl, type: log.photoType || 'daily' }];
    }
    return {
      id: log.id || '',
      petId: log.petId || '',
      type: log.type || log.recordId || 'note',
      recordId: log.recordId || log.type || 'note',
      canonicalType: log.type || log.recordId || 'note',
      value: log.value != null ? log.value : (log.values && log.values.value != null ? log.values.value : ''),
      unit: log.unit || '',
      status: log.status || (log.values && log.values.feedingStatus) || '',
      note: log.note || '',
      photos: photos,
      tags: Array.isArray(log.tags) ? log.tags.slice() : [],
      createdAt: log.createdAt || log.date || '',
    };
  }

  function normalizeBreedingPair(pair, state) {
    if (!pair) return null;
    var events = (state.breedingEvents || []).filter(function (e) { return e.pairId === pair.id; });
    var offspringIds = (state.offspring || []).filter(function (o) {
      return o.pairId === pair.id || o.fatherPetId === pair.malePetId || o.motherPetId === pair.femalePetId;
    }).map(function (o) { return o.id; });
    return {
      id: pair.id,
      malePetId: pair.malePetId || '',
      femalePetId: pair.femalePetId || '',
      status: pair.status || '',
      events: events.map(function (e) {
        return {
          id: e.id,
          type: e.type,
          date: e.date || e.createdAt || '',
          count: e.count,
          note: e.note || '',
          petId: e.petId || '',
        };
      }),
      offspringIds: offspringIds,
      createdAt: pair.createdAt || pair.startDate || '',
    };
  }

  function normalizeCareGuide(guide) {
    if (!guide) return null;
    return {
      id: guide.id || '',
      category: guide.category || guide.categoryId || '',
      title: guide.title || guide.titleKey || '',
      summary: guide.summary || guide.tagline || '',
      environment: guide.environment || guide.setupChecklist || null,
      feeding: guide.feeding || guide.dailyCare || null,
      health: guide.health || guide.dangerSigns || null,
      dangerSigns: guide.dangerSigns || [],
      recommendedRecords: guide.recommendedRecords || guide.records || [],
      suggestedTasks: guide.suggestedTasks || guide.dailyTasks || [],
      tutorialSteps: guide.tutorialSteps || [],
    };
  }

  function breedingSliceForPet_(state, petId) {
    var pairs = (state.breedingPairs || []).filter(function (p) {
      return p.malePetId === petId || p.femalePetId === petId;
    });
    var offspring = (state.offspring || []).filter(function (o) {
      return o.linkedPetId === petId || o.fatherPetId === petId || o.motherPetId === petId;
    });
    return {
      pairs: pairs.map(function (p) { return normalizeBreedingPair(p, state); }),
      offspring: offspring,
    };
  }

  function normalizePet(pet, state, helpers) {
    if (!pet) return null;
    var logs = helpers.petLogs(pet.id);
    var lastLog = logs[0];
    var badge = helpers.cardCareBadge(pet);
    var c = CONTRACT();
    var createdAt = pet.createdAt || pet.careStartDate || '';
    var updatedAt = pet.updatedAt || (lastLog && (lastLog.date || lastLog.createdAt)) || '';
    if (c && c.normalizeIsoDate) {
      createdAt = c.normalizeIsoDate(createdAt, { allowEmpty: true }) || createdAt;
      updatedAt = c.normalizeIsoDate(updatedAt, { allowEmpty: true }) || updatedAt;
    }
    return {
      id: pet.id,
      name: pet.petName || '',
      petName: pet.petName || '',
      commonName: pet.commonName || pet.chineseName || '',
      scientificName: helpers.petScientificName(pet),
      category: pet.category || '',
      lifeStage: pet.lifeStage || '',
      status: badge && badge.label ? badge.label : '',
      image: pet.profilePhoto || '',
      careGuideId: pet.careGuideId || '',
      tasks: helpers.ensureQuestProgress(pet),
      records: logs.map(normalizeRecord),
      breeding: breedingSliceForPet_(state, pet.id),
      profile: {
        sex: pet.sex || 'unknown',
        source: pet.source || '',
        profileNote: pet.profileNote || '',
        husbandryId: pet.husbandryId || '',
        privacy: pet.privacy || 'private',
        careStartDate: pet.careStartDate || pet.startDate || '',
        speciesId: pet.speciesId || '',
      },
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }

  function buildFullBackup(state, helpers) {
    var guideList = [];
    var cgState = state.careGuide;
    if (cgState && cgState.careGuides && typeof cgState.careGuides === 'object') {
      Object.keys(cgState.careGuides).forEach(function (gid) {
        var n = normalizeCareGuide(cgState.careGuides[gid]);
        if (n && n.id) guideList.push(n);
      });
    }
    var records = (state.careLogs || []).map(normalizeRecord).filter(Boolean);
    var c = CONTRACT();
    var attachments = c && c.buildAttachmentIndex ? c.buildAttachmentIndex(records) : [];
    var locale = helpers.locale || (helpers.isEn && helpers.isEn() ? 'en-001' : 'zh-TW');
    var quests = [];
    (state.pets || []).forEach(function (pet) {
      if (!pet || !pet.questProgress) return;
      quests.push({
        petId: pet.id,
        date: pet.questProgress.date || '',
        done: Array.isArray(pet.questProgress.done) ? pet.questProgress.done.slice() : [],
        skipped: Array.isArray(pet.questProgress.skipped) ? pet.questProgress.skipped.slice() : [],
      });
    });
    var reminders = [];
    (state.careLogs || []).forEach(function (log) {
      if (!log || log.type !== 'abnormality') return;
      var hf = log.healthFollowUp || null;
      var follow = (hf && (hf.followUpDate || hf.dueDate)) || (log.values && log.values.followUpDate);
      if (!follow && !hf) return;
      reminders.push({
        id: log.id + ':health-review',
        petId: log.petId,
        recordId: log.id,
        kind: 'health_review',
        status: (hf && hf.status) || 'pending',
        dueDate: follow || '',
        note: log.note || '',
      });
    });
    var meta = {
      petCount: state.pets.length,
      recordCount: (state.careLogs || []).length,
      storageKey: helpers.storageKey || 'mc_hl_v7',
    };
    var payload = {
      schema: SCHEMA_NAME,
      version: SCHEMA_VERSION,
      schemaVersion: SCHEMA_VERSION,
      kind: 'husbandry-backup',
      exportedAt: new Date().toISOString(),
      locale: locale,
      source: 'apps-script',
      pets: state.pets.map(function (p) { return normalizePet(p, state, helpers); }),
      records: records,
      quests: quests,
      reminders: reminders,
      attachments: attachments,
      careGuides: guideList,
      breedingPairs: (state.breedingPairs || []).map(function (p) { return normalizeBreedingPair(p, state); }),
      offspring: (state.offspring || []).slice(),
      breedingEvents: (state.breedingEvents || []).slice(),
      meta: meta,
      metadata: meta,
    };
    if (c && c.normalizeHusbandryExport) {
      return c.normalizeHusbandryExport(payload, { source: 'apps-script', locale: locale });
    }
    return payload;
  }

  function buildPetExport(pet, state, helpers) {
    var locale = helpers.locale || (helpers.isEn && helpers.isEn() ? 'en-001' : 'zh-TW');
    var normalizedPet = normalizePet(pet, state, helpers);
    var payload = {
      schema: SCHEMA_NAME,
      version: SCHEMA_VERSION,
      schemaVersion: SCHEMA_VERSION,
      kind: 'husbandry-pet',
      exportedAt: new Date().toISOString(),
      locale: locale,
      source: 'apps-script',
      pet: normalizedPet,
      pets: [normalizedPet],
      records: helpers.petLogs(pet.id).map(normalizeRecord),
    };
    var c = CONTRACT();
    if (c && c.normalizeHusbandryExport) {
      return c.normalizeHusbandryExport(payload, { source: 'apps-script', locale: locale });
    }
    return payload;
  }

  function csvEscape(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function rowsToCsv(rows) {
    return rows.map(function (r) {
      return r.map(csvEscape).join(',');
    }).join('\n');
  }

  function exportAllRecordsCsv(state, helpers) {
    var rows = [['petName', 'petId', 'husbandryId', 'date', 'type', 'recordId', 'value', 'unit', 'status', 'note']];
    state.pets.forEach(function (pet) {
      helpers.petLogs(pet.id).forEach(function (log) {
        var rec = normalizeRecord(log);
        rows.push([
          pet.petName,
          pet.id,
          pet.husbandryId || '',
          rec.createdAt,
          rec.type,
          log.recordId || '',
          rec.value,
          rec.unit,
          rec.status,
          rec.note,
        ]);
      });
    });
    return rowsToCsv(rows);
  }

  function exportPetRecordsCsv(pet, helpers) {
    var rows = [['date', 'type', 'recordId', 'value', 'unit', 'status', 'note']];
    helpers.petLogs(pet.id).forEach(function (log) {
      var rec = normalizeRecord(log);
      rows.push([
        rec.createdAt,
        rec.type,
        log.recordId || '',
        rec.value,
        rec.unit,
        rec.status,
        rec.note,
      ]);
    });
    return rowsToCsv(rows);
  }

  function exportPhotoIndexCsv(state, helpers) {
    var rows = [['petName', 'petId', 'logId', 'photoUrl', 'photoType', 'createdAt', 'note']];
    (state.careLogs || []).forEach(function (log) {
      var rec = normalizeRecord(log);
      if (!rec.photos.length) return;
      var pet = state.pets.filter(function (p) { return p.id === log.petId; })[0];
      rec.photos.forEach(function (ph) {
        rows.push([
          pet ? pet.petName : '',
          log.petId,
          log.id,
          ph.url,
          ph.type,
          rec.createdAt,
          rec.note,
        ]);
      });
    });
    return rowsToCsv(rows);
  }

  function denormalizeRecord(rec, helpers) {
    if (!rec) return null;
    var photo = rec.photos && rec.photos[0];
    var c = CONTRACT();
    var runtimeType = rec.type || rec.recordId || 'note';
    if (!rec.type && rec.canonicalType) {
      runtimeType = rec.canonicalType === 'anomaly' ? 'abnormality' : rec.canonicalType;
    }
    if (runtimeType === 'anomaly') runtimeType = 'abnormality';
    var dateIso = rec.createdAt || rec.date || '';
    if (c && c.normalizeIsoDate) {
      dateIso = c.normalizeIsoDate(dateIso) || new Date().toISOString();
    } else if (!dateIso) {
      dateIso = new Date().toISOString();
    }
    return {
      id: rec.id || helpers.genId(),
      petId: rec.petId,
      petName: '',
      type: runtimeType,
      recordId: rec.recordId || runtimeType,
      recordType: runtimeType,
      values: rec.values
        ? rec.values
        : (rec.value != null && rec.value !== '' ? { value: rec.value, feedingStatus: rec.status } : null),
      note: rec.note || '',
      photoUrl: photo ? photo.url : '',
      photoType: photo ? photo.type : '',
      date: dateIso,
      value: rec.value,
      unit: rec.unit || '',
      status: rec.status || '',
      tags: rec.tags || [],
      photos: rec.photos || [],
      createdAt: dateIso,
      healthFollowUp: rec.healthFollowUp || undefined,
    };
  }

  function denormalizePet(unified, helpers) {
    if (!unified) return null;
    var prof = unified.profile || {};
    return {
      id: unified.id || helpers.genId(),
      petName: unified.name || unified.petName || '',
      commonName: unified.commonName || '',
      chineseName: unified.commonName || '',
      scientificName: unified.scientificName || '',
      category: unified.category || '',
      lifeStage: unified.lifeStage || 'juvenile',
      profilePhoto: unified.image || '',
      careGuideId: unified.careGuideId || '',
      questProgress: unified.tasks || null,
      sex: prof.sex || 'unknown',
      source: prof.source || '',
      profileNote: prof.profileNote || '',
      husbandryId: prof.husbandryId || helpers.genHusbandryId(),
      privacy: prof.privacy || 'private',
      careStartDate: String(prof.careStartDate || '').slice(0, 10),
      speciesId: prof.speciesId || '',
      createdAt: unified.createdAt || '',
      updatedAt: unified.updatedAt || '',
    };
  }

  function parseImportPayload(raw) {
    var c = CONTRACT();
    if (c && c.parseAndNormalize) {
      try {
        return c.parseAndNormalize(raw, { source: 'apps-script' });
      } catch (e) {
        if (e && e.message === 'validation_failed') throw e;
      }
    }
    var data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!data || typeof data !== 'object') throw new Error('invalid_json');
    if (data.kind === 'husbandry-backup' || data.schemaVersion || data.schema === SCHEMA_NAME) return data;
    if (data.pet && !data.pets) {
      return {
        kind: 'husbandry-pet',
        pets: [data.pet],
        records: data.logs || data.records || [],
      };
    }
    if (Array.isArray(data.pets)) return data;
    throw new Error('unsupported_format');
  }

  function summarizeImport(payload) {
    var pets = payload.pets || (payload.pet ? [payload.pet] : []);
    var records = payload.records || payload.careLogs || [];
    if (!records.length && pets.length === 1 && Array.isArray(pets[0].records)) {
      records = pets[0].records;
    }
    return {
      petCount: pets.length,
      recordCount: records.length,
      pairCount: (payload.breedingPairs || []).length,
      kind: payload.kind || 'unknown',
    };
  }

  function applyImport(state, payload, mode, helpers) {
    var c = CONTRACT();
    if (c && c.validateHusbandryExport) {
      var check = c.validateHusbandryExport(payload);
      if (!check.ok) {
        var err = new Error('validation_failed');
        err.issues = check.issues;
        throw err;
      }
    }
    var summary = summarizeImport(payload);
    var petsIn = payload.pets || (payload.pet ? [payload.pet] : []);
    var recordsIn = payload.records || payload.careLogs || [];
    if (!recordsIn.length) {
      petsIn.forEach(function (p) {
        if (Array.isArray(p.records)) recordsIn = recordsIn.concat(p.records);
      });
    }

    if (mode === 'replace') {
      state.pets = [];
      state.careLogs = [];
      state.breedingPairs = [];
      state.breedingEvents = [];
      state.offspring = [];
    }

    var petIdMap = {};
    petsIn.forEach(function (up) {
      var denorm = denormalizePet(up, helpers);
      if (!denorm) return;
      var srcId = up.id || denorm.id;
      var existing = state.pets.filter(function (p) { return p.id === denorm.id; })[0];
      if (existing && mode === 'merge') {
        Object.keys(denorm).forEach(function (k) {
          if (denorm[k] != null && denorm[k] !== '') existing[k] = denorm[k];
        });
        petIdMap[srcId] = existing.id;
      } else {
        if (existing) denorm.id = helpers.genId();
        state.pets.push(denorm);
        petIdMap[srcId] = denorm.id;
      }
    });

    recordsIn.forEach(function (rec) {
      var mappedPetId = petIdMap[rec.petId] || rec.petId;
      var denormLog = denormalizeRecord(Object.assign({}, rec, { petId: mappedPetId }), helpers);
      if (!denormLog) return;
      var dup = state.careLogs.some(function (l) { return l.id === denormLog.id; });
      if (dup && mode === 'merge') denormLog.id = helpers.genId();
      var petRef = state.pets.filter(function (p) { return p.id === mappedPetId; })[0];
      denormLog.petName = petRef ? petRef.petName : '';
      state.careLogs.unshift(denormLog);
    });

    if (payload.breedingPairs && mode === 'replace') {
      state.breedingPairs = payload.breedingPairs.slice();
    } else if (payload.breedingPairs && mode === 'merge') {
      payload.breedingPairs.forEach(function (pair) {
        if (!state.breedingPairs.some(function (p) { return p.id === pair.id; })) {
          state.breedingPairs.push(pair);
        }
      });
    }
    if (payload.breedingEvents && mode === 'replace') state.breedingEvents = payload.breedingEvents.slice();
    else if (payload.breedingEvents && mode === 'merge') {
      payload.breedingEvents.forEach(function (ev) {
        if (!state.breedingEvents.some(function (e) { return e.id === ev.id; })) state.breedingEvents.push(ev);
      });
    }
    if (payload.offspring && mode === 'replace') state.offspring = payload.offspring.slice();
    else if (payload.offspring && mode === 'merge') {
      payload.offspring.forEach(function (o) {
        if (!state.offspring.some(function (x) { return x.id === o.id; })) state.offspring.push(o);
      });
    }

    if (state.careLogs.length > 500) state.careLogs.length = 500;
    return summary;
  }

  function exportBatchRecordsCsv(state, petIds, helpers) {
    var rows = [['petName', 'petId', 'husbandryId', 'date', 'type', 'recordId', 'value', 'unit', 'status', 'note']];
    (petIds || []).forEach(function (petId) {
      var pet = state.pets.filter(function (p) { return p.id === petId; })[0];
      if (!pet) return;
      helpers.petLogs(petId).forEach(function (log) {
        var rec = normalizeRecord(log);
        rows.push([
          pet.petName,
          pet.id,
          pet.husbandryId || '',
          rec.createdAt,
          rec.type,
          log.recordId || '',
          rec.value,
          rec.unit,
          rec.status,
          rec.note,
        ]);
      });
    });
    return rowsToCsv(rows);
  }

  global.MCHusbandryDataExport = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    SCHEMA_NAME: SCHEMA_NAME,
    normalizeRecord: normalizeRecord,
    normalizePet: normalizePet,
    normalizeCareGuide: normalizeCareGuide,
    normalizeBreedingPair: normalizeBreedingPair,
    buildFullBackup: buildFullBackup,
    buildPetExport: buildPetExport,
    exportAllRecordsCsv: exportAllRecordsCsv,
    exportPetRecordsCsv: exportPetRecordsCsv,
    exportBatchRecordsCsv: exportBatchRecordsCsv,
    exportPhotoIndexCsv: exportPhotoIndexCsv,
    parseImportPayload: parseImportPayload,
    summarizeImport: summarizeImport,
    applyImport: applyImport,
  };
})(typeof window !== 'undefined' ? window : global);
