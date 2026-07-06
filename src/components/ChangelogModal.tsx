interface ChangelogModalProps {
  onClose: () => void;
}

const changelog = [
  {
    version: 'v0.0.27',
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
