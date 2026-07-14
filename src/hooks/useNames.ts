import { useGameStore } from '@/stores/gameStore';
import { getBossName, getMapName, getEnemyName } from '@/data/names';

export const useNames = () => {
  const language = useGameStore(state => state.language);

  const translateBossName = (name: string): string => {
    return getBossName(name, language);
  };

  const translateEnemyName = (name: string): string => {
    return getEnemyName(name, language);
  };

  const translateMapName = (name: string): string => {
    return getMapName(name, language);
  };

  return { translateBossName, translateEnemyName, translateMapName, language };
};
