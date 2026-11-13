/**
 * Client-side GBIF taxon search for local preview (browser fetch + localStorage cache).
 * Client-side GBIF helpers. Uses SAT-oriented specimen naming.
 * Cache keys are scoped to the default GBIF Backbone. Older unscoped keys are left unread.
 */
(function (global) {
  'use strict';
  var CACHE_KEY = 'mc_gbf_taxon_cache_v1';
  var MAX_CACHED = 40;

  function loadCache() {
    try {
      return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }
  function saveCache(obj) {
    try {
      var keys = Object.keys(obj);
      if (keys.length > MAX_CACHED) {
        keys.slice(0, keys.length - MAX_CACHED).forEach(function (k) {
          delete obj[k];
        });
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
    } catch (e) {
      void 0;
    }
  }

  function mapGbifToMerged(r) {
    if (!r || !r.scientificName) return null;
    var rank = (r.rank || '') + '';
    var species = rank.toUpperCase() === 'SPECIES' ? (r.species || '') + '' : '';
    return {
      source: 'GBIF',
      rank: rank,
      label: (r.vernacularName ? r.vernacularName + ' — ' : '') + (r.scientificName || r.canonicalName || ''),
      scientificName: r.scientificName || r.canonicalName || '',
      kingdom: (r.kingdom || '') + '',
      phylum: (r.phylum || '') + '',
      klass: (r['class'] || '') + '',
      order: (r.order || '') + '',
      family: (r.family || '') + '',
      genus: (r.genus || '') + '',
      species: species,
      taxonKey: r.key != null ? r.key : null,
      iucnStatus: r.iucnRedListCategory && String(r.iucnRedListCategory) !== 'NOT_EVALUATED' ? String(r.iucnRedListCategory) : '',
      matchType: (r.nameType || r.matchType || '') + '',
      confidence: typeof r.confidence === 'number' ? r.confidence : null
    };
  }

  /**
   * Returns Promise of merged rows in the shape the specimen form expects.
   */
  function searchTaxonSuggestions(q) {
    var query = String(q || '')
      .trim()
      .toLowerCase();
    if (query.length < 2) return Promise.resolve([]);

    var cache = loadCache();
    var cacheId = 'gbif-backbone:' + query;
    if (cache[cacheId] && Array.isArray(cache[cacheId])) {
      return Promise.resolve(cache[cacheId]);
    }

    var url = 'https://api.gbif.org/v1/species/search?q=' + encodeURIComponent(String(q).trim()) + '&limit=8&status=ACCEPTED';
    return fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' })
      .then(function (res) {
        return res.json();
      })
      .then(function (j) {
        var raw = (j && j.results) || [];
        var merged = [];
        for (var i = 0; i < raw.length; i++) {
          var m = mapGbifToMerged(raw[i]);
          if (m && m.scientificName) merged.push(m);
        }
        cache[cacheId] = merged;
        saveCache(cache);
        return merged;
      })
      .catch(function () {
        return [];
      });
  }

  global.McTaxonomy = {
    searchTaxonSuggestions: searchTaxonSuggestions
  };
  if (global.McExternalTaxonHub && typeof global.McExternalTaxonHub.installMcTaxonomyMerge === 'function') {
    global.McExternalTaxonHub.installMcTaxonomyMerge();
  }
})(typeof window !== 'undefined' ? window : this);
