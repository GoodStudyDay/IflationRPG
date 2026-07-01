import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  maxLevel: number;
  maxAttack: number;
  maxCombo: number;
  date: string;
}

const LEADERBOARD_KEY = 'inflation-rpg-leaderboard';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, playerName: '勇者王', maxLevel: 9999, maxAttack: 99999999, maxCombo: 9999, date: '2024-01-15' },
  { rank: 2, playerName: '传说战士', maxLevel: 8888, maxAttack: 88888888, maxCombo: 8888, date: '2024-01-14' },
  { rank: 3, playerName: '暗黑骑士', maxLevel: 7777, maxAttack: 77777777, maxCombo: 7777, date: '2024-01-13' },
  { rank: 4, playerName: '圣光法师', maxLevel: 6666, maxAttack: 66666666, maxCombo: 6666, date: '2024-01-12' },
  { rank: 5, playerName: '暗影刺客', maxLevel: 5555, maxAttack: 55555555, maxCombo: 5555, date: '2024-01-11' },
  { rank: 6, playerName: '元素大师', maxLevel: 4444, maxAttack: 44444444, maxCombo: 4444, date: '2024-01-10' },
  { rank: 7, playerName: '战神', maxLevel: 3333, maxAttack: 33333333, maxCombo: 3333, date: '2024-01-09' },
  { rank: 8, playerName: '守护者', maxLevel: 2222, maxAttack: 22222222, maxCombo: 2222, date: '2024-01-08' },
  { rank: 9, playerName: '冒险者', maxLevel: 1111, maxAttack: 11111111, maxCombo: 1111, date: '2024-01-07' },
  { rank: 10, playerName: '新手村村民', maxLevel: 100, maxAttack: 100000, maxCombo: 100, date: '2024-01-06' },
];

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Leaderboard = ({ isOpen, onClose }: LeaderboardProps) => {
  const { player, Highlv, HighCombo } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [playerRank, setPlayerRank] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen]);

  const loadLeaderboard = () => {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      } else {
        setLeaderboard(MOCK_LEADERBOARD);
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(MOCK_LEADERBOARD));
      }
    } catch {
      setLeaderboard(MOCK_LEADERBOARD);
    }
    checkPlayerRank();
  };

  const checkPlayerRank = () => {
    const existingEntry = leaderboard.find(e => e.playerName === playerName || e.playerName === '匿名玩家');
    if (existingEntry) {
      setPlayerRank(existingEntry.rank);
    } else {
      const rank = leaderboard.findIndex(e => Highlv > e.maxLevel) + 1 || leaderboard.length + 1;
      setPlayerRank(rank);
    }
  };

  const submitScore = () => {
    if (!playerName.trim()) {
      alert('请输入玩家名称');
      return;
    }

    const newEntry: LeaderboardEntry = {
      rank: 0,
      playerName: playerName.trim(),
      maxLevel: Highlv,
      maxAttack: player.attack,
      maxCombo: HighCombo,
      date: new Date().toISOString().split('T')[0],
    };

    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.maxLevel - a.maxLevel)
      .slice(0, 50)
      .map((e, i) => ({ ...e, rank: i + 1 }));

    setLeaderboard(newLeaderboard);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(newLeaderboard));
    setShowNameInput(false);
    setSubmitted(true);
    checkPlayerRank();

    try {
      fetch('https://api.example.com/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
    } catch {
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#2d1b4e] border-2 border-[#5a3c8a] rounded-lg w-[90%] max-w-lg max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-[#1a0a2e] border-b-2 border-[#5a3c8a] px-4 py-3">
          <div className="text-game-secondary font-bold text-lg text-center">🏆 排行榜</div>
        </div>

        {showNameInput ? (
          <div className="p-4">
            <div className="text-white text-sm mb-3 text-center">输入你的玩家名称</div>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="请输入玩家名称..."
              maxLength={20}
              className="w-full bg-[#1a0a2e] border border-[#5a3c8a] rounded-lg p-3 text-white text-center focus:outline-none focus:border-[#6a4c9a]"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={submitScore}
                className="flex-1 bg-green-700 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                提交
              </button>
              <button
                onClick={() => setShowNameInput(false)}
                className="flex-1 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-300 text-sm">
                你的最高等级: <span className="text-yellow-400 font-bold">{Highlv}</span>
              </div>
              {!submitted ? (
                <button
                  onClick={() => setShowNameInput(true)}
                  className="bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  提交成绩
                </button>
              ) : (
                <div className="text-green-400 text-xs">✓ 已提交</div>
              )}
            </div>

            {playerRank && (
              <div className="bg-[#3d2b6e] rounded-lg p-3 mb-4 text-center">
                <div className="text-gray-300 text-xs">你的排名</div>
                <div className="text-2xl font-bold text-yellow-400">#{playerRank}</div>
              </div>
            )}

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
                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-green-400">
                      LV.{entry.maxLevel.toLocaleString()}
                    </div>
                    <div className="text-red-400">
                      ATK.{entry.maxAttack.toLocaleString()}
                    </div>
                    <div className="text-blue-400">
                      {entry.maxCombo}连击
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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