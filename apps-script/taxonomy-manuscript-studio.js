/**
 * MCurator Taxonomy Manuscript Studio — independent scientific taxonomy manuscript assistant.
 * Mock data, mock AI, mock external API adapters only.
 * Does not integrate with Passport Studio, SAT Marketplace, Quest, museum collections UI, or Photo Restoration Lab internals.
 */
(function (global) {
  'use strict';

  var _tmsC = (typeof window !== 'undefined' && window.MCTaxonomyManuscriptStudioCopy) || {};
  function tmsT(k, fb) {
    if (typeof global.mcModuleT === 'function') return global.mcModuleT(_tmsC, k, fb);
    var p = _tmsC[k];
    if (p && typeof mcPick === 'function') return mcPick(p) || (fb != null ? fb : k);
    return fb != null ? fb : k;
  }

  var STORAGE_PROJECTS = 'mcurator_taxonomy_manuscript_projects_v1';
  var STORAGE_ACTIVE = 'mcurator_taxonomy_manuscript_active_v1';
  var ROOT_ID = 'mcTaxonomyManuscriptStudioRoot';
  var SHELL_ID = 'mcTaxonomyManuscriptShell';

  function uid(p) {
    return (p || 'tms') + '_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
  }
  function nowIso() {
    return new Date().toISOString();
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escAttr(s) {
    return esc(s).replace(/'/g, '&#39;');
  }

  function tmsManuscriptTypeZh(slug) {
    var m = {
      new_species: '新種描述',
      revision: '分類修訂',
      redescription: '再描述',
      fossil_taxonomy: '化石分類論文',
      faunistic_note: '動物相／名錄短文',
      checklist: '名錄式論文',
      identification_key: '檢索表',
      character_matrix: '形態特徵矩陣',
      import_draft: '匯入既有草稿',
    };
    return m[slug] || String(slug || '').replace(/_/g, ' ');
  }
  function tmsVerificationZh(v) {
    var m = {
      ai_draft: 'AI 草稿',
      needs_expert_review: '待專家審核',
      user_verified: '使用者已核',
      citation_needed: '待補文獻',
      unverified_suggestion: '未核建議',
    };
    return m[v] || String(v || '').replace(/_/g, ' ');
  }
  function tmsTypeStatusLabelZh(ts) {
    var m = {
      holotype: '正模',
      paratype: '副模',
      syntype: '共模',
      lectotype: '選模',
      neotype: '新模',
      non_type: '非模式',
      unknown: '未知',
    };
    return m[ts] || ts;
  }
  function tmsSeverityZh(s) {
    if (s === 'critical') return tmsT('severityCritical');
    if (s === 'warning') return tmsT('severityWarning');
    return tmsT('severityInfo');
  }
  function tmsExportStatusZh(st) {
    if (st === 'mock_complete') return tmsT('exportMockComplete');
    return String(st || '');
  }
  /** 依章節 key 顯示繁體標題（舊專案若存英文 title 仍顯示中文） */
  function tmsSectionLabelZh(sec) {
    if (!sec) return '';
    var m = {
      title: '題名',
      abstract: '摘要',
      keywords: '關鍵字',
      introduction: '緒論',
      methods: '材料與方法',
      treatment: '分類處理',
      discussion: '討論',
      acknowledgements: '致謝',
      references: '參考文獻',
    };
    if (sec.key && m[sec.key]) return m[sec.key];
    return sec.title || '';
  }

  function icon(name) {
    var o = {
      book: '<svg class="mc-tms-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      file: '<svg class="mc-tms-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
      check: '<svg class="mc-tms-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
      alert: '<svg class="mc-tms-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
      spark: '<svg class="mc-tms-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3-1.9 5.8-6.1-.1 4.9 3.6-1.9 5.8 4.9-3.6 4.9 3.6-1.9-5.8 4.9-3.6-6.1.1z"/></svg>',
      map: '<svg class="mc-tms-ico" viewBox="0 0 24 24" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>',
    };
    return o[name] || o.file;
  }

  var DASH_CARDS = [
    {
      id: 'new_species',
      title: '新種描述',
      purpose: '以正模為核心的種級處理：鑑別特徵、描述與模式標本資料。',
      required: '模式標定意圖、產地與影像、量測表（由使用者填寫）。',
      output: '結構化論文章節＋命名法檢核清單。',
      diff: '進階',
    },
    {
      id: 'revision',
      title: '分類修訂',
      purpose: '多物種比較、異名表、檢索表草稿。',
      required: '分類群清單、特徵矩陣、參考文獻 PDF 或 DOI（手動）。',
      output: '各物種處理文、比較表、檢索表匯出區塊。',
      diff: '進階',
    },
    {
      id: 'redescription',
      title: '再描述',
      purpose: '保留原始命名者；補充新檢視標本與比較註記。',
      required: '原始文獻引用、新標本列、比較類群。',
      output: '再描述骨架＋不確定性標記。',
      diff: '中階',
    },
    {
      id: 'fossil_taxonomy',
      title: '化石分類論文',
      purpose: '地層、館藏、圖版與比較形態。',
      required: '地質年代、地層單元、館藏代碼、岩板影像。',
      output: '化石檢核清單＋圖版說明草稿。',
      diff: '進階',
    },
    {
      id: 'faunistic_note',
      title: '動物相／名錄短文',
      purpose: '檢視標本、產地名錄、分佈摘要（僅限已核對列）。',
      required: '出現紀錄表、野外影像、憑證編號。',
      output: '名錄段落＋地圖占位標籤。',
      diff: '入門',
    },
    {
      id: 'checklist',
      title: '名錄式論文',
      purpose: '區域或棲地之名錄，名稱須有標本支撐。',
      required: '鑑定依據、館藏縮寫詞彙表。',
      output: '以表格為主的稿件區塊。',
      diff: '中階',
    },
    {
      id: 'identification_key',
      title: '檢索表',
      purpose: '二分法檢索對，並檢查缺漏分支。',
      required: '各分類群之特徵狀態（使用者輸入）。',
      output: '稿件檢索表區塊＋匯出預覽。',
      diff: '中階',
    },
    {
      id: 'character_matrix',
      title: '形態特徵矩陣',
      purpose: '分類群 × 特徵，附證據影像與信心度。',
      required: '特徵定義、狀態編碼。',
      output: 'CSV＋依獨特組合產生之鑑別草稿（示範）。',
      diff: '中階',
    },
    {
      id: 'import_draft',
      title: '匯入既有草稿',
      purpose: '將標題解析為結構區塊（示範：包成純文字區塊）。',
      required: '貼上 Markdown 或純文字。',
      output: '專案 JSON＋章節對照。',
      diff: '入門',
    },
  ];

  var JOURNAL_PRESETS = [
    { id: 'generic', label: '一般分類學稿件' },
    { id: 'zookeys', label: 'ZooKeys 風格（參考）' },
    { id: 'phytokeys', label: 'PhytoKeys 風格（參考）' },
    { id: 'zootaxa', label: 'Zootaxa 風格（參考）' },
    { id: 'phytotaxa', label: 'Phytotaxa 風格（參考）' },
    { id: 'fossil', label: '化石分類（一般）' },
    { id: 'internal', label: 'MCurator 內部報告' },
  ];

  function defaultManuscriptSections() {
    var req = true;
    var opt = false;
    return [
      { id: uid('sec'), key: 'title', title: '題名', content: '', required: req, verificationStatus: 'ai_draft', sources: [] },
      { id: uid('sec'), key: 'abstract', title: '摘要', content: '', required: req, verificationStatus: 'needs_expert_review', sources: [] },
      { id: uid('sec'), key: 'keywords', title: '關鍵字', content: '', required: req, verificationStatus: 'ai_draft', sources: [] },
      { id: uid('sec'), key: 'introduction', title: '緒論', content: '', required: req, verificationStatus: 'ai_draft', sources: [] },
      { id: uid('sec'), key: 'methods', title: '材料與方法', content: '', required: req, verificationStatus: 'ai_draft', sources: [] },
      { id: uid('sec'), key: 'treatment', title: '分類處理', content: '', required: req, verificationStatus: 'needs_expert_review', sources: [] },
      { id: uid('sec'), key: 'discussion', title: '討論', content: '', required: opt, verificationStatus: 'ai_draft', sources: [] },
      { id: uid('sec'), key: 'acknowledgements', title: '致謝', content: '', required: opt, verificationStatus: 'user_verified', sources: [] },
      { id: uid('sec'), key: 'references', title: '參考文獻', content: '', required: req, verificationStatus: 'citation_needed', sources: [] },
    ];
  }

  function defaultTreatmentSections() {
    return [
      { id: uid('tx'), key: 'classification', title: '分類位置', content: '' },
      { id: uid('tx'), key: 'name', title: '分類群學名', content: '' },
      { id: uid('tx'), key: 'synonymy', title: '異名', content: '' },
      { id: uid('tx'), key: 'type_material', title: '模式標本', content: '' },
      { id: uid('tx'), key: 'material_examined', title: '檢視標本', content: '' },
      { id: uid('tx'), key: 'diagnosis', title: '鑑別診斷', content: '' },
      { id: uid('tx'), key: 'description', title: '描述', content: '' },
      { id: uid('tx'), key: 'measurements', title: '量測', content: '' },
      { id: uid('tx'), key: 'etymology', title: '語源', content: '' },
      { id: uid('tx'), key: 'distribution', title: '分佈', content: '' },
      { id: uid('tx'), key: 'ecology', title: '生態／棲地', content: '' },
      { id: uid('tx'), key: 'remarks', title: '備註', content: '' },
      { id: uid('tx'), key: 'comparison', title: '比較註記', content: '' },
      { id: uid('tx'), key: 'figures', title: '圖版', content: '' },
    ];
  }

  function emptyTaxon() {
    return {
      id: uid('tax'),
      scientificName: '',
      rank: 'species',
      authorship: '',
      status: 'existing_taxon',
      higherClassification: '',
      diagnosis: '',
      description: '',
      etymology: '',
      typeMaterial: '',
      materialExamined: '',
      distribution: '',
      ecology: '',
      remarks: '',
      comparison: '',
      figures: [],
      references: [],
      verificationStatus: 'needs_expert_review',
      treatmentSections: defaultTreatmentSections(),
    };
  }

  function emptySpecimen() {
    return {
      id: uid('sp'),
      catalogNumber: '',
      institutionCode: '',
      collectionCode: '',
      typeStatus: 'non_type',
      taxonName: '',
      collector: '',
      collectionDate: '',
      country: '',
      locality: '',
      coordinates: '',
      elevation: '',
      sex: '',
      lifeStage: '',
      preparation: '',
      measurements: '',
      associatedMedia: [],
      remarks: '',
      source: 'user',
      verificationStatus: 'needs_expert_review',
    };
  }

  function emptyCharacter() {
    return {
      id: uid('ch'),
      characterName: '',
      anatomicalRegion: '',
      characterState: '',
      measurementValue: '',
      unit: '',
      evidenceImage: '',
      notes: '',
      confidence: 'medium',
    };
  }

  function emptyReference() {
    return {
      id: uid('ref'),
      authors: '',
      year: '',
      title: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      url: '',
      source: 'manual',
      verificationStatus: 'unverified_suggestion',
    };
  }

  function createProject(manuscriptType) {
    return {
      id: uid('proj'),
      title: '未命名分類學手稿',
      manuscriptType: manuscriptType || 'new_species',
      targetJournal: '',
      taxonGroup: '',
      nomenclatureCode: 'ICZN',
      language: 'zh-Hant',
      status: 'draft',
      journalPreset: 'generic',
      taxa: [emptyTaxon()],
      specimens: [],
      characterMatrix: { taxonIds: [], characters: [], cells: {} },
      manuscriptSections: defaultManuscriptSections(),
      figures: [],
      references: [],
      validationIssues: [],
      exports: [],
      diagnosisBuilder: {
        targetTaxon: '',
        comparisonTaxa: '',
        uniqueCharacters: '',
        measurements: '',
        notes: '',
      },
      descriptionBuilder: {
        habitus: '',
        head: '',
        thorax: '',
        abdomen: '',
        wings: '',
        coloration: '',
        sculpture: '',
        genitalia: '',
        measurements: '',
        variation: '',
        fossilPreservation: '',
      },
      identificationKey: { couplets: [{ id: uid('coup'), a: '', b: '' }] },
      nomenclatureNotes: '',
      expertAcknowledgedCritical: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
  }

  function loadProjects() {
    try {
      var raw = localStorage.getItem(STORAGE_PROJECTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }
  function saveProjects(list) {
    try {
      localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(list));
    } catch (e) {}
  }
  function loadActiveId() {
    try {
      return localStorage.getItem(STORAGE_ACTIVE) || '';
    } catch (e) {
      return '';
    }
  }
  function saveActiveId(id) {
    try {
      localStorage.setItem(STORAGE_ACTIVE, id || '');
    } catch (e) {}
  }

  function validateProject(p) {
    var issues = [];
    if (!p) return issues;
    var hasHolotype = p.specimens.some(function (s) {
      return s.typeStatus === 'holotype';
    });
    if (p.manuscriptType === 'new_species' && !hasHolotype) {
      issues.push({
        id: uid('iss'),
        severity: 'critical',
        section: '模式標本',
        message: '新種類型專案中，標本表尚未指定正模。',
        recommendedFix: '請將一列標本設為正模，並填寫館方代碼與館號。',
        source: 'rule:new_species_holotype',
      });
    }
    var repoMissing = p.specimens.some(function (s) {
      return s.typeStatus === 'holotype' && (!s.institutionCode || !s.catalogNumber);
    });
    if (repoMissing) {
      issues.push({
        id: uid('iss'),
        severity: 'warning',
        section: '模式標本',
        message: '正模列缺少館方代碼或館號。',
        recommendedFix: '送出前請補齊館藏與館號欄位。',
        source: 'rule:repository',
      });
    }
    p.manuscriptSections.forEach(function (sec) {
      if (sec.required && !String(sec.content || '').trim()) {
        issues.push({
          id: uid('iss'),
          severity: sec.key === 'title' || sec.key === 'abstract' ? 'critical' : 'warning',
          section: tmsSectionLabelZh(sec),
          message: '必填章節尚為空白。',
          recommendedFix: '請於本機撰寫草稿，或僅連結您已核可之文獻與資料後再使用輔助功能。',
          source: 'rule:required_section',
        });
      }
    });
    if (!String(p.diagnosisBuilder.comparisonTaxa || '').trim()) {
      issues.push({
        id: uid('iss'),
        severity: 'suggestion',
        section: '鑑別診斷建置',
        message: '尚未記錄比較類群，鑑別診斷缺乏可比對基礎。',
        recommendedFix: '請自可信文獻或標本補上比較類群。',
        source: 'rule:diagnosis_compare',
      });
    }
    return issues;
  }

  function MockGBIFProvider() {}
  MockGBIFProvider.prototype.searchName = function (name) {
    return Promise.resolve({
      ok: true,
      mock: true,
      results: [{ usageKey: 'mock', scientificName: name || '【待補學名】', rank: 'SPECIES' }],
    });
  };
  MockGBIFProvider.prototype.getClassification = function () {
    return Promise.resolve({ ok: true, mock: true, path: ['生命', '動物界', '【分類階層—請核實】'] });
  };
  MockGBIFProvider.prototype.getSynonyms = function () {
    return Promise.resolve({ ok: true, mock: true, synonyms: [] });
  };
  MockGBIFProvider.prototype.getOccurrenceSummary = function () {
    return Promise.resolve({ ok: true, mock: true, note: '實際環境會在此顯示 GBIF 出現紀錄摘要（須標註來源與授權）。' });
  };

  function MockBHLProvider() {}
  MockBHLProvider.prototype.searchReference = function (q) {
    return Promise.resolve({ ok: true, mock: true, hits: [{ title: '【BHL 示範】' + (q || '查詢'), year: '—' }] });
  };
  MockBHLProvider.prototype.getReferenceMetadata = function () {
    return Promise.resolve({ ok: true, mock: true });
  };
  MockBHLProvider.prototype.getHistoricalDescriptions = function () {
    return Promise.resolve({ ok: true, mock: true, text: '【歷史描述摘錄—請對照原圖版核實】' });
  };

  function MockCrossrefProvider() {}
  MockCrossrefProvider.prototype.lookupDoi = function (doi) {
    return Promise.resolve({ ok: true, mock: true, doi: doi || '【待補 DOI】', message: 'Crossref 中繼資料為占位；正式版請手動貼上 DOI。' });
  };

  function MockNomenclatureProvider() {}
  MockNomenclatureProvider.prototype.checkNameFormat = function (name, code) {
    return Promise.resolve({
      ok: true,
      mock: true,
      verdict: '可能完整',
      code: code || 'ICZN',
      detail: name ? '僅格式啟發式檢查，仍須命名法專家審核。' : '缺少學名字串。',
    });
  };
  MockNomenclatureProvider.prototype.checkRequiredFields = function (project) {
    return Promise.resolve({ ok: true, mock: true, flags: validateProject(project).map(function (i) { return i.message; }) });
  };

  function MockLocalMCuratorProvider() {}
  MockLocalMCuratorProvider.prototype.importSpecimens = function () {
    return Promise.resolve({
      ok: true,
      mock: true,
      rows: [],
      note: '本獨立建置尚未串接 MCurator 標本資料庫即時匯入。',
    });
  };

  var adapters = {
    gbif: new MockGBIFProvider(),
    bhl: new MockBHLProvider(),
    crossref: new MockCrossrefProvider(),
    nomenclature: new MockNomenclatureProvider(),
    localMCurator: new MockLocalMCuratorProvider(),
  };

  var state = {
    projects: [],
    activeProjectId: '',
    activeSectionId: '',
    drawerTab: 'specimens',
    nomenclatureTab: 'iczn',
    mobileTab: 'manuscript',
    aiLog: [],
    exportModal: false,
    toast: '',
  };

  function getActiveProject() {
    return state.projects.find(function (p) {
      return p.id === state.activeProjectId;
    });
  }

  function toastMsg(msg) {
    state.toast = String(msg || '');
    render();
    setTimeout(function () {
      state.toast = '';
      render();
    }, 2600);
  }

  function persist() {
    saveProjects(state.projects);
    saveActiveId(state.activeProjectId);
  }

  function mockAiOutput(kind, project) {
    var safe =
      '\n\n【AI 草稿 · 示範】僅潤飾用字，不新增事實。\n' +
      '【待專家核可】若來源不完整。\n' +
      '【待補引用】若敘述無文獻支撐。\n' +
      '依缺欄位出現：【待補量測】【待補產地】【待補館藏】等占位。\n';
    if (kind === 'grammar') return '文法檢查（示範）：已對使用者文字做時態一致性粗查。' + safe;
    if (kind === 'diagnosis')
      return (
        '鑑別診斷草稿（示範），依矩陣與比較類群：\n' +
        '物種差異以矩陣列之【待核可】特徵狀態描述。' +
        safe
      );
    if (kind === 'material_examined') {
      var n = project.specimens.length;
      return (
        '檢視標本（示範）：\n' +
        (n
          ? '已列舉 ' + n + ' 筆標本，請核對館號與館方代碼與憑證。'
          : '【待補館藏】尚未連結標本列，匯出前請先新增。') +
        safe
      );
    }
    if (kind === 'description_formal')
      return '正式描述（示範）：使用者量測原文保留；質性性狀標【待專家核可】。' + safe;
    if (kind === 'caption') return '圖說（示範）：全形／比例尺【待補量測】依您填之中繼資料。' + safe;
    return '論文輔助（示範）：僅提供結構化建議。' + safe;
  }

  function renderIntegrityBanner() {
    return (
      '<div class="mc-tms-integrity" role="note">' +
      icon('alert') +
      '<div><strong>學術誠信</strong>：AI 僅協助撰稿、組織與排版。所有分類決定、命名行為、鑑別診斷與標本資料仍須由專家審核。' +
      '本工具不取代 ICZN／ICN／ICNP 等合規審查。</div></div>'
    );
  }

  function renderDashboard(root) {
    var cards = DASH_CARDS.map(function (c) {
      return (
        '<article class="mc-tms-card" data-tms-card="' +
        escAttr(c.id) +
        '">' +
        '<span class="mc-tms-card__tag">論文輔助</span>' +
        '<h3 class="mc-tms-card__h">' +
        esc(c.title) +
        '</h3>' +
        '<p class="mc-tms-card__p"><strong>用途：</strong> ' +
        esc(c.purpose) +
        '</p>' +
        '<p class="mc-tms-card__p"><strong>必要資料：</strong> ' +
        esc(c.required) +
        '</p>' +
        '<p class="mc-tms-card__p"><strong>產出：</strong> ' +
        esc(c.output) +
        '</p>' +
        '<span class="mc-tms-diff">' +
        esc(c.diff) +
        '</span>' +
        '</article>'
      );
    }).join('');
    root.innerHTML =
      '<div class="mc-tms-root mc-tms-root--dashboard">' +
      '<div class="mc-tms-dash">' +
      renderIntegrityBanner() +
      '<h1 class="mc-tms-dash__h">' + esc(tmsT('dashTitle')) + '</h1>' +
      '<p class="mc-tms-dash__sub">' + esc(tmsT('dashSub')) + '</p>' +
      '<div class="mc-tms-dash__actions">' +
      '<button type="button" class="mc-tms-btn mc-tms-btn--primary" data-tms-action="create-blank">' +
      icon('file') +
      ' ' + esc(tmsT('createProject')) + '</button>' +
      '<button type="button" class="mc-tms-btn" data-tms-action="import-specimen-mock">' +
      icon('book') +
      ' ' + esc(tmsT('importSpecimenDemo')) + '</button>' +
      '</div>' +
      '<div class="mc-tms-cardgrid">' +
      cards +
      '</div>' +
      (state.toast ? '<p class="mc-tms-muted" style="margin-top:12px">' + esc(state.toast) + '</p>' : '') +
      '</div></div>';
  }

  function renderEditorDesktop(p) {
    var secNav = p.manuscriptSections
      .map(function (s) {
        return (
          '<button type="button" class="mc-tms-navbtn' +
          (state.activeSectionId === s.id ? ' is-active' : '') +
          '" data-tms-section="' +
          escAttr(s.id) +
          '">' +
          esc(tmsSectionLabelZh(s)) +
          '</button>'
        );
      })
      .join('');
    var active = p.manuscriptSections.find(function (s) {
      return s.id === state.activeSectionId;
    });
    if (!active) active = p.manuscriptSections[0];
    state.activeSectionId = active.id;
    var badge =
      '<span class="mc-tms-badge mc-tms-badge--' +
      (active.required ? 'req' : 'opt') +
      '">' +
      (active.required ? esc(tmsT('required')) : esc(tmsT('optional'))) +
      '</span>' +
      ' <span class="mc-tms-badge mc-tms-badge--ai">' +
      esc(tmsVerificationZh(active.verificationStatus)) +
      '</span>';
    var editor =
      '<div class="mc-tms-block">' +
      '<div class="mc-tms-block__row"><h2 class="mc-tms-block__title">' +
      esc(tmsSectionLabelZh(active)) +
      '</h2>' +
      badge +
      '</div>' +
      '<textarea class="mc-tms-textarea" data-tms-field="section-content" data-section-id="' +
      escAttr(active.id) +
      '">' +
      esc(active.content) +
      '</textarea>' +
      '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px">' +
      '<button type="button" class="mc-tms-btn" data-tms-ai="grammar">文法檢查（示範）</button>' +
      '<button type="button" class="mc-tms-btn" data-tms-ai="journal_style">期刊風格潤飾（示範）</button>' +
      '<button type="button" class="mc-tms-btn" data-tms-ai="translate_en">筆記轉學術英文（示範）</button>' +
      '</div></div>';

    var valIssues = validateProject(p);
    var issuesHtml = valIssues
      .map(function (i) {
        var cls = i.severity === 'critical' ? 'critical' : i.severity === 'warning' ? 'warning' : '';
        return (
          '<div class="mc-tms-issue' +
          (cls ? ' mc-tms-issue--' + cls : '') +
          '"><strong>' +
          esc(tmsSeverityZh(i.severity)) +
          '</strong> · ' +
          esc(i.section) +
          '<br/>' +
          esc(i.message) +
          '<div class="mc-tms-muted">' +
          esc(i.recommendedFix) +
          '</div></div>'
        );
      })
      .join('');

    var nomTabs = ['iczn', 'icn', 'fossil', 'journal', 'expert'].map(function (t) {
      return (
        '<button type="button" class="mc-tms-tab' +
        (state.nomenclatureTab === t ? ' is-active' : '') +
        '" data-tms-nomtab="' +
        t +
        '">' +
        (t === 'iczn'
          ? 'ICZN'
          : t === 'icn'
            ? 'ICN'
            : t === 'fossil'
              ? '化石'
              : t === 'journal'
                ? '期刊'
                : '專家') +
        '</button>'
      );
    }).join('');
    var nomBody = renderNomenclatureChecklist(state.nomenclatureTab, p);

    var drawerTabs = ['specimens', 'matrix', 'diagnosis', 'description', 'key', 'figures', 'references', 'distribution', 'export'].map(function (t) {
      var labels = {
        specimens: '標本',
        matrix: '矩陣',
        diagnosis: '鑑別',
        description: '描述',
        key: '檢索表',
        figures: '圖版',
        references: '文獻',
        distribution: '分佈',
        export: '匯出',
      };
      return (
        '<button type="button" class="mc-tms-tab' +
        (state.drawerTab === t ? ' is-active' : '') +
        '" data-tms-drawer="' +
        t +
        '">' +
        labels[t] +
        '</button>'
      );
    }).join('');
    var drawerBody = renderDrawerBody(p);

    return (
      '<div class="mc-tms-editor">' +
      '<aside class="mc-tms-side"><p class="mc-tms-side__h">手稿結構</p>' +
      secNav +
      '<p class="mc-tms-side__h" style="margin-top:14px">專案</p>' +
      '<button type="button" class="mc-tms-navbtn" data-tms-action="back-dash">' + esc(tmsT('backDashboard')) + '</button>' +
      '<button type="button" class="mc-tms-navbtn" data-tms-action="run-validate">' +
      icon('check') +
      ' ' + esc(tmsT('runValidate')) + '</button>' +
      '</aside>' +
      '<main class="mc-tms-main"><div class="mc-tms-main__head">' +
      '<div><strong>' +
      esc(p.title) +
      '</strong> <span class="mc-tms-muted">· ' +
      esc(tmsManuscriptTypeZh(p.manuscriptType)) +
      ' · ' +
      esc(p.nomenclatureCode) +
      '</span></div>' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
      '<label class="mc-tms-muted" style="font-size:12px">' + esc(tmsT('journalPreset')) + '</label>' +
      '<select class="mc-tms-select" style="max-width:220px" data-tms-field="journal-preset">' +
      JOURNAL_PRESETS.map(function (j) {
        return (
          '<option value="' +
          escAttr(j.id) +
          '"' +
          (p.journalPreset === j.id ? ' selected' : '') +
          '>' +
          esc(j.label) +
          '</option>'
        );
      }).join('') +
      '</select>' +
      '<button type="button" class="mc-tms-btn mc-tms-btn--primary" data-tms-action="open-export">' + esc(tmsT('exportDemo')) + '</button>' +
      '</div></div>' +
      '<div class="mc-tms-main__body">' +
      renderIntegrityBanner() +
      editor +
      '</div></main>' +
      '<div class="mc-tms-right">' +
      '<div class="mc-tms-panel mc-tms-panel--grow">' +
      '<p class="mc-tms-panel__h">' +
      icon('spark') +
      ' 論文輔助（示範）</p>' +
      '<div class="mc-tms-ai-actions">' +
      '<button type="button" class="mc-tms-btn" data-tms-ai="diagnosis">依矩陣草擬鑑別診斷（示範）</button>' +
      '<button type="button" class="mc-tms-btn" data-tms-ai="material_examined">草擬檢視標本（示範）</button>' +
      '<button type="button" class="mc-tms-btn" data-tms-ai="description_formal">結構化筆記轉正式描述（示範）</button>' +
      '<button type="button" class="mc-tms-btn" data-tms-ai="caption">草擬圖說（示範）</button>' +
      '<button type="button" class="mc-tms-btn" data-tms-ai="consistency">與標本表一致性檢查（示範）</button>' +
      '</div>' +
      '<p class="mc-tms-panel__h" style="margin-top:12px">外部介面占位</p>' +
      '<button type="button" class="mc-tms-btn" data-tms-api="gbif">GBIF 學名查詢（示範）</button> ' +
      '<button type="button" class="mc-tms-btn" data-tms-api="bhl">BHL 文獻搜尋（示範）</button>' +
      '</div>' +
      '<div class="mc-tms-panel">' +
      '<p class="mc-tms-panel__h">' +
      icon('check') +
      ' 驗證</p>' +
      issuesHtml +
      '</div>' +
      '<div class="mc-tms-panel">' +
      '<p class="mc-tms-panel__h">命名法與發表檢核</p>' +
      '<div class="mc-tms-drawer__tabs">' +
      nomTabs +
      '</div>' +
      '<div style="padding:10px 0">' +
      nomBody +
      '</div></div>' +
      '</div>' +
      '<div class="mc-tms-drawer">' +
      '<div class="mc-tms-drawer__tabs">' +
      drawerTabs +
      '</div>' +
      '<div class="mc-tms-drawer__body">' +
      drawerBody +
      '</div></div>' +
      '</div>'
    );
  }

  function renderNomenclatureChecklist(tab, p) {
    var items = [];
    if (tab === 'iczn') {
      items = [
        '新／既有分類群學名是否明確寫出？',
        '所有新名之階級是否標示？',
        '是否具模式標本章節？',
        '正模之館方代碼與館號是否齊備（若適用）？',
        '鑑別診斷或描述是否已備且經專家審閱？',
        '若期刊要求，是否含語源說明？',
        '圖版引用是否與圖版規劃一致？',
        '座標／產地是否僅來自標本列資料格式化？',
      ];
    } else if (tab === 'icn') {
      items = [
        '模式標本／模式指定途徑是否記錄？',
        '標本館／館藏代碼是否提供？',
        '基名與命名者欄位是否依需要填寫？',
        '若有拉丁文診斷規定，是否已標示待專家處理？',
      ];
    } else if (tab === 'fossil') {
      items = ['地層背景是否記錄？', '保存狀態是否描述？', '主模式標本之館藏是否標示？'];
    } else if (tab === 'journal') {
      items = ['目標期刊中繼資料檢核（示範）：請對齊文獻與圖版順序。'];
    } else {
      items = [
        '是否已安排獨立專家審查？',
        '命名行為是否標示須專家簽核？',
        '標示 AI 之段落是否已逐行覆核？',
      ];
    }
    return (
      '<div class="mc-tms-checklist">' +
      items
        .map(function (it, idx) {
          return (
            '<label><input type="checkbox" data-tms-nomcheck="' +
            escAttr(tab + ':' + idx) +
            '"/> ' +
            esc(it) +
            '</label>'
          );
        })
        .join('') +
      '<p class="mc-tms-muted" style="margin-top:8px">狀態標籤含：可能完整／待專家審核／缺必填資訊／須命名法專家審閱。非正式法律效力說明。</p>' +
      '</div>'
    );
  }

  function specimenTableRows(p) {
    if (!p.specimens.length) {
      return (
        '<tr><td colspan="6" class="mc-tms-muted">尚無標本—請新增列或匯入示範 CSV。</td></tr>'
      );
    }
    return p.specimens
      .map(function (s) {
        return (
          '<tr data-spec-row="' +
          escAttr(s.id) +
          '">' +
          '<td><input class="mc-tms-input" data-spec-field="catalogNumber" data-id="' +
          escAttr(s.id) +
          '" value="' +
          escAttr(s.catalogNumber) +
          '"/></td>' +
          '<td><input class="mc-tms-input" data-spec-field="institutionCode" data-id="' +
          escAttr(s.id) +
          '" value="' +
          escAttr(s.institutionCode) +
          '"/></td>' +
          '<td><select class="mc-tms-select" data-spec-field="typeStatus" data-id="' +
          escAttr(s.id) +
          '">' +
          ['holotype', 'paratype', 'syntype', 'lectotype', 'neotype', 'non_type', 'unknown']
            .map(function (ts) {
              return (
                '<option value="' +
                ts +
                '"' +
                (s.typeStatus === ts ? ' selected' : '') +
                '>' +
                esc(tmsTypeStatusLabelZh(ts)) +
                '</option>'
              );
            })
            .join('') +
          '</select></td>' +
          '<td><input class="mc-tms-input" data-spec-field="taxonName" data-id="' +
          escAttr(s.id) +
          '" value="' +
          escAttr(s.taxonName) +
          '"/></td>' +
          '<td><input class="mc-tms-input" data-spec-field="locality" data-id="' +
          escAttr(s.id) +
          '" value="' +
          escAttr(s.locality) +
          '"/></td>' +
          '<td><input class="mc-tms-input" data-spec-field="coordinates" data-id="' +
          escAttr(s.id) +
          '" value="' +
          escAttr(s.coordinates) +
          '"/></td>' +
          '</tr>'
        );
      })
      .join('');
  }

  function renderDrawerBody(p) {
    if (state.drawerTab === 'specimens') {
      return (
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">' +
        '<button type="button" class="mc-tms-btn" data-tms-action="add-specimen">新增標本</button>' +
        '<button type="button" class="mc-tms-btn" data-tms-action="import-csv-mock">匯入 Darwin Core CSV（示範）</button>' +
        '<button type="button" class="mc-tms-btn" data-tms-action="import-mcurator-mock">自 MCurator 資料庫匯入（示範）</button>' +
        '<button type="button" class="mc-tms-btn" data-tms-action="link-prl-mock">' + esc(tmsT('linkPrlDemo')) + '</button>' +
        '<button type="button" class="mc-tms-btn" data-tms-action="gen-material">產生檢視標本文字</button>' +
        '<button type="button" class="mc-tms-btn" data-tms-action="gen-type">產生模式標本文字</button>' +
        '</div>' +
        '<div class="mc-tms-tablewrap"><table class="mc-tms-table"><thead><tr>' +
        '<th>館號</th><th>館方代碼</th><th>模式身分</th><th>分類群</th><th>產地</th><th>座標</th>' +
        '</tr></thead><tbody>' +
        specimenTableRows(p) +
        '</tbody></table></div>'
      );
    }
    if (state.drawerTab === 'matrix') {
      var chars = p.characterMatrix.characters.length ? p.characterMatrix.characters : [emptyCharacter()];
      if (!p.characterMatrix.characters.length) p.characterMatrix.characters = chars;
      var chRows = chars
        .map(function (c) {
          return (
            '<tr><td><input class="mc-tms-input" data-ch-field="characterName" data-id="' +
            escAttr(c.id) +
            '" value="' +
            escAttr(c.characterName) +
            '"/></td>' +
            '<td><input class="mc-tms-input" data-ch-field="anatomicalRegion" data-id="' +
            escAttr(c.id) +
            '" value="' +
            escAttr(c.anatomicalRegion) +
            '"/></td>' +
            '<td><input class="mc-tms-input" data-ch-field="characterState" data-id="' +
            escAttr(c.id) +
            '" value="' +
            escAttr(c.characterState) +
            '"/></td>' +
            '<td><input class="mc-tms-input" data-ch-field="unit" data-id="' +
            escAttr(c.id) +
            '" value="' +
            escAttr(c.unit) +
            '"/></td></tr>'
          );
        })
        .join('');
      return (
        '<div style="margin-bottom:8px"><button type="button" class="mc-tms-btn" data-tms-action="add-character">新增特徵</button> ' +
        '<button type="button" class="mc-tms-btn" data-tms-action="export-matrix-csv">匯出矩陣 CSV（示範）</button> ' +
        '<button type="button" class="mc-tms-btn" data-tms-action="gen-diagnosis-matrix">依獨特狀態草擬鑑別（示範）</button></div>' +
        '<div class="mc-tms-tablewrap"><table class="mc-tms-table"><thead><tr><th>特徵</th><th>部位</th><th>狀態</th><th>單位</th></tr></thead><tbody>' +
        chRows +
        '</tbody></table></div>'
      );
    }
    if (state.drawerTab === 'diagnosis') {
      var d = p.diagnosisBuilder;
      return (
        '<div class="mc-tms-muted" style="margin-bottom:8px">引導式鑑別建置—科學用途須有比較類群。</div>' +
        '<label class="mc-tms-muted">目標分類群</label><input class="mc-tms-input" data-tms-diag="targetTaxon" value="' +
        escAttr(d.targetTaxon) +
        '"/>' +
        '<label class="mc-tms-muted" style="margin-top:8px">比較類群</label><textarea class="mc-tms-textarea" style="min-height:52px" data-tms-diag="comparisonTaxa">' +
        esc(d.comparisonTaxa) +
        '</textarea>' +
        '<label class="mc-tms-muted">獨特／鑑別特徵（使用者）</label><textarea class="mc-tms-textarea" style="min-height:52px" data-tms-diag="uniqueCharacters">' +
        esc(d.uniqueCharacters) +
        '</textarea>' +
        '<label class="mc-tms-muted">量測（原文照登）</label><textarea class="mc-tms-textarea" style="min-height:44px" data-tms-diag="measurements">' +
        esc(d.measurements) +
        '</textarea>' +
        '<button type="button" class="mc-tms-btn mc-tms-btn--primary" style="margin-top:8px" data-tms-action="apply-diagnosis-build">組合鑑別草稿（示範）</button>'
      );
    }
    if (state.drawerTab === 'description') {
      var db = p.descriptionBuilder;
      var fields = [
        ['habitus', '整體習性／外形'],
        ['head', '頭部／顱部／頭區'],
        ['thorax', '胸部／軀幹'],
        ['abdomen', '腹部／附肢'],
        ['wings', '翅／鞘翅／殼／葉／化石構造'],
        ['coloration', '體色'],
        ['sculpture', '表面刻紋'],
        ['genitalia', '生殖器／繁殖構造'],
        ['measurements', '量測（原文照登）'],
        ['variation', '變異'],
        ['fossilPreservation', '化石保存／埋藏學'],
      ];
      return (
        '<p class="mc-tms-muted" style="margin-bottom:8px">形態筆記結構化後轉正式描述（示範：量測原文保留）。</p>' +
        fields
          .map(function (fp) {
            return (
              '<label class="mc-tms-muted">' +
              esc(fp[1]) +
              '</label><textarea class="mc-tms-textarea" style="min-height:44px" data-tms-desc="' +
              fp[0] +
              '">' +
              esc(db[fp[0]] || '') +
              '</textarea>'
            );
          })
          .join('') +
        '<button type="button" class="mc-tms-btn" style="margin-top:8px" data-tms-action="merge-description">筆記轉正式描述（示範）</button>'
      );
    }
    if (state.drawerTab === 'key') {
      var lines = (p.identificationKey.couplets || [])
        .map(function (c, idx) {
          return (
            '<div style="border:1px solid var(--tms-border);border-radius:8px;padding:8px;margin-bottom:6px">' +
            '<strong>對句 ' +
            (idx + 1) +
            '</strong>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">' +
            '<div><span class="mc-tms-muted">甲支</span><input class="mc-tms-input" data-key-lead="a" data-key-id="' +
            escAttr(c.id) +
            '" value="' +
            escAttr(c.a || '') +
            '"/></div>' +
            '<div><span class="mc-tms-muted">乙支</span><input class="mc-tms-input" data-key-lead="b" data-key-id="' +
            escAttr(c.id) +
            '" value="' +
            escAttr(c.b || '') +
            '"/></div></div></div>'
          );
        })
        .join('');
      return (
        '<button type="button" class="mc-tms-btn" data-tms-action="add-couplet">新增二分對句</button> ' +
        '<button type="button" class="mc-tms-btn" data-tms-action="validate-key">檢索表驗證（示範）</button>' +
        '<div style="margin-top:10px">' +
        (lines || '<p class="mc-tms-muted">尚無對句。</p>') +
        '</div>'
      );
    }
    if (state.drawerTab === 'references') {
      var refRows = (p.references || []).length
        ? p.references
            .map(function (r) {
              return (
                '<tr><td><input class="mc-tms-input" data-ref-field="authors" data-ref-id="' +
                escAttr(r.id) +
                '" value="' +
                escAttr(r.authors) +
                '"/></td><td><input class="mc-tms-input" data-ref-field="year" data-ref-id="' +
                escAttr(r.id) +
                '" value="' +
                escAttr(r.year) +
                '"/></td><td><input class="mc-tms-input" data-ref-field="title" data-ref-id="' +
                escAttr(r.id) +
                '" value="' +
                escAttr(r.title) +
                '"/></td><td><input class="mc-tms-input" data-ref-field="doi" data-ref-id="' +
                escAttr(r.id) +
                '" value="' +
                escAttr(r.doi) +
                '"/></td></tr>'
              );
            })
            .join('')
        : '<tr><td colspan="4" class="mc-tms-muted">尚無文獻—請手動輸入或經核可後匯入。</td></tr>';
      return (
        '<div style="margin-bottom:8px"><button type="button" class="mc-tms-btn" data-tms-action="add-reference">新增文獻</button> ' +
        '<button type="button" class="mc-tms-btn" data-tms-action="import-doi-mock">匯入 DOI（示範）</button> ' +
        '<button type="button" class="mc-tms-btn" data-tms-action="bhl-search-mock">BHL 搜尋（示範）</button></div>' +
        '<div class="mc-tms-tablewrap"><table class="mc-tms-table"><thead><tr><th>作者</th><th>年份</th><th>題名</th><th>DOI</th></tr></thead><tbody>' +
        refRows +
        '</tbody></table></div>' +
        '<p class="mc-tms-muted" style="margin-top:8px">AI 不得捏造文獻；未核建議會標示。</p>'
      );
    }
    if (state.drawerTab === 'distribution') {
      return (
        '<div class="mc-tms-mapmock">' +
        icon('map') +
        ' 分佈圖（示範）<br/>僅依標本產地欄位繪製。外部 GBIF 疊圖須另標註來源。</div>' +
        '<button type="button" class="mc-tms-btn" style="margin-top:8px" data-tms-action="gen-distribution-text">依標本產生分佈文字（示範）</button>'
      );
    }
    if (state.drawerTab === 'figures') {
      return (
        '<div class="mc-tms-muted">圖版管理—上傳、圖版編排、比例尺檢核（示範介面）。</div>' +
        '<ul style="margin:8px 0 0 18px;font-size:12px">' +
        (p.figures.length
          ? p.figures
              .map(function (f) {
                return '<li>' + esc(f.label || f.id) + ' — 已引用：' + (f.cited ? '是' : '否') + '</li>';
              })
              .join('')
          : '<li>尚無圖版—請使用「新增圖版（示範）」</li>') +
        '</ul>' +
        '<button type="button" class="mc-tms-btn" style="margin-top:8px" data-tms-action="add-figure">新增圖版（示範）</button> ' +
        '<button type="button" class="mc-tms-btn" data-tms-action="draft-caption">草擬圖說（示範）</button>'
      );
    }
    return (
      '<div class="mc-tms-muted">匯出：Markdown、近似 DOCX 純文字、HTML、JSON 專案、CSV 表（實際按鈕於彈窗）。</div>' +
      '<ul style="font-size:12px;margin:8px 0 0 18px">' +
      (p.exports.length ? p.exports.map(function (x) { return '<li>' + esc(x.label) + ' — ' + esc(tmsExportStatusZh(x.status)) + '</li>'; }).join('') : '<li>尚無匯出紀錄</li>') +
      '</ul>'
    );
  }

  function renderMobile(p) {
    var tabs = [
      { id: 'manuscript', label: '手稿' },
      { id: 'specimens', label: '標本' },
      { id: 'ai', label: 'AI 輔助' },
      { id: 'figures', label: '圖版' },
      { id: 'check', label: '檢查' },
      { id: 'export', label: '匯出' },
    ];
    var body = '';
    if (state.mobileTab === 'manuscript') body = '<p class="mc-tms-muted">章節編輯（行動版）—完整版面請用桌面檢視。</p>';
    else if (state.mobileTab === 'specimens') body = renderDrawerBody(p);
    else if (state.mobileTab === 'ai')
      body =
        '<button type="button" class="mc-tms-btn" data-tms-ai="grammar">文法（示範）</button> ' +
        '<button type="button" class="mc-tms-btn" data-tms-ai="diagnosis">鑑別（示範）</button>';
    else if (state.mobileTab === 'figures') body = '<p class="mc-tms-muted">行動版圖版規劃為簡化檢視。</p>';
    else if (state.mobileTab === 'check') body = validateProject(p).map(function (i) { return '<p>· ' + esc(i.message) + '</p>'; }).join('') || '<p class="mc-tms-muted">無問題</p>';
    else body = '<button type="button" class="mc-tms-btn mc-tms-btn--primary" data-tms-action="open-export">開啟匯出視窗</button>';
    return (
      '<div class="mc-tms-mobile">' +
      '<div class="mc-tms-mobile__top">' +
      renderIntegrityBanner() +
      '<strong>' +
      esc(p.title) +
      '</strong><div class="mc-tms-muted" style="margin-top:4px">' +
      esc(tmsManuscriptTypeZh(p.manuscriptType)) +
      '</div>' +
      '<button type="button" class="mc-tms-btn" style="margin-top:10px" data-tms-action="back-dash">' + esc(tmsT('backDashboard')) + '</button>' +
      '</div>' +
      '<div class="mc-tms-surface" style="background:var(--tms-surface);border:1px solid var(--tms-border);border-radius:10px;padding:12px">' +
      body +
      '</div>' +
      '<nav class="mc-tms-mobile__tabs">' +
      tabs
        .map(function (t) {
          return (
            '<button type="button" class="mc-tms-mtab' +
            (state.mobileTab === t.id ? ' is-active' : '') +
            '" data-tms-mobile="' +
            t.id +
            '">' +
            esc(t.label) +
            '</button>'
          );
        })
        .join('') +
      '</nav></div>'
    );
  }

  function renderExportModal(p) {
    if (!state.exportModal) return '';
    return (
      '<div class="mc-tms-modal-back" data-tms-action="close-export-modal" role="presentation">' +
      '<div class="mc-tms-modal" data-tms-stop="1">' +
      '<div class="mc-tms-modal__head"><strong>匯出（示範）</strong>' +
      '<button type="button" class="mc-tms-btn mc-tms-btn--ghost" data-tms-action="close-export-modal">關閉</button></div>' +
      '<div class="mc-tms-modal__body">' +
      '<p class="mc-tms-muted">示範匯出管線—不寫入實體檔。正式「定稿」匯出前須確認嚴重驗證項目。</p>' +
      '<label style="display:flex;gap:8px;margin:10px 0"><input type="checkbox" data-tms-field="ack-critical" ' +
      (p.expertAcknowledgedCritical ? 'checked' : '') +
      '/> 本人確認嚴重驗證項目須經專家審核。</label>' +
      '<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">' +
      ['Markdown', '近似 DOCX 純文字', 'HTML 預覽', 'JSON 專案', 'CSV 標本', 'CSV 矩陣', '處理文 JSON', 'Darwin Core CSV', '檢核清單 PDF 預覽', '內部報告']
        .map(function (lbl) {
          return (
            '<button type="button" class="mc-tms-btn" data-tms-export="' +
            escAttr(lbl) +
            '">匯出 — ' +
            esc(lbl) +
            '（示範）</button>'
          );
        })
        .join('') +
      '</div></div></div>'
    );
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var p = getActiveProject();
    if (!p) {
      renderDashboard(root);
      bind(root);
      return;
    }
    var html =
      '<div class="mc-tms-root-inner">' +
      renderEditorDesktop(p) +
      renderMobile(p) +
      renderExportModal(p) +
      (state.toast ? '<div style="position:fixed;bottom:72px;left:50%;transform:translateX(-50%);background:rgba(12,20,18,0.95);color:#f0f5f1;padding:10px 18px;border-radius:10px;z-index:90;font-size:13px;border:1px solid rgba(212,184,122,0.35);box-shadow:0 8px 32px rgba(0,0,0,0.4)">' + esc(state.toast) + '</div>' : '') +
      '</div>';
    root.innerHTML = '<div class="mc-tms-root">' + html + '</div>';
    bind(root);
  }

  function bind(root) {
    root.onclick = function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var stop = t.closest('[data-tms-stop]');
      if (stop) ev.stopPropagation();
      var act = t.getAttribute && t.getAttribute('data-tms-action');
      if (!act) act = t.closest('[data-tms-action]') && t.closest('[data-tms-action]').getAttribute('data-tms-action');
      if (act === 'create-blank') {
        var np = createProject('new_species');
        np.specimens.push(emptySpecimen());
        np.specimens[0].catalogNumber = 'HOLO-001';
        np.specimens[0].institutionCode = 'MCUR';
        np.specimens[0].typeStatus = 'holotype';
        np.specimens[0].taxonName = '【學名—請使用者填寫】';
        state.projects.push(np);
        state.activeProjectId = np.id;
        state.activeSectionId = np.manuscriptSections[0].id;
        persist();
        toastMsg('已建立專案（本機示範）。');
        render();
        return;
      }
      if (act === 'import-specimen-mock') {
        toastMsg('標本匯入：請先建立專案，再使用「匯入 Darwin Core CSV（示範）」。');
        return;
      }
      if (act === 'back-dash') {
        state.activeProjectId = '';
        saveActiveId('');
        render();
        return;
      }
      if (act === 'open-export') {
        state.exportModal = true;
        render();
        return;
      }
      if (act === 'close-export-modal') {
        state.exportModal = false;
        render();
        return;
      }
      var card = t.closest('[data-tms-card]');
      if (card) {
        var pid = card.getAttribute('data-tms-card');
        var proj = createProject(pid);
        state.projects.push(proj);
        state.activeProjectId = proj.id;
        state.activeSectionId = proj.manuscriptSections[0].id;
        persist();
        render();
        return;
      }
      var secBtn = t.closest('[data-tms-section]');
      if (secBtn) {
        state.activeSectionId = secBtn.getAttribute('data-tms-section');
        render();
        return;
      }
      var drawer = t.closest('[data-tms-drawer]');
      if (drawer) {
        state.drawerTab = drawer.getAttribute('data-tms-drawer');
        render();
        return;
      }
      var nom = t.closest('[data-tms-nomtab]');
      if (nom) {
        state.nomenclatureTab = nom.getAttribute('data-tms-nomtab');
        render();
        return;
      }
      var mob = t.closest('[data-tms-mobile]');
      if (mob) {
        state.mobileTab = mob.getAttribute('data-tms-mobile');
        render();
        return;
      }
      var ai = t.closest('[data-tms-ai]');
      if (ai) {
        var kind = ai.getAttribute('data-tms-ai');
        var proj = getActiveProject();
        if (!proj) return;
        var active = proj.manuscriptSections.find(function (s) { return s.id === state.activeSectionId; });
        if (active) {
          active.content += mockAiOutput(kind, proj);
          active.verificationStatus = 'needs_expert_review';
        }
        proj.updatedAt = nowIso();
        persist();
        toastMsg('已將示範輔助文字附加至目前章節。');
        render();
        return;
      }
      var api = t.closest('[data-tms-api]');
      if (api) {
        var whichApi = api.getAttribute('data-tms-api');
        if (whichApi === 'gbif') {
          adapters.gbif.searchName('Mus musculus').then(function (r) {
            toastMsg('GBIF 示範：' + (r.results && r.results[0] ? r.results[0].scientificName : '完成'));
          });
        } else if (whichApi === 'bhl') {
          adapters.bhl.searchReference('臺灣鞘翅目').then(function (r) {
            toastMsg('BHL 示範命中：' + (r.hits && r.hits[0] ? r.hits[0].title : '無'));
          });
        }
        return;
      }
      if (act === 'run-validate') {
        var pr = getActiveProject();
        if (!pr) return;
        pr.validationIssues = validateProject(pr);
        pr.updatedAt = nowIso();
        persist();
        toastMsg('已重新驗證（' + pr.validationIssues.length + ' 項訊息）。');
        render();
        return;
      }
      if (act === 'add-specimen') {
        var p0 = getActiveProject();
        if (!p0) return;
        p0.specimens.push(emptySpecimen());
        persist();
        render();
        return;
      }
      if (act === 'import-csv-mock') {
        var p1 = getActiveProject();
        if (!p1) return;
        var s = emptySpecimen();
        s.catalogNumber = 'PARA-010';
        s.typeStatus = 'paratype';
        s.locality = '模式產地區域（請核實）';
        p1.specimens.push(s);
        persist();
        toastMsg('已匯入 1 筆示範 Darwin Core 列。');
        render();
        return;
      }
      if (act === 'import-mcurator-mock') {
        adapters.localMCurator.importSpecimens().then(function (r) {
          toastMsg(r.note);
        });
        return;
      }
      if (act === 'link-prl-mock') {
        toastMsg(tmsT('linkPrlToast'));
        return;
      }
      if (act === 'gen-material' || act === 'gen-type') {
        var p2 = getActiveProject();
        if (!p2) return;
        var tx = p2.taxa[0];
        if (tx) {
          if (act === 'gen-material') tx.materialExamined = mockAiOutput('material_examined', p2);
          else tx.typeMaterial = mockAiOutput('material_examined', p2).replace(/^檢視標本/, '模式標本');
        }
        persist();
        render();
        return;
      }
      if (act === 'add-character') {
        var p3 = getActiveProject();
        if (!p3) return;
        p3.characterMatrix.characters.push(emptyCharacter());
        persist();
        render();
        return;
      }
      if (act === 'export-matrix-csv') {
        toastMsg('矩陣 CSV 匯出（示範）—詳見主控台占位訊息。');
        try {
          console.log('[TMS export]', 'matrix_csv_mock');
        } catch (e) {}
        return;
      }
      if (act === 'gen-diagnosis-matrix') {
        toastMsg('依矩陣產鑑別：須先填寫特徵狀態；示範文字會標【待核可】。');
        return;
      }
      if (act === 'add-figure') {
        var p4 = getActiveProject();
        if (!p4) return;
        p4.figures.push({ id: uid('fig'), label: '圖 ' + (p4.figures.length + 1), cited: false, type: 'habitus' });
        persist();
        render();
        return;
      }
      if (act === 'draft-caption') {
        var p5 = getActiveProject();
        if (!p5 || !p5.figures.length) return toastMsg('請先新增圖版。');
        toastMsg('圖說草稿（示範）：' + mockAiOutput('caption', p5).slice(0, 120) + '…');
        return;
      }
      if (act === 'apply-diagnosis-build') {
        var pD = getActiveProject();
        if (!pD) return;
        var tx0 = pD.taxa[0];
        if (tx0) {
          tx0.diagnosis =
            '【簡式鑑別—示範】\n' +
            (pD.diagnosisBuilder.uniqueCharacters || '【待核可】尚未輸入獨特特徵。') +
            '\n\n【差異鑑別—示範】\n相較：' +
            (pD.diagnosisBuilder.comparisonTaxa || '【待補比較類群】') +
            mockAiOutput('diagnosis', pD);
        }
        persist();
        toastMsg('已將鑑別草稿附加至主分類群處理文（示範）。');
        render();
        return;
      }
      if (act === 'merge-description') {
        var pDs = getActiveProject();
        if (!pDs) return;
        var tx1 = pDs.taxa[0];
        if (tx1) {
          tx1.description = mockAiOutput('description_formal', pDs);
        }
        persist();
        render();
        return;
      }
      if (act === 'add-couplet') {
        var pK = getActiveProject();
        if (!pK) return;
        pK.identificationKey.couplets.push({ id: uid('coup'), a: '', b: '' });
        persist();
        render();
        return;
      }
      if (act === 'validate-key') {
        toastMsg('檢索表驗證（示範）：匯出前請檢查缺分支與重複路徑。');
        return;
      }
      if (act === 'add-reference') {
        var pR = getActiveProject();
        if (!pR) return;
        if (!pR.references) pR.references = [];
        pR.references.push(emptyReference());
        persist();
        render();
        return;
      }
      if (act === 'import-doi-mock') {
        adapters.crossref.lookupDoi('10.0000/mock').then(function (r) {
          toastMsg(r.message || 'DOI 示範');
        });
        return;
      }
      if (act === 'bhl-search-mock') {
        adapters.bhl.searchReference('臺灣鞘翅目').then(function (r) {
          toastMsg('BHL 示範命中：' + (r.hits && r.hits[0] ? r.hits[0].title : '無'));
        });
        return;
      }
      if (act === 'gen-distribution-text') {
        var pM = getActiveProject();
        if (!pM) return;
        var tx2 = pM.taxa[0];
        if (tx2) {
          tx2.distribution =
            '分佈文字（示範），僅依標本產地：\n' +
            (pM.specimens.length
              ? pM.specimens.map(function (s) { return '- ' + (s.locality || '【待補產地】'); }).join('\n')
              : '【待補產地】—請新增標本。');
        }
        persist();
        render();
        return;
      }
      var ex = t.closest('[data-tms-export]');
      if (ex) {
        var p6 = getActiveProject();
        if (!p6) return;
        if (!p6.expertAcknowledgedCritical && validateProject(p6).some(function (i) { return i.severity === 'critical'; })) {
          return toastMsg('定稿式匯出前請勾選確認嚴重驗證項目。');
        }
        p6.exports.push({ id: uid('exp'), label: ex.getAttribute('data-tms-export'), status: 'mock_complete', at: nowIso() });
        persist();
        toastMsg('已排入示範匯出。');
        render();
        return;
      }
    };

    root.onchange = function (ev) {
      var t = ev.target;
      var proj = getActiveProject();
      if (!proj) return;
      if (t && t.getAttribute('data-tms-field') === 'journal-preset') {
        proj.journalPreset = t.value;
        proj.updatedAt = nowIso();
        persist();
        return;
      }
      if (t && t.getAttribute('data-tms-field') === 'ack-critical') {
        proj.expertAcknowledgedCritical = !!t.checked;
        persist();
        return;
      }
      var sid = t.getAttribute && t.getAttribute('data-section-id');
      if (t && t.getAttribute('data-tms-field') === 'section-content' && sid) {
        var sec = proj.manuscriptSections.find(function (s) { return s.id === sid; });
        if (sec) {
          sec.content = t.value;
          sec.verificationStatus = 'ai_draft';
        }
        proj.updatedAt = nowIso();
        persist();
      }
      var sf = t.getAttribute && t.getAttribute('data-spec-field');
      var spid = t.getAttribute && t.getAttribute('data-id');
      if (sf && spid) {
        var sp = proj.specimens.find(function (x) { return x.id === spid; });
        if (sp) sp[sf] = t.value;
        proj.updatedAt = nowIso();
        persist();
      }
      var cf = t.getAttribute && t.getAttribute('data-ch-field');
      var cid = t.getAttribute && t.getAttribute('data-id');
      if (cf && cid) {
        var ch = proj.characterMatrix.characters.find(function (x) { return x.id === cid; });
        if (ch) ch[cf] = t.value;
        proj.updatedAt = nowIso();
        persist();
      }
      var dk = t.getAttribute && t.getAttribute('data-tms-diag');
      if (dk && proj.diagnosisBuilder) {
        proj.diagnosisBuilder[dk] = t.value;
        proj.updatedAt = nowIso();
        persist();
      }
      var ds = t.getAttribute && t.getAttribute('data-tms-desc');
      if (ds && proj.descriptionBuilder) {
        proj.descriptionBuilder[ds] = t.value;
        proj.updatedAt = nowIso();
        persist();
      }
      var kid = t.getAttribute && t.getAttribute('data-key-id');
      var lead = t.getAttribute && t.getAttribute('data-key-lead');
      if (kid && lead) {
        var coup = proj.identificationKey.couplets.find(function (c) { return c.id === kid; });
        if (coup) coup[lead] = t.value;
        proj.updatedAt = nowIso();
        persist();
      }
      var rf = t.getAttribute && t.getAttribute('data-ref-field');
      var rid = t.getAttribute && t.getAttribute('data-ref-id');
      if (rf && rid && proj.references) {
        var ref = proj.references.find(function (x) { return x.id === rid; });
        if (ref) ref[rf] = t.value;
        proj.updatedAt = nowIso();
        persist();
      }
    };
  }

  function mountShell() {
    var shell = document.getElementById(SHELL_ID);
    if (shell) shell.hidden = false;
    state.projects = loadProjects();
    state.activeProjectId = loadActiveId();
    if (state.activeProjectId && !state.projects.some(function (pr) { return pr.id === state.activeProjectId; })) {
      state.activeProjectId = '';
      saveActiveId('');
    }
    if (!state.projects.length) {
      /* seed optional demo skipped — empty dashboard */
    }
    render();
    try {
      if (shell) shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {}
  }

  function hideShell() {
    var shell = document.getElementById(SHELL_ID);
    if (shell) shell.hidden = true;
  }

  function routeOpen() {
    try {
      if (typeof global.switchSection === 'function') global.switchSection('taxonomy-manuscript-studio');
    } catch (e) {}
    mountShell();
  }

  global.renderTaxonomyManuscriptStudioRoute_ = function () {
    try {
      if (typeof global.enterApp === 'function' && !document.documentElement.classList.contains('mc-entered')) {
        global.enterApp();
      }
    } catch (e2) {}
    routeOpen();
  };

  try {
    if (global.MCRoute && typeof global.MCRoute.subscribe === 'function') {
      global.MCRoute.subscribe(function (sectionName) {
        if (sectionName === 'taxonomy-manuscript-studio') {
          try {
            global.location.hash = '#/section/taxonomy-manuscript-studio';
          } catch (eH) {}
          mountShell();
        } else {
          hideShell();
        }
      });
    }
  } catch (eSub) {}

  global.addEventListener('mc:localechange', function () {
    var shell = global.document.getElementById(SHELL_ID);
    if (shell && !shell.hidden) render();
  });

  global.MCTaxonomyManuscriptStudio = {
    mount: mountShell,
    hideShell: hideShell,
    getState: function () { return state; },
    adapters: adapters,
  };
})(typeof window !== 'undefined' ? window : this);
