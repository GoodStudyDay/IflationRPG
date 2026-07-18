import type { Equipment } from '@/types';

interface ItemDataMana {
  ItemuBUKI: Equipment[];
  ItemuBOUGU: Equipment[];
  ItemuAKUSE: Equipment[];
  ItemuSOUL: Equipment[];
  ItemuMATERIAL: Equipment[];
  ItemuAKUSEZyoui: number[][];
  ItemuSOULZyoui: number[][];
  ItemuRECIPE: number[][];
}

const R1 = 0;
const R2 = 1;
const R3 = 2;
const R4 = 3;
const R5 = 4;

const itemDataMana: ItemDataMana = {
  ItemuBUKI: [],
  ItemuBOUGU: [],
  ItemuAKUSE: [],
  ItemuSOUL: [],
  ItemuMATERIAL: [],
  ItemuAKUSEZyoui: [],
  ItemuSOULZyoui: [],
  ItemuRECIPE: [],
};

function ItemBUKIpush(
  listnum: number,
  name: string,
  x: number,
  y: number,
  price: number,
  plus: number,
  multi: number,
  hardmode: number = 0,
  bit32: number = 0,
  mixbase1: number = -1,
  mixbase2: number = -1,
  mixbase3: number = -1,
  mixbase4: number = -1
): void {
  const index = itemDataMana.ItemuBUKI.length;
  const equipment: Equipment = {
    id: `weapon-${listnum}`,
    name,
    type: 'weapon',
    listnum,
    x,
    y,
    price,
    plus,
    multi,
    hardmode,
    bit32,
    mixbase1: mixbase1 === -1 ? undefined : mixbase1,
    mixbase2: mixbase2 === -1 ? undefined : mixbase2,
    mixbase3: mixbase3 === -1 ? undefined : mixbase3,
    mixbase4: mixbase4 === -1 ? undefined : mixbase4,
    attackBonus: plus,
    defenseBonus: 0,
    hpBonus: 0,
    agilityBonus: 0,
    luckBonus: 0,
    description: '',
    icon: '⚔️',
    maxQuantity: 10,
    attributeRate: multi + 100,
    passive: false,
  };
  itemDataMana.ItemuBUKI[index] = equipment;
}

function ItemBOUGUpush(
  listnum: number,
  name: string,
  x: number,
  y: number,
  price: number,
  plus: number,
  multi: number,
  hardmode: number = 0,
  bougu32png: number = 0,
  mixbase1: number = -1,
  mixbase2: number = -1,
  mixbase3: number = -1,
  mixbase4: number = -1
): void {
  const index = itemDataMana.ItemuBOUGU.length;
  const equipment: Equipment = {
    id: `armor-${listnum}`,
    name,
    type: 'armor',
    listnum,
    x,
    y,
    price,
    plus,
    multi,
    hardmode,
    bougu32png,
    mixbase1: mixbase1 === -1 ? undefined : mixbase1,
    mixbase2: mixbase2 === -1 ? undefined : mixbase2,
    mixbase3: mixbase3 === -1 ? undefined : mixbase3,
    mixbase4: mixbase4 === -1 ? undefined : mixbase4,
    attackBonus: 0,
    defenseBonus: plus,
    hpBonus: 0,
    agilityBonus: 0,
    luckBonus: 0,
    description: '',
    icon: '🛡️',

    maxQuantity: 10,
    attributeRate: multi + 100,
    passive: false,
  };
  itemDataMana.ItemuBOUGU[index] = equipment;
}

function ItemAkusesaripush(
  listnum: number,
  name: string,
  x: number,
  y: number,
  price: number,
  t1: number,
  setumei: string,
  t2: number = 0,
  rank: number = -1,
  hardmode: number = 0,
  image: number = 0,
  mixbase1: number = -1,
  mixbase2: number = -1,
  mixbase3: number = -1,
  mixbase4: number = -1
): void {
  const index = itemDataMana.ItemuAKUSE.length;
  const equipment: Equipment = {
    id: `accessory-${listnum}`,
    name,
    type: 'accessory',
    listnum,
    x,
    y,
    price,
    t1,
    setumei,
    t2,
    rank: rank === -1 ? undefined : rank,
    hardmode,
    image,
    mixbase1: mixbase1 === -1 ? undefined : mixbase1,
    mixbase2: mixbase2 === -1 ? undefined : mixbase2,
    mixbase3: mixbase3 === -1 ? undefined : mixbase3,
    mixbase4: mixbase4 === -1 ? undefined : mixbase4,
    attackBonus: t1 === 31 || t1 === 40 || t1 === 41 || t1 === 42 ? t2 : 0,
    defenseBonus: t1 === 32 || t1 === 40 || t1 === 41 || t1 === 42 || t1 === 43 ? t2 : 0,
    hpBonus: t1 === 30 || t1 === 40 || t1 === 42 || t1 === 43 ? t2 : 0,
    agilityBonus: t1 === 33 || t1 === 40 || t1 === 41 || t1 === 42 || t1 === 43 ? t2 : 0,
    luckBonus: t1 === 34 || t1 === 40 ? t2 : 0,
    description: setumei.replace('[0]', String(t2)),
    icon: '💎',

    maxQuantity: 3,
    attributeRate: 100,
    passive: hardmode === 4,
  };
  itemDataMana.ItemuAKUSE[index] = equipment;
}

export function ItemSoulpush(
  listnum: number,
  name: string,
  x: number,
  y: number,
  price: number,
  t1: number,
  setumei: string,
  t2: number = 0,
  rank: number = -1,
  hardmode: number = 0,
  image: number = 0,
  mixbase1: number = -1,
  mixbase2: number = -1,
  mixbase3: number = -1,
  mixbase4: number = -1
): void {
  const index = itemDataMana.ItemuSOUL.length;
  const equipment: Equipment = {
    id: `soul-${listnum}`,
    name,
    type: 'soul',
    listnum,
    x,
    y,
    price,
    t1,
    setumei,
    t2,
    rank: rank === -1 ? undefined : rank,
    hardmode,
    image,
    mixbase1: mixbase1 === -1 ? undefined : mixbase1,
    mixbase2: mixbase2 === -1 ? undefined : mixbase2,
    mixbase3: mixbase3 === -1 ? undefined : mixbase3,
    mixbase4: mixbase4 === -1 ? undefined : mixbase4,
    attackBonus: 0,
    defenseBonus: 0,
    hpBonus: 0,
    agilityBonus: 0,
    luckBonus: 0,
    description: setumei.replace('[0]', String(t1)).replace('[1]', String(t2)),
    icon: '👻',

    maxQuantity: 2,
    attributeRate: t2 + 100,
    soulType: t1 === 14 ? 14 : t1 === 15 ? 15 : undefined,
    soulPlus: t1,
    soulPerPlus: t2,
    passive: false,
  };
  itemDataMana.ItemuSOUL[index] = equipment;
}

export function ItemMaterialpush(
  listnum: number,
  name: string,
  x: number,
  y: number,
  price: number,
  baset1: number,
  setumei: string,
  baset2: number = 0,
  rank: number = -1,
  _param10: boolean = false,
  bit32: number = 0
): void {
  const index = itemDataMana.ItemuMATERIAL.length;
  const equipment: Equipment = {
    id: `material-${listnum}`,
    name,
    type: 'material',
    listnum,
    x,
    y,
    price,
    t1: baset1,
    setumei,
    t2: baset2,
    rank: rank === -1 ? undefined : rank,
    hardmode: 0,
    bit32,
    attackBonus: 0,
    defenseBonus: 0,
    hpBonus: 0,
    agilityBonus: 0,
    luckBonus: 0,
    description: '',
    icon: '💠',
    maxQuantity: 10,
    attributeRate: 100,
    passive: false,
  };
  itemDataMana.ItemuMATERIAL[index] = equipment;
}

function ItemZyouiGokan(param1: number[]): void {
  const index = itemDataMana.ItemuAKUSEZyoui.length;
  itemDataMana.ItemuAKUSEZyoui[index] = param1;
}

export function ItemZyouiGokan2(param1: number[]): void {
  const index = itemDataMana.ItemuSOULZyoui.length;
  itemDataMana.ItemuSOULZyoui[index] = param1;
}

export function itemRecipepush(param1: number[]): void {
  const index = itemDataMana.ItemuRECIPE.length;
  itemDataMana.ItemuRECIPE[index] = param1;
}

function itemload(): void {
  ItemBUKIpush(0, 'ダガー', 0, 0, 0, 15, 0);
  ItemBUKIpush(1, 'ボウイナイフ', 0, 1, 300, 30, 10);
  ItemBUKIpush(2, 'ククリナイフ', 0, 2, 0, 30, 35);
  ItemBUKIpush(75, 'ククリナイフ+1', 1, 1, 0, 3000, 250, 1);
  ItemBUKIpush(3, 'アイアンソード', 1, 0, 6000, 140, 25);
  ItemBUKIpush(4, 'ブロンズソード', 2, 0, 17000, 400, 30);
  ItemBUKIpush(5, 'アイアンアックス', 1, 2, 44000, 1400, 35);
  ItemBUKIpush(6, 'スチールソード', 3, 0, 83000, 800, 60);
  ItemBUKIpush(7, 'スチールアックス', 3, 2, 0, 3000, 40);
  ItemBUKIpush(78, 'スチールアックス+1', 2, 2, 0, 90000, 200, 1);
  ItemBUKIpush(8, 'ブロードソード', 5, 0, 110000, 1200, 80);
  ItemBUKIpush(9, 'フランキスカ', 5, 2, 144000, 2300, 75);
  ItemBUKIpush(10, 'シミター', 6, 0, 228000, 1100, 125);
  ItemBUKIpush(58, 'シミター+1', 6, 1, 3000000, 12000, 260, 1);
  ItemBUKIpush(11, 'バトルアックス', 6, 2, 0, 5000, 45);
  ItemBUKIpush(12, 'グレイブ', 5, 3, 244000, 2700, 80);
  ItemBUKIpush(13, 'トライデント', 6, 3, 0, 1800, 130);
  ItemBUKIpush(77, 'トライデント+1', 7, 2, 0, 8000, 280, 1);
  ItemBUKIpush(14, 'ウィンドウーソード', 4, 0, 0, 1000, 150);
  ItemBUKIpush(40, 'ウィンドウーソード+1', 4, 4, 0, 1400, 170);
  ItemBUKIpush(70, 'ウィンドウーソード+2', 5, 4, 0, 40000, 280, 1);
  ItemBUKIpush(15, 'ファイアーソード', 4, 1, 0, 2000, 120);
  ItemBUKIpush(41, 'ファイアーソード+1', 4, 5, 0, 2800, 140);
  ItemBUKIpush(71, 'ファイアーソード+2', 5, 5, 0, 100000, 260, 1);
  ItemBUKIpush(16, 'アイスソード', 4, 2, 0, 600, 170);
  ItemBUKIpush(42, 'アイスソード+1', 4, 6, 0, 800, 190);
  ItemBUKIpush(72, 'アイスソード+2', 5, 6, 0, 10000, 300, 1);
  ItemBUKIpush(17, 'ライジングソード', 4, 3, 0, 150, 190);
  ItemBUKIpush(43, 'ライジングソード+1', 4, 7, 0, 200, 210);
  ItemBUKIpush(73, 'ライジングソード+2', 5, 7, 0, 2000, 340, 1);
  ItemBUKIpush(18, 'シルバーソード', 7, 0, 470000, 1700, 160);
  ItemBUKIpush(19, 'シルバースピアー', 7, 3, 0, 1600, 180);
  ItemBUKIpush(88, 'シルバースピアー+1', 8, 3, 0, 5500, 330, 1);
  ItemBUKIpush(20, '刀', 8, 0, 580000, 5000, 125);
  ItemBUKIpush(76, '刀+1', 8, 1, 7000000, 120000, 250, 1);
  ItemBUKIpush(21, 'デビルソード', 9, 0, 0, 2000, 160);
  ItemBUKIpush(22, 'デビルアックス', 9, 2, 0, 9000, 40);
  ItemBUKIpush(23, 'レアソード', 10, 0, 0, 500, 190);
  ItemBUKIpush(24, 'レアグラディウス', 10, 1, 0, 50, 230);
  ItemBUKIpush(25, 'ナイトソード', 11, 0, 820000, 1600, 190);
  ItemBUKIpush(26, 'ナイトレイピア', 11, 1, 0, 250, 240);
  ItemBUKIpush(55, 'ナイトレイピア+1', 11, 5, 0, 15000, 350, 1);
  ItemBUKIpush(27, 'ナイトスピア', 11, 3, 0, 3500, 180);
  ItemBUKIpush(44, 'トマホーク', 0, 3, 0, 35000, 10);
  ItemBUKIpush(45, '太刀', 0, 4, 1400000, 12000, 125);
  ItemBUKIpush(46, 'エストック', 1, 3, 0, 0, 250);
  ItemBUKIpush(50, 'エストック+1', 1, 6, 0, 0, 280);
  ItemBUKIpush(57, 'エストック+2', 2, 6, 0, 0, 390, 1);
  ItemBUKIpush(47, 'メイス', 1, 4, 800000, 8000, 150);
  ItemBUKIpush(28, 'ハードソード', 12, 0, 0, 3000, 200);
  ItemBUKIpush(83, 'ハードソード+1', 12, 4, 0, 6000, 345, 1);
  ItemBUKIpush(29, 'ハードアックス', 12, 2, 0, 10000, 130);
  ItemBUKIpush(84, 'ハードアックス+1', 12, 6, 0, 60000, 300, 1);
  ItemBUKIpush(30, 'ハードランス', 12, 3, 0, 5000, 180);
  ItemBUKIpush(85, 'ハードランス+1', 12, 7, 0, 25000, 320, 1);
  ItemBUKIpush(31, 'ゴールドソード', 14, 0, 0, 5000, 240);
  ItemBUKIpush(86, 'ゴールドソード+1', 14, 4, 0, 30000, 415, 1);
  ItemBUKIpush(32, 'ゴールドアックス', 14, 2, 0, 25000, 130);
  ItemBUKIpush(87, 'ゴールドアックス+1', 14, 6, 0, 110000, 350, 1);
  ItemBUKIpush(48, '緑光剣', 2, 3, 0, 3000, 270);
  ItemBUKIpush(59, '緑光剣+1', 3, 3, 0, 20000, 430, 1);
  ItemBUKIpush(49, '赤光剣', 2, 4, 0, 14000, 220);
  ItemBUKIpush(60, '赤光剣+1', 3, 4, 0, 140000, 370, 1);
  ItemBUKIpush(51, 'クリスタルハンマー', 0, 6, 0, 20000, 190);
  ItemBUKIpush(54, 'クリスタルランス', 0, 7, 0, 15000, 275);
  ItemBUKIpush(56, 'クリスタルランス+1', 1, 7, 0, 75000, 395, 1);
  ItemBUKIpush(52, '四神・赤槍', 8, 4, 0, 40000, 295);
  ItemBUKIpush(61, '四神・赤槍+1', 8, 5, 0, 200000, 400, 1);
  ItemBUKIpush(53, '四神・青剣', 7, 5, 0, 100, 325);
  ItemBUKIpush(62, '四神・青剣+1', 7, 6, 0, 1000, 525, 1);
  ItemBUKIpush(79, 'ウイングランス', 9, 5, 0, 20000, 280);
  ItemBUKIpush(80, 'ウィングソード', 9, 3, 0, 44444, 344);
  ItemBUKIpush(81, 'ウィングソード+1', 9, 4, 0, 66666, 566, 1);
  ItemBUKIpush(33, '魔刀・村正', 13, 0, 0, 1500, 205);
  ItemBUKIpush(63, '魔刀・村正+1', 13, 4, 0, 15000, 370, 1);
  ItemBUKIpush(74, '魔剣・レーヴァテイン', 12, 1, 0, 444444, 14);
  ItemBUKIpush(82, '魔剣・レーヴァテイン+1', 12, 5, 0, 1444444, 44, 1);
  ItemBUKIpush(34, '魔剣・クジャン', 13, 1, 0, 60, 250);
  ItemBUKIpush(64, '魔剣・クジャン+1', 13, 5, 0, 600, 420, 1);
  ItemBUKIpush(35, '魔斧・デュランダル', 13, 2, 0, 20000, 100);
  ItemBUKIpush(65, '魔斧・デュランダル+1', 13, 6, 0, 200000, 270, 1);
  ItemBUKIpush(36, '魔槍・ゲイボルグ', 13, 3, 0, 5000, 190);
  ItemBUKIpush(66, '魔槍・ゲイボルグ+1', 13, 7, 0, 50000, 350, 1);
  ItemBUKIpush(37, '聖剣・エクスカリバー', 15, 0, 0, 10000, 230);
  ItemBUKIpush(67, '聖剣・エクスカリバー+1', 15, 4, 0, 50000, 480, 1);
  ItemBUKIpush(38, '聖斧・スワンチカ', 15, 2, 0, 30000, 100);
  ItemBUKIpush(68, '聖斧・スワンチカ+1', 15, 6, 0, 250000, 310, 1);
  ItemBUKIpush(39, '聖槍・ロンギヌス', 15, 3, 0, 3000, 290);
  ItemBUKIpush(69, '聖槍・ロンギヌス+1', 15, 7, 0, 5000, 540, 1);
  ItemBUKIpush(89, '伝説・呪われた光の剣', 2, 5, 0, 100000, 650, 0, 0);
  ItemBUKIpush(90, '伝説・アストラ', 7, 4, 0, 222222, 700, 2, 1);
  ItemBUKIpush(93, '氷・魔法ジェム', 8, 3, 0, 433333, 770, 2, 99);
  ItemBUKIpush(94, '雷・魔法ジェム', 8, 2, 0, 499999, 830, 2, 99);
  ItemBUKIpush(91, '氷・吹雪', 5, 1, 0, 466666, 825, 3, 1, 93, 94);
  ItemBUKIpush(95, '雷・落雷', 6, 1, 0, 550000, 885, 3, 1, 95, 94);
  ItemBUKIpush(92, '伝説・アストラ(ice)', 10, 14, 0, 500000, 880, 3, 1, 90, 91);
  ItemBUKIpush(96, '四神・不滅の槍', 8, 7, 0, 1200000, 1025, 3, 0, 97, 98);
  ItemBUKIpush(97, '伝説・アストラ+1', 11, 14, 0, 3500000, 1250, 1, 1);
  ItemBUKIpush(98, 'ドラゴンの杖', 9, 7, 0, 4500000, 1360, 3, 0, 113, 100);
  ItemBUKIpush(99, '四神・不滅の剑', 7, 7, 0, 3920000, 1400, 1);
  ItemBUKIpush(100, '四神・不滅の剑+1', 10, 7, 0, 4200000, 1500, 3, 0, 102, 104, 104);
  ItemBUKIpush(101, 'Sword of killing God', 4, 0, 0, 4800000, 1620, 0, 4);
  ItemBUKIpush(102, 'Death Sword', 0, 0, 0, 14800000, 1790, 0, 4);
  ItemBUKIpush(103, 'Undead bow', 1, 3, 0, 24800000, 1900, 5, 5);
  ItemBUKIpush(104, 'Immortal Sword', 2, 3, 0, 12000000, 2000, 5, 5);
  ItemBUKIpush(105, 'Immortal Lance', 0, 3, 0, 12000000, 2150, 3, 5);
  ItemBUKIpush(106, 'Undying Sword', 9, 6, 0, 130000000, 2000, 5);

  ItemBOUGUpush(0, 'レザーアーマー', 0, 0, 0, 5, 0);
  ItemBOUGUpush(1, 'アイアンアーマー', 1, 0, 1000, 40, 10);
  ItemBOUGUpush(2, 'ブロンズアーマー', 2, 0, 8000, 200, 25);
  ItemBOUGUpush(3, 'スチールアーマー', 3, 0, 22000, 550, 40);
  ItemBOUGUpush(4, 'チェーンメイル', 5, 0, 64000, 880, 45);
  ItemBOUGUpush(5, 'スパイクアーマー', 6, 0, 130000, 920, 60);
  ItemBOUGUpush(22, 'スパイクアーマー+1', 6, 2, 4000000, 12000, 210, 1);
  ItemBOUGUpush(6, 'ソーサラーアーマー', 5, 1, 0, 5, 180);
  ItemBOUGUpush(23, 'ソーサラーアーマー+1', 5, 2, 0, 100, 260, 1);
  ItemBOUGUpush(7, 'ハーフアーマー', 0, 1, 230000, 700, 110);
  ItemBOUGUpush(8, 'シルバーアーマー', 7, 0, 480000, 700, 150);
  ItemBOUGUpush(9, 'サムライアーマー', 8, 0, 600000, 1400, 140);
  ItemBOUGUpush(33, 'サムライアーマー+1', 9, 1, 14000000, 70000, 220, 1);
  ItemBOUGUpush(10, 'デビルアーマー', 9, 0, 0, 800, 135);
  ItemBOUGUpush(11, 'レアアーマー', 10, 0, 0, 50, 220);
  ItemBOUGUpush(12, 'ナイトアーマー', 11, 0, 800000, 800, 180);
  ItemBOUGUpush(32, 'ナイトアーマー+1', 11, 1, 0, 50000, 270, 1);
  ItemBOUGUpush(17, 'フルプレート', 0, 3, 0, 5000, 160);
  ItemBOUGUpush(31, 'フルプレート+1', 0, 4, 0, 100000, 250, 1);
  ItemBOUGUpush(13, 'ハードアーマー', 12, 0, 0, 5000, 130);
  ItemBOUGUpush(29, 'ハードアーマー+1', 12, 1, 0, 60000, 280, 1);
  ItemBOUGUpush(14, 'ゴールドアーマー', 14, 0, 0, 2500, 220);
  ItemBOUGUpush(38, 'ゴールドアーマー+1', 14, 1, 0, 5000, 345, 1);
  ItemBOUGUpush(18, 'ライトアーマー', 2, 1, 0, 0, 240, 2);
  ItemBOUGUpush(24, 'ライトアーマー+1', 2, 2, 0, 0, 370, 1);
  ItemBOUGUpush(19, 'クリスタルローブ', 3, 1, 0, 15000, 190);
  ItemBOUGUpush(30, 'クリスタルローブ+1', 3, 2, 0, 75000, 325, 1);
  ItemBOUGUpush(20, '四神・白鎧', 7, 1, 0, 12000, 250);
  ItemBOUGUpush(25, '四神・白鎧+1', 7, 2, 0, 50000, 380, 1);
  ItemBOUGUpush(21, '四神・黒鎧', 8, 1, 0, 75000, 150);
  ItemBOUGUpush(26, '四神・黒鎧+1', 8, 2, 0, 400000, 240, 1);
  ItemBOUGUpush(34, 'ウィングアーマー', 1, 1, 0, 30000, 275);
  ItemBOUGUpush(35, 'ウィングアーマー+1', 1, 2, 0, 155555, 455, 1);
  ItemBOUGUpush(15, '魔鎧・メギンギョルズ', 13, 0, 0, 2000, 200);
  ItemBOUGUpush(27, '魔鎧・メギンギョルズ+1', 13, 1, 0, 10000, 340, 1);
  ItemBOUGUpush(16, '聖鎧・アイギス', 15, 0, 0, 5000, 240);
  ItemBOUGUpush(28, '聖鎧・アイギス+1', 15, 1, 0, 80000, 420, 2);
  ItemBOUGUpush(36, 'エンジェルコート', 3, 3, 0, 80000, 200);
  ItemBOUGUpush(37, 'エンジェルコート+1', 3, 4, 0, 250000, 365, 1);
  ItemBOUGUpush(39, '伝説・呪われた血の鎧', 2, 3, 0, 200000, 520, 2);
  ItemBOUGUpush(40, '炎・イグニス', 9, 3, 0, 300000, 600, 0, 0);
  ItemBOUGUpush(41, '聖鎧・ヘリオス', 1, 3, 0, 777777, 677, 3, 0, 18, 28, 39, 42);
  ItemBOUGUpush(42, '四神・暗黒鎧', 8, 3, 0, 900000, 800, 3, 0, 43, 44);
  ItemBOUGUpush(43, '炎・イグニス+1', 9, 2, 0, 2000000, 950, 1, 0);
  ItemBOUGUpush(44, 'レインボーアーマー', 8, 4, 0, 700000, 1000, 2);
  ItemBOUGUpush(45, 'アンデッドダークアーマー', 10, 1, 0, 800000, 1150, 1);
  ItemBOUGUpush(46, 'フェアリーコート', 11, 4, 0, 800000, 1260, 0);
  ItemBOUGUpush(47, 'デスコート', 10, 2, 0, 1800000, 1370, 0);
  ItemBOUGUpush(48, 'アンデッドコート', 13, 2, 0, 0, 1520, 0);
  ItemBOUGUpush(49, 'イモータルコート', 14, 2, 0, 0, 1680, 0);
  ItemBOUGUpush(50, 'アンダイングコート', 6, 1, 0, 0, 1790, 0);
  ItemBOUGUpush(51, '玄武鎧', 6, 3, 0, 0, 1890, 0);

  ItemAkusesaripush(0, 'HPジェム', 7, 0, 2000, 30, 'HPが[0]増加', 400, R1);
  ItemAkusesaripush(1, 'HPジェム+1', 7, 1, 40000, 30, 'HPが[0]増加', 2000, R1);
  ItemAkusesaripush(2, 'HPジェム+2', 7, 2, 150000, 30, 'HPが[0]増加', 5000, R1);
  ItemAkusesaripush(3, 'HPジェム+3', 7, 3, 580000, 30, 'HPが[0]増加', 15000, R1);
  ItemAkusesaripush(39, 'HPジェム+4', 7, 7, 0, 30, 'HPが[0]増加', 40000, R1);
  ItemAkusesaripush(46, 'HPジェム+5', 7, 8, 0, 30, 'HPが[0]増加', 200000, R2);
  ItemAkusesaripush(59, 'HPジェム+6', 7, 9, 0, 30, 'HPが[0]増加', 750000, R2, 1);
  ItemZyouiGokan([0, 1, 2, 3, 39, 46, 59]);

  ItemAkusesaripush(4, '攻撃力ジェム', 2, 0, 3000, 31, '攻撃力が[0]増加', 200, R1);
  ItemAkusesaripush(5, '攻撃力ジェム+1', 2, 1, 50000, 31, '攻撃力が[0]増加', 1000, R1);
  ItemAkusesaripush(6, '攻撃力ジェム+2', 2, 2, 150000, 31, '攻撃力が[0]増加', 3000, R1);
  ItemAkusesaripush(7, '攻撃力ジェム+3', 2, 3, 640000, 31, '攻撃力が[0]増加', 10000, R1);
  ItemAkusesaripush(40, '攻撃力ジェム+4', 2, 7, 0, 31, '攻撃力が[0]増加', 25000, R1);
  ItemAkusesaripush(47, '攻撃力ジェム+5', 2, 8, 0, 31, '攻撃力が[0]増加', 130000, R2);
  ItemAkusesaripush(60, '攻撃力ジェム+6', 2, 9, 0, 31, '攻撃力が[0]増加', 300000, R2, 1);
  ItemZyouiGokan([4, 5, 6, 7, 40, 47, 60]);

  ItemAkusesaripush(8, '防御力ジェム', 5, 0, 3000, 32, '防御力が[0]増加', 200, R1);
  ItemAkusesaripush(9, '防御力ジェム+1', 5, 1, 50000, 32, '防御力が[0]増加', 1000, R1);
  ItemAkusesaripush(10, '防御力ジェム+2', 5, 2, 150000, 32, '防御力が[0]増加', 3000, R1);
  ItemAkusesaripush(11, '防御力ジェム+3', 5, 3, 640000, 32, '防御力が[0]増加', 10000, R1);
  ItemAkusesaripush(41, '防御力ジェム+4', 5, 7, 0, 32, '防御力が[0]増加', 25000, R1);
  ItemAkusesaripush(48, '防御力ジェム+5', 5, 8, 0, 32, '防御力が[0]増加', 130000, R2);
  ItemAkusesaripush(61, '防御力ジェム+6', 5, 9, 0, 32, '防御力が[0]増加', 300000, R2, 1);
  ItemZyouiGokan([8, 9, 10, 11, 41, 48, 61]);

  ItemAkusesaripush(12, '敏捷ジェム', 6, 0, 2000, 33, '敏捷度增加[0]', 150, R1);
  ItemAkusesaripush(13, '敏捷ジェム+1', 6, 1, 40000, 33, '敏捷度增加[0]', 800, R1);
  ItemAkusesaripush(14, '敏捷ジェム+2', 6, 2, 140000, 33, '敏捷度增加[0]', 2000, R1);
  ItemAkusesaripush(15, '敏捷ジェム+3', 6, 3, 500000, 33, '敏捷度增加[0]', 7000, R1);
  ItemAkusesaripush(42, '敏捷ジェム+4', 6, 7, 0, 33, '敏捷度增加[0]', 18000, R1);
  ItemAkusesaripush(49, '敏捷ジェム+5', 6, 8, 0, 33, '敏捷度增加[0]', 80000, R2);
  ItemAkusesaripush(62, '敏捷ジェム+6', 6, 9, 0, 33, '敏捷度增加[0]', 300000, R2, 1);
  ItemZyouiGokan([12, 13, 14, 15, 42, 49, 62]);

  ItemAkusesaripush(16, '幸運ジェム', 4, 0, 2000, 34, '幸运值增加[0]', 100, R1);
  ItemAkusesaripush(17, '幸運ジェム+1', 4, 1, 40000, 34, '幸运值增加[0]', 500, R1);
  ItemAkusesaripush(18, '幸運ジェム+2', 4, 2, 140000, 34, '幸运值增加[0]', 1200, R1);
  ItemAkusesaripush(19, '幸運ジェム+3', 4, 3, 500000, 34, '幸运值增加[0]', 4000, R1);
  ItemAkusesaripush(43, '幸運ジェム+4', 4, 7, 0, 34, '幸运值增加[0]', 12000, R1);
  ItemAkusesaripush(50, '幸運ジェム+5', 4, 8, 0, 34, '幸运值增加[0]', 50000, R2);
  ItemAkusesaripush(63, '幸運ジェム+6', 4, 9, 0, 34, '幸运值增加[0]', 250000, R2, 1);
  ItemZyouiGokan([16, 17, 18, 19, 43, 50, 63]);

  ItemAkusesaripush(44, 'プレイヤージェム', 5, 5, 1000000, 35, '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%', 100, R2);
  ItemAkusesaripush(45, 'プレイヤージェム+1', 5, 6, 0, 35, '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%', 400, R2);
  ItemAkusesaripush(51, 'プレイヤージェム+2', 6, 6, 0, 35, '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%', 900, R3, 1);
  ItemZyouiGokan([44, 45, 51]);

  ItemAkusesaripush(20, '経験ジェム', 0, 0, 5000, 60, '获得经验值增加[0]%', 15, R3);
  ItemAkusesaripush(21, '経験ジェム+1', 0, 1, 120000, 60, '获得经验值增加[0]%', 30, R3);
  ItemAkusesaripush(22, '経験ジェム+2', 0, 2, 500000, 60, '获得经验值增加[0]%', 45, R3);
  ItemAkusesaripush(23, '経験ジェム+3', 0, 3, 0, 60, '获得经验值增加[0]%', 60, R3);
  ItemAkusesaripush(52, '経験ジェム+4', 0, 7, 0, 60, '获得经验值增加[0]%', 75, R4);
  ItemAkusesaripush(72, '経験ジェム+5', 0, 8, 0, 60, '获得经验值增加[0]%', 90, R4, 1);
  ItemAkusesaripush(73, '経験ジェム+6', 0, 9, 0, 60, '获得经验值增加[0]%', 105, R4, 1);
  ItemZyouiGokan([20, 21, 22, 23, 52, 72, 73]);

  ItemAkusesaripush(109, '燃える本', 11, 1, 0, 60, '获得经验值增加[0]%', 150, R4, 3, 0, 73, 84, 92, 93);
  ItemAkusesaripush(64, '勇者ジェム', 9, 0, 0, 40, '所有属性增加[0]', 37777, R1);
  ItemAkusesaripush(65, '勇者ジェム+1', 9, 1, 0, 40, '所有属性增加[0]', 77777, R1, 1);
  ItemAkusesaripush(69, '勇者ジェム+2', 9, 2, 0, 40, '所有属性增加[0]', 144444, R2, 1);
  ItemZyouiGokan([64, 65, 69]);

  ItemAkusesaripush(66, '戦神ジェム', 9, 5, 0, 41, '攻击力、防御力、敏捷度增加[0]', 50000, R1, 1);
  ItemAkusesaripush(67, '戦神ジェム+1', 9, 6, 0, 41, '攻击力、防御力、敏捷度增加[0]', 144444, R2, 1);
  ItemZyouiGokan([66, 67]);

  ItemAkusesaripush(70, '四神宝珠', 9, 3, 0, 42, 'HP、攻击力、防御力、敏捷度增加[0]', 100000, R2);
  ItemAkusesaripush(71, '四神宝珠+1', 9, 4, 0, 42, 'HP、攻击力、防御力、敏捷度增加[0]', 400000, R2, 1);
  ItemZyouiGokan([70, 71]);

  ItemAkusesaripush(74, 'クリスタルアイギス', 10, 2, 0, 43, 'HP、防御力、敏捷度增加', 9000, R1);
  ItemAkusesaripush(75, 'クリスタルアイギス+1', 10, 3, 0, 43, 'HP、防御力、敏捷度增加', 24000, R1, 1);
  ItemZyouiGokan([74, 75]);

  ItemAkusesaripush(24, '属性点クリスタル', 0, 6, 0, 700, '获得属性点变为[0]', 5, R3);
  ItemAkusesaripush(55, '属性点クリスタル+1', 10, 6, 0, 701, '获得属性点变为[0]', 6, R3, 1);
  ItemAkusesaripush(113, '神話クリスタル', 11, 5, 0, 2701, '神话水晶描述', 100, R3, 3, 0, 24, 55, 71, 114);
  ItemZyouiGokan([24, 55, 113]);

  ItemAkusesaripush(78, '黄昏水晶', 10, 7, 0, 15, '属性点减少40%', 1, R3, 1);
  ItemZyouiGokan([78]);

  ItemAkusesaripush(68, '勇者の証明', 10, 0, 0, 820, '角色能力效果增加[0]%', 30, R1, 1);
  ItemAkusesaripush(126, '勇者の証明+1', 10, 1, 0, 820, '角色能力效果增加[0]%', 50, R1, 1);
  ItemZyouiGokan([68, 126]);

  ItemAkusesaripush(25, '会心確率リング', 4, 4, 0, 200, '暴击率提高', 0, R2);
  ItemZyouiGokan([25]);

  ItemAkusesaripush(26, '会心威力リング', 7, 4, 170000, 210, '暴击伤害提高', 0, R3);
  ItemZyouiGokan([26]);

  ItemAkusesaripush(27, '初撃会心リング', 8, 4, 210000, 310, '首次攻击必定暴击', 1, R2);
  ItemAkusesaripush(56, '2連撃会心リング', 8, 5, 2000000, 311, '前[0]次攻击必定暴击', 2, R3, 1);
  ItemAkusesaripush(57, '3連撃会心リング', 8, 6, 0, 312, '前[0]次攻击必定暴击', 3, R3, 1);
  ItemZyouiGokan([27, 56, 57]);

  ItemAkusesaripush(28, '連撃率リング', 4, 5, 0, 250, '连击概率提高', 0, R2);
  ItemZyouiGokan([28]);

  ItemAkusesaripush(54, 'ミニリカバリーネックレス', 6, 5, 1700000, 1201, '攻击时回复造成伤害的[0]%', 2, R3);
  ItemAkusesaripush(29, 'リカバリーネックレス', 2, 5, 0, 1200, '攻击时回复造成伤害的[0]%', 4, R4);
  ItemAkusesaripush(83, 'リカバリーネックレス+1', 2, 4, 0, 1202, '攻击时回复造成伤害的[0]%', 6, R4);
  ItemAkusesaripush(128, 'リカバリーネックレス+2', 1, 3, 0, 1203, '攻击时回复造成伤害的[0]%', 9, R4);
  ItemZyouiGokan([54, 29, 83, 128]);

  ItemAkusesaripush(30, '起死回生ネックレス', 3, 5, 0, 1210, '受到致命伤害时有几率不死', 0, R3);
  ItemAkusesaripush(58, '起死回生ネックレス+1', 8, 7, 0, 1211, '受到致命伤害时有几率不死', 0, R4, 1);
  ItemZyouiGokan([30, 58]);

  ItemAkusesaripush(31, '敵遭遇減少リング', 1, 4, 50000, 10, '遇敌进度条难以增长', 0, R2);
  ItemZyouiGokan([31]);

  ItemAkusesaripush(32, '強欲リング', 5, 4, 0, 12, '统计减半，掉落率翻倍', 0, R1);
  ItemZyouiGokan([32]);

  ItemAkusesaripush(79, '強欲ペンダント', 7, 5, 0, 77, '获得经验值为0，掉落率增加40%', 0, R2, 1);
  ItemZyouiGokan([79]);

  ItemAkusesaripush(33, 'デスリング', 6, 4, 1, 9999, '死亡', 0, R1, 0);
  ItemZyouiGokan([33]);

  ItemAkusesaripush(76, '回避ベルト', 10, 4, 0, 13, '进度条低于[0]%时遇敌无效', 45, R3);
  ItemAkusesaripush(77, '回避ベルト+1', 10, 5, 0, 13, '进度条低于[0]%时遇敌无效', 70, R4, 1);
  ItemZyouiGokan([76, 77]);

  ItemAkusesaripush(34, '移動速度ジェム', 0, 5, 10000, 100, '地图移动速度略微提升', 60, R2);
  ItemAkusesaripush(35, '移動速度ジェム+1', 1, 5, 200000, 100, '地图移动速度提升', 100, R2);
  ItemZyouiGokan([34, 35]);

  ItemAkusesaripush(36, '残り戦闘リング', 1, 6, 10000, 500, '装备时剩余战斗次数增加[0]', 1, R3);
  ItemAkusesaripush(37, '残り戦闘リング+1', 2, 6, 400000, 500, '装备时剩余战斗次数增加[0]', 3, R3);
  ItemAkusesaripush(38, '残り戦闘リング+2', 3, 6, 0, 500, '装备时剩余战斗次数增加[0]', 5, R3);
  ItemAkusesaripush(53, '残り戦闘リング+3', 4, 6, 0, 500, '装备时剩余战斗次数增加[0]', 7, R4, 1);
  ItemZyouiGokan([36, 37, 38, 53]);

  ItemAkusesaripush(80, '異世界の欠片', 9, 7, 0, 40, '所有属性增加[0]', 500000, R2);
  ItemAkusesaripush(90, '異世界の欠片+1', 9, 8, 0, 40, '所有属性增加[0]', 1000000, R2, 1);
  ItemZyouiGokan([80, 90]);

  ItemAkusesaripush(81, '保護の石', 2, 2, 0, 1111, '受到伤害减少[0]% + HP增加[1]', 20, R1, 0, 1);
  ItemZyouiGokan([81]);

  ItemAkusesaripush(82, '力の石', 7, 2, 0, 2222, '造成伤害增加[0]% + ATK增加[1]', 20, R1, 0, 1);
  ItemZyouiGokan([82]);

  ItemAkusesaripush(84, '天使の羽', 2, 10, 0, 3333, 'HP增加[0]% + EXF增加[1]%', 105, R4, 0, 2);
  ItemZyouiGokan([84]);

  ItemAkusesaripush(85, '不灭の力', 0, 13, 0, 4000, 'HP为0时有[0]%概率复活。每次复活后，全属性增加[1]%。', 2, R4, 0, 2);
  ItemZyouiGokan([85]);

  ItemAkusesaripush(86, '嵐の力', 3, 13, 0, 4001, '连击概率增加[0]%，连击时伤害增加[1]%。', 50, R4, 0, 2);
  ItemZyouiGokan([86]);

  ItemAkusesaripush(87, '天空の力', 2, 13, 0, 4002, '额外造成自身等级x[0]的伤害。', 50, R4, 0, 2);
  ItemZyouiGokan([87]);

  ItemAkusesaripush(88, '大地の力', 1, 13, 0, 4003, '受到伤害减少[0]% + HP增加[1]%。', 0, R1, 0, 2);
  ItemZyouiGokan([88]);

  ItemAkusesaripush(89, '加速砂時計', 6, 4, 0, 4100, 'EXP增加[0]%，战斗点数消耗[1]倍，经验获得率[1]倍。', 0.5, R3, 1, 2);
  ItemAkusesaripush(127, '加速砂時計+1', 9, 4, 0, 4101, 'EXP增加[0]%，战斗点数消耗[1]倍，经验获得率[1]倍。', 0.75, R3, 1, 2);

  ItemAkusesaripush(93, '炎の羽', 0, 10, 0, 3334, 'ATK[0]% 増加する + EXF [1]% 増加する', 80, R4, 2, 2);
  ItemAkusesaripush(91, '活力の石', 6, 0, 0, 4200, '持っていれば、別の世界に移動するとHP [0]が増加します (HARDのみ)', 5000000, R1, 1, 2);
  ItemAkusesaripush(92, '御の羽', 1, 10, 0, 3335, 'DEF[0]% 増加する + EXF [1]% 増加する', 80, R4, 2, 2);
  ItemAkusesaripush(107, 'Heart of the four gods', 11, 13, 0, 4004, 'The power of the four gods is one', 0, R4, 3, 2, 85, 86, 87, 108);

  ItemAkusesaripush(94, '城堡紫水晶珠宝', 11, 3, 0, 40, '全属性增加[0]', 2400000, R2);
  ItemAkusesaripush(95, '城堡紫水晶戒指', 11, 4, 0, 1999, '紫水晶戒指效果', 750000, R4, 3, 0, 94, 94, 94, 108);
  ItemAkusesaripush(96, '神圣遗物', 11, 6, 0, 1999, '神圣遗物效果', 5, R5, 4);
  ItemAkusesaripush(97, '堕落遗物', 11, 7, 0, 1999, '堕落遗物效果', 5, R5, 4);
  ItemAkusesaripush(98, '反射之镜', 11, 8, 0, 2424, '反射之镜效果（不可重复）', 20, R4, 2, 0);
  ItemAkusesaripush(99, '反射之镜+1', 11, 9, 0, 2425, '反射之镜+1效果', 50, R4, 3, 0, 98, 110, 108);
  ItemAkusesaripush(100, '天界奖杯', 12, 0, 0, 888, '全属性增加[0]%（不可重复）', 15, R3, 3, 0, 93, 92, 84, 108);
  ItemAkusesaripush(101, '星辰戒指', 12, 8, 0, 211, '暴击伤害增加300%（不可重复）', 0, R1, 0);
  ItemAkusesaripush(102, '闪光沙漏', 12, 3, 0, 2777, '闪光沙漏效果（不可重复）', 7, R4);
  ItemAkusesaripush(103, '神之真力', 12, 4, 0, 1999, '闪避率和暴击率增加20%（不可重复）', 50, R5, 4);
  ItemAkusesaripush(104, '神之力', 12, 5, 0, 1999, '全属性增加[0]（被动）', 1500000, R4, 3, 0, 95, 94, 108, 110);
  ItemAkusesaripush(105, '战神之刃', 10, 8, 0, 1999, '战神效果', 0, R5, 4, 2);
  ItemAkusesaripush(106, '赤眼', 11, 0, 0, 1999, '赤眼效果（被动）', 10, R5, 4);
  ItemAkusesaripush(108, '圣树之叶', 12, 11, 0, 2000, '每次攻击回复最大HP的9%', 0, R3, 0, 2);
  ItemAkusesaripush(110, '真理沙漏+1', 7, 4, 0, 1999, '10%防御力转换为攻击力（被动）', 0, R4, 3, 2);
  ItemAkusesaripush(111, '真理沙漏', 7, 4, 0, 1888, '10%防御力转换为攻击力', 0, R4, 1, 2);
  ItemAkusesaripush(112, '火焰秘钥', 13, 3, 0, 1889, '20%概率扣除敌人当前HP的3%', 0, R4, 1, 2);
  ItemAkusesaripush(114, '龙之力', 6, 15, 0, 1999, '提升最大等级至500万', 0, R5, 4, 2);
  ItemAkusesaripush(115, '魔法骰子', 3, 4, 0, 1899, '与恶魔签订契约，随机获得效果：单属性或全属性+15%，或全属性-10%，经验获得+80%', 0, R4, 1, 0);
  ItemAkusesaripush(116, '蓝眼', 12, 6, 0, 1999, '蓝眼效果（被动）', 10, R5, 4);
  ItemAkusesaripush(117, '绿眼', 12, 7, 0, 1999, '绿眼效果（被动）', 10, R5, 4);
  ItemAkusesaripush(118, '诅咒铜币', 2, 0, 0, 78, '金币减少50%，每战伤害增加20%', 10, R1, 0, 2);
  ItemAkusesaripush(119, '秘钥', 14, 3, 0, 1999, '20%概率扣除敌人当前HP的5%（被动）', 10, R4, 3, 2, 112, 1);
  ItemAkusesaripush(120, '闪光沙漏1', 13, 3, 0, 2778, '闪光沙漏1效果（不可重复）', 7, R4, 1);
  ItemAkusesaripush(121, '大地之力+1', 1, 14, 0, 4005, '受到伤害减少[0]% + HP增加[1]%（不可重复）', 7, R1, 3, 2);
  ItemAkusesaripush(122, '恶魔之魂', 5, 12, 0, 4007, '每5次攻击双倍伤害（不可重复）', 7, R2, 0, 2);
  ItemAkusesaripush(123, '神秘信封', 7, 6, 0, 1999, '来自另一个世界的邀请函（不可重复）', 7, R2, 0, 2);
  ItemAkusesaripush(124, '诅咒王冠', 9, 9, 0, 899, '提升40%属性（地狱模式限定，不可重复）', 7, R2);
  ItemAkusesaripush(125, '移动速度宝石+2', 12, 9, 0, 1999, '提升移动速度', 7, R5, 4);
  ItemAkusesaripush(129, "Sanctuary's Blessing", 8, 9, 0, 314, '3连闪避！', 7, R4, 1);
  ItemAkusesaripush(131, 'Red Eye + 1', 11, 0, 0, 1999, '根据获得数量提升15%HP', 20, R5, 4);

  ItemSoulpush(0, 'アライグマの魂', 0, 0, 10000, 100, '装备属性值增加[0]，装备百分比增加[1]%', 5, R1, 0, 0);
  ItemSoulpush(10, 'アライグマの魂+1', 0, 4, 1000000, 2000, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 1, 0);
  ItemSoulpush(1, 'スフィンクスの魂', 1, 0, 300000, 500, '装备属性值增加[0]，装备百分比增加[1]%', 10, R1, 0, 0);
  ItemSoulpush(11, 'スフィンクスの魂+1', 1, 4, 2500000, 3000, '装备属性值增加[0]，装备百分比增加[1]%', 18, R1, 1, 0);
  ItemSoulpush(2, '呪いの赤ん坊', 2, 0, 500000, 1000, '装备属性值增加[0]，装备百分比增加[1]%', 10, R1, 0, 2);
  ItemSoulpush(12, '呪いの赤ん坊+1', 2, 4, 5000000, 5000, '装备属性值增加[0]，装备百分比增加[1]%', 20, R1, 1, 2);
  ItemSoulpush(3, '偽神', 3, 0, 1000000, 4000, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 0, 2);
  ItemSoulpush(13, '偽神+1', 3, 4, 10000000, 7777, '装备属性值增加[0]，装备百分比增加[1]%', 23, R1, 1, 2);
  ItemSoulpush(4, 'グール', 0, 0, 10000000, 14444, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 0, 2);
  ItemSoulpush(14, 'グール+1', 0, 4, 50000000, 144444, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 1, 2);
  ItemSoulpush(5, 'ガイア', 1, 0, 10000000, 7777, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 0, 2);
  ItemSoulpush(15, 'ガイア+1', 1, 4, 50000000, 77777, '装备属性值增加[0]，装备百分比增加[1]%', 30, R1, 1, 2);
  ItemSoulpush(6, 'ミカエル', 2, 0, 50000000, 30000, '装备属性值增加[0]，装备百分比增加[1]%', 30, R1, 0, 0);
  ItemSoulpush(16, 'ミカエル+1', 2, 4, 300000000, 150000, '装备属性值增加[0]，装备百分比增加[1]%', 60, R1, 1, 0);
  ItemSoulpush(7, 'ガブリエル', 3, 0, 50000000, 30000, '装备属性值增加[0]，装备百分比增加[1]%', 30, R1, 0, 0);
  ItemSoulpush(17, 'ガブリエル+1', 3, 4, 300000000, 250000, '装备属性值增加[0]，装备百分比增加[1]%', 60, R1, 1, 0);
  ItemSoulpush(8, 'アストラ', 1, 9, 100000000, 100000, '装备属性值增加[0]，装备百分比增加[1]%', 50, R1, 0, 2);
  ItemSoulpush(9, '黄龍', 0, 9, 999999999, 2500000, '装备属性值增加[0]，装备百分比增加[1]%', 150, R1, 0, 2);
  ItemSoulpush(18, '朱雀', 4, 4, 40000000, 20000, '装备属性值增加[0]，装备百分比增加[1]%', 25, R1, 1, 2);
  ItemSoulpush(19, '白虎', 5, 4, 40000000, 50000, '装备属性值增加[0]，装备百分比增加[1]%', 20, R1, 1, 2);
  ItemSoulpush(20, '青龍', 6, 4, 60000000, 50000, '装备属性值增加[0]，装备百分比增加[1]%', 35, R1, 1, 2);
  ItemSoulpush(21, '玄武', 7, 4, 75000000, 60000, '装备属性值增加[0]，装备百分比增加[1]%', 40, R1, 1, 2);
  ItemSoulpush(22, '黒騎士', 2, 5, 600000000, 900000, '装备属性值增加[0]，装备百分比增加[1]%', 90, R1, 1, 2);
  ItemSoulpush(23, '黒虎', 3, 9, 1600000000, 3200000, '装备属性值增加[0]，装备百分比增加[1]%', 165, R1, 1, 2);
  ItemSoulpush(24, 'ピクセル天使の魂', 4, 1, 1500000000, 0, '闪避率提升10%', 0, R1, 0, 2);
  ItemSoulpush(25, '血天使の魂', 4, 9, 1000000000, 1600000, '装备属性值增加[0]，装备百分比增加[1]%', 120, R1, 1, 2);
  ItemSoulpush(26, '飛竜王', 5, 9, 1600000000, 1600000, '装备属性值增加[0]，装备百分比增加[1]%，提升10%闪避', 160, R1, 1, 2);

  ItemZyouiGokan2([0, 10, 1, 11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 16, 7, 17, 8, 9, 18, 19, 20, 21, 22, 23, 24, 25, 26]);

  ItemMaterialpush(0, '氷河の欠片', 0, 0, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(1, '青い炎', 2, 0, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(2, '神聖巻物', 3, 0, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(3, '竜の心臓', 2, 1, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(4, '神聖巻物1', 3, 1, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(5, '暗黒の炎', 2, 2, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(6, '普通の杖', 5, 2, 0, 1999, '来自异世界的奇异材料', 0, R4, false, 1);
  ItemMaterialpush(7, '普通の杖1', 6, 2, 0, 1999, '来自异世界的奇异材料', 0, R4, false, 1);
  ItemMaterialpush(8, '普通の杖2', 7, 2, 0, 1999, '来自异世界的奇异材料', 0, R4, false, 1);
  ItemMaterialpush(9, '氷河の欠片', 0, 6, 0, 1999, '来自异世界的奇异材料', 0, R4, false, 1);
  ItemMaterialpush(10, '鳳凰の羽', 1, 2, 0, 1999, '天界BOSS掉落', 0, R4);
  ItemMaterialpush(11, '白い牙', 1, 3, 0, 1999, '天界BOSS掉落', 0, R4);
  ItemMaterialpush(12, '青い革', 1, 4, 0, 1999, '天界BOSS掉落', 0, R4);
  ItemMaterialpush(13, '暗黒の茨', 1, 5, 0, 1999, '天界BOSS掉落', 0, R4);
  ItemMaterialpush(14, '燃える黒い魂', 1, 6, 0, 1999, '天界BOSS v2掉落', 0, R4);
  ItemMaterialpush(15, '堕ちた神の核', 1, 7, 0, 1999, '最终BOSS掉落', 0, R4);
  ItemMaterialpush(16, '神聖な材料', 1, 1, 0, 1999, '最终BOSS掉落', 0, R4, false, 2);
  ItemMaterialpush(17, '妖精の羽', 1, 5, 0, 1999, '据说这是凤凰的羽毛？', 0, R4, false, 2);
  ItemMaterialpush(18, '奇妙な水晶', 2, 1, 0, 1999, '据说这是凤凰的羽毛？', 0, R4, false, 2);
  ItemMaterialpush(19, '封印・不滅の槍', 9, 6, 0, 1999, '天界BOSS掉落', 0, R4, false, 3);
  ItemMaterialpush(20, '封印・暗黒鎧', 7, 3, 0, 1999, '天界BOSS掉落', 0, R4, false, 4);
  ItemMaterialpush(21, '封印・暗黒鎧', 7, 4, 0, 1999, '天界BOSS掉落', 0, R4, false, 4);
  ItemMaterialpush(22, '四つ葉のクローバー', 0, 1, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(23, '紫水晶', 0, 6, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(24, '灰色の水晶', 0, 5, 0, 1999, '来自异世界的奇异材料', 0, R4);

  itemRecipepush([21101, 21111, 40082]);
  itemRecipepush([911, 931, 40061]);
  itemRecipepush([951, 941, 40061]);
  itemRecipepush([921, 901, 911]);
  itemRecipepush([961, 40191, 40011]);
  itemRecipepush([981, 971, 40071]);
  itemRecipepush([1001, 991, 40032]);
  itemRecipepush([10411, 10181, 10281, 10391, 40021]);
  itemRecipepush([10421, 40051, 40201]);
  itemRecipepush([21091, 20731, 20841, 20921, 20931]);
  itemRecipepush([21041, 20951, 20941, 40171, 40161]);
  itemRecipepush([21001, 20931, 20921, 20841, 40161]);
  itemRecipepush([21131, 20241, 20551, 20711, 40181]);
  itemRecipepush([21071, 20851, 20861, 20871, 20881, 40161]);
  itemRecipepush([21191, 21121, 40041]);
  itemRecipepush([20951, 20942, 40161]);
  itemRecipepush([20991, 20981, 40161, 40171]);
  itemRecipepush([21211, 20881, 40132]);
  itemRecipepush([21271, 21092, 20891]);
  itemRecipepush([21301, 21072, 40221, 21211, 40131]);
  itemRecipepush([1051, 1031, 1041, 40241]);
}

itemload();

export const equipmentData: Equipment[] = [
  ...itemDataMana.ItemuBUKI,
  ...itemDataMana.ItemuBOUGU,
  ...itemDataMana.ItemuAKUSE,
  ...itemDataMana.ItemuSOUL,
  ...itemDataMana.ItemuMATERIAL,
];

export const getEquipmentById = (equipmentId: string): Equipment | undefined => {
  return equipmentData.find(e => e.id === equipmentId);
};

export const recipes = itemDataMana.ItemuRECIPE;

export interface Recipe {
  targetType: 'weapon' | 'armor' | 'accessory' | 'soul' | 'material';
  targetListnum: number;
  materials: {
    type: 'weapon' | 'armor' | 'accessory' | 'soul' | 'material';
    listnum: number;
    quantity: number;
  }[];
}

const getTypeFromCategory = (category: number): 'weapon' | 'armor' | 'accessory' | 'soul' | 'material' => {
  switch (category) {
    case 0: return 'weapon';
    case 1: return 'armor';
    case 2: return 'accessory';
    case 3: return 'soul';
    case 4: return 'material';
    default: return 'material';
  }
};

export const getRecipeForEquipment = (type: string, listnum: number): Recipe | undefined => {
  const categoryMap: Record<string, number> = {
    weapon: 0,
    armor: 1,
    accessory: 2,
    soul: 3,
    material: 4,
  };
  const category = categoryMap[type] ?? 4;

  for (const recipeData of recipes) {
    if (recipeData.length < 2) continue;
    const recipeTargetId = recipeData[0];
    const recipeCategory = Math.floor(recipeTargetId / 10000);
    const recipeListnum = Math.floor((recipeTargetId % 10000) / 10);
    if (recipeCategory === category && recipeListnum === listnum) {
      
      const materials = recipeData.slice(1).map(materialData => {
        const matCategory = Math.floor(materialData / 10000);
        const matListnum = Math.floor((materialData % 10000) / 10);
        const matQuantity = materialData % 10;
        return {
          type: getTypeFromCategory(matCategory),
          listnum: matListnum,
          quantity: matQuantity,
        };
      });

      return {
        targetType: getTypeFromCategory(recipeCategory),
        targetListnum: recipeListnum,
        materials,
      };
    }
  }

  return undefined;
};

export const getEquipmentByTypeAndListnum = (type: string, listnum: number): Equipment | undefined => {
  switch (type) {
    case 'weapon':
      return itemDataMana.ItemuBUKI.find(e => e.listnum === listnum);
    case 'armor':
      return itemDataMana.ItemuBOUGU.find(e => e.listnum === listnum);
    case 'accessory':
      return itemDataMana.ItemuAKUSE.find(e => e.listnum === listnum);
    case 'soul':
      return itemDataMana.ItemuSOUL.find(e => e.listnum === listnum);
    case 'material':
      return itemDataMana.ItemuMATERIAL.find(e => e.listnum === listnum);
    default:
      return undefined;
  }
};