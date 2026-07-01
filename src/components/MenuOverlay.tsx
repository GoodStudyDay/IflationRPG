import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Inventory } from './Inventory';
import { StatusPanel } from './StatusPanel';
import { EquipmentCollection } from './EquipmentCollection';

interface MenuOverlayProps {
  onClose: () => void;
}

const STORAGE_KEY = 'inflation-rpg-storage';

export const MenuOverlay = ({ onClose }: MenuOverlayProps) => {
  const { goToTitle, killPlayer } = useGameStore();
  const [activePanel, setActivePanel] = useState<'main' | 'status' | 'inventory' | 'collection' | 'settings'>('main');
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [pasteInput, setPasteInput] = useState('');
  const [showPasteInput, setShowPasteInput] = useState(false);
  
  const handleTitleClick = () => {
    goToTitle();
    onClose();
  };

  const handleExport = async () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        setImportMsg('没有可导出的存档');
        setTimeout(() => setImportMsg(null), 2000);
        return;
      }
      const encoded = btoa(unescape(encodeURIComponent(data)));
      await navigator.clipboard.writeText(encoded);
      setImportMsg('存档已复制到剪贴板');
      setTimeout(() => setImportMsg(null), 2000);
    } catch {
      setImportMsg('导出失败');
      setTimeout(() => setImportMsg(null), 2000);
    }
  };

  const handleImport = () => {
    const trimmed = pasteInput.trim();
    if (!trimmed) {
      setImportMsg('请粘贴存档字符串');
      setTimeout(() => setImportMsg(null), 2000);
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(trimmed)));
      const data = JSON.parse(decoded);
      if (!data.state || !data.state.player || !data.state.inventory) {
        setImportMsg('无效的存档数据');
        setTimeout(() => setImportMsg(null), 2000);
        return;
      }
      localStorage.setItem(STORAGE_KEY, decoded);
      setImportMsg('存档已导入，正在重新加载...');
      setTimeout(() => {
        setImportMsg(null);
        window.location.reload();
      }, 1500);
    } catch {
      setImportMsg('存档格式错误，无法解析');
      setTimeout(() => setImportMsg(null), 2000);
    }
  };

  if (activePanel === 'settings') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4">
          <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-2 mb-4">
            <div className="text-game-secondary font-bold">设置</div>
          </div>

          <div className="space-y-3">
            <div className="text-gray-300 text-sm mb-2">存档管理</div>

            <button
              onClick={handleExport}
              className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              导出存档
            </button>
            <div className="text-xs text-gray-400 px-2 mb-2">将存档编码为字符串并复制到剪贴板</div>

            {!showPasteInput ? (
              <button
                onClick={() => setShowPasteInput(true)}
                className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                导入存档
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  placeholder="在此粘贴存档字符串..."
                  className="w-full h-24 bg-[#1a0a2e] border border-[#4a2c7a] rounded p-2 text-white text-xs resize-none focus:outline-none focus:border-[#6a4c9a]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleImport}
                    className="flex-1 bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    确认导入
                  </button>
                  <button
                    onClick={() => { setShowPasteInput(false); setPasteInput(''); }}
                    className="flex-1 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
            <div className="text-xs text-gray-400 px-2 mb-2">粘贴存档字符串以恢复进度（会覆盖当前进度）</div>

            <button
              onClick={() => setActivePanel('main')}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
            >
              返回
            </button>
          </div>
        </div>

        {importMsg && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-bold">
            {importMsg}
          </div>
        )}
      </div>
    );
  }

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
            onClick={() => setActivePanel('settings')}
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
              onClick={() => {
                if (window.confirm('确定要结束游戏吗？这将消耗所有战斗点数。')) {
                  killPlayer();
                }
              }}
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
  );
};