/**
 * Open Tree of Life API v3 — server-side proxy for MCurator Evolution Tree Lab.
 * Uses UrlFetchApp + CacheService (1h TTL). Does not modify other app modules.
 */
var MC_OT_BASE = 'https://api.opentreeoflife.org/v3';
var MC_OT_CACHE_PREFIX = 'mc_ot_v1_';
var MC_OT_CACHE_TTL_SEC = 3600;
var MC_OT_PROPS_LIST_KEY = 'MC_EVOLUTION_TREE_PROJECT_IDS';
var MC_OT_PROPS_PREFIX = 'MC_EVOLUTION_TREE_PROJECT_';

function openTreeMd5Hex_(text) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(text || ''), Utilities.Charset.UTF_8);
  var hex = '';
  for (var i = 0; i < raw.length; i++) {
    var b = raw[i] & 0xff;
    hex += (b < 16 ? '0' : '') + b.toString(16);
  }
  return hex;
}

/**
 * @param {string} path e.g. "/tnrs/match_names"
 * @param {Object} payload
 * @param {string} method "post"|"get"
 * @return {Object} { ok, status, data, error, endpoint, payload }
 */
function openTreeFetch_(path, payload, method) {
  var p = String(path || '').indexOf('/') === 0 ? path : '/' + path;
  var m = String(method || 'post').toLowerCase() === 'get' ? 'get' : 'post';
  var ep = MC_OT_BASE + p;
  var bodyObj = payload && typeof payload === 'object' ? payload : {};
  var cache = CacheService.getScriptCache();
  var cacheKey = MC_OT_CACHE_PREFIX + openTreeMd5Hex_(p + '|' + m + '|' + JSON.stringify(bodyObj));
  if (m === 'post') {
    try {
      var hit = cache.get(cacheKey);
      if (hit) {
        var parsed = JSON.parse(hit);
        return {
          ok: true,
          status: 200,
          data: parsed,
          error: null,
          endpoint: ep,
          payload: bodyObj,
          cached: true
        };
      }
    } catch (e0) {}
  }
  var options = {
    muteHttpExceptions: true,
    followRedirects: true,
    contentType: 'application/json',
    method: m === 'get' ? 'get' : 'post'
  };
  if (m === 'post') {
    options.payload = JSON.stringify(bodyObj);
  }
  var status = 0;
  var text = '';
  try {
    var resp = UrlFetchApp.fetch(ep, options);
    status = resp.getResponseCode();
    text = resp.getContentText() || '';
  } catch (e1) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: String(e1 && e1.message ? e1.message : e1),
      endpoint: ep,
      payload: bodyObj,
      cached: false
    };
  }
  var data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e2) {
      data = { _raw: text };
    }
  }
  var ok = status >= 200 && status < 300;
  if (ok && m === 'post' && text && text.length < 95000) {
    try {
      cache.put(cacheKey, text, MC_OT_CACHE_TTL_SEC);
    } catch (e3) {}
  }
  return {
    ok: ok,
    status: status,
    data: data,
    error: ok ? null : (text || 'HTTP ' + status),
    endpoint: ep,
    payload: bodyObj,
    cached: false
  };
}

function otGetContexts() {
  return openTreeFetch_('/tnrs/contexts', {}, 'post');
}

function otInferContext(names) {
  var arr = Array.isArray(names) ? names : [];
  return openTreeFetch_('/tnrs/infer_context', { names: arr }, 'post');
}

function otAutocompleteName(name, contextName) {
  return openTreeFetch_(
    '/tnrs/autocomplete_name',
    {
      name: String(name || ''),
      context_name: String(contextName || 'All life')
    },
    'post'
  );
}

function otMatchNames(names, contextName, approximate) {
  return openTreeFetch_(
    '/tnrs/match_names',
    {
      names: Array.isArray(names) ? names : [],
      context_name: String(contextName || 'All life'),
      do_approximate_matching: !!approximate
    },
    'post'
  );
}

function otTaxonInfo(ottId, options) {
  var o = options && typeof options === 'object' ? options : {};
  return openTreeFetch_(
    '/taxonomy/taxon_info',
    {
      ott_id: Number(ottId),
      include_lineage: o.include_lineage !== false,
      include_terminal_descendants: !!o.include_terminal_descendants,
      include_suppressed: !!o.include_suppressed
    },
    'post'
  );
}

function otTaxonomyMrca(ottIds) {
  return openTreeFetch_('/taxonomy/mrca', { ott_ids: normalizeOttIds_(ottIds) }, 'post');
}

function otTaxonomySubtree(ottId, labelFormat) {
  return openTreeFetch_(
    '/taxonomy/subtree',
    {
      ott_id: Number(ottId),
      label_format: String(labelFormat || 'name')
    },
    'post'
  );
}

function otSynthAbout(includeSourceList) {
  return openTreeFetch_('/tree_of_life/about', { include_source_list: !!includeSourceList }, 'post');
}

function otSynthNodeInfoByOttId(ottId, includeLineage) {
  return openTreeFetch_(
    '/tree_of_life/node_info',
    {
      ott_id: Number(ottId),
      include_lineage: includeLineage !== false
    },
    'post'
  );
}

function otSynthMrca(ottIds) {
  return openTreeFetch_('/tree_of_life/mrca', { ott_ids: normalizeOttIds_(ottIds) }, 'post');
}

function otSynthSubtreeByOttId(ottId, heightLimit, labelFormat) {
  return openTreeFetch_(
    '/tree_of_life/subtree',
    {
      ott_id: Number(ottId),
      height_limit: heightLimit == null ? 3 : Number(heightLimit),
      label_format: String(labelFormat || 'name')
    },
    'post'
  );
}

function otSynthInducedTree(ottIds, labelFormat) {
  return openTreeFetch_(
    '/tree_of_life/induced_subtree',
    {
      ott_ids: normalizeOttIds_(ottIds),
      label_format: String(labelFormat || 'name')
    },
    'post'
  );
}

function otFindTreesByTaxonName(taxonName) {
  return openTreeFetch_(
    '/studies/find_trees',
    {
      property: 'ot:focalCladeOTTTaxonName',
      value: String(taxonName || ''),
      verbose: true
    },
    'post'
  );
}

function otFindStudiesByFocalClade(taxonNameOrOttId) {
  var v = String(taxonNameOrOttId || '').trim();
  var prop = /^\d+$/.test(v) ? 'ot:focalCladeOTTId' : 'ot:focalCladeOTTTaxonName';
  return openTreeFetch_('/studies/find_studies', { property: prop, value: v, verbose: true }, 'post');
}

function otStudiesProperties() {
  return openTreeFetch_('/studies/properties', {}, 'post');
}

function otGetStudy(studyId) {
  var id = encodeURIComponent(String(studyId || '').replace(/^pg_/, ''));
  return openTreeFetch_('/study/' + id, {}, 'get');
}

function otGetStudyTree(studyId, treeId) {
  var sid = encodeURIComponent(String(studyId || '').replace(/^pg_/, ''));
  var tid = encodeURIComponent(String(treeId || ''));
  return openTreeFetch_('/study/' + sid + '/tree/' + tid, {}, 'get');
}

function normalizeOttIds_(ottIds) {
  if (!Array.isArray(ottIds)) return [];
  var out = [];
  for (var i = 0; i < ottIds.length; i++) {
    var n = Number(ottIds[i]);
    if (isFinite(n) && n > 0) out.push(n);
  }
  return out;
}

/** --- Evolution Tree project persistence (ScriptProperties) --- */

function evolutionTreeListIds_() {
  try {
    var raw = PropertiesService.getScriptProperties().getProperty(MC_OT_PROPS_LIST_KEY);
    if (!raw) return [];
    var arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function evolutionTreeWriteList_(ids) {
  PropertiesService.getScriptProperties().setProperty(MC_OT_PROPS_LIST_KEY, JSON.stringify(ids));
}

function saveEvolutionTreeProject(project) {
  var p = project && typeof project === 'object' ? project : {};
  var id = String(p.ProjectID || p.id || '').trim() || Utilities.getUuid();
  var now = new Date().toISOString();
  var row = {
    ProjectID: id,
    CreatedAt: p.CreatedAt || now,
    UpdatedAt: now,
    Title: String(p.Title || p.title || 'Untitled'),
    ContextName: String(p.ContextName || p.contextName || ''),
    InputNamesJson: JSON.stringify(p.InputNames || p.inputNames || []),
    MatchedTaxaJson: JSON.stringify(p.MatchedTaxa || p.matchedTaxa || []),
    OttIdsJson: JSON.stringify(p.OttIds || p.ottIds || []),
    Newick: String(p.Newick || p.newick || ''),
    TreeMode: String(p.TreeMode || p.treeMode || ''),
    Notes: String(p.Notes || p.notes || ''),
    SourceStudiesJson: JSON.stringify(p.SourceStudies || p.sourceStudies || []),
    ExportJson: JSON.stringify(p.ExportJson != null ? p.ExportJson : {})
  };
  var props = PropertiesService.getScriptProperties();
  props.setProperty(MC_OT_PROPS_PREFIX + id, JSON.stringify(row));
  var ids = evolutionTreeListIds_();
  if (ids.indexOf(id) < 0) {
    ids.push(id);
    evolutionTreeWriteList_(ids);
  }
  return { ok: true, projectId: id };
}

function listEvolutionTreeProjects() {
  var ids = evolutionTreeListIds_();
  var props = PropertiesService.getScriptProperties();
  var out = [];
  for (var i = 0; i < ids.length; i++) {
    try {
      var raw = props.getProperty(MC_OT_PROPS_PREFIX + ids[i]);
      if (raw) out.push(JSON.parse(raw));
    } catch (e) {}
  }
  out.sort(function (a, b) {
    return String(b.UpdatedAt || '').localeCompare(String(a.UpdatedAt || ''));
  });
  return { ok: true, projects: out };
}

function getEvolutionTreeProject(projectId) {
  var id = String(projectId || '').trim();
  if (!id) return { ok: false, error: 'missing id' };
  try {
    var raw = PropertiesService.getScriptProperties().getProperty(MC_OT_PROPS_PREFIX + id);
    if (!raw) return { ok: false, error: 'not found' };
    return { ok: true, project: JSON.parse(raw) };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

function deleteEvolutionTreeProject(projectId) {
  var id = String(projectId || '').trim();
  if (!id) return { ok: false, error: 'missing id' };
  PropertiesService.getScriptProperties().deleteProperty(MC_OT_PROPS_PREFIX + id);
  var ids = evolutionTreeListIds_().filter(function (x) {
    return x !== id;
  });
  evolutionTreeWriteList_(ids);
  return { ok: true };
}
