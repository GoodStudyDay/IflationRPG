import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { MenuOverlay } from './MenuOverlay';
import { BonusOverlay } from './BonusOverlay';
import { BONUS_LIST } from '@/utils/bonusManager';
import { MAP_LIST, getMapEnemies } from '@/data/mapData';
import { BOSS_DATA } from '@/data/bossData';

export const MainScreen = () => {
  const { player, encounterRate, addEncounterRate, battlePoints, maxBattlePoints, resetGame, bonus, currentMap, teleportToMap, startBossBattle } = useGameStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [showTeleport, setShowTeleport] = useState(false);
  const [showBoss, setShowBoss] = useState(false);
  
  const expPercent = player.expToNextLevel > 0 ? (player.exp / player.expToNextLevel) * 100 : 0;
  
  const currentMapData = MAP_LIST.find(m => m.id === currentMap) || MAP_LIST[0];
  const mapEnemies = getMapEnemies(currentMap);
  
  // 动态获取 bonus 显示文本
  const getBonusText = () => {
    if (!bonus.currentBonus) return null;
    const info = BONUS_LIST[bonus.currentBonus.bonusType];
    if (!info) return null;
    return `${info.name}(${bonus.currentBonus.remainingCount})`;
  };
  
  const handleBattleClick = () => {
    if (battlePoints <= 0) {
      setShowResetConfirm(true);
      return;
    }
    addEncounterRate(100);
  };
  
  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
  };

  const bonusText = getBonusText();
  
  return (
    <div className="min-h-screen bg-[#1a0a2e] flex flex-col">
      <div className="bg-[#3d2b6e]/30 p-2 sm:p-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowBonus(true)}
            className="bg-[#5a3c8a] px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm hover:bg-[#6a4c9a] transition-colors flex-1"
          >
            奖励
          </button>
          <button
            onClick={() => setShowTeleport(true)}
            className="bg-[#5a3c8a] px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm hover:bg-[#6a4c9a] transition-colors flex-1"
          >
            传送
          </button>
          <button
            onClick={() => setShowMenu(true)}
            className="bg-[#5a3c8a] px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm hover:bg-[#6a4c9a] transition-colors flex-1"
          >
            菜单
          </button>
          <button
            onClick={handleBattleClick}
            className="bg-[#5a3c8a] px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm hover:bg-[#6a4c9a] transition-colors flex-1"
          >
            战斗
          </button>
          <button
            onClick={() => setShowBoss(true)}
            className="bg-[#8a2a4a] px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm hover:bg-[#9a3a5a] transition-colors flex-1"
          >
            BOSS
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d5a2d] to-[#1a3a1a]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600 rounded-full blur-3xl" />
          </div>
          
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#4a7a4a] rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#1a3a1a] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1a3a1a] to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-white font-bold text-lg">{currentMapData.icon} {currentMapData.name}</div>
            <div className="text-gray-300 text-sm">解锁等级: {currentMapData.unlockLevel}</div>
            {bonusText && (
              <div className="text-yellow-400 text-sm mt-1">奖励: {bonusText}</div>
            )}
            <div className="text-gray-500 text-xs mt-2">
              {mapEnemies.slice(0, 3).map(e => e.icon).join(' ')} ...
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-8 h-full border-l-2 border-blue-500/50" />
        <div className="absolute top-0 right-0 w-8 h-full border-r-2 border-blue-500/50" />
        <div className="absolute top-0 left-0 h-8 w-full border-t-2 border-blue-500/50" />
        <div className="absolute bottom-0 left-0 h-8 w-full border-b-2 border-blue-500/50" />
        
        <div className="absolute top-8 left-8 w-4 h-4 border-l-2 border-t-2 border-blue-500" />
        <div className="absolute top-8 right-8 w-4 h-4 border-r-2 border-t-2 border-blue-500" />
        <div className="absolute bottom-8 left-8 w-4 h-4 border-l-2 border-b-2 border-blue-500" />
        <div className="absolute bottom-8 right-8 w-4 h-4 border-r-2 border-b-2 border-blue-500" />
        
        <div className="absolute top-0 left-0 w-40 h-40 border-l-2 border-t-2 border-red-500/30" />
        <div className="absolute top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-red-500/30" />
        <div className="absolute bottom-0 left-0 w-40 h-40 border-l-2 border-b-2 border-red-500/30" />
        <div className="absolute bottom-0 right-0 w-40 h-40 border-r-2 border-b-2 border-red-500/30" />
      </div>
      
      <div className="bg-[#1a0a2e] border-t-2 border-[#4a2c7a] p-2 sm:p-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">现在的地图信息</div>
            <div className="text-[10px] sm:text-xs text-white">
              {currentMapData.icon} {currentMapData.name}
              {bonusText ? ` , Bonus: ${bonusText}` : ''}
            </div>
          </div>
          
          <div className={`bg-[#3d2b6e] px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${
            battlePoints > 10 ? 'border-[#5a3c8a]' : 
            battlePoints > 0 ? 'border-yellow-500' : 'border-red-500'
          }`}>
            <div className="text-[10px] sm:text-xs text-gray-400 text-center">BATTLE POINT</div>
            <div className={`text-xl sm:text-3xl font-bold text-center ${
              battlePoints > 10 ? 'text-yellow-400' : 
              battlePoints > 0 ? 'text-yellow-300' : 'text-red-400'
            }`}>
              {battlePoints} / {maxBattlePoints}
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-[10px] sm:text-xs text-yellow-400 mb-1">Encounter Gauge</div>
          <div className="h-2 bg-[#3d2b6e] rounded overflow-hidden border border-[#5a3c8a]">
            <div 
              className={`h-full transition-all duration-300 ${
                encounterRate < 30 ? 'bg-blue-600' :
                encounterRate < 60 ? 'bg-yellow-600' :
                encounterRate < 80 ? 'bg-orange-600' : 'bg-red-600'
              }`}
              style={{ width: `${encounterRate}%` }}
            />
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">槽越高越容易与敌人相遇</div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div>
            <div className="text-[10px] sm:text-xs text-gray-400">Level</div>
            <div className="text-sm sm:text-lg font-bold text-white">{player.level}LV</div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-gray-400">Money</div>
            <div className="text-sm sm:text-lg font-bold text-yellow-400">{player.gold}G</div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-gray-400">EXP</div>
            <div className="text-sm sm:text-lg font-bold text-green-400">{player.exp}</div>
            <div className="h-1.5 bg-[#3d2b6e] rounded overflow-hidden mt-1">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${expPercent}%` }}
              />
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500">Next {player.expToNextLevel}</div>
          </div>
        </div>
      </div>
      
      {/* Teleport 弹窗 */}
      {showTeleport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowTeleport(false)}>
          <div className="bg-[#2d1b4e] border-2 border-[#5a3c8a] rounded-lg p-3 sm:p-4 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 text-center">选择地图</h3>
            <div className="space-y-2">
              {MAP_LIST.map(map => {
                const isUnlocked = player.level >= map.unlockLevel;
                const isCurrent = map.id === currentMap;
                return (
                  <button
                    key={map.id}
                    onClick={() => {
                      if (isUnlocked) {
                        teleportToMap(map.id);
                        setShowTeleport(false);
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isCurrent
                        ? 'border-yellow-500 bg-[#3d2b6e]'
                        : isUnlocked
                        ? 'border-[#5a3c8a] bg-[#2d1b4e] hover:bg-[#3d2b6e]'
                        : 'border-gray-700 bg-gray-900/50 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg mr-2">{map.icon}</span>
                        <span className="text-white font-bold">{map.name}</span>
                      </div>
                      <div className="text-xs">
                        {isCurrent ? (
                          <span className="text-yellow-400">当前</span>
                        ) : !isUnlocked ? (
                          <span className="text-red-400">需LV{map.unlockLevel}</span>
                        ) : (
                          <span className="text-green-400">传送</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      需LV{map.unlockLevel} · {map.description}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowTeleport(false)}
              className="w-full mt-3 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
      
      {showMenu && <MenuOverlay onClose={() => setShowMenu(false)} />}
      
      {showBonus && <BonusOverlay onClose={() => setShowBonus(false)} />}
      
      {showBoss && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowBoss(false)}>
          <div className="bg-[#2d1b4e] border-2 border-[#8a2a4a] rounded-lg p-3 sm:p-4 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 text-center">选择BOSS</h3>
            <div className="space-y-2">
              {BOSS_DATA.map(boss => {
                const isAvailable = player.level >= boss.level;
                return (
                  <button
                    key={boss.id}
                    onClick={() => {
                      if (isAvailable) {
                        startBossBattle(boss.bossId);
                        setShowBoss(false);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isAvailable
                        ? 'border-[#8a2a4a] bg-[#2d1b4e] hover:bg-[#3d2b6e]'
                        : 'border-gray-700 bg-gray-900/50 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg mr-2">{boss.icon}</span>
                        <span className="text-white font-bold">{boss.name}</span>
                      </div>
                      <div className="text-xs">
                        {isAvailable ? (
                          <span className="text-red-400">挑战</span>
                        ) : (
                          <span className="text-red-400">需LV{boss.level}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      HP: {boss.maxHp.toLocaleString()} · ATK: {boss.attack.toLocaleString()} · EXP: {boss.expReward.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowBoss(false)}
              className="w-full mt-3 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
      
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#2d1b4e] border-2 border-red-500 rounded-lg p-4 sm:p-6 w-[90%] max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-4">BATTLE POINT 耗尽!</div>
              <div className="text-gray-300 mb-6">战斗点数已用完，需要重新开始游戏才能继续战斗。</div>
              <div className="space-y-3">
                <button
                  onClick={handleReset}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-500 transition-colors"
                >
                  重新开始
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
