import type { InventoryItem } from '@/types';
import { equipmentData } from '@/data/equipment';

export class GDataItemMana {
  public static inst: GDataItemMana | null = null;

  private ItemBUKIKazu: number[] = [];
  private ItemBOUGUKazu: number[] = [];
  private ItemAKUSEKazu: number[] = [];
  private ItemSOULKazu: number[] = [];
  private ItemMATERIALKazu: number[] = [];

  constructor() {
    GDataItemMana.inst = this;
    
    const weaponCount = equipmentData.filter(e => e.type === 'weapon').length;
    const armorCount = equipmentData.filter(e => e.type === 'armor').length;
    const accessoryCount = equipmentData.filter(e => e.type === 'accessory').length;
    const soulCount = 0;
    const materialCount = 0;

    this.ItemBUKIKazu = new Array(weaponCount).fill(0);
    this.ItemBOUGUKazu = new Array(armorCount).fill(0);
    this.ItemAKUSEKazu = new Array(accessoryCount).fill(0);
    this.ItemSOULKazu = new Array(soulCount).fill(0);
    this.ItemMATERIALKazu = new Array(materialCount).fill(0);
  }

  public NewGame_FirstInit(): void {
    this.ItemBUKIKazu.fill(0);
    this.ItemBOUGUKazu.fill(0);
    this.ItemAKUSEKazu.fill(0);
    this.ItemSOULKazu.fill(0);
    this.ItemMATERIALKazu.fill(0);
    
    if (this.ItemBUKIKazu.length > 0) this.ItemBUKIKazu[0] = 1;
    if (this.ItemBOUGUKazu.length > 0) this.ItemBOUGUKazu[0] = 1;
    
    this.AllLVUP();
  }

  public NewGame_Start2Times(inventory: InventoryItem[]): void {
    this.loadFromInventory(inventory);
    this.AllLVUP();
  }

  public EndGame(): void {
  }

  public GetItemTimes_Item(itemType: number, listNum: number): number {
    if (listNum < 0) return 0;
    
    switch (itemType) {
      case 0: return this.ItemBUKIKazu[listNum] || 0;
      case 1: return this.ItemBOUGUKazu[listNum] || 0;
      case 2: return this.ItemAKUSEKazu[listNum] || 0;
      case 3: return this.ItemSOULKazu[listNum] || 0;
      case 4: return this.ItemMATERIALKazu[listNum] || 0;
      default: return 0;
    }
  }

  public GetItemTimes(param1: number, param2: number): number {
    return this.GetItemTimes_Item(param1, param2);
  }

  public GetSumItemTimes(param1: number): number {
    let count = 0;
    let arr: number[];
    
    switch (param1) {
      case 0: arr = this.ItemBUKIKazu; break;
      case 1: arr = this.ItemBOUGUKazu; break;
      case 2: arr = this.ItemAKUSEKazu; break;
      case 3: arr = this.ItemSOULKazu; break;
      case 4: arr = this.ItemMATERIALKazu; break;
      default: return 0;
    }
    
    for (const val of arr) {
      if (val >= 1) count++;
    }
    return count;
  }

  public AddOneItemKazu(param1: number, param2: number): void {
    switch (param1) {
      case 0: this.ItemBUKIKazu[param2] = (this.ItemBUKIKazu[param2] || 0) + 1; break;
      case 1: this.ItemBOUGUKazu[param2] = (this.ItemBOUGUKazu[param2] || 0) + 1; break;
      case 2: this.ItemAKUSEKazu[param2] = (this.ItemAKUSEKazu[param2] || 0) + 1; break;
      case 3: this.ItemSOULKazu[param2] = (this.ItemSOULKazu[param2] || 0) + 1; break;
      case 4: this.ItemMATERIALKazu[param2] = (this.ItemMATERIALKazu[param2] || 0) + 1; break;
    }
    
    if (param1 <= 1) {
      this.OneLVUP(param1, param2);
    }
  }

  public AddOneItemKazu_Item(itemType: number, listNum: number): void {
    switch (itemType) {
      case 0: this.ItemBUKIKazu[listNum] = (this.ItemBUKIKazu[listNum] || 0) + 1; break;
      case 1: this.ItemBOUGUKazu[listNum] = (this.ItemBOUGUKazu[listNum] || 0) + 1; break;
      case 2: this.ItemAKUSEKazu[listNum] = (this.ItemAKUSEKazu[listNum] || 0) + 1; break;
      case 3: this.ItemSOULKazu[listNum] = (this.ItemSOULKazu[listNum] || 0) - 1; break;
      case 4: this.ItemMATERIALKazu[listNum] = (this.ItemMATERIALKazu[listNum] || 0) + 1; break;
    }
    
    if (itemType <= 1) {
      this.OneLVUP(itemType, listNum);
    }
  }

  public AllLVUP(): void {
  }

  public OneLVUP(_param1: number, _param2: number): void {
  }

  public sodataFunc_Status(param1: number, param2: object, param3: object): void {
    if (param1 === 1) {
      (param2 as any).ItemBUKIKazu = this.ItemBUKIKazu;
      (param2 as any).ItemBOUGUKazu = this.ItemBOUGUKazu;
      (param2 as any).ItemAKUSEKazu = this.ItemAKUSEKazu;
      (param2 as any).ItemSOULKazu = this.ItemSOULKazu;
      (param2 as any).ItemMATERIALKazu = this.ItemMATERIALKazu;
    } else if (param1 === 0) {
      const data = param3 as any;
      this.ItemBUKIKazu = data.ItemBUKIKazu || [];
      this.ItemBOUGUKazu = data.ItemBOUGUKazu || [];
      this.ItemAKUSEKazu = data.ItemAKUSEKazu || [];
      this.ItemSOULKazu = data.ItemSOULKazu || [];
      this.ItemMATERIALKazu = data.ItemMATERIALKazu || [];
      this.AllLVUP();
    }
  }

  public GetItemInfo(param1: number, param2: number): number {
    if (param2 < 0) return 0;
    
    if (param1 === 0) return this.ItemBUKIKazu[param2] || 0;
    if (param1 === 1) return this.ItemBOUGUKazu[param2] || 0;
    if (param1 >= 2 && param1 <= 13) return this.ItemAKUSEKazu[param2] || 0;
    if (param1 >= 14 && param1 <= 15) return this.ItemSOULKazu[param2] || 0;
    return 0;
  }

  public subtractItemTimes(param1: number, param2: number, param3: number): void {
    switch (param1) {
      case 0: this.ItemBUKIKazu[param2] = Math.max(0, (this.ItemBUKIKazu[param2] || 0) - param3); break;
      case 1: this.ItemBOUGUKazu[param2] = Math.max(0, (this.ItemBOUGUKazu[param2] || 0) - param3); break;
      case 2: this.ItemAKUSEKazu[param2] = Math.max(0, (this.ItemAKUSEKazu[param2] || 0) - param3); break;
      case 4: this.ItemMATERIALKazu[param2] = Math.max(0, (this.ItemMATERIALKazu[param2] || 0) - param3); break;
    }
    
    if (param1 <= 1) {
      this.OneLVUP(param1, param2);
    }
  }

  public GetItemTimes_slotNum(param1: number, param2: number): number {
    if (param2 < 0) return 0;
    
    if (param1 === 0) return this.ItemBUKIKazu[param2] || 0;
    if (param1 === 1) return this.ItemBOUGUKazu[param2] || 0;
    if (param1 === 2) return this.ItemAKUSEKazu[param2] || 0;
    if (param1 === 14) return this.ItemMATERIALKazu[param2] || 0;
    return 0;
  }

  public RnVja1RoaXNEYXRh(param1: number): number {
    return this.ItemMATERIALKazu[param1] || 0;
  }

  public GetItemTimes_zerocheck(param1: number, param2: number): boolean {
    if (param2 < 0) return false;
    
    switch (param1) {
      case 0: return (this.ItemBUKIKazu[param2] || 0) > 0;
      case 1: return (this.ItemBOUGUKazu[param2] || 0) > 0;
      case 2: return (this.ItemAKUSEKazu[param2] || 0) > 0;
      case 3: return (this.ItemSOULKazu[param2] || 0) > 0;
      case 4: return (this.ItemMATERIALKazu[param2] || 0) > 0;
      default: return false;
    }
  }

  private loadFromInventory(inventory: InventoryItem[]): void {
    this.ItemBUKIKazu.fill(0);
    this.ItemBOUGUKazu.fill(0);
    this.ItemAKUSEKazu.fill(0);
    
    for (const item of inventory) {
      const eq = equipmentData.find(e => e.id === item.equipmentId);
      if (!eq) continue;
      
      const eqNum = parseInt(eq.id.split('-')[1]) || 0;
      const quantity = item.quantity;
      
      switch (eq.type) {
        case 'weapon':
          if (eqNum < this.ItemBUKIKazu.length) {
            this.ItemBUKIKazu[eqNum] = quantity;
          }
          break;
        case 'armor':
          if (eqNum < this.ItemBOUGUKazu.length) {
            this.ItemBOUGUKazu[eqNum] = quantity;
          }
          break;
        case 'accessory':
          if (eqNum < this.ItemAKUSEKazu.length) {
            this.ItemAKUSEKazu[eqNum] = quantity;
          }
          break;
      }
    }
  }
}

export function GetItemTimesFromInventory(inventory: InventoryItem[], itemType: number, listNum: number): number {
  for (const item of inventory) {
    const eq = equipmentData.find(e => e.id === item.equipmentId);
    if (!eq) continue;
    
    let typeNum = 0;
    if (eq.type === 'weapon') typeNum = 0;
    else if (eq.type === 'armor') typeNum = 1;
    else if (eq.type === 'accessory') typeNum = 2;
    
    if (typeNum !== itemType) continue;
    
    const eqNum = parseInt(eq.id.split('-')[1]) || 0;
    if (eqNum === listNum) {
      return item.quantity;
    }
  }
  return 0;
}

export function GetItemTimes_zerocheck(inventory: InventoryItem[], itemType: number, listNum: number): boolean {
  return GetItemTimesFromInventory(inventory, itemType, listNum) > 0;
}