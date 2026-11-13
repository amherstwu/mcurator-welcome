/**
 * Phase 2 section visual pools (Apps Script / static HTML).
 * Keep in sync with sat-marketplace/src/visuals/sectionVisualPools.ts
 */
(function (global) {
  'use strict';

  global.MC_SECTION_VISUAL_POOLS = {
    'landing-hero': {
      componentName: 'SectionVisualScene',
      hue: 38,
      renderMode: 'component+photo',
      assets: [
        'assets/images/landing_page/mcwhe-passport-hero-comp.png',
        'assets/images/landing_page/papilio-blumei-hero.jpg',
      ],
    },
    'story-onboarding': {
      componentName: 'StoryEpisodeIllustration',
      hue: 156,
      renderMode: 'component+photo',
      assets: [
        'assets/story/story-01.webp',
        'assets/story/story-01b.webp',
        'assets/story/story-02.webp',
        'assets/story/story-02b.webp',
        'assets/story/story-03.webp',
        'assets/story/story-03b.webp',
        'assets/story/story-04.webp',
        'assets/story/story-04b.webp',
        'assets/story/story-05.webp',
        'assets/story/story-05b.webp',
        'assets/story/story-06.webp',
        'assets/story/story-06b.webp',
        'assets/story/story-07.webp',
        'assets/story/story-07b.webp',
        'assets/story/story-08.webp',
        'assets/story/story-08b.webp',
        'assets/story/story-09.webp',
        'assets/story/story-09b.webp',
        'assets/story/story-10.webp',
        'assets/story/story-10b.webp',
        'assets/story/story-11.webp',
        'assets/story/story-11b.webp',
        'assets/story/story-12.webp',
        'assets/story/story-12b.webp',
        'assets/story/story-13.webp',
        'assets/story/story-13b.webp',
        'assets/story/story-14.webp',
        'assets/story/story-14b.webp',
        'assets/story/story-15.webp',
        'assets/story/story-15b.webp',
      ],
    },
    'field-collection': {
      componentName: 'SectionVisualScene',
      hue: 128,
      renderMode: 'component+photo',
      assets: [
        'assets/images/field/field-shoot-fp-hero.jpg',
        'assets/images/field/field-observe-fp-hero.jpg',
        'assets/images/field/field-draft-fp-hero.jpg',
      ],
    },
    'specimen-prep': {
      componentName: 'SectionVisualScene',
      hue: 88,
      renderMode: 'component+photo',
      assets: [
        'assets/images/herbarium/herbarium-press-fp-hero-v2.jpg',
        'assets/images/insect/insect-pin-fp-hero.jpg',
        'assets/images/microbe/microbe-culture-fp-hero.jpg',
      ],
    },
    'framed-specimen': {
      componentName: 'SectionVisualScene',
      hue: 52,
      renderMode: 'component+photo',
      assets: [
        'assets/images/herbarium/herbarium-frame-fp-hero-v2.jpg',
        'assets/images/insect/insect-identify-fp-hero.jpg',
        'assets/images/fossil/fossil-register-fp-hero.jpg',
      ],
    },
    'label-printing': {
      componentName: 'SectionVisualScene',
      hue: 24,
      renderMode: 'component+photo',
      assets: [
        'assets/images/herbarium/herbarium-print-fp-hero-v2.jpg',
        'assets/images/insect/insect-print-fp-hero.jpg',
        'assets/images/marine/marine-publish-fp-hero.jpg',
      ],
    },
    'passport-generation': {
      componentName: 'SectionVisualScene',
      hue: 172,
      renderMode: 'component+photo',
      assets: [
        'assets/images/herbarium/herbarium-complete-fp-hero-v2.jpg',
        'assets/images/field/field-passport-fp-hero.jpg',
        'assets/images/wildlife/wildlife-passport-fp-hero.jpg',
      ],
    },
    marketplace: {
      componentName: 'SectionVisualScene',
      hue: 200,
      renderMode: 'component+photo',
      assets: [
        'assets/images/landing_page/menagerie-hero-2026.png',
        'assets/images/landing_page/spb-ui-reference-2026.png',
      ],
    },
    coverflow: {
      componentName: 'SectionVisualScene',
      hue: 140,
      renderMode: 'component+photo',
      assets: [
        'assets/images/landing_page/coverflow-museum/cf-03.png',
        'assets/images/landing_page/coverflow-museum/cf-04.png',
        'assets/images/landing_page/coverflow-museum/cf-07.png',
        'assets/images/landing_page/coverflow-museum/cf-08.png',
        'assets/images/landing_page/coverflow-museum/cf-09.png',
        'assets/images/landing_page/coverflow-museum/cf-10.png',
        'assets/images/landing_page/coverflow-museum/cf-12.png',
        'assets/images/landing_page/coverflow-museum/cf-13.png',
        'assets/images/landing_page/coverflow-museum/cf-14.png',
        'assets/images/landing_page/coverflow-museum/cf-15.png',
      ],
    },
    'earth-galaxy': {
      componentName: 'SectionVisualScene',
      hue: 196,
      renderMode: 'component+photo',
      assets: [
        'assets/images/globe-explorer/bg.jpeg',
        'assets/images/landing_page/green-world349_6182998789_o.jpg',
        'assets/images/landing_page/dorcus-nepalensis-06_6103425804_o.jpg',
      ],
    },
    'evolution-tree': {
      componentName: 'SectionVisualScene',
      hue: 220,
      renderMode: 'component',
      assets: [],
    },
    'passport-studio': {
      componentName: 'SectionVisualScene',
      hue: 168,
      renderMode: 'component+photo',
      assets: [
        'assets/images/landing_page/hero-lamproptera-curius.png',
        'assets/images/landing_page/insect-specimens_19385112536_o.jpg',
        'assets/images/landing_page/green-world70_6181655467_o.jpg',
        'assets/images/landing_page/plestiodon-elegans_5696041316_o.jpg',
      ],
    },
  };

  global.mcGetSectionAsset = function (sectionId, variant) {
    var pool = global.MC_SECTION_VISUAL_POOLS[sectionId];
    if (!pool || !pool.assets || !pool.assets.length) return '';
    var v = variant || 0;
    return pool.assets[v % pool.assets.length];
  };
})(typeof window !== 'undefined' ? window : globalThis);
