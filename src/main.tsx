import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useGameStore } from './stores/gameStore'
import { getEquipmentById, equipmentData } from './data/equipment'

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
      setMapBonus: (bonusType: number, count?: number) => void;
      addAllWeapons: () => void;
      addAllArmor: () => void;
      addAllAccessories: () => void;
      clearSave: () => void;
      kill: (enable?: boolean) => void;
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
  setMapBonus: (bonusType: number, count = 5) => {
    const bonusList = [
      '敌HP半减', '敌攻击力半减', '会心连続率上昇',
      '金币2倍', '金币3倍', '金币4倍', '金币7倍',
      '经验值1.5倍', '经验值2倍',
      '?A?', '?B?', '?C?',
      '¡', '¡¡¡', '¡', '¡¡¡', '!?', '○★○', '○★○',
    ];
    const name = bonusList[bonusType] || `未知(${bonusType})`;
    useGameStore.getState().setMapBonus(bonusType, count);
    console.log(`已设置地图 Bonus: ${name} (类型=${bonusType}, 次数=${count})`);
  },
  addAllWeapons: () => {
    const store = useGameStore.getState();
    const weapons = equipmentData.filter(e => e.type === 'weapon');
    weapons.forEach(w => store.addToInventory(w.id, 1));
    console.log(`已添加全部武器 (${weapons.length} 件)`);
  },
  addAllArmor: () => {
    const store = useGameStore.getState();
    const armors = equipmentData.filter(e => e.type === 'armor');
    armors.forEach(a => store.addToInventory(a.id, 1));
    console.log(`已添加全部防具 (${armors.length} 件)`);
  },
  addAllAccessories: () => {
    const store = useGameStore.getState();
    const accessories = equipmentData.filter(e => e.type === 'accessory');
    accessories.forEach(a => store.addToInventory(a.id, 1));
    console.log(`已添加全部饰品 (${accessories.length} 件)`);
  },
  clearSave: () => {
    // 清除所有 localStorage
    localStorage.removeItem('inflation-rpg-storage');
    localStorage.removeItem('inflation-rpg-savedata');
    localStorage.removeItem('inflation-rpg-itemcounts');
    localStorage.removeItem('inflation-rpg-collection');
    // 清除 IndexedDB 图片缓存
    const deleteRequest = indexedDB.deleteDatabase('InflationRPG_ImageCache');
    deleteRequest.onsuccess = () => {
      console.log('图像缓存 IndexedDB 已删除');
    };
    // 重置内存状态并刷新页面
    useGameStore.getState().resetGame();
    console.log('所有存档和缓存已清除，页面即将刷新...');
    setTimeout(() => {
      window.location.reload();
    }, 200);
  },
  kill: (enable?: boolean) => {
    const store = useGameStore.getState();
    const newState = enable !== undefined ? enable : !store.debugKill;
    useGameStore.setState({ debugKill: newState });
    console.log(`一键击杀: ${newState ? '已开启' : '已关闭'}`);
  },
};