/**
 * Paleo Reconstruction — UI copy (zh-TW / en / ja / de).
 */
(function (global) {
  'use strict';

  global.MCPaleoReconstructionCopy = {
    pageTitle: { zh: '古生物生態復原', en: 'Paleo ecological reconstruction', ja: '古生物生態復元', de: 'Paläoökologische Rekonstruktion' },
    pageSub: {
      zh: '以化石證據與學術參考建立保守復原圖（示範模式）',
      en: 'Conservative reconstructions from fossil evidence (demo mode)',
      ja: '化石証拠と学術参考文献に基づく保守的な復元図（デモモード）', de: 'Konservative Rekonstruktionen aus Fossilbelegen (Demomodus)'
    },
    close: { zh: '關閉', en: 'Close', ja: '閉じる', de: 'Schließen' },
    newProject: { zh: '新專案', en: 'New project', ja: '新規プロジェクト', de: 'Neues Projekt' },
    loadDemo: { zh: '載入示範專案', en: 'Load demo project', ja: 'デモプロジェクトを読み込む', de: 'Demoprojekt laden' },
    saveProject: { zh: '儲存專案', en: 'Save project', ja: 'プロジェクトを保存', de: 'Projekt speichern' },
    generateImage: { zh: '產生復原圖', en: 'Generate reconstruction', ja: '復元図を生成', de: 'Rekonstruktion erzeugen' },
    generating: { zh: '產生中…', en: 'Generating…', ja: '生成中…', de: 'Wird erzeugt…' },

    sectionIdentity: { zh: '物種與年代', en: 'Taxon & age', ja: '分類群と年代', de: 'Taxon und Alter' },
    sectionEvidence: { zh: '化石證據', en: 'Fossil evidence', ja: '化石証拠', de: 'Fossilbelege' },
    sectionEnvironment: { zh: '古環境', en: 'Paleoenvironment', ja: '古環境復元', de: 'Paläoumwelt' },
    sectionStyle: { zh: '復原風格', en: 'Reconstruction style', ja: '復元スタイル', de: 'Rekonstruktionsstil' },
    sectionReferences: { zh: '參考資料', en: 'References', ja: '参考文献', de: 'Referenzen' },
    sectionOutput: { zh: '輸出', en: 'Output', ja: '出力', de: 'Ausgabe' },

    commonName: { zh: '俗名', en: 'Common name', ja: '一般名', de: 'Trivialname' },
    scientificName: { zh: '學名', en: 'Scientific name', ja: '学名', de: 'Wissenschaftlicher Name' },
    geologicalPeriod: { zh: '地質年代', en: 'Geological period', ja: '地質時代', de: 'Geologische Periode' },
    taxonomicGroup: { zh: '分類群', en: 'Taxonomic group', ja: '分類群名', de: 'Taxonomische Gruppe' },
    fossilMaterial: { zh: '已知化石材料', en: 'Known fossil material', ja: '既知の化石材料', de: 'Bekanntes Fossilmaterial' },
    evidenceNotes: { zh: '解剖／證據備註', en: 'Anatomical / evidence notes', ja: '解剖学／証拠メモ', de: 'Anatomie- und Belegnotizen' },

    reconstructionMode: { zh: '復原模式', en: 'Reconstruction mode', ja: '復元モード', de: 'Rekonstruktionsmodus' },
    pose: { zh: '姿勢', en: 'Pose', ja: 'ポーズ', de: 'Haltung' },
    cameraAngle: { zh: '鏡頭角度', en: 'Camera angle', ja: 'カメラアングル', de: 'Kamerawinkel' },
    aspectRatio: { zh: '長寬比', en: 'Aspect ratio', ja: 'アスペクト比', de: 'Seitenverhältnis' },

    refType: { zh: '參考類型', en: 'Reference type', ja: '参考タイプ', de: 'Referenztyp' },
    refName: { zh: '名稱', en: 'Name', ja: '名称', de: 'Name' },
    refUrl: { zh: 'URL', en: 'URL', ja: 'URL', de: 'URL' },
    addReference: { zh: '新增參考', en: 'Add reference', ja: '参考を追加', de: 'Referenz hinzufügen' },
    removeReference: { zh: '移除', en: 'Remove', ja: '削除', de: 'Entfernen' },
    setPrimary: { zh: '設為主要', en: 'Set primary', ja: '主要に設定', de: 'Als primär setzen' },

    confidenceLabel: { zh: '可信度', en: 'Confidence', ja: '信頼度', de: 'Konfidenz' },
    confidenceHigh: { zh: '高可信度復原', en: 'High-confidence reconstruction', ja: '高信頼度の復元', de: 'Rekonstruktion mit hoher Konfidenz' },
    confidenceMed: { zh: '中可信度復原', en: 'Medium-confidence reconstruction', ja: '中信頼度の復元', de: 'Rekonstruktion mit mittlerer Konfidenz' },
    confidenceLow: { zh: '低可信度復原', en: 'Low-confidence reconstruction', ja: '低信頼度の復元', de: 'Rekonstruktion mit niedriger Konfidenz' },
    confidenceSpeculative: { zh: '推測性復原', en: 'Speculative reconstruction', ja: '推測的な復元', de: 'Spekulative Rekonstruktion' },

    promptPreview: { zh: '提示詞預覽', en: 'Prompt preview', ja: 'プロンプトプレビュー', de: 'Prompt-Vorschau' },
    negativePrompt: { zh: '負向提示', en: 'Negative prompt', ja: 'ネガティブプロンプト', de: 'Negativ-Prompt' },
    copyPrompt: { zh: '複製提示詞', en: 'Copy prompt', ja: 'プロンプトをコピー', de: 'Prompt kopieren' },
    copiedPrompt: { zh: '已複製提示詞', en: 'Prompt copied', ja: 'プロンプトをコピーしました', de: 'Prompt kopiert' },

    mockBanner: { zh: '目前為示範模式：未連接付費影像 API；可改用 Pollinations 免費預覽（受第三方條款限制）。', en: 'Demo mode: no paid image API; Pollinations free preview available (third-party terms apply).', ja: 'デモモード：有料画像APIは未接続です。Pollinations の無料プレビューが利用可能です（第三者の利用規約が適用されます）。', de: 'Demomodus: keine kostenpflichtige Bild-API. Die kostenlose Pollinations-Vorschau ist verfügbar (Bedingungen Dritter gelten).'
    },
    apiDisabled: { zh: '進階 API 已停用', en: 'Advanced API disabled', ja: '高度なAPIは無効です', de: 'Erweiterte API deaktiviert' },

    errNeedName: { zh: '請至少填寫俗名或學名。', en: 'Enter a common or scientific name.', ja: '一般名または学名を少なくとも1つ入力してください。', de: 'Geben Sie einen Trivialnamen oder wissenschaftlichen Namen ein.' },
    errNeedEnv: { zh: '請選擇古環境預設。', en: 'Select a paleoenvironment preset.', ja: '古環境プリセットを選択してください。', de: 'Wählen Sie eine Paläoumwelt-Vorlage.' },
    errGenerateFailed: { zh: '產生影像失敗，請稍後再試。', en: 'Image generation failed. Try again later.', ja: '画像の生成に失敗しました。しばらくしてから再試行してください。', de: 'Bilderzeugung fehlgeschlagen. Versuchen Sie es später erneut.' },
    toastSaved: { zh: '專案已儲存', en: 'Project saved', ja: 'プロジェクトを保存しました', de: 'Projekt gespeichert' },
    toastLoaded: { zh: '已載入示範專案', en: 'Demo project loaded', ja: 'デモプロジェクトを読み込みました', de: 'Demoprojekt geladen' },
    toastNew: { zh: '已建立新專案', en: 'New project created', ja: '新規プロジェクトを作成しました', de: 'Neues Projekt erstellt' },

    refTypeFossil: { zh: '化石證據', en: 'Fossil evidence', ja: '化石証拠', de: 'Fossilbelege' },
    refTypeSkeleton: { zh: '骨骼參考', en: 'Skeletal reference', ja: '骨格参考', de: 'Skelettreferenz' },
    refTypePaper: { zh: '論文資料', en: 'Publication', ja: '論文', de: 'Publikation' },
    refTypeDrawing: { zh: '手繪參考', en: 'Illustration', ja: 'イラスト参考', de: 'Abbildung' },
    refTypeMuseum: { zh: '博物館標本照', en: 'Museum specimen photo', ja: '博物館標本写真', de: 'Museumpräparat-Foto' },
    refTypeEnvironment: { zh: '環境參考', en: 'Environment reference', ja: '環境参考', de: 'Umweltreferenz' },
    refTypePose: { zh: '姿勢參考', en: 'Pose reference', ja: 'ポーズ参考', de: 'Haltungsreferenz' },
    refTypeOther: { zh: '其他', en: 'Other', ja: 'その他', de: 'Sonstiges' },

    modeConservative: { zh: '保守學術復原', en: 'Conservative academic', ja: '保守的な学術復元', de: 'Konservativ akademisch' },
    modeDocumentary: { zh: '自然紀錄片風格', en: 'Natural history documentary', ja: '自然史ドキュメンタリー風', de: 'Naturkundliche Dokumentation' },
    modeMuseum: { zh: '博物館展示風格', en: 'Museum display', ja: '博物館展示風', de: 'Museumspräsentation' },
    modeFossilToLife: { zh: '化石轉生命復原', en: 'Fossil-to-life', ja: '化石から生命への復元', de: 'Vom Fossil zum Lebewesen' },
    modeCardIllustration: { zh: '卡片插畫風格', en: 'Card illustration', ja: 'カードイラスト風', de: 'Kartenillustration' },
    modeQuest: { zh: 'Quest 場景風格', en: 'Quest scene style', ja: 'クエストシーン風', de: 'Quest-Szenenstil' },

    poseNatural: { zh: '自然姿勢', en: 'Natural pose', ja: '自然なポーズ', de: 'Natürliche Haltung' },
    poseWalk: { zh: '行走', en: 'Walking', ja: '歩行', de: 'Gehend' },
    poseSwim: { zh: '游泳', en: 'Swimming', ja: '遊泳', de: 'Schwimmend' },
    poseFeed: { zh: '覓食', en: 'Feeding', ja: '採餌', de: 'Bei der Nahrungsaufnahme' },
    poseRest: { zh: '休息', en: 'Resting', ja: '休息中', de: 'Ruhend' },
    poseGroup: { zh: '群體活動', en: 'Group activity', ja: '群れの行動', de: 'Gruppenaktivität' },
    poseDisplay: { zh: '中性展示姿勢', en: 'Neutral display pose', ja: '中立的な展示ポーズ', de: 'Neutrale Präsentationshaltung' },
    poseCustom: { zh: '自訂', en: 'Custom', ja: 'カスタム', de: 'Benutzerdefiniert' },

    cameraSide: { zh: '側面', en: 'Side view', ja: '側面図', de: 'Seitenansicht' },
    cameraThreeQuarter: { zh: '3/4 視角', en: 'Three-quarter view', ja: '3/4ビュー', de: 'Dreiviertelansicht' },
    cameraLow: { zh: '低角度', en: 'Low angle', ja: 'ローアングル', de: 'Untersicht' },
    cameraEye: { zh: '眼平視角', en: 'Eye level', ja: '目線の高さ', de: 'Augenhöhe' },
    cameraMacro: { zh: '近距離特寫', en: 'Close-up', ja: 'クローズアップ', de: 'Nahaufnahme' },
    cameraUnderwater: { zh: '水下視角', en: 'Underwater view', ja: '水中視点', de: 'Unterwasseransicht' }
  };
})(typeof window !== 'undefined' ? window : this);
