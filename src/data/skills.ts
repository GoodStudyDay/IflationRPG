import type { Skill } from '@/types';

export const skillsData: Skill[] = [
  {
    id: 'attack',
    name: '普通攻击',
    description: '基础攻击，造成100%攻击力伤害',
    damage: 100,
    manaCost: 0,
    cooldown: 0,
    currentCooldown: 0,
    icon: '⚔️',
  },
  {
    id: 'power_strike',
    name: '强力一击',
    description: '蓄力攻击，造成150%攻击力伤害',
    damage: 150,
    manaCost: 15,
    cooldown: 2,
    currentCooldown: 0,
    icon: '💥',
  },
  {
    id: 'heal',
    name: '治愈术',
    description: '恢复30%最大生命值',
    damage: 0,
    manaCost: 20,
    cooldown: 3,
    currentCooldown: 0,
    icon: '💚',
  },
  {
    id: 'fireball',
    name: '火球术',
    description: '发射火球，造成200%攻击力伤害',
    damage: 200,
    manaCost: 30,
    cooldown: 4,
    currentCooldown: 0,
    icon: '🔥',
  },
];

export const getSkillById = (id: string): Skill | undefined => {
  return skillsData.find(s => s.id === id);
};