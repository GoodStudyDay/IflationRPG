import { useGameStore } from '@/stores/gameStore';
import { TitleScreen } from '@/components/TitleScreen';
import { MainScreen } from '@/components/MainScreen';
import { BattleScreen } from '@/components/BattleScreen';

function App() {
  const { currentScene } = useGameStore();
  
  return (
    <div className="min-h-screen bg-game-dark">
      {currentScene === 'title' && <TitleScreen />}
      {currentScene === 'world' && <MainScreen />}
      {currentScene === 'battle' && <BattleScreen />}
    </div>
  );
}

export default App;