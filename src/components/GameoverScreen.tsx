import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { loadSaveData } from '@/utils/saveDataStorage';
import { getkyaraLv, getkyaraLvMaxExp, SEIGEN_KYARA_LV } from '@/utils/kyaraLevel';
import { Leaderboard } from './Leaderboard';
import { MenuOverlay } from './MenuOverlay';
import { useTranslation } from '@/hooks/useTranslation';

export const GameoverScreen = () => {
  const { player, kyarakutaKozinExp, goToTitle } = useGameStore();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const saveData = loadSaveData();

  const heroIndex = player.heroId;
  const currentExp = kyarakutaKozinExp[heroIndex] || 0;
  const gainedExp = player.level;
  const totalExp = currentExp + gainedExp;
  const oldCharLv = getkyaraLv(currentExp);
  const newCharLv = getkyaraLv(totalExp);
  const leveledUp = newCharLv > oldCharLv;
  const maxLv = SEIGEN_KYARA_LV;

  return (
    <div className="min-h-screen bg-black/80 flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black/80" />
      
      <div className="relative z-10 text-center px-4">
        <div className="text-4xl sm:text-6xl font-black text-white mb-2">GAME OVER</div>
        <div className="text-xl sm:text-2xl text-gray-400 mb-4">{t('Result')}</div>
        
        <div className="text-5xl sm:text-7xl font-black text-yellow-400 mb-2 drop-shadow-[0_0_20px_rgba(255,200,0,0.5)]">
          {player.level.toLocaleString()} LV
        </div>
        
        {(player.level >= saveData.Highlv) && (
          <div className="text-yellow-300 text-sm sm:text-base animate-pulse">
              {t('更新了最高级别！')}
            </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-[#2d1b4e]/80 border border-[#4a2c7a] rounded-lg p-3 text-left">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">{t('角色能力信息')}</div>
            <div className="text-white text-sm">
              <div>{t('获得')} {gainedExp.toLocaleString()} {t('经验值，合计为')} {totalExp.toLocaleString()}EXP</div>
              {oldCharLv >= maxLv ? (
                <div>
                  <div>{t('当前角色等级已达到')}{maxLv}LV{t('，无法再提升')}</div>
                </div>
              ) : (
                <div>
                  {leveledUp ? (
                    <div>{t('角色能力从')}{oldCharLv}LV{t('升级到')}{newCharLv}LV</div>
                  ) : (
                    <div>
                      <div>{t('现在的角色能力为')}{oldCharLv}LV</div>
                      <div>{t('距离下一级还需要')} {getkyaraLvMaxExp(newCharLv) - totalExp >= 0 ? (getkyaraLvMaxExp(newCharLv) - totalExp).toLocaleString() : '0'}EXP</div>
                    </div>
                  )}
                </div>
              )}
              <div className="text-gray-500 text-xs mt-1">{t('角色能力越高，属性值中的奖金倍增')}</div>
            </div>
          </div>
          
          <div className="bg-[#2d1b4e]/80 border border-[#4a2c7a] rounded-lg p-3 text-left">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">{t('统计数据')}</div>
            <div className="text-white text-sm">
              <div>{t('总体获得金额')}: {saveData.winbattle > 0 ? player.gold.toLocaleString() : '0'}G</div>
              <div>{t('死亡次数')}: {saveData.gameovercount}</div>
              <div>{t('击败BOSS')}: {saveData.HighCombo > 0 ? 1 : 0}</div>
              <div className="text-gray-500 text-xs mt-1">{t('合计战斗次数')}: {saveData.winbattle + saveData.losebattle}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-3xl sm:text-4xl font-black text-yellow-400">
          {t('当前所持金额为')} {player.gold.toLocaleString()}G
        </div>

        <div className="mt-6 flex justify-center max-w-2xl mx-auto w-full">
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowMenu(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {t('菜单')} / {t('装备')}
            </button>
            
            <button
              onClick={() => setShowLeaderboard(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {t('排行')}
            </button>
            
            <button
              onClick={goToTitle}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {t('标题')}
            </button>
          </div>
        </div>
      </div>

      {showMenu && (
        <MenuOverlay onClose={() => setShowMenu(false)} />
      )}
      
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowLeaderboard(false)}>
          <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
        </div>
      )}
    </div>
  );
};
