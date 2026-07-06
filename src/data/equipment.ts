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
    attackBonus: t1 === 31 ? t2 : 0,
    defenseBonus: t1 === 32 ? t2 : 0,
    hpBonus: t1 === 30 ? t2 : 0,
    agilityBonus: t1 === 33 ? t2 : 0,
    luckBonus: t1 === 34 ? t2 : 0,
    description: setumei.replace('[0]', String(t2)),
    icon: '💎',

    maxQuantity: 3,
    attributeRate: 100,
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
  _param11: number = 0
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
    attackBonus: 0,
    defenseBonus: 0,
    hpBonus: 0,
    agilityBonus: 0,
    luckBonus: 0,
    description: '',
    icon: '💠',
    maxQuantity: 10,
    attributeRate: 100,
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
  ItemBUKIpush(0, '匕首', 0, 0, 0, 15, 0);
  ItemBUKIpush(1, '弓刃', 0, 1, 300, 30, 10);
  ItemBUKIpush(2, '弯刀', 0, 2, 0, 30, 35);
  ItemBUKIpush(75, '弯刀+1', 1, 1, 0, 3000, 250, 1);
  ItemBUKIpush(3, '铁剑', 1, 0, 6000, 140, 25);
  ItemBUKIpush(4, '青铜剑', 2, 0, 17000, 400, 30);
  ItemBUKIpush(5, '铁斧', 1, 2, 44000, 1400, 35);
  ItemBUKIpush(6, '钢剑', 3, 0, 83000, 800, 60);
  ItemBUKIpush(7, '钢斧', 3, 2, 0, 3000, 40);
  ItemBUKIpush(78, '钢斧+1', 2, 2, 0, 90000, 200, 1);
  ItemBUKIpush(8, '阔剑', 5, 0, 110000, 1200, 80);
  ItemBUKIpush(9, '飞斧', 5, 2, 144000, 2300, 75);
  ItemBUKIpush(10, '弯刀', 6, 0, 228000, 1100, 125);
  ItemBUKIpush(58, '弯刀+1', 6, 1, 3000000, 12000, 260, 1);
  ItemBUKIpush(11, '战斧', 6, 2, 0, 5000, 45);
  ItemBUKIpush(12, '双刃剑', 5, 3, 244000, 2700, 80);
  ItemBUKIpush(13, '三叉戟', 6, 3, 0, 1800, 130);
  ItemBUKIpush(77, '三叉戟+1', 7, 2, 0, 8000, 280, 1);
  ItemBUKIpush(14, '风剑', 4, 0, 0, 1000, 150);
  ItemBUKIpush(40, '风剑+1', 4, 4, 0, 1400, 170);
  ItemBUKIpush(70, '风剑+2', 5, 4, 0, 40000, 280, 1);
  ItemBUKIpush(15, '火焰剑', 4, 1, 0, 2000, 120);
  ItemBUKIpush(41, '火焰剑+1', 4, 5, 0, 2800, 140);
  ItemBUKIpush(71, '火焰剑+2', 5, 5, 0, 100000, 260, 1);
  ItemBUKIpush(16, '冰剑', 4, 2, 0, 600, 170);
  ItemBUKIpush(42, '冰剑+1', 4, 6, 0, 800, 190);
  ItemBUKIpush(72, '冰剑+2', 5, 6, 0, 10000, 300, 1);
  ItemBUKIpush(17, '雷霆剑', 4, 3, 0, 150, 190);
  ItemBUKIpush(43, '雷霆剑+1', 4, 7, 0, 200, 210);
  ItemBUKIpush(73, '雷霆剑+2', 5, 7, 0, 2000, 340, 1);
  ItemBUKIpush(18, '银剑', 7, 0, 470000, 1700, 160);
  ItemBUKIpush(19, '银枪', 7, 3, 0, 1600, 180);
  ItemBUKIpush(88, '银枪+1', 8, 3, 0, 5500, 330, 1);
  ItemBUKIpush(20, '刀', 8, 0, 580000, 5000, 125);
  ItemBUKIpush(76, '刀+1', 8, 1, 7000000, 120000, 250, 1);
  ItemBUKIpush(21, '恶魔剑', 9, 0, 0, 2000, 160);
  ItemBUKIpush(22, '恶魔斧', 9, 2, 0, 9000, 40);
  ItemBUKIpush(23, '稀有剑', 10, 0, 0, 500, 190);
  ItemBUKIpush(24, '稀有短剑', 10, 1, 0, 50, 230);
  ItemBUKIpush(25, '骑士剑', 11, 0, 820000, 1600, 190);
  ItemBUKIpush(26, '骑士细剑', 11, 1, 0, 250, 240);
  ItemBUKIpush(55, '骑士细剑+1', 11, 5, 0, 15000, 350, 1);
  ItemBUKIpush(27, '骑士长枪', 11, 3, 0, 3500, 180);
  ItemBUKIpush(44, '战斧', 0, 3, 0, 35000, 10);
  ItemBUKIpush(45, '太刀', 0, 4, 1400000, 12000, 125);
  ItemBUKIpush(46, '刺剑', 1, 3, 0, 0, 250);
  ItemBUKIpush(50, '刺剑+1', 1, 6, 0, 0, 280);
  ItemBUKIpush(57, '刺剑+2', 2, 6, 0, 0, 390, 1);
  ItemBUKIpush(47, '战锤', 1, 4, 800000, 8000, 150);
  ItemBUKIpush(28, '硬剑', 12, 0, 0, 3000, 200);
  ItemBUKIpush(83, '硬剑+1', 12, 4, 0, 6000, 345, 1);
  ItemBUKIpush(29, '硬斧', 12, 2, 0, 10000, 130);
  ItemBUKIpush(84, '硬斧+1', 12, 6, 0, 60000, 300, 1);
  ItemBUKIpush(30, '硬长枪', 12, 3, 0, 5000, 180);
  ItemBUKIpush(85, '硬长枪+1', 12, 7, 0, 25000, 320, 1);
  ItemBUKIpush(31, '金剑', 14, 0, 0, 5000, 240);
  ItemBUKIpush(86, '金剑+1', 14, 4, 0, 30000, 415, 1);
  ItemBUKIpush(32, '金斧', 14, 2, 0, 25000, 130);
  ItemBUKIpush(87, '金斧+1', 14, 6, 0, 110000, 350, 1);
  ItemBUKIpush(48, '绿光剑', 2, 3, 0, 3000, 270);
  ItemBUKIpush(59, '绿光剑+1', 3, 3, 0, 20000, 430, 1);
  ItemBUKIpush(49, '赤光剑', 2, 4, 0, 14000, 220);
  ItemBUKIpush(60, '赤光剑+1', 3, 4, 0, 140000, 370, 1);
  ItemBUKIpush(51, '水晶锤', 0, 6, 0, 20000, 190);
  ItemBUKIpush(54, '水晶枪', 0, 7, 0, 15000, 275);
  ItemBUKIpush(56, '水晶枪+1', 1, 7, 0, 75000, 395, 1);
  ItemBUKIpush(52, '四神·赤枪', 8, 4, 0, 40000, 295);
  ItemBUKIpush(61, '四神·赤枪+1', 8, 5, 0, 200000, 400, 1);
  ItemBUKIpush(53, '四神·青剑', 7, 5, 0, 100, 325);
  ItemBUKIpush(62, '四神·青剑+1', 7, 6, 0, 1000, 525, 1);
  ItemBUKIpush(79, '翼枪', 9, 5, 0, 20000, 280);
  ItemBUKIpush(80, '翼剑', 9, 3, 0, 44444, 344);
  ItemBUKIpush(81, '翼剑+1', 9, 4, 0, 66666, 566, 1);
  ItemBUKIpush(33, '魔刀·村正', 13, 0, 0, 1500, 205);
  ItemBUKIpush(63, '魔刀·村正+1', 13, 4, 0, 15000, 370, 1);
  ItemBUKIpush(74, '魔剑·雷瓦汀', 12, 1, 0, 444444, 14);
  ItemBUKIpush(82, '魔剑·雷瓦汀+1', 12, 5, 0, 1444444, 44, 1);
  ItemBUKIpush(34, '魔剑·库藏', 13, 1, 0, 60, 250);
  ItemBUKIpush(64, '魔剑·库藏+1', 13, 5, 0, 600, 420, 1);
  ItemBUKIpush(35, '魔斧·杜兰达尔', 13, 2, 0, 20000, 100);
  ItemBUKIpush(65, '魔斧·杜兰达尔+1', 13, 6, 0, 200000, 270, 1);
  ItemBUKIpush(36, '魔枪·冈格尼尔', 13, 3, 0, 5000, 190);
  ItemBUKIpush(66, '魔枪·冈格尼尔+1', 13, 7, 0, 50000, 350, 1);
  ItemBUKIpush(37, '圣剑·誓约胜利之剑', 15, 0, 0, 10000, 230);
  ItemBUKIpush(67, '圣剑·誓约胜利之剑+1', 15, 4, 0, 50000, 480, 1);
  ItemBUKIpush(38, '圣斧·斯万提卡', 15, 2, 0, 30000, 100);
  ItemBUKIpush(68, '圣斧·斯万提卡+1', 15, 6, 0, 250000, 310, 1);
  ItemBUKIpush(39, '圣枪·朗基努斯', 15, 3, 0, 3000, 290);
  ItemBUKIpush(69, '圣枪·朗基努斯+1', 15, 7, 0, 5000, 540, 1);
  ItemBUKIpush(89, '传说·被诅咒的光之剑', 2, 5, 0, 100000, 650, 0, 0);
  ItemBUKIpush(90, '传说·星辰', 7, 4, 0, 222222, 700, 2, 2);
  ItemBUKIpush(93, '冰·魔法宝石', 8, 3, 0, 433333, 770, 2, 99);
  ItemBUKIpush(94, '雷·魔法宝石', 8, 2, 0, 499999, 830, 2, 99);
  ItemBUKIpush(91, '冰·暴风雪', 5, 1, 0, 466666, 825, 3, 1, 93, 94);
  ItemBUKIpush(95, '雷·落雷', 6, 1, 0, 550000, 885, 3, 1, 95, 94);
  ItemBUKIpush(92, '传说·星辰(冰)', 10, 14, 0, 500000, 880, 3, 1, 90, 91);
  ItemBUKIpush(96, '四神·不灭之枪', 8, 7, 0, 1200000, 1025, 3, 0, 97, 98);
  ItemBUKIpush(97, '传说·星辰+1', 11, 14, 0, 3500000, 1250, 1, 1);
  ItemBUKIpush(98, '龙杖', 9, 7, 0, 4500000, 1360, 3, 0, 113, 100);
  ItemBUKIpush(99, '四神·不灭之剑', 7, 7, 0, 3920000, 1400, 1);
  ItemBUKIpush(100, '四神·不灭之剑+1', 10, 7, 0, 4200000, 1500, 3, 0, 102, 104, 104);
  ItemBUKIpush(101, '杀神之剑', 4, 0, 0, 4800000, 1620, 0, 4);
  ItemBUKIpush(102, '死亡之剑', 0, 0, 0, 14800000, 1790, 0, 4);
  ItemBUKIpush(103, '亡灵弓', 1, 3, 0, 24800000, 1900, 5, 5);
  ItemBUKIpush(104, '不朽之剑', 2, 3, 0, 12000000, 2000, 5, 5);
  ItemBUKIpush(105, '不朽之枪', 0, 3, 0, 12000000, 2150, 3, 5);
  ItemBUKIpush(106, '不死之剑', 9, 6, 0, 130000000, 2000, 5);

  ItemBOUGUpush(0, '皮甲', 0, 0, 0, 5, 0);
  ItemBOUGUpush(1, '铁甲', 1, 0, 1000, 40, 10);
  ItemBOUGUpush(2, '青铜甲', 2, 0, 8000, 200, 25);
  ItemBOUGUpush(3, '钢甲', 3, 0, 22000, 550, 40);
  ItemBOUGUpush(4, '锁子甲', 5, 0, 64000, 880, 45);
  ItemBOUGUpush(5, '尖刺甲', 6, 0, 130000, 920, 60);
  ItemBOUGUpush(22, '尖刺甲+1', 6, 2, 4000000, 12000, 210, 1);
  ItemBOUGUpush(6, '术士铠甲', 5, 1, 0, 5, 180);
  ItemBOUGUpush(23, '术士铠甲+1', 5, 2, 0, 100, 260, 1);
  ItemBOUGUpush(7, '半身甲', 0, 1, 230000, 700, 110);
  ItemBOUGUpush(8, '银甲', 7, 0, 480000, 700, 150);
  ItemBOUGUpush(9, '武士铠甲', 8, 0, 600000, 1400, 140);
  ItemBOUGUpush(33, '武士铠甲+1', 9, 1, 14000000, 70000, 220, 1);
  ItemBOUGUpush(10, '恶魔铠甲', 9, 0, 0, 800, 135);
  ItemBOUGUpush(11, '稀有铠甲', 10, 0, 0, 50, 220);
  ItemBOUGUpush(12, '骑士铠甲', 11, 0, 800000, 800, 180);
  ItemBOUGUpush(32, '骑士铠甲+1', 11, 1, 0, 50000, 270, 1);
  ItemBOUGUpush(17, '全身板甲', 0, 3, 0, 5000, 160);
  ItemBOUGUpush(31, '全身板甲+1', 0, 4, 0, 100000, 250, 1);
  ItemBOUGUpush(13, '硬铠甲', 12, 0, 0, 5000, 130);
  ItemBOUGUpush(29, '硬铠甲+1', 12, 1, 0, 60000, 280, 1);
  ItemBOUGUpush(14, '金铠甲', 14, 0, 0, 2500, 220);
  ItemBOUGUpush(38, '金铠甲+1', 14, 1, 0, 5000, 345, 1);
  ItemBOUGUpush(18, '光之铠甲', 2, 1, 0, 0, 240, 2);
  ItemBOUGUpush(24, '光之铠甲+1', 2, 2, 0, 0, 370, 1);
  ItemBOUGUpush(19, '水晶法袍', 3, 1, 0, 15000, 190);
  ItemBOUGUpush(30, '水晶法袍+1', 3, 2, 0, 75000, 325, 1);
  ItemBOUGUpush(20, '四神·白铠', 7, 1, 0, 12000, 250);
  ItemBOUGUpush(25, '四神·白铠+1', 7, 2, 0, 50000, 380, 1);
  ItemBOUGUpush(21, '四神·黑铠', 8, 1, 0, 75000, 150);
  ItemBOUGUpush(26, '四神·黑铠+1', 8, 2, 0, 400000, 240, 1);
  ItemBOUGUpush(34, '翼甲', 1, 1, 0, 30000, 275);
  ItemBOUGUpush(35, '翼甲+1', 1, 2, 0, 155555, 455, 1);
  ItemBOUGUpush(15, '魔铠·梅金吉奥德', 13, 0, 0, 2000, 200);
  ItemBOUGUpush(27, '魔铠·梅金吉奥德+1', 13, 1, 0, 10000, 340, 1);
  ItemBOUGUpush(16, '圣铠·埃癸斯', 15, 0, 0, 5000, 240);
  ItemBOUGUpush(28, '圣铠·埃癸斯+1', 15, 1, 0, 80000, 420, 2);
  ItemBOUGUpush(36, '天使外套', 3, 3, 0, 80000, 200);
  ItemBOUGUpush(37, '天使外套+1', 3, 4, 0, 250000, 365, 1);
  ItemBOUGUpush(39, '传说·被诅咒的血之铠', 2, 3, 0, 200000, 520, 2);
  ItemBOUGUpush(40, '火·伊格尼斯', 9, 3, 0, 300000, 600, 0, 0);
  ItemBOUGUpush(41, '圣铠·赫利俄斯', 1, 3, 0, 777777, 677, 3, 0, 18, 28, 39, 42);
  ItemBOUGUpush(42, '四神·暗黑铠', 8, 3, 0, 900000, 800, 3, 0, 43, 44);
  ItemBOUGUpush(43, '火·伊格尼斯+1', 9, 2, 0, 2000000, 950, 1, 0);
  ItemBOUGUpush(44, '彩虹铠甲', 8, 4, 0, 700000, 1000, 2);
  ItemBOUGUpush(45, '不朽/暗黑铠甲', 10, 1, 0, 800000, 1150, 1);
  ItemBOUGUpush(46, '妖精羽衣', 11, 4, 0, 800000, 1260, 0);
  ItemBOUGUpush(47, '死亡外套', 10, 2, 0, 1800000, 1370, 0);
  ItemBOUGUpush(48, '亡灵外套', 13, 2, 0, 0, 1520, 0);
  ItemBOUGUpush(49, '不朽外套', 14, 2, 0, 0, 1680, 0);
  ItemBOUGUpush(50, '不死外衣', 6, 1, 0, 0, 1790, 0);
  ItemBOUGUpush(51, '玄武铠甲', 6, 3, 0, 0, 1890, 0);

  ItemAkusesaripush(0, 'HP宝石', 7, 0, 2000, 30, 'HPが[0]増加', 400, R1);
  ItemAkusesaripush(1, 'HP宝石+1', 7, 1, 40000, 30, 'HPが[0]増加', 2000, R1);
  ItemAkusesaripush(2, 'HP宝石+2', 7, 2, 150000, 30, 'HPが[0]増加', 5000, R1);
  ItemAkusesaripush(3, 'HP宝石+3', 7, 3, 580000, 30, 'HPが[0]増加', 15000, R1);
  ItemAkusesaripush(39, 'HP宝石+4', 7, 7, 0, 30, 'HPが[0]増加', 40000, R1);
  ItemAkusesaripush(46, 'HP宝石+5', 7, 8, 0, 30, 'HPが[0]増加', 200000, R2);
  ItemAkusesaripush(59, 'HP宝石+6', 7, 9, 0, 30, 'HPが[0]増加', 750000, R2, 1);
  ItemZyouiGokan([0, 1, 2, 3, 39, 46, 59]);

  ItemAkusesaripush(4, '攻击力宝石', 2, 0, 3000, 31, '攻撃力が[0]増加', 200, R1);
  ItemAkusesaripush(5, '攻撃力宝石+1', 2, 1, 50000, 31, '攻撃力が[0]増加', 1000, R1);
  ItemAkusesaripush(6, '攻撃力宝石+2', 2, 2, 150000, 31, '攻撃力が[0]増加', 3000, R1);
  ItemAkusesaripush(7, '攻撃力宝石+3', 2, 3, 640000, 31, '攻撃力が[0]増加', 10000, R1);
  ItemAkusesaripush(40, '攻撃力宝石+4', 2, 7, 0, 31, '攻撃力が[0]増加', 25000, R1);
  ItemAkusesaripush(47, '攻撃力宝石+5', 2, 8, 0, 31, '攻撃力が[0]増加', 130000, R2);
  ItemAkusesaripush(60, '攻撃力宝石+6', 2, 9, 0, 31, '攻撃力が[0]増加', 300000, R2, 1);
  ItemZyouiGokan([4, 5, 6, 7, 40, 47, 60]);

  ItemAkusesaripush(8, '防御力宝石', 5, 0, 3000, 32, '防御力が[0]増加', 200, R1);
  ItemAkusesaripush(9, '防御力宝石+1', 5, 1, 50000, 32, '防御力が[0]増加', 1000, R1);
  ItemAkusesaripush(10, '防御力宝石+2', 5, 2, 150000, 32, '防御力が[0]増加', 3000, R1);
  ItemAkusesaripush(11, '防御力宝石+3', 5, 3, 640000, 32, '防御力が[0]増加', 10000, R1);
  ItemAkusesaripush(41, '防御力宝石+4', 5, 7, 0, 32, '防御力が[0]増加', 25000, R1);
  ItemAkusesaripush(48, '防御力宝石+5', 5, 8, 0, 32, '防御力が[0]増加', 130000, R2);
  ItemAkusesaripush(61, '防御力宝石+6', 5, 9, 0, 32, '防御力が[0]増加', 300000, R2, 1);
  ItemZyouiGokan([8, 9, 10, 11, 41, 48, 61]);

  ItemAkusesaripush(12, '敏捷宝石', 6, 0, 2000, 33, '敏捷度增加[0]', 150, R1);
  ItemAkusesaripush(13, '敏捷宝石+1', 6, 1, 40000, 33, '敏捷度增加[0]', 800, R1);
  ItemAkusesaripush(14, '敏捷宝石+2', 6, 2, 140000, 33, '敏捷度增加[0]', 2000, R1);
  ItemAkusesaripush(15, '敏捷宝石+3', 6, 3, 500000, 33, '敏捷度增加[0]', 7000, R1);
  ItemAkusesaripush(42, '敏捷宝石+4', 6, 7, 0, 33, '敏捷度增加[0]', 18000, R1);
  ItemAkusesaripush(49, '敏捷宝石+5', 6, 8, 0, 33, '敏捷度增加[0]', 80000, R2);
  ItemAkusesaripush(62, '敏捷宝石+6', 6, 9, 0, 33, '敏捷度增加[0]', 300000, R2, 1);
  ItemZyouiGokan([12, 13, 14, 15, 42, 49, 62]);

  ItemAkusesaripush(16, '幸运宝石', 4, 0, 2000, 34, '幸运值增加[0]', 100, R1);
  ItemAkusesaripush(17, '幸运宝石+1', 4, 1, 40000, 34, '幸运值增加[0]', 500, R1);
  ItemAkusesaripush(18, '幸运宝石+2', 4, 2, 140000, 34, '幸运值增加[0]', 1200, R1);
  ItemAkusesaripush(19, '幸运宝石+3', 4, 3, 500000, 34, '幸运值增加[0]', 4000, R1);
  ItemAkusesaripush(43, '幸运宝石+4', 4, 7, 0, 34, '幸运值增加[0]', 12000, R1);
  ItemAkusesaripush(50, '幸运宝石+5', 4, 8, 0, 34, '幸运值增加[0]', 50000, R2);
  ItemAkusesaripush(63, '幸运宝石+6', 4, 9, 0, 34, '幸运值增加[0]', 250000, R2, 1);
  ItemZyouiGokan([16, 17, 18, 19, 43, 50, 63]);

  ItemAkusesaripush(44, '玩家宝石', 5, 5, 1000000, 35, '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%', 100, R2);
  ItemAkusesaripush(45, '玩家宝石+1', 5, 6, 0, 35, '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%', 400, R2);
  ItemAkusesaripush(51, '玩家宝石+2', 6, 6, 0, 35, '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%', 900, R3, 1);
  ItemZyouiGokan([44, 45, 51]);

  ItemAkusesaripush(20, '经验宝石', 0, 0, 5000, 60, '获得经验值增加[0]%', 15, R3);
  ItemAkusesaripush(21, '经验宝石+1', 0, 1, 120000, 60, '获得经验值增加[0]%', 30, R3);
  ItemAkusesaripush(22, '经验宝石+2', 0, 2, 500000, 60, '获得经验值增加[0]%', 45, R3);
  ItemAkusesaripush(23, '经验宝石+3', 0, 3, 0, 60, '获得经验值增加[0]%', 60, R3);
  ItemAkusesaripush(52, '经验宝石+4', 0, 7, 0, 60, '获得经验值增加[0]%', 75, R4);
  ItemAkusesaripush(72, '经验宝石+5', 0, 8, 0, 60, '获得经验值增加[0]%', 90, R4, 1);
  ItemAkusesaripush(73, '经验宝石+6', 0, 9, 0, 60, '获得经验值增加[0]%', 105, R4, 1);
  ItemZyouiGokan([20, 21, 22, 23, 52, 72, 73]);

  ItemAkusesaripush(109, '燃烧之书', 11, 1, 0, 60, '获得经验值增加[0]%', 150, R4, 3, 0, 73, 84, 92, 93);
  ItemAkusesaripush(64, '勇者宝石', 9, 0, 0, 40, '所有属性增加[0]', 37777, R1);
  ItemAkusesaripush(65, '勇者宝石+1', 9, 1, 0, 40, '所有属性增加[0]', 77777, R1, 1);
  ItemAkusesaripush(69, '勇者宝石+2', 9, 2, 0, 40, '所有属性增加[0]', 144444, R2, 1);
  ItemZyouiGokan([64, 65, 69]);

  ItemAkusesaripush(66, '战神宝石', 9, 5, 0, 41, '攻击力、防御力、敏捷度增加[0]', 50000, R1, 1);
  ItemAkusesaripush(67, '战神宝石+1', 9, 6, 0, 41, '攻击力、防御力、敏捷度增加[0]', 144444, R2, 1);
  ItemZyouiGokan([66, 67]);

  ItemAkusesaripush(70, '四神宝珠', 9, 3, 0, 42, 'HP、攻击力、防御力、敏捷度增加[0]', 100000, R2);
  ItemAkusesaripush(71, '四神宝珠+1', 9, 4, 0, 42, 'HP、攻击力、防御力、敏捷度增加[0]', 400000, R2, 1);
  ItemZyouiGokan([70, 71]);

  ItemAkusesaripush(74, '水晶埃癸斯', 10, 2, 0, 43, 'HP、防御力、敏捷度增加', 9000, R1);
  ItemAkusesaripush(75, '水晶埃癸斯+1', 10, 3, 0, 43, 'HP、防御力、敏捷度增加', 24000, R1, 1);
  ItemZyouiGokan([74, 75]);

  ItemAkusesaripush(24, '属性点水晶', 0, 6, 0, 700, '获得属性点变为[0]', 5, R3);
  ItemAkusesaripush(55, '属性点水晶+1', 10, 6, 0, 701, '获得属性点变为[0]', 6, R3, 1);
  ItemAkusesaripush(113, '神话水晶', 11, 5, 0, 2701, '神话水晶描述', 100, R3, 3, 0, 24, 55, 71, 114);
  ItemZyouiGokan([24, 55, 113]);

  ItemAkusesaripush(78, '黄昏水晶', 10, 7, 0, 15, '属性点减少40%', 1, R3, 1);
  ItemZyouiGokan([78]);

  ItemAkusesaripush(68, '勇者证明', 10, 0, 0, 820, '角色能力效果增加[0]%', 30, R1, 1);
  ItemAkusesaripush(126, '勇者证明+1', 10, 1, 0, 820, '角色能力效果增加[0]%', 50, R1, 1);
  ItemZyouiGokan([68, 126]);

  ItemAkusesaripush(25, '会心几率戒指', 4, 4, 0, 200, '暴击率提高', 0, R2);
  ItemZyouiGokan([25]);

  ItemAkusesaripush(26, '会心威力戒指', 7, 4, 170000, 210, '暴击伤害提高', 0, R3);
  ItemZyouiGokan([26]);

  ItemAkusesaripush(27, '首击会心戒指', 8, 4, 210000, 310, '首次攻击必定暴击', 1, R2);
  ItemAkusesaripush(56, '2连击会心戒指', 8, 5, 2000000, 311, '前[0]次攻击必定暴击', 2, R3, 1);
  ItemAkusesaripush(57, '3连击会心戒指', 8, 6, 0, 312, '前[0]次攻击必定暴击', 3, R3, 1);
  ItemZyouiGokan([27, 56, 57]);

  ItemAkusesaripush(28, '连击率戒指', 4, 5, 0, 250, '连击概率提高', 0, R2);
  ItemZyouiGokan([28]);

  ItemAkusesaripush(54, '迷你回复项链', 6, 5, 1700000, 1201, '攻击时回复造成伤害的[0]%', 2, R3);
  ItemAkusesaripush(29, '回复项链', 2, 5, 0, 1200, '攻击时回复造成伤害的[0]%', 4, R4);
  ItemAkusesaripush(83, '回复项链+1', 2, 4, 0, 1202, '攻击时回复造成伤害的[0]%', 6, R4);
  ItemAkusesaripush(128, '回复项链+2', 1, 3, 0, 1203, '攻击时回复造成伤害的[0]%', 9, R4);
  ItemZyouiGokan([54, 29, 83, 128]);

  ItemAkusesaripush(30, '起死回生项链', 3, 5, 0, 1210, '受到致命伤害时有几率不死', 0, R3);
  ItemAkusesaripush(58, '起死回生项链+1', 8, 7, 0, 1211, '受到致命伤害时有几率不死', 0, R4, 1);
  ItemZyouiGokan([30, 58]);

  ItemAkusesaripush(31, '遇敌减少戒指', 1, 4, 50000, 10, '遇敌进度条难以增长', 0, R2);
  ItemZyouiGokan([31]);

  ItemAkusesaripush(32, '贪婪戒指', 5, 4, 0, 12, '统计减半，掉落率翻倍', 0, R1);
  ItemZyouiGokan([32]);

  ItemAkusesaripush(79, '贪欲吊坠', 7, 5, 0, 77, '获得经验值为0，掉落率增加40%', 0, R2, 1);
  ItemZyouiGokan([79]);

  ItemAkusesaripush(33, '死亡戒指', 6, 4, 1, 9999, '死亡', 0, R1, 0);
  ItemZyouiGokan([33]);

  ItemAkusesaripush(76, '回避腰带', 10, 4, 0, 13, '进度条低于[0]%时遇敌无效', 45, R3);
  ItemAkusesaripush(77, '回避腰带+1', 10, 5, 0, 13, '进度条低于[0]%时遇敌无效', 70, R4, 1);
  ItemZyouiGokan([76, 77]);

  ItemAkusesaripush(34, '移动速度宝石', 0, 5, 10000, 100, '地图移动速度略微提升', 60, R2);
  ItemAkusesaripush(35, '移动速度宝石+1', 1, 5, 200000, 100, '地图移动速度提升', 100, R2);
  ItemZyouiGokan([34, 35]);

  ItemAkusesaripush(36, '剩余战斗戒指', 1, 6, 10000, 500, '装备时剩余战斗次数增加[0]', 1, R3);
  ItemAkusesaripush(37, '剩余战斗戒指+1', 2, 6, 400000, 500, '装备时剩余战斗次数增加[0]', 3, R3);
  ItemAkusesaripush(38, '剩余战斗戒指+2', 3, 6, 0, 500, '装备时剩余战斗次数增加[0]', 5, R3);
  ItemAkusesaripush(53, '剩余战斗戒指+3', 4, 6, 0, 500, '装备时剩余战斗次数增加[0]', 7, R4, 1);
  ItemZyouiGokan([36, 37, 38, 53]);

  ItemAkusesaripush(80, '异世界碎片', 9, 7, 0, 40, '所有属性增加[0]', 500000, R2);
  ItemAkusesaripush(90, '异世界碎片+1', 9, 8, 0, 40, '所有属性增加[0]', 1000000, R2, 1);
  ItemZyouiGokan([80, 90]);

  ItemAkusesaripush(81, '保护之石', 2, 2, 0, 1111, '受到伤害减少[0]% + HP增加[1]', 20, R1, 0, 1);
  ItemZyouiGokan([81]);

  ItemAkusesaripush(82, '力量之石', 7, 2, 0, 2222, '造成伤害增加[0]% + ATK增加[1]', 20, R1, 0, 1);
  ItemZyouiGokan([82]);

  ItemAkusesaripush(84, '天使之羽', 2, 10, 0, 3333, 'HP增加[0]% + EXF增加[1]%', 105, R4, 0, 2);
  ItemZyouiGokan([84]);

  ItemAkusesaripush(85, '不灭之力', 0, 13, 0, 4000, 'HP为0时有[0]%概率复活。每次复活后，全属性增加[1]%。', 2, R4, 0, 2);
  ItemZyouiGokan([85]);

  ItemAkusesaripush(86, '风暴之力', 3, 13, 0, 4001, '连击概率增加[0]%，连击时伤害增加[1]%。', 50, R4, 0, 2);
  ItemZyouiGokan([86]);

  ItemAkusesaripush(87, '天空之力', 2, 13, 0, 4002, '额外造成自身等级x[0]的伤害。', 50, R4, 0, 2);
  ItemZyouiGokan([87]);

  ItemAkusesaripush(88, '大地之力', 1, 13, 0, 4003, '受到伤害减少[0]% + HP增加[1]%。', 0, R1, 0, 2);
  ItemZyouiGokan([88]);

  ItemAkusesaripush(89, '加速沙漏', 6, 4, 0, 4100, 'EXP增加[0]%，战斗点数消耗[1]倍，经验获得率[1]倍。', 0.5, R3, 1, 2);
  ItemAkusesaripush(127, '加速沙漏+1', 9, 4, 0, 4101, 'EXP增加[0]%，战斗点数消耗[1]倍，经验获得率[1]倍。', 0.5, R3, 1, 2);

  ItemSoulpush(0, '浣熊之魂', 0, 0, 10000, 100, '装备属性值增加[0]，装备百分比增加[1]%', 5, R1, 0, 0);
  ItemSoulpush(10, '浣熊之魂+1', 0, 4, 1000000, 2000, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 1, 0);
  ItemSoulpush(1, '狮身人面像之魂', 1, 0, 300000, 500, '装备属性值增加[0]，装备百分比增加[1]%', 10, R1, 0, 0);
  ItemSoulpush(11, '狮身人面像之魂+1', 1, 4, 2500000, 3000, '装备属性值增加[0]，装备百分比增加[1]%', 18, R1, 1, 0);
  ItemSoulpush(2, '诅咒婴儿', 2, 0, 500000, 1000, '装备属性值增加[0]，装备百分比增加[1]%', 10, R1, 0, 2);
  ItemSoulpush(12, '诅咒婴儿+1', 2, 4, 5000000, 5000, '装备属性值增加[0]，装备百分比增加[1]%', 20, R1, 1, 2);
  ItemSoulpush(3, '伪神', 3, 0, 1000000, 4000, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 0, 2);
  ItemSoulpush(13, '伪神+1', 3, 4, 10000000, 7777, '装备属性值增加[0]，装备百分比增加[1]%', 23, R1, 1, 2);
  ItemSoulpush(4, '食尸鬼', 0, 0, 10000000, 14444, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 0, 2);
  ItemSoulpush(14, '食尸鬼+1', 0, 4, 50000000, 144444, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 1, 2);
  ItemSoulpush(5, '盖亚', 1, 0, 10000000, 7777, '装备属性值增加[0]，装备百分比增加[1]%', 15, R1, 0, 2);
  ItemSoulpush(15, '盖亚+1', 1, 4, 50000000, 77777, '装备属性值增加[0]，装备百分比增加[1]%', 30, R1, 1, 2);
  ItemSoulpush(6, '米迦勒', 2, 0, 50000000, 30000, '装备属性值增加[0]，装备百分比增加[1]%', 30, R1, 0, 0);
  ItemSoulpush(16, '米迦勒+1', 2, 4, 300000000, 150000, '装备属性值增加[0]，装备百分比增加[1]%', 60, R1, 1, 0);
  ItemSoulpush(7, '加百列', 3, 0, 50000000, 30000, '装备属性值增加[0]，装备百分比增加[1]%', 30, R1, 0, 0);
  ItemSoulpush(17, '加百列+1', 3, 4, 300000000, 250000, '装备属性值增加[0]，装备百分比增加[1]%', 60, R1, 1, 0);
  ItemSoulpush(8, '星辰', 1, 9, 100000000, 100000, '装备属性值增加[0]，装备百分比增加[1]%', 50, R1, 0, 2);
  ItemSoulpush(9, '黄龙', 0, 9, 999999999, 2500000, '装备属性值增加[0]，装备百分比增加[1]%', 150, R1, 0, 2);
  ItemSoulpush(18, '朱雀', 4, 4, 40000000, 20000, '装备属性值增加[0]，装备百分比增加[1]%', 25, R1, 1, 2);
  ItemSoulpush(19, '白虎', 5, 4, 40000000, 50000, '装备属性值增加[0]，装备百分比增加[1]%', 20, R1, 1, 2);
  ItemSoulpush(20, '青龙', 6, 4, 60000000, 50000, '装备属性值增加[0]，装备百分比增加[1]%', 35, R1, 1, 2);
  ItemSoulpush(21, '玄武', 7, 4, 75000000, 60000, '装备属性值增加[0]，装备百分比增加[1]%', 40, R1, 1, 2);
  ItemSoulpush(22, '黑骑士', 2, 5, 600000000, 900000, '装备属性值增加[0]，装备百分比增加[1]%', 90, R1, 1, 2);
  ItemSoulpush(23, '黑虎', 3, 9, 1600000000, 3200000, '装备属性值增加[0]，装备百分比增加[1]%', 165, R1, 1, 2);
  ItemSoulpush(24, '像素天使之魂', 4, 1, 1500000000, 0, '闪避率提升10%', 0, R1, 0, 2);
  ItemSoulpush(25, '血天使之魂', 4, 9, 1000000000, 1600000, '装备属性值增加[0]，装备百分比增加[1]%', 120, R1, 1, 2);
  ItemSoulpush(26, '飞龙王', 5, 9, 1600000000, 1600000, '装备属性值增加[0]，装备百分比增加[1]%，提升10%闪避', 160, R1, 1, 2);

  ItemZyouiGokan2([0, 10, 1, 11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 16, 7, 17, 8, 9, 18, 19, 20, 21, 22, 23, 24, 25, 26]);

  ItemMaterialpush(0, '冰川碎片', 0, 0, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(1, '青炎', 2, 0, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(2, '神圣卷轴', 3, 0, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(3, '龙之心', 2, 1, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(4, '神圣卷轴1', 3, 1, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(5, '暗黑之炎', 2, 2, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(6, '普通法杖', 5, 2, 0, 1999, '来自异世界的奇异材料', 0, R4, false, 1);
  ItemMaterialpush(7, '普通法杖1', 6, 2, 0, 1999, '来自异世界的奇异材料', 0, R4, false, 1);
  ItemMaterialpush(8, '普通法杖2', 7, 2, 0, 1999, '来自异世界的奇异材料', 0, R4, false, 1);
  ItemMaterialpush(9, '冰川碎片', 0, 6, 0, 1999, '来自异世界的奇异材料', 0, R4, false, 1);
  ItemMaterialpush(10, '凤凰之羽', 1, 2, 0, 1999, '天界BOSS掉落', 0, R4);
  ItemMaterialpush(11, '白牙', 1, 3, 0, 1999, '天界BOSS掉落', 0, R4);
  ItemMaterialpush(12, '蓝皮革', 1, 4, 0, 1999, '天界BOSS掉落', 0, R4);
  ItemMaterialpush(13, '暗黑荆棘', 1, 5, 0, 1999, '天界BOSS掉落', 0, R4);
  ItemMaterialpush(14, '燃烧的黑魂', 1, 6, 0, 1999, '天界BOSS v2掉落', 0, R4);
  ItemMaterialpush(15, '堕落神之核', 1, 7, 0, 1999, '最终BOSS掉落', 0, R4);
  ItemMaterialpush(16, '神圣材料', 1, 1, 0, 1999, '最终BOSS掉落', 0, R4, false, 2);
  ItemMaterialpush(17, '妖精之羽', 1, 5, 0, 1999, '据说这是凤凰的羽毛？', 0, R4, false, 2);
  ItemMaterialpush(18, '奇异水晶', 2, 1, 0, 1999, '据说这是凤凰的羽毛？', 0, R4, false, 2);
  ItemMaterialpush(19, '封印·不灭之枪', 9, 6, 0, 1999, '天界BOSS掉落', 0, R4, false, 3);
  ItemMaterialpush(20, '封印·暗黑铠', 7, 3, 0, 1999, '天界BOSS掉落', 0, R4, false, 4);
  ItemMaterialpush(21, '封印·暗黑铠', 7, 4, 0, 1999, '天界BOSS掉落', 0, R4, false, 4);
  ItemMaterialpush(22, '四叶草', 0, 1, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(23, '紫水晶', 0, 6, 0, 1999, '来自异世界的奇异材料', 0, R4);
  ItemMaterialpush(24, '灰色水晶', 0, 5, 0, 1999, '来自异世界的奇异材料', 0, R4);
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