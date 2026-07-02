import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { heroData, getHeroSpritePath } from '@/data/heroData';

const BASE_URL = import.meta.env.BASE_URL || '/';

interface CharacterSelectProps {
  onSelect: (heroId: number) => void;
  onBack: () => void;
}

const COLS = 3;
const ROWS = 4;

export const CharacterSelect = ({ onSelect, onBack }: CharacterSelectProps) => {
  const { kyarakutalv, player } = useGameStore();
  const [frames, setFrames] = useState<Record<number, number>>({});
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
    onSelect(heroId);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] to-[#2d1b4e] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-4 max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            角色选择
          </h1>
          <p className="text-gray-400 text-sm">选择你的角色开始冒险</p>
        </div>

        {kyarakutalv > 0 && (
          <div className="text-center mb-4">
            <p className="text-yellow-400 text-sm">
              基础能力: {kyarakutalv} LV
            </p>
            <p className="text-gray-500 text-xs mt-1">
              ※基础能力LV与角色能力LV的合计影响属性加成
            </p>
          </div>
        )}

        {kyarakutalv === 0 && (
          <div className="text-center mb-4">
            <p className="text-gray-500 text-xs">
              ※角色可以在游戏中随时更换
            </p>
          </div>
        )}

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
          返回
        </button>
      </div>
    </div>
  );
};