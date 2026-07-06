import type { DamageResult, Equipment } from '@/types';
import { oneExpTableFunc } from './expTable';

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
  const weaponPlus = weapon.attackBonus || 0;
  const weaponMulti = (weapon.attributeRate || 100) - 100;
  
  const soulPlus = soul?.soulPlus || 0;
  const soulPerPlus = soul?.soulPerPlus || 0;
  
  const effectiveAtk = (weaponPlus + soulPlus) * stockMult;
  const effectiveRate = (weaponMulti + soulPerPlus) * stockMult / 100;
  return Math.ceil(effectiveAtk * (1 + effectiveRate));
};

/** 获取防具带的防御力贡献（包含存货加成、倍率和魂加成） */
export const getArmorDefContribution = (armor: Equipment, quantity: number, soul?: Equipment | null): number => {
  const stockMult = getStockBonus(quantity);
  const armorPlus = armor.defenseBonus || 0;
  const armorMulti = (armor.attributeRate || 100) - 100;
  
  const soulPlus = soul?.soulPlus || 0;
  const soulPerPlus = soul?.soulPerPlus || 0;
  
  const effectiveDef = (armorPlus + soulPlus) * stockMult;
  const effectiveRate = (armorMulti + soulPerPlus) * stockMult / 100;
  return Math.ceil(effectiveDef * (1 + effectiveRate));
};

/** 获取防具带的 HP 贡献（包含存货加成、倍率和魂加成） */
export const getArmorHpContribution = (armor: Equipment, quantity: number, soul?: Equipment | null): number => {
  const stockMult = getStockBonus(quantity);
  const armorPlus = armor.hpBonus || 0;
  const armorMulti = (armor.attributeRate || 100) - 100;
  
  const soulPlus = soul?.soulPlus || 0;
  const soulPerPlus = soul?.soulPerPlus || 0;
  
  const effectiveHp = (armorPlus + soulPlus) * stockMult;
  const effectiveRate = (armorMulti + soulPerPlus) * stockMult / 100;
  return Math.ceil(effectiveHp * (1 + effectiveRate));
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