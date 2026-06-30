import { useGameStore } from '@/stores/gameStore';

export const StatusBar = () => {
  const { player } = useGameStore();
  
  const hpPercent = (player.hp / player.maxHp) * 100;
  
  return (
    <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a]">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="bg-[#3d2b6e] px-3 py-1 rounded text-xs text-gray-400">
          当前第: 1名
        </div>
        <button
          onClick={() => {}}
          className="bg-[#5a3c8a] px-4 py-1 rounded text-sm text-white font-bold hover:bg-[#6a4c9a] transition-colors"
        >
          奖励
        </button>
        <button
          onClick={() => {}}
          className="bg-[#5a3c8a] px-4 py-1 rounded text-sm text-white font-bold hover:bg-[#6a4c9a] transition-colors"
        >
          菜单
        </button>
      </div>
      
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>❤️ HP</span>
            <span>{player.hp}/{player.maxHp}</span>
          </div>
          <div className="h-3 bg-[#3d2b6e] rounded overflow-hidden border border-[#5a3c8a]">
            <div 
              className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-300"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-2xl">🧙</div>
          <div>
            <div className="text-game-secondary font-bold text-sm">{player.name}</div>
            <div className="text-gray-400 text-xs">Lv.{player.level}</div>
          </div>
        </div>
      </div>
    </div>
  );
};