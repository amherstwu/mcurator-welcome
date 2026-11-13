/**
 * Apps Script mirror of sat-marketplace/src/product/mcuratorProductContract.ts
 * Keep IDs, routes, and capability states aligned — validated by scripts/test-product-contract.mjs
 */
(function (global) {
  'use strict';

  var MC_PRODUCT_CONTRACT = {
    version: 1,
    surfaces: {
      welcome: { id: 'surface.welcome' },
      desktop: { id: 'surface.desktop' },
      mobile: { id: 'surface.mobile' },
      marketplace: { id: 'surface.marketplace' },
    },
    features: [
      { id: 'auth.login', capability: 'demo', canonicalRoute: '/mobile/login' },
      { id: 'auth.signup', capability: 'unavailable', canonicalRoute: '/mobile/signup' },
      { id: 'auth.forgotPassword', capability: 'unavailable', canonicalRoute: '/mobile/forgot-password' },
      { id: 'auth.demo', capability: 'demo', canonicalRoute: '/mobile/home' },
      { id: 'capture.camera', capability: 'preview', canonicalRoute: '/mobile/capture', routeAliases: ['/mobile/workspace/import/field'] },
      { id: 'passport.studio', capability: 'live', canonicalRoute: '/specimen-card-generator', routeAliases: ['/specimen-passport'] },
      { id: 'tool.ecology', capability: 'preview', canonicalRoute: '/tools/ecology' },
      { id: 'tool.aiRestore', capability: 'preview', canonicalRoute: '/tools/ai-restore' },
      { id: 'tool.paper', capability: 'live', canonicalRoute: '/genome-taxonomy-lab' },
      { id: 'tool.evolution', capability: 'live', canonicalRoute: '/genome-taxonomy-lab' },
      {
        id: 'tool.husbandry',
        capability: 'live',
        canonicalRoute: '/tools/husbandry',
        localOnly: true,
        crossDeviceSync: false,
        storageKeys: { appsScript: 'mc_hl_v7', mobile: 'mcurator.mobile.husbandryLog.v1' },
      },
      {
        id: 'marketplace.browse',
        capability: 'demo',
        canonicalRoute: '/marketplace',
        routeAliases: ['/sat-market', '/sat-marketplace'],
      },
      { id: 'marketplace.payment', capability: 'unavailable', canonicalRoute: '/marketplace' },
      { id: 'marketplace.blockchainWrite', capability: 'unavailable', canonicalRoute: '/marketplace' },
      { id: 'marketplace.ownership', capability: 'demo', canonicalRoute: '/marketplace' },
      {
        id: 'specimen.collaboration',
        capability: 'demo',
        canonicalRoute: '/marketplace/collaboration/queue',
      },
      {
        id: 'origin.hub',
        capability: 'demo',
        canonicalRoute: '/origin',
        routeAliases: ['/section/origin'],
      },
      {
        id: 'origin.studio.publish',
        capability: 'unavailable',
        canonicalRoute: '/origin/studio',
      },
      {
        id: 'origin.exhibit.access',
        capability: 'unavailable',
        canonicalRoute: '/origin/exhibitions',
      },
      { id: 'husbandry.sync', capability: 'unavailable', canonicalRoute: '/tools/husbandry', crossDeviceSync: false },
    ],
    passport: {
      schemaVersion: 1,
      exportWidthPx: 640,
      exportHeightPx: 1010,
      previewAspectRatio: '640 / 1010',
      steps: ['start', 'image', 'basics', 'taxonomy', 'provenance', 'preview', 'export'],
      appsScriptIndexToCanonical: ['image', 'image', 'basics', 'provenance', 'preview', 'preview', 'export'],
      mobileIdToCanonical: {
        basic: 'basics',
        photo: 'image',
        location: 'provenance',
        taxonomy: 'taxonomy',
        settings: 'preview',
        export: 'export',
      },
      canonicalFromAppsScriptIndex: function (index) {
        var map = MC_PRODUCT_CONTRACT.passport.appsScriptIndexToCanonical;
        var i = Math.max(0, Math.min(map.length - 1, Math.floor(Number(index) || 0)));
        return map[i];
      },
      canonicalFromMobileId: function (mobileId) {
        return MC_PRODUCT_CONTRACT.passport.mobileIdToCanonical[String(mobileId || '')] || null;
      },
    },
    resolveMarketplacePath: function (pathname) {
      var path = String(pathname || '').split('?')[0];
      if (path === '/sat-market' || path === '/sat-marketplace') return '/marketplace';
      if (path.indexOf('/sat-market/') === 0) return path.replace(/^\/sat-market/, '/marketplace');
      if (path.indexOf('/sat-marketplace/') === 0) return path.replace(/^\/sat-marketplace/, '/marketplace');
      return path;
    },
  };

  global.MC_PRODUCT_CONTRACT = MC_PRODUCT_CONTRACT;
})(typeof window !== 'undefined' ? window : this);
