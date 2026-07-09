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

/** 获取武器带的攻击力贡献（包含存货加成、倍率和魂加成） */
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

/** 获取防具带的防御力贡献（包含存货加成、倍率和魂加成） */
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

/** 获取防具带的 HP 贡献（包含存货加成、倍率和魂加成） */
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