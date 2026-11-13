/**
 * AfriGIS Geology API — server-side proxy (OAuth2 credentials in Script Properties).
 * Property keys (optional): AFRIGIS_CLIENT_ID, AFRIGIS_CLIENT_SECRET, AFRIGIS_TOKEN_URL, AFRIGIS_GEOLOGY_BASE
 * Do not commit secrets. If unset, returns disabled stub (UI shows setup message).
 *
 * Coordinate-based geology enriches locality context; it does not infer phylogeny.
 */

function afriGisGeologyProxy(payload) {
  var body = payload && typeof payload === 'object' ? payload : {};
  var lat = Number(body.lat);
  var lng = Number(body.lng);
  if (!isFinite(lat) || !isFinite(lng)) {
    return { ok: false, disabled: true, message: '需要有效經緯度', data: null };
  }

  var props = PropertiesService.getScriptProperties();
  var clientId = props.getProperty('AFRIGIS_CLIENT_ID');
  var clientSecret = props.getProperty('AFRIGIS_CLIENT_SECRET');
  var tokenUrl = props.getProperty('AFRIGIS_TOKEN_URL') || 'https://oauth.afrigis.co.za/oauth/token';
  var apiBase = props.getProperty('AFRIGIS_GEOLOGY_BASE') || '';

  if (!clientId || !clientSecret) {
    return {
      ok: false,
      disabled: true,
      message: '需要設定 AfriGIS OAuth2 憑證（Script Properties：AFRIGIS_CLIENT_ID / AFRIGIS_CLIENT_SECRET）',
      data: { lat: lat, lng: lng }
    };
  }

  if (!apiBase) {
    return {
      ok: false,
      disabled: true,
      message: '請設定 AFRIGIS_GEOLOGY_BASE 為 AfriGIS Geology API 基底 URL（見官方 OAS3 文件）',
      data: { lat: lat, lng: lng }
    };
  }

  try {
    var token = afriGisFetchAccessToken_(tokenUrl, clientId, clientSecret);
    if (!token) {
      return { ok: false, disabled: true, message: 'AfriGIS OAuth2 取 token 失敗', data: { lat: lat, lng: lng } };
    }
    var geology = afriGisFetchGeologySample_(apiBase, token, lat, lng);
    return { ok: true, disabled: false, message: '', data: geology };
  } catch (e) {
    return {
      ok: false,
      disabled: false,
      message: String(e && e.message ? e.message : e),
      data: { lat: lat, lng: lng }
    };
  }
}

function afriGisFetchAccessToken_(tokenUrl, clientId, clientSecret) {
  var cache = CacheService.getScriptCache();
  var ck = 'afrigis_oauth_v1';
  var hit = cache.get(ck);
  if (hit) {
    try {
      var j = JSON.parse(hit);
      if (j && j.access_token) return j.access_token;
    } catch (e0) {}
  }
  var resp = UrlFetchApp.fetch(tokenUrl, {
    muteHttpExceptions: true,
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    }
  });
  var code = resp.getResponseCode();
  var text = resp.getContentText() || '';
  if (code < 200 || code >= 300) {
    throw new Error('token_http_' + code + ':' + text.slice(0, 200));
  }
  var data = JSON.parse(text);
  var tok = data.access_token;
  var exp = Number(data.expires_in || 3600);
  if (tok) {
    try {
      cache.put(ck, JSON.stringify({ access_token: tok }), Math.max(60, Math.min(exp - 60, 3300)));
    } catch (e1) {}
  }
  return tok;
}

/** Replace path/query per your AfriGIS contract; placeholder uses GET with Bearer. */
function afriGisFetchGeologySample_(apiBase, token, lat, lng) {
  var base = String(apiBase).replace(/\/$/, '');
  var url = base + '/geology?lat=' + encodeURIComponent(lat) + '&lng=' + encodeURIComponent(lng);
  var r = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    method: 'get',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' }
  });
  var txt = r.getContentText() || '';
  var data = null;
  try {
    data = txt ? JSON.parse(txt) : null;
  } catch (e) {
    data = { _raw: txt };
  }
  return {
    lat: lat,
    lng: lng,
    lithostratigraphy: '',
    chronostratigraphy: '',
    geologicalUnit: '',
    ageDescription: '',
    raw: data,
    fetchedAt: new Date().toISOString(),
    confidence: 0.4
  };
}
