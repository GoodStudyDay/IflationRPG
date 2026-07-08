import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { CharacterSprite } from './CharacterSprite';
import { BattleResult } from './BattleResult';
import { SpriteIcon } from './SpriteIcon';
import { getEquipmentById } from '@/data/equipment';
import { useTranslation } from '@/hooks/useTranslation';
import { useEquipmentName } from '@/hooks/useEquipmentName';

export const BattleScreen = () => {
  const { t } = useTranslation();
  const { getEquipName } = useEquipmentName();
  const { 
    player, 
    battle, 
    toggleBattle, 
    resumeBattle, 
    tryEscape,
    setRecoverNextTurn,
    hardmode,
  } = useGameStore();
  
  const canRecover = !battle.recoverUsed && player.hp < player.maxHp;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [battle.battleLog]);
  
  

  if (!battle.enemy) return null;
  
  const playerHpPercent = player.maxHp > 0 ? (player.hp / player.maxHp) * 100 : 0;

  const renderDamageDisplay = () => {
    if (battle.damageDisplay === null) return null;
    
    const isPlayerTarget = battle.lastAttacker === 'player';
    const topPosition = isPlayerTarget ? 'top-1/4 sm:top-1/2' : 'bottom-36 sm:bottom-36 md:bottom-44';
    
    return (
      <div 
        className={`absolute ${topPosition} left-1/2 transform -translate-x-1/2 -translate-y-full text-center pointer-events-none z-20 animate-damage-float`}
      >
        <div className="flex flex-col gap-1">
          {battle.isCrit && (
            <div className="text-yellow-300 text-sm sm:text-base font-bold animate-pulse drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]">
              {t('暴击')}
            </div>
          )}
          {battle.isCombo && (
            <div className="text-orange-400 text-xs sm:text-sm font-bold">
              {t('{0}连击').replace('{0}', String(battle.comboCount))}
            </div>
          )}
          <div className={`font-black text-xl sm:text-3xl md:text-4xl ${
            battle.isCrit ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]' : 
            isPlayerTarget ? 'text-red-400' : 'text-blue-400'
          }`}>
            {battle.damageDisplay.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  const handleHeal = () => {
    setRecoverNextTurn(true);
    resumeBattle();
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
        
        <div className="hidden sm:block absolute top-0 left-0 w-8 h-full border-l-2 border-blue-500/50" />
        <div className="hidden sm:block absolute top-0 right-0 w-8 h-full border-r-2 border-blue-500/50" />
        <div className="absolute top-0 left-0 h-6 sm:h-8 w-full border-t-2 border-blue-500/50" />
        <div className="absolute bottom-0 left-0 h-6 sm:h-8 w-full border-b-2 border-blue-500/50" />
        
        <div className="absolute top-1 sm:top-2 left-0 right-0 flex justify-around px-2 sm:px-4 text-[10px] sm:text-xs font-bold">
          <span className="text-yellow-400">{t('Combo')} : {Math.round(battle.comboRate)}%</span>
          <span className="text-red-400">{t('CRI')} : {Math.round(battle.critRate)}%</span>
          <span className="text-green-400">{t('HPrate')} : {Math.round(battle.hpRate)}%</span>
        </div>
        
        <div className="absolute top-4 sm:top-10 left-0 right-0 flex justify-center px-2 sm:px-4 text-[10px] sm:text-xs">
          <div className="bg-black/50 px-2 py-1 rounded">
            <span className="text-purple-400">{t('掉落率')}: {Math.round(battle.dropRate)}%</span>
            <span className="text-gray-400 mx-1">|</span>
            <span className="text-blue-400">{t('目标')}: {getEquipName(battle.dropItemName)}</span>
          </div>
        </div>
        
        <div className="absolute top-8 sm:top-16 left-1/2 transform -translate-x-1/2 w-full px-4 sm:px-8 flex justify-center">
          <div className="w-full max-w-md">
            <div className="h-3 sm:h-4 bg-gray-800 rounded overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-300"
                style={{ width: `${((battle.enemy.hp / battle.enemy.maxHp) * 100)}%` }}
              />
            </div>
            <div className="text-center text-white text-[10px] sm:text-xs mt-1">
              {battle.enemy.hp.toLocaleString()} / {battle.enemy.maxHp.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="absolute top-[8%] sm:top-[18%] left-1/2 transform -translate-x-1/2 text-center w-full px-4">
          <div className={`relative transition-transform duration-100 ${
            battle.enemyAnimation === 'attack' ? 'scale-110' : 
            battle.enemyAnimation === 'hurt' ? 'scale-95 opacity-70' : ''
          }`}>
            {battle.enemy.imageUrl ? (
              <img 
                src={battle.enemy.imageUrl} 
                alt={battle.enemy.name}
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain rounded-lg border-2 border-red-500/50 mx-auto"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  img.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#3d2b6e] rounded-lg border-2 border-red-500 flex items-center justify-center mx-auto ${battle.enemy.imageUrl ? 'hidden' : ''}`}>
              {battle.enemy.icon ? (
                <img 
                  src={battle.enemy.icon} 
                  alt={battle.enemy.name}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <span className="text-3xl sm:text-5xl md:text-6xl">?</span>
              )}
            </div>
            
          </div>
          <div className="text-red-400 font-bold text-xs sm:text-sm md:text-base mt-1">{t(battle.enemy.name)}</div>
          
          {battle.lastAttacker === 'player' && renderDamageDisplay()}
          
          {(battle.enemy.drops && battle.enemy.drops.length > 0) && (
            <div className="mt-1 text-[10px] sm:text-xs text-gray-400 max-w-xs mx-auto">
              <div className="text-gray-500 mb-1">{t('掉落')}:</div>
              {(() => {
                const start = hardmode * 3;
                const modeDrops = battle.enemy.drops.slice(start, start + 3);
                return modeDrops.filter(d => d !== null).map((drop, index) => {
                  const equipment = getEquipmentById(drop!.equipmentId);
                  const itemName = equipment ? getEquipName(equipment.name) : drop!.equipmentId;
                  const getSpriteType = () => {
                    if (!equipment) return 'accessory';
                    switch (equipment.type) {
                      case 'weapon': return 'weapon';
                      case 'armor': return 'armor';
                      case 'soul': return 'soul';
                      default: return 'accessory';
                    }
                  };
                  return (
                    <div key={index} className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        {equipment && equipment.x !== undefined && equipment.y !== undefined ? (
                          <SpriteIcon 
                            type={getSpriteType()} 
                            x={equipment.x} 
                            y={equipment.y} 
                            size="small" 
                          />
                        ) : (
                          <span className="text-xs">📦</span>
                        )}
                        <span className="truncate">{itemName}</span>
                      </div>
                      <span className="text-yellow-400 ml-2">{(drop!.dropRate * 100).toFixed(1)}%</span>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
        
        <div className="absolute bottom-32 sm:bottom-36 md:bottom-44 left-1/2 transform -translate-x-1/2 text-center w-full px-4">
          <div className={`relative transition-transform duration-100 ${
            battle.playerAnimation === 'attack' ? 'scale-110 translate-x-4' : 
            battle.playerAnimation === 'hurt' ? 'scale-95 opacity-70 -translate-x-2' : ''
          }`}>
            <CharacterSprite 
              animation={battle.playerAnimation} 
              size={56}
              className="sm:hidden mx-auto"
              useBackView={true}
            />
            <CharacterSprite 
              animation={battle.playerAnimation} 
              size={80}
              className="hidden sm:block md:hidden mx-auto"
              useBackView={true}
            />
            <CharacterSprite 
              animation={battle.playerAnimation} 
              size={96}
              className="hidden md:block mx-auto"
              useBackView={true}
            />
          </div>
          <div className="text-white font-bold text-[10px] sm:text-xs md:text-sm mt-1">{player.name}</div>
          
          {battle.lastAttacker === 'enemy' && renderDamageDisplay()}
        </div>
        
        <div className="absolute bottom-24 sm:bottom-28 md:bottom-36 left-1/2 transform -translate-x-1/2 w-28 sm:w-40 md:w-48">
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
          className="absolute bottom-1 left-2 right-2 sm:left-4 sm:right-4 h-14 sm:h-20 md:h-24 bg-[#1a0a2e]/80 rounded-lg border border-[#4a2c7a] p-2 sm:p-3 overflow-y-auto"
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
                {t('战斗暂停')}
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
                  {player.hp >= player.maxHp ? t('HP已满') : t('恢复')}
                </button>
                <button
                  onClick={tryEscape}
                  className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors text-base sm:text-lg"
                >
                  {t('逃跑')}
                </button>
                <button
                  onClick={resumeBattle}
                  className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors text-base sm:text-lg"
                >
                  {t('返回战斗')}
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
