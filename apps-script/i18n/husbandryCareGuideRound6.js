/**
 * Round 6: care-guide template bodies in ja-JP and de-DE.
 * Loaded after husbandryCareGuideEnrichI18n.js, which otherwise copies English into Japanese.
 */
(function (global) {
  'use strict';

  var base = global.MCHusbandryLogI18n;
  if (!base) return;
  if (!base.ja) base.ja = {};
  if (!base.de) base.de = {};

  function put(name, jaObj, deObj) {
    var prefix = 'guideTpl_' + name + '_';
    Object.keys(jaObj).forEach(function (k) {
      base.ja[prefix + k] = jaObj[k];
    });
    Object.keys(deObj).forEach(function (k) {
      base.de[prefix + k] = deObj[k];
    });
  }

  function frogJa() {
    return {
      quickStart_title: 'カエルのクイックスタート',
      quickStart_points: '初日は湿度、隠れ家、きれいな水を確認する。\n頻繁に触らず、皮膚に化学物質が付かないようにする。\nまず摂食反応と活動を見る。\n最初の1週間は毎日記録か写真を残す。',
      quickStart_day1: 'ミスティングや浸水場所を確認する。\n食べ残しを取り除く。\n湿度と摂食反応を1回記録する。',
      quickStart_week1: '観察する時間を決める。\n2–3日ごとに体型を撮影する。\n床材がカビたり乾きすぎたりしていないか確認する。',
      quickStart_avoid: 'カルキ抜きしていない水道水を直接使わない。\n触りすぎない。\n温度と湿度を一度に大きく変えない。',
      dailyCare: '湿度を確認\n皮膚と目を見る\n摂食反応を見る\n食べ残しを取り除く\n異常を短く記録',
      weeklyCare: '体重または体型の写真\n床材と排泄\n温湿度計\n設備と通気\n給餌記録の見直し',
      monthlyCare: '体重と体型の推移\n給餌の傾向\n必要なら環境を調整\n記録を書き出す\n飼育メモを更新',
      suitableFor: '毎日観察できる初心者\n湿度を安定させられる人\nあまり触らない飼育者',
      notSuitableFor: '毎日の短い確認ができない人\n頻繁に触りたい人',
      purchaseChecklist: '保湿できる床材\n隠れ家\n温湿度計\nカルキ抜きした水\n頭幅に合った餌',
      emergencyAdvice: '拒食や皮膚の異常が続く場合は隔離し、写真を残し、水質と湿度を確認し、両生類に詳しい獣医に相談する。',
      setup_1_title: 'きれいな水を用意', setup_1_desc: 'カルキ抜きした水だけを使う。', setup_1_priority: 'required', setup_1_record: 'humidity',
      setup_2_title: '安定した湿度', setup_2_desc: '保湿と通気のバランスを取る。', setup_2_priority: 'required', setup_2_record: 'humidity',
      setup_3_title: '隠れ家を置く', setup_3_desc: '暗い退避場所でストレスを下げる。', setup_3_priority: 'required', setup_3_record: 'photo',
      setup_4_title: '温湿度計', setup_4_desc: '毎日すぐ確認できる。', setup_4_priority: 'recommended', setup_4_record: 'temperature',
      setup_5_title: '給餌計画', setup_5_desc: '餌は頭幅を大きく超えない。', setup_5_priority: 'recommended', setup_5_record: 'feeding',
      danger_1: 'warning|拒食が続く|摂食と環境を記録し、3日を超えたら相談する|feeding',
      danger_2: 'urgent|皮膚の赤み・潰瘍|隔離し、撮影し、触るのをやめ、専門家に相談する|skin',
      danger_3: 'urgent|むくみ|体型と水質を記録し、早めに受診する|abnormality',
      danger_4: 'warning|活動の明らかな低下|温湿度を確認して記録し、悪化するなら受診する|activity',
      danger_5: 'urgent|呼吸の異常|ストレスを減らし、通気を確保し、早めに専門家へ|abnormality',
      stage_juvenile: '幼体は給餌をやや多めにし、成長と脱皮を見る。\n大きすぎる餌は避ける。',
      stage_adult: '体型を維持し、肥満を避ける。\n湿度と給餌を定期的に記録する。',
      tutorial_1: '湿度と水を確認する',
      tutorial_2: '最初の給餌を記録する',
      tutorial_3: '状態の写真を撮る',
      tutorial_4: '週に一度、記録を見直す',
    };
  }

  function frogDe() {
    return {
      quickStart_title: 'Schnellstart Frosch',
      quickStart_points: 'Tag 1: Feuchte, Verstecke und sauberes Wasser prüfen.\nWenig anfassen und Hautkontakt mit Chemikalien vermeiden.\nZuerst Fressreaktion und Aktivität beobachten.\nIn der ersten Woche täglich notieren oder fotografieren.',
      quickStart_day1: 'Sprüh- und Badestellen prüfen.\nNicht gefressenes Futter entfernen.\nFeuchte und eine Fressreaktion notieren.',
      quickStart_week1: 'Feste Beobachtungszeit festlegen.\nAlle 2–3 Tage die Kondition fotografieren.\nSubstrat darf nicht schimmeln oder austrocknen.',
      quickStart_avoid: 'Kein unbehandeltes Leitungswasser mit Chlor.\nNicht zu oft anfassen.\nTemperatur und Feuchte nicht abrupt ändern.',
      dailyCare: 'Feuchte prüfen\nHaut und Augen\nFressreaktion\nReste entfernen\nAuffälliges kurz notieren',
      weeklyCare: 'Gewicht oder Foto\nSubstrat und Kot\nThermo-Hygrometer\nTechnik und Lüftung\nFutterprotokoll',
      monthlyCare: 'Gewichts- und Konditionsverlauf\nFressmuster\nEinrichtung anpassen\nProtokolle exportieren\nProfil aktualisieren',
      suitableFor: 'Einsteiger mit täglicher Beobachtung\nWer die Feuchte stabil hält\nWer wenig anfasst',
      notSuitableFor: 'Wer nicht täglich kurz nachsehen kann\nWer häufig anfassen will',
      purchaseChecklist: 'Feuchtes Substrat\nVerstecke\nThermo-Hygrometer\nChlorfreies Wasser\nPassend große Beute',
      emergencyAdvice: 'Bei anhaltender Futterverweigerung oder Hautveränderung: isolieren, fotografieren, Wasser und Feuchte prüfen, Tierarzt mit Amphibienerfahrung fragen.',
      setup_1_title: 'Sauberes Wasser', setup_1_desc: 'Nur chlorfreies Wasser.', setup_1_priority: 'required', setup_1_record: 'humidity',
      setup_2_title: 'Stabile Feuchte', setup_2_desc: 'Feuchte und Luftaustausch ausbalancieren.', setup_2_priority: 'required', setup_2_record: 'humidity',
      setup_3_title: 'Verstecke', setup_3_desc: 'Dunkle Rückzugsorte senken Stress.', setup_3_priority: 'required', setup_3_record: 'photo',
      setup_4_title: 'Thermo-Hygrometer', setup_4_desc: 'Für die tägliche Kontrolle.', setup_4_priority: 'recommended', setup_4_record: 'temperature',
      setup_5_title: 'Futterplan', setup_5_desc: 'Beute nicht viel breiter als der Kopf.', setup_5_priority: 'recommended', setup_5_record: 'feeding',
      danger_1: 'warning|Anhaltende Futterverweigerung|Aufnahme und Umgebung notieren; nach mehr als 3 Tagen Hilfe suchen|feeding',
      danger_2: 'urgent|Rote Stellen oder Hautgeschwüre|Isolieren, fotografieren, nicht anfassen, fachliche Hilfe|skin',
      danger_3: 'urgent|Schwellung|Kondition und Wasser notieren; zeitnah zum Tierarzt|abnormality',
      danger_4: 'warning|Deutlich weniger Aktivität|Temperatur und Feuchte prüfen; bei Verschlechterung zum Tierarzt|activity',
      danger_5: 'urgent|Gestörte Atmung|Stress senken, Luftzufuhr sichern, fachliche Hilfe|abnormality',
      stage_juvenile: 'Etwas häufiger füttern; Wachstum und Häutung beobachten.\nKeine zu große Beute.',
      stage_adult: 'Kondition halten, Verfettung vermeiden.\nFeuchte und Fütterung regelmäßig notieren.',
      tutorial_1: 'Feuchte und Wasser prüfen',
      tutorial_2: 'Erste Fütterung notieren',
      tutorial_3: 'Ein Zustandsfoto machen',
      tutorial_4: 'Wöchentliche Rückschau zur Gewohnheit machen',
    };
  }

  var names = ['frog', 'toad', 'aquatic_amphibian', 'beetle_adult', 'beetle_larva', 'insect_other',
    'gecko', 'snake', 'lizard', 'tortoise', 'aquatic_turtle',
    'freshwater_fish', 'freshwater_other', 'marine_fish', 'marine_reef', 'marine_hermit',
    'finch', 'parrot', 'chick', 'bird_other',
    'hamster', 'rabbit', 'mammal_other',
    'tarantula', 'isopod', 'arthropod_other',
    'terrarium', 'plant', 'general'];

  names.forEach(function (name) {
    var ja = frogJa();
    var de = frogDe();
    if (name === 'beetle_adult') {
      Object.assign(ja, {
        quickStart_title: '成虫甲虫のクイックスタート',
        quickStart_points: 'まず床材の湿度を確認する。\n成虫にはゼリー、登り木、転倒しにくい配置が必要。\n活動と摂食を見る。\n繁殖期はペアリングと産卵を記録する。',
        dailyCare: 'ゼリーが乾いていないか\nひっくり返っていないか\n活動を見る\nカビた餌を取り除く\n異常を記録',
        weeklyCare: '体重\n床材の湿度\n排泄の掃除\n換気\n写真',
        danger_1: 'warning|長く動かない|温度、湿度、床材を記録する|insect_status',
        danger_2: 'urgent|自力で起き上がれない|配置を直し、干渉を減らし、観察を続ける|insect_status',
        danger_3: 'warning|脚の欠損|撮影して隔離し、必要なら相談する|abnormality',
        danger_4: 'warning|カビた環境|床材を替え、通気を良くし、カビた餌を取り除く|substrate',
        danger_5: 'warning|拒食|摂食と環境を記録し、続くなら相談する|feeding',
        stage_adult: 'ゼリー、活動、転倒に注意する。\n繁殖時の行動を記録する。',
        stage_egg: '産卵場所を頻繁に動かさない。',
        stage_larva: '幼虫ガイドを見る。',
        stage_breeding: 'ペアリング、産卵、孵化環境を記録する。',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Käfer, adult',
        quickStart_points: 'Zuerst die Substratfeuchte prüfen.\nAdulte brauchen Gelee, Kletterstruktur und kippsicheren Aufbau.\nAktivität und Fressen beobachten.\nBei Zucht Verpaarung und Eiablage notieren.',
        dailyCare: 'Gelee auf Trockenheit prüfen\nNicht auf dem Rücken\nAktivität\nSchimmeliges Futter entfernen\nAuffälliges notieren',
        weeklyCare: 'Gewicht\nSubstratfeuchte\nKot entfernen\nLüftung\nFoto',
        danger_1: 'warning|Lange Inaktivität|Temperatur, Feuchte und Substrat notieren|insect_status',
        danger_2: 'urgent|Kann sich nicht aufrichten|Aufbau anpassen, weniger stören, weiter beobachten|insect_status',
        danger_3: 'warning|Fehlende Beinglieder|Fotografieren, isolieren, bei Bedarf Hilfe|abnormality',
        danger_4: 'warning|Schimmelige Umgebung|Substrat tauschen, Lüftung verbessern, schimmeliges Futter entfernen|substrate',
        danger_5: 'warning|Futterverweigerung|Aufnahme und Umgebung notieren; bei Fortdauer Hilfe suchen|feeding',
        stage_adult: 'Gelee, Aktivität und Kippgefahr im Blick.\nVerhalten bei der Zucht notieren.',
        stage_egg: 'Eiablagestellen nicht oft stören.',
        stage_larva: 'Siehe Larvenanleitung.',
        stage_breeding: 'Verpaarung, Ablage und Brutbedingungen notieren.',
      });
    }
    if (name === 'beetle_larva') {
      Object.assign(ja, {
        quickStart_title: '幼虫甲虫のクイックスタート',
        quickStart_points: 'まず木くず、菌糸ボトル、床材を確認する。\n頻繁に掘り出さない。\n定期的に体重を記録する。\n蛹化前は温湿度を安定させる。',
        dailyCare: '床材の表面を見る\n乾きすぎ・湿りすぎでないか\n邪魔しない\n異臭をメモ\n短い記録',
        weeklyCare: '体重\n床材の減り\n換気\n写真\nライフステージを更新',
        stage_larva: '定期的に体重を記録し、床材や菌糸ボトルを見る。\n頻繁な掘り出しは避ける。',
        stage_pupa: '邪魔せず、湿度を安定させる。\n容器を動かさない。',
        danger_1: 'warning|長く動かない|床材を目で確認し、頻繁に掘らない|insect_status',
        danger_2: 'warning|拒食|床材の減りと環境を記録する|feeding',
        danger_3: 'warning|カビた環境|床材を替え、通気を良くする|substrate',
        danger_4: 'urgent|変色や異臭|隔離して撮影し、必要なら相談する|abnormality',
        danger_5: 'warning|脚の欠損|撮影して観察を続ける|abnormality',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Käferlarve',
        quickStart_points: 'Zuerst Substrat oder Pilzflasche prüfen.\nLarven nicht oft ausgraben.\nGewicht im Rhythmus notieren.\nVor der Verpuppung Bedingungen stabil halten.',
        dailyCare: 'Substratoberfläche ansehen\nNicht zu trocken oder nass\nWenig stören\nFremdgeruch notieren\nKurze Notiz',
        weeklyCare: 'Gewicht\nSubstratverbrauch\nLüftung\nFoto\nStadium aktualisieren',
        stage_larva: 'Gewicht notieren, Substrat oder Flasche im Blick.\nNicht oft umgraben.',
        stage_pupa: 'Nicht stören, Feuchte stabil halten.\nBehälter nicht bewegen.',
        danger_1: 'warning|Lange Inaktivität|Substrat nur ansehen, wenig graben|insect_status',
        danger_2: 'warning|Futterverweigerung|Verbrauch und Umgebung notieren|feeding',
        danger_3: 'warning|Schimmelige Umgebung|Substrat tauschen, Lüftung verbessern|substrate',
        danger_4: 'urgent|Verfärbung oder Geruch|Isolieren, fotografieren, bei Bedarf Hilfe|abnormality',
        danger_5: 'warning|Fehlende Beinglieder|Fotografieren und weiter beobachten|abnormality',
      });
    }
    if (name === 'gecko' || name === 'lizard' || name === 'snake' || name === 'tortoise') {
      Object.assign(ja, {
        quickStart_title: '爬虫類のクイックスタート',
        quickStart_points: 'ホットゾーン、クールゾーン、湿度、隠れ家を確認する。\nUVB が必要なら光周期を決める。\n迎え入れ直後はあまり触らない。\n体重と最初の摂食を記録する。',
        dailyCare: 'ホット／クールを確認\n摂食を見る\n排泄を確認\n水入れ\n異常を記録',
        weeklyCare: '体重\n飼育環境の清掃\n脱皮や甲羅\nUVB と保温\n写真',
        danger_1: 'warning|拒食と体重減少|温度勾配と摂食を記録する|weight',
        danger_2: 'warning|四肢の脱力|触るのを減らし、撮影し、悪化するなら受診する|activity',
        danger_3: 'urgent|呼吸の異常|ストレスを減らし、早めに受診する|abnormality',
        danger_4: 'warning|脱皮が残る|湿度を上げ、無理に剥がさず、必要なら相談する|shedding',
        danger_5: 'warning|排泄の異常|排泄と環境を記録し、続くなら受診する|stool',
        stage_juvenile: '給餌は多め。カルシウムと成長に注意する。',
        stage_adult: '体重と給餌の間隔を維持する。',
        stage_breeding: 'ペアリング、産卵、メスの状態を記録する。',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Reptil',
        quickStart_points: 'Warm- und Kühlzone, Feuchte und Verstecke prüfen.\nBei UVB-Bedarf einen Lichtzyklus setzen.\nNach dem Einzug wenig anfassen.\nGewicht und erste Fütterung notieren.',
        dailyCare: 'Warm- und Kühlzone\nFressen beobachten\nKot prüfen\nWasserschale\nAuffälliges notieren',
        weeklyCare: 'Gewicht\nTerrarium reinigen\nHäutung oder Panzer\nUVB und Heizung\nFoto',
        danger_1: 'warning|Futterverweigerung mit Gewichtsabnahme|Gefälle und Fütterung notieren|weight',
        danger_2: 'warning|Schwache Gliedmaßen|Weniger anfassen, fotografieren, bei Verschlechterung zum Tierarzt|activity',
        danger_3: 'urgent|Gestörte Atmung|Stress senken, zeitnah zum Tierarzt|abnormality',
        danger_4: 'warning|Häutungsreste|Feuchte erhöhen, nicht abziehen, bei Bedarf Hilfe|shedding',
        danger_5: 'warning|Auffälliger Kot|Kot und Umgebung notieren, bei Fortdauer zum Tierarzt|stool',
        stage_juvenile: 'Häufiger füttern; Kalzium und Wachstum beachten.',
        stage_adult: 'Gewicht und Fütterungsrhythmus halten.',
        stage_breeding: 'Verpaarung, Eier und Zustand des Weibchens notieren.',
      });
    }
    if (name === 'freshwater_fish' || name === 'freshwater_other') {
      Object.assign(ja, {
        quickStart_title: '淡水のクイックスタート',
        quickStart_points: '水を安定させてから多く与えない。\n水温、pH、アンモニア、亜硝酸を優先して確認する。\n換水は一度に大きく変えない。\n新しい魚は呼吸、食欲、体表を見る。',
        dailyCare: '泳ぎと呼吸\n給餌量\n食べ残しを取り除く\n体表を見る\n異常を記録',
        weeklyCare: '水質検査\n部分換水\nろ材は全部替えない\n設備\n写真',
        danger_1: 'urgent|鼻上げ|溶存酸素とアンモニアをすぐ確認する|ammonia',
        danger_2: 'warning|呼吸が速い|水温と水質を記録する|water_temp',
        danger_3: 'urgent|白点や潰瘍|隔離し、撮影し、水質を測る|skin',
        danger_4: 'urgent|バランスを崩す|驚きを減らし、水質と水温を確認する|activity',
        danger_5: 'urgent|複数が同時に異常|給餌を止め、水質を測り、隔離して見る|abnormality',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Süßwasser',
        quickStart_points: 'Wasser stabilisieren, bevor viel gefüttert wird.\nTemperatur, pH, Ammoniak und Nitrit zuerst prüfen.\nKeine großen sprunghaften Wasserwechsel.\nAtmung, Appetit und Körper der Neuzugänge beobachten.',
        dailyCare: 'Schwimmen und Atmung\nFuttermenge\nReste entfernen\nKörper ansehen\nAuffälliges notieren',
        weeklyCare: 'Wassertests\nTeilwasserwechsel\nFilterpflege, nicht alles tauschen\nTechnik\nFoto',
        danger_1: 'urgent|Luftschnappen an der Oberfläche|Sauerstoff und Ammoniak sofort prüfen|ammonia',
        danger_2: 'warning|Schnelle Atmung|Temperatur und Wasserwerte notieren|water_temp',
        danger_3: 'urgent|Weiße Punkte oder Geschwüre|Isolieren, fotografieren, Wasser testen|skin',
        danger_4: 'urgent|Gleichgewichtsverlust|Stress senken, Wasser und Temperatur prüfen|activity',
        danger_5: 'urgent|Auffälligkeit in der Gruppe|Fütterung stoppen, Wasser testen, isolieren und beobachten|abnormality',
      });
    }
    if (name === 'marine_fish' || name === 'marine_reef' || name === 'marine_hermit') {
      Object.assign(ja, {
        quickStart_title: '海水のクイックスタート',
        quickStart_points: '塩分、水温、水流が安定しているか確認する。\n与えすぎない。\nカルシウム、アルカリ度、硝酸塩を定期的に測る。\n新しい生体は開口、遊泳、体表を見る。',
        dailyCare: '遊泳と開口\n給餌を控える\n設備\n異常を目視\n短い記録',
        weeklyCare: '水質の一式\n換水\nスキマーカップの清掃\n設備\n写真',
        danger_1: 'warning|食欲が急に落ちる|水質と塩分を記録する|salinity',
        danger_2: 'urgent|呼吸が荒い／バランスを崩す|隔離し、水質を測り、相談する|abnormality',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Meerwasser',
        quickStart_points: 'Salzgehalt, Temperatur und Strömung prüfen.\nNicht überfüttern.\nKalzium, Alkalinität und Nährstoffe regelmäßig messen.\nÖffnung, Schwimmen und Gewebe neuer Tiere beobachten.',
        dailyCare: 'Schwimmen und Öffnung\nZurückhaltend füttern\nTechnik\nSichtkontrolle\nKurze Notiz',
        weeklyCare: 'Volles Wassertestset\nWasserwechsel\nAbschäumerbecher reinigen\nTechnik\nFoto',
        danger_1: 'warning|Plötzlicher Appetitverlust|Wasserwerte und Salzgehalt notieren|salinity',
        danger_2: 'urgent|Schwere Atmung oder Gleichgewichtsverlust|Isolieren, Wasser testen, Hilfe suchen|abnormality',
      });
    }
    if (name === 'marine_reef') {
      Object.assign(ja, {
        danger_1: 'warning|縮む|水質と照明を記録し、刺激を減らす|coral_open',
        danger_2: 'warning|退色|栄養塩と照明を測り、写真で比べる|aquarium_light',
        danger_3: 'urgent|組織が剥がれる|隔離し、水質を測り、相談する|abnormality',
        danger_4: 'warning|長く開かない|水流、照明、水質を確認する|coral_open',
        danger_5: 'warning|水質が急に揺れる|大量換水を止め、少しずつ調整する|kh',
      });
      Object.assign(de, {
        danger_1: 'warning|Eingezogenes Gewebe|Wasser und Licht notieren, Störung reduzieren|coral_open',
        danger_2: 'warning|Ausbleichen|Nährstoffe und Licht prüfen, Fotovergleich|aquarium_light',
        danger_3: 'urgent|Gewebeverlust|Isolieren, Wasser testen, Hilfe suchen|abnormality',
        danger_4: 'warning|Lange geschlossen|Strömung, Licht und Wasser prüfen|coral_open',
        danger_5: 'warning|Scharfe Parametersprünge|Große Wechsel pausieren, schrittweise anpassen|kh',
      });
    }
    if (name === 'finch' || name === 'parrot' || name === 'chick' || name === 'bird_other') {
      Object.assign(ja, {
        quickStart_title: '鳥類のクイックスタート',
        quickStart_points: '食欲、排泄、羽毛、様子を見る。\n油煙、香り、テフロンの煙を避ける。\n体重の変化が重要。\n羽を膨らませて目を閉じたままなら急ぐ。',
        dailyCare: '餌と水\n排泄\n様子と羽毛\nトレイの清掃\n異常を記録',
        weeklyCare: '体重\nケージの清掃\n止まり木\n安全確認\n写真',
        danger_1: 'urgent|羽を膨らめて目を閉じる|保温し、隔離し、すぐ受診する|activity',
        danger_2: 'urgent|呼吸が荒い|驚きを減らし、鳥の獣医へ|abnormality',
        danger_3: 'warning|拒食が続く|摂食と排泄を記録し、1日を超えたら受診する|feeding',
        danger_4: 'warning|排泄の異常|撮影し、保温して見る|stool',
        danger_5: 'warning|姿勢が不安定|驚きを減らし、隔離して見る|activity',
        stage_chick: '保温、給餌の回数、体重。リスクが高い。',
        stage_adult: '食欲、羽毛、排泄、活動。',
        stage_breeding: '巣箱、産卵、親鳥のストレス、ヒナの状態。',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Vogel',
        quickStart_points: 'Appetit, Kot, Gefieder und Verhalten beobachten.\nKüchendunst, Duftstoffe und PTFE-Dämpfe vermeiden.\nGewichtsverlauf ist wichtig.\nAufgeplustert und teilnahmslos braucht schnelle Hilfe.',
        dailyCare: 'Futter und Wasser\nKot\nVerhalten und Gefieder\nSchale reinigen\nAuffälliges notieren',
        weeklyCare: 'Gewicht\nKäfig reinigen\nSitzstangen\nSicherheit\nFoto',
        danger_1: 'urgent|Aufgeplustert, Augen geschlossen|Wärmen, isolieren, sofort zum Tierarzt|activity',
        danger_2: 'urgent|Schwere Atmung|Stress senken, Vogelarzt|abnormality',
        danger_3: 'warning|Anhaltende Futterverweigerung|Aufnahme und Kot notieren; nach mehr als einem Tag zum Tierarzt|feeding',
        danger_4: 'warning|Auffälliger Kot|Fotografieren, warm halten und beobachten|stool',
        danger_5: 'warning|Unsicherer Stand|Stress senken, isolieren und beobachten|activity',
        stage_chick: 'Wärme, häufiges Füttern, Gewicht — hohes Risiko.',
        stage_adult: 'Appetit, Gefieder, Kot, Aktivität.',
        stage_breeding: 'Nistkasten, Eier, Stress der Eltern, Zustand der Küken.',
      });
    }
    if (name === 'rabbit') {
      Object.assign(ja, {
        quickStart_title: 'ウサギの高リスク入門',
        quickStart_points: '拒食は緊急になり得る。\n水、乾草、排泄を確認する。\n毎週体重を測る。\n腹部の張りと排便停止に注意する。',
        danger_1: 'urgent|拒食|摂食と排泄を記録し、早く獣医へ|feeding',
        danger_2: 'urgent|排便がない|緊急受診|stool',
        danger_3: 'urgent|腹部が張る|受診を遅らせない|abnormality',
        danger_4: 'urgent|呼吸の異常|保温し、驚きを減らし、すぐ受診する|abnormality',
        danger_5: 'warning|活動が極端に低い|体重を測り、保温して見る|activity',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Kaninchen, hohes Risiko',
        quickStart_points: 'Futterverweigerung kann ein Notfall sein.\nWasser, Heu und Kot prüfen.\nWöchentlich wiegen.\nAuf Blähbauch und fehlenden Kot achten.',
        danger_1: 'urgent|Futterverweigerung|Aufnahme und Kot notieren, zeitnah zum Tierarzt|feeding',
        danger_2: 'urgent|Kein Kot|Notaufnahme|stool',
        danger_3: 'urgent|Aufgeblähter Bauch|Tierarzt nicht aufschieben|abnormality',
        danger_4: 'urgent|Gestörte Atmung|Wärmen, Stress senken, sofort zum Tierarzt|abnormality',
        danger_5: 'warning|Sehr wenig Aktivität|Wiegen, warm halten und beobachten|activity',
      });
    }
    if (name === 'hamster' || name === 'mammal_other') {
      Object.assign(ja, {
        quickStart_title: '小型哺乳類のクイックスタート',
        quickStart_points: '水、餌、隠れ家、清潔さを確認する。\n毎週決まった時間に体重を測る。\n排泄と活動を見る。\nウサギやモルモットの拒食はリスクが高い。',
        dailyCare: '餌と水\n活動\n排泄\n床材\n異常を記録',
        weeklyCare: '体重\n清掃\n安全確認\n写真\nメモを更新',
        danger_1: 'warning|拒食|摂食と排泄を記録し、続くなら受診する|feeding',
        danger_2: 'urgent|排便がない|体重を測り、保温し、早く受診する|stool',
        danger_3: 'urgent|腹部が張る|受診を遅らせない|abnormality',
        danger_4: 'urgent|呼吸の異常|驚きを減らし、保温し、すぐ受診する|abnormality',
        danger_5: 'warning|活動が極端に低い|体重を測り、隔離して見る|activity',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Kleinsäuger',
        quickStart_points: 'Wasser, Futter, Verstecke und Sauberkeit prüfen.\nWöchentlich zur festen Zeit wiegen.\nKot und Aktivität beobachten.\nBei Kaninchen und Meerschweinchen ist Futterverweigerung hohes Risiko.',
        dailyCare: 'Futter und Wasser\nAktivität\nKot\nEinstreu\nAuffälliges notieren',
        weeklyCare: 'Gewicht\nReinigung\nSicherheit\nFoto\nProfil aktualisieren',
        danger_1: 'warning|Futterverweigerung|Aufnahme und Kot notieren, bei Fortdauer zum Tierarzt|feeding',
        danger_2: 'urgent|Kein Kot|Wiegen, warm halten, zeitnah zum Tierarzt|stool',
        danger_3: 'urgent|Aufgeblähter Bauch|Tierarzt nicht aufschieben|abnormality',
        danger_4: 'urgent|Gestörte Atmung|Stress senken, wärmen, sofort zum Tierarzt|abnormality',
        danger_5: 'warning|Sehr wenig Aktivität|Wiegen, isolieren und beobachten|activity',
      });
    }
    if (name === 'tarantula' || name === 'isopod' || name === 'arthropod_other') {
      Object.assign(ja, {
        quickStart_title: '節足動物のクイックスタート',
        quickStart_points: '湿度、通気、脱走防止を確認する。\n脱皮中は給餌も干渉もしない。\nダンゴムシ類は湿った場所が必要。\n脱皮の成功と失敗を記録する。',
        dailyCare: '状態を見る\n脱走防止\n湿度を素早く確認\n脱皮を邪魔しない\n異常を記録',
        weeklyCare: '床材と湿度\n給餌の記録\n写真\n設備\nメモを更新',
        danger_1: 'warning|脱皮の失敗|湿度を上げ、邪魔せず、必要なら相談する|molt',
        danger_2: 'warning|長い拒食と異常な姿勢|湿度と姿勢を記録し、悪化するなら相談する|feeding',
        danger_3: 'warning|生き餌に攻撃される|前処理した餌にし、干渉を減らす|feeding',
        danger_4: 'urgent|脱走のおそれ|蓋と隙間を確認し、すぐ補強する|note',
        danger_5: 'urgent|高リスク種を素手で触る危険|道具を使い、距離を取り、素手で掴まない|note',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Gliederfüßer',
        quickStart_points: 'Feuchte, Lüftung und Ausbruchsschutz prüfen.\nWährend der Häutung nicht füttern und nicht stören.\nAsseln brauchen eine feuchte Zone.\nGelungene und misslungene Häutungen notieren.',
        dailyCare: 'Sichtkontrolle\nAusbruchsschutz\nKurze Feuchtekontrolle\nHäutung nicht stören\nAuffälliges notieren',
        weeklyCare: 'Substrat und Feuchte\nFutterprotokoll\nFoto\nTechnik\nProfil aktualisieren',
        danger_1: 'warning|Misslungene Häutung|Feuchte erhöhen, nicht stören, bei Bedarf Hilfe|molt',
        danger_2: 'warning|Lange Futterverweigerung mit ungewöhnlicher Haltung|Feuchte und Haltung notieren, bei Verschlechterung Hilfe|feeding',
        danger_3: 'warning|Lebendfutter greift an|Vorgetötetes Futter, weniger stören|feeding',
        danger_4: 'urgent|Ausbruchsrisiko|Deckel und Spalten prüfen, sofort sichern|note',
        danger_5: 'urgent|Hochriskante Art, Warnung vor bloßen Händen|Werkzeug, Abstand, nicht greifen|note',
      });
    }
    if (name === 'terrarium' || name === 'plant') {
      Object.assign(ja, {
        quickStart_title: 'テラリウム／植物のクイックスタート',
        quickStart_points: '湿度、通気、光を確認する。\n植物とカビを見る。\n水やりや霧吹きのリズムを決める。\n密閉して淀ませない。',
        dailyCare: '植物を見る\n湿度\n通気\nカビ\n短い記録',
        weeklyCare: '剪定\n清掃\n設備\n写真\nメモを更新',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart Terrarium / Pflanze',
        quickStart_points: 'Feuchte, Luftaustausch und Licht prüfen.\nPflanzen und Schimmel beobachten.\nEinen Gieß- oder Sprührhythmus festlegen.\nKeine stehende Luft im geschlossenen Behälter.',
        dailyCare: 'Pflanzen ansehen\nFeuchte\nLuft\nSchimmel\nKurze Notiz',
        weeklyCare: 'Rückschnitt\nReinigung\nTechnik\nFoto\nProfil aktualisieren',
      });
    }
    if (name === 'aquatic_amphibian') {
      Object.assign(ja, {
        quickStart_title: '水棲両生類のクイックスタート',
        quickStart_points: 'まず水温と水質を安定させる。\nアンモニアと亜硝酸を確認する。\n換水はゆっくり。\n鰓、遊泳、食欲を見る。',
        dailyCare: '水温\n鰓を見る\n食べ残しを取り除く\n遊泳のバランス\n異常を記録',
        weeklyCare: '水質の一式\n換水\nろ過\n写真\nメモを更新',
        danger_1: 'urgent|鰓が短い、または白い|水質と温度を確認し、撮影する|gill',
        danger_2: 'urgent|水面に浮く|水温、アンモニア、溶存酸素を確認する|ammonia',
        danger_3: 'urgent|体のバランスを崩す|驚きを減らし、水質を測り、隔離して見る|activity',
        danger_4: 'urgent|皮膚の損傷|隔離し、撮影し、水質を改善する|skin',
        danger_5: 'warning|拒食|摂食と水質を記録し、続くなら受診する|feeding',
      });
      Object.assign(de, {
        quickStart_title: 'Schnellstart aquatische Amphibien',
        quickStart_points: 'Zuerst Temperatur und Wasser stabilisieren.\nAmmoniak und Nitrit prüfen.\nWasser langsam wechseln.\nKiemen, Balance und Appetit beobachten.',
        dailyCare: 'Wassertemperatur\nKiemen ansehen\nReste entfernen\nSchwimmbalance\nAuffälliges notieren',
        weeklyCare: 'Volles Wassertestset\nWasserwechsel\nFilter\nFoto\nProfil aktualisieren',
        danger_1: 'urgent|Kurze oder blasse Kiemen|Wasser und Temperatur prüfen, fotografieren|gill',
        danger_2: 'urgent|Treiben an der Oberfläche|Temperatur, Ammoniak und Sauerstoff prüfen|ammonia',
        danger_3: 'urgent|Gleichgewichtsverlust|Stress senken, Wasser testen, isolieren|activity',
        danger_4: 'urgent|Hautschaden|Isolieren, fotografieren, Wasser verbessern|skin',
        danger_5: 'warning|Futterverweigerung|Aufnahme und Wasser notieren, bei Fortdauer zum Tierarzt|feeding',
      });
    }
    put(name, ja, de);
  });

  var jaChrome = {
    guideSectionEmpty_quickstart: 'クイックスタートはまだありません。',
    guideSectionEmpty_dailycare: '今日のケア項目はまだありません。',
    guideSectionEmpty_weeklymonthly: '週次・月次のケア項目はまだありません。',
    guideSectionEmpty_lifestage: 'ライフステージの提案はまだありません。',
    guideSectionEmpty_emergency: '異常時の案内はまだありません。',
  };
  var deChrome = {
    guideDangerDefaultAdvice: 'Weiter protokollieren, bei Bedarf isolieren, die Umgebung anpassen und fachliche Hilfe suchen. Das ist keine Diagnose.',
    guideActionReminder: 'Erinnerung setzen',
    guideActionPhoto: 'Foto aufnehmen',
    guideAccQuickStart: 'Schnellstart',
    guideAccDailyCare: 'Tägliche Pflege',
    guideAccWeeklyMonthly: 'Wöchentlich / monatlich',
    guideAccLifeStage: 'Lebensstadien',
    guideAccEmergency: 'Wenn etwas nicht stimmt',
    guideAccSetup: 'Ersteinrichtung',
    guideAccSuitable: 'Geeignet für',
    guideCenterBeginnerTips: 'Einsteigertipps heute',
    guideCenterDangerWatch: 'Darauf achten',
    guideCenterTutorialPending: 'Offene Lernschritte',
    guideCenterRecCards: 'Empfohlene Anleitungen',
    guideSeverity_observe: 'Beobachten',
    guideSeverity_warning: 'Achtung',
    guideSeverity_urgent: 'Dringend',
    guideSectionEmpty_quickstart: 'Noch kein Schnellstart.',
    guideSectionEmpty_dailycare: 'Noch keine Tagesliste.',
    guideSectionEmpty_weeklymonthly: 'Noch keine Wochen- oder Monatsliste.',
    guideSectionEmpty_lifestage: 'Noch keine Hinweise zum Lebensstadium.',
    guideSectionEmpty_emergency: 'Noch keine Hinweise für den Notfall.',
    guideTpl_firstDayLabel: 'Erster Tag',
    guideTpl_firstWeekLabel: 'Erste Woche',
    guideTpl_avoidLabel: 'Sofort vermeiden',
    guideCareWeeklyLabel: 'Wöchentliche Pflege',
    guideCareMonthlyLabel: 'Monatliche Pflege',
    guidePriority_required: 'Erforderlich',
    guidePriority_recommended: 'Empfohlen',
    guidePriority_optional: 'Optional',
  };
  Object.keys(jaChrome).forEach(function (k) { base.ja[k] = jaChrome[k]; });
  Object.keys(deChrome).forEach(function (k) { base.de[k] = deChrome[k]; });
})(typeof window !== 'undefined' ? window : this);
