import type { Enemy } from '@/types';
import { oneExpTableFunc } from '@/utils/expTable';
import { getEnemyImageUrl } from './enemyImageMap';

/**
 * 地图信息
 * 基于 map_data.csv 原始数据
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

/**
 * StageLvData: 地图等级数据
 * StageLvData[map-1][lv][0] = 基础等级
 * 基于 Stagemapvar.txt
 */
const StageLvData: number[][][] = [
  [[1, 50, 50], [25, 50, 72], [72, 50, 86], [172, 80, 46], [300, 20, 35], [710, 60, 20]],
  [[90, 50, 15], [132, 50, 35], [176, 70, 60], [192, 20, 50], [244, 72, 85], [315, 36, 70]],
  [[220, 28, 50], [300, 35, 26], [380, 35, 74], [777, 80, 20], [1222, 64, 40], [1333, 64, 60], [2222, 80, 85]],
  [[300, 80, 50], [470, 70, 20], [630, 60, 80], [810, 40, 44], [1000, 16, 20]],
  [[750, 50, 75], [830, 20, 75], [950, 80, 75], [1200, 20, 30], [1350, 80, 30], [2000, 50, 40], [2300, 50, 20]],
  [[2400, 55, 76], [2610, 15, 80], [2690, 80, 75], [2910, 28, 55], [3150, 68, 48], [3400, 48, 52], [4110, 16, 28], [4170, 80, 28], [5000, 48, 28], [5200, 48, 8]],
  [[7000, 55, 76], [6540, 15, 80], [6460, 80, 75], [5870, 28, 55], [5720, 68, 48], [5500, 48, 52], [5400, 16, 28], [5400, 80, 28], [5300, 48, 28], [5200, 48, 8]],
  [[7480, 48, 10], [7630, 48, 50], [8330, 78, 30], [8370, 22, 30], [8880, 48, 72], [9800, 48, 84], [10000, 48, 94]],
  [[10100, 25, 20], [10430, 75, 20], [10670, 25, 40], [10750, 75, 40], [10840, 25, 70], [11111, 77, 68], [12000, 77, 85], [12222, 47, 50]],
  [[10500, 10, 45], [11600, 28, 55], [12400, 50, 45], [13333, 75, 55]],
];

/**
 * 计算怪物经验值
 * 基于 battlevar.txt 中的 eneLoad 函数逻辑
 */
const calculateExpReward = (mapId: number, lv: number, tekiseiLvBai: number, expBonus: number): number => {
  if (tekiseiLvBai === -2) {
    return expBonus;
  }
  
  const stageLvData = StageLvData[mapId - 1] || StageLvData[0];
  const levelData = stageLvData[lv] || stageLvData[0];
  const baseLevel = levelData[0];
  
  const baseExp = oneExpTableFunc(baseLevel);
  const exp = baseExp * tekiseiLvBai * (1 + expBonus / 50);
  
  return Math.floor(exp);
};

const MAP_ENEMIES_RAW: Record<number, any[]> = {
  1: [
    { id:'m1-0', name:'史莱姆', hp:140, maxHp:140, attack:13, defense:0, expReward:250, goldReward:200, icon:'🟢', lv:0, tekiseiLvBai:-2, expBonus:250, drops:[{type:2, index:4, rate:0.1},{type:2, index:8, rate:0.1},{type:2, index:0, rate:0.1}] },
    { id:'m1-1', name:'小巨鼠', hp:140, maxHp:140, attack:13, defense:0, expReward:250, goldReward:200, icon:'🐀', lv:0, tekiseiLvBai:-2, expBonus:250, drops:[] },
    { id:'m1-2', name:'绿色史莱姆', hp:140, maxHp:140, attack:13, defense:0, expReward:250, goldReward:200, icon:'🐝', lv:0, tekiseiLvBai:-2, expBonus:250, drops:[{type:2, index:12, rate:0.1},{type:2, index:16, rate:0.1}] },
    { id:'m1-3', name:'草蛇', hp:140, maxHp:140, attack:13, defense:0, expReward:250, goldReward:200, icon:'🐍', lv:0, tekiseiLvBai:-2, expBonus:250, drops:[] },
    { id:'m1-4', name:'黑暗鸦', hp:140, maxHp:140, attack:13, defense:0, expReward:250, goldReward:200, icon:'🐦‍⬛', lv:0, tekiseiLvBai:-2, expBonus:250, drops:[{type:0, index:1, rate:0.16}] },
    { id:'m1-5', name:'妖狐', hp:500, maxHp:500, attack:58, defense:0, expReward:0, goldReward:350, icon:'🦊', lv:1, tekiseiLvBai:44, expBonus:0, drops:[] },
    { id:'m1-6', name:'棕熊', hp:500, maxHp:500, attack:58, defense:0, expReward:0, goldReward:700, icon:'🐻', lv:1, tekiseiLvBai:44, expBonus:0, drops:[{type:2, index:4, rate:0.1},{type:2, index:8, rate:0.1},{type:2, index:0, rate:0.1}] },
    { id:'m1-7', name:'灰狼', hp:500, maxHp:500, attack:58, defense:0, expReward:0, goldReward:350, icon:'🐺', lv:1, tekiseiLvBai:44, expBonus:0, drops:[] },
    { id:'m1-8', name:'小鬼', hp:500, maxHp:500, attack:61, defense:0, expReward:1, goldReward:350, icon:'👹', lv:1, tekiseiLvBai:44, expBonus:1, drops:[] },
    { id:'m1-9', name:'小巨魔', hp:1600, maxHp:1600, attack:110, defense:0, expReward:2, goldReward:400, icon:'🧌', lv:2, tekiseiLvBai:40, expBonus:2, drops:[{type:0, index:5, rate:0.08}] },
    { id:'m1-10', name:'史莱姆', hp:1600, maxHp:1600, attack:100, defense:0, expReward:0, goldReward:400, icon:'🕷️', lv:2, tekiseiLvBai:40, expBonus:0, drops:[] },
    { id:'m1-11', name:'小巨鼠', hp:1750, maxHp:1750, attack:105, defense:0, expReward:3, goldReward:400, icon:'🐛', lv:2, tekiseiLvBai:40, expBonus:3, drops:[{type:0, index:1, rate:0.16}] },
    { id:'m1-12', name:'绿色史莱姆', hp:1600, maxHp:1600, attack:105, defense:0, expReward:1, goldReward:400, icon:'🦗', lv:2, tekiseiLvBai:40, expBonus:1, drops:[] },
    { id:'m1-13', name:'草蛇', hp:5200, maxHp:5200, attack:240, defense:0, expReward:2, goldReward:500, icon:'🌸', lv:3, tekiseiLvBai:40, expBonus:2, drops:[{type:0, index:2, rate:0.12},{type:0, index:75, rate:0.1}] },
    { id:'m1-14', name:'黑暗鸦', hp:5500, maxHp:5500, attack:190, defense:0, expReward:0, goldReward:500, icon:'🐗', lv:3, tekiseiLvBai:40, expBonus:0, drops:[{type:2, index:4, rate:0.17},{type:2, index:8, rate:0.17},{type:2, index:0, rate:0.16}] },
    { id:'m1-15', name:'妖狐', hp:5500, maxHp:5500, attack:190, defense:0, expReward:0, goldReward:500, icon:'🪱', lv:3, tekiseiLvBai:40, expBonus:0, drops:[] },
    { id:'m1-16', name:'棕熊', hp:5800, maxHp:5800, attack:190, defense:0, expReward:1, goldReward:500, icon:'🦇', lv:3, tekiseiLvBai:40, expBonus:1, drops:[] },
    { id:'m1-17', name:'灰狼', hp:5300, maxHp:5300, attack:200, defense:0, expReward:1, goldReward:500, icon:'🗿', lv:3, tekiseiLvBai:40, expBonus:1, drops:[] },
    { id:'m1-18', name:'小鬼', hp:10500, maxHp:10500, attack:420, defense:0, expReward:0, goldReward:600, icon:'🌿', lv:4, tekiseiLvBai:28, expBonus:0, drops:[{type:2, index:12, rate:0.17},{type:2, index:16, rate:0.16}] },
    { id:'m1-19', name:'小巨魔', hp:11000, maxHp:11000, attack:380, defense:0, expReward:0, goldReward:600, icon:'🌺', lv:4, tekiseiLvBai:28, expBonus:0, drops:[] },
    { id:'m1-20', name:'史莱姆', hp:10500, maxHp:10500, attack:480, defense:0, expReward:5, goldReward:600, icon:'💀', lv:4, tekiseiLvBai:28, expBonus:5, drops:[{type:0, index:2, rate:0.12},{type:0, index:75, rate:0.1}] },
    { id:'m1-21', name:'小巨鼠', hp:12500, maxHp:12500, attack:380, defense:0, expReward:2, goldReward:600, icon:'⚔️', lv:4, tekiseiLvBai:28, expBonus:2, drops:[] },
    { id:'m1-22', name:'绿色史莱姆', hp:11000, maxHp:11000, attack:380, defense:0, expReward:0, goldReward:600, icon:'🛡️', lv:4, tekiseiLvBai:28, expBonus:0, drops:[] },
    { id:'m1-23', name:'草蛇', hp:30000, maxHp:30000, attack:1080, defense:0, expReward:1, goldReward:1000, icon:'😈', lv:5, tekiseiLvBai:34, expBonus:1, drops:[{type:0, index:2, rate:0.17},{type:0, index:75, rate:0.12}] },
    { id:'m1-24', name:'黑暗鸦', hp:33000, maxHp:33000, attack:920, defense:0, expReward:0, goldReward:900, icon:'🐉', lv:5, tekiseiLvBai:34, expBonus:0, drops:[{type:1, index:1, rate:0.15},{type:1, index:2, rate:0.1}] },
    { id:'m1-25', name:'妖狐', hp:29400, maxHp:29400, attack:980, defense:0, expReward:0, goldReward:900, icon:'🐲', lv:5, tekiseiLvBai:34, expBonus:0, drops:[] },
    { id:'m1-26', name:'棕熊', hp:28800, maxHp:28800, attack:1250, defense:0, expReward:1, goldReward:1000, icon:'👑', lv:5, tekiseiLvBai:34, expBonus:1, drops:[] },
  ],
  2: [
    { id:'m2-0', name:'森林蜘蛛', hp:2600, maxHp:2600, attack:175, defense:0, expReward:1, goldReward:400, icon:'🟢', lv:0, tekiseiLvBai:40, expBonus:1, drops:[] },
    { id:'m2-1', name:'毒毛虫', hp:2600, maxHp:2600, attack:170, defense:0, expReward:0, goldReward:400, icon:'🐀', lv:0, tekiseiLvBai:40, expBonus:0, drops:[] },
    { id:'m2-2', name:'螳螂', hp:2600, maxHp:2600, attack:170, defense:0, expReward:0, goldReward:400, icon:'🐝', lv:0, tekiseiLvBai:40, expBonus:0, drops:[] },
    { id:'m2-3', name:'食人花', hp:2650, maxHp:2650, attack:170, defense:0, expReward:1, goldReward:400, icon:'🐍', lv:0, tekiseiLvBai:40, expBonus:1, drops:[] },
    { id:'m2-4', name:'野猪', hp:3600, maxHp:3600, attack:230, defense:0, expReward:0, goldReward:450, icon:'🐦‍⬛', lv:1, tekiseiLvBai:40, expBonus:0, drops:[] },
    { id:'m2-5', name:'巨型蜈蚣', hp:3600, maxHp:3600, attack:230, defense:0, expReward:0, goldReward:400, icon:'🦊', lv:1, tekiseiLvBai:40, expBonus:0, drops:[] },
    { id:'m2-6', name:'洞穴蝙蝠', hp:3600, maxHp:3600, attack:230, defense:0, expReward:0, goldReward:350, icon:'🐻', lv:1, tekiseiLvBai:40, expBonus:0, drops:[] },
    { id:'m2-7', name:'金巨鼠', hp:3600, maxHp:3600, attack:220, defense:0, expReward:0, goldReward:450, icon:'🐺', lv:1, tekiseiLvBai:40, expBonus:0, drops:[] },
    { id:'m2-8', name:'石像鬼', hp:3600, maxHp:3600, attack:240, defense:0, expReward:1, goldReward:400, icon:'👹', lv:1, tekiseiLvBai:40, expBonus:1, drops:[] },
    { id:'m2-9', name:'巨魔像', hp:6300, maxHp:6300, attack:270, defense:0, expReward:1, goldReward:450, icon:'🧌', lv:2, tekiseiLvBai:45, expBonus:1, drops:[{type:0, index:2, rate:0.12},{type:0, index:75, rate:0.08}] },
    { id:'m2-10', name:'食人藤', hp:6800, maxHp:6800, attack:250, defense:0, expReward:0, goldReward:450, icon:'🕷️', lv:2, tekiseiLvBai:45, expBonus:0, drops:[] },
    { id:'m2-11', name:'巨型食人花', hp:6300, maxHp:6300, attack:250, defense:0, expReward:0, goldReward:450, icon:'🐛', lv:2, tekiseiLvBai:45, expBonus:0, drops:[] },
    { id:'m2-12', name:'森林蜘蛛', hp:6700, maxHp:6700, attack:240, defense:0, expReward:0, goldReward:450, icon:'🦗', lv:2, tekiseiLvBai:45, expBonus:0, drops:[{type:1, index:1, rate:0.15}] },
    { id:'m2-13', name:'毒毛虫', hp:6100, maxHp:6100, attack:300, defense:0, expReward:3, goldReward:450, icon:'🌸', lv:2, tekiseiLvBai:45, expBonus:3, drops:[{type:0, index:5, rate:0.05}] },
    { id:'m2-14', name:'螳螂', hp:8000, maxHp:8000, attack:300, defense:0, expReward:1, goldReward:800, icon:'🐗', lv:3, tekiseiLvBai:54, expBonus:1, drops:[] },
    { id:'m2-15', name:'食人花', hp:7700, maxHp:7700, attack:320, defense:0, expReward:1, goldReward:500, icon:'🪱', lv:3, tekiseiLvBai:54, expBonus:1, drops:[] },
    { id:'m2-16', name:'野猪', hp:7700, maxHp:7700, attack:300, defense:0, expReward:-1, goldReward:5000, icon:'🦇', lv:3, tekiseiLvBai:54, expBonus:-1, drops:[] },
    { id:'m2-17', name:'巨型蜈蚣', hp:8400, maxHp:8400, attack:290, defense:0, expReward:1, goldReward:1500, icon:'🗿', lv:3, tekiseiLvBai:54, expBonus:1, drops:[] },
    { id:'m2-18', name:'洞穴蝙蝠', hp:7700, maxHp:7700, attack:320, defense:0, expReward:1, goldReward:500, icon:'🌿', lv:3, tekiseiLvBai:54, expBonus:1, drops:[{type:1, index:1, rate:0.16}] },
    { id:'m2-19', name:'金巨鼠', hp:11000, maxHp:11000, attack:390, defense:0, expReward:0, goldReward:500, icon:'🌺', lv:4, tekiseiLvBai:57, expBonus:0, drops:[] },
    { id:'m2-20', name:'石像鬼', hp:11000, maxHp:11000, attack:390, defense:0, expReward:0, goldReward:500, icon:'💀', lv:4, tekiseiLvBai:57, expBonus:0, drops:[] },
    { id:'m2-21', name:'巨魔像', hp:11000, maxHp:11000, attack:370, defense:0, expReward:-1, goldReward:800, icon:'⚔️', lv:4, tekiseiLvBai:57, expBonus:-1, drops:[] },
    { id:'m2-22', name:'食人藤', hp:13000, maxHp:13000, attack:370, defense:0, expReward:1, goldReward:1600, icon:'🛡️', lv:4, tekiseiLvBai:57, expBonus:1, drops:[] },
    { id:'m2-23', name:'巨型食人花', hp:13800, maxHp:13800, attack:510, defense:0, expReward:1, goldReward:1200, icon:'😈', lv:5, tekiseiLvBai:78, expBonus:1, drops:[] },
    { id:'m2-24', name:'森林蜘蛛', hp:14800, maxHp:14800, attack:520, defense:0, expReward:2, goldReward:1800, icon:'🐉', lv:5, tekiseiLvBai:78, expBonus:2, drops:[] },
    { id:'m2-25', name:'毒毛虫', hp:13200, maxHp:13200, attack:530, defense:0, expReward:2, goldReward:600, icon:'🐲', lv:5, tekiseiLvBai:78, expBonus:2, drops:[] },
    { id:'m2-26', name:'螳螂', hp:13500, maxHp:13500, attack:530, defense:0, expReward:1, goldReward:600, icon:'👑', lv:5, tekiseiLvBai:78, expBonus:1, drops:[] },
    { id:'m2-27', name:'食人花', hp:15800, maxHp:15800, attack:510, defense:0, expReward:0, goldReward:600, icon:'🦅', lv:5, tekiseiLvBai:78, expBonus:0, drops:[{type:1, index:2, rate:0.12}] },
  ],
  3: [
    { id:'m3-0', name:'蝙蝠怪', hp:6200, maxHp:6200, attack:370, defense:0, expReward:-1, goldReward:800, icon:'🟢', lv:0, tekiseiLvBai:32, expBonus:-1, drops:[] },
    { id:'m3-1', name:'洞穴蜘蛛', hp:6800, maxHp:6800, attack:370, defense:0, expReward:0, goldReward:1000, icon:'🐀', lv:0, tekiseiLvBai:32, expBonus:0, drops:[] },
    { id:'m3-2', name:'石像鬼', hp:6800, maxHp:6800, attack:310, defense:0, expReward:1, goldReward:1600, icon:'🐝', lv:0, tekiseiLvBai:32, expBonus:1, drops:[] },
    { id:'m3-3', name:'岩石巨人', hp:7200, maxHp:7200, attack:420, defense:0, expReward:4, goldReward:1000, icon:'🐍', lv:0, tekiseiLvBai:32, expBonus:4, drops:[] },
    { id:'m3-4', name:'骷髅兵', hp:9800, maxHp:9800, attack:440, defense:0, expReward:-1, goldReward:1200, icon:'🐦‍⬛', lv:1, tekiseiLvBai:32, expBonus:-1, drops:[] },
    { id:'m3-5', name:'剑骷髅', hp:9800, maxHp:9800, attack:460, defense:0, expReward:0, goldReward:1200, icon:'🦊', lv:1, tekiseiLvBai:32, expBonus:0, drops:[] },
    { id:'m3-6', name:'下位巫妖', hp:9800, maxHp:9800, attack:460, defense:0, expReward:0, goldReward:1200, icon:'🐻', lv:1, tekiseiLvBai:32, expBonus:0, drops:[] },
    { id:'m3-7', name:'黄金骷髅', hp:9800, maxHp:9800, attack:550, defense:0, expReward:4, goldReward:1300, icon:'🐺', lv:1, tekiseiLvBai:32, expBonus:4, drops:[] },
    { id:'m3-8', name:'巨型蠕虫', hp:9000, maxHp:9000, attack:650, defense:0, expReward:2, goldReward:1200, icon:'👹', lv:1, tekiseiLvBai:32, expBonus:2, drops:[] },
    { id:'m3-9', name:'洞穴之眼', hp:14000, maxHp:14000, attack:580, defense:0, expReward:1, goldReward:1400, icon:'🧌', lv:2, tekiseiLvBai:32, expBonus:1, drops:[] },
    { id:'m3-10', name:'暗黑幽灵', hp:14000, maxHp:14000, attack:550, defense:0, expReward:0, goldReward:1600, icon:'🕷️', lv:2, tekiseiLvBai:32, expBonus:0, drops:[] },
    { id:'m3-11', name:'岩窟之主', hp:15000, maxHp:15000, attack:550, defense:0, expReward:1, goldReward:1400, icon:'🐛', lv:2, tekiseiLvBai:32, expBonus:1, drops:[] },
    { id:'m3-12', name:'蝙蝠怪', hp:13600, maxHp:13600, attack:610, defense:0, expReward:0, goldReward:1000, icon:'🦗', lv:2, tekiseiLvBai:32, expBonus:0, drops:[] },
    { id:'m3-13', name:'洞穴蜘蛛', hp:15000, maxHp:15000, attack:750, defense:0, expReward:9, goldReward:2500, icon:'🌸', lv:2, tekiseiLvBai:32, expBonus:9, drops:[] },
    { id:'m3-14', name:'石像鬼', hp:64444, maxHp:64444, attack:1555, defense:0, expReward:20, goldReward:2000, icon:'🐗', lv:3, tekiseiLvBai:90, expBonus:20, drops:[] },
    { id:'m3-15', name:'岩石巨人', hp:44444, maxHp:44444, attack:999, defense:0, expReward:0, goldReward:4000, icon:'🪱', lv:3, tekiseiLvBai:90, expBonus:0, drops:[] },
    { id:'m3-16', name:'骷髅兵', hp:44444, maxHp:44444, attack:777, defense:0, expReward:0, goldReward:4600, icon:'🦇', lv:3, tekiseiLvBai:90, expBonus:0, drops:[{type:0, index:6, rate:0.07},{type:0, index:3, rate:0.085},{type:0, index:1, rate:0.09}] },
    { id:'m3-17', name:'剑骷髅', hp:44444, maxHp:44444, attack:777, defense:0, expReward:0, goldReward:4600, icon:'🗿', lv:3, tekiseiLvBai:90, expBonus:0, drops:[{type:1, index:3, rate:0.07},{type:1, index:2, rate:0.085},{type:1, index:1, rate:0.09}] },
    { id:'m3-18', name:'下位巫妖', hp:54444, maxHp:54444, attack:777, defense:0, expReward:1, goldReward:6000, icon:'🌿', lv:3, tekiseiLvBai:90, expBonus:1, drops:[{type:2, index:1, rate:0.08},{type:2, index:5, rate:0.09},{type:2, index:9, rate:0.1}] },
    { id:'m3-19', name:'黄金骷髅', hp:63333, maxHp:63333, attack:1360, defense:0, expReward:4, goldReward:2200, icon:'🌺', lv:4, tekiseiLvBai:90, expBonus:4, drops:[{type:0, index:6, rate:0.1}] },
    { id:'m3-20', name:'巨型蠕虫', hp:62222, maxHp:62222, attack:1111, defense:0, expReward:0, goldReward:2700, icon:'💀', lv:4, tekiseiLvBai:90, expBonus:0, drops:[] },
    { id:'m3-21', name:'洞穴之眼', hp:62222, maxHp:62222, attack:1111, defense:0, expReward:0, goldReward:2700, icon:'⚔️', lv:4, tekiseiLvBai:90, expBonus:0, drops:[] },
    { id:'m3-22', name:'暗黑幽灵', hp:64444, maxHp:64444, attack:1111, defense:0, expReward:1, goldReward:3300, icon:'🛡️', lv:4, tekiseiLvBai:90, expBonus:1, drops:[] },
    { id:'m3-23', name:'岩窟之主', hp:62222, maxHp:62222, attack:1280, defense:0, expReward:1, goldReward:2700, icon:'😈', lv:4, tekiseiLvBai:90, expBonus:1, drops:[] },
    { id:'m3-24', name:'蝙蝠怪', hp:62222, maxHp:62222, attack:1222, defense:0, expReward:0, goldReward:3000, icon:'🐉', lv:4, tekiseiLvBai:90, expBonus:0, drops:[] },
    { id:'m3-25', name:'洞穴蜘蛛', hp:71111, maxHp:71111, attack:1222, defense:0, expReward:0, goldReward:3800, icon:'🐲', lv:5, tekiseiLvBai:90, expBonus:0, drops:[] },
    { id:'m3-26', name:'石像鬼', hp:64444, maxHp:64444, attack:1333, defense:0, expReward:1, goldReward:3800, icon:'👑', lv:5, tekiseiLvBai:90, expBonus:1, drops:[{type:0, index:6, rate:0.1}] },
    { id:'m3-27', name:'岩石巨人', hp:66666, maxHp:66666, attack:1480, defense:0, expReward:3, goldReward:4200, icon:'🦅', lv:5, tekiseiLvBai:90, expBonus:3, drops:[] },
    { id:'m3-28', name:'骷髅兵', hp:64444, maxHp:64444, attack:1580, defense:0, expReward:2, goldReward:3000, icon:'🦕', lv:5, tekiseiLvBai:90, expBonus:2, drops:[{type:0, index:11, rate:0.085},{type:0, index:10, rate:0.1},null,{type:0, index:58, rate:0.06}] },
    { id:'m3-29', name:'剑骷髅', hp:64444, maxHp:64444, attack:1580, defense:0, expReward:2, goldReward:3000, icon:'🦎', lv:5, tekiseiLvBai:90, expBonus:2, drops:[{type:0, index:11, rate:0.1}] },
    { id:'m3-30', name:'下位巫妖', hp:64444, maxHp:64444, attack:1400, defense:0, expReward:2, goldReward:3000, icon:'⚡', lv:5, tekiseiLvBai:90, expBonus:2, drops:[{type:0, index:10, rate:0.085},null,null,{type:0, index:58, rate:0.07}] },
    { id:'m3-31', name:'黄金骷髅', hp:180000, maxHp:180000, attack:2777, defense:0, expReward:5, goldReward:5000, icon:'❄️', lv:6, tekiseiLvBai:50, expBonus:5, drops:[{type:0, index:13, rate:0.085},{type:2, index:5, rate:0.08},null,{type:0, index:77, rate:0.03}] },
    { id:'m3-32', name:'巨型蠕虫', hp:180000, maxHp:180000, attack:2222, defense:0, expReward:0, goldReward:7777, icon:'✨', lv:6, tekiseiLvBai:50, expBonus:0, drops:[{type:1, index:6, rate:0.075},null,null,{type:1, index:23, rate:0.035}] },
    { id:'m3-33', name:'洞穴之眼', hp:180000, maxHp:180000, attack:2222, defense:0, expReward:0, goldReward:7777, icon:'👼', lv:6, tekiseiLvBai:50, expBonus:0, drops:[{type:1, index:6, rate:0.075},null,null,{type:1, index:23, rate:0.035}] },
    { id:'m3-34', name:'暗黑幽灵', hp:200000, maxHp:200000, attack:2444, defense:0, expReward:1, goldReward:2000, icon:'🦁', lv:6, tekiseiLvBai:50, expBonus:1, drops:[{type:2, index:9, rate:0.08}] },
    { id:'m3-35', name:'岩窟之主', hp:200000, maxHp:200000, attack:2333, defense:0, expReward:1, goldReward:6000, icon:'🦄', lv:6, tekiseiLvBai:50, expBonus:1, drops:[{type:2, index:1, rate:0.08}] },
  ],
  4: [
    { id:'m4-0', name:'沼泽泥怪', hp:12000, maxHp:12000, attack:450, defense:0, expReward:1, goldReward:500, icon:'🟢', lv:0, tekiseiLvBai:52, expBonus:1, drops:[] },
    { id:'m4-1', name:'沼泽史莱姆', hp:12000, maxHp:12000, attack:400, defense:0, expReward:0, goldReward:500, icon:'🐀', lv:0, tekiseiLvBai:52, expBonus:0, drops:[] },
    { id:'m4-2', name:'巨蜥', hp:13300, maxHp:13300, attack:400, defense:0, expReward:1, goldReward:500, icon:'🐝', lv:0, tekiseiLvBai:52, expBonus:1, drops:[] },
    { id:'m4-3', name:'沼泽蛇', hp:22600, maxHp:22600, attack:620, defense:0, expReward:2, goldReward:600, icon:'🐍', lv:1, tekiseiLvBai:68, expBonus:2, drops:[] },
    { id:'m4-4', name:'沼泽多头蛇', hp:20000, maxHp:20000, attack:550, defense:0, expReward:0, goldReward:600, icon:'🐦‍⬛', lv:1, tekiseiLvBai:68, expBonus:0, drops:[] },
    { id:'m4-5', name:'食人鳄', hp:21200, maxHp:21200, attack:580, defense:0, expReward:0, goldReward:600, icon:'🦊', lv:1, tekiseiLvBai:68, expBonus:0, drops:[] },
    { id:'m4-6', name:'沼泽幽灵', hp:25000, maxHp:25000, attack:530, defense:0, expReward:0, goldReward:600, icon:'🐻', lv:1, tekiseiLvBai:68, expBonus:0, drops:[] },
    { id:'m4-7', name:'黑水之灵', hp:32000, maxHp:32000, attack:700, defense:0, expReward:0, goldReward:750, icon:'🐺', lv:2, tekiseiLvBai:82, expBonus:0, drops:[] },
    { id:'m4-8', name:'梦魇', hp:34000, maxHp:34000, attack:720, defense:0, expReward:1, goldReward:750, icon:'👹', lv:2, tekiseiLvBai:82, expBonus:1, drops:[{type:1, index:4, rate:0.08}] },
    { id:'m4-9', name:'暗影之蛇', hp:31000, maxHp:31000, attack:750, defense:0, expReward:1, goldReward:750, icon:'🧌', lv:2, tekiseiLvBai:82, expBonus:1, drops:[] },
    { id:'m4-10', name:'沼泽之王', hp:45000, maxHp:45000, attack:1100, defense:0, expReward:1, goldReward:900, icon:'🕷️', lv:3, tekiseiLvBai:85, expBonus:1, drops:[] },
    { id:'m4-11', name:'黑沼泽之主', hp:46000, maxHp:46000, attack:1000, defense:0, expReward:0, goldReward:900, icon:'🐛', lv:3, tekiseiLvBai:85, expBonus:0, drops:[] },
    { id:'m4-12', name:'沼泽泥怪', hp:46800, maxHp:46800, attack:1100, defense:0, expReward:2, goldReward:900, icon:'🦗', lv:3, tekiseiLvBai:85, expBonus:2, drops:[] },
    { id:'m4-13', name:'沼泽史莱姆', hp:49000, maxHp:49000, attack:1170, defense:0, expReward:5, goldReward:900, icon:'🌸', lv:3, tekiseiLvBai:85, expBonus:5, drops:[{type:1, index:7, rate:0.08}] },
    { id:'m4-14', name:'巨蜥', hp:72000, maxHp:72000, attack:1200, defense:0, expReward:1, goldReward:1200, icon:'🐗', lv:4, tekiseiLvBai:100, expBonus:1, drops:[] },
    { id:'m4-15', name:'沼泽蛇', hp:66000, maxHp:66000, attack:1800, defense:0, expReward:7, goldReward:1200, icon:'🪱', lv:4, tekiseiLvBai:100, expBonus:7, drops:[] },
    { id:'m4-16', name:'沼泽多头蛇', hp:64000, maxHp:64000, attack:1520, defense:0, expReward:1, goldReward:1200, icon:'🦇', lv:4, tekiseiLvBai:100, expBonus:1, drops:[{type:0, index:7, rate:0.11},null,null,{type:0, index:78, rate:0.022}] },
    { id:'m4-17', name:'食人鳄', hp:65000, maxHp:65000, attack:1300, defense:0, expReward:0, goldReward:1200, icon:'🗿', lv:4, tekiseiLvBai:100, expBonus:0, drops:[] },
  ],
  5: [
    { id:'m5-0', name:'火焰元素', hp:33000, maxHp:33000, attack:1500, defense:0, expReward:5, goldReward:1800, icon:'🟢', lv:0, tekiseiLvBai:60, expBonus:5, drops:[] },
    { id:'m5-1', name:'熔岩蝙蝠', hp:32000, maxHp:32000, attack:1240, defense:0, expReward:2, goldReward:1200, icon:'🐀', lv:0, tekiseiLvBai:60, expBonus:2, drops:[] },
    { id:'m5-2', name:'火焰蜥蜴', hp:32000, maxHp:32000, attack:1180, defense:0, expReward:0, goldReward:1200, icon:'🐝', lv:0, tekiseiLvBai:60, expBonus:0, drops:[] },
    { id:'m5-3', name:'灼热石像', hp:34000, maxHp:34000, attack:1300, defense:0, expReward:3, goldReward:1200, icon:'🐍', lv:0, tekiseiLvBai:60, expBonus:3, drops:[] },
    { id:'m5-4', name:'熔岩巨人', hp:37500, maxHp:37500, attack:1500, defense:0, expReward:0, goldReward:1400, icon:'🐦‍⬛', lv:1, tekiseiLvBai:72, expBonus:0, drops:[] },
    { id:'m5-5', name:'火山蠕虫', hp:36000, maxHp:36000, attack:1750, defense:0, expReward:4, goldReward:1400, icon:'🦊', lv:1, tekiseiLvBai:72, expBonus:4, drops:[] },
    { id:'m5-6', name:'幼年凤凰', hp:37500, maxHp:37500, attack:1500, defense:0, expReward:0, goldReward:1300, icon:'🐻', lv:1, tekiseiLvBai:72, expBonus:0, drops:[] },
    { id:'m5-7', name:'熔岩鸟', hp:34500, maxHp:34500, attack:1900, defense:0, expReward:3, goldReward:1800, icon:'🐺', lv:1, tekiseiLvBai:72, expBonus:3, drops:[] },
    { id:'m5-8', name:'幼龙', hp:39000, maxHp:39000, attack:2500, defense:0, expReward:5, goldReward:1400, icon:'👹', lv:2, tekiseiLvBai:78, expBonus:5, drops:[{type:0, index:11, rate:0.07}] },
    { id:'m5-9', name:'熔岩恶魔', hp:42500, maxHp:42500, attack:1850, defense:0, expReward:2, goldReward:1600, icon:'🧌', lv:2, tekiseiLvBai:78, expBonus:2, drops:[] },
    { id:'m5-10', name:'火焰巨龙', hp:42500, maxHp:42500, attack:1780, defense:0, expReward:0, goldReward:1400, icon:'🕷️', lv:2, tekiseiLvBai:78, expBonus:0, drops:[] },
    { id:'m5-11', name:'火山领主', hp:100000, maxHp:100000, attack:2160, defense:0, expReward:5, goldReward:2600, icon:'🐛', lv:3, tekiseiLvBai:180, expBonus:5, drops:[{type:2, index:5, rate:0.03}] },
    { id:'m5-12', name:'火焰元素', hp:56000, maxHp:56000, attack:2900, defense:0, expReward:3, goldReward:1600, icon:'🦗', lv:3, tekiseiLvBai:180, expBonus:3, drops:[] },
    { id:'m5-13', name:'熔岩蝙蝠', hp:57000, maxHp:57000, attack:2450, defense:0, expReward:0, goldReward:1600, icon:'🌸', lv:3, tekiseiLvBai:180, expBonus:0, drops:[] },
    { id:'m5-14', name:'火焰蜥蜴', hp:140000, maxHp:140000, attack:2300, defense:0, expReward:7, goldReward:2600, icon:'🐗', lv:4, tekiseiLvBai:184, expBonus:7, drops:[{type:2, index:9, rate:0.03}] },
    { id:'m5-15', name:'灼热石像', hp:63000, maxHp:63000, attack:2700, defense:0, expReward:0, goldReward:1600, icon:'🪱', lv:4, tekiseiLvBai:184, expBonus:0, drops:[] },
    { id:'m5-16', name:'熔岩巨人', hp:60000, maxHp:60000, attack:3200, defense:0, expReward:1, goldReward:1600, icon:'🦇', lv:4, tekiseiLvBai:184, expBonus:1, drops:[] },
    { id:'m5-17', name:'火山蠕虫', hp:88000, maxHp:88000, attack:3600, defense:0, expReward:-5, goldReward:1600, icon:'🗿', lv:5, tekiseiLvBai:130, expBonus:-5, drops:[] },
    { id:'m5-18', name:'幼年凤凰', hp:78000, maxHp:78000, attack:6000, defense:0, expReward:9, goldReward:1600, icon:'🌿', lv:5, tekiseiLvBai:130, expBonus:9, drops:[{type:0, index:20, rate:0.03},null,null,{type:0, index:76, rate:0.03}] },
    { id:'m5-19', name:'熔岩鸟', hp:88000, maxHp:88000, attack:4500, defense:0, expReward:4, goldReward:1600, icon:'🌺', lv:5, tekiseiLvBai:130, expBonus:4, drops:[] },
    { id:'m5-20', name:'幼龙', hp:88000, maxHp:88000, attack:3750, defense:0, expReward:0, goldReward:1600, icon:'💀', lv:5, tekiseiLvBai:130, expBonus:0, drops:[{type:1, index:7, rate:0.09}] },
    { id:'m5-21', name:'熔岩恶魔', hp:177777, maxHp:177777, attack:3400, defense:0, expReward:2, goldReward:2800, icon:'⚔️', lv:5, tekiseiLvBai:130, expBonus:2, drops:[] },
    { id:'m5-22', name:'火焰巨龙', hp:92000, maxHp:92000, attack:6800, defense:0, expReward:9, goldReward:2600, icon:'🛡️', lv:6, tekiseiLvBai:130, expBonus:9, drops:[{type:0, index:13, rate:0.12},null,null,{type:0, index:77, rate:0.05}] },
    { id:'m5-23', name:'火山领主', hp:115000, maxHp:115000, attack:4600, defense:0, expReward:1, goldReward:1800, icon:'😈', lv:6, tekiseiLvBai:130, expBonus:1, drops:[] },
    { id:'m5-24', name:'火焰元素', hp:104000, maxHp:104000, attack:4600, defense:0, expReward:0, goldReward:1800, icon:'🐉', lv:6, tekiseiLvBai:130, expBonus:0, drops:[] },
    { id:'m5-25', name:'熔岩蝙蝠', hp:104000, maxHp:104000, attack:4600, defense:0, expReward:0, goldReward:1800, icon:'🐲', lv:6, tekiseiLvBai:130, expBonus:0, drops:[] },
  ],
  6: [
    { id:'m6-0', name:'城堡守卫', hp:170000, maxHp:170000, attack:3700, defense:0, expReward:0, goldReward:2000, icon:'🟢', lv:0, tekiseiLvBai:120, expBonus:0, drops:[] },
    { id:'m6-1', name:'石像鬼', hp:146000, maxHp:146000, attack:4800, defense:0, expReward:1, goldReward:1600, icon:'🐀', lv:0, tekiseiLvBai:120, expBonus:1, drops:[] },
    { id:'m6-2', name:'吸血鬼', hp:158000, maxHp:158000, attack:3900, defense:0, expReward:2, goldReward:1600, icon:'🐝', lv:0, tekiseiLvBai:120, expBonus:2, drops:[] },
    { id:'m6-3', name:'暗黑女仆', hp:166000, maxHp:166000, attack:4250, defense:0, expReward:1, goldReward:1600, icon:'🐍', lv:1, tekiseiLvBai:120, expBonus:1, drops:[] },
    { id:'m6-4', name:'巫妖', hp:166000, maxHp:166000, attack:4000, defense:0, expReward:0, goldReward:2400, icon:'🐦‍⬛', lv:1, tekiseiLvBai:120, expBonus:0, drops:[] },
    { id:'m6-5', name:'黑暗术士', hp:166000, maxHp:166000, attack:5900, defense:0, expReward:3, goldReward:1600, icon:'🦊', lv:1, tekiseiLvBai:120, expBonus:3, drops:[] },
    { id:'m6-6', name:'暗黑骑士', hp:170000, maxHp:170000, attack:4300, defense:0, expReward:0, goldReward:2800, icon:'🐻', lv:2, tekiseiLvBai:120, expBonus:0, drops:[] },
    { id:'m6-7', name:'重甲骑士', hp:185000, maxHp:185000, attack:4300, defense:0, expReward:0, goldReward:400, icon:'🐺', lv:2, tekiseiLvBai:120, expBonus:0, drops:[] },
    { id:'m6-8', name:'小恶魔', hp:170000, maxHp:170000, attack:4600, defense:0, expReward:1, goldReward:1800, icon:'👹', lv:2, tekiseiLvBai:120, expBonus:1, drops:[] },
    { id:'m6-9', name:'地狱猎犬', hp:190000, maxHp:190000, attack:5600, defense:0, expReward:3, goldReward:1800, icon:'🧌', lv:3, tekiseiLvBai:135, expBonus:3, drops:[] },
    { id:'m6-10', name:'城堡领主', hp:190000, maxHp:190000, attack:4600, defense:0, expReward:0, goldReward:1800, icon:'🕷️', lv:3, tekiseiLvBai:135, expBonus:0, drops:[] },
    { id:'m6-11', name:'死神骑士', hp:240000, maxHp:240000, attack:4500, defense:0, expReward:2, goldReward:1800, icon:'🐛', lv:3, tekiseiLvBai:135, expBonus:2, drops:[] },
    { id:'m6-12', name:'城堡守卫', hp:198000, maxHp:198000, attack:4800, defense:0, expReward:0, goldReward:2000, icon:'🦗', lv:4, tekiseiLvBai:180, expBonus:0, drops:[] },
    { id:'m6-13', name:'石像鬼', hp:198000, maxHp:198000, attack:5800, defense:0, expReward:5, goldReward:3500, icon:'🌸', lv:4, tekiseiLvBai:180, expBonus:5, drops:[] },
    { id:'m6-14', name:'吸血鬼', hp:280000, maxHp:280000, attack:4400, defense:0, expReward:2, goldReward:1800, icon:'🐗', lv:4, tekiseiLvBai:180, expBonus:2, drops:[] },
    { id:'m6-15', name:'暗黑女仆', hp:360000, maxHp:360000, attack:5500, defense:0, expReward:3, goldReward:5000, icon:'🪱', lv:5, tekiseiLvBai:350, expBonus:3, drops:[] },
    { id:'m6-16', name:'巫妖', hp:220000, maxHp:220000, attack:5800, defense:0, expReward:0, goldReward:1800, icon:'🦇', lv:5, tekiseiLvBai:350, expBonus:0, drops:[] },
    { id:'m6-17', name:'黑暗术士', hp:220000, maxHp:220000, attack:5800, defense:0, expReward:0, goldReward:1800, icon:'🗿', lv:5, tekiseiLvBai:350, expBonus:0, drops:[] },
    { id:'m6-18', name:'暗黑骑士', hp:250000, maxHp:250000, attack:7000, defense:0, expReward:5, goldReward:1800, icon:'🌿', lv:5, tekiseiLvBai:350, expBonus:5, drops:[{type:1, index:10, rate:0.09}] },
    { id:'m6-19', name:'重甲骑士', hp:270000, maxHp:270000, attack:6300, defense:0, expReward:-9, goldReward:1000, icon:'🌺', lv:6, tekiseiLvBai:240, expBonus:-9, drops:[] },
    { id:'m6-20', name:'小恶魔', hp:240000, maxHp:240000, attack:7600, defense:0, expReward:0, goldReward:2500, icon:'💀', lv:6, tekiseiLvBai:240, expBonus:0, drops:[] },
    { id:'m6-21', name:'地狱猎犬', hp:300000, maxHp:300000, attack:6500, defense:0, expReward:3, goldReward:1800, icon:'⚔️', lv:6, tekiseiLvBai:240, expBonus:3, drops:[] },
    { id:'m6-22', name:'城堡领主', hp:280000, maxHp:280000, attack:8800, defense:0, expReward:8, goldReward:1200, icon:'🛡️', lv:7, tekiseiLvBai:240, expBonus:8, drops:[{type:0, index:22, rate:0.12}] },
    { id:'m6-23', name:'死神骑士', hp:270000, maxHp:270000, attack:6600, defense:0, expReward:0, goldReward:1200, icon:'😈', lv:7, tekiseiLvBai:240, expBonus:0, drops:[] },
    { id:'m6-24', name:'城堡守卫', hp:300000, maxHp:300000, attack:6500, defense:0, expReward:0, goldReward:1800, icon:'🐉', lv:7, tekiseiLvBai:240, expBonus:0, drops:[] },
    { id:'m6-25', name:'石像鬼', hp:340000, maxHp:340000, attack:8300, defense:0, expReward:5, goldReward:2000, icon:'🐲', lv:8, tekiseiLvBai:210, expBonus:5, drops:[] },
    { id:'m6-26', name:'吸血鬼', hp:380000, maxHp:380000, attack:9000, defense:0, expReward:8, goldReward:3000, icon:'👑', lv:8, tekiseiLvBai:210, expBonus:8, drops:[] },
    { id:'m6-27', name:'暗黑女仆', hp:340000, maxHp:340000, attack:7400, defense:0, expReward:0, goldReward:2500, icon:'🦅', lv:8, tekiseiLvBai:210, expBonus:0, drops:[] },
    { id:'m6-28', name:'巫妖', hp:460000, maxHp:460000, attack:7500, defense:0, expReward:5, goldReward:2000, icon:'🦕', lv:9, tekiseiLvBai:210, expBonus:5, drops:[] },
    { id:'m6-29', name:'黑暗术士', hp:380000, maxHp:380000, attack:9500, defense:0, expReward:5, goldReward:1800, icon:'🦎', lv:9, tekiseiLvBai:210, expBonus:5, drops:[] },
    { id:'m6-30', name:'暗黑骑士', hp:380000, maxHp:380000, attack:7800, defense:0, expReward:0, goldReward:2800, icon:'⚡', lv:9, tekiseiLvBai:210, expBonus:0, drops:[] },
  ],
  7: [
    { id:'m7-0', name:'双足飞龙', hp:490000, maxHp:490000, attack:15000, defense:0, expReward:5, goldReward:3200, icon:'🟢', lv:0, tekiseiLvBai:180, expBonus:5, drops:[] },
    { id:'m7-1', name:'翼蛇', hp:600000, maxHp:600000, attack:11500, defense:0, expReward:5, goldReward:3800, icon:'🐀', lv:0, tekiseiLvBai:180, expBonus:5, drops:[] },
    { id:'m7-2', name:'地龙', hp:440000, maxHp:440000, attack:14000, defense:0, expReward:0, goldReward:2000, icon:'🐝', lv:0, tekiseiLvBai:180, expBonus:0, drops:[] },
    { id:'m7-3', name:'岩石龙', hp:410000, maxHp:410000, attack:10600, defense:0, expReward:-3, goldReward:600, icon:'🐍', lv:1, tekiseiLvBai:180, expBonus:-3, drops:[] },
    { id:'m7-4', name:'龙人战士', hp:460000, maxHp:460000, attack:13000, defense:0, expReward:5, goldReward:3000, icon:'🐦‍⬛', lv:1, tekiseiLvBai:180, expBonus:5, drops:[] },
    { id:'m7-5', name:'龙人法师', hp:440000, maxHp:440000, attack:11000, defense:0, expReward:2, goldReward:2200, icon:'🦊', lv:1, tekiseiLvBai:180, expBonus:2, drops:[] },
    { id:'m7-6', name:'古老幼龙', hp:430000, maxHp:430000, attack:10400, defense:0, expReward:0, goldReward:3000, icon:'🐻', lv:2, tekiseiLvBai:175, expBonus:0, drops:[] },
    { id:'m7-7', name:'鹰身女妖', hp:350000, maxHp:350000, attack:12200, defense:0, expReward:4, goldReward:1500, icon:'🐺', lv:2, tekiseiLvBai:175, expBonus:4, drops:[] },
    { id:'m7-8', name:'雷龙', hp:430000, maxHp:430000, attack:11000, defense:0, expReward:5, goldReward:2200, icon:'👹', lv:2, tekiseiLvBai:175, expBonus:5, drops:[] },
    { id:'m7-9', name:'冰龙', hp:420000, maxHp:420000, attack:10000, defense:0, expReward:5, goldReward:2800, icon:'🧌', lv:3, tekiseiLvBai:190, expBonus:5, drops:[] },
    { id:'m7-10', name:'龙谷守卫者', hp:380000, maxHp:380000, attack:8500, defense:0, expReward:0, goldReward:800, icon:'🕷️', lv:3, tekiseiLvBai:190, expBonus:0, drops:[] },
    { id:'m7-11', name:'古代龙', hp:440000, maxHp:440000, attack:8500, defense:0, expReward:0, goldReward:2000, icon:'🐛', lv:3, tekiseiLvBai:190, expBonus:0, drops:[] },
    { id:'m7-12', name:'城堡守卫', hp:380000, maxHp:380000, attack:8600, defense:0, expReward:0, goldReward:1800, icon:'🦗', lv:3, tekiseiLvBai:190, expBonus:0, drops:[] },
    { id:'m7-13', name:'翼蛇', hp:370000, maxHp:370000, attack:9000, defense:0, expReward:0, goldReward:1500, icon:'🌸', lv:4, tekiseiLvBai:180, expBonus:0, drops:[] },
    { id:'m7-14', name:'地龙', hp:370000, maxHp:370000, attack:10000, defense:0, expReward:4, goldReward:2500, icon:'🐗', lv:4, tekiseiLvBai:180, expBonus:4, drops:[] },
    { id:'m7-15', name:'岩石龙', hp:440000, maxHp:440000, attack:8500, defense:0, expReward:2, goldReward:2000, icon:'🪱', lv:4, tekiseiLvBai:180, expBonus:2, drops:[] },
    { id:'m7-16', name:'巫妖', hp:370000, maxHp:370000, attack:8400, defense:0, expReward:0, goldReward:1800, icon:'🦇', lv:4, tekiseiLvBai:180, expBonus:0, drops:[] },
    { id:'m7-17', name:'龙人法师', hp:390000, maxHp:390000, attack:8600, defense:0, expReward:9, goldReward:2000, icon:'🗿', lv:4, tekiseiLvBai:180, expBonus:9, drops:[] },
    { id:'m7-18', name:'古老幼龙', hp:460000, maxHp:460000, attack:7600, defense:0, expReward:5, goldReward:7000, icon:'🌿', lv:5, tekiseiLvBai:180, expBonus:5, drops:[] },
    { id:'m7-19', name:'重甲骑士', hp:370000, maxHp:370000, attack:8500, defense:0, expReward:3, goldReward:1800, icon:'🌺', lv:5, tekiseiLvBai:180, expBonus:3, drops:[] },
    { id:'m7-20', name:'小恶魔', hp:410000, maxHp:410000, attack:9000, defense:0, expReward:3, goldReward:1800, icon:'💀', lv:5, tekiseiLvBai:180, expBonus:3, drops:[] },
    { id:'m7-21', name:'冰龙', hp:250000, maxHp:250000, attack:12000, defense:0, expReward:9, goldReward:1800, icon:'⚔️', lv:6, tekiseiLvBai:200, expBonus:9, drops:[] },
    { id:'m7-22', name:'龙谷守卫者', hp:520000, maxHp:520000, attack:7400, defense:0, expReward:5, goldReward:4000, icon:'🛡️', lv:6, tekiseiLvBai:200, expBonus:5, drops:[] },
    { id:'m7-23', name:'死神骑士', hp:300000, maxHp:300000, attack:6500, defense:0, expReward:0, goldReward:1800, icon:'😈', lv:6, tekiseiLvBai:200, expBonus:0, drops:[] },
    { id:'m7-24', name:'城堡守卫', hp:340000, maxHp:340000, attack:8000, defense:0, expReward:0, goldReward:2500, icon:'🐉', lv:7, tekiseiLvBai:200, expBonus:0, drops:[] },
    { id:'m7-25', name:'翼蛇', hp:480000, maxHp:480000, attack:7000, defense:0, expReward:9, goldReward:1200, icon:'🐲', lv:7, tekiseiLvBai:200, expBonus:9, drops:[] },
    { id:'m7-26', name:'吸血鬼', hp:300000, maxHp:300000, attack:6500, defense:0, expReward:0, goldReward:1800, icon:'👑', lv:7, tekiseiLvBai:200, expBonus:0, drops:[] },
    { id:'m7-27', name:'暗黑女仆', hp:370000, maxHp:370000, attack:8600, defense:0, expReward:0, goldReward:1200, icon:'🦅', lv:7, tekiseiLvBai:200, expBonus:0, drops:[] },
    { id:'m7-28', name:'龙人战士', hp:420000, maxHp:420000, attack:11000, defense:0, expReward:9, goldReward:1500, icon:'🦕', lv:8, tekiseiLvBai:200, expBonus:9, drops:[{type:0, index:21, rate:0.1}] },
    { id:'m7-29', name:'龙人法师', hp:440000, maxHp:440000, attack:8000, defense:0, expReward:3, goldReward:4400, icon:'🦎', lv:8, tekiseiLvBai:200, expBonus:3, drops:[] },
    { id:'m7-30', name:'暗黑骑士', hp:340000, maxHp:340000, attack:7200, defense:0, expReward:0, goldReward:2500, icon:'⚡', lv:8, tekiseiLvBai:200, expBonus:0, drops:[] },
    { id:'m7-31', name:'鹰身女妖', hp:410000, maxHp:410000, attack:8800, defense:0, expReward:9, goldReward:2000, icon:'❄️', lv:9, tekiseiLvBai:200, expBonus:9, drops:[] },
    { id:'m7-32', name:'雷龙', hp:380000, maxHp:380000, attack:8100, defense:0, expReward:4, goldReward:2000, icon:'✨', lv:9, tekiseiLvBai:200, expBonus:4, drops:[] },
    { id:'m7-33', name:'地狱猎犬', hp:380000, maxHp:380000, attack:7600, defense:0, expReward:0, goldReward:2800, icon:'👼', lv:9, tekiseiLvBai:200, expBonus:0, drops:[] },
  ],
  8: [
    { id:'m8-0', name:'圣殿之灵', hp:560000, maxHp:560000, attack:13500, defense:0, expReward:3, goldReward:2000, icon:'🟢', lv:0, tekiseiLvBai:210, expBonus:3, drops:[] },
    { id:'m8-1', name:'神殿守卫', hp:520000, maxHp:520000, attack:12000, defense:0, expReward:0, goldReward:2000, icon:'🐀', lv:0, tekiseiLvBai:210, expBonus:0, drops:[] },
    { id:'m8-2', name:'堕天使', hp:520000, maxHp:520000, attack:13000, defense:0, expReward:2, goldReward:3000, icon:'🐝', lv:0, tekiseiLvBai:210, expBonus:2, drops:[] },
    { id:'m8-3', name:'圣光骑士', hp:540000, maxHp:540000, attack:13000, defense:0, expReward:0, goldReward:3000, icon:'🐍', lv:1, tekiseiLvBai:240, expBonus:0, drops:[] },
    { id:'m8-4', name:'泰坦之魂', hp:520000, maxHp:520000, attack:13500, defense:0, expReward:2, goldReward:2000, icon:'🐦‍⬛', lv:1, tekiseiLvBai:240, expBonus:2, drops:[] },
    { id:'m8-5', name:'金袍术士', hp:520000, maxHp:520000, attack:14600, defense:0, expReward:5, goldReward:2000, icon:'🦊', lv:1, tekiseiLvBai:240, expBonus:5, drops:[] },
    { id:'m8-6', name:'狮鹫', hp:550000, maxHp:550000, attack:18000, defense:0, expReward:5, goldReward:3000, icon:'🐻', lv:2, tekiseiLvBai:210, expBonus:5, drops:[{type:0, index:19, rate:0.1},null,null,{type:0, index:88, rate:0.04}] },
    { id:'m8-7', name:'天马', hp:580000, maxHp:580000, attack:14200, defense:0, expReward:2, goldReward:2000, icon:'🐺', lv:2, tekiseiLvBai:210, expBonus:2, drops:[] },
    { id:'m8-8', name:'大天使', hp:570000, maxHp:570000, attack:13600, defense:0, expReward:0, goldReward:2000, icon:'👹', lv:2, tekiseiLvBai:210, expBonus:0, drops:[{type:1, index:8, rate:0.09}] },
    { id:'m8-9', name:'炽天使', hp:540000, maxHp:540000, attack:19000, defense:0, expReward:5, goldReward:3000, icon:'🧌', lv:3, tekiseiLvBai:210, expBonus:5, drops:[{type:0, index:18, rate:0.1}] },
    { id:'m8-10', name:'神殿之主', hp:540000, maxHp:540000, attack:15800, defense:0, expReward:0, goldReward:2000, icon:'🕷️', lv:3, tekiseiLvBai:210, expBonus:0, drops:[] },
    { id:'m8-11', name:'天界守护者', hp:560000, maxHp:560000, attack:15000, defense:0, expReward:0, goldReward:2000, icon:'🐛', lv:3, tekiseiLvBai:210, expBonus:0, drops:[{type:1, index:8, rate:0.1}] },
    { id:'m8-12', name:'圣殿之灵', hp:680000, maxHp:680000, attack:16000, defense:0, expReward:0, goldReward:2500, icon:'🦗', lv:4, tekiseiLvBai:250, expBonus:0, drops:[] },
    { id:'m8-13', name:'神殿守卫', hp:560000, maxHp:560000, attack:19000, defense:0, expReward:2, goldReward:1500, icon:'🌸', lv:4, tekiseiLvBai:250, expBonus:2, drops:[] },
    { id:'m8-14', name:'堕天使', hp:740000, maxHp:740000, attack:17500, defense:0, expReward:0, goldReward:4300, icon:'🐗', lv:5, tekiseiLvBai:185, expBonus:0, drops:[] },
    { id:'m8-15', name:'圣光骑士', hp:560000, maxHp:560000, attack:23000, defense:0, expReward:9, goldReward:1400, icon:'🪱', lv:5, tekiseiLvBai:185, expBonus:9, drops:[{type:0, index:20, rate:0.12},{type:1, index:9, rate:0.11},{type:0, index:76, rate:0.05},null,{type:1, index:33, rate:0.05}] },
    { id:'m8-16', name:'泰坦之魂', hp:980000, maxHp:980000, attack:17500, defense:0, expReward:10, goldReward:2500, icon:'🦇', lv:6, tekiseiLvBai:220, expBonus:10, drops:[{type:0, index:26, rate:0.11},{type:0, index:55, rate:0.04},{type:1, index:32, rate:0.025}] },
    { id:'m8-17', name:'金袍术士', hp:720000, maxHp:720000, attack:25000, defense:0, expReward:20, goldReward:2500, icon:'🗿', lv:6, tekiseiLvBai:220, expBonus:20, drops:[{type:0, index:27, rate:0.11},null,null,{type:1, index:32, rate:0.015}] },
    { id:'m8-18', name:'狮鹫', hp:750000, maxHp:750000, attack:18000, defense:0, expReward:0, goldReward:2500, icon:'🌿', lv:6, tekiseiLvBai:220, expBonus:0, drops:[] },
  ],
  9: [
    { id:'m9-0', name:'地狱猎犬', hp:760000, maxHp:760000, attack:17000, defense:0, expReward:0, goldReward:2000, icon:'🟢', lv:0, tekiseiLvBai:210, expBonus:0, drops:[] },
    { id:'m9-1', name:'深渊小鬼', hp:760000, maxHp:760000, attack:19000, defense:0, expReward:4, goldReward:2000, icon:'🐀', lv:0, tekiseiLvBai:210, expBonus:4, drops:[] },
    { id:'m9-2', name:'地狱骑士', hp:760000, maxHp:760000, attack:17000, defense:0, expReward:0, goldReward:2000, icon:'🐝', lv:0, tekiseiLvBai:210, expBonus:0, drops:[] },
    { id:'m9-3', name:'深渊骑士', hp:920000, maxHp:920000, attack:17500, defense:0, expReward:4, goldReward:2000, icon:'🐍', lv:1, tekiseiLvBai:210, expBonus:4, drops:[] },
    { id:'m9-4', name:'大恶魔', hp:780000, maxHp:780000, attack:17500, defense:0, expReward:0, goldReward:2000, icon:'🐦‍⬛', lv:1, tekiseiLvBai:210, expBonus:0, drops:[] },
    { id:'m9-5', name:'魅魔', hp:780000, maxHp:780000, attack:17500, defense:0, expReward:0, goldReward:2000, icon:'🦊', lv:1, tekiseiLvBai:210, expBonus:0, drops:[] },
    { id:'m9-6', name:'地狱三头犬', hp:810000, maxHp:810000, attack:18000, defense:0, expReward:0, goldReward:2000, icon:'🐻', lv:2, tekiseiLvBai:230, expBonus:0, drops:[] },
    { id:'m9-7', name:'死亡收割者', hp:800000, maxHp:800000, attack:20500, defense:0, expReward:5, goldReward:2000, icon:'🐺', lv:2, tekiseiLvBai:230, expBonus:5, drops:[] },
    { id:'m9-8', name:'深渊凝视者', hp:810000, maxHp:810000, attack:18000, defense:0, expReward:0, goldReward:2000, icon:'👹', lv:2, tekiseiLvBai:230, expBonus:0, drops:[] },
    { id:'m9-9', name:'地狱将军', hp:820000, maxHp:820000, attack:20500, defense:0, expReward:2, goldReward:2000, icon:'🧌', lv:3, tekiseiLvBai:245, expBonus:2, drops:[] },
    { id:'m9-10', name:'深渊领主', hp:830000, maxHp:830000, attack:18500, defense:0, expReward:0, goldReward:2000, icon:'🕷️', lv:3, tekiseiLvBai:245, expBonus:0, drops:[] },
    { id:'m9-11', name:'地狱之王', hp:830000, maxHp:830000, attack:18500, defense:0, expReward:0, goldReward:3000, icon:'🐛', lv:3, tekiseiLvBai:245, expBonus:0, drops:[] },
    { id:'m9-12', name:'地狱猎犬', hp:840000, maxHp:840000, attack:21500, defense:0, expReward:0, goldReward:2000, icon:'🦗', lv:4, tekiseiLvBai:250, expBonus:0, drops:[{type:0, index:15, rate:0.16}] },
    { id:'m9-13', name:'深渊小鬼', hp:840000, maxHp:840000, attack:18500, defense:0, expReward:0, goldReward:2000, icon:'🌸', lv:4, tekiseiLvBai:250, expBonus:0, drops:[] },
    { id:'m9-14', name:'地狱骑士', hp:840000, maxHp:840000, attack:21000, defense:0, expReward:1, goldReward:3000, icon:'🐗', lv:4, tekiseiLvBai:250, expBonus:1, drops:[] },
    { id:'m9-15', name:'深渊骑士', hp:880000, maxHp:880000, attack:20500, defense:0, expReward:0, goldReward:2000, icon:'🪱', lv:5, tekiseiLvBai:275, expBonus:0, drops:[] },
    { id:'m9-16', name:'大恶魔', hp:1500000, maxHp:1500000, attack:18000, defense:0, expReward:5, goldReward:6000, icon:'🦇', lv:5, tekiseiLvBai:275, expBonus:5, drops:[] },
    { id:'m9-17', name:'魅魔', hp:1000000, maxHp:1000000, attack:24500, defense:0, expReward:0, goldReward:2000, icon:'🗿', lv:6, tekiseiLvBai:320, expBonus:0, drops:[{type:0, index:17, rate:0.14}] },
    { id:'m9-18', name:'地狱三头犬', hp:1000000, maxHp:1000000, attack:22500, defense:0, expReward:1, goldReward:2000, icon:'🌿', lv:6, tekiseiLvBai:320, expBonus:1, drops:[] },
    { id:'m9-19', name:'死亡收割者', hp:1150000, maxHp:1150000, attack:21500, defense:0, expReward:0, goldReward:2000, icon:'🌺', lv:7, tekiseiLvBai:280, expBonus:0, drops:[] },
    { id:'m9-20', name:'深渊凝视者', hp:1050000, maxHp:1050000, attack:24000, defense:0, expReward:20, goldReward:2000, icon:'💀', lv:7, tekiseiLvBai:280, expBonus:20, drops:[] },
    { id:'m9-21', name:'地狱将军', hp:900000, maxHp:900000, attack:24500, defense:0, expReward:6, goldReward:2000, icon:'⚔️', lv:7, tekiseiLvBai:280, expBonus:6, drops:[] },
    { id:'m9-22', name:'深渊领主', hp:1400000, maxHp:1400000, attack:21500, defense:0, expReward:12, goldReward:2000, icon:'🛡️', lv:7, tekiseiLvBai:280, expBonus:12, drops:[] },
  ],
  10: [
    { id:'m10-0', name:'终焉使者', hp:940000, maxHp:940000, attack:18000, defense:0, expReward:8, goldReward:2200, icon:'🟢', lv:0, tekiseiLvBai:260, expBonus:8, drops:[] },
    { id:'m10-1', name:'虚空之影', hp:820000, maxHp:820000, attack:19000, defense:0, expReward:0, goldReward:2200, icon:'🐀', lv:0, tekiseiLvBai:260, expBonus:0, drops:[] },
    { id:'m10-2', name:'噬神者', hp:820000, maxHp:820000, attack:19000, defense:0, expReward:0, goldReward:2200, icon:'🐝', lv:0, tekiseiLvBai:260, expBonus:0, drops:[] },
    { id:'m10-3', name:'混沌之兽', hp:860000, maxHp:860000, attack:21000, defense:0, expReward:8, goldReward:2200, icon:'🐍', lv:0, tekiseiLvBai:260, expBonus:8, drops:[] },
    { id:'m10-4', name:'虚空之主', hp:940000, maxHp:940000, attack:23500, defense:0, expReward:4, goldReward:2200, icon:'🐦‍⬛', lv:1, tekiseiLvBai:280, expBonus:4, drops:[] },
    { id:'m10-5', name:'次元吞噬者', hp:1020000, maxHp:1020000, attack:20500, defense:0, expReward:0, goldReward:2200, icon:'🦊', lv:1, tekiseiLvBai:280, expBonus:0, drops:[] },
    { id:'m10-6', name:'毁灭者', hp:980000, maxHp:980000, attack:22000, defense:0, expReward:0, goldReward:2200, icon:'🐻', lv:1, tekiseiLvBai:280, expBonus:0, drops:[] },
    { id:'m10-7', name:'终焉之龙', hp:940000, maxHp:940000, attack:23000, defense:0, expReward:4, goldReward:2200, icon:'🐺', lv:1, tekiseiLvBai:280, expBonus:4, drops:[] },
    { id:'m10-8', name:'审判者', hp:1025000, maxHp:1025000, attack:25000, defense:0, expReward:0, goldReward:2200, icon:'👹', lv:2, tekiseiLvBai:300, expBonus:0, drops:[] },
    { id:'m10-9', name:'世界之眼', hp:1050000, maxHp:1050000, attack:28000, defense:0, expReward:5, goldReward:2200, icon:'🧌', lv:2, tekiseiLvBai:300, expBonus:5, drops:[{type:0, index:14, rate:0.14}] },
    { id:'m10-10', name:'终焉之主', hp:900000, maxHp:900000, attack:30000, defense:0, expReward:8, goldReward:2600, icon:'🕷️', lv:2, tekiseiLvBai:300, expBonus:8, drops:[] },
    { id:'m10-11', name:'万物终结者', hp:1250000, maxHp:1250000, attack:28000, defense:0, expReward:20, goldReward:2500, icon:'🐛', lv:3, tekiseiLvBai:380, expBonus:20, drops:[{type:1, index:11, rate:0.075}] },
    { id:'m10-12', name:'终焉使者', hp:1080000, maxHp:1080000, attack:32500, defense:0, expReward:0, goldReward:2500, icon:'🦗', lv:3, tekiseiLvBai:380, expBonus:0, drops:[{type:0, index:24, rate:0.086}] },
    { id:'m10-13', name:'虚空之影', hp:1150000, maxHp:1150000, attack:30000, defense:0, expReward:12, goldReward:3500, icon:'🌸', lv:3, tekiseiLvBai:380, expBonus:12, drops:[] },
  ],
  11: [
    { id:'m11-0', name:'暗影战士', hp:870000, maxHp:870000, attack:20000, defense:0, expReward:0, goldReward:2000, icon:'🟢', drops:[] },
    { id:'m11-1', name:'暗夜精灵', hp:870000, maxHp:870000, attack:20000, defense:0, expReward:0, goldReward:2500, icon:'🐀', drops:[] },
    { id:'m11-2', name:'暗影刺客', hp:870000, maxHp:870000, attack:20000, defense:0, expReward:0, goldReward:2000, icon:'🐝', drops:[] },
    { id:'m11-3', name:'暗夜法师', hp:980000, maxHp:980000, attack:22500, defense:0, expReward:4, goldReward:2500, icon:'🐍', drops:[] },
    { id:'m11-4', name:'暗影领主', hp:990000, maxHp:990000, attack:22500, defense:0, expReward:8, goldReward:2000, icon:'🐦‍⬛', drops:[] },
    { id:'m11-5', name:'暗影龙', hp:975000, maxHp:975000, attack:21000, defense:0, expReward:-4, goldReward:2500, icon:'🦊', drops:[] },
    { id:'m11-6', name:'暗影战士', hp:1300000, maxHp:1300000, attack:24500, defense:0, expReward:5, goldReward:500, icon:'🐻', drops:[] },
    { id:'m11-7', name:'暗夜精灵', hp:1130000, maxHp:1130000, attack:25000, defense:0, expReward:0, goldReward:4500, icon:'🐺', drops:[] },
    { id:'m11-8', name:'暗影刺客', hp:1220000, maxHp:1220000, attack:25000, defense:0, expReward:2, goldReward:2000, icon:'👹', drops:[] },
    { id:'m11-9', name:'暗夜法师', hp:1130000, maxHp:1130000, attack:27200, defense:0, expReward:8, goldReward:3000, icon:'🧌', drops:[] },
    { id:'m11-10', name:'暗影领主', hp:1350000, maxHp:1350000, attack:28000, defense:0, expReward:20, goldReward:2000, icon:'🕷️', drops:[] },
    { id:'m11-11', name:'暗影龙', hp:1250000, maxHp:1250000, attack:27000, defense:0, expReward:6, goldReward:2000, icon:'🐛', drops:[] },
    { id:'m11-12', name:'暗影战士', hp:1400000, maxHp:1400000, attack:26000, defense:0, expReward:14, goldReward:2000, icon:'🦗', drops:[] },
    { id:'m11-13', name:'暗夜精灵', hp:1150000, maxHp:1150000, attack:27500, defense:0, expReward:4, goldReward:2200, icon:'🌸', drops:[] },
    { id:'m11-14', name:'暗影刺客', hp:1150000, maxHp:1150000, attack:26000, defense:0, expReward:0, goldReward:2200, icon:'🐗', drops:[] },
    { id:'m11-15', name:'暗夜法师', hp:1300000, maxHp:1300000, attack:26000, defense:0, expReward:8, goldReward:2200, icon:'🪱', drops:[] },
    { id:'m11-16', name:'暗影领主', hp:1200000, maxHp:1200000, attack:27500, defense:0, expReward:6, goldReward:2200, icon:'🦇', drops:[] },
    { id:'m11-17', name:'暗影龙', hp:1450000, maxHp:1450000, attack:28000, defense:0, expReward:5, goldReward:2000, icon:'🗿', drops:[] },
    { id:'m11-18', name:'暗影战士', hp:1240000, maxHp:1240000, attack:29000, defense:0, expReward:5, goldReward:2600, icon:'🌿', drops:[] },
    { id:'m11-19', name:'暗夜精灵', hp:1400000, maxHp:1400000, attack:28500, defense:0, expReward:20, goldReward:2000, icon:'🌺', drops:[] },
  ],
  12: [
    { id:'m12-0', name:'暗黑守卫', hp:1390000, maxHp:1390000, attack:33000, defense:0, expReward:2, goldReward:2400, icon:'🟢', drops:[] },
    { id:'m12-1', name:'暗黑巨人', hp:1440000, maxHp:1440000, attack:32500, defense:0, expReward:5, goldReward:2400, icon:'🐀', drops:[] },
    { id:'m12-2', name:'暗黑守卫', hp:1500000, maxHp:1500000, attack:41000, defense:0, expReward:8, goldReward:2400, icon:'🐝', drops:[] },
    { id:'m12-3', name:'暗黑巨人', hp:1600000, maxHp:1600000, attack:36000, defense:0, expReward:0, goldReward:2400, icon:'🐍', drops:[] },
    { id:'m12-4', name:'暗黑守卫', hp:1700000, maxHp:1700000, attack:36000, defense:0, expReward:8, goldReward:2400, icon:'🐦‍⬛', drops:[] },
    { id:'m12-5', name:'暗黑巨人', hp:1740000, maxHp:1740000, attack:52000, defense:0, expReward:40, goldReward:5000, icon:'🦊', drops:[] },
    { id:'m12-6', name:'暗黑守卫', hp:1680000, maxHp:1680000, attack:42000, defense:0, expReward:0, goldReward:2200, icon:'🐻', drops:[] },
    { id:'m12-7', name:'暗黑巨人', hp:1900000, maxHp:1900000, attack:40000, defense:0, expReward:6, goldReward:2200, icon:'🐺', drops:[] },
  ],
  13: [
    { id:'m13-0', name:'魔王爪牙', hp:1800000, maxHp:1800000, attack:96000, defense:0, expReward:3600000, goldReward:25000, icon:'🟢', drops:[] },
    { id:'m13-1', name:'魔王侍从', hp:2700000, maxHp:2700000, attack:72000, defense:0, expReward:3600000, goldReward:25000, icon:'🐀', drops:[] },
    { id:'m13-2', name:'魔王', hp:2000000, maxHp:2000000, attack:60000, defense:0, expReward:3600000, goldReward:25000, icon:'🐝', drops:[] },
    { id:'m13-3', name:'魔王爪牙', hp:30000000, maxHp:30000000, attack:300000, defense:0, expReward:36000000, goldReward:99999, icon:'🐍', drops:[] },
    { id:'m13-4', name:'魔王侍从', hp:40000000, maxHp:40000000, attack:240000, defense:0, expReward:36000000, goldReward:99999, icon:'🐦‍⬛', drops:[] },
    { id:'m13-5', name:'魔王', hp:25000000, maxHp:25000000, attack:200000, defense:0, expReward:36000000, goldReward:99999, icon:'🦊', drops:[] },
  ],
  14: [
    { id:'m14-0', name:'恶魔使者', hp:1200000, maxHp:1200000, attack:42000, defense:0, expReward:2000000, goldReward:10000, icon:'🟢', drops:[] },
    { id:'m14-1', name:'恶魔领主', hp:1350000, maxHp:1350000, attack:48000, defense:0, expReward:2000000, goldReward:10000, icon:'🐀', drops:[] },
    { id:'m14-2', name:'恶魔使者', hp:1200000, maxHp:1200000, attack:42000, defense:0, expReward:2000000, goldReward:10000, icon:'🐝', drops:[] },
    { id:'m14-3', name:'恶魔领主', hp:1200000, maxHp:1200000, attack:42000, defense:0, expReward:2000000, goldReward:10000, icon:'🐍', drops:[] },
    { id:'m14-4', name:'恶魔使者', hp:1200000, maxHp:1200000, attack:42000, defense:0, expReward:2000000, goldReward:10000, icon:'🐦‍⬛', drops:[] },
    { id:'m14-5', name:'恶魔领主', hp:1200000, maxHp:1200000, attack:42000, defense:0, expReward:2000000, goldReward:10000, icon:'🦊', drops:[] },
    { id:'m14-6', name:'恶魔使者', hp:1200000, maxHp:1200000, attack:54000, defense:0, expReward:2000000, goldReward:10000, icon:'🐻', drops:[] },
    { id:'m14-7', name:'恶魔领主', hp:2000000, maxHp:2000000, attack:60000, defense:0, expReward:2000000, goldReward:10000, icon:'🐺', drops:[] },
    { id:'m14-8', name:'恶魔使者', hp:15000000, maxHp:15000000, attack:170000, defense:0, expReward:20000000, goldReward:10000, icon:'👹', drops:[] },
    { id:'m14-9', name:'恶魔领主', hp:18000000, maxHp:18000000, attack:190000, defense:0, expReward:20000000, goldReward:10000, icon:'🧌', drops:[] },
    { id:'m14-10', name:'恶魔使者', hp:15000000, maxHp:15000000, attack:170000, defense:0, expReward:20000000, goldReward:10000, icon:'🕷️', drops:[] },
    { id:'m14-11', name:'恶魔领主', hp:15000000, maxHp:15000000, attack:170000, defense:0, expReward:20000000, goldReward:10000, icon:'🐛', drops:[] },
    { id:'m14-12', name:'恶魔使者', hp:15000000, maxHp:15000000, attack:170000, defense:0, expReward:20000000, goldReward:10000, icon:'🦗', drops:[] },
    { id:'m14-13', name:'恶魔领主', hp:15000000, maxHp:15000000, attack:170000, defense:0, expReward:20000000, goldReward:10000, icon:'🌸', drops:[] },
    { id:'m14-14', name:'恶魔使者', hp:15000000, maxHp:15000000, attack:190000, defense:0, expReward:20000000, goldReward:10000, icon:'🐗', drops:[] },
    { id:'m14-15', name:'恶魔领主', hp:24000000, maxHp:24000000, attack:240000, defense:0, expReward:20000000, goldReward:10000, icon:'🪱', drops:[] },
  ],
  15: [
    { id:'m15-0', name:'亡灵战士', hp:1650000, maxHp:1650000, attack:39000, defense:0, expReward:0, goldReward:2400, icon:'🟢', drops:[] },
    { id:'m15-1', name:'亡灵法师', hp:1620000, maxHp:1620000, attack:41000, defense:0, expReward:0, goldReward:2400, icon:'🐀', drops:[] },
    { id:'m15-2', name:'亡灵领主', hp:1940000, maxHp:1940000, attack:37000, defense:0, expReward:5, goldReward:2400, icon:'🐝', drops:[] },
    { id:'m15-3', name:'亡灵战士', hp:1800000, maxHp:1800000, attack:40000, defense:0, expReward:0, goldReward:3000, icon:'🐍', drops:[] },
    { id:'m15-4', name:'亡灵法师', hp:1840000, maxHp:1840000, attack:42000, defense:0, expReward:2, goldReward:4000, icon:'🐦‍⬛', drops:[] },
    { id:'m15-5', name:'亡灵领主', hp:1840000, maxHp:1840000, attack:41000, defense:0, expReward:1, goldReward:3000, icon:'🦊', drops:[] },
    { id:'m15-6', name:'亡灵战士', hp:1950000, maxHp:1950000, attack:44000, defense:0, expReward:0, goldReward:3000, icon:'🐻', drops:[] },
    { id:'m15-7', name:'亡灵法师', hp:1920000, maxHp:1920000, attack:46000, defense:0, expReward:0, goldReward:3000, icon:'🐺', drops:[] },
    { id:'m15-8', name:'亡灵领主', hp:1800000, maxHp:1800000, attack:48000, defense:0, expReward:0, goldReward:3000, icon:'👹', drops:[] },
    { id:'m15-9', name:'亡灵战士', hp:2100000, maxHp:2100000, attack:48000, defense:0, expReward:10, goldReward:3000, icon:'🧌', drops:[] },
    { id:'m15-10', name:'亡灵法师', hp:2000000, maxHp:2000000, attack:48000, defense:0, expReward:0, goldReward:7000, icon:'🕷️', drops:[] },
    { id:'m15-11', name:'亡灵领主', hp:2000000, maxHp:2000000, attack:48000, defense:0, expReward:0, goldReward:3000, icon:'🐛', drops:[] },
    { id:'m15-12', name:'亡灵战士', hp:2150000, maxHp:2150000, attack:51500, defense:0, expReward:12, goldReward:3000, icon:'🦗', drops:[] },
    { id:'m15-13', name:'亡灵法师', hp:2100000, maxHp:2100000, attack:52000, defense:0, expReward:6, goldReward:5000, icon:'🌸', drops:[] },
    { id:'m15-14', name:'亡灵领主', hp:2100000, maxHp:2100000, attack:49500, defense:0, expReward:-9, goldReward:3000, icon:'🐗', drops:[] },
  ],
};

/**
 * 将物品类型和索引转换为equipmentId
 * type: 0=武器, 1=防具, 2=饰品, 3=魂类, 4=材料
 */
const itemTypeAndIndexToEquipmentId = (type: number, index: number): string => {
  const typePrefixes = ['weapon', 'armor', 'accessory', 'soul', 'material'];
  return `${typePrefixes[type] || 'material'}-${index}`;
};

/**
 * 获取指定地图的敌人列表（固定属性）
 */
export function getMapEnemies(mapId: number): Enemy[] {
  const raw = MAP_ENEMIES_RAW[mapId] || MAP_ENEMIES_RAW[1];
  return raw.map((e: any) => {
    const expReward = e.tekiseiLvBai !== undefined 
      ? calculateExpReward(mapId, e.lv || 0, e.tekiseiLvBai, e.expBonus || 0)
      : e.expReward;
    
    const drops = (e.drops || []).map((drop: any) => {
      if (!drop) return null;
      return {
        equipmentId: itemTypeAndIndexToEquipmentId(drop.type, drop.index),
        dropRate: drop.rate,
      };
    });
    
    return {
      ...e,
      level: mapId * 5 + Math.floor(Math.random() * 5),
      hp: e.maxHp,
      maxHp: e.maxHp,
      defense: e.defense || 0,
      expReward,
      drops,
      imageUrl: getEnemyImageUrl(e.id),
    };
  });
}