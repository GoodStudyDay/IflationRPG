import { useState, useCallback, useEffect, useRef } from 'react';
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
  
  const [heroFrame, setHeroFrame] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [leftStats, setLeftStats] = useState<{ hp: string; atk: string; def: string; agi: string; luc: string }>({ hp: '', atk: '', def: '', agi: '', luc: '' });
  const [rightStats, setRightStats] = useState<{ lv: string; gold: string; exp: string }>({ lv: '', gold: '', exp: '' });
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const fogRef = useRef({ time: 0, time2: 0 });
  const animationFrameRef = useRef<number>();

  const hasSavedGame = player.gold > 0 || player.exp > 0 || player.level > 1;
  const canContinue = battlePoints > 0;

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

  useEffect(() => {
    setHeroIndex(Math.floor(Math.random() * 16));
    const generateStats = () => {
      const rand = () => Math.floor(Math.random() * 99999);
      const randBig = () => Math.floor(Math.random() * 9999999999);
      setLeftStats({
        hp: `${rand()}(+${randBig()})`,
        atk: `${rand()}(+${rand()})`,
        def: `${rand()}(+${rand()})`,
        agi: `${rand()}(+${rand()})`,
        luc: `${rand()}(+${rand()})`,
      });
      setRightStats({
        lv: String(Math.floor(Math.random() * 99999)),
        gold: String(Math.floor(Math.random() * 9999999)),
        exp: String(Math.floor(Math.random() * 999999999)),
      });
    };
    generateStats();
    const interval = setInterval(generateStats, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      setHeroFrame(prev => (prev + 1) % 12);
      fogRef.current.time += 2;
      fogRef.current.time2 += 2;
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const showLvUp = () => {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 800);
    };
    const interval = setInterval(showLvUp, 3000 + Math.random() * 2000);
    showLvUp();
    return () => clearInterval(interval);
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
    bgmManager.okstart();
    if (hasSavedGame) {
      setScreenMode('gamestart');
    } else {
      setScreenMode('charselect');
    }
  };

  const handleNewGame = () => {
    bgmManager.okstart();
    resetGame();
    setScreenMode('charselect');
  };

  const handleContinue = () => {
    bgmManager.okstart();
    handlePreloadAndStart(() => {
      startGame();
    });
  };

  const handleBack = () => {
    bgmManager.okstart();
    setScreenMode('top');
  };

  const handlePlayerInfo = () => {
    bgmManager.okstart();
    setShowPlayerInfo(true);
  };

  const handleRanking = () => {
    bgmManager.okstart();
    setShowLeaderboard(true);
  };

  const handleHeroSelect = (heroId: number) => {
    bgmManager.okstart();
    handlePreloadAndStart(() => {
      selectHero(heroId);
      startGame();
    });
  };

  const handleCharSelectBack = () => {
    bgmManager.okstart();
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

  const heroFrameIndex = Math.floor(heroFrame * 0.25) % 3;
  const heroConfigs = [
    { spriteBase: 'heropng83', fileId: 963 },
    { spriteBase: 'heropng55', fileId: 945 },
    { spriteBase: 'heropng31', fileId: 936 },
    { spriteBase: 'heropng11', fileId: 23 },
    { spriteBase: 'heropng103', fileId: 957 },
    { spriteBase: 'heropng19', fileId: 972 },
    { spriteBase: 'heropng8', fileId: 966 },
    { spriteBase: 'heropng64', fileId: 954 },
    { spriteBase: 'heropng69', fileId: 978 },
    { spriteBase: 'heropng33', fileId: 951 },
    { spriteBase: 'heropng110', fileId: 939 },
    { spriteBase: 'heropng7', fileId: 960 },
    { spriteBase: 'heropng30', fileId: 975 },
    { spriteBase: 'heropng63', fileId: 969 },
    { spriteBase: 'heropng61', fileId: 948 },
    { spriteBase: 'heropng4', fileId: 942 },
  ];
  const heroConfig = heroConfigs[heroIndex];
  const heroImage = `/images/player/${heroConfig.fileId}_${heroConfig.spriteBase}_0.png`;

  const fogX = -(Math.cos(fogRef.current.time / 280 + fogRef.current.time / 500) * 0.5 + 0.5) * 640;
  const fogY = -(Math.sin(fogRef.current.time / 140 + fogRef.current.time / 900) * 0.5 + 0.5) * 60;
  const fog2X = -64 + Math.cos(fogRef.current.time2 / 500 + fogRef.current.time2 / 700) * 32;
  const fog2ScaleY = 0.8 + Math.cos(fogRef.current.time2 / 400 + fogRef.current.time2 / 400) * 0.4;

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
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
          <img 
            src="/images/logo/145_titlebackpng.png" 
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <img 
            src="/images/logo/143_logoENpng.png" 
            alt="Logo"
            className="absolute top-5 left-1/2 -translate-x-1/2 z-20"
          />

          <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs px-4 mt-32">
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
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <img 
          src="/images/logo/145_titlebackpng.png" 
          alt="Background"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />

        <img 
          src="/images/logo/143_logoENpng.png" 
          alt="Logo"
          className="absolute top-5 left-1/2 -translate-x-1/2 z-20"
        />

        <div 
          className="absolute z-10 pointer-events-none"
          style={{ left: '20px', top: '130px', transform: 'skewX(-15deg)' }}
        >
          <div className="p-1">
            <div className="text-white text-xs font-mono font-bold whitespace-nowrap opacity-90">HP {leftStats.hp}</div>
            <div className="text-white text-xs font-mono font-bold whitespace-nowrap opacity-90">ATK {leftStats.atk}</div>
            <div className="text-white text-xs font-mono font-bold whitespace-nowrap opacity-90">DEF {leftStats.def}</div>
            <div className="text-white text-xs font-mono font-bold whitespace-nowrap opacity-90">AGI {leftStats.agi}</div>
            <div className="text-white text-xs font-mono font-bold whitespace-nowrap opacity-90">LUC {leftStats.luc}</div>
          </div>
        </div>

        <div 
          className="absolute z-10 pointer-events-none"
          style={{ right: '25px', top: '150px', transform: 'skewX(15deg)' }}
        >
          <div className="p-1">
            <div className="text-white text-sm font-mono font-bold whitespace-nowrap opacity-90">{rightStats.lv}LV</div>
            <div className="text-white text-sm font-mono font-bold whitespace-nowrap opacity-90">{rightStats.gold}G</div>
            <div className="text-white text-xs font-mono font-bold whitespace-nowrap opacity-90">{rightStats.exp}EXP</div>
          </div>
        </div>

        <div
          className="absolute z-10"
          style={{ 
            left: '316px', 
            top: '220px', 
            transform: 'scale(1.5)',
            imageRendering: 'pixelated',
            width: '32px',
            height: '32px',
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: `-${heroFrameIndex * 32}px 0px`,
            backgroundSize: '96px 128px',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {showLevelUp && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{ 
              left: '270px', 
              top: '180px',
              animation: 'levelUpFloat 0.8s ease-out forwards',
            }}
          >
            <div className="text-pink-500 text-xl font-bold" style={{ textShadow: '2px 2px 0 #000' }}>LEVEL UP!</div>
            <div className="text-pink-500 text-xl font-bold" style={{ textShadow: '2px 2px 0 #000', marginTop: '-8px' }}>LEVEL UP!</div>
          </div>
        )}

        <img 
          src="/images/logo/1066.png"
          alt="Fog"
          className="absolute z-30 pointer-events-none"
          style={{ 
            left: fogX, 
            top: fogY, 
            opacity: 0.42,
            transform: 'scale(4)',
            transformOrigin: 'top left',
          }}
        />
        <img 
          src="/images/logo/1066.png"
          alt="Fog 2"
          className="absolute z-30 pointer-events-none"
          style={{ 
            left: fog2X, 
            top: 0, 
            opacity: 0.85,
            transform: `scaleX(1.2) scaleY(${fog2ScaleY})`,
            transformOrigin: 'top left',
          }}
        />

        <div className="relative z-20 flex flex-col gap-3 w-full max-w-xs px-4 mt-40">
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
            {t('游戏信息')}
          </button>
          
          <button
            onClick={handleRanking}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-base sm:text-lg py-2 sm:py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
          >
            {t('排行')}
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-base sm:text-lg py-2 sm:py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
          >
            {t('设置')}
            <span className="block text-xs sm:text-sm opacity-70">SETTING</span>
          </button>
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
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
      <style>{`
        @keyframes levelUpFloat {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; transform: translateY(-10px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-30px) scale(1); }
        }
      `}</style>
      {renderContent()}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <PlayerInfo isOpen={showPlayerInfo} onClose={() => setShowPlayerInfo(false)} />
    </>
  );
};
