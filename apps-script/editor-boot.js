/**
 * Visual editor boot watchdog — ensures ?editor=1 opens even if other landing scripts fail.
 */
(function () {
  'use strict';

  function qs() {
    try {
      return new URLSearchParams(String((window.location && window.location.search) || ''));
    } catch (e) {
      return new URLSearchParams('');
    }
  }

  function isEditorEntry_() {
    var p = qs();
    return p.get('editor') === '1' && p.get('editorPreview') !== '1';
  }

  function isEditorContext_() {
    var p = qs();
    return p.get('editor') === '1' || p.get('editorPreview') === '1' || p.get('staticPreview') === '1';
  }

  function hideBlockingChrome_() {
    try {
      var mask = document.getElementById('loadingMask');
      if (mask) mask.classList.remove('show');
    } catch (e0) {
      void 0;
    }
    try {
      document.documentElement.classList.add('mc-editor-boot');
    } catch (e1) {
      void 0;
    }
  }

  function showBootError_(lines) {
    if (document.getElementById('mcEditorBootError')) return;
    var box = document.createElement('div');
    box.id = 'mcEditorBootError';
    box.setAttribute('role', 'alert');
    box.style.cssText =
      'position:fixed;inset:0;z-index:100002;display:grid;place-items:center;padding:24px;background:rgba(4,8,12,.92);color:#e6edf3;font:14px/1.55 system-ui,"Segoe UI","Noto Sans TC",sans-serif;';
    box.innerHTML =
      '<div style="max-width:640px;border:1px solid #30363d;border-radius:16px;background:#161b22;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.45)">' +
      '<h2 style="margin:0 0 12px;font-size:20px">無法開啟視覺編輯器</h2>' +
      '<ul style="margin:0 0 16px;padding-left:20px;color:#8b949e">' +
      lines.map(function (line) {
        return '<li style="margin:8px 0">' + line + '</li>';
      }).join('') +
      '</ul>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px">' +
      '<button type="button" id="mcEditorBootRetry" style="padding:10px 14px;border:0;border-radius:8px;background:#238636;color:#fff;font-weight:700;cursor:pointer">重試</button>' +
      '<button type="button" id="mcEditorBootReload" style="padding:10px 14px;border:1px solid #30363d;border-radius:8px;background:#21262d;color:#e6edf3;font-weight:600;cursor:pointer">強制重新整理</button>' +
      '</div></div>';
    document.body.appendChild(box);
    var retry = document.getElementById('mcEditorBootRetry');
    if (retry) {
      retry.addEventListener('click', function () {
        if (box.parentNode) box.parentNode.removeChild(box);
        bootEditorWithRetry_(0);
      });
    }
    var reload = document.getElementById('mcEditorBootReload');
    if (reload) {
      reload.addEventListener('click', function () {
        location.reload();
      });
    }
  }

  function scriptLoaded_(srcPart) {
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      var src = String(scripts[i].getAttribute('src') || '');
      if (src.indexOf(srcPart) >= 0) return true;
    }
    return false;
  }

  function tryOpenEditor_() {
    if (document.getElementById('mcVisualEditor')) return true;
    if (typeof window.openVisualEditorOverlay === 'function') {
      window.openVisualEditorOverlay();
      return !!document.getElementById('mcVisualEditor');
    }
    if (window.MCuratorVisualEditorLauncher && typeof window.MCuratorVisualEditorLauncher.open === 'function') {
      window.MCuratorVisualEditorLauncher.open({});
      return !!document.getElementById('mcVisualEditor');
    }
    return false;
  }

  function bootEditorWithRetry_(attempt) {
    if (!isEditorEntry_()) return;
    hideBlockingChrome_();
    if (tryOpenEditor_()) return;
    if (attempt >= 80) {
      var lines = [
        '請用 <code>啟動視覺編輯器.bat</code> 或 <code>http://127.0.0.1:8765/apps-script/UI.html?editor=1</code> 開啟（不要用 file://）。',
        '確認已載入 <code>local-preview-boot.js</code>：' + (typeof window.google !== 'undefined' && window.google.script && window.google.script.run ? 'OK' : '缺少'),
        '確認已載入 <code>welcome-museum.js</code>：' + (scriptLoaded_('welcome-museum.js') ? 'OK' : '缺少'),
        '若仍失敗，按 F12 查看 Console 是否有紅色錯誤（welcome-museum.js）。',
      ];
      showBootError_(lines);
      return;
    }
    setTimeout(function () {
      bootEditorWithRetry_(attempt + 1);
    }, 250);
  }

  if (isEditorContext_()) {
    hideBlockingChrome_();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hideBlockingChrome_);
    }
    window.addEventListener('load', hideBlockingChrome_);
  }

  if (isEditorEntry_()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        bootEditorWithRetry_(0);
      });
    } else {
      bootEditorWithRetry_(0);
    }
    window.addEventListener('load', function () {
      bootEditorWithRetry_(0);
    });
  }

  window.MCuratorEditorBoot = {
    retry: function () {
      bootEditorWithRetry_(0);
    },
  };
})();
