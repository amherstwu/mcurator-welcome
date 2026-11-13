/**
 * SAT transaction deliverables — FAQ group + quick-read card.
 * Inserts group K after category B (before buyer pre-purchase checklist).
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

  global.MC_SAT_appendFaqDeliverables = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var deliverablesGroup = {
      title: p(isZh, 'K. SAT 成交後，到底交付什麼？', 'K. What is delivered after an SAT transaction?'),
      items: [
        faqItem(isZh,
          '成交後，數位紀錄部分會交付哪些內容？',
          'After settlement, which digital record components are delivered?',
          [
            [
              'SAT 成交後，買方通常會取得與該筆 listing 綁定之數位紀錄存取權，而非一份模糊之「SAT 檔案包」。核心交付項目包括：唯一 SAT ID（供引用與解析）、標本護照頁面（Specimen Passport view，依授權可瀏覽或分享連結）、可瀏覽之結構化 metadata（學名、類別、產地政策、保管者摘要等，依 listing 公開設定）、append-only provenance timeline（成交事件應追加寫入）、當下之驗證狀態說明，以及 Rights 分頁之授權摘要快照。',
              'After settlement, buyers typically receive access to the digital record bound to that listing—not a vague "SAT file bundle." Core deliverables include: unique SAT ID (for citation and resolution), Specimen Passport view (browse or share link per license), browsable structured metadata (scientific name, category, locality policy, custodian summary per listing disclosure), append-only provenance timeline (settlement should append an event), current verification state description, and a snapshot of the Rights tab license summary.'
            ],
            [
              '數位紀錄交付的意義是：買方可依授權在平台或匯出管道中查閱、引用與（若明示）下載與該 SAT 綁定之科學身分與事件史。它不代表自動取得原始館藏系統之全部欄位、未公開之內部修復紀錄，或賣方未上傳之原始掃描檔。若某欄位在 listing 中標示為遮蔽、僅限申請或尚未提供，成交後仍可能維持相同限制。',
              'Digital record delivery means the buyer may review, cite, and (if stated) download the scientific identity and event history bound to the SAT via platform or export paths. It does not automatically include every field from the source collection system, unreleased internal conservation records, or source scans the seller never uploaded. Fields marked obfuscated, request-only, or unavailable on the listing may remain restricted after settlement.'
            ],
            [
              '示範環境中，交付可能以 mock 連結、測試 custody 更新或預覽頁面呈現；正式環境應以具稽核性之交易紀錄、收據與 listing 快照相互對照。買方與賣方應以成交當下頁面所載內容為準，而非交易前的口頭承諾或過期截圖。',
              'In demo, delivery may appear as mock links, test custody updates, or preview pages; production should cross-check auditable transaction records, receipts, and listing snapshots. Buyers and sellers should rely on what the listing showed at settlement—not verbal promises or outdated screenshots.'
            ],
          ],
          [
            [
              'SAT ID、標本護照頁面、metadata、provenance、驗證狀態、授權摘要。',
              'SAT ID, passport page, metadata, provenance, verification state, license summary.'
            ],
            [
              '交付範圍以 listing 明示與成交快照為準。',
              'Scope follows what the listing stated and the settlement snapshot.'
            ],
          ]
        ),
        faqItem(isZh,
          '成交後，資料使用權如何交付？',
          'After settlement, how are data usage rights delivered?',
          [
            [
              '資料使用權是 SAT 成交後最常與「數位紀錄」一併交付的權利層：在 listing 授權範圍內，買方可能取得可引用之科學欄位、可下載之 CSV／JSON（若標示可匯出）、用於研究或教學之展示權，以及依授權允許之公開展示或課程使用。是否可將資料改作、重新整理為資料集、與其他來源合併或發布 derivative dataset，完全依 listing 授權條款—未寫明即不應假設允許。',
              'Data usage rights are the rights layer most often delivered with the digital record: within listing license scope, buyers may receive citable scientific fields, downloadable CSV/JSON (if export is allowed), display for research or teaching, and public display or course use where permitted. Whether data may be adapted, repackaged as a dataset, merged with other sources, or published as derivative datasets depends entirely on listing license terms—if unstated, do not assume permission.'
            ],
            [
              '引用權通常包含在學術或教育授權中：買方可在論文、報告、海報或教案中引用 SAT ID 與授權允許之欄位，並依要求署名。引用不等同於取得完整資料複製權或再授權權；若需將原始資料嵌入商業產品、資料庫或 API，應確認 listing 是否明示商用與再授權。',
              'Citation rights are often included in academic or educational licenses: buyers may cite the SAT ID and permitted fields in papers, reports, posters, or lesson plans with required attribution. Citation is not full data reproduction or sublicensing; embedding raw data in commercial products, databases, or APIs requires explicit commercial and sublicense permission on the listing.'
            ],
            [
              '成交後，平台可能更新買方為該 SAT 之授權持有人或保管關係人（依產品設計），並在 provenance 追加「成交／授權移轉」事件。賣方仍須確保交付前所承諾之資料使用範圍與 listing 一致；買方若需超出授權之用途，應另行洽詢賣方或權利人。',
              'After settlement, the platform may update the buyer as license holder or custody party (per product design) and append a settlement/license transfer event to provenance. Sellers must ensure promised data usage matches the listing; buyers needing uses beyond license scope should contact the seller or rights holder separately.'
            ],
          ],
          [
            [
              '可引用欄位、CSV／JSON 下載（若明示）、研究／教學／展示用途。',
              'Citable fields, CSV/JSON download (if stated), research / teaching / display use.'
            ],
            [
              '改作或整理成資料集—僅在授權明示時適用。',
              'Adaptation or dataset packaging—only when explicitly licensed.'
            ],
          ]
        ),
        faqItem(isZh,
          '成交後，影像授權交付包含什麼？',
          'After settlement, what does image license delivery include?',
          [
            [
              '影像授權與 metadata 使用權分開理解：listing 可能允許瀏覽 hero-passport 縮圖，但不允許下載高解析原圖；或允許出版用途但禁止商業廣告。成交後買方應依 Rights 分頁確認：是否可下載高解析圖、是否可用於期刊或書籍出版、是否可商業使用、是否可改作（裁切、去背、調色、製作教材或衍生圖版），以及是否必須標示 SAT ID、作者、機構或 CC 條款來源。',
              'Image licensing should be understood separately from metadata usage: a listing may allow hero-passport thumbnails but not high-resolution downloads; or allow publication but not commercial advertising. After settlement, confirm on the Rights tab: high-res download, journal or book publication, commercial use, adaptation (crop, background removal, color grading, teaching materials, derivative plates), and required attribution (SAT ID, author, institution, or CC terms).'
            ],
            [
              '若 listing 僅交付「展示用低解析預覽」，買方不得自行放大、重掃或以 AI 重建冒充取得原圖授權。若需印刷級圖檔、展覽大型輸出或商品化圖像，必須在成交前確認 listing 是否含該等級授權；成交後補充付費或升級授權依賣方政策與正式條款辦理，平台不保證自動升級。',
              'If the listing delivers "low-resolution preview for display" only, buyers must not upscale, rescan, or AI-reconstruct to imply full-resolution rights. Print-grade files, large-format exhibition output, or productized imagery require confirmation before settlement; post-sale upgrades follow seller policy and formal terms—the platform does not guarantee automatic upgrades.'
            ],
            [
              '影像著作權可能仍保留在攝影者、機構或委託方；SAT 成交移轉的是 listing 所載之使用許可，而非當然移轉全部著作財產權。對外發布前，買方應保留授權摘要與署名要求，避免在期刊、博物館或商用管道發生侵權爭議。',
              'Image copyright may remain with the photographer, institution, or commissioner; an SAT sale transfers the usage license stated on the listing—not necessarily full copyright. Before external publication, retain license summaries and attribution requirements to avoid disputes in journals, museums, or commercial channels.'
            ],
          ],
          [
            [
              '高解析下載、出版、商用、改作／教材製作—逐項依 listing 確認。',
              'High-res download, publication, commercial use, adaptation / teaching materials—confirm per listing.'
            ],
            [
              '署名與來源標示要求應一併遵守。',
              'Attribution and source labeling requirements apply.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼情況下才有實體標本交付？流程包含什麼？',
          'When does physical specimen delivery apply, and what does the process include?',
          [
            [
              '實體標本交付僅在 listing 明示含 physical specimen binding（或同等「含實體標本」欄位）且雙方完成該部分交易約定時適用。若 listing 未標示含實體，成交後預設不包含標本寄送、包裝、保險、驗收或實體保管權移交—即使買方主觀上「以為是標本買賣」。',
              'Physical specimen delivery applies only when the listing explicitly includes physical specimen binding (or equivalent "physical specimen included") and both parties complete that portion of the transaction. If unstated, settlement by default excludes specimen shipment, packaging, insurance, acceptance inspection, or physical custody transfer—even if the buyer subjectively assumed a specimen sale.'
            ],
            [
              '含實體之交付通常另涉：包裝與運送方式、保險與風險轉移點、驗收期限與損傷通報、保存條件（溫溼度、防蟲、危險品）、以及買方簽收紀錄。CITES 許可、出口報關、檢疫與進口許可一般由交易雙方或各自委託之物流／法遵顧問負責，平台通常不自動代辦 CITES 或報關，除非 listing 或個別合約明示代辦範圍（且仍受主管機關核准限制）。',
              'Physical delivery typically also involves packaging and shipping method, insurance and risk transfer point, acceptance deadline and damage reporting, storage conditions (climate, pest control, hazmat), and buyer receipt records. CITES permits, export customs, quarantine, and import authorization are generally handled by the parties or their logistics/compliance advisors—the platform usually does not automatically handle CITES or customs unless the listing or contract explicitly states otherwise (and still subject to authority approval).'
            ],
            [
              '成交後，實體移交應在 provenance 追加 custody transfer 或同等事件，並與數位 SAT 紀錄一致。若僅完成數位授權付款而實體流程尚未啟動，買方不應推論標本已在途中；賣方亦不得將「已成交 SAT」等同「已完成實體寄送」。',
              'After settlement, physical transfer should append a custody transfer or equivalent provenance event aligned with the digital SAT record. If only digital license payment completed and physical workflow has not started, buyers should not assume the specimen is in transit; sellers must not equate "SAT settled" with "specimen shipped."'
            ],
          ],
          [
            [
              '僅 listing 明示含實體時才適用。',
              'Applies only when the listing explicitly includes physical material.'
            ],
            [
              '物流、保險、包裝、驗收、保存條件需另議。',
              'Logistics, insurance, packaging, acceptance, and storage terms are separate.'
            ],
            [
              'CITES／報關通常不由平台自動代辦。',
              'CITES / customs are usually not handled automatically by the platform.'
            ],
          ]
        ),
        faqItem(isZh,
          '保管權（custody）交付代表什麼？與所有權有何不同？',
          'What does custody delivery mean, and how is it different from ownership?',
          [
            [
              'SAT 成交後，平台紀錄可能更新「保管者（custodian）」或授權持有人，以反映數位身分與 listing 所載之保管關係。custody 轉移指的是在平台與交易紀錄脈絡下，誰被記錄為當前負責保管、引用或依授權展示該 SAT 之對象；它不一定等同於法律上完整所有權、標本物權之移轉，或機構典藏政策下之正式 deaccession。',
              'After settlement, platform records may update custodian or license holder to reflect digital identity and custody relationship per the listing. Custody transfer means who is recorded as responsible for custody, citation, or licensed display of the SAT in platform and transaction context—it is not necessarily full legal ownership, title to the specimen, or formal deaccession under institutional collection policy.'
            ],
            [
              '機構標本、寄存標本、借展中標本或僅授權數位流通之典藏，可能有特殊限制：例如保管權仍屬博物館、買方僅取得研究授權；或實體仍須歸還機構，SAT 僅代表數位身分移轉。此類限制應在 listing 與 provenance 中明示；成交後新的保管者資訊應準確寫入，避免日後借展、報關或爭議時無法追溯。',
              'Institutional specimens, deposited material, items on loan, or collections licensed for digital circulation only may carry special limits: custody may remain with the museum while the buyer holds research license only; or physical material must return to the institution while the SAT reflects digital identity transfer. Such limits should appear on the listing and provenance; post-settlement custodian data should be recorded accurately for future loans, customs, or disputes.'
            ],
            [
              '買方不應將 custody 更新解讀為可任意處分標本、再次上架或跨境移動之無條件許可；賣方亦不應透過 custody 欄位暗示超出 listing 的權利。若交易涉及機構內部核准，應保留核准紀錄與對外一致之保管者名稱。',
              'Buyers should not read custody updates as unconditional permission to dispose, relist, or move specimens cross-border; sellers must not imply rights beyond the listing via custody fields. When institutional approval applies, retain approval records and externally consistent custodian naming.'
            ],
          ],
          [
            [
              'custody 轉移 ≠ 當然之完整所有權。',
              'Custody transfer ≠ automatic full ownership.'
            ],
            [
              '機構、寄存、借展標本可能有額外限制。',
              'Institutional, deposited, or loaned specimens may have extra limits.'
            ],
            [
              '新保管者應在紀錄中明確更新。',
              'The new custodian should be clearly recorded.'
            ],
          ]
        ),
        faqItem(isZh,
          'SAT 成交後，哪些內容預設不包含？',
          'After an SAT transaction, what is not included by default?',
          [
            [
              '為降低買賣雙方誤解，應明確理解：SAT 成交後，預設不包含完整著作權移轉、未在 listing 明示之商業使用權、未標示之實體標本寄送、任何形式的投資報酬或保值承諾，以及政府許可、CITES 核准、學術定名終局裁定或「科學真偽保證」。',
              'To reduce misunderstandings, understand clearly: after settlement, defaults exclude full copyright transfer, commercial rights not stated on the listing, unstated physical specimen shipment, any investment return or store-of-value promise, and government permits, CITES approval, final taxonomic authority, or "scientific authenticity guarantees."'
            ],
            [
              '具體而言：買方不當然取得攝影／圖版之完整著作財產權；不當然可將 SAT 用於未授權之商用、轉售或 NFT 包裝；不當然收到實體標本或代辦報關；不當然獲得平台或賣方對價格升值、市場流動性、再售獲利之任何承諾；亦不當然取得主管機關已核可之出口或持有許可—這些均需 listing、合約或獨立法遵程序明示。',
              'Specifically: buyers do not automatically receive full copyright in photos or plates; may not use the SAT for unlicensed commercial use, resale, or NFT packaging; do not automatically receive physical specimens or customs handling; receive no promise of appreciation, liquidity, or resale profit from platform or seller; and do not automatically receive export or possession permits from authorities—these require explicit listing, contract, or separate compliance processes.'
            ],
            [
              '賣方亦應避免在成交後口頭追加未列入 listing 的交付項目，或暗示買方已取得超出授權之權利。若雙方欲擴大交付（例如加購高解析圖、實體借展、商用升級），應以書面或平台支援之補充交易紀錄辦理，並更新 provenance 與授權摘要，以利第三方引用與爭議稽核。',
              'Sellers should avoid verbally adding deliverables not on the listing after settlement, or implying buyers received rights beyond license scope. To expand delivery (e.g., high-res add-on, physical loan, commercial upgrade), use written or platform-supported supplemental transaction records and update provenance and license summaries for third-party citation and dispute audit.'
            ],
          ],
          [
            [
              '不含：完整著作權、未明示商用權、未標示實體標本。',
              'Not included: full copyright, unstated commercial rights, unstated physical specimen.'
            ],
            [
              '不含：投資報酬、政府許可、學術終局保證。',
              'Not included: investment return, government permits, final academic warranty.'
            ],
            [
              '一切以 listing 與成交快照為準；口頭承諾不能擴張交付。',
              'Listing and settlement snapshot govern; verbal promises cannot expand delivery.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 2;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, deliverablesGroup);
    } else {
      content.faqGroups.push(deliverablesGroup);
    }

    content.faqDeliverablesCard = {
      theme: 'deliverables',
      title: p(isZh, '成交後交付一覽', 'Post-settlement deliverables'),
      intro: p(
        isZh,
        'SAT 成交後交付內容分六類。下列為快速對照；細節與限制請見「K. SAT 成交後，到底交付什麼？」完整 FAQ。交付範圍以 listing 與成交快照為準，非全部 SAT 均相同。',
        'Post-settlement deliverables fall into six categories. Use this quick reference; see section K for details and limits. Scope follows the listing and settlement snapshot—not all SATs are identical.'
      ),
      footnote: p(
        isZh,
        '未在 listing 明示之項目，預設不包含。若有疑問，請在付款前確認或洽詢賣方。',
        'Items not explicit on the listing are excluded by default. Confirm with the seller before payment if unsure.'
      ),
      linkLabel: p(isZh, '查看完整 FAQ', 'Read full FAQ'),
      linkTarget: 'faq-group-deliverables',
      sections: [
        {
          title: p(isZh, '1. 數位紀錄', '1. Digital record'),
          items: [
            p(isZh, 'SAT ID、標本護照、metadata、provenance、驗證狀態、授權摘要。', 'SAT ID, passport, metadata, provenance, verification, license summary.'),
          ],
        },
        {
          title: p(isZh, '2. 資料使用權', '2. Data usage rights'),
          items: [
            p(isZh, '可引用資料；CSV／JSON（若明示）；研究、教學、展示。', 'Citable data; CSV/JSON (if stated); research, teaching, display.'),
            p(isZh, '改作或整理成資料集—依授權而定。', 'Adaptation or datasets—per license only.'),
          ],
        },
        {
          title: p(isZh, '3. 影像授權', '3. Image license'),
          items: [
            p(isZh, '高解析下載、出版、商用、改作／教材—逐項依 listing。', 'High-res, publication, commercial, adaptation / teaching—per listing.'),
            p(isZh, '署名與來源標示依授權要求。', 'Attribution per license requirements.'),
          ],
        },
        {
          title: p(isZh, '4. 實體標本', '4. Physical specimen'),
          items: [
            p(isZh, '僅 listing 明示含實體時適用。', 'Only when listing explicitly includes physical material.'),
            p(isZh, '物流、保險、驗收另議；平台通常不代辦 CITES／報關。', 'Logistics, insurance, acceptance separate; platform usually does not handle CITES/customs.'),
          ],
        },
        {
          title: p(isZh, '5. 保管權', '5. Custody'),
          items: [
            p(isZh, 'custody 更新 ≠ 完整所有權。', 'Custody update ≠ full ownership.'),
            p(isZh, '機構／寄存／借展標本可能有特殊限制。', 'Institutional, deposited, or loaned specimens may have extra limits.'),
          ],
        },
        {
          title: p(isZh, '6. 預設不包含', '6. Not included by default'),
          items: [
            p(isZh, '完整著作權、未明示商用、未標示實體、投資報酬、政府許可、學術保證。', 'Full copyright, unstated commercial use, unstated physical, investment return, permits, academic warranty.'),
          ],
        },
      ],
    };
  };
})(typeof window !== 'undefined' ? window : this);
