import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { loadSaveData } from '@/utils/saveDataStorage';
import { EquipmentCollection } from './EquipmentCollection';
import { Leaderboard } from './Leaderboard';

export const GameoverScreen = () => {
  const { player, goToTitle } = useGameStore();
  const [showCollection, setShowCollection] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const saveData = loadSaveData();

  return (
    <div className="min-h-screen bg-black/80 flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black/80" />
      
      <div className="relative z-10 text-center px-4">
        <div className="text-4xl sm:text-6xl font-black text-white mb-2">GAME OVER</div>
        <div className="text-xl sm:text-2xl text-gray-400 mb-4">Result</div>
        
        <div className="text-5xl sm:text-7xl font-black text-yellow-400 mb-2 drop-shadow-[0_0_20px_rgba(255,200,0,0.5)]">
          {player.level.toLocaleString()} LV
        </div>
        
        {(player.level >= saveData.Highlv) && (
          <div className="text-yellow-300 text-sm sm:text-base animate-pulse">
            更新了最高级别！
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-[#2d1b4e]/80 border border-[#4a2c7a] rounded-lg p-3 text-left">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">角色能力信息</div>
            <div className="text-white text-sm">
              <div>获得{player.exp.toLocaleString()}EXP!</div>
              <div>合计为{player.exp.toLocaleString()}EXP / {player.expToNextLevel.toLocaleString()}EXP</div>
              <div>现在的角色能力为{player.level}LV</div>
              <div className="text-gray-500 text-xs mt-1">角色能力越高，属性值中的奖金倍增</div>
            </div>
          </div>
          
          <div className="bg-[#2d1b4e]/80 border border-[#4a2c7a] rounded-lg p-3 text-left">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">统计数据</div>
            <div className="text-white text-sm">
              <div>总体获得金额: {saveData.winbattle > 0 ? player.gold.toLocaleString() : '0'}G</div>
              <div>死亡次数: {saveData.gameovercount}</div>
              <div>击败BOSS: {saveData.HighCombo > 0 ? 1 : 0}</div>
              <div className="text-gray-500 text-xs mt-1">合计战斗次数: {saveData.winbattle + saveData.losebattle}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-3xl sm:text-4xl font-black text-yellow-400">
          当前所持金额为 {player.gold.toLocaleString()}G
        </div>

        <div className="mt-6 flex justify-center max-w-2xl mx-auto w-full">
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowCollection(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              菜单 / 装备
            </button>
            
            <button
              onClick={() => setShowLeaderboard(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              排行
            </button>
            
            <button
              onClick={goToTitle}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              标题
            </button>
          </div>
        </div>
      </div>

      {showCollection && (
        <EquipmentCollection onClose={() => setShowCollection(false)} />
      )}
      
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowLeaderboard(false)}>
          <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
        </div>
      )}
    </div>
  );
};