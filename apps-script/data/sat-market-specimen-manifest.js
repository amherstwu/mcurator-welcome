/**
 * SAT Market V2 — specimen visual library (local assets under assets/images/Specimen).
 * Maps listings to thumb/detail SVGs by scientific category; no raw filenames in UI.
 */
(function (global) {
  'use strict';

  var BASE = '../assets/images/Specimen/';

  global.MCSAT_SPECIMEN_IMAGES = {
    thumbs: {
      insect: BASE + 'thumbs/insect.svg',
      plant: BASE + 'thumbs/plant.svg',
      marine: BASE + 'thumbs/marine.svg',
      fossil: BASE + 'thumbs/fossil.svg',
      neutral: BASE + 'thumbs/neutral.svg',
    },
    detail: {
      insect: BASE + 'detail/insect.svg',
      plant: BASE + 'detail/plant.svg',
      marine: BASE + 'detail/marine.svg',
      fossil: BASE + 'detail/fossil.svg',
      neutral: BASE + 'detail/neutral.svg',
    },
  };

  /**
   * @returns {'insect'|'plant'|'marine'|'fossil'|'neutral'}
   */
  global.MCSAT_specimenVisualKind = function (category, displayCategory, assetType, title) {
    var b = String(category + ' ' + (displayCategory || '') + ' ' + (assetType || '') + ' ' + (title || '')).toLowerCase();
    if (/fossil|trilobit|三葉|paleo|palaeo|knightia|foraminifera/.test(b)) return 'fossil';
    if (/marine|mollus|shell|fish|turbo|nerita|cone|jar|rattail|macrouridae|morpho.*amazon/.test(b)) return 'marine';
    if (/plant|botanical|ginkgo|ficus|fern|fungi|seed|herbarium|cyathea|amanita/.test(b)) return 'plant';
    if (/insect|beetle|lepid|coleoptera|butterfly|ant|morpho|bumble|moth|dragon|lucanid|scarab|stag|passer|papilio|saturnia|plusiotis|cyclommatus|dorcus|aegus|bullet|paraponera|ixorida/.test(b)) return 'insect';
    return 'neutral';
  };

  /** @returns {{ thumb: string, detail: string, kind: string }} */
  global.MCSAT_specimenUrlsForAsset = function (asset) {
    if (asset && asset.scientificName && typeof global.MC_SAT_findHeroPhoto === 'function') {
      var hero = global.MC_SAT_findHeroPhoto(asset.scientificName);
      if (hero) {
        var kind = global.MCSAT_specimenVisualKind(
          asset.category,
          asset.displayCategory,
          asset.assetType,
          asset.title
        );
        return { kind: kind, thumb: hero, detail: hero };
      }
    }
    var T = global.MCSAT_SPECIMEN_IMAGES;
    if (!T) return { thumb: '', detail: '', kind: 'neutral' };
    var kind = global.MCSAT_specimenVisualKind(asset.category, asset.displayCategory, asset.assetType, asset.title);
    return {
      kind: kind,
      thumb: T.thumbs[kind] || T.thumbs.neutral,
      detail: T.detail[kind] || T.detail.neutral,
    };
  };

  global.MCSAT_specimenUrlsForCollectionKey = function (collectionKey) {
    var k = 'neutral';
    var ck = String(collectionKey || '').toLowerCase();
    if (/beetle|coleoptera|insect|lepid|educational license|教學/.test(ck)) k = 'insect';
    else if (/fossil|化石|plate/.test(ck)) k = 'fossil';
    else if (/botanical|plant|植物/.test(ck)) k = 'plant';
    else if (/marine|海洋|shell|mollus/.test(ck)) k = 'marine';
    var T = global.MCSAT_SPECIMEN_IMAGES;
    if (!T) return { thumb: '', detail: '', kind: k };
    return { kind: k, thumb: T.thumbs[k] || T.thumbs.neutral, detail: T.detail[k] || T.detail.neutral };
  };
})(typeof window !== 'undefined' ? window : this);
