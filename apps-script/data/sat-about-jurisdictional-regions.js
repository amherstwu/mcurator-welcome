/**
 * Tri-jurisdiction region cards — appended to jurisdictionalLegal in sat-about-content.js.
 */
(function (global) {
  'use strict';

  function p(isZh, zh, en) {
    return isZh ? zh : en;
  }

  function sub(isZh, titleZh, titleEn, bulletPairs) {
    return {
      title: p(isZh, titleZh, titleEn),
      bullets: bulletPairs.map(function (pair) { return p(isZh, pair[0], pair[1]); }),
    };
  }

  global.MC_SAT_appendJurisdictionalRegions = function (content, isZh) {
    if (!content || !content.jurisdictionalLegal) return;

    content.jurisdictionalLegal.regionsTitle = p(
      isZh,
      '5. 台灣、美國、日本分法域法律聲明',
      '5. Jurisdiction-specific legal notices (Taiwan, US, Japan)'
    );
    content.jurisdictionalLegal.regionCards = [
      {
        title: p(isZh, '台灣法規參考', 'Taiwan law reference'),
        subsections: [
          sub(isZh, '個人資料與隱私', 'Personal data & privacy', [
            ['若 SAT 資料包含採集者姓名、持有人姓名、聯絡方式、GPS、影像 EXIF、付款資料、帳號資料、交易紀錄或可間接識別個人之資料，可能涉及台灣個人資料保護相關規範。', 'If SAT data includes collector or holder names, contact details, GPS, image EXIF, payment data, account data, transaction records, or indirectly identifiable personal data, Taiwan personal data rules may apply.'],
            ['平台應提供資料蒐集目的、使用範圍、保存期間、第三方分享對象，以及使用者查詢、更正、刪除或停止利用之申請管道（以正式隱私政策為準）。', 'The platform should disclose collection purposes, use scope, retention, third-party sharing, and channels for access, correction, deletion, or restriction (per formal privacy policy).'],
            ['使用者不得上傳未經授權之他人個資。', 'Users must not upload others\' personal data without authorization.'],
            ['敏感物種位置與個資應分開處理；勿因公開標本資訊而不必要公開個人身份。', 'Sensitive species locality and personal data should be handled separately; do not expose personal identity unnecessarily when publishing specimen information.'],
            ['若資料來自歷史標籤、博物館紀錄或第三方資料庫，亦應注意再利用授權與個資限制。', 'Data from historical labels, museum records, or third-party databases still requires attention to reuse licenses and personal data limits.'],
          ]),
          sub(isZh, '消費者保護與電子商務揭露', 'Consumer protection & e-commerce disclosure', [
            ['若 SAT marketplace 正式提供台灣消費者交易服務，頁面應明確揭露商品或服務內容、價格、付款方式、是否含實體標本、交付方式、授權限制、退款條件、客服與申訴管道。', 'If the SAT marketplace formally serves Taiwan consumers, pages should clearly disclose what is sold, price, payment methods, physical specimen inclusion, delivery, license limits, refunds, support, and appeals.'],
            ['數位授權、資料下載、已啟用服務、鏈上紀錄、客製化標本護照、含實體標本交易，可能不適用同一種退貨或退款邏輯。', 'Digital licenses, downloads, activated services, on-chain records, custom passports, and physical-specimen deals may not share one refund logic.'],
            ['退貨、退款、取消交易與爭議處理應以正式條款與個別 listing 明示。', 'Returns, refunds, cancellations, and disputes follow formal terms and individual listings.'],
            ['不得使用易誤導字眼暗示「保證升值」「保證真品」「保證合法跨境」或「保證學術正確」。', 'Do not use misleading language implying guaranteed appreciation, authenticity, lawful cross-border movement, or scientific correctness.'],
          ]),
          sub(isZh, '智慧財產權', 'Intellectual property', [
            ['標本照片、3D 掃描、描述文字、圖版、資料庫欄位、標本護照設計、平台 UI 與 SAT ID 編碼系統，可能分別涉及著作權、資料庫權益、商標、營業秘密或契約權利。', 'Specimen photos, 3D scans, descriptive text, plates, database fields, passport design, platform UI, and SAT ID schemes may involve copyright, database rights, trademarks, trade secrets, or contract rights separately.'],
            ['買方取得 SAT 不等於取得完整著作權。', 'Acquiring an SAT does not mean acquiring full copyright.'],
            ['除非 listing 明確允許，買方不得自行複製、改作、商業化、再授權、製作商品或移除權利標示。', 'Unless the listing explicitly allows, buyers must not copy, adapt, commercialize, sublicense, merchandise, or remove rights notices.'],
            ['賣方上架前必須確認自己有權授權影像與資料。', 'Sellers must confirm rights to license images and data before listing.'],
            ['平台可依權利人通知或合理懷疑，暫停、下架、遮蔽或限制爭議內容。', 'The platform may suspend, delist, hide, or restrict disputed content on rights-holder notice or reasonable suspicion.'],
          ]),
          sub(isZh, '野生動物、文化資產、化石與實體標本', 'Wildlife, cultural heritage, fossils & physical specimens', [
            ['若標本涉及野生動植物、保育類、CITES、化石、礦物、文化資產、遺址、國家公園或受限制採集地點，賣方與買方應自行確認台灣及交易相對國之法律。', 'For wildlife, protected species, CITES, fossils, minerals, cultural heritage, sites, national parks, or restricted collection areas, sellers and buyers must confirm Taiwan and counterparty country laws.'],
            ['SAT 上架不代表標本來源合法；SAT 成交不代表可以出口、進口、運送或商業販售。', 'Listing an SAT does not mean lawful provenance; settlement does not mean export, import, shipping, or commercial sale is permitted.'],
            ['平台可要求賣方補充來源文件、許可證、保管紀錄、入手證明或機構授權。', 'The platform may require provenance documents, permits, custody records, acquisition proof, or institutional authorization.'],
            ['對於疑似違法採集、盜挖、走私或保育風險標本，平台可拒絕上架或立即下架。', 'Suspected illegal collection, pilfering, smuggling, or conservation-risk specimens may be refused or delisted.'],
          ]),
          sub(isZh, '稅務', 'Tax', [
            ['台灣使用者因出售 SAT、授權資料、出售實體標本或收取服務費而取得收入時，可能涉及所得、營業稅、跨境收入、發票或收據等問題。', 'Taiwan users earning income from selling SATs, licensing data, selling specimens, or service fees may face income tax, business tax, cross-border income, invoice, or receipt issues.'],
            ['平台交易紀錄僅供參考，不是稅務申報之正確性背書。', 'Platform transaction records are for reference only—not an endorsement of correct tax treatment.'],
            ['使用者應自行保存交易紀錄、付款紀錄、授權文件與成本證明。', 'Users should retain transaction, payment, license, and cost records.'],
            ['平台不提供個別稅務建議。', 'The platform does not provide individual tax advice.'],
          ]),
        ],
      },
      {
        title: p(isZh, '美國法規參考', 'United States law reference'),
        subsections: [
          sub(isZh, 'Digital Assets、NFT 與證券法風險', 'Digital assets, NFT & securities-law risk', [
            ['若 SAT 採用區塊鏈、NFT、token、stablecoin 或其他 digital asset 技術，可能因設計、銷售方式、收益期待、管理方式、交易市場、二級流通與行銷內容而涉及不同美國法律風險。', 'If SAT uses blockchain, NFT, token, stablecoin, or other digital-asset technology, US legal risk may vary by design, sales method, profit expectations, management, markets, secondary trading, and marketing.'],
            ['平台不得宣稱 SAT 是投資商品、保證獲利、保證增值、保證轉售或收益分配。', 'The platform must not represent SAT as an investment product, guaranteed profit, appreciation, resale, or yield distribution.'],
            ['若某些 SAT 或相關安排未來被主管機關認定為證券、商品、支付工具或其他受監管資產，平台可依法調整、限制、暫停或終止相關功能。', 'If regulators later treat certain SATs or arrangements as securities, commodities, payment instruments, or other regulated assets, the platform may adjust, limit, suspend, or terminate related features as required.'],
            ['使用者不得以平台名稱進行未授權募資、代幣銷售、投資招攬或保證收益宣傳。', 'Users must not use the platform name for unauthorized fundraising, token sales, investment solicitation, or guaranteed-return promotion.'],
            ['SAT 的科學用途、資料用途與授權用途應與投機行銷明確切割。', 'Scientific, data, and license uses of SAT should be clearly separated from speculative marketing.'],
          ]),
          sub(isZh, '稅務與交易紀錄', 'Tax & transaction records', [
            ['美國使用者涉及 digital assets、NFT、cryptocurrency、stablecoin 或其他代幣交易時，可能需要依 IRS 或州稅規定申報。', 'US users dealing in digital assets, NFTs, cryptocurrency, stablecoins, or other tokens may need to report under IRS or state tax rules.'],
            ['使用加密資產付款、出售 SAT、收取授權金、轉售、交換或取得收入，都可能產生稅務後果。', 'Crypto payment, SAT sales, license fees, resales, exchanges, or other income may have tax consequences.'],
            ['平台提供交易紀錄不代表稅務分類正確。', 'Platform transaction records do not certify correct tax classification.'],
            ['使用者應自行保存日期、價格、幣別、錢包地址、交易 hash、手續費、取得成本、出售價格與授權收入紀錄。', 'Users should retain dates, prices, currency, wallet addresses, transaction hashes, fees, cost basis, sale prices, and license income records.'],
            ['平台不提供美國聯邦或州稅務建議。', 'The platform does not provide US federal or state tax advice.'],
          ]),
          sub(isZh, '消費者保護與反詐騙', 'Consumer protection & anti-fraud', [
            ['對美國使用者提供服務時，行銷內容不得有重大誤導、虛假陳述、隱藏重要條件或不實保證。', 'Marketing to US users must not materially mislead, contain false statements, hide important terms, or offer false assurances.'],
            ['價格、費用、退款限制、是否含實體、授權範圍、不可逆鏈上交易、gas fee、平台費與第三方付款費用都應明確揭露。', 'Disclose price, fees, refund limits, physical inclusion, license scope, irreversible on-chain steps, gas, platform fees, and third-party payment fees clearly.'],
            ['平台可偵測、限制或凍結疑似詐騙、釣魚、洗售、操縱價格、冒名機構、偽造標本、假授權或虛假 provenance 的帳號或 listing。', 'The platform may detect, limit, or freeze accounts or listings suspected of fraud, phishing, wash trading, price manipulation, impersonation, fake specimens, false licenses, or fabricated provenance.'],
            ['使用者不得繞過平台私下交易、要求外部錢包付款、冒充客服或偽造驗證徽章。', 'Users must not bypass the platform, demand off-platform wallet payment, impersonate support, or forge verification badges.'],
          ]),
          sub(isZh, '隱私與州法差異', 'Privacy & state-law differences', [
            ['美國沒有單一完整聯邦個資法可涵蓋所有情境，各州隱私法可能不同。', 'There is no single comprehensive federal privacy law for all situations; state privacy laws may differ.'],
            ['加州等州對個人資訊、敏感個資、出售或分享資料、退出權、刪除權、知情權可能有特別要求。', 'States such as California may impose special rules on personal information, sensitive data, sale or sharing, opt-out, deletion, and notice rights.'],
            ['平台保留日後依地區提供不同 privacy notice、cookie notice、資料請求機制、退出機制與使用者權利入口之彈性。', 'The platform may later offer region-specific privacy notices, cookie notices, data-request mechanisms, opt-outs, and user-rights portals.'],
            ['若使用者代表機構或他人上傳資料，必須確認取得必要授權。', 'Users uploading on behalf of institutions or others must confirm necessary authorization.'],
          ]),
          sub(isZh, '野生動植物、出口管制、制裁與跨境限制', 'Wildlife, export controls, sanctions & cross-border limits', [
            ['美國交易可能涉及 CITES、Endangered Species Act、Lacey Act、Fish and Wildlife Service、海關、出口管制、制裁名單或州法。', 'US transactions may involve CITES, the Endangered Species Act, Lacey Act, FWS, customs, export controls, sanctions lists, or state law.'],
            ['平台不保證任何標本可合法出口或進口。', 'The platform does not warrant that any specimen may be lawfully exported or imported.'],
            ['若買方、賣方、付款方、收貨地、錢包地址或物流目的地涉及高風險國家、制裁、出口限制或違法疑慮，平台可拒絕或暫停交易。', 'The platform may refuse or pause transactions involving high-risk countries, sanctions, export limits, or unlawful concerns in parties, wallets, or destinations.'],
            ['賣方不得提供虛假的人工繁殖、合法來源、產地或出口資料。', 'Sellers must not provide false captive-breeding, lawful-source, locality, or export information.'],
          ]),
        ],
      },
      {
        title: p(isZh, '日本法規參考', 'Japan law reference'),
        subsections: [
          sub(isZh, '個人情報保護', 'Personal information protection', [
            ['若 SAT 涉及日本使用者或日本境內個人資料，可能需要注意個人情報保護相關規範。', 'If SAT involves Japanese users or personal data in Japan, personal information protection rules may apply.'],
            ['平台應清楚揭露個人資料使用目的、第三方提供、跨境移轉、保存期間、查詢與更正管道（以正式政策為準）。', 'The platform should clearly disclose purposes, third-party provision, cross-border transfer, retention, and access or correction channels (per formal policy).'],
            ['採集者、持有人、研究者、機構人員、交易對象與付款資料都可能涉及個人情報。', 'Collectors, custodians, researchers, institutional staff, counterparties, and payment data may involve personal information.'],
            ['未經授權不得公開他人聯絡方式、地址、私人收藏位置或可識別個人之資料。', 'Do not publish others\' contact details, addresses, private collection locations, or identifiable personal data without authorization.'],
          ]),
          sub(isZh, '特定商取引與通訊販賣表示', 'Specified commercial transactions & online sales notices', [
            ['若 SAT marketplace 向日本消費者提供線上交易，正式服務中可能需要提供類似「特定商取引法に基づく表記」之資訊。', 'If the SAT marketplace serves Japanese consumers online, production may need disclosures similar to Specified Commercial Transactions Act notices.'],
            ['應揭露營業者資訊、價格、付款方式、額外費用、交付時間、取消或退貨或退款條件、客服聯絡方式與交易限制。', 'Disclose operator information, price, payment methods, extra fees, delivery time, cancellation, return or refund terms, support contacts, and transaction limits.'],
            ['不得使用誇大、顯著與事實不符，或使消費者誤認價格、品質、權利、稀有度、投資性、真偽或合法性的表示。', 'Do not use exaggerated, materially false, or misleading representations about price, quality, rights, rarity, investment character, authenticity, or legality.'],
            ['若交易為數位授權、資料下載、鏈上紀錄或客製化服務，應明確說明取消與退款限制。', 'For digital licenses, downloads, on-chain records, or custom services, state cancellation and refund limits clearly.'],
          ]),
          sub(isZh, '資金決済、暗号資産與金融商品風險', 'Fund settlement, crypto assets & financial-product risk', [
            ['若平台支援加密資產、穩定幣、錢包連結或代幣化紀錄，日本使用者可能涉及資金決済、暗号資産交換業、金融商品交易或其他監理問題。', 'If the platform supports crypto assets, stablecoins, wallet linking, or tokenized records, Japanese users may trigger fund-settlement, crypto-exchange, financial-instrument, or other regulatory questions.'],
            ['平台不得承諾 SAT 為金融商品、投資工具、收益憑證、分紅權或保證價格。', 'The platform must not promise SAT is a financial product, investment tool, yield instrument, dividend right, or price guarantee.'],
            ['若未取得必要資格或登錄，平台不得提供需要特定金融牌照的服務。', 'Without required registration or license, the platform must not offer services needing specific financial authorization.'],
            ['平台可因日本監理風險限制特定付款方式、錢包功能、二級交易或日本使用者可用功能。', 'The platform may limit payment methods, wallet features, secondary trading, or features for Japanese users due to regulatory risk.'],
            ['使用者不得利用 SAT 進行未授權募資、投資招攬或代幣銷售。', 'Users must not use SAT for unauthorized fundraising, investment solicitation, or token sales.'],
          ]),
          sub(isZh, '消費者契約與誤認防止', 'Consumer contracts & misrecognition prevention', [
            ['對日本使用者應避免不利條款隱藏、重要限制未揭露、取消條件不明、退款限制不明、誤導性倒數計時、誇大稀有度或暗示保證增值。', 'For Japanese users, avoid hidden unfavorable terms, undisclosed limits, unclear cancellation or refund rules, misleading countdowns, exaggerated rarity, or implied guaranteed appreciation.'],
            ['若交易涉及高價標本、實體移交或商業授權，應要求更明確的確認步驟。', 'High-value specimens, physical transfer, or commercial licenses should use clearer confirmation steps.'],
            ['正式環境可考慮交易前確認項目，例如：理解 SAT 不是投資商品；已確認授權範圍；已確認是否含實體標本；已理解跨境與 CITES 風險；已理解退款與取消限制。', 'Production may use pre-checkout acknowledgments such as: SAT is not an investment product; license scope confirmed; physical specimen status confirmed; cross-border and CITES risks understood; refund and cancellation limits understood.'],
          ]),
          sub(isZh, '文化財、標本、野生動植物與 CITES', 'Cultural properties, specimens, wildlife & CITES', [
            ['日本使用者交易實體標本時，可能涉及文化財、野生動植物、進出口、CITES、動植物檢疫或其他行政許可。', 'Japanese users trading physical specimens may face cultural property, wildlife, import/export, CITES, quarantine, or other administrative permit rules.'],
            ['SAT 登錄不代表日本主管機關核准。', 'SAT registration does not mean approval by Japanese authorities.'],
            ['平台可要求賣方提供來源文件、合法取得證明、輸出入許可、人工繁殖證明或機構授權。', 'The platform may require source documents, lawful acquisition proof, import/export permits, captive-breeding proof, or institutional authorization.'],
            ['高風險物種、來源不明或可能違反日本或交易相對國法律之 listing，平台可限制或下架。', 'High-risk species, unknown provenance, or listings possibly violating Japanese or counterparty law may be restricted or delisted.'],
          ]),
        ],
      },
    ];
    content.jurisdictionalLegal.regionsSummary = p(
      isZh,
      '台灣、美國、日本法規皆可能隨時間修正，且不同主管機關或法院對 digital assets、NFT、科學資料授權、標本交易、跨境資料傳輸與野生動植物貿易之見解可能不同。MCurator 將盡合理努力更新平台說明與合規流程，但使用者仍應就自身交易、資料處理、授權使用、納稅申報、進出口與標本保存義務自行負責。',
      'Laws in Taiwan, the United States, and Japan may change over time, and agencies or courts may interpret digital assets, NFTs, scientific data licensing, specimen trade, cross-border data transfers, and wildlife trade differently. MCurator will use reasonable efforts to update platform descriptions and compliance workflows, but users remain responsible for their own transactions, data handling, licensed use, tax reporting, import/export, and specimen custody duties.'
    );
  };
})(typeof window !== 'undefined' ? window : this);
