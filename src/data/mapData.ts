import type { Enemy } from '@/types';

/**
 * 地图信息
 * 基于 enedata.txt 各地图数据
 */
export interface MapInfo {
  id: number;
  name: string;
  unlockLevel: number;
  description: string;
  icon: string;
}

export const MAP_LIST: MapInfo[] = [
  { id: 1,  name: '新手草原', unlockLevel: 1,   description: '适合初学者的草原地带', icon: '🌿' },
  { id: 2,  name: '初级森林', unlockLevel: 4,   description: '树木茂密的森林区域', icon: '🌲' },
  { id: 3,  name: '中级洞穴', unlockLevel: 10,  description: '黑暗的洞穴深处', icon: '🕳️' },
  { id: 4,  name: '沼泽地带', unlockLevel: 20,  description: '危险的沼泽区域', icon: '🪤' },
  { id: 5,  name: '灼热火山', unlockLevel: 35,  description: '岩浆流淌的火山地带', icon: '🌋' },
  { id: 6,  name: '暗黑城堡', unlockLevel: 60,  description: '被黑暗笼罩的古老城堡', icon: '🏰' },
  { id: 7,  name: '龙之谷',     unlockLevel: 100, description: '巨龙栖息的深谷', icon: '🐉' },
  { id: 8,  name: '天空神殿',   unlockLevel: 160, description: '悬浮于云端的古老神殿', icon: '☁️' },
  { id: 9,  name: '深渊地狱',   unlockLevel: 260, description: '无尽的深渊之中', icon: '👿' },
  { id: 10, name: '终焉之境',   unlockLevel: 400, description: '一切的终结之地', icon: '💀' },
];

const IMG = {
  slime:    '/images/enemies/slime.svg',
  goblin:   '/images/enemies/goblin.svg',
  skeleton: '/images/enemies/skeleton.svg',
  orc:      '/images/enemies/orc.svg',
  dragon:   '/images/enemies/dragon.svg',
};

/**
 * 各 Map 敌人数据（固定属性）
 *
 * eneLoad 参数顺序: (bitmap, size, HP, ATK, EXP, Gold, [Skill], [drops...])
 * 参考 enedata.txt 原始数据
 */
const MAP_ENEMIES_RAW: Record<number, any[]> = {

  // === Map 1: 新手草原 (enedata1) ===
  1: [
    // lv=0: HP=140 ATK=13 EXP=250 Gold=200
    { id:'m1-0a', name:'史莱姆',     hp:140, maxHp:140,    attack:13,  defense:0, expReward:250,  goldReward:200, icon:'🟢', imageUrl:IMG.slime, drops:[{equipmentId:'weapon-1',dropRate:0.1}] },
    { id:'m1-0b', name:'小巨鼠',     hp:140, maxHp:140,    attack:13,  defense:0, expReward:250,  goldReward:200, icon:'🐀', imageUrl:IMG.slime, drops:[{equipmentId:'consumable-1',dropRate:0.3}] },
    // lv=1: HP=500 ATK=58 EXP=0~1 Gold=350~700
    { id:'m1-1a', name:'毒蜂',       hp:500, maxHp:500,    attack:58,  defense:0, expReward:350,  goldReward:200,   icon:'🐝', imageUrl:IMG.goblin, drops:[{equipmentId:'consumable-1',dropRate:0.3}] },
    { id:'m1-1b', name:'巨蜂',       hp:500, maxHp:500,    attack:61,  defense:0, expReward:350,  goldReward:200,   icon:'🐝', imageUrl:IMG.goblin, drops:[{equipmentId:'weapon-2',dropRate:0.1}] },
    // lv=2: HP=1600~1750 ATK=100~110 EXP=0~3 Gold=400
    { id:'m1-2a', name:'绿色史莱姆', hp:1600, maxHp:1600,  attack:110, defense:0, expReward:400,  goldReward:200,   icon:'🟢', imageUrl:IMG.slime, drops:[{equipmentId:'weapon-1',dropRate:0.15}] },
    { id:'m1-2b', name:'草蛇',       hp:1750, maxHp:1750,  attack:105, defense:0, expReward:400,  goldReward:200,   icon:'🐍', imageUrl:IMG.skeleton, drops:[{equipmentId:'consumable-1',dropRate:0.3}] },
    // lv=3: HP=5200~5800 ATK=190~240 EXP=0~2 Gold=500
    { id:'m1-3a', name:'黑暗鸦',     hp:5200, maxHp:5200,  attack:240, defense:0, expReward:500,  goldReward:200,   icon:'🐦‍⬛', imageUrl:IMG.skeleton, drops:[{equipmentId:'weapon-2',dropRate:0.12}] },
    { id:'m1-3b', name:'妖狐',       hp:5500, maxHp:5500,  attack:190, defense:0, expReward:500,  goldReward:200,   icon:'🦊', imageUrl:IMG.orc, drops:[{equipmentId:'consumable-2',dropRate:0.3}] },
    // lv=4: HP=10500~12500 ATK=380~480 EXP=0~5 Gold=600
    { id:'m1-4a', name:'棕熊',       hp:10500, maxHp:10500,attack:420, defense:0, expReward:600,  goldReward:200,   icon:'🐻', imageUrl:IMG.orc, drops:[{equipmentId:'weapon-3',dropRate:0.1}] },
    { id:'m1-4b', name:'灰狼',       hp:12500, maxHp:12500,attack:380, defense:0, expReward:600,  goldReward:200,   icon:'🐺', imageUrl:IMG.goblin, drops:[{equipmentId:'armor-1',dropRate:0.15}] },
    // lv=5: HP=28800~33000 ATK=920~1250 EXP=0~1 Gold=900~1000
    { id:'m1-5a', name:'小鬼',       hp:30000, maxHp:30000,attack:1080,defense:0, expReward:1000, goldReward:200,   icon:'👹', imageUrl:IMG.orc, drops:[{equipmentId:'weapon-4',dropRate:0.08}] },
    { id:'m1-5b', name:'小巨魔',     hp:33000, maxHp:33000,attack:920, defense:0, expReward:900,  goldReward:200,   icon:'🧌', imageUrl:IMG.goblin, drops:[{equipmentId:'armor-2',dropRate:0.1}] },
  ],

  // === Map 2: 初级森林 (enedata2) ===
  2: [
    // lv=0: HP=2600~2650 ATK=170~175 EXP=0~1 Gold=400
    { id:'m2-0a', name:'森林蜘蛛',   hp:2600, maxHp:2600,  attack:175, defense:0, expReward:400,   goldReward:1,  icon:'🕷️', imageUrl:IMG.goblin, drops:[{equipmentId:'consumable-2',dropRate:0.3}] },
    { id:'m2-0b', name:'毒毛虫',     hp:2650, maxHp:2650,  attack:170, defense:0, expReward:400,   goldReward:1,  icon:'🐛', imageUrl:IMG.goblin, drops:[{equipmentId:'weapon-2',dropRate:0.12}] },
    // lv=1: HP=3600 ATK=220~240 EXP=0~1 Gold=350~450
    { id:'m2-1a', name:'螳螂',       hp:3600, maxHp:3600,  attack:230, defense:0, expReward:450,   goldReward:0,  icon:'🦗', imageUrl:IMG.orc, drops:[{equipmentId:'armor-2',dropRate:0.1}] },
    { id:'m2-1b', name:'食人花',     hp:3600, maxHp:3600,  attack:240, defense:0, expReward:400,   goldReward:1,  icon:'🌸', imageUrl:IMG.slime, drops:[{equipmentId:'weapon-3',dropRate:0.1}] },
    // lv=2: HP=6100~6800 ATK=240~300 EXP=0~3 Gold=450
    { id:'m2-2a', name:'野猪',       hp:6300, maxHp:6300,  attack:270, defense:0, expReward:450,   goldReward:1,  icon:'🐗', imageUrl:IMG.orc, drops:[{equipmentId:'armor-3',dropRate:0.1}] },
    { id:'m2-2b', name:'巨型蜈蚣',   hp:6100, maxHp:6100,  attack:300, defense:0, expReward:450,   goldReward:3,  icon:'🪱', imageUrl:IMG.skeleton, drops:[{equipmentId:'weapon-4',dropRate:0.08}] },
    // lv=3: HP=7700~8400 ATK=290~320 EXP=-1~1 Gold=500~5000
    { id:'m2-3a', name:'洞穴蝙蝠',   hp:8000, maxHp:8000,  attack:300, defense:0, expReward:800,   goldReward:1,  icon:'🦇', imageUrl:IMG.goblin, drops:[{equipmentId:'consumable-2',dropRate:0.35}] },
    { id:'m2-3b', name:'金巨鼠',     hp:7700, maxHp:7700,  attack:300, defense:0, expReward:5000,  goldReward:-1, icon:'🐀', imageUrl:IMG.slime, drops:[{equipmentId:'weapon-3',dropRate:0.15}] },
    // lv=4: HP=11000~13000 ATK=370~390 EXP=-1~1 Gold=500~1600
    { id:'m2-4a', name:'石像鬼',     hp:11000,maxHp:11000, attack:390, defense:0, expReward:500,   goldReward:0,  icon:'🗿', imageUrl:IMG.goblin, drops:[{equipmentId:'weapon-5',dropRate:0.08}] },
    { id:'m2-4b', name:'巨魔像',     hp:13000,maxHp:13000, attack:370, defense:0, expReward:1600,  goldReward:1,  icon:'🗿', imageUrl:IMG.orc, drops:[{equipmentId:'armor-4',dropRate:0.1}] },
    // lv=5: HP=13200~15800 ATK=510~530 EXP=0~2 Gold=600~1800
    { id:'m2-5a', name:'食人藤',     hp:13800,maxHp:13800, attack:510, defense:0, expReward:1200,  goldReward:1,  icon:'🌿', imageUrl:IMG.slime, drops:[{equipmentId:'weapon-6',dropRate:0.06}] },
    { id:'m2-5b', name:'巨型食人花', hp:14800,maxHp:14800, attack:520, defense:0, expReward:1800,  goldReward:2,  icon:'🌺', imageUrl:IMG.dragon, drops:[{equipmentId:'armor-5',dropRate:0.08}] },
  ],

  // === Map 3: 中级洞穴 (enedata3) ===
  3: [
    { id:'m3-0a', name:'蝙蝠怪',     hp:8000,   maxHp:8000,   attack:320,  defense:0, expReward:600,   goldReward:-1, icon:'🦇', imageUrl:IMG.goblin },
    { id:'m3-0b', name:'洞穴蜘蛛',   hp:8500,   maxHp:8500,   attack:300,  defense:0, expReward:600,   goldReward:1,  icon:'🕷️', imageUrl:IMG.goblin },
    { id:'m3-1a', name:'石像鬼',     hp:13000,  maxHp:13000,  attack:420,  defense:0, expReward:700,   goldReward:0,  icon:'🗿', imageUrl:IMG.skeleton },
    { id:'m3-1b', name:'岩石巨人',   hp:15000,  maxHp:15000,  attack:400,  defense:0, expReward:800,   goldReward:2,  icon:'🗿', imageUrl:IMG.skeleton },
    { id:'m3-2a', name:'骷髅兵',     hp:20000,  maxHp:20000,  attack:530,  defense:0, expReward:950,   goldReward:3,  icon:'💀', imageUrl:IMG.skeleton },
    { id:'m3-2b', name:'剑骷髅',     hp:26000,  maxHp:26000,  attack:560,  defense:0, expReward:1100,  goldReward:2,  icon:'💀', imageUrl:IMG.skeleton },
    { id:'m3-3a', name:'下位巫妖',   hp:22000,  maxHp:22000,  attack:700,  defense:0, expReward:1400,  goldReward:5,  icon:'🧙‍♂️', imageUrl:IMG.orc },
    { id:'m3-3b', name:'黄金骷髅',   hp:30000,  maxHp:30000,  attack:550,  defense:0, expReward:7200,  goldReward:-1, icon:'💀', imageUrl:IMG.skeleton },
    { id:'m3-4a', name:'巨型蠕虫',   hp:35000,  maxHp:35000,  attack:640,  defense:0, expReward:1300,  goldReward:6,  icon:'🪱', imageUrl:IMG.slime },
    { id:'m3-4b', name:'洞穴之眼',   hp:38000,  maxHp:38000,  attack:720,  defense:0, expReward:1600,  goldReward:3,  icon:'👁️', imageUrl:IMG.orc },
    { id:'m3-5a', name:'暗黑幽灵',   hp:48000,  maxHp:48000,  attack:870,  defense:0, expReward:2000,  goldReward:8,  icon:'👻', imageUrl:IMG.skeleton },
    { id:'m3-5b', name:'岩窟之主',   hp:55000,  maxHp:55000,  attack:920,  defense:0, expReward:2500,  goldReward:5,  icon:'👹', imageUrl:IMG.dragon },
  ],

  // === Map 4: 沼泽地带 (enedata4) ===
  4: [
    { id:'m4-0a', name:'沼泽泥怪',   hp:25000,  maxHp:25000,  attack:580,  defense:0, expReward:1000,  goldReward:1,  icon:'🟤', imageUrl:IMG.slime },
    { id:'m4-0b', name:'沼泽史莱姆', hp:25000,  maxHp:25000,  attack:560,  defense:0, expReward:1000,  goldReward:0,  icon:'🟢', imageUrl:IMG.slime },
    { id:'m4-1a', name:'巨蜥',       hp:33000,  maxHp:33000,  attack:720,  defense:0, expReward:1300,  goldReward:0,  icon:'🦎', imageUrl:IMG.dragon },
    { id:'m4-1b', name:'沼泽蛇',     hp:34000,  maxHp:34000,  attack:680,  defense:0, expReward:1100,  goldReward:2,  icon:'🐍', imageUrl:IMG.skeleton },
    { id:'m4-2a', name:'沼泽多头蛇', hp:42000,  maxHp:42000,  attack:860,  defense:0, expReward:1700,  goldReward:1,  icon:'🐍', imageUrl:IMG.dragon },
    { id:'m4-2b', name:'食人鳄',     hp:48000,  maxHp:48000,  attack:800,  defense:0, expReward:2000,  goldReward:3,  icon:'🐊', imageUrl:IMG.goblin },
    { id:'m4-3a', name:'沼泽幽灵',   hp:38000,  maxHp:38000,  attack:980,  defense:0, expReward:2300,  goldReward:4,  icon:'👻', imageUrl:IMG.skeleton },
    { id:'m4-3b', name:'黑水之灵',   hp:52000,  maxHp:52000,  attack:860,  defense:0, expReward:2800,  goldReward:2,  icon:'🖤', imageUrl:IMG.slime },
    { id:'m4-4a', name:'梦魇',       hp:62000,  maxHp:62000,  attack:1020, defense:0, expReward:3500,  goldReward:6,  icon:'🐴', imageUrl:IMG.orc },
    { id:'m4-4b', name:'暗影之蛇',   hp:65000,  maxHp:65000,  attack:950,  defense:0, expReward:3000,  goldReward:5,  icon:'🐍', imageUrl:IMG.dragon },
    { id:'m4-5a', name:'沼泽之王',   hp:78000,  maxHp:78000,  attack:1180, defense:0, expReward:4200,  goldReward:8,  icon:'👑', imageUrl:IMG.dragon },
    { id:'m4-5b', name:'黑沼泽之主', hp:85000,  maxHp:85000,  attack:1250, defense:0, expReward:5000,  goldReward:10, icon:'👺', imageUrl:IMG.orc },
  ],

  // === Map 5: 灼热火山 (enedata5) ===
  5: [
    { id:'m5-0a', name:'火焰元素',   hp:45000,  maxHp:45000,  attack:820,  defense:0, expReward:1800,  goldReward:3,  icon:'🔥', imageUrl:IMG.orc },
    { id:'m5-0b', name:'熔岩蝙蝠',   hp:48000,  maxHp:48000,  attack:790,  defense:0, expReward:2000,  goldReward:4,  icon:'🦇', imageUrl:IMG.goblin },
    { id:'m5-1a', name:'火焰蜥蜴',   hp:60000,  maxHp:60000,  attack:980,  defense:0, expReward:2500,  goldReward:2,  icon:'🦎', imageUrl:IMG.dragon },
    { id:'m5-1b', name:'灼热石像',   hp:68000,  maxHp:68000,  attack:920,  defense:0, expReward:3000,  goldReward:1,  icon:'🗿', imageUrl:IMG.skeleton },
    { id:'m5-2a', name:'熔岩巨人',   hp:82000,  maxHp:82000,  attack:1080, defense:0, expReward:3600,  goldReward:5,  icon:'🗿', imageUrl:IMG.goblin },
    { id:'m5-2b', name:'火山蠕虫',   hp:76000,  maxHp:76000,  attack:1150, defense:0, expReward:3200,  goldReward:6,  icon:'🪱', imageUrl:IMG.slime },
    { id:'m5-3a', name:'幼年凤凰',   hp:85000,  maxHp:85000,  attack:1280, defense:0, expReward:4200,  goldReward:7,  icon:'🐦', imageUrl:IMG.dragon },
    { id:'m5-3b', name:'熔岩鸟',     hp:90000,  maxHp:90000,  attack:1200, defense:0, expReward:3800,  goldReward:5,  icon:'🐦‍🔥', imageUrl:IMG.dragon },
    { id:'m5-4a', name:'幼龙',       hp:130000, maxHp:130000, attack:1420, defense:0, expReward:5000,  goldReward:8,  icon:'🐉', imageUrl:IMG.dragon },
    { id:'m5-4b', name:'熔岩恶魔',   hp:120000, maxHp:120000, attack:1500, defense:0, expReward:5500,  goldReward:9,  icon:'😈', imageUrl:IMG.orc },
    { id:'m5-5a', name:'火焰巨龙',   hp:177000, maxHp:177000, attack:1680, defense:0, expReward:7000,  goldReward:12, icon:'🐲', imageUrl:IMG.dragon },
    { id:'m5-5b', name:'火山领主',   hp:190000, maxHp:190000, attack:1600, defense:0, expReward:6500,  goldReward:14, icon:'👹', imageUrl:IMG.orc },
  ],

  // === Map 6: 暗黑城堡 (enedata6) ===
  6: [
    { id:'m6-0a', name:'城堡守卫',   hp:88000,  maxHp:88000,  attack:1100, defense:0, expReward:3800,  goldReward:5,  icon:'⚔️', imageUrl:IMG.skeleton },
    { id:'m6-0b', name:'石像鬼',     hp:92000,  maxHp:92000,  attack:1050, defense:0, expReward:3500,  goldReward:4,  icon:'🗽', imageUrl:IMG.goblin },
    { id:'m6-1a', name:'吸血鬼',     hp:146000, maxHp:146000, attack:1320, defense:0, expReward:4800,  goldReward:8,  icon:'🧛', imageUrl:IMG.skeleton },
    { id:'m6-1b', name:'暗黑女仆',   hp:140000, maxHp:140000, attack:1280, defense:0, expReward:4200,  goldReward:6,  icon:'💃', imageUrl:IMG.goblin },
    { id:'m6-2a', name:'巫妖',       hp:200000, maxHp:200000, attack:1500, defense:0, expReward:6000,  goldReward:10, icon:'🧙‍♂️', imageUrl:IMG.orc },
    { id:'m6-2b', name:'黑暗术士',   hp:180000, maxHp:180000, attack:1580, defense:0, expReward:5500,  goldReward:9,  icon:'🧙', imageUrl:IMG.orc },
    { id:'m6-3a', name:'暗黑骑士',   hp:250000, maxHp:250000, attack:1720, defense:0, expReward:7200,  goldReward:12, icon:'⚔️', imageUrl:IMG.dragon },
    { id:'m6-3b', name:'重甲骑士',   hp:280000, maxHp:280000, attack:1650, defense:0, expReward:6800,  goldReward:15, icon:'🛡️', imageUrl:IMG.dragon },
    { id:'m6-4a', name:'小恶魔',     hp:320000, maxHp:320000, attack:1880, defense:0, expReward:8200,  goldReward:18, icon:'😈', imageUrl:IMG.orc },
    { id:'m6-4b', name:'地狱猎犬',   hp:290000, maxHp:290000, attack:1950, defense:0, expReward:7800,  goldReward:14, icon:'🐕', imageUrl:IMG.goblin },
    { id:'m6-5a', name:'城堡领主',   hp:380000, maxHp:380000, attack:2100, defense:0, expReward:9500,  goldReward:20, icon:'👑', imageUrl:IMG.dragon },
    { id:'m6-5b', name:'死神骑士',   hp:420000, maxHp:420000, attack:2050, defense:0, expReward:10500, goldReward:25, icon:'💀', imageUrl:IMG.skeleton },
  ],

  // === Map 7: 龙之谷 (enedata7) ===
  7: [
    { id:'m7-0a', name:'双足飞龙',   hp:280000, maxHp:280000, attack:1800, defense:0, expReward:6500,  goldReward:12, icon:'🦅', imageUrl:IMG.dragon },
    { id:'m7-0b', name:'翼蛇',       hp:260000, maxHp:260000, attack:1750, defense:0, expReward:6200,  goldReward:10, icon:'🐍', imageUrl:IMG.dragon },
    { id:'m7-1a', name:'地龙',       hp:350000, maxHp:350000, attack:2050, defense:0, expReward:8000,  goldReward:15, icon:'🦕', imageUrl:IMG.dragon },
    { id:'m7-1b', name:'岩石龙',     hp:380000, maxHp:380000, attack:1980, defense:0, expReward:7500,  goldReward:18, icon:'🐲', imageUrl:IMG.dragon },
    { id:'m7-2a', name:'龙人战士',   hp:420000, maxHp:420000, attack:2250, defense:0, expReward:9200,  goldReward:20, icon:'🦎', imageUrl:IMG.orc },
    { id:'m7-2b', name:'龙人法师',   hp:380000, maxHp:380000, attack:2350, defense:0, expReward:8500,  goldReward:22, icon:'🦎', imageUrl:IMG.orc },
    { id:'m7-3a', name:'古老幼龙',   hp:500000, maxHp:500000, attack:2500, defense:0, expReward:11000, goldReward:25, icon:'🐲', imageUrl:IMG.dragon },
    { id:'m7-3b', name:'鹰身女妖',   hp:450000, maxHp:450000, attack:2420, defense:0, expReward:10500, goldReward:28, icon:'🦇', imageUrl:IMG.goblin },
    { id:'m7-4a', name:'雷龙',       hp:580000, maxHp:580000, attack:2680, defense:0, expReward:12800, goldReward:30, icon:'⚡', imageUrl:IMG.dragon },
    { id:'m7-4b', name:'冰龙',       hp:620000, maxHp:620000, attack:2580, defense:0, expReward:13500, goldReward:32, icon:'❄️', imageUrl:IMG.dragon },
    { id:'m7-5a', name:'龙谷守卫者', hp:720000, maxHp:720000, attack:2880, defense:0, expReward:15500, goldReward:38, icon:'🗡️', imageUrl:IMG.dragon },
    { id:'m7-5b', name:'古代龙',     hp:800000, maxHp:800000, attack:2950, defense:0, expReward:17000, goldReward:42, icon:'🐉', imageUrl:IMG.dragon },
  ],

  // === Map 8: 天空神殿 (enedata8) ===
  8: [
    { id:'m8-0a', name:'圣殿之灵',   hp:520000, maxHp:520000, attack:2800, defense:0, expReward:12000, goldReward:30, icon:'✨', imageUrl:IMG.slime },
    { id:'m8-0b', name:'神殿守卫',   hp:580000, maxHp:580000, attack:2700, defense:0, expReward:12800, goldReward:28, icon:'🗿', imageUrl:IMG.goblin },
    { id:'m8-1a', name:'堕天使',     hp:680000, maxHp:680000, attack:3050, defense:0, expReward:14200, goldReward:35, icon:'👼', imageUrl:IMG.skeleton },
    { id:'m8-1b', name:'圣光骑士',   hp:720000, maxHp:720000, attack:2950, defense:0, expReward:15000, goldReward:38, icon:'⚔️', imageUrl:IMG.dragon },
    { id:'m8-2a', name:'泰坦之魂',   hp:800000, maxHp:800000, attack:3250, defense:0, expReward:16800, goldReward:42, icon:'🗿', imageUrl:IMG.goblin },
    { id:'m8-2b', name:'金袍术士',   hp:750000, maxHp:750000, attack:3400, defense:0, expReward:18000, goldReward:45, icon:'🧙', imageUrl:IMG.orc },
    { id:'m8-3a', name:'狮鹫',       hp:900000, maxHp:900000, attack:3500, defense:0, expReward:19500, goldReward:50, icon:'🦁', imageUrl:IMG.dragon },
    { id:'m8-3b', name:'天马',       hp:850000, maxHp:850000, attack:3600, defense:0, expReward:18800, goldReward:48, icon:'🦄', imageUrl:IMG.dragon },
    { id:'m8-4a', name:'大天使',     hp:1050000, maxHp:1050000, attack:3800, defense:0, expReward:22000, goldReward:58, icon:'😇', imageUrl:IMG.orc },
    { id:'m8-4b', name:'炽天使',     hp:1200000, maxHp:1200000, attack:3700, defense:0, expReward:23500, goldReward:62, icon:'🔥', imageUrl:IMG.dragon },
    { id:'m8-5a', name:'神殿之主',   hp:1500000, maxHp:1500000, attack:4200, defense:0, expReward:28000, goldReward:75, icon:'👑', imageUrl:IMG.dragon },
    { id:'m8-5b', name:'天界守护者', hp:1700000, maxHp:1700000, attack:4100, defense:0, expReward:30000, goldReward:80, icon:'🛡️', imageUrl:IMG.skeleton },
  ],

  // === Map 9: 深渊地狱 (enedata9) ===
  9: [
    { id:'m9-0a', name:'地狱猎犬',   hp:760000, maxHp:760000,   attack:3500, defense:0, expReward:18000, goldReward:45, icon:'🐕', imageUrl:IMG.goblin },
    { id:'m9-0b', name:'深渊小鬼',   hp:800000, maxHp:800000,   attack:3400, defense:0, expReward:17500, goldReward:40, icon:'👺', imageUrl:IMG.orc },
    { id:'m9-1a', name:'地狱骑士',   hp:1050000, maxHp:1050000, attack:3900, defense:0, expReward:22000, goldReward:55, icon:'⚔️', imageUrl:IMG.dragon },
    { id:'m9-1b', name:'深渊骑士',   hp:1100000, maxHp:1100000, attack:3850, defense:0, expReward:21500, goldReward:58, icon:'🗡️', imageUrl:IMG.dragon },
    { id:'m9-2a', name:'大恶魔',     hp:1300000, maxHp:1300000, attack:4300, defense:0, expReward:26000, goldReward:68, icon:'😈', imageUrl:IMG.orc },
    { id:'m9-2b', name:'魅魔',       hp:1200000, maxHp:1200000, attack:4400, defense:0, expReward:25000, goldReward:65, icon:'💋', imageUrl:IMG.skeleton },
    { id:'m9-3a', name:'地狱三头犬', hp:1600000, maxHp:1600000, attack:4700, defense:0, expReward:31000, goldReward:80, icon:'🐕', imageUrl:IMG.goblin },
    { id:'m9-3b', name:'死亡收割者', hp:1500000, maxHp:1500000, attack:4800, defense:0, expReward:30000, goldReward:85, icon:'💀', imageUrl:IMG.skeleton },
    { id:'m9-4a', name:'深渊凝视者', hp:2000000, maxHp:2000000, attack:5100, defense:0, expReward:38000, goldReward:100, icon:'👁️', imageUrl:IMG.slime },
    { id:'m9-4b', name:'地狱将军',   hp:2200000, maxHp:2200000, attack:5000, defense:0, expReward:40000, goldReward:110, icon:'👹', imageUrl:IMG.orc },
    { id:'m9-5a', name:'深渊领主',   hp:2800000, maxHp:2800000, attack:5500, defense:0, expReward:50000, goldReward:140, icon:'👑', imageUrl:IMG.dragon },
    { id:'m9-5b', name:'地狱之王',   hp:3200000, maxHp:3200000, attack:5600, defense:0, expReward:55000, goldReward:160, icon:'😈', imageUrl:IMG.dragon },
  ],

  // === Map 10: 终焉之境 (enedata10) ===
  10: [
    { id:'m10-0a', name:'终焉使者',  hp:2100000, maxHp:2100000, attack:5800, defense:0, expReward:42000, goldReward:120, icon:'⚡', imageUrl:IMG.skeleton },
    { id:'m10-0b', name:'虚空之影',  hp:2200000, maxHp:2200000, attack:5700, defense:0, expReward:40000, goldReward:115, icon:'🌑', imageUrl:IMG.slime },
    { id:'m10-1a', name:'噬神者',    hp:2800000, maxHp:2800000, attack:6200, defense:0, expReward:50000, goldReward:150, icon:'👹', imageUrl:IMG.dragon },
    { id:'m10-1b', name:'混沌之兽',  hp:3000000, maxHp:3000000, attack:6100, defense:0, expReward:52000, goldReward:145, icon:'🦍', imageUrl:IMG.orc },
    { id:'m10-2a', name:'虚空之主',  hp:3500000, maxHp:3500000, attack:6600, defense:0, expReward:62000, goldReward:180, icon:'🌀', imageUrl:IMG.slime },
    { id:'m10-2b', name:'次元吞噬者',hp:3200000, maxHp:3200000, attack:6800, defense:0, expReward:58000, goldReward:175, icon:'🕳️', imageUrl:IMG.skeleton },
    { id:'m10-3a', name:'毁灭者',    hp:4000000, maxHp:4000000, attack:7200, defense:0, expReward:72000, goldReward:220, icon:'💥', imageUrl:IMG.orc },
    { id:'m10-3b', name:'终焉之龙',  hp:4500000, maxHp:4500000, attack:7000, defense:0, expReward:75000, goldReward:230, icon:'🐲', imageUrl:IMG.dragon },
    { id:'m10-4a', name:'审判者',    hp:5000000, maxHp:5000000, attack:7800, defense:0, expReward:88000, goldReward:280, icon:'⚖️', imageUrl:IMG.dragon },
    { id:'m10-4b', name:'世界之眼',  hp:5500000, maxHp:5500000, attack:7600, defense:0, expReward:92000, goldReward:300, icon:'👁️', imageUrl:IMG.slime },
    { id:'m10-5a', name:'终焉之主',  hp:6800000, maxHp:6800000, attack:8500, defense:0, expReward:120000, goldReward:400, icon:'👑', imageUrl:IMG.dragon },
    { id:'m10-5b', name:'万物终结者',hp:8000000, maxHp:8000000, attack:8800, defense:0, expReward:150000, goldReward:500, icon:'💀', imageUrl:IMG.dragon },
  ],
};

/**
 * 获取指定地图的敌人列表（固定属性）
 */
export function getMapEnemies(mapId: number): Enemy[] {
  const raw = MAP_ENEMIES_RAW[mapId] || MAP_ENEMIES_RAW[1];
  return raw.map((e: any, idx: number) => ({
    ...e,
    id: e.id || `map${mapId}-${idx}`,
    level: mapId * 2 + Math.floor(idx / 2),
    hp: e.maxHp ?? e.hp ?? 100,
    maxHp: e.maxHp ?? e.hp ?? 100,
    defense: e.defense ?? 0,
    drops: e.drops || [],
    goldReward: (e.goldReward ?? 0) < 0 ? 0 : (e.goldReward ?? 0),
    expReward: (e.expReward ?? 0) < 0 ? 0 : (e.expReward ?? 0),
  }));
}
