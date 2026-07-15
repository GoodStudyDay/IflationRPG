interface ChangelogModalProps {
  onClose: () => void;
}

const changelog = [
  {
    version: 'v0.0.72',
    date: '2026-07-15 18:00:00',
    changes: [
      '实现 battle.txt 中 enePattern() Boss技能系统：朱雀/黄龙/暮光/玄武/天使/青龙/白虎',
      '新增 Sanctuary\'s Blessing(129) 饰品：3连闪避效果',
      '新增 Red Eye +1(131) 饰品，修复被动生效引用错误的 listnum',
      '战斗 MISS 文字显示在角色动画身上（类似 COMBO）',
      '修复 Sanctuary\'s Blessing 闪避每回合都飘 MISS 文字',
      '修复 COMBO 连击文字每次连击都重新显示动画',
      '增大战斗页面 COMBO 字体（text-xs → text-base）',
      'i/iii 地图困难模式 Boss(62/68) 补充掉落（accessory-3）',
      '困难模式掉落为空时自动回退到普通掉落',
      'Map13/Map14 隐藏地图解锁等级降为0，击败i/iii Boss直接传送',
      '修复地狱模式初始 BP 为10点',
      '补充翻译：你闪避了敌人的攻击！、Random Drop、Boss技能名称',
    ],
  },
  {
    version: 'v0.0.71',
    date: '2026-07-15 12:00:00',
    changes: [
      '修复连击率/暴击率计算逻辑：基础值改用 battlevar 的 speed/luck 综合计算，不再固定 5%',
      '修复连击率 HP 来源错误：改为玩家自身血量（非敌人），低血量时固定加成 +13%',
      '新增 Boss 76 连击率/暴击率 30% 削减逻辑，匹配原始 battle.txt',
      '战斗中每回合实时更新 comboRate 显示',
      '修复 Raccoon Soul 描述显示反序（Equip stat +100, equip % +5%）',
      '修复 startBossBattle 地图奖励效果作用于 battleVarInit 之前的顺序错误',
      '修复点击延迟问题（移除同步阻塞计算）',
    ],
  },
  {
    version: 'v0.0.69',
    date: '2026-07-14 23:00:00',
    changes: [
      '修复困难模式击杀 i/iii boss 不跳转隐藏地图的问题',
      '修复暴风之力(4001)缺少连击伤害加成(renzoDamageUP=1.5)的问题',
    ],
  },
  {
    version: 'v0.0.68',
    date: '2026-07-14 22:00:00',
    changes: [
      '武器/防具/饰品列表新增搜索框，支持按名称搜索装备',
      '修复搜索框挤压列表布局的问题',
      '修复 kaihuku 帧动画特效不显示的问题（实现 mode 6 动画流程）',
      '修复 Heart of the four gods 中文翻译为四神之力',
      '实现 Heart of the four gods 组合效果：根据同时装备的不灭/岚/天空/圣树数量递增加成',
      '修复回复/复活时特效不在角色身上且不播放的问题',
      '添加"搜索"多语言翻译',
    ],
  },
  {
    version: 'v0.0.67',
    date: '2026-07-14 20:00:00',
    changes: [
      '修复背包中武器/防具/饰品显示原始属性而非计算后的最终属性',
      '修复切换背包时 HP 比例异常变化的问题（按比例保留当前 HP）',
      '修复自动分配属性点时 stPtAllocate 未保存，导致切换背包后属性点加成丢失',
      '修复勇者の証明/勇者の証明+1 装备后对 HP/ATK/DEF 无加成的问题',
      '修复能力宝石(t1=35)在 equipItem/loadEquipSet 中未生效的问题',
      '修复 loadEquipSet 中基础属性计算缺少勇者の証明和能力宝石加成',
    ],
  },
  {
    version: 'v0.0.65',
    date: '2026-07-14 16:00:00',
    changes: [
      '修复天使之羽（accessory-84）掉落：暗黑使者A（boss-84）掉落率 1%',
      '修复御の羽（accessory-92）掉落：深渊五王B（boss-92）掉落率 8%',
      '修复勇者的证明效果：改为 kyarakutaNouryokuUp 累加，正确提升角色能力效果',
      '修复剩余战斗戒指：取下时自动扣回增加的战斗次数',
      '实现恶魔之魂效果：每5次攻击触发双倍伤害',
      '实现诅咒铜币效果：每战伤害增加20%',
      '修复魂描述属性值和百分比显示反了的问题',
    ],
  },
  {
    version: 'v0.0.64',
    date: '2026-07-14 12:00:00',
    changes: [
      '实装战神之刃效果：击杀10万敌人后攻击提升10%',
      '实装圣树之叶效果：每次攻击回复最大HP的9%',
      '实装闪光沙漏1效果：战斗45回合后，敌人血量低于40%直接斩杀',
      '实装秘钥效果：20%概率扣除敌人当前HP的5%',
      '实装火焰秘钥效果：20%概率扣除敌人当前HP的3%',
      '实装Heart of the four gods完整效果：连击伤害+50%、连击率+15%',
      '修复魂列表属性值和百分比显示反了的问题',
      '修复被动饰品从背包生效：城堡紫水晶戒指等无需装备即可获得属性加成',
      '修复passive饰品从装备列表隐藏（仅在装备选择界面隐藏，图鉴中可见）',
    ],
  },
  {
    version: 'v0.0.63',
    date: '2026-07-14 08:00:00',
    changes: [
      '统一所有boss材料掉落为material-X命名格式（与weapon/armor/soul一致）',
      '修复boss-75/82/87/31材料索引错误',
      '修复boss-31 soul-25误写为accessory-25',
      '为battleLog添加多语言翻译支持',
      '移除materialIndex特殊处理，统一使用equipmentId解析',
    ],
  },
  {
    version: 'v0.0.60',
    date: '2026-07-13 20:00:00',
    changes: [
      '新增隐藏地图124（神秘领域），击败Mystery Boss 103后进入',
      '隐藏地图124包含三个敌人：神秘生物A/B/C，对应图像ene124_0a/0b/0c',
      '隐藏地图124规则与地图13/14一致：进入后不再遇到Boss，生成1-5次bonus，次数耗尽返回原地图',
      '添加地图名称"神秘领域"和怪物名称"神秘生物A/B/C"的7语言翻译',
      '修复"暗黑力量的神殿"缺失翻译问题',
    ],
  },
  {
    version: 'v0.0.59',
    date: '2026-07-13 18:00:00',
    changes: [
      '更新 maxgamelv()：最大等级限制 = 35000000 + 龙之力数量 × 5000000',
      '实现 passiveUpdate()：赤眼、蓝眼、绿眼、秘钥、真理沙漏、神秘信封、神之真力等被动效果',
      '添加缺失的地图翻译："死灵深渊"',
    ],
  },
  {
    version: 'v0.0.58',
    date: '2026-07-13 12:00:00',
    changes: [
      '修复战斗属性叠加问题：升级时使用 stPtAllocate 代替从当前属性提取 stPt',
      '地图描述添加多语言翻译支持（60+ 条描述翻译）',
      '完善饰品加成系统：实现 gdata.txt 中 EqStUpdate 所有饰品类型',
      '新增饰品类型支持：暴击率(t1=200)、暴击伤害(t1=210/211)、连击率(t1=250)、移动速度(t1=100)、闪避率(t1=1210/1211)、随机属性(t1=1899)',
    ],
  },
  {
    version: 'v0.0.57',
    date: '2026-07-13 08:00:00',
    changes: [
      '修复 playgem 属性加成问题：切换背包时旧饰品加成不再残留',
      '属性计算改为从基础属性重新计算，不再增量叠加',
      '地图名称添加多语言翻译支持（65 个地图名称）',
      '修复 equipItem 和 loadEquipSet 中的属性点提取逻辑',
    ],
  },
  {
    version: 'v0.0.55',
    date: '2026-07-09 18:00:00',
    changes: [
      '装备合成系统：根据原版recipe数据实现装备合成，在装备收集页面点击可合成装备可查看所需材料并合成',
      '修复Ice Blizzard、Legendary Astra、Legendary Astra (Ice)武器图片显示异常（精灵表尺寸不匹配）',
      '修复weapon1/weapon3/weapon4/weapon5/material精灵表尺寸与实际图片不符的问题',
      'Legendary Astra改回使用buki32png精灵表（原buki2png资产缺失）',
      '添加合成材料、合成、合成成功、材料不足的7语言翻译',
    ],
  },
  {
    version: 'v0.0.54',
    date: '2026-07-09 18:00:00',
    changes: [
      '隐藏地图系统：地图13(魔王城)和14(恶魔深渊)改为隐藏地图，普通传送列表不再显示',
      '隐藏地图入口：遇到i或iii Bonus击败对应Boss后自动传送到隐藏地图，随机生成1-5次战斗次数',
      '隐藏地图规则：次数耗尽自动返回原地图，隐藏地图内不会遇到Boss',
      '添加gamedebug命令：获取全部武器/防具/饰品(+allweapons/+allarmor/+allaccessories)，清除存档(+clearsave)',
      '修复史莱姆缺少多语言翻译的问题',
      '修复装备格子不足时出售装备可能导致装备丢失的问题：出售前优先填充空格子',
    ],
  },
  {
    version: 'v0.0.53',
    date: '2026-07-09 12:00:00',
    changes: [
      '移除 compareDrops.js 和 compareDrops.ts 文件',
    ],
  },
  {
    version: 'v0.0.51',
    date: '2026-07-08 18:00:00',
    changes: [
      '修复重新开始游戏时魂（Soul）消失的问题：魂现在与武器/防具/饰品一样在 resetGame 中被保留',
      '修复切换背包后魂错误保留的问题：EquipSet 新增 weaponSoulId/armorSoulId 字段，每个背包独立保存魂状态',
      '修复切换背包后无法切回1号背包的问题：空数组 truthy 判定导致默认背包缺失',
      '修复 ene59_ba.png 不显示的问题：BOSS_IMAGE_MAP 中难度0缺少键值映射',
      '回退 TitleScreen.tsx 死亡后可继续游戏的错误修复：死亡后不可继续游戏',
    ],
  },
  {
    version: 'v0.0.50',
    date: '2026-07-08 12:00:00',
    changes: [
      '修复 BattleResult.tsx 中掉落物品描述未使用多语言翻译的问题',
      '修复 DropGuideModal.tsx 中 Equipment Drop 搜索不支持多语言的问题（现支持7种语言搜索）',
      '修复 Inventory.tsx 中 Soul 列表和详情弹窗中"属性值""百分比"硬编码中文问题',
      '补充 names.ts 中 70+ 条缺失的 Boss 名称多语言翻译',
      'languageData.ts 新增"属性值"和"百分比"的7语言翻译',
    ],
  },
  {
    version: 'v0.0.34',
    date: '2026-07-07 00:00:00',
    changes: [
      '根据stagemapvar.txt更新StageLvData数据，包含地图1-150完整等级数据',
      '移除地图18-55、80-90、95-104、120-145，地图列表顺序重新编码',
      '更新MAP_ENEMIES_RAW地图键值以匹配新的编码',
      '扩展地图数据至65个地图，添加详细敌人数据和掉落',
      '添加敌人图片映射，支持动态加载敌人图像',
    ],
  },
  {
    version: 'v0.0.33',
    date: '2026-07-07 00:00:00',
    changes: [
      'BOSS图标替换为实际BOSS小图片：bossData.ts中icon字段替换为图片URL',
      'MainScreen.tsx添加renderIcon函数：自动判断icon是URL还是emoji并正确渲染',
      '修复boss-19（彩虹之石）普通模式下缺少图片映射的问题',
    ],
  },
  {
    version: 'v0.0.32',
    date: '2026-07-07 00:00:00',
    changes: [
      '全页面多语言翻译：所有.tsx页面添加t()翻译支持（changelogmodal除外）',
      '存档导出优化：上传存档包含所有背包页装备和语言设置',
      '敌人图片显示：结合enedata.txt为mapdata.ts和bossdata.ts添加敌人/BOSS图片',
      '使用import.meta.glob自动匹配带数字前缀的敌人图片文件',
      '修复languageData.ts重复翻译键导致编译错误',
      '修复Inventory.tsx中t()嵌套调用语法错误',
    ],
  },
  {
    version: 'v0.0.31',
    date: '2026-07-07 00:00:00',
    changes: [
      '修复切换装备页时属性加成计算错误：添加四神宝珠等特殊饰品效果处理',
      '装备确认对话框文案添加多语言翻译支持',
      '装备页面高度从600px调整为750px',
      '删除装备套装管理页面，点击背包数字直接购买',
    ],
  },
  {
    version: 'v0.0.30',
    date: '2026-07-07 00:00:00',
    changes: [
      '修复攻击逻辑+暂停问题：角色攻击→暂停→返回游戏→怪物攻击',
      '修正困难模式下BOSS掉落及掉落显示',
      '标题界面版本号左侧添加GitHub图标，点击跳转开源页面',
      '修复武器倍率计算未生效问题：正确处理attributeRate（基础100%+额外倍率）',
      '翻译键名从日文改为中文',
    ],
  },
  {
    version: 'v0.0.29',
    date: '2026-07-06 00:00:00',
    changes: [
      '修复魂属性叠加问题：切换魂时先清除旧魂属性',
      '修复魂数量管理：安装魂后数量-1，卸载时归还',
      '修复按钮翻译不生效：菜单/奖励/传送/战斗按钮改为使用t()翻译',
      '参考locdata.txt重新设计翻译键名，使用日文作为主key',
      '添加テレポート等缺失翻译',
    ],
  },
  {
    version: 'v0.0.28',
    date: '2026-07-06 00:00:00',
    changes: [
      '修复困难模式和地狱模式难度倍率：参考battlevar.txt的eneLoad()实现',
      '困难模式：HP×10.1、ATK×8.65、EXP×12、Gold×5',
      '地狱模式：HP×100、ATK×86、EXP×22、Gold×9',
      '更新全局VERSION变量为v0.0.27',
      '地狱模式解锁条件调整为1000万级',
      '困难模式开局BP调整为15',
    ],
  },
  {
    version: 'v0.0.26',
    date: '2026-07-06 00:00:00',
    changes: [
      '修复魂安装逻辑：安装魂需要消耗金币，安装后不可重复安装同一魂',
      '修复"ステータス振り分け"缺失翻译键',
      '魂系统完善：根据安装槽位(14=武器,15=防具)决定加成效果',
      '所有界面文字添加多语言翻译支持',
      '装备页面宽度调整为与装备列表一致',
      'title按钮添加翻译',
      'playinfo页面添加翻译',
      '玩家选择页面添加翻译',
    ],
  },
  {
    version: 'v0.0.23',
    date: '2026-07-06 00:00:00',
    changes: [
      '魂系统实现：魂不能购买，安装后不可拆卸，只能被替换',
      '魂加成效果：魂能加成武器/防具的基础属性和倍率（参考weaponPlus/armorPlus）',
      '魂掉率调整：默认4%，装备78号饰品"黄昏水晶"时8%',
      '修复dropManager中soul类型映射错误（type=3）',
      '修复魂列表前4个图错误',
      '玩家信息页面属性改为竖向展示',
      '设置界面存档管理按钮颜色统一',
      '所有界面文字添加多语言翻译支持',
    ],
  },
  {
    version: 'v0.0.22',
    date: '2026-07-06 00:00:00',
    changes: [
      '修复所有BOSS掉落数据：type=3（魂）和type=4（材料）类型修正',
      '创建 useTranslation hook，支持语言实时切换',
      '主菜单添加多语言翻译支持',
      '设置界面重新设计：分为存档管理、语言设置、属性分配预设、缓存管理、关于游戏五个独立板块',
      '修复切换语言时界面文字不更新的问题',
    ],
  },
  {
    version: 'v0.0.21',
    date: '2026-07-04 00:00:00',
    changes: [
      '新增多语言支持（中文、英文、日文、韩文、西班牙文、印尼文）',
      '设置页面添加语言切换功能',
      '修复 boss-0 掉落数据：material-0 和 material-10 改为 soul 类型',
      '修复掉落显示逻辑：普通模式显示第1-3掉落，困难模式显示第4-6掉落，地狱模式显示第7-9掉落',
      '主菜单点击空白区域返回上一级',
      '装备列表点击空白区域返回上一级',
      '设置页面点击空白区域返回上一级',
    ],
  },
  {
    version: 'v0.0.20',
    date: '2026-07-03 23:59:00',
    changes: [
      '已解锁的空饰品槽不再显示锁图标，改为 + 号',
      '装备列表点击卡片弹出详情浮层，购买/装备按钮不触发',
      '战斗 HP 血条位置调整，贴近角色不遮挡名称',
      '手机端战斗 UI 适配优化',
    ],
  },
  {
    version: 'v0.0.19',
    date: '2026-07-03 23:30:00',
    changes: [
      'UUID 只允许修改一次，避免滥用',
      '复制 UUID 按钮点击后显示 ✓ 确认反馈',
      '修复替换装备时重置已分配属性点(stPt)的 Bug',
      '战斗场景角色和敌人位置上移，布局更合理',
    ],
  },
  {
    version: 'v0.0.18',
    date: '2026-07-03 20:00:00',
    changes: [
      '玩家信息展示最高等级时的装备和属性快照',
      '排行榜：老玩家提交无需重复输入名称',
      '检测并自动修复不符合插槽星级限制的饰品',
      '下载存档改为输入 UUID 从云端恢复',
      'PlayerInfo 中显示并可修改用户 UUID',
      '设置页面整合：云存档/属性预设/装备图鉴/更新日志',
    ],
  },
  {
    version: 'v0.0.17',
    date: '2026-07-03 16:00:00',
    changes: [
      'Boss 名称去重：删除 4 对完全重复的 Boss 条目',
      'Boss 名称添加难度后缀：剧情(·初)、硬核(·硬)、地狱(·狱)',
      '购买装备价格递增：每次购买同款+10%，购买5次后为原价150%',
      '排行榜存入 created_at 和 updated_at 时间戳',
      '添加装备掉落图鉴页面，查看装备掉落来源/地图/怪物',
    ],
  },
  {
    version: 'v0.0.13',
    date: '2026-07-03 12:00:00',
    changes: [
      '装备列表添加购买功能，未拥有物品可购买',
      '修复饰品无法重复装备多个同款的问题',
      '武器/防具/饰品列表隐藏无法购买且未拥有的物品',
      '修复 BattleScreen 中 A 标签嵌套导致的 React 警告',
      '优化 localStorage 溢出保护（数据超限时清理旧数据）',
    ],
  },
  {
    version: 'v0.0.12',
    date: '2026-07-03 10:00:00',
    changes: [
      '集成 Supabase 排行榜系统',
      '支持提交成绩和查看在线排行榜',
      '修复 GitHub Pages 部署问题',
    ],
  },
  {
    version: 'v0.0.11',
    date: '2026-07-03 08:00:00',
    changes: [
      '修复了AGI和幸运属性在升级时被重置的问题',
      '修复了属性点加成在rehydrate时丢失的问题',
      '属性分配页面属性点改为横向排列',
      '属性分配页面去除了"请选择强化属性(可以长按)"提示',
      '属性分配页面添加了点击空白区域返回的逻辑',
      '战斗界面顶部添加了掉落率和目标物品显示',
      '修复了金币无法开启饰品插槽7-12的问题',
      '扩展了导出导入功能，包含所有存档数据',
      '调整了Gameover页面布局，游戏说明和按钮一左一右',
    ],
  },
  {
    version: 'v0.0.10',
    date: '2026-07-02 18:00:00',
    changes: [
      '添加了装备套装管理系统',
      '支持保存当前装备配置为套装',
      '支持加载、重命名、删除装备套装',
      '装备套装数据自动保存到本地存储',
    ],
  },
  {
    version: 'v0.0.9',
    date: '2026-07-01 14:00:00',
    changes: [
      '优化了战斗系统',
      '添加了暴击和连击机制',
      '改进了装备系统',
      '添加了饰品栏位解锁功能',
    ],
  },
  {
    version: 'v0.0.1',
    date: '2026-06-30 08:00:00',
    changes: [
      '初始版本发布',
      '基础游戏框架',
      '地图系统',
      '战斗系统',
      '装备系统',
    ],
  },
];

export const ChangelogModal = ({ onClose }: ChangelogModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                LOG
              </div>
              <span className="text-game-secondary font-bold">更新日志</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center text-white text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {changelog.map((entry) => (
            <div key={entry.version} className="bg-[#3d2b6e] rounded-lg border border-[#4a2c7a] overflow-hidden">
              <div className="bg-[#2d1b4e] px-3 py-2 flex items-center justify-between">
                <span className="text-blue-400 font-bold text-sm">{entry.version}</span>
                <span className="text-gray-400 text-xs">{entry.date}</span>
              </div>
              <ul className="p-3 space-y-1">
                {entry.changes.map((change, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-green-400 text-xs mt-1">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#4a2c7a] bg-[#1a0a2e] px-4 py-3">
          <button
            onClick={onClose}
            className="w-full bg-[#5a3c8a] text-white font-bold py-2 rounded-lg hover:bg-[#6a4c9a] transition-colors text-sm"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
