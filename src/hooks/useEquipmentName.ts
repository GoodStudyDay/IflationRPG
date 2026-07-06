import { useGameStore } from '@/stores/gameStore';
import { getEquipmentName } from '@/data/equipmentNames';

export const useEquipmentName = () => {
  const language = useGameStore(state => state.language);

  const getEquipName = (name: string): string => {
    return getEquipmentName(name, language);
  };

  return { getEquipName, language };
};