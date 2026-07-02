import { useGameStore } from '@/stores/gameStore';
import { TitleScreen } from '@/components/TitleScreen';
import { MainScreen } from '@/components/MainScreen';
import { BattleScreen } from '@/components/BattleScreen';
import { GameoverScreen } from '@/components/GameoverScreen';

function App() {
  const { currentScene } = useGameStore();
  
  return (
    <div className="min-h-screen bg-game-dark flex justify-center">
      <div className="w-full max-w-2xl">
        {currentScene === 'title' && <TitleScreen />}
        {currentScene === 'world' && <MainScreen />}
        {currentScene === 'battle' && <BattleScreen />}
        {currentScene === 'gameover' && <GameoverScreen />}
      </div>
    </div>
  );
}

export default App;