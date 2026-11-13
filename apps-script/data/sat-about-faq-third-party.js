/**
 * Third-party data sources and citation rules — FAQ group for SAT about page.
 * Inserts group Q after category D (verification metadata).
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

  global.MC_SAT_appendFaqThirdParty = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var thirdPartyGroup = {
      title: p(isZh, 'Q. SAT 使用第三方資料時要注意什麼？', 'Q. What to know when SAT uses third-party data'),
      items: [
        faqItem(isZh,
          'SAT 可能引用或整合哪些第三方資料來源？',
          'What third-party data sources may SAT reference or integrate?',
          [
            [
              'SAT 作為科學資料與可追溯性框架，可能引用、匯入或連結多種外部來源，包括但不限於：GBIF（Global Biodiversity Information Facility）、Catalogue of Life（CoL）、IUCN Red List、Open Tree of Life（OpenTree）、博物館或研究機構之館藏資料庫（含 Darwin Core 匯出）、已發表論文或預印本中之分類與產地資訊、機構官方釋出之批次資料，以及賣方或典藏人自行提供並具權利基礎之欄位、影像與文件。',
              'As a scientific data and traceability framework, SAT may reference, import, or link external sources including but not limited to: GBIF, Catalogue of Life (CoL), IUCN Red List, Open Tree of Life (OpenTree), museum or research collection databases (including Darwin Core exports), taxonomy and locality from published papers or preprints, institutionally released batch data, and fields, images, and documents provided by sellers or custodians with a lawful basis.'
            ],
            [
              '每一筆 SAT 應在 metadata 或 provenance 中盡可能標示「哪些欄位來自哪個第三方來源、匯入日期、版本或 DOI／dataset ID」。混合來源（例如 GBIF occurrence + 賣方自拍 hero 影像 + 機構 accession 紀錄）很常見；使用者不應假設整筆 SAT 均為單一平台原創或單一機構獨占資料。',
              'Each SAT should label in metadata or provenance which fields come from which third-party source, import date, version, or DOI/dataset ID where possible. Mixed sources (e.g., GBIF occurrence + seller hero photo + institutional accession) are common; users must not assume the entire SAT is platform-original or single-institution exclusive data.'
            ],
          ],
          [
            [
              'GBIF、CoL、IUCN、OpenTree、館藏庫、論文、機構資料、賣方提供。',
              'GBIF, CoL, IUCN, OpenTree, collections, papers, institutional data, seller-provided.'
            ],
            [
              '應標示各欄位之來源與匯入紀錄。',
              'Label source and import record per field where possible.'
            ],
          ]
        ),
        faqItem(isZh,
          '第三方資料是否一定正確？',
          'Is third-party data always correct?',
          [
            [
              '不一定。第三方資料庫、論文與機構批次匯出皆可能過時、欄位缺失、學名已修訂、產地僅模糊化、影像非當前標本、或與實際館藏狀態不同步。不同來源對同一標本也可能存在 taxonomic 或 locality 不一致；SAT 整合多來源時，平台與賣方應保留來源標記供使用者比對，而非 silently 合併成看似權威之單一答案。',
              'No. Third-party databases, papers, and institutional exports may be outdated, incomplete, taxonomically revised, locality-obfuscated, image-mismatched, or out of sync with live collections. Sources may disagree on taxonomy or locality; when SAT integrates multiple sources, platform and seller should retain source labels for comparison—not silently merge into one seemingly authoritative answer.'
            ],
            [
              'MCurator 與 SAT 會盡力在 listing 與 metadata 中保留原始來源、引用與版本資訊，並透過 verification 與 correction 事件提升就緒度，但不保證第三方資料完全正確、最新或適用於所有商用／跨境用途。買方與引用者應將 SAT 視為可追溯入口，必要時回查原始 dataset、館藏系統或文獻。',
              'MCurator and SAT strive to preserve original source, citation, and version information in listings and metadata, and improve readiness via verification and correction events—but do not guarantee third-party data is fully correct, current, or fit for all commercial/cross-border uses. Buyers and citers should treat SAT as a traceable entry point and consult original datasets, catalogs, or literature when needed.'
            ],
          ],
          [
            [
              '第三方資料可能過時、缺失、學名變更、座標模糊、授權限制不同。',
              'Third-party data may be outdated, incomplete, revised names, obfuscated coords, varied licenses.'
            ],
            [
              '平台保留來源與引用，但不保證完全正確。',
              'Platform preserves source and citation but does not guarantee full correctness.'
            ],
          ]
        ),
        faqItem(isZh,
          '使用或引用含第三方資料之 SAT 時，應如何標示？',
          'How should third-party SAT data be cited and attributed?',
          [
            [
              '引用時應同時標示 SAT ID 與 upstream 來源，而非僅寫 MCurator 或 SAT 名稱。建議保留：原始資料提供者或 dataset 名稱、dataset DOI 或 URL（若可得）、GBIF／CoL／IUCN 等 record ID、論文 DOI 或 citation、資料取得或存取日期，以及原始資料之授權（CC BY、CC0、機構 terms 等）。若 SAT 僅整合第三方欄位，不得把該欄位誤標為平台原創或賣方獨占資料。',
              'Citations should include both SAT ID and upstream source—not MCurator or SAT name alone. Retain: original data provider or dataset name, dataset DOI or URL if available, GBIF/CoL/IUCN record IDs, paper DOI or citation, access or acquisition date, and original data license (CC BY, CC0, institutional terms, etc.). If SAT only aggregates third-party fields, do not mislabel them as platform-original or seller-exclusive.'
            ],
            [
              '在論文、報告、地圖、App 或商業產品中使用時，應遵循較嚴格之署名與再散布要求（見下一題）。匯出 CSV／JSON 時，若含第三方欄位，匯出檔應盡量保留 source 與 license 欄位；買方不得移除 upstream attribution 以「清理」資料集後再發布。',
              'In papers, reports, maps, apps, or commercial products, follow the stricter attribution and redistribution rules (see next item). CSV/JSON exports with third-party fields should retain source and license columns where possible; buyers must not strip upstream attribution when republishing "cleaned" datasets.'
            ],
          ],
          [
            [
              '保留原始來源、資料集名稱、取得日期、原始授權。',
              'Keep original source, dataset name, access date, original license.'
            ],
            [
              '同時標示 SAT ID；不可誤標為平台原創。',
              'Also cite SAT ID; do not mislabel as platform-original.'
            ],
          ]
        ),
        faqItem(isZh,
          '第三方資料授權與 SAT listing 授權衝突時怎麼辦？',
          'What if third-party license conflicts with SAT listing license?',
          [
            [
              '當第三方來源授權與 SAT listing 授權不一致時，原則上以較嚴格者為準。若原始 dataset 禁止商業使用、要求署名、禁止再散布或僅允許非衍生使用，SAT listing 不得擴張為更寬鬆之商業授權或再授權；買方取得之 SAT 使用權亦受 upstream license 約束，即使 listing 文字看似更寬鬆。',
              'When third-party license conflicts with SAT listing license, the stricter terms govern. If the original dataset prohibits commercial use, requires attribution, prohibits redistribution, or allows non-derivative use only, the listing must not expand to broader commercial or sublicense rights; buyer SAT usage remains bound by upstream license even if listing text appears looser.'
            ],
            [
              '賣方不得上架自己無權再授權之第三方資料（例如從 GBIF 抓取 occurrence 卻標示 exclusive commercial license，或未保留 required attribution）。若 upstream 要求署名，買方、引用者與下游產品亦必須署名原始來源與 SAT ID。衝突無法解決時，平台可能限制下載、商用標籤或要求賣方更正 listing；嚴重者下架。',
              'Sellers must not list third-party data they cannot relicense (e.g., GBIF occurrences with exclusive commercial license without required attribution). If upstream requires attribution, buyers, citers, and downstream products must attribute original source and SAT ID. Unresolvable conflicts may trigger download limits, commercial label removal, listing correction—or delisting for serious cases.'
            ],
          ],
          [
            [
              '以較嚴格授權為準。',
              'Stricter license prevails.'
            ],
            [
              '原始禁止商用則 SAT 不得擴張；署名要求須向下傳遞。',
              'Upstream non-commercial limits apply; attribution passes downstream.'
            ],
            [
              '賣方不得再授權無權之第三方資料。',
              'Sellers must not relicence third-party data without rights.'
            ],
          ]
        ),
        faqItem(isZh,
          '第三方資料或 SAT 欄位錯誤時如何處理？',
          'How are third-party or SAT field errors handled?',
          [
            [
              '使用者、機構或賣方可提出更正申請（correction request），說明錯誤欄位、建議修正、依據文獻或館藏紀錄，以及是否涉及第三方來源更新。平台或審核者可在通過後追加 correction event 至 provenance，保留錯誤前快照與修正後值—不應直接刪除已被外部引用的歷史紀錄或 silently 改寫過去 citation 脈絡。',
              'Users, institutions, or sellers may submit correction requests specifying wrong fields, proposed fixes, supporting literature or catalog records, and whether third-party sources need updating. After review, platform or curators append correction events to provenance, preserving pre-correction snapshots and revised values—do not delete externally cited history or silently rewrite past citation context.'
            ],
            [
              '若錯誤源自第三方資料庫（例如 GBIF 舊學名），SAT 應標記 correction 狀態、指向 upstream record 與修正日期，並在可能時通知資料提供者或連結官方修正流程。Metadata Complete 或 verification 徽章可能因更正而調整；這不代表過去引用「失效」，而是追溯鏈更完整。',
              'If error originates in a third-party database (e.g., outdated GBIF name), SAT should mark correction status, link upstream record and correction date, and where possible point to provider correction workflows. Metadata Complete or verification badges may change after correction—past citations are not "invalidated," the trace chain is enriched.'
            ],
          ],
          [
            [
              '可提出更正申請；平台追加 correction event。',
              'Correction requests allowed; platform appends correction events.'
            ],
            [
              '不直接刪除歷史引用；標記來源與修正狀態。',
              'Do not delete cited history; mark source and correction status.'
            ],
          ]
        ),
        faqItem(isZh,
          'AI 生成內容在 SAT 中應如何標示？',
          'How should AI-generated content be labeled on SAT?',
          [
            [
              '若 SAT 或 listing 含 AI 生成或 AI 輔助內容—例如 AI 復原圖、AI 教學示意圖、AI 補圖、去背或超解析重建—必須在 hero-passport、影像說明與 metadata 中清楚標示（例如 AI reconstruction、AI-assisted illustration），並說明是否僅供教學、不得作為實物診斷或法遵證據。不可把 AI 圖像冒充真實標本現場照、採集照或館藏診斷照片。',
              'If SAT or listing includes AI-generated or AI-assisted content—e.g., AI reconstruction, AI teaching illustration, AI infill, background removal, or super-resolution—label clearly in hero-passport, image captions, and metadata (e.g., AI reconstruction, AI-assisted illustration), stating whether teaching-only and not for physical diagnosis or compliance proof. Do not pass AI images as authentic field, collection, or diagnostic specimen photos.'
            ],
            [
              'AI 內容不能取代真實標本證據、原始掃描或 verified 影像；引用或交易時應與真實影像分開記錄。若 AI 輸出衍生自第三方訓練資料或受 upstream license 限制，亦須遵守較嚴格之使用與署名規則。平台對 AI 標示缺失之 listing 可能要求更正、限制驗證等級或下架。',
              'AI content cannot replace real specimen evidence, source scans, or verified imagery; record separately from authentic images in citation or trade. If AI output derives from third-party training data or upstream license limits, follow stricter use and attribution rules. Listings missing AI disclosure may face correction requirements, verification caps, or delisting.'
            ],
          ],
          [
            [
              'AI 復原／教學／補圖須清楚標示。',
              'AI reconstruction / teaching / infill must be clearly labeled.'
            ],
            [
              '不可冒充真實標本照片；不能取代標本證據。',
              'Do not pose as authentic specimen photos; cannot replace specimen evidence.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 9;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, thirdPartyGroup);
    } else {
      content.faqGroups.push(thirdPartyGroup);
    }
  };
})(typeof window !== 'undefined' ? window : this);
