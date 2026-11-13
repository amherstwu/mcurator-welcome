/**
 * Husbandry Log — printable label templates + QR helpers.
 */
(function (global) {
  'use strict';

  var TEMPLATES = [
    {
      id: 'small_cage',
      labelKey: 'labelSmallCage',
      size: 'small',
      fields: ['petName', 'speciesName', 'scientificName', 'lifeStage', 'qrCode'],
    },
    {
      id: 'standard_enclosure',
      labelKey: 'labelStandardEnclosure',
      size: 'medium',
      fields: ['petName', 'speciesName', 'scientificName', 'lifeStage', 'careStartDate', 'currentStatus', 'qrCode'],
    },
    {
      id: 'aquarium',
      labelKey: 'labelAquarium',
      size: 'medium',
      fields: ['petName', 'speciesName', 'scientificName', 'waterTemperature', 'lastWaterChange', 'qrCode'],
    },
    {
      id: 'quarantine',
      labelKey: 'labelQuarantine',
      size: 'medium',
      fields: ['petName', 'speciesName', 'careStartDate', 'currentStatus', 'emergencyNote', 'qrCode'],
    },
    {
      id: 'breeding',
      labelKey: 'labelBreeding',
      size: 'medium',
      fields: ['petName', 'speciesName', 'careStartDate', 'currentStatus', 'qrCode'],
    },
    {
      id: 'coordinates_label',
      labelKey: 'labelCoordinates',
      size: 'medium',
      fields: ['petName', 'speciesName', 'scientificName', 'locality', 'latitude', 'longitude', 'altitude', 'qrCode'],
    },
  ];

  function formatCoord(value, decimals) {
    var n = Number(String(value || '').replace(',', '.'));
    if (!isFinite(n)) return '';
    return n.toFixed(decimals == null ? 6 : decimals);
  }

  /** QR on enclosure labels always opens the pet status scan page (not geo:). */
  function buildQrPayload(pet, link) {
    return String(link || '').trim() || 'MCurator';
  }

  function appBaseUrl() {
    try {
      return global.location.origin + global.location.pathname;
    } catch (e) {
      return '';
    }
  }

  function petScanDeepLink(petId) {
    var base = appBaseUrl();
    return (
      base +
      '#/section/husbandry-log?petId=' +
      encodeURIComponent(petId || '') +
      '&view=scan'
    );
  }

  function qrImageUrl(data, size) {
    var s = Math.max(64, Math.min(320, Math.round(Number(size) || 120)));
    var payload = String(data || '').trim() || 'MCurator';
    return 'https://api.qrserver.com/v1/create-qr-code/?size=' + s + 'x' + s + '&margin=2&ecc=M&data=' + encodeURIComponent(payload);
  }

  function petDeepLink(petId) {
    return petScanDeepLink(petId);
  }

  function getTemplates() {
    return TEMPLATES;
  }

  function getTemplate(id) {
    return TEMPLATES.filter(function (t) { return t.id === id; })[0] || TEMPLATES[1];
  }

  global.MCHusbandryLabelTemplates = {
    templates: TEMPLATES,
    getTemplates: getTemplates,
    getTemplate: getTemplate,
    qrImageUrl: qrImageUrl,
    petDeepLink: petDeepLink,
    petScanDeepLink: petScanDeepLink,
    formatCoord: formatCoord,
    buildQrPayload: buildQrPayload,
  };
})(typeof window !== 'undefined' ? window : this);
