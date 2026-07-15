import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { CharacterSprite } from './CharacterSprite';
import { BattleResult } from './BattleResult';
import { BattleEffect } from './BattleEffect';
import { SpriteIcon } from './SpriteIcon';
import { getEquipmentById } from '@/data/equipment';
import { useTranslation } from '@/hooks/useTranslation';
import { useEquipmentName } from '@/hooks/useEquipmentName';

// 星空背景粒子
const Star = ({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color?: string }) => (
  <div
    className="absolute rounded-full animate-pulse"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color || 'rgba(255,255,255,0.8)',
      animationDuration: `${2 + ((x * 7 + y * 13) % 3)}s`,
      animationDelay: `${delay}s`,
      boxShadow: `0 0 ${size * 2}px ${size}px ${color || 'rgba(255,255,255,0.3)'}`,
    }}
  />
);

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
    clearBattleEffect,
  } = useGameStore();
  
  const recoveryCost = Math.floor(player.maxHp * 0.2);
  const currentGold = player.gold || 0;
  const canRecover = !battle.recoverUsed && player.hp < player.maxHp && 
    (currentGold >= recoveryCost || (currentGold / recoveryCost >= 0.6));
  const isPartialPay = canRecover && currentGold < recoveryCost;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [battle.battleLog]);
  
  

  if (!battle.enemy) return null;
  
  const playerHpPercent = player.maxHp > 0 ? (player.hp / player.maxHp) * 100 : 0;

  const renderMissDisplay = () => {
    if (!battle.isMiss) return null;
    
    const isPlayerTarget = battle.missPosition === 'player';
    const topPosition = isPlayerTarget 
      ? 'bottom-36 sm:bottom-40 md:bottom-48' 
      : 'top-1/4 sm:top-1/3';
    
    return (
      <div 
        className={`absolute ${topPosition} left-1/2 transform -translate-x-1/2 -translate-y-full text-center pointer-events-none z-20 animate-damage-float`}
      >
        <div className="text-gray-200 text-lg sm:text-2xl md:text-3xl font-black animate-pulse drop-shadow-[0_0_10px_rgba(200,200,200,0.6)]"
             style={{ textShadow: '0 0 15px rgba(200,200,200,0.8), 0 2px 4px rgba(0,0,0,0.5)' }}>
          MISS
        </div>
      </div>
    );
  };

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
            <div key={`combo-${battle.comboDisplayKey}`} className="text-orange-400 text-base sm:text-xl md:text-2xl font-bold">
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
        {/* 战斗背景 - 星空主题 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 深空基底层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020010] via-[#0a0520] to-[#060018]" />
          
          {/* 星云光晕 */}
          <div className="absolute top-[10%] left-[15%] w-[60%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute top-[40%] right-[10%] w-[40%] h-[30%] bg-blue-500/8 rounded-full blur-[80px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[35%] bg-indigo-500/10 rounded-full blur-[90px]" />
          <div className="absolute top-[20%] right-[30%] w-[30%] h-[25%] bg-pink-600/6 rounded-full blur-[70px]" />
          
          {/* 星空点阵 */}
          <div className="absolute inset-0">
            {/* 大星 */}
            <Star x={8} y={12} size={3} delay={0} />
            <Star x={22} y={8} size={2.5} delay={1.2} />
            <Star x={45} y={5} size={2} delay={0.6} />
            <Star x={65} y={15} size={3} delay={2.0} />
            <Star x={78} y={8} size={2} delay={1.5} />
            <Star x={85} y={22} size={2.5} delay={0.3} />
            <Star x={15} y={28} size={2} delay={1.8} />
            <Star x={35} y={18} size={3} delay={0.9} />
            <Star x={55} y={25} size={2} delay={2.2} />
            <Star x={72} y={35} size={2.5} delay={1.1} />
            <Star x={5} y={45} size={2} delay={0.7} />
            <Star x={28} y={50} size={3} delay={1.4} />
            <Star x={48} y={55} size={2} delay={2.5} />
            <Star x={62} y={48} size={2.5} delay={0.4} />
            <Star x={80} y={52} size={2} delay={1.9} />
            <Star x={18} y={65} size={2} delay={2.1} />
            <Star x={38} y={72} size={2.5} delay={0.8} />
            <Star x={58} y={68} size={2} delay={1.6} />
            <Star x={75} y={75} size={3} delay={0.2} />
            <Star x={90} y={60} size={2} delay={1.3} />
            
            {/* 小星群 */}
             <Star x={12} y={20} size={1} delay={1.7} color="rgba(147,197,253,0.8)" />
             <Star x={30} y={35} size={1} delay={0.5} color="rgba(147,197,253,0.8)" />
             <Star x={50} y={12} size={1} delay={2.3} color="rgba(147,197,253,0.8)" />
             <Star x={68} y={20} size={1} delay={0.1} color="rgba(147,197,253,0.8)" />
             <Star x={82} y={40} size={1} delay={1.0} color="rgba(147,197,253,0.8)" />
             <Star x={25} y={60} size={1} delay={2.4} color="rgba(147,197,253,0.8)" />
             <Star x={42} y={80} size={1} delay={0.3} color="rgba(147,197,253,0.8)" />
             <Star x={55} y={40} size={1} delay={1.9} color="rgba(147,197,253,0.8)" />
             <Star x={70} y={58} size={1} delay={2.1} color="rgba(147,197,253,0.8)" />
             <Star x={10} y={75} size={1} delay={1.1} color="rgba(147,197,253,0.8)" />
             <Star x={88} y={10} size={1} delay={0.6} color="rgba(147,197,253,0.8)" />
             <Star x={33} y={45} size={1} delay={2.0} color="rgba(147,197,253,0.8)" />
          </div>
          
          {/* 底部地平线暗影 */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Vignette 暗角 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.55)_100%)]" />
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
                battle.enemy.icon.startsWith('/') || battle.enemy.icon.startsWith('http') || battle.enemy.icon.startsWith('data:') ? (
                  <img 
                    src={battle.enemy.icon} 
                    alt={battle.enemy.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span className="text-3xl sm:text-5xl md:text-6xl">{battle.enemy.icon}</span>
                )
              ) : (
                <span className="text-3xl sm:text-5xl md:text-6xl">?</span>
              )}
            </div>
            
          </div>
          <div className="text-red-400 font-bold text-xs sm:text-sm md:text-base mt-1">{t(battle.enemy.name)}</div>
          
          {battle.lastAttacker === 'player' && renderDamageDisplay()}
          {battle.isMiss && battle.missPosition === 'enemy' && renderMissDisplay()}
          
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
                      case 'material': return 'material';
                      case 'soul': return 'soul';
                      default: return 'accessory';
                    }
                  };
                  const getBit32 = () => {
                    if (!equipment) return undefined;
                    if (equipment.type === 'weapon') return equipment.bit32;
                    if (equipment.type === 'armor') return equipment.bougu32png;
                    if (equipment.type === 'material') return equipment.bit32;
                    return undefined;
                  };
                  const getImage = () => {
                    if (!equipment) return undefined;
                    if (equipment.type === 'accessory') return equipment.image;
                    if (equipment.type === 'soul') return equipment.image;
                    return undefined;
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
                            image={getImage()}
                            bit32={getBit32()}
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
          <div className="text-white font-bold text-[10px] sm:text-xs md:text-sm mt-1">{t(player.name)}</div>
          
          {battle.lastAttacker === 'enemy' && renderDamageDisplay()}
          {battle.isMiss && battle.missPosition === 'player' && renderMissDisplay()}
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
                    canRecover && !isPartialPay
                      ? 'bg-green-700 hover:bg-green-600 text-white' 
                      : canRecover && isPartialPay
                      ? 'bg-yellow-700 hover:bg-yellow-600 text-white opacity-75'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {player.hp >= player.maxHp 
                    ? t('HP已满') 
                    : battle.recoverUsed 
                    ? t('下次回合恢复')
                    : `${recoveryCost.toLocaleString()}G ` + t('恢复')
                  }
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
        
        {battle.activeEffect && (
          <BattleEffect 
            effectId={battle.activeEffect.effectId}
            position={battle.activeEffect.position}
            onComplete={clearBattleEffect}
          />
        )}
        
        <BattleResult />
      </div>
    </div>
  );
};
