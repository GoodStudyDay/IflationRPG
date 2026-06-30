import type { GameSaveData, ItemCountData } from '@/types/saveData';
import { initialGameSaveData } from '@/types/saveData';

const SAVE_DATA_KEY = 'inflation-rpg-savedata';
const ITEM_COUNT_KEY = 'inflation-rpg-itemcounts';

const generatePlayerId = (): number => {
  const date = new Date();
  const year = 1970 + date.getFullYear() % 3;
  let time = date.getTime();
  if (time < 0) {
    time = new Date(year, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()).getTime();
  }
  const random = Math.floor(Math.random() * 10000);
  let playerId = time * 10000 + random;
  if (playerId < 0) {
    playerId *= -1;
  }
  return playerId;
};

export const loadSaveData = (): GameSaveData => {
  try {
    const stored = localStorage.getItem(SAVE_DATA_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const merged: GameSaveData = { ...initialGameSaveData, ...data };
      
      if (data.bugCheckVersion !== initialGameSaveData.bugCheckVersion) {
        merged.HighDamage = 1;
        merged.bugCheckVersion = initialGameSaveData.bugCheckVersion;
      }
      
      if (data.playerid == null || data.playerid === 0) {
        merged.playerid = generatePlayerId();
        merged.backupID = String(merged.playerid);
        saveSaveData(merged);
      }
      
      return merged;
    }
  } catch {
    console.warn('Failed to load save data');
  }
  
  const newData: GameSaveData = { ...initialGameSaveData };
  newData.playerid = generatePlayerId();
  newData.backupID = String(newData.playerid);
  saveSaveData(newData);
  return newData;
};

export const saveSaveData = (data: GameSaveData) => {
  try {
    localStorage.setItem(SAVE_DATA_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save save data');
  }
};

export const loadItemCounts = (weaponCount: number, armorCount: number, accessoryCount: number): ItemCountData => {
  try {
    const stored = localStorage.getItem(ITEM_COUNT_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const result: ItemCountData = {
        weaponCounts: Array(weaponCount).fill(0),
        armorCounts: Array(armorCount).fill(0),
        accessoryCounts: Array(accessoryCount).fill(0),
      };
      
      if (data.weaponCounts) {
        data.weaponCounts.forEach((count: number, index: number) => {
          if (index < result.weaponCounts.length) {
            result.weaponCounts[index] = Math.min(count, 10);
          }
        });
      }
      
      if (data.armorCounts) {
        data.armorCounts.forEach((count: number, index: number) => {
          if (index < result.armorCounts.length) {
            result.armorCounts[index] = Math.min(count, 10);
          }
        });
      }
      
      if (data.accessoryCounts) {
        data.accessoryCounts.forEach((count: number, index: number) => {
          if (index < result.accessoryCounts.length) {
            result.accessoryCounts[index] = Math.min(count, 3);
          }
        });
      }
      
      return result;
    }
  } catch {
    console.warn('Failed to load item counts');
  }
  
  return {
    weaponCounts: Array(weaponCount).fill(0),
    armorCounts: Array(armorCount).fill(0),
    accessoryCounts: Array(accessoryCount).fill(0),
  };
};

export const saveItemCounts = (data: ItemCountData) => {
  try {
    localStorage.setItem(ITEM_COUNT_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save item counts');
  }
};

export const incrementPlayTimes = () => {
  const data = loadSaveData();
  data.playTimes += 1;
  saveSaveData(data);
};

export const updateHighLv = (level: number) => {
  const data = loadSaveData();
  if (level > data.Highlv) {
    data.Highlv = level;
    saveSaveData(data);
  }
};

export const updateHighCombo = (combo: number) => {
  const data = loadSaveData();
  if (combo > data.HighCombo) {
    data.HighCombo = combo;
    saveSaveData(data);
  }
};

export const updateHighDamage = (damage: number) => {
  const data = loadSaveData();
  if (damage > data.HighDamage) {
    data.HighDamage = damage;
    saveSaveData(data);
  }
};

export const incrementWinBattle = () => {
  const data = loadSaveData();
  data.winbattle += 1;
  saveSaveData(data);
};

export const incrementLoseBattle = () => {
  const data = loadSaveData();
  data.losebattle += 1;
  data.gameovercount += 1;
  saveSaveData(data);
};

export const incrementNewGameCount = () => {
  const data = loadSaveData();
  data.newgamecount += 1;
  saveSaveData(data);
};

export const incrementKyarakutaLv = () => {
  const data = loadSaveData();
  data.kyarakutalv += 1;
  saveSaveData(data);
};
