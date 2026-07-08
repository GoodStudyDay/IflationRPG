import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { heroData, getHeroSpritePath } from '@/data/heroData';
import { getCurrentKyaraLv } from '@/utils/kyaraLevel';
import { useTranslation } from '@/hooks/useTranslation';

const BASE_URL = import.meta.env.BASE_URL || '/';

interface CharacterSelectProps {
  onSelect: (heroId: number) => void;
  onBack: () => void;
}

type Difficulty = 0 | 1 | 2;

const DIFFICULTY_CONFIG = [
  { id: 0 as Difficulty, nameKey: '普通', color: 'bg-gray-600 border-gray-400', textColor: 'text-gray-100', descriptionKey: '适合新手玩家' },
  { id: 1 as Difficulty, nameKey: '困难', color: 'bg-red-600 border-red-400', textColor: 'text-red-100', descriptionKey: '怪物属性提升，需达成条件解锁' },
  { id: 2 as Difficulty, nameKey: '地狱', color: 'bg-purple-800 border-purple-500', textColor: 'text-purple-100', descriptionKey: '怪物属性大幅提升，需达成条件解锁' },
];

const COLS = 3;
const ROWS = 4;

export const CharacterSelect = ({ onSelect, onBack }: CharacterSelectProps) => {
  const { kyarakutalv, player, hardmodeUnlock, hellmodeUnlock, setHardmode, kyarakutaKozinExp } = useGameStore();
  const { t } = useTranslation();
  const [frames, setFrames] = useState<Record<number, number>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setFrames(prev => {
        const next = { ...prev };
        heroData.forEach(hero => {
          next[hero.id] = (next[hero.id] || 0 + 1) % COLS;
        });
        return next;
      });
    }, 300);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleHeroSelect = (heroId: number) => {
    setHardmode(selectedDifficulty);
    onSelect(heroId);
  };

  const isDifficultyUnlocked = (difficulty: Difficulty): boolean => {
    if (difficulty === 0) return true;
    if (difficulty === 1) return hardmodeUnlock === 1;
    if (difficulty === 2) return hellmodeUnlock === 1;
    return false;
  };

  const getStatDescription = (hero: typeof heroData[0]) => {
    const stats = [];
    if (hero.hpBonus > 0) stats.push(`HP+${hero.hpBonus}`);
    if (hero.atkBonus > 0) stats.push(`ATK+${hero.atkBonus}`);
    if (hero.defBonus > 0) stats.push(`DEF+${hero.defBonus}`);
    if (hero.agiBonus > 0) stats.push(`AGI+${hero.agiBonus}`);
    if (hero.lucBonus > 0) stats.push(`LUC+${hero.lucBonus}`);
    return stats.join(' ');
  };

  const getHeroLevel = (heroId: number): number => {
    return getCurrentKyaraLv(kyarakutaKozinExp, heroId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] to-[#2d1b4e] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-4 max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {t('角色选择')}
          </h1>
          <p className="text-gray-400 text-sm">{t('选择你的角色开始冒险')}</p>
        </div>

        {kyarakutalv > 0 && (
          <div className="text-center mb-4">
            <p className="text-yellow-400 text-sm">
              {t('基础能力')}: {kyarakutalv} LV
            </p>
            <p className="text-gray-500 text-xs mt-1">
              ※{t('基础能力LV说明')}
            </p>
          </div>
        )}

        {kyarakutalv === 0 && (
          <div className="text-center mb-4">
            <p className="text-gray-500 text-xs">
              ※{t('角色可更换说明')}
            </p>
          </div>
        )}

        <div className="text-center mb-4">
          <p className="text-gray-400 text-xs mb-2">{t('选择难度')}</p>
          <div className="flex justify-center gap-2">
            {DIFFICULTY_CONFIG.map((diff) => {
              const unlocked = isDifficultyUnlocked(diff.id);
              const isSelected = selectedDifficulty === diff.id;
              
              return (
                <button
                  key={diff.id}
                  onClick={() => unlocked && setSelectedDifficulty(diff.id)}
                  disabled={!unlocked}
                  className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                    isSelected
                      ? `${diff.color} scale-105`
                      : unlocked
                        ? `bg-gray-700 border-gray-500 text-gray-200 hover:bg-gray-600`
                        : `bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50`
                  }`}
                >
                  {unlocked ? (
                    <>
                      <span>{t(diff.nameKey)}</span>
                      {isSelected && <span className="ml-1">✓</span>}
                    </>
                  ) : (
                    <span>🔒</span>
                  )}
                </button>
              );
            })}
          </div>
          {!isDifficultyUnlocked(1) && (
            <p className="text-gray-500 text-xs mt-1">{t('困难模式: 最高等级超过100000解锁')}</p>
          )}
          {!isDifficultyUnlocked(2) && (
            <p className="text-gray-500 text-xs">{t('地狱模式: 最高等级超过10000000解锁')}</p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
          {heroData.map((hero) => {
            const isSelected = player.heroId === hero.id;
            const displaySize = 40;
            const bgSizeX = COLS * displaySize;
            const bgSizeY = ROWS * displaySize;
            const frame = frames[hero.id] || 0;
            const bgPosX = -frame * displaySize;
            const bgPosY = 0;
            
            const imagePath = BASE_URL + getHeroSpritePath(hero.id, 'idle').replace(/^\//, '');
            
            return (
              <button
                key={hero.id}
                onClick={() => handleHeroSelect(hero.id)}
                className={`relative aspect-square rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-400/20 scale-105'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    style={{
                      width: displaySize,
                      height: displaySize,
                      backgroundImage: `url(${imagePath})`,
                      backgroundPosition: `${bgPosX}px ${bgPosY}px`,
                      backgroundSize: `${bgSizeX}px ${bgSizeY}px`,
                      backgroundRepeat: 'no-repeat',
                      imageRendering: 'pixelated',
                    }}
                  />
                  {getHeroLevel(hero.id) > 0 && (
                    <div className="absolute top-1 left-1 bg-black/70 text-yellow-400 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
                      LV.{getHeroLevel(hero.id)}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 rounded-b-lg py-1">
                  <div className="text-center text-[8px] sm:text-[10px] text-white font-bold truncate px-1">
                    {hero.name}
                  </div>
                  <div className="text-center text-[6px] sm:text-[8px] text-gray-400 truncate px-1">
                    {getStatDescription(hero)}
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-base py-3 px-8 rounded-lg border-4 border-gray-400 shadow-lg active:scale-95 transition-all"
        >
          {t('返回')}
        </button>
      </div>
    </div>
  );
};