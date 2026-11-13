/**
 * Paleo workbench — browser-side chain: Crossref + PBDB occurrences + GBIF match.
 * OpenAI Images / Vision require a backend with OPENAI_API_KEY when not in mock mode.
 */
(function (global) {
  'use strict';

  function safeStr(s) {
    return String(s == null ? '' : s).trim();
  }

  function crossrefSearch(query, rows) {
    var q = encodeURIComponent(safeStr(query).slice(0, 280));
    var url = 'https://api.crossref.org/works?rows=' + (rows || 6) + '&query=' + q;
    return fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    })
      .then(function (r) {
        return r.ok ? r.json() : {};
      })
      .then(function (j) {
        var items = (((j || {}).message || {}).items) || [];
        return items.map(function (it) {
          var title = (it.title && it.title[0]) || '';
          var authorList = (it.author || []).map(function (a) {
            return (a.family || '') + (a.given ? ', ' + a.given : '');
          });
          return {
            source: 'crossref',
            doi: it.DOI || '',
            title: title,
            journal: it['container-title'] && it['container-title'][0] ? it['container-title'][0] : '',
            year:
              (it.published &&
                it.published['date-parts'] &&
                it.published['date-parts'][0] &&
                it.published['date-parts'][0][0]) ||
              '',
            authors: authorList,
            url: it.URL || (it.DOI ? 'https://doi.org/' + it.DOI : '')
          };
        });
      })
      .catch(function () {
        return [];
      });
  }

  function pbdbOccurrences(scientificName, limit) {
    var name = safeStr(scientificName);
    if (!name) return Promise.resolve([]);
    var url =
      'https://paleobiodb.org/data1.2/occs/list.json?base_name=' +
      encodeURIComponent(name) +
      '&limit=' +
      (limit || 6) +
      '&vocab=pbdb&show=full';
    return fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : {};
      })
      .then(function (j) {
        return (j && j.records) || [];
      })
      .catch(function () {
        return [];
      });
  }

  function mapPbdbOccSlim(r) {
    if (!r) return null;
    return {
      occurrence_no: r.occurrence_no,
      accepted_name: r.accepted_name,
      identified_name: r.identified_name,
      early_interval: r.early_interval,
      late_interval: r.late_interval,
      max_ma: r.max_ma,
      min_ma: r.min_ma,
      lat: r.lat,
      lng: r.lng,
      paleolat: r.paleolat,
      paleolng: r.paleolng,
      cc: r.cc,
      state: r.state,
      formation: r.formation,
      collection_name: r.collection_name,
      environment: r.environment,
      lithology1: r.lithology1,
      pres_mode: r.pres_mode,
      life_habit: r.life_habit,
      diet: r.diet,
      ecospace_comments: r.ecospace_comments
    };
  }

  function gbifSpeciesMatch(scientificName) {
    var name = safeStr(scientificName);
    if (!name) return Promise.resolve(null);
    return fetch(
      'https://api.gbif.org/v1/species/match?name=' + encodeURIComponent(name) + '&verbose=false',
      { method: 'GET', mode: 'cors', cache: 'no-store' }
    )
      .then(function (r) {
        return r.ok ? r.json() : {};
      })
      .then(function (j) {
        if (!j || j.matchType === 'NONE') return null;
        return {
          usageKey: j.usageKey,
          scientificName: j.scientificName,
          canonicalName: j.canonicalName,
          rank: j.rank,
          kingdom: j.kingdom,
          phylum: j.phylum,
          klass: j.class,
          order: j.order,
          family: j.family,
          genus: j.genus,
          species: String(j.rank || '').toUpperCase() === 'SPECIES' ? j.species || '' : '',
          confidence: j.confidence,
          matchType: j.matchType,
          status: j.status || '',
          acceptedUsageKey: j.acceptedUsageKey != null ? j.acceptedUsageKey : null,
          synonym: j.synonym === true
        };
      })
      .catch(function () {
        return null;
      });
  }

  function mergeChainIntoProject(project, bundle) {
    var p = project || {};
    var lines = [];
    var cr = bundle.crossref || [];
    var occ = bundle.pbdb || [];
    var gb = bundle.gbif;

    if (occ.length) {
      var o0 = occ[0];
      lines.push(
        'PBDB occurrence: ' +
          (o0.collection_name || o0.accepted_name || '') +
          ' | interval: ' +
          (o0.early_interval || '') +
          (o0.max_ma != null ? ' | Ma ' + o0.max_ma + '–' + o0.min_ma : '') +
          ' | ' +
          (o0.cc || '') +
          ' | paleo lat/lng: ' +
          (o0.paleolat != null ? o0.paleolat + ',' + o0.paleolng : '') +
          ' | env: ' +
          (o0.environment || '') +
          ' | lith: ' +
          (o0.lithology1 || '')
      );
      if (!p.geologicalPeriod && (o0.early_interval || o0.max_ma != null)) {
        p.geologicalPeriod = [o0.early_interval, o0.late_interval].filter(Boolean).join(' – ');
        if (o0.max_ma != null) p.geologicalPeriod += ' (PBDB Ma ' + o0.max_ma + '–' + o0.min_ma + ')';
      }
      if (!p.knownFossilMaterial && (o0.pres_mode || o0.lithology1)) {
        p.knownFossilMaterial =
          'PBDB: preservation ' + (o0.pres_mode || '') + '; lithology ' + (o0.lithology1 || '') + '.';
      }
    }

    if (cr.length) {
      var c0 = cr[0];
      lines.push('Crossref: ' + (c0.title || '') + ' — ' + (c0.doi ? 'doi:' + c0.doi : c0.url || ''));
    }

    if (gb && gb.scientificName && gb.matchType === 'EXACT' && gb.status === 'ACCEPTED' && gb.synonym !== true) {
      lines.push(
        'GBIF taxonomy match: ' +
          gb.scientificName +
          ' (' +
          (gb.rank || '') +
          ') — ' +
          [gb.kingdom, gb.phylum, gb.klass, gb.order, gb.family].filter(Boolean).join(' → ')
      );
      if (!p.taxonomicGroup && (gb.order || gb.family)) {
        p.taxonomicGroup = [gb.phylum, gb.klass, gb.order, gb.family].filter(Boolean).join(' → ');
      }
    }

    var block = lines.join('\n');
    if (block) {
      p.evidenceNotes = (p.evidenceNotes ? p.evidenceNotes + '\n\n' : '') + '【API 串聯 · ' + new Date().toISOString().slice(0, 19) + '】\n' + block;
    }

    p.paleoApiReports = {
      at: new Date().toISOString(),
      papers: cr,
      occurrences: occ.map(mapPbdbOccSlim).filter(Boolean),
      gbif: gb
    };
    return p;
  }

  /**
   * @returns {Promise<{ok:boolean,message?:string,bundle?:object}>}
   */
  function chainResearch(project) {
    var p = project || {};
    var name = safeStr(p.scientificName) || safeStr(p.commonName);
    if (!name) {
      return Promise.resolve({ ok: false, message: '請先填寫學名或中文名稱' });
    }
    var q = safeStr(p.scientificName) || name;
    return Promise.all([
      crossrefSearch(q + ' fossil paleontology', 6).catch(function () {
        return [];
      }),
      pbdbOccurrences(q, 6).catch(function () {
        return [];
      }),
      gbifSpeciesMatch(q).catch(function () {
        return null;
      })
    ]).then(function (parts) {
      var occRaw = parts[1] || [];
      var occ = occRaw.map(mapPbdbOccSlim).filter(Boolean);
      var bundle = { crossref: parts[0] || [], pbdb: occ, gbif: parts[2] };
      mergeChainIntoProject(p, { crossref: bundle.crossref, pbdb: occRaw, gbif: bundle.gbif });
      return { ok: true, bundle: bundle };
    });
  }

  global.McPaleoAdvancedApi = {
    chainResearch: chainResearch,
    mergeChainIntoProject: mergeChainIntoProject,
    crossrefSearch: crossrefSearch,
    pbdbOccurrences: pbdbOccurrences,
    gbifSpeciesMatch: gbifSpeciesMatch
  };
})(typeof window !== 'undefined' ? window : this);
