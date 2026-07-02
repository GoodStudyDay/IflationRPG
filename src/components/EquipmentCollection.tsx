import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { equipmentData } from '@/data/equipment';
import type { EquipmentType } from '@/types';
import { SpriteIcon } from './SpriteIcon';

interface EquipmentCollectionProps {
  onClose: () => void;
}

export const EquipmentCollection = ({ onClose }: EquipmentCollectionProps) => {
  const { inventory, player, buyEquipment } = useGameStore();
  type CategoryType = EquipmentType | 'all' | 'soul' | 'material';
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [buySuccessMsg, setBuySuccessMsg] = useState<string | null>(null);
  const [buyErrorMsg, setBuyErrorMsg] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

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

  const categories: { value: CategoryType; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'weapon', label: '武器' },
    { value: 'armor', label: '防具' },
    { value: 'accessory', label: '饰品' },
    { value: 'soul', label: '魂' },
    { value: 'material', label: '材料' },
  ];

  const filteredEquipment = equipmentData.filter(item => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'soul') return item.id.startsWith('soul-');
    if (selectedCategory === 'material') return item.type === 'material';
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
                  onClick={() => setSelectedEquipment(equipment)}
                  className={`bg-[#3d2b6e] rounded-lg p-3 border-2 transition-all cursor-pointer hover:border-blue-400 ${
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
                    <div className="flex-shrink-0 w-10 h-10 bg-[#2d1b4e] rounded flex items-center justify-center overflow-hidden">
                      {showInfo && equipment.x !== undefined && equipment.y !== undefined ? (
                        <SpriteIcon type={equipment.type === 'weapon' ? 'weapon' : equipment.type === 'armor' ? 'armor' : equipment.type === 'accessory' ? 'accessory' : 'soul'} x={equipment.x} y={equipment.y} size="medium" />
                      ) : (
                        <span className="text-xl">
                          {showInfo ? equipment.icon : '❓'}
                        </span>
                      )}
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
                        <div className="flex flex-wrap items-center gap-2 mt-1">
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
                          {equipment.agilityBonus > 0 && (
                            <span className="bg-cyan-900/50 text-cyan-400 px-2 py-0.5 rounded text-xs">
                              AGI +{equipment.agilityBonus}
                            </span>
                          )}
                          {equipment.luckBonus > 0 && (
                            <span className="bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded text-xs">
                              LUC +{equipment.luckBonus}
                            </span>
                          )}
                          {equipment.description && (
                            <span className="text-purple-400 text-xs">
                              {equipment.description}
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

      {/* 物品详情弹窗 */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setSelectedEquipment(null)}>
          <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-sm p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#1a0a2e] rounded-lg flex items-center justify-center overflow-hidden">
                {selectedEquipment.x !== undefined && selectedEquipment.y !== undefined ? (
                  <SpriteIcon type={selectedEquipment.type === 'weapon' ? 'weapon' : selectedEquipment.type === 'armor' ? 'armor' : selectedEquipment.type === 'accessory' ? 'accessory' : 'soul'} x={selectedEquipment.x} y={selectedEquipment.y} size="large" />
                ) : (
                  <span className="text-3xl">{selectedEquipment.icon}</span>
                )}
              </div>
              <div>
                <div className="text-game-secondary font-bold text-lg">{selectedEquipment.name}</div>
                <div className="text-gray-400 text-sm">{getTypeLabel(selectedEquipment.type)}</div>
              </div>
            </div>
            <div className="space-y-2">
              {selectedEquipment.attackBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">攻击力</span>
                  <span className="text-red-400">+{selectedEquipment.attackBonus}</span>
                </div>
              )}
              {selectedEquipment.defenseBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-400">防御力</span>
                  <span className="text-blue-400">+{selectedEquipment.defenseBonus}</span>
                </div>
              )}
              {selectedEquipment.hpBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">生命值</span>
                  <span className="text-green-400">+{selectedEquipment.hpBonus}</span>
                </div>
              )}
              {selectedEquipment.agilityBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400">敏捷度</span>
                  <span className="text-cyan-400">+{selectedEquipment.agilityBonus}</span>
                </div>
              )}
              {selectedEquipment.luckBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-400">幸运值</span>
                  <span className="text-yellow-400">+{selectedEquipment.luckBonus}</span>
                </div>
              )}
              {selectedEquipment.description && (
                <div className="text-gray-300 text-sm mt-3 p-2 bg-[#1a0a2e] rounded">
                  {selectedEquipment.description}
                </div>
              )}
              {selectedEquipment.setumei && !selectedEquipment.description && (
                <div className="text-gray-300 text-sm mt-3 p-2 bg-[#1a0a2e] rounded">
                  {selectedEquipment.setumei.replace('[0]', String(selectedEquipment.t2 || 0))}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedEquipment(null)}
              className="w-full mt-4 bg-[#5a3c8a] text-white font-bold py-2 rounded-lg hover:bg-[#6a4c9a] transition-colors text-sm"
            >
              关闭
            </button>
          </div>
        </div>
      )}
      
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
