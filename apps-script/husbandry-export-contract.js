/**
 * MCurator Husbandry export contract (v1) — single shared runtime.
 * Used by Apps Script (window.MCHusbandryExportContract) and Node/mobile tests.
 *
 * Canonical identity:
 *   schema: 'mcurator.husbandry'
 *   version: 1
 *
 * Legacy envelopes (still accepted on import):
 *   schemaVersion: 1 + kind: 'husbandry-backup' | 'husbandry-pet'
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.MCHusbandryExportContract = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var SCHEMA_NAME = 'mcurator.husbandry';
  var SCHEMA_VERSION = 1;
  var ID_RE = /^[A-Za-z0-9_.:@-]{1,128}$/;
  var DANGEROUS_KEYS = {
    __proto__: 1,
    prototype: 1,
    constructor: 1,
    __defineGetter__: 1,
    __defineSetter__: 1,
  };

  /** Canonical semantic record types (exchange layer). */
  var CANONICAL_RECORD_TYPES = [
    'feeding',
    'environment',
    'health',
    'anomaly',
    'photo',
    'cleaning',
    'water_change',
    'misting',
    'weight',
    'measurement',
    'medication',
    'note',
    'breeding',
    'molt',
    'task_completion',
  ];

  /**
   * Map legacy / surface-specific type or recordId → canonicalType.
   * Does not rewrite stored runtime type; used for validation + exchange.
   */
  var RECORD_TYPE_ALIASES = {
    feeding: 'feeding',
    refused: 'feeding',
    drinking: 'feeding',
    calcium: 'feeding',
    environment: 'environment',
    temperature: 'environment',
    humidity: 'environment',
    substrate: 'environment',
    frass: 'environment',
    basking: 'environment',
    water_temp: 'environment',
    water_quality: 'environment',
    uvb: 'environment',
    ph: 'environment',
    ammonia: 'environment',
    nitrite: 'environment',
    nitrate: 'environment',
    hotspot: 'environment',
    cold_zone: 'environment',
    tds: 'environment',
    gh: 'environment',
    kh: 'environment',
    salinity: 'environment',
    ca: 'environment',
    mg: 'environment',
    po4: 'environment',
    aquarium_light: 'environment',
    water_flow: 'environment',
    health: 'health',
    insect_status: 'health',
    activity: 'health',
    skin: 'health',
    gill: 'health',
    shell: 'health',
    stool: 'health',
    feather: 'health',
    crop: 'health',
    teeth: 'health',
    fur: 'health',
    plant_status: 'health',
    abdomen: 'health',
    hiding: 'health',
    defensive: 'health',
    coral_open: 'health',
    vet: 'health',
    mortality: 'anomaly',
    anomaly: 'anomaly',
    abnormality: 'anomaly',
    abnormal: 'anomaly',
    photo: 'photo',
    cleaning: 'cleaning',
    cage_clean: 'cleaning',
    substrate_change: 'cleaning',
    water_change: 'water_change',
    misting: 'misting',
    mist: 'misting',
    weight: 'weight',
    measurement: 'measurement',
    growth: 'measurement',
    instar: 'measurement',
    length: 'measurement',
    medication: 'medication',
    note: 'note',
    breeding: 'breeding',
    egg_laying: 'breeding',
    molt: 'molt',
    premolt: 'molt',
    shedding: 'molt',
    pupation: 'molt',
    task_completion: 'task_completion',
    quest: 'task_completion',
    record: 'note',
  };

  function isPlainObject(v) {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }

  function cloneJson(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function isSafeId(id) {
    return typeof id === 'string' && ID_RE.test(id);
  }

  function stripDangerousKeys(obj, depth) {
    if (!isPlainObject(obj) || depth > 8) return obj;
    var out = {};
    Object.keys(obj).forEach(function (k) {
      if (DANGEROUS_KEYS[k] || k.indexOf('__') === 0) return;
      var val = obj[k];
      if (typeof val === 'function') return;
      if (isPlainObject(val)) out[k] = stripDangerousKeys(val, depth + 1);
      else if (Array.isArray(val)) {
        out[k] = val.map(function (item) {
          return isPlainObject(item) ? stripDangerousKeys(item, depth + 1) : item;
        });
      } else out[k] = val;
    });
    return out;
  }

  /**
   * Normalize any date-like value to ISO 8601 UTC string.
   * Rejects localized display strings that cannot parse.
   * Accepts: ISO, Date, epoch ms/seconds, YYYY-MM-DD (assumed UTC midnight).
   */
  function normalizeIsoDate(value, opts) {
    opts = opts || {};
    if (value == null || value === '') {
      return opts.allowEmpty ? '' : null;
    }
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return null;
      return value.toISOString();
    }
    if (typeof value === 'number' && isFinite(value)) {
      var ms = value < 1e12 ? value * 1000 : value;
      var dn = new Date(ms);
      return isNaN(dn.getTime()) ? null : dn.toISOString();
    }
    var s = String(value).trim();
    if (!s) return opts.allowEmpty ? '' : null;
    /* Reject obvious localized display forms as primary storage. */
    if (/[年月日]|今天|昨天|Today|Yesterday/i.test(s) && !/^\d{4}-\d{2}-\d{2}/.test(s)) {
      return null;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return s + 'T00:00:00.000Z';
    }
    var d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  function canonicalRecordType(typeOrRecordId) {
    var key = String(typeOrRecordId || '').trim();
    if (!key) return 'note';
    if (RECORD_TYPE_ALIASES[key]) return RECORD_TYPE_ALIASES[key];
    if (CANONICAL_RECORD_TYPES.indexOf(key) >= 0) return key;
    return 'note';
  }

  function isCanonicalRecordType(t) {
    return CANONICAL_RECORD_TYPES.indexOf(t) >= 0;
  }

  function detectEnvelope(raw) {
    if (!isPlainObject(raw)) return { ok: false, code: 'not_object' };
    var schema = raw.schema;
    if (schema && schema !== SCHEMA_NAME) {
      return { ok: false, code: 'unsupported_schema' };
    }
    var version = raw.version != null ? Number(raw.version) : Number(raw.schemaVersion);
    var kind = raw.kind || '';
    var legacy =
      (kind === 'husbandry-backup' || kind === 'husbandry-pet' || kind === 'husbandry-export') &&
      (version === SCHEMA_VERSION || raw.schemaVersion === SCHEMA_VERSION || !version);
    var modern = schema === SCHEMA_NAME && (version === SCHEMA_VERSION || !version);
    var petsOnlyLegacy = !schema && !kind && Array.isArray(raw.pets) && (raw.schemaVersion === SCHEMA_VERSION || version === SCHEMA_VERSION);
    if (!modern && !legacy && !petsOnlyLegacy) {
      return { ok: false, code: 'unsupported_schema' };
    }
    if (version && version !== SCHEMA_VERSION) {
      return { ok: false, code: 'unsupported_version', version: version };
    }
    return {
      ok: true,
      modern: !!modern,
      legacy: !!(legacy || petsOnlyLegacy),
      version: SCHEMA_VERSION,
      kind: kind || (Array.isArray(raw.pets) ? 'husbandry-backup' : 'husbandry-export'),
    };
  }

  function pushIssue(issues, path, code, message) {
    issues.push({ path: path, code: code, message: message || code });
  }

  function validateIdField(issues, path, id, required) {
    if (id == null || id === '') {
      if (required) pushIssue(issues, path, 'missing_id', 'ID is required');
      return;
    }
    if (!isSafeId(String(id))) {
      pushIssue(issues, path, 'invalid_id', 'ID must be a stable safe token');
    }
  }

  function validateDateField(issues, path, value, required) {
    if (value == null || value === '') {
      if (required) pushIssue(issues, path, 'missing_date');
      return;
    }
    if (!normalizeIsoDate(value)) {
      pushIssue(issues, path, 'invalid_date', 'Date must be ISO 8601 (not a localized display string)');
    }
  }

  function validateRecord(rec, index, petIds, issues) {
    var path = 'records[' + index + ']';
    if (!isPlainObject(rec)) {
      pushIssue(issues, path, 'invalid_record');
      return;
    }
    validateIdField(issues, path + '.id', rec.id, true);
    validateIdField(issues, path + '.petId', rec.petId, true);
    if (rec.petId && petIds && petIds.indexOf(rec.petId) < 0) {
      pushIssue(issues, path + '.petId', 'orphan_pet_ref', 'Record petId does not match any pet');
    }
    var rawType = rec.canonicalType || rec.type || rec.recordId || '';
    var canon = canonicalRecordType(rawType);
    if (!isCanonicalRecordType(canon)) {
      pushIssue(issues, path + '.type', 'invalid_record_type');
    }
    validateDateField(issues, path + '.createdAt', rec.createdAt || rec.date, true);
    if (Array.isArray(rec.photos)) {
      rec.photos.forEach(function (ph, pi) {
        if (!isPlainObject(ph) && typeof ph !== 'string') {
          pushIssue(issues, path + '.photos[' + pi + ']', 'invalid_attachment');
        }
      });
    }
  }

  function validatePet(pet, index, issues) {
    var path = 'pets[' + index + ']';
    if (!isPlainObject(pet)) {
      pushIssue(issues, path, 'invalid_pet');
      return;
    }
    validateIdField(issues, path + '.id', pet.id, true);
    if (!pet.name && !pet.petName) {
      pushIssue(issues, path + '.name', 'missing_name');
    }
    validateDateField(issues, path + '.createdAt', pet.createdAt, false);
    validateDateField(issues, path + '.updatedAt', pet.updatedAt, false);
    if (pet.profile && pet.profile.careStartDate) {
      validateDateField(issues, path + '.profile.careStartDate', pet.profile.careStartDate, false);
    }
  }

  function validateAttachment(att, index, issues) {
    var path = 'attachments[' + index + ']';
    if (!isPlainObject(att)) {
      pushIssue(issues, path, 'invalid_attachment');
      return;
    }
    validateIdField(issues, path + '.id', att.id, false);
    if (!att.url && !att.photoUrl) {
      pushIssue(issues, path + '.url', 'missing_attachment_url');
    }
  }

  /**
   * Validate an export envelope. Returns { ok, issues, envelope }.
   */
  function validateHusbandryExport(raw) {
    var issues = [];
    var detected = detectEnvelope(raw);
    if (!detected.ok) {
      pushIssue(issues, 'schema', detected.code);
      return { ok: false, issues: issues, envelope: null };
    }
    var pets = raw.pets || (raw.pet ? [raw.pet] : []);
    if (!Array.isArray(pets)) {
      pushIssue(issues, 'pets', 'invalid_pets');
      pets = [];
    }
    var petIds = pets.map(function (p) { return p && p.id; }).filter(Boolean);
    pets.forEach(function (p, i) { validatePet(p, i, issues); });

    var records = raw.records || raw.careLogs || [];
    if (!Array.isArray(records)) {
      pushIssue(issues, 'records', 'invalid_records');
      records = [];
    }
    if (!records.length && pets.length === 1 && Array.isArray(pets[0].records)) {
      records = pets[0].records;
    }
    records.forEach(function (r, i) { validateRecord(r, i, petIds, issues); });

    if (raw.attachments != null) {
      if (!Array.isArray(raw.attachments)) pushIssue(issues, 'attachments', 'invalid_attachments');
      else raw.attachments.forEach(function (a, i) { validateAttachment(a, i, issues); });
    }
    if (raw.quests != null && !Array.isArray(raw.quests)) {
      pushIssue(issues, 'quests', 'invalid_quests');
    }
    if (raw.reminders != null && !Array.isArray(raw.reminders)) {
      pushIssue(issues, 'reminders', 'invalid_reminders');
    }
    if (raw.exportedAt) validateDateField(issues, 'exportedAt', raw.exportedAt, true);
    else pushIssue(issues, 'exportedAt', 'missing_date');

    return {
      ok: issues.length === 0,
      issues: issues,
      envelope: detected,
    };
  }

  function normalizeRecordForExchange(log) {
    if (!log) return null;
    var photos = [];
    if (Array.isArray(log.photos) && log.photos.length) {
      photos = log.photos.map(function (p) {
        if (typeof p === 'string') return { url: p, type: log.photoType || 'daily' };
        return {
          url: p.url || p.photoUrl || '',
          type: p.type || p.photoType || 'daily',
        };
      }).filter(function (p) { return !!p.url; });
    } else if (log.photoUrl) {
      photos = [{ url: log.photoUrl, type: log.photoType || 'daily' }];
    }
    var runtimeType = log.type || log.recordId || 'note';
    var recordId = log.recordId || runtimeType;
    var createdAt = normalizeIsoDate(log.createdAt || log.date, { allowEmpty: false }) ||
      new Date().toISOString();
    var unit = log.unit || (log.values && log.values.unit) || '';
    var value = log.value != null
      ? log.value
      : (log.values && log.values.value != null ? log.values.value : '');
    var status = log.status || (log.values && log.values.feedingStatus) || '';
    return stripDangerousKeys({
      id: String(log.id || ''),
      petId: String(log.petId || ''),
      type: String(runtimeType),
      recordId: String(recordId),
      canonicalType: canonicalRecordType(runtimeType),
      value: value,
      unit: unit,
      status: status,
      note: log.note || '',
      photos: photos,
      tags: Array.isArray(log.tags) ? log.tags.slice() : [],
      createdAt: createdAt,
      /* Preserve safe health follow-up fields without renaming. */
      values: isPlainObject(log.values) ? stripDangerousKeys(log.values, 0) : undefined,
      healthFollowUp: isPlainObject(log.healthFollowUp) ? stripDangerousKeys(log.healthFollowUp, 0) : undefined,
    }, 0);
  }

  function buildAttachmentIndex(records) {
    var out = [];
    (records || []).forEach(function (rec) {
      if (!rec || !Array.isArray(rec.photos)) return;
      rec.photos.forEach(function (ph, i) {
        if (!ph || !ph.url) return;
        out.push({
          id: rec.id + ':photo:' + i,
          recordId: rec.id,
          petId: rec.petId,
          url: ph.url,
          type: ph.type || 'daily',
          createdAt: rec.createdAt,
        });
      });
    });
    return out;
  }

  /**
   * Normalize any accepted payload into the canonical HusbandryExport envelope.
   * Preserves legacy fields (kind, schemaVersion, careGuides, breeding*) for AS runtime.
   */
  function normalizeHusbandryExport(raw, opts) {
    opts = opts || {};
    var data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!isPlainObject(data)) throw new Error('invalid_json');
    data = stripDangerousKeys(cloneJson(data), 0);

    var pets = data.pets || (data.pet ? [data.pet] : []);
    if (!Array.isArray(pets)) pets = [];
    pets = pets.map(function (p) {
      if (!p) return null;
      var name = p.name || p.petName || '';
      var createdAt = normalizeIsoDate(p.createdAt || p.careStartDate, { allowEmpty: true }) || '';
      var updatedAt = normalizeIsoDate(p.updatedAt, { allowEmpty: true }) || '';
      var profile = isPlainObject(p.profile) ? p.profile : {
        sex: p.sex || 'unknown',
        source: p.source || '',
        profileNote: p.profileNote || '',
        husbandryId: p.husbandryId || '',
        privacy: p.privacy || 'private',
        careStartDate: p.careStartDate || p.startDate || '',
        speciesId: p.speciesId || '',
      };
      if (profile.careStartDate) {
        var csd = normalizeIsoDate(profile.careStartDate, { allowEmpty: true });
        if (csd) profile.careStartDate = csd.slice(0, 10);
      }
      return stripDangerousKeys({
        id: p.id || '',
        name: name,
        petName: p.petName || name,
        commonName: p.commonName || p.chineseName || '',
        scientificName: p.scientificName || '',
        category: p.category || '',
        lifeStage: p.lifeStage || '',
        status: p.status || '',
        image: p.image || p.profilePhoto || '',
        careGuideId: p.careGuideId || '',
        tasks: p.tasks || p.questProgress || null,
        records: Array.isArray(p.records) ? p.records.map(normalizeRecordForExchange).filter(Boolean) : undefined,
        breeding: p.breeding || undefined,
        profile: profile,
        createdAt: createdAt,
        updatedAt: updatedAt,
      }, 0);
    }).filter(Boolean);

    var records = data.records || data.careLogs || [];
    if (!Array.isArray(records)) records = [];
    if (!records.length) {
      pets.forEach(function (p) {
        if (Array.isArray(p.records)) records = records.concat(p.records);
      });
    }
    records = records.map(normalizeRecordForExchange).filter(Boolean);

    var attachments = Array.isArray(data.attachments)
      ? data.attachments
      : buildAttachmentIndex(records);

    var exportedAt = normalizeIsoDate(data.exportedAt) || new Date().toISOString();
    var meta = isPlainObject(data.metadata)
      ? data.metadata
      : (isPlainObject(data.meta) ? data.meta : {});

    var envelope = {
      schema: SCHEMA_NAME,
      version: SCHEMA_VERSION,
      /* Legacy mirrors — keep for existing AS/mobile importers. */
      schemaVersion: SCHEMA_VERSION,
      kind: data.kind || 'husbandry-backup',
      exportedAt: exportedAt,
      locale: data.locale || opts.locale || '',
      source: data.source || opts.source || 'apps-script',
      pets: pets,
      records: records,
      quests: Array.isArray(data.quests) ? data.quests : undefined,
      reminders: Array.isArray(data.reminders) ? data.reminders : undefined,
      attachments: attachments,
      metadata: meta,
      meta: meta,
      careGuides: Array.isArray(data.careGuides) ? data.careGuides : undefined,
      breedingPairs: Array.isArray(data.breedingPairs) ? data.breedingPairs : undefined,
      offspring: Array.isArray(data.offspring) ? data.offspring : undefined,
      breedingEvents: Array.isArray(data.breedingEvents) ? data.breedingEvents : undefined,
    };

    return stripDangerousKeys(envelope, 0);
  }

  function parseAndNormalize(raw, opts) {
    var data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!isPlainObject(data)) throw new Error('invalid_json');
    if (
      data.kind !== 'husbandry-backup' &&
      data.kind !== 'husbandry-pet' &&
      data.schema !== SCHEMA_NAME &&
      !data.schemaVersion &&
      !data.version &&
      !Array.isArray(data.pets)
    ) {
      if (data.pet && !data.pets) {
        /* ok — single pet legacy */
      } else {
        throw new Error('unsupported_format');
      }
    }
    var normalized = normalizeHusbandryExport(data, opts);
    var result = validateHusbandryExport(normalized);
    if (!result.ok) {
      var err = new Error('validation_failed');
      err.issues = result.issues;
      throw err;
    }
    return normalized;
  }

  /**
   * Map mobile event types into exchange records (stable IDs preserved).
   */
  function mobileEventToRecord(event, petId) {
    if (!event) return null;
    var form = event.form || {};
    var canon = canonicalRecordType(event.type);
    var values = {};
    if (form.food) values.food = form.food;
    if (form.amount) values.amount = form.amount;
    if (form.consumed != null) values.feedingStatus = form.consumed ? 'ate' : 'refused';
    if (form.weight) values.value = form.weight;
    if (form.temperature) values.temperature = form.temperature;
    if (form.humidity) values.humidity = form.humidity;
    if (form.symptoms) values.symptoms = form.symptoms;
    if (form.treatment) values.treatment = form.treatment;
    if (form.followUpDate) values.followUpDate = form.followUpDate;
    return normalizeRecordForExchange({
      id: event.id,
      petId: petId,
      type: event.type,
      recordId: event.type,
      note: form.note || '',
      photoUrl: form.photoDataUrl || '',
      photoType: 'daily',
      values: values,
      createdAt: event.createdAt || event.updatedAt,
      date: event.createdAt || event.updatedAt,
    });
  }

  function buildExportFromMobileState(mobileState, opts) {
    opts = opts || {};
    var records = [];
    var pets = (mobileState.records || []).map(function (rec) {
      (rec.events || []).forEach(function (ev) {
        var mapped = mobileEventToRecord(ev, rec.id);
        if (mapped) records.push(mapped);
      });
      return {
        id: rec.id,
        name: rec.label,
        petName: rec.label,
        commonName: rec.speciesName || '',
        scientificName: '',
        category: rec.kind || '',
        lifeStage: '',
        image: '',
        profile: {
          sex: 'unknown',
          husbandryId: rec.qrCode || '',
          privacy: 'private',
          careStartDate: (rec.createdAt || '').slice(0, 10),
          speciesId: rec.linkedSpecimenId || '',
        },
        createdAt: rec.createdAt,
        updatedAt: rec.createdAt,
      };
    });
    return normalizeHusbandryExport({
      schema: SCHEMA_NAME,
      version: SCHEMA_VERSION,
      kind: 'husbandry-backup',
      exportedAt: new Date().toISOString(),
      locale: opts.locale || '',
      source: 'mobile',
      pets: pets,
      records: records,
      metadata: {
        petCount: pets.length,
        recordCount: records.length,
        mobileStorageKey: opts.storageKey || '',
      },
    }, { source: 'mobile', locale: opts.locale });
  }

  return {
    SCHEMA_NAME: SCHEMA_NAME,
    SCHEMA_VERSION: SCHEMA_VERSION,
    CANONICAL_RECORD_TYPES: CANONICAL_RECORD_TYPES.slice(),
    RECORD_TYPE_ALIASES: RECORD_TYPE_ALIASES,
    isSafeId: isSafeId,
    normalizeIsoDate: normalizeIsoDate,
    canonicalRecordType: canonicalRecordType,
    stripDangerousKeys: stripDangerousKeys,
    validateHusbandryExport: validateHusbandryExport,
    normalizeHusbandryExport: normalizeHusbandryExport,
    normalizeRecordForExchange: normalizeRecordForExchange,
    parseAndNormalize: parseAndNormalize,
    buildAttachmentIndex: buildAttachmentIndex,
    mobileEventToRecord: mobileEventToRecord,
    buildExportFromMobileState: buildExportFromMobileState,
    detectEnvelope: detectEnvelope,
  };
});
