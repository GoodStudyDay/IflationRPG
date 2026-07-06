import { useGameStore } from '@/stores/gameStore';
import { getBossName, getMapName } from '@/data/names';

export const useNames = () => {
  const language = useGameStore(state => state.language);

  const translateBossName = (name: string): string => {
    return getBossName(name, language);
  };

  const translateMapName = (name: string): string => {
    return getMapName(name, language);
  };

  return { translateBossName, translateMapName, language };
};
