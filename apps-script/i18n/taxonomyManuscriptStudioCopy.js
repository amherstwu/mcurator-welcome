/**
 * Taxonomy Manuscript Studio — main headings & buttons (zh-TW / en / ja / de).
 */
(function (global) {
  'use strict';

  global.MCTaxonomyManuscriptStudioCopy = {
    dashTitle: { zh: '分類學論文撰寫輔助器', en: 'Taxonomy Manuscript Studio', ja: '分類学論文スタジオ', de: 'Taxonomie-Manuskriptstudio' },
    dashSub: { zh: '獨立的分類學／系統學寫作工作區：處理文、檢索表、特徵矩陣與匯出。非一般作文產生器；請以可驗證標本與文獻為準。', en: 'Standalone taxonomy / systematics workspace for treatments, keys, matrices, and export—not generic prose; verify specimens and citations.', ja: '処理文、検索表、形質行列、エクスポートのための独立した分類学／系統学ワークスペース。一般的な文章生成器ではありません。検証可能な標本と文献を基準にしてください。', de: 'Eigenständiger Arbeitsbereich für Taxonomie und Systematik: Bearbeitungen, Bestimmungsschlüssel, Merkmalsmatrizen und Export. Kein allgemeiner Textgenerator; prüfen Sie Präparate und Zitate.'
    },
    createProject: { zh: '建立手稿專案', en: 'Create manuscript project', ja: '原稿プロジェクトを作成', de: 'Manuskriptprojekt anlegen' },
    importSpecimenDemo: { zh: '匯入標本資料（示範）', en: 'Import specimen data (demo)', ja: '標本データをインポート（デモ）', de: 'Präparatdaten importieren (Demo)' },

    backDashboard: { zh: '← 儀表板', en: '← Dashboard', ja: '← ダッシュボード', de: '← Übersicht' },
    runValidate: { zh: '執行驗證', en: 'Run validation', ja: '検証を実行', de: 'Prüfung ausführen' },
    journalPreset: { zh: '期刊預設', en: 'Journal preset', ja: 'ジャーナルプリセット', de: 'Zeitschriftenvorlage' },
    exportDemo: { zh: '匯出（示範）', en: 'Export (demo)', ja: 'エクスポート（デモ）', de: 'Exportieren (Demo)' },
    openExport: { zh: '開啟匯出視窗', en: 'Open export dialog', ja: 'エクスポートダイアログを開く', de: 'Exportdialog öffnen' },

    required: { zh: '必填', en: 'Required', ja: '必須', de: 'Erforderlich' },
    optional: { zh: '選填', en: 'Optional', ja: '任意', de: 'Wahlweise' },

    tabManuscript: { zh: '手稿', en: 'Manuscript', ja: '原稿', de: 'Manuskript' },
    tabSpecimens: { zh: '標本', en: 'Specimens', ja: '標本の管理', de: 'Präparate' },
    tabAi: { zh: 'AI 輔助', en: 'AI assist', ja: 'AIアシスト', de: 'KI-Unterstützung' },
    tabFigures: { zh: '圖版', en: 'Figures', ja: '図版', de: 'Abbildungen' },
    tabCheck: { zh: '檢查', en: 'Checks', ja: 'チェック', de: 'Prüfungen' },
    tabExport: { zh: '匯出', en: 'Export', ja: 'エクスポート', de: 'Exportieren' },

    aiGrammar: { zh: '文法檢查（示範）', en: 'Grammar check (demo)', ja: '文法チェック（デモ）', de: 'Grammatikprüfung (Demo)' },
    aiJournalStyle: { zh: '期刊風格潤飾（示範）', en: 'Journal style polish (demo)', ja: 'ジャーナルスタイルの推敲（デモ）', de: 'Zeitschriftenstil glätten (Demo)' },
    aiTranslateEn: { zh: '筆記轉學術英文（示範）', en: 'Notes to academic English (demo)', ja: 'メモを学術英語に変換（デモ）', de: 'Notizen in akademisches Englisch (Demo)' },
    aiDiagnosis: { zh: '依矩陣草擬鑑別診斷（示範）', en: 'Draft diagnosis from matrix (demo)', ja: '行列から鑑別診断を起草（デモ）', de: 'Diagnose aus der Matrix entwerfen (Demo)' },
    aiMaterial: { zh: '草擬檢視標本（示範）', en: 'Draft material examined (demo)', ja: '検討標本を起草（デモ）', de: 'Untersuchtes Material entwerfen (Demo)' },
    aiDescription: { zh: '結構化筆記轉正式描述（示範）', en: 'Structured notes to formal description (demo)', ja: '構造化メモを正式記述に変換（デモ）', de: 'Strukturierte Notizen zur formalen Beschreibung (Demo)' },
    aiCaption: { zh: '草擬圖說（示範）', en: 'Draft figure caption (demo)', ja: '図説を起草（デモ）', de: 'Abbildungslegende entwerfen (Demo)' },
    aiConsistency: { zh: '與標本表一致性檢查（示範）', en: 'Specimen table consistency check (demo)', ja: '標本表の整合性チェック（デモ）', de: 'Abgleich mit der Präparattabelle (Demo)' },

    apiGbif: { zh: 'GBIF 學名查詢（示範）', en: 'GBIF name lookup (demo)', ja: 'GBIF学名検索（デモ）', de: 'GBIF-Namenssuche (Demo)' },
    apiBhl: { zh: 'BHL 文獻搜尋（示範）', en: 'BHL literature search (demo)', ja: 'BHL文献検索（デモ）', de: 'BHL-Literatursuche (Demo)' },

    addSpecimen: { zh: '新增標本', en: 'Add specimen', ja: '標本を追加', de: 'Präparat hinzufügen' },
    importCsvDemo: { zh: '匯入 Darwin Core CSV（示範）', en: 'Import Darwin Core CSV (demo)', ja: 'Darwin Core CSVをインポート（デモ）', de: 'Darwin-Core-CSV importieren (Demo)' },
    importMcDemo: { zh: '自 MCurator 資料庫匯入（示範）', en: 'Import from MCurator DB (demo)', ja: 'MCuratorデータベースからインポート（デモ）', de: 'Aus der MCurator-Datenbank importieren (Demo)' },
    linkPrlDemo: { zh: '連結照片修復實驗室影像（占位）', en: 'Link Photo Restoration Lab image (placeholder)', ja: '写真修復ラボの画像をリンク（プレースホルダー）', de: 'Bild aus dem Foto-Restaurierungslabor verknüpfen (Platzhalter)' },
    linkPrlToast: {
      zh: '照片修復實驗室連結為占位—不寫入其他模組。',
      en: 'Photo Restoration Lab link is a placeholder—does not write to other modules.',
      ja: '写真修復ラボのリンクはプレースホルダーです。他のモジュールには書き込みません。', de: 'Die Verknüpfung zum Foto-Restaurierungslabor ist ein Platzhalter und schreibt nicht in andere Module.'
    },
    genMaterial: { zh: '產生檢視標本文字', en: 'Generate material examined text', ja: '検討標本テキストを生成', de: 'Text zum untersuchten Material erzeugen' },
    genType: { zh: '產生模式標本文字', en: 'Generate type specimen text', ja: 'タイプ標本テキストを生成', de: 'Text zum Typuspräparat erzeugen' },

    addCharacter: { zh: '新增特徵', en: 'Add character', ja: '形質を追加', de: 'Merkmal hinzufügen' },
    exportMatrixCsv: { zh: '匯出矩陣 CSV（示範）', en: 'Export matrix CSV (demo)', ja: '行列CSVをエクスポート（デモ）', de: 'Matrix als CSV exportieren (Demo)' },
    genDiagnosisMatrix: { zh: '依獨特狀態草擬鑑別（示範）', en: 'Draft diagnosis from unique states (demo)', ja: '固有状態から鑑別を起草（デモ）', de: 'Diagnose aus eindeutigen Zuständen entwerfen (Demo)' },

    targetTaxon: { zh: '目標分類群', en: 'Target taxon', ja: '対象分類群', de: 'Zieltaxon' },
    comparisonTaxa: { zh: '比較類群', en: 'Comparison taxa', ja: '比較分類群', de: 'Vergleichstaxa' },
    uniqueCharacters: { zh: '獨特／鑑別特徵（使用者）', en: 'Unique / diagnostic characters (user)', ja: '固有／鑑別形質（ユーザー）', de: 'Eindeutige / diagnostische Merkmale (Nutzer)' },
    measurements: { zh: '量測（原文照登）', en: 'Measurements (verbatim)', ja: '計測（原文のまま）', de: 'Messungen (wörtlich)' },
    applyDiagnosisBuild: { zh: '組合鑑別草稿（示範）', en: 'Assemble diagnosis draft (demo)', ja: '鑑別草稿を組み立て（デモ）', de: 'Diagnoseentwurf zusammensetzen (Demo)' },

    mergeDescription: { zh: '筆記轉正式描述（示範）', en: 'Notes to formal description (demo)', ja: 'メモを正式記述に変換（デモ）', de: 'Notizen zur formalen Beschreibung (Demo)' },
    addCouplet: { zh: '新增二分對句', en: 'Add couplet', ja: '対句を追加', de: 'Dichotomie hinzufügen' },
    validateKey: { zh: '檢索表驗證（示範）', en: 'Validate key (demo)', ja: '検索表を検証（デモ）', de: 'Bestimmungsschlüssel prüfen (Demo)' },

    addReference: { zh: '新增文獻', en: 'Add reference', ja: '文献を追加', de: 'Literatur hinzufügen' },
    importDoiDemo: { zh: '匯入 DOI（示範）', en: 'Import DOI (demo)', ja: 'DOIをインポート（デモ）', de: 'DOI importieren (Demo)' },
    bhlSearchDemo: { zh: 'BHL 搜尋（示範）', en: 'BHL search (demo)', ja: 'BHL検索（デモ）', de: 'BHL-Suche (Demo)' },
    genDistribution: { zh: '依標本產生分佈文字（示範）', en: 'Generate distribution from specimens (demo)', ja: '標本から分布テキストを生成（デモ）', de: 'Verbreitungstext aus Präparaten erzeugen (Demo)' },
    addFigure: { zh: '新增圖版（示範）', en: 'Add figure plate (demo)', ja: '図版を追加（デモ）', de: 'Tafel hinzufügen (Demo)' },
    draftCaption: { zh: '草擬圖說（示範）', en: 'Draft caption (demo)', ja: '図説を起草（デモ）', de: 'Legende entwerfen (Demo)' },

    noExportsYet: { zh: '尚無匯出紀錄', en: 'No exports yet', ja: 'エクスポート履歴はまだありません', de: 'Noch keine Exporte' },
    citedYes: { zh: '已引用：是', en: 'Cited: yes', ja: '引用済み：はい', de: 'Zitiert: ja' },
    citedNo: { zh: '已引用：否', en: 'Cited: no', ja: '引用済み：いいえ', de: 'Zitiert: nein' },

    severityCritical: { zh: '嚴重', en: 'Critical', ja: '重大', de: 'Kritisch' },
    severityWarning: { zh: '警告', en: 'Warning', ja: '警告表示', de: 'Warnung' },
    severityInfo: { zh: '建議', en: 'Suggestion', ja: '提案', de: 'Hinweis' },

    exportMockComplete: { zh: '示範已完成', en: 'Demo complete', ja: 'デモ完了', de: 'Demo abgeschlossen' },

    journalGeneric: { zh: '一般分類學稿件', en: 'General taxonomy manuscript', ja: '一般分類学原稿', de: 'Allgemeines Taxonomie-Manuskript' },
    journalFossil: { zh: '化石分類（一般）', en: 'Fossil taxonomy (general)', ja: '一般的な化石分類学', de: 'Fossiltaxonomie (allgemein)' },
    journalInternal: { zh: 'MCurator 內部報告', en: 'MCurator internal report', ja: 'MCurator内部レポート', de: 'Interner MCurator-Bericht' }
  };
})(typeof window !== 'undefined' ? window : this);
