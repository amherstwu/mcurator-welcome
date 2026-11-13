/**
 * MCurator — multilingual (zh-TW / en-US / en-GB / en-001 / ja-JP / de-DE) helpers for standalone JS modules.
 * Rule: explicit user choice (localStorage / state / MC_LOCALE) always wins.
 * Legacy stored `en` migrates to en-001.
 */
(function (global) {
  'use strict';

  var MC_USER_LANG_KEY =
    (global.MC_USER_LANG_STORAGE_KEY && String(global.MC_USER_LANG_STORAGE_KEY)) || 'MC_USER_LANG';
  /** Unknown / unsupported browser locales resolve to International English. */
  var DEFAULT_LANG = 'en-001';
  var ENGLISH_LOCALES = { 'en-US': 1, 'en-GB': 1, 'en-001': 1 };

  function normalizeLang(lang) {
    var s = String(lang == null ? '' : lang).trim();
    if (!s) return '';
    var low = s.toLowerCase();
    if (low === 'zh' || low.indexOf('zh-') === 0 || low.indexOf('zh_') === 0) return 'zh-TW';
    if (low === 'en' || low === 'en-001') return 'en-001';
    if (low === 'en-us' || low === 'en_us') return 'en-US';
    if (low === 'en-gb' || low === 'en_gb') return 'en-GB';
    if (low.indexOf('en-') === 0 || low.indexOf('en_') === 0) return 'en-001';
    if (low === 'ja' || low.indexOf('ja-') === 0 || low.indexOf('ja_') === 0) return 'ja-JP';
    if (low === 'de' || low.indexOf('de-') === 0 || low.indexOf('de_') === 0) return 'de-DE';
    return s;
  }

  function isSupportedLang(lang) {
    return (
      lang === 'zh-TW' ||
      lang === 'ja-JP' ||
      lang === 'de-DE' ||
      lang === 'en-US' ||
      lang === 'en-GB' ||
      lang === 'en-001'
    );
  }

  function mcIsEnglishLocale() {
    return !!ENGLISH_LOCALES[mcGetLang()];
  }

  function getEn001_(pair) {
    if (!pair || typeof pair !== 'object') return '';
    if (pair.en001 != null && String(pair.en001).trim()) return String(pair.en001).trim();
    return pair.en != null ? String(pair.en).trim() : '';
  }

  function getEnUS_(pair) {
    if (pair.enUS != null && String(pair.enUS).trim()) return String(pair.enUS).trim();
    var base = getEn001_(pair);
    if (global.MCEnglishSpelling && global.MCEnglishSpelling.applyAmericanSpelling) {
      return global.MCEnglishSpelling.applyAmericanSpelling(base) || base;
    }
    return base;
  }

  function getEnGB_(pair) {
    if (pair.enGB != null && String(pair.enGB).trim()) return String(pair.enGB).trim();
    var base = getEn001_(pair);
    if (global.MCEnglishSpelling && global.MCEnglishSpelling.applyBritishSpelling) {
      return global.MCEnglishSpelling.applyBritishSpelling(base) || base;
    }
    return base;
  }

  /** Stored or in-memory UI language only — never overrides zh-TW with file:// / preview heuristics. */
  function mcGetStoredUiLang_() {
    try {
      if (global.localStorage) {
        var stored = global.localStorage.getItem(MC_USER_LANG_KEY);
        if (stored) {
          stored = normalizeLang(stored);
          if (isSupportedLang(stored)) {
            try {
              if (global.localStorage.getItem(MC_USER_LANG_KEY) !== stored) {
                global.localStorage.setItem(MC_USER_LANG_KEY, stored);
              }
            } catch (eMigr) {
              void 0;
            }
            return stored;
          }
        }
      }
    } catch (e0) {
      void 0;
    }
    try {
      if (global.state && global.state.lang) {
        var fromState = normalizeLang(global.state.lang);
        if (fromState === 'en') fromState = 'en-001';
        if (isSupportedLang(fromState)) return fromState;
      }
    } catch (e1) {
      void 0;
    }
    try {
      if (global.MC_LOCALE) {
        var fromMc = normalizeLang(global.MC_LOCALE);
        if (fromMc === 'en') fromMc = 'en-001';
        if (isSupportedLang(fromMc)) return fromMc;
      }
    } catch (e2) {
      void 0;
    }
    return '';
  }

  /** Default when user has not chosen a language yet (URL ?lang= handled in UI.html). */
  function mcGetImplicitDefaultLang_() {
    try {
      var q = new URLSearchParams(String((global.location && global.location.search) || ''));
      var langQ = normalizeLang(q.get('lang'));
      if (isSupportedLang(langQ)) return langQ;
    } catch (eQ) {
      void 0;
    }
    try {
      if (/^file:/i.test(String((global.location && global.location.protocol) || ''))) return 'en-001';
    } catch (eFile) {
      void 0;
    }
    try {
      if (global.MC_IS_LOCAL_PREVIEW) return 'en-001';
    } catch (eLp) {
      void 0;
    }
    try {
      var navLang = String(global.navigator && (global.navigator.language || global.navigator.userLanguage) || '');
      if (/^ja/i.test(navLang)) return 'ja-JP';
      if (/^de/i.test(navLang)) return 'de-DE';
      if (/^en-gb/i.test(navLang)) return 'en-GB';
      if (/^en-us/i.test(navLang)) return 'en-US';
      if (/^en/i.test(navLang)) return 'en-001';
    } catch (eNav) {
      void 0;
    }
    return DEFAULT_LANG;
  }

  function mcGetLang() {
    var stored = mcGetStoredUiLang_();
    if (stored) return stored;
    return mcGetImplicitDefaultLang_();
  }

  function mcIsEn() {
    return mcIsEnglishLocale();
  }

  function mcIsZhTW() {
    return mcGetLang() === 'zh-TW';
  }

  function mcIsJaJP() {
    return mcGetLang() === 'ja-JP';
  }

  function mcIsDeDE() {
    return mcGetLang() === 'de-DE';
  }

  function mcIsEnUS() {
    return mcGetLang() === 'en-US';
  }

  function mcIsEnGB() {
    return mcGetLang() === 'en-GB';
  }

  function mcIsEn001() {
    return mcGetLang() === 'en-001';
  }

  function mcResolveLocaleString_(pair) {
    if (!pair || typeof pair !== 'object') return '';
    var zh = pair.zh != null ? String(pair.zh).trim() : '';
    var ja = pair.ja != null ? String(pair.ja).trim() : '';
    var de = pair.de != null ? String(pair.de).trim() : '';
    var en001 = getEn001_(pair);
    var lang = mcGetLang();
    if (lang === 'de-DE') return de || en001;
    if (lang === 'ja-JP') return ja || en001;
    if (lang === 'en-US') return getEnUS_(pair) || en001;
    if (lang === 'en-GB') return getEnGB_(pair) || en001;
    if (lang === 'en-001') return en001;
    return zh || en001;
  }

  /** pair = { zh: '...', en: '...', ja?: '...', de?: '...' } — locale fallback via mcResolveLocaleString_. */
  function mcPick(pair) {
    return mcResolveLocaleString_(pair);
  }

  function mcPickMany(pairs) {
    if (!Array.isArray(pairs)) return [];
    return pairs.map(function (p) {
      return mcPick(p);
    });
  }

  /** copy[key] = { zh, en } — no cross-locale fallback to the other language. */
  function mcModuleT(copy, k, fb) {
    var bag = copy || {};
    var p = bag[k];
    if (p && typeof p === 'object') {
      var picked = mcPick(p);
      if (picked) return picked;
    }
    return fb != null ? fb : k;
  }

  var MC_GEO_DATE_EXACT_EN = {
    '\u767d\u580a\u7d00\u65e9\u671f \u00b7 \u5730\u8cea\u5fa9\u539f': 'Early Cretaceous \u00b7 geological reconstruction',
    '\u767d\u580a\u7d00\u665a\u671f \u00b7 \u5730\u8cea\u5fa9\u539f': 'Late Cretaceous \u00b7 geological reconstruction',
    '\u5bd2\u6b66\u7d00 \u00b7 \u5316\u77f3\u5fa9\u539f': 'Cambrian \u00b7 fossil reconstruction',
    '\u5730\u8cea\u6a19\u672c \u00b7 \u7121\u63a1\u96c6\u65e5': 'Geological specimen \u00b7 no collection date',
    '\u745e\u5178 \u00b7 \u5967\u5fb7\u7dad\u65af\u671f': 'Sweden \u00b7 Ordovician',
    '1936 \u00b7 \u6700\u5f8c\u7d00\u9304': '1936 \u00b7 last record'
  };

  var MC_GEO_DATE_PHRASE_EN = {
    '\u767d\u580a\u7d00\u65e9\u671f': 'Early Cretaceous',
    '\u767d\u580a\u7d00\u665a\u671f': 'Late Cretaceous',
    '\u767d\u5805\u7d00\u65e9\u671f': 'Early Cretaceous',
    '\u767d\u5805\u7d00\u665a\u671f': 'Late Cretaceous',
    '\u767d\u57a9\u7d00\u65e9\u671f': 'Early Cretaceous',
    '\u767d\u57a9\u7d00\u665a\u671f': 'Late Cretaceous',
    '\u4e0a\u4e45\u7d00\u83ab\u91cc\u68ee': 'Upper Jurassic \u00b7 Morrison',
    '\u4e09\u7586\u7d00\u65e9\u671f': 'Early Triassic',
    '\u4e09\u7586\u7d00\u4e2d\u671f': 'Middle Triassic',
    '\u4e09\u7586\u7d00\u665a\u671f': 'Late Triassic',
    '\u4e09\u73cd\u7d00\u665a\u671f': 'Late Triassic',
    '\u6ce5\u76c6\u7d00\u665a\u671f': 'Late Devonian',
    '\u6ce5\u76c6\u7d00\u4e2d\u671f': 'Middle Devonian',
    '\u5967\u9676\u7d00\u4e2d\u671f': 'Middle Ordovician',
    '\u65b0\u8fd1\u7d00\u65e9\u4e2d\u671f': 'Early\u2013Middle Neogene',
    '\u65b0\u8fd1\u7d00\u665a\u671f': 'Late Neogene',
    '\u77f3\u70ad\u7d00\u65e9\u671f': 'Early Carboniferous',
    '\u57c3\u8fea\u5361\u7d00': 'Ediacaran',
    '\u5730\u8cea\u6a19\u672c': 'Geological specimen',
    '\u5730\u8cea\u5fa9\u539f': 'geological reconstruction',
    '\u5316\u77f3\u5fa9\u539f': 'fossil reconstruction',
    '\u7121\u63a1\u96c6\u65e5': 'no collection date',
    '\u6700\u5f8c\u7d00\u9304': 'last record',
    '\u5967\u5fb7\u7dad\u65af\u671f': 'Ordovician',
    '\u5967\u9676\u7d00\u665a\u671f': 'Late Ordovician',
    '\u65b0\u5143\u53e4\u4ee3': 'Neoproterozoic',
    '\u4e2d\u5143\u53e4\u4ee3': 'Mesoproterozoic',
    '\u5967\u9676\u7d00': 'Ordovician',
    '\u5bd2\u6b66\u7d00': 'Cambrian',
    '\u6ce5\u76c6\u7d00': 'Devonian',
    '\u77f3\u70ad\u7d00': 'Carboniferous',
    '\u4e09\u73cd\u7d00': 'Triassic',
    '\u4e09\u7586\u7d00': 'Triassic',
    '\u767d\u580a\u7d00': 'Cretaceous',
    '\u767d\u5805\u7d00': 'Cretaceous',
    '\u767d\u57a9\u7d00': 'Cretaceous',
    '\u65b0\u8fd1\u7d00': 'Neogene',
    '\u5168\u65b0\u4e16': 'Holocene',
    '\u57c3\u8fea\u5361\u7d00': 'Ediacaran',
    '\u5fd7\u7559\u7d00': 'Silurian',
    '\u4e8c\u7586\u7d00': 'Permian',
    '\u4e8c\u758a\u7d00': 'Permian',
    '\u77f3\u70ad\u7d00': 'Carboniferous',
    '\u77f3\u70ad\u7eaa': 'Carboniferous',
    '\u5bd2\u6b66\u7eaa': 'Cambrian',
    '\u5967\u9676\u7eaa': 'Ordovician',
    '\u4e09\u7586\u7eaa': 'Triassic',
    '\u4e09\u7586\u7d00': 'Triassic',
    '\u767d\u580a\u7eaa': 'Cretaceous',
    '\u767d\u57a9\u7eaa': 'Cretaceous',
    '\u5730\u8d28\u6a19\u672c': 'Geological specimen',
    '\u65e9\u4e2d\u671f': 'Early\u2013Middle',
    '\u4e0a\u4e45\u7d00': 'Upper Jurassic',
    '\u83ab\u91cc\u68ee': 'Morrison',
    '\u65e9\u671f': 'Early',
    '\u4e2d\u671f': 'Middle',
    '\u665a\u671f': 'Late',
    '\u4e09\u758a\u7d00\u65e9\u671f': 'Early Triassic',
    '\u4e09\u758a\u7d00\u4e2d\u671f': 'Middle Triassic',
    '\u4e09\u758a\u7d00\u665a\u671f': 'Late Triassic',
    '\u4e09\u758a\u7d00': 'Triassic',
    '\u4f8f\u7f85\u7d00\u665a\u671f\u83ab\u91cc\u68ee': 'Late Jurassic Morrison',
    '\u4f8f\u7f85\u7d00\u65e9\u671f': 'Early Jurassic',
    '\u4f8f\u7f85\u7d00\u4e2d\u671f': 'Middle Jurassic',
    '\u4f8f\u7f85\u7d00\u665a\u671f': 'Late Jurassic',
    '\u4f8f\u7f85\u7d00': 'Jurassic',
    '\u6ce5\u76c6\u7d00\u65e9\u671f': 'Early Devonian',
    '\u4e2d\u65b0\u4e16\u65e9\u4e2d\u671f': 'Early\u2013Middle Miocene',
    '\u4e2d\u65b0\u4e16\u665a\u671f': 'Late Miocene',
    '\u4e2d\u65b0\u4e16': 'Miocene',
    '\u66f4\u65b0\u4e16\u665a\u671f': 'Late Pleistocene',
    '\u66f4\u65b0\u4e16': 'Pleistocene',
    '\u77f3\u70ad\u7d00\u665a\u671f': 'Late Carboniferous'
  };

  function mcTranslateGeologicalDatePart_(part) {
    if (!part) return part;
    if (MC_GEO_DATE_EXACT_EN[part]) return MC_GEO_DATE_EXACT_EN[part];
    if (!/[\u4e00-\u9fff]/.test(part)) return part;
    var out = part;
    var keys = Object.keys(MC_GEO_DATE_PHRASE_EN).sort(function (a, b) {
      return b.length - a.length;
    });
    keys.forEach(function (key) {
      if (out.indexOf(key) >= 0) out = out.split(key).join(MC_GEO_DATE_PHRASE_EN[key]);
    });
    out = out.replace(/\s{2,}/g, ' ').trim();
    if (/[\u4e00-\u9fff]/.test(out)) return part;
    return out || part;
  }

  var MC_GEO_FROM_EN_JA = {
    'Early\u2013Middle Miocene': '\u524d\u671f\u2013\u4e2d\u671f\u4e2d\u65b0\u4e16',
    'Late Jurassic Morrison': '\u5f8c\u671f\u30b8\u30e5\u30e9\u7d00\u30e2\u30ea\u30bd\u30f3',
    'Early\u2013Middle Neogene': '\u524d\u671f\u2013\u4e2d\u671f\u65b0\u7b2c\u4e09\u7d00',
    'Late Ordovician': '\u5f8c\u671f\u30aa\u30eb\u30c9\u30d3\u30b9\u7d00',
    'Neoproterozoic': '\u65b0\u539f\u751f\u4ee3',
    'Mesoproterozoic': '\u4e2d\u539f\u751f\u4ee3',
    'Middle Ordovician': '\u4e2d\u671f\u30aa\u30eb\u30c9\u30d3\u30b9\u7d00',
    'Early Carboniferous': '\u524d\u671f\u77f3\u70ad\u7d00',
    'Late Carboniferous': '\u5f8c\u671f\u77f3\u70ad\u7d00',
    'Early Cretaceous': '\u524d\u671f\u767d\u4e9c\u7d00',
    'Late Cretaceous': '\u5f8c\u671f\u767d\u4e9c\u7d00',
    'Early Devonian': '\u524d\u671f\u30c7\u30dc\u30f3\u7d00',
    'Middle Devonian': '\u4e2d\u671f\u30c7\u30dc\u30f3\u7d00',
    'Late Devonian': '\u5f8c\u671f\u30c7\u30dc\u30f3\u7d00',
    'Early Triassic': '\u524d\u671f\u4e09\u7573\u7d00',
    'Middle Triassic': '\u4e2d\u671f\u4e09\u7573\u7d00',
    'Late Triassic': '\u5f8c\u671f\u4e09\u7573\u7d00',
    'Early Jurassic': '\u524d\u671f\u30b8\u30e5\u30e9\u7d00',
    'Middle Jurassic': '\u4e2d\u671f\u30b8\u30e5\u30e9\u7d00',
    'Late Jurassic': '\u5f8c\u671f\u30b8\u30e5\u30e9\u7d00',
    'Late Pleistocene': '\u5f8c\u671f\u66f4\u65b0\u4e16',
    'Late Neogene': '\u5f8c\u671f\u65b0\u7b2c\u4e09\u7d00',
    'Late Miocene': '\u5f8c\u671f\u4e2d\u65b0\u4e16',
    'Carboniferous': '\u77f3\u70ad\u7d00',
    'Cretaceous': '\u767d\u4e9c\u7d00',
    'Ordovician': '\u30aa\u30eb\u30c9\u30d3\u30b9\u7d00',
    'Pleistocene': '\u66f4\u65b0\u4e16',
    'Devonian': '\u30c7\u30dc\u30f3\u7d00',
    'Cambrian': '\u30ab\u30f3\u30d6\u30ea\u30a2\u7d00',
    'Triassic': '\u4e09\u7573\u7d00',
    'Jurassic': '\u30b8\u30e5\u30e9\u7d00',
    'Neogene': '\u65b0\u7b2c\u4e09\u7d00',
    'Holocene': '\u5b8c\u65b0\u4e16',
    'Miocene': '\u4e2d\u65b0\u4e16',
    'Ediacaran': '\u30a8\u30c7\u30a3\u30a2\u30ab\u30e9\u7d00',
    'Permian': '\u30da\u30eb\u30e0\u7d00',
    'Silurian': '\u30b7\u30eb\u30eb\u7d00'
  };

  var MC_GEO_FROM_EN_DE = {
    'Early\u2013Middle Miocene': 'Fr\u00fches\u2013Mittleres Mioz\u00e4n',
    'Late Jurassic Morrison': 'Sp\u00e4ter Jura, Morrison',
    'Early\u2013Middle Neogene': 'Fr\u00fches\u2013Mittleres Neogen',
    'Late Ordovician': 'Sp\u00e4tes Ordovizium',
    'Neoproterozoic': 'Neoproterozoikum',
    'Mesoproterozoic': 'Mesoproterozoikum',
    'Middle Ordovician': 'Mittleres Ordovizium',
    'Early Carboniferous': 'Fr\u00fches Karbon',
    'Late Carboniferous': 'Sp\u00e4tes Karbon',
    'Early Cretaceous': 'Fr\u00fche Kreide',
    'Late Cretaceous': 'Sp\u00e4te Kreide',
    'Early Devonian': 'Fr\u00fches Devon',
    'Middle Devonian': 'Mittleres Devon',
    'Late Devonian': 'Sp\u00e4tes Devon',
    'Early Triassic': 'Fr\u00fche Trias',
    'Middle Triassic': 'Mittlere Trias',
    'Late Triassic': 'Sp\u00e4te Trias',
    'Early Jurassic': 'Fr\u00fcher Jura',
    'Middle Jurassic': 'Mittlerer Jura',
    'Late Jurassic': 'Sp\u00e4ter Jura',
    'Late Pleistocene': 'Sp\u00e4tes Pleistoz\u00e4n',
    'Late Neogene': 'Sp\u00e4tes Neogen',
    'Late Miocene': 'Sp\u00e4tes Mioz\u00e4n',
    'Carboniferous': 'Karbon',
    'Cretaceous': 'Kreide',
    'Ordovician': 'Ordovizium',
    'Pleistocene': 'Pleistoz\u00e4n',
    'Devonian': 'Devon',
    'Cambrian': 'Kambrium',
    'Triassic': 'Trias',
    'Jurassic': 'Jura',
    'Neogene': 'Neogen',
    'Holocene': 'Holoz\u00e4n',
    'Miocene': 'Mioz\u00e4n',
    'Ediacaran': 'Ediacarium',
    'Permian': 'Perm',
    'Silurian': 'Silur'
  };

  function mcMapGeoFromEnglish_(en, table) {
    var out = en;
    var keys = Object.keys(table).sort(function (a, b) { return b.length - a.length; });
    keys.forEach(function (key) {
      if (out.indexOf(key) >= 0) out = out.split(key).join(table[key]);
    });
    return out;
  }

  /** Translate zh-TW geological dates for English, Japanese, and German. */
  function mcTranslateGeologicalDate(val) {
    if (val == null || val === '' || val === '\u2014') return val || '\u2014';
    if (typeof mcIsZhTW === 'function' && mcIsZhTW()) return String(val);
    var s = String(val).trim();
    var en = s;
    if (MC_GEO_DATE_EXACT_EN[s]) en = MC_GEO_DATE_EXACT_EN[s];
    else if (/[\u4e00-\u9fff]/.test(s)) {
      if (s.indexOf('\u00b7') >= 0 || s.indexOf('\u30fb') >= 0) {
        en = s.split(/[\u00b7\u30fb]/).map(function (part) {
          return mcTranslateGeologicalDatePart_(part.trim());
        }).join(' \u00b7 ');
      } else {
        en = mcTranslateGeologicalDatePart_(s);
      }
    }
    if (typeof mcIsJaJP === 'function' && mcIsJaJP()) return mcMapGeoFromEnglish_(en, MC_GEO_FROM_EN_JA);
    if (typeof mcIsDeDE === 'function' && mcIsDeDE()) return mcMapGeoFromEnglish_(en, MC_GEO_FROM_EN_DE);
    return en;
  }

  function mcNormProviderTag_(language) {
    return String(language || '')
      .trim()
      .toLowerCase()
      .replace(/_/g, '-');
  }

  function mcVernacularBucket_(language, requested) {
    var tag = mcNormProviderTag_(language);
    if (!tag || !requested) return '';
    if (requested === 'ja-JP') return tag === 'ja' || tag === 'jpn' || tag === 'ja-jp' ? 'exact' : '';
    if (requested === 'de-DE') return tag === 'de' || tag === 'deu' || tag === 'de-de' ? 'exact' : '';
    if (requested === 'zh-TW') return tag === 'zh-tw' || tag === 'zh-hant' || tag === 'zh-hant-tw' ? 'exact' : '';
    if (requested === 'en-US') {
      if (tag === 'en-us') return 'exact';
      if (tag === 'en' || tag === 'eng' || tag === 'en-001') return 'same-language';
      return '';
    }
    if (requested === 'en-GB') {
      if (tag === 'en-gb') return 'exact';
      if (tag === 'en' || tag === 'eng' || tag === 'en-001') return 'same-language';
      return '';
    }
    if (requested === 'en-001') return tag === 'en' || tag === 'eng' || tag === 'en-001' ? 'exact' : '';
    return '';
  }

  function mcRankVernacular_(rows) {
    return rows
      .map(function (row, index) {
        return { row: row, index: index };
      })
      .sort(function (a, b) {
        var pref = (b.row.preferred === true ? 1 : 0) - (a.row.preferred === true ? 1 : 0);
        if (pref) return pref;
        var aMark = /[（(]/.test(a.row.name) ? 0 : 1;
        var bMark = /[（(]/.test(b.row.name) ? 0 : 1;
        if (bMark !== aMark) return bMark - aMark;
        if (a.row.name < b.row.name) return -1;
        if (a.row.name > b.row.name) return 1;
        return a.index - b.index;
      })
      .map(function (item) {
        return item.row;
      });
  }

  function mcSelectVernacular(candidates, requestedLocale, scientificName) {
    var requested = normalizeLang(requestedLocale);
    if (!isSupportedLang(requested)) requested = 'en-001';
    var scientific = String(scientificName || '').trim();
    var usable = [];
    (candidates || []).forEach(function (row) {
      if (!row) return;
      var name = String(row.name || row.vernacularName || '').trim();
      var language = String(row.language || '').trim();
      if (!name || !language) return;
      usable.push({ name: name, language: language, preferred: row.preferred === true, source: row.source || '' });
    });
    var exact = mcRankVernacular_(
      usable.filter(function (row) {
        return mcVernacularBucket_(row.language, requested) === 'exact';
      })
    );
    var same = mcRankVernacular_(
      usable.filter(function (row) {
        return mcVernacularBucket_(row.language, requested) === 'same-language';
      })
    );
    var chosen = exact[0] || same[0];
    if (!chosen) {
      return {
        requestedLocale: requested,
        resourceLocale: requested,
        vernacularLocale: '',
        displayName: scientific,
        usedScientificName: true,
        reason: 'scientific'
      };
    }
    return {
      requestedLocale: requested,
      resourceLocale: requested,
      vernacularLocale: chosen.language,
      displayName: chosen.name,
      usedScientificName: false,
      reason: exact[0] === chosen ? 'language-match' : 'same-language'
    };
  }

  function mcCandidatesFromRecord_(record) {
    record = record || {};
    var out = [];
    var localized = record.localizedNames || {};
    Object.keys(localized).forEach(function (key) {
      var value = String(localized[key] || '').trim();
      if (value) out.push({ name: value, language: key });
    });
    if (record.commonNameJa) out.push({ name: String(record.commonNameJa), language: 'ja-JP' });
    if (record.commonNameDe) out.push({ name: String(record.commonNameDe), language: 'de-DE' });
    if (record.commonNameZh) out.push({ name: String(record.commonNameZh), language: 'zh-TW' });
    if (record.commonNameEn) out.push({ name: String(record.commonNameEn), language: 'en' });
    return out;
  }

  function mcLocalizedCommonName(record, locale) {
    record = record || {};
    return mcSelectVernacular(mcCandidatesFromRecord_(record), locale || mcGetLang(), record.scientificName || '').displayName;
  }

  function mcLocalizedCommonNameForUi(record) {
    return mcLocalizedCommonName(record, mcGetLang());
  }

  function mcLocalizedNameUsedFallback(record, locale) {
    record = record || {};
    return mcSelectVernacular(mcCandidatesFromRecord_(record), locale || mcGetLang(), record.scientificName || '').usedScientificName;
  }

  function mcDomainNameFallbackNotice() {
    return mcPick({
      zh: '\u6b64\u8a9e\u8a00\u6c92\u6709\u5df2\u6838\u5c0d\u7684\u4fd7\u540d\uff0c\u56e0\u6b64\u986f\u793a\u5b78\u540d\u3002',
      en: 'No checked common name is available for this language. The scientific name is shown.',
      ja: '\u3053\u306e\u8a00\u8a9e\u306e\u78ba\u8a8d\u6e08\u307f\u4e00\u822c\u540d\u304c\u306a\u3044\u305f\u3081\u3001\u5b66\u540d\u3092\u8868\u793a\u3057\u3066\u3044\u307e\u3059\u3002',
      de: 'F\u00fcr diese Sprache liegt kein gepr\u00fcfter Trivialname vor. Angezeigt wird der wissenschaftliche Name.'
    });
  }

  function mcPickGbifVernacularSlots(rows) {
    var slots = { en: '', zh: '', ja: '', de: '', any: '' };
    function take(locale, field) {
      var picked = mcSelectVernacular(rows, locale, '');
      if (!picked.usedScientificName && !slots[field]) slots[field] = String(picked.displayName || '').slice(0, 120);
    }
    take('en-001', 'en');
    take('zh-TW', 'zh');
    take('ja-JP', 'ja');
    take('de-DE', 'de');
    return slots;
  }

  global.mcGetLang = mcGetLang;
  global.mcIsEn = mcIsEn;
  global.mcIsEnglishLocale = mcIsEnglishLocale;
  global.mcIsEnUS = mcIsEnUS;
  global.mcIsEnGB = mcIsEnGB;
  global.mcIsEn001 = mcIsEn001;
  global.mcIsZhTW = mcIsZhTW;
  global.mcIsJaJP = mcIsJaJP;
  global.mcIsDeDE = mcIsDeDE;
  global.mcPick = mcPick;
  global.mcPickMany = mcPickMany;
  global.mcModuleT = mcModuleT;
  global.mcTranslateGeologicalDate = mcTranslateGeologicalDate;
  global.mcSelectVernacular = mcSelectVernacular;
  global.mcLocalizedCommonName = mcLocalizedCommonName;
  global.mcLocalizedCommonNameForUi = mcLocalizedCommonNameForUi;
  global.mcLocalizedNameUsedFallback = mcLocalizedNameUsedFallback;
  global.mcDomainNameFallbackNotice = mcDomainNameFallbackNotice;
  global.mcPickGbifVernacularSlots = mcPickGbifVernacularSlots;
  global.MC_USER_LANG_KEY = MC_USER_LANG_KEY;
})(typeof window !== 'undefined' ? window : this);
