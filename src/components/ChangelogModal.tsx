interface ChangelogModalProps {
  onClose: () => void;
}

const changelog = [
  {
    version: 'v0.0.17',
    date: '2026-07-03',
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
    date: '2026-07-03',
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
    date: '2026-07-03',
    changes: [
      '集成 Supabase 排行榜系统',
      '支持提交成绩和查看在线排行榜',
      '修复 GitHub Pages 部署问题',
    ],
  },
  {
    version: 'v0.0.11',
    date: '2026-07-03',
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
    date: '2026-07-02',
    changes: [
      '添加了装备套装管理系统',
      '支持保存当前装备配置为套装',
      '支持加载、重命名、删除装备套装',
      '装备套装数据自动保存到本地存储',
    ],
  },
  {
    version: 'v0.0.9',
    date: '2026-07-01',
    changes: [
      '优化了战斗系统',
      '添加了暴击和连击机制',
      '改进了装备系统',
      '添加了饰品栏位解锁功能',
    ],
  },
  {
    version: 'v0.0.1',
    date: '2026-06-30',
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
