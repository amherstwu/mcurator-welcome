/**
 * Sensitive data and species safety — FAQ group for SAT about page.
 * Inserts group O before category G (privacy & takedown).
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

  global.MC_SAT_appendFaqSensitiveData = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var sensitiveGroup = {
      title: p(isZh, 'O. 為什麼有些資料不能公開？', 'O. Why can some data not be published?'),
      items: [
        faqItem(isZh,
          '哪些資料屬於敏感資料？',
          'What counts as sensitive data?',
          [
            [
              '在 SAT 與科學市集脈絡中，敏感資料指公開後可能危及物種、棲地、個人隱私、機構安全或研究誠信之欄位。常見類型包括：精確 GPS 或可追溯之採集座標；稀有、受保護或易遭盜獵／盜採物種之棲地；化石產區、礦物產點、繁殖地或季節性聚集點；私人土地或未公開之採集路徑；採集者、土地所有者或聯絡人之個資；未對外公布之機構館藏實體存放位置；以及可能引發盜竊或非法交易風險之高價標本所在地。',
              'In SAT and marketplace context, sensitive data means fields whose publication could harm species, habitats, personal privacy, institutional security, or research integrity. Common types include precise GPS or traceable collection coordinates; habitats of rare, protected, or poaching/pilfering-vulnerable species; fossil localities, mineral sites, breeding grounds, or seasonal aggregation sites; private land or unpublished collection routes; personal data of collectors, landowners, or contacts; undisclosed physical storage locations of institutional collections; and locations of high-value specimens that could attract theft or illegal trade.'
            ],
            [
              '敏感與否常因物種保育等級、當地法規、土地存取協議、原住民或社區同意、以及機構典藏政策而異。同一筆 SAT 可能公開學名與國家級產地，但遮蔽精確座標；或僅對已授權之研究者顯示完整 locality。listing 與 metadata 應如實標示哪些欄位已遮蔽、延遲公開或僅限申請存取。',
              'Sensitivity varies by conservation status, local law, land-access agreements, indigenous or community consent, and institutional policy. One SAT may publish scientific name and country-level locality while obfuscating precise coordinates—or show full locality only to authorized researchers. Listings and metadata should truthfully label obfuscated, delayed, or request-only fields.'
            ],
          ],
          [
            [
              '精確 GPS、稀有棲地、化石／礦物點、繁殖地、私人採集地。',
              'Precise GPS, rare habitats, fossil/mineral sites, breeding sites, private collection sites.'
            ],
            [
              '採集者個資、未公開館藏位置、高價標本所在地。',
              'Collector personal data, undisclosed storage sites, high-value specimen locations.'
            ],
          ]
        ),
        faqItem(isZh,
          '為什麼要模糊化（obfuscate）位置資訊？',
          'Why obfuscate location information?',
          [
            [
              '位置模糊化是科學開放與物種／棲地保護之間的平衡手段。精確公開可能導致盜獵、非法採集、盜挖化石或礦物、繁殖地干擾、棲地破壞、私人土地遭擅入，或尚未發表之研究點被搶先採集。對受 CITES、國內保育法、文化資產或土地權約束之標的，模糊化亦可能是法遵或機構政策之必要條件。',
              'Location obfuscation balances scientific openness with species and habitat protection. Precise publication can enable poaching, illegal collection, fossil or mineral theft, breeding-site disturbance, habitat damage, trespass on private land, or scooping of unpublished research localities. For material under CITES, domestic conservation law, heritage rules, or land agreements, obfuscation may be legally or institutionally required.'
            ],
            [
              '模糊化不代表資料「不可信」，而是表示公開層級經過風險評估。買方、引用者與地圖視覺化使用者應尊重遮蔽政策，不得透過 EXIF、背景地標、交叉比對或其他手段試圖還原精確位置；賣方亦不得在上架後另行私下提供精確座標而繞過平台規則。',
              'Obfuscation does not mean data is untrustworthy—it means disclosure tier passed risk review. Buyers, citers, and map users must respect masking and must not re-identify precise locations via EXIF, background landmarks, cross-matching, or other means; sellers must not circumvent platform rules by privately sharing precise coordinates after listing.'
            ],
          ],
          [
            [
              '防止盜獵、盜採、棲地破壞、私人地點曝光。',
              'Prevent poaching, pilfering, habitat harm, exposure of private sites.'
            ],
            [
              '防止敏感研究資料被濫用或搶先採集。',
              'Prevent misuse or scooping of sensitive research data.'
            ],
          ]
        ),
        faqItem(isZh,
          '平台如何模糊化位置？有哪些方式？',
          'How does the platform obfuscate locations?',
          [
            [
              '依 listing 設定、物種敏感度與機構政策，位置可能以不同粒度公開：僅國家、僅縣市或行政區、較大「區域」文字描述、網格化座標（例如 0.1° 或 10 km 網格）、延遲公開（embargo 至論文發表或審核後），或僅對通過審核之研究者、授權買方或館員角色顯示精確欄位。公開頁面與匯出檔（CSV／JSON）可能呈現不同層級，以避免下載後外洩。',
              'Per listing settings, species sensitivity, and institutional policy, locality may be published at different granularity: country only, county or admin division, broader regional text, gridded coordinates (e.g., 0.1° or 10 km grid), delayed release (embargo until publication or review), or precise fields visible only to approved researchers, licensed buyers, or curator roles. Public pages and exports (CSV/JSON) may differ to prevent post-download leakage.'
            ],
            [
              '賣方上架時應選擇與風險相符之公開層級，而非預設公開精確 GPS。若後續研究或法規要求調整，可透過 append-only 事件紀錄「公開層級變更」，而非悄悄修改歷史。買方應在成交前確認所購授權是否包含精確 locality 存取，而非假設付款後自動解鎖全部座標。',
              'Sellers should choose disclosure tiers matching risk—not default precise GPS. If research or regulations require change later, record a disclosure-tier change as an append-only event rather than silently rewriting history. Buyers should confirm before settlement whether the license includes precise locality access—not assume payment unlocks all coordinates.'
            ],
          ],
          [
            [
              '國家／縣市／區域、網格化座標、延遲公開。',
              'Country / county / region, gridded coordinates, delayed release.'
            ],
            [
              '精確欄位可限審核者或授權買方。',
              'Precise fields may be limited to reviewers or licensed buyers.'
            ],
          ]
        ),
        faqItem(isZh,
          '買方可以要求提供精確地點嗎？',
          'Can buyers request precise locality data?',
          [
            [
              '買方可以透過 listing 詢問、資料存取申請或機構合作管道提出需求，但是否提供取決於授權類型、研究目的之合理性、適用法規、賣方／機構政策，以及平台對保育風險之評估。對高保育風險、易遭盜採或涉私人土地之標的，平台與賣方可以拒絕公開精確座標，即使買方已付款取得其他數位權利。',
              'Buyers may request via listing inquiry, data access application, or institutional partnership—but provision depends on license type, reasonable research purpose, applicable law, seller/institutional policy, and platform conservation-risk assessment. For high-risk, pilfering-vulnerable, or private-land material, platform and seller may refuse precise coordinates even if the buyer paid for other digital rights.'
            ],
            [
              '若精確 locality 可能提供，常見條件包括：簽署資料使用協議、限制二次散布、限定研究用途、設定 embargo，或僅提供離線／受控環境存取。買方不得將獲得之精確位置轉貼至公開地圖、社群媒體或商業產品，除非 listing 或協議明示允許。',
              'When precise locality may be shared, conditions often include data use agreements, no redistribution, research-only purpose, embargo, or controlled offline access. Buyers must not repost precise locations to public maps, social media, or commercial products unless listing or agreement explicitly permits.'
            ],
          ],
          [
            [
              '可提出需求，但不保證提供。',
              'Requests allowed; provision not guaranteed.'
            ],
            [
              '依授權、研究目的、法規、賣方政策與保育風險評估。',
              'Depends on license, research purpose, law, seller policy, conservation risk.'
            ],
            [
              '高風險物種平台可拒絕公開精確位置。',
              'Platform may refuse precise locality for high-risk species.'
            ],
          ]
        ),
        faqItem(isZh,
          '賣方如何保護採集者與相關個資？',
          'How should sellers protect collector and related personal data?',
          [
            [
              '賣方與機構上架時，應最小化個資：可用機構名稱代替個人全名、使用採集者代碼或館內編號、遮蔽私人地址／電話／電郵，並避免上傳含他人肖像或聯絡方式而未獲同意之欄位。若採集紀錄含土地所有者或在地嚮導資訊，通常應預設不公開或僅限審核存取。',
              'Sellers and institutions should minimize personal data: use institution name instead of full personal name, collector codes or internal IDs, mask private address/phone/email, and avoid uploading others\' likeness or contact details without consent. Landowner or local guide information in collection records should usually default to non-public or review-only access.'
            ],
            [
              '個資處理亦須符合適用之個資法（例如 GDPR、PDPA）與機構 IRB 或隱私政策。SAT metadata 不是「公開即免責」；若發現誤上傳個資，賣方應主動要求更正、遮蔽或下架。買方取得資料後，亦負有依授權與隱私法限制使用與再散布之義務。',
              'Personal data handling must comply with applicable privacy law (e.g., GDPR, PDPA) and institutional IRB or privacy policy. SAT metadata is not "publication equals immunity"; if personal data was uploaded in error, sellers should request correction, obfuscation, or delisting. Buyers also must use and redistribute data within license and privacy limits.'
            ],
          ],
          [
            [
              '可用機構名稱、採集者代碼代替個人識別資訊。',
              'Use institution name, collector codes instead of personal identifiers.'
            ],
            [
              '隱藏私人聯絡方式；不上傳未經同意之他人個資。',
              'Hide private contacts; do not upload others\' data without consent.'
            ],
          ]
        ),
        faqItem(isZh,
          '平台可以下架或隱藏敏感內容嗎？',
          'Can the platform delist or hide sensitive content?',
          [
            [
              '可以。若 listing、影像或 metadata 可能造成物種危害、個資外洩、違法風險、盜採／盜獵誘因、或重大科學倫理爭議，平台得先行隱藏或限制存取，再進行審查、要求賣方更正公開層級，或依正式規範下架。此舉旨在履行保育責任、保護當事人與維護市集可信度，而非針對善意研究之懲罰。',
              'Yes. If listing, imagery, or metadata could cause species harm, personal data exposure, legal risk, pilfering/poaching incentives, or major research-ethics concerns, the platform may hide or restrict access first, then review, require disclosure-tier correction, or delist under formal rules. This fulfills conservation duty, protects parties, and maintains marketplace trust—not punishment for good-faith research.'
            ],
            [
              '賣方與買方若認為遮蔽過度或不足，可依正式申訴管道提出；平台可能要求補充風險評估、機構核准文件或替代性公開方式（例如僅區域級產地）。示範環境之下架動作可能為流程測試；正式環境將依屆時公布之內容安全與隱私政策執行。',
              'Sellers and buyers may appeal if masking seems excessive or insufficient; the platform may request risk assessment, institutional approval, or alternative disclosure (e.g., regional locality only). Demo delisting may be workflow testing; production will follow published content safety and privacy policy.'
            ],
          ],
          [
            [
              '平台可先隱藏再審查，或要求更正／下架。',
              'Platform may hide pending review, require correction, or delist.'
            ],
            [
              '原因：物種危害、個資外洩、違法、盜採風險等。',
              'Reasons: species harm, privacy breach, unlawful content, pilfering risk, etc.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 12;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, sensitiveGroup);
    } else {
      content.faqGroups.push(sensitiveGroup);
    }
  };
})(typeof window !== 'undefined' ? window : this);
