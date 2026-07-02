export const kyaraExpTable: number[] = [
  10000,
  100000,
  500000,
  1200000,
  2500000,
  4000000,
  6500000,
  9000000,
  12000000,
  15000000,
  18000000,
  23000000,
  30000000,
  38000000,
  48000000,
  60000000,
  72000000,
  86000000,
  102000000,
  120000000,
  140000000,
  165000000,
  195000000,
  230000000,
  270000000,
  315000000,
  365000000,
  425000000,
  500000000,
  600000000,
];

export const SEIGEN_KYARA_LV = 30;

export const getkyaraLv = (exp: number): number => {
  for (let i = kyaraExpTable.length - 1; i >= 0; i--) {
    if (exp >= kyaraExpTable[i]) {
      return i + 1;
    }
  }
  return 0;
};

export const getCurrentKyaraLv = (kyarakutaKozinExp: number[], heroIndex: number): number => {
  return getkyaraLv(kyarakutaKozinExp[heroIndex] || 0);
};

export const addExpKyarakutaKozinExp = (
  kyarakutaKozinExp: number[],
  heroIndex: number,
  exp: number
): number[] => {
  const newExp = [...kyarakutaKozinExp];
  
  for (let i = 0; i < newExp.length; i++) {
    if (newExp[i] < kyaraExpTable[SEIGEN_KYARA_LV - 1]) {
      if (i === heroIndex) {
        newExp[i] = Math.min(newExp[i] + exp, kyaraExpTable[SEIGEN_KYARA_LV - 1]);
      } else {
        newExp[i] = Math.min(newExp[i] + Math.floor(exp * 0.25), kyaraExpTable[SEIGEN_KYARA_LV - 1]);
      }
    }
  }
  
  return newExp;
};

export const getkyaraLvMaxExp = (level: number): number => {
  return kyaraExpTable[level] || 0;
};