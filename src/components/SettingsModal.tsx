import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { getSupabase } from '@/lib/supabase';
import { getMemoryCacheSize, clearCache } from '@/utils/imageCache';
import { ChangelogModal } from './ChangelogModal';
import { DropGuideModal } from './DropGuideModal';
import { LANGUAGES } from '@/data/languageData';
import { useTranslation } from '@/hooks/useTranslation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActiveSection = 'main' | 'cloud' | 'language' | 'preset' | 'cache' | 'about';

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { t } = useTranslation();
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [editingPreset, setEditingPreset] = useState<number>(0);
  const [cacheSize, setCacheSize] = useState<string>('0 B');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showDropGuide, setShowDropGuide] = useState(false);
  const [showDownloadUuidInput, setShowDownloadUuidInput] = useState(false);
  const [downloadUuid, setDownloadUuid] = useState('');
  const [cloudPassword, setCloudPassword] = useState('');
  const [activeSection, setActiveSection] = useState<ActiveSection>('main');

  const handlePresetChange = (index: number, value: number) => {
    const preset = [...presets[editingPreset]];
    preset[index] = Math.max(0, Math.min(100, value));
    setPreset(editingPreset, preset);
  };

  const handleApplyPreset = () => {
    setPresetNum(editingPreset);
    setActiveSection('main');
  };

  const getUserInfo = () => {
    const userId = localStorage.getItem('inflation-rpg-user-id') || crypto.randomUUID();
    if (!localStorage.getItem('inflation-rpg-user-id')) {
      localStorage.setItem('inflation-rpg-user-id', userId);
    }
    const displayName = localStorage.getItem('inflation-rpg-player-name') || 'Player';
    return { userId, displayName };
  };
  
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  useEffect(() => {
    if (isOpen) {
      setCacheSize(formatSize(getMemoryCacheSize()));
      setActiveSection('main');
    }
  }, [isOpen]);
  
  const handleClearCache = () => {
    clearCache();
    setCacheSize(formatSize(getMemoryCacheSize()));
    setShowConfirmClear(false);
    setImportMsg(t('缓存已清除！'));
    setTimeout(() => setImportMsg(null), 2000);
  };

  const { 
    exportSaveData, 
    importSaveData,
    Highlv,
    presets,
    presetNum,
    autoAllocateEnabled,
    setPreset,
    setPresetNum,
    setAutoAllocateEnabled,
    language,
    setLanguage,
  } = useGameStore();

  const handleCloudUpload = async () => {
    const storedPassword = localStorage.getItem('inflation-rpg-password') || '';
    if (!storedPassword) {
      setImportMsg(t('请先设置密码！'));
      setTimeout(() => setImportMsg(null), 2000);
      return;
    }
    
    if (!cloudPassword) {
      setImportMsg(t('请输入密码！'));
      setTimeout(() => setImportMsg(null), 2000);
      return;
    }
    
    if (cloudPassword !== storedPassword) {
      setImportMsg(t('密码错误！'));
      setTimeout(() => setImportMsg(null), 2000);
      return;
    }
    
    setCloudLoading(true);
    try {
      const data = exportSaveData();
      const { userId, displayName } = getUserInfo();
      const supabase = getSupabase();
      
      const savePayload = {
        stateData: data,
        timestamp: new Date().toISOString(),
        passwordHash: storedPassword ? btoa(storedPassword) : '',
      };
      
      const { data: existing, error: fetchError } = await supabase
        .from('player_saves')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (existing) {
        const { error } = await supabase
          .from('player_saves')
          .update({
            save_data: savePayload,
            display_name: displayName,
            score: Highlv,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('player_saves')
          .insert({
            user_id: userId,
            display_name: displayName,
            save_data: savePayload,
            score: Highlv,
          });
        if (error) throw error;
      }
      
      setImportMsg(t('存档已上传到云端！'));
      setTimeout(() => setImportMsg(null), 2000);
    } catch (err) {
      console.error('Cloud upload failed:', err);
      setImportMsg(t('上传失败，请检查网络连接'));
      setTimeout(() => setImportMsg(null), 3000);
    } finally {
      setCloudLoading(false);
    }
  };

  const handleCloudDownload = async (targetUuid?: string) => {
    if (!cloudPassword) {
      setImportMsg(t('请输入密码！'));
      setTimeout(() => setImportMsg(null), 2000);
      return;
    }
    
    setCloudLoading(true);
    try {
      const finalUuid = targetUuid || downloadUuid.trim();
      if (!finalUuid) {
        setImportMsg(t('请输入有效的 UUID'));
        setTimeout(() => setImportMsg(null), 2000);
        return;
      }
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('player_saves')
        .select('save_data')
        .eq('user_id', finalUuid)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data || !data.save_data) {
        setImportMsg(t('云端没有找到存档'));
        setTimeout(() => setImportMsg(null), 2000);
        return;
      }
      
      const saveData = data.save_data as any;
      const storedHash = saveData.passwordHash || '';
      
      if (storedHash && storedHash !== btoa(cloudPassword)) {
        setImportMsg(t('密码错误！'));
        setTimeout(() => setImportMsg(null), 2000);
        return;
      }
      
      const stateData = saveData.stateData || '';
      
      if (!stateData) {
        setImportMsg(t('云端存档数据为空'));
        setTimeout(() => setImportMsg(null), 2000);
        return;
      }
      
      importSaveData(stateData);
      setImportMsg(t('存档已从云端下载并恢复！'));
      setTimeout(() => {
        setImportMsg(null);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Cloud download failed:', err);
      setImportMsg(t('下载失败，请检查网络连接'));
      setTimeout(() => setImportMsg(null), 3000);
    } finally {
      setCloudLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderSectionHeader = (title: string) => (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => setActiveSection('main')}
        className="text-gray-400 text-sm hover:text-white"
      >
        ← {t('戻る')}
      </button>
      <div className="text-white font-bold">{title}</div>
      <div className="w-16"></div>
    </div>
  );

  const renderMainSection = () => (
    <div className="space-y-3">
      <button
        onClick={() => setActiveSection('cloud')}
        className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
      >
        {t('存档管理')}
      </button>
      <div className="text-xs text-gray-400 px-2 mb-2">{t('上传存档到云端或下载存档')}</div>

      <button
        onClick={() => setActiveSection('language')}
        className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
      >
        {t('语言设置')}
      </button>
      <div className="text-xs text-gray-400 px-2 mb-2">{t('切换游戏语言')}</div>

      <button
        onClick={() => setActiveSection('preset')}
        className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
      >
        {t('属性分配预设')}
      </button>
      <div className="text-xs text-gray-400 px-2 mb-2">{t('设置战斗结算后属性点自动分配比例')}</div>

      <button
        onClick={() => setActiveSection('cache')}
        className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
      >
        {t('缓存管理')}
      </button>
      <div className="text-xs text-gray-400 px-2 mb-2">{t('管理游戏图片缓存')}</div>

      <button
        onClick={() => setActiveSection('about')}
        className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
      >
        {t('关于游戏')}
      </button>
      <div className="text-xs text-gray-400 px-2 mb-2">{t('查看更新日志和装备图鉴')}</div>

      <button
        onClick={onClose}
        className="w-full bg-[#5a3c8a] text-white font-bold py-3 rounded-lg hover:bg-[#6a4c9a] transition-colors"
      >
        {t('閉じる')}
      </button>
    </div>
  );

  const renderCloudSection = () => (
    <div className="space-y-3">
      {renderSectionHeader(t('存档管理'))}

      <div className="bg-[#1a0a2e] rounded-lg p-3">
        <div className="text-xs text-gray-400 mb-2">{t('密码')}</div>
        <input
          type="password"
          value={cloudPassword}
          onChange={e => setCloudPassword(e.target.value)}
          placeholder={t('输入密码')}
          className="w-full bg-[#0d0520] border border-[#5a3c8a] text-white text-sm px-3 py-2 rounded focus:outline-none focus:border-blue-400"
        />
      </div>

      <button
        onClick={handleCloudUpload}
        disabled={cloudLoading}
        className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {cloudLoading ? t('处理中...') : t('上传存档')}
      </button>
      <div className="text-xs text-gray-400 px-2 mb-2">{t('将当前存档上传到云端保存')}</div>

      {!showDownloadUuidInput ? (
        <button
          onClick={() => setShowDownloadUuidInput(true)}
          disabled={cloudLoading}
          className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {t('下载存档')}
        </button>
      ) : (
        <div className="bg-[#1a0a2e] rounded-lg p-3 space-y-2">
          <div className="text-xs text-gray-400">{t('请输入要下载的存档 UUID：')}</div>
          <input
            type="text"
            value={downloadUuid}
            onChange={e => setDownloadUuid(e.target.value)}
            placeholder={t('粘贴 UUID...')}
            className="w-full bg-[#0d0520] border border-[#5a3c8a] text-white text-sm px-3 py-2 rounded focus:outline-none focus:border-blue-400 font-mono"
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') handleCloudDownload();
              if (e.key === 'Escape') setShowDownloadUuidInput(false);
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleCloudDownload()}
              disabled={cloudLoading || !downloadUuid.trim()}
              className="flex-1 bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
            >
              {cloudLoading ? t('下载中') : t('确认下载')}
            </button>
            <button
              onClick={() => { setShowDownloadUuidInput(false); setDownloadUuid(''); }}
              className="flex-1 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm"
            >
              {t('取消')}
            </button>
          </div>
        </div>
      )}
      <div className="text-xs text-gray-400 px-2 mb-2">{t('从云端下载存档并恢复进度（会覆盖当前进度）')}</div>
    </div>
  );

  const renderLanguageSection = () => (
    <div className="space-y-3">
      {renderSectionHeader(t('语言设置'))}

      <div className="bg-[#1a0a2e] rounded-lg p-3 mb-2">
        <div className="text-xs text-gray-400 mb-2">{t('选择语言')}</div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="w-full bg-[#2d1b4e] border border-[#4a2c7a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6a4c9a]"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name['zh-Hans']} ({lang.name.en})
            </option>
          ))}
        </select>
      </div>

      <div className="text-xs text-gray-400 px-2">{t('语言更改会立即生效，无需重新启动游戏')}</div>
    </div>
  );

  const renderPresetSection = () => (
    <div className="space-y-3">
      {renderSectionHeader(t('属性分配预设'))}

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
            {t('预设')}{i + 1}
          </button>
        ))}
      </div>

      <div className="bg-[#1a0a2e] rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">{t('HP')}</span>
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
          <span className="text-gray-400 text-sm">{t('攻击')}</span>
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
          <span className="text-gray-400 text-sm">{t('防御')}</span>
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
          <span className="text-gray-400 text-sm">{t('敏捷')}</span>
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
          <span className="text-gray-400 text-sm">{t('幸运')}</span>
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
            {t('总和')}: {presets[editingPreset].reduce((a, b) => a + b, 0)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t('当前使用')}: {t('预设')}{presetNum + 1}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#1a0a2e] rounded-lg p-3">
        <span className="text-gray-400 text-sm">{t('自动分配开启')}</span>
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
        {t('应用当前预设')}
      </button>
    </div>
  );

  const renderCacheSection = () => (
    <div className="space-y-3">
      {renderSectionHeader(t('缓存管理'))}

      <div className="bg-[#1a0a2e] rounded-lg p-3 mb-2">
        <div className="text-xs text-gray-400">{t('当前缓存大小')}</div>
        <div className="text-white font-bold text-lg mt-1">{cacheSize}</div>
      </div>
      
      {!showConfirmClear ? (
        <button
          onClick={() => setShowConfirmClear(true)}
          className="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors"
        >
          {t('清除缓存')}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-red-400 px-2">{t('确定要清除图片缓存吗？存档数据不会受影响。')}</div>
          <div className="flex gap-2">
            <button
              onClick={handleClearCache}
              className="flex-1 bg-red-700 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              {t('确认清除')}
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              className="flex-1 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm"
            >
              {t('キャンセル')}
            </button>
          </div>
        </div>
      )}
      <div className="text-xs text-gray-400 px-2 mt-2">{t('清除后下次加载图片会重新下载')}</div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-3">
      {renderSectionHeader(t('关于游戏'))}
      
      <button
        onClick={() => setShowDropGuide(true)}
        className="w-full bg-[#6a3c7a] text-white font-bold py-3 rounded-lg hover:bg-[#7a4c8a] transition-colors"
      >
        {t('装备掉落图鉴')}
      </button>
      <div className="text-xs text-gray-400 px-2 mb-2">{t('查看所有装备的掉落来源、地图和怪物')}</div>
      
      <button
        onClick={() => setShowChangelog(true)}
        className="w-full bg-[#4a3c7a] text-white font-bold py-3 rounded-lg hover:bg-[#5a4c8a] transition-colors"
      >
        {t('更新日志')}
      </button>
      <div className="text-xs text-gray-400 px-2 mb-2">{t('查看游戏版本更新记录')}</div>
    </div>
  );

  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div 
          className="bg-[#2d1b4e] border-2 border-[#4a2c7a] rounded-lg w-[90%] max-w-md p-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="bg-[#1a0a2e] border-b-2 border-[#4a2c7a] px-4 py-2 mb-4">
          <div className="text-game-secondary font-bold">{t('オプション')}</div>
        </div>

        {activeSection === 'main' && renderMainSection()}
        {activeSection === 'cloud' && renderCloudSection()}
        {activeSection === 'language' && renderLanguageSection()}
        {activeSection === 'preset' && renderPresetSection()}
        {activeSection === 'cache' && renderCacheSection()}
        {activeSection === 'about' && renderAboutSection()}
      </div>

      {importMsg && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-bold">
          {importMsg}
        </div>
      )}

      {showChangelog && (
        <ChangelogModal onClose={() => setShowChangelog(false)} />
      )}

      {showDropGuide && (
        <DropGuideModal isOpen={showDropGuide} onClose={() => setShowDropGuide(false)} />
      )}
    </div>
  );
};