import { useState, useMemo } from 'react';
import { equipmentData, getRecipeForEquipment, getEquipmentByTypeAndListnum } from '@/data/equipment';
import { enemiesData } from '@/data/enemies';
import { MAP_LIST, getMapEnemies } from '@/data/mapData';
import { BOSS_DATA } from '@/data/bossData';
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
    enemies: { name: string; dropRate: number }[];
  }[];
}

type FilterType = 'all' | 'weapon' | 'armor' | 'accessory' | 'soul' | 'material';

export const DropGuideModal = ({ isOpen, onClose }: DropGuideModalProps) => {
  const { getEquipName } = useEquipmentName();
  const { translateBossName, translateMapName } = useNames();
  const { t } = useTranslation();
  const { inventory } = useGameStore();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const dropEntries = useMemo(() => {
    // Build a map of equipmentId -> DropEntry
    const entryMap = new Map<string, DropEntry>();

    const getOrCreate = (equipment: Equipment): DropEntry => {
      if (!entryMap.has(equipment.id)) {
        entryMap.set(equipment.id, { equipment, sources: [] });
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
              mapName: map.name,
              mapId: map.id,
              enemies: [{ name: enemy.name, dropRate: drop.dropRate }],
            });
          }
        }
      }
    }

    // 3. Boss drops
    for (const boss of BOSS_DATA) {
      const drops = boss.drops || [];
      for (const drop of drops) {
        if (!drop || !drop.equipmentId) continue;
        const eq = equipmentData.find(e => e.id === drop.equipmentId);
        if (!eq) continue;
        const entry = getOrCreate(eq);
        const source = entry.sources.find(s => s.type === 'boss' && s.mapName === 'Boss战');
        if (source) {
          source.enemies.push({ name: boss.name, dropRate: drop.dropRate });
        } else {
          entry.sources.push({
            type: 'boss',
            mapName: 'Boss战',
            enemies: [{ name: boss.name, dropRate: drop.dropRate }],
          });
        }
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
    if (filterType !== 'all') {
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
                        {entry.sources.length}{t('个掉落来源')} · {entry.sources.reduce((sum, s) => sum + s.enemies.length, 0)}{t('种怪物')}
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
                            source.type === 'general' ? 'bg-blue-900/50 text-blue-300' :
                            'bg-green-900/50 text-green-300'
                          }`}>
                            {source.type === 'boss' ? t('Boss') : source.type === 'general' ? t('通用') : t('地图')}
                          </span>
                          <span className="text-white text-sm font-bold">{translateMapName(source.mapName)}</span>
                        </div>
                        <div className="space-y-0.5">
                          {source.enemies.map((enemy, ei) => (
                            <div key={ei} className="flex justify-between text-xs">
                              <span className="text-gray-300">{source.type === 'boss' ? translateBossName(enemy.name) : enemy.name}</span>
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
