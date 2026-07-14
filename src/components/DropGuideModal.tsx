import { useState, useMemo } from 'react';
import { equipmentData, getRecipeForEquipment, getEquipmentByTypeAndListnum } from '@/data/equipment';
import { enemiesData } from '@/data/enemies';
import { MAP_LIST, getMapEnemies } from '@/data/mapData';
import { BOSS_DATA, getBossById } from '@/data/bossData';
import { SpriteIcon } from './SpriteIcon';
import type { Equipment } from '@/types';
import { useEquipmentName } from '@/hooks/useEquipmentName';
import { useNames } from '@/hooks/useNames';
import { useTranslation } from '@/hooks/useTranslation';
import { useGameStore } from '@/stores/gameStore';
import { equipmentNameTranslations } from '@/data/equipmentNames';
import { bossNameTranslations, mapNameTranslations } from '@/data/names';

interface DropGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DropEntry {
  equipment: Equipment;
  sources: {
    type: 'map' | 'boss' | 'general';
    mapName: string;
    mapId?: number;
    enemies: { name: string; dropRate: number; modes?: string[] }[];
  }[];
  isSynthesis?: boolean;
  isOthers?: boolean;
}

type FilterType = 'all' | 'weapon' | 'armor' | 'accessory' | 'soul' | 'material' | 'synthesis' | 'others';

export const DropGuideModal = ({ isOpen, onClose }: DropGuideModalProps) => {
  const { getEquipName } = useEquipmentName();
  const { translateBossName, translateMapName } = useNames();
  const { t } = useTranslation();
  const { inventory } = useGameStore();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const dropEntries = useMemo(() => {
    const entryMap = new Map<string, DropEntry>();

    const getOrCreate = (equipment: Equipment): DropEntry => {
      if (!entryMap.has(equipment.id)) {
        entryMap.set(equipment.id, { equipment, sources: [], isSynthesis: false, isOthers: false });
      }
      return entryMap.get(equipment.id)!;
    };

    // 1. Generic enemies (no specific map)
    for (const enemy of enemiesData) {
      for (const drop of enemy.drops) {
        if (!drop) continue;
        const eq = equipmentData.find(e => e.id === drop.equipmentId);
        if (!eq) continue;
        const entry = getOrCreate(eq);
        const source = entry.sources.find(s => s.type === 'general' && s.mapName === '通用遭遇');
        if (source) {
          source.enemies.push({ name: enemy.name, dropRate: drop.dropRate });
        } else {
          entry.sources.push({
            type: 'general',
            mapName: '通用遭遇',
            enemies: [{ name: enemy.name, dropRate: drop.dropRate }],
          });
        }
      }
    }

    // 2. Map-specific enemies
    for (const map of MAP_LIST) {
      const enemies = getMapEnemies(map.id);
      for (const enemy of enemies) {
        const drops = enemy.drops || [];
        for (const drop of drops) {
          if (!drop || !drop.equipmentId) continue;
          const eq = equipmentData.find(e => e.id === drop.equipmentId);
          if (!eq) continue;
          const entry = getOrCreate(eq);
          const source = entry.sources.find(s => s.type === 'map' && s.mapId === map.id);
          if (source) {
            source.enemies.push({ name: enemy.name, dropRate: drop.dropRate });
          } else {
            entry.sources.push({
              type: 'map',
              mapName: translateMapName(map.name),
              mapId: map.id,
              enemies: [{ name: enemy.name, dropRate: drop.dropRate }],
            });
          }
        }
      }
    }

    // 3. Boss drops (normal mode + hardmode + hell mode)
    for (const boss of BOSS_DATA) {
      const modes = [
        { hardmode: 0, mapId: 1, modeLabel: t('普通') },
        { hardmode: 1, mapId: 1, modeLabel: t('困难') },
        { hardmode: 2, mapId: 61, modeLabel: t('地狱') },
      ];

      const modeDrops: Record<string, string[]> = {};
      for (const mode of modes) {
        const modifiedBoss = getBossById(boss.bossId, mode.hardmode, mode.mapId);
        if (!modifiedBoss) continue;
        const drops = modifiedBoss.drops || [];
        const dropIds = drops.filter(d => d && d.equipmentId).map(d => d!.equipmentId);
        modeDrops[mode.modeLabel] = dropIds;
      }

      const normalDrops = modeDrops[t('普通')] || [];
      const hasDifferentDrops = modes.some(mode => {
        const drops = modeDrops[mode.modeLabel] || [];
        if (drops.length !== normalDrops.length) return true;
        return drops.some(d => !normalDrops.includes(d));
      });

      if (!hasDifferentDrops) {
        const modifiedBoss = getBossById(boss.bossId, 0, 1);
        if (!modifiedBoss) continue;
        const drops = modifiedBoss.drops || [];
        for (const drop of drops) {
          if (!drop || !drop.equipmentId) continue;
          const eq = equipmentData.find(e => e.id === drop.equipmentId);
          if (!eq) continue;
          const entry = getOrCreate(eq);
          const source = entry.sources.find(s => s.type === 'boss' && s.mapName === 'Boss战');
          if (source) {
            const existingEnemy = source.enemies.find(e => e.name === boss.name);
            if (existingEnemy) {
              if (!existingEnemy.modes) existingEnemy.modes = [];
            } else {
              source.enemies.push({ name: boss.name, dropRate: drop.dropRate, modes: [] });
            }
          } else {
            entry.sources.push({
              type: 'boss',
              mapName: 'Boss战',
              enemies: [{ name: boss.name, dropRate: drop.dropRate, modes: [] }],
            });
          }
        }
      } else {
        for (const mode of modes) {
          const modifiedBoss = getBossById(boss.bossId, mode.hardmode, mode.mapId);
          if (!modifiedBoss) continue;
          const drops = modifiedBoss.drops || [];
          for (const drop of drops) {
            if (!drop || !drop.equipmentId) continue;
            const eq = equipmentData.find(e => e.id === drop.equipmentId);
            if (!eq) continue;
            const entry = getOrCreate(eq);
            const source = entry.sources.find(s => s.type === 'boss' && s.mapName === 'Boss战');
            if (source) {
              const existingEnemy = source.enemies.find(e => e.name === boss.name);
              if (existingEnemy) {
                if (!existingEnemy.modes) existingEnemy.modes = [];
                if (!existingEnemy.modes.includes(mode.modeLabel)) {
                  existingEnemy.modes.push(mode.modeLabel);
                }
              } else {
                source.enemies.push({ name: boss.name, dropRate: drop.dropRate, modes: [mode.modeLabel] });
              }
            } else {
              entry.sources.push({
                type: 'boss',
                mapName: 'Boss战',
                enemies: [{ name: boss.name, dropRate: drop.dropRate, modes: [mode.modeLabel] }],
              });
            }
          }
        }
      }
    }

    // 3.5 Random drops from battledrop.txt
    const randomDrops = [
      { equipmentId: 'accessory-118', dropRate: 0.008 },
      { equipmentId: 'accessory-105', dropRate: 0.012 },
      { equipmentId: 'weapon-0', dropRate: 0.012 },
      { equipmentId: 'armor-0', dropRate: 0.012 },
    ];
    for (const rd of randomDrops) {
      const eq = equipmentData.find(e => e.id === rd.equipmentId);
      if (!eq) continue;
      const entry = getOrCreate(eq);
      const source = entry.sources.find(s => s.type === 'general' && s.mapName === t('随机掉落'));
      if (!source) {
        entry.sources.push({
          type: 'general',
          mapName: t('随机掉落'),
          enemies: [{ name: t('随机掉落'), dropRate: rd.dropRate }],
        });
      }
    }

    // 3.6 Hardmode map enemies (from enedata.txt)
    const hardmodeMapDrops = [
      { equipmentId: 'accessory-117', dropRate: 0.017, mapIds: [61, 62, 63, 64, 65, 66, 67, 68] },
    ];
    for (const hd of hardmodeMapDrops) {
      const eq = equipmentData.find(e => e.id === hd.equipmentId);
      if (!eq) continue;
      const entry = getOrCreate(eq);
      for (const mapId of hd.mapIds) {
        const map = MAP_LIST.find(m => m.id === mapId);
        if (!map) continue;
        const source = entry.sources.find(s => s.type === 'map' && s.mapId === mapId);
        if (source) {
          source.enemies.push({ name: t('困难模式敌人'), dropRate: hd.dropRate });
        } else {
          entry.sources.push({
            type: 'map',
            mapName: translateMapName(map.name),
            mapId: mapId,
            enemies: [{ name: t('困难模式敌人'), dropRate: hd.dropRate }],
          });
        }
      }
    }

    // 4. Craftable equipment (has recipe but no drop sources)
    for (const eq of equipmentData) {
      const typeMap: Record<string, string> = {
        weapon: 'weapon', armor: 'armor', accessory: 'accessory',
        soul: 'soul', material: 'material',
      };
      const recipe = getRecipeForEquipment(
        typeMap[eq.type] || 'material',
        eq.listnum || 0
      );
      if (recipe) {
        const entry = getOrCreate(eq);
        entry.isSynthesis = true;
        const hasDropSource = entry.sources.some(s => 
          s.type === 'map' || s.type === 'boss' || (s.type === 'general' && s.mapName !== '合成')
        );
        if (!hasDropSource) {
          entry.sources.push({
            type: 'general',
            mapName: t('合成'),
            enemies: [],
          });
        }
      }
    }

    // 5. Others: equipment that cannot be bought, dropped, or crafted
    for (const eq of equipmentData) {
      if (entryMap.has(eq.id)) continue;
      
      const typeMap: Record<string, string> = {
        weapon: 'weapon', armor: 'armor', accessory: 'accessory',
        soul: 'soul', material: 'material',
      };
      const recipe = getRecipeForEquipment(
        typeMap[eq.type] || 'material',
        eq.listnum || 0
      );
      
      if (eq.price === 0 && !recipe) {
        entryMap.set(eq.id, {
          equipment: eq,
          sources: [{ type: 'general', mapName: t('其他'), enemies: [] }],
          isSynthesis: false,
          isOthers: true,
        });
      }
    }

    return Array.from(entryMap.values())
      .sort((a, b) => {
        if (a.equipment.type !== b.equipment.type) {
          const order = ['weapon', 'armor', 'accessory', 'soul', 'material'];
          return order.indexOf(a.equipment.type) - order.indexOf(b.equipment.type);
        }
        return (a.equipment.listnum || 0) - (b.equipment.listnum || 0);
      });
  }, []);

  const filteredEntries = useMemo(() => {
    let entries = dropEntries;
    if (filterType === 'synthesis') {
      entries = entries.filter(e => e.isSynthesis);
    } else if (filterType === 'others') {
      entries = entries.filter(e => e.isOthers);
    } else if (filterType !== 'all') {
      entries = entries.filter(e => e.equipment.type === filterType);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      entries = entries.filter(e => {
        // Check equipment name - raw + all translations
        const eqTrans = equipmentNameTranslations[e.equipment.name];
        const eqNameMatch = e.equipment.name.toLowerCase().includes(term) ||
          (eqTrans && Object.values(eqTrans).some(v => v.toLowerCase().includes(term)));
        if (eqNameMatch) return true;

        return e.sources.some(s => {
          // Check map name - raw + all translations
          const mapTrans = mapNameTranslations[s.mapName];
          const mapNameMatch = s.mapName.toLowerCase().includes(term) ||
            (mapTrans && Object.values(mapTrans).some(v => v.toLowerCase().includes(term)));
          if (mapNameMatch) return true;

          // Check enemy names - raw + all translations
          return s.enemies.some(en => {
            const bossTrans = bossNameTranslations[en.name];
            return en.name.toLowerCase().includes(term) ||
              (bossTrans && Object.values(bossTrans).some(v => v.toLowerCase().includes(term)));
          });
        });
      });
    }
    return entries;
  }, [dropEntries, filterType, searchTerm]);

  if (!isOpen) return null;

  const filterTypes: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('全部') },
    { key: 'weapon', label: t('武器') },
    { key: 'armor', label: t('防具') },
    { key: 'accessory', label: t('饰品') },
    { key: 'soul', label: t('魂') },
    { key: 'material', label: t('材料') },
    { key: 'synthesis', label: t('合成') },
    { key: 'others', label: t('其他') },
  ];

  const formatRate = (rate: number) => `${(rate * 100).toFixed(1)}%`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={e => e.stopPropagation()}>
      <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[95%] max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="text-game-secondary font-bold">{t('装备掉落图鉴')}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Search & Filter */}
        <div className="px-3 py-2 space-y-2 shrink-0">
          <input
            type="text"
            placeholder={t('搜索装备名称、地图或怪物...')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a0a2e] border border-[#4a2c7a] rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#6a4c9a]"
          />
          <div className="flex gap-1 flex-wrap">
            {filterTypes.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  filterType === f.key
                    ? 'bg-[#6a4c9a] text-white'
                    : 'bg-[#3d2b5e] text-gray-400 hover:bg-[#4d3b6e]'
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="text-gray-500 text-xs self-center ml-auto">
                {t('共')} {filteredEntries.length} {t('件')}
              </span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredEntries.map(entry => {
            const isExpanded = expandedId === entry.equipment.id;
            return (
              <div
                key={entry.equipment.id}
                className="bg-[#3d2b6e] rounded-lg border border-[#4a2c7a] overflow-hidden"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : entry.equipment.id)}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#4d3b7e] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#2d1b4e] rounded flex items-center justify-center shrink-0">
                    {['weapon', 'armor', 'accessory', 'material', 'soul'].includes(entry.equipment.type) ? (
                      <SpriteIcon
                        type={entry.equipment.type as 'weapon' | 'armor' | 'accessory' | 'material' | 'soul'}
                        x={entry.equipment.x}
                        y={entry.equipment.y}
                        size="small"
                        image={entry.equipment.type === 'accessory' ? entry.equipment.image : 
                               entry.equipment.type === 'soul' ? entry.equipment.image : undefined}
                        bit32={entry.equipment.type === 'weapon' ? entry.equipment.bit32 : 
                               entry.equipment.type === 'armor' ? entry.equipment.bougu32png : 
                               entry.equipment.type === 'material' ? entry.equipment.bit32 : undefined}
                      />
                    ) : (
                      <span className="text-xl">{entry.equipment.icon || '📦'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">{getEquipName(entry.equipment.name)}</div>
                    <div className="text-gray-400 text-xs">
                        {entry.isOthers ? t('无法购买/掉落/合成') : 
                         entry.isSynthesis && entry.sources.length === 1 && entry.sources[0].mapName === '合成' ? t('仅可合成') :
                         `${entry.sources.length}${t('个来源')} · ${entry.sources.reduce((sum, s) => sum + s.enemies.length, 0)}${t('种怪物')}`}
                      </div>
                  </div>
                  <span className="text-gray-500 text-lg shrink-0 transition-transform" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    ▶
                  </span>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#4a2c7a] bg-[#2d1b4e]">
                    {entry.sources.map((source, si) => (
                      <div key={si} className="px-3 py-2 border-b border-[#4a2c7a]/50 last:border-b-0">
                        <div className="flex items-center gap-1 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                            source.type === 'boss' ? 'bg-red-900/50 text-red-300' :
                            source.mapName === '合成' ? 'bg-purple-900/50 text-purple-300' :
                            source.mapName === '其他' ? 'bg-gray-900/50 text-gray-300' :
                            source.mapName === '随机掉落' ? 'bg-yellow-900/50 text-yellow-300' :
                            source.type === 'general' ? 'bg-blue-900/50 text-blue-300' :
                            'bg-green-900/50 text-green-300'
                          }`}>
                            {source.type === 'boss' ? t('Boss') : 
                             source.mapName === '合成' ? t('合成') :
                             source.mapName === '其他' ? t('其他') :
                             source.mapName === '随机掉落' ? t('随机掉落') :
                             source.type === 'general' ? t('通用') : t('地图')}
                          </span>
                          <span className="text-white text-sm font-bold">{translateMapName(source.mapName)}</span>
                        </div>
                        <div className="space-y-0.5">
                          {source.enemies.map((enemy, ei) => (
                            <div key={ei} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-300">{source.type === 'boss' ? translateBossName(enemy.name) : t(enemy.name)}</span>
                                {enemy.modes && enemy.modes.length > 0 && (
                                  <div className="flex gap-0.5">
                                    {enemy.modes.map((mode, mi) => (
                                      <span key={mi} className={`px-1 rounded text-[10px] font-bold ${
                                        mode === t('普通') ? 'bg-gray-700 text-gray-300' :
                                        mode === t('困难') ? 'bg-orange-900/50 text-orange-300' :
                                        mode === t('地狱') ? 'bg-red-900/50 text-red-300' :
                                        'bg-blue-900/50 text-blue-300'
                                      }`}>
                                        {mode}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-yellow-400 font-mono">{formatRate(enemy.dropRate)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {(() => {
                      const typeMap: Record<string, string> = {
                        weapon: 'weapon', armor: 'armor', accessory: 'accessory',
                        soul: 'soul', material: 'material',
                      };
                      const recipe = getRecipeForEquipment(
                        typeMap[entry.equipment.type] || 'material',
                        entry.equipment.listnum || 0
                      );
                      if (!recipe) return null;

                      return (
                        <div className="px-3 py-2 border-t border-[#4a2c7a]">
                          <div className="text-game-secondary font-bold text-xs mb-1">{t('合成材料')}</div>
                          <div className="bg-[#1a0a2e] rounded p-1.5 space-y-0.5">
                            {recipe.materials.map((m, idx) => {
                              const matEq = getEquipmentByTypeAndListnum(m.type, m.listnum);
                              const owned = matEq ? inventory.find(i => i.equipmentId === matEq.id)?.quantity || 0 : 0;
                              const hasEnough = owned >= m.quantity;
                              return (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <span className={hasEnough ? 'text-gray-300' : 'text-red-400'}>
                                    {matEq ? getEquipName(matEq.name) : '???'}
                                  </span>
                                  <span className={hasEnough ? 'text-gray-400' : 'text-red-400'}>
                                    {owned}/{m.quantity}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}

          {filteredEntries.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              {t('未找到匹配的掉落信息')}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#4a2c7a] bg-[#1a0a2e] px-4 py-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#5a3c8a] text-white font-bold py-2 rounded-lg hover:bg-[#6a4c9a] transition-colors text-sm"
          >
            {t('close_button')}
          </button>
        </div>
      </div>
    </div>
  );
};
