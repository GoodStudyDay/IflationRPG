import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Inventory } from './Inventory';
import { StatusPanel } from './StatusPanel';
import { EquipmentCollection } from './EquipmentCollection';
import { SettingsModal } from './SettingsModal';

interface MenuOverlayProps {
  onClose: () => void;
}

export const MenuOverlay = ({ onClose }: MenuOverlayProps) => {
  const { goToTitle, killPlayer } = useGameStore();
  const [activePanel, setActivePanel] = useState<'main' | 'status' | 'inventory' | 'collection'>('main');
  const [showSettings, setShowSettings] = useState(false);
  
  const handleTitleClick = () => {
    goToTitle();
    onClose();
  };

  

  if (activePanel === 'status') {
    return <StatusPanel onClose={() => setActivePanel('main')} />;
  }
  
  if (activePanel === 'inventory') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md">
          <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-game-secondary font-bold">装备</div>
              <button
                onClick={() => setActivePanel('main')}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
          
          <Inventory onClose={() => setActivePanel('main')} />
        </div>
      </div>
    );
  }
  
  if (activePanel === 'collection') {
    return <EquipmentCollection onClose={() => setActivePanel('main')} />;
  }
  
  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4">
          <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-2 mb-4">
            <div className="text-game-secondary font-bold">主菜单</div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setActivePanel('status')}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
            >
              属性
            </button>
            <div className="text-xs text-gray-400 px-2 mb-2">可以查看属性详情，分配属性点</div>
            
            <button
              onClick={() => setActivePanel('inventory')}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
            >
              装备
            </button>
            <div className="text-xs text-gray-400 px-2 mb-2">购买装备，进行装备</div>
            
            <button
              onClick={() => setActivePanel('collection')}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
            >
              装备列表
            </button>
            <div className="text-xs text-gray-400 px-2 mb-2">查看已收集的装备</div>
            
            <button
              onClick={() => setShowSettings(true)}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
            >
              设置
            </button>
            <div className="text-xs text-gray-400 px-2 mb-2">更改游戏和语言设定等</div>
            
            <div className="flex gap-2">
              <button
                onClick={handleTitleClick}
                className="flex-1 bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
              >
                标题
              </button>
              <button
                onClick={() => killPlayer()}
                className="flex-1 bg-[#8a3c5a] text-white font-bold py-3 rounded-lg hover:bg-[#9a4c6a] transition-colors text-lg"
              >
                死亡
              </button>
            </div>
            <div className="text-xs text-gray-400 px-2 mb-2">游戏自动保存</div>
            
            <button
              onClick={onClose}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};