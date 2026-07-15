import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { equipmentData, getRecipeForEquipment, getEquipmentByTypeAndListnum } from '@/data/equipment';
import type { EquipmentType } from '@/types';
import { SpriteIcon } from './SpriteIcon';
import { useEquipmentName } from '@/hooks/useEquipmentName';
import { useEquipmentDescription } from '@/hooks/useEquipmentDescription';
import { useTranslation } from '@/hooks/useTranslation';

interface EquipmentCollectionProps {
  onClose: () => void;
}

export const EquipmentCollection = ({ onClose }: EquipmentCollectionProps) => {
  const { t } = useTranslation();
  const { getEquipName } = useEquipmentName();
  const { getEquipDescription } = useEquipmentDescription();
  const { inventory, player, buyEquipment, synthesizeEquipment, purchaseCounts } = useGameStore();
  type CategoryType = EquipmentType | 'all' | 'soul' | 'material';
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [buySuccessMsg, setBuySuccessMsg] = useState<string | null>(null);
  const [buyErrorMsg, setBuyErrorMsg] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  const getCurrentPrice = (equipment: typeof equipmentData[0]) => {
    const count = purchaseCounts[equipment.id] || 0;
    return Math.ceil(equipment.price * (1 + count * 0.1));
  };

  const handleBuy = (equipmentId: string) => {
    const success = buyEquipment(equipmentId);
    if (success) {
      setBuySuccessMsg(t('购买成功！'));
      setTimeout(() => setBuySuccessMsg(null), 1500);
    } else {
      setBuyErrorMsg(t('金币不足或已达上限'));
      setTimeout(() => setBuyErrorMsg(null), 1500);
    }
  };

  const categories: { value: CategoryType; label: string }[] = [
    { value: 'all', label: t('全部') },
    { value: 'weapon', label: t('武器') },
    { value: 'armor', label: t('防具') },
    { value: 'accessory', label: t('饰品') },
    { value: 'soul', label: t('魂') },
    { value: 'material', label: t('材料') },
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
      case 'weapon': return t('武器');
      case 'armor': return t('防具');
      case 'consumable': return t('消耗品');
      case 'accessory': return t('饰品');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[95%] max-w-lg max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-game-secondary rounded flex items-center justify-center text-game-dark font-bold text-sm">
                COL
              </div>
              <span className="text-game-secondary font-bold">{t('装备收集')}</span>
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
                    <div className="relative text-gray-400 text-sm font-bold w-6 opacity-100">
                      <div className="absolute -top-1 left-0 flex flex-col items-start gap-0 leading-none">
                        {equipment.hardmode === 1 && (
                          <span className="text-[10px] font-bold text-red-400">Hard</span>
                        )}
                        {equipment.hardmode === 2 && equipment.type !== 'accessory' && (
                          <span className="text-[10px] font-bold text-pink-400">Hell</span>
                        )}
                        {equipment.hardmode === 2 && equipment.type === 'accessory' && (
                          <span className="text-[10px] font-bold text-yellow-400">Matl</span>
                        )}
                        {equipment.hardmode === 3 && (
                          <span className="text-[10px] font-bold text-purple-400">Mix</span>
                        )}
                        {equipment.hardmode === 4 && (
                          <span className="text-[10px] font-bold text-green-400">Pasv</span>
                        )}
                      </div>
                      <span style={{ opacity: showInfo ? 1 : 0.5 }}>{index + 1}</span>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 bg-[#2d1b4e] rounded flex items-center justify-center overflow-hidden">
                      {showInfo && equipment.x !== undefined && equipment.y !== undefined ? (
                        <SpriteIcon type={equipment.type === 'weapon' ? 'weapon' : equipment.type === 'armor' ? 'armor' : equipment.type === 'accessory' ? 'accessory' : equipment.type === 'material' ? 'material' : 'soul'} x={equipment.x} y={equipment.y} size="medium" image={equipment.type === 'accessory' ? equipment.image : equipment.type === 'soul' ? equipment.image : undefined} bit32={equipment.type === 'weapon' || equipment.type === 'armor' || equipment.type === 'material' ? equipment.bit32 : undefined} />
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
                          {showInfo ? getEquipName(equipment.name) : '？？？'}
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
                          {equipment.setumei && (
                            <span className="text-purple-400 text-xs">
                              {getEquipDescription(equipment.setumei, equipment.t1, equipment.t2)}
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
                            player.gold >= getCurrentPrice(equipment)
                              ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {getCurrentPrice(equipment).toLocaleString()}G
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
            {t('返回')}
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
                  <SpriteIcon type={selectedEquipment.type === 'weapon' ? 'weapon' : selectedEquipment.type === 'armor' ? 'armor' : selectedEquipment.type === 'accessory' ? 'accessory' : selectedEquipment.type === 'material' ? 'material' : 'soul'} x={selectedEquipment.x} y={selectedEquipment.y} size="large" image={selectedEquipment.type === 'accessory' ? selectedEquipment.image : selectedEquipment.type === 'soul' ? selectedEquipment.image : undefined} bit32={selectedEquipment.type === 'weapon' || selectedEquipment.type === 'armor' || selectedEquipment.type === 'material' ? selectedEquipment.bit32 : undefined} />
                ) : (
                  <span className="text-3xl">{selectedEquipment.icon}</span>
                )}
              </div>
              <div>
                <div className="text-game-secondary font-bold text-lg">{getEquipName(selectedEquipment.name)}</div>
                <div className="text-gray-400 text-sm">{getTypeLabel(selectedEquipment.type)}</div>
              </div>
            </div>
            <div className="space-y-2">
              {selectedEquipment.attackBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">{t('攻击力')}</span>
                  <span className="text-red-400">+{selectedEquipment.attackBonus}</span>
                </div>
              )}
              {selectedEquipment.defenseBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-400">{t('防御力')}</span>
                  <span className="text-blue-400">+{selectedEquipment.defenseBonus}</span>
                </div>
              )}
              {selectedEquipment.hpBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">{t('生命值')}</span>
                  <span className="text-green-400">+{selectedEquipment.hpBonus}</span>
                </div>
              )}
              {selectedEquipment.agilityBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400">{t('敏捷度')}</span>
                  <span className="text-cyan-400">+{selectedEquipment.agilityBonus}</span>
                </div>
              )}
              {selectedEquipment.luckBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-400">{t('幸运值')}</span>
                  <span className="text-yellow-400">+{selectedEquipment.luckBonus}</span>
                </div>
              )}
              {selectedEquipment.setumei && (
                <div className="text-gray-300 text-sm mt-3 p-2 bg-[#1a0a2e] rounded">
                  {getEquipDescription(selectedEquipment.setumei, selectedEquipment.t1, selectedEquipment.t2)}
                </div>
              )}
            </div>

            {(() => {
              const typeMap: Record<string, string> = {
                weapon: 'weapon',
                armor: 'armor',
                accessory: 'accessory',
                soul: 'soul',
                material: 'material',
              };
              const recipe = getRecipeForEquipment(typeMap[selectedEquipment.type] || 'material', selectedEquipment.listnum || 0);
              if (recipe) {
                const canSynthesize = recipe.materials.every(material => {
                  const matEquipment = getEquipmentByTypeAndListnum(material.type, material.listnum);
                  if (!matEquipment) return false;
                  const owned = inventory.find(i => i.equipmentId === matEquipment.id);
                  return owned && owned.quantity >= material.quantity;
                });

                return (
                  <div className="mt-4">
                    <div className="text-game-secondary font-bold text-sm mb-2">{t('合成材料')}</div>
                    <div className="bg-[#1a0a2e] rounded p-2 space-y-1">
                      {recipe.materials.map((material, idx) => {
                        const matEquipment = getEquipmentByTypeAndListnum(material.type, material.listnum);
                        const owned = matEquipment ? inventory.find(i => i.equipmentId === matEquipment.id)?.quantity || 0 : 0;
                        const hasEnough = owned >= material.quantity;
                        return (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className={hasEnough ? 'text-gray-300' : 'text-red-400'}>
                              {matEquipment ? getEquipName(matEquipment.name) : '???'}
                            </span>
                            <span className={hasEnough ? 'text-gray-400' : 'text-red-400'}>
                              {owned}/{material.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => {
                        const success = synthesizeEquipment(selectedEquipment.id);
                        if (success) {
                          setBuySuccessMsg(t('合成成功！'));
                          setTimeout(() => setBuySuccessMsg(null), 1500);
                          setSelectedEquipment(null);
                        } else {
                          setBuyErrorMsg(t('材料不足'));
                          setTimeout(() => setBuyErrorMsg(null), 1500);
                        }
                      }}
                      disabled={!canSynthesize}
                      className={`w-full mt-3 font-bold py-2 rounded-lg transition-colors text-sm ${
                        canSynthesize
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {t('合成')}
                    </button>
                  </div>
                );
              }
              return null;
            })()}

            <button
              onClick={() => setSelectedEquipment(null)}
              className="w-full mt-4 bg-[#5a3c8a] text-white font-bold py-2 rounded-lg hover:bg-[#6a4c9a] transition-colors text-sm"
            >
              {t('关闭')}
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
