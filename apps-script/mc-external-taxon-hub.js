/**
 * Unified client-side taxonomy: GBIF (via McTaxonomy), PBDB, EarthLife Consortium (ELC).
 * Loaded after mc-gbif-client.js; extends McTaxonomy.searchTaxonSuggestions when available.
 */
(function (global) {
  'use strict';

  var PBDB_LIST =
    'https://paleobiodb.org/data1.2/taxa/list.json?vocab=pbdb&show=full&limit=12&name=';
  var ELC_BASE = 'https://earthlifeconsortium.org/api_v1/tax?output=json&taxon=';
  var elcDisabled = false;

  function canFetchCrossOrigin_() {
    try {
      return !!(global.location && global.location.protocol && global.location.protocol !== 'file:');
    } catch (e) {
      return true;
    }
  }

  function looksLikeLatinBinomial_(q) {
    var parts = safeStr(q).split(/\s+/).filter(Boolean);
    if (parts.length < 2 || parts.length > 4) return false;
    if (!/^[A-Za-z]/.test(parts[0])) return false;
    return /^[a-z]/.test(String(parts[1] || ''));
  }

  function safeStr(s) {
    return String(s == null ? '' : s).trim();
  }

  function mapPbdbVocabRecord(rec) {
    if (!rec || !rec.taxon_name) return null;
    var tn = safeStr(rec.taxon_name);
    var cls = rec.class && String(rec.class).indexOf('NO_CLASS') === 0 ? '' : safeStr(rec.class);
    var sci = safeStr(rec.accepted_name || tn);
    var label = sci + (rec.ref_author ? ' (' + safeStr(rec.ref_author) + (rec.ref_pubyr ? ', ' + rec.ref_pubyr : '') + ')' : '');
    var geoEarly = safeStr(rec.early_interval);
    var geoLate = safeStr(rec.late_interval);
    var ma = '';
    if (rec.firstapp_max_ma != null && rec.firstapp_min_ma != null) {
      ma = 'Ma ~' + rec.firstapp_max_ma + '–' + rec.firstapp_min_ma;
    }
    var eco = [];
    if (rec.motility) eco.push('motility: ' + rec.motility);
    if (rec.life_habit) eco.push('habitat: ' + rec.life_habit);
    if (rec.diet) eco.push('diet: ' + rec.diet);
    if (rec.ecospace_comments) eco.push(safeStr(rec.ecospace_comments).slice(0, 280));
    var mat = safeStr(rec.composition);
    return {
      source: 'PBDB',
      rank: safeStr(rec.taxon_rank),
      label: label,
      scientificName: sci,
      kingdom: '',
      phylum: safeStr(rec.phylum),
      klass: cls,
      order: safeStr(rec.order),
      family: safeStr(rec.family),
      genus: safeStr(rec.genus),
      species: safeStr(rec.taxon_rank).toLowerCase() === 'species' ? tn : '',
      taxonKey: null,
      iucnStatus: '',
      matchType: 'PBDB',
      confidence: rec.n_occs != null ? Number(rec.n_occs) : null,
      pbdbTxnOid: rec.taxon_no != null ? 'txn:' + rec.taxon_no : '',
      pbdbTxnNo: rec.taxon_no != null ? String(rec.taxon_no) : '',
      geologicalPeriodEarly: geoEarly,
      geologicalPeriodLate: geoLate,
      pbdbInterval: [geoEarly, geoLate].filter(Boolean).join(' – ') + (ma ? ' (' + ma + ')' : ''),
      pbdbEco: eco.join('; '),
      pbdbComposition: mat,
      isExtant: safeStr(rec.is_extant)
    };
  }

  function searchPbdb(q) {
    var t = safeStr(q);
    if (t.length < 2) return Promise.resolve([]);
    var url = PBDB_LIST + encodeURIComponent(t);
    return fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' })
      .then(function (res) {
        return res.ok ? res.json() : {};
      })
      .then(function (j) {
        var raw = (j && j.records) || [];
        var out = [];
        for (var i = 0; i < raw.length; i++) {
          var m = mapPbdbVocabRecord(raw[i]);
          if (m && m.scientificName) out.push(m);
        }
        return out;
      })
      .catch(function () {
        return [];
      });
  }

  function walkElcCollect(obj, depth, out, seenObjs, keySeen) {
    if (!obj || depth > 8) return;
    if (typeof obj === 'string') return;
    if (typeof obj !== 'object') return;
    if (seenObjs.indexOf(obj) >= 0) return;
    seenObjs.push(obj);
    var name =
      obj.taxon_name ||
      obj.scientificName ||
      obj.name ||
      obj.accepted_name ||
      (obj.name && obj.name.scientificName);
    name = safeStr(name);
    var db = safeStr(obj.database || obj.source || obj.db || '');
    if (name.length >= 2 && name.length < 200 && /^[A-Za-z][A-Za-z0-9 \.\-\']+$/.test(name)) {
      var key = (db || 'ELC') + '|' + name.toLowerCase();
      if (!keySeen[key]) {
        keySeen[key] = 1;
        out.push({
          source: 'ELC' + (db ? ' (' + db + ')' : ''),
          rank: safeStr(obj.rank || obj.taxon_rank),
          label: name + (db ? ' · ' + db : ''),
          scientificName: name,
          kingdom: '',
          phylum: '',
          klass: '',
          order: '',
          family: '',
          genus: '',
          species: '',
          taxonKey: null,
          iucnStatus: '',
          matchType: 'ELC',
          confidence: null,
          elcTaxonRef: safeStr(obj.id || obj.taxon_id || obj.elc_id || '')
        });
      }
    }
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) walkElcCollect(obj[i], depth + 1, out, seenObjs, keySeen);
      return;
    }
    var keys = Object.keys(obj);
    for (var k = 0; k < keys.length; k++) walkElcCollect(obj[keys[k]], depth + 1, out, seenObjs, keySeen);
  }

  function parseElcJsonToHits(data) {
    var out = [];
    if (!data) return out;
    walkElcCollect(data, 0, out, [], {});
    return out.slice(0, 16);
  }

  function tryFetchElcUrl(base, q) {
    var url = base + encodeURIComponent(q);
    return fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .catch(function () {
        return null;
      });
  }

  function searchElc(q) {
    var t = safeStr(q);
    if (elcDisabled || !canFetchCrossOrigin_()) return Promise.resolve([]);
    if (t.length < 2 || !looksLikeLatinBinomial_(t)) return Promise.resolve([]);
    return tryFetchElcUrl(ELC_BASE, t)
      .then(function (j) {
        if (j && (typeof j === 'object' || Array.isArray(j))) {
          var hits = parseElcJsonToHits(j);
          if (hits.length) return hits;
        }
        return [];
      })
      .catch(function () {
        elcDisabled = true;
        return [];
      });
  }

  function mergeSuggestionRows(gbif, pbdb, elc) {
    var rows = []
      .concat(Array.isArray(gbif) ? gbif : [])
      .concat(Array.isArray(pbdb) ? pbdb : [])
      .concat(Array.isArray(elc) ? elc : []);
    var seen = {};
    var out = [];
    for (var j = 0; j < rows.length; j++) {
      var h = rows[j];
      if (!h || !h.scientificName) continue;
      var src = safeStr(h.source || 'API').toUpperCase();
      var idPart = safeStr(h.pbdbTxnOid || h.pbdbTxnNo || h.taxonKey || h.elcTaxonRef || h.label || '');
      var k = src + '\t' + h.scientificName.trim().toLowerCase() + '\t' + idPart.slice(0, 80);
      if (seen[k]) continue;
      seen[k] = 1;
      out.push(h);
    }
    return out;
  }

  function installMcTaxonomyMerge() {
    var Mc = global.McTaxonomy;
    if (!Mc || typeof Mc.searchTaxonSuggestions !== 'function' || Mc._mcExtendedTaxonomyInstalled) return;
    var orig = Mc.searchTaxonSuggestions;
    Mc._mcExtendedTaxonomyInstalled = true;
    Mc.searchTaxonSuggestions = function (q) {
      if (safeStr(q).length < 2) return Promise.resolve([]);
      return Promise.all([
        orig(q).catch(function () {
          return [];
        }),
        searchPbdb(q).catch(function () {
          return [];
        }),
        searchElc(q).catch(function () {
          return [];
        })
      ]).then(function (parts) {
        return mergeSuggestionRows(parts[0], parts[1], parts[2]);
      });
    };
  }

  /**
   * Enrich paleo project fields from PBDB / ELC / GBIF when user types a scientific name.
   */
  function fetchGbifVernacularHint(q) {
    return fetch(
      'https://api.gbif.org/v1/species/search?q=' +
        encodeURIComponent(q) +
        '&limit=1&status=ACCEPTED',
      { method: 'GET', mode: 'cors', cache: 'no-store' }
    )
      .then(function (res) {
        return res.ok ? res.json() : {};
      })
      .then(function (j) {
        var r = (j && j.results && j.results[0]) || null;
        if (!r || !r.scientificName) return null;
        return {
          source: 'GBIF',
          scientificName: r.scientificName || r.canonicalName || '',
          label: (r.vernacularName ? r.vernacularName + ' — ' : '') + (r.scientificName || '')
        };
      })
      .catch(function () {
        return null;
      });
  }

  function enrichPaleoProject(proj) {
    var p = proj || {};
    var q = safeStr(p.scientificName);
    if (q.length < 3) return Promise.resolve(p);
    return Promise.all([
      searchPbdb(q).catch(function () {
        return [];
      }),
      searchElc(q).catch(function () {
        return [];
      }),
      fetchGbifVernacularHint(q)
    ]).then(function (parts) {
      var pb = (parts[0] && parts[0][0]) || null;
      var elcHit = (parts[1] && parts[1][0]) || null;
      var gb = parts[2] || null;
      if (pb) {
        if (!safeStr(p.geologicalPeriod) && pb.pbdbInterval) p.geologicalPeriod = pb.pbdbInterval.slice(0, 200);
        if (!safeStr(p.taxonomicGroup)) {
          var tg = [pb.phylum, pb.klass, pb.order, pb.family].filter(Boolean).join(' → ');
          if (tg) p.taxonomicGroup = tg.slice(0, 220);
        }
        if (!safeStr(p.knownFossilMaterial) && pb.pbdbComposition) {
          p.knownFossilMaterial = ('Composition (PBDB): ' + pb.pbdbComposition).slice(0, 400);
        }
        var ev = [];
        if (pb.pbdbEco) ev.push(pb.pbdbEco);
        if (pb.isExtant === 'extinct') ev.push('PBDB: extinct taxon');
        if (pb.pbdbTxnOid) ev.push('PBDB: ' + pb.pbdbTxnOid);
        if (elcHit && elcHit.label) ev.push('ELC: ' + elcHit.label);
        if (ev.length && !safeStr(p.evidenceNotes)) p.evidenceNotes = ev.join('\n').slice(0, 900);
      } else if (elcHit) {
        if (!safeStr(p.taxonomicGroup)) p.taxonomicGroup = elcHit.scientificName;
        if (!safeStr(p.evidenceNotes)) p.evidenceNotes = ('ELC: ' + elcHit.label).slice(0, 600);
      }
      if (gb && !safeStr(p.commonName)) {
        var cn = safeStr(gb.label || '').split('—')[0].trim();
        if (cn && cn.indexOf(gb.scientificName) === -1) p.commonName = cn.slice(0, 120);
      }
      return p;
    });
  }

  installMcTaxonomyMerge();

  global.McExternalTaxonHub = {
    searchPbdb: searchPbdb,
    searchElc: searchElc,
    canFetchCrossOrigin: canFetchCrossOrigin_,
    mergeSuggestionRows: mergeSuggestionRows,
    enrichPaleoProject: enrichPaleoProject,
    mapPbdbVocabRecord: mapPbdbVocabRecord,
    installMcTaxonomyMerge: installMcTaxonomyMerge
  };
})(typeof window !== 'undefined' ? window : this);
