import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { equipmentData } from '@/data/equipment';

interface InventoryProps {
  onClose: () => void;
}

type ViewMode = 'main' | 'weapon' | 'armor';

export const Inventory = ({ onClose }: InventoryProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [confirmEquipment, setConfirmEquipment] = useState<typeof equipmentData[0] | null>(null);
  const player = useGameStore(state => state.player);
  const inventory = useGameStore(state => state.inventory);
  const equipItem = useGameStore(state => state.equipItem);

  const getTotalBonus = () => {
    let atkBonus = 0;
    let defBonus = 0;
    let hpBonus = 0;
    
    if (player.equippedWeapon) {
      atkBonus += player.equippedWeapon.attackBonus;
    }
    if (player.equippedArmor) {
      defBonus += player.equippedArmor.defenseBonus;
      hpBonus += player.equippedArmor.hpBonus;
    }
    (player.equippedAccessories || []).forEach(acc => {
      atkBonus += acc.attackBonus;
      defBonus += acc.defenseBonus;
      hpBonus += acc.hpBonus;
    });
    
    return { atkBonus, defBonus, hpBonus };
  };

  const bonuses = getTotalBonus();
  const totalAttack = player.attack + bonuses.atkBonus;
  const totalDefense = player.defense + bonuses.defBonus;

  const lockedSlots = 6 - (player.equippedAccessories?.length || 0);

  const getInventoryWeapons = () => {
    return inventory
      .filter(item => item.equipmentId.startsWith('weapon-'))
      .map(item => ({
        ...equipmentData.find(e => e.id === item.equipmentId)!,
        quantity: item.quantity
      }))
      .filter(e => e.name);
  };

  const getInventoryArmors = () => {
    return inventory
      .filter(item => item.equipmentId.startsWith('armor-'))
      .map(item => ({
        ...equipmentData.find(e => e.id === item.equipmentId)!,
        quantity: item.quantity
      }))
      .filter(e => e.name);
  };

  const handleEquip = (equipment: typeof equipmentData[0]) => {
    setConfirmEquipment(equipment);
  };

  const handleConfirmEquip = () => {
    if (confirmEquipment) {
      equipItem(confirmEquipment);
      setConfirmEquipment(null);
      setViewMode('main');
    }
  };

  const handleCancelEquip = () => {
    setConfirmEquipment(null);
  };

  const renderWeaponList = () => {
    const weapons = getInventoryWeapons();
    
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center">
          <span className="text-white font-bold text-lg">武器列表</span>
          <button 
            onClick={() => setViewMode('main')}
            className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors"
          >
            返回
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {player.equippedWeapon && (
            <div className="bg-[#7a9ac7] border-2 border-[#4a6fa5] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                  <span className="text-2xl">{player.equippedWeapon.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold">
                    {player.equippedWeapon.name}
                  </div>
                  <div className="text-green-300 text-sm mt-1">
                    当前装备
                  </div>
                  <div className="text-red-300 text-xs mt-1">
                    ATK +{player.equippedWeapon.attackBonus}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  属性倍率: {player.equippedWeapon.attributeRate}%
                </div>
              </div>
            </div>
          )}

          {weapons.filter(w => w.id !== player.equippedWeapon?.id).length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              暂无其他武器
            </div>
          ) : (
            weapons.filter(w => w.id !== player.equippedWeapon?.id).map(weapon => (
              <div 
                key={weapon.id}
                className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-2xl">{weapon.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">
                      {weapon.name}
                    </div>
                    <div className="text-red-300 text-sm mt-1">
                      ATK +{weapon.attackBonus}
                    </div>
                    <div className="text-gray-300 text-xs mt-0.5">
                      数量: {weapon.quantity}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-400">
                      属性倍率: {weapon.attributeRate}%
                    </div>
                    <button
                      onClick={() => handleEquip(weapon)}
                      className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                    >
                      装备
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-[#5a7aa5] px-4 py-3 border-t-2 border-[#4a6fa5]">
          <button
            onClick={() => setViewMode('main')}
            className="w-full bg-[#4a6fa5] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a95] transition-colors text-lg"
          >
            返回
          </button>
        </div>
      </div>
    );
  };

  const renderArmorList = () => {
    const armors = getInventoryArmors();
    
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center">
          <span className="text-white font-bold text-lg">防具列表</span>
          <button 
            onClick={() => setViewMode('main')}
            className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors"
          >
            返回
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {player.equippedArmor && (
            <div className="bg-[#7a9ac7] border-2 border-[#4a6fa5] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                  <span className="text-2xl">{player.equippedArmor.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold">
                    {player.equippedArmor.name}
                  </div>
                  <div className="text-green-300 text-sm mt-1">
                    当前装备
                  </div>
                  <div className="text-blue-300 text-xs mt-1">
                    DEF +{player.equippedArmor.defenseBonus}
                  </div>
                  {player.equippedArmor.hpBonus > 0 && (
                    <div className="text-green-300 text-xs">
                      HP +{player.equippedArmor.hpBonus}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  属性倍率: {player.equippedArmor.attributeRate}%
                </div>
              </div>
            </div>
          )}

          {armors.filter(a => a.id !== player.equippedArmor?.id).length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              暂无其他防具
            </div>
          ) : (
            armors.filter(a => a.id !== player.equippedArmor?.id).map(armor => (
              <div 
                key={armor.id}
                className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-2xl">{armor.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">
                      {armor.name}
                    </div>
                    <div className="text-blue-300 text-sm mt-1">
                      DEF +{armor.defenseBonus}
                    </div>
                    {armor.hpBonus > 0 && (
                      <div className="text-green-300 text-xs">
                        HP +{armor.hpBonus}
                      </div>
                    )}
                    <div className="text-gray-300 text-xs mt-0.5">
                      数量: {armor.quantity}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-400">
                      属性倍率: {armor.attributeRate}%
                    </div>
                    <button
                      onClick={() => handleEquip(armor)}
                      className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                    >
                      装备
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-[#5a7aa5] px-4 py-3 border-t-2 border-[#4a6fa5]">
          <button
            onClick={() => setViewMode('main')}
            className="w-full bg-[#4a6fa5] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a95] transition-colors text-lg"
          >
            返回
          </button>
        </div>
      </div>
    );
  };

  const renderMainView = () => {
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-center">
          <button className="bg-[#4a6fa5] text-white font-bold py-2 px-6 rounded hover:bg-[#3a5a95] transition-colors">
            装备组合切换
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex items-start gap-2">
            <div className="bg-[#6a8ac5] text-white text-sm font-bold px-2 py-1 rounded mt-1 flex-shrink-0">
              武器
            </div>
            <div 
              onClick={() => setViewMode('weapon')}
              className="flex-1 bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-2 cursor-pointer hover:bg-[#5a7ab5] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                  <span className="text-xl">
                    {player.equippedWeapon?.icon || '❓'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">
                    {player.equippedWeapon?.name || '未装备'}
                  </div>
                  {player.equippedWeapon && (
                    <div className="text-red-300 text-xs mt-1">
                      ATK {totalAttack} (+{bonuses.atkBonus})
                    </div>
                  )}
                </div>
                <div className="text-gray-400 text-xs">点击更换</div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="bg-[#6a8ac5] text-white text-sm font-bold px-2 py-1 rounded mt-1 flex-shrink-0">
              防具
            </div>
            <div 
              onClick={() => setViewMode('armor')}
              className="flex-1 bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-2 cursor-pointer hover:bg-[#5a7ab5] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                  <span className="text-xl">
                    {player.equippedArmor?.icon || '❓'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">
                    {player.equippedArmor?.name || '未装备'}
                  </div>
                  {player.equippedArmor && (
                    <div className="text-blue-300 text-xs mt-1">
                      DEF {totalDefense} (+{bonuses.defBonus})
                    </div>
                  )}
                </div>
                <div className="text-gray-400 text-xs">点击更换</div>
              </div>
            </div>
          </div>

          <div className="bg-[#5a7aa5] px-2 py-1 rounded text-white text-xs font-bold">
            饰品
          </div>

          {(player.equippedAccessories || []).map((accessory, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1 bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-lg">{accessory.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-xs">
                      {accessory.name}
                    </div>
                    {accessory.effectDescription && (
                      <div className="text-gray-200 text-xs mt-0.5">
                        {accessory.effectDescription}
                      </div>
                    )}
                    {(accessory.hpBonus > 0 || accessory.attackBonus > 0 || accessory.defenseBonus > 0) && (
                      <div className="flex gap-1 mt-0.5">
                        {accessory.hpBonus > 0 && (
                          <span className="bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded text-xs">
                            HP +{accessory.hpBonus}
                          </span>
                        )}
                        {accessory.attackBonus > 0 && (
                          <span className="bg-red-900/50 text-red-300 px-1.5 py-0.5 rounded text-xs">
                            ATK +{accessory.attackBonus}
                          </span>
                        )}
                        {accessory.defenseBonus > 0 && (
                          <span className="bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded text-xs">
                            DEF +{accessory.defenseBonus}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {Array.from({ length: lockedSlots }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 bg-[#5a6a85] border-2 border-[#4a5a75] rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#4a5a75] rounded flex items-center justify-center">
                      <span className="text-lg">🔒</span>
                    </div>
                    <div className="text-gray-400 text-xs font-bold">LOCKED</div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    用2500000G解锁饰孔
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-[#5a7aa5] px-2 py-1 rounded text-white text-xs font-bold flex items-center justify-between">
            <span>属性</span>
            <div className="flex gap-1">
              <button className="w-6 h-6 bg-[#4a6fa5] rounded flex items-center justify-center text-xs">M</button>
              <button className="w-6 h-6 bg-[#4a6fa5] rounded flex items-center justify-center text-xs">?</button>
            </div>
          </div>

          <div className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-white">HP</span>
              <span className="text-green-300">
                {player.hp}(+{bonuses.hpBonus})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white">ATK</span>
              <span className="text-red-300">
                {totalAttack}(+{bonuses.atkBonus})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white">DEF</span>
              <span className="text-blue-300">
                {totalDefense}(+{bonuses.defBonus})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white">AGI</span>
              <span className="text-yellow-300">{player.agility}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white">LUC</span>
              <span className="text-purple-300">{player.luck}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#5a7aa5] px-4 py-3 border-t-2 border-[#4a6fa5]">
          <button
            onClick={onClose}
            className="w-full bg-[#4a6fa5] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a95] transition-colors text-lg"
          >
            返回
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmDialog = () => {
    if (!confirmEquipment) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-4">
              装备 {confirmEquipment.name} 吗？
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmEquip}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors"
              >
                确认
              </button>
              <button
                onClick={handleCancelEquip}
                className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {viewMode === 'weapon' && renderWeaponList()}
      {viewMode === 'armor' && renderArmorList()}
      {viewMode === 'main' && renderMainView()}
      {renderConfirmDialog()}
    </>
  );
};