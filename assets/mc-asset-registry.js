/**
 * Centralized local demo / placeholder imagery for MCurator.
 * Uses inline SVG data URIs so the app works with zero network images and no
 * required binary assets in the repo. When assets/images/ files exist, they
 * are merged in via MC_LOCAL_DEMO_RELPATHS (mc-local-demo-manifest.js) and
 * `mc-asset-resolver.js` (mcGetDemoImageUrlPool_ / unified pools).
 */
(function (global) {
  'use strict';
  var palette = [
    { bg: '0d1f14', acc: '6d9d7c', label: '1' },
    { bg: '0f1a1d', acc: '7a96a8', label: '2' },
    { bg: '120f18', acc: 'b8956a', label: '3' },
    { bg: '111418', acc: '8b95a3', label: '4' },
    { bg: '0e1512', acc: '5a8f6a', label: '5' },
    { bg: '14100e', acc: 'c4a24a', label: '6' },
    { bg: '0c1418', acc: '5f7d92', label: '7' },
    { bg: '101214', acc: '93a4b0', label: '8' },
    { bg: '150f10', acc: '9a7a6a', label: '9' },
    { bg: '0d120f', acc: '6a9a8a', label: '10' },
    { bg: '12100d', acc: 'a8b0bc', label: '11' },
    { bg: '0a1316', acc: '7a8896', label: '12' },
    { bg: '130e12', acc: '8890a0', label: '13' },
    { bg: '0e1110', acc: '6d7d6f', label: '14' },
    { bg: '110f14', acc: '9a8a7a', label: '15' },
    { bg: '0f1210', acc: '7a8a9a', label: '16' },
    { bg: '120d0f', acc: '8a7a6a', label: '17' },
    { bg: '0d0f12', acc: '6a7a8a', label: '18' },
    { bg: '101012', acc: 'a0a8b0', label: '19' },
    { bg: '0a1114', acc: '8a9aa8', label: '20' },
    { bg: '140f0d', acc: '8a7a5a', label: '21' },
    { bg: '0e0f11', acc: '7a8a7a', label: '22' },
    { bg: '100e12', acc: '9a8a8a', label: '23' },
    { bg: '0c1012', acc: '8a9098', label: '24' }
  ];
  function makeSvgDataUri(p) {
    var svg =
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E" +
      "%3Crect fill='%23" +
      p.bg +
      "' width='400' height='500'/%3E" +
      "%3Crect x='20' y='20' width='360' height='2' fill='%23" +
      p.acc +
      "' fill-opacity='0.35'/%3E" +
      "%3Ctext x='200' y='260' text-anchor='middle' fill='%23" +
      p.acc +
      "' font-family='system-ui,sans-serif' font-size='14' letter-spacing='0.08em'%3ESAT demo " +
      p.label +
      "%3C/text%3E" +
      "%3Ctext x='200' y='286' text-anchor='middle' fill='%23" +
      p.acc +
      "' font-family='system-ui,sans-serif' font-size='11' fill-opacity='0.6'%3Elocal project asset%3C/text%3E" +
      "%3C/svg%3E";
    return "data:image/svg+xml;charset=utf-8," + svg;
  }
  var urls = [];
  for (var i = 0; i < palette.length; i++) {
    urls.push(makeSvgDataUri(palette[i]));
  }
  global.MC_DEFAULT_DEMO_IMAGE_URLS = urls;
  /**
   * Optional: allow remote Flickr (etc.) as last-resort when local pool is empty.
   * Default off — scientific demo must not depend on third-party image hosts.
   */
  global.MC_ALLOW_REMOTE_DEMO_IMAGES = false;
  global.MC_ASSET_REGISTRY = [
    { id: 'local_demo_001', type: 'image', category: 'insect', title: 'Demo insect voucher', src: 'data:registry', credit: 'Local project asset', alt: 'Scientific collection demo image' },
    { id: 'local_demo_002', type: 'image', category: 'paleobiology', title: 'Demo fossil / slab', src: 'data:registry', credit: 'Local project asset', alt: 'Scientific collection demo image' },
    { id: 'local_demo_003', type: 'image', category: 'botany', title: 'Demo plant sheet', src: 'data:registry', credit: 'Local project asset', alt: 'Scientific collection demo image' }
  ];
})(typeof self !== 'undefined' ? self : this);
