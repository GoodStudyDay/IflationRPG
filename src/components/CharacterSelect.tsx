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

const getHeroCategory = (hero: typeof heroData[0]) => {
  if (hero.atkBonus === 2) return 'atk';
  if (hero.agiBonus === 2) return 'agi';
  if (hero.hpBonus === 2) return 'hp';
  if (hero.lucBonus === 2) return 'luc';
  if (hero.defBonus === 2) return 'def';
  return 'atk';
};

const getHeroAbilityLevel = (hero: typeof heroData[0]) => {
  return hero.atkBonus + hero.hpBonus + hero.defBonus + hero.agiBonus + hero.lucBonus;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'atk': return { bg: 'bg-orange-700', border: 'border-orange-500', text: 'text-orange-100', light: 'bg-orange-900/30' };
    case 'agi': return { bg: 'bg-blue-700', border: 'border-blue-500', text: 'text-blue-100', light: 'bg-blue-900/30' };
    case 'hp': return { bg: 'bg-green-700', border: 'border-green-500', text: 'text-green-100', light: 'bg-green-900/30' };
    case 'luc': return { bg: 'bg-yellow-700', border: 'border-yellow-500', text: 'text-yellow-100', light: 'bg-yellow-900/30' };
    case 'def': return { bg: 'bg-gray-700', border: 'border-gray-500', text: 'text-gray-100', light: 'bg-gray-900/30' };
    default: return { bg: 'bg-gray-700', border: 'border-gray-500', text: 'text-gray-100', light: 'bg-gray-900/30' };
  }
};

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

  const getHeroLevel = (heroId: number): number => {
    return getCurrentKyaraLv(kyarakutaKozinExp, heroId);
  };

  const atkHeroes = heroData.filter(h => getHeroCategory(h) === 'atk');
  const agiHeroes = heroData.filter(h => getHeroCategory(h) === 'agi');
  const hpHeroes = heroData.filter(h => getHeroCategory(h) === 'hp');
  const lucHeroes = heroData.filter(h => getHeroCategory(h) === 'luc');

  const renderHeroButton = (hero: typeof heroData[0]) => {
    const isSelected = player.heroId === hero.id;
    const displaySize = 36;
    const bgSizeX = COLS * displaySize;
    const bgSizeY = ROWS * displaySize;
    const frame = frames[hero.id] || 0;
    const bgPosX = -frame * displaySize;
    const bgPosY = 0;
    
    const imagePath = BASE_URL + getHeroSpritePath(hero.id, 'idle').replace(/^\//, '');
    const abilityLv = getHeroAbilityLevel(hero);
    const heroLv = getHeroLevel(hero.id);
    const category = getHeroCategory(hero);
    const color = getCategoryColor(category);
    
    return (
      <button
        key={hero.id}
        onClick={() => handleHeroSelect(hero.id)}
        className={`relative rounded-lg border-2 transition-all duration-200 ${
          isSelected
            ? 'border-yellow-400 bg-yellow-400/20 scale-105'
            : `${color.border} ${color.light} hover:${color.bg}/50`
        }`}
      >
        <div className="p-1">
          <div
            style={{
              width: displaySize,
              height: displaySize,
              backgroundImage: `url(${imagePath})`,
              backgroundPosition: `${bgPosX}px ${bgPosY}px`,
              backgroundSize: `${bgSizeX}px ${bgSizeY}px`,
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
              margin: '0 auto',
            }}
          />
        </div>
        {heroLv > 0 && (
          <div className="absolute top-1 left-1 bg-black/70 text-yellow-400 text-[8px] font-bold px-1.5 py-0.5 rounded">
            LV.{heroLv}
          </div>
        )}
        <div className="text-center text-[8px] font-bold text-yellow-400 py-0.5">
          +{t('角色能力')}:{abilityLv}LV
        </div>
        {isSelected && (
          <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] to-[#2d1b4e] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-4 max-w-2xl">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">
            {t('角色选择')}
          </h1>
          <p className="text-gray-400 text-sm">{t('请选择角色')}</p>
        </div>

        <div className="text-center mb-4">
          <p className="text-yellow-400 text-sm">
            {t('天赋')}: {kyarakutalv}LV
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {t('天赋和角色能力的合计越高，数据值的倍率额外奖励会增加更多')}
          </p>
        </div>

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

        <div className="flex justify-center items-center mb-2">
          <div className="text-gray-400 text-sm font-bold">AGI</div>
          <div className="flex-1 h-px bg-gray-600 mx-2" />
          <div className="text-gray-400 text-sm font-bold">HP</div>
          <div className="flex-1 h-px bg-gray-600 mx-2" />
          <div className="text-gray-400 text-sm font-bold">LUC</div>
        </div>

        <div className="text-center mb-1">
          <span className={`font-bold text-sm px-2 py-0.5 rounded ${getCategoryColor('atk').bg} ${getCategoryColor('atk').text}`}>
            ATK
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2">
          {atkHeroes.slice(0, 4).map(renderHeroButton)}
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2">
          {atkHeroes.slice(4, 8).map(renderHeroButton)}
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2">
          {agiHeroes.map(renderHeroButton)}
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2">
          {hpHeroes.map(renderHeroButton)}
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-4">
          {lucHeroes.map(renderHeroButton)}
        </div>

        <div className="flex justify-center mb-4">
          <span className={`font-bold text-sm px-2 py-0.5 rounded ${getCategoryColor('def').bg} ${getCategoryColor('def').text}`}>
            DEF
          </span>
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
