/**
 * MCurator ORIGIN — isolated Apps Script shell.
 * Scoped to #mcOriginRoot / .mc-origin. Session-local ATLAS, PULSE, STUDIO.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'mcurator.origin.v1';
  var PREFIX = '/origin';
  var ALIAS = '/section/origin';
  var EXPECTED_NAV = ['home', 'story', 'workflow', 'online-exhibition', 'origin', 'marketplace', 'start'];

  function t(key, fallback) {
    try {
      var fn = global.MCt || global.mcT;
      if (typeof fn === 'function') {
        var v = fn(key);
        if (
          v &&
          v !== key &&
          String(v).indexOf('待補譯') === -1 &&
          String(v) !== '[' + key + ']' &&
          String(v) !== '—'
        ) {
          return v;
        }
      }
    } catch (eT) {}
    return fallback;
  }

  function currentSearchParams() {
    var hash = String(global.location.hash || '').replace(/^#/, '');
    var qi = hash.indexOf('?');
    if (qi >= 0) {
      try {
        return new URLSearchParams(hash.slice(qi + 1));
      } catch (eQ) {}
    }
    try {
      return new URLSearchParams(String(global.location.search || '').replace(/^\?/, ''));
    } catch (eS) {}
    return new URLSearchParams();
  }

  var ATLAS_PAGE_SIZE = 12;
  var ATLAS_PERIOD_TERMS = [
    'Cambrian',
    'Ordovician',
    'Silurian',
    'Devonian',
    'Carboniferous',
    'Permian',
    'Triassic',
    'Jurassic',
    'Cretaceous',
    'Paleogene',
    'Eocene',
    'Oligocene',
    'Miocene',
    'Pliocene',
    'Pleistocene',
    'Holocene',
    'Mesozoic',
    'Cenozoic',
    'Paleozoic',
  ];
  var ATLAS_DISCOVERY_FIELDS = [
    { id: 'paleontology', aliases: ['fossil', 'paleontology'] },
    { id: 'entomology', aliases: ['insect', 'entomology'] },
    { id: 'botany', aliases: ['plant', 'botany'] },
    { id: 'zoology', aliases: ['wildlife', 'animal', 'zoology', 'marine', 'mammal', 'bird'] },
    { id: 'geology', aliases: ['geology', 'mineral'] },
    { id: 'ecology', aliases: ['ecology'] },
    { id: 'museum_science', aliases: ['museum', 'museum_science', 'museum science'] },
  ];
  var ATLAS_DEFAULT_QUERY = {
    q: '',
    field: '',
    taxon: '',
    type: '',
    period: '',
    media: '',
    collab: '',
    verified: '',
    region: '',
    page: 1,
  };

  function isPublicAtlasSpecimen(asset) {
    if (!asset || !asset.id || !asset.scientificName) return false;
    if (asset.legal && asset.legal.sensitiveSpecies) return false;
    if (asset.legal && asset.legal.tradeLocked) return false;
    return true;
  }

  function normalizeAtlasCatalogRecord(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var id = String(raw.id || '').trim();
    var scientificName = String(raw.scientificName || '').trim();
    if (!id || !scientificName) return null;
    var meta = raw.metadata && typeof raw.metadata === 'object' ? raw.metadata : {};
    var classification =
      String(meta.classification || '').trim() ||
      [meta.family, meta.genus, meta.species || scientificName].filter(Boolean).join(' > ');
    var legal = raw.legal && typeof raw.legal === 'object' ? raw.legal : {};
    return {
      id: id,
      scientificName: scientificName,
      name: String(raw.commonName || raw.name || '').trim(),
      commonNameEn: String(raw.commonNameEn || '').trim(),
      commonNameZh: String(raw.commonNameZh || '').trim(),
      commonNameJa: String(raw.commonNameJa || '').trim(),
      commonNameDe: String(raw.commonNameDe || '').trim(),
      localizedNames: raw.localizedNames && typeof raw.localizedNames === 'object' ? raw.localizedNames : {},
      category: String(raw.category || '').trim(),
      description: String(raw.description || '').trim(),
      imageURL: String(raw.imageURL || raw.imageUrl || raw.thumbnailUrl || raw.coverImage || '').trim(),
      verified: raw.verified === true || String(raw.verificationStatus || '').toLowerCase() === 'verified',
      recordType: String(raw.recordType || raw.basisOfRecord || raw.assetType || raw.category || '').trim(),
      metadata: {
        species: String(meta.species || scientificName).trim(),
        classification: classification,
        country: String(meta.country || '').trim(),
        region: String(meta.region || '').trim(),
        locationCollected: String(meta.locationCollected || raw.origin || '').trim(),
        collection: String(raw.collection || meta.collection || '').trim(),
        family: String(meta.family || '').trim(),
        genus: String(meta.genus || '').trim(),
        dateCollected: String(meta.dateCollected || meta.eventDate || '').trim(),
        collector: String(meta.collector || meta.recordedBy || '').trim(),
        gbifId: String(meta.gbifId || '').trim(),
        colId: String(meta.colId || '').trim(),
        size: String(meta.size || '').trim(),
        measurements: String(meta.measurements || '').trim(),
        habitat: String(meta.habitat || '').trim(),
        ecology: String(meta.ecology || '').trim(),
        license: String(meta.license || raw.licenseType || raw.license || '').trim(),
        mediaCaption: String(meta.mediaCaption || '').trim(),
        elevation: String(meta.elevation || '').trim(),
        researchNote: String(meta.researchNote || meta.significance || '').trim(),
      },
      basisOfRecord: String(raw.basisOfRecord || '').trim(),
      provenance: Array.isArray(raw.provenance)
        ? raw.provenance.slice(0, 24).map(function (row) {
            return {
              event: String((row && row.event) || '').trim(),
              date: String((row && row.date) || '').trim(),
              actor: String((row && row.actor) || '').trim(),
            };
          })
        : [],
      legal: {
        sensitiveSpecies: Boolean(legal.sensitiveSpecies),
        tradeLocked: Boolean(legal.tradeLocked),
      },
    };
  }

  function atlasFieldId(asset) {
    var cat = String((asset && asset.category) || '')
      .trim()
      .toLowerCase();
    var i;
    var row;
    if (!cat) return '';
    for (i = 0; i < ATLAS_DISCOVERY_FIELDS.length; i += 1) {
      row = ATLAS_DISCOVERY_FIELDS[i];
      if (
        row.aliases.some(function (alias) {
          return cat === alias || cat.indexOf(alias) >= 0;
        })
      ) {
        return row.id;
      }
    }
    return '';
  }

  function atlasFieldMatches(asset, field) {
    if (!field) return true;
    var want = String(field).trim().toLowerCase();
    var id = atlasFieldId(asset);
    var cat = String((asset && asset.category) || '')
      .trim()
      .toLowerCase();
    var i;
    var row;
    if (id && id === want) return true;
    if (cat === want) return true;
    for (i = 0; i < ATLAS_DISCOVERY_FIELDS.length; i += 1) {
      row = ATLAS_DISCOVERY_FIELDS[i];
      if (row.id !== want && row.aliases.indexOf(want) < 0) continue;
      if (id === row.id) return true;
      if (
        row.aliases.some(function (alias) {
          return cat === alias || cat.indexOf(alias) >= 0;
        })
      ) {
        return true;
      }
    }
    return false;
  }

  function looksLikeCoordinates(value) {
    return /-?\d{1,3}\.\d+\s*,\s*-?\d{1,3}\.\d+/.test(String(value || ''));
  }

  function publicAtlasText(value) {
    var text = String(value == null ? '' : value).trim();
    var compact = text.replace(/\s/g, '');
    if (!text || looksLikeCoordinates(text) || /0x[a-f0-9]{20,}/i.test(text) || /^(0x)?[a-f0-9]{32,}$/i.test(compact)) {
      return '';
    }
    return text;
  }

  function publicLocality(asset) {
    if (asset && asset.legal && asset.legal.sensitiveSpecies) return '';
    var country = publicAtlasText(asset && asset.metadata && asset.metadata.country);
    var region = publicAtlasText(asset && asset.metadata && asset.metadata.region);
    if (country && region) return region + ', ' + country;
    if (country) return country;
    if (region) return region;
    var collected = publicAtlasText(asset && asset.metadata && asset.metadata.locationCollected);
    if (!collected) return '';
    return collected.split(',')[0].trim() || collected;
  }

  function taxonomicGroup(asset) {
    var parts = String((asset && asset.metadata && asset.metadata.classification) || '')
      .split('>')
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);
    if (parts.length >= 3) return parts[2];
    if (parts.length) return parts[parts.length - 1];
    return String((asset && asset.category) || '').trim();
  }

  function geologicalPeriod(asset) {
    var blob = [
      asset && asset.metadata && asset.metadata.classification,
      asset && asset.metadata && asset.metadata.locationCollected,
      asset && asset.description,
      asset && asset.category,
    ]
      .join(' ')
      .toLowerCase();
    var i;
    for (i = 0; i < ATLAS_PERIOD_TERMS.length; i += 1) {
      if (blob.indexOf(ATLAS_PERIOD_TERMS[i].toLowerCase()) >= 0) return ATLAS_PERIOD_TERMS[i];
    }
    return '';
  }

  function specimenMaterialType(asset) {
    return String((asset && (asset.recordType || asset.basisOfRecord || asset.category)) || '').trim();
  }

  function atlasSearchBlob(asset) {
    var description = String((asset && asset.description) || '').trim();
    if (looksLikeCoordinates(description)) description = '';
    var parts = [
      asset.id,
      asset.scientificName,
      asset.name,
      asset.category,
      atlasFieldId(asset),
      asset.metadata && asset.metadata.species,
      asset.metadata && asset.metadata.classification,
      asset.metadata && asset.metadata.family,
      asset.metadata && asset.metadata.genus,
      publicAtlasText(asset.metadata && asset.metadata.collection),
      taxonomicGroup(asset),
      specimenMaterialType(asset),
      geologicalPeriod(asset),
      publicLocality(asset),
      description,
    ];
    if (String(asset.id || '').toUpperCase().indexOf('SAT-') === 0) parts.push(asset.id, 'SAT');
    return parts.filter(Boolean).join(' ').toLowerCase();
  }

  function atlasMatchesQuery(asset, rawQuery) {
    var q = String(rawQuery || '').trim().toLowerCase();
    if (!q) return true;
    if (looksLikeCoordinates(q) || /0x[a-f0-9]{20,}/i.test(q)) return false;
    var blob = atlasSearchBlob(asset);
    var terms = q.split(/\s+/).filter(Boolean);
    if (String(asset.scientificName || '').toLowerCase() === q) return true;
    if (String(asset.id || '').toLowerCase() === q) return true;
    return terms.every(function (term) {
      return blob.indexOf(term) >= 0;
    });
  }

  function parseAtlasSearchParams(search) {
    var params = search instanceof URLSearchParams ? search : new URLSearchParams(String(search || '').replace(/^\?/, ''));
    var page = parseInt(params.get('page') || '1', 10);
    return {
      q: String(params.get('q') || ''),
      field: String(params.get('field') || ''),
      taxon: String(params.get('taxon') || ''),
      type: String(params.get('type') || ''),
      period: String(params.get('period') || ''),
      media: params.get('media') === '1' ? '1' : '',
      collab: String(params.get('collab') || ''),
      verified: params.get('verified') === '1' ? '1' : '',
      region: String(params.get('region') || ''),
      page: Number.isFinite(page) && page > 0 ? page : 1,
    };
  }

  function serializeAtlasSearchParams(query) {
    var params = new URLSearchParams();
    var q = query || ATLAS_DEFAULT_QUERY;
    if (String(q.q || '').trim()) params.set('q', String(q.q).trim());
    if (q.field) params.set('field', q.field);
    if (q.taxon) params.set('taxon', q.taxon);
    if (q.type) params.set('type', q.type);
    if (q.period) params.set('period', q.period);
    if (q.media === '1') params.set('media', '1');
    if (q.collab) params.set('collab', q.collab);
    if (q.verified === '1') params.set('verified', '1');
    if (q.region) params.set('region', q.region);
    if (Number(q.page) > 1) params.set('page', String(q.page));
    var encoded = params.toString();
    return encoded ? '?' + encoded : '';
  }

  function atlasListHref(query) {
    return PREFIX + '/atlas' + serializeAtlasSearchParams(query || ATLAS_DEFAULT_QUERY);
  }

  function parseAtlasPeek(search) {
    var params = search instanceof URLSearchParams ? search : new URLSearchParams(String(search || '').replace(/^\?/, ''));
    return String(params.get('peek') || '').trim();
  }

  function atlasPeekHref(query, peekId) {
    var encoded = serializeAtlasSearchParams(query || ATLAS_DEFAULT_QUERY).replace(/^\?/, '');
    var params = new URLSearchParams(encoded);
    if (peekId) params.set('peek', String(peekId));
    var next = params.toString();
    return PREFIX + '/atlas' + (next ? '?' + next : '');
  }

  function atlasNeighborIds(ids, currentId) {
    var list = Array.isArray(ids) ? ids : [];
    var index = list.indexOf(String(currentId || ''));
    if (index < 0) return { prevId: '', nextId: '' };
    return { prevId: list[index - 1] || '', nextId: list[index + 1] || '' };
  }

  function applyAtlasSearch(assets, query) {
    var q = query || ATLAS_DEFAULT_QUERY;
    var seen = {};
    var matched = [];
    var i;
    var asset;
    for (i = 0; i < (assets || []).length; i += 1) {
      asset = assets[i];
      if (!asset || seen[asset.id] || !isPublicAtlasSpecimen(asset)) continue;
      if (!atlasMatchesQuery(asset, q.q)) continue;
      if (q.field && !atlasFieldMatches(asset, q.field)) continue;
      if (q.taxon && taxonomicGroup(asset) !== q.taxon) continue;
      if (q.type && specimenMaterialType(asset) !== q.type) continue;
      if (q.period && geologicalPeriod(asset) !== q.period) continue;
      if (q.media === '1' && !asset.imageURL) continue;
      if (q.verified === '1' && asset.verified !== true) continue;
      if (q.region && publicLocality(asset) !== q.region) continue;
      seen[asset.id] = true;
      matched.push(asset);
    }
    matched.sort(function (a, b) {
      var qn = String(q.q || '').trim().toLowerCase();
      function score(row) {
        var sci = String(row.scientificName || '').toLowerCase();
        if (qn && sci === qn) return 0;
        if (qn && sci.indexOf(qn) === 0) return 1;
        if (qn && String(row.id).toLowerCase() === qn) return 2;
        return 3;
      }
      var d = score(a) - score(b);
      if (d) return d;
      return String(a.scientificName).localeCompare(String(b.scientificName));
    });
    return matched;
  }

  function paginateAtlas(rows, page, pageSize) {
    var size = pageSize || ATLAS_PAGE_SIZE;
    var total = rows.length;
    var pageCount = Math.max(1, Math.ceil(total / size) || 1);
    var stale = page > pageCount;
    var safePage = stale ? pageCount : Math.max(1, page);
    var start = (safePage - 1) * size;
    return {
      items: rows.slice(start, start + size),
      total: total,
      page: safePage,
      pageCount: pageCount,
      stale: stale,
      hasPrev: safePage > 1,
      hasNext: safePage < pageCount,
    };
  }

  function findPublicAtlasById(assets, id) {
    var want = String(id || '').trim();
    var lower = want.toLowerCase();
    var i;
    if (!want) return null;
    for (i = 0; i < (assets || []).length; i += 1) {
      if (!isPublicAtlasSpecimen(assets[i])) continue;
      if (String(assets[i].id) === want || String(assets[i].id).toLowerCase() === lower) return assets[i];
    }
    return null;
  }

  function pickFeaturedAtlasSpecimen(assets) {
    var rows = (assets || []).filter(function (asset) {
      return isPublicAtlasSpecimen(asset) && asset.imageURL;
    });
    rows.sort(function (a, b) {
      var verified = Number(b.verified === true) - Number(a.verified === true);
      if (verified) return verified;
      return String(a.id).localeCompare(String(b.id));
    });
    return rows[0] || null;
  }

  var atlasCatalogFailed = false;

  function readAtlasAssets() {
    var raw = [];
    var out = [];
    var seen = {};
    var i;
    var norm;
    atlasCatalogFailed = false;
    try {
      if (typeof global.MCSAT_getAssetCatalog === 'function') raw = global.MCSAT_getAssetCatalog() || [];
      else if (typeof global.MCSAT_getPublishedAssets === 'function') raw = global.MCSAT_getPublishedAssets() || [];
    } catch (eCat) {
      atlasCatalogFailed = true;
      return [];
    }
    if (!Array.isArray(raw)) {
      atlasCatalogFailed = true;
      return [];
    }
    for (i = 0; i < raw.length; i += 1) {
      if (raw[i] && raw[i].isPublished === false) continue;
      norm = normalizeAtlasCatalogRecord(raw[i]);
      if (!norm || seen[norm.id] || !isPublicAtlasSpecimen(norm)) continue;
      seen[norm.id] = true;
      out.push(norm);
    }
    return out;
  }

  function atlasHolder(asset) {
    var collection = publicAtlasText(asset && asset.metadata && asset.metadata.collection);
    return collection || t('origin_atlas_holder', 'Collection holder');
  }

  function atlasFieldLabel(id) {
    if (id === 'paleontology') return t('origin_paleontology_label', 'Paleontology');
    if (id === 'entomology') return t('origin_entomology_label', 'Entomology');
    if (id === 'botany') return t('origin_botany_label', 'Botany');
    if (id === 'zoology') return t('origin_zoology_label', 'Zoology');
    if (id === 'geology') return t('origin_geology_label', 'Geology');
    if (id === 'ecology') return t('origin_ecology_label', 'Ecology');
    if (id === 'museum_science') return t('origin_museum_science_label', 'Museum science');
    var generic = String(id || '').trim().toLowerCase();
    if (generic === 'other' || generic === 'others' || generic === 'misc' || generic === 'miscellaneous') {
      return t('origin_atlas_field_other', 'Other');
    }
    return id;
  }

  function atlasMediaHtml(src, alt, loading) {
    if (!src) {
      return (
        '<div class="mc-origin-media mc-origin-media--fallback mc-origin-atlas-media" role="img" aria-label="' +
        escapeHtml(t('origin_atlas_no_image', 'No public image')) +
        '"><span aria-hidden="true">' +
        escapeHtml(t('origin_atlas_no_image', 'No public image')) +
        '</span></div>'
      );
    }
    var altText = alt == null ? t('origin_atlas_no_image', 'No public image') : String(alt);
    return (
      '<img class="mc-origin-atlas-media" src="' +
      escapeHtml(src) +
      '" alt="' +
      escapeHtml(altText) +
      '" width="640" height="480" decoding="async" loading="' +
      (loading === 'eager' ? 'eager' : 'lazy') +
      '" />'
    );
  }

  function originPublicUrl(path) {
    var base = String(global.location.href || '').split('#')[0];
    return base + '#' + path;
  }

  function atlasCardAccessibleName(asset) {
    return [asset.scientificName, asset.name, asset.id].filter(Boolean).join(', ');
  }

  function atlasCardHtml(asset, savedIds) {
    var field = atlasFieldId(asset);
    var fieldText = atlasFieldLabel(field) || asset.category || '';
    var period = geologicalPeriod(asset);
    var taxon = taxonomicGroup(asset);
    var scientificContext = [period, taxon].filter(function (value, index, values) {
      return value && values.indexOf(value) === index;
    }).join(' · ');
    var holder = atlasHolder(asset);
    var json = JSON.stringify({
      id: asset.id,
      scientificName: asset.scientificName,
      name: asset.name,
      field: field,
    });
    var incomplete = !asset.scientificName || !asset.description || !(asset.metadata && asset.metadata.classification);
    var href = PREFIX + '/atlas/' + encodeURIComponent(asset.id);
    var saved = Array.isArray(savedIds) && savedIds.indexOf(asset.id) >= 0;
    if (/"price"\s*:/.test(json) || /wallet/i.test(json)) return '';
    return (
      '<li><article class="mc-origin-specimen mc-origin-atlas-card" data-origin-atlas-card="1">' +
      '<a class="mc-origin-atlas-card__hit" href="' +
      '#' + escapeHtml(href) +
      '" data-origin-route="' +
      escapeHtml(href) +
      '" aria-label="' +
      escapeHtml(atlasCardAccessibleName(asset)) +
      '">' +
      atlasMediaHtml(asset.imageURL, asset.scientificName) +
      '<div class="mc-origin-atlas-card__body"><p class="mc-origin-atlas-card__sci"><i lang="la">' +
      escapeHtml(asset.scientificName) +
      '</i></p>' +
      (asset.name ? '<p class="mc-origin-atlas-card__common">' + escapeHtml(asset.name) + '</p>' : '') +
      '<p class="mc-origin-id">' +
      escapeHtml(asset.id) +
      '</p>' +
      (fieldText ? '<p class="mc-origin-meta mc-origin-atlas-card__field">' + escapeHtml(fieldText) + '</p>' : '') +
      (scientificContext ? '<p class="mc-origin-meta mc-origin-atlas-card__context">' + escapeHtml(scientificContext) + '</p>' : '') +
      (holder ? '<p class="mc-origin-meta mc-origin-atlas-card__collection">' + escapeHtml(holder) + '</p>' : '') +
      '<div class="mc-origin-atlas-card__status">' +
      (asset.verified ? '<p class="mc-origin-atlas-card__badge">' + escapeHtml(t('origin_verified', 'Verified')) + '</p>' : '') +
      (incomplete ? '<p class="mc-origin-atlas-card__badge">' + escapeHtml(t('origin_atlas_incomplete', 'Incomplete record')) + '</p>' : '') +
      '</div></div></a>' +
      '<button type="button" class="mc-origin-atlas-card__more" data-origin-atlas-menu-toggle="' +
      escapeHtml(asset.id) +
      '" aria-haspopup="menu" aria-expanded="false" aria-label="' +
      escapeHtml(t('origin_atlas_card_more', 'More actions')) +
      '">⋯</button>' +
      '<div class="mc-origin-atlas-card__menu" hidden role="menu" data-origin-atlas-menu="' +
      escapeHtml(asset.id) +
      '">' +
      '<button type="button" role="menuitem" class="mc-origin__btn" data-origin-atlas-peek="' +
      escapeHtml(asset.id) +
      '" data-i18n="origin_atlas_quick_view">Quick view</button>' +
      '<button type="button" role="menuitem" class="mc-origin__btn" data-origin-atlas-copy-link="' +
      escapeHtml(href) +
      '" data-i18n="origin_atlas_copy_link">Copy stable link</button>' +
      '<button type="button" role="menuitem" class="mc-origin__btn" data-origin-atlas-copy-cite="' +
      escapeHtml(asset.id) +
      '" data-i18n="origin_article_copy_cite">Copy citation</button>' +
      '<button type="button" role="menuitem" class="mc-origin__btn" data-origin-atlas-save-museum="' +
      escapeHtml(asset.id) +
      '">' +
      escapeHtml(saved ? t('origin_atlas_unsave_museum', 'Remove from My Museum') : t('origin_atlas_save_museum', 'Save to My Museum')) +
      '</button></div></article></li>'
    );
  }

  function atlasFilterSelect(id, label, value, options) {
    var html =
      '<label class="mc-origin__label" for="' +
      escapeHtml(id) +
      '">' +
      escapeHtml(label) +
      '<select id="' +
      escapeHtml(id) +
      '" class="mc-origin__input" name="' +
      escapeHtml(id.replace(/^.*atlas-/, '')) +
      '"><option value="">' +
      escapeHtml(t('origin_atlas_all', 'All')) +
      '</option>';
    var i;
    for (i = 0; i < options.length; i += 1) {
      html +=
        '<option value="' +
        escapeHtml(options[i].id) +
        '"' +
        (options[i].id === value ? ' selected' : '') +
        (options[i].count === 0 && options[i].id !== value ? ' disabled' : '') +
        '>' +
        escapeHtml(options[i].label) +
        ' (' +
        options[i].count +
        ')</option>';
    }
    return html + '</select></label>';
  }

  function omitAtlasFilter(query, key) {
    var next = parseAtlasSearchParams(serializeAtlasSearchParams(query || ATLAS_DEFAULT_QUERY));
    next[key] = '';
    next.page = 1;
    return next;
  }

  function buildAtlasFacets(assets, query) {
    var q = query || ATLAS_DEFAULT_QUERY;
    function bucket(key, getter) {
      var rows = applyAtlasSearch(assets, omitAtlasFilter(q, key));
      var map = {};
      var i;
      var value;
      for (i = 0; i < rows.length; i += 1) {
        value = getter(rows[i]);
        if (!value || value === 'unknown') continue;
        map[value] = (map[value] || 0) + 1;
      }
      return Object.keys(map)
        .map(function (id) {
          return { id: id, label: id, count: map[id] };
        })
        .sort(function (a, b) {
          return b.count - a.count || a.label.localeCompare(b.label);
        });
    }
    var mediaRows = applyAtlasSearch(assets, omitAtlasFilter(q, 'media'));
    var verifiedRows = applyAtlasSearch(assets, omitAtlasFilter(q, 'verified'));
    return {
      field: bucket('field', function (asset) {
        return atlasFieldId(asset) || asset.category;
      }).map(function (row) {
        return { id: row.id, label: atlasFieldLabel(row.id) || row.label, count: row.count };
      }),
      taxon: bucket('taxon', taxonomicGroup),
      type: bucket('type', specimenMaterialType).map(function (row) {
        return { id: row.id, label: atlasFieldLabel(row.id), count: row.count };
      }),
      period: bucket('period', geologicalPeriod),
      region: bucket('region', publicLocality),
      collab: [],
      mediaCount: mediaRows.filter(function (asset) {
        return asset.imageURL;
      }).length,
      verifiedCount: verifiedRows.filter(function (asset) {
        return asset.verified === true;
      }).length,
    };
  }

  function atlasFiltersHtml(idPrefix, query, facets, variant) {
    var isSheet = variant === 'sheet';
    var formAttrs = isSheet
      ? ' class="mc-origin-atlas-filters" id="mc-origin-atlas-sheet-form" data-origin-atlas-filters="1" data-origin-atlas-sheet-form="1"'
      : ' class="mc-origin-atlas-filters" data-origin-atlas-filters="1" data-origin-atlas-rail-form="1"';
    var canReset = countAtlasFilterDraft(query) > 0;
    return (
      '<form' +
      formAttrs +
      '>' +
      '<div class="mc-origin-atlas-filters__common">' +
      atlasFilterSelect(idPrefix + '-field', t('origin_atlas_filter_field', 'Scientific field'), query.field, facets.field) +
      atlasFilterSelect(idPrefix + '-taxon', t('origin_atlas_filter_taxon', 'Taxonomic group'), query.taxon, facets.taxon) +
      atlasFilterSelect(idPrefix + '-type', t('origin_atlas_filter_type', 'Specimen or material type'), query.type, facets.type) +
      '<label class="mc-origin-atlas-check"><input type="checkbox" name="media" value="1"' +
      (query.media === '1' ? ' checked' : '') +
      (facets.mediaCount === 0 && query.media !== '1' ? ' disabled' : '') +
      ' /> ' +
      escapeHtml(t('origin_atlas_filter_media', 'Has media')) +
      ' (' +
      facets.mediaCount +
      ')</label></div>' +
      '<details class="mc-origin-atlas-filters__advanced"><summary data-i18n="origin_atlas_advanced_filters">' +
      escapeHtml(t('origin_atlas_advanced_filters', 'Advanced filters')) +
      '</summary>' +
      atlasFilterSelect(idPrefix + '-period', t('origin_atlas_filter_period', 'Geological period'), query.period, facets.period) +
      atlasFilterSelect(idPrefix + '-region', t('origin_atlas_filter_region', 'Public locality (safe precision)'), query.region, facets.region) +
      '<label class="mc-origin-atlas-check"><input type="checkbox" name="verified" value="1"' +
      (query.verified === '1' ? ' checked' : '') +
      (facets.verifiedCount === 0 && query.verified !== '1' ? ' disabled' : '') +
      ' /> ' +
      escapeHtml(t('origin_atlas_filter_verified', 'Verified records')) +
      ' (' +
      facets.verifiedCount +
      ')</label></details>' +
      '<button type="button" class="mc-origin__btn" data-origin-atlas-sheet-reset="1" data-origin-atlas-clear-all="1"' +
      (canReset ? '' : ' disabled') +
      ' data-i18n="origin_atlas_clear_all">Clear all</button>' +
      (isSheet
        ? ''
        : '<button type="submit" class="mc-origin__btn mc-origin__btn--primary" data-origin-atlas-rail-apply="1">' +
          escapeHtml(t('origin_atlas_apply_results', 'Show {n} results').replace('{n}', String(applyAtlasSearch(readAtlasAssets(), query).length))) +
          '</button>') +
      '</form>'
    );
  }

  function countAtlasFilterDraft(query) {
    var n = 0;
    if (query.field) n += 1;
    if (query.taxon) n += 1;
    if (query.type) n += 1;
    if (query.period) n += 1;
    if (query.media === '1') n += 1;
    if (query.collab) n += 1;
    if (query.verified === '1') n += 1;
    if (query.region) n += 1;
    return n;
  }

  function countActiveAtlasFilters(query) {
    return countAtlasFilterDraft(query) + (String(query.q || '').trim() ? 1 : 0);
  }

  function atlasChipButton(query, key, label) {
    var next = parseAtlasSearchParams(serializeAtlasSearchParams(query));
    next[key] = '';
    next.page = 1;
    return (
      '<li><button type="button" class="mc-origin-atlas-chip" data-origin-route="' +
      escapeHtml(atlasListHref(next)) +
      '" aria-label="' +
      escapeHtml(t('origin_atlas_remove_filter', 'Remove filter') + ': ' + label) +
      '"><span class="mc-origin-atlas-chip__label">' +
      escapeHtml(label) +
      '</span><span class="mc-origin-atlas-chip__x" aria-hidden="true">×</span></button></li>'
    );
  }

  function normalizePath(raw) {
    var path = String(raw || '').split('?')[0].split('#')[0];
    if (!path) return '/';
    if (path.charAt(0) !== '/') path = '/' + path;
    if (path === ALIAS || path.indexOf(ALIAS + '/') === 0) {
      path = PREFIX + path.slice(ALIAS.length);
    }
    if (path.length > 1 && path.charAt(path.length - 1) === '/') path = path.slice(0, -1);
    return path;
  }

  function decodeRoutePart(value) {
    try { return decodeURIComponent(value); } catch (eDecode) { return String(value || ''); }
  }

  function parseOriginPath(raw) {
    var path = normalizePath(raw);
    var empty = { canonical: path, module: 'not-found', specimenId: null, exhibitionSlug: null, proposalId: null, pulsePostId: null, pulseView: null };
    if (path !== PREFIX && path.indexOf(PREFIX + '/') !== 0) return empty;
    var rest = path === PREFIX ? '' : path.slice(PREFIX.length + 1);
    var parts = rest ? rest.split('/').filter(Boolean) : [];
    if (!parts.length) return { canonical: PREFIX, module: 'home', specimenId: null, exhibitionSlug: null, proposalId: null, pulsePostId: null, pulseView: null };
    if (parts[0] === 'atlas' && parts.length === 1) {
      return { canonical: PREFIX + '/atlas', module: 'atlas', specimenId: null, exhibitionSlug: null, proposalId: null };
    }
    if (parts[0] === 'atlas' && parts.length >= 2) {
      var specimenId = decodeRoutePart(parts[1]);
      if (parts[2] === 'suggest') {
        return {
          canonical: PREFIX + '/atlas/' + parts[1] + '/suggest' + (parts[3] ? '/' + parts[3] : ''),
          module: 'suggest',
          specimenId: specimenId,
          exhibitionSlug: null,
          proposalId: parts[3] ? decodeRoutePart(parts[3]) : null,
        };
      }
      if (parts[2] === 'collaborate') {
        return {
          canonical: PREFIX + '/atlas/' + parts[1] + '/collaborate',
          module: 'collaborate',
          specimenId: specimenId,
          exhibitionSlug: null,
          proposalId: null,
        };
      }
      if (parts.length === 2) {
        return {
          canonical: PREFIX + '/atlas/' + parts[1],
          module: 'atlas',
          specimenId: specimenId,
          exhibitionSlug: null,
          proposalId: null,
        };
      }
    }
    if (parts[0] === 'review' && parts.length === 1) {
      return { canonical: PREFIX + '/review', module: 'review', specimenId: null, exhibitionSlug: null, proposalId: null };
    }
    if (parts[0] === 'review' && parts.length === 2) {
      return {
        canonical: PREFIX + '/review/' + parts[1],
        module: 'review',
        specimenId: null,
        exhibitionSlug: null,
        proposalId: decodeRoutePart(parts[1]),
      };
    }
    if (parts[0] === 'pulse' && parts.length === 1) {
      return { canonical: PREFIX + '/pulse', module: 'pulse', specimenId: null, exhibitionSlug: null, proposalId: null, pulsePostId: null, pulseView: null };
    }
    if (parts[0] === 'pulse' && parts.length === 2) {
      var pulseLeaf = decodeRoutePart(parts[1]);
      if (['compose', 'moderation', 'saved', 'mine'].indexOf(pulseLeaf) >= 0) {
        return {
          canonical: PREFIX + '/pulse/' + pulseLeaf,
          module: 'pulse',
          specimenId: null,
          exhibitionSlug: null,
          proposalId: null,
          pulsePostId: null,
          pulseView: pulseLeaf,
        };
      }
      return {
        canonical: PREFIX + '/pulse/' + parts[1],
        module: 'pulse',
        specimenId: null,
        exhibitionSlug: null,
        proposalId: null,
        pulsePostId: pulseLeaf,
        pulseView: null,
      };
    }
    if (parts[0] === 'studio' && parts.length === 1) {
      return { canonical: PREFIX + '/studio', module: 'studio', specimenId: null, exhibitionSlug: null, proposalId: null, studioView: null };
    }
    if (parts[0] === 'studio' && parts.length === 2 && parts[1] === 'new') {
      return { canonical: PREFIX + '/studio/new', module: 'studio', specimenId: null, exhibitionSlug: null, proposalId: null, studioView: 'new' };
    }
    if (parts[0] === 'studio' && parts.length === 3 && (parts[2] === 'edit' || parts[2] === 'preview')) {
      return {
        canonical: PREFIX + '/studio/' + parts[1] + '/' + parts[2],
        module: 'studio',
        specimenId: null,
        exhibitionSlug: decodeRoutePart(parts[1]),
        proposalId: null,
        studioView: parts[2],
      };
    }
    if (parts[0] === 'exhibitions' && parts.length === 2) {
      return {
        canonical: PREFIX + '/exhibitions/' + parts[1],
        module: 'exhibition',
        specimenId: null,
        exhibitionSlug: decodeRoutePart(parts[1]),
        proposalId: null,
      };
    }
    if (parts[0] === 'my' && parts.length === 1) {
      return { canonical: PREFIX + '/my', module: 'my', specimenId: null, exhibitionSlug: null, proposalId: null, myView: null };
    }
    if (parts[0] === 'my' && parts.length === 2) {
      return {
        canonical: PREFIX + '/my/' + parts[1],
        module: 'my',
        specimenId: null,
        exhibitionSlug: null,
        proposalId: null,
        myView: decodeRoutePart(parts[1]),
      };
    }
    return empty;
  }

  function emptyState() {
    return {
      atlasNotes: [],
      pulsePosts: [],
      exhibitions: [],
      pulseFrozen: false,
      lastAtlasListHref: PREFIX + '/atlas',
      lastAtlasResultIds: [],
      lastAtlasListScroll: 0,
      savedAtlasIds: [],
      savedPulseIds: [],
      pulseDraft: {},
      studioEditorDrafts: {},
    };
  }

  function loadState() {
    try {
      var raw = global.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      var parsed = JSON.parse(raw);
      return {
        atlasNotes: Array.isArray(parsed.atlasNotes) ? parsed.atlasNotes : [],
        pulsePosts: Array.isArray(parsed.pulsePosts) ? parsed.pulsePosts : [],
        exhibitions: Array.isArray(parsed.exhibitions) ? parsed.exhibitions : [],
        pulseFrozen: parsed.pulseFrozen === true,
        lastAtlasListHref: typeof parsed.lastAtlasListHref === 'string' && parsed.lastAtlasListHref.indexOf(PREFIX) === 0 ? parsed.lastAtlasListHref : PREFIX + '/atlas',
        lastAtlasResultIds: Array.isArray(parsed.lastAtlasResultIds) ? parsed.lastAtlasResultIds.filter(function (id) { return typeof id === 'string'; }).slice(0, 200) : [],
        lastAtlasListScroll: Number(parsed.lastAtlasListScroll) > 0 ? Number(parsed.lastAtlasListScroll) : 0,
        savedAtlasIds: Array.isArray(parsed.savedAtlasIds) ? parsed.savedAtlasIds.filter(function (id) { return typeof id === 'string'; }).slice(0, 80) : [],
        savedPulseIds: Array.isArray(parsed.savedPulseIds) ? parsed.savedPulseIds.filter(function (id) { return typeof id === 'string'; }).slice(0, 200) : [],
        pulseDraft: parsed.pulseDraft && typeof parsed.pulseDraft === 'object' ? parsed.pulseDraft : {},
        studioEditorDrafts: parsed.studioEditorDrafts && typeof parsed.studioEditorDrafts === 'object' ? parsed.studioEditorDrafts : {},
      };
    } catch (eLoad) {
      return emptyState();
    }
  }

  function saveState(next) {
    try {
      global.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return true;
    } catch (eSave) { return false; }
  }

  function isSignedIn() {
    try {
      if (global.sessionStorage.getItem('MC_APP_ENTERED_V1') === '1') return true;
      if (global.sessionStorage.getItem('mc.demoUser')) return true;
    } catch (eAuth) {}
    return false;
  }

  function pulseExcerpt(body) {
    var text = String(body || '').replace(/\s+/g, ' ').trim();
    if (text.length <= 280) return text;
    return text.slice(0, 280).replace(/\s+\S*$/, '') + '…';
  }

  function pulsePolicyReject(type, field, title, body, sourceUrl) {
    var blob = (title + ' ' + body).toLowerCase();
    if (!PULSE_TYPES.some(function (row) { return row[0] === type; }) || !PULSE_FIELDS.some(function (row) { return row[0] === field; })) return 'need_type_field';
    if ((type === 'museum_update' || type === 'exhibition_announcement' || type === 'paper_discussion') && !sourceUrl) return 'need_source';
    if (sourceUrl) {
      if (!/^https?:\/\/[^\s]+$/i.test(sourceUrl)) return 'unsafe_link';
      try {
        var source = new URL(sourceUrl);
        if (!source.hostname || (source.protocol !== 'https:' && source.protocol !== 'http:')) return 'unsafe_link';
      } catch (eSource) { return 'unsafe_link'; }
    }
    if (/\b(crypto|bitcoin|nft drop|buy now|celebrity gossip|what i ate today|shopping mall|restaurant recommendation|concert tickets)\b/.test(blob)) return 'off_topic';
    return '';
  }

  function userId() {
    try {
      var demo = global.sessionStorage.getItem('mc.demoUser');
      if (demo) {
        var parsed = JSON.parse(demo);
        return String((parsed && parsed.id) || 'demo-user');
      }
    } catch (eId) {}
    return isSignedIn() ? 'session-user' : 'anonymous';
  }

  function currentHashPath() {
    var raw = String(global.location.hash || '').replace(/^#/, '');
    if (!raw || raw === '/') return PREFIX;
    if (raw.charAt(0) !== '/') raw = '/' + raw;
    return normalizePath(raw.split('?')[0]);
  }

  function currentHashKey() {
    var raw = String(global.location.hash || '').replace(/^#/, '');
    if (!raw || raw === '/') return PREFIX;
    if (raw.charAt(0) !== '/') raw = '/' + raw;
    var qi = raw.indexOf('?');
    var path = normalizePath(qi >= 0 ? raw.slice(0, qi) : raw);
    return path + (qi >= 0 ? raw.slice(qi) : '');
  }

  function go(path) {
    rememberScroll();
    ORIGIN_NAV_PUSHES += 1;
    NAV_DIRECTION = 'push';
    global.__mcOriginIgnoreHash = true;
    if (global.MCRouter && typeof global.MCRouter.go === 'function') {
      global.MCRouter.go(path);
      return;
    }
    global.location.hash = '#' + path;
  }

  function goReplace(path) {
    rememberScroll();
    NAV_DIRECTION = 'replace';
    global.__mcOriginIgnoreHash = true;
    if (global.MCRouter && typeof global.MCRouter.replace === 'function') {
      global.MCRouter.replace(path);
      return;
    }
    var next = '#' + path;
    if (global.history.replaceState) {
      global.history.replaceState(null, '', String(global.location.pathname || '') + String(global.location.search || '') + next);
      return;
    }
    global.location.hash = next;
  }

  function closeAtlasPreview() {
    var openerId = atlasPreviewSession.openerId || parseAtlasPeek(currentSearchParams());
    var list = atlasListHref(parseAtlasSearchParams(currentSearchParams()));
    goReplace(list);
    mount();
    var root = global.document.getElementById('mcOriginRoot');
    var toggles = root ? root.querySelectorAll('[data-origin-atlas-menu-toggle]') : [];
    Array.prototype.some.call(toggles, function (button) {
      if (button.getAttribute('data-origin-atlas-menu-toggle') !== openerId) return false;
      button.focus({ preventScroll: true });
      return true;
    });
  }

  function rememberAtlasListScroll() {
    var remembered = loadState();
    var shell = global.document.getElementById('welcomeShell');
    remembered.lastAtlasListScroll = shell ? shell.scrollTop : 0;
    saveState(remembered);
  }

  function closeAtlasCardMenus(root) {
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('[data-origin-atlas-menu]'), function (el) {
      el.hidden = true;
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-origin-atlas-menu-toggle]'), function (el) {
      el.setAttribute('aria-expanded', 'false');
    });
  }

  function copyAtlasText(text) {
    if (!text) return;
    if (global.navigator.clipboard && typeof global.navigator.clipboard.writeText === 'function') {
      global.navigator.clipboard.writeText(text);
    }
  }

  function toggleSavedAtlasId(id) {
    var specimenId = String(id || '');
    if (!specimenId) return;
    var state = loadState();
    var has = state.savedAtlasIds.indexOf(specimenId) >= 0;
    state.savedAtlasIds = has
      ? state.savedAtlasIds.filter(function (row) {
          return row !== specimenId;
        })
      : [specimenId].concat(state.savedAtlasIds).slice(0, 80);
    saveState(state);
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var ORIGIN_MARKETING = {
    hero: { src: '../assets/images/insect/insect-archive-fp-hero.jpg', w: 1536, h: 1024, fx: 72, fy: 42, alt: 'Contemporary insect-cabinet drawers, with fossil preparation and a herbarium sheet beside them.' },
    'fossil-plate': { src: 'origin-marketing/origin-hero-ammonite.jpg?v=sharp2', w: 1280, h: 720, fx: 50, fy: 46, alt: 'A sharp bronze ammonite fossil in dark rock, lit like a museum specimen.' },
    'hero-paleontology': { src: '../assets/images/fossil/fossil-prep-fp-hero.jpg', w: 1536, h: 1024, fx: 62, fy: 48, alt: '' },
    'hero-botany': { src: '../assets/images/herbarium/herbarium-complete-fp-hero-v2.jpg', w: 1536, h: 1024, fx: 58, fy: 52, alt: '' },
    atlas: { src: '../assets/images/fossil/fossil-register-fp-hero.jpg', w: 1536, h: 1024, fx: 48, fy: 46, alt: 'A fossil specimen photographed beside a scale bar and colour target.' },
    pulse: { src: '../assets/images/field/field-observe-fp-hero.jpg', w: 1536, h: 1024, fx: 28, fy: 42, alt: 'A researcher’s hands holding binoculars in a meadow, with a notebook nearby and no identifiable face.' },
    studio: { src: '../assets/images/fossil/fossil-exhibit-fp-hero.jpg', w: 1536, h: 1024, fx: 32, fy: 48, alt: 'A fossil in a museum case with a blank label plate and handwritten notes, without institution branding.' },
    paleontology: { src: '../assets/images/fossil/fossil-prep-fp-hero.jpg', w: 1536, h: 1024, fx: 62, fy: 52, alt: 'Hands preparing a trilobite fossil slab with a pneumatic scribe; a microscope sits behind.' },
    entomology: { src: '../assets/images/insect/hero-passport/athyma-selenophora.png', w: 1024, h: 768, fx: 50, fy: 50, alt: 'Athyma selenophora specimen on a white documentation background, with wing venation and natural proportions.' },
    botany: { src: '../assets/images/herbarium/herbarium-complete-fp-hero-v2.jpg', w: 1536, h: 1024, fx: 55, fy: 48, alt: 'White-gloved hands lifting a herbarium sheet from a wooden cabinet.' },
    zoology: { src: '../assets/images/wildlife/wildlife-observe-fp-hero.jpg', w: 1536, h: 1024, fx: 70, fy: 36, alt: 'A researcher records notes at a window while an animal is observed at a distance on the savanna.' }
  };

  function originPicture(slot, opts) {
    var asset = ORIGIN_MARKETING[slot];
    if (!asset) return '';
    opts = opts || {};
    var altKey = 'origin_marketing_alt_' + String(slot || '').replace(/-/g, '_');
    var alt = opts.decorative ? '' : (opts.alt || t(altKey, asset.alt || ''));
    var priority = opts.priority ? 'eager' : 'lazy';
    var fetchp = opts.priority ? 'high' : 'low';
    return (
      '<div class="mc-origin-picture" data-origin-crop="' +
      escapeHtml(slot) +
      '" style="--origin-focal-x:' +
      asset.fx +
      '%;--origin-focal-y:' +
      asset.fy +
      '%">' +
      '<img src="' +
      escapeHtml(asset.src) +
      '" srcset="' +
      escapeHtml(asset.src) +
      ' ' +
      asset.w +
      'w" sizes="' +
      (opts.priority ? '(max-width: 900px) 100vw, 58vw' : '(max-width: 900px) 100vw, 32vw') +
      '" alt="' +
      escapeHtml(alt) +
      '" width="' +
      asset.w +
      '" height="' +
      asset.h +
      '" loading="' +
      priority +
      '" decoding="async" fetchpriority="' +
      fetchp +
      '" onerror="this.parentNode.classList.add(\'mc-origin-picture--empty\');this.hidden=true">' +
      '<span class="mc-origin-plate__contour" aria-hidden="true"></span>' +
      '<span class="mc-origin-picture__scrim" aria-hidden="true"></span></div>'
    );
  }

  function originFieldCardsHtml(limit) {
    var fields = [
      ['paleontology', '/origin/atlas?field=paleontology', 'paleontology', 'Paleontology'],
      ['entomology', '/origin/atlas?field=entomology', 'entomology', 'Entomology'],
      ['botany', '/origin/atlas?field=botany', 'botany', 'Botany'],
      ['zoology', '/origin/atlas?field=zoology', 'zoology', 'Zoology'],
      ['ecology', '/origin/pulse', 'pulse', 'Ecology'],
      ['geology', '/origin/atlas', 'paleontology', 'Geology'],
      ['mycology', '/origin/atlas', 'botany', 'Mycology'],
      ['evolution', '/origin/atlas', 'zoology', 'Evolution'],
      ['museum_science', '/origin/studio', 'studio', 'Museum science']
    ];
    var rows = fields;
    if (limit === 'rest') rows = fields.slice(3);
    else if (typeof limit === 'number') rows = fields.slice(0, limit);
    return rows
      .map(function (row) {
        var labelKey = 'origin_' + row[0] + '_label';
        var descKey = 'origin_' + row[0] + '_desc';
        return (
          '<li><button type="button" class="mc-origin-field-card" data-origin-route="' +
          row[1] +
          '">' +
          originPicture(row[2]) +
          '<span class="mc-origin-field-card__label" data-i18n="' +
          labelKey +
          '">' +
          escapeHtml(row[3]) +
          '</span><span class="mc-origin-meta" data-i18n="' +
          descKey +
          '"></span></button></li>'
        );
      })
      .join('');
  }

  function originWeekHtml() {
    var days = [
      ['paleontology', 'origin_seven_paleontology_title', 'paleontology', 'How a trilobite slab is prepared'],
      ['entomology', 'origin_seven_entomology_title', 'entomology', 'Reading an insect drawer without moving pins'],
      ['botany', 'origin_seven_botany_title', 'botany', 'Why a herbarium sheet stays in its folder']
    ];
    var lead = days[0];
    return (
      '<section class="mc-origin-section mc-origin-week" aria-labelledby="mc-origin-week" data-origin-layer="primary" data-origin-editorial="seven-days">' +
      '<h2 id="mc-origin-week" class="mc-origin-section__title" data-i18n="origin_week_title">This week</h2>' +
      '<div class="mc-origin-week__layout">' +
      '<article class="mc-origin-pulse-card mc-origin-sevendays__lead" data-origin-seven-day="1">' +
      originPicture(lead[2]) +
      '<div class="mc-origin-sevendays__copy"><p class="mc-origin-pulse-kicker" data-i18n="origin_paleontology_label">Paleontology</p>' +
      '<p class="mc-origin-meta" data-i18n="origin_seven_editorial">ORIGIN editorial sample</p>' +
      '<h3 data-i18n="' +
      lead[1] +
      '">' +
      escapeHtml(lead[3]) +
      '</h3>' +
      '<button type="button" class="mc-origin__text-action" data-origin-route="/origin/pulse" data-i18n="origin_open_pulse">Enter PULSE</button></div></article>' +
      '<ul class="mc-origin-week__support">' +
      days
        .slice(1, 3)
        .map(function (row, index) {
          return (
            '<li class="mc-origin-pulse-card mc-origin-sevendays__item" data-origin-seven-day="' +
            (index + 2) +
            '"><h3 data-i18n="' +
            row[1] +
            '">' +
            escapeHtml(row[3]) +
            '</h3><p class="mc-origin-pulse-kicker" data-i18n="' +
            (row[0] === 'entomology' ? 'origin_entomology_label' : 'origin_botany_label') +
            '"></p></li>'
          );
        })
        .join('') +
      '</ul></div></section>'
    );
  }

  function originSevenDaysHtml() {
    return originWeekHtml();
  }

  function isVisiblePulsePost(post) {
    if (!post || !post.id || !post.topic) return false;
    var status = String(post.status || '').toLowerCase();
    var visibility = String(post.visibility || '').toLowerCase();
    if (post.removed === true || post.private === true) return false;
    if (status !== 'published') return false;
    if (visibility === 'private' || visibility === 'draft' || visibility === 'hidden') return false;
    return true;
  }

  function linkedPulsePosts(posts, specimenId) {
    var id = String(specimenId || '');
    if (!id) return [];
    return (posts || []).filter(function (post) {
      if (!isVisiblePulsePost(post)) return false;
      return String(post.specimenId || '') === id;
    });
  }

  function originFeatureState(id) {
    var features = global.MC_PRODUCT_CONTRACT && global.MC_PRODUCT_CONTRACT.features;
    var i;
    if (!features) return 'unavailable';
    for (i = 0; i < features.length; i += 1) {
      if (features[i] && features[i].id === id) return String(features[i].capability || 'unavailable');
    }
    return 'unavailable';
  }

  function discoverContextLine(asset) {
    var name = String((asset && asset.scientificName) || '').toLowerCase();
    return [geologicalPeriod(asset), taxonomicGroup(asset)]
      .filter(function (value, index, values) {
        var text = String(value || '').trim();
        if (!text || values.indexOf(value) !== index) return false;
        return name.indexOf(text.toLowerCase()) < 0;
      })
      .join(' · ');
  }

  function discoverDocumentaryAsset(assets) {
    var rows = (assets || []).filter(function (asset) {
      return isPublicAtlasSpecimen(asset) && asset.imageURL;
    });
    var documentary = rows.filter(function (asset) {
      var src = String(asset.imageURL || '').toLowerCase();
      return src.indexOf('habitat') < 0 && src.indexOf('reconstruct') < 0;
    });
    var pool = documentary.length ? documentary : rows;
    pool.sort(function (a, b) {
      var verified = Number(b.verified === true) - Number(a.verified === true);
      if (verified) return verified;
      return String(a.id).localeCompare(String(b.id));
    });
    return pool[0] || null;
  }

  function discoverCue(asset) {
    if (!asset) return '';
    var history = (asset.provenance || [])
      .map(function (row) {
        return [row && row.event, row && row.date].filter(Boolean).join(' · ');
      })
      .filter(Boolean);
    var i;
    for (i = 0; i < history.length; i += 1) {
      if (/demo/i.test(history[i])) return history[i];
    }
    return (
      publicAtlasText(asset.metadata && asset.metadata.collection) ||
      publicAtlasText(asset.metadata && asset.metadata.license) ||
      publicLocality(asset) ||
      discoverContextLine(asset) ||
      history[0] ||
      ''
    );
  }

  function discoverScientificHtml(asset) {
    var name = String((asset && asset.scientificName) || '').trim();
    if (!name) return '';
    var family = String((asset.metadata && asset.metadata.family) || '').trim().toLowerCase();
    var genusRaw = String((asset.metadata && asset.metadata.genus) || '').trim();
    var genus = /^[A-Za-z][A-Za-z-]+$/.test(genusRaw) ? genusRaw.toLowerCase() : '';
    function qualifier(token) {
      return /^(sp|spp|cf|aff|subsp|ssp|var|f|x|×)\.?$/i.test(token);
    }
    function higher(token) {
      var lower = token.toLowerCase();
      if (family && lower === family) return true;
      return /(idae|aceae|iformes|ales|oidea|inae|ini|oideae|phyta|mycota|zoa)$/i.test(token);
    }
    var tokens = name.split(/\s+/).filter(Boolean);
    var nameTokens = tokens.filter(function (token) {
      return !qualifier(token);
    });
    var binomial = nameTokens.length >= 2 && /^[A-Z][a-z-]+$/.test(nameTokens[0]) && /^[a-z][a-z-]+$/.test(nameTokens[1]) && !higher(nameTokens[0]);
    return tokens
      .map(function (token, index) {
        var lead = index ? ' ' : '';
        if (qualifier(token) || higher(token)) return lead + escapeHtml(token);
        var lower = token.toLowerCase();
        var epithet = /^[a-z][a-z-]+$/.test(token);
        var italic = false;
        if (genus && lower === genus && !higher(token)) italic = true;
        else if (binomial && (token === nameTokens[0] || token === nameTokens[1])) italic = true;
        else if (epithet && genus) italic = true;
        if (!italic) return lead + escapeHtml(token);
        return lead + '<i lang="la">' + escapeHtml(token) + '</i>';
      })
      .join('');
  }

  function discoverDisplaySrc(asset) {
    var src = String((asset && asset.imageURL) || '').trim();
    if (/\/assets\/images\/specimen\/(?:detail|thumbs)\/[^/?#]+\.svg(?:$|[?#])/i.test(src)) return '';
    return src;
  }

  function discoverMediaKind(asset) {
    var src = discoverDisplaySrc(asset).toLowerCase();
    var caption = String((asset && asset.metadata && asset.metadata.mediaCaption) || '').toLowerCase();
    var blob = src + ' ' + caption;
    if (!src) return 'missing';
    if (blob.indexOf('reconstruct') >= 0 || blob.indexOf('illustration') >= 0 || blob.indexOf('habitat') >= 0) return 'reconstruction';
    return 'specimen';
  }

  function discoverCardContext(asset) {
    var period = geologicalPeriod(asset);
    if (period) return t('origin_era_' + period.toLowerCase(), period);
    return atlasFieldLabel(atlasFieldId(asset)) || publicAtlasText(asset.metadata && asset.metadata.collection) || '';
  }

  function discoverNameRecord(asset) {
    var record = {
      scientificName: String((asset && asset.scientificName) || ''),
      commonNameEn: String((asset && asset.commonNameEn) || ''),
      commonNameZh: String((asset && asset.commonNameZh) || ''),
      commonNameJa: String((asset && asset.commonNameJa) || ''),
      commonNameDe: String((asset && asset.commonNameDe) || ''),
      localizedNames: asset && asset.localizedNames && typeof asset.localizedNames === 'object' ? asset.localizedNames : {},
    };
    var raw = String((asset && asset.name) || '').trim();
    if (!raw || raw === record.scientificName) return record;
    if (/[\u3040-\u30ff]/.test(raw)) {
      if (!record.commonNameJa) record.commonNameJa = raw;
    } else if (/[\u4e00-\u9fff]/.test(raw)) {
      if (!record.commonNameZh) record.commonNameZh = raw;
    } else if (!record.commonNameEn) {
      record.commonNameEn = raw;
    }
    return record;
  }

  function discoverVernacular(asset) {
    var record = discoverNameRecord(asset);
    try {
      if (typeof global.mcLocalizedNameUsedFallback === 'function' && global.mcLocalizedNameUsedFallback(record)) return '';
      if (typeof global.mcLocalizedCommonName === 'function') {
        var picked = String(global.mcLocalizedCommonName(record) || '').trim();
        if (!picked || picked === record.scientificName) return '';
        return picked;
      }
    } catch (eName) {}
    return '';
  }

  function discoverNumber(value) {
    var lang = 'en-001';
    try {
      if (typeof global.mcGetLang === 'function') lang = String(global.mcGetLang() || lang);
    } catch (eLang) {}
    try {
      return new Intl.NumberFormat(lang).format(value);
    } catch (eNum) {
      return String(value);
    }
  }

  function discoverFigure(asset, loading) {
    var kind = discoverMediaKind(asset);
    var src = kind === 'missing' ? '' : discoverDisplaySrc(asset);
    var note = '';
    if (kind === 'reconstruction') {
      note =
        '<p class="mc-origin-discover-card__kind" data-i18n="origin_discover_media_reconstruction">' +
        escapeHtml(t('origin_discover_media_reconstruction', 'Reconstruction or habitat image, not a photograph of the specimen.')) +
        '</p>';
    }
    return atlasMediaHtml(src, '', loading) + note;
  }

  function discoverCardHtml(asset) {
    var href = PREFIX + '/atlas/' + encodeURIComponent(asset.id);
    var context = discoverCardContext(asset);
    var vernacular = discoverVernacular(asset);
    return (
      '<li><article class="mc-origin-specimen mc-origin-atlas-card mc-origin-discover-card" data-origin-atlas-card="1">' +
      '<a class="mc-origin-atlas-card__hit" href="#' +
      escapeHtml(href) +
      '" data-origin-route="' +
      escapeHtml(href) +
      '"><div class="mc-origin-discover-card__stage">' +
      discoverFigure(asset) +
      '</div><div class="mc-origin-atlas-card__body"><p class="mc-origin-atlas-card__sci">' +
      discoverScientificHtml(asset) +
      '</p>' +
      (vernacular ? '<p class="mc-origin-discover__common">' + escapeHtml(vernacular) + '</p>' : '') +
      (context ? '<p class="mc-origin-meta mc-origin-atlas-card__context">' + escapeHtml(context) + '</p>' : '') +
      '<p class="mc-origin-id">' +
      escapeHtml(asset.id) +
      '</p></div></a></article></li>'
    );
  }

  function discoverLinkedPosts(posts, assets) {
    var byId = {};
    (assets || []).forEach(function (asset) {
      if (isPublicAtlasSpecimen(asset)) byId[asset.id] = asset;
    });
    return (posts || [])
      .filter(function (post) {
        var id = String((post && post.specimenId) || '');
        return isVisiblePulsePost(post) && id && byId[id];
      })
      .sort(function (a, b) {
        return String(a.id).localeCompare(String(b.id));
      })
      .slice(0, 3);
  }

  function discoverOwnDraft(exhibitions, signed) {
    if (!signed) return null;
    var me = userId();
    var rows = (exhibitions || []).filter(function (row) {
      if (!row || row.status !== 'draft' || !row.slug || !row.title) return false;
      return String(row.ownerId || '') === me;
    });
    rows.sort(function (a, b) {
      return String(a.slug).localeCompare(String(b.slug));
    });
    return rows[0] || null;
  }

  function discoverHref(path, className, text, i18nKey) {
    var href = String(path || '');
    return (
      '<a class="' +
      className +
      '" href="#' +
      escapeHtml(href) +
      '" data-origin-route="' +
      escapeHtml(href) +
      '"' +
      (i18nKey ? ' data-i18n="' + escapeHtml(i18nKey) + '"' : '') +
      '>' +
      escapeHtml(i18nKey ? t(i18nKey, text) : text) +
      '</a>'
    );
  }

  function discoverMarketingHeroHtml() {
    return (
      '<div class="mc-origin-discover__marketing">' +
      '<figure class="mc-origin-hero-gallery">' +
      '<div class="mc-origin-hero-stage" data-origin-media="hero" data-origin-hero="stage3">' +
      '<div class="mc-origin-hero-stage__mosaic">' +
      originPicture('hero', { priority: true }) +
      '</div>' +
      '<details class="mc-origin-hero__credit"><summary data-i18n="origin_hero_credit_summary">Photo credit</summary><p data-i18n="origin_hero_credit_body">Marketing photography for ORIGIN discovery.</p></details>' +
      '<div class="mc-origin-hero-stage__support">' +
      originPicture('fossil-plate') +
      originPicture('hero-botany', { decorative: true }) +
      '</div></div></figure></div>'
    );
  }

  function discoverClosingHtml() {
    return (
      '<section class="mc-origin-section mc-origin-closing mc-origin-discover__closing" aria-labelledby="mc-origin-discover-closing">' +
      '<h2 id="mc-origin-discover-closing" class="mc-origin-closing__headline" data-i18n="origin_closing_headline">' +
      escapeHtml(t('origin_closing_headline', 'Help build a living record of the natural world.')) +
      '</h2>' +
      '<div class="mc-origin-closing__actions mc-origin-discover__actions mc-origin-discover__actions--closing" data-origin-products="stage4">' +
      '<a class="mc-origin__btn mc-origin__btn--secondary" href="#/origin/atlas" data-origin-route="/origin/atlas" data-i18n="origin_explore_atlas">Explore ATLAS</a>' +
      '<a class="mc-origin__btn mc-origin__btn--secondary" href="#/origin/studio/new" data-origin-route="/origin/studio/new" data-i18n="origin_create_exhibition">Create exhibition</a>' +
      '<a class="mc-origin__btn mc-origin__btn--secondary" href="#/origin/studio" data-origin-route="/origin/studio" data-i18n="origin_enter_studio">Enter STUDIO</a>' +
      '<a class="mc-origin__btn mc-origin__btn--secondary" href="#/origin/pulse" data-origin-route="/origin/pulse" data-i18n="origin_join_pulse">Join PULSE</a>' +
      '</div></section>'
    );
  }

  function discoverPulsePreviewHtml(post, asset) {
    var field = optionLabel(PULSE_FIELDS, post.scientificField);
    var author = String(post.authorName || post.displayName || '').trim();
    var identity = author || t('origin_ux_session_discussion', 'Session discussion');
    var excerpt = pulseExcerpt(post.body);
    if (excerpt.length > 140) excerpt = excerpt.slice(0, 140).replace(/\s+\S*$/, '') + '…';
    var pulseHref = PREFIX + '/pulse/' + encodeURIComponent(post.id);
    var recordHref = PREFIX + '/atlas/' + encodeURIComponent(asset.id);
    return (
      '<li class="mc-origin-discover-link"><p class="mc-origin-meta">' +
      escapeHtml(identity) +
      (field ? ' · ' + escapeHtml(field) : '') +
      '</p><h3>' +
      discoverHref(pulseHref, 'mc-origin__text-action', post.topic) +
      '</h3>' +
      (excerpt ? '<p>' + escapeHtml(excerpt) + '</p>' : '') +
      '<p class="mc-origin-meta"><span data-i18n="origin_discover_related_record">' +
      escapeHtml(t('origin_discover_related_record', 'Related record')) +
      '</span> ' +
      discoverHref(recordHref, 'mc-origin__text-action', (asset.scientificName || asset.id) + ', ' + asset.id) +
      '</p></li>'
    );
  }

  function discoverConnectHtml(signed, state, assets) {
    var posts = discoverLinkedPosts(state && state.pulsePosts, assets);
    var byId = {};
    (assets || []).forEach(function (asset) {
      if (isPublicAtlasSpecimen(asset)) byId[asset.id] = asset;
    });
    var talkHtml = posts
      .map(function (post) {
        return discoverPulsePreviewHtml(post, byId[post.specimenId]);
      })
      .join('');
    var exhibitLive = originFeatureState('origin.exhibit.access') === 'live';
    var draft = discoverOwnDraft(state && state.exhibitions, signed);
    var curation = '';
    if (draft) {
      var count = (draft.specimenIds || []).filter(function (id) {
        return byId[id];
      }).length;
      curation =
        '<article class="mc-origin-discover-link"><p class="mc-origin__kicker" data-i18n="origin_discover_draft_kicker">Your draft</p><h3>' +
        escapeHtml(draft.title) +
        '</h3>' +
        (draft.concept ? '<p>' + escapeHtml(pulseExcerpt(draft.concept).slice(0, 140)) + '</p>' : '') +
        (count
          ? '<p class="mc-origin-meta"><span data-i18n="origin_discover_draft_specimens">' +
            escapeHtml(t('origin_discover_draft_specimens', 'Public specimen records in this draft')) +
            '</span> <span>' +
            escapeHtml(discoverNumber(count)) +
            '</span></p>'
          : '') +
        discoverHref(PREFIX + '/studio/' + encodeURIComponent(draft.slug) + '/edit', 'mc-origin__text-action', 'Continue this draft', 'origin_discover_draft_open') +
        '<p class="mc-origin-discover__note" data-i18n="origin_discover_draft_note">This draft stays in this browser and is not a published exhibition.</p></article>';
    } else if (!exhibitLive) {
      curation =
        '<p>' + discoverHref('/origin/studio/new', 'mc-origin__text-action', 'Start a museum draft', 'origin_discover_draft') + '</p>';
    }
    var talks = talkHtml
      ? '<ul class="mc-origin-discover-links">' + talkHtml + '</ul>'
      : '';
    return (
      '<section class="mc-origin-discover__connect" aria-labelledby="mc-origin-discover-connect">' +
      '<h2 id="mc-origin-discover-connect" class="mc-origin-section__title" data-i18n="origin_discover_connect_title">How a record stays connected</h2>' +
      '<p class="mc-origin-discover__lead" data-i18n="origin_discover_connect_lead">A discussion appears here only when it names a public specimen. A museum draft is not a published exhibition.</p>' +
      talks +
      curation +
      '<ul class="mc-origin-discover__facts">' +
      '<li data-i18n="origin_discover_trust_source">Source information is the collection, licence, or provenance stored on the specimen record.</li>' +
      '<li data-i18n="origin_discover_trust_review">Holder review of suggested revisions is not available on this page. Unreviewed suggestions are not listed.</li>' +
      '<li data-i18n="origin_discover_trust_history">No approved revision history is listed for these records.</li>' +
      '</ul></section>'
    );
  }

  function originDiscoverHtml(signed, state) {
    var assets = readAtlasAssets();
    var catalogFailed = atlasCatalogFailed;
    var featured = catalogFailed ? null : discoverDocumentaryAsset(assets) || pickFeaturedAtlasSpecimen(assets) || assets[0] || null;
    var saved = (state && state.savedAtlasIds) || [];
    var notes = (state && state.atlasNotes) || [];
    var rest = assets
      .filter(function (asset) {
        return isPublicAtlasSpecimen(asset) && (!featured || asset.id !== featured.id);
      })
      .sort(function (a, b) {
        return String(a.id).localeCompare(String(b.id));
      })
      .slice(0, 4);
    var cards = rest
      .map(function (asset) {
        return discoverCardHtml(asset);
      })
      .join('');
    var drafts = (state && state.exhibitions) || [];
    var ownDraft = discoverOwnDraft(drafts, signed);
    var hasMuseum = signed && (saved.length || notes.length);
    var curationKey = ownDraft ? 'origin_discover_draft_open' : hasMuseum ? 'origin_discover_continue_museum' : 'origin_discover_draft';
    var curationFallback = ownDraft ? 'Continue this draft' : hasMuseum ? 'Continue my museum' : 'Start a museum draft';
    var curationRoute = ownDraft
      ? PREFIX + '/studio/' + encodeURIComponent(ownDraft.slug) + '/edit'
      : hasMuseum
        ? '/origin/my'
        : '/origin/studio/new';
    var noteKey = ownDraft ? 'origin_discover_draft_note' : hasMuseum ? 'origin_discover_session_saved' : 'origin_discover_session_draft';
    var noteFallback = ownDraft
      ? 'This draft stays in this browser and is not a published exhibition.'
      : hasMuseum
        ? 'Saved items stay in this browser.'
        : 'The draft stays in this browser. Public publishing is not available.';
    var fieldText = featured ? atlasFieldLabel(atlasFieldId(featured)) || '' : '';
    var cue = featured ? discoverCue(featured) : '';
    var featuredVernacular = featured ? discoverVernacular(featured) : '';
    var feature = featured
      ? '<article class="mc-origin-discover__feature">' +
        '<div class="mc-origin-discover__media">' +
        discoverFigure(featured, 'eager') +
        '</div>' +
        '<div class="mc-origin-discover__copy">' +
        (fieldText ? '<p class="mc-origin__kicker">' + escapeHtml(fieldText) + '</p>' : '') +
        '<h2 class="mc-origin-discover__sci">' +
        discoverScientificHtml(featured) +
        '</h2>' +
        (featuredVernacular ? '<p class="mc-origin-discover__common">' + escapeHtml(featuredVernacular) + '</p>' : '') +
        '<p class="mc-origin-id"><span data-i18n="origin_discover_catalog">' +
        escapeHtml(t('origin_discover_catalog', 'Catalog ID')) +
        '</span> <span>' +
        escapeHtml(featured.id) +
        '</span></p>' +
        (cue ? '<p class="mc-origin-meta">' + escapeHtml(cue) + '</p>' : '') +
        discoverHref(PREFIX + '/atlas/' + encodeURIComponent(featured.id), 'mc-origin__text-action', 'Open this record', 'origin_discover_open_record') +
        '</div></article>'
      : catalogFailed
        ? '<div class="mc-origin-empty" role="alert"><p data-i18n="origin_discover_catalog_error">The specimen list could not be read. Nothing was changed.</p><button type="button" class="mc-origin__btn" data-origin-discover-retry="1" data-i18n="origin_discover_retry">Try again</button></div>'
        : '<p class="mc-origin-empty" data-i18n="origin_atlas_no_catalog">There are no public specimen records to search.</p>';
    return (
      '<article class="mc-origin-landing mc-origin-discover" data-origin-home="discover" aria-labelledby="mc-origin-hall-title">' +
      '<section class="mc-origin-discover__hero">' +
      discoverMarketingHeroHtml() +
      '<div class="mc-origin-discover__mast">' +
      '<h1 id="mc-origin-hall-title" class="mc-origin__title mc-origin-discover__title" data-i18n="origin_discover_title">From one specimen, a wider world.</h1>' +
      '<p class="mc-origin-discover__lead" data-i18n="origin_discover_lead">Explore sourced specimens, join a discussion that has context, and shape a collection into your museum.</p>' +
      '<form class="mc-origin-search mc-origin-discover__search" data-origin-search="1" role="search">' +
      '<label class="mc-origin-discover__search-label" for="mc-origin-discover-search" data-i18n="origin_discover_search_label">Scientific name, common name, or catalog ID</label>' +
      '<div class="mc-origin-search__row">' +
      '<input id="mc-origin-discover-search" name="q" type="search" autocomplete="off" enterkeyhint="search" data-i18n-placeholder="origin_search_placeholder" placeholder="Search scientific name, common name, or catalog ID" />' +
      '<button type="submit" class="mc-origin-search__submit" data-i18n="origin_search_submit">Explore specimens</button>' +
      '</div></form>' +
      '<div class="mc-origin-discover__actions">' +
      '<a class="mc-origin__btn mc-origin__btn--primary" href="#/origin/atlas" data-origin-route="/origin/atlas" data-origin-cta="primary" data-i18n="origin_explore_specimens">Explore specimens</a>' +
      discoverHref(curationRoute, 'mc-origin__btn mc-origin__btn--secondary', curationFallback, curationKey) +
      '<a class="mc-origin__btn mc-origin__btn--secondary" href="#/origin/pulse" data-origin-route="/origin/pulse" data-i18n="origin_enter_pulse">Enter PULSE</a>' +
      '</div>' +
      '<p class="mc-origin-discover__note" data-i18n="' +
      noteKey +
      '">' +
      escapeHtml(t(noteKey, noteFallback)) +
      '</p></div>' +
      feature +
      '</section>' +
      (cards
        ? '<section class="mc-origin-discover__more" aria-labelledby="mc-origin-discover-more">' +
          '<div class="mc-origin-discover__more-head"><h2 id="mc-origin-discover-more" class="mc-origin-section__title" data-i18n="origin_discover_more">' +
          escapeHtml(t('origin_discover_more', 'Public specimens')) +
          '</h2>' +
          discoverHref('/origin/atlas', 'mc-origin__text-action', 'View all specimens', 'origin_discover_all') +
          '</div>' +
          '<ul class="mc-origin-atlas-grid">' +
          cards +
          '</ul></section>'
        : '') +
      discoverClosingHtml() +
      discoverConnectHtml(signed, state, assets) +
      '</article>'
    );
  }
  function originMoreHtml() {
    return (
      '<section class="mc-origin-section mc-origin-more" aria-labelledby="mc-origin-more" data-origin-layer="more">' +
      '<h2 id="mc-origin-more" class="mc-origin-section__title" data-i18n="origin_more_explore">More to explore</h2>' +
      '<div class="mc-origin-more__tabs" role="tablist" aria-label="More to explore">' +
      '<button type="button" class="mc-origin__nav-link is-active" role="tab" id="mc-origin-more-tab-fields" aria-selected="true" aria-controls="mc-origin-more-panel-fields" data-origin-more-tab="fields" data-i18n="origin_more_fields">Scientific fields</button>' +
      '<button type="button" class="mc-origin__nav-link" role="tab" id="mc-origin-more-tab-collection" aria-selected="false" aria-controls="mc-origin-more-panel-collection" data-origin-more-tab="collection" data-i18n="origin_more_collection">Collection and exhibitions</button>' +
      '<button type="button" class="mc-origin__nav-link" role="tab" id="mc-origin-more-tab-community" aria-selected="false" aria-controls="mc-origin-more-panel-community" data-origin-more-tab="community" data-i18n="origin_more_community">Collaboration and contributors</button>' +
      '</div>' +
      '<div id="mc-origin-more-panel-fields" role="tabpanel" aria-labelledby="mc-origin-more-tab-fields">' +
      '<ul class="mc-origin-fields mc-origin-fields--visual" data-origin-fields-preview="1">' +
      originFieldCardsHtml(3) +
      '</ul>' +
      '<ul class="mc-origin-fields mc-origin-fields--visual" data-origin-fields-rest="1" hidden>' +
      originFieldCardsHtml('rest') +
      '</ul>' +
      '<button type="button" class="mc-origin__text-action" data-origin-more-expand="fields" data-i18n="origin_view_all">View all</button>' +
      '</div>' +
      '<div id="mc-origin-more-panel-collection" role="tabpanel" aria-labelledby="mc-origin-more-tab-collection" hidden>' +
      '<p class="mc-origin-empty mc-origin-empty--compact" data-i18n="origin_improved_empty">There are no approved specimen revisions yet. Unreviewed suggestions are not listed.</p>' +
      '<button type="button" class="mc-origin__text-action" data-origin-route="/origin/studio" data-i18n="origin_view_all">View all</button>' +
      '</div>' +
      '<div id="mc-origin-more-panel-community" role="tabpanel" aria-labelledby="mc-origin-more-tab-community" hidden>' +
      '<div class="mc-origin-process mc-origin-more__block" aria-labelledby="mc-origin-collab">' +
      '<h3 id="mc-origin-collab" class="mc-origin-section__title" data-i18n="origin_collab_title">How contribution review works</h3>' +
      '<ol class="mc-origin-steps">' +
      '<li><span class="mc-origin-step-mark" aria-hidden="true">1</span><h3 data-i18n="origin_collab_step1">Suggest an improvement</h3><p data-i18n="origin_collab_step1_body">Propose a revision to an allowed field.</p></li>' +
      '<li><span class="mc-origin-step-mark" aria-hidden="true">2</span><h3 data-i18n="origin_collab_step_source">Attach reliable sources</h3><p data-i18n="origin_collab_step_source_body">A revision needs a checkable source.</p></li>' +
      '<li><span class="mc-origin-step-mark" aria-hidden="true">3</span><h3 data-i18n="origin_collab_step2">Owner reviews each proposed field</h3><p data-i18n="origin_collab_step2_body">Accept or return each field. Unreviewed content stays private.</p></li>' +
      '<li><span class="mc-origin-step-mark" aria-hidden="true">4</span><h3 data-i18n="origin_collab_step_approve">Approved changes create a revision</h3><p data-i18n="origin_collab_step_approve_body">The public revision keeps contributor attribution.</p></li>' +
      '</ol></div></div></section>'
    );
  }

  function originTrustIcon(name) {
    var path =
      name === 'owner'
        ? 'M12 3 5 6v6c0 4.2 2.8 7.1 7 8.5 4.2-1.4 7-4.3 7-8.5V6l-7-3zm-2.5 9.2 1.7 1.8 3.4-4'
        : name === 'history'
          ? 'M12 5v7l4 2m-4-11a9 9 0 1 0 8.2 5.4'
          : name === 'rights'
            ? 'M7 4h10v16H7zM9 8h6M9 12h6M9 16h4'
            : 'M4 6h16v9H8l-4 4V6z';
    return (
      '<svg viewBox="0 0 24 24" class="mc-origin-trust__icon" aria-hidden="true"><path d="' +
      path +
      '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
    );
  }

  function navButton(href, labelKey, fallback, active, id) {
    return (
      '<button type="button" class="mc-origin__nav-link' +
      (active ? ' is-active' : '') +
      '" data-origin-route="' +
      escapeHtml(href) +
      '" data-origin-nav-item="' +
      escapeHtml(id || '') +
      '"' +
      (active ? ' aria-current="page"' : '') +
      ' data-i18n="' +
      labelKey +
      '">' +
      escapeHtml(fallback) +
      '</button>'
    );
  }

  function renderError(root, err) {
    var parsed = parseOriginPath(PREFIX);
    root.innerHTML =
      '<div class="mc-origin" data-mc-origin="1" data-origin-nav="stage5" data-origin-surface="paper">' +
      '<a class="mc-origin__skip" href="#mc-origin-content" data-i18n="origin_skip">Skip to ORIGIN content</a>' +
      '<div class="mc-origin__shell">' +
      pageheadHtml(parsed, isSignedIn()) +
      '<div id="mc-origin-content" class="mc-origin__error mc-origin__content" tabindex="-1">' +
      '<h1 data-i18n="origin_error_title">ORIGIN could not load</h1>' +
      '<p data-i18n="origin_error_body">ORIGIN could not reach the current workspace. Retry does not change existing specimens or exhibitions.</p>' +
      (err ? '<p class="mc-origin__empty">' + escapeHtml(String(err.message || err)) + '</p>' : '') +
      '<button type="button" class="mc-origin__button" data-origin-retry="1" data-i18n="origin_retry">Retry</button>' +
      '</div></div></div>';
    try {
      if (typeof global.applyI18n === 'function') global.applyI18n();
    } catch (eErrI18n) {}
    bindLocalNav(root);
    syncOriginHeaderOffset(root);
  }

  function atlasArticleFactRow(label, value) {
    if (!value) return '';
    return (
      '<div class="mc-origin-article-facts__row"><dt>' +
      escapeHtml(label) +
      '</dt><dd>' +
      escapeHtml(value) +
      '</dd></div>'
    );
  }

  function atlasArticleHtml(parsed, state, signed, assets) {
    var note = null;
    var i;
    var found = findPublicAtlasById(assets, parsed.specimenId);
    var meta;
    var locality;
    var period;
    var material;
    var facts = '';
    var ranks = '';
    var events = '';
    var sections = '';
    var collab = '';
    for (i = 0; i < state.atlasNotes.length; i += 1) {
      if (state.atlasNotes[i].specimenId === parsed.specimenId) note = state.atlasNotes[i];
    }
    if (!found) {
      return (
        '<section class="mc-origin-article" data-origin-atlas-article="stage7"><h2>' +
        escapeHtml(t('origin_atlas_private', 'This specimen is private, removed, or outside the public ATLAS set.')) +
        '</h2><p class="mc-origin__lead">' +
        escapeHtml(t('origin_atlas_id_not_found', 'No public specimen matches this identifier.')) +
        '</p><button type="button" class="mc-origin__btn" data-origin-route="' +
        escapeHtml(PREFIX + '/atlas') +
        '" data-i18n="origin_atlas_back_results">Back to results</button></section>'
      );
    }
    meta = found.metadata || {};
    locality = publicLocality(found);
    period = geologicalPeriod(found);
    material = specimenMaterialType(found);
    facts += atlasArticleFactRow(t('origin_article_fact_taxonomy', 'Taxonomy'), taxonomicGroup(found));
    facts += atlasArticleFactRow(t('origin_article_fact_measurements', 'Measurements'), meta.measurements || meta.size || meta.elevation);
    facts += atlasArticleFactRow(t('origin_article_fact_material', 'Material / type'), material);
    facts += atlasArticleFactRow(t('origin_article_fact_collected', 'Collection / acquisition date'), meta.dateCollected);
    facts += atlasArticleFactRow(t('origin_article_fact_period', 'Geological period'), period);
    facts += atlasArticleFactRow(t('origin_article_fact_locality', 'Locality (permitted precision)'), locality);
    facts += atlasArticleFactRow(t('origin_article_fact_preservation', 'Preservation method'), found.basisOfRecord);
    facts += atlasArticleFactRow(t('origin_article_license', 'License'), meta.license);
    facts += atlasArticleFactRow('GBIF', meta.gbifId);
    facts += atlasArticleFactRow('Catalogue of Life', meta.colId);
    if (meta.classification) {
      var rankParts = String(meta.classification).split('>');
      for (i = 0; i < rankParts.length; i += 1) {
        if (rankParts[i].trim()) ranks += '<li>' + escapeHtml(rankParts[i].trim()) + '</li>';
      }
    }
    if (Array.isArray(found.provenance)) {
      for (i = 0; i < found.provenance.length; i += 1) {
        if (!found.provenance[i].event || /0x[a-f0-9]{20,}/i.test(found.provenance[i].actor || '')) continue;
        events +=
          '<li><time>' +
          escapeHtml(String(found.provenance[i].date || '').slice(0, 10)) +
          '</time><p>' +
          escapeHtml(found.provenance[i].event) +
          '</p></li>';
      }
    }
    if (found.description) {
      sections +=
        '<div id="atlas-overview"><h4 data-i18n="origin_article_overview">Overview</h4><p>' +
        escapeHtml(found.description) +
        '</p></div>';
    }
    sections +=
      '<div id="atlas-identification"><h4 data-i18n="origin_article_identification">Identification</h4><p>' +
      escapeHtml(material || atlasFieldLabel(atlasFieldId(found)) || found.category || found.scientificName) +
      '</p></div>';
    if (ranks) {
      sections +=
        '<div id="atlas-taxonomy"><h4 data-i18n="origin_article_taxonomy">Taxonomy</h4><ol class="mc-origin-article-ranks">' +
        ranks +
        '</ol></div>';
    }
    sections = '<section id="atlas-identity" class="mc-origin-article__group"><h3 data-i18n="origin_article_group_identity">Identity and taxonomy</h3>' + sections + '</section>';
    var materialBlock = '';
    if (found.basisOfRecord || found.recordType) {
      materialBlock +=
        '<div id="atlas-preparation"><h4 data-i18n="origin_article_preparation">Preparation and preservation</h4><p>' +
        escapeHtml(found.basisOfRecord || found.recordType) +
        '</p></div>';
    }
    if (materialBlock) {
      sections +=
        '<section id="atlas-material" class="mc-origin-article__group"><h3 data-i18n="origin_article_group_material">Specimen and material</h3>' +
        materialBlock +
        '</section>';
    }
    var contextBlock = '';
    if (period) {
      contextBlock +=
        '<div id="atlas-geological"><h4 data-i18n="origin_article_geological">Geological context</h4><p>' +
        escapeHtml(period) +
        '</p></div>';
    }
    if (meta.ecology || meta.habitat) {
      contextBlock +=
        '<div id="atlas-ecology"><h4 data-i18n="origin_article_ecology">Ecology / paleoecology</h4><p>' +
        escapeHtml(meta.ecology || meta.habitat) +
        '</p></div>';
    }
    if (locality || meta.dateCollected) {
      contextBlock +=
        '<div id="atlas-locality"><h4 data-i18n="origin_article_locality">Locality</h4><p>' +
        escapeHtml(locality || t('origin_article_restricted_locality', 'Sensitive locality is withheld under privacy rules.')) +
        '</p></div>';
    }
    if (meta.researchNote) {
      contextBlock +=
        '<div id="atlas-research"><h4 data-i18n="origin_article_research">Research significance</h4><p>' +
        escapeHtml(meta.researchNote) +
        '</p></div>';
    }
    if (contextBlock) {
      sections +=
        '<section id="atlas-context" class="mc-origin-article__group"><h3 data-i18n="origin_article_group_context">Geological or collecting context</h3>' +
        contextBlock +
        '</section>';
    }
    var sourceBlock = '';
    if (meta.collector) {
      sourceBlock +=
        '<div id="atlas-collection"><h4 data-i18n="origin_article_collection">Collection and provenance</h4><p>' +
        escapeHtml(meta.collector) +
        '</p></div>';
    }
    if (events) {
      sourceBlock +=
        '<div id="atlas-timeline"><h4 data-i18n="origin_article_timeline">Record timeline</h4><ol class="mc-origin-article-events">' +
        events +
        '</ol></div>';
    }
    if (sourceBlock) {
      sections +=
        '<section id="atlas-source" class="mc-origin-article__group"><h3 data-i18n="origin_article_group_source">Source and holding</h3>' +
        sourceBlock +
        '</section>';
    }
    if (!found.description) {
      collab += '<p class="mc-origin-banner" data-i18n="origin_article_sparse">This is a sparse record. Missing sections are hidden rather than filled with empty rows.</p>';
    }
    sections +=
      '<section id="atlas-revisions" class="mc-origin-article__group"><h3 data-i18n="origin_article_group_revisions">Revisions and contributions</h3><p data-i18n="origin_collab_surface_body">Proposal editing and holder review run in the ORIGIN web session with the specimen catalogue. This surface does not write canonical specimen records and does not invent pending proposals.</p></section>';
    var tocLinks =
      '<li><a href="#atlas-identity">' +
      escapeHtml(t('origin_article_group_identity', 'Identity and taxonomy')) +
      '</a></li>' +
      (sections.indexOf('id="atlas-material"') >= 0
        ? '<li><a href="#atlas-material">' + escapeHtml(t('origin_article_group_material', 'Specimen and material')) + '</a></li>'
        : '') +
      (sections.indexOf('id="atlas-context"') >= 0
        ? '<li><a href="#atlas-context">' + escapeHtml(t('origin_article_group_context', 'Geological or collecting context')) + '</a></li>'
        : '') +
      (sections.indexOf('id="atlas-source"') >= 0
        ? '<li><a href="#atlas-source">' + escapeHtml(t('origin_article_group_source', 'Source and holding')) + '</a></li>'
        : '') +
      '<li><a href="#atlas-revisions">' +
      escapeHtml(t('origin_article_group_revisions', 'Revisions and contributions')) +
      '</a></li>' +
      '<li><a href="#atlas-rights">' +
      escapeHtml(t('origin_article_group_rights', 'Rights and citation')) +
      '</a></li>';
    var tocHtml =
      '<nav class="mc-origin-article__toc" aria-label="' +
      escapeHtml(t('origin_article_toc', 'On this page')) +
      '"><div class="mc-origin-article__toc-desktop"><p class="mc-origin-article__toc-label" data-i18n="origin_article_toc">On this page</p><ol>' +
      tocLinks +
      '</ol></div><details class="mc-origin-article__toc-mobile"><summary data-i18n="origin_article_toc">On this page</summary><ol>' +
      tocLinks +
      '</ol></details></nav>';
    var backHref = (state && state.lastAtlasListHref) || PREFIX + '/atlas';
    var neighbors = atlasNeighborIds(state.lastAtlasResultIds, found.id);
    var navRow =
      '<div class="mc-origin-article__navrow"><button type="button" class="mc-origin__text-action" data-origin-route="' +
      escapeHtml(backHref) +
      '" data-i18n="origin_atlas_back_results">Back to results</button>' +
      (neighbors.prevId
        ? '<button type="button" class="mc-origin__btn" data-origin-route="' +
          escapeHtml(PREFIX + '/atlas/' + encodeURIComponent(neighbors.prevId)) +
          '" data-i18n="origin_atlas_prev_specimen">Previous in these results</button>'
        : '') +
      (neighbors.nextId
        ? '<button type="button" class="mc-origin__btn" data-origin-route="' +
          escapeHtml(PREFIX + '/atlas/' + encodeURIComponent(neighbors.nextId)) +
          '" data-i18n="origin_atlas_next_specimen">Next in these results</button>'
        : '') +
      '</div>';
    return (
      '<article class="mc-origin-article" data-origin-atlas-article="stage7">' +
      navRow +
      '<header class="mc-origin-article__identity">' +
      atlasMediaHtml(found.imageURL, found.scientificName) +
      '<p class="mc-origin-article__kicker">' +
      escapeHtml(material || atlasFieldLabel(atlasFieldId(found)) || found.category) +
      '</p><h2 class="mc-origin-article__sci"><i lang="la">' +
      escapeHtml(found.scientificName) +
      '</i></h2>' +
      (found.name ? '<p class="mc-origin-article__common">' + escapeHtml(found.name) + '</p>' : '') +
      '<p class="mc-origin-id">' +
      escapeHtml(t('origin_article_catalog', 'Catalog ID') + ': ' + found.id) +
      '</p><div class="mc-origin-article__trust"><p class="mc-origin-meta">' +
      escapeHtml(found.verified ? t('origin_verified', 'Verified') : t('origin_article_unverified', 'Identification is not marked verified on this record.')) +
      '</p>' +
      (atlasHolder(found)
        ? '<p class="mc-origin-meta">' +
          escapeHtml(t('origin_article_holder', 'Collection / holder') + ': ' + atlasHolder(found)) +
          '</p>'
        : '') +
      '<p class="mc-origin-meta" data-i18n="origin_article_locality_precision">Locality is shown at permitted public precision.</p></div></header>' +
      (facts ? '<aside class="mc-origin-article__rail"><h3 data-i18n="origin_article_facts">Quick facts</h3><dl class="mc-origin-article-facts">' + facts + '</dl></aside>' : '') +
      tocHtml +
      '<div class="mc-origin-article__main">' +
      collab +
      sections +
      '<section id="atlas-rights" class="mc-origin-article__group"><h3 data-i18n="origin_article_group_rights">Rights and citation</h3>' +
      '<p class="mc-origin-meta" data-i18n="origin_article_pending_hidden">Pending proposals are not shown on the public page.</p>' +
      '<details class="mc-origin-atlas-help"><summary data-i18n="origin_atlas_notes">Knowledge notes</summary>' +
      '<p class="mc-origin-search__hint" data-i18n="origin_atlas_lead">Session notes are local drafts and do not overwrite canonical specimen records.</p>' +
      '<form class="mc-origin__form" data-origin-atlas-save="1" data-specimen-id="' +
      escapeHtml(found.id) +
      '"><textarea class="mc-origin__textarea" name="body"' +
      (signed ? '' : ' disabled') +
      '>' +
      escapeHtml(note ? note.body : '') +
      '</textarea></label>' + feedbackHtml() + '<button class="mc-origin__btn" type="submit"' +
      (signed ? '' : ' disabled') +
      ' data-i18n="origin_atlas_save">Save notes</button>' +
      (signed ? '' : '<p class="mc-origin__empty" data-i18n="origin_atlas_need_signin">Sign in to save ATLAS notes.</p>') +
      '</form></details></section></div></article>'
    );
  }

  function atlasDiscoveryHtml(parsed, assets) {
    var query = parseAtlasSearchParams(currentSearchParams());
    var peekId = parseAtlasPeek(currentSearchParams());
    var matched = applyAtlasSearch(assets, query);
    try {
      var rememberedIds = loadState();
      rememberedIds.lastAtlasResultIds = matched.map(function (row) {
        return row.id;
      });
      saveState(rememberedIds);
    } catch (eIds) {}
    var paged = paginateAtlas(matched, query.page);
    var facets = buildAtlasFacets(assets, query);
    var featured = !query.q && !query.field && !query.taxon && !query.type && !query.period && !query.region && query.media !== '1' && query.verified !== '1' && query.page <= 1 ? pickFeaturedAtlasSpecimen(assets) : null;
    var filterCount = countAtlasFilterDraft(query);
    var activeCount = countActiveAtlasFilters(query);
    var browseEmpty = !String(query.q || '').trim() && filterCount === 0;
    var railOpen = true;
    try {
      railOpen = global.sessionStorage.getItem('mcurator.origin.atlas.railOpen.v1') !== '0';
    } catch (eRail) {
      railOpen = true;
    }
    var i;
    var cards = '';
    var chips = '';
    var pager = '';
    var featuredHtml = '';
    var empty = '';
    var emptyExplore = '';
    var fieldsHtml = '';
    if (query.q) chips += atlasChipButton(query, 'q', query.q);
    if (query.field) chips += atlasChipButton(query, 'field', atlasFieldLabel(query.field) || query.field);
    if (query.taxon) chips += atlasChipButton(query, 'taxon', query.taxon);
    if (query.type) chips += atlasChipButton(query, 'type', query.type);
    if (query.period) chips += atlasChipButton(query, 'period', query.period);
    if (query.region) chips += atlasChipButton(query, 'region', query.region);
    if (query.collab) chips += atlasChipButton(query, 'collab', query.collab);
    if (query.media === '1') chips += atlasChipButton(query, 'media', t('origin_atlas_filter_media', 'Has media'));
    if (query.verified === '1') chips += atlasChipButton(query, 'verified', t('origin_atlas_filter_verified', 'Verified records'));
    if (chips && activeCount) {
      chips +=
        '<li><button type="button" class="mc-origin__btn" data-origin-route="' +
        escapeHtml(PREFIX + '/atlas') +
        '" data-i18n="origin_atlas_clear_all">Clear all</button></li>';
    }
    var railFilters = atlasFiltersHtml('atlas', query, facets, 'rail');
    var sheetFilters = atlasFiltersHtml('sheet-atlas', query, facets, 'sheet');
    for (i = 0; i < paged.items.length; i += 1) cards += atlasCardHtml(paged.items[i], loadState().savedAtlasIds);
    if (featured) {
      featuredHtml =
        '<article class="mc-origin-atlas-featured"><h3 data-i18n="origin_atlas_featured">Featured public specimen</h3>' +
        '<div class="mc-origin-atlas-featured__layout">' +
        atlasMediaHtml(featured.imageURL, featured.scientificName) +
        '<div><p class="mc-origin-sci">' +
        escapeHtml(featured.scientificName) +
        '</p>' +
        (featured.name ? '<p>' + escapeHtml(featured.name) + '</p>' : '') +
        '<p class="mc-origin-id">' +
        escapeHtml(featured.id) +
        '</p><p class="mc-origin-meta">' +
        escapeHtml(atlasFieldLabel(atlasFieldId(featured))) +
        '</p><p class="mc-origin-meta">' +
        escapeHtml(atlasHolder(featured)) +
        '</p>' +
        (featured.description
          ? '<p class="mc-origin-atlas-featured__desc">' + escapeHtml(featured.description.slice(0, 220)) + '</p>'
          : '') +
        '<button type="button" class="mc-origin__btn mc-origin__btn--primary" data-origin-route="' +
        escapeHtml(PREFIX + '/atlas/' + encodeURIComponent(featured.id)) +
        '" data-i18n="origin_atlas_featured_open">Open this record</button></div></div></article>';
    }
    if (!assets.length) empty = '<p class="mc-origin-empty" data-i18n="origin_atlas_no_catalog">There are no public specimen records to search.</p>';
    else if (!matched.length) {
      empty =
        '<div class="mc-origin-empty" data-origin-atlas-zero="1"><p data-i18n="origin_atlas_no_matches">No specimens match the current query and filters.</p>' +
        '<p data-i18n="origin_atlas_narrow_lead">These constraints may be too narrow. Remove one filter, or reset and search again.</p>' +
        (chips ? '<ul class="mc-origin-atlas-chips">' + chips + '</ul>' : '') +
        (query.q
          ? '<button type="button" class="mc-origin__btn" data-origin-route="' +
            escapeHtml(atlasListHref(Object.assign({}, query, { q: '', page: 1 }))) +
            '" data-i18n="origin_atlas_clear_query">Clear keyword</button>'
          : '') +
        '<button type="button" class="mc-origin__btn" data-origin-route="' +
        escapeHtml(PREFIX + '/atlas') +
        '" data-i18n="origin_atlas_reset">Reset filters</button></div>';
    }
    if (browseEmpty) {
      emptyExplore =
        '<div class="mc-origin-atlas-empty-explore"><p class="mc-origin-atlas__lead" data-i18n="origin_atlas_intro">Search public specimen knowledge by scientific name, common name, catalog number, and taxonomy. This is not marketplace search and is not ranked by price or trade.</p>' +
        '<p class="mc-origin-atlas__trust" data-i18n="origin_atlas_trust">Collaboration is owner-reviewed. Only approved revisions enter the public record.</p>' +
        '<figure class="mc-origin-atlas-docstill">' +
        originPicture('atlas') +
        '</figure>' +
        featuredHtml +
        '</div>';
    }
    if (paged.pageCount > 1) {
      pager =
        '<div class="mc-origin-atlas-pager">' +
        (paged.hasPrev
          ? '<button type="button" class="mc-origin__btn" data-origin-route="' +
            escapeHtml(atlasListHref({ ...query, page: paged.page - 1 })) +
            '" data-i18n="origin_atlas_prev">Previous</button>'
          : '<button type="button" class="mc-origin__btn" disabled data-i18n="origin_atlas_prev">Previous</button>') +
        '<span>' +
        escapeHtml(t('origin_atlas_page', 'Page')) +
        ' ' +
        paged.page +
        ' / ' +
        paged.pageCount +
        '</span>' +
        (paged.hasNext
          ? '<button type="button" class="mc-origin__btn" data-origin-route="' +
            escapeHtml(atlasListHref({ ...query, page: paged.page + 1 })) +
            '" data-i18n="origin_atlas_next">Next</button>'
          : '<button type="button" class="mc-origin__btn" disabled data-i18n="origin_atlas_next">Next</button>') +
        '</div>';
    }
    if (browseEmpty && facets.field.length) {
      fieldsHtml =
        '<section class="mc-origin-atlas-fields" aria-labelledby="mc-origin-atlas-fields-title">' +
        '<h3 id="mc-origin-atlas-fields-title" data-i18n="origin_atlas_shortcuts">Explore by scientific field</h3><ul>' +
        facets.field
          .map(function (field) {
            var href = atlasListHref(Object.assign({}, ATLAS_DEFAULT_QUERY, { field: field.id, page: 1 }));
            return (
              '<li><button type="button" class="mc-origin-atlas-field-card" data-origin-route="' +
              escapeHtml(href) +
              '"><span>' +
              escapeHtml(atlasFieldLabel(field.id) || field.label) +
              '</span><span class="mc-origin-meta">' +
              escapeHtml(field.count) +
              '</span></button></li>'
            );
          })
          .join('') +
        '</ul></section>';
    }
    var peekHtml = '';
    if (peekId) {
      var peekAsset = findPublicAtlasById(assets, peekId);
      if (peekAsset) {
        peekHtml =
          '<div class="mc-origin-atlas-preview" data-origin-atlas-preview="1" role="presentation">' +
          '<div class="mc-origin-atlas-preview__panel" role="dialog" aria-modal="true" aria-labelledby="mc-origin-atlas-preview-title">' +
          '<header class="mc-origin-atlas-preview__head"><h3 id="mc-origin-atlas-preview-title" data-i18n="origin_atlas_preview_title">Specimen preview</h3>' +
          '<button type="button" class="mc-origin-atlas-preview__close mc-origin__btn" data-origin-atlas-preview-close="close" aria-label="' +
          escapeHtml(t('origin_atlas_preview_close', 'Close preview')) +
          '"><span aria-hidden="true">×</span></button></header>' +
          '<div class="mc-origin-atlas-preview__body">' +
          atlasMediaHtml(peekAsset.imageURL, peekAsset.scientificName) +
          '<p class="mc-origin-atlas-card__sci"><i lang="la">' +
          escapeHtml(peekAsset.scientificName) +
          '</i></p>' +
          (peekAsset.name ? '<p>' + escapeHtml(peekAsset.name) + '</p>' : '') +
          '<p class="mc-origin-id">' +
          escapeHtml(peekAsset.id) +
          '</p>' +
          (taxonomicGroup(peekAsset) ? '<p class="mc-origin-meta">' + escapeHtml(taxonomicGroup(peekAsset)) + '</p>' : '') +
          (atlasHolder(peekAsset) ? '<p class="mc-origin-meta">' + escapeHtml(atlasHolder(peekAsset)) + '</p>' : '') +
          (peekAsset.verified ? '<p class="mc-origin-meta">' + escapeHtml(t('origin_verified', 'Verified')) + '</p>' : '') +
          '<button type="button" class="mc-origin__btn mc-origin__btn--primary" data-origin-route="' +
          escapeHtml(PREFIX + '/atlas/' + encodeURIComponent(peekAsset.id)) +
          '" data-i18n="origin_atlas_read_record">Read full record</button></div></div></div>';
      }
    }
    return (
      '<section class="mc-origin-atlas" aria-labelledby="mc-origin-atlas-title" data-origin-atlas="stage6" data-origin-atlas-fields="' +
      ATLAS_DISCOVERY_FIELDS.map(function (row) {
        return row.id;
      }).join(',') +
      '">' +
      '<div class="mc-origin-atlas__live">' +
      '<header class="mc-origin-atlas__intro"><h2 id="mc-origin-atlas-title" data-i18n="origin_atlas_title">ATLAS specimen discovery</h2>' +
      '<p class="mc-origin-atlas__scope" data-i18n="origin_atlas_scope_trust">Public, traceable specimen records. Private and sensitive localities are omitted; collaboration is owner-reviewed.</p></header>' +
      '<form class="mc-origin-search mc-origin-atlas-search" data-origin-search="1" role="search">' +
      '<label class="mc-origin__label" for="mc-origin-atlas-search" data-i18n="origin_search_label">Search the museum</label>' +
      '<div class="mc-origin-search__row"><input id="mc-origin-atlas-search" class="mc-origin__input" name="q" type="search" value="' +
      escapeHtml(query.q) +
      '" autocomplete="off" enterkeyhint="search" role="combobox" aria-autocomplete="list" aria-controls="mc-origin-atlas-suggest" aria-expanded="false" data-i18n-placeholder="origin_search_placeholder" placeholder="Search specimens, taxa, topics, or exhibitions" />' +
      (query.q
        ? '<button type="button" class="mc-origin-atlas-search__clear" data-origin-atlas-clear-q="1" aria-label="' +
          escapeHtml(t('origin_atlas_clear_search', 'Clear search text')) +
          '"><span aria-hidden="true">×</span></button>'
        : '') +
      '<input type="hidden" name="field" value="' +
      escapeHtml(query.field) +
      '" /><input type="hidden" name="taxon" value="' +
      escapeHtml(query.taxon) +
      '" /><input type="hidden" name="type" value="' +
      escapeHtml(query.type) +
      '" /><input type="hidden" name="period" value="' +
      escapeHtml(query.period) +
      '" /><input type="hidden" name="region" value="' +
      escapeHtml(query.region) +
      '" />' +
      '<button type="submit" class="mc-origin-search__submit" data-i18n="origin_search_submit">Search</button>' +
      '<button type="button" class="mc-origin__btn mc-origin-atlas-filter-btn" data-origin-atlas-sheet="1" data-origin-atlas-sheet-open="1" aria-expanded="false" aria-controls="mc-origin-atlas-filter-dialog">' +
      escapeHtml(t('origin_atlas_filters', 'Filters')) +
      (filterCount ? ' (' + filterCount + ')' : '') +
      '</button></div>' +
      '<div class="mc-origin-search__panel" id="mc-origin-atlas-suggest" hidden data-origin-atlas-suggest="1"><ul class="mc-origin-search__list" role="listbox"></ul></div></form>' +
      (chips ? '<ul class="mc-origin-atlas-chips" aria-label="' + escapeHtml(t('origin_atlas_filter_summary', 'Active filters')) + '">' + chips + '</ul>' : '') +
      '<div class="mc-origin-atlas-layout' +
      (railOpen ? ' is-rail-open' : '') +
      '">' +
      '<aside id="mc-origin-atlas-rail" class="mc-origin-atlas-rail" data-origin-atlas-rail="1" aria-label="' +
      escapeHtml(t('origin_atlas_filters', 'Filters')) +
      '"><div class="mc-origin-atlas-rail__head"><h3 data-i18n="origin_atlas_filters">Filters</h3>' +
      '<button type="button" class="mc-origin__btn" data-origin-atlas-rail-toggle="0" data-i18n="origin_atlas_rail_hide">Hide filters</button></div>' +
      railFilters +
      '</aside>' +
      '<div class="mc-origin-atlas-main"><div class="mc-origin-atlas-toolbar"><p>' +
      escapeHtml(t('origin_atlas_results', 'Results')) +
      ': ' +
      paged.total +
      ' ' +
      escapeHtml(t('origin_atlas_result_count', 'public specimens')) +
      '</p><p class="mc-origin-meta" data-i18n="origin_atlas_sort_note">Order: scientific name (stable)</p></div>' +
      empty +
      (paged.stale ? '<p class="mc-origin-stale" data-i18n="origin_atlas_stale">This page is stale. Showing the last available page.</p>' : '') +
      (cards ? '<ul class="mc-origin-atlas-grid">' + cards + '</ul>' : '') +
      pager +
      fieldsHtml +
      (browseEmpty ? featuredHtml : '') +
      '<details class="mc-origin-atlas-advanced"><summary data-i18n="origin_atlas_more_options">More options</summary>' +
      '<form class="mc-origin-atlas-idform" data-origin-atlas-open="1"><label class="mc-origin__label"><span data-i18n="origin_atlas_open_by_id">Open by specimen ID</span>' +
      '<input class="mc-origin__input" name="specimenId" value="" autocomplete="off" /></label>' +
      '<p class="mc-origin-search__hint" data-i18n="origin_atlas_open_by_id_hint">Enter an existing catalog or SAT identifier. This does not create a new specimen.</p>' +
      '<p class="mc-origin-empty" data-origin-atlas-id-error="1" role="status" hidden></p>' +
      '<button class="mc-origin__btn" type="submit" data-i18n="origin_atlas_open">Open ATLAS</button></form>' +
      '<details class="mc-origin-atlas-help"><summary data-i18n="origin_atlas_notes">Knowledge notes</summary>' +
      '<p class="mc-origin-search__hint" data-i18n="origin_atlas_lead">Session notes are local drafts and do not overwrite canonical specimen records.</p></details></details></div></div></div>' +
      '<div class="mc-origin-atlas-sheet" id="mc-origin-atlas-filter-overlay" hidden role="presentation" data-origin-atlas-filter-overlay="1">' +
      '<div class="mc-origin-atlas-sheet__panel" id="mc-origin-atlas-filter-dialog" role="dialog" aria-modal="true" aria-labelledby="mc-origin-atlas-sheet-title" aria-describedby="mc-origin-atlas-sheet-desc" data-origin-atlas-sheet-panel="1">' +
      '<header class="mc-origin-atlas-sheet__header"><div><h3 id="mc-origin-atlas-sheet-title" data-i18n="origin_atlas_filters">Filters</h3>' +
      (activeCount
        ? '<p class="mc-origin-atlas-sheet__count">' +
          escapeHtml(t('origin_atlas_filter_active', '{n} active').replace('{n}', String(activeCount))) +
          '</p>'
        : '') +
      '</div><button type="button" class="mc-origin-atlas-sheet__close" data-origin-atlas-sheet-close="close" aria-label="' +
      escapeHtml(t('origin_atlas_close_filters', 'Close filters')) +
      '"><span aria-hidden="true">×</span></button></header>' +
      '<div class="mc-origin-atlas-sheet__body"><p id="mc-origin-atlas-sheet-desc" class="mc-origin-atlas-sheet__help" data-i18n="origin_atlas_filter_help">' +
      escapeHtml(t('origin_atlas_filter_help', 'Change filters, then apply. Close, Escape, or the backdrop will not change the applied query.')) +
      '</p>' +
      sheetFilters +
      '</div><footer class="mc-origin-atlas-sheet__footer">' +
      '<button type="button" class="mc-origin__btn" data-origin-atlas-sheet-close="cancel" data-i18n="origin_atlas_close_filters">Close filters</button>' +
      '<button type="submit" class="mc-origin__btn mc-origin__btn--primary" form="mc-origin-atlas-sheet-form" data-origin-atlas-sheet-apply="1">' +
      escapeHtml(t('origin_atlas_apply_results', 'Show {n} results').replace('{n}', String(paged.total))) +
      '</button></footer></div></div>' +
      peekHtml +
      '</section>'
    );
  }

  function originIcon(name) {
    var paths = {
      home: 'M3 10 12 3l9 7M5 9v12h14V9M9 21v-8h6v8',
      atlas: 'M12 3v18M3 5c4-2 6-1 9 1 3-2 5-3 9-1v15c-4-2-6-1-9 1-3-2-5-3-9-1Z',
      pulse: 'M21 11a8 8 0 0 1-8 8H5l-4 3 2-7a8 8 0 1 1 18-4ZM7 10h10M7 14h6',
      studio: 'M3 4h18v16H3ZM3 9h18M9 9v11',
      my: 'm3 8 9-5 9 5M4 10h16M6 10v9M12 10v9M18 10v9M3 21h18',
      plus: 'M12 5v14M5 12h14',
      arrow: 'M5 12h14m-6-6 6 6-6 6',
      bookmark: 'M6 3h12v18l-6-4-6 4Z',
      lock: 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5Z',
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (paths[name] || paths.atlas) + '"></path></svg>';
  }

  function ux(key, fallback) { return escapeHtml(t('origin_ux_' + key, fallback)); }

  function routeAction(href, label, primary) {
    return '<button type="button" class="mc-origin__btn' + (primary ? ' mc-origin__btn--primary' : '') + '" data-origin-route="' + escapeHtml(href) + '">' + label + '</button>';
  }

  function authCard(module) {
    var title = module === 'studio' ? ux('auth_studio_title', 'Your next exhibition starts here') : module === 'my' ? ux('auth_my_title', 'A home for your discoveries') : ux('auth_pulse_title', 'Join the scientific conversation');
    return '<section class="mc-origin-auth-card"' + (module === 'studio' ? ' data-studio-gate="signed-out"' : module === 'my' ? ' data-museum-gate="signed-out"' : ' data-pulse-state="signed-out"') + '><div class="mc-origin-auth-card__icon">' + originIcon(module || 'lock') + '</div><p class="mc-origin__kicker">' + ux('personal_workspace', 'YOUR WORKSPACE') + '</p><h2>' + title + '</h2><p>' + ux('auth_body', 'Start a session to save research notes, contribute to discussions, and build exhibition drafts.') + '</p><div class="mc-origin__actions"><button type="button" class="mc-origin__btn mc-origin__btn--primary" data-origin-signin="1">' + escapeHtml(t('origin_studio_signin_cta', 'Go to sign in')) + '</button>' + routeAction(PREFIX + '/atlas', escapeHtml(t('origin_explore_specimens', 'Explore specimens'))) + '</div></section>';
  }

  function emptyCard(icon, title, body, action) {
    return '<section class="mc-origin-empty-state"><div class="mc-origin-empty-state__icon">' + originIcon(icon) + '</div><h2>' + title + '</h2><p>' + body + '</p>' + (action || '') + '</section>';
  }

  function sessionNotice() {
    return '<p class="mc-origin-notice">' + ux('session_notice', 'Saved in this browser tab for the current session. Public publishing is not available here.') + '</p>';
  }

  function feedbackHtml() { return '<p class="mc-origin-form-feedback" data-origin-form-feedback="1" role="status" tabindex="-1" hidden></p>'; }

  function announceOriginStatus(root, message, error) {
    if (!root || !root.querySelector) return;
    var live = root.querySelector('[data-origin-live]');
    if (!live && root.appendChild && global.document && global.document.createElement) {
      live = global.document.createElement('p');
      live.setAttribute('data-origin-live', '1');
      live.className = 'mc-origin-form-feedback';
      root.appendChild(live);
    }
    if (!live) return;
    live.hidden = false;
    live.setAttribute('role', error ? 'alert' : 'status');
    live.textContent = message;
  }

  function showFeedback(form, key, fallback, error) {
    var node = form && form.querySelector('[data-origin-form-feedback]');
    if (!node) return;
    node.hidden = false;
    node.setAttribute('role', error ? 'alert' : 'status');
    node.textContent = t('origin_ux_' + key, fallback);
    if (error && node.focus) node.focus();
  }

  function inputValue(form, name) {
    var node = form.elements && form.elements.namedItem ? form.elements.namedItem(name) : form[name];
    return String(node && node.value || '').trim();
  }

  function displayDate(value) {
    var date = new Date(value || '');
    if (!isFinite(date.getTime())) return '';
    try { return date.toLocaleDateString(global.document.documentElement.lang || undefined, { month: 'short', day: 'numeric' }); } catch (eDate) { return date.toISOString().slice(0, 10); }
  }

  var PULSE_TYPES = [
    ['scientific_question', 'origin_pulse_type_question', 'Scientific question'],
    ['research_share', 'origin_pulse_type_share', 'Research share'],
    ['field_observation', 'origin_pulse_type_observation', 'Field observation'],
    ['identification_request', 'origin_pulse_type_id', 'Identification request'],
    ['museum_update', 'origin_pulse_type_museum', 'Museum update'],
    ['exhibition_announcement', 'origin_pulse_type_exhibition', 'Exhibition announcement'],
  ];
  var PULSE_FIELDS = [
    ['biology', 'origin_field_biology', 'Biology'], ['taxonomy', 'origin_field_taxonomy', 'Taxonomy'],
    ['conservation', 'origin_field_conservation', 'Conservation'], ['museum_studies', 'origin_field_museum_studies', 'Museum science'],
    ['paleontology', 'origin_field_paleontology', 'Paleontology'], ['entomology', 'origin_entomology_label', 'Entomology'],
    ['botany', 'origin_botany_label', 'Botany'], ['zoology', 'origin_zoology_label', 'Zoology'], ['ecology', 'origin_ecology_label', 'Ecology'],
  ];

  function optionLabel(rows, id) {
    var row = rows.filter(function (item) { return item[0] === id; })[0];
    return row ? t(row[1], row[2]) : String(id || '');
  }

  function selectOptions(rows, selected) {
    return '<option value="">' + ux('select_option', 'Choose an option') + '</option>' + rows.map(function (row) {
      return '<option data-i18n="' + row[1] + '" value="' + row[0] + '"' + (selected === row[0] ? ' selected' : '') + '>' + escapeHtml(t(row[1], row[2])) + '</option>';
    }).join('');
  }

  function pulsePostHtml(post, state, detail) {
    var saved = state.savedPulseIds.indexOf(post.id) >= 0;
    var safeSource = /^https?:\/\/[^\s]+$/i.test(post.sourceUrl || '');
    return '<article class="mc-origin-pulse__card' + (detail ? ' mc-origin-pulse-thread' : ' mc-origin-pulse__card--summary') + '"><p class="mc-origin-pulse__meta">' + escapeHtml(optionLabel(PULSE_TYPES, post.type)) + ' <span aria-hidden="true">·</span> ' + escapeHtml(optionLabel(PULSE_FIELDS, post.scientificField)) + '</p><h2>' + (detail ? escapeHtml(post.topic) : '<button type="button" class="mc-origin__text-action" data-origin-route="/origin/pulse/' + encodeURIComponent(post.id) + '">' + escapeHtml(post.topic) + '</button>') + '</h2><p class="mc-origin-pulse__body' + (detail ? '' : ' mc-origin-pulse__body--clamp') + '">' + escapeHtml(detail ? post.body : pulseExcerpt(post.body)) + '</p>' + (safeSource ? '<a class="mc-origin-pulse-source" href="' + escapeHtml(post.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + ux('view_source', 'View source') + ' ↗</a>' : '') + '<footer class="mc-origin-pulse__foot"><span>' + escapeHtml(displayDate(post.createdAt)) + ' · ' + ux('session_discussion', 'Session discussion') + '</span><button type="button" class="mc-origin__text-action" data-origin-pulse-save="' + escapeHtml(post.id) + '" aria-pressed="' + (saved ? 'true' : 'false') + '">' + originIcon('bookmark') + (saved ? ux('saved', 'Saved') : ux('save', 'Save')) + '</button></footer></article>';
  }

  function pulseModuleHtml(parsed, state, signed) {
    if (parsed.pulseView === 'compose') {
      if (!signed) return authCard('pulse');
      if (state.pulseFrozen) return emptyCard('lock', ux('posting_paused', 'Posting is paused'), escapeHtml(t('origin_pulse_policy', 'Checkable scientific discussion belongs here.')), routeAction('/origin/pulse', ux('back_community', 'Back to community')));
      var draft = state.pulseDraft || {};
      return '<div class="mc-origin-editor-grid"><section><header class="mc-origin-workspace-head"><div><p class="mc-origin__kicker">PULSE / ' + ux('new_discussion', 'NEW DISCUSSION') + '</p><h2>' + ux('share_observation', 'Give your observation a place to grow') + '</h2></div></header><form class="mc-origin__form mc-origin-pulse__form" data-origin-pulse="1">' +
        '<div class="mc-origin-form-row"><label class="mc-origin__label"><span>' + escapeHtml(t('origin_pulse_type', 'Post type')) + '</span><select class="mc-origin__input" name="type" required>' + selectOptions(PULSE_TYPES, draft.type) + '</select></label><label class="mc-origin__label"><span>' + escapeHtml(t('origin_pulse_field', 'Scientific field')) + '</span><select class="mc-origin__input" name="scientificField" required>' + selectOptions(PULSE_FIELDS, draft.scientificField) + '</select></label></div>' +
        '<label class="mc-origin__label"><span>' + escapeHtml(t('origin_pulse_topic', 'Science topic')) + '</span><input class="mc-origin__input" name="topic" maxlength="180" required value="' + escapeHtml(draft.topic) + '" /></label>' +
        '<label class="mc-origin__label"><span>' + escapeHtml(t('origin_pulse_body', 'Discussion')) + '</span><textarea class="mc-origin__textarea" name="body" rows="8" maxlength="12000" required>' + escapeHtml(draft.body) + '</textarea></label>' +
        '<label class="mc-origin__label"><span>' + escapeHtml(t('origin_pulse_source', 'Source URL')) + '</span><input class="mc-origin__input" name="sourceUrl" type="url" placeholder="https://" value="' + escapeHtml(draft.sourceUrl) + '" /><small>' + escapeHtml(t('origin_pulse_source_hint', 'Museum news and exhibition notices need a source URL.')) + '</small></label>' + feedbackHtml() +
        '<div class="mc-origin__actions"><button class="mc-origin__btn mc-origin__btn--primary" type="submit">' + ux('post_session', 'Post to session') + '</button>' + routeAction('/origin/pulse', ux('back_community', 'Back to community')) + '</div><p class="mc-origin__muted">' + ux('draft_autosaved', 'Your draft is kept in this tab as you type.') + '</p></form></section><aside class="mc-origin-editor-aside"><h3>' + ux('discussion_guidance', 'Make your contribution useful') + '</h3><p>' + ux('discussion_guidance_body', 'Describe what you observed, give the relevant context, and link to a source when available. Avoid sensitive locality details.') + '</p>' + sessionNotice() + '</aside></div>';
    }
    if (parsed.pulseView === 'moderation') return emptyCard('lock', ux('review_unavailable', 'Review tools are not connected'), ux('review_unavailable_body', 'This session cannot access a shared moderation queue.'), routeAction('/origin/pulse', ux('back_community', 'Back to community')));
    if (parsed.pulsePostId) {
      var post = state.pulsePosts.filter(function (row) { return row.id === parsed.pulsePostId && isVisiblePulsePost(row); })[0];
      if (!post) return emptyCard('pulse', ux('discussion_missing', 'Discussion not found'), ux('session_missing', 'This item may belong to another browser session.'), routeAction('/origin/pulse', ux('back_community', 'Back to community')));
      var comments = Array.isArray(post.comments) ? post.comments : [];
      return '<div class="mc-origin-pulse-detail">' + pulsePostHtml(post, state, true) + '<section class="mc-origin-pulse-replies"><h2>' + ux('replies', 'Replies') + ' <span class="mc-origin__muted">' + comments.length + '</span></h2>' + (comments.length ? comments.map(function (comment) { return '<article class="mc-origin-workspace-card"><p>' + escapeHtml(comment.body) + '</p><small>' + escapeHtml(displayDate(comment.createdAt)) + '</small></article>'; }).join('') : '<p class="mc-origin__muted">' + ux('first_reply', 'Add the first useful perspective.') + '</p>') + (signed && !state.pulseFrozen ? '<form class="mc-origin__form" data-origin-pulse-reply="1" data-post-id="' + escapeHtml(post.id) + '"><label class="mc-origin__label"><span>' + ux('your_reply', 'Your reply') + '</span><textarea class="mc-origin__textarea" name="body" rows="4" maxlength="6000" required></textarea></label>' + feedbackHtml() + '<button type="submit" class="mc-origin__btn mc-origin__btn--primary">' + ux('reply_session', 'Add reply') + '</button></form>' : signed ? '<p class="mc-origin-notice" data-pulse-state="frozen">' + ux('posting_paused', 'Posting is paused') + '</p>' : authCard('pulse')) + '</section></div>';
    }
    var view = parsed.pulseView || currentSearchParams().get('view') || 'all';
    var search = String(currentSearchParams().get('q') || '').trim();
    var rows = state.pulsePosts.filter(function (post) {
      if (!isVisiblePulsePost(post)) return false;
      if (view === 'saved' && state.savedPulseIds.indexOf(post.id) < 0) return false;
      if (view === 'mine' && post.authorId !== userId()) return false;
      if (view === 'questions' && post.type !== 'scientific_question') return false;
      if (view === 'observations' && post.type !== 'field_observation') return false;
      if (view === 'identification' && post.type !== 'identification_request') return false;
      return !search || (post.topic + ' ' + post.body).toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0;
    });
    var nav = [['all', '/origin/pulse', 'origin_pulse_nav_home', 'All discussions'], ['questions', '/origin/pulse?view=questions', 'origin_pulse_nav_questions', 'Questions'], ['observations', '/origin/pulse?view=observations', 'origin_pulse_nav_observations', 'Observations'], ['identification', '/origin/pulse?view=identification', 'origin_pulse_nav_identification', 'Identification'], ['saved', '/origin/pulse/saved', 'origin_ux_saved_discussions', 'Saved discussions'], ['mine', '/origin/pulse/mine', 'origin_ux_my_discussions', 'My discussions']].map(function (item) { return '<button type="button" class="mc-origin-pulse-nav' + (view === item[0] ? ' is-active' : '') + '"' + (view === item[0] ? ' aria-current="page"' : '') + ' data-origin-route="' + item[1] + '">' + escapeHtml(t(item[2], item[3])) + '</button>'; }).join('');
    return '<div class="mc-origin-pulse-shell" data-origin-pulse-layout="stage8"><nav class="mc-origin-pulse-rail mc-origin-pulse-rail--nav" aria-label="' + escapeHtml(t('origin_nav_pulse', 'Community')) + '">' + nav + '</nav><div class="mc-origin-pulse-main"><header class="mc-origin-workspace-head"><div><p class="mc-origin__kicker">PULSE</p><h2>' + ux('scientific_conversations', 'Scientific conversations') + '</h2></div>' + (signed ? routeAction('/origin/pulse/compose', ux('start_discussion', 'Start a discussion'), true) : '<button type="button" class="mc-origin__btn mc-origin__btn--primary" data-origin-signin="1">' + ux('join_discussion', 'Join the conversation') + '</button>') + '</header><form class="mc-origin-search mc-origin-pulse-search" data-origin-pulse-search="1"><label class="mc-origin-sr-only" for="mc-origin-pulse-q">' + ux('search_discussions', 'Search discussions') + '</label><input id="mc-origin-pulse-q" class="mc-origin__input" name="q" value="' + escapeHtml(search) + '" placeholder="' + ux('search_discussions', 'Search discussions') + '"/><button type="submit" class="mc-origin__btn" data-i18n="origin_search_submit">' + escapeHtml(t('origin_search_submit', 'Search')) + '</button></form><p class="mc-origin__muted" role="status">' + rows.length + ' ' + ux('discussions_count', 'discussions in this view') + '</p>' + (rows.length ? '<div class="mc-origin-pulse-stream">' + rows.map(function (post) { return pulsePostHtml(post, state, false); }).join('') + '</div>' : emptyCard('pulse', search ? ux('no_matches', 'No matching results') : ux('no_discussions', 'Room for the first discovery'), search ? ux('try_search', 'Try another search or browse all discussions.') : ux('no_discussions_body', 'Ask a question, share field notes, or start a source-based discussion in this session.'), routeAction(search || view !== 'all' ? '/origin/pulse' : '/origin/pulse/compose', search || view !== 'all' ? ux('all_discussions', 'All discussions') : ux('start_discussion', 'Start a discussion'), true))) + '</div><aside class="mc-origin-pulse-rail mc-origin-pulse-rail--context"><h3>' + ux('community_principles', 'Built around evidence') + '</h3><p>' + ux('discussion_guidance_body', 'Describe what you observed, give the relevant context, and link to a source when available. Avoid sensitive locality details.') + '</p>' + sessionNotice() + '</aside></div>';
  }

  function makeStudioSlug(title, exhibitions) {
    var normalized = String(title || '').trim().toLowerCase().replace(/[^a-z0-9\u00c0-\uffef-]+/g, '-').replace(/^-+|-+$/g, '');
    var base = Array.from(normalized).slice(0, 80).join('') || 'exhibition';
    var slug = base;
    var suffix = 2;
    while ((exhibitions || []).some(function (row) { return row.slug === slug; })) { slug = base + '-' + suffix; suffix += 1; }
    return slug;
  }

  function studioCardHtml(exhibition) {
    return '<article class="mc-origin-workspace-card mc-origin-studio-card"><div class="mc-origin-studio-card__visual">' + originIcon('studio') + '</div><p class="mc-origin__kicker">' + ux('draft', 'DRAFT') + '</p><h3>' + escapeHtml(exhibition.title) + '</h3><p>' + escapeHtml(exhibition.concept || t('origin_ux_add_concept', 'Add a curatorial concept to shape this exhibition.')) + '</p><p class="mc-origin__muted">' + escapeHtml(displayDate(exhibition.updatedAt || exhibition.createdAt)) + ' · ' + (Array.isArray(exhibition.specimenIds) ? exhibition.specimenIds.length : 0) + ' ' + ux('specimens_count', 'specimens') + '</p><div class="mc-origin__actions">' + routeAction('/origin/studio/' + encodeURIComponent(exhibition.slug) + '/edit', ux('edit_draft', 'Edit draft'), true) + routeAction('/origin/studio/' + encodeURIComponent(exhibition.slug) + '/preview', ux('preview', 'Preview')) + '</div></article>';
  }

  function studioModuleHtml(parsed, state, signed) {
    if (!signed) return authCard('studio');
    var existing = state.exhibitions.filter(function (row) { return row.slug === parsed.exhibitionSlug; })[0];
    if (parsed.exhibitionSlug && !existing) return emptyCard('studio', ux('exhibition_missing', 'Exhibition draft not found'), ux('session_missing', 'This item may belong to another browser session.'), routeAction('/origin/studio', ux('back_studio', 'Back to exhibitions')));
    if (parsed.studioView === 'preview' || parsed.module === 'exhibition') {
      var publicAssets = readAtlasAssets();
      var cards = (existing.specimenIds || []).map(function (id) { var found = findPublicAtlasById(publicAssets, id); return found ? atlasCardHtml(found, state.savedAtlasIds) : '<li class="mc-origin-workspace-card"><p>' + ux('specimen_unavailable', 'This specimen is no longer available in the public catalog.') + '</p></li>'; }).join('');
      return '<article class="mc-origin-exhibition-preview"><div class="mc-origin-workspace-head"><span class="mc-origin-notice">' + ux('private_preview', 'PRIVATE DRAFT PREVIEW') + '</span>' + routeAction('/origin/studio/' + encodeURIComponent(existing.slug) + '/edit', ux('edit_draft', 'Edit draft')) + '</div><header class="mc-origin-exhibition-hero"><p class="mc-origin__kicker">STUDIO / ' + ux('session_exhibition', 'SESSION EXHIBITION') + '</p><h2>' + escapeHtml(existing.title) + '</h2><p class="mc-origin__lead">' + escapeHtml(existing.concept || '') + '</p></header><div class="mc-origin-exhibition-narrative">' + escapeHtml(existing.body || t('origin_ux_narrative_empty', 'Your exhibition narrative will appear here.')) + '</div>' + (cards ? '<ul class="mc-origin-atlas-grid">' + cards + '</ul>' : emptyCard('atlas', ux('no_source_specimens', 'No source specimens selected'), ux('add_source_specimens', 'Add public ATLAS specimens in the draft editor.'))) + sessionNotice() + '</article>';
    }
    if (parsed.studioView === 'new' || parsed.studioView === 'edit') {
      var draftKey = existing ? existing.slug : 'new';
      var draft = (Object.prototype.hasOwnProperty.call(state.studioEditorDrafts, draftKey) ? state.studioEditorDrafts[draftKey] : null) || existing || {};
      var assets = readAtlasAssets();
      var specimenIds = draft.specimenIds || [];
      var selection = assets.map(function (asset) { return '<label class="mc-origin-specimen-option"><input type="checkbox" name="specimenIds" value="' + escapeHtml(asset.id) + '"' + (specimenIds.indexOf(asset.id) >= 0 ? ' checked' : '') + '/><span><strong><i lang="la">' + escapeHtml(asset.scientificName) + '</i></strong><small>' + escapeHtml(asset.id) + (asset.metadata.license ? ' · ' + escapeHtml(asset.metadata.license) : '') + '</small></span></label>'; }).join('');
      return '<div class="mc-origin-studio" data-origin-studio="stage9" data-studio-view="' + parsed.studioView + '"><div class="mc-origin-editor-grid"><section><header class="mc-origin-workspace-head"><div><p class="mc-origin__kicker">STUDIO / ' + ux('draft_editor', 'DRAFT EDITOR') + '</p><h2>' + (existing ? ux('edit_exhibition', 'Shape your exhibition') : ux('new_exhibition', 'Create an exhibition draft')) + '</h2></div></header><form class="mc-origin__form" data-origin-studio="1" data-studio-slug="' + escapeHtml(existing ? existing.slug : '') + '"><label class="mc-origin__label"><span>' + ux('exhibition_title', 'Exhibition title') + '</span><input class="mc-origin__input" name="title" maxlength="160" required value="' + escapeHtml(draft.title) + '" /></label><label class="mc-origin__label"><span>' + ux('curatorial_concept', 'Curatorial concept') + '</span><textarea class="mc-origin__textarea" name="concept" rows="3" maxlength="2000">' + escapeHtml(draft.concept) + '</textarea></label><fieldset class="mc-origin-specimen-picker"><legend>' + ux('source_specimens', 'Source specimens') + '</legend><p class="mc-origin__muted">' + ux('source_specimens_hint', 'Choose public ATLAS records to include in your private preview. Selection does not grant publishing rights.') + '</p>' + (selection || '<p>' + ux('catalog_empty', 'The public specimen catalog is empty in this session.') + '</p>') + '</fieldset><label class="mc-origin__label"><span>' + ux('exhibition_narrative', 'Exhibition narrative') + '</span><textarea class="mc-origin__textarea" name="body" rows="8" maxlength="20000">' + escapeHtml(draft.body) + '</textarea></label>' + feedbackHtml() + '<div class="mc-origin__actions"><button type="submit" class="mc-origin__btn mc-origin__btn--primary">' + ux('save_preview', 'Save and preview') + '</button>' + routeAction('/origin/studio', ux('back_studio', 'Back to exhibitions')) + '</div><p class="mc-origin__muted">' + ux('draft_autosaved', 'Your draft is kept in this tab as you type.') + '</p></form></section><aside class="mc-origin-editor-aside"><h3>' + ux('curation_guidance', 'Build a clear narrative') + '</h3><ol><li>' + ux('curation_step_one', 'Name the question your exhibition explores.') + '</li><li>' + ux('curation_step_two', 'Choose the specimens that support your story.') + '</li><li>' + ux('curation_step_three', 'Add context and review your private preview.') + '</li></ol>' + sessionNotice() + '</aside></div></div>';
    }
    return '<section class="mc-origin-studio" data-origin-studio="stage9" data-studio-view="library"><header class="mc-origin-workspace-head"><div><p class="mc-origin__kicker">STUDIO</p><h2>' + ux('your_exhibitions', 'Your exhibitions') + '</h2><p class="mc-origin__muted">' + state.exhibitions.length + ' ' + ux('drafts_count', 'drafts in this session') + '</p></div>' + routeAction('/origin/studio/new', ux('new_exhibition', 'Create an exhibition draft'), true) + '</header>' + (state.exhibitions.length ? '<div class="mc-origin-workspace-grid">' + state.exhibitions.map(studioCardHtml).join('') + '</div>' : emptyCard('studio', ux('exhibition_empty_title', 'Turn a collection into a story'), ux('exhibition_empty_body', 'Start with a title, select source specimens, and arrange your curatorial narrative.'), routeAction('/origin/studio/new', ux('new_exhibition', 'Create an exhibition draft'), true))) + sessionNotice() + '</section>';
  }

  function museumModuleHtml(parsed, state, signed) {
    if (!signed) return authCard('my');
    var view = parsed.myView || 'overview';
    var navItems = [['overview', 'origin_my_overview', 'Overview'], ['saved', 'origin_my_saved', 'Saved'], ['notes', 'origin_atlas_notes', 'Knowledge notes'], ['exhibitions', 'origin_my_exhibitions', 'My exhibitions'], ['activity', 'origin_my_pulse', 'PULSE activity']];
    if (!navItems.some(function (row) { return row[0] === view; })) return emptyCard('my', ux('section_missing', 'Workspace section not found'), ux('choose_workspace', 'Choose a section in your workspace.'), routeAction('/origin/my', escapeHtml(t('origin_my_overview', 'Overview'))));
    var assets = readAtlasAssets();
    var savedAssets = state.savedAtlasIds.map(function (id) { return findPublicAtlasById(assets, id); }).filter(Boolean);
    var mine = state.pulsePosts.filter(function (post) { return post.authorId === userId(); });
    var body = '';
    if (view === 'overview') {
      var metrics = [['saved', savedAssets.length, 'origin_my_saved', 'Saved specimens'], ['notes', state.atlasNotes.length, 'origin_atlas_notes', 'Knowledge notes'], ['exhibitions', state.exhibitions.length, 'origin_my_drafts', 'Draft exhibitions'], ['activity', mine.length, 'origin_ux_my_discussions', 'My discussions']];
      body = '<div class="mc-origin-museum__summary">' + metrics.map(function (item) { return '<button type="button" class="mc-origin__card mc-origin-museum-metric" data-origin-route="/origin/my/' + item[0] + '"><span>' + escapeHtml(t(item[2], item[3])) + '</span><strong>' + item[1] + '</strong><small>' + ux('view_items', 'View items') + ' ↗</small></button>'; }).join('') + '</div><section><header class="mc-origin-workspace-head"><h2>' + escapeHtml(t('origin_my_continue', 'Continue work')) + '</h2></header>' + (state.exhibitions.length ? '<div class="mc-origin-workspace-grid">' + state.exhibitions.slice(0, 3).map(studioCardHtml).join('') + '</div>' : emptyCard('my', ux('workspace_ready', 'Your workspace is ready'), ux('workspace_ready_body', 'Save a specimen from ATLAS or create your first exhibition draft.'), routeAction('/origin/atlas', escapeHtml(t('origin_explore_specimens', 'Explore specimens')), true))) + '</section>';
    } else if (view === 'saved') body = savedAssets.length ? '<ul class="mc-origin-atlas-grid">' + savedAssets.map(function (asset) { return atlasCardHtml(asset, state.savedAtlasIds); }).join('') + '</ul>' : emptyCard('bookmark', ux('saved_empty', 'Keep your discoveries close'), ux('saved_empty_body', 'Use Save to My Museum in a specimen card menu to build your reading list.'), routeAction('/origin/atlas', escapeHtml(t('origin_explore_specimens', 'Explore specimens')), true));
    else if (view === 'notes') body = state.atlasNotes.length ? '<div class="mc-origin-workspace-grid">' + state.atlasNotes.map(function (note) { var asset = findPublicAtlasById(assets, note.specimenId); return '<article class="mc-origin-workspace-card"><p class="mc-origin__kicker">' + escapeHtml(note.specimenId) + '</p><h2>' + escapeHtml(asset ? asset.scientificName : note.specimenId) + '</h2><p>' + escapeHtml(pulseExcerpt(note.body)) + '</p>' + routeAction('/origin/atlas/' + encodeURIComponent(note.specimenId), ux('open_notes', 'Open notes')) + '</article>'; }).join('') + '</div>' : emptyCard('atlas', ux('notes_empty', 'Capture what matters'), ux('notes_empty_body', 'Open a specimen record to write a research note for this session.'), routeAction('/origin/atlas', escapeHtml(t('origin_explore_specimens', 'Explore specimens')), true));
    else if (view === 'exhibitions') body = state.exhibitions.length ? '<div class="mc-origin-workspace-grid">' + state.exhibitions.map(studioCardHtml).join('') + '</div>' : emptyCard('studio', ux('exhibition_empty_title', 'Turn a collection into a story'), ux('exhibition_empty_body', 'Start with a title, select source specimens, and arrange your curatorial narrative.'), routeAction('/origin/studio/new', ux('new_exhibition', 'Create an exhibition draft'), true));
    else body = mine.length ? '<div class="mc-origin-pulse-stream">' + mine.map(function (post) { return pulsePostHtml(post, state, false); }).join('') + '</div>' : emptyCard('pulse', ux('no_discussions', 'Room for the first discovery'), ux('no_discussions_body', 'Ask a question, share field notes, or start a source-based discussion in this session.'), routeAction('/origin/pulse/compose', ux('start_discussion', 'Start a discussion'), true));
    return '<section class="mc-origin-museum" data-origin-museum="stage9" data-museum-session="1"><div class="mc-origin-museum__layout"><nav class="mc-origin-museum__nav" aria-label="' + escapeHtml(t('origin_my_title', 'My Museum')) + '">' + navItems.map(function (item) { return '<button type="button" class="mc-origin__nav-link' + (view === item[0] ? ' is-active' : '') + '"' + (view === item[0] ? ' aria-current="page"' : '') + ' data-origin-route="/origin/my' + (item[0] === 'overview' ? '' : '/' + item[0]) + '">' + escapeHtml(t(item[1], item[2])) + '</button>'; }).join('') + '</nav><div class="mc-origin-museum__main">' + body + sessionNotice() + '</div></div></section>';
  }

  function moduleHtml(parsed, state, signed) {
    var i;
    if (parsed.module === 'pulse') return pulseModuleHtml(parsed, state, signed);
    if (parsed.module === 'studio' || parsed.module === 'exhibition') return studioModuleHtml(parsed, state, signed);
    if (parsed.module === 'my') return museumModuleHtml(parsed, state, signed);
    if (parsed.module === 'not-found') {
      return (
        '<div class="mc-origin__missing"><h2 data-i18n="origin_not_found_title">This ORIGIN page was not found</h2>' +
        '<p data-i18n="origin_not_found_body">This URL is not an implemented ORIGIN destination. Return to ORIGIN home.</p>' +
        '<button type="button" class="mc-origin__nav-link" data-origin-route="' +
        PREFIX +
        '" data-i18n="origin_wordmark">ORIGIN</button></div>'
      );
    }
    if (parsed.module === 'atlas') {
      var assets = readAtlasAssets();
      if (parsed.specimenId) return atlasArticleHtml(parsed, state, signed, assets);
      return atlasDiscoveryHtml(parsed, assets);
    }
    if (parsed.module === 'suggest' || parsed.module === 'collaborate' || parsed.module === 'review') {
      return (
        '<div class="mc-origin-empty" role="status"><h2 data-i18n="origin_collab_surface_title">ATLAS collaboration</h2>' +
        '<p data-i18n="origin_collab_surface_body">Proposal editing and holder review run in the ORIGIN web session with the specimen catalogue. This surface does not write canonical specimen records and does not invent pending proposals.</p>' +
        '<button type="button" class="mc-origin__btn mc-origin__btn--primary" data-origin-route="/origin/atlas" data-i18n="origin_explore_specimens">Explore specimens</button></div>'
      );
    }
    return originDiscoverHtml(signed, state);
  }

  var SCROLL_MEM = {};
  var ORIGIN_NAV_PUSHES = 0;
  var NAV_DIRECTION = 'push';

  function originNavActiveId(parsed) {
    if (parsed.module === 'not-found') return null;
    if (parsed.module === 'exhibition') return 'studio';
    if (parsed.module === 'suggest' || parsed.module === 'collaborate') return 'atlas';
    if (parsed.module === 'review') return 'my';
    if (parsed.module === 'home' || parsed.module === 'atlas' || parsed.module === 'pulse' || parsed.module === 'studio' || parsed.module === 'my') {
      return parsed.module;
    }
    return 'home';
  }

  function originShowsBack(parsed) {
    if (parsed.module === 'home' || parsed.module === 'not-found') return false;
    if (parsed.module === 'atlas') return Boolean(parsed.specimenId);
    if (parsed.module === 'pulse') return Boolean(parsed.pulsePostId || parsed.pulseView);
    if (parsed.module === 'studio') return Boolean(parsed.studioView);
    if (parsed.module === 'my') return Boolean(parsed.myView);
    return parsed.module === 'exhibition' || parsed.module === 'suggest' || parsed.module === 'collaborate' || parsed.module === 'review';
  }

  function originCrumbTrail(parsed) {
    if (parsed.module === 'home') return [];
    if (parsed.module === 'not-found') return [{ href: PREFIX, navId: 'home' }];
    if (!originShowsBack(parsed)) return [];
    var moduleId = originNavActiveId(parsed) || 'home';
    var crumbs = [{ href: PREFIX, navId: 'home' }];
    if (moduleId !== 'home') crumbs.push({ href: PREFIX + '/' + moduleId, navId: moduleId });
    return crumbs;
  }

  function originBackFallback(parsed) {
    var list = '';
    try {
      list = String((loadState() && loadState().lastAtlasListHref) || '');
    } catch (eList) {}
    if (parsed.module === 'atlas' && parsed.specimenId) return list || PREFIX + '/atlas';
    if (parsed.module === 'suggest' || parsed.module === 'collaborate') {
      return parsed.specimenId ? PREFIX + '/atlas/' + encodeURIComponent(parsed.specimenId) : PREFIX + '/atlas';
    }
    if (parsed.module === 'pulse' && (parsed.pulsePostId || parsed.pulseView)) return PREFIX + '/pulse';
    if (parsed.module === 'exhibition') return PREFIX + '/studio';
    if (parsed.module === 'studio' && parsed.studioView) return PREFIX + '/studio';
    if (parsed.module === 'my' && parsed.myView) return PREFIX + '/my';
    if (parsed.module === 'review') return PREFIX + '/my';
    return PREFIX;
  }

  function pageChromeCopy(parsed) {
    var active = originNavActiveId(parsed);
    if (parsed.module === 'atlas' && parsed.specimenId) {
      return {
        titleKey: 'origin_page_atlas_specimen',
        title: 'Specimen record',
        leadKey: 'origin_atlas_lead',
        lead: 'ATLAS is collaborative specimen knowledge.',
        crumbKey: 'origin_nav_atlas',
        crumb: 'Specimens',
      };
    }
    if (parsed.module === 'pulse' && (parsed.pulsePostId || parsed.pulseView)) {
      return {
        titleKey: 'origin_page_pulse_post',
        title: 'Discussion',
        leadKey: 'origin_pulse_lead',
        lead: 'PULSE is a science-only community.',
        crumbKey: 'origin_nav_pulse',
        crumb: 'Community',
      };
    }
    if (parsed.module === 'exhibition') {
      return {
        titleKey: 'origin_page_exhibition',
        title: 'Exhibition',
        leadKey: 'origin_studio_lead',
        lead: 'STUDIO is user-curated digital exhibition.',
        crumbKey: 'origin_nav_studio',
        crumb: 'Exhibitions',
      };
    }
    if (active === 'atlas') {
      return {
        titleKey: 'origin_atlas_title',
        title: 'ATLAS specimen discovery',
        leadKey: 'origin_atlas_intro',
        lead: 'Search public specimen knowledge by scientific name, common name, catalog number, and taxonomy.',
        crumbKey: 'origin_nav_atlas',
        crumb: 'Specimens',
      };
    }
    if (active === 'pulse') {
      return {
        titleKey: 'origin_pulse_title',
        title: 'PULSE',
        leadKey: 'origin_pulse_lead',
        lead: 'PULSE is a science-only community.',
        crumbKey: 'origin_nav_pulse',
        crumb: 'Community',
      };
    }
    if (active === 'studio') {
      return {
        titleKey: 'origin_studio_title_page',
        title: 'STUDIO',
        leadKey: 'origin_studio_lead',
        lead: 'STUDIO is user-curated digital exhibition.',
        crumbKey: 'origin_nav_studio',
        crumb: 'Exhibitions',
      };
    }
    if (active === 'my') {
      return {
        titleKey: 'origin_my_title',
        title: 'My Museum',
        leadKey: 'origin_my_lead',
        lead: 'Pick up your exploration, notes, and curatorial work.',
        crumbKey: 'origin_nav_my',
        crumb: 'My Museum',
      };
    }
    return {
      titleKey: 'origin_wordmark',
      title: 'ORIGIN',
      leadKey: 'origin_hero_explain',
      lead: 'Discover specimens, improve scientific records together, and build a digital exhibition of your own.',
      crumbKey: 'origin_wordmark',
      crumb: 'ORIGIN',
    };
  }

  function crumbNavCopy(navId) {
    if (navId === 'atlas') return { key: 'origin_nav_atlas', label: 'Specimens' };
    if (navId === 'pulse') return { key: 'origin_nav_pulse', label: 'Community' };
    if (navId === 'studio') return { key: 'origin_nav_studio', label: 'Exhibitions' };
    if (navId === 'my') return { key: 'origin_nav_my', label: 'My Museum' };
    return { key: 'origin_wordmark', label: 'ORIGIN' };
  }

  function pageheadHtml(parsed, signed) {
    var copy = pageChromeCopy(parsed), landing = parsed.module === 'home', active = originNavActiveId(parsed);
    var items = [['home', PREFIX, 'origin_nav_home', 'Explore'], ['atlas', PREFIX + '/atlas', 'origin_nav_atlas', 'Specimens'], ['pulse', PREFIX + '/pulse', 'origin_nav_pulse', 'Community'], ['studio', PREFIX + '/studio', 'origin_nav_studio', 'Exhibitions'], ['my', PREFIX + '/my', 'origin_nav_my', 'My Museum']];
    var crumbs = originCrumbTrail(parsed).map(function (crumb) {
      var label = crumbNavCopy(crumb.navId);
      return '<button type="button" class="mc-origin__crumb-link" data-origin-route="' + escapeHtml(crumb.href) + '">' + escapeHtml(t(label.key, label.label)) + '</button><span aria-hidden="true">/</span>';
    }).join('');
    return '<header class="mc-origin__pagehead' + (landing ? ' mc-origin__pagehead--landing' : '') + '" data-origin-chrome="stage5" data-origin-ia="layers-3">' +
      '<div class="mc-origin__masthead"><button type="button" class="mc-origin__brand" data-origin-route="/origin" aria-label="' + escapeHtml(t('origin_title', 'MCurator ORIGIN')) + '"><span class="mc-origin__brand-mark" aria-hidden="true"><img class="mc-origin__brand-logo mc-origin__brand-logo--dark" src="brand/mark-app.jpg" alt="" width="40" height="40" /><img class="mc-origin__brand-logo mc-origin__brand-logo--light" src="brand/mark-detail-light.jpg" alt="" width="40" height="40" /></span><span>ORIGIN<small data-i18n="origin_brand_caption">' + escapeHtml(t('origin_brand_caption', 'THE LIVING MUSEUM')) + '</small></span></button>' +
      '<nav class="mc-origin__local-nav" data-origin-local-nav="stage5" data-origin-nav-layer="module" aria-label="' + escapeHtml(t('origin_local_nav', 'ORIGIN local navigation')) + '">' +
      items.map(function (item) { return '<button type="button" class="mc-origin__nav-link' + (active === item[0] ? ' is-active' : '') + '" data-origin-route="' + item[1] + '" data-origin-nav-item="' + item[0] + '"' + (active === item[0] ? ' aria-current="page"' : '') + '>' + originIcon(item[0]) + '<span data-i18n="' + item[2] + '">' + escapeHtml(t(item[2], item[3])) + '</span></button>'; }).join('') +
      '</nav><div class="mc-origin__pagehead-meta">' + (signed ? '<span class="mc-origin__status-chip" data-origin-session="in">' + escapeHtml(t('origin_status_member_short', 'Signed in')) + '</span>' : '<button type="button" class="mc-origin__back" data-origin-signin="1">' + originIcon('plus') + ux('join_origin', 'Join ORIGIN') + '</button>') + '</div></div>' +
      (crumbs ? '<div class="mc-origin__pagehead-row"><nav class="mc-origin__crumb" aria-label="' + escapeHtml(t('origin_page_context_aria', 'ORIGIN location')) + '">' + crumbs + '<span aria-current="page">' + escapeHtml(t(copy.titleKey, copy.title)) + '</span></nav>' + routeAction(originBackFallback(parsed), escapeHtml(t('origin_back', 'Back'))) + '</div>' : '') +
      (landing ? '<div id="mc-origin-page-title" class="mc-origin-sr" tabindex="-1">' + escapeHtml(t('origin_wordmark', 'ORIGIN')) + '</div>' : '<div class="mc-origin__pagehead-copy"><p class="mc-origin__kicker">ORIGIN / ' + String(active || 'EXPLORE').toUpperCase() + '</p><h1 id="mc-origin-page-title" class="mc-origin__title" tabindex="-1">' + escapeHtml(t(copy.titleKey, copy.title)) + '</h1><p class="mc-origin__pagehead-lead">' + escapeHtml(t(copy.leadKey, copy.lead)) + '</p></div>') + '</header>';
  }

  function syncOriginHeaderOffset(root) {
    var header =
      global.document.querySelector('[data-global-header]') ||
      global.document.querySelector('.mc-global-header-root') ||
      global.document.querySelector('.mc-global-header');
    var height = header ? Math.round(header.getBoundingClientRect().height) : 0;
    var px = (height > 0 ? height : 88) + 'px';
    if (root && root.style) root.style.setProperty('--mc-global-header-height', px);
    var originEl = root && root.querySelector ? root.querySelector('.mc-origin') : null;
    if (originEl) originEl.style.setProperty('--mc-global-header-height', px);
    return height;
  }

  function rememberScroll() {
    var sh = global.document.getElementById('welcomeShell');
    if (sh) SCROLL_MEM[currentHashKey()] = sh.scrollTop;
  }

  function restoreScrollOrFocus(root, parsed) {
    var sh = global.document.getElementById('welcomeShell');
    var path = currentHashKey();
    var restored = false;
    if (parsed.module === 'atlas' && !parsed.specimenId && sh) {
      try {
        var listState = loadState();
        if (listState.lastAtlasListScroll > 0) {
          sh.scrollTop = listState.lastAtlasListScroll;
          restored = true;
        }
      } catch (eScroll) {}
    }
    if (!restored) {
      if (NAV_DIRECTION === 'pop' && SCROLL_MEM[path] != null && sh) {
        sh.scrollTop = SCROLL_MEM[path];
      } else if (sh) {
        sh.scrollTop = 0;
      }
    }
    var heading = root.querySelector('#mc-origin-page-title');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      try {
        heading.focus({ preventScroll: true });
      } catch (eFocus) {
        heading.focus();
      }
      // Focus must not override the restored list or history scroll position.
    }
    NAV_DIRECTION = 'push';
  }

  function bindLocalNav(root) {
    var nav = root.querySelector('[data-origin-local-nav]');
    if (!nav) return;
    var active = nav.querySelector('[aria-current="page"]');
    if (active && active.scrollIntoView) active.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    if (nav.__originNavBound) return;
    nav.__originNavBound = true;
    nav.addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft' && ev.key !== 'Home' && ev.key !== 'End') return;
      var items = nav.querySelectorAll('[data-origin-nav-item]');
      if (!items.length) return;
      var index = Array.prototype.indexOf.call(items, ev.target);
      if (index < 0) return;
      ev.preventDefault();
      var next = index;
      if (ev.key === 'ArrowRight') next = (index + 1) % items.length;
      if (ev.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
      if (ev.key === 'Home') next = 0;
      if (ev.key === 'End') next = items.length - 1;
      items[next].focus();
    });
  }

  function originSurfaceForModule(module) {
    if (module === 'exhibition' || module === 'home') return 'immersive';
    if (
      module === 'studio' ||
      module === 'my' ||
      module === 'suggest' ||
      module === 'collaborate' ||
      module === 'review'
    ) {
      return 'workspace';
    }
    return 'paper';
  }

  function render(root, rawPath) {
    releaseAtlasPreview();
    var parsed = parseOriginPath(rawPath || currentHashPath());
    if (parsed.canonical !== PREFIX && parsed.canonical.indexOf(PREFIX + '/') !== 0) {
      parsed = parseOriginPath(PREFIX);
    }
    var state = loadState();
    var signed = isSignedIn();
    var landing = parsed.module === 'home';
    var surface = originSurfaceForModule(parsed.module);
    if (parsed.module === 'atlas' && !parsed.specimenId) {
      try {
        var remembered = loadState();
        var qs = '';
        try {
          var params = currentSearchParams();
          params.delete('peek');
          qs = String(params.toString() || '');
        } catch (eQs) {}
        var nextHref = parsed.canonical + (qs ? '?' + qs : '');
        if (remembered.lastAtlasListHref !== nextHref) remembered.lastAtlasListScroll = 0;
        remembered.lastAtlasListHref = nextHref;
        saveState(remembered);
      } catch (eRemember) {}
    }
    root.innerHTML =
      '<div class="mc-origin" data-mc-origin="1" data-origin-nav="stage5" data-origin-surface="' +
      surface +
      '" data-origin-module="' + parsed.module + '">' +
      '<a class="mc-origin__skip" href="#mc-origin-content" data-i18n="origin_skip">Skip to ORIGIN content</a>' +
      '<div class="mc-origin__shell">' +
      pageheadHtml(parsed, signed) +
      '<div id="mc-origin-content" class="mc-origin__content' +
      (landing ? ' mc-origin__content--landing' : '') +
      '" tabindex="-1">' +
      moduleHtml(parsed, state, signed) +
      '</div></div></div>';
    try {
      if (typeof global.applyI18n === 'function') global.applyI18n();
    } catch (eI18n) {}
    if (root.querySelector('[data-origin-mineral]')) paintMineral(root, mineralDefs()[0].key);
    bindLocalNav(root);
    syncOriginHeaderOffset(root);
    restoreScrollOrFocus(root, parsed);
    activateAtlasPreview(root);
  }

  var atlasPreviewSession = { openerId: '', keyHandler: null, focusHandler: null, background: [], scroll: [] };

  function releaseAtlasPreview() {
    if (atlasPreviewSession.keyHandler) global.document.removeEventListener('keydown', atlasPreviewSession.keyHandler, true);
    if (atlasPreviewSession.focusHandler) global.document.removeEventListener('focusin', atlasPreviewSession.focusHandler, true);
    atlasPreviewSession.background.forEach(function (row) {
      row.element.inert = row.inert;
      if (row.inertAttribute === null) row.element.removeAttribute('inert');
      else row.element.setAttribute('inert', row.inertAttribute);
      if (row.ariaHidden === null) row.element.removeAttribute('aria-hidden');
      else row.element.setAttribute('aria-hidden', row.ariaHidden);
    });
    atlasPreviewSession.scroll.forEach(function (row) { row.element.style.overflow = row.overflow; });
    atlasPreviewSession = { openerId: '', keyHandler: null, focusHandler: null, background: [], scroll: [] };
  }

  function activateAtlasPreview(root) {
    var overlay = root && root.querySelector('[data-origin-atlas-preview]');
    var panel = overlay && overlay.querySelector('[role="dialog"]');
    if (!panel) return;
    atlasPreviewSession.openerId = parseAtlasPeek(currentSearchParams());
    panel.setAttribute('tabindex', '-1');
    // Preserve every pre-existing accessibility attribute when isolating the dialog.
    var current = overlay;
    while (current && current.parentElement) {
      var parent = current.parentElement;
      Array.prototype.forEach.call(parent.children, function (sibling) {
        if (sibling === current || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName || '')) return;
        atlasPreviewSession.background.push({ element: sibling, inert: Boolean(sibling.inert), inertAttribute: sibling.getAttribute('inert'), ariaHidden: sibling.getAttribute('aria-hidden') });
        sibling.inert = true;
        sibling.setAttribute('inert', '');
        sibling.setAttribute('aria-hidden', 'true');
      });
      if (parent === global.document.body) break;
      current = parent;
    }
    [global.document.body, global.document.getElementById('welcomeShell')].forEach(function (element) {
      if (!element || !element.style || atlasPreviewSession.scroll.some(function (row) { return row.element === element; })) return;
      atlasPreviewSession.scroll.push({ element: element, overflow: element.style.overflow });
      element.style.overflow = 'hidden';
    });
    function focusFirst() {
      var first = atlasFilterFocusables(panel)[0] || panel;
      first.focus({ preventScroll: true });
    }
    atlasPreviewSession.keyHandler = function (ev) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        closeAtlasPreview();
      } else trapAtlasFilterTab(ev, panel);
    };
    atlasPreviewSession.focusHandler = function (ev) { if (!panel.contains(ev.target)) focusFirst(); };
    global.document.addEventListener('keydown', atlasPreviewSession.keyHandler, true);
    global.document.addEventListener('focusin', atlasPreviewSession.focusHandler, true);
    focusFirst();
  }

  var ATLAS_FILTER_FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var atlasFilterSession = {
    opener: null,
    keyHandler: null,
    changeHandler: null,
    prevOverflow: '',
    locked: false,
    inertEl: null,
    suggestIndex: -1,
    applied: null,
  };

  function atlasFilterFocusables(panel) {
    if (!panel || !panel.querySelectorAll) return [];
    return Array.prototype.filter.call(panel.querySelectorAll(ATLAS_FILTER_FOCUSABLE), function (el) {
      return !el.disabled && !el.hidden;
    });
  }

  function trapAtlasFilterTab(ev, panel) {
    if (!ev || ev.key !== 'Tab' || !panel) return;
    var list = atlasFilterFocusables(panel);
    if (!list.length) {
      ev.preventDefault();
      return;
    }
    var first = list[0];
    var last = list[list.length - 1];
    var active = global.document.activeElement;
    if (ev.shiftKey) {
      if (active === first || !panel.contains(active)) {
        ev.preventDefault();
        last.focus();
      }
    } else if (active === last || !panel.contains(active)) {
      ev.preventDefault();
      first.focus();
    }
  }

  function lockAtlasFilterScroll() {
    var body = global.document && global.document.body;
    if (!body || atlasFilterSession.locked) return;
    atlasFilterSession.prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    body.setAttribute('data-origin-atlas-filter-lock', '1');
    atlasFilterSession.locked = true;
  }

  function unlockAtlasFilterScroll() {
    var body = global.document && global.document.body;
    if (!body || !atlasFilterSession.locked) return;
    body.style.overflow = atlasFilterSession.prevOverflow || '';
    body.removeAttribute('data-origin-atlas-filter-lock');
    atlasFilterSession.locked = false;
    atlasFilterSession.prevOverflow = '';
  }

  function setAtlasFilterInert(on) {
    var root = global.document && global.document.getElementById('mcOriginRoot');
    var live = root && root.querySelector('.mc-origin-atlas__live');
    if (!live) return;
    if (on) {
      live.setAttribute('inert', '');
      live.setAttribute('aria-hidden', 'true');
      live.inert = true;
      atlasFilterSession.inertEl = live;
    } else {
      live.removeAttribute('inert');
      live.removeAttribute('aria-hidden');
      live.inert = false;
      atlasFilterSession.inertEl = null;
    }
  }

  function readAtlasFilterFormQuery(form) {
    var filterQuery = parseAtlasSearchParams(currentSearchParams());
    if (!form) return filterQuery;
    filterQuery.field = String((form.field && form.field.value) || '');
    filterQuery.taxon = String((form.taxon && form.taxon.value) || '');
    filterQuery.type = String((form.type && form.type.value) || '');
    filterQuery.period = String((form.period && form.period.value) || '');
    filterQuery.region = String((form.region && form.region.value) || '');
    filterQuery.media = form.media && form.media.checked ? '1' : '';
    filterQuery.verified = form.verified && form.verified.checked ? '1' : '';
    filterQuery.page = 1;
    return filterQuery;
  }

  function hydrateAtlasFilterForm(form, query) {
    if (!form || !query) return;
    if (form.field) form.field.value = query.field || '';
    if (form.taxon) form.taxon.value = query.taxon || '';
    if (form.type) form.type.value = query.type || '';
    if (form.period) form.period.value = query.period || '';
    if (form.region) form.region.value = query.region || '';
    if (form.collab) form.collab.value = query.collab || '';
    if (form.media) form.media.checked = query.media === '1';
    if (form.verified) form.verified.checked = query.verified === '1';
  }

  function closeAtlasSuggestions() {
    var panel = global.document && global.document.getElementById('mc-origin-atlas-suggest');
    var input = global.document && global.document.getElementById('mc-origin-atlas-search');
    if (panel) {
      panel.hidden = true;
      panel.setAttribute('hidden', '');
    }
    if (input) input.setAttribute('aria-expanded', 'false');
    atlasFilterSession.suggestIndex = -1;
  }

  function atlasSuggestMove(index, key, length) {
    var n = Number(length) || 0;
    if (!n) return -1;
    if (key === 'Escape') return -1;
    if (key === 'Home') return 0;
    if (key === 'End') return n - 1;
    if (key === 'ArrowDown') return (Number(index) + 1 + n) % n;
    if (key === 'ArrowUp') return Number(index) <= 0 ? n - 1 : Number(index) - 1;
    return Number(index);
  }

  function updateAtlasFilterApplyLabel(form) {
    var root = global.document && global.document.getElementById('mcOriginRoot');
    if (!root || !form) return;
    var query = readAtlasFilterFormQuery(form);
    var n = applyAtlasSearch(typeof readAtlasAssets === 'function' ? readAtlasAssets() : [], query).length;
    var label = t('origin_atlas_apply_results', 'Show {n} results').replace('{n}', String(n));
    var nodes = root.querySelectorAll
      ? root.querySelectorAll('[data-origin-atlas-sheet-apply], [data-origin-atlas-rail-apply]')
      : [root.querySelector('[data-origin-atlas-sheet-apply]')].filter(Boolean);
    Array.prototype.forEach.call(nodes, function (btn) {
      if (btn) btn.textContent = label;
    });
  }

  function openAtlasFilterSheet(opener) {
    var root = global.document && global.document.getElementById('mcOriginRoot');
    var sheet = root && root.querySelector('.mc-origin-atlas-sheet');
    var panel = sheet && sheet.querySelector('.mc-origin-atlas-sheet__panel');
    if (!sheet || !panel) return false;
    closeAtlasSuggestions();
    closeAtlasFilterSheet('reopen');
    atlasFilterSession.opener = opener || global.document.activeElement;
    try {
      atlasFilterSession.applied = parseAtlasSearchParams(currentSearchParams());
    } catch (eApplied) {
      atlasFilterSession.applied = parseAtlasSearchParams('');
    }
    sheet.hidden = false;
    sheet.removeAttribute('hidden');
    var openBtn = root.querySelector('[data-origin-atlas-sheet-open]');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    lockAtlasFilterScroll();
    setAtlasFilterInert(true);
    atlasFilterSession.keyHandler = function (ev) {
      if (sheet.hidden) return;
      if (ev.key === 'Escape') {
        ev.preventDefault();
        closeAtlasFilterSheet('escape');
        return;
      }
      trapAtlasFilterTab(ev, panel);
    };
    global.document.addEventListener('keydown', atlasFilterSession.keyHandler, true);
    var form = panel.querySelector('[data-origin-atlas-sheet-form]');
    if (form) {
      hydrateAtlasFilterForm(form, atlasFilterSession.applied);
      atlasFilterSession.changeHandler = function () {
        updateAtlasFilterApplyLabel(form);
      };
      form.addEventListener('change', atlasFilterSession.changeHandler);
      form.addEventListener('input', atlasFilterSession.changeHandler);
      updateAtlasFilterApplyLabel(form);
    }
    var closeBtn = panel.querySelector('[data-origin-atlas-sheet-close="close"]');
    var first = closeBtn || atlasFilterFocusables(panel)[0];
    if (first && first.focus) {
      try {
        first.focus({ preventScroll: true });
      } catch (eFocus) {
        first.focus();
      }
    }
    return true;
  }

  function closeAtlasFilterSheet(reason) {
    var root = global.document && global.document.getElementById('mcOriginRoot');
    var sheet = root && root.querySelector('.mc-origin-atlas-sheet');
    var opener = atlasFilterSession.opener;
    if (atlasFilterSession.keyHandler) {
      global.document.removeEventListener('keydown', atlasFilterSession.keyHandler, true);
      atlasFilterSession.keyHandler = null;
    }
    if (atlasFilterSession.changeHandler) {
      var form = root && root.querySelector('[data-origin-atlas-sheet-form]');
      if (form) {
        form.removeEventListener('change', atlasFilterSession.changeHandler);
        form.removeEventListener('input', atlasFilterSession.changeHandler);
      }
      atlasFilterSession.changeHandler = null;
    }
    if (sheet) {
      sheet.hidden = true;
      sheet.setAttribute('hidden', '');
    }
    if (reason === 'close' || reason === 'cancel' || reason === 'escape' || reason === 'backdrop') {
      var restoreForm = root && root.querySelector('[data-origin-atlas-sheet-form]');
      if (restoreForm && atlasFilterSession.applied) hydrateAtlasFilterForm(restoreForm, atlasFilterSession.applied);
    }
    var openBtn = root && root.querySelector('[data-origin-atlas-sheet-open]');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    unlockAtlasFilterScroll();
    setAtlasFilterInert(false);
    atlasFilterSession.opener = null;
    if (reason === 'unmount' || reason === 'reopen' || reason === 'apply') return true;
    var canFocus = opener && typeof opener.focus === 'function';
    var docHasOpener = !opener || !opener.ownerDocument || typeof opener.ownerDocument.contains !== 'function' || opener.ownerDocument.contains(opener);
    if (canFocus && docHasOpener) {
      try {
        opener.focus({ preventScroll: true });
      } catch (eFocus) {
        opener.focus();
      }
    }
    return true;
  }

  function originMoreStorageKey() {
    return 'mcurator.origin.landing.more.v1';
  }

  function readOriginMoreState() {
    try {
      return JSON.parse(global.sessionStorage.getItem(originMoreStorageKey()) || '{}') || {};
    } catch (eMore) {
      return {};
    }
  }

  function writeOriginMoreState(patch) {
    var next = Object.assign({}, readOriginMoreState(), patch || {});
    try {
      global.sessionStorage.setItem(originMoreStorageKey(), JSON.stringify(next));
    } catch (eWrite) {}
    return next;
  }

  function applyOriginMoreTab(root, id, skipStore) {
    var tabId = id === 'collection' || id === 'community' || id === 'fields' ? id : 'fields';
    var tabs = root.querySelectorAll('[data-origin-more-tab]');
    Array.prototype.forEach.call(tabs, function (tab) {
      var on = tab.getAttribute('data-origin-more-tab') === tabId;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.classList.toggle('is-active', on);
    });
    Array.prototype.forEach.call(root.querySelectorAll('[id^="mc-origin-more-panel-"]'), function (panel) {
      panel.hidden = panel.id !== 'mc-origin-more-panel-' + tabId;
    });
    if (!skipStore) writeOriginMoreState({ tab: tabId });
  }

  function applyOriginMoreExpand(root, skipStore) {
    var rest = root.querySelector('[data-origin-fields-rest]');
    var btn = root.querySelector('[data-origin-more-expand]');
    if (!rest || !btn) return;
    var open = rest.hidden;
    rest.hidden = !open;
    btn.setAttribute('data-i18n', open ? 'origin_show_fewer' : 'origin_view_all');
    btn.textContent = open ? 'Show fewer' : 'View all';
    if (!skipStore) writeOriginMoreState({ fieldsOpen: open });
    try {
      if (typeof global.applyI18n === 'function') global.applyI18n();
    } catch (eI18n) {}
  }

  function restoreOriginMoreState(root) {
    var state = readOriginMoreState();
    if (state.tab) applyOriginMoreTab(root, state.tab, true);
    if (state.fieldsOpen) {
      var rest = root.querySelector('[data-origin-fields-rest]');
      if (rest && rest.hidden) applyOriginMoreExpand(root, true);
    }
  }

  function atlasSuggestHits(assets, rawQuery) {
    var q = String(rawQuery || '').trim().toLowerCase();
    if (q.length < 2) return [];
    var hits = [];
    var seen = {};
    function push(hit) {
      var key = hit.kind + ':' + String(hit.label).toLowerCase();
      if (seen[key] || hits.length >= 8) return;
      seen[key] = true;
      hits.push(hit);
    }
    var i;
    var row;
    for (i = 0; i < ATLAS_DISCOVERY_FIELDS.length; i += 1) {
      row = ATLAS_DISCOVERY_FIELDS[i];
      if (row.id.indexOf(q) >= 0 || row.aliases.some(function (alias) { return alias.indexOf(q) >= 0; })) {
        push({
          id: 'field-' + row.id,
          label: atlasFieldLabel(row.id) || row.id,
          kind: 'field',
          href: atlasListHref({ q: '', field: row.id, page: 1 }),
        });
      }
    }
    var matched = applyAtlasSearch(assets, { q: rawQuery, field: '', taxon: '', type: '', period: '', media: '', collab: '', verified: '', region: '', page: 1 });
    for (i = 0; i < matched.length; i += 1) {
      row = matched[i];
      if (String(row.scientificName || '').toLowerCase().indexOf(q) >= 0) {
        push({
          id: 'sci-' + row.id,
          label: row.scientificName,
          kind: 'scientific',
          href: PREFIX + '/atlas/' + encodeURIComponent(row.id),
        });
      }
      if (row.name && String(row.name).toLowerCase().indexOf(q) >= 0) {
        push({
          id: 'common-' + row.id,
          label: row.name,
          kind: 'common',
          href: PREFIX + '/atlas/' + encodeURIComponent(row.id),
        });
      }
      if (String(row.id || '').toLowerCase().indexOf(q) >= 0) {
        push({
          id: 'id-' + row.id,
          label: row.id,
          kind: 'id',
          href: PREFIX + '/atlas/' + encodeURIComponent(row.id),
        });
      }
      var taxon = taxonomicGroup(row);
      if (taxon && taxon.toLowerCase().indexOf(q) >= 0) {
        push({
          id: 'taxon-' + taxon,
          label: taxon,
          kind: 'taxon',
          href: atlasListHref({ q: '', taxon: taxon, page: 1 }),
        });
      }
    }
    return hits;
  }

  function renderAtlasSuggestions(rawQuery) {
    var panel = global.document.getElementById('mc-origin-atlas-suggest');
    var input = global.document.getElementById('mc-origin-atlas-search');
    var sheet = global.document.querySelector('.mc-origin-atlas-sheet');
    if (!panel || !input) return;
    if (sheet && !sheet.hidden) {
      closeAtlasSuggestions();
      return;
    }
    var hits = atlasSuggestHits(readAtlasAssets(), rawQuery);
    var list = panel.querySelector('ul');
    if (!list) return;
    list.innerHTML = hits
      .map(function (hit, index) {
        return (
          '<li role="presentation"><button type="button" role="option" id="mc-origin-atlas-suggest-' +
          escapeHtml(hit.id) +
          '" class="mc-origin-search__option" data-origin-route="' +
          escapeHtml(hit.href) +
          '" aria-selected="false"><span>' +
          escapeHtml(hit.label) +
          '</span></button></li>'
        );
      })
      .join('');
    panel.hidden = hits.length === 0;
    if (hits.length) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
    input.setAttribute('aria-expanded', hits.length ? 'true' : 'false');
    atlasFilterSession.suggestIndex = -1;
  }

  function bind(root) {
    if (!root || root.__mcOriginBound) return;
    root.__mcOriginBound = true;
    root.addEventListener(
      'error',
      function (ev) {
        var img = ev.target;
        if (!img || img.tagName !== 'IMG' || !img.classList.contains('mc-origin-atlas-media')) return;
        if (!img.closest('.mc-origin-discover')) return;
        var fallback = global.document.createElement('div');
        fallback.className = 'mc-origin-media mc-origin-media--fallback mc-origin-atlas-media';
        fallback.setAttribute('role', 'img');
        fallback.setAttribute('aria-label', t('origin_atlas_no_image', 'No public image'));
        var label = global.document.createElement('span');
        label.setAttribute('aria-hidden', 'true');
        label.textContent = t('origin_atlas_no_image', 'No public image');
        fallback.appendChild(label);
        img.replaceWith(fallback);
      },
      true
    );
    root.addEventListener('pointerover', function (ev) {
      var stage = ev.target.closest && ev.target.closest('[data-origin-era-shuttle]');
      if (stage) stage.setAttribute('data-paused', '1');
    });
    root.addEventListener('pointerout', function (ev) {
      var stage = ev.target.closest && ev.target.closest('[data-origin-era-shuttle]');
      if (!stage) return;
      var next = ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest('[data-origin-era-shuttle]');
      if (next !== stage) stage.removeAttribute('data-paused');
    });
    root.addEventListener('focusin', function (ev) {
      var stage = ev.target.closest && ev.target.closest('[data-origin-era-shuttle]');
      if (stage) stage.setAttribute('data-paused', '1');
    });
    root.addEventListener('focusout', function (ev) {
      var stage = ev.target.closest && ev.target.closest('[data-origin-era-shuttle]');
      if (!stage) return;
      var next = ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest('[data-origin-era-shuttle]');
      if (next !== stage) stage.removeAttribute('data-paused');
    });
    root.addEventListener('click', function (ev) {
      var signIn = ev.target.closest('[data-origin-signin]');
      if (signIn) {
        ev.preventDefault();
        if (typeof global.openLogin === 'function') global.openLogin();
        else if (typeof global.showLogin === 'function') global.showLogin();
        else go('/login');
        return;
      }
      var anchor = ev.target.closest('a[href^="#atlas-"], .mc-origin__skip');
      if (anchor) {
        ev.preventDefault();
        var targetId = String(anchor.getAttribute('href') || '').slice(1);
        var target = global.document.getElementById(targetId);
        if (target && root.contains(target)) {
          target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
          target.scrollIntoView({ block: 'start', behavior: 'auto' });
        }
        return;
      }
      var savePulse = ev.target.closest('[data-origin-pulse-save]');
      if (savePulse) {
        ev.preventDefault();
        var ps = loadState(), pid = savePulse.getAttribute('data-origin-pulse-save');
        var saved = ps.savedPulseIds.indexOf(pid) >= 0;
        ps.savedPulseIds = saved ? ps.savedPulseIds.filter(function (id) { return id !== pid; }) : [pid].concat(ps.savedPulseIds);
        if (!saveState(ps)) {
          announceOriginStatus(root, t('origin_ux_storage_error', 'Unable to save. Keep this page open and copy your text.'), true);
          return;
        }
        savePulse.setAttribute('aria-pressed', saved ? 'false' : 'true');
        savePulse.innerHTML = originIcon('bookmark') + (saved ? ux('save', 'Save') : ux('saved', 'Saved'));
        var pulseView = parseOriginPath(currentHashPath()).pulseView || currentSearchParams().get('view');
        if (pulseView === 'saved') mount();
        return;
      }

      var retry = ev.target.closest('[data-origin-retry]');
      if (retry) {
        ev.preventDefault();
        mount();
        return;
      }
      var backBtn = ev.target.closest('[data-origin-back]');
      if (backBtn) {
        ev.preventDefault();
        rememberScroll();
        if (ORIGIN_NAV_PUSHES > 0 && global.history.length > 1) {
          ORIGIN_NAV_PUSHES -= 1;
          NAV_DIRECTION = 'pop';
          global.history.back();
          return;
        }
        go(backBtn.getAttribute('data-origin-fallback') || PREFIX);
        mount();
        return;
      }
      var openSheet = ev.target.closest('[data-origin-atlas-sheet-open]');
      if (openSheet) {
        ev.preventDefault();
        if (global.innerWidth >= 1024) {
          var layout = root.querySelector('.mc-origin-atlas-layout');
          var nextOpen = !(layout && layout.classList.contains('is-rail-open'));
          if (layout) layout.classList.toggle('is-rail-open', nextOpen);
          try {
            global.sessionStorage.setItem('mcurator.origin.atlas.railOpen.v1', nextOpen ? '1' : '0');
          } catch (eRailToggle) {}
          openSheet.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
          closeAtlasSuggestions();
          return;
        }
        openAtlasFilterSheet(openSheet);
        return;
      }
      var railToggle = ev.target.closest('[data-origin-atlas-rail-toggle]');
      if (railToggle) {
        ev.preventDefault();
        var railLayout = root.querySelector('.mc-origin-atlas-layout');
        if (railLayout) railLayout.classList.remove('is-rail-open');
        try {
          global.sessionStorage.setItem('mcurator.origin.atlas.railOpen.v1', '0');
        } catch (eRailHide) {}
        return;
      }
      var clearQ = ev.target.closest('[data-origin-atlas-clear-q]');
      if (clearQ) {
        ev.preventDefault();
        var clearQuery = parseAtlasSearchParams(currentSearchParams());
        clearQuery.q = '';
        clearQuery.page = 1;
        go(atlasListHref(clearQuery));
        mount();
        return;
      }
      var closeSheet = ev.target.closest('[data-origin-atlas-sheet-close]');
      if (closeSheet) {
        ev.preventDefault();
        closeAtlasFilterSheet(closeSheet.getAttribute('data-origin-atlas-sheet-close') || 'close');
        return;
      }
      var resetSheet = ev.target.closest('[data-origin-atlas-sheet-reset]');
      if (resetSheet) {
        ev.preventDefault();
        var resetForm = resetSheet.closest('form');
        if (resetForm) {
          Array.prototype.forEach.call(resetForm.querySelectorAll('select'), function (sel) {
            sel.value = '';
          });
          Array.prototype.forEach.call(resetForm.querySelectorAll('input[type="checkbox"]'), function (box) {
            box.checked = false;
          });
          updateAtlasFilterApplyLabel(resetForm);
        }
        return;
      }
      var sheetEl = ev.target.closest('.mc-origin-atlas-sheet');
      if (sheetEl && ev.target === sheetEl) {
        ev.preventDefault();
        closeAtlasFilterSheet('backdrop');
        return;
      }
      var hallJump = ev.target.closest('[data-origin-hall-jump]');
      if (hallJump) {
        ev.preventDefault();
        var hallTarget = root.querySelector(hallJump.getAttribute('data-origin-hall-jump') || '');
        if (hallTarget) scrollOriginBlock(hallTarget);
        return;
      }
      var moreTab = ev.target.closest('[data-origin-more-tab]');
      if (moreTab) {
        ev.preventDefault();
        applyOriginMoreTab(root, moreTab.getAttribute('data-origin-more-tab'));
        return;
      }
      var moreExpand = ev.target.closest('[data-origin-more-expand]');
      if (moreExpand) {
        ev.preventDefault();
        applyOriginMoreExpand(root);
        return;
      }
      var menuToggle = ev.target.closest('[data-origin-atlas-menu-toggle]');
      if (menuToggle) {
        ev.preventDefault();
        ev.stopPropagation();
        var menuId = menuToggle.getAttribute('data-origin-atlas-menu-toggle');
        var menu = root.querySelector('[data-origin-atlas-menu="' + menuId + '"]');
        var willOpen = menu && menu.hidden;
        closeAtlasCardMenus(root);
        if (menu && willOpen) {
          menu.hidden = false;
          menuToggle.setAttribute('aria-expanded', 'true');
        }
        return;
      }
      var peekBtn = ev.target.closest('[data-origin-atlas-peek]');
      if (peekBtn) {
        ev.preventDefault();
        rememberAtlasListScroll();
        closeAtlasCardMenus(root);
        var peekId = peekBtn.getAttribute('data-origin-atlas-peek');
        if (global.innerWidth < 1024) go(PREFIX + '/atlas/' + encodeURIComponent(peekId));
        else go(atlasPeekHref(parseAtlasSearchParams(currentSearchParams()), peekId));
        mount();
        return;
      }
      var copyLink = ev.target.closest('[data-origin-atlas-copy-link]');
      if (copyLink) {
        ev.preventDefault();
        copyAtlasText(originPublicUrl(copyLink.getAttribute('data-origin-atlas-copy-link')));
        return;
      }
      var copyCite = ev.target.closest('[data-origin-atlas-copy-cite]');
      if (copyCite) {
        ev.preventDefault();
        var citeCard = copyCite.closest('[data-origin-atlas-card]');
        var sci = citeCard ? String((citeCard.querySelector('.mc-origin-atlas-card__sci') || {}).textContent || '').trim() : '';
        var catalog = citeCard ? String((citeCard.querySelector('.mc-origin-id') || {}).textContent || '').trim() : copyCite.getAttribute('data-origin-atlas-copy-cite');
        copyAtlasText(sci + ' (' + catalog + '). SAT ATLAS. ' + originPublicUrl(PREFIX + '/atlas/' + encodeURIComponent(catalog)) + '.');
        return;
      }
      var saveMuseum = ev.target.closest('[data-origin-atlas-save-museum]');
      if (saveMuseum) {
        ev.preventDefault();
        toggleSavedAtlasId(saveMuseum.getAttribute('data-origin-atlas-save-museum'));
        mount();
        return;
      }
      if (!ev.target.closest('[data-origin-atlas-menu]')) closeAtlasCardMenus(root);
      var previewClose = ev.target.closest('[data-origin-atlas-preview-close]');
      if (previewClose || (ev.target.classList && ev.target.classList.contains('mc-origin-atlas-preview'))) {
        ev.preventDefault();
        closeAtlasPreview();
        return;
      }
      var lessonTab = ev.target.closest('[data-origin-lesson-key]');
      if (lessonTab) {
        ev.preventDefault();
        paintLesson(root, lessonTab.getAttribute('data-origin-lesson-key'));
        return;
      }
      var benchTab = ev.target.closest('[data-origin-bench-key]');
      if (benchTab) {
        ev.preventDefault();
        paintBench(root, benchTab.getAttribute('data-origin-bench-key'));
        return;
      }
      var mineralTab = ev.target.closest('[data-origin-mineral-key]');
      if (mineralTab) {
        ev.preventDefault();
        paintMineral(root, mineralTab.getAttribute('data-origin-mineral-key'));
        return;
      }
      var mineralRewind = ev.target.closest('[data-origin-mineral-rewind]');
      if (mineralRewind) {
        ev.preventDefault();
        rewindMineralToEra(root, mineralRewind.getAttribute('data-origin-mineral-rewind'));
        return;
      }
      var marineTab = ev.target.closest('[data-origin-marine-key]');
      if (marineTab) {
        ev.preventDefault();
        paintMarine(root, marineTab.getAttribute('data-origin-marine-key'));
        return;
      }
      var eraBtn = ev.target.closest('[data-origin-era-dir]');
      if (eraBtn) {
        ev.preventDefault();
        if (eraBtn.disabled) return;
        jumpEraShuttle(root, Number(eraBtn.getAttribute('data-origin-era-dir')) || 1);
        return;
      }
      var eraTick = ev.target.closest('[data-origin-era-index]');
      if (eraTick) {
        ev.preventDefault();
        jumpEraTo(root, Number(eraTick.getAttribute('data-origin-era-index')));
        return;
      }
      var retry = ev.target.closest('[data-origin-discover-retry]');
      if (retry) {
        ev.preventDefault();
        mount();
        return;
      }
      var routeBtn = ev.target.closest('[data-origin-route]');
      if (routeBtn) {
        if (routeBtn.tagName === 'A' && (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0)) return;
        ev.preventDefault();
        var route = routeBtn.getAttribute('data-origin-route');
        if (route && route.indexOf('/section/') === 0) {
          go(route);
          return;
        }
        if (route && /\/atlas\/[^/?#]+/.test(route) && route.indexOf('/suggest') < 0 && route.indexOf('/collaborate') < 0) {
          var routeState = loadState();
          var shRoute = global.document.getElementById('welcomeShell');
          routeState.lastAtlasListScroll = shRoute ? shRoute.scrollTop : 0;
          saveState(routeState);
        }
        go(route);
        mount();
      }
    });
    root.addEventListener('change', function (ev) {
      var filterForm = ev.target.closest && ev.target.closest('[data-origin-atlas-filters]');
      if (filterForm) updateAtlasFilterApplyLabel(filterForm);
    });
    root.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && root.querySelector('[data-origin-atlas-preview]')) {
        ev.preventDefault();
        closeAtlasPreview();
        return;
      }
      var input = ev.target && ev.target.id === 'mc-origin-atlas-search' ? ev.target : null;
      if (!input) return;
      var sheet = root.querySelector('.mc-origin-atlas-sheet');
      if (sheet && !sheet.hidden) return;
      var panel = global.document.getElementById('mc-origin-atlas-suggest');
      if (!panel) return;
      var options = panel.querySelectorAll('[role="option"]');
      if (ev.key === 'Escape') {
        closeAtlasSuggestions();
        return;
      }
      if (!options.length) return;
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Home' || ev.key === 'End') {
        ev.preventDefault();
        atlasFilterSession.suggestIndex = atlasSuggestMove(atlasFilterSession.suggestIndex, ev.key, options.length);
        Array.prototype.forEach.call(options, function (opt, idx) {
          opt.classList.toggle('is-active', idx === atlasFilterSession.suggestIndex);
          opt.setAttribute('aria-selected', idx === atlasFilterSession.suggestIndex ? 'true' : 'false');
        });
        input.setAttribute('aria-activedescendant', options[atlasFilterSession.suggestIndex] ? options[atlasFilterSession.suggestIndex].id : '');
        return;
      }
      if (ev.key === 'Enter' && atlasFilterSession.suggestIndex >= 0 && options[atlasFilterSession.suggestIndex]) {
        ev.preventDefault();
        go(options[atlasFilterSession.suggestIndex].getAttribute('data-origin-route'));
        mount();
      }
    });
    function persistEditorDraft(ev) {
      var form = ev.target.closest && ev.target.closest('form');
      if (!form || !isSignedIn()) return;
      var state = loadState();
      if (form.hasAttribute('data-origin-pulse')) {
        state.pulseDraft = { type: inputValue(form, 'type'), scientificField: inputValue(form, 'scientificField'), topic: inputValue(form, 'topic'), body: inputValue(form, 'body'), sourceUrl: inputValue(form, 'sourceUrl') };
      } else if (form.hasAttribute('data-origin-studio')) {
        state.studioEditorDrafts[form.getAttribute('data-studio-slug') || 'new'] = { title: inputValue(form, 'title'), concept: inputValue(form, 'concept'), body: inputValue(form, 'body'), specimenIds: Array.prototype.map.call(form.querySelectorAll('[name="specimenIds"]:checked'), function (box) { return box.value; }) };
      } else return;
      if (!saveState(state)) showFeedback(form, 'storage_error', 'This draft could not be saved. Keep this page open and copy your text.', true);
    }
    root.addEventListener('input', persistEditorDraft);
    root.addEventListener('change', persistEditorDraft);
    root.addEventListener('input', function (ev) {
      if (!ev.target || ev.target.id !== 'mc-origin-atlas-search') return;
      renderAtlasSuggestions(ev.target.value);
    });
    root.addEventListener('focusin', function (ev) {
      if (ev.target && ev.target.id === 'mc-origin-atlas-search') renderAtlasSuggestions(ev.target.value);
    });
    global.document.addEventListener('mousedown', function (ev) {
      var form = root.querySelector('.mc-origin-atlas-search');
      if (form && !form.contains(ev.target)) closeAtlasSuggestions();
    });
    root.addEventListener('submit', function (ev) {
      var form = ev.target;
      if (!(form instanceof global.HTMLFormElement)) return;
      if (form.hasAttribute('data-origin-pulse-search')) {
        ev.preventDefault();
        var pv = parseOriginPath(currentHashPath()).pulseView || currentSearchParams().get('view') || 'all';
        var pq = new URLSearchParams();
        if (pv !== 'all') pq.set('view', pv);
        if (inputValue(form, 'q')) pq.set('q', inputValue(form, 'q'));
        go('/origin/pulse' + (pq.toString() ? '?' + pq.toString() : '')); mount(); return;
      }
      if (form.hasAttribute('data-origin-pulse-reply')) {
        ev.preventDefault();
        var rs = loadState(), replyBody = inputValue(form, 'body');
        if (!isSignedIn() || rs.pulseFrozen || !replyBody) return;
        var rp = rs.pulsePosts.filter(function (post) { return post.id === form.getAttribute('data-post-id') && isVisiblePulsePost(post); })[0];
        if (!rp) { showFeedback(form, 'discussion_missing', 'Discussion not found', true); return; }
        rp.comments = (rp.comments || []).concat([{ body: replyBody.slice(0, 6000), authorId: userId(), createdAt: new Date().toISOString() }]);
        if (!saveState(rs)) { showFeedback(form, 'storage_error', 'Unable to save. Keep this page open and copy your text.', true); return; }
        mount(); return;
      }

      if (form.getAttribute('data-origin-search')) {
        ev.preventDefault();
        var searchQuery = parseAtlasSearchParams(currentSearchParams());
        searchQuery.q = String((form.q && form.q.value) || '').trim();
        if (form.field) searchQuery.field = String(form.field.value || '');
        if (form.taxon) searchQuery.taxon = String(form.taxon.value || '');
        if (form.type) searchQuery.type = String(form.type.value || '');
        if (form.period) searchQuery.period = String(form.period.value || '');
        if (form.region) searchQuery.region = String(form.region.value || '');
        searchQuery.page = 1;
        go(atlasListHref(searchQuery));
        mount();
        return;
      }
      if (form.getAttribute('data-origin-atlas-filters')) {
        ev.preventDefault();
        var filterQuery = readAtlasFilterFormQuery(form);
        if (form.getAttribute('data-origin-atlas-sheet-form')) {
          closeAtlasFilterSheet('apply');
        }
        go(atlasListHref(filterQuery));
        mount();
        return;
      }
      if (form.getAttribute('data-origin-atlas-open')) {
        ev.preventDefault();
        var id = String((form.specimenId && form.specimenId.value) || '').trim();
        var idErr = form.querySelector('[data-origin-atlas-id-error]');
        if (!id) {
          if (idErr) {
            idErr.hidden = false;
            idErr.textContent = t('origin_atlas_id_required', 'Enter a specimen identifier.');
          }
          return;
        }
        if (!findPublicAtlasById(readAtlasAssets(), id)) {
          if (idErr) {
            idErr.hidden = false;
            idErr.textContent = t('origin_atlas_id_not_found', 'No public specimen matches this identifier.');
          }
          return;
        }
        go(PREFIX + '/atlas/' + encodeURIComponent(id));
        mount();
        return;
      }
      if (form.getAttribute('data-origin-atlas-save')) {
        ev.preventDefault();
        if (!isSignedIn()) return;
        var specimenId = form.getAttribute('data-specimen-id');
        var body = String((form.body && form.body.value) || '');
        var state = loadState();
        state.atlasNotes = [{ specimenId: specimenId, body: body, updatedAt: new Date().toISOString() }].concat(
          state.atlasNotes.filter(function (n) {
            return n.specimenId !== specimenId;
          }),
        );
        if (!saveState(state)) { showFeedback(form, 'storage_error', 'Unable to save. Keep this page open and copy your text.', true); return; }
        showFeedback(form, 'note_saved', 'Research note saved in this session.', false);
        return;
      }
      if (form.getAttribute('data-origin-pulse')) {
        ev.preventDefault();
        var pulseState = loadState();
        if (!isSignedIn() || pulseState.pulseFrozen) return;
        var topic = inputValue(form, 'topic'), pulseBody = inputValue(form, 'body');
        var pulseType = inputValue(form, 'type'), pulseField = inputValue(form, 'scientificField'), sourceUrl = inputValue(form, 'sourceUrl');
        if (!topic || !pulseBody) { showFeedback(form, 'required', 'Please complete the required fields.', true); return; }
        var rejection = pulsePolicyReject(pulseType, pulseField, topic, pulseBody, sourceUrl);
        if (rejection) { showFeedback(form, rejection, 'Check your post type, scientific field, and source URL.', true); return; }
        var post = { id: 'pulse-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), topic: topic.slice(0, 180), body: pulseBody.slice(0, 12000), createdAt: new Date().toISOString(), authorId: userId(), type: pulseType, scientificField: pulseField, sourceUrl: sourceUrl, status: 'published', comments: [] };
        pulseState.pulsePosts.unshift(post); pulseState.pulseDraft = {};
        if (!saveState(pulseState)) { showFeedback(form, 'storage_error', 'Unable to save. Keep this page open and copy your text.', true); return; }
        go('/origin/pulse/' + encodeURIComponent(post.id)); mount(); return;
      }
      if (form.getAttribute('data-origin-studio')) {
        ev.preventDefault();
        if (!isSignedIn()) return;
        var title = inputValue(form, 'title');
        if (!title) { showFeedback(form, 'required', 'Please complete the required fields.', true); return; }
        var studioState = loadState(), existingSlug = form.getAttribute('data-studio-slug');
        var existing = studioState.exhibitions.filter(function (row) { return row.slug === existingSlug; })[0];
        if (existingSlug && !existing) { showFeedback(form, 'exhibition_missing', 'Exhibition draft not found', true); return; }
        var slug = existing ? existing.slug : makeStudioSlug(title, studioState.exhibitions);
        var selected = Array.prototype.map.call(form.querySelectorAll('[name="specimenIds"]:checked'), function (box) { return box.value; });
        var publicIds = readAtlasAssets().map(function (asset) { return asset.id; });
        var exhibition = { slug: slug, title: title.slice(0, 160), concept: inputValue(form, 'concept').slice(0, 2000), body: inputValue(form, 'body').slice(0, 20000), specimenIds: selected.filter(function (id) { return publicIds.indexOf(id) >= 0; }), createdAt: existing ? existing.createdAt : new Date().toISOString(), updatedAt: new Date().toISOString(), ownerId: userId(), status: 'draft' };
        studioState.exhibitions = [exhibition].concat(studioState.exhibitions.filter(function (ex) { return ex.slug !== slug; }));
        delete studioState.studioEditorDrafts[existingSlug || 'new'];
        if (!saveState(studioState)) { showFeedback(form, 'storage_error', 'Unable to save. Keep this page open and copy your text.', true); return; }
        go('/origin/studio/' + encodeURIComponent(slug) + '/preview'); mount(); return;
      }
    });
    root.addEventListener('keydown', function (ev) {
      var tabs = ev.target.closest('[role="tablist"]');
      if (tabs && tabs.classList.contains('mc-origin-more__tabs')) {
        var order = ['fields', 'collection', 'community'];
        var current = readOriginMoreState().tab || 'fields';
        var index = order.indexOf(current);
        if (ev.key === 'ArrowRight') {
          ev.preventDefault();
          applyOriginMoreTab(root, order[(index + 1) % order.length]);
        } else if (ev.key === 'ArrowLeft') {
          ev.preventDefault();
          applyOriginMoreTab(root, order[(index - 1 + order.length) % order.length]);
        } else if (ev.key === 'Home') {
          ev.preventDefault();
          applyOriginMoreTab(root, 'fields');
        } else if (ev.key === 'End') {
          ev.preventDefault();
          applyOriginMoreTab(root, 'community');
        }
      }
      var card = ev.target.closest('.mc-origin-gateway__card');
      if (card && (ev.key === 'Enter' || ev.key === ' ') && ev.target === card) {
        ev.preventDefault();
        var href = card.getAttribute('data-origin-route');
        if (href) {
          go(href);
          mount();
        }
      }
    });
    restoreOriginMoreState(root);
  }

  var ERA_IMAGE = 'workflow-paleo-images/';
  function eraFrame(id, period, ma, file, name, scene, rank) {
    return { id: id, period: period, ma: ma, rank: rank || 'epoch', src: ERA_IMAGE + file, name: name, scene: scene };
  }
  var ERA_FRAMES = [
    eraFrame('hadean', 'precambrian', '4600', 'era-hadean.jpg', 'Hadean', 'A volcanic surface before stable continents', 'era'),
    eraFrame('archean', 'precambrian', '4000', 'era-archean.jpg', 'Archean', 'Shallow mineral pools under a volcanic sky', 'era'),
    eraFrame('eoarchean', 'archean', '4000', 'era-eoarchean.jpg', 'Eoarchean', 'Steam rising from dark shoreline pools', 'era'),
    eraFrame('paleoarchean', 'archean', '3600', 'era-paleoarchean.jpg', 'Paleoarchean', 'Layered mounds in a clear shallow sea', 'era'),
    eraFrame('mesoarchean', 'archean', '3200', 'era-mesoarchean.jpg', 'Mesoarchean', 'Sunrise across mineral terraces', 'era'),
    eraFrame('neoarchean', 'archean', '2800', 'era-neoarchean.jpg', 'Neoarchean', 'A warm shore with mineral crusts', 'era'),
    eraFrame('proterozoic', 'precambrian', '2500', 'era-proterozoic.jpg', 'Proterozoic', 'Red shallows and layered domes at sunset', 'era'),
    eraFrame('paleoproterozoic', 'proterozoic', '2500', 'era-paleoproterozoic.jpg', 'Paleoproterozoic', 'Rust-colored cliffs beside round mounds', 'era'),
    eraFrame('siderian', 'paleoproterozoic', '2500', 'era-siderian.jpg', 'Siderian', 'Iron-rich pools beneath volcanic steam', 'period'),
    eraFrame('rhyacian', 'paleoproterozoic', '2300', 'era-rhyacian.jpg', 'Rhyacian', 'Storm light over a rocky shallow sea', 'period'),
    eraFrame('orosirian', 'paleoproterozoic', '2050', 'era-orosirian.jpg', 'Orosirian', 'Layered pools under a low sun', 'period'),
    eraFrame('statherian', 'paleoproterozoic', '1800', 'era-statherian.jpg', 'Statherian', 'Clear water over spiral mounds', 'period'),
    eraFrame('mesoproterozoic', 'proterozoic', '1600', 'era-mesoproterozoic.jpg', 'Mesoproterozoic', 'Microbial mats on mounds, above and below the water', 'era'),
    eraFrame('calymmian', 'mesoproterozoic', '1600', 'era-calymmian.jpg', 'Calymmian', 'Sunlit shallows and flat layered discs', 'period'),
    eraFrame('ectasian', 'mesoproterozoic', '1400', 'era-ectasian.jpg', 'Ectasian', 'Stacked mounds in a turquoise sea', 'period'),
    eraFrame('stenian', 'mesoproterozoic', '1200', 'era-stenian.jpg', 'Stenian', 'Scattered mounds in a pale mountain lake', 'period'),
    eraFrame('neoproterozoic', 'proterozoic', '1000', 'era-neoproterozoic.jpg', 'Neoproterozoic', 'A seafloor of fronds and discs', 'era'),
    eraFrame('tonian', 'neoproterozoic', '1000', 'era-tonian.jpg', 'Tonian', 'Sunset over rust and green mineral crusts', 'period'),
    eraFrame('cryogenian', 'neoproterozoic', '720', 'era-cryogenian.jpg', 'Cryogenian', 'Ice cliffs along a frozen sea', 'period'),
    eraFrame('ediacaran', 'neoproterozoic', '635', 'era-ediacaran.jpg', 'Ediacaran', 'Soft-bodied fronds and discs on the seafloor', 'period'),
    eraFrame('terreneuvian', 'cambrian', '538', 'era-terreneuvian.jpg', 'Terreneuvian', 'The earliest Cambrian epoch'),
    eraFrame('cambrian-2', 'cambrian', '521', 'era-cambrian-2.jpg', 'Cambrian Series 2', 'Cambrian shelves after trilobites had spread'),
    eraFrame('miaolingian', 'cambrian', '509', 'era-miaolingian.jpg', 'Miaolingian', 'Middle Cambrian seafloors'),
    eraFrame('furongian', 'cambrian', '497', 'era-furongian.jpg', 'Furongian', 'The last Cambrian epoch'),
    eraFrame('ordovician-early', 'ordovician', '485', 'era-ordovician-early.jpg', 'Early Ordovician', 'An Early Ordovician seafloor'),
    eraFrame('ordovician-middle', 'ordovician', '470', 'era-ordovician-middle.jpg', 'Middle Ordovician', 'A Middle Ordovician seafloor'),
    eraFrame('ordovician-late', 'ordovician', '453', 'era-ordovician-late.jpg', 'Late Ordovician', 'A Late Ordovician seafloor'),
    eraFrame('llandovery', 'silurian', '443', 'era-llandovery.jpg', 'Llandovery', 'The earliest Silurian shore'),
    eraFrame('wenlock', 'silurian', '433', 'era-wenlock.jpg', 'Wenlock', 'A Silurian shore, above and below the water'),
    eraFrame('ludlow', 'silurian', '427', 'era-ludlow.jpg', 'Ludlow', 'A later Silurian shore'),
    eraFrame('devonian-early', 'devonian', '419', 'era-devonian-early.jpg', 'Early Devonian', 'Early Devonian seas'),
    eraFrame('devonian-middle', 'devonian', '393', 'era-devonian-middle.jpg', 'Middle Devonian', 'Middle Devonian seas and wetlands'),
    eraFrame('devonian-late', 'devonian', '372', 'era-devonian-late.jpg', 'Late Devonian', 'Late Devonian coasts'),
    eraFrame('miss-early', 'carboniferous', '359', 'era-miss-early.jpg', 'Early Mississippian', 'The earliest Carboniferous epoch'),
    eraFrame('miss-middle', 'carboniferous', '346', 'era-miss-middle.jpg', 'Middle Mississippian', 'Middle Mississippian shallow seas'),
    eraFrame('miss-late', 'carboniferous', '331', 'era-miss-late.jpg', 'Late Mississippian', 'Late Mississippian coasts'),
    eraFrame('penn-early', 'carboniferous', '323', 'era-penn-early.jpg', 'Early Pennsylvanian', 'Early coal-swamp forests'),
    eraFrame('penn-middle', 'carboniferous', '315', 'era-penn-middle.jpg', 'Middle Pennsylvanian', 'Middle Pennsylvanian wetlands'),
    eraFrame('penn-late', 'carboniferous', '305', 'era-penn-late.jpg', 'Late Pennsylvanian', 'Late Pennsylvanian floodplains'),
    eraFrame('cisuralian', 'permian', '290', 'era-cisuralian.jpg', 'Cisuralian', 'The earliest Permian epoch'),
    eraFrame('guadalupian', 'permian', '273', 'era-guadalupian.jpg', 'Guadalupian', 'Middle Permian floodplains'),
    eraFrame('lopingian', 'permian', '254', 'era-lopingian.jpg', 'Lopingian', 'The last Permian epoch'),
    eraFrame('triassic-early', 'triassic', '252', 'era-triassic-early.jpg', 'Early Triassic', 'An Early Triassic river plain'),
    eraFrame('triassic-middle', 'triassic', '242', 'era-triassic-middle.jpg', 'Middle Triassic', 'A Middle Triassic river plain'),
    eraFrame('triassic-late', 'triassic', '227', 'era-triassic-late.jpg', 'Late Triassic', 'A Late Triassic river plain'),
    eraFrame('jurassic-early', 'jurassic', '201', 'era-jurassic-early.jpg', 'Early Jurassic', 'An Early Jurassic valley'),
    eraFrame('jurassic-middle', 'jurassic', '174', 'era-jurassic-middle.jpg', 'Middle Jurassic', 'A Middle Jurassic valley'),
    eraFrame('jurassic-late', 'jurassic', '161', 'era-jurassic-late.jpg', 'Late Jurassic', 'A Late Jurassic valley'),
    eraFrame('cretaceous-early', 'cretaceous', '130', 'era-cretaceous-early.jpg', 'Early Cretaceous', 'An Early Cretaceous lakeshore'),
    eraFrame('cretaceous-late', 'cretaceous', '72', 'era-cretaceous-late.jpg', 'Late Cretaceous', 'A Late Cretaceous lakeshore'),
    eraFrame('paleocene', 'paleogene', '66', 'era-paleocene.jpg', 'Paleocene', 'The first Cenozoic woodlands'),
    eraFrame('eocene', 'paleogene', '56', 'era-eocene.jpg', 'Eocene', 'Warm Eocene woodlands'),
    eraFrame('oligocene', 'paleogene', '34', 'era-oligocene.jpg', 'Oligocene', 'Cooler Oligocene woodlands'),
    eraFrame('miocene', 'neogene', '23', 'era-miocene.jpg', 'Miocene', 'Miocene woods and grasslands'),
    eraFrame('pliocene', 'neogene', '5.3', 'era-pliocene.jpg', 'Pliocene', 'A Pliocene savanna'),
    eraFrame('pleistocene', 'quaternary', '2.6', 'era-pleistocene.jpg', 'Pleistocene', 'A Pleistocene ice-age plain'),
    eraFrame('holocene', 'quaternary', '0.012', 'era-holocene.jpg', 'Holocene', 'The epoch since the last ice age'),
    eraFrame('today', 'quaternary', '0', 'era-today.jpg', 'Present', 'Start here. Reverse time steps back one epoch at a time.', 'present'),
  ];
  var ERA_PERIODS = {
    cambrian: { src: 'origin-marketing/era-cambrian.jpg', name: 'Cambrian' },
    ordovician: { src: 'origin-marketing/era-ordovician.jpg', name: 'Ordovician' },
    silurian: { src: 'origin-marketing/era-silurian.jpg', name: 'Silurian' },
    devonian: { src: 'origin-marketing/era-devonian-sea.jpg', name: 'Devonian' },
    carboniferous: { src: 'workflow-paleo-images/era-carboniferous.jpg', name: 'Carboniferous' },
    permian: { src: 'origin-marketing/era-permian.jpg', name: 'Permian' },
    triassic: { src: 'origin-marketing/era-triassic.jpg', name: 'Triassic' },
    jurassic: { src: 'origin-marketing/era-jurassic.jpg', name: 'Jurassic' },
    cretaceous: { src: 'origin-marketing/era-cretaceous.jpg', name: 'Cretaceous' },
    paleogene: { src: 'origin-marketing/era-paleogene.jpg', name: 'Paleogene' },
    neogene: { src: 'origin-marketing/era-neogene.jpg', name: 'Neogene' },
    quaternary: { src: 'origin-marketing/era-quaternary.jpg', name: 'Quaternary' }
  };
  var eraShuttleIndex = ERA_FRAMES.length - 1;
  var eraShuttleDir = -1;
  var eraShuttleTimer = 0;
  var eraShuttleToken = 0;
  var mineralRewindTarget = '';

  function eraI18nKey(id, scene) {
    return 'origin_era_' + String(id || '').replace(/-/g, '_') + (scene ? '_scene' : '');
  }

  function eraLang() {
    try {
      if (typeof global.mcGetLang === 'function') return String(global.mcGetLang() || '');
    } catch (eLang) {}
    return 'en-001';
  }

  function eraGrouped(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function eraAgoZh(n) {
    if (n < 0.1) {
      var years = Math.round(n * 1000000);
      var wanSmall = Math.round(years / 1000) / 10;
      return '\u8ddd\u4eca\u7d04 ' + wanSmall + ' \u842c\u5e74\u524d';
    }
    var wan = Math.round(n * 100);
    var body;
    if (wan < 10000) {
      body = (wan % 1000 === 0) ? ((wan / 1000) + ' \u5343\u842c\u5e74') : (eraGrouped(wan) + ' \u842c\u5e74');
    } else {
      var yi = Math.floor(wan / 10000);
      var rest = wan % 10000;
      if (!rest) body = yi + ' \u5104\u5e74';
      else if (rest % 1000 === 0) body = yi + ' \u5104 ' + (rest / 1000) + ' \u5343\u842c\u5e74';
      else body = yi + ' \u5104 ' + eraGrouped(rest) + ' \u842c\u5e74';
    }
    return '\u8ddd\u4eca\u7d04 ' + body + '\u524d';
  }

  function eraAgoJa(n) {
    if (n < 0.1) return '\u7d04' + (Math.round(n * 1000) / 10) + '\u4e07\u5e74\u524d';
    var man = Math.round(n * 100);
    if (man < 10000) return '\u7d04' + eraGrouped(man) + '\u4e07\u5e74\u524d';
    var oku = Math.floor(man / 10000);
    var rest = man % 10000;
    if (!rest) return '\u7d04' + oku + '\u5104\u5e74\u524d';
    return '\u7d04' + oku + '\u5104' + eraGrouped(rest) + '\u4e07\u5e74\u524d';
  }

  function eraAgoEn(n) {
    if (n < 0.1) return 'about ' + eraGrouped(Math.round(n * 1000000)) + ' years ago';
    var millions = n < 10 ? String(Math.round(n * 10) / 10) : String(Math.round(n));
    return 'about ' + millions + ' million years ago';
  }

  function eraAgoDe(n) {
    if (n < 0.1) return 'vor etwa ' + eraGrouped(Math.round(n * 1000000)).replace(/,/g, '.') + ' Jahren';
    var millions = n < 10 ? String(Math.round(n * 10) / 10).replace('.', ',') : String(Math.round(n));
    return 'vor etwa ' + millions + ' Millionen Jahren';
  }

  function eraAgo(ma) {
    var n = parseFloat(ma);
    if (!isFinite(n) || n <= 0) return t('origin_era_now', 'Now');
    var lang = eraLang();
    if (lang === 'zh-TW') return eraAgoZh(n);
    if (lang === 'ja-JP') return eraAgoJa(n);
    if (lang === 'de-DE') return eraAgoDe(n);
    return eraAgoEn(n);
  }

  function eraRankLabel(era) {
    if (era.rank === 'present') return t('origin_era_present_rank', 'Present');
    if (era.rank === 'era') return t('origin_era_rank_era', 'Era');
    if (era.rank === 'period') return t('origin_era_period_rank', 'Period');
    return t('origin_era_rank', 'Epoch');
  }

  function eraMeta(era) {
    var period = t('origin_era_period_' + era.period, era.period);
    return period + ' \u00b7 ' + eraRankLabel(era) + ' \u00b7 ' + eraAgo(era.ma);
  }

  function eraMotionReduced() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (eMotion) {
      return false;
    }
  }

  function lessonLayerDefs() {
    return [
      { key: 'identity', img: 'origin-marketing/origin-usp-identity.jpg?v=sharp2', route: '/origin/atlas', goKey: 'origin_lesson_go_atlas', goFallback: 'Look in the specimens' },
      { key: 'hierarchy', img: 'origin-marketing/origin-usp-hierarchy.jpg?v=sharp2', route: '/origin/atlas', goKey: 'origin_lesson_go_atlas', goFallback: 'Look in the specimens' },
      { key: 'field', img: 'origin-marketing/origin-usp-field.jpg?v=sharp2', route: '/origin/atlas', goKey: 'origin_lesson_go_atlas', goFallback: 'Look in the specimens' },
      { key: 'community', img: 'origin-marketing/origin-usp-community.jpg?v=sharp2', route: '/origin/pulse', goKey: 'origin_lesson_go_pulse', goFallback: 'Join the discussion' },
      { key: 'exhibition', img: 'origin-marketing/origin-usp-exhibition.jpg?v=sharp2', route: '/origin/studio', goKey: 'origin_lesson_go_studio', goFallback: 'Curate an exhibition' },
      { key: 'provenance', img: 'origin-marketing/origin-usp-provenance.jpg?v=sharp2', route: '/section/passport-studio', goKey: 'origin_lesson_go_passport', goFallback: 'Make a passport' },
    ];
  }

  function lessonLayerByKey(key) {
    var layers = lessonLayerDefs();
    for (var i = 0; i < layers.length; i++) if (layers[i].key === key) return layers[i];
    return layers[0];
  }

  function paintLesson(root, key) {
    var lesson = root.querySelector('[data-origin-lesson]');
    if (!lesson) return;
    var layer = lessonLayerByKey(key);
    var claimText = t('origin_usp_' + layer.key + '_claim', '');
    var img = lesson.querySelector('[data-origin-lesson-photo]');
    var kicker = lesson.querySelector('[data-origin-lesson-kicker]');
    var claim = lesson.querySelector('[data-origin-lesson-claim]');
    var go = lesson.querySelector('[data-origin-lesson-go]');
    if (img) {
      if (img.getAttribute('src') !== layer.img) img.setAttribute('src', layer.img);
      img.alt = claimText;
    }
    if (kicker) {
      kicker.setAttribute('data-i18n', 'origin_usp_' + layer.key + '_kicker');
      kicker.textContent = t('origin_usp_' + layer.key + '_kicker', '');
    }
    if (claim) {
      claim.setAttribute('data-i18n', 'origin_usp_' + layer.key + '_claim');
      claim.textContent = claimText;
    }
    if (go) {
      go.setAttribute('data-origin-route', layer.route);
      go.setAttribute('data-i18n', layer.goKey);
      go.textContent = t(layer.goKey, layer.goFallback);
    }
    Array.prototype.forEach.call(lesson.querySelectorAll('[data-origin-lesson-key]'), function (tab) {
      var on = tab.getAttribute('data-origin-lesson-key') === layer.key;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function lessonHtml() {
    var first = lessonLayerDefs()[0];
    var tabs = lessonLayerDefs().map(function (layer, index) {
      var on = index === 0;
      return (
        '<button type="button" class="mc-origin-lesson__tab' + (on ? ' is-active' : '') + '" data-origin-lesson-key="' + layer.key + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-i18n="origin_lesson_tab_' + layer.key + '">' +
        t('origin_lesson_tab_' + layer.key, layer.key) +
        '</button>'
      );
    }).join('');
    return (
      '<section class="mc-origin-section mc-origin-lesson" data-origin-lesson="1" aria-labelledby="mc-origin-lesson-title">' +
      '<p class="mc-origin__kicker" data-i18n="origin_lesson_kicker">ONE SPECIMEN</p>' +
      '<h2 id="mc-origin-lesson-title" class="mc-origin-section__title" data-i18n="origin_lesson_title">Pick a question and read the specimen.</h2>' +
      '<p class="mc-origin-lesson__lead" data-i18n="origin_lesson_lead">Identity, place, discussion, exhibition, and provenance open one layer at a time on the same object.</p>' +
      '<div class="mc-origin-lesson__tabs" role="group">' + tabs + '</div>' +
      '<div class="mc-origin-lesson__stage">' +
      '<img class="mc-origin-lesson__photo" data-origin-lesson-photo src="' + first.img + '" width="1280" height="720" alt="" decoding="async" />' +
      '<div class="mc-origin-lesson__panel">' +
      '<p class="mc-origin-lesson__kicker" data-origin-lesson-kicker data-i18n="origin_usp_identity_kicker">Give the specimen a durable identity.</p>' +
      '<h3 class="mc-origin-lesson__claim" data-origin-lesson-claim data-i18n="origin_usp_identity_claim">Every specimen becomes a structured, traceable record.</h3>' +
      '<button type="button" class="mc-origin__btn mc-origin__btn--primary" data-origin-lesson-go data-origin-route="' + first.route + '" data-i18n="origin_lesson_go_atlas">Look in the specimens</button>' +
      '</div></div></section>'
    );
  }

  function toolBenchDefs() {
    return [
      { route: '/section/passport-studio', key: 'passport', title: 'Passport Studio', copy: 'Real specimen photos become SAT passport cards, QR codes, and labels in one step.' },
      { route: '/section/paleo-reconstruction', key: 'paleo', title: 'Paleo Reconstruction', copy: 'Create paleo reconstructions grounded in fossils and research.' },
      { route: '/section/photo-restoration-lab', key: 'photo', title: 'AI Photo Restoration Lab', copy: 'Restore specimen, fossil, and field photos while preserving scientific detail.' },
      { route: '/section/taxonomy-manuscript-studio', key: 'taxonomy', title: 'Taxonomy Manuscript Studio', copy: 'Organize characters, descriptions, and keys to speed up taxonomy writing.' },
      { route: '/section/evolution-tree-lab', key: 'evolution', title: 'Evolution Tree Lab', copy: 'Build comparable phylogenetic trees and explore taxonomic relationships.' },
      { route: '/section/husbandry-log', key: 'husbandry', title: 'Husbandry Log', copy: 'Log daily care for reptile terrariums and planted aquascapes in one place.' },
    ];
  }

  function toolBenchByKey(key) {
    var tools = toolBenchDefs();
    for (var i = 0; i < tools.length; i++) if (tools[i].key === key) return tools[i];
    return tools[0];
  }

  function paintBench(root, key) {
    var bench = root.querySelector('[data-origin-bench]');
    if (!bench) return;
    var tool = toolBenchByKey(key);
    var copy = bench.querySelector('[data-origin-bench-copy]');
    var open = bench.querySelector('[data-origin-bench-open]');
    if (copy) copy.textContent = t('origin_tool_' + tool.key + '_copy', tool.copy);
    if (open) open.setAttribute('data-origin-route', tool.route);
    Array.prototype.forEach.call(bench.querySelectorAll('[data-origin-bench-key]'), function (tab) {
      var on = tab.getAttribute('data-origin-bench-key') === tool.key;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function toolsBenchHtml() {
    var first = toolBenchDefs()[0];
    var tabs = toolBenchDefs().map(function (tool, index) {
      var on = index === 0;
      return (
        '<button type="button" class="mc-origin-bench__tab' + (on ? ' is-active' : '') + '" data-origin-bench-key="' + tool.key + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-i18n="origin_tool_' + tool.key + '_title">' +
        t('origin_tool_' + tool.key + '_title', tool.title) +
        '</button>'
      );
    }).join('');
    return (
      '<section class="mc-origin-section mc-origin-bench" data-origin-bench="1" aria-labelledby="mc-origin-bench-title">' +
      '<p class="mc-origin__kicker" data-i18n="origin_tool_free">Free to use</p>' +
      '<h2 id="mc-origin-bench-title" class="mc-origin-section__title" data-i18n="origin_tools_title">Six research tools, free when you join</h2>' +
      '<div class="mc-origin-bench__tabs">' + tabs + '</div>' +
      '<div class="mc-origin-bench__detail">' +
      '<p data-origin-bench-copy data-i18n="origin_tool_passport_copy">' + first.copy + '</p>' +
      '<button type="button" class="mc-origin__btn mc-origin__btn--primary" data-origin-bench-open data-origin-route="' + first.route + '" data-i18n="origin_bench_open">Open this tool</button>' +
      '</div></section>'
    );
  }

  function mineralDefs() {
    return [
      { key: 'calcite', file: 'mineral-calcite.png', formula: 'CaCO\u2083', era: 'ordovician-middle', name: 'Calcite', place: 'Elmwood Mine, Smith County, Tennessee, USA', strata: 'Nashville Group, Middle Ordovician', formed: 'Middle Ordovician' },
      { key: 'rhodochrosite', file: 'mineral-rhodochrosite.png', formula: 'MnCO\u2083', era: 'oligocene', name: 'Rhodochrosite', place: 'Sweet Home Mine, Alma, Colorado, USA', strata: 'Oligocene hydrothermal veins', formed: 'Oligocene' },
      { key: 'quartz', file: 'mineral-quartz.png', formula: 'SiO\u2082', era: 'penn-late', name: 'Quartz', place: 'Mount Ida, Arkansas, USA', strata: 'Quartz veins in the Stanley Shale', formed: 'Late Pennsylvanian' },
      { key: 'stibnite', file: 'mineral-stibnite.png', formula: 'Sb\u2082S\u2083', era: 'jurassic-late', name: 'Stibnite', place: 'Xikuangshan, Lengshuijiang, Hunan, China', strata: 'Late Jurassic veins in Devonian limestone', formed: 'Late Jurassic' },
      { key: 'pyrite', file: 'mineral-pyrite.png', formula: 'FeS\u2082', era: 'cretaceous-early', name: 'Pyrite', place: 'Navaj\u00fan, La Rioja, Spain', strata: 'Enciso Group', formed: 'Early Cretaceous' },
      { key: 'sulfur', file: 'mineral-sulfur.png', formula: 'S', era: 'miocene', name: 'Sulfur', place: 'Agrigento, Sicily, Italy', strata: 'Gessoso-Solfifera Formation', formed: 'Late Miocene' },
      { key: 'galena', file: 'mineral-galena.png', formula: 'PbS', era: 'miss-middle', name: 'Galena', place: 'Tri-State District, Joplin, Missouri, USA', strata: 'Boone Formation, Mississippian', formed: 'Middle Mississippian' },
      { key: 'malachite', file: 'mineral-malachite.png', formula: 'Cu\u2082CO\u2083(OH)\u2082', era: 'tonian', name: 'Malachite', place: 'Kolwezi, Lualaba, Democratic Republic of the Congo', strata: 'Mines Subgroup, Roan Group', formed: 'Tonian' },
      { key: 'fluorite', file: 'mineral-fluorite.png', formula: 'CaF\u2082', era: 'miss-late', name: 'Fluorite', place: 'Cave-in-Rock District, Hardin County, Illinois, USA', strata: 'Renault Formation and Bethel Sandstone, Chesterian Series', formed: 'Late Mississippian' },
      { key: 'azurite', file: 'mineral-azurite.png', formula: 'Cu\u2083(CO\u2083)\u2082(OH)\u2082', era: 'paleocene', name: 'Azurite', place: 'Bisbee, Cochise County, Arizona, USA', strata: 'Naco Limestone, Pennsylvanian', formed: 'Paleocene hydrothermal growth in that limestone' }
    ];
  }

  function mineralByKey(key) {
    var list = mineralDefs();
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return list[0];
  }

  function eraIndexById(id) {
    for (var i = 0; i < ERA_FRAMES.length; i++) if (ERA_FRAMES[i].id === id) return i;
    return -1;
  }

  function scrollOriginBlock(el) {
    var shell = global.document.getElementById('welcomeShell');
    if (!shell || !el || !el.getBoundingClientRect) return;
    shell.scrollTop += el.getBoundingClientRect().top - shell.getBoundingClientRect().top - 96;
  }

  function paintMineral(root, key) {
    var box = root.querySelector('[data-origin-mineral]');
    if (!box) return;
    var mineral = mineralByKey(key);
    var img = box.querySelector('[data-origin-mineral-photo]');
    var formula = box.querySelector('[data-origin-mineral-formula]');
    var nameEl = box.querySelector('[data-origin-mineral-name]');
    var place = box.querySelector('[data-origin-mineral-place]');
    var strata = box.querySelector('[data-origin-mineral-strata]');
    var formed = box.querySelector('[data-origin-mineral-formed]');
    var rewind = box.querySelector('[data-origin-mineral-rewind]');
    var src = 'origin-marketing/' + mineral.file;
    if (img) {
      img.alt = t('origin_mineral_' + mineral.key + '_name', mineral.name);
      img.setAttribute('data-cutout', '1');
      img.setAttribute('data-cutout-mode', 'black');
      img.setAttribute('data-cutout-limit', '24');
      img.setAttribute('data-cutout-src', src);
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
      if (typeof global.mcPaintSpecimenCutout === 'function') global.mcPaintSpecimenCutout(img);
    }
    if (formula) formula.textContent = mineral.formula;
    if (nameEl) {
      nameEl.setAttribute('data-i18n', 'origin_mineral_' + mineral.key + '_name');
      nameEl.textContent = t('origin_mineral_' + mineral.key + '_name', mineral.name);
    }
    if (place) {
      place.setAttribute('data-i18n', 'origin_mineral_' + mineral.key + '_place');
      place.textContent = t('origin_mineral_' + mineral.key + '_place', mineral.place);
    }
    if (strata) {
      strata.setAttribute('data-i18n', 'origin_mineral_' + mineral.key + '_strata');
      strata.textContent = t('origin_mineral_' + mineral.key + '_strata', mineral.strata);
    }
    if (formed) {
      formed.setAttribute('data-i18n', 'origin_mineral_' + mineral.key + '_formed');
      formed.textContent = t('origin_mineral_' + mineral.key + '_formed', mineral.formed);
    }
    if (rewind) rewind.setAttribute('data-origin-mineral-rewind', mineral.era);
    Array.prototype.forEach.call(box.querySelectorAll('[data-origin-mineral-key]'), function (tab) {
      var on = tab.getAttribute('data-origin-mineral-key') === mineral.key;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function rewindMineralToEra(root, eraId) {
    mineralRewindTarget = String(eraId || '');
    var index = eraIndexById(eraId);
    var era = root.querySelector('.mc-origin-era');
    if (era) scrollOriginBlock(era);
    if (index >= 0) jumpEraTo(root, index);
  }

  function rewindMarkHtml(i18nKey, fallback) {
    return '<img class="mc-time-rewind__mark" src="workflow-paleo-images/time-rewind-mark.jpg" alt="" width="44" height="44" decoding="async" />' +
      '<span class="mc-time-rewind__label" data-i18n="' + i18nKey + '">' + t(i18nKey, fallback) + '</span>';
  }

  function mineralHtml() {
    var first = mineralDefs()[0];
    var tabs = mineralDefs().map(function (mineral, index) {
      var on = index === 0;
      return (
        '<button type="button" class="mc-origin-mineral__tab' + (on ? ' is-active' : '') + '" data-origin-mineral-key="' + mineral.key + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-i18n="origin_mineral_' + mineral.key + '_name">' +
        t('origin_mineral_' + mineral.key + '_name', mineral.name) +
        '</button>'
      );
    }).join('');
    return (
      '<section class="mc-origin-section mc-origin-mineral" data-origin-mineral="1" aria-labelledby="mc-origin-mineral-title">' +
      '<p class="mc-origin__kicker" data-i18n="origin_mineral_kicker">MINERALOGY</p>' +
      '<h2 id="mc-origin-mineral-title" class="mc-origin-section__title" data-i18n="origin_mineral_title">Pick a mineral and return to its bed.</h2>' +
      '<p class="mc-origin-mineral__lead" data-i18n="origin_mineral_lead">Each stone keeps the place it is most often found, the bed it sits in, and the age it formed. Rewind opens that bed in deep time.</p>' +
      '<div class="mc-origin-mineral__tabs">' + tabs + '</div>' +
      '<div class="mc-origin-mineral__stage">' +
      '<img class="mc-origin-mineral__photo" data-origin-mineral-photo data-cutout="1" data-cutout-mode="black" data-cutout-limit="24" data-cutout-src="origin-marketing/' + first.file + '" src="origin-marketing/' + first.file + '" width="1024" height="1024" alt="" decoding="async" />' +
      '<div class="mc-origin-mineral__panel">' +
      '<p class="mc-origin-mineral__formula" data-origin-mineral-formula>' + first.formula + '</p>' +
      '<h3 class="mc-origin-mineral__name" data-origin-mineral-name data-i18n="origin_mineral_' + first.key + '_name">' + first.name + '</h3>' +
      '<dl class="mc-origin-mineral__facts">' +
      '<div><dt data-i18n="origin_mineral_locality">Locality</dt><dd data-origin-mineral-place data-i18n="origin_mineral_' + first.key + '_place">' + first.place + '</dd></div>' +
      '<div><dt data-i18n="origin_mineral_strata">Strata</dt><dd data-origin-mineral-strata data-i18n="origin_mineral_' + first.key + '_strata">' + first.strata + '</dd></div>' +
      '<div><dt data-i18n="origin_mineral_formed">Age formed</dt><dd data-origin-mineral-formed data-i18n="origin_mineral_' + first.key + '_formed">' + first.formed + '</dd></div>' +
      '</dl>' +
      '<button type="button" class="mc-time-rewind" data-origin-mineral-rewind="' + first.era + '" data-i18n-aria="origin_mineral_rewind" aria-label="' + t('origin_mineral_rewind', 'Rewind to this bed') + '">' +
      rewindMarkHtml('origin_mineral_rewind', 'Rewind to this bed') +
      '</button>' +
      '</div></div></section>'
    );
  }

  function marineDefs() {
    return [
      { key: 'rhincodon', file: 'Rhincodon_typus-habitat.jpg', sci: 'Rhincodon typus', common: 'Whale shark', place: 'Ningaloo Reef, Western Australia' },
      { key: 'tursiops', file: 'Tursiops_truncatus-habitat.jpg', sci: 'Tursiops truncatus', common: 'Bottlenose dolphin', place: 'Coastal waters of the Gulf of Mexico' },
      { key: 'asterias', file: 'Asterias_rubens-habitat.jpg', sci: 'Asterias rubens', common: 'Common starfish', place: 'Rocky shores of the North Sea' },
      { key: 'aurelia', file: 'Aurelia_aurita-habitat.jpg', sci: 'Aurelia aurita', common: 'Moon jelly', place: 'Coastal waters of the North Sea and the Baltic Sea' },
      { key: 'diadema', file: 'Diadema_setosum-habitat.jpg', sci: 'Diadema setosum', common: 'Long-spined sea urchin', place: 'Shallow reefs of the Red Sea' },
      { key: 'octopus', file: 'Octopus_vulgaris-habitat.jpg', sci: 'Octopus vulgaris', common: 'Common octopus', place: 'Rocky coasts of the Mediterranean Sea' },
      { key: 'tridacna', file: 'Tridacna_maxima-habitat.jpg', sci: 'Tridacna maxima', common: 'Small giant clam', place: 'Shallow reef flats of the Great Barrier Reef, Australia' },
      { key: 'amphiprion', file: 'Amphiprion_ocellaris-habitat.jpg', sci: 'Amphiprion ocellaris', common: 'Clown anemonefish', place: 'Coral reefs of Indonesia and the Philippines' },
      { key: 'hippocampus', file: 'Hippocampus_kuda-habitat.jpg', sci: 'Hippocampus kuda', common: 'Spotted seahorse', place: 'Seagrass beds of the Strait of Malacca' },
      { key: 'chelonia', file: 'Chelonia_mydas-habitat.jpg', sci: 'Chelonia mydas', common: 'Green sea turtle', place: 'Raine Island, northern Great Barrier Reef, Australia' }
    ];
  }

  function marineByKey(key) {
    var list = marineDefs();
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return list[0];
  }

  function marineSciMarkup(animal) {
    if (animal.genus) return '<em>' + animal.genus + '</em> sp.';
    return '<em>' + animal.sci + '</em>';
  }

  function paintMarine(root, key) {
    var box = root.querySelector('[data-origin-marine]');
    if (!box) return;
    var animal = marineByKey(key);
    var img = box.querySelector('[data-origin-marine-photo]');
    var sciEl = box.querySelector('[data-origin-marine-sci]');
    var nameEl = box.querySelector('[data-origin-marine-name]');
    var place = box.querySelector('[data-origin-marine-place]');
    var src = 'origin-marketing/' + animal.file;
    var common = t('origin_marine_' + animal.key + '_name', animal.common);
    if (img && img.getAttribute('src') !== src) img.setAttribute('src', src);
    if (img) img.alt = animal.sci + ', ' + common;
    if (sciEl) sciEl.innerHTML = marineSciMarkup(animal);
    if (nameEl) {
      nameEl.setAttribute('data-i18n', 'origin_marine_' + animal.key + '_name');
      nameEl.textContent = common;
    }
    if (place) {
      place.setAttribute('data-i18n', 'origin_marine_' + animal.key + '_place');
      place.textContent = t('origin_marine_' + animal.key + '_place', animal.place);
    }
    Array.prototype.forEach.call(box.querySelectorAll('[data-origin-marine-key]'), function (tab) {
      var on = tab.getAttribute('data-origin-marine-key') === animal.key;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function marineHtml() {
    var first = marineDefs()[0];
    var tabs = marineDefs().map(function (animal, index) {
      var on = index === 0;
      return (
        '<button type="button" class="mc-origin-marine__tab' + (on ? ' is-active' : '') + '" data-origin-marine-key="' + animal.key + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-i18n="origin_marine_' + animal.key + '_name">' +
        t('origin_marine_' + animal.key + '_name', animal.common) +
        '</button>'
      );
    }).join('');
    return (
      '<section class="mc-origin-section mc-origin-marine" data-origin-marine="1" aria-labelledby="mc-origin-marine-title">' +
      '<p class="mc-origin__kicker" data-i18n="origin_marine_kicker">MARINE BIOLOGY</p>' +
      '<h2 id="mc-origin-marine-title" class="mc-origin-section__title" data-i18n="origin_marine_title">Marine biology</h2>' +
      '<p class="mc-origin-marine__lead" data-i18n="origin_marine_lead">Each animal is shown with its scientific name, common name, and the coast, reef, or sea where it is most often recorded.</p>' +
      '<div class="mc-origin-marine__tabs" role="tablist">' + tabs + '</div>' +
      '<div class="mc-origin-marine__stage">' +
      '<img class="mc-origin-marine__photo" data-origin-marine-photo src="origin-marketing/' + first.file + '" width="1024" height="1024" alt="' + first.sci + ', ' + first.common + '" decoding="async" />' +
      '<div class="mc-origin-marine__panel">' +
      '<p class="mc-origin-marine__sci" data-origin-marine-sci>' + marineSciMarkup(first) + '</p>' +
      '<h3 class="mc-origin-marine__name" data-origin-marine-name data-i18n="origin_marine_' + first.key + '_name">' + first.common + '</h3>' +
      '<dl class="mc-origin-marine__facts">' +
      '<div><dt data-i18n="origin_marine_locality">Locality</dt><dd data-origin-marine-place data-i18n="origin_marine_' + first.key + '_place">' + first.place + '</dd></div>' +
      '</dl>' +
      '</div></div></section>'
    );
  }

  function eraShuttleHtml() {
    var first = ERA_FRAMES[ERA_FRAMES.length - 1];
    var ticks = ERA_FRAMES.map(function (era, index) {
      return '<li><button type="button" class="mc-origin-era-shuttle__tick" data-origin-era-index="' + index + '" data-i18n="' + eraI18nKey(era.id) + '">' + era.name + '</button></li>';
    }).join('');
    return (
      '<section class="mc-origin-section mc-origin-era" aria-labelledby="mc-origin-era-title">' +
      '<p class="mc-origin__kicker" data-i18n="origin_era_kicker">DEEP TIME</p>' +
      '<h2 id="mc-origin-era-title" class="mc-origin-section__title" data-i18n="origin_era_title">Cross geological time, one epoch at a time</h2>' +
      '<p class="mc-origin-era__lead" data-i18n="origin_era_lead">Reverse time steps back one epoch, and the photograph develops only after it arrives. Shuttle forward returns along the same epochs.</p>' +
      '<div class="mc-origin-era-shuttle" data-origin-era-shuttle="1" data-era="' + first.id + '">' +
      '<div class="mc-origin-era-shuttle__viewport">' +
      '<img class="mc-origin-era-shuttle__photo" src="' + first.src + '" width="1024" height="768" alt="' + first.scene + '" decoding="async" />' +
      '<div class="mc-origin-era-shuttle__warp" aria-hidden="true"></div>' +
      '<div class="mc-origin-era-shuttle__plate">' +
      '<p class="mc-origin-era-shuttle__era" data-i18n="' + eraI18nKey(first.id) + '">' + first.name + '</p>' +
      '<span class="mc-origin-era-shuttle__rule" aria-hidden="true"></span>' +
      '<p class="mc-origin-era-shuttle__meta" data-origin-era-meta>' + eraMeta(first) + '</p>' +
      '<p class="mc-origin-era-shuttle__caption" data-i18n="' + eraI18nKey(first.id, true) + '">' + first.scene + '</p>' +
      '</div></div>' +
      '<p class="mc-origin-sr mc-origin-era-shuttle__live" aria-live="polite"></p>' +
      '<ol class="mc-origin-era-shuttle__track" data-origin-era-track aria-label="' + t('origin_era_track', 'Geological epochs, oldest to present') + '">' + ticks + '</ol>' +
      '<div class="mc-origin-era-shuttle__controls">' +
      '<button type="button" class="mc-time-rewind" data-origin-era-dir="-1" data-i18n-aria="origin_era_reverse" aria-label="' + t('origin_era_reverse', 'Reverse time') + '">' +
      rewindMarkHtml('origin_era_reverse', 'Reverse time') +
      '</button>' +
      '<button type="button" class="mc-origin__btn mc-origin__btn--primary" data-origin-era-dir="1" data-i18n="origin_era_forward" disabled>Shuttle forward</button>' +
      '</div></div></section>'
    );
  }

  function stopEraShuttle() {
    eraShuttleToken += 1;
    if (eraShuttleTimer) {
      global.clearTimeout(eraShuttleTimer);
      eraShuttleTimer = 0;
    }
  }

  function paintEraShuttle(root, index, phase) {
    var stage = root && root.querySelector('[data-origin-era-shuttle]');
    if (!stage) return;
    var era = ERA_FRAMES[index];
    var img = stage.querySelector('.mc-origin-era-shuttle__photo');
    var nameEl = stage.querySelector('.mc-origin-era-shuttle__era');
    var captionEl = stage.querySelector('.mc-origin-era-shuttle__caption');
    var live = stage.querySelector('.mc-origin-era-shuttle__live');
    var showPhoto = phase !== 'warp';
    if (img && showPhoto && img.getAttribute('src') !== era.src) img.setAttribute('src', era.src);
    if (img) img.alt = t(eraI18nKey(era.id, true), era.scene);
    if (nameEl) {
      nameEl.setAttribute('data-i18n', eraI18nKey(era.id));
      nameEl.textContent = t(eraI18nKey(era.id), era.name);
    }
    if (captionEl) {
      captionEl.setAttribute('data-i18n', eraI18nKey(era.id, true));
      captionEl.textContent = t(eraI18nKey(era.id, true), era.scene);
    }
    var meta = stage.querySelector('[data-origin-era-meta]');
    if (meta) meta.textContent = eraMeta(era);
    stage.setAttribute('data-era', era.id);
    stage.classList.toggle('is-warping', phase === 'warp');
    stage.classList.toggle('is-developing', phase === 'develop');
    stage.classList.toggle('is-period', false);
    stage.classList.toggle('is-rewind', eraShuttleDir < 0);
    var ticks = stage.querySelectorAll('[data-origin-era-index]');
    Array.prototype.forEach.call(ticks, function (tick) {
      var at = Number(tick.getAttribute('data-origin-era-index'));
      var on = at === index;
      tick.classList.toggle('is-active', on);
      tick.classList.toggle('is-passed', eraShuttleDir < 0 ? at > index : at < index);
      tick.setAttribute('data-i18n', eraI18nKey(ERA_FRAMES[at].id));
      tick.textContent = t(eraI18nKey(ERA_FRAMES[at].id), ERA_FRAMES[at].name);
      if (on) tick.setAttribute('aria-current', 'true');
      else tick.removeAttribute('aria-current');
    });
    var activeTick = stage.querySelector('[data-origin-era-index="' + index + '"]');
    var track = stage.querySelector('[data-origin-era-track]');
    if (activeTick && track && phase === 'hold') {
      var tickLeft = activeTick.offsetLeft - Math.max(0, (track.clientWidth - activeTick.offsetWidth) / 2);
      track.scrollLeft = Math.max(0, tickLeft);
    }
    var back = stage.querySelector('[data-origin-era-dir="-1"]');
    var fwd = stage.querySelector('[data-origin-era-dir="1"]');
    if (back) {
      back.disabled = index <= 0;
      back.classList.toggle('is-running', phase !== 'hold' && eraShuttleDir < 0);
    }
    if (fwd) fwd.disabled = index >= ERA_FRAMES.length - 1;
    Array.prototype.forEach.call(root.querySelectorAll('[data-origin-mineral-rewind]'), function (btn) {
      btn.classList.toggle('is-running', phase !== 'hold' && !!mineralRewindTarget && btn.getAttribute('data-origin-mineral-rewind') === mineralRewindTarget);
    });
    if (phase === 'hold') mineralRewindTarget = '';
    if (live && phase === 'hold') {
      var prefix = eraShuttleDir < 0 ? t('origin_era_reverse', 'Reverse time') + '. ' : '';
      live.textContent = prefix + t(eraI18nKey(era.id), era.name) + '. ' + eraMeta(era);
    }
  }

  function eraShuttleHolding(stage) {
    if (!stage) return true;
    if (stage.getAttribute('data-paused') === '1') return true;
    try {
      return global.document.hidden;
    } catch (eHidden) {
      return false;
    }
  }

  function whenEraReady(src, done) {
    var pre = new global.Image();
    var settled = false;
    function finish() {
      if (settled) return;
      settled = true;
      done();
    }
    pre.onload = finish;
    pre.onerror = finish;
    pre.src = src;
    if (pre.complete) finish();
  }

  function scheduleEraShuttle(root, delay, token) {
    eraShuttleTimer = global.setTimeout(function () {
      if (token !== eraShuttleToken) return;
      runEraShuttle(root, token);
    }, delay);
  }

  function runEraShuttle(root, token) {
    var stage = root.querySelector('[data-origin-era-shuttle]');
    if (!stage) return;
    if (eraMotionReduced()) return;
    if (eraShuttleHolding(stage)) {
      scheduleEraShuttle(root, 500, token);
      return;
    }
    departEraShuttle(root, token);
  }

  function paintEraPeriod(root, periodId) {
    var stage = root && root.querySelector('[data-origin-era-shuttle]');
    var period = ERA_PERIODS[periodId];
    if (!stage || !period) return;
    var img = stage.querySelector('.mc-origin-era-shuttle__photo');
    var nameEl = stage.querySelector('.mc-origin-era-shuttle__era');
    var captionEl = stage.querySelector('.mc-origin-era-shuttle__caption');
    var meta = stage.querySelector('[data-origin-era-meta]');
    var live = stage.querySelector('.mc-origin-era-shuttle__live');
    var periodName = t('origin_era_period_' + periodId, period.name);
    var cross = t('origin_era_period_cross', 'This epoch is now in another period. The shuttle then returns to epochs.');
    if (img && img.getAttribute('src') !== period.src) img.setAttribute('src', period.src);
    if (img) img.alt = periodName;
    if (nameEl) {
      nameEl.setAttribute('data-i18n', 'origin_era_period_' + periodId);
      nameEl.textContent = periodName;
    }
    if (meta) meta.textContent = t('origin_era_period_rank', 'Period');
    if (captionEl) {
      captionEl.setAttribute('data-i18n', 'origin_era_period_cross');
      captionEl.textContent = cross;
    }
    stage.setAttribute('data-era', 'period-' + periodId);
    stage.classList.remove('is-warping', 'is-developing');
    void stage.offsetWidth;
    stage.classList.add('is-developing', 'is-period');
    if (live) live.textContent = periodName + '. ' + cross;
  }

  function arriveEraShuttle(root, token, nextIndex) {
    eraShuttleIndex = nextIndex;
    paintEraShuttle(root, eraShuttleIndex, 'develop');
    eraShuttleTimer = global.setTimeout(function () {
      if (token !== eraShuttleToken) return;
      paintEraShuttle(root, eraShuttleIndex, 'hold');
      scheduleEraShuttle(root, 2400, token);
    }, 980);
  }

  function departEraShuttle(root, token, forcedIndex) {
    var nextIndex = typeof forcedIndex === 'number' ? forcedIndex : (eraShuttleIndex + eraShuttleDir);
    if (typeof forcedIndex !== 'number' && (nextIndex < 0 || nextIndex >= ERA_FRAMES.length)) {
      eraShuttleDir = -eraShuttleDir;
      nextIndex = eraShuttleIndex + eraShuttleDir;
    }
    if (nextIndex < 0 || nextIndex >= ERA_FRAMES.length || nextIndex === eraShuttleIndex) {
      paintEraShuttle(root, eraShuttleIndex, 'hold');
      return;
    }
    var fromEra = ERA_FRAMES[eraShuttleIndex];
    var toEra = ERA_FRAMES[nextIndex];
    var crossPeriod = fromEra && toEra && fromEra.period !== toEra.period && ERA_PERIODS[toEra.period];
    var firstSrc = crossPeriod ? ERA_PERIODS[toEra.period].src : toEra.src;
    paintEraShuttle(root, eraShuttleIndex, 'warp');
    whenEraReady(firstSrc, function () {
      if (token !== eraShuttleToken) return;
      eraShuttleTimer = global.setTimeout(function () {
        if (token !== eraShuttleToken) return;
        if (!crossPeriod) {
          arriveEraShuttle(root, token, nextIndex);
          return;
        }
        paintEraPeriod(root, toEra.period);
        whenEraReady(toEra.src, function () {
          if (token !== eraShuttleToken) return;
          eraShuttleTimer = global.setTimeout(function () {
            if (token !== eraShuttleToken) return;
            arriveEraShuttle(root, token, nextIndex);
          }, 1200);
        });
      }, 760);
    });
  }

  function startEraShuttle(root) {
    stopEraShuttle();
    if (!root || !root.querySelector('[data-origin-era-shuttle]')) return;
    var token = eraShuttleToken;
    paintEraShuttle(root, eraShuttleIndex, 'hold');
    if (!eraMotionReduced()) scheduleEraShuttle(root, 2600, token);
  }

  function jumpEraShuttle(root, dir) {
    stopEraShuttle();
    eraShuttleDir = dir < 0 ? -1 : 1;
    var stage = root.querySelector('[data-origin-era-shuttle]');
    if (!stage) return;
    var next = eraShuttleIndex + eraShuttleDir;
    if (next < 0 || next >= ERA_FRAMES.length) {
      paintEraShuttle(root, eraShuttleIndex, 'hold');
      return;
    }
    var token = eraShuttleToken;
    if (eraMotionReduced()) {
      var fromPeriod = ERA_FRAMES[eraShuttleIndex] && ERA_FRAMES[eraShuttleIndex].period;
      eraShuttleIndex = next;
      paintEraShuttle(root, eraShuttleIndex, 'hold');
      if (fromPeriod && fromPeriod !== ERA_FRAMES[next].period) {
        var live = stage.querySelector('.mc-origin-era-shuttle__live');
        var periodName = t('origin_era_period_' + ERA_FRAMES[next].period, ERA_FRAMES[next].period);
        if (live) live.textContent = periodName + '. ' + t('origin_era_period_cross', 'This epoch is now in another period.') + ' ' + live.textContent;
      }
      return;
    }
    departEraShuttle(root, token, next);
  }

  function jumpEraTo(root, index) {
    if (!isFinite(index) || index < 0 || index >= ERA_FRAMES.length) return;
    if (index === eraShuttleIndex) {
      stopEraShuttle();
      paintEraShuttle(root, eraShuttleIndex, 'hold');
      if (!eraMotionReduced()) scheduleEraShuttle(root, 2600, eraShuttleToken);
      return;
    }
    stopEraShuttle();
    eraShuttleDir = index < eraShuttleIndex ? -1 : 1;
    var token = eraShuttleToken;
    if (eraMotionReduced()) {
      var fromPeriod = ERA_FRAMES[eraShuttleIndex] && ERA_FRAMES[eraShuttleIndex].period;
      eraShuttleIndex = index;
      paintEraShuttle(root, eraShuttleIndex, 'hold');
      if (fromPeriod && fromPeriod !== ERA_FRAMES[index].period) {
        var live = root.querySelector('.mc-origin-era-shuttle__live');
        var periodName = t('origin_era_period_' + ERA_FRAMES[index].period, ERA_FRAMES[index].period);
        if (live) live.textContent = periodName + '. ' + t('origin_era_period_cross', 'This epoch is now in another period.') + ' ' + live.textContent;
      }
      return;
    }
    departEraShuttle(root, token, index);
  }

  function mount() {
    closeAtlasFilterSheet('unmount');
    var el = global.document.getElementById('mcOriginRoot');
    if (!el) return false;
    try {
      ensureOriginListeners();
      bind(el);
      render(el, currentHashPath());
      startEraShuttle(el);
      observeHeader(el);
      el.setAttribute('data-mc-origin-mounted', '1');
      return true;
    } catch (err) {
      renderError(el, err);
      bind(el);
      return false;
    }
  }

  function unmount() {
    stopEraShuttle();
    closeAtlasFilterSheet('unmount');
    releaseAtlasPreview();
    var el = global.document.getElementById('mcOriginRoot');
    if (el) {
      el.innerHTML = '';
      el.removeAttribute('data-mc-origin-mounted');
    }
  }

  function ensureOriginListeners() {
    if (global.__mcOriginNavBound) return;
    global.__mcOriginNavBound = true;
    global.addEventListener('hashchange', function () {
      var el = global.document.getElementById('mcOriginRoot');
      if (!el || el.getAttribute('data-mc-origin-mounted') !== '1') return;
      if (global.__mcOriginIgnoreHash) {
        global.__mcOriginIgnoreHash = false;
        return;
      }
      NAV_DIRECTION = 'pop';
      mount();
    });
    global.addEventListener('popstate', function () {
      NAV_DIRECTION = 'pop';
      if (ORIGIN_NAV_PUSHES > 0) ORIGIN_NAV_PUSHES -= 1;
    });
    global.addEventListener('resize', function () {
      var el = global.document.getElementById('mcOriginRoot');
      if (el) syncOriginHeaderOffset(el);
    });
  }

  function observeHeader(root) {
    var header =
      global.document.querySelector('[data-global-header]') ||
      global.document.querySelector('.mc-global-header-root') ||
      global.document.querySelector('.mc-global-header');
    if (!header || typeof global.ResizeObserver !== 'function') return;
    if (global.__mcOriginHeaderRo) {
      try {
        global.__mcOriginHeaderRo.disconnect();
      } catch (eRo) {}
    }
    global.__mcOriginHeaderRo = new global.ResizeObserver(function () {
      syncOriginHeaderOffset(root);
    });
    global.__mcOriginHeaderRo.observe(header);
  }

  global.MCOrigin = {
    parseOriginPath: parseOriginPath,
    originSurfaceForModule: originSurfaceForModule,
    originNavActiveId: originNavActiveId,
    originBackFallback: originBackFallback,
    originShowsBack: originShowsBack,
    originCrumbTrail: originCrumbTrail,
    syncOriginHeaderOffset: syncOriginHeaderOffset,
    normalizePath: normalizePath,
    applyAtlasSearch: applyAtlasSearch,
    parseAtlasSearchParams: parseAtlasSearchParams,
    isPublicAtlasSpecimen: isPublicAtlasSpecimen,
    findPublicAtlasById: findPublicAtlasById,
    pickFeaturedAtlasSpecimen: pickFeaturedAtlasSpecimen,
    readAtlasAssets: readAtlasAssets,
    atlasListHref: atlasListHref,
    openAtlasFilterSheet: openAtlasFilterSheet,
    closeAtlasFilterSheet: closeAtlasFilterSheet,
    mount: mount,
    unmount: unmount,
    render: function () {
      return mount();
    },
    EXPECTED_NAV: EXPECTED_NAV,
  };
})(typeof window !== 'undefined' ? window : this);
