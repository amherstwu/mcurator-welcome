/**
 * Specimen Card Generator / Passport Studio — UI copy (zh-TW / en / ja).
 */
(function (global) {
  'use strict';

  global.MCSpecimenCardGeneratorCopy = {
    brandEyebrow: { zh: '標本卡片護照流程', en: 'Specimen passport workflow', ja: '標本パスポートのワークフロー', de: 'Ablauf des Präparat-Passes' },
    brandSub: { zh: '標本卡片護照 · 建立與匯出', en: 'Specimen passport · create & export', ja: '標本パスポート · 作成とエクスポート', de: 'Präparat-Pass · anlegen und exportieren' },
    brandAria: { zh: 'MCurator Passport Studio', en: 'MCurator Passport Studio', ja: 'MCurator Passport Studio', de: 'MCurator Pass Studio' },
    previewLabel: { zh: '標籤即時預覽', en: 'Label live preview', ja: 'ラベルのライブプレビュー', de: 'Etikett-Livevorschau' },
    previewPassport: { zh: '卡片護照預覽（主產品）', en: 'Passport card preview (primary)', ja: 'パスポートカードプレビュー（プライマリー）', de: 'Passkarten-Vorschau (Hauptansicht)' },
    tourRestart: { zh: '【重新查看導引】', en: '[Restart tour]', ja: '【ツアー再開】', de: '[Führung neu starten]' },

    tabCardPassport: { zh: '卡片護照', en: 'Passport card', ja: 'パスポートカード', de: 'Passkarte' },
    tabCardPassportSub: { zh: '主流程', en: 'Main flow', ja: '主な流れ', de: 'Hauptablauf' },
    tabSampleLabel: { zh: '樣本標籤', en: 'Sample label', ja: 'サンプルラベル', de: 'Probenetikett' },
    tabSampleLabelSub: { zh: '標籤專用', en: 'Label only', ja: 'ラベルのみ', de: 'Nur Etikett' },
    tabBatchPrint: { zh: '批次列印', en: 'Batch print', ja: 'バッチプリント', de: 'Stapeldruck' },
    tabBatchPrintSub: { zh: '多筆輸出', en: 'Multi export', ja: 'マルチエクスポート', de: 'Mehrfachausgabe' },
    tabBackAssets: { zh: '背板素材', en: 'Back assets', ja: 'バックアセット', de: 'Rückseitenmaterial' },
    tabBackAssetsSub: { zh: '圖庫', en: 'Library', ja: '素材ライブラリ', de: 'Bibliothek' },

    wfStep0Title: { zh: '安裝標本影像', en: 'Install specimen image', ja: '標本画像をセット', de: 'Präparatbild einsetzen' },
    wfStep0Sub: { zh: '上傳照片與影像設定', en: 'Upload photo & image settings', ja: '写真と画像の設定をアップロードする', de: 'Foto und Bildeinstellungen hochladen' },
    wfStep1Title: { zh: '快速辨識物種', en: 'Quick species ID', ja: 'クイック種ID', de: 'Schnell Art ID' },
    wfStep1Sub: { zh: 'AI 或手動學名', en: 'AI or manual scientific name', ja: 'AI または手入力の学名', de: 'KI oder manueller wissenschaftlicher Name' },
    wfStep2Title: { zh: '標本身份與分類', en: 'Identity & taxonomy', ja: '身元と分類', de: 'Identität und Taxonomie' },
    wfStep2Sub: { zh: '館號、GBIF、標籤', en: 'Catalog no., GBIF, tags', ja: 'カタログ番号、GBIF、タグ', de: 'Katalognummer, GBIF, Schlagwörter' },
    wfStep3Title: { zh: '時地與來源', en: 'Time, place & provenance', ja: '日時、場所、来歴', de: 'Zeit, Ort und Herkunft' },
    wfStep3Sub: { zh: '依學名補基本時地；可選人工飼養個體', en: 'Basic locality from scientific name; captive option', ja: '学名から基本の産地を補う。飼育個体も選べる', de: 'Grundlegender Fundort aus dem wissenschaftlichen Namen; Option für Haltung' },
    wfStep4Title: { zh: '是否公開、授權與護照樣式', en: 'Visibility, license & passport style', ja: '公開範囲、ライセンス、パスポートのスタイル', de: 'Sichtbarkeit, Lizenz und Passstil' },
    wfStep4Sub: { zh: '公開狀態、QR、材質與背板', en: 'Visibility, QR, material & back', ja: '可視性、QR、素材、背面', de: 'Sichtbarkeit, QR, Material und Rückseite' },
    wfStep5Title: { zh: '樣本標籤', en: 'Sample label', ja: 'サンプルラベル', de: 'Probenetikett' },
    wfStep5Sub: { zh: '選用標籤輸出', en: 'Optional label output', ja: 'オプションのラベル出力', de: 'Optionale Etikettausgabe' },
    wfStep6Title: { zh: '匯出', en: 'Export', ja: 'エクスポート', de: 'Exportieren' },
    wfStep6Sub: { zh: '下載與列印', en: 'Download & print', ja: 'ダウンロードして印刷', de: 'Herunterladen und drucken' },

    wfStatusActive: { zh: '進行中', en: 'In progress', ja: '進行中', de: 'In Bearbeitung' },
    wfStatusSkipped: { zh: '已略過', en: 'Skipped', ja: 'スキップされました', de: 'Übersprungen' },
    wfStatusDone: { zh: '已完成', en: 'Done', ja: '完了', de: 'Erledigt' },
    wfStatusNeedData: { zh: '需補資料', en: 'Needs data', ja: 'データが必要です', de: 'Daten fehlen' },
    wfStatusPending: { zh: '未開始', en: 'Not started', ja: '開始されていません', de: 'Nicht begonnen' },
    wfPreparing: { zh: '準備中', en: 'Preparing', ja: '準備中です', de: 'Wird vorbereitet' },
    wfDockAria: { zh: '卡片護照建立流程', en: 'Passport card workflow', ja: 'パスポートカード作成フロー', de: 'Passport-Karten-Workflow' },
    wfDrawerMeta: {
      zh: '第 __N__ 步，共 __TOTAL__ 步 · 已完成 __PCT__%',
      en: 'Step __N__ of __TOTAL__ · __PCT__% complete',
      ja: 'ステップ __N__／__TOTAL__ · __PCT__% 完了',
      de: 'Schritt __N__ von __TOTAL__ · __PCT__% abgeschlossen',
    },
    wfProgressAria: { zh: '整體完成度', en: 'Overall completion', ja: '全体の完成度', de: 'Gesamtfortschritt' },
    inspectorAdvancedTitle: { zh: '進階欄位', en: 'Advanced fields', ja: '詳細フィールド', de: 'Erweiterte Felder' },

    smartFillBtn: { zh: '一鍵智慧填寫', en: 'Smart fill all', ja: 'スマートにすべてを入力', de: 'Smart Füllen alle' },
    smartFillHint: { zh: '上傳照片或輸入俗名後，一次帶入物種、館號、時地與預設；填完再逐欄微調。', en: 'After photo or vernacular hint, fill species, IDs, locality & defaults in one pass—then tweak fields.', ja: '写真や現地語のヒントを入力した後、種、ID、産地、デフォルトを 1 回のパスで入力し、フィールドを微調整します。', de: 'Nach Foto oder Trivialnamen-Hinweis Arten, IDs, Fundort und Vorgaben in einem Durchgang übernehmen — danach Felder nachschärfen.'
    },
    smartFillTipSummary: { zh: '智慧填寫會做什麼？', en: 'What does smart fill do?', ja: 'スマート入力は何をしますか？', de: 'Was macht die intelligente Übernahme?' },
    smartFillTipBody: { zh: '依序：讀取照片 EXIF（日期／GPS）→ 辨識或對照學名 → 配發 SAT／館號與分類標籤 → 依學名補時地與是否公開 → 樣本標籤預設略過。已填欄位不覆寫；完成後會跳到第一個尚需微調的步驟。', en: 'Reads EXIF, resolves species, assigns SAT/catalog IDs & tags, fills locality & visibility from scientific name, skips optional label by default. Never overwrites filled fields; jumps to the first step still needing review.', ja: 'EXIF を読み取り、種を解決し、SAT/カタログ ID とタグを割り当て、学名から産地と可視性を入力し、デフォルトでオプションのラベルをスキップします。入力されたフィールドは決して上書きされません。まだレビューが必要な最初のステップにジャンプします。', de: 'Liest EXIF, löst die Art auf, vergibt SAT- und Katalog-IDs sowie Schlagwörter, füllt Fundort und Sichtbarkeit aus dem wissenschaftlichen Namen und überspringt das optionale Etikett. Gefüllte Felder werden nie überschrieben. Springt zum ersten Schritt, der noch geprüft werden muss.'
    },
    smartFillNeedImageOrHint: { zh: '請先上傳照片，或在學名／俗名欄輸入至少 2 個字元', en: 'Upload a photo or enter at least 2 characters as scientific/vernacular name', ja: '写真をアップロードするか、学名または一般名を2文字以上入力してください', de: 'Laden Sie ein Foto hoch oder geben Sie mindestens 2 Zeichen als wissenschaftlichen oder Trivialnamen ein'
    },
    smartFillStarting: { zh: '一鍵填寫：讀取照片資訊…', en: 'Smart fill: reading photo…', ja: 'スマートフィル: 写真を読み取り中…', de: 'Intelligente Übernahme: Foto wird gelesen…' },
    smartFillRunning: { zh: '一鍵填寫進行中…', en: 'Smart fill in progress…', ja: 'スマートな入力が進行中…', de: 'Intelligente Übernahme läuft…' },
    smartFillPhaseSpecies: { zh: '一鍵填寫：辨識物種…', en: 'Smart fill: species ID…', ja: 'スマートフィル: 種 ID…', de: 'Smart Füllen: Art ID…' },
    smartFillPhaseTaxonomy: { zh: '一鍵填寫：分類與館號…', en: 'Smart fill: taxonomy & IDs…', ja: 'スマートフィル: 分類と ID…', de: 'Intelligente Übernahme: Taxonomie und Kennungen…' },
    smartFillPhaseOrigin: { zh: '一鍵填寫：時地與來源…', en: 'Smart fill: locality…', ja: 'スマートフィル: 地域…', de: 'Intelligente Übernahme: Fundort…' },
    smartFillDone: {
      zh: '一鍵填寫完成，請在標示步驟微調細節',
      en: 'Smart fill done—review highlighted steps and tweak as needed',
      ja: 'スマートフィル完了 - 強調表示された手順を確認し、必要に応じて調整します', de: 'Intelligentes Füllen abgeschlossen. Markierte Schritte prüfen und bei Bedarf anpassen.'
    },
    smartFillFailed: { zh: '一鍵填寫未完成，請手動補齊或稍後重試', en: 'Smart fill did not finish—complete fields manually or retry', ja: 'スマートフィルが完了しませんでした - 手動でフィールドに入力するか、再試行してください', de: 'Intelligentes Füllen wurde nicht abgeschlossen. Felder von Hand ergänzen oder erneut versuchen.'
    },

    vernacularBlockTitle: { zh: '俗名（多語言）', en: 'Vernacular names', ja: '一般名（多言語）', de: 'Trivialnamen (mehrsprachig)' },
    vernacularEnrichBtn: { zh: '查詢俗名', en: 'Look up names', ja: '一般名を検索', de: 'Namen nachschlagen' },
    vernacularEnglishLabel: { zh: '英文俗名', en: 'English common name', ja: '英語名', de: 'Englischer Trivialname' },
    vernacularPrimaryPh: { zh: '例：巨顎叉角鍬形蟲、Elephant beetle', en: 'e.g. Giant stag beetle', ja: '例：オオクワガタ、Elephant beetle', de: 'z. B. Riesen-Hirschkäfer' },
    vernacularEnglishPh: { zh: 'Giant stag beetle', en: 'Giant stag beetle', ja: 'オオクワガタ', de: 'Riesen-Hirschkäfer' },
    vernacularLocalePh: { zh: '巨顎叉角鍬形蟲', en: 'Local vernacular name', ja: 'オオクワガタ', de: 'Lokaler Trivialname' },
    vernacularHint: {
      zh: '有學名時會自動向 GBIF／iNaturalist 補英／中俗名；標籤步驟可獨立選擇顯示語言。',
      en: 'When a scientific name is set, GBIF and iNaturalist can fill English and locale-specific vernacular names for labels.',
      ja: '学名がある場合、GBIFとiNaturalistから英語名と日本語名を補完できます。ラベル表示言語は別途選択できます。',
      de: 'Bei gesetztem wissenschaftlichen Namen fuellen GBIF und iNaturalist englische und lokalisierte Trivialnamen fuer Etiketten.'
    },
    vernacularEnrichLoading: { zh: '正在查詢 GBIF／iNaturalist 俗名…', en: 'Looking up GBIF / iNaturalist names…', ja: 'GBIF／iNaturalist から一般名を検索中…', de: 'Suche GBIF / iNaturalist-Namen…' },
    vernacularEnrichOk: { zh: '俗名已更新（英／中可各自用於標籤）。', en: 'Vernacular names updated for labels.', ja: '一般名を更新しました（ラベルに利用できます）。', de: 'Trivialnamen fuer Etiketten aktualisiert.' },
    vernacularEnrichPartial: { zh: '部分俗名已就緒；可手動補齊或再查詢。', en: 'Some vernacular names are ready; edit manually or search again.', ja: '一部の一般名が利用可能です。手動で編集するか再検索してください。', de: 'Einige Trivialnamen sind bereit; manuell ergaenzen oder erneut suchen.' },
    vernacularEnrichNone: { zh: '查無額外俗名；可手動輸入或以俗名搜尋物種。', en: 'No extra vernacular names found; enter manually or search by vernacular name.', ja: '追加の一般名は見つかりませんでした。手動入力または一般名で検索してください。', de: 'Keine zusaetzlichen Trivialnamen gefunden; manuell eingeben oder nach Trivialname suchen.' },

    errNeedImage: { zh: '請先安裝標本影像', en: 'Please install a specimen image first', ja: '先に標本画像を入れてください', de: 'Setzen Sie zuerst ein Präparatbild ein.' },
    errNeedSpeciesId: {
      zh: '請完成快速辨識（套用候選、輸入學名 ≥3 字元、或跳過）',
      en: 'Complete quick ID (apply a candidate, enter ≥3-char scientific name, or skip)',
      ja: 'クイック同定を完了してください（候補を適用する、学名を3文字以上入力する、またはスキップする）', de: 'Schnellbestimmung abschließen (Kandidat übernehmen, wissenschaftlichen Namen mit mindestens 3 Zeichen eingeben oder überspringen)'
    },
    errNeedTaxonomy: {
      zh: '請補齊學名、館號、SAT ID、分類階層，並至少新增一筆「輸入標籤」',
      en: 'Fill scientific name, catalog no., SAT ID, taxonomy, and at least one user tag',
      ja: '学名、カタログ番号、SAT ID、分類、および少なくとも 1 つのユーザー タグを入力します', de: 'Bitte wissenschaftlichen Namen, Katalognummer, SAT-ID, Taxonomie und mindestens ein Benutzer-Tag ausfüllen.'
    },
    errPaleoLogic: {
      zh: '古生物還原圖：請至少勾選一項還原依據；若選「其他」請補充至少 40 字說明',
      en: 'Paleo restoration: select at least one evidence type; if "Other", add 40+ characters',
      ja: '古レオレストレーション: 少なくとも 1 つの証拠タイプを選択します。 「その他」の場合は40文字以上追加してください', de: 'Paläo-Rekonstruktion: Wählen Sie mindestens eine Evidenzart. Bei „Sonstiges“ fügen Sie mindestens 40 Zeichen Erläuterung hinzu.'
    },
    errNeedVisibilityPaleo: { zh: '古生物復原照可略過時地與詳細來源，請至少選擇是否公開', en: 'Paleo restoration may skip locality; please set visibility', ja: '古生物復元は産地を省略できます。公開範囲は設定してください', de: 'Die Paläorekonstruktion kann den Fundort überspringen; legen Sie die Sichtbarkeit fest.'
    },
    errNeedOriginType: { zh: '請選擇紀錄類型', en: 'Please select a record type', ja: 'レコードの種類を選択してください', de: 'Bitte einen Datensatztyp wählen' },
    errNeedStepFields: { zh: '請補齊此步驟必要欄位', en: 'Please complete required fields for this step', ja: 'このステップの必須フィールドに入力してください', de: 'Bitte vollständig erforderlich Felder für dies Schritt' },
    errNeedLocality: { zh: '請補齊時地、來源與是否公開', en: 'Please fill locality, provenance, and visibility', ja: '産地、来歴、公開範囲を記入してください', de: 'Bitte Fundort, Herkunft und Sichtbarkeit ausfüllen' },
    errNeedPrefix: { zh: '請補齊：', en: 'Please complete: ', ja: '以下を完了してください:', de: 'Pleasevollständig:' },
    errNeedLabelChoice: { zh: '請選擇「製作樣本標籤」或「本次略過樣本標籤」', en: 'Choose to make a sample label or skip for this session', ja: 'サンプルラベルを作成するか、このセッションをスキップするかを選択してください', de: 'Wählen to make a Beispiel Bezeichnung oder Überspringen für dies session' },
    errNeedLabelQr: { zh: '啟用標籤 QR 時請填寫 QR URL', en: 'Enter a QR URL when label QR is enabled', ja: 'ラベル QR を有効にするときは QR URL を入力してください', de: 'Geben Sie eine QR-URL ein, wenn das Etikett-QR aktiv ist' },
    errNeedLabelFields: { zh: '請確認標籤版型與必要欄位', en: 'Confirm label template and required fields', ja: 'ラベルテンプレートと必須フィールドを確認してください', de: 'Bestätigen Sie die Etikettvorlage und die Pflichtfelder.' },
    errNeedPrevStep: { zh: '請先完成前一步（標籤設計或略過）', en: 'Complete the previous step (label design or skip) first', ja: 'まず前のステップ（ラベルデザインまたはスキップ）を完了してください', de: 'Schließen Sie zuerst den vorherigen Schritt ab (Etikett gestalten oder überspringen).' },
    errStepIncomplete: { zh: '請先補齊此步驟必要欄位', en: 'Please complete required fields for this step', ja: 'このステップの必須フィールドに入力してください', de: 'Bitte vollständig erforderlich Felder für dies Schritt' },

    missingBannerTitle: { zh: '尚有資料未完成', en: 'Incomplete data', ja: '不完全なデータ', de: 'Unvollständige Daten' },
    missingBannerLead: { zh: '請補上以下欄位（點項目可捲動至該欄並短暫標示）：', en: 'Complete the fields below (click to scroll and highlight):', ja: '以下のフィールドに入力します (クリックしてスクロールし、強調表示します)。', de: 'Vollständig  Felder unterhalb (klicken to Scrollen und Hervorheben):' },
    missingDismiss: { zh: '關閉', en: 'Close', ja: '閉じる', de: 'Schließen' },

    tourWelcomeTitle: { zh: '歡迎使用 Passport Studio', en: 'Welcome to Passport Studio', ja: 'パスポートスタジオへようこそ', de: 'Welcome zu Pass Studio' },
    tourWelcomeLead: {
      zh: '請先選擇您的角色（導覽最多 5 步；完成後可至「教學」自行閱讀）：',
      en: 'Choose your role (up to 5 tour steps; see Help later for full guide):',
      ja: '自分の役割を選択します (最大 5 つのツアー ステップ。完全なガイドについては、後のヘルプを参照してください)。', de: 'Wählen Sie Ihre Rolle (bis zu 5 Führungsschritte; die vollständige Hilfe folgt später):'
    },
    tourRoleReader: { zh: '【閱讀資料者】', en: '[Reader]', ja: '[リーダー]', de: '[Leser]' },
    tourRoleInput: { zh: '【輸入資料者】', en: '[Data entry]', ja: '【データ入力】', de: '[Data Eintrag]' },
    tourSkip: { zh: '【略過導引】', en: '[Skip tour]', ja: '【スキップツアー】', de: '[Führung überspringen]' },

    labelMake: { zh: '本次製作樣本標籤', en: 'Make sample label this session', ja: 'このセッションでサンプルラベルを作成します', de: 'Probenetikett in dieser Sitzung erstellen' },
    labelSkip: { zh: '本次略過樣本標籤', en: 'Skip sample label this session', ja: 'このセッションのサンプル ラベルをスキップします', de: 'Probenetikett in dieser Sitzung überspringen' },
    labelSkipHint: { zh: '你可直接進入匯出步驟，之後仍可回來補做標籤。', en: 'You can export now and return to labels later.', ja: '今すぐエクスポートして、後でラベルに戻ることができます。', de: 'Sie können jetzt exportieren und später zu den Etiketten zurückkehren.' },

    countryLabel: { zh: '國家／地區', en: 'Country / region', ja: '国・地域', de: 'Land / Region' },
    countryPlaceholder: { zh: '輸入中文或英文國名（例：T→Taiwan、台）', en: 'Type country name (e.g. T→Taiwan)', ja: '国名を入力します (例: T→台湾)', de: 'Typ Land Name (e.g. T→Taiwan)' },
    countrySuggestAria: { zh: '國家建議', en: 'Country suggestions', ja: '国の提案', de: 'Ländervorschläge' },
    scientificNameRegistryPh: {
      zh: 'Carnotaurus sastrei 或先填俗名再搜尋',
      en: 'Carnotaurus sastrei, or enter a vernacular name first',
      ja: 'Carnotaurus sastrei、または先に俗名を入力',
      de: 'Carnotaurus sastrei oder zuerst Trivialname eingeben',
    },

    aiStatusDefault: { zh: '上傳影像後會自動辨識。可輸入各語言俗名或拉丁學名；系統先以 GBIF、iNaturalist、Wikidata、Global Names 對照可能學名，再並行查詢資料庫。雲端 Vision 僅在後台已設定時執行；必要時由 Gemini 推論學名。', en: 'Upload an image to run auto ID. Vernacular names are resolved via GBIF, iNaturalist, Wikidata, and Global Names (plus Gemini when configured), then parallel database search.', ja: '自動IDを実行するには画像をアップロードしてください。言語名は、GBIF、iNaturalist、Wikidata、および Global Names (さらに構成されている場合は Gemini) を介して解決され、並列データベース検索が行われます。', de: 'Laden Sie ein Bild hoch, um die automatische Bestimmung zu starten. Trivialnamen werden über GBIF, iNaturalist, Wikidata und Global Names aufgelöst (plus Gemini, falls konfiguriert), danach folgt die parallele Datenbanksuche.'
    },
    taxonomyStatusDefault: { zh: '可輸入拉丁學名或各語言俗名；先以 GBIF、iNaturalist、Wikidata、Global Names 對照可能學名（冷門詞可選 Gemini），再以最多 2 個學名並行查四庫。選擇建議後才套用，且不覆蓋已手動修改欄位。', en: 'Enter a scientific or vernacular name; GBIF, iNat, Wikidata, and Global Names resolve candidates first, then GBIF, PBDB, ELC, and CoL load progressively.', ja: '学名または俗名を入力します。 GBIF、iNat、Wikidata、および Global Names が最初に候補を解決し、次に GBIF、PBDB、ELC、および CoL が段階的にロードされます。', de: 'Wissenschaftlichen oder Trivialnamen eingeben; GBIF, iNat, Wikidata und Global Names lösen zuerst Kandidaten auf, dann laden GBIF, PBDB, ELC und CoL schrittweise.'
    },

    speciesVerifyTitle: { zh: '物種查證', en: 'Species verification', ja: '種の検証', de: 'Artenprüfung' },
    speciesVerifySub: { zh: '用學名、分類、分布與資料來源輔助確認物種身分。', en: 'Verify identity using names, taxonomy, distribution, and sources.', ja: '名前、分類、分布、ソースを使用して同一性を検証します。', de: 'Identität anhand von Namen, Taxonomie, Verbreitung und Quellen prüfen.' },
    speciesVerifyClose: { zh: '關閉', en: 'Close', ja: '閉じる', de: 'Schließen' },
    speciesVerifyRun: { zh: '開始查證', en: 'Run verification', ja: '検証を実行する', de: 'Prüfung ausführen' },
    speciesVerifyUsePassport: { zh: '使用目前 Passport 資料查證', en: 'Verify with current passport data', ja: '現在のパスポートデータで確認してください', de: 'Verify mit current Pass Daten' },
    speciesVerifyClear: { zh: '清除', en: 'Clear', ja: 'クリア', de: 'Löschen' },
    speciesVerifyLoading: { zh: '正在查詢物種資料…', en: 'Querying species data…', ja: '種データをクエリしています…', de: 'Querying species Daten…' },
    speciesVerifyErrQuery: { zh: '請先輸入查詢字串。', en: 'Enter a search query first.', ja: '最初に検索クエリを入力します。', de: 'Geben Sie zuerst eine Suchanfrage ein.' },
    speciesVerifyErrModule: {
      zh: '物種查證模組未載入（species-verification-service.js）。',
      en: 'Species verification module not loaded (species-verification-service.js).',
      ja: '種検証モジュールがロードされていません (species-verification-service.js)。', de: 'Artenprüfungsmodul nicht geladen (species-verification-service.js).'
    },
    speciesVerifyErrNetwork: { zh: '物種資料讀取失敗，請稍後再試，或先手動輸入資料。', en: 'Failed to load species data. Try again or enter data manually.', ja: '種データのロードに失敗しました。もう一度試すか、データを手動で入力してください。', de: 'Artendaten konnten nicht geladen werden. Erneut versuchen oder von Hand eintragen.'
    },

    exportReminderTitle: { zh: '匯出提醒', en: 'Export reminder', ja: 'エクスポートリマインダー', de: 'Exporthinweis' },
    exportReminderBody: { zh: '此學名仍標記為待確認，是否仍要匯出？', en: 'This name is still tentative. Export anyway?', ja: 'この名前はまだ仮称です。とにかく輸出しますか？', de: 'Dies Name ist noch tentative. Exportieren dennoch?' },
    exportConfirm: { zh: '繼續匯出', en: 'Continue export', ja: 'エクスポートを続行する', de: 'Export fortsetzen' },
    exportBackVerify: { zh: '返回查證', en: 'Back to verification', ja: '検証に戻る', de: 'Zurück zu verification' },

    toastDraftRestored: { zh: '已自動還原上次儲存的護照草稿', en: 'Restored your last saved passport draft', ja: '最後に保存したパスポートの下書きを復元しました', de: 'Restored Ihr last saved Pass Entwurf' },
    toastCopiedSummary: { zh: '已複製查證摘要', en: 'Verification summary copied', ja: '検証概要をコピーしました', de: 'Prüfzusammenfassung kopiert' },
    toastCopyFailed: { zh: '複製失敗，請手動選取文字', en: 'Copy failed — select text manually', ja: 'コピーに失敗しました - テキストを手動で選択してください', de: 'Kopieren fehlgeschlagen — bitte Text manuell auswählen' },
    toastPassportUpdated: { zh: '已更新護照欄位（可再手動調整）', en: 'Passport fields updated (you may edit further)', ja: 'パスポートのフィールドが更新されました (さらに編集できます)', de: 'Passfelder aktualisiert (Sie können sie weiter bearbeiten)' },
    toastVerifyFirst: { zh: '請先完成查證', en: 'Complete verification first', ja: 'まず検証を完了してください', de: 'Vollständig verification erste' },
    toastFrontPng: { zh: '正面 PNG 已匯出', en: 'Front PNG exported', ja: 'フロント PNG がエクスポートされました', de: 'Vorderseite als PNG exportiert' },
    toastBackPng: { zh: '背面 PNG 已匯出', en: 'Back PNG exported', ja: '戻る PNG エクスポート', de: 'Rückseite als PNG exportiert' },
    toastLabelPng: { zh: '標籤 PNG 已匯出', en: 'Label PNG exported', ja: 'ラベル PNG がエクスポートされました', de: 'Etikett als PNG exportiert' },
    toastLabelJpg: { zh: '標籤 JPG 已匯出', en: 'Label JPG exported', ja: 'ラベル JPG がエクスポートされました', de: 'Etikett als JPG exportiert' },
    toastExportUnset: { zh: '此匯出類型未設定', en: 'This export type is not configured', ja: 'このエクスポート タイプは構成されていません', de: 'Dies Exportieren Typ ist nicht configured' },

    stepNavAria: { zh: '步驟導覽', en: 'Step navigation', ja: 'ステップナビゲーション', de: 'Schrittnavigation' },
    stepPrev: { zh: '← 上一步', en: '← Previous', ja: '← 前へ', de: '← Zurück' },
    stepNext: { zh: '下一步 →', en: 'Next →', ja: '次へ →', de: 'Weiter →' },
    stepDone: { zh: '完成', en: 'Done', ja: '完了', de: 'Erledigt' },
    stepMeta: { zh: '第 __N__／__TOTAL__ 步', en: 'Step __N__ of __TOTAL__', ja: 'ステップ __N__／__TOTAL__', de: 'Step __N__ von __TOTAL__' },
    draftShort: { zh: '草稿', en: 'Draft', ja: '下書き', de: 'Entwurf' },
    saveDraft: { zh: '儲存草稿', en: 'Save draft', ja: '下書きを保存', de: 'Entwurf speichern' },
    toastDraftSaved: { zh: '草稿已儲存', en: 'Draft saved', ja: '下書きを保存しました', de: 'Entwurf gespeichert' },
    toastDraftSaveFailed: { zh: '草稿儲存失敗', en: 'Failed to save draft', ja: '下書きの保存に失敗しました', de: 'Fehlgeschlagen to Speichern Entwurf' },

    flipPreviewAria: { zh: '3D 預覽中翻轉卡片護照', en: 'Flip passport card in 3D preview', ja: '3D プレビューでパスポートカードを裏返す', de: 'Passkarte in der 3D-Vorschau umdrehen' },
    labelPreviewSubhead: { zh: '標籤預覽', en: 'Label preview', ja: 'ラベルプレビュー', de: 'Etikettvorschau' },
    previewToolbarAria: { zh: '預覽工具列', en: 'Preview toolbar', ja: 'プレビューツールバー', de: 'Vorschau-Werkzeugleiste' },
    previewViewGroupAria: { zh: '預覽模式', en: 'Preview mode', ja: 'プレビューモード', de: 'Vorschaumodus' },
    previewToolsGroupAria: { zh: '預覽操作', en: 'Preview tools', ja: 'プレビュー操作', de: 'Vorschau-Werkzeuge' },
    previewViewFront: { zh: '正面', en: 'Front', ja: '表面', de: 'Vorderseite' },
    previewViewBack: { zh: '背面', en: 'Back', ja: '裏面', de: 'Rückseite' },
    previewViewSide: { zh: '雙面', en: 'Both sides', ja: '両面', de: 'Beide Seiten' },
    previewView3d: { zh: '3D', en: '3D', ja: '3D', de: '3D' },
    previewViewPrint: { zh: '列印', en: 'Print', ja: '印刷', de: 'Druck' },
    previewViewLabel: { zh: '標籤', en: 'Label', ja: 'ラベル', de: 'Etikett' },
    previewFlip: { zh: '翻面', en: 'Flip', ja: '裏返す', de: 'Umdrehen' },
    previewZoomFit: { zh: '適合', en: 'Fit', ja: '全体表示', de: 'Einpassen' },
    previewZoom100: { zh: '100%', en: '100%', ja: '100%', de: '100%' },
    previewDeviceGroupAria: { zh: '手機螢幕預覽', en: 'Phone screen preview', ja: 'スマホ画面プレビュー', de: 'Handy-Bildschirmvorschau' },
    previewDeviceDesktop: { zh: '桌面', en: 'Desktop', ja: 'デスクトップ', de: 'Desktop' },
    previewDevice360: { zh: '小尺寸 Android · 360×740', en: 'Small Android · 360×740', ja: '小型 Android · 360×740', de: 'Kleines Android · 360×740' },
    previewDevice375: { zh: 'iPhone X / 11 Pro · 375×812', en: 'iPhone X / 11 Pro · 375×812', ja: 'iPhone X / 11 Pro · 375×812', de: 'iPhone X / 11 Pro · 375×812' },
    previewDevice390: { zh: 'iPhone 12–15 · 390×844', en: 'iPhone 12–15 · 390×844', ja: 'iPhone 12–15 · 390×844', de: 'iPhone 12–15 · 390×844' },
    previewDevice414: { zh: 'iPhone Plus / Max · 414×896', en: 'iPhone Plus / Max · 414×896', ja: 'iPhone Plus / Max · 414×896', de: 'iPhone Plus / Max · 414×896' },
    previewDevice430: { zh: 'iPhone 14/15 Pro Max · 430×932', en: 'iPhone 14/15 Pro Max · 430×932', ja: 'iPhone 14/15 Pro Max · 430×932', de: 'iPhone 14/15 Pro Max · 430×932' },

    exportFrontPng: { zh: '下載正面 PNG', en: 'Download front PNG', ja: '表面 PNG をダウンロード', de: 'Herunterladen front PNG' },
    exportBackPng: { zh: '下載背面 PNG', en: 'Download back PNG', ja: '裏面 PNG をダウンロード', de: 'Rückseite als PNG herunterladen' },
    exportDoublePng: { zh: '匯出完整卡片 PNG', en: 'Export full card PNG', ja: 'カード全体 PNG をエクスポート', de: 'Ganze Karte als PNG exportieren' },
    exportCardPdf: { zh: '匯出 PDF', en: 'Export PDF', ja: 'PDF をエクスポート', de: 'PDF exportieren' },
    exportPrintDouble: { zh: '列印卡片（雙面）', en: 'Print card (double-sided)', ja: 'カードを印刷（両面）', de: 'Karte drucken (beidseitig)' },
    exportPrintFront: { zh: '列印正面', en: 'Print front', ja: '表面を印刷', de: 'Vorderseite drucken' },
    exportPrintBack: { zh: '列印背面', en: 'Print back', ja: '裏面を印刷', de: 'Rückseite drucken' },
    exportCopyFront: { zh: '複製正面影像', en: 'Copy front image', ja: '表面画像をコピー', de: 'Copy front Bild' },

    exportLabelPng: { zh: '標籤 PNG', en: 'Label PNG', ja: 'ラベル PNG', de: 'Etikett-PNG' },
    exportLabelJpg: { zh: '標籤 JPG', en: 'Label JPG', ja: 'ラベル JPG', de: 'Etikett-JPG' },
    exportLabelPdf: { zh: '標籤 PDF', en: 'Label PDF', ja: 'ラベル PDF', de: 'Etikett-PDF' },
    exportLabelPrint: { zh: '列印預覽', en: 'Print preview', ja: '印刷プレビュー', de: 'Druckvorschau' },
    exportLabelPrinter: { zh: '標籤機列印', en: 'Print on label printer', ja: 'ラベルプリンターで印刷', de: 'Auf Etikettendrucker drucken' },
    exportLabelA4: { zh: 'A4 排版', en: 'A4 layout', ja: 'A4 レイアウト', de: 'A4-Layout' },
    exportLabelSheet: { zh: '標籤紙排版', en: 'Label sheet layout', ja: 'ラベルシートレイアウト', de: 'Etikettenbogen-Layout' },
    labelLayoutTze36: { zh: 'TZe 36 mm 膠帶（PT-P910BT）', en: 'TZe 36 mm (PT-P910BT)', ja: 'TZe 36 mmテープ（PT-P910BT）', de: 'TZe-36-mm-Kassette (PT-P910BT)' },
    labelLayoutTze24: { zh: 'TZe 24 mm 膠帶', en: 'TZe 24 mm', ja: 'TZe 24 mmテープ', de: 'TZe-24-mm-Kassette' },
    labelLayoutTze18: { zh: 'TZe 18 mm 膠帶', en: 'TZe 18 mm', ja: 'TZe 18 mmテープ', de: 'TZe-18-mm-Kassette' },
    labelLayoutTze12: { zh: 'TZe 12 mm 膠帶', en: 'TZe 12 mm', ja: 'TZe 12 mmテープ', de: 'TZe-12-mm-Kassette' },
    ptouchHelp: { zh: 'PT-P910BT：選 TZe 寬度後按「標籤機列印」，在系統對話框選 Brother 印表機。手機請用 MCurator App 的「PT-P910BT 藍牙列印」，直接送到印表機。', en: 'PT-P910BT: pick a TZe width, tap Print on label printer, and choose the Brother printer in the system dialog. On a phone, use PT-P910BT Bluetooth print in the MCurator app to send the label directly.', ja: 'PT-P910BT：TZe 幅を選び「ラベルプリンターで印刷」から Brother を指定します。スマホは MCurator アプリの「PT-P910BT Bluetooth印刷」で直接送ります。', de: 'PT-P910BT: TZe-Breite wählen, „Auf Etikettendrucker drucken“ und Brother im Systemdialog wählen. Am Handy sendet „PT-P910BT Bluetooth-Druck“ in der MCurator-App das Etikett direkt.' },

    qrSafeWarning: { zh: 'QR 位置可能遮擋資訊，已限制在安全範圍內。', en: 'QR position adjusted to stay within safe margins.', ja: 'QR の位置は安全マージン内に収まるように調整されました。', de: 'Die QR-Position wurde angepasst, damit sie im sicheren Rand bleibt.' },
    manualBackReason: { zh: '手動選擇', en: 'Manual selection', ja: '手動選択', de: 'Manuelle Auswahl' },
    autoMatchReason: { zh: '自動匹配', en: 'Auto match', ja: '自動一致', de: 'Automatische Zuordnung' },
    fallbackReason: { zh: 'fallback', en: 'fallback', ja: '後退する', de: 'Ausweichlösung' },

    step5PanelTitle: { zh: '5 — 是否公開、授權、QR、護照樣式', en: '5 — Visibility, license, QR & passport style', ja: '5 — 可視性、ライセンス、QR、パスポートのスタイル', de: '5 — Sichtbarkeit, Lizenz, QR und Passstil' },
    step5PanelHint: { zh: '是否公開與來源已在「時地與來源」步驟設定。卡片護照 QR 預設關閉；啟用時請填 URL。材質與背板只改變視覺層，不改鎖定版位。', en: 'Visibility and provenance are set in the locality step. Passport QR is off by default; enter a URL when enabled.', ja: '可視性と来歴は地域ステップで設定されます。パスポート QR はデフォルトではオフになっています。有効になっている場合は URL を入力します。', de: 'Sichtbarkeit und Herkunft werden im Fundort-Schritt gesetzt. Der Pass-QR ist standardmäßig aus; geben Sie eine URL ein, wenn er aktiv ist.'
    },

    accessPrivate: { zh: '私人', en: 'Private', ja: 'プライベート', de: 'Privat' },
    accessPublicFree: { zh: '公開免費', en: 'Public free', ja: '公開無料', de: 'Öffentlich kostenlos' },
    accessMembers: { zh: '僅會員', en: 'Members only', ja: '会員限定', de: 'Nur Mitglieder' },
    accessPaid: { zh: '付費存取', en: 'Paid access', ja: '有料アクセス', de: 'Kostenpflichtiger Zugang' },
    accessPurchaser: { zh: '僅購買者', en: 'Purchasers only', ja: '購入者限定', de: 'Nur Käufer' },

    missAccessMode: { zh: '存取模式', en: 'Access mode', ja: 'アクセスモード', de: 'Zugangsmodus' },
    missLicense: { zh: '授權條款', en: 'License terms', ja: 'ライセンス条項', de: 'Lizenzbedingungen' },
    missQrUrl: { zh: '卡片護照 QR 網址', en: 'Passport QR URL', ja: 'パスポートのQR URL', de: 'Pass QR URL' },
    missMaterial: { zh: '卡片材質', en: 'Card material', ja: 'カード素材', de: 'Kartenmaterial' },

    materialCatAll: { zh: '全部', en: 'All', ja: '全て', de: 'Alle' },
    materialCatMuseum: { zh: '館藏', en: 'Museum', ja: '博物館', de: 'Museumsbereich' },
    materialCatArchive: { zh: '檔案', en: 'Archive', ja: 'アーカイブ', de: 'Archivieren' },
    materialCatMetallic: { zh: '金屬質感', en: 'Metallic', ja: 'メタリック', de: 'Metallisch' },
    materialCatGlass: { zh: '玻璃感', en: 'Glass', ja: 'ガラス', de: 'Glas' },
    materialCatField: { zh: '野外', en: 'Field', ja: '野外調査', de: 'Feld' },
    materialCatScientific: { zh: '科研', en: 'Scientific', ja: '科学的', de: 'Wissenschaftlich' },
    materialCatNatural: { zh: '自然', en: 'Natural', ja: '自然環境', de: 'Natürlich' },

    reviewNotReviewed: { zh: '未審核', en: 'Not reviewed', ja: '未レビュー', de: 'Nicht geprüft' },
    reviewReviewing: { zh: '審核中', en: 'Under review', ja: '検討中', de: 'In Prüfung' },
    reviewVerified: { zh: '已審核', en: 'Verified', ja: '確認済み', de: 'Verifiziert' },

    visibilityPublic: { zh: '公開', en: 'Public', ja: '公共', de: 'Öffentlich' },
    visibilityResearch: { zh: '限研究可見', en: 'Research only', ja: '研究のみ', de: 'Nur Forschung' },
    visibilityPrivate: { zh: '不公開', en: 'Private', ja: 'プライベート', de: 'Privat' },
    visibilityUnset: { zh: '未設定', en: 'Not set', ja: '設定なし', de: 'Nicht festgelegt' },

    rarityPending: { zh: '審核中', en: 'Pending review', ja: '審査待ち', de: 'Prüfung ausstehend' },
    specimenImageAlt: { zh: '標本影像', en: 'Specimen image', ja: '標本画像', de: 'Präparatbild' },

    removeBgBtn: { zh: '一鍵去背', en: 'Remove background', ja: '背景を削除する', de: 'Hintergrund entfernen' },
    removeBgHint: {
      zh: '本機 AI 去背，照片不會上傳；首次需下載模型。',
      en: 'On-device AI cutout — photo never uploaded; first run downloads the model.',
      ja: 'オンデバイス AI カットアウト — 写真はアップロードされませんでした。最初の実行ではモデルがダウンロードされます。', de: 'Freistellung auf dem Gerät. Das Foto wird nicht hochgeladen. Beim ersten Lauf wird das Modell geladen.'
    },
    removeBgLoading: { zh: '去背中…', en: 'Removing background…', ja: '背景を削除しています…', de: 'Removing Hintergrund…' },
    removeBgDone: { zh: '去背完成，已更新卡片預覽', en: 'Background removed; card preview updated.', ja: '背景が削除されました。カードプレビューが更新されました。', de: 'Hintergrund entfernt, Kartenvorschau aktualisiert.' },
    removeBgDoneBadge: { zh: '已去背', en: 'BG removed', ja: 'BGが除去されました', de: 'Hintergrund entfernt' },
    removeBgFailed: { zh: '去背失敗：', en: 'Background removal failed: ', ja: '背景の削除に失敗しました:', de: 'Zurückground removal failed:' },
    removeBgUnavailable: {
      zh: '無法載入去背模組，請確認網路後重試',
      en: 'Cutout module unavailable — check network and retry.',
      ja: 'カットアウト モジュールが利用できません - ネットワークを確認して再試行してください。', de: 'Freistellungsmodul nicht verfügbar. Netz prüfen und erneut versuchen.'
    },
    removeBgNeedImage: { zh: '請先上傳標本照片', en: 'Upload a specimen photo first.', ja: 'まずは標本写真をアップロードしてください。', de: 'Laden Sie zuerst ein Präparatfoto hoch.' },

    specimenCategoryHeading: { zh: '標本類群', en: 'Specimen category', ja: '標本カテゴリ', de: 'Präparatkategorie' },
    cat_insecta: { zh: '昆蟲', en: 'Insecta', ja: '昆虫', de: 'Insekten' },
    cat_lepidoptera: { zh: '鱗翅目', en: 'Lepidoptera', ja: '鱗翅目（チョウ）', de: 'Schmetterlinge' },
    cat_coleoptera: { zh: '甲蟲', en: 'Coleoptera', ja: '甲虫', de: 'Käfer' },
    cat_arthropoda: { zh: '節肢動物', en: 'Arthropoda', ja: '節足動物', de: 'Gliederfüßer' },
    cat_plantae: { zh: '植物', en: 'Plantae', ja: '植物界', de: 'Pflanzen' },
    cat_aves: { zh: '鳥類', en: 'Aves', ja: '鳥綱', de: 'Aves' },
    cat_mammalia: { zh: '哺乳類', en: 'Mammalia', ja: '哺乳綱', de: 'Säugetiere' },
    cat_pisces: { zh: '魚類', en: 'Pisces', ja: '魚綱', de: 'Fische' },
    cat_fossil: { zh: '化石', en: 'Fossil', ja: '化石標本', de: 'Fossilien' },
    cat_mineral: { zh: '礦物', en: 'Mineral', ja: '鉱物', de: 'Mineralien' },
    cat_marine: { zh: '海洋', en: 'Marine', ja: '海洋環境', de: 'Marin' },
    cat_microbiology: { zh: '微生物', en: 'Microbiology', ja: '微生物学', de: 'Mikrobiologie' },
    cat_fungi: { zh: '真菌', en: 'Fungi', ja: '菌類', de: 'Pilze' },
    cat_bacteria: { zh: '細菌', en: 'Bacteria', ja: '細菌類', de: 'Bakterien' },
    cat_virus: { zh: '病毒', en: 'Virus', ja: 'ウイルス', de: 'Viren' },
    cat_custom: { zh: '其他', en: 'Custom', ja: 'その他', de: 'Benutzerdefiniert' },
    catTax_insecta: {
      zh: '動物界 → 節肢動物門 → 昆蟲綱',
      en: 'Animalia → Arthropoda → Insecta',
      ja: '動物界 → 節足動物門 → 昆虫綱', de: 'Animalia → Arthropoda → Insecta'
    },
    catTax_lepidoptera: {
      zh: '動物界 → 節肢動物門 → 昆蟲綱 → 鱗翅目',
      en: 'Animalia → Arthropoda → Insecta → Lepidoptera',
      ja: '動物界 → 節足動物門 → 昆虫綱 → 鱗翅目', de: 'Animalia → Arthropoda → Insecta → Lepidoptera'
    },
    catTax_coleoptera: {
      zh: '動物界 → 節肢動物門 → 昆蟲綱 → 鞘翅目',
      en: 'Animalia → Arthropoda → Insecta → Coleoptera',
      ja: '動物界 → 節足動物門 → 昆虫綱 → 鞘翅目', de: 'Animalia → Arthropoda → Insecta → Coleoptera'
    },
    catTax_arthropoda: {
      zh: '動物界 → 節肢動物門',
      en: 'Animalia → Arthropoda',
      ja: '動物界 → 節足動物門', de: 'Animalia → Arthropoda'
    },
    catTax_aves: {
      zh: '動物界 → 脊索動物門 → 鳥綱',
      en: 'Animalia → Chordata → Aves',
      ja: 'Animalia → Chordata → Aves（鳥綱）', de: 'Animalia → Chordata → Aves'
    },
    catTax_mammalia: {
      zh: '動物界 → 脊索動物門 → 哺乳綱',
      en: 'Animalia → Chordata → Mammalia',
      ja: 'Animalia → Chordata → Mammalia（哺乳綱）', de: 'Animalia → Chordata → Mammalia'
    },
    catTax_pisces: {
      zh: '動物界 → 脊索動物門 → 魚類',
      en: 'Animalia → Chordata → Pisces',
      ja: 'Animalia → Chordata → 魚類（総称）', de: 'Animalia → Chordata → Pisces'
    },
    catTax_plantae: {
      zh: '植物界 → 維管束植物',
      en: 'Plantae → Tracheophyta',
      ja: 'Plantae → Tracheophyta（維管束植物）', de: 'Plantae → Tracheophyta'
    },
    catTax_marine: {
      zh: '海洋類群 → 軟體動物 / 刺胞動物',
      en: 'Marine taxa → Mollusca / Cnidaria',
      ja: '海産分類群：軟体動物／刺胞動物', de: 'Marine Taxa → Mollusca / Cnidaria'
    },
    catTax_fossil: { zh: '古生物紀錄 → 地層 → 標本', en: 'Paleo record → stratum → specimen', ja: '古生物記録 → 地層 → 標本', de: 'Paläodatensatz → Schicht → Präparat'
    },
    catTax_mineral: {
      zh: '地質樣本 → 礦物 / 礦石',
      en: 'Geological sample → mineral / ore',
      ja: '地質サンプル → 鉱物／鉱石', de: 'Geologische Probe → Mineral / Erz'
    },
    catTax_microbiology: { zh: '微生物樣本', en: 'Microbiology sample', ja: '微生物サンプル', de: 'Mikrobiologie-Probe' },
    catTax_fungi: { zh: '真菌界', en: 'Fungi', ja: '菌界', de: 'Pilze' },
    catTax_bacteria: { zh: '細菌域', en: 'Bacteria', ja: '細菌ドメイン', de: 'Bakterien' },
    catTax_virus: { zh: '病毒樣本', en: 'Virus sample', ja: 'ウイルスサンプル', de: 'Virusprobe' },
    catTax_custom: { zh: '自訂分類階層', en: 'Custom taxonomy path', ja: 'カスタム分類階層', de: 'Eigener Taxonomiepfad' }
  };
})(typeof window !== 'undefined' ? window : this);
