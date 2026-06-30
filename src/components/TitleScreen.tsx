import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

type ScreenMode = 'top' | 'gamestart';

export const TitleScreen = () => {
  const { startGame, resetGame, player, battlePoints } = useGameStore();
  const [screenMode, setScreenMode] = useState<ScreenMode>('top');

  const hasSavedGame = player.gold > 0 || player.exp > 0 || player.level > 1;
  const canContinue = battlePoints > 0;

  const handleStartGame = () => {
    if (hasSavedGame) {
      setScreenMode('gamestart');
    } else {
      startGame();
    }
  };

  const handleNewGame = () => {
    resetGame();
    startGame();
  };

  const handleContinue = () => {
    startGame();
  };

  const handleBack = () => {
    setScreenMode('top');
  };

  const handlePlayerInfo = () => {
    alert('玩家信息：\n\n等级: ' + player.level + '\nHP: ' + player.hp + '/' + player.maxHp + '\nATK: ' + player.attack + '\nDEF: ' + player.defense + '\nG: ' + player.gold);
  };

  const handleRanking = () => {
    alert('排行榜功能开发中...');
  };

  const handleSettings = () => {
    alert('设置功能开发中...');
  };

  if (screenMode === 'gamestart') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#90EE90] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-400 rounded-full" />
          <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full" />
          <div className="absolute top-15 right-20 w-6 h-6 bg-white rounded-full" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#7CFC00]" />
        </div>

        <div className="relative z-10 mb-8">
          <div className="text-center">
            <h1 className="text-6xl font-black tracking-wider">
              <span className="text-red-600 drop-shadow-lg">Iflation</span>
              <span className="text-yellow-500 drop-shadow-lg">RPG</span>
            </h1>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs px-4">
          <button
            onClick={handleNewGame}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-xl py-4 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
          >
            从新开始
          </button>
          <div className="text-xs text-gray-600 px-2 mb-2 text-center">前回までの引き継いでます</div>
          
          {canContinue && (
            <button
              onClick={handleContinue}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-xl py-4 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
            >
              继续游戏
            </button>
          )}
          
          <button
            onClick={handleBack}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-xl py-4 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#90EE90] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-400 rounded-full" />
        <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full" />
        <div className="absolute top-15 right-20 w-6 h-6 bg-white rounded-full" />
        
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#7CFC00]">
          <div className="absolute top-10 left-1/4 w-4 h-4 bg-pink-400 rounded-full" />
          <div className="absolute top-15 left-1/3 w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="absolute top-8 left-1/2 w-4 h-4 bg-pink-400 rounded-full" />
          <div className="absolute top-20 left-2/3 w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="absolute top-12 right-1/4 w-4 h-4 bg-pink-400 rounded-full" />
          
          <div className="absolute top-0 left-1/5 w-8 h-32 bg-[#654321] rounded-t-lg">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#8B7355] rounded-full" />
            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#8B7355] rounded-full" />
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#8B7355] rounded-full" />
          </div>
          
          <div className="absolute top-0 right-1/5 w-8 h-32 bg-[#654321] rounded-t-lg">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#8B7355] rounded-full" />
            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#8B7355] rounded-full" />
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#8B7355] rounded-full" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-8">
        <div className="text-center">
          <h1 className="text-6xl font-black tracking-wider">
            <span className="text-red-600 drop-shadow-lg">Iflation</span>
            <span className="text-yellow-500 drop-shadow-lg">RPG</span>
          </h1>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs px-4">
        <button
          onClick={handleStartGame}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-xl py-4 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
        >
          游戏开始
        </button>
        
        <button
          onClick={handlePlayerInfo}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
        >
          玩家信息
        </button>
        
        <button
          onClick={handleRanking}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
        >
          排行
        </button>
        
        <button
          onClick={handleSettings}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
        >
          设置
          <span className="block text-sm opacity-70">SETTING</span>
        </button>
      </div>
    </div>
  );
};
