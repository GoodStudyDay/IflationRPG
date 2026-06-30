export interface DropSlot {
  itemType: number;
  itemIndex: number;
  baseRate: number;
}

export interface DropResult {
  getItemType: number;
  getItemIndex: number;
  getItemDropType: number;
  getItemDropIndex: number;
  getItemDropRate: number;
  getItemName: string;
  isDropSuccess: boolean;
}

export interface DropManagerState {
  getItemType: number;
  getItemIndex: number;
  getDropRate: number;
  getItemName: string;
  getItemDropType: number;
  getItemDropIndex: number;
  getItemDropRate: number;
}

export interface GameSettings {
  donyokuOn: boolean;
  goyokuOn: boolean;
  twilightON: boolean;
  hardmode: number;
  dropBoost: number;
}

export interface GameSaveSettings {
  dropNum: number;
  Highlv: number;
}
