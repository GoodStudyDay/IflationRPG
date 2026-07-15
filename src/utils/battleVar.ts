import type { BattleVarSettings, BattleVarResult } from '@/types/battleVar';

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const roundToTwoDecimals = (value: number): number => {
  return Math.floor(value * 100) / 100;
};

const myStatusSet = (
  hp: number,
  attack: number,
  defense: number,
  agility: number,
  luck: number,
  bossType: number
): { hp: number; maxHp: number; attack: number; defense: number; speed: number; luck: number } => {
  let myhp = isNaN(hp) ? 1000 : hp;
  let myatk = isNaN(attack) ? 1000 : attack;
  let mydef = isNaN(defense) ? 1000 : defense;
  let myspeed = isNaN(agility) ? 1000 : agility;
  let myluk = isNaN(luck) ? 1000 : luck;

  if (bossType === 76) {
    myhp = Math.floor(myhp - myhp * 0.15);
  }
  if (bossType === 98 || bossType === 99) {
    myatk = Math.floor(myatk - myatk * 0.15);
  }

  const myhpm = Math.floor(myhp);

  return { hp: myhp, maxHp: myhpm, attack: myatk, defense: mydef, speed: myspeed, luck: myluk };
};

const enePointGet = (
  enemyHp: number,
  enemyAtk: number,
  enemyExp: number,
  enemyGold: number,
  enemyLevel: number,
  hasDrop1: boolean,
  hasDrop2: boolean,
  hasDrop3: boolean
): number => {
  let enePoint = enemyHp / 15 + enemyAtk / 2 + enemyExp / 475000 + enemyGold / 50;
  enePoint = (enePoint * 2 + enemyLevel * 3) / 5;

  if (enemyLevel >= 20000) {
    enePoint *= 1.05;
  }

  if (hasDrop1) {
    enePoint += 5;
  }
  if (hasDrop2) {
    enePoint += 10;
  }
  if (hasDrop3) {
    enePoint += 15;
  }

  if (hasDrop1) {
    enePoint *= 1.05;
  }
  if (hasDrop2) {
    enePoint *= 1.075;
  }
  if (hasDrop3) {
    enePoint *= 1.1;
  }

  return enePoint;
};

const KakurituBairituGet = (
  myspeed: number,
  myluk: number,
  enePoint: number,
  settings: BattleVarSettings
): { renzoKukakuritu: number; criKakuritu: number; itemKakuritu: number; gUpBairitu: number } => {
  let _loc1_ = 0;

  if (enePoint <= 500) {
    _loc1_ = (enePoint * 4 + 1000) / 6;
  } else if (enePoint <= 1000) {
    _loc1_ = (enePoint * 4 + 2000) / 6;
  } else if (enePoint <= 2000) {
    _loc1_ = (enePoint * 4 + 4000) / 6;
  } else {
    _loc1_ = (enePoint * 3 + 4000) / 5;
  }

  let renzoKukakuritu = myspeed / _loc1_ * 0.52 + 0.06;

  if (myspeed < 1500000) {
    renzoKukakuritu += myspeed / 1500000 * 0.14;
  } else {
    renzoKukakuritu += 0.14;
  }

  if (myluk < 1000000) {
    renzoKukakuritu += myluk / 1000000 * 0.02;
  } else {
    renzoKukakuritu += 0.02;
  }

  renzoKukakuritu += settings.speedwariai * 0.24;
  renzoKukakuritu = clamp(renzoKukakuritu, 0, 0.5);
  renzoKukakuritu += settings.speedwariai * 0.24;
  renzoKukakuritu = roundToTwoDecimals(renzoKukakuritu);

  let criKakuritu = myspeed / _loc1_ * 0.07 + myluk / _loc1_ * 0.22 + 0.06;

  if (myspeed < 1500000) {
    criKakuritu += myspeed / 1500000 * 0.1;
  } else {
    criKakuritu += 0.1;
  }

  if (myluk < 1000000) {
    criKakuritu += myluk / 1000000 * 0.02;
  } else {
    criKakuritu += 0.02;
  }

  criKakuritu += settings.speedwariai * 0.11;
  criKakuritu += settings.lukwariai * 0.14;
  criKakuritu = clamp(criKakuritu, 0, 0.35);
  criKakuritu += settings.speedwariai * 0.11;
  criKakuritu += settings.lukwariai * 0.14;
  criKakuritu = roundToTwoDecimals(criKakuritu);

  let itemKakuritu = myluk / _loc1_ * 0.65 + 0.4;

  const luckThresholds = [2000, 25000, 300000, 500000, 1000000, 5000000, 12000000, 48000000];
  const luckBonuses = [0.16, 0.16, 0.31, 0.36, 0.36, 0.49, 0.8, 1.23];

  luckThresholds.forEach((threshold, index) => {
    if (myluk < threshold) {
      itemKakuritu += myluk / threshold * (index === 0 ? 0.15 : index === 1 ? 0.15 : index === 2 ? 0.3 : index === 3 ? 0.35 : index === 4 ? 0.38 : index === 5 ? 0.48 : index === 6 ? 0.79 : 1.2);
    } else {
      itemKakuritu += luckBonuses[index];
    }
  });

  if (itemKakuritu > 1) {
    itemKakuritu = (itemKakuritu * 1 + 1.7) / 2.7;
  }
  if (itemKakuritu > 2) {
    itemKakuritu = (itemKakuritu * 1 + 3.5) / 2.75;
  }
  if (itemKakuritu > 3.5) {
    itemKakuritu = 3.5;
  }
  itemKakuritu = roundToTwoDecimals(itemKakuritu);

  let gUpBairitu = myluk / _loc1_ * 0.77 + 1;

  const gThresholds = [10000, 50000, 200000];
  const gBonuses = [0.55, 0.55, 1.1];

  gThresholds.forEach((threshold, index) => {
    if (myluk < threshold) {
      gUpBairitu += myluk / threshold * gBonuses[index];
    } else {
      gUpBairitu += gBonuses[index];
    }
  });

  if (gUpBairitu > 2) {
    gUpBairitu = (gUpBairitu + 2) / 2;
  }
  if (gUpBairitu > 2.5) {
    gUpBairitu = (gUpBairitu + 2.5) / 2;
  }
  if (gUpBairitu > 3) {
    gUpBairitu = (gUpBairitu + 6) / 3;
  }
  if (gUpBairitu > 3.5) {
    gUpBairitu = (gUpBairitu + 10.5) / 4;
  }
  if (gUpBairitu > 4) {
    gUpBairitu = 4;
  }
  gUpBairitu = roundToTwoDecimals(gUpBairitu);

  if (gUpBairitu < 1.2) {
    if (gUpBairitu >= 1.05) {
      gUpBairitu = 1.1;
    } else {
      gUpBairitu = 1;
    }
  }

  return { renzoKukakuritu, criKakuritu, itemKakuritu, gUpBairitu };
};

export const battleVarInit = (
  playerStats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    agility: number;
    luck: number;
  },
  enemyStats: {
    hp: number;
    attack: number;
    exp: number;
    gold: number;
    level: number;
  },
  dropCount: number,
  settings: BattleVarSettings = {
    hardmode: 0,
    renzokuPlusKakuritu: 0,
    crihPlusKakuritu: 0,
    speedwariai: 0,
    lukwariai: 0,
    hourGlassON: false,
    hourGlassON1: false,
    expbairitu: 1,
    missrate: 0,
    enemissrate: 0,
  }
): BattleVarResult => {
  const hasDrop1 = dropCount >= 1;
  const hasDrop2 = dropCount >= 2;
  const hasDrop3 = dropCount >= 3;

  const playerStatus = myStatusSet(
    playerStats.hp,
    playerStats.attack,
    playerStats.defense,
    playerStats.agility,
    playerStats.luck,
    -1
  );

  const enePoint = enePointGet(
    enemyStats.hp,
    enemyStats.attack,
    enemyStats.exp,
    enemyStats.gold,
    enemyStats.level,
    hasDrop1,
    hasDrop2,
    hasDrop3
  );

  const { renzoKukakuritu, criKakuritu, itemKakuritu, gUpBairitu } = KakurituBairituGet(
    playerStatus.speed,
    playerStatus.luck,
    enePoint,
    settings
  );

  let comboRate = renzoKukakuritu;
  let critRate = criKakuritu;

  comboRate += settings.renzokuPlusKakuritu;
  comboRate = clamp(comboRate, 0, 0.7);
  comboRate = roundToTwoDecimals(comboRate);

  critRate += settings.crihPlusKakuritu;
  critRate = clamp(critRate, 0, 0.6);
  critRate = roundToTwoDecimals(critRate);

  let goldMultiplier = gUpBairitu;

  if (settings.hourGlassON) {
    goldMultiplier *= 2;
  }
  if (settings.hourGlassON1) {
    goldMultiplier *= 3;
  }

  return {
    missrate: settings.missrate || 0,
    enemissrate: settings.enemissrate || 0,
    comboRate,
    critRate,
    itemDropRate: itemKakuritu,
    goldMultiplier,
    expMultiplier: settings.expbairitu,
    playerStats: playerStatus,
  };
};
