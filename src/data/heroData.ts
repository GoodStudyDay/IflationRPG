export interface HeroData {
  id: number;
  name: string;
  hpBonus: number;
  atkBonus: number;
  defBonus: number;
  agiBonus: number;
  lucBonus: number;
  spriteBase: string;
}

export const heroData: HeroData[] = [
  {
    id: 0,
    name: '战士',
    hpBonus: 0,
    atkBonus: 2,
    defBonus: 0,
    agiBonus: 2,
    lucBonus: 0,
    spriteBase: 'heropng83',
  },
  {
    id: 1,
    name: '勇者',
    hpBonus: 1,
    atkBonus: 2,
    defBonus: 0,
    agiBonus: 1,
    lucBonus: 0,
    spriteBase: 'heropng55',
  },
  {
    id: 2,
    name: '游侠',
    hpBonus: 0,
    atkBonus: 2,
    defBonus: 0,
    agiBonus: 0,
    lucBonus: 1,
    spriteBase: 'heropng31',
  },
  {
    id: 3,
    name: '刺客',
    hpBonus: 0,
    atkBonus: 2,
    defBonus: 0,
    agiBonus: 0,
    lucBonus: 2,
    spriteBase: 'heropng11',
  },
  {
    id: 4,
    name: '法师',
    hpBonus: 1,
    atkBonus: 1,
    defBonus: 0,
    agiBonus: 2,
    lucBonus: 0,
    spriteBase: 'heropng103',
  },
  {
    id: 5,
    name: '神官',
    hpBonus: 2,
    atkBonus: 1,
    defBonus: 0,
    agiBonus: 1,
    lucBonus: 0,
    spriteBase: 'heropng19',
  },
  {
    id: 6,
    name: '贤者',
    hpBonus: 2,
    atkBonus: 1,
    defBonus: 0,
    agiBonus: 0,
    lucBonus: 1,
    spriteBase: 'heropng8',
  },
  {
    id: 7,
    name: '召唤师',
    hpBonus: 1,
    atkBonus: 1,
    defBonus: 0,
    agiBonus: 0,
    lucBonus: 2,
    spriteBase: 'heropng64',
  },
  {
    id: 8,
    name: '守卫',
    hpBonus: 1,
    atkBonus: 0,
    defBonus: 1,
    agiBonus: 0,
    lucBonus: 0,
    spriteBase: 'heropng69',
  },
  {
    id: 9,
    name: '骑士',
    hpBonus: 2,
    atkBonus: 0,
    defBonus: 1,
    agiBonus: 0,
    lucBonus: 0,
    spriteBase: 'heropng33',
  },
  {
    id: 10,
    name: '圣骑士',
    hpBonus: 2,
    atkBonus: 0,
    defBonus: 1,
    agiBonus: 0,
    lucBonus: 1,
    spriteBase: 'heropng110',
  },
  {
    id: 11,
    name: '暗骑士',
    hpBonus: 1,
    atkBonus: 0,
    defBonus: 1,
    agiBonus: 0,
    lucBonus: 2,
    spriteBase: 'heropng7',
  },
  {
    id: 12,
    name: '忍者',
    hpBonus: 0,
    atkBonus: 0,
    defBonus: 2,
    agiBonus: 2,
    lucBonus: 0,
    spriteBase: 'heropng30',
  },
  {
    id: 13,
    name: '武僧',
    hpBonus: 1,
    atkBonus: 0,
    defBonus: 2,
    agiBonus: 1,
    lucBonus: 0,
    spriteBase: 'heropng63',
  },
  {
    id: 14,
    name: '格斗家',
    hpBonus: 0,
    atkBonus: 0,
    defBonus: 2,
    agiBonus: 1,
    lucBonus: 1,
    spriteBase: 'heropng61',
  },
  {
    id: 15,
    name: '狂战士',
    hpBonus: 0,
    atkBonus: 0,
    defBonus: 2,
    agiBonus: 0,
    lucBonus: 2,
    spriteBase: 'heropng4',
  },
];

export const getHeroById = (id: number): HeroData | undefined => {
  return heroData.find(h => h.id === id);
};

export const getHeroSpritePath = (heroId: number, type: 'idle' | 'battle' | 'victory'): string => {
  const hero = getHeroById(heroId);
  if (!hero) return '/images/player/963_heropng83_0.png';
  
  const typeOffset = type === 'idle' ? 0 : type === 'battle' ? 1 : 2;
  const typeSuffix = type === 'idle' ? '_0' : type === 'battle' ? '_2' : '_5';
  const fileIdMap: Record<string, number> = {
    'heropng83': 963,
    'heropng55': 945,
    'heropng31': 936,
    'heropng11': 23,
    'heropng103': 957,
    'heropng19': 972,
    'heropng8': 966,
    'heropng64': 954,
    'heropng69': 978,
    'heropng33': 951,
    'heropng110': 939,
    'heropng7': 960,
    'heropng30': 975,
    'heropng63': 969,
    'heropng61': 948,
    'heropng4': 942,
  };
  
  const baseFileId = fileIdMap[hero.spriteBase] || 963;
  const fileId = baseFileId + typeOffset;
  return `/images/player/${fileId}_${hero.spriteBase}${typeSuffix}.png`;
};