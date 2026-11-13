/**
 * MCurator — Evolution Tree Lab (Open Tree of Life v3)
 * Independent module; does not modify specimen / passport / SAT internals.
 */
(function (global) {
  'use strict';

  var SHELL_ID = 'mcEvolutionTreeLabShell';
  var ROOT_ID = 'mcEvolutionTreeLabRoot';
  var OT_BASE = 'https://api.opentreeoflife.org/v3';
  var ETL_ASIDE_WIDTH_LS = 'mc_etl_aside_width_v1';
  var ETL_BOTTOM_DOCK_LS = 'mc_etl_bottom_dock_v1';
  /** 地質時間對齊模式：SVG 內時間軸高度（與演化樹共用 pan／scale）；含「世」列時較高 */
  var ETL_GEO_TIME_AXIS_BAND_FULL = 92;
  var ETL_GEO_TIME_AXIS_BAND_COMPACT = 58;

  var CONTEXT_OPTIONS = [
    { v: 'All life', zh: '全部生物', en: 'All life' },
    { v: 'Animals', zh: '動物', en: 'Animals' },
    { v: 'Birds', zh: '鳥類', en: 'Birds' },
    { v: 'Mammals', zh: '哺乳類', en: 'Mammals' },
    { v: 'Insects', zh: '昆蟲', en: 'Insects' },
    { v: 'Plants', zh: '植物', en: 'Plants' },
    { v: 'Fungi', zh: '真菌', en: 'Fungi' },
    { v: 'Bacteria', zh: '細菌', en: 'Bacteria' },
    { v: 'Archaea', zh: '古菌', en: 'Archaea' }
  ];

  function isGas() {
    try {
      return (
        typeof google !== 'undefined' &&
        google.script &&
        google.script.run &&
        !google.script.run.__mcLocalMock
      );
    } catch (e) {
      return false;
    }
  }

  function isMissingI18nResult(s, key) {
    var str = String(s == null ? '' : s).trim();
    if (!str) return true;
    if (str === String(key)) return true;
    /* UI.html 本機預覽：缺鍵時 t() 回傳「（key·待補譯）」— 應改用具內建後備文案 */
    if (str.indexOf('待補譯') >= 0) return true;
    if (/^\[[\w.-]+\]$/.test(str)) return true;
    return false;
  }

  function etlIsZh() {
    try {
      if (typeof global.mcIsZhTW === 'function') return global.mcIsZhTW();
      if (typeof global.mcGetLang === 'function') return global.mcGetLang() === 'zh-TW';
    } catch (eMc) {
      void 0;
    }
    return true;
  }

  function tx(key, zh, en) {
    try {
      var copy = global.MCEvolutionTreeLabCopy || {};
      if (copy[key] && typeof global.mcPick === 'function') return global.mcPick(copy[key]);
      var fn = global.MCt || global.t;
      if (typeof fn === 'function') {
        var s = fn(key);
        if (!isMissingI18nResult(s, key)) return s;
      }
    } catch (e0) {}
    return etlIsZh() ? zh : en;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function uid() {
    return 'etl_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function parseNameLines(text) {
    return String(text || '')
      .split(/[\n,;]+/)
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean);
  }

  /** --- OpenTree client: direct fetch (local) or google.script.run shim --- */
  function gasCall(name, args) {
    return new Promise(function (resolve, reject) {
      try {
        var runner = google.script.run.withSuccessHandler(resolve).withFailureHandler(reject);
        if (name === 'otGetContexts') runner.otGetContexts();
        else if (name === 'otInferContext') runner.otInferContext(args[0]);
        else if (name === 'otAutocompleteName') runner.otAutocompleteName(args[0], args[1]);
        else if (name === 'otMatchNames') runner.otMatchNames(args[0], args[1], args[2]);
        else if (name === 'otTaxonInfo') runner.otTaxonInfo(args[0], args[1] || {});
        else if (name === 'otTaxonomyMrca') runner.otTaxonomyMrca(args[0]);
        else if (name === 'otTaxonomySubtree') runner.otTaxonomySubtree(args[0], args[1]);
        else if (name === 'otSynthAbout') runner.otSynthAbout(!!args[0]);
        else if (name === 'otSynthNodeInfoByOttId') runner.otSynthNodeInfoByOttId(args[0], args[1] !== false);
        else if (name === 'otSynthMrca') runner.otSynthMrca(args[0]);
        else if (name === 'otSynthSubtreeByOttId') runner.otSynthSubtreeByOttId(args[0], args[1], args[2]);
        else if (name === 'otSynthInducedTree') runner.otSynthInducedTree(args[0], args[1]);
        else if (name === 'otFindTreesByTaxonName') runner.otFindTreesByTaxonName(args[0]);
        else if (name === 'otFindStudiesByFocalClade') runner.otFindStudiesByFocalClade(args[0]);
        else if (name === 'saveEvolutionTreeProject') runner.saveEvolutionTreeProject(args[0]);
        else if (name === 'listEvolutionTreeProjects') runner.listEvolutionTreeProjects();
        else if (name === 'getEvolutionTreeProject') runner.getEvolutionTreeProject(args[0]);
        else if (name === 'deleteEvolutionTreeProject') runner.deleteEvolutionTreeProject(args[0]);
        else if (name === 'afriGisGeologyProxy') runner.afriGisGeologyProxy(args[0]);
        else reject(new Error('unknown rpc ' + name));
      } catch (e) {
        reject(e);
      }
    });
  }

  var LOCAL_BODY = {
    otGetContexts: {},
    otInferContext: function (a) {
      return { names: a[0] };
    },
    otAutocompleteName: function (a) {
      return { name: a[0], context_name: a[1] || 'All life' };
    },
    otMatchNames: function (a) {
      return { names: a[0], context_name: a[1] || 'All life', do_approximate_matching: !!a[2] };
    },
    otTaxonInfo: function (a) {
      return {
        ott_id: Number(a[0]),
        include_lineage: (a[1] && a[1].include_lineage) !== false,
        include_terminal_descendants: !!(a[1] && a[1].include_terminal_descendants),
        include_suppressed: !!(a[1] && a[1].include_suppressed)
      };
    },
    otTaxonomyMrca: function (a) {
      return { ott_ids: a[0] };
    },
    otTaxonomySubtree: function (a) {
      return { ott_id: Number(a[0]), label_format: String(a[1] || 'name') };
    },
    otSynthAbout: function (a) {
      return { include_source_list: !!a[0] };
    },
    otSynthNodeInfoByOttId: function (a) {
      return { ott_id: Number(a[0]), include_lineage: a[1] !== false };
    },
    otSynthMrca: function (a) {
      return { ott_ids: a[0] };
    },
    otSynthSubtreeByOttId: function (a) {
      return {
        ott_id: Number(a[0]),
        height_limit: a[1] == null ? 3 : Number(a[1]),
        label_format: String(a[2] || 'name')
      };
    },
    otSynthInducedTree: function (a) {
      return { ott_ids: a[0], label_format: String(a[1] || 'name') };
    },
    otFindTreesByTaxonName: function (a) {
      return { property: 'ot:focalCladeOTTTaxonName', value: String(a[0] || ''), verbose: true };
    },
    otFindStudiesByFocalClade: function (a) {
      var v = String(a[0] || '').trim();
      var prop = /^\d+$/.test(v) ? 'ot:focalCladeOTTId' : 'ot:focalCladeOTTTaxonName';
      return { property: prop, value: v, verbose: true };
    }
  };

  var LOCAL_PATH = {
    otGetContexts: '/tnrs/contexts',
    otInferContext: '/tnrs/infer_context',
    otAutocompleteName: '/tnrs/autocomplete_name',
    otMatchNames: '/tnrs/match_names',
    otTaxonInfo: '/taxonomy/taxon_info',
    otTaxonomyMrca: '/taxonomy/mrca',
    otTaxonomySubtree: '/taxonomy/subtree',
    otSynthAbout: '/tree_of_life/about',
    otSynthNodeInfoByOttId: '/tree_of_life/node_info',
    otSynthMrca: '/tree_of_life/mrca',
    otSynthSubtreeByOttId: '/tree_of_life/subtree',
    otSynthInducedTree: '/tree_of_life/induced_subtree',
    otFindTreesByTaxonName: '/studies/find_trees',
    otFindStudiesByFocalClade: '/studies/find_studies'
  };

  function localFetch(name, args) {
    var path = LOCAL_PATH[name];
    if (!path) return Promise.reject(new Error('no path ' + name));
    var body = LOCAL_BODY[name] ? LOCAL_BODY[name](args) : {};
    return fetch(OT_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.text().then(function (t) {
        var data = null;
        try {
          data = t ? JSON.parse(t) : null;
        } catch (e) {
          data = { _raw: t };
        }
        return { ok: r.ok, status: r.status, data: data, error: r.ok ? null : t };
      });
    });
  }

  function otRpc(name, args) {
    args = args || [];
    if (isGas()) return gasCall(name, args);
    return localFetch(name, args);
  }

  /** --- Newick (minimal) --- */
  function parseNewick(s) {
    var str = String(s || '').trim();
    if (!str) return null;
    var i = 0;
    function peek() {
      return str.charAt(i);
    }
    function skipws() {
      while (/\s/.test(peek())) i++;
    }
    function readLabel(term) {
      var buf = '';
      skipws();
      while (i < str.length && term.indexOf(peek()) < 0) {
        buf += peek();
        i++;
      }
      return buf.trim();
    }
    function parseNode() {
      skipws();
      if (peek() === '(') {
        i++;
        var kids = [];
        while (true) {
          kids.push(parseNode());
          skipws();
          if (peek() === ',') {
            i++;
            continue;
          }
          if (peek() === ')') break;
          if (i >= str.length) break;
        }
        if (peek() === ')') i++;
        var name = readLabel('):,;');
        var blen = 0;
        if (peek() === ':') {
          i++;
          var nb = readLabel('),;');
          blen = parseFloat(nb) || 0;
        }
        return { children: kids, name: name, branch: blen, _tip: false };
      }
      var nm = readLabel(':),;');
      var br = 0;
      if (peek() === ':') {
        i++;
        var nb2 = readLabel('),;');
        br = parseFloat(nb2) || 0;
      }
      return { children: [], name: nm, branch: br, _tip: true };
    }
    var root = parseNode();
    skipws();
    if (peek() === ';') i++;
    return root;
  }

  function countTips(n) {
    if (!n) return 0;
    if (!n.children || !n.children.length) return 1;
    var t = 0;
    for (var j = 0; j < n.children.length; j++) t += countTips(n.children[j]);
    return t;
  }

  function formatPhyloDisplayName(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    var cut = s.split(':')[0];
    var idx = cut.toLowerCase().indexOf('_ott');
    if (idx > 0) cut = cut.slice(0, idx);
    cut = cut.replace(/^mrcaott[0-9_]+/i, '');
    cut = cut.replace(/_/g, ' ').trim();
    return cut || s.slice(0, 48);
  }

  /** Unicode dagger U+2020 — standard marker for extinct species before the scientific name. */
  var PHYLO_EXTINCT_DAGGER = '\u2020';

  function stripLeadingPhyloDagger(s) {
    var t = String(s || '').trim();
    if (t.charAt(0) === PHYLO_EXTINCT_DAGGER) return t.slice(1).trim();
    return t;
  }

  /** Curated extinct-only clades / genera (lowercase first token); uncertain taxa omitted. */
  var ETL_EXTINCT_NAME_HINTS = {
    trilobita: 1,
    trilobite: 1,
    ammonoidea: 1,
    ammonite: 1,
    ammonoids: 1,
    anomalocaris: 1,
    tiktaalik: 1,
    eurypterida: 1,
    opabinia: 1,
    hallucigenia: 1,
    pikaia: 1,
    dinornis: 1,
    moa: 1,
    mammuthus: 1,
    mastodon: 1,
    smilodon: 1,
    megatherium: 1,
    glyptodon: 1,
    ichtyosauria: 1,
    ichthyosaur: 1,
    mosasaurus: 1,
    pteranodon: 1,
    archaeopteryx: 1,
    velociraptor: 1,
    tyrannosaurus: 1,
    stegosaurus: 1,
    dimetrodon: 1
  };

  function inferExtinctFromLabels(displayName, rawName) {
    var s = stripLeadingPhyloDagger(String(displayName || '').trim()).toLowerCase();
    if (!s) s = String(rawName || '').toLowerCase();
    var first = s.split(/[\s_(]/)[0].replace(/[^a-z0-9]/gi, '');
    if (first && ETL_EXTINCT_NAME_HINTS[first]) return true;
    return false;
  }

  /**
   * Prefix † when tray marks extinct OR curated extinct-hint list (PBDB-enriched rows preferred).
   */
  function phyloLabelWithExtinctDagger(displayName, ottFromLabel, taxaRows, rawName) {
    var base = String(displayName || '').trim();
    if (!base) return base;
    if (base.indexOf('姊妹群') >= 0) return base;
    if (base.charAt(0) === PHYLO_EXTINCT_DAGGER) return base;
    var ott = Number(ottFromLabel) || 0;
    if (taxaRows && taxaRows.length) {
      for (var i = 0; i < taxaRows.length; i++) {
        var r = taxaRows[i];
        if (Number(r.ottId) === ott && r.extinctStatus === 'extinct') return PHYLO_EXTINCT_DAGGER + base;
      }
    }
    if (inferExtinctFromLabels(base, rawName)) return PHYLO_EXTINCT_DAGGER + base;
    return base;
  }

  /** Ladder Newick: single spine root→tip (preserves raw tip label including _ott). */
  function newickLadderFromTip(root, tipPath) {
    var tip = getNodeByPath(root, tipPath);
    if (!tip) return '';
    var chain = [];
    var p = tip;
    while (p) {
      chain.unshift(p.name || '');
      p = p._parent;
    }
    if (!chain.length) return '';
    var s = chain[0];
    for (var j = 1; j < chain.length; j++) {
      s = '(' + s + ')' + chain[j];
    }
    return s + ';';
  }

  function treeHasPathInKeepSet(n, keepSet) {
    if (!n || !keepSet) return false;
    if (keepSet[n._path]) return true;
    if (!n.children || !n.children.length) return false;
    for (var i = 0; i < n.children.length; i++) if (treeHasPathInKeepSet(n.children[i], keepSet)) return true;
    return false;
  }

  function clonePrunedByPathSet(n, keepSet) {
    if (!n || !keepSet || !treeHasPathInKeepSet(n, keepSet)) return null;
    var copy = { name: n.name, branch: n.branch, children: [], _tip: true };
    if (n.children && n.children.length) {
      for (var j = 0; j < n.children.length; j++) {
        var sub = clonePrunedByPathSet(n.children[j], keepSet);
        if (sub) copy.children.push(sub);
      }
    }
    if (!copy.children.length) copy._tip = true;
    else copy._tip = false;
    return copy;
  }

  function markSubtreeFull(n, keepSet) {
    if (!n) return;
    if (n._path) keepSet[n._path] = true;
    if (n.children) for (var i = 0; i < n.children.length; i++) markSubtreeFull(n.children[i], keepSet);
  }

  function markSubtreeByDepth(n, keepSet, depthLeft) {
    if (!n || depthLeft < 0) return;
    if (n._path) keepSet[n._path] = true;
    if (depthLeft === 0) return;
    if (n.children) for (var k = 0; k < n.children.length; k++) markSubtreeByDepth(n.children[k], keepSet, depthLeft - 1);
  }

  /**
   * Keep root→tip path plus lateral context for lineage+nearby / sister / nearby display modes.
   * Requires annotateTreePaths() on fullRoot first.
   */
  function lineageNearbyKeepSet(fullRoot, tipPath, dm) {
    var tip = getNodeByPath(fullRoot, tipPath);
    if (!tip) return null;
    var pathNodes = [];
    var c = tip;
    while (c) {
      pathNodes.unshift(c);
      c = c._parent;
    }
    var keep = {};
    for (var pi = 0; pi < pathNodes.length; pi++) {
      if (pathNodes[pi]._path) keep[pathNodes[pi]._path] = true;
    }
    var escope = Math.max(0, Math.min(3, Number(state.expansionScope) || 0));
    if (dm === 'lineage_nearby') {
      if (escope === 0) return keep;
      var sibDepth = escope === 1 ? 999 : escope === 2 ? 7 : 12;
      for (var j = 0; j < pathNodes.length - 1; j++) {
        var parent = pathNodes[j];
        var nextP = pathNodes[j + 1];
        if (!parent.children) continue;
        for (var x = 0; x < parent.children.length; x++) {
          var ch = parent.children[x];
          if (ch === nextP) continue;
          if (escope === 1) markSubtreeFull(ch, keep);
          else markSubtreeByDepth(ch, keep, sibDepth);
        }
      }
      return keep;
    }
    if (dm === 'sister') {
      for (var j2 = 0; j2 < pathNodes.length - 1; j2++) {
        var p2 = pathNodes[j2];
        var np2 = pathNodes[j2 + 1];
        if (!p2.children) continue;
        for (var x2 = 0; x2 < p2.children.length; x2++) {
          var ch2 = p2.children[x2];
          if (ch2 === np2) continue;
          markSubtreeFull(ch2, keep);
        }
      }
      return keep;
    }
    if (dm === 'nearby') {
      var depthNear = 3 + escope * 3;
      for (var j3 = 0; j3 < pathNodes.length - 1; j3++) {
        var p3 = pathNodes[j3];
        var np3 = pathNodes[j3 + 1];
        if (!p3.children) continue;
        for (var x3 = 0; x3 < p3.children.length; x3++) {
          var ch3 = p3.children[x3];
          if (ch3 === np3) continue;
          markSubtreeByDepth(ch3, keep, depthNear);
        }
      }
      return keep;
    }
    return null;
  }

  /**
   * Apply display mode to parsed tree before layout (single lineage / minimal = ladder only).
   */
  function treeForDisplayMode(fullRoot) {
    if (!fullRoot) return fullRoot;
    var dm = state.displayMode || 'standard';
    var pathFocus = state.selectedPath || state.focusPath || '';
    if ((dm === 'single_lineage' || dm === 'minimal') && pathFocus) {
      var nw = newickLadderFromTip(fullRoot, pathFocus);
      if (nw) {
        var t2 = parseNewick(nw);
        if (t2) return t2;
      }
    }
    if ((dm === 'lineage_nearby' || dm === 'sister' || dm === 'nearby') && pathFocus) {
      var ks = lineageNearbyKeepSet(fullRoot, pathFocus, dm);
      if (ks && Object.keys(ks).length) {
        var pr = clonePrunedByPathSet(fullRoot, ks);
        if (pr) return pr;
      }
    }
    return fullRoot;
  }

  function extractOttFromLabel(raw) {
    var m = String(raw || '').match(/_ott(\d+)/i);
    return m ? Number(m[1]) : 0;
  }

  /** Representative sister clade labels (示意) keyed by focal taxon name (lowercase, no spaces). */
  var SIBLING_HINTS = {
    arthropoda: ['Chelicerata', 'Crustacea', 'Myriapoda', 'Hexapoda'],
    chordata: ['Tunicata', 'Cephalochordata', 'Vertebrata'],
    mammalia: ['Carnivora', 'Cetacea', 'Rodentia', 'Chiroptera'],
    insecta: ['Coleoptera', 'Lepidoptera', 'Diptera', 'Hymenoptera'],
    eukaryota: ['Archaea', 'Bacteria'],
    animalia: ['Porifera', 'Cnidaria', 'Platyhelminthes', 'Mollusca']
  };

  /**
   * Parse OpenTree taxonomy/taxon_info body → lineage root→tip including focal taxon.
   * OpenTree: lineage[] is least-inclusive (near focal) at low index, broad taxa at high index.
   */
  function parseTaxonInfoRootToTip(apiData) {
    if (!apiData || typeof apiData !== 'object') return [];
    var focal = apiData.taxon && typeof apiData.taxon === 'object' ? apiData.taxon : apiData;
    var focalName = String(focal.name || focal.unique_name || '').trim();
    var focalOtt = Number(focal.ott_id || focal.primary_ott_id || apiData.ott_id || 0);
    var focalRank = String(focal.rank || '').trim();
    var li = Array.isArray(apiData.lineage) ? apiData.lineage : [];
    var chain = [];
    for (var i = li.length - 1; i >= 0; i--) {
      var it = li[i] || {};
      var nm = String(it.name || it.unique_name || '').trim();
      var oid = Number(it.ott_id || it.primary_ott_id || 0);
      var rk = String(it.rank || '').trim();
      if (nm) chain.push({ name: nm, ott_id: oid, rank: rk });
    }
    if (focalName) chain.push({ name: focalName, ott_id: focalOtt, rank: focalRank });
    return chain;
  }

  function siblingStubsForTaxon(taxonName) {
    var k = String(taxonName || '')
      .toLowerCase()
      .replace(/\s+/g, '');
    return SIBLING_HINTS[k] ? SIBLING_HINTS[k].slice() : [];
  }

  function buildPositionTreeObject(rootToTip) {
    if (!rootToTip || !rootToTip.length) return null;
    function at(i) {
      var t = rootToTip[i];
      var isLast = i === rootToTip.length - 1;
      if (isLast) {
        return {
          name: t.name,
          ott: t.ott_id,
          rank: t.rank,
          children: [],
          _targetTip: true
        };
      }
      var child = at(i + 1);
      var stubs = siblingStubsForTaxon(t.name);
      var kids = [child];
      for (var s = 0; s < stubs.length; s++) {
        kids.push({
          name: stubs[s] + '（姊妹群示意）',
          ott: 0,
          rank: 'clade',
          children: [],
          _siblingStub: true
        });
      }
      return { name: t.name, ott: t.ott_id, rank: t.rank, children: kids };
    }
    return at(0);
  }

  function _nwSanitize(nm) {
    return String(nm || '')
      .replace(/\s+/g, '_')
      .replace(/[():,;]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  function positionObjectToNewick(root) {
    if (!root) return '';
    function walk(n) {
      if (!n.children || !n.children.length) {
        return _nwSanitize(n.name) + '_ott' + (n.ott ? Number(n.ott) : 0);
      }
      var inner = n.children.map(walk).join(',');
      return '(' + inner + ')' + _nwSanitize(n.name) + '_ott' + (n.ott ? Number(n.ott) : 0);
    }
    return walk(root) + ';';
  }

  function annotateTreePaths(node, path, parent) {
    if (!node) return;
    node._path = path;
    node._parent = parent || null;
    node.displayName = formatPhyloDisplayName(node.name);
    node.ottFromLabel = extractOttFromLabel(node.name);
    if (node.children && node.children.length) {
      for (var i = 0; i < node.children.length; i++) {
        annotateTreePaths(node.children[i], path + '-' + i, node);
      }
    }
  }

  function collectTipsOrdered(n, arr) {
    if (!n) return;
    if (!n.children || !n.children.length) {
      arr.push(n);
      return;
    }
    for (var i = 0; i < n.children.length; i++) collectTipsOrdered(n.children[i], arr);
  }

  /** Reduce vertical label overlap by packing leaf Y then re-averaging internal nodes. */
  function postPackLeafYs(root, minGap) {
    minGap = Math.max(28, Number(minGap) || 40);
    var tips = [];
    collectTipsOrdered(root, tips);
    tips.sort(function (a, b) {
      return a._y - b._y;
    });
    var prev = -1e9;
    for (var i = 0; i < tips.length; i++) {
      if (tips[i]._y < prev + minGap) tips[i]._y = prev + minGap;
      prev = tips[i]._y;
    }
    function pullUp(n) {
      if (!n.children || !n.children.length) return n._y;
      var s = 0;
      for (var j = 0; j < n.children.length; j++) s += pullUp(n.children[j]);
      n._y = s / n.children.length;
      return n._y;
    }
    pullUp(root);
  }

  function layoutHorizontalPhylogram(root, opts) {
    opts = opts || {};
    function maxDepth_(n, d) {
      if (!n.children || !n.children.length) return d;
      var mx = d;
      for (var j = 0; j < n.children.length; j++) mx = Math.max(mx, maxDepth_(n.children[j], d + 1));
      return mx;
    }
    var tipsPre = [];
    collectTipsOrdered(root, tipsPre);
    var tipCount = Math.max(tipsPre.length, 1);
    var ldPack = opts.labelDensity || 'standard';
    var YSP0 =
      opts.rowHeight || Math.min(68, Math.max(44, Math.floor(640 / Math.sqrt(tipCount + 3))));
    var YSP =
      ldPack === 'detailed'
        ? Math.min(88, Math.ceil(YSP0 * 1.14))
        : ldPack === 'minimal'
          ? Math.max(40, Math.floor(YSP0 * 0.9))
          : YSP0;
    var XGAP = opts.xGap || Math.min(44, Math.max(28, 320 / (maxDepth_(root, 0) + 4)));
    var timeAxisBand = Math.max(0, Math.floor(Number(opts.timeAxisBand) || 0));
    var margin = { l: 24, t: 28 + timeAxisBand, r: opts.marginRight != null ? opts.marginRight : 300, b: 40 };

    var leafN = 0;
    function assignY(n) {
      if (!n.children || !n.children.length) {
        n._y = margin.t + leafN * YSP;
        leafN++;
        return n._y;
      }
      var sum = 0;
      for (var i = 0; i < n.children.length; i++) sum += assignY(n.children[i]);
      n._y = sum / n.children.length;
      return n._y;
    }
    assignY(root);
    var packGap =
      opts.labelMinGap != null
        ? opts.labelMinGap
        : ldPack === 'detailed'
          ? Math.max(52, YSP - 1)
          : ldPack === 'minimal'
            ? Math.max(34, YSP - 8)
            : Math.max(46, YSP - 2);
    postPackLeafYs(root, packGap);

    var D = Math.max(maxDepth_(root, 0), 1);
    var X_LEAF = margin.l + D * XGAP + 56;

    function assignX(n) {
      if (!n.children || !n.children.length) {
        n._x = X_LEAF;
        return n._x;
      }
      var minC = Infinity;
      for (var k = 0; k < n.children.length; k++) minC = Math.min(minC, assignX(n.children[k]));
      n._x = minC - XGAP;
      return n._x;
    }
    assignX(root);
    var shift = margin.l - root._x;
    if (shift > 2) {
      function shiftAll(n) {
        n._x += shift;
        if (n.children) for (var z = 0; z < n.children.length; z++) shiftAll(n.children[z]);
      }
      shiftAll(root);
    }

    var tipsW = [];
    collectTipsOrdered(root, tipsW);
    var maxTipSpan = 0;
    for (var wi = 0; wi < tipsW.length; wi++) {
      var tn = tipsW[wi];
      var labW = tn.displayName || formatPhyloDisplayName(tn.name || '');
      var wpx = approxTipLabelWidthPx(labW.length > 42 ? labW.slice(0, 40) + '…' : labW) + 76;
      if (wpx > maxTipSpan) maxTipSpan = wpx;
    }
    if (maxTipSpan > 0) margin.r = Math.max(margin.r, Math.min(580, maxTipSpan));

    var height = Math.max(margin.t + margin.b + leafN * YSP + 24, 200 + timeAxisBand);
    var width = Math.max(X_LEAF + margin.r, 520);
    return { width: width, height: height, margin: margin, leafCount: leafN, yStep: YSP, timeAxisBand: timeAxisBand };
  }

  /** 地質時間軸（SVG）：置於與樹相同的 mc-etl-phylo-pan 內，縮放／平移時與演化樹對齊 */
  function pushGeologicTimeAxisSvgRows(svg, w, band, showEpoch) {
    if (!band || w < 80) return;
    showEpoch = !!showEpoch;
    var hE;
    var hP;
    var hEp;
    var yE = 0;
    var yP;
    var yEp;
    if (showEpoch) {
      hE = Math.max(22, Math.floor(band * 0.32));
      hP = Math.max(22, Math.floor(band * 0.34));
      hEp = Math.max(18, band - hE - hP);
      yP = yE + hE;
      yEp = yP + hP;
    } else {
      hEp = 0;
      hE = Math.max(24, Math.floor(band * 0.5));
      hP = Math.max(24, band - hE);
      yP = yE + hE;
      yEp = yP + hP;
    }
    var fsE = 11;
    var fsP = 9;
    var fsEp = 8;
    svg.push(
      '<g class="mc-etl-geo-time-axis" pointer-events="none" aria-hidden="true">' +
        '<title>' +
        esc(tx('etl_timegrid_aria', '地質年代參考軸：代與紀', 'Geologic reference')) +
        '</title>'
    );
    var i;
    var seg = w / 4;
    var eraFill = ['#4a3d5c', '#2d5a4a', '#5a4a2d', '#2d4a6a'];
    var eraLab = [
      tx('etl_era_pc', '前寒武紀', 'Precambrian'),
      tx('etl_era_pz', '古生代', 'Paleozoic'),
      tx('etl_era_mz', '中生代', 'Mesozoic'),
      tx('etl_era_cz', '新生代', 'Cenozoic')
    ];
    for (i = 0; i < 4; i++) {
      var ex = i * seg;
      svg.push(
        '<rect class="mc-etl-geo-era-cell" x="' +
          ex +
          '" y="' +
          yE +
          '" width="' +
          seg +
          '" height="' +
          hE +
          '" fill="' +
          eraFill[i] +
          '" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>'
      );
      svg.push(
        '<text x="' +
          (ex + seg / 2) +
          '" y="' +
          (yE + hE / 2 + fsE * 0.35) +
          '" text-anchor="middle" fill="rgba(236,246,240,0.92)" font-size="' +
          fsE +
          '" font-weight="700" font-family="Noto Sans TC, Microsoft JhengHei, PingFang TC, sans-serif">' +
          esc(eraLab[i]) +
          '</text>'
      );
    }
    var pr = [2.1, 1.6, 1.4, 1.4, 1.8, 1.2, 1.1, 0.9];
    var prSum = 0;
    for (i = 0; i < pr.length; i++) prSum += pr[i];
    var pLab = [
      tx('etl_p_camb', '寒武—泥盆', 'Cm–D'),
      tx('etl_p_carb', '石炭—二疊', 'C–P'),
      tx('etl_p_tri', '三疊', 'T'),
      tx('etl_p_jur', '侏羅', 'J'),
      tx('etl_p_cret', '白堊', 'K'),
      tx('etl_p_paleo', '古近紀', 'Pg'),
      tx('etl_p_neo', '新近紀', 'Ng'),
      tx('etl_p_q', '第四紀', 'Q')
    ];
    var pFill = 'rgba(255,255,255,0.06)';
    var cx = 0;
    for (i = 0; i < pr.length; i++) {
      var pw = (w * pr[i]) / prSum;
      svg.push(
        '<rect x="' +
          cx +
          '" y="' +
          yP +
          '" width="' +
          pw +
          '" height="' +
          hP +
          '" fill="' +
          pFill +
          '" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>'
      );
      svg.push(
        '<text x="' +
          (cx + pw / 2) +
          '" y="' +
          (yP + hP / 2 + fsP * 0.35) +
          '" text-anchor="middle" fill="rgba(230,240,235,0.78)" font-size="' +
          fsP +
          '" font-weight="700" font-family="Noto Sans TC, Microsoft JhengHei, sans-serif">' +
          esc(pLab[i]) +
          '</text>'
      );
      cx += pw;
    }
    var epN = 5;
    var ew = w / epN;
    var eLab = [
      tx('etl_ep_paleo', '古新—漸新', 'Pg–O'),
      tx('etl_ep_mio', '中新世', 'Mi'),
      tx('etl_ep_plio', '上新世', 'Pl'),
      tx('etl_ep_pleis', '更新世', 'Ple'),
      tx('etl_ep_holo', '全新世', 'Hol')
    ];
    if (showEpoch && hEp > 10) {
      for (i = 0; i < epN; i++) {
        var ex2 = i * ew;
        svg.push(
          '<rect x="' +
            ex2 +
            '" y="' +
            yEp +
            '" width="' +
            ew +
            '" height="' +
            hEp +
            '" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>'
        );
        svg.push(
          '<text x="' +
            (ex2 + ew / 2) +
            '" y="' +
            (yEp + hEp / 2 + fsEp * 0.35) +
            '" text-anchor="middle" fill="rgba(220,232,226,0.72)" font-size="' +
            fsEp +
            '" font-weight="650" font-family="Noto Sans TC, Microsoft JhengHei, sans-serif">' +
            esc(eLab[i]) +
            '</text>'
        );
      }
    }
    svg.push('</g>');
  }

  function pathPrefixes(pathStr) {
    var parts = String(pathStr || '').split('-').filter(function (p) {
      return p !== '';
    });
    var out = {};
    var acc = '';
    for (var i = 0; i < parts.length; i++) {
      acc = i === 0 ? parts[0] : acc + '-' + parts[i];
      out[acc] = true;
    }
    return out;
  }

  function getNodeByPath(root, pathStr) {
    if (!root || pathStr == null || pathStr === '') return null;
    var parts = String(pathStr).split('-');
    var n = root;
    if (parts[0] !== '0') return null;
    for (var i = 1; i < parts.length; i++) {
      var idx = parseInt(parts[i], 10);
      if (!n.children || idx >= n.children.length) return null;
      n = n.children[idx];
    }
    return n;
  }

  function collectTips(n, arr) {
    if (!n) return;
    if (!n.children || !n.children.length) {
      arr.push(n);
      return;
    }
    for (var i = 0; i < n.children.length; i++) collectTips(n.children[i], arr);
  }

  function findTipPathForTaxon(root, row) {
    var tips = [];
    collectTips(root, tips);
    var wantOtt = row && row.ottId ? Number(row.ottId) : 0;
    var wantName = String(row && (row.matchedName || row.uniqueName || row.inputName) || '')
      .split('(')[0]
      .trim()
      .toLowerCase();
    var best = null;
    var bestScore = -1;
    for (var t = 0; t < tips.length; t++) {
      var tip = tips[t];
      var sc = 0;
      var tipOtt = Number(tip.ottFromLabel) || extractOttFromLabel(tip.name);
      if (wantOtt && tipOtt === Number(wantOtt)) sc = 100;
      else if (wantName && tip.displayName && tip.displayName.toLowerCase().indexOf(wantName) === 0) sc = 80;
      else if (wantName && wantName.length > 4 && tip.displayName && tip.displayName.toLowerCase().indexOf(wantName.split(' ')[0]) >= 0) sc = 50;
      if (sc > bestScore) {
        bestScore = sc;
        best = tip;
      }
    }
    if (best && bestScore >= 50) return { path: best._path, tip: best, score: bestScore };
    if (best && bestScore > 0) return { path: best._path, tip: best, score: bestScore, weak: true };
    return null;
  }

  function lineageFromTip(tip) {
    var taxaRows = (state && state.taxa) || [];
    var chain = [];
    var p = tip;
    while (p) {
      var raw = p.displayName || formatPhyloDisplayName(p.name);
      chain.push(phyloLabelWithExtinctDagger(raw, p.ottFromLabel, taxaRows, p.name));
      p = p._parent;
    }
    chain.reverse();
    return chain;
  }

  function mediaUrlForPath(root, pathStr, taxaRows) {
    var n = getNodeByPath(root, pathStr);
    if (!n) return '';
    var ott = n.ottFromLabel;
    for (var i = 0; i < taxaRows.length; i++) {
      var r = taxaRows[i];
      if (ott && r.ottId === ott && r.media && r.media.thumbnailUrl) return r.media.thumbnailUrl;
    }
    var dn = (n.displayName || '').toLowerCase();
    for (var j = 0; j < taxaRows.length; j++) {
      var r2 = taxaRows[j];
      var mn = String(r2.matchedName || '')
        .toLowerCase()
        .split('(')[0]
        .trim();
      if (mn && (dn === mn || dn.indexOf(mn) === 0 || mn.indexOf(dn) === 0) && r2.media && r2.media.thumbnailUrl) {
        return r2.media.thumbnailUrl;
      }
    }
    if (global.MCEvolutionTreeServices && typeof global.MCEvolutionTreeServices.representativeThumbForTaxonName === 'function') {
      var nmRep = String(n.displayName || n.name || '')
        .replace(/（姊妹群示意）/g, '')
        .replace(/（示意）/g, '')
        .trim();
      var rep = global.MCEvolutionTreeServices.representativeThumbForTaxonName(nmRep || n.displayName || n.name);
      if (rep && rep.url) return rep.url;
    }
    return '';
  }

  function approxTipLabelWidthPx(label) {
    var s = String(label || '');
    var wide = /[\u3000-\u9fff\uac00-\ud7af]/.test(s);
    var per = wide ? 10.5 : 6.4;
    return Math.min(300, Math.max(72, Math.ceil(s.length * per)));
  }

  /** Approximate width for internal labels (smaller font than tips). */
  function approxInternalLabelWidthPx(label) {
    var disp = String(label || '');
    if (disp.length > 32) disp = disp.slice(0, 30) + '…';
    var wide = /[\u3000-\u9fff\uac00-\ud7af]/.test(disp);
    var per = wide ? 9.2 : 5.6;
    return Math.min(260, Math.max(36, Math.ceil(disp.length * per + 10)));
  }

  /**
   * Nudge internal label Y only (_labelDy) so names on the same spine do not stack.
   * Branch geometry still uses _y; only <text> y is offset.
   */
  function packInternalLabelPositions(root, hi, lay) {
    function clearDy(n) {
      if (!n) return;
      n._labelDy = 0;
      if (n.children) for (var c = 0; c < n.children.length; c++) clearDy(n.children[c]);
    }
    clearDy(root);

    var leafN = lay && lay.leafCount != null ? lay.leafCount : 48;
    function shouldShowInternal(n) {
      var label = n.displayName || '';
      if (!label || label.length >= 48) return false;
      if (!n.children || !n.children.length) return false;
      var onLineage = !!(hi && hi[n._path]);
      var demoish = label.indexOf('示意') >= 0 || label.indexOf('姊妹') >= 0;
      if (demoish && !onLineage) return false;
      return onLineage || leafN <= 40;
    }

    var items = [];
    function gather(n) {
      if (!n || !n.children || !n.children.length) return;
      var label = n.displayName || '';
      if (shouldShowInternal(n)) {
        /* Keep labels above the horizontal branch (runs at n._y) so straight lines do not bisect text */
        var tx = n._x - 12;
        var w = approxInternalLabelWidthPx(label);
        items.push({
          n: n,
          cx: n._x,
          baseY: n._y - 14,
          halfH: 11,
          xL: tx - w,
          xR: tx + 4
        });
      }
      for (var j = 0; j < n.children.length; j++) gather(n.children[j]);
    }
    gather(root);
    if (!items.length) return;

    items.sort(function (a, b) {
      if (Math.abs(a.cx - b.cx) > 8) return a.cx - b.cx;
      return a.baseY - b.baseY;
    });

    var GAP = 6;
    var placed = [];
    function bbox(dy, it) {
      return {
        x0: it.xL - GAP,
        x1: it.xR + GAP,
        y0: it.baseY + dy - it.halfH,
        y1: it.baseY + dy + it.halfH
      };
    }
    function overlaps(A, B) {
      return !(A.x1 < B.x0 || A.x0 > B.x1 || A.y1 < B.y0 || A.y0 > B.y1);
    }

    var tries = [
      0, 14, -14, 28, -28, 42, -42, 56, -56, 10, -10, 20, -20, 34, -34, 48, -48, 8, -8, 22, -22, 38, -38, 52, -52
    ];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var placedHere = false;
      for (var t = 0; t < tries.length; t++) {
        var dy = tries[t];
        var cand = bbox(dy, it);
        var hit = false;
        for (var p = 0; p < placed.length; p++) {
          if (overlaps(cand, placed[p])) {
            hit = true;
            break;
          }
        }
        if (!hit) {
          placed.push(cand);
          it.n._labelDy = dy;
          placedHere = true;
          break;
        }
      }
      if (!placedHere) {
        var fallback = ((i * 7) % 11) - 5;
        it.n._labelDy = fallback * 9;
      }
    }
  }

  function renderPhyloSvgHorizontal(root, opts) {
    opts = opts || {};
    annotateTreePaths(root, '0', null);
    var showGeoAxis = !!opts.showGeologicTimeAxis;
    var showEpochBands = !!opts.showEpochBands;
    var timeAxisBand = showGeoAxis
      ? showEpochBands
        ? ETL_GEO_TIME_AXIS_BAND_FULL
        : ETL_GEO_TIME_AXIS_BAND_COMPACT
      : 0;
    var lay = layoutHorizontalPhylogram(
      root,
      Object.assign({}, opts, { timeAxisBand: timeAxisBand, labelDensity: opts.labelDensity || state.labelDensity || 'standard' })
    );
    var w = lay.width;
    var h = lay.height;
    var hi = opts.highlightPaths || {};
    var selPath = opts.selectedPath || '';
    var taxaRows = opts.taxaRows || [];
    var clipId = 'mcEtlThumbClip_' + String(Math.random()).slice(2, 10);
    var TW0 = 60;

    packInternalLabelPositions(root, hi, lay);

    (function staggerTipLabels() {
      var tipsS = [];
      collectTipsOrdered(root, tipsS);
      tipsS.sort(function (a, b) {
        return a._y - b._y;
      });
      var ldSt = opts.labelDensity || state.labelDensity || 'standard';
      var minDy = ldSt === 'detailed' ? 18 : ldSt === 'minimal' ? 11 : 15;
      var lastY = -1e9;
      for (var si = 0; si < tipsS.length; si++) {
        var n0 = tipsS[si];
        var full = phyloLabelWithExtinctDagger(n0.displayName || '', n0.ottFromLabel, taxaRows, n0.name);
        var lines = Math.max(1, Math.ceil(Math.min(full.length, 44) / 22));
        var estH = 12 + lines * 5;
        var oy = ((si * 5) % 9) * 3 - 12;
        var ty = n0._y + 4 + oy;
        if (ty < lastY + minDy) oy += lastY + minDy - ty;
        n0._tipLabOy = oy;
        lastY = n0._y + 4 + oy + Math.max(minDy * 0.55, estH * 0.4);
      }
    })();

    var svg = [];
    svg.push(
      '<svg xmlns="http://www.w3.org/2000/svg" xml:lang="zh-Hant" class="mc-etl-phylo-svg" viewBox="0 0 ' +
        w +
        ' ' +
        h +
        '" data-etl-tree="1" preserveAspectRatio="xMidYMin meet" role="img" aria-label="phylogeny">'
    );
    svg.push(
      '<defs><clipPath id="' +
        clipId +
        '"><rect width="' +
        TW0 +
        '" height="' +
        TW0 +
        '" rx="8" ry="8"/></clipPath><filter id="mcEtlGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
    );
    svg.push(
      '<g class="mc-etl-phylo-pan" transform="translate(' +
        (opts.panX || 0) +
        ',' +
        (opts.panY || 0) +
        ') scale(' +
        (opts.scale || 1) +
        ')">'
    );
    if (timeAxisBand > 0) {
      pushGeologicTimeAxisSvgRows(svg, w, timeAxisBand, showEpochBands);
    }

    var TW = 60;
    function drawEdges(n) {
      if (!n || !n.children || !n.children.length) return;
      var px = n._x;
      var py = n._y;
      for (var c = 0; c < n.children.length; c++) {
        var ch = n.children[c];
        var cx = ch._x;
        var cy = ch._y;
        var onPath = hi[ch._path] || hi[n._path];
        var stub =
          (ch.displayName && ch.displayName.indexOf('姊妹群') >= 0) ||
          (ch.name && String(ch.name).indexOf('姊妹群') >= 0);
        var cls = 'mc-etl-branch';
        if (stub) cls += ' mc-etl-branch--stub';
        else if (onPath) cls += ' mc-etl-branch mc-etl-branch--path';
        /* Small corner radius so branches read softer and avoid a sharp corner through nearby labels */
        var r = Math.min(10, Math.abs(cx - px) * 0.12, Math.abs(cy - py) * 0.35);
        if (r < 2) r = 0;
        var dPath;
        if (r <= 0) {
          dPath = 'M' + px + ' ' + py + ' L' + cx + ' ' + py + ' L' + cx + ' ' + cy;
        } else {
          var sx = cx > px ? 1 : -1;
          var sy = cy > py ? 1 : -1;
          var x1 = cx - sx * r;
          dPath =
            'M' +
            px +
            ' ' +
            py +
            ' L' +
            x1 +
            ' ' +
            py +
            ' Q' +
            cx +
            ' ' +
            py +
            ' ' +
            cx +
            ' ' +
            (py + sy * r) +
            ' L' +
            cx +
            ' ' +
            cy;
        }
        svg.push('<path class="' + cls + '" d="' + dPath + '" data-edge="' + esc(ch._path) + '" />');
        drawEdges(ch);
      }
    }
    drawEdges(root);

    function drawNodes(n) {
      if (!n) return;
      var x = n._x;
      var y = n._y;
      var isTip = !n.children || !n.children.length;
      var isSel = selPath && n._path === selPath;
      var onLineage = !!(hi && hi[n._path]);
      var r = isSel ? 8 : isTip ? 5 : 3.5;
      var showLab = opts.vizShowLabels !== false;
      var showImg = opts.vizShowImages !== false;
      var imgPol = opts.imageDensity != null ? opts.imageDensity : state.imageDensity || 'selected_nearby';
      var labTipRaw = n.displayName || '';
      var labTip = phyloLabelWithExtinctDagger(labTipRaw, n.ottFromLabel, taxaRows, n.name);
      var isExtinctTip = isTip && labTip.charAt(0) === PHYLO_EXTINCT_DAGGER;
      var mcColl = !!(opts.collectionOverlay && isTip && displayNameInMcCollection(labTip));
      var ncls = 'mc-etl-node' + (isSel ? ' mc-etl-node--sel' : '') + (isTip ? ' mc-etl-node--tip' : '');
      if (onLineage && !isTip) ncls += ' mc-etl-node--path';
      if (mcColl) ncls += ' mc-etl-node--mc';
      if (isExtinctTip) ncls += ' mc-etl-node--extinct';
      svg.push(
        '<circle class="' +
          ncls +
          '" cx="' +
          x +
          '" cy="' +
          y +
          '" r="' +
          r +
          '" data-path="' +
          esc(n._path) +
          '" data-ott="' +
          (n.ottFromLabel || '') +
          '" tabindex="0" />'
      );
      var label = n.displayName || '';
      var isStubTip = isTip && label.indexOf('姊妹群') >= 0;
      if (isTip && label && showLab) {
        var showThumb =
          showImg &&
          imgPol !== 'off' &&
          (imgPol === 'more' ||
            (imgPol === 'major' && (isSel || onLineage)) ||
            (imgPol === 'selected_nearby' && (isSel || onLineage || mcColl)));
        var thumb = showThumb ? mediaUrlForPath(root, n._path, taxaRows) : '';
        var lx = x + 12;
        var voy = Number(n._tipLabOy) || 0;
        var showLabTxt = isStubTip ? label.replace(/（姊妹群示意）/, '') + '（示意）' : labTip;
        var labCls =
          'mc-etl-phylo-label' +
          (isStubTip ? ' mc-etl-phylo-label--stub' : '') +
          (isSel ? ' mc-etl-phylo-label--sel-tip' : '') +
          (onLineage && !isStubTip && !isSel ? ' mc-etl-phylo-label--path-tip' : '') +
          (isExtinctTip && !isStubTip ? ' mc-etl-phylo-label--extinct' : '');
        svg.push(
          '<text class="' +
            labCls +
            '" x="' +
            lx +
            '" y="' +
            (y + 4 + voy) +
            '">' +
            esc(showLabTxt.length > 40 ? showLabTxt.slice(0, 38) + '…' : showLabTxt) +
            '</text>'
        );
        if (thumb) {
          var tw = approxTipLabelWidthPx(showLabTxt);
          var ix = lx + tw + 12;
          svg.push(
            '<g transform="translate(' +
              ix +
              ',' +
              (y - TW / 2 + voy) +
              ')"><image class="mc-etl-phylo-thumb" href="' +
              esc(thumb) +
              '" x="0" y="0" width="' +
              TW +
              '" height="' +
              TW +
              '" preserveAspectRatio="xMidYMid slice" clip-path="url(#' +
              clipId +
              ')" /></g>'
          );
        }
      } else if (!isTip && label && showLab) {
        var ldInt = opts.labelDensity || state.labelDensity || 'standard';
        var leafCap = ldInt === 'detailed' ? 56 : ldInt === 'minimal' ? 28 : 40;
        var showInt = onLineage || (ldInt !== 'minimal' && lay.leafCount <= leafCap);
        if (showInt && label.length < 48) {
          var ithumb = onLineage ? mediaUrlForPath(root, n._path, taxaRows) : '';
          var tx = x - 12;
          var ld = Number(n._labelDy) || 0;
          var labFull = phyloLabelWithExtinctDagger(label, n.ottFromLabel, taxaRows, n.name);
          var lab = labFull.length > 32 ? labFull.slice(0, 30) + '…' : labFull;
          var ty = y - 14 + ld;
          svg.push(
            '<text class="mc-etl-phylo-label mc-etl-phylo-label--internal' +
              (onLineage ? ' mc-etl-phylo-label--path-internal' : '') +
              '" x="' +
              tx +
              '" y="' +
              ty +
              '" text-anchor="end" dominant-baseline="middle">' +
              esc(lab) +
              '</text>'
          );
          if (ithumb && onLineage && showImg) {
            var ixl = Math.max((lay.margin && lay.margin.l) ? lay.margin.l + 2 : 8, x - TW - 14);
            svg.push(
              '<g transform="translate(' +
                ixl +
                ',' +
                (y - TW / 2 - 14 + ld) +
                ')"><image class="mc-etl-phylo-thumb mc-etl-phylo-thumb--int" href="' +
                esc(ithumb) +
                '" x="0" y="0" width="' +
                TW +
                '" height="' +
                TW +
                '" preserveAspectRatio="xMidYMid slice" clip-path="url(#' +
                clipId +
                ')" /></g>'
            );
          }
        }
      }
      if (n.children) for (var j = 0; j < n.children.length; j++) drawNodes(n.children[j]);
    }
    drawNodes(root);

    svg.push('</g></svg>');
    state._lastPhyloBounds = { w: w, h: h };
    return { html: svg.join(''), width: w, height: h };
  }

  /** --- TNRS flatten --- */
  function flattenTnrs(results) {
    var out = [];
    if (!results || !Array.isArray(results.results)) return out;
    for (var i = 0; i < results.results.length; i++) {
      var block = results.results[i];
      var inputName = block.name || '';
      var matches = Array.isArray(block.matches) ? block.matches : [];
      if (!matches.length) {
        out.push({
          id: uid(),
          inputName: inputName,
          matchedName: '',
          uniqueName: '',
          ottId: 0,
          rank: '',
          score: 0,
          isSynonym: false,
          isApproximateMatch: false,
          isSuppressed: false,
          taxSources: [],
          flags: [],
          selected: false,
          warning: tx('etl_not_found', '找不到對應分類群', 'No matching taxon'),
          raw: block
        });
        continue;
      }
      var m0 = matches[0];
      var tax = m0.taxon || m0;
      out.push({
        id: uid(),
        inputName: inputName,
        matchedName: String(m0.matched_name || m0.name || tax.name || ''),
        uniqueName: String(m0.unique_name || tax.unique_name || ''),
        ottId: Number(tax.ott_id || m0.ott_id || 0),
        rank: String((m0.taxon && m0.taxon.rank) || tax.rank || m0.rank || ''),
        score: Number(m0.score != null ? m0.score : 0),
        isSynonym: !!m0.is_synonym,
        isApproximateMatch: !!m0.is_approximate_match,
        isSuppressed: !!m0.is_suppressed,
        taxSources: Array.isArray(m0.taxonomic_sources) ? m0.taxonomic_sources : [],
        flags: Array.isArray(m0.flags) ? m0.flags : [],
        selected: true,
        warning:
          matches.length > 1
            ? tx('etl_ambiguous', '學名可能有歧義（多筆匹配）', 'Ambiguous: multiple matches')
            : m0.is_approximate_match
              ? tx('etl_approx', '模糊匹配', 'Approximate match')
              : '',
        raw: m0,
        _alternates: matches.slice(1)
      });
    }
    return out;
  }

  function newickFromSynth(data) {
    if (!data) return '';
    if (data.newick) return String(data.newick);
    if (data.subtree) return String(data.subtree);
    return '';
  }

  /** --- App state --- */
  var state = {
    id: uid(),
    title: '演化樹研究工具',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    contextName: 'All life',
    inputNames: [],
    taxa: [],
    selectedOttIds: [],
    treeMode: 'induced',
    newick: '',
    mrca: null,
    selectedNode: null,
    sourceStudies: [],
    notes: '',
    settings: {
      layout: 'rectangular',
      labelFormat: 'name',
      heightLimit: 4,
      maxLeaves: 400,
      collapseLargeClades: true
    },
    apiOk: null,
    busy: false,
    err: null,
    errDebug: null,
    tab: 'basic',
    quickSearchDraft: '',
    onboarding: true,
    uiPhase: 'gate',
    sources: { openTree: true, gbif: true, pbdb: true },
    searchMode: 'mixed',
    treeViz: { scale: 1, tx: 0, ty: 0 },
    treeLayoutMode: 'horizontal',
    selectedPath: '',
    focusPath: '',
    highlightPaths: {},
    locateNote: '',
    lineageLabels: [],
    activeTaxonId: '',
    afterResolveCb: null,
    afterTreeBuildCb: null,
    searchHistory: [],
    buildKind: '',
    lastTaxonInfo: null,
    canvasView: 'classic',
    /** Life-tree visual mode: classic | circular | spiral | cladistic | radial | geologic | collection */
    lifeTreeMode: 'classic',
    /** ancestry | descendant | sister | nearby | compare */
    viewDirection: 'ancestry',
    descendantDepth: 2,
    geologyContext: null,
    geoLat: '',
    geoLng: '',
    cladisticChars: [],
    afriGisNote: '',
    resolveGen: 0,
    forceInducedSingle: false,
    compareTray: [],
    vizShowLabels: true,
    vizShowImages: true,
    vizShowTime: true,
    vizShowEpochBands: false,
    /** standard | single_lineage | sister | nearby | lineage_nearby | descendant_expand | minimal | multi_compare */
    displayMode: 'standard',
    /** 0–3: extra context depth for lineage+nearby (future expansion) */
    expansionScope: 1,
    /** minimal | standard | detailed — controls vertical label spacing & internal label policy */
    labelDensity: 'standard',
    /** off | major | selected_nearby | more */
    imageDensity: 'selected_nearby',
    /** When false, bottom tab dock is hidden so the tree canvas uses more vertical space */
    bottomDockVisible: true
  };

  try {
    var __etlDock = global.localStorage && global.localStorage.getItem(ETL_BOTTOM_DOCK_LS);
    if (__etlDock === '0') state.bottomDockVisible = false;
    else if (__etlDock === '1') state.bottomDockVisible = true;
  } catch (__eDock) {}

  function extinctExtantMix() {
    var ex = 0,
      liv = 0,
      unk = 0;
    (state.taxa || []).forEach(function (t) {
      if (t.extinctStatus === 'extinct') ex++;
      else if (t.extinctStatus === 'extant') liv++;
      else unk++;
    });
    return { ex: ex, liv: liv, unk: unk };
  }

  function buildGateHtml() {
    return (
      '<div class="mc-etl-gate" lang="' +
      (etlIsZh() ? 'zh-Hant' : 'en') +
      '" role="application" aria-label="' +
      esc(tx('etl_gate_aria', '演化樹界門', 'Evolution Gate')) +
      '">' +
      '<div class="mc-etl-gate__bg" aria-hidden="true"></div>' +
      '<div class="mc-etl-gate__particles" aria-hidden="true"></div>' +
      '<svg class="mc-etl-gate__phylo" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<path class="mc-etl-gate__branch" d="M40 200 Q120 120 200 100 T360 40" />' +
      '<path class="mc-etl-gate__branch mc-etl-gate__branch--2" d="M20 180 Q100 160 180 140 T340 80" />' +
      '<circle class="mc-etl-gate__node" cx="200" cy="100" r="14" />' +
      '</svg>' +
      '<div class="mc-etl-gate__portal" aria-hidden="true"><span class="mc-etl-gate__portal-ring"></span></div>' +
      '<div class="mc-etl-gate__content">' +
      '<p class="mc-etl-gate__kicker">' +
      esc(tx('etl_gate_kicker', '研究級演化入口', 'Research-grade evolution entry')) +
      '</p>' +
      '<h1 class="mc-etl-gate__title">' +
      esc(tx('etl_gate_title', '演化樹界門', 'Evolution Gate')) +
      '</h1>' +
      '<p class="mc-etl-gate__subtitle">' +
      esc(tx('etl_gate_subtitle', '探索生命支系、古生物脈絡與演化關係', 'Explore lineages, paleobiology, and evolutionary relationships')) +
      '</p>' +
      '<p class="mc-etl-gate__desc">' +
      esc(
        tx(
          'etl_gate_desc',
          '從現生物種到遠古化石，跨越時間與分類邊界，建立可研究、可分析、可查閱的互動式演化樹工作台。',
          'From extant species to deep time fossils—an interactive evolution workbench.'
        )
      ) +
      '</p>' +
      '<div class="mc-etl-gate__ribbon" aria-hidden="true" title="' +
      esc(tx('etl_era_bar_title', '地質年代示意（非絕對時間標定；conceptual）', 'Geologic eras (conceptual)')) +
      '">' +
      '<span>' +
      esc(tx('etl_era_ribbon_pc', 'Pc', 'Pc')) +
      '</span><span>' +
      esc(tx('etl_era_ribbon_pz', 'Pz', 'Pz')) +
      '</span><span>' +
      esc(tx('etl_era_ribbon_mz', 'Mz', 'Mz')) +
      '</span><span>' +
      esc(tx('etl_era_ribbon_k', 'K', 'K')) +
      '</span></div>' +
      '<div class="mc-etl-gate__actions">' +
      '<button type="button" class="mc-etl-gate-btn mc-etl-gate-btn--primary" id="mcEtlGateEnter">' +
      esc(tx('etl_gate_enter', '進入研究工具', 'Enter research console')) +
      '</button>' +
      '<button type="button" class="mc-etl-gate-btn" id="mcEtlGateSpecimens">' +
      esc(tx('etl_gate_from_spec', '從標本資料開始', 'Start from specimens')) +
      '</button>' +
      '<button type="button" class="mc-etl-gate-btn" id="mcEtlGateExplore">' +
      esc(tx('etl_gate_explore', '探索演化分支', 'Explore branches')) +
      '</button>' +
      '<button type="button" class="mc-etl-gate-btn" id="mcEtlGatePaleo">' +
      esc(tx('etl_gate_paleo', '古生物模式', 'Paleontology mode')) +
      '</button>' +
      '</div>' +
      '<p class="mc-etl-gate__foot">' +
      esc(tx('etl_gate_foot', '整合 OpenTree · GBIF · PBDB 多來源解析', 'OpenTree · GBIF · PBDB multi-source resolution')) +
      '</p>' +
      '</div></div>'
    );
  }

  function wireGateEvents(root) {
    var enter = root.querySelector('#mcEtlGateEnter');
    if (enter) {
      enter.addEventListener('click', function () {
        try {
          global.sessionStorage && global.sessionStorage.setItem('mc_etl_gate_done', '1');
        } catch (e) {}
        state.uiPhase = 'workspace';
        state.onboarding = true;
        render();
      });
    }
    var sp = root.querySelector('#mcEtlGateSpecimens');
    if (sp) {
      sp.addEventListener('click', function () {
        try {
          global.sessionStorage && global.sessionStorage.setItem('mc_etl_gate_done', '1');
        } catch (e2) {}
        state.uiPhase = 'workspace';
        state.searchMode = 'extant';
        importSpecimens();
        render();
      });
    }
    var ex = root.querySelector('#mcEtlGateExplore');
    if (ex) {
      ex.addEventListener('click', function () {
        try {
          global.sessionStorage && global.sessionStorage.setItem('mc_etl_gate_done', '1');
        } catch (e3) {}
        state.uiPhase = 'workspace';
        state.searchMode = 'higher';
        state.inputNames = ['Chordata', 'Arthropoda', 'Mollusca'];
        state.onboarding = true;
        render();
      });
    }
    var pal = root.querySelector('#mcEtlGatePaleo');
    if (pal) {
      pal.addEventListener('click', function () {
        try {
          global.sessionStorage && global.sessionStorage.setItem('mc_etl_gate_done', '1');
        } catch (e4) {}
        state.uiPhase = 'workspace';
        state.searchMode = 'fossil';
        state.inputNames = ['Trilobita', 'Anomalocaris', 'Tiktaalik'];
        state.onboarding = true;
        render();
      });
    }
  }

  function specimenScientificNames() {
    try {
      var sp = (global.state && global.state.specimens) || [];
      var seen = {};
      var names = [];
      for (var i = 0; i < sp.length; i++) {
        var sn = String(sp[i].scientificName || '').trim();
        if (!sn || seen[sn]) continue;
        seen[sn] = 1;
        names.push(sn);
      }
      return names;
    } catch (e) {
      return [];
    }
  }

  function taxonInCollection(uniqueName, matchedName) {
    var sp = (global.state && global.state.specimens) || [];
    var u = String(uniqueName || '').toLowerCase();
    var m = String(matchedName || '').toLowerCase();
    for (var i = 0; i < sp.length; i++) {
      var sn = String(sp[i].scientificName || '').trim().toLowerCase();
      if (!sn) continue;
      if (sn === u || sn === m) return true;
      if (u && sn.indexOf(u.split('(')[0].trim()) === 0) return true;
    }
    return false;
  }

  /** Tree tip display name vs MCurator specimen scientific names (典藏覆蓋模式). */
  function displayNameInMcCollection(displayName) {
    var d = stripLeadingPhyloDagger(String(displayName || '').trim()).toLowerCase();
    if (!d) return false;
    var names = specimenScientificNames();
    for (var i = 0; i < names.length; i++) {
      var s = String(names[i] || '')
        .trim()
        .toLowerCase();
      if (!s) continue;
      if (s === d) return true;
      var genus = d.split(/\s+/)[0];
      if (genus && s.indexOf(genus) === 0) return true;
    }
    return false;
  }

  function specimenImageForScientificName(name) {
    var sp = (global.state && global.state.specimens) || [];
    var n = String(name || '')
      .toLowerCase()
      .split('(')[0]
      .trim();
    if (!n) return '';
    for (var i = 0; i < sp.length; i++) {
      var sn = String(sp[i].scientificName || '')
        .trim()
        .toLowerCase();
      if (!sn) continue;
      if (sn === n || n.indexOf(sn) === 0 || sn.indexOf(n) === 0) {
        return (
          sp[i].imageUrl ||
          sp[i].image ||
          sp[i].coverImage ||
          sp[i].thumbnailUrl ||
          (sp[i].images && sp[i].images[0] && (sp[i].images[0].url || sp[i].images[0].src)) ||
          ''
        );
      }
    }
    return '';
  }

  function buildTaxonCardsHtml() {
    if (!state.taxa || !state.taxa.length) {
      return (
        '<div class="mc-etl-cards mc-etl-cards--empty">' +
        esc(tx('etl_cards_empty', '尚無解析結果；請輸入學名並解析。', 'No resolved taxa yet.')) +
        '</div>'
      );
    }
    return (
      '<div class="mc-etl-cards">' +
      state.taxa
        .map(function (t) {
          var thumb = (t.media && t.media.thumbnailUrl) || specimenImageForScientificName(t.matchedName || t.inputName);
          var badges = [];
          if (t.extinctStatus === 'extinct') badges.push('<span class="mc-etl-badge mc-etl-badge--fossil">' + esc(tx('etl_fossil', '化石', 'Extinct')) + '</span>');
          else if (t.extinctStatus === 'extant') badges.push('<span class="mc-etl-badge mc-etl-badge--live">' + esc(tx('etl_extant', '現生', 'Extant')) + '</span>');
          if (t.ottId) badges.push('<span class="mc-etl-badge">OTT ' + esc(String(t.ottId)) + '</span>');
          if (t.gbifId) badges.push('<span class="mc-etl-badge">GBIF</span>');
          if (t.pbdbId) badges.push('<span class="mc-etl-badge">PBDB</span>');
          var conf = t.confidence != null ? Math.round(Number(t.confidence) * 100) + '%' : '—';
          return (
            '<article class="mc-etl-card" data-tid="' +
            esc(t.id) +
            '">' +
            (thumb
              ? '<img class="mc-etl-card__thumb" src="' + esc(thumb) + '" alt="" loading="lazy" decoding="async" />'
              : '<div class="mc-etl-card__thumb mc-etl-card__thumb--ph" aria-hidden="true"></div>') +
            '<div class="mc-etl-card__body">' +
            '<h4 class="mc-etl-card__title">' +
            esc(t.matchedName || t.inputName) +
            '</h4>' +
            '<p class="mc-etl-card__sub">' +
            esc(t.uniqueName || '') +
            '</p>' +
            '<div class="mc-etl-card__badges">' +
            badges.join(' ') +
            (t.rank ? '<span class="mc-etl-badge">' + esc(t.rank) + '</span>' : '') +
            '</div>' +
            '<p class="mc-etl-card__conf">' +
            esc(tx('etl_card_confidence', '信心度', 'Confidence')) +
            ': ' +
            esc(conf) +
            '</p>' +
            '<div class="mc-etl-card__actions mc-etl-card__actions--grid">' +
            '<button type="button" class="mc-etl-btn mc-etl-btn--primary mc-etl-card__loc" data-locate="' +
            esc(t.id) +
            '">' +
            esc(tx('etl_card_locate', '定位到演化樹', 'Locate on tree')) +
            '</button>' +
            '<button type="button" class="mc-etl-btn" data-etl-card-act="ancestry" data-tid="' +
            esc(t.id) +
            '">' +
            esc(tx('etl_card_up', '往上看祖先', 'Ancestry')) +
            '</button>' +
            '<button type="button" class="mc-etl-btn" data-etl-card-act="descendant" data-tid="' +
            esc(t.id) +
            '">' +
            esc(tx('etl_card_down', '往下看分支', 'Descendants')) +
            '</button>' +
            '<button type="button" class="mc-etl-btn" data-etl-card-act="sister" data-tid="' +
            esc(t.id) +
            '">' +
            esc(tx('etl_card_sister', '姊妹群', 'Sisters')) +
            '</button>' +
            '<button type="button" class="mc-etl-btn" data-etl-card-act="nearby" data-tid="' +
            esc(t.id) +
            '">' +
            esc(tx('etl_card_nearby', '近緣群', 'Nearby')) +
            '</button>' +
            '<button type="button" class="mc-etl-btn" data-etl-card-act="tray" data-tid="' +
            esc(t.id) +
            '">' +
            esc(tx('etl_card_tray', '加入比較', 'Add to compare')) +
            '</button>' +
            '<button type="button" class="mc-etl-btn" data-etl-card-act="cladistic" data-tid="' +
            esc(t.id) +
            '">' +
            esc(tx('etl_card_clad', '支序分類圖', 'Cladistic view')) +
            '</button>' +
            '<button type="button" class="mc-etl-btn" data-etl-card-act="geology" data-tid="' +
            esc(t.id) +
            '">' +
            esc(tx('etl_card_geo', '地質背景', 'Geology')) +
            '</button>' +
            '</div></div></article>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function buildCompareTrayHtml() {
    var tray = state.compareTray || [];
    if (!tray.length) {
      return (
        '<div class="mc-etl-tray mc-etl-tray--empty"><p class="mc-etl-muted">' +
        esc(tx('etl_tray_empty', '比較托盤為空：在結果卡片按「加入比較」。', 'Compare tray is empty.')) +
        '</p></div>'
      );
    }
    var parts = [];
    for (var ti = 0; ti < tray.length; ti++) {
      var id = tray[ti];
      var t = (state.taxa || []).filter(function (x) {
        return x.id === id;
      })[0];
      if (!t) continue;
      parts.push(
        '<span class="mc-etl-tray-chip">' +
        esc(t.matchedName || t.inputName) +
        '<button type="button" class="mc-etl-tray-x" data-tray-remove="' +
        esc(id) +
        '" aria-label="remove">×</button></span>'
      );
    }
    return (
      '<div class="mc-etl-tray">' +
      '<h4 class="mc-etl-subh">' +
      esc(tx('etl_tray_title', '比較托盤', 'Compare tray')) +
      '</h4><div class="mc-etl-tray-chips">' +
      parts.join('') +
      '</div>' +
      (tray.length >= 2
        ? '<button type="button" class="mc-etl-btn mc-etl-btn--primary" id="mcEtlBuildFromTray">' +
          esc(tx('etl_tray_build', '用托盤建立比較樹', 'Build compare tree')) +
          '</button>'
        : '<p class="mc-etl-muted">' + esc(tx('etl_tray_need2', '至少兩筆以建立比較樹。', 'Pick at least two taxa.')) + '</p>') +
      '</div>'
    );
  }

  function applyPhyloLocateForRow(row) {
    if (!state.newick) {
      state.locateNote = tx('etl_locate_need_tree', '請先建立演化樹（搜尋並定位或按「建立演化樹」）。', 'Build a tree first.');
      return;
    }
    var tree = parseNewick(state.newick);
    if (!tree) return;
    var hit = findTipPathForTaxon(tree, row);
    if (!hit) {
      state.locateNote = tx(
        'etl_locate_no_match',
        '在樹末端找不到精確對應；請確認已勾選正確 OTT 或改用較高階分類群。',
        'No exact tip match on the tree.'
      );
      state.highlightPaths = {};
      state.selectedPath = '';
      state.lineageLabels = [];
      return;
    }
    state.activeTaxonId = row.id;
    state.selectedPath = hit.path;
    state.focusPath = hit.path;
    state.lineageLabels = lineageFromTip(hit.tip);
    state.highlightPaths = pathPrefixes(hit.path);
    state.selectedNode = {
      path: hit.path,
      name: phyloLabelWithExtinctDagger(hit.tip.displayName || '', hit.tip.ottFromLabel, state.taxa || [], hit.tip.name),
      ott: hit.tip.ottFromLabel,
      weak: !!hit.weak
    };
    state.locateNote = hit.weak
      ? tx('etl_locate_weak', '已以近似名稱或姊妹末端定位；請以圖上高亮為準。', 'Approximate placement—verify on the tree.')
      : '';
    state.tab = 'evo';
  }

  function fitPhyloViewportToPath(pathStr) {
    var tree = parseNewick(state.newick);
    if (!tree) return;
    annotateTreePaths(tree, '0', null);
    var lmFit = state.lifeTreeMode || state.canvasView || 'classic';
    if (lmFit === 'timeline') lmFit = 'geologic';
    var bandFit =
      lmFit === 'geologic'
        ? state.vizShowEpochBands
          ? ETL_GEO_TIME_AXIS_BAND_FULL
          : ETL_GEO_TIME_AXIS_BAND_COMPACT
        : 0;
    layoutHorizontalPhylogram(tree, { timeAxisBand: bandFit });
    var node = getNodeByPath(tree, pathStr);
    if (!node || !state._lastPhyloBounds) return;
    var canvas = typeof document !== 'undefined' ? document.getElementById('mcEtlCanvas') : null;
    var cw = (canvas && canvas.clientWidth) || 720;
    var ch = (canvas && canvas.clientHeight) || 480;
    var w = state._lastPhyloBounds.w;
    var h = state._lastPhyloBounds.h;
    var s = Math.min((cw - 96) / Math.max(w, 160), (ch - 120) / Math.max(h, 160), 2.4);
    state.treeViz.scale = Math.max(0.3, s);
    state.treeViz.tx = cw / 2 - node._x * state.treeViz.scale;
    state.treeViz.ty = ch / 2 - node._y * state.treeViz.scale;
  }

  function fitWholePhyloViewport() {
    state.treeViz = { scale: 1, tx: 16, ty: 20 };
  }

  var phyloDrag = null;
  function bindPhyloGlobalOnce() {
    if (global.__mcEtlPhyloUiBound) return;
    global.__mcEtlPhyloUiBound = true;
    document.addEventListener(
      'click',
      function (ev) {
        var c = ev.target && ev.target.closest && ev.target.closest('circle.mc-etl-node');
        if (!c) return;
        var shell = document.getElementById(ROOT_ID);
        if (!shell || !shell.contains(c)) return;
        var path = c.getAttribute('data-path');
        var st = global.MCEvolutionTreeLab && global.MCEvolutionTreeLab.getState();
        if (!st || !st.newick || !path) return;
        var tree = parseNewick(st.newick);
        if (!tree) return;
        annotateTreePaths(tree, '0', null);
        var node = getNodeByPath(tree, path);
        if (!node) return;
        st.selectedPath = path;
        st.focusPath = path;
        st.highlightPaths = pathPrefixes(path);
        if (!node.children || !node.children.length) st.lineageLabels = lineageFromTip(node);
        else {
          var nm0 = node.displayName || formatPhyloDisplayName(node.name);
          st.lineageLabels = [phyloLabelWithExtinctDagger(nm0, node.ottFromLabel, st.taxa || [], node.name)];
        }
        st.selectedNode = {
          path: path,
          name: phyloLabelWithExtinctDagger(node.displayName || '', node.ottFromLabel, st.taxa || [], node.name),
          ott: node.ottFromLabel
        };
        st.tab = 'basic';
        if (global.MCEvolutionTreeLab.rerender) global.MCEvolutionTreeLab.rerender();
      },
      false
    );
    document.addEventListener(
      'wheel',
      function (ev) {
        var wrap = ev.target && ev.target.closest && ev.target.closest('#mcEtlPhyloWrap');
        if (!wrap) return;
        var shell = document.getElementById(ROOT_ID);
        if (!shell || !shell.contains(wrap)) return;
        ev.preventDefault();
        var st = global.MCEvolutionTreeLab.getState();
        var svg = wrap.querySelector('svg');
        var panG = svg && svg.querySelector('.mc-etl-phylo-pan');
        if (!st || !panG) return;
        var dir = ev.deltaY > 0 ? 0.9 : 1.1;
        st.treeViz.scale = Math.max(0.22, Math.min(3.2, st.treeViz.scale * dir));
        panG.setAttribute(
          'transform',
          'translate(' + st.treeViz.tx + ',' + st.treeViz.ty + ') scale(' + st.treeViz.scale + ')'
        );
      },
      { passive: false, capture: true }
    );
    document.addEventListener('mousedown', function (ev) {
      var wrap = ev.target && ev.target.closest && ev.target.closest('#mcEtlPhyloWrap');
      if (!wrap || ev.button !== 0) return;
      if (ev.target.closest && ev.target.closest('circle.mc-etl-node')) return;
      var shell = document.getElementById(ROOT_ID);
      if (!shell || !shell.contains(wrap)) return;
      var st = global.MCEvolutionTreeLab.getState();
      phyloDrag = { x: ev.clientX, y: ev.clientY, tx: st.treeViz.tx, ty: st.treeViz.ty, wrap: wrap };
    });
    document.addEventListener('mousemove', function (ev) {
      if (!phyloDrag || !phyloDrag.wrap) return;
      var st = global.MCEvolutionTreeLab.getState();
      var svg = phyloDrag.wrap.querySelector('svg');
      var panG = svg && svg.querySelector('.mc-etl-phylo-pan');
      if (!st || !panG) return;
      st.treeViz.tx = phyloDrag.tx + (ev.clientX - phyloDrag.x);
      st.treeViz.ty = phyloDrag.ty + (ev.clientY - phyloDrag.y);
      panG.setAttribute(
        'transform',
        'translate(' + st.treeViz.tx + ',' + st.treeViz.ty + ') scale(' + st.treeViz.scale + ')'
      );
    });
    document.addEventListener('mouseup', function () {
      phyloDrag = null;
    });
  }

  function runSearchAndLocate() {
    var inp = document.getElementById('mcEtlQuickSearch');
    var q = (inp && inp.value.trim()) || '';
    if (!q) {
      state.err = tx('etl_err_names', '請輸入至少一個學名', 'Enter at least one name');
      render();
      return;
    }
    state.quickSearchDraft = q;
    state.inputNames = [q];
    state.err = null;
    state.locateNote = '';
    var ta = document.getElementById('mcEtlNames');
    if (ta) ta.value = q;
    state.busy = true;
    state.afterResolveCb = function () {
      state.taxa.forEach(function (t) {
        t.selected = !!t.ottId;
      });
      state.afterTreeBuildCb = function () {
        var row = state.taxa[0];
        if (row && row.ottId) applyPhyloLocateForRow(row);
        try {
          if (q && state.searchHistory.indexOf(q) < 0) state.searchHistory.unshift(q);
          state.searchHistory = state.searchHistory.slice(0, 14);
        } catch (eH) {}
      };
      doBuildTree();
    };
    doResolve();
  }

  function runLocateOnExistingTree() {
    if (!state.newick) {
      state.err = tx('etl_locate_need_tree', '請先建立演化樹（搜尋並定位或按「建立演化樹」）。', 'Build a tree first.');
      render();
      return;
    }
    var row = state.taxa.filter(function (t) {
      return t.selected && t.ottId;
    })[0];
    if (!row) row = state.taxa[0];
    if (!row) return;
    applyPhyloLocateForRow(row);
    render();
    setTimeout(function () {
      if (state.focusPath && state.newick) {
        fitPhyloViewportToPath(state.focusPath);
        if (global.MCEvolutionTreeLab && global.MCEvolutionTreeLab.rerender) global.MCEvolutionTreeLab.rerender();
      }
    }, 0);
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    if (state.tab === 'studies') state.tab = 'sources';
    if (state.tab === 'node') state.tab = 'basic';
    if (state.tab === 'mrca') state.tab = 'evo';
    if (state.uiPhase === 'gate') {
      root.innerHTML = buildGateHtml();
      wireGateEvents(root);
      return;
    }
    var mix = extinctExtantMix();
    var skipHtmlTimegrid =
      !!state.newick &&
      ((state.lifeTreeMode || '') === 'geologic' || state.canvasView === 'timeline');
    var ctxOpts = CONTEXT_OPTIONS.map(function (o) {
      var lab = global.state && global.state.lang === 'zh-TW' ? o.zh : o.en;
      return '<option value="' + esc(o.v) + '"' + (state.contextName === o.v ? ' selected' : '') + '>' + esc(lab) + '</option>';
    }).join('');
    var taxRows = state.taxa
      .map(function (t) {
        var inMc = taxonInCollection(t.uniqueName, t.matchedName);
        return (
          '<tr data-id="' +
          esc(t.id) +
          '">' +
          '<td><input type="checkbox" class="mc-etl-inc"' +
          (t.selected ? ' checked' : '') +
          ' /></td>' +
          '<td>' +
          esc(t.inputName) +
          '</td>' +
          '<td>' +
          esc(t.matchedName) +
          '</td>' +
          '<td>' +
          esc(t.uniqueName) +
          '</td>' +
          '<td>' +
          (t.ottId || '—') +
          '</td>' +
          '<td>' +
          esc(t.rank) +
          '</td>' +
          '<td>' +
          (t.score != null ? esc(String(t.score)) : '') +
          '</td>' +
          '<td>' +
          (t.isSynonym
            ? '<span class="mc-etl-badge mc-etl-badge--syn">' + esc(tx('etl_badge_syn', '異名（syn.）', 'syn.')) + '</span>'
            : '') +
          '</td>' +
          '<td>' +
          (t.isApproximateMatch ? '<span class="mc-etl-badge mc-etl-badge--approx">≈</span>' : '') +
          '</td>' +
          '<td>' +
          (t.warning ? '<span class="mc-etl-badge mc-etl-badge--bad">' + esc(t.warning) + '</span>' : '') +
          '</td>' +
          '<td>' +
          (t.extinctStatus === 'extinct'
            ? '<span class="mc-etl-badge mc-etl-badge--fossil">' + esc(tx('etl_fossil', '化石', 'Fossil')) + '</span>'
            : t.extinctStatus === 'extant'
              ? '<span class="mc-etl-badge mc-etl-badge--live">' + esc(tx('etl_extant', '現生', 'Extant')) + '</span>'
              : '<span class="mc-etl-badge mc-etl-badge--unk">—</span>') +
          '</td>' +
          '<td>' +
          (inMc ? '<span class="mc-etl-badge mc-etl-badge--mc">MC</span>' : '') +
          '</td>' +
          '</tr>'
        );
      })
      .join('');
    var taxCards = buildTaxonCardsHtml();
    var compareTrayHtml = buildCompareTrayHtml();
    var chipApi =
      state.apiOk === true
        ? '<span class="mc-etl-chip mc-etl-chip--ok">' + esc(tx('etl_api_ok', 'OpenTree 已連線', 'OpenTree connected')) + '</span>'
        : state.apiOk === false
          ? '<span class="mc-etl-chip">' + esc(tx('etl_api_fail', 'API 異常', 'API issue')) + '</span>'
          : '<span class="mc-etl-chip">' + esc(tx('etl_api_unknown', '連線檢查中', 'Checking API…')) + '</span>';
    var selCount = state.taxa.filter(function (x) {
      return x.selected && x.ottId;
    }).length;
    root.innerHTML =
      '<div class="mc-etl-root mc-etl-root--workspace" lang="' +
      (etlIsZh() ? 'zh-Hant' : 'en') +
      '">' +
      '<header class="mc-etl-header">' +
      '<div class="mc-etl-header__titles">' +
      '<h1 data-i18n="nav_evolution_tree_lab">' +
      esc(tx('nav_evolution_tree_lab', '演化樹研究工具', 'Evolution Tree Lab')) +
      '</h1>' +
      (etlIsZh()
        ? ''
        : '<div class="mc-etl-header__en">Evolution Tree Lab</div>') +
      '<p>' +
      esc(
        tx(
          'etl_subtitle',
          '解析學名、建立合成樹／分類子樹、檢視 MRCA 與來源研究；Open Tree of Life API v3。',
          'Resolve names, build trees, inspect MRCA and source studies via Open Tree of Life API v3.'
        )
      ) +
      '</p></div>' +
      '<div class="mc-etl-chips">' +
      chipApi +
      '<span class="mc-etl-chip">' +
      esc(tx('etl_ctx', '脈絡', 'Context')) +
      ': ' +
      esc(state.contextName) +
      '</span>' +
      '<span class="mc-etl-chip">' +
      esc(tx('etl_taxa_n', '物種數', 'Taxa')) +
      ': ' +
      selCount +
      '</span>' +
      '<span class="mc-etl-chip">' +
      esc(state.treeMode) +
      '</span>' +
      (state.buildKind === 'position'
        ? '<span class="mc-etl-chip mc-etl-chip--accent">' +
          esc(tx('etl_kind_position', '譜系主幹定位', 'Lineage placement')) +
          '</span>'
        : state.buildKind === 'induced'
          ? '<span class="mc-etl-chip mc-etl-chip--accent">' +
            esc(tx('etl_kind_induced', '誘導子樹', 'Induced')) +
            '</span>'
          : state.buildKind === 'taxonomy-subtree'
            ? '<span class="mc-etl-chip mc-etl-chip--accent">' +
              esc(tx('etl_kind_tax', '分類探索', 'Taxonomy')) +
              '</span>'
            : state.buildKind === 'synthetic-subtree'
              ? '<span class="mc-etl-chip mc-etl-chip--accent">' +
                esc(tx('etl_kind_synth', '合成子樹', 'Synthetic')) +
                '</span>'
              : '') +
      '<span class="mc-etl-chip mc-etl-chip--fossil">' +
      esc(tx('etl_chip_extinct', '化石推論', 'Extinct')) +
      ' ' +
      mix.ex +
      '</span>' +
      '<span class="mc-etl-chip">' +
      esc(tx('etl_chip_extant', '現生', 'Extant')) +
      ' ' +
      mix.liv +
      '</span></div>' +
      '<div class="mc-etl-actions">' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost" id="mcEtlShowGateAgain" title="' +
      esc(tx('etl_gate_again_tip', '再次顯示演化樹界門', 'Show Evolution Gate again')) +
      '">' +
      esc(tx('etl_gate_again', '界門', 'Gate')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost" id="mcEtlNew">' +
      esc(tx('etl_new', '新專案', 'New project')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn" id="mcEtlSave">' +
      esc(tx('etl_save', '儲存專案', 'Save')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--primary" id="mcEtlExport">' +
      esc(tx('etl_export', '匯出', 'Export')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn" id="mcEtlImportSp">' +
      esc(tx('etl_import_spec', '從標本匯入學名', 'Import specimens')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost" id="mcEtlHelp">' +
      esc(tx('etl_help', '說明', 'Help')) +
      '</button>' +
      '</div></header>' +
      '<div class="mc-etl-grid' +
      (state.bottomDockVisible === false ? ' mc-etl-grid--dock-collapsed' : '') +
      '">' +
      '<aside class="mc-etl-panel">' +
      '<div class="mc-etl-panel__scroll">' +
      '<div class="mc-etl-search-hero">' +
      '<label class="mc-etl-search-hero__lab" for="mcEtlQuickSearch">' +
      esc(tx('etl_panel_search', '學名搜尋與定位', 'Search & locate')) +
      '</label>' +
      '<input id="mcEtlQuickSearch" class="mc-etl-search-hero__inp" type="search" autocomplete="off" placeholder="' +
      esc(
        tx(
          'etl_search_locate_ph',
          '輸入學名後，自動解析並定位到演化樹位置',
          'Enter a scientific name to resolve and locate it on the tree'
        )
      ) +
      '" value="' +
      esc(state.quickSearchDraft || '') +
      '" />' +
      '<div class="mc-etl-search-hero__chips">' +
      ['Homo sapiens', 'Odontolabis celebensis', 'Lucanus cervus', 'Trilobita', 'Arthropoda', 'Tiktaalik']
        .map(function (ex) {
          return (
            '<button type="button" class="mc-etl-mini-chip" data-etl-example="' +
            esc(ex) +
            '">' +
            esc(ex) +
            '</button>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="mc-etl-search-hero__actions">' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--primary" id="mcEtlSearchLocate">' +
      esc(tx('etl_btn_search_locate', '搜尋並定位', 'Search & locate')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn" id="mcEtlLocateOnly">' +
      esc(tx('etl_btn_locate_tree', '在樹上定位', 'Locate on tree')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn" id="mcEtlCompareMode">' +
      esc(tx('etl_btn_compare', '建立比較', 'Compare')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn" id="mcEtlCladeExplore">' +
      esc(tx('etl_btn_clade', '展開分類群', 'Explore clade')) +
      '</button>' +
      '</div>' +
      '<div class="mc-etl-field">' +
      '<label class="mc-etl-field__lab" for="mcEtlViewDirection">' +
      esc(tx('etl_view_dir', '觀察方向', 'Tree direction')) +
      '</label>' +
      '<select id="mcEtlViewDirection" class="mc-etl-select">' +
      [
        ['ancestry', tx('etl_dir_up', '往上看：祖先定位', 'Ancestry (upward)')],
        ['descendant', tx('etl_dir_down', '往下看：後代分支', 'Descendants (downward)')],
        ['sister', tx('etl_dir_sister', '姊妹群', 'Sister clades')],
        ['nearby', tx('etl_dir_nearby', '近緣群', 'Nearby relatives')],
        ['compare', tx('etl_dir_compare', '多物種比較', 'Compare (2+)')]
      ]
        .map(function (pair) {
          return (
            '<option value="' +
            esc(pair[0]) +
            '"' +
            ((state.viewDirection || 'ancestry') === pair[0] ? ' selected' : '') +
            '>' +
            esc(pair[1]) +
            '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<label class="mc-etl-field__lab" for="mcEtlDescDepth" style="margin-top:8px">' +
      esc(tx('etl_desc_depth', '後代展開深度', 'Descendant depth')) +
      '</label>' +
      '<select id="mcEtlDescDepth" class="mc-etl-select">' +
      [1, 2, 3]
        .map(function (d) {
          return (
            '<option value="' +
            d +
            '"' +
            (Number(state.descendantDepth || 2) === d ? ' selected' : '') +
            '>' +
            esc(String(d)) +
            '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<p class="mc-etl-hint" style="margin-top:6px">' +
      esc(
        tx(
          'etl_dir_hint',
          '「往上看」適合物種定位；「往下看」適合高階分類群並限制深度；與 OpenTree 子樹 API 分工一致。',
          'Ancestry for placement; descendants for higher taxa with depth limits.'
        )
      ) +
      '</p></div>' +
      '<div class="mc-etl-field mc-etl-field--display">' +
      '<label class="mc-etl-field__lab" for="mcEtlDisplayMode">' +
      esc(tx('etl_display_mode', '顯示模式', 'Display mode')) +
      '</label>' +
      '<select id="mcEtlDisplayMode" class="mc-etl-select">' +
      [
        ['standard', tx('etl_dm_standard', '標準（完整樹）', 'Standard (full tree)')],
        ['single_lineage', tx('etl_dm_lineage', '單一演化路線', 'Single lineage')],
        ['lineage_nearby', tx('etl_dm_lineage_near', '單一路徑＋脈絡', 'Lineage + context')],
        ['sister', tx('etl_dm_sister', '姊妹群模式', 'Sister clades')],
        ['nearby', tx('etl_dm_nearby', '近緣／近似種', 'Nearby relatives')],
        ['descendant_expand', tx('etl_dm_desc', '後代展開', 'Descendant expansion')],
        ['minimal', tx('etl_dm_minimal', '極簡', 'Minimal')],
        ['multi_compare', tx('etl_dm_multi', '多物種比較', 'Multi-taxon compare')]
      ]
        .map(function (dm) {
          return (
            '<option value="' +
            esc(dm[0]) +
            '"' +
            ((state.displayMode || 'standard') === dm[0] ? ' selected' : '') +
            '>' +
            esc(dm[1]) +
            '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<label class="mc-etl-field__lab" for="mcEtlExpansionScope" style="margin-top:8px">' +
      esc(tx('etl_expansion_scope', '脈絡深度', 'Context depth')) +
      '</label>' +
      '<select id="mcEtlExpansionScope" class="mc-etl-select">' +
      [0, 1, 2, 3]
        .map(function (d) {
          return (
            '<option value="' +
            d +
            '"' +
            (Number(state.expansionScope) === d ? ' selected' : '') +
            '>' +
            esc(String(d)) +
            '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<label class="mc-etl-field__lab" for="mcEtlLabelDensity" style="margin-top:8px">' +
      esc(tx('etl_label_density', '標籤密度', 'Label density')) +
      '</label>' +
      '<select id="mcEtlLabelDensity" class="mc-etl-select">' +
      [
        ['minimal', tx('etl_ld_min', '極簡', 'Minimal')],
        ['standard', tx('etl_ld_std', '標準', 'Standard')],
        ['detailed', tx('etl_ld_det', '詳細', 'Detailed')]
      ]
        .map(function (p) {
          return (
            '<option value="' +
            esc(p[0]) +
            '"' +
            ((state.labelDensity || 'standard') === p[0] ? ' selected' : '') +
            '>' +
            esc(p[1]) +
            '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<label class="mc-etl-field__lab" for="mcEtlImageDensity" style="margin-top:8px">' +
      esc(tx('etl_image_density', '圖片密度', 'Image density')) +
      '</label>' +
      '<select id="mcEtlImageDensity" class="mc-etl-select">' +
      [
        ['off', tx('etl_img_off', '關閉', 'Off')],
        ['major', tx('etl_img_major', '主要節點', 'Major nodes')],
        ['selected_nearby', tx('etl_img_sel', '所選與近緣', 'Selected + nearby')],
        ['more', tx('etl_img_more', '更多（較擁擠）', 'More')]
      ]
        .map(function (p) {
          return (
            '<option value="' +
            esc(p[0]) +
            '"' +
            ((state.imageDensity || 'selected_nearby') === p[0] ? ' selected' : '') +
            '>' +
            esc(p[1]) +
            '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<p class="mc-etl-hint" style="margin-top:6px">' +
      esc(
        tx(
          'etl_display_hint',
          '「單一演化路線」需先點選末端或定位；會暫時簡化畫面上的樹以利閱讀。† 表示推定或已標示之滅絕學名。',
          'Single lineage needs a selected tip; tree view simplifies. † marks extinct names.'
        )
      ) +
      '</p></div></div>' +
      '<details class="mc-etl-details mc-etl-details--soft">' +
      '<summary class="mc-etl-details__sum">' +
      esc(tx('etl_sum_batch', '批次學名與名稱解析', 'Batch names & resolve')) +
      '</summary>' +
      '<div class="mc-etl-details__body">' +
      '<div class="mc-etl-section-title">' +
      esc(tx('etl_panel_batch', '批次學名（多行）', 'Batch names')) +
      '</div>' +
      '<textarea class="mc-etl-textarea" id="mcEtlNames" placeholder="Homo sapiens&#10;Pan troglodytes">' +
      esc(state.inputNames.join('\n')) +
      '</textarea>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--primary" id="mcEtlResolve">' +
      esc(tx('etl_resolve', '解析學名', 'Resolve names')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn" id="mcEtlInfer">' +
      esc(tx('etl_infer_ctx', '自動脈絡', 'Infer context')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost" id="mcEtlClear">' +
      esc(tx('etl_clear', '清除', 'Clear')) +
      '</button>' +
      '</div>' +
      '<p class="mc-etl-hint">' +
      esc(
        tx(
          'etl_ctx_hint',
          '脈絡可提升學名解析速度與準確度。',
          'Context improves TNRS speed and accuracy.'
        )
      ) +
      '</p></div></details>' +
      '<div class="mc-etl-deck">' +
      '<div class="mc-etl-deck__row">' +
      '<span class="mc-etl-deck__label">' +
      esc(tx('etl_deck_sources', '資料來源', 'Data sources')) +
      '</span>' +
      '<label class="mc-etl-tog"><input type="checkbox" checked disabled /> OpenTree</label>' +
      '<label class="mc-etl-tog"><input type="checkbox" id="mcEtlSrcGbif"' +
      (state.sources.gbif ? ' checked' : '') +
      ' /> GBIF</label>' +
      '<label class="mc-etl-tog"><input type="checkbox" id="mcEtlSrcPbdb"' +
      (state.sources.pbdb ? ' checked' : '') +
      ' /> PBDB</label></div>' +
      '<div class="mc-etl-deck__row">' +
      '<span class="mc-etl-deck__label">' +
      esc(tx('etl_deck_mode', '搜尋模式', 'Search mode')) +
      '</span>' +
      '<select class="mc-etl-select mc-etl-select--inline" id="mcEtlSearchMode">' +
      ['single', 'multi', 'higher', 'fossil', 'extant', 'mixed']
        .map(function (m) {
          var labs = {
            single: tx('etl_mode_single', '單一物種探索', 'Single taxon'),
            multi: tx('etl_mode_multi', '多物種比較', 'Multi taxa'),
            higher: tx('etl_mode_higher', '高階分類群展開', 'Higher taxon'),
            fossil: tx('etl_mode_fossil', '古生物搜尋', 'Paleontology'),
            extant: tx('etl_mode_extant', '現生生物搜尋', 'Extant focus'),
            mixed: tx('etl_mode_mixed', '混合比較', 'Mixed')
          };
          return (
            '<option value="' +
            esc(m) +
            '"' +
            (state.searchMode === m ? ' selected' : '') +
            '>' +
            esc(labs[m] || m) +
            '</option>'
          );
        })
        .join('') +
      '</select></div>' +
      '<div class="mc-etl-presets">' +
      '<button type="button" class="mc-etl-chip-btn" data-tree-preset="vertebrate">' +
      esc(tx('etl_pre_vertebrate', '脊椎動物演化', 'Vertebrates')) +
      '</button>' +
      '<button type="button" class="mc-etl-chip-btn" data-tree-preset="arthro">' +
      esc(tx('etl_pre_arthro', '節肢動物演化', 'Arthropods')) +
      '</button>' +
      '<button type="button" class="mc-etl-chip-btn" data-tree-preset="marine">' +
      esc(tx('etl_pre_marine', '海洋無脊椎', 'Marine inverts')) +
      '</button>' +
      '<button type="button" class="mc-etl-chip-btn" data-tree-preset="paleozoic">' +
      esc(tx('etl_pre_pz', '古生代生物', 'Paleozoic')) +
      '</button>' +
      '<button type="button" class="mc-etl-chip-btn" data-tree-preset="meso">' +
      esc(tx('etl_pre_meso', '中生代海生爬行類', 'Mesozoic marine reptiles')) +
      '</button>' +
      '</div></div>' +
      '<details class="mc-etl-details mc-etl-details--soft">' +
      '<summary class="mc-etl-details__sum">' +
      esc(tx('etl_sum_adv', '進階：脈絡、樹模式與建立', 'Advanced: context & tree')) +
      '</summary>' +
      '<div class="mc-etl-details__body">' +
      '<label class="mc-etl-section-title" for="mcEtlCtx">' +
      esc(tx('etl_context', 'TNRS 脈絡', 'TNRS context')) +
      '</label>' +
      '<select class="mc-etl-select" id="mcEtlCtx">' +
      ctxOpts +
      '</select>' +
      '<label class="mc-etl-section-title" for="mcEtlMode">' +
      esc(tx('etl_tree_mode', '樹模式', 'Tree mode')) +
      '</label>' +
      '<select class="mc-etl-select" id="mcEtlMode">' +
      '<option value="induced"' +
      (state.treeMode === 'induced' ? ' selected' : '') +
      '>' +
      esc(tx('etl_mode_induced', '指定物種關係樹', 'Induced subtree')) +
      '</option>' +
      '<option value="synthetic-subtree"' +
      (state.treeMode === 'synthetic-subtree' ? ' selected' : '') +
      '>' +
      esc(tx('etl_mode_synth', '合成演化子樹', 'Synthetic subtree')) +
      '</option>' +
      '<option value="taxonomy-subtree"' +
      (state.treeMode === 'taxonomy-subtree' ? ' selected' : '') +
      '>' +
      esc(tx('etl_mode_tax', '分類子樹', 'Taxonomy subtree')) +
      '</option>' +
      '<option value="mrca"' +
      (state.treeMode === 'mrca' ? ' selected' : '') +
      '>' +
      esc(tx('etl_mode_mrca', '僅 MRCA', 'MRCA only')) +
      '</option>' +
      '</select>' +
      '<p class="mc-etl-hint">' +
      esc(
        tx(
          'etl_mode_hint_single',
          '單一學名且選「誘導子樹」時，預設以譜系主幹定位（非僅末端子樹）。',
          'Single-taxon + induced defaults to lineage placement.'
        )
      ) +
      '</p>' +
      '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--primary" id="mcEtlBuild">' +
      esc(tx('etl_build', '建立演化樹', 'Build tree')) +
      '</button>' +
      '</div></div></details>' +
      (state.err
        ? '<div class="mc-etl-msg">' +
          esc(state.err) +
          (state.errDebug
            ? '<details><summary>Debug</summary><pre style="white-space:pre-wrap;">' +
              esc(state.errDebug) +
              '</pre></details>'
            : '') +
          '<button type="button" class="mc-etl-btn" id="mcEtlRetry" style="margin-top:8px;">' +
          esc(tx('etl_retry', '重試', 'Retry')) +
          '</button></div>'
        : '') +
      '<div class="mc-etl-section-title">' +
      esc(tx('etl_resolved', '解析結果', 'Resolved taxa')) +
      '</div>' +
      taxCards +
      compareTrayHtml +
      '<details class="mc-etl-details"><summary class="mc-etl-details__sum">' +
      esc(tx('etl_table_toggle', '展開詳細表格', 'Expand table')) +
      '</summary>' +
      '<div class="mc-etl-table-wrap"><table class="mc-etl-table"><thead><tr>' +
      '<th></th><th>' +
      esc(tx('etl_th_input', '輸入（input）', 'Input')) +
      '</th><th>' +
      esc(tx('etl_th_matched', '匹配（matched）', 'Matched')) +
      '</th><th>' +
      esc(tx('etl_th_unique', '唯一學名（unique name）', 'Unique name')) +
      '</th><th>' +
      esc(tx('etl_th_ott', '編號（OTT）', 'OTT')) +
      '</th><th>' +
      esc(tx('etl_th_rank', '級別（rank）', 'Rank')) +
      '</th><th>' +
      esc(tx('etl_th_score', '分數（score）', 'Score')) +
      '</th><th>' +
      esc(tx('etl_th_syn', '異名（syn.）', 'Syn.')) +
      '</th><th>' +
      esc(tx('etl_th_approx', '近似（≈）', '≈')) +
      '</th><th>' +
      esc(tx('etl_th_warn', '警示', 'Flags')) +
      '</th><th>' +
      esc(tx('etl_col_status', '存佚狀態', 'Extant / extinct')) +
      '</th><th>' +
      esc(tx('etl_th_mc', '典藏（MC）', 'Collection')) +
      '</th>' +
      '</tr></thead><tbody>' +
      (taxRows || '<tr><td colspan="12">' + esc(tx('etl_empty_taxa', '尚無資料', 'No data')) + '</td></tr>') +
      '</tbody></table></div></details>' +
      '<div class="mc-etl-section-title">' +
      esc(tx('etl_autocomplete', '學名提示（自動完成）', 'Autocomplete')) +
      '</div>' +
      '<input class="mc-etl-input" id="mcEtlAuto" placeholder="' +
      esc(tx('etl_auto_placeholder', '輸入學名片段以自動完成…', 'Type part of a scientific name…')) +
      '" />' +
      '<div id="mcEtlAutoOut" class="mc-etl-hint"></div>' +
      '</div></aside>' +
      '<div class="mc-etl-aside-resize" id="mcEtlAsideResize" role="separator" aria-orientation="vertical" tabindex="0" aria-label="' +
      esc(tx('etl_aside_resize_aria', '拖曳以調整左側欄寬度', 'Drag to resize left panel')) +
      '" title="' +
      esc(tx('etl_aside_resize_tip', '拖曳調整寬度', 'Drag to resize width')) +
      '"></div>' +
      '<main class="mc-etl-panel mc-etl-panel--center">' +
      '<div class="mc-etl-canvas-toolbar">' +
      '<div class="mc-etl-canvas-toolbar__head">' +
      '<span class="mc-etl-canvas-toolbar__title">' +
      esc(tx('etl_canvas', '演化樹畫布', 'Tree canvas')) +
      '</span>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost mc-etl-bottom-dock-toggle" id="mcEtlToggleBottomDock" ' +
      'aria-expanded="' +
      (state.bottomDockVisible !== false ? 'true' : 'false') +
      '" aria-controls="mcEtlBottomDock" title="' +
      esc(
        tx(
          'etl_bottom_dock_tip',
          '隱藏或顯示下方分頁區，讓演化樹畫布變高',
          'Hide or show the bottom tab area to enlarge the tree canvas'
        )
      ) +
      '">' +
      esc(
        state.bottomDockVisible === false
          ? tx('etl_bottom_dock_show', '顯示下框', 'Show bottom panel')
          : tx('etl_bottom_dock_hide', '隱藏下框', 'Hide bottom panel')
      ) +
      '</button></div>' +
      '<div class="mc-etl-toolbar-cluster mc-etl-toolbar-cluster--modes" role="tablist" aria-label="' +
      esc(tx('etl_life_modes_aria', '生命樹檢視模式', 'Life tree modes')) +
      '">' +
      [
        ['classic', tx('etl_lm_classic', '經典分支樹', 'Classic branching')],
        ['circular', tx('etl_lm_circle', '圓形生命樹', 'Circular life tree')],
        ['spiral', tx('etl_lm_spiral', '螺旋時間樹', 'Time spiral')],
        ['cladistic', tx('etl_lm_clad', '支序分類圖', 'Cladistic')],
        ['radial', tx('etl_lm_radial', '放射關係樹', 'Radial / unrooted')],
        ['geologic', tx('etl_lm_geo', '地質時間對齊', 'Geologic timeline')],
        ['collection', tx('etl_lm_mc', '典藏覆蓋', 'Collection overlay')]
      ]
        .map(function (pair) {
          var vk = pair[0];
          var lm = state.lifeTreeMode || state.canvasView || 'classic';
          if (lm === 'compare' || lm === 'clade' || lm === 'timeline') {
            if (lm === 'timeline') lm = 'geologic';
            else if (lm === 'compare') lm = 'radial';
            else lm = 'classic';
          }
          return (
            '<button type="button" role="tab" class="mc-etl-viewtab' +
            (lm === vk ? ' is-active' : '') +
            '" data-life-mode="' +
            esc(vk) +
            '">' +
            esc(pair[1]) +
            '</button>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="mc-etl-toolbar-cluster mc-etl-toolbar-cluster--views" role="toolbar" aria-label="' +
      esc(tx('etl_toolbar_view_aria', '畫布檢視', 'Canvas view')) +
      '">' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost" id="mcEtlFit">' +
      esc(tx('etl_fit', '適合畫面', 'Fit')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost" id="mcEtlResetView">' +
      esc(tx('etl_reset_view', '重置視圖', 'Reset view')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost" id="mcEtlFocusTarget">' +
      esc(tx('etl_focus_target', '聚焦標的', 'Focus target')) +
      '</button></div>' +
      '<div class="mc-etl-toolbar-cluster mc-etl-toolbar-cluster--toggles" role="toolbar" aria-label="' +
      esc(tx('etl_toolbar_display_aria', '顯示選項', 'Display')) +
      '">' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost' +
      (state.vizShowLabels === false ? ' is-off' : '') +
      '" id="mcEtlToggleLabels" aria-pressed="' +
      (state.vizShowLabels !== false ? 'true' : 'false') +
      '">' +
      esc(tx('etl_toggle_labels', '標籤', 'Labels')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost' +
      (state.vizShowImages === false ? ' is-off' : '') +
      '" id="mcEtlToggleImages" aria-pressed="' +
      (state.vizShowImages !== false ? 'true' : 'false') +
      '">' +
      esc(tx('etl_toggle_images', '圖片', 'Images')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost' +
      (state.vizShowTime === false ? ' is-off' : '') +
      '" id="mcEtlToggleTime" aria-pressed="' +
      (state.vizShowTime !== false ? 'true' : 'false') +
      '">' +
      esc(tx('etl_toggle_time', '時間軸', 'Timeline')) +
      '</button>' +
      '<button type="button" class="mc-etl-btn mc-etl-btn--ghost' +
      (state.vizShowEpochBands === true ? '' : ' is-off') +
      '" id="mcEtlToggleEpoch" aria-pressed="' +
      (state.vizShowEpochBands === true ? 'true' : 'false') +
      '" title="' +
      esc(tx('etl_toggle_epoch_tip', '顯示「世」細節列（預設關閉以保持畫面簡潔）', 'Show epoch row')) +
      '">' +
      esc(tx('etl_toggle_epoch', '世·細節', 'Epochs')) +
      '</button></div></div>' +
      (skipHtmlTimegrid || state.vizShowTime === false
        ? ''
        : '<div class="mc-etl-timegrid" aria-label="' +
      esc(tx('etl_timegrid_aria', '地質年代參考軸：代與紀', 'Geologic reference')) +
      '">' +
      '<div class="mc-etl-timegrid__row mc-etl-timegrid__row--era" title="' +
      esc(tx('etl_era_bar_title', '代（Era）：寬度約略對應顯生宙內相對時長', 'Era band')) +
      '">' +
      '<span class="mc-etl-era mc-etl-era--pc">' +
      esc(tx('etl_era_pc', '前寒武紀', 'Precambrian')) +
      '</span>' +
      '<span class="mc-etl-era mc-etl-era--pz">' +
      esc(tx('etl_era_pz', '古生代', 'Paleozoic')) +
      '</span>' +
      '<span class="mc-etl-era mc-etl-era--mz">' +
      esc(tx('etl_era_mz', '中生代', 'Mesozoic')) +
      '</span>' +
      '<span class="mc-etl-era mc-etl-era--cz">' +
      esc(tx('etl_era_cz', '新生代', 'Cenozoic')) +
      '</span></div>' +
      '<div class="mc-etl-timegrid__row mc-etl-timegrid__row--period" title="' +
      esc(tx('etl_period_bar_title', '紀（Period）示意；細部「世」請見右側地質年代分頁', 'Period band')) +
      '">' +
      '<span class="mc-etl-per" style="flex:2.1">' +
      esc(tx('etl_p_camb', '寒武—泥盆', 'Cm–D')) +
      '</span>' +
      '<span class="mc-etl-per" style="flex:1.6">' +
      esc(tx('etl_p_carb', '石炭—二疊', 'C–P')) +
      '</span>' +
      '<span class="mc-etl-per" style="flex:1.4">' +
      esc(tx('etl_p_tri', '三疊', 'T')) +
      '</span>' +
      '<span class="mc-etl-per" style="flex:1.4">' +
      esc(tx('etl_p_jur', '侏羅', 'J')) +
      '</span>' +
      '<span class="mc-etl-per" style="flex:1.8">' +
      esc(tx('etl_p_cret', '白堊', 'K')) +
      '</span>' +
      '<span class="mc-etl-per" style="flex:1.2">' +
      esc(tx('etl_p_paleo', '古近紀', 'Pg')) +
      '</span>' +
      '<span class="mc-etl-per" style="flex:1.1">' +
      esc(tx('etl_p_neo', '新近紀', 'Ng')) +
      '</span>' +
      '<span class="mc-etl-per" style="flex:0.9">' +
      esc(tx('etl_p_q', '第四紀', 'Q')) +
      '</span></div>' +
      (state.vizShowEpochBands
        ? '<div class="mc-etl-timegrid__row mc-etl-timegrid__row--epoch" title="' +
          esc(tx('etl_epoch_bar_title', '世（Epoch）示意；細部請見地質年代分頁', 'Epoch band')) +
          '">' +
          '<span class="mc-etl-ep">' +
          esc(tx('etl_ep_paleo', '古新—漸新', 'Pg–O')) +
          '</span>' +
          '<span class="mc-etl-ep">' +
          esc(tx('etl_ep_mio', '中新世', 'Mi')) +
          '</span>' +
          '<span class="mc-etl-ep">' +
          esc(tx('etl_ep_plio', '上新世', 'Pl')) +
          '</span>' +
          '<span class="mc-etl-ep">' +
          esc(tx('etl_ep_pleis', '更新世', 'Ple')) +
          '</span>' +
          '<span class="mc-etl-ep">' +
          esc(tx('etl_ep_holo', '全新世', 'Hol')) +
          '</span></div>'
        : '') +
      '</div>') +
      '<div class="mc-etl-canvas' +
      ((state.lifeTreeMode || state.canvasView) === 'geologic' || state.canvasView === 'timeline'
        ? ' mc-etl-canvas--time'
        : '') +
      '" id="mcEtlCanvas">' +
      (state.busy ? '<div class="mc-etl-skel">' + esc(tx('etl_loading', '載入中…', 'Loading…')) + '</div>' : '') +
      (!state.busy && state.newick
        ? (function () {
            var tree = parseNewick(state.newick);
            if (!tree) return '<div class="mc-etl-msg">' + esc(tx('etl_newick_err', '無法解析 Newick', 'Newick parse failed')) + '</div>';
            annotateTreePaths(tree, '0', null);
            var selRowRemap = null;
            var retainPath0 = state.selectedPath || state.focusPath || '';
            if (retainPath0) {
              var selN0 = getNodeByPath(tree, retainPath0);
              if (selN0) {
                selRowRemap = {
                  ottId: Number(selN0.ottFromLabel) || extractOttFromLabel(selN0.name),
                  matchedName: selN0.displayName || formatPhyloDisplayName(selN0.name)
                };
              }
            }
            var treeView = treeForDisplayMode(tree);
            if (!treeView) treeView = tree;
            annotateTreePaths(treeView, '0', null);
            if (selRowRemap) {
              var fpRemap = findTipPathForTaxon(treeView, selRowRemap);
              if (fpRemap && fpRemap.path && fpRemap.score >= 50) {
                state.selectedPath = fpRemap.path;
                state.focusPath = fpRemap.path;
              }
            }
            var tips = countTips(treeView);
            if (tips > 1500)
              return (
                '<div class="mc-etl-msg">' +
                esc(
                  tx(
                    'etl_too_large',
                    '葉片過多（1500+）。請縮小範圍或改用指定物種關係樹。',
                    'Too many leaves (1500+). Narrow scope or use induced tree.'
                  )
                ) +
                '</div>'
              );
            var hi = state.highlightPaths || {};
            if (!hi || typeof hi !== 'object' || Array.isArray(hi)) hi = {};
            var lm0 = state.lifeTreeMode || '';
            if (!lm0) {
              var cv0 = state.canvasView || 'classic';
              if (cv0 === 'timeline') lm0 = 'geologic';
              else if (cv0 === 'compare') lm0 = 'radial';
              else if (cv0 === 'clade') lm0 = 'classic';
              else lm0 = cv0 === 'circular' ? 'circular' : 'classic';
              state.lifeTreeMode = lm0;
            }
            var panOpts = {
              selectedPath: state.selectedPath || state.focusPath,
              highlightPaths: hi,
              taxaRows: state.taxa || [],
              scale: state.treeViz.scale || 1,
              panX: state.treeViz.tx || 0,
              panY: state.treeViz.ty || 0,
              showGeologicTimeAxis: lm0 === 'geologic' || state.canvasView === 'timeline',
              showEpochBands: state.vizShowEpochBands === true,
              cladisticChars: state.cladisticChars || [],
              collectionOverlay: lm0 === 'collection',
              vizShowLabels: state.vizShowLabels !== false,
              vizShowImages: state.vizShowImages !== false,
              labelDensity: state.labelDensity || 'standard',
              imageDensity: state.imageDensity || 'selected_nearby'
            };
            var useAlt =
              global.MCEvolutionTreeLayouts &&
              typeof global.MCEvolutionTreeLayouts.render === 'function' &&
              ['circular', 'spiral', 'cladistic', 'radial'].indexOf(lm0) >= 0 &&
              tips <= 220;
            if (useAlt) {
              var alt = global.MCEvolutionTreeLayouts.render(lm0, treeView, panOpts);
              if (alt && alt.html) {
                state._lastPhyloBounds = { w: alt.width, h: alt.height };
                return '<div class="mc-etl-phylo-wrap" id="mcEtlPhyloWrap">' + alt.html + '</div>';
              }
            }
            var svg = renderPhyloSvgHorizontal(treeView, panOpts);
            return '<div class="mc-etl-phylo-wrap" id="mcEtlPhyloWrap">' + svg.html + '</div>';
          })()
        : '') +
      (!state.busy && !state.newick && !state.onboarding
        ? '<div class="mc-etl-skel">' + esc(tx('etl_no_tree', '尚未建立樹', 'No tree yet')) + '</div>'
        : '') +
      (state.onboarding
        ? '<div class="mc-etl-onboarding" id="mcEtlOnboard">' +
          '<div class="mc-etl-onboarding__card">' +
          '<h2>' +
          esc(tx('etl_onb_title', '從學名開始', 'Start with scientific names')) +
          '</h2>' +
          '<p>' +
          esc(
            tx(
              'etl_onb_body',
              '貼上學名、解析、建立樹並匯出研究報告。OpenTree 合成樹非絕對時間標定樹，請勿將分支長度解讀為地質年代。',
              'Paste names, resolve, build, export. OpenTree synthetic tree is not necessarily time-calibrated.'
            )
          ) +
          '</p>' +
          '<div class="mc-etl-preset-row">' +
          '<button type="button" class="mc-etl-btn" data-preset="primates">' +
          esc(tx('etl_pre_p', '比較靈長類', 'Compare primates')) +
          '</button>' +
          '<button type="button" class="mc-etl-btn" data-preset="beetles">' +
          esc(tx('etl_pre_b', '比較甲蟲', 'Compare beetles')) +
          '</button>' +
          '<button type="button" class="mc-etl-btn" data-preset="orders">' +
          esc(tx('etl_pre_o', '昆蟲目級', 'Insect orders')) +
          '</button>' +
          '<button type="button" class="mc-etl-btn mc-etl-btn--primary" id="mcEtlOnbImport">' +
          esc(tx('etl_import_spec', '從標本匯入學名', 'Import specimens')) +
          '</button>' +
          '<button type="button" class="mc-etl-btn mc-etl-btn--ghost" id="mcEtlOnbClose">' +
          esc(tx('etl_onb_close', '關閉', 'Close')) +
          '</button>' +
          '</div></div></div>'
        : '') +
      '</div></main>' +
      '<section class="mc-etl-bottom-dock" id="mcEtlBottomDock" aria-label="' +
      esc(tx('etl_dock_aria', '標本分頁與詳細內容', 'Specimen tabs and details')) +
      '" ' +
      (state.bottomDockVisible === false ? 'hidden aria-hidden="true"' : '') +
      '>' +
      '<div class="mc-etl-bp-schematic" role="img" aria-label="' +
      esc(
        tx(
          'etl_bp_schematic_aria',
          '版面示意：寬螢為左欄與畫布並列、分頁在底；平板與手機為直向堆疊',
          'Layout key: wide = side + tree, tabs below; tablet/phone = stacked'
        )
      ) +
      '">' +
      '<span class="mc-etl-bp-cap">' +
      esc(tx('etl_bp_cap', '版面', 'Layout')) +
      '</span>' +
      '<span class="mc-etl-bp-fig mc-etl-bp-fig--wide" title="' +
      esc(tx('etl_bp_wide', '≥1181px：左欄＋寬畫布；分頁列於下方', '≥1181px')) +
      '"><span class="mc-etl-bp-fig__row"><i class="mc-etl-bp-cell mc-etl-bp-cell--s"></i><i class="mc-etl-bp-cell mc-etl-bp-cell--l"></i></span><i class="mc-etl-bp-cell mc-etl-bp-cell--dock"></i></span>' +
      '<span class="mc-etl-bp-fig mc-etl-bp-fig--mid" title="' +
      esc(tx('etl_bp_mid', '721–1180px：三區直向堆疊', '721–1180px')) +
      '"><i class="mc-etl-bp-cell mc-etl-bp-cell--s"></i><i class="mc-etl-bp-cell mc-etl-bp-cell--l"></i><i class="mc-etl-bp-cell mc-etl-bp-cell--dock"></i></span>' +
      '<span class="mc-etl-bp-fig mc-etl-bp-fig--narrow" title="' +
      esc(tx('etl_bp_narrow', '≤720px：畫布優先；分頁可橫向捲動', '≤720px')) +
      '"><i class="mc-etl-bp-cell mc-etl-bp-cell--l"></i><i class="mc-etl-bp-cell mc-etl-bp-cell--dock"></i></span>' +
      '</div>' +
      '<div class="mc-etl-panel mc-etl-panel--dock">' +
      '<div class="mc-etl-tabs">' +
      ['basic', 'evo', 'nearby', 'cladistic', 'time', 'geology', 'sources', 'media', 'mc', 'notes', 'export']
        .map(function (k) {
          return (
            '<button type="button" class="mc-etl-tab' +
            (state.tab === k ? ' is-active' : '') +
            '" data-tab="' +
            k +
            '">' +
            esc(
              k === 'basic'
                ? tx('etl_tab_basic', '基本資訊', 'Overview')
                : k === 'evo'
                  ? tx('etl_tab_evo', '演化定位', 'Phylogeny')
                  : k === 'nearby'
                    ? tx('etl_tab_nearby', '近緣群', 'Nearby taxa')
                  : k === 'cladistic'
                    ? tx('etl_tab_cladistic', '支序特徵', 'Cladistic characters')
                    : k === 'time'
                      ? tx('etl_tab_time', '地質年代', 'Geologic time')
                      : k === 'geology'
                        ? tx('etl_tab_geology', '地質背景 AfriGIS', 'Geology (AfriGIS)')
                        : k === 'sources'
                          ? tx('etl_tab_sources', '來源資料', 'Sources')
                          : k === 'media'
                            ? tx('etl_tab_media', '圖片', 'Media')
                            : k === 'mc'
                              ? tx('etl_tab_mc', 'MCurator 綁定', 'MCurator')
                              : k === 'notes'
                                ? tx('etl_tab_notes', '筆記', 'Notes')
                                : tx('etl_tab_export', '匯出', 'Export')
            ) +
            '</button>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="mc-etl-tab-body" id="mcEtlTabBody">' +
      tabBodyHtml() +
      '</div>' +
      '</div></section></div></div>';

    wireEvents(root);
  }

  function tabBodyHtml() {
    if (state.tab === 'basic') {
      var n = state.selectedNode;
      var parts = [];
      if (state.locateNote) {
        parts.push('<p class="mc-etl-msg mc-etl-msg--info">' + esc(state.locateNote) + '</p>');
      }
      if (!n || !n.name) {
        parts.push(
          '<p class="mc-etl-prose">' +
            esc(
              tx(
                'etl_pick_node',
                '點選樹上節點，或使用左側「定位到演化樹」。',
                'Click a tree node, or use Locate on the tree in the left panel.'
              )
            ) +
            '</p>'
        );
        return parts.join('');
      }
      parts.push(
        '<div class="mc-etl-kv"><strong>' +
          esc(tx('etl_lbl_name', '顯示名稱', 'Name')) +
          '</strong><br/>' +
          esc(n.name) +
          '</div>'
      );
      if (n.name && String(n.name).charAt(0) === PHYLO_EXTINCT_DAGGER) {
        parts.push(
          '<div class="mc-etl-kv mc-etl-kv--fossil"><strong>' +
            esc(tx('etl_extinct_mark', '滅絕標記', 'Extinct marker')) +
            '</strong><br/>' +
            esc(
              tx(
                'etl_dagger_expl',
                '學名前之「†」表示依 PBDB／名錄或常見古生物群之滅絕推定；不確定者不標示。',
                'Leading † indicates extinct per PBDB, tray, or curated fossil hints; uncertain taxa are not marked.'
              )
            ) +
            '</div>'
        );
      }
      if (n.ott) parts.push('<div class="mc-etl-kv"><strong>OTT</strong> ' + esc(String(n.ott)) + '</div>');
      if (n.weak) {
        parts.push(
          '<p class="mc-etl-muted">' +
            esc(tx('etl_uncertain_place', '此節點可能為近似對應，請交叉驗證學名與來源。', 'Placement may be approximate.')) +
            '</p>'
        );
      }
      return parts.join('');
    }
    if (state.tab === 'evo') {
      var bc =
        state.lineageLabels && state.lineageLabels.length
          ? '<p class="mc-etl-breadcrumb">' + esc(state.lineageLabels.join(' › ')) + '</p>'
          : '<p class="mc-etl-muted">' + esc(tx('etl_no_lineage', '尚無路徑；請先定位或點選節點。', 'No lineage yet.')) + '</p>';
      var mrcaBlock = '';
      if (state.mrca) {
        if (state.buildKind === 'position' && state.mrca.summaryZh) {
          mrcaBlock =
            '<div class="mc-etl-ins-card"><h4 class="mc-etl-subh">' +
            esc(tx('etl_evo_place_title', '演化定位摘要', 'Placement summary')) +
            '</h4><p>' +
            esc(state.mrca.summaryZh) +
            '</p><p class="mc-etl-muted">' +
            esc(tx('etl_lineage_steps', '譜系層級數', 'Lineage steps')) +
            ': ' +
            esc(String(state.mrca.lineageSteps != null ? state.mrca.lineageSteps : '—')) +
            '</p></div>';
        } else if (state.buildKind !== 'position') {
          var mname =
            state.mrca.summaryZh ||
            (state.mrca.mrca && (state.mrca.mrca.name || state.mrca.mrca.unique_name)) ||
            state.mrca.name ||
            state.mrca.ott_id ||
            '';
          mrcaBlock =
            '<div class="mc-etl-ins-card"><h4 class="mc-etl-subh">' +
            esc(tx('etl_mrca_block', '最近共同祖先（MRCA）', 'MRCA')) +
            '</h4><p class="mc-etl-prose">' +
            esc(
              mname
                ? String(mname)
                : tx('etl_mrca_struct', '已自 OpenTree 取得 MRCA 資料；建議搭配畫布末端對照。', 'MRCA from OpenTree.')
            ) +
            '</p></div>';
        }
      } else {
        mrcaBlock = '<p class="mc-etl-muted">' + esc(tx('etl_no_mrca', '尚未計算 MRCA', 'No MRCA yet')) + '</p>';
      }
      var placeNote = '';
      if (state.buildKind === 'position') {
        placeNote =
          '<p class="mc-etl-muted">' +
          esc(
            tx(
              'etl_place_disclaimer',
              '單點定位以 OpenTree 分類譜系為主幹；與合成樹誘導子樹不同，目的在呈現「位置」而非全部後裔。',
              'Lineage placement uses taxonomy backbone.'
            )
          ) +
          '</p>';
      }
      return (
        bc +
        placeNote +
        '<div class="mc-etl-row-btns">' +
        '<button type="button" class="mc-etl-btn" id="mcEtlHighlightPath">' +
        esc(tx('etl_btn_highlight_path', '高亮完整路徑', 'Highlight path')) +
        '</button>' +
        '</div>' +
        mrcaBlock
      );
    }
    if (state.tab === 'nearby') {
      var focalN = firstSelectedTaxonRow();
      var partsNb = [];
      partsNb.push(
        '<p class="mc-etl-prose">' +
          esc(
            tx(
              'etl_nearby_intro',
              '近緣群為研究輔助視角：可搭配「近緣／近似種」觀察方向與誘導子樹；請仍以文獻與譜係分析為準。',
              'Nearby taxa are a research aid—pair with the Nearby view direction and induced tree; verify with literature.'
            )
          ) +
          '</p>'
      );
      if (focalN) {
        var nmF = focalN.matchedName || focalN.inputName || '';
        var genusTok = String(nmF).split(/[\s_(]/)[0] || '';
        var kSis = String(genusTok || '')
          .toLowerCase()
          .replace(/\s+/g, '');
        var stubsN = siblingStubsForTaxon(kSis);
        if (!stubsN || !stubsN.length) stubsN = siblingStubsForTaxon(String(nmF).toLowerCase().replace(/\s+/g, ''));
        if (stubsN && stubsN.length) {
          partsNb.push(
            '<div class="mc-etl-ins-card"><h4 class="mc-etl-subh">' +
              esc(tx('etl_nearby_sister', '姊妹支系（示意）', 'Sister lineages (illustrative)')) +
              '</h4><ul class="mc-etl-ul">'
          );
          for (var sn = 0; sn < stubsN.length; sn++) partsNb.push('<li>' + esc(stubsN[sn]) + '</li>');
          partsNb.push('</ul></div>');
        }
        partsNb.push(
          '<div class="mc-etl-row-btns">' +
            '<button type="button" class="mc-etl-btn" id="mcEtlApplyNearbyView">' +
            esc(tx('etl_nearby_apply', '套用近緣檢視', 'Apply nearby view')) +
            '</button> ' +
            '<button type="button" class="mc-etl-btn" id="mcEtlOpenCompare">' +
            esc(tx('etl_nearby_compare', '加入比較盤', 'Add to compare')) +
            '</button></div>'
        );
      } else {
        partsNb.push(
          '<p class="mc-etl-muted">' +
            esc(tx('etl_nearby_need', '請先解析並選取一筆學名。', 'Resolve and select a taxon first.')) +
            '</p>'
        );
      }
      return partsNb.join('');
    }
    if (state.tab === 'time') {
      var partsT = [];
      var extantNote =
        '<div class="mc-etl-ins-card"><p>' +
        esc(
          tx(
            'etl_time_extant',
            '現生生物沒有單一「物種起源地質世」可供自動標定。若需古環境脈絡，請檢視上層分類群、化石姊妹群，或切換至 PBDB 相關學名。',
            'Extant taxa: geologic species ages are not auto-assigned.'
          )
        ) +
        '</p></div>';
      var hasExtantNoGeo = false;
      (state.taxa || []).forEach(function (t) {
        var g = t.geologicDetail;
        var gr = t.geologicRange || {};
        if (g && (g.periodZh || g.eraZh || g.period || g.era)) {
          partsT.push(
            '<div class="mc-etl-ins-card"><strong>' +
              esc(t.uniqueName || t.matchedName || t.inputName) +
              '</strong><ul class="mc-etl-ul">' +
              '<li>' +
              esc(tx('etl_geo_era', '代（Era）', 'Era')) +
              '：' +
              esc(g.eraZh || g.era || '—') +
              '</li>' +
              '<li>' +
              esc(tx('etl_geo_period', '紀（Period）', 'Period')) +
              '：' +
              esc(g.periodZh || g.period || '—') +
              '</li>' +
              (g.epochZh || g.epoch
                ? '<li>' +
                  esc(tx('etl_geo_epoch', '世（Epoch）', 'Epoch')) +
                  '：' +
                  esc(g.epochZh || g.epoch) +
                  '</li>'
                : '') +
              '</ul><p class="mc-etl-muted">' +
              esc(g.noteZh || '') +
              '</p><p class="mc-etl-muted">PBDB：' +
              esc(String(gr.firstAppearance || '—')) +
              ' — ' +
              esc(String(gr.lastAppearance || '—')) +
              '</p></div>'
          );
        } else if (gr.firstAppearance || gr.lastAppearance) {
          partsT.push(
            '<div class="mc-etl-ins-card"><strong>' +
              esc(t.uniqueName || t.matchedName || t.inputName) +
              '</strong><br/>' +
              esc(String(gr.firstAppearance || '—')) +
              ' — ' +
              esc(String(gr.lastAppearance || '—')) +
              '</div>'
          );
        } else if (t.extinctStatus === 'extant') {
          hasExtantNoGeo = true;
        }
      });
      if (!partsT.length && hasExtantNoGeo) partsT.push(extantNote);
      if (!partsT.length) {
        partsT.push(
          '<div class="mc-etl-ins-card"><p>' +
            esc(
              tx(
                'etl_time_fallback',
                '目前無可自動比對的紀／世欄位。化石類請確認 PBDB 已勾選並重新解析；圖上方代／紀軸僅供顯生宙相對比例參考。',
                'No epoch data; see PBDB.'
              )
            ) +
            '</p></div>'
        );
      }
      partsT.push(
        '<p class="mc-etl-muted" style="margin-top:10px;">' +
          esc(
            tx(
              'etl_time_precision',
              '除非註明為 PBDB 直接區間，否則由關鍵字推得之紀／世皆為近似對照，不作為定年依據。',
              'Approximate unless PBDB direct.'
            )
          ) +
          '</p>'
      );
      return partsT.join('');
    }
    if (state.tab === 'media') {
      var rowM =
        (state.taxa || []).filter(function (t) {
          return t.id === state.activeTaxonId;
        })[0] || (state.taxa || [])[0];
      if (!rowM) {
        return esc(tx('etl_media_empty', '尚無圖片；請先解析學名。', 'Resolve a taxon first.'));
      }
      var uM = (rowM.media && rowM.media.thumbnailUrl) || specimenImageForScientificName(rowM.matchedName || rowM.inputName || '');
      if (!uM) {
        return esc(tx('etl_media_none', '此筆資料尚無可用縮圖（可稍後重試 GBIF／維基百科）。', 'No thumbnail yet.'));
      }
      return (
        '<img class="mc-etl-media-preview" src="' +
        esc(uM) +
        '" alt="" loading="lazy" /><p class="mc-etl-muted">' +
        esc((rowM.media && rowM.media.source) || '') +
        '</p>'
      );
    }
    if (state.tab === 'sources') {
      var parts = [];
      parts.push(
        '<p class="mc-etl-prose">' +
          esc(
            tx(
              'etl_sources_intro',
              'OpenTree 為主幹；GBIF 強化現生物種與學名狀態；PBDB 提供化石出現與地質區間。若來源不一致，請以信心標示為準，勿過度推斷。',
              'OpenTree backbone with optional GBIF and PBDB enrichment.'
            )
          ) +
          '</p>'
      );
      if (state.sourceStudies && state.sourceStudies.length) {
        var rawS = state.sourceStudies;
        var rowsS = Array.isArray(rawS) ? rawS : rawS.studies || rawS.results || rawS.matches || [];
        if (!Array.isArray(rowsS)) rowsS = [];
        parts.push(
          '<h4 class="mc-etl-subh">' +
            esc(tx('etl_studies_head', '相關研究（摘要）', 'Related studies')) +
            '</h4><ul class="mc-etl-ul">'
        );
        rowsS.slice(0, 12).forEach(function (s) {
          var line =
            typeof s === 'string'
              ? s
              : String(
                  (s && (s.title || s.name || s.study_id || s.id || s['ot:studyId'])) ||
                    (s && s['ot:studyPublicationReference']) ||
                    ''
                ).trim();
          if (!line) line = JSON.stringify(s).slice(0, 96);
          parts.push('<li>' + esc(line) + '</li>');
        });
        parts.push('</ul>');
      } else {
        parts.push('<p class="mc-etl-muted">' + esc(tx('etl_no_studies', '尚無研究列表', 'No studies')) + '</p>');
      }
      return parts.join('');
    }
    if (state.tab === 'mc') {
      var mcNames = specimenScientificNames();
      var ul = (state.taxa || [])
        .map(function (t) {
          var inMc = taxonInCollection(t.uniqueName, t.matchedName);
          return (
            '<li>' +
            esc(t.matchedName || t.inputName) +
            (inMc ? ' <span class="mc-etl-badge mc-etl-badge--mc">✓</span>' : '') +
            '</li>'
          );
        })
        .join('');
      if (!ul) {
        ul =
          '<li class="mc-etl-muted">' +
          esc(tx('etl_mc_empty', '請先解析學名或從標本匯入。', 'Resolve taxa or import from specimens first.')) +
          '</li>';
      }
      return (
        '<p class="mc-etl-prose">' +
        esc(tx('etl_mc_intro', '與 MCurator 標本學名比對；✓ 表示收藏中已有相同或相近學名。', 'Crosswalk to your specimen scientific names.')) +
        '</p><ul class="mc-etl-ul">' +
        ul +
        '</ul><p class="mc-etl-muted">' +
        esc(tx('etl_mc_count', '標本庫學名數：', 'Unique specimen names: ')) +
        mcNames.length +
        '</p>'
      );
    }
    if (state.tab === 'notes') {
      return (
        '<textarea class="mc-etl-textarea" id="mcEtlNotes" style="min-height:200px;">' +
        esc(state.notes) +
        '</textarea><button type="button" class="mc-etl-btn" id="mcEtlNotesSave">' +
        esc(tx('etl_notes_save', '儲存筆記', 'Save notes')) +
        '</button>'
      );
    }
    if (state.tab === 'export') {
      return (
        '<p>' +
        esc(tx('etl_export_md', 'Markdown 報告與 Newick 可複製下載。', 'Copy or download Markdown / Newick.')) +
        '</p>' +
        '<button type="button" class="mc-etl-btn" id="mcEtlCopyNw">' +
        esc(tx('etl_copy_nwk', '複製 Newick', 'Copy Newick')) +
        '</button> ' +
        '<button type="button" class="mc-etl-btn" id="mcEtlDlMd">' +
        esc(tx('etl_dl_md', '下載 Markdown', 'Download Markdown')) +
        '</button>'
      );
    }
    if (state.tab === 'geology') {
      var gctx = state.geologyContext || null;
      var gNote =
        '<div class="mc-etl-ins-card"><p class="mc-etl-prose">' +
        esc(
          tx(
            'etl_geo_disclaimer',
            'AfriGIS 地質資料僅描述「採樣座標」所在地層與年代脈絡，不作為譜系或化石首末現身之證明。請與 PBDB／OpenTree 分開解讀。',
            'AfriGIS describes local rock context at coordinates—not phylogenetic proof.'
          )
        ) +
        '</p></div>';
      var gForm =
        '<div class="mc-etl-ins-card"><h4 class="mc-etl-subh">' +
        esc(tx('etl_geo_input_title', '採集地／化石產地座標', 'Locality coordinates')) +
        '</h4>' +
        '<label class="mc-etl-field__lab" for="mcEtlGeoLat">WGS84 緯度</label>' +
        '<input class="mc-etl-input" id="mcEtlGeoLat" type="text" inputmode="decimal" value="' +
        esc(state.geoLat || '') +
        '" placeholder="例：-25.7" />' +
        '<label class="mc-etl-field__lab" for="mcEtlGeoLng">WGS84 經度</label>' +
        '<input class="mc-etl-input" id="mcEtlGeoLng" type="text" inputmode="decimal" value="' +
        esc(state.geoLng || '') +
        '" placeholder="例：28.2" />' +
        '<button type="button" class="mc-etl-btn mc-etl-btn--primary" id="mcEtlGeoFetch" style="margin-top:10px">' +
        esc(tx('etl_geo_fetch', '查詢地質背景', 'Fetch geology')) +
        '</button>' +
        '<p class="mc-etl-muted" id="mcEtlGeoStatus">' +
        esc(state.afriGisNote || '') +
        '</p></div>';
      var gBody = '';
      if (gctx && !gctx.disabled) {
        gBody =
          '<div class="mc-etl-ins-card"><h4 class="mc-etl-subh">' +
          esc(tx('etl_geo_result', '查詢結果', 'Result')) +
          '</h4><ul class="mc-etl-ul">' +
          '<li><strong>' +
          esc(tx('etl_geo_litho', '岩性地層', 'Lithostratigraphy')) +
          '</strong>：' +
          esc(gctx.lithostratigraphy || '—') +
          '</li>' +
          '<li><strong>' +
          esc(tx('etl_geo_chrono', '年代地層', 'Chronostratigraphy')) +
          '</strong>：' +
          esc(gctx.chronostratigraphy || '—') +
          '</li>' +
          '<li><strong>' +
          esc(tx('etl_geo_unit', '地質單元', 'Geological unit')) +
          '</strong>：' +
          esc(gctx.geologicalUnit || '—') +
          '</li>' +
          '<li><strong>' +
          esc(tx('etl_geo_age', '年代描述', 'Age')) +
          '</strong>：' +
          esc(gctx.ageDescription || '—') +
          '</li>' +
          '</ul><p class="mc-etl-muted">AfriGIS · ' +
          esc(gctx.fetchedAt || '') +
          '</p></div>';
      } else if (gctx && gctx.disabled) {
        gBody =
          '<div class="mc-etl-msg mc-etl-msg--info">' +
          esc(gctx.message || tx('etl_geo_disabled', 'AfriGIS 未啟用或需 OAuth 設定。', 'AfriGIS unavailable.')) +
          '</div>';
      }
      return gNote + gForm + gBody;
    }
    if (state.tab === 'cladistic') {
      var expl =
        '<div class="mc-etl-ins-card"><p>' +
        esc(
          tx(
            'etl_clad_expl',
            '紅色圓點可表示共同祖先節點示意；藍色標籤表示衍徵（使用者標註或示範資料）。單系群須以譜系與特徵共同檢驗；並系／複系群應標示為研究警示。',
            'Red node: hypothetical ancestor marker. Blue: trait markers (manual or demo).'
          )
        ) +
        '</p></div>';
      var rowsC = (state.cladisticChars || [])
        .map(function (c) {
          return (
            '<tr><td>' +
            esc(c.label || '') +
            '</td><td>' +
            esc(c.state || '') +
            '</td><td>' +
            esc(c.source || '') +
            '</td><td><button type="button" class="mc-etl-btn mc-etl-btn--ghost" data-clad-remove="' +
            esc(c.id) +
            '">' +
            esc(tx('etl_remove', '移除', 'Remove')) +
            '</button></td></tr>'
          );
        })
        .join('');
      var tbl =
        '<div class="mc-etl-ins-card"><h4 class="mc-etl-subh">' +
        esc(tx('etl_clad_list', '特徵標記列表', 'Character markers')) +
        '</h4>' +
        (rowsC
          ? '<table class="mc-etl-table"><thead><tr><th>' +
            esc(tx('etl_clad_col_l', '特徵', 'Trait')) +
            '</th><th>' +
            esc(tx('etl_clad_col_s', '狀態', 'State')) +
            '</th><th>' +
            esc(tx('etl_clad_col_src', '來源', 'Source')) +
            '</th><th></th></tr></thead><tbody>' +
            rowsC +
            '</tbody></table>'
          : '<p class="mc-etl-muted">' + esc(tx('etl_clad_empty', '尚無自訂標記。', 'No markers yet.')) + '</p>') +
        '</div>';
      var formC =
        '<div class="mc-etl-ins-card"><h4 class="mc-etl-subh">' +
        esc(tx('etl_clad_add', '新增手動衍徵', 'Add manual trait')) +
        '</h4>' +
        '<label class="mc-etl-field__lab" for="mcEtlCladLabel">' +
        esc(tx('etl_clad_lbl', '標籤', 'Label')) +
        '</label><input class="mc-etl-input" id="mcEtlCladLabel" />' +
        '<label class="mc-etl-field__lab" for="mcEtlCladState">' +
        esc(tx('etl_clad_state', '狀態描述', 'State')) +
        '</label><input class="mc-etl-input" id="mcEtlCladState" />' +
        '<button type="button" class="mc-etl-btn mc-etl-btn--primary" id="mcEtlCladAdd" style="margin-top:10px">' +
        esc(tx('etl_clad_save', '加入清單', 'Add')) +
        '</button></div>';
      return expl + tbl + formC;
    }
    return '';
  }

  var autoTimer = null;

  function applyAsideWidthFromStorage(grid) {
    if (!grid) return;
    var def = 300;
    var w = def;
    try {
      var raw = global.localStorage.getItem(ETL_ASIDE_WIDTH_LS);
      var n = Math.round(Number(raw));
      if (n >= 220 && n <= 720) w = n;
    } catch (eLs) {}
    try {
      grid.style.setProperty('--mc-etl-aside-w', w + 'px');
    } catch (eSt) {}
  }

  function maxAsidePx(gridEl) {
    try {
      var rw = gridEl.getBoundingClientRect().width;
      return Math.max(280, Math.min(580, Math.floor(rw * 0.52)));
    } catch (e) {
      return 520;
    }
  }

  function parseAsideWidthPx(grid) {
    try {
      var v = grid && grid.style && grid.style.getPropertyValue('--mc-etl-aside-w');
      var m = String(v || '').match(/([\d.]+)\s*px/i);
      if (m) return Math.round(Number(m[1]));
    } catch (e) {}
    return 300;
  }

  function wireAsideResize(root) {
    var grid = root.querySelector('.mc-etl-grid');
    var handle = root.querySelector('#mcEtlAsideResize');
    if (!grid || !handle) return;
    applyAsideWidthFromStorage(grid);
    if (global.__mcEtlAsideResizeDocBound) return;
    global.__mcEtlAsideResizeDocBound = true;
    var drag = { on: false, grid: null, startX: 0, startW: 0 };

    function finishDrag() {
      if (!drag.on) return;
      drag.on = false;
      try {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      } catch (eB) {}
      try {
        if (drag.grid) {
          var cur = parseAsideWidthPx(drag.grid);
          global.localStorage.setItem(ETL_ASIDE_WIDTH_LS, String(cur));
        }
      } catch (eLs) {}
      drag.grid = null;
    }

    global.window.addEventListener(
      'pointermove',
      function (e) {
        if (!drag.on || !drag.grid) return;
        try {
          e.preventDefault();
        } catch (eP) {}
        var nw = drag.startW + (e.clientX - drag.startX);
        nw = Math.max(220, Math.min(maxAsidePx(drag.grid), nw));
        drag.grid.style.setProperty('--mc-etl-aside-w', Math.round(nw) + 'px');
      },
      { passive: false }
    );
    global.window.addEventListener('pointerup', finishDrag);
    global.window.addEventListener('pointercancel', finishDrag);
    global.document.addEventListener(
      'pointerdown',
      function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var h = t.closest('#mcEtlAsideResize');
        if (!h) return;
        var g = h.closest('.mc-etl-grid');
        if (!g) return;
        drag.on = true;
        drag.grid = g;
        drag.startX = e.clientX;
        drag.startW = parseAsideWidthPx(g);
        try {
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
        } catch (eB) {}
        try {
          h.setPointerCapture(e.pointerId);
        } catch (eC) {}
      },
      true
    );
    global.document.addEventListener('keydown', function (e) {
      if (!e.target || e.target.id !== 'mcEtlAsideResize') return;
      var g = e.target.closest && e.target.closest('.mc-etl-grid');
      if (!g) return;
      var step = e.shiftKey ? 24 : 12;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        try {
          e.preventDefault();
        } catch (eP) {}
        var cur = parseAsideWidthPx(g);
        var mx = maxAsidePx(g);
        var nw = e.key === 'ArrowRight' ? cur + step : cur - step;
        nw = Math.max(220, Math.min(mx, nw));
        g.style.setProperty('--mc-etl-aside-w', Math.round(nw) + 'px');
        try {
          global.localStorage.setItem(ETL_ASIDE_WIDTH_LS, String(nw));
        } catch (eLs) {}
      }
    });
  }

  function wireEvents(root) {
    var names = root.querySelector('#mcEtlNames');
    var ctx = root.querySelector('#mcEtlCtx');
    var mode = root.querySelector('#mcEtlMode');
    if (names)
      names.addEventListener('change', function () {
        state.inputNames = parseNameLines(names.value);
      });
    if (ctx)
      ctx.addEventListener('change', function () {
        state.contextName = ctx.value;
        render();
      });
    if (mode)
      mode.addEventListener('change', function () {
        state.treeMode = mode.value;
        render();
      });
    root.querySelector('#mcEtlResolve') &&
      root.querySelector('#mcEtlResolve').addEventListener('click', function () {
        doResolve();
      });
    root.querySelector('#mcEtlInfer') &&
      root.querySelector('#mcEtlInfer').addEventListener('click', function () {
        doInfer();
      });
    root.querySelector('#mcEtlClear') &&
      root.querySelector('#mcEtlClear').addEventListener('click', function () {
        state.inputNames = [];
        state.taxa = [];
        state.newick = '';
        state.mrca = null;
        state.err = null;
        state.quickSearchDraft = '';
        state.highlightPaths = {};
        state.selectedPath = '';
        state.focusPath = '';
        state.lineageLabels = [];
        state.locateNote = '';
        state.treeViz = { scale: 1, tx: 0, ty: 0 };
        state.selectedNode = null;
        state.buildKind = '';
        state.canvasView = 'classic';
        state.lastTaxonInfo = null;
        state.compareTray = [];
        state.geologyContext = null;
        state.afriGisNote = '';
        state.vizShowLabels = true;
        state.vizShowImages = true;
        state.vizShowTime = true;
        state.vizShowEpochBands = false;
        state.displayMode = 'standard';
        state.expansionScope = 1;
        state.labelDensity = 'standard';
        state.imageDensity = 'selected_nearby';
        state.viewDirection = 'ancestry';
        render();
      });
    root.querySelector('#mcEtlBuild') &&
      root.querySelector('#mcEtlBuild').addEventListener('click', function () {
        doBuildTree();
      });
    root.querySelector('#mcEtlNew') &&
      root.querySelector('#mcEtlNew').addEventListener('click', function () {
        state.id = uid();
        state.title = '演化樹研究工具';
        state.taxa = [];
        state.newick = '';
        state.mrca = null;
        state.notes = '';
        state.onboarding = true;
        state.err = null;
        state.quickSearchDraft = '';
        state.highlightPaths = {};
        state.selectedPath = '';
        state.focusPath = '';
        state.lineageLabels = [];
        state.treeViz = { scale: 1, tx: 0, ty: 0 };
        state.selectedNode = null;
        state.buildKind = '';
        state.canvasView = 'classic';
        state.lastTaxonInfo = null;
        state.compareTray = [];
        state.geologyContext = null;
        state.afriGisNote = '';
        state.cladisticChars = [];
        state.vizShowLabels = true;
        state.vizShowImages = true;
        state.vizShowTime = true;
        state.vizShowEpochBands = false;
        state.displayMode = 'standard';
        state.expansionScope = 1;
        state.labelDensity = 'standard';
        state.imageDensity = 'selected_nearby';
        state.viewDirection = 'ancestry';
        render();
      });
    root.querySelector('#mcEtlSave') &&
      root.querySelector('#mcEtlSave').addEventListener('click', function () {
        doSaveProject();
      });
    root.querySelector('#mcEtlExport') &&
      root.querySelector('#mcEtlExport').addEventListener('click', function () {
        state.tab = 'export';
        state.onboarding = false;
        state.bottomDockVisible = true;
        try {
          if (global.localStorage) global.localStorage.setItem(ETL_BOTTOM_DOCK_LS, '1');
        } catch (eEx) {}
        render();
      });
    root.querySelector('#mcEtlImportSp') &&
      root.querySelector('#mcEtlImportSp').addEventListener('click', function () {
        importSpecimens();
      });
    root.querySelector('#mcEtlHelp') &&
      root.querySelector('#mcEtlHelp').addEventListener('click', function () {
        global.alert(
          tx(
            'etl_help_txt',
            '流程：輸入學名 → 解析學名 → 選取 OTT → 建立演化樹。若合成樹失敗可改分類子樹。大型樹可能需縮小 height limit。',
            'Flow: names → TNRS → select OTT IDs → build. If synthetic fails, try taxonomy subtree.'
          )
        );
      });
    root.querySelector('#mcEtlRetry') &&
      root.querySelector('#mcEtlRetry').addEventListener('click', function () {
        state.err = null;
        render();
      });
    var gateAgain = root.querySelector('#mcEtlShowGateAgain');
    if (gateAgain) {
      gateAgain.addEventListener('click', function () {
        try {
          if (global.sessionStorage) global.sessionStorage.removeItem('mc_etl_gate_done');
        } catch (eGate) {}
        state.uiPhase = 'gate';
        render();
      });
    }
    var gbifCb = root.querySelector('#mcEtlSrcGbif');
    if (gbifCb) {
      gbifCb.addEventListener('change', function () {
        state.sources.gbif = !!gbifCb.checked;
        render();
      });
    }
    var pbdbCb = root.querySelector('#mcEtlSrcPbdb');
    if (pbdbCb) {
      pbdbCb.addEventListener('change', function () {
        state.sources.pbdb = !!pbdbCb.checked;
        render();
      });
    }
    var searchModeEl = root.querySelector('#mcEtlSearchMode');
    if (searchModeEl) {
      searchModeEl.addEventListener('change', function () {
        state.searchMode = searchModeEl.value || 'mixed';
        render();
      });
    }
    root.querySelectorAll('[data-tree-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTreePreset(btn.getAttribute('data-tree-preset'));
      });
    });
    root.querySelectorAll('.mc-etl-tab').forEach(function (b) {
      b.addEventListener('click', function () {
        state.tab = b.getAttribute('data-tab') || 'basic';
        render();
      });
    });
    root.querySelector('#mcEtlNotesSave') &&
      root.querySelector('#mcEtlNotesSave').addEventListener('click', function () {
        var ta = root.querySelector('#mcEtlNotes');
        if (ta) state.notes = ta.value;
        render();
      });
    root.querySelector('#mcEtlCopyNw') &&
      root.querySelector('#mcEtlCopyNw').addEventListener('click', function () {
        copyText(state.newick || '');
      });
    root.querySelector('#mcEtlDlMd') &&
      root.querySelector('#mcEtlDlMd').addEventListener('click', function () {
        downloadMd();
      });
    root.querySelectorAll('[data-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyPreset(btn.getAttribute('data-preset'));
      });
    });
    root.querySelector('#mcEtlOnbClose') &&
      root.querySelector('#mcEtlOnbClose').addEventListener('click', function () {
        state.onboarding = false;
        render();
      });
    root.querySelector('#mcEtlOnbImport') &&
      root.querySelector('#mcEtlOnbImport').addEventListener('click', function () {
        importSpecimens();
        state.onboarding = false;
        render();
      });
    root.querySelectorAll('.mc-etl-inc').forEach(function (cb, idx) {
      cb.addEventListener('change', function () {
        if (state.taxa[idx]) state.taxa[idx].selected = cb.checked;
      });
    });
    var auto = root.querySelector('#mcEtlAuto');
    if (auto) {
      auto.addEventListener('input', function () {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(function () {
          runAutocomplete(auto.value);
        }, 350);
      });
    }
    var qs = root.querySelector('#mcEtlQuickSearch');
    if (qs) {
      qs.addEventListener('input', function () {
        state.quickSearchDraft = qs.value;
      });
    }
    var sl = root.querySelector('#mcEtlSearchLocate');
    if (sl) sl.addEventListener('click', runSearchAndLocate);
    var lo = root.querySelector('#mcEtlLocateOnly');
    if (lo) lo.addEventListener('click', runLocateOnExistingTree);
    root.querySelectorAll('[data-etl-example]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ex = btn.getAttribute('data-etl-example');
        if (!ex) return;
        var inp = root.querySelector('#mcEtlQuickSearch');
        if (inp) inp.value = ex;
        state.quickSearchDraft = ex;
      });
    });
    root.querySelectorAll('[data-locate]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-locate');
        var row = (state.taxa || []).filter(function (t) {
          return t.id === id;
        })[0];
        if (!row) return;
        state.taxa.forEach(function (t) {
          t.selected = t.id === id;
        });
        if (!state.newick) {
          state.afterTreeBuildCb = function () {
            applyPhyloLocateForRow(row);
            setTimeout(function () {
              if (state.focusPath && state.newick) {
                fitPhyloViewportToPath(state.focusPath);
                if (global.MCEvolutionTreeLab && global.MCEvolutionTreeLab.rerender) global.MCEvolutionTreeLab.rerender();
              }
            }, 0);
          };
          doBuildTree();
        } else {
          applyPhyloLocateForRow(row);
          render();
          setTimeout(function () {
            if (state.focusPath && state.newick) {
              fitPhyloViewportToPath(state.focusPath);
              if (global.MCEvolutionTreeLab && global.MCEvolutionTreeLab.rerender) global.MCEvolutionTreeLab.rerender();
            }
          }, 0);
        }
      });
    });
    var fitBtn = root.querySelector('#mcEtlFit');
    if (fitBtn) {
      fitBtn.addEventListener('click', function () {
        fitWholePhyloViewport();
        render();
      });
    }
    var resetV = root.querySelector('#mcEtlResetView');
    if (resetV) {
      resetV.addEventListener('click', function () {
        state.treeViz = { scale: 1, tx: 0, ty: 0 };
        render();
      });
    }
    var focT = root.querySelector('#mcEtlFocusTarget');
    if (focT) {
      focT.addEventListener('click', function () {
        if (state.focusPath && state.newick) {
          fitPhyloViewportToPath(state.focusPath);
          render();
        }
      });
    }
    var tglLab = root.querySelector('#mcEtlToggleLabels');
    if (tglLab) {
      tglLab.addEventListener('click', function () {
        state.vizShowLabels = !state.vizShowLabels;
        render();
      });
    }
    var tglImg = root.querySelector('#mcEtlToggleImages');
    if (tglImg) {
      tglImg.addEventListener('click', function () {
        state.vizShowImages = !state.vizShowImages;
        render();
      });
    }
    var tglTime = root.querySelector('#mcEtlToggleTime');
    if (tglTime) {
      tglTime.addEventListener('click', function () {
        state.vizShowTime = !state.vizShowTime;
        if (state.vizShowTime === false) state.vizShowEpochBands = false;
        render();
      });
    }
    var tglEp = root.querySelector('#mcEtlToggleEpoch');
    if (tglEp) {
      tglEp.addEventListener('click', function () {
        state.vizShowEpochBands = !state.vizShowEpochBands;
        if (state.vizShowEpochBands) state.vizShowTime = true;
        render();
      });
    }
    var tglDock = root.querySelector('#mcEtlToggleBottomDock');
    if (tglDock) {
      tglDock.addEventListener('click', function () {
        state.bottomDockVisible = state.bottomDockVisible === false;
        try {
          if (global.localStorage) global.localStorage.setItem(ETL_BOTTOM_DOCK_LS, state.bottomDockVisible ? '1' : '0');
        } catch (eDockLs) {}
        render();
      });
    }
    var vdEl = root.querySelector('#mcEtlViewDirection');
    if (vdEl) {
      vdEl.addEventListener('change', function () {
        state.viewDirection = vdEl.value || 'ancestry';
        render();
      });
    }
    var ddEl = root.querySelector('#mcEtlDescDepth');
    if (ddEl) {
      ddEl.addEventListener('change', function () {
        state.descendantDepth = Number(ddEl.value) || 2;
        render();
      });
    }
    var dmSel = root.querySelector('#mcEtlDisplayMode');
    if (dmSel) {
      dmSel.addEventListener('change', function () {
        var v = dmSel.value || 'standard';
        state.displayMode = v;
        if (v === 'sister') {
          state.viewDirection = 'sister';
          doBuildTree();
        } else if (v === 'nearby') {
          state.viewDirection = 'nearby';
          doBuildTree();
        } else if (v === 'descendant_expand') {
          state.viewDirection = 'descendant';
          doBuildTree();
        } else if (v === 'multi_compare') {
          if ((state.compareTray || []).length >= 2) {
            state.locateNote = '';
            state.taxa.forEach(function (t) {
              t.selected = state.compareTray.indexOf(t.id) >= 0;
            });
            state.viewDirection = 'compare';
            state.treeMode = 'induced';
            doBuildTree();
          } else {
            state.displayMode = 'standard';
            state.locateNote = tx(
              'etl_cmp_need2',
              '比較模式需要比較盤中至少兩個分類群；已恢復標準顯示。',
              'Compare needs at least two taxa in the tray; reverted to standard display.'
            );
            render();
          }
        } else {
          render();
        }
      });
    }
    var exSc = root.querySelector('#mcEtlExpansionScope');
    if (exSc) {
      exSc.addEventListener('change', function () {
        state.expansionScope = Math.max(0, Math.min(3, Number(exSc.value) || 0));
        render();
      });
    }
    var ldSel = root.querySelector('#mcEtlLabelDensity');
    if (ldSel) {
      ldSel.addEventListener('change', function () {
        state.labelDensity = ldSel.value || 'standard';
        render();
      });
    }
    var imgSel = root.querySelector('#mcEtlImageDensity');
    if (imgSel) {
      imgSel.addEventListener('change', function () {
        state.imageDensity = imgSel.value || 'selected_nearby';
        render();
      });
    }
    var apNear = root.querySelector('#mcEtlApplyNearbyView');
    if (apNear) {
      apNear.addEventListener('click', function () {
        state.viewDirection = 'nearby';
        state.displayMode = 'nearby';
        if (selectedOtts().length) doBuildTree();
        else render();
      });
    }
    var ocCmp = root.querySelector('#mcEtlOpenCompare');
    if (ocCmp) {
      ocCmp.addEventListener('click', function () {
        var r = firstSelectedTaxonRow();
        if (!r || !r.id) return;
        state.compareTray = state.compareTray || [];
        if (state.compareTray.indexOf(r.id) < 0 && state.compareTray.length < 8) state.compareTray.push(r.id);
        state.taxa.forEach(function (t) {
          t.selected = state.compareTray.indexOf(t.id) >= 0;
        });
        var ottCt = state.taxa.filter(function (txr) {
          return txr.selected && txr.ottId;
        }).length;
        state.viewDirection = 'compare';
        state.displayMode = 'multi_compare';
        state.treeMode = 'induced';
        state.tab = 'basic';
        if (ottCt >= 2) doBuildTree();
        else {
          state.locateNote = tx(
            'etl_cmp_add_more',
            '已加入比較盤；請再解析一筆以上學名並加入比較盤，然後按「建立演化樹」。',
            'Added to compare tray; resolve more names into the tray, then build the tree.'
          );
          render();
        }
      });
    }
    root.querySelectorAll('[data-life-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        var m = b.getAttribute('data-life-mode') || 'classic';
        state.lifeTreeMode = m;
        state.canvasView = m === 'geologic' ? 'timeline' : 'classic';
        render();
      });
    });
    root.querySelectorAll('[data-etl-card-act]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.getAttribute('data-etl-card-act');
        var id = btn.getAttribute('data-tid');
        var row = (state.taxa || []).filter(function (t) {
          return t.id === id;
        })[0];
        if (!row) return;
        state.taxa.forEach(function (t) {
          t.selected = t.id === id;
        });
        state.onboarding = false;
        if (act === 'ancestry') {
          state.viewDirection = 'ancestry';
          state.treeMode = 'induced';
          doBuildTree();
        } else if (act === 'descendant') {
          state.viewDirection = 'descendant';
          doBuildTree();
        } else if (act === 'sister') {
          state.viewDirection = 'sister';
          state.displayMode = 'sister';
          doBuildTree();
        } else if (act === 'nearby') {
          state.viewDirection = 'nearby';
          state.displayMode = 'nearby';
          doBuildTree();
        } else if (act === 'tray') {
          state.compareTray = state.compareTray || [];
          if (state.compareTray.indexOf(id) < 0 && state.compareTray.length < 8) state.compareTray.push(id);
          render();
        } else if (act === 'cladistic') {
          state.lifeTreeMode = 'cladistic';
          state.tab = 'cladistic';
          state.bottomDockVisible = true;
          try {
            if (global.localStorage) global.localStorage.setItem(ETL_BOTTOM_DOCK_LS, '1');
          } catch (eCl) {}
          render();
        } else if (act === 'geology') {
          state.tab = 'geology';
          state.activeTaxonId = id;
          state.bottomDockVisible = true;
          try {
            if (global.localStorage) global.localStorage.setItem(ETL_BOTTOM_DOCK_LS, '1');
          } catch (eGeo) {}
          render();
        }
      });
    });
    root.querySelectorAll('[data-tray-remove]').forEach(function (bx) {
      bx.addEventListener('click', function () {
        var id = bx.getAttribute('data-tray-remove');
        state.compareTray = (state.compareTray || []).filter(function (x) {
          return x !== id;
        });
        render();
      });
    });
    var trayBuild = root.querySelector('#mcEtlBuildFromTray');
    if (trayBuild) {
      trayBuild.addEventListener('click', function () {
        var ids = state.compareTray || [];
        if (ids.length < 2) return;
        state.taxa.forEach(function (t) {
          t.selected = ids.indexOf(t.id) >= 0;
        });
        state.viewDirection = 'compare';
        state.displayMode = 'multi_compare';
        state.treeMode = 'induced';
        doBuildTree();
      });
    }
    var geoFetch = root.querySelector('#mcEtlGeoFetch');
    if (geoFetch) {
      geoFetch.addEventListener('click', function () {
        var laEl = root.querySelector('#mcEtlGeoLat');
        var lnEl = root.querySelector('#mcEtlGeoLng');
        var la = parseFloat(laEl && laEl.value);
        var ln = parseFloat(lnEl && lnEl.value);
        state.geoLat = laEl ? String(laEl.value || '') : '';
        state.geoLng = lnEl ? String(lnEl.value || '') : '';
        var ag = global.MCEvolutionTreeAfriGis;
        if (!ag || typeof ag.getGeologyByCoordinate !== 'function') {
          state.afriGisNote = 'AfriGIS 模組未載入';
          render();
          return;
        }
        state.afriGisNote = tx('etl_geo_loading', '查詢中…', 'Loading…');
        render();
        ag.getGeologyByCoordinate(la, ln)
          .then(function (r) {
            var n = ag.normalizeAfriGisGeologyResponse(r);
            state.geologyContext = n;
            state.afriGisNote = n.message || (n.disabled ? tx('etl_geo_need_oauth', '需要設定 AfriGIS OAuth2 憑證', 'Configure AfriGIS OAuth2') : '');
            render();
          })
          .catch(function () {
            state.afriGisNote = tx('etl_geo_err', '查詢失敗', 'Fetch failed');
            render();
          });
      });
    }
    var cladAdd = root.querySelector('#mcEtlCladAdd');
    if (cladAdd) {
      cladAdd.addEventListener('click', function () {
        var lbEl = root.querySelector('#mcEtlCladLabel');
        var stEl = root.querySelector('#mcEtlCladState');
        var lb = lbEl && String(lbEl.value || '').trim();
        if (!lb) return;
        var st = stEl && String(stEl.value || '').trim();
        state.cladisticChars = state.cladisticChars || [];
        state.cladisticChars.push({
          id: uid(),
          label: lb,
          description: '',
          state: st,
          appliesToNodeId: state.selectedPath || '',
          appliesToDescendants: true,
          confidence: 1,
          source: 'manual',
          color: 'rgba(80,140,255,0.28)',
          markerType: 'trait'
        });
        render();
      });
    }
    root.querySelectorAll('[data-clad-remove]').forEach(function (bx) {
      bx.addEventListener('click', function () {
        var cid = bx.getAttribute('data-clad-remove');
        state.cladisticChars = (state.cladisticChars || []).filter(function (c) {
          return c.id !== cid;
        });
        render();
      });
    });
    var hiBtn = root.querySelector('#mcEtlHighlightPath');
    if (hiBtn) {
      hiBtn.addEventListener('click', function () {
        if (state.selectedPath) state.highlightPaths = pathPrefixes(state.selectedPath);
        render();
      });
    }
    var cmp = root.querySelector('#mcEtlCompareMode');
    if (cmp) {
      cmp.addEventListener('click', function () {
        state.searchMode = 'multi';
        state.treeMode = 'induced';
        state.onboarding = false;
        render();
        try {
          var det = root.querySelector('.mc-etl-details.mc-etl-details--soft summary');
          if (det && det.parentElement && !det.parentElement.open) det.click();
        } catch (eDet) {}
      });
    }
    var cld = root.querySelector('#mcEtlCladeExplore');
    if (cld) {
      cld.addEventListener('click', function () {
        state.treeMode = 'taxonomy-subtree';
        state.searchMode = 'higher';
        state.onboarding = false;
        doBuildTree();
      });
    }
    root.querySelectorAll('[data-etl-view]').forEach(function (vb) {
      vb.addEventListener('click', function () {
        state.canvasView = vb.getAttribute('data-etl-view') || 'classic';
        render();
      });
    });
    bindAutocompletePickOnce_();
    bindPhyloGlobalOnce();
    wireAsideResize(root);
  }

  function bindAutocompletePickOnce_() {
    if (global.__mcEtlAcPickBound) return;
    global.__mcEtlAcPickBound = true;
    document.addEventListener(
      'click',
      function (ev) {
        var ac = ev.target && ev.target.closest && ev.target.closest('.mc-etl-ac-item');
        if (!ac) return;
        var shell = document.getElementById(ROOT_ID);
        if (!shell || !shell.contains(ac)) return;
        var nm = ac.getAttribute('data-ac-name');
        if (!nm) return;
        var st = global.MCEvolutionTreeLab && global.MCEvolutionTreeLab.getState();
        if (!st) return;
        st.quickSearchDraft = nm;
        st.inputNames = parseNameLines(nm);
        var ta = document.getElementById('mcEtlNames');
        var qs = document.getElementById('mcEtlQuickSearch');
        if (ta) ta.value = nm;
        if (qs) qs.value = nm;
        var out = document.getElementById('mcEtlAutoOut');
        if (out) out.innerHTML = '';
        if (global.MCEvolutionTreeLab && global.MCEvolutionTreeLab.rerender) global.MCEvolutionTreeLab.rerender();
      },
      false
    );
  }

  function copyText(t) {
    try {
      navigator.clipboard.writeText(t);
      global.alert(tx('etl_copied', '已複製', 'Copied'));
    } catch (e) {
      global.prompt('Copy', t);
    }
  }

  function downloadMd() {
    var md = buildMarkdownReport();
    var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'evolution-tree-lab-report.md';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function buildMarkdownReport() {
    var lines = [];
    lines.push('# Evolution Tree Lab Report');
    lines.push('');
    lines.push('## Project');
    lines.push('- Title: ' + state.title);
    lines.push('- Date: ' + nowIso());
    lines.push('- Context: ' + state.contextName);
    lines.push('- Tree mode: ' + state.treeMode);
    lines.push('');
    lines.push('## Input Taxa');
    lines.push('| Input | Matched | OTT | Rank | Score |');
    lines.push('|---|---|---:|---|---:|');
    state.taxa.forEach(function (t) {
      lines.push(
        '| ' +
          t.inputName +
          ' | ' +
          t.matchedName +
          ' | ' +
          t.ottId +
          ' | ' +
          t.rank +
          ' | ' +
          t.score +
          ' |'
      );
    });
    lines.push('');
    lines.push('## MRCA');
    lines.push('```json');
    lines.push(JSON.stringify(state.mrca || {}, null, 2));
    lines.push('```');
    lines.push('');
    lines.push('## Tree (Newick)');
    lines.push('```newick');
    lines.push(state.newick || '');
    lines.push('```');
    lines.push('');
    lines.push('## Notes');
    lines.push(state.notes || '');
    return lines.join('\n');
  }

  function applyPreset(key) {
    if (key === 'primates') {
      state.inputNames = ['Homo sapiens', 'Pan troglodytes', 'Gorilla gorilla', 'Pongo abelii'];
    } else if (key === 'beetles') {
      state.inputNames = ['Lucanus cervus', 'Dynastes hercules', 'Tenebrio molitor', 'Tribolium castaneum'];
    } else if (key === 'orders') {
      state.inputNames = ['Coleoptera', 'Lepidoptera', 'Diptera', 'Hymenoptera'];
    }
    var ta = document.getElementById('mcEtlNames');
    if (ta) ta.value = state.inputNames.join('\n');
    state.onboarding = false;
    render();
  }

  function applyTreePreset(key) {
    if (key === 'vertebrate') {
      state.inputNames = ['Homo sapiens', 'Tiktaalik roseae', 'Basilosaurus', 'Panthera leo'];
      state.contextName = 'Animals';
    } else if (key === 'arthro') {
      state.inputNames = ['Trilobita', 'Anomalocaris', 'Lucanus cervus', 'Arthropoda'];
      state.contextName = 'Animals';
    } else if (key === 'marine') {
      state.inputNames = ['Octopus vulgaris', 'Ammonoidea', 'Eurypterida', 'Mollusca'];
      state.contextName = 'Animals';
    } else if (key === 'paleozoic') {
      state.inputNames = ['Trilobita', 'Hallucigenia', 'Dunkleosteus', 'Eurypterida'];
      state.contextName = 'Animals';
    } else if (key === 'meso') {
      state.inputNames = ['Basilosaurus', 'Ichthyosauria', 'Plesiosauria', 'Mosasauridae'];
      state.contextName = 'Animals';
    }
    var ta = document.getElementById('mcEtlNames');
    if (ta) ta.value = state.inputNames.join('\n');
    state.onboarding = false;
    render();
  }

  function importSpecimens() {
    var n = specimenScientificNames();
    state.inputNames = n.slice(0, 80);
    state.onboarding = false;
    render();
    var ta = document.getElementById('mcEtlNames');
    if (ta) ta.value = state.inputNames.join('\n');
  }

  function pingApi() {
    otRpc('otSynthAbout', [false])
      .then(function (r) {
        state.apiOk = !!(r && r.ok);
      })
      .catch(function () {
        state.apiOk = false;
      })
      .finally(function () {
        render();
      });
  }

  function doInfer() {
    var names = parseNameLines(document.getElementById('mcEtlNames') && document.getElementById('mcEtlNames').value);
    state.busy = true;
    state.err = null;
    render();
    otRpc('otInferContext', [names])
      .then(function (r) {
        state.busy = false;
        if (!r || !r.ok) {
          state.err = tx('etl_err_infer', '脈絡推斷失敗', 'Context inference failed');
          state.errDebug = JSON.stringify(r);
          render();
          return;
        }
        var d = r.data || {};
        var c = d.context_name || d.context || (d.contexts && d.contexts[0]);
        if (c) state.contextName = String(c);
        render();
      })
      .catch(function (e) {
        state.busy = false;
        state.err = tx('etl_err_net', '網路或伺服器錯誤', 'Network or server error');
        state.errDebug = String(e);
        render();
      });
  }

  function finalizeResolveAndRender(rows) {
    state.taxa = rows;
    var svcM = global.MCEvolutionTreeServices;
    function doneMedia() {
      state.busy = false;
      var acb = state.afterResolveCb;
      state.afterResolveCb = null;
      /* Always re-render after media enrichment so card/tree thumbnails appear even when a follow-up callback runs (previously render() was skipped when afterResolveCb was set). */
      render();
      if (typeof acb === 'function') {
        try {
          acb();
        } catch (eA) {}
      }
    }
    if (svcM && typeof svcM.enrichTaxaMediaRows === 'function') {
      state.busy = true;
      render();
      svcM
        .enrichTaxaMediaRows(rows, specimenImageForScientificName, 3)
        .then(doneMedia)
        .catch(doneMedia);
    } else {
      doneMedia();
    }
  }

  function doResolve() {
    var names = parseNameLines(document.getElementById('mcEtlNames') && document.getElementById('mcEtlNames').value);
    state.inputNames = names;
    if (names.length > 1) state.searchMode = 'multi';
    state.resolveGen = (state.resolveGen || 0) + 1;
    var myGen = state.resolveGen;
    if (!names.length) {
      state.err = tx('etl_err_names', '請輸入至少一個學名', 'Enter at least one name');
      render();
      return;
    }
    state.busy = true;
    state.err = null;
    render();
    var ctx = state.contextName;
    otRpc('otMatchNames', [names, ctx, true])
      .then(function (r) {
        state.busy = false;
        if (!r || !r.ok) {
          if (myGen !== state.resolveGen) return;
          state.err = tx('etl_err_match', '學名解析失敗', 'Name match failed');
          state.errDebug = JSON.stringify(r);
          state.taxa = [];
          state.afterResolveCb = null;
          render();
          return;
        }
        if (myGen !== state.resolveGen) return;
        state.taxa = flattenTnrs(r.data || {});
        state.onboarding = false;
        var svc = global.MCEvolutionTreeServices;
        var enrichFlags = {
          gbif: !!state.sources.gbif,
          pbdb: !!state.sources.pbdb
        };
        if (state.searchMode === 'fossil') enrichFlags.gbif = false;
        if (state.searchMode === 'extant') enrichFlags.pbdb = false;
        if (svc && typeof svc.enrichTaxaRows === 'function' && (enrichFlags.gbif || enrichFlags.pbdb)) {
          state.busy = true;
          render();
          svc
            .enrichTaxaRows(state.taxa, enrichFlags, 3)
            .then(function (rows) {
              if (myGen !== state.resolveGen) return;
              finalizeResolveAndRender(rows);
            })
            .catch(function () {
              if (myGen !== state.resolveGen) return;
              finalizeResolveAndRender(state.taxa);
            });
          return;
        }
        finalizeResolveAndRender(state.taxa);
      })
      .catch(function (e) {
        if (myGen !== state.resolveGen) return;
        state.busy = false;
        state.afterResolveCb = null;
        state.err = tx('etl_err_cors', '無法連線（本機預覽時 CORS 或後端）。', 'Request failed (CORS or backend).');
        state.errDebug = String(e);
        render();
      });
  }

  function selectedOtts() {
    return state.taxa
      .filter(function (t) {
        return t.selected && t.ottId;
      })
      .map(function (t) {
        return Number(t.ottId);
      });
  }

  function firstSelectedTaxonRow() {
    var rows = state.taxa.filter(function (t) {
      return t.selected && t.ottId;
    });
    if (!rows.length) rows = state.taxa.filter(function (t) { return t.ottId; });
    return rows[0] || null;
  }

  /** Single-taxon primary mode: root→tip lineage from OpenTree taxonomy (not induced subtree). */
  function buildSingleTaxonPositionTree() {
    var row = firstSelectedTaxonRow();
    var ott = row && Number(row.ottId);
    if (!ott) return Promise.reject(new Error('no ott'));
    return otRpc('otTaxonInfo', [
      ott,
      {
        include_lineage: true,
        include_terminal_descendants: false,
        include_suppressed: false
      }
    ]).then(function (r) {
      if (!r || !r.ok || !r.data) throw new Error(JSON.stringify(r));
      state.lastTaxonInfo = r.data;
      var chain = parseTaxonInfoRootToTip(r.data);
      if (!chain.length) throw new Error('empty_lineage');
      var obj = buildPositionTreeObject(chain);
      if (!obj) throw new Error('no_tree');
      state.newick = positionObjectToNewick(obj);
      state.buildKind = 'position';
      state.mrca = {
        summaryZh:
          '單點定位：顯示自較廣分類群至標的之譜系主幹；側向「姊妹群示意」僅供視覺參考，不代表完整姊妹群鑑定。',
        lineageSteps: chain.length,
        targetName: chain[chain.length - 1] && chain[chain.length - 1].name
      };
      return r;
    });
  }

  function doBuildTree() {
    var otts = selectedOtts();
    if (!otts.length) {
      state.err = tx('etl_err_sel', '請勾選至少一個有效 OTT', 'Select taxa with OTT IDs');
      render();
      return Promise.resolve(null);
    }
    state.busy = true;
    state.err = null;
    state.buildKind = '';
    render();
    var label = state.settings.labelFormat || 'name';
    var chain = Promise.resolve();
    var vd = state.viewDirection || 'ancestry';
    var depthN = Math.min(3, Math.max(1, Number(state.descendantDepth) || 2));
    var savedHL = state.settings.heightLimit;
    var buildRpcMode = state.treeMode;
    if (vd === 'descendant' && otts.length) {
      buildRpcMode = 'synthetic-subtree';
      state.settings.heightLimit = depthN <= 1 ? 2 : depthN === 2 ? 4 : 8;
    } else if (vd === 'compare' && otts.length >= 2) {
      buildRpcMode = 'induced';
    } else if (vd === 'sister' && otts.length === 1) {
      buildRpcMode = 'induced';
    } else if (vd === 'nearby' && otts.length === 1) {
      buildRpcMode = 'induced';
    }
    var usePosition =
      buildRpcMode === 'induced' && otts.length === 1 && !state.forceInducedSingle && vd !== 'descendant' && vd !== 'compare';

    function restoreHeightLimit_() {
      state.settings.heightLimit = savedHL;
    }

    if ((buildRpcMode === 'mrca' || buildRpcMode === 'induced') && otts.length >= 2) {
      chain = chain.then(function () {
        return otRpc('otSynthMrca', [otts]).then(function (r) {
          state.mrca = (r && r.data) || null;
        });
      });
    }

    if (usePosition) {
      chain = chain.then(function () {
        return buildSingleTaxonPositionTree().catch(function (ePos) {
          return otRpc('otSynthInducedTree', [otts, label]).then(function (r) {
            if (!r || !r.ok) throw ePos;
            state.newick = newickFromSynth(r.data) || '';
            state.buildKind = 'induced';
            state.mrca = {
              summaryZh: tx(
                'etl_pos_fallback',
                '無法取得完整分類譜系，已改以誘導子樹顯示（仍為單一學名相關分支）。',
                'Lineage unavailable; fell back to induced subtree.'
              )
            };
          });
        });
      });
    } else if (buildRpcMode === 'induced') {
      chain = chain.then(function () {
        return otRpc('otSynthInducedTree', [otts, label]).then(function (r) {
          if (!r || !r.ok) throw new Error(JSON.stringify(r));
          state.newick = newickFromSynth(r.data) || '';
          state.buildKind = 'induced';
        });
      });
    } else if (buildRpcMode === 'synthetic-subtree') {
      var rootOtt = otts[0];
      chain = chain.then(function () {
        return otRpc('otSynthSubtreeByOttId', [rootOtt, state.settings.heightLimit, label]).then(function (r) {
          if (!r || !r.ok) throw new Error(JSON.stringify(r));
          state.newick = newickFromSynth(r.data) || '';
          state.buildKind = 'synthetic-subtree';
        });
      });
    } else if (buildRpcMode === 'taxonomy-subtree') {
      var rOtt = otts[0];
      chain = chain.then(function () {
        return otRpc('otTaxonomySubtree', [rOtt, label]).then(function (r) {
          if (!r || !r.ok) throw new Error(JSON.stringify(r));
          state.newick = newickFromSynth(r.data) || '';
          state.buildKind = 'taxonomy-subtree';
        });
      });
    } else if (buildRpcMode === 'mrca') {
      chain = chain.then(function () {
        state.newick = '';
        state.buildKind = 'mrca';
      });
    }
    return chain
      .then(function () {
        state.busy = false;
        if (state.newick && state.buildKind === 'taxonomy-subtree') {
          try {
            var trc = parseNewick(state.newick);
            if (trc && countTips(trc) > 300) {
              state.newick = '';
              state.err = tx(
                'etl_tax_too_large',
                '分類子樹末端數量過多，瀏覽器難以流暢顯示。請改選更上層分類群，或改用「合成演化子樹」並降低高度。',
                'Taxonomy subtree too large; pick a higher taxon or synthetic subtree.'
              );
            }
          } catch (eSz) {}
        }
        if (buildRpcMode !== 'mrca' && state.newick) {
          var nm = state.taxa[0] && state.taxa[0].matchedName;
          return otRpc('otFindStudiesByFocalClade', [nm || otts[0]]).then(function (r) {
            if (r && r.data) state.sourceStudies = r.data;
          });
        }
      })
      .then(function () {
        restoreHeightLimit_();
        var cb = state.afterTreeBuildCb;
        state.afterTreeBuildCb = null;
        if (typeof cb === 'function') {
          try {
            cb();
          } catch (eCb) {}
        }
        render();
        setTimeout(function () {
          if (state.focusPath && state.newick) {
            fitPhyloViewportToPath(state.focusPath);
            if (global.MCEvolutionTreeLab && global.MCEvolutionTreeLab.rerender) global.MCEvolutionTreeLab.rerender();
          }
        }, 0);
      })
      .catch(function (e) {
        restoreHeightLimit_();
        state.busy = false;
        state.afterTreeBuildCb = null;
        state.err =
          tx('etl_err_tree', '建立演化樹失敗；可改為「分類子樹」或減少物種。', 'Tree build failed; try taxonomy subtree or fewer taxa.');
        state.errDebug = String(e);
        render();
      });
  }

  function runAutocomplete(q) {
    var out = document.getElementById('mcEtlAutoOut');
    if (!out) return;
    if (!String(q || '').trim()) {
      out.innerHTML = '';
      return;
    }
    otRpc('otAutocompleteName', [q, state.contextName]).then(function (r) {
      if (!r || !r.ok || !r.data) {
        out.innerHTML = '';
        return;
      }
      var d = r.data;
      var items = [];
      if (Array.isArray(d.results)) items = d.results;
      else if (Array.isArray(d)) items = d;
      else if (Array.isArray(d.suggestions)) items = d.suggestions;
      else if (d.name) items = [d];
      if (!items.length) {
        out.innerHTML =
          '<span class="mc-etl-muted">' + esc(tx('etl_ac_empty', '無建議項目', 'No suggestions')) + '</span>';
        return;
      }
      out.innerHTML =
        '<ul class="mc-etl-ac-list">' +
        items
          .slice(0, 14)
          .map(function (it) {
            var nm = String((it && (it.name || it.unique_name || it.title)) || '').trim();
            if (!nm) return '';
            return (
              '<li><button type="button" class="mc-etl-ac-item" data-ac-name="' +
              esc(nm) +
              '">' +
              esc(nm.length > 56 ? nm.slice(0, 54) + '…' : nm) +
              '</button></li>'
            );
          })
          .filter(Boolean)
          .join('') +
        '</ul>';
    });
  }

  function doSaveProject() {
    if (!isGas()) {
      try {
        var list = JSON.parse(localStorage.getItem('mc_etl_projects_v1') || '[]');
        if (!Array.isArray(list)) list = [];
        list.unshift({
          ProjectID: state.id,
          UpdatedAt: nowIso(),
          Title: state.title,
          ContextName: state.contextName,
          InputNamesJson: JSON.stringify(state.inputNames),
          MatchedTaxaJson: JSON.stringify(state.taxa),
          OttIdsJson: JSON.stringify(selectedOtts()),
          Newick: state.newick,
          TreeMode: state.treeMode,
          Notes: state.notes,
          SourceStudiesJson: JSON.stringify(state.sourceStudies || [])
        });
        localStorage.setItem('mc_etl_projects_v1', JSON.stringify(list.slice(0, 40)));
        global.alert(tx('etl_saved_local', '已儲存於瀏覽器', 'Saved locally'));
      } catch (e) {}
      return;
    }
    otRpc('saveEvolutionTreeProject', [
      {
        ProjectID: state.id,
        Title: state.title,
        ContextName: state.contextName,
        InputNames: state.inputNames,
        MatchedTaxa: state.taxa,
        OttIds: selectedOtts(),
        Newick: state.newick,
        TreeMode: state.treeMode,
        Notes: state.notes,
        SourceStudies: state.sourceStudies
      }
    ])
      .then(function () {
        global.alert(tx('etl_saved', '已儲存', 'Saved'));
      })
      .catch(function (e) {
        global.alert(String(e));
      });
  }

  function mountShell() {
    var shell = document.getElementById(SHELL_ID);
    var sec = document.getElementById('section-evolution-tree-lab');
    if (shell) shell.hidden = false;
    if (sec) {
      sec.classList.add('active');
      try {
        sec.inert = false;
      } catch (e) {}
    }
    try {
      document.documentElement.setAttribute('data-mc-section', 'evolution-tree-lab');
    } catch (e2) {}
    try {
      if (global.sessionStorage && global.sessionStorage.getItem('mc_etl_gate_done') === '1') {
        state.uiPhase = 'workspace';
      } else {
        state.uiPhase = 'gate';
      }
    } catch (eS) {
      state.uiPhase = 'gate';
    }
    render();
    pingApi();
  }

  function hideShell() {
    var shell = document.getElementById(SHELL_ID);
    if (shell) shell.hidden = true;
  }

  global.renderEvolutionTreeLabRoute_ = function () {
    try {
      if (typeof global.enterApp === 'function' && !document.documentElement.classList.contains('mc-entered')) {
        global.enterApp();
      }
    } catch (e) {}
    try {
      if (typeof global.switchSection === 'function') global.switchSection('evolution-tree-lab');
    } catch (e2) {}
    mountShell();
  };

  try {
    if (global.MCRoute && typeof global.MCRoute.subscribe === 'function') {
      global.MCRoute.subscribe(function (sectionName) {
        if (sectionName === 'evolution-tree-lab') {
          try {
            global.location.hash = '#/section/evolution-tree-lab';
          } catch (eH) {}
          mountShell();
        } else {
          hideShell();
        }
      });
    }
  } catch (eSub) {}

  function boot() {
    var host = document.getElementById(ROOT_ID);
    if (!host || host.getAttribute('data-etl-boot') === '1') return;
    host.setAttribute('data-etl-boot', '1');
    host.innerHTML =
      '<div class="mc-etl-root"><div class="mc-etl-skel">' +
      esc(tx('etl_loading', '載入中…', 'Loading…')) +
      '</div></div>';
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function importSpecimensFromDashboard() {
    importSpecimens();
  }

  global.addEventListener('mc:localechange', function () {
    var shell = global.document.getElementById(SHELL_ID);
    if (shell && !shell.hidden) render();
  });

  global.MCEvolutionTreeLab = {
    mount: mountShell,
    hideShell: hideShell,
    getState: function () {
      return state;
    },
    rerender: function () {
      render();
    },
    importSpecimensFromDashboard: importSpecimensFromDashboard
  };
})(typeof window !== 'undefined' ? window : this);
