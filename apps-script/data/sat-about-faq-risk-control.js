/**
 * Platform risk control and prohibited conduct — FAQ group.
 * Inserts group R before category H (disputes & liability).
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

  global.MC_SAT_appendFaqRiskControl = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var riskGroup = {
      title: p(isZh, 'R. 哪些行為會被平台限制？', 'R. What conduct may the platform restrict?'),
      items: [
        faqItem(isZh,
          '哪些內容不得上架或將被限制？',
          'What content must not be listed or may be restricted?',
          [
            [
              '為維護市集安全、科學倫理與法遵邊界，下列內容不得上架，或經審核後可能遭隱藏、下架與帳號限制：非法採集、盜採或走私之標本；未經授權之化石、礦物或文化資產；侵犯著作權、商標或肖像權之影像；偽造或重大不實之 provenance、館藏編號或機構背書；假冒博物館、研究機構或館員身分；以 AI 生成圖像冒充真實標本現場照或診斷照片；公開精確 GPS 或敏感物種棲地而無合法授權或風險評估；以及違反 CITES、保育法規或文化資產出口管制之交易或暗示。',
              'To protect marketplace safety, research ethics, and compliance, the following must not be listed—or may be hidden, delisted, and account-restricted after review: illegally collected, pilfered, or smuggled specimens; unauthorized fossils, minerals, or cultural property; images infringing copyright, trademark, or likeness; fabricated or materially false provenance, accession numbers, or institutional endorsement; impersonation of museums, research institutions, or curators; AI-generated images passed off as authentic field or diagnostic photos; publication of precise GPS or sensitive species habitats without lawful authorization or risk review; and transactions or implications violating CITES, conservation law, or cultural property export controls.'
            ],
            [
              '上述限制旨在防止違法、侵權與對物種／棲地之危害，而非限制合法之科學流通。若賣方不確定標的是否可上架，應先完成 J 類「上架前檢查表」並諮詢機構法遵窗口或合格顧問，而非先上架再補救。',
              'These limits prevent unlawful, infringing, or habitat-harming activity—not lawful scientific circulation. If unsure whether material may be listed, complete section J pre-listing checklist and consult institutional compliance or qualified advisors before listing—not list first and fix later.'
            ],
          ],
          [
            [
              '非法採集、盜採、走私、侵權圖片、偽造 provenance／館藏、假冒機構。',
              'Illegal collection, pilfering, smuggling, infringing images, false provenance/collection, impersonation.'
            ],
            [
              'AI 冒充真實照片、敏感精確棲地、違反 CITES／保育法規。',
              'AI as authentic photos, sensitive precise habitats, CITES/conservation violations.'
            ],
          ]
        ),
        faqItem(isZh,
          '買方有哪些行為可能被限制？',
          'What buyer conduct may be restricted?',
          [
            [
              '買方應依 listing 與成交快照使用 SAT，下列行為可能觸發限制、申訴或帳號處分：超出授權下載、散布、商用或再授權圖片與 metadata；將教育或學術引用授權用於付費課程、廣告或商品而未取得商用授權；引用時未依要求標示 SAT ID 與 upstream 來源；私下誘導賣方跳過平台完成交易以規避紀錄與爭議管道；轉售或打包轉讓未被允許轉售之 SAT 或授權；偽造或篡改交易、付款或收據紀錄；以及將 SAT 對外宣傳為保證獲利、保值或投資商品。',
              'Buyers must use SAT per listing and settlement snapshot. The following may trigger restrictions, appeals, or account action: download, distribution, commercial use, or sublicensing beyond license; using educational or citation licenses for paid courses, ads, or products without commercial license; failing to attribute SAT ID and upstream source as required; inducing sellers off-platform to evade records and disputes; reselling or bundling SAT or licenses where resale is prohibited; forging or altering transaction, payment, or receipt records; and promoting SAT as guaranteed profit, store-of-value, or investment product.'
            ],
            [
              '限制措施之目的在於保護賣方、權利人與市集秩序，而非懲罰合理研究引用。若買方需超出現有授權之用途，應先洽詢賣方或升級授權，而非先使用再爭辯。',
              'Restrictions protect sellers, rights holders, and marketplace order—not punish reasonable research citation. For uses beyond current license, contact the seller or upgrade license first—not use first and argue later.'
            ],
          ],
          [
            [
              '超授權使用、教育授權商用、未標示來源。',
              'Overuse, commercial use of educational license, missing attribution.'
            ],
            [
              '私下跳過平台、非法轉售、偽造紀錄、投資化宣傳。',
              'Off-platform deals, unauthorized resale, forged records, investment hype.'
            ],
          ]
        ),
        faqItem(isZh,
          '賣方有哪些行為可能被限制？',
          'What seller conduct may be restricted?',
          [
            [
              '賣方對 listing 真實性與授權基礎負主要責任。可能被限制或下架之行為包括：誤導是否含實體標本（含影像暗示與文字矛盾）；誤導授權範圍或使用模糊語句迴避商用、再授權或下載限制；錯標物種、產地或故意隱瞞已知疑點；上架無權再授權之第三方或機構資料；成交後任意修改已綁定之授權或交付條款；要求買方私下付款以逃避平台紀錄；以及重複上架同一資產、同一 SAT ID 或易混淆 duplicates 造成市場混亂。',
              'Sellers bear primary responsibility for listing truthfulness and licensing basis. Restricted or delistable conduct includes: misleading physical specimen inclusion (imagery vs text conflict); misleading license scope or vague wording evading commercial, sublicense, or download limits; mislabeled taxonomy or locality or deliberate concealment of known issues; listing third-party or institutional data without relicensing rights; post-settlement unilateral changes to bound license or delivery terms; requesting off-platform payment to evade records; and duplicate or confusing relisting of the same asset or SAT ID.'
            ],
            [
              '賣方若發現自身 listing 有誤，應主動更正、補件或暫停展示；平台通常對主動補正較對待，對故意誤導則從嚴。正式環境將依賣家規範定義處分梯度；本 FAQ 說明原則，不構成個案承諾。',
              'If sellers discover listing errors, proactively correct, supplement documents, or pause display—voluntary correction is usually treated differently from intentional misrepresentation. Production will define enforcement tiers in seller standards; this FAQ states principles, not case promises.'
            ],
          ],
          [
            [
              '誤導實體或授權、錯標物種、上架無權資料。',
              'Misleading physical/license flags, wrong taxonomy, unlicensed data.'
            ],
            [
              '成交後改條款、私下收款、重複混淆上架。',
              'Post-sale term changes, off-platform payment, confusing duplicates.'
            ],
          ]
        ),
        faqItem(isZh,
          '平台可能採取哪些風控措施？',
          'What risk-control measures may the platform take?',
          [
            [
              '依情節、證據與正式服務條款，平台可能採取單一或多項措施：提醒或要求限期補正；要求提交權利、provenance 或法規證明；暫停 listing 展示或新交易；下架或限制搜尋；撤回或降低 verification 徽章與 SAT-MGS 分級；限制該 SAT 下載、匯出或對外 QR 解析；暫停托管、付款或提領；限制上架、購買、訊息或申訴濫用；保存 listing 快照、通訊與交易紀錄供爭議與法遵需要；並在適用法規允許範圍內配合權利人、機構或主管機關之合法請求。',
              'By severity, evidence, and formal terms, the platform may take one or more measures: notice or deadline to correct; require rights, provenance, or regulatory proof; suspend listing display or new transactions; delist or limit search; revoke or lower verification badges and SAT-MGS tiers; restrict download, export, or public QR resolution for that SAT; hold escrow, payment, or payout; limit listing, purchase, messaging, or appeal abuse; preserve listing snapshots, communications, and transaction records for disputes and compliance; and cooperate with lawful requests from rights holders, institutions, or authorities where permitted.'
            ],
            [
              '措施選擇以風險控管、損害預防與恢復合規為目的，並非對尚未查證之指控立即永久封禁。示範環境中的限制按鈕可能僅供流程測試；正式環境將提供申訴與一次覆核機制（以公布條款為準）。',
              'Measures aim at risk control, harm prevention, and restoring compliance—not instant permanent bans on unverified allegations. Demo restriction controls may be workflow tests; production will provide appeal and review paths per published terms.'
            ],
          ],
          [
            [
              '提醒補正、補件、暫停 listing、下架、撤回驗證、降級。',
              'Notice, documents, suspend listing, delist, revoke verification, downgrade.'
            ],
            [
              '限制下載、暫停付款／提領、限制帳號、保存證據、依法配合。',
              'Restrict download, hold payment/payout, restrict account, preserve evidence, legal cooperation.'
            ],
          ]
        ),
        faqItem(isZh,
          '平台為什麼需要風控機制？',
          'Why does the platform need risk controls?',
          [
            [
              'SAT 市集連結科學資料、授權交易與可能含實體之標本流通；若缺乏基本風控，買方可能誤購、權利人可能受侵權、敏感物種與棲地可能因資料外洩而受威脅，整體市場可信度亦會下降。風控不是為了阻礙研究，而是為了讓合法、可追溯、可審核之流通能持續運作。',
              'The SAT marketplace links scientific data, licensed transactions, and possibly physical specimens. Without baseline risk controls, buyers may mis-purchase, rights holders may be infringed, sensitive species and habitats may be threatened by data leaks, and overall trust declines. Risk control is not anti-research—it enables lawful, traceable, reviewable circulation.'
            ],
            [
              '具體而言，風控同時保護：買方（免於誤導交易）、賣方（免於惡意退款或超授權使用）、第三方權利人（免於未授權散布）、敏感物種與棲地（免於精確位置濫用），以及平台作為市集營運者（免於被利用為違法或侵權交易之通道）。這與 MCurator 強調之科學倫理、保育責任與資料可追溯性一致。',
              'Specifically, controls protect buyers (from misleading deals), sellers (from bad-faith refunds or overuse), third-party rights holders (from unauthorized distribution), sensitive species and habitats (from precise-location abuse), and the platform as operator (from being used as a channel for unlawful or infringing trade)—aligned with MCurator emphasis on research ethics, conservation duty, and data traceability.'
            ],
          ],
          [
            [
              '保護買方、賣方、權利人、敏感物種與市場可信度。',
              'Protect buyers, sellers, rights holders, sensitive species, and market trust.'
            ],
            [
              '避免平台被用於違法、侵權或誤導性交易。',
              'Prevent unlawful, infringing, or misleading use of the marketplace.'
            ],
          ]
        ),
        faqItem(isZh,
          '善意錯誤與惡意違規如何區分處理？',
          'How are good-faith errors vs intentional violations handled differently?',
          [
            [
              '平台會區分「善意錯誤」與「惡意或重大違規」。善意錯誤通常指：非故意之欄位疏漏、來源文件尚未齊備但願意補件、學名或 metadata 可更正、或對 physical binding／授權範圍理解有偏差且願配合修正。此類案件多透過提醒、限期補正、追加 provenance 或 correction event、暫時限制展示直至合規，而非立即永久封禁。',
              'The platform distinguishes good-faith errors from intentional or serious violations. Good-faith errors typically include unintentional field gaps, pending source documents with willingness to supplement, correctable taxonomy or metadata, or misunderstanding of physical binding/license scope with cooperation to fix. These usually proceed via notice, deadline to correct, appended provenance or correction events, or temporary display limits until compliant—not immediate permanent bans.'
            ],
            [
              '惡意或重大違規則包括：故意造假 provenance 或機構身分、明知侵權仍上架、非法標本交易、反覆違規、繞過平台私下詐騙、或利用 SAT 進行投資詐欺敘事。此類可能導致下架、撤回驗證、帳號限制、證據保全與依法配合。區分兩者有助平台保持專業、公平，也讓合規賣家與買方不必為少數違規者承擔外部信任成本。',
              'Intentional or serious violations include deliberate provenance or institutional fraud, knowing infringement, illegal specimen trade, repeat offenses, off-platform fraud, or investment-scam narratives using SAT. These may lead to delisting, verification revocation, account limits, evidence preservation, and legal cooperation. The distinction helps the platform stay professional and fair so compliant users are not burdened by bad actors.'
            ],
          ],
          [
            [
              '善意錯誤：補件、更正、追加 provenance，通常可恢復合規。',
              'Good-faith errors: documents, corrections, provenance updates—usually restorable.'
            ],
            [
              '惡意違規：造假、詐騙、侵權、非法交易—從嚴處理。',
              'Intentional violations: fraud, scams, infringement, illegal trade—strict action.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 16;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, riskGroup);
    } else {
      content.faqGroups.push(riskGroup);
    }
  };
})(typeof window !== 'undefined' ? window : this);
