/**
 * MCurator — Achievement Center (成就中心)
 * Premium interactive progression UI + local rule engine hooks.
 */
(function (global) {
  'use strict';

  var TMS_KEY = 'mcurator_taxonomy_manuscript_projects_v1';

  function deepMerge(a, b) {
    if (!b || typeof b !== 'object') return a || {};
    var out = Array.isArray(a) ? a.slice() : Object.assign({}, a || {});
    Object.keys(b).forEach(function (k) {
      var bv = b[k];
      if (bv && typeof bv === 'object' && !Array.isArray(bv)) {
        out[k] = deepMerge(out[k] || {}, bv);
      } else {
        out[k] = bv;
      }
    });
    return out;
  }

  function baseConfig() {
    return global.MCResearcherProgressConfig || {};
  }

  function parseRulesOverride(settings) {
    var raw = settings && settings.researcherProgressRulesJson;
    if (raw == null || String(raw).trim() === '') return null;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {
      return null;
    }
  }

  function appendExtraAvatars(c) {
    var extra = global.MCProfileAvatarExtraCatalog;
    if (!extra || !extra.length) return c;
    var base = c && c.avatarDefinitions ? c.avatarDefinitions.slice() : [];
    var seen = Object.create(null);
    base.forEach(function (a) {
      if (a && a.id) seen[a.id] = 1;
    });
    extra.forEach(function (a) {
      if (a && a.id && !seen[a.id]) {
        base.push(a);
        seen[a.id] = 1;
      }
    });
    var out = Object.assign({}, c || {});
    out.avatarDefinitions = base;
    return out;
  }

  function getMergedConfig(state) {
    var c = baseConfig();
    var o = parseRulesOverride(state && state.settings);
    c = o ? deepMerge(c, o) : c;
    return appendExtraAvatars(c);
  }

  function xpToNextLevel(level, cfg) {
    var f = (cfg && cfg.levelXpFormula) || { base: 500, perLevel: 180 };
    var lv = Math.max(1, Math.floor(Number(level) || 1));
    return Math.max(1, Math.floor(Number(f.base) || 500) + lv * Math.floor(Number(f.perLevel) || 180));
  }

  function stageForLevel(level, cfg) {
    var lv = Math.max(1, Math.floor(Number(level) || 1));
    var stages = (cfg && cfg.levelStages) || [];
    for (var i = 0; i < stages.length; i++) {
      var s = stages[i];
      if (lv >= Number(s.minLevel) && lv <= Number(s.maxLevel)) return s;
    }
    return stages[stages.length - 1] || { en: 'Researcher', zh: '研究者', key: 'default' };
  }

  function applyXp(profile, addXp, cfg) {
    var p = profile || {};
    var xp = Math.max(0, Math.floor(Number(p.exp) || 0));
    var level = Math.max(1, Math.floor(Number(p.level) || 1));
    var gain = Math.max(0, Math.floor(Number(addXp) || 0));
    var leveled = 0;
    xp += gain;
    var guard = 0;
    while (xp >= xpToNextLevel(level, cfg) && guard < 500) {
      xp -= xpToNextLevel(level, cfg);
      level += 1;
      leveled += 1;
      guard++;
    }
    p.exp = xp;
    p.level = level;
    return { profile: p, leveled: leveled, gained: gain };
  }

  function defaultResearcherProgress() {
    return {
      version: 1,
      researchPoints: 0,
      equippedTitleId: '',
      equippedAvatarId: 'av_default',
      featuredBadgeKey: '',
      streakShields: 0,
      stats: { restores: 0, showcaseCount: 0, taxonomyNotes: 0 },
      daily: { dateKey: '', baseline: null, claimed: {}, claimedDailyBonus: false },
      weekly: { weekKey: '', baseline: null, claimed: {}, claimedWeeklyBonus: false, completedAt: '' },
      chapters: {},
      feed: [],
      flags: { viewedCollectionProgress: false },
      oneTime: {},
      lastStreakRewardAt: 0
    };
  }

  function mergeResearcherProgress(raw) {
    return deepMerge(defaultResearcherProgress(), raw || {});
  }

  global.mcRpcMergeDefaultProgress_ = mergeResearcherProgress;

  global.MCResearcherProgressMath = {
    xpToNextLevel: xpToNextLevel,
    stageForLevel: stageForLevel,
    applyXp: applyXp,
    getMergedConfig: getMergedConfig
  };

  function todayKey() {
    var d = new Date();
    var z = function (n) {
      return String(n).padStart(2, '0');
    };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }

  function isoWeekKey(d) {
    d = d || new Date();
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    var y = t.getUTCFullYear();
    var yb = new Date(Date.UTC(y, 0, 1));
    var w = Math.ceil(((t - yb) / 86400000 + 1) / 7);
    return y + '-W' + String(w).padStart(2, '0');
  }

  function hasFiniteCoord(s) {
    var la = Number(s && s.latitude);
    var ln = Number(s && s.longitude);
    return isFinite(la) && isFinite(ln) && Math.abs(la) <= 90 && Math.abs(ln) <= 180;
  }

  function specimenCompleteness(s, w) {
    w = w || {};
    var sc = 0;
    var nm = String((s && s.name) || '').trim();
    var sci = String((s && s.scientificName) || '').trim();
    if (nm) sc += Number(w.nameOrTemp != null ? w.nameOrTemp : 10);
    if (sci) sc += Number(w.scientificName != null ? w.scientificName : 15);
    var cls = String((s && s.subcategory) || '').trim() || String((s && s.category) || '').trim();
    if (cls) sc += Number(w.classification != null ? w.classification : 15);
    if (String((s && s.imageUrl) || '').trim() || String((s && s.assetImageKey) || '').trim()) sc += Number(w.specimenPhoto != null ? w.specimenPhoto : 15);
    if (String((s && s.collectedDate) || '').trim()) sc += Number(w.collectionDate != null ? w.collectionDate : 10);
    if (String((s && s.location) || (s && s.address) || (s && s.country) || '').trim()) sc += Number(w.locality != null ? w.locality : 10);
    if (hasFiniteCoord(s)) sc += Number(w.gps != null ? w.gps : 10);
    if (String((s && s.collector) || (s && s.source) || '').trim()) sc += Number(w.collectorOrSource != null ? w.collectorOrSource : 5);
    if (String((s && s.description) || (s && s.notes) || '').trim()) sc += Number(w.descriptionOrNotes != null ? w.descriptionOrNotes : 5);
    if (String((s && s.passportCardId) || '').trim() || /passport/i.test(String((s && s.tags) || ''))) sc += Number(w.passportCard != null ? w.passportCard : 5);
    return Math.min(100, Math.floor(sc));
  }

  function completenessLabel(score, cfg, zh) {
    var bands = (cfg && cfg.completenessStatus) || [];
    for (var i = 0; i < bands.length; i++) {
      if (score <= Number(bands[i].max)) {
        var k = bands[i].key;
        if (zh) {
          if (k === 'draft') return '草稿';
          if (k === 'basic') return '基本紀錄';
          if (k === 'complete') return '完整紀錄';
          if (k === 'high_quality') return '高品質紀錄';
        }
        if (k === 'draft') return 'Draft';
        if (k === 'basic') return 'Basic record';
        if (k === 'complete') return 'Complete record';
        return 'High quality record';
      }
    }
    return zh ? '紀錄' : 'Record';
  }

  function countTaxonomyProjects() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(TMS_KEY);
      if (!raw) return 0;
      var j = JSON.parse(raw);
      return Array.isArray(j) ? j.length : 0;
    } catch (e) {
      return 0;
    }
  }

  function activityCountToday(activities, pred) {
    var key = todayKey();
    var n = 0;
    (activities || []).forEach(function (a) {
      var d = String((a && a.createdAt) || '').slice(0, 10);
      if (d === key && pred(a)) n++;
    });
    return n;
  }

  function didCheckInToday(activities) {
    return activityCountToday(activities, function (a) {
      return String(a.type || '') === 'checkin';
    }) > 0;
  }

  function computeStats(state, rp, cfg) {
    var specimens = (state && state.specimens) || [];
    var acts = (state && state.activities) || [];
    var sat = (state && state.satItems) || [];
    var posts = (state && state.communityPosts) || [];
    var w = (cfg && cfg.completenessWeights) || {};

    var specimen_count = specimens.length;
    var gps_count = specimens.filter(hasFiniteCoord).length;
    var photo_count = specimens.filter(function (s) {
      return String(s.imageUrl || '').trim() || String(s.assetImageKey || '').trim();
    }).length;
    var sci_name_count = specimens.filter(function (s) {
      return String(s.scientificName || '').trim().length > 1;
    }).length;
    var locality_count = specimens.filter(function (s) {
      return String(s.location || s.address || s.country || '').trim();
    }).length;
    var habitat_count = specimens.filter(function (s) {
      return String(s.habitat || '').trim().length > 2;
    }).length;
    var hq = specimens.filter(function (s) {
      return specimenCompleteness(s, w) >= 90;
    });
    var hq_count = hq.length;
    var passport_hints = specimens.filter(function (s) {
      return /passport/i.test(String(s.tags || '')) || String(s.passportCardId || '').trim();
    }).length;
    var restore_count = Math.max(
      Number((rp && rp.stats && rp.stats.restores) || 0),
      acts.filter(function (a) {
        var t = String(a.type || '').toLowerCase();
        return t.indexOf('restor') >= 0 || (String(a.title || '').indexOf('修復') >= 0 && t.indexOf('specimen') < 0);
      }).length
    );
    var taxonomy_notes = Math.max(
      Number((rp && rp.stats && rp.stats.taxonomyNotes) || 0),
      countTaxonomyProjects(),
      acts.filter(function (a) {
        return String(a.type || '').toLowerCase().indexOf('tax') >= 0;
      }).length
    );
    var taxonomy_draft = countTaxonomyProjects();
    var showcase_count = Math.max(
      Number((rp && rp.stats && rp.stats.showcaseCount) || 0),
      posts.filter(function (p) {
        var blob = (String(p.tag || '') + ' ' + String(p.title || '')).toLowerCase();
        return blob.indexOf('showcase') >= 0 || blob.indexOf('策展') >= 0 || blob.indexOf('博物') >= 0;
      }).length
    );
    var sat_count = sat.filter(function (x) {
      return String(x.status || '').toLowerCase() === 'published';
    }).length;
    var rich_description = specimens.filter(function (s) {
      return String(s.description || '').trim().length > 40;
    }).length;

    return {
      specimen_count: specimen_count,
      gps_count: gps_count,
      photo_count: photo_count,
      sci_name_count: sci_name_count,
      locality_count: locality_count,
      habitat_count: habitat_count,
      hq_count: hq_count,
      hq_90_count: hq_count,
      passport_hints: passport_hints,
      restore_count: restore_count,
      taxonomy_notes: taxonomy_notes,
      taxonomy_draft: taxonomy_draft,
      showcase_count: showcase_count,
      sat_count: sat_count,
      rich_description: rich_description,
      streak: Number((state && state.profile && state.profile.streakDays) || 0),
      level: Number((state && state.profile && state.profile.level) || 1)
    };
  }

  function evalCheck(expr, stats) {
    if (!expr) return false;
    var m = String(expr)
      .replace(/\s/g, '')
      .match(/^([a-z0-9_]+)(>=|<=|==|>|<)(-?\d+)/i);
    if (!m) return false;
    var k = m[1];
    var op = m[2];
    var n = Number(m[3]);
    var v = Number(stats[k] != null ? stats[k] : 0);
    if (op === '>=') return v >= n;
    if (op === '<=') return v <= n;
    if (op === '>') return v > n;
    if (op === '<') return v < n;
    return v === n;
  }

  function ensureDailyWeeklyBaselines(rp, stats) {
    var dk = todayKey();
    var wk = isoWeekKey();
    if (!rp.daily) rp.daily = {};
    if (!rp.weekly) rp.weekly = {};
    if (rp.daily.dateKey !== dk) {
      rp.daily.dateKey = dk;
      rp.daily.baseline = {
        specimen_count: stats.specimen_count,
        gps_count: stats.gps_count,
        photo_count: stats.photo_count,
        restore_count: stats.restore_count,
        sci_name_count: stats.sci_name_count
      };
      rp.daily.claimed = {};
      rp.daily.claimedDailyBonus = false;
    }
    if (rp.weekly.weekKey !== wk) {
      rp.weekly.weekKey = wk;
      rp.weekly.baseline = {
        specimen_count: stats.specimen_count,
        restore_count: stats.restore_count,
        sci_name_count: stats.sci_name_count,
        gps_count: stats.gps_count,
        showcase_count: stats.showcase_count
      };
      rp.weekly.claimed = {};
      rp.weekly.claimedWeeklyBonus = false;
      rp.weekly.completedAt = '';
    }
  }

  function dailyProgressFor(questId, stats, rp, activities) {
    var b = (rp.daily && rp.daily.baseline) || {};
    if (questId === 'dq_sign_in') return didCheckInToday(activities) ? 1 : 0;
    if (questId === 'dq_specimen')
      return Math.min(1, Math.max(0, stats.specimen_count - Number(b.specimen_count || 0)));
    if (questId === 'dq_photo')
      return Math.min(1, Math.max(0, stats.photo_count - Number(b.photo_count || 0)));
    if (questId === 'dq_restore')
      return Math.min(1, Math.max(0, stats.restore_count - Number(b.restore_count || 0)));
    if (questId === 'dq_collection_view') return rp.flags && rp.flags.viewedCollectionProgress ? 1 : 0;
    return 0;
  }

  function weeklyProgressFor(questId, stats, rp) {
    var b = (rp.weekly && rp.weekly.baseline) || {};
    if (questId === 'wq_specimens')
      return Math.min(
        5,
        Math.max(0, stats.specimen_count - Number(b.specimen_count || 0))
      );
    if (questId === 'wq_restore')
      return Math.min(10, Math.max(0, stats.restore_count - Number(b.restore_count || 0)));
    if (questId === 'wq_scinames')
      return Math.min(10, Math.max(0, stats.sci_name_count - Number(b.sci_name_count || 0)));
    if (questId === 'wq_gps')
      return Math.min(10, Math.max(0, stats.gps_count - Number(b.gps_count || 0)));
    if (questId === 'wq_showcase')
      return Math.min(1, Math.max(0, stats.showcase_count - Number(b.showcase_count || 0)));
    return 0;
  }

  function iconSvg(name) {
    var o = {
      calendar:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      microscope:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18h8"/><path d="M9 18V5"/><path d="M9 5h6l2 3v2H9"/><circle cx="14" cy="12" r="2"/></svg>',
      image:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
      sparkles:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3-1.9 5.8-6.1-.1 4.9 3.6-1.9 5.8 4.9-3.6 4.9 3.6-1.9-5.8 4.9-3.6-6.1.1z"/></svg>',
      eye: '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
      layers:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m12.83 2.18 8 3.5a1 1 0 0 1 0 1.84l-8 3.5a1 1 0 0 1-.83 0l-8-3.5a1 1 0 0 1 0-1.84l8-3.5a1 1 0 0 1 .83 0Z"/><path d="m4.78 10.92 8 3.5a1 1 0 0 0 .83 0l8-3.5"/><path d="m4.78 15.92 8 3.5a1 1 0 0 0 .83 0l8-3.5"/></svg>',
      wand: '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="m17 15 5 5"/><path d="m3 3 7 7"/></svg>',
      dna: '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 15c6 0 6-6 12-6s6 6 12 6"/><path d="M2 9c6 0 6 6 12 6s6-6 12-6"/></svg>',
      'map-pin':
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
      layout:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
      award:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
      flame:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-2-1-3-1-3s-3 2.5-3 6a4.5 4.5 0 0 0 8 0c0-3.5-2.5-5-2.5-5S14 10 14 14a2.5 2.5 0 0 0 5 0c0-6-4.5-8-4.5-8S8.5 8.5 8.5 14.5Z"/></svg>',
      compass:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
      crown:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 18h20"/><path d="M4 18V9l4 3 4-6 4 6 4-3v9"/></svg>',
      user:
        '<svg class="mc-rpc-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>'
    };
    return o[name] || o.award;
  }

  function avatarById(cfg, id) {
    var list = (cfg && cfg.avatarDefinitions) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return list[0] || null;
  }

  function isAvatarUnlocked(ad, stats, guestTest) {
    if (!ad) return false;
    if (guestTest) return true;
    if (ad.alwaysUnlocked) return true;
    return evalCheck(String(ad.unlock || ''), stats);
  }

  function escAttrUrl(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
  }

  function avatarImageUrl(ad) {
    if (!ad) return '';
    if (typeof global.mcResolveAvatarImageUrl_ === 'function') {
      return global.mcResolveAvatarImageUrl_(ad);
    }
    var rel = String(ad.imageRel || '').trim();
    if (!rel) return '';
    if (typeof global.mcResolveLocalRelToPage_ === 'function') {
      return global.mcResolveLocalRelToPage_(rel.replace(/^\.\.\//, ''));
    }
    return '../' + rel.replace(/^\.\.\//, '');
  }

  function avatarVisualHtml(ad, extraClass) {
    if (!ad) return iconSvg('microscope');
    var imgUrl = avatarImageUrl(ad);
    var cls =
      'mc-rpc-avatar-visual' +
      (imgUrl ? ' mc-rpc-avatar-visual--photo' : '') +
      (extraClass ? ' ' + extraClass : '');
    if (imgUrl) {
      return (
        '<div class="' +
        cls +
        '">' +
        '<img class="mc-rpc-avatar-photo" src="' +
        escAttrUrl(imgUrl) +
        '" alt="" loading="lazy" decoding="async" draggable="false"/>' +
        '</div>'
      );
    }
    var grad = String(ad.gradient || 'linear-gradient(135deg,#1a2744 0%,#3d5a80 100%)');
    return (
      '<div class="' +
      cls +
      '" style="background:' +
      grad +
      '">' +
      iconSvg(ad.icon || 'microscope') +
      '</div>'
    );
  }

  function resolveEquippedAvatar(rp, cfg, stats, guestTest) {
    var id = String((rp && rp.equippedAvatarId) || 'av_default');
    var ad = avatarById(cfg, id);
    if (ad && isAvatarUnlocked(ad, stats, guestTest)) return ad;
    var def = avatarById(cfg, 'av_default');
    return def || { id: 'av_default', icon: 'microscope' };
  }

  function buildAvatarPickerMarkup(options) {
    var cfg = options.cfg;
    var rp = options.rp;
    var stats = options.stats;
    var guestAvatarTest = !!options.guestAvatarTest;
    var avatarScope = options.avatarScope || 'all';
    var esc = options.esc;
    var T = options.T;
    var tf = options.tf;
    var zh = options.zh;

    function avatarScopeMatch(ad, scope) {
      var ok = isAvatarUnlocked(ad, stats, guestAvatarTest);
      if (scope === 'all') return true;
      if (scope === 'unlocked') return ok;
      if (scope === 'locked') return !ok;
      return true;
    }

    var avatarDefs = (cfg.avatarDefinitions || []).filter(function (ad) {
      return avatarScopeMatch(ad, avatarScope);
    });
    var avatarsHtml = avatarDefs
      .map(function (ad) {
        var ok = isAvatarUnlocked(ad, stats, guestAvatarTest);
        var equipped = String(rp.equippedAvatarId || 'av_default') === ad.id;
        var unlockHint = guestAvatarTest
          ? T('rpc_avatar_guest_unlock_hint')
          : ad.alwaysUnlocked
            ? T('rpc_avatar_default')
            : tf('rpc_avatar_condition', { expr: String(ad.unlock || '') });
        return (
          '<div class="mc-rpc-avatar-card' +
          (ok ? ' mc-rpc-avatar-card--unlocked' : ' mc-rpc-avatar-card--locked') +
          (equipped ? ' mc-rpc-avatar-card--equipped' : '') +
          ' ' +
          rarityClass(ad.rarity) +
          '">' +
          '<div class="mc-rpc-avatar-card__visual">' +
          avatarVisualHtml(ad, 'mc-rpc-avatar-visual--card') +
          (ok ? '' : '<span class="mc-rpc-avatar-lock" aria-hidden="true">🔒</span>') +
          '</div>' +
          '<div class="mc-rpc-avatar-card__name">' +
          esc(zh() ? ad.zh : ad.en) +
          '</div>' +
          '<div class="mc-rpc-reward-line mc-rpc-avatar-card__hint">' +
          esc(unlockHint) +
          '</div>' +
          (ok
            ? '<button type="button" class="mc-rpc-btn mc-rpc-btn--ghost mc-rpc-equip-avatar" data-avatar-id="' +
              esc(ad.id) +
              '">' +
              (equipped ? T('rpc_avatar_equipped') : T('rpc_avatar_equip')) +
              '</button>'
            : '<span class="mc-rpc-rarity">' +
              T('rpc_avatar_locked') +
              '</span>') +
          '</div>'
        );
      })
      .join('');

    var avatarScopeRow = ['all', 'unlocked', 'locked']
      .map(function (sid) {
        var slab =
          sid === 'all'
            ? T('rpc_scope_all')
            : sid === 'unlocked'
              ? T('rpc_scope_unlocked')
              : T('rpc_scope_locked');
        return (
          '<button type="button" class="mc-rpc-filter-chip mc-rpc-filter-chip--scope' +
          (avatarScope === sid ? ' mc-rpc-filter-chip--on' : '') +
          '" data-avatar-scope="' +
          esc(sid) +
          '">' +
          esc(slab) +
          '</button>'
        );
      })
      .join('');

    return {
      avatarsHtml: avatarsHtml,
      avatarScopeRow: avatarScopeRow,
      intro: guestAvatarTest
        ? T('rpc_avatar_intro') + ' ' + T('rpc_avatar_guest_test_note')
        : T('rpc_avatar_intro')
    };
  }

  function bindAvatarPickerEvents(container, api, uiState, rerender, ctx) {
    container.querySelectorAll('[data-avatar-scope]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        uiState.avatarScope = btn.getAttribute('data-avatar-scope') || 'all';
        rerender();
      });
    });
    container.querySelectorAll('.mc-rpc-equip-avatar').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var aid = btn.getAttribute('data-avatar-id');
        var st = api.getState();
        var cfg2 = getMergedConfig(st);
        var rp2 = mergeResearcherProgress(st.researcherProgress || {});
        var ad = avatarById(cfg2, aid);
        var guestTest2 =
          typeof api.isGuestAvatarTestMode === 'function' && !!api.isGuestAvatarTestMode();
        if (!ad || !isAvatarUnlocked(ad, computeStats(st, rp2, cfg2), guestTest2)) return;
        rp2.equippedAvatarId = aid;
        pushFeed(rp2, 'rpc_feed_avatar_equipped');
        if (typeof api.saveResearcherProgress === 'function') {
          api.saveResearcherProgress({ researcherProgress: rp2 }, function (res) {
            if (res && res.ok) {
              if (typeof api.onAvatarEquipped === 'function') api.onAvatarEquipped();
              else if (api.reloadAll) api.reloadAll();
              else rerender();
            } else rerender();
          });
        } else rerender();
      });
    });
  }

  function pushFeed(rp, msg, vars) {
    rp.feed = rp.feed || [];
    if (typeof msg === 'string' && msg.indexOf('rpc_') === 0) {
      rp.feed.unshift({ t: new Date().toISOString(), key: msg, vars: vars || null });
    } else {
      rp.feed.unshift({ t: new Date().toISOString(), text: String(msg || '') });
    }
    if (rp.feed.length > 40) rp.feed.length = 40;
  }

  function rarityClass(r) {
    var x = String(r || '').toLowerCase();
    if (x === 'legendary' || x === 'mythic') return 'mc-rpc-badge-card--legendary';
    if (x === 'epic') return 'mc-rpc-badge-card--epic';
    if (x === 'rare' || x === 'super rare' || x === 'super_rare') return 'mc-rpc-badge-card--rare';
    if (x === 'uncommon') return 'mc-rpc-badge-card--uncommon';
    return 'mc-rpc-badge-card--common';
  }

  function mount(container, api) {
    if (!container || !api || typeof api.getState !== 'function') return;

    if (!container._mcRpcUi) {
      container._mcRpcUi = {
        mobileTab: 'progress',
        badgeFilter: 'all',
        badgeScope: 'all',
        avatarScope: 'all',
        rewardModalOpen: false
      };
    }
    var uiState = container._mcRpcUi;

    var STREAK_CLAIM_LS = 'mc_rpc_streak_window_claim_v1';

    function readStreakClaimedDays() {
      if (!global.MC_IS_LOCAL_PREVIEW) return [];
      try {
        var raw = global.localStorage && global.localStorage.getItem(STREAK_CLAIM_LS);
        if (!raw) return [];
        var j = JSON.parse(raw);
        return Array.isArray(j.days) ? j.days : [];
      } catch (e) {
        return [];
      }
    }

    function addStreakClaimedDay(day) {
      if (!global.MC_IS_LOCAL_PREVIEW) return;
      try {
        var cur = readStreakClaimedDays();
        if (cur.indexOf(day) < 0) cur.push(day);
        global.localStorage && global.localStorage.setItem(STREAK_CLAIM_LS, JSON.stringify({ days: cur }));
      } catch (e) {}
    }

    function zh() {
      return api.getLang && api.getLang() === 'zh-TW';
    }

    function rpcDocLang_() {
      return zh() ? 'zh-Hant' : 'en';
    }

    function esc(s) {
      return api.escapeHtml ? api.escapeHtml(String(s == null ? '' : s)) : String(s == null ? '' : s);
    }

    function T(key) {
      if (api.tr && typeof api.tr === 'function') return api.tr(key);
      return key;
    }

    function tf(key, vars) {
      var s = T(key);
      if (vars && typeof vars === 'object') {
        Object.keys(vars).forEach(function (k) {
          s = String(s).split('{{' + k + '}}').join(String(vars[k]));
        });
      }
      return s;
    }

    function questLabel(q) {
      if (q && q.i18nKey) {
        var copy = global.MCResearcherProgressCopy || {};
        if (copy[q.i18nKey] && typeof global.mcPick === 'function') return global.mcPick(copy[q.i18nKey]);
        return T(q.i18nKey);
      }
      if (q && typeof global.mcPick === 'function') return global.mcPick({ zh: q.zh || '', en: q.en || '' });
      if (!q) return '';
      return zh() ? String(q.zh || '') : String(q.en || '');
    }

    function lineLabel(obj) {
      if (!obj) return '';
      if (typeof global.mcPick === 'function') return global.mcPick({ zh: obj.zhAlt || obj.zh || '', en: obj.en || '' });
      return zh() ? String(obj.zhAlt || obj.zh || '') : String(obj.en || '');
    }

    function tierLabel(tier) {
      var k = 'rpc_tier_' + String(tier || '').toLowerCase();
      var v = T(k);
      return v !== k ? v : String(tier || '');
    }

    function rarityLabel(r) {
      var k = 'rpc_rarity_' + String(r || '').toLowerCase().replace(/\s+/g, '_');
      var v = T(k);
      return v !== k ? v : String(r || '');
    }

    function weekDateStr() {
      var now = new Date();
      var day = now.getDay();
      var daysToSun = day === 0 ? 0 : 7 - day;
      var end = new Date(now);
      end.setDate(end.getDate() + daysToSun);
      end.setHours(23, 59, 0, 0);
      return zh()
        ? end.getFullYear() + '/' + (end.getMonth() + 1) + '/' + end.getDate()
        : end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function formatFeedItem(f) {
      if (!f) return '';
      if (f.key) return tf(f.key, f.vars || null);
      return f.text || '';
    }

    function persist(payload, cb) {
      if (typeof api.saveResearcherProgress === 'function') {
        api.saveResearcherProgress(payload, cb || function () {});
        return;
      }
      cb && cb({ ok: false, message: 'No save bridge' });
    }

    function showRpcToast(msg, burst) {
      if (api.toast && typeof api.toast === 'function') {
        api.toast(msg);
        return;
      }
      var host = container.querySelector('.mc-rpc-toast-host');
      if (!host) return;
      host.textContent = msg;
      host.classList.toggle('mc-rpc-toast-host--burst', !!burst);
      host.classList.add('mc-rpc-toast-host--on');
      clearTimeout(host._mcRpcT);
      host._mcRpcT = setTimeout(function () {
        host.classList.remove('mc-rpc-toast-host--on', 'mc-rpc-toast-host--burst');
      }, 3200);
    }

    function burstHero() {
      var h = container.querySelector('.mc-rpc-hero');
      if (!h) return;
      h.classList.add('mc-rpc-hero--burst');
      setTimeout(function () {
        h.classList.remove('mc-rpc-hero--burst');
      }, 900);
    }

    function render() {
      var state = api.getState();
      var cfg = getMergedConfig(state);
      var rp = mergeResearcherProgress(state.researcherProgress || {});
      var profile = Object.assign({}, state.profile || {});
      var stats = computeStats(state, rp, cfg);
      ensureDailyWeeklyBaselines(rp, stats);
      var guestAvatarTest =
        typeof api.isGuestAvatarTestMode === 'function' && !!api.isGuestAvatarTestMode();

      var stage = stageForLevel(profile.level, cfg);
      var needXp = xpToNextLevel(profile.level, cfg);
      var curXp = Math.max(0, Math.floor(Number(profile.exp) || 0));
      var pct = Math.min(100, Math.round((curXp / needXp) * 1000) / 10);

      var eqTitle = '';
      if (rp.equippedTitleId) {
        var td = ((cfg.titleDefinitions || []).find(function (x) {
          return x.id === rp.equippedTitleId;
        }) || {});
        eqTitle = zh() ? String(td.zh || '') : String(td.en || '');
      }

      var featuredLabel = '';
      if (rp.featuredBadgeKey) {
        var parts = String(rp.featuredBadgeKey).split(':');
        var fam = (cfg.badgeDefinitions || []).find(function (b) {
          return b.id === parts[0] || b.family === parts[0];
        });
        if (fam && fam.tiers) {
          var tier = fam.tiers.find(function (x) {
            return x.tier === parts[1];
          });
          if (tier) {
            featuredLabel =
              (zh() ? String(tier.zh || '') : String(tier.en || '')) + ' · ' + tierLabel(tier.tier);
          }
        }
      }

      var dailyList = (cfg.dailyQuestPool || []).slice(0, 5);
      var dailyDone = 0;
      var dailyHtml = dailyList
        .map(function (q) {
          var prog = dailyProgressFor(q.id, stats, rp, state.activities || []);
          var done = prog >= q.target;
          if (done) dailyDone++;
          var claimed = rp.daily.claimed && rp.daily.claimed[q.id];
          var ic = iconSvg(q.icon || 'award');
          var progPct = Math.min(100, Math.round((prog / Number(q.target) || 1) * 1000) / 10);
          var statusLab = done ? (claimed ? T('rpc_status_claimed') : T('rpc_status_ready')) : T('rpc_status_in_progress');
          var actionsHtml = '';
          if (!done) {
            actionsHtml =
              '<button type="button" class="mc-rpc-btn mc-rpc-btn--cyan mc-rpc-go" data-go="' +
              esc(q.id) +
              '">' +
              esc(T('rpc_go')) +
              '</button>';
          } else if (!claimed) {
            actionsHtml =
              '<button type="button" class="mc-rpc-btn mc-rpc-btn--claim-gold mc-rpc-claim-daily" data-daily-claim="' +
              esc(q.id) +
              '" data-xp="' +
              esc(q.xp) +
              '" data-rp="' +
              esc(q.rp || 0) +
              '">' +
              esc(T('rpc_claim')) +
              '</button>';
          } else {
            actionsHtml = '<span class="mc-rpc-quest-claimed-pill">' + esc(T('rpc_status_claimed')) + '</span>';
          }
          return (
            '<div class="mc-rpc-quest-card' +
            (done ? ' mc-rpc-quest-card--done' : ' mc-rpc-quest-card--inprogress') +
            (done && !claimed ? ' mc-rpc-quest-card--claimable' : '') +
            '" data-daily-id="' +
            esc(q.id) +
            '">' +
            '<div class="mc-rpc-quest-card__head">' +
            '<div class="mc-rpc-quest-icon" aria-hidden="true">' +
            ic +
            '</div>' +
            '<div class="mc-rpc-quest-headtext">' +
            '<div class="mc-rpc-quest-title">' +
            esc(questLabel(q)) +
            '</div>' +
            '<div class="mc-rpc-quest-status">' +
            esc(statusLab) +
            '</div></div>' +
            '<button type="button" class="mc-rpc-info-dot" title="' +
            esc(T('rpc_info_mission')) +
            '" aria-label="' +
            esc(T('rpc_info_mission')) +
            '">i</button></div>' +
            '<div class="mc-rpc-reward-line mc-rpc-quest-progress">' +
            esc(T('rpc_progress')) +
            '：' +
            prog +
            ' / ' +
            q.target +
            '</div>' +
            '<div class="mc-rpc-mini-bar" aria-hidden="true"><div style="width:' +
            progPct +
            '%;"></div></div>' +
            '<div class="mc-rpc-quest-reward">+' +
            q.xp +
            ' XP' +
            (q.rp ? ' · +' + q.rp + ' RP' : '') +
            '</div>' +
            '<div class="mc-rpc-quest-actions">' +
            actionsHtml +
            '</div></div>'
          );
        })
        .join('');

      var bonusCfg = cfg.dailyBonus || { completeCount: 3, xp: 50, rp: 5 };
      var bonusReady = dailyDone >= Number(bonusCfg.completeCount || 3) && !rp.daily.claimedDailyBonus;

      var weeklyList = cfg.weeklyQuestPool || [];
      var weekHtml = weeklyList
        .map(function (w) {
          var prog = weeklyProgressFor(w.id, stats, rp);
          var tgt = Number(w.target) || 1;
          var pctW = Math.min(100, Math.round((prog / tgt) * 1000) / 10);
          var claimed = rp.weekly.claimed && rp.weekly.claimed[w.id];
          var done = prog >= tgt;
          return (
            '<div class="mc-rpc-week-card" data-weekly-id="' +
            esc(w.id) +
            '"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;"><div><div class="name" style="font-weight:800;">' +
            esc(questLabel(w)) +
            '</div><div class="mc-rpc-timer">' +
            esc(tf('rpc_week_banner', { date: weekDateStr() })) +
            '</div></div>' +
            (done && !claimed
              ? '<button type="button" class="mc-rpc-btn mc-rpc-btn--primary mc-rpc-claim-weekly" data-weekly-claim="' +
                esc(w.id) +
                '" data-xp="' +
                esc(w.xp) +
                '" data-rp="' +
                esc(w.rp || 0) +
                '">' +
                T('rpc_claim') +
                '</button>'
              : '<span class="mc-rpc-rarity">' +
                (done ? T('rpc_status_claimed') : Math.floor(pctW) + '%') +
                '</span>') +
            '</div><div class="mc-rpc-xp-bar" style="margin-top:10px;"><div class="mc-rpc-xp-fill" style="width:' +
            pctW +
            '%;"></div></div><div class="mc-rpc-reward-line" style="margin-top:8px;">+' +
            w.xp +
            ' XP' +
            (w.rp ? ' · +' + w.rp + ' RP' : '') +
            '</div></div>'
          );
        })
        .join('');

      var weekAllDone =
        weeklyList.length &&
        weeklyList.every(function (w) {
          return weeklyProgressFor(w.id, stats, rp) >= Number(w.target);
        });
      var bonusW = cfg.weeklyBonus || { xp: 500, rp: 30, streakShield: 1 };
      var weekBonusReady = weekAllDone && !rp.weekly.claimedWeeklyBonus;

      var chapters = cfg.mainQuestChapters || [];
      var chHtml = chapters
        .map(function (ch) {
          var nodes = (ch.nodes || [])
            .map(function (n, ni) {
              var prevComplete = ni === 0 ? true : evalCheck(ch.nodes[ni - 1].check, stats);
              var ok = evalCheck(n.check, stats);
              var locked = !prevComplete;
              var active = !ok && !locked;
              var cls = ok ? ' mc-rpc-node--done' : locked ? ' mc-rpc-node--locked' : active ? ' mc-rpc-node--active' : '';
              return (
                '<div class="mc-rpc-node' +
                cls +
                '"><div class="mc-rpc-node-dot"></div><div><div style="font-weight:700;">' +
                esc(zh() ? n.zh : n.en) +
                '</div><div class="mc-rpc-reward-line">+' +
                n.xp +
                ' XP</div></div></div>'
              );
            })
            .join('');
          return (
            '<div class="mc-rpc-chapter"><div class="name" style="font-weight:800;margin-bottom:6px;">' +
            esc(zh() ? ch.zh : ch.en) +
            '</div><div class="mc-rpc-reward-line" style="margin-bottom:8px;">' +
            esc(zh() ? ch.chapterReward.zh : ch.chapterReward.en) +
            '</div>' +
            nodes +
            '</div>'
          );
        })
        .join('');

      var milestones = cfg.collectionMilestones || [];
      var totalS = stats.specimen_count;
      var nextM = milestones.find(function (m) {
        return totalS < m.count;
      });
      var milestonePathHtml = milestones
        .map(function (m, i) {
          var hit = totalS >= m.count;
          var isCurrent = nextM && String(m.id || m.count) === String(nextM.id || nextM.count);
          var tipRaw = lineLabel(m) + '｜標本數達 ' + m.count + '｜獎勵：' + (m.rewardZh || m.rewardEn || '');
          var label = esc(lineLabel(m));
          var stateCls = hit ? 'mc-rpc-ml-node--done' : isCurrent ? 'mc-rpc-ml-node--current' : 'mc-rpc-ml-node--future';
          var inner =
            '<button type="button" class="mc-rpc-ml-node ' +
            stateCls +
            '" title="' +
            esc(tipRaw) +
            '">' +
            '<span class="mc-rpc-ml-ring" aria-hidden="true"><span class="mc-rpc-ml-dot"></span></span>' +
            '<span class="mc-rpc-ml-count">' +
            m.count +
            '</span>' +
            '<span class="mc-rpc-ml-label">' +
            label +
            '</span></button>';
          var bridge =
            i < milestones.length - 1
              ? '<span class="mc-rpc-ml-bridge ' + (hit ? 'mc-rpc-ml-bridge--done' : '') + '" aria-hidden="true"></span>'
              : '';
          return inner + bridge;
        })
        .join('');
      var prevC = 0;
      if (nextM) {
        var ix = milestones.indexOf(nextM);
        prevC = ix > 0 ? milestones[ix - 1].count : 0;
      }
      var span = nextM ? nextM.count - prevC : 1;
      var progM = nextM ? Math.min(100, Math.round(((totalS - prevC) / span) * 1000) / 10) : 100;
      var mileTitle = nextM ? lineLabel(nextM) : T('rpc_milestone_top');
      var mileSub = nextM ? totalS + ' / ' + nextM.count + ' · ' + (nextM.rewardZh || nextM.rewardEn || '') : String(totalS);

      function badgeCatMatch(b, catId) {
        if (catId === 'all') return true;
        var c = String(b.category || '').toLowerCase();
        if (catId === 'field') return c === 'gps' || c === 'specimen';
        if (catId === 'specimen_only') return c === 'specimen';
        if (catId === 'restore') return c === 'restoration';
        if (catId === 'validate') return c === 'taxonomy';
        if (catId === 'museum') return c === 'museum';
        if (catId === 'login') return c === 'special' || c === 'community' || c === 'sat';
        return String(b.category || '').toLowerCase() === catId;
      }

      function badgeScopeMatch(b, scope) {
        var key = b.progressKey || 'specimen_count';
        var cur = Number(stats[key] || 0);
        var tiers = b.tiers || [];
        var unlockedIdx = -1;
        for (var ti = 0; ti < tiers.length; ti++) {
          if (cur >= Number(tiers[ti].target)) unlockedIdx = ti;
        }
        var unlocked = unlockedIdx >= 0;
        var r = String(b.rarity || '').toLowerCase();
        if (scope === 'all') return true;
        if (scope === 'unlocked') return unlocked;
        if (scope === 'locked') return !unlocked;
        if (scope === 'rare') return r === 'rare' || r === 'epic' || r === 'uncommon';
        if (scope === 'legendary') return r === 'legendary' || r === 'mythic';
        return true;
      }

      var badgeDefs = cfg.badgeDefinitions || [];
      var filtered = badgeDefs.filter(function (b) {
        if (!badgeScopeMatch(b, uiState.badgeScope || 'all')) return false;
        return badgeCatMatch(b, uiState.badgeFilter || 'all');
      });
      var badgeHtml = filtered
        .map(function (b) {
          var key = b.progressKey || 'specimen_count';
          var cur = Number(stats[key] || 0);
          var tiers = b.tiers || [];
          var unlockedIdx = -1;
          for (var ti = 0; ti < tiers.length; ti++) {
            if (cur >= Number(tiers[ti].target)) unlockedIdx = ti;
          }
          var unlocked = unlockedIdx >= 0;
          var nextTier = tiers[unlockedIdx + 1] || tiers[tiers.length - 1];
          var curTier = unlocked ? tiers[unlockedIdx] : tiers[0];
          var target = Number((nextTier && nextTier.target) || curTier.target);
          var progB = unlocked && unlockedIdx === tiers.length - 1 ? 100 : Math.min(100, Math.round((cur / target) * 1000) / 10);
          var fkey = b.id + ':' + (unlocked ? curTier.tier : 'Locked');
          var isFeatured = rp.featuredBadgeKey === b.id + ':' + String(curTier.tier);
          return (
            '<div class="mc-rpc-badge-card' +
            (unlocked ? '' : ' mc-rpc-badge-card--locked') +
            ' ' +
            rarityClass(b.rarity) +
            (unlocked ? ' mc-rpc-badge-card--unlocked' : '') +
            '" data-badge-family="' +
            esc(b.id) +
            '"><div style="display:flex;justify-content:space-between;align-items:center;"><span class="mc-rpc-rarity">' +
            esc(rarityLabel(b.rarity)) +
            '</span><span class="mc-rpc-tier-pill">' +
            esc(tierLabel(unlocked && curTier ? curTier.tier : tiers[0].tier)) +
            '</span></div><div class="name" style="font-weight:800;margin-top:4px;">' +
            esc(zh() ? (unlocked && curTier ? curTier.zh : tiers[0].zh) : unlocked && curTier ? curTier.en : tiers[0].en) +
            '</div><div class="mc-rpc-reward-line">' +
            T('rpc_progress') +
            ' ' +
            cur +
            ' / ' +
            target +
            '</div><div class="mc-rpc-xp-bar"><div class="mc-rpc-xp-fill" style="width:' +
            progB +
            '%;"></div></div><div style="margin-top:auto;display:flex;gap:8px;">' +
            (unlocked
              ? '<button type="button" class="mc-rpc-btn mc-rpc-btn--ghost mc-rpc-feature-badge" data-fkey="' +
                esc(b.id + ':' + String(curTier.tier)) +
                '">' +
                (isFeatured ? T('rpc_badge_showcased') : T('rpc_badge_showcase')) +
                '</button>'
              : '') +
            '</div></div>'
          );
        })
        .join('');

      var scopeRow = ['all', 'unlocked', 'locked', 'rare', 'legendary']
        .map(function (sid) {
          var slab =
            sid === 'all'
              ? T('rpc_scope_all')
              : sid === 'unlocked'
                ? T('rpc_scope_unlocked')
                : sid === 'locked'
                  ? T('rpc_scope_locked')
                  : sid === 'rare'
                    ? T('rpc_scope_rare')
                    : T('rpc_scope_legendary');
          return (
            '<button type="button" class="mc-rpc-filter-chip mc-rpc-filter-chip--scope' +
            ((uiState.badgeScope || 'all') === sid ? ' mc-rpc-filter-chip--on' : '') +
            '" data-badge-scope="' +
            esc(sid) +
            '">' +
            esc(slab) +
            '</button>'
          );
        })
        .join('');

      var catRow = [
        { id: 'all', lab: T('rpc_fil_all') },
        { id: 'field', lab: T('rpc_cat_field') },
        { id: 'specimen_only', lab: T('rpc_cat_specimen') },
        { id: 'restore', lab: T('rpc_cat_restore') },
        { id: 'validate', lab: T('rpc_cat_validate') },
        { id: 'museum', lab: T('rpc_cat_milestone') },
        { id: 'login', lab: T('rpc_cat_login') }
      ]
        .map(function (row) {
          return (
            '<button type="button" class="mc-rpc-filter-chip' +
            ((uiState.badgeFilter || 'all') === row.id ? ' mc-rpc-filter-chip--on' : '') +
            '" data-badge-filter="' +
            esc(row.id) +
            '">' +
            esc(row.lab) +
            '</button>'
          );
        })
        .join('');

      var titles = (cfg.titleDefinitions || []).filter(function (x) {
        return !x.fromLevelStage;
      });
      var titlesHtml = titles
        .map(function (td) {
          var ok = evalCheck(String(td.unlock || ''), stats);
          var equipped = rp.equippedTitleId === td.id;
          return (
            '<div class="mc-rpc-title-row' +
            (ok ? '' : ' mc-rpc-title-row--locked') +
            '"><div><div style="font-weight:800;">' +
            esc(zh() ? td.zh : td.en) +
            '</div><div class="mc-rpc-reward-line">' +
            esc(tf('rpc_title_condition', { expr: String(td.unlock || '') })) +
            '</div></div>' +
            (ok
              ? '<button type="button" class="mc-rpc-btn mc-rpc-btn--ghost mc-rpc-equip-title" data-title-id="' +
                esc(td.id) +
                '">' +
                (equipped ? T('rpc_title_equipped') : T('rpc_title_equip')) +
                '</button>'
              : '<span class="mc-rpc-rarity">' +
                T('rpc_title_locked') +
                '</span>') +
            '</div>'
          );
        })
        .join('');

      var heroAvatarDef = resolveEquippedAvatar(rp, cfg, stats, guestAvatarTest);
      var heroAvatarInner = avatarVisualHtml(heroAvatarDef, 'mc-rpc-avatar-visual--hero');
      var avatarPicker = buildAvatarPickerMarkup({
        cfg: cfg,
        rp: rp,
        stats: stats,
        guestAvatarTest: guestAvatarTest,
        avatarScope: uiState.avatarScope || 'all',
        esc: esc,
        T: T,
        tf: tf,
        zh: zh
      });
      var avatarsHtml = avatarPicker.avatarsHtml;
      var avatarScopeRow = avatarPicker.avatarScopeRow;
      var avatarIntroText = avatarPicker.intro;

      var feedItems = (rp.feed || [])
        .slice(0, 12)
        .map(function (f) {
          return '<li>' + esc(formatFeedItem(f)) + '</li>';
        })
        .join('');
      if (!feedItems) feedItems = '<li>' + esc(T('rpc_feed_empty')) + '</li>';

      var shieldLine =
        T('rpc_streak_shields_head') +
        ': ' +
        (rp.streakShields || 0) +
        ' · ' +
        T('rpc_streak_shields_hint');

      var streakS = Math.max(0, Math.floor(Number(stats.streak) || 0));
      var streakStart = Math.max(1, streakS - 3);
      var streakCardsHtml = '';
      var si;
      for (si = 0; si < 7; si++) {
        var dayN = streakStart + si;
        var sk = 'soon';
        if (streakS > 0) {
          if (dayN < streakS) sk = 'claimed';
          else if (dayN === streakS) {
            sk =
              global.MC_IS_LOCAL_PREVIEW && readStreakClaimedDays().indexOf(dayN) >= 0 ? 'claimed' : 'claim';
          } else if (dayN === streakS + 1) sk = 'tomorrow';
          else sk = 'soon';
        }
        var stateClass = 'mc-rpc-streak-card--' + sk;
        var rewardTxt = '+10 XP';
        var j;
        var srs = cfg.streakRewards || [];
        var pick = null;
        for (j = 0; j < srs.length; j++) {
          if (Number(srs[j].days) >= dayN) {
            pick = srs[j];
            break;
          }
        }
        if (pick) {
          var bits = [];
          if (pick.xp) bits.push('+' + pick.xp + ' XP');
          if (pick.rp) bits.push('+' + pick.rp + ' RP');
          rewardTxt = bits.length ? bits.join(' · ') : rewardTxt;
        }
        var labelState =
          sk === 'claimed'
            ? T('rpc_status_claimed')
            : sk === 'claim'
              ? T('rpc_status_ready')
              : sk === 'tomorrow'
                ? T('rpc_tomorrow_claim')
                : T('rpc_soon_unlock');
        streakCardsHtml +=
          '<div class="mc-rpc-streak-card ' +
          stateClass +
          '" data-streak-day="' +
          esc(String(dayN)) +
          '" data-streak-state="' +
          sk +
          '" tabindex="0" role="button">' +
          '<div class="mc-rpc-streak-card__day">第 ' +
          dayN +
          ' 天</div>' +
          '<div class="mc-rpc-streak-card__ico" aria-hidden="true">' +
          iconSvg('sparkles') +
          '</div>' +
          '<div class="mc-rpc-streak-card__rw">' +
          esc(rewardTxt) +
          '</div>' +
          '<div class="mc-rpc-streak-card__st">' +
          esc(labelState) +
          '</div></div>';
      }

      var nextLvNum = Math.max(2, Math.floor(Number(profile.level) || 1) + 1);
      var rpNum = Math.max(0, Math.floor(Number(rp.researchPoints) || 0));
      var rpFmt = rpNum.toLocaleString('zh-TW');
      var titleBadge = eqTitle || lineLabel(stage) || '';
      var claimDot = bonusReady || weekBonusReady ? '<span class="mc-rpc-notify-dot" aria-hidden="true"></span>' : '';
      var modalOpen = !!uiState.rewardModalOpen;
      var modalHtml =
        '<div class="mc-rpc-modal-root' +
        (modalOpen ? ' mc-rpc-modal-root--open' : '') +
        '" id="mcRpcRewardModal" aria-hidden="' +
        (modalOpen ? 'false' : 'true') +
        '">' +
        '<div class="mc-rpc-modal-backdrop" data-close-reward-modal="1"></div>' +
        '<div class="mc-rpc-modal mc-rpc-modal--reward" role="dialog" aria-modal="true" aria-labelledby="mcRpcRewardModalTitle">' +
        '<div class="mc-rpc-modal-chest" aria-hidden="true"><span class="mc-rpc-chest-glow"></span><span class="mc-rpc-chest-body">📦</span></div>' +
        '<h3 id="mcRpcRewardModalTitle" class="mc-rpc-modal-title">' +
        esc(T('rpc_reward_modal_title')) +
        '</h3>' +
        '<ul class="mc-rpc-reward-list">' +
        '<li class="mc-rpc-reward-li">' +
        esc(T('rpc_reward_modal_rp')) +
        '</li>' +
        '<li class="mc-rpc-reward-li">' +
        esc(T('rpc_reward_modal_badge')) +
        '</li>' +
        '<li class="mc-rpc-reward-li">' +
        esc(T('rpc_reward_modal_card')) +
        '</li>' +
        '<li class="mc-rpc-reward-li">' +
        esc(T('rpc_reward_modal_title_rw')) +
        '</li></ul>' +
        '<p class="mc-rpc-modal-req">' +
        esc(T('rpc_reward_modal_req')) +
        '</p>' +
        '<div class="mc-rpc-modal-actions">' +
        '<button type="button" class="mc-rpc-btn mc-rpc-btn--ghost" data-close-reward-modal="1">' +
        esc(T('rpc_modal_close')) +
        '</button>' +
        '<button type="button" class="mc-rpc-btn mc-rpc-btn--gold" data-close-reward-modal="1" data-mtab-jump="quests">' +
        esc(T('rpc_modal_go_quests')) +
        '</button></div></div></div>';

      var html =
        '<div class="mc-rpc-page mc-rpc-dashboard">' +
        '<header class="mc-rpc-page-head">' +
        '<div class="mc-rpc-page-head__bg" aria-hidden="true"></div>' +
        '<div class="mc-rpc-page-head__inner">' +
        '<div class="mc-rpc-page-head__left">' +
        '<span class="mc-rpc-page-deco" aria-hidden="true">⚛</span>' +
        '<div><h2 class="mc-rpc-page-title">' +
        esc(T('rpc_main_hub_title')) +
        '</h2>' +
        '<p class="mc-rpc-page-sub">' +
        esc(T('rpc_page_subtitle')) +
        '</p></div></div>' +
        '<div class="mc-rpc-page-head__right">' +
        '<span class="mc-rpc-rp-pill"><span class="mc-rpc-rp-val">' +
        esc(rpFmt) +
        '</span> RP</span>' +
        '<button type="button" class="mc-rpc-help-btn" id="mcRpcHelpBtn" title="' +
        esc(T('rpc_help_tip')) +
        '" aria-label="說明">?</button>' +
        '<span class="mc-rpc-title-pill">' +
        esc(titleBadge || T('rpc_none')) +
        '</span></div></div></header>' +
        '<button type="button" class="mc-rpc-ach-hub' +
        (uiState.mobileTab === 'badges' ? ' mc-rpc-ach-hub--active' : '') +
        '" data-mtab-jump="badges">' +
        '<span class="mc-rpc-ach-hub__ico" aria-hidden="true">🏅</span>' +
        '<span class="mc-rpc-ach-hub__text"><span class="mc-rpc-ach-hub__title">' +
        esc(T('rpc_ach_entry_title')) +
        '</span><span class="mc-rpc-ach-hub__sub">' +
        esc(T('rpc_ach_entry_sub')) +
        '</span></span><span class="mc-rpc-ach-hub__chev" aria-hidden="true">›</span></button>' +
        '<div class="mc-rpc-root" lang="' + rpcDocLang_() + '">' +
        '<div class="mc-rpc-hero">' +
        '<div class="mc-rpc-hero-grid mc-rpc-hero-grid--premium">' +
        '<div class="mc-rpc-hero-left">' +
        '<div class="mc-rpc-hero-avatar" aria-hidden="true"><div class="mc-rpc-avatar-ring">' +
        heroAvatarInner +
        '</div></div>' +
        '<div class="mc-rpc-hero-body">' +
        '<div class="mc-rpc-stage-chip">' +
        iconSvg('award') +
        '<span>' +
        esc(lineLabel(stage) || '') +
        '</span></div>' +
        '<div class="mc-rpc-level-num">Lv.' +
        esc(profile.level) +
        '</div>' +
        '<div class="mc-rpc-xp-wrap"><div class="mc-rpc-xp-meta"><span>' +
        esc(tf('rpc_xp_pair', { cur: curXp, need: needXp })) +
        '</span></div>' +
        '<div class="mc-rpc-xp-bar"><div class="mc-rpc-xp-fill" style="width:' +
        pct +
        '%;"></div></div>' +
        '<div class="mc-rpc-reward-line mc-rpc-xp-hint">' +
        esc(
          tf('rpc_xp_until_next', {
            remain: String(Math.max(0, needXp - curXp)),
            next: String(Number(profile.level) + 1)
          })
        ) +
        '</div></div>' +
        '<ul class="mc-rpc-hero-stats">' +
        '<li><span class="mc-rpc-hero-stat-ic">' +
        iconSvg('flame') +
        '</span>' +
        esc(tf('rpc_streak_count', { n: String(stats.streak) })) +
        '</li><li>' +
        esc(tf('rpc_today_quests', { done: String(dailyDone), total: String(dailyList.length) })) +
        '</li><li><span class="mc-rpc-meta-muted">' +
        esc(T('rpc_research_points')) +
        ' </span>' +
        esc(rpFmt) +
        ' RP</li></ul>' +
        '<div class="mc-rpc-actions">' +
        '<button type="button" class="mc-rpc-btn mc-rpc-btn--cyan" id="mcRpcCheckIn">' +
        esc(T('rpc_sign_in')) +
        '</button>' +
        '<span class="mc-rpc-claim-wrap">' +
        claimDot +
        '<button type="button" class="mc-rpc-btn mc-rpc-btn--claim-main" id="mcRpcClaimRewards"' +
        (bonusReady || weekBonusReady ? '' : ' disabled') +
        '>' +
        esc(T('rpc_claim_rewards')) +
        '</button></span></div></div>' +
        '<aside class="mc-rpc-hero-chest" aria-label="' +
        esc(T('rpc_next_stage_reward')) +
        '">' +
        '<div class="mc-rpc-chest-visual" aria-hidden="true"><span class="mc-rpc-chest-glow"></span><span class="mc-rpc-chest-emoji">📦</span></div>' +
        '<div class="mc-rpc-chest-cap">' +
        esc(T('rpc_next_stage_reward')) +
        '</div>' +
        '<div class="mc-rpc-chest-name">' +
        esc(tf('rpc_lv_researcher_chest', { lv: String(nextLvNum) })) +
        '</div>' +
        '<div class="mc-rpc-chest-rarity">' +
        esc(T('rpc_rarity_epic')) +
        '</div>' +
        '<div class="mc-rpc-mini-bar mc-rpc-mini-bar--chest"><div style="width:' +
        pct +
        '%;"></div></div>' +
        '<button type="button" class="mc-rpc-btn mc-rpc-btn--ghost mc-rpc-btn--chest-prev" id="mcRpcOpenRewardPreview">' +
        esc(T('rpc_view_reward_preview')) +
        '</button>' +
        '<div class="mc-rpc-chest-foot">' +
        esc(featuredLabel || T('rpc_featured_badge')) +
        '</div></aside></div></div>' +
        '<div class="mc-rpc-mobile-tabs" role="tablist">' +
        ['progress', 'quests', 'badges', 'titles', 'avatars', 'rewards']
          .map(function (tab) {
            var lab =
              tab === 'progress'
                ? T('rpc_tab_progress')
                : tab === 'quests'
                  ? T('rpc_tab_quests')
                  : tab === 'badges'
                    ? T('rpc_tab_badges')
                    : tab === 'titles'
                      ? T('rpc_tab_titles')
                      : tab === 'avatars'
                        ? T('rpc_tab_avatars')
                        : T('rpc_tab_rewards');
            return (
              '<button type="button" class="mc-rpc-tab" role="tab" data-mtab="' +
              tab +
              '" aria-selected="' +
              (uiState.mobileTab === tab ? 'true' : 'false') +
              '">' +
              esc(lab) +
              '</button>'
            );
          })
          .join('') +
        '</div>' +
        '<div class="mc-rpc-panels">' +
        '<section data-panel="progress" class="' +
        (uiState.mobileTab === 'progress' ? 'mc-rpc-panel--on' : '') +
        '">' +
        '<h4 class="mc-rpc-panel-h">' +
        esc(T('rpc_sec_milestones')) +
        '</h4>' +
        '<div class="mc-rpc-glass-panel mc-rpc-milestone-card" id="mcRpcMilestones">' +
        '<div class="mc-rpc-mile-card-head">' +
        '<div><div class="name mc-rpc-mile-title">' +
        esc(mileTitle) +
        '</div><div class="mc-rpc-reward-line" style="margin-top:6px;">' +
        esc(mileSub) +
        '</div></div>' +
        '<button type="button" class="mc-rpc-btn mc-rpc-btn--ghost mc-rpc-btn--sm" data-mile-view-all="1">' +
        esc(T('rpc_milestone_view_all')) +
        '</button></div>' +
        '<div class="mc-rpc-ml-road">' +
        '<div class="mc-rpc-ml-road__rail" aria-hidden="true"></div>' +
        '<div class="mc-rpc-ml-road__shine" aria-hidden="true"></div>' +
        '<div class="mc-rpc-ml-track">' +
        milestonePathHtml +
        '</div></div><div class="mc-rpc-mile-bar"><div class="mc-rpc-mile-fill" style="width:' +
        progM +
        '%;"></div></div></div>' +
        '<h4 class="mc-rpc-panel-h" style="margin-top:18px;">' +
        esc(T('rpc_sec_streak_rewards')) +
        '</h4>' +
        '<div class="mc-rpc-glass-panel mc-rpc-streak-panel">' +
        '<div class="mc-rpc-streak-banner">' +
        esc(T('rpc_streak_banner')) +
        '</div>' +
        '<p class="mc-rpc-streak-current">' +
        esc(tf('rpc_streak_current_line', { n: String(streakS) })) +
        '</p>' +
        esc(shieldLine) +
        '<div class="mc-rpc-streak-scroll">' +
        streakCardsHtml +
        '</div></div></section>' +
        '<section data-panel="quests" class="' +
        (uiState.mobileTab === 'quests' ? 'mc-rpc-panel--on' : '') +
        '">' +
        '<h4 class="mc-rpc-panel-h">' +
        esc(T('rpc_sec_daily')) +
        '</h4>' +
        '<p class="mc-rpc-daily-reset">' +
        esc(T('rpc_daily_reset')) +
        '</p>' +
        '<div class="mc-rpc-daily-scroll">' +
        dailyHtml +
        '</div>' +
        (bonusReady
          ? '<div style="margin-top:10px;"><button type="button" class="mc-rpc-btn mc-rpc-btn--primary mc-rpc-claim-daily-bonus">' +
            esc(T('rpc_claim_daily_crate')) +
            ' (+' +
            bonusCfg.xp +
            ' XP)</button></div>'
          : '') +
        '<h4 class="mc-rpc-panel-h" style="margin-top:20px;">' +
        esc(T('rpc_sec_weekly')) +
        '</h4>' +
        '<div class="mc-rpc-week-grid">' +
        weekHtml +
        '</div>' +
        (weekBonusReady
          ? '<div style="margin-top:12px;"><button type="button" class="mc-rpc-btn mc-rpc-btn--gold mc-rpc-claim-weekly-bonus">' +
            esc(T('rpc_claim_weekly_crate')) +
            ' (+' +
            bonusW.xp +
            ' XP, +' +
            bonusW.rp +
            ' RP, +' +
            (bonusW.streakShield || 1) +
            ' ' +
            T('rpc_shield') +
            ')</button></div>'
          : '') +
        '<h4 class="mc-rpc-panel-h" style="margin-top:22px;">' +
        esc(T('rpc_sec_main_quest')) +
        '</h4>' +
        '<div class="mc-rpc-glass-panel"><div class="mc-rpc-chapter-rail">' +
        chHtml +
        '</div></div></section>' +
        '<section data-panel="badges" class="' +
        (uiState.mobileTab === 'badges' ? 'mc-rpc-panel--on' : '') +
        '">' +
        '<h4 class="mc-rpc-panel-h">' +
        esc(T('rpc_sec_badges')) +
        '</h4>' +
        '<div class="mc-rpc-badge-filters">' +
        '<div class="mc-rpc-filter-row">' +
        scopeRow +
        '</div><div class="mc-rpc-filter-row mc-rpc-filter-row--cat">' +
        catRow +
        '</div></div>' +
        '<div class="mc-rpc-badge-wall">' +
        badgeHtml +
        '</div></section>' +
        '<section data-panel="titles" class="' +
        (uiState.mobileTab === 'titles' ? 'mc-rpc-panel--on' : '') +
        '">' +
        '<h4 class="mc-rpc-panel-h">' +
        esc(T('rpc_sec_titles')) +
        '</h4>' +
        '<div class="mc-rpc-glass-panel mc-rpc-titles-grid">' +
        titlesHtml +
        '</div></section>' +
        '<section data-panel="avatars" class="' +
        (uiState.mobileTab === 'avatars' ? 'mc-rpc-panel--on' : '') +
        '">' +
        '<h4 class="mc-rpc-panel-h">' +
        esc(T('rpc_sec_avatars')) +
        '</h4>' +
        '<p class="mc-rpc-avatar-intro">' +
        esc(avatarIntroText) +
        '</p>' +
        '<div class="mc-rpc-badge-filters">' +
        '<div class="mc-rpc-filter-row">' +
        avatarScopeRow +
        '</div></div>' +
        '<div class="mc-rpc-avatar-wall">' +
        (avatarsHtml || '<p class="mc-rpc-reward-line">' + esc(T('rpc_avatar_empty')) + '</p>') +
        '</div></section>' +
        '<section data-panel="rewards" class="' +
        (uiState.mobileTab === 'rewards' ? 'mc-rpc-panel--on' : '') +
        '">' +
        '<h4 class="mc-rpc-panel-h">' +
        esc(T('rpc_sec_feed')) +
        '</h4>' +
        '<div class="mc-rpc-glass-panel"><ul class="mc-rpc-feed" style="list-style:none;padding:0;margin:0;">' +
        feedItems +
        '</ul></div></section>' +
        '</div>' +
        '<div class="mc-rpc-toast-host" role="status" aria-live="polite"></div>' +
        '</div>' +
        modalHtml +
        '</div>';

      container.innerHTML = html;

      try {
        var reduceMotion =
          global.matchMedia &&
          global.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion) {
          global.requestAnimationFrame(function () {
            global.requestAnimationFrame(function () {
              container.querySelectorAll('.mc-rpc-xp-fill, .mc-rpc-mile-fill').forEach(function (el) {
                var w = el.style && el.style.width;
                if (!w) return;
                el.style.width = '0%';
                void el.offsetWidth;
                el.style.width = w;
              });
              container.querySelectorAll('.mc-rpc-mini-bar > div').forEach(function (el) {
                var w = el.style && el.style.width;
                if (!w) return;
                el.style.width = '0%';
                void el.offsetWidth;
                el.style.width = w;
              });
            });
          });
        }
      } catch (eAnim) {}

      container.querySelectorAll('[data-mtab]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          uiState.mobileTab = btn.getAttribute('data-mtab') || 'progress';
          render();
        });
      });

      container.querySelectorAll('[data-badge-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          uiState.badgeFilter = btn.getAttribute('data-badge-filter') || 'all';
          render();
        });
      });

      container.querySelectorAll('[data-badge-scope]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          uiState.badgeScope = btn.getAttribute('data-badge-scope') || 'all';
          render();
        });
      });

      container.querySelectorAll('[data-avatar-scope]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          uiState.avatarScope = btn.getAttribute('data-avatar-scope') || 'all';
          render();
        });
      });

      var hb = container.querySelector('#mcRpcHelpBtn');
      if (hb) {
        hb.addEventListener('click', function () {
          showRpcToast(T('rpc_help_tip'));
        });
      }

      var prevBtn = container.querySelector('#mcRpcOpenRewardPreview');
      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          uiState.rewardModalOpen = true;
          render();
        });
      }

      container.querySelectorAll('[data-close-reward-modal]').forEach(function (el) {
        el.addEventListener('click', function () {
          uiState.rewardModalOpen = false;
          render();
        });
      });

      container.querySelectorAll('[data-mtab-jump]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var tab = btn.getAttribute('data-mtab-jump');
          if (tab) uiState.mobileTab = tab;
          uiState.rewardModalOpen = false;
          render();
          try {
            var pan = container.querySelector('[data-panel="' + tab + '"]');
            if (pan) pan.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (ePan) {}
        });
      });

      var mv = container.querySelector('[data-mile-view-all]');
      if (mv) {
        mv.addEventListener('click', function () {
          uiState.mobileTab = 'progress';
          render();
          try {
            var el = container.querySelector('#mcRpcMilestones');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch (eM) {}
        });
      }

      container.querySelectorAll('.mc-rpc-streak-card').forEach(function (card) {
        card.addEventListener('click', function () {
          if (card.getAttribute('data-streak-state') !== 'claim') return;
          var d = Number(card.getAttribute('data-streak-day') || 0);
          showRpcToast(tf('rpc_toast_streak_claimed', { day: String(d) }), true);
          addStreakClaimedDay(d);
          render();
        });
      });

      var ci = container.querySelector('#mcRpcCheckIn');
      if (ci) {
        ci.addEventListener('click', function () {
          if (api.runDailyCheckIn) api.runDailyCheckIn();
        });
      }

      container.querySelectorAll('.mc-rpc-go').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-go');
          if (id === 'dq_sign_in' && api.runDailyCheckIn) api.runDailyCheckIn();
          else if (id === 'dq_specimen' || id === 'dq_photo') api.switchSection && api.switchSection('specimens-workspace');
          else if (id === 'dq_restore') api.switchSection && api.switchSection('photo-restoration-lab');
          else if (id === 'dq_collection_view') {
            var st0 = api.getState();
            var rp0 = mergeResearcherProgress(st0.researcherProgress || {});
            rp0.flags = rp0.flags || {};
            rp0.flags.viewedCollectionProgress = true;
            pushFeed(rp0, 'rpc_feed_collection_viewed');
            persist({ researcherProgress: rp0 }, function (res) {
              if (res && res.ok && api.reloadAll) api.reloadAll();
              else render();
            });
          }
        });
      });

      function claimDaily(id, xp, rpAmt) {
        var st = api.getState();
        var cfg2 = getMergedConfig(st);
        var rp2 = mergeResearcherProgress(st.researcherProgress || {});
        var prof = Object.assign({}, st.profile || {});
        if (rp2.daily.claimed && rp2.daily.claimed[id]) return;
        rp2.daily.claimed = rp2.daily.claimed || {};
        rp2.daily.claimed[id] = true;
        var r1 = applyXp(prof, Number(xp) || 0, cfg2);
        rp2.researchPoints = Math.max(0, Math.floor(Number(rp2.researchPoints) || 0) + Math.floor(Number(rpAmt) || 0));
        pushFeed(rp2, 'rpc_feed_daily_quest_xp', { xp: String(xp) });
        if (r1.leveled > 0) pushFeed(rp2, 'rpc_feed_level_up');
        persist({ researcherProgress: rp2, profile: r1.profile }, function (res) {
          if (res && res.ok) {
            burstHero();
            showRpcToast(tf('rpc_feed_daily_quest_xp', { xp: String(xp) }));
            if (api.reloadAll) api.reloadAll();
            else render();
          } else if (api.toast) api.toast((res && res.message) || T('rpc_toast_save_failed'));
        });
      }

      container.querySelectorAll('.mc-rpc-claim-daily').forEach(function (btn) {
        btn.addEventListener('click', function () {
          claimDaily(btn.getAttribute('data-daily-claim'), btn.getAttribute('data-xp'), btn.getAttribute('data-rp'));
        });
      });

      var cdb = container.querySelector('.mc-rpc-claim-daily-bonus');
      if (cdb) {
        cdb.addEventListener('click', function () {
          var st = api.getState();
          var cfg2 = getMergedConfig(st);
          var rp2 = mergeResearcherProgress(st.researcherProgress || {});
          var prof = Object.assign({}, st.profile || {});
          if (rp2.daily.claimedDailyBonus) return;
          rp2.daily.claimedDailyBonus = true;
          var b = cfg2.dailyBonus || { xp: 50, rp: 5 };
          var r1 = applyXp(prof, Number(b.xp) || 0, cfg2);
          rp2.researchPoints = Math.max(0, Math.floor(Number(rp2.researchPoints) || 0) + Math.floor(Number(b.rp) || 0));
          pushFeed(rp2, 'rpc_feed_daily_crate');
          persist({ researcherProgress: rp2, profile: r1.profile }, function (res) {
            if (res && res.ok && api.reloadAll) api.reloadAll();
          });
        });
      }

      container.querySelectorAll('.mc-rpc-claim-weekly').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-weekly-claim');
          var st = api.getState();
          var cfg2 = getMergedConfig(st);
          var rp2 = mergeResearcherProgress(st.researcherProgress || {});
          var prof = Object.assign({}, st.profile || {});
          if (rp2.weekly.claimed && rp2.weekly.claimed[id]) return;
          rp2.weekly.claimed = rp2.weekly.claimed || {};
          rp2.weekly.claimed[id] = true;
          var r1 = applyXp(prof, Number(btn.getAttribute('data-xp')) || 0, cfg2);
          rp2.researchPoints = Math.max(0, Math.floor(Number(rp2.researchPoints) || 0) + Math.floor(Number(btn.getAttribute('data-rp')) || 0));
          pushFeed(rp2, 'rpc_feed_weekly_quest');
          persist({ researcherProgress: rp2, profile: r1.profile }, function (res) {
            if (res && res.ok && api.reloadAll) api.reloadAll();
          });
        });
      });

      var cw = container.querySelector('.mc-rpc-claim-weekly-bonus');
      if (cw) {
        cw.addEventListener('click', function () {
          var st = api.getState();
          var cfg2 = getMergedConfig(st);
          var rp2 = mergeResearcherProgress(st.researcherProgress || {});
          var prof = Object.assign({}, st.profile || {});
          if (rp2.weekly.claimedWeeklyBonus) return;
          rp2.weekly.claimedWeeklyBonus = true;
          var b = cfg2.weeklyBonus || { xp: 500, rp: 30, streakShield: 1 };
          var r1 = applyXp(prof, Number(b.xp) || 0, cfg2);
          rp2.researchPoints = Math.max(0, Math.floor(Number(rp2.researchPoints) || 0) + Math.floor(Number(b.rp) || 0));
          rp2.streakShields = Math.max(0, Math.floor(Number(rp2.streakShields) || 0) + Math.floor(Number(b.streakShield) || 0));
          pushFeed(rp2, 'rpc_feed_weekly_crate');
          persist({ researcherProgress: rp2, profile: r1.profile }, function (res) {
            if (res && res.ok && api.reloadAll) api.reloadAll();
          });
        });
      }

      container.querySelectorAll('.mc-rpc-equip-title').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var tid = btn.getAttribute('data-title-id');
          var st = api.getState();
          var rp2 = mergeResearcherProgress(st.researcherProgress || {});
          rp2.equippedTitleId = tid;
          pushFeed(rp2, 'rpc_feed_title_equipped');
          persist({ researcherProgress: rp2 }, function (res) {
            if (res && res.ok && api.reloadAll) api.reloadAll();
          });
        });
      });

      container.querySelectorAll('.mc-rpc-equip-avatar').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var aid = btn.getAttribute('data-avatar-id');
          var st = api.getState();
          var cfg2 = getMergedConfig(st);
          var rp2 = mergeResearcherProgress(st.researcherProgress || {});
          var ad = avatarById(cfg2, aid);
          var guestTest2 =
            typeof api.isGuestAvatarTestMode === 'function' && !!api.isGuestAvatarTestMode();
          if (!ad || !isAvatarUnlocked(ad, computeStats(st, rp2, cfg2), guestTest2)) return;
          rp2.equippedAvatarId = aid;
          pushFeed(rp2, 'rpc_feed_avatar_equipped');
          persist({ researcherProgress: rp2 }, function (res) {
            if (res && res.ok) {
              if (typeof api.onAvatarEquipped === 'function') api.onAvatarEquipped();
              else if (api.reloadAll) api.reloadAll();
            }
          });
        });
      });

      container.querySelectorAll('.mc-rpc-feature-badge').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var fk = btn.getAttribute('data-fkey');
          var st = api.getState();
          var rp2 = mergeResearcherProgress(st.researcherProgress || {});
          rp2.featuredBadgeKey = fk;
          persist({ researcherProgress: rp2 }, function (res) {
            if (res && res.ok && api.reloadAll) api.reloadAll();
          });
        });
      });

      var cr = container.querySelector('#mcRpcClaimRewards');
      if (cr && !cr.disabled) {
        cr.addEventListener('click', function () {
          var first = container.querySelector('.mc-rpc-claim-daily-bonus, .mc-rpc-claim-weekly-bonus');
          if (first) first.click();
          else if (api.toast) api.toast(T('rpc_toast_no_crate'));
        });
      }
    }

    if (!container._mcRpcLocaleBound) {
      container._mcRpcLocaleBound = true;
      global.addEventListener('mc:localechange', function () {
        if (container.isConnected) render();
      });
    }

    render();
  }

  function mountAvatarPicker(container, api) {
    if (!container || !api || typeof api.getState !== 'function') return;

    if (!container._mcRpcUi) {
      container._mcRpcUi = { avatarScope: 'all' };
    }
    var uiState = container._mcRpcUi;

    function zh() {
      return api.getLang && api.getLang() === 'zh-TW';
    }

    function rpcDocLang_() {
      return zh() ? 'zh-Hant' : 'en';
    }

    function esc(s) {
      return api.escapeHtml ? api.escapeHtml(String(s == null ? '' : s)) : String(s == null ? '' : s);
    }

    function T(key) {
      if (api.tr && typeof api.tr === 'function') return api.tr(key);
      return key;
    }

    function tf(key, vars) {
      var s = T(key);
      if (vars && typeof vars === 'object') {
        Object.keys(vars).forEach(function (k) {
          s = String(s).split('{{' + k + '}}').join(String(vars[k]));
        });
      }
      return s;
    }

    function render() {
      var state = api.getState();
      var cfg = getMergedConfig(state);
      var rp = mergeResearcherProgress(state.researcherProgress || {});
      var stats = computeStats(state, rp, cfg);
      var guestAvatarTest =
        typeof api.isGuestAvatarTestMode === 'function' && !!api.isGuestAvatarTestMode();
      var picker = buildAvatarPickerMarkup({
        cfg: cfg,
        rp: rp,
        stats: stats,
        guestAvatarTest: guestAvatarTest,
        avatarScope: uiState.avatarScope || 'all',
        esc: esc,
        T: T,
        tf: tf,
        zh: zh
      });

      container.innerHTML =
        '<div class="mc-rpc-account-avatars mc-rpc-root" lang="' + rpcDocLang_() + '">' +
        '<p class="mc-rpc-avatar-intro">' +
        esc(picker.intro) +
        '</p>' +
        '<div class="mc-rpc-badge-filters"><div class="mc-rpc-filter-row">' +
        picker.avatarScopeRow +
        '</div></div>' +
        '<div class="mc-rpc-avatar-wall">' +
        (picker.avatarsHtml || '<p class="mc-rpc-reward-line">' + esc(T('rpc_avatar_empty')) + '</p>') +
        '</div></div>';

      bindAvatarPickerEvents(container, api, uiState, render, {});
    }

    if (!container._mcRpcLocaleBound) {
      container._mcRpcLocaleBound = true;
      global.addEventListener('mc:localechange', function () {
        if (container.isConnected) render();
      });
    }

    render();
  }

  global.MCResearcherProgressCenter = {
    mount: mount,
    mountAvatarPicker: mountAvatarPicker,
    resolveEquippedAvatar: resolveEquippedAvatar,
    avatarVisualHtml: avatarVisualHtml,
    avatarById: avatarById,
    isAvatarUnlocked: isAvatarUnlocked,
    computeStats: computeStats,
    mergeResearcherProgress: mergeResearcherProgress
  };

  /** Hook: local mock daily check-in can refresh quest baseline after streak bump */
  global.mcRpcOnDailyCheckIn_ = function (db) {
    try {
      var rp = mergeResearcherProgress((db && db.researcherProgress) || {});
      rp.feed = rp.feed || [];
      var zh = (typeof navigator !== 'undefined' && navigator.language || '').toLowerCase().indexOf('zh') >= 0;
      rp.feed.unshift({ t: new Date().toISOString(), key: 'rpc_feed_checkin_done' });
      db.researcherProgress = rp;
    } catch (e) {}
  };
})(typeof window !== 'undefined' ? window : this);
