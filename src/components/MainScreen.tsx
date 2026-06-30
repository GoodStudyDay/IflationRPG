import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { MenuOverlay } from './MenuOverlay';
import { BonusOverlay } from './BonusOverlay';
import { BONUS_LIST } from '@/utils/bonusManager';

export const MainScreen = () => {
  const { player, encounterRate, addEncounterRate, battlePoints, maxBattlePoints, resetGame, bonus } = useGameStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  
  const expPercent = (player.exp / player.expToNextLevel) * 100;
  
  // 动态获取 bonus 显示文本
  const getBonusText = () => {
    if (!bonus.currentBonus) return '';
    const info = BONUS_LIST[bonus.currentBonus.bonusType];
    if (!info) return '';
    return `${info.name}(${bonus.currentBonus.remainingCount})`;
  };
  
  const handleBattleClick = () => {
    if (battlePoints <= 0) {
      setShowResetConfirm(true);
      return;
    }
    addEncounterRate(100);
  };
  
  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
  };
  
  return (
    <div className="min-h-screen bg-[#1a0a2e] flex flex-col">
      <div className="bg-[#3d2b6e]/30 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowBonus(true)}
            className="bg-[#5a3c8a] px-5 py-2 rounded-lg text-white font-bold text-sm hover:bg-[#6a4c9a] transition-colors"
          >
            奖励
          </button>
          <button
            onClick={() => {}}
            className="bg-[#5a3c8a] px-5 py-2 rounded-lg text-white font-bold text-sm hover:bg-[#6a4c9a] transition-colors"
          >
            Teleport
          </button>
          <button
            onClick={() => setShowMenu(true)}
            className="bg-[#5a3c8a] px-5 py-2 rounded-lg text-white font-bold text-sm hover:bg-[#6a4c9a] transition-colors"
          >
            菜单
          </button>
        </div>
        
        <div className="flex justify-end mt-2">
          <button
            onClick={handleBattleClick}
            className="bg-[#5a3c8a] px-8 py-2 rounded-lg text-white font-bold text-sm hover:bg-[#6a4c9a] transition-colors"
          >
            战斗
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d5a2d] to-[#1a3a1a]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600 rounded-full blur-3xl" />
          </div>
          
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#4a7a4a] rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#1a3a1a] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1a3a1a] to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-white font-bold text-lg">适合LV: {player.level}</div>
            {getBonusText() && (
              <div className="text-gray-400 text-sm">奖励: {getBonusText()}</div>
            )}
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-8 h-full border-l-2 border-blue-500/50" />
        <div className="absolute top-0 right-0 w-8 h-full border-r-2 border-blue-500/50" />
        <div className="absolute top-0 left-0 h-8 w-full border-t-2 border-blue-500/50" />
        <div className="absolute bottom-0 left-0 h-8 w-full border-b-2 border-blue-500/50" />
        
        <div className="absolute top-8 left-8 w-4 h-4 border-l-2 border-t-2 border-blue-500" />
        <div className="absolute top-8 right-8 w-4 h-4 border-r-2 border-t-2 border-blue-500" />
        <div className="absolute bottom-8 left-8 w-4 h-4 border-l-2 border-b-2 border-blue-500" />
        <div className="absolute bottom-8 right-8 w-4 h-4 border-r-2 border-b-2 border-blue-500" />
        
        <div className="absolute top-0 left-0 w-40 h-40 border-l-2 border-t-2 border-red-500/30" />
        <div className="absolute top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-red-500/30" />
        <div className="absolute bottom-0 left-0 w-40 h-40 border-l-2 border-b-2 border-red-500/30" />
        <div className="absolute bottom-0 right-0 w-40 h-40 border-r-2 border-b-2 border-red-500/30" />
      </div>
      
      <div className="bg-[#1a0a2e] border-t-2 border-[#4a2c7a] p-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">现在的地图信息</div>
            <div className="text-xs text-white">适合LV: {player.level}{getBonusText() ? ` , Bonus: ${getBonusText()}` : ''}</div>
          </div>
          
          <div className={`bg-[#3d2b6e] px-4 py-3 rounded-lg border ${
            battlePoints > 10 ? 'border-[#5a3c8a]' : 
            battlePoints > 0 ? 'border-yellow-500' : 'border-red-500'
          }`}>
            <div className="text-xs text-gray-400 text-center">BATTLE POINT</div>
            <div className={`text-3xl font-bold text-center ${
              battlePoints > 10 ? 'text-yellow-400' : 
              battlePoints > 0 ? 'text-yellow-300' : 'text-red-400'
            }`}>
              {battlePoints} / {maxBattlePoints}
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-xs text-yellow-400 mb-1">Encounter Gauge</div>
          <div className="h-2 bg-[#3d2b6e] rounded overflow-hidden border border-[#5a3c8a]">
            <div 
              className={`h-full transition-all duration-300 ${
                encounterRate < 30 ? 'bg-blue-600' :
                encounterRate < 60 ? 'bg-yellow-600' :
                encounterRate < 80 ? 'bg-orange-600' : 'bg-red-600'
              }`}
              style={{ width: `${encounterRate}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-0.5">槽越高越容易与敌人相遇</div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-gray-400">Level</div>
            <div className="text-lg font-bold text-white">{player.level}LV</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Money</div>
            <div className="text-lg font-bold text-yellow-400">{player.gold}G</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">EXP</div>
            <div className="text-lg font-bold text-green-400">{player.exp}</div>
            <div className="h-1.5 bg-[#3d2b6e] rounded overflow-hidden mt-1">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${expPercent}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">Next {player.expToNextLevel}</div>
          </div>
        </div>
      </div>
      
      {showMenu && <MenuOverlay onClose={() => setShowMenu(false)} />}
      
      {showBonus && <BonusOverlay onClose={() => setShowBonus(false)} />}
      
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#2d1b4e] border-2 border-red-500 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-4">BATTLE POINT 耗尽!</div>
              <div className="text-gray-300 mb-6">战斗点数已用完，需要重新开始游戏才能继续战斗。</div>
              <div className="space-y-3">
                <button
                  onClick={handleReset}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-500 transition-colors"
                >
                  重新开始
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};