/**
 * Tri-jurisdiction law & cross-border compliance — FAQ group I (jurisdictions).
 * Inserts before category H (disputes & liability).
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

  global.MC_SAT_appendFaqJurisdictions = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var jurisGroup = {
      title: p(
        isZh,
        'I. 台灣／美國／日本法律與跨境合規',
        'I. Taiwan, US, Japan law & cross-border compliance'
      ),
      items: [
        faqItem(isZh,
          'SAT 是否一定適用台灣法律？',
          'Does SAT always fall under Taiwan law?',
          [
            [
              '不一定。SAT 與 MCurator 市集可能涉及跨境使用者、跨境付款、跨境資料處理或跨境標本移轉；單一交易不一定只由台灣法律支配，也可能同時觸及美國、日本或其他司法管轄區之規範。',
              'Not necessarily. SAT and the MCurator marketplace may involve cross-border users, payments, data processing, or specimen movement; a single transaction may not be governed by Taiwan law alone and may also implicate the United States, Japan, or other jurisdictions.'
            ],
            [
              '若平台營運主體、使用者、付款方式、資料儲存或處理、標本所在地、採集地、實體交付地或交易履行地與台灣有關，則可能涉及台灣個人資料保護、消費者保護、智慧財產權、稅務、野生動植物或文化資產等議題。但這並不表示其他法域之強制性規定自動排除。',
              'If the operating entity, users, payment methods, data storage or processing, specimen location, collection site, physical delivery, or performance location relates to Taiwan, Taiwan personal data, consumer protection, IP, tax, wildlife, or cultural heritage rules may apply—but that does not automatically exclude mandatory rules elsewhere.'
            ],
            [
              '本 FAQ 為白話說明，不能取代正式服務條款、隱私政策或準據法與爭議解決之約定。若您進行高價、跨境、含實體標本、涉及 CITES 或機構資料再授權之交易，應在決策前諮詢合格律師或其他獨立顧問。',
              'This FAQ is plain-language guidance—it does not replace formal terms of service, privacy policy, or governing-law and dispute-resolution clauses. For high-value, cross-border, physical-specimen, CITES, or institutional relicensing deals, consult qualified lawyers or other independent advisors before deciding.'
            ],
          ]
        ),
        faqItem(isZh,
          '如果買方在美國，賣方在台灣，標本在日本，適用哪一國法律？',
          'If the buyer is in the US, seller in Taiwan, and specimen in Japan, which law applies?',
          [
            [
              '可能不只一國。跨境 SAT 交易常同時涉及多個接觸點：買方所在地、賣方所在地、標本或資料所在地、付款工具與金流服務所在地、伺服器或備份所在地，以及實體標本是否跨境運送或借展。',
              'More than one jurisdiction may apply. Cross-border SAT deals often touch multiple points: buyer location, seller location, specimen or data location, payment instrument and processor location, server or backup location, and whether physical specimens cross borders or go on loan.'
            ],
            [
              '消費者保護、稅務、付款與退款、資料保護、標本運送、出口、進口、CITES、智慧財產權與文化資產，可能分別適用不同法律或主管機關。同一筆交易在不同階段（上架、付款、交付、引用）也可能涉及不同規範層級。',
              'Consumer protection, tax, payment and refunds, data protection, specimen shipping, export, import, CITES, IP, and cultural heritage may each invoke different laws or authorities. Different regulatory layers may apply at listing, payment, delivery, or citation stages of the same deal.'
            ],
            [
              '平台可在正式條款中約定準據法與爭議解決方式，但該約定不一定排除各國強制性消費者保護、隱私、進出口、制裁或保育規定。交易前應仔細閱讀 listing、授權文件、物流條款與任何書面合約，而非僅依國籍或 UI 語言推論適用法律。',
              'The platform may specify governing law and dispute resolution in formal terms, but that may not override mandatory consumer, privacy, import/export, sanctions, or conservation rules in each country. Before transacting, read listings, license documents, shipping terms, and any written contracts—not infer applicable law from nationality or UI language alone.'
            ],
          ]
        ),
        faqItem(isZh,
          'SAT 是不是 NFT，所以一定受美國證券法規範？',
          'Is SAT an NFT and therefore always subject to US securities law?',
          [
            [
              '不能這樣簡化。SAT 可能選擇性採用區塊鏈、NFT、token 或其他 digital asset 技術作為輔助紀錄，但技術形式不等同法律分類。是否涉及美國證券、商品、支付工具或其他受監管資產，取決於具體設計、銷售方式、收益期待、管理結構、二級交易、分潤安排與行銷內容等個案事實。',
              'That oversimplifies. SAT may optionally use blockchain, NFT, token, or other digital-asset technology as supporting records, but technical form is not legal classification. Whether US securities, commodities, payment instruments, or other regulated assets are implicated depends on case-specific design, sales method, profit expectations, management structure, secondary trading, revenue sharing, and marketing.'
            ],
            [
              'MCurator 的定位是科學資料、標本護照、來源履歷與授權管理，支援可引用、可審核之科學流通，不是向使用者銷售投資商品或收益憑證。平台不得、也不允許使用者將 SAT 宣傳為保證獲利、保證升值、分紅、基金單位或類似投資敘事。',
              'MCurator is positioned for scientific data, specimen passports, provenance, and license management—supporting citable, reviewable circulation—not selling investment products or yield instruments. The platform must not, and users must not, promote SAT as guaranteed profit, appreciation, dividends, fund units, or similar investment narratives.'
            ],
            [
              '若未來美國或其他主管機關認定特定 SAT 功能、代幣化安排或二級市場機制需調整，平台可依法限制、暫停或停止相關功能，即使該功能在技術上仍可使用。使用者應將 SAT 的科學、資料與授權用途，與投機行銷明確區分。',
              'If US or other authorities later require changes to specific SAT features, tokenization, or secondary-market mechanisms, the platform may limit, suspend, or stop those features as required—even if technically still possible. Users should clearly separate scientific, data, and license uses from speculative marketing.'
            ],
          ]
        ),
        faqItem(isZh,
          '使用 USDC、USDT、ETH 付款是否會產生稅務問題？',
          'Can paying with USDC, USDT, or ETH create tax issues?',
          [
            [
              '可能會。以穩定幣、以太幣或其他 digital assets 付款、收款、交換或出售 SAT，在不同法域可能產生不同稅務後果；這不是「鏈上付款就自動免稅」或「只有法幣才需申報」的簡化情境。',
              'Possibly. Paying, receiving, exchanging, or selling SAT with stablecoins, ether, or other digital assets may have different tax consequences by jurisdiction—this is not a simplified “on-chain means tax-free” or “only fiat is reportable” scenario.'
            ],
            [
              '美國使用者特別需要注意 IRS 及州稅對 digital assets 交易、出售、交換、收入與資本利得等申報要求。台灣使用者可能涉及所得、營業稅、跨境收入或收據／發票等議題；日本使用者亦可能依所在地稅法產生所得、消費、匯兌或其他申報義務。',
              'US users should note IRS and state rules on digital-asset transactions, sales, exchanges, income, and capital gains. Taiwan users may face income tax, business tax, cross-border income, or invoice/receipt issues; Japanese users may have income, consumption, FX, or other reporting duties under local tax law.'
            ],
            [
              '平台不提供稅務建議，也不保證平台匯出之交易紀錄足以滿足所有申報或稽核需求。使用者應自行保存交易時間、金額、幣別、錢包地址、交易 hash、手續費、取得成本、出售價格、授權收入與任何第三方付款證明，並在必要時諮詢合格會計師或稅務顧問。',
              'The platform does not provide tax advice and does not warrant that exported transaction records satisfy all filing or audit needs. Users should retain timestamps, amounts, currency, wallet addresses, transaction hashes, fees, cost basis, sale prices, license income, and third-party payment proof, and consult qualified accountants or tax advisors when needed.'
            ],
          ]
        ),
        faqItem(isZh,
          '台灣使用者是否享有消費者保護？',
          'Do Taiwan users receive consumer protection?',
          [
            [
              '若 SAT marketplace 正式向台灣消費者提供交易服務，且該交易符合台灣消費者保護或電子商務相關規範之適用條件，使用者可能享有相應保護，例如資訊揭露、申訴管道或一定範圍內之退貨、退款或爭議處理要求。',
              'If the SAT marketplace formally serves Taiwan consumers and a transaction meets applicable Taiwan consumer protection or e-commerce rules, users may receive corresponding protections—such as disclosure, complaint channels, or certain return, refund, or dispute requirements.'
            ],
            [
              '但 SAT 交易類型多元：可能僅含數位授權、資料下載、已啟用服務、鏈上不可逆紀錄、客製化標本護照、含實體標本移交，或 B2B／機構授權；不同類型不能一概套用同一種退貨或退款邏輯。退款、取消、退貨與爭議流程應以正式條款與個別 listing 為準。',
              'SAT transaction types vary: digital license only, downloads, activated services, irreversible on-chain records, custom passports, physical specimen transfer, or B2B/institutional licensing—each may not share one refund logic. Returns, cancellations, refunds, and disputes follow formal terms and individual listings.'
            ],
            [
              '平台應清楚揭露價格、授權範圍、是否含實體標本、交付方式、限制條件與申訴管道；買方亦應在交易前自行確認授權、稅務、進出口與 CITES 等風險。本 FAQ 不能代替正式條款或個案法律判斷。',
              'The platform should clearly disclose price, license scope, physical specimen inclusion, delivery, limits, and appeals; buyers should confirm license, tax, import/export, and CITES risks before transacting. This FAQ does not replace formal terms or case-specific legal analysis.'
            ],
          ]
        ),
        faqItem(isZh,
          '日本使用者購買 SAT 時，需要看到哪些資訊？',
          'What information should Japanese users see when purchasing SAT?',
          [
            [
              '若正式對日本使用者提供線上交易，平台應考慮提供營業者名稱與聯絡方式、價格、付款方式、額外費用（如 gas fee、平台費、匯款手續費）、交付或提供方式、取消／退貨／退款限制、客服與申訴聯絡方式，以及交易或授權之重要限制。',
              'If online transactions are formally offered to Japanese users, the platform should consider disclosing operator name and contact, price, payment methods, extra fees (gas, platform, remittance), delivery or provision method, cancellation/return/refund limits, support and appeals contacts, and material transaction or license limits.'
            ],
            [
              '行銷與 listing 不應誇大稀有度、投資價值、真偽、合法性、跨境可行性或科學正確性。若是數位授權、資料下載、鏈上紀錄或客製化服務，取消與退款條件應特別清楚，因為部分內容可能一經交付即難以撤回。',
              'Marketing and listings must not exaggerate rarity, investment value, authenticity, legality, cross-border feasibility, or scientific correctness. For digital licenses, downloads, on-chain records, or custom services, cancellation and refund terms should be especially clear because some content may be hard to recall once delivered.'
            ],
            [
              '若含實體標本，還應說明物流、保險、進出口、CITES、檢疫、驗收期限、損壞或缺失之處理方式，以及 SAT 登錄本身不代表日本主管機關核准。日本法域亦可能涉及特定商取引法に基づく表記等正式揭露要求，以正式上線版本為準。',
              'If a physical specimen is included, disclose shipping, insurance, import/export, CITES, quarantine, inspection deadlines, damage or shortage handling, and that SAT registration is not Japanese authority approval. Japan may require Specified Commercial Transactions Act-style notices in production—follow the live version.'
            ],
          ]
        ),
        faqItem(isZh,
          'SAT 上架後，是否代表標本可以合法出口或進口？',
          'Does listing an SAT mean the specimen may be lawfully exported or imported?',
          [
            [
              '不代表。SAT 上架是平台資料登錄、展示與授權交易輔助，不是出口許可、進口許可、CITES 許可、文化資產許可、海關放行或任何政府機關之核准文件。',
              'No. Listing an SAT is platform registration, display, and transaction support—not an export permit, import permit, CITES permit, cultural heritage permit, customs clearance, or any government approval.'
            ],
            [
              '若涉及跨境移動，賣方與買方都應自行確認出口國、進口國、轉運地與最終使用地之法律、機構政策、CITES 附錄、國內保育法、文化資產法與海關要求。不同國家對同一物種或同一標本類型之要求可能不同，且可能隨時間修正。',
              'For cross-border movement, sellers and buyers must confirm laws, institutional policy, CITES appendices, domestic conservation and heritage rules, and customs requirements in export, import, transit, and end-use countries. Requirements for the same species or specimen type may differ by country and change over time.'
            ],
            [
              '平台可提供欄位、風險提示、文件上傳、審查流程或交易限制，但不代辦所有許可申請。若未取得必要許可或文件不足，平台可取消、暫停或下架交易，即使 listing 仍曾公開顯示。',
              'The platform may provide fields, risk notices, document upload, review workflows, or transaction limits, but does not obtain all permits on users\' behalf. Without required permits or sufficient documents, the platform may cancel, pause, or delist transactions even if a listing was once public.'
            ],
          ]
        ),
        faqItem(isZh,
          '如果標本涉及 CITES，平台會幫我處理嗎？',
          'If a specimen involves CITES, will the platform handle it for me?',
          [
            [
              '平台可提供 CITES 相關欄位、交易前提醒、文件上傳介面、審查流程、敏感資料遮蔽或對高風險 listing 之交易限制，以協助雙方理解與留存紀錄。這些工具旨在提升透明度，不是代替使用者完成所有法遵義務。',
              'The platform may offer CITES-related fields, pre-trade notices, document upload, review workflows, sensitive-data masking, or transaction limits on high-risk listings to help parties understand and record compliance steps. These tools improve transparency—they do not replace users\' full compliance duties.'
            ],
            [
              'CITES 許可、出口、進口、再出口、海關申報與主管機關核准，通常仍需由交易雙方或其委託之報關行、律師、保育顧問或機構法遵人員處理。不同國家之 CITES 執行與國內法可能比公約附錄本身更嚴格。',
              'CITES permits, export, import, re-export, customs filing, and authority approval usually remain the responsibility of the parties or their customs brokers, lawyers, conservation advisors, or institutional compliance staff. National CITES implementation and domestic law may be stricter than appendices alone.'
            ],
            [
              '即使物種不在 CITES 附錄，也可能受國內保育法、國家公園、採集許可、文化資產或機構典藏政策限制。平台不保證任何 CITES 或疑似 CITES 標本可合法交易、跨境運送或商業利用；若風險過高，平台可拒絕或限制交易。',
              'Even non-CITES species may face domestic conservation law, national parks, collection permits, cultural heritage, or institutional collection rules. The platform does not warrant that any CITES or suspected-CITES specimen may be lawfully traded, shipped cross-border, or commercially used; high-risk deals may be refused or limited.'
            ],
          ]
        ),
        faqItem(isZh,
          '如果平台驗證通過，是否代表法律上沒有問題？',
          'If platform verification passes, does that mean there are no legal issues?',
          [
            [
              '不代表。平台驗證主要針對資料完整度、欄位一致性、影像品質、來源履歷完整性、館員或賣家流程符合度，以及 SAT-MGS 等產品分級規則；其目的在於提升可追溯性與審核效率，不是出具法律合規意見。',
              'No. Platform verification mainly addresses data completeness, field consistency, image quality, provenance completeness, curator or seller workflow compliance, and product grading such as SAT-MGS—it improves traceability and review efficiency, not legal compliance opinions.'
            ],
            [
              '法律合規、標本來源合法性、進出口、稅務、智慧財產權、個資、文化資產、CITES 與機構政策，仍可能需要獨立審查。驗證徽章不是政府核准、司法公證、律師法律意見、海關許可或學術終局定名。',
              'Legal compliance, lawful provenance, import/export, tax, IP, personal data, cultural heritage, CITES, and institutional policy may still require independent review. Verification badges are not government approval, notarial certification, legal advice, customs permits, or final taxonomic authority.'
            ],
            [
              '若日後發現重大不一致、權利爭議、來源疑慮或法規風險，平台可撤回徽章、要求補件、限制下載、暫停交易、下架 listing 或進入爭議流程。買方與賣方仍應就高風險交易自行取得專業意見，而非僅依徽章狀態決策。',
              'If material inconsistencies, rights disputes, provenance concerns, or regulatory risks emerge later, the platform may revoke badges, require documents, restrict downloads, pause transactions, delist, or open disputes. Buyers and sellers should obtain professional advice for high-risk deals—not decide from badge status alone.'
            ],
          ]
        ),
        faqItem(isZh,
          '如果台灣、美國、日本法律衝突，平台怎麼處理？',
          'How does the platform handle conflicts between Taiwan, US, and Japan law?',
          [
            [
              '跨境交易中，不同法域對消費者保護、隱私、稅務、證券或支付工具、出口管制、制裁、CITES 或文化資產之要求可能不一致。平台會依正式條款、具體交易情境、主管機關合法要求、風險評估與必要之法律意見，採取相應措施。',
              'In cross-border deals, Taiwan, US, and Japan may impose inconsistent consumer, privacy, tax, securities or payment, export control, sanctions, CITES, or cultural-heritage requirements. The platform responds per formal terms, transaction facts, lawful authority requests, risk assessment, and legal advice when needed.'
            ],
            [
              '在法規不明確或衝突時，平台可能採取較保守作法，例如限制特定法域使用者購買、暫停交割、隱藏敏感資料、要求補件、限制二級交易或停止特定付款方式。使用者不得要求平台為完成交易而違反任何適用法律。',
              'When rules are unclear or conflict, the platform may take conservative steps—restricting purchases by users in certain jurisdictions, pausing settlement, hiding sensitive data, requiring documents, limiting secondary trading, or stopping certain payment methods. Users must not demand that the platform break applicable law to complete a deal.'
            ],
            [
              '若仍無法在合理風險範圍內完成交易，平台保留暫停或拒絕高風險交易之權利。正式爭議處理、責任限制與準據法，以服務條款及當時有效之正式文件為準，而非僅依本 FAQ 推論。',
              'If a transaction cannot proceed within reasonable risk bounds, the platform may pause or refuse high-risk deals. Formal dispute handling, liability limits, and governing law follow terms of service and then-effective formal documents—not this FAQ alone.'
            ],
          ]
        ),
        faqItem(isZh,
          '平台可以因法規原因拒絕我的交易嗎？',
          'Can the platform refuse my transaction for regulatory reasons?',
          [
            [
              '可以。若交易涉及法規不確定、保育或 CITES 風險、制裁或出口限制、疑似侵權、詐騙或洗錢疑慮、來源不明、標本真偽或授權爭議、未成年人、付款異常、敏感棲地揭露風險，或主管機關、權利人之合法要求，平台可拒絕、暫停、取消交易或要求補件。',
              'Yes. The platform may refuse, pause, cancel, or require documents when a deal involves regulatory uncertainty, conservation or CITES risk, sanctions or export limits, suspected infringement, fraud or money-laundering concerns, unknown provenance, authenticity or license disputes, minors, abnormal payment, sensitive habitat disclosure risk, or lawful requests from authorities or rights holders.'
            ],
            [
              '此類措施旨在保護買方、賣方、平台、生態保育與合法市場秩序，並降低使用者誤入高風險或違法交易之可能。平台會在合理範圍內提供說明或下一步指引，但在涉及安全、調查、主管機關命令、第三方權利或未結案件時，可能無法揭露全部細節。',
              'Such measures protect buyers, sellers, the platform, conservation, and lawful market order, and reduce the chance users enter high-risk or unlawful deals. The platform will explain or guide reasonably when possible, but may not disclose full details during security, investigation, authority orders, third-party rights, or open cases.'
            ],
            [
              '拒絕或暫停不等於對使用者作出最終法律定性；亦不代表平台已代為完成所有法遵審查。若您認為決定有誤，可依正式申訴流程提出資料補充，但平台仍可能維持保守立場直至風險澄清。',
              'Refusal or pause is not a final legal characterization of the user, nor proof the platform completed all compliance review. If you believe a decision is wrong, use formal appeals to submit additional information—but the platform may remain conservative until risks are clarified.'
            ],
          ]
        ),
        faqItem(isZh,
          'FAQ 是否等於正式法律條款？',
          'Is this FAQ the same as formal legal terms?',
          [
            [
              '不是。FAQ 是白話說明，幫助使用者理解 SAT 的操作流程、授權邏輯、跨境風險與常見情境，方便在交易或引用前做初步判斷。FAQ 不構成法律、稅務、投資、報關、保育或會計意見，也不能代替個案分析。',
              'No. FAQs are plain-language help for SAT workflows, license logic, cross-border risks, and common scenarios—for preliminary judgment before trading or citing. FAQs are not legal, tax, investment, customs, conservation, or accounting advice and do not replace case analysis.'
            ],
            [
              '正式權利義務以服務條款、隱私政策、Cookie 或資料處理附錄、賣家協議、買方條款、付款服務條款、個別 listing、授權文件、成交快照、發票或收據，以及雙方另行簽署之書面或電子合約為準。',
              'Binding rights and duties follow terms of service, privacy policy, cookie or data-processing addenda, seller and buyer terms, payment terms, individual listings, license documents, settlement snapshots, invoices or receipts, and separate written or electronic contracts.'
            ],
            [
              '若 FAQ 與正式文件、個別 listing 或交易快照不一致，以正式文件及該筆交易約定優先。使用者若有重大交易、跨境移動、商用授權、含實體標本或敏感物種資料之法律疑慮，應尋求獨立專業意見，而非僅依 FAQ 或客服回覆決策。',
              'If FAQs conflict with formal documents, individual listings, or settlement snapshots, formal documents and that transaction govern. For material deals, cross-border moves, commercial licensing, physical specimens, or sensitive species data, seek independent professional advice—not FAQs or support replies alone.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 17;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, jurisGroup);
    } else {
      content.faqGroups.push(jurisGroup);
    }
  };
})(typeof window !== 'undefined' ? window : this);
