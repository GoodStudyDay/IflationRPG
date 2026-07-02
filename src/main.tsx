import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useGameStore } from './stores/gameStore'
import { getEquipmentById } from './data/equipment'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

declare global {
  interface Window {
    gameDebug: {
      addEquipment: (equipmentId: string, quantity?: number) => void;
      addGold: (amount: number) => void;
      addExp: (amount: number) => void;
      listEquipment: (keyword?: string) => void;
    };
  }
}

window.gameDebug = {
  addEquipment: (equipmentId: string, quantity = 1) => {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) {
      console.warn(`装备不存在: ${equipmentId}`);
      return;
    }
    useGameStore.getState().addToInventory(equipmentId, quantity);
    console.log(`已添加 ${quantity} 个 ${equipment.name} (${equipmentId})`);
  },
  addGold: (amount: number) => {
    useGameStore.getState().addGold(amount);
    console.log(`已添加 ${amount.toLocaleString()} 金币`);
  },
  addExp: (amount: number) => {
    useGameStore.getState().addExp(amount);
    console.log(`已添加 ${amount.toLocaleString()} 经验`);
  },
  listEquipment: (keyword?: string) => {
    const inventory = useGameStore.getState().inventory;
    const filtered = keyword
      ? inventory.filter(item => {
          const eq = getEquipmentById(item.equipmentId);
          return eq && eq.name.includes(keyword);
        })
      : inventory;
    console.log('背包物品列表:');
    filtered.forEach(item => {
      const eq = getEquipmentById(item.equipmentId);
      console.log(`  ${eq?.name || item.equipmentId}: ${item.quantity}`);
    });
  },
};