/**
 * Member avatar portraits under assets/Proflie images/ (profile-image-001 … 107.png).
 * Loaded after mc-asset-resolver.js; extended catalog in mc-profile-avatar-catalog.js.
 */
(function (global) {
  'use strict';

  if (global.__MC_PROFILE_AVATARS_INSTALLED__) return;
  global.__MC_PROFILE_AVATARS_INSTALLED__ = true;

  var MC_PROFILE_AVATAR_DIR = 'assets/Proflie images/';

  /** Core achievement avatars (001–010) */
  var MC_PROFILE_AVATAR_IMAGE_RELS = {
    av_default: MC_PROFILE_AVATAR_DIR + 'profile-image-001.png',
    av_field_recorder: MC_PROFILE_AVATAR_DIR + 'profile-image-002.png',
    av_gps_hunter: MC_PROFILE_AVATAR_DIR + 'profile-image-003.png',
    av_photo_restore: MC_PROFILE_AVATAR_DIR + 'profile-image-004.png',
    av_taxonomy: MC_PROFILE_AVATAR_DIR + 'profile-image-005.png',
    av_museum: MC_PROFILE_AVATAR_DIR + 'profile-image-006.png',
    av_checkin: MC_PROFILE_AVATAR_DIR + 'profile-image-007.png',
    av_archive: MC_PROFILE_AVATAR_DIR + 'profile-image-008.png',
    av_curator: MC_PROFILE_AVATAR_DIR + 'profile-image-009.png',
    av_grand: MC_PROFILE_AVATAR_DIR + 'profile-image-010.png'
  };

  function _normRel(rel) {
    return String(rel || '')
      .trim()
      .replace(/\\/g, '/')
      .replace(/^\.\.\//, '');
  }

  function _relFromPortraitId(id) {
    var m = String(id || '').match(/^av_portrait_(\d{3})$/);
    if (!m) return '';
    return MC_PROFILE_AVATAR_DIR + 'profile-image-' + m[1] + '.png';
  }

  /**
   * @param {{ id?: string, imageRel?: string }|string} adOrId
   * @returns {string} Absolute page URL for local preview, or relative fallback.
   */
  function mcResolveAvatarImageUrl_(adOrId) {
    var rel = '';
    if (adOrId && typeof adOrId === 'object') {
      rel = _normRel(adOrId.imageRel || MC_PROFILE_AVATAR_IMAGE_RELS[adOrId.id] || _relFromPortraitId(adOrId.id));
    } else {
      var id = String(adOrId || '');
      rel = _normRel(MC_PROFILE_AVATAR_IMAGE_RELS[id] || _relFromPortraitId(id) || id);
    }
    if (!rel) return '';
    if (typeof global.mcResolveLocalRelToPage_ === 'function') {
      return global.mcResolveLocalRelToPage_(rel);
    }
    return '../' + rel;
  }

  global.MC_PROFILE_AVATAR_IMAGE_RELS = MC_PROFILE_AVATAR_IMAGE_RELS;
  global.mcResolveAvatarImageUrl_ = mcResolveAvatarImageUrl_;
})(typeof self !== 'undefined' ? self : this);
