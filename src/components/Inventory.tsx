import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { equipmentData } from '@/data/equipment';
import { getStockBonus } from '@/utils/helpers';

interface InventoryProps {
  onClose: () => void;
}

type ViewMode = 'main' | 'weapon' | 'armor' | 'accessory' | 'soul' | 'material';

export const Inventory = ({ onClose }: InventoryProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedAccessorySlot, setSelectedAccessorySlot] = useState<number | null>(null);
  const [, setSelectedSoulSlot] = useState<{ type: 'weapon' | 'armor'; slot: number } | null>(null);
  const [confirmEquipment, setConfirmEquipment] = useState<typeof equipmentData[0] | null>(null);
  const [unlockingSlotIndex, setUnlockingSlotIndex] = useState<number>(0);
  const player = useGameStore(state => state.player);
  const inventory = useGameStore(state => state.inventory);
  const equipItem = useGameStore(state => state.equipItem);
  const unlockAccessorySlot = useGameStore(state => state.unlockAccessorySlot);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const [showGoldError, setShowGoldError] = useState(false);

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

  const totalAccessorySlots = player.maxAccessorySlots || 3;

  const nextSlotPrice = totalAccessorySlots < 12
    ? (() => {
        const prices = [0, 0, 0, 250000, 500000, 750000, 70000000, 70000000, 5000000, 5000000, 3500000, 3500000];
        return prices[totalAccessorySlots];
      })()
    : 0;

  const handleUnlockSlot = () => {
    const success = unlockAccessorySlot();
    if (!success) {
      setShowGoldError(true);
      setTimeout(() => setShowGoldError(false), 2000);
    }
    setShowUnlockConfirm(false);
  };

  const getInventoryWeapons = () => {
    return inventory
      .filter(item => item.equipmentId.startsWith('weapon-'))
      .map(item => ({
        ...equipmentData.find(e => e.id === item.equipmentId)!,
        quantity: item.quantity
      }))
      .filter(e => e.name);
  };

  const getInventoryAccessories = () => {
    return inventory
      .filter(item => item.equipmentId.startsWith('accessory-'))
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

  const getInventorySouls = () => {
    return inventory
      .filter(item => item.equipmentId.startsWith('soul-'))
      .map(item => ({
        ...equipmentData.find(e => e.id === item.equipmentId)!,
        quantity: item.quantity
      }))
      .filter(e => e.name);
  };

  const getInventoryMaterials = () => {
    return inventory
      .filter(item => item.equipmentId.startsWith('material-'))
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
      equipItem(confirmEquipment, selectedAccessorySlot ?? undefined);
      setConfirmEquipment(null);
      setSelectedAccessorySlot(null);
      setSelectedSoulSlot(null);
      setViewMode('main');
    }
  };

  const handleCancelEquip = () => {
    setConfirmEquipment(null);
    setSelectedAccessorySlot(null);
    setSelectedSoulSlot(null);
  };

  const renderWeaponList = () => {
    const weapons = getInventoryWeapons();
    
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md max-h-[90vh] flex flex-col">
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
          {player.equippedWeapon && (() => {
            const eqWpn = weapons.find(w => w.id === player.equippedWeapon?.id);
            const qty = eqWpn?.quantity || 1;
            const stockMult = getStockBonus(qty);
            return (
            <div className="bg-[#7a9ac7] border-2 border-[#4a6fa5] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                  <span className="text-2xl">{player.equippedWeapon.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold">
                    {player.equippedWeapon.name}
                  </div>
                  <div className="text-green-300 text-sm mt-1">当前装备</div>
                  <div className="text-red-300 text-xs mt-1">
                    ATK +{Math.floor(player.equippedWeapon.attackBonus * stockMult)}（x{qty}件）
                  </div>
                  <div className="text-gray-300 text-xs">倍率: {Math.floor(player.equippedWeapon.attributeRate * stockMult)}%</div>
                </div>
              </div>
            </div>
            );
          })()}

          {weapons.filter(w => w.id !== player.equippedWeapon?.id).length === 0 ? (
            <div className="text-center text-gray-400 py-8">暂无其他武器</div>
          ) : (
            weapons.filter(w => w.id !== player.equippedWeapon?.id).map(weapon => {
              const stockMult = getStockBonus(weapon.quantity);
              return (
              <div 
                key={weapon.id}
                className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-2xl">{weapon.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{weapon.name}</div>
                    <div className="text-red-300 text-sm mt-1">ATK +{Math.floor(weapon.attackBonus * stockMult)}</div>
                    <div className="text-gray-300 text-xs mt-0.5">
                      数量: {weapon.quantity}
                      {weapon.quantity > 1 && <span className="text-yellow-300 ml-1">(+{(weapon.quantity - 1) * 10}%)</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-400">倍率: {Math.floor(weapon.attributeRate * stockMult)}%</div>
                    <button
                      onClick={() => handleEquip(weapon)}
                      className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                    >
                      装备
                    </button>
                  </div>
                </div>
              </div>
              );
            }))
          }
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
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md max-h-[90vh] flex flex-col">
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
          {player.equippedArmor && (() => {
            const eqArm = armors.find(a => a.id === player.equippedArmor?.id);
            const qty = eqArm?.quantity || 1;
            const stockMult = getStockBonus(qty);
            return (
            <div className="bg-[#7a9ac7] border-2 border-[#4a6fa5] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                  <span className="text-2xl">{player.equippedArmor.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold">{player.equippedArmor.name}</div>
                  <div className="text-green-300 text-sm mt-1">当前装备</div>
                  <div className="text-blue-300 text-xs mt-1">
                    DEF +{Math.floor(player.equippedArmor.defenseBonus * stockMult)}（x{qty}件）
                  </div>
                  {player.equippedArmor.hpBonus > 0 && (
                    <div className="text-green-300 text-xs">HP +{Math.floor(player.equippedArmor.hpBonus * stockMult)}</div>
                  )}
                  <div className="text-gray-300 text-xs">倍率: {Math.floor(player.equippedArmor.attributeRate * stockMult)}%</div>
                </div>
              </div>
            </div>
            );
          })()}

          {armors.filter(a => a.id !== player.equippedArmor?.id).length === 0 ? (
            <div className="text-center text-gray-400 py-8">暂无其他防具</div>
          ) : (
            armors.filter(a => a.id !== player.equippedArmor?.id).map(armor => {
              const stockMult = getStockBonus(armor.quantity);
              return (
              <div 
                key={armor.id}
                className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-2xl">{armor.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{armor.name}</div>
                    <div className="text-blue-300 text-sm mt-1">DEF +{Math.floor(armor.defenseBonus * stockMult)}</div>
                    {armor.hpBonus > 0 && (
                      <div className="text-green-300 text-xs">HP +{Math.floor(armor.hpBonus * stockMult)}</div>
                    )}
                    <div className="text-gray-300 text-xs mt-0.5">
                      数量: {armor.quantity}
                      {armor.quantity > 1 && <span className="text-yellow-300 ml-1">(+{(armor.quantity - 1) * 10}%)</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-400">倍率: {Math.floor(armor.attributeRate * stockMult)}%</div>
                    <button
                      onClick={() => handleEquip(armor)}
                      className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                    >
                      装备
                    </button>
                  </div>
                </div>
              </div>
              );
            }))
          }
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

  const renderAccessoryList = () => {
    const accessories = getInventoryAccessories();
    const equippedAccs = player.equippedAccessories || [];
    
    const getAvailableQuantity = (accessoryId: string, inventoryQty: number): number => {
      let equippedCount = 0;
      equippedAccs.forEach((acc, idx) => {
        if (acc.id === accessoryId) {
          if (idx !== selectedAccessorySlot) {
            equippedCount++;
          }
        }
      });
      return inventoryQty - equippedCount;
    };
    
    const availableAccessories = accessories
      .map(acc => ({
        ...acc,
        availableQty: getAvailableQuantity(acc.id, acc.quantity)
      }))
      .filter(acc => acc.availableQty > 0);
    
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md max-h-[90vh] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center">
          <span className="text-white font-bold text-lg">饰品列表</span>
          <button 
            onClick={() => setViewMode('main')}
            className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors"
          >
            返回
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {availableAccessories.length === 0 ? (
            <div className="text-center text-gray-400 py-8">暂无可装备的饰品</div>
          ) : (
            availableAccessories.map(accessory => (
              <div 
                key={accessory.id}
                className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-2xl">{accessory.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{accessory.name}</div>
                    {accessory.effectDescription && (
                      <div className="text-purple-300 text-sm mt-1">{accessory.effectDescription}</div>
                    )}
                    <div className="flex gap-1 mt-1">
                      {accessory.hpBonus > 0 && (
                        <span className="bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded text-xs">HP +{accessory.hpBonus}</span>
                      )}
                      {accessory.attackBonus > 0 && (
                        <span className="bg-red-900/50 text-red-300 px-1.5 py-0.5 rounded text-xs">ATK +{accessory.attackBonus}</span>
                      )}
                      {accessory.defenseBonus > 0 && (
                        <span className="bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded text-xs">DEF +{accessory.defenseBonus}</span>
                      )}
                    </div>
                    <div className="text-gray-300 text-xs mt-0.5">可用: {accessory.availableQty} / {accessory.quantity}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-400">属性倍率: {accessory.attributeRate}%</div>
                    <button
                      onClick={() => handleEquip(accessory)}
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

  const renderSoulList = () => {
    const souls = getInventorySouls();
    
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md max-h-[90vh] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center">
          <span className="text-white font-bold text-lg">魂列表</span>
          <button 
            onClick={() => setViewMode('main')}
            className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors"
          >
            返回
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {souls.length === 0 ? (
            <div className="text-center text-gray-400 py-8">暂无魂</div>
          ) : (
            souls.map(soul => (
              <div 
                key={soul.id}
                className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-2xl">{soul.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{soul.name}</div>
                    {soul.setumei && (
                      <div className="text-purple-300 text-sm mt-1">{soul.setumei}</div>
                    )}
                    <div className="flex gap-1 mt-1">
                      <span className="bg-yellow-900/50 text-yellow-300 px-1.5 py-0.5 rounded text-xs">属性值 +{soul.t1}</span>
                      <span className="bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded text-xs">百分比 +{soul.t2}%</span>
                    </div>
                    <div className="text-gray-300 text-xs mt-0.5">数量: {soul.quantity}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-400">属性倍率: {soul.attributeRate}%</div>
                    <button
                      onClick={() => handleEquip(soul)}
                      className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                    >
                      安装
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

  const renderMaterialList = () => {
    const materials = getInventoryMaterials();
    
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md max-h-[90vh] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center">
          <span className="text-white font-bold text-lg">材料列表</span>
          <button 
            onClick={() => setViewMode('main')}
            className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors"
          >
            返回
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {materials.length === 0 ? (
            <div className="text-center text-gray-400 py-8">暂无材料</div>
          ) : (
            materials.map(material => (
              <div 
                key={material.id}
                className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-2xl">{material.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{material.name}</div>
                    {material.setumei && (
                      <div className="text-gray-300 text-sm mt-1">{material.setumei}</div>
                    )}
                    <div className="text-gray-300 text-xs mt-0.5">数量: {material.quantity}</div>
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
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md max-h-[90vh] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-center">
          <button className="bg-[#4a6fa5] text-white font-bold py-2 px-6 rounded hover:bg-[#3a5a95] transition-colors">
            装备组合切换
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex items-start gap-2">
            <div className="bg-[#6a8ac5] text-white text-sm font-bold px-2 py-1 rounded mt-1 flex-shrink-0">武器</div>
            <div className="flex gap-2 flex-1">
              <div 
                onClick={() => {
                  setSelectedSoulSlot({ type: 'weapon', slot: 0 });
                  setViewMode('soul');
                }}
                className="w-10 h-10 bg-[#4a3a65] border-2 border-[#6a5a85] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#5a4a75] transition-colors flex-shrink-0"
              >
                <span className="text-lg">👻</span>
              </div>
              <div 
                onClick={() => setViewMode('weapon')}
                className="flex-1 bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-2 cursor-pointer hover:bg-[#5a7ab5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-xl">{player.equippedWeapon?.icon || '❓'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">{player.equippedWeapon?.name || '未装备'}</div>
                    {player.equippedWeapon && (
                      <div className="text-red-300 text-xs mt-1">
                        ATK {totalAttack} (+{bonuses.atkBonus})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="bg-[#6a8ac5] text-white text-sm font-bold px-2 py-1 rounded mt-1 flex-shrink-0">防具</div>
            <div className="flex gap-2 flex-1">
              <div 
                onClick={() => {
                  setSelectedSoulSlot({ type: 'armor', slot: 0 });
                  setViewMode('soul');
                }}
                className="w-10 h-10 bg-[#4a3a65] border-2 border-[#6a5a85] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#5a4a75] transition-colors flex-shrink-0"
              >
                <span className="text-lg">👻</span>
              </div>
              <div 
                onClick={() => setViewMode('armor')}
                className="flex-1 bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-2 cursor-pointer hover:bg-[#5a7ab5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <span className="text-xl">{player.equippedArmor?.icon || '❓'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">{player.equippedArmor?.name || '未装备'}</div>
                    {player.equippedArmor && (
                      <div className="text-blue-300 text-xs mt-1">
                        DEF {totalDefense} (+{bonuses.defBonus})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#5a7aa5] px-2 py-1 rounded text-white text-xs font-bold">饰品</div>

          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3, 4, 5].map(slotIndex => {
              const accessory = (player.equippedAccessories || [])[slotIndex];
              const isUnlocked = slotIndex < totalAccessorySlots;
              
              return (
              <div key={`big-${slotIndex}`} className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-2">
                {accessory ? (
                  <div 
                    onClick={() => {
                      setSelectedAccessorySlot(slotIndex);
                      setViewMode('accessory');
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-[#5a7ab5] rounded"
                  >
                    <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                      <span className="text-xl">{accessory.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-xs">{accessory.name}</div>
                      {accessory.effectDescription && (
                        <div className="text-gray-200 text-xs mt-0.5 truncate">{accessory.effectDescription}</div>
                      )}
                      {(accessory.hpBonus > 0 || accessory.attackBonus > 0 || accessory.defenseBonus > 0) && (
                        <div className="flex gap-1 mt-0.5">
                          {accessory.hpBonus > 0 && (
                            <span className="bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded text-xs">HP +{accessory.hpBonus}</span>
                          )}
                          {accessory.attackBonus > 0 && (
                            <span className="bg-red-900/50 text-red-300 px-1.5 py-0.5 rounded text-xs">ATK +{accessory.attackBonus}</span>
                          )}
                          {accessory.defenseBonus > 0 && (
                            <span className="bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded text-xs">DEF +{accessory.defenseBonus}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : isUnlocked ? (
                  <div 
                    onClick={() => {
                      setSelectedAccessorySlot(slotIndex);
                      setViewMode('accessory');
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-[#5a7ab5] rounded"
                  >
                    <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                      <span className="text-lg">🔒</span>
                    </div>
                    <div className="text-gray-300 text-xs font-bold">空栏位 {slotIndex + 1}</div>
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      setUnlockingSlotIndex(slotIndex);
                      setShowUnlockConfirm(true);
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-[#5a7ab5]/50 rounded"
                  >
                    <div className="w-10 h-10 bg-[#3a4a55] rounded flex items-center justify-center">
                      <span className="text-lg">🔒</span>
                    </div>
                    <div className="text-gray-400 text-xs">未解锁 饰孔{slotIndex + 1}</div>
                  </div>
                )}
              </div>
              );
            })}
          </div>

          <div className="grid grid-cols-6 gap-1">
            {[6, 7, 8, 9, 10, 11].map(slotIndex => {
              const accessory = (player.equippedAccessories || [])[slotIndex];
              const isUnlocked = slotIndex < totalAccessorySlots;
              
              return (
              <div key={`small-${slotIndex}`} className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded p-1">
                {accessory ? (
                  <div 
                    onClick={() => {
                      setSelectedAccessorySlot(slotIndex);
                      setViewMode('accessory');
                    }}
                    className="flex flex-col items-center cursor-pointer hover:bg-[#5a7ab5] rounded"
                  >
                    <div className="w-8 h-8 bg-[#4a6fa5] rounded flex items-center justify-center">
                      <span className="text-sm">{accessory.icon}</span>
                    </div>
                    <div className="text-white text-xs mt-0.5 truncate w-full text-center">{accessory.name}</div>
                  </div>
                ) : isUnlocked ? (
                  <div 
                    onClick={() => {
                      setSelectedAccessorySlot(slotIndex);
                      setViewMode('accessory');
                    }}
                    className="flex flex-col items-center cursor-pointer hover:bg-[#5a7ab5] rounded"
                  >
                    <div className="w-8 h-8 bg-[#4a6fa5] rounded flex items-center justify-center">
                      <span className="text-sm">🔒</span>
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">{slotIndex + 1}</div>
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      setUnlockingSlotIndex(slotIndex);
                      setShowUnlockConfirm(true);
                    }}
                    className="flex flex-col items-center cursor-pointer hover:bg-[#5a7ab5]/50 rounded"
                  >
                    <div className="w-8 h-8 bg-[#3a4a55] rounded flex items-center justify-center">
                      <span className="text-sm">🔒</span>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>

          <div className="bg-[#5a7aa5] px-2 py-1 rounded text-white text-xs font-bold flex items-center justify-between">
            <span>属性</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setViewMode('material')}
                className="w-6 h-6 bg-[#4a6fa5] rounded flex items-center justify-center text-xs hover:bg-[#3a5a95] cursor-pointer"
              >M</button>
              <button className="w-6 h-6 bg-[#4a6fa5] rounded flex items-center justify-center text-xs">?</button>
            </div>
          </div>

          <div className="bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-white">HP</span>
              <span className="text-green-300">{player.maxHp}(+{bonuses.hpBonus})</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white">ATK</span>
              <span className="text-red-300">{totalAttack}(+{bonuses.atkBonus})</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white">DEF</span>
              <span className="text-blue-300">{totalDefense}(+{bonuses.defBonus})</span>
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
    
    const currentTotalAtk = player.attack + bonuses.atkBonus;
    const currentTotalDef = player.defense + bonuses.defBonus;
    const currentTotalHp = player.maxHp + bonuses.hpBonus;
    
    let newTotalAtk = currentTotalAtk;
    let newTotalDef = currentTotalDef;
    let newTotalHp = currentTotalHp;
    
    if (confirmEquipment.type === 'weapon') {
      const oldWeaponBonus = player.equippedWeapon?.attackBonus || 0;
      newTotalAtk = currentTotalAtk - oldWeaponBonus + confirmEquipment.attackBonus;
    } else if (confirmEquipment.type === 'armor') {
      const oldArmorDefBonus = player.equippedArmor?.defenseBonus || 0;
      const oldArmorHpBonus = player.equippedArmor?.hpBonus || 0;
      newTotalDef = currentTotalDef - oldArmorDefBonus + confirmEquipment.defenseBonus;
      newTotalHp = currentTotalHp - oldArmorHpBonus + confirmEquipment.hpBonus;
    } else if (confirmEquipment.type === 'accessory') {
      newTotalAtk += confirmEquipment.attackBonus;
      newTotalDef += confirmEquipment.defenseBonus;
      newTotalHp += confirmEquipment.hpBonus;
    }
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-4">
              {confirmEquipment.type === 'soul' ? '安装' : '装备'} {confirmEquipment.name} 吗？
            </div>
            
            {(confirmEquipment.type === 'weapon' || confirmEquipment.type === 'armor' || confirmEquipment.type === 'accessory') && (
              <div className="space-y-2 mb-4">
                {confirmEquipment.type === 'weapon' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">现在的 ATK:</span>
                      <span className="text-white">{currentTotalAtk}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">装备后的 ATK:</span>
                      <span className={`${newTotalAtk > currentTotalAtk ? 'text-green-400' : newTotalAtk < currentTotalAtk ? 'text-red-400' : 'text-white'}`}>
                        {newTotalAtk}
                      </span>
                    </div>
                  </>
                )}
                
                {confirmEquipment.type === 'armor' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">现在的 DEF:</span>
                      <span className="text-white">{currentTotalDef}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">装备后的 DEF:</span>
                      <span className={`${newTotalDef > currentTotalDef ? 'text-green-400' : newTotalDef < currentTotalDef ? 'text-red-400' : 'text-white'}`}>
                        {newTotalDef}
                      </span>
                    </div>
                    {currentTotalHp !== 0 || newTotalHp !== 0 ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">现在的 HP:</span>
                          <span className="text-white">{currentTotalHp}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">装备后的 HP:</span>
                          <span className={`${newTotalHp > currentTotalHp ? 'text-green-400' : newTotalHp < currentTotalHp ? 'text-red-400' : 'text-white'}`}>
                            {newTotalHp}
                          </span>
                        </div>
                      </>
                    ) : null}
                  </>
                )}
                
                {confirmEquipment.type === 'accessory' && (
                  <>
                    {(currentTotalAtk !== 0 || newTotalAtk !== currentTotalAtk) && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">现在的 ATK:</span>
                          <span className="text-white">{currentTotalAtk}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">装备后的 ATK:</span>
                          <span className={`${newTotalAtk > currentTotalAtk ? 'text-green-400' : newTotalAtk < currentTotalAtk ? 'text-red-400' : 'text-white'}`}>
                            {newTotalAtk}
                          </span>
                        </div>
                      </>
                    )}
                    {(currentTotalDef !== 0 || newTotalDef !== currentTotalDef) && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">现在的 DEF:</span>
                          <span className="text-white">{currentTotalDef}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">装备后的 DEF:</span>
                          <span className={`${newTotalDef > currentTotalDef ? 'text-green-400' : newTotalDef < currentTotalDef ? 'text-red-400' : 'text-white'}`}>
                            {newTotalDef}
                          </span>
                        </div>
                      </>
                    )}
                    {(currentTotalHp !== 0 || newTotalHp !== currentTotalHp) && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">现在的 HP:</span>
                          <span className="text-white">{currentTotalHp}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">装备后的 HP:</span>
                          <span className={`${newTotalHp > currentTotalHp ? 'text-green-400' : newTotalHp < currentTotalHp ? 'text-red-400' : 'text-white'}`}>
                            {newTotalHp}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
            
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
      {viewMode === 'accessory' && renderAccessoryList()}
      {viewMode === 'soul' && renderSoulList()}
      {viewMode === 'material' && renderMaterialList()}
      {viewMode === 'main' && renderMainView()}
      {renderConfirmDialog()}
      
      {showUnlockConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-2">解锁饰孔 {unlockingSlotIndex + 1}？</div>
              <div className="text-gray-300 mb-4">需要 {nextSlotPrice.toLocaleString()} G</div>
              <div className="flex gap-3">
                <button
                  onClick={handleUnlockSlot}
                  className="flex-1 bg-yellow-600 text-white font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  解锁
                </button>
                <button
                  onClick={() => setShowUnlockConfirm(false)}
                  className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showGoldError && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-bold">
          金币不足！
        </div>
      )}
    </>
  );
};
