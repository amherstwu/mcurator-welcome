/**
 * Physical specimen delivery, logistics, and acceptance — FAQ group.
 * Inserts group N before category E (physical & CITES).
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

  global.MC_SAT_appendFaqPhysicalDelivery = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var physicalGroup = {
      title: p(isZh, 'N. 含實體標本的 SAT 如何交付？', 'N. How are physical specimens delivered with an SAT?'),
      items: [
        faqItem(isZh,
          '如何判斷 listing 是否含實體標本？',
          'How do I tell whether a listing includes a physical specimen?',
          [
            [
              '含實體標本與否必須在 listing 中明示，例如 physical specimen binding: yes、「含實體標本」徽章、Rights 分頁或 checkout 確認畫面中之同等欄位。若完全未標示，預設為不含實體交付—買方僅取得 listing 所載之數位紀錄、標本護照（依授權）與授權使用權，平台不會因 SAT 存在或 listing 有照片而默認寄送標本。',
              'Whether a physical specimen is included must be explicit on the listing—e.g., physical specimen binding: yes, a "physical specimen included" badge, or equivalent fields on the Rights tab or checkout confirmation. If unstated, default is no physical delivery—buyers receive only digital record, Specimen Passport (per license), and licensed usage. The platform does not assume shipment because an SAT exists or photos appear on the listing.'
            ],
            [
              '不可因 listing 有 hero 影像、標本護照照片或數位化掃描，就推定成交後會收到實體標本。許多 SAT 為純數位圖版、教學影像或機構僅授權引用之 voucher 紀錄。若買方需要實體，應只選擇明示 physical binding 的項目，並在付款前保存 listing 快照；賣方亦不得用影像暗示「一定有實體」而與文字標示矛盾。',
              'Do not infer physical delivery from hero images, passport photos, or digitization scans. Many SATs are digital-only plates, teaching images, or citation-only voucher records. Buyers needing physical material should choose listings with explicit physical binding and save a snapshot before payment; sellers must not imply "physical included" through imagery while contradicting text labels.'
            ],
          ],
          [
            [
              'listing 必須明確標示；未標示即預設不含實體。',
              'Listing must state explicitly; unstated means no physical specimen.'
            ],
            [
              '有照片 ≠ 有實體交付。',
              'Photos present ≠ physical delivery included.'
            ],
          ]
        ),
        faqItem(isZh,
          '實體標本交付前，買賣雙方應確認什麼？',
          'Before physical specimen delivery, what should both parties confirm?',
          [
            [
              '雙方應在安排物流前交換並記錄：標本尺寸、重量、材質（例如乾制、浸漬、化石、岩石、薄切片）、當前保存狀態（完整、修復、缺件、碎裂風險），以及是否脆弱需特殊 handling。植物、昆蟲乾制、鳥蛋、骨骼、薄膜封裝標本等，對震動、壓力與溫溼度敏感度不同，應逐項說明而非籠統稱「標本一箱」。',
              'Before logistics, exchange and record specimen dimensions, weight, material (e.g., dry, fluid-preserved, fossil, rock, thin section), current condition (intact, repaired, incomplete, fracture risk), and fragility/special handling. Plants, pinned insects, eggs, skeletons, and slide mounts differ in vibration, pressure, and climate sensitivity—itemize rather than vague "one box of specimens."'
            ],
            [
              '亦應確認是否需要溫濕度控制、冷鏈、防震、防潮、防蟲、防霉或惰性氣體環境，以及是否需投保（保額、受益人、是否含運送風險）。高價、唯一或不可替換之標本，建議在付款前書面約定保存與運送條件；示範環境中的 mock 物流欄位不構成正式承諾。',
              'Also confirm climate control, cold chain, shock protection, moisture/pest/mold prevention, inert atmosphere if needed, and insurance (coverage, beneficiary, transit risk). For high-value or irreplaceable specimens, agree storage and shipping conditions in writing before payment—demo mock logistics fields are not binding promises.'
            ],
          ],
          [
            [
              '尺寸、重量、材質、保存狀態、脆弱性。',
              'Size, weight, material, condition, fragility.'
            ],
            [
              '溫濕度、防震防潮防蟲防霉、保險需求。',
              'Climate, shock/moisture/pest/mold control, insurance.'
            ],
          ]
        ),
        faqItem(isZh,
          '實體標本的包裝責任由誰承擔？',
          'Who is responsible for packaging physical specimens?',
          [
            [
              '原則上，賣方（或依 listing／合約指定之移交方）應依標本性質與行業慣例妥善包裝，確保在正常物流情況下可合理抵達買方。高價、脆弱、化石、昆蟲、植物、浸漬標本、玻璃容器或薄切片等，應使用專業包材（硬箱、緩衝、標本固定架、密封防潮、標示「易碎」「此面朝上」等），而非一般快遞紙箱敷衍裝載。',
              'In principle, the seller (or transfer party named on listing/contract) must pack appropriately for specimen type and industry practice so material can reasonably arrive under normal logistics. High-value, fragile, fossil, insect, botanical, fluid-preserved, glass, or slide specimens need professional materials (rigid cases, cushioning, mounts, sealed moisture barriers, Fragile/This Side Up labels)—not generic courier cartons.'
            ],
            [
              '若因包裝不當導致破損、漏液、蟲蛀或標本錯位，責任歸屬通常依風險移轉條款、物流保險與可舉證之開箱紀錄判定；平台 FAQ 不預設一律由賣方或物流承擔。買方可要求出貨前照片或包裝說明；賣方應保留出貨包裝紀錄以利爭議處理。',
              'Damage from poor packing—breakage, leakage, pest damage, displacement—is usually allocated per risk-transfer terms, carrier insurance, and provable unboxing records; this FAQ does not default blame to seller or carrier. Buyers may request pre-shipment photos or packing descriptions; sellers should retain packing records for disputes.'
            ],
          ],
          [
            [
              '賣方應依標本性質妥善包裝。',
              'Seller should pack appropriately for specimen type.'
            ],
            [
              '脆弱／高價標本應使用專業包材。',
              'Fragile / high-value specimens need professional packing.'
            ],
            [
              '包裝不當可能影響損害責任歸屬。',
              'Improper packing may affect liability for damage.'
            ],
          ]
        ),
        faqItem(isZh,
          '物流應如何安排？誰負責？',
          'How should logistics be arranged, and who is responsible?',
          [
            [
              'listing、成交紀錄或個別合約應明示：由誰安排物流（賣方代寄、買方指定快遞、第三方專業標本物流、面交）、是否允許國際寄送、是否提供面交選項，以及是否需冷鏈、保險、全程追蹤、簽名簽收或成人簽收。未寫明時，不應假設平台或賣方會自動安排跨境專業運送。',
              'Listing, transaction record, or contract should state who arranges logistics (seller ships, buyer-nominated courier, specialist specimen carrier, in-person handover), whether international shipping is allowed, in-person options, and whether cold chain, insurance, full tracking, or signature delivery is required. Do not assume platform or seller auto-arranges cross-border specialist shipping when unstated.'
            ],
            [
              '含 CITES、危險品、大型化石或博物館級物件者，可能需專車、空運艙位或館際借展流程，一般快遞未必適用。買方指定物流時，應確認承運人是否接受該標的類型；賣方有權拒絕明顯不當之運送方式。平台可於爭議中協助釐清約定，但不必然代為僱用物流商或承擔運費。',
              'CITES material, hazmat, large fossils, or museum-grade objects may need dedicated vehicles, air cargo, or inter-institutional loan workflows—standard couriers may be unsuitable. When buyers nominate carriers, confirm acceptance of specimen type; sellers may refuse clearly inappropriate methods. The platform may clarify agreements in disputes but does not necessarily hire carriers or pay freight.'
            ],
          ],
          [
            [
              '明確約定誰安排物流。',
              'Agree clearly who arranges logistics.'
            ],
            [
              '確認國際寄送、面交、冷鏈、保險、追蹤、簽收。',
              'Confirm international shipping, handover, cold chain, insurance, tracking, signature.'
            ],
          ]
        ),
        faqItem(isZh,
          '實體標本的風險何時移轉給買方？',
          'When does risk transfer to the buyer for a physical specimen?',
          [
            [
              '風險移轉時間點必須在 listing 或交易條款中明示，常見模式包括：① 交給物流業者時（類似 FCA／CPT 概念）；② 買方簽收時；③ 買方完成驗收（檢查無損、與 listing 一致）時。不同模式對「運送途中損壞由誰承擔」影響重大，不可留空由事後爭論。',
              'Risk transfer must be explicit on listing or transaction terms. Common models: (1) when handed to carrier (FCA/CPT-like); (2) on buyer signature at delivery; (3) on buyer acceptance (no damage, matches listing). The model strongly affects in-transit damage allocation and must not be left blank.'
            ],
            [
              '跨境交易還需考慮目的國清關延誤、檢疫扣留或拒收時風險如何分攤。平台示範 checkout 若未顯示風險條款，不代表正式環境亦無需約定。建議雙方在出貨前以書面或平台支援之確認步驟固定條款，並與保險生效時間對齊。',
              'Cross-border deals must address customs delay, quarantine hold, or refusal at destination. Demo checkout without risk terms does not mean production needs no agreement. Fix terms in writing or platform confirmation before shipment, aligned with insurance effective time.'
            ],
          ],
          [
            [
              '常見：交物流時、買方簽收時、驗收完成時—須明示。',
              'Common: handoff to carrier, buyer signature, acceptance—must be stated.'
            ],
            [
              '影響運送途中損壞責任歸屬。',
              'Affects in-transit damage liability.'
            ],
          ]
        ),
        faqItem(isZh,
          '買方收到實體標本後應如何驗收？',
          'How should buyers inspect physical specimens on receipt?',
          [
            [
              '買方應在 listing 或合約指定之期限內完成驗收（例如 24–72 小時或 7 日，依標的價值與類型而異）。建議在可控環境下開箱，全程錄影或拍照，記錄外箱、封條、包材與標本狀態，再對照 listing 與成交快照：是否破損、錯寄、缺件、標籤不符、與描述之保存狀態不一致，或與 SAT 影像明顯不符。',
              'Buyers should complete acceptance within the deadline on listing or contract (e.g., 24–72 hours or 7 days, by value and type). Unbox in a controlled setting with video or photos of outer carton, seals, packing, and specimen condition, then compare to listing and settlement snapshot: damage, wrong item, missing parts, label mismatch, condition inconsistent with description, or obvious mismatch with SAT imagery.'
            ],
            [
              '若發現問題，應在期限內透過平台申訴或合約管道提出，並保留包材、物流單與錄影紀錄。逾期未在約定時間內提出可主張之瑕疵，依正式條款可能視為驗收完成，後續再主張運送損害或描述不符可能受限—因此期限應在成交前知悉。',
              'Report issues within the deadline via platform appeal or contract channel; retain packing, shipping documents, and recordings. Failure to raise timely defects may be treated as acceptance under formal terms, limiting later transit or description claims—know deadlines before settlement.'
            ],
          ],
          [
            [
              '指定期限內檢查；建議開箱錄影。',
              'Inspect within deadline; video unboxing recommended.'
            ],
            [
              '核對破損、錯寄、缺件、與 listing 不符。',
              'Check damage, wrong item, missing parts, listing mismatch.'
            ],
            [
              '逾期可能視為完成驗收（依條款）。',
              'Late claims may count as accepted (per terms).'
            ],
          ]
        ),
        faqItem(isZh,
          '標本損壞或遺失時如何處理？',
          'How are specimen damage or loss handled?',
          [
            [
              '損壞或遺失通常依物流保險理賠、包裝與風險移轉條款、以及雙方可舉證之開箱與出貨紀錄處理。若投保，應依保單向承運人或保險人申請；未投保者依約定風險移轉時間點分攤。平台可協助提交爭議、保全 listing 快照與通訊紀錄，但不必然承擔物流商或賣方之運送責任，亦不就示範環境 mock 物流提供賠付。',
              'Damage or loss is usually handled via carrier insurance, packing and risk-transfer terms, and provable unboxing/shipment records. Insured parties claim from carrier or insurer; uninsured parties allocate per agreed risk transfer. The platform may help disputes and preserve listing snapshots and messages but does not necessarily bear carrier or seller shipping liability, and does not pay for demo mock logistics.'
            ],
            [
              '對不可替換之唯一標本，應在交易前評估是否接受「修復後交付」或「僅數位補償」等補救選項。故意隱藏損壞、調包或虛報遺失可能觸發帳號處分與法律程序；善意雙方應先依合約與保險流程處理，再視需要申請平台調解。',
              'For irreplaceable unique specimens, assess before transaction whether repair, digital-only remedy, or other options are acceptable. Concealed damage, substitution, or false loss claims may trigger account action and legal process; good-faith parties should follow contract and insurance first, then platform mediation if needed.'
            ],
          ],
          [
            [
              '依保險、包裝責任、風險移轉條款處理。',
              'Handled per insurance, packing duty, risk-transfer terms.'
            ],
            [
              '平台可協助爭議，但不必然承擔物流商責任。',
              'Platform may assist disputes but does not necessarily bear carrier liability.'
            ],
          ]
        ),
        faqItem(isZh,
          '含實體標本時，CITES 與報關由誰負責？',
          'For physical specimens, who handles CITES and customs?',
          [
            [
              '實體標本跨境移動可能需 CITES 許可、出口／進口申報、檢疫、文化資產或化石相關文件。平台通常不自動代辦 CITES、報關或代付關稅，除非 listing 或個別合約明示代辦範圍且實際可行；即使平台提供表單提示，也不構成已獲主管機關核准。',
              'Cross-border physical movement may require CITES permits, export/import declarations, quarantine, cultural heritage or fossil documentation. The platform generally does not automatically handle CITES, customs, or duty payment unless listing or contract explicitly states scope and it is feasible; form prompts do not mean authority approval.'
            ],
            [
              '買賣雙方應在成交前自行確認：標的是否在附錄內、買方所在國能否合法進口與持有、所需文件由誰準備、許可未核發時是否取消交易或改為數位-only 交付。因缺證被海關扣留、退運或銷毀之風險，通常由未盡確認義務之一方或依合約分攤，平台 FAQ 不提供法律意見。',
              'Before settlement, parties should confirm appendix status, buyer jurisdiction import/possession legality, who prepares documents, and whether to cancel or switch to digital-only if permits fail. Customs seizure, return, or destruction risk is usually borne per contract or by the party that failed due diligence—this FAQ is not legal advice.'
            ],
          ],
          [
            [
              '跨境可能需要 CITES 與報關文件。',
              'Cross-border may need CITES and customs documents.'
            ],
            [
              '平台不自動代辦；買賣雙方自行確認。',
              'Platform does not auto-handle; parties must confirm.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 9;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, physicalGroup);
    } else {
      content.faqGroups.push(physicalGroup);
    }
  };
})(typeof window !== 'undefined' ? window : this);
