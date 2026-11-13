/**
 * Centralized local image URLs for MCurator (specimens, cards, welcome mosaic, mock DB).
 * Prefer raster photos under `assets/images/`; optional remote URLs only when
 * `MC_ALLOW_REMOTE_DEMO_IMAGES === true`. SVG data URIs in `MC_DEFAULT_DEMO_IMAGE_URLS`
 * are a last resort when the repo has no local manifest.
 *
 * Public API: `resolveAssetImage(keyOrRel, fallbackType)` — never returns empty/ UI.html / 1×1 gif;
 * `fallbackType` (default `specimen`): `specimen` | `card` | `default` | `brand` | `mark` | `logo` | `sat` | `achievement` | `museum`.
 * Also: `mcGetSpecimenCardRels_`, `mcGetSpecimenCardImageBaseUrls_`, `mcGetWelcomeMosaicImageUrls_`.
 */
(function (global) {
  'use strict';

  if (global.__MC_ASSET_RESOLVER_INSTALLED__) return;
  global.__MC_ASSET_RESOLVER_INSTALLED__ = true;

  var MC_BRAND_LOGO_REL = 'assets/brand/mcurator-logo.png';
  var MC_BRAND_MARK_GREEN_REL = 'assets/brand/mcurator-cs-mark-green-trim.png';

  function mcResolveLocalRelToPage_(rel) {
    try {
      return new URL('../' + String(rel || '').replace(/^\//, ''), location.href).href;
    } catch (e) {
      return String(rel || '');
    }
  }
  global.mcResolveLocalRelToPage_ = mcResolveLocalRelToPage_;

  function _dedupeRels(rels) {
    var out = [];
    var seen = Object.create(null);
    for (var i = 0; i < rels.length; i++) {
      var r = String(rels[i] || '')
        .trim()
        .replace(/\\/g, '/');
      if (!r || seen[r]) continue;
      seen[r] = 1;
      out.push(r);
    }
    return out;
  }

  var MC_MINIMAL_INSECT_RELS = null;

  function mcBuildMinimalInsectRels_() {
    if (typeof global.mcGetSectionAsset !== 'function') return [];
    return _dedupeRels([
      global.mcGetSectionAsset('passport-studio', 1),
      global.mcGetSectionAsset('passport-studio', 0),
      global.mcGetSectionAsset('landing-hero', 1),
      global.mcGetSectionAsset('earth-galaxy', 2),
    ]);
  }

  function mcGetMinimalInsectRels_() {
    if (!MC_MINIMAL_INSECT_RELS) MC_MINIMAL_INSECT_RELS = mcBuildMinimalInsectRels_();
    return MC_MINIMAL_INSECT_RELS;
  }

  /**
   * All resolvable project-relative paths that should be used for specimen / demo photos.
   */
  function mcGetRasterRelPaths_() {
    var acc = [];
    if (global.MC_LANDING_PAGE_IMAGE_RELS && global.MC_LANDING_PAGE_IMAGE_RELS.length) {
      for (var a = 0; a < global.MC_LANDING_PAGE_IMAGE_RELS.length; a++) {
        acc.push(global.MC_LANDING_PAGE_IMAGE_RELS[a]);
      }
    }
    if (global.MC_LOCAL_DEMO_RELPATHS && global.MC_LOCAL_DEMO_RELPATHS.length) {
      for (var b = 0; b < global.MC_LOCAL_DEMO_RELPATHS.length; b++) {
        acc.push(global.MC_LOCAL_DEMO_RELPATHS[b]);
      }
    }
    var minimal = mcGetMinimalInsectRels_();
    for (var c = 0; c < minimal.length; c++) {
      acc.push(minimal[c]);
    }
    return _dedupeRels(acc);
  }

  function _relsToAbsUrls(rels) {
    var o = [];
    for (var i = 0; i < rels.length; i++) {
      o.push(mcResolveLocalRelToPage_(rels[i]));
    }
    return o;
  }

  /**
   * Public: unified pool of local raster URLs (landing + Specimen/ + minimal fallbacks).
   */
  function mcGetUnifiedImagePoolUrls_() {
    return _relsToAbsUrls(mcGetRasterRelPaths_());
  }
  global.mcGetUnifiedImagePoolUrls_ = mcGetUnifiedImagePoolUrls_;

  function _djb2(str) {
    var h = 5381;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) + h + s.charCodeAt(i);
    }
    return h >>> 0;
  }
  global.mcStringHash32_ = function (str) {
    return _djb2(str);
  };

  function mcGetBrandLogoUrl_() {
    return mcResolveLocalRelToPage_(MC_BRAND_LOGO_REL);
  }
  function mcGetBrandMarkGreenUrl_() {
    return mcResolveLocalRelToPage_(MC_BRAND_MARK_GREEN_REL);
  }
  global.mcGetBrandLogoUrl_ = mcGetBrandLogoUrl_;
  global.mcGetCardBackImageUrl_ = mcGetBrandLogoUrl_;
  global.mcGetBrandMarkUrl_ = mcGetBrandMarkGreenUrl_;

  /** Landing assets that are not “specimen card” art (biodiversity stock, chameleon, UI refs, textures). */
  function _isExcludedSpecimenStyle_(rel) {
    var s = String(rel || '');
    return /(chameleon|plestiodon|rudis|taipei|botanical|green-world|hero-usp|spb-ui|menagerie-hero|landing\\s*page-1|reference-2026|web reference|picturepiz-hero|biodiversity-coast|forest-fieldwork|museum-curator|menagerie-hero)/i.test(
      s
    );
  }
  function _isPreferredInsectOrDrawers_(rel) {
    return /(Specimen\/|insect-specimens_|butterfly-ypthima|dorcus-nepalensis|moth-family-limacodidae|assets\/images\/insect\/|landing_page\/insect-)/i.test(
      String(rel || '')
    );
  }

  /**
   * Rasters suitable for specimen cards, wall, album, and welcome mosaic — all under `assets/`, no remotes.
   * Prefers drawers / insects; excludes off-style hero stock.
   */
  function mcGetSpecimenCardRels_() {
    var all = mcGetRasterRelPaths_();
    var out = [];
    var i;
    for (i = 0; i < all.length; i++) {
      if (_isPreferredInsectOrDrawers_(all[i]) && !_isExcludedSpecimenStyle_(all[i])) {
        out.push(all[i]);
      }
    }
    out = _dedupeRels(out);
    if (out.length) return out;
    for (i = 0; i < all.length; i++) {
      if (!_isExcludedSpecimenStyle_(all[i])) {
        out.push(all[i]);
      }
    }
    out = _dedupeRels(out);
    if (out.length) return out;
    return _dedupeRels(MC_MINIMAL_INSECT_RELS.slice());
  }
  global.mcGetSpecimenCardRels_ = mcGetSpecimenCardRels_;

  function mcGetSpecimenCardImageBaseUrls_() {
    return _relsToAbsUrls(mcGetSpecimenCardRels_());
  }
  global.mcGetSpecimenCardImageBaseUrls_ = mcGetSpecimenCardImageBaseUrls_;

  /** @deprecated Name kept for initWelcomeDemoMosaic; same as {@link mcGetSpecimenCardImageBaseUrls_}. */
  function mcGetWelcomeMosaicImageUrls_() {
    return mcGetSpecimenCardImageBaseUrls_();
  }
  global.mcGetWelcomeMosaicImageUrls_ = mcGetWelcomeMosaicImageUrls_;

  function _fallbackByType_(fallbackType, hashSeed) {
    var t = String(fallbackType == null ? 'specimen' : fallbackType)
      .trim()
      .toLowerCase();
    if (t === 'mark') {
      return mcGetBrandMarkGreenUrl_();
    }
    if (t === 'brand' || t === 'logo') {
      return mcGetBrandLogoUrl_();
    }
    var rels = mcGetSpecimenCardRels_();
    if (rels && rels.length) {
      var h = _djb2(String(hashSeed == null ? '0' : hashSeed));
      return mcResolveLocalRelToPage_(rels[h % rels.length]);
    }
    return mcGetBrandLogoUrl_();
  }

  /**
   * For specimens without a user image: pick a stable local specimen photo (same pool as card mosaic).
   */
  function mcGetFallbackSpecimenImageUrl_(specimenId) {
    var rels = mcGetSpecimenCardRels_();
    if (!rels.length) {
      return mcGetBrandLogoUrl_();
    }
    var idx = _djb2(String(specimenId || '0')) % rels.length;
    return mcResolveLocalRelToPage_(rels[idx]);
  }
  global.mcGetFallbackSpecimenImageUrl_ = mcGetFallbackSpecimenImageUrl_;

  function _looksLikeBrokenOrWrongSrc(u) {
    if (u == null) return true;
    var s = String(u).trim();
    if (!s) return true;
    if (/[.]html?(\#|\?|$)/i.test(s)) return true;
    if (/^svg\s*%\s*3[Ee]\s*$/i.test(s)) return true;
    if (/svg%3E/i.test(s) && s.indexOf('data:') !== 0) return true;
    if (/^data:\s*text\//i.test(s)) return true;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(s) && /UI\.html/i.test(s)) return true;
    if (/^data:image\/gif;base64,R0lGODlhAQABAI/i.test(s)) return true;
    return false;
  }

  /**
   * Picks user image if usable; else deterministic local specimen photo; never a blank emoji tile.
   */
  function mcResolveSpecimenDisplayImageUrl_(item) {
    var u = item && (item.imageUrl || item.primaryImageUrl || '');
    u = String(u || '').trim();
    if (u && !_looksLikeBrokenOrWrongSrc(u)) {
      return u;
    }
    return mcGetFallbackSpecimenImageUrl_(item && (item.id || item.specimenId));
  }
  global.mcResolveSpecimenDisplayImageUrl_ = mcResolveSpecimenDisplayImageUrl_;
  global.mcIsUnusableImageSrc_ = _looksLikeBrokenOrWrongSrc;

  /**
   * Main demo / seed pool: local rasters only unless remote is explicitly allowed.
   */
  function mcGetDemoImageUrlPool_() {
    var unified = mcGetUnifiedImagePoolUrls_();
    if (unified.length) {
      return unified;
    }
    if (
      global.MC_ALLOW_REMOTE_DEMO_IMAGES &&
      typeof global.MC_FLICKR_PICTUREPIZ_REMOTE !== 'undefined' &&
      global.MC_FLICKR_PICTUREPIZ_REMOTE &&
      global.MC_FLICKR_PICTUREPIZ_REMOTE.length
    ) {
      var o = [];
      for (var r = 0; r < global.MC_FLICKR_PICTUREPIZ_REMOTE.length; r++) {
        o.push(String(global.MC_FLICKR_PICTUREPIZ_REMOTE[r]));
      }
      return o;
    }
    var def = global.MC_DEFAULT_DEMO_IMAGE_URLS;
    if (def && def.length) {
      var out2 = [];
      for (var d = 0; d < def.length; d++) {
        out2.push(String(def[d]));
      }
      return out2;
    }
    return [mcGetBrandLogoUrl_()];
  }
  global.mcGetDemoImageUrlPool_ = mcGetDemoImageUrlPool_;

  /**
   * @param {string} [keyOrRel] - Asset path, `default`, `default_specimen_card`, or bare filename under Specimen/
   * @param {string} [fallbackType='specimen'] - `specimen` | `card` | `default` | `brand` | `logo` | `sat` | `achievement` | `museum`
   * @returns {string} Valid **local** app URL; never empty, never `UI.html`, no blank data URIs; remotes only if MC_ALLOW_REMOTE_DEMO_IMAGES.
   */
  function resolveAssetImage(keyOrRel, fallbackType) {
    var fbt = String(fallbackType == null ? 'specimen' : fallbackType)
      .trim()
      .toLowerCase();
    if (fbt === 'logo') fbt = 'brand';

    var k = String(keyOrRel || '').trim();
    if (!k || _looksLikeBrokenOrWrongSrc(k)) {
      if (fbt === 'brand') {
        return mcGetBrandLogoUrl_();
      }
      return _fallbackByType_(fbt, k);
    }
    if (/^https?:\/\//i.test(k)) {
      if (_looksLikeBrokenOrWrongSrc(k)) {
        return _fallbackByType_(fbt, 'bad-remote');
      }
      if (global.MC_ALLOW_REMOTE_DEMO_IMAGES) {
        return k;
      }
      return _fallbackByType_(fbt, 'remote-denied');
    }
    var rel = k.replace(/^\.\.\//, '').replace(/^\//, '');
    if (rel.indexOf('mcurator-assets/') === 0) {
      rel = 'assets/' + rel.replace(/^mcurator-assets\//, '');
    }
    if (rel.indexOf('assets/') === 0) {
      if (_isExcludedSpecimenStyle_(rel) && (fbt === 'specimen' || fbt === 'card' || fbt === 'default')) {
        return _fallbackByType_(fbt, rel);
      }
      return mcResolveLocalRelToPage_(rel);
    }
    if (/\.(jpe?g|png|webp|gif|avif)$/i.test(rel) || /Specimen\//i.test(rel)) {
      if (rel.indexOf('assets/') !== 0) {
        rel = 'assets/images/Specimen/' + rel.replace(/^.*\//, '');
      }
      return mcResolveLocalRelToPage_(rel);
    }
    if (k === 'default_specimen_card' || k === 'default') {
      var sc = mcGetSpecimenCardRels_();
      if (sc && sc.length) {
        return mcResolveLocalRelToPage_(sc[0]);
      }
    }
    return _fallbackByType_(fbt, k);
  }
  global.resolveAssetImage = resolveAssetImage;
})(typeof self !== 'undefined' ? self : this);
