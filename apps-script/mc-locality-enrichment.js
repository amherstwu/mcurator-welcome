/**
 * MCurator — 採集點環境補齊（客戶端）
 * API：Open-Meteo（海拔、即時天氣，免金鑰）· Nominatim（反向地理，需合理 User-Agent）
 * 不寫入後端金鑰；僅供表單自動帶入參考。
 */
(function (global) {
  'use strict';

  var UA = 'MCurator-locality-enrichment/1.0 (museum specimen; contact: local admin)';
  var OM_ELEV = 'https://api.open-meteo.com/v1/elevation';
  var OM_FORECAST = 'https://api.open-meteo.com/v1/forecast';

  function num(v) {
    var n = Number(v);
    return isFinite(n) ? n : null;
  }

  function wmoWeatherZh(code) {
    var c = Math.round(Number(code) || 0);
    var map = {
      0: '晴朗',
      1: '大致晴朗',
      2: '局部多雲',
      3: '陰',
      45: '霧',
      48: '霧凇',
      51: '毛毛雨（輕）',
      53: '毛毛雨（中）',
      55: '毛毛雨（強）',
      61: '小雨',
      63: '中雨',
      65: '大雨',
      71: '小雪',
      73: '中雪',
      75: '大雪',
      80: '陣雨（小）',
      81: '陣雨（中）',
      82: '陣雨（強）',
      95: '雷雨',
      96: '雷雨伴冰雹',
      99: '強雷雨伴冰雹'
    };
    return map[c] || '代碼 ' + c;
  }

  function fetchJson(url) {
    if (typeof fetch !== 'function') return Promise.resolve(null);
    return fetch(url, { credentials: 'omit' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .catch(function () {
        return null;
      });
  }

  function fetchOpenMeteoElevation(lat, lng) {
    var u =
      OM_ELEV +
      '?latitude=' +
      encodeURIComponent(lat) +
      '&longitude=' +
      encodeURIComponent(lng);
    return fetchJson(u).then(function (j) {
      var arr = j && j.elevation;
      if (Array.isArray(arr) && arr.length && typeof arr[0] === 'number' && isFinite(arr[0])) {
        return Math.round(arr[0]);
      }
      return null;
    });
  }

  function fetchOpenMeteoCurrent(lat, lng) {
    var u =
      OM_FORECAST +
      '?latitude=' +
      encodeURIComponent(lat) +
      '&longitude=' +
      encodeURIComponent(lng) +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,is_day' +
      '&timezone=auto&wind_speed_unit=ms';
    return fetchJson(u);
  }

  function nominatimReverse(lat, lng) {
    if (typeof fetch !== 'function') return Promise.resolve(null);
    var url =
      'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' +
      encodeURIComponent(lat) +
      '&lon=' +
      encodeURIComponent(lng);
    return fetch(url, {
      headers: {
        'Accept-Language': 'zh-TW,en',
        'User-Agent': UA
      }
    })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .catch(function () {
        return null;
      });
  }

  function habitatHintFromAddress(a) {
    if (!a || typeof a !== 'object') return '';
    var bits = [];
    ['natural', 'landuse', 'leisure', 'waterway', 'tourism', 'amenity'].forEach(function (k) {
      if (a[k]) bits.push(String(a[k]));
    });
    return bits.filter(Boolean).slice(0, 4).join(' · ');
  }

  function buildWeatherLines(cur, langZh) {
    if (!cur || typeof cur !== 'object') return [];
    var t = num(cur.temperature_2m);
    var rh = num(cur.relative_humidity_2m);
    var ap = num(cur.apparent_temperature);
    var pr = num(cur.precipitation);
    var cc = num(cur.cloud_cover);
    var ps = num(cur.pressure_msl);
    var ws = num(cur.wind_speed_10m);
    var wd = num(cur.wind_direction_10m);
    var wc = cur.weather_code != null ? wmoWeatherZh(cur.weather_code) : '';
    var lines = [];
    if (langZh) {
      if (t != null) lines.push('氣溫（2 m）：約 ' + t.toFixed(1) + ' °C');
      if (rh != null) lines.push('相對濕度：約 ' + Math.round(rh) + ' %');
      if (ap != null && Math.abs(ap - (t || 0)) > 0.3) lines.push('體感溫度：約 ' + ap.toFixed(1) + ' °C');
      if (wc) lines.push('天氣概況（WMO）：' + wc);
      if (cc != null) lines.push('雲量：約 ' + Math.round(cc) + ' %');
      if (pr != null && pr > 0) lines.push('降水量：約 ' + pr + ' mm');
      if (ps != null) lines.push('海平面氣壓：約 ' + Math.round(ps) + ' hPa');
      if (ws != null) {
        var wline = '風速（10 m）：約 ' + ws.toFixed(1) + ' m/s';
        if (wd != null) wline += ' · 風向約 ' + Math.round(wd) + '°';
        lines.push(wline);
      }
      lines.push('資料來源：Open-Meteo Forecast API（即時網格）');
    } else {
      if (t != null) lines.push('Temp 2m: ~' + t.toFixed(1) + ' °C');
      if (rh != null) lines.push('RH: ~' + Math.round(rh) + ' %');
      if (wc) lines.push('Weather (WMO): ' + wc);
      if (ps != null) lines.push('MSL pressure: ~' + Math.round(ps) + ' hPa');
      lines.push('Source: Open-Meteo');
    }
    return lines;
  }

  /**
   * @param {number} lat
   * @param {number} lng
   * @param {{ lang?: string }} [opts]
   * @returns {Promise<{ elevationM: number|null, linesZh: string[], nominatim: object|null, habitatHint: string, weatherRaw: object|null }>}
   */
  function enrich(lat, lng, opts) {
    opts = opts || {};
    var la = num(lat);
    var ln = num(lng);
    if (la == null || ln == null || la < -90 || la > 90 || ln < -180 || ln > 180) {
      return Promise.resolve({
        elevationM: null,
        linesZh: [],
        nominatim: null,
        habitatHint: '',
        weatherRaw: null
      });
    }
    var langZh = String(opts.lang || '').toLowerCase().indexOf('zh') === 0 || opts.lang === 'zh-TW';

    return Promise.all([
      fetchOpenMeteoElevation(la, ln),
      fetchOpenMeteoCurrent(la, ln),
      nominatimReverse(la, ln)
    ]).then(function (parts) {
      var elv = parts[0];
      var wx = parts[1];
      var nom = parts[2];
      var cur = wx && wx.current;
      var lines = buildWeatherLines(cur, langZh);
      var hab = '';
      if (nom && nom.address) {
        hab = habitatHintFromAddress(nom.address);
        if (hab && langZh) lines.unshift('地理環境標籤（OSM）：' + hab);
      }
      return {
        elevationM: elv,
        linesZh: lines,
        nominatim: nom,
        habitatHint: hab,
        weatherRaw: wx
      };
    });
  }

  global.MCLocalityEnrichment = {
    enrich: enrich,
    fetchOpenMeteoElevation: fetchOpenMeteoElevation,
    fetchOpenMeteoCurrent: fetchOpenMeteoCurrent,
    nominatimReverse: nominatimReverse,
    USER_AGENT: UA
  };
})(this);
