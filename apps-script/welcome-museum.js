/**
 * ACTIVE FILE — used by UI.html
 * Do not import old landing / museum versions at the same time.
 *
 * Welcome hero: procedural canvas (vault / gallery bokeh, no green “tech mesh”).
 * Throttled parallax; respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e0) {
    void 0;
  }
  var editorStaticPreview = false;
  try {
    if (window.MCuratorEditorMode && typeof window.MCuratorEditorMode.shouldEnableEditorStaticPreview === 'function') {
      editorStaticPreview = window.MCuratorEditorMode.shouldEnableEditorStaticPreview();
    } else {
      var _p = new URLSearchParams(String((window.location && window.location.search) || ''));
      editorStaticPreview = _p.get('editorPreview') === '1' || _p.get('staticPreview') === '1';
    }
  } catch (eEditorFlag) {
    editorStaticPreview = false;
  }

  function mcT(key) {
    if (typeof window.mcT === 'function') return window.mcT(key);
    if (typeof window.MCt === 'function') return String(window.MCt(key) || '');
    return key;
  }

  function wmCopy(key) {
    var pack = (window.MCWelcomeMuseumCopy && window.MCWelcomeMuseumCopy[key]) || null;
    if (pack && typeof window.mcPick === 'function') return window.mcPick(pack);
    if (pack) {
      var lang = welcomeUiLang();
      if (lang === 'zh-TW' || lang === 'zh') return pack.zh || pack.en || key;
      if (lang === 'ja-JP' || lang === 'ja') return pack.ja || pack.en || key;
      if (lang === 'de-DE' || lang === 'de') return pack.de || pack.en || key;
      return pack.en || pack.zh || key;
    }
    return mcT(key);
  }

  function welcomeUiLang() {
    try {
      if (typeof window.mcGetLang === 'function') {
        var gl = window.mcGetLang();
        if (gl === 'en' || gl === 'zh-TW' || gl === 'ja-JP' || gl === 'de-DE') return gl;
      }
      if (typeof state !== 'undefined' && state && state.lang) {
        if (state.lang === 'en' || state.lang === 'zh-TW' || state.lang === 'ja-JP' || state.lang === 'de-DE') return state.lang;
      }
      if (window.MC_LOCALE === 'en' || window.MC_LOCALE === 'ja-JP' || window.MC_LOCALE === 'de-DE') return window.MC_LOCALE;
      var s = localStorage.getItem('MC_USER_LANG');
      if (s === 'en' || s === 'zh-TW' || s === 'ja-JP' || s === 'de-DE') return s;
    } catch (eLang) {
      void 0;
    }
    return 'zh-TW';
  }

  function isWelcomeCjkLocale_() {
    return isWelcomeZh() || isWelcomeJa();
  }

  function isWelcomeDe() {
    return welcomeUiLang() === 'de-DE';
  }

  function isWelcomeJa() {
    return welcomeUiLang() === 'ja-JP';
  }

  function isWelcomeZh() {
    return welcomeUiLang() === 'zh-TW';
  }

  function isWelcomeEn() {
    return welcomeUiLang() === 'en';
  }

  function isEditorPreviewActive_() {
    try {
      if (editorStaticPreview) return true;
      var p = new URLSearchParams(String((window.location && window.location.search) || ''));
      return p.get('editorPreview') === '1';
    } catch (ePrev) {
      return false;
    }
  }

  /** Visual editor iframe / standalone shell — editor coverflow items must win over collection-wall localStorage. */
  function isVisualEditorCoverflowActive_() {
    try {
      if (typeof window === 'undefined') return false;
      if (window.__MC_EDITOR_PREVIEW_INSPECT__) return true;
      if (window.__MC_EDITOR_PREVIEW_RUNTIME__) return true;
      if (isEditorPreviewActive_()) return true;
      var p = new URLSearchParams(String((window.location && window.location.search) || ''));
      if (p.get('editor') === '1') return true;
      if (localStorage.getItem('mcurator.visualEditor.config')) return true;
    } catch (eEdCf) {
      void 0;
    }
    return false;
  }

  /** Apply saved editor / CMS text only in editor preview or when UI is zh-TW (never on public EN). */
  function shouldApplyCmsTextOverrides_() {
    if (isEditorPreviewActive_()) return true;
    return isWelcomeZh();
  }

  function refreshNonTextWidgetsAfterEditorConfig_() {
    if (typeof window.mcReloadSpecimenCoverflow === 'function') {
      try {
        window.mcReloadSpecimenCoverflow();
      } catch (eCf) {
        void 0;
      }
    }
    if (window.MCCollectionWall && typeof window.MCCollectionWall.refreshI18n === 'function') {
      try {
        window.MCCollectionWall.refreshI18n();
      } catch (eCw) {
        void 0;
      }
    }
  }

  function patchApplyI18nForEditor_() {
    if (window.__MC_EDITOR_I18N_PATCHED__) return;
    var tries = 0;
    function attempt_() {
      if (typeof window.applyI18n !== 'function') {
        if (tries++ < 60) setTimeout(attempt_, 100);
        return;
      }
      if (window.__MC_EDITOR_I18N_PATCHED__) return;
      window.__MC_EDITOR_I18N_PATCHED__ = true;
      var orig = window.applyI18n;
      window.applyI18n = function () {
        var out = orig.apply(this, arguments);
        if (hasSavedEditorConfig_()) {
          try {
            applyEditorConfig(getEditorConfig());
          } catch (eRe) {
            console.warn('[VisualEditor] re-apply after i18n failed', eRe);
          }
        }
        return out;
      };
      if (typeof window.refreshWelcomeMuseumI18n === 'function' && !window.__MC_EDITOR_WM_I18N_PATCHED__) {
        window.__MC_EDITOR_WM_I18N_PATCHED__ = true;
        var origWm = window.refreshWelcomeMuseumI18n;
        window.refreshWelcomeMuseumI18n = function () {
          var outWm = origWm.apply(this, arguments);
          if (hasSavedEditorConfig_()) {
            try {
              applyEditorConfig(getEditorConfig());
            } catch (eWmRe) {
              console.warn('[VisualEditor] re-apply after welcome i18n failed', eWmRe);
            }
          }
          return outWm;
        };
      }
    }
    attempt_();
  }

  function scheduleReapplyEditorConfig_() {
    if (!hasSavedEditorConfig_()) return;
    var cfg = getEditorConfig();
    applyEditorConfig(cfg);
    setTimeout(function () {
      applyEditorConfig(getEditorConfig());
    }, 0);
    setTimeout(function () {
      applyEditorConfig(getEditorConfig());
    }, 400);
    window.addEventListener(
      'load',
      function () {
        applyEditorConfig(getEditorConfig());
      },
      { once: true }
    );
  }

  function cfFilterLabel_(key) {
    var labels = {
      all: mcT('cw_filter_all'),
      insect: mcT('cw_filter_insect'),
      entomology: mcT('cw_filter_insect'),
      beetle: mcT('cw_filter_beetle'),
      shell: mcT('cw_filter_shell'),
      seed: mcT('cw_filter_seed'),
      fish: mcT('cw_filter_fish'),
      plant: mcT('cw_filter_plant'),
      botany: mcT('cw_filter_plant'),
      fossil: mcT('cw_filter_paleontology'),
      paleontology: mcT('cw_filter_paleontology'),
      dinopedia: mcT('cw_filter_dinopedia'),
      verified: mcT('cw_filter_verified'),
    };
    return labels[key] || key;
  }

  function cfDisplayStatus_(item) {
    item = item || {};
    var sk = item.statusKey;
    if (!sk && item.status === '已核') sk = 'verified';
    if (!sk && item.status === '審中') sk = 'pending';
    if (sk === 'verified') return mcT('cw_status_verified');
    if (sk === 'pending') return mcT('cw_status_pending');
    if (item.status === '未核' || item.status === '待審') return mcT('cw_status_unverified');
    if (item.status && !/[\u4e00-\u9fff]/.test(String(item.status))) return item.status;
    return mcT('cw_status_verified');
  }

  function cfDisplayVisibility_(vis) {
    var zhMap = {
      公開: 'cw_visibility_public',
      草稿: 'cw_visibility_draft',
      隱藏: 'cw_visibility_hidden',
      館內主要: 'cw_visibility_internal',
      館內: 'cw_visibility_internal',
      教育展示: 'cw_visibility_public',
      館藏級示範: 'cw_visibility_public',
      研究資料共享: 'cw_visibility_public',
      研究館藏公開: 'cw_visibility_public',
      博物館數位館藏: 'cw_visibility_public',
      學術復原示範: 'cw_visibility_public',
      常規種: 'cw_visibility_public',
      稀有: 'cw_visibility_public',
      產地常見: 'cw_visibility_public',
      保護區內: 'cw_visibility_public',
      潮間帶: 'cw_visibility_public',
      館藏複製: 'cw_visibility_internal',
    };
    if (vis === 'public' || vis === 'draft' || vis === 'hidden' || vis === 'internal') {
      return mcT('cw_visibility_' + vis);
    }
    if (zhMap[vis]) return mcT(zhMap[vis]);
    if (!isWelcomeEn() && vis && /[\u4e00-\u9fff]/.test(String(vis))) {
      return mcT('cw_visibility_public') || (isWelcomeJa() ? '公開' : isWelcomeDe() ? 'Öffentlich' : 'Public');
    }
    return vis || '—';
  }

  function cfDisplayLocality_(text) {
    if (!text || text === '—') return text || '—';
    if (isWelcomeCjkLocale_()) return text;
    try {
      if (window.McWelcomeHeroDemo && typeof window.McWelcomeHeroDemo.translateLocality === 'function') {
        return window.McWelcomeHeroDemo.translateLocality(text);
      }
    } catch (eLoc) {
      void 0;
    }
    return text;
  }

  function cfDisplayCommon_(text) {
    if (!text) return '';
    if (isWelcomeCjkLocale_()) return text;
    var s = String(text);
    var slash = s.indexOf(' / ');
    if (slash >= 0) return s.slice(slash + 3).trim();
    if (/[\u4e00-\u9fff]/.test(s)) return '';
    return s;
  }

  function cfDisplayCollector_(text) {
    if (!text || text === '—') return text || '—';
    if (isWelcomeCjkLocale_()) return text;
    if (/[\u4e00-\u9fff]/.test(String(text))) return 'MCurator Demo';
    return text;
  }

  function cfDisplayExport_(text) {
    if (!text) return mcT('cw_card_export_ready');
    if (isWelcomeCjkLocale_()) return text;
    if (String(text).indexOf('標籤就緒') >= 0) return mcT('cw_card_export_ready');
    return String(text)
      .replace(/標籤就緒/g, 'labels ready')
      .replace(/待審完成後匯出/g, 'export after review');
  }

  function cfDisplayReviewHint_(text) {
    if (!text || text === '（審查路徑可檢視）') return mcT('cw_card_review_hint');
    if (isWelcomeCjkLocale_()) return text;
    if (/[\u4e00-\u9fff]/.test(String(text))) return mcT('cw_card_review_hint');
    return text;
  }

  var CARD_FEATURES_ZH = {
    image: {
      title: '影像紀錄',
      value: 'Plusiotis chrysargirea 標本主圖',
      description: '標本照片、比例尺與細節圖可以集中管理，避免影像與資料分離。',
      points: ['主圖、細節圖與比例尺集中保存', '適合博物館展示與研究引用', '可連結標籤與 QR Code'],
      workflow: 'image',
    },
    id: {
      title: '館號 / SAT ID',
      value: 'MC-PLU-202104 / SAT-MC-PLU-202104',
      description: '館號對應實體標本，SAT ID 對應數位資料，讓同一筆標本能被搜尋、引用與追蹤。',
      points: ['建立唯一識別碼', '連結實體標本與數位資料', '方便收藏、研究與展示引用'],
      workflow: 'id',
    },
    taxonomy: {
      title: '學名與分類',
      value: 'Plusiotis chrysargirea / Jewel scarab',
      description: '記錄學名、俗名與分類階層，降低資料命名混亂，方便研究與教學使用。',
      points: ['學名：Plusiotis chrysargirea', '俗名：Jewel scarab', '分類可補上科、屬、種等階層'],
      workflow: 'taxonomy',
    },
    locality: {
      title: '產地與採集紀錄',
      value: 'Bajo Chirripo Talamanca, Costa Rica · 2021.04',
      association:
        '關聯：左側「產地．日期．採集者」→ 流程第 2 步「產地記錄」。點流程列可回到對應欄位。',
      description: '保留採集地、採集時間與採集者資訊，建立標本來源脈絡。',
      points: [
        '產地：Bajo Chirripo Talamanca, Costa Rica',
        '採集時間：2021.04',
        '採集者目前未填，可後續補齊',
      ],
      workflow: 'locality',
    },
    review: {
      title: '審查與能見度',
      value: '能見度：稀有 / 審查：待補',
      description: '控制標本資料是否公開、館內可見或需審查後才能展示。',
      points: ['能見度標記為稀有', '審查欄位可標示待審、已核或需補件', '避免未完成資料被誤用'],
      workflow: 'review',
    },
    export: {
      title: '匯出與標籤',
      value: 'QR / CSV / JSON',
      description: '資料完成後可輸出 QR、CSV、JSON 與標籤資料，用於展示、盤點與資料交換。',
      points: ['QR 可連結線上標本頁', 'CSV / JSON 可做資料交換', '標籤可用於實體館藏與展場'],
      workflow: 'export',
    },
  };

  var CARD_FEATURES_EN = {
    image: {
      title: 'Image record',
      value: 'Plusiotis chrysargirea primary image',
      description: 'Keep specimen photos, scale bars, and detail shots with the record—no orphaned files.',
      points: ['Primary, detail, and scale images in one place', 'Ready for museum display and citation', 'Links to labels and QR codes'],
      workflow: 'image',
    },
    id: {
      title: 'Accession / SAT ID',
      value: 'MC-PLU-202104 / SAT-MC-PLU-202104',
      description: 'Accession ties to the physical specimen; SAT ID ties to the digital record for search, citation, and tracking.',
      points: ['Stable unique identifiers', 'Links physical voucher to digital record', 'Supports collections, research, and exhibits'],
      workflow: 'id',
    },
    taxonomy: {
      title: 'Scientific name & taxonomy',
      value: 'Plusiotis chrysargirea / Jewel scarab',
      description: 'Scientific name, common name, and ranks—ready for museums, researchers, and teaching.',
      points: ['Scientific name: Plusiotis chrysargirea', 'Common name: Jewel scarab', 'Add family, genus, species ranks as needed'],
      workflow: 'taxonomy',
    },
    locality: {
      title: 'Locality & collection',
      value: 'Bajo Chirripo Talamanca, Costa Rica · 2021.04',
      association:
        'Linked: left “Locality · Date · Collector” → workflow step 2 “Locality”. Click a step to jump back to the field.',
      description: 'Preserve locality, collection date, and collector to anchor provenance.',
      points: [
        'Locality: Bajo Chirripo Talamanca, Costa Rica',
        'Collected: 2021.04',
        'Collector not filled yet—can be completed later',
      ],
      workflow: 'locality',
    },
    review: {
      title: 'Review & visibility',
      value: 'Visibility: Rare / Review: pending',
      description: 'Control whether a record is public, in-house only, or needs review before display.',
      points: ['Visibility marked as rare', 'Review can show pending, approved, or needs work', 'Prevents draft data from being misused'],
      workflow: 'review',
    },
    export: {
      title: 'Export & labels',
      value: 'QR / CSV / JSON',
      description: 'When complete, export QR, CSV, JSON, and label data for display, inventory, and exchange.',
      points: ['QR links to the online specimen page', 'CSV / JSON for data exchange', 'Labels for physical collections and exhibits'],
      workflow: 'export',
    },
  };

  var CARD_FEATURES_DE = {
    image: {
      title: 'Bilddatensatz',
      value: 'Plusiotis chrysargirea Hauptbild',
      description: 'Präparatfotos, Maßstäbe und Detailaufnahmen am Datensatz — keine verwaisten Dateien.',
      points: ['Haupt-, Detail- und Maßstabsbilder an einem Ort', 'Bereit für Museumspräsentation und Zitation', 'Verknüpfung mit Etiketten und QR-Codes'],
      workflow: 'image',
    },
    id: {
      title: 'Inventarnummer / SAT-ID',
      value: 'MC-PLU-202104 / SAT-MC-PLU-202104',
      description: 'Inventarnummer verknüpft das physische Präparat; SAT-ID den digitalen Datensatz für Suche, Zitation und Nachverfolgung.',
      points: ['Stabile eindeutige Kennungen', 'Verknüpft physischen Beleg mit digitalem Datensatz', 'Unterstützt Sammlungen, Forschung und Ausstellungen'],
      workflow: 'id',
    },
    taxonomy: {
      title: 'Wissenschaftlicher Name & Taxonomie',
      value: 'Plusiotis chrysargirea / Jewel scarab',
      description: 'Wissenschaftlicher Name, Trivialname und Ränge — für Museen, Forschung und Lehre.',
      points: ['Wissenschaftlicher Name: Plusiotis chrysargirea', 'Trivialname: Jewel scarab', 'Familie, Gattung, Art nach Bedarf ergänzen'],
      workflow: 'taxonomy',
    },
    locality: {
      title: 'Fundort & Sammlung',
      value: 'Bajo Chirripo Talamanca, Costa Rica · 2021.04',
      association:
        'Verknüpft: links „Fundort · Datum · Sammler“ → Workflow-Schritt 2 „Fundort“. Klicken Sie auf einen Schritt, um zum Feld zurückzuspringen.',
      description: 'Fundort, Sammeldatum und Sammler bewahren die Herkunft.',
      points: [
        'Fundort: Bajo Chirripo Talamanca, Costa Rica',
        'Gesammelt: 2021.04',
        'Sammler noch nicht ausgefüllt — kann später ergänzt werden',
      ],
      workflow: 'locality',
    },
    review: {
      title: 'Prüfung & Sichtbarkeit',
      value: 'Sichtbarkeit: Selten / Prüfung: ausstehend',
      description: 'Steuern Sie, ob ein Datensatz öffentlich, nur intern oder vor Anzeige geprüft werden muss.',
      points: ['Sichtbarkeit als selten markiert', 'Prüfung kann ausstehend, genehmigt oder nacharbeiten zeigen', 'Verhindert Missbrauch von Entwurfsdaten'],
      workflow: 'review',
    },
    export: {
      title: 'Export & Etiketten',
      value: 'QR / CSV / JSON',
      description: 'Nach Vervollständigung QR, CSV, JSON und Etikettendaten für Präsentation, Inventur und Austausch exportieren.',
      points: ['QR verlinkt zur Online-Präparatseite', 'CSV / JSON für Datenaustausch', 'Etiketten für physische Sammlungen und Ausstellungen'],
      workflow: 'export',
    },
  };

  var CARD_FEATURES_JA = {
    image: {
      title: '画像記録',
      value: 'Plusiotis chrysargirea 主標本画像',
      description: '標本写真・スケール・詳細画像を記録と一体管理し、ファイルの分離を防ぎます。',
      points: ['主画像・詳細・スケールを一か所に保存', '博物館展示と引用に対応', 'ラベルと QR コードにリンク'],
      workflow: 'image',
    },
    id: {
      title: '館号 / SAT ID',
      value: 'MC-PLU-202104 / SAT-MC-PLU-202104',
      description: '館号は実物標本、SAT ID はデジタル記録に対応し、検索・引用・追跡を可能にします。',
      points: ['一意の識別子を付与', '実物とデジタル記録を連結', '収蔵・研究・展示の引用に対応'],
      workflow: 'id',
    },
    taxonomy: {
      title: '学名と分類',
      value: 'Plusiotis chrysargirea / Jewel scarab',
      description: '学名・一般名・分類階級を記録し、博物館・研究・教育での利用を支えます。',
      points: ['学名：Plusiotis chrysargirea', '一般名：Jewel scarab', '科・属・種などの階級を追加可能'],
      workflow: 'taxonomy',
    },
    locality: {
      title: '産地と採集記録',
      value: 'Bajo Chirripo Talamanca, Costa Rica · 2021.04',
      association:
        '関連：左「産地・日付・採集者」→ ワークフロー第 2 ステップ「産地記録」。ステップをクリックで該当欄へ。',
      description: '採集地・採集日・採集者を残し、標本の来歴を明確にします。',
      points: [
        '産地：Bajo Chirripo Talamanca, Costa Rica',
        '採集：2021.04',
        '採集者は未入力—後から追記可能',
      ],
      workflow: 'locality',
    },
    review: {
      title: '審査と公開範囲',
      value: '公開範囲：希少 / 審査：保留',
      description: '公開・館内限定・審査後公開など、記録の表示可否を制御します。',
      points: ['公開範囲を希少に設定', '審査状態を保留・承認・要修正で表示', '未完成データの誤用を防止'],
      workflow: 'review',
    },
    export: {
      title: 'エクスポートとラベル',
      value: 'QR / CSV / JSON',
      description: '完成後は QR・CSV・JSON・ラベルデータを出力し、展示・棚卸・データ交換に利用できます。',
      points: ['QR でオンライン標本ページへリンク', 'CSV / JSON でデータ交換', '実物収蔵と展場向けラベル'],
      workflow: 'export',
    },
  };

  function getCardFeatures() {
    var lang = welcomeUiLang();
    if (lang === 'zh-TW') return CARD_FEATURES_ZH;
    if (lang === 'ja-JP') return CARD_FEATURES_JA;
    if (lang === 'de-DE') return CARD_FEATURES_DE;
    return CARD_FEATURES_EN;
  }

  function clearMuralPhoto() {
    var el = document.getElementById('lpHeroLandingMuralImg');
    if (!el) return;
    el.style.backgroundImage = 'none';
    el.style.opacity = '0';
  }

  function resizeCanvas(canvas) {
    var parent = canvas.parentElement;
    if (!parent) return null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = parent.clientWidth;
    var h = parent.clientHeight;
    if (w < 2 || h < 2) return null;
    var needW = Math.floor(w * dpr);
    var needH = Math.floor(h * dpr);
    /* Setting canvas.width/height clears the bitmap every time — only resize when values change. */
    if (canvas.width !== needW || canvas.height !== needH) {
      canvas.width = needW;
      canvas.height = needH;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }
    return { w: w, h: h, dpr: dpr };
  }

  function drawFrame(ctx, state, t) {
    var w = state.w;
    var h = state.h;
    var dpr = state.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w * dpr, h * dpr);
    ctx.scale(dpr, dpr);

    var tau = t * 0.00012;
    var R = Math.max(w, h);

    var base = ctx.createRadialGradient(w * 0.48, h * 0.36, R * 0.08, w * 0.5, h * 0.52, R * 0.92);
    base.addColorStop(0, 'rgba(42, 56, 78, 0.72)');
    base.addColorStop(0.38, 'rgba(14, 20, 32, 0.55)');
    base.addColorStop(1, 'rgba(3, 5, 10, 0.98)');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    var edge = 0.42 + 0.06 * Math.sin(tau * 0.55);
    var vig = ctx.createRadialGradient(w * 0.5, h * 0.48, R * 0.18, w * 0.5, h * 0.52, R * 0.78);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, ' + edge.toFixed(3) + ')');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    var orbs = [
      { x: 0.16, y: 0.2, s: 0.2, a: 'rgba(130, 155, 205,', ph: 0 },
      { x: 0.84, y: 0.26, s: 0.16, a: 'rgba(95, 135, 185,', ph: 1.1 },
      { x: 0.74, y: 0.74, s: 0.24, a: 'rgba(75, 115, 155,', ph: 2.0 },
      { x: 0.26, y: 0.7, s: 0.14, a: 'rgba(165, 145, 115,', ph: 0.65 },
      { x: 0.52, y: 0.12, s: 0.12, a: 'rgba(110, 165, 175,', ph: 1.7 }
    ];
    var oi;
    for (oi = 0; oi < orbs.length; oi++) {
      var o = orbs[oi];
      var ox = w * (o.x + 0.028 * Math.sin(tau * 0.7 + o.ph));
      var oy = h * (o.y + 0.02 * Math.cos(tau * 0.55 + o.ph * 0.8));
      var rad = R * o.s * (0.92 + 0.08 * Math.sin(tau * 0.9 + oi));
      var og = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
      og.addColorStop(0, o.a + '0.16)');
      og.addColorStop(0.5, o.a + '0.05)');
      og.addColorStop(1, o.a + '0)');
      ctx.fillStyle = og;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = 'rgba(235, 238, 248, 0.14)';
    for (var p = 0; p < 26; p++) {
      var px = ((p * 641 + tau * 28) % 1) * w;
      var py = ((p * 397 + tau * 21) % 1) * h;
      var sz = 0.22 + (p % 4) * 0.12;
      ctx.globalAlpha = 0.22 + 0.2 * Math.sin(tau * 1.1 + p * 0.35);
      ctx.beginPath();
      ctx.arc(px, py, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    var ly = h * (0.38 + 0.07 * Math.sin(tau * 0.35));
    var leak = ctx.createLinearGradient(0, ly - 40, w, ly + 40);
    leak.addColorStop(0, 'rgba(255, 248, 230, 0)');
    leak.addColorStop(0.5, 'rgba(255, 250, 235, 0.035)');
    leak.addColorStop(1, 'rgba(255, 248, 230, 0)');
    ctx.fillStyle = leak;
    ctx.fillRect(0, 0, w, h);
  }

  function initCanvas() {
    var canvas = document.getElementById('lpHeroMuseumCanvas');
    if (!canvas || reduceMotion || editorStaticPreview) return;
    var fullscreenHeavy = false;
    try {
      fullscreenHeavy = !!(window.matchMedia && window.matchMedia('(min-width: 1400px)').matches);
    } catch (eFs) {
      fullscreenHeavy = false;
    }
    if (fullscreenHeavy) {
      try {
        canvas.style.display = 'none';
      } catch (eHide) {
        void 0;
      }
      return;
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var state = { w: 0, h: 0, dpr: 1 };
    var t0 = performance.now();
    var mx = 0;
    var my = 0;
    var parallaxX = 0;
    var parallaxY = 0;
    var moveRaf = 0;
    var moveLX = 0;
    var moveLY = 0;

    function onMove(e) {
      moveLX = e.clientX;
      moveLY = e.clientY;
      if (moveRaf) return;
      moveRaf = window.requestAnimationFrame(function () {
        moveRaf = 0;
        var nx = (moveLX / window.innerWidth - 0.5) * 2;
        var ny = (moveLY / window.innerHeight - 0.5) * 2;
        mx = nx;
        my = ny;
      });
    }
    if (!reduceMotion) {
      window.addEventListener('mousemove', onMove, { passive: true });
    }

    var raf = 0;
    var paused = false;
    function loop(now) {
      if (!paused) {
        raf = requestAnimationFrame(loop);
      }
      var dim = resizeCanvas(canvas);
      if (dim) {
        state.w = dim.w;
        state.h = dim.h;
        state.dpr = dim.dpr;
      }
      if (!state.w) return;
      parallaxX += (mx * 8 - parallaxX) * 0.04;
      parallaxY += (my * 6 - parallaxY) * 0.04;
      var t = now - t0;
      var ctx2 = canvas.getContext('2d');
      if (!ctx2) return;
      ctx2.save();
      ctx2.translate(parallaxX, parallaxY);
      drawFrame(ctx2, state, t);
      ctx2.restore();
    }
    raf = requestAnimationFrame(loop);
    try {
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
          paused = true;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        } else if (paused) {
          paused = false;
          raf = requestAnimationFrame(loop);
        }
      });
    } catch (eVis) {
      void 0;
    }
    var resizeCanvasTimer = null;
    window.addEventListener(
      'resize',
      function () {
        if (resizeCanvasTimer) window.clearTimeout(resizeCanvasTimer);
        resizeCanvasTimer = window.setTimeout(function () {
          resizeCanvasTimer = null;
          resizeCanvas(canvas);
        }, 150);
      },
      { passive: true }
    );
  }

  function openFieldStripOnTap() {
    if (window.matchMedia('(min-width: 900px)').matches) return;
    var cards = document.querySelectorAll('.lp-ft3-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function () {
        for (var j = 0; j < cards.length; j++) {
          cards[j].classList.remove('lp-ft3-card--fieldOpen');
        }
        this.classList.toggle('lp-ft3-card--fieldOpen');
      });
    }
  }

  function run() {
    if (window.__MCURATOR_HERO_CANVAS_INIT__) return;
    window.__MCURATOR_HERO_CANVAS_INIT__ = true;
    if (editorStaticPreview) return;
    clearMuralPhoto();
    setTimeout(clearMuralPhoto, 100);
    setTimeout(clearMuralPhoto, 800);
    setTimeout(clearMuralPhoto, 2000);
    initCanvas();
    openFieldStripOnTap();
  }

  try {
    window.McWelcomeMuseumShared = {
      mcT: mcT,
      welcomeUiLang: welcomeUiLang,
      isWelcomeZh: isWelcomeZh,
      isWelcomeJa: isWelcomeJa,
      isWelcomeEn: isWelcomeEn,
      shouldApplyCmsTextOverrides_: shouldApplyCmsTextOverrides_,
      getCardFeatures: getCardFeatures,
      cfFilterLabel_: cfFilterLabel_,
      cfDisplayStatus_: cfDisplayStatus_,
      cfDisplayVisibility_: cfDisplayVisibility_,
      cfDisplayLocality_: cfDisplayLocality_,
      cfDisplayCommon_: cfDisplayCommon_,
      cfDisplayCollector_: cfDisplayCollector_,
      cfDisplayExport_: cfDisplayExport_,
      cfDisplayReviewHint_: cfDisplayReviewHint_,
    };
  } catch (eSharedExport) {
    void 0;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
/**
 * MCurator welcome landing — museum v3 interactions (3D hero passport, deck, fragments, workflow, gallery).
 * CSS-first; no heavy deps. Respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  function reduceMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function mcT(key) {
    if (typeof window.mcT === 'function') return window.mcT(key);
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.mcT === 'function') return sh.mcT(key);
    if (typeof window.MCt === 'function') return String(window.MCt(key) || '');
    return key;
  }

  function isWelcomeZh() {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.isWelcomeZh === 'function') return sh.isWelcomeZh();
    try {
      if (typeof window.mcIsZhTW === 'function') return window.mcIsZhTW();
      if (typeof window.mcGetLang === 'function') return window.mcGetLang() === 'zh-TW';
      if (typeof state !== 'undefined' && state && state.lang) return state.lang === 'zh-TW';
      if (window.MC_LOCALE === 'zh-TW') return true;
      var s = localStorage.getItem('MC_USER_LANG');
      if (s === 'en' || s === 'ja-JP' || s === 'de-DE') return false;
      if (s === 'zh-TW') return true;
    } catch (eLang) {
      void 0;
    }
    return true;
  }

  function isEditorPreviewActive_() {
    try {
      if (window.MCuratorEditorMode && typeof window.MCuratorEditorMode.shouldEnableEditorStaticPreview === 'function') {
        if (window.MCuratorEditorMode.shouldEnableEditorStaticPreview()) return true;
      }
      var p = new URLSearchParams(String((window.location && window.location.search) || ''));
      return p.get('editorPreview') === '1' || p.get('staticPreview') === '1';
    } catch (ePrev) {
      return false;
    }
  }

  function shouldApplyCmsTextOverrides_() {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.shouldApplyCmsTextOverrides_ === 'function') {
      try {
        if (sh.shouldApplyCmsTextOverrides_()) return true;
      } catch (eSh) {
        void 0;
      }
    }
    return isEditorPreviewActive_() || isWelcomeZh();
  }

  function refreshNonTextWidgetsAfterEditorConfig_() {
    if (typeof window.mcReloadSpecimenCoverflow === 'function') {
      try {
        window.mcReloadSpecimenCoverflow();
      } catch (eCf) {
        void 0;
      }
    }
    if (window.MCCollectionWall && typeof window.MCCollectionWall.refreshI18n === 'function') {
      try {
        window.MCCollectionWall.refreshI18n();
      } catch (eCw) {
        void 0;
      }
    }
  }

  function scheduleReapplyEditorConfig_() {
    if (!hasSavedEditorConfig_()) return;
    var delays = [0, 100, 400, 1000, 2500, 5000];
    for (var di = 0; di < delays.length; di++) {
      (function (ms) {
        setTimeout(function () {
          try {
            applyEditorConfig(getEditorConfig());
          } catch (eRe) {
            if (ms === 0) console.warn('[VisualEditor] scheduleReapplyEditorConfig_ failed', eRe);
          }
        }, ms);
      })(delays[di]);
    }
    window.addEventListener(
      'load',
      function () {
        try {
          applyEditorConfig(getEditorConfig());
        } catch (eLoad) {
          void 0;
        }
      },
      { once: true }
    );
  }

  function syncEditorStructuredFieldsToOverrides_(config) {
    config = normalizeEditorConfig_(config || getEditorConfig());
    var pid = String(config.activePageId || 'landing');
    if (!config.pageConfigs[pid] || typeof config.pageConfigs[pid] !== 'object') {
      config.pageConfigs[pid] = cloneEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.pageConfigs.landing);
    }
    var pc = config.pageConfigs[pid];
    if (!Array.isArray(pc.textOverrides)) pc.textOverrides = [];
    function upsertText_(selector, value) {
      if (value == null) return;
      var text = String(value);
      var found = -1;
      for (var i = 0; i < pc.textOverrides.length; i++) {
        if (pc.textOverrides[i] && pc.textOverrides[i].selector === selector) {
          found = i;
          break;
        }
      }
      var row = {
        id: 'sync_text_' + selector.replace(/[^a-z0-9_-]/gi, '_'),
        selector: selector,
        property: 'textContent',
        value: text,
        text: text,
      };
      if (found < 0) pc.textOverrides.push(row);
      else pc.textOverrides[found] = mergeEditorConfig_(pc.textOverrides[found], row);
    }
    var hero = config.hero || {};
    upsertText_('#welcomeHeroBadge', hero.eyebrow);
    upsertText_('#welcomeContentTitle', hero.title);
    upsertText_('#welcomeContentLead', hero.subtitle);
    upsertText_('#btnWelcomeHeroDemo', hero.primaryButton);
    upsertText_('#btnWelcomeHeroStart', hero.secondaryButton);
    if (config.entry && Array.isArray(config.entry.cards)) {
      var entrySelectors = [
        ['#gwLabelEnterprise', '#gwTEnterprise', 'h3', '#btnGatewayEnterprise'],
        ['#gwLabelMember', '#gwTMember', 'h3', '#btnGatewayMember'],
        ['#gwLabelCoop', '#gwTCoop', 'h3', '#btnGatewayCoop'],
      ];
      for (var ci = 0; ci < config.entry.cards.length && ci < 3; ci++) {
        var card = config.entry.cards[ci] || {};
        var cardRoot = '#welcomeGateSection .entry-mode-card:nth-child(' + (ci + 1) + ')';
        upsertText_(cardRoot + ' .entry-mode-label', card.label);
        upsertText_(cardRoot + ' h3', card.title);
        upsertText_(cardRoot + ' .entry-mode-intro', card.description);
        upsertText_(cardRoot + ' .entry-mode-action', card.button);
      }
    }
    var wf = config.workflow || {};
    upsertText_('#welcomeLpValuesH', wf.title);
    upsertText_('#welcomeLpValuesDek', wf.subtitle);
    var cf = config.coverflow || {};
    upsertText_('#mcSpecimenCoverflowH', cf.title);
    upsertText_('#mcSpecimenCoverflowEyebrow', cf.subtitle);
    return config;
  }

  function patchEditorContentStompGuard_() {
    if (window.__MC_EDITOR_STOMP_GUARD__) return;
    var tries = 0;
    function wrapReapply_(fn) {
      return function () {
        var out = fn.apply(this, arguments);
        if (hasSavedEditorConfig_()) {
          try {
            applyEditorConfig(getEditorConfig());
          } catch (eRe) {
            void 0;
          }
        }
        return out;
      };
    }
    function attempt_() {
      var patchedAny = false;
      if (window.MCContentV2 && typeof window.MCContentV2.applyWelcome === 'function' && !window.MCContentV2.__editorPersistPatched) {
        window.MCContentV2.applyWelcome = wrapReapply_(window.MCContentV2.applyWelcome);
        window.MCContentV2.__editorPersistPatched = true;
        patchedAny = true;
      }
      if (window.MCContentService && typeof window.MCContentService.applyOverlays === 'function' && !window.MCContentService.__editorPersistPatched) {
        window.MCContentService.applyOverlays = wrapReapply_(window.MCContentService.applyOverlays);
        window.MCContentService.__editorPersistPatched = true;
        patchedAny = true;
      }
      if (window.McWelcomeHeroDemo && typeof window.McWelcomeHeroDemo.refreshI18n === 'function' && !window.McWelcomeHeroDemo.__editorPersistPatched) {
        window.McWelcomeHeroDemo.refreshI18n = wrapReapply_(window.McWelcomeHeroDemo.refreshI18n);
        window.McWelcomeHeroDemo.__editorPersistPatched = true;
        patchedAny = true;
      }
      if (!window.__MC_EDITOR_STOMP_GUARD__) {
        if (tries++ < 100) setTimeout(attempt_, 150);
        else window.__MC_EDITOR_STOMP_GUARD__ = true;
      }
      if (patchedAny) window.__MC_EDITOR_STOMP_GUARD__ = true;
    }
    attempt_();
  }

  function cfFilterLabel_(key) {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.cfFilterLabel_ === 'function') return sh.cfFilterLabel_(key);
    return key;
  }

  function cfDisplayStatus_(item) {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.cfDisplayStatus_ === 'function') return sh.cfDisplayStatus_(item);
    return (item && item.status) || '—';
  }

  function cfDisplayVisibility_(vis) {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.cfDisplayVisibility_ === 'function') return sh.cfDisplayVisibility_(vis);
    return vis || '—';
  }

  function cfDisplayLocality_(text) {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.cfDisplayLocality_ === 'function') return sh.cfDisplayLocality_(text);
    return text || '—';
  }

  function cfDisplayCommon_(text) {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.cfDisplayCommon_ === 'function') return sh.cfDisplayCommon_(text);
    return text || '';
  }

  function cfDisplayCollector_(text) {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.cfDisplayCollector_ === 'function') return sh.cfDisplayCollector_(text);
    return text || '—';
  }

  function cfDisplayExport_(text) {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.cfDisplayExport_ === 'function') return sh.cfDisplayExport_(text);
    return text || '';
  }

  function cfDisplayReviewHint_(text) {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.cfDisplayReviewHint_ === 'function') return sh.cfDisplayReviewHint_(text);
    return text || '';
  }

  function getCardFeatures() {
    var sh = window.McWelcomeMuseumShared;
    if (sh && typeof sh.getCardFeatures === 'function') return sh.getCardFeatures();
    return {};
  }

  function patchApplyI18nForEditor_() {
    if (window.__MC_EDITOR_I18N_PATCHED__) return;
    var tries = 0;
    function attempt_() {
      if (typeof window.applyI18n !== 'function') {
        if (tries++ < 60) setTimeout(attempt_, 100);
        return;
      }
      if (window.__MC_EDITOR_I18N_PATCHED__) return;
      window.__MC_EDITOR_I18N_PATCHED__ = true;
      var orig = window.applyI18n;
      window.applyI18n = function () {
        var out = orig.apply(this, arguments);
        if (hasSavedEditorConfig_()) {
          try {
            applyEditorConfig(getEditorConfig());
          } catch (eRe) {
            console.warn('[VisualEditor] re-apply after i18n failed', eRe);
          }
        }
        return out;
      };
      if (typeof window.refreshWelcomeMuseumI18n === 'function' && !window.__MC_EDITOR_WM_I18N_PATCHED__) {
        window.__MC_EDITOR_WM_I18N_PATCHED__ = true;
        var origWm = window.refreshWelcomeMuseumI18n;
        window.refreshWelcomeMuseumI18n = function () {
          var outWm = origWm.apply(this, arguments);
          if (hasSavedEditorConfig_()) {
            try {
              applyEditorConfig(getEditorConfig());
            } catch (eWmRe) {
              console.warn('[VisualEditor] re-apply after welcome i18n failed', eWmRe);
            }
          }
          return outWm;
        };
      }
    }
    attempt_();
  }

  /**
   * Default specimen coverflow (landing). Overridden by CMS publish / draft, localStorage, or window.MC_EDITOR_CONFIG.specimenCoverflow.
   */
  var DEFAULT_SPECIMEN_COVERFLOW_CONFIG = {
    title: '像標本櫃一樣瀏覽數位典藏',
    subtitle: 'Tap cards to view images, catalog numbers, and SAT specimen metadata.',
    showFilters: true,
    backgroundMode: 'dark',
    defaultDisplayMode: 'grid',
    filters: ['all', 'insect', 'plant', 'paleontology', 'dinopedia'],
    items: [],
  };

  var MC_SPECIMEN_COVERFLOW_ITEMS = DEFAULT_SPECIMEN_COVERFLOW_CONFIG.items;

  try {
    window.MC_SPECIMEN_COVERFLOW_ITEMS = MC_SPECIMEN_COVERFLOW_ITEMS;
  } catch (eMcCf) {
    void 0;
  }

  function normalizeWorkflowCoverflowImage_(image) {
    if (!image) return '';
    return String(image).replace(/^\.\.\/+/, '').replace(/^\//, '');
  }

  function scientificNameFromImagePath_(path) {
    try {
      if (window.MCWorkflowPassport && typeof window.MCWorkflowPassport.scientificNameFromImagePath === 'function') {
        return window.MCWorkflowPassport.scientificNameFromImagePath(path);
      }
    } catch (eSci) {
      void 0;
    }
    var base = String(path || '').split('/').pop().replace(/\.[^.]+$/, '');
    var parts = base.split(/[-_]+/).filter(Boolean);
    if (parts.length < 2) return base;
    return parts
      .map(function (part, index) {
        part = part.toLowerCase();
        return index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part;
      })
      .join(' ');
  }

  function renderMcPassportCoverflowCard_(item) {
    if (typeof window.MCWorkflowPassport !== 'undefined' && typeof window.MCWorkflowPassport.renderCoverflowCard === 'function') {
      return window.MCWorkflowPassport.renderCoverflowCard(item);
    }
    return renderSpecimenRecordCard(item, 'specimen-record-card--coverflow', false, item._cfConfigIndex);
  }

  function workflowMcToMuseumNo_(mc) {
    var s = String(mc || '')
      .replace(/\s+/g, '')
      .replace(/^MC-?/i, 'MC-');
    if (!/^MC-/i.test(s)) s = 'MC-' + s;
    return s;
  }

  function workflowMcToSatId_(spec, idx) {
    if (spec && spec.satId) return String(spec.satId);
    var n = (idx | 0) + 1;
    return 'SAT-MC-' + String(100000 + n).slice(-6);
  }

  function workflowCategoryMeta_(spec) {
    spec = spec || {};
    var cat = String(spec.category || 'entomology');
    var taxBlob = String(spec.taxonomy || spec.taxon || '');
    if (cat === 'botany') {
      return { category: 'plant', tags: ['plant', 'botany', 'verified'], rarity: 'common' };
    }
    if (cat === 'paleontology') {
      return { category: 'paleontology', tags: ['paleontology', 'fossil', 'verified'], rarity: 'rare' };
    }
    if (cat === 'dinopedia') {
      return { category: 'dinopedia', tags: ['dinopedia', 'dinosaur', 'verified'], rarity: 'epic' };
    }
    var beetle = /coleoptera/i.test(taxBlob) || /buprestidae|lucanidae|scarabaeidae|elateridae/i.test(taxBlob);
    return {
      category: 'insect',
      tags: beetle ? ['insect', 'entomology', 'beetle', 'verified'] : ['insect', 'entomology', 'verified'],
      rarity: beetle ? 'legendary' : 'rare',
    };
  }

  function workflowSpecimenToCoverflowItem_(spec, idx) {
    spec = spec || {};
    var catMap = workflowCategoryMeta_(spec);
    var pct = 62 + ((idx * 7) % 33);
    var imagePath = spec.image || '';
    var sci = spec.scientificName || scientificNameFromImagePath_(imagePath) || '—';
    return {
      id: workflowMcToSatId_(spec, idx),
      mc: spec.mc || '',
      museumNo: workflowMcToMuseumNo_(spec.mc),
      title: sci,
      scientificName: sci,
      category: catMap.category,
      specimenCategory: spec.category || catMap.category,
      tags: catMap.tags,
      rarity: catMap.rarity,
      origin: spec.locality || '—',
      locality: spec.locality || '—',
      status: '已核',
      statusKey: 'verified',
      collector: spec.collector || '—',
      date: spec.date || '—',
      exportReady: 'QR · CSV · JSON',
      photoFit: 'contain',
      image: normalizeWorkflowCoverflowImage_(imagePath),
      common: spec.commonName || '',
      type: spec.taxon || 'SPECIMEN',
      taxon: spec.taxon || '',
      taxonomy: spec.taxonomy || '',
      visibility: 'public',
      progress: pct,
      sourceSpecimenId: spec.id || '',
      sortOrder: idx,
    };
  }

  function buildCoverflowItemsFromWorkflow_() {
    try {
      var list = typeof window !== 'undefined' ? window.mcuratorSpecimenCandidates : null;
      if (!Array.isArray(list) || !list.length) return [];
      var out = [];
      var i;
      for (i = 0; i < list.length; i++) {
        out.push(normalizeCoverflowItem_(workflowSpecimenToCoverflowItem_(list[i], i)));
      }
      return out;
    } catch (eWf) {
      return [];
    }
  }

  function cloneCfg_(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (eCl) {
      return obj;
    }
  }

  function trySettingsSpecimenCoverflow_() {
    try {
      var st = typeof window !== 'undefined' ? window.state : null;
      if (!st || !st.settings) return null;
      var order = ['contentStudioPublishedJson', 'contentStudioDraftJson'];
      for (var oi = 0; oi < order.length; oi++) {
        var raw = st.settings[order[oi]];
        if (!raw || !String(raw).trim()) continue;
        var parsed = JSON.parse(String(raw));
        if (parsed && parsed.specimenCoverflow) return parsed.specimenCoverflow;
        if (parsed && parsed.editorModel && parsed.editorModel.specimenCoverflow) return parsed.editorModel.specimenCoverflow;
      }
    } catch (eSt) {
      void 0;
    }
    return null;
  }

  function mergeCoverflowCfg_(base, over) {
    if (!over) return base;
    var out = cloneCfg_(base);
    var k;
    for (k in over) {
      if (!Object.prototype.hasOwnProperty.call(over, k)) continue;
      if (k === 'items' && Array.isArray(over.items)) {
        if (over.items.length) {
          out.items = over.items.map(function (x) {
            return normalizeCoverflowItem_(x);
          });
        }
      } else {
        out[k] = over[k];
      }
    }
    return out;
  }

  function resolveDisciplineCategory_(r) {
    r = r || {};
    var raw = String(r.specimenCategory || r.workflowCategory || r.category || '')
      .toLowerCase()
      .trim();
    var id = String(r.sourceSpecimenId || r.id || '').toLowerCase();
    var img = String(r.image || r.coverImage || r.thumbnailUrl || '').toLowerCase();
    var tags = (r.tags || []).map(function (t) {
      return String(t || '').toLowerCase();
    });
    var map = {
      entomology: 'insect',
      insect: 'insect',
      beetle: 'insect',
      lepidoptera: 'insect',
      botany: 'plant',
      plant: 'plant',
      seed: 'plant',
      paleontology: 'paleontology',
      fossil: 'paleontology',
      dinopedia: 'dinopedia',
      dinosaur: 'dinopedia',
    };
    if (raw === 'verified' || raw === 'featured' || raw === 'all' || raw === 'pending') raw = '';
    if (map[raw]) return map[raw];
    if (tags.indexOf('dinopedia') >= 0 || tags.indexOf('dinosaur') >= 0) return 'dinopedia';
    if (tags.indexOf('paleontology') >= 0 || tags.indexOf('fossil') >= 0) return 'paleontology';
    if (tags.indexOf('botany') >= 0 || tags.indexOf('plant') >= 0 || tags.indexOf('seed') >= 0) return 'plant';
    if (
      tags.indexOf('entomology') >= 0 ||
      tags.indexOf('insect') >= 0 ||
      tags.indexOf('beetle') >= 0 ||
      tags.indexOf('lepidoptera') >= 0
    ) {
      return 'insect';
    }
    if (/^dino-|^dinopedia-/.test(id) || /\/dino\/|dinopedia|dinosaur|tyrannosaurus|nyctosaurus|shringasaurus|anningasaura/.test(id + img)) {
      return 'dinopedia';
    }
    if (/^paleo-/.test(id) || /\/paleo\/|paleontology|ammonite|trilobit|fossil|placoderm|lobopod/.test(id + img)) {
      return 'paleontology';
    }
    if (/^botany-|\/plant\/|hero-passport\/.*(ginkgo|quercus|nelumbo|adiantum|drosera|mimosa|nepenthes|pinus|platycerium|koelreuteria|nephrolepis)/.test(id + img)) {
      return 'plant';
    }
    if (/\/insect\/|hero-passport\//.test(img)) return 'insect';
    try {
      var list = typeof window !== 'undefined' ? window.mcuratorSpecimenCandidates : null;
      if (Array.isArray(list) && list.length) {
        var si;
        for (si = 0; si < list.length; si++) {
          var spec = list[si];
          if (!spec) continue;
          if (
            (r.sourceSpecimenId && spec.id === r.sourceSpecimenId) ||
            (spec.slug && (spec.slug === id || spec.id === id)) ||
            (r.mc && spec.mc && String(spec.mc).replace(/\s+/g, '') === String(r.mc).replace(/\s+/g, ''))
          ) {
            return resolveDisciplineCategory_({
              category: spec.category,
              specimenCategory: spec.category,
              tags: workflowCategoryMeta_(spec).tags,
            });
          }
        }
      }
    } catch (eLookup) {
      void 0;
    }
    return 'insect';
  }

  function disciplineCounts_(items) {
    var counts = { insect: 0, plant: 0, paleontology: 0, dinopedia: 0 };
    var i;
    for (i = 0; i < (items || []).length; i++) {
      var d = resolveDisciplineCategory_(items[i]);
      if (counts[d] != null) counts[d]++;
    }
    return counts;
  }

  function coverflowItemsNeedWorkflow_(items) {
    if (!items || !items.length) return true;
    if (items.length < 40) return true;
    var c = disciplineCounts_(items);
    return !(c.insect > 0 && c.plant > 0 && c.paleontology > 0 && c.dinopedia > 0);
  }

  function enrichCoverflowItemsFromWorkflow_(items) {
    var wf = buildCoverflowItemsFromWorkflow_();
    if (!wf.length) return items || [];
    items = items || [];
    if (coverflowItemsNeedWorkflow_(items)) return wf.map(function (x) {
      return normalizeCoverflowItem_(x);
    });
    var bySpecId = {};
    var byMc = {};
    var wi;
    for (wi = 0; wi < wf.length; wi++) {
      var w = wf[wi];
      if (w.sourceSpecimenId) bySpecId[w.sourceSpecimenId] = w;
      if (w.mc) byMc[String(w.mc).replace(/\s+/g, '')] = w;
    }
    return items.map(function (it) {
      var ref =
        bySpecId[it.sourceSpecimenId || ''] ||
        byMc[String(it.mc || '').replace(/\s+/g, '')] ||
        null;
      if (!ref) return it;
      var merged = Object.assign({}, ref, it);
      merged.category = ref.category;
      merged.specimenCategory = ref.specimenCategory;
      merged.tags = ref.tags;
      merged.taxonomy = ref.taxonomy || it.taxonomy;
      merged.taxon = ref.taxon || it.taxon;
      return normalizeCoverflowItem_(merged);
    });
  }

  function normalizeCoverflowItem_(r) {
    r = r || {};
    var sci = r.scientificName || r.title || '—';
    if (!isWelcomeEn()) {
      if (r.scientificName && !/[\u4e00-\u9fff]/.test(String(r.scientificName))) {
        sci = r.scientificName;
      } else if (r.titleEn) {
        sci = r.titleEn;
      } else if (/[\u4e00-\u9fff]/.test(String(sci))) {
        sci =
          r.displayTitle && !/[\u4e00-\u9fff]/.test(String(r.displayTitle))
            ? r.displayTitle
            : r.id || '—';
      }
    }
    var num = r.number || r.museumNo || r.mc || '—';
    if (sci === '—' && (r.image || r.coverImage)) {
      sci = scientificNameFromImagePath_(r.image || r.coverImage);
    }
    var tags = Array.isArray(r.tags) ? r.tags.slice() : [];
    var sk = r.statusKey;
    if (!sk && r.status === '已核') sk = 'verified';
    if (!sk && r.status === '審中') sk = 'pending';
    var locRaw = r.locality || r.origin || '—';
    var locDisp = cfDisplayLocality_(locRaw);
    var originRaw = r.origin || r.locality || '—';
    var originDisp = originRaw === locRaw ? locDisp : cfDisplayLocality_(originRaw);
    var discipline = resolveDisciplineCategory_(r);
    var specimenCat = String(r.specimenCategory || r.workflowCategory || '').trim();
    if (!specimenCat || specimenCat === 'verified' || specimenCat === 'featured') {
      specimenCat =
        discipline === 'plant'
          ? 'botany'
          : discipline === 'paleontology'
            ? 'paleontology'
            : discipline === 'dinopedia'
              ? 'dinopedia'
              : 'entomology';
    }
    if (tags.indexOf(discipline) < 0) tags.push(discipline);
    if (discipline === 'insect' && tags.indexOf('entomology') < 0) tags.push('entomology');
    if (discipline === 'plant' && tags.indexOf('botany') < 0) tags.push('botany');
    return {
      id: r.id || r.satId || 'SAT-MC-000000',
      mc: r.mc || '',
      number: num,
      museumNo: r.catalogNumber != null && r.catalogNumber !== '' ? String(r.catalogNumber) : num,
      assetNo: r.assetNo || '',
      title: sci,
      scientificName: sci,
      displayTitle: r.displayTitle || '',
      common: r.common || r.titleZh || '',
      type: r.type || r.taxon || r.taxonomyGroup || (r.category ? String(r.category).toUpperCase() : 'SPECIMEN'),
      taxon: r.taxon || r.type || '',
      taxonomy: r.taxonomy || '',
      category: discipline,
      specimenCategory: specimenCat,
      tags: tags,
      rarity: r.rarity || 'common',
      status: r.status || '已核',
      statusKey: sk || '',
      origin: originDisp,
      locality: locDisp,
      date: r.date || '—',
      collector: r.collector != null && r.collector !== '' ? r.collector : '—',
      holder: r.holder || '',
      visibility: r.visibility || r.license || (isWelcomeZh() ? '館內主要' : (isWelcomeJa() ? '館内主要' : isWelcomeDe() ? 'intern (Hauptbestand)' : 'public')),
      cardVisibility: r.cardVisibility || r.wallVisibility || '',
      featured: !!r.featured,
      pinned: !!r.pinned,
      sortOrder: r.sortOrder != null && r.sortOrder === r.sortOrder ? Number(r.sortOrder) : null,
      sourceSpecimenId: r.sourceSpecimenId || '',
      description: r.description || '',
      ctaUrl: r.ctaUrl || '',
      progress: r.progress != null && r.progress === r.progress ? Number(r.progress) : null,
      image: r.coverImage || r.image || '',
      fit: r.fit || r.photoFit || 'cover',
      photoFit: r.photoFit || r.fit || 'cover',
      registry: r.registry || '',
      exportText: cfDisplayExport_(r.exportText || r.exportReady || 'QR · CSV · JSON · 標籤就緒'),
      exportReady: cfDisplayExport_(r.exportReady || r.exportText || 'QR · CSV · JSON · 標籤就緒'),
      reviewHint: cfDisplayReviewHint_(r.reviewHint || '（審查路徑可檢視）'),
      license: r.license || '',
      coverImage: r.coverImage || '',
      thumbnailUrl: r.thumbnailUrl || '',
    };
  }

  function filterSpecimenItems_(list, filter) {
    if (filter === 'all') return list.slice();
    return list.filter(function (item) {
      if (!item) return false;
      var discipline = resolveDisciplineCategory_(item);
      if (discipline === filter) return true;
      if (item.category === filter) return true;
      if (filter === 'insect' && (item.category === 'beetle' || item.category === 'entomology')) return true;
      if (filter === 'plant' && (item.category === 'seed' || item.category === 'botany')) return true;
      if (filter === 'paleontology' && (item.category === 'fossil' || item.category === 'paleontology')) {
        var tg = item.tags || [];
        return tg.indexOf('dinopedia') < 0 && tg.indexOf('dinosaur') < 0;
      }
      if (filter === 'dinopedia' && (item.category === 'dinopedia' || item.category === 'fossil')) {
        var tg2 = item.tags || [];
        return item.category === 'dinopedia' || tg2.indexOf('dinopedia') >= 0 || tg2.indexOf('dinosaur') >= 0;
      }
      var tags = item.tags || [];
      var ti;
      for (ti = 0; ti < tags.length; ti++) {
        if (tags[ti] === filter) return true;
      }
      if (filter === 'insect' && tags.indexOf('insect') >= 0) return true;
      if (filter === 'plant' && tags.indexOf('plant') >= 0) return true;
      if (filter === 'paleontology' && tags.indexOf('paleontology') >= 0) return true;
      if (filter === 'dinopedia' && (tags.indexOf('dinopedia') >= 0 || tags.indexOf('dinosaur') >= 0)) return true;
      return false;
    });
  }

  function getSpecimenCoverflowConfig() {
    var d = cloneCfg_(DEFAULT_SPECIMEN_COVERFLOW_CONFIG);
    var pub = trySettingsSpecimenCoverflow_();
    if (pub) d = mergeCoverflowCfg_(d, pub);
    try {
      var ls = typeof localStorage !== 'undefined' ? localStorage.getItem('mcurator.ui.specimenCoverflow') : null;
      if (ls) d = mergeCoverflowCfg_(d, JSON.parse(ls));
    } catch (eLs) {
      try {
        console.warn('[MCurator] specimen coverflow localStorage', eLs);
      } catch (eC) {
        void 0;
      }
    }
    try {
      if (typeof window !== 'undefined' && window.MC_EDITOR_CONFIG && window.MC_EDITOR_CONFIG.coverflow) {
        d = mergeCoverflowCfg_(d, window.MC_EDITOR_CONFIG.coverflow);
      }
      if (typeof window !== 'undefined' && window.MC_EDITOR_CONFIG && window.MC_EDITOR_CONFIG.specimenCoverflow) {
        d = mergeCoverflowCfg_(d, window.MC_EDITOR_CONFIG.specimenCoverflow);
      }
    } catch (eEd) {
      void 0;
    }
    try {
      var cwSet = typeof localStorage !== 'undefined' ? localStorage.getItem('mcurator.collectionWall.settings') : null;
      if (cwSet) {
        var oCw = JSON.parse(cwSet);
        if (oCw && typeof oCw === 'object') {
          var ck;
          for (ck in oCw) {
            if (!Object.prototype.hasOwnProperty.call(oCw, ck) || ck === 'items') continue;
            d[ck] = oCw[ck];
          }
        }
      }
      var cwItems = typeof localStorage !== 'undefined' ? localStorage.getItem('mcurator.collectionWall.items') : null;
      if (cwItems && !isVisualEditorCoverflowActive_()) {
        var arrCw = JSON.parse(cwItems);
        if (Array.isArray(arrCw) && arrCw.length) d.items = arrCw;
      }
    } catch (eCwLs) {
      void 0;
    }
    try {
      if (
        isVisualEditorCoverflowActive_() &&
        typeof window !== 'undefined' &&
        window.MC_EDITOR_CONFIG &&
        window.MC_EDITOR_CONFIG.coverflow
      ) {
        d = mergeCoverflowCfg_(d, window.MC_EDITOR_CONFIG.coverflow);
      }
    } catch (eEdFinal) {
      void 0;
    }
    d.items = enrichCoverflowItemsFromWorkflow_((d.items || []).map(function (x) {
      return normalizeCoverflowItem_(x);
    }));
    if (!d.items.length) {
      var wfItems = buildCoverflowItemsFromWorkflow_();
      if (wfItems.length) d.items = wfItems;
    }
    var disciplineFilters = ['all', 'insect', 'plant', 'paleontology', 'dinopedia'];
    if (d.items.length && (!d.filters || !d.filters.length || d.filters.indexOf('fish') >= 0 || d.filters.indexOf('shell') >= 0)) {
      d.filters = disciplineFilters.slice();
    }
    if (d.filters && d.filters.length && d.filters.indexOf('all') < 0) {
      d.filters = ['all'].concat(d.filters.filter(function (fk) {
        return fk && fk !== 'all';
      }));
    }
    var def = DEFAULT_SPECIMEN_COVERFLOW_CONFIG;
    if (!d.title || d.title === def.title) d.title = mcT('cw_default_title');
    if (!d.subtitle || d.subtitle === def.subtitle) d.subtitle = mcT('cw_default_subtitle');
    if (!isWelcomeEn()) {
      if (d.title && /[\u4e00-\u9fff]/.test(String(d.title))) d.title = mcT('cw_default_title');
      if (d.subtitle && /[\u4e00-\u9fff]/.test(String(d.subtitle))) d.subtitle = mcT('cw_default_subtitle');
    }
    try {
      window.MC_SPECIMEN_COVERFLOW_ITEMS = d.items;
    } catch (ePubItems) {
      void 0;
    }
    return d;
  }

  function cfCompletionPct_(item) {
    if (item.progress != null && item.progress === item.progress) {
      var pn = Number(item.progress);
      if (pn === pn && pn >= 0 && pn <= 100) return Math.round(pn);
    }
    if (item.completion != null && item.completion !== '') {
      var n = parseInt(String(item.completion).replace(/%/g, ''), 10);
      if (n === n && n >= 0 && n <= 100) return n;
    }
    var byR = { legendary: 90, epic: 84, rare: 76, common: 68, museum: 88 };
    return byR[item.rarity] != null ? byR[item.rarity] : 72;
  }

  function cfResolveImg_(rel) {
    rel = String(rel || '').replace(/^\.\.\/+/, '');
    var path = '../' + rel.replace(/^\/+/, '');
    if (typeof window.mcResolveLocalRelToPage_ === 'function') {
      try {
        var u = window.mcResolveLocalRelToPage_(rel.replace(/^\.\.\//, ''));
        if (u) return u;
      } catch (eR) {
        void 0;
      }
    }
    return path;
  }

  function cfRegistryFallback_(item) {
    if (item.registry) return item.registry;
    var no = String(item.museumNo || item.number || item.id || '').replace(/^MC-/, '');
    var cat = String(item.category || 'rec').toUpperCase().slice(0, 5);
    return 'NHM・MC・' + cat + (no ? '・' + no : '') + '・β';
  }

  /**
   * Standard SpecimenRecordCard DOM (front only when includeFlip is false).
   * @param {object} item normalized item
   * @param {string} extraClass e.g. specimen-record-card--coverflow
   * @param {boolean} includeFlip reserved — coverflow uses false
   */
  function fitSpecimenScientificNameEl(el) {
    if (!el) return;
    el.style.fontSize = '';
    var parent = el.parentElement;
    if (!parent || parent.clientWidth < 1) return;
    var maxSize = parseFloat(window.getComputedStyle(el).fontSize) || 28;
    var floor = Math.max(11, maxSize * 0.36);
    el.style.whiteSpace = 'nowrap';
    el.style.overflow = 'hidden';
    el.style.textOverflow = 'ellipsis';
    el.style.display = 'block';
    el.style.maxWidth = '100%';
    var limit = parent.clientWidth;
    var size = maxSize;
    while (size > floor && el.scrollWidth > limit + 1) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }
  }

  function scheduleFitSpecimenScientificName(el) {
    if (!el) return;
    var run = function () {
      fitSpecimenScientificNameEl(el);
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    else run();
  }

  function renderSpecimenRecordCard(item, extraClass, includeFlip, cfIndex) {
    item = normalizeCoverflowItem_(item);
    cfIndex = cfIndex != null && cfIndex === cfIndex ? cfIndex : item._cfConfigIndex;
    var cfIdxStr = cfIndex != null && cfIndex !== '' ? String(cfIndex) : '';
    var isCoverflow = extraClass && String(extraClass).indexOf('coverflow') >= 0;
    var card = document.createElement('article');
    card.className = 'specimen-record-card rarity-' + (item.rarity || 'common');
    if (extraClass) card.className += ' ' + extraClass;
    card.setAttribute('data-interactive-card', '');
    card.setAttribute('data-sat-tilt-max', '14');

    var inner = document.createElement('div');
    inner.className = 'specimen-record-card__inner';

    var faceF = document.createElement('section');
    faceF.className = 'specimen-record-card__face specimen-record-card__front';

    var top = document.createElement('header');
    top.className = 'specimen-record-card__top';
    var ver = document.createElement('span');
    ver.className = 'specimen-record-card__verified specimen-record-card__kicker';
    ver.textContent = cfDisplayStatus_(item);
    var st = document.createElement('span');
    st.className = 'specimen-record-card__status';
    st.textContent = cfFilterLabel_(item.category || 'other');
    if (isCoverflow) {
      top.classList.add('specimen-record-card__top--coverflow');
      var topStart = document.createElement('div');
      topStart.className = 'specimen-record-card__topStart';
      topStart.appendChild(ver);
      var idsMid = document.createElement('div');
      idsMid.className = 'specimen-record-card__topIds';
      var strong = document.createElement('strong');
      strong.className = 'specimen-record-card__number';
      strong.textContent = item.museumNo || item.number || '—';
      idsMid.appendChild(strong);
      if (item.id) {
        var satSp = document.createElement('span');
        satSp.className = 'specimen-record-card__sat';
        satSp.textContent = item.id;
        idsMid.appendChild(satSp);
      }
      top.appendChild(topStart);
      top.appendChild(idsMid);
      top.appendChild(st);
    } else {
      var topL = document.createElement('div');
      var strong = document.createElement('strong');
      strong.className = 'specimen-record-card__number';
      strong.textContent = item.museumNo || item.number || '—';
      topL.appendChild(ver);
      topL.appendChild(strong);
      var satWrap = document.createElement('div');
      satWrap.className = 'specimen-record-card__satLine';
      satWrap.setAttribute('aria-label', 'SAT');
      var satSp = document.createElement('span');
      satSp.textContent = item.id || '';
      satWrap.appendChild(satSp);
      topL.appendChild(satWrap);
      top.appendChild(topL);
      top.appendChild(st);
    }

    var fig = document.createElement('figure');
    fig.className = 'specimen-record-card__photo';
    var fit = item.fit || item.photoFit || 'cover';
    fig.setAttribute('data-fit', fit);
    var ph = document.createElement('div');
    ph.className = 'mc-specimen-ph mc-specimen-ph--insect';
    ph.setAttribute('aria-hidden', 'true');
    ph.innerHTML =
      '<span class="mc-specimen-ph__icon" aria-hidden="true">🪲</span><span class="mc-specimen-ph__label">' +
      String(wmCopy('specimenPhLabel')).replace(/</g, '&lt;') +
      '</span><span class="mc-specimen-ph__note">' +
      String(wmCopy('specimenPhLoading')).replace(/</g, '&lt;') +
      '</span>';
    var img = document.createElement('img');
    img.className = 'mc-hero3d__img specimen-image-frame__img';
    img.setAttribute('alt', item.scientificName || '');
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    if (item.image) {
      img.setAttribute('src', cfResolveImg_(item.image));
      img.setAttribute(
        'onload',
        "try{this.classList.add('mc-welcome-img--loaded');var p=this.closest('.specimen-record-card__photo');if(p){var h=p.querySelector('.mc-specimen-ph');if(h)h.style.display='none';}}catch(e){}"
      );
    } else {
      img.hidden = true;
      var phLab = ph.querySelector('.mc-specimen-ph__label');
      if (phLab) phLab.textContent = cfFilterLabel_(item.category || 'other');
      var phNote = ph.querySelector('.mc-specimen-ph__note');
      if (phNote) phNote.textContent = item.scientificName || '';
    }
    fig.appendChild(ph);
    fig.appendChild(img);

    var ident = document.createElement('div');
    ident.className = 'specimen-record-card__identity';
    var typ = document.createElement('span');
    typ.className = 'specimen-record-card__type';
    typ.textContent = item.type || 'SPECIMEN';
    var h3 = document.createElement('h3');
    h3.className = 'specimen-record-card__sci-fit';
    h3.textContent = item.scientificName || '—';
    if (cfIdxStr) {
      h3.setAttribute('data-mc-cf-field', 'scientificName');
      h3.setAttribute('data-mc-cf-index', cfIdxStr);
    }
    var pSub = document.createElement('p');
    var commonLine = cfDisplayCommon_(item.common);
    if (isCoverflow) {
      var subPartsCf = [];
      if (commonLine) subPartsCf.push(commonLine);
      if (item.type) subPartsCf.push(String(item.type).toUpperCase());
      pSub.textContent = subPartsCf.length ? subPartsCf.join(' · ') : '—';
    } else {
      var subParts = [];
      if (commonLine) subParts.push(commonLine);
      var originLine = item.origin && item.common !== item.origin ? item.origin : '';
      if (isWelcomeEn() && originLine && /[\u4e00-\u9fff]/.test(originLine)) {
        originLine = item.locality || '';
      }
      if (originLine) subParts.push(cfDisplayLocality_(originLine));
      pSub.textContent = subParts.length ? subParts.join(' · ') : cfDisplayLocality_(item.locality || item.origin || '—');
    }
    if (cfIdxStr) {
      pSub.setAttribute('data-mc-cf-field', 'common');
      pSub.setAttribute('data-mc-cf-index', cfIdxStr);
    }
    if (!isCoverflow) ident.appendChild(typ);
    ident.appendChild(h3);
    ident.appendChild(pSub);

    function metaRow(dtText, ddText, fieldKey) {
      var w = document.createElement('div');
      var dt = document.createElement('dt');
      dt.textContent = dtText;
      var dd = document.createElement('dd');
      dd.textContent = ddText;
      if (fieldKey && cfIdxStr) {
        dd.setAttribute('data-mc-cf-field', fieldKey);
        dd.setAttribute('data-mc-cf-index', cfIdxStr);
      }
      w.appendChild(dt);
      w.appendChild(dd);
      return w;
    }
    var dlMeta = document.createElement('dl');
    dlMeta.className = 'specimen-record-card__meta';
    dlMeta.appendChild(
      metaRow(mcT('cw_meta_locality'), cfDisplayLocality_(item.locality || item.origin || '—'), 'locality')
    );
    dlMeta.appendChild(metaRow(mcT('cw_meta_date'), item.date || '—', 'date'));
    dlMeta.appendChild(metaRow(mcT('cw_card_step_collector'), cfDisplayCollector_(item.collector || '—'), 'collector'));
    dlMeta.appendChild(metaRow(mcT('cw_meta_visibility'), cfDisplayVisibility_(item.visibility), 'visibility'));

    var steps = document.createElement('nav');
    steps.className = 'specimen-record-card__steps';
    steps.setAttribute('aria-label', mcT('cw_record_steps') || (isWelcomeJa() ? '記録ステップ' : isWelcomeZh() ? '紀錄步驟' : isWelcomeDe() ? 'Datensatz-Schritte' : 'Record steps'));
    var stepLabels = [
      mcT('cw_card_step_label'),
      mcT('cw_card_step_image'),
      mcT('cw_card_step_taxon'),
      mcT('cw_card_step_locality'),
      mcT('cw_card_step_collector'),
      mcT('cw_card_step_visibility'),
      mcT('cw_card_step_review'),
      mcT('cw_card_step_export'),
    ];
    for (var si = 0; si < stepLabels.length; si++) {
      var sp = document.createElement('span');
      sp.textContent = stepLabels[si];
      steps.appendChild(sp);
    }

    var pct = cfCompletionPct_(item);
    var prog = document.createElement('div');
    prog.className = 'specimen-record-card__progress';
    if (isCoverflow) {
      var progHead = document.createElement('div');
      progHead.className = 'specimen-record-card__progressHead';
      var sp1 = document.createElement('span');
      sp1.textContent = mcT('cw_completion');
      var sp2 = document.createElement('strong');
      sp2.textContent = pct + '%';
      progHead.appendChild(sp1);
      progHead.appendChild(sp2);
      var progI = document.createElement('i');
      progI.style.setProperty('--value', pct + '%');
      prog.appendChild(progHead);
      prog.appendChild(progI);
    } else {
      var spanWrap = document.createElement('span');
      spanWrap.className = 'mc-hero3d__for mc-hero3d__for--pro is-visible';
      spanWrap.setAttribute('data-hero-blob', 'comp');
      var sp1b = document.createElement('span');
      sp1b.textContent = mcT('cw_completion');
      var sp2b = document.createElement('span');
      sp2b.textContent = pct + '%';
      var em = document.createElement('em');
      em.textContent = cfDisplayReviewHint_(item.reviewHint);
      spanWrap.appendChild(sp1b);
      spanWrap.appendChild(sp2b);
      spanWrap.appendChild(em);
      var progIb = document.createElement('i');
      progIb.style.setProperty('--value', pct + '%');
      prog.appendChild(spanWrap);
      prog.appendChild(progIb);
    }

    var foot = document.createElement('footer');
    foot.className = 'specimen-record-card__export';
    foot.textContent = isCoverflow ? mcT('cw_view_details') : cfDisplayExport_(item.exportText || item.exportReady);

    var reg = document.createElement('div');
    reg.className = 'specimen-record-card__registry';
    reg.textContent = cfRegistryFallback_(item);

    faceF.appendChild(top);
    faceF.appendChild(fig);
    faceF.appendChild(ident);
    faceF.appendChild(dlMeta);
    if (!isCoverflow) {
      faceF.appendChild(steps);
      faceF.appendChild(prog);
      faceF.appendChild(foot);
      faceF.appendChild(reg);
    } else {
      var cfFoot = document.createElement('div');
      cfFoot.className = 'specimen-record-card__coverflowFoot';
      cfFoot.appendChild(prog);
      cfFoot.appendChild(foot);
      faceF.appendChild(cfFoot);
    }

    inner.appendChild(faceF);
    if (includeFlip) {
      /* Reserved: back face not used in coverflow */
    }
    card.appendChild(inner);
    scheduleFitSpecimenScientificName(h3);
    return card;
  }

  function renderCoverflowHeader_(root, cfg) {
    var ey = root.querySelector('#mcSpecimenCoverflowEyebrow');
    var h = root.querySelector('#mcSpecimenCoverflowH');
    if (ey) {
      ey.textContent = mcT('cw_eyebrow');
      ey.hidden = true;
    }
    if (h) {
      h.textContent = shouldApplyCmsTextOverrides_()
        ? cfg.title || mcT('cw_default_title')
        : mcT('cw_default_title');
    }
  }

  function renderCoverflowFilters_(root, cfg) {
    var nav = root.querySelector('.specimen-coverflow-filters');
    if (!nav) return;
    var keys = cfg.filters && cfg.filters.length ? cfg.filters.slice() : DEFAULT_SPECIMEN_COVERFLOW_CONFIG.filters;
    if (keys.indexOf('all') < 0) {
      keys = ['all'].concat(keys.filter(function (fk) {
        return fk && fk !== 'all';
      }));
    }
    var labels = {
      all: mcT('cw_filter_all'),
      insect: mcT('cw_filter_insect'),
      entomology: mcT('cw_filter_insect'),
      beetle: mcT('cw_filter_beetle'),
      shell: mcT('cw_filter_shell'),
      seed: mcT('cw_filter_seed'),
      fish: mcT('cw_filter_fish'),
      plant: mcT('cw_filter_plant'),
      botany: mcT('cw_filter_plant'),
      fossil: mcT('cw_filter_paleontology'),
      paleontology: mcT('cw_filter_paleontology'),
      dinopedia: mcT('cw_filter_dinopedia'),
      verified: mcT('cw_filter_verified'),
    };
    var html = '';
    var activeFilter =
      root.getAttribute('data-coverflow-active-filter') ||
      (keys.indexOf('all') >= 0 ? 'all' : keys[0] || 'all');
    for (var fi = 0; fi < keys.length; fi++) {
      var fk = keys[fi];
      html +=
        '<button type="button" class="' +
        (fk === activeFilter ? 'is-active' : '') +
        '" data-filter="' +
        String(fk).replace(/"/g, '&quot;') +
        '">' +
        (labels[fk] || fk) +
        '</button>';
    }
    nav.innerHTML = html;
    nav.style.display = cfg.showFilters === false ? 'none' : '';
  }

  try {
    window.getSpecimenCoverflowConfig = getSpecimenCoverflowConfig;
    window.renderSpecimenRecordCard = renderSpecimenRecordCard;
    window.renderMcPassportCoverflowCard = renderMcPassportCoverflowCard_;
    window.initSpecimenRecordCards = initSpecimenRecordCards;
    window.mcFitSpecimenScientificName = fitSpecimenScientificNameEl;
    window.mcReloadSpecimenCoverflow = function () {
      var r = document.getElementById('mcSpecimenCoverflow');
      if (!r) return;
      r.removeAttribute('data-specimen-coverflow-ready');
      try {
        if (window.MCCollectionWall && typeof window.MCCollectionWall.initSpecimenCoverflow === 'function') {
          window.MCCollectionWall.initSpecimenCoverflow();
          return;
        }
      } catch (eCwReload) {
        void 0;
      }
      initMcSpecimenCoverflow();
    };
    window.mcGetDefaultSpecimenCoverflowConfig = function () {
      return cloneCfg_(DEFAULT_SPECIMEN_COVERFLOW_CONFIG);
    };
    window.buildCoverflowItemsFromWorkflow = buildCoverflowItemsFromWorkflow_;
    window.mcResolveDisciplineCategory = resolveDisciplineCategory_;
  } catch (eEx) {
    void 0;
  }

  /** 欄位文案：供 `initSpecimenFunctionSystem` 同步卡片 / 左欄流程 / 右側面板。 */

  /** 任務地圖六卡：滑鼠高光 + 輕微 3D 傾斜（監聽在 #welcomeContentFeatures，CMS 換卡後仍有效）。 */
  function initWorkflowQuestBoard(root) {
    root = root || document;
    var board = document.getElementById('welcomeContentFeatures');
    if (!board || board.getAttribute('data-quest-mv') === '1') return;
    board.setAttribute('data-quest-mv', '1');
    if (reduceMotion()) return;
    var maxTilt = 6;
    board.addEventListener(
      'pointermove',
      function (ev) {
        var card = ev.target && ev.target.closest && ev.target.closest('.quest-card');
        if (!card || !board.contains(card)) return;
        var rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var x = ((ev.clientX - rect.left) / rect.width) * 100;
        var y = ((ev.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
        var rx = ((y - 50) / 50) * maxTilt;
        var ry = ((50 - x) / 50) * maxTilt;
        if (rx > maxTilt) rx = maxTilt;
        if (rx < -maxTilt) rx = -maxTilt;
        if (ry > maxTilt) ry = maxTilt;
        if (ry < -maxTilt) ry = -maxTilt;
        card.style.setProperty('--tilt-x', rx + 'deg');
        card.style.setProperty('--tilt-y', ry + 'deg');
      },
      { passive: true }
    );
    board.addEventListener(
      'pointerleave',
      function () {
        var cards = board.querySelectorAll('.quest-card');
        for (var ci = 0; ci < cards.length; ci++) {
          cards[ci].style.removeProperty('--tilt-x');
          cards[ci].style.removeProperty('--tilt-y');
        }
      },
      { passive: true }
    );
  }

  /** 任務地圖：引導式導覽（僅 .workflow-quest-section）。 */
  function initWorkflowQuestOnboarding(root) {
    root = root || document;
    var section = root.querySelector('.workflow-quest-section');
    if (!section || section.getAttribute('data-onboarding-ready') === '1') return;
    var board = section.querySelector('#welcomeContentFeatures') || section.querySelector('.workflow-quest-board');
    if (!board) return;
    var cards = board.querySelectorAll('.quest-card');
    if (!cards.length) return;
    section.setAttribute('data-onboarding-ready', '1');

    var cardsArr = Array.prototype.slice.call(cards);
    var countEl = section.querySelector('[data-quest-step-count]');
    var titleEl = section.querySelector('[data-quest-current-title]');
    var detailEl = section.querySelector('[data-quest-detail]');
    var progressI = section.querySelector('[data-quest-progress]');
    var playBtn = section.querySelector('[data-quest-play]');
    var nextBtn = section.querySelector('[data-quest-next]');

    var active = 0;
    var timer = null;
    var completed = {};

    var INS_KEYS = [
      'lp_wf_ob_1',
      'lp_wf_ob_2',
      'lp_wf_ob_3',
      'lp_wf_ob_4',
      'lp_wf_ob_5',
      'lp_wf_ob_6',
    ];
    var TITLE_KEYS = [
      'lp_wf_on_title_1',
      'lp_wf_on_title_2',
      'lp_wf_on_title_3',
      'lp_wf_on_title_4',
      'lp_wf_on_title_5',
      'lp_wf_on_title_6',
    ];

    function ensureCardShell_(card, idx) {
      if (!card.querySelector('.quest-card__sweep')) {
        var sw = document.createElement('span');
        sw.className = 'quest-card__sweep';
        sw.setAttribute('aria-hidden', 'true');
        card.insertBefore(sw, card.firstChild);
      }
      if (!card.querySelector('.quest-card__check')) {
        var chk = document.createElement('span');
        chk.className = 'quest-card__check';
        chk.setAttribute('aria-hidden', 'true');
        chk.textContent = '\u2713';
        card.appendChild(chk);
      }
      if (!card.querySelector('.quest-card__instruction')) {
        var ins = document.createElement('div');
        ins.className = 'quest-card__instruction';
        ins.setAttribute('data-i18n', INS_KEYS[idx] || INS_KEYS[0]);
        ins.textContent = getWelcomeT(INS_KEYS[idx] || INS_KEYS[0]);
        var meta = card.querySelector('.quest-card__meta');
        if (meta) {
          card.insertBefore(ins, meta);
        } else {
          card.appendChild(ins);
        }
      }
      if (!card.querySelector('.quest-card__live')) {
        var lv = document.createElement('span');
        lv.className = 'quest-card__live';
        lv.setAttribute('data-i18n', 'lp_wf_live');
        lv.setAttribute('hidden', 'hidden');
        lv.textContent = getWelcomeT('lp_wf_live');
        var top = card.querySelector('.quest-card__top');
        if (top && top.nextSibling) {
          card.insertBefore(lv, top.nextSibling);
        } else {
          card.insertBefore(lv, card.firstChild);
        }
      }
      var st = card.querySelector('.quest-card__status');
      if (st && !st.getAttribute('data-default-status')) {
        st.setAttribute('data-default-status', String(st.textContent || '').trim());
      }
    }

    for (var prep = 0; prep < cardsArr.length; prep++) {
      ensureCardShell_(cardsArr[prep], prep);
    }

    function syncBarCopy_() {
      var ik = INS_KEYS[active] || INS_KEYS[0];
      var tk = TITLE_KEYS[active] || TITLE_KEYS[0];
      var fmt = getWelcomeT('lp_wf_step_fmt') || 'Step {0} / {1}';
      if (countEl) {
        countEl.textContent = fmt.replace('{0}', String(active + 1)).replace('{1}', String(cardsArr.length));
      }
      if (titleEl) {
        titleEl.textContent = getWelcomeT(tk) || '';
      }
      if (detailEl) {
        detailEl.setAttribute('data-i18n', ik);
        detailEl.textContent = getWelcomeT(ik) || '';
      }
      if (progressI) {
        var pct = ((active + 1) / cardsArr.length) * 100;
        progressI.style.setProperty('--value', pct + '%');
      }
    }

    function setActive(index) {
      active = index;
      if (active < 0) active = 0;
      if (active >= cardsArr.length) active = cardsArr.length - 1;

      for (var i = 0; i < cardsArr.length; i++) {
        var card = cardsArr[i];
        var isAct = i === active;
        var isDone = !!completed[i];
        var isNext = i === active + 1 && !completed[i];

        card.classList.toggle('is-active', isAct);
        card.classList.toggle('is-dimmed', !isAct);
        card.classList.toggle('is-completed', isDone);
        card.classList.toggle('is-next', isNext);
        card.classList.remove('quest-card--active');

        var live = card.querySelector('.quest-card__live');
        if (live) {
          if (isAct) {
            live.removeAttribute('hidden');
          } else {
            live.setAttribute('hidden', 'hidden');
          }
        }

        var stEl = card.querySelector('.quest-card__status');
        if (stEl) {
          var def = stEl.getAttribute('data-default-status') || '';
          var statusKey = stEl.getAttribute('data-i18n-status');
          if (statusKey && !isDone && !isNext && !isAct) {
            def = getWelcomeT(statusKey) || def;
          }
          if (isDone && !isAct) {
            stEl.textContent = getWelcomeT('lp_wf_st_completed') || (isWelcomeJa() ? '完了' : isWelcomeZh() ? '已完成' : isWelcomeDe() ? 'Abgeschlossen' : 'Completed');
          } else if (isNext && !isAct) {
            stEl.textContent = getWelcomeT('lp_wf_st_next') || (isWelcomeJa() ? '次へ' : isWelcomeZh() ? '下一步' : isWelcomeDe() ? 'Weiter' : 'Next');
          } else if (isAct) {
            stEl.textContent = getWelcomeT('lp_wf_st_guide') || '';
          } else {
            stEl.textContent = def;
          }
        }

        var pbar = card.querySelector('.quest-card__progress');
        if (pbar) {
          if (isAct) {
            pbar.style.opacity = '1';
          } else if (isDone) {
            pbar.style.opacity = '0.9';
          } else {
            pbar.style.opacity = '0.55';
          }
        }
      }

      syncBarCopy_();
    }

    function stopTour_() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      section.setAttribute('data-quest-playing', '0');
    }

    function playGuide() {
      stopTour_();
      completed = {};
      if (playBtn) {
        playBtn.textContent = getWelcomeT('lp_wf_play') || playBtn.textContent;
      }
      section.setAttribute('data-quest-playing', '1');
      setActive(0);

      var phase = 0;
      timer = setInterval(function () {
        completed[phase] = true;
        phase += 1;
        if (phase >= cardsArr.length) {
          stopTour_();
          for (var fi = 0; fi < cardsArr.length; fi++) {
            completed[fi] = true;
          }
          setActive(cardsArr.length - 1);
          if (playBtn) {
            playBtn.textContent = getWelcomeT('lp_wf_replay') || playBtn.textContent;
          }
          return;
        }
        setActive(phase);
      }, 2000);
    }

    function advanceManual_() {
      stopTour_();
      if (active < cardsArr.length - 1) {
        completed[active] = true;
        setActive(active + 1);
      } else {
        completed[active] = true;
        for (var ai = 0; ai < cardsArr.length; ai++) {
          completed[ai] = true;
        }
        setActive(cardsArr.length - 1);
        if (playBtn) {
          playBtn.textContent = getWelcomeT('lp_wf_replay') || playBtn.textContent;
        }
      }
    }

    for (var ci = 0; ci < cardsArr.length; ci++) {
      (function (index) {
        cardsArr[index].addEventListener(
          'click',
          function (ev) {
            if (ev.target && ev.target.closest && ev.target.closest('.quest-card__cta')) {
              return;
            }
            ev.preventDefault();
            stopTour_();
            for (var j = 0; j < cardsArr.length; j++) {
              if (j < index) {
                completed[j] = true;
              } else {
                delete completed[j];
              }
            }
            setActive(index);
            if (playBtn) {
              playBtn.textContent = getWelcomeT('lp_wf_play') || playBtn.textContent;
            }
          }
        );
      })(ci);
    }

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        playGuide();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        advanceManual_();
      });
    }

    setActive(0);

    window.__mcQuestRefreshI18n = function () {
      for (var ri = 0; ri < cardsArr.length; ri++) {
        var insEl = cardsArr[ri].querySelector('.quest-card__instruction');
        if (insEl) {
          var ik = INS_KEYS[ri] || INS_KEYS[0];
          insEl.setAttribute('data-i18n', ik);
          insEl.textContent = getWelcomeT(ik) || '';
        }
        var liveEl = cardsArr[ri].querySelector('.quest-card__live');
        if (liveEl) liveEl.textContent = getWelcomeT('lp_wf_live') || '';
        var stEl = cardsArr[ri].querySelector('.quest-card__status');
        if (stEl) {
          var sk = stEl.getAttribute('data-i18n-status');
          if (sk) stEl.setAttribute('data-default-status', getWelcomeT(sk) || stEl.getAttribute('data-default-status') || '');
        }
      }
      if (playBtn && !timer) {
        playBtn.textContent = getWelcomeT('lp_wf_play') || playBtn.textContent;
      }
      if (nextBtn) {
        nextBtn.textContent = getWelcomeT('lp_wf_next') || nextBtn.textContent;
      }
      setActive(active);
    };
  }

  var specimenFunctionState = { key: 'image', setFeature: null };

  /** 三欄一體：左流程、中卡片、右解釋（`.specimen-function-system`）。 */
  function initSpecimenFunctionSystem(root) {
    root = root || document;
    var sys = root.querySelector('.specimen-function-system');
    var lab = root.querySelector('.specimen-card-function-lab');
    if (!sys || sys.getAttribute('data-ready') === '1') return;
    if (!lab) return;
    sys.setAttribute('data-ready', '1');

    var card = sys.querySelector('.specimen-record-card');
    var panel = sys.querySelector('[data-feature-panel]');
    var title = sys.querySelector('[data-feature-title]');
    var assoc = sys.querySelector('[data-feature-association]');
    var desc = sys.querySelector('[data-feature-description]');
    var valueEl = sys.querySelector('[data-feature-value]');
    var points = sys.querySelector('[data-feature-points]');
    if (!panel || !title || !desc || !valueEl || !points) return;

    var fields = sys.querySelectorAll('[data-feature-key]');
    var steps = sys.querySelectorAll('.workflow-nav li[data-workflow-step]');

    function setFeature(key, opt) {
      opt = opt || {};
      key = String(key || '').trim();
      specimenFunctionState.key = key;
      var features = getCardFeatures();
      var data = features[key];
      if (!data) return;

      Array.prototype.forEach.call(fields, function (el) {
        el.classList.toggle('is-feature-active', el.getAttribute('data-feature-key') === key);
      });

      Array.prototype.forEach.call(steps, function (el) {
        var stepKey = (
          el.getAttribute('data-feature-trigger') ||
          el.getAttribute('data-workflow-step') ||
          ''
        ).trim();
        el.classList.toggle('is-workflow-active', stepKey === key || stepKey === data.workflow);
      });

      try {
        lab.setAttribute('data-active-feature', key);
        lab.setAttribute('data-active-workflow', data.workflow);
      } catch (eAttr) {
        void 0;
      }

      title.textContent = data.title;
      if (assoc) {
        if (data.association) {
          assoc.textContent = data.association;
          assoc.removeAttribute('hidden');
        } else {
          assoc.textContent = '';
          assoc.setAttribute('hidden', 'hidden');
        }
      }
      desc.textContent = data.description;
      valueEl.textContent = data.value;
      while (points.firstChild) {
        points.removeChild(points.firstChild);
      }
      for (var pi = 0; pi < data.points.length; pi++) {
        var li = document.createElement('li');
        li.textContent = data.points[pi];
        points.appendChild(li);
      }

      panel.classList.remove('is-updating');
      try {
        void panel.offsetWidth;
      } catch (eOf) {
        void 0;
      }
      panel.classList.add('is-updating');

      if (card && !reduceMotion()) {
        card.classList.remove('is-card-pulsing');
        try {
          void card.offsetWidth;
        } catch (eCard) {
          void 0;
        }
        card.classList.add('is-card-pulsing');
      }

      var activeWf = sys.querySelector('.workflow-nav li.is-workflow-active');
      if (opt.fromUser === true && activeWf && activeWf.scrollIntoView) {
        try {
          activeWf.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
            behavior: shouldFreezeEditorPreview_() ? 'auto' : 'smooth',
          });
        } catch (eScroll) {
          void 0;
        }
      }
    }

    Array.prototype.forEach.call(fields, function (el) {
      el.addEventListener('click', function (event) {
        event.stopPropagation();
        setFeature(el.getAttribute('data-feature-key'), { fromUser: !!(event && event.isTrusted) });
      });
      el.addEventListener('mouseenter', function (event) {
        setFeature(el.getAttribute('data-feature-key'), { fromUser: !!(event && event.isTrusted) });
      });
    });

    Array.prototype.forEach.call(steps, function (el) {
      el.addEventListener('click', function (event) {
        var k = (
          el.getAttribute('data-feature-trigger') ||
          el.getAttribute('data-workflow-step') ||
          ''
        ).trim();
        setFeature(k, { fromUser: !!(event && event.isTrusted) });
      });
      el.addEventListener('mouseenter', function (event) {
        var k = (
          el.getAttribute('data-feature-trigger') ||
          el.getAttribute('data-workflow-step') ||
          ''
        ).trim();
        setFeature(k, { fromUser: !!(event && event.isTrusted) });
      });
    });

    specimenFunctionState.setFeature = setFeature;
    setFeature('image');
  }

  function refreshWelcomeMuseumI18n() {
    if (typeof window.__mcQuestRefreshI18n === 'function') {
      try {
        window.__mcQuestRefreshI18n();
      } catch (eQuest) {
        void 0;
      }
    }
    var statusEl = document.querySelector('.specimen-record-card__status[data-feature-key="review"]');
    if (statusEl) {
      statusEl.textContent =
        mcT('sat_v_unverified') ||
        (isWelcomeZh() ? '待審' : isWelcomeJa() ? '未審査' : isWelcomeDe() ? 'Nicht verifiziert' : 'Unverified');
    }
    var visDd = document.querySelector('.specimen-record-card__meta [data-feature-key="review"] dd');
    if (visDd) {
      visDd.textContent = mcT('lp_card_fn_rarity') || (isWelcomeZh() ? '稀有' : isWelcomeJa() ? '希少' : isWelcomeDe() ? 'Selten' : 'Rare');
    }
    var exportFoot = document.querySelector('.specimen-record-card__export[data-feature-key="export"]');
    if (exportFoot) exportFoot.textContent = mcT('lp_card_fn_export_pending') || exportFoot.textContent;
    var backReview = document.querySelector('.specimen-record-card__back dd[data-i18n="sat_v_unverified"]');
    if (backReview) backReview.textContent = mcT('sat_v_unverified') || backReview.textContent;
    if (typeof specimenFunctionState.setFeature === 'function') {
      specimenFunctionState.setFeature(specimenFunctionState.key || 'image');
    }
    if (window.McWelcomeHeroDemo && typeof window.McWelcomeHeroDemo.refreshI18n === 'function') {
      window.McWelcomeHeroDemo.refreshI18n();
    }
    if (typeof window.mcReloadSpecimenCoverflow === 'function') {
      try {
        window.mcReloadSpecimenCoverflow();
      } catch (eCfReload) {
        void 0;
      }
    }
  }

  window.refreshWelcomeMuseumI18n = refreshWelcomeMuseumI18n;
  window.addEventListener('mc:localechange', refreshWelcomeMuseumI18n);
  window.addEventListener('mc:locale', refreshWelcomeMuseumI18n);

  function heroTipKeyFor(hs) {
    var m = {
      taxon: 'lp_hero3d_tip_taxon',
      origin: 'lp_hero3d_tip_origin',
      image: 'lp_hero3d_tip_image',
      export: 'lp_hero3d_tip_export',
      verify: 'lp_hero3d_tip_verify',
      biodiv: 'lp_hero3d_tip_biodiv',
    };
    return m[hs] || 'lp_hero3d_tip_taxon';
  }

  function getWelcomeT(key) {
    try {
      if (typeof window.MCt === 'function') return String(window.MCt(key) || '');
    } catch (e) {}
    return '';
  }

  function showHeroTooltip(x, y, key) {
    var tip = document.getElementById('mcHeroTooltip');
    if (!tip) return;
    var el = tip.querySelector('[data-hero-tip]');
    if (el) el.textContent = getWelcomeT(key);
    tip.removeAttribute('hidden');
    tip.style.setProperty('left', Math.max(8, x) + 'px');
    tip.style.setProperty('top', Math.max(8, y) + 'px');
    tip.classList.add('is-on');
  }

  function hideHeroTooltip() {
    var tip = document.getElementById('mcHeroTooltip');
    if (!tip) return;
    tip.setAttribute('hidden', 'hidden');
    tip.classList.remove('is-on');
  }

  function setHeroMode(mode) {
    var wrap = document.getElementById('lpCinematicHero');
    var root = document.getElementById('mcHero3d');
    if (wrap) wrap.setAttribute('data-hero-mode', mode);
    if (root) root.setAttribute('data-hero-mode', mode);
    document.querySelectorAll('.lp-hero__uspchip').forEach(function (b) {
      var is = b.getAttribute('data-hero-mode') === mode;
      b.classList.toggle('is-active', is);
      b.setAttribute('aria-checked', is ? 'true' : 'false');
    });
    document.querySelectorAll('.lp-hero__modeDek').forEach(function (p) {
      var m = p.getAttribute('data-hero-mcopy');
      if (m === mode) p.removeAttribute('hidden');
      else p.setAttribute('hidden', 'hidden');
    });
    try {
      var bar = document.getElementById('mcHeroSpecimenProgressBar');
      if (bar) {
        var v = mode === 'hobby' ? '64%' : mode === 'bio' ? '78%' : '86%';
        bar.style.setProperty('--value', v);
      }
    } catch (eBar) {
      void 0;
    }
  }

  function initHeroUspChips() {
    var group = document.getElementById('lpHeroUspChips');
    if (!group) return;
    group.addEventListener('click', function (e) {
      var b = e.target && e.target.closest && e.target.closest('.lp-hero__uspchip');
      if (!b) return;
      var mode = b.getAttribute('data-hero-mode') || 'pro';
      setHeroMode(mode);
    });
  }

  function initHeroBackTabs() {
    /* SAT card back is a single scrollable sheet (no tab UI). */
  }

  function initHeroHotspots() {
    var root = document.getElementById('mcHero3d');
    if (!root) return;
    var hs = root.querySelectorAll('[data-hero-hs]');
    if (!hs.length) return;
    hs.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var k = b.getAttribute('data-hero-hs') || 'taxon';
        var r = b.getBoundingClientRect();
        showHeroTooltip(r.left + r.width / 2, r.bottom + 8, heroTipKeyFor(k));
        var tab = { taxon: 'meta', origin: 'prov', export: 'export', image: 'meta', verify: 'meta', biodiv: 'bio' }[k] || 'meta';
        var p = root.querySelector('[data-hero-bpanel="' + tab + '"]');
        if (p) {
          p.classList.add('mcp-hero-back-flash');
          window.setTimeout(function () {
            p.classList.remove('mcp-hero-back-flash');
          }, 700);
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('#mcHeroTooltip, [data-hero-hs]')) return;
      hideHeroTooltip();
    });
  }

  function initHeroMaturity() {
    var block = document.getElementById('mcHeroMaturity');
    if (!block) return;
    try {
      if (window.getComputedStyle(block).display === 'none') return;
    } catch (eDisp) {
      void 0;
    }
    var list = document.getElementById('mcHeroMaturityList');
    if (!list) return;
    var steps = list.querySelectorAll('[data-hero-mstep]');
    if (!steps.length) return;
    if (reduceMotion() || !('IntersectionObserver' in window)) {
      steps.forEach(function (s) { s.classList.add('is-lit'); });
      return;
    }
    var io = new IntersectionObserver(
      function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting) return;
          var n = 0;
          var tick = function () {
            if (n >= steps.length) return;
            /** @type {Element} */ (steps[n]).classList.add('is-lit');
            n += 1;
            window.setTimeout(tick, 160);
          };
          tick();
          io.unobserve(block);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(block);
  }

  /* —— Hero: 3D 傾斜改純 CSS（#mcHero3d:hover .mc-hero3d__scene），只保留 flip / 熱點邏輯 —— */
  function initHero3d() {
    var root = document.getElementById('mcHero3d');
    if (!root) return;
    if (reduceMotion()) {
      root.classList.add('mc-hero3d--reduce');
    }
    try {
      var persp = root.querySelector('.mc-hero3d__persp');
      if (persp) {
        ['--rx', '--ry', '--ty', '--sc'].forEach(function (k) {
          try {
            persp.style.removeProperty(k);
          } catch (e) {}
        });
        try {
          persp.style.removeProperty('transform');
        } catch (e) {}
      }
    } catch (e) {}
    try {
      root.classList.remove('mc-hero3d--interacting', 'mc-hero3d--tilt-active');
    } catch (e) {}
    /* Flip + tilt: unified `initSpecimenRecordCards` on `.specimen-record-card[data-interactive-card]`. */
    initHeroUspChips();
    initHeroBackTabs();
    initHeroHotspots();
    initHeroMaturity();
    /* 與 #lpCinematicHero / chips 的 data-hero-mode 同步，避免首屏 FOUT 疊多組文案或卡片欄位 */
    try {
      var w = document.getElementById('lpCinematicHero');
      setHeroMode((w && w.getAttribute('data-hero-mode')) || 'pro');
    } catch (e) {}
    /* 舊：pack-intro 曾讓整張卡 opacity:0；現由 CSS 顯性設為可見、不做無限 float 變形 */
  }

  /* —— 3D deck: re-center a featured card, prev/next, drag, keyboard —— */
  function initPassportDeck() {
    var row = document.getElementById('lpFt3Track');
    if (!row) return;
    var cwrap = row.parentElement;
    if (cwrap) cwrap.classList.add('mc-deck3d');
    var sec = document.getElementById('lp-fragment-theater');
    if (sec) sec.classList.add('has-deck3d');
    var cards = row.querySelectorAll('.lp-ft3-card');
    if (cards.length < 2) return;
    var idx = 1;
    var startX = 0;
    var dragging = false;
    var prevB = document.getElementById('mcDeckPrev');
    var nextB = document.getElementById('mcDeckNext');
    var drawB = document.getElementById('mcDeckDraw');
    var idxLine = document.getElementById('lpFt3Idx');

    function applyClasses() {
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.remove('lp-ft3-card--center', 'is-mc3-near', 'is-mc3-dim');
        if (i === idx) {
          cards[i].classList.add('lp-ft3-card--center');
        } else {
          cards[i].classList.add('is-mc3-dim');
        }
        if (Math.abs(i - idx) === 1) cards[i].classList.add('is-mc3-near');
      }
      if (idx === 0) {
        if (prevB) prevB.disabled = true;
        if (nextB) nextB.disabled = false;
      } else if (idx === cards.length - 1) {
        if (prevB) prevB.disabled = false;
        if (nextB) nextB.disabled = true;
      } else {
        if (prevB) prevB.disabled = false;
        if (nextB) nextB.disabled = false;
      }
      if (idxLine) {
        var a = idx + 1;
        var b = cards.length;
        var z1 = a < 10 ? '0' + a : String(a);
        var z2 = b < 10 ? '0' + b : String(b);
        idxLine.textContent = z1 + ' / ' + z2;
      }
    }

    function go(delta, wrap) {
      var n = idx + delta;
      if (wrap) {
        if (n < 0) n = cards.length - 1;
        if (n >= cards.length) n = 0;
      } else {
        if (n < 0 || n >= cards.length) return;
      }
      idx = n;
      applyClasses();
    }

    applyClasses();

    if (prevB) prevB.addEventListener('click', function () { go(-1, false); });
    if (nextB) nextB.addEventListener('click', function () { go(1, false); });
    if (drawB) {
      drawB.addEventListener('click', function () {
        go(1, true);
        try {
          row.classList.add('mc-deck3d--draw-pulse');
          window.setTimeout(function () {
            row.classList.remove('mc-deck3d--draw-pulse');
          }, 520);
        } catch (e) {}
      });
    }

    row.addEventListener('pointerdown', function (e) {
      if (e.target && /** @type {Element} */ (e.target).closest('button, a, input, textarea, select, [data-lp-frag]')) {
        return;
      }
      dragging = true;
      startX = e.clientX;
    });
    window.addEventListener('pointerup', function () { dragging = false; });
    row.addEventListener(
      'pointermove',
      function (e) {
        if (!dragging) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 56) {
          if (dx < 0) go(1, false);
          else go(-1, false);
          startX = e.clientX;
          dragging = false;
        }
      },
      { passive: true }
    );
    if (row.tabIndex < 0) row.tabIndex = 0;
    row.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1, false);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1, false);
      }
    });
  }

  /* —— Fragment chips → field highlight on passport center card —— */
  function initFragmentHighlights() {
    var frags = document.querySelectorAll('#lp-fragment-theater [data-lp-frag]');
    if (!frags.length) return;
    function clearHl() {
      frags.forEach(function (b) { b.classList.remove('is-mc3-fragOn'); });
      document.querySelectorAll('.lp-ft3-f.mcp-hl').forEach(function (el) { el.classList.remove('mcp-hl'); });
    }
    frags.forEach(function (btn) {
      var k = /** @type {string} */ (btn.getAttribute('data-lp-frag') || '');
      btn.addEventListener('click', function () {
        var active = !btn.classList.contains('is-mc3-fragOn');
        clearHl();
        if (active) {
          btn.classList.add('is-mc3-fragOn');
          if (k) {
            var el =
              document.querySelector('.lp-ft3-card--center .lp-ft3-f--' + k) ||
              document.querySelector('.lp-ft3-f--' + k);
            if (el) el.classList.add('mcp-hl');
          }
        }
        var mapPin = document.querySelector('.lp-origin-panel__mapPin');
        if (mapPin) {
          mapPin.classList.toggle('is-pulse', k === 'geo' && active);
        }
      });
    });
  }

  /* —— #lp-usp: scroll spy for sticky —— */
  function initJourneyUsp() {
    var usp = document.getElementById('lp-usp');
    if (!usp || !('IntersectionObserver' in window)) return;
    usp.classList.add('mc3-usp--scroll');
    var acc = usp.querySelectorAll('[data-lp-acc]');
    if (!acc.length) return;
    var io = new IntersectionObserver(
      function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.setAttribute('data-mc3-inview', '1');
        });
      },
      { rootMargin: '-20% 0px -20% 0px', threshold: 0.15 }
    );
    acc.forEach(function (a) { io.observe(a); });
  }

  /* —— Workflow: step activation on scroll, token, click to expand —— */
  function initWorkflowPipe() {
    var sec = document.getElementById('welcomeWorkflowSection');
    if (!sec) return;
    var list = sec.querySelector('.mc-wf-timeline');
    if (!list) return;
    var steps = list.querySelectorAll('.mc-wf-step');
    if (!steps.length) return;
    var token = document.querySelector('.mc-wf-pipe__token');
    for (var i = 0; i < steps.length; i++) {
      (function (s) {
        s.addEventListener('click', function () {
          for (var j = 0; j < steps.length; j++) {
            steps[j].classList.remove('mc-wf--open', 'mc-wf--active');
          }
          s.classList.add('mc-wf--open', 'mc-wf--active');
        });
      })(/** @type {Element} */ (steps[i]));
    }
    if (reduceMotion() || !('IntersectionObserver' in window)) {
      for (var n = 0; n < steps.length; n++) {
        /** @type {Element} */ (steps[n]).classList.add('mc-wf--active');
      }
      return;
    }
    if (token) {
      token.style.left = 'calc(3% - 5px)';
    }
    /** @type {Element} */ (steps[0]).classList.add('mc-wf--active');
    var last = 0;
    var io = new IntersectionObserver(
      function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting) return;
          for (var i = 0; i < steps.length; i++) {
            if (steps[i] === en.target) {
              for (var j = 0; j < steps.length; j++) {
                steps[j].classList.remove('mc-wf--active');
              }
              en.target.classList.add('mc-wf--active');
              if (token) {
                last = i;
                var frac = steps.length > 1 ? i / (steps.length - 1) : 0;
                token.style.left = 'calc(3% + 94% * ' + frac + ' - 5px)';
              }
            }
          }
        });
      },
      { root: null, rootMargin: '0% 0px -40% 0px', threshold: 0.15 }
    );
    for (var a = 0; a < steps.length; a++) {
      io.observe(/** @type {Element} */ (steps[a]));
    }
  }

  function initFcardReveal() {
    /* Placeholder: reveal layer content comes from .mc-fcard__reveal in HTML */
  }

  function isLandingMode() {
    try {
      return !document.documentElement.classList.contains('mc-entered');
    } catch (eLm) {
      return true;
    }
  }

  function isBackendMode() {
    try {
      return document.documentElement.classList.contains('mc-entered');
    } catch (eBm) {
      return false;
    }
  }

  /** Unified tilt + click flip for all `.specimen-record-card[data-interactive-card]`. Coverflow: tilt only. */
  function initSpecimenRecordCards(root) {
    root = root || document;
    var cards = root.querySelectorAll ? root.querySelectorAll('.specimen-record-card[data-interactive-card]') : [];
    var idx;
    for (idx = 0; idx < cards.length; idx++) {
      (function (card) {
        if (!card || card.getAttribute('data-specimen-card-ready') === '1') return;
        card.setAttribute('data-specimen-card-ready', '1');
        var noFlip = !!(card.closest && card.closest('[data-coverflow-no-flip="true"]'));
        var raf = 0;
        var maxTilt = 14;
        try {
          var parsed = parseFloat(String(card.getAttribute('data-sat-tilt-max') || ''), 10);
          if (parsed === parsed && parsed > 0 && parsed <= 16) maxTilt = parsed;
        } catch (eMx) {
          void 0;
        }
        if (!reduceMotion()) {
          card.addEventListener(
            'pointermove',
            function (ev) {
              if (!ev.isPrimary) return;
              if (raf) cancelAnimationFrame(raf);
              raf = requestAnimationFrame(function () {
                var rect = card.getBoundingClientRect();
                if (rect.width < 1 || rect.height < 1) return;
                var x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                var y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
                var rx = Math.max(-14, Math.min(14, (0.5 - y) * maxTilt * 2));
                var ry = Math.max(-14, Math.min(14, (x - 0.5) * maxTilt * 2));
                card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
                card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
                card.style.setProperty('--mx', (x * 100).toFixed(1));
                card.style.setProperty('--my', (y * 100).toFixed(1));
                card.style.setProperty('--card-glow-x', (x * 100).toFixed(1));
                card.style.setProperty('--card-glow-y', (y * 100).toFixed(1));
              });
            },
            { passive: true }
          );
        }
        function resetTilt() {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
          card.style.setProperty('--mx', '50');
          card.style.setProperty('--my', '50');
          card.style.setProperty('--card-glow-x', '50');
          card.style.setProperty('--card-glow-y', '50');
        }
        card.addEventListener('pointerleave', resetTilt, { passive: true });
        card.addEventListener('pointercancel', resetTilt, { passive: true });
        card.addEventListener('click', function (event) {
          if (noFlip) return;
          if (card.getAttribute('data-mc-hero-suppress-flip') === '1') return;
          if (event.target && event.target.closest && event.target.closest('[data-feature-key]')) return;
          if (event.target && event.target.closest && event.target.closest('a, button, input, textarea, select, label, [data-hero-hs]'))
            return;
          if (reduceMotion()) {
            card.classList.toggle('is-flipped');
            return;
          }
          var host = card.closest('.hero-card-wrap.hero-card-area');
          if (host) host.classList.add('is-flip-anim');
          card.classList.add('is-flip-anim');
          window.setTimeout(function () {
            if (host) host.classList.remove('is-flip-anim');
            card.classList.remove('is-flip-anim');
          }, 900);
          card.classList.toggle('is-flipped');
          try {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
          } catch (eT) {
            void 0;
          }
        });
        card.addEventListener('keydown', function (e) {
          if (noFlip) return;
          if (e.key !== ' ' && e.key !== 'Enter') return;
          if (!card.contains(e.target)) return;
          if (e.target && e.target.closest && e.target.closest('[data-feature-key]')) return;
          if (e.target && e.target.closest && e.target.closest('button, a, input, textarea, select')) return;
          e.preventDefault();
          card.click();
        });
      })(/** @type {HTMLElement} */ (cards[idx]));
    }
  }

  /** Collection wall — grid-only; delegated to mc-collection-wall.js */
  function initMcSpecimenCoverflow() {
    if (!isLandingMode()) return;
    try {
      if (typeof window !== 'undefined' && window.MCCollectionWall && typeof window.MCCollectionWall.initSpecimenCoverflow === 'function') {
        window.MCCollectionWall.initSpecimenCoverflow();
      }
    } catch (eCw) {
      void 0;
    }
  }

  function initDevLanding() {
    try {
      if (/[?&]dev=1(?!\d)/.test(String(location && location.search))) {
        document.documentElement.classList.add('mc-landing-dev');
        var p = document.getElementById('developerOnlyPanel');
        if (p) p.classList.add('mc-landing-dev-only');
        return;
      }
    } catch (e) {}
    var p = document.getElementById('developerOnlyPanel');
    if (p) p.classList.add('mc-landing-dev-only');
  }

  function initHeroTrioCards() {
    var root = document.getElementById('lpHeroUspTrio');
    if (!root) return;
    var reduced = false;
    try {
      reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (eR) {
      void 0;
    }
    root.querySelectorAll('.lp-hero-tcard').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (
          e.target &&
          e.target.closest &&
          (e.target.closest('a, [data-lp-scroll], [data-route]') || e.target.closest('button, table, input, textarea, select'))
        ) {
          return;
        }
        e.preventDefault();
        card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', card.classList.contains('is-flipped') ? 'true' : 'false');
      });
      if (card.tabIndex < 0) card.tabIndex = 0;
      card.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target && e.target.closest && e.target.closest('button, a')) return;
        if (e.key === ' ') e.preventDefault();
        card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', card.classList.contains('is-flipped') ? 'true' : 'false');
      });
      var backBtn = card.querySelector('[data-usecase-flip-back]');
      if (backBtn) {
        backBtn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          card.classList.remove('is-flipped');
          card.setAttribute('aria-pressed', 'false');
        });
      }
    });
    var trioRoot = document.getElementById('lpHeroUspTrio');
    if (trioRoot && trioRoot.getAttribute('data-mc-trio-scroll-guard') !== '1') {
      trioRoot.setAttribute('data-mc-trio-scroll-guard', '1');
      trioRoot.addEventListener(
        'click',
        function (ev) {
          var btn = ev.target && ev.target.closest ? ev.target.closest('[data-lp-scroll]') : null;
          if (!btn || !trioRoot.contains(btn)) return;
          var sel = btn.getAttribute('data-lp-scroll');
          if (!sel) return;
          if (document.querySelector(sel)) return;
          ev.preventDefault();
          ev.stopImmediatePropagation();
          try {
            console.warn('[MC LP Hero Trio] Scroll anchor missing:', sel);
          } catch (eMiss) {}
          var fb = document.querySelector('#lp-fragment-theater') || trioRoot;
          try {
            fb.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (eScroll) {}
        },
        true
      );
    }
    /* 不加上 lp-land-fan：其 entering 動畫會讓三張卡「閃一下／像重畫」 */
  }

  function initLandingTrioIntro_() {
    /* Optional: ?triointro=1 才自動翻面示範，避免首屏卡片「跳一下／消失感」 */
    if (!/triointro=1/.test(String((typeof location !== 'undefined' && location.search) || ''))) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    var c1;
    window.setTimeout(function () {
      c1 = document.querySelector('.usecase-card--1');
      if (c1) c1.classList.add('is-flipped');
    }, 2000);
    window.setTimeout(function () {
      c1 = document.querySelector('.usecase-card--1');
      if (c1) c1.classList.remove('is-flipped');
    }, 3300);
  }

  var MC_EDITOR_STORAGE_KEY = 'mcurator.visualEditor.config';
  var editorPersistTimer_ = null;

  function downloadEditorConfigJson_(config) {
    var blob = new Blob([JSON.stringify(normalizeEditorConfig_(config), null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mcurator-visual-editor-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 500);
  }

  function updateEditorSaveStatusUi_(text, kind) {
    var nodes = document.querySelectorAll('[data-editor-save-status]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.textContent = text || '';
      el.setAttribute('data-status', kind || 'idle');
    }
  }

  function showEditorSaveToast_(text, kind) {
    var id = 'mcEditorSaveToast';
    var old = document.getElementById(id);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var el = document.createElement('div');
    el.id = id;
    el.setAttribute('role', 'status');
    el.style.cssText =
      'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:100001;padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.45);max-width:min(92vw,560px);text-align:center;line-height:1.45;';
    if (kind === 'ok') {
      el.style.background = '#238636';
      el.style.color = '#fff';
    } else if (kind === 'warn') {
      el.style.background = '#9e6a03';
      el.style.color = '#fff';
    } else {
      el.style.background = '#da3633';
      el.style.color = '#fff';
    }
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, kind === 'ok' ? 2400 : 5200);
  }

  function schedulePersistEditorConfig_(config) {
    if (editorPersistTimer_) clearTimeout(editorPersistTimer_);
    updateEditorSaveStatusUi_('變更待儲存…', 'pending');
    editorPersistTimer_ = setTimeout(function () {
      editorPersistTimer_ = null;
      var result = saveEditorConfig(syncEditorStructuredFieldsToOverrides_(config));
      updateEditorSaveStatusUi_(
        result && result.ok ? '已自動儲存' : '自動儲存失敗',
        result && result.ok ? 'ok' : 'err'
      );
    }, 450);
  }

  function commitEditorSave_(config, opts) {
    opts = opts || {};
    if (editorPersistTimer_) {
      clearTimeout(editorPersistTimer_);
      editorPersistTimer_ = null;
    }
    var normalized = syncEditorStructuredFieldsToOverrides_(ensureEditorCoverflowItems_(normalizeEditorConfig_(config)));
    var payload = '';
    try {
      payload = JSON.stringify(normalized);
    } catch (eStringify) {
      var bad = { ok: false, error: 'stringify_failed', message: '設定無法序列化，請檢查是否有異常資料。' };
      if (opts.notify !== false) showEditorSaveToast_(bad.message, 'err');
      return bad;
    }
    var bytes = payload.length;
    try {
      localStorage.setItem(MC_EDITOR_STORAGE_KEY, payload);
      if (!localStorage.getItem(MC_EDITOR_STORAGE_KEY)) {
        throw new Error('storage_unavailable');
      }
      var ok = { ok: true, bytes: bytes, savedAt: Date.now() };
      if (opts.notify !== false) {
        showEditorSaveToast_('已儲存至 localStorage（約 ' + Math.max(1, Math.round(bytes / 1024)) + ' KB）', 'ok');
      }
      return ok;
    } catch (e) {
      var msg = '儲存失敗';
      if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
        msg = '儲存空間不足（常因上傳大圖／影片）。已改為下載 JSON 備份；請改用圖片 URL 或較小檔案。';
      } else if (String(e && e.message) === 'storage_unavailable') {
        msg = '瀏覽器無法寫入 localStorage（可能被停用、私密模式，或 file:// 限制）。已下載 JSON 備份。';
      } else if (e && e.message) {
        msg = '儲存失敗：' + e.message;
      }
      if (opts.downloadFallback !== false) {
        try {
          downloadEditorConfigJson_(normalized);
        } catch (eDl) {
          void 0;
        }
      }
      var fail = { ok: false, error: (e && e.name) || 'save_failed', bytes: bytes, message: msg };
      if (opts.notify !== false) showEditorSaveToast_(msg, e && e.name === 'QuotaExceededError' ? 'warn' : 'err');
      return fail;
    }
  }
  var VISUAL_EDITOR_BUILD_TAG = 'EDITOR-BOOT-FIX-2026-05-25';
  var DEFAULT_EDITOR_PAGES = [
    { id: 'landing', title: '首頁 Home', path: 'UI.html', icon: '🏠', enabled: true },
    { id: 'workflow', title: '解決方案 Workflow', path: 'UI.html#/section/workflow', icon: '⚙️', enabled: true },
    { id: 'online-exhibition', title: '線上展覽 Online Exhibition', path: 'UI.html#/section/online-exhibition', icon: '🏛️', enabled: true },
    { id: 'about', title: '關於 About', path: 'UI.html#/section/about', icon: 'ℹ️', enabled: true },
    { id: 'start', title: '開始 Get Started', path: 'UI.html#/section/start', icon: '🚀', enabled: true },
    { id: 'marketplace', title: 'SAT 市集 Marketplace', path: 'UI.html#/marketplace', icon: '🛒', enabled: true },
    { id: 'specimen-workflow', title: '標本工作流 Specimen Workflow', path: 'UI.html#/section/specimen-workflow', icon: '🧪', enabled: true },
    { id: 'card-generator', title: '標本卡製作 Card Generator', path: 'UI.html#/section/card-generator', icon: '🃏', enabled: true },
    { id: 'passport-studio', title: 'Passport Studio', path: 'UI.html#/section/passport-studio', icon: '📋', enabled: true },
    { id: 'dashboard', title: '工作區 Dashboard', path: 'UI.html#/section/dashboard', icon: '📊', enabled: true },
    { id: 'paleo-reconstruction', title: '化石復原 Paleo Lab', path: 'UI.html#/section/paleo-reconstruction', icon: '🦴', enabled: true },
    { id: 'photo-restoration-lab', title: 'AI 影像修復 Photo Lab', path: 'UI.html#/section/photo-restoration-lab', icon: '🖼️', enabled: true },
    { id: 'taxonomy-manuscript-studio', title: '分類學論文 Taxonomy Studio', path: 'UI.html#/section/taxonomy-manuscript-studio', icon: '📜', enabled: true },
    { id: 'evolution-tree-lab', title: '演化樹 Evolution Tree', path: 'UI.html#/section/evolution-tree-lab', icon: '🌿', enabled: true },
    { id: 'husbandry-log', title: '飼育紀錄 Husbandry Log', path: 'UI.html#/section/husbandry-log', icon: '🪴', enabled: true },
    { id: 'workspace-tools', title: '工作區工具 Workspace Tools', path: 'UI.html#/section/workspace-tools', icon: '🔧', enabled: true },
    { id: 'welcome-museum', title: 'Welcome Museum (獨立頁)', path: 'welcome-museum.html', icon: '🎨', enabled: true },
  ];
  var DEFAULT_MC_EDITOR_CONFIG = {
    activePageId: 'landing',
    pages: cloneEditorConfig_(DEFAULT_EDITOR_PAGES),
    pageConfigs: {
      landing: {
        textOverrides: [],
        mediaOverrides: [],
        linkOverrides: [],
        styleOverrides: [],
        backgroundOverrides: [],
        htmlOverrides: [],
        hiddenElements: [],
        domPatches: [],
        cssOverride: '',
      },
    },
    hero: {
      eyebrow: '標本護照・館藏管理・生物多樣性紀錄',
      title: '把照片、標籤與產地，整理成可查詢的標本護照。',
      subtitle: 'MCurator 將影像、手寫標籤、學名、採集地、審查紀錄與出處追蹤整合成一筆完整資料。',
      primaryButton: '建立第一筆標本護照',
      secondaryButton: '查看互動示範',
      backgroundVideo: '',
      videoBlur: 8,
      videoBrightness: 0.38,
    },
    entry: {
      cards: [
        {
          title: '方案與導入',
          label: '企業聯絡',
          description: '歡迎機構與團隊洽詢授權、部署與教育／展示合作。',
          button: '寫信聯絡',
        },
        {
          title: '建立與管理標本護照',
          label: '加入會員',
          description: '註冊或登入後可上傳影像、編輯欄位、保存館號與產地，並管理公開與匯出。',
          button: '註冊／登入',
        },
        {
          title: '研究、策展與跨界合作',
          label: '合作聯繫',
          description: '歡迎學會、展覽、媒體與品牌洽談共製內容、資料串接與活動合作。',
          button: '洽談合作',
        },
      ],
    },
    coverflow: {
      title: '瀏覽互動式數位標本卡',
      subtitle: '滑動卡片、點擊檢視影像、館號與 SAT 標本資料。',
      filters: ['all', 'insect', 'plant', 'paleontology', 'dinopedia'],
      items: [],
    },
    specimenCard: {
      style: 'museum-green',
      showProgress: true,
      enableTilt: true,
      enableFlip: true,
    },
    workflow: {
      title: '從標本護照延伸到完整館藏工作流。',
      subtitle: '每張標本卡都能解鎖不同模組：整理、展示、討論、引用與匯出。',
      onboarding: true,
      stepLabels: ['Quest 01', 'Quest 02', 'Quest 03', 'Quest 04', 'Quest 05', 'Final Quest'],
    },
    grading: {
      enabled: true,
      title: '標本評分認證',
      scoreSystem: 'Condition Score',
    },
    project: {
      globalCssOverride: '',
      sharedMediaLibrary: [],
      sharedTemplates: [],
      designTokens: {
        colors: {
          museumDark: '#07100d',
          deepGreen: '#0b251c',
          emerald: '#38d39f',
          gold: '#d6c27a',
          ivory: '#f4f0e6',
          mutedIvory: 'rgba(244,240,230,0.72)',
        },
        radius: {
          small: '8px',
          card: '18px',
          premium: '28px',
          pill: '999px',
        },
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '48px',
          section: '96px',
        },
        shadows: {
          soft: '0 12px 32px rgba(0,0,0,0.22)',
          floating: '0 24px 70px rgba(0,0,0,0.36)',
          museumGlow: '0 0 0 1px rgba(214,194,122,0.18), 0 24px 80px rgba(0,0,0,0.45)',
        },
      },
    },
  };

  function cloneEditorConfig_(v) {
    try {
      return JSON.parse(JSON.stringify(v || {}));
    } catch (e) {
      return {};
    }
  }

  function mergeEditorConfig_(base, over) {
    var out = cloneEditorConfig_(base);
    if (!over || typeof over !== 'object') return out;
    Object.keys(over).forEach(function (k) {
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k])) {
        out[k] = mergeEditorConfig_(out[k] || {}, over[k]);
      } else {
        out[k] = over[k];
      }
    });
    return out;
  }

  function mergeEditorPagesList_(savedPages) {
    var saved = Array.isArray(savedPages) ? savedPages : [];
    var byId = {};
    var out = [];
    for (var si = 0; si < saved.length; si++) {
      var row = saved[si];
      if (!row || !row.id) continue;
      var clone = cloneEditorConfig_(row);
      byId[String(row.id)] = clone;
      out.push(clone);
    }
    for (var di = 0; di < DEFAULT_EDITOR_PAGES.length; di++) {
      var def = DEFAULT_EDITOR_PAGES[di];
      if (!def || !def.id) continue;
      if (!byId[def.id]) {
        out.push(cloneEditorConfig_(def));
        continue;
      }
      if (!String(byId[def.id].path || '').trim() && def.path) {
        byId[def.id].path = def.path;
      }
      if (!String(byId[def.id].title || '').trim() && def.title) {
        byId[def.id].title = def.title;
      }
    }
    return out.length ? out : cloneEditorConfig_(DEFAULT_EDITOR_PAGES);
  }

  function normalizeEditorConfig_(config) {
    var incoming = config && typeof config === 'object' ? config : {};
    var merged = mergeEditorConfig_(DEFAULT_MC_EDITOR_CONFIG, incoming);
    merged.pages = mergeEditorPagesList_(merged.pages);
    for (var pgFix = 0; pgFix < merged.pages.length; pgFix++) {
      var pgRow = merged.pages[pgFix];
      if (!pgRow) continue;
      var pgPath = String(pgRow.path || '');
      if (pgRow.id === 'landing' && (!pgPath || /^editor-preview\.html/i.test(pgPath))) {
        pgRow.path = 'UI.html';
      }
    }
    if (!merged.activePageId || typeof merged.activePageId !== 'string') {
      merged.activePageId = 'landing';
    }
    if (!merged.pageConfigs || typeof merged.pageConfigs !== 'object' || Array.isArray(merged.pageConfigs)) {
      merged.pageConfigs = {};
    }
    if (!merged.pageConfigs.landing || typeof merged.pageConfigs.landing !== 'object') {
      merged.pageConfigs.landing = cloneEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.pageConfigs.landing);
    }
    Object.keys(merged.pageConfigs).forEach(function (pid) {
      var pc = merged.pageConfigs[pid];
      if (!pc || typeof pc !== 'object' || Array.isArray(pc)) {
        merged.pageConfigs[pid] = cloneEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.pageConfigs.landing);
        pc = merged.pageConfigs[pid];
      }
      if (!Array.isArray(pc.textOverrides)) pc.textOverrides = [];
      if (!Array.isArray(pc.mediaOverrides)) pc.mediaOverrides = [];
      if (!Array.isArray(pc.linkOverrides)) pc.linkOverrides = [];
      if (!Array.isArray(pc.styleOverrides)) pc.styleOverrides = [];
      if (!Array.isArray(pc.backgroundOverrides)) pc.backgroundOverrides = [];
      if (!Array.isArray(pc.htmlOverrides)) pc.htmlOverrides = [];
      if (!Array.isArray(pc.hiddenElements)) pc.hiddenElements = [];
      if (!Array.isArray(pc.domPatches)) pc.domPatches = [];
      pc.cssOverride = pc.cssOverride == null ? '' : String(pc.cssOverride);
    });
    if (!merged.project || typeof merged.project !== 'object' || Array.isArray(merged.project)) {
      merged.project = cloneEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.project);
    }
    if (!Array.isArray(merged.project.sharedMediaLibrary)) merged.project.sharedMediaLibrary = [];
    if (!Array.isArray(merged.project.sharedTemplates)) merged.project.sharedTemplates = [];
    merged.project.globalCssOverride = merged.project.globalCssOverride == null ? '' : String(merged.project.globalCssOverride);
    if (!merged.project.designTokens || typeof merged.project.designTokens !== 'object') {
      merged.project.designTokens = cloneEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.project.designTokens);
    } else {
      merged.project.designTokens = mergeEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.project.designTokens, merged.project.designTokens);
    }
    var legacyKeys = ['textOverrides', 'mediaOverrides', 'linkOverrides', 'styleOverrides', 'backgroundOverrides', 'htmlOverrides', 'hiddenElements', 'domPatches', 'cssOverride'];
    var legacyDetected = false;
    for (var lk = 0; lk < legacyKeys.length; lk++) {
      if (Object.prototype.hasOwnProperty.call(merged.project, legacyKeys[lk])) {
        legacyDetected = true;
        break;
      }
    }
    if (legacyDetected) {
      var landingCfg = merged.pageConfigs.landing;
      if (Array.isArray(merged.project.textOverrides) && !landingCfg.textOverrides.length) landingCfg.textOverrides = merged.project.textOverrides.slice();
      if (Array.isArray(merged.project.mediaOverrides) && !landingCfg.mediaOverrides.length) landingCfg.mediaOverrides = merged.project.mediaOverrides.slice();
      if (Array.isArray(merged.project.linkOverrides) && !landingCfg.linkOverrides.length) landingCfg.linkOverrides = merged.project.linkOverrides.slice();
      if (Array.isArray(merged.project.styleOverrides) && !landingCfg.styleOverrides.length) landingCfg.styleOverrides = merged.project.styleOverrides.slice();
      if (Array.isArray(merged.project.backgroundOverrides) && !landingCfg.backgroundOverrides.length) landingCfg.backgroundOverrides = merged.project.backgroundOverrides.slice();
      if (Array.isArray(merged.project.htmlOverrides) && !landingCfg.htmlOverrides.length) landingCfg.htmlOverrides = merged.project.htmlOverrides.slice();
      if (Array.isArray(merged.project.hiddenElements) && !landingCfg.hiddenElements.length) landingCfg.hiddenElements = merged.project.hiddenElements.slice();
      if (Array.isArray(merged.project.domPatches) && !landingCfg.domPatches.length) landingCfg.domPatches = merged.project.domPatches.slice();
      if (merged.project.cssOverride && !landingCfg.cssOverride) landingCfg.cssOverride = String(merged.project.cssOverride);
    }
    var protectedSatSelectors = {
      '#section-sat': 1,
      '#satPassportRoot': 1,
      '[data-section="sat"]': 1,
      '#sectionSat': 1,
    };
    merged.pageConfigs.landing.hiddenElements = merged.pageConfigs.landing.hiddenElements.filter(function (s) {
      var k = String(s || '').trim();
      if (!k) return false;
      return !protectedSatSelectors[k];
    });
    Object.keys(merged.pageConfigs).forEach(function (pid) {
      sanitizeEditorPageOverrides_(merged.pageConfigs[pid]);
    });
    return merged;
  }

  function getActivePageConfig_(config) {
    config = normalizeEditorConfig_(config);
    var pid = String(config.activePageId || 'landing');
    if (!config.pageConfigs[pid] || typeof config.pageConfigs[pid] !== 'object') {
      config.pageConfigs[pid] = cloneEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.pageConfigs.landing);
    }
    return config.pageConfigs[pid];
  }

  function makeEditorPatchId_() {
    return 'patch_' + Date.now().toString(36) + '_' + Math.floor(Math.random() * 1e6).toString(36);
  }

  function getEditorConfig() {
    try {
      var saved = localStorage.getItem(MC_EDITOR_STORAGE_KEY);
      if (saved) {
        try {
          return ensureEditorCoverflowItems_(normalizeEditorConfig_(JSON.parse(saved)));
        } catch (eParse) {
          void 0;
        }
      }
    } catch (eLs) {
      void 0;
    }
    return ensureEditorCoverflowItems_(normalizeEditorConfig_(DEFAULT_MC_EDITOR_CONFIG));
  }

  function saveEditorConfig(config, opts) {
    return commitEditorSave_(config, mergeEditorConfig_({ notify: false, downloadFallback: false }, opts || {}));
  }

  function hasSavedEditorConfig_() {
    try {
      return !!localStorage.getItem(MC_EDITOR_STORAGE_KEY);
    } catch (e) {
      return false;
    }
  }

  function setHeroText_(node, value) {
    if (!node || value == null) return;
    var next = String(value);
    if (node.innerHTML && /<[^>]+>/.test(next)) node.innerHTML = next;
    else node.textContent = next;
  }

  function isEditorProtectedOverrideSelector_(sel) {
    var s = String(sel || '').trim();
    if (!s) return true;
    if (
      /\.specimen-record-card|#mcSpecimenCoverflow|\.specimen-coverflow|data-interactive-card|\.quest-card|#mcHero3dTumbler|\.specimen-record-card__inner|\.specimen-coverflow-track|\.specimen-coverflow-stage/i.test(
        s
      )
    ) {
      return true;
    }
    try {
      if (/^(section|main|article|div)(\.|\[|$)/i.test(s) && document.querySelectorAll(s).length > 1) return true;
    } catch (eProt) {
      void 0;
    }
    return false;
  }

  function isEditorTextSafeTarget_(node) {
    if (!node || node.nodeType !== 1) return false;
    var tag = (node.tagName || '').toLowerCase();
    if (/^(script|style|svg|path|img|video|source|canvas|iframe|ul|ol|form)$/.test(tag)) return false;
    var nid = node.id || '';
    if (nid === 'welcomeContentTitle' || nid === 'welcomeContentLead' || nid === 'welcomeHeroBadge') return true;
    if (node.getAttribute && node.getAttribute('data-mc-cf-field')) return true;
    if (
      node.closest &&
      node.closest('.specimen-record-card,[data-interactive-card],#mcSpecimenCoverflow,.specimen-coverflow-track,.quest-card')
    ) {
      if (node.getAttribute && node.getAttribute('data-mc-cf-field')) return true;
      if (!/^(h1|h2|h3|h4|h5|h6|p|span|label|strong|em|small|button|dd)$/.test(tag)) return false;
    }
    var kids = node.children;
    if (!kids || !kids.length) return true;
    if (/^h[1-6]$/.test(tag) || tag === 'p' || tag === 'button' || tag === 'label') {
      for (var j = 0; j < kids.length; j++) {
        var kt2 = (kids[j].tagName || '').toLowerCase();
        if (/^(div|section|article|main|header|footer|nav|ul|ol|li|figure|form|table|tbody|tr|td|button|a|img|video|canvas|svg)$/.test(kt2)) {
          return false;
        }
      }
      return true;
    }
    for (var i = 0; i < kids.length; i++) {
      var kt = (kids[i].tagName || '').toLowerCase();
      if (/^(div|section|article|main|header|footer|nav|ul|ol|li|figure|img|video|canvas|svg|form|table|tbody|tr|td|button|a)$/.test(kt)) {
        return false;
      }
    }
    return true;
  }

  function applyEditorTextOverride_(node, text) {
    if (!node || text == null) return false;
    if (!isEditorTextSafeTarget_(node)) {
      console.warn('[VisualEditor] blocked text override on container', node);
      return false;
    }
    var next = String(text);
    if (node.innerHTML && /<[^>]+>/.test(next)) node.innerHTML = next;
    else node.textContent = next;
    return true;
  }

  function sanitizeEditorPageOverrides_(pageCfg) {
    if (!pageCfg || typeof pageCfg !== 'object') return;
    if (Array.isArray(pageCfg.textOverrides)) {
      pageCfg.textOverrides = pageCfg.textOverrides.filter(function (row) {
        var sel = String((row && row.selector) || '').trim();
        if (!sel || isEditorProtectedOverrideSelector_(sel)) return false;
        try {
          var nodes = document.querySelectorAll(sel);
          if (!nodes.length) return true;
          for (var ni = 0; ni < nodes.length; ni++) {
            if (!isEditorTextSafeTarget_(nodes[ni])) return false;
          }
        } catch (eSan) {
          return false;
        }
        return true;
      });
    }
    if (Array.isArray(pageCfg.styleOverrides)) {
      pageCfg.styleOverrides = pageCfg.styleOverrides.filter(function (row) {
        var sel = String((row && row.selector) || '').trim();
        if (!sel || isEditorProtectedOverrideSelector_(sel)) return false;
        var styles = row.styles || {};
        if (/specimen-record-card|specimen-coverflow|data-interactive-card/i.test(sel)) {
          if (styles.width || styles.height || styles.minWidth || styles.minHeight || styles.maxWidth || styles.maxHeight) {
            return false;
          }
        }
        return true;
      });
    }
    if (Array.isArray(pageCfg.htmlOverrides)) {
      pageCfg.htmlOverrides = pageCfg.htmlOverrides.filter(function (row) {
        return !isEditorProtectedOverrideSelector_(String((row && row.selector) || '').trim());
      });
    }
  }

  function applyCoverflowFieldUpdate_(config, cfIndex, field, value) {
    config = ensureEditorCoverflowItems_(config || getEditorConfig());
    if (!config.coverflow || typeof config.coverflow !== 'object') {
      config.coverflow = cloneEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.coverflow);
    }
    if (!Array.isArray(config.coverflow.items)) config.coverflow.items = [];
    var idx = Number(cfIndex);
    if (idx !== idx || idx < 0 || idx >= config.coverflow.items.length) return config;
    if (!config.coverflow.items[idx] || typeof config.coverflow.items[idx] !== 'object') {
      config.coverflow.items[idx] = {};
    }
    var it = config.coverflow.items[idx];
    var f = String(field || '');
    if (f === 'locality') it.locality = value;
    else if (f === 'date') it.date = value;
    else if (f === 'collector') it.collector = value;
    else if (f === 'visibility') it.visibility = value;
    else if (f === 'scientificName') it.scientificName = value;
    else if (f === 'common') it.common = value;
    return config;
  }

  function ensureEditorCoverflowItems_(config) {
    config = normalizeEditorConfig_(config || getEditorConfig());
    if (!config.coverflow || typeof config.coverflow !== 'object') {
      config.coverflow = cloneEditorConfig_(DEFAULT_MC_EDITOR_CONFIG.coverflow);
    }
    if (Array.isArray(config.coverflow.items) && config.coverflow.items.length) {
      return config;
    }
    var seed =
      (typeof window !== 'undefined' &&
        window.mcGetDefaultSpecimenCoverflowConfig &&
        window.mcGetDefaultSpecimenCoverflowConfig().items) ||
      DEFAULT_SPECIMEN_COVERFLOW_CONFIG.items;
    if (!Array.isArray(seed) || !seed.length) {
      try {
        if (typeof getSpecimenCoverflowConfig === 'function') {
          var liveCfg = getSpecimenCoverflowConfig();
          if (liveCfg && Array.isArray(liveCfg.items) && liveCfg.items.length) {
            seed = liveCfg.items;
          }
        }
      } catch (eLiveCfg) {
        void 0;
      }
    }
    if (!Array.isArray(seed) || !seed.length) {
      try {
        var wfItems = typeof buildCoverflowItemsFromWorkflow_ === 'function' ? buildCoverflowItemsFromWorkflow_() : [];
        if (Array.isArray(wfItems) && wfItems.length) seed = wfItems;
      } catch (eWfSeed) {
        void 0;
      }
    }
    if (!Array.isArray(seed) || !seed.length) {
      try {
        var edFrame = document.getElementById('mcEditorFrame');
        var edWin = edFrame && edFrame.contentWindow;
        if (edWin && typeof edWin.getSpecimenCoverflowConfig === 'function') {
          var iframeCfg = edWin.getSpecimenCoverflowConfig();
          if (iframeCfg && Array.isArray(iframeCfg.items) && iframeCfg.items.length) {
            seed = iframeCfg.items;
          }
        }
      } catch (eIframeSeed) {
        void 0;
      }
    }
    config.coverflow.items = (seed || []).map(function (x) {
      return normalizeCoverflowItem_(x);
    });
    return config;
  }

  function syncEditorCoverflowSeedFromIframe_(state, frame) {
    if (!state || !frame || !frame.contentWindow) return false;
    state.config = ensureEditorCoverflowItems_(state.config);
    if (state.config.coverflow.items && state.config.coverflow.items.length) return true;
    try {
      var iw = frame.contentWindow;
      if (!iw || typeof iw.getSpecimenCoverflowConfig !== 'function') return false;
      var liveCfg = iw.getSpecimenCoverflowConfig();
      if (!liveCfg || !Array.isArray(liveCfg.items) || !liveCfg.items.length) return false;
      state.config.coverflow.items = liveCfg.items.map(function (x) {
        return normalizeCoverflowItem_(x);
      });
      state.config = syncEditorStructuredFieldsToOverrides_(state.config);
      schedulePersistEditorConfig_(state.config);
      updatePreview(state.config);
      return true;
    } catch (eSyncSeed) {
      return false;
    }
  }

  function coverflowFieldLabel_(field) {
    var map = {
      locality: '產地',
      date: '日期',
      collector: '採集者',
      visibility: '是否公開',
      scientificName: '學名',
      common: '俗名',
    };
    return map[String(field || '')] || String(field || '欄位');
  }

  function applyHeroConfig(cfg) {
    if (!cfg) return;
    var badge =
      document.querySelector('#welcomeHeroBadge .c-hero__badgeTxt') ||
      document.getElementById('welcomeHeroBadge');
    var title = document.getElementById('welcomeContentTitle');
    var sub = document.getElementById('welcomeContentLead');
    var pbtn = document.getElementById('btnWelcomeHeroDemo');
    var sbtn = document.getElementById('btnWelcomeHeroStart');
    var gateVideo = document.querySelector('#welcomeGateSection .hero-bg-video');
    if (shouldApplyCmsTextOverrides_()) {
      if (badge && cfg.eyebrow != null) setHeroText_(badge, cfg.eyebrow);
      if (title && cfg.title != null) setHeroText_(title, cfg.title);
      if (sub && cfg.subtitle != null) setHeroText_(sub, cfg.subtitle);
      if (pbtn && cfg.primaryButton != null) setHeroText_(pbtn, cfg.primaryButton);
      if (cfg.secondaryButton != null) {
        var slab = document.getElementById('btnWelcomeHeroStartLabel');
        if (slab) setHeroText_(slab, cfg.secondaryButton);
        else if (sbtn) setHeroText_(sbtn, cfg.secondaryButton);
      }
    }
    if (gateVideo) {
      if (cfg.backgroundVideo) gateVideo.setAttribute('src', String(cfg.backgroundVideo));
      var blur = cfg.videoBlur != null ? Number(cfg.videoBlur) : 8;
      var br = cfg.videoBrightness != null ? Number(cfg.videoBrightness) : 0.38;
      gateVideo.style.filter = 'blur(' + blur + 'px) brightness(' + br + ') contrast(1.1) saturate(0.7)';
    }
  }

  function ensureEntryCardCount_(cardsWrap, cardsCfg) {
    if (!cardsWrap || !cardsCfg || !cardsCfg.length) return;
    var cards = cardsWrap.querySelectorAll('.entry-mode-card');
    if (!cards.length) return;
    var want = 3;
    while (cardsWrap.querySelectorAll('.entry-mode-card').length > want) {
      cardsWrap.removeChild(cardsWrap.lastElementChild);
    }
    var base = cards[0];
    while (cardsWrap.querySelectorAll('.entry-mode-card').length < want) {
      var clone = base.cloneNode(true);
      clone.className = 'entry-mode-card';
      cardsWrap.appendChild(clone);
    }
  }

  function applyEntryConfig(cfg) {
    if (!cfg || !Array.isArray(cfg.cards)) return;
    if (!shouldApplyCmsTextOverrides_()) return;
    var wrap = document.querySelector('#welcomeGateSection .entry-mode-grid');
    if (!wrap) return;
    ensureEntryCardCount_(wrap, cfg.cards);
    var cards = wrap.querySelectorAll('.entry-mode-card');
    var nApply = Math.min(cards.length, cfg.cards.length, 3);
    for (var i = 0; i < nApply; i++) {
      var cardCfg = cfg.cards[i];
      if (!cardCfg) continue;
      var card = cards[i];
      var label = card.querySelector('.entry-mode-label');
      var h3 = card.querySelector('h3');
      var desc = card.querySelector('.entry-mode-intro');
      var btn = card.querySelector('.entry-mode-action');
      if (label && cardCfg.label != null) label.textContent = cardCfg.label;
      if (h3 && cardCfg.title != null) h3.textContent = cardCfg.title;
      if (desc && cardCfg.description != null) desc.textContent = cardCfg.description;
      if (btn && cardCfg.button != null) btn.textContent = cardCfg.button;
    }
  }

  function applyCoverflowConfig(cfg) {
    if (!cfg) return;
    var root = document.getElementById('mcSpecimenCoverflow');
    if (root && typeof renderCoverflowHeader_ === 'function') {
      renderCoverflowHeader_(root, cfg);
    } else {
      var title = document.getElementById('mcSpecimenCoverflowH');
      if (title) {
        title.textContent = shouldApplyCmsTextOverrides_()
          ? cfg.title || mcT('cw_default_title')
          : mcT('cw_default_title');
      }
    }
    if (Array.isArray(cfg.filters)) {
      if (root && typeof renderCoverflowFilters_ === 'function') {
        renderCoverflowFilters_(root, cfg);
      } else {
        var nav = document.querySelector('.specimen-coverflow-filters');
        if (nav) {
          nav.innerHTML = '';
          for (var i = 0; i < cfg.filters.length; i++) {
            var key = String(cfg.filters[i] || '').trim();
            if (!key) continue;
            var b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('data-filter', key);
            if (i === 0) b.className = 'is-active';
            b.textContent = cfFilterLabel_(key);
            nav.appendChild(b);
          }
        }
      }
    }
    try {
      if (typeof window.mcReloadSpecimenCoverflow === 'function') {
        window.mcReloadSpecimenCoverflow();
      }
    } catch (eCfApply) {
      void 0;
    }
  }

  function formatCoverflowFieldDisplay_(field, value) {
    var f = String(field || '');
    if (f === 'visibility') return cfDisplayVisibility_(value);
    if (f === 'locality') return cfDisplayLocality_(value);
    if (f === 'collector') return cfDisplayCollector_(value);
    if (f === 'common') return cfDisplayCommon_(value);
    return value == null ? '' : String(value);
  }

  function patchEditorTextDom_(selector, value) {
    var sel = String(selector || '').trim();
    if (!sel) return;
    try {
      var nodes = document.querySelectorAll(sel);
      for (var ni = 0; ni < nodes.length; ni++) {
        applyEditorTextOverride_(nodes[ni], value);
      }
    } catch (ePatchText) {
      void 0;
    }
  }

  function patchCoverflowFieldDom_(cfIndex, field, value) {
    var idx = String(cfIndex == null ? '' : cfIndex);
    var f = String(field || '');
    if (!f || idx === '') return;
    var display = formatCoverflowFieldDisplay_(f, value);
    var nodes = document.querySelectorAll('[data-mc-cf-field="' + f + '"][data-mc-cf-index="' + idx + '"]');
    for (var ni = 0; ni < nodes.length; ni++) {
      if (nodes[ni].getAttribute && nodes[ni].getAttribute('contenteditable') === 'true') continue;
      nodes[ni].textContent = display;
    }
    try {
      if (window.MC_EDITOR_CONFIG && window.MC_EDITOR_CONFIG.coverflow && Array.isArray(window.MC_EDITOR_CONFIG.coverflow.items)) {
        var n = Number(idx);
        if (n === n && n >= 0 && n < window.MC_EDITOR_CONFIG.coverflow.items.length) {
          window.MC_EDITOR_CONFIG.coverflow.items[n][f] = value;
        }
      }
    } catch (eSync) {
      void 0;
    }
  }

  function applyWorkflowConfig(cfg) {
    if (!cfg) return;
    var bar = document.querySelector('.workflow-quest-section .quest-onboarding-bar');
    if (shouldApplyCmsTextOverrides_()) {
      var t = document.getElementById('welcomeLpValuesH');
      var s = document.getElementById('welcomeLpValuesDek');
      if (t && cfg.title != null) t.textContent = cfg.title;
      if (s && cfg.subtitle != null) s.textContent = cfg.subtitle;
      if (Array.isArray(cfg.stepLabels)) {
        var labels = document.querySelectorAll('.workflow-quest-section .quest-card__label');
        for (var i = 0; i < labels.length && i < cfg.stepLabels.length; i++) {
          labels[i].textContent = cfg.stepLabels[i];
        }
      }
    }
    if (bar && cfg.onboarding != null) {
      if (cfg.onboarding) bar.removeAttribute('hidden');
      else bar.setAttribute('hidden', 'hidden');
    }
  }

  function applySpecimenCardConfig(cfg) {
    if (!cfg) return;
    var root = document.documentElement;
    root.setAttribute('data-editor-specimen-style', cfg.style || 'museum-green');
    root.setAttribute('data-editor-specimen-tilt', cfg.enableTilt ? '1' : '0');
    root.setAttribute('data-editor-specimen-flip', cfg.enableFlip ? '1' : '0');
    root.setAttribute('data-editor-specimen-progress', cfg.showProgress ? '1' : '0');
  }

  function applyGradingConfig(cfg) {
    if (!cfg) return;
    var root = document.documentElement;
    root.setAttribute('data-editor-grading-enabled', cfg.enabled ? '1' : '0');
    root.setAttribute('data-editor-grading-title', cfg.title || '');
    root.setAttribute('data-editor-grading-system', cfg.scoreSystem || '');
  }

  function clearProjectInjectedPatches_() {
    var injected = document.querySelectorAll('[data-mcurator-patch-injected="1"]');
    for (var i = 0; i < injected.length; i++) {
      var n = injected[i];
      if (n && n.parentNode) n.parentNode.removeChild(n);
    }
    var replaced = document.querySelectorAll('[data-mcurator-patch-replaced="1"]');
    for (var r = 0; r < replaced.length; r++) {
      var t = replaced[r];
      var original = t.getAttribute('data-mcurator-patch-original-html');
      if (original != null) {
        t.innerHTML = original;
      }
      t.removeAttribute('data-mcurator-patch-replaced');
      t.removeAttribute('data-mcurator-patch-original-html');
      t.removeAttribute('data-mcurator-patch-id');
    }
  }

  function applyProjectConfig(cfg) {
    cfg = cfg && typeof cfg === 'object' ? cfg : {};
    var editorStatic = shouldFreezeEditorPreview_();
    function markChildrenAboveBackground_(el) {
      if (!el || !el.children) return;
      for (var ci = 0; ci < el.children.length; ci++) {
        var ch = el.children[ci];
        if (!ch || !ch.getAttribute) continue;
        if (ch.getAttribute('data-mcurator-bg-video') === 'true') continue;
        if (ch.getAttribute('data-mcurator-bg-overlay') === 'true') continue;
        if (!ch.style.position) ch.style.position = 'relative';
        ch.style.zIndex = '2';
      }
    }
    function ensureBackgroundNodes_(el) {
      if (!el) return { video: null, overlay: null };
      var video = el.querySelector(':scope > [data-mcurator-bg-video="true"]');
      var overlay = el.querySelector(':scope > [data-mcurator-bg-overlay="true"]');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.setAttribute('data-mcurator-bg-overlay', 'true');
        el.appendChild(overlay);
      }
      return { video: video, overlay: overlay };
    }
    try {
      var oldManaged = document.querySelectorAll('[data-mcurator-bg-video="true"],[data-mcurator-bg-overlay="true"]');
      for (var om = 0; om < oldManaged.length; om++) {
        var node = oldManaged[om];
        if (node && node.parentNode) node.parentNode.removeChild(node);
      }
    } catch (eBgClean) {
      void 0;
    }
    try {
      var satKeep = document.querySelectorAll('#section-sat, #satPassportRoot, [data-section="sat"], #sectionSat');
      for (var sk = 0; sk < satKeep.length; sk++) {
        satKeep[sk].style.removeProperty('display');
        satKeep[sk].removeAttribute('data-editor-hidden');
      }
    } catch (eSatKeep) {
      void 0;
    }
    if (Array.isArray(cfg.textOverrides) && shouldApplyCmsTextOverrides_()) {
      for (var i = 0; i < cfg.textOverrides.length; i++) {
        var item = cfg.textOverrides[i] || {};
        var sel = String(item.selector || '').trim();
        if (!sel || isEditorProtectedOverrideSelector_(sel)) continue;
        try {
          var nodes = document.querySelectorAll(sel);
          for (var ni = 0; ni < nodes.length; ni++) {
            var nextText = item.text != null ? item.text : item.value;
            if (nextText != null) applyEditorTextOverride_(nodes[ni], nextText);
          }
        } catch (eSel) {
          void 0;
        }
      }
    }
    var tag = document.getElementById('mcEditorProjectCssOverride');
    if (cfg.cssOverride && String(cfg.cssOverride).trim()) {
      if (!tag) {
        tag = document.createElement('style');
        tag.id = 'mcEditorProjectCssOverride';
        document.head.appendChild(tag);
      }
      tag.textContent = String(cfg.cssOverride);
    } else if (tag && tag.parentNode) {
      tag.parentNode.removeChild(tag);
    }
    clearProjectInjectedPatches_();
    if (Array.isArray(cfg.mediaOverrides)) {
      for (var mi = 0; mi < cfg.mediaOverrides.length; mi++) {
        var mo = cfg.mediaOverrides[mi] || {};
        var mSel = String(mo.selector || '').trim();
        if (!mSel) continue;
        try {
          var mNodes = document.querySelectorAll(mSel);
          for (var mni = 0; mni < mNodes.length; mni++) {
            var mn = mNodes[mni];
            var mTag = mn.tagName && mn.tagName.toLowerCase();
            if (mo.value != null) {
              var mVal = String(mo.value);
              if (mTag === 'video') {
                mn.setAttribute('src', mVal);
                var src0 = mn.querySelector && mn.querySelector('source');
                if (src0) src0.setAttribute('src', mVal);
              } else if (mTag === 'source') {
                mn.setAttribute('src', mVal);
                var pv = mn.parentElement;
                if (pv && pv.tagName && pv.tagName.toLowerCase() === 'video') {
                  try {
                    pv.load();
                  } catch (ePv) {
                    void 0;
                  }
                }
              } else {
                mn.setAttribute('src', mVal);
              }
            }
            if (mo.alt != null && (mTag === 'img' || mTag === 'video')) mn.setAttribute('alt', String(mo.alt));
            if (mTag === 'video') {
              try {
                mn.load();
              } catch (eVload) {
                void 0;
              }
            }
          }
        } catch (eMedia) {
          void 0;
        }
      }
    }
    if (Array.isArray(cfg.linkOverrides)) {
      for (var li = 0; li < cfg.linkOverrides.length; li++) {
        var lo = cfg.linkOverrides[li] || {};
        var lSel = String(lo.selector || '').trim();
        if (!lSel) continue;
        try {
          var lNodes = document.querySelectorAll(lSel);
          for (var lni = 0; lni < lNodes.length; lni++) {
            var ln = lNodes[lni];
            if (lo.text != null) ln.textContent = String(lo.text);
            if (lo.href != null) ln.setAttribute('href', String(lo.href));
            if (lo.target != null) ln.setAttribute('target', String(lo.target));
          }
        } catch (eLink) {
          void 0;
        }
      }
    }
    if (Array.isArray(cfg.styleOverrides)) {
      for (var si = 0; si < cfg.styleOverrides.length; si++) {
        var so = cfg.styleOverrides[si] || {};
        var sSel = String(so.selector || '').trim();
        if (!sSel || !so.styles || typeof so.styles !== 'object' || isEditorProtectedOverrideSelector_(sSel)) continue;
        try {
          var sNodes = document.querySelectorAll(sSel);
          for (var sni = 0; sni < sNodes.length; sni++) {
            var sn = sNodes[sni];
            Object.keys(so.styles).forEach(function (k) {
              sn.style[k] = so.styles[k];
            });
          }
        } catch (eStyle) {
          void 0;
        }
      }
    }
    if (Array.isArray(cfg.backgroundOverrides)) {
      for (var bi = 0; bi < cfg.backgroundOverrides.length; bi++) {
        var bo = cfg.backgroundOverrides[bi] || {};
        if (bo.enabled === false) continue;
        var bSel = String(bo.selector || '').trim();
        if (!bSel) continue;
        try {
          var bNodes = document.querySelectorAll(bSel);
          for (var bni = 0; bni < bNodes.length; bni++) {
            var bn = bNodes[bni];
            var bgType = String(bo.type || 'none');
            bn.style.position = bn.style.position || 'relative';
            bn.style.overflow = 'hidden';
            bn.style.backgroundColor = bo.backgroundColor || '';
            bn.style.backgroundRepeat = bo.repeat || 'no-repeat';
            bn.style.backgroundAttachment = bo.attachment || 'scroll';
            if (bgType === 'image') {
              bn.style.backgroundImage = bo.imageSrc ? 'url("' + String(bo.imageSrc).replace(/"/g, '\\"') + '")' : '';
              bn.style.backgroundSize = bo.fit || 'cover';
              bn.style.backgroundPosition = bo.position || 'center center';
            } else if (bgType !== 'video') {
              bn.style.backgroundImage = '';
            }
            var layers = ensureBackgroundNodes_(bn);
            var overlay = layers.overlay;
            overlay.style.position = 'absolute';
            overlay.style.inset = '0';
            overlay.style.pointerEvents = 'none';
            overlay.style.zIndex = '1';
            overlay.style.background = bo.overlayColor || 'rgba(0,0,0,0)';
            overlay.style.opacity = String((Number(bo.overlayOpacity || 0) / 100).toFixed(3));
            overlay.style.backdropFilter = editorStatic ? 'none' : 'blur(' + Number(bo.blur || 0) + 'px)';
            if (bgType === 'video' && bo.videoSrc) {
              var vid = layers.video;
              if (!vid) {
                vid = document.createElement('video');
                vid.setAttribute('data-mcurator-bg-video', 'true');
                vid.autoplay = !editorStatic;
                vid.muted = true;
                vid.loop = !editorStatic;
                vid.playsInline = true;
                bn.insertBefore(vid, bn.firstChild);
              }
              vid.src = String(bo.videoSrc || '');
              if (bo.posterSrc) vid.poster = String(bo.posterSrc);
              vid.playbackRate = Number(bo.playbackRate || 1);
              vid.style.position = 'absolute';
              vid.style.inset = '0';
              vid.style.width = '100%';
              vid.style.height = '100%';
              vid.style.objectFit = bo.fit || 'cover';
              vid.style.objectPosition = bo.position || 'center center';
              vid.style.zIndex = '0';
              vid.style.pointerEvents = 'none';
              vid.style.filter =
                'blur(' + Number(bo.blur || 0) + 'px) brightness(' + Number(bo.brightness || 1) + ') saturate(' + Number(bo.saturation || 1) + ') contrast(' + Number(bo.contrast || 1) + ')';
              vid.style.transform = Number(bo.blur || 0) > 0 ? 'scale(1.03)' : '';
              try {
                if (editorStatic) {
                  vid.pause();
                  vid.currentTime = 0;
                  vid.removeAttribute('autoplay');
                } else {
                  vid.play();
                }
              } catch (eVPlay) {
                void 0;
              }
            }
            markChildrenAboveBackground_(bn);
          }
        } catch (eBg) {
          void 0;
        }
      }
    }
    if (shouldApplyCmsTextOverrides_() && Array.isArray(cfg.htmlOverrides)) {
      for (var hi = 0; hi < cfg.htmlOverrides.length; hi++) {
        var ho = cfg.htmlOverrides[hi] || {};
        var hSel = String(ho.selector || '').trim();
        if (!hSel) continue;
        try {
          var hNodes = document.querySelectorAll(hSel);
          for (var hni = 0; hni < hNodes.length; hni++) {
            if (ho.value != null) hNodes[hni].innerHTML = String(ho.value);
          }
        } catch (eHtml) {
          void 0;
        }
      }
    }
    if (Array.isArray(cfg.hiddenElements)) {
      for (var xi = 0; xi < cfg.hiddenElements.length; xi++) {
        var xSel = String(cfg.hiddenElements[xi] || '').trim();
        if (!xSel) continue;
        if (
          xSel === '#section-sat' ||
          xSel === '#satPassportRoot' ||
          xSel === '[data-section="sat"]' ||
          xSel === '#sectionSat'
        ) {
          continue;
        }
        try {
          var xNodes = document.querySelectorAll(xSel);
          for (var xni = 0; xni < xNodes.length; xni++) {
            xNodes[xni].style.display = 'none';
            xNodes[xni].setAttribute('data-editor-hidden', '1');
          }
        } catch (eHidden) {
          void 0;
        }
      }
    }
    if (shouldApplyCmsTextOverrides_() && Array.isArray(cfg.domPatches)) {
      for (var pi = 0; pi < cfg.domPatches.length; pi++) {
        var p = cfg.domPatches[pi] || {};
        if (p.enabled === false) continue;
        var patchId = p.id ? String(p.id) : makeEditorPatchId_();
        p.id = patchId;
        var sel = String(p.selector || '').trim();
        var html = p.html != null ? String(p.html) : '';
        var action = String(p.action || 'append').trim();
        if (!sel || !html) continue;
        try {
          var targets = document.querySelectorAll(sel);
          for (var ti = 0; ti < targets.length; ti++) {
            var t = targets[ti];
            if (action === 'replace') {
              if (t.getAttribute('data-mcurator-patch-replaced') !== '1') {
                t.setAttribute('data-mcurator-patch-original-html', t.innerHTML);
              }
              t.setAttribute('data-mcurator-patch-replaced', '1');
              t.setAttribute('data-mcurator-patch-id', patchId);
              t.innerHTML = html;
            } else if (action === 'prepend') {
              var nPre = document.createElement('div');
              nPre.setAttribute('data-mcurator-patch-injected', '1');
              nPre.setAttribute('data-mcurator-patch-id', patchId);
              nPre.innerHTML = html;
              t.insertBefore(nPre, t.firstChild);
            } else if (action === 'before') {
              var nBefore = document.createElement('div');
              nBefore.setAttribute('data-mcurator-patch-injected', '1');
              nBefore.setAttribute('data-mcurator-patch-id', patchId);
              nBefore.innerHTML = html;
              t.parentNode && t.parentNode.insertBefore(nBefore, t);
            } else if (action === 'after') {
              var nAfter = document.createElement('div');
              nAfter.setAttribute('data-mcurator-patch-injected', '1');
              nAfter.setAttribute('data-mcurator-patch-id', patchId);
              nAfter.innerHTML = html;
              if (t.parentNode) {
                if (t.nextSibling) t.parentNode.insertBefore(nAfter, t.nextSibling);
                else t.parentNode.appendChild(nAfter);
              }
            } else {
              var nAppend = document.createElement('div');
              nAppend.setAttribute('data-mcurator-patch-injected', '1');
              nAppend.setAttribute('data-mcurator-patch-id', patchId);
              nAppend.innerHTML = html;
              t.appendChild(nAppend);
            }
          }
        } catch (ePatch) {
          void 0;
        }
      }
    }
  }

  function applyEditorConfig(config) {
    config = normalizeEditorConfig_(config || getEditorConfig());
    window.MC_EDITOR_CONFIG = config;
    var pageCfg = getActivePageConfig_(config);
    var composedProjectCfg = mergeEditorConfig_(pageCfg, {});
    if (config.project && config.project.globalCssOverride) {
      composedProjectCfg.cssOverride =
        (String(composedProjectCfg.cssOverride || '') + '\n' + String(config.project.globalCssOverride || '')).trim();
    }
    try {
      applyHeroConfig(config.hero);
      applyEntryConfig(config.entry);
      applyCoverflowConfig(config.coverflow);
      applySpecimenCardConfig(config.specimenCard);
      applyWorkflowConfig(config.workflow);
      applyGradingConfig(config.grading);
      applyProjectConfig(composedProjectCfg);
    } catch (eApplyBlock) {
      console.warn('[VisualEditor] applyEditorConfig partial failure', eApplyBlock);
    }
    try {
      refreshNonTextWidgetsAfterEditorConfig_();
    } catch (eRefresh) {
      console.warn('[VisualEditor] refreshNonTextWidgetsAfterEditorConfig_ failed', eRefresh);
    }
  }

  function bindEditorMessageReceiver_() {
    if (window.__MC_EDITOR_MSG_BOUND__) return;
    window.__MC_EDITOR_MSG_BOUND__ = true;
    window.addEventListener('message', function (event) {
      var data = event && event.data;
      if (!data || !data.type) return;
      if (data.type === 'MC_EDITOR_CONFIG_UPDATE' || data.type === 'MC_EDITOR_APPLY_CONFIG') {
        window.MC_EDITOR_CONFIG = normalizeEditorConfig_(data.config || getEditorConfig());
        applyEditorConfig(window.MC_EDITOR_CONFIG);
      } else if (data.type === 'MC_EDITOR_ENABLE_INSPECT') {
        window.MC_EDITOR_CONFIG = normalizeEditorConfig_((data.payload && data.payload.config) || getEditorConfig());
        applyEditorConfig(window.MC_EDITOR_CONFIG);
        window.__MC_EDITOR_PREVIEW_INSPECT__ = true;
      } else if (data.type === 'MC_EDITOR_DISABLE_INSPECT') {
        window.__MC_EDITOR_PREVIEW_INSPECT__ = false;
      } else if (data.type === 'MC_EDITOR_SCAN_EDITABLE') {
        var scan = scanPreviewEditableElements_();
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'MC_EDITOR_SCAN_RESULT', payload: scan }, '*');
        }
      } else if (data.type === 'MC_EDITOR_UPDATE_SELECTED_ELEMENT') {
        try {
          var sel = data.payload && data.payload.selector;
          if (sel) {
            var target = document.querySelector(sel);
            if (target) {
              var prev = document.querySelector('.mcurator-editor-selected');
              if (prev) prev.classList.remove('mcurator-editor-selected');
              target.classList.add('mcurator-editor-selected');
              if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'MC_EDITOR_ELEMENT_SELECTED', payload: { selector: sel } }, '*');
              }
            }
          }
        } catch (eSelUp) {
          void 0;
        }
      } else if (data.type === 'MC_EDITOR_PATCH_COVERFLOW_FIELD') {
        var pp = data.payload || {};
        if (pp.cfField != null && pp.cfIndex != null && String(pp.cfIndex) !== '') {
          patchCoverflowFieldDom_(pp.cfIndex, pp.cfField, pp.value);
        }
      } else if (data.type === 'MC_EDITOR_PATCH_TEXT') {
        var pt = data.payload || {};
        if (pt.selector) patchEditorTextDom_(pt.selector, pt.value);
      } else if (data.type === 'MC_EDITOR_BEGIN_INLINE_TEXT') {
        try {
          if (window.__MC_EDITOR_INLINE_TEXT_API__ && typeof window.__MC_EDITOR_INLINE_TEXT_API__.begin === 'function') {
            window.__MC_EDITOR_INLINE_TEXT_API__.begin(data.payload && data.payload.selector);
          }
        } catch (eInline) {
          void 0;
        }
      } else if (data.type === 'MC_EDITOR_ELEMENT_DESELECTED') {
        try {
          var prevSel = document.querySelector('.mcurator-editor-selected');
          if (prevSel) prevSel.classList.remove('mcurator-editor-selected');
        } catch (eDes) {
          void 0;
        }
      }
    });
  }

  function isEditorPreviewMode_() {
    try {
      var p = new URLSearchParams(String((window.location && window.location.search) || ''));
      return p.get('editorPreview') === '1';
    } catch (e) {
      return false;
    }
  }

  function shouldFreezeEditorPreview_() {
    try {
      if (window.MCuratorEditorMode && typeof window.MCuratorEditorMode.shouldEnableEditorStaticPreview === 'function') {
        return window.MCuratorEditorMode.shouldEnableEditorStaticPreview();
      }
    } catch (eMode) {
      void 0;
    }
    return isEditorPreviewMode_();
  }

  function ensureEditorHeroCardVisible_() {
    try {
      var hero = document.getElementById('mcWelcomeHero');
      if (hero && hero.getAttribute('data-mc-earth-three-live') !== '1') {
        hero.setAttribute('data-mc-editor-hero-visible', '1');
      }
      var entrance = document.querySelector('#mcHero3d .mc-hero-card-entrance');
      if (entrance) {
        entrance.style.opacity = '1';
        entrance.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    } catch (eVis) {
      void 0;
    }
  }

  function applyEditorStaticPreviewState_(enabled) {
    try {
      if (window.MCuratorEditorMode) {
        if (enabled && typeof window.MCuratorEditorMode.enableEditorStaticPreview === 'function') {
          window.MCuratorEditorMode.enableEditorStaticPreview();
        } else if (!enabled && typeof window.MCuratorEditorMode.disableEditorStaticPreview === 'function') {
          window.MCuratorEditorMode.disableEditorStaticPreview();
        }
      }
      if (enabled) {
        document.documentElement.classList.add('editor-static-preview');
        document.body.classList.add('editor-static-preview');
        document.documentElement.setAttribute('data-editor-mode', 'true');
        document.body.setAttribute('data-editor-mode', 'true');
      }
    } catch (eStatic) {
      void 0;
    }
  }

  function isEditorAllPagesMode_() {
    if (window.__MC_EDITOR_ALL_PAGES__ === true) return true;
    try {
      var p = new URLSearchParams(String((window.location && window.location.search) || ''));
      if (p.get('allPages') === '1' || p.get('editorAllPages') === '1') return true;
    } catch (eSelf) {
      void 0;
    }
    try {
      if (window.parent && window.parent !== window && window.parent.__MC_EDITOR_ALL_PAGES__ === true) return true;
    } catch (eParentFlag) {
      void 0;
    }
    try {
      if (window.parent && window.parent !== window) {
        var pp = new URLSearchParams(String((window.parent.location && window.parent.location.search) || ''));
        if (pp.get('allPages') === '1' || pp.get('editorAllPages') === '1') return true;
      }
    } catch (eParent) {
      void 0;
    }
    return false;
  }

  function patchEditorPreviewRouterGuard_() {
    if (!isEditorPreviewMode_() || isEditorAllPagesMode_()) return;
    if (window.__MC_EDITOR_PREVIEW_ROUTER_GUARD__) return;
    function tryPatch_() {
      var router = window.MCRouter;
      if (!router || typeof router.go !== 'function' || router.__editorPreviewGuard) {
        return !!router && !!router.__editorPreviewGuard;
      }
      var origGo = router.go;
      router.__editorPreviewGuard = true;
      router.go = function (path) {
        if (isEditorPreviewMode_()) {
          console.log('[VisualEditor] router blocked in preview:', path);
          return;
        }
        return origGo.apply(this, arguments);
      };
      if (!window.__MC_EDITOR_PREVIEW_HASH_GUARD__) {
        window.__MC_EDITOR_PREVIEW_HASH_GUARD__ = true;
        window.addEventListener(
          'hashchange',
          function () {
            if (!isEditorPreviewMode_()) return;
            var hash = String((window.location && window.location.hash) || '');
            if (hash && hash !== '#/' && hash !== '#') {
              console.log('[VisualEditor] hash reset in preview:', hash);
              try {
                window.location.hash = '#/';
              } catch (eHash) {
                void 0;
              }
            }
          },
          true
        );
      }
      return true;
    }
    if (!tryPatch_()) {
      var attempts = 0;
      var timer = setInterval(function () {
        attempts += 1;
        if (tryPatch_() || attempts > 100) clearInterval(timer);
      }, 100);
    }
    window.__MC_EDITOR_PREVIEW_ROUTER_GUARD__ = true;
  }

  function dismissEditorPreviewBootChrome_() {
    try {
      document.documentElement.classList.remove('mc-boot-active');
      var splash = document.getElementById('mcBootSplash');
      if (splash) splash.remove();
      var ws = document.getElementById('welcomeShell');
      if (ws) {
        ws.style.removeProperty('visibility');
        ws.style.removeProperty('pointer-events');
        ws.removeAttribute('inert');
      }
      var rs = document.getElementById('responsiveShell');
      if (rs) {
        rs.style.removeProperty('visibility');
        rs.style.removeProperty('pointer-events');
      }
      if (window.McPreviewShell && typeof window.McPreviewShell.dismissMcBootSplash === 'function') {
        window.McPreviewShell.dismissMcBootSplash();
      }
    } catch (eBoot) {
      void 0;
    }
  }

  function initEditorPreviewRuntime_() {
    if (!isEditorPreviewMode_()) return;
    if (window.__MC_EDITOR_PREVIEW_RUNTIME__) return;
    window.__MC_EDITOR_PREVIEW_RUNTIME__ = true;
    dismissEditorPreviewBootChrome_();
    patchEditorPreviewRouterGuard_();
    var freezePreview = shouldFreezeEditorPreview_();
    applyEditorStaticPreviewState_(freezePreview);
    try {
      if (freezePreview && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch (eScrollRestoration) {
      void 0;
    }
    if (freezePreview) {
      try {
        window.scrollTo(0, 0);
      } catch (eTop) {
        void 0;
      }
      window.addEventListener(
        'DOMContentLoaded',
        function () {
          try {
            window.scrollTo(0, 0);
          } catch (eTop2) {
            void 0;
          }
          try {
            if (window.MCuratorEditorMode && typeof window.MCuratorEditorMode.freezePreviewVideos === 'function') {
              window.MCuratorEditorMode.freezePreviewVideos(document);
            }
          } catch (eFreeze) {
            void 0;
          }
        },
        { once: true }
      );
      try {
        var freezeObserver = new MutationObserver(function () {
          if (window.MCuratorEditorMode && typeof window.MCuratorEditorMode.freezePreviewVideos === 'function') {
            window.MCuratorEditorMode.freezePreviewVideos(document);
          }
        });
        freezeObserver.observe(document.documentElement, { childList: true, subtree: true });
      } catch (eObs) {
        void 0;
      }
    }
    document.body.classList.add('mcurator-editor-preview-mode');
    window.__MC_EDITOR_PREVIEW_INSPECT__ = true;
    window.__MC_COLLECTION_WALL_PREVIEW__ = true;
    var st = document.createElement('style');
    st.id = 'mcurator-editor-preview-runtime-style';
    st.textContent =
      '.mcurator-editor-preview-mode [data-editor-hovered="true"]{outline:1px solid rgba(122,255,190,.8)!important;outline-offset:2px}' +
      '.mcurator-editor-selected{outline:2px solid rgba(255,214,102,.95)!important;outline-offset:3px}' +
      'html[data-editor-mode="true"] [data-mc-cf-field],html[data-editor-mode="true"] [data-mc-cf-field] *,html[data-editor-mode="true"] [contenteditable="true"]{pointer-events:auto!important;cursor:text}' +
      'html[data-editor-mode="true"] #welcomeContentTitle,html[data-editor-mode="true"] #welcomeContentLead,html[data-editor-mode="true"] #mcSpecimenCoverflowH,html[data-editor-mode="true"] .specimen-record-card__meta dd{pointer-events:auto!important;cursor:text}' +
      '.mcurator-editor-hit-label{position:fixed;z-index:2147483647;pointer-events:none;background:rgba(7,16,14,.92);color:#d1fae5;border:1px solid rgba(110,231,183,.5);padding:2px 8px;border-radius:999px;font:600 11px/1.2 Inter,system-ui,sans-serif}' +
      '.mcurator-selection-overlay{position:fixed;z-index:2147483646;border:2px solid rgba(214,194,122,.95);box-shadow:0 0 0 1px rgba(56,211,159,.35),0 0 24px rgba(214,194,122,.25);pointer-events:none}' +
      '.mcurator-selection-overlay .mcurator-resize-handle{position:absolute;width:10px;height:10px;border-radius:999px;background:#d6c27a;border:2px solid #07100d;pointer-events:auto}' +
      '.mcurator-size-badge{position:absolute;right:8px;top:-24px;background:rgba(7,16,13,.92);color:#f4f0e6;padding:2px 8px;border-radius:999px;font:600 11px/1.2 Inter,system-ui,sans-serif}';
    document.head.appendChild(st);
    var label = document.createElement('div');
    label.className = 'mcurator-editor-hit-label';
    label.style.display = 'none';
    document.body.appendChild(label);
    var hovered = null;
    var selected = null;
    var overlay = document.createElement('div');
    overlay.className = 'mcurator-selection-overlay';
    overlay.style.display = 'none';
    var sizeBadge = document.createElement('div');
    sizeBadge.className = 'mcurator-size-badge';
    overlay.appendChild(sizeBadge);
    document.body.appendChild(overlay);
    var handleDefs = [
      { key: 'nw', x: '-5px', y: '-5px', cursor: 'nwse-resize' },
      { key: 'n', x: 'calc(50% - 5px)', y: '-5px', cursor: 'ns-resize' },
      { key: 'ne', x: 'calc(100% - 5px)', y: '-5px', cursor: 'nesw-resize' },
      { key: 'w', x: '-5px', y: 'calc(50% - 5px)', cursor: 'ew-resize' },
      { key: 'e', x: 'calc(100% - 5px)', y: 'calc(50% - 5px)', cursor: 'ew-resize' },
      { key: 'sw', x: '-5px', y: 'calc(100% - 5px)', cursor: 'nesw-resize' },
      { key: 's', x: 'calc(50% - 5px)', y: 'calc(100% - 5px)', cursor: 'ns-resize' },
      { key: 'se', x: 'calc(100% - 5px)', y: 'calc(100% - 5px)', cursor: 'nwse-resize' },
    ];
    var activeResize = null;
    function readComputedStyle_(el) {
      var cs = window.getComputedStyle(el);
      return {
        width: cs.width, height: cs.height, minWidth: cs.minWidth, maxWidth: cs.maxWidth, minHeight: cs.minHeight, maxHeight: cs.maxHeight,
        display: cs.display, position: cs.position, zIndex: cs.zIndex,
        paddingTop: cs.paddingTop, paddingRight: cs.paddingRight, paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft,
        marginTop: cs.marginTop, marginRight: cs.marginRight, marginBottom: cs.marginBottom, marginLeft: cs.marginLeft,
        borderTopWidth: cs.borderTopWidth, borderRightWidth: cs.borderRightWidth, borderBottomWidth: cs.borderBottomWidth, borderLeftWidth: cs.borderLeftWidth,
        borderStyle: cs.borderStyle, borderColor: cs.borderColor, borderRadius: cs.borderRadius,
        backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage, backgroundSize: cs.backgroundSize, backgroundPosition: cs.backgroundPosition, color: cs.color,
        boxShadow: cs.boxShadow, opacity: cs.opacity, transform: cs.transform,
        fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textAlign: cs.textAlign,
        objectFit: cs.objectFit, objectPosition: cs.objectPosition,
      };
    }
    function postSelectedUpdate_() {
      if (!selected) return;
      post('MC_EDITOR_ELEMENT_SELECTED', payloadFor(selected));
    }
    var overlayUpdateRaf = 0;
    function updateSelectionOverlay_(targetElement) {
      var node = targetElement || selected;
      if (!node) {
        overlay.style.display = 'none';
        return;
      }
      var rect = node.getBoundingClientRect();
      overlay.style.display = 'block';
      overlay.style.left = rect.left + 'px';
      overlay.style.top = rect.top + 'px';
      overlay.style.width = Math.max(1, rect.width) + 'px';
      overlay.style.height = Math.max(1, rect.height) + 'px';
      sizeBadge.textContent = Math.round(rect.width * 100) / 100 + ' × ' + (Math.round(rect.height * 100) / 100);
    }
    function scheduleSelectionOverlayUpdate_(targetElement) {
      if (!targetElement) return;
      if (overlayUpdateRaf) cancelAnimationFrame(overlayUpdateRaf);
      overlayUpdateRaf = requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          overlayUpdateRaf = 0;
          updateSelectionOverlay_(targetElement);
        });
      });
    }
    function getStableEditableTarget_(element) {
      if (!element || !element.getBoundingClientRect) return element || null;
      if (element.closest && element.closest('.specimen-record-card,[data-interactive-card],.specimen-coverflow-track')) {
        var cfDd =
          element.closest('dd[data-mc-cf-field]') ||
          (element.tagName && element.tagName.toLowerCase() === 'dd' && element.getAttribute('data-mc-cf-field') ? element : null);
        if (cfDd) return cfDd;
        var cfText = element.closest(
          'h3[data-mc-cf-field],p[data-mc-cf-field],.specimen-record-card__sci-fit,.specimen-record-card__type,.cw-showcase-card__sci,.cw-showcase-card__common'
        );
        if (cfText && cfText.getAttribute && cfText.getAttribute('data-mc-cf-field')) return cfText;
        if (cfText && cfText.closest && cfText.closest('.specimen-record-card__identity, .cw-showcase-card__body')) return cfText;
        return null;
      }
      var rect = element.getBoundingClientRect();
      if (rect.height < 24 || rect.width < 40) {
        return (
          element.closest('[data-editor-id]') ||
          element.closest('.editable-block') ||
          element
        );
      }
      return (
        element.closest('[data-editor-id]') ||
        element.closest('.editable-block') ||
        element
      );
    }
    function updateSelectionOverlayNow_() {
      if (!selected) {
        overlay.style.display = 'none';
        return;
      }
      scheduleSelectionOverlayUpdate_(selected);
    }
    function px(n) {
      return Math.max(24, Math.round(Number(n || 0))) + 'px';
    }
    function startResize_(ev, handleKey) {
      if (!selected) return;
      if (
        selected.closest &&
        selected.closest('.specimen-record-card,[data-interactive-card],.specimen-coverflow-track,#mcSpecimenCoverflow,.quest-card')
      ) {
        return;
      }
      ev.preventDefault();
      ev.stopPropagation();
      var rect = selected.getBoundingClientRect();
      activeResize = {
        handle: handleKey,
        startX: ev.clientX,
        startY: ev.clientY,
        startW: rect.width,
        startH: rect.height,
      };
      document.documentElement.style.userSelect = 'none';
    }
    handleDefs.forEach(function (h) {
      var handle = document.createElement('div');
      handle.className = 'mcurator-resize-handle';
      handle.setAttribute('data-handle', h.key);
      handle.style.left = h.x;
      handle.style.top = h.y;
      handle.style.cursor = h.cursor;
      if (handle && typeof handle.addEventListener === 'function') {
        handle.addEventListener('pointerdown', function (e) {
          startResize_(e, h.key);
        });
      }
      overlay.appendChild(handle);
    });
    var editableSelector =
      '[data-editor-id],h1,h2,h3,h4,h5,h6,p,span,a,button,li,label,img,video,source,.editable-block,dd[data-mc-cf-field]';
    var editorIdSeeds = [
      ['#welcomeContentTitle', 'hero-title', 'Hero Title'],
      ['#welcomeContentLead', 'hero-subtitle', 'Hero Subtitle'],
      ['#btnWelcomeHeroDemo', 'hero-cta-primary', 'Hero Primary Button'],
      ['#btnWelcomeHeroStart', 'hero-cta-secondary', 'Hero Secondary Button'],
      ['#welcomeBarLanguage', 'language-selector', 'Language Selector'],
      ['#btnMcLogin', 'login-button', 'Login Button'],
      ['#mcBtnMenu', 'mobile-menu-button', 'Mobile Menu Button'],
      ['#mcHero3dTumbler', 'hero-specimen-card', 'Specimen Card Wrapper'],
      ['#mcHero3dTumbler img', 'specimen-main-image', '標本主圖'],
      ['#welcomeWorkflowSection', 'workflow-section', 'Workflow Section'],
      ['#welcomeLpValuesH', 'workflow-title', 'Workflow Title'],
      ['#satCoverflowSection', 'coverflow-section', 'Coverflow Section'],
      ['#mcSpecimenCoverflowH', 'coverflow-title', 'Coverflow Title'],
      ['.specimen-coverflow-header span', 'coverflow-subtitle', 'Coverflow Subtitle'],
      ['#welcomeGateSection', 'welcome-gate', 'Welcome Gate'],
    ];
    for (var edi = 0; edi < editorIdSeeds.length; edi++) {
      var q0 = editorIdSeeds[edi][0];
      var id0 = editorIdSeeds[edi][1];
      var label0 = editorIdSeeds[edi][2];
      try {
        var n0 = document.querySelector(q0);
        if (n0 && !n0.getAttribute('data-editor-id')) n0.setAttribute('data-editor-id', id0);
        if (n0 && label0 && !n0.getAttribute('data-editor-label')) n0.setAttribute('data-editor-label', label0);
      } catch (eEid) {
        void 0;
      }
    }
    function stableSel(el) {
      if (!el || !el.tagName) return '';
      var deid = el.getAttribute && el.getAttribute('data-editor-id');
      if (deid) return '[data-editor-id="' + deid + '"]';
      if (el.id) return '#' + el.id;
      var ds = el.getAttribute && el.getAttribute('data-section');
      if (ds) return '[data-section="' + ds + '"]';
      var al = el.getAttribute && el.getAttribute('aria-label');
      if (al) return el.tagName.toLowerCase() + '[aria-label="' + al.replace(/"/g, '\\"') + '"]';
      return stableSelectorForNode_(el);
    }
    function detectType(el) {
      var tag = (el.tagName || '').toLowerCase();
      if (el.closest && el.closest('.specimen-record-card,[data-interactive-card],.specimen-coverflow-track,#mcSpecimenCoverflow,.cw-showcase-card')) {
        if (el.getAttribute && el.getAttribute('data-mc-cf-field')) return 'coverflowField';
        if (/^(h1|h2|h3|h4|h5|h6|p|span|label|strong|em|small|button|dd)$/.test(tag)) return 'text';
        return 'component';
      }
      if (tag === 'img' || tag === 'video' || tag === 'source') return 'image';
      if (tag === 'a') return 'link';
      if (/^(h1|h2|h3|h4|h5|h6|p|span|button|li|label)$/.test(tag)) return 'text';
      if (tag === 'section' || tag === 'main' || tag === 'header' || tag === 'footer' || tag === 'article') return 'section';
      return 'container';
    }
    function payloadFor(el) {
      var rect = el.getBoundingClientRect();
      var tag = (el.tagName || '').toUpperCase();
      var sel = stableSel(el);
      var cfField = el.getAttribute && el.getAttribute('data-mc-cf-field');
      var cfIndex = el.getAttribute && el.getAttribute('data-mc-cf-index');
      return {
        selector: sel,
        tagName: tag,
        editType: detectType(el),
        cfField: cfField || '',
        cfIndex: cfIndex != null ? cfIndex : '',
        editorId: el.getAttribute && el.getAttribute('data-editor-id'),
        editorLabel:
          (cfField ? coverflowFieldLabel_(cfField) + ' #' + (Number(cfIndex) + 1 || 1) : '') ||
          (el.getAttribute && el.getAttribute('data-editor-label')),
        text: String(el.textContent || '').trim(),
        html: el.innerHTML || '',
        src: (function () {
          var s0 = el.getAttribute && el.getAttribute('src');
          if (s0) return s0;
          if ((el.tagName || '').toUpperCase() === 'VIDEO' && el.querySelector) {
            var s1 = el.querySelector('source');
            return (s1 && s1.getAttribute('src')) || '';
          }
          return '';
        })(),
        alt: el.getAttribute && el.getAttribute('alt'),
        href: el.getAttribute && el.getAttribute('href'),
        target: el.getAttribute && el.getAttribute('target'),
        className: el.className || '',
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        computedStyle: readComputedStyle_(el),
        label: (el.getAttribute && el.getAttribute('data-editor-label')) || tag + ' ' + sel,
      };
    }
    function post(type, payload) {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: type, payload: payload }, '*');
      }
    }
    function attachInlineTextEditor_(t) {
      var tType = detectType(t);
      if (!t || (tType !== 'text' && tType !== 'coverflowField')) return false;
      if (typeof isEditorTextSafeTarget_ === 'function' && !isEditorTextSafeTarget_(t)) return false;
      if (t.getAttribute('contenteditable') === 'true') {
        t.focus();
        return true;
      }
      var onInput = function () {
        post('MC_EDITOR_ELEMENT_INPUT', {
          selector: stableSel(t),
          editType: tType === 'coverflowField' ? 'coverflowField' : 'text',
          cfField: t.getAttribute && t.getAttribute('data-mc-cf-field'),
          cfIndex: t.getAttribute && t.getAttribute('data-mc-cf-index'),
          value: String(t.textContent || ''),
        });
      };
      var onBlur = function () {
        t.removeAttribute('contenteditable');
        t.removeEventListener('input', onInput);
        t.removeEventListener('blur', onBlur);
        onInput();
        if (tType === 'coverflowField') {
          post('MC_EDITOR_COVERFLOW_FIELD_COMMIT', {
            cfField: t.getAttribute && t.getAttribute('data-mc-cf-field'),
            cfIndex: t.getAttribute && t.getAttribute('data-mc-cf-index'),
            value: String(t.textContent || ''),
          });
        } else if (tType === 'text' || tType === 'link') {
          post('MC_EDITOR_TEXT_COMMIT', {
            selector: stableSel(t),
            editType: tType,
            value: String(t.textContent || ''),
          });
        }
      };
      t.setAttribute('contenteditable', 'true');
      t.focus();
      t.addEventListener('input', onInput);
      t.addEventListener('blur', onBlur);
      return true;
    }
    window.__MC_EDITOR_INLINE_TEXT_API__ = {
      begin: function (selector) {
        var t = document.querySelector(String(selector || '').trim());
        attachInlineTextEditor_(t);
      },
    };
    function isSpecimenCardInteractTarget_(el) {
      if (!el || !el.closest) return false;
      var card = el.closest('.specimen-record-card[data-interactive-card]');
      if (!card) return false;
      if (el.closest('a,button,input,textarea,select,label,[data-feature-key],[data-hero-hs]')) return false;
      return true;
    }
    function setHovered(el, ev) {
      if (hovered && hovered !== el) hovered.removeAttribute('data-editor-hovered');
      hovered = el;
      if (!hovered) {
        label.style.display = 'none';
        return;
      }
      hovered.setAttribute('data-editor-hovered', 'true');
      var friendly = (hovered.getAttribute && hovered.getAttribute('data-editor-label')) || '';
      label.textContent = friendly
        ? friendly + ' · 點擊編輯'
        : (hovered.tagName || '').toLowerCase() + ' · 點擊編輯';
      label.style.display = 'block';
      label.style.left = Math.max(8, (ev.clientX || 12) + 12) + 'px';
      label.style.top = Math.max(8, (ev.clientY || 12) + 12) + 'px';
    }
    document.addEventListener(
      'mousemove',
      function (e) {
        if (!window.__MC_EDITOR_PREVIEW_INSPECT__) return;
        var t = e.target && e.target.closest ? e.target.closest(editableSelector) : null;
        setHovered(t, e);
      },
      true
    );
    document.addEventListener(
      'click',
      function (e) {
        if (!window.__MC_EDITOR_PREVIEW_INSPECT__) return;
        var cfFieldEl = e.target && e.target.closest && e.target.closest('[data-mc-cf-field]');
        if (isSpecimenCardInteractTarget_(e.target) && !e.altKey && !cfFieldEl) return;
        var t = e.target && e.target.closest ? getStableEditableTarget_(e.target.closest(editableSelector)) : null;
        if (
          e.target &&
          e.target.closest &&
          e.target.closest('a,button,input,select,textarea,form,[role="button"]') &&
          !e.altKey &&
          !t
        ) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (!t) return;
        var pickType = detectType(t);
        if (pickType === 'component') return;
        e.preventDefault();
        e.stopPropagation();
        if (selected) selected.classList.remove('mcurator-editor-selected');
        selected = t;
        selected.classList.add('mcurator-editor-selected');
        updateSelectionOverlayNow_();
        post('MC_EDITOR_ELEMENT_SELECTED', payloadFor(t));
        if (pickType === 'coverflowField' || pickType === 'text' || pickType === 'link') {
          attachInlineTextEditor_(t);
        }
      },
      true
    );
    document.addEventListener(
      'pointermove',
      function (e) {
        if (!activeResize || !selected) return;
        e.preventDefault();
        var dx = e.clientX - activeResize.startX;
        var dy = e.clientY - activeResize.startY;
        var nextW = activeResize.startW;
        var nextH = activeResize.startH;
        if (/e|w/.test(activeResize.handle)) nextW = activeResize.startW + (activeResize.handle.indexOf('w') >= 0 ? -dx : dx);
        if (/n|s/.test(activeResize.handle)) nextH = activeResize.startH + (activeResize.handle.indexOf('n') >= 0 ? -dy : dy);
        var tag = (selected.tagName || '').toLowerCase();
        var styles = {};
        if (tag === 'section' || tag === 'main') {
          if (/n|s/.test(activeResize.handle)) styles.minHeight = px(nextH);
          if (/e|w/.test(activeResize.handle)) styles.maxWidth = px(nextW);
        } else {
          if (/e|w/.test(activeResize.handle)) styles.width = px(nextW);
          if (/n|s/.test(activeResize.handle)) styles.height = px(nextH);
        }
        Object.keys(styles).forEach(function (k) { selected.style[k] = styles[k]; });
        updateSelectionOverlayNow_();
        post('MC_EDITOR_STYLE_DRAG_UPDATE', { selector: stableSel(selected), styles: styles, computedStyle: readComputedStyle_(selected) });
      },
      true
    );
    document.addEventListener(
      'pointerup',
      function () {
        if (!activeResize) return;
        activeResize = null;
        document.documentElement.style.userSelect = '';
        postSelectedUpdate_();
      },
      true
    );
    window.addEventListener('scroll', updateSelectionOverlayNow_, true);
    window.addEventListener('resize', updateSelectionOverlayNow_, true);
    document.addEventListener(
      'keydown',
      function (e) {
        if (!window.__MC_EDITOR_PREVIEW_INSPECT__) return;
        if (e.key === 'Escape') {
          if (selected) {
            selected.classList.remove('mcurator-editor-selected');
            selected = null;
            overlay.style.display = 'none';
            label.style.display = 'none';
            post('MC_EDITOR_ELEMENT_DESELECTED', {});
          }
          return;
        }
        if (e.key !== 'F2') return;
        var ae = document.activeElement;
        if (ae && ae.getAttribute && ae.getAttribute('contenteditable') === 'true') return;
        if (!selected || (detectType(selected) !== 'text' && detectType(selected) !== 'coverflowField')) return;
        e.preventDefault();
        attachInlineTextEditor_(selected);
      },
      true
    );
    document.addEventListener(
      'dblclick',
      function (e) {
        if (!window.__MC_EDITOR_PREVIEW_INSPECT__) return;
        var t = e.target && e.target.closest ? e.target.closest(editableSelector) : null;
        if (!t) return;
        var tType = detectType(t);
        if (tType !== 'text' && tType !== 'coverflowField') return;
        e.preventDefault();
        e.stopPropagation();
        attachInlineTextEditor_(t);
      },
      true
    );
    post('MC_EDITOR_IFRAME_READY', { ready: true });
  }

  function injectEditorStyles_() {
    if (document.getElementById('mcVisualEditorStyles')) return;
    var st = document.createElement('style');
    st.id = 'mcVisualEditorStyles';
    st.textContent =
      '.mc-editor-shell{position:fixed;inset:0;z-index:99999;display:grid;grid-template-columns:248px 1fr 380px;background:#0d1117;color:#e6edf3;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '.mc-editor-sidebar,.mc-editor-properties{background:#161b22;border-color:#30363d;overflow-y:auto}' +
      '.mc-editor-sidebar{border-right:1px solid #30363d;padding:16px 14px}' +
      '.mc-editor-properties{border-left:1px solid #30363d;padding:0;height:100vh;display:flex;flex-direction:column}' +
      '.mc-editor-sidebar h2,.mc-editor-properties h3{margin:0 0 12px;font-size:15px;font-weight:600;letter-spacing:-.01em}' +
      '.mc-editor-properties h3{padding:14px 16px 0;font-size:14px}' +
      '[data-editor-fields]{flex:1;overflow-y:auto;padding:0 16px 88px}' +
      '.mc-editor-preview{position:relative;display:grid;grid-template-rows:52px 1fr;background:#010409}' +
      '.mc-editor-toolbar{display:flex;gap:6px;align-items:center;padding:8px 12px;background:#161b22;border-bottom:1px solid #30363d;flex-wrap:wrap}' +
      '.mc-editor-toolbar button,.mc-editor-sidebar button{min-height:34px;border:1px solid #30363d;background:#21262d;color:#e6edf3;border-radius:8px;padding:6px 11px;cursor:pointer;font-size:12px;font-weight:500}' +
      '.mc-editor-toolbar button:hover,.mc-editor-sidebar button:hover{background:#30363d;border-color:#8b949e}' +
      '.mc-editor-toolbar button.is-active,.mc-editor-sidebar button.is-active{border-color:#58a6ff;background:rgba(56,139,253,.15);color:#58a6ff}' +
      '.mc-editor-toolbar .mc-editor-toolbar__brand{margin-right:auto;font-size:12px;color:#8b949e;font-weight:500}' +
      '.mc-editor-viewport-toggle{display:inline-flex;border:1px solid #30363d;border-radius:8px;overflow:hidden}' +
      '.mc-editor-viewport-toggle button{border:0;border-radius:0;border-right:1px solid #30363d;min-width:52px}' +
      '.mc-editor-viewport-toggle button:last-child{border-right:0}' +
      '.mc-editor-frame-wrap{display:flex;justify-content:center;align-items:flex-start;overflow:auto;background:#010409;padding:12px;height:100%}' +
      '.mc-editor-frame-wrap #mcEditorFrame{width:100%;height:calc(100vh - 76px);min-height:480px;border:0;background:#020806;border-radius:10px;box-shadow:0 0 0 1px #30363d;transition:max-width .25s ease}' +
      '.mc-editor-frame-wrap[data-editor-viewport="tablet"] #mcEditorFrame{max-width:768px}' +
      '.mc-editor-frame-wrap[data-editor-viewport="mobile"] #mcEditorFrame{max-width:390px}' +
      '.mc-editor-inspector-tabs{display:flex;gap:0;border-bottom:1px solid #30363d;margin:0 -16px 12px;padding:0 16px;position:sticky;top:0;background:#161b22;z-index:2}' +
      '.mc-editor-inspector-tab{flex:1;border:0;border-bottom:2px solid transparent;background:transparent;color:#8b949e;border-radius:0;padding:10px 6px;font-size:12px;font-weight:600;cursor:pointer}' +
      '.mc-editor-inspector-tab.is-active{color:#e6edf3;border-bottom-color:#58a6ff}' +
      '.mc-editor-element-head{display:flex;gap:10px;align-items:center;padding:10px 12px;margin:0 0 12px;border:1px solid #30363d;border-radius:10px;background:#0d1117}' +
      '.mc-editor-element-head__meta{display:grid;gap:4px;min-width:0;flex:1}' +
      '.mc-editor-element-head__tag{font:600 10px/1 ui-monospace,Consolas,monospace;color:#58a6ff;letter-spacing:.06em}' +
      '.mc-editor-element-head__name{font-size:13px;line-height:1.35;word-break:break-word}' +
      '.mc-editor-element-head__thumb{width:56px;height:56px;border-radius:8px;object-fit:cover;border:1px solid #30363d;flex-shrink:0}' +
      '.mc-editor-field{margin:0 0 12px}' +
      '.mc-editor-field__label{display:block;font-size:11px;font-weight:600;color:#8b949e;margin:0 0 6px;letter-spacing:.02em}' +
      '.mc-editor-field__control{width:100%;background:#0d1117;color:#e6edf3;border:1px solid #30363d;border-radius:8px;padding:8px 10px;font-size:13px;line-height:1.4}' +
      '.mc-editor-field__control:focus{outline:none;border-color:#58a6ff;box-shadow:0 0 0 3px rgba(56,139,253,.22)}' +
      '.mc-editor-field__control--area{min-height:88px;resize:vertical;font-family:inherit}' +
      '.mc-editor-field__hint{margin:6px 0 0;font-size:11px;line-height:1.45;color:#8b949e}' +
      '.mc-editor-field-group{margin:0 0 14px;padding:12px;border:1px solid #30363d;border-radius:10px;background:#0d1117}' +
      '.mc-editor-field-group__title{margin:0 0 4px;font-size:12px;font-weight:600}' +
      '.mc-editor-field-group__sub{margin:0 0 10px;font-size:11px;color:#8b949e;line-height:1.45}' +
      '.mc-editor-field-group__body{display:grid;gap:8px}' +
      '.mc-editor-chip-block{margin:0 0 10px}' +
      '.mc-editor-chip-block__label{font-size:11px;font-weight:600;color:#8b949e;margin:0 0 6px}' +
      '.mc-editor-chip-row{display:flex;flex-wrap:wrap;gap:6px}' +
      '.mc-editor-chip,.mc-editor-properties .mc-editor-chip-row button{min-height:30px;padding:5px 10px;margin:0;border:1px solid #30363d;background:#21262d;color:#c9d1d9;border-radius:999px;font-size:11px;font-weight:500}' +
      '.mc-editor-chip.is-active,.mc-editor-properties .mc-editor-chip-row button.is-active{border-color:#58a6ff;background:rgba(56,139,253,.16);color:#58a6ff}' +
      '.mc-editor-slider__range{width:100%;accent-color:#58a6ff}' +
      '.mc-editor-photo-preview{width:100%;max-height:160px;object-fit:contain;border-radius:10px;border:1px solid #30363d;background:#010409;margin:0 0 10px}' +
      '.mc-editor-dropzone{border:1px dashed #484f58;border-radius:10px;padding:12px;text-align:center;font-size:12px;color:#8b949e;margin:0 0 12px}' +
      '.mc-editor-media-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0 0 12px}' +
      '.mc-editor-media-grid button{padding:3px;border-radius:8px;border:1px solid #30363d;background:#21262d}' +
      '.mc-editor-media-grid img,.mc-editor-media-grid video{width:100%;height:56px;object-fit:cover;border-radius:6px;display:block}' +
      '.mc-editor-action-btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:36px;margin:0 0 8px;border:1px solid #30363d;background:#21262d;color:#e6edf3;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer}' +
      '.mc-editor-action-btn--primary{border-color:#238636;background:#238636;color:#fff}' +
      '.mc-editor-action-btn--danger{border-color:#da3633;color:#ff7b72}' +
      '.mc-editor-details{margin:0 0 12px;border:1px solid #30363d;border-radius:10px;background:#0d1117}' +
      '.mc-editor-details summary{cursor:pointer;padding:10px 12px;font-size:12px;font-weight:600;color:#c9d1d9}' +
      '.mc-editor-details__body{padding:0 12px 12px}' +
      '.mc-editor-repeater{display:grid;gap:8px;margin:0 0 12px}' +
      '.mc-editor-group-title{margin:12px 0 6px;font-size:11px;opacity:.78;letter-spacing:.06em;text-transform:uppercase;color:#8b949e}' +
      '.mc-editor-page-btn{display:flex;align-items:center;gap:8px;justify-content:flex-start;text-align:left;width:100%}' +
      '.mc-editor-help{margin:0 0 12px;border:1px solid #30363d;border-radius:10px;background:#0d1117;font-size:11px;line-height:1.5;color:#8b949e}' +
      '.mc-editor-help summary{cursor:pointer;padding:8px 10px;font-weight:600;color:#c9d1d9;list-style:none}' +
      '.mc-editor-help summary::-webkit-details-marker{display:none}' +
      '.mc-editor-help__body{padding:0 10px 10px}' +
      '.mc-editor-help__body p{margin:0 0 6px}' +
      '.mc-editor-save-status{font-size:11px;padding:4px 8px;border-radius:999px;background:#21262d;color:#8b949e;margin:0 0 10px;display:inline-block}' +
      '.mc-editor-save-status[data-status="pending"]{color:#d29922;background:rgba(210,153,34,.12)}' +
      '.mc-editor-save-status[data-status="ok"]{color:#3fb950;background:rgba(63,185,80,.12)}' +
      '.mc-editor-save-status[data-status="err"]{color:#ff7b72;background:rgba(248,81,73,.12)}' +
      '.mc-editor-save-status--toolbar{font-size:10px;margin:0 6px 0 0;padding:2px 8px;vertical-align:middle}' +
      '.mc-editor-page-search{width:100%;box-sizing:border-box;margin:0 0 10px;padding:7px 10px;border-radius:8px;border:1px solid #30363d;background:#0d1117;color:#e6edf3;font-size:12px}' +
      '.mc-editor-page-search:focus{outline:none;border-color:#58a6ff}' +
      '.mc-editor-hint-bar{padding:6px 12px;font-size:11px;color:#8b949e;background:#161b22;border-bottom:1px solid #30363d;line-height:1.45}' +
      '.mc-editor-hint-bar kbd{padding:1px 5px;border-radius:4px;border:1px solid #30363d;background:#21262d;font-size:10px;color:#c9d1d9}' +
      '.mc-editor-frame-wrap{position:relative;min-height:0}' +
      '.mc-editor-frame-loading{position:absolute;inset:0;display:grid;place-items:center;background:rgba(1,4,9,.72);color:#c9d1d9;font-size:13px;z-index:2;pointer-events:none}' +
      '.mc-editor-frame-loading[hidden]{display:none!important}' +
      '.mc-editor-empty-state{margin:0 0 14px;padding:10px 12px;border-radius:10px;border:1px solid #30363d;background:#0d1117;font-size:12px;line-height:1.55;color:#8b949e}' +
      '.mc-editor-empty-state strong{display:block;color:#e6edf3;margin-bottom:6px;font-size:12px}' +
      '.mc-editor-empty-state p{margin:0 0 4px}' +
      '.mc-editor-section-btn{font-weight:500}' +
      '.mc-editor-shell[data-preview-only="1"] .mc-editor-sidebar,.mc-editor-shell[data-preview-only="1"] .mc-editor-properties{display:none}' +
      '.mc-editor-shell[data-preview-only="1"]{grid-template-columns:1fr}';
    document.head.appendChild(st);
  }

  function editorFieldInput_(label, value, onInput, type, hint, autoFocus) {
    var wrap = document.createElement('div');
    wrap.className = 'mc-editor-field';
    var l = document.createElement('label');
    l.className = 'mc-editor-field__label';
    l.textContent = label;
    var input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    if (type && type !== 'textarea' && type !== 'text') input.type = type;
    else if (type === 'color') input.type = 'color';
    input.className = 'mc-editor-field__control' + (type === 'textarea' ? ' mc-editor-field__control--area' : '');
    input.value = value == null ? '' : String(value);
    if (autoFocus) input.setAttribute('data-editor-autofocus', '1');
    var debounceTimer = 0;
    input.addEventListener('input', function () {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(function () {
        debounceTimer = 0;
        onInput(input.value);
      }, type === 'textarea' ? 280 : 120);
    });
    wrap.appendChild(l);
    wrap.appendChild(input);
    if (hint) {
      var h = document.createElement('p');
      h.className = 'mc-editor-field__hint';
      h.textContent = hint;
      wrap.appendChild(h);
    }
    return wrap;
  }

  function editorFieldGroup_(title, subtitle) {
    var g = document.createElement('section');
    g.className = 'mc-editor-field-group';
    var h = document.createElement('h4');
    h.className = 'mc-editor-field-group__title';
    h.textContent = title;
    g.appendChild(h);
    if (subtitle) {
      var s = document.createElement('p');
      s.className = 'mc-editor-field-group__sub';
      s.textContent = subtitle;
      g.appendChild(s);
    }
    var body = document.createElement('div');
    body.className = 'mc-editor-field-group__body';
    g.appendChild(body);
    g.appendBody = function (n) {
      body.appendChild(n);
      return g;
    };
    return g;
  }

  function editorChipRow_(label, items, activeValue) {
    var wrap = document.createElement('div');
    wrap.className = 'mc-editor-chip-block';
    if (label) {
      var lb = document.createElement('div');
      lb.className = 'mc-editor-chip-block__label';
      lb.textContent = label;
      wrap.appendChild(lb);
    }
    var row = document.createElement('div');
    row.className = 'mc-editor-chip-row';
    items.forEach(function (item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mc-editor-chip';
      b.textContent = item.label;
      if (activeValue != null && String(item.value) === String(activeValue)) b.classList.add('is-active');
      b.addEventListener('click', function () {
        if (typeof item.onClick === 'function') item.onClick();
        else if (item.action) item.action();
      });
      row.appendChild(b);
    });
    wrap.appendChild(row);
    return wrap;
  }

  function editorSliderField_(label, min, max, step, value, unit, onInput) {
    var wrap = document.createElement('div');
    wrap.className = 'mc-editor-field mc-editor-slider';
    var lb = document.createElement('label');
    lb.className = 'mc-editor-field__label';
    var valNum = Number(value);
    if (valNum !== valNum) valNum = min;
    lb.textContent = label + ' · ' + valNum + (unit || '');
    var range = document.createElement('input');
    range.type = 'range';
    range.min = String(min);
    range.max = String(max);
    range.step = String(step || 1);
    range.value = String(valNum);
    range.className = 'mc-editor-slider__range';
    range.addEventListener('input', function () {
      lb.textContent = label + ' · ' + range.value + (unit || '');
      onInput(range.value);
    });
    wrap.appendChild(lb);
    wrap.appendChild(range);
    return wrap;
  }

  function editorInspectorTabs_(tabs, activeKey, onChange) {
    var bar = document.createElement('div');
    bar.className = 'mc-editor-inspector-tabs';
    bar.setAttribute('role', 'tablist');
    tabs.forEach(function (tab) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mc-editor-inspector-tab';
      b.setAttribute('role', 'tab');
      b.textContent = tab.label;
      b.setAttribute('aria-selected', tab.key === activeKey ? 'true' : 'false');
      if (tab.key === activeKey) b.classList.add('is-active');
      b.addEventListener('click', function () {
        onChange(tab.key);
      });
      bar.appendChild(b);
    });
    return bar;
  }

  function editorElementHeader_(sel) {
    var head = document.createElement('div');
    head.className = 'mc-editor-element-head';
    var meta = document.createElement('div');
    meta.className = 'mc-editor-element-head__meta';
    var tag = document.createElement('span');
    tag.className = 'mc-editor-element-head__tag';
    tag.textContent = (sel.tagName || 'NODE').toUpperCase();
    var name = document.createElement('strong');
    name.className = 'mc-editor-element-head__name';
    name.textContent = sel.editorLabel || sel.label || sel.selector || 'Selected element';
    meta.appendChild(tag);
    meta.appendChild(name);
    head.appendChild(meta);
    if (sel.editType === 'image' && sel.src) {
      var thumb = document.createElement('img');
      thumb.className = 'mc-editor-element-head__thumb';
      thumb.src = sel.src;
      thumb.alt = sel.alt || '';
      head.appendChild(thumb);
    }
    return head;
  }

  function parseEditorPx_(raw, fallback) {
    var n = parseFloat(String(raw || '').replace(/px|%|rem|em/gi, ''));
    if (n !== n) return fallback == null ? 0 : fallback;
    return n;
  }

  function inferEditorSectionFromElement_(payload) {
    var sel = String((payload && payload.selector) || '').toLowerCase();
    var label = String((payload && payload.editorLabel) || '').toLowerCase();
    var blob = sel + ' ' + label;
    if (/mcwelcomehero|welcomecontenttitle|welcomecontentlead|welcomeherobadge|hero-title|hero-subtitle|c-hero/.test(blob)) {
      return 'hero';
    }
    if (/welcomegate|entry-mode|welcome-gate|entry-card/.test(blob)) return 'entry';
    if (/coverflow|specimen-coverflow|mcspecimen|satcoverflow/.test(blob)) return 'coverflow';
    if (/mchero3d|hero-specimen|tumbler|specimen-card-wrapper/.test(blob)) return 'specimenCard';
    if (/workflow|quest-card|welcomecontentfeatures|workflow-title/.test(blob)) return 'workflow';
    if (/grading|grade/.test(blob)) return 'grading';
    return null;
  }

  function scrollIframeToEditorSection_(frame, sectionId) {
    if (!frame) return;
    var targets = {
      hero: ['#mcWelcomeHero', '#welcomeContentTitle'],
      entry: ['#welcomeGateSection'],
      coverflow: ['#mcSpecimenCoverflow', '#satCoverflowSection', '.specimen-coverflow-section'],
      specimenCard: ['#mcHero3dTumbler', '#mcHero3d'],
      workflow: ['#welcomeWorkflowSection', '#welcomeContentFeatures'],
      grading: ['.welcome-grading-section', '[data-section="grading"]'],
    };
    var list = targets[sectionId] || [];
    try {
      var doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
      if (!doc) return;
      for (var i = 0; i < list.length; i++) {
        var el = doc.querySelector(list[i]);
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
    } catch (eScroll) {
      void 0;
    }
  }

  function editorEmptyStateGuide_(title, lines) {
    var box = document.createElement('div');
    box.className = 'mc-editor-empty-state';
    var h = document.createElement('strong');
    h.textContent = title || '操作提示';
    box.appendChild(h);
    (lines || []).forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      box.appendChild(p);
    });
    return box;
  }

  function updatePreview(config) {
    var frame = document.getElementById('mcEditorFrame');
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ type: 'MC_EDITOR_APPLY_CONFIG', config: config }, '*');
    frame.contentWindow.postMessage({ type: 'MC_EDITOR_CONFIG_UPDATE', config: config }, '*');
  }

  function patchPreviewCoverflowField_(frame, cfIndex, cfField, value) {
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      {
        type: 'MC_EDITOR_PATCH_COVERFLOW_FIELD',
        payload: { cfIndex: cfIndex, cfField: cfField, value: value },
      },
      '*'
    );
  }

  function patchPreviewText_(frame, selector, value) {
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      {
        type: 'MC_EDITOR_PATCH_TEXT',
        payload: { selector: selector, value: value },
      },
      '*'
    );
  }

  function stableSelectorForNode_(el) {
    if (!el || !el.tagName) return '';
    if (el.id) return '#' + el.id;
    var di = el.getAttribute && el.getAttribute('data-i18n');
    if (di) return '[data-i18n="' + di + '"]';
    var cls = (el.className && String(el.className).trim()) || '';
    if (cls) {
      var first = cls.split(/\s+/)[0];
      if (first) {
        var shortSel = el.tagName.toLowerCase() + '.' + first;
        try {
          if (document.querySelectorAll(shortSel).length === 1) return shortSel;
        } catch (eShort) {
          void 0;
        }
      }
    }
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      var tag = node.tagName.toLowerCase();
      var parent = node.parentElement;
      if (!parent) {
        parts.unshift(tag);
        break;
      }
      var sib = parent.children;
      var idx = 1;
      for (var i = 0; i < sib.length; i++) {
        if (sib[i] === node) {
          idx = i + 1;
          break;
        }
      }
      parts.unshift(tag + ':nth-child(' + idx + ')');
      if (parent.id) {
        parts.unshift('#' + parent.id);
        break;
      }
      node = parent;
      depth += 1;
    }
    return parts.join(' > ');
  }

  function scanPreviewEditableElements_() {
    var frame = document.getElementById('mcEditorFrame');
    if (!frame) return [];
    var doc = null;
    try {
      doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
    } catch (eDoc) {
      return [];
    }
    if (!doc) return [];
    var results = [];
    var seen = {};
    var textNodes = doc.querySelectorAll(
      '#mcWelcomeHero h1, #mcWelcomeHero h2, #mcWelcomeHero h3, #mcWelcomeHero p, #mcWelcomeHero .c-hero__badgeTxt, #welcomeContentTitle, #welcomeContentLead, #welcomeLandingPage h1, #welcomeLandingPage h2, #welcomeLandingPage h3, #welcomeLandingPage p, .welcome-museum-landing h1, .welcome-museum-landing h2, .welcome-museum-landing p, #welcomeGateSection h2, #welcomeGateSection h3, #welcomeGateSection .entry-mode-label, #welcomeGateSection .entry-mode-intro, .workflow-quest-section h2, .workflow-quest-section h3, .workflow-quest-section .quest-card__instruction, .specimen-coverflow-section h2, .specimen-coverflow-header span, #welcomeMuseumBody .c-hero__title, #welcomeMuseumBody .c-hero__lead'
    );
    for (var i = 0; i < textNodes.length; i++) {
      var tEl = textNodes[i];
      var text = String((tEl.textContent || '').replace(/\s+/g, ' ').trim());
      if (!text || text.length < 2) continue;
      var sel = stableSelectorForNode_(tEl);
      if (!sel || seen[sel]) continue;
      seen[sel] = 1;
      results.push({ type: 'text', selector: sel, text: text, label: text.slice(0, 72) });
    }
    var imgs = doc.querySelectorAll('#welcomeMuseumBody img, #welcomeMuseumBody video, #mcWelcomeHero img, #mcWelcomeHero video, #welcomeLandingPage img, #welcomeLandingPage video');
    for (var j = 0; j < imgs.length; j++) {
      var m = imgs[j];
      var src = m.getAttribute('src') || '';
      if (!src && m.tagName && m.tagName.toLowerCase() === 'video') {
        var s = m.querySelector('source');
        src = (s && s.getAttribute('src')) || '';
      }
      if (!src) continue;
      var selm = stableSelectorForNode_(m);
      if (!selm || seen[selm]) continue;
      seen[selm] = 1;
      results.push({ type: 'media', selector: selm, src: src, label: '[' + m.tagName.toLowerCase() + '] ' + src.slice(0, 72) });
    }
    return results.slice(0, 120);
  }

  function scanPreviewSectionTargets_() {
    var frame = document.getElementById('mcEditorFrame');
    if (!frame) return { items: [], error: 'Preview iframe not found.' };
    var doc = null;
    try {
      doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
    } catch (eDoc) {
      return { items: [], error: 'Cannot access preview iframe (cross-origin).' };
    }
    if (!doc) return { items: [], error: 'Preview iframe is not ready.' };
    var out = [];
    var seen = {};
    var nodes = doc.querySelectorAll(
      'main > section, section[id], main[id], [data-section], [data-welcome-login-section], [id^="welcome"], [id^="lp"], div[id]'
    );
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var rect = null;
      try {
        rect = n.getBoundingClientRect();
      } catch (eRect) {
        rect = null;
      }
      if (rect && (rect.width < 260 || rect.height < 80)) continue;
      var sel = n.id ? ('#' + n.id) : stableSelectorForNode_(n);
      if (!sel || seen[sel]) continue;
      seen[sel] = 1;
      var label = (n.getAttribute('aria-label') || n.getAttribute('aria-labelledby') || n.id || n.className || sel || '').toString();
      out.push({ selector: sel, label: label.slice(0, 88), tag: (n.tagName || '').toLowerCase() });
    }
    return { items: out.slice(0, 160), error: '' };
  }

  function editorTemplateLibrary_() {
    var descLabel = String(wmCopy('editorTplDesc')).replace(/</g, '&lt;');
    return [
      {
        key: 'hero-simple',
        label: 'Hero — Simple split',
        html:
          '<section class="mc-editor-template hero-simple" style="padding:48px 24px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:linear-gradient(160deg,#0b1416,#091019)"><h2 style="margin:0 0 12px">Template Hero Title</h2><p style="margin:0 0 18px;opacity:.82">Template hero description.</p><button type="button" style="padding:10px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:#132126;color:#f4efe1">Primary Action</button></section>',
      },
      {
        key: 'cards-3',
        label: 'Cards — 3 columns',
        html:
          '<section class="mc-editor-template cards-3" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px"><article style="padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:12px"><h3 style="margin:0 0 8px">Card A</h3><p style="margin:0;opacity:.8">' +
          descLabel +
          '</p></article><article style="padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:12px"><h3 style="margin:0 0 8px">Card B</h3><p style="margin:0;opacity:.8">' +
          descLabel +
          '</p></article><article style="padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:12px"><h3 style="margin:0 0 8px">Card C</h3><p style="margin:0;opacity:.8">' +
          descLabel +
          '</p></article></section>',
      },
      {
        key: 'cta-band',
        label: 'CTA band',
        html:
          '<section class="mc-editor-template cta-band" style="padding:24px;border:1px solid rgba(255,255,255,.14);border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:14px"><div><h3 style="margin:0 0 6px">Call to action</h3><p style="margin:0;opacity:.82">Explain the benefit in one sentence.</p></div><button type="button" style="padding:10px 16px;border-radius:999px;border:0;background:#9fd9bb;color:#04100d;font-weight:700">Get Started</button></section>',
      },
      {
        key: 'faq',
        label: 'FAQ block',
        html:
          '<section class="mc-editor-template faq"><details open><summary>Question 1</summary><p>Answer 1</p></details><details><summary>Question 2</summary><p>Answer 2</p></details><details><summary>Question 3</summary><p>Answer 3</p></details></section>',
      },
    ];
  }

  function buildEditorPanelFields_(state) {
    var host = document.querySelector('[data-editor-fields]');
    var ttl = document.querySelector('[data-editor-panel-title]');
    if (!host || !ttl) return;
    state.config = normalizeEditorConfig_(state.config);
    host.innerHTML = '';
    var section = state.activeSection || state.section;
    ttl.textContent = state.sectionNames[section] || section;
    var cfg = state.config;
    var pageCfg = getActivePageConfig_(cfg);
    function push(n) {
      host.appendChild(n);
    }
    function upsertBySelector_(arr, selector, valueObj) {
      var s = String(selector || '').trim();
      if (!s) return;
      var idx = -1;
      for (var i = 0; i < arr.length; i++) {
        if (String(arr[i].selector || '').trim() === s) {
          idx = i;
          break;
        }
      }
      if (idx < 0) arr.push(valueObj);
      else arr[idx] = mergeEditorConfig_(arr[idx], valueObj);
    }
    function getStyleOverrideForSel_(selector) {
      if (!Array.isArray(pageCfg.styleOverrides)) pageCfg.styleOverrides = [];
      for (var si = 0; si < pageCfg.styleOverrides.length; si++) {
        if (String((pageCfg.styleOverrides[si] && pageCfg.styleOverrides[si].selector) || '') === String(selector || '')) {
          return pageCfg.styleOverrides[si];
        }
      }
      return null;
    }
    function resolveStyleValue_(sel, cssProp, styleKey) {
      var row = getStyleOverrideForSel_(sel.selector);
      var override = row && row.styles ? row.styles[styleKey] : '';
      if (override != null && String(override).trim() !== '') return String(override);
      var cs = (sel && sel.computedStyle) || {};
      var computed = cs[styleKey] || cs[cssProp] || '';
      return computed == null ? '' : String(computed);
    }
    function updateSelectedStyle_(sel, styleKey, value) {
      if (!sel || !sel.selector) return;
      if (!Array.isArray(pageCfg.styleOverrides)) pageCfg.styleOverrides = [];
      var row = getStyleOverrideForSel_(sel.selector);
      if (!row) {
        row = { id: 'style_' + Date.now().toString(36), selector: sel.selector, styles: {} };
        pageCfg.styleOverrides.push(row);
      }
      if (!row.styles || typeof row.styles !== 'object') row.styles = {};
      if (value == null || String(value).trim() === '') delete row.styles[styleKey];
      else row.styles[styleKey] = value;
      if (!Object.keys(row.styles).length) {
        pageCfg.styleOverrides = pageCfg.styleOverrides.filter(function (r) { return r !== row; });
      }
      saveEditorConfig(state.config);
      state.render();
    }
    function applyStylePreset_(sel, styles) {
      if (!sel || !styles) return;
      Object.keys(styles).forEach(function (k) {
        updateSelectedStyle_(sel, k, styles[k]);
      });
      buildEditorPanelFields_(state);
    }
    function getBackgroundOverrideForSel_(selector) {
      if (!Array.isArray(pageCfg.backgroundOverrides)) pageCfg.backgroundOverrides = [];
      for (var bi = 0; bi < pageCfg.backgroundOverrides.length; bi++) {
        if (String((pageCfg.backgroundOverrides[bi] && pageCfg.backgroundOverrides[bi].selector) || '') === String(selector || '')) {
          return pageCfg.backgroundOverrides[bi];
        }
      }
      return null;
    }
    function updateSelectedBackground_(sel, patch) {
      if (!sel || !sel.selector) return;
      if (!Array.isArray(pageCfg.backgroundOverrides)) pageCfg.backgroundOverrides = [];
      var row = getBackgroundOverrideForSel_(sel.selector);
      if (!row) {
        row = {
          id: 'bg_' + Date.now().toString(36),
          selector: sel.selector,
          type: 'none',
          imageSrc: '',
          videoSrc: '',
          posterSrc: '',
          backgroundColor: '',
          overlayColor: 'rgba(0,0,0,0.45)',
          overlayOpacity: 45,
          blur: 0,
          brightness: 1,
          saturation: 1,
          contrast: 1,
          fit: 'cover',
          position: 'center center',
          repeat: 'no-repeat',
          attachment: 'scroll',
          playbackRate: 1,
          enabled: true,
        };
        pageCfg.backgroundOverrides.push(row);
      }
      Object.keys(patch || {}).forEach(function (k) {
        row[k] = patch[k];
      });
      saveEditorConfig(state.config);
      state.render();
    }
    if (state.activeInspectorMode === 'selected') {
      ttl.textContent = '元素屬性';
      var sel = state.selectedElement;
      if (!sel || !sel.selector) {
        var empty = document.createElement('p');
        empty.textContent = '未選取元素';
        push(empty);
        return;
      }
      function defaultInspectorTab_() {
        if (sel.editType === 'image') return 'photo';
        if (sel.editType === 'text' || sel.editType === 'link') return 'content';
        return 'layout';
      }
      if (!state.inspectorTab || state._inspectorTabFor !== sel.selector) {
        state.inspectorTab = defaultInspectorTab_();
        state._inspectorTabFor = sel.selector;
      }
      var inspTab = state.inspectorTab;
      push(editorElementHeader_(sel));
      push(
        editorInspectorTabs_(
          [
            { key: 'content', label: '文字' },
            { key: 'layout', label: '版型' },
            { key: 'photo', label: '照片' },
            { key: 'style', label: '樣式' },
          ],
          inspTab,
          function (k) {
            state.inspectorTab = k;
            buildEditorPanelFields_(state);
          }
        )
      );
      if (!Array.isArray(pageCfg.textOverrides)) pageCfg.textOverrides = [];
      if (!Array.isArray(pageCfg.mediaOverrides)) pageCfg.mediaOverrides = [];
      if (!Array.isArray(pageCfg.linkOverrides)) pageCfg.linkOverrides = [];
      if (!Array.isArray(pageCfg.styleOverrides)) pageCfg.styleOverrides = [];
      if (!Array.isArray(pageCfg.backgroundOverrides)) pageCfg.backgroundOverrides = [];
      if (!Array.isArray(pageCfg.htmlOverrides)) pageCfg.htmlOverrides = [];
      if (!Array.isArray(pageCfg.hiddenElements)) pageCfg.hiddenElements = [];
      if (inspTab === 'content') {
        if (sel.editType === 'coverflowField' || sel.cfField) {
          push(
            editorFieldInput_(
              coverflowFieldLabel_(sel.cfField) + '（標本 #' + (Number(sel.cfIndex) + 1 || 1) + '）',
              sel.text || '',
              function (v) {
                state.config = applyCoverflowFieldUpdate_(state.config, sel.cfIndex, sel.cfField, v);
                state.section = 'coverflow';
                state.activeSection = 'coverflow';
                state.render();
              },
              'textarea',
              '此欄位會寫入「典藏牆」資料；儲存後卡片會重新載入。',
              true
            )
          );
        } else if (sel.editType === 'text' || sel.editType === 'link') {
          push(editorFieldInput_('文字內容', sel.text || '', function (v) {
            upsertBySelector_(pageCfg.textOverrides, sel.selector, {
              id: 'override_text_' + Date.now().toString(36),
              selector: sel.selector,
              property: 'textContent',
              text: v,
              value: v,
            });
            state.render();
          }, 'textarea', '只改純文字；不會改動 HTML 結構。標本卡內文請用左側 Coverflow 區塊編輯。', true));
        } else if (sel.editType === 'container' || sel.editType === 'section' || sel.editType === 'component') {
          var blockHint = document.createElement('p');
          blockHint.className = 'mc-editor-field__hint';
          blockHint.textContent =
            '這是容器或互動元件，不能直接改「文字內容」（會破壞內部結構）。請選標題、段落、按鈕文字，或使用左側區塊面板。';
          push(blockHint);
        } else {
          var contentHint = document.createElement('p');
          contentHint.className = 'mc-editor-field__hint';
          contentHint.textContent = '此元素沒有可直接編輯的文字。請選文字、標題、按鈕或連結。';
          push(contentHint);
        }
      if (sel.editType === 'text') {
        var inlineBtn = document.createElement('button');
        inlineBtn.type = 'button';
        inlineBtn.className = 'mc-editor-action-btn mc-editor-action-btn--primary';
        inlineBtn.textContent = '在預覽中直接編輯（雙擊 / F2）';
        inlineBtn.addEventListener('click', function () {
          var fr = document.getElementById('mcEditorFrame');
          if (fr && fr.contentWindow) {
            fr.contentWindow.postMessage({ type: 'MC_EDITOR_BEGIN_INLINE_TEXT', payload: { selector: sel.selector } }, '*');
          }
        });
        push(inlineBtn);
        var typoGroup = document.createElement('div');
        typoGroup.className = 'mc-editor-field-group';
        var typoTitle = document.createElement('h4');
        typoTitle.className = 'mc-editor-field-group__title';
        typoTitle.textContent = '字型與對齊';
        typoGroup.appendChild(typoTitle);
        var typoBody = document.createElement('div');
        typoBody.className = 'mc-editor-field-group__body';
        function chipRowContent_(label, buttons) {
          typoBody.appendChild(
            editorChipRow_(
              label,
              buttons.map(function (item) {
                return { label: item[0], action: function () { applyStylePreset_(sel, item[1]); } };
              })
            )
          );
        }
        chipRowContent_('對齊', [
          ['左', { textAlign: 'left' }],
          ['中', { textAlign: 'center' }],
          ['右', { textAlign: 'right' }],
        ]);
        chipRowContent_('字重', [
          ['標準', { fontWeight: '400' }],
          ['半粗', { fontWeight: '600' }],
          ['粗體', { fontWeight: '700' }],
        ]);
        chipRowContent_('字級', [
          ['14', { fontSize: '14px' }],
          ['16', { fontSize: '16px' }],
          ['20', { fontSize: '20px' }],
          ['28', { fontSize: '28px' }],
        ]);
        typoGroup.appendChild(typoBody);
        push(typoGroup);
      }
      if (sel.tagName === 'A' || sel.editType === 'link') {
        push(editorFieldInput_('連結文字', sel.text || '', function (v) {
          upsertBySelector_(pageCfg.linkOverrides, sel.selector, {
            id: 'override_link_' + Date.now().toString(36),
            selector: sel.selector,
            text: v,
            href: sel.href || '#',
            target: sel.target || '_self',
          });
          state.render();
        }));
        push(editorFieldInput_('連結 URL', sel.href || '', function (v) {
          upsertBySelector_(pageCfg.linkOverrides, sel.selector, {
            id: 'override_link_' + Date.now().toString(36),
            selector: sel.selector,
            text: sel.text || '',
            href: v,
            target: sel.target || '_self',
          });
          state.render();
        }, 'text', '例：https:// 或 #section-id'));
      }
      }
      if (inspTab === 'photo') {
        if (sel.editType !== 'image') {
          var photoHint = document.createElement('p');
          photoHint.className = 'mc-editor-field__hint';
          photoHint.textContent = '請在預覽中點選 img 或 video 元素，才能微調照片。';
          push(photoHint);
        } else {
          if (sel.src) {
            var photoPreview = document.createElement('img');
            photoPreview.className = 'mc-editor-photo-preview';
            photoPreview.src = sel.src;
            photoPreview.alt = sel.alt || '';
            push(photoPreview);
          }
          push(
            editorFieldInput_(
              (sel.tagName || '').toUpperCase() === 'VIDEO' ? '影片 / 圖片 URL' : '圖片 URL',
              sel.src || '',
              function (v) {
                upsertBySelector_(pageCfg.mediaOverrides, sel.selector, {
                  id: 'override_media_' + Date.now().toString(36),
                  selector: sel.selector,
                  property: 'src',
                  value: v,
                  alt: sel.alt || '',
                });
                state.render();
              },
              'text',
              '貼上網址，或下方上傳／拖放替換。'
            )
          );
          push(
            editorFieldInput_('替代文字 Alt', sel.alt || '', function (v) {
              upsertBySelector_(pageCfg.mediaOverrides, sel.selector, {
                id: 'override_media_' + Date.now().toString(36),
                selector: sel.selector,
                property: 'src',
                value: sel.src || '',
                alt: v,
              });
              state.render();
            })
          );
        var fileWrap = document.createElement('div');
        var fileLabel = document.createElement('label');
        fileLabel.textContent = '上傳圖片';
        fileLabel.className = 'mc-editor-field__label';
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        function readAndStoreImage_(file) {
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function () {
            var src = String(reader.result || '');
            if (!src) return;
            upsertBySelector_(pageCfg.mediaOverrides, sel.selector, {
              id: 'override_media_' + Date.now().toString(36),
              selector: sel.selector,
              property: 'src',
              value: src,
              alt: sel.alt || '',
            });
            if (!Array.isArray(cfg.project.sharedMediaLibrary)) cfg.project.sharedMediaLibrary = [];
            cfg.project.sharedMediaLibrary.push({
              id: 'media_' + Date.now().toString(36),
              name: file.name || 'upload.jpg',
              type: file.type || 'image/jpeg',
              kind: 'image',
              src: src,
              createdAt: Date.now(),
              size: Number(file.size || 0),
            });
            state.render();
            buildEditorPanelFields_(state);
          };
          reader.readAsDataURL(file);
        }
        fileInput.addEventListener('change', function () {
          var f = fileInput.files && fileInput.files[0];
          readAndStoreImage_(f);
        });
        fileWrap.appendChild(fileLabel);
        fileWrap.appendChild(fileInput);
        push(fileWrap);
        var drop = document.createElement('div');
        drop.className = 'mc-editor-dropzone';
        drop.textContent = '拖放圖片到這裡替換';
        drop.addEventListener('dragover', function (e) {
          e.preventDefault();
        });
        drop.addEventListener('drop', function (e) {
          e.preventDefault();
          var f0 = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          readAndStoreImage_(f0);
        });
        push(drop);
        if (Array.isArray(cfg.project.sharedMediaLibrary) && cfg.project.sharedMediaLibrary.length) {
          var mediaGrid = document.createElement('div');
          mediaGrid.className = 'mc-editor-media-grid';
          for (var mli = 0; mli < cfg.project.sharedMediaLibrary.length; mli++) {
            (function (mItem, mIdx) {
              var thumb = document.createElement('button');
              thumb.type = 'button';
              thumb.style.padding = '4px';
              thumb.style.borderRadius = '8px';
              thumb.style.border = '1px solid rgba(255,255,255,.12)';
              var im = document.createElement('img');
              im.src = mItem.src;
              im.alt = mItem.name || '';
              im.style.width = '100%';
              im.style.height = '64px';
              im.style.objectFit = 'cover';
              thumb.appendChild(im);
              thumb.addEventListener('click', function () {
                upsertBySelector_(pageCfg.mediaOverrides, sel.selector, {
                  id: 'override_media_' + Date.now().toString(36),
                  selector: sel.selector,
                  property: 'src',
                  value: mItem.src,
                  alt: sel.alt || '',
                });
                state.render();
              });
              mediaGrid.appendChild(thumb);
            })(cfg.project.sharedMediaLibrary[mli], mli);
          }
          push(mediaGrid);
        }
        var fitNow = resolveStyleValue_(sel, 'objectFit', 'objectFit') || 'cover';
        push(
          editorChipRow_('裁切方式', [
            { label: 'Cover', value: 'cover', action: function () { updateSelectedStyle_(sel, 'objectFit', 'cover'); buildEditorPanelFields_(state); } },
            { label: 'Contain', value: 'contain', action: function () { updateSelectedStyle_(sel, 'objectFit', 'contain'); buildEditorPanelFields_(state); } },
            { label: 'Fill', value: 'fill', action: function () { updateSelectedStyle_(sel, 'objectFit', 'fill'); buildEditorPanelFields_(state); } },
          ], fitNow)
        );
        push(
          editorChipRow_('焦點位置', [
            { label: '↖', action: function () { updateSelectedStyle_(sel, 'objectPosition', '0% 0%'); } },
            { label: '↑', action: function () { updateSelectedStyle_(sel, 'objectPosition', '50% 0%'); } },
            { label: '↗', action: function () { updateSelectedStyle_(sel, 'objectPosition', '100% 0%'); } },
            { label: '←', action: function () { updateSelectedStyle_(sel, 'objectPosition', '0% 50%'); } },
            { label: '●', action: function () { updateSelectedStyle_(sel, 'objectPosition', '50% 50%'); } },
            { label: '→', action: function () { updateSelectedStyle_(sel, 'objectPosition', '100% 50%'); } },
            { label: '↙', action: function () { updateSelectedStyle_(sel, 'objectPosition', '0% 100%'); } },
            { label: '↓', action: function () { updateSelectedStyle_(sel, 'objectPosition', '50% 100%'); } },
            { label: '↘', action: function () { updateSelectedStyle_(sel, 'objectPosition', '100% 100%'); } },
          ])
        );
        push(
          editorSliderField_('旋轉', -12, 12, 1, 0, '°', function (v) {
            updateSelectedStyle_(sel, 'transform', 'rotate(' + Number(v || 0) + 'deg)');
          })
        );
        }
      }
      if (inspTab === 'layout') {
      var layoutGroup = document.createElement('div');
      layoutGroup.className = 'mc-editor-field-group';
      var layoutTitle = document.createElement('h4');
      layoutTitle.className = 'mc-editor-field-group__title';
      layoutTitle.textContent = '尺寸與間距';
      layoutGroup.appendChild(layoutTitle);
      var layoutBody = document.createElement('div');
      layoutBody.className = 'mc-editor-field-group__body';
      var widthNow = resolveStyleValue_(sel, 'width', 'width');
      layoutBody.appendChild(editorFieldInput_('寬度 Width（目前 ' + widthNow + '）', widthNow, function (v) {
        if (/^\d+$/.test(String(v || '').trim())) v = String(v).trim() + 'px';
        updateSelectedStyle_(sel, 'width', v);
        if (/^\d+px$/.test(String(v || '')) && Number(String(v).replace('px', '')) > 1200) {
          state.designWarning = 'Large fixed width may break mobile layout. Consider max-width or width: 100%.';
        }
      }));
      var heightKey = sel.editType === 'section' ? 'minHeight' : 'height';
      var heightNow = resolveStyleValue_(sel, 'height', heightKey);
      layoutBody.appendChild(editorFieldInput_('高度 Height（目前 ' + heightNow + '）', heightNow, function (v) {
        if (/^\d+$/.test(String(v || '').trim())) v = String(v).trim() + 'px';
        updateSelectedStyle_(sel, heightKey, v);
      }));
      var pt = resolveStyleValue_(sel, 'paddingTop', 'paddingTop');
      var pb = resolveStyleValue_(sel, 'paddingBottom', 'paddingBottom');
      layoutBody.appendChild(editorFieldInput_('內距 Padding Top（目前 ' + pt + '）', pt, function (v) {
        if (/^\d+$/.test(String(v || '').trim())) v = String(v).trim() + 'px';
        updateSelectedStyle_(sel, 'paddingTop', v);
      }));
      layoutBody.appendChild(editorFieldInput_('內距 Padding Bottom（目前 ' + pb + '）', pb, function (v) {
        if (/^\d+$/.test(String(v || '').trim())) v = String(v).trim() + 'px';
        updateSelectedStyle_(sel, 'paddingBottom', v);
      }));
      layoutBody.appendChild(editorFieldInput_('外距 Margin（建議 Tight 8 / Normal 16 / Comfortable 24 / Spacious 48）', resolveStyleValue_(sel, 'margin', 'margin'), function (v) {
        if (/^\d+$/.test(String(v || '').trim())) v = String(v).trim() + 'px';
        updateSelectedStyle_(sel, 'margin', v);
      }));
      var spacingChips = document.createElement('div');
      [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 120].forEach(function (n) {
        var c = document.createElement('button');
        c.type = 'button';
        c.textContent = n + 'px';
        c.addEventListener('click', function () {
          updateSelectedStyle_(sel, 'paddingTop', n + 'px');
          updateSelectedStyle_(sel, 'paddingRight', n + 'px');
          updateSelectedStyle_(sel, 'paddingBottom', n + 'px');
          updateSelectedStyle_(sel, 'paddingLeft', n + 'px');
        });
        spacingChips.appendChild(c);
      });
      layoutBody.appendChild(spacingChips);
      layoutGroup.appendChild(layoutBody);
      push(layoutGroup);
      push(
        editorChipRow_('最大寬度', [
          { label: '640', action: function () { applyStylePreset_(sel, { maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }); } },
          { label: '960', action: function () { applyStylePreset_(sel, { maxWidth: '960px', marginLeft: 'auto', marginRight: 'auto' }); } },
          { label: '1200', action: function () { applyStylePreset_(sel, { maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }); } },
          { label: '全寬', action: function () { applyStylePreset_(sel, { maxWidth: '100%', width: '100%' }); } },
        ])
      );
      }
      if (inspTab === 'style') {
      var sugg = document.createElement('div');
      sugg.className = 'mc-editor-field-group';
      var suggTitle = document.createElement('h4');
      suggTitle.className = 'mc-editor-field-group__title';
      suggTitle.textContent = '快速樣式';
      sugg.appendChild(suggTitle);
      var suggBody = document.createElement('div');
      suggBody.className = 'mc-editor-field-group__body';
      var suggestions = [];
      if (sel.editType === 'section') {
        suggestions = [
          { label: '區塊上下留白', styles: { paddingTop: '96px', paddingBottom: '96px' } },
          { label: '典藏深綠底', styles: { backgroundColor: 'rgba(7,16,13,0.92)' } },
          { label: '置中容器', styles: { marginLeft: 'auto', marginRight: 'auto', maxWidth: '1200px' } },
        ];
      } else if (sel.editType === 'image') {
        suggestions = [
          { label: '博物館相框', styles: { borderRadius: '24px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(214,194,122,0.55)', boxShadow: '0 24px 70px rgba(0,0,0,0.36)' } },
          { label: '完整顯示', styles: { objectFit: 'contain', objectPosition: '50% 50%' } },
          { label: '填滿裁切', styles: { objectFit: 'cover' } },
        ];
      } else if (sel.editType === 'text') {
        suggestions = [
          { label: '提升可讀性', styles: { lineHeight: '1.6', letterSpacing: '0.02em' } },
          { label: '標題強調', styles: { fontWeight: '700', color: '#f4f0e6' } },
          { label: '內文淡化', styles: { color: 'rgba(244,240,230,0.72)' } },
        ];
      } else {
        suggestions = [
          { label: '典藏卡片', styles: { borderRadius: '28px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(214,194,122,0.28)', backgroundColor: 'rgba(7,16,13,0.72)', boxShadow: '0 24px 80px rgba(0,0,0,0.42)', overflow: 'hidden' } },
          { label: '玻璃面板', styles: { backgroundColor: 'rgba(0,0,0,0.42)', borderColor: 'rgba(255,255,255,0.12)', borderStyle: 'solid', borderWidth: '1px', backdropFilter: 'blur(20px)' } },
        ];
      }
      suggestions.forEach(function (s) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mc-editor-chip';
        b.textContent = s.label;
        b.addEventListener('click', function () {
          applyStylePreset_(sel, s.styles);
        });
        suggBody.appendChild(b);
      });
      sugg.appendChild(suggBody);
      push(sugg);
      var borderGroup = document.createElement('details');
      borderGroup.className = 'mc-editor-details';
      borderGroup.innerHTML = '<summary style="cursor:pointer;margin:8px 0">Border / 邊框</summary>';
      var borderBody = document.createElement('div');
      borderBody.appendChild(editorFieldInput_('邊框寬度 Border Width（建議 1px）', resolveStyleValue_(sel, 'borderTopWidth', 'borderWidth'), function (v) {
        if (/^\d+$/.test(String(v || '').trim())) v = String(v).trim() + 'px';
        updateSelectedStyle_(sel, 'borderWidth', v);
      }));
      borderBody.appendChild(editorFieldInput_('邊框樣式 Border Style', resolveStyleValue_(sel, 'borderStyle', 'borderStyle'), function (v) {
        updateSelectedStyle_(sel, 'borderStyle', v);
      }));
      borderBody.appendChild(editorFieldInput_('邊框顏色 Border Color', resolveStyleValue_(sel, 'borderColor', 'borderColor'), function (v) {
        updateSelectedStyle_(sel, 'borderColor', v);
      }));
      borderBody.appendChild(editorFieldInput_('圓角 Radius（建議卡片 20–32）', resolveStyleValue_(sel, 'borderRadius', 'borderRadius'), function (v) {
        if (/^\d+$/.test(String(v || '').trim())) v = String(v).trim() + 'px';
        updateSelectedStyle_(sel, 'borderRadius', v);
      }));
      var borderPresets = [
        { label: 'None', styles: { borderWidth: '0', borderStyle: 'none' } },
        { label: 'Hairline Museum', styles: { borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(214, 194, 122, 0.22)' } },
        { label: 'Soft Card', styles: { borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(180, 255, 210, 0.16)' } },
        { label: 'Premium Gold', styles: { borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(214, 194, 122, 0.55)' } },
        { label: 'Glass Panel', styles: { borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.12)' } },
        { label: 'Strong Frame', styles: { borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(214, 194, 122, 0.75)' } },
      ];
      borderPresets.forEach(function (bp) {
        var bpb = document.createElement('button');
        bpb.type = 'button';
        bpb.textContent = bp.label;
        bpb.addEventListener('click', function () { applyStylePreset_(sel, bp.styles); });
        borderBody.appendChild(bpb);
      });
      [
        { label: 'Sharp 0', v: '0px' },
        { label: 'Small 8', v: '8px' },
        { label: 'Card 16', v: '16px' },
        { label: 'Premium 24', v: '24px' },
        { label: 'Soft 32', v: '32px' },
        { label: 'Pill 999', v: '999px' },
      ].forEach(function (rp) {
        var rb = document.createElement('button');
        rb.type = 'button';
        rb.textContent = rp.label;
        rb.addEventListener('click', function () { updateSelectedStyle_(sel, 'borderRadius', rp.v); });
        borderBody.appendChild(rb);
      });
      borderGroup.appendChild(borderBody);
      push(borderGroup);
      var bgGroup = document.createElement('details');
      bgGroup.innerHTML = '<summary style="cursor:pointer;margin:8px 0">Background / Effects / 顏色與陰影</summary>';
      var bgBody = document.createElement('div');
      bgBody.appendChild(editorFieldInput_('背景色 Background（目前 ' + resolveStyleValue_(sel, 'backgroundColor', 'backgroundColor') + '）', resolveStyleValue_(sel, 'backgroundColor', 'backgroundColor'), function (v) {
        updateSelectedStyle_(sel, 'backgroundColor', v);
      }));
      bgBody.appendChild(editorFieldInput_('文字色 Text Color', resolveStyleValue_(sel, 'color', 'color'), function (v) {
        updateSelectedStyle_(sel, 'color', v);
      }));
      bgBody.appendChild(editorFieldInput_('陰影 Shadow', resolveStyleValue_(sel, 'boxShadow', 'boxShadow'), function (v) {
        updateSelectedStyle_(sel, 'boxShadow', v);
      }));
      bgBody.appendChild(editorFieldInput_('透明度 Opacity', resolveStyleValue_(sel, 'opacity', 'opacity'), function (v) {
        updateSelectedStyle_(sel, 'opacity', v);
      }));
      [
        { label: 'Ivory', v: '#f4f0e6' },
        { label: 'Muted Ivory', v: 'rgba(244,240,230,0.72)' },
        { label: 'Museum Green', v: '#38d39f' },
        { label: 'Gold', v: '#d6c27a' },
        { label: 'Warning', v: '#ffcc66' },
        { label: 'Soft Gray', v: 'rgba(255,255,255,0.55)' },
      ].forEach(function (cp) {
        var cb = document.createElement('button');
        cb.type = 'button';
        cb.textContent = cp.label;
        cb.addEventListener('click', function () { updateSelectedStyle_(sel, 'color', cp.v); });
        bgBody.appendChild(cb);
      });
      var shadowPresets = [
        { label: 'None', v: 'none' },
        { label: 'Soft', v: '0 12px 32px rgba(0,0,0,0.22)' },
        { label: 'Floating Card', v: '0 24px 70px rgba(0,0,0,0.36)' },
        { label: 'Museum Glow', v: '0 0 0 1px rgba(214,194,122,0.18), 0 24px 80px rgba(0,0,0,0.45)' },
        { label: 'Deep Premium', v: '0 30px 100px rgba(0,0,0,0.55)' },
        { label: 'Green Aura', v: '0 0 40px rgba(56,211,159,0.18), 0 24px 80px rgba(0,0,0,0.42)' },
        { label: 'Gold Focus', v: '0 0 32px rgba(214,194,122,0.28), 0 18px 60px rgba(0,0,0,0.38)' },
      ];
      shadowPresets.forEach(function (sp) {
        var sb = document.createElement('button');
        sb.type = 'button';
        sb.textContent = sp.label;
        sb.addEventListener('click', function () { updateSelectedStyle_(sel, 'boxShadow', sp.v); });
        bgBody.appendChild(sb);
      });
      bgGroup.appendChild(bgBody);
      push(bgGroup);
      var backgroundPanel = document.createElement('details');
      backgroundPanel.innerHTML = '<summary style="cursor:pointer;margin:8px 0">Background / 背景（圖片 / 影片）</summary>';
      var bgCtl = document.createElement('div');
      var bgo = getBackgroundOverrideForSel_(sel.selector) || {};
      var typeWrap = document.createElement('div');
      var typeLbl = document.createElement('label');
      typeLbl.textContent = 'Background Type';
      var typeSel = document.createElement('select');
      ['none', 'color', 'image', 'video', 'gradient'].forEach(function (t) {
        var op = document.createElement('option');
        op.value = t;
        op.textContent = t;
        typeSel.appendChild(op);
      });
      typeSel.value = String(bgo.type || 'none');
      typeSel.addEventListener('change', function () {
        updateSelectedBackground_(sel, { type: typeSel.value, enabled: true });
      });
      typeWrap.appendChild(typeLbl);
      typeWrap.appendChild(typeSel);
      bgCtl.appendChild(typeWrap);
      bgCtl.appendChild(editorFieldInput_('Overlay Color', bgo.overlayColor || 'rgba(0,0,0,0.45)', function (v) {
        updateSelectedBackground_(sel, { overlayColor: v });
      }));
      bgCtl.appendChild(editorFieldInput_('Overlay Opacity 0-100', bgo.overlayOpacity == null ? 45 : bgo.overlayOpacity, function (v) {
        updateSelectedBackground_(sel, { overlayOpacity: Math.max(0, Math.min(100, Number(v || 0))) });
      }, 'number'));
      bgCtl.appendChild(editorFieldInput_('Blur px', bgo.blur == null ? 0 : bgo.blur, function (v) {
        updateSelectedBackground_(sel, { blur: Math.max(0, Number(v || 0)) });
      }, 'number'));
      bgCtl.appendChild(editorFieldInput_('Brightness', bgo.brightness == null ? 1 : bgo.brightness, function (v) {
        updateSelectedBackground_(sel, { brightness: Number(v || 1) });
      }, 'number'));
      bgCtl.appendChild(editorFieldInput_('Saturation', bgo.saturation == null ? 1 : bgo.saturation, function (v) {
        updateSelectedBackground_(sel, { saturation: Number(v || 1) });
      }, 'number'));
      bgCtl.appendChild(editorFieldInput_('Contrast', bgo.contrast == null ? 1 : bgo.contrast, function (v) {
        updateSelectedBackground_(sel, { contrast: Number(v || 1) });
      }, 'number'));
      bgCtl.appendChild(editorFieldInput_('Fit', bgo.fit || 'cover', function (v) {
        updateSelectedBackground_(sel, { fit: v || 'cover' });
      }));
      bgCtl.appendChild(editorFieldInput_('Position', bgo.position || 'center center', function (v) {
        updateSelectedBackground_(sel, { position: v || 'center center' });
      }));
      bgCtl.appendChild(editorFieldInput_('Repeat', bgo.repeat || 'no-repeat', function (v) {
        updateSelectedBackground_(sel, { repeat: v || 'no-repeat' });
      }));
      bgCtl.appendChild(editorFieldInput_('Attachment', bgo.attachment || 'scroll', function (v) {
        updateSelectedBackground_(sel, { attachment: v || 'scroll' });
      }));
      bgCtl.appendChild(editorFieldInput_('Background color', bgo.backgroundColor || '', function (v) {
        updateSelectedBackground_(sel, { backgroundColor: v });
      }));
      bgCtl.appendChild(editorFieldInput_('Image URL', bgo.imageSrc || '', function (v) {
        updateSelectedBackground_(sel, { type: 'image', imageSrc: v });
      }));
      bgCtl.appendChild(editorFieldInput_('Video URL', bgo.videoSrc || '', function (v) {
        updateSelectedBackground_(sel, { type: 'video', videoSrc: v });
      }));
      bgCtl.appendChild(editorFieldInput_('Playback speed', bgo.playbackRate == null ? 1 : bgo.playbackRate, function (v) {
        updateSelectedBackground_(sel, { playbackRate: Number(v || 1) });
      }, 'number'));
      bgCtl.appendChild(editorFieldInput_('Poster image', bgo.posterSrc || '', function (v) {
        updateSelectedBackground_(sel, { posterSrc: v });
      }));
      var bgUploadImage = document.createElement('input');
      bgUploadImage.type = 'file';
      bgUploadImage.accept = 'image/*';
      bgUploadImage.addEventListener('change', function () {
        var f = bgUploadImage.files && bgUploadImage.files[0];
        if (!f) return;
        var fr = new FileReader();
        fr.onload = function () {
          var src = String(fr.result || '');
          if (!Array.isArray(cfg.project.sharedMediaLibrary)) cfg.project.sharedMediaLibrary = [];
          cfg.project.sharedMediaLibrary.push({ id: 'media_' + Date.now().toString(36), name: f.name || 'image.jpg', type: f.type || 'image/jpeg', kind: 'image', src: src, createdAt: Date.now(), size: Number(f.size || 0) });
          updateSelectedBackground_(sel, { type: 'image', imageSrc: src });
          buildEditorPanelFields_(state);
        };
        fr.readAsDataURL(f);
      });
      var bgUploadVideo = document.createElement('input');
      bgUploadVideo.type = 'file';
      bgUploadVideo.accept = 'video/mp4,video/webm,video/ogg,video/*';
      bgUploadVideo.addEventListener('change', function () {
        var f = bgUploadVideo.files && bgUploadVideo.files[0];
        if (!f) return;
        if (Number(f.size || 0) > 4 * 1024 * 1024) {
          alert('影片檔案較大，localStorage 可能無法長期保存。建議改用較小的 mp4 或外部 URL。');
        }
        var fr = new FileReader();
        fr.onload = function () {
          var src = String(fr.result || '');
          if (!Array.isArray(cfg.project.sharedMediaLibrary)) cfg.project.sharedMediaLibrary = [];
          cfg.project.sharedMediaLibrary.push({ id: 'media_' + Date.now().toString(36), name: f.name || 'video.mp4', type: f.type || 'video/mp4', kind: 'video', src: src, createdAt: Date.now(), size: Number(f.size || 0) });
          updateSelectedBackground_(sel, { type: 'video', videoSrc: src });
          buildEditorPanelFields_(state);
        };
        fr.readAsDataURL(f);
      });
      var dropzone = document.createElement('div');
      dropzone.textContent = 'Drop image/video here for background';
      dropzone.style.border = '1px dashed rgba(255,255,255,.28)';
      dropzone.style.borderRadius = '12px';
      dropzone.style.padding = '10px';
      dropzone.addEventListener('dragover', function (e) { e.preventDefault(); });
      dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (!f) return;
        var isVideo = /^video\//.test(String(f.type || ''));
        var fr = new FileReader();
        fr.onload = function () {
          var src = String(fr.result || '');
          if (!Array.isArray(cfg.project.sharedMediaLibrary)) cfg.project.sharedMediaLibrary = [];
          cfg.project.sharedMediaLibrary.push({ id: 'media_' + Date.now().toString(36), name: f.name || (isVideo ? 'video.mp4' : 'image.jpg'), type: f.type || (isVideo ? 'video/mp4' : 'image/jpeg'), kind: isVideo ? 'video' : 'image', src: src, createdAt: Date.now(), size: Number(f.size || 0) });
          updateSelectedBackground_(sel, isVideo ? { type: 'video', videoSrc: src } : { type: 'image', imageSrc: src });
          buildEditorPanelFields_(state);
        };
        fr.readAsDataURL(f);
      });
      bgCtl.appendChild(editorFieldInput_('Upload image', '', function () {}));
      bgCtl.appendChild(bgUploadImage);
      bgCtl.appendChild(editorFieldInput_('Upload video', '', function () {}));
      bgCtl.appendChild(bgUploadVideo);
      bgCtl.appendChild(dropzone);
      var filterWrap = document.createElement('div');
      var fLbl = document.createElement('label');
      fLbl.textContent = 'Media Library Filter';
      var fSel = document.createElement('select');
      ['all', 'images', 'videos'].forEach(function (x) {
        var op = document.createElement('option');
        op.value = x;
        op.textContent = x;
        fSel.appendChild(op);
      });
      fSel.value = state.mediaFilter || 'all';
      fSel.addEventListener('change', function () {
        state.mediaFilter = fSel.value;
        buildEditorPanelFields_(state);
      });
      filterWrap.appendChild(fLbl);
      filterWrap.appendChild(fSel);
      bgCtl.appendChild(filterWrap);
      if (Array.isArray(cfg.project.sharedMediaLibrary) && cfg.project.sharedMediaLibrary.length) {
        var lib = document.createElement('div');
        lib.className = 'mc-editor-repeater';
        for (var lii = 0; lii < cfg.project.sharedMediaLibrary.length; lii++) {
          (function (mItem, idx) {
            var kind = String(mItem.kind || (String(mItem.type || '').indexOf('video/') === 0 ? 'video' : 'image'));
            if (state.mediaFilter === 'images' && kind !== 'image') return;
            if (state.mediaFilter === 'videos' && kind !== 'video') return;
            var row = document.createElement('div');
            row.style.border = '1px solid rgba(255,255,255,.12)';
            row.style.borderRadius = '8px';
            row.style.padding = '6px';
            if (kind === 'video') {
              var vv = document.createElement('video');
              vv.src = mItem.src;
              vv.muted = true;
              vv.loop = !shouldFreezeEditorPreview_();
              vv.autoplay = !shouldFreezeEditorPreview_();
              vv.playsInline = true;
              vv.style.width = '100%';
              vv.style.height = '64px';
              vv.style.objectFit = 'cover';
              if (shouldFreezeEditorPreview_()) {
                try {
                  vv.pause();
                  vv.currentTime = 0;
                } catch (eVv) {
                  void 0;
                }
              }
              row.appendChild(vv);
            } else {
              var ii = document.createElement('img');
              ii.src = mItem.src;
              ii.style.width = '100%';
              ii.style.height = '64px';
              ii.style.objectFit = 'cover';
              row.appendChild(ii);
            }
            var aBg = document.createElement('button');
            aBg.type = 'button';
            aBg.textContent = kind === 'video' ? 'Apply as background video' : 'Apply as background image';
            aBg.addEventListener('click', function () {
              updateSelectedBackground_(sel, kind === 'video' ? { type: 'video', videoSrc: mItem.src } : { type: 'image', imageSrc: mItem.src });
            });
            row.appendChild(aBg);
            var del = document.createElement('button');
            del.type = 'button';
            del.textContent = 'Delete media';
            del.addEventListener('click', function () {
              cfg.project.sharedMediaLibrary.splice(idx, 1);
              saveEditorConfig(state.config);
              buildEditorPanelFields_(state);
            });
            row.appendChild(del);
            lib.appendChild(row);
          })(cfg.project.sharedMediaLibrary[lii], lii);
        }
        bgCtl.appendChild(lib);
      }
      [
        { label: 'Dark Museum Image', styles: { type: 'image', fit: 'cover', position: 'center center', overlayColor: 'rgba(0,0,0,0.45)', blur: 2, brightness: 0.75 } },
        { label: 'Cinematic Video Hero', styles: { type: 'video', fit: 'cover', position: 'center center', overlayColor: 'rgba(0,0,0,0.55)', blur: 4, brightness: 0.65, saturation: 0.85 } },
        { label: 'Deep Green Biology', styles: { overlayColor: 'rgba(3,24,16,0.68)', blur: 8, brightness: 0.7, saturation: 1.05 } },
        { label: 'Soft Focus Background', styles: { blur: 16, overlayColor: 'rgba(0,0,0,0.35)', brightness: 0.85 } },
        { label: 'Premium Card Background', styles: { fit: 'cover', overlayColor: 'rgba(7,16,13,0.62)', blur: 6, brightness: 0.78 } },
      ].forEach(function (bp) {
        var pbtn = document.createElement('button');
        pbtn.type = 'button';
        pbtn.textContent = bp.label;
        pbtn.addEventListener('click', function () {
          updateSelectedBackground_(sel, bp.styles);
          if (bp.styles.borderRadius) updateSelectedStyle_(sel, 'borderRadius', bp.styles.borderRadius);
        });
        bgCtl.appendChild(pbtn);
      });
      backgroundPanel.appendChild(bgCtl);
      push(backgroundPanel);
      if (state.designWarning) {
        var warn = document.createElement('p');
        warn.className = 'mc-editor-field__hint';
        warn.style.color = '#ffcc66';
        warn.textContent = state.designWarning;
        push(warn);
      }
      }
      var adv = document.createElement('details');
      adv.className = 'mc-editor-details';
      adv.innerHTML = '<summary>進階 / Advanced</summary>';
      var advBody = document.createElement('div');
      advBody.className = 'mc-editor-details__body';
      advBody.appendChild(editorFieldInput_('Selector', sel.selector || '', function () {}, 'text'));
      advBody.appendChild(editorFieldInput_('Tag', sel.tagName || '', function () {}, 'text'));
      advBody.appendChild(
        editorFieldInput_('HTML', sel.html || '', function (v) {
          upsertBySelector_(pageCfg.htmlOverrides, sel.selector, {
            id: 'override_html_' + Date.now().toString(36),
            selector: sel.selector,
            value: v,
          });
          state.render();
        }, 'textarea')
      );
      adv.appendChild(advBody);
      push(adv);
      var resetDesignBtn = document.createElement('button');
      resetDesignBtn.type = 'button';
      resetDesignBtn.className = 'mc-editor-action-btn';
      resetDesignBtn.textContent = '清除此元素樣式覆寫';
      resetDesignBtn.addEventListener('click', function () {
        if (!Array.isArray(pageCfg.styleOverrides)) return;
        pageCfg.styleOverrides = pageCfg.styleOverrides.filter(function (row) {
          return String((row && row.selector) || '') !== String(sel.selector || '');
        });
        saveEditorConfig(state.config);
        state.render();
        buildEditorPanelFields_(state);
      });
      push(resetDesignBtn);
      var hideBtn = document.createElement('button');
      hideBtn.type = 'button';
      hideBtn.className = 'mc-editor-action-btn mc-editor-action-btn--danger';
      hideBtn.textContent = '隱藏元素';
      hideBtn.addEventListener('click', function () {
        pageCfg.hiddenElements.push(sel.selector);
        state.render();
      });
      push(hideBtn);
      var resetSel = document.createElement('button');
      resetSel.type = 'button';
      resetSel.className = 'mc-editor-action-btn';
      resetSel.textContent = '取消選取 (Esc)';
      resetSel.addEventListener('click', function () {
        state.selectedElement = null;
        state.activeInspectorMode = 'section';
        state.inspectorTab = null;
        var fr = document.getElementById('mcEditorFrame');
        if (fr && fr.contentWindow) {
          fr.contentWindow.postMessage({ type: 'MC_EDITOR_ELEMENT_DESELECTED' }, '*');
        }
        buildEditorPanelFields_(state);
      });
      push(resetSel);
      return;
    }
    if (state.activeInspectorMode === 'empty') {
      ttl.textContent = '開始編輯';
      push(
        editorEmptyStateGuide_('三步驟開始', [
          '① 左側選「內容區塊」或切換頁面',
          '② 在預覽中點文字／圖片（標本卡請用「典藏牆」面板）',
          '③ 右側修改後會自動儲存；也可按 Ctrl+S',
        ])
      );
      var quick = editorFieldGroup_('快速工具', '掃描頁面上可編輯的文字與圖片');
      var scanBtn = document.createElement('button');
      scanBtn.type = 'button';
      scanBtn.className = 'mc-editor-action-btn mc-editor-action-btn--primary';
      scanBtn.textContent = '掃描可編輯文字與圖片';
      scanBtn.disabled = !state.previewReady;
      scanBtn.addEventListener('click', function () {
        var frame = document.getElementById('mcEditorFrame');
        if (frame && frame.contentWindow) frame.contentWindow.postMessage({ type: 'MC_EDITOR_SCAN_EDITABLE' }, '*');
      });
      quick.appendBody(scanBtn);
      var pageBgBtn = document.createElement('button');
      pageBgBtn.type = 'button';
      pageBgBtn.className = 'mc-editor-action-btn';
      pageBgBtn.textContent = '編輯整頁背景';
      pageBgBtn.addEventListener('click', function () {
        state.selectedElement = {
          selector: 'body',
          tagName: 'BODY',
          editType: 'section',
          editorLabel: '整頁背景',
          label: '整頁背景',
          computedStyle: {},
        };
        state.activeInspectorMode = 'selected';
        state.inspectorTab = 'style';
        buildEditorPanelFields_(state);
      });
      quick.appendBody(pageBgBtn);
      push(quick);
      var btnProject = document.createElement('button');
      btnProject.type = 'button';
      btnProject.textContent = 'Open Project Settings';
      btnProject.addEventListener('click', function () {
        state.activeSection = 'project';
        state.section = 'project';
        state.activeInspectorMode = 'section';
        buildEditorPanelFields_(state);
      });
      push(btnProject);
      if (Array.isArray(state.scanResult) && state.scanResult.length) {
        var lst = document.createElement('div');
        lst.className = 'mc-editor-repeater';
        for (var sri = 0; sri < state.scanResult.length; sri++) {
          (function (row) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = (row.editType || row.type || 'node') + ' · ' + (row.selector || row.label || '');
            b.style.textAlign = 'left';
            b.addEventListener('click', function () {
              var frame = document.getElementById('mcEditorFrame');
              if (frame && frame.contentWindow) {
                frame.contentWindow.postMessage({ type: 'MC_EDITOR_UPDATE_SELECTED_ELEMENT', payload: { selector: row.selector } }, '*');
              }
            });
            lst.appendChild(b);
          })(state.scanResult[sri]);
        }
        push(lst);
      }
      return;
    }
    function projectOverrideRow_(item, idx) {
      var row = document.createElement('div');
      row.style.padding = '8px';
      row.style.border = '1px solid rgba(255,255,255,.08)';
      row.style.borderRadius = '10px';
      row.appendChild(editorFieldInput_('Selector', item.selector || '', function (v) {
        item.selector = v;
        state.render();
      }));
      row.appendChild(editorFieldInput_('Text', item.text || '', function (v) {
        item.text = v;
        state.render();
      }, 'textarea'));
      var del = document.createElement('button');
      del.type = 'button';
      del.textContent = 'Remove override';
      del.addEventListener('click', function () {
        var pg = getActivePageConfig_(state.config);
        pg.textOverrides.splice(idx, 1);
        buildEditorPanelFields_(state);
        state.render();
      });
      row.appendChild(del);
      return row;
    }
    if (section === 'hero') {
      push(
        editorEmptyStateGuide_('Hero 首頁', [
          '改下方欄位會即時更新預覽。',
          '也可在預覽中直接點標題、副標或按鈕文字。',
        ])
      );
      push(editorFieldInput_('眉標 Eyebrow', cfg.hero.eyebrow, function (v) {
        cfg.hero.eyebrow = v; state.render();
      }));
      push(editorFieldInput_('主標題 Title', cfg.hero.title, function (v) {
        cfg.hero.title = v; state.render();
      }, 'textarea', null, true));
      push(editorFieldInput_('副標題 Subtitle', cfg.hero.subtitle, function (v) {
        cfg.hero.subtitle = v; state.render();
      }, 'textarea'));
      push(editorFieldInput_('主按鈕', cfg.hero.primaryButton, function (v) {
        cfg.hero.primaryButton = v; state.render();
      }));
      push(editorFieldInput_('次按鈕', cfg.hero.secondaryButton, function (v) {
        cfg.hero.secondaryButton = v; state.render();
      }));
      push(editorFieldInput_('背景影片 URL', cfg.hero.backgroundVideo, function (v) {
        cfg.hero.backgroundVideo = v; state.render();
      }));
      push(editorFieldInput_('影片模糊', cfg.hero.videoBlur, function (v) {
        cfg.hero.videoBlur = Number(v || 0); state.render();
      }, 'number'));
      push(editorFieldInput_('影片亮度', cfg.hero.videoBrightness, function (v) {
        cfg.hero.videoBrightness = Number(v || 0); state.render();
      }, 'number'));
    } else if (section === 'entry') {
      var list = document.createElement('div');
      list.className = 'mc-editor-repeater';
      for (var i = 0; i < cfg.entry.cards.length; i++) {
        (function (idx) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = 'Card ' + (idx + 1) + ' — ' + (cfg.entry.cards[idx].label || cfg.entry.cards[idx].title || '');
          b.addEventListener('click', function () {
            state.entryCardIndex = idx;
            buildEditorPanelFields_(state);
          });
          if (state.entryCardIndex === idx) b.classList.add('is-active');
          list.appendChild(b);
        })(i);
      }
      push(list);
      var addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.textContent = '+ Add card';
      addBtn.addEventListener('click', function () {
        cfg.entry.cards.push({ title: 'New card', label: 'Label', description: '', button: 'Action' });
        state.entryCardIndex = cfg.entry.cards.length - 1;
        buildEditorPanelFields_(state);
        state.render();
      });
      push(addBtn);
      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.textContent = 'Remove card';
      delBtn.addEventListener('click', function () {
        if (cfg.entry.cards.length <= 1) return;
        cfg.entry.cards.splice(state.entryCardIndex, 1);
        state.entryCardIndex = Math.max(0, state.entryCardIndex - 1);
        buildEditorPanelFields_(state);
        state.render();
      });
      push(delBtn);
      var ec = cfg.entry.cards[state.entryCardIndex] || cfg.entry.cards[0];
      push(editorFieldInput_('Label', ec.label, function (v) { ec.label = v; state.render(); }));
      push(editorFieldInput_('Title', ec.title, function (v) { ec.title = v; state.render(); }));
      push(editorFieldInput_(wmCopy('editorTplDesc'), ec.description, function (v) { ec.description = v; state.render(); }, 'textarea'));
      push(editorFieldInput_('Button', ec.button, function (v) { ec.button = v; state.render(); }));
    } else if (section === 'coverflow') {
      cfg = ensureEditorCoverflowItems_(cfg);
      state.config = cfg;
      push(
        editorEmptyStateGuide_('典藏牆 Coverflow', [
          '可直接點標本卡上的產地、日期、採集者、是否公開等欄位編輯。',
          '或在下方 item 列表修改；雙擊欄位可現場輸入。',
        ])
      );
      push(editorFieldInput_('區塊標題', cfg.coverflow.title, function (v) { cfg.coverflow.title = v; state.render(); }));
      push(editorFieldInput_('副標題', cfg.coverflow.subtitle, function (v) { cfg.coverflow.subtitle = v; state.render(); }, 'textarea'));
      var fWrap = document.createElement('div');
      fWrap.className = 'mc-editor-repeater';
      (cfg.coverflow.filters || []).forEach(function (f, idx) {
        var row = editorFieldInput_('Filter ' + (idx + 1), f, function (v) {
          cfg.coverflow.filters[idx] = v;
          state.render();
        });
        fWrap.appendChild(row);
      });
      push(fWrap);
      if (!Array.isArray(cfg.coverflow.items)) cfg.coverflow.items = [];
      var itemList = document.createElement('div');
      itemList.className = 'mc-editor-repeater';
      for (var ci = 0; ci < cfg.coverflow.items.length; ci++) {
        (function (idx) {
          var it = cfg.coverflow.items[idx] || {};
          var card = document.createElement('div');
          card.style.padding = '8px';
          card.style.border = '1px solid rgba(255,255,255,.08)';
          card.style.borderRadius = '10px';
          card.appendChild(editorFieldInput_('Item ' + (idx + 1) + ' image URL', it.image || '', function (v) {
            cfg.coverflow.items[idx].image = v; state.render();
          }));
          card.appendChild(editorFieldInput_('Scientific name', it.scientificName || '', function (v) {
            cfg.coverflow.items[idx].scientificName = v; state.render();
          }));
          card.appendChild(editorFieldInput_('Common name', it.common || '', function (v) {
            cfg.coverflow.items[idx].common = v; state.render();
          }));
          card.appendChild(editorFieldInput_('Category', it.category || '', function (v) {
            cfg.coverflow.items[idx].category = v; state.render();
          }));
          card.appendChild(editorFieldInput_('Rarity', it.rarity || '', function (v) {
            cfg.coverflow.items[idx].rarity = v; state.render();
          }));
          card.appendChild(editorFieldInput_('Locality', it.locality || '', function (v) {
            cfg.coverflow.items[idx].locality = v; state.render();
          }));
          card.appendChild(editorFieldInput_('Date', it.date || '', function (v) {
            cfg.coverflow.items[idx].date = v; state.render();
          }));
          card.appendChild(editorFieldInput_('Collector', it.collector || '', function (v) {
            cfg.coverflow.items[idx].collector = v; state.render();
          }));
          card.appendChild(editorFieldInput_('Visibility', it.visibility || '', function (v) {
            cfg.coverflow.items[idx].visibility = v; state.render();
          }));
          var del = document.createElement('button');
          del.type = 'button';
          del.textContent = 'Remove item';
          del.addEventListener('click', function () {
            cfg.coverflow.items.splice(idx, 1);
            buildEditorPanelFields_(state);
            state.render();
          });
          card.appendChild(del);
          itemList.appendChild(card);
        })(ci);
      }
      push(itemList);
      var addCfItem = document.createElement('button');
      addCfItem.type = 'button';
      addCfItem.textContent = '+ Add coverflow item';
      addCfItem.addEventListener('click', function () {
        cfg.coverflow.items.push({
          image: '',
          scientificName: 'New specimen',
          common: '',
          category: 'insect',
          rarity: 'common',
          locality: '',
          date: '',
          visibility: '館內主要',
        });
        buildEditorPanelFields_(state);
        state.render();
      });
      push(addCfItem);
    } else if (section === 'specimenCard') {
      push(editorFieldInput_('Card style', cfg.specimenCard.style, function (v) { cfg.specimenCard.style = v; state.render(); }));
      push(editorFieldInput_('Enable tilt (1/0)', cfg.specimenCard.enableTilt ? 1 : 0, function (v) { cfg.specimenCard.enableTilt = Number(v) === 1; state.render(); }, 'number'));
      push(editorFieldInput_('Enable flip (1/0)', cfg.specimenCard.enableFlip ? 1 : 0, function (v) { cfg.specimenCard.enableFlip = Number(v) === 1; state.render(); }, 'number'));
      push(editorFieldInput_('Show progress (1/0)', cfg.specimenCard.showProgress ? 1 : 0, function (v) { cfg.specimenCard.showProgress = Number(v) === 1; state.render(); }, 'number'));
    } else if (section === 'workflow') {
      push(editorFieldInput_('Title', cfg.workflow.title, function (v) { cfg.workflow.title = v; state.render(); }, 'textarea'));
      push(editorFieldInput_('Subtitle', cfg.workflow.subtitle, function (v) { cfg.workflow.subtitle = v; state.render(); }, 'textarea'));
      push(editorFieldInput_('Enable onboarding (1/0)', cfg.workflow.onboarding ? 1 : 0, function (v) { cfg.workflow.onboarding = Number(v) === 1; state.render(); }, 'number'));
      push(editorFieldInput_('Step labels (comma separated)', (cfg.workflow.stepLabels || []).join(', '), function (v) {
        cfg.workflow.stepLabels = String(v || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
        state.render();
      }));
    } else if (section === 'grading') {
      push(editorFieldInput_('Enable grading (1/0)', cfg.grading.enabled ? 1 : 0, function (v) { cfg.grading.enabled = Number(v) === 1; state.render(); }, 'number'));
      push(editorFieldInput_('Grade title', cfg.grading.title, function (v) { cfg.grading.title = v; state.render(); }));
      push(editorFieldInput_('Score system', cfg.grading.scoreSystem, function (v) { cfg.grading.scoreSystem = v; state.render(); }));
    } else if (section === 'project') {
      if (!Array.isArray(pageCfg.textOverrides)) pageCfg.textOverrides = [];
      if (!Array.isArray(pageCfg.domPatches)) pageCfg.domPatches = [];
      if (!Array.isArray(pageCfg.backgroundOverrides)) pageCfg.backgroundOverrides = [];
      pageCfg.cssOverride = pageCfg.cssOverride == null ? '' : String(pageCfg.cssOverride);
      push(editorFieldInput_('Preview path (e.g. /UI.html?page=dashboard)', pageCfg.previewPath || '', function (v) {
        pageCfg.previewPath = v;
      }));
      var applyPathBtn = document.createElement('button');
      applyPathBtn.type = 'button';
      applyPathBtn.textContent = 'Apply preview path';
      applyPathBtn.addEventListener('click', function () {
        var frame = document.getElementById('mcEditorFrame');
        if (!frame) return;
        var nextUrl = String(pageCfg.previewPath || '').trim();
        if (!nextUrl) return;
        try {
          state.previewReady = false;
          state.projectScanError = '';
          frame.src = new URL(nextUrl, window.location.origin).toString();
        } catch (eU) {
          void 0;
        }
      });
      push(applyPathBtn);
      var scanSectionsBtn = document.createElement('button');
      scanSectionsBtn.type = 'button';
      scanSectionsBtn.textContent = '掃描頁面區塊';
      scanSectionsBtn.disabled = !state.previewReady;
      scanSectionsBtn.addEventListener('click', function () {
        var scanResult = scanPreviewSectionTargets_();
        state.scannedSectionTargets = scanResult.items || [];
        state.projectScanError = scanResult.error || '';
        buildEditorPanelFields_(state);
      });
      push(scanSectionsBtn);
      if (!state.previewReady) {
        var wait = document.createElement('p');
        wait.style.opacity = '0.72';
        wait.style.margin = '4px 0 12px';
        wait.textContent = 'Preview iframe is loading...';
        push(wait);
      }
      if (state.projectScanError) {
        var err = document.createElement('p');
        err.style.color = '#fca5a5';
        err.style.margin = '4px 0 12px';
        err.textContent = state.projectScanError;
        push(err);
      }
      if (Array.isArray(state.scannedSectionTargets) && state.scannedSectionTargets.length) {
        var secList = document.createElement('div');
        secList.className = 'mc-editor-repeater';
        var secLbl = document.createElement('label');
        secLbl.textContent = '可插入版型的區塊 selector';
        secList.appendChild(secLbl);
        for (var sx = 0; sx < state.scannedSectionTargets.length; sx++) {
          (function (target) {
            var bSec = document.createElement('button');
            bSec.type = 'button';
            bSec.textContent = target.selector + ' — ' + (target.tag || 'node') + ' — ' + target.label;
            bSec.style.textAlign = 'left';
            bSec.style.whiteSpace = 'normal';
            bSec.addEventListener('click', function () {
              state.projectTargetSelector = target.selector;
              buildEditorPanelFields_(state);
            });
            secList.appendChild(bSec);
          })(state.scannedSectionTargets[sx]);
        }
        push(secList);
      }
      var scanBtn = document.createElement('button');
      scanBtn.type = 'button';
      scanBtn.textContent = '掃描可編輯元素';
      scanBtn.disabled = !state.previewReady;
      scanBtn.addEventListener('click', function () {
        state.scannedCandidates = scanPreviewEditableElements_();
        buildEditorPanelFields_(state);
      });
      push(scanBtn);
      if (Array.isArray(state.scannedCandidates) && state.scannedCandidates.length) {
        var autoList = document.createElement('div');
        autoList.className = 'mc-editor-repeater';
        var ttlAuto = document.createElement('label');
        ttlAuto.textContent = '抓取結果（點擊加入可編輯覆寫）';
        autoList.appendChild(ttlAuto);
        for (var si = 0; si < state.scannedCandidates.length; si++) {
          (function (cand) {
            var rowBtn = document.createElement('button');
            rowBtn.type = 'button';
            rowBtn.textContent = cand.label || cand.selector;
            rowBtn.style.textAlign = 'left';
            rowBtn.style.whiteSpace = 'normal';
            rowBtn.style.lineHeight = '1.35';
            rowBtn.addEventListener('click', function () {
              if (cand.type === 'text') {
                pageCfg.textOverrides.push({ selector: cand.selector, text: cand.text || '' });
              } else {
                var cssLine = cand.selector + '{content:url("' + String(cand.src || '').replace(/"/g, '\\"') + '");}';
                pageCfg.cssOverride = String(pageCfg.cssOverride || '') + '\n' + cssLine;
              }
              buildEditorPanelFields_(state);
              state.render();
            });
            autoList.appendChild(rowBtn);
          })(state.scannedCandidates[si]);
        }
        push(autoList);
      }
      push(editorFieldInput_('版型插入目標 selector', state.projectTargetSelector || '', function (v) {
        state.projectTargetSelector = v;
      }));
      var posWrap = document.createElement('div');
      var posLabel = document.createElement('label');
      posLabel.textContent = '版型插入位置';
      var posSel = document.createElement('select');
      ['append', 'prepend', 'before', 'after', 'replace'].forEach(function (x) {
        var op = document.createElement('option');
        op.value = x;
        op.textContent = x;
        posSel.appendChild(op);
      });
      posSel.value = state.projectInsertAction || 'append';
      posSel.addEventListener('change', function () {
        state.projectInsertAction = posSel.value;
      });
      posWrap.appendChild(posLabel);
      posWrap.appendChild(posSel);
      push(posWrap);
      var tmplWrap = document.createElement('div');
      var tmplLabel = document.createElement('label');
      tmplLabel.textContent = '新增版型 / 插入版型';
      var tmplSel = document.createElement('select');
      var templates = editorTemplateLibrary_();
      for (var ti = 0; ti < templates.length; ti++) {
        var opT = document.createElement('option');
        opT.value = templates[ti].key;
        opT.textContent = templates[ti].label;
        tmplSel.appendChild(opT);
      }
      tmplSel.value = state.projectTemplateKey || (templates[0] && templates[0].key) || '';
      tmplSel.addEventListener('change', function () {
        state.projectTemplateKey = tmplSel.value;
        buildEditorPanelFields_(state);
      });
      tmplWrap.appendChild(tmplLabel);
      tmplWrap.appendChild(tmplSel);
      var tmplDesc = document.createElement('p');
      tmplDesc.style.opacity = '0.75';
      tmplDesc.style.margin = '0 0 8px';
      var activeTmpl = null;
      for (var tdi = 0; tdi < templates.length; tdi++) {
        if (templates[tdi].key === tmplSel.value) {
          activeTmpl = templates[tdi];
          break;
        }
      }
      tmplDesc.textContent = activeTmpl ? ('Template: ' + activeTmpl.label) : 'Template: —';
      tmplWrap.appendChild(tmplDesc);
      push(tmplWrap);
      var insertBtn = document.createElement('button');
      insertBtn.type = 'button';
      insertBtn.textContent = '插入版型到目標區塊';
      insertBtn.addEventListener('click', function () {
        var targetSel = String(state.projectTargetSelector || '').trim();
        if (!targetSel) return;
        var action = state.projectInsertAction || 'append';
        var tKey = state.projectTemplateKey || '';
        var tpl = null;
        var lib = editorTemplateLibrary_();
        for (var li = 0; li < lib.length; li++) {
          if (lib[li].key === tKey) {
            tpl = lib[li];
            break;
          }
        }
        if (!tpl || !tpl.html) return;
        pageCfg.domPatches.push({
          id: makeEditorPatchId_(),
          pageId: String(cfg.activePageId || 'landing'),
          selector: targetSel,
          action: action,
          html: tpl.html,
          enabled: true,
        });
        state.render();
        buildEditorPanelFields_(state);
      });
      push(insertBtn);
      var addWrap = document.createElement('details');
      addWrap.open = !!state.quickAddType;
      addWrap.innerHTML = '<summary style="cursor:pointer;margin:8px 0">Add / 新增</summary>';
      var addBody = document.createElement('div');
      var fieldType = document.createElement('select');
      ['SAT ID', 'Museum Number', 'Scientific Name', 'Common Name', 'Taxon', 'Locality', 'Collector', 'Date', 'License', 'Provenance', 'Verification Status', 'QR Code', 'Image', 'Notes'].forEach(function (x) {
        var op = document.createElement('option');
        op.value = x;
        op.textContent = x;
        fieldType.appendChild(op);
      });
      addBody.appendChild(editorFieldInput_('Field label', '', function (v) {
        state.addFieldLabel = v;
      }));
      addBody.appendChild(editorFieldInput_('Field value', '', function (v) {
        state.addFieldValue = v;
      }, 'textarea'));
      addBody.appendChild(fieldType);
      var fieldInsert = document.createElement('button');
      fieldInsert.type = 'button';
      fieldInsert.textContent = 'Insert field';
      fieldInsert.addEventListener('click', function () {
        var lbl = String(state.addFieldLabel || fieldType.value || 'Field').trim();
        var val = String(state.addFieldValue || 'Value').trim();
        var htmlField =
          '<div class="mc-added-field mc-field-row" data-editor-id="field-' + Date.now().toString(36) + '">' +
          '<span class="mc-field-label">' + lbl + '</span><strong class="mc-field-value">' + val + '</strong></div>';
        var targetSel2 = String(state.projectTargetSelector || '').trim() || '#welcomeGateSection';
        pageCfg.domPatches.push({
          id: makeEditorPatchId_(),
          pageId: String(cfg.activePageId || 'landing'),
          selector: targetSel2,
          action: state.projectInsertAction || 'append',
          html: htmlField,
          enabled: true,
          label: 'Added field: ' + lbl,
        });
        state.render();
        buildEditorPanelFields_(state);
      });
      addBody.appendChild(fieldInsert);
      addWrap.appendChild(addBody);
      push(addWrap);
      var patchList = document.createElement('div');
      patchList.className = 'mc-editor-repeater';
      var patchLbl = document.createElement('label');
      patchLbl.textContent = '已插入 / 可修改的版型 patches';
      patchList.appendChild(patchLbl);
      for (var pdi = 0; pdi < pageCfg.domPatches.length; pdi++) {
        (function (idx) {
          var patch = pageCfg.domPatches[idx] || {};
          if (!patch.id) patch.id = makeEditorPatchId_();
          if (patch.enabled == null) patch.enabled = true;
          var box = document.createElement('div');
          box.style.padding = '8px';
          box.style.border = '1px solid rgba(255,255,255,.08)';
          box.style.borderRadius = '10px';
          var enRow = document.createElement('label');
          var en = document.createElement('input');
          en.type = 'checkbox';
          en.checked = patch.enabled !== false;
          en.style.width = 'auto';
          en.style.marginRight = '8px';
          en.addEventListener('change', function () {
            patch.enabled = !!en.checked;
            state.render();
          });
          enRow.appendChild(en);
          enRow.appendChild(document.createTextNode('啟用 patch'));
          box.appendChild(enRow);
          box.appendChild(editorFieldInput_('Patch ID', patch.id || '', function (v) {
            patch.id = v || makeEditorPatchId_();
            state.render();
          }));
          box.appendChild(editorFieldInput_('Patch selector', patch.selector || '', function (v) {
            patch.selector = v;
            state.render();
          }));
          var actWrap = document.createElement('div');
          var actLbl = document.createElement('label');
          actLbl.textContent = 'Patch action';
          var actSel = document.createElement('select');
          ['append', 'prepend', 'before', 'after', 'replace'].forEach(function (x) {
            var op = document.createElement('option');
            op.value = x;
            op.textContent = x;
            actSel.appendChild(op);
          });
          actSel.value = patch.action || 'append';
          actSel.addEventListener('change', function () {
            patch.action = actSel.value || 'append';
            state.render();
          });
          actWrap.appendChild(actLbl);
          actWrap.appendChild(actSel);
          box.appendChild(actWrap);
          box.appendChild(editorFieldInput_('Patch HTML', patch.html || '', function (v) {
            patch.html = v;
            state.render();
          }, 'textarea'));
          var delPatch = document.createElement('button');
          delPatch.type = 'button';
          delPatch.textContent = '刪除此版型 patch';
          delPatch.addEventListener('click', function () {
            pageCfg.domPatches.splice(idx, 1);
            buildEditorPanelFields_(state);
            state.render();
          });
          box.appendChild(delPatch);
          patchList.appendChild(box);
        })(pdi);
      }
      push(patchList);
      var list = document.createElement('div');
      list.className = 'mc-editor-repeater';
      for (var pi = 0; pi < pageCfg.textOverrides.length; pi++) {
        list.appendChild(projectOverrideRow_(pageCfg.textOverrides[pi], pi));
      }
      push(list);
      var add = document.createElement('button');
      add.type = 'button';
      add.textContent = '+ Add text override';
      add.addEventListener('click', function () {
        pageCfg.textOverrides.push({ selector: '', text: '' });
        buildEditorPanelFields_(state);
      });
      push(add);
      push(editorFieldInput_('Page CSS override', pageCfg.cssOverride || '', function (v) {
        pageCfg.cssOverride = v;
        state.render();
      }, 'textarea'));
      push(editorFieldInput_('Global CSS override', cfg.project.globalCssOverride || '', function (v) {
        cfg.project.globalCssOverride = v;
        state.render();
      }, 'textarea'));
      var projectIo = document.createElement('div');
      projectIo.className = 'mc-editor-repeater';
      var saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.textContent = '儲存全專案設定';
      saveBtn.addEventListener('click', function () {
        saveEditorConfig(state.config);
      });
      var loadBtn = document.createElement('button');
      loadBtn.type = 'button';
      loadBtn.textContent = '重新載入全專案設定';
      loadBtn.addEventListener('click', function () {
        state.config = getEditorConfig();
        buildEditorPanelFields_(state);
        state.render();
      });
      projectIo.appendChild(saveBtn);
      projectIo.appendChild(loadBtn);
      push(projectIo);
    }
    var autoFocusEl = host.querySelector('[data-editor-autofocus]');
    if (autoFocusEl && typeof autoFocusEl.focus === 'function') {
      try {
        autoFocusEl.focus();
        if (typeof autoFocusEl.select === 'function') autoFocusEl.select();
      } catch (eFocus) {
        void 0;
      }
    }
  }

  function collapseLegacyContentStudio_() {
    var root = document.getElementById('mcContentStudioRoot');
    if (!root || root.getAttribute('data-visual-editor-clean') === '1') return;
    root.setAttribute('data-visual-editor-clean', '1');
    var oldNodes = root.querySelectorAll('.mc3-secnav, #mc3EditorMain, #mc3PanelMedia, #mc3PanelTrans, #mc3PanelPub, #mc3PanelAdv, #mc3PanelCoverflow, #mc3AddModal');
    for (var i = 0; i < oldNodes.length; i++) {
      oldNodes[i].setAttribute('hidden', 'hidden');
      oldNodes[i].style.display = 'none';
    }
    var sub = root.querySelector('.panel-sub[data-i18n="content_studio_v2_desc"]');
    if (sub) sub.textContent = '已切換為 Webflow-style Visual Editor。請使用「開啟視覺編輯器」編輯整站（本機 localStorage）。';
  }

  function bindEditorShellToolbar_(shell, state, hooks) {
    hooks = hooks || {};
    function bindBtn_(selector, handler) {
      var btn = shell.querySelector(selector);
      if (!btn) {
        console.warn('[VisualEditor] toolbar control missing:', selector);
        return null;
      }
      btn.type = 'button';
      btn.addEventListener('click', handler);
      return btn;
    }
    bindBtn_('[data-editor-action="preview"]', function () {
      var on = shell.getAttribute('data-preview-only') === '1';
      shell.setAttribute('data-preview-only', on ? '0' : '1');
    });
    bindBtn_('[data-editor-action="save"]', function () {
      var saveBtn = shell.querySelector('[data-editor-action="save"]');
      var prevLabel = saveBtn ? saveBtn.textContent : '儲存';
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = '儲存中…';
      }
      try {
        state.config = normalizeEditorConfig_(state.config);
        var result = commitEditorSave_(state.config, { notify: true, downloadFallback: true });
        try {
          updatePreview(state.config);
        } catch (ePreview) {
          console.warn('[VisualEditor] preview update after save failed', ePreview);
        }
        if (!window.__MC_EDITOR_STANDALONE__) {
          try {
            applyEditorConfig(state.config);
          } catch (eApply) {
            console.warn('[VisualEditor] applyEditorConfig after save failed', eApply);
          }
        }
        if (saveBtn) {
          saveBtn.textContent = result && result.ok ? '已儲存 ✓' : '儲存失敗';
          updateEditorSaveStatusUi_(result && result.ok ? '已儲存' : '儲存失敗', result && result.ok ? 'ok' : 'err');
          setTimeout(function () {
            saveBtn.textContent = prevLabel || '儲存';
          }, result && result.ok ? 1600 : 2800);
        }
      } catch (errSave) {
        console.error('[VisualEditor] save click failed', errSave);
        showEditorSaveToast_('儲存失敗：' + (errSave && errSave.message ? errSave.message : String(errSave)), 'err');
        if (saveBtn) {
          saveBtn.textContent = '儲存失敗';
          setTimeout(function () {
            saveBtn.textContent = prevLabel || '儲存';
          }, 2800);
        }
      } finally {
        if (saveBtn) saveBtn.disabled = false;
      }
    });
    bindBtn_('[data-editor-action="reset"]', function () {
      if (!window.confirm('確定要清除所有編輯並還原預設？此操作無法復原。')) return;
      try {
        localStorage.removeItem(MC_EDITOR_STORAGE_KEY);
      } catch (e) {
        void 0;
      }
      state.config = normalizeEditorConfig_(DEFAULT_MC_EDITOR_CONFIG);
      state.entryCardIndex = 0;
      buildEditorPanelFields_(state);
      updatePreview(state.config);
      updateEditorSaveStatusUi_('已還原預設', 'ok');
      showEditorSaveToast_('已重設為預設設定', 'ok');
    });
    bindBtn_('[data-editor-action="inspect-toggle"]', function () {
      if (typeof hooks.setInspectMode === 'function') hooks.setInspectMode(!state.inspectMode);
    });
    bindBtn_('[data-editor-action="preview-motion"]', function () {
      state.previewMotionEnabled = !state.previewMotionEnabled;
      if (typeof hooks.applyPreviewMotionState === 'function') hooks.applyPreviewMotionState(false);
    });
    bindBtn_('[data-editor-action="exit"]', function () {
      if (editorPersistTimer_) {
        clearTimeout(editorPersistTimer_);
        editorPersistTimer_ = null;
      }
      commitEditorSave_(state.config, { notify: false, downloadFallback: true });
      applyEditorConfig(getEditorConfig());
      document.documentElement.classList.remove('mc-editor-mode');
      if (hooks.onEditorMessage) window.removeEventListener('message', hooks.onEditorMessage);
      if (shell.__mcEditorKeydown) window.removeEventListener('keydown', shell.__mcEditorKeydown);
      if (shell.parentNode) shell.parentNode.removeChild(shell);
      if (window.__MC_EDITOR_STANDALONE__) {
        window.location.href = 'UI.html?staticPreview=1';
        return;
      }
      var x = new URL(window.location.href);
      x.searchParams.delete('editor');
      x.searchParams.delete('staticPreview');
      x.searchParams.delete('previewMotion');
      x.searchParams.delete('editorPreview');
      x.searchParams.delete('editorSection');
      window.history.replaceState({}, '', x.toString());
    });
    function onEditorKeydown_(ev) {
      if (!document.getElementById('mcVisualEditor')) return;
      if ((ev.ctrlKey || ev.metaKey) && String(ev.key || '').toLowerCase() === 's') {
        ev.preventDefault();
        var btn = document.querySelector('#mcVisualEditor [data-editor-action="save"]');
        if (btn) btn.click();
      }
    }
    shell.__mcEditorKeydown = onEditorKeydown_;
    window.addEventListener('keydown', onEditorKeydown_);
  }

  function openVisualEditorOverlay_() {
    var existingShell = document.getElementById('mcVisualEditor');
    if (existingShell && existingShell.getAttribute('data-editor-ready') === '1') return;
    if (existingShell && existingShell.parentNode) existingShell.parentNode.removeChild(existingShell);
    window.__MC_EDITOR_ALL_PAGES__ = isEditorAllPagesMode_();
    console.log('[VisualEditor] active build: ' + VISUAL_EDITOR_BUILD_TAG);
    console.log('[VisualEditor] all pages mode: ' + (window.__MC_EDITOR_ALL_PAGES__ ? 'ON' : 'off'));
    console.log('[VisualEditor] loaded file source check');
    console.log('[VisualEditor] editor mode:', new URLSearchParams(String((window.location && window.location.search) || '')).get('editor'));
    injectEditorStyles_();
    document.documentElement.classList.add('mc-editor-mode');
    var shell = document.createElement('div');
    shell.id = 'mcVisualEditor';
    shell.className = 'mc-editor-shell';
    shell.innerHTML =
      '<aside class="mc-editor-sidebar"><h2>MCurator 視覺編輯器</h2>' +
      '<details class="mc-editor-help" open><summary>📖 使用說明（點此收合）</summary><div class="mc-editor-help__body">' +
      '<p>① 左側選<strong>內容區塊</strong> → 預覽會捲到該區</p>' +
      '<p>② 點預覽中的<strong>文字</strong>編輯（雙擊可現場改）</p>' +
      '<p>③ 標本卡內容請用「典藏牆」面板，勿點整張卡片</p>' +
      '<p>④ 變更會<strong>自動儲存</strong>；<kbd>Ctrl+S</kbd> 可手動儲存</p>' +
      '</div></details>' +
      '<div class="mc-editor-save-status" data-editor-save-status data-status="idle">就緒</div>' +
      '<input type="search" class="mc-editor-page-search" data-editor-page-search placeholder="搜尋頁面…" autocomplete="off" />' +
      '<div class="mc-editor-group-title">頁面</div><div data-editor-pages class="mc-editor-repeater"></div>' +
      '<div class="mc-editor-group-title">內容區塊</div><div data-editor-sections class="mc-editor-repeater mc-editor-section-list"></div>' +
      '<details class="mc-editor-details"><summary>進階元件</summary><div data-editor-components class="mc-editor-repeater"></div></details></aside>' +
      '<main class="mc-editor-preview"><div class="mc-editor-toolbar">' +
      '<span class="mc-editor-toolbar__brand">' + VISUAL_EDITOR_BUILD_TAG + '</span>' +
      '<span class="mc-editor-save-status mc-editor-save-status--toolbar" data-editor-save-status data-status="idle"></span>' +
      '<div class="mc-editor-viewport-toggle" role="group" aria-label="Preview width">' +
      '<button type="button" data-editor-viewport="desktop" class="is-active" title="桌面版預覽">桌面</button>' +
      '<button type="button" data-editor-viewport="tablet" title="平板 768px">平板</button>' +
      '<button type="button" data-editor-viewport="mobile" title="手機 390px">手機</button></div>' +
      '<button type="button" data-editor-action="inspect-toggle" title="開啟時可點選元素；標本卡一般點擊仍可翻面">選取模式 ON</button>' +
      '<button type="button" data-editor-action="preview-motion" title="編輯時建議關閉動畫">動畫 Off</button>' +
      '<button type="button" data-editor-action="preview" title="隱藏側欄全螢幕預覽">全螢幕</button>' +
      '<button type="button" data-editor-action="save" class="mc-editor-action-btn--primary" style="min-height:34px;width:auto;margin:0" title="Ctrl+S">儲存</button>' +
      '<button type="button" data-editor-action="reset" title="清除 localStorage 並還原預設">重設</button>' +
      '<button type="button" data-editor-action="exit" title="儲存後離開">離開</button></div>' +
      '<div class="mc-editor-hint-bar" data-editor-hint-bar>直接點預覽文字或標本卡欄位（產地/日期）即可編輯 · 左側 Hero/Coverflow 面板也可改 · <kbd>Esc</kbd> 取消 · <kbd>Alt</kbd>+點 按鈕</div>' +
      '<div class="mc-editor-frame-wrap" data-editor-viewport="desktop">' +
      '<div class="mc-editor-frame-loading" data-editor-frame-loading>載入預覽中…</div>' +
      '<iframe id="mcEditorFrame" title="MCurator 頁面預覽"></iframe></div></main>' +
      '<aside class="mc-editor-properties"><h3 data-editor-panel-title>屬性面板</h3><div data-editor-fields></div></aside>';
    document.body.appendChild(shell);

    var sectionNames = {
      hero: 'Hero 首頁',
      entry: '入口卡片',
      coverflow: '典藏牆 Coverflow',
      specimenCard: '標本卡片',
      workflow: '工作流程',
      grading: '標本評分',
      project: '進階設定',
    };
    var sectionMeta = {
      hero: { icon: '🏠' },
      entry: { icon: '🚪' },
      coverflow: { icon: '🃏' },
      specimenCard: { icon: '💳' },
      workflow: { icon: '⚙️' },
      grading: { icon: '⭐' },
      project: { icon: '🔧' },
    };
    var state = {
      config: ensureEditorCoverflowItems_(getEditorConfig()),
      section: 'hero',
      activeSection: 'hero',
      sectionNames: sectionNames,
      entryCardIndex: 0,
      previewReady: false,
      pageFilter: '',
      projectScanError: '',
      inspectMode: true,
      previewMotionEnabled: false,
      previewViewport: 'desktop',
      activeInspectorMode: 'empty',
      selectedElement: null,
      scanResult: [],
      render: function () {
        state.config = syncEditorStructuredFieldsToOverrides_(state.config);
        updatePreview(state.config);
        schedulePersistEditorConfig_(state.config);
      },
    };
    function resolveEditorPageUrl_(page, previewMotionEnabled) {
      var raw = String((page && page.path) || 'UI.html');
      var hash = '';
      var hashIdx = raw.indexOf('#');
      if (hashIdx >= 0) {
        hash = raw.slice(hashIdx + 1);
        raw = raw.slice(0, hashIdx);
      }
      if (page && page.id === 'landing' && /^editor-preview\.html/i.test(raw)) {
        raw = 'UI.html';
      }
      var next = null;
      try {
        next = new URL(raw, window.location.href);
      } catch (eU) {
        next = new URL(window.location.href);
      }
      next.searchParams.set('editor', '1');
      next.searchParams.set('editorPreview', '1');
      next.searchParams.set('staticPreview', previewMotionEnabled ? '0' : '1');
      next.searchParams.set('previewMotion', previewMotionEnabled ? '1' : '0');
      if (isEditorAllPagesMode_()) {
        next.searchParams.set('allPages', '1');
        next.searchParams.set('editorAllPages', '1');
      }
      var out = next.toString();
      if (hash) out += '#' + hash;
      return out;
    }
    function switchEditorPage_(pageId) {
      var pages = Array.isArray(state.config.pages) ? state.config.pages : [];
      var page = null;
      for (var i = 0; i < pages.length; i++) {
        if (pages[i] && pages[i].id === pageId) {
          page = pages[i];
          break;
        }
      }
      if (!page) return;
      state.config.activePageId = page.id;
      state.selectedElement = null;
      state.activeInspectorMode = 'empty';
      saveEditorConfig(state.config);
      state.previewReady = false;
      var fl0 = shell.querySelector('[data-editor-frame-loading]');
      if (fl0) fl0.hidden = false;
      frame.src = resolveEditorPageUrl_(page, state.previewMotionEnabled);
      renderSidebarNav_();
      buildEditorPanelFields_(state);
    }
    function renderSidebarNav_() {
      var pagesRoot = shell.querySelector('[data-editor-pages]');
      var sectionsRoot = shell.querySelector('[data-editor-sections]');
      var compsRoot = shell.querySelector('[data-editor-components]');
      if (!pagesRoot || !sectionsRoot || !compsRoot) return;
      pagesRoot.innerHTML = '';
      sectionsRoot.innerHTML = '';
      compsRoot.innerHTML = '';
      var pageFilter = String(state.pageFilter || '').trim().toLowerCase();
      var pages = Array.isArray(state.config.pages) ? state.config.pages : [];
      var visibleCount = 0;
      for (var pi = 0; pi < pages.length; pi++) {
        (function (p) {
          var title = String((p && p.title) || p.id || '');
          if (pageFilter && title.toLowerCase().indexOf(pageFilter) < 0 && String(p.id || '').toLowerCase().indexOf(pageFilter) < 0) {
            return;
          }
          visibleCount += 1;
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'mc-editor-page-btn';
          b.setAttribute('data-page-id', p.id);
          b.textContent = (p.icon || '📄') + ' ' + title;
          if (String(state.config.activePageId || 'landing') === String(p.id)) b.classList.add('is-active');
          b.addEventListener('click', function () {
            switchEditorPage_(p.id);
          });
          pagesRoot.appendChild(b);
        })(pages[pi] || {});
      }
      if (!visibleCount) {
        var emptyPages = document.createElement('p');
        emptyPages.className = 'mc-editor-field__hint';
        emptyPages.textContent = '找不到符合的頁面';
        pagesRoot.appendChild(emptyPages);
      }
      ['hero', 'entry', 'coverflow', 'specimenCard', 'workflow', 'grading', 'project'].forEach(function (sec) {
        var meta = sectionMeta[sec] || {};
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mc-editor-section-btn';
        b.setAttribute('data-section', sec);
        b.textContent = (meta.icon || '•') + ' ' + (sectionNames[sec] || sec);
        if (state.activeSection === sec) b.classList.add('is-active');
        b.addEventListener('click', function () {
          state.section = sec;
          state.activeSection = sec;
          state.activeInspectorMode = 'section';
          state.selectedElement = null;
          renderSidebarNav_();
          buildEditorPanelFields_(state);
          scrollIframeToEditorSection_(frame, sec);
        });
        sectionsRoot.appendChild(b);
      });
      var compItems = [
        { key: 'addSection', label: '＋ 新增區塊' },
        { key: 'addCard', label: '＋ 新增卡片' },
        { key: 'addImage', label: '＋ 新增圖片' },
        { key: 'addButton', label: '＋ 新增按鈕' },
        { key: 'addText', label: '＋ 新增文字' },
      ];
      compItems.forEach(function (ci) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = ci.label;
        b.addEventListener('click', function () {
          state.activeSection = 'project';
          state.section = 'project';
          state.activeInspectorMode = 'section';
          state.quickAddType = ci.key;
          renderSidebarNav_();
          buildEditorPanelFields_(state);
        });
        compsRoot.appendChild(b);
      });
    }
    try {
      var q = new URLSearchParams(String((window.location && window.location.search) || ''));
      var secFromQuery = q.get('editorSection') || window.__MC_EDITOR_OPEN_SECTION__;
      if (secFromQuery && sectionNames[secFromQuery]) {
        state.section = secFromQuery;
        state.activeSection = secFromQuery;
      }
    } catch (eSec) {
      void 0;
    }
    var frame = shell.querySelector('#mcEditorFrame');
    var u = new URL(window.location.href);
    u.searchParams.delete('editor');
    u.searchParams.set('editorPreview', '1');
    var activePage = null;
    var pages0 = Array.isArray(state.config.pages) ? state.config.pages : [];
    for (var ap = 0; ap < pages0.length; ap++) {
      if (pages0[ap] && pages0[ap].id === state.config.activePageId) {
        activePage = pages0[ap];
        break;
      }
    }
    if (!activePage) activePage = { id: 'landing', path: u.toString() };
    var pageSearch = shell.querySelector('[data-editor-page-search]');
    if (pageSearch && pageSearch.getAttribute('data-editor-bound') !== '1') {
      pageSearch.setAttribute('data-editor-bound', '1');
      pageSearch.addEventListener('input', function () {
        state.pageFilter = pageSearch.value || '';
        renderSidebarNav_();
      });
    }
    var frameLoading = shell.querySelector('[data-editor-frame-loading]');
    if (frameLoading) frameLoading.hidden = false;
    frame.src = resolveEditorPageUrl_(activePage, state.previewMotionEnabled);
    renderSidebarNav_();
    buildEditorPanelFields_(state);
    function sendConfigToIframe_() {
      if (!frame || !frame.contentWindow) return;
      frame.contentWindow.postMessage({ type: 'MC_EDITOR_ENABLE_INSPECT', payload: { config: state.config } }, '*');
      frame.contentWindow.postMessage({ type: 'MC_EDITOR_APPLY_CONFIG', config: state.config }, '*');
    }
    function setInspectMode_(on) {
      state.inspectMode = !!on;
      var b = shell.querySelector('[data-editor-action="inspect-toggle"]');
      if (b) b.textContent = '選取 ' + (state.inspectMode ? 'ON' : 'OFF');
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({ type: state.inspectMode ? 'MC_EDITOR_ENABLE_INSPECT' : 'MC_EDITOR_DISABLE_INSPECT', payload: { config: state.config } }, '*');
      }
    }
    function applyPreviewMotionState_(forceOff) {
      var enabled = !forceOff && !!state.previewMotionEnabled;
      var btn = shell.querySelector('[data-editor-action="preview-motion"]');
      if (btn) {
        btn.textContent = '動畫 ' + (enabled ? 'On' : 'Off');
        btn.title = enabled
          ? '檢查公開網站動畫用；編輯選取時請關閉'
          : '建議編輯時保持關閉，選取更準確';
      }
      var activePage0 = null;
      var pages1 = Array.isArray(state.config.pages) ? state.config.pages : [];
      for (var pi = 0; pi < pages1.length; pi++) {
        if (pages1[pi] && pages1[pi].id === state.config.activePageId) {
          activePage0 = pages1[pi];
          break;
        }
      }
      if (!activePage0) activePage0 = { id: 'landing', path: 'UI.html' };
      if (frame) {
        frame.src = resolveEditorPageUrl_(activePage0, enabled);
      }
    }
    function onEditorMessage_(event) {
      if (!event || !event.data || !frame || event.source !== frame.contentWindow) return;
      var m = event.data;
      if (m.type === 'MC_EDITOR_IFRAME_READY') {
        state.previewReady = true;
        syncEditorCoverflowSeedFromIframe_(state, frame);
        sendConfigToIframe_();
        buildEditorPanelFields_(state);
      } else if (m.type === 'MC_EDITOR_ELEMENT_SELECTED') {
        if (state.previewMotionEnabled) {
          state.previewMotionEnabled = false;
          applyPreviewMotionState_(true);
          return;
        }
        state.selectedElement = m.payload || null;
        state.activeInspectorMode = 'selected';
        state.inspectorTab = null;
        state._inspectorTabFor = null;
        var inferred = inferEditorSectionFromElement_(state.selectedElement);
        if (state.selectedElement && state.selectedElement.cfField) {
          inferred = 'coverflow';
        }
        if (inferred && inferred !== state.activeSection) {
          state.section = inferred;
          state.activeSection = inferred;
          renderSidebarNav_();
        }
        buildEditorPanelFields_(state);
      } else if (m.type === 'MC_EDITOR_ELEMENT_DESELECTED') {
        state.selectedElement = null;
        state.activeInspectorMode = 'section';
        state.inspectorTab = null;
        buildEditorPanelFields_(state);
      } else if (m.type === 'MC_EDITOR_COVERFLOW_FIELD_COMMIT') {
        var cp = m.payload || {};
        if (cp.cfField != null && cp.cfIndex != null && String(cp.cfIndex) !== '') {
          state.config = applyCoverflowFieldUpdate_(state.config, cp.cfIndex, cp.cfField, cp.value);
          state.config = syncEditorStructuredFieldsToOverrides_(state.config);
          schedulePersistEditorConfig_(state.config);
          updatePreview(state.config);
          buildEditorPanelFields_(state);
        }
      } else if (m.type === 'MC_EDITOR_TEXT_COMMIT') {
        var tp = m.payload || {};
        if (tp.selector && !isEditorProtectedOverrideSelector_(tp.selector)) {
          state.config = normalizeEditorConfig_(state.config);
          var pageCfgText = getActivePageConfig_(state.config);
          if (!Array.isArray(pageCfgText.textOverrides)) pageCfgText.textOverrides = [];
          var foundT = -1;
          for (var ti = 0; ti < pageCfgText.textOverrides.length; ti++) {
            if (pageCfgText.textOverrides[ti] && pageCfgText.textOverrides[ti].selector === tp.selector) {
              foundT = ti;
              break;
            }
          }
          var rowT = {
            id: 'override_text_' + Date.now().toString(36),
            selector: tp.selector,
            property: 'textContent',
            value: tp.value,
            text: tp.value,
          };
          if (foundT < 0) pageCfgText.textOverrides.push(rowT);
          else pageCfgText.textOverrides[foundT] = mergeEditorConfig_(pageCfgText.textOverrides[foundT], rowT);
          state.config = syncEditorStructuredFieldsToOverrides_(state.config);
          schedulePersistEditorConfig_(state.config);
          updatePreview(state.config);
          buildEditorPanelFields_(state);
        }
      } else if (m.type === 'MC_EDITOR_ELEMENT_INPUT') {
        if (state.previewMotionEnabled) {
          state.previewMotionEnabled = false;
          applyPreviewMotionState_(true);
          return;
        }
        var p = m.payload || {};
        if (p.cfField != null && p.cfIndex != null && String(p.cfIndex) !== '') {
          state.config = applyCoverflowFieldUpdate_(state.config, p.cfIndex, p.cfField, p.value);
          state.section = 'coverflow';
          state.activeSection = 'coverflow';
          schedulePersistEditorConfig_(state.config);
          patchPreviewCoverflowField_(frame, p.cfIndex, p.cfField, p.value);
          renderSidebarNav_();
          buildEditorPanelFields_(state);
          return;
        }
        if (p.selector && (p.editType === 'text' || p.editType === 'coverflowField')) {
          if (p.editType === 'coverflowField' && p.cfField != null && p.cfIndex != null) {
            state.config = applyCoverflowFieldUpdate_(state.config, p.cfIndex, p.cfField, p.value);
            state.section = 'coverflow';
            state.activeSection = 'coverflow';
            schedulePersistEditorConfig_(state.config);
            patchPreviewCoverflowField_(frame, p.cfIndex, p.cfField, p.value);
            return;
          }
          if (isEditorProtectedOverrideSelector_(p.selector)) return;
          state.config = normalizeEditorConfig_(state.config);
          var pageCfgLive = getActivePageConfig_(state.config);
          var found = -1;
          for (var i = 0; i < pageCfgLive.textOverrides.length; i++) {
            if (pageCfgLive.textOverrides[i] && pageCfgLive.textOverrides[i].selector === p.selector) {
              found = i;
              break;
            }
          }
          var row = { id: 'override_text_' + Date.now().toString(36), selector: p.selector, property: 'textContent', value: p.value, text: p.value };
          if (found < 0) pageCfgLive.textOverrides.push(row);
          else pageCfgLive.textOverrides[found] = mergeEditorConfig_(pageCfgLive.textOverrides[found], row);
          schedulePersistEditorConfig_(state.config);
          patchPreviewText_(frame, p.selector, p.value);
        }
      } else if (m.type === 'MC_EDITOR_STYLE_DRAG_UPDATE') {
        if (state.previewMotionEnabled) {
          state.previewMotionEnabled = false;
          applyPreviewMotionState_(true);
          return;
        }
        var sp = (m && m.payload) || {};
        if (sp.selector && sp.styles && typeof sp.styles === 'object') {
          state.config = normalizeEditorConfig_(state.config);
          var pc = getActivePageConfig_(state.config);
          if (!Array.isArray(pc.styleOverrides)) pc.styleOverrides = [];
          var idxS = -1;
          for (var si = 0; si < pc.styleOverrides.length; si++) {
            if (pc.styleOverrides[si] && pc.styleOverrides[si].selector === sp.selector) {
              idxS = si;
              break;
            }
          }
          var rowS = idxS >= 0 ? pc.styleOverrides[idxS] : { id: 'style_' + Date.now().toString(36), selector: sp.selector, styles: {} };
          rowS.styles = mergeEditorConfig_(rowS.styles || {}, sp.styles || {});
          if (idxS < 0) pc.styleOverrides.push(rowS);
          else pc.styleOverrides[idxS] = rowS;
          if (state.selectedElement && state.selectedElement.selector === sp.selector && sp.computedStyle) {
            state.selectedElement.computedStyle = sp.computedStyle;
          }
          saveEditorConfig(state.config);
          updatePreview(state.config);
          buildEditorPanelFields_(state);
        }
      } else if (m.type === 'MC_EDITOR_SCAN_RESULT') {
        state.scanResult = (m.payload && m.payload.items) || m.payload || [];
        if (!Array.isArray(state.scanResult)) state.scanResult = [];
        state.activeInspectorMode = 'empty';
        buildEditorPanelFields_(state);
      }
    }
    frame.addEventListener('load', function () {
      state.previewReady = true;
      state.projectScanError = '';
      var fl = shell.querySelector('[data-editor-frame-loading]');
      if (fl) fl.hidden = true;
      try {
        var fdoc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
        if (fdoc && fdoc.documentElement && fdoc.body) {
          fdoc.documentElement.classList.remove('mc-boot-active');
          var bootSplash = fdoc.getElementById('mcBootSplash');
          if (bootSplash) bootSplash.remove();
          var welcomeShell = fdoc.getElementById('welcomeShell');
          if (welcomeShell) {
            welcomeShell.style.removeProperty('visibility');
            welcomeShell.style.removeProperty('pointer-events');
            welcomeShell.removeAttribute('inert');
          }
          if (state.previewMotionEnabled) {
            fdoc.documentElement.classList.remove('editor-static-preview');
            fdoc.body.classList.remove('editor-static-preview');
            fdoc.documentElement.setAttribute('data-preview-motion', 'on');
          } else {
            fdoc.documentElement.classList.add('editor-static-preview');
            fdoc.body.classList.add('editor-static-preview');
            fdoc.documentElement.setAttribute('data-editor-mode', 'true');
            fdoc.body.setAttribute('data-editor-mode', 'true');
            fdoc.documentElement.setAttribute('data-preview-motion', 'off');
            if (window.MCuratorEditorMode && typeof window.MCuratorEditorMode.freezePreviewVideos === 'function') {
              window.MCuratorEditorMode.freezePreviewVideos(fdoc);
            }
          }
        }
        var hasMain = !!(fdoc && fdoc.querySelector && fdoc.querySelector('#welcomeMuseumBody, main, #app'));
        if (fdoc && !hasMain) {
          var ph = fdoc.createElement('div');
          ph.style.cssText =
            'margin:40px auto;max-width:680px;padding:20px;border-radius:16px;border:1px solid rgba(255,255,255,.2);background:#0d1316;color:#f4efe1;font-family:system-ui';
          ph.textContent = 'This page route is not implemented yet.';
          if (fdoc.body) fdoc.body.appendChild(ph);
        }
        try {
          var frameUrl = new URL(frame.src);
          var hashId = frameUrl.hash ? frameUrl.hash.replace(/^#/, '') : '';
          if (hashId && fdoc) {
            var scrollTarget = fdoc.getElementById(hashId);
            if (scrollTarget && scrollTarget.scrollIntoView) {
              scrollTarget.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
          }
        } catch (eHashScroll) {
          void 0;
        }
      } catch (ePh) {
        void 0;
      }
      syncEditorCoverflowSeedFromIframe_(state, frame);
      updatePreview(state.config);
      sendConfigToIframe_();
      buildEditorPanelFields_(state);
    });
    window.addEventListener('message', onEditorMessage_);
    bindEditorShellToolbar_(shell, state, {
      onEditorMessage: onEditorMessage_,
      setInspectMode: setInspectMode_,
      applyPreviewMotionState: applyPreviewMotionState_,
    });
    setInspectMode_(true);
    var frameWrap = shell.querySelector('.mc-editor-frame-wrap');
    shell.querySelectorAll('[data-editor-viewport]').forEach(function (vpBtn) {
      vpBtn.type = 'button';
      vpBtn.addEventListener('click', function () {
        var mode = vpBtn.getAttribute('data-editor-viewport') || 'desktop';
        state.previewViewport = mode;
        if (frameWrap) frameWrap.setAttribute('data-editor-viewport', mode);
        shell.querySelectorAll('[data-editor-viewport]').forEach(function (b) {
          b.classList.toggle('is-active', b.getAttribute('data-editor-viewport') === mode);
        });
      });
    });
    shell.setAttribute('data-editor-ready', '1');
  }

  function initVisualEditorBridge_() {
    if (window.__MC_VISUAL_EDITOR_BRIDGE__) return;
    window.__MC_VISUAL_EDITOR_BRIDGE__ = true;
    window.DEFAULT_MC_EDITOR_CONFIG = DEFAULT_MC_EDITOR_CONFIG;
    window.getEditorConfig = getEditorConfig;
    window.saveEditorConfig = saveEditorConfig;
    window.applyEditorConfig = applyEditorConfig;
    window.commitEditorSave = commitEditorSave_;
    window.openVisualEditorOverlay = openVisualEditorOverlay_;
    patchApplyI18nForEditor_();
    patchEditorContentStompGuard_();
    if (shouldFreezeEditorPreview_()) {
      applyEditorStaticPreviewState_(true);
    }
    try {
      initEditorPreviewRuntime_();
    } catch (ePreviewRt) {
      console.warn('[VisualEditor] initEditorPreviewRuntime_ failed', ePreviewRt);
    }
    bindEditorMessageReceiver_();
    collapseLegacyContentStudio_();
    var b = document.getElementById('btnOpenVisualEditor');
    if (b && b.getAttribute('data-editor-bound') !== '1') {
      b.setAttribute('data-editor-bound', '1');
      b.addEventListener('click', openVisualEditorOverlay_);
    }
    var params = new URLSearchParams(String((window.location && window.location.search) || ''));
    if (params.get('editor') === '1' && params.get('editorPreview') !== '1') {
      openVisualEditorOverlay_();
    }
    if (params.get('editorPreview') === '1' || hasSavedEditorConfig_()) {
      applyEditorConfig(getEditorConfig());
      scheduleReapplyEditorConfig_();
    }
  }

  function onReady() {
    var isEditorStatic = shouldFreezeEditorPreview_();
    var editorEntry = false;
    try {
      var p0 = new URLSearchParams(String((window.location && window.location.search) || ''));
      editorEntry = p0.get('editor') === '1' && p0.get('editorPreview') !== '1';
    } catch (eEd) {
      editorEntry = false;
    }
    if (editorEntry) {
      try {
        initVisualEditorBridge_();
      } catch (eEditorBoot) {
        console.error('[VisualEditor] initVisualEditorBridge_ failed', eEditorBoot);
      }
    }
    // Keep first landing paint pinned to Hero top; never auto-jump sections on boot.
    (function enforceInitialLandingTop_() {
      if (window.__MC_INIT_TOP_LOCKED__) return;
      window.__MC_INIT_TOP_LOCKED__ = true;
      var params = new URLSearchParams(String((window.location && window.location.search) || ''));
      if (params.get('editor') === '1') return;
      try {
        if (window.history && 'scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
      } catch (eSr) {
        void 0;
      }
      var pinTop = function () {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } catch (eTop) {
          window.scrollTo(0, 0);
        }
        try {
          var sh = document.getElementById('welcomeShell');
          if (sh && sh.scrollTo) {
            sh.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          }
        } catch (eSh) {
          void 0;
        }
      };
      pinTop();
      window.addEventListener(
        'load',
        function () {
          requestAnimationFrame(pinTop);
        },
        { once: true }
      );
    })();

    /* 標本卡功能區：與 isLandingMode 無關；示範卡翻面/傾斜僅綁在此區，避免後台整頁掃描 */
    var labSec = document.querySelector('.specimen-card-function-lab');
    if (labSec) {
      try {
        initSpecimenRecordCards(labSec);
      } catch (eLabCards) {
        console.warn('[MCurator] initSpecimenRecordCards(lab) skipped', eLabCards);
      }
    }
    try {
      initSpecimenFunctionSystem(document);
    } catch (eFnSys) {
      console.warn('[MCurator] initSpecimenFunctionSystem skipped', eFnSys);
    }
    try {
      initWorkflowQuestBoard(document);
    } catch (eQuest) {
      console.warn('[MCurator] initWorkflowQuestBoard skipped', eQuest);
    }
    try {
      initWorkflowQuestOnboarding(document);
    } catch (eQuestOn) {
      console.warn('[MCurator] initWorkflowQuestOnboarding skipped', eQuestOn);
    }
    if (!editorEntry) {
      initVisualEditorBridge_();
    }
    /* Editor iframe: still wire tilt/flip; static preview skips heavy hero init below. */
    if (isEditorPreviewMode_() || isEditorStatic) {
      initSpecimenRecordCards(document);
      ensureEditorHeroCardVisible_();
    }
    if (isEditorStatic) return;

    if (!isLandingMode()) return;
    if (window.__MCURATOR_HOMEPAGE_INIT__) return;
    window.__MCURATOR_HOMEPAGE_INIT__ = true;
    initDevLanding();
    initHero3d();
    initPassportDeck();
    initFragmentHighlights();
    initJourneyUsp();
    initWorkflowPipe();
    initSpecimenRecordCards(document);
    initHeroTrioCards();
    initLandingTrioIntro_();
    if (hasSavedEditorConfig_()) {
      applyEditorConfig(getEditorConfig());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
