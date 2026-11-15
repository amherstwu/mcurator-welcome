/**
 * Generated-style PWA shell pack for static HTML (offline, store index, boot splash).
 * Source of truth: sat-marketplace/src/i18n/pwaShellCopy.ts and loadingPageCopy.ts
 * Keep keys and placeholder counts aligned with those Copy modules.
 *
 * Must ship under dist-mobile/i18n/ so Pages sync with --delete cannot wipe this path
 * (incident: mcurator-welcome@70a64bf removed mobile/i18n/pwa-shell.js).
 */
(function (global) {
  var PACKS = {
    'zh-TW': {
      bootAria: '載入中',
      bootLabel: '標本護照系統',
      bootSubtitle: '科學資產平台',
      bootStatus: '正在建立標本護照環境...',
      offlineTitle: 'MCurator Mobile — 離線',
      offlineHeading: 'MCurator Mobile 目前離線',
      offlineBody: '應用程式殼層已快取，但此頁無法連線。請重新連線後再開啟已安裝的 App。',
      retry: '重試',
      storeTagline: '科學標本策展示範 · App Store 與 Google Play',
      privacyPolicy: '隱私權政策',
      termsOfUse: '使用條款',
      support: '支援',
    },
    'ja-JP': {
      bootAria: '読み込み中',
      bootLabel: '標本パスポートシステム',
      bootSubtitle: '科学アセットプラットフォーム',
      bootStatus: '標本パスポート環境を準備しています...',
      offlineTitle: 'MCurator Mobile — オフライン',
      offlineHeading: 'MCurator Mobile はオフラインです',
      offlineBody: 'アプリシェルはキャッシュ済みですが、このページはネットワークに接続できませんでした。再接続してインストール済みアプリを開き直してください。',
      retry: '再試行',
      storeTagline: '科学標本キュレーションのデモ · App Store & Google Play',
      privacyPolicy: 'プライバシーポリシー',
      termsOfUse: '利用規約',
      support: 'サポート',
    },
    'de-DE': {
      bootAria: 'Wird geladen',
      bootLabel: 'Präparat-Pass-System',
      bootSubtitle: 'Wissenschaftliche Asset-Plattform',
      bootStatus: 'Präparat-Pass-Umgebung wird vorbereitet...',
      offlineTitle: 'MCurator Mobile — Offline',
      offlineHeading: 'MCurator Mobile ist offline',
      offlineBody: 'Die App-Hülle ist zwischengespeichert, diese Seite konnte das Netzwerk jedoch nicht erreichen. Bitte stellen Sie die Verbindung wieder her und öffnen Sie die installierte App erneut.',
      retry: 'Erneut versuchen',
      storeTagline: 'Wissenschaftliche Präparatekuratierung (Demo) · App Store & Google Play',
      privacyPolicy: 'Datenschutzerklärung',
      termsOfUse: 'Nutzungsbedingungen',
      support: 'Support',
    },
    'en-001': {
      bootAria: 'Loading',
      bootLabel: 'Specimen Passport System',
      bootSubtitle: 'Scientific Asset Platform',
      bootStatus: 'Preparing the specimen passport workspace…',
      offlineTitle: 'MCurator Mobile — Offline',
      offlineHeading: 'MCurator Mobile is offline',
      offlineBody: 'The app shell is cached, but this page could not reach the network. Reconnect and reopen the installed app.',
      retry: 'Retry',
      storeTagline: 'Scientific specimen curation demo · App Store & Google Play',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      support: 'Support',
    },
  };
  PACKS['en-US'] = PACKS['en-001'];
  PACKS['en-GB'] = PACKS['en-001'];

  function normalize(raw) {
    var v = String(raw || '').replace(/_/g, '-').trim();
    if (!v) return 'zh-TW';
    if (v === 'en' || v === 'en-001') return 'en-001';
    if (/^en-US/i.test(v)) return 'en-US';
    if (/^en-GB/i.test(v)) return 'en-GB';
    if (/^ja/i.test(v)) return 'ja-JP';
    if (/^de/i.test(v)) return 'de-DE';
    if (/^zh/i.test(v)) return 'zh-TW';
    if (/^en/i.test(v)) return 'en-001';
    return 'zh-TW';
  }

  function apply() {
    var locale = 'zh-TW';
    try {
      locale = normalize(localStorage.getItem('MC_USER_LANG'));
    } catch (e) {
      locale = 'zh-TW';
    }
    var pack = PACKS[locale] || PACKS['en-001'];
    document.documentElement.lang = locale === 'en-001' ? 'en' : locale;
    document.querySelectorAll('[data-pwa-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-pwa-i18n');
      if (key && pack[key]) el.textContent = pack[key];
    });
    document.querySelectorAll('[data-pwa-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-pwa-i18n-aria');
      if (key && pack[key]) el.setAttribute('aria-label', pack[key]);
    });
    document.querySelectorAll('[data-pwa-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-pwa-i18n-title');
      if (key && pack[key]) el.textContent = pack[key];
    });
  }

  global.MC_PWA_SHELL = { apply: apply, packs: PACKS };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})(typeof window !== 'undefined' ? window : globalThis);
