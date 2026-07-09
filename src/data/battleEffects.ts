export interface BattleEffect {
  index: number;
  name: string;
  imagePath: string;
  framesPerRow: number;
  rows: number;
  frameCount: number;
  loop: boolean;
  blendMode: 'normal' | 'add';
}

const BASE_URL = import.meta.env.BASE_URL;

export const battleEffects: BattleEffect[] = [
  {
    index: 0,
    name: 'ef_kougeki1',
    imagePath: `${BASE_URL}images/eef/257_ef_kougeki1.png`,
    framesPerRow: 9,
    rows: 1,
    frameCount: 9,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 1,
    name: 'ef_kougeki2',
    imagePath: `${BASE_URL}images/eef/258_ef_kougeki2.png`,
    framesPerRow: 9,
    rows: 1,
    frameCount: 9,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 2,
    name: 'ef_kougeki3',
    imagePath: `${BASE_URL}images/eef/259_ef_kougeki3.png`,
    framesPerRow: 9,
    rows: 1,
    frameCount: 9,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 3,
    name: 'ef_kougeki4',
    imagePath: `${BASE_URL}images/eef/260_ef_kougeki4.png`,
    framesPerRow: 9,
    rows: 1,
    frameCount: 9,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 4,
    name: 'ef_kaihuku',
    imagePath: `${BASE_URL}images/eef/256_ef_kaihuku.png`,
    framesPerRow: 12,
    rows: 1,
    frameCount: 12,
    loop: false,
    blendMode: 'add',
  },
  {
    index: 5,
    name: 'ef_Skougeki1',
    imagePath: `${BASE_URL}images/eef/250_ef_Skougeki1.png`,
    framesPerRow: 5,
    rows: 3,
    frameCount: 14,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 6,
    name: 'ef_Skougeki2',
    imagePath: `${BASE_URL}images/eef/251_ef_Skougeki2.png`,
    framesPerRow: 5,
    rows: 3,
    frameCount: 13,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 7,
    name: 'ef_Skougeki3',
    imagePath: `${BASE_URL}images/eef/252_ef_Skougeki3.png`,
    framesPerRow: 5,
    rows: 6,
    frameCount: 29,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 8,
    name: 'ef_Skougeki4',
    imagePath: `${BASE_URL}images/eef/253_ef_Skougeki4.png`,
    framesPerRow: 5,
    rows: 6,
    frameCount: 27,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 9,
    name: 'ef_Skougeki5',
    imagePath: `${BASE_URL}images/eef/254_ef_Skougeki5.png`,
    framesPerRow: 5,
    rows: 6,
    frameCount: 27,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 10,
    name: 'ef_Skougeki6',
    imagePath: `${BASE_URL}images/eef/255_ef_Skougeki6.png`,
    framesPerRow: 5,
    rows: 6,
    frameCount: 25,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 11,
    name: 'buff_Shield1',
    imagePath: `${BASE_URL}images/eef/257_ef_kougeki1.png`,
    framesPerRow: 5,
    rows: 4,
    frameCount: 19,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 12,
    name: 'buff_Condenced1',
    imagePath: `${BASE_URL}images/eef/257_ef_kougeki1.png`,
    framesPerRow: 5,
    rows: 6,
    frameCount: 3,
    loop: false,
    blendMode: 'normal',
  },
  {
    index: 13,
    name: 'ef_Enekougeki1',
    imagePath: `${BASE_URL}images/eef/249_ef_Enekougeki1.png`,
    framesPerRow: 7,
    rows: 1,
    frameCount: 7,
    loop: false,
    blendMode: 'normal',
  },
];

export const getEffectByIndex = (index: number): BattleEffect | undefined => {
  return battleEffects[index];
};

export const getEffectByName = (name: string): BattleEffect | undefined => {
  return battleEffects.find(effect => effect.name === name);
};