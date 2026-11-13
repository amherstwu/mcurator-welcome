/**
 * Seller pre-listing checklist — FAQ group + quick-read card for SAT about page.
 * Inserts group J after category C; does not modify existing A–I items.
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

  global.MC_SAT_appendFaqSellerChecklist = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var checklistGroup = {
      title: p(isZh, 'J. 賣方上架前應確認什麼？', 'J. What should sellers verify before listing?'),
      items: [
        faqItem(isZh,
          '上架前，我如何確認自己有權上架此 SAT？',
          'Before listing, how do I confirm I have the right to list this SAT?',
          [
            [
              '賣方（含個人研究者、機構典藏人員、委託上架之第三方）必須在建立 listing 前，確認自己對該 SAT 所涉內容具備合法上架與授權處分之基礎。這包括：是否為標本或數位檔之合法保管人、是否持有影像與文字之著作權或有效授權、是否可代表機構對外釋出元資料，以及是否已通過內部典藏或 deaccession 政策核准（若適用）。',
              'Sellers—including individual researchers, institutional curators, and third-party listing agents—must confirm a lawful basis to list and license the SAT before creating a listing. This covers lawful custody of specimen or digital files, copyright or valid license for images and text, authority to release metadata on behalf of an institution, and internal collection or deaccession approval where applicable.'
            ],
            [
              '若資料、影像、標本或敘述來自博物館、研究機構、政府資料庫、GBIF、iNaturalist、期刊、商業圖庫或第三方平台，賣方必須保留可稽核之授權鏈：例如機構書面同意、資料使用條款截圖、CC 授權標示、合作協議或館方對外流通核准紀錄。不得僅因「網路上找得到」或「機構網站曾公開」即推定可商用上架。',
              'If data, images, specimens, or narratives come from museums, research institutions, government databases, GBIF, iNaturalist, journals, stock libraries, or third-party platforms, retain an auditable license chain: institutional written consent, terms-of-use records, CC license labels, collaboration agreements, or official circulation approval. Public availability online or on an institutional website does not by itself permit commercial listing.'
            ],
            [
              '若賣方僅為仲介、代上架或研究協作者，應在 listing 中明示委託關係與權利來源，並確保原權利人知悉授權範圍。平台有權要求補件（授權函、館號對照、著作權聲明）；無法證明權利基礎者，不應上架或應主動標示為待確認狀態。',
              'If you are an agent, listing partner, or collaborator, disclose the agency relationship and rights source on the listing and ensure rights holders know the license scope. The platform may request supporting documents (authorization letters, accession crosswalks, copyright statements). Do not list—or mark as pending confirmation—when rights cannot be demonstrated.'
            ],
          ],
          [
            [
              '我是否為合法保管人，或持有有效委託／授權？',
              'Am I lawful custodian, or holding valid delegation / authorization?'
            ],
            [
              '影像、文字、資料與標本是否各有權利來源文件？',
              'Do images, text, data, and specimen each have documented rights?'
            ],
            [
              '機構或第三方資料是否已獲對外流通或商用授權？',
              'Is institutional or third-party material approved for external or commercial circulation?'
            ],
          ]
        ),
        faqItem(isZh,
          '上架前，我應如何確認標本與資料來源（provenance）？',
          'Before listing, how should I verify specimen and data provenance?',
          [
            [
              '賣方應能說明標本或數位資產如何合法取得：例如田野採集（含採集許可）、合法購買或贈與、機構入館（accession）、修復或製作紀錄、數位化批次，以及後續保管權轉移。provenance timeline 應反映可稽核之事件序列，而非僅有行銷性故事敘述。',
              'Sellers should explain how the specimen or digital asset was lawfully obtained: field collection (with permits where required), lawful purchase or gift, institutional accession, preparation or fabrication records, digitization batches, and subsequent custody transfers. The provenance timeline should reflect auditable events—not marketing narrative alone.'
            ],
            [
              '若具備採集紀錄、購買發票、入館編號、修復報告、借展歸還紀錄或前持有人文件，應在平台允許範圍內上傳或於 listing 摘要中引用（敏感個資或精確產地依政策遮蔽）。這有助買方、平台與第三方引用者評估資料可信度。',
              'When collection records, purchase invoices, accession numbers, conservation reports, loan return records, or prior-owner documents exist, upload them where the platform allows or cite them in the listing summary (obfuscate sensitive personal data or precise localities per policy). This helps buyers, the platform, and third-party citers assess credibility.'
            ],
            [
              '若來源不明、文件缺失或僅有部分鏈結，賣方必須誠實標示「來源不完整（incomplete provenance）」或同等警示，不得偽造完整來源、虛構入館紀錄、冒用機構館號，或將推測性敘述寫成已證實事實。來源不完整可能限制驗證等級、影響買方信任，並在爭議時加重賣方舉證責任。',
              'If provenance is unknown, documents are missing, or the chain is partial, honestly label "incomplete provenance" or equivalent warnings—do not fabricate complete chains, invent accession records, misuse institutional numbers, or present speculation as verified fact. Incomplete provenance may cap verification tier, reduce buyer trust, and increase the seller\'s burden of proof in disputes.'
            ],
          ],
          [
            [
              '能否提供採集、購買、入館、修復或數位化紀錄？',
              'Can you provide collection, purchase, accession, conservation, or digitization records?'
            ],
            [
              'provenance timeline 是否與文件一致？',
              'Does the provenance timeline match supporting documents?'
            ],
            [
              '來源不明時，是否已標示不完整而非偽造完整？',
              'If unknown, is incomplete provenance labeled—not fabricated as complete?'
            ],
          ]
        ),
        faqItem(isZh,
          '上架前，影像與 hero-passport 應如何標示才合規？',
          'Before listing, how should images and hero-passport photos be labeled compliantly?',
          [
            [
              '賣方不得使用未授權圖片、盜用他人標本照片、以第三方圖庫或網路抓取圖冒充「該 SAT 之真實標本照」，或以 AI 生成圖像冒充實體標本之現場或診斷照片。此類行為可能構成著作權侵權、虛偽陳述或欺詐，平台可立即下架並啟動帳號限制。',
              'Sellers must not use unauthorized images, misappropriate others\' specimen photos, pass off stock or scraped web images as "authentic photos of this SAT," or use AI-generated images as field or diagnostic photos of a physical specimen. Such conduct may constitute copyright infringement, misrepresentation, or fraud; the platform may delist immediately and restrict accounts.'
            ],
            [
              'hero-passport 與 listing 主圖必須清楚標示影像性質，例如：真實標本照片、館藏修復後照片、數位化掃描、復原圖（reconstruction）、教學示意圖、模式圖、或僅供身分識別之縮圖。若影像經裁切、去背、色彩校正或 AI 輔助增強，應在說明中註明，避免買方誤以為與實體完全一致。',
              'Hero-passport and listing hero images must clearly state image type—for example: authentic specimen photo, post-conservation collection photo, digitization scan, reconstruction, teaching diagram, diagrammatic plate, or identification thumbnail only. If images were cropped, background-removed, color-corrected, or AI-enhanced, disclose that in the description so buyers do not assume perfect match to the physical object.'
            ],
            [
              '若 SAT 尚無可公開 hero 影像，應留空或標示「尚無公開 hero 影像」，不得以占位圖、通用圖庫或無關標本照填充。教學圖版、去識別化圖像與純數位資產亦應在視覺上與「含實體移交之標本照」區隔，降低買方對交付內容的錯誤期待。',
              'If no public hero image exists, leave empty or state "no public hero image available"—do not fill with placeholders, generic stock, or unrelated specimen photos. Teaching plates, de-identified images, and digital-only assets should be visually and textually distinct from photos implying physical specimen transfer, reducing mistaken buyer expectations.'
            ],
          ],
          [
            [
              '所有影像是否已獲授權且可對應此 SAT？',
              'Are all images licensed and tied to this SAT?'
            ],
            [
              '是否禁止以圖庫或 AI 圖冒充真實標本照？',
              'Are stock or AI images prohibited as authentic specimen photos?'
            ],
            [
              'hero-passport 是否標示真實照、復原圖、教學圖或示意圖？',
              'Does hero-passport label authentic, reconstruction, teaching, or diagram images?'
            ],
          ]
        ),
        faqItem(isZh,
          '上架前，我應確認哪些法規與跨境限制？',
          'Before listing, which regulations and cross-border limits should I confirm?',
          [
            [
              '賣方應在上架前自行評估該標的或資料是否涉及 CITES 附錄物種、國內野生動植物保育法、化石或古生物遺跡法、文化資產或考古遺物管制、礦物或標本出口限制，以及買方可能所在國家之進口規定。listing 應如實標示相關風險與限制，不得刻意省略以促成交易。',
              'Before listing, assess whether the subject or data involves CITES appendices, domestic wildlife conservation laws, fossil or paleontological heritage rules, cultural property or archaeological controls, mineral or specimen export restrictions, and import rules in likely buyer jurisdictions. Listings should truthfully flag related risks and limits—not omit them to close a sale.'
            ],
            [
              '含實體標本或可能跨境移動者，賣方應說明是否需要出口許可、檢疫、報關文件或買方進口許可，以及平台是否提供（通常不提供）代辦服務。即使 listing 僅授權數位使用，精確產地、受保護物種標示或敏感採集資訊仍可能觸及機構政策或法規—應依政策遮蔽或限制下載。',
              'For physical specimens or cross-border movement, explain whether export permits, quarantine, customs documents, or buyer import licenses are required, and whether the platform offers handling (usually it does not). Even digital-only licenses may involve precise locality, protected-species labels, or sensitive collection data governed by policy or law—obfuscate or restrict download accordingly.'
            ],
            [
              '賣方對法規理解有疑慮時，應暫緩上架並諮詢合格顧問或機構法遵窗口。平台 FAQ 與上架表單提示不構成法律意見；但賣方仍須對不實標示、故意隱藏限制或誘導跨境違規承擔相應責任。',
              'When regulatory understanding is uncertain, pause listing and consult qualified advisors or institutional compliance officers. Platform FAQ and listing prompts are not legal advice—but sellers remain responsible for false labels, deliberate concealment of limits, or inducing cross-border violations.'
            ],
          ],
          [
            [
              '是否涉及 CITES、保育法、化石、文化資產或考古遺物？',
              'CITES, conservation laws, fossils, cultural heritage, or archaeological material?'
            ],
            [
              '實體或資料是否受出口／跨境運送限制？',
              'Are physical material or data subject to export / cross-border limits?'
            ],
            [
              '敏感產地或物種資訊是否已依政策處理？',
              'Are sensitive locality or species fields handled per policy?'
            ],
          ]
        ),
        faqItem(isZh,
          '上架前，授權條款應如何明示才不誤導買方？',
          'Before listing, how should license terms be stated clearly to avoid misleading buyers?',
          [
            [
              '賣方必須在 listing 中明確選擇並填寫授權類型，例如：學術引用、教育使用、展覽使用、商業授權、典藏級有限版本，或自訂條款（若平台支援）。不可使用「歡迎使用」「可自由運用」「買了就是你的」等模糊語句替代具體權利範圍。',
              'Sellers must explicitly select and complete a license type on the listing—for example: academic citation, educational use, exhibition use, commercial license, collector edition, or custom terms if supported. Vague phrases like "feel free to use," "use as you wish," or "yours after purchase" must not substitute for specific rights scope.'
            ],
            [
              '若不允許商業使用、再授權、轉售、改作或下載原始檔，必須逐項清楚標示「否」或同等限制，而非僅在附檔小字中說明。若 listing 不含實體標本，必須明示 physical specimen binding: no 或同等欄位，避免買方以為會收到標本。授權期限、地區、署名要求與用途限制亦應可讀、可搜尋、可截圖核對。',
              'If commercial use, sublicensing, resale, adaptation, or download of source files is not allowed, mark each restriction clearly as "no" or equivalent—not only in fine print attachments. If no physical specimen is included, explicitly set physical specimen binding: no or equivalent so buyers do not expect shipment. Term, territory, attribution, and purpose limits should be readable, searchable, and snapshot-verifiable.'
            ],
            [
              '上架前請以買方視角檢視 Rights 分頁：是否在 30 秒內能回答「可下載嗎？可商用嗎？含實體嗎？可轉售嗎？」。若需個案洽詢才能釐清，表示授權摘要尚未達到合規上架標準，應先補齊再發布。',
              'Before publishing, review the Rights tab as a buyer: can you answer within 30 seconds—downloadable? commercial? physical included? resellable? If buyers must inquire case-by-case, the license summary is not yet ready for compliant listing—complete it first.'
            ],
          ],
          [
            [
              '是否已選擇明確授權類型而非模糊描述？',
              'Is a specific license type selected—not vague wording?'
            ],
            [
              '商業、再授權、轉售、下載等限制是否逐項標示？',
              'Are commercial, sublicense, resale, and download limits itemized?'
            ],
            [
              '不含實體時，是否已明示 physical specimen binding: no？',
              'If no physical specimen, is physical specimen binding: no explicit?'
            ],
          ]
        ),
        faqItem(isZh,
          '若違規、資訊不實或拒絕補件，可能面臨哪些後果？',
          'What consequences may apply for violations, false information, or refusal to provide documents?',
          [
            [
              '為同時保護平台、買方與合規賣方，平台對違反上架規範、授權不明、來源可疑、影像不實或法規標示缺失之 listing，得依情節採取：要求補件或限期更正、暫停展示、下架、撤回或降級驗證徽章、限制上架或交易功能、暫停帳號，以及拒絕再次上架至完成審核為止。',
              'To protect the platform, buyers, and compliant sellers, the platform may—depending on severity—for listings that breach listing rules, unclear licenses, suspicious provenance, false imagery, or missing regulatory flags: require documents or corrections within a deadline, suspend display, delist, revoke or downgrade verification badges, restrict listing or transaction features, suspend accounts, and block relisting until review completes.'
            ],
            [
              '若涉及故意欺詐、著作權或商標侵權、冒用機構身分、販售非法標本、繞過 CITES 或文化資產限制，或重複違規，平台得保留交易紀錄、通訊與 listing 快照作內部稽核，並在適用法規允許範圍內配合權利人、機構或主管機關之法律程序。賣方可能另需對買方或第三方承擔民事或刑事責任，平台 FAQ 不限制執法或司法機關之權限。',
              'For intentional fraud, copyright or trademark infringement, impersonation of institutions, sale of unlawful specimens, or evasion of CITES or heritage controls—or repeat violations—the platform may retain transaction records, communications, and listing snapshots for internal audit and cooperate with rights holders, institutions, or authorities where law permits. Sellers may face civil or criminal liability to buyers or third parties; this FAQ does not limit enforcement or judicial authority.'
            ],
            [
              '合規上架有助降低爭議、提升驗證通過率與買方信任。賣方若主動標示不完整來源、限制與待補文件，通常優於被檢舉後被動下架。正式環境之詳細處分流程與申訴管道，以屆時公布之賣家規範與服務條款為準。',
              'Compliant listing reduces disputes, improves verification pass rates, and builds buyer trust. Proactively labeling incomplete provenance, limits, and pending documents is usually better than reactive delisting after reports. Detailed enforcement and appeal procedures in production will be governed by published seller standards and terms of service.'
            ],
          ],
          [
            [
              '平台可要求補件、暫停、下架、撤回驗證或限制帳號。',
              'The platform may require documents, suspend, delist, revoke verification, or restrict accounts.'
            ],
            [
              '欺詐、侵權或違法時，平台可保留紀錄並配合法律程序。',
              'For fraud, infringement, or unlawful conduct, records may be retained and legal process supported.'
            ],
            [
              '合規上架保護賣方自身，也保護買方與平台生態。',
              'Compliant listing protects sellers, buyers, and the platform ecosystem.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 6;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, checklistGroup);
    } else {
      content.faqGroups.push(checklistGroup);
    }

    content.faqSellerListingCard = {
      theme: 'seller',
      title: p(isZh, '賣方上架前檢查表', 'Seller pre-listing checklist'),
      intro: p(
        isZh,
        '發布 listing 前請逐項確認。資訊不完整時應誠實標示，不得偽造來源或模糊授權。詳細說明見下方「J. 賣方上架前應確認什麼？」。',
        'Verify each item before publishing. Label gaps honestly—do not fabricate provenance or blur license scope. See section J below for full guidance.'
      ),
      footnote: p(
        isZh,
        '本檢查表協助合規上架，不取代機構內規、賣家協議或正式服務條款。',
        'This checklist supports compliant listing; it does not replace institutional rules, seller agreements, or formal terms.'
      ),
      linkLabel: p(isZh, '查看完整 FAQ', 'Read full FAQ'),
      linkTarget: 'faq-group-seller-precheck',
      sections: [
        {
          title: p(isZh, '1. 權利確認', '1. Rights'),
          items: [
            p(isZh, '我是否有權上架此 SAT？', 'Do I have the right to list this SAT?'),
            p(isZh, '影像、文字、資料、標本是否各有授權？', 'Are images, text, data, and specimen each authorized?'),
            p(isZh, '機構／第三方資料是否已獲流通授權？', 'Is institutional or third-party material approved for circulation?'),
          ],
        },
        {
          title: p(isZh, '2. 來源確認', '2. Provenance'),
          items: [
            p(isZh, '標本或資料是否合法取得？', 'Was the specimen or data lawfully obtained?'),
            p(isZh, '能否提供採集、入館、修復等紀錄？', 'Can I provide collection, accession, or conservation records?'),
            p(isZh, '來源不明時是否標示不完整，而非偽造？', 'If unknown, is incomplete provenance labeled—not fabricated?'),
          ],
        },
        {
          title: p(isZh, '3. 影像確認', '3. Imagery'),
          items: [
            p(isZh, '未使用未授權、圖庫或 AI 冒充標本照。', 'No unauthorized, stock, or AI images posing as specimen photos.'),
            p(isZh, 'hero-passport 已標示真實照、復原圖、教學或示意圖。', 'Hero-passport labels authentic, reconstruction, teaching, or diagram images.'),
          ],
        },
        {
          title: p(isZh, '4. 法規確認', '4. Regulations'),
          items: [
            p(isZh, '是否涉及 CITES、保育法、化石或文化資產？', 'CITES, conservation laws, fossils, or cultural heritage?'),
            p(isZh, '是否涉及跨境運送或出口限制？', 'Cross-border shipping or export restrictions?'),
          ],
        },
        {
          title: p(isZh, '5. 授權確認', '5. License'),
          items: [
            p(isZh, '已選擇明確授權類型，無模糊語句。', 'Specific license type selected—no vague wording.'),
            p(isZh, '商業限制與「不含實體」已清楚標示。', 'Commercial limits and "no physical specimen" are explicit.'),
          ],
        },
        {
          title: p(isZh, '6. 違規後果', '6. Enforcement'),
          items: [
            p(isZh, '平台可補件、暫停、下架、撤回驗證或限制帳號。', 'Platform may require docs, suspend, delist, revoke verification, or restrict accounts.'),
            p(isZh, '欺詐、侵權或違法時可保留紀錄並配合法律程序。', 'Fraud, infringement, or unlawful conduct may lead to retained records and legal cooperation.'),
          ],
        },
      ],
    };
  };
})(typeof window !== 'undefined' ? window : this);
