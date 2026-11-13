/**
 * Husbandry Log — single source of truth for asset / SW cache busting.
 * Bump HUSBANDRY_ASSET_VERSION when shipping Husbandry UI changes, then run:
 *   node scripts/stamp-husbandry-assets.mjs
 */
(function (global) {
  'use strict';

  /** @type {string} Canonical query version for all Husbandry CSS/JS/i18n. */
  var HUSBANDRY_ASSET_VERSION = 'hl-v81';

  /** Prefix only — full cache name is PREFIX + VERSION. */
  var HUSBANDRY_CACHE_PREFIX = 'mc-husbandry-';

  function withVersion(path) {
    var base = String(path || '');
    if (!base) return base;
    var q = base.indexOf('?');
    var pathOnly = q >= 0 ? base.slice(0, q) : base;
    var params = [];
    if (q >= 0) {
      String(base.slice(q + 1)).split('&').forEach(function (part) {
        if (!part || part.indexOf('v=') === 0) return;
        params.push(part);
      });
    }
    params.push('v=' + HUSBANDRY_ASSET_VERSION);
    return pathOnly + '?' + params.join('&');
  }

  function cacheName() {
    return HUSBANDRY_CACHE_PREFIX + HUSBANDRY_ASSET_VERSION;
  }

  function isHusbandryCacheName(name) {
    return String(name || '').indexOf(HUSBANDRY_CACHE_PREFIX) === 0;
  }

  var api = {
    VERSION: HUSBANDRY_ASSET_VERSION,
    CACHE_PREFIX: HUSBANDRY_CACHE_PREFIX,
    withVersion: withVersion,
    cacheName: cacheName,
    isHusbandryCacheName: isHusbandryCacheName,
  };

  global.MCHusbandryAssetVersion = api;
  global.HUSBANDRY_ASSET_VERSION = HUSBANDRY_ASSET_VERSION;
})(typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : this);
