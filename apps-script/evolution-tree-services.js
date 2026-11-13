/**
 * MCurator — Evolution Tree Lab external services (GBIF, PBDB) + normalization helpers.
 * Standalone IIFE; no dependency on evolution-tree-lab.js load order if window is ready.
 */
(function (global) {
  'use strict';

  var GBIF_MATCH = 'https://api.gbif.org/v1/species/match';
  var GBIF_MEDIA = 'https://api.gbif.org/v1/species';
  var PBDB_TAXA = 'https://paleobiodb.org/data1.2/taxa/list.json';
  var WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

  /**
   * Stable Commons thumbnail URL: follows renames and avoids brittle /thumb/HASH/120px-… paths.
   */
  function commonsThumbByFileName(fileName, widthPx) {
    var w = Math.max(40, Math.min(800, Math.floor(Number(widthPx) || 120)));
    var fn = String(fileName || '')
      .trim()
      .replace(/\s+/g, '_');
    if (!fn) return '';
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(fn) + '?width=' + w;
  }

  /** Curated Commons files for major clades (resolved via Special:FilePath). */
  var CLADE_REP_THUMB = {
    echinodermata: commonsThumbByFileName('Echinoderm_collage_2.jpg', 120),
    cephalochordata: commonsThumbByFileName('Branchiostoma_lanceolatum.jpg', 120),
    platyhelminthes: commonsThumbByFileName('Platyhelminthes_diversity.jpg', 120),
    chelicerata: commonsThumbByFileName('Limulus_polyphemus.jpg', 120),
    chordata: commonsThumbByFileName('Chordata.png', 120),
    cnidaria: commonsThumbByFileName('Cnidaria.png', 120),
    lepidoptera: commonsThumbByFileName('Peacock_butterfly_(Aglais_io)_2.jpg', 120),
    hymenoptera: commonsThumbByFileName('Hymenoptera.jpg', 120),
    chiroptera: commonsThumbByFileName('Big-eared-townsend-fledermaus.jpg', 120),
    coleoptera: commonsThumbByFileName('Coleoptera_collage.png', 120),
    crustacea: commonsThumbByFileName('Krebs.jpg', 120),
    myriapoda: commonsThumbByFileName('Myriapod_collage.png', 120),
    hexapoda: commonsThumbByFileName('Caelifera.jpg', 120),
    vertebrata: commonsThumbByFileName('Vertebrata_002.png', 120),
    carnivora: commonsThumbByFileName('Carnivora_Distribution.png', 120),
    cetacea: commonsThumbByFileName('Mother_and_baby_sperm_whale.jpg', 120),
    rodentia: commonsThumbByFileName('Mus_musculus.jpg', 120),
    tunicata: commonsThumbByFileName('Tunicate_komodo.jpg', 120),
    porifera: commonsThumbByFileName('Sponges_in_Caribbean_Sea,_Cayman_Islands.jpg', 120),
    homo: commonsThumbByFileName('Da_Vinci_Vitruve_Luc_Viatour.jpg', 120),
    arthropoda: commonsThumbByFileName('Arthropoda_collage.png', 120),
    mollusca: commonsThumbByFileName('Mollusca_Diversity.png', 120),
    trilobita: commonsThumbByFileName('Trilobita_Diversity.png', 120),
    plantae: commonsThumbByFileName('Fr\u00fchling_bl\u00fchender_Kirschenbaum.jpg', 120),
    fungi: commonsThumbByFileName('Fungi_collage.jpg', 120),
    diptera: commonsThumbByFileName('Bessenbandzweefvlieg_Vrouwtje_(2).JPG', 120),
    archaea: commonsThumbByFileName('Archaea.png', 120),
    bacteria: commonsThumbByFileName('Escherichia_coli_2.jpg', 120)
  };

  function safeJson(r) {
    return r.text().then(function (t) {
      try {
        return { ok: r.ok, status: r.status, data: t ? JSON.parse(t) : null };
      } catch (e) {
        return { ok: r.ok, status: r.status, data: null, raw: t };
      }
    });
  }

  /** Protocol-relative or empty URLs break <img> / SVG <image> in some hosts. */
  function normalizeMediaUrl(u) {
    u = String(u || '').trim();
    if (!u) return '';
    if (u.indexOf('//') === 0) u = 'https:' + u;
    return u;
  }

  function sourceScopedKey_(value) {
    if (typeof value === 'number' && isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) return value.trim();
    return null;
  }

  /** GBIF species match — extant / backbone validation */
  function fetchGbifSpeciesMatch(name, opts) {
    opts = opts || {};
    var q = encodeURIComponent(String(name || '').trim());
    if (!q) return Promise.resolve(null);
    var url = GBIF_MATCH + '?name=' + q + '&strict=' + (opts.strict ? 'true' : 'false');
    return fetch(url, { method: 'GET', headers: { Accept: 'application/json' } })
      .then(safeJson)
      .then(function (res) {
        if (!res || !res.ok || !res.data) return null;
        var d = res.data;
        return {
          usageKey: sourceScopedKey_(d.usageKey),
          acceptedUsageKey: sourceScopedKey_(d.acceptedUsageKey),
          scientificName: d.scientificName || '',
          canonicalName: d.canonicalName || '',
          rank: d.rank || '',
          status: d.status || '',
          confidence: d.confidence != null ? Number(d.confidence) : null,
          matchType: d.matchType || '',
          kingdom: d.kingdom || '',
          phylum: d.phylum || '',
          klass: d.class || '',
          order: d.order || '',
          family: d.family || '',
          genus: d.genus || '',
          synonym: d.synonym === true,
          _source: 'gbif'
        };
      })
      .catch(function () {
        return null;
      });
  }

  /** PBDB taxon list — paleobiology / extinct hints */
  function fetchPbdbTaxa(name, opts) {
    opts = opts || {};
    var q = encodeURIComponent(String(name || '').trim());
    if (!q) return Promise.resolve(null);
    var url = PBDB_TAXA + '?taxon_name=' + q + '&limit=5';
    return fetch(url, { method: 'GET', headers: { Accept: 'application/json' } })
      .then(safeJson)
      .then(function (res) {
        if (!res || !res.ok || !res.data || !Array.isArray(res.data.records)) return null;
        var recs = res.data.records;
        if (!recs.length) return null;
        var r0 = recs[0];
        var ext = !!(r0.is_extant === false || r0.is_extant === 0 || String(r0.is_extant) === 'false');
        return {
          pbdbId: r0.taxon_no != null ? String(r0.taxon_no) : '',
          name: r0.taxon_name || '',
          rank: r0.rank || '',
          isExtant: r0.is_extant,
          firstAppearance: r0.first_time_lot || r0.first_time_max || '',
          lastAppearance: r0.last_time_lot || r0.last_time_max || '',
          recordCount: recs.length,
          _source: 'pbdb',
          _extinctHint: ext
        };
      })
      .catch(function () {
        return null;
      });
  }

  /**
   * Merge OpenTree TNRS row with optional GBIF / PBDB payloads.
   * Does not invent OTT; preserves scientific uncertainty messaging.
   */
  function mergeTaxonEnrichment(otRow, gbif, pbdb) {
    var out = Object.assign({}, otRow);
    out.sourcePriority = ['OpenTree'];
    out.extinctStatus = 'unknown';
    out.confidence = otRow.score != null ? Math.min(1, Number(otRow.score) || 0) : null;
    out.notes = Array.isArray(otRow.notes) ? otRow.notes.slice() : [];

    if (gbif && gbif.usageKey) {
      out.gbifId = gbif.usageKey;
      out.gbifMatchType = gbif.matchType;
      out.gbifStatus = gbif.status || '';
      if (!out.acceptedName && gbif.status === 'ACCEPTED' && gbif.synonym !== true && gbif.canonicalName) {
        out.acceptedName = gbif.canonicalName;
      }
      out.sourcePriority.push('GBIF');
      var gbParts = [gbif.kingdom, gbif.phylum, gbif.klass, gbif.order, gbif.family, gbif.genus]
        .map(function (g) {
          return String(g || '').trim();
        })
        .filter(Boolean);
      if (gbParts.length) out.gbifLineageHaystack = gbParts.join(' ').toLowerCase();
    }

    if (pbdb && pbdb.pbdbId) {
      out.pbdbId = pbdb.pbdbId;
      out.sourcePriority.push('PBDB');
      out.geologicRange = {
        firstAppearance: pbdb.firstAppearance || '',
        lastAppearance: pbdb.lastAppearance || ''
      };
      try {
        out.geologicDetail = inferGeologicFromPbdbStrings(pbdb.firstAppearance || '', pbdb.lastAppearance || '');
      } catch (eG) {
        out.geologicDetail = null;
      }
      if (pbdb._extinctHint) {
        out.extinctStatus = 'extinct';
        if (out.notes.indexOf('paleo_pbdb') < 0) out.notes.push('paleo_pbdb');
      }
    }

    if (otRow.warning && String(otRow.warning).length) {
      out.confidence = out.confidence != null ? Math.min(out.confidence, 0.45) : 0.45;
    }

    return out;
  }

  function enrichTaxonRow(row, sourceFlags) {
    sourceFlags = sourceFlags || { gbif: true, pbdb: true };
    var name =
      String(row.uniqueName || row.matchedName || row.inputName || '')
        .split('(')[0]
        .trim() || String(row.inputName || '').trim();
    var p1 = sourceFlags.gbif !== false ? fetchGbifSpeciesMatch(name, {}) : Promise.resolve(null);
    var p2 = sourceFlags.pbdb !== false ? fetchPbdbTaxa(name, {}) : Promise.resolve(null);
    return Promise.all([p1, p2]).then(function (pair) {
      return mergeTaxonEnrichment(row, pair[0], pair[1]);
    });
  }

  function fetchGbifSpeciesMedia(usageKey) {
    var id = Number(usageKey);
    if (!id) return Promise.resolve(null);
    var url = GBIF_MEDIA + '/' + id + '/media?limit=3';
    return fetch(url, { method: 'GET', headers: { Accept: 'application/json' } })
      .then(safeJson)
      .then(function (res) {
        if (!res || !res.ok || !res.data || !Array.isArray(res.data.results)) return null;
        var results = res.data.results;
        for (var k = 0; k < results.length; k++) {
          var r0 = results[k];
          if (!r0) continue;
          var typ = String(r0.type || '').toLowerCase();
          if (typ && typ !== 'stillimage') continue;
          var u = normalizeMediaUrl(r0.identifier || r0.url || r0.src || '');
          if (u) return { url: u, source: 'gbif_media' };
        }
        return null;
      })
      .catch(function () {
        return null;
      });
  }

  function wikiTitleFromScientificName(name) {
    var s = String(name || '').trim().replace(/\s+/g, '_');
    if (!s) return '';
    return encodeURIComponent(s);
  }

  function fetchWikipediaThumb(name) {
    var t = wikiTitleFromScientificName(name.split('(')[0].trim());
    if (!t) return Promise.resolve(null);
    return fetch(WIKI_SUMMARY + t, { headers: { Accept: 'application/json' } })
      .then(safeJson)
      .then(function (res) {
        if (!res || !res.ok || !res.data) return null;
        var d = res.data;
        var img = d.originalimage && d.originalimage.source;
        var th = d.thumbnail && d.thumbnail.source;
        var u = th || img;
        if (!u) return null;
        return { url: u, source: 'wikipedia', title: d.title || '' };
      })
      .catch(function () {
        return null;
      });
  }

  function representativeThumbForTaxonName(name) {
    var n = String(name || '').toLowerCase();
    if (!n) return null;
    var keys = Object.keys(CLADE_REP_THUMB).sort(function (a, b) {
      return b.length - a.length;
    });
    for (var i = 0; i < keys.length; i++) {
      if (n.indexOf(keys[i]) >= 0) return { url: CLADE_REP_THUMB[keys[i]], source: 'representative_clade' };
    }
    return null;
  }

  /**
   * Resolve best thumbnail: specimen callback > GBIF media > Wikipedia > clade representative.
   * getSpecimenImage: function(scientificName) => url string or null
   */
  function enrichTaxonMediaRow(row, getSpecimenImage) {
    getSpecimenImage = getSpecimenImage || function () {
      return null;
    };
    var name =
      String(row.acceptedName || row.matchedName || row.uniqueName || row.inputName || '')
        .split('(')[0]
        .trim();
    var repHaystack = [
      row.acceptedName,
      row.matchedName,
      row.uniqueName,
      row.inputName,
      row.gbifLineageHaystack
    ]
      .map(function (p) {
        return String(p || '')
          .split('(')[0]
          .trim();
      })
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .replace(/\s+/g, ' ');
    var sp = getSpecimenImage(name);
    if (sp) {
      row.media = row.media || {};
      row.media.thumbnailUrl = sp;
      row.media.imageUrl = sp;
      row.media.source = 'mcurator_specimen';
      return Promise.resolve(row);
    }
    var chain = Promise.resolve(null);
    if (row.gbifId) {
      chain = chain.then(function () {
        return fetchGbifSpeciesMedia(row.gbifId);
      });
    }
    return chain.then(function (gbifM) {
      if (gbifM && gbifM.url) {
        row.media = row.media || {};
        row.media.thumbnailUrl = normalizeMediaUrl(gbifM.url);
        row.media.imageUrl = row.media.thumbnailUrl;
        row.media.source = gbifM.source;
        return row;
      }
      return fetchWikipediaThumb(name).then(function (wiki) {
        if (wiki && wiki.url) {
          row.media = row.media || {};
          row.media.thumbnailUrl = normalizeMediaUrl(wiki.url);
          row.media.imageUrl = row.media.thumbnailUrl;
          row.media.source = wiki.source;
          return row;
        }
        var rep = representativeThumbForTaxonName(repHaystack || name);
        if (rep && rep.url) {
          row.media = row.media || {};
          row.media.thumbnailUrl = normalizeMediaUrl(rep.url);
          row.media.imageUrl = row.media.thumbnailUrl;
          row.media.source = rep.source;
        }
        return row;
      });
    });
  }

  function enrichTaxaMediaRows(rows, getSpecimenImage, maxConcurrent) {
    maxConcurrent = Math.max(1, Math.floor(Number(maxConcurrent) || 3));
    var i = 0;
    var out = rows;
    function next() {
      if (i >= out.length) return Promise.resolve(out);
      var slice = [];
      var end = Math.min(i + maxConcurrent, out.length);
      for (var j = i; j < end; j++) slice.push(enrichTaxonMediaRow(out[j], getSpecimenImage));
      i = end;
      return Promise.all(slice).then(next);
    }
    return next();
  }

  function enrichTaxaRows(rows, sourceFlags, maxConcurrent) {
    maxConcurrent = Math.max(1, Math.floor(Number(maxConcurrent) || 4));
    var out = [];
    var i = 0;
    function next() {
      if (i >= rows.length) return Promise.resolve(out);
      var slice = [];
      var end = Math.min(i + maxConcurrent, rows.length);
      for (var j = i; j < end; j++) slice.push(enrichTaxonRow(rows[j], sourceFlags));
      i = end;
      return Promise.all(slice).then(function (chunk) {
        out = out.concat(chunk);
        return next();
      });
    }
    return next();
  }

  /** Simple TTL cache for client-side taxon / PBDB lookups */
  var _etlMemCache = {};
  function etlCacheGet(key) {
    var e = _etlMemCache[String(key || '')];
    if (!e) return null;
    if (Date.now() > e.exp) {
      delete _etlMemCache[String(key)];
      return null;
    }
    return e.val;
  }
  function etlCacheSet(key, val, ttlMs) {
    ttlMs = Math.max(5000, Number(ttlMs) || 300000);
    _etlMemCache[String(key || '')] = { val: val, exp: Date.now() + ttlMs };
  }

  /**
   * ICS-inspired Phanerozoic scale (approximate Ma boundaries).
   * Used for Era / Period / Epoch fallback display — not species-level precision.
   */
  var GEO_PERIODS = [
    { key: 'cambrian', eraZh: '古生代', eraEn: 'Paleozoic', periodZh: '寒武紀', periodEn: 'Cambrian', startMa: 541, endMa: 485 },
    { key: 'ordovician', eraZh: '古生代', eraEn: 'Paleozoic', periodZh: '奧陶紀', periodEn: 'Ordovician', startMa: 485, endMa: 443 },
    { key: 'silurian', eraZh: '古生代', eraEn: 'Paleozoic', periodZh: '志留紀', periodEn: 'Silurian', startMa: 443, endMa: 419 },
    { key: 'devonian', eraZh: '古生代', eraEn: 'Paleozoic', periodZh: '泥盆紀', periodEn: 'Devonian', startMa: 419, endMa: 359 },
    { key: 'carboniferous', eraZh: '古生代', eraEn: 'Paleozoic', periodZh: '石炭紀', periodEn: 'Carboniferous', startMa: 359, endMa: 299 },
    { key: 'permian', eraZh: '古生代', eraEn: 'Paleozoic', periodZh: '二疊紀', periodEn: 'Permian', startMa: 299, endMa: 252 },
    { key: 'triassic', eraZh: '中生代', eraEn: 'Mesozoic', periodZh: '三疊紀', periodEn: 'Triassic', startMa: 252, endMa: 201 },
    { key: 'jurassic', eraZh: '中生代', eraEn: 'Mesozoic', periodZh: '侏羅紀', periodEn: 'Jurassic', startMa: 201, endMa: 145 },
    { key: 'cretaceous', eraZh: '中生代', eraEn: 'Mesozoic', periodZh: '白堊紀', periodEn: 'Cretaceous', startMa: 145, endMa: 66 },
    { key: 'paleogene', eraZh: '新生代', eraEn: 'Cenozoic', periodZh: '古近紀', periodEn: 'Paleogene', startMa: 66, endMa: 23 },
    { key: 'neogene', eraZh: '新生代', eraEn: 'Cenozoic', periodZh: '新近紀', periodEn: 'Neogene', startMa: 23, endMa: 2.58 },
    { key: 'quaternary', eraZh: '新生代', eraEn: 'Cenozoic', periodZh: '第四紀', periodEn: 'Quaternary', startMa: 2.58, endMa: 0 }
  ];

  var GEO_EPOCHS_QUAT = [
    { epochZh: '更新世', epochEn: 'Pleistocene', startMa: 2.58, endMa: 0.0117 },
    { epochZh: '全新世', epochEn: 'Holocene', startMa: 0.0117, endMa: 0 }
  ];

  var GEO_EPOCHS_NEO = [
    { epochZh: '中新世', epochEn: 'Miocene', startMa: 23, endMa: 5.3 },
    { epochZh: '上新世', epochEn: 'Pliocene', startMa: 5.3, endMa: 2.58 }
  ];

  function _periodAtMa(ma) {
    var x = Number(ma);
    if (!isFinite(x)) return null;
    for (var i = 0; i < GEO_PERIODS.length; i++) {
      var p = GEO_PERIODS[i];
      if (x <= p.startMa && x > p.endMa) return p;
    }
    return null;
  }

  function _epochInPeriod(periodKey, ma) {
    var x = Number(ma);
    if (!isFinite(x)) return null;
    if (periodKey === 'quaternary') {
      for (var i = 0; i < GEO_EPOCHS_QUAT.length; i++) {
        var e = GEO_EPOCHS_QUAT[i];
        if (x <= e.startMa && x >= e.endMa) return e;
      }
    }
    if (periodKey === 'neogene') {
      for (var j = 0; j < GEO_EPOCHS_NEO.length; j++) {
        var e2 = GEO_EPOCHS_NEO[j];
        if (x <= e2.startMa && x > e2.endMa) return e2;
      }
    }
    return null;
  }

  /**
   * Map PBDB time-bin strings (or numeric) to approximate era/period/epoch + Ma hints.
   * confidence: direct_fossil | interval_approx | unknown
   */
  function inferGeologicFromPbdbStrings(firstLot, lastLot) {
    var f = String(firstLot || '').toLowerCase();
    var l = String(lastLot || '').toLowerCase();
    var blob = f + ' ' + l;
    var out = {
      firstAppearanceMa: null,
      lastAppearanceMa: null,
      era: '',
      period: '',
      epoch: '',
      eraZh: '',
      periodZh: '',
      epochZh: '',
      confidence: 'unknown',
      rawFirst: String(firstLot || ''),
      rawLast: String(lastLot || ''),
      noteZh: ''
    };
    if (!blob.trim()) {
      out.noteZh = 'PBDB 未回傳可解析的地質區間字串。';
      return out;
    }
    out.confidence = 'interval_approx';
    var maGuess = null;
    /* keyword → approximate mid-Ma within Phanerozoic */
    var table = [
      ['cambrian', 520],
      ['ordovician', 470],
      ['silurian', 430],
      ['devonian', 390],
      ['carboniferous', 330],
      ['permian', 270],
      ['triassic', 225],
      ['jurassic', 170],
      ['cretaceous', 100],
      ['paleogene', 40],
      ['neogene', 10],
      ['quaternary', 1],
      ['holocene', 0.005],
      ['pleistocene', 1],
      ['miocene', 14],
      ['pliocene', 3.5],
      ['eocene', 45],
      ['oligocene', 30],
      ['paleocene', 60]
    ];
    for (var i = 0; i < table.length; i++) {
      if (blob.indexOf(table[i][0]) >= 0) {
        maGuess = table[i][1];
        break;
      }
    }
    if (maGuess == null && /\d/.test(blob)) {
      var m = blob.match(/(\d{2,4})\s*ma/);
      if (m) maGuess = Number(m[1]);
    }
    if (maGuess != null) {
      var p = _periodAtMa(maGuess);
      if (p) {
        out.firstAppearanceMa = p.startMa;
        out.lastAppearanceMa = p.endMa;
        out.era = p.eraEn;
        out.eraZh = p.eraZh;
        out.period = p.periodEn;
        out.periodZh = p.periodZh;
        var ep = _epochInPeriod(p.key, maGuess);
        if (ep) {
          out.epoch = ep.epochEn || '';
          out.epochZh = ep.epochZh || '';
        }
      }
      out.noteZh =
        '以下年代由 PBDB 區間名稱或關鍵字推估，屬近似對照，非精確定年。物種級現生類群不應解讀為單一「起源年代」。';
    } else {
      out.noteZh = '無法將 PBDB 區間字串對照到標準紀／世；請於 PBDB 原始資料中人工確認。';
    }
    return out;
  }

  /** Optional: fetch PBDB taxa with slightly richer fields (same endpoint, more parse). */
  function fetchPbdbTaxaRich(name) {
    var ck = 'pbdb_rich:' + String(name || '').trim().toLowerCase();
    var hit = etlCacheGet(ck);
    if (hit) return Promise.resolve(hit);
    return fetchPbdbTaxa(name, {}).then(function (base) {
      if (!base) {
        etlCacheSet(ck, null, 120000);
        return null;
      }
      var geo = inferGeologicFromPbdbStrings(base.firstAppearance, base.lastAppearance);
      var out = Object.assign({}, base, { geologicDetail: geo });
      etlCacheSet(ck, out, 300000);
      return out;
    });
  }

  /**
   * Unified thumbnail resolver (async). Priority: specimen fn → GBIF → Wikipedia → clade rep.
   */
  function getRepresentativeImage(row, getSpecimenImage) {
    return enrichTaxonMediaRow(Object.assign({}, row), getSpecimenImage).then(function (r) {
      return {
        url: (r.media && r.media.thumbnailUrl) || '',
        source: (r.media && r.media.source) || '',
        row: r
      };
    });
  }

  /** Era / Period / Epoch reference (Ma boundaries simplified; UI + disclaimers only — not time-calibrated tree). */
  var geologyTimeline = {
    eras: [
      { id: 'precambrian', zh: '前寒武紀', en: 'Precambrian', maStart: 4600, maEnd: 541 },
      { id: 'paleozoic', zh: '古生代', en: 'Paleozoic', maStart: 541, maEnd: 252 },
      { id: 'mesozoic', zh: '中生代', en: 'Mesozoic', maStart: 252, maEnd: 66 },
      { id: 'cenozoic', zh: '新生代', en: 'Cenozoic', maStart: 66, maEnd: 0 }
    ],
    periods: [
      { id: 'cambrian', zh: '寒武紀', en: 'Cambrian', maStart: 541, maEnd: 485 },
      { id: 'ordovician', zh: '奧陶紀', en: 'Ordovician', maStart: 485, maEnd: 444 },
      { id: 'silurian', zh: '志留紀', en: 'Silurian', maStart: 444, maEnd: 419 },
      { id: 'devonian', zh: '泥盆紀', en: 'Devonian', maStart: 419, maEnd: 359 },
      { id: 'carboniferous', zh: '石炭紀', en: 'Carboniferous', maStart: 359, maEnd: 299 },
      { id: 'permian', zh: '二疊紀', en: 'Permian', maStart: 299, maEnd: 252 },
      { id: 'triassic', zh: '三疊紀', en: 'Triassic', maStart: 252, maEnd: 201 },
      { id: 'jurassic', zh: '侏羅紀', en: 'Jurassic', maStart: 201, maEnd: 145 },
      { id: 'cretaceous', zh: '白堊紀', en: 'Cretaceous', maStart: 145, maEnd: 66 },
      { id: 'paleogene', zh: '古近紀', en: 'Paleogene', maStart: 66, maEnd: 23 },
      { id: 'neogene', zh: '新近紀', en: 'Neogene', maStart: 23, maEnd: 2.6 },
      { id: 'quaternary', zh: '第四紀', en: 'Quaternary', maStart: 2.6, maEnd: 0 }
    ],
    epochsCenozoic: [
      { id: 'paleocene', zh: '古新世', en: 'Paleocene', maStart: 66, maEnd: 56 },
      { id: 'eocene', zh: '始新世', en: 'Eocene', maStart: 56, maEnd: 34 },
      { id: 'oligocene', zh: '漸新世', en: 'Oligocene', maStart: 34, maEnd: 23 },
      { id: 'miocene', zh: '中新世', en: 'Miocene', maStart: 23, maEnd: 5.3 },
      { id: 'pliocene', zh: '上新世', en: 'Pliocene', maStart: 5.3, maEnd: 2.6 },
      { id: 'pleistocene', zh: '更新世', en: 'Pleistocene', maStart: 2.6, maEnd: 0.012 },
      { id: 'holocene', zh: '全新世', en: 'Holocene', maStart: 0.012, maEnd: 0 }
    ],
    disclaimerZh:
      '此時間軸為國際地層對照之參考尺度；OpenTree 分支長度非地質年代。AfriGIS 僅反映採樣座標之岩性／年代脈絡，不作為譜系證據。'
  };

  /**
   * Pure helpers for Evolution Tree Lab build logic (UI calls doBuildTree; this documents RPC mapping).
   */
  function mapViewDirectionToTreeRpcHints(viewDirection, descendantDepth) {
    var vd = String(viewDirection || 'ancestry');
    var d = Math.min(3, Math.max(1, Number(descendantDepth) || 2));
    var heightLimit = d <= 1 ? 2 : d === 2 ? 4 : 8;
    if (vd === 'descendant') return { rpcMode: 'synthetic-subtree', heightLimit: heightLimit, useLineagePosition: false };
    if (vd === 'compare') return { rpcMode: 'induced', heightLimit: null, useLineagePosition: false };
    if (vd === 'sister') return { rpcMode: 'induced', heightLimit: null, useLineagePosition: true };
    return { rpcMode: 'induced', heightLimit: null, useLineagePosition: true };
  }

  global.MCEvolutionTreeTreeBuilders = {
    mapViewDirectionToTreeRpcHints: mapViewDirectionToTreeRpcHints
  };

  global.MCEvolutionTreeServices = {
    geologyTimeline: geologyTimeline,
    fetchGbifSpeciesMatch: fetchGbifSpeciesMatch,
    fetchGbifSpeciesMedia: fetchGbifSpeciesMedia,
    fetchPbdbTaxa: fetchPbdbTaxa,
    fetchWikipediaThumb: fetchWikipediaThumb,
    representativeThumbForTaxonName: representativeThumbForTaxonName,
    mergeTaxonEnrichment: mergeTaxonEnrichment,
    enrichTaxonRow: enrichTaxonRow,
    enrichTaxaRows: enrichTaxaRows,
    enrichTaxonMediaRow: enrichTaxonMediaRow,
    enrichTaxaMediaRows: enrichTaxaMediaRows,
    etlCacheGet: etlCacheGet,
    etlCacheSet: etlCacheSet,
    inferGeologicFromPbdbStrings: inferGeologicFromPbdbStrings,
    fetchPbdbTaxaRich: fetchPbdbTaxaRich,
    getRepresentativeImage: getRepresentativeImage,
    GEO_PERIODS: GEO_PERIODS
  };
})(typeof window !== 'undefined' ? window : this);
