/**
 * MCurator Documentation Center — docs-v1
 * Renders the Tutorials & Documentation help center; supports published/draft JSON override.
 * Requires: state, document, escapeHtml, escapeHtmlAttr, t, sanitizeRichHtml (optional)
 */
(function (global) {
  'use strict';
  var SV = 'docs-v1';

  function pick_(o, lang) {
    if (!o || typeof o !== 'object') return '';
    if (o[lang] != null && String(o[lang]).length) return String(o[lang]);
    if (o['zh-TW'] != null) return String(o['zh-TW']);
    if (o['en'] != null) return String(o['en']);
    return '';
  }

  function parseJson(s) {
    try {
      if (!s || !String(s).trim()) return null;
      return JSON.parse(String(s));
    } catch (e) {
      return null;
    }
  }

  function defaultMeta() {
    return {
      lastUpdated: '2026-04-05',
      reviewedBy: 'MCurator',
      version: '1.0.0',
      defaultLanguage: 'zh-TW',
      status: 'published'
    };
  }

  /** Polished default documentation — no placeholder markers */
  function getDefaultBundle() {
    return {
      schemaVersion: SV,
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      defaultLanguage: 'zh-TW',
      meta: defaultMeta(),
      categories: [
        { id: 'home', order: 0, icon: '🏠' },
        { id: 'quickstart', order: 1, icon: '⚡' },
        { id: 'workflows', order: 2, icon: '🧭' },
        { id: 'features', order: 3, icon: '✦' },
        { id: 'admin', order: 4, icon: '🔐' },
        { id: 'settings', order: 5, icon: '⚙️' },
        { id: 'troubleshoot', order: 6, icon: '🔧' },
        { id: 'glossary', order: 7, icon: '📖' }
      ],
      pages: buildDefaultPages_(),
      glossaryTerms: buildGlossary_(),
      faq: buildFaq_()
    };
  }

  function buildGlossary_() {
    return [
      { id: 'g1', term: { 'zh-TW': '標本', en: 'Specimen' }, def: { 'zh-TW': '一筆可被查證的典藏或觀察紀錄，含名稱、採集、地點、影像等欄位。', en: 'A verifiable record of a collection or observation with names, collection data, place, and media fields.' } },
      { id: 'g2', term: { 'zh-TW': '學名', en: 'Scientific name' }, def: { 'zh-TW': '依生物命名法則之拉丁化學名，用於穩定對照分類。', en: 'Latinized name under biological nomenclature for stable taxonomic reference.' } },
      { id: 'g3', term: { 'zh-TW': '分類階層', en: 'Taxonomy' }, def: { 'zh-TW': '界门纲目科屬種等層級，用於整理演化與館藏關聯。', en: 'Rank hierarchy used to organize evolutionary and curatorial links.' } },
      { id: 'g4', term: { 'zh-TW': '館別／部門', en: 'Museum department' }, def: { 'zh-TW': '館內分組（如植物、昆蟲），用於瀏覽與篩選。', en: 'Institutional group (e.g. plants, insects) for browsing and filters.' } },
      { id: 'g5', term: { 'zh-TW': '典藏／收藏工作區', en: 'Collection' }, def: { 'zh-TW': '與您帳號相關的標本清單與批次作業。', en: 'Specimen list and batch actions for your account.' } },
      { id: 'g6', term: { 'zh-TW': '博物館典藏（公開瀏覽）', en: 'Museum collections (public)' }, def: { 'zh-TW': '依館別與子典藏瀏覽公開館藏，並可搭配精選與區域篩選。', en: 'Public-facing browser by department and subcollection, with highlights and region filters.' } },
      { id: 'g7', term: { 'zh-TW': '能見度', en: 'Visibility' }, def: { 'zh-TW': '控制標本是否出現在公開典藏或精選展示。', en: 'Controls public or featured presence in the collection browser.' } },
      { id: 'g8', term: { 'zh-TW': 'QR 標籤', en: 'QR label' }, def: { 'zh-TW': '可列印之 QR 連結到標本履歷，利於實體櫥櫃或野外採集盤點。', en: 'Printable QR linking to a specimen record for physical tracking.' } },
      { id: 'g9', term: { 'zh-TW': '內容管理', en: 'CMS' }, def: { 'zh-TW': '管理員後台中公告、新聞、規範、教學條目等結構化內容。', en: 'Structured content in the admin console: news, rules, articles, etc.' } },
      { id: 'g10', term: { 'zh-TW': '內容工作室', en: 'Content Studio' }, def: { 'zh-TW': '以表單編修歡迎頁等網站內容、草稿與發布流程。', en: 'Form-based editor for site copy, drafts, and publish workflow.' } },
      { id: 'g11', term: { 'zh-TW': '草稿', en: 'Draft' }, def: { 'zh-TW': '已儲存但讀者尚未看見的內容版本。', en: 'Saved version not yet shown to visitors.' } },
      { id: 'g12', term: { 'zh-TW': '發布', en: 'Publish' }, def: { 'zh-TW': '將內容套用到公開介面。', en: 'Makes content live for visitors.' } },
      { id: 'g13', term: { 'zh-TW': '版本', en: 'Version' }, def: { 'zh-TW': '內容工作室可保留歷程快照供還原。', en: 'Content Studio can keep snapshots for restore.' } },
      { id: 'g14', term: { 'zh-TW': 'SAT 識別', en: 'SAT ID' }, def: { 'zh-TW': '與科學資產中繼資料關聯的識別欄位（本 App 以教育演示為主）。', en: 'Identifier tied to scientific-asset-style metadata (demo / educational context).' } },
      { id: 'g15', term: { 'zh-TW': '來源脈絡', en: 'Provenance' }, def: { 'zh-TW': '標本取得、流轉與可驗證來源敘事。', en: 'Narrative of how an object was obtained and verified.' } },
      { id: 'g16', term: { 'zh-TW': '正模標本', en: 'Type specimen' }, def: { 'zh-TW': '命名時指定之參考標本；共同發表流程可與專家協作欄位銜接。', en: 'Name-bearing specimen; co-publication flow may reference expert roles.' } },
      { id: 'g17', term: { 'zh-TW': 'IUCN 狀態', en: 'IUCN status' }, def: { 'zh-TW': '保育風險分級（參考欄位，非生態學最終判定）。', en: 'Conservation risk label (reference field, not a legal determination).' } },
      { id: 'g18', term: { 'zh-TW': 'GBIF', en: 'GBIF' }, def: { 'zh-TW': '全球生物多樣性資訊設施，常用於分類與出現紀錄檢索。', en: 'Global Biodiversity Information Facility for occurrence and taxonomy search.' } },
      { id: 'g19', term: { 'zh-TW': 'Catalogue of Life', en: 'Catalogue of Life' }, def: { 'zh-TW': '整合分類參考資料庫之一，可用於學名對照。', en: 'Integrated taxonomic checklists for name reconciliation.' } }
    ];
  }

  function buildFaq_() {
    return [
      { id: 'f1', severity: 'normal', q: { 'zh-TW': '我改了內容但前台沒有變？', en: 'I changed content but it does not show.' }, a: { 'zh-TW': '在內容工作室請確認已「發布」而不只是儲存草稿。重新整理頁面，並切換語系檢查是否該語系尚未翻譯而顯示預設語。', en: 'In Content Studio, confirm you **published**, not only saved a draft. Refresh, and check if the language has no translation yet and falls back.' } },
      { id: 'f2', severity: 'normal', q: { 'zh-TW': '歡迎頁背景影片不播放？', en: 'The welcome background video does not play.' }, a: { 'zh-TW': '請使用可直接播放的 mp4/WebM 連結；瀏覽器靜音自動播放為常見限制。失敗時會顯示漸層備援。', en: 'Use a direct **mp4/WebM** URL; autoplay is often **muted** by browsers. A gradient shows if playback fails.' } },
      { id: 'f3', severity: 'normal', q: { 'zh-TW': '篩選後看不到任何標本？', en: 'No specimens after filtering.' }, a: { 'zh-TW': '清除所有篩選、確認館別與能見度；若為示範環境，資料表可能原本為空。', en: 'Clear filters, check department and visibility; demo datasets may be empty.' } },
      { id: 'f4', severity: 'admin', q: { 'zh-TW': '後台分頁內容沒有變化？', en: 'Admin tabs do not update.' }, a: { 'zh-TW': '確認已以管理帳登入、無瀏覽器擴充擋下脚本，必要時重載。', en: 'Confirm admin session, no script-blockers, and hard-reload if needed.' } },
      { id: 'f5', severity: 'normal', q: { 'zh-TW': '地圖讀不到圖層？', en: 'The map tiles do not load.' }, a: { 'zh-TW': '檢查圖磚與歸屬字串、網路可否存取圖層主機；可改用靜態地圖或手動座標。', en: 'Check tile URL, attribution, and network; use static map or manual coordinates as fallback.' } },
      { id: 'f6', severity: 'warning', q: { 'zh-TW': '匯出網址顯示 blob:null？', en: 'Export URL shows blob:null.' }, a: { 'zh-TW': '多為本機預覽的暫時連結。請用下載鈕取得正式檔案，勿在公告中貼上 blob: 網址。', en: 'Common in local preview. Use the download button; never publish `blob:` URLs.' } },
      { id: 'f7', severity: 'normal', q: { 'zh-TW': '英文畫面仍出現中文？', en: 'English UI still shows Chinese.' }, a: { 'zh-TW': '部分欄位若缺少翻譯，會以預設語系補上；可於翻譯管理補齊。', en: 'Missing strings fall back to the default language; add translations in the manager.' } },
      { id: 'f8', severity: 'dev', q: { 'zh-TW': '按鈕沒有反應？', en: 'Buttons do not respond.' }, a: { 'zh-TW': '檢查主控台是否有錯誤、全螢幕遮擋、或同頁重覆初始化。可重新整理。', en: 'Check the console, overlays, or duplicate init; try a full refresh.' } }
    ];
  }

  function buildDefaultPages_() {
    var P = [];
    function T(zh, en) {
      return { 'zh-TW': zh, en: en };
    }
    /* —— Workflows —— */
    P.push(
      page_('wf1', 'workflows', T('建立標本紀錄', 'Create a specimen record'), T('從表單到出現在「我的收藏工作區」的完整路徑。', 'From the form to your collection workspace.'), ['member', 'editor', 'admin'], 10, '12 min', [
        block_('s1', 'steps', null, [
          step_(T('開啟新增', 'Open add'), T('在「標本」或工作區點「新增」開啟表單。', 'Use Add specimen from Specimens or workspace.')),
          step_(T('基本與學名', 'Basics & name'), T('填寫常用名、學名與生物群組；學名有助分類欄位一致。', 'Fill common and scientific names and biosphere; scientific name helps taxonomy.')),
          step_(T('地點與採集', 'Locality & field'), T('地點、採集者、日期可支援地圖與履敘。', 'Locality, collector, and date power maps and provenance.')),
          step_(T('影像', 'Image'), T('上傳或貼上可直連的影像網址。', 'Upload or paste a direct image URL.')),
          step_(T('儲存與確認', 'Save & verify'), T('儲存後至「我的收藏工作區」確認列表、卡片或表格式樣。', 'Save, then verify in the workspace in table, list, or card view.'))
        ])
      ], T('重複的 specimen number、未儲就離頁。', 'Duplicate numbers or leaving the page before save.'))
    );
    P.push(
      page_('wf2', 'workflows', T('搜尋與篩選', 'Search & filter'), T('在工作區內關鍵字與多欄位篩選。', 'Keyword search and field filters.'), ['guest', 'member', 'editor', 'admin'], 11, '6 min', [
        block_('b1', 'text', T('要點', 'Summary'), T('從**我的收藏工作區**開啟搜尋列；以群組、狀態、稀有度、國家、採集者、日期等縮小結果。可切換表/清單/卡片。', 'Open the workspace, use the search box, then filter by group, status, rarity, country, collector, and date. Switch table, list, or card views.'))
      ], T('篩選過嚴。先清除重試。', 'Filters too strict; clear and retry.'))
    );
    P.push(
      page_('wf3', 'workflows', T('使用館藏瀏覽', 'Museum collection browser'), T('依館別樹狀理解館藏分佈。', 'Per-department tree and counts.'), ['member', 'editor', 'admin'], 12, '5 min', [
        block_('b1', 'text', null, T('在**館藏瀏覽**切換部門、檢視數量、開啟相關標本。必要時重設篩選。', 'In **Museum collections**, pick a department, review counts, open items, reset filters as needed.'))
      ], null)
    );
    P.push(
      page_('wf4', 'workflows', T('公開典藏展示', 'Publish to public collections'), T('公開或精選顯示。', 'Public or featured visibility.'), ['member', 'editor', 'admin'], 13, '8 min', [
        block_('b1', 'steps', null, [
          step_(T('編輯標本', 'Edit record'), T('在標本編輯中設定**能見度**為公開或精選。', 'Set visibility to public or featured.')),
          step_(T('敘事與影像', 'Narrative'), T('確認標題、主圖與顯示欄位。', 'Check title, hero image, and metadata shown.')),
          step_(T('開啟博物館典藏', 'Open museum collections'), T('於前台分頁檢查是否出現在期望區塊。', 'Check the public Museum Collections view.'))
        ])
      ], T('能見度仍為私人。', 'Still private; adjust visibility.'))
    );
    P.push(
      page_('wf5', 'workflows', T('匯出、QR 與標籤', 'Export, QR & labels'), T('批次工具列與列印。', 'Batch toolbar, export, and print.'), ['member', 'editor', 'admin'], 14, '7 min', [
        block_('b1', 'text', null, T('於工作區勾選多筆→批次工具列**匯出** CSV/JSON、開啟**QR 預覽**、**列印標籤**前確認設定中的標籤尺寸與 QR 像素。', 'Select rows: Export CSV/JSON, QR preview, print labels; confirm label and QR size in Settings.'))
      ], null)
    );
    /* —— Features (short) —— */
    var feat = [
      ['feat-dash', T('儀表板', 'Dashboard'), T('彙整月度進度、公告、新聞、論文與近期活動；是每日入口。', 'Progress, announcements, news, papers, and activity; your daily hub.')],
      ['feat-workspace', T('我的收藏工作區', 'My collection workspace'), T('表格式、清單式、卡片式檢視；多條件篩選、批次、匯出。', 'Table, list, and card views; rich filters, batch, export.')],
      ['feat-museum', T('館藏瀏覽', 'Collection browser'), T('以館別分類檢索館內分佈。', 'Browse by curatorial department.')],
      ['feat-vm', T('博物館典藏', 'Museum collections'), T('地區主題、精選故事與公開敘事。', 'Regional themes, highlights, and storytelling.')],
      ['feat-community', T('社群', 'Community'), T('分類、貼文、論文/新聞轉贴；遵守版區說明與舉報機制。', 'Categories, posts, and sharing; follow rules and use report where needed.')],
      ['feat-coop', T('新物種合著', 'New species co-publication'), T('提案與參與者角色示意；學術免責以機構政策為準。', 'Proposals and collaborator roles; final policies are institutional.')],
      ['feat-sat', T('SAT 友善市集', 'SAT marketplace area'), T('以可溯**中繼**與教育導向示範為主，非投機導向。', 'Emphasises traceable **metadata** and learning demos, not financial speculation.')],
      ['feat-game', T('成就', 'Achievements'), T('等級、點數、簽到連貫、收藏目標。', 'Level, points, streaks, and collection goal.')]
    ];
    for (var fi = 0; fi < feat.length; fi++) {
      P.push(
        page_(feat[fi][0], 'features', feat[fi][1], T('此模組概覽與常見路徑。', 'Module overview.'), ['guest', 'member', 'editor', 'admin'], 20 + fi, '4 min', [block_('b', 'text', null, feat[fi][2])], null)
      );
    }
    /* —— Admin —— */
    P.push(
      page_('ad1', 'admin', T('管理員主控台概覽', 'Admin console overview'), T('官方帳、標本、模板、活動、匯出與內容。', 'Accounts, specimens, templates, activities, export, and content.'), ['admin'], 30, '6 min', [
        block_('b1', 'text', null, T('主控台彙整跨模組作業。官方帳與審查仍應有**內部 SOP** 配合。', 'The console aggregates tasks; keep **internal SOPs** for accounts and review.'))
      ], null)
    );
    P.push(
      page_('ad2', 'admin', T('內容工作室', 'Content Studio'), T('以表單與可視編輯更新歡迎頁等。', 'Form-based copy for the welcome page, etc.'), ['editor', 'admin'], 31, '8 min', [
        block_('b1', 'text', null, T('在**內容工作室**選內容範圍→章節→儲存草稿→預覽→發布。進階 JSON 建議僅由開發者展開。', 'In **Content Studio**: pick an area, edit sections, **Save draft** → **Preview** → **Publish**; keep Advanced JSON collapsed for devs only.'))
      ], null)
    );
    P.push(
      page_('ad3', 'admin', T('控制台 CMS', 'CMS console'), T('公告、新聞、論文、規則、教學條目。', 'News, rules, and knowledge.'), ['admin'], 32, '6 min', [
        block_('b1', 'text', null, T('在**控制台 CMS** 依分頁載入列表、編輯、儲存；與內容工作室的跨頁文案**分工**：CMS 以條目列表為主。', 'In **Console CMS** load each tab, edit entries; Content Studio covers broader page copy.'))
      ], null)
    );
    P.push(
      page_('ad4', 'admin', T('發布流程', 'Publishing workflow'), T('草稿、預覽、上線。', 'Draft, preview, go live.'), ['editor', 'admin'], 33, '5 min', [
        block_('b1', 'checklist', T('建議步驟', 'Checklist'), [T('撰寫草稿並校對。', 'Write and proof draft.'), T('預覽桌機/手機與多語。', 'Preview desktop/mobile and languages.'), T('發布後再次確認讀者端。', 'Verify the live view after publish.')])
      ], null)
    );
    P.push(
      page_('ad5', 'admin', T('翻譯流程', 'Translation workflow'), T('先完成預設語、再補其餘。', 'Default language first.'), ['editor', 'admin'], 34, '4 min', [
        block_('b1', 'text', null, T('在翻譯管理**比對**基準與目標欄；可「從基準複製」作初稿。機器初稿**務必**人工審定。', 'Use the translation view to copy baseline text and edit; any machine output must be reviewed.'))
      ], null)
    );
    return P;
  }

  function page_(id, cat, title, desc, roles, order, eta, blocks, mistakes) {
    return {
      id: id,
      category: cat,
      title: typeof title === 'string' ? { 'zh-TW': title, en: title } : title,
      description: typeof desc === 'string' ? { 'zh-TW': desc, en: desc } : desc,
      role: roles || ['guest', 'member', 'editor', 'admin'],
      order: order,
      visible: true,
      estimated: eta,
      commonMistakes: mistakes
        ? { 'zh-TW': typeof mistakes === 'string' ? mistakes : mistakes['zh-TW'] || '', en: typeof mistakes === 'string' ? mistakes : mistakes.en || '' }
        : null,
      blocks: blocks || []
    };
  }

  function block_(id, type, title, body) {
    var b = { id: id, type: type, visible: true };
    if (type === 'steps' && body && body.length) {
      b.steps = body;
    } else if (type === 'checklist' && body && body.length) {
      b.title = title;
      b.items = body;
    } else {
      b.title = title;
      b.content = body;
    }
    return b;
  }

  function step_(t, b) {
    return { title: t, body: b };
  }

  function deepMergePage_(defP, ovr) {
    if (!ovr) return defP;
    return {
      id: ovr.id || defP.id,
      category: ovr.category || defP.category,
      title: ovr.title || defP.title,
      description: ovr.description || defP.description,
      role: ovr.role || defP.role,
      order: ovr.order != null ? ovr.order : defP.order,
      visible: ovr.visible === false ? false : true,
      estimated: ovr.estimated || defP.estimated,
      commonMistakes: ovr.commonMistakes != null ? ovr.commonMistakes : defP.commonMistakes,
      blocks: ovr.blocks && ovr.blocks.length ? ovr.blocks : defP.blocks
    };
  }

  function mergeBundle_(defB, ovr) {
    if (!ovr) return defB;
    if (ovr.schemaVersion && ovr.schemaVersion !== SV) return defB;
    var out = JSON.parse(JSON.stringify(defB));
    out.updatedAt = ovr.updatedAt || out.updatedAt;
    out.publishedAt = ovr.publishedAt || out.publishedAt;
    if (ovr.meta) out.meta = Object.assign({}, out.meta, ovr.meta);
    if (ovr.glossaryTerms && ovr.glossaryTerms.length) out.glossaryTerms = ovr.glossaryTerms;
    if (ovr.faq && ovr.faq.length) out.faq = ovr.faq;
    if (ovr.pages && ovr.pages.length) {
      var byId = {};
      out.pages.forEach(function (p) {
        byId[p.id] = p;
      });
      ovr.pages.forEach(function (p) {
        if (byId[p.id]) byId[p.id] = deepMergePage_(byId[p.id], p);
        else if (p && p.id) byId[p.id] = p;
      });
      out.pages = out.pages
        .map(function (p) {
          return byId[p.id] || p;
        })
        .concat(ovr.pages.filter(function (p) {
          return !out.pages.some(function (x) {
            return x.id === p.id;
          });
        }));
    }
    return out;
  }

  function getBundle(state) {
    var s = (state && state.settings) || {};
    var published = parseJson(s.documentationPublishedJson);
    var draft = parseJson(s.documentationContentJson);
    var isEd = typeof global.isAdminSession === 'function' && global.isAdminSession();
    var ovr = published || (isEd && draft) || null;
    if (ovr) return mergeBundle_(getDefaultBundle(), ovr);
    return getDefaultBundle();
  }

  function allSearchText(page, lang) {
    var t = [];
    t.push(pick_(page.title, lang), pick_(page.description, lang));
    (page.blocks || []).forEach(function (b) {
      if (b.type === 'text') t.push(pick_(b.content, lang)), pick_(b.title, lang) && t.push(pick_(b.title, lang));
      if (b.type === 'steps')
        (b.steps || []).forEach(function (s) {
          t.push(pick_(s.title, lang), pick_(s.body, lang));
        });
      if (b.type === 'checklist')
        (b.items || []).forEach(function (it) {
          t.push(typeof it === 'string' ? it : pick_(it, lang));
        });
    });
    return t.join(' ').toLowerCase();
  }

  function searchBundle(bundle, q, lang) {
    if (!q || !String(q).trim()) return [];
    var k = String(q)
      .trim()
      .toLowerCase();
    var out = [];
    (bundle.pages || []).forEach(function (p) {
      if (p.visible === false) return;
      var blob = allSearchText(p, lang);
      if (blob.indexOf(k) !== -1) {
        var i = blob.indexOf(k);
        out.push({ page: p, snippet: blob.slice(Math.max(0, i - 40), i + 80) });
      }
    });
    (bundle.glossaryTerms || []).forEach(function (g) {
      var name = pick_(g.term, lang) + ' ' + pick_(g.def, lang);
      if (name.toLowerCase().indexOf(k) !== -1) {
        out.push({ glossary: g, snippet: pick_(g.def, lang).slice(0, 120) });
      }
    });
    (bundle.faq || []).forEach(function (f) {
      var blob = (pick_(f.q, lang) + ' ' + pick_(f.a, lang)).toLowerCase();
      if (blob.indexOf(k) !== -1) out.push({ faq: f, snippet: pick_(f.a, lang).slice(0, 160) });
    });
    return out.slice(0, 32);
  }

  function roleCardsHtml(lang, esc, tKey) {
    var cards = [
      { id: 'guest', icon: '👤', t: tKey('docs_role_guest'), d: tKey('docs_role_guest_d'), c: [tKey('docs_role_guest_1'), tKey('docs_role_guest_2'), tKey('docs_role_guest_3')] },
      { id: 'member', icon: '🧑‍🔬', t: tKey('docs_role_member'), d: tKey('docs_role_member_d'), c: [tKey('docs_role_member_1'), tKey('docs_role_member_2'), tKey('docs_role_member_3')] },
      { id: 'editor', icon: '✍️', t: tKey('docs_role_editor'), d: tKey('docs_role_editor_d'), c: [tKey('docs_role_editor_1'), tKey('docs_role_editor_2'), tKey('docs_role_editor_3')] },
      { id: 'admin', icon: '🔐', t: tKey('docs_role_admin'), d: tKey('docs_role_admin_d'), c: [tKey('docs_role_admin_1'), tKey('docs_role_admin_2'), tKey('docs_role_admin_3')] }
    ];
    return (
      '<div class="mc-docs-roles" id="mcDocsRoles">' +
      cards
        .map(function (c) {
          return (
            '<div class="mc-docs-role-card" data-role="' +
            c.id +
            '">' +
            '<div class="mc-docs-role-ic" aria-hidden="true">' +
            c.icon +
            '</div><h3>' +
            esc(c.t) +
            '</h3><p class="mc-docs-muted">' +
            esc(c.d) +
            '</p><ol class="mc-docs-ck">' +
            c.c.map(function (x) {
              return '<li>' + esc(x) + '</li>';
            }) +
            '</ol></div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderBlock_(b, lang) {
    if (!b || b.visible === false) return '';
    if (b.type === 'text') {
      return (
        '<div class="mc-docs-block"><h3>' +
        escHtmlGlobal(pick_(b.title, lang) || '') +
        '</h3><div class="mc-docs-prose">' +
        sanitizeBody_(pick_(b.content, lang) || pick_(b.content, 'en')) +
        '</div></div>'
      );
    }
    if (b.type === 'steps') {
      return (
        '<ol class="mc-docs-steps">' +
        (b.steps || [])
          .map(function (s) {
            return (
              '<li><strong>' +
              escHtmlGlobal(pick_(s.title, lang)) +
              '</strong><p class="mc-docs-step-body">' +
              escHtmlGlobal(pick_(s.body, lang)) +
              '</p></li>'
            );
          })
          .join('') +
        '</ol>'
      );
    }
    if (b.type === 'checklist') {
      return (
        '<div class="mc-docs-block"><h3>' + escHtmlGlobal(pick_(b.title, lang)) + '</h3><ul class="mc-docs-cklist">' +
        (b.items || [])
          .map(function (it) {
            return '<li>' + escHtmlGlobal(typeof it === 'string' ? it : pick_(it, lang)) + '</li>';
          })
          .join('') +
        '</ul></div>'
      );
    }
    return '';
  }

  function escHtmlGlobal(s) {
    return (global.escapeHtml && global.escapeHtml(s)) || String(s == null ? '' : s);
  }
  function sanitizeBody_(h) {
    if (global.sanitizeRichHtml) return global.sanitizeRichHtml(h);
    return escHtmlGlobal(h);
  }

  var _view = { cat: 'home', page: null, q: '' };

  function mount(root) {
    if (!root) return;
    var state = global.state || {};
    var lang = state.lang || 'zh-TW';
    var b = getBundle(state);
    var T = (global.t && function (k) {
        return global.t(k);
      }) || function (k) {
        return k;
    };
    var isAd = typeof global.isAdminSession === 'function' && global.isAdminSession();
    var isEd = isAd;

    var meta = b.meta || defaultMeta();
    var ph = T('docs_search_ph') || (lang === 'zh-TW' ? '搜尋教學、功能或常見問題' : 'Search tutorials, features, or FAQ');
    var html = [];
    html.push('<div class="mc-docs-hero">');
    html.push('<div class="mc-docs-hero-card">');
    html.push('<div class="mc-docs-badges">');
    ['docs_badge_getting', 'docs_badge_spec', 'docs_badge_cms', 'docs_badge_settings'].forEach(function (k) {
      html.push('<span class="mc-docs-pill">' + escHtmlGlobal(T(k)) + '</span>');
    });
    html.push('</div><h1 class="mc-docs-h1">' + escHtmlGlobal(T('learn_title')) + '</h1>');
    html.push('<p class="mc-docs-hero-dek">' + escHtmlGlobal(T('docs_hero_dek')) + '</p>');
    html.push(
      '<div class="mc-docs-hero-search"><input type="search" class="input" id="mcDocsSearch" placeholder="' +
        escHtmlGlobal(ph) +
        '" autocomplete="off" value="' +
        escHtmlGlobal(_view.q) +
        '"/><button type="button" class="soft-btn" id="mcDocsSearchBtn">' +
        escHtmlGlobal(T('docs_search_btn') || T('nav_search') || 'Search') +
        '</button></div>'
    );
    html.push('<div class="mc-docs-hero-cta">');
    html.push('<button type="button" class="soft-btn" onclick="switchSection(\'welcome\')">' + escHtmlGlobal(T('docs_cta_guest')) + '</button>');
    html.push('<button type="button" class="primary-btn" onclick="openSpecimenModal ? openSpecimenModal() : switchSection(\'specimens\')">' + escHtmlGlobal(T('docs_cta_add')) + '</button>');
    html.push('<button type="button" class="soft-btn" onclick="typeof switchAdminTab === \'function\' && switchAdminTab(\'content\')">' + escHtmlGlobal(T('docs_cta_studio')) + '</button>');
    html.push('<button type="button" class="soft-btn" onclick="switchSection(\'settings\')">' + escHtmlGlobal(T('docs_cta_settings')) + '</button>');
    html.push('</div></div></div>');

    html.push('<div class="mc-docs-core">');
    /* sidebar */
    html.push('<aside class="mc-docs-nav" aria-label="doc nav"><nav class="mc-docs-nav-inner">');
    var cats = (b.categories || [])
      .slice()
      .sort(function (a, c) { return a.order - c.order; });
    cats.forEach(function (c) {
      if (c.id === 'home') return;
      var lab = T('docs_cat_' + c.id) || c.id;
      var active = _view.cat === c.id ? ' is-active' : '';
      html.push(
        '<button type="button" class="mc-docs-nav-item' + active + '" data-mc-doc-cat="' + escHtmlGlobal(c.id) + '"><span class="ic">' + c.icon + '</span><span>' + escHtmlGlobal(lab) + '</span></button>'
      );
    });
    html.push('</nav><div class="mc-docs-backtop"><button type="button" class="soft-btn" id="mcDocsTop">' + escHtmlGlobal(T('docs_back_top')) + '</button></div></aside>');

    /* center + aside TOC */
    html.push('<div class="mc-docs-main">');
    html.push('<div id="mcDocsSearchResults" class="mc-docs-results" style="display:none"></div>');

    html.push('<section class="mc-docs-sec" id="mc-doc-land">');
    if (_view.cat === 'home' && _view.page == null) {
      html.push('<h2 class="mc-docs-sec-t">' + escHtmlGlobal(T('docs_sec_roles')) + '</h2>');
      html.push(roleCardsHtml(lang, function (x) { return escHtmlGlobal(x); }, T));
    }
    html.push('</section>');

    if (_view.cat === 'quickstart' && !_view.q) {
      /* already in land */
    }

    if (_view.cat === 'workflows') {
      html.push('<section class="mc-docs-sec" id="mc-doc-wf">');
      html.push('<h2 class="mc-docs-sec-t">' + escHtmlGlobal(T('docs_sec_wf')) + '</h2>');
      html.push('<div class="mc-docs-grid">');
      b.pages
        .filter(function (p) { return p.category === 'workflows' && p.visible !== false; })
        .sort(function (a, c) { return a.order - c.order; })
        .forEach(function (p) {
          if (_view.page && p.id !== _view.page) return;
          if (!_view.page) {
            html.push(
              '<div class="mc-docs-wf-card" data-mc-page="' + escHtmlGlobal(p.id) + '"><h3>' + escHtmlGlobal(pick_(p.title, lang)) + '</h3><p class="mc-docs-muted">' + escHtmlGlobal(pick_(p.description, lang)) + '</p><div class="mc-docs-wf-meta"><span>⏱ ' + escHtmlGlobal(p.estimated || '—') + '</span><span>· ' + (p.role || []).join(', ') + '</span></div><button type="button" class="small-btn primary" data-mc-page-open="' + escHtmlGlobal(p.id) + '">' + escHtmlGlobal(T('docs_open')) + '</button></div>'
            );
          } else {
            html.push('<div class="mc-docs-article" id="mc-doc-article">');
            html.push('<h2>' + escHtmlGlobal(pick_(p.title, lang)) + '</h2>');
            html.push('<p class="mc-docs-muted">' + escHtmlGlobal(pick_(p.description, lang)) + '</p>');
            (p.blocks || []).forEach(function (bl) {
              html.push(renderBlock_(bl, lang));
            });
            if (p.commonMistakes) {
              html.push(
                '<div class="mc-docs-warn"><strong>' + escHtmlGlobal(T('docs_common_mistakes')) + '</strong><p>' + escHtmlGlobal(pick_(p.commonMistakes, lang) || pick_(p.commonMistakes, 'zh-TW')) + '</p></div>'
              );
            }
            if (isEd) {
              html.push(
                '<p class="mc-docs-editor-hint">⚠ ' + escHtmlGlobal(T('docs_edit_hint')) + '</p>'
              );
            }
            html.push('</div>');
          }
        });
      html.push('</div></section>');
    }

    if (_view.cat === 'features' && _view.page == null) {
      html.push('<section class="mc-docs-sec"><h2 class="mc-docs-sec-t">' + escHtmlGlobal(T('docs_sec_features')) + '</h2><div class="mc-docs-grid">');
      b.pages
        .filter(function (p) { return p.category === 'features' && p.visible !== false; })
        .forEach(function (p) {
          html.push(
            '<div class="mc-docs-feat-card" data-mc-page="' + escHtmlGlobal(p.id) + '"><h3>' + escHtmlGlobal(pick_(p.title, lang)) + '</h3><p>' + escHtmlGlobal(pick_(p.description, lang)) + '</p><button type="button" class="small-btn" data-mc-page-open="' + escHtmlGlobal(p.id) + '">' + escHtmlGlobal(T('docs_read')) + '</button></div>'
          );
        });
      html.push('</div></section>');
    } else if (_view.cat === 'features' && _view.page) {
      var p = b.pages.filter(function (x) { return x.id === _view.page; })[0];
      if (p) {
        html.push('<section class="mc-docs-sec"><div class="mc-docs-article">');
        html.push('<h2>' + escHtmlGlobal(pick_(p.title, lang)) + '</h2>');
        (p.blocks || []).forEach(function (bl) {
          html.push(renderBlock_(bl, lang));
        });
        html.push('</div></section>');
      }
    }

    if (_view.cat === 'admin' && _view.page == null) {
      html.push('<section class="mc-docs-sec"><h2 class="mc-docs-sec-t">' + escHtmlGlobal(T('docs_sec_admin')) + '</h2><div class="mc-docs-grid">');
      b.pages
        .filter(function (p) { return p.category === 'admin' && p.visible !== false; })
        .forEach(function (p) {
          html.push(
            '<div class="mc-docs-feat-card"><h3>' + escHtmlGlobal(pick_(p.title, lang)) + '</h3><p class="mc-docs-muted">' + escHtmlGlobal(pick_(p.description, lang)) + '</p><button type="button" class="small-btn" data-mc-page-open="' + escHtmlGlobal(p.id) + '">' + escHtmlGlobal(T('docs_read')) + '</button></div>'
          );
        });
      html.push('</div></section>');
    } else if (_view.cat === 'admin' && _view.page) {
      var pa = b.pages.filter(function (x) { return x.id === _view.page; })[0];
      if (pa) {
        html.push('<section class="mc-docs-sec"><div class="mc-docs-article">');
        html.push('<h2>' + escHtmlGlobal(pick_(pa.title, lang)) + '</h2>');
        (pa.blocks || []).forEach(function (bl) {
          html.push(renderBlock_(bl, lang));
        });
        html.push('</div></section>');
      }
    }

    if (_view.cat === 'settings') {
      html.push(
        '<section class="mc-docs-sec" id="mcDocSettings"><h2 class="mc-docs-sec-t">' + escHtmlGlobal(T('docs_sec_settings')) + '</h2><div class="mc-docs-accordion">'
      );
      var setItems = [
        { k: 's_layout', t: 'docs_set_layout' },
        { k: 's_mode', t: 'docs_set_mode' },
        { k: 's_theme', t: 'docs_set_theme' },
        { k: 's_lang', t: 'docs_set_lang' },
        { k: 's_welcome', t: 'docs_set_welcome' },
        { k: 's_label', t: 'docs_set_label' },
        { k: 's_map', t: 'docs_set_map' },
        { k: 's_export', t: 'docs_set_export' }
      ];
      setItems.forEach(function (x, i) {
        var open = i === 0 ? ' open' : '';
        html.push(
          '<details' + open + ' class="mc-docs-details"><summary>' + escHtmlGlobal(T(x.t)) + '</summary><div class="mc-docs-prose">' + escHtmlGlobal(T('docs_set_' + x.k + '_b')) + '</div></details>'
        );
      });
      html.push('</div></section>');
    }

    if (_view.cat === 'troubleshoot') {
      html.push(
        '<section class="mc-docs-sec" id="mcDocFaq"><h2 class="mc-docs-sec-t">' + escHtmlGlobal(T('docs_sec_faq')) + '</h2>'
      );
      b.faq.forEach(function (f) {
        var sev = f.severity || 'normal';
        html.push(
          '<div class="mc-docs-faq ' + escHtmlGlobal(sev) + '"><strong class="mc-docs-faq-q">Q: ' + escHtmlGlobal(pick_(f.q, lang)) + '</strong><p class="mc-docs-faq-a">A: ' + escHtmlGlobal(pick_(f.a, lang)) + '</p><span class="mc-docs-sev">' + escHtmlGlobal(T('docs_faq_sev_' + (sev === 'dev' ? 'dev' : sev)) || sev) + '</span></div>'
        );
      });
      html.push('</section>');
    }

    if (_view.cat === 'glossary') {
      html.push(
        '<section class="mc-docs-sec" id="mcDocGloss"><h2 class="mc-docs-sec-t">' + escHtmlGlobal(T('docs_sec_glossary')) + '</h2><dl class="mc-docs-dl">'
      );
      b.glossaryTerms.forEach(function (g) {
        html.push(
          '<div class="mc-docs-dlrow"><dt>' + escHtmlGlobal(pick_(g.term, lang)) + '</dt><dd>' + escHtmlGlobal(pick_(g.def, lang)) + '</dd></div>'
        );
      });
      html.push('</dl></section>');
    }

    if (_view.page == null) {
      /* meta + feedback always at bottom of scroll */
    }
    html.push('</div>'); /* main */

    /* right TOC - desktop */
    html.push(
      '<aside class="mc-docs-toc" aria-label="on this page"><div class="mc-docs-toc-inner"><div class="mc-docs-toc-title">' + escHtmlGlobal(T('docs_toc')) + '</div><a href="#mcDocMeta">' + escHtmlGlobal(T('docs_toc_meta')) + '</a><a href="#mcDocFeedback">' + escHtmlGlobal(T('docs_toc_fb')) + '</a></div></aside>'
    );

    html.push('</div>');

    html.push('<section class="mc-docs-sec" id="mcDocMeta" style="margin-top:20px;max-width:var(--content-max)">');
    html.push(
      '<div class="mc-docs-meta card panel"><h3>' + escHtmlGlobal(T('docs_meta_h')) + '</h3><ul class="mc-docs-meta-list"><li>' + escHtmlGlobal(T('docs_meta_version')) + ': ' + escHtmlGlobal(meta.version || '—') + '</li><li>' + escHtmlGlobal(T('docs_meta_updated')) + ': ' + escHtmlGlobal(meta.lastUpdated || '—') + '</li><li>' + escHtmlGlobal(T('docs_meta_lang')) + ': ' + escHtmlGlobal(meta.defaultLanguage || 'zh-TW') + '</li><li>' + escHtmlGlobal(T('docs_meta_status')) + ': ' + escHtmlGlobal(T('docs_status_' + (meta.status || 'published'))) + '</li></ul>'
    );
    if (isEd) {
      html.push(
        '<p class="subline">' + escHtmlGlobal(T('docs_meta_editable')) + '</p><div class="actions" style="margin-top:8px;flex-wrap:wrap;gap:8px"><button type="button" class="soft-btn" onclick="mcOpenDocumentationEditor()">' + escHtmlGlobal(T('docs_open_editor')) + '</button></div>'
      );
    }
    html.push('</div></section>');

    html.push('<section class="mc-docs-sec" id="mcDocFeedback">');
    html.push(
      '<div class="mc-docs-feedback card panel"><h3>' + escHtmlGlobal(T('docs_fb_h')) + '</h3><p class="subline">' + escHtmlGlobal(T('docs_fb_p')) + '</p><div class="actions" style="margin-top:10px;flex-wrap:wrap;gap:8px">'
    );
    html.push('<button type="button" class="soft-btn" onclick="mcDocsIssue()">' + escHtmlGlobal(T('docs_fb_report')) + '</button>');
    html.push('<button type="button" class="primary-btn" onclick="switchSection(\'community\')">' + escHtmlGlobal(T('docs_fb_comm')) + '</button>');
    html.push('<button type="button" class="soft-btn" onclick="mcDocsContact()">' + escHtmlGlobal(T('docs_fb_admin')) + '</button>');
    html.push('</div></div></section>');

    /* CMS tutorial list from app */
    html.push('<section class="mc-docs-sec" id="mcDocsCmsSection"><h2 class="mc-docs-sec-t">' + escHtmlGlobal(T('docs_cms_articles_h')) + '</h2><p class="subline">' + escHtmlGlobal(T('docs_cms_articles_p')) + '</p><div id="tutorialList" class="tutorial-list mc-docs-tutorial-list"></div></section>');

    html.push('</div>');

    root.innerHTML = html.join('');
    wire_(root, b, state);
    if (global.renderTutorials) global.renderTutorials();
  }

  function wire_(root, b, appState) {
    var onCat = function (c) {
      return function (e) {
        e.preventDefault();
        _view.cat = c;
        _view.page = null;
        mount(root);
        root.querySelector('.mc-docs-core').scrollIntoView({ block: 'start' });
      };
    };
    root.querySelectorAll('[data-mc-doc-cat]').forEach(function (n) {
      n.onclick = onCat(n.getAttribute('data-mc-doc-cat'));
    });
    root.querySelectorAll('[data-mc-page-open]').forEach(function (n) {
      n.onclick = function (e) {
        e.preventDefault();
        _view.page = n.getAttribute('data-mc-page-open');
        var p = b.pages.filter(function (x) { return x.id === _view.page; })[0];
        _view.cat = p && p.category ? p.category : _view.cat;
        mount(root);
        var a = document.getElementById('mc-doc-article') || document.querySelector('.mc-docs-article');
        if (a) a.scrollIntoView({ block: 'start' });
      };
    });
    var sIn = document.getElementById('mcDocsSearch');
    if (sIn) {
      sIn.oninput = function () {
        _view.q = sIn.value;
      };
    }
    var sBt = document.getElementById('mcDocsSearchBtn');
    if (sBt) {
      sBt.onclick = function () {
        var q = sIn && sIn.value;
        if (!q || !String(q).trim()) {
          document.getElementById('mcDocsSearchResults').style.display = 'none';
          return;
        }
        var res = searchBundle(b, _view.q, (appState && appState.lang) || 'zh-TW');
        var T = (global.t && function (k) { return global.t(k); }) || function (k) { return k; };
        var box = document.getElementById('mcDocsSearchResults');
        if (!res.length) {
          box.style.display = 'block';
          box.innerHTML = '<p class="mc-docs-muted">' + (global.escapeHtml && global.escapeHtml(T('docs_no_results') || 'No results')) + '</p>';
          return;
        }
        box.style.display = 'block';
        box.innerHTML = res
          .map(function (r) {
            if (r.page) {
              return (
                '<div class="mc-docs-res"><strong>' + escHtmlGlobal(pick_(r.page.title, (appState && appState.lang) || 'zh-TW')) + '</strong><p class="subline">' + escHtmlGlobal(r.snippet) + '</p><button class="small-btn" type="button" data-goto-page="' + escHtmlGlobal(r.page.id) + '">' + (global.escapeHtml && global.escapeHtml(T('docs_open') || 'Open')) + '</button></div>'
              );
            }
            if (r.faq) {
              return '<div class="mc-docs-res"><em>FAQ</em> — ' + (global.escapeHtml && global.escapeHtml(pick_(r.faq.q, (appState && appState.lang) || 'zh-TW'))) + '</div>';
            }
            return '<div class="mc-docs-res">— ' + (global.escapeHtml && global.escapeHtml((r.glossary && pick_(r.glossary.term, (appState && appState.lang) || 'zh-TW')) || '')) + '</div>';
          })
          .join('');
        box.querySelectorAll('[data-goto-page]').forEach(function (btn) {
          btn.onclick = function () {
            _view.page = btn.getAttribute('data-goto-page');
            var pg = (b.pages || []).filter(function (x) { return x.id === _view.page; })[0];
            _view.cat = (pg && pg.category) || _view.cat;
            mount(root);
          };
        });
      };
    }
    var topB = document.getElementById('mcDocsTop');
    if (topB) {
      topB.onclick = function () { root.querySelector('.mc-docs-hero').scrollIntoView({ block: 'start' }); };
    }
  }

  global.MCDocumentation = {
    SV: SV,
    getDefaultBundle: getDefaultBundle,
    getBundle: getBundle,
    merge: mergeBundle_,
    mount: mount,
    _view: _view,
    search: searchBundle
  };

  global.mcOpenDocumentationEditor = function () {
    if (typeof global.switchAdminTab === 'function') {
      global.switchAdminTab('content');
    }
    if (global.toast) {
      global.toast((global.t && global.t('docs_toast_open_cs')) || 'Open Content Studio → documentation keys in server settings, or use CMS knowledge articles for extra pages.');
    }
  };
  global.mcDocsIssue = function () {
    if (global.toast) global.toast((global.t && global.t('docs_toast_coming')) || 'Report flow: contact your administrator for now.');
  };
  global.mcDocsContact = function () {
    if (typeof global.switchAdminTab === 'function' && (typeof global.isAdminSession === 'function' && global.isAdminSession())) {
      global.switchAdminTab('overview');
    } else {
      if (global.toast) global.toast((global.t && global.t('docs_toast_coming')) || 'Contact the institution administrator.');
    }
  };
})(typeof window !== 'undefined' ? window : this);
