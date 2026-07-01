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

export const getLevelBonus = (level: number): { hp: number; attack: number; defense: number; mana: number } => {
  return {
    hp: (level - 1) * 20,
    attack: (level - 1) * 3,
    defense: (level - 1) * 2,
    mana: (level - 1) * 10,
  };
};

/** 存货加成：每多1件 +10%，第1件无加成 */
export const getStockBonus = (quantity: number): number => {
  return 1 + (quantity - 1) * 0.1;
};

/** 获取武器带的攻击力贡献（包含存货加成和倍率） */
export const getWeaponAtkContribution = (weapon: Equipment, quantity: number): number => {
  const stockMult = getStockBonus(quantity);
  const effectiveAtk = weapon.attackBonus * stockMult;
  const effectiveRate = weapon.attributeRate * stockMult / 100;
  // eatk = epatk + (epatk + baseATK) * ebatk
  return Math.ceil(effectiveAtk + effectiveAtk * effectiveRate);
};

/** 获取防具带的防御力贡献（包含存货加成和倍率） */
export const getArmorDefContribution = (armor: Equipment, quantity: number): number => {
  const stockMult = getStockBonus(quantity);
  const effectiveDef = armor.defenseBonus * stockMult;
  const effectiveRate = armor.attributeRate * stockMult / 100;
  // edef = (epdef + def) * (1 + ebdef) - def = epdef * (1 + ebdef) + def * ebdef
  // 简化：effectiveDef * (1 + effectiveRate)
  return Math.ceil(effectiveDef * (1 + effectiveRate));
};

/** 获取防具带的 HP 贡献（包含存货加成和倍率） */
export const getArmorHpContribution = (armor: Equipment, quantity: number): number => {
  const stockMult = getStockBonus(quantity);
  const effectiveHp = armor.hpBonus * stockMult;
  const effectiveRate = armor.attributeRate * stockMult / 100;
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