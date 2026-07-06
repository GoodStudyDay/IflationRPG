import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { getSupabase } from '@/lib/supabase';
import { useTranslation } from '@/hooks/useTranslation';

interface LeaderboardRow {
  id: string;
  user_id: string;
  display_name: string;
  score: number;
  created_at: string;
  updated_at: string;
}

interface LeaderboardDisplayEntry {
  rank: number;
  playerName: string;
  score: number;
  date: string;
}

const STORAGE_KEY = 'inflation-rpg-user-id';

function getUserOrCreateName(): string | null {
  const stored = localStorage.getItem('inflation-rpg-player-name');
  return stored || null;
}

function getOrCreateUserId(): string {
  let userId = localStorage.getItem(STORAGE_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }
  return userId;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Leaderboard = ({ isOpen, onClose }: LeaderboardProps) => {
  const { Highlv } = useGameStore();
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState<LeaderboardDisplayEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);

      if (error) throw error;

      const entries: LeaderboardDisplayEntry[] = (data || []).map((row: LeaderboardRow, index: number) => ({
        rank: index + 1,
        playerName: row.display_name,
        score: row.score,
        date: row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : '',
      }));

      setLeaderboard(entries);

      const existingName = getUserOrCreateName();
      if (existingName) {
        const rank = entries.findIndex(e => e.playerName === existingName);
        setPlayerRank(rank >= 0 ? rank + 1 : null);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen, loadLeaderboard]);

  const submitScore = async (name?: string) => {
    const submitName = (name || playerName).trim();
    if (!submitName) {
        alert(t('请输入玩家名称'));
        return;
      }

    const userId = getOrCreateUserId();
    
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data: existing, error: fetchError } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        if (Highlv > existing.score) {
          const { error: updateError } = await supabase
            .from('leaderboard')
            .update({
              display_name: submitName,
              score: Highlv,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          if (updateError) throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from('leaderboard')
          .insert({
            user_id: userId,
            display_name: submitName,
            score: Highlv,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }

      localStorage.setItem('inflation-rpg-player-name', submitName);
      setShowNameInput(false);
      setSubmitted(true);
      await loadLeaderboard();
    } catch (err) {
      console.error('Failed to submit score:', err);
      alert(t('提交失败，请稍后再试'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClick = () => {
    const savedName = getUserOrCreateName();
    if (savedName) {
      // 老玩家：直接用已保存的名称提交，不需要再输入
      setPlayerName(savedName);
      submitScore(savedName);
    } else {
      // 新玩家：需要输入名称
      setShowNameInput(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#2d1b4e] border-2 border-[#5a3c8a] rounded-lg w-[90%] max-w-lg max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-[#1a0a2e] border-b-2 border-[#5a3c8a] px-4 py-3">
          <div className="text-game-secondary font-bold text-lg text-center">🏆 {t('排行榜')}</div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400 text-sm">{t('加载中...')}</div>
          </div>
        )}

        {!loading && showNameInput ? (
          <div className="p-4">
            <div className="text-white text-sm mb-3 text-center">{t('输入你的玩家名称')}</div>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t('请输入玩家名称...')}
              maxLength={20}
              className="w-full bg-[#1a0a2e] border border-[#5a3c8a] rounded-lg p-3 text-white text-center focus:outline-none focus:border-[#6a4c9a]"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => submitScore()}
                className="flex-1 bg-green-700 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                {t('提交')}
              </button>
              <button
                onClick={() => setShowNameInput(false)}
                className="flex-1 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition-colors"
              >
                {t('取消')}
              </button>
            </div>
          </div>
        ) : !loading ? (
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-300 text-sm">
                {t('你的最高等级')}: <span className="text-yellow-400 font-bold">{Highlv}</span>
              </div>
              {!submitted ? (
                <button
                  onClick={handleSubmitClick}
                  className="bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t('提交成绩')}
                </button>
              ) : (
                <div className="text-green-400 text-xs">✓ {t('已提交')}</div>
              )}
            </div>

            {playerRank && (
              <div className="bg-[#3d2b6e] rounded-lg p-3 mb-4 text-center">
                <div className="text-gray-300 text-xs">{t('你的排名')}</div>
                <div className="text-2xl font-bold text-yellow-400">#{playerRank}</div>
              </div>
            )}

            {leaderboard.length === 0 ? (
              <div className="text-center text-gray-400 py-8">{t('暂无排行数据')}</div>
            ) : (
              <div className="space-y-1">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      index < 3
                        ? entry.rank === 1
                          ? 'bg-[#4a3c2a]'
                          : entry.rank === 2
                          ? 'bg-[#4a4a4a]'
                          : 'bg-[#4a3a2a]'
                        : 'bg-[#1a0a2e]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-black' :
                        entry.rank === 2 ? 'bg-gray-400 text-black' :
                        entry.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-[#3d2b6e] text-white'
                      }`}>
                        {entry.rank}
                      </div>
                      <div className="text-white text-sm font-medium truncate max-w-[120px]">
                        {entry.playerName}
                      </div>
                    </div>
                    <div className="text-green-400 text-xs">
                      LV.{entry.score.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        <div className="bg-[#1a0a2e] border-t-2 border-[#5a3c8a] px-4 py-3">
          <button
            onClick={onClose}
            className="w-full bg-[#5a3c8a] text-white font-bold py-2 rounded-lg hover:bg-[#6a4c9a] transition-colors"
          >
            {t('关闭')}
          </button>
        </div>
      </div>
    </div>
  );
};
