import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { CharacterSprite } from './CharacterSprite';
import { BattleResult } from './BattleResult';
import type { Enemy } from '@/types';

const HP_BAR_DATA = [
  [1000, 1500, 2500, 4000, 7500],
  [15000, 60000, 100000, 200000, 400000],
  [1000000, 2500000, 4000000, 7500000, 12500000],
  [40000000, 75000000, 200000000, 400000000, -1],
];

const getHPBarSegments = (maxHp: number): { y: number; x: number; total: number }[] => {
  const segments: { y: number; x: number; total: number }[] = [];
  let currentSum = 0;
  
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 5; x++) {
      const segmentHp = HP_BAR_DATA[y][x];
      if (segmentHp === -1) break;
      
      if (currentSum + segmentHp >= maxHp) {
        segments.push({ y, x, total: maxHp - currentSum });
        return segments;
      }
      
      segments.push({ y, x, total: segmentHp });
      currentSum += segmentHp;
      
      if (currentSum >= maxHp) {
        return segments;
      }
    }
  }
  
  return segments;
};

export const BattleScreen = () => {
  const { 
    player, 
    battle, 
    toggleBattle, 
    resumeBattle, 
    tryEscape,
    setRecoverNextTurn,
  } = useGameStore();
  
  const canRecover = !battle.recoverUsed && player.hp < player.maxHp;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [battle.battleLog]);
  
  useEffect(() => {
    const handleKeyDown = () => {
      toggleBattle();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleBattle]);
  
  if (!battle.enemy) return null;
  
  const enemyHpPercent = battle.enemy.maxHp > 0 ? (battle.enemy.hp / battle.enemy.maxHp) * 100 : 0;
  const playerHpPercent = player.maxHp > 0 ? (player.hp / player.maxHp) * 100 : 0;
  const expPercent = player.expToNextLevel > 0 ? (player.exp / player.expToNextLevel) * 100 : 0;
  
  const totalAttack = player.attack;
  const totalDefense = player.defense;

  const hpSegments = useMemo(() => getHPBarSegments((battle.enemy as Enemy).maxHp), [battle.enemy?.maxHp]);
  
  const currentHpSegments = useMemo(() => {
    let remainingHp = (battle.enemy as Enemy).hp;
    return hpSegments.map(segment => {
      const filled = Math.min(remainingHp, segment.total);
      remainingHp -= filled;
      return { ...segment, filled };
    }).filter(s => s.filled > 0);
  }, [battle.enemy.hp, hpSegments]);
  
  const handleHeal = () => {
    setRecoverNextTurn(true);
    resumeBattle();
  };
  
  const getBarColor = (y: number) => {
    const colors = ['bg-red-600', 'bg-orange-500', 'bg-blue-500', 'bg-purple-500'];
    return colors[y] || 'bg-red-600';
  };
  
  return (
    <div 
      className="min-h-screen bg-[#1a0a2e] flex flex-col relative"
      onClick={() => {
        if (battle.status === 'idle' || battle.status === 'fighting') {
          toggleBattle();
        }
      }}
    >
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d5a2d] to-[#1a3a1a]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600 rounded-full blur-3xl" />
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-8 h-full border-l-2 border-blue-500/50" />
        <div className="absolute top-0 right-0 w-8 h-full border-r-2 border-blue-500/50" />
        <div className="absolute top-0 left-0 h-8 w-full border-t-2 border-blue-500/50" />
        <div className="absolute bottom-0 left-0 h-8 w-full border-b-2 border-blue-500/50" />
        
        <div className="absolute top-2 left-0 right-0 flex justify-around px-4 sm:px-8 text-xs sm:text-sm font-bold">
          <span className="text-yellow-400">Combo : {Math.round(battle.comboRate)}%</span>
          <span className="text-red-400">CRI : {Math.round(battle.critRate)}%</span>
          <span className="text-green-400">HPrate : {Math.round(battle.hpRate)}%</span>
        </div>
        
        <div className="absolute top-8 left-2 sm:left-4 w-28 sm:w-32 bg-[#1a0a2e]/90 rounded-lg border border-[#4a2c7a] p-1.5 sm:p-2">
          <div className="text-center text-white font-bold text-[10px] sm:text-xs mb-0.5 sm:mb-1">{player.name}</div>
          <div className="text-center text-blue-400 text-[10px] sm:text-xs">LV.{player.level}</div>
          <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-gray-400">HP</span>
              <span className="text-red-400">{player.hp}/{player.maxHp}</span>
            </div>
            <div className="h-1 sm:h-1.5 bg-[#3d2b6e] rounded overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-gray-400">EXP</span>
              <span className="text-yellow-400">{player.exp}/{player.expToNextLevel}</span>
            </div>
            <div className="h-1 sm:h-1.5 bg-[#3d2b6e] rounded overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${expPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-gray-400">ATK</span>
              <span className="text-orange-400">{totalAttack}</span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-gray-400">DEF</span>
              <span className="text-blue-400">{totalDefense}</span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-gray-400">G</span>
              <span className="text-green-400">{player.gold}</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-10 right-2 sm:right-4 w-28 sm:w-32 bg-[#1a0a2e]/90 rounded-lg border border-[#4a2c7a] p-1.5 sm:p-2">
          <div className="text-center text-red-400 font-bold text-[10px] sm:text-xs mb-0.5 sm:mb-1">{battle.enemy.name}</div>
          <div className="text-center text-gray-400 text-[10px] sm:text-xs">LV.{battle.enemy.level}</div>
          <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-gray-400">HP</span>
              <span className="text-red-400">{battle.enemy.hp}/{battle.enemy.maxHp}</span>
            </div>
            <div className="h-1.5 sm:h-2 bg-[#3d2b6e] rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-300"
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-gray-400">ATK</span>
              <span className="text-orange-400">{battle.enemy.attack}</span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-gray-400">DEF</span>
              <span className="text-blue-400">{battle.enemy.defense}</span>
            </div>
          </div>
          {battle.dropItemName && (
            <div className="mt-2 pt-2 border-t border-[#4a2c7a]/50">
              <span className="text-green-400 text-[10px] sm:text-xs font-bold">
                {battle.dropRate > 100
                  ? `Drop : ${battle.dropItemName} (100.00%)`
                  : battle.dropRate > 0
                  ? `Drop : ${battle.dropItemName} (${battle.dropRate.toFixed(2)}%)`
                  : `Drop : ${battle.dropItemName} (Max)`}
              </span>
            </div>
          )}
        </div>
        
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full px-8 flex justify-center">
          <div className="flex flex-col-reverse gap-1 w-full max-w-md">
            {currentHpSegments.map((segment, index) => {
              const widthPercent = (segment.filled / segment.total) * 100;
              return (
                <div 
                  key={index} 
                  className="h-2 bg-gray-800 rounded overflow-hidden border border-gray-700"
                >
                  <div 
                    className={`h-full transition-all duration-300 ${getBarColor(segment.y)}`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center mt-10">
          <div className={`relative transition-transform duration-100 ${
            battle.enemyAnimation === 'attack' ? 'scale-110' : 
            battle.enemyAnimation === 'hurt' ? 'scale-95 opacity-70' : ''
          }`}>
            {battle.enemy.imageUrl ? (
              <img 
                src={battle.enemy.imageUrl} 
                alt={battle.enemy.name}
                className="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-lg border-2 border-red-500/50"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  img.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-20 h-20 sm:w-32 sm:h-32 bg-[#3d2b6e] rounded-lg border-2 border-red-500 flex items-center justify-center ${battle.enemy.imageUrl ? 'hidden' : ''}`}>
              <span className="text-4xl sm:text-6xl">{battle.enemy.icon}</span>
            </div>
            {battle.enemyAnimation === 'hurt' && (
              <div className="absolute inset-0 bg-red-500/50 animate-pulse rounded-lg" />
            )}
          </div>
        </div>
        
        <div className="absolute bottom-28 sm:bottom-36 left-1/2 transform -translate-x-1/2 text-center">
          <div className={`relative transition-transform duration-100 ${
            battle.playerAnimation === 'attack' ? 'scale-110 translate-x-4' : 
            battle.playerAnimation === 'hurt' ? 'scale-95 opacity-70 -translate-x-2' : ''
          }`}>
            <div className="sm:hidden">
              <CharacterSprite 
                animation={battle.playerAnimation} 
                size={64}
              />
            </div>
            <div className="hidden sm:block">
              <CharacterSprite 
                animation={battle.playerAnimation} 
                size={96}
              />
            </div>
          </div>
          <div className="text-white font-bold text-xs sm:text-sm mt-1">{player.name}</div>
        </div>
        
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 w-36 sm:w-48">
          <div className="h-2 sm:h-3 bg-[#3d2b6e] rounded overflow-hidden border border-[#5a3c8a]">
            <div 
              className="h-full bg-gradient-to-r from-blue-700 to-blue-500 transition-all duration-300"
              style={{ width: `${playerHpPercent}%` }}
            />
          </div>
          <div className="text-center text-white text-[10px] sm:text-xs mt-1">
            {player.hp}/{player.maxHp}
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-20 sm:h-24 bg-[#1a0a2e]/80 rounded-lg border border-[#4a2c7a] p-2 sm:p-3 overflow-y-auto"
        >
          {battle.battleLog.map((log, index) => (
            <div 
              key={index} 
              className={`text-[10px] sm:text-xs mb-1 ${
                index === battle.battleLog.length - 1 ? 'text-white' : 'text-gray-500'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
        
        {battle.status === 'paused' && (
          <div 
            className="absolute inset-0 bg-black/70 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4">
              <div className="text-center text-white font-bold mb-4">
                战斗暂停
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleHeal}
                  disabled={!canRecover}
                  className={`w-full font-bold py-3 rounded-lg transition-colors text-base sm:text-lg ${
                    canRecover 
                      ? 'bg-green-700 hover:bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {player.hp >= player.maxHp ? 'HP已满' : '恢复'}
                </button>
                <button
                  onClick={tryEscape}
                  className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors text-base sm:text-lg"
                >
                  逃跑
                </button>
                <button
                  onClick={resumeBattle}
                  className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors text-base sm:text-lg"
                >
                  返回战斗
                </button>
              </div>
            </div>
          </div>
        )}
        
        <BattleResult />
      </div>
    </div>
  );
};
