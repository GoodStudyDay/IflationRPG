let OneExpTable: number[] | null = null;

const initOneExpTable = () => {
  if (OneExpTable !== null) return;
  
  const size = 125000;
  OneExpTable = new Array(size);
  
  OneExpTable[0] = 3;
  OneExpTable[1] = 3;
  OneExpTable[2] = 4;
  OneExpTable[3] = 4;
  OneExpTable[4] = 6;
  OneExpTable[5] = 6;
  OneExpTable[6] = 6;
  OneExpTable[7] = 8;
  OneExpTable[8] = 8;
  OneExpTable[9] = 8;
  
  let loc2 = OneExpTable[9];
  let loc4 = 10;
  
  while (loc4 < 120000) {
    loc2 = OneExpTable[loc4 - 1];
    
    if (loc4 % 121 === 0) loc2 += 30;
    else if (loc4 % 103 === 0) loc2 += 26;
    else if (loc4 % 97 === 0) loc2 += 23;
    else if (loc4 % 83 === 0) loc2 += 17;
    else if (loc4 % 79 === 0) loc2 += 16;
    else if (loc4 % 67 === 0) loc2 += 15;
    else if (loc4 % 43 === 0) loc2 += 13;
    else if (loc4 % 37 === 0) loc2 += 11;
    else if (loc4 % 23 === 0) loc2 += 8;
    else if (loc4 % 21 === 0) loc2 += 6;
    else if (loc4 % 13 === 0) loc2 += 4;
    else if (loc4 % 7 === 0) loc2 += 2;
    else if (loc4 % 3 === 0) loc2 += Math.floor(loc4 * 0.02);
    
    if (loc4 % 3000 === 0) loc2 += 400;
    else if (loc4 % 1000 === 0) loc2 += 200;
    
    if (loc4 % 500 === 0) loc2 += 200;
    if (loc4 % 50 === 0) loc2 += 20;
    
    if (loc4 % 200 === 0) loc2 += 300;
    else if (loc4 % 100 === 0) loc2 += 150;
    
    if (loc4 % 15 === 0) loc2 += 1;
    
    OneExpTable[loc4] = loc2;
    
    if (++loc4 % 121 === 0) loc2 += 30;
    else if (loc4 % 103 === 0) loc2 += 26;
    else if (loc4 % 97 === 0) loc2 += 23;
    else if (loc4 % 83 === 0) loc2 += 17;
    else if (loc4 % 79 === 0) loc2 += 16;
    else if (loc4 % 67 === 0) loc2 += 15;
    else if (loc4 % 43 === 0) loc2 += 13;
    else if (loc4 % 37 === 0) loc2 += 11;
    else if (loc4 % 23 === 0) loc2 += 8;
    else if (loc4 % 21 === 0) loc2 += 6;
    else if (loc4 % 13 === 0) loc2 += 4;
    else if (loc4 % 7 === 0) loc2 += 2;
    else if (loc4 % 3 === 0) loc2 += Math.floor(loc4 * 0.02);
    
    if (loc4 % 3000 === 0) loc2 += 400;
    else if (loc4 % 1000 === 0) loc2 += 200;
    
    if (loc4 % 500 === 0) loc2 += 200;
    if (loc4 % 50 === 0) loc2 += 20;
    
    if (loc4 % 200 === 0) loc2 += 300;
    else if (loc4 % 100 === 0) loc2 += 150;
    
    if (loc4 % 15 === 0) loc2 += 1;
    
    OneExpTable[loc4] = loc2;
    
    if (++loc4 % 121 === 0) loc2 += 30;
    else if (loc4 % 103 === 0) loc2 += 26;
    else if (loc4 % 97 === 0) loc2 += 23;
    else if (loc4 % 83 === 0) loc2 += 17;
    else if (loc4 % 79 === 0) loc2 += 16;
    else if (loc4 % 67 === 0) loc2 += 15;
    else if (loc4 % 43 === 0) loc2 += 13;
    else if (loc4 % 37 === 0) loc2 += 11;
    else if (loc4 % 23 === 0) loc2 += 8;
    else if (loc4 % 21 === 0) loc2 += 6;
    else if (loc4 % 13 === 0) loc2 += 4;
    else if (loc4 % 7 === 0) loc2 += 2;
    else if (loc4 % 3 === 0) loc2 += Math.floor(loc4 * 0.02);
    
    if (loc4 % 3000 === 0) loc2 += 400;
    else if (loc4 % 1000 === 0) loc2 += 200;
    
    if (loc4 % 500 === 0) loc2 += 200;
    if (loc4 % 50 === 0) loc2 += 20;
    
    if (loc4 % 200 === 0) loc2 += 300;
    else if (loc4 % 100 === 0) loc2 += 150;
    
    if (loc4 % 15 === 0) loc2 += 1;
    
    OneExpTable[loc4] = loc2;
    
    if (++loc4 % 121 === 0) loc2 += 30;
    else if (loc4 % 103 === 0) loc2 += 26;
    else if (loc4 % 97 === 0) loc2 += 23;
    else if (loc4 % 83 === 0) loc2 += 17;
    else if (loc4 % 79 === 0) loc2 += 16;
    else if (loc4 % 67 === 0) loc2 += 15;
    else if (loc4 % 43 === 0) loc2 += 13;
    else if (loc4 % 37 === 0) loc2 += 11;
    else if (loc4 % 23 === 0) loc2 += 8;
    else if (loc4 % 21 === 0) loc2 += 6;
    else if (loc4 % 13 === 0) loc2 += 4;
    else if (loc4 % 7 === 0) loc2 += 2;
    else if (loc4 % 3 === 0) loc2 += Math.floor(loc4 * 0.02);
    
    if (loc4 % 3000 === 0) loc2 += 400;
    else if (loc4 % 1000 === 0) loc2 += 200;
    
    if (loc4 % 500 === 0) loc2 += 200;
    if (loc4 % 50 === 0) loc2 += 20;
    
    if (loc4 % 200 === 0) loc2 += 300;
    else if (loc4 % 100 === 0) loc2 += 150;
    
    if (loc4 % 15 === 0) loc2 += 1;
    
    OneExpTable[loc4] = loc2;
    
    if (++loc4 % 121 === 0) loc2 += 30;
    else if (loc4 % 103 === 0) loc2 += 26;
    else if (loc4 % 97 === 0) loc2 += 23;
    else if (loc4 % 83 === 0) loc2 += 17;
    else if (loc4 % 79 === 0) loc2 += 16;
    else if (loc4 % 67 === 0) loc2 += 15;
    else if (loc4 % 43 === 0) loc2 += 13;
    else if (loc4 % 37 === 0) loc2 += 11;
    else if (loc4 % 23 === 0) loc2 += 8;
    else if (loc4 % 21 === 0) loc2 += 6;
    else if (loc4 % 13 === 0) loc2 += 4;
    else if (loc4 % 7 === 0) loc2 += 2;
    else if (loc4 % 3 === 0) loc2 += Math.floor(loc4 * 0.02);
    
    if (loc4 % 3000 === 0) loc2 += 400;
    else if (loc4 % 1000 === 0) loc2 += 200;
    
    if (loc4 % 500 === 0) loc2 += 200;
    if (loc4 % 50 === 0) loc2 += 20;
    
    if (loc4 % 200 === 0) loc2 += 300;
    else if (loc4 % 100 === 0) loc2 += 150;
    
    if (loc4 % 15 === 0) loc2 += 1;
    
    OneExpTable[loc4] = loc2;
    loc4++;
  }
  
  loc4 = 120000;
  while (loc4 < 120500) {
    const val = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    OneExpTable[loc4] = OneExpTable[loc4 - 1] > val ? OneExpTable[loc4 - 1] : val;
    loc4++;
    
    const val2 = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    OneExpTable[loc4] = OneExpTable[loc4 - 1] > val2 ? OneExpTable[loc4 - 1] : val2;
    loc4++;
    
    const val3 = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    OneExpTable[loc4] = OneExpTable[loc4 - 1] > val3 ? OneExpTable[loc4 - 1] : val3;
    loc4++;
    
    const val4 = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    OneExpTable[loc4] = OneExpTable[loc4 - 1] > val4 ? OneExpTable[loc4 - 1] : val4;
    loc4++;
    
    const val5 = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    OneExpTable[loc4] = OneExpTable[loc4 - 1] > val5 ? OneExpTable[loc4 - 1] : val5;
    loc4++;
  }
  
  loc4 = 120500;
  while (loc4 < 125000) {
    OneExpTable[loc4] = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    loc4++;
    OneExpTable[loc4] = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    loc4++;
    OneExpTable[loc4] = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    loc4++;
    OneExpTable[loc4] = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    loc4++;
    OneExpTable[loc4] = Math.floor(loc4 * (loc4 * 0.0022385 + 6.35));
    loc4++;
  }
};

export const oneExpTableFunc = (level: number): number => {
  if (level < 0) return 0;
  
  if (level < 125000) {
    initOneExpTable();
    return OneExpTable![level];
  }
  
  return Math.floor(level * (level * 0.0022385 + 6.35));
};
