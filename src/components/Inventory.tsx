import { useState, useEffect } from 'react';
import { useGameStore, isPassiveEffectItem } from '@/stores/gameStore';
import { equipmentData } from '@/data/equipment';
import { SpriteIcon } from './SpriteIcon';
import { useEquipmentName } from '@/hooks/useEquipmentName';
import { useEquipmentDescription } from '@/hooks/useEquipmentDescription';
import { useTranslation } from '@/hooks/useTranslation';

interface InventoryProps {
  onClose: () => void;
}

type ViewMode = 'main' | 'weapon' | 'armor' | 'accessory' | 'soul' | 'material';

export const Inventory = ({ onClose }: InventoryProps) => {
  const { getEquipName } = useEquipmentName();
  const { getEquipDescription } = useEquipmentDescription();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedAccessorySlot, setSelectedAccessorySlot] = useState<number | null>(null);
  const [selectedSoulSlot, setSelectedSoulSlot] = useState<{ type: 'weapon' | 'armor'; slot: number } | null>(null);
  const [confirmEquipment, setConfirmEquipment] = useState<typeof equipmentData[0] | null>(null);
  const [detailEquipment, setDetailEquipment] = useState<(typeof equipmentData[0] & { quantity?: number }) | null>(null);
  const [unlockingSlotIndex, setUnlockingSlotIndex] = useState<number>(0);
  const [weaponSearch, setWeaponSearch] = useState('');
  const [armorSearch, setArmorSearch] = useState('');
  const [accessorySearch, setAccessorySearch] = useState('');
  const player = useGameStore(state => state.player);
  const inventory = useGameStore(state => state.inventory);
  const equipItem = useGameStore(state => state.equipItem);
  const buyEquipment = useGameStore(state => state.buyEquipment);
  const purchaseCounts = useGameStore(state => state.purchaseCounts);
  const unlockAccessorySlot = useGameStore(state => state.unlockAccessorySlot);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const [showGoldError, setShowGoldError] = useState(false);
  const [purchaseConfirmSlot, setPurchaseConfirmSlot] = useState<number | null>(null);
  const equipSets = useGameStore(state => state.equipSets);
  const loadEquipSet = useGameStore(state => state.loadEquipSet);
  const purchaseEquipSet = useGameStore(state => state.purchaseEquipSet);
  const getEquipSetPrice = useGameStore(state => state.getEquipSetPrice);
  const [activeEquipSetSlot, setActiveEquipSetSlot] = useState(0);

  // Auto-equip without confirmation dialog when no stat changes
  useEffect(() => {
    if (!confirmEquipment || confirmEquipment.type === 'soul') return;

    const currentTotalAtk = player.attack + bonuses.atkBonus;
    const currentTotalDef = player.defense + bonuses.defBonus;
    const currentTotalHp = player.maxHp + bonuses.hpBonus;
    const currentTotalAgi = player.agility + bonuses.agiBonus;
    const currentTotalLuc = player.luck + bonuses.lucBonus;

    let hasChange = true;

    if (confirmEquipment.type === 'weapon') {
      const oldWeaponBonus = player.equippedWeapon?.attackBonus || 0;
      const newTotalAtk = currentTotalAtk - oldWeaponBonus + confirmEquipment.attackBonus;
      hasChange = newTotalAtk !== currentTotalAtk;
    } else if (confirmEquipment.type === 'armor') {
      const oldArmorDefBonus = player.equippedArmor?.defenseBonus || 0;
      const oldArmorHpBonus = player.equippedArmor?.hpBonus || 0;
      const newTotalDef = currentTotalDef - oldArmorDefBonus + confirmEquipment.defenseBonus;
      const newTotalHp = currentTotalHp - oldArmorHpBonus + confirmEquipment.hpBonus;
      hasChange = newTotalDef !== currentTotalDef || newTotalHp !== currentTotalHp;
    } else if (confirmEquipment.type === 'accessory') {
      const newTotalAtk = currentTotalAtk + confirmEquipment.attackBonus;
      const newTotalDef = currentTotalDef + confirmEquipment.defenseBonus;
      const newTotalHp = currentTotalHp + confirmEquipment.hpBonus;
      const newTotalAgi = currentTotalAgi + confirmEquipment.agilityBonus;
      const newTotalLuc = currentTotalLuc + confirmEquipment.luckBonus;
      hasChange = newTotalAtk !== currentTotalAtk || newTotalDef !== currentTotalDef ||
        newTotalHp !== currentTotalHp || newTotalAgi !== currentTotalAgi ||
        newTotalLuc !== currentTotalLuc;
    }

    if (!hasChange) {
      handleConfirmEquip();
    }
  }, [confirmEquipment]);

  const getTotalBonus = () => {
    let atkBonus = 0;
    let defBonus = 0;
    let hpBonus = 0;
    let agiBonus = 0;
    let lucBonus = 0;
    
    if (player.equippedWeapon) {
      atkBonus += player.equippedWeapon.attackBonus;
    }
    if (player.equippedArmor) {
      defBonus += player.equippedArmor.defenseBonus;
      hpBonus += player.equippedArmor.hpBonus;
    }
    (player.equippedAccessories || []).forEach(acc => {
      if (!acc) return;
      atkBonus += acc.attackBonus;
      defBonus += acc.defenseBonus;
      hpBonus += acc.hpBonus;
      agiBonus += acc.agilityBonus;
      lucBonus += acc.luckBonus;
    });
    
    return { atkBonus, defBonus, hpBonus, agiBonus, lucBonus };
  };

  const bonuses = getTotalBonus();
  const totalAttack = player.attack + bonuses.atkBonus;
  const totalDefense = player.defense + bonuses.defBonus;

  const unlockedSlots = player.unlockedAccessorySlots || [true, true, true, false, false, false, false, false, false, false, false, false];

  

  const handleUnlockSlot = () => {
    const success = unlockAccessorySlot(unlockingSlotIndex);
    if (!success) {
      setShowGoldError(true);
      setTimeout(() => setShowGoldError(false), 2000);
    }
    setShowUnlockConfirm(false);
  };

  const handleBuy = (equipmentId: string) => {
    const success = buyEquipment(equipmentId);
    if (!success) {
      setShowGoldError(true);
      setTimeout(() => setShowGoldError(false), 2000);
    }
  };

  const getCurrentPrice = (equipment: typeof equipmentData[0]) => {
    const count = purchaseCounts[equipment.id] || 0;
    return Math.ceil(equipment.price * (1 + count * 0.1));
  };

  const getFullWeaponList = () => {
    return equipmentData
      .filter(e => e.type === 'weapon')
      .map(e => {
        const invItem = inventory.find(item => item.equipmentId === e.id);
        return { ...e, quantity: invItem?.quantity || 0 };
      })
      .filter(e => e.quantity > 0 || e.price > 0);
  };

  const getFullArmorList = () => {
    return equipmentData
      .filter(e => e.type === 'armor')
      .map(e => {
        const invItem = inventory.find(item => item.equipmentId === e.id);
        return { ...e, quantity: invItem?.quantity || 0 };
      })
      .filter(e => e.quantity > 0 || e.price > 0);
  };

  const getSlotMaxRank = (slot: number): number => {
    if (slot <= 5) return 3; // 1-6号槽位：所有星级 (R1-R4)
    if (slot <= 7) return 2; // 7-8号槽位：3星及以下 (R1-R3)
    if (slot <= 9) return 1; // 9-10号槽位：2星及以下 (R1-R2)
    return 0; // 11-12号槽位：1星 (R1)
  };

  const getFullAccessoryList = () => {
    const slotRank = selectedAccessorySlot !== null ? getSlotMaxRank(selectedAccessorySlot) : 3;
    return equipmentData
      .filter(e => e.type === 'accessory' && (e.rank ?? -1) <= slotRank && !isPassiveEffectItem(e.id))
      .map(e => {
        const invItem = inventory.find(item => item.equipmentId === e.id);
        return { ...e, quantity: invItem?.quantity || 0 };
      })
      .filter(e => e.quantity > 0 || e.price > 0);
  };

  const getFullSoulList = () => {
    return equipmentData
      .filter(e => e.type === 'soul')
      .map(e => {
        const invItem = inventory.find(item => item.equipmentId === e.id);
        return { ...e, quantity: invItem?.quantity || 0 };
      });
  };

  const getFullMaterialList = () => {
    return equipmentData
      .filter(e => e.type === 'material')
      .map(e => {
        const invItem = inventory.find(item => item.equipmentId === e.id);
        return { ...e, quantity: invItem?.quantity || 0 };
      });
  };

  const handleEquip = (equipment: typeof equipmentData[0]) => {
    setConfirmEquipment(equipment);
  };

  const handleConfirmEquip = () => {
    if (confirmEquipment) {
      let slotIndex: number | undefined = selectedAccessorySlot ?? undefined;
      if (confirmEquipment.type === 'soul' && selectedSoulSlot) {
        slotIndex = selectedSoulSlot.type === 'weapon' ? 14 : 15;
      }
      equipItem(confirmEquipment, slotIndex);
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
    const weapons = getFullWeaponList();
    
    return (
      <div className="weapon-list-container bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md h-[min(750px,92vh)] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center shrink-0">
          <span className="text-white font-bold text-lg flex-shrink-0">{t('武器列表')}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={weaponSearch}
              onChange={(e) => {
                setWeaponSearch(e.target.value);
                console.log('[Inventory] Weapon search:', e.target.value);
                const listEl = document.querySelector('.weapon-list-container');
                if (listEl) {
                  console.log('[Inventory] Weapon list container rect:', listEl.getBoundingClientRect());
                }
              }}
              placeholder={t('搜索')}
              className="bg-[#4a6fa5] text-white placeholder-gray-400 px-2 py-1 rounded text-sm w-24"
            />
            <button 
              onClick={() => setViewMode('main')}
              className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors flex-shrink-0"
            >
              {t('返回')}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {weapons.filter(weapon => {
            if (!weaponSearch) return true;
            const searchLower = weaponSearch.toLowerCase();
            return getEquipName(weapon.name).toLowerCase().includes(searchLower);
          }).map(weapon => {
            const isEquipped = player.equippedWeapon?.id === weapon.id;
            const isOwned = weapon.quantity > 0;
            
            return (
              <div 
                key={weapon.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  setDetailEquipment(weapon);
                }}
                className={`rounded-lg p-3 cursor-pointer ${
                  isEquipped 
                    ? 'bg-[#7a9ac7] border-2 border-[#4a6fa5]' 
                    : isOwned 
                      ? 'bg-[#6a8ac5] border-2 border-[#4a6fa5]'
                      : 'bg-[#4a5a75] border-2 border-[#3a4a65] opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-[#4a6fa5] rounded flex items-center justify-center flex-shrink-0">
                    <SpriteIcon type="weapon" x={weapon.x} y={weapon.y} size="large" bit32={weapon.bit32} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{getEquipName(weapon.name)}</div>
                    {isEquipped && <div className="text-green-300 text-sm mt-1">{t('当前装备')}</div>}
                    {!isOwned && (
                      <div>
                        <div className="text-gray-400 text-sm mt-1">{t('未拥有')}</div>
                        <div className="text-red-300 text-sm mt-0.5">ATK +{weapon.attackBonus}</div>
                      </div>
                    )}
                    {isOwned && (
                      <>
                        <div className="text-red-300 text-sm mt-1">ATK +{weapon.attackBonus}</div>
                        <div className="text-gray-300 text-xs mt-0.5">
                          {t('数量')}: {weapon.quantity}
                          {weapon.quantity > 1 && <span className="text-yellow-300 ml-1">(+{(weapon.quantity - 1) * 10}%)</span>}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isOwned ? (
                      <>
                        <div className="text-xs text-green-400">{t('倍率')}: {weapon.attributeRate}%</div>
                        {!isEquipped && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEquip(weapon); }}
                            className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                          >
                            {t('装备')}
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuy(weapon.id); }}
                        className="bg-yellow-600 text-white font-bold py-1 px-3 rounded hover:bg-yellow-500 transition-colors text-xs"
                      >
                        {t('购买')} {getCurrentPrice(weapon).toLocaleString()}G
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#5a7aa5] px-4 py-3 border-t-2 border-[#4a6fa5]">
          <button
            onClick={() => setViewMode('main')}
            className="w-full bg-[#4a6fa5] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a95] transition-colors text-lg"
          >
            {t('返回')}
          </button>
        </div>
      </div>
    );
  };

  const renderArmorList = () => {
    const armors = getFullArmorList();
    
    return (
      <div className="armor-list-container bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md h-[min(750px,92vh)] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center shrink-0">
          <span className="text-white font-bold text-lg flex-shrink-0">{t('防具列表')}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={armorSearch}
              onChange={(e) => {
                setArmorSearch(e.target.value);
                console.log('[Inventory] Armor search:', e.target.value);
                const listEl = document.querySelector('.armor-list-container');
                if (listEl) {
                  console.log('[Inventory] Armor list container rect:', listEl.getBoundingClientRect());
                }
              }}
              placeholder={t('搜索')}
              className="bg-[#4a6fa5] text-white placeholder-gray-400 px-2 py-1 rounded text-sm w-24"
            />
            <button 
              onClick={() => setViewMode('main')}
              className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors flex-shrink-0"
            >
              {t('返回')}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {armors.filter(armor => {
            if (!armorSearch) return true;
            const searchLower = armorSearch.toLowerCase();
            return getEquipName(armor.name).toLowerCase().includes(searchLower);
          }).map(armor => {
            const isEquipped = player.equippedArmor?.id === armor.id;
            const isOwned = armor.quantity > 0;
            
            return (
              <div 
                key={armor.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  setDetailEquipment(armor);
                }}
                className={`rounded-lg p-3 cursor-pointer ${
                  isEquipped 
                    ? 'bg-[#7a9ac7] border-2 border-[#4a6fa5]' 
                    : isOwned 
                      ? 'bg-[#6a8ac5] border-2 border-[#4a6fa5]'
                      : 'bg-[#4a5a75] border-2 border-[#3a4a65] opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-[#4a6fa5] rounded flex items-center justify-center flex-shrink-0">
                    <SpriteIcon type="armor" x={armor.x} y={armor.y} size="large" bit32={armor.bougu32png} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{getEquipName(armor.name)}</div>
                    {isEquipped && <div className="text-green-300 text-sm mt-1">{t('当前装备')}</div>}
                    {!isOwned && (
                      <div>
                        <div className="text-gray-400 text-sm mt-1">{t('未拥有')}</div>
                        <div className="text-blue-300 text-sm mt-0.5">DEF +{armor.defenseBonus}</div>
                        {armor.hpBonus > 0 && <div className="text-green-300 text-xs">HP +{armor.hpBonus}</div>}
                      </div>
                    )}
                    {isOwned && (
                      <>
                        <div className="text-blue-300 text-sm mt-1">DEF +{armor.defenseBonus}</div>
                        {armor.hpBonus > 0 && (
                          <div className="text-green-300 text-xs">HP +{armor.hpBonus}</div>
                        )}
                        <div className="text-gray-300 text-xs mt-0.5">
                          {t('数量')}: {armor.quantity}
                          {armor.quantity > 1 && <span className="text-yellow-300 ml-1">(+{(armor.quantity - 1) * 10}%)</span>}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isOwned ? (
                      <>
                        <div className="text-xs text-green-400">{t('倍率')}: {armor.attributeRate}%</div>
                        {!isEquipped && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEquip(armor); }}
                            className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                          >
                            {t('装备')}
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuy(armor.id); }}
                        className="bg-yellow-600 text-white font-bold py-1 px-3 rounded hover:bg-yellow-500 transition-colors text-xs"
                      >
                        {t('购买')} {getCurrentPrice(armor).toLocaleString()}G
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#5a7aa5] px-4 py-3 border-t-2 border-[#4a6fa5]">
          <button
            onClick={() => setViewMode('main')}
            className="w-full bg-[#4a6fa5] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a95] transition-colors text-lg"
          >
            {t('返回')}
          </button>
        </div>
      </div>
    );
  };

  const renderAccessoryList = () => {
    const accessories = getFullAccessoryList();
    const equippedAccs = player.equippedAccessories || [];
    
    const getAvailableQuantity = (accessoryId: string, inventoryQty: number): number => {
      let equippedCount = 0;
      equippedAccs.forEach((acc, idx) => {
        if (!acc) return;
        if (acc.id === accessoryId) {
          if (idx !== selectedAccessorySlot) {
            equippedCount++;
          }
        }
      });
      return inventoryQty - equippedCount;
    };
    
    return (
      <div className="accessory-list-container bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md h-[min(750px,92vh)] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center shrink-0">
          <span className="text-white font-bold text-lg flex-shrink-0">{t('饰品列表')}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={accessorySearch}
              onChange={(e) => {
                setAccessorySearch(e.target.value);
                console.log('[Inventory] Accessory search:', e.target.value);
                const listEl = document.querySelector('.accessory-list-container');
                if (listEl) {
                  console.log('[Inventory] Accessory list container rect:', listEl.getBoundingClientRect());
                }
              }}
              placeholder={t('搜索')}
              className="bg-[#4a6fa5] text-white placeholder-gray-400 px-2 py-1 rounded text-sm w-24"
            />
            <button 
              onClick={() => setViewMode('main')}
              className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors flex-shrink-0"
            >
              {t('返回')}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {accessories.filter(accessory => {
            if (!accessorySearch) return true;
            const searchLower = accessorySearch.toLowerCase();
            return getEquipName(accessory.name).toLowerCase().includes(searchLower);
          }).map(accessory => {
            const isEquipped = equippedAccs.some(acc => acc && acc.id === accessory.id);
            const isOwned = accessory.quantity > 0;
            const availableQty = getAvailableQuantity(accessory.id, accessory.quantity);
            const canEquipMore = availableQty > 0;
            
            return (
              <div 
                key={accessory.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  setDetailEquipment(accessory);
                }}
                className={`rounded-lg p-3 cursor-pointer ${
                  isEquipped 
                    ? 'bg-[#7a9ac7] border-2 border-[#4a6fa5]' 
                    : isOwned 
                      ? 'bg-[#6a8ac5] border-2 border-[#4a6fa5]'
                      : 'bg-[#4a5a75] border-2 border-[#3a4a65] opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-[#4a6fa5] rounded flex items-center justify-center flex-shrink-0">
                    <SpriteIcon type="accessory" x={accessory.x} y={accessory.y} size="large" image={accessory.image} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{getEquipName(accessory.name)}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span key={i} className={`text-xs ${i <= (accessory.rank ?? 0) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                      ))}
                    </div>
                    {isEquipped && <div className="text-green-300 text-sm mt-1">{t('当前装备')} {equippedAccs.filter(a => a && a.id === accessory.id).length}{t('件')}</div>}
                    {!isOwned && (
                      <div>
                        <div className="text-gray-400 text-sm mt-1">{t('未拥有')}</div>
                        {accessory.setumei && (
                          <div className="text-purple-300 text-sm mt-1">{getEquipDescription(accessory.setumei, accessory.t1, accessory.t2)}</div>
                        )}
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {accessory.hpBonus > 0 && (
                            <span className="bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded text-xs">HP +{accessory.hpBonus}</span>
                          )}
                          {accessory.attackBonus > 0 && (
                            <span className="bg-red-900/50 text-red-300 px-1.5 py-0.5 rounded text-xs">ATK +{accessory.attackBonus}</span>
                          )}
                          {accessory.defenseBonus > 0 && (
                            <span className="bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded text-xs">DEF +{accessory.defenseBonus}</span>
                          )}
                          {accessory.agilityBonus > 0 && (
                            <span className="bg-cyan-900/50 text-cyan-300 px-1.5 py-0.5 rounded text-xs">AGI +{accessory.agilityBonus}</span>
                          )}
                          {accessory.luckBonus > 0 && (
                            <span className="bg-yellow-900/50 text-yellow-300 px-1.5 py-0.5 rounded text-xs">LUC +{accessory.luckBonus}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {isOwned && (
                      <>
                        {accessory.setumei && (
                          <div className="text-purple-300 text-sm mt-1">{getEquipDescription(accessory.setumei, accessory.t1, accessory.t2)}</div>
                        )}
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {accessory.hpBonus > 0 && (
                            <span className="bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded text-xs">HP +{accessory.hpBonus}</span>
                          )}
                          {accessory.attackBonus > 0 && (
                            <span className="bg-red-900/50 text-red-300 px-1.5 py-0.5 rounded text-xs">ATK +{accessory.attackBonus}</span>
                          )}
                          {accessory.defenseBonus > 0 && (
                            <span className="bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded text-xs">DEF +{accessory.defenseBonus}</span>
                          )}
                          {accessory.agilityBonus > 0 && (
                            <span className="bg-cyan-900/50 text-cyan-300 px-1.5 py-0.5 rounded text-xs">AGI +{accessory.agilityBonus}</span>
                          )}
                          {accessory.luckBonus > 0 && (
                            <span className="bg-yellow-900/50 text-yellow-300 px-1.5 py-0.5 rounded text-xs">LUC +{accessory.luckBonus}</span>
                          )}
                        </div>
                        <div className="text-gray-300 text-xs mt-0.5">{t('数量')}: {accessory.quantity}</div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isOwned ? (
                      canEquipMore ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEquip(accessory); }}
                          className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                        >
                          {t('装备')}
                        </button>
                      ) : (
                        <div className="text-xs text-gray-400">{t('全部已装备')}</div>
                      )
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuy(accessory.id); }}
                        className="bg-yellow-600 text-white font-bold py-1 px-3 rounded hover:bg-yellow-500 transition-colors text-xs"
                      >
                        {t('购买')} {getCurrentPrice(accessory).toLocaleString()}G
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#5a7aa5] px-4 py-3 border-t-2 border-[#4a6fa5]">
          <button
            onClick={() => setViewMode('main')}
            className="w-full bg-[#4a6fa5] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a95] transition-colors text-lg"
          >
            {t('返回')}
          </button>
        </div>
      </div>
    );
  };

  const renderSoulList = () => {
    const souls = getFullSoulList();
    
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md h-[min(750px,92vh)] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center">
          <span className="text-white font-bold text-lg">{t('魂列表')}</span>
          <button 
            onClick={() => setViewMode('main')}
            className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors"
          >
            {t('返回')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {souls.map(soul => {
            const isOwned = soul.quantity > 0;
            
            return (
              <div 
                key={soul.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  setDetailEquipment(soul);
                }}
                className={`rounded-lg p-3 cursor-pointer ${
                  isOwned 
                    ? 'bg-[#6a8ac5] border-2 border-[#4a6fa5]'
                    : 'bg-[#4a5a75] border-2 border-[#3a4a65] opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                    <SpriteIcon type="soul" x={soul.x} y={soul.y} size="medium" image={soul.image} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{getEquipName(soul.name)}</div>
                    {!isOwned && (
                      <div>
                        <div className="text-gray-400 text-sm mt-1">{t('未拥有')}</div>
                        {soul.setumei && (
                          <div className="text-purple-300 text-sm mt-1">{getEquipDescription(soul.setumei, soul.t1, soul.t2)}</div>
                        )}
                        <div className="flex gap-1 mt-1">
                          <span className="bg-yellow-900/50 text-yellow-300 px-1.5 py-0.5 rounded text-xs">{t('属性值')} +{soul.t1}</span>
                          <span className="bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded text-xs">{t('百分比')} +{soul.t2}%</span>
                        </div>
                      </div>
                    )}
                    {isOwned && (
                      <>
                        {soul.setumei && (
                          <div className="text-purple-300 text-sm mt-1">{getEquipDescription(soul.setumei, soul.t1, soul.t2)}</div>
                        )}
                        <div className="flex gap-1 mt-1">
                          <span className="bg-yellow-900/50 text-yellow-300 px-1.5 py-0.5 rounded text-xs">{t('属性值')} +{soul.t1}</span>
                          <span className="bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded text-xs">{t('百分比')} +{soul.t2}%</span>
                        </div>
                        <div className="text-gray-300 text-xs mt-0.5">{t('数量')}: {soul.quantity}</div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isOwned ? (
                      <>
                        <div className="text-xs text-gray-400">{t('倍率')}: {soul.attributeRate}%</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEquip(soul); }}
                          className="bg-[#4a6fa5] text-white font-bold py-1 px-3 rounded hover:bg-[#3a5a95] transition-colors text-xs"
                        >
                          {t('安装')} {soul.price.toLocaleString()}G
                        </button>
                      </>
                    ) : (
                      <div className="text-xs text-gray-400">{t('未拥有')}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#5a7aa5] px-4 py-3 border-t-2 border-[#4a6fa5]">
          <button
            onClick={() => setViewMode('main')}
            className="w-full bg-[#4a6fa5] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a95] transition-colors text-lg"
          >
            {t('返回')}
          </button>
        </div>
      </div>
    );
  };

  const renderMaterialList = () => {
    const materials = getFullMaterialList();
    
    return (
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md h-[min(750px,92vh)] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center">
          <span className="text-white font-bold text-lg">{t('材料列表')}</span>
          <button 
            onClick={() => setViewMode('main')}
            className="bg-[#4a6fa5] text-white font-bold py-1 px-4 rounded hover:bg-[#3a5a95] transition-colors"
          >
            {t('返回')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {materials.map(material => {
            const isOwned = material.quantity > 0;
            
            return (
              <div 
                key={material.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  setDetailEquipment(material);
                }}
                className={`rounded-lg p-3 cursor-pointer ${
                  isOwned 
                    ? 'bg-[#6a8ac5] border-2 border-[#4a6fa5]'
                    : 'bg-[#4a5a75] border-2 border-[#3a4a65] opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                    {material.x !== undefined && material.y !== undefined ? (
                      <SpriteIcon type="material" x={material.x} y={material.y} size="medium" bit32={material.bit32} />
                    ) : (
                      <span className="text-xl">{material.icon}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{getEquipName(material.name)}</div>
                    {!isOwned && (
                      <div>
                        <div className="text-gray-400 text-sm mt-1">{t('未拥有')}</div>
                        {material.setumei && (
                          <div className="text-gray-300 text-sm mt-1">{getEquipDescription(material.setumei, material.t1, material.t2)}</div>
                        )}
                      </div>
                    )}
                    {isOwned && (
                      <>
                        {material.setumei && (
                          <div className="text-gray-300 text-sm mt-1">{getEquipDescription(material.setumei, material.t1, material.t2)}</div>
                        )}
                        <div className="text-gray-300 text-xs mt-0.5">{t('数量')}: {material.quantity}</div>
                      </>
                    )}
                  </div>
                  {!isOwned && material.price > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBuy(material.id); }}
                      className="bg-yellow-600 text-white font-bold py-1 px-3 rounded hover:bg-yellow-500 transition-colors text-xs"
                    >
                      {t('购买')} {getCurrentPrice(material).toLocaleString()}G
                    </button>
                  )}
                  {!isOwned && material.price <= 0 && (
                    <div className="text-xs text-gray-400">{t('无法购买')}</div>
                  )}
                </div>
              </div>
            );
          })}
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
      <div className="bg-[#87a4c7] border-4 border-[#4a6fa5] rounded-lg w-[95%] max-w-md h-[min(750px,92vh)] flex flex-col">
        <div className="bg-[#5a7aa5] px-4 py-2 border-b-2 border-[#4a6fa5] flex justify-between items-center">
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => {
              const set = equipSets.find(s => s.slotIndex === i);
              const isUnlocked = i === 0 || set?.unlocked;
              
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (set && set.unlocked) {
                      loadEquipSet(set.id);
                      setActiveEquipSetSlot(i);
                    } else if (!isUnlocked) {
                      setPurchaseConfirmSlot(i);
                    }
                  }}
                  className={`font-bold py-1.5 px-3 rounded transition-colors text-sm ${
                    activeEquipSetSlot === i
                      ? 'bg-green-600 text-white'
                      : isUnlocked
                        ? 'bg-[#4a6fa5] text-white hover:bg-[#3a5a95]'
                        : 'bg-[#3a3a55] text-gray-400 hover:bg-[#4a4a65] cursor-pointer'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-gray-600 px-4 py-1 bg-[#7a94b7]">{t('点击武器、防具、饰孔可以购买或解锁')}</div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="flex items-start gap-2">
            <div className="bg-[#6a8ac5] text-white text-sm font-bold px-2 py-1 rounded mt-1 flex-shrink-0">{t('武器')}</div>
            <div className="flex gap-2 flex-1">
              <div 
                onClick={() => {
                  setSelectedSoulSlot({ type: 'weapon', slot: 0 });
                  setViewMode('soul');
                }}
                className="w-10 h-10 bg-[#4a3a65] border-2 border-[#6a5a85] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#5a4a75] transition-colors flex-shrink-0"
              >
                {player.weaponSoul ? (
                  <SpriteIcon type="soul" x={player.weaponSoul.x} y={player.weaponSoul.y} size="medium" image={player.weaponSoul.image} />
                ) : (
                  <span className="text-lg">👻</span>
                )}
              </div>
              <div 
                onClick={() => setViewMode('weapon')}
                className="flex-1 bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-2 cursor-pointer hover:bg-[#5a7ab5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                    {player.equippedWeapon?.x !== undefined ? (
                      <SpriteIcon type="weapon" x={player.equippedWeapon.x} y={player.equippedWeapon.y} size="medium" bit32={player.equippedWeapon.bit32} />
                    ) : (
                      <span className="text-xl">❓</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">{player.equippedWeapon ? getEquipName(player.equippedWeapon.name) : t('未装备')}</div>
                    {player.equippedWeapon && (
                      <>
                        <div className="text-red-300 text-xs mt-1">
                          ATK +{player.equippedWeapon.attackBonus}
                        </div>
                        <div className="text-red-300 text-xs">
                          ATK x {(player.equippedWeapon.attributeRate || 100)}%
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="bg-[#6a8ac5] text-white text-sm font-bold px-2 py-1 rounded mt-1 flex-shrink-0">{t('防具')}</div>
            <div className="flex gap-2 flex-1">
              <div 
                onClick={() => {
                  setSelectedSoulSlot({ type: 'armor', slot: 0 });
                  setViewMode('soul');
                }}
                className="w-10 h-10 bg-[#4a3a65] border-2 border-[#6a5a85] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#5a4a75] transition-colors flex-shrink-0"
              >
                {player.armorSoul ? (
                  <SpriteIcon type="soul" x={player.armorSoul.x} y={player.armorSoul.y} size="medium" image={player.armorSoul.image} />
                ) : (
                  <span className="text-lg">👻</span>
                )}
              </div>
              <div 
                onClick={() => setViewMode('armor')}
                className="flex-1 bg-[#6a8ac5] border-2 border-[#4a6fa5] rounded-lg p-2 cursor-pointer hover:bg-[#5a7ab5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#4a6fa5] rounded flex items-center justify-center">
                    {player.equippedArmor?.x !== undefined ? (
                      <SpriteIcon type="armor" x={player.equippedArmor.x} y={player.equippedArmor.y} size="medium" bit32={player.equippedArmor.bougu32png} />
                    ) : (
                      <span className="text-xl">❓</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">{player.equippedArmor ? getEquipName(player.equippedArmor.name) : t('未装备')}</div>
                    {player.equippedArmor && (
                      <>
                        <div className="text-blue-300 text-xs mt-1">
                          DEF +{player.equippedArmor.defenseBonus}
                        </div>
                        <div className="text-blue-300 text-xs">
                          DEF x {(player.equippedArmor.attributeRate || 100)}%
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#5a7aa5] px-2 py-1 rounded text-white text-xs font-bold">{t('饰品')}</div>

          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3, 4, 5].map(slotIndex => {
              const accessory = (player.equippedAccessories || [])[slotIndex];
              const isUnlocked = unlockedSlots[slotIndex] || false;
              
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
                      <SpriteIcon type="accessory" x={accessory.x} y={accessory.y} size="medium" image={accessory.image} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-xs truncate">{getEquipName(accessory.name)}</div>
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
                      <span className="text-lg text-gray-400">+</span>
                    </div>
                    <div className="text-gray-300 text-xs font-bold">{t('空栏位')} {slotIndex + 1}</div>
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
                    <div className="text-gray-400 text-xs">{t('未解锁')} {t('饰孔')}{slotIndex + 1}</div>
                  </div>
                )}
              </div>
              );
            })}
          </div>

          <div className="grid grid-cols-6 gap-1">
            {[6, 7, 8, 9, 10, 11].map(slotIndex => {
              const accessory = (player.equippedAccessories || [])[slotIndex];
              const isUnlocked = unlockedSlots[slotIndex] || false;
              
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
                      <SpriteIcon type="accessory" x={accessory.x} y={accessory.y} size="small" image={accessory.image} />
                    </div>
                    <div className="text-white text-xs mt-0.5 truncate w-full text-center">{getEquipName(accessory.name)}</div>
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
                      <span className="text-sm text-gray-400">+</span>
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
            <span>■{t('属性')}</span>
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

        <div className="bg-[#5a7aa5] px-4 py-2 border-t-2 border-[#4a6fa5]">
          <button
            onClick={onClose}
            className="w-full bg-[#4a6fa5] text-white font-bold py-2 rounded hover:bg-[#3a5a95] transition-colors text-sm"
          >
            {t('关闭')}
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
    const currentTotalAgi = player.agility + bonuses.agiBonus;
    const currentTotalLuc = player.luck + bonuses.lucBonus;
    
    let newTotalAtk = currentTotalAtk;
    let newTotalDef = currentTotalDef;
    let newTotalHp = currentTotalHp;
    let newTotalAgi = currentTotalAgi;
    let newTotalLuc = currentTotalLuc;
    
    const changedStats: { name: string; old: number; new: number }[] = [];
    
    if (confirmEquipment.type === 'weapon') {
      const oldWeaponBonus = player.equippedWeapon?.attackBonus || 0;
      newTotalAtk = currentTotalAtk - oldWeaponBonus + confirmEquipment.attackBonus;
      if (newTotalAtk !== currentTotalAtk) {
        changedStats.push({ name: 'ATK', old: currentTotalAtk, new: newTotalAtk });
      }
    } else if (confirmEquipment.type === 'armor') {
      const oldArmorDefBonus = player.equippedArmor?.defenseBonus || 0;
      const oldArmorHpBonus = player.equippedArmor?.hpBonus || 0;
      newTotalDef = currentTotalDef - oldArmorDefBonus + confirmEquipment.defenseBonus;
      newTotalHp = currentTotalHp - oldArmorHpBonus + confirmEquipment.hpBonus;
      if (newTotalDef !== currentTotalDef) {
        changedStats.push({ name: 'DEF', old: currentTotalDef, new: newTotalDef });
      }
    } else if (confirmEquipment.type === 'accessory') {
      newTotalAtk += confirmEquipment.attackBonus;
      newTotalDef += confirmEquipment.defenseBonus;
      newTotalHp += confirmEquipment.hpBonus;
      newTotalAgi += confirmEquipment.agilityBonus;
      newTotalLuc += confirmEquipment.luckBonus;
      if (newTotalAtk !== currentTotalAtk) {
        changedStats.push({ name: 'ATK', old: currentTotalAtk, new: newTotalAtk });
      }
      if (newTotalDef !== currentTotalDef) {
        changedStats.push({ name: 'DEF', old: currentTotalDef, new: newTotalDef });
      }
      if (newTotalHp !== currentTotalHp) {
        changedStats.push({ name: 'HP', old: currentTotalHp, new: newTotalHp });
      }
      if (newTotalAgi !== currentTotalAgi) {
        changedStats.push({ name: 'AGI', old: currentTotalAgi, new: newTotalAgi });
      }
      if (newTotalLuc !== currentTotalLuc) {
        changedStats.push({ name: 'LUC', old: currentTotalLuc, new: newTotalLuc });
      }
    }
    
    if ((confirmEquipment.type === 'weapon' || confirmEquipment.type === 'armor' || confirmEquipment.type === 'accessory') && changedStats.length === 0) {
      return null;
    }
    
    const canAfford = confirmEquipment.type === 'soul' ? player.gold >= confirmEquipment.price : true;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-4">
              {confirmEquipment.type === 'soul' ? t('安装') : t('装备')} {getEquipName(confirmEquipment.name)} {t('吗？')}
            </div>
            
            {confirmEquipment.type === 'soul' && (
              <div className="bg-yellow-900/50 text-yellow-300 px-3 py-2 rounded-lg mb-4">
                {t('安装需要消耗')} {confirmEquipment.price.toLocaleString()} G
              </div>
            )}
            
            {confirmEquipment.type === 'soul' && !canAfford && (
              <div className="bg-red-900/50 text-red-300 px-3 py-2 rounded-lg mb-4">
                {t('金币不足！')}
              </div>
            )}
            
            {changedStats.length > 0 && (
              <div className="space-y-2 mb-4">
                {changedStats.map(stat => (
                  <div key={stat.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('现在的')} {stat.name}:</span>
                      <span className="text-white">{stat.old}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('装备后的')} {stat.name}:</span>
                      <span className={`${stat.new > stat.old ? 'text-green-400' : stat.new < stat.old ? 'text-red-400' : 'text-white'}`}>
                        {stat.new}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleConfirmEquip}
                disabled={!canAfford}
                className={`flex-1 font-bold py-3 rounded-lg transition-colors ${
                  canAfford 
                    ? 'bg-green-600 text-white hover:bg-green-500' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('确认')}
              </button>
              <button
                onClick={handleCancelEquip}
                className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
              >
                {t('取消')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div className="w-[90%] max-w-md" onClick={(e) => e.stopPropagation()}>
          {viewMode === 'weapon' && renderWeaponList()}
          {viewMode === 'armor' && renderArmorList()}
          {viewMode === 'accessory' && renderAccessoryList()}
          {viewMode === 'soul' && renderSoulList()}
          {viewMode === 'material' && renderMaterialList()}
          {viewMode === 'main' && renderMainView()}
        </div>
      </div>
      {renderConfirmDialog()}
      {detailEquipment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={() => setDetailEquipment(null)}>
          <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg p-5 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-[#4a2c7a] rounded flex items-center justify-center">
                <SpriteIcon type={
                  detailEquipment.type === 'material' ? 'material' : 
                  detailEquipment.type === 'consumable' ? 'accessory' : 
                  detailEquipment.type
                } x={detailEquipment.x} y={detailEquipment.y} size="large" 
                  image={detailEquipment.type === 'accessory' ? detailEquipment.image : 
                         detailEquipment.type === 'soul' ? detailEquipment.image : undefined}
                  bit32={detailEquipment.type === 'weapon' ? detailEquipment.bit32 : 
                         detailEquipment.type === 'armor' ? detailEquipment.bougu32png : 
                         detailEquipment.type === 'material' ? detailEquipment.bit32 : undefined} />
              </div>
              <div>
                <div className="text-white font-bold text-lg">{getEquipName(detailEquipment.name)}</div>
                <div className="text-gray-400 text-xs">{detailEquipment.type === 'weapon' ? t('武器') : detailEquipment.type === 'armor' ? t('防具') : detailEquipment.type === 'accessory' ? t('饰品') : detailEquipment.type === 'soul' ? t('魂') : t('材料')}</div>
              </div>
            </div>
            {detailEquipment.setumei && (
              <div className="text-purple-300 text-sm mb-2">{getEquipDescription(detailEquipment.setumei, detailEquipment.t1, detailEquipment.t2)}</div>
            )}
            {detailEquipment.effectDescription && (
              <div className="text-yellow-300 text-sm mb-2">{detailEquipment.effectDescription}</div>
            )}
            <div className="space-y-1 mb-3">
              {detailEquipment.type === 'weapon' && detailEquipment.attackBonus > 0 && (
                <div className="flex justify-between text-sm"><span className="text-gray-400">{t('攻击力')}</span><span className="text-red-300">+{detailEquipment.attackBonus}</span></div>
              )}
              {detailEquipment.type === 'armor' && (
                <>
                  {detailEquipment.defenseBonus > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">{t('防御力')}</span><span className="text-blue-300">+{detailEquipment.defenseBonus}</span></div>}
                  {detailEquipment.hpBonus > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">HP</span><span className="text-green-300">+{detailEquipment.hpBonus}</span></div>}
                </>
              )}
              {detailEquipment.type === 'accessory' && (
                <>
                  {detailEquipment.attackBonus > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">{t('攻击力')}</span><span className="text-red-300">+{detailEquipment.attackBonus}</span></div>}
                  {detailEquipment.defenseBonus > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">{t('防御力')}</span><span className="text-blue-300">+{detailEquipment.defenseBonus}</span></div>}
                  {detailEquipment.hpBonus > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">HP</span><span className="text-green-300">+{detailEquipment.hpBonus}</span></div>}
                  {detailEquipment.agilityBonus > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">AGI</span><span className="text-yellow-300">+{detailEquipment.agilityBonus}</span></div>}
                  {detailEquipment.luckBonus > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">LUC</span><span className="text-purple-300">+{detailEquipment.luckBonus}</span></div>}
                </>
              )}
              {detailEquipment.type === 'soul' && (
                <>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">{t('属性值')}</span><span className="text-yellow-300">+{detailEquipment.t1}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">{t('百分比')}</span><span className="text-purple-300">+{detailEquipment.t2}%</span></div>
                </>
              )}
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">{t('价格')}</span>
              <span className="text-yellow-400">{detailEquipment.price > 0 ? detailEquipment.price.toLocaleString() + ' G' : '-'}</span>
            </div>
            {(detailEquipment.quantity ?? 0) > 0 && (
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-400">{t('持有数量')}</span>
                <span className="text-white">{detailEquipment.quantity}</span>
              </div>
            )}
            <button
              onClick={() => setDetailEquipment(null)}
              className="w-full bg-[#4a2c7a] text-white font-bold py-2 rounded-lg hover:bg-[#5a3c8a] transition-colors"
            >
              {t('关闭')}
            </button>
          </div>
        </div>
      )}
      
      {showUnlockConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-2">{t('解锁饰孔')} {unlockingSlotIndex + 1}？</div>
              <div className="text-gray-300 mb-4">需要 {(() => { const prices = [0, 0, 0, 250000, 500000, 750000, 70000000, 70000000, 5000000, 5000000, 3500000, 3500000]; return prices[unlockingSlotIndex]; })().toLocaleString()} G</div>
              <div className="flex gap-3">
                <button
            onClick={handleUnlockSlot}
            className="flex-1 bg-yellow-600 text-white font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            {t('解锁')}
          </button>
          <button
            onClick={() => setShowUnlockConfirm(false)}
            className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
          >
            {t('取消')}
          </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showGoldError && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-bold">
          {t('金币不足！')}
        </div>
      )}

      {purchaseConfirmSlot !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg p-6 w-[80%] max-w-sm">
            <div className="text-game-secondary font-bold text-lg mb-4">{t('购买背包')}{purchaseConfirmSlot + 1}</div>
            <div className="text-white text-sm mb-6">{t('确定花费')} {getEquipSetPrice(purchaseConfirmSlot)?.toLocaleString() || 0} {t('金币购买该背包吗？')}</div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const success = purchaseEquipSet(purchaseConfirmSlot);
                  if (success) {
                    setActiveEquipSetSlot(purchaseConfirmSlot);
                  } else {
                    setShowGoldError(true);
                    setTimeout(() => setShowGoldError(false), 1500);
                  }
                  setPurchaseConfirmSlot(null);
                }}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded text-sm transition-colors"
              >
                {t('确定')}
              </button>
              <button
                onClick={() => setPurchaseConfirmSlot(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded text-sm transition-colors"
              >
                {t('取消')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
