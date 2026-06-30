import { useGameStore } from '@/stores/gameStore';

export const BattleResult = () => {
  const { battle, battlePoints, setCurrentScene, player, clearBattleResult } = useGameStore();
  
  const { battleResult } = battle;
  
  if (!battleResult) return null;
  
  const isGameOver = !battleResult.victory && battlePoints + (battleResult.battlePointsChange || 0) <= 0;
  
  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGameOver) {
      return;
    }
    clearBattleResult();
    setCurrentScene('world');
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
      onClick={handleContinue}
    >
      <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {battleResult.victory ? (
              <span className="text-green-400">胜利!</span>
            ) : (
              <span className="text-red-400">失败!</span>
            )}
          </h2>
        </div>
        
        {battleResult.victory ? (
          <div className="space-y-4">
            <div className="bg-[#1a0a2e] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Money</div>
              <div className="text-2xl font-bold text-yellow-400">
                {player.gold}G +{battleResult.goldReward}G
              </div>
            </div>
            
            <div className="bg-[#1a0a2e] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">EXP</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-green-400 h-4 rounded-full transition-all"
                    style={{ width: `${(player.exp / player.expToNextLevel) * 100}%` }}
                  />
                </div>
                <div className="text-lg font-bold text-green-400">
                  +{battleResult.expReward}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {player.exp}/{player.expToNextLevel}
              </div>
            </div>
            
            {battleResult.dropItem && (
              <div className="bg-[#1a0a2e] rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-2">装备</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#3a2a5e] rounded-lg flex items-center justify-center text-2xl">
                    {battleResult.dropItem.icon}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-400">
                      {battleResult.dropItem.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {battleResult.dropItem.description}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#1a0a2e] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">惩罚</div>
              <div className="text-2xl font-bold text-red-400">
                BATTLE POINT -{Math.abs(battleResult.battlePointsChange || 0)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                剩余: {battlePoints + (battleResult.battlePointsChange || 0)}
              </div>
            </div>
            
            {isGameOver && (
              <div className="bg-red-900/50 rounded-lg p-4 border border-red-500">
                <div className="text-red-400 font-bold text-lg">游戏结束!</div>
                <div className="text-gray-400 text-sm mt-1">即将返回标题页面...</div>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center text-gray-500 text-sm mt-6">
          点击画面打开回到地图
        </div>
      </div>
    </div>
  );
};
