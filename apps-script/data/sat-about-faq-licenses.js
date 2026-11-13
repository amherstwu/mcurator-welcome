/**
 * SAT license types — FAQ group + comparison matrix for about page.
 * Inserts group L after deliverables (K); does not modify existing items.
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

  function cell(isZh, zh, en) {
    return p(isZh, zh, en);
  }

  global.MC_SAT_appendFaqLicenses = function (content, isZh) {
    if (!content || !content.faqGroups) return;

    var licenseGroup = {
      title: p(isZh, 'L. SAT 授權有哪些類型？', 'L. What SAT license types exist?'),
      items: [
        faqItem(isZh,
          '什麼是「僅瀏覽授權（view-only）」？',
          'What is a view-only license?',
          [
            [
              '僅瀏覽授權表示使用者只能在平台（或賣方指定之受控檢視環境）內觀看 SAT 相關頁面、標本護照與 listing 允許公開之 metadata，不得下載原始或高解析檔案、不得轉載至外部網站、不得用於商業出版或付費產品。此類授權常見於敏感物種、精確產地受保護、機構尚未開放外流之典藏影像，或僅供內部／會員預覽之資料。',
              'A view-only license lets users view SAT pages, Specimen Passport, and listing-permitted metadata only within the platform or a seller-controlled viewing environment. No download of source or high-resolution files, no republishing on external sites, no commercial publication or paid products. Common for sensitive species, protected precise localities, collection images not yet cleared for release, or member-only previews.'
            ],
            [
              'listing 若標示 view-only，買方不應以螢幕截圖、錄影或第三方抓取工具繞過限制；賣方亦不得口頭承諾「可以下載」而與 listing 矛盾。若需引用，通常仍須另購學術引用或教育授權，或向權利人申請升級。',
              'When a listing is view-only, buyers should not bypass limits via screenshots, screen recording, or scraping; sellers must not verbally promise downloads that contradict the listing. Citation often requires a separate academic or educational license or an upgrade from the rights holder.'
            ],
          ],
          [
            [
              '僅平台內觀看；不可下載、轉載、商用。',
              'Platform viewing only; no download, republish, or commercial use.'
            ],
            [
              '適合敏感資料或機構限制資料。',
              'Suited to sensitive or institutionally restricted material.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼是「教育使用授權（educational use）」？',
          'What is an educational use license?',
          [
            [
              '教育使用授權通常允許在課堂、講義、非營利教學活動、校內展示或博物館教育節目（非商業售票主軸）中使用 SAT 允許之影像與 metadata，並依 listing 要求標示 SAT ID、資料提供者與授權摘要。是否可投影、列印講義、製作教案，應以 listing 逐項為準。',
              'Educational use typically permits SAT-permitted images and metadata in classrooms, handouts, non-profit teaching, on-campus display, or museum education programs (not primarily commercial ticketing). Attribution with SAT ID, data provider, and license summary is usually required. Projection, printed handouts, and lesson plans depend on listing terms.'
            ],
            [
              '教育授權不一定包含付費線上課程、商業出版、付費教材包或對外售票之特展。若課程收費、教材由出版社發行，或展覽具明顯商業贊助與商品銷售主軸，應確認 listing 是否升級為商業授權或另議條款，而非假設「教學用途」即可涵蓋。',
              'Educational licenses do not necessarily cover paid online courses, commercial publishing, paid curriculum bundles, or ticketed exhibitions. Fee-based courses, publisher-distributed materials, or heavily commercial sponsored shows may require commercial license or separate terms—not assumed under "educational use."'
            ],
          ],
          [
            [
              '可用於課堂、講義、非營利教育展示（依 listing）。',
              'Classroom, handouts, non-profit teaching display (per listing).'
            ],
            [
              '需標示 SAT ID 與來源；付費課程／商業出版未必包含。',
              'SAT ID and source required; paid courses / commercial publishing may be excluded.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼是「學術引用授權（academic citation）」？',
          'What is an academic citation license?',
          [
            [
              '學術引用授權旨在支援論文、學位報告、研究計畫、資料集方法論、系統發表或 peer-review 稿件中對 SAT 紀錄之可驗證引用。通常允許在授權範圍內引用 SAT ID、必要 metadata 欄位，以及 listing 明示可引用之圖像或表格，並保留原始引用格式、SAT ID、存取或取得日期、資料提供者／保管者名稱。',
              'Academic citation licenses support verifiable citation of SAT records in theses, dissertations, grant reports, dataset methods sections, system papers, or peer-review manuscripts. They typically allow citing SAT ID, required metadata fields, and listing-permitted figures or tables, preserving citation format, SAT ID, access or acquisition date, and data provider / custodian name.'
            ],
            [
              '若 SAT 資料衍生自 GBIF、iNaturalist、博物館館藏、期刊附圖或第三方資料庫，引用時亦應保留原始資料來源、原始 accession 或 dataset DOI，不得僅引用 SAT ID 而省略上游來源。學術引用不等同可自由重製大圖、商用圖版或再授權；超出引用必要範圍之使用需另確認 listing。',
              'When SAT data derives from GBIF, iNaturalist, museum collections, journal figures, or third-party databases, retain original source, accession, or dataset DOI—do not cite SAT ID alone while omitting upstream provenance. Academic citation is not free republication of large images, commercial plates, or sublicensing; uses beyond citation necessity require separate listing confirmation.'
            ],
          ],
          [
            [
              '用於論文、研究報告、資料集引用（依 listing 範圍）。',
              'For papers, reports, dataset citation (within listing scope).'
            ],
            [
              '保留 SAT ID、取得日期、提供者；含第三方原始來源。',
              'Keep SAT ID, access date, provider; include upstream source.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼是「展覽使用授權（exhibition use）」？',
          'What is an exhibition use license?',
          [
            [
              '展覽使用授權允許在博物館展場、文化空間、科學教育展、借展或線上虛擬展覽中展示 SAT 相關影像、標本護照 QR、解說文字與授權範圍內之 metadata。是否允許公開展示高解析圖、實體輸出尺寸上限、展期長度，應在 listing 明示；view-only 或低解析預覽不等同展覽級輸出權。',
              'Exhibition use permits display of SAT images, passport QR codes, interpretive text, and licensed metadata in museum galleries, cultural venues, science education exhibits, loans, or online virtual exhibitions. Whether high-resolution public display, maximum print size, and exhibition duration are allowed must be stated on the listing—view-only or low-res preview is not exhibition-grade output rights.'
            ],
            [
              '展覽是否具商業性質（售票、周邊商品、品牌贊助、付費 VR）會影響授權是否足夠。非營利教育展與商業策展、品牌快閃展不可混用同一套默認權利；賣方上架時應區分「非營利展覽」與「商業／售票展覽」，買方策展前應核對 listing 與合約。',
              'Commercial character (ticketing, merchandise, brand sponsorship, paid VR) affects whether the license suffices. Non-profit educational exhibitions and commercial curatorial or brand pop-ups must not share default rights; sellers should distinguish non-profit vs commercial/ticketed exhibition on listing; curators should verify listing and contract before opening.'
            ],
          ],
          [
            [
              '用於展場、博物館、線上展覽（依 listing）。',
              'For galleries, museums, online exhibitions (per listing).'
            ],
            [
              '確認高解析展示與展覽是否具商業性質。',
              'Confirm high-res display and whether the exhibition is commercial.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼是「商業使用授權（commercial use）」？',
          'What is a commercial use license?',
          [
            [
              '商業使用授權表示 listing 明示允許將 SAT 資料或影像用於營利目的，例如書籍或期刊出版、商品包裝、品牌行銷、廣告、影片、付費課程、付費 App 或付費資料產品。未在 listing 標示 commercial use: yes（或同等明示）者，不得推定可商用；教育或學術引用授權不自動升級為商業授權。',
              'Commercial use means the listing explicitly permits use for profit—books or journals, product packaging, brand marketing, advertising, video, paid courses, paid apps, or paid data products. Without commercial use: yes (or equivalent) on the listing, commercial use must not be assumed; educational or academic licenses do not auto-upgrade to commercial.'
            ],
            [
              '商業授權可且應在 listing 或合約中設定期限、地區、媒介（印刷／數位／影片）、使用次數或印量上限、是否可改作（裁切、合成、風格化），以及是否需事前審稿。賣方可分級定價；買方應在投放廣告或大量印刷前保存 listing 快照，避免日後授權範圍爭議。',
              'Commercial licenses may and should specify term, territory, media (print/digital/video), impression or print run limits, adaptation rights (crop, composite, stylize), and pre-approval requirements. Sellers may tier pricing; buyers should save listing snapshots before ad placement or bulk printing to avoid scope disputes.'
            ],
          ],
          [
            [
              '用於出版、商品、行銷、影片、付費課程等—須 listing 明示。',
              'Publishing, products, marketing, video, paid courses—must be explicit on listing.'
            ],
            [
              '可設定期限、地區、媒介、次數、改作條件。',
              'Term, territory, media, volume, and adaptation may be specified.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼是「獨家授權（exclusive license）」？',
          'What is an exclusive license?',
          [
            [
              '獨家授權指在約定期間與約定範圍內，賣方（或權利人）不再將相同或衝突之使用權授予其他買方；常見於商業圖版、展覽主視覺、品牌合作或限定典藏版本。獨家性可能僅限特定媒介（例如獨家印刷出版）或特定地區，未必是全域全媒介獨占。',
              'An exclusive license means the seller (or rights holder) will not grant the same or conflicting usage to other buyers for a defined term and scope—common for commercial plates, exhibition key visuals, brand partnerships, or limited collection editions. Exclusivity may be media-specific (e.g., exclusive print publishing) or territory-specific—not necessarily global all-media exclusivity.'
            ],
            [
              '獨家安排涉及重大權利處分，必須以 listing 明示、書面合約或平台支援之正式協議記載期間、範圍、例外（例如賣方保留學術引用）、違約責任與終止條件；不應僅以 FAQ 或口頭表示即視為獨家。可搭配較高對價，但價格本身不證明獨家成立。',
              'Exclusive arrangements involve significant rights allocation and require explicit listing terms, written contract, or platform-supported agreement covering term, scope, exceptions (e.g., seller retains academic citation), breach, and termination—not FAQ or verbal assurances alone. May carry higher consideration, but price alone does not prove exclusivity.'
            ],
          ],
          [
            [
              '特定期間內僅授權予特定買方（依合約範圍）。',
              'Only one buyer within term (per contract scope).'
            ],
            [
              '須書面或正式合約；FAQ 不能單獨證明獨家。',
              'Requires written or formal contract; FAQ alone cannot establish exclusivity.'
            ],
          ]
        ),
        faqItem(isZh,
          'SAT 成交是否包含「完整著作權讓與」？',
          'Does an SAT transaction include full copyright assignment?',
          [
            [
              '預設不包含。SAT 成交通常移轉的是 listing 所載之特定使用許可（例如教育、商用、展覽），而非攝影者、機構或作者對影像與文字之完整著作財產權。著作權讓與涉及可讓與權利之存在、作者身分、 moral rights 保留與適用法域，遠超一般 SAT 授權摘要所能涵蓋。',
              'Not by default. SAT settlement typically transfers specific usage licenses on the listing—not full copyright in images and text held by photographers, institutions, or authors. Assignment involves assignable rights, authorship, moral rights, and jurisdiction—beyond a typical SAT license summary.'
            ],
            [
              '只有當 listing、書面合約或權利人明示「copyright assignment」或同等讓與條款，且雙方完成必要簽署與對價安排時，才可能成立著作權讓與。SAT 交易本身、鏈上 token 轉移或 custody 更新，不應被自動解釋為著作權讓與；買方亦不得對外宣稱已取得完整著作權而未持證明文件。',
              'Assignment is possible only when listing, written contract, or rights holder explicitly states copyright assignment (or equivalent) and parties complete required execution and consideration. SAT settlement, on-chain token transfer, or custody update must not be auto-interpreted as copyright assignment; buyers must not claim full copyright without proof.'
            ],
          ],
          [
            [
              '預設不包含完整著作權讓與。',
              'Full copyright assignment is not included by default.'
            ],
            [
              '僅明確書面合約才可能成立。',
              'Only explicit written contract may establish assignment.'
            ],
          ]
        ),
        faqItem(isZh,
          '什麼是「不可再授權（non-sublicensable）」條款？',
          'What is a non-sublicensable clause?',
          [
            [
              '不可再授權條款表示買方不能把從 SAT 取得之使用權再轉售、再授權、分包或允許第三人商業使用—除非 listing 或合約明示允許 sublicensing 及其範圍（例如允許館方教育合作夥伴使用但禁止轉售圖庫）。這是 SAT 授權常見預設，用以防止未授權之二級市場或「轉賣授權」。',
              'A non-sublicensable clause means the buyer may not resell, sublicense, subcontract, or permit third-party commercial use of SAT-granted rights—unless the listing or contract explicitly permits sublicensing and its scope (e.g., museum education partners allowed but stock resale prohibited). This is a common SAT default to prevent unauthorized secondary markets or "license reselling."'
            ],
            [
              '若允許再授權，必須明確寫出：可再授權之對象（個人／機構／地區）、允許用途、是否需賣方書面同意、是否需分潤，以及再被授權人是否須遵守相同署名與限制。買方將 SAT 嵌入 API、資料產品或 white-label 平台前，應逐項確認再授權欄位，而非假設「買了就可轉賣」。',
              'If sublicensing is allowed, specify: eligible sublicensees (individual/institution/territory), permitted uses, whether seller written consent is required, revenue share, and whether sublicensees inherit attribution and limits. Before embedding SAT in APIs, data products, or white-label platforms, verify sublicense fields—do not assume "purchase equals resale rights."'
            ],
          ],
          [
            [
              '預設：買方不可把權利再賣或再授權予第三人。',
              'Default: buyer may not resell or sublicense to third parties.'
            ],
            [
              '若允許再授權，須明示範圍、對象與條件。',
              'If allowed, scope, parties, and conditions must be explicit.'
            ],
          ]
        ),
      ],
    };

    var insertAt = 3;
    if (content.faqGroups.length >= insertAt) {
      content.faqGroups.splice(insertAt, 0, licenseGroup);
    } else {
      content.faqGroups.push(licenseGroup);
    }

    content.faqLicenseMatrix = {
      title: p(isZh, 'SAT 授權類型對照表', 'SAT license type comparison'),
      intro: p(
        isZh,
        '下表為各授權類型之典型預設（實際以個別 listing 與合約為準）。「依 listing」表示須在該筆上架明示允許；「通常否」表示常見預設但可能被合約修改。',
        'Typical defaults by license type (actual terms follow each listing and contract). "Per listing" means the listing must explicitly allow; "Usually no" is a common default but may be changed by contract.'
      ),
      footnote: p(
        isZh,
        '完整著作權讓與與獨家授權須書面合約。不可再授權為常見限制條款，可與任一授權類型並存。',
        'Full copyright assignment and exclusive licenses require written contracts. Non-sublicensable is a common restriction that may apply alongside any license type.'
      ),
      linkLabel: p(isZh, '查看完整 FAQ', 'Read full FAQ'),
      linkTarget: 'faq-group-licenses',
      columns: [
        { key: 'type', label: p(isZh, '授權類型', 'License type') },
        { key: 'download', label: p(isZh, '可下載', 'Download') },
        { key: 'commercial', label: p(isZh, '可商用', 'Commercial') },
        { key: 'adapt', label: p(isZh, '可改作', 'Adapt') },
        { key: 'exhibit', label: p(isZh, '可展覽', 'Exhibit') },
        { key: 'resell', label: p(isZh, '可轉售', 'Resell') },
        { key: 'attribution', label: p(isZh, '需標示來源', 'Attribution') },
      ],
      rows: [
        {
          type: cell(isZh, '僅瀏覽', 'View only'),
          download: cell(isZh, '否', 'No'),
          commercial: cell(isZh, '否', 'No'),
          adapt: cell(isZh, '否', 'No'),
          exhibit: cell(isZh, '否', 'No'),
          resell: cell(isZh, '否', 'No'),
          attribution: cell(isZh, '是', 'Yes'),
        },
        {
          type: cell(isZh, '教育使用', 'Educational'),
          download: cell(isZh, '依 listing', 'Per listing'),
          commercial: cell(isZh, '通常否', 'Usually no'),
          adapt: cell(isZh, '依 listing', 'Per listing'),
          exhibit: cell(isZh, '依 listing', 'Per listing'),
          resell: cell(isZh, '否', 'No'),
          attribution: cell(isZh, '是', 'Yes'),
        },
        {
          type: cell(isZh, '學術引用', 'Academic citation'),
          download: cell(isZh, '依 listing', 'Per listing'),
          commercial: cell(isZh, '否', 'No'),
          adapt: cell(isZh, '通常否', 'Usually no'),
          exhibit: cell(isZh, '依 listing', 'Per listing'),
          resell: cell(isZh, '否', 'No'),
          attribution: cell(isZh, '是', 'Yes'),
        },
        {
          type: cell(isZh, '展覽使用', 'Exhibition'),
          download: cell(isZh, '依 listing', 'Per listing'),
          commercial: cell(isZh, '依 listing', 'Per listing'),
          adapt: cell(isZh, '依 listing', 'Per listing'),
          exhibit: cell(isZh, '是', 'Yes'),
          resell: cell(isZh, '否', 'No'),
          attribution: cell(isZh, '是', 'Yes'),
        },
        {
          type: cell(isZh, '商業使用', 'Commercial'),
          download: cell(isZh, '依 listing', 'Per listing'),
          commercial: cell(isZh, '是', 'Yes'),
          adapt: cell(isZh, '依 listing', 'Per listing'),
          exhibit: cell(isZh, '依 listing', 'Per listing'),
          resell: cell(isZh, '依 listing', 'Per listing'),
          attribution: cell(isZh, '依 listing', 'Per listing'),
        },
        {
          type: cell(isZh, '獨家授權', 'Exclusive'),
          download: cell(isZh, '依合約', 'Per contract'),
          commercial: cell(isZh, '依合約', 'Per contract'),
          adapt: cell(isZh, '依合約', 'Per contract'),
          exhibit: cell(isZh, '依合約', 'Per contract'),
          resell: cell(isZh, '通常否', 'Usually no'),
          attribution: cell(isZh, '是', 'Yes'),
        },
        {
          type: cell(isZh, '完整著作權讓與', 'Copyright assignment'),
          download: cell(isZh, '依合約', 'Per contract'),
          commercial: cell(isZh, '依合約', 'Per contract'),
          adapt: cell(isZh, '依合約', 'Per contract'),
          exhibit: cell(isZh, '依合約', 'Per contract'),
          resell: cell(isZh, '依合約', 'Per contract'),
          attribution: cell(isZh, '依合約', 'Per contract'),
        },
        {
          type: cell(isZh, '不可再授權（條款）', 'Non-sublicensable'),
          download: cell(isZh, '—', '—'),
          commercial: cell(isZh, '—', '—'),
          adapt: cell(isZh, '—', '—'),
          exhibit: cell(isZh, '—', '—'),
          resell: cell(isZh, '否（除非明示）', 'No (unless stated)'),
          attribution: cell(isZh, '是', 'Yes'),
        },
      ],
    };
  };
})(typeof window !== 'undefined' ? window : this);
