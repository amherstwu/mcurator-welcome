/**
 * Hero passport — Passport Studio cinema front (passport-cinema-front--hero-layout).
 */
(function (global) {
  'use strict';

  function passportCinemaFrontHTML() {
    return (
      '<article class="passport-cinema-card passport-cinema-front passport-cinema-front--hero-layout">' +
      '<div class="passport-cinema-gloss" aria-hidden="true"></div>' +
      '<header class="passport-cinema-front__header">' +
      '<div class="passport-cinema-front__header-main">' +
      '<span class="passport-cinema-badge is-empty">TEMPLATE</span>' +
      '<strong class="is-placeholder">MC - ______</strong>' +
      '<small class="is-placeholder">SAT ID pending</small>' +
      '</div>' +
      '<em class="passport-cinema-front__verified is-pending">空白</em>' +
      '</header>' +
      '<button type="button" class="passport-cinema-image-frame" tabindex="-1">' +
      '<div class="card-image-frame" data-rotation="0" data-fit="contain" data-has-image="false" data-fit-engine="css">' +
      '<div class="card-image-frame__clip passport-cinema-image-frame__clip">' +
      '<div class="card-image-frame__stage" aria-hidden="true">' +
      '<div class="card-image-frame__placeholder"><span>Image placeholder</span></div>' +
      '<img class="card-image-frame__img card-image-frame__img--css-fit" src="" alt="" width="600" height="420" loading="lazy" decoding="async" hidden />' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</button>' +
      '<section class="passport-cinema-identity">' +
      '<button type="button" class="passport-cinema-taxonomy-badge" tabindex="-1">Taxonomy pending</button>' +
      '<button type="button" class="passport-cinema-name" tabindex="-1">' +
      '<strong class="passport-cinema-sci-fit">Scientific name pending</strong>' +
      '<span>Common name pending</span>' +
      '</button>' +
      '</section>' +
      '<button type="button" class="passport-cinema-metadata-grid" data-hero-zone="metadata" tabindex="-1">' +
      '<div style="--delay: 0s;"><dt>產地</dt><dd>Pending</dd></div>' +
      '<div style="--delay: 0.22s;"><dt>日期</dt><dd>Pending</dd></div>' +
      '<div style="--delay: 0.44s;"><dt>採集者</dt><dd>Pending</dd></div>' +
      '<div style="--delay: 0.66s;"><dt>能見度</dt><dd>Pending</dd></div>' +
      '</button>' +
      '<div class="passport-cinema-chip-row passport-cinema-chip-row--studio" aria-label="Passport capabilities">' +
      '<span>標籤</span><span>圖片</span><span>學名階層</span><span>產地</span>' +
      '<span>採集者</span><span>能見度</span><span>審查</span><span>匯出</span>' +
      '</div>' +
      '<footer class="passport-cinema-footer passport-cinema-footer--studio">' +
      '<div class="passport-cinema-footer__row1">' +
      '<span>完成度 0%</span>' +
      '<span class="passport-cinema-footer__review-cue">等待 SAT ID</span>' +
      '</div>' +
      '<i class="passport-cinema-footer__bar"><span style="width:0%"></span></i>' +
      '<p class="passport-cinema-footer__pipeline">QR · CSV · JSON — 管線待解鎖</p>' +
      '<small>典藏編碼待產生</small>' +
      '</footer>' +
      '</article>'
    );
  }

  function passportCinemaBackHTML() {
    var rows = [
      ['sat', 'SAT ID', '—', 'passport-cinema-back__ledger-value passport-cinema-back__ledger-value--mono'],
      ['asset', '資產編號', '—', 'passport-cinema-back__ledger-value passport-cinema-back__ledger-value--mono'],
      ['mc', '館號', '—', 'passport-cinema-back__ledger-value passport-cinema-back__ledger-value--mono'],
      ['sci', '學名', '—', 'passport-cinema-back__ledger-value passport-cinema-back__scientific'],
      ['common', '俗名', '—', 'passport-cinema-back__ledger-value'],
      ['tax', '分類階層', '—', 'passport-cinema-back__ledger-value passport-cinema-back__ledger-value--taxonomy'],
      ['loc', '產地', '—', 'passport-cinema-back__ledger-value'],
      ['lic', '授權', '—', 'passport-cinema-back__ledger-value'],
      ['rev', '審查', '—', 'passport-cinema-back__ledger-value'],
      ['exp', '匯出狀態', '—', 'passport-cinema-back__ledger-value passport-cinema-back__ledger-value--mono'],
    ];
    var rowHtml = rows
      .map(function (row) {
        return (
          '<div class="passport-cinema-back__ledger-row" data-back-key="' +
          row[0] +
          '">' +
          '<span class="passport-cinema-back__ledger-label">' +
          row[1] +
          '</span>' +
          '<strong class="' +
          row[3] +
          '">' +
          row[2] +
          '</strong></div>'
        );
      })
      .join('');
    return (
      '<article class="passport-cinema-card passport-cinema-back passport-cinema-back--studio passport-cinema-back--archive-sheet passport-cinema-back--hero-layout">' +
      '<img class="passport-cinema-back__image" src="../assets/Card%20back%20image/common.png" alt="" decoding="async" />' +
      '<div class="passport-cinema-back__studio-overlay" aria-hidden="true"></div>' +
      '<div class="passport-cinema-back__ornament" aria-hidden="true"></div>' +
      '<div class="passport-cinema-back__mist" aria-hidden="true"></div>' +
      '<div class="passport-cinema-gloss" aria-hidden="true"></div>' +
      '<div class="passport-cinema-back__archive">' +
      '<h3 class="passport-cinema-back__brand">標本護照</h3>' +
      '<p class="passport-cinema-back__subtitle-en">SPECIMEN PASSPORT CARD · 背面</p>' +
      '<div class="passport-cinema-back__ledger">' +
      rowHtml +
      '</div>' +
      '<div class="passport-cinema-back__institution passport-cinema-back__institution--archive">已驗證可機構匯出（示範）</div>' +
      '</div></article>'
    );
  }

  global.McHeroPassportTemplate = {
    front: passportCinemaFrontHTML,
    back: passportCinemaBackHTML,
  };
})(typeof window !== 'undefined' ? window : globalThis);
