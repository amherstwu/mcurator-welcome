(function (global) {
  'use strict';

  var STATUS_LABELS = {
    ready: { zh: '就緒', en: 'Ready', ja: '準備完了', de: 'Bereit' },
    core: { zh: '核心', en: 'Core', ja: 'コア', de: 'Kern' },
    lab: { zh: '實驗室', en: 'Lab', ja: 'ラボ', de: 'Labor' },
    preview: { zh: '預覽', en: 'Preview', ja: 'プレビュー', de: 'Vorschau' },
    live: { zh: '上線', en: 'Live', ja: '稼働', de: 'Live' },
    experimental: { zh: '實驗', en: 'Experimental', ja: '実験的', de: 'Experimentell' },
  };

  var TOOL_REGISTRY = [
    {
      id: 'passport-studio',
      icon: '🪪',
      title: 'Passport Studio',
      titleJa: 'パスポートスタジオ',
      titleDe: 'Pass Studio',
      zhTitle: '標本護照工作室',
      descEn: 'Build scientific specimen passports with SAT identity.',
      descZh: '建立具 SAT 身分的標本護照與展示身分。',
      descJa: 'SAT 身分付きの科学標本パスポートを作成します。',
      descDe: 'Wissenschaftliche Präparatepässe mit SAT-Identität erstellen.',
      status: 'ready',
      size: 'xl',
      action: 'open-passport',
    },
    {
      id: 'create-specimen',
      icon: '🧬',
      title: 'Create Specimen',
      titleJa: '標本を追加',
      titleDe: 'Präparat anlegen',
      zhTitle: '新增標本',
      descEn: 'Record taxonomy, media, locality and collection metadata.',
      descZh: '記錄分類、影像、產地與採集詮釋資料。',
      descJa: '分類・メディア・産地・採集メタデータを記録します。',
      descDe: 'Taxonomie, Medien, Fundort und Sammlungsmetadaten erfassen.',
      status: 'core',
      size: 'lg',
      action: 'open-specimen',
    },
    {
      id: 'paleo',
      icon: '🦕',
      title: 'Ecological Reconstruction',
      titleJa: '生態復元',
      titleDe: 'Ökologische Rekonstruktion',
      zhTitle: '生態復原',
      descEn: 'Reconstruct paleo visuals from fossils and references.',
      descZh: '以化石與參考資料重建古生物視覺復原。',
      descJa: '化石と参考資料から古生物ビジュアルを復元します。',
      descDe: 'Paläovisualisierungen aus Fossilien und Referenzen rekonstruieren.',
      status: 'lab',
      size: 'md',
      action: 'open-paleo',
    },
    {
      id: 'photo-lab',
      icon: '🖼️',
      title: 'AI Photo Restoration',
      titleJa: 'AI写真修復',
      titleDe: 'KI-Fotorestaurierung',
      zhTitle: 'AI 照片修復',
      descEn: 'Repair legacy photos and produce clean scientific plates.',
      descZh: '修復舊照片並產出乾淨的科學圖版。',
      descJa: '古い写真を修復し、きれいな科学図版を作成します。',
      descDe: 'Historische Fotos restaurieren und saubere wissenschaftliche Tafeln erzeugen.',
      status: 'lab',
      size: 'md',
      action: 'open-photo-lab',
    },
    {
      id: 'paper-assistant',
      icon: '📄',
      title: 'Paper Assistant',
      titleJa: '論文アシスタント',
      titleDe: 'Paper-Assistent',
      zhTitle: '論文助手',
      descEn: 'Draft manuscript structure and reference-aware sections.',
      descZh: '起草論文結構與具參考文獻意識的章節。',
      descJa: '原稿構成と参考文献を意識した章を起草します。',
      descDe: 'Manuskriptstruktur und referenzbewusste Abschnitte entwerfen.',
      status: 'preview',
      size: 'sm',
      action: 'open-taxonomy',
    },
    {
      id: 'tree-lab',
      icon: '🌿',
      title: 'Evolution Tree',
      titleJa: '系統樹',
      titleDe: 'Evolutionsbaum',
      zhTitle: '演化樹',
      descEn: 'Verify taxonomy and build comparative phylogeny.',
      descZh: '驗證分類並建立比較演化樹。',
      descJa: '分類を検証し、比較系統樹を構築します。',
      descDe: 'Taxonomie prüfen und vergleichende Phylogenie aufbauen.',
      status: 'ready',
      size: 'md',
      action: 'open-tree-lab',
    },
    {
      id: 'husbandry-log',
      icon: '🪴',
      title: 'Husbandry Log',
      titleJa: '飼育ログ',
      titleDe: 'Haltungsprotokoll',
      zhTitle: '飼育紀錄',
      descEn: 'Species-first care assistant with daily tasks and profile-driven records. Local device storage only.',
      descZh: '物種導向的照護助手；資料僅存於此瀏覽器，不會跨裝置自動同步。',
      descJa: '種優先のケア助手。データはこのブラウザのみで、端末間自動同期はありません。',
      descDe: 'Artenorientierter Pflegeassistent. Daten nur lokal in diesem Browser — keine Auto-Sync.',
      status: 'lab',
      size: 'md',
      action: 'open-husbandry-log',
    },
    {
      id: 'sat-market',
      icon: '🛍️',
      title: 'SAT Marketplace Demo',
      titleJa: 'SAT マーケット Demo',
      titleDe: 'SAT-Marktplatz Demo',
      zhTitle: 'SAT 市集（示範）',
      descEn: 'Browse listings, provenance, and verification. Demo only — no real settlement.',
      descZh: '瀏覽上架、來源與驗證。示範模式，不可真實結算。',
      descJa: '出品・来歴・検証を閲覧。デモのみで実決済はありません。',
      descDe: 'Angebote, Provenienz und Verifizierung ansehen. Nur Demo — keine echte Abrechnung.',
      status: 'live',
      size: 'lg',
      action: 'open-sat-market',
    },
    {
      id: 'museum',
      icon: '🏛️',
      title: 'Virtual Museum',
      titleJa: 'バーチャル博物館',
      titleDe: 'Virtuelles Museum',
      zhTitle: '博物館典藏',
      descEn: 'Curate scientific assets as public museum exhibits.',
      descZh: '將科學資產策展為公開博物館展品。',
      descJa: '科学アセットを公開展示としてキュレーションします。',
      descDe: 'Wissenschaftliche Assets als öffentliche Museumsausstellungen kuratieren.',
      status: 'ready',
      size: 'md',
      action: 'open-museum',
    },
    {
      id: 'field-log',
      icon: '📍',
      title: 'Field Collection Log',
      titleJa: '野外採集記録',
      titleDe: 'Feldsammlungsprotokoll',
      zhTitle: '野外採集紀錄',
      descEn: 'Import and validate field collection records.',
      descZh: '匯入並驗證野外採集紀錄。',
      descJa: '野外採集記録をインポートして検証します。',
      descDe: 'Feldsammlungsdatensätze importieren und prüfen.',
      status: 'core',
      size: 'sm',
      action: 'open-workspace',
    },
    {
      id: 'genome-taxonomy',
      icon: '🧫',
      title: 'Genome Taxonomy Lab',
      titleJa: 'ゲノム分類ラボ',
      titleDe: 'Genom-Taxonomie-Labor',
      zhTitle: '基因組分類實驗室',
      descEn: 'Cross-check genomic markers with taxonomic metadata.',
      descZh: '以基因組標記交叉比對分類詮釋資料。',
      descJa: 'ゲノムマーカーと分類メタデータを照合します。',
      descDe: 'Genomische Marker mit taxonomischen Metadaten abgleichen.',
      status: 'experimental',
      size: 'sm',
      action: 'open-taxonomy',
    },
  ];

  var QUICK_ACTIONS = [
    {
      zh: '新增標本',
      en: 'Add specimen',
      ja: '標本を追加',
      de: 'Präparat anlegen',
      subZh: '建立標本紀錄',
      subEn: 'Create specimen record',
      subJa: '標本記録を作成',
      subDe: 'Präparatedatensatz erstellen',
      action: 'open-specimen',
    },
    {
      zh: '拍照修復',
      en: 'Capture & restore',
      ja: '撮影して修復',
      de: 'Aufnehmen & restaurieren',
      subZh: '拍照並修復',
      subEn: 'Capture and restore photos',
      subJa: '写真を撮影して修復',
      subDe: 'Fotos aufnehmen und restaurieren',
      action: 'open-photo-lab-capture',
    },
    {
      zh: '建立 SAT Passport',
      en: 'Build SAT passport',
      ja: 'SAT パスポート作成',
      de: 'SAT-Pass erstellen',
      subZh: '標本護照',
      subEn: 'Specimen passport',
      subJa: '標本パスポート',
      subDe: 'Präparatepass',
      action: 'open-passport',
    },
    {
      zh: '匯入採集紀錄',
      en: 'Import field log',
      ja: '採集記録をインポート',
      de: 'Feldprotokoll importieren',
      subZh: '採集資料',
      subEn: 'Field collection data',
      subJa: '採集データ',
      subDe: 'Feldsammlungsdaten',
      action: 'open-workspace',
    },
    {
      zh: '開啟 AI 修復',
      en: 'Open AI restoration',
      ja: 'AI修復を開く',
      de: 'KI-Restaurierung öffnen',
      subZh: '照片實驗室',
      subEn: 'Photo lab',
      subJa: '写真ラボ',
      subDe: 'Fotolabor',
      action: 'open-photo-lab',
    },
    {
      zh: '查詢物種資料',
      en: 'Verify species',
      ja: '種を検証',
      de: 'Art prüfen',
      subZh: '演化樹工具',
      subEn: 'Evolution tree lab',
      subJa: '系統樹ツール',
      subDe: 'Evolutionsbaum',
      action: 'open-tree-lab',
    },
  ];

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

  function handleAction(action) {
    switch (action) {
      case 'open-specimen':
        if (typeof global.openSpecimenModal === 'function') global.openSpecimenModal();
        return;
      case 'open-passport':
        goSection('passport-studio');
        return;
      case 'open-paleo':
        goSection('paleo-reconstruction');
        return;
      case 'open-photo-lab':
        goSection('photo-restoration-lab');
        return;
      case 'open-photo-lab-capture':
        try {
          global.location.hash = '#/section/photo-restoration-lab?capture=1';
        } catch (eCap) {
          void 0;
        }
        goSection('photo-restoration-lab');
        return;
      case 'open-tree-lab':
        goSection('evolution-tree-lab');
        return;
      case 'open-husbandry-log':
        goSection('husbandry-log');
        return;
      case 'open-taxonomy':
        goSection('taxonomy-manuscript-studio');
        return;
      case 'open-workspace':
        goSection('specimens-workspace');
        return;
      case 'open-sat-market':
        if (global.MCRouter && typeof global.MCRouter.go === 'function') {
          global.MCRouter.go('/marketplace');
          return;
        }
        if (typeof global.switchSection === 'function') global.switchSection('sat');
        return;
      case 'open-museum':
        goSection('museum-collections');
        return;
      case 'open-help':
        goSection('learn');
        return;
      default:
        return;
    }
  }

  function wbLang() {
    try {
      if (typeof global.mcGetLang === 'function') return global.mcGetLang();
    } catch (eMc) {
      void 0;
    }
    return 'en-001';
  }

  function isZhTwUi() {
    var l = wbLang();
    return l === 'zh-TW' || l === 'zh';
  }

  function isJaUi() {
    var l = wbLang();
    return l === 'ja-JP' || l === 'ja';
  }

  function isDeUi() {
    var l = wbLang();
    return l === 'de-DE' || l === 'de';
  }

  function isEnUi() {
    if (typeof global.mcIsEnglishLocale === 'function') return global.mcIsEnglishLocale();
    var l = wbLang();
    return l === 'en-US' || l === 'en-GB' || l === 'en-001' || l === 'en';
  }

  /** Never use Chinese as secondary line for ja/de/en. */
  function registryHeadline(tool) {
    if (isZhTwUi()) return tool.zhTitle || tool.title;
    if (isJaUi()) return tool.titleJa || tool.title;
    if (isDeUi()) return tool.titleDe || tool.title;
    return tool.title;
  }

  function registryDesc(tool) {
    if (isZhTwUi()) return tool.descZh || tool.descEn;
    if (isJaUi()) return tool.descJa || tool.descEn;
    if (isDeUi()) return tool.descDe || tool.descEn;
    return tool.descEn;
  }

  /**
   * Secondary line: English product name for CJK/DE headlines.
   * EN locales never use zhTitle (avoids English title + Chinese subline).
   */
  function registrySubline(tool) {
    if (isZhTwUi() || isJaUi() || isDeUi()) return tool.title;
    return tool.title;
  }

  function pickB(b) {
    if (typeof global.mcPick === 'function') return global.mcPick(b);
    if (isZhTwUi()) return b.zh;
    if (isJaUi()) return b.ja || b.en;
    if (isDeUi()) return b.de || b.en;
    return b.en;
  }

  function statusLabel(status) {
    var labels = STATUS_LABELS[status];
    return labels ? pickB(labels) : status;
  }

  function quickMain(item) {
    if (isZhTwUi()) return item.zh;
    if (isJaUi()) return item.ja || item.en;
    if (isDeUi()) return item.de || item.en;
    return item.en;
  }

  function quickSub(item) {
    if (isZhTwUi()) return item.subZh;
    if (isJaUi()) return item.subJa || item.subEn;
    if (isDeUi()) return item.subDe || item.subEn;
    return item.subEn;
  }

  function renderToolCards() {
    var host = global.document.getElementById('wbToolRegistryGrid');
    if (!host) return;
    host.innerHTML = TOOL_REGISTRY.map(function (tool) {
      var headline = registryHeadline(tool);
      var desc = registryDesc(tool);
      var sub = registrySubline(tool);
      var subline =
        sub && sub !== headline
          ? '<p class="tool-registry-card__zh">' + esc(sub) + '</p>'
          : '';
      return (
        '<button type="button" class="tool-registry-card tool-size-' +
        esc(tool.size) +
        '" data-wb-action="' +
        esc(tool.action) +
        '">' +
        '<div class="tool-registry-card__head"><span class="tool-registry-card__icon">' +
        esc(tool.icon) +
        '</span><span class="bento-badge">' +
        esc(statusLabel(tool.status)) +
        '</span></div>' +
        '<h4>' +
        esc(headline) +
        '</h4>' +
        subline +
        '<p class="tool-registry-card__desc">' +
        esc(desc) +
        '</p>' +
        '</button>'
      );
    }).join('');
  }

  function renderQuickActions() {
    var host = global.document.getElementById('wbQuickActionGrid');
    if (!host) return;
    host.innerHTML = QUICK_ACTIONS.map(function (item) {
      return (
        '<button type="button" data-wb-action="' +
        esc(item.action) +
        '"><strong>' +
        esc(quickMain(item)) +
        '</strong><span>' +
        esc(quickSub(item)) +
        '</span></button>'
      );
    }).join('');
  }

  function hydrateStatus() {
    var state = global.state || {};
    var d = state.dashboard || {};
    var modeEl = global.document.getElementById('wbDataSource');
    var saveEl = global.document.getElementById('wbLastSave');
    var syncEl = global.document.getElementById('wbSyncStatus');
    if (modeEl) {
      if (global.MC_IS_LOCAL_PREVIEW) {
        modeEl.textContent = pickB({
          zh: '本機預覽',
          en: 'Local Preview',
          ja: 'ローカルプレビュー',
          de: 'Lokale Vorschau',
        });
      } else {
        modeEl.textContent = pickB({
          zh: '本機／瀏覽器儲存',
          en: 'Browser storage',
          ja: 'ブラウザ保存',
          de: 'Browserspeicher',
        });
      }
    }
    if (saveEl) saveEl.textContent = d.lastSavedAt || '--';
    if (syncEl) {
      syncEl.textContent = pickB({
        zh: '未雲端同步',
        en: 'Not cloud-synced',
        ja: 'クラウド未同期',
        de: 'Nicht cloud-synchronisiert',
      });
    }
  }

  function bindActions(root) {
    if (!root) return;
    root.querySelectorAll('[data-wb-action]').forEach(function (btn) {
      if (btn.getAttribute('data-wb-bound') === '1') return;
      btn.setAttribute('data-wb-bound', '1');
      btn.addEventListener('click', function () {
        handleAction(btn.getAttribute('data-wb-action'));
      });
    });
  }

  function renderAll() {
    renderToolCards();
    renderQuickActions();
    hydrateStatus();
    bindActions(global.document.getElementById('wbToolRegistryGrid'));
    bindActions(global.document.getElementById('wbQuickActionGrid'));
  }

  function init() {
    renderAll();
    try {
      global.document.addEventListener('mc:langchange', renderAll);
    } catch (eLang) {
      void 0;
    }
  }

  global.MCWorkbenchRegistry = {
    TOOL_REGISTRY: TOOL_REGISTRY,
    renderAll: renderAll,
    handleAction: handleAction,
    init: init,
  };

  if (global.document && global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
