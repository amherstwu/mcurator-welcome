/**
 * Care guide enrichment templates — merged into MCHusbandryLogI18n at load time.
 */
(function (global) {
  'use strict';

  function tplBlock(prefix, zhObj, enObj, jaObj) {
    Object.keys(zhObj).forEach(function (k) {
      var key = prefix + k;
      zh[key] = zhObj[k];
      en[key] = enObj[k];
      if (!jaObj) ja[key] = enObj[k];
      else ja[key] = jaObj[k] != null ? jaObj[k] : enObj[k];
    });
  }

  var zh = {
    guideDangerDefaultAdvice: '請持續紀錄、隔離觀察、調整環境，必要時尋求獸醫或專業協助。此內容不能取代專業診斷。',
    guideActionReminder: '建立提醒',
    guideActionPhoto: '拍照',
    guideAccQuickStart: '快速入門',
    guideAccDailyCare: '今日照護',
    guideAccWeeklyMonthly: '每週 / 每月照護',
    guideAccLifeStage: '生命階段',
    guideAccEmergency: '異常下一步',
    guideAccSetup: '初次設定',
    guideAccSuitable: '適合對象',
    guideCenterBeginnerTips: '今日新手建議',
    guideCenterDangerWatch: '需注意徵兆',
    guideCenterTutorialPending: '未完成教學步驟',
    guideCenterRecCards: '推薦教學',
    guideSeverity_observe: '觀察',
    guideSeverity_warning: '注意',
    guideSeverity_urgent: '緊急',
    guideSectionEmpty_quickstart: '尚無快速入門內容。',
    guideSectionEmpty_dailycare: '尚無今日照護清單。',
    guideSectionEmpty_weeklymonthly: '尚無每週 / 每月照護清單。',
    guideSectionEmpty_lifestage: '尚無生命階段建議。',
    guideSectionEmpty_emergency: '尚無異常處置建議。',
    guideTpl_firstDayLabel: '第一天',
    guideTpl_firstWeekLabel: '第一週',
    guideTpl_avoidLabel: '立即避免',
    guideCareWeeklyLabel: '每週照護',
    guideCareMonthlyLabel: '每月照護',
    guidePriority_required: '必要',
    guidePriority_recommended: '建議',
    guidePriority_optional: '選配',
  };

  var en = {
    guideDangerDefaultAdvice: 'Keep logging, isolate if needed, adjust the environment, and seek professional help when appropriate. This is not a diagnosis.',
    guideActionReminder: 'Set reminder',
    guideActionPhoto: 'Take photo',
    guideAccQuickStart: 'Quick start',
    guideAccDailyCare: 'Daily care',
    guideAccWeeklyMonthly: 'Weekly / monthly',
    guideAccLifeStage: 'Life stages',
    guideAccEmergency: 'If something seems wrong',
    guideAccSetup: 'Initial setup',
    guideAccSuitable: 'Suitable for',
    guideCenterBeginnerTips: 'Beginner tips today',
    guideCenterDangerWatch: 'Watch for',
    guideCenterTutorialPending: 'Tutorial steps pending',
    guideCenterRecCards: 'Recommended guides',
    guideSeverity_observe: 'Observe',
    guideSeverity_warning: 'Warning',
    guideSeverity_urgent: 'Urgent',
    guideSectionEmpty_quickstart: 'No quick start content yet.',
    guideSectionEmpty_dailycare: 'No daily checklist yet.',
    guideSectionEmpty_weeklymonthly: 'No weekly/monthly checklist yet.',
    guideSectionEmpty_lifestage: 'No life-stage tips yet.',
    guideSectionEmpty_emergency: 'No emergency guidance yet.',
    guideTpl_firstDayLabel: 'First day',
    guideTpl_firstWeekLabel: 'First week',
    guideTpl_avoidLabel: 'Avoid immediately',
    guideCareWeeklyLabel: 'Weekly care',
    guideCareMonthlyLabel: 'Monthly care',
    guidePriority_required: 'Required',
    guidePriority_recommended: 'Recommended',
    guidePriority_optional: 'Optional',
  }

  var ja = {
    guideDangerDefaultAdvice: "記録を続け、必要なら隔離・環境調整をし、適切な場合は専門家に相談してください。診断の代替ではありません。",
    guideActionReminder: "リマインダーを設定",
    guideActionPhoto: "写真を撮る",
    guideAccQuickStart: "クイックスタート",
    guideAccDailyCare: "デイリーケア",
    guideAccWeeklyMonthly: "毎週／毎月",
    guideAccLifeStage: "ライフステージ",
    guideAccEmergency: "異常時の次のステップ",
    guideAccSetup: "初期設定",
    guideAccSuitable: "適した対象",
    guideCenterBeginnerTips: "本日の初心者ヒント",
    guideCenterDangerWatch: "注意する兆候",
    guideCenterTutorialPending: "未完了のチュートリアル手順",
    guideCenterRecCards: "おすすめガイド",
    guideSeverity_observe: "観察",
    guideSeverity_warning: "注意",
    guideSeverity_urgent: "緊急",
    guideSectionEmpty_quickstart: "まだありません：快速入門内容。",
    guideSectionEmpty_dailycare: "まだありません：本日照護清單。",
    guideSectionEmpty_weeklymonthly: "まだありません：每週 / 每月照護清單。",
    guideSectionEmpty_lifestage: "まだありません：生命階段アドバイス。",
    guideSectionEmpty_emergency: "まだありません：異常處置アドバイス。",
    guideTpl_firstDayLabel: "初日",
    guideTpl_firstWeekLabel: "初週",
    guideTpl_avoidLabel: "直ちに避ける",
    guideCareWeeklyLabel: "毎週のケア",
    guideCareMonthlyLabel: "毎月のケア",
    guidePriority_required: "必須",
    guidePriority_recommended: "推奨",
    guidePriority_optional: "任意",
  };;;

  function frogZh() {
    return {
      quickStart_title: '蛙類快速入門',
      quickStart_points: '第一天先確認濕度、躲避處與乾淨水源。\n不要頻繁把玩，避免皮膚接觸化學物質。\n先觀察進食反應與活動力。\n前一週每天拍照或簡單紀錄一次狀態。',
      quickStart_day1: '確認噴水 / 浸泡區運作正常。\n移除前一日未吃完的餌料。\n記錄濕度與一次進食反應。',
      quickStart_week1: '建立固定觀察時間。\n每 2–3 天拍照紀錄體態。\n確認基質未發霉或過乾。',
      quickStart_avoid: '不要直接使用含氯自來水。\n不要過度把玩。\n不要一次大幅改變溫濕度。',
      dailyCare: '檢查濕度\n觀察皮膚與眼睛\n觀察進食反應\n移除未吃完餌料\n簡短紀錄異常',
      weeklyCare: '體重或體態拍照\n整理基質與排泄\n檢查溫濕度計\n檢查設備與通風\n回顧本週餵食',
      monthlyCare: '回顧體重 / 體態趨勢\n回顧餵食狀況\n評估環境是否需要調整\n匯出紀錄\n更新飼養檔案',
      suitableFor: '願意每日觀察的新手\n能維持穩定濕度者\n不頻繁把玩的飼主',
      notSuitableFor: '無法每日簡短觀察者\n希望頻繁上手把玩者',
      purchaseChecklist: '保濕基質\n躲避處\n溫濕度計\n無氯水源\n適口活餌或飼料',
      emergencyAdvice: '若持續拒食或皮膚異常：隔離、拍照紀錄、檢查水質與濕度，必要時尋求兩棲專長獸醫。',
      setup_1_title: '準備乾淨水源', setup_1_desc: '使用無氯水，避免化學殘留。', setup_1_priority: 'required', setup_1_record: 'humidity',
      setup_2_title: '穩定濕度環境', setup_2_desc: '設定可保濕基質與通風平衡。', setup_2_priority: 'required', setup_2_record: 'humidity',
      setup_3_title: '設置躲避處', setup_3_desc: '提供可減壓的深色躲避。', setup_3_priority: 'required', setup_3_record: 'photo',
      setup_4_title: '溫濕度計', setup_4_desc: '方便每日快速確認。', setup_4_priority: 'recommended', setup_4_record: 'temperature',
      setup_5_title: '餵食計畫', setup_5_desc: '餌料大小不超過頭部寬度太多。', setup_5_priority: 'recommended', setup_5_record: 'feeding',
      danger_1: 'warning|持續拒食|記錄進食與環境，若超過 3 天仍拒食請尋求協助|feeding',
      danger_2: 'urgent|皮膚紅斑 / 潰爛|立即隔離、拍照、停止把玩，尋求專業協助|skin',
      danger_3: 'urgent|浮腫|記錄體態與水質，盡快就醫|abnormality',
      danger_4: 'warning|活動力明顯下降|檢查溫濕度並紀錄，持續惡化請就醫|activity',
      danger_5: 'urgent|呼吸異常|減少壓力、保持通風，盡快尋求專業協助|abnormality',
      stage_juvenile: '幼體餵食頻率可略高，注意成長與蛻皮。\n避免餌料過大。',
      stage_adult: '維持體態，避免過胖。\n定期紀錄濕度與進食。',
      tutorial_1: '確認濕度與水源',
      tutorial_2: '完成第一次進食紀錄',
      tutorial_3: '拍一張狀態照片',
      tutorial_4: '建立每週回顧習慣',
    };
  }

  function frogEn() {
    return {
      quickStart_title: 'Frog quick start',
      quickStart_points: 'Day 1: confirm humidity, hides, and clean water.\nAvoid frequent handling and skin contact with chemicals.\nWatch feeding response and activity first.\nLog or photo daily for the first week.',
      quickStart_day1: 'Check misting/soak areas.\nRemove uneaten prey.\nLog humidity and one feeding response.',
      quickStart_week1: 'Set a fixed observation time.\nPhoto body condition every 2–3 days.\nEnsure substrate is not moldy or too dry.',
      quickStart_avoid: 'Do not use untreated chlorinated tap water.\nDo not over-handle.\nDo not swing temperature/humidity sharply.',
      dailyCare: 'Check humidity\nObserve skin and eyes\nWatch feeding response\nRemove uneaten food\nLog anything unusual',
      weeklyCare: 'Weight or body photo\nSubstrate and waste check\nVerify hygrometer/thermometer\nEquipment and ventilation\nReview feeding log',
      monthlyCare: 'Review weight/body trends\nReview feeding patterns\nAdjust setup if needed\nExport logs\nUpdate care profile',
      suitableFor: 'Beginners who can observe daily\nKeepers who maintain stable humidity\nHandlers who minimize touching',
      notSuitableFor: 'Cannot check daily\nWant frequent handling',
      purchaseChecklist: 'Moist substrate\nHides\nThermometer/hygrometer\nDechlorinated water\nAppropriately sized prey',
      emergencyAdvice: 'If refusal to eat or skin lesions persist: isolate, photo-log, check water and humidity, consult an amphibian-experienced vet.',
      setup_1_title: 'Clean water source', setup_1_desc: 'Dechlorinated water only.', setup_1_priority: 'required', setup_1_record: 'humidity',
      setup_2_title: 'Stable humidity', setup_2_desc: 'Balance moisture and airflow.', setup_2_priority: 'required', setup_2_record: 'humidity',
      setup_3_title: 'Provide hides', setup_3_desc: 'Dark retreats reduce stress.', setup_3_priority: 'required', setup_3_record: 'photo',
      setup_4_title: 'Thermo/hygrometer', setup_4_desc: 'For quick daily checks.', setup_4_priority: 'recommended', setup_4_record: 'temperature',
      setup_5_title: 'Feeding plan', setup_5_desc: 'Prey not much wider than head.', setup_5_priority: 'recommended', setup_5_record: 'feeding',
      danger_1: 'warning|Persistent refusal to eat|Log intake and environment; seek help if >3 days|feeding',
      danger_2: 'urgent|Red patches or skin ulcers|Isolate, photo, stop handling, seek professional help|skin',
      danger_3: 'urgent|Swelling/bloating|Log body and water quality; vet promptly|abnormality',
      danger_4: 'warning|Marked lethargy|Check temps/humidity; vet if worsening|activity',
      danger_5: 'urgent|Abnormal breathing|Reduce stress, ensure airflow; seek professional help|abnormality',
      stage_juvenile: 'Feed slightly more often; watch growth and shed.\nAvoid oversized prey.',
      stage_adult: 'Maintain body condition; avoid obesity.\nLog humidity and feeding regularly.',
      tutorial_1: 'Confirm humidity and water',
      tutorial_2: 'Log first feeding',
      tutorial_3: 'Take a status photo',
      tutorial_4: 'Build a weekly review habit',
    };
  }

  ['frog', 'toad', 'aquatic_amphibian', 'beetle_adult', 'beetle_larva', 'insect_other',
    'gecko', 'snake', 'lizard', 'tortoise', 'aquatic_turtle',
    'freshwater_fish', 'freshwater_other', 'marine_fish', 'marine_reef', 'marine_hermit',
    'finch', 'parrot', 'chick', 'bird_other',
    'hamster', 'rabbit', 'mammal_other',
    'tarantula', 'isopod', 'arthropod_other',
    'terrarium', 'plant', 'general'].forEach(function (name) {
    var zhBase = frogZh();
    var enBase = frogEn();
    if (name === 'beetle_adult') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '甲蟲成蟲快速入門',
        quickStart_points: '先確認木屑 / 基質濕度。\n成蟲需要果凍、攀爬物與防翻倒空間。\n觀察活動力與進食。\n配對期注意互動與產卵紀錄。',
        dailyCare: '檢查果凍是否乾掉\n確認未翻倒\n觀察活動力\n移除發霉食物\n紀錄異常',
        weeklyCare: '體重紀錄\n基質濕度檢查\n清理排泄\n檢查通風\n拍照',
        danger_1: 'warning|長時間不動|記錄環境溫濕度與基質狀態|insect_status',
        danger_2: 'urgent|無法翻身|調整配置、減少干擾，持續觀察|insect_status',
        danger_3: 'warning|足部缺損|拍照紀錄、隔離觀察，必要時尋求協助|abnormality',
        danger_4: 'warning|發霉環境|更換基質、改善通風，移除發霉食物|substrate',
        danger_5: 'warning|拒食|記錄進食與環境，持續拒食請尋求協助|feeding',
        stage_adult: '注意果凍、活動力、防翻倒。\n配對時記錄行為。',
        stage_egg: '避免頻繁翻動產卵處。',
        stage_larva: '見幼蟲指南。',
        stage_breeding: '記錄配對、產卵與孵化環境。',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Beetle adult quick start',
        quickStart_points: 'Check substrate moisture first.\nAdults need jelly, climbing decor, and anti-tip setup.\nWatch activity and feeding.\nLog pairing and egg-laying when breeding.',
        dailyCare: 'Check jelly dryness\nEnsure not stuck upside-down\nWatch activity\nRemove moldy food\nLog issues',
        weeklyCare: 'Weight log\nSubstrate moisture\nWaste cleanup\nVentilation check\nPhoto',
        danger_1: 'warning|Long inactivity|Log temperature, humidity, and substrate|insect_status',
        danger_2: 'urgent|Unable to right itself|Adjust layout; reduce disturbance; keep watching|insect_status',
        danger_3: 'warning|Missing leg segments|Photo-log, isolate, seek help if needed|abnormality',
        danger_4: 'warning|Moldy environment|Replace substrate, improve airflow, remove moldy food|substrate',
        danger_5: 'warning|Refusal to eat|Log intake and environment; seek help if persistent|feeding',
        stage_adult: 'Monitor jelly, activity, tipping risk.\nLog behavior when breeding.',
        stage_egg: 'Avoid disturbing egg sites.',
        stage_larva: 'See larva guide.',
        stage_breeding: 'Log pairing, laying, and incubation.',
      });
    }
    if (name === 'beetle_larva') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '甲蟲幼蟲快速入門',
        quickStart_points: '先確認木屑 / 菌瓶 / 基質狀態。\n不要頻繁挖出檢查。\n定期記錄重量。\n化蛹前保持穩定溫濕度。',
        dailyCare: '目視基質表面\n確認無過乾 / 過濕\n不要打擾\n紀錄異常氣味\n簡短筆記',
        weeklyCare: '體重紀錄\n檢查基質消耗\n通風檢查\n拍照\n更新生命階段',
        stage_larva: '定期記錄重量，注意木屑 / 菌瓶狀態。\n避免頻繁翻動。',
        stage_pupa: '避免打擾，保持穩定濕度。\n不要移動容器。',
        danger_1: 'warning|長時間不動|目視基質，不要頻繁翻動|insect_status',
        danger_2: 'warning|拒食|記錄基質消耗與環境|feeding',
        danger_3: 'warning|發霉環境|更換基質、改善通風|substrate',
        danger_4: 'urgent|幼蟲變色或異味|隔離觀察、拍照，必要時尋求協助|abnormality',
        danger_5: 'warning|足部缺損|拍照紀錄並持續觀察|abnormality',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Beetle larva quick start',
        quickStart_points: 'Check substrate/flask condition first.\nDo not dig up larvae frequently.\nLog weight on schedule.\nKeep stable conditions before pupation.',
        dailyCare: 'Visual substrate check\nAvoid too dry/wet\nMinimize disturbance\nNote odd odors\nBrief notes',
        weeklyCare: 'Weight log\nSubstrate consumption\nVentilation\nPhoto\nUpdate life stage',
        stage_larva: 'Log weight; monitor substrate/flask.\nAvoid frequent digging.',
        stage_pupa: 'Do not disturb; keep humidity stable.\nDo not move container.',
        danger_1: 'warning|Long inactivity|Visual substrate check; minimize digging|insect_status',
        danger_2: 'warning|Refusal to eat|Log substrate consumption and environment|feeding',
        danger_3: 'warning|Moldy environment|Replace substrate; improve ventilation|substrate',
        danger_4: 'urgent|Larva discoloration or odor|Isolate, photo, seek help if needed|abnormality',
        danger_5: 'warning|Missing leg segments|Photo-log and keep watching|abnormality',
      });
    }
    if (name === 'gecko' || name === 'lizard' || name === 'snake' || name === 'tortoise') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '爬蟲快速入門',
        quickStart_points: '先確認熱點、冷區、濕度與躲避處。\n有 UVB 需求者建立光照週期。\n新到家初期不要頻繁把玩。\n先記錄體重與第一次進食。',
        dailyCare: '檢查熱點 / 冷區\n觀察進食\n檢查排泄\n確認水盆\n紀錄異常',
        weeklyCare: '體重\n清潔環境\n檢查蛻皮 / 殼\n檢查 UVB / 加熱\n拍照',
        danger_1: 'warning|長期拒食加體重下降|記錄溫度梯度與進食|weight',
        danger_2: 'warning|肢體無力|減少把玩、拍照紀錄，持續惡化請就醫|activity',
        danger_3: 'urgent|呼吸異常|減少壓力，盡快就醫|abnormality',
        danger_4: 'warning|嚴重脫皮殘留|增加濕度、勿強扯，必要時尋求協助|shedding',
        danger_5: 'warning|排泄異常|記錄排泄狀況與環境，持續異常請就醫|stool',
        stage_juvenile: '餵食頻率較高，注意補鈣與成長。',
        stage_adult: '維持體重與餵食週期。',
        stage_breeding: '記錄配對、產卵與母體狀態。',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Reptile quick start',
        quickStart_points: 'Confirm hot/cool zones, humidity, and hides.\nSet a photoperiod if UVB is required.\nMinimize handling when newly arrived.\nLog weight and first feeding.',
        dailyCare: 'Check hot/cool zones\nWatch feeding\nCheck waste\nWater dish\nLog issues',
        weeklyCare: 'Weight\nEnclosure cleaning\nShed/shell check\nUVB/heat check\nPhoto',
        danger_1: 'warning|Refusal to eat with weight loss|Log gradient and feeding|weight',
        danger_2: 'warning|Limb weakness|Minimize handling; photo-log; vet if worsening|activity',
        danger_3: 'urgent|Abnormal breathing|Reduce stress; vet promptly|abnormality',
        danger_4: 'warning|Severe retained shed|Raise humidity; do not pull; seek help if needed|shedding',
        danger_5: 'warning|Abnormal droppings|Log waste and environment; vet if persistent|stool',
        stage_juvenile: 'Feed more often; calcium and growth matter.',
        stage_adult: 'Maintain weight and feeding schedule.',
        stage_breeding: 'Log pairing, eggs, and female condition.',
      });
    }
    if (name === 'freshwater_fish' || name === 'freshwater_other') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '淡水水族快速入門',
        quickStart_points: '先確認水體穩定，不要急著大量餵食。\n優先檢查水溫、pH、氨、亞硝酸鹽。\n換水不要一次變動太大。\n新魚觀察呼吸、食慾、體表。',
        dailyCare: '觀察游動與呼吸\n檢查餵食量\n移除殘餌\n目視魚體\n紀錄異常',
        weeklyCare: '水質檢測\n部分換水\n清潔過濾棉（勿全換）\n設備檢查\n拍照',
        danger_1: 'urgent|浮頭|立即檢查溶氧與氨氮|ammonia',
        danger_2: 'warning|快速呼吸|記錄水溫與水質|water_temp',
        danger_3: 'urgent|體表白點 / 潰爛|隔離、拍照、檢測水質|skin',
        danger_4: 'urgent|失衡|減少驚嚇、檢查水質與溫度|activity',
        danger_5: 'urgent|集體異常|停止餵食、測水、隔離觀察|abnormality',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Freshwater quick start',
        quickStart_points: 'Stabilize water before heavy feeding.\nCheck temperature, pH, ammonia, nitrite.\nAvoid large sudden water changes.\nWatch respiration, appetite, and body condition.',
        dailyCare: 'Watch swimming and breathing\nFeed appropriately\nRemove leftovers\nVisual body check\nLog issues',
        weeklyCare: 'Water tests\nPartial water change\nFilter maintenance (not full swap)\nEquipment check\nPhoto',
        danger_1: 'urgent|Gasping at surface|Check oxygen and ammonia|ammonia',
        danger_2: 'warning|Rapid breathing|Log temp and water quality|water_temp',
        danger_3: 'urgent|White spots or ulcers|Isolate, photo, test water|skin',
        danger_4: 'urgent|Loss of balance|Reduce stress; check water and temperature|activity',
        danger_5: 'urgent|Group-wide issues|Stop feeding; test water; isolate and watch|abnormality',
      });
    }
    if (name === 'marine_fish' || name === 'marine_reef' || name === 'marine_hermit') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '海水水族快速入門',
        quickStart_points: '確認鹽度、溫度與循環穩定。\n不要過量餵食。\n定期檢測鈣、鹼度、硝酸鹽。\n新生物觀察開口、游動與體表。',
        dailyCare: '觀察游動 / 開口\n控制餵食\n檢查設備\n目視異常\n簡短紀錄',
        weeklyCare: '水質全套檢測\n換水\n清潔蛋白分離器杯\n設備檢查\n拍照',
        danger_1: 'warning|食慾驟降|記錄水質與鹽度|salinity',
        danger_2: 'urgent|呼吸急促 / 失衡|隔離、測水、尋求協助|abnormality',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Marine quick start',
        quickStart_points: 'Confirm salinity, temperature, and flow.\nDo not overfeed.\nTest calcium, alkalinity, nutrients regularly.\nWatch opening, swimming, and tissue condition.',
        dailyCare: 'Watch swimming/opening\nFeed carefully\nEquipment check\nVisual issues\nBrief log',
        weeklyCare: 'Full water tests\nWater change\nSkimmer cup cleaning\nEquipment check\nPhoto',
        danger_1: 'warning|Sudden appetite loss|Log salinity and nutrients|salinity',
        danger_2: 'urgent|Labored breathing / loss of balance|Isolate, test water, seek help|abnormality',
      });
    }
    if (name === 'marine_reef') {
      zhBase = Object.assign(zhBase, {
        danger_1: 'warning|縮肉|記錄水質與光照，減少擾動|coral_open',
        danger_2: 'warning|褪色|檢測營養鹽與光照，拍照比對|aquarium_light',
        danger_3: 'urgent|組織脫落|隔離、測水、尋求協助|abnormality',
        danger_4: 'warning|長時間不開|檢查水流、光照與水質|coral_open',
        danger_5: 'warning|水質參數劇烈波動|暫停大量換水，逐步調整|kh',
      });
      enBase = Object.assign(enBase, {
        danger_1: 'warning|Retracted tissue|Log water and lighting; minimize disturbance|coral_open',
        danger_2: 'warning|Bleaching|Test nutrients and lighting; photo for comparison|aquarium_light',
        danger_3: 'urgent|Tissue sloughing|Isolate, test water, seek help|abnormality',
        danger_4: 'warning|Closed for extended time|Check flow, lighting, and water quality|coral_open',
        danger_5: 'warning|Sharp parameter swings|Pause large changes; adjust gradually|kh',
      });
    }
    if (name === 'finch' || name === 'parrot' || name === 'chick' || name === 'bird_other') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '鳥類快速入門',
        quickStart_points: '先觀察食慾、排泄、羽毛與精神。\n避免油煙、香氛、特氟龍高溫煙霧。\n體重變化很重要。\n異常炸毛或閉眼不動要盡快處理。',
        dailyCare: '檢查食物與飲水\n觀察排泄\n觀察精神與羽毛\n清潔托盤\n紀錄異常',
        weeklyCare: '體重\n籠舍清潔\n棲木檢查\n設備安全\n拍照',
        danger_1: 'urgent|炸毛閉眼|保溫、隔離、立即就醫|activity',
        danger_2: 'urgent|呼吸急促|減少驚嚇，尋求鳥類獸醫|abnormality',
        danger_3: 'warning|持續拒食|記錄進食與排泄，超過 1 天請就醫|feeding',
        danger_4: 'warning|排泄異常|拍照紀錄、保溫觀察|stool',
        danger_5: 'warning|站姿不穩|減少驚嚇、隔離觀察|activity',
        stage_chick: '保溫、餵食頻率、體重變化 — 高風險。',
        stage_adult: '食慾、羽毛、排泄、活動力。',
        stage_breeding: '巢箱、產蛋、親鳥壓力、幼鳥狀態。',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Bird quick start',
        quickStart_points: 'Watch appetite, droppings, feathers, and spirit.\nAvoid kitchen smoke, fragrance, and PTFE fumes.\nWeight trends matter.\nFluffed and unresponsive needs urgent care.',
        dailyCare: 'Food and water\nDroppings\nSpirit and feathers\nTray cleaning\nLog issues',
        weeklyCare: 'Weight\nCage cleaning\nPerch check\nSafety check\nPhoto',
        danger_1: 'urgent|Fluffed and eyes closed|Warm, isolate, vet immediately|activity',
        danger_2: 'urgent|Labored breathing|Reduce stress; avian vet|abnormality',
        danger_3: 'warning|Persistent refusal to eat|Log intake and droppings; vet if >1 day|feeding',
        danger_4: 'warning|Abnormal droppings|Photo-log; keep warm and watch|stool',
        danger_5: 'warning|Unsteady posture|Reduce stress; isolate and observe|activity',
        stage_chick: 'Warmth, frequent feeding, weight — high risk.',
        stage_adult: 'Appetite, feathers, droppings, activity.',
        stage_breeding: 'Nest box, eggs, parent stress, chick status.',
      });
    }
    if (name === 'rabbit') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '兔子高風險照護入門',
        quickStart_points: '拒食可能是緊急狀況。\n確認飲水、乾草、排泄。\n每週量體重。\n注意腹脹與無排便。',
        danger_1: 'urgent|拒食|記錄進食與排泄，盡快尋求獸醫協助|feeding',
        danger_2: 'urgent|無排便|緊急就醫|stool',
        danger_3: 'urgent|腹脹|不要延誤就醫|abnormality',
        danger_4: 'urgent|呼吸異常|保溫、減少驚嚇，立即就醫|abnormality',
        danger_5: 'warning|活動力極低|量體重、保溫觀察|activity',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Rabbit high-risk quick start',
        quickStart_points: 'Refusal to eat may be an emergency.\nConfirm water, hay, and droppings.\nWeigh weekly.\nWatch for bloat and no droppings.',
        danger_1: 'urgent|Refusal to eat|Log intake and droppings; seek vet help promptly|feeding',
        danger_2: 'urgent|No droppings|Emergency vet|stool',
        danger_3: 'urgent|Bloated abdomen|Do not delay vet care|abnormality',
        danger_4: 'urgent|Abnormal breathing|Keep warm; reduce stress; vet immediately|abnormality',
        danger_5: 'warning|Very low activity|Weigh; keep warm and watch|activity',
      });
    }
    if (name === 'hamster' || name === 'mammal_other') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '小型哺乳類快速入門',
        quickStart_points: '先確認飲水、食物、躲避處與清潔。\n每週固定量體重。\n注意排泄與活動力。\n兔子、天竺鼠拒食可能是高風險。',
        dailyCare: '食物與飲水\n活動力\n排泄\n墊材狀態\n紀錄異常',
        weeklyCare: '體重\n清潔\n設備安全\n拍照\n更新檔案',
        danger_1: 'warning|拒食|記錄進食與排泄，持續拒食請就醫|feeding',
        danger_2: 'urgent|無排便|量體重、保溫，盡快就醫|stool',
        danger_3: 'urgent|腹脹|不要延誤就醫|abnormality',
        danger_4: 'urgent|呼吸異常|減少驚嚇、保溫，立即就醫|abnormality',
        danger_5: 'warning|活動力極低|量體重、隔離觀察|activity',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Small mammal quick start',
        quickStart_points: 'Confirm water, food, hides, and cleanliness.\nWeigh weekly on schedule.\nWatch droppings and activity.\nRabbits/guinea pigs: refusal to eat is high risk.',
        dailyCare: 'Food and water\nActivity\nDroppings\nBedding condition\nLog issues',
        weeklyCare: 'Weight\nCleaning\nSafety check\nPhoto\nUpdate profile',
        danger_1: 'warning|Refusal to eat|Log intake and droppings; vet if persistent|feeding',
        danger_2: 'urgent|No droppings|Weigh, keep warm; vet promptly|stool',
        danger_3: 'urgent|Bloated abdomen|Do not delay vet care|abnormality',
        danger_4: 'urgent|Abnormal breathing|Reduce stress; keep warm; vet immediately|abnormality',
        danger_5: 'warning|Very low activity|Weigh; isolate and watch|activity',
      });
    }
    if (name === 'tarantula' || name === 'isopod' || name === 'arthropod_other') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '特殊節肢類快速入門',
        quickStart_points: '確認濕度、通風與防逃。\n蛻皮期避免餵食與打擾。\n等足目維持濕區。\n記錄蛻皮成功或失敗。',
        dailyCare: '目視狀態\n確認防逃\n濕度快速檢查\n不要打擾蛻皮\n紀錄異常',
        weeklyCare: '基質 / 濕度\n餵食紀錄\n拍照\n設備檢查\n更新檔案',
        danger_1: 'warning|蛻皮失敗|增加濕度、勿打擾，必要時求助|molt',
        danger_2: 'warning|長期拒食搭配異常姿勢|記錄濕度與姿勢，持續惡化請求助|feeding',
        danger_3: 'warning|活餌攻擊|改用預殺餌料、減少干擾|feeding',
        danger_4: 'urgent|逃脫風險|檢查蓋子與縫隙，立即加固|note',
        danger_5: 'urgent|高風險物種徒手接觸警示|使用工具、保持距離，勿徒手抓取|note',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Arthropod quick start',
        quickStart_points: 'Confirm humidity, ventilation, and escape-proofing.\nDo not feed or disturb during molt.\nIsopods need a moist zone.\nLog successful or failed molts.',
        dailyCare: 'Visual check\nEscape-proofing\nQuick humidity check\nDo not disturb molt\nLog issues',
        weeklyCare: 'Substrate/humidity\nFeeding log\nPhoto\nEquipment\nUpdate profile',
        danger_1: 'warning|Failed molt|Raise humidity; do not disturb; seek help if needed|molt',
        danger_2: 'warning|Long refusal to eat with odd posture|Log humidity and posture; seek help if worsening|feeding',
        danger_3: 'warning|Live prey aggression|Use pre-killed prey; reduce disturbance|feeding',
        danger_4: 'urgent|Escape risk|Check lid and gaps; secure immediately|note',
        danger_5: 'urgent|High-risk species — bare-hand warning|Use tools; keep distance; do not grab bare-handed|note',
      });
    }
    if (name === 'terrarium' || name === 'plant') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '生態缸 / 植物快速入門',
        quickStart_points: '確認濕度、通風與光照。\n觀察植物與黴菌。\n建立澆水 / 噴水節奏。\n避免悶罐。',
        dailyCare: '目視植物\n檢查濕度\n通風\n黴菌\n簡短紀錄',
        weeklyCare: '修剪\n清潔\n設備\n拍照\n更新檔案',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Terrarium / plant quick start',
        quickStart_points: 'Confirm humidity, airflow, and lighting.\nWatch plants and mold.\nSet a watering/misting rhythm.\nAvoid sealed stagnation.',
        dailyCare: 'Plant visual\nHumidity\nAirflow\nMold check\nBrief log',
        weeklyCare: 'Trimming\nCleaning\nEquipment\nPhoto\nUpdate profile',
      });
    }
    if (name === 'aquatic_amphibian') {
      zhBase = Object.assign(zhBase, {
        quickStart_title: '水棲兩棲快速入門',
        quickStart_points: '先確認水溫與水質穩定。\n檢查氨、亞硝酸鹽。\n緩慢換水。\n觀察鰓、游動與食慾。',
        dailyCare: '水溫\n目視鰓部\n餵食後除殘餌\n游動平衡\n紀錄異常',
        weeklyCare: '全套水質\n換水\n過濾檢查\n拍照\n更新檔案',
        danger_1: 'urgent|鰓縮短或發白|檢查水質與溫度，拍照紀錄|gill',
        danger_2: 'urgent|浮水|檢查水溫、氨氮與溶氧|ammonia',
        danger_3: 'urgent|身體失衡|減少驚嚇、測水、隔離觀察|activity',
        danger_4: 'urgent|皮膚破損|隔離、拍照、改善水質|skin',
        danger_5: 'warning|拒食|記錄進食與水質，持續拒食請就醫|feeding',
      });
      enBase = Object.assign(enBase, {
        quickStart_title: 'Aquatic amphibian quick start',
        quickStart_points: 'Stabilize temperature and water quality first.\nTest ammonia and nitrite.\nChange water gradually.\nWatch gills, balance, and appetite.',
        dailyCare: 'Water temp\nGill visual\nRemove leftovers\nSwimming balance\nLog issues',
        weeklyCare: 'Full water tests\nWater change\nFilter check\nPhoto\nUpdate profile',
        danger_1: 'urgent|Shortened or pale gills|Check water and temperature; photo-log|gill',
        danger_2: 'urgent|Floating at surface|Check temperature, ammonia, and oxygen|ammonia',
        danger_3: 'urgent|Loss of balance|Reduce stress; test water; isolate|activity',
        danger_4: 'urgent|Skin damage|Isolate, photo, improve water quality|skin',
        danger_5: 'warning|Refusal to eat|Log intake and water quality; vet if persistent|feeding',
      });
    }
    tplBlock('guideTpl_' + name + '_', zhBase, enBase);
  });

  var base = global.MCHusbandryLogI18n;
  if (!base) return;
  Object.keys(zh).forEach(function (k) {
    base.zhTW[k] = zh[k];
    base.en[k] = en[k];
    if (!base.ja) base.ja = {};
    base.ja[k] = ja[k];
  });
})(typeof window !== 'undefined' ? window : this);
