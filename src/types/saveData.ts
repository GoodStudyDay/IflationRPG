import type { EquipSet } from './index';

export interface GameSaveData {
  playTimes: number;
  Highlv: number;
  HighCombo: number;
  HighDamage: number;
  winbattle: number;
  losebattle: number;
  newgamecount: number;
  gameovercount: number;
  kyarakutalv: number;
  kyarakutaKozinExp: number[];
  equipSets: EquipSet[];
  hardmodeUnlock: number;
  hellmodeUnlock: number;
  hardmode: number;
  hmDragonDefeat: number;
  playerid: number;
  playername: string;
  backupID: string;
  DropRate: number;
  speedNum: number;
  dropNum: number;
  presetNum: number;
  presets: number[][];
  autoAllocateEnabled: boolean;
  stPt: number;
  stPtAllocate: { hp: number; atk: number; def: number; agi: number; luc: number };
  apurihyouka: number;
  apurihyouka2: number;
  tweetcount: number;
  linecount: number;
  hardlefttimes: number;
  hardtime: number;
  presetHP: number;
  presetATK: number;
  presetDEF: number;
  presetAGI: number;
  presetLUK: number;
  bugCheckVersion: number;
  language: string;
}

export interface ItemCountData {
  weaponCounts: number[];
  armorCounts: number[];
  accessoryCounts: number[];
}

export const initialGameSaveData: GameSaveData = {
  playTimes: 0,
  Highlv: 0,
  HighCombo: 0,
  HighDamage: 1,
  winbattle: 0,
  losebattle: 0,
  newgamecount: 0,
  gameovercount: 0,
  kyarakutalv: 0,
  kyarakutaKozinExp: new Array(20).fill(0),
  equipSets: [],
  hardmodeUnlock: 0,
  hellmodeUnlock: 0,
  hardmode: 0,
  hmDragonDefeat: 0,
  playerid: 0,
  playername: '',
  backupID: '',
  DropRate: 0,
  speedNum: 0,
  dropNum: 0,
  presetNum: 0,
  presets: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  autoAllocateEnabled: false,
  stPt: 0,
  stPtAllocate: { hp: 0, atk: 0, def: 0, agi: 0, luc: 0 },
  apurihyouka: 0,
  apurihyouka2: 0,
  tweetcount: 0,
  linecount: 0,
  hardlefttimes: 0,
  hardtime: 0,
  presetHP: 0,
  presetATK: 0,
  presetDEF: 0,
  presetAGI: 0,
  presetLUK: 0,
  bugCheckVersion: 1,
  language: 'zh-Hans',
};
