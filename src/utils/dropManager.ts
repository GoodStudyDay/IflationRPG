import type { DropSlot, DropResult, DropManagerState, GameSettings, GameSaveSettings } from '@/types/dropManager';
import { equipmentData } from '@/data/equipment';

export const getItemMaxCount = (itemType: number): number => {
  if (itemType === 2) {
    return 3;
  }
  if (itemType === 3) {
    return 2;
  }
  return 10;
};

export const equipmentIdToItemTypeAndIndex = (equipmentId: string): { itemType: number; itemIndex: number } => {
  const match = equipmentId.match(/^(\w+)-(\d+)$/);
  if (!match) {
    return { itemType: 0, itemIndex: 0 };
  }
  
  const prefix = match[1];
  const index = parseInt(match[2], 10) - 1;
  
  switch (prefix) {
    case 'weapon': return { itemType: 0, itemIndex: index };
    case 'armor': return { itemType: 1, itemIndex: index };
    case 'accessory': return { itemType: 2, itemIndex: index };
    case 'soul': return { itemType: 3, itemIndex: index };
    case 'material': return { itemType: 4, itemIndex: index };
    case 'consumable': return { itemType: 4, itemIndex: index };
    default: return { itemType: 0, itemIndex: index };
  }
};

export const itemTypeAndIndexToEquipmentId = (itemType: number, itemIndex: number): string => {
  switch (itemType) {
    case 0: return `weapon-${itemIndex + 1}`;
    case 1: return `armor-${itemIndex + 1}`;
    case 2: return `accessory-${itemIndex + 1}`;
    case 3: return `soul-${itemIndex + 1}`;
    case 4: return `material-${itemIndex + 1}`;
    default: return `weapon-${itemIndex + 1}`;
  }
};

const getItemTimes = (itemType: number, itemIndex: number, inventory: any[]): number => {
  const equipmentId = itemTypeAndIndexToEquipmentId(itemType, itemIndex);
  const item = inventory.find(i => i.equipmentId === equipmentId);
  return item?.quantity || 0;
};

const getItemName = (itemType: number, itemIndex: number): string => {
  const equipmentId = itemTypeAndIndexToEquipmentId(itemType, itemIndex);
  const equipment = equipmentData.find(e => e.id === equipmentId);
  return equipment?.name || '???';
};

const dropRateChange = (dropRate: number, settings: GameSettings, saveSettings: GameSaveSettings, greedBonus: number = 1): number => {
  if (settings.donyokuOn) {
    dropRate *= 2;
  }
  if (settings.goyokuOn) {
    dropRate *= 1.4;
  }
  if (saveSettings.dropNum === 2 && settings.hardmode === 0) {
    dropRate *= 1.05;
  }
  if (saveSettings.dropNum === 1) {
    dropRate *= 1.15;
  }
  dropRate *= greedBonus;
  if (dropRate >= 0.7) {
    dropRate = 0.7;
  }
  return dropRate;
};

const randomDrop = (
  itemType: number,
  itemIndex: number,
  maxCount: number,
  dropRate: number,
  inventory: any[]
): { getItemType: number; getItemIndex: number } => {
  // itemIndex === -1 表示从该类装备中随机选一个（用于武器/防具的通用掉落）
  let actualIndex = itemIndex;
  if (itemIndex === -1) {
    const equipmentIds = equipmentData
      .filter(e => (itemType === 0 ? e.type === 'weapon' : itemType === 1 ? e.type === 'armor' : false))
      .map(e => e.id);
    if (equipmentIds.length === 0) {
      return { getItemType: -1, getItemIndex: -1 };
    }
    const randomId = equipmentIds[Math.floor(Math.random() * equipmentIds.length)];
    const mapping = equipmentIdToItemTypeAndIndex(randomId);
    actualIndex = mapping.itemIndex;
  }
  
  const times = getItemTimes(itemType, actualIndex, inventory);
  if (times < maxCount && Math.random() < dropRate) {
    return { getItemType: itemType, getItemIndex: actualIndex };
  }
  return { getItemType: -1, getItemIndex: -1 };
};

export const initDropManager = (): DropManagerState => ({
  getItemType: -1,
  getItemIndex: -1,
  getDropRate: 0,
  getItemName: '',
  getItemDropType: -1,
  getItemDropIndex: -1,
  getItemDropRate: 0,
});

export const dropItemList = (
  slot1: DropSlot | null,
  slot2: DropSlot | null,
  slot3: DropSlot | null,
  difficultyRate: number,
  inventory: any[],
  settings: GameSettings,
  saveSettings: GameSaveSettings,
  greedBonus: number = 1
): DropManagerState => {
  const state: DropManagerState = initDropManager();
  
  let dropCount = 0;
  if (slot3 !== null) dropCount = 3;
  else if (slot2 !== null) dropCount = 2;
  else if (slot1 !== null) dropCount = 1;
  
  if (dropCount === 0) {
    return state;
  }
  
  let currentSlot = 1;
  let itemName = '';
  
  do {
    let slot: DropSlot | null = null;
    if (currentSlot === 1) slot = slot1;
    else if (currentSlot === 2) slot = slot2;
    else if (currentSlot === 3) slot = slot3;
    
    if (slot === null) {
      currentSlot++;
      continue;
    }
    
    const itemType = slot.itemType;
    const itemIndex = slot.itemIndex;
    const times = getItemTimes(itemType, itemIndex, inventory);
    let rate = slot.baseRate * difficultyRate * 2.3;
    
    let maxCount = 10;
    if (itemType === 2) {
      maxCount = 3;
      if (times >= 3) {
        rate = -100;
      }
    }
    
    if (times >= 10) {
      rate = -100;
    } else if (times >= 0) {
      if (rate >= 0.2) {
        rate = rate * 0.1 + 0.18;
      }
      if (saveSettings.Highlv < 100000) {
        rate *= 0.8;
      }
      let i = 0;
      while (i < times) {
        rate *= 0.9;
        i++;
      }
      if (rate > 0.2) {
        rate = 0.2;
      }
      if (rate < 0.001) {
        rate = 0.00025 + rate * 0.75;
      }
      if (rate < 0.0001) {
        rate = 0.000075 + rate * 0.25;
      }
    }
    
    rate = dropRateChange(rate, settings, saveSettings, greedBonus);
    
    if (itemType === 3) {
      maxCount = 2;
      if (times >= 2) {
        rate = -100;
      } else {
        rate = 0.04;
        const hasTwilightCrystal = inventory.some(i => 
          i.equipmentId === 'accessory-78' && i.quantity > 0
        );
        if (hasTwilightCrystal) {
          rate = 0.08;
        }
      }
    }
    
    state.getDropRate = rate;
    
    if (rate > 0) {
      itemName += `${getItemName(itemType, itemIndex)}: ${(rate * 100).toFixed(2)}% [${times}/${maxCount}]\n`;
    } else {
      itemName += `${getItemName(itemType, itemIndex)}: [${times}/${maxCount}]\n`;
    }
    
    currentSlot++;
  } while (dropCount >= currentSlot);
  
  state.getItemName = itemName.trim();
  
  return state;
};

const getRandomSoulIndex = (): number => {
  const souls = equipmentData.filter(e => e.type === 'soul');
  if (souls.length === 0) return -1;
  return Math.floor(Math.random() * souls.length);
};

export const eneDropItemInit = (
  slot1: DropSlot | null,
  slot2: DropSlot | null,
  slot3: DropSlot | null,
  difficultyRate: number,
  inventory: any[],
  settings: GameSettings,
  saveSettings: GameSaveSettings,
  greedBonus: number = 1
): DropResult => {
  let getItemType = -1;
  let getItemIndex = -1;
  let getItemDropType = -1;
  let getItemDropIndex = -1;
  let getItemDropRate = 0;
  let getItemName = '';
  
  const random1 = randomDrop(2, 117, 3, 0.008, inventory);
  if (random1.getItemType !== -1) {
    getItemType = random1.getItemType;
    getItemIndex = random1.getItemIndex;
  }
  
  if (getItemType === -1) {
    const random2 = randomDrop(2, 104, 3, 0.012, inventory);
    if (random2.getItemType !== -1) {
      getItemType = random2.getItemType;
      getItemIndex = random2.getItemIndex;
    }
  }
  
  if (getItemType === -1) {
    const random3 = randomDrop(0, -1, 10, 0.012, inventory);
    if (random3.getItemType !== -1) {
      getItemType = random3.getItemType;
      getItemIndex = random3.getItemIndex;
    }
  }
  
  if (getItemType === -1) {
    const random4 = randomDrop(1, -1, 10, 0.012, inventory);
    if (random4.getItemType !== -1) {
      getItemType = random4.getItemType;
      getItemIndex = random4.getItemIndex;
    }
  }
  
  if (getItemType === -1) {
    let soulRate = 0.04;
    const hasTwilightCrystal = inventory.some(i => 
      i.equipmentId === 'accessory-78' && i.quantity > 0
    );
    if (hasTwilightCrystal) {
      soulRate = 0.08;
    }
    
    const soulIndex = getRandomSoulIndex();
    if (soulIndex !== -1) {
      const times = getItemTimes(3, soulIndex, inventory);
      const maxCount = getItemMaxCount(3);
      if (times < maxCount && Math.random() < soulRate) {
        getItemType = 3;
        getItemIndex = soulIndex;
      }
    }
  }
  
  const listResult = dropItemList(slot1, slot2, slot3, difficultyRate, inventory, settings, saveSettings, greedBonus);
  getItemName = listResult.getItemName;
  
  if (slot1 !== null || slot2 !== null || slot3 !== null) {
    const slots = [slot1, slot2, slot3].filter(s => s !== null) as DropSlot[];
    
    const isSlotAvailable = (slot: DropSlot): boolean => {
      const times = getItemTimes(slot.itemType, slot.itemIndex, inventory);
      const maxCount = getItemMaxCount(slot.itemType);
      return times < maxCount;
    };
    
    const availableSlots = slots.filter(isSlotAvailable);
    
    if (availableSlots.length > 0) {
      let slotChoice = 1;
      let score = 0;
      
      const checkSlot = (slot: DropSlot | null, weight: number) => {
        if (slot !== null && isSlotAvailable(slot)) {
          score += weight;
        }
      };
      
      checkSlot(slot1, 1);
      checkSlot(slot2, 2);
      checkSlot(slot3, 4);
      
      if (score === 1) slotChoice = 1;
      else if (score === 2) slotChoice = 2;
      else if (score === 3) slotChoice = Math.floor(Math.random() * 2) + 1;
      else if (score === 4) slotChoice = 3;
      else if (score === 5) slotChoice = 1 + Math.floor(Math.random() * 2) * 2;
      else if (score === 6) slotChoice = Math.floor(Math.random() * 2) + 2;
      else if (score === 7) slotChoice = Math.floor(Math.random() * 3) + 1;
      
      let selectedSlot: DropSlot | null = null;
      if (slotChoice === 1 && slot1 !== null && isSlotAvailable(slot1)) selectedSlot = slot1;
      else if (slotChoice === 2 && slot2 !== null && isSlotAvailable(slot2)) selectedSlot = slot2;
      else if (slotChoice === 3 && slot3 !== null && isSlotAvailable(slot3)) selectedSlot = slot3;
      
      if (selectedSlot === null) {
        selectedSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      }
      
      if (selectedSlot !== null) {
        if (selectedSlot.baseRate < 0.001) {
          selectedSlot.baseRate = 0.001;
        }
        
        getItemDropType = selectedSlot.itemType;
        getItemDropIndex = selectedSlot.itemIndex;
        
        const times = getItemTimes(selectedSlot.itemType, selectedSlot.itemIndex, inventory);
        let rate = selectedSlot.baseRate * difficultyRate * 3;
        
        rate = dropRateChange(rate, settings, saveSettings, greedBonus);
        
        if (rate >= 0.6) {
          rate = rate * 0.7 + 0.18;
        }
        
        if (selectedSlot.itemType === 3) {
          rate = 0.04;
          const hasTwilightCrystal = inventory.some(i => 
            i.equipmentId === 'accessory-78' && i.quantity > 0
          );
          if (hasTwilightCrystal) {
            rate = 0.08;
          }
        } else if (times >= 1) {
          rate *= 1.2;
          let i = 0;
          while (i < times) {
            rate *= 0.99;
            i++;
          }
          if (times >= 5) {
            rate *= 0.8;
          }
        }
        
        rate *= settings.dropBoost;
        getItemDropRate = rate;
        
        if (Math.random() <= rate) {
          getItemType = selectedSlot.itemType;
          getItemIndex = selectedSlot.itemIndex;
        }
      }
    }
  }
  
  return {
    getItemType,
    getItemIndex,
    getItemDropType,
    getItemDropIndex,
    getItemDropRate,
    getItemName,
    isDropSuccess: getItemType !== -1 && getItemIndex !== -1,
  };
};

export const convertDropToEquipmentId = (itemType: number, itemIndex: number): string => {
  return itemTypeAndIndexToEquipmentId(itemType, itemIndex);
};

export const getDropItemName = (itemType: number, itemIndex: number): string => {
  return getItemName(itemType, itemIndex);
};
