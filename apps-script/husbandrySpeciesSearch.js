/**
 * Husbandry Log — Passport-style species search (local catalog + GBIF vernacular).
 */
(function (global) {
  'use strict';

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function profilesApi() {
    return global.MCSpeciesCareProfiles || null;
  }

  function taxonomyApi() {
    return global.McTaxonomy || null;
  }

  function parseLabel(label) {
    var raw = String(label || '').trim();
    if (!raw) return { common: '', sci: '' };
    var parts = raw.split(' — ');
    if (parts.length >= 2) {
      return { common: parts[0].trim(), sci: parts.slice(1).join(' — ').trim() };
    }
    return { common: '', sci: raw };
  }

  function slugId(name) {
    return (
      'tax-' +
      String(name || '')
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 72)
    );
  }

  function categoryFromCareType(careTypeKey) {
    var map = {
      'arboreal-gecko': 'gecko',
      'general-reptile': 'gecko',
      snake: 'snake',
      turtle: 'turtle',
      tortoise: 'turtle',
      tarantula: 'arachnid',
      mantis: 'mantis',
      'beetle-larva': 'beetle-larva',
      'beetle-adult': 'beetle-larva',
      'general-insect': 'insect',
      'aquatic-amphibian': 'amphibian',
      aquarium: 'aquarium',
      'small-mammal': 'mammal',
    };
    return map[careTypeKey] || 'insect';
  }

  function inferCareTypeKey(hit) {
    var blob = norm(
      [
        hit.klass,
        hit.class,
        hit.className,
        hit.order,
        hit.family,
        hit.genus,
        hit.scientificName,
        hit.label,
        hit.commonName,
      ].join(' '),
    );
    var name = norm((hit.scientificName || '') + ' ' + (hit.label || '') + ' ' + (hit.commonName || ''));

    if (/larva|幼蟲|幼虫|caterpillar|grub/.test(name)) {
      if (/lepidoptera|蝶|蛾|butterfly|moth/.test(blob + name)) return 'beetle-larva';
      if (/coleoptera|beetle|兜|鍬|锹/.test(blob + name)) return 'beetle-larva';
    }

    if (/reptilia|squamata|lacertilia|serpentes|testudines|gekkonidae|pythonidae|boidae|colubridae|chamaeleonidae|varanidae|teiidae|iguanidae/.test(blob)) {
      if (/gekkonidae|gecko|守宮|守宫|睫角|豹紋|豹纹/.test(blob + name)) return 'arboreal-gecko';
      if (/serpentes|pythonidae|boidae|colubridae|lampropeltis|python|boa|蛇|snake/.test(blob + name)) return 'snake';
      if (/testudines|chelidae|emydidae|testudinidae|龜|龟|turtle|tortoise|slider/.test(blob + name)) {
        if (/tortoise|陸龜|陆龟|testudinidae|hermann|geochelone|chelonoidis/.test(blob + name)) return 'tortoise';
        return 'turtle';
      }
      if (/chameleon|變色龍|变色龙/.test(blob + name)) return 'arboreal-gecko';
      return 'general-reptile';
    }

    if (/amphibia|anura|caudata|frog|toad|newt|salamander|螈|蛙|蟾/.test(blob + name)) {
      return 'aquatic-amphibian';
    }

    if (/arachnida|scorpion|spider|tarantula|蜘蛛|蠍|蝎|蜈蚣|centipede/.test(blob + name)) {
      return 'tarantula';
    }

    if (/insecta|coleoptera|mantodea|lepidoptera|orthoptera|blattodea|phasmida|hymenoptera|diptera|beetle|mantis|cricket|roach|stick insect|竹節|竹节/.test(blob + name)) {
      if (/mantodea|mantis|螳螂/.test(blob + name)) return 'mantis';
      if (/coleoptera|beetle|兜|鍬|锹|rhinoceros/.test(blob + name)) {
        if (/larva|幼/.test(name)) return 'beetle-larva';
        return 'beetle-adult';
      }
      if (/lepidoptera|蝶|蛾|silkworm|蚕|蠶/.test(blob + name)) {
        if (/larva|幼|caterpillar/.test(name)) return 'beetle-larva';
        return 'general-insect';
      }
      return 'general-insect';
    }

    if (/actinopterygii|chondrichthyes|cyprinidae|cichlidae|poeciliidae|decapoda|shrimp|fish|coral|魚|鱼|蝦|虾|珊瑚/.test(blob + name)) {
      return 'aquarium';
    }

    if (/isopoda|millipede|馬陸|马陆|鼠婦|鼠妇/.test(blob + name)) {
      return 'general-insect';
    }

    if (/mammalia|marsupial|diprotodontia|petaurus|glider|蜜袋|袋鼯|sugar glider|small mammal/.test(blob + name)) {
      return 'small-mammal';
    }

    return 'general-insect';
  }

  function searchLocal(query, categoryFilter) {
    var api = profilesApi();
    if (!api || typeof api.searchSpecies !== 'function') return [];
    return api.searchSpecies(query, categoryFilter);
  }

  function normSci(name) {
    return norm(String(name || '').replace(/\s*\([^)]*\)\s*/g, ' '));
  }

  function enrichRemoteHits(local, remote) {
    var api = profilesApi();
    return (remote || []).map(function (r) {
      if (!api) return r;
      var hit = null;
      if (typeof api.findByScientificName === 'function') {
        hit = api.findByScientificName(r.scientificName);
      }
      if (!hit && typeof api.findByVernacular === 'function') {
        var parsed = parseLabel(r.label);
        hit = api.findByVernacular(parsed.common || r.commonName || r.label || '');
      }
      if (!hit) return r;
      return Object.assign({}, r, {
        commonName: hit.commonName || r.commonName,
        chineseName: hit.chineseName || r.chineseName,
        localSpeciesId: hit.id,
        category: hit.category || r.category,
        careTypeKey: hit.careTypeKey || r.careTypeKey,
      });
    });
  }

  function dedupeRemote(local, remote) {
    remote = enrichRemoteHits(local, remote);
    var seen = {};
    (local || []).forEach(function (s) {
      seen[normSci(s.scientificName)] = true;
    });
    return (remote || []).filter(function (r) {
      var key = normSci(r.scientificName);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function searchRemote(query) {
    var q = String(query || '').trim();
    if (q.length < 2) return Promise.resolve([]);
    var tax = taxonomyApi();
    if (!tax || typeof tax.searchTaxonSuggestions !== 'function') return Promise.resolve([]);
    return tax.searchTaxonSuggestions(q).then(function (rows) {
      return (rows || []).map(function (r) {
        var parsed = parseLabel(r.label);
        var sci = r.scientificName || parsed.sci || '';
        var common = parsed.common || '';
        if (common && norm(common) === norm(sci)) common = '';
        return {
          source: r.source || 'GBIF',
          rank: r.rank || '',
          label: r.label || sci,
          scientificName: sci,
          commonName: common,
          kingdom: r.kingdom || '',
          klass: r.klass || '',
          order: r.order || '',
          family: r.family || '',
          genus: r.genus || '',
          taxonKey: r.taxonKey != null ? r.taxonKey : null,
          matchType: r.matchType || '',
        };
      });
    });
  }

  function getProfileFromTaxonomyHit(hit) {
    var api = profilesApi();
    if (!api || !hit) return null;
    if (hit.localSpeciesId && typeof api.getProfile === 'function') {
      var localProfile = api.getProfile(hit.localSpeciesId);
      if (localProfile) return localProfile;
    }
    if (typeof api.findByScientificName === 'function') {
      var localEntry = api.findByScientificName(hit.scientificName);
      if (localEntry && typeof api.getProfile === 'function') {
        var fromSci = api.getProfile(localEntry.id);
        if (fromSci) return fromSci;
      }
    }
    var careTypeKey = hit.careTypeKey || inferCareTypeKey(hit);
    var base = api.getCareTypeProfile ? api.getCareTypeProfile(careTypeKey) : null;
    if (!base) return null;
    var parsed = parseLabel(hit.label);
    var sci = hit.scientificName || parsed.sci || '';
    if (!sci) return null;
    var common = hit.commonName || (parsed.common && norm(parsed.common) !== norm(sci) ? parsed.common : '') || sci;
    var chinese = hit.chineseName || common;
    var out = Object.assign({}, base, {
      id: slugId(sci),
      scientificName: sci,
      commonName: common,
      chineseName: chinese,
      careTypeKey: careTypeKey,
      category: hit.category || categoryFromCareType(careTypeKey),
      confidence: 'Needs review',
      taxonomySource: hit.source || 'GBIF',
      taxonKey: hit.taxonKey || null,
    });
    return out;
  }

  function searchCombined(query, categoryFilter) {
    var local = searchLocal(query, categoryFilter);
    return searchRemote(query).then(function (remote) {
      return {
        local: local,
        remote: dedupeRemote(local, remote),
        query: String(query || '').trim(),
      };
    });
  }

  global.MCHusbandrySpeciesSearch = {
    searchLocal: searchLocal,
    searchRemote: searchRemote,
    searchCombined: searchCombined,
    inferCareTypeKey: inferCareTypeKey,
    getProfileFromTaxonomyHit: getProfileFromTaxonomyHit,
    dedupeRemote: dedupeRemote,
  };
})(typeof window !== 'undefined' ? window : this);
