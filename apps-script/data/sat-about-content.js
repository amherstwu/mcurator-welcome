/**
 * Bilingual SAT guide, FAQ, and legal copy for marketplace about page.
 */
(function (global) {
  'use strict';

  function pick(isZh, zh, en) {
    return isZh ? zh : en;
  }

  global.MC_SAT_getAboutContent = function (isZh) {
    isZh = !!isZh;
    var content = {
      title: pick(isZh, 'SAT 科學資產代幣 — 完整說明', 'Scientific Asset Tokens (SAT) — Full Guide'),
      subtitle: pick(
        isZh,
        '已驗證元資料、標本護照、來源履歷、授權與法律常見問答 — 完整參考',
        'Verified metadata, specimen passports, provenance, licensing & legal FAQ — full reference'
      ),
      lastUpdated: pick(isZh, '最後更新：2026-06-07', 'Last updated: 2026-06-07'),
      demoBanner: pick(
        isZh,
        '本頁與市集介面目前為產品示範（Mock）環境：無真實上鏈、無實際金流結算、元資料與驗證狀態僅供流程測試。正式上線前將另行公告適用之服務條款、隱私政策與交易規則。',
        'This page and the marketplace UI run in a product demo (mock) environment: no live on-chain settlement, no real payment processing, and metadata or verification states are for workflow testing only. Binding terms, privacy policy, and trading rules will be published before any production launch.'
      ),
      toc: pick(isZh, '目錄', 'Contents'),
      sections: [
        {
          id: 'overview',
          title: pick(isZh, '什麼是 SAT？', 'What is SAT?'),
          paragraphs: [
            pick(
              isZh,
              'SAT（Scientific Asset Token，科學資產代幣）是 MCurator 生態系中用於登錄、追溯與流通「科學資產」的數位身分框架。科學資產包括但不限於：博物館或研究機構標本、田野憑證（voucher）、數位圖版、化石與古生物教學圖版、植物標本掃描、可引用之多樣性紀錄，以及附帶結構化後設資料的研究物件。',
              'SAT (Scientific Asset Token) is MCurator\'s digital identity framework for registering, tracing, and circulating scientific assets. These include—but are not limited to—museum or research specimens, field vouchers, digital plates, fossil and paleontology teaching plates, botanical scans, citable biodiversity records, and research objects with structured metadata.'
            ),
            pick(
              isZh,
              '每一筆 SAT 擁有唯一 SAT ID，並可連結標本護照（Specimen Passport）、不可覆寫的來源事件（provenance）、保管權轉移紀錄、授權類型與（若賣家明示）實體標本移交條款。SAT 的設計核心是科學可追溯性與資料完整性，而非加密貨幣投機或金融商品包裝。',
              'Each SAT has a unique SAT ID and may link to a Specimen Passport, append-only provenance events, custody transfer records, license type, and—when explicitly stated by the seller—physical specimen transfer terms. SAT is designed for scientific traceability and data integrity, not crypto speculation or financial product packaging.'
            ),
          ],
          bullets: [
            pick(isZh, '唯一 SAT ID 與結構化科學後設資料', 'Unique SAT ID with structured scientific metadata'),
            pick(isZh, '標本護照與 QR／CSV／JSON 匯出（就緒度依個別資產）', 'Specimen passport with QR / CSV / JSON export (readiness varies per asset)'),
            pick(isZh, 'Append-only 來源履歷（provenance timeline）', 'Append-only provenance timeline'),
            pick(isZh, '明示授權範圍與使用權利', 'Explicit license scope and usage rights'),
          ],
        },
        {
          id: 'metadata',
          title: pick(isZh, '已驗證元資料', 'Verified metadata'),
          paragraphs: [
            pick(
              isZh,
              '「已驗證元資料」指在平台工作流中已通過最低完整度與一致性檢查的科學欄位集合，例如學名、分類階層、產地、採集或登錄日期、採集者（若公開）、影像連結、尺度標、驗證徽章與授權摘要。驗證代表資料就緒度里程碑，不代表學界定名之終局裁定。',
              '"Verified metadata" means scientific fields that passed minimum completeness and consistency checks in the platform workflow—e.g., scientific name, taxonomy, locality, dates, collector (if public), imagery links, scale bar, verification badges, and license summary. Verification marks readiness milestones, not final taxonomic authority.'
            ),
            pick(
              isZh,
              '完整度百分比（completeness）由規則引擎依必填欄位、影像品質與佐證文件計算，供買方快速評估資料可用性。館員可覆核並調整正式驗證狀態。',
              'Completeness percentages are rule-engine scores from required fields, image quality, and supporting documents so buyers can assess usability quickly. Curators may review and set official verification states.'
            ),
          ],
          bullets: [
            pick(isZh, '核心欄位：學名、SAT ID、類別、產地、保管者', 'Core fields: scientific name, SAT ID, category, locality, custodian'),
            pick(isZh, '影像與診斷：hero-passport 照片、尺度標、可選 EXIF／GPS（依隱私政策）', 'Imagery: hero-passport photo, scale bar, optional EXIF/GPS per privacy policy'),
            pick(isZh, '權利摘要：授權類型、是否可下載、是否含實體標本', 'Rights summary: license type, download flag, physical specimen binding'),
          ],
        },
        {
          id: 'passport',
          title: pick(isZh, '標本護照（Specimen Passport）', 'Specimen Passport'),
          paragraphs: [
            pick(
              isZh,
              '標本護照是 SAT 的「可攜式科學身分證」：以卡片或數位頁面呈現學名、產地、採集或登錄日期、保管者、驗證狀態、授權摘要與（若適用）實體標本綁定標示。護照可產生 QR 碼，供展覽、教室或研究引用時快速查詢對應 SAT 紀錄。',
              'The Specimen Passport is the portable scientific identity card for an SAT: a card or digital view with scientific name, locality, collection or registration date, custodian, verification status, license summary, and—where applicable—a physical specimen binding flag. Passports can expose QR codes for exhibition, classroom, or citation workflows.'
            ),
            pick(
              isZh,
              '護照影像與 hero-passport 照片代表該資產的教學或典藏級視覺憑證；若市集列表未顯示照片，表示該項目尚未提供可公開之 hero-passport 影像，不會以占位 SVG 或第三方圖庫替代。',
              'Passport imagery and hero-passport photos represent teaching- or collection-grade visual vouchers for the asset. Listings without a photo mean no public hero-passport image is available; placeholder SVGs or third-party stock images are not substituted.'
            ),
          ],
          bullets: [
            pick(isZh, '正面：標本影像、SAT ID、學名、驗證徽章', 'Front: specimen image, SAT ID, scientific name, verification badges'),
            pick(isZh, '背面：材質樣式、QR、匯出與引用欄位（示範）', 'Back: card material style, QR, export and citation fields (demo)'),
            pick(isZh, '與 Darwin Core / 館藏欄位對齊的匯出路徑（規劃中）', 'Export paths aligned with Darwin Core / collection fields (planned)'),
          ],
        },
        {
          id: 'provenance',
          title: pick(isZh, '來源履歷與保管權', 'Provenance & custody'),
          paragraphs: [
            pick(
              isZh,
              'Provenance（來源履歷）以時間軸方式記錄標本或數位資產生命週期中的關鍵事件：採集、入館、修復、數位化、SAT 鑄造（mint）、驗證、上架、成交與保管權轉移。事件一經寫入即為追加式（append-only），不得由一般使用者覆寫或刪除歷史，以維持稽核可讀性。',
              'Provenance records key lifecycle events in a timeline: collection, accession, preparation, digitization, SAT minting, verification, listing, settlement, and custody transfer. Events are append-only; ordinary users cannot rewrite or delete history, preserving audit readability.'
            ),
            pick(
              isZh,
              '「保管權（custody）」不等同於無限制的「所有權」：SAT 轉移代表平台紀錄中之數位身分與授權關係更新；涉及國家保護物種、出口許可、遺跡或化石法規、機構典藏政策時，仍須遵守適用法律與機構內規。',
              'Custody is not unlimited ownership: an SAT transfer updates the digital identity and license relationship on the platform. National protected species rules, export permits, heritage or fossil regulations, and institutional collection policies still apply.'
            ),
          ],
        },
        {
          id: 'rights',
          title: pick(isZh, '授權、使用權利與交易內容', 'Licensing, usage rights & what you acquire'),
          paragraphs: [
            pick(
              isZh,
              '每筆上架應在成交前明示授權類型（例如：學術引用、教育使用、展覽使用、商業授權或典藏級有限版本）。買方取得的是依該授權範圍可使用之數位紀錄與元資料權利，而非自動取得標本之完整著作權、無限制商業化權或科學鑑定保證。',
              'Each listing must state its license type before acquisition (e.g., academic citation, education, exhibition, commercial, or collector edition). Buyers receive usage rights to digital records and metadata within that license—not automatic full copyright, unlimited commercialization, or scientific warranty.'
            ),
          ],
          bullets: [
            pick(isZh, '通常包含：已驗證元資料之展示、依授權之引用與下載（若標示可下載）', 'Often included: display of verified metadata, citation and download per license when marked downloadable'),
            pick(isZh, '通常不包含：投資報酬、未標示之實體標本、運送／報關／CITES 代辦（除非另議）', 'Often excluded: investment return, unstated physical specimen, shipping / customs / CITES handling unless agreed separately'),
            pick(isZh, '賣家可選擇接受之付款方式（信用卡、匯款、穩定幣等）由賣家決定', 'Accepted payment methods (card, bank transfer, stablecoin, etc.) are chosen by the seller'),
          ],
        },
        {
          id: 'physical',
          title: pick(isZh, '實體標本與 CITES', 'Physical specimens & CITES'),
          paragraphs: [
            pick(
              isZh,
              '若上架標示「含實體標本（physical specimen binding）」，表示 SAT 成交時，數位 SAT 紀錄與實體標本之保管權應一併移交買方（或買方指定之受託保管人），除非 listing 或合約另有載明。運送、包裝、保險、海關申報、CITES 許可證申請、入館審查與長期保存條件，均須由交易雙方或各自委託之物流／法律顧問另行約定。',
              'When a listing states physical specimen binding, SAT settlement should transfer custody of both the digital SAT record and the physical specimen to the buyer (or their designated custodian) unless the listing or contract says otherwise. Shipping, packing, insurance, customs, CITES permits, accession review, and long-term storage must be agreed separately by the parties or their agents.'
            ),
            pick(
              isZh,
              '買賣雙方有義務自行確認物種是否受 CITES、IUCN 紅色名錄、國內野生動植物保護法、化石或文化資產法規等約束；平台示範環境不提供法律意見，也不保證任何跨國運送之合法性。',
              'Both parties must confirm whether species are subject to CITES, IUCN Red List status, domestic wildlife laws, fossil or cultural heritage rules, etc. The demo platform does not provide legal advice or guarantee cross-border legality.'
            ),
          ],
        },
        {
          id: 'verification',
          title: pick(isZh, '驗證、SAT-MGS 與館員審查', 'Verification, SAT-MGS & curator review'),
          paragraphs: [
            pick(
              isZh,
              '驗證狀態（如 Curator verified、SAT graded、Provenance complete）表示該資產在平台工作流中已達特定資料完整度或審查里程碑；不等同於第三方公證或學術期刊同儕審查。SAT-MGS（Marketplace Grading System）以規則引擎評估照片清晰度、診斷特徵、後設資料完整度等，產生系統建議等級；正式等級可由館員覆核。',
              'Verification labels (e.g., Curator verified, SAT graded, Provenance complete) mark workflow milestones on the platform; they are not third-party notarization or journal peer review. SAT-MGS applies rule-based scoring for photo clarity, diagnostic features, metadata completeness, etc.; official grades may be curator-reviewed.'
            ),
          ],
        },
        {
          id: 'payments',
          title: pick(isZh, '付款與結帳', 'Payments & checkout'),
          paragraphs: [
            pick(
              isZh,
              '賣家在上架時勾選可接受之付款方式，例如信用卡、銀行匯款、USDC／USDT／ETH 等。買方結帳時僅能選擇該 listing 允許之方式。示範環境中之付款為模擬流程，不會實際扣款或移轉加密資產。',
              'Sellers select accepted payment methods when listing—e.g., card, bank transfer, USDC / USDT / ETH. Buyers can only choose methods allowed for that listing. Payments in the demo are simulated; no real charges or crypto transfers occur.'
            ),
          ],
        },
        {
          id: 'roles',
          title: pick(isZh, '角色與責任', 'Roles & responsibilities'),
          paragraphs: [
            pick(
              isZh,
              '不同參與者在 SAT 生態中負有不同義務。以下為示範工作流中的典型分工；正式上線後可能依機構合約調整。',
              'Participants have different obligations in the SAT ecosystem. Below is typical demo workflow division; live launch may vary per institutional agreements.'
            ),
          ],
          bullets: [
            pick(isZh, '賣方／機構：資料正確性、授權明示、付款方式、實體移交條款', 'Seller / institution: data accuracy, license disclosure, payments, physical terms'),
            pick(isZh, '買方：遵守授權、自行確認法規、保管與引用 SAT ID', 'Buyer: honor license, confirm regulations, custody and citation of SAT ID'),
            pick(isZh, '館員／管理員：覆核驗證、SAT-MGS、爭議升級（示範）', 'Curator / admin: verification review, SAT-MGS, dispute escalation (demo)'),
          ],
        },
        {
          id: 'standards',
          title: pick(isZh, '資料標準與互通', 'Data standards & interoperability'),
          paragraphs: [
            pick(
              isZh,
              'MCurator 規劃使 SAT 元資料可對齊 Darwin Core、ABCD 與 Dublin Core 精簡欄位，以利匯入 GBIF、機構典藏系統或研究資料庫。示範已支援 QR、CSV、JSON 匯出（依資產就緒度）。',
              'MCurator plans SAT metadata alignment with Darwin Core, ABCD, and Dublin Core subsets for GBIF, collection systems, or research databases. The demo supports QR, CSV, and JSON export per asset readiness.'
            ),
          ],
        },
        {
          id: 'privacy',
          title: pick(isZh, '隱私與敏感物種', 'Privacy & sensitive species'),
          paragraphs: [
            pick(
              isZh,
              '採集者姓名、精確 GPS、稀有物種棲地等欄位可能涉及個資或物種安全。上架時應依機構政策做模糊化或權限控制。示範環境請勿輸入真實敏感個資。',
              'Collector names, precise GPS, or rare-species localities may implicate privacy or species security. Obfuscate or restrict access per institutional policy. Do not enter real sensitive data in the demo.'
            ),
          ],
        },
        {
          id: 'disputes',
          title: pick(isZh, '爭議、退貨與申訴（草案）', 'Disputes, refunds & appeals (draft)'),
          paragraphs: [
            pick(
              isZh,
              '示範環境不提供真實金流，因此無正式退貨機制。正式上線後，規劃包含授權爭議、元資料重大錯誤、實體標本損壞或未到貨、驗證等級申覆等流程（以服務條款為準）。',
              'The demo has no real payments, so no formal refunds. After launch, planned flows cover license disputes, material metadata errors, physical damage or non-delivery, and grade appeals (per terms of service).'
            ),
          ],
        },
        {
          id: 'ecology',
          title: pick(isZh, '生態回饋規劃', 'Ecology commitment (planned)'),
          paragraphs: [
            pick(
              isZh,
              '產品規劃：正式上鏈後，自本市集產生之實際鏈上 gas 手續費，其中 50% 將撥入植林、購地保育、野生動物棲地維護等專案；受贈夥伴、會計方式與報告頻率將於上線前以專案公告釐清。示範環境不產生可分配之 gas 費用。',
              'Planned: once live on-chain, 50% of actual marketplace gas fees will support reforestation, land conservation, and habitat projects. Partners, accounting, and reporting will be announced before launch. The demo generates no allocatable gas fees.'
            ),
          ],
        },
        {
          id: 'workflow',
          title: pick(isZh, '典型流程（示範）', 'Typical workflow (demo)'),
          steps: [
            {
              title: pick(isZh, '1. 登錄與鑄造', '1. Register & mint'),
              body: pick(isZh, '建立 SAT ID、上傳或連結標本影像、填寫學名、產地、採集者與分類資訊。', 'Create SAT ID, attach or link specimen imagery, enter taxonomy, locality, collector, and classification.'),
            },
            {
              title: pick(isZh, '2. 驗證與分級', '2. Verify & grade'),
              body: pick(isZh, '館員或規則引擎審查資料完整度；必要時補件。', 'Curator or rule engine reviews completeness; supplementary documents if needed.'),
            },
            {
              title: pick(isZh, '3. 上架', '3. List'),
              body: pick(isZh, '賣家設定價格、授權、是否含實體標本、付款方式。', 'Seller sets price, license, physical binding, and payment methods.'),
            },
            {
              title: pick(isZh, '4. 取得與移交', '4. Acquire & transfer'),
              body: pick(isZh, '成交後更新保管人、追加 provenance 事件；含實體者另議物流與許可。', 'After settlement, update custodian and append provenance; physical transfers need separate logistics and permits.'),
            },
            {
              title: pick(isZh, '5. 引用與匯出', '5. Cite & export'),
              body: pick(isZh, '依授權引用 SAT ID；匯出 QR／CSV／JSON 供研究或教學。', 'Cite the SAT ID under license terms; export QR / CSV / JSON for research or teaching.'),
            },
          ],
        },
      ],
      faqTitle: pick(isZh, '常見問答（FAQ）', 'Frequently asked questions (FAQ)'),
      faqIntro: [
        pick(
          isZh,
          '本常見問答旨在協助買方、賣方、研究者、機構與一般使用者，理解 SAT 所涉及之權利與義務、使用限制、交易流程、授權範圍、實體標本移交、跨境與物種相關法規、爭議處理及隱私保護等議題。內容以實務理解為導向，協助各方在交易或引用前做出合理判斷。',
          'These FAQs help buyers, sellers, researchers, institutions, and general users understand rights and obligations, usage limits, transaction flows, licensing scope, physical specimen transfer, cross-border and species-related rules, dispute handling, and privacy. The focus is practical understanding so parties can make informed decisions before trading or citing.'
        ),
        pick(
          isZh,
          'SAT（Scientific Asset Token）是科學資產的登錄、追溯與授權框架，用以支援可引用、可審核的科學資料流通。其設計目的在於提升標本與研究紀錄的可追溯性，並非金融投資或投機性商品，亦不應被解讀為收益憑證、保值工具或任何形式的投資標的。',
          'SAT (Scientific Asset Token) is a registration, traceability, and licensing framework for scientific assets—supporting citable, reviewable data circulation. It is designed to improve specimen and research record traceability, not as a financial investment, speculative product, yield instrument, or store-of-value vehicle.'
        ),
        pick(
          isZh,
          '以下說明為協助理解產品邏輯與常見情境之參考。正式上線後，實際權利義務仍以平台服務條款、隱私政策、賣家協議，以及各 listing 所載之個別授權與交易條款為準。若本 FAQ 與正式文件或個別合約內容不一致，以正式文件及該筆交易之約定為優先。',
          'The following is reference material for product logic and common scenarios. After launch, binding rights and obligations remain in the terms of service, privacy policy, seller agreements, and each listing\'s license and transaction terms. If this FAQ conflicts with formal documents or a specific contract, the formal documents and that transaction govern.'
        ),
      ],
      faqNoticeIntro: pick(
        isZh,
        '使用 SAT 市集及相關服務前，請先閱讀以下權益提醒：',
        'Before using the SAT marketplace and related services, please read this notice:'
      ),
      faqNoticeBullets: [
        pick(
          isZh,
          '本 FAQ 為產品說明與使用指引，不構成法律、稅務、投資、鑑定或進出口合規之專業意見；重大交易或跨境移動前，請自行諮詢合格顧問。',
          'This FAQ is product guidance only—not legal, tax, investment, appraisal, or import/export compliance advice. Consult qualified advisors before major transactions or cross-border moves.'
        ),
        pick(
          isZh,
          '平台會盡力建立可追溯、可審核、可引用的資料流程，但不保證每筆資料在學名、產地、年代或影像與實體一致性上具有終局正確性。',
          'The platform strives for traceable, reviewable, citable workflows but does not guarantee final correctness of taxonomy, locality, dates, or image–specimen consistency for every record.'
        ),
        pick(
          isZh,
          '買方應於下單前確認授權範圍、是否含實體標本、是否涉及 CITES 附錄物種、文化資產或當地進出口及保育法規。',
          'Buyers should confirm license scope, whether a physical specimen is included, and whether CITES appendices, cultural heritage, or local import/export and conservation rules apply before ordering.'
        ),
        pick(
          isZh,
          '賣方與機構應確保資料來源、授權鏈、影像著作權、標本來源與上架資訊真實、完整且合法，並依機構政策處理敏感物種或個資欄位。',
          'Sellers and institutions must ensure data sources, license chains, image rights, specimen provenance, and listing information are truthful, complete, and lawful—and handle sensitive species or personal data per institutional policy.'
        ),
        pick(
          isZh,
          '若 listing、個別合約或正式服務條款與本 FAQ 不一致，以正式文件及該筆交易之個別條款為準。',
          'If a listing, individual contract, or formal terms conflict with this FAQ, the formal documents and that transaction\'s terms prevail.'
        ),
      ],
      faqGroups: [
        {
          title: pick(isZh, 'A. SAT 基本定位與法律性質', 'A. SAT fundamentals & legal character'),
          items: [
            {
              q: pick(isZh, 'SAT 是什麼？', 'What is SAT?'),
              paragraphs: [
                pick(
                  isZh,
                  'SAT（Scientific Asset Token）中文可稱為科學資產代幣或科學資產登錄單位，是 MCurator 生態系中用於登錄、追溯與管理科學資產的數位身分框架。它的核心目的並非市場炒作，而是替標本、圖像、研究紀錄、教學圖版、來源履歷（provenance）與授權條款，建立可追溯、可審核、可引用的結構化紀錄。',
                  'SAT (Scientific Asset Token)—also described as a scientific asset registration unit—is MCurator\'s digital identity framework for registering, tracing, and managing scientific assets. Its core purpose is not market hype but traceable, reviewable, citable structured records for specimens, images, research records, teaching plates, provenance, and license terms.'
                ),
                pick(
                  isZh,
                  '每一筆 SAT 應連結唯一 SAT ID、標本護照（Specimen Passport）、結構化元資料、append-only 來源履歷、明示授權狀態，以及平台工作流中的驗證狀態說明。這些元素共同支援研究引用、展覽展示、教學資料管理、機構典藏流通、授權管理與資料追溯等實務場景。',
                  'Each SAT should link a unique SAT ID, Specimen Passport, structured metadata, append-only provenance, explicit license status, and verification descriptions in the platform workflow. Together these support research citation, exhibition display, teaching materials, institutional circulation, license management, and data traceability.'
                ),
                pick(
                  isZh,
                  '需要特別釐清的是：SAT 不等同政府機關之正式登記或許可文件，不等同學術界對物種或標本身分之終局定名裁定，也不等同無條件之所有權或保管權證明。SAT 提供的是科學資產在平台脈絡下的登錄與授權管理介面；具體權利義務仍取決於 listing 條款、賣方聲明、機構政策與適用法規。',
                  'Important clarifications: SAT is not a government registration or permit, not final taxonomic authority, and not unconditional proof of ownership or custody. SAT is the platform\'s registration and licensing interface for scientific assets; specific rights and obligations depend on listing terms, seller statements, institutional policy, and applicable law.'
                ),
              ],
            },
            {
              q: pick(isZh, 'SAT 是 NFT 嗎？', 'Is SAT an NFT?'),
              paragraphs: [
                pick(
                  isZh,
                  'SAT 可以選擇性採用區塊鏈或鏈上紀錄作為輔助手段，但產品定位並非一般 NFT 數位收藏品。一般 NFT 常聚焦稀缺性、收藏敘事與二級市場交易；SAT 則聚焦科學資料完整性、標本護照、provenance、明示授權、驗證工作流與可引用性，服務對象以研究者、機構、教育者與合規交易需求為主。',
                  'SAT may optionally use blockchain or on-chain records as a supporting mechanism, but it is not positioned as a typical NFT collectible. NFTs often emphasize scarcity, collecting narratives, and secondary trading; SAT emphasizes scientific data integrity, specimen passports, provenance, explicit licensing, verification workflows, and citability—primarily for researchers, institutions, educators, and compliant transactions.'
                ),
                pick(
                  isZh,
                  '平台不承諾 SAT 會升值，也不暗示任何保證流通性、保證轉售或保證市場深度的敘事。若正式上線採用鏈上技術，鏈上紀錄之主要用途在於輔助不可竄改的登錄摘要、來源事件時間戳與權利狀態紀錄，而非建立投機性資產類別。',
                  'The platform does not promise appreciation or imply guaranteed liquidity, resale, or market depth. If production adopts on-chain technology, on-chain records primarily support tamper-evident registration summaries, provenance event timestamps, and rights-state records—not a speculative asset class.'
                ),
                pick(
                  isZh,
                  '若未來特定 SAT 在技術實作上具有 NFT 形式（例如鏈上 token ID），仍不代表它是金融商品或投資商品。技術載體與產品法律性質應分開理解；使用者應依 listing 授權、服務條款與個別合約判斷可行使的權利，而非僅因「鏈上」標籤推論其投資屬性。',
                  'If a specific SAT later takes an NFT-like technical form (e.g., on-chain token ID), that still does not make it a financial or investment product. Technical carrier and legal character should be understood separately; users should determine exercisable rights from listing licenses, terms of service, and individual contracts—not infer investment status from an on-chain label alone.'
                ),
              ],
            },
            {
              q: pick(isZh, 'SAT 是投資商品、證券或金融商品嗎？', 'Is SAT an investment product, security, or financial instrument?'),
              paragraphs: [
                pick(
                  isZh,
                  '不是。SAT 與 MCurator 市集之設計目的，在於科學資產之登錄、授權流通與可追溯引用，並非向使用者提供投資建議、價格預測、獲利承諾、轉售保證或任何形式的保本承諾。',
                  'No. SAT and the MCurator marketplace are designed for scientific asset registration, licensed circulation, and traceable citation—not investment advice, price forecasts, profit promises, resale guarantees, or any form of capital preservation.'
                ),
                pick(
                  isZh,
                  'listing 上顯示之價格，通常由賣方設定或交易雙方協議，反映的是該筆授權或交易之對價安排，不代表標本之科學價值、法律價值、未來市場價值或任何第三方估值結論。示範環境中的價格更僅供 UI 與流程測試，不構成估值報告或行情。',
                  'Listing prices are typically set by sellers or agreed by parties—they reflect consideration for that license or transaction, not scientific value, legal value, future market value, or third-party appraisal. Demo prices are for UI and workflow testing only, not valuation or market quotes.'
                ),
                pick(
                  isZh,
                  '使用者不得將平台內容、SAT 說明或任何 listing 資訊，解讀或對外宣稱為證券、基金、收益權、投資契約或受監管之金融建議。若買方基於投資或投機目的購買，須自行承擔全部相關風險，並在必要時諮詢合格之法律、稅務或財務顧問。',
                  'Users must not interpret or represent platform content, SAT descriptions, or listing information as securities, funds, yield rights, investment contracts, or regulated financial advice. Buyers acting for investment or speculation bear all related risks and should consult qualified legal, tax, or financial advisors when needed.'
                ),
              ],
            },
            {
              q: pick(isZh, 'SAT 與標本護照有什麼不同？', 'How is SAT different from a Specimen Passport?'),
              paragraphs: [
                pick(
                  isZh,
                  'SAT 是科學資產登錄與追溯的核心 ID，承載正式之結構化元資料、授權狀態、provenance 事件與驗證里程碑，偏向「資料庫中的正式登錄紀錄」。標本護照（Specimen Passport）則是 SAT 的視覺化、可攜式、可展示版本，面向 QR 掃描、展覽、教學、引用與對外溝通場景。',
                  'SAT is the core ID for scientific asset registration and traceability—structured metadata, license status, provenance events, and verification milestones—the formal record in the data layer. The Specimen Passport is SAT\'s visual, portable, display-oriented view for QR scanning, exhibitions, teaching, citation, and external communication.'
                ),
                pick(
                  isZh,
                  '護照通常呈現學名、hero 影像、產地（依公開政策）、採集或典藏日期、保管者、授權摘要、QR 連結、驗證徽章等資訊，方便非技術使用者快速理解資產身分。SAT 與護照應互相連結且內容一致；但護照之版面與摘要欄位，不取代完整資料庫紀錄、原始檔案或 listing 中之詳細授權條款。',
                  'Passports typically show scientific name, hero image, locality (per disclosure policy), collection or accession date, custodian, license summary, QR link, and verification badges for quick non-technical understanding. SAT and passport should link and stay consistent; passport layout and summaries do not replace full database records, source files, or detailed listing license terms.'
                ),
                pick(
                  isZh,
                  '引用、交易或法遵審查時，應以 SAT ID 與完整元資料為準，並回查 listing 授權分頁；勿僅依護照截圖或 QR 頁面之摘要欄位，推論已取得超出授權範圍之權利。',
                  'For citation, transactions, or compliance review, rely on the SAT ID and full metadata and review the listing Rights tab—do not infer rights beyond license scope from passport screenshots or QR summary pages alone.'
                ),
              ],
            },
            {
              q: pick(isZh, 'SAT 與博物館館藏紀錄有什麼不同？', 'How is SAT different from a museum catalog record?'),
              paragraphs: [
                pick(
                  isZh,
                  '博物館或研究機構之館藏紀錄，通常是機構內部或官方典藏系統（collection management system）所維護的權威資料，管理典藏編號、修復、借展、deaccession 與對內稽核等程序。SAT 則是面向授權、流通、展示、教育、引用、保管權追蹤與數位資產管理的額外資料層，而非取代原始館藏系統。',
                  'Museum or research catalog records are authoritative data in institutional collection management systems—accession numbers, conservation, loans, deaccession, and internal audit. SAT is an additional layer for licensing, circulation, display, education, citation, custody tracking, and digital asset management—not a replacement for the original catalog system.'
                ),
                pick(
                  isZh,
                  '若 SAT 內容來自機構資料，仍應保留原始館號、館藏來源、資料匯出日期與對外引用所需之機構名稱。SAT 可協助對外展示授權範圍與 provenance 敘事，但機構內部之典藏決策、修復紀錄與 deaccession 核准，仍以官方館藏系統與書面文件為準。',
                  'When SAT content derives from institutional data, retain original accession numbers, collection source, export date, and institution name for external citation. SAT can present license scope and provenance narratives externally, but accession decisions, conservation records, and deaccession approvals remain governed by the official catalog and written documents.'
                ),
                pick(
                  isZh,
                  '若 SAT 資料與機構官方紀錄不一致，應以機構官方紀錄或原始文件為優先，並透過平台工作流或賣方主動補正。買方與引用者不應假設 SAT 已自動同步所有館藏系統之最新狀態。',
                  'If SAT data conflicts with official institutional records, prioritize the official catalog or source documents and correct via platform workflow or seller action. Buyers and citers should not assume SAT automatically reflects the latest state of all collection systems.'
                ),
              ],
            },
            {
              q: pick(isZh, '示範環境與正式環境有什麼差別？', 'How does the demo environment differ from production?'),
              paragraphs: [
                pick(
                  isZh,
                  '示範環境主要用於 UI 設計、交易流程、資料結構、驗證工作流與整體使用體驗之測試。環境中的資產、價格、付款方式、驗證徽章、錢包地址、交易紀錄與上鏈狀態，可能為 mock data 或測試資料，不代表真實市場或機構典藏現況。',
                  'The demo environment primarily tests UI, transaction flows, data structures, verification workflows, and overall UX. Assets, prices, payment methods, verification badges, wallet addresses, transaction records, and on-chain states may be mock or test data—not real market or institutional holdings.'
                ),
                pick(
                  isZh,
                  '示範環境不代表真實交易：不產生真實付款、托管交割、具約束力之授權移轉，也不產生正式上鏈之法律或技術效果。使用者不得將示範畫面截圖、測試 checkout 紀錄或內部預覽連結，當成正式交易憑證、收據或對外要約。',
                  'The demo is not a real market: no real payments, escrow settlement, binding license transfers, or production on-chain legal or technical effects. Do not treat demo screenshots, test checkout records, or internal preview links as formal receipts, credentials, or public offers.'
                ),
                pick(
                  isZh,
                  '正式環境上線前，平台將另行公告服務條款、隱私政策、交易規則、賣家規範、收費方式、爭議處理流程，以及（若採用）上鏈策略與錢包簽署要求。届時本 FAQ 亦可能更新；在正式文件公布前，任何示範操作均不構成具約束力合約。',
                  'Before production launch, the platform will publish terms of service, privacy policy, trading rules, seller standards, fees, dispute processes, and (if adopted) on-chain strategy and wallet signing requirements. This FAQ may also update; until formal documents are published, demo actions do not create binding contracts.'
                ),
              ],
            },
          ],
        },
        {
          title: pick(isZh, 'B. 買方權利、取得內容與使用限制', 'B. Buyer rights, deliverables & usage limits'),
          items: [
            {
              q: pick(isZh, '買 SAT 之後，我實際取得什麼？', 'What do I actually receive after buying an SAT?'),
              paragraphs: [
                pick(
                  isZh,
                  '買方實際取得之內容，完全依個別 listing 之標示與授權條款而定，平台不對所有 SAT 提供統一「標準包」。付款或完成示範 checkout 前，應逐項閱讀該 listing 的「權利與授權」、是否含實體標本、是否可下載、是否可商業使用，以及是否有 CITES、文化資產或其他法規限制。',
                  'What buyers receive depends entirely on each listing\'s labels and license terms—the platform does not offer a uniform standard package for all SATs. Before payment or demo checkout, review Rights & License, physical specimen flags, download permissions, commercial use, and any CITES, heritage, or other regulatory limits.'
                ),
                pick(
                  isZh,
                  '通常可能包含（若 listing 明示）：SAT ID、可瀏覽的標本護照、授權範圍內的元資料使用權、依授權可下載之資料檔、展覽或教學展示權、學術引用權，以及 listing 所載之教育用途或商業授權。實際可用項目以成交當下 listing 頁面與交易紀錄為準。',
                  'You may receive (when explicitly stated): SAT ID, viewable Specimen Passport, metadata usage within license scope, downloadable files per license, exhibition or teaching display rights, academic citation rights, and educational or commercial licenses as listed. Available items are governed by the listing page and transaction record at settlement.'
                ),
              ],
              bullets: [
                pick(
                  isZh,
                  '通常不一定包含：實體標本、完整著作權、商標權、無限制商業化權、再授權權、獨占權、科學鑑定結論、進出口許可協助或物流托管。',
                  'Usually not included unless stated: physical specimen, full copyright, trademarks, unlimited commercialization, sublicensing, exclusivity, scientific appraisal conclusions, import/export permit assistance, or logistics escrow.'
                ),
                pick(
                  isZh,
                  '若 listing 標示「含實體標本」或 physical specimen binding，才可能涉及實體保管權或所有權之移交；移交細節仍須雙方另行確認，平台不默認代辦。',
                  'Physical custody or ownership may transfer only when the listing states physical specimen binding; handover details must be confirmed separately—the platform does not assume agency by default.'
                ),
              ],
            },
            {
              q: pick(isZh, '買 SAT 是否自動取得實體標本？', 'Does buying an SAT automatically include the physical specimen?'),
              paragraphs: [
                pick(
                  isZh,
                  '否。SAT 交易預設為數位層之授權與登錄紀錄移轉或存取，並不當然包含實體標本之占有、保管權或所有權。只有 listing 明確標示「含實體標本」、「physical specimen binding」或同等語意時，才代表交易可能包含實體標本之相關移交安排。',
                  'No. SAT transactions default to digital-layer license and registration access or transfer—they do not automatically include physical possession, custody, or ownership. Only when the listing explicitly states physical specimen inclusion or physical specimen binding does the deal potentially include physical handover arrangements.'
                ),
                pick(
                  isZh,
                  '未標示者，通常僅包含數位紀錄、標本護照、元資料與授權範圍內的使用權；賣方仍可能保留實體標本。即使 listing 標示含實體，也不代表平台負責物流、保險、報關、CITES 許可、入境審查、保存設備提供或任何進出口法律程序。',
                  'Without such labeling, you typically receive digital records, passport, metadata, and licensed usage only; the seller may retain the physical specimen. Even when physical inclusion is stated, the platform is not responsible for logistics, insurance, customs, CITES permits, import inspection, storage equipment, or import/export legal procedures.'
                ),
                pick(
                  isZh,
                  '實體移交之時間、地點、包裝標準、風險轉移點、許可文件責任與爭議處理，應由買賣雙方於付款前充分確認，必要時以書面合約、機構 deaccession 文件或交易備註載明。平台可提供 provenance 更新介面，但不替代雙方之履約安排。',
                  'Timing, location, packaging standards, risk transfer, permit responsibilities, and dispute handling for physical handover should be confirmed before payment—ideally in writing, deaccession documents, or transaction notes. The platform may offer provenance update tools but does not replace parties\' performance arrangements.'
                ),
              ],
            },
            {
              q: pick(isZh, '買 SAT 是否取得照片、文字與資料的著作權？', 'Does buying an SAT confer copyright in photos, text, and data?'),
              paragraphs: [
                pick(
                  isZh,
                  '通常不會。SAT 交易在實務上多為「授權使用」而非「著作權讓與」。影像、文字描述、掃描圖版、結構化元資料等內容之著作權，原則上仍屬原創作者、攝影者、機構或依法享有權利之權利人，除非 listing 或書面合約明確載明著作財產權移轉。',
                  'Usually no. SAT transactions are typically licenses to use—not assignments of copyright. Copyright in images, descriptive text, scans, and structured metadata generally remains with creators, photographers, institutions, or other rights holders unless the listing or written contract explicitly assigns economic rights.'
                ),
                pick(
                  isZh,
                  '買方可行使的範圍取決於 listing 授權條款，例如：教育展示、學術引用、非商業使用、有限度商業使用、展覽使用、可下載或不可下載、是否允許改作等。不同欄位可能有不同授權；應以「權利與授權」分頁之完整說明為準，勿僅依護照摘要推論。',
                  'Buyer permissions depend on listing license terms—e.g., educational display, academic citation, non-commercial use, limited commercial use, exhibition use, download permissions, adaptation rules. Fields may differ; rely on the full Rights & License tab, not passport summaries alone.'
                ),
                pick(
                  isZh,
                  '若需取得完整著作財產權、獨家商業授權、再授權權或全球永久使用權，必須有明確書面條款並確認原權利鏈完整。超出授權範圍之重製、改作、公開傳輸或商業再利用，可能構成侵權；平台得依規則限制帳號、下架內容、保全紀錄或協助權利人處理申訴，但不代為終局認定侵權成立。',
                  'Full economic rights, exclusive commercial licenses, sublicensing, or perpetual global use require explicit written terms and a complete chain of title. Reproduction, adaptation, public transmission, or commercial reuse beyond license may infringe; the platform may restrict accounts, delist content, preserve records, or assist rights-holder complaints—but does not finally adjudicate infringement.'
                ),
              ],
            },
            {
              q: pick(isZh, '我可以把 SAT 用於商業用途嗎？', 'Can I use an SAT for commercial purposes?'),
              paragraphs: [
                pick(
                  isZh,
                  '只有 listing 明確允許商業使用（或同等授權標籤）時才可以。若授權僅載明教育、研究、展示、非商業或學術引用，買方不得自行擴張解釋為可商用，亦不得以「已付費購買」為由主張當然取得商業化權利。',
                  'Only when the listing explicitly allows commercial use (or equivalent license labels). If the license states educational, research, display, non-commercial, or academic citation only, buyers may not broaden that to commercial use or claim commercial rights merely because they paid.'
                ),
                pick(
                  isZh,
                  '商業用途包含但不限於：商品包裝、廣告素材、付費出版品銷售、付費線上課程、品牌行銷、遊戲或 App 素材，以及將 SAT 影像或資料再包裝為 NFT 或其他數位商品再行銷售。是否允許上述行為，必須逐項對照 listing 授權，而非套用一般性假設。',
                  'Commercial use includes but is not limited to: product packaging, advertising, paid publications, paid online courses, brand marketing, game or app assets, and repackaging SAT imagery or data as NFTs or other digital products for resale. Each use must match the listing license—not general assumptions.'
                ),
                pick(
                  isZh,
                  '有疑義時，買方應先向賣方或權利人確認並保留書面回覆，不要先大量使用再事後補授權。平台可提供授權標籤與摘要協助理解，但最終仍以 listing 條款、成交紀錄與正式合約為準。',
                  'When in doubt, confirm with the seller or rights holder in writing before large-scale use—do not use first and seek permission later. The platform provides license labels and summaries for clarity, but listing terms, transaction records, and formal contracts govern.'
                ),
              ],
            },
            {
              q: pick(isZh, '我可以轉售 SAT 嗎？', 'Can I resell an SAT?'),
              paragraphs: [
                pick(
                  isZh,
                  '是否允許轉售，依平台正式上線後之規則與個別 listing 授權而定，目前示範環境不構成真實二級市場。有些 SAT 可能允許轉讓數位保管權或 access 權，有些可能明確限制不得轉售、不得再授權、不得拆分、不得用於商業轉售或不得移轉至特定司法管轄區。',
                  'Resale permission depends on production rules and each listing\'s license—the demo is not a real secondary market. Some SATs may allow transfer of digital custody or access rights; others may prohibit resale, sublicensing, splitting, commercial flipping, or transfer to certain jurisdictions.'
                ),
                pick(
                  isZh,
                  '若 SAT 綁定實體標本，轉售時還須另行確認標本現況、保存狀態、物流與保險安排、CITES 或文化資產法規、出口限制，以及保管責任在移轉前後如何分配。數位轉售不應被用來規避實體標本之法定限制。',
                  'When an SAT binds a physical specimen, resellers must also confirm specimen condition, storage, logistics and insurance, CITES or heritage rules, export limits, and custody responsibilities before and after transfer. Digital resale must not circumvent legal limits on physical specimens.'
                ),
                pick(
                  isZh,
                  '轉售時不得移除或篡改原始 provenance，不得偽造驗證狀態，不得改寫來源履歷或冒用機構名義。平台保留對違規轉售、疑似洗售、錯誤標示、繞過授權限制或涉及違法標本之交易，進行暫停、下架、限制帳號或保全紀錄之權利，以保護其他使用者與權利人。',
                  'Resellers must not remove or alter original provenance, forge verification status, rewrite history, or misrepresent institutional affiliation. The platform may suspend, delist, restrict accounts, or preserve records for non-compliant resale, suspected wash trading, mislabeling, license circumvention, or unlawful specimen deals—to protect other users and rights holders.'
                ),
              ],
            },
            {
              q: pick(isZh, '如何正確引用 SAT？', 'How should I cite an SAT correctly?'),
              paragraphs: [
                pick(
                  isZh,
                  '引用 SAT 時，應至少包含：SAT ID、學名（scientific name）、資料標題或資產名稱、保管者或資料提供者、取得或存取日期、授權類型，以及可解析之頁面連結（若公開）。不應僅截圖護照或影像使用而不標示來源與授權，亦不得移除驗證或 provenance 相關之必要脈絡。',
                  'When citing an SAT, include at minimum: SAT ID, scientific name, dataset title or asset name, custodian or data provider, access or acquisition date, license type, and a resolvable page link (if public). Do not use passport or image screenshots without source and license attribution, or strip necessary verification and provenance context.'
                ),
                pick(
                  isZh,
                  '若 SAT 資料源自原始館號、GBIF、Catalogue of Life、論文、博物館資料庫或其他第三方來源，應保留上游引用，形成完整引用鏈。引用於論文、展覽圖說、教材、商業出版或線上課程前，應確認 listing 授權是否允許該使用情境。',
                  'If SAT data derives from accession numbers, GBIF, Catalogue of Life, literature, museum databases, or other upstream sources, retain those citations for a complete citation chain. Before citing in papers, exhibition labels, teaching materials, commercial publishing, or online courses, confirm the listing license allows that use case.'
                ),
                pick(
                  isZh,
                  '建議引用格式範例：「SAT ID: SAT-XXXX，學名：Genus species，MCurator Scientific Asset Token，資料提供者：XXX，取得日期：YYYY-MM-DD，授權：XXX。」實際欄位可依期刊、DataCite 或機構引用政策調整，但 SAT ID 與授權類型不應省略。',
                  'Suggested format: "SAT ID: SAT-XXXX, Scientific name: Genus species, MCurator Scientific Asset Token, Data provider: XXX, Access date: YYYY-MM-DD, License: XXX." Adjust fields per journal, DataCite, or institutional policies, but do not omit SAT ID and license type.'
                ),
              ],
            },
          ],
        },
        {
          title: pick(isZh, 'C. 賣方／機構責任、上架義務與平台保護', 'C. Seller & institution duties, listing obligations & platform safeguards'),
          items: [
            {
              q: pick(isZh, '賣方上架 SAT 前需要確認什麼？', 'What must sellers confirm before listing an SAT?'),
              paragraphs: [
                pick(
                  isZh,
                  '賣方（含代表機構上架者）應先確認自己對該資產具有合法之上架與授權權限，而非僅因持有影像、掃描檔或部分元資料，即推定可對外流通。應核對標本來源、影像與文字之著作來源、結構化資料之原始出處，以及 listing 所載授權是否覆蓋擬提供之使用範圍。',
                  'Sellers (including institutional listers) must confirm lawful authority to list and license the asset—not assume rights merely from holding images, scans, or partial metadata. Verify specimen provenance, image and text sources, structured data origin, and that the stated license covers the intended use scope.'
                ),
                pick(
                  isZh,
                  '若為機構典藏或研究標本，應先確認機構政策是否允許對外授權、公開展示、數位流通或 deaccession；必要時取得館長、典藏委員會或法務之內部核准。若涉及受保護物種、化石、文化資產、人體相關標本或敏感採集地點，應在上架前自行查核適用法規與機構倫理規範。',
                  'For institutional or research holdings, confirm policy allows external licensing, public display, digital circulation, or deaccession—obtain internal approval from curators, committees, or legal when required. For protected species, fossils, cultural heritage, human-related specimens, or sensitive localities, check applicable laws and institutional ethics before listing.'
                ),
                pick(
                  isZh,
                  '賣方不得上架來源不明、疑似非法採集或走私、侵權影像或文字、故意錯誤標示（例如隱匿是否含實體、誤標保護等級），或可能導致物種危害、棲地暴露、盜獵或盜採風險之資料。平台得依政策拒絕或要求補件，但上架前之實質合規責任仍主要由賣方承擔。',
                  'Sellers must not list unknown provenance, suspected illegal collection or smuggling, infringing images or text, deliberate mislabeling (e.g., hiding physical inclusion or misstating protection status), or data that could harm species, expose habitats, or enable poaching or illegal collection. The platform may reject or request supplements per policy, but substantive pre-listing compliance responsibility remains primarily with sellers.'
                ),
              ],
            },
            {
              q: pick(isZh, '賣方提供錯誤資料會怎麼樣？', 'What happens if a seller provides incorrect information?'),
              paragraphs: [
                pick(
                  isZh,
                  '依錯誤性質與影響程度，平台得要求賣方補件或修正、暫停 listing、降低驗證狀態、移除或撤回徽章、下架商品、凍結進行中交易，或限制、暫停帳號功能。上述措施旨在保護買方、其他使用者與平台生態，不等同法院或主管機關之終局認定。',
                  'Depending on severity and impact, the platform may require corrections or supplements, suspend listings, downgrade verification, remove or revoke badges, delist items, freeze in-progress transactions, or restrict or suspend accounts. These measures protect buyers, other users, and ecosystem integrity—they are not final findings by courts or authorities.'
                ),
                pick(
                  isZh,
                  '若錯誤涉及重大誤導——例如是否含實體標本、物種名稱、保護等級、授權範圍、產地、年代、真偽或驗證狀態——可能進入爭議或申訴流程，並通知已受影響之買方。平台保留保存紀錄、協助權利人申訴，以及在依法要求時配合法律程序之權利。',
                  'Material misrepresentations—physical inclusion, species name, protection status, license scope, locality, dates, authenticity, or verification state—may trigger dispute or appeal flows and notify affected buyers. The platform may preserve records, assist rights-holder complaints, and cooperate with legal process when lawfully required.'
                ),
                pick(
                  isZh,
                  '賣方應自行承擔因其提交資料不實、侵權或違法所造成之民事、行政或刑事責任（依個案與適用法規而定）。平台同時提供更正與補件流程，以區分善意疏失與惡意欺詐；善意修正應透過 provenance 事件留下紀錄，而非悄悄覆寫歷史。',
                  'Sellers bear civil, administrative, or criminal liability for false, infringing, or unlawful submissions as applicable by case and law. The platform also offers correction workflows to distinguish good-faith errors from fraud; good-faith fixes should be recorded via provenance events, not silent overwrites of history.'
                ),
              ],
            },
            {
              q: pick(isZh, '賣方可以修改已上架或已售出的 SAT 資料嗎？', 'Can sellers edit SAT data after listing or after sale?'),
              paragraphs: [
                pick(
                  isZh,
                  '賣方通常可以修正錯字、補充科學欄位、追加照片或補充文獻引用，但不得覆寫或刪除既有之 append-only 來源履歷（provenance）。歷史事件應保留，以維護引用鏈與交易透明度。',
                  'Sellers may usually fix typos, supplement scientific fields, add photos, or attach literature citations—but must not overwrite or delete existing append-only provenance. Historical events should remain to preserve citation chains and transaction transparency.'
                ),
                pick(
                  isZh,
                  '重大修改應新增 provenance event，例如「學名修正」、「授權更新」、「影像補件」、「實體狀態更新」或「驗證覆核」，並載明修改者、日期與依據。已售出之 SAT 若涉及授權範圍、是否含實體或交易核心條件之變更，應取得買方同意，或依正式服務條款、賣家協議與個別合約處理。',
                  'Material changes should add provenance events—e.g., taxonomic revision, license update, image supplement, physical status update, or verification review—with editor, date, and basis. For sold SATs, changes to license scope, physical inclusion, or core transaction terms require buyer consent or handling per formal terms, seller agreements, and individual contracts.'
                ),
                pick(
                  isZh,
                  '平台應保留修改紀錄與（在正式環境中）交易前 listing 快照，避免成交後任意改條件而損害買方。Append-only provenance 是保護買方、賣方與平台三方之重要機制；任何試圖偽造或抹除履歷之行為，可能觸發下架、爭議或帳號限制。',
                  'The platform should retain change logs and (in production) pre-transaction listing snapshots to prevent post-sale arbitrary term changes that harm buyers. Append-only provenance protects buyers, sellers, and the platform; forging or erasing history may trigger delisting, disputes, or account restrictions.'
                ),
              ],
            },
            {
              q: pick(isZh, '平台會如何保護賣方？', 'How does the platform protect sellers?'),
              paragraphs: [
                pick(
                  isZh,
                  '平台應提供清楚之 listing 欄位，讓賣方明確標示授權範圍、是否可下載、是否可商用、是否含實體標本、是否允許轉售，以及特殊限制或風險提醒。權利摘要、授權標籤與 FAQ 應協助買方理解可用範圍，降低因誤讀授權而導致之濫用風險。',
                  'The platform should provide clear listing fields for license scope, download permissions, commercial use, physical specimen inclusion, resale permissions, and special limits or risk notices. Rights summaries, license labels, and FAQs should help buyers understand permitted use and reduce misuse from misreading licenses.'
                ),
                pick(
                  isZh,
                  '若買方超出授權範圍使用、移除必要引用、擅自商用或疑似侵權，平台得協助賣方建立申訴、紀錄保存、內容限制或下架處理流程（依正式規則）。平台不應要求賣方提供超出上架與合規審查必要範圍之敏感資訊；精確 GPS、採集者身分等應依機構政策分級揭露。',
                  'If buyers exceed license scope, remove required attribution, commercialize without permission, or allegedly infringe, the platform may help sellers file complaints, preserve records, restrict content, or delist per formal rules. The platform should not require sensitive data beyond what listing and compliance review reasonably need; precise GPS and collector identity should be tiered per institutional policy.'
                ),
                pick(
                  isZh,
                  '對於高價、敏感物種、機構典藏或跨境資產，平台可設計人工審查、白名單買方、限制公開欄位或延後公開等措施，協助賣方在可控風險下流通授權。上述機制旨在平衡流通需求與賣方權益，不代表平台對所有交易結果提供擔保。',
                  'For high-value, sensitive-species, institutional, or cross-border assets, the platform may use manual review, buyer allowlists, restricted public fields, or delayed disclosure to help sellers license under controlled risk. These mechanisms balance circulation and seller interests—they do not guarantee all transaction outcomes.'
                ),
              ],
            },
            {
              q: pick(isZh, '平台會如何保護買方？', 'How does the platform protect buyers?'),
              paragraphs: [
                pick(
                  isZh,
                  '平台應要求 listing 清楚標示價格、授權類型、資料完整度、驗證狀態說明、是否含實體標本、使用限制、法規或物種風險提醒，以及賣方聲明之重要例外。買方應能在付款前理解「買到的是什麼」與「不能拿來做什麼」。',
                  'Listings should clearly show price, license type, data completeness, verification descriptions, physical specimen flags, usage limits, regulatory or species risk notices, and material seller exceptions. Buyers should understand before payment what they receive and what they may not do with it.'
                ),
                pick(
                  isZh,
                  '正式環境中，平台應保留交易前 listing 快照，避免成交後核心條件被單方更改而買方無從舉證。平台亦應建立申訴流程，處理資料重大錯誤、授權不符、實體未依約交付、侵權疑慮或驗證徽章誤用等情境；處置可能包含暫停交割、要求補件、第三方覆核或依條款進入調解／仲裁。',
                  'In production, the platform should retain pre-transaction listing snapshots so core terms cannot be unilaterally changed post-sale without evidence. Appeal flows should address material data errors, license mismatches, undelivered physical specimens, infringement concerns, or badge misuse—possibly holds, supplemental requests, third-party review, or mediation/arbitration per terms.'
                ),
                pick(
                  isZh,
                  '平台應提供明確之「驗證不等於保證」說明，避免買方誤以為平台已承擔所有科學鑑定、法律合規或標本真偽風險。買方仍有責任自行確認用途是否符合授權、是否涉及 CITES 或當地法規，以及是否需要額外鑑定或法律意見。',
                  'The platform should clearly state that verification is not a guarantee—buyers must not assume the platform bears all scientific appraisal, legal compliance, or authenticity risk. Buyers remain responsible for confirming use matches license, whether CITES or local laws apply, and whether additional appraisal or legal advice is needed.'
                ),
              ],
            },
            {
              q: pick(isZh, '平台可以拒絕或下架哪些 SAT？', 'Which SATs may the platform reject or delist?'),
              paragraphs: [
                pick(
                  isZh,
                  '平台得拒絕上架或下架來源不明、疑似非法取得、涉及盜採或走私、違反保育或文化資產法規、侵害著作權／肖像權／資料庫權，或違反機構對外授權政策之 listing。亦得處理精確揭露敏感物種棲地而可能導致盜獵、盜採或棲地破壞之內容。',
                  'The platform may reject or delist unknown provenance, suspected illegal acquisition, poaching or smuggling, conservation or cultural-heritage violations, copyright/privacy/database-right infringement, or listings violating institutional external licensing policy. It may also act on precise sensitive-habitat disclosure that could enable poaching, illegal collection, or habitat harm.'
                ),
                pick(
                  isZh,
                  '下列情形亦可能觸發拒絕、暫停或下架：假冒驗證、偽造 provenance、誤導是否含實體標本、冒用機構名義、洗售或繞過授權限制，以及其他違反服務條款、適用法律或平台科學倫理原則之內容。處置方式將依嚴重程度分級，並盡可能保留紀錄供爭議處理。',
                  'Reject, suspend, or delist may also apply to forged verification, fake provenance, misleading physical inclusion, misrepresented institutional affiliation, wash trading or license circumvention, and other terms, law, or scientific-ethics violations. Actions are tiered by severity with records preserved for disputes where possible.'
                ),
                pick(
                  isZh,
                  '下架或限制並不表示平台已完成刑事調查或民事認定；平台主要履行平台治理與風險控管角色。賣方與買方仍可能需自行面對主管機關、權利人或司法程序；SAT 登錄或下架紀錄本身不能替代合法取得證明或許可文件。',
                  'Delisting or restriction does not mean the platform completed criminal investigation or civil adjudication—it performs platform governance and risk control. Sellers and buyers may still face authorities, rights holders, or courts; SAT registration or delisting records do not substitute lawful acquisition proof or permits.'
                ),
              ],
            },
          ],
        },
        {
          title: pick(isZh, 'D. 驗證、分級、元資料與科學準確性', 'D. Verification, grading, metadata & scientific accuracy'),
          items: [
            {
              q: pick(isZh, '「已驗證元資料」代表什麼？', 'What does "verified metadata" mean?'),
              paragraphs: [
                pick(
                  isZh,
                  '「已驗證元資料」代表該筆 SAT 之科學欄位，已通過平台設定之完整度、一致性、格式或必要欄位邏輯檢查。可能涵蓋學名、分類階層、產地（依公開政策）、採集或典藏日期、hero 影像、尺度標、授權摘要、來源文件引用等項目，具體範圍依平台工作流版本而定。',
                  '"Verified metadata" means the SAT\'s scientific fields passed platform checks for completeness, consistency, format, or required-field logic. Coverage may include scientific name, taxonomy, locality (per disclosure policy), collection or accession dates, hero imagery, scale bars, license summaries, and source document citations—exact scope depends on workflow version.'
                ),
                pick(
                  isZh,
                  '此狀態代表資料就緒度之里程碑：資料已達到一定可引用、可審核、可展示之結構化程度。它不代表學術界對物種或標本身分之最終定名，不代表政府機關背書，也不代表內容必然沒有任何錯誤或遺漏。',
                  'It marks a readiness milestone: structured to a level suitable for citation, review, and display. It is not final taxonomic authority, not government endorsement, and not a promise of zero error or omission.'
                ),
                pick(
                  isZh,
                  '若日後有新文獻、同物異名修訂、館員覆核或買方申訴導致資料更新，應透過 provenance 事件修正並保留舊值，而非直接刪除歷史。驗證狀態亦可能因重大修正而調整；買方與引用者應以最新 listing 與 SAT ID 解析結果為準，並保留獨立查證責任。',
                  'Updates from new literature, synonymy revisions, curator review, or buyer appeals should use provenance events retaining prior values—not delete history. Verification status may change after material corrections; buyers and citers should rely on current listing and SAT ID resolution and remain responsible for independent verification.'
                ),
              ],
            },
            {
              q: pick(isZh, '驗證徽章有哪些限制？', 'What are the limits of verification badges?'),
              paragraphs: [
                pick(
                  isZh,
                  'Curator verified、SAT graded、Provenance complete 等徽章，代表平台工作流中某階段之審查或資料狀態，例如館員已覆核、分級完成、來源欄位達標等。其目的是讓使用者快速理解資料準備程度，而非替代完整 due diligence。',
                  'Badges such as Curator verified, SAT graded, and Provenance complete mark workflow stages—curator review, grading complete, provenance fields meeting thresholds—helping users quickly assess readiness, not replacing full due diligence.'
                ),
                pick(
                  isZh,
                  '徽章不是司法公證、不是政府許可、不是進出口或 CITES 合規保證，也不是學術期刊同儕審查或第三方實驗室鑑定結論。使用者不得僅因徽章存在，即推論標本真偽、年代、產地或法律可交易性已獲終局確認。',
                  'Badges are not notarization, government permits, import/export or CITES compliance guarantees, peer review, or third-party laboratory appraisal. Users must not infer final authenticity, dates, locality, or legal tradability from badges alone.'
                ),
                pick(
                  isZh,
                  '若發現徽章使用錯誤、資料與徽章不符或存在誤導，平台得撤回、降級或重新審查，並更新 listing 說明。徽章是輔助資訊，不是對買方或賣方之無條件保證；平台對徽章之管理旨在維護資訊一致性，而非承擔所有科學或法律風險。',
                  'If badges are misapplied, inconsistent with data, or misleading, the platform may revoke, downgrade, or re-review and update listing descriptions. Badges are auxiliary information—not unconditional guarantees to buyers or sellers; badge management aims at informational consistency, not assuming all scientific or legal risk.'
                ),
              ],
            },
            {
              q: pick(isZh, 'SAT-MGS 分級是什麼？', 'What is SAT-MGS grading?'),
              paragraphs: [
                pick(
                  isZh,
                  'SAT-MGS（Marketplace Grading System）是平台針對 listing 所提供之建議分級框架，可依照片品質、診斷特徵可見度、元資料完整度、provenance 完整度、授權標示清楚度等維度，產生分級或評分摘要，協助買方與研究者初步比較不同 SAT 之資料與展示完整度。',
                  'SAT-MGS (Marketplace Grading System) is the platform\'s suggested grading framework for listings—photo quality, visibility of diagnostic features, metadata completeness, provenance completeness, license clarity, and similar dimensions—to help buyers and researchers compare data and presentation completeness.'
                ),
                pick(
                  isZh,
                  '系統分級可由館員或審查人員覆核、調整或註記例外。分級較高通常表示資料與影像就緒度較佳，但不等於標本更稀有、更珍貴，也不等於價格應更高，更不等於投資評級或財務建議。',
                  'System grades may be reviewed, adjusted, or annotated by curators or reviewers. Higher grades usually mean better data and imagery readiness—not rarer specimens, not higher intrinsic value, not higher price expectations, and not investment ratings or financial advice.'
                ),
                pick(
                  isZh,
                  'SAT-MGS 是資料品質與展示完整度之參考工具；高價交易、學術出版或跨境移動仍應另行進行專業鑑定、文獻考證與法律盡職調查。分級變更應留下紀錄，避免交易後無追溯地修改評價依據。',
                  'SAT-MGS is a reference for data quality and presentation completeness; high-value deals, academic publication, or cross-border moves still require professional appraisal, literature review, and legal due diligence. Grade changes should be logged to avoid untraceable post-transaction shifts in evaluation basis.'
                ),
              ],
            },
            {
              q: pick(isZh, '如果物種學名未來被修訂怎麼辦？', 'What if the scientific name is revised later?'),
              paragraphs: [
                pick(
                  isZh,
                  '生物分類會隨研究進展而更新，學名修訂、同物異名合併或分類階層調整是正常現象，並不表示原 listing 必然存在欺詐。SAT 應保留原始學名、修訂後學名（若適用）、修訂日期、依據文獻或資料來源，以及修改者或覆核者資訊。',
                  'Taxonomy evolves with research—name revisions, synonymy, and rank changes are normal and do not automatically imply fraud. SAT should retain original names, revised names (if applicable), revision dates, supporting literature or sources, and editor or reviewer information.'
                ),
                pick(
                  isZh,
                  '不應直接刪除舊名稱或覆寫歷史引用，以免破壞論文、展覽、交易紀錄與 provenance 之可追溯性。對外護照或摘要可顯示「目前接受學名」，同時在完整紀錄中保留歷史名稱連結。',
                  'Do not delete old names or overwrite historical citations—that breaks traceability for papers, exhibitions, transactions, and provenance. Public passports or summaries may show the currently accepted name while full records link historical names.'
                ),
                pick(
                  isZh,
                  '若學名修訂伴隨保護等級、法規適用或交易核心描述之重大變更，可能需通知已成交買方或進入爭議流程。此設計同時保護科學可追溯性與交易透明，亦提醒買賣雙方：分類更新是科學過程，不是平台對價格或合法性之 silent guarantee。',
                  'If revisions materially change protection status, regulatory applicability, or core transaction descriptions, notify settled buyers or open disputes. This protects scientific traceability and transaction transparency—and reminds parties that taxonomic updates are scientific process, not silent platform guarantees of price or legality.'
                ),
              ],
            },
            {
              q: pick(isZh, '平台是否保證標本真偽？', 'Does the platform guarantee specimen authenticity?'),
              paragraphs: [
                pick(
                  isZh,
                  '平台可提供資料審查、照片與欄位一致性檢查、provenance 完整性檢視，以及館員或審查人員覆核等工作流，協助提升資料可信度。但除非特定 listing 或書面合約明確提供鑑定或真偽保證條款，平台不對所有 SAT 之標本真偽、地質年代、產地、物種鑑定結論或保存狀態提供一般性保證。',
                  'The platform may offer data review, photo and field consistency checks, provenance completeness review, and curator or reviewer workflows to improve credibility. Unless a specific listing or written contract explicitly provides appraisal or authenticity guarantees, the platform does not generally guarantee authenticity, geologic age, locality, species identification, or condition for all SATs.'
                ),
                pick(
                  isZh,
                  '高價、含實體或具爭議性之交易，買方應自行委託第三方鑑定、要求補充照片與來源文件、查核館藏或文獻紀錄，或在可能時安排實體檢查。賣方若故意提供虛假或重大不實資料，應自行承擔相應法律與契約責任。',
                  'For high-value, physical, or contentious deals, buyers should commission third-party appraisal, request supplemental photos and provenance documents, verify collection or literature records, or arrange physical inspection when possible. Sellers who knowingly provide false or materially misleading data bear corresponding legal and contractual responsibility.'
                ),
                pick(
                  isZh,
                  '平台應避免在對外文案中使用「保證真品」「百分之百正確」或類似絕對性表述。驗證與分級是風險管理與資訊透明工具，不是將所有鑑定風險轉嫁給平台之機制；買方與賣方仍應依交易重要性分配查證義務。',
                  'The platform should avoid absolute marketing such as "guaranteed genuine" or "100% correct." Verification and grading are risk-management and transparency tools—not mechanisms shifting all appraisal risk to the platform; buyers and sellers should allocate verification duties by transaction importance.'
                ),
              ],
            },
            {
              q: pick(isZh, '資料完整度百分比代表什麼？', 'What does the data completeness percentage mean?'),
              paragraphs: [
                pick(
                  isZh,
                  '完整度百分比通常依平台公式計算，考量必填科學欄位、hero 影像、provenance 事件、授權標示、驗證里程碑、補充文件或引用等是否齊備。其目的是量化「資料就緒程度」，而非直接量化標本之科學或市場價值。',
                  'Completeness percentage is usually computed from required scientific fields, hero imagery, provenance events, license labels, verification milestones, supplemental documents, and citations. It quantifies data readiness—not direct scientific or market value of the specimen.'
                ),
                pick(
                  isZh,
                  '100% 完整不等於學術內容必然正確，也不等於法律上無風險或已通過所有進出口審查。低完整度不一定代表資料錯誤，可能只是尚未公開某些欄位、機構尚未核准揭露、或賣方尚未補充照片與文獻。',
                  '100% completeness does not mean academic correctness, legal risk-free status, or cleared import/export review. Low completeness does not necessarily mean errors—it may reflect unreleased fields, institutional disclosure limits, or pending photos and literature.'
                ),
                pick(
                  isZh,
                  '買方可用完整度作為初步篩選，但仍須搭配授權條款、來源履歷、是否含實體與法規限制綜合判斷。賣方可透過補照片、補館號、補文獻、補授權說明與 provenance 事件提升完整度，有助於降低買方疑慮，但不構成對真偽或合法性的額外保證。',
                  'Buyers may use completeness as an initial filter but must also weigh license terms, provenance, physical inclusion, and regulatory limits. Sellers can raise completeness by adding photos, accession numbers, literature, license clarity, and provenance events—reducing buyer uncertainty without extra guarantees of authenticity or legality.'
                ),
              ],
            },
          ],
        },
        {
          title: pick(isZh, 'E. 實體標本、保管權、物流、CITES 與跨境法規', 'E. Physical specimens, custody, logistics, CITES & cross-border rules'),
          items: [
            {
              q: pick(isZh, '什麼是保管權 custody？', 'What is custody?'),
              paragraphs: [
                pick(
                  isZh,
                  '保管權（custody）指誰負責保存、管理、移交或維護標本或相關數位紀錄之實務控制與照護責任。在 SAT 脈絡中，custody 變更可能記錄於 provenance timeline，例如機構典藏、私人收藏、研究借展、寄存、受託保管或成交後移轉。',
                  'Custody is who is responsible for storing, managing, transferring, or maintaining practical control and care of a specimen or related digital records. In SAT, custody changes may be recorded in the provenance timeline—institutional holding, private collection, research loan, deposit, bailment, or post-sale transfer.'
                ),
                pick(
                  isZh,
                  '保管權不一定等同完整所有權（ownership）：在機構典藏、借展、寄存或受託保管安排中，所有權與保管權可能分離。SAT 可記錄保管狀態變更，但不自動克服機構政策、deaccession 限制、質押、扣押或適用法規對移轉之禁止。',
                  'Custody is not necessarily full ownership: in institutional holdings, loans, deposits, or bailment, title and custody may split. SAT can log custody changes but does not automatically overcome institutional policy, deaccession limits, liens, seizures, or legal transfer prohibitions.'
                ),
                pick(
                  isZh,
                  '若 listing 涉及實體標本，保管權移交應在交易備註或合約中寫明包裝標準、物流方式、風險移轉點、保險、驗收程序與保存條件（溫濕度、防蟲、禁運要求等）。平台可提供 provenance 更新介面，但不替代雙方對 custody 與 risk allocation 之約定。',
                  'When listings involve physical specimens, custody handover should specify packaging, logistics, risk transfer point, insurance, acceptance procedures, and storage conditions (climate, pest control, carrier restrictions) in notes or contracts. The platform may offer provenance update tools but does not replace parties\' custody and risk-allocation agreements.'
                ),
              ],
            },
            {
              q: pick(isZh, '含實體標本的 SAT 要注意什麼？', 'What should I watch for with physical-specimen SATs?'),
              paragraphs: [
                pick(
                  isZh,
                  '首先確認 listing 是否明確標示含實體標本或 physical specimen binding；未標示者不應假設可取得實體。其次應核對保存狀態、尺寸、材質、修復或製作紀錄、hero 與補充照片是否足以反映現況，以及賣方是否說明已知瑕疵或限制。',
                  'First confirm the listing explicitly states physical specimen inclusion or physical specimen binding—do not assume physical delivery if unstated. Then verify condition, dimensions, materials, repair or preparation history, whether hero and supplemental photos reflect current state, and whether the seller disclosed known defects or limits.'
                ),
                pick(
                  isZh,
                  '成交前應確認是否可以合法出口、進口、國內運送與投保；是否涉及 CITES 附錄、國內野保法、文化資產、化石或考古相關規定，以及博物館或機構 deaccession 政策。SAT 登錄或市集 listing 本身不能替代許可文件或機構核准。',
                  'Before closing, confirm lawful export, import, domestic shipment, and insurability; whether CITES appendices, domestic wildlife laws, cultural heritage, fossil or archaeological rules, or museum deaccession policies apply. SAT registration or marketplace listing does not substitute permits or institutional approval.'
                ),
                pick(
                  isZh,
                  '應在付款前確認交割方式、交貨地點、驗收標準與爭議處理，避免買方誤以為平台自動負責所有物流、報關、保險與合規。平台可協助記錄 custody 與 provenance 更新，但履約與法遵主要仍由交易雙方及其顧問負責。',
                  'Confirm delivery method, location, acceptance criteria, and dispute handling before payment—do not assume the platform automatically handles all logistics, customs, insurance, and compliance. The platform may log custody and provenance updates, but performance and compliance remain primarily with the parties and their advisors.'
                ),
              ],
            },
            {
              q: pick(isZh, '誰負責 CITES 與進出口許可？', 'Who is responsible for CITES and import/export permits?'),
              paragraphs: [
                pick(
                  isZh,
                  '原則上，CITES 附錄物種或受管制生物材料之國際貿易、國內移動許可，以及《名古屋議定書》下 ABS 義務，應由交易雙方自行確認並履行，必要時委託報關行、律師、保育或文化主管機關窗口、博物館合規人員或專業顧問協助。',
                  'In principle, parties must confirm and fulfill CITES international trade, domestic movement permits, and Nagoya Protocol ABS obligations—engaging customs brokers, lawyers, conservation or heritage authority contacts, museum compliance staff, or specialist advisors when needed.'
                ),
                pick(
                  isZh,
                  '平台可提供物種附錄提示、許可摘要欄位、風險提醒與 FAQ，但不代替法律審查、不代辦許可、不擔任報關代理人。即使 listing 顯示學名或附錄資訊，也不代表平台已確認該筆交易可合法跨境；買方所在地與賣方所在地法規都可能同時適用。',
                  'The platform may provide appendix hints, permit summary fields, risk notices, and FAQs but does not substitute legal review, obtain permits, or act as customs broker. Listing taxonomy or appendix info does not mean the platform confirmed lawful cross-border trade—buyer and seller jurisdictions may both apply.'
                ),
                pick(
                  isZh,
                  '若缺少必要許可、文件明顯不足或存在重大合規疑慮，平台得取消、暫停或限制交易，並保留紀錄。SAT 不能作為規避 CITES、進出口、機構政策或法律限制之工具；雙方不得僅因完成數位 checkout，即主張已合法完成實體跨境移動。',
                  'If required permits are missing, documents are inadequate, or major compliance concerns exist, the platform may cancel, suspend, or restrict transactions and preserve records. SAT must not be used to circumvent CITES, import/export, institutional policy, or legal limits—digital checkout alone does not establish lawful physical cross-border movement.'
                ),
              ],
            },
            {
              q: pick(isZh, '如果標本在運送中損壞或遺失怎麼辦？', 'What if a specimen is damaged or lost in transit?'),
              paragraphs: [
                pick(
                  isZh,
                  '實體標本損壞、遺失或與描述重大不符，應依 listing、交易條款、物流合約、保險條款與雙方書面約定處理。平台可能在正式環境中提供爭議申訴與紀錄保全，但不一定承擔物流承運人、報關行或保險公司之責任，也不當然成為所有損失之最終賠付方。',
                  'Damage, loss, or material mismatch should be handled per listing, transaction terms, carrier contracts, insurance terms, and written agreements. The platform may offer dispute appeals and record preservation in production but is not necessarily liable as carrier, broker, or insurer, nor the default payer for all losses.'
                ),
                pick(
                  isZh,
                  '成交前應明確約定風險移轉時間點，例如：交給物流業者時、跨越海關時、買方簽收時，或完成開箱驗收後。高價或易損標本建議使用專業包裝、保險、追蹤物流、溫控（若需要）與開箱錄影，並保留照片與溫度紀錄。',
                  'Agree risk transfer before closing—e.g., when handed to carrier, at customs, on buyer signature, or after unpacked acceptance. High-value or fragile specimens warrant professional packing, insurance, tracked shipping, temperature control if needed, unboxing video, and photo or temperature logs.'
                ),
                pick(
                  isZh,
                  '若因賣方包裝不當、標示錯誤、未申報禁運條件，或買方提供錯誤地址、延誤簽收、不當保存，責任分配可能不同。雙方應在交易前將這些細節寫清楚；平台可提供爭議流程框架，但無法取代雙方對物流與風險之具體安排。',
                  'Liability may differ if the seller packed improperly, mislabeled, or failed to disclose carrier restrictions—or if the buyer gave wrong addresses, delayed receipt, or stored improperly. Clarify these details before transaction; the platform may frame dispute processes but cannot replace specific logistics and risk arrangements.'
                ),
              ],
            },
            {
              q: pick(isZh, '敏感物種或稀有標本可以上架嗎？', 'Can sensitive-species or rare specimens be listed?'),
              paragraphs: [
                pick(
                  isZh,
                  '不一定可以，且「稀有」本身不構成可交易理由。平台應允許依風險調整公開程度，例如模糊 GPS、隱藏或延後公開採集者、限制下載、僅供審核者或白名單買方檢視，以降低盜獵、盜採或棲地破壞風險。',
                  'Not necessarily—and rarity alone is not grounds to trade. The platform should allow risk-based disclosure controls: obfuscated GPS, hidden or delayed collector identity, download restrictions, or reviewer/allowlist-only views to reduce poaching, illegal collection, or habitat harm.'
                ),
                pick(
                  isZh,
                  '若上架或公開方式可能導致違法交易、棲地暴露、違反機構政策，或違反 CITES、國內野保、文化資產或化石相關法規，平台得拒絕、限制公開或下架。保育與法律合規優先於市場流通；SAT 不能使受管制標本自動變成可自由販售。',
                  'If listing or disclosure could enable unlawful trade, habitat exposure, institutional policy violations, or breaches of CITES, domestic wildlife, cultural heritage, or fossil rules, the platform may reject, restrict, or delist. Conservation and legal compliance precede market circulation—SAT does not automatically make regulated specimens freely salable.'
                ),
                pick(
                  isZh,
                  '對保育類、CITES 附錄、文化資產、化石或高風險標本，平台可採更嚴格審查、人工覆核或要求補充來源與許可文件。賣方與機構應在上架前自行評估公開利益與風險；買方亦不得將取得之位置或影像資訊用於未授權之採集或交易。',
                  'For conservation-listed, CITES, heritage, fossil, or high-risk specimens, the platform may apply stricter review, manual approval, or require supplemental provenance and permits. Sellers and institutions should weigh public benefit versus risk before listing; buyers must not use obtained locality or imagery for unauthorized collection or trade.'
                ),
              ],
            },
          ],
        },
        {
          title: pick(isZh, 'F. 付款、費用、稅務、退款與交易安全', 'F. Payments, fees, tax, refunds & transaction security'),
          items: [
            {
              q: pick(isZh, '平台支援哪些付款方式？', 'Which payment methods does the platform support?'),
              paragraphs: [
                pick(
                  isZh,
                  '可選用之付款方式，依賣方於 listing 之設定與平台正式支援之支付管道而定，不同賣家、不同國家或不同資產類型可能有所差異。正式上線後，平台將另行公告實際啟用之方式；示範環境中顯示之選項僅供流程測試。',
                  'Available payment methods depend on seller listing settings and officially supported platform rails—varying by seller, country, or asset type. Production will publish enabled methods; demo options are for workflow testing only.'
                ),
                pick(
                  isZh,
                  '正式環境可能支援信用卡、銀行匯款、穩定幣（如 USDC、USDT）或其他經公告之付款方式；結帳前應顯示付款方式、幣別、手續費、平台服務費、稅費（若適用）與交易總額，讓買方在確認前理解完整成本。',
                  'Production may support credit cards, bank transfer, stablecoins (e.g., USDC, USDT), or other announced methods. Checkout should show payment method, currency, fees, platform service charges, taxes (if applicable), and total before confirmation.'
                ),
                pick(
                  isZh,
                  '示範環境中的付款為 mock，不會真實扣款、不產生銀行或鏈上債權債務。買方在正式交易前，應自行確認幣別、匯率、鏈上 gas、銀行手續費或信用卡附加費用，並保留付款紀錄以供對帳與爭議處理。',
                  'Demo payments are mock—no real charges or bank/on-chain obligations. Before live transactions, buyers should confirm currency, exchange rates, on-chain gas, bank fees, or card surcharges, and retain payment records for reconciliation and disputes.'
                ),
              ],
            },
            {
              q: pick(isZh, '使用 USDC、USDT 或 ETH 付款有什麼風險？', 'What are the risks of paying with USDC, USDT, or ETH?'),
              paragraphs: [
                pick(
                  isZh,
                  '區塊鏈交易在許多情況下具有不可逆性：使用者須自行確認收款錢包地址、鏈別（network）、代幣種類（contract）與金額是否與結帳頁面一致。傳錯鏈、傳錯地址、使用平台未支援之代幣，或遭社交工程誘導轉帳至陌生錢包，可能造成無法追回之損失。',
                  'Blockchain transactions are often irreversible: verify wallet address, network, token contract, and amount match checkout. Wrong chain, wrong address, unsupported tokens, or social-engineering transfers to unknown wallets may cause unrecoverable loss.'
                ),
                pick(
                  isZh,
                  '鏈上 gas 費用、匯率波動、交易壅塞、節點延遲或錢包軟體問題，通常由使用者自行承擔，除非正式服務條款對特定情境另有約定。平台不應承諾代幣價格穩定、固定匯率或保證入帳時間；入帳確認依鏈上確認數與平台對帳流程而定。',
                  'Gas costs, exchange volatility, congestion, node delays, or wallet issues are usually borne by users unless formal terms provide otherwise. The platform should not promise token price stability, fixed rates, or guaranteed crediting times—confirmation depends on chain confirmations and platform reconciliation.'
                ),
                pick(
                  isZh,
                  '使用加密資產付款前，建議先以小額測試、核對官方公告之支援鏈別，並避免在平台外私下改匯至賣方個人錢包。若對鏈上付款不熟悉，可優先選擇傳統支付方式，或諮詢合格顧問；平台 FAQ 不構成投資或加密資產操作建議。',
                  'Before crypto payment, test small amounts, verify officially supported networks, and avoid off-platform transfers to seller personal wallets. If unfamiliar with on-chain payment, prefer traditional rails or consult qualified advisors—this FAQ is not crypto investment or operational advice.'
                ),
              ],
            },
            {
              q: pick(isZh, '平台會收取哪些費用？', 'What fees may the platform charge?'),
              paragraphs: [
                pick(
                  isZh,
                  '正式上線後，單筆交易可能涉及多項費用，例如平台服務費、支付處理手續費、鏈上 gas（若由買方或賣方負擔）、提領費、匯款費、物流費、保險費或依法律須揭露之稅費。實際項目與負擔方（買方／賣方）以結帳頁與正式公告為準。',
                  'After launch, a transaction may include platform service fees, payment processing fees, on-chain gas (if borne by buyer or seller), withdrawal fees, wire fees, logistics, insurance, or legally required taxes. Items and payers (buyer/seller) follow checkout and official notices.'
                ),
                pick(
                  isZh,
                  '每筆交易應在結帳前清楚揭露費用明細與交易總額，避免成交後才出現未預期成本。示範環境顯示之費率、百分比或金額均為占位或測試值，不代表正式上線價格；請勿依示範費用做財務規劃。',
                  'Fees and totals should be disclosed before checkout to avoid post-sale surprises. Demo fee rates, percentages, or amounts are placeholders—not production pricing. Do not plan finances based on demo fees.'
                ),
                pick(
                  isZh,
                  '費用可能因付款方式、買賣雙方所在地、幣別、鏈別、賣家設定或資產類型而不同。平台保留調整正式環境費率之權利，但應以合理方式事先或事後公告；已完成交易之費用，原則上依交易當下結帳頁與適用條款判斷。',
                  'Fees may vary by payment method, party locations, currency, chain, seller settings, or asset type. The platform may adjust production fee schedules with reasonable notice; fees for completed transactions generally follow checkout at settlement and applicable terms.'
                ),
              ],
            },
            {
              q: pick(isZh, '稅務由誰負責？', 'Who is responsible for taxes?'),
              paragraphs: [
                pick(
                  isZh,
                  '買賣雙方需自行負責其所在地之稅務義務，可能包括但不限於營業稅、所得稅、進口稅、關稅、扣繳、加密資產相關申報或其他法定申報。平台不提供個人化稅務建議，交易紀錄與收據（若正式環境提供）僅供參考，不構成會計或稅務意見。',
                  'Buyers and sellers are responsible for tax obligations in their jurisdictions—VAT, income tax, import duties, customs, withholding, crypto reporting, or other filings. The platform does not provide personalized tax advice; records and receipts (if offered) are references, not accounting or tax opinions.'
                ),
                pick(
                  isZh,
                  '跨國交易可能同時涉及出口國、進口國與平台營運地之稅務規則，複雜度因個案而異。賣方應自行確認是否需要開立發票、收據、報關文件或申報收入；買方若需報帳、抵扣或進口報關，應在交易前向賣方與平台確認可取得之文件類型與開立時程。',
                  'Cross-border deals may trigger rules in export, import, and platform jurisdictions—complexity varies by case. Sellers should confirm invoicing, receipts, customs documents, or income reporting; buyers needing reimbursement, deductions, or import clearance should confirm document types and timing before purchase.'
                ),
                pick(
                  isZh,
                  '重大或高金額交易，建議雙方諮詢合格會計師或稅務顧問。平台可在正式環境中提供交易摘要匯出，協助對帳，但不替代雙方之申報責任。',
                  'For material or high-value transactions, both parties should consult qualified accountants or tax advisors. The platform may offer transaction summary exports in production for reconciliation but does not replace filing obligations.'
                ),
              ],
            },
            {
              q: pick(isZh, '可以退款嗎？', 'Can I get a refund?'),
              paragraphs: [
                pick(
                  isZh,
                  '是否可退款，依正式交易規則、listing 條款、賣家政策與付款方式而定；示範環境不提供真實退款。數位授權一旦依約交付、開放下載或買方已實際使用，可能不適用一般實體商品之無理由退貨邏輯，具體以正式條款與該筆 listing 載明為準。',
                  'Refunds depend on formal transaction rules, listing terms, seller policy, and payment method—the demo offers no real refunds. Once digital licenses are delivered, downloads enabled, or use begins, no-reason returns may not apply as for physical goods—per formal terms and the listing.'
                ),
                pick(
                  isZh,
                  '若涉及重大資料錯誤、未取得有效授權、listing 與交付內容不符、實體標本未依約寄出或嚴重與描述不符等情況，買方可能依正式爭議流程申請退款、部分退款或重新交付。若僅因買方改變心意、誤解授權範圍但未先閱讀 listing，是否退款應依賣家政策與平台條款個案處理。',
                  'Material data errors, invalid licenses, delivery mismatch, undelivered physical specimens, or serious description mismatch may allow refund, partial refund, or redelivery via formal dispute flows. Change of mind or misunderstanding license without reading the listing is handled per seller policy and platform terms case by case.'
                ),
                pick(
                  isZh,
                  '平台應在正式上線前，將退款條件、時限、證據要求、chargeback 與鏈上不可逆付款之特殊規則寫清楚。買方應保留交易快照、付款紀錄與溝通紀錄；賣方應保留交付證明。平台可協調流程，但不保證所有爭議均能以退款結束。',
                  'Before launch, refund conditions, deadlines, evidence requirements, chargeback rules, and special rules for irreversible on-chain payment should be published clearly. Buyers should keep snapshots, payment records, and communications; sellers should keep delivery proof. The platform may coordinate but does not guarantee every dispute ends in refund.'
                ),
              ],
            },
            {
              q: pick(isZh, '如何避免交易詐騙？', 'How can I avoid transaction fraud?'),
              paragraphs: [
                pick(
                  isZh,
                  '請勿在平台外私下付款、跳過正式 checkout、或依陌生訊息指示轉帳至未在結帳頁顯示之錢包或帳戶。對「保證升值、快速轉售、限時私下折扣、代操盤、穩賺不賠」等表述應提高警覺；SAT 之設計目的在於科學資產登錄與授權，不是投資理財商品。',
                  'Do not pay off-platform, skip formal checkout, or transfer per unknown messages to wallets or accounts not shown at checkout. Be alert to guaranteed appreciation, quick flips, private discounts, managed trading, or risk-free profit claims—SAT is for scientific registration and licensing, not investment products.'
                ),
                pick(
                  isZh,
                  '交易前應檢查 SAT ID、驗證狀態說明（非絕對保證）、賣方或機構身份、授權條款、是否含實體標本、法規限制與交易快照內容。高價或含實體交易，可要求更多來源文件、補充照片、視訊驗貨或第三方鑑定，並避免在證據不足時倉促付款。',
                  'Before paying, verify SAT ID, verification descriptions (not absolute guarantees), seller or institution identity, license terms, physical specimen flags, regulatory limits, and transaction snapshot content. For high-value or physical deals, request provenance documents, extra photos, video inspection, or third-party appraisal—avoid rushed payment without evidence.'
                ),
                pick(
                  isZh,
                  '平台可針對異常交易、疑似洗售、盜用資料、詐騙帳號、偽造 provenance 或規避費用等行為，採取限制下單、暫停提領、隱藏 listing 或暫停帳號等措施，以保護其他使用者與平台安全。若懷疑詐騙，請透過官方申訴管道通報並保留證據，勿與可疑對象私下和解後放棄通報。',
                  'The platform may restrict orders, suspend withdrawals, hide listings, or suspend accounts for abnormal trades, suspected wash trading, stolen data, fraud accounts, fake provenance, or fee evasion—to protect users and platform security. Report suspected fraud via official channels with evidence; do not privately settle with suspicious parties and forgo reporting.'
                ),
              ],
            },
          ],
        },
        {
          title: pick(isZh, 'G. 隱私、敏感物種、資料公開與下架', 'G. Privacy, sensitive species, disclosure & delisting'),
          items: [
            {
              q: pick(isZh, '平台會公開哪些資料？', 'What data does the platform disclose publicly?'),
              paragraphs: [
                pick(
                  isZh,
                  '公開範圍依個別 SAT／listing 之設定、授權類型、機構政策與平台公開規則而定，並非所有欄位對所有人可見。一般可能公開者包括：學名、類別或資產類型、概略產地（若政策允許）、hero 照片、SAT ID、授權摘要、驗證狀態說明，以及經篩選之 provenance 事件摘要。',
                  'Public scope depends on each SAT/listing settings, license type, institutional policy, and platform disclosure rules—not all fields are visible to everyone. Commonly public items may include scientific name, category or asset type, general locality (if policy allows), hero photo, SAT ID, license summary, verification descriptions, and filtered provenance event summaries.'
                ),
                pick(
                  isZh,
                  '不一定公開者包括：精確 GPS、採集者全名、私人地址、電話、電子郵件、未公開之機構內部文件、敏感物種精確位置，或僅供審核／白名單使用者檢視之欄位。賣方與機構上架前應逐欄檢查哪些資訊會對外顯示，並利用平台預覽功能確認公開效果。',
                  'May not be public: precise GPS, full collector names, private addresses, phone, email, unreleased internal institutional documents, sensitive-species precise locations, or reviewer/allowlist-only fields. Sellers and institutions should review each field before listing and use platform preview to confirm public display.'
                ),
                pick(
                  isZh,
                  '買方與引用者取得公開資料後，仍須遵守 listing 授權與原欄位之公開範圍，不得透過重新組合、交叉比對或外連資料，還原已受保護之精確位置或個人身分。平台得依政策調整預設公開層級，以降低誤公開風險。',
                  'After obtaining public data, buyers and citers must comply with listing licenses and original disclosure scope—must not reconstruct protected precise locations or identities via recombination, cross-matching, or external linkage. The platform may adjust default disclosure tiers to reduce accidental over-exposure.'
                ),
              ],
            },
            {
              q: pick(isZh, '為什麼精確 GPS 可能被隱藏？', 'Why may precise GPS be hidden?'),
              paragraphs: [
                pick(
                  isZh,
                  '對稀有物種、化石產地、礦物點、繁殖地、保育熱點或受威脅棲地而言，公開精確座標可能增加盜獵、盜採、非法採集或棲地破壞風險。平台因此可能對外僅顯示模糊化位置，例如國家、縣市、行政區、保護區名稱或網格（grid）層級，而非精確經緯度。',
                  'For rare species, fossil localities, mineral sites, breeding areas, conservation hotspots, or threatened habitats, precise coordinates may increase poaching, illegal collection, or habitat harm. The platform may show obfuscated locations—country, county, district, protected area name, or grid level—rather than exact coordinates.'
                ),
                pick(
                  isZh,
                  '經授權之研究者、機構審核者或白名單買方，可能在權限範圍內存取較精確資料，以支援合法研究、典藏或合規交易。位置模糊化旨在保護生態與資料提供者，並非刻意降低科學資料價值；引用公開版本時，應使用平台提供之概略位置表述。',
                  'Authorized researchers, institutional reviewers, or allowlisted buyers may access more precise data within permissions for lawful research, curation, or compliant trade. Obfuscation protects ecology and data providers—it does not intentionally devalue science; cite using the platform\'s general locality as published.'
                ),
                pick(
                  isZh,
                  '買方若因研究、鑑定或合規需要更精確位置，應先確認 listing 授權、賣方或機構是否允許該用途，並遵守適用法規與機構政策。不得將取得之精確位置用於未授權採集、商業開發或再公開。',
                  'Buyers needing precise locality for research, appraisal, or compliance should confirm listing license and seller or institutional permission for that use, and comply with law and institutional policy. Do not use precise locality for unauthorized collection, commercial exploitation, or re-publication.'
                ),
              ],
            },
            {
              q: pick(isZh, '採集者或持有人個資如何保護？', 'How is collector or holder personal data protected?'),
              paragraphs: [
                pick(
                  isZh,
                  '採集者姓名、聯絡方式、私人地址、身分證字號或其他可識別個人身分之資料，可能受個人資料保護法、GDPR 或機構倫理規範約束。平台應支援匿名代碼、機構名義上架、欄位分級公開、限制下載或僅限審核者可見等控制措施。',
                  'Collector names, contact details, private addresses, ID numbers, or other identifying personal data may be subject to PDPA, GDPR, or institutional ethics. The platform should support anonymous codes, institutional listing names, tiered disclosure, download restrictions, or reviewer-only visibility.'
                ),
                pick(
                  isZh,
                  '賣方不應上傳未經當事人同意之他人個資，亦不應將私人聯絡方式嵌入公開影像或備註。若資料來自歷史標籤、舊典藏紀錄或公開資料庫，仍須注意二次利用、再散布與商業化是否超出原公開目的或授權範圍。',
                  'Sellers must not upload others\' personal data without consent or embed private contact details in public images or notes. Data from historical labels, legacy collection records, or public databases still requires checking whether reuse, redistribution, or commercialization exceeds original purpose or license.'
                ),
                pick(
                  isZh,
                  '正式環境中，當事人得依 MCurator 隱私政策與適用法規，申請更正、限制公開、遮蔽或刪除不必要之個資（在不破壞必要科學追溯前提下）。示範環境請勿輸入真實敏感個資，以免測試資料外洩或誤用。',
                  'In production, data subjects may request correction, restricted disclosure, redaction, or deletion of unnecessary personal data per MCurator privacy policy and applicable law—without breaking necessary scientific traceability where possible. Do not enter real sensitive personal data in the demo.'
                ),
              ],
            },
            {
              q: pick(isZh, '可以要求下架或更正資料嗎？', 'Can I request delisting or data correction?'),
              paragraphs: [
                pick(
                  isZh,
                  '使用者、權利人、機構或資料當事人得透過平台申請下架或更正，但是否受理及處置方式，依申請理由、證據強度、listing 狀態與適用政策個案判斷。常見理由包括：著作權或其他智慧財產權侵權、個資不當公開、敏感物種位置過度揭露、來源錯誤、未授權使用、重大錯誤學名或違法交易疑慮。',
                  'Users, rights holders, institutions, or data subjects may request delisting or correction—acceptance and action depend on grounds, evidence, listing status, and policy case by case. Common grounds: copyright or IP infringement, improper personal data exposure, excessive sensitive-species locality disclosure, provenance errors, unauthorized use, material taxonomic errors, or unlawful trade concerns.'
                ),
                pick(
                  isZh,
                  '平台可先暫時隱藏爭議內容、限制下載或暫停交易，並要求申請人與 listing 賣方補件。若屬科學名稱更新或欄位修正，通常優先採追加 provenance 事件與保留歷史紀錄，而非刪除全部 SAT 歷史，以維護引用鏈與交易透明度。',
                  'The platform may temporarily hide disputed content, restrict downloads, or suspend transactions and request supplements from applicant and lister. For taxonomic updates or field fixes, prefer adding provenance events and retaining history rather than deleting entire SAT history—to preserve citation chains and transaction transparency.'
                ),
                pick(
                  isZh,
                  '下架、隱藏或限制公開可能是風險控管措施，不一定代表平台已認定法律責任成立或申訴內容完全屬實。雙方仍可在正式爭議或司法程序中提出證據；平台將依服務條款保存必要紀錄。',
                  'Delisting, hiding, or restricting disclosure may be risk controls—not necessarily a final legal finding or full admission of claims. Parties may still present evidence in formal disputes or courts; the platform preserves necessary records per terms of service.'
                ),
              ],
            },
            {
              q: pick(isZh, '使用者可以刪除 provenance 嗎？', 'Can users delete provenance?'),
              paragraphs: [
                pick(
                  isZh,
                  '一般情況下，不應允許使用者任意刪除或覆寫 append-only 來源履歷（provenance）。Provenance 的價值在於記錄資產生命週期中的登錄、修正、授權變更、保管移轉與驗證覆核，以保護買方、賣方、研究者與平台在事後爭議時可回溯當時資訊。',
                  'Generally, users should not arbitrarily delete or overwrite append-only provenance. Provenance records registration, corrections, license changes, custody transfers, and verification reviews across an asset\'s lifecycle—protecting buyers, sellers, researchers, and the platform in later disputes.'
                ),
                pick(
                  isZh,
                  '若發現錯誤，應使用更正事件、撤回事件、註解事件或新的 provenance entry 說明修正依據，而不是直接刪除歷史節點。此做法同時維護科學可追溯性與交易誠信，避免「成交後洗白履歷」。',
                  'When errors occur, use correction, retraction, annotation, or new provenance entries with basis—not delete historical nodes. This preserves scientific traceability and transaction integrity and prevents post-sale history laundering.'
                ),
                pick(
                  isZh,
                  '涉及個資、違法內容、法院命令或主管機關要求時，平台得依正式政策對特定欄位或事件進行遮蔽、限制公開或停止散布，而不必然刪除整條科學紀錄。此平衡旨在同時符合個資法規、執法需求與資料可追溯原則。',
                  'For personal data, unlawful content, court orders, or authority requests, the platform may redact, restrict, or stop distribution of specific fields or events per formal policy—without necessarily deleting entire scientific records. This balances privacy law, enforcement needs, and traceability.'
                ),
              ],
            },
          ],
        },
        {
          title: pick(isZh, 'H. 爭議處理、申訴、責任限制與正式上線差異', 'H. Disputes, appeals, liability limits & launch differences'),
          items: [
            {
              q: pick(isZh, '發生爭議時怎麼處理？', 'How are disputes handled?'),
              paragraphs: [
                pick(
                  isZh,
                  '發生爭議時，使用者應先透過平台官方申訴入口提交：SAT ID、交易編號（若有）、問題類型、具體描述，以及 SAT ID 頁面截圖、listing 快照、付款紀錄、溝通紀錄、開箱影片、鑑定或來源文件等可驗證證據。示範環境若無真實交易，請以產品回饋管道反映介面問題。',
                  'For disputes, submit via the official appeal channel: SAT ID, transaction ID (if any), issue type, detailed description, and verifiable evidence—SAT page screenshots, listing snapshots, payment records, communications, unboxing video, appraisal or provenance documents. In demo without real transactions, use product feedback for UI issues.'
                ),
                pick(
                  isZh,
                  '平台可依爭議類型採取暫停交割、暫停提領、隱藏 listing、要求雙方補件、通知對方限期回覆等措施。常見爭議包括：授權不符、元資料重大錯誤、實體未交付、標本損壞或與描述不符、侵權疑慮、CITES 或法規疑慮、驗證徽章誤用等。',
                  'The platform may hold settlement, suspend withdrawals, hide listings, request supplements, or notify the other party to respond. Common disputes: license mismatch, material metadata errors, non-delivery, damage or description mismatch, infringement concerns, CITES or regulatory concerns, verification badge misuse.'
                ),
                pick(
                  isZh,
                  '平台之初步審查與暫時措施，旨在降低損害擴大與保存證據，不代表最終法律判斷或對任一方過失之終局認定。正式爭議流程、時限、調解／仲裁與終局處置，仍以服務條款、賣家協議及個別交易條款為準。',
                  'Preliminary review and interim measures aim to limit harm and preserve evidence—not final legal findings or fault determinations. Formal dispute timelines, mediation/arbitration, and final disposition remain per terms of service, seller agreements, and individual transaction terms.'
                ),
              ],
            },
            {
              q: pick(isZh, '平台是否負責所有買賣糾紛？', 'Is the platform responsible for all buyer–seller disputes?'),
              paragraphs: [
                pick(
                  isZh,
                  '平台會提供申訴入口、紀錄保存、listing 快照、基本風險控管與必要之協調流程，協助買賣雙方在平台規則框架內處理爭議。然而，平台不應被理解為每筆交易之全面保證人或最終賠償方。',
                  'The platform provides appeal channels, record preservation, listing snapshots, basic risk controls, and coordination within platform rules. It should not be understood as a universal guarantor or final payer for every transaction.'
                ),
                pick(
                  isZh,
                  '賣方對其提供之資料真實性、授權合法性、listing 標示（含是否含實體）、影像與文字權利，以及實體標本之交付與描述相符性，原則上負主要說明與履約責任。買方對其用途是否符合授權、是否遵守法規、稅務申報與資料使用方式，原則上負主要確認責任。',
                  'Sellers are primarily responsible for data truthfulness, license legality, listing labels (including physical inclusion), image and text rights, and physical delivery and description accuracy. Buyers are primarily responsible for use within license, regulatory compliance, tax filing, and data use practices.'
                ),
                pick(
                  isZh,
                  '平台不應被視為每筆標本之鑑定人、物流承運人、報關行、保險公司或法律顧問。正式條款中可能設定責任上限、排除間接損害或限定救濟方式；此為權責清楚、流程透明之安排，並非逃避對惡意或重大違規行為之必要處置。',
                  'The platform is not each specimen\'s appraiser, carrier, customs broker, insurer, or legal advisor. Formal terms may cap liability, exclude indirect damages, or limit remedies—clear allocation and transparent process, not immunity from action against fraud or serious violations.'
                ),
              ],
            },
            {
              q: pick(isZh, '如果 SAT 資料後來被證明錯誤，買方有什麼權利？', 'What rights does a buyer have if SAT data is later proven wrong?'),
              paragraphs: [
                pick(
                  isZh,
                  '買方可用之救濟，依錯誤性質、對交易核心價值之影響程度，以及正式條款與 listing 快照而定。輕微錯字、格式問題或非核心欄位之分類更新，通常以更正資料、追加 provenance 事件或賣方補件方式處理，而非自動全額退款。',
                  'Buyer remedies depend on error nature, impact on core transaction value, formal terms, and listing snapshots. Minor typos, format issues, or non-core taxonomic updates usually mean corrections, added provenance events, or seller supplements—not automatic full refunds.'
                ),
                pick(
                  isZh,
                  '若屬重大錯誤——例如物種或保護等級嚴重誤標、是否含實體標本錯誤、授權不實、來源造假、驗證狀態重大誤導——買方可能依正式爭議流程申請退款、撤銷交易、重新審查或要求賣方承擔相應責任。平台應保留交易當下之 listing 與 metadata 快照，避免事後單方改寫條件。',
                  'Material errors—serious species or protection mislabeling, wrong physical inclusion, false licensing, fabricated provenance, materially misleading verification—may allow refund, transaction reversal, re-review, or seller accountability via formal dispute flows. The platform should retain listing and metadata snapshots at transaction time.'
                ),
                pick(
                  isZh,
                  '買方發現問題後應盡合理時間內提出申訴並提供可驗證證據（如第三方鑑定、文獻、館藏比對、物流或開箱紀錄）。逾期提出可能影響可主張之救濟；具體時限以正式條款為準。平台可協調，但不保證所有科學爭議均能以單一標準自動裁決。',
                  'Buyers should appeal within a reasonable time with verifiable evidence (third-party appraisal, literature, collection comparison, logistics or unboxing records). Late claims may affect available remedies—deadlines per formal terms. The platform may coordinate but does not guarantee automatic adjudication of all scientific disputes.'
                ),
              ],
            },
            {
              q: pick(isZh, '如果買方違反授權，賣方有什麼權利？', 'What rights does a seller have if a buyer violates the license?'),
              paragraphs: [
                pick(
                  isZh,
                  '賣方（或原始權利人）得向平台申訴，提供買方超出授權範圍使用之證據，例如未授權商用、移除署名、擅自再授權、公開散布可下載檔案，或將 SAT 影像用於 listing 未允許之用途。平台得要求買方停止使用、移除已發布內容、補購授權、限制下載或暫停帳號功能。',
                  'Sellers (or original rights holders) may complain to the platform with evidence of use beyond license—unauthorized commercial use, removed attribution, sublicensing, public redistribution of downloadable files, or SAT imagery used outside listing permissions. The platform may require cessation, takedown, supplemental licensing, download restrictions, or account suspension.'
                ),
                pick(
                  isZh,
                  '平台應保存授權紀錄、交易快照與 listing 條款，協助釐清買方於成交時實際取得之權利範圍。買方不得以「已購買 SAT」或「已付費」為由，逕自擴張解釋為完整著作權、獨占商用或再授權權。',
                  'The platform should preserve license records, transaction snapshots, and listing terms to clarify rights at settlement. Buyers may not expand payment into full copyright, exclusive commercial rights, or sublicensing by default.'
                ),
                pick(
                  isZh,
                  '嚴重或持續侵權，權利人仍可能另行採取法律行動；平台之處置為平台治理措施，不代替法院或仲裁之終局裁判。賣方亦應確保 listing 授權標示清楚，以降低雙方對可用範圍之誤解。',
                  'Serious or ongoing infringement may still lead to legal action by rights holders; platform actions are governance—not court or arbitral final judgment. Sellers should also ensure clear license labels to reduce misunderstanding of permitted scope.'
                ),
              ],
            },
            {
              q: pick(isZh, '平台可以暫停帳號或限制交易嗎？', 'Can the platform suspend accounts or restrict transactions?'),
              paragraphs: [
                pick(
                  isZh,
                  '可以。若使用者涉及詐騙、侵權、違法標本交易、虛假或重大不實資料、洗售、規避平台費用、干擾系統、濫用申訴、冒用身份或危害其他使用者與平台安全，平台得暫停帳號、限制上架、限制下單、暫停提領或停止特定功能，以進行調查與風險控管。',
                  'Yes. For fraud, infringement, unlawful specimen trade, false or materially misleading data, wash trading, fee evasion, system interference, appeal abuse, identity misuse, or harm to users and platform security, the platform may suspend accounts, restrict listing or orders, hold withdrawals, or disable features for investigation and risk control.'
                ),
                pick(
                  isZh,
                  '對一般善意錯誤或資料不完整，平台通常先要求補正、限期更正或限制公開範圍，而非立即永久封禁。對高風險或可能擴大損害之情境，平台可先暫停再調查，並在必要時通知相關交易對手方保留證據。',
                  'For good-faith errors or incomplete data, the platform usually requests correction, deadlines, or disclosure limits before permanent bans. For high-risk or expanding harm, it may suspend first and investigate, notifying counterparties to preserve evidence when needed.'
                ),
                pick(
                  isZh,
                  '正式上線後，服務條款應明確列出可能觸發限制措施之行為類型、通知方式與申訴管道。限制措施旨在維護市場安全與權利人利益，並非對所有使用者一體適用之懲罰；個案將依證據與嚴重程度處理。',
                  'After launch, terms should list behaviors triggering restrictions, notice methods, and appeal channels. Restrictions protect market safety and rights holders—not uniform punishment; cases are handled by evidence and severity.'
                ),
              ],
            },
            {
              q: pick(isZh, 'FAQ 與正式條款不一致時，以哪個為準？', 'If the FAQ conflicts with formal terms, which prevails?'),
              paragraphs: [
                pick(
                  isZh,
                  '若本 FAQ 與正式服務條款、隱私政策、賣家協議、個別 listing 條款或交易合約內容不一致，以正式法律文件及該筆交易之個別約定為準。FAQ 是協助理解產品邏輯與常見情境的白話說明，不取代正式條款，也不構成對任何一方之額外保證。',
                  'If this FAQ conflicts with terms of service, privacy policy, seller agreements, individual listing terms, or transaction contracts, the formal legal documents and that transaction\'s specific terms prevail. The FAQ is plain-language guidance—it does not replace formal terms or create extra guarantees.'
                ),
                pick(
                  isZh,
                  '平台可能因產品更新、法規變動、支付或上鏈策略調整、爭議處理實務而修訂 FAQ；修訂後版本通常適用於修訂後之新交易與新 listing。對已完成之交易，應依交易當時適用之條款、listing 快照、checkout 紀錄與付款條件判斷雙方權利義務。',
                  'The platform may revise FAQs for product updates, legal changes, payment or on-chain strategy, or dispute practice—revised FAQs typically apply to new transactions and listings after revision. For completed transactions, rights and obligations follow terms, listing snapshots, checkout records, and payment conditions at transaction time.'
                ),
                pick(
                  isZh,
                  '此原則旨在權責清楚、流程透明、風險可控：使用者可借助 FAQ 快速理解，但在重大交易、跨境移動、商用授權或含實體標本情境，仍應閱讀正式條款並在必要時諮詢專業顧問。示範環境之任何說明，均不構成正式上線前之具約束力承諾。',
                  'This principle keeps roles clear, processes transparent, and risks manageable: use the FAQ for quick understanding, but for major deals, cross-border moves, commercial licensing, or physical specimens, read formal terms and consult advisors when needed. Demo descriptions are not binding pre-launch commitments.'
                ),
              ],
            },
          ],
        },
      ],
      legalTitle: pick(isZh, '法律聲明與免責', 'Legal notices & disclaimers'),
      legal: [
        {
          title: pick(isZh, '1. 示範環境免責', '1. Demo environment disclaimer'),
          paragraphs: [
            pick(
              isZh,
              '本 SAT 說明頁與市集介面為產品開發與教育示範用途。所有資產、價格、驗證狀態、交易紀錄、錢包地址與區塊鏈網路名稱，除非另有書面聲明，均為虛構或測試資料，不構成要約、要約邀請或具約束力之交易。',
              'This SAT guide and marketplace UI are for product development and educational demonstration. Unless otherwise stated in writing, assets, prices, verification states, transaction records, wallet addresses, and network names are fictional or test data and do not constitute an offer, invitation to treat, or binding transaction.'
            ),
          ],
        },
        {
          title: pick(isZh, '2. 非投資或金融建議', '2. No investment or financial advice'),
          paragraphs: [
            pick(
              isZh,
              'MCurator 及其關係企業不提供證券、期貨、加密資產或任何金融商品之投資建議。SAT 不應被解釋為收益憑證、基金單位或保證獲利之工具。使用者應自行諮詢合格之法律、稅務與財務顧問。',
              'MCurator and affiliates do not provide investment advice regarding securities, derivatives, crypto assets, or other financial products. SAT must not be interpreted as a yield instrument, fund unit, or guaranteed-profit vehicle. Consult qualified legal, tax, and financial advisors.'
            ),
          ],
        },
        {
          title: pick(isZh, '3. 科學與元資料準確性', '3. Scientific & metadata accuracy'),
          paragraphs: [
            pick(
              isZh,
              '平台盡力呈現賣家或機構提供之資料，但不保證學名定名、年代測定、產地標示、分類階層或影像與實體標本之一致性。任何科學結論應由使用者自行查證原始文獻、標本或權威資料庫（如 GBIF、Catalogue of Life）。',
              'The platform displays seller- or institution-provided data but does not warrant taxonomic identification, geochronology, locality, classification, or image–specimen consistency. Verify scientific conclusions against primary literature, specimens, or authoritative databases (e.g., GBIF, Catalogue of Life).'
            ),
          ],
        },
        {
          title: pick(isZh, '4. 智慧財產權', '4. Intellectual property'),
          paragraphs: [
            pick(
              isZh,
              '標本影像、圖版、描述文字與衍生資料之著作權、資料庫權利或其他 IP 仍歸原權利人所有，除非授權條款或合約明示讓與。取得 SAT 或授權不代表取得底層影像之完整著作财产权；超出授權範圍之複製、改作或商業利用可能構成侵權。',
              'Copyright, database rights, or other IP in images, plates, text, and derivatives remain with rights holders unless the license or contract explicitly assigns them. Acquiring an SAT or license does not grant full copyright in underlying imagery; reproduction, adaptation, or commercial use beyond license scope may infringe.'
            ),
          ],
        },
        {
          title: pick(isZh, '5. 野生動植物貿易與法規遵循', '5. Wildlife trade & regulatory compliance'),
          paragraphs: [
            pick(
              isZh,
              '使用者須自行遵守 CITES、各國進出口法、遺跡與化石法規、生物安全法、文化資產法及機構倫理規範。平台不審查每筆交易之合法性，也不對因違法採集、走私、未授權出口或錯誤許可證導致之損害負責。',
              'Users must comply with CITES, import/export laws, heritage and fossil rules, biosafety laws, cultural property laws, and institutional ethics. The platform does not vet every transaction\'s legality and is not liable for damages from illegal collection, smuggling, unauthorized export, or incorrect permits.'
            ),
          ],
        },
        {
          title: pick(isZh, '6. 責任限制', '6. Limitation of liability'),
          paragraphs: [
            pick(
              isZh,
              '在法律允許之最大範圍內，MCurator 對因使用或無法使用本服務、示範資料錯誤、第三方 API 中斷、標本損壞、運送延誤或授權爭議所致之間接、附帶、懲罰性或衍生損害不負責，即使已被告知該等損害之可能性。正式服務之責任上限將於上線條款中載明。',
              'To the maximum extent permitted by law, MCurator is not liable for indirect, incidental, punitive, or consequential damages from use or inability to use the service, demo data errors, third-party API outages, specimen damage, shipping delay, or license disputes, even if advised of such possibility. Liability caps for live service will be stated in launch terms.'
            ),
          ],
        },
        {
          title: pick(isZh, '7. 準據法與爭議解決（草案）', '7. Governing law & disputes (draft)'),
          paragraphs: [
            pick(
              isZh,
              '正式服務條款將指定適用法律與管轄法院或仲裁機構。本示範頁面不產生合約關係。若您對草案條款有疑問，請聯繫 legal@mcreator.example（示範信箱，正式上線前將更新）。',
              'Live terms of service will specify governing law and courts or arbitration. This demo page creates no contractual relationship. Questions about draft terms: legal@mcreator.example (placeholder until launch).'
            ),
          ],
        },
        {
          title: pick(isZh, '8. 條款變更', '8. Changes to terms'),
          paragraphs: [
            pick(
              isZh,
              'MCurator 保留更新 SAT 框架說明、市集規則、費率與生態回饋計畫之權利。重大變更將於正式環境以合理方式通知已註冊使用者；繼續使用即視為接受更新後條款（以正式條款文字為準）。',
              'MCurator may update SAT framework descriptions, marketplace rules, fees, and ecology programs. Material changes in production will be notified to registered users reasonably; continued use may constitute acceptance of updated terms (as written in live terms).'
            ),
          ],
        },
      ],
      jurisdictionalLegalTitle: pick(isZh, '三法域法律聲明與合規提醒', 'Tri-jurisdiction legal notice & compliance'),
      jurisdictionalLegal: {
        intro: pick(
          isZh,
          '本區塊係為協助使用者理解 SAT 科學資產代幣在跨境展示、授權、付款、標本保管、資料處理與交易流程中可能涉及之法律風險。由於 MCurator 可能服務不同國家或地區之賣方、買方、機構、研究者與一般使用者，實際適用法律可能因使用者所在地、賣方所在地、標本所在地、付款方式、資料儲存地、實體交付地、物種保護狀態及個別 listing 條款而不同。本頁內容僅為平台使用說明與風險提示，不構成法律、稅務、投資、金融、進出口、報關、保育、鑑定或會計意見。',
          'This section helps users understand legal risks that may arise when SAT scientific asset tokens are displayed, licensed, paid for, custodied, processed, or traded across borders. MCurator may serve sellers, buyers, institutions, researchers, and general users in different countries or regions; applicable law may vary by user location, seller location, specimen location, payment method, data storage location, physical delivery location, species protection status, and individual listing terms. This page is platform guidance and risk notice only—not legal, tax, investment, financial, import/export, customs, conservation, appraisal, or accounting advice.'
        ),
        sections: [
          {
            title: pick(isZh, '1. 法域適用不確定性', '1. Jurisdictional uncertainty'),
            paragraphs: [
              pick(
                isZh,
                'SAT 相關交易、授權、資料展示與（若適用）實體標本移轉，可能同時觸及台灣、美國、日本或其他國家／地區之法律與主管機關要求。單一交易不一定只適用一個法域；也可能因交易階段不同（上架、付款、交付、引用、下架）而涉及不同規範層級。',
                'SAT-related transactions, licensing, data display, and (where applicable) physical specimen transfer may implicate laws and authorities in Taiwan, the United States, Japan, or other jurisdictions. A single transaction may not be governed by one jurisdiction alone; different regulatory layers may apply at listing, payment, delivery, citation, or delisting stages.'
              ),
            ],
            bullets: [
              pick(isZh, '使用者居住地、註冊地或慣常居所', 'User residence, registration, or habitual location'),
              pick(isZh, '賣方與買方所在地或主要營業／機構所在地', 'Seller and buyer location or principal place of business / institution'),
              pick(isZh, '標本或資料實際所在地、採集地或保管地', 'Actual location, collection site, or custody location of specimen or data'),
              pick(isZh, '資料儲存、備份或伺服器所在司法管轄區', 'Jurisdiction of data storage, backup, or servers'),
              pick(isZh, '付款工具、金流服務提供者或托管服務所在地', 'Location of payment instrument, payment processor, or escrow provider'),
              pick(isZh, '實體標本是否跨境運送、進出口或借展', 'Whether physical specimens cross borders, import/export, or loan'),
              pick(isZh, '是否涉及保育物種、文化資產、化石、礦物、野生動植物、CITES 或機構典藏限制', 'Whether conservation species, cultural heritage, fossils, minerals, wildlife, CITES, or institutional collection rules apply'),
            ],
            closing: pick(
              isZh,
              '平台不提供「單一法域聲明即可涵蓋所有交易」之保證。若您進行高價、跨境、含實體標本、涉及保育類物種、商用授權或機構資料再授權之交易，應自行諮詢合格律師、會計師、報關行、保育或文化資產主管機關窗口，或其他獨立專業顧問，並以正式文件與個別 listing 條款確認權責。',
              'The platform does not warrant that any single-jurisdiction notice covers every transaction. For high-value, cross-border, physical-specimen, conservation-sensitive, commercial, or institutional relicensing deals, consult qualified lawyers, accountants, customs brokers, conservation or heritage authorities, or other independent advisors, and confirm duties in formal documents and individual listing terms.'
            ),
          },
          {
            title: pick(isZh, '2. 台灣、美國、日本法規參考定位', '2. Taiwan, US & Japan — reference framing'),
            paragraphs: [
              pick(
                isZh,
                '下列為常見可能相關之議題類型，採白話整理，供使用者初步理解跨境差異；並非完整法規清單，也不表示每筆 SAT 均必然適用所列全部領域。實際適用與否，仍須依個案事實與正式法律意見判斷。',
                'The following plain-language topics may be relevant for initial cross-border understanding; they are not exhaustive and do not mean every SAT transaction triggers all listed areas. Applicability depends on case facts and formal legal advice.'
              ),
            ],
            bullets: [
              pick(
                isZh,
                '台灣：可能涉及個人資料保護、消費者保護、電子商務、智慧財產權、野生動植物保育、文化資產、稅務、公司法與跨境交易等議題。',
                'Taiwan: personal data protection, consumer protection, e-commerce, intellectual property, wildlife conservation, cultural heritage, tax, company law, and cross-border trade.'
              ),
              pick(
                isZh,
                '美國：可能涉及聯邦與州層級之消費者保護、證券與商品交易規範、數位資產與支付相關規則、稅務、智慧財產權、隱私、制裁、出口管制、野生動植物法規與 CITES 執行等議題。',
                'United States: federal and state consumer protection, securities and commodities rules, digital asset and payment-related rules, tax, IP, privacy, sanctions, export controls, wildlife rules, and CITES enforcement.'
              ),
              pick(
                isZh,
                '日本：可能涉及個人情報保護、特定商取引、資金決済、金融商品交易、消費者契約、智慧財產權、文化財、外為法、野生動植物貿易與 CITES 相關規範等議題。',
                'Japan: personal information protection, specified commercial transactions, fund settlement, financial instruments, consumer contracts, IP, cultural properties, foreign exchange law, wildlife trade, and CITES-related rules.'
              ),
            ],
            closing: pick(
              isZh,
              'MCurator 得依營運需要，調整支援國家或地區、付款方式、交易功能、標本類型、上架規範、資料儲存策略與合規流程。使用者應以正式上線後公布之服務條款、賣家規範與產品公告為準，而非僅依本說明頁推論平台已於所有法域完成相同程度之合規布局。',
              'MCurator may adjust supported countries or regions, payment methods, transaction features, specimen types, listing rules, data storage strategy, and compliance workflows as operations require. Rely on published terms of service, seller standards, and product notices at launch—not this guide alone—to infer compliance posture in any jurisdiction.'
            ),
          },
          {
            title: pick(isZh, '3. 非法律意見、非代理、非專業顧問聲明', '3. No legal advice, agency, or professional advisory role'),
            paragraphs: [
              pick(
                isZh,
                'MCurator 提供的是科學資產資料管理、標本護照、來源履歷、授權標示、市集展示與交易輔助工具，旨在提升資料可追溯性與授權透明度。平台不是律師事務所、會計師事務所、投資顧問、證券商、報關行、保險公司、物流商、博物館官方鑑定機構、政府機關或 CITES 主管機關，也不以使用者代理人身分代為申請許可、報關、鑑定或稅務申報。',
                'MCurator provides scientific asset data management, specimen passports, provenance, license labeling, marketplace display, and transaction support tools to improve traceability and license transparency. The platform is not a law firm, accounting firm, investment adviser, broker-dealer, customs broker, insurer, carrier, official museum appraisal body, government agency, or CITES authority, and does not act as users\' agent to obtain permits, customs clearance, appraisal, or tax filing.'
              ),
              pick(
                isZh,
                '平台客服、FAQ、介面提示、驗證徽章、SAT-MGS 分級、資料完整度百分比、系統建議與 AI 輔助文字，均為產品說明與風險溝通工具，不構成對任何特定交易之正式法律、稅務、投資、金融、進出口、報關、保育或鑑定意見。使用者不得以平台頁面、FAQ、徽章狀態或客服回覆，作為已完成法律審查、稅務申報、進出口許可、物種鑑定或合規背書之證明。',
                'Support, FAQs, UI prompts, verification badges, SAT-MGS tiers, completeness scores, system suggestions, and AI-assisted text are product explanation and risk communication—not formal legal, tax, investment, financial, import/export, customs, conservation, or appraisal opinions for any specific transaction. Users must not treat pages, FAQs, badge states, or support replies as proof of completed legal review, tax filing, import/export permits, species identification, or compliance endorsement.'
              ),
              pick(
                isZh,
                '若交易涉及重大權利、高金額、跨境移動、商用授權、含實體標本或敏感物種資料，使用者應在決策前取得獨立專業意見。SAT 之設計目的在於支援可引用、可審核之科學資料流通，而非替代使用者或機構自身之法遵義務。',
                'For transactions involving material rights, high value, cross-border movement, commercial licensing, physical specimens, or sensitive species data, obtain independent professional advice before deciding. SAT is designed to support citable, reviewable scientific circulation—not to replace users\' or institutions\' own compliance duties.'
              ),
            ],
          },
          {
            title: pick(isZh, '4. 正式文件優先與個別 listing 條款', '4. Formal documents & individual listing terms prevail'),
            paragraphs: [
              pick(
                isZh,
                '本說明頁、FAQ 與本區塊均為一般性風險提示，不取代正式服務條款、隱私政策、賣家協議、買方條款、Cookie 或資料處理附錄、付款服務條款、物流條款，以及雙方就特定交易另行簽署之書面或電子合約。實際權利義務，以該等正式文件、個別 listing、成交當下之交易快照、授權文件、發票或收據為準。',
                'This guide, FAQ, and this section are general risk notices—they do not replace terms of service, privacy policy, seller agreements, buyer terms, cookie or data-processing addenda, payment terms, shipping terms, or separate written or electronic contracts for a specific deal. Actual rights and duties follow those formal documents, individual listings, settlement snapshots, license documents, invoices, and receipts.'
              ),
              pick(
                isZh,
                '若本 FAQ、說明頁或本區塊內容與正式文件不一致，以正式文件優先。若個別 listing 明示更嚴格限制—例如不得商用、不得下載、不得轉售、不得公開 GPS、不得跨境移轉、不得再授權或不含實體標本—該等個別限制於該筆交易範圍內優先適用，即使其他頁面存在較寬鬆之一般性描述。',
                'If this FAQ, guide, or section conflicts with formal documents, formal documents prevail. If an individual listing states stricter limits—e.g., no commercial use, no download, no resale, no public GPS, no cross-border transfer, no sublicensing, or no physical specimen—those listing-specific limits apply within that transaction even if other pages describe broader general permissions.'
              ),
              pick(
                isZh,
                '平台保留因法規變動、第三方權利人要求、主管機關合法指示、風險評估、產品調整或營運需要，而更新頁面說明、交易規則、支援功能與合規流程之權利。重大變更於正式環境將依適用之服務條款以合理方式通知；使用者於交易前應自行確認當時有效之版本與 listing 快照。',
                'The platform may update page descriptions, trading rules, supported features, and compliance workflows due to legal change, third-party claims, lawful authority requests, risk assessment, product changes, or operational needs. Material changes in production will be notified reasonably under applicable terms; users should confirm the effective version and listing snapshot before each transaction.'
              ),
            ],
          },
        ],
      },
      glossaryTitle: pick(isZh, '名詞解釋', 'Glossary'),
      glossary: [
        { term: 'SAT', def: pick(isZh, 'Scientific Asset Token — 科學資產代幣／登錄框架。', 'Scientific Asset Token — registration framework for scientific assets.') },
        { term: pick(isZh, 'Provenance', 'Provenance'), def: pick(isZh, '來源履歷：追加式事件時間軸。', 'Append-only timeline of custody and lifecycle events.') },
        { term: pick(isZh, 'Specimen Passport', 'Specimen Passport'), def: pick(isZh, '標本護照：可攜式 SAT 身分與 QR 匯出入口。', 'Portable SAT identity card with QR export entry point.') },
        { term: 'SAT-MGS', def: pick(isZh, '市集分級系統：照片與資料完整度規則評分。', 'Marketplace grading system for photo and metadata completeness.') },
        { term: 'CITES', def: pick(isZh, '華盛頓公約：規範特定物種國際貿易。', 'Convention on International Trade in Endangered Species.') },
        { term: pick(isZh, 'Custody', 'Custody'), def: pick(isZh, '保管權：誰負責標本或紀錄之保存與責任，未必等同完整所有權。', 'Who is responsible for holding and caring for a specimen or record—not always full ownership.') },
        { term: pick(isZh, 'Mint', 'Mint'), def: pick(isZh, '鑄造：在平台建立 SAT ID 並初始化 provenance 之登錄動作。', 'Registering an SAT ID and initializing provenance on the platform.') },
        { term: pick(isZh, 'Hero-passport', 'Hero-passport'), def: pick(isZh, '護照主視覺照片：市集列表用之真實標本影像，非占位圖。', 'Primary passport photo used in marketplace listings—real specimen imagery, not placeholders.') },
        { term: 'Darwin Core', def: pick(isZh, '生物多樣性資料交換常用欄位標準（dwc:）。', 'Widely used biodiversity metadata standard (dwc:).') },
      ],
      backToMarket: pick(isZh, '返回市集', 'Back to marketplace'),
      contactTitle: pick(isZh, '聯絡與正式文件', 'Contact & official documents'),
      contactBody: pick(
        isZh,
        '正式服務條款、隱私政策與爭議申訴流程將於上線時提供。示範階段問題可透過 App 內「關於」或 support@mcreator.example 聯繫（信箱為占位）。',
        'Official terms, privacy policy, and dispute procedures will ship at launch. For demo-phase questions, use in-app About or support@mcreator.example (placeholder email).'
      ),
    };
    if (typeof global.MC_SAT_appendFaqExtras === 'function') {
      global.MC_SAT_appendFaqExtras(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqChecklist === 'function') {
      global.MC_SAT_appendFaqChecklist(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqDeliverables === 'function') {
      global.MC_SAT_appendFaqDeliverables(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqLicenses === 'function') {
      global.MC_SAT_appendFaqLicenses(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqSellerChecklist === 'function') {
      global.MC_SAT_appendFaqSellerChecklist(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqVerificationBadges === 'function') {
      global.MC_SAT_appendFaqVerificationBadges(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqPhysicalDelivery === 'function') {
      global.MC_SAT_appendFaqPhysicalDelivery(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqSensitiveData === 'function') {
      global.MC_SAT_appendFaqSensitiveData(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqDisputeGuide === 'function') {
      global.MC_SAT_appendFaqDisputeGuide(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqThirdParty === 'function') {
      global.MC_SAT_appendFaqThirdParty(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqRiskControl === 'function') {
      global.MC_SAT_appendFaqRiskControl(content, isZh);
    }
    if (typeof global.MC_SAT_appendFaqJurisdictions === 'function') {
      global.MC_SAT_appendFaqJurisdictions(content, isZh);
    }
    if (typeof global.MC_SAT_appendJurisdictionalRegions === 'function') {
      global.MC_SAT_appendJurisdictionalRegions(content, isZh);
    }
    if (typeof global.MC_SAT_appendHighRiskLegal === 'function') {
      global.MC_SAT_appendHighRiskLegal(content, isZh);
    }
    return content;
  };
})(typeof window !== 'undefined' ? window : this);
