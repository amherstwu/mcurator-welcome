/**
 * MCurator Evolution Tree Lab — alternate life-tree layouts (circular, spiral, radial, cladistic).
 * Self-contained geometry; parent passes parsed Newick tree object (same shape as evolution-tree-lab.js).
 */
(function (global) {
  'use strict';

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

  function extractOttFromLabel(raw) {
    var m = String(raw || '').match(/_ott(\d+)/i);
    return m ? Number(m[1]) : 0;
  }

  var PHYLO_EXTINCT_DAGGER = '\u2020';

  var ETL_EXTINCT_HINT_LAYOUT = {
    trilobita: 1,
    ammonoidea: 1,
    anomalocaris: 1,
    tiktaalik: 1,
    archaeopteryx: 1,
    tyrannosaurus: 1
  };

  function phyloLabelWithExtinctDagger(displayName, ottFromLabel, taxaRows, rawName) {
    var base = String(displayName || '').trim();
    if (!base) return base;
    if (base.indexOf('姊妹群') >= 0) return base;
    if (base.charAt(0) === PHYLO_EXTINCT_DAGGER) return base;
    var ott = Number(ottFromLabel) || 0;
    if (taxaRows && taxaRows.length && ott) {
      for (var i = 0; i < taxaRows.length; i++) {
        var r = taxaRows[i];
        if (Number(r.ottId) === ott && r.extinctStatus === 'extinct') return PHYLO_EXTINCT_DAGGER + base;
      }
    }
    var s = base.toLowerCase().split(/[\s_(]/)[0].replace(/[^a-z0-9]/gi, '');
    if (s && ETL_EXTINCT_HINT_LAYOUT[s]) return PHYLO_EXTINCT_DAGGER + base;
    var rs = String(rawName || '').toLowerCase().split(/[_:(]/)[0].replace(/[^a-z0-9]/gi, '');
    if (rs && ETL_EXTINCT_HINT_LAYOUT[rs]) return PHYLO_EXTINCT_DAGGER + base;
    return base;
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

  function collectTips(n, arr) {
    if (!n) return;
    if (!n.children || !n.children.length) {
      arr.push(n);
      return;
    }
    for (var j = 0; j < n.children.length; j++) collectTips(n.children[j], arr);
  }

  function maxDepth(n, d) {
    if (!n.children || !n.children.length) return d;
    var mx = d;
    for (var i = 0; i < n.children.length; i++) mx = Math.max(mx, maxDepth(n.children[i], d + 1));
    return mx;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pathPrefixes(pathStr) {
    var parts = String(pathStr || '')
      .split('-')
      .filter(function (p) {
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

  /** Radial / “unrooted-style” compact view: tips on circle, Steiner-like internal placement */
  function layoutRadial(root, R) {
    R = R || 220;
    var tips = [];
    collectTips(root, tips);
    var n = Math.max(tips.length, 1);
    var depth = Math.max(maxDepth(root, 0), 1);
    for (var i = 0; i < tips.length; i++) {
      var ang = (i / n) * Math.PI * 2 - Math.PI / 2;
      tips[i]._rx = Math.cos(ang) * R;
      tips[i]._ry = Math.sin(ang) * R;
      tips[i]._ang = ang;
    }
    function placeInternals(node) {
      if (!node.children || !node.children.length) return;
      for (var c = 0; c < node.children.length; c++) placeInternals(node.children[c]);
      var sx = 0,
        sy = 0;
      for (var k = 0; k < node.children.length; k++) {
        sx += node.children[k]._rx;
        sy += node.children[k]._ry;
      }
      var f = 0.35 + 0.45 * (1 - maxDepth(node, 0) / (depth + 1));
      node._rx = (sx / node.children.length) * f;
      node._ry = (sy / node.children.length) * f;
    }
    placeInternals(root);
    root._rx = 0;
    root._ry = 0;
    return { R: R, tips: tips.length, depth: depth };
  }

  function layoutCircularRings(root, R0, ringGap) {
    ringGap = ringGap || 52;
    var tips = [];
    collectTips(root, tips);
    var depth = Math.max(maxDepth(root, 0), 1);
    function setRing(n, d) {
      if (!n.children || !n.children.length) {
        n._ring = depth;
        return depth;
      }
      var mx = 0;
      for (var i = 0; i < n.children.length; i++) mx = Math.max(mx, setRing(n.children[i], d + 1));
      n._ring = d;
      return mx;
    }
    setRing(root, 0);
    var maxR = depth + 1;
    for (var t = 0; t < tips.length; t++) {
      var tip = tips[t];
      var r = R0 + (maxR - tip._ring) * ringGap;
      var ang = (t / tips.length) * Math.PI * 2 - Math.PI / 2;
      tip._cx = Math.cos(ang) * r;
      tip._cy = Math.sin(ang) * r;
      tip._rang = ang;
    }
    function placeInt(n) {
      if (!n.children || !n.children.length) return;
      for (var c = 0; c < n.children.length; c++) placeInt(n.children[c]);
      var sx = 0,
        sy = 0;
      for (var k = 0; k < n.children.length; k++) {
        sx += n.children[k]._cx;
        sy += n.children[k]._cy;
      }
      n._cx = sx / n.children.length;
      n._cy = sy / n.children.length;
    }
    placeInt(root);
    root._cx = 0;
    root._cy = 0;
    return { maxR: maxR, tipN: tips.length, ringGap: ringGap, R0: R0 };
  }

  function layoutSpiral(root, turns) {
    turns = turns || 2.2;
    var tips = [];
    collectTips(root, tips);
    var n = Math.max(tips.length, 1);
    var depth = Math.max(maxDepth(root, 0), 1);
    for (var i = 0; i < tips.length; i++) {
      var t = i / Math.max(n - 1, 1);
      var ang = t * turns * Math.PI * 2 - Math.PI / 2;
      var r = 40 + t * 200;
      tips[i]._sx = Math.cos(ang) * r;
      tips[i]._sy = Math.sin(ang) * r;
    }
    function placeInt(n) {
      if (!n.children || !n.children.length) return;
      for (var c = 0; c < n.children.length; c++) placeInt(n.children[c]);
      var sx = 0,
        sy = 0;
      for (var k = 0; k < n.children.length; k++) {
        sx += n.children[k]._sx;
        sy += n.children[k]._sy;
      }
      var shrink = 0.55 - 0.12 * (maxDepth(n, 0) / depth);
      n._sx = (sx / n.children.length) * shrink;
      n._sy = (sy / n.children.length) * shrink;
    }
    placeInt(root);
    root._sx = 0;
    root._sy = 0;
    return { tips: n, depth: depth };
  }

  function drawRadialEdges(svg, n, hi, childCoord) {
    if (!n || !n.children || !n.children.length) return;
    var px = n[childCoord.px],
      py = n[childCoord.py];
    for (var c = 0; c < n.children.length; c++) {
      var ch = n.children[c];
      var cx = ch[childCoord.cx],
        cy = ch[childCoord.cy];
      var onPath = hi[ch._path] || hi[n._path];
      var cls = onPath ? 'mc-etl-branch mc-etl-branch--path' : 'mc-etl-branch';
      svg.push('<line class="' + cls + '" x1="' + px + '" y1="' + py + '" x2="' + cx + '" y2="' + cy + '" />');
      drawRadialEdges(svg, ch, hi, childCoord);
    }
  }

  /** Demo synapomorphy markers on internal edges (curated; not auto-invented science) */
  var CLAD_MARKS = ['脊索 / Notochord', '頭骨硬化', '羊膜卵', '內鼻孔'];

  function cladMarkTextWidth(txt) {
    txt = String(txt || '');
    var vis = txt.length > 22 ? 21 : txt.length;
    return Math.min(128, 12 + vis * 6.35);
  }

  function cladMarkBBox(cx, cy, rw) {
    var half = rw / 2;
    /* include red marker dot + rect padding for collision checks */
    return { left: cx - half - 4, right: cx + half + 4, top: cy - 14, bottom: cy + 12 };
  }

  function cladBBoxesOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  /**
   * Radial / spiral layouts stack many edge midpoints near the canvas center — pills overlap and text
   * becomes unreadable. Nudge each mark along try-offsets, then push outward from center as fallback.
   */
  function resolveCladMarkScreenPos(mx, my, rw, placed, cx0, cy0) {
    var tries = [
      [0, 0],
      [0, -26],
      [0, 26],
      [-22, -18],
      [22, -18],
      [-22, 18],
      [22, 18],
      [0, -44],
      [0, 44],
      [-34, 0],
      [34, 0],
      [-40, -28],
      [40, -28],
      [-40, 28],
      [40, 28],
      [0, -60],
      [0, 60],
      [-52, -20],
      [52, -20],
      [-16, -36],
      [16, -36],
      [-54, 0],
      [54, 0],
      [-28, -46],
      [28, -46],
      [-28, 46],
      [28, 46]
    ];
    for (var t = 0; t < tries.length; t++) {
      var ox = tries[t][0],
        oy = tries[t][1];
      var px = mx + ox,
        py = my + oy;
      var cand = cladMarkBBox(px, py, rw);
      var hit = false;
      for (var p = 0; p < placed.length; p++) {
        if (cladBBoxesOverlap(cand, placed[p])) {
          hit = true;
          break;
        }
      }
      if (!hit) {
        placed.push(cand);
        return { x: px, y: py };
      }
    }
    var dx = mx - cx0,
      dy = my - cy0;
    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
    var step = 30 + (placed.length % 7) * 11;
    var px = mx + (dx / dist) * step,
      py = my + (dy / dist) * step;
    placed.push(cladMarkBBox(px, py, rw));
    return { x: px, y: py };
  }

  function cladMarkListFromOpts(opts) {
    var out = [];
    if (opts && Array.isArray(opts.cladisticChars) && opts.cladisticChars.length) {
      for (var i = 0; i < opts.cladisticChars.length; i++) {
        var c = opts.cladisticChars[i];
        var t = String((c && (c.label || c.state)) || '').trim();
        if (t)
          out.push({
            text: t,
            fill: String((c && c.color) || '').trim() || 'rgba(80,140,255,0.25)',
            stroke: 'rgba(120,170,255,0.55)'
          });
      }
    }
    if (!out.length) {
      for (var j = 0; j < CLAD_MARKS.length; j++) {
        out.push({ text: CLAD_MARKS[j], fill: 'rgba(80,140,255,0.25)', stroke: 'rgba(120,170,255,0.5)' });
      }
    }
    return out;
  }

  function staggerTipLabelOffsets(root) {
    var tips = [];
    collectTips(root, tips);
    tips.sort(function (a, b) {
      return a._vy - b._vy;
    });
    var lastY = -1e9;
    var minDy = 12;
    for (var i = 0; i < tips.length; i++) {
      var oy = ((i * 5) % 9) * 3 - 12;
      var ty = tips[i]._vy + 4 + oy;
      if (ty < lastY + minDy) oy += lastY + minDy - ty;
      tips[i]._tipLabOy = oy;
      lastY = tips[i]._vy + 4 + oy;
    }
  }

  function renderSvgAlternate(mode, root, opts) {
    opts = opts || {};
    annotateTreePaths(root, '0', null);
    var hi = opts.highlightPaths || {};
    if (typeof hi !== 'object' || Array.isArray(hi)) hi = {};
    var panX = opts.panX || 0,
      panY = opts.panY || 0,
      scale = opts.scale || 1;
    var W = 720,
      H = 520;
    var cx0 = W / 2,
      cy0 = H / 2;
    var svg = [];
    var clipId = 'mcEtlAltClip_' + String(Math.random()).slice(2, 10);
    svg.push(
      '<svg xmlns="http://www.w3.org/2000/svg" class="mc-etl-phylo-svg mc-etl-phylo-svg--' +
        esc(mode) +
        '" viewBox="0 0 ' +
        W +
        ' ' +
        H +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="life-tree">'
    );
    svg.push(
      '<defs><clipPath id="' +
        clipId +
        '"><rect x="0" y="0" width="' +
        W +
        '" height="' +
        H +
        '" rx="0"/></clipPath></defs>'
    );

    if (mode === 'circular') {
      layoutCircularRings(root, 48, 56);
      /* era rings background — reference: concentric time rings */
      var rings = [88, 140, 200, 260, 318];
      var ringHue = ['rgba(74,61,92,0.14)', 'rgba(45,90,74,0.12)', 'rgba(90,74,45,0.12)', 'rgba(45,74,106,0.12)'];
      for (var ri = 0; ri < rings.length; ri++) {
        svg.push(
          '<circle class="mc-etl-life-ring" cx="' +
            cx0 +
            '" cy="' +
            cy0 +
            '" r="' +
            rings[ri] +
            '" fill="none" stroke="' +
            (ringHue[ri % ringHue.length] || 'rgba(120,200,170,0.1)') +
            '" stroke-width="' +
            (ri === 0 ? 2 : 1) +
            '" />'
        );
      }
    } else if (mode === 'spiral' || mode === 'cladistic') {
      layoutSpiral(root, 2.4);
    } else {
      layoutRadial(root, 210);
    }
    staggerTipLabelOffsets(root);

    var coord =
      mode === 'circular'
        ? { px: '_cx', py: '_cy', cx: '_cx', cy: '_cy' }
        : mode === 'spiral' || mode === 'cladistic'
          ? { px: '_sx', py: '_sy', cx: '_sx', cy: '_sy' }
          : { px: '_rx', py: '_ry', cx: '_rx', cy: '_ry' };

    function shift(n) {
      if (!n) return;
      n._vx = cx0 + n[coord.cx];
      n._vy = cy0 + n[coord.cy];
      if (n.children) for (var i = 0; i < n.children.length; i++) shift(n.children[i]);
    }
    shift(root);

    /* Stagger internal lineage labels that sit near the hub (same issue as clad marks: unreadable overlap). */
    (function packDenseLineageLabelY(rootNode) {
      var r2 = 52 * 52;
      var internals = [];
      function walk(nn) {
        if (!nn) return;
        var onLineage = !!(hi[nn._path]);
        var isLeaf = !nn.children || !nn.children.length;
        if (onLineage && !isLeaf) {
          var dx = nn._vx - cx0,
            dy = nn._vy - cy0;
          if (dx * dx + dy * dy <= r2) internals.push(nn);
        }
        if (nn.children) for (var z = 0; z < nn.children.length; z++) walk(nn.children[z]);
      }
      walk(rootNode);
      internals.sort(function (a, b) {
        return a._vy - b._vy;
      });
      for (var i = 0; i < internals.length; i++) internals[i]._lineageLabOy = i * 13 - ((internals.length - 1) * 6.5);
    })(root);

    var edgeCoord = { px: '_vx', py: '_vy', cx: '_vx', cy: '_vy' };
    svg.push(
      '<g class="mc-etl-phylo-pan" transform="translate(' + panX + ',' + panY + ') scale(' + scale + ')">'
    );
    var branchStroke = mode === 'radial' ? 2.15 : 1.35;
    function drawRadialEdgesThick(svg, n, hi, childCoord, sw) {
      if (!n || !n.children || !n.children.length) return;
      var px = n[childCoord.px],
        py = n[childCoord.py];
      for (var c = 0; c < n.children.length; c++) {
        var ch = n.children[c];
        var cx = ch[childCoord.cx],
          cy = ch[childCoord.cy];
        var onPath = hi[ch._path] || hi[n._path];
        var cls = onPath ? 'mc-etl-branch mc-etl-branch--path' : 'mc-etl-branch';
        svg.push(
          '<line class="' +
            cls +
            '" x1="' +
            px +
            '" y1="' +
            py +
            '" x2="' +
            cx +
            '" y2="' +
            cy +
            '" stroke-width="' +
            sw +
            '" />'
        );
        drawRadialEdgesThick(svg, ch, hi, childCoord, sw);
      }
    }
    drawRadialEdgesThick(svg, root, hi, edgeCoord, branchStroke);

    if (mode === 'cladistic') {
      var markList = cladMarkListFromOpts(opts);
      var bi = 0;
      var placedClad = [];
      function markClad(n) {
        if (!n || !n.children || !n.children.length) return;
        for (var c = 0; c < n.children.length; c++) {
          var ch = n.children[c];
          /* Slight variation along each edge so marks are not all at the same depth from the hub. */
          var tAlong = 0.33 + ((bi * 5) % 8) * 0.022;
          if (tAlong > 0.5) tAlong = 0.5;
          var mx = n._vx + (ch._vx - n._vx) * tAlong;
          var my = n._vy + (ch._vy - n._vy) * tAlong;
          var mk = markList[bi % markList.length];
          bi++;
          var txt = mk.text;
          var rw = cladMarkTextWidth(txt);
          var pos = resolveCladMarkScreenPos(mx, my, rw, placedClad, cx0, cy0);
          var disp = txt.length > 22 ? txt.slice(0, 20) + '…' : txt;
          svg.push(
            '<g class="mc-etl-clad-mark" transform="translate(' +
              pos.x +
              ',' +
              pos.y +
              ')"><circle r="5" fill="rgba(255,120,120,0.85)" stroke="rgba(255,200,200,0.9)" stroke-width="1"/><rect x="' +
              (-rw / 2) +
              '" y="-9" width="' +
              rw +
              '" height="18" rx="5" fill="' +
              esc(mk.fill) +
              '" stroke="' +
              esc(mk.stroke) +
              '"/><text x="0" y="4" text-anchor="middle" font-size="8.5" class="mc-etl-clad-mark__txt" fill="rgba(240,246,255,0.98)">' +
              esc(disp) +
              '</text></g>'
          );
          markClad(ch);
        }
      }
      markClad(root);
    }

    function drawV(n, isTip) {
      if (!n) return;
      var taxaRows = opts.taxaRows || [];
      var x = n._vx,
        y = n._vy;
      var sel = opts.selectedPath && n._path === opts.selectedPath;
      var onLineage = !!(hi[n._path]);
      var r = sel ? 9 : isTip || !n.children || !n.children.length ? 6 : 4;
      var ncls = 'mc-etl-node' + (sel ? ' mc-etl-node--sel' : '') + (onLineage ? ' mc-etl-node--path' : '');
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
          '" tabindex="0" />'
      );
      var lab = phyloLabelWithExtinctDagger(n.displayName || '', n.ottFromLabel, taxaRows, n.name);
      var show = isTip || !n.children || !n.children.length || onLineage;
      if (show && lab) {
        var lx = x + (x >= cx0 ? 10 : -10);
        var anchor = x >= cx0 ? 'start' : 'end';
        var oy = (Number(n._tipLabOy) || 0) + (Number(n._lineageLabOy) || 0);
        var isLeaf = !n.children || !n.children.length;
        var isStubTip = isLeaf && lab.indexOf('姊妹群') >= 0;
        var lcls =
          'mc-etl-phylo-label' +
          (isStubTip ? ' mc-etl-phylo-label--stub' : '') +
          (sel ? ' mc-etl-phylo-label--sel-tip' : '') +
          (onLineage && !sel && !isStubTip ? ' mc-etl-phylo-label--path-tip' : '');
        svg.push(
          '<text class="' +
            lcls +
            '" x="' +
            lx +
            '" y="' +
            (y + 4 + oy) +
            '" text-anchor="' +
            anchor +
            '">' +
            esc(lab.length > 34 ? lab.slice(0, 32) + '…' : lab) +
            '</text>'
        );
      }
      if (n.children) for (var j = 0; j < n.children.length; j++) drawV(n.children[j], false);
    }
    drawV(root, false);

    svg.push('</g></svg>');
    return { html: svg.join(''), width: W, height: H };
  }

  global.MCEvolutionTreeLayouts = {
    /** @returns {{html:string,width:number,height:number}|null} */
    render: function (mode, root, opts) {
      if (!root) return null;
      if (mode === 'classic' || mode === 'geologic' || mode === 'collection') return null;
      if (mode === 'radial' || mode === 'circular' || mode === 'spiral' || mode === 'cladistic') {
        return renderSvgAlternate(mode, root, opts);
      }
      return null;
    },
    pathPrefixes: pathPrefixes,
    annotateTreePaths: annotateTreePaths
  };
})(typeof window !== 'undefined' ? window : this);
