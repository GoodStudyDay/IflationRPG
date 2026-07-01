import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [pasteInput, setPasteInput] = useState('');
  const [showPasteInput, setShowPasteInput] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const { exportSaveData, importSaveData } = useGameStore();

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4">
        <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-2 mb-4">
          <div className="text-game-secondary font-bold">设置</div>
        </div>

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

          <button
            onClick={onClose}
            className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
          >
            返回
          </button>
        </div>
      </div>

      {importMsg && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-bold">
          {importMsg}
        </div>
      )}
    </div>
  );
};