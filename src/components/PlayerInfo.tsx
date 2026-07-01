import { useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { equipmentData } from '@/data/equipment';
import { getCollection } from '@/utils/collectionStorage';

interface PlayerInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerInfo = ({ isOpen, onClose }: PlayerInfoProps) => {
  const { player, Highlv, HighCombo, HighDamage, winbattle, losebattle, newgamecount } = useGameStore();

  const collection = useMemo(() => getCollection(), []);

  const stats = useMemo(() => {
    const weapons = equipmentData.filter(e => e.type === 'weapon');
    const armors = equipmentData.filter(e => e.type === 'armor');
    const accessories = equipmentData.filter(e => e.type === 'accessory');

    const collectedWeapons = collection.filter(i => i.equipmentId.startsWith('weapon-')).length;
    const collectedArmors = collection.filter(i => i.equipmentId.startsWith('armor-')).length;
    const collectedAccessories = collection.filter(i => i.equipmentId.startsWith('accessory-')).length;

    return {
      weaponTotal: weapons.length,
      armorTotal: armors.length,
      accessoryTotal: accessories.length,
      collectedWeaponCount: collectedWeapons,
      collectedArmorCount: collectedArmors,
      collectedAccessoryCount: collectedAccessories,
    };
  }, [collection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#2d1b4e] border-2 border-[#5a3c8a] rounded-lg w-[90%] max-w-lg max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-[#1a0a2e] border-b-2 border-[#5a3c8a] px-4 py-3">
          <div className="text-game-secondary font-bold text-lg text-center">👤 玩家信息</div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[65vh]">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#1a0a2e] rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">当前等级</div>
              <div className="text-xl font-bold text-yellow-400">{player.level}</div>
            </div>
            <div className="bg-[#1a0a2e] rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">最高等级</div>
              <div className="text-xl font-bold text-green-400">{Highlv}</div>
            </div>
            <div className="bg-[#1a0a2e] rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">最高攻击力</div>
              <div className="text-xl font-bold text-red-400">{HighDamage.toLocaleString()}</div>
            </div>
            <div className="bg-[#1a0a2e] rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">最高连击</div>
              <div className="text-xl font-bold text-blue-400">{HighCombo}</div>
            </div>
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3 mb-4">
            <div className="text-gray-300 text-sm font-bold mb-2">当前属性</div>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div>
                <div className="text-red-400 font-bold">{player.hp.toLocaleString()}</div>
                <div className="text-xs text-gray-500">HP</div>
              </div>
              <div>
                <div className="text-orange-400 font-bold">{player.attack.toLocaleString()}</div>
                <div className="text-xs text-gray-500">ATK</div>
              </div>
              <div>
                <div className="text-blue-400 font-bold">{player.defense.toLocaleString()}</div>
                <div className="text-xs text-gray-500">DEF</div>
              </div>
              <div>
                <div className="text-green-400 font-bold">{player.agility.toLocaleString()}</div>
                <div className="text-xs text-gray-500">AGI</div>
              </div>
              <div>
                <div className="text-purple-400 font-bold">{player.luck.toLocaleString()}</div>
                <div className="text-xs text-gray-500">LCK</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3 mb-4">
            <div className="text-gray-300 text-sm font-bold mb-2">当前装备</div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-lg mb-1">{player.equippedWeapon?.icon || '📦'}</div>
                <div className="text-xs text-gray-400 truncate">{player.equippedWeapon?.name || '无'}</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-1">{player.equippedArmor?.icon || '📦'}</div>
                <div className="text-xs text-gray-400 truncate">{player.equippedArmor?.name || '无'}</div>
              </div>
              {player.equippedAccessories?.map((acc, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg mb-1">{acc?.icon || '📦'}</div>
                  <div className="text-xs text-gray-400 truncate">{acc?.name || '无'}</div>
                </div>
              )) || Array(2).fill(null).map((_, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg mb-1">📦</div>
                  <div className="text-xs text-gray-400">无</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3 mb-4">
            <div className="text-gray-300 text-sm font-bold mb-2">装备收集统计</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>⚔️</span>
                  <span className="text-gray-400 text-sm">武器</span>
                </div>
                <div className="text-white font-bold">
                  [{stats.collectedWeaponCount}/{stats.weaponTotal}]
                </div>
              </div>
              <div className="h-2 bg-[#3d2b6e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${(stats.collectedWeaponCount / stats.weaponTotal) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🛡️</span>
                  <span className="text-gray-400 text-sm">防具</span>
                </div>
                <div className="text-white font-bold">
                  [{stats.collectedArmorCount}/{stats.armorTotal}]
                </div>
              </div>
              <div className="h-2 bg-[#3d2b6e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${(stats.collectedArmorCount / stats.armorTotal) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>💍</span>
                  <span className="text-gray-400 text-sm">饰品</span>
                </div>
                <div className="text-white font-bold">
                  [{stats.collectedAccessoryCount}/{stats.accessoryTotal}]
                </div>
              </div>
              <div className="h-2 bg-[#3d2b6e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${(stats.collectedAccessoryCount / stats.accessoryTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3">
            <div className="text-gray-300 text-sm font-bold mb-2">游戏统计</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-green-400 font-bold">{winbattle}</div>
                <div className="text-xs text-gray-500">胜利</div>
              </div>
              <div>
                <div className="text-red-400 font-bold">{losebattle}</div>
                <div className="text-xs text-gray-500">失败</div>
              </div>
              <div>
                <div className="text-yellow-400 font-bold">{newgamecount}</div>
                <div className="text-xs text-gray-500">新游戏</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a0a2e] border-t-2 border-[#5a3c8a] px-4 py-3">
          <button
            onClick={onClose}
            className="w-full bg-[#5a3c8a] text-white font-bold py-2 rounded-lg hover:bg-[#6a4c9a] transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};