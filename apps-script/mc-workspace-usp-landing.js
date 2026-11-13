/**
 * Workspace tools marketing gallery — homepage (#welcomeWorkspaceUspSection).
 */
(function (global) {
  'use strict';

  var workspaceMarketingTools = [
    {
      id: 'passport',
      title: 'MCurator Passport Studio',
      titleZh: 'MCurator Passport Studio',
      copy: 'Real specimen photos — insects, plants, fossils — become SAT passport cards in one step.',
      copyZh: '真實標本照片，一鍵輸出 SAT 護照卡與 QR／標籤。',
      badge: 'Free to use',
      badgeZh: '免費使用',
      alt: 'Real specimen photographs organized into SAT passport cards.',
      altZh: '真實標本照片整理為 SAT 標本護照卡',
    },
    {
      id: 'paleo',
      title: 'Paleo Reconstruction',
      titleZh: '復原生態照片',
      copy: 'Create persuasive paleo reconstructions grounded in fossils and research.',
      copyZh: '依據化石與研究資料，生成更具說服力的古生物復原影像。',
      badge: 'Free to use',
      badgeZh: '免費使用',
      images: [
        {
          src: 'workspace-tools/paleo-fossil.png',
          alt: 'Fossil specimen evidence on white background.',
          altZh: '白底化石標本證據照片',
        },
        {
          src: 'workspace-tools/paleo-reconstruction.png',
          alt: 'Prehistoric marine creature reconstruction in natural underwater habitat.',
          altZh: '古生物復原影像與自然棲地場景',
        },
      ],
      alt: 'Fossil evidence and paleo reconstruction side by side.',
      altZh: '化石證據與古生物復原影像並列示意',
    },
    {
      id: 'photo',
      title: 'AI Photo Restoration Lab',
      titleZh: 'AI 照片修復實驗室',
      copy: 'Restore specimen, fossil, and field photos while preserving scientific detail.',
      copyZh: '修復標本、化石與野外照片，保留重要細節與研究價值。',
      badge: 'Free to use',
      badgeZh: '免費使用',
      images: [
        {
          src: 'workspace-tools/photo-before.png',
          alt: 'Damaged specimen photograph before restoration.',
          altZh: '修復前的損壞標本照片',
        },
        {
          src: 'workspace-tools/photo-after.png',
          alt: 'Restored specimen photograph on white background.',
          altZh: '修復後的清晰標本照片',
        },
      ],
      alt: 'Before and after specimen photo restoration comparison.',
      altZh: '標本照片修復前後對比示意',
    },
    {
      id: 'taxonomy',
      title: 'Taxonomy Manuscript Studio',
      titleZh: '分類學論文撰寫輔助器',
      copy: 'Organize characters, descriptions, and keys to speed up taxonomy writing.',
      copyZh: '整理特徵、描述與檢索表，加速分類學寫作流程。',
      badge: 'Free to use',
      badgeZh: '免費使用',
      image: 'workspace-tools/taxonomy-manuscript.png',
      alt: 'Marketing preview of taxonomy manuscript pages and character matrix notes.',
      altZh: '分類學論文、特徵矩陣與研究筆記的行銷示意圖',
    },
    {
      id: 'evolution',
      title: 'Evolution Tree Lab',
      titleZh: '演化樹研究工具',
      copy: 'Build comparable phylogenetic trees and explore taxonomic relationships.',
      copyZh: '快速建立可比較的演化樹，理解物種之間的分類脈絡。',
      badge: 'Free to use',
      badgeZh: '免費使用',
      image: 'workspace-tools/evolution-tree.png',
      alt: 'Marketing preview of a phylogenetic tree with species nodes.',
      altZh: '演化樹節點與物種比較介面的行銷示意圖',
    },
    {
      id: 'husbandry',
      title: 'Husbandry Log Tool',
      titleZh: '飼育紀錄工具',
      copy: 'Log daily care for reptile terrariums and planted aquascapes in one place.',
      copyZh: '爬蟲缸與水草缸，每日照護與環境參數一站紀錄。',
      badge: 'Free to use',
      badgeZh: '免費使用',
      images: [
        {
          src: 'workspace-tools/husbandry-reptile-tank.png',
          alt: 'Reptile terrarium with live plants and natural decor.',
          altZh: '爬蟲缸飼育環境',
          label: 'Reptile tank',
          labelZh: '爬蟲缸',
        },
        {
          src: 'workspace-tools/husbandry-aquascape.png',
          alt: 'Refined planted aquascape aquarium.',
          altZh: '精緻水草缸造景',
          label: 'Planted tank',
          labelZh: '水草缸',
        },
      ],
      alt: 'Reptile terrarium and planted aquascape husbandry logging.',
      altZh: '爬蟲缸與水草缸飼育紀錄',
    },
  ];

  var conceptArtById = {
    passport:
      '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<rect width="400" height="250" fill="#121a18"/>' +
      '<rect x="0" y="180" width="400" height="70" fill="#0c100e"/>' +
      '<rect x="28" y="148" width="344" height="18" rx="4" fill="#1a2420"/>' +
      '<rect x="36" y="36" width="168" height="112" rx="10" fill="#1e2a26" stroke="#c9a85c" stroke-width="1.2"/>' +
      '<rect x="48" y="48" width="68" height="52" rx="6" fill="#2a3832"/>' +
      '<rect x="124" y="48" width="68" height="8" rx="2" fill="#3d5248"/>' +
      '<rect x="124" y="62" width="52" height="6" rx="2" fill="#2f4038"/>' +
      '<rect x="124" y="74" width="60" height="6" rx="2" fill="#2f4038"/>' +
      '<rect x="124" y="92" width="44" height="28" rx="4" fill="#0f1614" stroke="#6ecfb8" stroke-width="0.8"/>' +
      '<rect x="128" y="96" width="8" height="8" fill="#6ecfb8"/><rect x="140" y="96" width="8" height="8" fill="#1a2420"/>' +
      '<rect x="152" y="96" width="8" height="8" fill="#1a2420"/><rect x="128" y="108" width="8" height="8" fill="#1a2420"/>' +
      '<rect x="224" y="44" width="132" height="96" rx="8" fill="#161f1c" stroke="#2a3832" stroke-width="1"/>' +
      '<ellipse cx="290" cy="82" rx="34" ry="28" fill="#2a4034"/>' +
      '<rect x="248" y="118" width="84" height="6" rx="2" fill="#3d5248"/>' +
      '<rect x="248" y="130" width="64" height="5" rx="2" fill="#2f4038"/>' +
      '</svg>',
    paleo:
      '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<defs><linearGradient id="paleoSky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#1a2830"/><stop offset="100%" stop-color="#0e1814"/></linearGradient></defs>' +
      '<rect width="400" height="250" fill="url(#paleoSky)"/>' +
      '<ellipse cx="200" cy="210" rx="220" ry="48" fill="#142018"/>' +
      '<ellipse cx="200" cy="205" rx="180" ry="32" fill="#1a3028"/>' +
      '<path d="M248 168 Q290 120 320 148 Q300 188 248 178 Z" fill="#3a5240"/>' +
      '<path d="M155 172 Q120 128 95 155 Q110 190 158 182 Z" fill="#2f4638"/>' +
      '<ellipse cx="268" cy="138" rx="42" ry="34" fill="#4a6048"/>' +
      '<path d="M230 148 Q248 118 278 128 Q268 158 242 162 Z" fill="#5a7050"/>' +
      '<rect x="48" y="168" width="36" height="28" rx="4" fill="#2a2218" stroke="#8a7050" stroke-width="1"/>' +
      '<rect x="56" y="176" width="20" height="12" rx="2" fill="#3d3428"/>' +
      '</svg>',
    photo:
      '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<rect width="400" height="250" fill="#141820"/>' +
      '<rect x="16" y="24" width="176" height="202" rx="10" fill="#222830" stroke="#3a4048" stroke-width="1"/>' +
      '<rect x="208" y="24" width="176" height="202" rx="10" fill="#1a2420" stroke="#6ecfb8" stroke-width="1"/>' +
      '<rect x="28" y="36" width="152" height="120" rx="6" fill="#2a2826" opacity="0.9"/>' +
      '<rect x="28" y="164" width="100" height="6" rx="2" fill="#3a3836"/>' +
      '<rect x="28" y="178" width="72" height="5" rx="2" fill="#323028"/>' +
      '<rect x="220" y="36" width="152" height="120" rx="6" fill="#2a3832"/>' +
      '<ellipse cx="296" cy="88" rx="38" ry="32" fill="#3d5248"/>' +
      '<rect x="220" y="164" width="100" height="6" rx="2" fill="#4a6054"/>' +
      '<rect x="220" y="178" width="72" height="5" rx="2" fill="#3d5248"/>' +
      '<rect x="188" y="108" width="24" height="24" rx="12" fill="#6ecfb8"/>' +
      '<path d="M194 114 L200 120 L206 112" stroke="#0e1614" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '</svg>',
    taxonomy:
      '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<rect width="400" height="250" fill="#16141c"/>' +
      '<rect x="32" y="28" width="140" height="188" rx="6" fill="#eae6dc" opacity="0.14"/>' +
      '<rect x="40" y="40" width="124" height="10" rx="2" fill="#eae6dc" opacity="0.22"/>' +
      '<rect x="40" y="58" width="100" height="6" rx="2" fill="#eae6dc" opacity="0.12"/>' +
      '<rect x="40" y="70" width="108" height="6" rx="2" fill="#eae6dc" opacity="0.12"/>' +
      '<rect x="40" y="88" width="88" height="6" rx="2" fill="#eae6dc" opacity="0.1"/>' +
      '<rect x="188" y="48" width="168" height="120" rx="8" fill="#1e1a28" stroke="#6a5a8a" stroke-width="1"/>' +
      '<rect x="200" y="62" width="24" height="24" rx="2" fill="#3d3450"/>' +
      '<rect x="230" y="62" width="24" height="24" rx="2" fill="#2a2438"/>' +
      '<rect x="260" y="62" width="24" height="24" rx="2" fill="#4a4060"/>' +
      '<rect x="200" y="92" width="24" height="24" rx="2" fill="#2a2438"/>' +
      '<rect x="230" y="92" width="24" height="24" rx="2" fill="#6ecfb8" opacity="0.5"/>' +
      '<rect x="260" y="92" width="24" height="24" rx="2" fill="#2a2438"/>' +
      '<path d="M48 140 L72 152 L96 136" stroke="#a894e8" stroke-width="1.5" fill="none"/>' +
      '<path d="M48 160 L80 168 L112 154" stroke="#a894e8" stroke-width="1.5" fill="none" opacity="0.6"/>' +
      '</svg>',
    evolution:
      '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<rect width="400" height="250" fill="#0e1618"/>' +
      '<line x1="200" y1="36" x2="200" y2="200" stroke="#6ecfb8" stroke-width="2" opacity="0.7"/>' +
      '<line x1="200" y1="80" x2="120" y2="130" stroke="#6ecfb8" stroke-width="1.8" opacity="0.55"/>' +
      '<line x1="200" y1="80" x2="280" y2="130" stroke="#6ecfb8" stroke-width="1.8" opacity="0.55"/>' +
      '<line x1="120" y1="130" x2="80" y2="180" stroke="#6ecfb8" stroke-width="1.5" opacity="0.45"/>' +
      '<line x1="280" y1="130" x2="320" y2="180" stroke="#6ecfb8" stroke-width="1.5" opacity="0.45"/>' +
      '<circle cx="200" cy="36" r="10" fill="#6ecfb8"/>' +
      '<circle cx="200" cy="80" r="8" fill="#4a9080"/>' +
      '<circle cx="120" cy="130" r="8" fill="#4a9080"/>' +
      '<circle cx="280" cy="130" r="8" fill="#4a9080"/>' +
      '<circle cx="80" cy="180" r="7" fill="#3a7068"/>' +
      '<circle cx="320" cy="180" r="7" fill="#3a7068"/>' +
      '<circle cx="200" cy="200" r="9" fill="#6ecfb8" opacity="0.85"/>' +
      '<rect x="300" y="44" width="72" height="28" rx="6" fill="#141c1a" stroke="#6ecfb8" stroke-width="0.8"/>' +
      '</svg>',
    husbandry:
      '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<rect width="400" height="250" fill="#121810"/>' +
      '<rect x="28" y="32" width="148" height="186" rx="12" fill="#1a2218" stroke="#3a4838" stroke-width="1"/>' +
      '<rect x="40" y="48" width="124" height="64" rx="8" fill="#243028"/>' +
      '<ellipse cx="102" cy="76" rx="28" ry="22" fill="#3a5040"/>' +
      '<rect x="40" y="122" width="88" height="6" rx="2" fill="#4a5848"/>' +
      '<rect x="40" y="136" width="64" height="5" rx="2" fill="#3a4838"/>' +
      '<rect x="196" y="40" width="176" height="178" rx="10" fill="#161e16" stroke="#3a4838" stroke-width="1"/>' +
      '<circle cx="220" cy="68" r="6" fill="#6ecfb8"/><rect x="236" y="64" width="80" height="8" rx="2" fill="#3a4838"/>' +
      '<circle cx="220" cy="96" r="6" fill="#d4b06a"/><rect x="236" y="92" width="64" height="8" rx="2" fill="#3a4838"/>' +
      '<circle cx="220" cy="124" r="6" fill="#7eb4f0"/><rect x="236" y="120" width="72" height="8" rx="2" fill="#3a4838"/>' +
      '<rect x="208" y="152" width="152" height="48" rx="6" fill="#1a2218"/>' +
      '<rect x="220" y="164" width="48" height="22" rx="6" fill="#243028" stroke="#d4b06a" stroke-width="0.8"/>' +
      '<rect x="276" y="164" width="48" height="22" rx="6" fill="#243028" stroke="#7eb4f0" stroke-width="0.8"/>' +
      '</svg>',
  };

  function lang() {
    try {
      if (typeof global.mcGetLang === 'function') return global.mcGetLang() === 'en' ? 'en' : 'zh';
      if (typeof global.state !== 'undefined' && global.state && global.state.lang === 'en') return 'en';
      var stored = global.localStorage && global.localStorage.getItem('MC_USER_LANG');
      if (stored === 'en') return 'en';
      if (stored === 'zh-TW') return 'zh';
    } catch (e) {}
    return 'zh';
  }

  function pick(zh, en) {
    return lang() === 'en' ? en : zh;
  }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderConceptArt(toolId) {
    return conceptArtById[toolId] || conceptArtById.passport;
  }

  var passportSpecimenGallery = [
    {
      src: 'workspace-tools/passport-helio.png',
      altZh: 'Heliophorus 蝴蝶標本',
      alt: 'Heliophorus butterfly specimen',
    },
    {
      src: 'workspace-tools/passport-ginkgo.png',
      altZh: '銀杏標本',
      alt: 'Ginkgo biloba specimen',
    },
    {
      src: 'workspace-tools/passport-stag.png',
      altZh: '鍬形蟲標本',
      alt: 'Stag beetle specimen',
    },
    {
      src: 'workspace-tools/passport-ant.png',
      altZh: '螞蟻標本',
      alt: 'Ant specimen',
    },
    {
      src: 'workspace-tools/passport-scarab.png',
      altZh: '金龜科標本',
      alt: 'Scarab beetle specimen',
    },
  ];

  function renderPassportVisual() {
    var hero = passportSpecimenGallery[0];
    var mosaic = passportSpecimenGallery
      .map(function (item) {
        return (
          '<div class="workspace-tool-card__mosaicCell">' +
          '<img class="workspace-tool-card__mosaicImg" src="' +
          esc(item.src) +
          '" alt="' +
          esc(pick(item.altZh, item.alt)) +
          '" loading="lazy" decoding="async">' +
          '</div>'
        );
      })
      .join('');

    return (
      '<div class="workspace-tool-card__passportShowcase">' +
      '<div class="workspace-tool-card__specimenMosaic">' +
      mosaic +
      '</div>' +
      '<div class="workspace-tool-card__passportPreview">' +
      '<div class="workspace-tool-card__passportCard">' +
      '<span class="workspace-tool-card__passportSat">SAT · MC</span>' +
      '<div class="workspace-tool-card__passportPhoto">' +
      '<img src="' +
      esc(hero.src) +
      '" alt="" loading="lazy" decoding="async">' +
      '</div>' +
      '<div class="workspace-tool-card__passportLines" aria-hidden="true">' +
      '<span></span><span></span><span></span>' +
      '</div>' +
      '<div class="workspace-tool-card__passportQr" aria-hidden="true"></div>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function renderPassportUspStrip() {
    var chips = [
      pick('SAT 身分', 'SAT ID'),
      pick('QR / Label', 'QR / Label'),
      pick('Export', 'Export'),
    ];
    return (
      '<div class="workspace-tool-card__uspStrip" aria-hidden="true">' +
      chips
        .map(function (label) {
          return '<span class="workspace-tool-card__uspChip">' + esc(label) + '</span>';
        })
        .join('') +
      '</div>'
    );
  }

  function renderToolVisual(tool) {
    if (tool.id === 'passport') {
      return renderPassportVisual();
    }

    if (tool.images && tool.images.length) {
      var panels = tool.images
        .map(function (item, i) {
          var panelAlt = pick(item.altZh, item.alt);
          var panelClass =
            'workspace-tool-card__img workspace-tool-card__splitImg' +
            (i === 0 ? ' workspace-tool-card__splitImg--evidence' : ' workspace-tool-card__splitImg--result');
          var label =
            item.labelZh || item.label
              ? '<span class="workspace-tool-card__splitLabel">' +
                esc(pick(item.labelZh, item.label)) +
                '</span>'
              : '';
          return (
            '<div class="workspace-tool-card__splitPanel">' +
            '<img class="' +
            panelClass +
            '" src="' +
            esc(item.src) +
            '" alt="' +
            esc(panelAlt) +
            '" loading="lazy" decoding="async" onerror="this.classList.add(\'is-broken\')">' +
            label +
            '</div>'
          );
        })
        .join('');
      return '<div class="workspace-tool-card__split">' + panels + '</div>';
    }

    if (!tool.image) return '';

    var alt = pick(tool.altZh, tool.alt);
    return (
      '<img class="workspace-tool-card__img" src="' +
      esc(tool.image) +
      '" alt="' +
      esc(alt) +
      '" loading="lazy" decoding="async" onerror="this.classList.add(\'is-broken\')">'
    );
  }

  function createWorkspaceToolCard(tool, index) {
    var title = pick(tool.titleZh, tool.title);
    var copy = pick(tool.copyZh, tool.copy);
    var badge = pick(tool.badgeZh, tool.badge);
    var idx = String(index + 1).padStart(2, '0');
    var concept = renderConceptArt(tool.id);
    var visual = renderToolVisual(tool);
    var visualMod =
      tool.id === 'passport'
        ? ' workspace-tool-card__visual--passportShowcase'
        : tool.images && tool.images.length
          ? ' workspace-tool-card__visual--split'
          : '';

    return (
      '<article class="workspace-tool-card" role="listitem" data-tool-id="' +
      esc(tool.id) +
      '">' +
      '<div class="workspace-tool-card__visual workspace-tool-card__visual--' +
      esc(tool.id) +
      visualMod +
      '">' +
      '<div class="workspace-tool-card__concept">' +
      concept +
      '</div>' +
      visual +
      (tool.id === 'passport' ? renderPassportUspStrip() : '') +
      '</div>' +
      '<div class="workspace-tool-card__body">' +
      '<div class="workspace-tool-card__meta">' +
      '<span class="workspace-tool-card__index">' +
      esc(idx) +
      '</span>' +
      '<span class="workspace-tool-card__badge">' +
      esc(badge) +
      '</span>' +
      '</div>' +
      '<h3 class="workspace-tool-card__title">' +
      esc(title) +
      '</h3>' +
      '<p class="workspace-tool-card__copy">' +
      esc(copy) +
      '</p>' +
      '</div>' +
      '</article>'
    );
  }

  function renderWorkspaceToolsMarketing() {
    var host = global.document.getElementById('mcWorkspaceUspHomeRoot');
    if (!host) return;
    host.innerHTML = workspaceMarketingTools
      .map(function (tool, i) {
        return createWorkspaceToolCard(tool, i);
      })
      .join('');
  }

  function render() {
    renderWorkspaceToolsMarketing();
  }

  global.MCWorkspaceUspLanding = {
    render: render,
    renderWorkspaceToolsMarketing: renderWorkspaceToolsMarketing,
    createWorkspaceToolCard: createWorkspaceToolCard,
    tools: workspaceMarketingTools.slice(),
    modules: workspaceMarketingTools,
  };

  try {
    global.addEventListener('mc:localechange', render);
    global.addEventListener('mc:locale', render);
  } catch (eLoc) {
    void 0;
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})(typeof window !== 'undefined' ? window : this);
