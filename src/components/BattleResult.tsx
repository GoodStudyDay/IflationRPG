import { useGameStore } from '@/stores/gameStore';
import { SpriteIcon } from './SpriteIcon';
import { CharacterSprite } from './CharacterSprite';
import { useEquipmentName } from '@/hooks/useEquipmentName';
import { useTranslation } from '@/hooks/useTranslation';

export const BattleResult = () => {
  const { battle, battlePoints, setCurrentScene, player, clearBattleResult, killPlayer } = useGameStore();
  const { getEquipName } = useEquipmentName();
  const { t } = useTranslation();
  
  const { battleResult } = battle;
  
  if (!battleResult) return null;
  
  const isGameOver = !battleResult.victory && battlePoints + (battleResult.battlePointsChange || 0) <= 0;
  
  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGameOver) {
      killPlayer();
      return;
    }
    clearBattleResult();
    setCurrentScene('world');
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
      onClick={handleContinue}
    >
      <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4 sm:p-6">
        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {battleResult.victory ? (
              <span className="text-green-400">{t('胜利!')}</span>
            ) : (
              <span className="text-red-400">{t('失败!')}</span>
            )}
          </h2>
          <div className="flex justify-center">
            {battleResult.victory ? (
              <CharacterSprite animation="victory" size={80} />
            ) : (
              <CharacterSprite animation="dead" size={80} />
            )}
          </div>
        </div>
        
        {battleResult.victory ? (
          <div className="space-y-3">
            <div className="bg-[#1a0a2e] rounded-lg p-3">
              <div className="text-gray-400 text-sm mb-1">{t('Money')}</div>
              <div className="text-2xl font-bold text-yellow-400">
                {player.gold}G +{battleResult.goldReward}G
              </div>
            </div>
            
            <div className="bg-[#1a0a2e] rounded-lg p-3">
              <div className="text-gray-400 text-sm mb-1">{t('EXP')}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-green-400 h-4 rounded-full transition-all"
                    style={{ width: `${(player.exp / player.expToNextLevel) * 100}%` }}
                  />
                </div>
                <div className="text-lg font-bold text-green-400">
                  +{battleResult.expReward}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {player.exp}/{player.expToNextLevel}
              </div>
            </div>
            
            {battleResult.dropItem && (
              <div className="bg-[#1a0a2e] rounded-lg p-3">
                <div className="text-gray-400 text-sm mb-2">{t('装备')}</div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-[#3a2a5e] rounded-lg flex items-center justify-center">
                    {battleResult.dropItem.x !== undefined && battleResult.dropItem.y !== undefined ? (
                      <SpriteIcon 
                        type={battleResult.dropItem.type === 'weapon' ? 'weapon' : 
                               battleResult.dropItem.type === 'armor' ? 'armor' : 
                               battleResult.dropItem.type === 'material' ? 'material' : 
                               battleResult.dropItem.type === 'soul' ? 'soul' : 'accessory'}
                        x={battleResult.dropItem.x} 
                        y={battleResult.dropItem.y} 
                        size="medium" 
                        image={battleResult.dropItem.type === 'accessory' ? battleResult.dropItem.image : 
                               battleResult.dropItem.type === 'soul' ? battleResult.dropItem.image : undefined}
                        bit32={battleResult.dropItem.type === 'weapon' ? battleResult.dropItem.bit32 : 
                               battleResult.dropItem.type === 'armor' ? battleResult.dropItem.bougu32png : 
                               battleResult.dropItem.type === 'material' ? battleResult.dropItem.bit32 : undefined}
                      />
                    ) : (
                      <span className="text-xl">{battleResult.dropItem.icon}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {getEquipName(battleResult.dropItem.name)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {battleResult.dropItem.description}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-[#1a0a2e] rounded-lg p-3">
              <div className="text-gray-400 text-sm mb-1">{t('惩罚')}</div>
              <div className="text-2xl font-bold text-red-400">
                BATTLE POINT -{Math.abs(battleResult.battlePointsChange || 0)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {t('剩余')}: {battlePoints + (battleResult.battlePointsChange || 0)}
              </div>
            </div>
            
            {isGameOver && (
              <div className="bg-red-900/50 rounded-lg p-3 border border-red-500">
                <div className="text-red-400 font-bold text-lg">{t('游戏结束!')}</div>
                <div className="text-gray-400 text-sm mt-1">{t('即将返回标题页面...')}</div>
              </div>
            )}
            
            <div className="bg-[#1a0a2e]/50 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-sm">{t('再接再厉!')}</div>
              <div className="text-gray-500 text-xs mt-1">{t('提升属性后再战吧')}</div>
            </div>
          </div>
        )}
        
        <div className="text-center text-gray-500 text-sm mt-4">
          {t('点击画面回到地图')}
        </div>
      </div>
    </div>
  );
};
