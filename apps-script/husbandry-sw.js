/**
 * Husbandry Log — Service Worker
 * Cache name tracks HUSBANDRY_ASSET_VERSION (via husbandryAssetVersion.js).
 * Strategies:
 *   - HTML / navigation: network-first (never permanently cache-first)
 *   - Versioned static husbandry assets: stale-while-revalidate
 *   - Other husbandry GETs: network-first with cache fallback
 * Activate deletes only mc-husbandry-* caches (never other modules).
 */
/* global importScripts, clients, caches, fetch, Response, Request */
importScripts('./husbandryAssetVersion.js');

(function () {
  'use strict';

  var VER = self.MCHusbandryAssetVersion;
  var CACHE = VER.cacheName();
  var V = VER.VERSION;

  var PRECACHE = [
    VER.withVersion('./husbandryAssetVersion.js'),
    VER.withVersion('./husbandryActionRegistry.js'),
    VER.withVersion('./husbandry-export-contract.js'),
    VER.withVersion('./husbandry-log.js'),
    VER.withVersion('./husbandryDataExport.js'),
    VER.withVersion('./husbandryOffline.js'),
    VER.withVersion('./husbandryQr.js'),
    VER.withVersion('./husbandryTrends.js'),
    VER.withVersion('./husbandryBatch.js'),
    VER.withVersion('./husbandryAddPetWizard.js'),
    VER.withVersion('./husbandry-log-foundation.css'),
    VER.withVersion('./husbandry-log-console.css'),
    VER.withVersion('./husbandry-log-dashboard.css'),
    VER.withVersion('./husbandry-log-command-center.css'),
    VER.withVersion('./husbandry-log-careguide.css'),
    VER.withVersion('./husbandry-log-breeding.css'),
    VER.withVersion('./husbandry-log-wizard.css'),
    VER.withVersion('./i18n/husbandryLogI18n.js'),
    VER.withVersion('./i18n/husbandryWizardI18n.js'),
    VER.withVersion('./i18n/husbandryCareGuideI18n.js'),
    VER.withVersion('./husbandryCareGuide.js'),
    VER.withVersion('./husbandryBreeding.js'),
    VER.withVersion('./husbandryRecordChoices.js'),
    VER.withVersion('./husbandryRecordDecks.js'),
  ];

  function isNavigationRequest(req) {
    if (req.mode === 'navigate') return true;
    var dest = req.destination;
    if (dest === 'document') return true;
    var accept = req.headers && req.headers.get('accept');
    return !!(accept && accept.indexOf('text/html') >= 0);
  }

  function isHusbandryUrl(url) {
    return url.indexOf('husbandry') >= 0 || url.indexOf('mc_hl_') >= 0;
  }

  function isStaticAsset(url) {
    return /\.(?:js|css|webmanifest|woff2?|png|jpe?g|svg|webp)(?:\?|$)/i.test(url);
  }

  function networkFirst(req) {
    return fetch(req).then(function (res) {
      if (res && res.ok && req.method === 'GET') {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (cached) {
        return cached || new Response('', { status: 503, statusText: 'Offline' });
      });
    });
  }

  function staleWhileRevalidate(req) {
    return caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (cached) {
        var network = fetch(req).then(function (res) {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(function () { return cached; });
        return cached || network;
      });
    });
  }

  self.addEventListener('install', function (ev) {
    ev.waitUntil(
      caches.open(CACHE).then(function (cache) {
        return cache.addAll(PRECACHE).catch(function () {});
      }).then(function () {
        return self.skipWaiting();
      })
    );
  });

  self.addEventListener('activate', function (ev) {
    ev.waitUntil(
      caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (!VER.isHusbandryCacheName(k)) return null;
          if (k === CACHE) return null;
          return caches.delete(k);
        }));
      }).then(function () {
        return self.clients.claim();
      }).then(function () {
        return self.clients.matchAll({ type: 'window' }).then(function (list) {
          list.forEach(function (client) {
            try {
              client.postMessage({
                type: 'HUSBANDRY_SW_ACTIVATED',
                version: V,
                cache: CACHE,
              });
            } catch (e) {}
          });
        });
      })
    );
  });

  self.addEventListener('message', function (ev) {
    var data = ev.data || {};
    if (data && data.type === 'HUSBANDRY_SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  self.addEventListener('fetch', function (ev) {
    if (ev.request.method !== 'GET') return;
    var url = ev.request.url || '';
    if (!isHusbandryUrl(url) && !isNavigationRequest(ev.request)) return;

    if (isNavigationRequest(ev.request) || /UI\.html(?:\?|$)/i.test(url)) {
      ev.respondWith(networkFirst(ev.request));
      return;
    }

    if (!isHusbandryUrl(url)) return;

    if (isStaticAsset(url)) {
      ev.respondWith(staleWhileRevalidate(ev.request));
      return;
    }

    ev.respondWith(networkFirst(ev.request));
  });
})();
