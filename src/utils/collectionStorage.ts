import type { InventoryItem } from '@/types';
import { getEquipmentById } from '@/data/equipment';

const COLLECTION_STORAGE_KEY = 'inflation-rpg-collection';

export const saveCollection = (inventory: InventoryItem[]) => {
  try {
    const existing = getCollection();
    const merged: InventoryItem[] = [...existing];
    
    inventory.forEach(item => {
      const equipment = getEquipmentById(item.equipmentId);
      const maxQty = equipment?.maxQuantity ?? 10;
      const existingIndex = merged.findIndex(i => i.equipmentId === item.equipmentId);
      if (existingIndex >= 0) {
        merged[existingIndex].quantity = Math.min(merged[existingIndex].quantity + item.quantity, maxQty);
      } else {
        merged.push({ ...item, quantity: Math.min(item.quantity, maxQty) });
      }
    });
    
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    console.warn('Failed to save collection');
    return inventory;
  }
};

export const getCollection = (): InventoryItem[] => {
  try {
    const stored = localStorage.getItem(COLLECTION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn('Failed to load collection');
  }
  return [];
};

export const clearCollection = () => {
  try {
    localStorage.removeItem(COLLECTION_STORAGE_KEY);
  } catch {
    console.warn('Failed to clear collection');
  }
};
