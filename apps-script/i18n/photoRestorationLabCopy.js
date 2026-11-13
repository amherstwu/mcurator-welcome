/**
 * Photo Restoration Lab — main UI copy (zh-TW / en / ja).
 */
(function (global) {
  'use strict';

  global.MCPhotoRestorationLabCopy = {
    brandTitle: { zh: 'AI 照片修復實驗室', en: 'AI Photo Restoration Lab', ja: 'AI写真修復ラボ', de: 'KI-Labor für Fotorestaurierung' },
    brandSub: { zh: '本機 OSS：Rembg 去背 · 標本溫和增強 · 快速修圖 · Real-ESRGAN 放大', en: 'On-device OSS: Rembg cutout · gentle specimen enhance · quick photo edit · Real-ESRGAN upscale', ja: 'オンデバイス OSS: Rembg カットアウト · 穏やかな標本強化 · 素早い写真編集 · Real-ESRGAN アップスケール', de: 'Lokal, Open Source: Rembg-Freistellung · schonende Präparatverbesserung · schnelle Bildbearbeitung · Real-ESRGAN-Vergrößerung'
    },
    close: { zh: '關閉', en: 'Close', ja: '閉じる', de: 'Schließen' },

    onboardingTitle: { zh: '在維持科學辨識前提下，修復標本、化石與野外影像。', en: 'Restore specimen, fossil, and field images while preserving scientific identifiability.', ja: '科学的な識別可能性を維持しながら、標本、化石、現場の画像を復元します。', de: 'Restaurieren Sie Präparat-, Fossil- und Feldbilder, ohne die wissenschaftliche Erkennbarkeit zu verlieren.'
    },
    onboardingSub: {
      zh: '用手機拍照即可自動去背（白底）並優化；亦可上傳舊照修復。形態、標籤與比例尺請勿遮蓋。',
      en: 'Capture on your phone for auto cutout (white) and enhance—or upload legacy shots. Do not mask morphology, labels, or scale bars.',
      ja: '携帯電話でキャプチャして自動カットアウト (白) して補正したり、レガシーショットをアップロードしたりできます。形態、ラベル、スケール バーをマスクしないでください。', de: 'Mit dem Telefon fotografieren für automatische Freistellung (weiß) und Verbesserung, oder alte Aufnahmen hochladen. Morphologie, Etiketten und Maßstäbe nicht abdecken.'
    },
    onboardingPresetsTitle: { zh: '適用情境（選擇預設）', en: 'Use cases (pick a preset)', ja: '使用例 (プリセットを選択)', de: 'Einsatzfälle (Vorlage wählen)' },
    safeModeHero: {
      zh: '建議開啟科學安全模式：AI 僅提升影像技術品質，不得捏造形態或竄改鑑定用結構。',
      en: 'Enable Scientific Safe Mode: AI improves technical quality only—no fabricated morphology or diagnostic structures.',
      ja: '科学的セーフ モードを有効にする: AI は技術的な品質のみを向上させます。加工された形態学や診断構造は含まれません。', de: 'Wissenschaftlichen Sicherheitsmodus einschalten: Die KI verbessert nur die technische Qualität, ohne Morphologie oder diagnostische Strukturen zu erfinden.'
    },
    uploadHero: { zh: '上傳要修復的照片', en: 'Upload a photo to restore', ja: '復元する写真をアップロードしてください', de: 'Foto zum Restaurieren hochladen' },
    captureHero: { zh: '拍照（自動去背＋優化）', en: 'Take photo (auto cutout + enhance)', ja: '写真を撮る（自動切り抜き+補正）', de: 'Foto aufnehmen (automatische Freistellung und Verbesserung)' },
    captureSidebar: { zh: '拍照', en: 'Take photo', ja: '写真を撮る', de: 'Foto aufnehmen' },
    autoCapturePipeline: {
      zh: '拍攝後自動去背（白底）並優化',
      en: 'After capture: auto cutout (white) + enhance',
      ja: 'キャプチャ後：オート切り抜き（白）＋エンハンス', de: 'Nach der Aufnahme: automatische Freistellung (weiß) und Verbesserung'
    },
    autoCaptureHint: {
      zh: '本機 AI，照片不上傳；首次需下載模型。',
      en: 'On-device AI, no upload; first run downloads the model.',
      ja: 'オンデバイス AI、アップロードなし。最初の実行ではモデルがダウンロードされます。', de: 'KI auf dem Gerät, kein Upload. Beim ersten Lauf wird das Modell geladen.'
    },
    capturePipelineRunning: { zh: '正在去背並優化…', en: 'Cutout and enhance in progress…', ja: '切り抜きと強化が進行中です…', de: 'Freistellung und Verbesserung laufen…' },
    capturePipelineDone: { zh: '完成：白底標本照已就緒，可再微調或匯出。', en: 'Done: white-background specimen plate is ready—tweak or export.', ja: '完了: 白い背景の標本プレートの準備ができました。調整またはエクスポートします。', de: 'Fertig: die Präparatplatte mit weißem Hintergrund ist bereit. Feinjustieren oder exportieren.'
    },
    capturePipelineFailed: { zh: '自動處理失敗：', en: 'Auto pipeline failed: ', ja: '自動パイプラインが失敗しました:', de: 'Automatische Folge fehlgeschlagen: ' },
    formatConverted: {
      zh: '已將 TIFF／非支援格式轉為 JPEG 再進行去背。',
      en: 'Converted TIFF or unsupported format to JPEG before cutout.',
      ja: 'TIFFまたはサポートされていない形式を切り出す前にJPEGに変換しました。', de: 'TIFF oder ein nicht unterstütztes Format wurde vor der Freistellung in JPEG umgewandelt.'
    },
    formatUnsupported: {
      zh: '此影像格式無法在本機轉換，請先匯出為 JPG 或 PNG 再上傳。',
      en: 'Cannot convert this format locally. Export as JPG or PNG first.',
      ja: 'この形式をローカルで変換できません。まず JPG または PNG としてエクスポートします。', de: 'Kann nicht Konvertieren dies Formatieren locally. Exportieren as JPG oder PNG erste.'
    },
    captureResultLabel: { zh: '標本商品照', en: 'Specimen product shot', ja: '標本製品ショット', de: 'Präparat product shot' },
    enhanceDone: { zh: '影像優化完成。', en: 'Image enhancement complete.', ja: '画像補正が完了しました。', de: 'Image enhancementvollständig.' },

    safeModeOn: { zh: '已開啟', en: 'On', ja: 'の上', de: 'Auf' },
    safeModeOff: { zh: '已關閉', en: 'Off', ja: 'オフ', de: 'Aus' },
    safeModeBarOn: {
      zh: '內容填補僅限遮罩區域；此工作區停用整張影像的生成式替換。',
      en: 'Inpainting is mask-only; full-image generative replacement is disabled.',
      ja: '修復はマスクのみを使用します。フルイメージの生成置換は無効になっています。', de: 'Inpainting gilt nur für die Maske. Ein generativer Ersatz des ganzen Bildes ist aus.'
    },
    safeModeBarOff: { zh: '風險較高：請仔細檢查匯出結果。', en: 'Higher risk: review exports carefully.', ja: 'リスクが高い: 輸出を慎重に検討してください。', de: 'Höheres Risiko: Exportierene sorgfältig prüfen.' },
    safeModeLabel: { zh: '科學安全模式', en: 'Scientific safe mode', ja: '科学的セーフモード', de: 'Wissenschaftlicher Sicherheitsmodus' },
    inpaintAck: { zh: '我已了解科學影像內容填補之風險', en: 'I understand inpainting risks for scientific images', ja: '科学的画像の修復リスクを理解しています', de: 'Ich verstehe die Inpainting-Risiken für wissenschaftliche Bilder' },

    sourceSection: { zh: '來源', en: 'Source', ja: 'ソース', de: 'Quelle' },
    uploadImage: { zh: '上傳影像', en: 'Upload image', ja: '画像をアップロードする', de: 'Bild hochladen' },
    stubAsset: { zh: '素材庫（占位）', en: 'Asset library (placeholder)', ja: 'アセット ライブラリ (プレースホルダー)', de: 'Asset-Bibliothek (Platzhalter)' },
    stubSpecimen: { zh: '標本紀錄（占位）', en: 'Specimen record (placeholder)', ja: '標本記録（プレースホルダー）', de: 'Präparat-Datensatz (Platzhalter)' },
    stubPassport: { zh: '護照工作室（占位）', en: 'Passport studio (placeholder)', ja: 'パスポートスタジオ（プレースホルダー）', de: 'Pass-Studio (Platzhalter)' },
    batchUpload: { zh: '批次上傳', en: 'Batch upload', ja: 'バッチアップロード', de: 'Stapel hochladen' },

    zoomIn: { zh: '放大', en: 'Zoom in', ja: 'ズームイン', de: 'Vergrößern' },
    zoomOut: { zh: '縮小', en: 'Zoom out', ja: 'ズームアウト', de: 'Verkleinern' },
    fitView: { zh: '適合畫面', en: 'Fit to view', ja: 'ビューに合わせる', de: 'An Ansicht anpassen' },
    undoMask: { zh: '復原遮罩', en: 'Undo mask', ja: 'マスクを元に戻す', de: 'Maske rückgängig' },
    redoMask: { zh: '重做遮罩', en: 'Redo mask', ja: 'やり直しマスク', de: 'Maske wiederholen' },
    clearMask: { zh: '清除遮罩', en: 'Clear mask', ja: 'クリアマスク', de: 'Maske löschen' },
    splitView: { zh: '分割檢視', en: 'Split view', ja: '分割ビュー', de: 'Geteilte Ansicht' },
    compare: { zh: '對照', en: 'Compare', ja: '比較する', de: 'Vergleichen' },

    batchRun: { zh: '執行批次修復', en: 'Run batch restore', ja: 'バッチ復元を実行する', de: 'Stapel-Wiederherstellung ausführen' },
    strength: { zh: '強度', en: 'Strength', ja: '強さ', de: 'Stärke' },
    strengthHint: { zh: '建議 80–95；數值愈高，CLAHE／去霧／典藏修復愈明顯。', en: 'Try 80–95; higher values strengthen CLAHE, dehaze, and archive restore.', ja: '80 ～ 95 を試してください。値が大きいほど、CLAHE、かすみ除去、アーカイブ復元が強化されます。', de: 'Versuchen Sie 80–95. Höhere Werte verstärken CLAHE, Entnebelung und Archivrestaurierung.'
    },
    strengthMovedHint: {
      zh: '強度滑桿已移至畫布上方「AI 工具列」。',
      en: 'Strength slider is now above the canvas in the AI tool dock.',
      ja: '強度スライダーが AI ツール ドックのキャンバスの上に表示されるようになりました。', de: 'Stärke slider ist now above canvas in AI tool dock.'
    },
    titleField: { zh: '標題', en: 'Title', ja: 'タイトル', de: 'Titel' },
    imageType: { zh: '影像類型', en: 'Image type', ja: '画像の種類', de: 'Bildtyp' },
    brushSize: { zh: '筆刷大小', en: 'Brush size', ja: 'ブラシサイズ', de: 'Pinselgröße' },
    maskOpacity: { zh: '遮罩透明度', en: 'Mask opacity', ja: 'マスクの不透明度', de: 'Maskendeckkraft' },

    typeSpecimen: { zh: '標本', en: 'Specimen', ja: '標本', de: 'Präparat' },
    typeFossil: { zh: '化石', en: 'Fossil', ja: '化石標本', de: 'Fossilien' },
    typeField: { zh: '野外', en: 'Field', ja: '分野', de: 'Feld' },
    typeArchive: { zh: '典藏', en: 'Archive', ja: 'アーカイブ', de: 'Archivieren' },
    typeOther: { zh: '其他', en: 'Other', ja: '他の', de: 'Sonstiges' },

    defaultProjectTitle: { zh: '未命名修復專案', en: 'Untitled restoration project', ja: '無題の修復プロジェクト', de: 'Unbenanntes Restaurierungsprojekt' },
    originalLabel: { zh: '原圖', en: 'Original', ja: 'オリジナル', de: 'Ursprungsfassung' },

    batchQueued: { zh: '排隊中', en: 'Queued', ja: 'キューに入れられました', de: 'In Warteschlange' },
    batchDone: { zh: '完成', en: 'Done', ja: '終わり', de: 'Erledigt' },

    toastNeedUpload: { zh: '請先上傳影像。', en: 'Upload an image first.', ja: 'まず画像をアップロードします。', de: 'Laden Sie zuerst ein Bild hoch.' },
    toastNeedInpaintAck: { zh: '請先在右側面板閱讀並勾選「了解內容填補風險」後再執行。', en: 'Read and acknowledge inpainting risks in the right panel first.', ja: 'まず、右側のパネルにある修復のリスクを読んで確認してください。', de: 'Lesen und bestätigen Sie zuerst die Inpainting-Risiken im rechten Bereich.' },
    toastProviderUnsupported: { zh: '目前提供者不支援：', en: 'Provider does not support: ', ja: 'プロバイダーは以下をサポートしていません:', de: 'Anbieter unterstützt Folgendes nicht:' },
    toastDemoComplete: { zh: '示範流程完成（預覽像素未改變）。', en: 'Demo complete (preview pixels unchanged).', ja: 'デモが完了しました (プレビュー ピクセルは変更されていません)。', de: 'Demo abgeschlossen (Vorschaupixel unverändert).' },
    toastInpaintSafety: { zh: '請閱讀內容填補安全說明，勾選確認後再於遮罩上操作。', en: 'Acknowledge inpainting safety before editing the mask.', ja: 'マスクを編集する前に、修復の安全性を確認してください。', de: 'Bestätigen Sie die Inpainting-Sicherheit, bevor Sie die Maske bearbeiten.' },
    toastBatchAdded: { zh: '已加入', en: 'Added ', ja: '追加した', de: 'Hinzufügened' },
    toastBatchAddedSuffix: { zh: '個檔案至批次佇列。', en: ' file(s) to batch queue.', ja: 'ファイルをバッチキューに追加します。', de: ' Datei(en) in die Stapelwarteschlange.' },
    toastBatchEmpty: { zh: '佇列是空的。', en: 'Queue is empty.', ja: 'キューが空です。', de: 'Queue ist empty.' },
    toastBatchDone: { zh: '批次修復完成，可逐一下載結果。', en: 'Batch restore done—download each result.', ja: 'バッチ復元が完了しました - 各結果をダウンロードします。', de: 'Stapel Wiederherstellen erledigt—Herunterladen jede Ergebnis.' },
    toastLogDownloaded: { zh: '已下載完整性紀錄 JSON。', en: 'Integrity log JSON downloaded.', ja: '整合性ログ JSON がダウンロードされました。', de: 'Integritätsprotokoll JSON heruntergeladen.' },
    toastNoExport: { zh: '沒有可匯出的影像。', en: 'No image to export.', ja: 'エクスポートする画像がありません。', de: 'Nein Bild zu Exportieren.' },
    toastExportTriggered: { zh: '已觸發匯出（示範：檔案內容與來源相同）。', en: 'Export triggered (demo: same as source).', ja: 'エクスポートがトリガーされました (デモ: ソースと同じ)。', de: 'Export ausgelöst (Demo: identisch mit der Quelle).' },

    providerRembg: { zh: '本機去背（Rembg / ISNet）', en: 'On-device cutout (Rembg / ISNet)', ja: 'オンデバイスカットアウト (Rembg / ISNet)', de: 'Geräteinterne Freistellung (Rembg / ISNet)' },
    providerRembgHint: {
      zh: '影像不離開此裝置；首次使用會下載模型。',
      en: 'Images never leave this device; first run downloads the model.',
      ja: '画像がこのデバイスから出ることはありません。最初の実行ではモデルがダウンロードされます。', de: 'Bilder verlassen dieses Gerät nicht. Beim ersten Lauf wird das Modell geladen.'
    },
    rembgLoadingModel: { zh: '載入去背模型…', en: 'Loading cutout model…', ja: 'カットアウトモデルを読み込み中…', de: 'Freistellungsmodell wird geladen…' },
    rembgProcessing: { zh: '本機去背處理中…', en: 'Removing background on-device…', ja: 'デバイス上の背景を削除しています…', de: 'Hintergrund wird auf dem Gerät entfernt…' },
    rembgDone: { zh: '去背完成，已更新預覽。', en: 'Background removed; preview updated.', ja: '背景が削除されました。プレビューが更新されました。', de: 'Hintergrund entfernt, Vorschau aktualisiert.' },
    rembgFailed: { zh: '去背失敗：', en: 'Background removal failed: ', ja: '背景の削除に失敗しました:', de: 'Zurückground removal failed:' },
    rembgUnavailable: {
      zh: '無法載入本機去背模組（請確認網路以取得首次模型，或改用示範模式）。',
      en: 'Could not load on-device cutout (network needed for first model load, or use demo mode).',
      ja: 'オンデバイス カットアウトをロードできませんでした (最初のモデルのロード、またはデモ モードの使用にネットワークが必要でした)。', de: 'Die Freistellung auf dem Gerät konnte nicht geladen werden (Netz für den ersten Modell-Download, oder Demomodus).'
    },
    opRemoveBg: { zh: '背景整理', en: 'Remove background', ja: '背景を削除する', de: 'Hintergrund entfernen' },
    opWhiteBg: { zh: '白背景', en: 'White background', ja: '白い背景', de: 'Weißer Hintergrund' },
    opTransparentBg: { zh: '透明背景', en: 'Transparent background', ja: '透明な背景', de: 'Transparenter Hintergrund' },
    opEnhance: { zh: '自動增強', en: 'Auto enhance', ja: '自動強化', de: 'Automatisch verbessern' },
    opDenoise: { zh: '降噪', en: 'Denoise', ja: 'ノイズ除去', de: 'Entrauschen' },
    opDeblur: { zh: '除模糊', en: 'Deblur', ja: 'ブラーを除去する', de: 'Unschärfe entfernen' },
    opDerain: { zh: '除雨', en: 'Derain', ja: 'ドラン', de: 'Regen entfernen' },
    opCorrectColor: { zh: '低光／色彩修復', en: 'Color / low-light', ja: 'カラー/低照度', de: 'Farbe / wenig Licht' },
    opUpscale: { zh: '放大 2×', en: 'Upscale 2×', ja: '高級 2×', de: '2× hochskalieren' },
    opUp4: { zh: '放大 4×', en: 'Upscale 4×', ja: '高級 4×', de: '4× hochskalieren' },
    opInpaint: { zh: '內容填補（遮罩）', en: 'Inpaint (mask)', ja: 'インペイント（マスク）', de: 'Inpainting (Maske)' },
    opExportPrep: { zh: '準備匯出', en: 'Export prep', ja: '輸出準備', de: 'Export vorbereiten' },
    opGlare: { zh: '降低反光', en: 'Reduce glare', ja: 'まぶしさを軽減する', de: 'Spiegelung mindern' },
    opGrade: { zh: '調色', en: 'Color grade', ja: 'カラーグレード', de: 'Farbkorrektur' },
    opDust: { zh: '除塵', en: 'Dust removal', ja: '除塵処理', de: 'Staub entfernen' },
    dustProcessing: { zh: '除塵處理中…', en: 'Removing dust specks…', ja: '塵埃を除去中…', de: 'Staubflecken werden entfernt…' },
    dustDone: {
      zh: '除塵完成（暗點／亮點塵斑已柔化），可再調強度重試。',
      en: 'Dust removal done (dark/bright specks softened). Increase strength and retry if needed.',
      ja: 'ほこりの除去が完了しました（暗い/明るい斑点が柔らかくなりました）。必要に応じて強度を上げて再試行してください。', de: 'Dust removal erledigt (dunkel/bright specks softened). Increase Stärke und Erneut versuchen wenn benötigt.'
    },
    dustHint: {
      zh: '適合灰塵、纖維、掃描亮點；強度建議 80+。標本本體請勿過度處理。',
      en: 'For gray dust, fibers, scan specks; try strength 80+. Avoid over-processing the specimen.',
      ja: '灰色の塵、繊維、斑点をスキャンします。強度80以上を試してください。標本を過度に加工しないでください。', de: 'Für grauen Staub, Fasern und Scanpunkte. Stärke ab 80. Das Präparat nicht überbearbeiten.'
    },
    opJpeg: { zh: 'JPEG 雜訊', en: 'JPEG noise', ja: 'JPEGノイズ', de: 'JPEG-Rauschen' },
    opClarity: { zh: '清晰度強化', en: 'Clarity boost', ja: '明瞭度の向上', de: 'Klarheit verstärken' },
    opDehaze: { zh: '去霧／除霾', en: 'Dehaze', ja: 'かすみ除去', de: 'Dunst entfernen' },
    opArchive: { zh: '典藏修復', en: 'Archive restore', ja: 'アーカイブの復元', de: 'Archiv restaurieren' },
    opFailed: { zh: '處理失敗：', en: 'Processing failed: ', ja: '処理に失敗しました:', de: 'Processing failed:' },
    clarityProcessing: { zh: 'CLAHE 局部對比強化中…', en: 'CLAHE clarity boost…', ja: 'CLAHEの明瞭度向上…', de: 'CLAHE-Klarheitsverbesserung läuft…' },
    clarityDone: { zh: '清晰度已提升（局部對比＋銳化）。', en: 'Clarity boosted (local contrast + sharpen).', ja: '明瞭度が向上しました (局所的なコントラスト + シャープ化)。', de: 'Clarity boosted (local Kontrast + sharpen).' },
    dehazeProcessing: { zh: '去霧處理中…', en: 'Dehazing…', ja: 'かすみ除去中…', de: 'Entnebelung läuft…' },
    dehazeDone: { zh: '霧霾已壓制，野外／低對比影像應更清楚。', en: 'Haze reduced; field and flat shots should look clearer.', ja: 'ヘイズが減少しました。フィールドショットとフラットショットがより鮮明に見えるはずです。', de: 'Dunst reduziert. Feld- und Aufsichtsaufnahmen sollten klarer wirken.' },
    archiveProcessing: { zh: '典藏級修復堆疊中…', en: 'Archive restore stack…', ja: 'アーカイブ復元スタック…', de: 'Archiv Wiederherstellen stack…' },
    archiveDone: {
      zh: '典藏修復完成（CLAHE＋去霧＋降噪＋調色＋銳化）。',
      en: 'Archive restore complete (CLAHE + dehaze + denoise + grade + sharpen).',
      ja: 'アーカイブの復元が完了しました (CLAHE + かすみ除去 + ノイズ除去 + グレード + シャープ化)。', de: 'Archive restorevollständig (CLAHE + dehaze + denoise + grade + sharpen).'
    },
    archiveRepairBtn: { zh: '一鍵典藏修復', en: 'One-click archive restore', ja: 'ワンクリックでアーカイブを復元', de: 'Archiv mit einem Klick restaurieren' },
    runPresetBtn: { zh: '執行目前預設流程', en: 'Run selected preset', ja: '選択したプリセットを実行する', de: 'Gewählte Vorlage ausführen' },
    presetRunning: { zh: '預設流程執行中…', en: 'Running preset pipeline…', ja: 'プリセット パイプラインを実行中…', de: 'Läuft Voreinstellung pipeline…' },
    presetRunDone: { zh: '預設流程完成，請用修圖前／後對照檢查。', en: 'Preset pipeline done—check before/after.', ja: 'プリセット パイプラインが完了しました - 前後を確認してください。', de: 'Voreinstellung pipeline erledigt—Prüfen vor/nach.' },
    presetRunFailed: { zh: '預設流程失敗：', en: 'Preset pipeline failed: ', ja: 'プリセット パイプラインが失敗しました:', de: 'Vorlagenfolge fehlgeschlagen: ' },
    presetInpaintHint: {
      zh: '此預設需遮罩：請用筆刷標示瑕疵後執行「內容填補」。',
      en: 'This preset needs a mask: paint flaws, then run Inpaint.',
      ja: 'このプリセットにはマスクが必要です。欠陥をペイントしてから、修復を実行します。', de: 'Diese Vorlage braucht eine Maske: Fehler malen, dann Inpainting starten.'
    },
    toastPickPreset: { zh: '請先在左側選擇一個預設流程。', en: 'Pick a preset on the left first.', ja: '最初に左側のプリセットを選択します。', de: 'Wählen Sie zuerst links eine Vorlage.' },
    resetOriginal: { zh: '還原原圖', en: 'Reset to original', ja: '元に戻す', de: 'Zurücksetzen zu original' },
    toastResetOriginal: { zh: '已還原至上傳時的原圖。', en: 'Restored to the uploaded original.', ja: 'アップロードされたオリジナルに復元されました。', de: 'Restored zu uploaded original.' },
    toastNoBaseline: { zh: '尚無可還原的原圖基準。', en: 'No original baseline to restore.', ja: '復元する元のベースラインがありません。', de: 'Kein Original als Ausgangspunkt zum Wiederherstellen.' },
    compareBefore: { zh: '修圖前', en: 'Before', ja: '前に', de: 'Vor' },
    compareAfter: { zh: '修圖後', en: 'After', ja: '後', de: 'Nach' },
    toolbarGroupRestore: { zh: '修復增強', en: 'Restore', ja: '復元する', de: 'Wiederherstellen' },
    toolbarGroupCleanup: { zh: '瑕疵清理', en: 'Cleanup', ja: '掃除', de: 'Bereinigung' },
    toolbarGroupGeometry: { zh: '裁切／邊框', en: 'Crop / borders', ja: 'クロップ/ボーダー', de: 'Zuschneiden / borders' },
    toolbarGroupBgScale: { zh: '去背／放大／填補', en: 'Cutout / scale / inpaint', ja: 'カットアウト/スケール/インペイント', de: 'Freistellung / Skalieren / inpaint' },
    opExposure: { zh: '曝光提亮', en: 'Exposure lift', ja: '露出リフト', de: 'Belichtung anheben' },
    opSharpen: { zh: '銳化', en: 'Sharpen', ja: '研ぐ', de: 'Schärfen' },
    opWhiteBalance: { zh: '自動白平衡', en: 'Auto white balance', ja: 'オートホワイトバランス', de: 'Automatischer Weißabgleich' },
    opVignette: { zh: '暗角消除', en: 'Vignette removal', ja: 'ケラレの除去', de: 'Vignette entfernen' },
    opAutoCrop: { zh: '自動裁切', en: 'Auto crop', ja: '自動クロップ', de: 'Automatisch zuschneiden' },
    opBorderClean: { zh: '掃描邊框清理', en: 'Border cleanup', ja: '国境のクリーンアップ', de: 'Rand bereinigen' },
    exposureProcessing: { zh: '曝光提亮處理中…', en: 'Lifting exposure…', ja: '露出を引き上げています…', de: 'Belichtung wird angehoben…' },
    exposureDone: { zh: '陰影已提亮，高光已壓制。', en: 'Shadows lifted and highlights tamed.', ja: 'シャドウが取り除かれ、ハイライトが抑えられます。', de: 'Shadows lifted und highlights tamed.' },
    sharpenProcessing: { zh: '銳化處理中…', en: 'Sharpening…', ja: '研ぎ中…', de: 'Schärfung läuft…' },
    sharpenDone: { zh: '銳化完成，細節更清晰。', en: 'Sharpening complete—details are crisper.', ja: 'シャープニングが完了しました。細部がより鮮明になりました。', de: 'Sharpeningvollständig—details sind crisper.' },
    whiteBalanceProcessing: { zh: '白平衡校正處理中…', en: 'Correcting white balance…', ja: 'ホワイトバランスを補正中…', de: 'Weißabgleich wird korrigiert…' },
    whiteBalanceDone: { zh: '白平衡已校正。', en: 'White balance corrected.', ja: 'ホワイトバランスを修正しました。', de: 'Weißabgleich korrigiert.' },
    vignetteProcessing: { zh: '暗角消除處理中…', en: 'Removing vignette…', ja: 'ビネットを削除中…', de: 'Vignettierung wird entfernt…' },
    vignetteDone: { zh: '四角暗角已減輕。', en: 'Corner vignette reduced.', ja: 'コーナーケラレが軽減されました。', de: 'Eckvignettierung reduziert.' },
    canvasProcessing: { zh: '畫布處理中…', en: 'Canvas processing…', ja: 'キャンバス加工…', de: 'Canvas Verarbeitung…' },
    canvasTransformDone: { zh: '畫布變換完成，已更新預覽。', en: 'Canvas transform applied.', ja: 'キャンバス変換が適用されました。', de: 'Canvas Transformieren applied.' },
    canvasUnavailable: {
      zh: '畫布模組未載入，請重新整理頁面。',
      en: 'Canvas module not loaded—reload the page.',
      ja: 'Canvas モジュールがロードされていません。ページをリロードしてください。', de: 'Canvas-Modul nicht geladen. Seite neu laden.'
    },
    autoCropDone: { zh: '已自動裁切至內容邊界（白底留白）。', en: 'Auto-cropped to content bounds (white pad).', ja: 'コンテンツの境界に合わせて自動的にトリミングされます (白いパッド)。', de: 'Automatisch auf den Inhalt zugeschnitten (weißer Rand).' },
    borderCleanDone: { zh: '已裁除掃描黑邊／暗框。', en: 'Scanner dark borders trimmed.', ja: 'スキャナーの暗い境界線がトリミングされました。', de: 'Scanner dunkel borders trimmed.' },
    batchRunning: { zh: '批次處理中（去背＋典藏修復）…', en: 'Batch processing (cutout + archive)…', ja: 'バッチ処理（切り出し＋アーカイブ）…', de: 'Stapelverarbeitung (Freistellung und Archiv)…' },
    batchProcessing: { zh: '處理中', en: 'Processing', ja: '処理', de: 'Verarbeitung…' },
    batchError: { zh: '失敗', en: 'Failed', ja: '失敗した', de: 'Fehlgeschlagen' },
    batchDownload: { zh: '下載', en: 'Download', ja: 'ダウンロード', de: 'Herunterladen' },
    batchDownloadAll: { zh: '下載全部批次結果', en: 'Download all batch results', ja: 'すべてのバッチ結果をダウンロードする', de: 'Alle Stapelergebnisse herunterladen' },
    batchDownloadAllStarted: { zh: '正在下載 ', en: 'Downloading ', ja: 'ダウンロード中', de: 'Herunterladening' },
    batchDownloadAllSuffix: { zh: ' 個批次檔案…', en: ' batch file(s)…', ja: 'バッチファイル…', de: ' Stapeldatei(en)…' },
    autoRunPreset: { zh: '上傳後自動執行預設', en: 'Auto-run preset after upload', ja: 'アップロード後にプリセットを自動実行', de: 'Vorlage nach dem Hochladen automatisch ausführen' },
    quickStacksTitle: { zh: '一鍵堆疊', en: 'One-click stacks', ja: 'ワンクリックスタック', de: 'Ein-Klick-Stapel' },
    specimenIsolateBtn: { zh: '標本隔離（去背→裁切→修復）', en: 'Specimen isolate (cutout→crop→restore)', ja: '標本の分離（切り取り→切り取り→復元）', de: 'Präparat isolieren (Freistellung, Zuschnitt, Restaurierung)' },
    fieldRescueBtn: { zh: '野外救回堆疊', en: 'Field rescue stack', ja: 'フィールドレスキュースタック', de: 'Feld rescue stack' },
    fossilEnhanceBtn: { zh: '化石強化堆疊', en: 'Fossil enhance stack', ja: '化石強化スタック', de: 'Fossil-Verbesserungsstapel' },
    opCastRemove: { zh: '去黃／褪色', en: 'Yellow cast removal', ja: '黄ばみ除去', de: 'Gelbstich-Entfernung' },
    opPadWhite: { zh: '白邊留白', en: 'Add white margin', ja: '白い余白を追加する', de: 'Weißen Rand hinzufügen' },
    castRemoveProcessing: { zh: '去黃／褪色處理中…', en: 'Removing yellow cast…', ja: '黄ばみを除去中…', de: 'Gelbstich wird entfernt…' },
    castRemoveDone: { zh: '泛黃色偏已校正。', en: 'Yellow cast corrected.', ja: '黄色かぶりを修正しました。', de: 'Gelbstich korrigiert.' },
    quickEditBtn: { zh: '快速修圖', en: 'Quick photo edit', ja: 'クイック写真編集', de: 'Quick Foto Bearbeiten' },
    opQuickEdit: { zh: '快速修圖', en: 'Quick photo edit', ja: 'クイック写真編集', de: 'Quick Foto Bearbeiten' },
    quickEditProcessing: { zh: '快速修圖處理中…', en: 'Quick photo edit…', ja: '簡単な写真編集…', de: 'Quick Foto Bearbeiten…' },
    quickEditDone: {
      zh: '已套用輕量降噪、微調對比與銳化，保留原始色彩。',
      en: 'Light denoise, contrast, and sharpen applied—original colors preserved.',
      ja: '軽いノイズ除去、コントラスト、シャープネスが適用され、元の色が維持されます。', de: 'Light denoise, contrast, und sharpen applied—original colors preserved.'
    },
    padWhiteDone: { zh: '已加上白邊留白（適合標籤與護照排版）。', en: 'White margin added—good for labels and passport layout.', ja: '白い余白が追加されました。ラベルやパスポートのレイアウトに適しています。', de: 'Weißer Rand hinzugefügt, geeignet für Etiketten und Passlayout.' },
    saveSnapshot: { zh: '儲存目前版本快照', en: 'Save current snapshot', ja: '現在のスナップショットを保存する', de: 'Speichern current snapshot' },
    snapshotLabel: { zh: '快照', en: 'Snapshot', ja: 'スナップショット', de: 'Schnappschuss' },
    snapshotSaved: { zh: '已儲存版本快照，可從底部版本列切換。', en: 'Snapshot saved—switch from the version strip below.', ja: 'スナップショットが保存されました - 以下のバージョン ストリップから切り替えます。', de: 'Snapshot saved—switch von version strip below.' },
    snapshotFailed: { zh: '快照儲存失敗。', en: 'Could not save snapshot.', ja: 'スナップショットを保存できませんでした。', de: 'Schnappschuss konnte nicht gespeichert werden.' },
    imageMetaLabel: { zh: '尺寸：', en: 'Size: ', ja: 'サイズ：', de: 'Size:' },
    toastExportDone: { zh: '已下載匯出檔案。', en: 'Export downloaded.', ja: 'エクスポートがダウンロードされました。', de: 'Exportieren downloaded.' },
    toastExportFailed: { zh: '匯出失敗，請重試。', en: 'Export failed—try again.', ja: 'エクスポートに失敗しました。もう一度お試しください。', de: 'Export fehlgeschlagen. Erneut versuchen.' },

    providerOss: {
      zh: '本機完整堆疊（Rembg + 增強 + ESRGAN）',
      en: 'On-device full stack (Rembg + enhance + ESRGAN)',
      ja: 'オンデバイスのフルスタック (Rembg + 強化 + ESRGAN)', de: 'Vollständiger Stapel auf dem Gerät (Rembg, Verbesserung, ESRGAN)'
    },
    providerOssHint: { zh: '去背、增強、2×／4× 放大皆在本機執行；IOPaint 連線時遮罩填補會自動走 LaMa。首次需下載模型。', en: 'Cutout, enhance, and 2×/4× upscale run on-device; inpaint uses LaMa when IOPaint is connected. First run downloads models.', ja: 'カットアウト、エンハンス、2x/4x アップスケールはデバイス上で実行されます。 IOPaint が接続されている場合、inpaint は LaMa を使用します。最初の実行ではモデルをダウンロードします。', de: 'Freistellen, Verbessern und 2×/4×-Hochskalierung laufen auf dem Gerät; Inpainting nutzt LaMa, wenn IOPaint verbunden ist. Beim ersten Lauf werden Modelle heruntergeladen.'
    },
    providerEsrgan: {
      zh: 'Real-ESRGAN 級放大（UpscalerJS，本機）',
      en: 'Real-ESRGAN-class upscale (UpscalerJS, on-device)',
      ja: 'Real-ESRGAN クラスのアップスケール (UpscalerJS、オンデバイス)', de: 'Real-ESRGAN-Upscale (UpscalerJS, auf dem Gerät)'
    },
    enhanceProcessing: { zh: '本機增強處理中…', en: 'Enhancing on-device…', ja: 'オンデバイスを強化中…', de: 'Geräteinterne Verbesserung läuft…' },
    upscaleProcessing: { zh: '本機放大處理中…', en: 'Upscaling on-device…', ja: 'デバイス上でアップスケーリング中…', de: 'Geräteinterne Hochskalierung läuft…' },
    upscaleDone: { zh: '放大完成，已更新預覽（維持原始長寬比）。', en: 'Upscale complete; preview updated (aspect ratio preserved).', ja: '高級感が完成しました。プレビューが更新されました (アスペクト比は維持されました)。', de: 'Vergrößerung abgeschlossen, Vorschau aktualisiert (Seitenverhältnis bleibt).' },
    upscaleClamped: {
      zh: '影像過大，已等比例縮至最長邊 4096px 內再輸出。',
      en: 'Image was proportionally limited to 4096px on the longest side.',
      ja: '画像は比例して最長辺が 4096px に制限されました。', de: 'Image war proportionally limited zu 4096px auf longest side.'
    },
    upscaleUnavailable: { zh: '無法載入放大模組（可改用示範模式或檢查網路）。', en: 'Could not load upscale module (use demo mode or check network).', ja: 'アップスケール モジュールをロードできませんでした (デモ モードを使用するか、ネットワークを確認してください)。', de: 'Vergrößerungsmodul konnte nicht geladen werden (Demomodus oder Netz prüfen).'
    },
    plateStackBtn: { zh: '一鍵標本商品照', en: 'One-click specimen plate', ja: 'ワンクリック試料プレート', de: 'Ein-Klick-Präparattafel' },
    plateStackRunning: {
      zh: '去背 → 增強 → 2× 放大…',
      en: 'Cutout → enhance → 2× upscale…',
      ja: 'カットアウト→エンハンス→2倍の高級化…', de: 'Freistellung, Verbesserung, 2-fache Vergrößerung…'
    },
    plateStackDone: {
      zh: '標本商品照堆疊完成，可匯出或再微調。',
      en: 'Specimen plate stack complete—export or fine-tune.',
      ja: '標本プレートのスタックが完了しました - エクスポートまたは微調整。', de: 'Präparatplattenstapel fertig. Exportieren oder feinjustieren.'
    },
    plateStackFailed: { zh: '商品照堆疊失敗：', en: 'Plate stack failed: ', ja: 'プレートスタックが失敗しました:', de: 'Plattenstapel fehlgeschlagen:' },
    plateStackNeedImage: { zh: '請先上傳或拍照取得影像。', en: 'Upload or capture an image first.', ja: 'まず画像をアップロードまたはキャプチャします。', de: 'Laden Sie zuerst ein Bild hoch oder nehmen Sie eines auf.' },
    presetPassportHint: { zh: '護照清理預設：建議按「一鍵標本商品照」執行完整堆疊。', en: 'Passport cleanup preset: use “One-click specimen plate” for the full stack.', ja: 'パスポートクリーンアッププリセット: フルスタックには「ワンクリック標本プレート」を使用します。', de: 'Passport-Bereinigungsvoreinstellung: „Ein-Klick-Präparattafel“ für den gesamten Stapel verwenden.'
    },

    ossCreditsTitle: { zh: '開源元件', en: 'Open-source components', ja: 'オープンソースコンポーネント', de: 'Öffnen-source components' },
    ossCreditsBody: { zh: '去背：@imgly/background-removal。增強：CLAHE 局部對比、暗通道去霧、CamanJS 色溫、CanvasEffects 調整、反光壓制、中值除塵。放大：UpscalerJS。填補：IOPaint（LaMa）。', en: 'Cutout: @imgly/background-removal. Enhance: CLAHE, dark-channel dehaze, CamanJS kelvin, CanvasEffects-style grade, glare recovery, median dust removal. Upscale: UpscalerJS. Inpaint: IOPaint (LaMa).', ja: 'カットアウト: @imgly/background-removal。強化: CLAHE、ダークチャンネルのかすみ除去、CamanJS ケルビン、CanvasEffects スタイルのグレード、グレア回復、メディアンダスト除去。アップスケール: UpscalerJS。インペイント: IOPaint (LaMa)。', de: 'Freistellen: @imgly/background-removal. Verbessern: CLAHE, Dark-Channel-Entnebelung, CamanJS-Kelvin, CanvasEffects-Stil-Gradierung, Blendung-Wiederherstellung, mediane Staubentfernung. Hochskalierung: UpscalerJS. Inpainting: IOPaint (LaMa).'
    },
    quickOpsTitle: { zh: '快速修圖', en: 'Quick photo edit', ja: 'クイック写真編集', de: 'Quick Foto Bearbeiten' },
    gradePanelTitle: { zh: '調色（本機）', en: 'Color grade (on-device)', ja: 'カラーグレード (デバイス上)', de: 'Farbkorrektur (auf dem Gerät)' },
    gradePanelHint: {
      zh: '調整色溫、色調、飽和度等後按「套用調色」，或工具列「調色」。',
      en: 'Adjust temperature, tint, saturation, then Apply grade or use the toolbar.',
      ja: '温度、色合い、彩度を調整し、グレードを適用するか、ツールバーを使用します。', de: 'Temperatur, Farbton und Sättigung einstellen, dann die Korrektur anwenden oder die Werkzeugleiste nutzen.'
    },
    gradeTemperature: { zh: '色溫', en: 'Temperature', ja: '温度', de: 'Temperatur' },
    gradeTint: { zh: '色調', en: 'Tint', ja: '色合い', de: 'Farbton' },
    gradeSaturation: { zh: '飽和度', en: 'Saturation', ja: '飽和', de: 'Sättigung' },
    gradeContrast: { zh: '對比', en: 'Contrast', ja: '対比', de: 'Kontrast' },
    gradeVibrance: { zh: '自然飽和', en: 'Vibrance', ja: '活気', de: 'Lebendigkeit' },
    gradeShadows: { zh: '陰影', en: 'Shadows', ja: '影', de: 'Schatten' },
    gradeHighlights: { zh: '高光', en: 'Highlights', ja: 'ハイライト', de: 'Glanzlichter' },
    gradeApplyBtn: { zh: '套用調色', en: 'Apply color grade', ja: 'カラーグレードを適用する', de: 'Anwenden color Note' },
    gradeProcessing: { zh: '調色處理中…', en: 'Color grading…', ja: 'カラーグレーディング…', de: 'Farbabstimmung läuft…' },
    gradeDone: { zh: '調色完成，已更新預覽。', en: 'Color grade applied; preview updated.', ja: 'カラーグレードが適用されます。プレビューが更新されました。', de: 'Color Note applied; Vorschau aktualisiert.' },
    glareProcessing: { zh: '降低反光處理中…', en: 'Reducing glare…', ja: 'まぶしさを軽減…', de: 'Blendung wird reduziert…' },
    glareDone: { zh: '反光已壓制，已更新預覽。', en: 'Glare reduced; preview updated.', ja: 'まぶしさが軽減されました。プレビューが更新されました。', de: 'Glare reduced; Vorschau aktualisiert.' },
    colorProcessing: { zh: '色彩／低光修復中…', en: 'Color correction…', ja: '色補正…', de: 'Farbkorrektur läuft…' },
    derainProcessing: { zh: '除雨／去霧處理中…', en: 'Derain / dehaze…', ja: 'ディレイン / かすみ除去…', de: 'Entregnen / Entnebeln läuft…' },
    derainDone: { zh: '除雨處理完成。', en: 'Derain pass complete.', ja: 'ドレインパス完了。', de: 'Derain passvollständig.' },
    providerLocalLama: { zh: 'LaMa（IOPaint 本機 API）', en: 'LaMa (IOPaint local API)', ja: 'LaMa (IOPaint ローカル API)', de: 'LaMa (IOPaint-Lokal-API)' },
    providerIoPaint: { zh: 'IOPaint 本機 API（沿用伺服器目前模型）', en: 'IOPaint local API (server current model)', ja: 'IOPaint ローカル API (サーバーの現行モデル)', de: 'Lokale IOPaint-API (aktuelles Servermodell)' },
    providerInpaintHint: { zh: '在遮罩上標示要修復的區域，選 LaMa 或 IOPaint 後執行「內容填補」。需本機 iopaint 服務。', en: 'Paint the mask, choose LaMa or IOPaint, then run Inpaint. Requires a local iopaint server.', ja: 'マスクをペイントし、LaMa または IOPaint を選択して、Inpaint を実行します。ローカルの IOPaint サーバーが必要です。', de: 'Maske malen, LaMa oder IOPaint wählen, dann Inpainting ausführen. Erfordert einen lokalen IOPaint-Server.'
    },
    iopaintPanelTitle: { zh: 'IOPaint 本機連線', en: 'IOPaint local connection', ja: 'IOPaint ローカル接続', de: 'IOPaint-Lokalverbindung' },
    iopaintBaseLabel: { zh: 'API 位址', en: 'API base URL', ja: 'APIベースURL', de: 'API-Basis-URL' },
    iopaintBaseHint: {
      zh: '預設經 UI 預覽代理：http://127.0.0.1:8765/iopaint-proxy（轉發至 8080）。亦可填 http://127.0.0.1:8080。',
      en: 'Default uses UI preview proxy http://127.0.0.1:8765/iopaint-proxy (forwards to 8080). Or set http://127.0.0.1:8080 directly.',
      ja: 'デフォルトでは、UI プレビュー プロキシ http://127.0.0.1:8765/iopaint-proxy (8080 に転送) を使用します。または、http://127.0.0.1:8080 を直接設定します。', de: 'Standard ist der UI-Vorschau-Proxy http://127.0.0.1:8765/iopaint-proxy (leitet an 8080 weiter). Oder direkt http://127.0.0.1:8080 setzen.'
    },
    iopaintTestBtn: { zh: '測試連線', en: 'Test connection', ja: 'テスト接続', de: 'Verbindung prüfen' },
    iopaintTesting: { zh: '正在連線 IOPaint…', en: 'Connecting to IOPaint…', ja: 'IOPaint に接続中…', de: 'Connecting zu IOPaint…' },
    iopaintOnline: { zh: 'IOPaint 已連線', en: 'IOPaint connected', ja: 'IOPaint が接続されました', de: 'IOPaint verbunden' },
    iopaintOffline: {
      zh: '無法連線 IOPaint。請執行 scripts/start-iopaint-lama.ps1 或 iopaint start --model=lama --port=8080',
      en: 'Cannot reach IOPaint. Run scripts/start-iopaint-lama.ps1 or iopaint start --model=lama --port=8080',
      ja: 'IOPaint にアクセスできません。 scripts/start-IOPaint-lama.ps1 または IOPaint start --model=lama --port=8080 を実行します。', de: 'IOPaint nicht erreichbar. scripts/start-iopaint-lama.ps1 ausführen oder: iopaint start --model=lama --port=8080'
    },
    iopaintStatusOnline: { zh: '已連線', en: 'Connected', ja: '接続済み', de: 'Verbunden' },
    iopaintStatusOffline: { zh: '離線', en: 'Offline', ja: 'オフライン', de: 'Getrennt' },
    iopaintStatusUnknown: { zh: '尚未測試', en: 'Not tested', ja: 'テストされていません', de: 'Nicht geprüft' },
    iopaintCurrentModel: { zh: '目前模型：', en: 'Current model: ', ja: '現在のモデル:', de: 'Aktuelles Modell: ' },
    iopaintUnavailable: {
      zh: '本機填補模組未載入。',
      en: 'Local inpaint module not loaded.',
      ja: 'ローカルの修復モジュールがロードされていません。', de: 'Lokales Inpainting-Modul nicht geladen.'
    },
    inpaintProcessing: { zh: '本機 LaMa／IOPaint 填補中…', en: 'Local LaMa/IOPaint inpainting…', ja: 'ローカルの LaMa/IOPaint 修復…', de: 'Lokales LaMa/IOPaint-Inpainting läuft…' },
    inpaintDone: { zh: '遮罩區域填補完成，已更新預覽。', en: 'Masked inpaint complete; preview updated.', ja: 'マスクされた修復が完了しました。プレビューが更新されました。', de: 'Maskiertes Inpainting abgeschlossen, Vorschau aktualisiert.' },
    inpaintFailed: { zh: '填補失敗：', en: 'Inpaint failed: ', ja: 'インペイントが失敗しました:', de: 'Inpaint failed:' },
    inpaintEmptyMask: {
      zh: '請先用筆刷在遮罩上標示要修復的區域（灰塵、破損邊緣等）。',
      en: 'Paint the mask first (dust, torn edges, etc.) before inpainting.',
      ja: '再ペイントする前に、まずマスク (ほこり、破れたエッジなど) をペイントします。', de: 'Malen Sie zuerst die Maske (Staub, Risse am Rand usw.), bevor Sie inpainting starten.'
    },
    providerStubToast: {
      zh: '已選占位轉接器：仍使用本機示範延遲，待後端串接後才會實際運算。',
      en: 'Stub adapter selected: demo delay only until a backend is wired.',
      ja: 'スタブ アダプターが選択されました: バックエンドが接続されるまでデモのみ遅延します。', de: 'Stub-Adapter gewählt: nur Demoverzögerung, bis ein Backend angebunden ist.'
    },
    processingGeneric: { zh: '處理中…', en: 'Processing…', ja: '処理…', de: 'Verarbeitung…' },

    enhanceUnavailable: {
      zh: '本機增強模組未載入，請重新整理頁面或檢查腳本順序。',
      en: 'On-device enhance module not loaded. Reload the page or check script order.',
      ja: 'デバイス上の拡張モジュールがロードされていません。ページをリロードするか、スクリプトの順序を確認してください。', de: 'Verbesserungsmodul auf dem Gerät nicht geladen. Seite neu laden oder die Skriptreihenfolge prüfen.'
    },
    moduleMissing: { zh: '此功能所需的本機模組尚未就緒，請在右側「開源模組狀態」按重新檢查。', en: 'Required on-device module is not ready. Use Open-source status → Re-check on the right.', ja: '必要なオンデバイス モジュールの準備ができていません。オープンソースステータスを使用→右側で再確認してください。', de: 'Ein nötiges Modul auf dem Gerät ist nicht bereit. Rechts unter Open-Source-Status erneut prüfen.'
    },
    inpaintNeedServer: { zh: '內容填補需本機 IOPaint（LaMa）。請執行 start-iopaint-lama.ps1 並在右側測試連線。', en: 'Inpaint needs local IOPaint (LaMa). Run start-iopaint-lama.ps1 and test connection on the right.', ja: 'Inpaint にはローカル IOPaint (LaMa) が必要です。 start-IOPaint-lama.ps1 を実行し、右側で接続をテストします。', de: 'Inpainting benötigt lokales IOPaint (LaMa). start-iopaint-lama.ps1 ausführen und Verbindung rechts testen.'
    },
    exportPrepProcessing: { zh: '匯出前優化處理中…', en: 'Export prep processing…', ja: 'エクスポート準備処理中…', de: 'Exportieren prep processing…' },
    exportPrepDone: {
      zh: '匯出前優化完成，可開啟「匯出…」下載。',
      en: 'Export prep complete. Open Export… to download.',
      ja: 'エクスポートの準備が完了しました。 「エクスポート…」を開いてダウンロードします。', de: 'Exportvorbereitung abgeschlossen. Export öffnen, um herunterzuladen.'
    },

    ossStatusTitle: { zh: '開源模組狀態', en: 'Open-source module status', ja: 'オープンソースモジュールのステータス', de: 'Status der Open-Source-Module' },
    ossStatusHint: {
      zh: '綠燈＝可用；黃燈＝放大僅 canvas 備援；紅燈＝需網路下載模型或啟動 IOPaint。',
      en: 'Green = ready; yellow = upscale canvas fallback; red = download models (network) or start IOPaint.',
      ja: '緑色 = 準備完了。黄色 = 高級キャンバスのフォールバック。赤 = モデル (ネットワーク) をダウンロードするか、IOPaint を開始します。', de: 'Grün = bereit; gelb = Canvas-Ersatz für die Vergrößerung; rot = Modelle laden (Netz) oder IOPaint starten.'
    },
    ossRembgLabel: { zh: '去背 Rembg', en: 'Cutout Rembg', ja: 'カットアウトレンブ', de: 'Freistellung Rembg' },
    ossEnhanceLabel: { zh: '增強', en: 'Enhance', ja: '強化する', de: 'Verbessern' },
    ossUpscaleLabel: { zh: '放大', en: 'Upscale', ja: '高級感のある', de: 'Hochskalieren' },
    ossInpaintLabel: { zh: '填補 IOPaint', en: 'Inpaint IOPaint', ja: 'IOPaintの修復', de: 'Inpainting IOPaint' },
    ossReady: { zh: '就緒', en: 'Ready', ja: '準備ができて', de: 'Bereit' },
    ossLoading: { zh: '載入中', en: 'Loading', ja: '読み込み中', de: 'Laden…' },
    ossError: { zh: '失敗', en: 'Failed', ja: '失敗した', de: 'Fehlgeschlagen' },
    ossOffline: { zh: '離線', en: 'Offline', ja: 'オフライン', de: 'Getrennt' },
    ossUnknown: { zh: '未知', en: 'Unknown', ja: '不明', de: 'Unbekannt' },
    ossCanvasFallback: { zh: 'Canvas 備援', en: 'Canvas fallback', ja: 'キャンバスフォールバック', de: 'Canvas-Ersatz' },
    ossRefreshBtn: { zh: '重新檢查模組', en: 'Re-check modules', ja: 'モジュールを再チェックする', de: 'Module erneut prüfen' },
    ossRefreshing: { zh: '正在檢查本機模組…', en: 'Checking on-device modules…', ja: 'デバイス上のモジュールを確認しています…', de: 'Module auf dem Gerät werden geprüft…' },
    ossRefreshDone: { zh: '模組狀態已更新。', en: 'Module status updated.', ja: 'モジュールのステータスが更新されました。', de: 'Modulstatus aktualisiert.' },

    presetFlowTitle: { zh: '預設流程', en: 'Presets', ja: 'プリセット', de: 'Voreinstellungen' },
    canvasToolsTitle: { zh: '畫布工具', en: 'Canvas tools', ja: 'キャンバスツール', de: 'Canvas-Werkzeuge' },
    toolPan: { zh: '平移', en: 'Pan', ja: 'パン', de: 'Verschieben' },
    toolBrush: { zh: '筆刷', en: 'Brush', ja: 'ブラシ', de: 'Pinsel' },
    toolBrushMask: { zh: '筆刷遮罩', en: 'Brush mask', ja: 'ブラシマスク', de: 'Pinselmaske' },
    toolEraser: { zh: '橡皮擦', en: 'Eraser', ja: '消しゴム', de: 'Radiergummi' },
    toolRotate90: { zh: '旋轉 90°', en: 'Rotate 90°', ja: '90°回転', de: 'Drehen 90°' },
    toolFlipH: { zh: '水平翻轉', en: 'Flip horizontal', ja: '水平方向に反転', de: 'Horizontal spiegeln' },
    toolFlipV: { zh: '垂直翻轉', en: 'Flip vertical', ja: '垂直方向に反転', de: 'Vertikal spiegeln' },
    toolResetView: { zh: '重設檢視', en: 'Reset view', ja: 'ビューをリセット', de: 'Ansicht zurücksetzen' },
    canvasTransformNote: {
      zh: '旋轉／翻轉會寫入像素；自動裁切適合白底標本照。',
      en: 'Rotate/flip change pixels; auto crop suits white-background plates.',
      ja: 'ピクセルを回転/反転して変更します。自動クロップは白背景のプレートに適しています。', de: 'Drehen und Spiegeln ändern Pixel. Automatischer Zuschnitt passt zu Platten mit weißem Hintergrund.'
    },
    compareBeforeAfter: { zh: '修圖前／後', en: 'Before / after', ja: '前 / 後', de: 'Vor / nach' },
    altSourceImage: { zh: '來源影像', en: 'Source image', ja: 'ソース画像', de: 'Quellbild' },
    altCompareOverlay: { zh: '修圖前後對照疊圖', en: 'Before/after overlay', ja: 'オーバーレイ前/オーバーレイ後', de: 'Vor/nach overlay' },
    versionsTitle: { zh: '版本', en: 'Versions', ja: 'バージョン', de: 'Versionen' },
    noVersionsYet: { zh: '尚無版本', en: 'No versions yet', ja: 'まだバージョンがありません', de: 'Nein versions yet' },
    batchQueueTitle: { zh: '批次佇列', en: 'Batch queue', ja: 'バッチキュー', de: 'Stapelwarteschlange' },
    noBatchItems: { zh: '無項目', en: 'No items', ja: 'アイテムがありません', de: 'Keine Elemente' },
    scientificSafetyTitle: { zh: '科學安全', en: 'Scientific safety', ja: '科学的安全性', de: 'Wissenschaftliche Sicherheit' },
    safeModePanelDesc: { zh: '開啟時，內容填補應以背景瑕疵為主；若遮罩涵蓋主體，系統會提示風險。', en: 'When on, inpaint only background flaws; masking the subject triggers a warning.', ja: 'オンの場合、背景の欠陥のみを修復します。件名をマスクすると警告が表示されます。', de: 'Wenn an, wird nur der Hintergrund in der Maske gefüllt. Eine Maske über dem Objekt löst eine Warnung aus.'
    },
    inpaintExamplesWarn: {
      zh: '填補範例：灰塵、污漬、桌緣、手指、眩光；請勿遮蓋比例尺、標籤文字或形態鑑定區域。',
      en: 'Inpaint dust, stains, table edges, fingers, glare—not scale bars, labels, or diagnostic morphology.',
      ja: 'スケール バー、ラベル、診断形態ではなく、ほこり、汚れ、テーブルの端、指、まぶしさを修復します。', de: 'Staub, Flecken, Tischkanten, Finger und Spiegelungen füllen, nicht Maßstäbe, Etiketten oder diagnostische Morphologie.'
    },
    aiProviderTitle: { zh: 'AI 提供者', en: 'AI provider', ja: 'AIプロバイダー', de: 'KI-Anbieter' },
    providerMock: { zh: '示範（本機模擬）', en: 'Demo (local simulation)', ja: 'デモ（ローカルシミュレーション）', de: 'Demo (lokale Simulation)' },
    providerRestormerStub: { zh: 'Restormer（占位，待後端）', en: 'Restormer (stub, backend pending)', ja: 'Restormer (スタブ、バックエンド保留中)', de: 'Restormer (stub, backendausstehend)' },
    providerBrowserInpaintStub: { zh: '瀏覽器填補（占位）', en: 'Browser inpaint (stub)', ja: 'ブラウザの修復（スタブ）', de: 'Browser-Inpainting (Stub)' },
    providerComfyStub: { zh: 'ComfyUI（占位，待後端）', en: 'ComfyUI (stub, backend pending)', ja: 'ComfyUI (スタブ、バックエンド保留中)', de: 'ComfyUI (stub, backendausstehend)' },
    metadataTitle: { zh: '詮釋資料', en: 'Metadata', ja: 'メタデータ', de: 'Metadaten' },
    exportIntegrationTitle: { zh: '匯出與串接', en: 'Export & integrations', ja: 'エクスポートと統合', de: 'Exportieren & integrations' },
    exportIntegrationDesc: {
      zh: '匯出會在本機轉檔；護照裁切、白底 JPG、縮圖可直接下載。串接其他模組仍為占位。',
      en: 'Export encodes on-device; passport crop, white JPG, and thumbs download locally. Integrations remain stubs.',
      ja: 'エクスポートはデバイス上でエンコードします。パスポートのクロップ、白の JPG、サムネイルをローカルにダウンロードします。統合はスタブのままです。', de: 'Der Export wird auf dem Gerät kodiert. Passzuschnitt, weißes JPG und Vorschaubilder werden lokal geladen. Integrationen bleiben Platzhalter.'
    },
    openExport: { zh: '匯出…', en: 'Export…', ja: '輸出…', de: 'Exportieren…' },
    downloadIntegrityJson: { zh: '下載完整性 JSON', en: 'Download integrity JSON', ja: '整合性 JSON をダウンロードする', de: 'Herunterladen integrity JSON' },
    exportModalTitle: { zh: '匯出', en: 'Export', ja: 'エクスポート', de: 'Exportieren' },
    exportModalDesc: {
      zh: '依格式在本機轉檔後下載；ZIP 批次仍請用批次佇列逐檔下載。',
      en: 'On-device encode then download; for ZIP batch use the queue downloads.',
      ja: 'デバイス上でエンコードしてからダウンロードします。 ZIP バッチの場合は、キューのダウンロードを使用します。', de: 'Auf dem Gerät kodieren und herunterladen. Für ZIP-Stapel die Warteschlangen-Downloads nutzen.'
    },
    exportPng: { zh: '修復後 PNG', en: 'Restored PNG', ja: '復元された PNG', de: 'Restauriertes PNG' },
    exportJpg: { zh: '修復後 JPG', en: 'Restored JPG', ja: '復元されたJPG', de: 'Restauriertes JPG' },
    exportPngTr: { zh: '透明 PNG', en: 'Transparent PNG', ja: '透過PNG', de: 'Transparentes PNG' },
    exportJpgWhite: { zh: '白底 JPG', en: 'White-bg JPG', ja: '白地JPG', de: 'JPG mit weißem Hintergrund' },
    exportPassport: { zh: '護照 4:3 裁切', en: 'Passport 4:3 crop', ja: 'パスポート 4:3 クロップ', de: 'Pass 4:3 Zuschneiden' },
    exportSat: { zh: 'SAT 上架圖（1600px）', en: 'SAT listing (1600px)', ja: 'SAT リスト (1600px)', de: 'SAT-Angebot (1600px)' },
    exportThumb: { zh: '縮圖（512px）', en: 'Thumbnail (512px)', ja: 'サムネイル (512px)', de: 'Miniaturansicht (512px)' },
    exportPngTrStub: { zh: '透明 PNG', en: 'Transparent PNG', ja: '透過PNG', de: 'Transparentes PNG' },
    exportJpgWhiteStub: { zh: '白底 JPG', en: 'White-bg JPG', ja: '白地JPG', de: 'JPG mit weißem Hintergrund' },
    exportPassportStub: { zh: '護照裁切', en: 'Passport crop', ja: 'パスポートクロップ', de: 'Passzuschnitt' },
    exportSatStub: { zh: 'SAT 上架圖', en: 'SAT listing image', ja: 'SATリスト画像', de: 'SAT listing Bild' },
    exportThumbStub: { zh: '縮圖', en: 'Thumbnail', ja: 'サムネイル', de: 'Miniaturansicht' },
    exportZipStub: { zh: 'ZIP 批次（占位）', en: 'ZIP batch (stub)', ja: 'ZIP バッチ (スタブ)', de: 'ZIP Stapel (stub)' },
    mobileSheetTitle: { zh: '預設與安全', en: 'Presets & safety', ja: 'プリセットと安全性', de: 'Voreinstellungen & safety' },
    mobileSheetExport: { zh: '預設與匯出', en: 'Presets & export', ja: 'プリセットとエクスポート', de: 'Presets &Exportieren' },
    stubSaveAsset: { zh: '存入素材庫（占位）', en: 'Save to asset library (stub)', ja: 'アセット ライブラリに保存 (スタブ)', de: 'Speichern zu asset library (stub)' },
    stubPassportCard: { zh: '用於護照卡片（占位）', en: 'Use on passport card (stub)', ja: 'パスポートカード（半券）に使用', de: 'Auf der Passkarte verwenden (Platzhalter)' },
    stubSat: { zh: '用於 SAT 市集（占位）', en: 'Use on SAT marketplace (stub)', ja: 'SAT マーケットプレイスでの使用 (スタブ)', de: 'Im SAT-Marktplatz verwenden (Platzhalter)' },
    stubPublicVm: { zh: '用於公開圖庫（占位）', en: 'Use on public gallery (stub)', ja: '公開ギャラリーで使用（半券）', de: 'In der öffentlichen Galerie verwenden (Platzhalter)' },
    stubAttachSpecimen: { zh: '附加至標本（占位）', en: 'Attach to specimen (stub)', ja: '標本（スタブ）に貼り付ける', de: 'Attach zu Präparat (stub)' },
    progressDone: { zh: '完成', en: 'Done', ja: '終わり', de: 'Erledigt' },
    progressError: { zh: '錯誤', en: 'Error', ja: 'エラー', de: 'Fehler' },
    demoSuffix: { zh: '（示範）', en: ' (demo)', ja: '（デモ）', de: ' (Demo)' },
    demoPixelsNote: {
      zh: '示範：像素未變更；正式管線僅依遮罩處理。',
      en: 'Demo: pixels unchanged; production pipeline uses the mask only.',
      ja: 'デモ: ピクセルは変更されません。実稼働パイプラインはマスクのみを使用します。', de: 'Demo: Pixel unverändert. Die Produktionsfolge nutzt nur die Maske.'
    },
    demoExportNote: { zh: '示範匯出仍連結原始 blob', en: 'Demo export still links the original blob', ja: 'デモのエクスポートでは元の BLOB が引き続きリンクされます', de: 'Demo-Export verweist weiterhin auf das Original' },
    toastPresetSelected: { zh: '已選擇預設，請上傳照片開始。', en: 'Preset selected—upload a photo to start.', ja: 'プリセットが選択されています - 開始するには写真をアップロードしてください。', de: 'Vorlage gewählt. Laden Sie ein Foto hoch, um zu beginnen.' },
    toastZipDemo: { zh: 'ZIP 匯出：示範版請改用完整性 JSON 加逐檔下載。', en: 'ZIP export: in demo mode use the integrity JSON plus per-file downloads.', ja: 'ZIP エクスポート: デモ モードでは、整合性 JSON とファイルごとのダウンロードを使用します。', de: 'ZIP-Export: im Demomodus die Integritäts-JSON und die Einzeldownloads nutzen.'
    },
    toastRotateDemo: {
      zh: '旋轉 90°：示範版不寫入像素，僅供介面預覽（非破壞性占位）。',
      en: 'Rotate 90°: demo UI only; pixels are not changed.',
      ja: '90°回転: デモ UI のみ。ピクセルは変更されません。', de: 'Drehen um 90°: nur Demo-Oberfläche, Pixel bleiben unverändert.'
    },
    toastFlipDemo: {
      zh: '翻轉：已記錄操作（示範版不改變像素）。',
      en: 'Flip logged (demo does not change pixels).',
      ja: '反転ログ (デモはピクセルを変更しません)。', de: 'Spiegeln protokolliert (die Demo ändert keine Pixel).'
    },
    toastIntegrationStub: { zh: '串接占位：素材庫／標本將於後續版本連線。', en: 'Integration stub: asset library and specimens will connect in a later release.', ja: '統合スタブ: アセット ライブラリと標本は、後のリリースで接続されます。', de: 'Integration stub: asset library und Präparate wird connect in later release.'
    },
    toastSaveAssetStub: { zh: '存入素材庫（占位，未實際儲存）。', en: 'Asset library save is a stub (not persisted).', ja: 'アセット ライブラリの保存はスタブです (永続化されません)。', de: 'Asset Bibliothek Speichern ist a stub (nicht persisted).' },
    toastDownstreamStub: {
      zh: '下游模組在此獨立版本中為占位，尚未寫入。',
      en: 'Downstream modules are stubs in this standalone build.',
      ja: 'ダウンストリーム モジュールは、このスタンドアロン ビルドではスタブです。', de: 'Nachgelagerte Module sind in dieser eigenständigen Fassung Platzhalter.'
    },
    toastNoUndoMask: { zh: '沒有可復原的遮罩步驟', en: 'No mask step to undo', ja: '元に戻すマスクステップはありません', de: 'Kein Maskenschritt zum Rückgängigmachen' },
    toastNoRedoMask: { zh: '沒有可重做的遮罩步驟', en: 'No mask step to redo', ja: 'やり直すマスクステップはありません', de: 'Kein Maskenschritt zum Wiederholen' },
    toastSplitViewHint: {
      zh: '分割檢視：請先用「修圖前／後」滑桿；完整雙窗格將於後續迭代提供。',
      en: 'Split view: use the before/after slider; dual-pane view comes later.',
      ja: '分割ビュー: 前後のスライダーを使用します。デュアルペインビューは後で提供されます。', de: 'Geteilte Ansicht: Schieberegler vorher/nachher. Eine Doppelansicht folgt später.'
    },

    presetPassportName: { zh: '標本護照畫面整理', en: 'Passport specimen cleanup', ja: 'パスポート見本のクリーンアップ', de: 'Passport Präparat cleanup' },
    presetPassportDesc: { zh: '適合護照卡片的標本商品照：去背噪、輕微銳化，不改變形態辨識特徵。', en: 'Product-style specimen shots for passport cards: cutout, light sharpen, morphology preserved.', ja: 'パスポート カードの製品スタイルの標本ショット: 切り抜き、光シャープ、形態の保存。', de: 'Produktähnliche Präparataufnahmen für Passkarten: Freistellung, leichte Schärfung, Morphologie bleibt erhalten.'
    },
    presetPassportExport: { zh: '護照卡 PNG、透明 PNG、白底 JPG', en: 'Passport PNG, transparent PNG, white JPG', ja: 'パスポートPNG、透過PNG、白JPG', de: 'Pass-PNG, transparentes PNG, weißes JPG' },
    presetPassportPipe1: { zh: '自動裁切', en: 'Auto crop', ja: '自動クロップ', de: 'Automatisch zuschneiden' },
    presetPassportPipe2: { zh: '背景整理', en: 'Background cleanup', ja: 'バックグラウンドのクリーンアップ', de: 'Hintergrund bereinigen' },
    presetPassportPipe3: { zh: '輕度銳化', en: 'Light sharpen', ja: 'ライトシャープ', de: 'Leicht schärfen' },
    presetPassportPipe4: { zh: '2× 放大', en: '2× upscale', ja: '2×高級', de: '2× hochskalieren' },

    presetFossilName: { zh: '化石板強化', en: 'Fossil slab enhance', ja: '化石石版の強化', de: 'Fossilplatte verbessern' },
    presetFossilDesc: {
      zh: '提升清晰度與對比，不變更化石形態與鑑定結構。',
      en: 'Boost clarity and contrast without altering fossil morphology or diagnostic structure.',
      ja: '化石の形態や診断構造を変えることなく、明瞭さとコントラストを高めます。', de: 'Klarheit und Kontrast erhöhen, ohne Fossilmorphologie oder diagnostische Struktur zu verändern.'
    },
    presetFossilExport: { zh: '典藏、研究預覽、SAT 上架圖', en: 'Archive, research preview, SAT listing', ja: 'アーカイブ、研究プレビュー、SAT リスト', de: 'Archiv, Forschungsvorschau, SAT-Eintrag' },
    presetFossilPipe1: { zh: '對比', en: 'Contrast', ja: '対比', de: 'Kontrast' },
    presetFossilPipe2: { zh: '紋理清晰', en: 'Texture clarity', ja: 'テクスチャの透明度', de: 'Texturklarheit' },
    presetFossilPipe3: { zh: '眩光抑制', en: 'Glare reduction', ja: 'まぶしさの軽減', de: 'Spiegelung mindern' },
    presetFossilPipe4: { zh: '除塵（僅遮罩內）', en: 'Dust removal (mask only)', ja: '除塵（マスクのみ）', de: 'Staub entfernen (nur Maske)' },
    presetFossilPipe5: { zh: '邊緣保留', en: 'Edge preserve', ja: 'エッジの保持', de: 'Kanten erhalten' },

    presetFieldName: { zh: '野外照片救回', en: 'Field photo rescue', ja: 'フィールドフォトレスキュー', de: 'Field Foto rescue' },
    presetFieldDesc: { zh: '戶外生態紀錄：曝光、白平衡、降噪與去霧。', en: 'Outdoor ecological records: exposure, white balance, denoise, dehaze.', ja: '屋外の生態記録: 露出、ホワイトバランス、ノイズ除去、かすみ除去。', de: 'Ökologische Außenaufnahmen: Belichtung, Weißabgleich, Entrauschen, Entnebeln.'
    },
    presetFieldExport: { zh: '野外紀錄、圖庫展示', en: 'Field record, gallery display', ja: 'フィールドレコード、ギャラリー表示', de: 'Field Datensatz, gallery display' },
    presetFieldPipe1: { zh: '曝光', en: 'Exposure', ja: '暴露', de: 'Belichtung' },
    presetFieldPipe2: { zh: '白平衡', en: 'White balance', ja: 'ホワイトバランス', de: 'Weißabgleich' },
    presetFieldPipe3: { zh: '降噪', en: 'Denoise', ja: 'ノイズ除去', de: 'Entrauschen' },
    presetFieldPipe4: { zh: '去霧', en: 'Dehaze', ja: 'かすみ除去', de: 'Dunst entfernen' },
    presetFieldPipe5: { zh: '輕度動態模糊', en: 'Light motion blur', ja: '軽いモーションブラー', de: 'Hell motion blur' },
    presetFieldPipe6: { zh: '輕度超解析', en: 'Light super-resolution', ja: '軽い超解像', de: 'Hell super-resolution' },

    presetLowLightName: { zh: '弱光典藏修復', en: 'Low-light archive restore', ja: '低照度のアーカイブの復元', de: 'Archivrestaurierung bei wenig Licht' },
    presetLowLightDesc: { zh: '庫房／暗環境拍攝的典藏影像修補。', en: 'Repair collection shots from storage or dim environments.', ja: 'ストレージまたは薄暗い環境からコレクションショットを修復します。', de: 'Sammlungsaufnahmen aus Lager oder dunkler Umgebung reparieren.'
    },
    presetLowLightExport: { zh: '典藏 JPG／PNG', en: 'Archive JPG/PNG', ja: 'アーカイブ JPG/PNG', de: 'Archiv JPG/PNG' },
    presetLowLightPipe1: { zh: '弱光提亮', en: 'Low-light lift', ja: '低照度リフト', de: 'Aufhellung bei wenig Licht' },
    presetLowLightPipe2: { zh: '降噪', en: 'Denoise', ja: 'ノイズ除去', de: 'Entrauschen' },
    presetLowLightPipe3: { zh: '色彩', en: 'Color', ja: '色', de: 'Farbe' },
    presetLowLightPipe4: { zh: 'JPEG 雜訊抑制', en: 'JPEG noise suppression', ja: 'JPEGノイズ抑制', de: 'JPEG-Rauschunterdrückung' },
    presetLowLightPipe5: { zh: '輕柔銳化', en: 'Gentle sharpen', ja: '優しく研ぐ', de: 'Sanft schärfen' },

    presetSafeInpaintName: { zh: '科學安全內容填補', en: 'Scientific-safe inpaint', ja: '科学的に安全な修復', de: 'Wissenschaftlich sicheres Inpainting' },
    presetSafeInpaintDesc: {
      zh: '僅在遮罩區移除非科學干擾（如指紋、污漬），不覆寫主體。',
      en: 'Remove non-scientific artifacts in the mask only (fingerprints, stains)—never overwrite the subject.',
      ja: 'マスク内の非科学的アーチファクト (指紋、汚れ) のみを除去します。被写体を上書きしないでください。', de: 'Nur nicht-wissenschaftliche Störungen in der Maske entfernen (Fingerabdrücke, Flecken). Das Objekt nie überschreiben.'
    },
    presetSafeInpaintExport: { zh: 'PNG 並附操作紀錄', en: 'PNG with operation log', ja: '操作ログ付きPNG', de: 'PNG mit operation log' },
    presetSafeInpaintPipe1: { zh: '使用者遮罩', en: 'User mask', ja: 'ユーザーマスク', de: 'Nutzermaske' },
    presetSafeInpaintPipe2: { zh: '填補（安全模式開啟時僅背景）', en: 'Inpaint (background only when safe mode on)', ja: '修復 (セーフ モードがオンの場合のみ背景)', de: 'Inpainting (nur Hintergrund, wenn der Sicherheitsmodus an ist)' },

    presetBatchName: { zh: '批次典藏增強', en: 'Batch archive enhance', ja: 'バッチアーカイブの強化', de: 'Stapel-Archivverbesserung' },
    presetBatchDesc: {
      zh: '多檔套用同一預設，流程一致。',
      en: 'Apply one preset across many files with a consistent pipeline.',
      ja: '一貫したパイプラインを使用して、1 つのプリセットを多くのファイルに適用します。', de: 'Eine Vorlage über viele Dateien mit derselben Folge anwenden.'
    },
    presetBatchExport: { zh: 'ZIP 與 JSON 紀錄', en: 'ZIP and JSON log', ja: 'ZIP および JSON ログ', de: 'ZIP und JSON log' },
    presetBatchPipe1: { zh: '佇列', en: 'Queue', ja: '列', de: 'Warteschlange' },
    presetBatchPipe2: { zh: '同一預設', en: 'Same preset', ja: '同じプリセット', de: 'Dieselbe Vorlage' },
    presetBatchPipe3: { zh: '逐筆紀錄', en: 'Per-file log', ja: 'ファイルごとのログ', de: 'Protokoll pro Datei' },
    presetBatchPipe4: { zh: 'ZIP（後端可用時）', en: 'ZIP (when backend available)', ja: 'ZIP (バックエンドが利用可能な場合)', de: 'ZIP (wenn backend available)' }
  };
})(typeof window !== 'undefined' ? window : this);
