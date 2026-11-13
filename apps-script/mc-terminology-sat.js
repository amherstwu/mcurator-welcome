/**
 * MCurator — central SAT (Scientific Asset) product terminology.
 * Prefer SAT in UI copy; avoid speculative or collectible-crypto framing in new text.
 * Loaded in UI.html before app bootstrap.
 */
(function (global) {
  'use strict';
  var MC_SAT = {
    productName: 'MCurator',
    token: 'SAT',
    /** Full name when space allows */
    fullName: 'Scientific Asset (metadata & provenance)',
    /** One-line for market / legal strip */
    marketName: 'SAT Scientific Asset Marketplace',
    /** Shown in disclaimers and help */
    disclaimer:
      'Educational and demonstration use only. Not financial or investment advice. Scientific metadata, verification, and provenance come first.',
    /** Avoid speculative framing */
    valueNote: 'Educational and collection status — not a measure of market or financial value by default.',
    /** Product uses SAT (Scientific Asset) identity, not non-fungible “collectible investment” framing */
    notNft: 'The platform does not use NFT as user-facing terminology; it presents SAT: verifiable scientific-asset records linked to specimen metadata and provenance.',
    useSatVocabulary: true
  };
  global.MC_SAT = MC_SAT;
  try {
    global.MC_TERMINOLOGY = MC_SAT;
  } catch (e) {
    void 0;
  }
})(typeof self !== 'undefined' ? self : this);
