import type { Player, InventoryItem, Skill } from '@/types';
import { skillsData } from './skills';

export const initialPlayer: Player = {
  id: 'player-1',
  name: '勇者',
  level: 1,
  hp: 1000,
  maxHp: 1000,
  attack: 1000,
  defense: 1000,
  agility: 1000,
  luck: 1000,
  gold: 0,
  exp: 0,
  expToNextLevel: 100,
  mana: 50,
  maxMana: 50,
  equippedWeapon: null,
  equippedArmor: null,
  equippedAccessories: [],
  weaponSoul: null,
  armorSoul: null,
  maxAccessorySlots: 3,
  stPt: 0,
  stPtAllocate: { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 },
  heroId: 0,
  lvC2: 0.5,
};

export const initialInventory: InventoryItem[] = [
  { equipmentId: 'consumable-1', quantity: 3 },
];

export const initialSkills: Skill[] = skillsData.map(s => ({ ...s, currentCooldown: 0 }));

export const GAME_CONFIG = {
  MAP_WIDTH: 400,
  MAP_HEIGHT: 300,
  PLAYER_SPEED: 5,
  ENCOUNTER_INCREMENT_MIN: 5,
  ENCOUNTER_INCREMENT_MAX: 15,
  ENCOUNTER_MAX: 100,
  ESCAPE_CHANCE: 0.5,
  CRITICAL_CHANCE: 0.2,
  CRITICAL_MULTIPLIER: 1.5,
};