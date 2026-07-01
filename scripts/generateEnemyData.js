const fs = require('fs');
const path = require('path');

const MAP_ENEMY_NAMES = {
  'ene1': ['史莱姆', '小巨鼠', '绿色史莱姆', '草蛇', '黑暗鸦', '妖狐', '棕熊', '灰狼', '小鬼', '小巨魔'],
  'ene2': ['森林蜘蛛', '毒毛虫', '螳螂', '食人花', '野猪', '巨型蜈蚣', '洞穴蝙蝠', '金巨鼠', '石像鬼', '巨魔像', '食人藤', '巨型食人花'],
  'ene3': ['蝙蝠怪', '洞穴蜘蛛', '石像鬼', '岩石巨人', '骷髅兵', '剑骷髅', '下位巫妖', '黄金骷髅', '巨型蠕虫', '洞穴之眼', '暗黑幽灵', '岩窟之主'],
  'ene4': ['沼泽泥怪', '沼泽史莱姆', '巨蜥', '沼泽蛇', '沼泽多头蛇', '食人鳄', '沼泽幽灵', '黑水之灵', '梦魇', '暗影之蛇', '沼泽之王', '黑沼泽之主'],
  'ene5': ['火焰元素', '熔岩蝙蝠', '火焰蜥蜴', '灼热石像', '熔岩巨人', '火山蠕虫', '幼年凤凰', '熔岩鸟', '幼龙', '熔岩恶魔', '火焰巨龙', '火山领主'],
  'ene6': ['城堡守卫', '石像鬼', '吸血鬼', '暗黑女仆', '巫妖', '黑暗术士', '暗黑骑士', '重甲骑士', '小恶魔', '地狱猎犬', '城堡领主', '死神骑士'],
  'ene7': ['双足飞龙', '翼蛇', '地龙', '岩石龙', '龙人战士', '龙人法师', '古老幼龙', '鹰身女妖', '雷龙', '冰龙', '龙谷守卫者', '古代龙'],
  'ene8': ['圣殿之灵', '神殿守卫', '堕天使', '圣光骑士', '泰坦之魂', '金袍术士', '狮鹫', '天马', '大天使', '炽天使', '神殿之主', '天界守护者'],
  'ene9': ['地狱猎犬', '深渊小鬼', '地狱骑士', '深渊骑士', '大恶魔', '魅魔', '地狱三头犬', '死亡收割者', '深渊凝视者', '地狱将军', '深渊领主', '地狱之王'],
  'ene10': ['终焉使者', '虚空之影', '噬神者', '混沌之兽', '虚空之主', '次元吞噬者', '毁灭者', '终焉之龙', '审判者', '世界之眼', '终焉之主', '万物终结者'],
  'ene11': ['暗影战士', '暗夜精灵', '暗影刺客', '暗夜法师', '暗影领主', '暗影龙'],
  'ene12': ['暗黑守卫', '暗黑巨人'],
  'ene13': ['魔王爪牙', '魔王侍从', '魔王'],
  'ene14': ['恶魔使者', '恶魔领主'],
  'ene15': ['亡灵战士', '亡灵法师', '亡灵领主'],
  'ene17': ['神秘生物', '神秘法师', '神秘领主'],
  'ene56': ['机械战士', '机械法师', '机械领主'],
  'ene57': ['远古生物', '远古法师', '远古领主'],
  'ene58': ['深渊怪物', '深渊法师', '深渊领主'],
  'ene61': ['精英战士', '精英法师'],
  'ene62': ['精锐战士', '精锐法师'],
  'ene63': ['高级战士', '高级法师'],
  'ene64': ['超级战士', '超级法师'],
  'ene67': ['史诗战士', '史诗法师'],
  'ene68': ['传说战士', '传说法师'],
  'ene69': ['神话战士', '神话法师'],
  'ene70': ['神灵战士', '神灵法师'],
  'ene73': ['神秘战士', '神秘法师'],
  'ene94': ['终极战士', '终极法师'],
  'ene110': ['至强战士', '至强法师'],
  'ene115': ['无敌战士', '无敌法师'],
  'ene124': ['超越战士', '超越法师'],
};

const ENEMY_ICONS = ['🟢', '🐀', '🐝', '🐍', '🐦‍⬛', '🦊', '🐻', '🐺', '👹', '🧌', '🕷️', '🐛', '🦗', '🌸', '🐗', '🪱', '🦇', '🗿', '🌿', '🌺', '💀', '⚔️', '🛡️', '😈', '🐉', '🐲', '👑', '🦅', '🦕', '🦎', '⚡', '❄️', '✨', '👼', '🦁', '🦄', '😇', '🔥', '⚖️', '👁️', '🌑', '🌀', '🕳️', '💥', '🦍'];

function parseMapData(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  const mapEnemies = {};

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = values[idx]?.trim();
    });

    const mapId = parseInt(row.Map);
    if (isNaN(mapId) || mapId < 1 || mapId > 15) continue;
    
    const hp = parseFloat(row.HP);
    const atk = parseFloat(row.ATK);
    const exp = parseFloat(row.EXP);
    const gold = parseFloat(row.Gold);
    
    if (isNaN(hp) || isNaN(atk) || isNaN(exp) || isNaN(gold)) continue;
    if (row.Class?.includes('_loc')) continue;

    if (!mapEnemies[mapId]) {
      mapEnemies[mapId] = [];
    }

    const className = row.Class || 'unknown';
    const namePrefix = className.match(/ene(\d+)/)?.[1] || '1';
    const nameIndex = mapEnemies[mapId].length;
    const names = MAP_ENEMY_NAMES[`ene${namePrefix}`] || MAP_ENEMY_NAMES['ene1'];
    const name = names[nameIndex % names.length] || `${className}`;
    const icon = ENEMY_ICONS[mapEnemies[mapId].length % ENEMY_ICONS.length];

    mapEnemies[mapId].push({
      id: `m${mapId}-${mapEnemies[mapId].length}`,
      name,
      hp: Math.floor(hp),
      maxHp: Math.floor(hp),
      attack: Math.floor(atk),
      defense: 0,
      expReward: Math.floor(exp),
      goldReward: Math.floor(gold),
      icon,
      drops: [],
    });
  }

  return mapEnemies;
}

function parseBossData(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  const bosses = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = values[idx]?.trim();
    });

    const bossId = parseInt(row.Boss);
    if (isNaN(bossId)) continue;

    const hp = parseFloat(row.HP);
    const atk = parseFloat(row.ATK);
    const exp = parseFloat(row.EXP);
    const gold = parseFloat(row.Gold);
    
    if (isNaN(hp) || isNaN(atk) || isNaN(exp) || isNaN(gold)) continue;

    const className = row.Class || 'unknown';
    const bossNames = ['史莱姆王', '哥布林王', '骷髅王', '兽人王', '幼龙王', '城堡领主', '龙谷守护者', '天空守护者', '深渊领主', '终焉之王', 
                       '暗影魔王', '暗黑大帝', '魔王', '恶魔领主', '亡灵君主', '神秘主宰', '机械霸主', '远古泰坦', '深渊魔神', '精英首领',
                       '精锐统帅', '高级统领', '超级霸主', '史诗王者', '传说至尊', '神话之神', '神灵主宰', '神秘天尊', '终极至尊', '至强神皇',
                       '无敌天尊', '超越神尊'];
    const name = bossNames[bossId % bossNames.length] || `Boss ${bossId}`;
    const icon = ['👑', '💀', '🦹', '🐉', '👹', '🏰', '🐲', '☁️', '👿', '💀', '🌑', '🗡️', '😈', '🔥', '💀', '🔮', '⚙️', '🏛️', '🕳️', '⭐', '⚔️', '🛡️', '💎', '👑', '🌟', '⚡', '✨', '🌀', '🌌', '👑', '🌠', '🎖️'][bossId % 32];

    bosses.push({
      id: `boss-${bossId}`,
      name,
      bossId,
      hp: Math.floor(hp),
      maxHp: Math.floor(hp),
      attack: Math.floor(atk),
      defense: 0,
      expReward: Math.floor(exp),
      goldReward: Math.floor(gold),
      icon,
      level: bossId * 10 + 5,
      drops: [],
    });
  }

  return bosses;
}

function generateMapData(mapEnemies) {
  let output = `import type { Enemy } from '@/types';

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

const MAP_ENEMIES_RAW: Record<number, any[]> = {\n`;

  for (let mapId = 1; mapId <= 15; mapId++) {
    if (!mapEnemies[mapId] || mapEnemies[mapId].length === 0) continue;
    
    output += `  ${mapId}: [\n`;
    mapEnemies[mapId].forEach((enemy, idx) => {
      output += `    { id:'${enemy.id}', name:'${enemy.name}', hp:${enemy.hp}, maxHp:${enemy.maxHp}, attack:${enemy.attack}, defense:${enemy.defense}, expReward:${enemy.expReward}, goldReward:${enemy.goldReward}, icon:'${enemy.icon}', drops:[] },\n`;
    });
    output += `  ],\n`;
  }

  output += `};

/**
 * 获取指定地图的敌人列表（固定属性）
 */
export function getMapEnemies(mapId: number): Enemy[] {
  const raw = MAP_ENEMIES_RAW[mapId] || MAP_ENEMIES_RAW[1];
  return raw.map((e: any) => ({
    ...e,
    level: mapId * 5 + Math.floor(Math.random() * 5),
    hp: e.maxHp,
    maxHp: e.maxHp,
    defense: e.defense || 0,
    drops: e.drops || [],
  }));
}`;

  return output;
}

function generateBossData(bosses) {
  let output = `import type { Enemy } from '@/types';

export interface BossData extends Enemy {
  bossId: number;
}

export const BOSS_DATA: BossData[] = [\n`;

  bosses.forEach((boss, idx) => {
    output += `  {\n`;
    output += `    id: '${boss.id}',\n`;
    output += `    name: '${boss.name}',\n`;
    output += `    bossId: ${boss.bossId},\n`;
    output += `    hp: ${boss.hp},\n`;
    output += `    maxHp: ${boss.maxHp},\n`;
    output += `    attack: ${boss.attack},\n`;
    output += `    defense: ${boss.defense},\n`;
    output += `    expReward: ${boss.expReward},\n`;
    output += `    goldReward: ${boss.goldReward},\n`;
    output += `    icon: '${boss.icon}',\n`;
    output += `    level: ${boss.level},\n`;
    output += `    drops: [],\n`;
    output += `  }${idx < bosses.length - 1 ? ',' : ''}\n`;
  });

  output += `];

export function getBossById(bossId: number): BossData | undefined {
  return BOSS_DATA.find(boss => boss.bossId === bossId);
}

export function getAvailableBosses(): BossData[] {
  return BOSS_DATA;
}`;

  return output;
}

const mapDataPath = path.join(__dirname, '../others/map_data.csv');
const bossDataPath = path.join(__dirname, '../others/boss_data.csv');
const mapDataOutputPath = path.join(__dirname, '../src/data/mapData.ts');
const bossDataOutputPath = path.join(__dirname, '../src/data/bossData.ts');

const mapCsv = fs.readFileSync(mapDataPath, 'utf-8');
const bossCsv = fs.readFileSync(bossDataPath, 'utf-8');

const mapEnemies = parseMapData(mapCsv);
const bosses = parseBossData(bossCsv);

const mapDataContent = generateMapData(mapEnemies);
const bossDataContent = generateBossData(bosses);

fs.writeFileSync(mapDataOutputPath, mapDataContent);
fs.writeFileSync(bossDataOutputPath, bossDataContent);

console.log('Generated mapData.ts with', Object.values(mapEnemies).reduce((sum, arr) => sum + arr.length, 0), 'enemies');
console.log('Generated bossData.ts with', bosses.length, 'bosses');