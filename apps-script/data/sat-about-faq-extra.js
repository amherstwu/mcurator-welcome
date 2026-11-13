/**
 * Additional SAT FAQ items — appended to faqGroups in sat-about-content.js.
 * Does not modify existing Q&A; extends each category with detailed entries.
 */
(function (global) {
  'use strict';

  function p(isZh, zh, en) {
    return isZh ? zh : en;
  }

  function faqItem(isZh, qZh, qEn, paraPairs, bulletPairs) {
    var item = {
      q: p(isZh, qZh, qEn),
      paragraphs: paraPairs.map(function (pair) { return p(isZh, pair[0], pair[1]); }),
    };
    if (bulletPairs && bulletPairs.length) {
      item.bullets = bulletPairs.map(function (pair) { return p(isZh, pair[0], pair[1]); });
    }
    return item;
  }

  global.MC_SAT_appendFaqExtras = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var extras = [
      /* A — basics */
      [
        faqItem(isZh,
          'SAT 可以登錄哪些類型的科學資產？',
          'What types of scientific assets can be registered as SAT?',
          [
            [
              'SAT 可登錄之資產類型，依平台工作流與賣方／機構授權而定，常見包括：博物館或研究機構標本（昆蟲、植物、化石、礦物等）、田野憑證（voucher）、數位圖版與掃描、教學圖版、可引用之多樣性紀錄，以及附結構化後設資料之研究物件。每一類型可能有不同必填欄位與驗證要求。',
              'Registerable asset types depend on platform workflow and seller or institutional authority—commonly museum or research specimens (insects, plants, fossils, minerals, etc.), field vouchers, digital plates and scans, teaching plates, citable biodiversity records, and research objects with structured metadata. Each type may have different required fields and verification requirements.',
            ],
            [
              '並非所有生物材料、古生物標本或影像都適合公開上架。受保護物種、文化資產、來源不明標本、未經授權之機構典藏影像，或可能導致棲地暴露之紀錄，平台得拒絕或要求限制公開。SAT 登錄本身不表示該資產可在任何司法管轄區自由交易或出口。',
              'Not all biological material, paleontological specimens, or images suit public listing. Protected species, cultural heritage, unknown-provenance specimens, unauthorized institutional imagery, or records that could expose habitats may be rejected or require restricted disclosure. SAT registration does not mean the asset may be freely traded or exported in every jurisdiction.',
            ],
            [
              '上架前，賣方應確認資產類型與 listing 模板一致，並如實選擇是否含實體、授權類型與資料來源。若同一標本同時存在館藏紀錄、GBIF 資料與自行拍攝影像，應在 provenance 中說明各來源關係，避免買方誤解資料範圍。',
              'Before listing, sellers should match asset type to the listing template and accurately select physical inclusion, license type, and data sources. When a specimen has collection records, GBIF data, and self-captured imagery, provenance should explain how sources relate so buyers do not misunderstand scope.',
            ],
            [
              '若您不確定某類標本是否可登錄，應先諮詢機構典藏或法遵人員，而非先上架再補文件。平台 FAQ 不提供個案進出口或保育法遵結論。',
              'If unsure whether a specimen type may be listed, consult institutional curation or compliance staff first—not list first and document later. This FAQ does not provide case-specific import/export or conservation conclusions.',
            ],
          ]),
        faqItem(isZh,
          '誰可以建立、上架或管理 SAT？',
          'Who can create, list, or manage an SAT?',
          [
            [
              '一般情形下，對資產具合法授權之個人收藏家、研究者、攝影者、教師、民間博物館或正式研究機構，得在平台建立 SAT 並上架 listing。機構代表上架者，應具備內部核准權限，並能代表機構提供或限制對外授權。',
              'Generally, individual collectors, researchers, photographers, educators, private museums, or formal research institutions with lawful authority over an asset may create SATs and publish listings. Institutional representatives need internal approval and authority to grant or restrict external licenses on the institution\'s behalf.',
            ],
            [
              '買方成交後，可能成為該 SAT 之數位保管者或授權持有人（依 listing 而定），但不當然取得再上架或替他人管理之平台權限，除非 listing 或正式規則允許轉讓管理權。任何帳號不得冒用機構名義或偽造 curator 身份。',
              'After purchase, buyers may become digital custodians or license holders (per listing) but do not automatically gain rights to relist or manage on others\' behalf unless the listing or formal rules allow management transfer. Accounts must not impersonate institutions or forge curator identity.',
            ],
            [
              '平台可能對新賣家、高價 listing、敏感物種或跨境交易實施額外審查、限額或人工覆核。此為風險控管，不代表平台對賣方資格做終局法律認定；主管機關或權利人仍可能另提出異議。',
              'The platform may apply extra review, limits, or manual approval for new sellers, high-value listings, sensitive species, or cross-border deals—risk control, not final legal qualification of sellers; authorities or rights holders may still object separately.',
            ],
            [
              '若帳號由多人共用（例如實驗室或館員共用後台），應在機構內部分工誰負責上架、誰負責 provenance 更新，避免未授權修改或互相覆寫紀錄。',
              'If accounts are shared (e.g., lab or staff backends), institutions should assign internally who lists, who updates provenance, to avoid unauthorized edits or overwriting each other\'s records.',
            ],
          ]),
      ],
      /* B — buyer */
      [
        faqItem(isZh,
          '可以只購買數位紀錄、不要實體標本嗎？',
          'Can I buy only the digital record without the physical specimen?',
          [
            [
              '可以，且為最常見情境之一。許多 listing 僅提供 SAT ID、標本護照、元資料與授權範圍內的使用權，賣方或機構仍保留實體標本之保管權與所有權（除非 listing 另有約定）。',
              'Yes—and it is one of the most common scenarios. Many listings provide only SAT ID, passport, metadata, and licensed usage while the seller or institution retains physical custody and ownership (unless the listing states otherwise).',
            ],
            [
              '購買前請確認 listing 未標示「含實體標本」或 physical specimen binding。若標題或影像容易讓人誤以為含實體，但授權頁未載明，應先向賣方確認，避免以數位價格誤購實體交割期待。',
              'Before purchase, confirm the listing does not state physical specimen inclusion or physical specimen binding. If title or imagery suggests physical delivery but the license tab is silent, confirm with the seller first—avoid expecting physical handover at a digital-only price.',
            ],
            [
              '僅購買數位層並不表示可無限制公開散布原始高解析檔案，或將資料用於 listing 未允許之商用。授權仍可能限制下載、改作、再授權或公開 GPS 精度。',
              'Digital-only purchase does not mean unlimited public redistribution of original high-resolution files or use beyond the listing license. Licenses may still restrict download, adaptation, sublicensing, or public GPS precision.',
            ],
            [
              '若您需要實體標本做進一步研究或鑑定，應另尋含實體之 listing，或與賣方／機構另議借展、採樣或參觀安排；SAT 數位交易不自動產生實體借出權。',
              'If you need the physical specimen for further study or appraisal, seek a listing with physical inclusion or negotiate loan, sampling, or visit arrangements separately—a digital SAT deal does not automatically grant physical loan rights.',
            ],
          ]),
        faqItem(isZh,
          '購買後能否再分享、改作或嵌入第三方系統？',
          'After purchase, may I share, adapt, or embed SAT data in third-party systems?',
          [
            [
              '是否允許再分享、改作、API 嵌入、LMS／CMS 整合或資料庫匯入，完全取決於 listing 授權與正式條款。即使已付費，也不當然取得「可任意再散布」或「可無限 API 轉售」之權利。',
              'Whether resharing, adaptation, API embedding, LMS/CMS integration, or database import is allowed depends entirely on listing license and formal terms. Payment alone does not grant arbitrary redistribution or unlimited API resale rights.',
            ],
            [
              '學術合作中，常見做法是團隊內部引用 SAT ID 並遵守授權；若需對外提供副本、上傳至 GitHub、Zenodo 或商業 SaaS，應逐項確認是否允許。超出授權之公開散布可能侵害著作權或違反資料庫權利。',
              'In academic collaboration, citing SAT ID within a team under license is common; providing copies externally, uploading to GitHub, Zenodo, or commercial SaaS requires item-by-item confirmation. Public distribution beyond license may infringe copyright or database rights.',
            ],
            [
              '改作（例如去背、調色、3D 重建、AI 訓練素材化）尤其需要 listing 明示允許。未允許之改作或模型訓練，即使標註來源，仍可能構成侵權或違反賣方政策。',
              'Adaptation (background removal, color grading, 3D reconstruction, AI training materialization) especially requires explicit listing permission. Adaptation or model training without permission may infringe even with attribution.',
            ],
            [
              '若需嵌入博物館官網、研究計畫平台或付費課程，建議保留 SAT ID 連結、授權類型與取得日期，並在發布前取得賣方書面確認（對高風險商用尤其重要）。',
              'For embedding in museum sites, research platforms, or paid courses, retain SAT ID link, license type, and access date, and obtain seller written confirmation before publish—especially for high-risk commercial use.',
            ],
          ]),
      ],
      /* C — seller */
      [
        faqItem(isZh,
          '為什麼有些 listing 沒有出現在市集 catalog 上？',
          'Why do some listings not appear in the marketplace catalog?',
          [
            [
              '市集公開 catalog 通常僅顯示通過基本政策檢查之 listing，例如具 hero-passport 真實照片、必要科學欄位達最低完整度、未命中高風險下架規則，且賣方已將狀態設為公開。draft、審核中、暫停或賣方自行隱藏之項目，可能僅供賣方預覽。',
              'The public catalog usually shows listings passing basic policy checks—real hero-passport photo, minimum field completeness, no high-risk delist rules, and seller-set public status. Drafts, under review, suspended, or seller-hidden items may be seller-preview only.',
            ],
            [
              '若缺少真實標本影像、使用占位圖、或影像與授權狀態不一致，listing 可能被拒絕公開，以避免誤導買方。機構尚未核准對外影像時，應先完成內部核准再上架公開。',
              'Missing real specimen imagery, placeholders, or image–license inconsistency may block public listing to avoid misleading buyers. When institutions have not approved external imagery, obtain internal approval before going public.',
            ],
            [
              '敏感物種、精確 GPS 過度揭露或合規疑慮，也可能導致僅限白名單或審核者可見，而不出現在一般 catalog。賣方應在後台確認 listing 狀態與公開層級設定。',
              'Sensitive species, excessive GPS disclosure, or compliance concerns may restrict visibility to allowlists or reviewers rather than the general catalog. Sellers should verify listing status and disclosure tier in the dashboard.',
            ],
            [
              '示範環境中，部分測試 listing 可能刻意不公開或隨版本重置。正式環境之上架規則與審核時程將另行公告。',
              'In demo, some test listings may stay non-public or reset between versions. Production listing rules and review timelines will be announced separately.',
            ],
          ]),
        faqItem(isZh,
          '機構 deaccession 或對外授權要注意什麼？',
          'What should institutions note about deaccession or external licensing?',
          [
            [
              '博物館或研究機構若計畫透過 SAT 對外授權影像、元資料或（在極少數且合規情形下）移轉保管權，應先完成內部 deaccession、典藏委員會或館長核准，並確認不違反捐贈協議、政府撥款條件或國際貸借協定。',
              'Museums or research institutions planning external licensing of imagery or metadata via SAT—or in rare compliant cases custody transfer—should complete internal deaccession, committee, or director approval first and confirm no breach of donation agreements, grant terms, or international loan accords.',
            ],
            [
              '對外授權不等同 deaccession：許多 listing 僅授權數位使用，實體仍留館內。SAT 上應清楚區分「數位授權」與「實體移出／移轉」，避免買方誤解為已 deaccession。',
              'External licensing is not deaccession: many listings license digital use only while specimens remain in-house. SAT should clearly separate digital licensing from physical removal or transfer so buyers do not assume deaccession occurred.',
            ],
            [
              '若 deaccession 後標本將進入私人收藏或跨境移動，仍須符合 CITES、文化資產、稅務與機構公開程序。SAT provenance 應記錄 deaccession 決議摘要、日期與核准者（在不揭露不必要內部機密前提下）。',
              'If post-deaccession specimens enter private collections or cross borders, CITES, heritage, tax, and institutional public-process rules still apply. SAT provenance should log deaccession decision summary, date, and approver (without unnecessary internal secrets).',
            ],
            [
              '機構應指定單一對外窗口管理 SAT 上架與授權條款，避免不同部門發布衝突授權。平台可協助展示授權摘要，但不代替機構內部典藏治理決策。',
              'Institutions should designate a single external contact for SAT listings and license terms to avoid conflicting licenses from different departments. The platform can display license summaries but does not replace internal collection governance.',
            ],
          ]),
      ],
      /* D — verification */
      [
        faqItem(isZh,
          '驗證狀態被撤回或降級時會怎樣？',
          'What happens when verification is revoked or downgraded?',
          [
            [
              '若發現資料與徽章不符、存在重大錯誤、疑似偽造 provenance 或違反上架政策，平台可能撤回 Curator verified、SAT graded、Provenance complete 等狀態，或降級完整度與公開層級。listing 頁面應更新說明，讓買方看見最新狀態。',
              'If data mismatches badges, material errors exist, provenance is suspected fake, or listing policy is violated, the platform may revoke Curator verified, SAT graded, Provenance complete, or downgrade completeness and disclosure tiers. Listing pages should update so buyers see current state.',
            ],
            [
              '撤回或降級不等同判定賣方欺詐或買方自動取得退款；是否進入爭議流程，仍視錯誤嚴重性、是否影響已成交交易與正式條款。已成交買方可能收到通知，以便自行評估是否申訴。',
              'Revocation or downgrade is not automatic fraud finding or buyer refund entitlement; dispute flows depend on severity, impact on settled deals, and formal terms. Settled buyers may be notified to assess whether to appeal.',
            ],
            [
              '賣方通常可透過補件、更正 provenance 事件或重新申請覆核，恢復部分驗證里程碑。善意修正應留下紀錄，而非要求刪除歷史徽章痕跡。',
              'Sellers may restore some milestones via supplements, provenance corrections, or re-review applications. Good-faith fixes should be recorded—not demands to erase historical badge traces.',
            ],
            [
              '引用者與買方不應僅依過去截圖之徽章狀態做決策；應以目前 SAT ID 解析結果與 listing 快照為準。驗證狀態可能隨時間變動，這是正常治理流程。',
              'Citers and buyers should not rely on old screenshots of badges; use current SAT ID resolution and listing snapshots. Verification state may change over time—that is normal governance.',
            ],
          ]),
        faqItem(isZh,
          'SAT 資料如何與 GBIF、Darwin Core 等標準對應？',
          'How does SAT data map to GBIF, Darwin Core, and similar standards?',
          [
            [
              'SAT 結構化欄位設計上可對照 Darwin Core（dwc:）等生物多樣性常用欄位，例如 scientificName、country、eventDate、recordedBy、catalogNumber 等，以便與 GBIF、館藏匯出或研究資料管線整合。實際對應程度依個別 SAT 與匯出格式而定。',
              'SAT structured fields are designed to align with Darwin Core (dwc:) and similar biodiversity fields—scientificName, country, eventDate, recordedBy, catalogNumber, etc.—for integration with GBIF, collection exports, or research pipelines. Exact mapping depends on each SAT and export format.',
            ],
            [
              '自 GBIF 或第三方資料庫匯入之紀錄，應保留 upstream 引用與 dataset DOI／URL，並確認賣方是否有權提供 listing 所載授權。SAT 不能取代原始資料集之使用條款。',
              'Records imported from GBIF or third-party databases should retain upstream citations and dataset DOI/URL, and sellers must confirm authority to grant the listing license. SAT does not replace original dataset terms of use.',
            ],
            [
              '匯出 QR、CSV 或 JSON 時，可能包含 SAT 專屬欄位（SAT ID、驗證摘要、授權標籤）與標準欄位並存。下游系統應同時解析兩者，避免只匯入部分欄位而遺失授權或 provenance 限制。',
              'QR, CSV, or JSON exports may include SAT-specific fields (SAT ID, verification summary, license labels) alongside standard fields. Downstream systems should parse both—avoid importing partial fields and losing license or provenance limits.',
            ],
            [
              '標準對照有助於科學互通，但不表示 SAT 已自動通過 GBIF 或期刊之資料審查。發表或正式典藏前，仍應依目標平台要求補充欄位與引用格式。',
              'Standard alignment aids interoperability but does not mean SAT automatically passed GBIF or journal data review. Before publication or formal accession, supplement fields and citations per target platform requirements.',
            ],
          ]),
      ],
      /* E — physical */
      [
        faqItem(isZh,
          '化石、考古遺物或文化資產有何特殊限制？',
          'What special limits apply to fossils, archaeological finds, or cultural heritage?',
          [
            [
              '台灣《文化資產保存法》等規定，對古生物化石、考古遺物、指定或暫定古蹟相關標本，可能在發掘、移出、買賣、出口或公開販售上有許可、申報或禁止要求。SAT 登錄不取代主管機關程序，也不表示已獲合法交易核准。',
              'Taiwan\'s Cultural Heritage Preservation Act and similar rules may require permits, reporting, or prohibit trade/export/public sale of fossils, archaeological finds, or designated heritage-related specimens. SAT registration does not replace authority procedures or imply lawful trade approval.',
            ],
            [
              '跨境交易還可能涉及來源國與目的地國之出口禁令、UNESCO 相關框架、或機構 deaccession 政策。買賣雙方應在付款前自行查核雙方法規與文件鏈，必要時諮詢律師或文化資產顧問。',
              'Cross-border deals may involve export bans in source or destination countries, UNESCO-related frameworks, or institutional deaccession policy. Parties should verify both jurisdictions and document chains before payment—consult lawyers or heritage advisors when needed.',
            ],
            [
              'listing 應如實標示是否為複製品、教學模型、合法來源之收藏級標本，或受管制之真品。將教學複製品誤標為受保護真品，可能構成重大誤導並觸發下架或爭議。',
              'Listings should truthfully state replicas, teaching models, legally sourced collectibles, or regulated authentic specimens. Mislabeling replicas as protected authentic items may materially mislead and trigger delisting or disputes.',
            ],
            [
              '平台對文化資產與化石類 listing 可能採更嚴格審查或要求補充來源文件。SAT 不能使受管制標本自動合法化；雙方不得僅因完成數位交易，即假設可合法出口或公開販售。',
              'The platform may apply stricter review or require supplemental provenance for heritage and fossil listings. SAT does not automatically legalize regulated specimens—parties must not assume lawful export or public sale from digital checkout alone.',
            ],
          ]),
        faqItem(isZh,
          '《名古屋議定書》ABS 義務與 SAT 有何關係？',
          'How does Nagoya Protocol ABS relate to SAT?',
          [
            [
              '《生物多樣性公約》之《名古屋議定書》要求利用遺傳資源與相關傳統知識時，在許多情況下履行 ABS（Access and Benefit-sharing）：事先知情同意（PIC）與共同商定條件（MAT）。若 SAT 涉及可提取遺傳物質之標本或相關數位資料之跨境研究、商業化，可能觸發 ABS 義務。',
              'The Nagoya Protocol under the CBD often requires ABS (Access and Benefit-sharing)—PIC and MAT—when utilizing genetic resources and associated traditional knowledge. If an SAT involves specimens or related digital data for cross-border research or commercialization of extractable genetic material, ABS obligations may apply.',
            ],
            [
              'SAT 可記錄 ABS 盡職調查摘要、MAT 參考編號或 PIC 狀態說明，但平台不代辦 ABS 協商、不代替各國主管機關判斷。交易雙方與研究機構應自行完成合規流程。',
              'SAT may record ABS due-diligence summaries, MAT reference numbers, or PIC status descriptions, but the platform does not conduct ABS negotiations or substitute national authority determinations. Parties and research institutions must complete compliance themselves.',
            ],
            [
              '數位授權與實體標本移動可能觸發不同層級之 ABS 或出口管制；不應假設「只買影像」即完全無 ABS 風險。高風險研究或商用前，應諮詢專門顧問。',
              'Digital licensing and physical movement may trigger different ABS or export-control layers—do not assume image-only purchase is ABS-risk-free. Consult specialists before high-risk research or commercial use.',
            ],
            [
              '若 listing 未載明 ABS 或遺傳資源使用限制，買方仍須自行評估用途；不得僅因 SAT 未提及 ABS，即推論可任意進行商業化基因研究或再授權。',
              'If listings omit ABS or genetic-resource use limits, buyers must still assess use cases—do not infer unrestricted commercial genetic research or sublicensing merely because SAT is silent on ABS.',
            ],
          ]),
        faqItem(isZh,
          '實體標本驗收（acceptance）應如何進行？',
          'How should physical specimen acceptance be performed?',
          [
            [
              '買方簽收實體標本前，建議依 listing 與合約約定進行驗收：核對 SAT ID、學名、數量、保存狀態、包裝完整性、附帶文件（許可副本、館號標籤、採集資訊）是否齊備。高價或易損標本宜採開箱錄影與照片紀錄。',
              'Before signing for physical specimens, accept per listing and contract: verify SAT ID, scientific name, quantity, condition, packaging integrity, and accompanying documents (permit copies, accession labels, collection info). High-value or fragile items warrant unboxing video and photos.',
            ],
            [
              '驗收標準應在付款前與賣方書面確認，例如：允許多少比例之標本損傷、缺件、蟲蛀或修復痕跡；不符時之補寄、部分退款或終止交割流程。平台可提供爭議入口，但不代替雙方約定之驗收規則。',
              'Acceptance criteria should be confirmed in writing before payment—tolerances for damage, missing parts, pest damage, or repair marks; remedies for mismatch (reshipment, partial refund, termination). The platform may offer dispute entry but does not replace agreed acceptance rules.',
            ],
            [
              '若涉及 CITES 或報關，驗收還應包括許可號碼、封條、標示與申報內容是否一致。發現不符時，應保留證據並在合理時間內通知賣方與（若適用）平台，而非先簽收再事後主張重大不符。',
              'For CITES or customs, acceptance includes permit numbers, seals, labels, and declaration consistency. On mismatch, preserve evidence and notify seller and (if applicable) the platform within reasonable time—do not sign first and claim major mismatch later.',
            ],
            [
              '驗收完成後，雙方可透過 provenance 事件記錄 custody 移轉日期與驗收結果摘要，供日後引用或爭議使用。SAT 記錄是輔助證據，不代替正式合約或物流單據。',
              'After acceptance, parties may log custody transfer date and acceptance summary via provenance events for future citation or disputes. SAT records assist as evidence—they do not replace formal contracts or carrier documents.',
            ],
          ]),
      ],
      /* F — payments */
      [
        faqItem(isZh,
          '是否有托管（escrow）或分期付款？',
          'Is escrow or installment payment available?',
          [
            [
              '示範環境不提供真實 escrow、分期付款或銀行托管帳戶功能；checkout 流程僅供 UI 與邏輯測試。正式上線後是否提供 escrow、分期、提領週期或賣家結算規則，將於服務條款與賣家協議中公告。',
              'The demo offers no real escrow, installments, or escrow bank accounts—checkout is for UI and logic testing. Whether production offers escrow, installments, payout cycles, or seller settlement rules will be announced in terms and seller agreements.',
            ],
            [
              '若正式環境採 escrow，通常用於降低「已付款但未交付授權／實體」或「已交付但款項爭議」之風險；具體釋放條件（買方確認、時間鎖、爭議暫停）依產品設計與條款，平台不保證所有交易均強制 escrow。',
              'If production uses escrow, it typically reduces risk of paid-but-undelivered license/physical or delivered-but-disputed payment; release conditions (buyer confirm, time locks, dispute holds) follow product design and terms—the platform does not guarantee escrow on every deal.',
            ],
            [
              '高價含實體交易，買賣雙方即使平台未提供 escrow，仍可在平台外另簽托管或律師見證合約，但須自行評估成本與可執行性；平台不對平台外安排負責。',
              'For high-value physical deals, parties may arrange external escrow or lawyer-supervised contracts even without platform escrow—assess cost and enforceability themselves; the platform is not responsible for off-platform arrangements.',
            ],
            [
              '任何聲稱「平台官方 escrow 帳戶」但不在結帳頁或正式公告中出現之匯款指示，應視為詐騙風險並通報平台。',
              'Any claimed official escrow account not shown on checkout or formal notices should be treated as fraud risk and reported to the platform.',
            ],
          ]),
        faqItem(isZh,
          '信用卡 chargeback 或銀行爭議如何處理？',
          'How are credit-card chargebacks or bank disputes handled?',
          [
            [
              '若正式環境支援信用卡等支付方式，買方可能依發卡行規則申請 chargeback；賣方可能收到銀行或支付服務商之爭議通知。平台可能在正式條款中說明 chargeback 與內部爭議流程之關係，以及暫停提領或保全紀錄之時機。',
              'If production supports cards, buyers may file chargebacks per issuer rules; sellers may receive dispute notices from banks or payment processors. Formal terms may explain how chargebacks relate to internal disputes and when payouts are held or records preserved.',
            ],
            [
              'chargeback 理由若為「未收到商品／服務」或「與描述不符」，平台可能要求雙方提供 listing 快照、交付紀錄、授權開通時間、物流證明或通訊紀錄。數位授權已開通且買方已下載之案件，處理方式可能與實體未寄出不同。',
              'For chargeback reasons like non-receipt or not-as-described, the platform may request listing snapshots, delivery logs, license activation time, shipping proof, or communications. Cases where digital licenses were activated and downloaded may differ from undelivered physical goods.',
            ],
            [
              '惡意 chargeback 或濫用爭議可能導致帳號限制；賣方亦不得偽造交付紀錄。平台協調不等同銀行或卡組織之終局裁定。',
              'Abusive chargebacks or dispute abuse may lead to account restrictions; sellers must not forge delivery records. Platform coordination is not the bank or card network\'s final decision.',
            ],
            [
              '鏈上付款通常不適用傳統 chargeback；爭議處理更依正式條款、鏈上紀錄與雙方證據。選擇付款方式前，買賣雙方應理解不可逆性與救濟差異。',
              'On-chain payments usually lack traditional chargebacks; disputes rely more on formal terms, on-chain records, and party evidence. Understand irreversibility and remedy differences before choosing payment rails.',
            ],
          ]),
      ],
      /* G — privacy */
      [
        faqItem(isZh,
          '台灣個資法與 GDPR 如何適用於 SAT 資料？',
          'How do Taiwan PDPA and GDPR apply to SAT data?',
          [
            [
              'SAT 欄位可能包含個人資料（採集者姓名、聯絡方式、精確 GPS、可間接識別之組合），在台灣可能受《個人資料保護法》規範，要求告知、特定目的、安全維護與當事人權利行使。涉及歐盟資料主體或向歐盟提供服務時，可能另適用 GDPR。',
              'SAT fields may include personal data (collector names, contacts, precise GPS, indirectly identifying combinations) subject to Taiwan PDPA—notice, purpose limitation, security, and data-subject rights. GDPR may also apply when EU data subjects are involved or services target the EU.',
            ],
            [
              '賣方上架時應最小化公開個資，依機構政策做模糊化、假名化或延後公開。買方取得資料後，亦負有依授權與隱私法規使用之義務，不得重新識別已匿名化之採集者或還原受保護座標。',
              'Sellers should minimize public personal data when listing—obfuscate, pseudonymize, or delay disclosure per institutional policy. Buyers must use data per license and privacy law—must not re-identify anonymized collectors or reconstruct protected coordinates.',
            ],
            [
              '平台正式環境將適用 MCurator 隱私政策，說明資料控制者、處理目的、保存期間、跨境傳輸與申訴管道。FAQ 不取代隱私政策全文。',
              'Production will follow MCurator privacy policy on controllers, purposes, retention, cross-border transfer, and complaint channels. This FAQ does not replace the full privacy policy.',
            ],
            [
              '示範環境請勿輸入真實個資；若誤輸入，應依正式政策申請刪除或遮蔽測試資料。科學追溯需求與個資刪除請求衝突時，可能採欄位遮蔽而非刪除整條 provenance。',
              'Do not enter real personal data in demo; if entered, request deletion or redaction per formal policy. When scientific traceability conflicts with erasure requests, field redaction may replace deleting entire provenance chains.',
            ],
          ]),
        faqItem(isZh,
          '研究者或媒體能否請求更精確的位置或採集者資訊？',
          'Can researchers or media request more precise locality or collector data?',
          [
            [
              '可能可以，但須逐案判斷：請求者應說明研究或報導目的、資料使用範圍、保存期限與是否再公開，並取得資料當事人／機構／賣方同意（若適用）。平台可能提供分級存取或審核工作流，但不保證必須提供精確 GPS。',
              'Possibly, case by case: requesters should state research or reporting purpose, use scope, retention, and republication plans, and obtain consent from data subjects, institutions, or sellers when applicable. The platform may offer tiered access or review workflows but does not guarantee precise GPS must be released.',
            ],
            [
              '對敏感物種、保育爭議物種或原住民相關傳統知識，機構可能依法或依倫理規範拒絕提供精確位置。媒體報導亦應避免揭露可導致盜獵或棲地破壞之資訊。',
              'For sensitive species, conservation-sensitive taxa, or indigenous traditional knowledge, institutions may refuse precise locality by law or ethics. Media should avoid disclosure enabling poaching or habitat harm.',
            ],
            [
              '即使獲准存取較精確資料，請求者仍須遵守 listing 授權與機構條件，不得超出同意範圍用於商業化或再散布。違反可能導致帳號限制與法律責任。',
              'Even with access to more precise data, requesters must stay within listing license and institutional conditions—no commercialization or redistribution beyond consent. Violations may lead to account restrictions and legal liability.',
            ],
            [
              '建議以正式申請表或機構資料申請流程提出請求，並保留批准紀錄，以便日後 provenance 與合規稽核。',
              'Use formal application forms or institutional data-request processes and retain approval records for future provenance and compliance audits.',
            ],
          ]),
      ],
      /* H — disputes */
      [
        faqItem(isZh,
          'B2C 消費爭議有哪些外部管道？',
          'What external channels exist for B2C consumer disputes?',
          [
            [
              '若交易適用台灣《消費者保護法》之 B2C 關係，消費者除平台內申訴外，可能向消保官、消費爭議調解委員會或消費者服務中心尋求協助；跨境 B2C 則可能涉及多地消費者保護規則，複雜度更高。',
              'Where Taiwan Consumer Protection Act B2C applies, consumers may use platform appeals plus consumer ombudsman, dispute mediation committees, or consumer service centers; cross-border B2C may involve multiple jurisdictions with higher complexity.',
            ],
            [
              '平台內爭議流程與外部消費爭議程序可能並行或互補，但不保證結果一致。平台之暫停交割或退款協調，不等同消保機關或法院之終局決定。',
              'Internal platform disputes and external consumer procedures may run in parallel or complement each other—outcomes are not guaranteed to match. Platform holds or refund coordination are not final consumer-authority or court decisions.',
            ],
            [
              '賣方若為企業或機構，應保留交易紀錄、listing 快照與溝通紀錄，以便應對申訴。買方亦應保留付款與交付證據。SAT 交易快照有助釐清授權範圍，但不代替法定申訴時限與程序。',
              'Business or institutional sellers should retain transaction records, listing snapshots, and communications for complaints. Buyers should keep payment and delivery proof. SAT snapshots clarify license scope but do not replace statutory deadlines and procedures.',
            ],
            [
              '涉及重大金額、跨境或文化資產爭議，建議雙方及早諮詢律師，而非僅依 FAQ 或客服郵件溝通。',
              'For material amounts, cross-border, or heritage disputes, both parties should consult lawyers early—not rely only on FAQ or support email.',
            ],
          ]),
        faqItem(isZh,
          '示範環境的紀錄能否作為法律證據？',
          'Can demo-environment records be used as legal evidence?',
          [
            [
              '示範環境中的 listing、checkout、交易、驗證與上鏈紀錄可能為 mock 或測試資料，一般不宜作為正式法律程序中之關鍵證據，亦不宜向第三方證明已成立真實交易或授權。',
              'Demo listings, checkout, transactions, verification, and on-chain records may be mock or test data—generally unsuitable as key evidence in formal legal proceedings or to prove real deals or licenses to third parties.',
            ],
            [
              '正式環境上線後，平台可能依服務條款保存交易快照、授權紀錄與申訴紀錄，供爭議處理或依法提供；可採性與證明力仍由法院、仲裁庭或主管機關依個案法規判斷，平台不預先保證證據效力。',
              'After production launch, the platform may preserve transaction snapshots, license records, and appeal logs per terms for disputes or lawful disclosure; admissibility and weight remain for courts, tribunals, or authorities case by case—the platform does not pre-guarantee evidentiary effect.',
            ],
            [
              '使用者不應將示範畫面截圖、測試 email 或內部預覽連結，作為對外宣稱「已購買／已授權」之唯一憑證。正式交易應以正式環境之 checkout 紀錄、收據與合約為準。',
              'Do not use demo screenshots, test emails, or internal preview links as sole proof of purchase or license to third parties. Formal transactions should rely on production checkout records, receipts, and contracts.',
            ],
            [
              '若需保全證據，應在爭議發生後盡快透過正式申訴管道提交，並自行保存原始檔案、物流單與第三方鑑定報告等獨立證據。',
              'To preserve evidence, submit via formal appeal channels promptly after disputes arise, and independently retain source files, shipping documents, and third-party appraisal reports.',
            ],
          ]),
      ],
    ];

    content.faqGroups.forEach(function (group, idx) {
      if (extras[idx] && extras[idx].length) {
        group.items = group.items.concat(extras[idx]);
      }
    });

    content.faqIntro.push(
      p(
        isZh,
        '以下 FAQ 依主題分為十九大類，並提供搜尋、分類導覽與風險標籤。台灣／美國／日本法律與跨境合規見「三法域法律」分類；平台風控見 R 類；第三方資料見 Q 類；爭議處理見 P 類。',
        'The FAQ below is organized into nineteen topics with search, category navigation, and risk labels. For Taiwan/US/Japan law and cross-border compliance, use the Tri-jurisdiction law chip; platform risk controls, section R; third-party data, section Q; disputes, section P.'
      )
    );
  };
})(typeof window !== 'undefined' ? window : this);
