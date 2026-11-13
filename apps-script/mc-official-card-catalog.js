/**
 * MCurator — official collectible / education card type catalog (no build step).
 * All UI copy is resolved via i18n keys in UI.html (cct_type_* / cct_type_*_d).
 * Images resolve through resolveAssetImage() using local project assets only.
 */
(function (global) {
  'use strict';
  /**
   * @typedef {{ id: string, titleKey: string, subKey: string, imgKey: string }} McOfficialCardCatalogRow
   * imgKey: passed to resolveAssetImage; use default_specimen_card, brand, mark, etc.
   */
  var ROWS = [
    { id: 'specimen', titleKey: 'cct_type_specimen', subKey: 'cct_type_specimen_d', kind: 'raster' },
    { id: 'achievement', titleKey: 'cct_type_achievement', subKey: 'cct_type_achievement_d', kind: 'logo' },
    { id: 'system', titleKey: 'cct_type_system', subKey: 'cct_type_system_d', kind: 'mark' },
    { id: 'event', titleKey: 'cct_type_event', subKey: 'cct_type_event_d', kind: 'raster' },
    { id: 'museum', titleKey: 'cct_type_museum', subKey: 'cct_type_museum_d', kind: 'raster' },
    { id: 'expedition', titleKey: 'cct_type_expedition', subKey: 'cct_type_expedition_d', kind: 'raster' },
    { id: 'verification', titleKey: 'cct_type_verification', subKey: 'cct_type_verification_d', kind: 'raster' },
    { id: 'tutorial', titleKey: 'cct_type_tutorial', subKey: 'cct_type_tutorial_d', kind: 'raster' },
    { id: 'quest', titleKey: 'cct_type_quest', subKey: 'cct_type_quest_d', kind: 'raster' },
    { id: 'badge', titleKey: 'cct_type_badge', subKey: 'cct_type_badge_d', kind: 'logo' },
    { id: 'sat_asset', titleKey: 'cct_type_sat_asset', subKey: 'cct_type_sat_asset_d', kind: 'raster' }
  ];
  global.MC_OFFICIAL_CARD_CATALOG_VERSION = '1';
  global.MC_OFFICIAL_CARD_CATALOG_ROWS = ROWS;
})(typeof self !== 'undefined' ? self : this);
