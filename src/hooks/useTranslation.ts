import { useGameStore } from '@/stores/gameStore';
import { getTranslation } from '@/data/languageData';

export const useTranslation = () => {
  const language = useGameStore(state => state.language);

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  return { t, language };
};
