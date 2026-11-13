/**
 * MCurator Passport Studio — 物種查證服務層
 * 與 UI 解耦；失敗時回傳安全結構，不拋出至呼叫端。
 * TODO: 可改接後端代理以統一 rate limit、快取與金鑰管理。
 */
(function (global) {
  'use strict';

  function fetchJson(url) {
    if (typeof fetch !== 'function') return Promise.resolve({ __error: true, reason: 'no_fetch' });
    return fetch(url)
      .then(function (r) {
        return r.ok ? r.json() : Promise.reject(new Error('http_' + r.status));
      })
      .catch(function () {
        return { __error: true };
      });
  }

  /** 常見採集地／國家中文或英文 → ISO 3166-1 alpha-2（GBIF occurrence 用） */
  var COUNTRY_ISO_HINTS = [
    ['台灣', 'TW'],
    ['臺灣', 'TW'],
    ['Taiwan', 'TW'],
    ['日本', 'JP'],
    ['Japan', 'JP'],
    ['韓國', 'KR'],
    ['South Korea', 'KR'],
    ['中國', 'CN'],
    ['China', 'CN'],
    ['香港', 'HK'],
    ['Hong Kong', 'HK'],
    ['美國', 'US'],
    ['United States', 'US'],
    ['英國', 'GB'],
    ['United Kingdom', 'GB'],
    ['澳洲', 'AU'],
    ['Australia', 'AU'],
    ['紐西蘭', 'NZ'],
    ['New Zealand', 'NZ'],
    ['新加坡', 'SG'],
    ['Singapore', 'SG'],
    ['馬來西亞', 'MY'],
    ['Malaysia', 'MY'],
    ['泰國', 'TH'],
    ['Thailand', 'TH'],
    ['越南', 'VN'],
    ['Vietnam', 'VN'],
    ['印尼', 'ID'],
    ['Indonesia', 'ID'],
    ['菲律賓', 'PH'],
    ['Philippines', 'PH'],
    ['印度', 'IN'],
    ['India', 'IN']
  ];

  function countryToIso2(country) {
    var c = String(country || '').trim();
    if (!c) return '';
    if (/^[A-Za-z]{2}$/.test(c)) return c.toUpperCase();
    var i, row;
    for (i = 0; i < COUNTRY_ISO_HINTS.length; i++) {
      row = COUNTRY_ISO_HINTS[i];
      if (c.indexOf(row[0]) === 0 || c.toLowerCase() === row[1].toLowerCase()) return row[1];
    }
    return '';
  }

  function taxonomyFromDetail(d) {
    d = d || {};
    return {
      kingdom: d.kingdom || '',
      phylum: d.phylum || '',
      className: d.class || d.className || '',
      order: d.order || '',
      family: d.family || '',
      genus: d.genus || d.genericName || '',
      species: d.species || d.scientificName || ''
    };
  }

  function taxonomyChainFromDetail(d) {
    var t = taxonomyFromDetail(d);
    var parts = [t.kingdom, t.phylum, t.className, t.order, t.family, t.genus, t.species].filter(Boolean);
    return parts;
  }

  function getOccurrenceSummary(taxonKey, opts) {
    opts = opts || {};
    var key = String(taxonKey || '').trim();
    if (!key) return Promise.resolve({ total: 0, inCountry: 0, countryIso: '', ok: false });
    var iso = countryToIso2(opts.country || '');
    var base = 'https://api.gbif.org/v1/occurrence/search?taxonKey=' + encodeURIComponent(key) + '&limit=0';
    var totalP = fetchJson(base).then(function (j) {
      if (j && j.__error) return 0;
      return typeof j.count === 'number' ? j.count : 0;
    });
    if (!iso) {
      return totalP.then(function (total) {
        return { total: total, inCountry: 0, countryIso: '', ok: true, countrySkipped: true };
      });
    }
    var countryUrl = base + '&country=' + encodeURIComponent(iso);
    return Promise.all([totalP, fetchJson(countryUrl)]).then(function (pair) {
      var total = pair[0];
      var cj = pair[1];
      var inC = cj && !cj.__error && typeof cj.count === 'number' ? cj.count : 0;
      return { total: total, inCountry: inC, countryIso: iso, ok: true };
    });
  }

  function inatObservationTotal(taxonName) {
    var q = String(taxonName || '').trim();
    if (!q) return Promise.resolve(0);
    return fetchJson('https://api.inaturalist.org/v1/taxa/autocomplete?q=' + encodeURIComponent(q) + '&per_page=1')
      .then(function (j) {
        if (!j || j.__error) return { id: null, name: '' };
        var r = (j.results || [])[0];
        return { id: r && r.id, name: (r && r.name) || '' };
      })
      .then(function (hit) {
        if (!hit.id) return 0;
        return fetchJson('https://api.inaturalist.org/v1/observations?taxon_id=' + encodeURIComponent(hit.id) + '&per_page=0&verifiable=any').then(function (o) {
          if (!o || o.__error) return 0;
          return typeof o.total_results === 'number' ? o.total_results : 0;
        });
      });
  }

  function getCandidateNames(query, taxonHint) {
    var q = String(query || '').trim();
    if (q.length < 2) return Promise.resolve([]);
    var gbifP = fetchJson('https://api.gbif.org/v1/species/suggest?q=' + encodeURIComponent(q) + '&limit=12').then(function (j) {
      if (!j || j.__error || !Array.isArray(j)) return [];
      return j.map(function (x) {
        return {
          scientificName: x.scientificName || x.canonicalName || '',
          commonName: x.vernacularName || '',
          rank: x.rank || '',
          source: 'GBIF',
          reasonZh: '依名稱字串與 GBIF 建議清單；為可能候選，需要人工比對。'
        };
      }).filter(function (x) {
        return x.scientificName;
      });
    });
    var inatP = fetchJson('https://api.inaturalist.org/v1/taxa/autocomplete?q=' + encodeURIComponent(q) + '&per_page=8').then(function (j) {
      if (!j || j.__error) return [];
      return (j.results || []).map(function (x) {
        return {
          scientificName: x.name || x.matched_term || '',
          commonName: x.preferred_common_name || '',
          rank: x.rank || '',
          source: 'iNaturalist',
          reasonZh: '依 iNaturalist 分類建議；為可能候選，需要人工比對。'
        };
      }).filter(function (x) {
        return x.scientificName;
      });
    });
    return Promise.all([gbifP, inatP]).then(function (parts) {
      var seen = {};
      var out = [];
      (parts[0] || []).concat(parts[1] || []).forEach(function (r) {
        var k = String(r.scientificName || '')
          .toLowerCase()
          .trim();
        if (!k || seen[k]) return;
        seen[k] = 1;
        out.push(r);
      });
      if (taxonHint === 'species') out = out.filter(function (x) {
        return String(x.rank || '').toLowerCase() === 'species';
      });
      return out.slice(0, 16);
    });
  }

  function buildDistributionMessageZh(occ, inatTotal, countryLabel) {
    if (!occ || occ.__error) return '資料不足，無法判斷分布合理性。';
    var total = occ.total || 0;
    if (!total) return '公開資料庫中此名稱相關紀錄很少或尚無法對應；建議再次確認學名或改用上層分類群查證。';
    if (occ.countrySkipped || !occ.countryIso) return '此物種在 GBIF 有公開紀錄（筆數：約 ' + total + '）。未比對國家（採集地未填或無法對應 ISO）。';
    if (occ.inCountry > 0) return '此物種在目前國家（' + (countryLabel || occ.countryIso) + '）有公開紀錄（約 ' + occ.inCountry + ' 筆；GBIF 全庫約 ' + total + ' 筆）。';
    return '目前採集地對應之國家區域內，公開紀錄較少或缺少（全庫約 ' + total + ' 筆）。建議再次確認學名或地點；仍可能為資料缺口。';
  }

  function buildVerificationSummary(payload) {
    payload = payload || {};
    var match = payload.match || {};
    var detail = payload.detail || {};
    var photoConf = payload.photoConfidencePct;
    var idStatus = payload.identificationStatus || 'unknown';
    var chain = payload.taxonomyChain || [];
    var occ = payload.occurrence || {};
    var inat = payload.inatTotal || 0;
    var synonyms = payload.synonyms || [];
    var similar = payload.similarNames || [];

    var matchType = String(match.matchType || '');
    var rawConf = match.confidence;
    var conf = null;
    if (typeof rawConf === 'number') {
      conf = rawConf <= 1 ? Math.round(rawConf * 100) : Math.round(rawConf);
    }
    var canon = String(match.canonicalName || match.scientificName || '');
    var nameToken = (canon.split(/\s+/)[0] || '').replace(/^[†?]+\s*/, '');
    var genusConflict = !!(match.genus && nameToken && String(match.genus).toLowerCase() !== nameToken.toLowerCase());
    var hasKey = !!(match.usageKey || match.acceptedUsageKey || detail.key || detail.nubKey);
    var acceptedName = detail.scientificName || match.scientificName || '';
    var statusZh = '資料不足';
    var suggestZh = '建議補充學名或上層分類群後再查證。';
    var tone = 'gray';
    var confOut = conf != null ? conf : 50;
    var canImport = false;
    var suggestTentative = true;

    if (match.__none || !hasKey) {
      statusZh = '資料不足';
      suggestZh = '找不到符合的學名，請嘗試輸入更完整的學名或上層分類群。';
      tone = 'gray';
      confOut = 20;
    } else if (matchType === 'HIGHERRANK' || matchType === 'FUZZY' || String(match.status || '') === 'DOUBTFUL' || match.synonym === true || genusConflict) {
      statusZh = '需要人工確認';
      suggestZh = '名稱可能對應到較上層分類或近似拼字；建議比對更多特徵並保留待確認。';
      tone = 'yellow';
      confOut = Math.min(confOut, 55);
      suggestTentative = true;
    } else if (photoConf != null && photoConf < 70) {
      statusZh = '需要人工確認';
      suggestZh = '目前查到的學名與分類資料可作參考，但照片辨識信心不足，建議保留「待確認」並補充形態照片。';
      tone = 'yellow';
      canImport = true;
    } else if (occ.inCountry === 0 && occ.countryIso && (occ.total || 0) > 100) {
      statusZh = '分布與採集地可能不一致';
      suggestZh = '全庫紀錄不少，但您所填國家區域內公開紀錄較少；請比對採集地、學名與文獻。';
      tone = 'yellow';
      canImport = true;
    } else if (idStatus === 'tentative') {
      statusZh = '需要人工確認';
      suggestZh = '鑑定狀態為待確認；以下資料僅供輔助，需要人工比對。';
      tone = 'yellow';
      canImport = true;
    } else {
      statusZh = '可用';
      suggestZh = '目前查得之名稱與階層可作為參考；仍建議依標本形態與文獻複核。';
      tone = 'green';
      canImport = true;
      suggestTentative = false;
    }

    if (match.__none && similar.length) {
      statusZh = '需要人工確認';
      suggestZh = '直接比對無結果，但下列為可能拼字或相近名稱，請人工比對。';
      tone = 'yellow';
    }

    return {
      overview: {
        statusZh: statusZh,
        suggestZh: suggestZh,
        confidence0to100: clamp100(confOut),
        canImportPassport: canImport,
        suggestTentativeFlag: suggestTentative,
        tone: tone
      },
      taxonomyChain: chain,
      acceptedScientificName: acceptedName,
      matchedScientificName: match.scientificName || payload.query || '',
      gbifTaxonKey: String(match.acceptedUsageKey || match.usageKey || detail.key || ''),
      rank: detail.rank || match.rank || '',
      nameStatus: matchType || (hasKey ? 'MATCH' : 'NONE'),
      synonyms: synonyms,
      similarNames: similar,
      distribution: {
        occurrenceCount: occ.total || 0,
        countryOccurrenceCount: occ.inCountry || 0,
        inatObservationTotal: typeof inat === 'number' ? inat : 0,
        countryMatch: !!(occ.countryIso && occ.inCountry > 0),
        nearbyRecordFound: !!(occ.inCountry > 0 || (occ.total > 0 && !occ.countryIso)),
        warningMessageZh: buildDistributionMessageZh(occ, inat, payload.countryLabel || '')
      },
      sources: payload.sources || ['GBIF Species API', 'GBIF Occurrence API', 'iNaturalist API']
    };
  }

  function clamp100(n) {
    return Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
  }

  function verifyName(query, opts) {
    opts = opts || {};
    var q = String(query || '').trim();
    if (!q) {
      return Promise.resolve({
        ok: false,
        emptyQuery: true,
        summary: buildVerificationSummary({ match: { __none: true }, query: q, photoConfidencePct: opts.photoConfidencePct, identificationStatus: opts.identificationStatus })
      });
    }
    return fetchJson('https://api.gbif.org/v1/species/match?name=' + encodeURIComponent(q) + '&strict=false').then(function (match) {
      if (match && match.__error) {
        return {
          ok: false,
          networkError: true,
          summary: null,
          rawMatch: null
        };
      }
      if (!match || match.matchType === 'NONE' || (!match.usageKey && !match.acceptedUsageKey)) {
        return getCandidateNames(q, opts.taxonHint).then(function (cands) {
          var summary = buildVerificationSummary({
            match: { __none: true, matchType: 'NONE' },
            detail: {},
            synonyms: [],
            similarNames: cands.map(function (c) {
              return c.scientificName;
            }),
            taxonomyChain: [],
            occurrence: {},
            inatTotal: 0,
            query: q,
            photoConfidencePct: opts.photoConfidencePct,
            identificationStatus: opts.identificationStatus,
            countryLabel: opts.country
          });
          return {
            ok: true,
            partial: true,
            noMatch: true,
            candidates: cands,
            summary: summary,
            rawMatch: match || {}
          };
        });
      }
      var usageKey = match.acceptedUsageKey || match.usageKey;
      return Promise.all([
        fetchJson('https://api.gbif.org/v1/species/' + encodeURIComponent(usageKey)),
        fetchJson('https://api.gbif.org/v1/species/' + encodeURIComponent(usageKey) + '/synonyms?limit=40'),
        getOccurrenceSummary(usageKey, { country: opts.country }),
        inatObservationTotal(match.scientificName || q),
        getCandidateNames(q, opts.taxonHint)
      ]).then(function (parts) {
        var detail = parts[0] && !parts[0].__error ? parts[0] : {};
        var synJ = parts[1] || {};
        var occ = parts[2] || {};
        var inatTot = parts[3] || 0;
        var extraCands = parts[4] || [];
        var synList = (synJ.results || []).map(function (s) {
          return s.scientificName || s.canonicalName || '';
        }).filter(Boolean);
        var chain = taxonomyChainFromDetail(detail);
        var similar = synList.slice(0, 8);
        var summary = buildVerificationSummary({
          match: match,
          detail: detail,
          synonyms: synList,
          similarNames: similar,
          taxonomyChain: chain,
          occurrence: occ,
          inatTotal: inatTot,
          query: q,
          photoConfidencePct: opts.photoConfidencePct,
          identificationStatus: opts.identificationStatus,
          countryLabel: opts.country,
          sources: ['GBIF Species API', 'GBIF Occurrence API', 'iNaturalist API']
        });
        var mergedCands = extraCands.filter(function (c) {
          return normName(c.scientificName) !== normName(match.scientificName);
        });
        return {
          ok: true,
          partial: false,
          noMatch: false,
          rawMatch: match,
          detail: detail,
          synonyms: synList,
          candidates: mergedCands,
          summary: summary,
          inatObservationTotal: inatTot,
          occurrence: occ
        };
      });
    });
  }

  function normName(s) {
    return String(s || '')
      .toLowerCase()
      .trim();
  }

  function getTaxonomy(taxonKey) {
    var k = String(taxonKey || '').trim();
    if (!k) return Promise.resolve(null);
    return fetchJson('https://api.gbif.org/v1/species/' + encodeURIComponent(k)).then(function (j) {
      if (!j || j.__error) return null;
      return taxonomyFromDetail(j);
    });
  }

  function getSynonyms(taxonKey) {
    var k = String(taxonKey || '').trim();
    if (!k) return Promise.resolve([]);
    return fetchJson('https://api.gbif.org/v1/species/' + encodeURIComponent(k) + '/synonyms?limit=40').then(function (j) {
      if (!j || j.__error) return [];
      return (j.results || []).map(function (s) {
        return s.scientificName || s.canonicalName || '';
      }).filter(Boolean);
    });
  }

  global.MCSpeciesVerificationService = {
    verifyName: verifyName,
    getTaxonomy: getTaxonomy,
    getSynonyms: getSynonyms,
    getOccurrenceSummary: getOccurrenceSummary,
    getCandidateNames: getCandidateNames,
    buildVerificationSummary: buildVerificationSummary,
    countryToIso2: countryToIso2,
    COUNTRY_ISO_HINTS: COUNTRY_ISO_HINTS
  };
})(typeof window !== 'undefined' ? window : this);
