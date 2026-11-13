/**
 * Husbandry Log — multiple-choice options for every record type.
 */
(function (global) {
  'use strict';

  function opt(value, zhTW, en) {
    return { value: value, zhTW: zhTW, en: en };
  }

  var LEVEL = [
    opt('ok', '正常', 'Normal'),
    opt('low', '偏低', 'Low'),
    opt('high', '偏高', 'High'),
    opt('danger', '危險', 'Danger'),
  ];

  var CHOICES = {
    water_temp: [
      opt('too_cold', '偏低', 'Too Cold'),
      opt('ok', '適中', 'OK'),
      opt('warm', '偏高', 'Warm'),
      opt('too_hot', '過高', 'Too Hot'),
    ],
    temperature: [
      opt('too_cold', '偏低', 'Too Cold'),
      opt('ok', '適中', 'OK'),
      opt('warm', '偏高', 'Warm'),
      opt('too_hot', '過高', 'Too Hot'),
    ],
    humidity: [
      opt('too_dry', '偏乾', 'Too Dry'),
      opt('ok', '適中', 'OK'),
      opt('moist', '偏濕', 'Moist'),
      opt('too_wet', '過濕', 'Too Wet'),
    ],
    ph: [
      opt('acidic', '偏酸 (<6.5)', 'Acidic'),
      opt('neutral', '中性 (6.5–7.5)', 'Neutral'),
      opt('alkaline', '偏鹼 (>7.5)', 'Alkaline'),
      opt('unknown', '未測量', 'Not Measured'),
    ],
    ammonia: LEVEL.slice(),
    nitrite: LEVEL.slice(),
    nitrate: LEVEL.slice(),
    water_quality: [
      opt('clear', '清澈', 'Clear'),
      opt('slightly_cloudy', '微濁', 'Slightly Cloudy'),
      opt('cloudy', '混濁', 'Cloudy'),
      opt('smelly', '異味', 'Smelly'),
    ],
    water_change: [
      opt('full', '全換', 'Full Change'),
      opt('partial', '部分換', 'Partial Change'),
      opt('topped', '補水', 'Topped Off'),
      opt('none', '未換', 'None'),
    ],
    activity: [
      opt('active', '活躍', 'Active'),
      opt('normal', '正常', 'Normal'),
      opt('hiding', '躲藏', 'Hiding'),
      opt('slow', '遲緩', 'Slow'),
      opt('abnormal', '異常', 'Abnormal'),
    ],
    weight: [
      opt('unchanged', '無變化', 'Unchanged'),
      opt('gained', '增加', 'Gained'),
      opt('lost', '減少', 'Lost'),
      opt('measured', '已量測', 'Measured'),
    ],
    note: [
      opt('feeding', '餵食相關', 'Feeding'),
      opt('behavior', '行為觀察', 'Behavior'),
      opt('environment', '環境調整', 'Environment'),
      opt('health', '健康觀察', 'Health'),
      opt('milestone', '里程碑', 'Milestone'),
      opt('other', '其他', 'Other'),
    ],
    refused: [
      opt('refused', '拒食', 'Refused'),
      opt('partial', '少量進食', 'Ate Less'),
      opt('not_offered', '未提供食物', 'Not Offered'),
      opt('watch', '持續觀察', 'Keep Watching'),
    ],
    premolt: [
      opt('signs', '有預脫跡象', 'Signs Present'),
      opt('likely', '可能快脫', 'Likely Soon'),
      opt('none', '無跡象', 'None'),
      opt('unknown', '不確定', 'Unknown'),
    ],
    molt: [
      opt('molting', '脫皮中', 'Molting'),
      opt('completed', '脫皮完成', 'Completed'),
      opt('failed', '脫皮失敗', 'Failed'),
      opt('normal', '正常', 'Normal'),
    ],
    abdomen: [
      opt('plump', '飽滿', 'Plump'),
      opt('normal', '正常', 'Normal'),
      opt('thin', '偏瘦', 'Thin'),
      opt('abnormal', '異常', 'Abnormal'),
    ],
    hiding: [
      opt('hiding', '躲藏中', 'Hiding'),
      opt('normal', '正常活動', 'Normal'),
      opt('emerged', '已出巢', 'Out of Hide'),
      opt('long_hide', '長時間躲藏', 'Long Hide'),
    ],
    defensive: [
      opt('defensive', '防禦姿態', 'Defensive'),
      opt('threat_posture', '威嚇反應', 'Threat Display'),
      opt('calm', '平靜', 'Calm'),
      opt('aggressive', '攻擊反應', 'Aggressive'),
    ],
    basking: [
      opt('active', '正在曬背', 'Basking Now'),
      opt('brief', '短暫曬背', 'Brief Basking'),
      opt('none', '未曬背', 'Not Basking'),
      opt('lamp_off', '燈未開', 'Lamp Off'),
    ],
    uvb: [
      opt('on', '正常運作', 'Working'),
      opt('replaced', '已更換', 'Replaced'),
      opt('off', '未開啟', 'Off'),
      opt('unknown', '不確定', 'Unknown'),
    ],
    shell: [
      opt('normal', '正常', 'Normal'),
      opt('shedding', '蛻皮中', 'Shedding'),
      opt('soft', '偏軟', 'Soft'),
      opt('damaged', '損傷', 'Damaged'),
    ],
    stool: [
      opt('normal', '正常', 'Normal'),
      opt('loose', '偏軟', 'Loose'),
      opt('none', '無', 'None'),
      opt('abnormal', '異常', 'Abnormal'),
    ],
    gill: [
      opt('normal', '正常', 'Normal'),
      opt('feathery', '外展良好', 'Feathery'),
      opt('curled', '蜷縮', 'Curled'),
      opt('damaged', '損傷', 'Damaged'),
    ],
    skin: [
      opt('normal', '正常', 'Normal'),
      opt('pale', '偏白', 'Pale'),
      opt('spot', '斑點', 'Spots'),
      opt('fungus', '真菌', 'Fungus'),
    ],
    shedding: [
      opt('normal', '正常', 'Normal'),
      opt('premolt', '預蛻皮', 'Premolt'),
      opt('molting', '蛻皮中', 'Molting'),
      opt('completed', '蛻皮完成', 'Completed'),
      opt('failed', '蛻皮失敗', 'Failed'),
    ],
    egg_laying: [
      opt('laid', '已產卵', 'Eggs Laid'),
      opt('observed', '觀察中', 'Observing'),
      opt('none', '無', 'None'),
      opt('unknown', '不確定', 'Unknown'),
    ],
    medication: [
      opt('given', '已給藥', 'Given'),
      opt('scheduled', '已排程', 'Scheduled'),
      opt('skipped', '略過', 'Skipped'),
      opt('none', '無', 'None'),
    ],
    vet: [
      opt('visit', '已就醫', 'Visited'),
      opt('scheduled', '已預約', 'Scheduled'),
      opt('followup', '需複診', 'Follow-up'),
      opt('none', '無', 'None'),
    ],
    hotspot: [
      opt('ok', '正常', 'Normal'),
      opt('low', '偏低', 'Low'),
      opt('high', '偏高', 'High'),
      opt('danger', '危險', 'Danger'),
    ],
    cold_zone: [
      opt('ok', '正常', 'Normal'),
      opt('low', '偏低', 'Low'),
      opt('high', '偏高', 'High'),
      opt('danger', '危險', 'Danger'),
    ],
    calcium: [
      opt('dusted', '已撒粉', 'Dusted'),
      opt('given', '已補充', 'Given'),
      opt('none', '無', 'None'),
      opt('scheduled', '已排程', 'Scheduled'),
    ],
    drinking: [
      opt('normal', '正常飲水', 'Drinking Normally'),
      opt('low', '飲水量偏少', 'Drinking Less'),
      opt('none', '未觀察到', 'Not Observed'),
      opt('refused', '拒絕飲水', 'Refused'),
    ],
    feather: [
      opt('normal', '正常', 'Normal'),
      opt('ruffled', '羽毛蓬鬆', 'Ruffled'),
      opt('molting', '換羽中', 'Molting'),
      opt('damaged', '損傷/斷羽', 'Damaged'),
    ],
    crop: [
      opt('full', '嗉囊飽滿', 'Full Crop'),
      opt('normal', '正常', 'Normal'),
      opt('empty', '嗉囊空', 'Empty'),
      opt('slow', '排空偏慢', 'Slow Emptying'),
    ],
    teeth: [
      opt('normal', '正常', 'Normal'),
      opt('overgrown', '過長', 'Overgrown'),
      opt('worn', '磨損', 'Worn'),
      opt('checked', '已檢查', 'Checked'),
    ],
    fur: [
      opt('normal', '正常', 'Normal'),
      opt('shedding', '換毛中', 'Shedding'),
      opt('dry', '偏乾/打結', 'Dry/Matted'),
      opt('abnormal', '異常', 'Abnormal'),
    ],
    mortality: [
      opt('none', '無', 'None'),
      opt('one', '1 隻', '1'),
      opt('few', '2–3 隻', '2–3'),
      opt('many', '多隻', 'Several+'),
    ],
    plant_status: [
      opt('healthy', '健康', 'Healthy'),
      opt('growing', '生長中', 'Growing'),
      opt('wilting', '萎蔫', 'Wilting'),
      opt('pests', '病蟲害', 'Pests'),
    ],
    cage_clean: [
      opt('done', '已清理', 'Cleaned'),
      opt('partial', '部分清理', 'Partial'),
      opt('due', '待清理', 'Due'),
      opt('skipped', '略過', 'Skipped'),
    ],
    aquarium_light: [
      opt('on', '正常運作', 'On'),
      opt('replaced', '已更換燈管', 'Bulb Replaced'),
      opt('off', '未開啟', 'Off'),
      opt('timer_issue', '定時異常', 'Timer Issue'),
    ],
    water_flow: [
      opt('normal', '正常', 'Normal'),
      opt('low', '偏弱', 'Low'),
      opt('high', '偏強', 'High'),
      opt('stopped', '停止', 'Stopped'),
    ],
    coral_open: [
      opt('open', '完全展開', 'Fully Open'),
      opt('partial', '部分展開', 'Partially Open'),
      opt('closed', '收合', 'Closed'),
      opt('unknown', '不確定', 'Unknown'),
    ],
  };

  function getOptions(recordId) {
    return (CHOICES[recordId] || []).slice();
  }

  function findLabel(recordId, value, lang) {
    var opts = CHOICES[recordId] || [];
    var hit = opts.filter(function (o) {
      return o.value === value;
    })[0];
    if (!hit) return value;
    return lang === 'en' ? hit.en : hit.zhTW;
  }

  global.MCHusbandryRecordChoices = {
    choices: CHOICES,
    getOptions: getOptions,
    findLabel: findLabel,
  };
})(typeof window !== 'undefined' ? window : this);
