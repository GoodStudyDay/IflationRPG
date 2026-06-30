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
  hardmodeUnlock: number;
  hellmodeUnlock: number;
  hmDragonDefeat: number;
  playerid: number;
  playername: string;
  backupID: string;
  DropRate: number;
  speedNum: number;
  dropNum: number;
  presetNum: number;
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
  hardmodeUnlock: 0,
  hellmodeUnlock: 0,
  hmDragonDefeat: 0,
  playerid: 0,
  playername: '',
  backupID: '',
  DropRate: 0,
  speedNum: 0,
  dropNum: 0,
  presetNum: 0,
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
};
