import { useMemo, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { equipmentData } from '@/data/equipment';
import { getCollection } from '@/utils/collectionStorage';
import { SpriteIcon } from './SpriteIcon';
import { useEquipmentName } from '@/hooks/useEquipmentName';
import { useTranslation } from '@/hooks/useTranslation';

const UUID_KEY = 'inflation-rpg-user-id';
const UUID_MODIFIED_KEY = 'inflation-rpg-uuid-modified';
const PASSWORD_KEY = 'inflation-rpg-password';

function getUUID(): string {
  let uuid = localStorage.getItem(UUID_KEY);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(UUID_KEY, uuid);
  }
  return uuid;
}

function setUUID(uuid: string) {
  localStorage.setItem(UUID_KEY, uuid);
  localStorage.setItem(UUID_MODIFIED_KEY, '1');
}

function hasModifiedUuid(): boolean {
  return localStorage.getItem(UUID_MODIFIED_KEY) === '1';
}

function getPassword(): string {
  return localStorage.getItem(PASSWORD_KEY) || '';
}

function savePassword(password: string) {
  localStorage.setItem(PASSWORD_KEY, password);
}

interface PlayerInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerInfo = ({ isOpen, onClose }: PlayerInfoProps) => {
  const { getEquipName } = useEquipmentName();
  const { t } = useTranslation();
  const { player, Highlv, HighCombo, HighDamage, winbattle, losebattle, newgamecount, peakSnapshot } = useGameStore();

  const [uuid, setUuid] = useState(getUUID);
  const [uuidModified, setUuidModified] = useState(hasModifiedUuid);
  const [isEditingUuid, setIsEditingUuid] = useState(false);
  const [editUuidValue, setEditUuidValue] = useState(uuid);
  const [copied, setCopied] = useState(false);
  
  const [password, setPassword] = useState(getPassword);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editPasswordValue, setEditPasswordValue] = useState(password);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const collection = useMemo(() => getCollection(), []);

  const handleSaveUuid = () => {
    const trimmed = editUuidValue.trim();
    if (trimmed && trimmed.length >= 8) {
      setUUID(trimmed);
      setUuid(trimmed);
      setUuidModified(true);
    }
    setIsEditingUuid(false);
  };

  const handleSavePassword = () => {
    const trimmed = editPasswordValue.trim();
    setPassword(trimmed);
    savePassword(trimmed);
    setIsEditingPassword(false);
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 1500);
  };

  const stats = useMemo(() => {
    const weapons = equipmentData.filter(e => e.type === 'weapon');
    const armors = equipmentData.filter(e => e.type === 'armor');
    const accessories = equipmentData.filter(e => e.type === 'accessory');

    const collectedWeapons = collection.filter(i => i.equipmentId.startsWith('weapon-')).length;
    const collectedArmors = collection.filter(i => i.equipmentId.startsWith('armor-')).length;
    const collectedAccessories = collection.filter(i => i.equipmentId.startsWith('accessory-')).length;

    return {
      weaponTotal: weapons.length,
      armorTotal: armors.length,
      accessoryTotal: accessories.length,
      collectedWeaponCount: collectedWeapons,
      collectedArmorCount: collectedArmors,
      collectedAccessoryCount: collectedAccessories,
    };
  }, [collection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#2d1b4e] border-2 border-[#5a3c8a] rounded-lg w-[90%] max-w-lg max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-[#1a0a2e] border-b-2 border-[#5a3c8a] px-4 py-3">
          <div className="text-game-secondary font-bold text-lg text-center">👤 {t('玩家信息')}</div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[65vh]">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#1a0a2e] rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">{t('当前等级')}</div>
              <div className="text-xl font-bold text-yellow-400">{player.level}</div>
            </div>
            <div className="bg-[#1a0a2e] rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">{t('最高等级')}</div>
              <div className="text-xl font-bold text-green-400">{Highlv}</div>
            </div>
            <div className="bg-[#1a0a2e] rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">{t('最高攻击力')}</div>
              <div className="text-xl font-bold text-red-400">{HighDamage.toLocaleString()}</div>
            </div>
            <div className="bg-[#1a0a2e] rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs">{t('最高连击')}</div>
              <div className="text-xl font-bold text-blue-400">{HighCombo}</div>
            </div>
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3 mb-4">
            <div className="text-gray-300 text-sm font-bold mb-2 flex items-center justify-between">
              <span>{t('玩家 UUID')}</span>
              {!isEditingUuid && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { navigator.clipboard.writeText(uuid); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                    className={`text-xs underline ${copied ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-white'}`}
                  >
                    {copied ? '✓' : t('复制')}
                  </button>
                  {!uuidModified && (
                    <button
                      onClick={() => { setIsEditingUuid(true); setEditUuidValue(uuid); }}
                      className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                    >
                      {t('修改')}
                    </button>
                  )}
                </div>
              )}
            </div>
            {isEditingUuid ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editUuidValue}
                  onChange={e => setEditUuidValue(e.target.value)}
                  className="flex-1 bg-[#0d0520] border border-[#5a3c8a] text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-yellow-400 font-mono"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveUuid(); if (e.key === 'Escape') setIsEditingUuid(false); }}
                />
                <button
                  onClick={handleSaveUuid}
                  className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded hover:bg-green-500"
                >
                  保存
                </button>
                <button
                  onClick={() => setIsEditingUuid(false)}
                  className="bg-gray-600 text-white text-xs px-3 py-1 rounded hover:bg-gray-500"
                >
                  取消
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-400 font-mono break-all">{uuid}</div>
            )}
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3 mb-4">
            <div className="text-gray-300 text-sm font-bold mb-2 flex items-center justify-between">
              <span>密码</span>
              {!isEditingPassword && (
                <button
                  onClick={() => { setIsEditingPassword(true); setEditPasswordValue(password); }}
                  className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                >
                  变更
                </button>
              )}
            </div>
            {isEditingPassword ? (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={editPasswordValue}
                  onChange={e => setEditPasswordValue(e.target.value)}
                  placeholder="输入新密码"
                  className="flex-1 bg-[#0d0520] border border-[#5a3c8a] text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-yellow-400"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleSavePassword(); if (e.key === 'Escape') setIsEditingPassword(false); }}
                />
                <button
                  onClick={handleSavePassword}
                  className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded hover:bg-green-500"
                >
                  保存
                </button>
                <button
                  onClick={() => setIsEditingPassword(false)}
                  className="bg-gray-600 text-white text-xs px-3 py-1 rounded hover:bg-gray-500"
                >
                  取消
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400">{password ? '●●●●●●' : '未设置'}</div>
                {passwordSaved && <span className="text-xs text-green-400">✓ 已保存</span>}
              </div>
            )}
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3 mb-4">
            <div className="text-gray-300 text-sm font-bold mb-2">最高等级时属性</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">HP：</span>
                <span className="text-red-400 font-bold">{(peakSnapshot || player).hp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">ATK：</span>
                <span className="text-orange-400 font-bold">{(peakSnapshot || player).attack.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">DEF：</span>
                <span className="text-blue-400 font-bold">{(peakSnapshot || player).defense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">AGI：</span>
                <span className="text-green-400 font-bold">{(peakSnapshot || player).agility.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">LCK：</span>
                <span className="text-purple-400 font-bold">{(peakSnapshot || player).luck.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3 mb-4">
            <div className="text-gray-300 text-sm font-bold mb-2">最高等级时装备</div>
            <div className="grid grid-cols-4 gap-2">
              {(() => {
                const src = (peakSnapshot || player) as any;
                return (
                  <>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-[#3d2b6e] rounded-lg flex items-center justify-center mb-1">
                        {src.equippedWeapon?.x !== undefined ? <SpriteIcon type="weapon" x={src.equippedWeapon.x} y={src.equippedWeapon.y} size="medium" /> : <span className="text-lg">📦</span>}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{src.equippedWeapon ? getEquipName(src.equippedWeapon.name) : '无'}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-[#3d2b6e] rounded-lg flex items-center justify-center mb-1">
                        {src.equippedArmor?.x !== undefined ? <SpriteIcon type="armor" x={src.equippedArmor.x} y={src.equippedArmor.y} size="medium" /> : <span className="text-lg">📦</span>}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{src.equippedArmor ? getEquipName(src.equippedArmor.name) : '无'}</div>
                    </div>
                    {(src.equippedAccessories || []).filter(Boolean).map((acc: any, idx: number) => (
                      <div key={idx} className="text-center">
                        <div className="w-10 h-10 mx-auto bg-[#3d2b6e] rounded-lg flex items-center justify-center mb-1">
                          {acc?.x !== undefined ? <SpriteIcon type="accessory" x={acc.x} y={acc.y} size="medium" image={acc.image} /> : <span className="text-lg">📦</span>}
                        </div>
                        <div className="text-xs text-gray-400 truncate">{acc ? getEquipName(acc.name) : '无'}</div>
                      </div>
                    ))}
                    {((src.equippedAccessories || []).length === 0) && [0, 1].map(i => (
                      <div key={i} className="text-center">
                        <div className="w-10 h-10 mx-auto bg-[#3d2b6e] rounded-lg flex items-center justify-center mb-1"><span className="text-lg">📦</span></div>
                        <div className="text-xs text-gray-400">无</div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3 mb-4">
            <div className="text-gray-300 text-sm font-bold mb-2">装备收集统计</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>⚔️</span>
                  <span className="text-gray-400 text-sm">武器</span>
                </div>
                <div className="text-white font-bold">
                  [{stats.collectedWeaponCount}/{stats.weaponTotal}]
                </div>
              </div>
              <div className="h-2 bg-[#3d2b6e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${(stats.collectedWeaponCount / stats.weaponTotal) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🛡️</span>
                  <span className="text-gray-400 text-sm">防具</span>
                </div>
                <div className="text-white font-bold">
                  [{stats.collectedArmorCount}/{stats.armorTotal}]
                </div>
              </div>
              <div className="h-2 bg-[#3d2b6e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${(stats.collectedArmorCount / stats.armorTotal) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>💍</span>
                  <span className="text-gray-400 text-sm">饰品</span>
                </div>
                <div className="text-white font-bold">
                  [{stats.collectedAccessoryCount}/{stats.accessoryTotal}]
                </div>
              </div>
              <div className="h-2 bg-[#3d2b6e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${(stats.collectedAccessoryCount / stats.accessoryTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a0a2e] rounded-lg p-3">
            <div className="text-gray-300 text-sm font-bold mb-2">游戏统计</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-green-400 font-bold">{winbattle}</div>
                <div className="text-xs text-gray-500">胜利</div>
              </div>
              <div>
                <div className="text-red-400 font-bold">{losebattle}</div>
                <div className="text-xs text-gray-500">失败</div>
              </div>
              <div>
                <div className="text-yellow-400 font-bold">{newgamecount}</div>
                <div className="text-xs text-gray-500">新游戏</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a0a2e] border-t-2 border-[#5a3c8a] px-4 py-3">
          <button
            onClick={onClose}
            className="w-full bg-[#5a3c8a] text-white font-bold py-2 rounded-lg hover:bg-[#6a4c9a] transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};