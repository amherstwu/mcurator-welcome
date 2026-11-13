/**
 * Verification badges and SAT-MGS grading — FAQ group for SAT about page.
 * Inserts group M before category D (verification); does not modify existing items.
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

  global.MC_SAT_appendFaqVerificationBadges = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var badgeGroup = {
      title: p(isZh, 'M. 驗證徽章與 SAT-MGS 分級', 'M. Verification badges & SAT-MGS grading'),
      items: [
        faqItem(isZh,
          'Curator Verified 是什麼？代表哪些保證？',
          'What is Curator Verified, and what does it guarantee?',
          [
            [
              'Curator Verified（館員／審核者已驗證）表示在平台工作流中，具館員、典藏、研究或指定審核角色之人員，已依內部檢查清單檢視該 SAT 之關鍵欄位—例如學名格式、SAT ID 一致性、產地政策、授權摘要、影像與 listing 描述之基本對應、以及是否需補充法規或來源警示。此徽章代表「已有人工覆核之資料就緒度里程碑」，而非對外發行之官方證書。',
              'Curator Verified means that in the platform workflow, a curator, collection staff member, researcher, or designated reviewer has checked key SAT fields against an internal checklist—e.g., scientific name format, SAT ID consistency, locality policy, license summary, basic alignment of images and listing text, and whether regulatory or provenance warnings are needed. The badge marks a human-reviewed readiness milestone—not an externally issued official certificate.'
            ],
            [
              'Curator Verified 不等於政府認證、CITES 核准、出口許可或任何主管機關之登記。它不等同學術期刊之同儕審查（peer review），也不代表學界對物種鑑定、分類修訂或標本真偽之終局裁定。它更不構成對「標本必為真」「影像必與實體完全一致」或「可合法跨境移動」之法律保證。',
              'Curator Verified is not government certification, CITES approval, export permit, or any authority registration. It is not journal peer review and does not represent final taxonomic authority, revision, or specimen authenticity. It is not a legal warranty that the specimen is genuine, that images match the physical object, or that cross-border movement is lawful.'
            ],
            [
              '買方、引用者與合作機構應將 Curator Verified 解讀為：該筆資料已通過平台定義之人工覆核門檻，適合作為進一步引用或交易評估的起點；重大決策仍應查閱 listing 授權、provenance、法規標示與原始文件。若覆核後發現錯誤，徽章可能被撤回或降級（見下方說明）。',
              'Buyers, citers, and partner institutions should read Curator Verified as: the record passed the platform\'s human review threshold and is a starting point for citation or transaction evaluation; major decisions still require listing license, provenance, regulatory flags, and source documents. If errors emerge after review, the badge may be revoked or downgraded (see below).'
            ],
          ],
          [
            [
              '表示館員或審核者已檢查關鍵欄位。',
              'Curator or reviewer checked key fields.'
            ],
            [
              '≠ 政府認證、同儕審查、標本真偽保證。',
              'Not government cert, peer review, or authenticity warranty.'
            ],
          ]
        ),
        faqItem(isZh,
          'Metadata Complete 是什麼？',
          'What is Metadata Complete?',
          [
            [
              'Metadata Complete（元資料完整）表示該 SAT 已通過平台規則引擎對「必要欄位完整度」之檢查。常見必填或高權重欄位包括：學名（或最低可接受分類標示）、SAT ID、資產類別、產地（公開或依政策遮蔽）、hero 或護照影像連結（若該類別要求）、來源／保管者摘要、授權類型摘要，以及 listing 要求之其他結構化欄位。完整度百分比或徽章僅反映欄位是否齊備與格式是否一致。',
              'Metadata Complete means the SAT passed the platform rule engine\'s required-field completeness check. Common required or high-weight fields include scientific name (or minimum taxonomic label), SAT ID, asset category, locality (public or obfuscated per policy), hero or passport image link (when required for that category), source/custodian summary, license type summary, and other structured fields the listing requires. Completeness percentage or badge reflects whether fields are present and format-consistent.'
            ],
            [
              '完整（complete）不等於完全正確（correct）。欄位可以齊全但仍可能有錯字、過時學名、產地粒度不符、影像非當前標本，或授權摘要與附檔不一致。Metadata Complete 的價值在於提高資料可用性與可機讀性，讓買方與引用者快速判斷「是否值得進一步核對」，而非宣告科學或法律上已無可爭議。',
              'Complete is not the same as correct. Fields may be filled yet still contain typos, outdated names, wrong locality granularity, images not of the current specimen, or license summaries inconsistent with attachments. Metadata Complete improves usability and machine readability so buyers and citers can quickly judge whether deeper verification is worthwhile—not that the record is scientifically or legally beyond dispute.'
            ],
          ],
          [
            [
              '必要欄位（學名、類別、照片、來源、授權、保管者等）已齊備。',
              'Required fields (name, category, photo, source, license, custodian, etc.) are present.'
            ],
            [
              '完整 ≠ 正確；代表資料可用性較高。',
              'Complete ≠ correct; indicates higher data usability.'
            ],
          ]
        ),
        faqItem(isZh,
          'Provenance Complete 是什麼？',
          'What is Provenance Complete?',
          [
            [
              'Provenance Complete（來源履歷完整）表示 provenance timeline 已包含平台定義之基本事件序列，足以支援稽核與敘事追溯。典型事件類型包括：採集（collection）、入館或 accession、修復或製作、數位化、SAT mint／登錄、驗證、上架（listing）、成交或 custody 轉移等—實際必填事件依資產類型與機構政策而異。',
              'Provenance Complete means the provenance timeline includes the platform\'s baseline event sequence sufficient for audit and narrative traceability. Typical events include collection, accession, preparation, digitization, SAT mint/registration, verification, listing, settlement, or custody transfer—required events vary by asset type and institutional policy.'
            ],
            [
              'Provenance Complete 代表「時間軸結構已就緒且有基本事件覆蓋」，不代表每一歷史事件都已由獨立第三方證實或具不可爭議之文件。部分事件可能來自賣方自述、機構內部紀錄摘要或尚待補件之文件。即便如此，完整時間軸仍有助於買方、館員與爭議處理時追蹤「何時發生何事」，並與 Metadata Complete、Curator Verified 搭配使用。',
              'Provenance Complete means the timeline structure is ready with baseline event coverage—not that every historical event is independently verified or beyond dispute. Some events may rely on seller statements, institutional summaries, or pending documents. Even so, a complete timeline helps buyers, curators, and dispute handling trace what happened when, alongside Metadata Complete and Curator Verified.'
            ],
          ],
          [
            [
              '來源履歷具基本時間軸與關鍵事件。',
              'Provenance has baseline timeline and key events.'
            ],
            [
              '≠ 每個事件都已第三方證實；但有助追蹤與審核。',
              'Not every event is third-party verified; still aids traceability and review.'
            ],
          ]
        ),
        faqItem(isZh,
          'SAT-MGS 是什麼？如何解讀？',
          'What is SAT-MGS, and how should it be interpreted?',
          [
            [
              'SAT-MGS（SAT Marketplace Grading System，市集分級系統）是 MCurator 針對 listing 與 SAT 紀錄所設計的分級框架，用於綜合評估：照片／圖版品質與診斷特徵可見度、結構化 metadata 完整度、provenance 就緒度、授權條款清楚度，以及（若適用）與實體標本描述之一致性。分級結果以 tier 或分數區間呈現，供買方快速比較「資料與展示完整度」，而非單一價格因子。',
              'SAT-MGS (SAT Marketplace Grading System) is MCurator\'s grading framework for listings and SAT records, combining photo/plate quality and diagnostic feature visibility, structured metadata completeness, provenance readiness, license clarity, and (where applicable) alignment with physical specimen descriptions. Results appear as tiers or score bands so buyers can compare data and presentation completeness—not a single price driver.'
            ],
            [
              'SAT-MGS 是資料品質與展示完整度之參考指標，不是投資評級、不是金融商品風險等級，也不是對未來價格、流通性、保值或轉售獲利之保證。示範環境中的 MGS 分級可能依 mock 規則計算；正式環境將另行公告計分邏輯與更新頻率。分級可隨補件、撤回驗證或 listing 變更而調整。',
              'SAT-MGS is a reference for data quality and presentation completeness—not an investment grade, financial risk class, or guarantee of future price, liquidity, preservation of value, or resale profit. Demo MGS may use mock rules; production will publish scoring logic and update cadence. Grades may change with supplemental documents, verification revocation, or listing updates.'
            ],
          ],
          [
            [
              '評估照片、診斷特徵、metadata、provenance、授權清楚度。',
              'Scores photo, diagnostics, metadata, provenance, license clarity.'
            ],
            [
              '是品質參考；不是投資評級或價格保證。',
              'Quality reference only—not investment grade or price guarantee.'
            ],
          ]
        ),
        faqItem(isZh,
          '驗證徽章或 SAT-MGS 分級可以被撤回或降級嗎？',
          'Can verification badges or SAT-MGS grades be revoked or downgraded?',
          [
            [
              '可以。平台與指定審核者可在發現或接獲可信舉報後，撤回 Curator Verified、調整 Metadata／Provenance Complete 狀態，或下調 SAT-MGS 分級。常見原因包括：關鍵欄位錯誤或造假、影像著作權侵權或冒充標本照、provenance 重大缺失或與文件不符、授權摘要不實、listing 與實體標本狀態不符、法規標示嚴重省略，或機構要求更正／下架。',
              'Yes. The platform and designated reviewers may revoke Curator Verified, adjust Metadata/Provenance Complete status, or lower SAT-MGS tiers after discovery or credible reports. Common reasons: material field errors or fabrication, image copyright infringement or misrepresented specimen photos, major provenance gaps or document mismatch, false license summary, listing inconsistent with physical specimen status, serious omission of regulatory flags, or institutional correction/delisting requests.'
            ],
            [
              '撤回或降級之目的，是保護市集可信度、買方與引用者，並維護合規賣方之公平環境；對主動補正、誠實標示不完整來源者，平台通常鼓勵補件後重新審核，而非一律視為惡意欺詐。但若故意造假或重複違規，仍可能觸發上架限制或帳號處分（依正式賣家規範）。引用者與買方應以當下 SAT ID 解析結果為準，勿僅依舊截圖之徽章狀態。',
              'Revocation or downgrade protects marketplace trust, buyers, and citers, and fair treatment for compliant sellers; those who proactively correct and honestly label incomplete provenance are usually encouraged to resubmit for review rather than assumed fraudulent. Intentional fabrication or repeat violations may still trigger listing or account restrictions (under formal seller standards). Citers and buyers should rely on current SAT ID resolution—not old screenshot badge states.'
            ],
          ],
          [
            [
              '可以撤回或降級。',
              'Revocation or downgrade is possible.'
            ],
            [
              '原因：錯誤資料、侵權影像、來源／授權不實等。',
              'Reasons: bad data, infringing images, false provenance/license, etc.'
            ],
            [
              '目的在保護市場可信度；善意補正可重新審核。',
              'Aims to protect market trust; good-faith corrections may be re-reviewed.'
            ],
          ]
        ),
        faqItem(isZh,
          '學名未來被修訂時，SAT 紀錄如何處理？',
          'How are SAT records handled when a scientific name is revised?',
          [
            [
              'SAT 與科學命名一樣會隨分類學修訂而演進。平台不會因新學名公布而刪除或覆寫既有 SAT 紀錄、舊 citation 或 provenance 事件；反之，應以 append-only 方式追加「分類修訂（taxonomic revision）」紀錄，保留當時使用之舊學名、修訂後學名、修訂日期、文獻或權威來源依據（例如 primary reference、WoRMS、Catalogue of Life 連結—依平台支援），以及修訂執行者（館員、賣方或自動化規則觸發）。',
              'SAT records evolve with taxonomy like scientific naming itself. The platform does not delete or overwrite existing SAT records, old citations, or provenance events when a new name is published; instead, append a taxonomic revision record preserving the former name, revised name, revision date, literature or authority basis (e.g., primary reference, WoRMS, Catalogue of Life links—per platform support), and who performed the revision (curator, seller, or automated rule).'
            ],
            [
              '此設計讓研究引用可追溯：論文可引用當時之 SAT ID 與當時學名，同時讀者可查見後續修訂。Metadata Complete 或 MGS 可能因修訂而更新顯示，但不代表過去引用「失效」。若修訂涉及同物異名或重大身分變更，listing 應更新警示，買方與引用者應查閱修訂事件而非僅看護照截圖。',
              'This preserves citation traceability: papers may cite the SAT ID and name at time of citation while readers see later revisions. Metadata Complete or MGS display may update after revision without invalidating past citations. When revision involves synonymy or major identity change, listings should update warnings; buyers and citers should read revision events—not passport screenshots alone.'
            ],
          ],
          [
            [
              '不刪除舊資料；追加修訂紀錄。',
              'Do not delete old data; append revision records.'
            ],
            [
              '保留舊學名、修訂學名、文獻依據、修訂日期。',
              'Keep former name, revised name, reference basis, revision date.'
            ],
            [
              '支援研究引用之時間可追溯性。',
              'Supports time-traceable research citation.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 7;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, badgeGroup);
    } else {
      content.faqGroups.push(badgeGroup);
    }
  };
})(typeof window !== 'undefined' ? window : this);
