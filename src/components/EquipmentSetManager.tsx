import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { equipmentData } from '@/data/equipment';
import { SpriteIcon } from './SpriteIcon';

interface EquipmentSetManagerProps {
  onClose: () => void;
}

export const EquipmentSetManager = ({ onClose }: EquipmentSetManagerProps) => {
  const { equipSets, saveEquipSet, loadEquipSet, deleteEquipSet, renameEquipSet } = useGameStore();
  const [newSetName, setNewSetName] = useState('');
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleSaveSet = () => {
    if (newSetName.trim()) {
      saveEquipSet(newSetName.trim());
      setNewSetName('');
    }
  };

  const handleRename = (setId: string) => {
    if (editingName.trim()) {
      renameEquipSet(setId, editingName.trim());
      setEditingSetId(null);
      setEditingName('');
    }
  };

  const getEquipmentName = (equipmentId: string | null) => {
    if (!equipmentId) return '无';
    const equipment = equipmentData.find(e => e.id === equipmentId);
    return equipment?.name || '未知';
  };

  const getEquipmentIcon = (equipmentId: string | null) => {
    if (!equipmentId) return null;
    const equipment = equipmentData.find(e => e.id === equipmentId);
    if (!equipment) return null;
    return { x: equipment.x, y: equipment.y, image: equipment.image };
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[95%] max-w-lg max-h-[85vh] flex flex-col">
        <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-game-secondary rounded flex items-center justify-center text-game-dark font-bold text-sm">
                SET
              </div>
              <span className="text-game-secondary font-bold">装备套装管理</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center text-white text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="bg-[#1a0a2e]/50 border-b border-[#4a2c7a] px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSet()}
              placeholder="输入套装名称..."
              className="flex-1 bg-[#3d2b6e] border-2 border-[#4a2c7a] rounded px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
              maxLength={20}
            />
            <button
              onClick={handleSaveSet}
              disabled={!newSetName.trim()}
              className={`px-4 py-2 rounded font-bold text-sm transition-colors ${
                newSetName.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              保存套装
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {equipSets.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <div className="text-4xl mb-4">📦</div>
              <div>暂无装备套装</div>
              <div className="text-sm mt-2">保存当前装备配置为套装，方便快速切换</div>
            </div>
          ) : (
            <div className="space-y-3">
              {equipSets.map((set) => (
                <div
                  key={set.id}
                  className="bg-[#3d2b6e] rounded-lg border-2 border-[#4a2c7a] overflow-hidden"
                >
                  <div className="bg-[#2d1b4e] px-3 py-2 flex items-center justify-between">
                    {editingSetId === set.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(set.id)}
                          className="flex-1 bg-[#4d3b7e] border-2 border-blue-400 rounded px-2 py-1 text-white text-sm focus:outline-none"
                          autoFocus
                          maxLength={20}
                        />
                        <button
                          onClick={() => handleRename(set.id)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => {
                            setEditingSetId(null);
                            setEditingName('');
                          }}
                          className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-bold"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-game-secondary font-bold text-sm">{set.name}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingSetId(set.id);
                              setEditingName(set.name);
                            }}
                            className="px-2 py-1 bg-blue-600/50 hover:bg-blue-600 text-white rounded text-xs font-bold transition-colors"
                          >
                            重命名
                          </button>
                          <button
                            onClick={() => setShowConfirmDelete(set.id)}
                            className="px-2 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded text-xs font-bold transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-1">武器</div>
                        <div className="w-12 h-12 bg-[#2d1b4e] rounded flex items-center justify-center overflow-hidden border border-[#4a2c7a]">
                          {getEquipmentIcon(set.weaponId) ? (
                            <SpriteIcon type="weapon" x={getEquipmentIcon(set.weaponId)!.x} y={getEquipmentIcon(set.weaponId)!.y} size="medium" />
                          ) : (
                            <span className="text-gray-500 text-xs">无</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-300 mt-1 truncate w-full text-center">
                          {getEquipmentName(set.weaponId)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-1">防具</div>
                        <div className="w-12 h-12 bg-[#2d1b4e] rounded flex items-center justify-center overflow-hidden border border-[#4a2c7a]">
                          {getEquipmentIcon(set.armorId) ? (
                            <SpriteIcon type="armor" x={getEquipmentIcon(set.armorId)!.x} y={getEquipmentIcon(set.armorId)!.y} size="medium" />
                          ) : (
                            <span className="text-gray-500 text-xs">无</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-300 mt-1 truncate w-full text-center">
                          {getEquipmentName(set.armorId)}
                        </div>
                      </div>
                      
                      {[0, 1].map((index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="text-xs text-gray-400 mb-1">饰品{index + 1}</div>
                          <div className="w-12 h-12 bg-[#2d1b4e] rounded flex items-center justify-center overflow-hidden border border-[#4a2c7a]">
                            {getEquipmentIcon(set.accessoryIds[index]) ? (
                              <SpriteIcon type="accessory" x={getEquipmentIcon(set.accessoryIds[index])!.x} y={getEquipmentIcon(set.accessoryIds[index])!.y} size="medium" image={getEquipmentIcon(set.accessoryIds[index])!.image} />
                            ) : (
                              <span className="text-gray-500 text-xs">无</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-300 mt-1 truncate w-full text-center">
                            {getEquipmentName(set.accessoryIds[index])}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {set.accessoryIds.length > 2 && (
                      <div className="grid grid-cols-6 gap-1 mt-2">
                        {set.accessoryIds.slice(2).map((id: string | null, index: number) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="text-xs text-gray-400 mb-0.5">饰品{index + 3}</div>
                            <div className="w-8 h-8 bg-[#2d1b4e] rounded flex items-center justify-center overflow-hidden border border-[#4a2c7a]">
                              {getEquipmentIcon(id) ? (
                                <SpriteIcon type="accessory" x={getEquipmentIcon(id)!.x} y={getEquipmentIcon(id)!.y} size="small" image={getEquipmentIcon(id)!.image} />
                              ) : (
                                <span className="text-gray-500 text-xs">无</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-[#2d1b4e]/50 px-3 py-2">
                    <button
                      onClick={() => {
                        loadEquipSet(set.id);
                        onClose();
                      }}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded text-sm transition-colors"
                    >
                      装备此套装
                    </button>
                  </div>
                  
                  {showConfirmDelete === set.id && (
                    <div className="bg-red-900/50 px-3 py-2 flex items-center justify-between">
                      <span className="text-red-400 text-sm">确定删除此套装？</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            deleteEquipSet(set.id);
                            setShowConfirmDelete(null);
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold"
                        >
                          确定
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(null)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs font-bold"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
    </div>
  );
};