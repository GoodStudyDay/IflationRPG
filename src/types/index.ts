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
  /** 被动效果（属性型饰品） */
  passive?: boolean;
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
  weaponSoulId: string | null;
  armorSoulId: string | null;
  createdAt: number;
  unlocked: boolean;
  slotIndex: number;
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
  /** 已解锁的饰品栏位索引数组 */
  unlockedAccessorySlots?: boolean[];
  /** 属性点 */
  stPt: number;
  /** 已分配的属性点记录 */
  stPtAllocate: { hp: number; atk: number; def: number; agi: number; luc: number };
  /** 角色ID (0-15) */
  heroId: number;
  /** 等级平方值 (lvC2) */
  lvC2: number;
  /** 击杀敌人总数 */
  killCount: number;
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
  /** 每次连击递增，用于强制 React 重新挂载 combo 显示动画 */
  comboDisplayKey: number;
  comboRate: number;
  critRate: number;
  /** 基础连击率（battlevar 计算值，不含 HP 奖励，0-1） */
  baseComboRate: number;
  /** 基础暴击率（battlevar 计算值，不含 HP 奖励，0-1） */
  baseCritRate: number;
  missrate: number;
  isMiss: boolean;
  missPosition: "player" | "enemy" | null;
  /** Boss 类型 ID，普通敌人为 -1 */
  bossType: number;
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
  /** 经验倍率（含 hourGlass 加成与 expbairitu，gdata.txt battlevar.txt#L202-213） */
  expMultiplier: number;
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
  /** 攻击计数（用于恶魔之魂效果） */
  attackCount: number;
  /** 受击计数（用于闪光沙漏DEF加成，每次受到敌人攻击+1） */
  hitCount: number;
  /** 恢复费用部分支付标记 */
  _recvCost?: boolean;
  /** 触发战斗的特殊 bonus 类型 (12=i, 13=iii, etc) */
  specialBonusType: number | null;
  /** 当前播放的战斗特效 */
  activeEffect: { effectId: number; position: 'player' | 'enemy' } | null;
  /** 复活剩余次数（resCount=0表示无复活能力） */
  resCount: number;
  /** 复活后属性倍率 */
  resStatUP: number;
  /** 火焰秘钥效果开启 */
  fireSecretKeyOn: boolean;
  /** 秘钥效果开启 (20%概率扣敌人5%HP) */
  secretKeyOn: boolean;
  /** 闪光沙漏1效果开启 */
  sandHourglassOn: boolean;
  /** 圣树之叶效果开启 */
  healOnAttackOn: boolean;
  /** 战神之刃效果开启 */
  warGodBladeOn: boolean;
  /** 反射之镜效果 */
  reflection: number;
  /** 反射回复效果开启 */
  refHealOn: boolean;
  /** 闪光沙漏效果开启 */
  hourgclassOn: boolean;
  /** 闪光沙漏1效果开启 */
  hourgclassOn1: boolean;
  /** Sanctuary's Blessing 强制闪避回合数（t1=314） */
  missrateOn: number;
  /** 已过敌人回合计数（用于missrateOn判断） */
  _missTurnCount: number;
  /** 连击伤害倍率（暴风之力/四神之力效果） */
  renzoDamageUP: number;
  /** 是否触发双倍攻击（玄武技能） */
  isDoubleAttack: boolean;
  /** 朱雀第二阶段HP */
  eneHP2: number;
  /** 朱雀第二阶段最大HP */
  eneHPM2: number;
  /** 朱雀第二阶段攻击 */
  eneATK2: number;
  /** 朱雀恢复后的攻击 */
  teneATK: number;
  /** 阶段计数器 */
  patternCount: number;
  /** 回合计数器（用于朱雀阶段转换） */
  suzakuTurnCount: number;
  /** 玄武双倍攻击计数 */
  eneDouble: number;
  /** 技能冷却计数器 */
  eneSkill: number;
  /** 白虎伤害减少比率 */
  eneDamageReduced: number;
  /** 黄龙追加攻击计数器 */
  eneCounter: number;
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
