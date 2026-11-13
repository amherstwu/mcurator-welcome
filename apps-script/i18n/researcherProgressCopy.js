/**
 * Researcher Progress / Achievement Center — UI copy (zh-TW / en / ja / de).
 * Labels for config-driven UI; quest strings with i18nKey remain in UI.html I18N.
 */
(function (global) {
  'use strict';

  global.MCResearcherProgressCopy = {
    metaName: { zh: '成就中心', en: 'Achievement Center', ja: 'アチーブメントセンター', de: 'Erfolgszentrum' },

    completenessDraft: { zh: '草稿', en: 'Draft', ja: '下書き', de: 'Entwurf' },
    completenessBasic: { zh: '基本', en: 'Basic', ja: '基本設定', de: 'Basis' },
    completenessComplete: { zh: '完整', en: 'Complete', ja: '完成', de: 'Vollständig' },
    completenessHighQuality: { zh: '高品質', en: 'High quality', ja: '高品質設定', de: 'Hohe Qualität' },

    stageBeginner: { zh: '初學收藏者', en: 'Beginner Collector', ja: '初心者コレクター', de: 'Einsteiger-Sammler' },
    stageField: { zh: '田野紀錄者', en: 'Field Recorder', ja: '野外記録者', de: 'Felddokumentar' },
    stageKeeper: { zh: '標本守護者', en: 'Specimen Keeper', ja: '標本管理者', de: 'Präparat-Hüter' },
    stageArchive: { zh: '典藏整理師', en: 'Archive Curator', ja: 'アーカイブ整理者', de: 'Archivkurator' },
    stageTaxApp: { zh: '分類學見習者', en: 'Taxonomy Apprentice', ja: '分類学見習生', de: 'Taxonomie-Lehrling' },
    stageCurator: { zh: '博物館策展人', en: 'Museum Curator', ja: '博物館キュレーター', de: 'Museumskurator' },
    stageGuardian: { zh: '科學資產守護者', en: 'Scientific Asset Guardian', ja: '科学資産の守護者', de: 'Hüter wissenschaftlicher Assets' },
    stageGrand: { zh: '大博物學家', en: 'Grand Naturalist', ja: '大博物学者', de: 'Großer Naturalist' },

    milestoneMini: { zh: '小型典藏', en: 'Mini collection', ja: 'ミニコレクション', de: 'Kleine Sammlung' },
    milestoneCabinet: { zh: '標本典藏', en: 'Cabinet collection', ja: '標本キャビネットコレクション', de: 'Schranksammlung' },
    milestoneArchive: { zh: '典藏達成', en: 'Archive collection', ja: 'アーカイブ達成', de: 'Archivsammlung' },
    milestoneMuseum: { zh: '博物館級', en: 'Museum collection', ja: 'ミュージアム品質コレクション', de: 'Museumssammlung' },
    milestoneGrand: { zh: '總典藏', en: 'Grand archive', ja: 'グランドアーカイブ', de: 'Großes Archiv' },

    rewardNoviceBadge: { zh: '新手收藏家徽章', en: 'Novice collector badge', ja: '初心者コレクターバッジ', de: 'Abzeichen für Einsteiger' },
    rewardCabinetFrame: { zh: '標本櫃外觀', en: 'Cabinet frame', ja: '標本キャビネットフレーム', de: 'Schrankrahmen' },
    rewardArchiveRoom: { zh: '典藏室背景 + 金章', en: 'Archive room background + gold badge', ja: 'アーカイブ室背景＋金章バッジ', de: 'Archivraum-Hintergrund und Goldabzeichen' },
    rewardCuratorTitle: { zh: '館長稱號解鎖', en: 'Curator title unlock', ja: 'キュレーター称号の解放', de: 'Kuratorentitel freigeschaltet' },
    rewardMythicBadge: { zh: '傳奇典藏徽章', en: 'Mythic archive badge', ja: '伝説のアーカイブバッジ', de: 'Legendäres Archivabzeichen' },

    dailyBonusLabel: { zh: '每日加碼', en: 'Daily bonus', ja: 'デイリーボーナス', de: 'Tagesbonus' },
    weeklyBonusLabel: { zh: '每週加碼', en: 'Weekly bonus', ja: 'ウィークリーボーナス', de: 'Wochenbonus' },

    tabOverview: { zh: '總覽', en: 'Overview', ja: '概要', de: 'Übersicht' },
    tabQuests: { zh: '任務', en: 'Quests', ja: 'クエスト', de: 'Aufgaben' },
    tabCollection: { zh: '典藏', en: 'Collection', ja: 'コレクション', de: 'Sammlung' },
    tabBadges: { zh: '徽章', en: 'Badges', ja: 'バッジ', de: 'Abzeichen' },
    tabAvatars: { zh: '頭像', en: 'Avatars', ja: 'アバター', de: 'Avatare' },

    signInToday: { zh: '今日簽到', en: 'Check in today', ja: '本日のチェックイン', de: 'Heute einchecken' },
    streakDays: { zh: '連續天數', en: 'Streak days', ja: '連続日数', de: 'Tage in Folge' },
    levelLabel: { zh: '等級', en: 'Level', ja: 'レベル', de: 'Stufe' },
    xpLabel: { zh: '經驗值', en: 'XP', ja: '経験値', de: 'EP' },
    rpLabel: { zh: '研究點', en: 'Research points', ja: '研究ポイント', de: 'Forschungspunkte' },

    questDaily: { zh: '每日任務', en: 'Daily quests', ja: 'デイリークエスト', de: 'Tagesaufgaben' },
    questWeekly: { zh: '每週任務', en: 'Weekly quests', ja: 'ウィークリークエスト', de: 'Wochenaufgaben' },
    questMain: { zh: '主線章節', en: 'Main chapters', ja: 'メイン章', de: 'Hauptkapitel' },
    questClaim: { zh: '領取', en: 'Claim', ja: '受け取る', de: 'Einlösen' },
    questClaimed: { zh: '已領取', en: 'Claimed', ja: '受取済み', de: 'Eingelöst' },
    questProgress: { zh: '進度', en: 'Progress', ja: '進捗', de: 'Fortschritt' },

    rpc_dq_sign_in: { zh: '今日簽到', en: 'Check in today', ja: '本日のチェックイン', de: 'Heute einchecken' },
    rpc_dq_specimen: { zh: '完成一筆標本紀錄', en: 'Complete one specimen record', ja: '標本記録を1件完了する', de: 'Einen Präparatdatensatz abschließen' },
    rpc_dq_photo: { zh: '上傳一張標本照片', en: 'Upload one specimen photo', ja: '標本写真を1枚アップロードする', de: 'Ein Präparatfoto hochladen' },
    rpc_dq_restore: { zh: '於修復實驗室還原一張照片', en: 'Restore one photo in the lab', ja: '修復ラボで写真を1枚復元する', de: 'Ein Foto im Labor restaurieren' },
    rpc_dq_collection_view: { zh: '檢視典藏里程碑進度', en: 'Review collection milestone progress', ja: 'コレクションマイルストーンの進捗を確認する', de: 'Fortschritt der Sammlungsetappen prüfen' },
    rpc_wq_specimens: { zh: '新增 5 筆標本紀錄', en: 'Add 5 specimen records', ja: '標本記録を5件追加する', de: '5 Präparatdatensätze hinzufügen' },
    rpc_wq_restore: { zh: '修復 10 張照片', en: 'Restore 10 photos', ja: '写真を10枚修復する', de: '10 Fotos restaurieren' },
    rpc_wq_scinames: { zh: '補上 10 筆學名', en: 'Add 10 scientific names', ja: '学名を10件追加する', de: '10 wissenschaftliche Namen ergänzen' },
    rpc_wq_gps: { zh: '為 10 筆紀錄加入 GPS', en: 'Add GPS to 10 records', ja: '10件の記録にGPSを追加する', de: 'GPS zu 10 Datensätzen hinzufügen' },
    rpc_wq_showcase: { zh: '發布 1 則公開博物館／收藏展示', en: 'Publish 1 public museum / collection showcase', ja: '公開博物館／コレクション展示を1件公開する', de: '1 öffentliche Museums- oder Sammlungspräsentation veröffentlichen' },

    errScriptsMissing: { zh: '成就中心腳本未載入。請確認 UI.html 已載入 researcher-progress-config.js 與 researcher-progress-center.js。', en: 'Achievement Center scripts did not load. Ensure UI.html loads researcher-progress-config.js and researcher-progress-center.js.', ja: 'アチーブメントセンターのスクリプトが読み込まれていません。UI.html で researcher-progress-config.js と researcher-progress-center.js が読み込まれているか確認してください。', de: 'Die Skripte des Erfolgszentrums wurden nicht geladen. Prüfen Sie, ob UI.html researcher-progress-config.js und researcher-progress-center.js lädt.'
    },
    errNoSave: { zh: '無法儲存進度', en: 'Cannot save progress', ja: '進捗を保存できません', de: 'Fortschritt kann nicht gespeichert werden' },
    toastCheckIn: { zh: '簽到成功', en: 'Check-in complete', ja: 'チェックイン完了', de: 'Check-in abgeschlossen' },
    toastQuestClaimed: { zh: '已領取獎勵', en: 'Reward claimed', ja: '報酬を受け取りました', de: 'Belohnung eingelöst' }
  };
})(typeof window !== 'undefined' ? window : this);
