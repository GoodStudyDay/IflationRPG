import type { LanguageCode } from './languageData';

const equipmentDescriptionTranslations: Record<string, Record<LanguageCode, string>> = {
  'HPが[0]増加': { ja: 'HPが[0]増加', en: 'HP +[0]', 'zh-Hant': 'HP增加[0]', 'zh-Hans': 'HP增加[0]', ko: 'HP가 [0] 증가', es: 'HP +[0]', id: 'HP +[0]' },
  '攻撃力が[0]増加': { ja: '攻撃力が[0]増加', en: 'ATK +[0]', 'zh-Hant': '攻擊力增加[0]', 'zh-Hans': '攻击力增加[0]', ko: '공격력이 [0] 증가', es: 'ATK +[0]', id: 'ATK +[0]' },
  '防御力が[0]増加': { ja: '防御力が[0]増加', en: 'DEF +[0]', 'zh-Hant': '防禦力增加[0]', 'zh-Hans': '防御力增加[0]', ko: '방어력이 [0] 증가', es: 'DEF +[0]', id: 'DEF +[0]' },
  '敏捷度增加[0]': { ja: '敏捷度增加[0]', en: 'AGI +[0]', 'zh-Hant': '敏捷度增加[0]', 'zh-Hans': '敏捷度增加[0]', ko: '민첩성이 [0] 증가', es: 'AGI +[0]', id: 'AGI +[0]' },
  '幸运值增加[0]': { ja: '幸运值增加[0]', en: 'LUC +[0]', 'zh-Hant': '幸運值增加[0]', 'zh-Hans': '幸运值增加[0]', ko: '행운이 [0] 증가', es: 'LUC +[0]', id: 'LUC +[0]' },
  '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%': { ja: '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%', en: 'HP, ATK, DEF, AGI increase by [0]~[1]% of max level based on completion', 'zh-Hant': '根據物品完成度，HP、ATK、DEF、AGI增加最高等級的[0]~[1]%', 'zh-Hans': '根据物品完成度，HP、ATK、DEF、AGI增加最高等级的[0]~[1]%', ko: '아이템 완성도에 따라 HP, ATK, DEF, AGI가 최고 레벨의 [0]~[1]% 증가', es: 'HP, ATK, DEF, AGI aumentan en [0]~[1]% del nivel máximo según el grado de completitud', id: 'HP, ATK, DEF, AGI bertambah [0]~[1]% dari level maksimal berdasarkan tingkat penyelesaian' },
  '获得经验值增加[0]%': { ja: '获得经验值增加[0]%', en: 'EXP +[0]%', 'zh-Hant': '獲得經驗值增加[0]%', 'zh-Hans': '获得经验值增加[0]%', ko: '획득 경험치가 [0]% 증가', es: 'EXP +[0]%', id: 'EXP +[0]%' },
  '所有属性增加[0]': { ja: '所有属性增加[0]', en: 'All stats +[0]', 'zh-Hant': '所有屬性增加[0]', 'zh-Hans': '所有属性增加[0]', ko: '모든 속성이 [0] 증가', es: 'Todos los atributos +[0]', id: 'Semua atribut +[0]' },
  '攻击力、防御力、敏捷度增加[0]': { ja: '攻击力、防御力、敏捷度增加[0]', en: 'ATK, DEF, AGI +[0]', 'zh-Hant': '攻擊力、防禦力、敏捷度增加[0]', 'zh-Hans': '攻击力、防御力、敏捷度增加[0]', ko: '공격력, 방어력, 민첩성이 [0] 증가', es: 'ATK, DEF, AGI +[0]', id: 'ATK, DEF, AGI +[0]' },
  'HP、攻击力、防御力、敏捷度增加[0]': { ja: 'HP、攻击力、防御力、敏捷度增加[0]', en: 'HP, ATK, DEF, AGI +[0]', 'zh-Hant': 'HP、攻擊力、防禦力、敏捷度增加[0]', 'zh-Hans': 'HP、攻击力、防御力、敏捷度增加[0]', ko: 'HP, 공격력, 방어력, 민첩성이 [0] 증가', es: 'HP, ATK, DEF, AGI +[0]', id: 'HP, ATK, DEF, AGI +[0]' },
  'HP、防御力、敏捷度增加': { ja: 'HP、防御力、敏捷度增加', en: 'HP, DEF, AGI increase', 'zh-Hant': 'HP、防禦力、敏捷度增加', 'zh-Hans': 'HP、防御力、敏捷度增加', ko: 'HP, 방어력, 민첩성이 증가', es: 'HP, DEF, AGI aumentan', id: 'HP, DEF, AGI bertambah' },
  '获得属性点变为[0]': { ja: '获得属性点变为[0]', en: 'Stat points become [0]', 'zh-Hant': '獲得屬性點變為[0]', 'zh-Hans': '获得属性点变为[0]', ko: '획득 속성 포인트가 [0]이 됨', es: 'Puntos de atributos se convierten en [0]', id: 'Point atribut menjadi [0]' },
  '神话水晶描述': { ja: '神话水晶描述', en: 'Myth Crystal description', 'zh-Hant': '神話水晶描述', 'zh-Hans': '神话水晶描述', ko: '신화 크리스탈 설명', es: 'Descripción del Cristal Mítico', id: 'Deskripsi Kristal Mitos' },
  '属性点减少40%': { ja: '属性点减少40%', en: 'Stat points -40%', 'zh-Hant': '屬性點減少40%', 'zh-Hans': '属性点减少40%', ko: '속성 포인트가 40% 감소', es: 'Puntos de atributos -40%', id: 'Point atribut -40%' },
  '角色能力效果增加[0]%': { ja: '角色能力效果增加[0]%', en: 'Character ability effect +[0]%', 'zh-Hant': '角色能力效果增加[0]%', 'zh-Hans': '角色能力效果增加[0]%', ko: '캐릭터 능력 효과가 [0]% 증가', es: 'Efecto de habilidad del personaje +[0]%', id: 'Efek kemampuan karakter +[0]%' },
  '暴击率提高': { ja: '暴击率提高', en: 'Crit rate up', 'zh-Hant': '暴擊率提高', 'zh-Hans': '暴击率提高', ko: '크리율 상승', es: 'Tasa crítica aumentada', id: 'Tingkat kritis meningkat' },
  '暴击伤害提高': { ja: '暴击伤害提高', en: 'Crit damage up', 'zh-Hant': '暴擊傷害提高', 'zh-Hans': '暴击伤害提高', ko: '크리 데미지 상승', es: 'Daño crítico aumentado', id: 'Kerusakan kritis meningkat' },
  '首次攻击必定暴击': { ja: '首次攻击必定暴击', en: 'First attack always crits', 'zh-Hant': '首次攻擊必定暴擊', 'zh-Hans': '首次攻击必定暴击', ko: '첫 번째 공격은 항상 크리', es: 'Primer ataque siempre crítico', id: 'Serangan pertama selalu kritis' },
  '前[0]次攻击必定暴击': { ja: '前[0]次攻击必定暴击', en: 'First [0] attacks always crit', 'zh-Hant': '前[0]次攻擊必定暴擊', 'zh-Hans': '前[0]次攻击必定暴击', ko: '앞 [0]회 공격은 항상 크리', es: 'Los primeros [0] ataques siempre son críticos', id: 'Serangan pertama [0] kali selalu kritis' },
  '连击概率提高': { ja: '连击概率提高', en: 'Combo rate up', 'zh-Hant': '連擊概率提高', 'zh-Hans': '连击概率提高', ko: '연격률 상승', es: 'Tasa de combo aumentada', id: 'Tingkat combo meningkat' },
  '攻击时回复造成伤害的[0]%': { ja: '攻击时回复造成伤害的[0]%', en: 'Heal [0]% of damage dealt', 'zh-Hant': '攻擊時回復造成傷害的[0]%', 'zh-Hans': '攻击时回复造成伤害的[0]%', ko: '공격 시 입힌 데미지의 [0]% 회복', es: 'Curar [0]% del daño infligido', id: 'Pulihkan [0]% dari kerusakan yang diberikan' },
  '受到致命伤害时有几率不死': { ja: '受到致命伤害时有几率不死', en: 'Chance to survive fatal damage', 'zh-Hant': '受到致命傷害時有幾率不死', 'zh-Hans': '受到致命伤害时有几率不死', ko: '치명적인 데미지를 받았을 때 죽지 않을 확률', es: 'Probabilidad de sobrevivir a daño fatal', id: 'Kemungkinan bertahan dari kerusakan fatal' },
  '遇敌进度条难以增长': { ja: '遇敌进度条难以增长', en: 'Encounter bar grows slowly', 'zh-Hant': '遇敵進度條難以增長', 'zh-Hans': '遇敌进度条难以增长', ko: '적 조우 게이지가 느리게 증가', es: 'La barra de encuentros crece lentamente', id: 'Bars pertemuan musuh bertambah lambat' },
  '统计减半，掉落率翻倍': { ja: '统计减半，掉落率翻倍', en: 'Stats halved, drop rate doubled', 'zh-Hant': '統計減半，掉落率翻倍', 'zh-Hans': '统计减半，掉落率翻倍', ko: '스탯이 절반, 드롭률이 2배', es: 'Estadísticas reducidas a la mitad, tasa de caída duplicada', id: 'Stat dipotong setengah, tingkat drop digandakan' },
  '获得经验值为0，掉落率增加40%': { ja: '获得经验值为0，掉落率增加40%', en: 'EXP = 0, drop rate +40%', 'zh-Hant': '獲得經驗值為0，掉落率增加40%', 'zh-Hans': '获得经验值为0，掉落率增加40%', ko: '획득 경험치가 0, 드롭률이 40% 증가', es: 'EXP = 0, tasa de caída +40%', id: 'EXP = 0, tingkat drop +40%' },
  '死亡': { ja: '死亡', en: 'Death', 'zh-Hant': '死亡', 'zh-Hans': '死亡', ko: '사망', es: 'Muerte', id: 'Kematian' },
  '进度条低于[0]%时遇敌无效': { ja: '进度条低于[0]%时遇敌无效', en: 'No encounters below [0]%', 'zh-Hant': '進度條低於[0]%時遇敵無效', 'zh-Hans': '进度条低于[0]%时遇敌无效', ko: '게이지가 [0]% 미만일 때 조우 무효', es: 'No hay encuentros por debajo del [0]%', id: 'Tidak ada pertemuan di bawah [0]%' },
  '地图移动速度略微提升': { ja: '地图移动速度略微提升', en: 'Slight movement speed boost', 'zh-Hant': '地圖移動速度略微提升', 'zh-Hans': '地图移动速度略微提升', ko: '지도 이동 속도가 약간 상승', es: 'Ligero aumento de velocidad de movimiento', id: 'Penambahan sedikit kecepatan pergerakan' },
  '地图移动速度提升': { ja: '地图移动速度提升', en: 'Movement speed boost', 'zh-Hant': '地圖移動速度提升', 'zh-Hans': '地图移动速度提升', ko: '지도 이동 속도가 상승', es: 'Aumento de velocidad de movimiento', id: 'Penambahan kecepatan pergerakan' },
  '装备时剩余战斗次数增加[0]': { ja: '装备时剩余战斗次数增加[0]', en: 'Battle count +[0] when equipped', 'zh-Hant': '裝備時剩餘戰鬥次數增加[0]', 'zh-Hans': '装备时剩余战斗次数增加[0]', ko: '장비 시 남은 전투 횟수가 [0] 증가', es: 'Recuento de batallas +[0] cuando está equipado', id: 'Jumlah pertempuran tersisa +[0] ketika dipasang' },
  '受到伤害减少[0]% + HP增加[1]': { ja: '受到伤害减少[0]% + HP增加[1]', en: 'Damage taken -[0]% + HP +[1]', 'zh-Hant': '受到傷害減少[0]% + HP增加[1]', 'zh-Hans': '受到伤害减少[0]% + HP增加[1]', ko: '입는 데미지가 [0]% 감소 + HP가 [1] 증가', es: 'Daño recibido -[0]% + HP +[1]', id: 'Kerusakan diterima -[0]% + HP +[1]' },
  '造成伤害增加[0]% + ATK增加[1]': { ja: '造成伤害增加[0]% + ATK增加[1]', en: 'Damage dealt +[0]% + ATK +[1]', 'zh-Hant': '造成傷害增加[0]% + ATK增加[1]', 'zh-Hans': '造成伤害增加[0]% + ATK增加[1]', ko: '입히는 데미지가 [0]% 증가 + ATK가 [1] 증가', es: 'Daño infligido +[0]% + ATK +[1]', id: 'Kerusakan diberikan +[0]% + ATK +[1]' },
  'HP增加[0]% + EXF增加[1]%': { ja: 'HP增加[0]% + EXF增加[1]%', en: 'HP +[0]% + EXF +[1]%', 'zh-Hant': 'HP增加[0]% + EXF增加[1]%', 'zh-Hans': 'HP增加[0]% + EXF增加[1]%', ko: 'HP가 [0]% 증가 + EXF가 [1]% 증가', es: 'HP +[0]% + EXF +[1]%', id: 'HP +[0]% + EXF +[1]%' },
  'HP为0时有[0]%概率复活。每次复活后，全属性增加[1]%。': { ja: 'HP为0时有[0]%概率复活。每次复活后，全属性增加[1]%。', en: '[0]% chance to revive at 0 HP. All stats +[1]% per revival.', 'zh-Hant': 'HP為0時有[0]%概率復活。每次復活後，全屬性增加[1]%。', 'zh-Hans': 'HP为0时有[0]%概率复活。每次复活后，全属性增加[1]%。', ko: 'HP가 0일 때 [0]% 확률로 부활. 부활 시마다 모든 속성이 [1]% 증가.', es: '[0]% de probabilidad de revivir a 0 HP. Todos los atributos +[1]% por revivimiento.', id: '[0]% kemungkinan bangkit kembali pada HP 0. Semua atribut +[1]% per bangkit.' },
  '连击概率增加[0]%，连击时伤害增加[1]%。': { ja: '连击概率增加[0]%，连击时伤害增加[1]%。', en: 'Combo rate +[0]%, combo damage +[1]%.', 'zh-Hant': '連擊概率增加[0]%，連擊時傷害增加[1]%。', 'zh-Hans': '连击概率增加[0]%，连击时伤害增加[1]%。', ko: '연격률이 [0]% 증가, 연격 시 데미지가 [1]% 증가.', es: 'Tasa de combo +[0]%, daño de combo +[1]%.', id: 'Tingkat combo +[0]%, kerusakan combo +[1]%.' },
  '额外造成自身等级x[0]的伤害。': { ja: '额外造成自身等级x[0]的伤害。', en: 'Deal extra level x [0] damage.', 'zh-Hant': '額外造成自身等級x[0]的傷害。', 'zh-Hans': '额外造成自身等级x[0]的伤害。', ko: '자신 레벨 x [0]의 추가 데미지를 입힘.', es: 'Infligir daño extra nivel x [0].', id: 'Berikan kerusakan ekstra level x [0].' },
  '受到伤害减少[0]% + HP增加[1]%。': { ja: '受到伤害减少[0]% + HP增加[1]%。', en: 'Damage taken -[0]% + HP +[1]%.', 'zh-Hant': '受到傷害減少[0]% + HP增加[1]%。', 'zh-Hans': '受到伤害减少[0]% + HP增加[1]%。', ko: '입는 데미지가 [0]% 감소 + HP가 [1]% 증가.', es: 'Daño recibido -[0]% + HP +[1]%.', id: 'Kerusakan diterima -[0]% + HP +[1]%.' },
  'EXP增加[0]%，战斗点数消耗[1]倍，经验获得率[1]倍。': { ja: 'EXP增加[0]%，战斗点数消耗[1]倍，经验获得率[1]倍。', en: 'EXP +[0]%, BP cost x[1], EXP rate x[1].', 'zh-Hant': 'EXP增加[0]%，戰鬥點數消耗[1]倍，經驗獲得率[1]倍。', 'zh-Hans': 'EXP增加[0]%，战斗点数消耗[1]倍，经验获得率[1]倍。', ko: 'EXP가 [0]% 증가, BP 소모가 [1]배, 경험치 획득률이 [1]배.', es: 'EXP +[0]%, costo de BP x[1], tasa de EXP x[1].', id: 'EXP +[0]%, biaya BP x[1], tingkat EXP x[1].' },
  '装备属性值增加[0]，装备百分比增加[1]%': { ja: '装备属性值增加[0]，装备百分比增加[1]%', en: 'Equip stat +[0], equip % +[1]%', 'zh-Hant': '裝備屬性值增加[0]，裝備百分比增加[1]%', 'zh-Hans': '装备属性值增加[0]，装备百分比增加[1]%', ko: '장비 속성 값이 [0] 증가, 장비 백분율이 [1]% 증가', es: 'Valor de atributo equipado +[0], % equipado +[1]%', id: 'Nilai atribut equip +[0], persentase equip +[1]%' },
  '闪避率提升10%': { ja: '闪避率提升10%', en: 'Evasion +10%', 'zh-Hant': '閃避率提升10%', 'zh-Hans': '闪避率提升10%', ko: '회피율이 10% 상승', es: 'Evasión +10%', id: 'Tingkat evasi +10%' },
  '装备属性值增加[0]，装备百分比增加[1]%，提升10%闪避': { ja: '装备属性值增加[0]，装备百分比增加[1]%，提升10%闪避', en: 'Equip stat +[0], equip % +[1]%, evasion +10%', 'zh-Hant': '裝備屬性值增加[0]，裝備百分比增加[1]%，提升10%閃避', 'zh-Hans': '装备属性值增加[0]，装备百分比增加[1]%，提升10%闪避', ko: '장비 속성 값이 [0] 증가, 장비 백분율이 [1]% 증가, 회피율 10% 상승', es: 'Valor de atributo equipado +[0], % equipado +[1]%, evasión +10%', id: 'Nilai atribut equip +[0], persentase equip +[1]%, evasi +10%' },
  '来自异世界的奇异材料': { ja: '来自异世界的奇异材料', en: 'Mysterious material from another world', 'zh-Hant': '來自異世界的奇異材料', 'zh-Hans': '来自异世界的奇异材料', ko: '이세계에서 온 신비로운 재료', es: 'Material misterioso de otro mundo', id: 'Bahan misterius dari dunia lain' },
  '天界BOSS掉落': { ja: '天界BOSS掉落', en: 'Dropped by Celestial BOSS', 'zh-Hant': '天界BOSS掉落', 'zh-Hans': '天界BOSS掉落', ko: '천계 보스 드롭', es: 'Soltado por Jefe Celestial', id: 'Ditemukan dari BOSS Surga' },
  '天界BOSS v2掉落': { ja: '天界BOSS v2掉落', en: 'Dropped by Celestial BOSS v2', 'zh-Hant': '天界BOSS v2掉落', 'zh-Hans': '天界BOSS v2掉落', ko: '천계 보스 v2 드롭', es: 'Soltado por Jefe Celestial v2', id: 'Ditemukan dari BOSS Surga v2' },
  '最终BOSS掉落': { ja: '最终BOSS掉落', en: 'Dropped by Final BOSS', 'zh-Hant': '最終BOSS掉落', 'zh-Hans': '最终BOSS掉落', ko: '최종 보스 드롭', es: 'Soltado por Jefe Final', id: 'Ditemukan dari BOSS Akhir' },
  '据说这是凤凰的羽毛？': { ja: '据说这是凤凰的羽毛？', en: 'They say this is a phoenix feather?', 'zh-Hant': '據說這是鳳凰的羽毛？', 'zh-Hans': '据说这是凤凰的羽毛？', ko: '이것이 봉황의 깃털이라고 한다고?', es: '¿Se dice que esta es una pluma de fénix?', id: 'Dikatakan ini adalah bulu phoenix?' },
};

export const getEquipmentDescription = (setumei: string, lang: LanguageCode, t1?: number, t2?: number): string => {
  const translation = equipmentDescriptionTranslations[setumei];
  if (translation) {
    let result = translation[lang] || setumei;
    result = result.replace('[0]', String(t2 || 0));
    result = result.replace('[1]', String(t1 || 0));
    return result;
  }
  let result = setumei;
  result = result.replace('[0]', String(t2 || 0));
  result = result.replace('[1]', String(t1 || 0));
  return result;
};