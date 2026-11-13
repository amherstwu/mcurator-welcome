/**
 * Buyer pre-purchase checklist — FAQ group + quick-read card for SAT about page.
 * Inserts group I after category B; does not modify existing A–H items.
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

  global.MC_SAT_appendFaqChecklist = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var checklistGroup = {
      title: p(isZh, 'I. 購買前檢查清單', 'I. Buyer pre-purchase checklist'),
      items: [
        faqItem(isZh,
          '付款前，我如何確認是否含實體標本？',
          'Before paying, how do I confirm whether a physical specimen is included?',
          [
            [
              '每一筆 listing 都應在成交前明示是否含「實體標本綁定（physical specimen binding）」。請在 listing 頁、標本護照摘要、Rights 分頁與 checkout 確認畫面中，尋找類似「含實體標本」「Physical specimen included」「physical specimen binding: yes」等欄位或徽章；若完全沒有相關標示，請不要自行假設會收到實體標本。',
              'Each listing should state before settlement whether physical specimen binding applies. On the listing page, passport summary, Rights tab, and checkout confirmation, look for labels such as "Physical specimen included" or "physical specimen binding: yes". If there is no such label anywhere, do not assume a physical specimen will be shipped.'
            ],
            [
              '若 listing 未明示含實體標本，預設取得內容通常僅限：SAT 數位紀錄、標本護照（依授權可瀏覽或下載）、結構化元資料，以及 listing 所載之授權使用權。這代表您可能僅取得數位身分、引用權或有限展示權，而非實體標本之保管權、所有權或跨境移動權。',
              'When a listing does not explicitly include a physical specimen, the default deliverables are typically: SAT digital record, Specimen Passport (view or download per license), structured metadata, and usage rights as stated on the listing. You may receive digital identity, citation rights, or limited display rights—not custody, ownership, or cross-border movement of a physical specimen.'
            ],
            [
              '並非所有 SAT 都會寄送標本。純數位圖版、去識別化產地之教學圖像、僅授權引用的 voucher 影像、或機構僅開放數位流通之典藏紀錄，都可能不含實體移交。若您需要實體標本，應只考慮明確標示 physical binding 的 listing，並在付款前向賣方確認包裝、運送、許可證與驗收條件。',
              'Not every SAT ships a specimen. Digital-only plates, de-identified teaching images, citation-only voucher imagery, or institutional records licensed for digital circulation only may exclude physical transfer. If you need a physical specimen, choose listings with explicit physical binding and confirm packaging, shipping, permits, and acceptance terms with the seller before payment.'
            ],
            [
              '示範環境中的 checkout 可能顯示 mock 物流欄位；正式環境中，含實體標本者通常需要另議或另簽署移交條款。付款前請截圖或保存 listing 快照，以便日後核對「當時是否明示含實體」—勿僅依口頭承諾或第三方轉述。',
              'Demo checkout may show mock logistics fields; in production, physical specimens usually require separate transfer terms. Before paying, save a listing snapshot to verify what was explicitly stated about physical inclusion—do not rely on verbal promises or third-party summaries alone.'
            ],
          ],
          [
            [
              '檢查 listing 是否出現 physical specimen binding 或同等明示欄位。',
              'Check whether the listing shows physical specimen binding or an equivalent explicit field.'
            ],
            [
              '若無標示，預設僅取得數位紀錄、護照與授權—不預期收到標本。',
              'If unstated, assume digital record, passport, and license only—do not expect a specimen.'
            ],
            [
              '需要實體者，應另確認 CITES、出口許可、運費與驗收流程。',
              'If you need physical material, also confirm CITES, export permits, shipping cost, and acceptance workflow.'
            ],
          ]
        ),
        faqItem(isZh,
          '付款前，我應如何逐項核對授權範圍？',
          'Before paying, how should I verify license scope item by item?',
          [
            [
              '授權範圍必須在 listing 的「權利與授權（Rights & License）」區塊逐項閱讀，而非僅看標題或價格。SAT 不提供「買了就有全部權利」的預設包；每一筆交易的可用行為（下載、商用、教育、展覽、改作、嵌入、再授權、轉售）皆應在 listing 或附檔授權條款中明示。',
              'License scope must be read item by item in the listing\'s Rights & License section—not inferred from title or price alone. SAT does not ship a default "full rights" bundle; each transaction should explicitly state permitted actions (download, commercial use, education, exhibition, adaptation, embedding, sublicensing, resale).'
            ],
            [
              '建議在付款前至少確認：① 是否可下載原始或衍生檔案；② 是否可商業使用（含商品、廣告、付費課程）；③ 是否可教育與非營利教學使用；④ 是否可公開或借展陳列；⑤ 是否可再授權給第三方；⑥ 是否可轉售或轉讓授權；⑦ 是否有期限、地區、用途、署名或改作限制。若任一項未寫明，應視為「未授予」並向賣方詢問，而非自行推論。',
              'Before payment, confirm at minimum: (1) downloadable source or derivative files; (2) commercial use (products, ads, paid courses); (3) educational and non-profit teaching use; (4) public display or loan exhibition; (5) sublicensing to third parties; (6) resale or license transfer; (7) term, territory, purpose, attribution, or adaptation limits. If any item is unstated, treat it as not granted and ask the seller—do not infer permission.'
            ],
            [
              '常見落差包括：以為可商用但 listing 僅限學術引用；以為可無限制下載但僅提供低解析預覽；以為可轉售 NFT 或二級市場但授權禁止轉讓。引用 SAT ID 並不等同取得超出 listing 的權利；對外發表、出版或商用前，應保留授權摘要截圖或 PDF。',
              'Common gaps: assuming commercial rights when only academic citation is allowed; assuming full download when only low-res preview is offered; assuming NFT or secondary resale when transfer is prohibited. Citing an SAT ID does not grant rights beyond the listing; keep a license summary screenshot or PDF before publication or commercial use.'
            ],
          ],
          [
            [
              '可下載？格式與解析度為何？',
              'Downloadable? What formats and resolution?'
            ],
            [
              '可商業／教育／展覽使用？是否需署名？',
              'Commercial / educational / exhibition use? Attribution required?'
            ],
            [
              '可再授權、轉售或嵌入第三方平台？',
              'Sublicense, resell, or embed on third-party platforms?'
            ],
            [
              '是否有限制期限、地區或特定用途？',
              'Any term, territory, or purpose restrictions?'
            ],
          ]
        ),
        faqItem(isZh,
          '付款前，我應檢查哪些資料完整度欄位？',
          'Before paying, which data completeness fields should I review?',
          [
            [
              '資料完整度直接影響您能否引用、教學、展覽或進行後續研究。付款前應檢視 listing 與 SAT 詳情中的核心科學欄位：學名（含作者年份或最低可接受之分類標示）、SAT ID、類別、產地（公開或依政策模糊化）、採集或登錄日期、保管者，以及 completeness 百分比或完整度徽章（若顯示）。',
              'Data completeness affects whether you can cite, teach, exhibit, or continue research. Before payment, review core scientific fields on the listing and SAT detail: scientific name (with author/year or minimum acceptable taxonomic label), SAT ID, category, locality (public or obfuscated per policy), collection or accession date, custodian, and completeness percentage or badge (if shown).'
            ],
            [
              '影像與佐證方面：是否有 hero-passport 或診斷照片？是否有尺度標（scale bar）或可判斷大小的參考物？是否有來源履歷（provenance timeline）與關鍵事件（採集、入館、數位化、驗證）？若 listing 未提供照片，表示尚無可公開 hero 影像，平台不會以占位圖替代—請評估是否仍符合您的使用需求。',
              'For imagery and evidence: is there a hero-passport or diagnostic photo? A scale bar or size reference? A provenance timeline with key events (collection, accession, digitization, verification)? If no photo is shown, no public hero image is available and placeholders are not substituted—assess whether the record still meets your needs.'
            ],
            [
              '驗證狀態方面：是否有館員或 curator 覆核徽章？是否標示 SAT-MGS 或同等分級（若平台採用）？驗證代表資料就緒度里程碑，不代表學界定名之終局正確性，但可協助您判斷資料是否已通過最低一致性檢查。若關鍵欄位缺失且賣方無法補正，應審慎評估是否仍適合下單。',
              'For verification: is there a curator review badge? SAT-MGS or equivalent tier (if used)? Verification marks readiness milestones, not final taxonomic authority, but helps assess minimum consistency checks. If critical fields are missing and the seller cannot correct them, reconsider whether to proceed.'
            ],
          ],
          [
            [
              '學名、SAT ID、類別、日期、保管者是否齊全且一致？',
              'Are scientific name, SAT ID, category, dates, and custodian present and consistent?'
            ],
            [
              '產地是公開、遮蔽還是僅供申請後提供？',
              'Is locality public, obfuscated, or available only on request?'
            ],
            [
              '是否有照片、尺度標、provenance 與驗證／SAT-MGS 分級？',
              'Photos, scale bar, provenance, and verification / SAT-MGS tier?'
            ],
          ]
        ),
        faqItem(isZh,
          '付款前，我應評估哪些法規與跨境風險？',
          'Before paying, which regulatory and cross-border risks should I assess?',
          [
            [
              'SAT 交易可能涉及 CITES 附錄物種、國內保育法規、化石或古生物遺跡法、文化資產出口管制，以及買方所在地之進口、持有或展示限制。listing 若有 CITES、附錄、受保護物種或 heritage 相關標示，應逐字閱讀並在付款前自行確認您所在司法管轄區是否允許持有、進口或公開展示。',
              'SAT transactions may involve CITES appendices, domestic conservation laws, fossil or paleontological heritage rules, cultural property export controls, and import, possession, or display limits in the buyer\'s jurisdiction. If a listing flags CITES, appendices, protected species, or heritage, read those labels carefully and confirm whether your jurisdiction allows possession, import, or public display before payment.'
            ],
            [
              '含實體標本者，跨境運送可能需要出口許可、檢疫、報關與買方進口許可；平台通常不代辦 CITES 或海關程序，除非 listing 或個別合約明示。即使數位授權不含實體，某些敏感物種之精确產地或採集資訊仍可能受機構政策或法規限制—請勿假設「純數位」即無任何法遵義務。',
              'Physical specimens may require export permits, quarantine, customs clearance, and buyer import authorization; the platform generally does not handle CITES or customs unless explicitly stated on the listing or contract. Even digital-only licenses may involve sensitive locality or collection data governed by institutional policy or law—do not assume "digital only" means zero compliance duties.'
            ],
            [
              '若 listing 未提及法規風險但物種、產地或標本類型高度敏感，應主動詢問賣方並諮詢合格之進出口或保育法顧問。買方通常需自行承擔所在地法規不合規之後果；平台 FAQ 不構成法律意見。',
              'If no regulatory flags appear but species, locality, or specimen type is sensitive, ask the seller proactively and consult qualified import/export or conservation counsel. Buyers typically bear consequences of non-compliance in their jurisdiction; this FAQ is not legal advice.'
            ],
          ],
          [
            [
              '是否涉及 CITES 附錄或受保護／瀕危物種？',
              'CITES appendices or protected / endangered species?'
            ],
            [
              '是否涉及化石、文化資產或特殊出口限制？',
              'Fossils, cultural heritage, or special export restrictions?'
            ],
            [
              '實體能否合法跨境運送？買方所在地能否持有或進口？',
              'Can physical material cross borders legally? Can you possess or import it locally?'
            ],
          ]
        ),
        faqItem(isZh,
          '付款前，我應確認哪些付款方式與退款條件？',
          'Before paying, which payment methods and refund terms should I confirm?',
          [
            [
              '請在 checkout 前確認 listing 接受的付款方式（例如信用卡、銀行匯款、平台托管 escrow、分期或—若明示—鏈上支付），以及是否還有平台服務費、金流手續費、匯款費、gas fee（若適用）、稅費或跨境匯差由誰負擔。示範環境中的價格與付款流程可能為 mock，不代表正式收費表。',
              'Before checkout, confirm accepted payment methods (card, bank transfer, platform escrow, installments, or—if explicitly offered—on-chain payment) and who pays platform fees, payment processing fees, wire fees, gas fees (if any), taxes, or FX spread. Demo prices and checkout flows may be mock and do not represent final fee schedules.'
            ],
            [
              '退款政策應以 listing、賣方聲明、平台服務條款與該筆交易紀錄為準。常見可討論退款或撤銷的情境包括：重大 listing 不實（例如明示含實體但未交付）、授權範圍與成交快照嚴重不符、重複扣款或明顯系統錯誤—但具體是否退款仍依個案審核與正式條款，平台不保證自動全額退款。',
              'Refund policy is governed by the listing, seller statements, terms of service, and transaction record. Refunds or reversals may be considered for material misrepresentation (e.g., physical specimen promised but not delivered), license scope materially inconsistent with the settlement snapshot, duplicate charges, or obvious system errors—but outcomes depend on case review and formal terms; automatic full refunds are not guaranteed.'
            ],
            [
              '許多數位授權在檔案交付、下載連結生效或 SAT 保管權更新後，可能依賣方政策與適用法規視為已履約，因而限制或排除退款—尤其是已可下載高解析檔案或已對外引用者。付款前請閱讀「數位交付後是否不可退款」之說明；若條款不清楚，應先詢問賣方再付款。',
              'Many digital licenses may be treated as fulfilled once files are delivered, download links activate, or SAT custody updates—limiting or excluding refunds under seller policy and applicable law, especially after high-resolution download or public citation. Read whether post-delivery refunds are excluded; if unclear, ask the seller before paying.'
            ],
          ],
          [
            [
              '賣家接受哪些付款方式？總價是否含平台費、手續費、gas 或稅？',
              'Which payment methods does the seller accept? Does the total include platform, processing, gas, or tax?'
            ],
            [
              '什麼情況可申請退款或爭議？時限為何？',
              'Under what conditions can you request a refund or dispute? What are the time limits?'
            ],
            [
              '數位授權交付或下載後，是否仍可退款？',
              'After digital delivery or download, are refunds still available?'
            ],
          ]
        ),
      ],
    };

    var insertAt = 2;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, checklistGroup);
    } else {
      content.faqGroups.push(checklistGroup);
    }

    content.faqPrePurchaseCard = {
      title: p(isZh, '購買前檢查表', 'Pre-purchase checklist'),
      intro: p(
        isZh,
        '付款前請快速核對以下五項。若任一項 listing 未明示，請先詢問賣方或查閱下方「I. 購買前檢查清單」完整 FAQ，勿自行假設權利或交付內容。',
        'Before you pay, quickly verify these five areas. If any item is unstated on the listing, ask the seller or read section I below—do not assume rights or deliverables.'
      ),
      footnote: p(
        isZh,
        '本檢查表為理解輔助，不取代 listing 授權條款、正式服務條款或個別合約。',
        'This checklist aids understanding; it does not replace listing licenses, formal terms, or individual contracts.'
      ),
      linkLabel: p(isZh, '查看完整 FAQ', 'Read full FAQ'),
      linkTarget: 'faq-group-precheck',
      sections: [
        {
          title: p(isZh, '1. 是否含實體標本', '1. Physical specimen'),
          items: [
            p(isZh, 'listing 是否明示 physical specimen binding？', 'Does the listing explicitly state physical specimen binding?'),
            p(isZh, '若無標示，預設僅數位紀錄、護照或授權—不含寄送標本。', 'If unstated, default is digital record, passport, or license—no specimen shipment.'),
            p(isZh, '並非所有 SAT 都會寄送實體標本。', 'Not every SAT includes physical specimen delivery.'),
          ],
        },
        {
          title: p(isZh, '2. 授權範圍', '2. License scope'),
          items: [
            p(isZh, '是否可下載、商業使用、教育使用、展覽使用？', 'Download, commercial, educational, and exhibition use?'),
            p(isZh, '是否可再授權、轉售或嵌入第三方？', 'Sublicense, resell, or embed on third-party platforms?'),
            p(isZh, '是否有限制期限、地區或用途？', 'Any limits on term, territory, or purpose?'),
          ],
        },
        {
          title: p(isZh, '3. 資料完整度', '3. Data completeness'),
          items: [
            p(isZh, '學名、產地（公開或模糊化）、照片、尺度標是否齊全？', 'Scientific name, locality (public or obfuscated), photos, scale bar?'),
            p(isZh, '是否有 provenance 來源履歷？', 'Is there a provenance timeline?'),
            p(isZh, '是否有館員驗證或 SAT-MGS 分級？', 'Curator verification or SAT-MGS tier?'),
          ],
        },
        {
          title: p(isZh, '4. 法規風險', '4. Regulatory risk'),
          items: [
            p(isZh, '是否涉及 CITES、保育類、化石或文化資產？', 'CITES, protected species, fossils, or cultural heritage?'),
            p(isZh, '實體能否跨境運送？', 'Can physical material cross borders?'),
            p(isZh, '買方所在地是否允許持有或進口？', 'Does your jurisdiction allow possession or import?'),
          ],
        },
        {
          title: p(isZh, '5. 付款與退款', '5. Payment & refunds'),
          items: [
            p(isZh, '使用哪種付款方式？是否另有平台費、gas、匯款費或稅？', 'Payment method? Platform, gas, wire, or tax fees?'),
            p(isZh, '什麼情況可以退款？', 'When are refunds available?'),
            p(isZh, '數位授權交付後是否不可退款？', 'Are refunds excluded after digital delivery?'),
          ],
        },
      ],
    };
  };
})(typeof window !== 'undefined' ? window : this);
