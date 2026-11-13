/**
 * Husbandry Log — Breeding & lineage module
 * Scope: #section-husbandry-log only (via MCHusbandryBreeding API)
 */
(function (global) {
  'use strict';

  var EVENT_TYPES = [
    'pairing', 'mating', 'egg_laying', 'birth', 'clutch', 'incubation_start', 'incubation_check',
    'hatching', 'larva_found', 'pupa', 'emergence', 'offspring_separated', 'failed_egg', 'failed_larva', 'parenting_behavior',
  ];

  var OFFSPRING_STAGES = ['egg', 'larva', 'nymph', 'juvenile', 'subadult', 'adult', 'pupa', 'unknown'];

  function ensureState(state) {
    if (!Array.isArray(state.breedingPairs)) state.breedingPairs = [];
    if (!Array.isArray(state.breedingEvents)) state.breedingEvents = [];
    if (!Array.isArray(state.offspring)) state.offspring = [];
    if (!state.ui) state.ui = {};
    if (!state.ui.breedingDraft || typeof state.ui.breedingDraft !== 'object') {
      state.ui.breedingDraft = defaultDraft_();
    }
  }

  function defaultDraft_(pet) {
    return {
      pairName: '',
      species: pet ? (pet.commonName || pet.chineseName || '') : '',
      malePetId: '',
      femalePetId: '',
      unknownParentIds: [],
      pairStatus: 'active',
      pairStartDate: '',
      pairNotes: '',
      pairPhoto: '',
      eventPairId: '',
      eventDate: '',
      matingObserved: 'yes',
      matingDuration: '',
      matingBehavior: '',
      matingAggression: 'no',
      layingType: 'egg_laying',
      layingCount: '',
      layingUnit: 'egg',
      layingLocation: 'other',
      layingRemoved: false,
      clutchCode: '',
      hatchStage: 'hatching',
      hatchCount: '',
      hatchSuccess: '',
      hatchFail: '',
      hatchCreateOffspring: false,
      hatchBatchOnly: true,
      eventType: 'incubation_start',
      failedCount: '',
      note: '',
      photo: '',
    };
  }

  function petById_(state, id) {
    if (!id) return null;
    return state.pets.filter(function (p) { return p.id === id; })[0] || null;
  }

  function petName_(state, id) {
    var p = petById_(state, id);
    return p ? p.petName : '';
  }

  function pairsForPet_(state, petId) {
    return state.breedingPairs.filter(function (pair) {
      if (pair.malePetId === petId || pair.femalePetId === petId) return true;
      return Array.isArray(pair.unknownParentIds) && pair.unknownParentIds.indexOf(petId) >= 0;
    });
  }

  function activePairForPet_(state, petId) {
    var pairs = pairsForPet_(state, petId);
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i].status === 'active' || pairs[i].status === 'observing') return pairs[i];
    }
    return pairs[0] || null;
  }

  function offspringAsParent_(state, petId) {
    return state.offspring.filter(function (o) {
      return o.fatherPetId === petId || o.motherPetId === petId || o.linkedPetId === petId;
    });
  }

  function offspringLinkedToPet_(state, petId) {
    return state.offspring.filter(function (o) { return o.linkedPetId === petId; })[0] || null;
  }

  function offspringChildrenOfPet_(state, petId) {
    return state.offspring.filter(function (o) {
      return o.fatherPetId === petId || o.motherPetId === petId;
    });
  }

  function eventsForPet_(state, petId) {
    return state.breedingEvents.filter(function (e) {
      return e.petId === petId || pairInvolvesPet_(state, e.pairId, petId);
    });
  }

  function eventsForPair_(state, pairId) {
    return state.breedingEvents.filter(function (e) { return e.pairId === pairId; });
  }

  function pairInvolvesPet_(state, pairId, petId) {
    var pair = state.breedingPairs.filter(function (p) { return p.id === pairId; })[0];
    if (!pair) return false;
    return pair.malePetId === petId || pair.femalePetId === petId ||
      (Array.isArray(pair.unknownParentIds) && pair.unknownParentIds.indexOf(petId) >= 0);
  }

  function pairById_(state, id) {
    return state.breedingPairs.filter(function (p) { return p.id === id; })[0] || null;
  }

  function lastEventForPet_(state, petId) {
    var evs = eventsForPet_(state, petId).slice().sort(function (a, b) {
      return String(b.date || b.createdAt).localeCompare(String(a.date || a.createdAt));
    });
    return evs[0] || null;
  }

  function formatBreedDate_(dateStr) {
    var s = String(dateStr || '').slice(0, 10);
    return s ? s.replace(/-/g, '/') : '';
  }

  function breedEventLabel_(h, type) {
    var key = 'breedEvent_' + type;
    return h.t(key) !== key ? h.t(key) : type;
  }

  function offspringAliveCount_(children) {
    return children.filter(function (o) { return o.status !== 'deceased'; }).length;
  }

  function latestClutchCode_(state, pairId) {
    if (!pairId) return '';
    var evs = eventsForPair_(state, pairId).filter(function (e) {
      return e.type === 'clutch' || e.type === 'egg_laying' || e.type === 'birth';
    });
    if (!evs.length) return '';
    evs.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    var hit = evs[0];
    if (hit.note) return hit.note;
    if (Array.isArray(hit.tags)) {
      for (var i = 0; i < hit.tags.length; i++) {
        if (hit.tags[i] && hit.tags[i] !== 'clutch') return hit.tags[i];
      }
    }
    return '';
  }

  function summary_(state, pet, h) {
    var pair = activePairForPet_(state, pet.id);
    var asOffspring = offspringLinkedToPet_(state, pet.id);
    var children = offspringChildrenOfPet_(state, pet.id);
    var childCount = children.length;
    var childAlive = offspringAliveCount_(children);
    var statusKey = 'breedStatusNone';
    var statusTone = 'muted';
    var pairLabel = '';
    if (pair) {
      statusKey = pair.status === 'observing' ? 'breedStatusObserving' : 'breedStatusActive';
      statusTone = pair.status === 'failed' ? 'danger' : (pair.status === 'successful' ? 'ok' : 'watch');
      var male = petName_(state, pair.malePetId) || '?';
      var female = petName_(state, pair.femalePetId) || '?';
      pairLabel = male + ' × ' + female;
      if (pair.name) pairLabel = pair.name;
    }
    var last = lastEventForPet_(state, pet.id);
    var lastLine = '';
    if (last) {
      lastLine = breedEventLabel_(h, last.type) + ' ' + formatBreedDate_(last.date);
    }
    return {
      statusKey: statusKey,
      statusTone: statusTone,
      pair: pair,
      pairLabel: pairLabel,
      parentInfo: asOffspring,
      childCount: childCount,
      childAlive: childAlive,
      hasParents: !!(asOffspring && (asOffspring.fatherPetId || asOffspring.motherPetId)),
      lastEvent: last,
      lastLine: lastLine,
      paired: !!pair,
    };
  }

  function statusLabel_(h, status) {
    return h.t('breedPairStatus_' + status) || status;
  }

  function renderHeroBlock_(state, pet, h) {
    var s = summary_(state, pet, h);
    var parentLine = s.hasParents
      ? h.t('breedHeroParentsLinked')
      : h.t('breedHeroParentsNone');
    return (
      '<div class="hlc-breed-hero">' +
      '<span class="hlc-breed-badge hlc-breed-badge--' + s.statusTone + '">' + h.esc(h.t(s.statusKey)) + '</span>' +
      (s.pairLabel ? '<p class="hlc-breed-hero__pair">' + h.esc(h.t('breedHeroPair')) + '：' + h.esc(s.pairLabel) + '</p>' : '') +
      '<p class="hlc-breed-hero__line">' + h.esc(h.t('breedHeroParents')) + '：' + h.esc(parentLine) + '</p>' +
      '<p class="hlc-breed-hero__line">' + h.esc(h.t('breedHeroOffspring')) + '：' + h.esc(String(s.childCount)) + '</p>' +
      '<div class="hlc-breed-hero__actions">' +
      '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="breed-open-pair">' + h.esc(h.t('breedCreatePair')) + '</button>' +
      '<button type="button" class="hlc-btn hlc-btn--primary hlc-btn--sm" data-hl-action="breed-open-log">' + h.esc(h.t('breedAddLog')) + '</button>' +
      '</div></div>'
    );
  }

  function renderCardStrip_(state, pet, h) {
    var s = summary_(state, pet, h);
    if (!s.paired && !s.childCount && !s.lastLine) {
      return '<p class="hlc-pet-card__breed hlc-pet-card__breed--empty">' + h.esc(h.t('breedCardNone')) + '</p>';
    }
    return (
      '<div class="hlc-pet-card__breed">' +
      '<p class="hlc-pet-card__breed-line"><span>' + h.esc(h.t('breedCardLabel')) + '</span><strong>' + h.esc(h.t(s.statusKey)) + '</strong></p>' +
      (s.childCount ? '<p class="hlc-pet-card__breed-line"><span>' + h.esc(h.t('breedHeroOffspring')) + '</span><strong>' + h.esc(String(s.childCount)) + '</strong></p>' : '') +
      (s.lastLine ? '<p class="hlc-pet-card__breed-recent">' + h.esc(h.t('breedCardRecent')) + '：' + h.esc(s.lastLine) + '</p>' : '') +
      '</div>'
    );
  }

  function renderProfileBreedingSummary_(state, pet, h) {
    var pair = activePairForPet_(state, pet.id);
    var children = offspringChildrenOfPet_(state, pet.id);
    if (!pair && !children.length) return '';
    var alive = offspringAliveCount_(children);
    var batch = pair ? (latestClutchCode_(state, pair.id) || pair.name || pair.id) : '';
    return (
      '<dl class="hlc-dl hlc-dl--breed">' +
      (pair ? '<div><dt>' + h.esc(h.t('breedFather')) + '</dt><dd>' + (pair.malePetId ? renderPetMiniCard_(state, pair.malePetId, 'breedFather', h) : '—') + '</dd></div>' : '') +
      (pair ? '<div><dt>' + h.esc(h.t('breedMother')) + '</dt><dd>' + (pair.femalePetId ? renderPetMiniCard_(state, pair.femalePetId, 'breedMother', h) : '—') + '</dd></div>' : '') +
      (batch ? '<div><dt>' + h.esc(h.t('breedBatch')) + '</dt><dd>' + h.esc(batch) + '</dd></div>' : '') +
      (children.length ? '<div><dt>' + h.esc(h.t('breedOffspringTitle')) + '</dt><dd>' + h.esc(String(children.length)) + ' ' + h.esc(h.t('breedOffspringUnit')) + '</dd></div>' : '') +
      (children.length ? '<div><dt>' + h.esc(h.t('breedOffspringAlive')) + '</dt><dd>' + h.esc(String(alive)) + ' ' + h.esc(h.t('breedOffspringUnit')) + '</dd></div>' : '') +
      '</dl>'
    );
  }

  function breedRecordCard_(key, icon, titleKey, hintKey, h) {
    return (
      '<button type="button" class="hlc-breed-card" data-hl-action="breed-open-' + key + '">' +
      '<span class="hlc-breed-card__icon">' + h.svgIcon(icon) + '</span>' +
      '<span class="hlc-breed-card__body">' +
      '<span class="hlc-breed-card__title">' + h.esc(h.t(titleKey)) + '</span>' +
      '<span class="hlc-breed-card__hint">' + h.esc(h.t(hintKey)) + '</span></span></button>'
    );
  }

  function renderLogsSection_(state, pet, h) {
    return (
      '<section class="hlc-breed-section">' +
      '<h2 class="hlc-section-title">' + h.esc(h.t('breedSectionTitle')) + '</h2>' +
      '<div class="hlc-breed-grid">' +
      breedRecordCard_('pair', 'link', 'breedCardPair', 'breedCardPairHint', h) +
      breedRecordCard_('mating', 'heart', 'breedCardMating', 'breedCardMatingHint', h) +
      breedRecordCard_('laying', 'egg', 'breedCardLaying', 'breedCardLayingHint', h) +
      breedRecordCard_('hatch', 'spark', 'breedCardHatch', 'breedCardHatchHint', h) +
      breedRecordCard_('incubation', 'status', 'breedCardIncubation', 'breedCardIncubationHint', h) +
      breedRecordCard_('failed', 'alert', 'breedCardFailed', 'breedCardFailedHint', h) +
      '</div>' +
      renderFamilyTree_(state, pet, h) +
      '</section>'
    );
  }

  function renderPetMiniCard_(state, petId, roleKey, h) {
    if (!petId) return '';
    var pet = petById_(state, petId);
    if (!pet) return '';
    return (
      '<button type="button" class="hlc-breed-mini-card" data-hl-open-pet="' + h.esc(petId) + '">' +
      '<span class="hlc-breed-mini-card__role">' + h.esc(h.t(roleKey)) + '</span>' +
      '<strong>' + h.esc(pet.petName) + '</strong>' +
      '</button>'
    );
  }

  function renderFamilyTree_(state, pet, h) {
    var asChild = offspringLinkedToPet_(state, pet.id);
    var children = offspringChildrenOfPet_(state, pet.id);
    var pair = activePairForPet_(state, pet.id);
    if (!asChild && !children.length && !pair) {
      return '<p class="hlc-breed-tree-empty">' + h.esc(h.t('breedTreeEmpty')) + '</p>';
    }
    var fatherId = asChild ? asChild.fatherPetId : (pair ? pair.malePetId : '');
    var motherId = asChild ? asChild.motherPetId : (pair ? pair.femalePetId : '');
    var childHtml = children.length
      ? children.slice(0, 8).map(function (o) {
        var label = o.name || h.t('breedOffspringItem');
        var open = o.linkedPetId
          ? '<button type="button" class="hlc-breed-mini-card" data-hl-open-pet="' + h.esc(o.linkedPetId) + '"><strong>' + h.esc(label) + '</strong></button>'
          : '<span class="hlc-breed-mini-card hlc-breed-mini-card--static"><strong>' + h.esc(label) + '</strong></span>';
        return open;
      }).join('')
      : '<span class="hlc-breed-tree-empty-inline">' + h.esc(h.t('breedOffspringNoneShort')) + '</span>';
    return (
      '<div class="hlc-breed-tree">' +
      '<h3 class="hlc-breed-tree__title">' + h.esc(h.t('breedTreeTitle')) + '</h3>' +
      '<div class="hlc-breed-tree__layout">' +
      '<div class="hlc-breed-tree__parents">' +
      renderPetMiniCard_(state, fatherId, 'breedFather', h) +
      renderPetMiniCard_(state, motherId, 'breedMother', h) +
      '</div>' +
      '<div class="hlc-breed-tree__connector" aria-hidden="true"></div>' +
      '<div class="hlc-breed-tree__self hlc-breed-mini-card hlc-breed-mini-card--self">' +
      '<span class="hlc-breed-mini-card__role">' + h.esc(h.t('breedTreeSelf')) + '</span>' +
      '<strong>' + h.esc(pet.petName) + '</strong></div>' +
      '<div class="hlc-breed-tree__connector hlc-breed-tree__connector--down" aria-hidden="true"></div>' +
      '<div class="hlc-breed-tree__children">' + childHtml + '</div>' +
      '</div></div>'
    );
  }

  function renderProfileParents_(state, pet, h) {
    var rec = offspringLinkedToPet_(state, pet.id);
    if (!rec || (!rec.fatherPetId && !rec.motherPetId)) {
      return '<p class="hlc-breed-empty">' + h.esc(h.t('breedParentsEmpty')) + '</p>';
    }
    var pair = rec.parentPairId ? pairById_(state, rec.parentPairId) : null;
    return (
      '<dl class="hlc-dl hlc-dl--breed">' +
      '<div><dt>' + h.esc(h.t('breedFather')) + '</dt><dd>' + (rec.fatherPetId ? renderPetMiniCard_(state, rec.fatherPetId, 'breedFather', h) : '—') + '</dd></div>' +
      '<div><dt>' + h.esc(h.t('breedMother')) + '</dt><dd>' + (rec.motherPetId ? renderPetMiniCard_(state, rec.motherPetId, 'breedMother', h) : '—') + '</dd></div>' +
      (pair ? '<div><dt>' + h.esc(h.t('breedBatch')) + '</dt><dd>' + h.esc(pair.name || pair.id) + '</dd></div>' : '') +
      '<div><dt>' + h.esc(h.t('breedHatchDate')) + '</dt><dd>' + h.esc(rec.hatchDate || rec.birthDate || '—') + '</dd></div>' +
      '</dl>'
    );
  }

  function renderProfileOffspring_(state, pet, h) {
    var list = offspringChildrenOfPet_(state, pet.id);
    if (!list.length) {
      return '<p class="hlc-breed-empty">' + h.esc(h.t('breedOffspringEmpty')) + '</p>';
    }
    var alive = list.filter(function (o) { return o.status !== 'deceased'; }).length;
    var rows = list.map(function (o) {
      var stage = h.t('breedStage_' + (o.stage || 'unknown'));
      var linkBtn = o.linkedPetId
        ? ''
        : '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="breed-link-pet" data-hl-breed-offspring="' + h.esc(o.id) + '">' + h.esc(h.t('breedCreatePetCard')) + '</button>';
      var statusBtn = o.status === 'deceased'
        ? '<span class="hlc-breed-offspring-row__status hlc-breed-offspring-row__status--gone">' + h.esc(h.t('breedOffspringDeceased')) + '</span>'
        : '<button type="button" class="hlc-btn hlc-btn--ghost hlc-btn--sm" data-hl-action="breed-mark-deceased" data-hl-breed-offspring="' + h.esc(o.id) + '">' + h.esc(h.t('breedMarkDeceased')) + '</button>';
      return (
        '<div class="hlc-breed-offspring-row">' +
        '<div class="hlc-breed-offspring-row__main">' +
        '<strong>' + h.esc(o.name || h.t('breedOffspringItem')) + '</strong>' +
        '<span class="hlc-breed-offspring-row__stage">' + h.esc(stage) + '</span></div>' +
        linkBtn + statusBtn +
        '</div>'
      );
    }).join('');
    return (
      '<p class="hlc-breed-offspring-count">' + h.esc(h.t('breedOffspringCount')) + '：' + h.esc(String(list.length)) + ' · ' + h.esc(h.t('breedOffspringAlive')) + ' ' + h.esc(String(alive)) + '</p>' +
      '<div class="hlc-breed-offspring-list">' + rows + '</div>'
    );
  }

  function renderTrends_(state, pet, h) {
    var pairs = pairsForPet_(state, pet.id);
    var evs = eventsForPet_(state, pet.id);
    var children = offspringChildrenOfPet_(state, pet.id);
    if (!pairs.length && !evs.length && !children.length) {
      return (
        '<div class="hlc-trends-empty" role="status"><p class="hlc-trends-empty__lead">' + h.esc(h.t('breedTrendsEmpty')) + '</p></div>'
      );
    }
    var layTotal = 0;
    var hatchTotal = 0;
    var successPairs = pairs.filter(function (p) { return p.status === 'successful'; }).length;
    evs.forEach(function (e) {
      if (e.type === 'egg_laying' || e.type === 'birth' || e.type === 'clutch') layTotal += parseInt(e.count, 10) || 0;
      if (e.type === 'hatching' || e.type === 'emergence' || e.type === 'birth') hatchTotal += parseInt(e.count, 10) || 0;
    });
    var stageMap = {};
    children.forEach(function (o) {
      var st = o.stage || 'unknown';
      stageMap[st] = (stageMap[st] || 0) + 1;
    });
    var stageBars = OFFSPRING_STAGES.filter(function (st) { return stageMap[st]; }).map(function (st) {
      var n = stageMap[st];
      var pct = children.length ? Math.round((n / children.length) * 100) : 0;
      return (
        '<div class="hlc-trend-feed-row">' +
        '<span class="hlc-trend-feed-row__label">' + h.esc(h.t('breedStage_' + st)) + '</span>' +
        '<div class="hlc-trend-bar hlc-trend-bar--inline"><span class="hlc-trend-bar__fill hlc-trend-bar__fill--ok" style="width:' + pct + '%"></span></div>' +
        '<span class="hlc-trend-feed-row__count">' + h.esc(String(n)) + '</span></div>'
      );
    }).join('');
    var survival = layTotal > 0 ? Math.round((hatchTotal / layTotal) * 100) : 0;
    return (
      '<article class="hlc-trend-card hlc-trend-card--wide hlc-breed-trends">' +
      '<h3>' + h.esc(h.t('breedTrendsTitle')) + '</h3>' +
      '<div class="hlc-breed-stat-grid">' +
      statCell_(h.t('breedStatPairs'), String(pairs.length), h) +
      statCell_(h.t('breedStatSuccess'), String(successPairs), h) +
      statCell_(h.t('breedStatLaid'), String(layTotal), h) +
      statCell_(h.t('breedStatHatched'), String(hatchTotal), h) +
      statCell_(h.t('breedStatSurvival'), String(survival) + '%', h) +
      '</div>' +
      (stageBars ? '<div class="hlc-breed-stage-bars">' + stageBars + '</div>' : '') +
      '</article>'
    );
  }

  function statCell_(label, val, h) {
    return '<div class="hlc-breed-stat"><span>' + h.esc(label) + '</span><strong>' + h.esc(val) + '</strong></div>';
  }

  function petOptionsHtml_(state, pet, fieldName, selectedId, h) {
    if (!state.pets.length) {
      return '<p class="hlc-sheet__hint">' + h.esc(h.t('breedNoPetsForPair')) + '</p>';
    }
    return '<select class="hlc-sheet-select" data-hl-breed-field="' + h.esc(fieldName) + '">' +
      '<option value="">' + h.esc(h.t('breedSelectPet')) + '</option>' +
      state.pets.map(function (p) {
        var sel = p.id === selectedId ? ' selected' : '';
        return '<option value="' + h.esc(p.id) + '"' + sel + '>' + h.esc(p.petName) + '</option>';
      }).join('') +
      '</select>';
  }

  function unknownParentsHtml_(state, pet, selectedIds, excludeIds, h) {
    if (!state.pets.length) {
      return '<p class="hlc-sheet__hint">' + h.esc(h.t('breedNoPetsForPair')) + '</p>';
    }
    var exclude = {};
    (excludeIds || []).forEach(function (id) { if (id) exclude[id] = true; });
    var ids = Array.isArray(selectedIds) ? selectedIds : [];
    var options = state.pets.filter(function (p) {
      return !exclude[p.id];
    }).map(function (p) {
      var sel = ids.indexOf(p.id) >= 0 ? ' selected' : '';
      return '<option value="' + h.esc(p.id) + '"' + sel + '>' + h.esc(p.petName) + '</option>';
    }).join('');
    if (!options) {
      return '<p class="hlc-sheet__hint">' + h.esc(h.t('breedUnknownParentsEmpty')) + '</p>';
    }
    return (
      '<select class="hlc-sheet-select hlc-sheet-select--multi" multiple size="4" data-hl-breed-field="unknownParentIds">' +
      options +
      '</select>' +
      '<p class="hlc-sheet__hint">' + h.esc(h.t('breedUnknownParentsHint')) + '</p>'
    );
  }

  function pairOptionsHtml_(state, pet, selectedId, h) {
    var pairs = pairsForPet_(state, pet.id);
    if (!pairs.length) pairs = state.breedingPairs;
    return '<select class="hlc-sheet-select" data-hl-breed-field="eventPairId">' +
      '<option value="">' + h.esc(h.t('breedSelectPair')) + '</option>' +
      pairs.map(function (p) {
        var sel = p.id === selectedId ? ' selected' : '';
        return '<option value="' + h.esc(p.id) + '"' + sel + '>' + h.esc(p.name || p.id) + '</option>';
      }).join('') +
      '</select>';
  }

  function sheetField_(label, inner, h) {
    return '<label class="hlc-sheet-field"><span class="hlc-sheet-section__label">' + h.esc(label) + '</span>' + inner + '</label>';
  }

  function renderSheet_(state, pet, h) {
    var sheet = state.ui.sheet;
    if (!sheet || sheet.indexOf('breeding-') !== 0) return null;
    if (!pet) return null;
    ensureState(state);
    var d = state.ui.breedingDraft;
    var kind = sheet.replace('breeding-', '');
    var title = h.t('breedSheet_' + kind);
    var inner = '';
    var saveAction = 'breed-save-' + kind;

    if (kind === 'pair') {
      inner =
        sheetField_(h.t('breedPairName'), '<input class="hlc-sheet-input" type="text" value="' + h.esc(d.pairName) + '" data-hl-breed-field="pairName" />', h) +
        sheetField_(h.t('species'), '<input class="hlc-sheet-input" type="text" value="' + h.esc(d.species) + '" data-hl-breed-field="species" />', h) +
        sheetField_(h.t('breedFather'), petOptionsHtml_(state, pet, 'malePetId', d.malePetId, h), h) +
        sheetField_(h.t('breedMother'), petOptionsHtml_(state, pet, 'femalePetId', d.femalePetId, h), h) +
        sheetField_(h.t('breedUnknownParents'), unknownParentsHtml_(state, pet, d.unknownParentIds, [d.malePetId, d.femalePetId], h), h) +
        sheetField_(h.t('breedPairStart'), '<input class="hlc-sheet-input" type="date" value="' + h.esc(d.pairStartDate || h.todayKey()) + '" data-hl-breed-field="pairStartDate" />', h) +
        sheetField_(h.t('breedPairStatus'), '<select class="hlc-sheet-select" data-hl-breed-field="pairStatus">' +
          ['active', 'observing', 'successful', 'failed', 'retired'].map(function (st) {
            return '<option value="' + st + '"' + (d.pairStatus === st ? ' selected' : '') + '>' + h.esc(statusLabel_(h, st)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('profileNote'), '<textarea class="hlc-sheet-input" rows="3" data-hl-breed-field="pairNotes">' + h.esc(d.pairNotes) + '</textarea>', h);
    } else if (kind === 'mating') {
      inner =
        sheetField_(h.t('breedSelectPair'), pairOptionsHtml_(state, pet, d.eventPairId, h), h) +
        sheetField_(h.t('photoDateLabel'), '<input class="hlc-sheet-input" type="date" value="' + h.esc(d.eventDate || h.todayKey()) + '" data-hl-breed-field="eventDate" />', h) +
        sheetField_(h.t('breedMatingObserved'), '<select class="hlc-sheet-select" data-hl-breed-field="matingObserved">' +
          ['yes', 'no', 'unknown'].map(function (v) {
            return '<option value="' + v + '"' + (d.matingObserved === v ? ' selected' : '') + '>' + h.esc(h.t('breedObs_' + v)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('breedMatingDuration'), '<input class="hlc-sheet-input" type="text" value="' + h.esc(d.matingDuration) + '" data-hl-breed-field="matingDuration" placeholder="' + h.esc(h.t('breedMatingDurationPh')) + '" />', h) +
        sheetField_(h.t('breedMatingBehavior'), '<input class="hlc-sheet-input" type="text" value="' + h.esc(d.matingBehavior) + '" data-hl-breed-field="matingBehavior" />', h) +
        sheetField_(h.t('breedMatingAggression'), '<select class="hlc-sheet-select" data-hl-breed-field="matingAggression">' +
          ['no', 'yes', 'unknown'].map(function (v) {
            return '<option value="' + v + '"' + (d.matingAggression === v ? ' selected' : '') + '>' + h.esc(h.t('breedAgg_' + v)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('profileNote'), '<textarea class="hlc-sheet-input" rows="3" data-hl-breed-field="note">' + h.esc(d.note) + '</textarea>', h);
    } else if (kind === 'laying') {
      inner =
        sheetField_(h.t('breedSelectPair'), pairOptionsHtml_(state, pet, d.eventPairId, h), h) +
        sheetField_(h.t('breedLayingType'), '<select class="hlc-sheet-select" data-hl-breed-field="layingType">' +
          ['egg_laying', 'birth', 'larva_found'].map(function (v) {
            return '<option value="' + v + '"' + (d.layingType === v ? ' selected' : '') + '>' + h.esc(h.t('breedLayingType_' + v)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('photoDateLabel'), '<input class="hlc-sheet-input" type="date" value="' + h.esc(d.eventDate || h.todayKey()) + '" data-hl-breed-field="eventDate" />', h) +
        sheetField_(h.t('breedLayingCount'), '<input class="hlc-sheet-input" type="number" min="0" value="' + h.esc(d.layingCount) + '" data-hl-breed-field="layingCount" />', h) +
        sheetField_(h.t('breedLayingUnit'), '<select class="hlc-sheet-select" data-hl-breed-field="layingUnit">' +
          ['egg', 'count', 'batch'].map(function (u) {
            return '<option value="' + u + '"' + (d.layingUnit === u ? ' selected' : '') + '>' + h.esc(h.t('unit_' + u)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('breedLayingLocation'), '<select class="hlc-sheet-select" data-hl-breed-field="layingLocation">' +
          ['nest', 'soil', 'substrate', 'water', 'box', 'other'].map(function (loc) {
            return '<option value="' + loc + '"' + (d.layingLocation === loc ? ' selected' : '') + '>' + h.esc(h.t('breedLoc_' + loc)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('breedClutchCode'), '<input class="hlc-sheet-input" type="text" value="' + h.esc(d.clutchCode) + '" data-hl-breed-field="clutchCode" />', h) +
        '<label class="hlc-sheet-check"><input type="checkbox"' + (d.layingRemoved ? ' checked' : '') + ' data-hl-breed-field="layingRemoved" /> ' + h.esc(h.t('breedLayingRemoved')) + '</label>' +
        sheetField_(h.t('profileNote'), '<textarea class="hlc-sheet-input" rows="3" data-hl-breed-field="note">' + h.esc(d.note) + '</textarea>', h);
    } else if (kind === 'hatch') {
      var rate = '';
      var succ = parseInt(d.hatchSuccess, 10) || 0;
      var fail = parseInt(d.hatchFail, 10) || 0;
      if (succ + fail > 0) rate = String(Math.round((succ / (succ + fail)) * 100)) + '%';
      inner =
        sheetField_(h.t('breedSelectPair'), pairOptionsHtml_(state, pet, d.eventPairId, h), h) +
        sheetField_(h.t('photoDateLabel'), '<input class="hlc-sheet-input" type="date" value="' + h.esc(d.eventDate || h.todayKey()) + '" data-hl-breed-field="eventDate" />', h) +
        sheetField_(h.t('breedHatchStage'), '<select class="hlc-sheet-select" data-hl-breed-field="hatchStage">' +
          ['hatching', 'larva_found', 'pupa', 'emergence', 'birth', 'offspring_separated'].map(function (v) {
            return '<option value="' + v + '"' + (d.hatchStage === v ? ' selected' : '') + '>' + h.esc(h.t('breedHatchStage_' + v)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('breedHatchCount'), '<input class="hlc-sheet-input" type="number" min="0" value="' + h.esc(d.hatchCount) + '" data-hl-breed-field="hatchCount" />', h) +
        sheetField_(h.t('breedHatchSuccess'), '<input class="hlc-sheet-input" type="number" min="0" value="' + h.esc(d.hatchSuccess) + '" data-hl-breed-field="hatchSuccess" />', h) +
        sheetField_(h.t('breedHatchFail'), '<input class="hlc-sheet-input" type="number" min="0" value="' + h.esc(d.hatchFail) + '" data-hl-breed-field="hatchFail" />', h) +
        (rate ? '<p class="hlc-sheet__hint">' + h.esc(h.t('breedSurvivalRate')) + '：' + h.esc(rate) + '</p>' : '') +
        '<label class="hlc-sheet-check"><input type="checkbox"' + (d.hatchCreateOffspring ? ' checked' : '') + ' data-hl-breed-field="hatchCreateOffspring" /> ' + h.esc(h.t('breedCreateOffspring')) + '</label>' +
        sheetField_(h.t('profileNote'), '<textarea class="hlc-sheet-input" rows="3" data-hl-breed-field="note">' + h.esc(d.note) + '</textarea>', h);
    } else if (kind === 'incubation') {
      inner =
        sheetField_(h.t('breedSelectPair'), pairOptionsHtml_(state, pet, d.eventPairId, h), h) +
        sheetField_(h.t('photoDateLabel'), '<input class="hlc-sheet-input" type="date" value="' + h.esc(d.eventDate || h.todayKey()) + '" data-hl-breed-field="eventDate" />', h) +
        sheetField_(h.t('breedIncubationType'), '<select class="hlc-sheet-select" data-hl-breed-field="eventType">' +
          ['incubation_start', 'incubation_check'].map(function (v) {
            return '<option value="' + v + '"' + (d.eventType === v ? ' selected' : '') + '>' + h.esc(h.t('breedEvent_' + v)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('profileNote'), '<textarea class="hlc-sheet-input" rows="3" data-hl-breed-field="note">' + h.esc(d.note) + '</textarea>', h);
    } else if (kind === 'failed') {
      inner =
        sheetField_(h.t('breedSelectPair'), pairOptionsHtml_(state, pet, d.eventPairId, h), h) +
        sheetField_(h.t('photoDateLabel'), '<input class="hlc-sheet-input" type="date" value="' + h.esc(d.eventDate || h.todayKey()) + '" data-hl-breed-field="eventDate" />', h) +
        sheetField_(h.t('breedFailedType'), '<select class="hlc-sheet-select" data-hl-breed-field="eventType">' +
          ['failed_egg', 'failed_larva'].map(function (v) {
            return '<option value="' + v + '"' + (d.eventType === v ? ' selected' : '') + '>' + h.esc(h.t('breedEvent_' + v)) + '</option>';
          }).join('') + '</select>', h) +
        sheetField_(h.t('breedFailedCount'), '<input class="hlc-sheet-input" type="number" min="0" value="' + h.esc(d.failedCount) + '" data-hl-breed-field="failedCount" />', h) +
        sheetField_(h.t('profileNote'), '<textarea class="hlc-sheet-input" rows="3" data-hl-breed-field="note">' + h.esc(d.note) + '</textarea>', h);
    } else if (kind === 'log') {
      inner = '<p class="hlc-sheet__hint">' + h.esc(h.t('breedLogPickerHint')) + '</p>' +
        '<div class="hlc-breed-grid hlc-breed-grid--sheet">' +
        breedRecordCard_('mating', 'heart', 'breedCardMating', 'breedCardMatingHint', h) +
        breedRecordCard_('laying', 'egg', 'breedCardLaying', 'breedCardLayingHint', h) +
        breedRecordCard_('hatch', 'spark', 'breedCardHatch', 'breedCardHatchHint', h) +
        breedRecordCard_('incubation', 'status', 'breedCardIncubation', 'breedCardIncubationHint', h) +
        breedRecordCard_('failed', 'alert', 'breedCardFailed', 'breedCardFailedHint', h) +
        '</div>';
      saveAction = '';
    }

    return (
      '<div class="hlc-sheet-backdrop" data-hl-action="close-sheet">' +
      '<div class="hlc-sheet hlc-sheet--breed" role="dialog">' +
      '<div class="hlc-sheet__handle"></div>' +
      '<h2 class="hlc-sheet__title">' + h.esc(title) + '</h2>' +
      inner +
      '<div class="hlc-sheet__actions">' +
      (saveAction ? '<button type="button" class="hlc-btn hlc-btn--primary" data-hl-action="' + saveAction + '">' + h.esc(h.t('saveLog')) + '</button>' : '') +
      '<button type="button" class="hlc-btn hlc-btn--ghost" data-hl-action="close-sheet">' + h.esc(h.t('cancel')) + '</button>' +
      '</div></div></div>'
    );
  }

  function openSheet_(state, pet, kind, h) {
    ensureState(state);
    state.ui.sheet = kind === 'log' ? 'breeding-log' : ('breeding-' + kind);
    state.ui.breedingDraft = defaultDraft_(pet);
    state.ui.breedingDraft.pairStartDate = h.todayKey();
    var pair = activePairForPet_(state, pet.id);
    if (pair) state.ui.breedingDraft.eventPairId = pair.id;
  }

  function addTimelineLog_(state, pet, entry, h) {
    state.careLogs.unshift({
      id: h.genId(),
      petId: pet.id,
      petName: pet.petName,
      type: 'breeding',
      recordId: 'breeding',
      recordType: entry.recordType,
      note: entry.note || '',
      photoUrl: entry.photoUrl || '',
      date: entry.date || new Date().toISOString(),
      values: entry.values || null,
      breedingEventId: entry.breedingEventId || '',
      pairName: entry.pairName || '',
    });
    if (state.careLogs.length > 200) state.careLogs.length = 200;
  }

  function saveGenericEvent_(state, pet, h, eventType) {
    var d = state.ui.breedingDraft;
    var pair = pairById_(state, d.eventPairId);
    var now = new Date().toISOString();
    var count = parseInt(d.failedCount, 10) || 0;
    var type = eventType || d.eventType || 'incubation_check';
    var ev = {
      id: h.genId(),
      pairId: d.eventPairId,
      petId: pet.id,
      type: type,
      date: d.eventDate || h.todayKey(),
      count: count,
      status: type.indexOf('failed') >= 0 ? 'failed' : 'ok',
      note: d.note || '',
      photos: [],
      tags: [],
      createdAt: now,
    };
    state.breedingEvents.unshift(ev);
    addTimelineLog_(state, pet, {
      recordType: breedEventLabel_(h, type),
      note: d.note || (count ? String(count) : ''),
      date: ev.date,
      breedingEventId: ev.id,
      pairName: pair ? pair.name : '',
    }, h);
  }

  function savePair_(state, pet, h) {
    var d = state.ui.breedingDraft;
    var now = new Date().toISOString();
    var pair = {
      id: h.genId(),
      name: d.pairName || (petName_(state, d.malePetId) + ' × ' + petName_(state, d.femalePetId)),
      species: d.species || '',
      malePetId: d.malePetId || '',
      femalePetId: d.femalePetId || '',
      unknownParentIds: Array.isArray(d.unknownParentIds) ? d.unknownParentIds.slice() : [],
      status: d.pairStatus || 'active',
      startDate: d.pairStartDate || h.todayKey(),
      endDate: '',
      notes: d.pairNotes || '',
      createdAt: now,
      updatedAt: now,
    };
    state.breedingPairs.unshift(pair);
    var ev = {
      id: h.genId(),
      pairId: pair.id,
      petId: pet.id,
      type: 'pairing',
      date: pair.startDate,
      count: 0,
      status: pair.status,
      note: pair.notes,
      photos: d.pairPhoto ? [d.pairPhoto] : [],
      tags: [],
      createdAt: now,
    };
    state.breedingEvents.unshift(ev);
    addTimelineLog_(state, pet, {
      recordType: h.t('breedEvent_pairing'),
      note: pair.name,
      date: ev.date,
      breedingEventId: ev.id,
      pairName: pair.name,
    }, h);
  }

  function saveMating_(state, pet, h) {
    var d = state.ui.breedingDraft;
    var pair = pairById_(state, d.eventPairId);
    var now = new Date().toISOString();
    var ev = {
      id: h.genId(),
      pairId: d.eventPairId,
      petId: pet.id,
      type: 'mating',
      date: d.eventDate || h.todayKey(),
      status: d.matingObserved,
      note: d.note || '',
      value: d.matingDuration,
      photos: [],
      tags: [d.matingAggression],
      createdAt: now,
    };
    state.breedingEvents.unshift(ev);
    if (pair && pair.status === 'active') { pair.status = 'observing'; pair.updatedAt = now; }
    addTimelineLog_(state, pet, {
      recordType: h.t('breedEvent_mating'),
      note: d.matingBehavior || d.note,
      date: ev.date,
      breedingEventId: ev.id,
      pairName: pair ? pair.name : '',
    }, h);
  }

  function saveLaying_(state, pet, h) {
    var d = state.ui.breedingDraft;
    var pair = pairById_(state, d.eventPairId);
    var now = new Date().toISOString();
    var count = parseInt(d.layingCount, 10) || 0;
    var ev = {
      id: h.genId(),
      pairId: d.eventPairId,
      petId: pet.id,
      type: d.layingType || 'egg_laying',
      date: d.eventDate || h.todayKey(),
      count: count,
      unit: d.layingUnit,
      status: d.layingRemoved ? 'incubating' : 'in_situ',
      note: d.note || '',
      photos: [],
      tags: [d.layingLocation, d.clutchCode].filter(Boolean),
      createdAt: now,
    };
    state.breedingEvents.unshift(ev);
    if (count > 0) {
      state.breedingEvents.unshift({
        id: h.genId(),
        pairId: d.eventPairId,
        petId: pet.id,
        type: 'clutch',
        date: ev.date,
        count: count,
        unit: d.layingUnit,
        status: 'active',
        note: d.clutchCode || '',
        photos: [],
        tags: ['clutch'],
        createdAt: now,
      });
    }
    var unitLabel = h.t('unit_' + (d.layingUnit || 'count'));
    addTimelineLog_(state, pet, {
      recordType: h.t('breedEvent_' + ev.type),
      note: (count ? String(count) + unitLabel + ' · ' : '') + (d.note || ''),
      date: ev.date,
      breedingEventId: ev.id,
      pairName: pair ? pair.name : '',
    }, h);
  }

  function saveHatch_(state, pet, h) {
    var d = state.ui.breedingDraft;
    var pair = pairById_(state, d.eventPairId);
    var now = new Date().toISOString();
    var count = parseInt(d.hatchCount, 10) || parseInt(d.hatchSuccess, 10) || 0;
    var ev = {
      id: h.genId(),
      pairId: d.eventPairId,
      petId: pet.id,
      type: d.hatchStage || 'hatching',
      date: d.eventDate || h.todayKey(),
      count: count,
      status: 'ok',
      note: d.note || '',
      photos: [],
      tags: [],
      createdAt: now,
    };
    state.breedingEvents.unshift(ev);
    if (d.hatchCreateOffspring && pair) {
      var n = parseInt(d.hatchSuccess, 10) || count || 1;
      if (d.hatchBatchOnly) n = 1;
      for (var i = 0; i < n; i++) {
        state.offspring.unshift({
          id: h.genId(),
          name: (pair.name || h.t('breedOffspringItem')) + (n > 1 ? ' #' + (i + 1) : ''),
          species: pair.species || '',
          scientificName: '',
          parentPairId: pair.id,
          fatherPetId: pair.malePetId,
          motherPetId: pair.femalePetId,
          birthDate: ev.date,
          hatchDate: ev.date,
          stage: d.hatchStage === 'emergence' ? 'adult' : 'juvenile',
          status: 'alive',
          image: '',
          notes: d.note || '',
          linkedPetId: '',
          createdAt: now,
        });
      }
      if (pair.status === 'observing') { pair.status = 'successful'; pair.updatedAt = now; }
    }
    addTimelineLog_(state, pet, {
      recordType: h.t('breedEvent_' + ev.type),
      note: d.note || (count ? String(count) : ''),
      date: ev.date,
      breedingEventId: ev.id,
      pairName: pair ? pair.name : '',
    }, h);
  }

  function getQuestKeys_(state, pet, h) {
    var keys = [];
    var pair = activePairForPet_(state, pet.id);
    var evs = eventsForPet_(state, pet.id);
    var cat = pet.category || '';
    var hasMating = evs.some(function (e) { return e.type === 'mating'; });
    var hasLaying = evs.some(function (e) { return e.type === 'egg_laying' || e.type === 'birth'; });
    if (pair && pair.status === 'active' && !hasMating) keys.push('BREED_OBSERVE_MATING');
    if (pair && (pair.status === 'active' || pair.status === 'observing') && hasMating && !hasLaying) {
      keys.push('BREED_OBSERVE_LAYING');
    }
    if (hasLaying) keys.push('BREED_CHECK_INCUBATION');
    if (cat === 'insect' || cat === 'beetle-larva' || cat === 'mantis') {
      if (hasLaying) keys.push('BREED_CHECK_EGG');
    }
    if (cat === 'aquatic') {
      if (hasLaying) keys.push('BREED_AQUATIC_ISOLATE');
    }
    return keys.slice(0, 3);
  }

  function exportBreedingCsv_(state, pet, h) {
    var rows = [['pair', 'type', 'date', 'count', 'note']];
    eventsForPet_(state, pet.id).forEach(function (e) {
      rows.push([e.pairId, e.type, e.date, e.count, (e.note || '').replace(/\n/g, ' ')]);
    });
    return rows.map(function (r) { return r.map(csvCell_).join(','); }).join('\n');
  }

  function exportOffspringCsv_(state, pet, h) {
    var rows = [['name', 'stage', 'hatchDate', 'status', 'linkedPetId']];
    offspringChildrenOfPet_(state, pet.id).forEach(function (o) {
      rows.push([o.name, o.stage, o.hatchDate || o.birthDate, o.status, o.linkedPetId]);
    });
    return rows.map(function (r) { return r.map(csvCell_).join(','); }).join('\n');
  }

  function exportLineageJson_(state, pet) {
    return JSON.stringify({
      petId: pet.id,
      petName: pet.petName,
      asOffspring: offspringLinkedToPet_(state, pet.id),
      pairs: pairsForPet_(state, pet.id),
      events: eventsForPet_(state, pet.id),
      offspring: offspringChildrenOfPet_(state, pet.id),
    }, null, 2);
  }

  function csvCell_(v) {
    var s = String(v == null ? '' : v);
    if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function createPetFromOffspring_(state, offspringId, h) {
    var o = state.offspring.filter(function (x) { return x.id === offspringId; })[0];
    if (!o || o.linkedPetId) return null;
    var pet = {
      id: h.genId(),
      petName: o.name || h.t('breedOffspringItem'),
      speciesId: '',
      commonName: o.species,
      scientificName: o.scientificName,
      category: 'custom',
      lifeStage: o.stage === 'adult' ? 'adult' : 'juvenile',
      profilePhoto: o.image || '',
      careStartDate: o.hatchDate || o.birthDate || h.todayKey(),
      source: h.t('breedSourceOffspring'),
    };
    state.pets.push(pet);
    o.linkedPetId = pet.id;
    return pet;
  }

  function handleField_(state, field, value, el) {
    ensureState(state);
    if (!state.ui.breedingDraft) state.ui.breedingDraft = defaultDraft_();
    if (field === 'layingRemoved' || field === 'hatchCreateOffspring') {
      state.ui.breedingDraft[field] = el && el.checked;
      return true;
    }
    if (field === 'unknownParentIds' && el && el.options) {
      var picked = [];
      for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].selected) picked.push(el.options[i].value);
      }
      state.ui.breedingDraft.unknownParentIds = picked;
      return true;
    }
    state.ui.breedingDraft[field] = value;
    return true;
  }

  function handleAction_(act, ctx) {
    var state = ctx.state;
    var pet = ctx.getActivePet();
    ensureState(state);
    if (act === 'breed-open-pair') { openSheet_(state, pet, 'pair', ctx); ctx.saveState(); ctx.render(); return true; }
    if (act === 'breed-open-log') { openSheet_(state, pet, 'log', ctx); ctx.saveState(); ctx.render(); return true; }
    if (act === 'breed-open-mating') { openSheet_(state, pet, 'mating', ctx); ctx.saveState(); ctx.render(); return true; }
    if (act === 'breed-open-laying') { openSheet_(state, pet, 'laying', ctx); ctx.saveState(); ctx.render(); return true; }
    if (act === 'breed-open-hatch') { openSheet_(state, pet, 'hatch', ctx); ctx.saveState(); ctx.render(); return true; }
    if (act === 'breed-open-incubation') { openSheet_(state, pet, 'incubation', ctx); ctx.saveState(); ctx.render(); return true; }
    if (act === 'breed-open-failed') { openSheet_(state, pet, 'failed', ctx); ctx.saveState(); ctx.render(); return true; }
    if (act === 'breed-save-pair') { if (pet) savePair_(state, pet, ctx); ctx.state.toast = ctx.t('breedSavedToast'); ctx.closeSheet(); ctx.saveState(); ctx.render(); ctx.clearToast(); return true; }
    if (act === 'breed-save-mating') { if (pet) saveMating_(state, pet, ctx); ctx.state.toast = ctx.t('breedSavedToast'); ctx.closeSheet(); ctx.saveState(); ctx.render(); ctx.clearToast(); return true; }
    if (act === 'breed-save-laying') { if (pet) saveLaying_(state, pet, ctx); ctx.state.toast = ctx.t('breedSavedToast'); ctx.closeSheet(); ctx.saveState(); ctx.render(); ctx.clearToast(); return true; }
    if (act === 'breed-save-hatch') { if (pet) saveHatch_(state, pet, ctx); ctx.state.toast = ctx.t('breedSavedToast'); ctx.closeSheet(); ctx.saveState(); ctx.render(); ctx.clearToast(); return true; }
    if (act === 'breed-save-incubation') { if (pet) saveGenericEvent_(state, pet, ctx); ctx.state.toast = ctx.t('breedSavedToast'); ctx.closeSheet(); ctx.saveState(); ctx.render(); ctx.clearToast(); return true; }
    if (act === 'breed-save-failed') { if (pet) saveGenericEvent_(state, pet, ctx); ctx.state.toast = ctx.t('breedSavedToast'); ctx.closeSheet(); ctx.saveState(); ctx.render(); ctx.clearToast(); return true; }
    if (act === 'breed-export-csv') {
      if (!pet) return true;
      var csv = exportBreedingCsv_(state, pet, ctx);
      ctx.downloadText((pet.petName || 'pet') + '-breeding.csv', csv, 'text/csv');
      ctx.state.toast = ctx.t('exportCsvDone');
      ctx.saveState(); ctx.render(); ctx.clearToast();
      return true;
    }
    if (act === 'breed-export-lineage') {
      if (!pet) return true;
      ctx.downloadText((pet.petName || 'pet') + '-lineage.json', exportLineageJson_(state, pet), 'application/json');
      ctx.state.toast = ctx.t('exportJsonDone');
      ctx.saveState(); ctx.render(); ctx.clearToast();
      return true;
    }
    if (act === 'breed-export-offspring') {
      if (!pet) return true;
      ctx.downloadText((pet.petName || 'pet') + '-offspring.csv', exportOffspringCsv_(state, pet, ctx), 'text/csv');
      ctx.state.toast = ctx.t('exportCsvDone');
      ctx.saveState(); ctx.render(); ctx.clearToast();
      return true;
    }
    if (act === 'breed-link-pet') {
      var offId = ctx.el && ctx.el.getAttribute('data-hl-breed-offspring');
      if (offId) {
        var np = createPetFromOffspring_(state, offId, ctx);
        if (np) { ctx.state.toast = ctx.t('breedPetCreatedToast'); ctx.saveState(); ctx.render(); ctx.clearToast(); }
      }
      return true;
    }
    if (act === 'breed-mark-deceased') {
      var deadId = ctx.el && ctx.el.getAttribute('data-hl-breed-offspring');
      if (deadId) {
        var rec = state.offspring.filter(function (x) { return x.id === deadId; })[0];
        if (rec) { rec.status = 'deceased'; ctx.state.toast = ctx.t('breedSavedToast'); ctx.saveState(); ctx.render(); ctx.clearToast(); }
      }
      return true;
    }
    return false;
  }

  global.MCHusbandryBreeding = {
    ensureState: ensureState,
    summary: summary_,
    renderHeroBlock: renderHeroBlock_,
    renderCardStrip: renderCardStrip_,
    renderLogsSection: renderLogsSection_,
    renderProfileParents: renderProfileParents_,
    renderProfileBreedingSummary: renderProfileBreedingSummary_,
    renderProfileOffspring: renderProfileOffspring_,
    renderFamilyTree: renderFamilyTree_,
    renderTrends: renderTrends_,
    renderSheet: renderSheet_,
    getQuestKeys: getQuestKeys_,
    handleAction: handleAction_,
    handleField: handleField_,
    EVENT_TYPES: EVENT_TYPES,
    OFFSPRING_STAGES: OFFSPRING_STAGES,
  };
})(typeof window !== 'undefined' ? window : this);
