/**
 * AfriGIS Geology API — browser client; local preview has no backend proxy.
 * @see https://developers.afrigis.co.za/oas3/geology-api/
 */
(function (global) {
  'use strict';

  function isGas() {
    try {
      return typeof google !== 'undefined' && google.script && google.script.run && !google.script.run.__mcLocalMock;
    } catch (e) {
      return false;
    }
  }

  function normalizeAfriGisGeologyResponse(res) {
    if (!res || typeof res !== 'object') {
      return {
        lat: null,
        lng: null,
        source: 'AfriGIS',
        lithostratigraphy: '',
        chronostratigraphy: '',
        geologicalUnit: '',
        ageDescription: '',
        raw: null,
        fetchedAt: new Date().toISOString(),
        confidence: 0,
        disabled: true,
        message: ''
      };
    }
    var d = res.data && typeof res.data === 'object' ? res.data : res;
    return {
      lat: d.lat != null ? Number(d.lat) : null,
      lng: d.lng != null ? Number(d.lng) : null,
      source: 'AfriGIS',
      lithostratigraphy: String(d.lithostratigraphy || d.litho || d.formation || '').trim(),
      chronostratigraphy: String(d.chronostratigraphy || d.chrono || d.stratigraphy || '').trim(),
      geologicalUnit: String(d.geologicalUnit || d.unit || d.mapUnit || '').trim(),
      ageDescription: String(d.ageDescription || d.age || '').trim(),
      raw: d.raw != null ? d.raw : null,
      fetchedAt: d.fetchedAt || new Date().toISOString(),
      confidence: typeof d.confidence === 'number' ? d.confidence : res.ok ? 0.5 : 0,
      disabled: !!res.disabled || !res.ok,
      message: String(res.message || d.message || '')
    };
  }

  function getGeologyByCoordinate(lat, lng) {
    var la = Number(lat);
    var ln = Number(lng);
    if (!isFinite(la) || !isFinite(ln)) {
      return Promise.resolve({
        ok: false,
        disabled: true,
        message: 'Invalid coordinates',
        data: null
      });
    }
    if (!isGas()) {
      return Promise.resolve({
        ok: false,
        disabled: true,
        message: 'AfriGIS：本機預覽無後端代理（需另行設定 OAuth 憑證的 API 服務）。',
        data: { lat: la, lng: ln }
      });
    }
    return new Promise(function (resolve, reject) {
      try {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .afriGisGeologyProxy({ lat: la, lng: ln });
      } catch (e) {
        reject(e);
      }
    });
  }

  global.MCEvolutionTreeAfriGis = {
    getGeologyByCoordinate: getGeologyByCoordinate,
    normalizeAfriGisGeologyResponse: normalizeAfriGisGeologyResponse,
    attachGeologyToSpecimen: function (specimenId, lat, lng) {
      return getGeologyByCoordinate(lat, lng).then(function (r) {
        return { specimenId: specimenId, geology: normalizeAfriGisGeologyResponse(r), raw: r };
      });
    },
    attachGeologyToTaxonOccurrence: function (taxon, occurrence) {
      var lat = occurrence && (occurrence.lat != null ? occurrence.lat : occurrence.dec_lat);
      var lng = occurrence && (occurrence.lng != null ? occurrence.lng : occurrence.dec_lng);
      return getGeologyByCoordinate(lat, lng).then(function (r) {
        return { taxon: taxon, geology: normalizeAfriGisGeologyResponse(r), raw: r };
      });
    },
    getChronostratigraphyForLocation: function (lat, lng) {
      return getGeologyByCoordinate(lat, lng).then(function (r) {
        var n = normalizeAfriGisGeologyResponse(r);
        return n.chronostratigraphy || n.ageDescription || '';
      });
    },
    getLithostratigraphyForLocation: function (lat, lng) {
      return getGeologyByCoordinate(lat, lng).then(function (r) {
        var n = normalizeAfriGisGeologyResponse(r);
        return n.lithostratigraphy || n.geologicalUnit || '';
      });
    }
  };
})(typeof window !== 'undefined' ? window : this);
