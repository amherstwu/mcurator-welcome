/**
 * Dispute handling process and evidence checklist — FAQ group.
 * Inserts group P before category H (disputes & liability).
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

  global.MC_SAT_appendFaqDisputeGuide = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var disputeGroup = {
      title: p(isZh, 'P. 發生爭議時怎麼辦？', 'P. What to do when a dispute arises'),
      items: [
        faqItem(isZh,
          '哪些情況可以向平台提出申訴？',
          'When can I file an appeal with the platform?',
          [
            [
              '買方、賣方或受影響之第三方（例如被主張侵權之權利人）可在正式環境依申訴管道提出爭議。常見事由包括：成交後授權範圍與 listing 或 Rights 快照不符；physical specimen binding 標示不清導致對是否含實體認知分歧；明示含實體但未寄出、寄錯或嚴重損壞；標本狀態與 listing 照片或描述重大不符；物種名稱或關鍵 metadata 重大錯誤；provenance 或來源文件涉嫌造假；影像著作權或商標侵權；買方超出授權下載、商用或再授權；CITES、保育或文化資產等法規疑慮；以及重複扣款、未授權付款或托管／交割異常。',
              'Buyers, sellers, or affected third parties (e.g., claimed rights holders) may file disputes via formal channels in production. Common grounds: post-settlement license scope inconsistent with listing or Rights snapshot; unclear physical specimen binding; promised physical not shipped, wrong item, or serious damage; specimen condition materially inconsistent with photos or description; major scientific name or metadata errors; alleged provenance or source document fabrication; image copyright or trademark infringement; buyer use beyond license (download, commercial, sublicense); CITES, conservation, or heritage concerns; duplicate charges, unauthorized payment, or escrow/settlement anomalies.'
            ],
            [
              '申訴應基於具體事實與可提交之證據，而非一般性不滿或價格預期落差。示範環境中的 mock 交易可能不提供正式申訴入口；正式上線後將另行公告時限、必填欄位與語言要求。若涉及刑事詐欺、人身危險或緊急保全，應同時聯繫執法或合格法律顧問，平台申訴不能替代司法程序。',
              'Appeals should rest on specific facts and submittable evidence—not general dissatisfaction or price expectation gaps. Demo mock transactions may lack formal appeal entry; production will publish deadlines, required fields, and language rules. For criminal fraud, personal safety, or urgent preservation, contact law enforcement or qualified counsel—platform appeals do not replace judicial process.'
            ],
          ],
          [
            [
              '授權不符、實體標示不清、未寄出／損壞、照片不符。',
              'License mismatch, unclear physical flag, not shipped / damaged, photo mismatch.'
            ],
            [
              '學名重大錯誤、provenance 造假、影像侵權、超授權使用。',
              'Major taxonomy error, provenance fraud, image infringement, overuse.'
            ],
            [
              'CITES／法規疑慮、付款異常。',
              'CITES / regulatory concerns, payment anomalies.'
            ],
          ]
        ),
        faqItem(isZh,
          '買方申訴時應準備哪些證據？',
          'What evidence should buyers prepare for an appeal?',
          [
            [
              '為加速審核，買方應盡可能一次提供：SAT ID、交易編號或 checkout／收據識別碼、成交前後之 listing 截圖（含 Rights、physical binding、授權摘要）、付款紀錄（不含完整卡號等敏感金融資料）、與賣方或平台之對話紀錄。涉及實體標本者，另附開箱錄影或連續照片、外箱與封條、損壞特寫、物流單與簽收時間。',
              'To speed review, buyers should provide where possible: SAT ID, transaction or checkout/receipt ID, listing screenshots before/after settlement (Rights, physical binding, license summary), payment records (without full card numbers or sensitive financial data), and message history with seller or platform. For physical specimens, add unboxing video or sequential photos, outer carton and seals, damage close-ups, shipping label, and delivery timestamp.'
            ],
            [
              '若主張物種鑑定或 metadata 重大錯誤，可附第三方資料庫對照（如 GBIF、WoRMS、機構館藏紀錄）、文獻或合格鑑定報告摘要—平台可能要求保留原件供進一步驗證。證據應為當事人合法取得；不得提交竄改截圖或侵犯他人隱私之通訊內容。正式環境將說明可接受之檔案格式與保存期限。',
              'For alleged major taxonomy or metadata errors, attach third-party database comparisons (e.g., GBIF, WoRMS, institutional catalog), literature, or qualified appraisal summaries—the platform may request originals for further verification. Evidence must be lawfully obtained; do not submit forged screenshots or communications violating others\' privacy. Production will specify accepted file formats and retention periods.'
            ],
          ],
          [
            [
              'SAT ID、交易編號、listing 截圖、付款紀錄、對話紀錄。',
              'SAT ID, transaction ID, listing screenshots, payment records, messages.'
            ],
            [
              '實體爭議：開箱影片、損壞照片、物流單。',
              'Physical disputes: unboxing video, damage photos, shipping docs.'
            ],
            [
              '學名／metadata：第三方資料庫、文獻或鑑定文件。',
              'Taxonomy / metadata: third-party databases, literature, or appraisal.'
            ],
          ]
        ),
        faqItem(isZh,
          '賣方申訴時應準備哪些證據？',
          'What evidence should sellers prepare for an appeal?',
          [
            [
              '賣方申訴（例如買方超授權使用、惡意退款、拒收或誹謗）時，應提供：listing 當時之授權條款與 Rights 快照、成交紀錄、原始影像或資料之權利證明（著作權、機構授權、CC 條款、委託上架文件）、標本來源與 provenance 支持文件、以及與買方溝通紀錄。',
              'For seller appeals (e.g., buyer overuse, bad-faith refund, refusal, defamation), provide: license terms and Rights snapshot at listing, settlement record, proof of rights in source images or data (copyright, institutional authorization, CC terms, listing agency documents), specimen provenance support, and buyer communication history.'
            ],
            [
              '涉及實體交付者，應附寄送證明、包裝前後照片、重量／尺寸紀錄、物流追蹤、簽收狀態與風險移轉條款副本。若主張買方侵權使用，可提交公開網頁、商品或課程截圖、時間戳與 SAT ID 對照—但收集方式須合法。平台可能要求雙方在指定期限內補件，逾期可能影響可採信之主張。',
              'For physical delivery, attach shipment proof, before/after packing photos, weight/dimension records, tracking, delivery status, and copy of risk-transfer terms. For alleged buyer infringement, submit public web, product, or course screenshots with timestamps and SAT ID crosswalk—collection must be lawful. The platform may set supplemental document deadlines; late submission may affect credibility of claims.'
            ],
          ],
          [
            [
              '授權條款、原始影像權利證明、來源文件。',
              'License terms, image rights proof, provenance documents.'
            ],
            [
              '寄送證明、包裝照片、物流追蹤。',
              'Shipment proof, packing photos, tracking.'
            ],
            [
              '買方超授權使用之截圖（合法取得）。',
              'Screenshots of buyer overuse (lawfully obtained).'
            ],
          ]
        ),
        faqItem(isZh,
          '平台收到申訴後，可能採取哪些處理？',
          'What actions may the platform take after receiving an appeal?',
          [
            [
              '依爭議類型、證據完整度、法規風險與正式服務條款，平台可能採取一項或多項措施：暫停數位或實體交割、暫停賣方提領或托管釋放、隱藏或限制 listing 公開、要求一方或雙方限期補件、通知對方限期回覆、撤回或降級驗證徽章、限制該 SAT 之下載或匯出、暫時限制上架／購買／訊息功能，以及協助雙方保全 listing 快照、交易紀錄與上傳證據之完整性（不等同認可任一方主張）。',
              'By dispute type, evidence completeness, regulatory risk, and formal terms, the platform may take one or more measures: suspend digital or physical settlement, hold seller payout or escrow release, hide or restrict listing visibility, require supplemental documents by deadline, notify the other party to respond, revoke or downgrade verification badges, restrict download or export for that SAT, temporarily limit listing/purchase/messaging, and help preserve listing snapshots, transaction records, and uploaded evidence (without endorsing either party\'s claims).'
            ],
            [
              '平台目標是風險控管、降低損害擴大與維持市集秩序，而非對學名、物種真偽或複雜著作權做終局學術或司法認定。必要時平台可能建議雙方自行調解、尋求鑑定或轉介主管機關；示範環境中的「申訴」按鈕可能僅為 UI 測試，不產生正式處分。',
              'The platform aims at risk control, limiting harm, and marketplace order—not final academic or judicial rulings on taxonomy, authenticity, or complex copyright. When needed, it may suggest private settlement, third-party appraisal, or referral to authorities; demo "appeal" buttons may be UI tests without formal enforcement.'
            ],
          ],
          [
            [
              '暫停交割／提領、隱藏 listing、要求補件、通知回覆。',
              'Suspend settlement/payout, hide listing, request docs, notify response.'
            ],
            [
              '撤回驗證、限制下載、限制帳號、協助保全證據。',
              'Revoke verification, restrict download, restrict account, preserve evidence.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼情況下較可能獲得退款或撤銷交易？',
          'When is a refund or transaction reversal more likely?',
          [
            [
              '退款或撤銷並非自動發生，但在以下類型中較可能進入實質審核並獲支持：listing 或授權存在重大不實且可舉證；明示含實體或特定數位交付但客觀上未提供；實體標本與 listing 描述嚴重不符且買方在約定期限內提出有效證據；賣方經審核確實無權授權核心內容；重複扣款或明顯系統錯誤；或該筆交易之 listing／服務條款明文允許特定情形下退款。',
              'Refunds or reversals are not automatic, but these cases more often receive substantive review and support: material misrepresentation of listing or license with proof; promised physical or specific digital delivery objectively not provided; physical specimen materially inconsistent with listing with timely buyer evidence; seller lacks rights to license core content after review; duplicate charges or obvious system error; or listing/terms explicitly allow refund in the circumstance.'
            ],
            [
              '即使進入退款討論，也可能僅部分退款（例如扣除已交付且不可撤回之數位檔案價值）、改為補充授權、延長交付期限或要求賣方補正 metadata。正式環境將定義時限、貨幣與原路退回規則；示範 checkout 之「退款成功」不構成真實金流承諾。',
              'Even when refund is discussed, outcomes may be partial (e.g., deducting value of delivered irrevocable digital files), supplemental license, extended delivery, or seller metadata correction. Production will define deadlines, currency, and refund routing; demo "refund success" is not a real payment promise.'
            ],
          ],
          [
            [
              '重大資料錯誤、明確未交付、實體嚴重不符。',
              'Material data error, clear non-delivery, serious physical mismatch.'
            ],
            [
              '賣方無權授權、條款明文允許退款、付款異常。',
              'Seller lacked rights, terms allow refund, payment anomaly.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼情況下通常不會退款？',
          'When is a refund usually not available?',
          [
            [
              '以下情形通常難以支持全額退款（仍依個案與正式條款）：買方單純改變心意或對科學價值／收藏價值期待落空；成交前未閱讀授權範圍或 physical binding 標示；買方自行誤用、超範圍散布或違反授權後才主張「無法使用」；數位授權已依 listing 交付且買方已下載或可合理取得高解析檔案；或因買方所在地法規、進口限制或機構內規導致無法使用—而 listing 已合理標示法規或地域限制且賣方無不實陳述。',
              'These cases usually resist full refund (still case-by-case and per formal terms): buyer remorse or disappointed scientific/collecting expectations; failure to read license or physical binding before settlement; buyer misuse, over-distribution, or license breach then claiming "unusable"; digital license delivered per listing with download or reasonable access to high-res files; or buyer jurisdiction import/institutional rules blocking use where listing reasonably flagged limits and seller did not misrepresent.'
            ],
            [
              '學名日後修訂、MGS 分級調整、或 verification 徽章撤回，原則上不等同自動退款理由，除非 listing 當時存在可證明之重大不實。買方應在付款前完成「購買前檢查表」與 K、L 類 FAQ 所載之確認項目，以降低此類爭議。',
              'Later taxonomic revision, MGS tier change, or verification badge revocation are generally not automatic refund grounds unless listing contained provable material misrepresentation at settlement. Buyers should complete the pre-purchase checklist and sections K and L before payment to reduce such disputes.'
            ],
          ],
          [
            [
              '改變心意、未確認授權、自行誤用資料。',
              'Remorse, unread license, self-caused misuse.'
            ],
            [
              '數位已交付且已下載；買方所在地法規導致無法使用（listing 已合理標示）。',
              'Digital delivered and downloaded; buyer jurisdiction blocks use (listing flagged).'
            ],
          ]
        ),
        faqItem(isZh,
          '平台爭議處理是否等於法律判決？',
          'Does platform dispute handling equal a legal judgment?',
          [
            [
              '不等於。平台申訴與內部審核流程是市集營運層級之風險控管、證據保全與服務處理，用於在正式條款框架內盡量減少損害、維護秩序與保護善意使用者。平台不是法院、仲裁機構、著作權專門法庭、CITES 主管機關或學術鑑定機構；對學名對錯、標本真偽、複雜侵權或跨境法遵之終局認定，仍可能需司法、仲裁、行政機關或合格專家鑑定。',
              'No. Platform appeals and internal review are marketplace-level risk control, evidence preservation, and service handling within formal terms—to limit harm, maintain order, and protect good-faith users. The platform is not a court, arbitral tribunal, copyright court, CITES authority, or academic appraisal body; final rulings on taxonomy, authenticity, complex infringement, or cross-border compliance may still require judiciary, arbitration, agencies, or qualified experts.'
            ],
            [
              '平台可能依服務條款作出對平台帳號、listing 可見性、托管釋放或退款建議之處置，但該處置不當然約束雙方在平台外之民事請求權或刑事追訴。當事人應自行評估是否尋求律師、調解、仲裁或報案。正式上線後，完整申訴 SLA、上訴一次機制與責任限制，以公布之服務條款為準；本 FAQ 僅協助理解流程邏輯。',
              'The platform may act on accounts, listing visibility, escrow release, or refund recommendations under terms, but that does not bind parties\' off-platform civil claims or criminal prosecution. Parties should assess counsel, mediation, arbitration, or reporting separately. After launch, full appeal SLA, one-level review, and liability limits are governed by published terms—this FAQ explains process logic only.'
            ],
          ],
          [
            [
              '平台流程 = 風險控管與服務處理，非法院判決。',
              'Platform process = risk control and service handling, not court judgment.'
            ],
            [
              '不取代法院、仲裁、主管機關或專業鑑定。',
              'Does not replace courts, arbitration, authorities, or expert appraisal.'
            ],
            [
              '正式權利義務以服務條款與個別交易約定為準。',
              'Binding rights and duties follow terms and each transaction.'
            ],
          ]
        ),
      ],
    };

    content.faqDisputeEvidenceCard = {
      theme: 'dispute',
      title: p(isZh, '爭議申訴證據清單', 'Dispute evidence checklist'),
      intro: p(
        isZh,
        '提出申訴前請盡量備齊下列項目（依爭議類型選用）。詳細說明見「P. 發生爭議時怎麼辦？」。',
        'Gather applicable items before filing (by dispute type). See section P for full guidance.'
      ),
      footnote: p(
        isZh,
        '證據須合法取得；平台處理不等於法律判決。正式時限與格式以服務條款為準。',
        'Evidence must be lawfully obtained; platform handling is not a legal judgment. Deadlines and formats follow terms of service.'
      ),
      linkLabel: p(isZh, '查看完整 FAQ', 'Read full FAQ'),
      linkTarget: 'faq-group-dispute-guide',
      sections: [
        {
          title: p(isZh, '買方常用證據', 'Buyer evidence'),
          items: [
            p(isZh, 'SAT ID、交易編號、listing／Rights 截圖、付款紀錄。', 'SAT ID, transaction ID, listing/Rights screenshots, payment records.'),
            p(isZh, '對話紀錄；實體爭議加開箱影片、損壞照片、物流單。', 'Messages; for physical disputes add unboxing video, damage photos, shipping docs.'),
            p(isZh, '學名／metadata：第三方資料庫、文獻或鑑定摘要。', 'Taxonomy/metadata: third-party databases, literature, or appraisal summary.'),
          ],
        },
        {
          title: p(isZh, '賣方常用證據', 'Seller evidence'),
          items: [
            p(isZh, '授權條款快照、影像權利證明、provenance 文件。', 'License snapshot, image rights proof, provenance documents.'),
            p(isZh, '寄送證明、包裝照片、物流追蹤、風險移轉條款。', 'Shipment proof, packing photos, tracking, risk-transfer terms.'),
            p(isZh, '買方超授權使用之公開截圖（合法取得）。', 'Public screenshots of buyer overuse (lawfully obtained).'),
          ],
        },
      ],
    };

    var insertAt = 14;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, disputeGroup);
    } else {
      content.faqGroups.push(disputeGroup);
    }
  };
})(typeof window !== 'undefined' ? window : this);
