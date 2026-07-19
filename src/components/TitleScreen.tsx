import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { SettingsModal } from './SettingsModal';
import { Leaderboard } from './Leaderboard';
import { PlayerInfo } from './PlayerInfo';
import { CharacterSelect } from './CharacterSelect';
import { LoadingScreen } from './LoadingScreen';
import { VERSION } from '@/data/version';
import { useTranslation } from '@/hooks/useTranslation';
import { preloadImages } from '@/utils/imageCache';
import { getAllGameImageUrls } from '@/utils/gameAssets';
import { bgmManager } from '@/utils/bgmManager';

type ScreenMode = 'top' | 'gamestart' | 'charselect';

export const TitleScreen = () => {
  const { startGame, resetGame, selectHero, player, battlePoints } = useGameStore();
  const { t } = useTranslation();
  const [screenMode, setScreenMode] = useState<ScreenMode>('top');
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPlayerInfo, setShowPlayerInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const hasSavedGame = player.gold > 0 || player.exp > 0 || player.level > 1;
  const canContinue = battlePoints > 0;

  // 标题画面：用户首次交互后播放标题BGM（浏览器自动播放策略要求用户交互后才能播放音频）
  useEffect(() => {
    const playTitleBgm = () => {
      bgmManager.bgmstartf(0);
      document.removeEventListener('click', playTitleBgm);
      document.removeEventListener('keydown', playTitleBgm);
      document.removeEventListener('touchstart', playTitleBgm);
    };
    document.addEventListener('click', playTitleBgm, { once: true });
    document.addEventListener('keydown', playTitleBgm, { once: true });
    document.addEventListener('touchstart', playTitleBgm, { once: true });
    return () => {
      document.removeEventListener('click', playTitleBgm);
      document.removeEventListener('keydown', playTitleBgm);
      document.removeEventListener('touchstart', playTitleBgm);
    };
  }, []);

  const handlePreloadAndStart = useCallback(async (callback: () => void) => {
    if (isLoading) return;
    
    setIsLoading(true);
    const urls = getAllGameImageUrls();
    setTotalImages(urls.length);
    setLoadingProgress(0);
    
    try {
      await preloadImages(urls, (loaded) => {
        setLoadingProgress(loaded);
      });
    } catch {
    }
    
    callback();
  }, [isLoading]);

  const handleStartGame = () => {
    if (hasSavedGame) {
      setScreenMode('gamestart');
    } else {
      setScreenMode('charselect');
    }
  };

  const handleNewGame = () => {
    resetGame();
    setScreenMode('charselect');
  };

  const handleContinue = () => {
    handlePreloadAndStart(() => {
      startGame();
    });
  };

  const handleBack = () => {
    setScreenMode('top');
  };

  const handlePlayerInfo = () => {
    setShowPlayerInfo(true);
  };

  const handleRanking = () => {
    setShowLeaderboard(true);
  };

  const handleHeroSelect = (heroId: number) => {
    handlePreloadAndStart(() => {
      selectHero(heroId);
      startGame();
    });
  };

  const handleCharSelectBack = () => {
    setScreenMode('top');
  };

  if (isLoading) {
    return (
      <LoadingScreen 
        progress={loadingProgress} 
        total={totalImages}
        onComplete={() => {}}
      />
    );
  }

  const renderContent = () => {
    if (screenMode === 'charselect') {
      return (
        <CharacterSelect 
          onSelect={handleHeroSelect} 
          onBack={handleCharSelectBack} 
        />
      );
    }

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
              <h1 className="text-4xl sm:text-6xl font-black tracking-wider">
                <span className="text-red-600 drop-shadow-lg">Iflation</span>
                <span className="text-yellow-500 drop-shadow-lg">RPG</span>
              </h1>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs px-4">
            <button
              onClick={handleNewGame}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
            >
              {t('重新开始')}
            </button>
            <div className="text-xs text-gray-600 px-2 mb-2 text-center">{t('继承上次进度')}</div>
            
            {canContinue && (
              <button
                onClick={handleContinue}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
              >
                {t('继续游戏')}
              </button>
            )}
            
            <button
              onClick={handleBack}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
            >
              {t('戻る')}
            </button>
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <div className="text-gray-600 font-bold text-xs sm:text-sm opacity-80">
              {VERSION}
            </div>
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
            <h1 className="text-4xl sm:text-6xl font-black tracking-wider">
              <span className="text-red-600 drop-shadow-lg">Iflation</span>
              <span className="text-yellow-500 drop-shadow-lg">RPG</span>
            </h1>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs px-4">
          <button
            onClick={handleStartGame}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
          >
            {t('游戏开始')}
          </button>
          
          <button
            onClick={handlePlayerInfo}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-base sm:text-lg py-2 sm:py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
          >
            {t('玩家信息')}
          </button>
          
          <button
            onClick={handleRanking}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-base sm:text-lg py-2 sm:py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
          >
            {t('ランキング')}
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-base sm:text-lg py-2 sm:py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
          >
            {t('オプション')}
            <span className="block text-xs sm:text-sm opacity-70">SETTING</span>
          </button>
        </div>

        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          <a 
            href="https://github.com/GoodStudyDay/IflationRPG/actions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <div className="text-gray-600 font-bold text-xs sm:text-sm opacity-80">
            {VERSION}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <PlayerInfo isOpen={showPlayerInfo} onClose={() => setShowPlayerInfo(false)} />
    </>
  );
};
