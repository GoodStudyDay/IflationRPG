import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { getCacheSize, formatCacheSize, clearCache } from '@/utils/imageCache';
import { ChangelogModal } from './ChangelogModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [pasteInput, setPasteInput] = useState('');
  const [showPasteInput, setShowPasteInput] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [showPresetPanel, setShowPresetPanel] = useState(false);
  const [editingPreset, setEditingPreset] = useState<number>(0);
  const [cacheSize, setCacheSize] = useState<string>('0 B');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setCacheSize(formatCacheSize(getCacheSize()));
    }
  }, [isOpen]);
  
  const handleClearCache = () => {
    clearCache();
    setCacheSize(formatCacheSize(getCacheSize()));
    setShowConfirmClear(false);
    setImportMsg('缓存已清除！');
    setTimeout(() => setImportMsg(null), 2000);
  };

  const { 
    exportSaveData, 
    importSaveData,
    presets,
    presetNum,
    autoAllocateEnabled,
    setPreset,
    setPresetNum,
    setAutoAllocateEnabled,
  } = useGameStore();

  const handleExport = async () => {
    const data = exportSaveData();
    await navigator.clipboard.writeText(data);
    setImportMsg('存档已复制到剪贴板！');
    setTimeout(() => setImportMsg(null), 2000);
  };

  const handleImport = () => {
    if (!pasteInput.trim()) {
      setImportMsg('请输入存档字符串');
      setTimeout(() => setImportMsg(null), 2000);
      return;
    }
    try {
      importSaveData(pasteInput);
      setImportMsg('存档导入成功！');
      setTimeout(() => {
        setImportMsg(null);
        setShowPasteInput(false);
        setPasteInput('');
        onClose();
      }, 1000);
    } catch {
      setImportMsg('存档格式错误，无法解析');
      setTimeout(() => setImportMsg(null), 2000);
    }
  };

  const handlePresetChange = (index: number, value: number) => {
    const preset = [...presets[editingPreset]];
    preset[index] = Math.max(0, Math.min(100, value));
    setPreset(editingPreset, preset);
  };

  const handleApplyPreset = () => {
    setPresetNum(editingPreset);
    setShowPresetPanel(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-2 mb-4">
          <div className="text-game-secondary font-bold">设置</div>
        </div>

        {showPresetPanel ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowPresetPanel(false)}
                className="text-gray-400 text-sm hover:text-white"
              >
                ← 返回
              </button>
              <div className="text-white font-bold">属性自动分配预设</div>
              <div className="w-16"></div>
            </div>

            <div className="flex gap-2 mb-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setEditingPreset(i)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                    editingPreset === i
                      ? 'bg-[#6a4c9a] text-white'
                      : 'bg-[#3d2b5e] text-gray-300 hover:bg-[#4d3b6e]'
                  }`}
                >
                  预设{i + 1}
                </button>
              ))}
            </div>

            <div className="bg-[#1a0a2e] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">HP</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={presets[editingPreset][0]}
                  onChange={(e) => handlePresetChange(0, parseInt(e.target.value) || 0)}
                  className="w-16 bg-[#2d1b4e] border border-[#4a2c7a] rounded px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-[#6a4c9a]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">攻击</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={presets[editingPreset][1]}
                  onChange={(e) => handlePresetChange(1, parseInt(e.target.value) || 0)}
                  className="w-16 bg-[#2d1b4e] border border-[#4a2c7a] rounded px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-[#6a4c9a]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">防御</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={presets[editingPreset][2]}
                  onChange={(e) => handlePresetChange(2, parseInt(e.target.value) || 0)}
                  className="w-16 bg-[#2d1b4e] border border-[#4a2c7a] rounded px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-[#6a4c9a]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">敏捷</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={presets[editingPreset][3]}
                  onChange={(e) => handlePresetChange(3, parseInt(e.target.value) || 0)}
                  className="w-16 bg-[#2d1b4e] border border-[#4a2c7a] rounded px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-[#6a4c9a]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">幸运</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={presets[editingPreset][4]}
                  onChange={(e) => handlePresetChange(4, parseInt(e.target.value) || 0)}
                  className="w-16 bg-[#2d1b4e] border border-[#4a2c7a] rounded px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-[#6a4c9a]"
                />
              </div>
              <div className="border-t border-[#4a2c7a] pt-2">
                <div className="text-xs text-gray-500">
                  总和: {presets[editingPreset].reduce((a, b) => a + b, 0)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  当前使用: 预设{presetNum + 1}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#1a0a2e] rounded-lg p-3">
              <span className="text-gray-400 text-sm">自动分配开启</span>
              <button
                onClick={() => setAutoAllocateEnabled(!autoAllocateEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoAllocateEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoAllocateEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleApplyPreset}
              className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              应用当前预设
            </button>

            <button
              onClick={() => setShowPresetPanel(false)}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
            >
              返回
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-gray-300 text-sm mb-2">存档管理</div>

            <button
              onClick={handleExport}
              className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              导出存档
            </button>
            <div className="text-xs text-gray-400 px-2 mb-2">将存档编码为字符串并复制到剪贴板</div>

            {!showPasteInput ? (
              <button
                onClick={() => setShowPasteInput(true)}
                className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                导入存档
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  placeholder="在此粘贴存档字符串..."
                  className="w-full h-24 bg-[#1a0a2e] border border-[#4a2c7a] rounded p-2 text-white text-xs resize-none focus:outline-none focus:border-[#6a4c9a]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleImport}
                    className="flex-1 bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    确认导入
                  </button>
                  <button
                    onClick={() => { setShowPasteInput(false); setPasteInput(''); }}
                    className="flex-1 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
            <div className="text-xs text-gray-400 px-2 mb-2">粘贴存档字符串以恢复进度（会覆盖当前进度）</div>

            <div className="border-t border-[#4a2c7a] pt-3 mt-3">
              <div className="text-gray-300 text-sm mb-2">游戏设置</div>

              <button
                onClick={() => setShowPresetPanel(true)}
                className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
              >
                属性自动分配预设
              </button>
              <div className="text-xs text-gray-400 px-2 mb-2">设置战斗结算后属性点自动分配比例</div>
            </div>
            
            <div className="border-t border-[#4a2c7a] pt-3 mt-3">
              <div className="text-gray-300 text-sm mb-2">缓存管理</div>
              
              <div className="bg-[#1a0a2e] rounded-lg p-3 mb-2">
                <div className="text-xs text-gray-400">当前缓存大小</div>
                <div className="text-white font-bold text-lg mt-1">{cacheSize}</div>
              </div>
              
              {!showConfirmClear ? (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  清除缓存
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-red-400 px-2">确定要清除图片缓存吗？存档数据不会受影响。</div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearCache}
                      className="flex-1 bg-red-700 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      确认清除
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="flex-1 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-400 px-2 mt-2">清除后下次加载图片会重新下载</div>
            </div>

            <div className="border-t border-[#4a2c7a] pt-3 mt-3">
              <div className="text-gray-300 text-sm mb-2">关于游戏</div>
              
              <button
                onClick={() => setShowChangelog(true)}
                className="w-full bg-[#4a3c7a] text-white font-bold py-3 rounded-lg hover:bg-[#5a4c8a] transition-colors"
              >
                更新日志
              </button>
              <div className="text-xs text-gray-400 px-2 mb-2">查看游戏版本更新记录</div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
            >
              返回
            </button>
          </div>
        )}
      </div>

      {importMsg && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-bold">
          {importMsg}
        </div>
      )}

      {showChangelog && (
        <ChangelogModal onClose={() => setShowChangelog(false)} />
      )}
    </div>
  );
};