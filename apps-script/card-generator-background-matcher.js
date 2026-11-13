/**
 * Card generator — taxonomy / filename background matching.
 */
(function (global) {
  'use strict';

  var CATEGORY_ALIASES = {
    insect: ['insect', 'insecta', 'arthropoda'],
    lepidoptera: ['lepidoptera', 'butterfly', 'moth'],
    beetle: ['coleoptera', 'beetle', 'insecta', 'arthropoda'],
    bird: ['bird', 'aves'],
    mammal: ['mammal', 'mammalia'],
    fish: ['fish', 'pisces', 'actinopterygii', 'sarcopterygii'],
    fossil: ['fossil', 'paleontology', 'palaeontology'],
    fungi: ['fungi', 'fungus', 'mycota'],
    bacteria: ['bacteria', 'bacterium', 'prokaryote'],
    virus: ['virus', 'viral'],
    arthropod: ['arthropod', 'arthropoda'],
    plant: ['plant', 'plantae'],
    animalia: ['animalia', 'animal'],
    other: ['specimen', 'natural history'],
  };

  function normalizeTaxonomyString(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[_\-()]+/g, ' ')
      .replace(/[→>]/g, ' ')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize_(s) {
    var n = normalizeTaxonomyString(s);
    return n ? n.split(' ').filter(Boolean) : [];
  }

  function genusFromScientific_(sci) {
    var t = tokenize_(sci);
    return t.length ? t[0] : '';
  }

  function speciesFromScientific_(sci) {
    var t = tokenize_(sci);
    return t.length >= 2 ? t.slice(0, 2).join(' ') : t.join(' ');
  }

  function parseTaxonomyPath_(taxonomy) {
    var out = {
      kingdom: '',
      phylum: '',
      className: '',
      order: '',
      family: '',
      genus: '',
      species: '',
      scientificName: '',
      commonName: '',
    };
    var src = String(taxonomy || '');
    if (!src) return out;
    var parts = src.split(/(?:\s*[→>\/|]\s*)+/).map(function (x) { return normalizeTaxonomyString(x); }).filter(Boolean);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!out.kingdom && /(kingdom|界|animalia|plantae|fungi|bacteria|archaea|virus)/.test(p)) out.kingdom = p;
      else if (!out.phylum && /(phylum|門|门|arthropoda|chordata|mollusca|cnidaria|platyhelminthes|annelida)/.test(p)) out.phylum = p;
      else if (!out.className && /(class|綱|纲|insecta|aves|mammalia|actinopterygii|chondrichthyes)/.test(p)) out.className = p;
      else if (!out.order && /(order|目|lepidoptera|coleoptera|carnivora|primates|cetacea)/.test(p)) out.order = p;
      else if (!out.family && /(family|科|idae\b)/.test(p)) out.family = p;
    }
    return out;
  }

  function expandCategoryAliases_(categoryKey) {
    var k = normalizeTaxonomyString(categoryKey).replace(/\s+/g, '');
    var out = [];
    if (k && CATEGORY_ALIASES[k]) {
      out = out.concat(CATEGORY_ALIASES[k]);
    }
    if (categoryKey) out.push(normalizeTaxonomyString(categoryKey));
    return out.filter(Boolean);
  }

  /**
   * @typedef {{ scientificName?: string, genus?: string, taxonomy?: string, category?: string, latinCategory?: string }} BackgroundMatchInput
   * @typedef {{ id: string, src: string, filename: string, normalizedName: string, tokens: string[], tags?: string[] }} BackgroundAsset
   * @typedef {{ asset: BackgroundAsset, reason: string, score: number, isFallback: boolean }} BackgroundMatchResult
   */

  function resolveCardBackBackground(input, assets, defaultAsset) {
    var list = assets && assets.length ? assets : [];
    var taxPath = Object.assign(
      parseTaxonomyPath_(input && (input.taxonomyPath || input.taxonomy || input.taxonomyHierarchy)),
      input && input.taxonomyPath ? input.taxonomyPath : {}
    );
    var scientificName = normalizeTaxonomyString((input && input.scientificName) || taxPath.scientificName || '');
    var species = normalizeTaxonomyString((input && input.species) || taxPath.species || speciesFromScientific_(scientificName));
    var genus = normalizeTaxonomyString((input && input.genus) || taxPath.genus || genusFromScientific_(scientificName));
    var family = normalizeTaxonomyString((input && input.family) || taxPath.family || '');
    var order = normalizeTaxonomyString((input && input.order) || taxPath.order || '');
    var className = normalizeTaxonomyString((input && (input.className || input.class)) || taxPath.className || '');
    var phylum = normalizeTaxonomyString((input && input.phylum) || taxPath.phylum || '');
    var kingdom = normalizeTaxonomyString((input && input.kingdom) || taxPath.kingdom || '');
    var category = normalizeTaxonomyString((input && input.category) || '');
    var aliases = expandCategoryAliases_(category || (input && input.latinCategory) || '');

    var candidates = [
      { level: 'scientificName', reason: 'exact-scientific-name', term: scientificName, score: 1000 },
      { level: 'scientificName', reason: 'scientific-name', term: species, score: 950 },
      { level: 'genus', reason: 'genus', term: genus, score: 800 },
      { level: 'family', reason: 'family', term: family, score: 700 },
      { level: 'order', reason: 'order', term: order, score: 600 },
      { level: 'class', reason: 'class', term: className, score: 500 },
      { level: 'phylum', reason: 'phylum', term: phylum, score: 400 },
      { level: 'kingdom', reason: 'kingdom', term: kingdom, score: 300 },
    ];
    for (var ai = 0; ai < aliases.length; ai++) {
      candidates.push({ level: 'category', reason: 'category-fallback', term: aliases[ai], score: 200 });
    }
    candidates = candidates.filter(function (c) { return c.term && c.term.length > 1; });

    var matches = [];
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var hay = String(a.normalizedName || '');
      var tok = new Set(a.tokens || []);
      for (var ci = 0; ci < candidates.length; ci++) {
        var c = candidates[ci];
        var cTokens = tokenize_(c.term);
        if (!cTokens.length) continue;
        var phraseHit = hay === c.term || hay.indexOf(c.term) >= 0;
        var tokenHit = cTokens.every(function (t) { return tok.has(t); });
        if (phraseHit || tokenHit) {
          matches.push({
            asset: a,
            reason: c.reason,
            matchedTerm: c.term,
            level: c.level,
            score: c.score + (phraseHit ? 12 : 0) + Math.min(10, c.term.length),
            filenameLen: String(a.filename || '').length,
            exactTag: a.tags && a.tags.indexOf(c.term) >= 0 ? 1 : 0,
          });
          break;
        }
      }
    }

    if (!matches.length) {
      var def = defaultAsset || (list.length ? list[list.length - 1] : null);
      return def
        ? { asset: def, reason: 'default', matchedTerm: 'default', level: 'default', score: 0, isFallback: true }
        : null;
    }

    matches.sort(function (x, y) {
      if (y.score !== x.score) return y.score - x.score;
      if (y.exactTag !== x.exactTag) return y.exactTag - x.exactTag;
      if (x.filenameLen !== y.filenameLen) return x.filenameLen - y.filenameLen;
      return String(x.asset.id || '').localeCompare(String(y.asset.id || ''));
    });
    var best = matches[0];
    return {
      asset: best.asset,
      reason: best.reason,
      matchedTerm: best.matchedTerm,
      level: best.level,
      score: best.score,
      isFallback: false,
    };
  }

  function scoreAsset_(input, asset) {
    var one = resolveCardBackBackground(input, [asset], null);
    return one
      ? {
          score: one.score || 0,
          reason: one.reason || 'default',
        }
      : { score: 0, reason: 'default' };
  }

  function getBestBackgroundMatch(input, assets, defaultAsset) {
    var resolved = resolveCardBackBackground(input, assets, defaultAsset);
    if (!resolved) {
      return null;
    }
    return {
      asset: resolved.asset,
      reason: resolved.reason,
      matchedTerm: resolved.matchedTerm,
      level: resolved.level,
      score: resolved.score,
      isFallback: !!resolved.isFallback,
    };
  }

  global.MCCG_MATCHER = {
    CATEGORY_ALIASES: CATEGORY_ALIASES,
    normalizeTaxonomyString: normalizeTaxonomyString,
    parseTaxonomyPath: parseTaxonomyPath_,
    resolveCardBackBackground: resolveCardBackBackground,
    getBestBackgroundMatch: getBestBackgroundMatch,
    scoreAsset: scoreAsset_,
    genusFromScientific: genusFromScientific_,
  };
})(typeof window !== 'undefined' ? window : this);
