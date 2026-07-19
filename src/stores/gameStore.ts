import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player as PlayerState, InventoryItem, Skill, GameScene, BattleState, Equipment, EquipSet, Enemy } from '@/types';
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
import { EqStUpdate } from '@/utils/gdata';
import { bgmManager } from '@/utils/bgmManager';

interface GameStore {
  player: PlayerState;
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
  /** 上次关闭背包时显示的页面（用于重新打开时恢复） */
  lastInventoryViewMode: 'main' | 'weapon' | 'armor' | 'accessory' | 'soul' | 'material';
  /** 设置上次背包页面 */
  setLastInventoryViewMode: (mode: 'main' | 'weapon' | 'armor' | 'accessory' | 'soul' | 'material') => void;
  setPlayer: (player: PlayerState) => void;
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
  /** 记录装备效果详细计算信息（用于调试） */
  logEquipmentBonuses: () => void;
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

const fixStoredPlayerEquipment = (player: PlayerState | undefined): { fixedPlayer: PlayerState; unequippedAccessories: Equipment[] } => {
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
  if (!fixedPlayer.unlockedAccessorySlots || !Array.isArray(fixedPlayer.unlockedAccessorySlots)) {
    const slots = [true, true, true, false, false, false, false, false, false, false, false, false];
    for (let i = 0; i < fixedPlayer.maxAccessorySlots && i < 12; i++) {
      slots[i] = true;
    }
    fixedPlayer.unlockedAccessorySlots = slots;
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

const calculateCritRate = (baseRate: number, playerHpPercent: number, bossType: number = -1): number => {
  let rate = baseRate;
  // 原始 battle.txt: barMana.tmyhpbar <= 0.25 时，<= 0.5 恒为 true，固定 +0.05
  if (playerHpPercent <= 0.25) {
    rate += 0.05;
    if (rate >= 0.7) {
      rate = 0.7;
    }
  }
  // Boss 76: 连击率和暴击率都削减 30%
  if (bossType === 76) {
    rate *= 0.7;
  }
  return Math.floor(rate * 100) / 100 * 100;
};

const calculateComboRate = (baseRate: number, playerHpPercent: number, bossType: number = -1): number => {
  let rate = baseRate;
  // 原始 battle.txt: barMana.tmyhpbar <= 0.25 时，<= 0.5 恒为 true，固定 +0.13
  if (playerHpPercent <= 0.25) {
    rate += 0.13;
    if (rate >= 0.8) {
      rate = 0.8;
    }
  }
  // Boss 76: 连击率削减 30%
  if (bossType === 76) {
    rate *= 0.7;
  }
  return Math.floor(rate * 100) / 100 * 100;
};

const calculatePlayerDamage = (
  playerAttack: number,
  enemyDefense: number,
  isCrit: boolean,
  comboCount: number,
  accessories: Equipment[],
  playerLevel: number,
  attackCount: number = 0,
  renzoDamageUP: number = 0
): { damage: number; isCrit: boolean } => {
  let damage: number;
  
  const critPowerRing = accessories.find(acc => acc && acc.t1 === 210);
  const skyPower = accessories.find(acc => acc && acc.t1 === 4002);
  const powerStone = accessories.find(acc => acc && acc.t1 === 2222);
  const demonSoul = accessories.find(acc => acc && acc.t1 === 5);
  const curseCoin = accessories.find(acc => acc && acc.t1 === 78);
  const shiningHourglass1 = accessories.find(acc => acc && acc.t1 === 2778);

  // 闪光沙漏1: 每次攻击 ATK +2%, 上限 +50% (gdata.txt hourglassUpdate(hourgclassOn1, hitCount1, 0.5, 0.02))
  let effectiveAttack = playerAttack;
  if (shiningHourglass1) {
    const atkMultiplier = 1 + Math.min(attackCount * 0.02, 0.5);
    effectiveAttack = playerAttack * atkMultiplier;
  }

  if (isCrit) {
    const critBonus = Math.random() * 1.2;
    let critMultiplier = 1.75 + critBonus / 5;
    if (critPowerRing) {
      critMultiplier += 0.3;
    }
    damage = (effectiveAttack + 1) * critMultiplier + 4;
  } else {
    damage = effectiveAttack;
  }
  
  if (powerStone) {
    damage *= (1 + (powerStone.t2 || 20) / 100);
  }
  
  if (demonSoul && (attackCount + 1) % 5 === 0) {
    damage *= 2;
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
    if (renzoDamageUP > 0) {
      comboMultiplier *= renzoDamageUP;
    }
    damage = Math.floor(damage * comboMultiplier);
  }
  
  if (skyPower) {
    damage += playerLevel * (skyPower.t2 || 50);
  }
  
  if (curseCoin) {
    damage *= 1.4;
  }
  
  return { damage: Math.floor(damage), isCrit };
};

const calculateEnemyDamage = (enemyAttack: number, playerDefense: number, accessories: Equipment[], hitCount: number = 0): number => {
  // 闪光沙漏 (t1=2777): 每次受到攻击 DEF +3%, 上限 +100%
  const shiningHourglass = accessories.find(acc => acc && acc.t1 === 2777);
  let effectiveDefense = playerDefense;
  if (shiningHourglass) {
    const defMultiplier = 1 + Math.min(hitCount * 0.03, 1);
    effectiveDefense = playerDefense * defMultiplier;
  }

  let damage = (enemyAttack * 2 + (enemyAttack - effectiveDefense * 0.5) * 12) / 14;

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

type PatternResult = {
  skillUsed: boolean;
  damage: number;
  skillName: string;
  effectType: string;
  requiresDoubleAttack: boolean;
  requiresSecondAttack: boolean;
} | null;

interface PatternSideEffects {
  updateEnemy?: Partial<Enemy>;
  updateBattle?: Partial<BattleState>;
  battleLog?: string;
}

const enePattern = (
  enemyNum: number,
  whichTurn: number,
  battle: BattleState,
  player: PlayerState,
  hardmode: number
): { result: PatternResult; effects?: PatternSideEffects } => {
  if (whichTurn === 0) {
    if (enemyNum === 70 || enemyNum === 74) {
      return suzakuPattern(enemyNum, battle);
    }
    if (enemyNum === 76) {
      return kouryuuPattern(battle, player);
    }
  }
  
  if (enemyNum === 100 || enemyNum === 101 || enemyNum === 102) {
    return twilightPattern(enemyNum, whichTurn, battle, player);
  }
  
  if (whichTurn === 1) {
    if (enemyNum === 71 || enemyNum === 75 || enemyNum === 87) {
      if (battle.eneDouble < 27) {
        return {
          result: {
            skillUsed: true,
            damage: 0,
            skillName: '玄武の力',
            effectType: 'double_attack',
            requiresDoubleAttack: true,
            requiresSecondAttack: false,
          },
          effects: {
            updateBattle: { eneDouble: battle.eneDouble + 1 },
          },
        };
      }
    }
    if (enemyNum === 98 || enemyNum === 99) {
      if (battle.eneSkill < 20) {
        return { result: angelPattern(player) };
      }
    }
    if (enemyNum === 72 || enemyNum === 86 || enemyNum === 87) {
      if (battle.eneSkill < 12) {
        return { result: seiryuuPattern(enemyNum, player.hp, hardmode) };
      }
    }
  }
  
  if (enemyNum === 73 || enemyNum === 87) {
    return byakkoPattern(battle);
  }
  
  return { result: null };
};

const suzakuPattern = (enemyNum: number, battle: BattleState): { result: PatternResult; effects?: PatternSideEffects } => {
  if (battle.patternCount === 0) {
    let effects: PatternSideEffects | undefined;
    if (enemyNum === 70) {
      effects = { updateBattle: { eneHP2: 6000000000, eneHPM2: 6000000000, eneATK2: 0 } };
    } else if (enemyNum === 74) {
      effects = { updateBattle: { eneHP2: 10000000000, eneHPM2: 10000000000, eneATK2: 200000000 } };
    }
    return {
      result: {
        skillUsed: true,
        damage: 0,
        skillName: '朱雀の力',
        effectType: 'passive',
        requiresDoubleAttack: false,
        requiresSecondAttack: false,
      },
      effects,
    };
  }
  
  if (battle.eneHP2 > 0 && (battle.enemy?.hp === 0 || battle.suzakuTurnCount >= 1)) {
    const newTurnCount = battle.suzakuTurnCount + 1;
    let effects: PatternSideEffects | undefined;
    
    if (newTurnCount === 1) {
      effects = {
        updateBattle: {
          patternCount: battle.patternCount + 1,
          teneATK: (0.05 * (battle.patternCount + 1) + 1) * (battle.enemy?.attack || 1),
        },
      };
    }
    
    if (newTurnCount <= 3) {
      const update: PatternSideEffects = {
        updateBattle: {
          suzakuTurnCount: newTurnCount,
        },
        updateEnemy: {
          hp: battle.eneHP2,
          attack: battle.eneATK2,
        },
      };
      if (newTurnCount === 1) {
        update.battleLog = '朱雀の力が弱体化された';
      }
      if (effects) {
        update.updateBattle = { ...effects.updateBattle, ...update.updateBattle };
      }
      effects = update;
    } else {
      effects = {
        updateBattle: { suzakuTurnCount: 0 },
        updateEnemy: { hp: battle.eneHPM2, attack: battle.teneATK },
        battleLog: '朱雀が力を取り戻した',
      };
    }
    
    return {
      result: {
        skillUsed: true,
        damage: 0,
        skillName: '朱雀の力',
        effectType: 'passive',
        requiresDoubleAttack: false,
        requiresSecondAttack: false,
      },
      effects,
    };
  }
  
  return { result: null };
};

const kouryuuPattern = (battle: BattleState, player: PlayerState): { result: PatternResult; effects?: PatternSideEffects } => {
  const damage = Math.floor(player.maxHp * 0.15);
  const requiresSecondAttack = Math.random() * 100 <= 20 && battle.patternCount >= 0;
  
  return {
    result: {
      skillUsed: true,
      damage: damage,
      skillName: '雷の力',
      effectType: 'damage',
      requiresDoubleAttack: false,
      requiresSecondAttack: requiresSecondAttack,
    },
    effects: { updateBattle: { eneCounter: 20 } },
  };
};

const twilightPattern = (enemyNum: number, whichTurn: number, battle: BattleState, player: PlayerState): { result: PatternResult; effects?: PatternSideEffects } => {
  let damage = Math.floor(player.maxHp * 0.1);
  
  if (whichTurn === 0 && enemyNum === 100) {
    if ((battle.enemy?.hp || 0) / (battle.enemy?.maxHp || 1) <= 0.4 && Math.random() <= 0.35) {
      const healAmount = battle.enemy ? Math.floor(battle.enemy.maxHp * 0.2) : 0;
      return {
        result: {
          skillUsed: true,
          damage: 0,
          skillName: '永遠の暗闇',
          effectType: 'heal',
          requiresDoubleAttack: false,
          requiresSecondAttack: false,
        },
        effects: {
          updateEnemy: { hp: Math.min(battle.enemy?.maxHp || 0, (battle.enemy?.hp || 0) + healAmount) },
          battleLog: 'EneSkill: Recovery 20% Max HP!',
        },
      };
    }
  }
  
  if (whichTurn === 1 && enemyNum === 101) {
    const healAmount = Math.floor(damage * 0.1 + 1);
    return {
      result: {
        skillUsed: true,
        damage: 0,
        skillName: '永遠の暗闇',
        effectType: 'heal',
        requiresDoubleAttack: false,
        requiresSecondAttack: false,
      },
      effects: {
        updateEnemy: { hp: Math.min(battle.enemy?.maxHp || 0, (battle.enemy?.hp || 0) + healAmount) },
      },
    };
  }
  
  if (enemyNum === 102) {
    damage = Math.floor(player.maxHp * 0.08);
    return {
      result: {
        skillUsed: true,
        damage: damage,
        skillName: '永遠の暗闇',
        effectType: 'damage',
        requiresDoubleAttack: false,
        requiresSecondAttack: false,
      },
    };
  }
  
  return { result: null };
};

const angelPattern = (player: PlayerState): PatternResult => {
  const damage = Math.floor(player.hp * 0.3);
  
  return {
    skillUsed: true,
    damage: damage,
    skillName: '天使の祝福',
    effectType: 'damage',
    requiresDoubleAttack: false,
    requiresSecondAttack: false,
  };
};

const seiryuuPattern = (enemyNum: number, playerHp: number, hardmode: number): PatternResult => {
  if (playerHp < 1) {
    return null;
  }
  
  let damage = 150000000;
  if (hardmode === 1) {
    damage += 700000000;
  }
  if (enemyNum === 86) {
    damage += 1600000000;
  }
  
  return {
    skillUsed: true,
    damage: damage,
    skillName: '感電されて力が抜けた',
    effectType: 'damage',
    requiresDoubleAttack: false,
    requiresSecondAttack: false,
  };
};

const byakkoPattern = (battle: BattleState): { result: PatternResult; effects?: PatternSideEffects } => {
  if (!battle.enemy) {
    return { result: null };
  }
  
  const damageReduced = battle.enemy.hp / battle.enemy.maxHp;
  
  if (damageReduced < 0.4) {
    return {
      result: {
        skillUsed: true,
        damage: 0,
        skillName: '白虎の力',
        effectType: 'passive',
        requiresDoubleAttack: false,
        requiresSecondAttack: false,
      },
      effects: {
        updateBattle: { eneDamageReduced: 0.4 },
        updateEnemy: { attack: Math.floor(battle.enemy.attack * 1.004) },
      },
    };
  }
  
  return { result: null };
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
          comboDisplayKey: 0,
          comboRate: 5,
          critRate: 5,
          baseComboRate: 0.05,
          baseCritRate: 0.05,
            missrate: 0,
            isMiss: false,
            missPosition: null,
          bossType: -1,
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
          expMultiplier: 1,
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
          attackCount: 0,
          hitCount: 0,
        specialBonusType: null,
        activeEffect: null,
        resCount: 0,
        resStatUP: 1,
        fireSecretKeyOn: false,
        secretKeyOn: false,
        sandHourglassOn: false,
        healOnAttackOn: false,
        warGodBladeOn: false,
        reflection: 0,
        refHealOn: false,
        hourgclassOn: false,
        hourgclassOn1: false,
        missrateOn: 0,
        _missTurnCount: 0,
        renzoDamageUP: 0,
        isDoubleAttack: false,
        eneHP2: 0,
        eneHPM2: 0,
        eneATK2: 0,
        teneATK: 0,
        patternCount: 0,
        suzakuTurnCount: 0,
        eneDouble: 0,
        eneSkill: 0,
        eneDamageReduced: 1,
        eneCounter: 0,
        },
      battleInterval: null,
      battlePoints: storedData?.battlePoints || (saveData.hardmode === 2 ? 10 : (saveData.hardmode === 1 ? 15 : 30)),
      maxBattlePoints: saveData.hardmode === 2 ? 10 : (saveData.hardmode === 1 ? 15 : 30),
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
      lastInventoryViewMode: storedData?.lastInventoryViewMode || 'main',
      setLastInventoryViewMode: (mode) => set({ lastInventoryViewMode: mode }),
      setPlayer: (player) => set({ player }),
      updatePlayerHp: (amount) => {
        const { player, battle } = get();
        const newHp = clamp(player.hp + amount, 0, player.maxHp);
        const hpPercent = newHp / player.maxHp;
        const newCritRate = calculateCritRate(battle.baseCritRate, hpPercent, battle.bossType);
        const newComboRate = calculateComboRate(battle.baseComboRate, hpPercent, battle.bossType);
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
        
        if (lvupsitanum > 0) {
          bgmManager.lvupstart();
        }
        
        // 计算最终属性加成（包含装备和存货加成）
        
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
        
        // 基础属性 = 初始值 + 属性点加成 (gdata.txt中hp/atk/def/speed/luk不包含等级加成)
        let baseHp = initialPlayer.maxHp + hpStPtBonus;
        let baseAtk = initialPlayer.attack + atkStPtBonus;
        let baseDef = initialPlayer.defense + defStPtBonus;
        let baseAgi = initialPlayer.agility + agiStPtBonus;
        let baseLuc = initialPlayer.luck + lucStPtBonus;
        
        updateHighLv(newLevel);
        
        const { hardmode, kyarakutalv, kyarakutaKozinExp } = get();
        const heroBonuses = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLv = getCurrentKyaraLv(kyarakutaKozinExp, player.heroId);
        const bonuses = EqStUpdate(accessories, inventory, hardmode || 0, player.gold, player.level, baseHp, baseAtk, baseDef, baseAgi, baseLuc, weaponObj, armorObj, heroBonuses, kyarakutalv, currentKyaraLv);
        
        // 根据 gdata.txt 中的 lvupFunc()，每级属性点 = 4 + GetPlusStPt
        const stPtPerLevel = 4 + bonuses.GetPlusStPt;
        const stPtIncrease = lvupsitanum * stPtPerLevel;
        
        // 武器/防具贡献分量（EqStUpdate已包含武器/护甲属性，此处用于兼容性保留）
        const equip = getEquipComponents(weaponObj, weaponQty, player.weaponSoul, armorObj, armorQty, player.armorSoul, baseHp);
        
        // gdata.txt 公式: 最终属性 = base + ehp/eatk/edef/espeed/eluk (已在EqStUpdate中计算)
        const stats = computeFinalStats(baseHp, baseAtk, baseDef, baseAgi, baseLuc, equip, bonuses, heroBonuses, 0);
        const finalHp = stats.hp;
        let finalAtk = stats.atk;
        const finalDef = stats.def;
        const finalAgi = stats.agi;
        const finalLuc = stats.luc;
        
        if (bonuses.warGodBladeOn && player.killCount >= 100000) {
          finalAtk = Math.floor(finalAtk * 1.1);
        }
        
        const { autoAllocateEnabled, autoAllocateStPt } = get();
        
        let finalStPt = (player.stPt || 0) + stPtIncrease;
        
        if (autoAllocateEnabled && stPtIncrease > 0) {
          // 先写入临时 stPt，供 autoAllocateStPt 消费
          set({ player: { ...player, stPt: finalStPt } });
          autoAllocateStPt();
          
          // autoAllocateStPt 更新了 stPtAllocate，重新获取
          const updatedPlayer = get().player;
          const newAlloc = updatedPlayer.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
          
          // 用新的 stPtAllocate 重新计算基础属性（所有装备效果都在 EqStUpdate 中处理）
          let recalcBaseHp = initialPlayer.maxHp + newAlloc.hp * 5;
          let recalcBaseAtk = initialPlayer.attack + newAlloc.atk * 3;
          let recalcBaseDef = initialPlayer.defense + newAlloc.def * 3;
          let recalcBaseAgi = initialPlayer.agility + newAlloc.agi * 2;
          let recalcBaseLuc = initialPlayer.luck + newAlloc.luc * 1;
          
          // 重新计算 bonuses（用 updatedPlayer.gold）
          const recalcBonuses = EqStUpdate(accessories, inventory, hardmode || 0, updatedPlayer.gold, updatedPlayer.level, recalcBaseHp, recalcBaseAtk, recalcBaseDef, recalcBaseAgi, recalcBaseLuc, weaponObj, armorObj, heroBonuses, kyarakutalv, currentKyaraLv);
          
          // 重新计算装备分量（EqStUpdate已包含武器/护甲属性，此处用于兼容性保留）
          const recalcEquip = getEquipComponents(weaponObj, weaponQty, updatedPlayer.weaponSoul, armorObj, armorQty, updatedPlayer.armorSoul, recalcBaseHp);
          
          // 重新计算最终属性
          const recalcStats = computeFinalStats(recalcBaseHp, recalcBaseAtk, recalcBaseDef, recalcBaseAgi, recalcBaseLuc, recalcEquip, recalcBonuses, heroBonuses, 0);
          let recalcFinalAtk = recalcStats.atk;
          if (recalcBonuses.warGodBladeOn && updatedPlayer.killCount >= 100000) {
            recalcFinalAtk = Math.floor(recalcFinalAtk * 1.1);
          }
          
          set({
            player: {
              ...updatedPlayer,
              level: newLevel,
              maxHp: recalcStats.hp,
              hp: recalcStats.hp,
              attack: recalcFinalAtk,
              defense: recalcStats.def,
              agility: recalcStats.agi,
              luck: recalcStats.luc,
              maxMana: initialPlayer.maxMana + (newLevel - 1) * 10,
              mana: initialPlayer.maxMana + (newLevel - 1) * 10,
              exp: getExpNokori,
              expToNextLevel: expToNext,
              lvC2: newLvC2,
            },
          });
          
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
            maxMana: initialPlayer.maxMana + (newLevel - 1) * 10,
            mana: initialPlayer.maxMana + (newLevel - 1) * 10,
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
        let baseHp_calc = initialPlayer.maxHp + stPtAllocate.hp * 5;
        let baseAtk_calc = initialPlayer.attack + stPtAllocate.atk * 3;
        let baseDef_calc = initialPlayer.defense + stPtAllocate.def * 3;
        let baseAgi_calc = initialPlayer.agility + stPtAllocate.agi * 2;
        let baseLuc_calc = initialPlayer.luck + stPtAllocate.luc * 1;
        
        // 所有装备效果（包括勇敢证明、能力宝石、Brave/War/FourGod Gems等）都在 EqStUpdate 中处理
        
        // 饰品加成
        const { kyarakutalv, kyarakutaKozinExp } = get();
        const heroBonuses1 = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLv1 = getCurrentKyaraLv(kyarakutaKozinExp, player.heroId);
        const bonuses1 = EqStUpdate(accessories, inventory, get().hardmode || 0, player.gold, player.level, baseHp_calc, baseAtk_calc, baseDef_calc, baseAgi_calc, baseLuc_calc, weaponObj, armorObj, heroBonuses1, kyarakutalv, currentKyaraLv1);
        
        // 武器/防具贡献分量（EqStUpdate已包含武器/护甲属性，此处用于兼容性保留）
        const equip1 = getEquipComponents(weaponObj, weaponQty, newPlayer.weaponSoul, armorObj, armorQty, newPlayer.armorSoul, baseHp_calc);
        
        const stats1 = computeFinalStats(baseHp_calc, baseAtk_calc, baseDef_calc, baseAgi_calc, baseLuc_calc, equip1, bonuses1, heroBonuses1, 0);
        
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
        
        const battleRingBonus = accessories.reduce((sum, acc) => {
          if (acc && acc.t1 === 6) {
            return sum + (acc.t2 || 0);
          }
          return sum;
        }, 0);
        
        const baseMaxBP = get().hardmode === 1 ? 15 : 30;
        const newMaxBattlePoints = baseMaxBP + battleRingBonus;
        
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
          maxBattlePoints: newMaxBattlePoints,
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
        // 返回标题画面：播放标题BGM（参考 title.txt#L177）
        bgmManager.bgmstopf();
        bgmManager.bgmstartf(0);
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
        // 玩家死亡：播放游戏结束BGM（参考 gameover.txt#L68-69）
        bgmManager.bgmstopf();
        bgmManager.bgmstartf(15);

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
        
        // 使用已分配的属性点
        const stPtAllocate = player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        
        // 基础属性
        let baseHp2 = initialPlayer.maxHp + stPtAllocate.hp * 5;
        let baseAtk2 = initialPlayer.attack + stPtAllocate.atk * 3;
        let baseDef2 = initialPlayer.defense + stPtAllocate.def * 3;
        let baseAgi2 = initialPlayer.agility + stPtAllocate.agi * 2;
        let baseLuc2 = initialPlayer.luck + stPtAllocate.luc * 1;
        
        console.log('🔍 [loadEquipSet] 基础属性(原始):', { baseHp2, baseAtk2, baseDef2, baseAgi2, baseLuc2 });
        console.log('🔍 [loadEquipSet] stPtAllocate:', stPtAllocate);
        console.log('🔍 [loadEquipSet] level bonus:', getLevelBonus(player.level));
        
        // 使用统一的 EqStUpdate 函数计算装备加成（包含武器、护甲、饰品、英雄加成）
        const { kyarakutalv: kclv, kyarakutaKozinExp: kcexp } = get();
        const heroBonuses2 = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLv2 = getCurrentKyaraLv(kcexp, player.heroId);
        const bonuses = EqStUpdate(accessories, inventory, get().hardmode || 0, player.gold, player.level, baseHp2, baseAtk2, baseDef2, baseAgi2, baseLuc2, weapon, armor, heroBonuses2, kclv, currentKyaraLv2);
        
        // 所有装备效果（包括勇敢证明、能力宝石、Brave/War/FourGod Gems等）都在 EqStUpdate 中处理
        console.log('🔍 [loadEquipSet] 基础属性(最终):', { baseHp2, baseAtk2, baseDef2, baseAgi2, baseLuc2 });
        
        // 武器/防具贡献分量（EqStUpdate已包含武器/护甲属性，此处用于兼容性保留）
        const weaponQty2 = weapon ? (inventory.find(i => i.equipmentId === weapon.id)?.quantity || 1) : 1;
        const armorQty2 = armor ? (inventory.find(i => i.equipmentId === armor.id)?.quantity || 1) : 1;
        const equip2 = getEquipComponents(weapon, weaponQty2, targetWeaponSoul, armor, armorQty2, targetArmorSoul, baseHp2);
        console.log('🔍 [loadEquipSet] equip2:', equip2);
        console.log('🔍 [loadEquipSet] weapon:', weapon?.name, 'qty=', weaponQty2, ', armor:', armor?.name, 'qty=', armorQty2);
        
        console.log('🔍 [loadEquipSet] heroBonuses2:', heroBonuses2, 'kclv:', kclv, 'currentKyaraLv2:', currentKyaraLv2);
        
        // gdata.txt 公式: 最终属性 = base + ehp/eatk/edef/espeed/eluk (已在EqStUpdate中计算)
        const stats2 = computeFinalStats(baseHp2, baseAtk2, baseDef2, baseAgi2, baseLuc2, equip2, bonuses, heroBonuses2, 0);
        console.log('🔍 [loadEquipSet] bonuses:', { 
          epHp: bonuses.epHp, ebHp: bonuses.ebHp, addMaxHP: bonuses.addMaxHP,
          kyarakutaNouryokuUp: bonuses.kyarakutaNouryokuUp, AllstatPer: bonuses.AllstatPer,
          epAtk: bonuses.epAtk, ebAtk: bonuses.ebAtk
        });
        
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
          hp: Math.min(Math.floor(player.hp * stats2.hp / player.maxHp), stats2.hp),
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
      logEquipmentBonuses: () => {
        const { player, inventory, hardmode, kyarakutalv, kyarakutaKozinExp } = get();
        
        const weapon = player.equippedWeapon ? getEquipmentById(player.equippedWeapon.id) || null : null;
        const armor = player.equippedArmor ? getEquipmentById(player.equippedArmor.id) || null : null;
        const accessories = (player.equippedAccessories || []).map(acc => 
          acc ? getEquipmentById(acc.id) || null : null
        ).filter((acc): acc is Equipment => acc !== null);
        
        const stPtAllocate = player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        const baseHp = initialPlayer.maxHp + stPtAllocate.hp * 5;
        const baseAtk = initialPlayer.attack + stPtAllocate.atk * 3;
        const baseDef = initialPlayer.defense + stPtAllocate.def * 3;
        const baseAgi = initialPlayer.agility + stPtAllocate.agi * 2;
        const baseLuc = initialPlayer.luck + stPtAllocate.luc * 1;
        
        console.group('%c📊 装备效果详细计算', 'color: purple; font-weight: bold; font-size: 16px');
        
        console.log('%c--- 穿戴的装备 ---', 'color: blue; font-weight: bold');
        
        if (weapon) {
          console.log(`%c武器: ${weapon.name}`, 'color: cyan');
          console.log(`  - 攻击加成: +${weapon.attackBonus}`);
        } else {
          console.log('%c武器: 无', 'color: gray');
        }
        
        if (armor) {
          console.log(`%c护甲: ${armor.name}`, 'color: cyan');
          console.log(`  - 防御加成: +${armor.defenseBonus}`);
          console.log(`  - HP加成: +${armor.hpBonus}`);
        } else {
          console.log('%c护甲: 无', 'color: gray');
        }
        
        console.log('%c饰品:', 'color: cyan');
        accessories.forEach((acc, index) => {
          if (!acc) return;
          console.log(`%c  [${index + 1}] ${acc.name} (t1=${acc.t1}, t2=${acc.t2})`, 'color: green');
          console.log(`    - 攻击: +${acc.attackBonus}, 防御: +${acc.defenseBonus}, HP: +${acc.hpBonus}, 敏捷: +${acc.agilityBonus}, 幸运: +${acc.luckBonus}`);
        });
        
        console.log('%c--- EqStUpdate 计算结果 ---', 'color: blue; font-weight: bold');
        const heroBonusesLog = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLvLog = getCurrentKyaraLv(kyarakutaKozinExp, player.heroId);
        const bonuses = EqStUpdate(accessories, inventory, hardmode || 0, player.gold, player.level, baseHp, baseAtk, baseDef, baseAgi, baseLuc, weapon, armor, heroBonusesLog, kyarakutalv, currentKyaraLvLog);
        
        console.log('%c--- 玩家宝石详细计算 ---', 'color: blue; font-weight: bold');
        const totalWeaponCount = inventory.filter(item => {
          const eq = getEquipmentById(item.equipmentId);
          return eq?.type === 'weapon' && item.quantity >= 1;
        }).reduce((sum, item) => sum + item.quantity, 0);
        const totalArmorCount = inventory.filter(item => {
          const eq = getEquipmentById(item.equipmentId);
          return eq?.type === 'armor' && item.quantity >= 1;
        }).reduce((sum, item) => sum + item.quantity, 0);
        const totalAccessoryCount = inventory.filter(item => {
          const eq = getEquipmentById(item.equipmentId);
          return eq?.type === 'accessory' && item.quantity >= 1;
        }).reduce((sum, item) => sum + item.quantity, 0);
        const totalItemCount = totalWeaponCount + totalArmorCount + totalAccessoryCount;
        console.log(`  - 获得的武器数量: ${totalWeaponCount}`);
        console.log(`  - 获得的防具数量: ${totalArmorCount}`);
        console.log(`  - 获得的饰品数量: ${totalAccessoryCount}`);
        console.log(`  - 总物品数量: ${totalItemCount}`);
        
        let playerGemBaseCount = totalItemCount;
        let playerGemBonusCount = 0;
        if (totalItemCount > 1000) {
          playerGemBonusCount = totalItemCount - 1000;
          playerGemBaseCount = 1000;
        }
        console.log(`  - 基础加成数量 (上限1000): ${playerGemBaseCount}`);
        console.log(`  - 额外幸运加成数量 (超过1000部分): ${playerGemBonusCount}`);
        
        const playerGemT2 = 900;
        console.log(`  - 玩家宝石t2值: ${playerGemT2}`);
        
        const playerGemPhpBonus = playerGemBaseCount * playerGemT2;
        const playerGemAtkBonus = playerGemBaseCount * playerGemT2;
        const playerGemDefBonus = playerGemBaseCount * playerGemT2;
        const playerGemAgiBonus = playerGemBaseCount * playerGemT2;
        const playerGemLucBonus = playerGemBonusCount * (playerGemT2 * 4);
        
        console.log(`%c  玩家宝石属性加成明细:`, 'color: green');
        console.log(`    - HP加成: ${playerGemBaseCount} × ${playerGemT2} = ${playerGemPhpBonus}`);
        console.log(`    - 攻击加成: ${playerGemBaseCount} × ${playerGemT2} = ${playerGemAtkBonus}`);
        console.log(`    - 防御加成: ${playerGemBaseCount} × ${playerGemT2} = ${playerGemDefBonus}`);
        console.log(`    - 敏捷加成: ${playerGemBaseCount} × ${playerGemT2} = ${playerGemAgiBonus}`);
        console.log(`    - 幸运加成: ${playerGemBonusCount} × ${playerGemT2} × 4 = ${playerGemLucBonus}`);
        
        console.log('%c--- 属性来源详细分析 ---', 'color: blue; font-weight: bold');
        
        const attrSources: Record<string, { ephp: number; epatk: number; epdef: number; epspeed: number; epluk: number }> = {};
        
        const addSource = (name: string, ephp: number, epatk: number, epdef: number, epspeed: number, epluk: number) => {
          if (!attrSources[name]) {
            attrSources[name] = { ephp: 0, epatk: 0, epdef: 0, epspeed: 0, epluk: 0 };
          }
          attrSources[name].ephp += ephp;
          attrSources[name].epatk += epatk;
          attrSources[name].epdef += epdef;
          attrSources[name].epspeed += epspeed;
          attrSources[name].epluk += epluk;
        };
        
        if (weapon) {
          addSource(`${weapon.name} (基础属性)`, 0, weapon.attackBonus || 0, 0, 0, 0);
        }
        
        if (armor) {
          addSource(`${armor.name} (基础属性)`, armor.hpBonus || 0, 0, armor.defenseBonus || 0, 0, 0);
        }
        
        accessories.forEach((acc, index) => {
          if (!acc) return;
          
          if (acc.t1 === 30) {
            addSource(`${acc.name} (t1=30)`, acc.t2 || 0, 0, 0, 0, 0);
          } else if (acc.t1 === 31) {
            addSource(`${acc.name} (t1=31)`, 0, acc.t2 || 0, 0, 0, 0);
          } else if (acc.t1 === 32) {
            addSource(`${acc.name} (t1=32)`, 0, 0, acc.t2 || 0, 0, 0);
          } else if (acc.t1 === 33) {
            addSource(`${acc.name} (t1=33)`, 0, 0, 0, acc.t2 || 0, 0);
          } else if (acc.t1 === 34) {
            addSource(`${acc.name} (t1=34)`, 0, 0, 0, 0, acc.t2 || 0);
          } else if (acc.t1 === 35 && index === accessories.findIndex(a => a?.t1 === 35)) {
            addSource(`${acc.name} (t1=35)`, playerGemPhpBonus, playerGemAtkBonus, playerGemDefBonus, playerGemAgiBonus, playerGemLucBonus);
          } else if (acc.t1 === 40) {
            addSource(`${acc.name} (t1=40)`, acc.t2 || 0, acc.t2 || 0, acc.t2 || 0, acc.t2 || 0, acc.t2 || 0);
          } else if (acc.t1 === 41) {
            addSource(`${acc.name} (t1=41)`, 0, acc.t2 || 0, acc.t2 || 0, acc.t2 || 0, 0);
          } else if (acc.t1 === 42) {
            addSource(`${acc.name} (t1=42)`, acc.t2 || 0, acc.t2 || 0, acc.t2 || 0, acc.t2 || 0, 0);
          } else if (acc.t1 === 43) {
            addSource(`${acc.name} (t1=43)`, acc.t2 || 0, 0, acc.t2 || 0, acc.t2 || 0, 0);
          } else if (acc.t1 === 2701) {
            addSource(`${acc.name} (t1=2701)`, 1500000, 0, 0, 0, 0);
          } else if (acc.t1 === 820) {
            addSource(`${acc.name} (t1=820)`, 0, 0, 0, 0, 0);
          } else {
            addSource(`${acc.name} (t1=${acc.t1})`, acc.hpBonus || 0, acc.attackBonus || 0, acc.defenseBonus || 0, acc.agilityBonus || 0, acc.luckBonus || 0);
          }
        });
        
        console.log('%c  属性来源明细:', 'color: green');
        Object.entries(attrSources).forEach(([name, attrs]) => {
          const total = attrs.ephp + attrs.epatk + attrs.epdef + attrs.epspeed + attrs.epluk;
          if (total > 0) {
            console.log(`    ${name}:`);
            if (attrs.ephp > 0) console.log(`      - HP: +${attrs.ephp}`);
            if (attrs.epatk > 0) console.log(`      - ATK: +${attrs.epatk}`);
            if (attrs.epdef > 0) console.log(`      - DEF: +${attrs.epdef}`);
            if (attrs.epspeed > 0) console.log(`      - AGI: +${attrs.epspeed}`);
            if (attrs.epluk > 0) console.log(`      - LUC: +${attrs.epluk}`);
          }
        });
        
        const sumEphp = Object.values(attrSources).reduce((sum, src) => sum + src.ephp, 0);
        const sumEpatk = Object.values(attrSources).reduce((sum, src) => sum + src.epatk, 0);
        const sumEpdef = Object.values(attrSources).reduce((sum, src) => sum + src.epdef, 0);
        const sumEpspeed = Object.values(attrSources).reduce((sum, src) => sum + src.epspeed, 0);
        const sumEpluk = Object.values(attrSources).reduce((sum, src) => sum + src.epluk, 0);
        
        console.log('%c  属性来源总计:', 'color: yellow');
        console.log(`    - HP: ${sumEphp}`);
        console.log(`    - ATK: ${sumEpatk}`);
        console.log(`    - DEF: ${sumEpdef}`);
        console.log(`    - AGI: ${sumEpspeed}`);
        console.log(`    - LUC: ${sumEpluk}`);
        
        console.log('%c  EqStUpdate 返回值:', 'color: red');
        console.log(`    - ephp: ${bonuses.ephp} (差异: ${bonuses.ephp - sumEphp})`);
        console.log(`    - epatk: ${bonuses.epatk} (差异: ${bonuses.epatk - sumEpatk})`);
        console.log(`    - epdef: ${bonuses.epdef} (差异: ${bonuses.epdef - sumEpdef})`);
        console.log(`    - epspeed: ${bonuses.epspeed} (差异: ${bonuses.epspeed - sumEpspeed})`);
        console.log(`    - epluk: ${bonuses.epluk} (差异: ${bonuses.epluk - sumEpluk})`);
        
        console.log('%c--- PassiveUpdate 被动加成详细计算 ---', 'color: blue; font-weight: bold');
        
        const castleRingCount = inventory.filter(item => {
          const eq = getEquipmentById(item.equipmentId);
          return eq?.type === 'accessory' && eq?.listnum === 95 && item.quantity >= 1;
        }).reduce((sum, item) => sum + item.quantity, 0);
        const divinePowerCount = inventory.filter(item => {
          const eq = getEquipmentById(item.equipmentId);
          return eq?.type === 'accessory' && eq?.listnum === 104 && item.quantity >= 1;
        }).reduce((sum, item) => sum + item.quantity, 0);
        
        console.log(`  - 城堡紫水晶戒指 (listnum=95) 数量: ${castleRingCount}`);
        console.log(`    - 每个提供全属性+750000`);
        console.log(`    - 总加成: ${castleRingCount} × 750000 = ${castleRingCount * 750000}`);
        
        console.log(`  - 神之力 (listnum=104) 数量: ${divinePowerCount}`);
        console.log(`    - 每个提供全属性+1500000`);
        console.log(`    - 总加成: ${divinePowerCount} × 1500000 = ${divinePowerCount * 1500000}`);
        
        const passiveTotalBonus = castleRingCount * 750000 + divinePowerCount * 1500000;
        console.log(`  - PassiveUpdate总加成: 全属性+${passiveTotalBonus}`);
        
        console.log('%c基础属性加成 (ephp/epatk/epdef/epspeed/epluk):', 'color: orange');
        console.log(`  - ephp: ${bonuses.ephp}`);
        console.log(`  - epatk: ${bonuses.epatk}`);
        console.log(`  - epdef: ${bonuses.epdef}`);
        console.log(`  - epspeed: ${bonuses.epspeed}`);
        console.log(`  - epluk: ${bonuses.epluk}`);
        
        console.log('%c百分比加成:', 'color: orange');
        console.log(`  - ebhp: ${(bonuses.ebhp * 100).toFixed(2)}%`);
        console.log(`  - ebatk: ${(bonuses.ebatk * 100).toFixed(2)}%`);
        console.log(`  - ebdef: ${(bonuses.ebdef * 100).toFixed(2)}%`);
        console.log(`  - ebspeed: ${(bonuses.ebspeed * 100).toFixed(2)}%`);
        console.log(`  - ebluk: ${(bonuses.ebluk * 100).toFixed(2)}%`);
        
        console.log('%c额外加成:', 'color: orange');
        console.log(`  - addMaxHP: ${(bonuses.addMaxHP * 100).toFixed(2)}%`);
        console.log(`  - addMaxATK: ${(bonuses.addMaxATK * 100).toFixed(2)}%`);
        console.log(`  - addMaxDEF: ${(bonuses.addMaxDEF * 100).toFixed(2)}%`);
        console.log(`  - addMaxAGI: ${(bonuses.addMaxAGI * 100).toFixed(2)}%`);
        console.log(`  - addMaxLUC: ${(bonuses.addMaxLUC * 100).toFixed(2)}%`);
        console.log(`  - AllstatPer: ${(bonuses.AllstatPer * 100).toFixed(2)}%`);
        console.log(`  - redEyeEffect: ${bonuses.redEyeEffect} (listnum=130数量: ${bonuses.redEyeEffect / 0.2})`);
        console.log(`  - blueEyeEffect: ${bonuses.blueEyeEffect}`);
        console.log(`  - greenEyeEffect: ${bonuses.greenEyeEffect}`);
        console.log(`  - kyarakutaNouryokuUp: ${bonuses.kyarakutaNouryokuUp}`);
        
        console.log('%c战斗相关:', 'color: orange');
        console.log(`  - 暴击率加成: ${(bonuses.crihPlusKakuritu * 100).toFixed(2)}%`);
        console.log(`  - 暴击伤害倍数: ${bonuses.crihplusdamage}`);
        console.log(`  - 连击率加成: ${(bonuses.renzokuPlusKakuritu * 100).toFixed(2)}%`);
        console.log(`  - 连击伤害倍率: ${bonuses.renzoDamageUP}`);
        console.log(`  - 真实伤害: ${bonuses.trueDamage}`);
        console.log(`  - 伤害减免: ${bonuses.DamageReduced}%`);
        console.log(`  - 伤害提升: ${bonuses.DamageIncreased}`);
        console.log(`  - 复活次数: ${bonuses.resCount}`);
        console.log(`  - 复活属性提升: ${(bonuses.resStatUP * 100 - 100).toFixed(2)}%`);
        
        console.log('%c被动效果:', 'color: orange');
        console.log(`  - 双倍攻击: ${bonuses.doubleAttack}`);
        console.log(`  - 伤害反射: ${(bonuses.reflection * 100).toFixed(2)}%`);
        console.log(`  - 反射回血: ${bonuses.refHealOn}`);
        console.log(`  - 防御转攻击: ${bonuses.deftoatk}`);
        console.log(`  - 被动防御转攻击(possiveDeftoAtk): ${bonuses.possiveDeftoAtk} (listnum=110数量: ${bonuses.possiveDeftoAtk ? '见passiveUpdate' : 0})`);
        console.log(`  - 当前HP伤害: ${bonuses.CurrentHpDamage}`);
        console.log(`  - HP恢复: ${bonuses.myhprecovery}`);
        console.log(`  - 伤害恢复: ${bonuses.DamegeKaihukuOn}`);
        console.log(`  - 索敌回避: ${bonuses.SokusiKaihiKakuritu}`);
        console.log(`  - 遭遇率: ${(bonuses.encountBairitu * 100).toFixed(2)}%`);
        console.log(`  - 移动速度: ${(bonuses.MoveSpeed * 100).toFixed(2)}%`);
        console.log(`  - 贪婪模式: ${bonuses.goyokuOn}`);
        console.log(`  - 懒惰模式: ${bonuses.donyokuOn}`);
        console.log(`  - 暮光模式: ${bonuses.twilightON}`);
        console.log(`  - 经验倍率: ${(bonuses.expbairitu * 100).toFixed(2)}%`);
        
        console.log('%c--- 最终属性计算 ---', 'color: blue; font-weight: bold');
        console.log(`  - 基础属性: HP=${baseHp}, ATK=${baseAtk}, DEF=${baseDef}, AGI=${baseAgi}, LUC=${baseLuc}`);
        console.log(`  - ephp=${bonuses.ephp}, epatk=${bonuses.epatk}, epdef=${bonuses.epdef}, epspeed=${bonuses.epspeed}, epluk=${bonuses.epluk}`);
        console.log(`  - ebhp=${bonuses.ebhp}, ebatk=${bonuses.ebatk}, ebdef=${bonuses.ebdef}, ebspeed=${bonuses.ebspeed}, ebluk=${bonuses.ebluk}`);
        console.log(`  - 英雄加成: KPhp=${heroBonusesLog.KPhp}, KPatk=${heroBonusesLog.KPatk}, KPdef=${heroBonusesLog.KPdef}, KPspeed=${heroBonusesLog.KPspeed}, KPluk=${heroBonusesLog.KPluk}`);
        console.log(`  - kyarakutalv=${kyarakutalv}, currentKyaraLv=${currentKyaraLvLog}`);
        const _kyaraLv = kyarakutalv > 0 ? ((kyarakutalv + currentKyaraLvLog) * 0.25 + 0.75) * (1 + bonuses.kyarakutaNouryokuUp / 100) : 0;
        console.log(`  - kyaraLv=${_kyaraLv} (kyarakutaNouryokuUp=${bonuses.kyarakutaNouryokuUp})`);
        console.log(`  - 最终HP加成: ${bonuses.ehp}`);
        console.log(`  - 最终攻击加成: ${bonuses.eatk}`);
        console.log(`  - 最终防御加成: ${bonuses.edef}`);
        console.log(`  - 最终敏捷加成: ${bonuses.espeed}`);
        console.log(`  - 最终幸运加成: ${bonuses.eluk}`);
        
        console.groupEnd();
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
        
        const newStPtAllocate = { ...player.stPtAllocate } as { hp: number; atk: number; def: number; agi: number; luc: number };
        if (hpAdd > 0) newStPtAllocate.hp = (newStPtAllocate.hp || 0) + hpAdd;
        if (atkAdd > 0) newStPtAllocate.atk = (newStPtAllocate.atk || 0) + atkAdd;
        if (defAdd > 0) newStPtAllocate.def = (newStPtAllocate.def || 0) + defAdd;
        if (agiAdd > 0) newStPtAllocate.agi = (newStPtAllocate.agi || 0) + agiAdd;
        if (lucAdd > 0) newStPtAllocate.luc = (newStPtAllocate.luc || 0) + lucAdd;
        
        set({
          player: {
            ...player,
            stPt: 0,
            stPtAllocate: newStPtAllocate,
          },
        });
      },
      selectHero: (heroId) => {
        const { player } = get();
        const hero = getHeroById(heroId);
        if (!hero) return;
        
        const stPtAllocate = player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        
        const baseHp = 1000 + stPtAllocate.hp * 5;
        const baseAtk = 1000 + stPtAllocate.atk * 3;
        const baseDef = 1000 + stPtAllocate.def * 3;
        const baseAgi = 1000 + stPtAllocate.agi * 2;
        const baseLuc = 1000 + stPtAllocate.luc * 1;
        
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
        const maxBP = hardmode === 2 ? 10 : (hardmode === 1 ? 15 : 30);
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
        
        const newBattlePoints = battlePoints <= 0 ? (hardmode === 2 ? 10 : (hardmode === 1 ? 15 : maxBattlePoints)) : battlePoints;
        
        const levelBonus = getLevelBonus(player.level);
        
        const weaponObj = finalEquippedWeapon;
        const weaponQty = weaponObj ? (finalInventory.find(i => i.equipmentId === weaponObj.id)?.quantity || 1) : 1;
        
        const armorObj = finalEquippedArmor;
        const armorQty = armorObj ? (finalInventory.find(i => i.equipmentId === armorObj.id)?.quantity || 1) : 1;
        
        const accessories = finalEquippedAccessories || [];
        
        const stPtAllocate = player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
        
        // 基础属性 = 初始值 + 属性点加成 (gdata.txt中hp/atk/def/speed/luk不包含等级加成)
        const baseHp = initialPlayer.maxHp + stPtAllocate.hp * 5;
        const baseAtk = initialPlayer.attack + stPtAllocate.atk * 3;
        const baseDef = initialPlayer.defense + stPtAllocate.def * 3;
        const baseAgi = initialPlayer.agility + stPtAllocate.agi * 2;
        const baseLuc = initialPlayer.luck + stPtAllocate.luc * 1;
        
        // 武器/防具贡献分量（EqStUpdate已包含武器/护甲属性，此处用于英雄加成计算）
        const equip = getEquipComponents(weaponObj, weaponQty, finalWeaponSoul, armorObj, armorQty, finalArmorSoul, baseHp);
        
        // 英雄加成
        const heroBonuses = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLv = getCurrentKyaraLv(kyarakutaKozinExp, player.heroId);
        
        // 装备加成（包含武器、护甲、饰品、英雄加成）
        const bonuses = EqStUpdate(accessories, finalInventory, hardmode, player.gold, player.level, baseHp, baseAtk, baseDef, baseAgi, baseLuc, weaponObj, armorObj, heroBonuses, kyarakutalv, currentKyaraLv);
        
        // gdata.txt 公式: 最终属性 = base + ehp/eatk/edef/espeed/eluk (已在EqStUpdate中计算)
        const finalStats = computeFinalStats(baseHp, baseAtk, baseDef, baseAgi, baseLuc, equip, bonuses, heroBonuses, 0);
        
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
            comboDisplayKey: 0,
            comboRate: 5,
            critRate: 5,
            baseComboRate: 0.05,
            baseCritRate: 0.05,
            missrate: 0,
            isMiss: false,
            missPosition: null,
            bossType: -1,
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
          expMultiplier: 1,
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
            attackCount: 0,
          hitCount: 0,
            specialBonusType: null,
            activeEffect: null,
            resCount: bonuses.resCount,
            resStatUP: bonuses.resStatUP,
            fireSecretKeyOn: bonuses.fireSecretKeyOn,
            secretKeyOn: bonuses.secretKeyOn,
            sandHourglassOn: bonuses.sandHourglassOn,
            healOnAttackOn: bonuses.healOnAttackOn,
            warGodBladeOn: bonuses.warGodBladeOn,
            reflection: bonuses.reflection || 0,
            refHealOn: bonuses.refHealOn || false,
            hourgclassOn: bonuses.hourgclassOn || false,
            hourgclassOn1: bonuses.hourgclassOn1 || false,
            missrateOn: bonuses.missrateOn || 0,
            _missTurnCount: 0,
            renzoDamageUP: bonuses.renzoDamageUP || 0,
            isDoubleAttack: false,
            eneHP2: 0,
            eneHPM2: 0,
            eneATK2: 0,
            teneATK: 0,
            patternCount: 0,
            suzakuTurnCount: 0,
            eneDouble: 0,
            eneSkill: 0,
            eneDamageReduced: 1,
            eneCounter: 0,
          },
        });
        console.log('[startGame] resCount:', bonuses.resCount, 'resStatUP:', bonuses.resStatUP);
        console.log('[startGame] End - player stats:', { maxHp: newMaxHp, attack: newAtk, defense: newDef, agility: newAgi, luck: newLuc }, 'hardmode:', hardmode, 'newBattlePoints:', newBattlePoints);
        // 进入地图：播放当前地图BGM（参考 StageMap.txt#L608）
        bgmManager.bgmstopf();
        bgmManager.bgmstartf(3, get().currentMap || 1);
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
        const { kyarakutalv: btlKyarakutalv, kyarakutaKozinExp: btlKozinExp } = get();
        
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
            const boss = getBossById(bossId, hardmode, currentMap);
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
        
        // 掉落按 3 档拆分（normal/hard/hell 各 3 个），用 null 占位保持位置对齐
        let activeDrops: ({ equipmentId: string; dropRate: number } | null)[];
        const normalDrops = enemy.drops.slice(0, 3);
        const hardDrops = enemy.drops.slice(3, 6);
        const hellDrops = enemy.drops.slice(6, 9);
        if (hardmode === 2) {
          activeDrops = hellDrops;
        } else if (hardmode === 1) {
          activeDrops = hardDrops;
        } else {
          activeDrops = normalDrops;
        }
        // 当对应难度掉落为空时，回退到普通掉落
        const hasValidDrop = activeDrops.some((d) => d !== null);
        if (!hasValidDrop && activeDrops !== normalDrops) {
          activeDrops = normalDrops;
        }
        
        enemy.drops = activeDrops;
        
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
        
        // 计算装备加成（包括连击率等）
        const weapon = player.equippedWeapon ? getEquipmentById(player.equippedWeapon.id) || null : null;
        const armor = player.equippedArmor ? getEquipmentById(player.equippedArmor.id) || null : null;
        const heroBonusesBattle = computeHeroBonuses(player.heroId || 0);
        const currentKyaraLvBattle = getCurrentKyaraLv(btlKozinExp, player.heroId);
        const eqBonuses = EqStUpdate(
          accessories, inventory, hardmode, player.gold, player.level, player.maxHp, player.attack, player.defense, player.agility, player.luck, weapon, armor, heroBonusesBattle, btlKyarakutalv, currentKyaraLvBattle
        );
        
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
            renzokuPlusKakuritu: eqBonuses.renzokuPlusKakuritu,
            crihPlusKakuritu: eqBonuses.crihPlusKakuritu,
            speedwariai: 0,
            lukwariai: 0,
            hourGlassON: eqBonuses.hourGlassON,
            hourGlassON1: eqBonuses.hourGlassON1,
            missrate: eqBonuses.missrate,
            enemissrate: 0,
            expbairitu: eqBonuses.expbairitu,
          }
        );
        
        const greedRing = accessories.find(acc => acc && acc.t1 === 12);
        const greedPendant = accessories.find(acc => acc && acc.t1 === 77);
        
        const settings = {
          donyokuOn: !!greedRing,
          goyokuOn: !!greedPendant,
          twilightON: false,
          hardmode,
          dropBoost: 1,
        };
        
        const saveSettings = {
          dropNum,
          Highlv,
        };
        
        const dropResult = eneDropItemInit(slot1, slot2, slot3, battleVarResult.itemDropRate, inventory, settings, saveSettings, 1);
        
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

        const lang = get().language;
        // 普通战斗开始：播放战斗BGM（BossSyu = -1 表示普通战，参考 battle.txt#L198-199）
        bgmManager.bgmstopf();
        bgmManager.bgmstartf(5, -1);
        bgmManager.okstart();
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
            comboDisplayKey: 0,
            comboRate: battleVarResult.comboRate * 100,
            critRate: battleVarResult.critRate * 100,
            baseComboRate: battleVarResult.comboRate,
            baseCritRate: battleVarResult.critRate,
            missrate: battleVarResult.missrate,
            isMiss: false,
            missPosition: null,
            bossType: -1,
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
            expMultiplier: battleVarResult.expMultiplier,
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
            attackCount: 0,
          hitCount: 0,
            activeEffect: null,
            resCount: eqBonuses.resCount,
            resStatUP: eqBonuses.resStatUP,
            fireSecretKeyOn: eqBonuses.fireSecretKeyOn,
            secretKeyOn: eqBonuses.secretKeyOn,
            sandHourglassOn: eqBonuses.sandHourglassOn,
            healOnAttackOn: eqBonuses.healOnAttackOn,
            warGodBladeOn: eqBonuses.warGodBladeOn,
            reflection: eqBonuses.reflection || 0,
            refHealOn: eqBonuses.refHealOn || false,
            hourgclassOn: eqBonuses.hourgclassOn || false,
            hourgclassOn1: eqBonuses.hourgclassOn1 || false,
            missrateOn: eqBonuses.missrateOn || 0,
            _missTurnCount: 0,
            renzoDamageUP: eqBonuses.renzoDamageUP || 0,
            isDoubleAttack: false,
            eneHP2: 0,
            eneHPM2: 0,
            eneATK2: 0,
            teneATK: 0,
            patternCount: 0,
            suzakuTurnCount: 0,
            eneDouble: 0,
            eneSkill: 0,
            eneDamageReduced: 1,
            eneCounter: 0,
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
        
        // i地图(bossId=62) / iii地图(bossId=68) Boss 调试日志
        if (bossId === 62 || bossId === 68) {
          console.log(`[BossBattle] 遭遇 ${bossId === 62 ? 'i' : 'iii'}地图 Boss, bossId=${bossId}, hardmode=${get().hardmode}`);
        }
        
        const hardmode = get().hardmode || 0;
        const currentMap = get().currentMap;
        const { kyarakutalv: bossKyarakutalv, kyarakutaKozinExp: bossKozinExp } = get();
        const boss = getBossById(bossId, hardmode, currentMap);
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
        
        // 当对应难度掉落为空时，回退到普通掉落
        const hasValidDrop = activeDrops.some((d: { equipmentId: string; dropRate: number } | null) => d !== null);
        if (!hasValidDrop && activeDrops !== normalDrops) {
          activeDrops = normalDrops;
        }
        
        modifiedBoss.drops = activeDrops;
        
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
        
        // 计算装备加成（包括连击率等）
        const weapon2 = player.equippedWeapon ? getEquipmentById(player.equippedWeapon.id) || null : null;
        const armor2 = player.equippedArmor ? getEquipmentById(player.equippedArmor.id) || null : null;
        const eqBonuses2 = EqStUpdate(
          accessories, inventory, hardmode, player.gold, player.level, player.maxHp, player.attack, player.defense, player.agility, player.luck, weapon2, armor2, computeHeroBonuses(player.heroId || 0), bossKyarakutalv, getCurrentKyaraLv(bossKozinExp, player.heroId)
        );
        
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
            renzokuPlusKakuritu: eqBonuses2.renzokuPlusKakuritu,
            crihPlusKakuritu: eqBonuses2.crihPlusKakuritu,
            speedwariai: 0,
            lukwariai: 0,
            hourGlassON: eqBonuses2.hourGlassON,
            hourGlassON1: eqBonuses2.hourGlassON1,
            missrate: eqBonuses2.missrate,
            enemissrate: 0,
            expbairitu: eqBonuses2.expbairitu,
          }
        );
        
        // 应用地图奖励效果到 Boss
        if (bonus.currentBonus && bonus.currentBonus.remainingCount > 0) {
          switch (bonus.currentBonus.bonusType) {
            case 0: // 敌HP半减
              modifiedBoss.hp = Math.floor(modifiedBoss.maxHp * 0.5);
              break;
            case 1: // 敌攻击力半减
              modifiedBoss.attack = Math.floor(modifiedBoss.attack * 0.5);
              break;
            case 2: // 会心连続率上昇
              battleVarResult.critRate = Math.min(1, battleVarResult.critRate + 0.15);
              battleVarResult.comboRate = Math.min(1, battleVarResult.comboRate + 0.15);
              break;
            case 3: // 金币2倍
              battleVarResult.goldMultiplier *= 2;
              break;
            case 4: // 金币3倍
              battleVarResult.goldMultiplier *= 3;
              break;
            case 5: // 金币4倍
              battleVarResult.goldMultiplier *= 4;
              break;
            case 6: // 金币7倍
              battleVarResult.goldMultiplier *= 7;
              break;
            case 7: // 经验1.5倍
              modifiedBoss.expReward = Math.floor(modifiedBoss.expReward * 1.5);
              break;
            case 8: // 经验2倍
              modifiedBoss.expReward = Math.floor(modifiedBoss.expReward * 2);
              break;
          }
          // Reduce bonus remaining count
          const newRemaining = bonus.currentBonus.remainingCount - 1;
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
        
        const greedRing = accessories.find(acc => acc && acc.t1 === 12);
        const greedPendant = accessories.find(acc => acc && acc.t1 === 77);
        
        const settings = {
          donyokuOn: !!greedRing,
          goyokuOn: !!greedPendant,
          twilightON: false,
          hardmode,
          dropBoost: 1,
        };
        
        const saveSettings = {
          dropNum,
          Highlv,
        };
        
        const dropResult = eneDropItemInit(slot1, slot2, slot3, battleVarResult.itemDropRate, inventory, settings, saveSettings, 1);
        
        const dropEquipment = dropResult.getItemDropType !== -1 
          ? getEquipmentById(itemTypeAndIndexToEquipmentId(dropResult.getItemDropType, dropResult.getItemDropIndex))
          : null;
        
        // 记录触发战斗的特殊 bonus 类型（12=i, 13=iii 用于隐藏地图传送）
        const specialBonusType = bonus.currentBonus && bonus.currentBonus.bonusType >= 12
          ? bonus.currentBonus.bonusType
          : null;

        const lang = get().language;
        // Boss 战开始：播放 Boss 战斗BGM（BossSyu = bossId >= 0，参考 battle.txt#L198-199）
        bgmManager.bgmstopf();
        bgmManager.bgmstartf(5, bossId);
        bgmManager.okstart();
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
            comboDisplayKey: 0,
            comboRate: battleVarResult.comboRate * 100,
            critRate: battleVarResult.critRate * 100,
            baseComboRate: battleVarResult.comboRate,
            baseCritRate: battleVarResult.critRate,
            missrate: battleVarResult.missrate,
            isMiss: false,
            missPosition: null,
            bossType: bossId,
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
            expMultiplier: battleVarResult.expMultiplier,
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
            attackCount: 0,
          hitCount: 0,
            specialBonusType,
            activeEffect: null,
            resCount: eqBonuses2.resCount,
            resStatUP: eqBonuses2.resStatUP,
            fireSecretKeyOn: eqBonuses2.fireSecretKeyOn,
            secretKeyOn: eqBonuses2.secretKeyOn,
            sandHourglassOn: eqBonuses2.sandHourglassOn,
            healOnAttackOn: eqBonuses2.healOnAttackOn,
            warGodBladeOn: eqBonuses2.warGodBladeOn,
            reflection: eqBonuses2.reflection || 0,
            refHealOn: eqBonuses2.refHealOn || false,
            hourgclassOn: eqBonuses2.hourgclassOn || false,
            hourgclassOn1: eqBonuses2.hourgclassOn1 || false,
            missrateOn: eqBonuses2.missrateOn || 0,
            _missTurnCount: 0,
            renzoDamageUP: eqBonuses2.renzoDamageUP || 0,
            isDoubleAttack: false,
            eneHP2: 0,
            eneHPM2: 0,
            eneATK2: 0,
            teneATK: 0,
            patternCount: 0,
            suzakuTurnCount: 0,
            eneDouble: 0,
            eneSkill: 0,
            eneDamageReduced: 1,
            eneCounter: 0,
          },
        });
      },
      endBattle: (victory) => {
        const { battle, player, addGold, addExp, addToInventory, updatePlayerHp, incrementWinBattle, incrementLoseBattle, updateHighCombo, battlePoints, defeatedBosses, kyarakutalv, kyarakutaKozinExp, battle: { comboCount, goldMultiplier, expMultiplier } } = get();

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

        if (victory && battle.enemy) {
          // 战斗胜利：播放胜利BGM（参考 battle.txt#L793-797）
          // BossSyu = bossType >= 0 表示Boss战，普通战为 -1
          const bossSyu = battle.bossType >= 0 ? battle.bossType : -1;
          bgmManager.bgmstopf();
          bgmManager.bgmstartf(7, bossSyu);

          // gdata.txt battlevar.txt#L202-213:
          // EneG *= hourGlass(2x/3x) * gUpBairitu  → goldMultiplier
          // EneExp *= hourGlass(2x/3x) * expbairitu → expMultiplier
          // expbairitu 已包含 t1=60/3333/3334/3335/4100/1899 的加成；goyokuOn(t1=77) 会将 expbairitu 置 0
          goldReward = Math.floor(battle.enemy.goldReward * goldMultiplier);
          expReward = Math.floor(battle.enemy.expReward * expMultiplier);

          console.log(`[战斗奖励前] Lv.${player.level} | 金币:${player.gold} | 经验:${player.exp} | HP:${player.maxHp} | ATK:${player.attack} | DEF:${player.defense} | AGI:${player.agility} | LUC:${player.luck}`);
          console.log(`[战斗奖励] 金币+${goldReward} | 经验+${expReward} | 敌人:${battle.enemy?.name}(${battle.enemy?.id}) | 难度:${get().hardmode || 0}`);
          addGold(goldReward);
          addExp(expReward);
          const playerAfter = get().player;
          console.log(`[战斗奖励后] Lv.${playerAfter.level} | 金币:${playerAfter.gold} | 经验:${playerAfter.exp} | HP:${playerAfter.maxHp} | ATK:${playerAfter.attack} | DEF:${playerAfter.defense} | AGI:${playerAfter.agility} | LUC:${playerAfter.luck}`);
          
          if (battle.isDropSuccess && battle.dropType !== -1 && battle.dropIndex !== -1) {
            const equipmentId = itemTypeAndIndexToEquipmentId(battle.dropType, battle.dropIndex);
            dropItem = getEquipmentById(equipmentId);
            if (dropItem) {
              addToInventory(equipmentId, 1);
            }
          }
          
          incrementWinBattle();
          updateHighCombo(comboCount);
          set({ player: { ...get().player, killCount: get().player.killCount + 1 } });
          
          if ((battle.enemy as any).bossId !== undefined) {
            battlePointsChange = WinBossGetBattlePoint((battle.enemy as any).bossId);
          }
        } else if (!victory) {
          // 战斗失败：停止BGM（参考 battle.txt#L1193）
          bgmManager.bgmstopf();
          const damage = Math.floor(player.maxHp * 0.3);
          updatePlayerHp(-damage);
          incrementLoseBattle();
          battlePointsChange = -3;
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
            if ((spType === 12 || spType === 14) && (bossId === 60 || bossId === 62)) {
              const map13 = MAP_LIST.find(m => m.id === 13);
              if (map13 && player.level >= map13.unlockLevel) {
                enterHiddenMap(13, 12);
              }
            } else if ((spType === 13 || spType === 15) && (bossId === 66 || bossId === 68)) {
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
        // 战斗结果清除后返回地图：恢复地图BGM（参考 StageMap.txt#L608）
        bgmManager.bgmstopf();
        bgmManager.bgmstartf(3, get().currentMap || 1);
      },
      toggleBattle: () => {
        const { battle, startBattleLoop, stopBattleLoop } = get();
        
        if (battle.status === 'idle') {
          if (battle.battleResult) {
            return;
          }
          set({ battle: { ...battle, status: 'fighting' } });
          startBattleLoop();
          bgmManager.okstart();
        } else if (battle.status === 'fighting' && !battle._ending) {
          stopBattleLoop();
          set({ battle: { ...battle, status: 'paused' } });
          bgmManager.okstart();
        }
      },
      resumeBattle: () => {
        const { startBattleLoop, battle } = get();
        if (battle.battleResult) {
          return;
        }
        set((state) => ({ battle: { ...state.battle, status: 'fighting' } }));
        startBattleLoop();
        bgmManager.okstart();
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
          bgmManager.okstart();
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
        
        const lang = get().language;
        const t = (key: string, ...args: (string | number)[]) => {
          let msg = getTranslation(key, lang);
          args.forEach((a, i) => { msg = msg.replace(`{${i}}`, String(a)); });
          return msg;
        };
        
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
              battle: { ...s.battle, damageDisplay: null, isCrit: false, isCombo: false, isMiss: false, missPosition: null },
            }));
            
            if (whichTurn === 0) {
              const totalAttack = player.attack;
              const hpPercent = player.hp / player.maxHp;
              const accessories = player.equippedAccessories || [];
              const critRate = calculateCritRate(battle.baseCritRate, hpPercent, battle.bossType);
              
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
                player.level,
                battle.attackCount,
                battle.renzoDamageUP
              );
              
              set((s) => ({
                battle: {
                  ...s.battle,
                  attackCount: s.battle.attackCount + 1,
                },
              }));
              
              tdame = damage;
              if (state.debugKill) {
                tdame = battle.enemy!.hp + 999999;
              }
              updateHighDamage(damage);
              
              let logMessage = t('攻击 {0}伤害！', Math.floor(damage));
              if (currentComboCount >= 2) {
                logMessage += t(' {0} 连击！', currentComboCount);
              }
              if (isCrit) {
                logMessage += t(' 暴击！');
              }
              addBattleLog(logMessage);
              
              let attackEffectIndex = 0;
              if (isCrit) {
                attackEffectIndex = Math.floor(Math.random() * 6) + 5;
              } else {
                attackEffectIndex = Math.floor(Math.random() * 4);
              }
              bgmManager.myef(attackEffectIndex + 1);
              
              set((s) => ({
              battle: {
                ...s.battle,
                playerAnimation: 'attack',
                enemyAnimation: 'hurt',
                damageDisplay: damage,
                isCrit: isCrit,
                isCombo: currentComboCount >= 2,
                comboCount: currentComboCount,
                comboDisplayKey: currentComboCount >= 2 ? (s.battle.comboDisplayKey || 0) + 1 : 0,
                lastAttacker: 'player',
                activeEffect: { effectId: attackEffectIndex, position: 'enemy' },
              },
            }));
            
            eefi = 0;
            mode = 4;
            isProcessing = false;
            } else {
              // Sanctuary's Blessing: 前X回合强制闪避
              if (battle._missTurnCount < battle.missrateOn) {
                addBattleLog(t('你闪避了敌人的攻击！'));
                set((s) => ({
                  battle: {
                    ...s.battle,
                    enemyAnimation: 'attack',
                    damageDisplay: null,
                    isMiss: true,
                    missPosition: 'player',
                    isCrit: false,
                    isCombo: false,
                    lastAttacker: 'enemy',
                    activeEffect: { effectId: 0, position: 'player' },
                  },
                }));
                tdame = 0;
                eefi = 0;
                mode = 4;
                isProcessing = false;
              } else {
                const enemyNum = battle.bossType;
                const { result: patternResult, effects } = enePattern(enemyNum, whichTurn, battle, player, saveData.hardmode);
              
              if (patternResult && patternResult.skillUsed) {
                const { damage, skillName, effectType, requiresDoubleAttack, requiresSecondAttack } = patternResult;
                
                if (effects) {
                  const update: Partial<GameStore> = {};
                  if (effects.updateBattle) {
                    update.battle = { ...battle, ...effects.updateBattle };
                  }
                  if (effects.updateEnemy && battle.enemy) {
                    if (!update.battle) update.battle = { ...battle };
                    update.battle.enemy = { ...battle.enemy, ...effects.updateEnemy };
                  }
                  if (Object.keys(update).length > 0) {
                    set(update);
                  }
                  if (effects.battleLog) {
                    addBattleLog(effects.battleLog);
                  }
                }
                
                tdame = damage;
                
                if (effectType === 'damage') {
                  addBattleLog(`${t(skillName)}！${Math.floor(damage)}伤害！`);
                  bgmManager.eneef(2);
                } else if (effectType !== 'passive') {
                  addBattleLog(`${t(skillName)}！`);
                  bgmManager.eneef(1);
                }
                
                if (effectType === 'double_attack' || requiresDoubleAttack) {
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      isDoubleAttack: true,
                    },
                  }));
                  eefi = 0;
                  mode = 4;
                  isProcessing = false;
                  tdame = 0;
                } else if (effectType === 'passive') {
                  eefi = 0;
                  mode = 4;
                  isProcessing = false;
                  tdame = 0;
                } else {
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      playerAnimation: effectType === 'heal' ? 'idle' : 'hurt',
                      enemyAnimation: 'attack',
                      damageDisplay: effectType === 'damage' ? damage : null,
                      isCrit: false,
                      isCombo: false,
                      isMiss: false,
                      missPosition: null,
                      lastAttacker: 'enemy',
                      activeEffect: { effectId: effectType === 'heal' ? 4 : 13, position: effectType === 'heal' ? 'enemy' : 'player' },
                    },
                  }));
                  
                  eefi = 0;
                  mode = 4;
                  isProcessing = false;
                }
                
                if (requiresSecondAttack) {
                  const secondDamage = Math.floor(damage * 0.1);
                  tdame += secondDamage;
                  addBattleLog(`追加攻击！${Math.floor(secondDamage)}伤害！`);
                }
              } else {
                const isPlayerMiss = Math.random() < battle.missrate;
              
                if (isPlayerMiss) {
                  addBattleLog(t('你闪避了敌人的攻击！'));
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      playerAnimation: 'idle',
                      enemyAnimation: 'attack',
                      damageDisplay: null,
                      isCrit: false,
                      isCombo: false,
                      isMiss: true,
                      missPosition: 'player',
                      lastAttacker: 'enemy',
                      activeEffect: { effectId: 0, position: 'player' },
                    },
                  }));
                  tdame = 0;
                  eefi = 0;
                  mode = 4;
                  isProcessing = false;
                } else {
                  const totalDefense = player.defense;
                  const accessories = player.equippedAccessories || [];
                  const enemyDamage = calculateEnemyDamage(
                    battle.enemy!.attack,
                    totalDefense,
                    accessories,
                    battle.hitCount
                  );
                  tdame = enemyDamage;
                  bgmManager.eneef(1);

                  // 闪光沙漏 (t1=2777): 受到敌人攻击时 hitCount +1
                  const shiningHourglass = accessories.find(acc => acc && acc.t1 === 2777);
                  if (shiningHourglass) {
                    set((s) => ({
                      battle: {
                        ...s.battle,
                        hitCount: s.battle.hitCount + 1,
                      },
                    }));
                  }

                  set((s) => ({
                    battle: {
                      ...s.battle,
                      playerAnimation: 'idle',
                      enemyAnimation: 'attack',
                      damageDisplay: enemyDamage,
                      isCrit: false,
                      isCombo: false,
                      isMiss: false,
                      missPosition: null,
                      lastAttacker: 'enemy',
                      activeEffect: { effectId: 13, position: 'player' },
                    },
                  }));

                  eefi = 0;
                  mode = 4;
                  isProcessing = false;
                }
              }
            }
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
                    addBattleLog(t('回复项链效果：回复 {0} HP！', healAmount));
                  }
                }
                
                if (battle.fireSecretKeyOn && Math.random() < 0.2) {
                  const secretKeyDamage = Math.floor(newEnemyHp * 0.03);
                  const updatedEnemyHp = Math.max(0, newEnemyHp - secretKeyDamage);
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      enemy: { ...s.battle.enemy!, hp: updatedEnemyHp },
                      hpRate: (updatedEnemyHp / s.battle.enemy!.maxHp) * 100,
                    },
                  }));
                  addBattleLog(t('火焰秘钥效果：扣除敌人3%HP！({0}伤害)', secretKeyDamage));
                  if (updatedEnemyHp <= 0) {
                    addBattleLog(t('战斗胜利！'));
                    battleEnded = true;
                    set((s) => ({ battle: { ...s.battle, _ending: true } }));
                    setTimeout(() => {
                      endBattle(true);
                    }, 500);
                    return;
                  }
                }
                
                if (battle.secretKeyOn && Math.random() < 0.2) {
                  const secretKeyDamage = Math.floor(newEnemyHp * 0.05);
                  const updatedEnemyHp = Math.max(0, newEnemyHp - secretKeyDamage);
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      enemy: { ...s.battle.enemy!, hp: updatedEnemyHp },
                      hpRate: (updatedEnemyHp / s.battle.enemy!.maxHp) * 100,
                    },
                  }));
                  addBattleLog(t('秘钥效果：扣除敌人5%HP！({0}伤害)', secretKeyDamage));
                  if (updatedEnemyHp <= 0) {
                    addBattleLog(t('战斗胜利！'));
                    battleEnded = true;
                    set((s) => ({ battle: { ...s.battle, _ending: true } }));
                    setTimeout(() => {
                      endBattle(true);
                    }, 500);
                    return;
                  }
                }
                
                if (battle.healOnAttackOn) {
                  const healAmount = Math.floor(player.maxHp * 0.09);
                  if (healAmount > 0) {
                    set((s) => ({
                      player: {
                        ...s.player,
                        hp: Math.min(s.player.hp + healAmount, s.player.maxHp),
                      },
                    }));
                    addBattleLog(t('圣树之叶效果：回复最大HP的9%！({0} HP)', healAmount));
                  }
                }
                
                if (battle.hourgclassOn1) {
                  if (battle.attackCount >= 45 && newEnemyHp <= battle.enemy!.maxHp * 0.4) {
                    set((s) => ({
                      battle: {
                        ...s.battle,
                        enemy: { ...s.battle.enemy!, hp: 0 },
                        hpRate: 0,
                      },
                    }));
                    addBattleLog(t('闪光沙漏1效果：直接斩杀！'));
                    addBattleLog(t('战斗胜利！'));
                    battleEnded = true;
                    set((s) => ({ battle: { ...s.battle, _ending: true } }));
                    setTimeout(() => {
                      endBattle(true);
                    }, 500);
                    return;
                  }
                }
                
                if (newEnemyHp <= 0) {
                  addBattleLog(t('战斗胜利！'));
                  battleEnded = true;
                  set((s) => ({ battle: { ...s.battle, _ending: true } }));
                  setTimeout(() => {
                    endBattle(true);
                  }, 500);
                  return;
                }
              } else {
                updatePlayerHp(-tdame);
                addBattleLog(t('敌人攻击 受到{0}伤害', Math.floor(tdame)));
                
                const { player: newPlayer } = get();
                if (newPlayer.hp <= 0) {
                  if (battle.resCount > 0) {
                    eefi = 0;
                    mode = 5;
                    isProcessing = false;
                    return;
                  }
                  
                  addBattleLog(t('战斗失败了'));
                  battleEnded = true;
                  set((s) => ({ battle: { ...s.battle, _ending: true } }));
                  setTimeout(() => {
                    endBattle(false);
                  }, 500);
                  return;
                }
                
                if (battle.reflection > 0) {
                  const reflectDamage = Math.floor(tdame * battle.reflection);
                  const newEnemyHp = Math.max(0, battle.enemy!.hp - reflectDamage);
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      enemy: { ...s.battle.enemy!, hp: newEnemyHp },
                      hpRate: (newEnemyHp / s.battle.enemy!.maxHp) * 100,
                    },
                  }));
                  addBattleLog(t('反射之镜效果：反射 {0} 伤害！', reflectDamage));
                  if (battle.refHealOn) {
                    const healAmount = Math.floor(reflectDamage * 0.5);
                    if (healAmount > 0) {
                      set((s) => ({
                        player: {
                          ...s.player,
                          hp: Math.min(s.player.hp + healAmount, s.player.maxHp),
                        },
                      }));
                      addBattleLog(t('反射回复效果：回复 {0} HP！', healAmount));
                    }
                  }
                  if (newEnemyHp <= 0) {
                    addBattleLog(t('战斗胜利！'));
                    battleEnded = true;
                    set((s) => ({ battle: { ...s.battle, _ending: true } }));
                    setTimeout(() => {
                      endBattle(true);
                    }, 500);
                    return;
                  }
                }
                
                set((s) => ({
                  battle: {
                    ...s.battle,
                    playerAnimation: 'idle',
                    enemyAnimation: 'idle',
                  },
                }));
              }
              
              if (battle.isDoubleAttack) {
                set((s) => ({
                  battle: {
                    ...s.battle,
                    isDoubleAttack: false,
                  },
                }));
                isProcessing = false;
                return;
              }
              
              eefi = 0;
              mode = 5;
            }
          } else if (mode === 5) {
            eefi++;
            
            if (eefi >= 2) {
              if (whichTurn === 0) {
                const playerHpPercent = player.hp / player.maxHp;
                const comboCheckRate = calculateComboRate(
                  battle.baseComboRate,
                  playerHpPercent,
                  battle.bossType
                );
                const newCritRateVal = calculateCritRate(
                  battle.baseCritRate,
                  playerHpPercent,
                  battle.bossType
                );
                const isCombo = Math.random() * 100 < comboCheckRate;
                
                if (isCombo) {
                  renzokukaisu++;
                  whichTurn = 0;
                  set((s) => ({
                    battle: {
                      ...s.battle,
                      comboCount: renzokukaisu,
                      comboRate: comboCheckRate,
                      critRate: newCritRateVal,
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
                      critRate: newCritRateVal,
                    },
                  }));
                }
              } else {
                whichTurn = 0;
                set((s) => ({
                  battle: { ...s.battle, _missTurnCount: s.battle._missTurnCount + 1 },
                }));
              }
              
              if (battle.recoverNextTurn) {
                mode = 6;
                eefi = 0;
              } else if (player.hp <= 0 && battle.resCount > 0) {
                mode = 6;
                eefi = 0;
              } else {
                mode = 3;
              }
            }
          } else if (mode === 6) {
            eefi++;
            
            if (eefi === 1) {
              set((s) => ({
                battle: {
                  ...s.battle,
                  activeEffect: { effectId: 4, position: 'player' as const },
                },
              }));
            }
            
            if (eefi >= 18) {
              if (battle.recoverNextTurn) {
                updatePlayerHp(player.maxHp);
                addBattleLog(t('全部恢复了'));
                bgmManager.kaihukustart();
                set((s) => ({
                  battle: { ...s.battle, recoverNextTurn: false },
                }));
              } else if (player.hp <= 0 && battle.resCount > 0) {
                const resStatUP = battle.resStatUP || 1.03;
                set((s) => ({
                  player: {
                    ...s.player,
                    hp: Math.floor(s.player.maxHp * resStatUP),
                    maxHp: Math.floor(s.player.maxHp * resStatUP),
                    attack: Math.floor(s.player.attack * resStatUP),
                  },
                  battle: {
                    ...s.battle,
                    resCount: s.battle.resCount - 1,
                  },
                }));
                addBattleLog(t('不灭之力发动！复活 (剩余{0}次)', battle.resCount - 1));
              }
              mode = 5;
              eefi = 0;
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
        
        addBattleLog(getTranslation('成功逃跑了！', get().language));
        resetEncounterRate();
        setCurrentScene('world');
        set({
          battle: {
            enemy: null,
            status: 'idle',
            battleLog: [],
            comboCount: 0,
            comboDisplayKey: 0,
            comboRate: 5,
            critRate: 5,
            baseComboRate: 0.05,
            baseCritRate: 0.05,
            missrate: 0,
            isMiss: false,
            missPosition: null,
            bossType: -1,
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
          expMultiplier: 1,
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
            attackCount: 0,
          hitCount: 0,
            specialBonusType: null,
            activeEffect: null,
            resCount: 0,
            resStatUP: 1,
            fireSecretKeyOn: false,
            secretKeyOn: false,
            sandHourglassOn: false,
            healOnAttackOn: false,
            warGodBladeOn: false,
            reflection: 0,
            refHealOn: false,
            hourgclassOn: false,
            hourgclassOn1: false,
            missrateOn: 0,
            _missTurnCount: 0,
            renzoDamageUP: 0,
            isDoubleAttack: false,
            eneHP2: 0,
            eneHPM2: 0,
            eneATK2: 0,
            teneATK: 0,
            patternCount: 0,
            suzakuTurnCount: 0,
            eneDouble: 0,
            eneSkill: 0,
            eneDamageReduced: 1,
            eneCounter: 0,
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
        
        const baseResetHp = initialPlayer.maxHp + stPtAlloc.hp * 5;
        const baseResetAtk = initialPlayer.attack + stPtAlloc.atk * 3;
        const baseResetDef = initialPlayer.defense + stPtAlloc.def * 3;
        const baseResetAgi = initialPlayer.agility + stPtAlloc.agi * 2;
        const baseResetLuc = initialPlayer.luck + stPtAlloc.luc * 1;
        
        const equipR = getEquipComponents(equippedWeapon, weaponQty, weaponSoul, equippedArmor, armorQty, armorSoul, baseResetHp);
        const heroBonusesR = computeHeroBonuses(initialPlayer.heroId || 0);
        const currentKyaraLvR = getCurrentKyaraLv(get().kyarakutaKozinExp, initialPlayer.heroId);
        const bonusesR = EqStUpdate(equippedAccessories, savedInventory, get().hardmode || 0, currentPlayer.gold, currentPlayer.level, baseResetHp, baseResetAtk, baseResetDef, baseResetAgi, baseResetLuc, equippedWeapon, equippedArmor, heroBonusesR, get().kyarakutalv, currentKyaraLvR);
        
        const statsR = computeFinalStats(baseResetHp, baseResetAtk, baseResetDef, baseResetAgi, baseResetLuc, equipR, bonusesR, heroBonusesR, 0);
        
        // 注意：PlayerGems(t1=35)和Brave/War/FourGod Gems(t1=40/41/42)的加成已在 EqStUpdate 中通过加法应用，不再在此处重复计算
        
        const newPlayer = {
          ...initialPlayer,
          maxHp: statsR.hp,
          attack: statsR.atk,
          defense: statsR.def,
          agility: statsR.agi,
          luck: statsR.luc,
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
            comboDisplayKey: 0,
            comboRate: 5,
            critRate: 5,
            baseComboRate: 0.05,
            baseCritRate: 0.05,
            missrate: 0,
            isMiss: false,
            missPosition: null,
            bossType: -1,
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
          expMultiplier: 1,
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
            attackCount: 0,
          hitCount: 0,
            specialBonusType: null,
            activeEffect: null,
            resCount: 0,
            resStatUP: 1,
            fireSecretKeyOn: false,
            secretKeyOn: false,
            sandHourglassOn: false,
            healOnAttackOn: false,
            warGodBladeOn: false,
            reflection: 0,
            refHealOn: false,
            hourgclassOn: false,
            hourgclassOn1: false,
            missrateOn: 0,
            _missTurnCount: 0,
            renzoDamageUP: 0,
            isDoubleAttack: false,
            eneHP2: 0,
            eneHPM2: 0,
            eneATK2: 0,
            teneATK: 0,
            patternCount: 0,
            suzakuTurnCount: 0,
            eneDouble: 0,
            eneSkill: 0,
            eneDamageReduced: 1,
            eneCounter: 0,
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
        // 退出隐藏地图回到原地图：恢复地图BGM（参考 StageMap.txt#L608）
        bgmManager.bgmstopf();
        bgmManager.bgmstartf(3, originalMap || 1);
        console.log(`[HiddenMap] Exited, returned to map ${originalMap}`);
      },
      unlockAccessorySlot: (slotIndex?: number) => {
        const { player } = get();
        const unlockedSlots = player.unlockedAccessorySlots || [true, true, true, false, false, false, false, false, false, false, false, false];
        
        let targetIndex;
        if (slotIndex !== undefined) {
          targetIndex = slotIndex;
        } else {
          targetIndex = unlockedSlots.findIndex(slot => !slot);
          if (targetIndex === -1) return false;
        }
        
        if (targetIndex < 0 || targetIndex >= MAX_ACCESSORY_SLOTS) return false;
        if (unlockedSlots[targetIndex]) return false;
        
        const price = AKUSE_SLOT_LOCK_MONEY[targetIndex];
        if (player.gold < price) return false;
        
        const newUnlockedSlots = [...unlockedSlots];
        newUnlockedSlots[targetIndex] = true;
        
        const newMaxSlots = Math.max(player.maxAccessorySlots, targetIndex + 1);
        
        set({
          player: {
            ...player,
            gold: player.gold - price,
            unlockedAccessorySlots: newUnlockedSlots,
            maxAccessorySlots: newMaxSlots,
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
          
          const stPtAllocM = state.player.stPtAllocate || { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 };
          
          const baseMergeHp = initialPlayer.maxHp + stPtAllocM.hp * 5;
          const baseMergeAtk = initialPlayer.attack + stPtAllocM.atk * 3;
          const baseMergeDef = initialPlayer.defense + stPtAllocM.def * 3;
          const baseMergeAgi = initialPlayer.agility + stPtAllocM.agi * 2;
          const baseMergeLuc = initialPlayer.luck + stPtAllocM.luc * 1;
          
          const equipM = getEquipComponents(weapon, weaponQty, state.player.weaponSoul, armor, armorQty, state.player.armorSoul, baseMergeHp);
          const globalState = useGameStore.getState();
          const heroBonusesM = computeHeroBonuses(state.player.heroId || 0);
          const currentKyaraLvM = getCurrentKyaraLv(globalState.kyarakutaKozinExp, state.player.heroId);
          const bonusesM = EqStUpdate(accessories, inventory, globalState.hardmode || 0, state.player.gold, state.player.level, baseMergeHp, baseMergeAtk, baseMergeDef, baseMergeAgi, baseMergeLuc, weapon, armor, heroBonusesM, globalState.kyarakutalv, currentKyaraLvM);
          
          const statsM = computeFinalStats(baseMergeHp, baseMergeAtk, baseMergeDef, baseMergeAgi, baseMergeLuc, equipM, bonusesM, heroBonusesM, 0);
          
          // 所有装备效果都在 EqStUpdate 中处理，不再手动计算
          state.player.attack = statsM.atk;
          state.player.defense = statsM.def;
          state.player.maxHp = statsM.hp;
          state.player.agility = statsM.agi;
          state.player.luck = statsM.luc;
          
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
