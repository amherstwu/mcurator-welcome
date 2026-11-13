/**
 * High-risk transaction notice — appended to SAT about content.
 */
(function (global) {
  'use strict';

  function p(isZh, zh, en) {
    return isZh ? zh : en;
  }

  global.MC_SAT_appendHighRiskLegal = function (content, isZh) {
    if (!content) return;

    content.highRiskLegalTitle = p(isZh, '高風險交易特別聲明', 'High-risk transaction notice');
    content.highRiskLegal = {
      alertTitle: p(isZh, '請勿僅依平台介面判斷交易風險', 'Do not rely on UI alone for transaction risk'),
      alertBody: p(
        isZh,
        '下列交易類型可能涉及跨境法規、保育限制、權利爭議、稅務、物流、加密資產不可逆付款或機構政策。此類交易不應僅憑 listing 欄位、驗證徽章或平台 UI 即視為安全；您可能需要額外審查、補件、書面合約或獨立專業意見後再決定是否進行。',
        'The transaction types below may involve cross-border rules, conservation limits, rights disputes, tax, logistics, irreversible crypto payment, or institutional policy. Do not treat listings, verification badges, or platform UI alone as sufficient—you may need additional review, documents, written contracts, or independent professional advice before proceeding.'
      ),
      riskTypesTitle: p(isZh, '1. 高風險交易類型', '1. High-risk transaction types'),
      riskTypes: [
        p(isZh, '含實體標本移交', 'Physical specimen transfer included'),
        p(isZh, '跨境運送', 'Cross-border shipping'),
        p(isZh, '涉及 CITES 或保育類物種', 'CITES or protected species involved'),
        p(isZh, '涉及化石、礦物、文化資產、考古物、古生物標本', 'Fossils, minerals, cultural heritage, archaeological or paleontological specimens'),
        p(isZh, '高價 SAT 或高價實體標本', 'High-value SAT or high-value physical specimen'),
        p(isZh, '商業授權、獨家授權、再授權', 'Commercial, exclusive, or sublicensing deals'),
        p(isZh, '機構館藏資料授權', 'Institutional collection data licensing'),
        p(isZh, '第三方照片、掃描、3D 模型或 AI 復原圖', 'Third-party photos, scans, 3D models, or AI reconstructions'),
        p(isZh, '使用 USDC、USDT、ETH 或其他數位資產付款', 'Payment in USDC, USDT, ETH, or other digital assets'),
        p(isZh, '二級轉售或分潤安排', 'Secondary resale or revenue-sharing arrangements'),
        p(isZh, '涉及美國、日本或其他法域使用者', 'Involving users in the US, Japan, or other jurisdictions'),
        p(isZh, '涉及敏感物種棲地、精確 GPS、私人收藏地點', 'Sensitive habitat, precise GPS, or private collection locations'),
        p(isZh, '賣方無法提供來源證明、入手證明或授權文件', 'Seller cannot provide provenance, acquisition, or authorization documents'),
      ],
      cards: [
        {
          title: p(isZh, '2. 平台可採取的風險控管措施', '2. Platform risk controls (as applicable)'),
          intro: p(
            isZh,
            'MCurator 得依個案風險、權利人通知、使用者申訴、系統偵測或營運需要，視情況採取下列一項或多項措施；並非每筆交易均會啟用全部流程。',
            'MCurator may apply one or more of the following measures based on case risk, rights-holder notices, user reports, system signals, or operational needs—not every transaction triggers every step.'
          ),
          bullets: [
            p(isZh, '要求補充文件', 'Request additional documents'),
            p(isZh, '暫停上架', 'Pause listing'),
            p(isZh, '暫停交易', 'Pause transaction'),
            p(isZh, '隱藏敏感欄位', 'Hide sensitive fields'),
            p(isZh, '限制下載', 'Restrict downloads'),
            p(isZh, '限制商業授權', 'Restrict commercial licensing'),
            p(isZh, '限制特定國家使用者購買', 'Restrict purchases by users in certain countries'),
            p(isZh, '要求買方交易前確認', 'Require buyer pre-checkout acknowledgment'),
            p(isZh, '要求賣方聲明合法來源', 'Require seller lawful-source declaration'),
            p(isZh, '要求人工審查', 'Require manual review'),
            p(isZh, '要求第三方鑑定或機構證明', 'Require third-party appraisal or institutional proof'),
            p(isZh, '保留交易快照與申訴紀錄', 'Retain transaction snapshots and dispute records'),
            p(isZh, '通知可能受影響使用者', 'Notify potentially affected users'),
            p(isZh, '下架 listing', 'Delist listing'),
            p(isZh, '限制帳號', 'Restrict account'),
            p(isZh, '依法律或主管機關要求提供必要資料', 'Provide required data to authorities when legally required'),
          ],
        },
        {
          title: p(isZh, '3. 賣方聲明與保證', '3. Seller representations'),
          intro: p(
            isZh,
            '賣方上架或更新 listing 時，應確認並聲明下列事項（以正式賣家條款與上架流程為準）：',
            'When listing or updating, sellers should confirm and represent the following (per formal seller terms and listing flow):'
          ),
          bullets: [
            p(isZh, '賣方有權上架該 SAT 或相關資料。', 'The seller has authority to list the SAT and related data.'),
            p(isZh, '賣方有權授權照片、文字、3D 模型、掃描資料、標本護照與後設資料。', 'The seller may license photos, text, 3D models, scans, specimen passports, and metadata.'),
            p(isZh, '賣方提供之學名、產地、日期、來源、保管狀態、是否含實體標本、授權範圍與付款條件，據其所知為真實且不具重大誤導。', 'Taxonomy, locality, dates, provenance, custody, physical-specimen status, license scope, and payment terms are, to the seller\'s knowledge, accurate and not materially misleading.'),
            p(isZh, '賣方未故意隱瞞 CITES、保育、進出口、文化資產、機構政策、權利限制或標本瑕疵。', 'The seller has not intentionally concealed CITES, conservation, import/export, cultural-heritage, institutional policy, rights limits, or specimen defects.'),
            p(isZh, '賣方若提供虛假資料，應自行承擔買方、權利人、主管機關或第三方因此提出之責任。', 'If the seller provides false information, the seller bears responsibility toward buyers, rights holders, authorities, or third parties.'),
            p(isZh, '平台可依正式條款向賣方求償或限制服務。', 'The platform may seek recovery or restrict service under formal terms.'),
          ],
        },
        {
          title: p(isZh, '4. 買方確認與風險承擔', '4. Buyer acknowledgments & risk'),
          intro: p(
            isZh,
            '買方於購買、出價或接受授權前，應自行確認下列事項：',
            'Before purchase, bid, or accepting a license, buyers should confirm:'
          ),
          bullets: [
            p(isZh, '是否只取得數位資料或授權。', 'Whether they receive digital data or a license only.'),
            p(isZh, '是否含實體標本。', 'Whether a physical specimen is included.'),
            p(isZh, '授權是否允許下載、展示、研究引用、教育使用、商業使用、出版、再授權或轉售。', 'Whether the license allows download, display, research citation, education, commercial use, publication, sublicensing, or resale.'),
            p(isZh, '是否涉及 CITES、進出口、稅務、保存、保險或物流。', 'Whether CITES, import/export, tax, storage, insurance, or logistics apply.'),
            p(isZh, '使用加密資產付款是否不可逆。', 'Whether crypto payment is irreversible.'),
            p(isZh, '交易是否可能產生稅務申報義務。', 'Whether the transaction may create tax reporting duties.'),
            p(isZh, '平台驗證徽章不等於政府核准、法律保證、學術終局定名或標本真偽保證。', 'Platform verification badges are not government approval, legal assurance, final taxonomic determination, or authenticity warranty.'),
            p(isZh, '若買方用途超出授權，買方需自行承擔侵權或違約責任。', 'Use beyond license scope is the buyer\'s infringement or breach risk.'),
          ],
        },
        {
          title: p(isZh, '5. 平台責任限制', '5. Platform liability limits'),
          bullets: [
            p(isZh, '平台會盡合理努力提供資料欄位、驗證流程、風險提示、申訴流程與交易紀錄。', 'The platform uses reasonable efforts to provide data fields, verification workflows, risk notices, dispute processes, and transaction records.'),
            p(isZh, '平台不保證賣方資料完全正確。', 'The platform does not warrant that seller data is fully accurate.'),
            p(isZh, '平台不保證標本真偽、年代、產地、物種鑑定、保存狀態或法律可交易性。', 'The platform does not warrant authenticity, age, locality, identification, condition, or legal tradability.'),
            p(isZh, '平台不保證任何 SAT 可升值、可轉售、可流通或可換取收益。', 'The platform does not warrant appreciation, resale, liquidity, or yield for any SAT.'),
            p(isZh, '平台不承擔使用者未遵守授權、稅務、進出口、CITES、隱私、智慧財產權或所在地法律所產生之責任。', 'The platform is not liable for user failures to comply with license, tax, import/export, CITES, privacy, IP, or local law.'),
            p(isZh, '正式服務之責任限制與上限，以正式服務條款為準。', 'Liability limits and caps for live service follow formal terms of service.'),
          ],
        },
        {
          title: p(isZh, '6. 禁止事項', '6. Prohibited conduct'),
          intro: p(
            isZh,
            '以下行為違反平台規範，可能導致下架、限制帳號、保留紀錄或依正式條款追究責任：',
            'The following violates platform rules and may lead to delisting, account limits, record retention, or remedies under formal terms:'
          ),
          bullets: [
            p(isZh, '上架非法採集、盜挖、走私或來源不明標本。', 'Listing illegally collected, pilfered, smuggled, or unknown-provenance specimens.'),
            p(isZh, '偽造 provenance。', 'Fabricating provenance.'),
            p(isZh, '偽造館藏資料或機構背書。', 'Fabricating collection records or institutional endorsement.'),
            p(isZh, '偽造 CITES、出口、進口、人工繁殖或合法來源文件。', 'Forging CITES, export, import, captive-breeding, or lawful-source documents.'),
            p(isZh, '冒用他人照片、掃描、研究資料或標本紀錄。', 'Misusing others\' photos, scans, research data, or specimen records.'),
            p(isZh, '將 SAT 宣傳為保證獲利、投資商品、收益權或基金單位。', 'Promoting SAT as guaranteed profit, an investment product, yield right, or fund unit.'),
            p(isZh, '使用平台從事洗錢、詐騙、制裁規避、逃稅、違法跨境付款。', 'Using the platform for money laundering, fraud, sanctions evasion, tax evasion, or unlawful cross-border payment.'),
            p(isZh, '公開敏感物種精確 GPS 或私人收藏地點，導致盜獵、盜採或安全風險。', 'Publishing precise GPS or private collection sites for sensitive species, creating poaching, pilfering, or safety risk.'),
            p(isZh, '引導買方私下付款以規避平台紀錄與風險控管。', 'Directing buyers to off-platform payment to bypass records and risk controls.'),
          ],
          prominent: true,
        },
      ],
    };
  };
})(typeof window !== 'undefined' ? window : this);
