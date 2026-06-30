import { useGameStore } from '@/stores/gameStore';

interface BonusOverlayProps {
  onClose: () => void;
}

export const BonusOverlay = ({ onClose }: BonusOverlayProps) => {
  const { bonus, addMapBonus, clearMapBonus, getBonusInfo } = useGameStore();
  const bonusInfo = getBonusInfo();

  const handleAdd = () => {
    addMapBonus();
  };

  const handleClear = () => {
    clearMapBonus();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2d1b4e] border-2 border-[#5a3c8a] rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">地图奖励</h2>
          <p className="text-gray-400 text-sm">使用奖励来增强你的冒险!</p>
        </div>

        {bonusInfo && (
          <div className="bg-[#1a0a2e] border border-[#5a3c8a] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{bonusInfo.icon}</span>
              <div>
                <div className={`font-bold ${bonusInfo.color}`}>{bonusInfo.name}</div>
                <div className="text-gray-400 text-xs">{bonusInfo.description}</div>
              </div>
            </div>
            {bonus.currentBonus && (
              <div className="text-gray-400 text-xs mt-2">
                剩余次数: {bonus.currentBonus.remainingCount > 0 ? bonus.currentBonus.remainingCount : '已用完'}
              </div>
            )}
          </div>
        )}

        {!bonusInfo && (
          <div className="bg-[#1a0a2e] border border-[#3d2b6e] rounded-lg p-4 mb-6 text-center">
            <div className="text-gray-500 text-sm">暂无奖励效果</div>
            <div className="text-gray-600 text-xs mt-1">点击"新增"来获得随机奖励</div>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <button
            onClick={handleAdd}
            disabled={bonus.addUsesLeft <= 0}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
              bonus.addUsesLeft > 0
                ? 'bg-green-600 hover:bg-green-500'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            新增 (剩余 {bonus.addUsesLeft} 次)
          </button>
          <button
            onClick={handleClear}
            disabled={bonus.clearUsesLeft <= 0}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
              bonus.clearUsesLeft > 0
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            清除 (剩余 {bonus.clearUsesLeft} 次)
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  );
};
