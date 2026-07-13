import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, InventoryItem, Skill, GameScene, BattleState, Equipment, EquipSet } from '@/types';
import { BonusState } from '@/types';
import { initialPlayer, initialInventory, initialSkills, GAME_CONFIG } from '@/data/initialData';
import { getEquipmentById, equipmentData, getRecipeForEquipment, getEquipmentByTypeAndListnum } from '@/data/equipment';
import { getExpToNextLevel, getLevelBonus, clamp, getEquipComponents, computeFinalStats, computeHeroBonuses, WinBossGetBattlePoint } from '@/utils/helpers';
import { saveCollection, getCollection } from '@/utils/collectionStorage';
import { loadSaveData, saveSaveData } from '@/utils/saveDataStorage';
import type { LanguageCode } from '@/data/languageData';

interface PeakSnapshot {
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  agility: number;
  luck: number;
  equippedWeapon: { id: string; name: string; x: number; y: number } | null;
  equippedArmor: { id: string; name: string; x: number; y: number } | null;
  equippedAccessories: { id: string; name: string; x: number; y: number }[];
}
import { eneDropItemInit, equipmentIdToItemTypeAndIndex, itemTypeAndIndexToEquipmentId } from '@/utils/dropManager';
import { battleVarInit } from '@/utils/battleVar';
import { BONUS_LIST, getRandomBonusType } from '@/utils/bonusManager';
import { MAP_LIST, getMapEnemies } from '@/data/mapData';
import { getBossById } from '@/data/bossData';
import { getHeroById } from '@/data/heroData';
import { getCurrentKyaraLv, addExpKyarakutaKozinExp } from '@/utils/kyaraLevel';
import { getTranslation } from '@/data/languageData';

// 统计背包中物品数量（武器+防具+饰品）
function getItemCount(inventory: InventoryItem[]): number {
  let count = 0;
  for (const item of inventory) {
    const eq = getEquipmentById(item.equipmentId);
    if (eq && (eq.type === 'accessory' || eq.type === 'weapon' || eq.type === 'armor')) {
      count += item.quantity;
    }
  }
  return count;
}

// 统一计算饰品加成效果，遵循 gdata.txt 中 EqStUpdate 和 passiveUpdate 的模式
// 返回加性属性加成和乘性属性加成
function applyEquipmentBonuses(
  accessories: (Equipment | null)[],
  inventory: InventoryItem[],
  hardmode: number,
  kyarakutaLevel: number,
  kyarakutaKozinExp: number[],
  heroId: number
): {
  epHp: number;
  epAtk: number;
  epDef: number;
  epAgi: number;
  epLuc: number;
  ebHp: number;
  ebAtk: number;
  ebDef: number;
  ebAgi: number;
  ebLuc: number;
  addMaxHP: number;
  addMaxATK: number;
  addMaxDEF: number;
  addMaxAGI: number;
  addMaxLUC: number;
  AllstatPer: number;
  expMultiplier: number;
  GetPlusStPt: number;
  DamageReduced: number;
  DamageIncreased: number;
  crihPlusKakuritu: number;
  crihplusdamage: number;
  renzokuPlusKakuritu: number;
  MoveSpeed: number;
  SokusiKaihiKakuritu: number;
  // passiveUpdate 效果
  redEyeEffect: number;
  blueEyeEffect: number;
  greenEyeEffect: number;
  secretKeyOn: boolean;
  possiveDeftoAtk: boolean;
  envelope: boolean;
  missrate: number;
  // getDecreasedHPRate/getDecreasedATKRate
  hpReduceRate: number;
  atkReduceRate: number;
  // 复活相关（resCount=0表示无复活能力）
  resCount: number;
  resStatUP: number;
} {
  let epHp = 0, epAtk = 0, epDef = 0, epAgi = 0, epLuc = 0;
  let ebHp = 0, ebAtk = 0, ebDef = 0, ebAgi = 0, ebLuc = 0;
  let addMaxHP = 0, addMaxATK = 0, addMaxDEF = 0, addMaxAGI = 0, addMaxLUC = 0;
  let AllstatPer = 0;
  let expMultiplier = 1;
  let GetPlusStPt = 0;
  let DamageReduced = 0;
  let DamageIncreased = 0;
  let crihPlusKakuritu = 0;
  let crihplusdamage = 1;
  let renzokuPlusKakuritu = 0;
  let MoveSpeed = 15;
  let SokusiKaihiKakuritu = 0;
  // passiveUpdate 效果
  let redEyeEffect = 0;
  let blueEyeEffect = 0;
  let greenEyeEffect = 0;
  let secretKeyOn = false;
  let possiveDeftoAtk = false;
  let envelope = false;
  let missrate = 0;
  let resCount = 0;
  let resStatUP = 0;

  for (const acc of accessories) {
    if (!acc) continue;
    const t1 = acc.t1;
    const t2 = acc.t2 || 0;

    if (t1 === 30) {
      epHp += t2;
    } else if (t1 === 31) {
      epAtk += t2;
    } else if (t1 === 32) {
      epDef += t2;
    } else if (t1 === 33) {
      epAgi += t2;
    } else if (t1 === 34) {
      epLuc += t2;
    } else if (t1 === 35) {
      const itemCount = getItemCount(inventory);
      const itemCount1 = Math.min(itemCount, 1000);
      const itemCount2 = Math.max(0, itemCount - 1000);
      epHp += itemCount1 * t2;
      epAtk += itemCount1 * t2;
      epDef += itemCount1 * t2;
      epAgi += itemCount1 * t2;
      epLuc += itemCount2 * t2 * 4;
    } else if (t1 === 40) {
      epHp += t2;
      epAtk += t2;
      epDef += t2;
      epAgi += t2;
      epLuc += t2;
    } else if (t1 === 41) {
      epAtk += t2;
      epDef += t2;
      epAgi += t2;
    } else if (t1 === 42) {
      epHp += t2;
      epAtk += t2;
      epDef += t2;
      epAgi += t2;
    } else if (t1 === 43) {
      epHp += t2 * 10;
      epDef += t2 * 10;
      epAgi += t2;
    } else if (t1 === 60) {
      expMultiplier += t2 / 100;
    } else if (t1 === 1111) {
      DamageReduced = t2;
      epHp += 1500000;
    } else if (t1 === 2222) {
      DamageIncreased = t2;
      epAtk += 800000;
    } else if (t1 === 700 && GetPlusStPt === 0) {
      GetPlusStPt = 1;
    } else if (t1 === 701) {
      GetPlusStPt = 2;
    } else if (t1 === 2701) {
      GetPlusStPt = 3;
      epHp += 1500000;
    } else if (t1 === 888) {
      AllstatPer = t2 / 100;
    } else if (t1 === 889 && hardmode === 2) {
      AllstatPer += 0.4;
    } else if (t1 === 820) {
      const currentKyaraLv = getCurrentKyaraLv(kyarakutaKozinExp, heroId);
      const kyarakutaBonus = ((kyarakutaLevel + currentKyaraLv) * 0.25 + 0.75) * (1 + t2 / 100);
      ebHp += (initialPlayer.maxHp * 0.06) * kyarakutaBonus;
      ebAtk += (initialPlayer.attack * 0.07) * kyarakutaBonus;
      ebDef += (initialPlayer.defense * 0.07) * kyarakutaBonus;
      ebAgi += (initialPlayer.agility * 0.075) * kyarakutaBonus;
      ebLuc += (initialPlayer.luck * 0.08) * kyarakutaBonus;
    } else if (t1 === 3333) {
      addMaxHP += 0.15;
      expMultiplier += 1.05;
    } else if (t1 === 3334) {
      addMaxATK += 0.15;
      expMultiplier += 0.8;
    } else if (t1 === 3335) {
      addMaxDEF += 0.15;
      expMultiplier += 0.8;
    } else if (t1 === 4003) {
      DamageReduced = 25;
      addMaxHP += 1;
    } else if (t1 === 4005) {
      DamageReduced = 33;
      addMaxHP += 1.5;
    } else if (t1 === 200) {
      crihPlusKakuritu += 0.08;
    } else if (t1 === 210) {
      crihplusdamage += 0.2;
    } else if (t1 === 211) {
      crihplusdamage += 3;
    } else if (t1 === 250) {
      renzokuPlusKakuritu = 0.09;
    } else if (t1 === 10) {
      expMultiplier -= 0.15;
    } else if (t1 === 100) {
      MoveSpeed += t2 / 100;
    } else if (t1 === 1210) {
      SokusiKaihiKakuritu += 1;
    } else if (t1 === 1211) {
      SokusiKaihiKakuritu += 10;
    } else if (t1 === 1899) {
      const randomDice = Math.random() * 100;
      if (randomDice < 12) {
        addMaxHP += 0.15;
      } else if (randomDice < 24) {
        addMaxATK += 0.15;
      } else if (randomDice < 36) {
        addMaxDEF += 0.15;
      } else if (randomDice < 48) {
        addMaxAGI += 0.15;
      } else if (randomDice < 60) {
        addMaxLUC += 0.15;
      } else if (randomDice < 72) {
        AllstatPer += 0.15;
      } else {
        expMultiplier += 0.8;
      }
    } else if (t1 === 4000) {
      resCount = 2;
      resStatUP = 1.03;
    } else if (t1 === 4004) {
      resCount = 1;
      resStatUP = 1.03;
    } else if (t1 === 4006) {
      DamageReduced = 33;
      addMaxHP += 1.5;
      resCount = 2;
      resStatUP = 1.06;
    }
    
    // passiveUpdate 效果（基于装备ID）
    const eqId = acc.id;
    const eqNum = parseInt(eqId.split('-')[1]) || 0;
    
    if (eqNum === 106) {
      redEyeEffect += 0.1;
    } else if (eqNum === 130) {
      redEyeEffect += 0.2;
    } else if (eqNum === 95) {
      epHp += 750000;
      epAtk += 750000;
      epDef += 750000;
      epAgi += 750000;
      epLuc += 750000;
    } else if (eqNum === 104) {
      epHp += 1500000;
      epAtk += 1500000;
      epDef += 1500000;
      epAgi += 1500000;
      epLuc += 1500000;
    } else if (eqNum === 116) {
      blueEyeEffect += 0.1;
    } else if (eqNum === 117) {
      greenEyeEffect += 0.1;
    } else if (eqNum === 119) {
      secretKeyOn = true;
    } else if (eqNum === 110) {
      possiveDeftoAtk = true;
    } else if (eqNum === 123) {
      envelope = true;
    } else if (eqNum === 103) {
      crihPlusKakuritu += 0.2;
      missrate += 0.2;
    } else if (eqNum === 125) {
      MoveSpeed = 22;
    }
  }
  
  // getDecreasedHPRate (t1=96): HP减少率 -5% per item
  const hpReduceItems = accessories.filter(acc => acc && acc.t1 === 96);
  const hpReduceRate = hpReduceItems.length * 0.05;
  
  // getDecreasedATKRate (t1=97): ATK减少率 -5% per item  
  const atkReduceItems = accessories.filter(acc => acc && acc.t1 === 97);
  const atkReduceRate = atkReduceItems.length * 0.05;

  return {
    epHp, epAtk, epDef, epAgi, epLuc,
    ebHp, ebAtk, ebDef, ebAgi, ebLuc,
    addMaxHP, addMaxATK, addMaxDEF, addMaxAGI, addMaxLUC,
    AllstatPer, expMultiplier, GetPlusStPt, DamageReduced, DamageIncreased,
    crihPlusKakuritu, crihplusdamage, renzokuPlusKakuritu, MoveSpeed, SokusiKaihiKakuritu,
    redEyeEffect, blueEyeEffect, greenEyeEffect, secretKeyOn, possiveDeftoAtk, envelope, missrate,
    hpReduceRate, atkReduceRate,
    resCount, resStatUP,
  };
}

interface GameStore {
  player: Player;
  inventory: InventoryItem[];
  skills: Skill[];
  currentScene: GameScene;
  encounterRate: number;
  battle: BattleState;
  battleInterval: number | null;
  battlePoints: number;
  maxBattlePoints: number;
  defeatedBosses: number[];
  playTimes: number;
  Highlv: number;
  HighCombo: number;
  HighDamage: number;
  winbattle: number;
  losebattle: number;
  newgamecount: number;
  gameovercount: number;
  kyarakutalv: number;
  kyarakutaKozinExp: number[];
  equipSets: EquipSet[];
  currentEquipSetSlotIndex: number;
  hardmodeUnlock: number;
  hellmodeUnlock: number;
  hardmode: number;
  playerid: number;
  DropRate: number;
  speedNum: number;
  dropNum: number;
  presetNum: number;
  presets: number[][];
  autoAllocateEnabled: boolean;
  bonus: BonusState;
  currentMap: number;
  lastBossId: number | null;
  lastMapId: number | null;
  originalMap: number;
  hiddenMapBonusCount: number;
  debugKill: boolean;
  purchaseCounts: Record<string, number>;
  peakSnapshot: PeakSnapshot | null;
  setPlayer: (player: Player) => void;
  updatePlayerHp: (amount: number) => void;
  updatePlayerMana: (amount: number) => void;
  addGold: (amount: number) => void;
  addExp: (amount: number) => void;
  addToInventory: (equipmentId: string, quantity: number) => void;
  removeFromInventory: (equipmentId: string, quantity: number) => void;
  equipItem: (equipment: Equipment, slotIndex?: number) => void;
  buyEquipment: (equipmentId: string) => boolean;
  synthesizeEquipment: (equipmentId: string) => boolean;
  useConsumable: (equipmentId: string) => void;
  setCurrentScene: (scene: GameScene) => void;
  goToTitle: () => void;
  addEncounterRate: (amount: number) => void;
  resetEncounterRate: () => void;
  startBattle: () => void;
  startBossBattle: (bossId: number) => void;
  endBattle: (victory: boolean) => void;
  clearBattleResult: () => void;
  toggleBattle: () => void;
  resumeBattle: () => void;
  pauseBattle: () => void;
  tryEscape: () => void;
  addBattleLog: (message: string) => void;
  updateCooldowns: () => void;
  resetGame: () => void;
  startGame: () => void;
  startBattleLoop: () => void;
  stopBattleLoop: () => void;
  setRecoverNextTurn: (value: boolean) => void;
  incrementWinBattle: () => void;
  incrementLoseBattle: () => void;
  incrementNewGameCount: () => void;
  updateHighCombo: (combo: number) => void;
  updateHighDamage: (damage: number) => void;
  updateHighLv: (level: number) => void;
  addMapBonus: () => void;
  setMapBonus: (bonusType: number, count?: number) => void;
  exportSaveData: () => string;
  importSaveData: (data: string) => void;
  clearMapBonus: () => void;
  getBonusInfo: () => { type: number; name: string; description: string; icon: string; color: string } | null;
  /** 传送到指定地图 */
  teleportToMap: (mapId: number) => void;
  /** 进入隐藏地图 */
  enterHiddenMap: (mapId: number, bonusType: number) => void;
  /** 播放战斗特效 */
  playBattleEffect: (effectId: number, position: 'player' | 'enemy') => void;
  /** 清除战斗特效 */
  clearBattleEffect: () => void;
  /** 退出隐藏地图 */
  exitHiddenMap: () => void;
  /** 解锁饰品栏位 */
  unlockAccessorySlot: (slotIndex?: number) => boolean;
  /** 检查装备饰品数量是否超过库存，超过则清空对应栏位 */
  checkZeroEquips: () => void;
  /** 分配属性点 */
  allocateStPt: (statType: 'hp' | 'atk' | 'def' | 'agi' | 'luc', amount: number) => void;
  /** 添加属性点 */
  addStPt: (amount: number) => void;
  /** 杀死玩家（设置战斗点数为0并返回标题） */
  killPlayer: () => void;
  /** 设置属性分配预设 */
  setPreset: (presetIndex: number, preset: number[]) => void;
  /** 设置当前使用的预设 */
  setPresetNum: (num: number) => void;
  /** 设置自动分配是否开启 */
  setAutoAllocateEnabled: (enabled: boolean) => void;
  /** 保存当前装备为套装 */
  saveEquipSet: (name: string) => void;
  /** 加载装备套装 */
  loadEquipSet: (setId: string) => void;
  /** 删除装备套装 */
  deleteEquipSet: (setId: string) => void;
  /** 更新装备套装名称 */
  renameEquipSet: (setId: string, name: string) => void;
  /** 购买装备套装槽位 */
  purchaseEquipSet: (slotIndex: number) => boolean;
  /** 获取装备套装槽位价格 */
  getEquipSetPrice: (slotIndex: number) => number | null;
  /** 更新当前装备套装 */
  updateCurrentEquipSet: () => void;
  /** 自动分配属性点 */
  autoAllocateStPt: () => void;
  /** 选择角色 */
  selectHero: (heroId: number) => void;
  /** 设置难度 */
  setHardmode: (hardmode: number) => void;
  /** 当前语言 */
  language: LanguageCode;
  /** 设置语言 */
  setLanguage: (language: LanguageCode) => void;
}

const STORAGE_KEY = 'inflation-rpg-storage';
const BASE_CRIT_RATE = 0.05;
const BASE_COMBO_RATE = 0.05;

/** game.txt AKUSESlotLockMONEY: 饰品栏位解锁价格 (索引0=第1栏位) */
const AKUSE_SLOT_LOCK_MONEY = [0, 0, 0, 250000, 500000, 750000, 70000000, 70000000, 5000000, 5000000, 3500000, 3500000];
const MAX_ACCESSORY_SLOTS = 12;

const INITIAL_PRESETS: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const getStoredData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }
  } catch {
    console.warn('Failed to load stored game data');
  }
  return null;
};

const storedData = getStoredData();

const fixStoredPlayerEquipment = (player: Player | undefined): { fixedPlayer: Player; unequippedAccessories: Equipment[] } => {
  if (!player) return { fixedPlayer: initialPlayer, unequippedAccessories: [] };
  
  let fixedPlayer = { ...player };
  
  // Ensure gold is always a valid number
  if (typeof fixedPlayer.gold !== 'number' || Number.isNaN(fixedPlayer.gold)) {
    fixedPlayer.gold = 0;
  }
  
  // Ensure other numeric fields are valid
  if (typeof fixedPlayer.hp !== 'number' || Number.isNaN(fixedPlayer.hp)) {
    fixedPlayer.hp = fixedPlayer.maxHp || 1000;
  }
  if (typeof fixedPlayer.maxHp !== 'number' || Number.isNaN(fixedPlayer.maxHp)) {
    fixedPlayer.maxHp = 1000;
  }
  if (typeof fixedPlayer.attack !== 'number' || Number.isNaN(fixedPlayer.attack)) {
    fixedPlayer.attack = 1000;
  }
  if (typeof fixedPlayer.defense !== 'number' || Number.isNaN(fixedPlayer.defense)) {
    fixedPlayer.defense = 1000;
  }
  if (typeof fixedPlayer.agility !== 'number' || Number.isNaN(fixedPlayer.agility)) {
    fixedPlayer.agility = 1000;
  }
  if (typeof fixedPlayer.luck !== 'number' || Number.isNaN(fixedPlayer.luck)) {
    fixedPlayer.luck = 1000;
  }
  if (typeof fixedPlayer.maxAccessorySlots !== 'number' || fixedPlayer.maxAccessorySlots < 1) {
    fixedPlayer.maxAccessorySlots = 3;
  }
  if (typeof fixedPlayer.stPt !== 'number' || Number.isNaN(fixedPlayer.stPt)) {
    fixedPlayer.stPt = 0;
  }
  
  if (!fixedPlayer.stPtAllocate || typeof fixedPlayer.stPtAllocate !== 'object') {
    fixedPlayer.stPtAllocate = { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
  }
  
  if (fixedPlayer.equippedWeapon) {
    const weapon = getEquipmentById(fixedPlayer.equippedWeapon.id);
    if (weapon) {
      fixedPlayer.equippedWeapon = weapon;
    } else {
      fixedPlayer.equippedWeapon = null;
    }
  }
  
  if (fixedPlayer.equippedArmor) {
    const armor = getEquipmentById(fixedPlayer.equippedArmor.id);
    if (armor) {
      fixedPlayer.equippedArmor = armor;
    } else {
      fixedPlayer.equippedArmor = null;
    }
  }
  
  const unequippedAccessories: Equipment[] = [];

  if (fixedPlayer.equippedAccessories) {
    fixedPlayer.equippedAccessories = fixedPlayer.equippedAccessories
      .filter(acc => acc !== null)
      .map(acc => {
        const found = getEquipmentById(acc!.id);
        return found || acc;
      })
      .filter(acc => getEquipmentById(acc.id)) as Equipment[];
    
    // 检测星级不匹配的饰品：将不符合槽位星级限制的饰品取消装备
    const getSlotMaxRank = (slotIndex: number): number => {
      if (slotIndex <= 5) return 3; // 1-6号槽：R1~R4
      if (slotIndex <= 7) return 2; // 7-8号槽：R1~R3
      if (slotIndex <= 9) return 1; // 9-10号槽：R1~R2
      return 0;                      // 11-12号槽：R1
    };
    
    fixedPlayer.equippedAccessories = fixedPlayer.equippedAccessories.filter((acc, idx) => {
      const accRank = acc.rank ?? -1;
      if (accRank > getSlotMaxRank(idx)) {
        // 星级不匹配，取消装备并放回背包
        unequippedAccessories.push(acc);
        return false;
      }
      return true;
    });
  }
  
  return { fixedPlayer, unequippedAccessories };
};

const calculateCritRate = (hpPercent: number, accessories: Equipment[]): number => {
  let rate = BASE_CRIT_RATE;
  if (hpPercent <= 0.25) {
    rate += 0.05;
    if (hpPercent <= 0.15) rate += 0.04;
    if (hpPercent <= 0.1) rate += 0.045;
    if (hpPercent <= 0.05) rate += 0.03;
  }
  
  const critChanceRing = accessories.find(acc => acc && acc.t1 === 200);
  if (critChanceRing) {
    rate += 0.15;
  }
  
  return Math.min(rate, 0.7) * 100;
};

const calculateComboRate = (hpPercent: number, accessories: Equipment[]): number => {
  let rate = BASE_COMBO_RATE;
  if (hpPercent <= 0.25) {
    rate += 0.08;
    if (hpPercent <= 0.15) rate += 0.11;
    if (hpPercent <= 0.1) rate += 0.13;
    if (hpPercent <= 0.05) rate += 0.08;
  }
  
  const comboRateRing = accessories.find(acc => acc && acc.t1 === 250);
  if (comboRateRing) {
    rate += 0.15;
  }
  
  const stormPower = accessories.find(acc => acc && acc.t1 === 4001);
  if (stormPower) {
    rate += (stormPower.t2 || 50) / 100;
  }
  
  return Math.min(rate, 0.8) * 100;
};

const calculatePlayerDamage = (
  playerAttack: number,
  enemyDefense: number,
  isCrit: boolean,
  comboCount: number,
  accessories: Equipment[],
  playerLevel: number
): { damage: number; isCrit: boolean } => {
  let damage: number;
  
  const critPowerRing = accessories.find(acc => acc && acc.t1 === 210);
  const skyPower = accessories.find(acc => acc && acc.t1 === 4002);
  const stormPower = accessories.find(acc => acc && acc.t1 === 4001);
  const powerStone = accessories.find(acc => acc && acc.t1 === 2222);
  
  if (isCrit) {
    const critBonus = Math.random() * 1.2;
    let critMultiplier = 1.75 + critBonus / 5;
    if (critPowerRing) {
      critMultiplier += 0.3;
    }
    damage = (playerAttack + 1) * critMultiplier + 4;
  } else {
    damage = playerAttack;
  }
  
  if (powerStone) {
    damage *= (1 + (powerStone.t2 || 20) / 100);
  }
  
  let defense = enemyDefense;
  if (defense > damage) {
    defense = (defense * 3 + damage * 2) / 5;
  }
  defense *= 0.3;
  if (defense >= damage * 0.32) {
    defense = (defense + damage * 0.32 * 99) / 100;
  }
  defense = defense + Math.random() * enemyDefense * 0.02 + enemyDefense * 0.02;
  if (defense >= damage * 0.44) {
    defense = (defense + damage * 0.44 * 199) / 200;
  }
  
  damage -= defense;
  damage *= 0.88;
  damage = damage + Math.random() * damage * 0.2 - damage * 0.1 + Math.random() * 4 - 2;
  
  if (damage <= 0) {
    damage = Math.random() * 10 + 1;
  }
  
  if (comboCount >= 2) {
    let comboMultiplier = 1 + (comboCount - 1) * 0.1;
    if (stormPower) {
      comboMultiplier += (stormPower.t2 || 50) / 100;
    }
    damage = Math.floor(damage * comboMultiplier);
  }
  
  if (skyPower) {
    damage += playerLevel * (skyPower.t2 || 50);
  }
  
  return { damage: Math.floor(damage), isCrit };
};

const calculateEnemyDamage = (enemyAttack: number, playerDefense: number, accessories: Equipment[]): number => {
  let damage = (enemyAttack * 2 + (enemyAttack - playerDefense * 0.5) * 12) / 14;
  
  const protectionStone = accessories.find(acc => acc && acc.t1 === 1111);
  const earthPower = accessories.find(acc => acc && acc.t1 === 4003);
  
  if (protectionStone) {
    damage *= (1 - (protectionStone.t2 || 20) / 100);
  }
  
  if (earthPower) {
    damage *= (1 - 25 / 100);
  }
  
  let threshold = enemyAttack * 0.5;
  if (damage < threshold) {
    damage = (threshold + damage) / 2;
  }
  
  threshold = enemyAttack * 0.3;
  if (damage < threshold) {
    damage = (threshold * 3 + damage) / 4;
  }
  
  threshold = enemyAttack * 0.2;
  if (damage < threshold) {
    damage = (threshold * 5 + damage) / 6;
  }
  
  threshold = enemyAttack * 0.1;
  if (damage < threshold) {
    damage = (threshold * 7 + damage) / 8;
  }
  
  damage = damage + Math.random() * damage * 0.2 - damage * 0.1 + Math.random() * 4 - 2;
  damage = damage + Math.random() * enemyAttack * 0.0225 + enemyAttack * 0.0025;
  
  if (damage <= 0) {
    damage = Math.random() * 10 + 1;
  }
  
  return Math.floor(damage);
};

const collectionData = getCollection();
const saveData = loadSaveData();

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      console.log('[GameStore Init] saveData loaded:', { hardmode: saveData.hardmode });
      console.log('[GameStore Init] storedData player:', storedData?.player ? { maxHp: storedData.player.maxHp, attack: storedData.player.attack, defense: storedData.player.defense, agility: storedData.player.agility, luck: storedData.player.luck, stPt: storedData.player.stPt } : 'null');
      console.log('[GameStore Init] storedData battlePoints:', storedData?.battlePoints);
      const { fixedPlayer, unequippedAccessories } = fixStoredPlayerEquipment(storedData?.player);
      
      // 迁移旧数据：从 saveData.stPtAllocate 迁移到 player.stPtAllocate
      if (saveData.stPtAllocate && (!fixedPlayer.stPtAllocate || Object.values(fixedPlayer.stPtAllocate).every(v => v === 0))) {
        fixedPlayer.stPtAllocate = { ...saveData.stPtAllocate };
      }
      
      // 迁移旧数据：从 saveData.stPt 迁移到 player.stPt
      if ((fixedPlayer.stPt === undefined || fixedPlayer.stPt === 0) && saveData.stPt > 0) {
        fixedPlayer.stPt = saveData.stPt;
      }
      
      // 将因星级不匹配被卸下的饰品放回背包
      let initialInv = storedData?.inventory || (collectionData.length > 0 ? collectionData : initialInventory);
      if (unequippedAccessories.length > 0) {
        initialInv = initialInv.map((item: InventoryItem) => ({ ...item }));
        for (const acc of unequippedAccessories) {
          const existing = initialInv.find((i: InventoryItem) => i.equipmentId === acc.id);
          if (existing) {
            existing.quantity += 1;
          } else {
            initialInv.push({
              equipmentId: acc.id,
              quantity: 1,
              equipped: 0,
              unlocked: false,
            });
          }
        }
      }
      
      return {
      player: fixedPlayer,
      inventory: initialInv,
      skills: storedData?.skills || initialSkills,
      currentScene: 'title',
      encounterRate: storedData?.encounterRate || 0,
      battle: {
          enemy: null,
          status: 'idle',
          battleLog: [],
          comboCount: 0,
          comboRate: 5,
          critRate: 5,
          hpRate: 100,
          dropRate: 0,
          dropItemName: '',
          turn: 'player',
          turnCount: 0,
          recoverNextTurn: false,
          recoverUsed: false,
          playerAnimation: 'idle',
          enemyAnimation: 'idle',
          dropType: -1,
          dropIndex: -1,
          isDropSuccess: false,
          goldMultiplier: 1,
          battleResult: null,
          _ending: false,
          damageDisplay: null,
          isCrit: false,
          isCombo: false,
          lastAttacker: null,
          _loopTurn: 0,
          _loopMode: 3,
          _loopTick: 0,
          _loopComboCount: 1,
        specialBonusType: null,
        activeEffect: null,
        resCount: 0,
        resStatUP: 1,
        },
      battleInterval: null,
      battlePoints: storedData?.battlePoints || 30,
      maxBattlePoints: saveData.hardmode === 1 ? 15 : 30,
      defeatedBosses: [] as number[],
      playTimes: saveData.playTimes,
      Highlv: saveData.Highlv,
      HighCombo: saveData.HighCombo,
      HighDamage: saveData.HighDamage,
      winbattle: saveData.winbattle,
      losebattle: saveData.losebattle,
      newgamecount: saveData.newgamecount,
      gameovercount: saveData.gameovercount,
      kyarakutalv: saveData.kyarakutalv,
      kyarakutaKozinExp: saveData.kyarakutaKozinExp || new Array(20).fill(0),
      equipSets: (() => {
        const saved = saveData.equipSets;
        if (!saved || saved.length === 0) {
          return [{
            id: 'set-0',
            name: '默认背包',
            weaponId: null,
            armorId: null,
            accessoryIds: [],
            weaponSoulId: null,
            armorSoulId: null,
            createdAt: Date.now(),
            unlocked: true,
            slotIndex: 0,
          }];
        }
        // 确保 slot 0 始终存在
        if (!saved.some(s => s.slotIndex === 0)) {
          saved.unshift({
            id: 'set-0',
            name: '默认背包',
            weaponId: null,
            armorId: null,
            accessoryIds: [],
            weaponSoulId: null,
            armorSoulId: null,
            createdAt: Date.now(),
            unlocked: true,
            slotIndex: 0,
          });
        }
        return saved;
      })(),
      currentEquipSetSlotIndex: 0,
      hardmodeUnlock: saveData.hardmodeUnlock,
      hellmodeUnlock: saveData.hellmodeUnlock,
      hardmode: saveData.hardmode || 0,
      playerid: saveData.playerid,
      DropRate: saveData.DropRate,
      language: (saveData.language || 'zh-Hans') as LanguageCode,
      speedNum: saveData.speedNum,
      dropNum: saveData.dropNum,
      presetNum: saveData.presetNum,
      presets: saveData.presets || INITIAL_PRESETS,
      autoAllocateEnabled: saveData.autoAllocateEnabled || false,
      bonus: {
        addUsesLeft: 5,
        clearUsesLeft: 5,
        currentBonus: null,
      },
      currentMap: 1,
      lastBossId: null,
      lastMapId: null,
      originalMap: 1,
      hiddenMapBonusCount: 0,
      debugKill: false,
      purchaseCounts: storedData?.purchaseCounts || {},
      peakSnapshot: storedData?.peakSnapshot || null,
      setPlayer: (player) => set({ player }),
      updatePlayerHp: (amount) => {
        const { player, battle } = get();
        const newHp = clamp(player.hp + amount, 0, player.maxHp);
        const hpPercent = newHp / player.maxHp;
        const accessories = player.equippedAccessories || [];
        const newCritRate = calculateCritRate(hpPercent, accessories);
        const newComboRate = calculateComboRate(hpPercent, accessories);
        set({ 
          player: { ...player, hp: newHp },
          battle: { 
            ...battle, 
            critRate: newCritRate,
            comboRate: newComboRate,
          },
        });
      },
      updatePlayerMana: (amount) => {
        const { player } = get();
        const newMana = clamp(player.mana + amount, 0, player.maxMana);
        set({ player: { ...player, mana: newMana } });
      },
      addGold: (amount) => {
        const { player } = get();
        set({ player: { ...player, gold: player.gold + amount } });
      },
      addExp: (amount) => {
        const { player, updateHighLv, inventory, speedNum } = get();
        
        // battle.txt 升级公式
        // getExpNokori = existing exp + gained exp (行 817)
        let getExpNokori = player.exp + amount;
        let lvupsitanum = 0;
        let newLevel = player.level;
        let expToNext = player.expToNextLevel;
        
        // 计算最大等级（遵循gdata.txt中的maxgamelv()函数）
        const dragonForceCount = inventory.reduce((sum, item) => {
          if (item.equipmentId === 'accessory-114') return sum + item.quantity;
          return sum;
        }, 0);
        const maxLevel = 35000000 + dragonForceCount * 5000000;
        
        // battle.txt 中的升级逻辑：
        // 正常模式 (speedNum == 0): 逐级升级，调用 lvupFunc()
        // 快速模式 (speedNum != 0): 当等级 >= 125000 时，优先调用 lvupFunc100() 一次性升100级
        if (speedNum === 0) {
          // 正常模式：逐级升级
          while (getExpNokori >= expToNext && newLevel < maxLevel) {
            // _loc11_ = floor(getExpNokori / onenextexp) (行 985)
            const _loc11_ = Math.floor(getExpNokori / expToNext);
            
            // _loc18_ = pow(_loc11_, 0.48) * 0.5, capped 40 (行 988-992)
            let _loc18_ = Math.pow(_loc11_, 0.48) * 0.5;
            if (_loc18_ > 40) _loc18_ = 40;
            
            // _loc12_ = levels per batch (行 993)
            let levelsInBatch = 1 + Math.floor(
              (_loc11_ * 1.22 + lvupsitanum * 0.3) / (76 + _loc18_)
            );
            // cap: _loc12_ <= lv * 100 (行 994-996)
            if (levelsInBatch > newLevel * 100) levelsInBatch = newLevel * 100;
            if (levelsInBatch < 1) levelsInBatch = 1;
            
            // 处理此批次中的每个等级
            let processed = 0;
            while (processed < levelsInBatch && getExpNokori >= expToNext && newLevel < maxLevel) {
              // 减去当前等级所需经验
              getExpNokori -= expToNext;
              newLevel++;
              lvupsitanum++;
              processed++;
              // lvUpdata 重新计算 onenextexp
              expToNext = getExpToNextLevel(newLevel);
            }
            
            if (processed === 0) break;
          }
        } else {
          // 快速模式：优先使用 lvupFunc100()
          while (getExpNokori >= expToNext && newLevel < maxLevel) {
            // 当等级 >= 125000 时，优先尝试一次性升100级
            if (newLevel >= 125000) {
              // Get100LevelAfterExp(ga.gdata.lv - 1) 计算升100级所需经验
              let expFor100Levels = 0;
              for (let i = 0; i < 100; i++) {
                expFor100Levels += getExpToNextLevel(newLevel + i);
              }
              
              if (getExpNokori >= expFor100Levels) {
                // 调用 lvupFunc100(): 一次性升100级
                getExpNokori -= expFor100Levels;
                newLevel += 100;
                lvupsitanum += 100;
                // lvUpdata 重新计算 onenextexp
                expToNext = getExpToNextLevel(newLevel);
              } else {
                // 经验不足，转为逐级升级
                break;
              }
            } else {
              // 等级 < 125000，逐级升级
              getExpNokori -= expToNext;
              newLevel++;
              lvupsitanum++;
              expToNext = getExpToNextLevel(newLevel);
            }
          }
        }
        
        // 更新 lvC2（遵循gdata.txt中的lvupFunc()）
        const lvC2Increase = lvupsitanum * 0.5;
        const newLvC2 = (player.lvC2 || 0.5) + lvC2Increase;
        
        // 计算最终属性加成（包含装备和存货加成）
        const bonus = getLevelBonus(newLevel);
        
        const weaponObj = player.equippedWeapon;
        const weaponQty = weaponObj ? (inventory.find(i => i.equipmentId === weaponObj.id)?.quantity || 1) : 1;
        
        const armorObj = player.equippedArmor;
        const armorQty = armorObj ? (inventory.find(i => i.equipmentId === armorObj.id)?.quantity || 1) : 1;
        
        const accessories = player.equippedAccessories || [];
        
        // 属性点加成
        const stPtAllocate = player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        const hpStPtBonus = stPtAllocate.hp * 5;
        const atkStPtBonus = stPtAllocate.atk * 3;
        const defStPtBonus = stPtAllocate.def * 3;
        const agiStPtBonus = stPtAllocate.agi * 2;
        const lucStPtBonus = stPtAllocate.luc * 1;
        
        // 基础属性
        let baseHp = initialPlayer.maxHp + bonus.hp + hpStPtBonus;
        let baseAtk = initialPlayer.attack + bonus.attack + atkStPtBonus;
        let baseDef = initialPlayer.defense + bonus.defense + defStPtBonus;
        let baseAgi = initialPlayer.agility + bonus.agility + agiStPtBonus;
        let baseLuc = initialPlayer.luck + bonus.luck + lucStPtBonus;
        
        // 处理 Gem 饰品固定加成（Brave/War/FourGod Gems）
        const braveGems = accessories.filter(acc => acc && acc.t1 === 40);
        for (const gem of braveGems) {
          const val = gem.t2 || 0;
          baseHp += val; baseAtk += val; baseDef += val; baseAgi += val; baseLuc += val;
        }
        const warGems = accessories.filter(acc => acc && acc.t1 === 41);
        for (const gem of warGems) {
          const val = gem.t2 || 0;
          baseAtk += val; baseDef += val; baseAgi += val;
        }
        const fourGodGems = accessories.filter(acc => acc && acc.t1 === 42);
        for (const gem of fourGodGems) {
          const val = gem.t2 || 0;
          baseHp += val; baseAtk += val; baseDef += val; baseAgi += val;
        }
        
        updateHighLv(newLevel);
        
        // 勇敢证明 (820) 和能力宝石 (35) 额外倍率
        const braveProof = accessories.find(acc => acc && acc.t1 === 820);
        if (braveProof) {
          const rate = (braveProof.t2 || 30) / 100;
          baseHp = Math.ceil(baseHp * (1 + rate));
          baseAtk = Math.ceil(baseAtk * (1 + rate));
          baseDef = Math.ceil(baseDef * (1 + rate));
          baseAgi = Math.ceil(baseAgi * (1 + rate));
          baseLuc = Math.ceil(baseLuc * (1 + rate));
        }
        
        const playerGems = accessories.filter(acc => acc && acc.t1 === 35);
        for (const gem of playerGems) {
          const bonusPercent = gem.t2 || 0;
          let itemCount = 0;
          for (const item of inventory) {
            const eq = getEquipmentById(item.equipmentId);
            if (eq && (eq.type === 'accessory' || eq.type === 'weapon' || eq.type === 'armor')) {
              itemCount += item.quantity;
            }
          }
          const rate = (bonusPercent * Math.min(itemCount, 1000) / 1000) / 100;
          baseHp = Math.ceil(baseHp * (1 + rate));
          baseAtk = Math.ceil(baseAtk * (1 + rate));
          baseDef = Math.ceil(baseDef * (1 + rate));
          baseAgi = Math.ceil(baseAgi * (1 + rate));
        }
        
        const { hardmode, kyarakutalv, kyarakutaKozinExp } = get();
        const bonuses = applyEquipmentBonuses(accessories, inventory, hardmode || 0, kyarakutalv || 0, kyarakutaKozinExp || [], player.heroId || 0);
        
        // 根据 gdata.txt 中的 lvupFunc()，每级属性点 = 4 + GetPlusStPt
        const stPtPerLevel = 4 + bonuses.GetPlusStPt;
        const stPtIncrease = lvupsitanum * stPtPerLevel;
        
        // 武器/防具贡献分量
        const equip = getEquipComponents(weaponObj, weaponQty, player.weaponSoul, armorObj, armorQty, player.armorSoul, baseHp);
        
        // 英雄加成
        const heroBonuses = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLv = getCurrentKyaraLv(kyarakutaKozinExp, player.heroId);
        const kyaraLv = ((kyarakutalv + currentKyaraLv) * 0.25 + 0.75);
        
        // gdata.txt hwMode 公式
        const stats = computeFinalStats(baseHp, baseAtk, baseDef, baseAgi, baseLuc, equip, bonuses, heroBonuses, kyaraLv);
        const finalHp = stats.hp;
        const finalAtk = stats.atk;
        const finalDef = stats.def;
        const finalAgi = stats.agi;
        const finalLuc = stats.luc;
        
        const { autoAllocateEnabled, autoAllocateStPt } = get();
        
        let finalStPt = (player.stPt || 0) + stPtIncrease;
        
        if (autoAllocateEnabled && stPtIncrease > 0) {
          const afterSet = {
            player: {
              ...player,
              level: newLevel,
              maxHp: finalHp,
              hp: finalHp,
              attack: finalAtk,
              defense: finalDef,
              agility: finalAgi,
              luck: finalLuc,
              maxMana: initialPlayer.maxMana + bonus.mana,
              mana: initialPlayer.maxMana + bonus.mana,
              stPt: finalStPt,
              exp: getExpNokori,
              expToNextLevel: expToNext,
              lvC2: newLvC2,
            },
          };
          set(afterSet);
          autoAllocateStPt();
          const stPtData = loadSaveData();
          stPtData.stPt = 0;
          saveSaveData(stPtData);
          return;
        }
        
        set({
          player: {
            ...player,
            level: newLevel,
            maxHp: finalHp,
            hp: finalHp,
            attack: finalAtk,
            defense: finalDef,
            agility: finalAgi,
            luck: finalLuc,
            maxMana: initialPlayer.maxMana + bonus.mana,
            mana: initialPlayer.maxMana + bonus.mana,
            stPt: finalStPt,
            exp: getExpNokori,
            expToNextLevel: expToNext,
            lvC2: newLvC2,
          },
        });
        const stPtData = loadSaveData();
        stPtData.stPt = finalStPt;
        saveSaveData(stPtData);
      },
      addToInventory: (equipmentId, quantity) => {
        const { inventory } = get();
        const equipment = getEquipmentById(equipmentId);
        const maxQty = equipment?.maxQuantity ?? 10;
        const currentQty = inventory.find(i => i.equipmentId === equipmentId)?.quantity || 0;
        const canAdd = Math.min(quantity, maxQty - currentQty);
        if (canAdd <= 0) return;
        
        const newItem: InventoryItem = { equipmentId, quantity: canAdd };
        saveCollection([newItem]);
        
        const existingItem = inventory.find(item => item.equipmentId === equipmentId);
        if (existingItem) {
          const newInventory = inventory.map(item =>
            item.equipmentId === equipmentId
              ? { ...item, quantity: item.quantity + canAdd }
              : item
          );
          set({ inventory: newInventory });
        } else {
          set({ inventory: [...inventory, newItem] });
        }
      },
      removeFromInventory: (equipmentId, quantity) => {
        const { inventory } = get();
        const newInventory = inventory
          .map(item =>
            item.equipmentId === equipmentId
              ? { ...item, quantity: item.quantity - quantity }
              : item
          )
          .filter(item => item.quantity > 0);
        set({ inventory: newInventory });
      },
      equipItem: (equipment, slotIndex) => {
        const { player, inventory } = get();
        
        // [DEBUG] dump current stats on demand
        if ((window as any).__dumpStats) {
          console.group('%c📊 当前属性快照', 'color: cyan; font-weight: bold');
          console.log('HP:', player.maxHp, 'ATK:', player.attack, 'DEF:', player.defense, 'AGI:', player.agility, 'LUC:', player.luck);
          const accs = player.equippedAccessories || [];
          console.log('饰品:', accs.map(a => a ? `${a.name}(t1=${a.t1},t2=${a.t2})` : '空').join(' | '));
          if (player.equippedWeapon) console.log('武器:', player.equippedWeapon.name, `(t1=${player.equippedWeapon.t1})`);
          if (player.equippedArmor) console.log('防具:', player.equippedArmor.name, `(t1=${player.equippedArmor.t1})`);
          console.groupEnd();
          delete (window as any).__dumpStats;
        }
        
        let newPlayer = { ...player };
        
        if (equipment.type === 'weapon') {
          if (player.equippedWeapon?.id === equipment.id) {
            return;
          }
          newPlayer.equippedWeapon = equipment;
        } else if (equipment.type === 'armor') {
          if (player.equippedArmor?.id === equipment.id) {
            return;
          }
          newPlayer.equippedArmor = equipment;
        } else if (equipment.type === 'soul') {
          if (equipment.price > player.gold) {
            return;
          }
          
          const soulItem = inventory.find(i => i.equipmentId === equipment.id);
          if (!soulItem || soulItem.quantity <= 0) {
            return;
          }
          
          if (slotIndex === 14) {
            if (player.weaponSoul?.id === equipment.id) {
              return;
            }
            
            const oldWeaponSoul = player.weaponSoul;
            if (oldWeaponSoul) {
              const oldSoulItem = inventory.find(i => i.equipmentId === oldWeaponSoul.id);
              if (oldSoulItem) {
                oldSoulItem.quantity += 1;
              }
            }
            
            newPlayer.weaponSoul = equipment;
            soulItem.quantity -= 1;
            newPlayer.gold -= equipment.price;
          } else if (slotIndex === 15) {
            if (player.armorSoul?.id === equipment.id) {
              return;
            }
            
            const oldArmorSoul = player.armorSoul;
            if (oldArmorSoul) {
              const oldSoulItem = inventory.find(i => i.equipmentId === oldArmorSoul.id);
              if (oldSoulItem) {
                oldSoulItem.quantity += 1;
              }
            }
            
            newPlayer.armorSoul = equipment;
            soulItem.quantity -= 1;
            newPlayer.gold -= equipment.price;
          }
        } else if (equipment.type === 'accessory') {
          const accessories = [...(newPlayer.equippedAccessories || [])];
          const accRank = equipment.rank ?? -1;
          
          const getSlotMaxRank = (slotIndex: number): number => {
            if (slotIndex <= 5) return 3; // 1-6号槽位：所有星级 (R1-R4)
            if (slotIndex <= 7) return 2; // 7-8号槽位：3星及以下 (R1-R3)
            if (slotIndex <= 9) return 1; // 9-10号槽位：2星及以下 (R1-R2)
            return 0; // 11-12号槽位：1星 (R1)
          };
          
          if (slotIndex !== undefined && slotIndex < accessories.length) {
            // 替换指定栏位的饰品
            if (accessories[slotIndex]?.id === equipment.id) return;
            if (accRank > getSlotMaxRank(slotIndex)) return; // 星级不匹配
            accessories[slotIndex] = equipment;
          } else if (slotIndex !== undefined) {
            // 指定了空栏位
            if (slotIndex >= newPlayer.maxAccessorySlots) return;
            if (accRank > getSlotMaxRank(slotIndex)) return; // 星级不匹配
            // 扩容到 slotIndex
            while (accessories.length <= slotIndex) {
              accessories.push(null as any);
            }
            accessories[slotIndex] = equipment;
          } else if (accessories.length < newPlayer.maxAccessorySlots) {
            // 自动寻找第一个兼容的栏位
            let placed = false;
            for (let i = 0; i < newPlayer.maxAccessorySlots; i++) {
              if (!accessories[i] && accRank <= getSlotMaxRank(i)) {
                accessories[i] = equipment;
                placed = true;
                break;
              }
            }
            if (!placed) return;
          } else {
            return;
          }
          newPlayer.equippedAccessories = accessories;
        }
        
        // 计算武器贡献（含存货加成和倍率）
        const weaponObj = newPlayer.equippedWeapon;
        const weaponQty = weaponObj ? (inventory.find(i => i.equipmentId === weaponObj.id)?.quantity || 1) : 1;
        
        // 计算防具贡献（含存货加成和倍率）
        const armorObj = newPlayer.equippedArmor;
        const armorQty = armorObj ? (inventory.find(i => i.equipmentId === armorObj.id)?.quantity || 1) : 1;
        
        const accessories = newPlayer.equippedAccessories || [];
        
        // 使用已分配的属性点
        const stPtAllocate = player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        
        // 基础属性 = 初始值 + 等级加成 + 属性点加成
        const baseHp_calc = initialPlayer.maxHp + getLevelBonus(newPlayer.level).hp + stPtAllocate.hp * 5;
        const baseAtk_calc = initialPlayer.attack + getLevelBonus(newPlayer.level).attack + stPtAllocate.atk * 3;
        const baseDef_calc = initialPlayer.defense + getLevelBonus(newPlayer.level).defense + stPtAllocate.def * 3;
        const baseAgi_calc = initialPlayer.agility + getLevelBonus(newPlayer.level).agility + stPtAllocate.agi * 2;
        const baseLuc_calc = initialPlayer.luck + getLevelBonus(newPlayer.level).luck + stPtAllocate.luc * 1;
        
        // 饰品加成
        const { kyarakutalv, kyarakutaKozinExp } = get();
        const bonuses1 = applyEquipmentBonuses(accessories, inventory, get().hardmode || 0, kyarakutalv || 0, kyarakutaKozinExp || [], player.heroId || 0);
        
        // 武器/防具贡献分量
        const equip1 = getEquipComponents(weaponObj, weaponQty, newPlayer.weaponSoul, armorObj, armorQty, newPlayer.armorSoul, baseHp_calc);
        
        // 英雄加成
        const heroBonuses1 = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLv1 = getCurrentKyaraLv(kyarakutaKozinExp, player.heroId);
        const kyaraLv1 = ((kyarakutalv + currentKyaraLv1) * 0.25 + 0.75);
        
        const stats1 = computeFinalStats(baseHp_calc, baseAtk_calc, baseDef_calc, baseAgi_calc, baseLuc_calc, equip1, bonuses1, heroBonuses1, kyaraLv1);
        
        newPlayer.maxHp = stats1.hp;
        newPlayer.attack = stats1.atk;
        newPlayer.defense = stats1.def;
        newPlayer.agility = stats1.agi;
        newPlayer.luck = stats1.luc;
        
        const duskCrystal = accessories.filter(acc => acc && acc.t1 === 15);
        if (duskCrystal.length > 0) {
          const currentStPt = newPlayer.stPt || 0;
          newPlayer.stPt = Math.ceil(currentStPt * 0.6);
        }
        
        if (equipment.type === 'accessory' && equipment.t1 === 9999) {
          set({ battlePoints: 0, currentScene: 'gameover' });
          return;
        }
        
        let battlePointsChange = 0;
        if (equipment.type === 'accessory' && equipment.t1 === 500) {
          battlePointsChange += equipment.t2 || 0;
        }
        
        // 更新当前激活背包的装备数据
        const currentSets = get().equipSets;
        const currentSlot = get().currentEquipSetSlotIndex;
        const newEquipSets = currentSets.map(s =>
          s.slotIndex === currentSlot ? {
            ...s,
            weaponId: newPlayer.equippedWeapon?.id ?? null,
            armorId: newPlayer.equippedArmor?.id ?? null,
            accessoryIds: (newPlayer.equippedAccessories || []).map(acc => acc?.id || null),
          } : s
        );
        
        // [DEBUG] log final stats and delta
        if (equipment.type === 'accessory') {
          const newAccs = newPlayer.equippedAccessories || [];
          console.log('新饰品:', newAccs.map(a => a ? `${a.name}(t1=${a.t1},t2=${a.t2})` : '空').join(', '));
          console.log('新属性:', {hp: newPlayer.maxHp, atk: newPlayer.attack, def: newPlayer.defense, agi: newPlayer.agility, luc: newPlayer.luck});
          console.log('属性变化:', {
            hp: newPlayer.maxHp - player.maxHp,
            atk: newPlayer.attack - player.attack,
            def: newPlayer.defense - player.defense,
            agi: newPlayer.agility - player.agility,
            luc: newPlayer.luck - player.luck
          });
          console.groupEnd();
        }
        
        set({ 
          player: newPlayer,
          equipSets: newEquipSets,
          battlePoints: get().battlePoints + battlePointsChange,
        });
        
        // 持久化保存
        const persistData = loadSaveData();
        persistData.equipSets = newEquipSets;
        saveSaveData(persistData);
        
        if (equipment.type === 'accessory') {
          get().checkZeroEquips();
        }
      },
      buyEquipment: (equipmentId) => {
        const { player, inventory, addToInventory, purchaseCounts } = get();
        const equipment = getEquipmentById(equipmentId);
        if (!equipment) return false;
        
        // 检查价格
        if (equipment.price <= 0) return false;
        
        // 计算当前价格（每次购买+10%）
        const purchasedTimes = purchaseCounts[equipmentId] || 0;
        const currentPrice = Math.ceil(equipment.price * (1 + purchasedTimes * 0.1));
        
        if (player.gold < currentPrice) return false;
        
        // 检查是否已达上限
        const existing = inventory.find(i => i.equipmentId === equipmentId);
        if (existing && existing.quantity >= equipment.maxQuantity) return false;
        
        // 扣钱 & 加入背包 & 增加购买次数
        set({ 
          player: { ...player, gold: player.gold - currentPrice },
          purchaseCounts: { ...purchaseCounts, [equipmentId]: purchasedTimes + 1 },
        });
        addToInventory(equipmentId, 1);
        return true;
      },
      synthesizeEquipment: (equipmentId) => {
        const { inventory, addToInventory, removeFromInventory } = get();
        const equipment = getEquipmentById(equipmentId);
        if (!equipment) return false;

        const typeMap: Record<string, string> = {
          weapon: 'weapon',
          armor: 'armor',
          accessory: 'accessory',
          soul: 'soul',
          material: 'material',
        };
        
        const recipe = getRecipeForEquipment(typeMap[equipment.type] || 'material', equipment.listnum || 0);
        if (!recipe) return false;

        for (const material of recipe.materials) {
          const matEquipment = getEquipmentByTypeAndListnum(material.type, material.listnum);
          if (!matEquipment) return false;
          
          const owned = inventory.find(i => i.equipmentId === matEquipment.id);
          if (!owned || owned.quantity < material.quantity) {
            return false;
          }
        }

        for (const material of recipe.materials) {
          const matEquipment = getEquipmentByTypeAndListnum(material.type, material.listnum);
          if (matEquipment) {
            removeFromInventory(matEquipment.id, material.quantity);
          }
        }

        addToInventory(equipmentId, 1);
        return true;
      },
      useConsumable: (equipmentId) => {
        const { inventory, updatePlayerHp, updatePlayerMana, removeFromInventory } = get();
        const item = inventory.find(i => i.equipmentId === equipmentId);
        if (!item) return;
        
        const equipment = getEquipmentById(equipmentId);
        if (!equipment || equipment.type !== 'consumable') return;
        
        if (equipment.hpBonus > 0) {
          updatePlayerHp(equipment.hpBonus);
        }
        
        const { player } = get();
        if (player.maxMana > 0 && equipment.hpBonus === 0) {
          updatePlayerMana(50);
        }
        
        removeFromInventory(equipmentId, 1);
      },
      setCurrentScene: (scene) => set({ currentScene: scene }),
      goToTitle: () => {
        set({ currentScene: 'title' });
      },
      killPlayer: () => {
        const { player, kyarakutalv, kyarakutaKozinExp } = get();
        
        let newKyarakutaKozinExp = addExpKyarakutaKozinExp(kyarakutaKozinExp, player.heroId, player.level);
        const currentKyaraLv = getCurrentKyaraLv(newKyarakutaKozinExp, player.heroId);
        let newKyarakutalv = kyarakutalv;
        if (newKyarakutalv > 0) {
          if (currentKyaraLv > newKyarakutalv) {
            newKyarakutalv = currentKyaraLv;
          }
        } else {
          newKyarakutalv = Math.max(currentKyaraLv, 1);
        }
        
        set({ 
          battlePoints: 0,
          currentScene: 'gameover',
          kyarakutalv: newKyarakutalv,
          kyarakutaKozinExp: newKyarakutaKozinExp,
        });

        const saveData = loadSaveData();
        saveData.kyarakutalv = newKyarakutalv;
        saveData.kyarakutaKozinExp = newKyarakutaKozinExp;
        saveSaveData(saveData);
      },
      setPreset: (presetIndex, preset) => {
        const { presets } = get();
        const newPresets = [...presets];
        newPresets[presetIndex] = [...preset];
        set({ presets: newPresets });
        
        const data = loadSaveData();
        data.presets = newPresets;
        saveSaveData(data);
      },
      setPresetNum: (num) => {
        set({ presetNum: num });
        
        const data = loadSaveData();
        data.presetNum = num;
        saveSaveData(data);
      },
      setAutoAllocateEnabled: (enabled) => {
        set({ autoAllocateEnabled: enabled });
        
        const data = loadSaveData();
        data.autoAllocateEnabled = enabled;
        saveSaveData(data);
      },
      saveEquipSet: (name) => {
        const { player, equipSets } = get();
        const newSet: EquipSet = {
          id: `set-${Date.now()}`,
          name,
          weaponId: player.equippedWeapon?.id ?? null,
          armorId: player.equippedArmor?.id ?? null,
          accessoryIds: player.equippedAccessories.map(acc => acc?.id || null),
          weaponSoulId: player.weaponSoul?.id || null,
          armorSoulId: player.armorSoul?.id || null,
          createdAt: Date.now(),
          unlocked: true,
          slotIndex: equipSets.length,
        };
        const updatedSets = [...equipSets, newSet];
        set({ equipSets: updatedSets });
        
        const data = loadSaveData();
        data.equipSets = updatedSets;
        saveSaveData(data);
      },
      loadEquipSet: (setId) => {
        const state = get();
        const { equipSets, currentEquipSetSlotIndex, player, inventory } = state;
        const equipSet = equipSets.find(set => set.id === setId);
        if (!equipSet || !equipSet.unlocked) return;
        
        // Save current equipment to current active set
        let updatedSets = equipSets.map(set =>
          set.slotIndex === currentEquipSetSlotIndex ? {
            ...set,
            weaponId: player.equippedWeapon?.id ?? null,
            armorId: player.equippedArmor?.id ?? null,
            accessoryIds: (player.equippedAccessories || []).map(acc => acc?.id || null),
            weaponSoulId: player.weaponSoul?.id || null,
            armorSoulId: player.armorSoul?.id || null,
          } : set
        );
        
        const weapon = equipSet.weaponId != null ? equipmentData.find(e => String(e.id) === String(equipSet.weaponId)) || null : null;
        const armor = equipSet.armorId != null ? equipmentData.find(e => String(e.id) === String(equipSet.armorId)) || null : null;
        const accessories = (equipSet.accessoryIds || []).map(id => id ? equipmentData.find(e => e.id === id) || null : null).filter(Boolean) as Equipment[];
        const targetWeaponSoul = equipSet.weaponSoulId ? equipmentData.find(e => e.id === equipSet.weaponSoulId) || null : null;
        const targetArmorSoul = equipSet.armorSoulId ? equipmentData.find(e => e.id === equipSet.armorSoulId) || null : null;
        
        // [DEBUG] loadEquipSet
        console.group('%c📦 loadEquipSet: 切换背包', 'color: blue; font-weight: bold');
        console.log('旧饰品:', player.equippedAccessories?.map(a => a ? `${a.name}(t1=${a.t1},t2=${a.t2})` : '空').join(', ') || '空');
        console.log('旧属性:', {hp: player.maxHp, atk: player.attack, def: player.defense, agi: player.agility, luc: player.luck});
        
        // 使用统一的 applyEquipmentBonuses 函数计算饰品加成
        const { kyarakutalv: kclv, kyarakutaKozinExp: kcexp } = get();
        const bonuses = applyEquipmentBonuses(accessories, inventory, get().hardmode || 0, kclv || 0, kcexp || [], player.heroId || 0);
        
        // 使用已分配的属性点
        const stPtAllocate = player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        
        // 基础属性
        const baseHp2 = initialPlayer.maxHp + getLevelBonus(player.level).hp + stPtAllocate.hp * 5;
        const baseAtk2 = initialPlayer.attack + getLevelBonus(player.level).attack + stPtAllocate.atk * 3;
        const baseDef2 = initialPlayer.defense + getLevelBonus(player.level).defense + stPtAllocate.def * 3;
        const baseAgi2 = initialPlayer.agility + getLevelBonus(player.level).agility + stPtAllocate.agi * 2;
        const baseLuc2 = initialPlayer.luck + getLevelBonus(player.level).luck + stPtAllocate.luc * 1;
        
        // 武器/防具贡献分量
        const weaponQty2 = weapon ? (inventory.find(i => i.equipmentId === weapon.id)?.quantity || 1) : 1;
        const armorQty2 = armor ? (inventory.find(i => i.equipmentId === armor.id)?.quantity || 1) : 1;
        const equip2 = getEquipComponents(weapon, weaponQty2, targetWeaponSoul, armor, armorQty2, targetArmorSoul, baseHp2);
        
        // 英雄加成
        const heroBonuses2 = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLv2 = getCurrentKyaraLv(kcexp, player.heroId);
        const kyaraLv2 = ((kclv + currentKyaraLv2) * 0.25 + 0.75);
        
        // gdata.txt hwMode 公式
        const stats2 = computeFinalStats(baseHp2, baseAtk2, baseDef2, baseAgi2, baseLuc2, equip2, bonuses, heroBonuses2, kyaraLv2);
        
        const newPlayer = {
          ...player,
          equippedWeapon: weapon,
          equippedArmor: armor,
          equippedAccessories: accessories,
          weaponSoul: targetWeaponSoul,
          armorSoul: targetArmorSoul,
          maxHp: stats2.hp,
          attack: stats2.atk,
          defense: stats2.def,
          agility: stats2.agi,
          luck: stats2.luc,
        };
        
        // [DEBUG] loadEquipSet final
        const newAccs = newPlayer.equippedAccessories || [];
        console.log('新饰品:', newAccs.map(a => a ? `${a.name}(t1=${a.t1},t2=${a.t2})` : '空').join(', '));
        console.log('新属性:', {hp: newPlayer.maxHp, atk: newPlayer.attack, def: newPlayer.defense, agi: newPlayer.agility, luc: newPlayer.luck});
        console.log('属性变化:', {
          hp: newPlayer.maxHp - player.maxHp,
          atk: newPlayer.attack - player.attack,
          def: newPlayer.defense - player.defense,
          agi: newPlayer.agility - player.agility,
          luc: newPlayer.luck - player.luck
        });
        console.groupEnd();
        
        set({
          player: newPlayer,
          equipSets: updatedSets,
          currentEquipSetSlotIndex: equipSet.slotIndex,
        });
        
        const data = loadSaveData();
        data.equipSets = updatedSets;
        saveSaveData(data);
      },
      deleteEquipSet: (setId) => {
        const { equipSets } = get();
        const updatedSets = equipSets.filter(set => set.id !== setId);
        set({ equipSets: updatedSets });
        
        const data = loadSaveData();
        data.equipSets = updatedSets;
        saveSaveData(data);
      },
      renameEquipSet: (setId, name) => {
        const { equipSets } = get();
        const updatedSets = equipSets.map(set => 
          set.id === setId ? { ...set, name } : set
        );
        set({ equipSets: updatedSets });
        
        const data = loadSaveData();
        data.equipSets = updatedSets;
        saveSaveData(data);
      },
      purchaseEquipSet: (slotIndex: number): boolean => {
        const { player, equipSets } = get();
        const prices = [0, 300000, 500000, 700000, 150000000, 500000000, 1200000000];
        if (slotIndex < 0 || slotIndex >= prices.length) return false;
        
        const price = prices[slotIndex];
        if (player.gold < price) return false;
        
        const existingSet = equipSets.find(set => set.slotIndex === slotIndex);
        if (existingSet && existingSet.unlocked) return false;
        
        const newSet: EquipSet = {
          id: `set-${Date.now()}`,
          name: `背包${slotIndex + 1}`,
          weaponId: '0' as any,
          armorId: '0' as any,
          accessoryIds: [],
          weaponSoulId: null,
          armorSoulId: null,
          createdAt: Date.now(),
          unlocked: true,
          slotIndex,
        };
        
        let updatedSets;
        if (existingSet) {
          updatedSets = equipSets.map(set => 
            set.slotIndex === slotIndex ? newSet : set
          );
        } else {
          updatedSets = [...equipSets, newSet];
        }
        
        set(state => ({
          player: {
            ...state.player,
            gold: state.player.gold - price,
          },
          equipSets: updatedSets,
        }));
        
        return true;
      },
      getEquipSetPrice: (slotIndex: number): number | null => {
        const prices = [0, 300000, 500000, 700000, 150000000, 500000000, 1200000000];
        if (slotIndex < 0 || slotIndex >= prices.length) return null;
        return prices[slotIndex];
      },
      updateCurrentEquipSet: () => {
        const { player, equipSets } = get();
        const unlockedSets = equipSets.filter(set => set.unlocked);
        if (unlockedSets.length === 0) return;
        
        const firstUnlocked = unlockedSets[0];
        const updatedSets = equipSets.map(set => 
          set.id === firstUnlocked.id ? {
            ...set,
            weaponId: player.equippedWeapon?.id ?? null,
            armorId: player.equippedArmor?.id ?? null,
            accessoryIds: player.equippedAccessories.map(acc => acc?.id || null),
            weaponSoulId: player.weaponSoul?.id || null,
            armorSoulId: player.armorSoul?.id || null,
          } : set
        );
        
        set({ equipSets: updatedSets });
        
        const data = loadSaveData();
        data.equipSets = updatedSets;
        saveSaveData(data);
      },
      autoAllocateStPt: () => {
        const { player, presets, presetNum } = get();
        const stPt = player.stPt || 0;
        if (stPt <= 0) return;
        
        const preset = presets[presetNum];
        if (!preset || preset.length !== 5) return;
        
        const [hpPct, atkPct, defPct, agiPct, lucPct] = preset;
        const totalPct = hpPct + atkPct + defPct + agiPct + lucPct;
        if (totalPct <= 0) return;
        
        let remaining = stPt;
        let hpAdd = 0, atkAdd = 0, defAdd = 0, agiAdd = 0, lucAdd = 0;
        
        if (hpPct > 0) {
          hpAdd = Math.floor((stPt * hpPct) / totalPct);
          remaining -= hpAdd;
        }
        if (atkPct > 0 && remaining > 0) {
          atkAdd = Math.floor((stPt * atkPct) / totalPct);
          remaining -= atkAdd;
        }
        if (defPct > 0 && remaining > 0) {
          defAdd = Math.floor((stPt * defPct) / totalPct);
          remaining -= defAdd;
        }
        if (agiPct > 0 && remaining > 0) {
          agiAdd = Math.floor((stPt * agiPct) / totalPct);
          remaining -= agiAdd;
        }
        if (lucPct > 0 && remaining > 0) {
          lucAdd = remaining;
        }
        
        set({
          player: {
            ...player,
            maxHp: player.maxHp + hpAdd * 5,
            hp: player.hp + hpAdd * 5,
            attack: player.attack + atkAdd * 3,
            defense: player.defense + defAdd * 3,
            agility: player.agility + agiAdd * 2,
            luck: player.luck + lucAdd * 1,
            stPt: 0,
          },
        });
      },
      selectHero: (heroId) => {
        const { player } = get();
        const hero = getHeroById(heroId);
        if (!hero) return;
        
        const levelBonus = getLevelBonus(player.level);
        
        const baseHp = 1000 + levelBonus.hp;
        const baseAtk = 1000 + levelBonus.attack;
        const baseDef = 1000 + levelBonus.defense;
        const baseAgi = 1000 + levelBonus.agility;
        const baseLuc = 1000 + levelBonus.luck;
        
        const { kyarakutalv, kyarakutaKozinExp } = get();
        const currentKyaraLv = getCurrentKyaraLv(kyarakutaKozinExp, player.heroId);
        const kyaraLv = ((kyarakutalv + currentKyaraLv) * 0.25 + 0.75);
        
        const hpBonus = hero.hpBonus * kyaraLv * 0.06;
        const atkBonus = hero.atkBonus * kyaraLv * 0.07;
        const defBonus = hero.defBonus * kyaraLv * 0.07;
        const agiBonus = hero.agiBonus * kyaraLv * 0.075;
        const lucBonus = hero.lucBonus * kyaraLv * 0.08;
        
        const newMaxHp = Math.floor(baseHp * (1 + hpBonus));
        const newAtk = Math.floor(baseAtk * (1 + atkBonus));
        const newDef = Math.floor(baseDef * (1 + defBonus));
        const newAgi = Math.floor(baseAgi * (1 + agiBonus));
        const newLuc = Math.floor(baseLuc * (1 + lucBonus));
        
        set({
          player: {
            ...player,
            heroId,
            name: hero.name,
            maxHp: newMaxHp,
            hp: Math.min(player.hp, newMaxHp),
            attack: newAtk,
            defense: newDef,
            agility: newAgi,
            luck: newLuc,
          },
        });
      },
      setHardmode: (hardmode) => {
        console.log('[setHardmode] Called with hardmode:', hardmode);
        const maxBP = hardmode === 1 ? 15 : 30;
        set({ hardmode, maxBattlePoints: maxBP, battlePoints: maxBP });
        const data = loadSaveData();
        data.hardmode = hardmode;
        saveSaveData(data);
        console.log('[setHardmode] Done - maxBattlePoints:', maxBP, 'battlePoints:', maxBP);
      },
      setLanguage: (language) => {
        set({ language });
        
        const data = loadSaveData();
        data.language = language;
        saveSaveData(data);
      },
      startGame: () => {
        const { player, inventory, skills, battlePoints, maxBattlePoints, hardmode, gameovercount, kyarakutalv, kyarakutaKozinExp } = get();
        console.log('[startGame] Start - player:', { maxHp: player.maxHp, attack: player.attack, defense: player.defense, agility: player.agility, luck: player.luck }, 'hardmode:', hardmode, 'battlePoints:', battlePoints, 'maxBattlePoints:', maxBattlePoints);
        
        let finalInventory = [...inventory];
        let finalEquippedWeapon = player.equippedWeapon;
        let finalEquippedArmor = player.equippedArmor;
        let finalWeaponSoul = player.weaponSoul;
        let finalArmorSoul = player.armorSoul;
        let finalEquippedAccessories = [...(player.equippedAccessories || [])];
        
        if (gameovercount === 0) {
          const starterWeapon = getEquipmentById('weapon-0');
          const starterArmor = getEquipmentById('armor-0');
          
          if (starterWeapon && !player.equippedWeapon) {
            finalEquippedWeapon = starterWeapon;
            const existingWeapon = finalInventory.find(i => i.equipmentId === 'weapon-0');
            if (!existingWeapon) {
              finalInventory.push({ equipmentId: 'weapon-0', quantity: 1 });
            }
          }
          
          if (starterArmor && !player.equippedArmor) {
            finalEquippedArmor = starterArmor;
            const existingArmor = finalInventory.find(i => i.equipmentId === 'armor-0');
            if (!existingArmor) {
              finalInventory.push({ equipmentId: 'armor-0', quantity: 1 });
            }
          }
          
          finalEquippedAccessories = [];
          finalWeaponSoul = null;
          finalArmorSoul = null;
        }
        
        const newBattlePoints = battlePoints <= 0 ? (hardmode === 1 ? 15 : maxBattlePoints) : battlePoints;
        
        const levelBonus = getLevelBonus(player.level);
        
        const weaponObj = finalEquippedWeapon;
        const weaponQty = weaponObj ? (finalInventory.find(i => i.equipmentId === weaponObj.id)?.quantity || 1) : 1;
        
        const armorObj = finalEquippedArmor;
        const armorQty = armorObj ? (finalInventory.find(i => i.equipmentId === armorObj.id)?.quantity || 1) : 1;
        
        const accessories = finalEquippedAccessories || [];
        
        const stPtAllocate = player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        
        // 基础属性 = 初始值 + 等级加成 + 属性点加成
        const baseHp = initialPlayer.maxHp + (levelBonus.hp || 0) + stPtAllocate.hp * 5;
        const baseAtk = initialPlayer.attack + (levelBonus.attack || 0) + stPtAllocate.atk * 3;
        const baseDef = initialPlayer.defense + (levelBonus.defense || 0) + stPtAllocate.def * 3;
        const baseAgi = initialPlayer.agility + (levelBonus.agility || 0) + stPtAllocate.agi * 2;
        const baseLuc = initialPlayer.luck + (levelBonus.luck || 0) + stPtAllocate.luc * 1;
        
        // 武器/防具贡献分量
        const equip = getEquipComponents(weaponObj, weaponQty, finalWeaponSoul, armorObj, armorQty, finalArmorSoul, baseHp);
        
        // 饰品加成
        const bonuses = applyEquipmentBonuses(accessories, finalInventory, hardmode, kyarakutalv || 0, kyarakutaKozinExp || [], player.heroId || 0);
        
        // 英雄加成
        const heroBonuses = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLv = getCurrentKyaraLv(kyarakutaKozinExp, player.heroId);
        const kyaraLv = ((kyarakutalv + currentKyaraLv) * 0.25 + 0.75);
        
        // gdata.txt hwMode 公式计算最终属性
        const finalStats = computeFinalStats(baseHp, baseAtk, baseDef, baseAgi, baseLuc, equip, bonuses, heroBonuses, kyaraLv);
        
        const newMaxHp = finalStats.hp;
        const newAtk = finalStats.atk;
        const newDef = finalStats.def;
        const newAgi = finalStats.agi;
        const newLuc = finalStats.luc;
        
        set({
          player: {
            ...player,
            maxHp: newMaxHp,
            hp: newMaxHp,
            attack: newAtk,
            defense: newDef,
            agility: newAgi,
            luck: newLuc,
            maxMana: initialPlayer.maxMana + levelBonus.mana,
            mana: initialPlayer.maxMana + levelBonus.mana,
            equippedWeapon: finalEquippedWeapon,
            equippedArmor: finalEquippedArmor,
            equippedAccessories: finalEquippedAccessories,
            weaponSoul: finalWeaponSoul,
            armorSoul: finalArmorSoul,
          },
          inventory: finalInventory,
          skills,
          currentScene: 'world',
          encounterRate: 0,
          battlePoints: newBattlePoints,
          maxBattlePoints: hardmode === 1 ? 15 : 30,
          battle: {
            enemy: null,
            status: 'idle',
            battleLog: [] as string[],
            comboCount: 0,
            comboRate: 5,
            critRate: 5,
            hpRate: 100,
            dropRate: 0,
            dropItemName: '',
            turn: 'player',
            turnCount: 0,
            recoverNextTurn: false,
            recoverUsed: false,
            playerAnimation: 'idle',
            enemyAnimation: 'idle',
            dropType: -1,
            dropIndex: -1,
            isDropSuccess: false,
            goldMultiplier: 1,
            battleResult: null,
            _ending: false,
            damageDisplay: null,
            isCrit: false,
            isCombo: false,
            lastAttacker: null,
            _loopTurn: 0,
            _loopMode: 3,
            _loopTick: 0,
            _loopComboCount: 1,
            specialBonusType: null,
            activeEffect: null,
            resCount: bonuses.resCount,
            resStatUP: bonuses.resStatUP,
          },
        });
        console.log('[startGame] End - player stats:', { maxHp: newMaxHp, attack: newAtk, defense: newDef, agility: newAgi, luck: newLuc }, 'hardmode:', hardmode, 'newBattlePoints:', newBattlePoints);
        get().checkZeroEquips();
      },
      addEncounterRate: (amount) => {
        const { encounterRate, player } = get();
        const accessories = player.equippedAccessories || [];
        
        let adjustedAmount = amount;
        
        const encounterReduceRing = accessories.find(acc => acc && acc.t1 === 10);
        if (encounterReduceRing) {
          adjustedAmount *= 0.5;
        }
        
        const avoidBelt = accessories.find(acc => acc && acc.t1 === 13);
        if (avoidBelt && encounterRate < (avoidBelt.t2 || 45)) {
          return;
        }
        
        const newRate = Math.min(encounterRate + adjustedAmount, GAME_CONFIG.ENCOUNTER_MAX);
        set({ encounterRate: newRate });
        if (newRate >= GAME_CONFIG.ENCOUNTER_MAX) {
          get().startBattle();
        }
      },
      resetEncounterRate: () => set({ encounterRate: 0 }),
      startBattle: () => {
        const { player, battlePoints, inventory, Highlv, dropNum } = get();
        
        if (battlePoints <= 0) {
          return;
        }
        
        const accessories = player.equippedAccessories || [];
        const speedHourglass = accessories.find(acc => acc && (acc.t1 === 4100 || acc.t1 === 4101));
        const hourglassMultiplier = speedHourglass?.t1 === 4101 ? 3 : speedHourglass?.t1 === 4100 ? 2 : 1;
        
        const hardmode = get().hardmode || 0;
        const currentMap = get().currentMap;
        const mapEnemies = getMapEnemies(currentMap, hardmode);
        const randomIndex = Math.floor(Math.random() * mapEnemies.length);
        
        let enemy: ReturnType<typeof getMapEnemies>[0] = { ...mapEnemies[randomIndex] };
        const bonus = get().bonus;
        
        if (bonus.currentBonus && bonus.currentBonus.remainingCount > 0) {
          const isHiddenMap = get().currentMap === 13 || get().currentMap === 14 || get().currentMap === 124;
          const bonusType = bonus.currentBonus.bonusType;
          let bossId: number | null = null;
          const tekiseilv = mapEnemies[0]?.level || 0;
          const defeatedBosses = get().defeatedBosses || [];
          const totalWeaponCount = inventory.filter(item => item.equipmentId.startsWith('weapon-')).reduce((sum, item) => sum + (item.quantity || 0), 0);
          const totalArmorCount = inventory.filter(item => item.equipmentId.startsWith('armor-')).reduce((sum, item) => sum + (item.quantity || 0), 0);
          
          const getRandomBoss = (ids: number[]): number => {
            return ids[Math.floor(Math.random() * ids.length)];
          };
          
          switch (bonusType) {
            case 9:
              if (Math.random() <= 0.52) {
                bossId = getRandomBoss([32, 33, 34, 35]);
              }
              break;
            case 10:
              if (Math.random() <= 0.47) {
                if (hardmode === 0) {
                  bossId = getRandomBoss([40, 41, 42]);
                } else {
                  bossId = getRandomBoss([436, 437, 438, 439]);
                }
              }
              break;
            case 11:
              if (Math.random() <= 0.52) {
                let weights: number[];
                if (tekiseilv < 3000) {
                  weights = [10, 10, 10];
                } else if (tekiseilv < 8000) {
                  weights = [12, 12, 12, 9, 7, 7];
                } else {
                  weights = [10, 10, 10, 9, 7, 7];
                }
                const totalWeight = weights.reduce((sum, v) => sum + v, 0);
                let random = Math.random() * totalWeight;
                for (let i = 0; i < weights.length; i++) {
                  random -= weights[i];
                  if (random <= 0) {
                    bossId = 48 + i;
                    break;
                  }
                }
              }
              break;
            case 12:
              if (Math.random() <= 0.48) {
                bossId = 61;
                if (hardmode === 0) {
                  if (defeatedBosses.includes(60)) {
                    bossId = 60;
                  }
                } else if (defeatedBosses.includes(62)) {
                  bossId = 62;
                }
                if (bossId === 61) {
                  const weaponThreshold = hardmode === 0 ? 44 : 71;
                  if (totalWeaponCount >= weaponThreshold) {
                    bossId = hardmode === 0 ? 60 : 62;
                  }
                }
              }
              break;
            case 13:
              if (Math.random() <= 0.47) {
                bossId = 67;
                if (hardmode === 0) {
                  if (defeatedBosses.includes(66)) {
                    bossId = 66;
                  }
                } else if (defeatedBosses.includes(68)) {
                  bossId = 68;
                }
                if (bossId === 67) {
                  const weaponThreshold = hardmode === 0 ? 31 : 56;
                  if (totalWeaponCount >= weaponThreshold) {
                    bossId = hardmode === 0 ? 66 : 68;
                  }
                }
                if (bossId === 67) {
                  const armorThreshold = hardmode === 0 ? 12 : 28;
                  if (totalArmorCount >= armorThreshold) {
                    bossId = hardmode === 0 ? 66 : 68;
                  }
                }
              }
              break;
            case 14:
              if (Math.random() <= 0.48) {
                bossId = 61;
                if (hardmode === 0) {
                  if (defeatedBosses.includes(60)) {
                    bossId = 60;
                  }
                } else if (defeatedBosses.includes(62)) {
                  bossId = 62;
                }
                if (bossId === 61) {
                  const weaponThreshold = hardmode === 0 ? 44 : 71;
                  if (totalWeaponCount >= weaponThreshold) {
                    bossId = hardmode === 0 ? 60 : 62;
                  }
                }
              }
              break;
            case 15:
              if (Math.random() <= 0.47) {
                bossId = 67;
                if (hardmode === 0) {
                  if (defeatedBosses.includes(66)) {
                    bossId = 66;
                  }
                } else if (defeatedBosses.includes(68)) {
                  bossId = 68;
                }
                if (bossId === 67) {
                  const weaponThreshold = hardmode === 0 ? 31 : 56;
                  if (totalWeaponCount >= weaponThreshold) {
                    bossId = hardmode === 0 ? 66 : 68;
                  }
                }
                if (bossId === 67) {
                  const armorThreshold = hardmode === 0 ? 12 : 28;
                  if (totalArmorCount >= armorThreshold) {
                    bossId = hardmode === 0 ? 66 : 68;
                  }
                }
              }
              break;
            case 16:
              bossId = 90;
              break;
            case 17:
              if (Math.random() <= 0.68) {
                bossId = 104;
                if (hardmode === 0 && totalWeaponCount >= 80) {
                  bossId = 103;
                } else if (hardmode === 1 && totalWeaponCount >= 100) {
                  bossId = 105;
                }
              }
              break;
            case 18:
              if (Math.random() <= 0.68) {
                bossId = 104;
                if (hardmode === 0 && totalWeaponCount >= 80) {
                  bossId = 103;
                } else if (hardmode === 1 && totalWeaponCount >= 100) {
                  bossId = 105;
                }
              }
              break;
          }
          
          if (bossId !== null && !isHiddenMap) {
            const boss = getBossById(bossId, hardmode);
            if (boss) {
              enemy = { ...boss };
            }
          }
        }
        
        const difficultyMultipliers = [
          { hp: 1, attack: 1, exp: 1, gold: 1 },
          { hp: 10.1, attack: 8.65, exp: 12, gold: 5 },
          { hp: 100, attack: 86, exp: 22, gold: 9 },
        ];
        
        const multiplier = difficultyMultipliers[hardmode] || difficultyMultipliers[0];
        
        enemy.hp = Math.floor(enemy.maxHp * multiplier.hp);
        enemy.maxHp = Math.floor(enemy.maxHp * multiplier.hp);
        enemy.attack = Math.floor(enemy.attack * multiplier.attack);
        enemy.expReward = Math.floor(enemy.expReward * multiplier.exp);
        enemy.goldReward = Math.floor(enemy.goldReward * multiplier.gold);
        
        const normalDrops = enemy.drops.slice(0, 3);
        const hardDrops = enemy.drops.slice(3, 6);
        const hellDrops = enemy.drops.slice(6, 9);
        
        let activeDrops;
        if (hardmode === 2) {
          activeDrops = hellDrops;
        } else if (hardmode === 1) {
          activeDrops = hardDrops;
        } else {
          activeDrops = normalDrops;
        }
        
        const dropSlots = activeDrops.map((drop: { equipmentId: string; dropRate: number } | null) => {
          if (!drop) return null;
          const { itemType, itemIndex } = equipmentIdToItemTypeAndIndex(drop.equipmentId);
          return {
            itemType,
            itemIndex,
            baseRate: drop.dropRate,
          };
        }).filter(Boolean);
        
        const slot1 = dropSlots[0] || null;
        const slot2 = dropSlots[1] || null;
        const slot3 = dropSlots[2] || null;
        const stormPower = accessories.find(acc => acc && acc.t1 === 4001);
        const renzokuPlusKakuritu = stormPower ? 0.15 : 0;
        
        const battleVarResult = battleVarInit(
          {
            hp: player.hp,
            maxHp: player.maxHp,
            attack: player.attack,
            defense: player.defense,
            agility: player.agility,
            luck: player.luck,
          },
          {
            hp: enemy.maxHp,
            attack: enemy.attack,
            exp: enemy.expReward,
            gold: enemy.goldReward,
            level: enemy.level * 100,
          },
          dropSlots.length,
          {
            hardmode,
            renzokuPlusKakuritu,
            crihPlusKakuritu: 0,
            speedwariai: 0,
            lukwariai: 0,
            hourGlassON: false,
            hourGlassON1: false,
            expbairitu: 1,
          }
        );
        
        const settings = {
          donyokuOn: false,
          goyokuOn: false,
          twilightON: false,
          hardmode,
          dropBoost: 1,
        };
        
        const saveSettings = {
          dropNum,
          Highlv,
        };
        
        const greedRing = accessories.find(acc => acc && acc.t1 === 12);
        const greedPendant = accessories.find(acc => acc && acc.t1 === 77);
        let greedBonus = 1;
        if (greedRing) {
          greedBonus *= 2;
        }
        if (greedPendant) {
          greedBonus *= 1.4;
        }
        
        const dropResult = eneDropItemInit(slot1, slot2, slot3, battleVarResult.itemDropRate, inventory, settings, saveSettings, greedBonus);
        
        const dropEquipment = dropResult.getItemDropType !== -1 
          ? getEquipmentById(itemTypeAndIndexToEquipmentId(dropResult.getItemDropType, dropResult.getItemDropIndex))
          : null;
        
        
        
        // 应用地图奖励效果
        if (bonus.currentBonus && bonus.currentBonus.remainingCount > 0) {
          switch (bonus.currentBonus.bonusType) {
            case 0: // 敌HP半减
              enemy.hp = Math.floor(enemy.maxHp * 0.5);
              break;
            case 1: // 敌攻击力半减
              enemy.attack = Math.floor(enemy.attack * 0.5);
              break;
            case 2: // 会心连続率上昇
              battleVarResult.critRate = Math.min(1, battleVarResult.critRate + 0.15);
              battleVarResult.comboRate = Math.min(1, battleVarResult.comboRate + 0.15);
              break;
            case 3: // 金币2倍
              battleVarResult.goldMultiplier *= 2;
              break;
            case 4:
              battleVarResult.goldMultiplier *= 3;
              break;
            case 5:
              battleVarResult.goldMultiplier *= 4;
              break;
            case 6:
              battleVarResult.goldMultiplier *= 7;
              break;
            case 7: // 经验1.5倍 - 直接修改敌人经验值
              enemy.expReward = Math.floor(enemy.expReward * 1.5);
              break;
            case 8:
              enemy.expReward = Math.floor(enemy.expReward * 2);
              break;
          }
          // Reduce bonus remaining count
          const newRemaining = bonus.currentBonus.remainingCount - 1;
          console.log('[Bonus] Remaining after this battle:', newRemaining);
          set((s) => ({
            bonus: {
              ...s.bonus,
              currentBonus: newRemaining > 0 ? {
                ...s.bonus.currentBonus!,
                remainingCount: newRemaining,
              } : null,
            },
          }));
        }
        
        // 记录触发战斗的特殊 bonus 类型（12=i, 13=iii 等用于隐藏地图传送）
        const specialBonusType = bonus.currentBonus && bonus.currentBonus.bonusType >= 12
          ? bonus.currentBonus.bonusType
          : null;
        
        // 计算复活参数
        const eqBonuses = applyEquipmentBonuses(
          accessories, inventory, hardmode, get().kyarakutalv || 0, get().kyarakutaKozinExp || [], player.heroId || 0
        );
        
        const lang = get().language;
        set({
          player: { ...player, hp: player.maxHp },
          currentScene: 'battle',
          encounterRate: 0,
          battlePoints: battlePoints - hourglassMultiplier,
          battle: {
            enemy,
            status: 'idle',
            specialBonusType,
            battleLog: [
              getTranslation('敌人出现了！', lang),
              getTranslation('点击画面开始战斗', lang),
              getTranslation('战斗会自动进行', lang),
              getTranslation('点击画面可以暂停游戏', lang),
            ],
            comboCount: 0,
            comboRate: battleVarResult.comboRate * 100,
            critRate: battleVarResult.critRate * 100,
            hpRate: 100,
            dropRate: dropResult.getItemDropRate * 100,
            dropItemName: dropEquipment ? dropEquipment.name : '------',
            turn: 'player',
            turnCount: 0,
            recoverNextTurn: false,
            recoverUsed: false,
            playerAnimation: 'idle',
            enemyAnimation: 'idle',
            dropType: dropResult.getItemDropType,
            dropIndex: dropResult.getItemDropIndex,
            isDropSuccess: dropResult.isDropSuccess,
            goldMultiplier: battleVarResult.goldMultiplier,
            battleResult: null,
            _ending: false,
            damageDisplay: null,
            isCrit: false,
            isCombo: false,
            lastAttacker: null,
            _loopTurn: 0,
            _loopMode: 3,
            _loopTick: 0,
            _loopComboCount: 1,
            activeEffect: null,
            resCount: eqBonuses.resCount,
            resStatUP: eqBonuses.resStatUP,
          },
        });
      },
      startBossBattle: (bossId: number) => {
        const { player, battlePoints, inventory, Highlv, dropNum, defeatedBosses, bonus } = get();
        
        if (battlePoints <= 0) {
          return;
        }
        
        if (defeatedBosses.includes(bossId)) {
          return;
        }
        
        const accessories = player.equippedAccessories || [];
        const speedHourglass = accessories.find(acc => acc && (acc.t1 === 4100 || acc.t1 === 4101));
        const hourglassMultiplier = speedHourglass?.t1 === 4101 ? 3 : speedHourglass?.t1 === 4100 ? 2 : 1;
        
        set({ lastBossId: bossId });
        
        const hardmode = get().hardmode || 0;
        const boss = getBossById(bossId, hardmode);
        if (!boss) {
          return;
        }
        
        const difficultyMultipliers = [
          { hp: 1, attack: 1, exp: 1, gold: 1 },
          { hp: 10.1, attack: 8.65, exp: 12, gold: 5 },
          { hp: 100, attack: 86, exp: 22, gold: 9 },
        ];
        
        const multiplier = difficultyMultipliers[hardmode] || difficultyMultipliers[0];
        
        const modifiedBoss = { ...boss };
        modifiedBoss.hp = Math.floor(boss.maxHp * multiplier.hp);
        modifiedBoss.maxHp = Math.floor(boss.maxHp * multiplier.hp);
        modifiedBoss.attack = Math.floor(boss.attack * multiplier.attack);
        modifiedBoss.expReward = Math.floor(boss.expReward * multiplier.exp);
        modifiedBoss.goldReward = Math.floor(boss.goldReward * multiplier.gold);
        
        // 应用地图奖励效果到 Boss
        if (bonus.currentBonus && bonus.currentBonus.remainingCount > 0) {
          switch (bonus.currentBonus.bonusType) {
            case 0: // 敌HP半减
              modifiedBoss.hp = Math.floor(modifiedBoss.maxHp * 0.5);
              break;
            case 1: // 敌攻击力半减
              modifiedBoss.attack = Math.floor(modifiedBoss.attack * 0.5);
              break;
            case 7: // 经验1.5倍
              modifiedBoss.expReward = Math.floor(modifiedBoss.expReward * 1.5);
              break;
            case 8: // 经验2倍
              modifiedBoss.expReward = Math.floor(modifiedBoss.expReward * 2);
              break;
          }
        }
        
        const normalDrops = boss.drops.slice(0, 3);
        const hardDrops = boss.drops.slice(3, 6);
        const hellDrops = boss.drops.slice(6, 9);
        
        let activeDrops;
        if (hardmode === 2) {
          activeDrops = hellDrops;
        } else if (hardmode === 1) {
          activeDrops = hardDrops;
        } else {
          activeDrops = normalDrops;
        }
        
        const dropSlots = activeDrops.map((drop: { equipmentId: string; dropRate: number } | null) => {
          if (!drop) return null;
          const { itemType, itemIndex } = equipmentIdToItemTypeAndIndex(drop.equipmentId);
          return {
            itemType,
            itemIndex,
            baseRate: drop.dropRate,
          };
        }).filter(Boolean);
        
        const slot1 = dropSlots[0] || null;
        const slot2 = dropSlots[1] || null;
        const slot3 = dropSlots[2] || null;
        
        const stormPower = accessories.find(acc => acc && acc.t1 === 4001);
        const renzokuPlusKakuritu = stormPower ? 0.15 : 0;
        
        const battleVarResult = battleVarInit(
          {
            hp: player.hp,
            maxHp: player.maxHp,
            attack: player.attack,
            defense: player.defense,
            agility: player.agility,
            luck: player.luck,
          },
          {
            hp: modifiedBoss.maxHp,
            attack: modifiedBoss.attack,
            exp: modifiedBoss.expReward,
            gold: modifiedBoss.goldReward,
            level: boss.level * 100,
          },
          dropSlots.length,
          {
            hardmode,
            renzokuPlusKakuritu,
            crihPlusKakuritu: 0,
            speedwariai: 0,
            lukwariai: 0,
            hourGlassON: false,
            hourGlassON1: false,
            expbairitu: 1,
          }
        );
        
        const settings = {
          donyokuOn: false,
          goyokuOn: false,
          twilightON: false,
          hardmode,
          dropBoost: 1,
        };
        
        const saveSettings = {
          dropNum,
          Highlv,
        };
        
        const greedRing = accessories.find(acc => acc && acc.t1 === 12);
        const greedPendant = accessories.find(acc => acc && acc.t1 === 77);
        let greedBonus = 1;
        if (greedRing) {
          greedBonus *= 2;
        }
        if (greedPendant) {
          greedBonus *= 1.4;
        }
        
        const dropResult = eneDropItemInit(slot1, slot2, slot3, battleVarResult.itemDropRate, inventory, settings, saveSettings, greedBonus);
        
        const dropEquipment = dropResult.getItemDropType !== -1 
          ? getEquipmentById(itemTypeAndIndexToEquipmentId(dropResult.getItemDropType, dropResult.getItemDropIndex))
          : null;
        
        // 记录触发战斗的特殊 bonus 类型（12=i, 13=iii 用于隐藏地图传送）
        const specialBonusType = bonus.currentBonus && bonus.currentBonus.bonusType >= 12
          ? bonus.currentBonus.bonusType
          : null;
        
        // 计算复活参数
        const eqBonuses2 = applyEquipmentBonuses(
          accessories, inventory, hardmode, get().kyarakutalv || 0, get().kyarakutaKozinExp || [], player.heroId || 0
        );
        
        const lang = get().language;
        set({
          player: { ...player, hp: player.maxHp },
          currentScene: 'battle',
          encounterRate: 0,
          battlePoints: battlePoints - hourglassMultiplier,
          battle: {
            enemy: modifiedBoss,
            status: 'idle',
            battleLog: [
              getTranslation('BOSS出现了！', lang),
              `${boss.name}${getTranslation('降临！', lang)}`,
              getTranslation('点击画面开始战斗', lang),
              getTranslation('战斗会自动进行', lang),
              getTranslation('点击画面可以暂停游戏', lang),
            ],
            comboCount: 0,
            comboRate: battleVarResult.comboRate * 100,
            critRate: battleVarResult.critRate * 100,
            hpRate: 100,
            dropRate: dropResult.getItemDropRate * 100,
            dropItemName: dropEquipment ? dropEquipment.name : '------',
            turn: 'player',
            turnCount: 0,
            recoverNextTurn: false,
            recoverUsed: false,
            playerAnimation: 'idle',
            enemyAnimation: 'idle',
            dropType: dropResult.getItemDropType,
            dropIndex: dropResult.getItemDropIndex,
            isDropSuccess: dropResult.isDropSuccess,
            goldMultiplier: battleVarResult.goldMultiplier,
            battleResult: null,
            _ending: false,
            damageDisplay: null,
            isCrit: false,
            isCombo: false,
            lastAttacker: null,
            _loopTurn: 0,
            _loopMode: 3,
            _loopTick: 0,
            _loopComboCount: 1,
            specialBonusType,
            activeEffect: null,
            resCount: eqBonuses2.resCount,
            resStatUP: eqBonuses2.resStatUP,
          },
        });
      },
      endBattle: (victory) => {
        const { battle, player, addGold, addExp, addToInventory, updatePlayerHp, incrementWinBattle, incrementLoseBattle, updateHighCombo, battlePoints, defeatedBosses, kyarakutalv, kyarakutaKozinExp, battle: { comboCount, goldMultiplier } } = get();
        
        if (battle.battleResult) {
          return;
        }
        
        const { battleInterval } = get();
        if (battleInterval) {
          clearInterval(battleInterval);
          set({ battleInterval: null });
        }
        
        let goldReward = 0;
        let expReward = 0;
        let dropItem = undefined;
        let battlePointsChange = 0;
        
        const accessories = player.equippedAccessories || [];
        const greedPendant = accessories.find(acc => acc && acc.t1 === 77);
        const speedHourglass = accessories.find(acc => acc && (acc.t1 === 4100 || acc.t1 === 4101));
        
        if (victory && battle.enemy) {
          goldReward = Math.floor(battle.enemy.goldReward * goldMultiplier);
          expReward = battle.enemy.expReward;
          
          if (greedPendant) {
            expReward = 0;
          }
          
          const expGems = accessories.filter(acc => acc && acc.t1 === 60);
          for (const gem of expGems) {
            const expBonus = (gem.t2 || 0) / 100;
            expReward = Math.floor(expReward * (1 + expBonus));
          }
          
          if (speedHourglass) {
            const hourglassType = speedHourglass.t1;
            const hourglassExpMultiplier = hourglassType === 4101 ? 3 : 2;
            const hourglassGoldMultiplier = hourglassType === 4101 ? 3 : 2;
            const hourglassBonus = speedHourglass.t2 || 0;
            
            expReward = Math.floor(expReward * hourglassExpMultiplier * (1 + hourglassBonus));
            goldReward = Math.floor(goldReward * hourglassGoldMultiplier);
          }
          
          addGold(goldReward);
          addExp(expReward);
          
          if (battle.isDropSuccess && battle.dropType !== -1 && battle.dropIndex !== -1) {
            const equipmentId = itemTypeAndIndexToEquipmentId(battle.dropType, battle.dropIndex);
            dropItem = getEquipmentById(equipmentId);
            if (dropItem) {
              addToInventory(equipmentId, 1);
            }
          }
          
          incrementWinBattle();
          updateHighCombo(comboCount);
          
          if ((battle.enemy as any).bossId !== undefined) {
            battlePointsChange = WinBossGetBattlePoint((battle.enemy as any).bossId);
          }
        } else if (!victory) {
          const damage = Math.floor(player.maxHp * 0.3);
          updatePlayerHp(-damage);
          incrementLoseBattle();
          battlePointsChange = -3;
        }
        
        if (speedHourglass) {
          const hourglassMultiplier = speedHourglass.t1 === 4101 ? 3 : 2;
          battlePointsChange = Math.floor(battlePointsChange * hourglassMultiplier);
        }
        
        const newBattlePoints = battlePoints + battlePointsChange;
        const newDefeatedBosses = victory && (battle.enemy as any).bossId !== undefined 
          ? [...defeatedBosses, (battle.enemy as any).bossId] 
          : defeatedBosses;
        
        if (newBattlePoints <= 0) {
          let newKyarakutaKozinExp = [...kyarakutaKozinExp];
          let newKyarakutalv = kyarakutalv;
          
          newKyarakutaKozinExp = addExpKyarakutaKozinExp(kyarakutaKozinExp, player.heroId, player.level);
          const currentKyaraLv = getCurrentKyaraLv(newKyarakutaKozinExp, player.heroId);
          if (newKyarakutalv > 0) {
            if (currentKyaraLv > newKyarakutalv) {
              newKyarakutalv = currentKyaraLv;
            }
          } else {
            newKyarakutalv = Math.max(currentKyaraLv, 1);
          }
          
          set({
            battlePoints: 0,
            defeatedBosses: newDefeatedBosses,
            currentScene: 'gameover',
            kyarakutalv: newKyarakutalv,
            kyarakutaKozinExp: newKyarakutaKozinExp,
            battle: {
              ...battle,
              status: 'idle',
              battleResult: {
                victory,
                goldReward,
                expReward,
                dropItem,
                battlePointsChange,
              },
            },
          });

          const saveData = loadSaveData();
          saveData.kyarakutalv = newKyarakutalv;
          saveData.kyarakutaKozinExp = newKyarakutaKozinExp;
          saveSaveData(saveData);
          return;
        }
        
        const { currentMap: map, hiddenMapBonusCount: bonusCount } = get();
        const isHiddenMap = map === 13 || map === 14 || map === 124;
        const newHiddenMapBonusCount = isHiddenMap ? bonusCount - 1 : bonusCount;
        
        set({
          battlePoints: newBattlePoints,
          defeatedBosses: newDefeatedBosses,
          hiddenMapBonusCount: newHiddenMapBonusCount,
          battle: {
            ...battle,
            status: 'idle',
            battleResult: {
              victory,
              goldReward,
              expReward,
              dropItem,
              battlePointsChange,
            },
          },
        });

        // 如果隐藏地图 bonus 次数耗尽，退出隐藏地图
        if (isHiddenMap && newHiddenMapBonusCount <= 0) {
          setTimeout(() => {
            const { exitHiddenMap } = get();
            exitHiddenMap();
          }, 100);
        }

        // 胜利后如果没有 bonus，40% 概率生成新 bonus
        if (victory) {
          const { bonus: currentBonus, hardmode, enterHiddenMap } = get();
          
          // 检查是否击败了特殊Boss，触发隐藏地图传送
          const enemy = battle.enemy as any;
          const bossId = enemy?.bossId;
          const spType = battle.specialBonusType;
          if (bossId && spType) {
            if (spType === 12 && bossId === 60) {
              const map13 = MAP_LIST.find(m => m.id === 13);
              if (map13 && player.level >= map13.unlockLevel) {
                enterHiddenMap(13, 12);
              }
            } else if (spType === 13 && bossId === 66) {
              const map14 = MAP_LIST.find(m => m.id === 14);
              if (map14 && player.level >= map14.unlockLevel) {
                enterHiddenMap(14, 13);
              }
            } else if (bossId === 103) {
              const map124 = MAP_LIST.find(m => m.id === 124);
              if (map124) {
                enterHiddenMap(124, spType);
              }
            }
          }
          
          if (!currentBonus.currentBonus && Math.random() < 0.4 && !isHiddenMap) {
            const newBonusType = getRandomBonusType(player.level * 100, hardmode);
            const bonusCount = Math.floor(Math.random() * 5) + 1; // 1-5 次
            console.log('[Bonus] Auto-generated after victory: type=', newBonusType, 'count=', bonusCount);
            set((s) => ({
              bonus: {
                ...s.bonus,
                currentBonus: {
                  bonusType: newBonusType,
                  remainingCount: bonusCount,
                },
              },
            }));
          }
        }
      },
      clearBattleResult: () => {
        set((state) => ({ battle: { ...state.battle, battleResult: null } }));
      },
      toggleBattle: () => {
        const { battle, startBattleLoop, stopBattleLoop } = get();
        
        if (battle.status === 'idle') {
          if (battle.battleResult) {
            return;
          }
          set({ battle: { ...battle, status: 'fighting' } });
          startBattleLoop();
        } else if (battle.status === 'fighting' && !battle._ending) {
          stopBattleLoop();
          set({ battle: { ...battle, status: 'paused' } });
        }
      },
      resumeBattle: () => {
        const { startBattleLoop, battle } = get();
        if (battle.battleResult) {
          return;
        }
        set((state) => ({ battle: { ...state.battle, status: 'fighting' } }));
        startBattleLoop();
      },
      pauseBattle: () => {
        const { stopBattleLoop } = get();
        stopBattleLoop();
        set((state) => ({ battle: { ...state.battle, status: 'paused' } }));
      },
      setRecoverNextTurn: (value) => {
        const { battle, player } = get();
        if (value && battle.recoverUsed) return;
        
        // 计算恢复费用 = maxHP * 0.2
        const recoveryCost = Math.floor(player.maxHp * 0.2);
        const currentGold = player.gold || 0;
        let recvCost = false;
        
        if (currentGold < recoveryCost) {
          // 不够费用但 >= 60% 时允许部分支付
          if (currentGold / recoveryCost >= 0.6) {
            recvCost = true;
          } else {
            return; // 不够60%无法恢复
          }
        }
        
        set((state) => ({ 
          battle: { 
            ...state.battle, 
            recoverNextTurn: value,
            recoverUsed: value ? true : state.battle.recoverUsed,
            _recvCost: recvCost,
          } 
        }));
        
        // 扣除恢复费用
        if (value) {
          const cost = recvCost ? currentGold : recoveryCost;
          const newGold = currentGold - cost;
          set({ player: { ...player, gold: Math.max(0, newGold) } });
        }
      },
      startBattleLoop: () => {
        const { battleInterval, battle } = get();
        if (battleInterval) return;
        if (battle.battleResult) {
          return;
        }
        
        // Restore loop state from persisted store (survives pause/resume)
        let mode = battle._loopMode;
        let eefi = battle._loopTick;
        let renzokukaisu = battle._loopComboCount;
        let whichTurn = battle._loopTurn;
        let isProcessing = false;
        let tdame = 0;
        let battleEnded = false;
        
        const interval = window.setInterval(() => {
          const state = get();
          const { battle, player, updatePlayerHp, endBattle, addBattleLog, updateHighDamage } = state;
          
          if (battle.status !== 'fighting' || !battle.enemy || battleEnded) {
            return;
          }
          
          if (mode === 3) {
            if (isProcessing) return;
            isProcessing = true;
            
            set((s) => ({
              battle: { ...s.battle, damageDisplay: null, isCrit: false, isCombo: false },
            }));
            
            if (whichTurn === 0) {
              if (battle.recoverNextTurn) {
                updatePlayerHp(player.maxHp);
                addBattleLog('全部恢复了');
                set((s) => ({
                  battle: { ...s.battle, recoverNextTurn: false },
                }));
                whichTurn = 1;
                isProcessing = false;
                return;
              }
              
              const totalAttack = player.attack;
              const hpPercent = player.hp / player.maxHp;
              const accessories = player.equippedAccessories || [];
              const critRate = calculateCritRate(hpPercent, accessories);
              
              let isCrit = Math.random() * 100 < critRate;
              
              const critRing = accessories.find(acc => acc && (acc.t1 === 310 || acc.t1 === 311 || acc.t1 === 312));
              if (critRing) {
                const guaranteedCritCount = critRing.t2 || 1;
                if (battle.turnCount < guaranteedCritCount) {
                  isCrit = true;
                }
              }
              
              const currentComboCount = renzokukaisu >= 1 ? renzokukaisu : 1;
              const { damage } = calculatePlayerDamage(
                totalAttack,
                battle.enemy.defense,
                isCrit,
                currentComboCount,
                accessories,
                player.level
              );
              
              tdame = damage;
              if (state.debugKill) {
                tdame = battle.enemy!.hp + 999999;
              }
              updateHighDamage(damage);
              
              let logMessage = `攻击 ${Math.floor(damage)}伤害！`;
              if (currentComboCount >= 2) {
                logMessage += ` ${currentComboCount} 连击！`;
              }
              if (isCrit) {
                logMessage += ' 暴击！';
              }
              addBattleLog(logMessage);
              
              let attackEffectIndex = 0;
              if (isCrit) {
                attackEffectIndex = Math.floor(Math.random() * 6) + 5;
              } else {
                attackEffectIndex = Math.floor(Math.random() * 4);
              }
              
              set((s) => ({
              battle: {
                ...s.battle,
                playerAnimation: 'attack',
                enemyAnimation: 'hurt',
                damageDisplay: damage,
                isCrit: isCrit,
                isCombo: currentComboCount >= 2,
                comboCount: currentComboCount,
                lastAttacker: 'player',
                activeEffect: { effectId: attackEffectIndex, position: 'enemy' },
              },
            }));
            
            eefi = 0;
            mode = 4;
            isProcessing = false;
            } else {
              const totalDefense = player.defense;
              const accessories = player.equippedAccessories || [];
              const enemyDamage = calculateEnemyDamage(
                battle.enemy.attack,
                totalDefense,
                accessories
              );
              tdame = enemyDamage;
              
              set((s) => ({
                battle: {
                  ...s.battle,
                  playerAnimation: 'idle',
                  enemyAnimation: 'attack',
                  damageDisplay: enemyDamage,
                  isCrit: false,
                  isCombo: false,
                  lastAttacker: 'enemy',
                  activeEffect: { effectId: 13, position: 'player' },
                },
              }));
              
              eefi = 0;
              mode = 4;
              isProcessing = false;
            }
          } else if (mode === 4) {
            eefi++;
            
            if (eefi >= 5) {
              if (whichTurn === 0) {
                const newEnemyHp = Math.max(0, battle.enemy.hp - tdame);
                const newHpRate = (newEnemyHp / battle.enemy.maxHp) * 100;
                
                set((s) => ({
                  battle: {
                    ...s.battle,
                    enemy: { ...s.battle.enemy!, hp: newEnemyHp },
                    hpRate: newHpRate,
                    playerAnimation: 'idle',
                    enemyAnimation: 'idle',
                  },
                }));
                
                const healAccessories = player.equippedAccessories?.filter(acc => 
                  acc && (acc.t1 === 1200 || acc.t1 === 1201 || acc.t1 === 1202 || acc.t1 === 1203)
                ) || [];
                if (healAccessories.length > 0) {
                  const maxHealRate = Math.max(...healAccessories.map(acc => acc.t2 || 0));
                  const healAmount = Math.floor(tdame * (maxHealRate / 100));
                  if (healAmount > 0) {
                    set((s) => ({
                      player: {
                        ...s.player,
                        hp: Math.min(s.player.hp + healAmount, s.player.maxHp),
                      },
                    }));
                    addBattleLog(`回复项链效果：回复 ${healAmount} HP！`);
                  }
                }
                
                if (newEnemyHp <= 0) {
                  addBattleLog('战斗胜利！');
                  battleEnded = true;
                  set((s) => ({ battle: { ...s.battle, _ending: true } }));
                  setTimeout(() => {
                    endBattle(true);
                  }, 500);
                  return;
                }
              } else {
                updatePlayerHp(-tdame);
                addBattleLog(`敌人攻击 受到${Math.floor(tdame)}伤害`);
                
                set((s) => ({
                  battle: {
                    ...s.battle,
                    playerAnimation: 'idle',
                    enemyAnimation: 'idle',
                  },
                }));
                
                const { player: newPlayer, battle: currentBattle } = get();
                if (newPlayer.hp <= 0) {
                  // battle.txt 复活逻辑：检查 resCount
                  if (currentBattle.resCount > 0) {
                    // 复活：增加属性，减少复活次数
                    const { resStatUP } = currentBattle;
                    const oldCount = currentBattle.resCount;
                    
                    set((s) => ({
                      player: {
                        ...s.player,
                        hp: Math.floor(s.player.maxHp * resStatUP),
                        maxHp: Math.floor(s.player.maxHp * resStatUP),
                        attack: Math.floor(s.player.attack * resStatUP),
                      },
                      battle: {
                        ...s.battle,
                        resCount: oldCount - 1,
                      },
                    }));
                    
                    addBattleLog(`不灭之力发动！复活 (剩余${oldCount - 1}次)`);
                    eefi = 0;
                    mode = 5;
                    isProcessing = false;
                    return;
                  }
                  
                  addBattleLog('战斗失败了');
                  battleEnded = true;
                  set((s) => ({ battle: { ...s.battle, _ending: true } }));
                  setTimeout(() => {
                    endBattle(false);
                  }, 500);
                  return;
                }
              }
              
              eefi = 0;
              mode = 5;
            }
          } else if (mode === 5) {
            eefi++;
            
            if (eefi >= 2) {
              if (whichTurn === 0) {
                const currentHpPercent = battle.enemy.hp / battle.enemy.maxHp;
                const accessories = player.equippedAccessories || [];
                const comboCheckRate = calculateComboRate(1 - currentHpPercent, accessories);
                const isCombo = Math.random() * 100 < comboCheckRate;
                
                if (isCombo) {
                  renzokukaisu++;
                  whichTurn = 0;
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      comboCount: renzokukaisu,
                      comboRate: comboCheckRate,
                      critRate: calculateCritRate(1 - currentHpPercent, accessories),
                    },
                  }));
                } else {
                  renzokukaisu = 1;
                  whichTurn = 1;
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      comboCount: 1,
                      turnCount: s.battle.turnCount + 1,
                      comboRate: comboCheckRate,
                      critRate: calculateCritRate(1 - currentHpPercent, accessories),
                    },
                  }));
                }
              } else {
                whichTurn = 0;
              }
              
              mode = 3;
            }
          }
          
          // Persist loop state so it survives pause/resume
          set((s) => ({
            battle: {
              ...s.battle,
              _loopTurn: whichTurn,
              _loopMode: mode,
              _loopTick: eefi,
              _loopComboCount: renzokukaisu,
            },
          }));
        }, 33);
        
        set({ battleInterval: interval });
      },
      stopBattleLoop: () => {
        const { battleInterval } = get();
        if (battleInterval) {
          clearInterval(battleInterval);
          set({ battleInterval: null });
        }
      },
      tryEscape: () => {
        const { battle, addBattleLog, resetEncounterRate, setCurrentScene } = get();
        
        if (battle.status !== 'paused' || !battle.enemy) return;
        
        addBattleLog('成功逃跑了！');
        resetEncounterRate();
        setCurrentScene('world');
        set({
          battle: {
            enemy: null,
            status: 'idle',
            battleLog: [],
            comboCount: 0,
            comboRate: 5,
            critRate: 5,
            hpRate: 100,
            dropRate: 0,
            dropItemName: '',
            turn: 'player',
            turnCount: 0,
            recoverNextTurn: false,
            recoverUsed: false,
            playerAnimation: 'idle',
            enemyAnimation: 'idle',
            dropType: -1,
            dropIndex: -1,
            isDropSuccess: false,
            goldMultiplier: 1,
            battleResult: null,
            _ending: false,
            damageDisplay: null,
            isCrit: false,
            isCombo: false,
            lastAttacker: null,
            _loopTurn: 0,
            _loopMode: 3,
            _loopTick: 0,
            _loopComboCount: 1,
            specialBonusType: null,
            activeEffect: null,
            resCount: 0,
            resStatUP: 1,
          },
        });
      },
      addBattleLog: (message) => {
        const { battle } = get();
        const newLogs = [...battle.battleLog, message];
        if (newLogs.length > 10) {
          newLogs.shift();
        }
        set({
          battle: { ...battle, battleLog: newLogs },
        });
      },
      updateCooldowns: () => {
        const { skills } = get();
        set({
          skills: skills.map(s => ({
            ...s,
            currentCooldown: Math.max(0, s.currentCooldown - 1),
          })),
        });
      },
      resetGame: () => {
        const currentPlayer = get().player;
        localStorage.removeItem(STORAGE_KEY);
        const collection = getCollection();
        const savedInventory = collection.length > 0 ? collection : initialInventory;
        const saveData = loadSaveData();
        
        const equippedWeapon = currentPlayer.equippedWeapon;
        const equippedArmor = currentPlayer.equippedArmor;
        const equippedAccessories = [...(currentPlayer.equippedAccessories || [])];
        const weaponSoul = currentPlayer.weaponSoul;
        const armorSoul = currentPlayer.armorSoul;
        
        // 重新计算带装备加成和存货加成的属性 - 使用 gdata.txt hwMode 公式
        const weaponQty = equippedWeapon ? (savedInventory.find((i: InventoryItem) => i.equipmentId === equippedWeapon.id)?.quantity || 1) : 1;
        const armorQty = equippedArmor ? (savedInventory.find((i: InventoryItem) => i.equipmentId === equippedArmor.id)?.quantity || 1) : 1;
        
        const stPtAlloc = initialPlayer.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        const levelBonus = getLevelBonus(initialPlayer.level);
        
        const baseResetHp = initialPlayer.maxHp + levelBonus.hp + stPtAlloc.hp * 5;
        const baseResetAtk = initialPlayer.attack + levelBonus.attack + stPtAlloc.atk * 3;
        const baseResetDef = initialPlayer.defense + levelBonus.defense + stPtAlloc.def * 3;
        const baseResetAgi = initialPlayer.agility + levelBonus.agility + stPtAlloc.agi * 2;
        const baseResetLuc = initialPlayer.luck + levelBonus.luck + stPtAlloc.luc * 1;
        
        const equipR = getEquipComponents(equippedWeapon, weaponQty, weaponSoul, equippedArmor, armorQty, armorSoul, baseResetHp);
        const bonusesR = applyEquipmentBonuses(equippedAccessories, savedInventory, get().hardmode || 0, get().kyarakutalv || 0, get().kyarakutaKozinExp || [], initialPlayer.heroId || 0);
        const heroBonusesR = computeHeroBonuses(initialPlayer.heroId || 0);
        const currentKyaraLvR = getCurrentKyaraLv(get().kyarakutaKozinExp, initialPlayer.heroId);
        const kyaraLvR = ((get().kyarakutalv + currentKyaraLvR) * 0.25 + 0.75);
        
        const statsR = computeFinalStats(baseResetHp, baseResetAtk, baseResetDef, baseResetAgi, baseResetLuc, equipR, bonusesR, heroBonusesR, kyaraLvR);
        
        // 处理 PlayerGems (t1=35) 固定加成
        const playerGems = equippedAccessories.filter(acc => acc && acc.t1 === 35);
        let gemBonusHp = 0, gemBonusAtk = 0, gemBonusDef = 0, gemBonusAgi = 0, gemBonusLuc = 0;
        for (const gem of playerGems) {
          const gemLevel = gem.y || 0;
          const _loc2_ = gemLevel + 1;
          
          let itemCount1 = 0;
          for (const item of savedInventory) {
            const eq = getEquipmentById(item.equipmentId);
            if (eq && (eq.type === 'accessory' || eq.type === 'weapon' || eq.type === 'armor')) {
              itemCount1 += item.quantity;
            }
          }
          
          let itemCount2 = 0;
          if (itemCount1 > 1000) {
            itemCount2 = itemCount1 - 1000;
            itemCount1 = 1000;
          }
          
          gemBonusHp += itemCount1 * _loc2_;
          gemBonusAtk += itemCount1 * _loc2_;
          gemBonusDef += itemCount1 * _loc2_;
          gemBonusAgi += itemCount1 * _loc2_;
          gemBonusLuc += itemCount2 * (_loc2_ * 4);
        }
        
        // 处理 Brave/War/FourGod Gems 固定加成
        const braveGems = equippedAccessories.filter(acc => acc && acc.t1 === 40);
        for (const gem of braveGems) {
          const _loc2_ = gem.t2 || 0;
          gemBonusHp += _loc2_; gemBonusAtk += _loc2_; gemBonusDef += _loc2_; gemBonusAgi += _loc2_; gemBonusLuc += _loc2_;
        }
        const warGems = equippedAccessories.filter(acc => acc && acc.t1 === 41);
        for (const gem of warGems) {
          const _loc2_ = gem.t2 || 0;
          gemBonusAtk += _loc2_; gemBonusDef += _loc2_; gemBonusAgi += _loc2_;
        }
        const fourGodGems = equippedAccessories.filter(acc => acc && acc.t1 === 42);
        for (const gem of fourGodGems) {
          const _loc2_ = gem.t2 || 0;
          gemBonusHp += _loc2_; gemBonusAtk += _loc2_; gemBonusDef += _loc2_; gemBonusAgi += _loc2_;
        }
        
        const newPlayer = {
          ...initialPlayer,
          maxHp: statsR.hp + gemBonusHp,
          attack: statsR.atk + gemBonusAtk,
          defense: statsR.def + gemBonusDef,
          agility: statsR.agi + gemBonusAgi,
          luck: statsR.luc + gemBonusLuc,
          equippedWeapon,
          equippedArmor,
          equippedAccessories,
          weaponSoul,
          armorSoul,
          maxAccessorySlots: currentPlayer.maxAccessorySlots || 3,
        };
        
        newPlayer.hp = newPlayer.maxHp;
        
        const { hardmode } = get();
        const resetBP = hardmode === 1 ? 15 : 30;
        
        set({
          player: newPlayer,
          inventory: savedInventory,
          skills: initialSkills,
          currentScene: 'title',
          encounterRate: 0,
          battlePoints: resetBP,
          maxBattlePoints: resetBP,
          defeatedBosses: [],
          bonus: {
            addUsesLeft: 5,
            clearUsesLeft: 5,
            currentBonus: null,
          },
          battle: {
            enemy: null,
            status: 'idle',
            battleLog: [],
            comboCount: 0,
            comboRate: 5,
            critRate: 5,
            hpRate: 100,
            dropRate: 0,
            dropItemName: '',
            turn: 'player',
            turnCount: 0,
            recoverNextTurn: false,
            recoverUsed: false,
            playerAnimation: 'idle',
            enemyAnimation: 'idle',
            dropType: -1,
            dropIndex: -1,
            isDropSuccess: false,
            goldMultiplier: 1,
            battleResult: null,
            _ending: false,
            damageDisplay: null,
            isCrit: false,
            isCombo: false,
            lastAttacker: null,
            _loopTurn: 0,
            _loopMode: 3,
            _loopTick: 0,
            _loopComboCount: 1,
            specialBonusType: null,
            activeEffect: null,
            resCount: 0,
            resStatUP: 1,
          },
          battleInterval: null,
          playTimes: saveData.playTimes,
          Highlv: saveData.Highlv,
          HighCombo: saveData.HighCombo,
          HighDamage: saveData.HighDamage,
          winbattle: saveData.winbattle,
          losebattle: saveData.losebattle,
          newgamecount: saveData.newgamecount,
          gameovercount: saveData.gameovercount,
          kyarakutalv: saveData.kyarakutalv,
          kyarakutaKozinExp: saveData.kyarakutaKozinExp || new Array(20).fill(0),
          hardmodeUnlock: saveData.hardmodeUnlock,
          hellmodeUnlock: saveData.hellmodeUnlock,
          playerid: saveData.playerid,
          DropRate: saveData.DropRate,
          speedNum: saveData.speedNum,
          dropNum: saveData.dropNum,
          presetNum: saveData.presetNum,
          presets: saveData.presets || INITIAL_PRESETS,
          autoAllocateEnabled: saveData.autoAllocateEnabled || false,
          currentMap: 1,
          debugKill: false,
        });
      },
      incrementWinBattle: () => {
        const { winbattle, Highlv, player, hardmodeUnlock, hellmodeUnlock } = get();
        const newWinbattle = winbattle + 1;
        const newHighlv = Math.max(Highlv, player.level);
        let newHardmodeUnlock = hardmodeUnlock;
        let newHellmodeUnlock = hellmodeUnlock;
        
        // 最高等级达到10万时解锁困难模式
        if (newHighlv >= 100000 && hardmodeUnlock !== 1) {
          newHardmodeUnlock = 1;
        }
        // 最高等级达到1000万时解锁地狱模式
        if (newHighlv >= 10000000 && hellmodeUnlock !== 1) {
          newHellmodeUnlock = 1;
        }
        
        const peakSnapshot = newHighlv > Highlv ? {
          level: newHighlv,
          hp: player.hp,
          maxHp: player.maxHp,
          attack: player.attack,
          defense: player.defense,
          agility: player.agility,
          luck: player.luck,
          equippedWeapon: player.equippedWeapon ? { id: player.equippedWeapon.id, name: player.equippedWeapon.name, x: player.equippedWeapon.x, y: player.equippedWeapon.y } : null,
          equippedArmor: player.equippedArmor ? { id: player.equippedArmor.id, name: player.equippedArmor.name, x: player.equippedArmor.x, y: player.equippedArmor.y } : null,
          equippedAccessories: (player.equippedAccessories || []).filter(Boolean).map(a => ({ id: a.id, name: a.name, x: a.x, y: a.y })),
        } : undefined;
        set({ winbattle: newWinbattle, Highlv: newHighlv, hardmodeUnlock: newHardmodeUnlock, hellmodeUnlock: newHellmodeUnlock, ...(peakSnapshot ? { peakSnapshot } : {}) });
        
        const data = loadSaveData();
        data.winbattle = newWinbattle;
        data.Highlv = newHighlv;
        data.hardmodeUnlock = newHardmodeUnlock;
        data.hellmodeUnlock = newHellmodeUnlock;
        saveSaveData(data);
      },
      incrementLoseBattle: () => {
        const { losebattle, gameovercount } = get();
        const newLosebattle = losebattle + 1;
        const newGameovercount = gameovercount + 1;
        set({ losebattle: newLosebattle, gameovercount: newGameovercount });
        
        const data = loadSaveData();
        data.losebattle = newLosebattle;
        data.gameovercount = newGameovercount;
        saveSaveData(data);
      },
      incrementNewGameCount: () => {
        const { newgamecount } = get();
        const newCount = newgamecount + 1;
        set({ newgamecount: newCount });
        
        const data = loadSaveData();
        data.newgamecount = newCount;
        saveSaveData(data);
      },
      updateHighCombo: (combo) => {
        const { HighCombo } = get();
        if (combo > HighCombo) {
          set({ HighCombo: combo });
          
          const data = loadSaveData();
          data.HighCombo = combo;
          saveSaveData(data);
        }
      },
      updateHighDamage: (damage) => {
        const { HighDamage } = get();
        if (damage > HighDamage) {
          set({ HighDamage: damage });
          
          const data = loadSaveData();
          data.HighDamage = damage;
          saveSaveData(data);
        }
      },
      updateHighLv: (level) => {
        const { Highlv, player, hardmodeUnlock, hellmodeUnlock } = get();
        if (level > Highlv) {
          const snapshot: PeakSnapshot = {
            level,
            hp: player.hp,
            maxHp: player.maxHp,
            attack: player.attack,
            defense: player.defense,
            agility: player.agility,
            luck: player.luck,
            equippedWeapon: player.equippedWeapon ? { id: player.equippedWeapon.id, name: player.equippedWeapon.name, x: player.equippedWeapon.x, y: player.equippedWeapon.y } : null,
            equippedArmor: player.equippedArmor ? { id: player.equippedArmor.id, name: player.equippedArmor.name, x: player.equippedArmor.x, y: player.equippedArmor.y } : null,
            equippedAccessories: (player.equippedAccessories || []).filter(Boolean).map(a => ({ id: a.id, name: a.name, x: a.x, y: a.y })),
          };
          
          let newHardmodeUnlock = hardmodeUnlock;
          let newHellmodeUnlock = hellmodeUnlock;
          if (level >= 100000 && hardmodeUnlock !== 1) {
            newHardmodeUnlock = 1;
          }
          if (level >= 10000000 && hellmodeUnlock !== 1) {
            newHellmodeUnlock = 1;
          }
          
          set({ Highlv: level, peakSnapshot: snapshot, hardmodeUnlock: newHardmodeUnlock, hellmodeUnlock: newHellmodeUnlock });
          
          const data = loadSaveData();
          data.Highlv = level;
          data.hardmodeUnlock = newHardmodeUnlock;
          data.hellmodeUnlock = newHellmodeUnlock;
          saveSaveData(data);
        }
      },
      exportSaveData: () => {
        const stateData = localStorage.getItem(STORAGE_KEY);
        const saveData = localStorage.getItem('inflation-rpg-savedata');
        const itemCountData = localStorage.getItem('inflation-rpg-itemcounts');
        const collectionData = localStorage.getItem('inflation-rpg-collection');
        
        if (!stateData) {
          throw new Error('没有可导出的存档');
        }
        
        const exportData = {
          stateData,
          saveData,
          itemCountData,
          collectionData,
        };
        
        return btoa(unescape(encodeURIComponent(JSON.stringify(exportData))));
      },
      importSaveData: (encodedData) => {
        const decoded = decodeURIComponent(escape(atob(encodedData)));
        const exportData = JSON.parse(decoded);
        
        if (!exportData.stateData) {
          throw new Error('无效的存档数据');
        }
        
        localStorage.setItem(STORAGE_KEY, exportData.stateData);
        if (exportData.saveData) {
          localStorage.setItem('inflation-rpg-savedata', exportData.saveData);
        }
        if (exportData.itemCountData) {
          localStorage.setItem('inflation-rpg-itemcounts', exportData.itemCountData);
        }
        if (exportData.collectionData) {
          localStorage.setItem('inflation-rpg-collection', exportData.collectionData);
        }
        
        window.location.reload();
      },
      // 奖励系统
      addMapBonus: () => {
        const { bonus, player, hardmode } = get();
        if (bonus.addUsesLeft <= 0) return;
        
        const bonusType = getRandomBonusType(player.level * 100, hardmode);
        const count = Math.floor(Math.random() * 3) + 1;
        
        set((s) => ({
          bonus: {
            ...s.bonus,
            addUsesLeft: s.bonus.addUsesLeft - 1,
            currentBonus: {
              bonusType,
              remainingCount: count,
            },
          },
        }));
      },
      setMapBonus: (bonusType: number, count: number = 5) => {
        if (bonusType < 0 || bonusType > 18) {
          console.warn(`Bonus 类型 ${bonusType} 无效，有效范围: 0-18`);
          return;
        }
        set((s) => ({
          bonus: {
            ...s.bonus,
            currentBonus: {
              bonusType,
              remainingCount: count,
            },
          },
        }));
      },
      clearMapBonus: () => {
        const { bonus } = get();
        if (bonus.clearUsesLeft <= 0) return;
        set((s) => ({
          bonus: {
            ...s.bonus,
            clearUsesLeft: s.bonus.clearUsesLeft - 1,
            currentBonus: null,
          },
        }));
      },
      getBonusInfo: () => {
        const { bonus } = get();
        if (!bonus.currentBonus) return null;
        return BONUS_LIST[bonus.currentBonus.bonusType] || null;
      },
      teleportToMap: (mapId) => {
        const map = MAP_LIST.find(m => m.id === mapId);
        if (!map) return;
        if (map.hidden) return;
        set({ currentMap: mapId, lastMapId: mapId });
      },
      enterHiddenMap: (mapId: number, bonusType: number) => {
        const { currentMap } = get();
        const bonusCount = Math.floor(Math.random() * 5) + 1;
        set({
          originalMap: currentMap,
          currentMap: mapId,
          hiddenMapBonusCount: bonusCount,
          bonus: {
            addUsesLeft: 5,
            clearUsesLeft: 5,
            currentBonus: {
              bonusType,
              remainingCount: bonusCount,
            },
          },
        });
        console.log(`[HiddenMap] Entered map ${mapId}, bonusType: ${bonusType}, bonusCount: ${bonusCount}, original map: ${currentMap}`);
      },
      playBattleEffect: (effectId, position) => {
        set({
          battle: {
            ...get().battle,
            activeEffect: { effectId, position },
          },
        });
      },
      clearBattleEffect: () => {
        set({
          battle: {
            ...get().battle,
            activeEffect: null,
          },
        });
      },
      exitHiddenMap: () => {
        const { originalMap } = get();
        set({
          currentMap: originalMap,
          hiddenMapBonusCount: 0,
          currentScene: 'world',
          encounterRate: 0,
        });
        console.log(`[HiddenMap] Exited, returned to map ${originalMap}`);
      },
      unlockAccessorySlot: (slotIndex?: number) => {
        const { player } = get();
        const currentSlots = player.maxAccessorySlots;
        if (currentSlots >= MAX_ACCESSORY_SLOTS) return false;
        
        const targetIndex = slotIndex !== undefined ? slotIndex : currentSlots;
        if (targetIndex < currentSlots) return false;
        if (targetIndex >= MAX_ACCESSORY_SLOTS) return false;
        
        const price = AKUSE_SLOT_LOCK_MONEY[targetIndex];
        if (player.gold < price) return false;
        
        set({
          player: {
            ...player,
            gold: player.gold - price,
            maxAccessorySlots: targetIndex + 1,
          },
        });
        return true;
      },
      checkZeroEquips: () => {
        const { player, inventory } = get();
        const equippedAccs = player.equippedAccessories || [];
        if (equippedAccs.length === 0) return;
        
        // 统计每个饰品 ID 在装备栏中出现的次数
        const equippedCountMap: Record<string, number> = {};
        equippedAccs.forEach(acc => {
          if (!acc) return;
          equippedCountMap[acc.id] = (equippedCountMap[acc.id] || 0) + 1;
        });
        
        // 检查是否有装备数量超过库存的饰品
        let needClean = false;
        for (const [accId, equippedCount] of Object.entries(equippedCountMap)) {
          const invItem = inventory.find(i => i.equipmentId === accId);
          const invQty = invItem?.quantity || 0;
          if (equippedCount > invQty) {
            needClean = true;
            break;
          }
        }
        
        if (!needClean) return;
        
        // 清理：对每个超出库存的饰品，只保留库存数量的装备
        const remainingCount: Record<string, number> = {};
        const newAccessories = equippedAccs.filter(acc => {
          if (!acc) return false;
          const maxAllowed = inventory.find(i => i.equipmentId === acc.id)?.quantity || 0;
          const current = remainingCount[acc.id] || 0;
          if (current < maxAllowed) {
            remainingCount[acc.id] = current + 1;
            return true;
          }
          return false;
        });
        
        set({
          player: {
            ...player,
            equippedAccessories: newAccessories,
          },
        });
      },
      allocateStPt: (statType, amount) => {
        const { player } = get();
        const currentStPt = player.stPt || 0;
        console.log('[allocateStPt] Start - statType:', statType, 'amount:', amount, 'currentStPt:', currentStPt, 'player before:', { maxHp: player.maxHp, attack: player.attack, defense: player.defense, agility: player.agility, luck: player.luck });
        if (amount > currentStPt) {
          console.log('[allocateStPt] Not enough stPt, return');
          return;
        }
        
        let newPlayer = { ...player };
        newPlayer.stPt = currentStPt - amount;
        
        switch (statType) {
          case 'hp':
            newPlayer.maxHp += amount * 5;
            newPlayer.hp += amount * 5;
            break;
          case 'atk':
            newPlayer.attack += amount * 3;
            break;
          case 'def':
            newPlayer.defense += amount * 3;
            break;
          case 'agi':
            newPlayer.agility += amount * 2;
            break;
          case 'luc':
            newPlayer.luck += amount * 1;
            break;
        }
        
        newPlayer.stPtAllocate = { ...newPlayer.stPtAllocate };
        newPlayer.stPtAllocate[statType] += amount;
        
        console.log('[allocateStPt] End - player after:', { maxHp: newPlayer.maxHp, attack: newPlayer.attack, defense: newPlayer.defense, agility: newPlayer.agility, luck: newPlayer.luck, stPt: newPlayer.stPt });
        set({ player: newPlayer });
      },
      addStPt: (amount) => {
        const { player } = get();
        const newStPt = (player.stPt || 0) + amount;
        set({ player: { ...player, stPt: newStPt } });
      },
    };
  },
  {
      name: STORAGE_KEY,
      version: 3,
      migrate: (persistedState, _version) => {
        const state = persistedState as any;
        
        // Fix missing currentMap
        if (typeof state.currentMap !== 'number') {
          state.currentMap = 1;
        }
        
        // Fix player gold if it's NaN
        if (state.player) {
          if (typeof state.player.gold !== 'number' || Number.isNaN(state.player.gold)) {
            state.player.gold = 0;
          }
          if (typeof state.player.hp !== 'number' || Number.isNaN(state.player.hp)) {
            state.player.hp = state.player.maxHp || 1000;
          }
          if (typeof state.player.maxHp !== 'number' || Number.isNaN(state.player.maxHp)) {
            state.player.maxHp = 1000;
          }
          if (typeof state.player.attack !== 'number' || Number.isNaN(state.player.attack)) {
            state.player.attack = 1000;
          }
          if (typeof state.player.defense !== 'number' || Number.isNaN(state.player.defense)) {
            state.player.defense = 1000;
          }
          if (typeof state.player.agility !== 'number' || Number.isNaN(state.player.agility)) {
            state.player.agility = 1000;
          }
          if (typeof state.player.luck !== 'number' || Number.isNaN(state.player.luck)) {
            state.player.luck = 1000;
          }
          
          // Fix maxAccessorySlots
          if (typeof state.player.maxAccessorySlots !== 'number' || state.player.maxAccessorySlots < 1) {
            state.player.maxAccessorySlots = 1;
          }
          
          // Fix stPt
          if (typeof state.player.stPt !== 'number' || Number.isNaN(state.player.stPt)) {
            state.player.stPt = 0;
          }

          // Fix heroId
          if (typeof state.player.heroId !== 'number') {
            state.player.heroId = 0;
          }

          // Fix equipment
          if (state.player.equippedWeapon) {
            const weapon = getEquipmentById(state.player.equippedWeapon.id);
            if (weapon) {
              state.player.equippedWeapon = weapon;
            }
          }
          if (state.player.equippedArmor) {
            const armor = getEquipmentById(state.player.equippedArmor.id);
            if (armor) {
              state.player.equippedArmor = armor;
            }
          }
          if (state.player.equippedAccessories && Array.isArray(state.player.equippedAccessories)) {
            state.player.equippedAccessories = state.player.equippedAccessories
              .map((acc: any) => {
                const found = getEquipmentById(acc?.id);
                return found || acc;
              })
              .filter((acc: any) => getEquipmentById(acc?.id));
          }
          
          // Recalculate player stats with equipment bonuses and stock bonus
          console.log('[merge] Before recalculation - player stats:', { maxHp: state.player.maxHp, attack: state.player.attack, defense: state.player.defense, agility: state.player.agility, luck: state.player.luck });
          const weapon = state.player.equippedWeapon;
          const armor = state.player.equippedArmor;
          const accessories = (state.player.equippedAccessories || []) as Equipment[];
          const inventory = (state.inventory || []) as InventoryItem[];
          
          const weaponQty = weapon ? (inventory.find((i: InventoryItem) => i.equipmentId === weapon.id)?.quantity || 1) : 1;
          
          const armorQty = armor ? (inventory.find((i: InventoryItem) => i.equipmentId === armor.id)?.quantity || 1) : 1;
          
          const lvlBonus = getLevelBonus(state.player.level || 1);
          const stPtAllocM = state.player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
          
          const baseMergeHp = initialPlayer.maxHp + lvlBonus.hp + stPtAllocM.hp * 5;
          const baseMergeAtk = initialPlayer.attack + lvlBonus.attack + stPtAllocM.atk * 3;
          const baseMergeDef = initialPlayer.defense + lvlBonus.defense + stPtAllocM.def * 3;
          const baseMergeAgi = initialPlayer.agility + lvlBonus.agility + stPtAllocM.agi * 2;
          const baseMergeLuc = initialPlayer.luck + lvlBonus.luck + stPtAllocM.luc * 1;
          
          const equipM = getEquipComponents(weapon, weaponQty, state.player.weaponSoul, armor, armorQty, state.player.armorSoul, baseMergeHp);
          const globalState = useGameStore.getState();
          const bonusesM = applyEquipmentBonuses(accessories, inventory, globalState.hardmode || 0, globalState.kyarakutalv || 0, globalState.kyarakutaKozinExp || [], state.player.heroId || 0);
          const heroBonusesM = computeHeroBonuses(state.player.heroId || 0);
          const currentKyaraLvM = getCurrentKyaraLv(globalState.kyarakutaKozinExp, state.player.heroId);
          const kyaraLvM = ((globalState.kyarakutalv + currentKyaraLvM) * 0.25 + 0.75);
          
          const statsM = computeFinalStats(baseMergeHp, baseMergeAtk, baseMergeDef, baseMergeAgi, baseMergeLuc, equipM, bonusesM, heroBonusesM, kyaraLvM);
          
          // Gem 固定加成
          let gemHp = 0, gemAtk = 0, gemDef = 0, gemAgi = 0, gemLuc = 0;
          const braveGems = accessories.filter((acc: Equipment) => (acc as any).t1 === 40);
          for (const gem of braveGems) {
            const _loc2_ = (gem as any).t2 || 0;
            gemHp += _loc2_; gemAtk += _loc2_; gemDef += _loc2_; gemAgi += _loc2_; gemLuc += _loc2_;
          }
          const warGems = accessories.filter((acc: Equipment) => (acc as any).t1 === 41);
          for (const gem of warGems) {
            const _loc2_ = (gem as any).t2 || 0;
            gemAtk += _loc2_; gemDef += _loc2_; gemAgi += _loc2_;
          }
          const fourGodGems = accessories.filter((acc: Equipment) => (acc as any).t1 === 42);
          for (const gem of fourGodGems) {
            const _loc2_ = (gem as any).t2 || 0;
            gemHp += _loc2_; gemAtk += _loc2_; gemDef += _loc2_; gemAgi += _loc2_;
          }
          
          state.player.attack = statsM.atk + gemAtk;
          state.player.defense = statsM.def + gemDef;
          state.player.maxHp = statsM.hp + gemHp;
          state.player.agility = statsM.agi + gemAgi;
          state.player.luck = statsM.luc + gemLuc;
          
          console.log('[merge] After recalculation - player stats:', { maxHp: state.player.maxHp, attack: state.player.attack, defense: state.player.defense, agility: state.player.agility, luck: state.player.luck });
        }
        
        return persistedState;
      },
      partialize: (state) => ({
        player: state.player,
        inventory: state.inventory,
        skills: state.skills,
        encounterRate: state.encounterRate,
        bonus: state.bonus,
        battlePoints: state.battlePoints,
        maxBattlePoints: state.maxBattlePoints,
        hardmode: state.hardmode,
        defeatedBosses: state.defeatedBosses,
        presets: state.presets,
        presetNum: state.presetNum,
        autoAllocateEnabled: state.autoAllocateEnabled,
        kyarakutalv: state.kyarakutalv,
        kyarakutaKozinExp: state.kyarakutaKozinExp,
        purchaseCounts: state.purchaseCounts,
        peakSnapshot: state.peakSnapshot,
        currentEquipSetSlotIndex: state.currentEquipSetSlotIndex,
      }),
    }
  )
);