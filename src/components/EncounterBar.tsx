import { useGameStore } from '@/stores/gameStore';

export const EncounterBar = () => {
  const { encounterRate, player } = useGameStore();
  
  const expPercent = (player.exp / player.expToNextLevel) * 100;
  
  return (
    <div className="bg-[#1a0a2e] border-t-2 border-[#4a2c7a] p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <div className="text-xs text-yellow-400 mb-1">Encounter Gauge</div>
          <div className="h-3 bg-[#3d2b6e] rounded overflow-hidden border border-[#5a3c8a]">
            <div 
              className={`h-full transition-all duration-300 ${
                encounterRate < 30 ? 'bg-blue-600' :
                encounterRate < 60 ? 'bg-yellow-600' :
                encounterRate < 80 ? 'bg-orange-600' : 'bg-red-600'
              }`}
              style={{ width: `${encounterRate}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-0.5">槽越高越容易与敌人相遇</div>
        </div>
        
        <div className="bg-[#3d2b6e] px-3 py-2 rounded border border-[#5a3c8a]">
          <div className="text-xs text-gray-400">BATTLE POINT</div>
          <div className="text-xl font-bold text-game-secondary">1</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-xs text-gray-400">Level</div>
          <div className="text-lg font-bold text-white">{player.level}LV</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Money</div>
          <div className="text-lg font-bold text-yellow-400">{player.gold}G</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">EXP</div>
          <div className="text-lg font-bold text-green-400">{player.exp}</div>
          <div className="h-1.5 bg-[#3d2b6e] rounded overflow-hidden mt-1">
            <div 
              className="h-full bg-green-500"
              style={{ width: `${expPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">Next {player.expToNextLevel}</div>
        </div>
      </div>
    </div>
  );
};