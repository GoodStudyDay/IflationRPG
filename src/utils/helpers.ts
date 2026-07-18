import type { DamageResult, Equipment } from '@/types';
import { oneExpTableFunc } from './expTable';

export const WinBossGetBattlePoint = (bossId: number): number => {
  const bpMap: Record<number, number> = {
    0: 3, 1: 7, 2: 4, 3: 3, 4: 3, 5: 3, 6: 4, 7: 4, 8: 4, 9: 4,
    10: 3, 11: 3, 12: 5, 13: 3, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2, 19: 4,
    20: 6, 21: 4, 22: 5, 23: 4, 24: 4, 25: 4, 26: 4, 27: 4, 28: 5, 29: 5,
    30: 5, 54: 8, 55: 7, 56: 7, 57: 7, 58: 7, 59: 7, 91: 20,
    70: 10, 71: 10, 72: 10, 73: 10, 74: 10, 75: 10,
    78: 10, 79: 10, 80: 10, 76: 10, 77: 5, 82: 6,
  };
  
  if (bpMap[bossId] !== undefined) {
    return bpMap[bossId];
  }
  
  if (bossId >= 32) {
    return 1;
  }
  
  if (bossId === 98 || bossId === 99) {
    return 10;
  }
  
  return 0;
};

export const calculateDamage = (attackerAttack: number, defenderDefense: number): DamageResult => {
  const baseDamage = Math.max(1, attackerAttack - defenderDefense * 0.5);
  const isCritical = Math.random() < 0.2;
  const damage = isCritical 
    ? Math.floor(baseDamage * 1.5) 
    : Math.floor(baseDamage);
  return { damage, isCritical };
};

export const calculateHealAmount = (maxHp: number, healPercent: number): number => {
  return Math.floor(maxHp * (healPercent / 100));
};

export const getExpToNextLevel = (currentLevel: number): number => {
  return oneExpTableFunc(currentLevel);
};

export const getLevelBonus = (level: number): { hp: number; attack: number; defense: number; mana: number; agility: number; luck: number } => {
  return {
    hp: (level - 1) * 20,
    attack: (level - 1) * 3,
    defense: (level - 1) * 2,
    mana: (level - 1) * 10,
    agility: 0,
    luck: 0,
  };
};

/** 存货加成：每多1件 +10%，第1件无加成 */
export const getStockBonus = (quantity: number): number => {
  return 1 + (quantity - 1) * 0.1;
};

/** 武器/防具贡献分量 */
export interface EquipComponents {
  epAtk: number;   // 武器固定攻击力
  ebAtk: number;   // 武器攻击力倍率 (0-1)
  epDef: number;   // 防具固定防御力
  ebDef: number;   // 防具防御力倍率 (0-1)
  epHp: number;    // 防具 HP 贡献
}

/** 英雄加成系数 */
export interface HeroBonuses {
  KPhp: number;
  KPatk: number;
  KPdef: number;
  KPspeed: number;
  KPluk: number;
}

/** 计算英雄加成系数（gdata.txt hwMode KPhp/KPatk 逻辑） */
export const computeHeroBonuses = (heroId: number): HeroBonuses => {
  // heroId 对应英雄组: 0-15
  const check = (ids: number[]) => ids.includes(heroId % 16);
  
  let KPhp = 0, KPatk = 0, KPdef = 0, KPspeed = 0, KPluk = 0;
  
  // HP: 5,6,9,10 → +2; 1,2,7,11,14,13,8,4 → +1
  if (check([5, 6, 9, 10])) KPhp += 2;
  if (check([1, 2, 7, 11, 14, 13, 8, 4])) KPhp += 1;
  
  // ATK: 0,1,2,3 → +2; 4,5,6,7 → +1
  if (check([0, 1, 2, 3])) KPatk += 2;
  if (check([4, 5, 6, 7])) KPatk += 1;
  
  // DEF: 12,13,14,15 → +2; 8,9,10,11 → +1
  if (check([12, 13, 14, 15])) KPdef += 2;
  if (check([8, 9, 10, 11])) KPdef += 1;
  
  // SPD: 0,4,8,12 → +2; 1,5,9,13 → +1
  if (check([0, 4, 8, 12])) KPspeed += 2;
  if (check([1, 5, 9, 13])) KPspeed += 1;
  
  // LUK: 0,1,12,13 → +2; 2,6,11,7,3,8,10,15 → +1 (剩余全部+1)
  if (check([0, 1, 12, 13])) KPluk += 2;
  if (check([2, 6, 11, 7, 3, 8, 10, 15])) KPluk += 1;
  
  return { KPhp, KPatk, KPdef, KPspeed, KPluk };
};

/** 获取武器/防具贡献分量 */
export const getEquipComponents = (
  weapon: Equipment | null, weaponQty: number, weaponSoul: Equipment | null,
  armor: Equipment | null, armorQty: number, armorSoul: Equipment | null,
  baseHp: number
): EquipComponents => {
  const weaponStockMult = weaponQty > 0 ? getStockBonus(weaponQty) : 1;
  const armorStockMult = armorQty > 0 ? getStockBonus(armorQty) : 1;
  
  let epAtk = 0, ebAtk = 0;
  let epDef = 0, ebDef = 0;
  let epHp = 0;
  
  if (weapon) {
    const weaponPlus = weapon.plus || weapon.attackBonus || 0;
    const weaponMulti = weapon.multi || ((weapon.attributeRate || 100) - 100);
    const soulPlus = weaponSoul?.plus || weaponSoul?.soulPlus || 0;
    const soulPerPlus = weaponSoul?.t2 || weaponSoul?.soulPerPlus || 0;
    
    epAtk = Math.ceil((weaponPlus + soulPlus) * weaponStockMult);
    ebAtk = (weaponMulti + soulPerPlus) / 100;
  }
  
  if (armor) {
    const armorPlus = armor.plus || armor.defenseBonus || 0;
    const armorMulti = armor.multi || ((armor.attributeRate || 100) - 100);
    const soulPlus = armorSoul?.plus || armorSoul?.soulPlus || 0;
    const soulPerPlus = armorSoul?.t2 || armorSoul?.soulPerPlus || 0;
    
    epDef = Math.ceil((armorPlus + soulPlus) * armorStockMult);
    ebDef = (armorMulti + soulPerPlus) / 100;
    epHp = Math.floor(baseHp * ((armorMulti - 0.1) * 0.0011));
  }
  
  return { epAtk, ebAtk, epDef, ebDef, epHp };
};

/** 按 gdata.txt 逻辑计算最终属性
 *  gdata.txt 第1290-1294行:
 *    最终HP = hp + ehp
 *    最终ATK = atk + eatk
 *    最终DEF = def + edef
 *    最终AGI = speed + espeed
 *    最终LUC = luk + eluk
 *  ehp/eatk/edef/espeed/eluk 已在 gdata.ts 的 EqStUpdate 中计算完成（包含英雄加成）
 */
export const computeFinalStats = (
  baseHp: number, baseAtk: number, baseDef: number, baseAgi: number, baseLuc: number,
  _equip: EquipComponents,
  bonuses: {
    ehp: number; eatk: number; edef: number; espeed: number; eluk: number;
    donyokuRing: boolean;
  },
  _heroBonuses: HeroBonuses,
  _heroLevel: number
): { hp: number; atk: number; def: number; agi: number; luc: number } => {
  const donyokuMultiplier = bonuses.donyokuRing ? 0.5 : 1;
  // gdata.txt 第1290-1294行: 最终属性 = base + ehp/eatk/edef/espeed/eluk
  const hp = Math.floor((baseHp + bonuses.ehp) * donyokuMultiplier);
  const atk = Math.floor((baseAtk + bonuses.eatk) * donyokuMultiplier);
  const def = Math.floor((baseDef + bonuses.edef) * donyokuMultiplier);
  const agi = Math.floor((baseAgi + bonuses.espeed) * donyokuMultiplier);
  const luc = Math.floor((baseLuc + bonuses.eluk) * donyokuMultiplier);

  return { hp, atk, def, agi, luc };
};

/** @deprecated 使用 getEquipComponents 代替 */
export const getWeaponAtkContribution = (weapon: Equipment, quantity: number, soul?: Equipment | null): number => {
  const stockMult = getStockBonus(quantity);
  const weaponPlus = weapon.plus || weapon.attackBonus || 0;
  const weaponMulti = weapon.multi || ((weapon.attributeRate || 100) - 100);
  
  const soulPlus = soul?.plus || soul?.soulPlus || 0;
  const soulPerPlus = soul?.t2 || soul?.soulPerPlus || 0;
  
  const effectiveAtk = (weaponPlus + soulPlus) * stockMult;
  const effectiveRate = (weaponMulti + soulPerPlus) / 100;
  return Math.ceil(effectiveAtk * (1 + effectiveRate));
};

/** @deprecated 使用 getEquipComponents 代替 */
export const getArmorDefContribution = (armor: Equipment, quantity: number, soul?: Equipment | null): number => {
  const stockMult = getStockBonus(quantity);
  const armorPlus = armor.plus || armor.defenseBonus || 0;
  const armorMulti = armor.multi || ((armor.attributeRate || 100) - 100);
  
  const soulPlus = soul?.plus || soul?.soulPlus || 0;
  const soulPerPlus = soul?.t2 || soul?.soulPerPlus || 0;
  
  const effectiveDef = (armorPlus + soulPlus) * stockMult;
  const effectiveRate = (armorMulti + soulPerPlus) / 100;
  return Math.ceil(effectiveDef * (1 + effectiveRate));
};

/** @deprecated 使用 getEquipComponents 代替 */
export const getArmorHpContribution = (armor: Equipment, quantity: number, soul?: Equipment | null, currentHp: number = 1000): number => {
  const stockMult = getStockBonus(quantity);
  const armorPlus = armor.plus || armor.defenseBonus || 0;
  const armorMulti = armor.multi || ((armor.attributeRate || 100) - 100);
  
  const soulPlus = soul?.plus || soul?.soulPlus || 0;
  const soulPerPlus = soul?.t2 || soul?.soulPerPlus || 0;
  
  const effectiveDef = (armorPlus + soulPlus) * stockMult;
  const effectiveRate = (armorMulti + soulPerPlus) / 100;
  
  const defContribution = Math.ceil(effectiveDef * (1 + effectiveRate));
  
  const hpFromDef = Math.floor(currentHp * ((armorMulti - 0.1) * 0.0011));
  
  return defContribution + hpFromDef;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};