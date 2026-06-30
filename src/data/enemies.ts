import type { Enemy } from '@/types';

export const enemiesData: Enemy[] = [
  {
    id: 'slime',
    name: '史莱姆',
    level: 1,
    hp: 20,
    maxHp: 20,
    attack: 5,
    defense: 2,
    expReward: 10,
    goldReward: 5,
    drops: [
      { equipmentId: 'consumable-1', dropRate: 0.3 },
      { equipmentId: 'weapon-1', dropRate: 0.1 },
    ],
    icon: '🟢',
    imageUrl: '/images/enemies/slime.svg',
  },
  {
    id: 'goblin',
    name: '哥布林',
    level: 3,
    hp: 40,
    maxHp: 40,
    attack: 10,
    defense: 5,
    expReward: 25,
    goldReward: 15,
    drops: [
      { equipmentId: 'consumable-1', dropRate: 0.4 },
      { equipmentId: 'weapon-2', dropRate: 0.15 },
      { equipmentId: 'armor-2', dropRate: 0.1 },
    ],
    icon: '👺',
    imageUrl: '/images/enemies/goblin.svg',
  },
  {
    id: 'skeleton',
    name: '骷髅兵',
    level: 5,
    hp: 60,
    maxHp: 60,
    attack: 15,
    defense: 8,
    expReward: 40,
    goldReward: 25,
    drops: [
      { equipmentId: 'consumable-2', dropRate: 0.3 },
      { equipmentId: 'weapon-2', dropRate: 0.2 },
      { equipmentId: 'armor-3', dropRate: 0.15 },
    ],
    icon: '💀',
    imageUrl: '/images/enemies/skeleton.svg',
  },
  {
    id: 'orc',
    name: '兽人',
    level: 8,
    hp: 100,
    maxHp: 100,
    attack: 25,
    defense: 15,
    expReward: 70,
    goldReward: 50,
    drops: [
      { equipmentId: 'consumable-2', dropRate: 0.4 },
      { equipmentId: 'weapon-3', dropRate: 0.2 },
      { equipmentId: 'armor-3', dropRate: 0.2 },
    ],
    icon: '👹',
    imageUrl: '/images/enemies/orc.svg',
  },
  {
    id: 'dragon',
    name: '幼龙',
    level: 12,
    hp: 200,
    maxHp: 200,
    attack: 40,
    defense: 25,
    expReward: 150,
    goldReward: 100,
    drops: [
      { equipmentId: 'consumable-3', dropRate: 0.5 },
      { equipmentId: 'weapon-4', dropRate: 0.15 },
      { equipmentId: 'armor-4', dropRate: 0.1 },
    ],
    icon: '🐉',
    imageUrl: '/images/enemies/dragon.svg',
  },
];

export const getRandomEnemy = (playerLevel: number): Enemy => {
  const availableEnemies = enemiesData.filter(e => e.level <= playerLevel + 2);
  const weights = availableEnemies.map(e => Math.pow(2, e.level));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < availableEnemies.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return { ...availableEnemies[i], hp: availableEnemies[i].maxHp };
    }
  }
  
  return { ...availableEnemies[availableEnemies.length - 1], hp: availableEnemies[availableEnemies.length - 1].maxHp };
};