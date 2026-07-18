import type { Equipment, InventoryItem } from '@/types';
import { equipmentData } from '@/data/equipment';
import { GetItemTimesFromInventory, GetItemTimes_zerocheck } from './gDataItemMana';

export interface GDataBonuses {
  ephp: number;
  epatk: number;
  epdef: number;
  epspeed: number;
  epluk: number;
  ebhp: number;
  ebatk: number;
  ebdef: number;
  ebspeed: number;
  ebluk: number;
  ebHp: number;
  ebAtk: number;
  ebDef: number;
  ebAgi: number;
  ebLuc: number;
  ehp: number;
  eatk: number;
  edef: number;
  espeed: number;
  eluk: number;
  epHp: number;
  epAtk: number;
  epDef: number;
  epAgi: number;
  epLuc: number;
  addMaxHP: number;
  addMaxATK: number;
  addMaxDEF: number;
  addMaxAGI: number;
  addMaxLUC: number;
  AllstatPer: number;
  kyarakutaNouryokuUp: number;
  expbairitu: number;
  GetPlusStPt: number;
  DamageReduced: number;
  DamageIncreased: number;
  crihPlusKakuritu: number;
  crihplusdamage: number;
  renzokuPlusKakuritu: number;
  MoveSpeed: number;
  SokusiKaihiKakuritu: number;
  redEyeEffect: number;
  blueEyeEffect: number;
  greenEyeEffect: number;
  secretKeyOn: boolean;
  possiveDeftoAtk: boolean;
  envelope: boolean;
  missrate: number;
  donyokuOn: boolean;
  resCount: number;
  resStatUP: number;
  trueDamage: number;
  renzoDamageUP: number;
  CurrentHpDamage: boolean;
  myhprecovery: boolean;
  twilightON: boolean;
  goyokuOn: boolean;
  doubleAttack: boolean;
  genbuAccON: boolean;
  hourGlassON: boolean;
  hourGlassON1: boolean;
  DamegeKaihukuOn0: boolean;
  DamegeKaihukuOn: boolean;
  DamegeKaihukuOn1: boolean;
  DamegeKaihukuOn2: boolean;
  TimesDamageCrihOn: number;
  encountBairitu: number;
  encountGenkai: number;
  godpower: number;
  MAXnokoriBattleTimes: number;
  stMult: number;
  Dice: number;
  DiceOn: boolean;
  deftoatk: boolean;
  def10: number;
  costMoney: boolean;
  reflection: number;
  refHealOn: boolean;
  hourgclassOn: boolean;
  hourgclassOn1: boolean;
  missrateOn: number;
  dropBoost: number;
  bosskillOn: boolean;
  buffList: number[];
  trueDamageKakuritu: number;
  reflectDamage: number;
  reflectDamageKakuritu: number;
  turnAddMaxHP: number;
  equipPlus: number;
  equipPerPlus: number;
  weaponPlus: number;
  weaponPerPlus: number;
  armorPlus: number;
  armorPerPlus: number;
  itemPasento: number;
  totalItemPasento: number;
  itemCount1: number;
  itemCount2: number;
  randomDice: number;
  hitCount: number;
  hitCount1: number;
  recovery: boolean;
  recoveryCheck: boolean;
  bosskillnum: number;
  enemissrate: number;
  expMultiplier: number;
  fireSecretKeyOn: boolean;
  donyokuRing: boolean;
  sandHourglassOn: boolean;
  healOnAttackOn: boolean;
  warGodBladeOn: boolean;
  speedwariai: number;
  lukwariai: number;
}

const PASSIVE_ACCESSORY_IDS = new Set([95, 103, 104, 106, 110, 116, 117, 119, 123, 125, 130, 131]);

export function isPassiveEffectItem(eqId: string): boolean {
  const eqNum = parseInt(eqId.split('-')[1]) || 0;
  return PASSIVE_ACCESSORY_IDS.has(eqNum);
}

function getItemAllCount(inventory: InventoryItem[], itemType: number, minTimes: number, maxTimes: number = 0): number {
  let count = 0;
  for (const item of inventory) {
    const eq = equipmentData.find(e => e.id === item.equipmentId);
    if (!eq) continue;
    
    let typeNum = 0;
    if (eq.type === 'weapon') typeNum = 0;
    else if (eq.type === 'armor') typeNum = 1;
    else if (eq.type === 'accessory') typeNum = 2;
    
    if (typeNum !== itemType) continue;
    
    if (item.quantity >= minTimes) {
      if (maxTimes > 0 && item.quantity > maxTimes) {
        count += maxTimes;
      } else {
        count += item.quantity;
      }
    }
  }
  return count;
}

function allstatUpdate(ephp: number, epatk: number, epdef: number, epspeed: number, epluk: number, param1: number, param2: number): { ephp: number; epatk: number; epdef: number; epspeed: number; epluk: number } {
  return {
    ephp: ephp + param1 * param2,
    epatk: epatk + param1 * param2,
    epdef: epdef + param1 * param2,
    epspeed: epspeed + param1 * param2,
    epluk: epluk + param1 * param2,
  };
}

export function EqStUpdate(
  accessories: (Equipment | null)[],
  inventory: InventoryItem[],
  hardmode: number,
  gold: number = 0,
  level: number = 0,
  baseHp: number = 0,
  baseAtk: number = 0,
  baseDef: number = 0,
  baseSpeed: number = 0,
  baseLuk: number = 0
): GDataBonuses {
  let ephp = 0, epatk = 0, epdef = 0, epspeed = 0, epluk = 0;
  let ebhp = 0, ebatk = 0, ebdef = 0, ebspeed = 0, ebluk = 0;
  let ehp = 0, eatk = 0, edef = 0, espeed = 0, eluk = 0;
  let addMaxHP = 0, addMaxATK = 0, addMaxDEF = 0, addMaxAGI = 0, addMaxLUC = 0;
  let AllstatPer = 0;
  let kyarakutaNouryokuUp = 0;
  let expbairitu = 1;
  let GetPlusStPt = 0;
  let DamageReduced = 0;
  let DamageIncreased = 0;
  let crihPlusKakuritu = 0;
  let crihplusdamage = 1;
  let renzokuPlusKakuritu = 0;
  let MoveSpeed = 15;
  let SokusiKaihiKakuritu = 0;
  let redEyeEffect = 0;
  let blueEyeEffect = 0;
  let greenEyeEffect = 0;
  let secretKeyOn = false;
  let possiveDeftoAtk = false;
  let envelope = false;
  let missrate = 0;
  let resCount = 0;
  let resStatUP = 0;
  let trueDamage = 0;
  let renzoDamageUP = 0;
  let CurrentHpDamage = false;
  let myhprecovery = false;
  let twilightON = false;
  let goyokuOn = false;
  let doubleAttack = false;
  let genbuAccON = false;
  let hourGlassON = false;
  let hourGlassON1 = false;
  let DamegeKaihukuOn0 = false;
  let DamegeKaihukuOn = false;
  let DamegeKaihukuOn1 = false;
  let DamegeKaihukuOn2 = false;
  let TimesDamageCrihOn = 0;
  let encountBairitu = 1;
  let encountGenkai = 0;
  let godpower = 0;
  let MAXnokoriBattleTimes = hardmode === 0 ? 30 : hardmode === 1 ? 15 : 10;
  let stMult = 1;
  let Dice = 1;
  let DiceOn = false;
  let deftoatk = false;
  let def10 = 0;
  let costMoney = false;
  let reflection = 0;
  let refHealOn = false;
  let hourgclassOn = false;
  let hourgclassOn1 = false;
  let missrateOn = 0;
  let dropBoost = 1;
  let bosskillOn = false;
  let buffList: number[] = [];
  let trueDamageKakuritu = 0;
  let reflectDamage = 0;
  let reflectDamageKakuritu = 0;
  let turnAddMaxHP = 1;
  let equipPlus = 0;
  let equipPerPlus = 0;
  let weaponPlus = 0;
  let weaponPerPlus = 0;
  let armorPlus = 0;
  let armorPerPlus = 0;
  let itemPasento = 0;
  let totalItemPasento = 0;
  let itemCount1 = 0;
  let itemCount2 = 0;
  let randomDice = 0;
  let hitCount = 0;
  let hitCount1 = 0;
  let recovery = false;
  let recoveryCheck = false;
  let bosskillnum = 0;
  let enemissrate = 0.25;
  let donyokuOn = false;
  let sandHourglassOn = false;
  let healOnAttackOn = false;
  let warGodBladeOn = false;

  for (const acc of accessories) {
    if (!acc) continue;
    const t1 = acc.t1;
    const t2 = acc.t2 || 0;

    if (t1 === 30) {
      ephp += t2;
    } else if (t1 === 31) {
      epatk += t2;
    } else if (t1 === 32) {
      epdef += t2;
    } else if (t1 === 33) {
      epspeed += t2;
    } else if (t1 === 34) {
      epluk += t2;
    } else if (t1 === 35) {
      itemCount1 = getItemAllCount(inventory, 2, 1);
      itemCount1 += getItemAllCount(inventory, 0, 1);
      itemCount1 += getItemAllCount(inventory, 1, 1);
      if (itemCount1 > 1000) {
        itemCount2 = itemCount1 - 1000;
        itemCount1 = 1000;
      }
      ephp += itemCount1 * t2;
      epatk += itemCount1 * t2;
      epdef += itemCount1 * t2;
      epspeed += itemCount1 * t2;
      epluk += itemCount2 * (t2 * 4);
    } else if (t1 === 40) {
      ephp += t2;
      epatk += t2;
      epdef += t2;
      epspeed += t2;
      epluk += t2;
    } else if (t1 === 41) {
      epatk += t2;
      epdef += t2;
      epspeed += t2;
    } else if (t1 === 42) {
      ephp += t2;
      epatk += t2;
      epdef += t2;
      epspeed += t2;
    } else if (t1 === 43) {
      ephp += t2 * 10;
      epdef += t2 * 10;
      epspeed += t2;
    } else if (t1 === 60) {
      expbairitu += t2 / 100;
    } else if (t1 === 1111) {
      DamageReduced = t2;
      ephp += 1500000;
      buffList.push(11);
    } else if (t1 === 2222) {
      DamageIncreased = t2;
      epatk += 800000;
      buffList.push(12);
    } else if (t1 === 700 && GetPlusStPt === 0) {
      GetPlusStPt = 1;
    } else if (t1 === 701) {
      GetPlusStPt = 2;
    } else if (t1 === 2701) {
      GetPlusStPt = 3;
      ephp += 1500000;
    } else if (t1 === 888) {
      AllstatPer = t2 / 100;
    } else if (t1 === 889) {
      godpower = t2;
    } else if (t1 === 899 && hardmode === 2) {
      AllstatPer += 0.4;
    } else if (t1 === 820) {
      kyarakutaNouryokuUp += t2;
    } else if (t1 === 3333) {
      addMaxHP += 0.15;
      expbairitu += 1.05;
    } else if (t1 === 3334) {
      addMaxATK += 0.15;
      expbairitu += 0.8;
    } else if (t1 === 3335) {
      addMaxDEF += 0.15;
      expbairitu += 0.8;
    } else if (t1 === 4003) {
      if (!genbuAccON) {
        genbuAccON = true;
        DamageReduced = 25;
        addMaxHP += 1;
      }
    } else if (t1 === 4005) {
      DamageReduced = 33;
      addMaxHP += 1.5;
    } else if (t1 === 200) {
      crihPlusKakuritu += 0.08;
    } else if (t1 === 210) {
      crihplusdamage += 0.2;
    } else if (t1 === 211) {
      crihplusdamage += 3;
    } else if (t1 === 250) {
      renzokuPlusKakuritu = 0.09;
    } else if (t1 === 100) {
      MoveSpeed += t2 / 100;
    } else if (t1 === 1210) {
      SokusiKaihiKakuritu += 1;
    } else if (t1 === 1211) {
      SokusiKaihiKakuritu += 10;
    } else if (t1 === 1899) {
      randomDice = Math.random() * 100;
      if (randomDice < 12) {
        addMaxHP += 0.15;
      } else if (randomDice < 24) {
        addMaxATK += 0.15;
      } else if (randomDice < 36) {
        addMaxDEF += 0.15;
      } else if (randomDice < 48) {
        addMaxAGI += 0.15;
      } else if (randomDice < 60) {
        addMaxLUC += 0.15;
      } else if (randomDice < 72) {
        AllstatPer += 0.15;
      } else {
        expbairitu += 0.8;
        DiceOn = true;
      }
    } else if (t1 === 4000) {
      resCount = 2;
      resStatUP = 1.03;
    } else if (t1 === 4001) {
      renzoDamageUP = 1.5;
      renzokuPlusKakuritu = 0.15;
    } else if (t1 === 4002) {
      trueDamageKakuritu = 0;
      trueDamage = level * t2;
    } else if (t1 === 4004) {
      trueDamageKakuritu = 0;
      trueDamage = level * 40;
      resCount = 1;
      resStatUP = 1.03;
      renzoDamageUP = 1.5;
      renzokuPlusKakuritu = 0.15;
    } else if (t1 === 1889) {
      CurrentHpDamage = true;
    } else if (t1 === 1888) {
      deftoatk = true;
    } else if (t1 === 4006) {
      trueDamageKakuritu = 0;
      trueDamage = level * 60;
      resCount = 2;
      resStatUP = 1.06;
      renzoDamageUP = 1.7;
      renzokuPlusKakuritu = 0.18;
      DamageReduced = 33;
      addMaxHP += 1.5;
    } else if (t1 === 4007) {
      doubleAttack = true;
    } else if (t1 === 78) {
      if (gold > 300000) {
        costMoney = true;
      }
      if (costMoney) {
        DamageIncreased = 40;
      }
    } else if (t1 === 10) {
      encountBairitu -= 0.15;
    } else if (t1 === 12) {
      donyokuOn = true;
    } else if (t1 === 13 && encountGenkai < t2) {
      encountGenkai = t2;
    } else if (t1 === 15) {
      twilightON = true;
    } else if (t1 === 77) {
      goyokuOn = true;
    } else if (t1 === 500) {
      MAXnokoriBattleTimes += t2;
    } else if (t1 === 2424) {
      const newReflection = t2 / 100;
      if (newReflection > (reflection || 0)) {
        reflection = newReflection;
      }
    } else if (t1 === 2425) {
      const newReflection = t2 / 100;
      if (newReflection > (reflection || 0)) {
        reflection = newReflection;
      }
      refHealOn = true;
    } else if (t1 === 2777) {
      hourgclassOn = true;
    } else if (t1 === 2778) {
      hourgclassOn1 = true;
    } else if (t1 === 310 && TimesDamageCrihOn === 0) {
      TimesDamageCrihOn = 1;
    } else if (t1 === 311 && TimesDamageCrihOn <= 1) {
      TimesDamageCrihOn = 2;
    } else if (t1 === 312) {
      TimesDamageCrihOn = 3;
    } else if (t1 === 314) {
      missrateOn = 4;
    } else if (t1 === 1200) {
      DamegeKaihukuOn = true;
    } else if (t1 === 1201) {
      DamegeKaihukuOn0 = true;
    } else if (t1 === 1202) {
      DamegeKaihukuOn1 = true;
    } else if (t1 === 1203) {
      DamegeKaihukuOn2 = true;
    } else if (t1 === 2000) {
      myhprecovery = true;
    } else if (t1 === 4101 && !hourGlassON1) {
      hourGlassON1 = true;
    } else if (t1 === 4100 && !hourGlassON) {
      hourGlassON = true;
      if (hourGlassON1) {
        hourGlassON = false;
        expbairitu += 0.25;
      }
      expbairitu += 0.5;
    }
  }

  const result = passiveUpdate(
    inventory,
    ephp, epatk, epdef, epspeed, epluk,
    redEyeEffect, blueEyeEffect, greenEyeEffect,
    secretKeyOn, possiveDeftoAtk, envelope,
    crihPlusKakuritu, missrate, MoveSpeed,
    warGodBladeOn, healOnAttackOn, sandHourglassOn
  );
  ephp = result.ephp;
  epatk = result.epatk;
  epdef = result.epdef;
  epspeed = result.epspeed;
  epluk = result.epluk;
  redEyeEffect = result.redEyeEffect;
  blueEyeEffect = result.blueEyeEffect;
  greenEyeEffect = result.greenEyeEffect;
  secretKeyOn = result.secretKeyOn;
  possiveDeftoAtk = result.possiveDeftoAtk;
  envelope = result.envelope;
  warGodBladeOn = result.warGodBladeOn;
  healOnAttackOn = result.healOnAttackOn;
  sandHourglassOn = result.sandHourglassOn;
  crihPlusKakuritu = result.crihPlusKakuritu;
  missrate = result.missrate;
  MoveSpeed = result.MoveSpeed;

  if (goyokuOn) {
    expbairitu = 0;
  }

  if (donyokuOn) {
    stMult *= 0.5;
  }

  ephp = Math.floor(ephp * stMult - baseHp * (1 - stMult));
  epatk = Math.floor(epatk * stMult - baseAtk * (1 - stMult));
  epdef = Math.floor(epdef * stMult - baseDef * (1 - stMult));
  epspeed = Math.floor(epspeed * stMult - baseSpeed * (1 - stMult));
  epluk = Math.floor(epluk * stMult - baseLuk * (1 - stMult));

  if (DiceOn) {
    Dice *= 0.9;
    ephp = Math.floor(ephp * Dice - baseHp * (1 - Dice));
    epatk = Math.floor(epatk * Dice - baseAtk * (1 - Dice));
    epdef = Math.floor(epdef * Dice - baseDef * (1 - Dice));
    epspeed = Math.floor(epspeed * Dice - baseSpeed * (1 - Dice));
    epluk = Math.floor(epluk * Dice - baseLuk * (1 - Dice));
  }

  ehp = (ephp + (ephp + baseHp) * ebhp) * (1 + addMaxHP + redEyeEffect + AllstatPer);
  eatk = (epatk + (epatk + baseAtk) * ebatk) * (1 + addMaxATK + AllstatPer + blueEyeEffect);
  edef = (epdef + baseDef) * (1 + ebdef) * (1 + AllstatPer + greenEyeEffect + addMaxDEF) - baseDef;

  if (deftoatk) {
    def10 = edef / 10;
    eatk += def10;
    edef -= def10;
  }

  if (possiveDeftoAtk) {
    const loc18 = GetItemTimesFromInventory(inventory, 2, 110);
    def10 = edef / 10;
    eatk += def10 * loc18;
  }

  espeed = (epspeed + (epspeed + baseSpeed) * ebspeed) * (1 + addMaxAGI + AllstatPer);
  eluk = (epluk + (epluk + baseLuk) * ebluk) * (1 + addMaxLUC + AllstatPer);

  return {
    ephp, epatk, epdef, epspeed, epluk,
    ebhp, ebatk, ebdef, ebspeed, ebluk,
    ehp, eatk, edef, espeed, eluk,
    epHp: ephp, epAtk: epatk, epDef: epdef, epAgi: epspeed, epLuc: epluk,
    ebHp: ebhp, ebAtk: ebatk, ebDef: ebdef, ebAgi: ebspeed, ebLuc: ebluk,
    addMaxHP, addMaxATK, addMaxDEF, addMaxAGI, addMaxLUC,
    AllstatPer, kyarakutaNouryokuUp, expbairitu, GetPlusStPt, DamageReduced, DamageIncreased,
    crihPlusKakuritu, crihplusdamage, renzokuPlusKakuritu, MoveSpeed, SokusiKaihiKakuritu,
    redEyeEffect, blueEyeEffect, greenEyeEffect, secretKeyOn, possiveDeftoAtk, envelope, missrate,
    donyokuOn,
    donyokuRing: donyokuOn,
    resCount, resStatUP,
    trueDamage, renzoDamageUP,
    CurrentHpDamage, myhprecovery, twilightON, goyokuOn, doubleAttack,
    genbuAccON, hourGlassON, hourGlassON1,
    DamegeKaihukuOn0, DamegeKaihukuOn, DamegeKaihukuOn1, DamegeKaihukuOn2,
    TimesDamageCrihOn,
    encountBairitu, encountGenkai,
    godpower,
    MAXnokoriBattleTimes,
    stMult, Dice, DiceOn,
    deftoatk, def10,
    costMoney,
    reflection, refHealOn, hourgclassOn, hourgclassOn1,
    missrateOn,
    dropBoost, bosskillOn,
    buffList,
    trueDamageKakuritu, reflectDamage, reflectDamageKakuritu,
    turnAddMaxHP,
    equipPlus, equipPerPlus, weaponPlus, weaponPerPlus, armorPlus, armorPerPlus,
    itemPasento, totalItemPasento,
    itemCount1, itemCount2,
    randomDice,
    hitCount, hitCount1,
    recovery, recoveryCheck,
    bosskillnum,
    enemissrate,
    expMultiplier: expbairitu,
    fireSecretKeyOn: false,
    sandHourglassOn,
    healOnAttackOn,
    warGodBladeOn,
    speedwariai: 0,
    lukwariai: 0,
  };
}

interface PassiveUpdateResult {
  ephp: number;
  epatk: number;
  epdef: number;
  epspeed: number;
  epluk: number;
  redEyeEffect: number;
  blueEyeEffect: number;
  greenEyeEffect: number;
  secretKeyOn: boolean;
  possiveDeftoAtk: boolean;
  envelope: boolean;
  crihPlusKakuritu: number;
  missrate: number;
  MoveSpeed: number;
  warGodBladeOn: boolean;
  healOnAttackOn: boolean;
  sandHourglassOn: boolean;
}

function passiveUpdate(
  inventory: InventoryItem[],
  ephp: number,
  epatk: number,
  epdef: number,
  epspeed: number,
  epluk: number,
  redEyeEffect: number,
  blueEyeEffect: number,
  greenEyeEffect: number,
  secretKeyOn: boolean,
  possiveDeftoAtk: boolean,
  envelope: boolean,
  crihPlusKakuritu: number,
  missrate: number,
  MoveSpeed: number,
  warGodBladeOn: boolean,
  healOnAttackOn: boolean,
  sandHourglassOn: boolean
): PassiveUpdateResult {
  redEyeEffect = GetItemTimesFromInventory(inventory, 2, 106) * 0.1;
  redEyeEffect += GetItemTimesFromInventory(inventory, 2, 130) * 0.2;

  const allstat1 = allstatUpdate(ephp, epatk, epdef, epspeed, epluk, GetItemTimesFromInventory(inventory, 2, 95), 750000);
  ephp = allstat1.ephp;
  epatk = allstat1.epatk;
  epdef = allstat1.epdef;
  epspeed = allstat1.epspeed;
  epluk = allstat1.epluk;

  const allstat2 = allstatUpdate(ephp, epatk, epdef, epspeed, epluk, GetItemTimesFromInventory(inventory, 2, 104), 1500000);
  ephp = allstat2.ephp;
  epatk = allstat2.epatk;
  epdef = allstat2.epdef;
  epspeed = allstat2.epspeed;
  epluk = allstat2.epluk;

  blueEyeEffect = GetItemTimesFromInventory(inventory, 2, 116) * 0.1;
  greenEyeEffect = GetItemTimesFromInventory(inventory, 2, 117) * 0.1;
  secretKeyOn = GetItemTimes_zerocheck(inventory, 2, 119);
  possiveDeftoAtk = GetItemTimes_zerocheck(inventory, 2, 110);
  envelope = GetItemTimes_zerocheck(inventory, 2, 123);
  warGodBladeOn = GetItemTimes_zerocheck(inventory, 2, 105);
  healOnAttackOn = GetItemTimes_zerocheck(inventory, 2, 108);
  sandHourglassOn = GetItemTimes_zerocheck(inventory, 2, 120);

  if (GetItemTimes_zerocheck(inventory, 2, 103)) {
    crihPlusKakuritu += 0.2;
    missrate += 0.2;
  }

  if (GetItemTimes_zerocheck(inventory, 2, 125)) {
    MoveSpeed = 22;
  }

  return {
    ephp, epatk, epdef, epspeed, epluk,
    redEyeEffect, blueEyeEffect, greenEyeEffect,
    secretKeyOn, possiveDeftoAtk, envelope,
    crihPlusKakuritu, missrate, MoveSpeed,
    warGodBladeOn, healOnAttackOn, sandHourglassOn
  };
}

export function maxgamelv(inventory: InventoryItem[]): number {
  return 35000000 + GetItemTimesFromInventory(inventory, 2, 114) * 5000000;
}

export function getDecreasedHPRate(inventory: InventoryItem[]): number {
  return 1 - GetItemTimesFromInventory(inventory, 2, 96) * 0.05;
}

export function getDecreasedATKRate(inventory: InventoryItem[]): number {
  return 1 - GetItemTimesFromInventory(inventory, 2, 97) * 0.05;
}