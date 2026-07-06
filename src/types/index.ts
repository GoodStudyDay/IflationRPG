export type EquipmentType = 'weapon' | 'armor' | 'consumable' | 'accessory' | 'soul' | 'material';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  listnum: number;
  x: number;
  y: number;
  price: number;
  plus?: number;
  multi?: number;
  hardmode: number;
  bit32?: number;
  bougu32png?: number;
  t1?: number;
  setumei?: string;
  t2?: number;
  rank?: number;
  image?: number;
  mixbase1?: number;
  mixbase2?: number;
  mixbase3?: number;
  mixbase4?: number;
  attackBonus: number;
  defenseBonus: number;
  hpBonus: number;
  agilityBonus: number;
  luckBonus: number;
  description: string;
  icon: string;
  maxQuantity: number;
  effectDescription?: string;
  attributeRate: number;
  soulType?: number;
  soulPlus?: number;
  soulPerPlus?: number;
}

export interface InventoryItem {
  equipmentId: string;
  quantity: number;
}

export interface EquipSet {
  id: string;
  name: string;
  weaponId: string | null;
  armorId: string | null;
  accessoryIds: (string | null)[];
  createdAt: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  damage: number;
  manaCost: number;
  cooldown: number;
  currentCooldown: number;
  icon: string;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  drops: ({ equipmentId: string; dropRate: number } | null)[];
  icon: string;
  imageUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  agility: number;
  luck: number;
  gold: number;
  exp: number;
  expToNextLevel: number;
  mana: number;
  maxMana: number;
  equippedWeapon: Equipment | null;
  equippedArmor: Equipment | null;
  equippedAccessories: Equipment[];
  /** 武器上装备的魂 */
  weaponSoul: Equipment | null;
  /** 防具上装备的魂 */
  armorSoul: Equipment | null;
  /** 已解锁的饰品栏位数 (默认3, 最大12) */
  maxAccessorySlots: number;
  /** 属性点 */
  stPt: number;
  /** 角色ID (0-15) */
  heroId: number;
}

export type GameScene = 'title' | 'world' | 'battle' | 'gameover';

export type BattleStatus = 'idle' | 'fighting' | 'paused';

export interface BattleResult {
  victory: boolean;
  goldReward: number;
  expReward: number;
  dropItem?: Equipment;
  battlePointsChange?: number;
}

export interface BattleState {
  enemy: Enemy | null;
  status: BattleStatus;
  battleLog: string[];
  comboCount: number;
  comboRate: number;
  critRate: number;
  hpRate: number;
  dropRate: number;
  dropItemName: string;
  turn: 'player' | 'enemy';
  turnCount: number;
  recoverNextTurn: boolean;
  recoverUsed: boolean;
  playerAnimation: 'idle' | 'attack' | 'hurt';
  enemyAnimation: 'idle' | 'attack' | 'hurt';
  dropType: number;
  dropIndex: number;
  isDropSuccess: boolean;
  goldMultiplier: number;
  battleResult: BattleResult | null;
  _ending: boolean;
  damageDisplay: number | null;
  isCrit: boolean;
  isCombo: boolean;
  lastAttacker: 'player' | 'enemy' | null;
  // Internal loop state (persisted across pause/resume)
  _loopTurn: number;
  _loopMode: number;
  _loopTick: number;
  _loopComboCount: number;
}

// 奖励类型
export interface MapBonus {
  /** 奖励类型 0-8 */
  bonusType: number;
  /** 剩余次数 */
  remainingCount: number;
}

export interface BonusState {
  /** 新增按钮剩余使用次数 */
  addUsesLeft: number;
  /** 清除按钮剩余使用次数 */
  clearUsesLeft: number;
  /** 当前地图的奖励 */
  currentBonus: MapBonus | null;
}

export interface GameState {
  player: Player;
  inventory: InventoryItem[];
  skills: Skill[];
  enemies: Enemy[];
  equipment: Equipment[];
  currentScene: GameScene;
  encounterRate: number;
  battle: BattleState;
  battlePoints: number;
  maxBattlePoints: number;
  playTimes: number;
  Highlv: number;
  HighCombo: number;
  HighDamage: number;
  winbattle: number;
  losebattle: number;
  newgamecount: number;
  gameovercount: number;
  kyarakutalv: number;
  hardmodeUnlock: number;
  hellmodeUnlock: number;
  playerid: number;
  DropRate: number;
  speedNum: number;
  dropNum: number;
  presetNum: number;
  bonus: BonusState;
  /** 当前所在地图编号 (1-10) */
  currentMap: number;
}

export interface DamageResult {
  damage: number;
  isCritical: boolean;
}