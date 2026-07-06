import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Inventory } from './Inventory';
import { StatusPanel } from './StatusPanel';
import { EquipmentCollection } from './EquipmentCollection';
import { SettingsModal } from './SettingsModal';
import { useTranslation } from '@/hooks/useTranslation';

interface MenuOverlayProps {
  onClose: () => void;
}

export const MenuOverlay = ({ onClose }: MenuOverlayProps) => {
  const { goToTitle, killPlayer } = useGameStore();
  const { t } = useTranslation();
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
    return <Inventory onClose={() => setActivePanel('main')} />;
  }
  
  if (activePanel === 'collection') {
    return <EquipmentCollection onClose={() => setActivePanel('main')} />;
  }
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div 
          className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-2 mb-4">
            <div className="text-game-secondary font-bold">{t('メニュー画面')}</div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setActivePanel('status')}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
            >
              {t('ステータス振り分け')}
            </button>
            <div className="text-xs text-gray-400 px-2 mb-2">{t('ステスポイの振り分けを行うことが')}</div>
            
            <button
              onClick={() => setActivePanel('inventory')}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
            >
              {t('装備')}
            </button>
            <div className="text-xs text-gray-400 px-2 mb-2">{t('アイテムを購入、装備をし')}</div>
            
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
            <div className="text-xs text-gray-400 px-2 mb-2">{t('ゲームの設定などを変更しま')}</div>
            
            <div className="flex gap-2">
              <button
                onClick={handleTitleClick}
                className="flex-1 bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
              >
                {t('タイトルに戻る')}
              </button>
              <button
                onClick={() => killPlayer()}
                className="flex-1 bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
              >
                死亡
              </button>
            </div>
            <div className="text-xs text-gray-400 px-2 mb-2">{t('ゲームは自動的にセーブされて')}</div>
            
            <button
              onClick={onClose}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors text-lg"
            >
              {t('閉じる')}
            </button>
          </div>
        </div>
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};