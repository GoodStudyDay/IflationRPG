import { useGameStore } from '@/stores/gameStore';
import { getEquipmentDescription } from '@/data/equipmentDescriptions';

export const useEquipmentDescription = () => {
  const language = useGameStore(state => state.language);

  const getEquipDescription = (setumei: string, t1?: number, t2?: number): string => {
    return getEquipmentDescription(setumei, language, t1, t2);
  };

  return { getEquipDescription, language };
};