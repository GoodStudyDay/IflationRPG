import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { equipmentData } from '@/data/equipment';
import type { EquipmentType } from '@/types';

interface EquipmentCollectionProps {
  onClose: () => void;
}

export const EquipmentCollection = ({ onClose }: EquipmentCollectionProps) => {
  const { inventory, player, buyEquipment } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<EquipmentType | 'all'>('all');
  const [buySuccessMsg, setBuySuccessMsg] = useState<string | null>(null);
  const [buyErrorMsg, setBuyErrorMsg] = useState<string | null>(null);

  const handleBuy = (equipmentId: string) => {
    const success = buyEquipment(equipmentId);
    if (success) {
      setBuySuccessMsg('购买成功！');
      setTimeout(() => setBuySuccessMsg(null), 1500);
    } else {
      setBuyErrorMsg('金币不足或已达上限');
      setTimeout(() => setBuyErrorMsg(null), 1500);
    }
  };

  const categories: { value: EquipmentType | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'weapon', label: '武器' },
    { value: 'armor', label: '防具' },
    { value: 'accessory', label: '饰品' },
  ];

  const filteredEquipment = equipmentData.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.type === selectedCategory;
  });

  const getOwnedQuantity = (equipmentId: string) => {
    const item = inventory.find(i => i.equipmentId === equipmentId);
    return item?.quantity || 0;
  };

  const getTypeLabel = (type: EquipmentType) => {
    switch (type) {
      case 'weapon': return '武器';
      case 'armor': return '防具';
      case 'consumable': return '消耗品';
      case 'accessory': return '饰品';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[95%] max-w-lg max-h-[85vh] flex flex-col">
        <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-game-secondary rounded flex items-center justify-center text-game-dark font-bold text-sm">
                COL
              </div>
              <span className="text-game-secondary font-bold">装备收集</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center text-white text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="bg-[#1a0a2e]/50 border-b border-[#4a2c7a] px-2 py-2 flex gap-1">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex-1 py-2 px-1 rounded text-xs font-bold transition-all ${
                selectedCategory === category.value
                  ? 'bg-game-secondary text-game-dark'
                  : 'bg-[#3d2b6e] text-gray-300 hover:bg-[#4d3b7e]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredEquipment.map((equipment, index) => {
              const ownedQuantity = getOwnedQuantity(equipment.id);
              const isMaxed = ownedQuantity >= equipment.maxQuantity;
              const isOwned = ownedQuantity > 0;
              const isPurchaseable = equipment.price > 0;
              const showInfo = isOwned || isPurchaseable;

              return (
                <div
                  key={equipment.id}
                  className={`bg-[#3d2b6e] rounded-lg p-3 border-2 transition-all ${
                    showInfo
                      ? isMaxed
                        ? 'border-gray-600 opacity-60'
                        : 'border-blue-500/50'
                      : 'border-gray-700 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 text-sm font-bold w-6">
                      {index + 1}
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 bg-[#2d1b4e] rounded flex items-center justify-center">
                      <span className="text-xl">
                        {showInfo ? equipment.icon : '❓'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${
                          showInfo
                            ? isMaxed ? 'text-gray-400' : 'text-game-secondary'
                            : 'text-gray-500'
                        }`}>
                          {showInfo ? equipment.name : '？？？'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {getTypeLabel(equipment.type)}
                        </span>
                      </div>
                      {showInfo && (
                        <div className="flex items-center gap-2 mt-1">
                          {equipment.attackBonus > 0 && (
                            <span className="bg-red-900/50 text-red-400 px-2 py-0.5 rounded text-xs">
                              ATK +{equipment.attackBonus}
                            </span>
                          )}
                          {equipment.defenseBonus > 0 && (
                            <span className="bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded text-xs">
                              DEF +{equipment.defenseBonus}
                            </span>
                          )}
                          {equipment.hpBonus > 0 && (
                            <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded text-xs">
                              HP +{equipment.hpBonus}
                            </span>
                          )}
                          {equipment.effectDescription && (
                            <span className="text-purple-400 text-xs">
                              {equipment.effectDescription}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right min-w-[70px]">
                      {equipment.price > 0 && !isMaxed && (
                        <button
                          onClick={() => handleBuy(equipment.id)}
                          className={`text-xs font-bold py-1 px-3 rounded transition-colors ${
                            player.gold >= equipment.price
                              ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {equipment.price.toLocaleString()}G
                        </button>
                      )}
                      <div className={`text-lg font-bold mt-0.5 ${
                        isMaxed ? 'text-gray-400' : 'text-yellow-400'
                      }`}>
                        {ownedQuantity} / {equipment.maxQuantity}
                      </div>
                      {isMaxed && (
                        <div className="text-xs text-red-400">MAX</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#4a2c7a] bg-[#1a0a2e] px-4 py-3">
          <button
            onClick={onClose}
            className="w-full bg-[#5a3c8a] text-white font-bold py-2 rounded-lg hover:bg-[#6a4c9a] transition-colors text-sm"
          >
            返回
          </button>
        </div>
      </div>
      
      {/* 购买提示 */}
      {buySuccessMsg && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-bold">
          {buySuccessMsg}
        </div>
      )}
      {buyErrorMsg && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-bold">
          {buyErrorMsg}
        </div>
      )}
      
      {/* 金币显示 */}
      <div className="fixed top-4 right-4 bg-yellow-600/90 text-white px-3 py-1.5 rounded-lg z-50 text-sm font-bold">
        {player.gold.toLocaleString()} G
      </div>
    </div>
  );
};
