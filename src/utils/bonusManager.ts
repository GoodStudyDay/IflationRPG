/**
 * 奖励类型:
 * 0: 敌HP半减 (Enemy HP halved)
 * 1: 敌攻击力半减 (Enemy ATK halved)
 * 2: 会心连続率上昇 (Crit/Combo rate up)
 * 3: 获得金币2倍 (Gold x2)
 * 4: 获得金币3倍 (Gold x3)
 * 5: 获得金币4倍 (Gold x4)
 * 6: 获得金币7倍 (Gold x7)
 * 7: 经验值1.5倍 (Exp x1.5)
 * 8: 经验值2倍 (Exp x2)
 */

export interface BonusInfo {
  type: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const BONUS_LIST: BonusInfo[] = [
  { type: 0, name: '敌HP半减', description: '敌人HP减少50%', icon: '💔', color: 'text-red-400' },
  { type: 1, name: '敌攻击力半减', description: '敌人攻击力减少50%', icon: '🛡️', color: 'text-blue-400' },
  { type: 2, name: '会心连続率上昇', description: '暴击率和连击率上升', icon: '⚡', color: 'text-yellow-400' },
  { type: 3, name: '金币2倍', description: '获得金币x2', icon: '💰', color: 'text-yellow-300' },
  { type: 4, name: '金币3倍', description: '获得金币x3', icon: '💰', color: 'text-yellow-300' },
  { type: 5, name: '金币4倍', description: '获得金币x4', icon: '💰', color: 'text-yellow-300' },
  { type: 6, name: '金币7倍', description: '获得金币x7', icon: '💰', color: 'text-yellow-300' },
  { type: 7, name: '经验值1.5倍', description: '获得经验x1.5', icon: '⭐', color: 'text-green-400' },
  { type: 8, name: '经验值2倍', description: '获得经验x2', icon: '⭐', color: 'text-green-400' },
];

/**
 * 根据适正等级随机生成奖励类型
 */
export function getRandomBonusType(monsterLevel: number): number {
  const weights = [
    [4, 4, 20, 10, 12, 14, 20, 8, 30],
  ];

  let w = [...weights[0]];
  if (monsterLevel >= 1000) {
    w = [4, 4, 16, 7, 12, 12, 12, 4, 16];
  }
  if (monsterLevel >= 2500) {
    w = [4, 4, 16, 5, 10, 12, 12, 3, 18];
  }
  if (monsterLevel >= 10000) {
    w = [4, 4, 16, 5, 5, 12, 12, 3, 18];
  }

  const totalWeight = w.reduce((sum, v) => sum + v, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < w.length; i++) {
    random -= w[i];
    if (random <= 0) {
      return i;
    }
  }

  return 0;
}

/**
 * 应用奖励效果到战斗
 */
export function applyBonusEffect(
  bonusType: number,
  enemyHp: number,
  enemyMaxHp: number,
  enemyAtk: number,
  critRate: number,
  comboRate: number,
  goldMultiplier: number,
  expMultiplier: number
): {
  enemyHp: number;
  enemyAtk: number;
  critRate: number;
  comboRate: number;
  goldMultiplier: number;
  expMultiplier: number;
} {
  let result = {
    enemyHp,
    enemyAtk,
    critRate,
    comboRate,
    goldMultiplier,
    expMultiplier,
  };

  switch (bonusType) {
    case 0:
      result.enemyHp = Math.floor(enemyMaxHp * 0.5);
      break;
    case 1:
      result.enemyAtk = Math.floor(enemyAtk * 0.5);
      break;
    case 2:
      result.critRate += 15;
      result.comboRate += 15;
      break;
    case 3:
      result.goldMultiplier *= 2;
      break;
    case 4:
      result.goldMultiplier *= 3;
      break;
    case 5:
      result.goldMultiplier *= 4;
      break;
    case 6:
      result.goldMultiplier *= 7;
      break;
    case 7:
      result.expMultiplier *= 1.5;
      break;
    case 8:
      result.expMultiplier *= 2;
      break;
  }

  return result;
}
