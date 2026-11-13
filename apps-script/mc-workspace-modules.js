(function (global) {
  'use strict';

  /** Primary Workspace tool cards — fixed order: Passport Studio → Evolution Tree Lab → Husbandry Log. */
  var WORKSPACE_MODULES = [
    {
      id: 'passport-studio',
      icon: '🪪',
      title: 'Passport Studio',
      zhTitle: 'Passport Studio',
      descEn: 'Build scientific specimen passports with SAT identity and export-ready cards.',
      descZh: '建立具 SAT 身分的標本護照，完成可匯出的典藏卡與展示版面。',
      status: 'ready',
      statusLabel: { zh: '就緒', en: 'Ready' },
      tone: 'blue',
      route: '/section/passport-studio',
      action: 'open-passport',
      hints: [
        { zh: '護照模板', en: 'Passport templates' },
        { zh: 'SAT 身分', en: 'SAT identity' },
        { zh: '材質與 QR', en: 'Materials & QR' },
        { zh: '匯出卡片', en: 'Export cards' },
      ],
    },
    {
      id: 'evolution-tree-lab',
      icon: '🌿',
      title: 'Evolution Tree Lab',
      zhTitle: '演化樹研究工具',
      descEn: 'Verify taxonomy and build comparative phylogeny with OpenTree integrations.',
      descZh: '整合 OpenTree 等資料源，解析學名並建立比較演化樹。',
      status: 'lab',
      statusLabel: { zh: '研究', en: 'Research' },
      tone: 'green',
      route: '/section/evolution-tree-lab',
      action: 'open-tree-lab',
      hints: [
        { zh: '學名解析', en: 'Name matching' },
        { zh: '合成演化樹', en: 'Synthetic trees' },
        { zh: 'MRCA 分析', en: 'MRCA analysis' },
        { zh: '研究報告', en: 'Research reports' },
      ],
    },
    {
      id: 'husbandry-log',
      icon: '🪴',
      title: 'Husbandry Log Tool',
      zhTitle: '飼育紀錄工具',
      descEn: 'Species-first care assistant with daily quests, living specimen cards, and profile-driven records.',
      descZh: '物種導向的飼育助手——選物種、接任務、建立活體飼育卡並追蹤照護歷程。',
      status: 'lab',
      statusLabel: { zh: '實驗室', en: 'Lab' },
      tone: 'warm',
      route: '/section/husbandry-log',
      action: 'open-husbandry-log',
      hints: [
        { zh: '物種照護檔', en: 'Species care profiles' },
        { zh: '今日任務', en: 'Daily quests' },
        { zh: '活體飼育卡', en: 'Living specimen card' },
        { zh: '照護時間軸', en: 'Care timeline' },
        { zh: '成就徽章', en: 'Achievements' },
        { zh: '護照整合', en: 'Passport integration' },
      ],
    },
  ];

  function lang() {
    try {
      if (typeof global.mcGetLang === 'function') {
        return global.mcGetLang() === 'en' ? 'en' : 'zh';
      }
    } catch (eMc) {
      void 0;
    }
    try {
      if (typeof global.state !== 'undefined' && global.state && global.state.lang === 'en') return 'en';
      if (global.MC_LOCALE === 'en') return 'en';
      var stored = global.localStorage && global.localStorage.getItem('MC_USER_LANG');
      if (stored === 'en') return 'en';
      if (stored === 'zh-TW') return 'zh';
    } catch (e0) {
      void 0;
    }
    return 'zh';
  }

  function pickB(b) {
    return lang() === 'en' ? b.en : b.zh;
  }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function goSection(name) {
    if (global.MCRouter && typeof global.MCRouter.go === 'function') {
      global.MCRouter.go('/section/' + name);
      return;
    }
    if (typeof global.switchSection === 'function') global.switchSection(name);
  }

  function handleModuleAction(action) {
    switch (action) {
      case 'open-passport':
        goSection('passport-studio');
        return;
      case 'open-tree-lab':
        goSection('evolution-tree-lab');
        return;
      case 'open-husbandry-log':
        goSection('husbandry-log');
        return;
      default:
        return;
    }
  }

  function renderModuleCard(mod) {
    var isEn = lang() === 'en';
    var title = isEn ? mod.title : mod.zhTitle;
    var desc = isEn ? mod.descEn : mod.descZh;
    var statusText = pickB(mod.statusLabel);
    var hints = (mod.hints || [])
      .map(function (h) {
        return '<span class="ws-module-card__hint">' + esc(pickB(h)) + '</span>';
      })
      .join('');
    return (
      '<button type="button" class="ws-module-card ws-module-card--' +
      esc(mod.tone) +
      '" data-ws-module-action="' +
      esc(mod.action) +
      '" aria-label="' +
      esc(title) +
      '">' +
      '<div class="ws-module-card__head">' +
      '<span class="ws-module-card__icon" aria-hidden="true">' +
      esc(mod.icon) +
      '</span>' +
      '<span class="ws-module-card__badge ws-module-card__badge--' +
      esc(mod.status) +
      '">' +
      esc(statusText) +
      '</span>' +
      '</div>' +
      '<h4 class="ws-module-card__title">' +
      esc(title) +
      '</h4>' +
      '<p class="ws-module-card__en">' +
      esc(isEn ? mod.zhTitle : mod.title) +
      '</p>' +
      '<p class="ws-module-card__desc">' +
      esc(desc) +
      '</p>' +
      '<div class="ws-module-card__hints">' +
      hints +
      '</div>' +
      '</button>'
    );
  }

  function renderWorkspaceModules() {
    var host = global.document.getElementById('mcWorkspaceModulesGrid');
    if (!host) return;
    host.innerHTML = WORKSPACE_MODULES.map(renderModuleCard).join('');
  }

  function bindDelegatedActions() {
    if (global.__mcWorkspaceModulesBound) return;
    global.__mcWorkspaceModulesBound = true;
    global.document.addEventListener('click', function (ev) {
      var el = ev.target && ev.target.closest ? ev.target.closest('[data-ws-module-action]') : null;
      if (!el) return;
      var action = el.getAttribute('data-ws-module-action');
      if (!action) return;
      ev.preventDefault();
      handleModuleAction(action);
    });
  }

  function initWorkspaceModules() {
    renderWorkspaceModules();
    bindDelegatedActions();
  }

  global.MCWorkspaceModules = {
    init: initWorkspaceModules,
    refresh: renderWorkspaceModules,
    modules: WORKSPACE_MODULES.slice(),
  };

  try {
    global.addEventListener('mc:localechange', renderWorkspaceModules);
    global.addEventListener('mc:locale', renderWorkspaceModules);
  } catch (eLocEv) {
    void 0;
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', initWorkspaceModules);
  } else {
    initWorkspaceModules();
  }
})(typeof window !== 'undefined' ? window : this);
