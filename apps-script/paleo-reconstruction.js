/**
 * MCurator — Paleo Reconstruction (independent module, Mock Mode default).
 * Scoped UI under #mcPaleoReconstructionRoot in #section-paleo-reconstruction; does not alter Passport specimen state.
 */
(function () {
  'use strict';

  var _prC = (typeof window !== 'undefined' && window.MCPaleoReconstructionCopy) || {};
  function prT(k, fb) {
    if (typeof mcModuleT === 'function') return mcModuleT(_prC, k, fb);
    var p = _prC[k];
    if (p && typeof mcPick === 'function') return mcPick(p) || (fb != null ? fb : k);
    return fb != null ? fb : k;
  }

  var PALEO_API_ENABLED = false;
  var PALEO_MOCK_MODE = true;
  /** Free image URL via Pollinations (no API key; third-party terms apply). */
  var PALEO_POLLINATIONS_ENABLED = true;
  var PALEO_POLLINATIONS_PROMPT_MAX = 1100;
  var PALEO_STORAGE_KEY = 'mcurator_paleo_reconstruction_projects';
  var ROOT_ID = 'mcPaleoReconstructionRoot';

  var defaultPaleoProject = {
    id: '',
    commonName: '',
    scientificName: '',
    geologicalPeriod: '',
    taxonomicGroup: '',
    knownFossilMaterial: '',
    evidenceNotes: '',
    environmentPresetId: 'cambrian_shallow_sea',
    reconstructionMode: '保守學術復原',
    pose: '自然姿勢',
    cameraAngle: '3/4 視角',
    aspectRatio: '16:9',
    references: [],
    generatedPrompt: '',
    negativePrompt: '',
    confidenceScore: 0,
    confidenceLabel: '',
    generatedImageUrl: '',
    lastImageProvider: '',
    paleoApiReports: null,
    createdAt: '',
    updatedAt: ''
  };

  var defaultPaleoReference = {
    id: '',
    name: '',
    type: '化石證據',
    url: '',
    thumbnail: '',
    isPrimary: false
  };

  var PALEO_REFERENCE_TYPES = [
    '化石證據',
    '骨骼參考',
    '論文資料',
    '手繪參考',
    '博物館標本照',
    '環境參考',
    '姿勢參考',
    '其他'
  ];

  var PALEO_ENVIRONMENT_PRESETS = [
    {
      id: 'cambrian_shallow_sea',
      nameZh: '寒武紀淺海',
      nameEn: 'Cambrian Shallow Marine Ecosystem',
      suitableFor: '奇蝦、三葉蟲、寒武紀海洋節肢動物',
      period: 'Cambrian',
      habitat: 'shallow marine ecosystem',
      promptFragment:
        'Place the organism in a shallow Cambrian sea with clear blue-green water, soft seafloor sediment, microbial mats, primitive sponge-like reef structures, suspended particles, and ancient marine invertebrate life.',
      forbidden:
        'No dinosaurs, no modern fish, no modern coral reef, no sea grass, no flowering plants, no modern marine animals.',
      negativePrompt:
        'modern coral reef, tropical reef fish, dolphins, sharks, sea turtles, sea grass, flowering plants, dinosaurs, fantasy alien planet'
    },
    {
      id: 'devonian_wetland',
      nameZh: '泥盆紀濕地',
      nameEn: 'Devonian Wetland',
      suitableFor: '提塔利克、早期四足類、盾皮魚、泥盆紀魚類',
      period: 'Devonian',
      habitat: 'freshwater wetland and river delta',
      promptFragment:
        'Place the organism in a Devonian river delta, shallow freshwater channel, muddy bank, or coastal wetland with primitive vascular plants, humid atmosphere, exposed roots, shallow water, and sediment-rich terrain.',
      forbidden: 'No modern grass, no flowering plants, no birds, no mammals, no dinosaurs.',
      negativePrompt:
        'modern grassland, flowers, birds, mammals, dinosaurs, modern trees, human objects, fantasy swamp monster'
    },
    {
      id: 'carboniferous_coal_swamp',
      nameZh: '石炭紀煤沼森林',
      nameEn: 'Carboniferous Coal Swamp Forest',
      suitableFor: '巨脈蜻蜓、節胸蜈蚣、大型兩棲類',
      period: 'Carboniferous',
      habitat: 'humid coal swamp forest',
      promptFragment:
        'Place the organism in a humid Carboniferous swamp forest with giant lycopsids, horsetails, tree ferns, dense mist, shallow acidic water, fallen plant debris, dark wet soil, and a warm oxygen-rich atmosphere.',
      forbidden: 'No flowers, no grass lawn, no birds, no mammals, no dinosaurs.',
      negativePrompt: 'flowers, grass lawn, tropical rainforest flowers, birds, mammals, dinosaurs, humans, fantasy insects'
    },
    {
      id: 'permian_floodplain',
      nameZh: '二疊紀乾旱氾濫平原',
      nameEn: 'Permian Semi-Arid Floodplain',
      suitableFor: '異齒龍、麗齒獸類、早期合弓類',
      period: 'Permian',
      habitat: 'semi-arid floodplain',
      promptFragment:
        'Place the organism in a Permian semi-arid floodplain with seasonal dry climate, dusty sediment, sparse vegetation, primitive conifers, seed ferns, dry riverbeds, exposed red-brown earth, and low harsh sunlight.',
      forbidden:
        'No modern grasslands, no flowering plants, no modern mammals, no birds, no humans, no lush modern forest.',
      negativePrompt:
        'modern savanna grass, flowers, birds, mammals, dinosaurs, human buildings, fantasy desert monster'
    },
    {
      id: 'jurassic_forest',
      nameZh: '侏羅紀針葉林 / 蘇鐵林',
      nameEn: 'Jurassic Conifer and Cycad Forest',
      suitableFor: '劍龍、梁龍、異特龍、始祖鳥',
      period: 'Jurassic',
      habitat: 'conifer and cycad forest',
      promptFragment:
        'Place the organism in a Jurassic landscape with conifer forests, cycads, ginkgo-like trees, ferns, humid forest floor, volcanic distant hills, river edges, and natural prehistoric lighting.',
      forbidden: 'No modern grass lawns, no flowering meadows, no modern trees, no humans, no theme park design.',
      negativePrompt: 'modern grass lawn, flowers, city, humans, theme park, fantasy dinosaur, dragon, kaiju'
    },
    {
      id: 'cretaceous_floodplain',
      nameZh: '白堊紀河流氾濫平原',
      nameEn: 'Cretaceous Coastal Floodplain',
      suitableFor: '暴龍、三角龍、鴨嘴龍、甲龍',
      period: 'Cretaceous',
      habitat: 'river floodplain and coastal wetland',
      promptFragment:
        'Place the organism in a Cretaceous floodplain with river channels, muddy banks, seasonal wetlands, conifers, ferns, subtle early flowering plants, open woodland, and warm natural light.',
      forbidden: 'No modern city, no humans, no cars, no modern park, no fantasy monster design.',
      negativePrompt:
        'city, people, vehicles, modern park, fantasy monster, dragon, kaiju, glowing eyes, oversized teeth'
    },
    {
      id: 'mesozoic_marine',
      nameZh: '中生代海洋',
      nameEn: 'Mesozoic Marine Ecosystem',
      suitableFor: '魚龍、蛇頸龍、滄龍、菊石、古海龜',
      period: 'Mesozoic',
      habitat: 'open marine ecosystem',
      promptFragment:
        'Place the organism in a realistic Mesozoic ocean with open water, filtered sunlight, suspended particles, distant seafloor, ammonites if appropriate, and natural underwater documentary composition.',
      forbidden: 'No modern dolphins, no whales, no scuba divers, no submarines, no fantasy sea monster.',
      negativePrompt:
        'modern dolphins, whales, scuba diver, submarine, modern reef fish, fantasy sea serpent, glowing creature'
    },
    {
      id: 'pleistocene_tundra',
      nameZh: '更新世苔原草原',
      nameEn: 'Pleistocene Steppe-Tundra',
      suitableFor: '猛獁象、披毛犀、劍齒虎、洞獅、恐狼',
      period: 'Pleistocene',
      habitat: 'cold steppe-tundra ecosystem',
      promptFragment:
        'Place the organism in a cold Pleistocene steppe-tundra landscape with dry grasses, low shrubs, patches of snow, cold wind, distant mountains or open plains, muted sunlight, and Ice Age megafauna atmosphere.',
      forbidden: 'No modern cities, no cars, no domestic animals, no fantasy beast design.',
      negativePrompt:
        'modern city, humans, cars, domestic cattle, fantasy beast, monster fangs, exaggerated muscles'
    },
    {
      id: 'amber_forest_macro',
      nameZh: '琥珀森林微距',
      nameEn: 'Prehistoric Forest Macro Ecosystem',
      suitableFor: '古昆蟲、古蜘蛛、琥珀標本',
      period: 'Mesozoic / Cenozoic',
      habitat: 'forest microhabitat',
      promptFragment:
        'Create a macro ecological reconstruction in a prehistoric forest microhabitat, with bark texture, resin droplets, leaf litter, humid air, primitive forest vegetation, shallow depth of field, and natural macro photography lighting.',
      forbidden:
        'No fantasy insect armor, no glowing eyes, no toy-like plastic texture, no inaccurate limb count.',
      negativePrompt:
        'fantasy insect, monster bug, glowing eyes, plastic toy, modern garden flowers, cartoon, anime, game creature'
    }
  ];

  var demoPaleoProject = {
    commonName: '奇蝦',
    scientificName: 'Anomalocaris canadensis',
    geologicalPeriod: 'Cambrian',
    taxonomicGroup: 'Radiodonta',
    knownFossilMaterial: 'frontal appendages, oral cone, body impressions',
    evidenceNotes:
      'Use conservative reconstruction based on known Cambrian radiodont body plan. Avoid fantasy monster design.',
    environmentPresetId: 'cambrian_shallow_sea',
    reconstructionMode: '自然紀錄片風格',
    pose: '游泳',
    cameraAngle: '3/4 視角',
    aspectRatio: '16:9'
  };

  var RECON_MODES = [
    '保守學術復原',
    '自然紀錄片風格',
    '博物館展示風格',
    '化石轉生命復原',
    '卡片插畫風格',
    'Quest 場景風格'
  ];
  var POSE_OPTS = [
    '自然姿勢',
    '行走',
    '游泳',
    '覓食',
    '休息',
    '群體活動',
    '中性展示姿勢',
    '自訂'
  ];
  var CAMERA_OPTS = ['側面', '3/4 視角', '低角度', '眼平視角', '近距離特寫', '水下視角'];
  var ASPECT_OPTS = ['1:1', '3:4', '16:9', '2:3'];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function aspectRatioToPaleoDims_(aspectRatio) {
    var ar = String(aspectRatio || '16:9');
    if (ar === '1:1') return { w: 1024, h: 1024 };
    if (ar === '3:4') return { w: 768, h: 1024 };
    if (ar === '2:3') return { w: 832, h: 1248 };
    return { w: 1024, h: 576 };
  }

  function buildPollinationsPaleoImageUrl_(project) {
    var p = project || {};
    var prompt = String(p.generatedPrompt || p.prompt || '');
    var neg = String(p.negativePrompt || '');
    var combined = prompt;
    if (neg) combined += ' | Negative: ' + neg;
    if (combined.length > PALEO_POLLINATIONS_PROMPT_MAX) {
      combined = combined.substring(0, PALEO_POLLINATIONS_PROMPT_MAX);
    }
    var dims = aspectRatioToPaleoDims_(p.aspectRatio);
    var seed = Math.floor(Math.random() * 999999999);
    var enc = encodeURIComponent(combined);
    return (
      'https://image.pollinations.ai/prompt/' +
      enc +
      '?width=' +
      dims.w +
      '&height=' +
      dims.h +
      '&seed=' +
      seed +
      '&model=flux&nologo=true&safe=true&enhance=false&referrer=MCurator-Paleo'
    );
  }

  function cloneProject(base) {
    var o = {};
    for (var k in defaultPaleoProject) {
      if (Object.prototype.hasOwnProperty.call(defaultPaleoProject, k)) {
        o[k] = defaultPaleoProject[k];
      }
    }
    if (base) {
      for (var k2 in base) {
        if (Object.prototype.hasOwnProperty.call(base, k2)) o[k2] = base[k2];
      }
    }
    if (!Array.isArray(o.references)) o.references = [];
    return o;
  }

  function getEnvironmentPreset(environmentPresetId) {
    var id = String(environmentPresetId || '');
    for (var i = 0; i < PALEO_ENVIRONMENT_PRESETS.length; i++) {
      if (PALEO_ENVIRONMENT_PRESETS[i].id === id) return PALEO_ENVIRONMENT_PRESETS[i];
    }
    return null;
  }

  function buildPaleoReconstructionPrompt(project) {
    var env = getEnvironmentPreset(project.environmentPresetId);
    var name = project.scientificName || project.commonName || 'an extinct organism';
    return (
      '\nCreate a scientifically grounded paleo-reconstruction ecological image of ' +
      name +
      '.\n\nThe organism must be reconstructed based on fossil evidence, academic references, skeletal proportions, and conservative anatomical inference.\n\nKnown organism information:\n- Common name: ' +
      (project.commonName || 'Unknown') +
      '\n- Scientific name: ' +
      (project.scientificName || 'Unknown') +
      '\n- Geological period: ' +
      (project.geologicalPeriod || 'Unknown') +
      '\n- Taxonomic group: ' +
      (project.taxonomicGroup || 'Unknown') +
      '\n- Known fossil material: ' +
      (project.knownFossilMaterial || 'Unknown') +
      '\n- Important anatomical notes: ' +
      (project.evidenceNotes || 'No additional notes') +
      '\n\nPaleoenvironment:\n' +
      (env
        ? env.promptFragment
        : 'Use a conservative scientifically plausible paleoenvironment.') +
      '\n\nReconstruction style:\n' +
      (project.reconstructionMode || 'Conservative scientific reconstruction') +
      '\n\nPose:\n' +
      (project.pose || 'Natural pose') +
      '\n\nCamera angle:\n' +
      (project.cameraAngle || '3/4 view') +
      '\n\nImage direction:\nThe image should look like a realistic natural history documentary still or museum-grade paleoart reconstruction.\nPrioritize anatomical accuracy, fossil-based body proportions, and plausible paleoecology over fantasy design.\n\nScientific restrictions:\n- Do not invent unsupported anatomy.\n- Do not add random horns, spikes, armor, glowing eyes, dragon traits, alien traits, or kaiju-like exaggeration.\n- Do not place the organism in the wrong geological period or wrong habitat.\n- Do not include modern plants, animals, or human objects unless scientifically appropriate.\n- If soft tissue, color, or behavior is uncertain, keep it conservative and subtle.\n- ' +
      (env ? env.forbidden : 'Avoid modern or unsupported environmental elements.') +
      '\n\nNo text, no labels, no watermark, no logo.\n'
    );
  }

  function buildNegativePrompt(project) {
    var env = getEnvironmentPreset(project.environmentPresetId);
    return (
      '\nfantasy creature, dragon, alien, monster, kaiju, demon, horror creature, exaggerated teeth, random spikes, unsupported horns, glowing eyes, sci-fi armor, humanoid anatomy, cartoon, anime, game character, toy-like, plastic texture, inaccurate skeleton, wrong limb count, distorted anatomy, over-muscular body, unrealistic proportions, modern animal hybrid, text, watermark, logo, labels, ' +
      (env ? env.negativePrompt : '') +
      '\n'
    );
  }

  function calculatePaleoConfidence(project) {
    var score = 0;
    if (project.commonName) score += 5;
    if (project.scientificName) score += 15;
    if (project.geologicalPeriod) score += 10;
    if (project.taxonomicGroup) score += 5;
    if (project.knownFossilMaterial) score += 15;
    if (project.evidenceNotes) score += 10;
    if (project.environmentPresetId) score += 15;
    if (project.references && project.references.length) {
      score += Math.min(project.references.length * 5, 20);
    }
    return Math.min(score, 100);
  }

  function getPaleoConfidenceLabel(score) {
    if (score >= 75) return prT('confidenceHigh');
    if (score >= 50) return prT('confidenceMed');
    if (score >= 25) return prT('confidenceLow');
    return prT('confidenceSpeculative');
  }

  function loadPaleoProjects() {
    try {
      var raw = localStorage.getItem(PALEO_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Failed to load paleo projects', error);
      return [];
    }
  }

  function savePaleoProject(project) {
    var projects = loadPaleoProjects();
    var now = new Date().toISOString();
    var projectToSave = cloneProject(project);
    projectToSave.id = project.id || 'paleo_' + Date.now();
    projectToSave.updatedAt = now;
    projectToSave.createdAt = project.createdAt || now;
    var existingIndex = -1;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id === projectToSave.id) {
        existingIndex = i;
        break;
      }
    }
    if (existingIndex >= 0) projects[existingIndex] = projectToSave;
    else projects.unshift(projectToSave);
    localStorage.setItem(PALEO_STORAGE_KEY, JSON.stringify(projects));
    return projectToSave;
  }

  function deletePaleoProject(projectId) {
    var projects = loadPaleoProjects();
    var next = projects.filter(function (project) {
      return project.id !== projectId;
    });
    localStorage.setItem(PALEO_STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function callPaleoApi(action, payload) {
    return new Promise(function (resolve) {
      if (!window.google || !google.script || !google.script.run) {
        resolve({
          ok: false,
          mock: true,
          message: '本機模式：無伺服器 API，使用 Mock 模式。',
          action: action,
          payload: payload
        });
        return;
      }
      var runner = google.script.run.withSuccessHandler(resolve).withFailureHandler(function (error) {
        resolve({
          ok: false,
          mock: true,
          message: error && error.message ? error.message : 'API call failed. Mock Mode fallback is active.',
          action: action,
          payload: payload
        });
      });
      if (action === 'generatePaleoImage') {
        runner.generatePaleoImage(payload);
      } else if (action === 'analyzePaleoReference') {
        runner.analyzePaleoReference(payload);
      } else if (action === 'buildPaleoApiSummary') {
        runner.buildPaleoApiSummary(payload);
      } else {
        resolve({
          ok: false,
          mock: true,
          message: 'Unknown API action.',
          action: action,
          payload: payload
        });
      }
    });
  }

  var state = {
    step: 1,
    project: cloneProject(null),
    mockPreview: false,
    toast: ''
  };

  function toastMsg(msg) {
    state.toast = msg;
    render();
    setTimeout(function () {
      state.toast = '';
      render();
    }, 2200);
  }

  function copyText(text) {
    var t = String(text || '');
    if (!t) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(
        function () {
          toastMsg('已複製到剪貼簿');
        },
        function () {
          fallbackCopy(t);
        }
      );
    } else fallbackCopy(t);
  }

  function fallbackCopy(t) {
    try {
      var ta = document.createElement('textarea');
      ta.value = t;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      toastMsg('已複製到剪貼簿');
    } catch (e) {
      toastMsg('複製失敗');
    }
  }

  function uid() {
    return 'ref_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
  }

  function renderEnvCards() {
    return PALEO_ENVIRONMENT_PRESETS.map(function (p) {
      var sel = state.project.environmentPresetId === p.id ? ' is-selected' : '';
      return (
        '<button type="button" class="mc-paleo-env-card' +
        sel +
        '" data-env-id="' +
        esc(p.id) +
        '"><h4>' +
        esc(p.nameZh) +
        ' · ' +
        esc(p.nameEn) +
        '</h4><div class="meta"><div><strong>適合：</strong>' +
        esc(p.suitableFor) +
        '</div><div><strong>年代：</strong>' +
        esc(p.period) +
        '</div><div><strong>禁止：</strong>' +
        esc(p.forbidden) +
        '</div></div></button>'
      );
    }).join('');
  }

  function renderSelect(label, key, opts, val) {
    return (
      '<div class="mc-paleo-field"><label>' +
      esc(label) +
      '</label><select data-proj-key="' +
      esc(key) +
      '">' +
      opts
        .map(function (o) {
          return '<option value="' + esc(o) + '"' + (o === val ? ' selected' : '') + '>' + esc(o) + '</option>';
        })
        .join('') +
      '</select></div>'
    );
  }

  function renderRefs() {
    var refs = state.project.references || [];
    if (!refs.length) {
      return '<p style="font-size:0.78rem;opacity:0.75;margin:0;">尚無參考資料（Mock）。可點「加入示範參考」。</p>';
    }
    return (
      '<div class="mc-paleo-upload-list">' +
      refs
        .map(function (r) {
          return (
            '<div class="mc-paleo-ref-row" data-ref-id="' +
            esc(r.id) +
            '"><div class="mc-paleo-ref-thumb" aria-hidden="true"></div><div style="flex:1;min-width:0;"><div>' +
            esc(r.name) +
            '</div><div style="opacity:0.75;">' +
            esc(r.type) +
            (r.isPrimary ? ' · <strong>主要</strong>' : '') +
            '</div></div><label style="font-size:0.7rem;white-space:nowrap;"><input type="checkbox" data-ref-primary="' +
            esc(r.id) +
            '"' +
            (r.isPrimary ? ' checked' : '') +
            '> 主要</label><button type="button" class="mc-paleo-btn" data-ref-del="' +
            esc(r.id) +
            '">刪除</button></div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderSaved() {
    var list = loadPaleoProjects().slice(0, 8);
    if (!list.length) {
      return '<p style="font-size:0.78rem;opacity:0.75;">尚無儲存專案。</p>';
    }
    return (
      '<div class="mc-paleo-saved-list">' +
      list
        .map(function (p) {
          var env = getEnvironmentPreset(p.environmentPresetId);
          return (
            '<div class="mc-paleo-saved-card"><div class="row"><strong>' +
            esc(p.commonName || '（未命名）') +
            '</strong><span>' +
            esc(p.updatedAt || '').slice(0, 10) +
            '</span></div><div style="opacity:0.8;margin:4px 0;">' +
            esc(p.scientificName || '') +
            '</div><div style="font-size:0.72rem;opacity:0.75;">' +
            esc(env ? env.nameZh : '') +
            ' · ' +
            esc(p.confidenceLabel || '—') +
            '</div><div class="row" style="margin-top:8px;"><button type="button" class="mc-paleo-btn" data-load-id="' +
            esc(p.id) +
            '">載入</button><button type="button" class="mc-paleo-btn" data-del-id="' +
            esc(p.id) +
            '">刪除</button></div></div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function colStep1() {
    return (
      '<div><div class="mc-paleo-section-title">Step 1 / 選擇復原目標</div>' +
      '<div class="mc-paleo-field"><label>中文名稱</label><input data-proj="commonName" value="' +
      esc(state.project.commonName) +
      '"></div>' +
      '<div class="mc-paleo-field"><label>Scientific Name / 學名</label><input data-proj="scientificName" value="' +
      esc(state.project.scientificName) +
      '"></div>' +
      '<div class="mc-paleo-field"><label>Geological Period / 地質年代</label><input data-proj="geologicalPeriod" value="' +
      esc(state.project.geologicalPeriod) +
      '"></div>' +
      '<div class="mc-paleo-field"><label>Taxonomic Group / 分類群</label><input data-proj="taxonomicGroup" value="' +
      esc(state.project.taxonomicGroup) +
      '"></div>' +
      '<div class="mc-paleo-field"><label>Known Fossil Material / 已知化石材料</label><textarea data-proj="knownFossilMaterial">' +
      esc(state.project.knownFossilMaterial) +
      '</textarea></div>' +
      '<div class="mc-paleo-field"><label>Evidence Notes / 證據備註</label><textarea data-proj="evidenceNotes">' +
      esc(state.project.evidenceNotes) +
      '</textarea></div>' +
      '<button type="button" class="mc-paleo-btn mc-paleo-btn--primary" data-action="demo">載入示範：奇蝦復原</button>' +
      '<div style="margin-top:16px" class="mc-paleo-section-title">上傳參考資料（Mock）</div>' +
      '<p style="font-size:0.78rem;opacity:0.8;margin:0 0 8px;">支援：化石照片、骨骼圖、論文截圖、手繪圖、博物館標本照、環境參考圖（僅本地列表）。</p>' +
      '<div class="mc-paleo-field"><label>參考類型</label><select id="mcPaleoRefType">' +
      PALEO_REFERENCE_TYPES.map(function (t) {
        return '<option>' + esc(t) + '</option>';
      }).join('') +
      '</select></div>' +
      '<div class="mc-paleo-field"><label>檔名（Mock）</label><input id="mcPaleoRefName" placeholder="例：Hurdia_spine.tif"></div>' +
      '<button type="button" class="mc-paleo-btn" data-action="add-mock-ref">加入示範參考</button>' +
      renderRefs() +
      '</div>'
    );
  }

  function colStep2() {
    return (
      '<div><div class="mc-paleo-section-title">Step 2 / 選擇古環境</div>' +
      '<p style="font-size:0.78rem;line-height:1.5;margin:0 0 10px;opacity:0.85;">選擇正確古環境可避免 AI 產生錯誤時代、錯誤植物、錯誤生物或奇幻背景。</p>' +
      '<div class="mc-paleo-section-title" style="font-size:0.8rem;">古環境鎖定器 Paleo Environment Lock</div>' +
      '<div class="mc-paleo-env-grid">' +
      renderEnvCards() +
      '</div></div>'
    );
  }

  function colStep3() {
    return (
      '<div><div class="mc-paleo-section-title">Step 3 / 產生設定</div>' +
      renderSelect('復原模式', 'reconstructionMode', RECON_MODES, state.project.reconstructionMode) +
      renderSelect('姿勢', 'pose', POSE_OPTS, state.project.pose) +
      renderSelect('鏡頭角度', 'cameraAngle', CAMERA_OPTS, state.project.cameraAngle) +
      renderSelect('畫面比例', 'aspectRatio', ASPECT_OPTS, state.project.aspectRatio) +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">' +
      '<button type="button" class="mc-paleo-btn mc-paleo-btn--primary" data-action="gen-prompt">產生 Prompt</button>' +
      '<button type="button" class="mc-paleo-btn" data-action="copy-prompt">複製 Prompt</button>' +
      '<button type="button" class="mc-paleo-btn" data-action="copy-neg">複製 Negative</button>' +
      '<button type="button" class="mc-paleo-btn" data-action="recalc-conf">重新計算可信度</button>' +
      '<button type="button" class="mc-paleo-btn mc-paleo-btn--primary" data-action="mock-img">產生復原圖預覽</button>' +
      '<button type="button" class="mc-paleo-btn" data-action="save-proj">儲存專案</button>' +
      '<button type="button" class="mc-paleo-btn" data-action="stub-api">自動補充學術資料（Crossref + PBDB + GBIF）</button>' +
      '<button type="button" class="mc-paleo-btn" data-action="vision-ref">OpenAI Vision 分析第一筆參考</button>' +
      '</div></div>'
    );
  }

  function previewHtml() {
    var env = getEnvironmentPreset(state.project.environmentPresetId);
    var imgUrl = String(state.project.generatedImageUrl || '');
    if (state.mockPreview && imgUrl && PALEO_POLLINATIONS_ENABLED) {
      return (
        '<div class="mc-paleo-preview-panel mc-paleo-preview-panel--filled">' +
        '<h3>復原圖預覽</h3>' +
        '<p class="sub">' +
        (state.project.lastImageProvider === 'openai'
          ? '以下影像由 <strong>OpenAI Images（DALL·E 3）</strong> 依 Prompt 產生（須設定 OPENAI_API_KEY 後端）。'
          : '以下影像由 <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer">Pollinations.ai</a> 免費社群 API 依 Prompt 產生（品質與可用性依第三方服務而定，非學術鑑定依據）。') +
        '</p>' +
        '<div class="mc-paleo-preview-img-wrap"><img class="mc-paleo-preview-img" src="' +
        esc(imgUrl) +
        '" alt="Paleo reconstruction preview" loading="lazy" /></div>' +
        '<div class="mc-paleo-preview-mock" style="margin-top:14px;"><div><strong>復原目標：</strong>' +
        esc(state.project.commonName) +
        ' / ' +
        esc(state.project.scientificName) +
        '</div><div><strong>古環境：</strong>' +
        esc(env ? env.nameZh : '') +
        '</div><div><strong>復原模式：</strong>' +
        esc(state.project.reconstructionMode) +
        '</div><div><strong>可信度：</strong>' +
        esc(state.project.confidenceLabel) +
        ' / ' +
        esc(String(state.project.confidenceScore)) +
        '</div></div>' +
        '<p style="font-size:0.72rem;opacity:0.75;margin:12px 0 0;line-height:1.45;">若載入失敗，可能是 URL 過長、網路或服務端限制；可縮短物種描述後再試。</p></div>'
      );
    }
    if (state.mockPreview) {
      return (
        '<div class="mc-paleo-preview-panel"><h3>Mock Reconstruction Preview</h3><p class="sub">目前為測試模式，未啟用 Pollinations 預覽。</p>' +
        '<div class="mc-paleo-preview-mock"><div><strong>復原目標：</strong>' +
        esc(state.project.commonName) +
        ' / ' +
        esc(state.project.scientificName) +
        '</div><div><strong>古環境：</strong>' +
        esc(env ? env.nameZh : '') +
        '</div><div><strong>復原模式：</strong>' +
        esc(state.project.reconstructionMode) +
        '</div><div><strong>可信度：</strong>' +
        esc(state.project.confidenceLabel) +
        ' / ' +
        esc(String(state.project.confidenceScore)) +
        '</div><p style="margin:12px 0 0;opacity:0.85;">請啟用 Pollinations 或連接其他圖片 API 以顯示預覽。</p></div></div>'
      );
    }
    return (
      '<div class="mc-paleo-preview-panel"><h3>復原圖預覽</h3><p class="sub">' +
      (PALEO_POLLINATIONS_ENABLED
        ? '點「產生復原圖預覽」將以 Pollinations 免費 API 建立影像連結（無需金鑰）。'
        : '目前為 Mock Mode，尚未連接圖片生成 API。') +
      '</p></div>'
    );
  }

  function sideHtml() {
    var emptyHint =
      state.project.generatedPrompt ||
      state.project.negativePrompt ||
      state.project.confidenceScore
        ? ''
        : '<p style="font-size:0.78rem;opacity:0.75;margin:0;">請先輸入物種並選擇古環境。</p>';
    return (
      '<div class="mc-paleo-side-block"><h4>古環境鎖定</h4><div style="font-size:0.78rem;">' +
      esc(getEnvironmentPreset(state.project.environmentPresetId) ? getEnvironmentPreset(state.project.environmentPresetId).nameZh : '（未選）') +
      '</div></div>' +
      '<div class="mc-paleo-side-block"><h4>Prompt 預覽</h4>' +
      emptyHint +
      '<div class="mc-paleo-prompt-box">' +
      esc(state.project.generatedPrompt || '') +
      '</div><button type="button" class="mc-paleo-btn" style="margin-top:8px;" data-action="copy-prompt">複製 Prompt</button></div>' +
      '<div class="mc-paleo-side-block"><h4>Negative Prompt</h4><div class="mc-paleo-prompt-box">' +
      esc(state.project.negativePrompt || '') +
      '</div><button type="button" class="mc-paleo-btn" style="margin-top:8px;" data-action="copy-neg">複製 Negative</button></div>' +
      '<div class="mc-paleo-side-block"><h4>科學可信度</h4><div class="mc-paleo-confidence-meter"><i style="width:' +
      esc(String(state.project.confidenceScore || 0)) +
      '%"></i></div><div><strong>' +
      esc(state.project.confidenceLabel || '—') +
      '</strong>（' +
      esc(String(state.project.confidenceScore || 0)) +
      ' / 100）</div><p style="font-size:0.72rem;line-height:1.45;margin:10px 0 0;opacity:0.82;">此影像為根據現有證據與保守推論產生的科學視覺化，不代表完全確定之外觀。體色、軟組織與行為若無直接證據，應視為推測性內容。</p><p style="font-size:0.7rem;opacity:0.7;margin:6px 0 0;">This reconstruction is a scientific visualization based on available evidence and conservative inference. Soft tissue, coloration, and behavior may be speculative unless directly supported by evidence.</p></div>' +
      '<div class="mc-paleo-side-block"><h4>最近的復原專案</h4>' +
      renderSaved() +
      '</div>' +
      '<div class="mc-paleo-side-block"><h4>未來整合（Coming Soon）</h4>' +
      '<div style="display:flex;flex-direction:column;gap:6px;">' +
      '<button type="button" class="mc-paleo-btn" disabled>附加到標本護照 Coming Soon</button>' +
      '<button type="button" class="mc-paleo-btn" disabled>加入 Quest Coming Soon</button>' +
      '<button type="button" class="mc-paleo-btn" disabled>用於卡片產生器 Coming Soon</button>' +
      '<button type="button" class="mc-paleo-btn" disabled>建立 SAT Preview Coming Soon</button>' +
      '<button type="button" class="mc-paleo-btn" disabled>匯出復原報告 Coming Soon</button>' +
      '</div></div>' +
      '<details class="mc-paleo-advanced"><summary>進階 · API 串接</summary>' +
      '<p style="font-size:0.76rem;line-height:1.45;margin:8px 0 0;opacity:0.9;">已串聯：<strong>Crossref</strong>（論文）、<strong>PBDB</strong>（occurrence／年代／地點／古環境）、<strong>GBIF</strong>（分類比對）。伺服端可設 <code>OPENAI_API_KEY</code> 啟用 <strong>OpenAI Images</strong>（產圖優先）與 <strong>Vision</strong>（參考圖分析）；建議另設 <code>CROSSREF_MAILTO</code> 供 Crossref User-Agent。</p>' +
      (state.project.paleoApiReports
        ? '<pre style="font-size:0.65rem;overflow:auto;max-height:140px;background:rgba(0,0,0,0.22);padding:8px;border-radius:8px;margin-top:8px;">' +
          esc(JSON.stringify(state.project.paleoApiReports).slice(0, 2400)) +
          '</pre>'
        : '<p style="font-size:0.72rem;opacity:0.78;margin:8px 0 0;">尚未執行「自動補充學術資料」或無回傳快取。</p>') +
      '<ul style="margin:8px 0 0 18px;line-height:1.45;font-size:0.74rem;"><li>產圖：OpenAI Images（有金鑰）→ 否則 Pollinations</li><li>參考圖：OpenAI Vision（有金鑰）</li><li>文獻／化石／現生比對：按鈕「自動補充學術資料」</li></ul></details>'
    );
  }

  function stepCols() {
    var pills = [1, 2, 3]
      .map(function (n) {
        return (
          '<button type="button" class="mc-paleo-step-pill' +
          (state.step === n ? ' is-active' : '') +
          '" data-step="' +
          n +
          '">Step ' +
          n +
          '</button>'
        );
      })
      .join('');
    var left = state.step === 1 ? colStep1() : state.step === 2 ? colStep2() : colStep3();
    return (
      '<div class="mc-paleo-desktop-3col mc-paleo-layout">' +
      '<div class="mc-paleo-col"><div class="mc-paleo-step-nav">' +
      pills +
      '</div>' +
      left +
      '</div>' +
      '<div class="mc-paleo-col mc-paleo-col--preview">' +
      previewHtml() +
      '</div>' +
      '<div class="mc-paleo-col mc-paleo-col--side">' +
      sideHtml() +
      '</div></div>'
    );
  }

  function mobileStack() {
    return (
      '<div class="mc-paleo-mobile-stack">' +
      '<div class="mc-paleo-section-title">物種資料</div>' +
      colStep1() +
      '<div class="mc-paleo-section-title" style="margin-top:16px;">古環境</div>' +
      colStep2() +
      '<div class="mc-paleo-section-title" style="margin-top:16px;">生成設定</div>' +
      colStep3() +
      '<div class="mc-paleo-section-title" style="margin-top:16px;">預覽與側欄</div>' +
      previewHtml() +
      sideHtml() +
      '</div>'
    );
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var toast = state.toast
      ? '<div style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;padding:10px 16px;border-radius:12px;background:rgba(20,30,26,0.95);border:1px solid rgba(126,184,154,0.4);color:#e8dcc8;font-size:0.85rem;">' +
        esc(state.toast) +
        '</div>'
      : '';
    var _paleoH2 = '<h2>' + esc(prT('pageTitle')) + '</h2>';
    root.innerHTML =
      '<div class="mc-paleo-topbar"><div class="mc-paleo-titleblock">' +
      _paleoH2 +
      '<p>' + esc(prT('pageSub')) + '</p></div></div>' +
      '<div class="mc-paleo-mock-banner"><strong>' + esc(prT('mockBanner')) + '</strong> PALEO_API_ENABLED=' +
      (PALEO_POLLINATIONS_ENABLED
        ? '復原圖預覽使用 Pollinations 免費 URL（無金鑰）。'
        : '尚未連接影像 API。') +
      ' PALEO_API_ENABLED=' +
      esc(String(PALEO_API_ENABLED)) +
      ' · PALEO_MOCK_MODE=' +
      esc(String(PALEO_MOCK_MODE)) +
      ' · PALEO_POLLINATIONS=' +
      esc(String(PALEO_POLLINATIONS_ENABLED)) +
      '</div>' +
      '<div class="mc-paleo-api-status"><strong>API 狀態</strong> — ' +
      (PALEO_POLLINATIONS_ENABLED
        ? '影像預覽：Pollinations（免費第三方）。學名輸入後會嘗試以 GBIF、PBDB、ELC 自動補齊可得欄位（與標本表單共用 mc-external-taxon-hub）。'
        : 'Mock Mode：尚未啟用影像 API。學名仍可由 GBIF / PBDB / ELC 補欄。') +
      '</div>' +
      stepCols() +
      mobileStack() +
      toast;
    ensurePaleoTaxonHubDelegation_(root);
    bind(root);
  }

  function ensurePaleoTaxonHubDelegation_(root) {
    if (!root || root._mcPaleoTaxHubDelegation) return;
    root._mcPaleoTaxHubDelegation = true;
    var paleoTaxTimer = null;
    root.addEventListener('input', function (e) {
      var el = e.target;
      if (!el || el.getAttribute('data-proj') !== 'scientificName') return;
      clearTimeout(paleoTaxTimer);
      paleoTaxTimer = setTimeout(function () {
        var hub = window.McExternalTaxonHub;
        if (!hub || typeof hub.enrichPaleoProject !== 'function') return;
        var q = String(state.project.scientificName || '').trim();
        if (q.length < 3) return;
        hub.enrichPaleoProject(state.project).then(function () {
          render();
        });
      }, 750);
    });
  }

  function bind(root) {
    root.querySelectorAll('[data-proj]').forEach(function (el) {
      el.addEventListener('input', function () {
        var k = el.getAttribute('data-proj');
        state.project[k] = el.value;
      });
    });
    root.querySelectorAll('[data-proj-key]').forEach(function (el) {
      el.addEventListener('change', function () {
        var k = el.getAttribute('data-proj-key');
        if (k) state.project[k] = el.value;
      });
    });
    root.querySelectorAll('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.step = parseInt(b.getAttribute('data-step'), 10) || 1;
        render();
      });
    });
    root.querySelectorAll('[data-env-id]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.project.environmentPresetId = b.getAttribute('data-env-id') || '';
        render();
      });
    });
    root.querySelectorAll('[data-action]').forEach(function (b) {
      b.addEventListener('click', function () {
        onAction(b.getAttribute('data-action'));
      });
    });
    root.querySelectorAll('[data-load-id]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-load-id');
        var arr = loadPaleoProjects();
        var found = null;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            found = arr[i];
            break;
          }
        }
        if (found) {
          state.project = cloneProject(found);
          state.mockPreview = false;
          toastMsg('已載入專案');
          render();
        }
      });
    });
    root.querySelectorAll('[data-del-id]').forEach(function (b) {
      b.addEventListener('click', function () {
        deletePaleoProject(b.getAttribute('data-del-id') || '');
        toastMsg('已刪除');
        render();
      });
    });
    root.querySelectorAll('[data-ref-del]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-ref-del');
        state.project.references = (state.project.references || []).filter(function (r) {
          return r.id !== id;
        });
        render();
      });
    });
    root.querySelectorAll('[data-ref-primary]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = cb.getAttribute('data-ref-primary');
        state.project.references.forEach(function (r) {
          r.isPrimary = r.id === id && cb.checked;
        });
      });
    });
    root.querySelectorAll('.mc-paleo-preview-img').forEach(function (img) {
      img.addEventListener(
        'error',
        function () {
          toastMsg('影像載入失敗（連線或第三方服務限制）。可稍後再試或縮短 Prompt。');
        },
        { once: true }
      );
    });
  }

  function applyServerPaleoSummary_(proj, res) {
    if (!proj || !res || !res.ok) return;
    proj.paleoApiReports = proj.paleoApiReports || {};
    proj.paleoApiReports.server = {
      papers: res.papers || [],
      occurrences: res.fossilOccurrences || [],
      gbif: res.gbifTaxonomy || null,
      notes: res.notes || []
    };
    var lines = [];
    if (res.papers && res.papers.length) {
      lines.push(
        'Crossref（伺服器）: ' + res.papers[0].title + (res.papers[0].doi ? ' · doi:' + res.papers[0].doi : '')
      );
    }
    if (res.fossilOccurrences && res.fossilOccurrences.length) {
      var x = res.fossilOccurrences[0];
      lines.push(
        'PBDB（伺服器）: ' +
          (x.collection_name || x.accepted_name || '') +
          ' | ' +
          (x.environment || '') +
          ' | ' +
          (x.early_interval || '')
      );
    }
    if (res.gbifTaxonomy && res.gbifTaxonomy.scientificName) {
      lines.push('GBIF（伺服器）: ' + res.gbifTaxonomy.scientificName + ' · ' + (res.gbifTaxonomy.rank || ''));
    }
    if (res.notes && res.notes.length) lines.push(res.notes.join(' · '));
    var block = lines.join('\n');
    if (block) {
      proj.evidenceNotes = (proj.evidenceNotes ? proj.evidenceNotes + '\n\n' : '') + '【伺服器彙總】\n' + block;
    }
  }

  function onAction(act) {
    if (act === 'demo') {
      state.project = cloneProject(demoPaleoProject);
      toastMsg('已載入示範專案');
      render();
      return;
    }
    if (act === 'add-mock-ref') {
      var nameEl = document.getElementById('mcPaleoRefName');
      var typeEl = document.getElementById('mcPaleoRefType');
      var nm = (nameEl && nameEl.value) || 'mock_reference_' + (state.project.references.length + 1);
      var tp = (typeEl && typeEl.value) || '化石證據';
      var nr = {};
      for (var k in defaultPaleoReference) {
        if (Object.prototype.hasOwnProperty.call(defaultPaleoReference, k)) nr[k] = defaultPaleoReference[k];
      }
      nr.id = uid();
      nr.name = nm;
      nr.type = tp;
      nr.url = '';
      nr.thumbnail = '';
      nr.isPrimary = state.project.references.length === 0;
      state.project.references.push(nr);
      render();
      return;
    }
    if (act === 'gen-prompt') {
      state.project.generatedPrompt = buildPaleoReconstructionPrompt(state.project);
      state.project.negativePrompt = buildNegativePrompt(state.project);
      state.project.confidenceScore = calculatePaleoConfidence(state.project);
      state.project.confidenceLabel = getPaleoConfidenceLabel(state.project.confidenceScore);
      toastMsg('已產生 Prompt');
      render();
      return;
    }
    if (act === 'copy-prompt') {
      copyText(state.project.generatedPrompt || buildPaleoReconstructionPrompt(state.project));
      return;
    }
    if (act === 'copy-neg') {
      copyText(state.project.negativePrompt || buildNegativePrompt(state.project));
      return;
    }
    if (act === 'recalc-conf') {
      state.project.confidenceScore = calculatePaleoConfidence(state.project);
      state.project.confidenceLabel = getPaleoConfidenceLabel(state.project.confidenceScore);
      toastMsg('已重新計算');
      render();
      return;
    }
    if (act === 'mock-img') {
      if (!state.project.generatedPrompt) {
        state.project.generatedPrompt = buildPaleoReconstructionPrompt(state.project);
        state.project.negativePrompt = buildNegativePrompt(state.project);
      }
      state.project.confidenceScore = calculatePaleoConfidence(state.project);
      state.project.confidenceLabel = getPaleoConfidenceLabel(state.project.confidenceScore);
      if (!PALEO_POLLINATIONS_ENABLED) {
        state.mockPreview = true;
        toastMsg('Mock 預覽已更新');
        render();
        return;
      }
      var payload = cloneProject(state.project);
      payload.prompt = state.project.generatedPrompt;
      callPaleoApi('generatePaleoImage', payload).then(function (res) {
        if (res && res.ok && res.imageUrl) {
          state.project.generatedImageUrl = String(res.imageUrl);
          state.project.lastImageProvider = String(res.provider || 'pollinations');
        } else {
          state.project.generatedImageUrl = buildPollinationsPaleoImageUrl_(state.project);
          state.project.lastImageProvider = 'pollinations';
        }
        state.mockPreview = true;
        toastMsg(
          res && res.ok && res.imageUrl && res.provider === 'openai'
            ? '已透過 OpenAI Images 建立復原圖連結'
            : res && res.ok && res.imageUrl
              ? '已透過伺服器建立影像預覽連結'
              : '已在本機建立 Pollinations 預覽網址（無伺服器 API 時）'
        );
        render();
      });
      return;
    }
    if (act === 'save-proj') {
      if (!state.project.generatedPrompt) {
        state.project.generatedPrompt = buildPaleoReconstructionPrompt(state.project);
        state.project.negativePrompt = buildNegativePrompt(state.project);
      }
      state.project.confidenceScore = calculatePaleoConfidence(state.project);
      state.project.confidenceLabel = getPaleoConfidenceLabel(state.project.confidenceScore);
      var saved = savePaleoProject(state.project);
      state.project = cloneProject(saved);
      toastMsg('已儲存復原專案。');
      render();
      return;
    }
    if (act === 'stub-api') {
      function afterServer_() {
        state.project.confidenceScore = calculatePaleoConfidence(state.project);
        state.project.confidenceLabel = getPaleoConfidenceLabel(state.project.confidenceScore);
        render();
      }
      function runServerSummary_() {
        if (!window.google || !google.script || !google.script.run) {
          afterServer_();
          return;
        }
        callPaleoApi('buildPaleoApiSummary', state.project).then(function (res) {
          if (res && res.ok && res.mock === false) {
            applyServerPaleoSummary_(state.project, res);
            toastMsg('伺服端已彙總 Crossref + PBDB + GBIF（並合併至備註）');
          } else if (res && res.message) {
            toastMsg(res.message);
          }
          afterServer_();
        });
      }
      if (window.McPaleoAdvancedApi && typeof window.McPaleoAdvancedApi.chainResearch === 'function') {
        window.McPaleoAdvancedApi.chainResearch(state.project).then(function (r) {
          if (r && r.ok) {
            toastMsg('瀏覽器端已串聯 Crossref + PBDB + GBIF');
          } else {
            toastMsg((r && r.message) || '瀏覽器端串聯略過');
          }
          runServerSummary_();
        }).catch(function () {
          runServerSummary_();
        });
      } else {
        runServerSummary_();
      }
      return;
    }
    if (act === 'vision-ref') {
      var refs = state.project.references || [];
      var first = refs[0];
      var img = first && String(first.url || '').trim();
      if (!img) {
        toastMsg('請在第一筆參考資料貼上影像 data URL 或 https 連結');
        return;
      }
      callPaleoApi('analyzePaleoReference', {
        references: refs,
        imageUrl: img,
        scientificName: state.project.scientificName
      }).then(function (res) {
        if (res && res.ok && res.result) {
          var r = res.result;
          var bits = [];
          if (r.confirmedFeatures && r.confirmedFeatures.length) {
            bits.push('確認特徵: ' + r.confirmedFeatures.join('; '));
          }
          if (r.likelyFeatures && r.likelyFeatures.length) {
            bits.push('可能特徵: ' + r.likelyFeatures.join('; '));
          }
          if (r.doNotInvent && r.doNotInvent.length) {
            bits.push('避免臆測: ' + r.doNotInvent.join('; '));
          }
          if (r.promptHints) bits.push('Prompt 提示: ' + String(r.promptHints).slice(0, 900));
          if (bits.length) {
            state.project.evidenceNotes =
              (state.project.evidenceNotes ? state.project.evidenceNotes + '\n\n' : '') +
              '【OpenAI Vision】\n' +
              bits.join('\n');
          }
          toastMsg(res.message || 'Vision 分析完成');
        } else {
          toastMsg((res && res.message) || 'Vision 需後端 API 並設定 OPENAI_API_KEY');
        }
        render();
      });
      return;
    }
  }

  function mountPaleoTool() {
    var shell = document.getElementById('mcPaleoReconstructionShell');
    if (shell) shell.hidden = false;
    state.step = 1;
    state.project = cloneProject(null);
    state.mockPreview = false;
    render();
    try {
      if (shell) shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {}
  }

  function hidePaleoShell() {
    var shell = document.getElementById('mcPaleoReconstructionShell');
    if (shell) shell.hidden = true;
  }

  function open() {
    try {
      if (typeof switchSection === 'function') switchSection('paleo-reconstruction');
    } catch (eSec) {}
  }

  function close() {
    hidePaleoShell();
    try {
      window.location.hash = '#/section/dashboard';
    } catch (e) {}
    try {
      if (typeof switchSection === 'function') switchSection('dashboard');
    } catch (e2) {}
    try {
      if (window.MCRouter && typeof window.MCRouter.render === 'function') window.MCRouter.render();
    } catch (e3) {}
  }

  function routeOpen() {
    try {
      if (typeof enterApp === 'function' && !document.documentElement.classList.contains('mc-entered')) {
        enterApp();
      }
    } catch (e) {}
    open();
  }

  window.renderPaleoReconstructionRoute_ = function (path) {
    void path;
    routeOpen();
  };

  try {
    if (window.MCRoute && typeof window.MCRoute.subscribe === 'function') {
      window.MCRoute.subscribe(function (sectionName) {
        if (sectionName === 'paleo-reconstruction') {
          try {
            window.location.hash = '#/section/paleo-reconstruction';
          } catch (eH) {}
          mountPaleoTool();
        } else {
          hidePaleoShell();
        }
      });
    }
  } catch (eSub) {}

  window.addEventListener('mc:localechange', function () {
    var shell = document.getElementById('mcPaleoReconstructionShell');
    if (shell && !shell.hidden && typeof render === 'function') render();
  });

  window.MCPaleoReconstruction = {
    open: open,
    close: close,
    PALEO_API_ENABLED: PALEO_API_ENABLED,
    PALEO_MOCK_MODE: PALEO_MOCK_MODE,
    PALEO_POLLINATIONS_ENABLED: PALEO_POLLINATIONS_ENABLED,
    buildPollinationsPaleoImageUrl: buildPollinationsPaleoImageUrl_,
    getEnvironmentPreset: getEnvironmentPreset,
    buildPaleoReconstructionPrompt: buildPaleoReconstructionPrompt,
    buildNegativePrompt: buildNegativePrompt,
    calculatePaleoConfidence: calculatePaleoConfidence,
    getPaleoConfidenceLabel: getPaleoConfidenceLabel,
    loadPaleoProjects: loadPaleoProjects,
    savePaleoProject: savePaleoProject,
    deletePaleoProject: deletePaleoProject,
    callPaleoApi: callPaleoApi
  };
})();
