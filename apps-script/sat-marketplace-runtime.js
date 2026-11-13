/**
 * SAT Scientific Asset Marketplace — explore, asset detail, guide (Round 1)
 * Exposes window.SatMarketplace. Requires: escapeHtml, escapeHtmlAttr, t, state, getUiExperience, etc. from host.
 */
(function (global) {
  'use strict';

  var _ui = {
    view: 'explore',
    assetId: null,
    detailTab: 'overview',
    q: '',
    sort: 'newest',
    filters: {
      category: '',
      assetType: '',
      verification: '',
      listingStatus: '',
      hasProvenance: false,
      conservation: false
    },
    gridCompact: false,
    filtersOpen: false
  };

  function pick(obj, lang) {
    if (!obj || typeof obj !== 'object') return '';
    if (obj[lang] != null && String(obj[lang]).length) return String(obj[lang]);
    if (obj['zh-TW'] != null) return String(obj['zh-TW']);
    if (obj.en != null) return String(obj.en);
    return '';
  }

  function parseJson(s) {
    try {
      if (!s || !String(s).trim()) return null;
      return JSON.parse(String(s));
    } catch (e) {
      return null;
    }
  }

  function imgUrl(i) {
    var arr = global.MC_FLICKR_PICTUREPIZ;
    if (arr && arr[i]) return arr[i];
    var d =
      (typeof global.MC_DEFAULT_DEMO_IMAGE_URLS !== 'undefined' && global.MC_DEFAULT_DEMO_IMAGE_URLS) ||
      (typeof window !== 'undefined' && window.MC_DEFAULT_DEMO_IMAGE_URLS) ||
      null;
    if (d && d.length) return d[i % d.length] || d[0];
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 6'><rect fill='%23131a20' width='8' height='6'/><text x='4' y='3.2' text-anchor='middle' fill='%237a8a9a' font-size='0.4' font-family='system-ui'>SAT</text></svg>"
    );
  }

  function getDefaultAssets() {
    return [
      {
        id: 'sat-asset-001',
        satId: 'SAT-000001',
        title: { 'zh-TW': '鳳蝶類標本憑證', en: 'Swallowtail specimen certificate' },
        subtitle: {
          'zh-TW': '採集地、鑑定與標本館流程可銜接',
          en: 'Field data, identification, and curatorial workflow in one traceable record'
        },
        scientificName: 'Papilio sp.',
        commonName: { 'zh-TW': '鳳蝶', en: 'Swallowtail' },
        category: 'insect',
        assetType: 'physical_specimen_certificate',
        collectionId: 'col-demo-entomology',
        collectionName: { 'zh-TW': '示範昆蟲參考庫', en: 'Demo entomology reference' },
        specimenId: 'MC-SPEC-000001',
        images: [{ url: imgUrl(12), alt: { 'zh-TW': '鳳蝶標本', en: 'Swallowtail voucher' }, credit: 'Local project asset' }],
        listing: { status: 'listed', price: 25, currency: 'Ref.', demoOnly: true, listingType: 'fixed_price' },
        verification: { status: 'curator_verified', verifiedBy: 'MCurator Demo Curator', verifiedAt: '2026-03-15', notes: '' },
        taxonomy: {
          kingdom: 'Animalia',
          phylum: 'Arthropoda',
          className: 'Insecta',
          order: 'Lepidoptera',
          family: 'Papilionidae',
          genus: 'Papilio',
          species: '',
          iucnStatus: 'NE'
        },
        collectionData: {
          country: 'TW',
          locality: 'Nantou',
          latitude: 23.95,
          longitude: 120.9,
          elevation: '1850m',
          collector: '陳示範',
          collectedDate: '2024-06-12',
          institution: 'Demo Natural History',
          department: { 'zh-TW': '昆蟲組', en: 'Entomology' },
          preparationMethod: { 'zh-TW': '針插、展翅', en: 'Pinned, spread' },
          preservationMethod: { 'zh-TW': '乾藏', en: 'Dry' }
        },
        provenance: [
          { id: 'p1', date: '2024-06-12', type: 'field_collection', actor: '陳示範', institution: '', location: 'TW-Nantou', description: { 'zh-TW': '野外採集與初錄。', en: 'Field collection and first log.' }, evidenceUrl: '', verified: true },
          { id: 'p2', date: '2024-07-01', type: 'cataloguing', actor: 'Demo Curator', institution: 'Demo Natural History', location: '', description: { 'zh-TW': '入庫與學名檢校。', en: 'Accession and name check.' }, evidenceUrl: '', verified: true },
          { id: 'p3', date: '2026-03-15', type: 'sat_registration', actor: 'MCurator', institution: 'MCurator', location: '', description: { 'zh-TW': 'SAT 科學資產條目建立（示範）。', en: 'SAT registry entry (demo).' }, evidenceUrl: '', verified: true }
        ],
        custody: [
          {
            id: 'c1',
            from: 'Field',
            to: 'Demo Natural History',
            role: { 'zh-TW': '典藏管理者', en: 'Collection holder' },
            date: '2024-07-01',
            proofUrl: '',
            notes: { 'zh-TW': '機構入藏。', en: 'Institutional accession.' }
          }
        ],
        documents: [{ id: 'd1', type: 'link', title: 'GBIF', url: 'https://www.gbif.org', doi: '', notes: '' }],
        conservation: {
          linked: true,
          allocationRate: 0.5,
          description: {
            'zh-TW': '參考價值用於教學展示；不構成投資建議。若日後有機構保育合作或政策提撥，以正式合約與公告為準（本示範不產生實付）。',
            en: 'Reference value is educational—not investment advice. Conservation partnerships, if any, would follow published institutional policy (this demo has no real payments).'
          }
        },
        visibility: 'public',
        featured: true,
        provCount: 3,
        createdAt: '2024-07-01',
        updatedAt: '2026-04-01'
      },
      {
        id: 'sat-asset-002',
        satId: 'SAT-000002',
        title: { 'zh-TW': '潮間帶珊瑚微棲地紀錄', en: 'Marine coral microhabitat record' },
        subtitle: {
          'zh-TW': '生態系連結的科學資產後設',
          en: 'Ecosystem-linked metadata for a scientific asset'
        },
        scientificName: 'Acropora sp.',
        commonName: { 'zh-TW': '造礁珊瑚', en: 'Stony coral' },
        category: 'marine',
        assetType: 'digital_twin',
        collectionId: 'col-demo-marine',
        collectionName: { 'zh-TW': '海洋標本歸檔', en: 'Marine specimen archive' },
        specimenId: 'MC-SPEC-M-002',
        images: [{ url: imgUrl(5), alt: { 'zh-TW': '珊瑚生態', en: 'Coral habitat' }, credit: 'Local project asset' }],
        listing: { status: 'not_listed', price: 0, currency: 'Ref.', demoOnly: true, listingType: 'none' },
        verification: { status: 'research_linked', verifiedBy: 'Coastal Research Lab (demo)', verifiedAt: '2025-11-20', notes: '' },
        taxonomy: {
          kingdom: 'Animalia',
          phylum: 'Cnidaria',
          className: 'Anthozoa',
          order: 'Scleractinia',
          family: 'Acroporidae',
          genus: 'Acropora',
          species: '',
          iucnStatus: 'VU'
        },
        collectionData: {
          country: 'TW',
          locality: '墾丁外海',
          latitude: 21.95,
          longitude: 120.75,
          elevation: '',
          collector: 'L. Ocean',
          collectedDate: '2023-08-20',
          institution: 'Coastal Research Lab (demo)',
          department: { 'zh-TW': '海洋生物', en: 'Marine biology' },
          preparationMethod: { 'zh-TW': '影像掃描、量測', en: 'Imaging & measurement' },
          preservationMethod: { 'zh-TW': '數位孿生', en: 'Digital twin' }
        },
        provenance: [
          { id: 'p1', date: '2023-08-20', type: 'field_collection', actor: 'Survey team', institution: '', location: 'Marine', description: { 'zh-TW': '水下生態掃描。', en: 'Underwater survey.' }, evidenceUrl: '', verified: true },
          { id: 'p2', date: '2025-11-20', type: 'verification', actor: 'PI Review', institution: 'Coastal Research Lab', location: '', description: { 'zh-TW': '與研究計畫連結。', en: 'Linked to research programme.' }, evidenceUrl: '', verified: true }
        ],
        custody: [
          { id: 'c1', from: 'Field team', to: 'Coastal Research Lab', role: { 'zh-TW': '機構保管', en: 'Institutional custody' }, date: '2023-09-01', proofUrl: '', notes: { 'zh-TW': '', en: '' } }
        ],
        documents: [],
        conservation: { linked: true, allocationRate: 0.5, description: { 'zh-TW': '與棲地保育敘事連動（示範）。', en: 'Habitat narrative (demo).' } },
        visibility: 'public',
        featured: true,
        provCount: 2,
        createdAt: '2023-09-01',
        updatedAt: '2026-01-10'
      },
      {
        id: 'sat-asset-003',
        satId: 'SAT-000003',
        title: { 'zh-TW': '維管束植物臘葉標本', en: 'Vascular plant herbarium sheet' },
        subtitle: { 'zh-TW': '採集、押製與館藏欄位結構化', en: 'Structured fields for date, locality, and preservation' },
        scientificName: 'Quercus sp.',
        commonName: { 'zh-TW': '櫟屬', en: 'Oak' },
        category: 'plant',
        assetType: 'herbarium_digital_twin',
        collectionId: 'col-demo-herbarium',
        collectionName: { 'zh-TW': '臘葉數位孿生庫', en: 'Herbarium digital twin' },
        specimenId: 'MC-SPEC-PL-003',
        images: [{ url: imgUrl(14), alt: { 'zh-TW': '植物標本', en: 'Herbarium sheet' }, credit: 'Local project asset' }],
        listing: { status: 'listed', price: 12, currency: 'Ref.', demoOnly: true, listingType: 'fixed_price' },
        verification: { status: 'institution_verified', verifiedBy: 'Herbarium Curator (demo)', verifiedAt: '2024-10-10', notes: '' },
        taxonomy: {
          kingdom: 'Plantae',
          phylum: 'Tracheophyta',
          className: 'Magnoliopsida',
          order: 'Fagales',
          family: 'Fagaceae',
          genus: 'Quercus',
          species: '',
          iucnStatus: 'LC'
        },
        collectionData: {
          country: 'TW',
          locality: 'Alishan',
          latitude: 23.5,
          longitude: 120.8,
          elevation: '1600m',
          collector: 'H. Field',
          collectedDate: '2022-04-10',
          institution: 'Demo Herbarium',
          department: { 'zh-TW': '植物分類', en: 'Botany' },
          preparationMethod: { 'zh-TW': '押製、上臘葉紙', en: 'Pressed' },
          preservationMethod: { 'zh-TW': '乾式典藏', en: 'Dry storage' }
        },
        provenance: [
          { id: 'p1', date: '2022-04-10', type: 'field_collection', actor: 'H. Field', institution: '', location: 'TW', description: { 'zh-TW': '採集與初鑑。', en: 'Collection and ID.' }, evidenceUrl: '', verified: true },
          { id: 'p2', date: '2022-05-15', type: 'preparation', actor: 'Prep team', institution: 'Demo Herbarium', location: '', description: { 'zh-TW': '壓制與乾燥完成。', en: 'Pressing completed.' }, evidenceUrl: '', verified: true }
        ],
        custody: [
          { id: 'c1', from: 'Donor', to: 'Demo Herbarium', role: { 'zh-TW': '典藏', en: 'Holding' }, date: '2022-05-20', proofUrl: '', notes: { 'zh-TW': '', en: '' } }
        ],
        documents: [{ id: 'd1', type: 'publication', title: 'CoL', url: 'https://www.catalogueoflife.org', doi: '', notes: 'Checklist' }],
        conservation: { linked: true, allocationRate: 0.5, description: { 'zh-TW': '植林敘事與標本敘事可分開審校（示範）。', en: 'Narrative layers (demo).' } },
        visibility: 'public',
        featured: true,
        provCount: 2,
        createdAt: '2022-05-20',
        updatedAt: '2025-12-01'
      },
      {
        id: 'sat-asset-004',
        satId: 'SAT-000004',
        title: { 'zh-TW': '菊石化石岩板', en: 'Ammonite fossil plate' },
        subtitle: { 'zh-TW': '地層脈絡與修復履歷（示範：待審核）', en: 'Stratigraphic context and prep record (provenance pending)' },
        scientificName: 'Perisphinctes sp.',
        commonName: { 'zh-TW': '菊石', en: 'Ammonite' },
        category: 'fossil',
        assetType: 'provenance_record',
        collectionId: 'col-demo-paleo',
        collectionName: { 'zh-TW': '化石與地層示範庫', en: 'Fossil & stratigraphy (demo)' },
        specimenId: 'MC-SPEC-FO-004',
        images: [{ url: imgUrl(13), alt: { 'zh-TW': '菊石化石', en: 'Ammonite fossil' }, credit: 'Local project asset' }],
        listing: { status: 'listed', price: 180, currency: 'Ref.', demoOnly: true, listingType: 'fixed_price' },
        verification: { status: 'unverified', verifiedBy: '', verifiedAt: '', notes: { 'zh-TW': '審查尚未完成。', en: 'Review not completed.' } },
        taxonomy: {
          kingdom: 'Animalia',
          phylum: 'Mollusca',
          className: 'Cephalopoda',
          order: 'Ammonitida',
          family: '',
          genus: 'Perisphinctes',
          species: '',
          iucnStatus: 'EX'
        },
        collectionData: {
          country: 'MA',
          locality: 'Jurassic outcrop (demo label)',
          latitude: null,
          longitude: null,
          elevation: '',
          collector: 'M. Geology',
          collectedDate: '2015-11-22',
          institution: 'Museum of Earth (demo)',
          department: { 'zh-TW': '古生物', en: 'Palaeontology' },
          preparationMethod: { 'zh-TW': '清修、加固', en: 'Preparation' },
          preservationMethod: { 'zh-TW': '控濕櫥', en: 'Controlled humidity' }
        },
        provenance: [
          { id: 'p1', date: '2015-11-22', type: 'field_collection', actor: 'Field party', institution: '', location: 'MA', description: { 'zh-TW': '野外登錄。', en: 'Field entry.' }, evidenceUrl: '', verified: false }
        ],
        custody: [
          { id: 'c1', from: 'Dealer (demo)', to: 'Museum of Earth (demo)', role: { 'zh-TW': '入藏', en: 'Accession' }, date: '2016-01-10', proofUrl: '', notes: { 'zh-TW': '符合機構採購 SOP 之示範敘事。', en: 'Narrative per institutional SOP (demo).' } }
        ],
        documents: [],
        conservation: { linked: false, allocationRate: 0.5, description: { 'zh-TW': '', en: '' } },
        visibility: 'public',
        featured: true,
        provCount: 1,
        createdAt: '2016-01-10',
        updatedAt: '2026-02-28'
      },
      {
        id: 'sat-asset-005',
        satId: 'SAT-000005',
        title: { 'zh-TW': '微生物參考紀錄', en: 'Microbiology reference record' },
        subtitle: { 'zh-TW': '參考株與觀測敘事（研究連結）', en: 'Strain / observation narrative with research link' },
        scientificName: 'Bacillus subtilis (ref)',
        commonName: { 'zh-TW': '參考株', en: 'Reference strain' },
        category: 'microbiology',
        assetType: 'research_certificate',
        collectionId: 'col-demo-micro',
        collectionName: { 'zh-TW': '微生物參考庫', en: 'Microbiology reference' },
        specimenId: 'MC-SPEC-MB-005',
        images: [{ url: imgUrl(16), alt: { 'zh-TW': '顯微影像', en: 'Microscopy' }, credit: 'Local project asset' }],
        listing: { status: 'not_listed', price: 0, currency: 'Ref.', demoOnly: true, listingType: 'none' },
        verification: { status: 'research_linked', verifiedBy: 'Micro Ref Lab (demo)', verifiedAt: '2025-01-10', notes: '' },
        taxonomy: {
          kingdom: 'Bacteria',
          phylum: 'Bacillota',
          className: 'Bacilli',
          order: 'Bacillales',
          family: 'Bacillaceae',
          genus: 'Bacillus',
          species: 'subtilis',
          iucnStatus: 'NE'
        },
        collectionData: {
          country: 'TW',
          locality: 'Lab A',
          latitude: null,
          longitude: null,
          elevation: '',
          collector: 'Lab registry',
          collectedDate: '2021-03-01',
          institution: 'Micro Ref Lab (demo)',
          department: { 'zh-TW': '微生物', en: 'Microbiology' },
          preparationMethod: { 'zh-TW': '培養、保存株', en: 'Culture' },
          preservationMethod: { 'zh-TW': '超低溫/凍乾（示範欄位）', en: 'Cold storage' }
        },
        provenance: [
          { id: 'p1', date: '2021-03-01', type: 'cataloguing', actor: 'Ref curator', institution: 'Micro Ref Lab', location: '', description: { 'zh-TW': '菌株歸戶。', en: 'Strain registration.' }, evidenceUrl: '', verified: true },
          { id: 'p2', date: '2025-01-10', type: 'publication_linked', actor: 'PI', institution: 'University (demo)', location: '', description: { 'zh-TW': '與實驗室資料集連結。', en: 'Linked to lab dataset.' }, evidenceUrl: '', verified: true }
        ],
        custody: [
          { id: 'c1', from: 'ATCC (demo ref)', to: 'Micro Ref Lab', role: { 'zh-TW': '參考保管', en: 'Reference holding' }, date: '2021-03-15', proofUrl: '', notes: { 'zh-TW': '', en: '' } }
        ],
        documents: [{ id: 'd1', type: 'publication', title: 'DOI (demo)', url: 'https://doi.org/10.1000/182', doi: '10.1000/182', notes: 'Placeholder' }],
        conservation: { linked: true, allocationRate: 0.5, description: { 'zh-TW': '實驗廢棄與生安依機構 SOP。', en: 'Biosafety per institutional SOP (demo).' } },
        visibility: 'public',
        featured: true,
        provCount: 2,
        createdAt: '2021-03-15',
        updatedAt: '2026-03-01'
      }
    ];
  }

  function mergeAssetLists(defList, ovr) {
    if (!ovr || !Array.isArray(ovr.assets) || !ovr.assets.length) return defList;
    var byId = {};
    defList.forEach(function (a) {
      byId[a.id] = a;
    });
    ovr.assets.forEach(function (a) {
      if (a && a.id) byId[a.id] = Object.assign({}, byId[a.id] || {}, a);
    });
    return Object.keys(byId).map(function (k) {
      return byId[k];
    });
  }

  function getAssetsFromState(appState) {
    var s = (appState && appState.settings) || {};
    var ovr = parseJson(s.satMarketplacePublishedJson) || parseJson(s.satMarketplaceJson);
    return mergeAssetLists(getDefaultAssets(), ovr);
  }

  function esc(s, fn) {
    s = s == null ? '' : String(s);
    if (fn) return fn(s);
    return global.escapeHtml ? global.escapeHtml(s) : s;
  }

  function fmtPrice(listing) {
    if (!listing) return '—';
    if (listing.status === 'not_listed' || listing.status === 'archived') {
      return '—';
    }
    if (!listing.price && listing.price !== 0) return '—';
    return listing.price + ' ' + (listing.currency || '');
  }

  function verificationPill(t, key) {
    var m = {
      unverified: { k: 'sat_v_unverified', c: 'sat-pill--muted' },
      community_reviewed: { k: 'sat_v_comm', c: 'sat-pill--sub' },
      curator_verified: { k: 'sat_v_curator', c: 'sat-pill--ok' },
      institution_verified: { k: 'sat_v_inst', c: 'sat-pill--ok' },
      research_linked: { k: 'sat_v_research', c: 'sat-pill--info' },
      type_material_candidate: { k: 'sat_v_type', c: 'sat-pill--sub' }
    };
    var x = m[key] || m.unverified;
    return '<span class="sat-pill ' + x.c + '">' + esc(t(x.k), global.escapeHtml) + '</span>';
  }

  function matchSearch(a, q, lang) {
    if (!q) return true;
    var s = q
      .toLowerCase()
      .trim();
    var blob = [
      a.satId,
      pick(a.title, lang),
      a.scientificName,
      pick(a.commonName, lang),
      a.category,
      pick(a.collectionName, lang),
      pick((a.collectionData && a.collectionData.institution) || '', lang),
      a.specimenId,
      JSON.stringify(a.provenance || [])
    ]
      .join(' ')
      .toLowerCase();
    return blob.indexOf(s) !== -1;
  }

  function passFilters(a) {
    var f = _ui.filters;
    if (f.category && a.category !== f.category) return false;
    if (f.assetType && a.assetType !== f.assetType) return false;
    if (f.verification && a.verification && a.verification.status !== f.verification) return false;
    if (f.listingStatus && a.listing && a.listing.status !== f.listingStatus) return false;
    if (f.hasProvenance && (!a.provenance || !a.provenance.length)) return false;
    if (f.conservation && !a.conservation) return false;
    if (f.conservation && a.conservation && !a.conservation.linked) return false;
    return true;
  }

  function sortAssets(arr, how) {
    var out = arr.slice();
    if (how === 'price_asc') {
      out.sort(function (a, b) {
        return (a.listing && a.listing.price) - (b.listing && b.listing.price);
      });
    } else if (how === 'price_desc') {
      out.sort(function (a, b) {
        return (b.listing && b.listing.price) - (a.listing && a.listing.price);
      });
    } else if (how === 'name') {
      out.sort(function (a, b) {
        return (a.satId || '').localeCompare(b.satId || '');
      });
    } else {
      out.sort(function (a, b) {
        return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
      });
    }
    return out;
  }

  function renderProvenance(a, t, lang) {
    var rows = (a.provenance || [])
      .map(function (e) {
        return (
          '<li class="sat-tl-item">' +
          '<div class="sat-tl-dot" aria-hidden="true"></div>' +
          '<div class="sat-tl-body">' +
          '<div class="sat-tl-date">' +
          esc(e.date, global.escapeHtml) +
          '</div>' +
          '<div class="sat-tl-title">' +
          esc(
            (function () {
              var k = 'sat_timeline_' + (e.type || 'other');
              var v = t(k);
              return v === k ? t('sat_timeline_other') : v;
            })(),
            global.escapeHtml
          ) +
          (e.verified
            ? ' <span class="sat-badge-verified">' + esc(t('sat_verified'), global.escapeHtml) + '</span>'
            : ' <span class="sat-badge-pending">' + esc(t('sat_pending'), global.escapeHtml) + '</span>') +
          '</div>' +
          '<div class="sat-tl-desc">' +
          esc(typeof e.description === 'object' ? pick(e.description, lang) : e.description, global.escapeHtml) +
          '</div>' +
          (e.institution
            ? '<div class="sat-tl-sub">' + esc(e.institution, global.escapeHtml) + ' · ' + esc(e.actor, global.escapeHtml) + '</div>'
            : '') +
          (e.evidenceUrl
            ? '<a class="sat-tl-link" href="' + esc(e.evidenceUrl, global.escapeHtmlAttr) + '" rel="noreferrer" target="_blank">Evidence</a>'
            : '') +
          '</div></li>'
        );
      })
      .join('');
    return '<ol class="sat-timeline">' + rows + '</ol>';
  }

  function renderMetadataTable(a, t, lang) {
    var cd = a.collectionData || {};
    var tax = a.taxonomy || {};
    var rows = [
      ['sat_meta_sat', a.satId],
      ['sat_meta_specimen', a.specimenId],
      ['specimen_name', pick(a.title, lang)],
      ['specimen_name_scientific', a.scientificName],
      ['sat_meta_common', pick(a.commonName, lang)],
      ['sat_meta_kingdom', tax.kingdom],
      ['sat_meta_phylum', tax.phylum],
      ['sat_meta_class', tax.className],
      ['sat_meta_order', tax.order],
      ['sat_meta_family', tax.family],
      ['sat_meta_genus', tax.genus],
      ['sat_meta_species', tax.species],
      ['iucn_status', tax.iucnStatus || '—'],
      ['field_date', cd.collectedDate || '—'],
      ['field_collector', cd.collector || '—'],
      ['country', cd.country || '—'],
      ['field_locality', pick(cd.locality, lang) || cd.locality || '—'],
      ['map_lat', cd.latitude != null ? String(cd.latitude) : '—'],
      ['map_lng', cd.longitude != null ? String(cd.longitude) : '—'],
      ['elevation', cd.elevation != null && cd.elevation !== '' ? String(cd.elevation) : '—'],
      ['sat_meta_inst', cd.institution || '—'],
      ['sat_meta_dept', pick(cd.department, lang) || '—'],
      ['sat_meta_prep', pick(cd.preparationMethod, lang) || '—'],
      ['sat_meta_pres', pick(cd.preservationMethod, lang) || '—']
    ];
    return (
      '<div class="sat-meta-grid">' +
      rows
        .map(function (r) {
          return (
            '<div class="sat-meta-row"><span class="sat-meta-k">' + esc(t(r[0]), global.escapeHtml) + '</span><span class="sat-meta-v">' + esc(r[1], global.escapeHtml) + '</span></div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderCustody(a, t, lang) {
    var list = a.custody || [];
    if (!list.length) {
      return '<p class="sat-empty">' + esc(t('sat_custody_empty'), global.escapeHtml) + '</p>';
    }
    return (
      '<ul class="sat-custody-list">' +
      list
        .map(function (c) {
          return (
            '<li class="sat-custody-item"><strong>' + esc(t('sat_custody_transfer'), global.escapeHtml) + '</strong> ' + esc(c.date, global.escapeHtml) +
            '<br/><span class="sat-muted">' + esc(c.from, global.escapeHtml) + ' → ' + esc(c.to, global.escapeHtml) + ' · ' + esc(typeof c.role === 'object' ? pick(c.role, lang) : c.role, global.escapeHtml) + '</span><p class="sat-custody-note">' + esc(typeof c.notes === 'object' ? pick(c.notes, lang) : c.notes, global.escapeHtml) + '</p></li>'
          );
        })
        .join('') +
      '</ul><p class="sat-legal-tiny">' + esc(t('sat_disclaimer_custody_block'), global.escapeHtml) + '</p>'
    );
  }

  function cardHtml(a, t, lang, isSimple) {
    var im = (a.images && a.images[0] && a.images[0].url) || imgUrl(12);
    var list = a.listing || {};
    var priceLabel = list.status === 'not_listed' ? t('sat_not_listed') : fmtPrice(list);
    return (
      '<article class="sat-asset-card' +
      (isSimple ? ' sat-asset-card--simple' : '') +
      '">' +
      '<div class="sat-asset-card__media">' +
      '<img src="' + esc(im, global.escapeHtmlAttr) + '" alt="" loading="lazy" />' +
      '<div class="sat-asset-card__chips"><span class="sat-chip sat-chip--id">' + esc(a.satId, global.escapeHtml) + '</span></div>' +
      verificationPill(t, a.verification && a.verification.status) +
      '</div>' +
      '<div class="sat-asset-card__body">' +
      '<h4 class="sat-asset-card__title">' + esc(pick(a.title, lang), global.escapeHtml) + '</h4>' +
      '<div class="sat-asset-card__sci">' + esc(a.scientificName, global.escapeHtml) + '</div>' +
      '<div class="sat-asset-card__row"><span class="sat-muted">' + esc(a.category, global.escapeHtml) + '</span><span class="sat-price">' + esc(priceLabel, global.escapeHtml) + '</span></div>' +
      '<div class="sat-asset-card__inst sat-muted">' + esc(pick(a.collectionName, lang), global.escapeHtml) + ' · ' + esc(cdInst(a, lang), global.escapeHtml) + '</div>' +
      '<div class="sat-asset-card__row sat-muted" style="font-size:12px;">' + esc(t('sat_prov_n'), global.escapeHtml).replace('{n}', String((a.provenance && a.provenance.length) || 0)) + '</div>' +
      '<div class="sat-asset-card__actions">' +
      '<button type="button" class="small-btn soft" data-sat-action="view" data-sat-id="' + esc(a.id, global.escapeHtmlAttr) + '">' + esc(t('sat_btn_view'), global.escapeHtml) + '</button>' +
      (isSimple
        ? ''
        : '<button type="button" class="small-btn soft" data-sat-action="fav" data-sat-id="' + esc(a.id, global.escapeHtmlAttr) + '">' + esc(t('sat_btn_watchlist'), global.escapeHtml) + '</button>') +
      (!isSimple
        ? '<button type="button" class="primary-btn" data-sat-action="demo" data-sat-id="' + esc(a.id, global.escapeHtmlAttr) + '">' + esc(t('sat_btn_demo_tx'), global.escapeHtml) + '</button>'
        : '') +
      '</div></div></article>'
    );
  }

  function cdInst(a, lang) {
    var cd = a.collectionData;
    if (!cd) return '';
    return cd.country || '';
  }

  function getAssetById(assets, id) {
    return assets.find(function (x) {
      return x.id === id;
    });
  }

  function renderSimplified(assets, ctx) {
    var t = ctx.t;
    var lang = ctx.lang;
    var featured = assets.filter(function (a) {
      return a.featured;
    }).slice(0, 3);
    if (!featured.length) featured = assets.slice(0, 3);
    return (
      '<div class="sat-simple">' +
      '<header class="sat-hero sat-hero--simple">' +
      '<div class="sat-hero__text">' +
      '<p class="sat-hero__eyebrow">' + esc(t('sat_hero_eyebrow'), global.escapeHtml) + '</p>' +
      '<h2 class="sat-hero__title">' + esc(t('sat_marketplace_hero_title'), global.escapeHtml) + '</h2>' +
      '<p class="sat-hero__desc">' + esc(t('sat_simple_intro'), global.escapeHtml) + '</p>' +
      '<div class="sat-hero__cta">' +
      '<button type="button" class="primary-btn" data-sat-goto="explore">' + esc(t('sat_cta_explore'), global.escapeHtml) + '</button>' +
      '<button type="button" class="soft-btn" data-sat-open="guide">' + esc(t('sat_btn_guide'), global.escapeHtml) + '</button>' +
      '</div></div></header>' +
      '<section class="sat-simple-grid">' +
      featured
        .map(function (a) {
          return cardHtml(a, t, lang, true);
        })
        .join('') +
      '</section><p class="sat-simple-foot sat-muted">' + esc(t('sat_simple_foot'), global.escapeHtml) + '</p></div>'
    );
  }

  function renderFilterSidebar(t) {
    var f = _ui.filters;
    var catMap = { insect: 'sat_cat_insect', plant: 'sat_cat_plant', fossil: 'sat_cat_fossil', marine: 'sat_cat_marine', microbiology: 'sat_cat_micro' };
    var vMap = {
      unverified: 'sat_v_unverified',
      curator_verified: 'sat_v_curator',
      institution_verified: 'sat_v_inst',
      research_linked: 'sat_v_research'
    };
    var lMap = { not_listed: 'sat_l_not_listed', listed: 'sat_l_listed' };
    return (
      '<div class="sat-filters" id="satFilterPanel">' +
      '<label class="sat-filt-label">' + esc(t('sat_f_search'), global.escapeHtml) + '</label>' +
      '<input type="search" class="input" id="satFilterSearch" value="' + esc(_ui.q, global.escapeHtmlAttr) + '" placeholder="' + esc(t('sat_f_search_ph'), global.escapeHtmlAttr) + '"/>' +
      '<label class="sat-filt-label">' + esc(t('sat_f_category'), global.escapeHtml) + '</label>' +
      '<select class="input" id="satF_cat"><option value="">' + esc(t('sat_f_all'), global.escapeHtml) + '</option>' +
      Object.keys(catMap)
        .map(function (k) {
          return (
            '<option value="' + esc(k, global.escapeHtmlAttr) + '"' + (f.category === k ? ' selected' : '') + '>' + esc(t(catMap[k]), global.escapeHtml) + '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<label class="sat-filt-label">' + esc(t('sat_f_verification'), global.escapeHtml) + '</label>' +
      '<select class="input" id="satF_ver"><option value="">' + esc(t('sat_f_all'), global.escapeHtml) + '</option>' +
      Object.keys(vMap)
        .map(function (k) {
          return (
            '<option value="' + esc(k, global.escapeHtmlAttr) + '"' + (f.verification === k ? ' selected' : '') + '>' + esc(t(vMap[k]), global.escapeHtml) + '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<label class="sat-filt-label">' + esc(t('sat_f_listing'), global.escapeHtml) + '</label>' +
      '<select class="input" id="satF_list"><option value="">' + esc(t('sat_f_all'), global.escapeHtml) + '</option>' +
      Object.keys(lMap)
        .map(function (k) {
          return (
            '<option value="' + esc(k, global.escapeHtmlAttr) + '"' + (f.listingStatus === k ? ' selected' : '') + '>' + esc(t(lMap[k]), global.escapeHtml) + '</option>'
          );
        })
        .join('') +
      '</select>' +
      '<label class="sat-check"><input type="checkbox" id="satF_prov" ' + (f.hasProvenance ? 'checked' : '') + '/> ' + esc(t('sat_f_provenance'), global.escapeHtml) + '</label>' +
      '<label class="sat-check"><input type="checkbox" id="satF_con" ' + (f.conservation ? 'checked' : '') + '/> ' + esc(t('sat_f_conservation'), global.escapeHtml) + '</label>' +
      '<button type="button" class="soft-btn sat-filt-reset" id="satF_reset">' + esc(t('sat_f_reset'), global.escapeHtml) + '</button></div>'
    );
  }

  function renderDetail(a, ctx) {
    var t = ctx.t;
    var lang = ctx.lang;
    var tab = _ui.detailTab || 'overview';
    var tabs = [
      { id: 'overview', k: 'sat_tab_overview' },
      { id: 'metadata', k: 'sat_tab_metadata' },
      { id: 'provenance', k: 'sat_tab_provenance' },
      { id: 'custody', k: 'sat_tab_custody' }
    ];
    var im = (a.images && a.images[0] && a.images[0].url) || imgUrl(12);
    var list = a.listing || {};
    return (
      '<div class="sat-detail">' +
      '<div class="sat-detail__back"><button type="button" class="soft-btn" data-sat-back="1">← ' + esc(t('sat_back_explore'), global.escapeHtml) + '</button></div>' +
      '<div class="sat-detail__grid">' +
      '<div class="sat-detail__media card panel sat-glass"><img src="' + esc(im, global.escapeHtmlAttr) + '" alt=""/></div>' +
      '<div class="sat-detail__main">' +
      '<div class="sat-detail__head">' +
      '<span class="sat-chip sat-chip--id">' + esc(a.satId, global.escapeHtml) + '</span>' + verificationPill(t, a.verification && a.verification.status) +
      '<h2 class="sat-detail__title">' + esc(pick(a.title, lang), global.escapeHtml) + '</h2>' +
      '<p class="sat-detail__sci">' + esc(a.scientificName, global.escapeHtml) + ' · ' + esc(pick(a.subtitle, lang), global.escapeHtml) + '</p>' +
      '<div class="sat-detail__price-row"><span class="sat-detail__price">' + (list.status === 'not_listed' ? esc(t('sat_not_listed'), global.escapeHtml) : esc(fmtPrice(list), global.escapeHtml)) + '</span>' + (list.demoOnly ? ' <span class="sat-pill sat-pill--demo">' + esc(t('sat_demo_pill'), global.escapeHtml) + '</span>' : '') + '</div>' +
      '<p class="sat-legal-tiny">' + esc(t('sat_disclaimer_price'), global.escapeHtml) + '</p>' +
      '<div class="sat-detail__actions">' +
      '<button type="button" class="primary-btn" data-sat-action="demo" data-sat-id="' + esc(a.id, global.escapeHtmlAttr) + '">' + esc(t('sat_btn_demo_tx'), global.escapeHtml) + '</button>' +
      '<button type="button" class="soft-btn" data-sat-action="watch" data-sat-id="' + esc(a.id, global.escapeHtmlAttr) + '">' + esc(t('sat_btn_watchlist'), global.escapeHtml) + '</button>' +
      '<button type="button" class="soft-btn" data-sat-open="guide">' + esc(t('sat_read_guide'), global.escapeHtml) + '</button></div></div></div></div>' +
      '<div class="sat-tabs">' +
      tabs
        .map(function (x) {
          return (
            '<button type="button" class="sat-tab' + (tab === x.id ? ' is-active' : '') + '" data-sat-tab="' + x.id + '">' + esc(t(x.k), global.escapeHtml) + '</button>'
          );
        })
        .join('') +
      '</div><div class="sat-tab-panels card panel sat-glass">' +
      (tab === 'overview'
        ? '<div class="sat-prose"><p><strong>' + esc(t('sat_field_collection'), global.escapeHtml) + '</strong> ' + esc(pick(a.collectionData && a.collectionData.locality, lang) || '—', global.escapeHtml) + '</p><p class="sat-muted">' + esc(t('sat_field_conservation'), global.escapeHtml) + '</p><p>' + esc(pick((a.conservation && a.conservation.description) || {}, lang), global.escapeHtml) + '</p></div>'
        : tab === 'metadata'
        ? renderMetadataTable(a, t, lang)
        : tab === 'provenance'
        ? renderProvenance(a, t, lang)
        : renderCustody(a, t, lang)) +
      '</div></div>'
    );
  }

  function renderExplore(assets, ctx) {
    var t = ctx.t;
    var lang = ctx.lang;
    var fil = assets.filter(function (a) {
      return matchSearch(a, _ui.q, lang) && passFilters(a);
    });
    var sorted = sortAssets(fil, _ui.sort);
    var n = sorted.length;
    return (
      '<div class="sat-pro">' +
      renderHero(t, ctx) +
      '<div class="sat-pro__layout">' +
      '<aside class="sat-pro__side">' + renderFilterSidebar(t) + '</aside>' +
      '<div class="sat-pro__main">' +
      '<div class="sat-toolbar">' +
      '<span class="sat-toolbar__count">' + esc(t('sat_results_n'), global.escapeHtml).replace('{n}', String(n)) + '</span>' +
      '<div class="sat-toolbar__right">' +
      '<label class="sr-only" for="satSortSel">' + esc(t('sat_sort'), global.escapeHtml) + '</label>' +
      '<select class="input" id="satSortSel" style="max-width:200px;">' +
      [
        { v: 'newest', k: 'sat_sort_newest' },
        { v: 'price_asc', k: 'sat_sort_price_asc' },
        { v: 'price_desc', k: 'sat_sort_price_desc' },
        { v: 'name', k: 'sat_sort_name' }
      ]
        .map(function (o) {
          return '<option value="' + o.v + '"' + (_ui.sort === o.v ? ' selected' : '') + '>' + esc(t(o.k), global.escapeHtml) + '</option>';
        })
        .join('') +
      '</select>' +
      '<button type="button" class="soft-btn" id="satFilterToggle" aria-expanded="false">' + esc(t('sat_filters'), global.escapeHtml) + '</button></div></div>' +
      (n
        ? '<div class="sat-asset-grid">' +
          sorted
            .map(function (a) {
              return cardHtml(a, t, lang, false);
            })
            .join('') +
          '</div>'
        : '<div class="sat-empty-state"><p>' + esc(t('sat_no_results'), global.escapeHtml) + '</p><button type="button" class="soft-btn" id="satEmptyReset">' + esc(t('sat_f_reset'), global.escapeHtml) + '</button></div>') +
      '</div></div></div>'
    );
  }

  function renderHero(t, ctx) {
    return (
      '<header class="sat-hero sat-hero--pro">' +
      '<div class="sat-hero__inner">' +
      '<div class="sat-hero__kicker">' + esc(t('sat_hero_badge'), global.escapeHtml) + '</div>' +
      '<h2 class="sat-hero__title">' + esc(t('sat_marketplace_hero_title'), global.escapeHtml) + '</h2>' +
      '<p class="sat-hero__deck">' + esc(t('sat_hero_deck'), global.escapeHtml) + '</p>' +
      '<div class="sat-hero__chips">' +
      [
        'sat_chip_prov',
        'sat_chip_museum',
        'sat_chip_conserv',
        'sat_chip_demo',
        'sat_chip_nfa'
      ]
        .map(function (k) {
          return '<span class="sat-hero-chip">' + esc(t(k), global.escapeHtml) + '</span>';
        })
        .join('') +
      '</div><div class="sat-hero__statbar">' + renderStats(ctx) + '</div><div class="sat-hero__cta">' + ctx.heroCta() + '</div></div></header>'
    );
  }

  function renderStats(ctx) {
    var t = ctx.t;
    var assets = ctx.assets;
    var n = assets.length;
    var ver = assets.filter(function (a) {
      return a.verification && a.verification.status && a.verification.status !== 'unverified';
    }).length;
    var col = 4;
    var con = 50;
    return (
      '<div class="sat-stat"><span class="sat-stat__v">' + n + '</span><span class="sat-stat__k">' + esc(t('sat_stat_assets'), global.escapeHtml) + '</span></div>' +
      '<div class="sat-stat"><span class="sat-stat__v">' + ver + '</span><span class="sat-stat__k">' + esc(t('sat_stat_verified'), global.escapeHtml) + '</span></div>' +
      '<div class="sat-stat"><span class="sat-stat__v">' + col + '</span><span class="sat-stat__k">' + esc(t('sat_stat_collections'), global.escapeHtml) + '</span></div>' +
      '<div class="sat-stat"><span class="sat-stat__v">' + con + '%</span><span class="sat-stat__k">' + esc(t('sat_stat_fund'), global.escapeHtml) + '</span></div>'
    );
  }

  var _ctx = null;

  function mount(root, ctx) {
    _ctx = ctx;
    var appState = ctx.state || global.state;
    if (!appState) return;
    var lang = appState.lang || 'zh-TW';
    var t = ctx.t;
    var assets = getAssetsFromState(appState);
    ctx.lang = lang;
    ctx.t = t;
    ctx.assets = assets;
    var exp = typeof ctx.getUiExperience === 'function' ? ctx.getUiExperience() : 'simple';
    var isPro = exp === 'pro';

    ctx.heroCta = function () {
      if (ctx.isAdminSession && ctx.isAdminSession()) {
        return (
          '<button type="button" class="soft-btn" data-sat-open="guide">' + esc(t('sat_read_guide'), global.escapeHtml) + '</button>' +
          '<button type="button" class="soft-btn" data-sat-admin-hint="1">' + esc(t('sat_cta_admin_studio'), global.escapeHtml) + '</button>'
        );
      }
      return '<button type="button" class="primary-btn" data-sat-open="guide">' + esc(t('sat_read_guide'), global.escapeHtml) + '</button>';
    };

    if (!isPro) {
      root.className = 'sat-root sat-root--simple';
      _ui.view = 'explore';
      _ui.assetId = null;
      root.innerHTML = renderSimplified(assets, ctx);
      wire(root, ctx, assets, true);
      return;
    }

    root.className = 'sat-root sat-root--pro';
    if (_ui.view === 'asset' && _ui.assetId) {
      var a = getAssetById(assets, _ui.assetId);
      if (a) {
        root.innerHTML = renderDetail(a, ctx);
        wireDetail(root, ctx, assets, a);
        return;
      }
    }
    _ui.view = 'explore';
    _ui.assetId = null;
    root.innerHTML = renderExplore(assets, ctx);
    wire(root, ctx, assets, false);
  }

  function wireDetail(root, ctx, assets) {
    root.querySelectorAll('[data-sat-back]').forEach(function (b) {
      b.onclick = function () {
        _ui.view = 'explore';
        _ui.assetId = null;
        mount(root, ctx);
      };
    });
    root.querySelectorAll('[data-sat-tab]').forEach(function (b) {
      b.onclick = function () {
        _ui.detailTab = b.getAttribute('data-sat-tab') || 'overview';
        mount(root, ctx);
      };
    });
    root.querySelectorAll('[data-sat-open="guide"]').forEach(function (b) {
      b.onclick = function () { openGuideModal(); };
    });
    root.querySelectorAll('[data-sat-action="demo"]').forEach(function (b) {
      b.onclick = function () { openSatListingById(b.getAttribute('data-sat-id')); };
    });
    root.querySelectorAll('[data-sat-action="watch"]').forEach(function (b) {
      b.onclick = function () {
        if (ctx.toast) ctx.toast(ctx.t('sat_watchlist_toast'));
      };
    });
  }

  function wire(root, ctx, assets, isSimple) {
    root.querySelectorAll('[data-sat-goto="explore"]').forEach(function (b) {
      b.onclick = function () {
        if (isSimple) {
          if (typeof ctx.getUiExperience === 'function' && global.setUiExperience) {
            global.setUiExperience('pro');
            if (global.toast) global.toast(ctx.t('sat_toast_pro_mode') || 'Pro mode on');
            mount(root, ctx);
          } else {
            if (ctx.toast) ctx.toast(ctx.t('sat_err_pro') || 'Switch to Pro in Settings');
          }
        }
      };
    });
    root.querySelectorAll('[data-sat-open="guide"]').forEach(function (b) {
      b.onclick = function () { openGuideModal(); };
    });
    if (!isSimple) {
      var fs = function () {
        _ui.q = (document.getElementById('satFilterSearch') && document.getElementById('satFilterSearch').value) || '';
        _ui.filters.category = (document.getElementById('satF_cat') && document.getElementById('satF_cat').value) || '';
        _ui.filters.verification = (document.getElementById('satF_ver') && document.getElementById('satF_ver').value) || '';
        _ui.filters.listingStatus = (document.getElementById('satF_list') && document.getElementById('satF_list').value) || '';
        _ui.filters.hasProvenance = !!(document.getElementById('satF_prov') && document.getElementById('satF_prov').checked);
        _ui.filters.conservation = !!(document.getElementById('satF_con') && document.getElementById('satF_con').checked);
        mount(root, ctx);
      };
      var sIn = document.getElementById('satFilterSearch');
      if (sIn) sIn.oninput = function () {
        _ui.q = sIn.value;
        mount(root, ctx);
      };
      ['satF_cat', 'satF_ver', 'satF_list'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.onchange = fs;
      });
      var prov = document.getElementById('satF_prov');
      var con = document.getElementById('satF_con');
      if (prov) prov.onchange = fs;
      if (con) con.onchange = fs;
      var sSel = document.getElementById('satSortSel');
      if (sSel) {
        sSel.onchange = function () {
          _ui.sort = sSel.value;
          mount(root, ctx);
        };
      }
      function doReset() {
        _ui.q = '';
        _ui.filters = { category: '', assetType: '', verification: '', listingStatus: '', hasProvenance: false, conservation: false };
        mount(root, ctx);
      }
      var r = document.getElementById('satF_reset');
      if (r) r.onclick = doReset;
      var er = document.getElementById('satEmptyReset');
      if (er) er.onclick = doReset;
      var ft = document.getElementById('satFilterToggle');
      if (ft) {
        ft.onclick = function () {
          var p = document.getElementById('satFilterPanel');
          if (p) p.classList.toggle('is-open');
        };
      }
    }
    root.querySelectorAll('[data-sat-action="view"]').forEach(function (b) {
      b.onclick = function () {
        _ui.view = 'asset';
        _ui.assetId = b.getAttribute('data-sat-id');
        _ui.detailTab = 'overview';
        mount(root, ctx);
      };
    });
    root.querySelectorAll('[data-sat-action="fav"], [data-sat-action="watch"]').forEach(function (b) {
      b.onclick = function () {
        if (ctx.toast) ctx.toast(ctx.t('sat_watchlist_toast'));
      };
    });
    root.querySelectorAll('[data-sat-action="demo"]').forEach(function (b) {
      b.onclick = function () { openSatListingById(b.getAttribute('data-sat-id')); };
    });
    root.querySelectorAll('[data-sat-admin-hint]').forEach(function (b) {
      b.onclick = function () {
        if (ctx.toast) ctx.toast(ctx.t('sat_admin_round2'));
      };
    });
  }

  function t(k) {
    return _ctx && _ctx.t ? _ctx.t(k) : k;
  }

  function openSatListingById(assetId) {
    var a = getAssetById(_ctx && _ctx.assets ? _ctx.assets : getAssetsFromState(_ctx && _ctx.state), assetId);
    if (!a || !global.openSatExchangeDemo) return;
    global._satTradeBridgeId = a.id;
    global.openSatExchangeDemo(a.id);
  }

  function assetToTradeItem(a) {
    var lang = (_ctx && _ctx.lang) || (global.state && global.state.lang) || 'zh-TW';
    var tfn = _ctx && _ctx.t ? _ctx.t : function (k) { return k; };
    return {
      id: a.id,
      name: pick(a.title, lang) || a.scientificName,
      creator: (a.collectionData && a.collectionData.institution) || tfn('sat_custody_holder'),
      price: a.listing && a.listing.status !== 'not_listed' && fmtPrice(a.listing) ? fmtPrice(a.listing) : tfn('sat_not_listed'),
      description: pick(a.subtitle, lang) || a.scientificName
    };
  }

  function openGuideModal() {
    if (!_ctx) {
      _ctx = { t: global.t, state: global.state, lang: (global.state && global.state.lang) || 'zh-TW' };
    } else {
      _ctx.t = global.t;
      _ctx.state = global.state;
      _ctx.lang = (global.state && global.state.lang) || 'zh-TW';
    }
    var mask = document.getElementById('satGuideMask');
    var body = document.getElementById('satGuideBody');
    if (body) body.innerHTML = buildGuideHtml();
    if (mask) mask.style.display = 'flex';
  }

  function buildGuideHtml() {
    var t = (_ctx && _ctx.t) || global.t;
    return (
      '<section class="sat-guide-sec"><h4>' + esc(t('sat_guide_what'), global.escapeHtml) + '</h4><p class="sat-muted">' + esc(t('sat_guide_what_b'), global.escapeHtml) + '</p></section>' +
      '<section class="sat-guide-sec"><h4>' + esc(t('sat_guide_why'), global.escapeHtml) + '</h4><p class="sat-muted">' + esc(t('sat_guide_why_b'), global.escapeHtml) + '</p></section>' +
      '<section class="sat-guide-sec"><h4>' + esc(t('sat_guide_demo'), global.escapeHtml) + '</h4><p class="sat-muted">' + esc(t('sat_guide_demo_b'), global.escapeHtml) + '</p></section>' +
      '<div class="sat-guide-warn"><strong>' + esc(t('sat_legal_block_title'), global.escapeHtml) + '</strong><p>' + esc(t('sat_legal_block'), global.escapeHtml) + '</p></div>' +
      '<p class="sat-legal-tiny" style="margin-top:10px;">' + esc(t('sat_disclaimer_full'), global.escapeHtml) + '</p>'
    );
  }

  function resolveTradeItem(id) {
    var st = global.state;
    var assets = getAssetsFromState(st);
    if (_ctx && _ctx.assets && _ctx.assets.length) assets = _ctx.assets;
    var a = getAssetById(assets, id);
    if (a) return assetToTradeItem(a);
    return null;
  }

  global.SatMarketplace = {
    mount: mount,
    openGuideModal: openGuideModal,
    getAssetsFromState: getAssetsFromState,
    resolveTradeItem: resolveTradeItem,
    getUi: function () {
      return _ui;
    },
    resetUi: function () {
      _ui = {
        view: 'explore',
        assetId: null,
        detailTab: 'overview',
        q: '',
        sort: 'newest',
        filters: { category: '', assetType: '', verification: '', listingStatus: '', hasProvenance: false, conservation: false },
        gridCompact: false,
        filtersOpen: false
      };
    }
  };
})(typeof window !== 'undefined' ? window : this);
