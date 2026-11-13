/**
 * Inject surface narrative + data-boundary honesty into Apps Script chrome
 * without altering the locked marketing hero composition.
 */
(function (global) {
  'use strict';

  function pick(b) {
    if (typeof global.mcPick === 'function') return global.mcPick(b);
    return b.en;
  }

  function ensureWorkbenchBanner(host, id) {
    if (!host || global.document.getElementById(id)) return;
    var el = global.document.createElement('aside');
    el.id = id;
    el.setAttribute('role', 'note');
    el.setAttribute('data-mc-surface', 'desktop');
    el.style.cssText =
      'margin:0.75rem 1rem;padding:0.65rem 0.9rem;border-radius:10px;border:1px solid rgba(31,78,121,0.28);background:rgba(31,78,121,0.08);font-size:0.875rem;line-height:1.4;';
    var title = pick({
      zh: 'MCurator Desktop Workbench',
      en: 'MCurator Desktop Workbench',
      ja: 'MCurator Desktop Workbench',
      de: 'MCurator Desktop Workbench',
    });
    var purpose = pick({
      zh: '桌面研究工作區。典藏與草稿儲存在此瀏覽器；不會與手機自動同步。',
      en: 'Desktop research workspace. Collection and drafts stay in this browser; they do not auto-sync with mobile.',
      ja: 'デスクトップ研究ワークスペース。コレクションと下書きはこのブラウザに保存され、モバイルとは自動同期しません。',
      de: 'Desktop-Forschungswerkbank. Sammlung und Entwürfe bleiben in diesem Browser; keine Auto-Sync mit Mobile.',
    });
    el.innerHTML = '<strong>' + title + '</strong><p style="margin:0.35rem 0 0">' + purpose + '</p>';
    host.insertBefore(el, host.firstChild);
  }

  function removeWelcomeBanner() {
    var banner = global.document.getElementById('mcWelcomeSurfaceBanner');
    var wrap = global.document.getElementById('mcWelcomeSurfaceHost');
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
  }

  function placeWorkbenchBanner() {
    var dash = global.document.getElementById('section-dashboard') || global.document.getElementById('wbToolRegistryGrid');
    if (!dash) return;
    var host = dash.id === 'section-dashboard' ? dash : dash.parentElement;
    ensureWorkbenchBanner(host, 'mcWorkbenchSurfaceBanner');
  }

  function refresh() {
    try {
      removeWelcomeBanner();
      placeWorkbenchBanner();
    } catch (e) {
      void 0;
    }
  }

  global.MCSurfaceHonesty = { refresh: refresh };

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', refresh);
  } else {
    refresh();
  }
  try {
    global.document.addEventListener('mc:langchange', refresh);
  } catch (eLang) {
    void 0;
  }
})(typeof window !== 'undefined' ? window : this);
