import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

interface StatusPanelProps {
  onClose: () => void;
}

export const StatusPanel = ({ onClose }: StatusPanelProps) => {
  const { player, allocateStPt } = useGameStore();
  
  const [pendingHp, setPendingHp] = useState(0);
  const [pendingAtk, setPendingAtk] = useState(0);
  const [pendingDef, setPendingDef] = useState(0);
  const [pendingAgi, setPendingAgi] = useState(0);
  const [pendingLuc, setPendingLuc] = useState(0);
  
  const [applied, setApplied] = useState(true);
  
  const frameRef = useRef(0);
  const holdTimerRef = useRef<number | null>(null);
  const holdTypeRef = useRef<'hp' | 'atk' | 'def' | 'agi' | 'luc'>('hp');
  const holdFrameRef = useRef(0);
  const holdModeRef = useRef<'normal' | 'half' | 'all'>('normal');
  
  const remainingStPt = player.stPt || 0;
  const pendingTotal = pendingHp + pendingAtk + pendingDef + pendingAgi + pendingLuc;
  const availableStPt = remainingStPt - pendingTotal;
  
  const getBonusText = (_base: number, pending: number, perPoint: number) => {
    if (pending === 0) return '';
    return `(+${pending * perPoint})`;
  };
  
  const handleAddPoint = (type: 'hp' | 'atk' | 'def' | 'agi' | 'luc', amount: number = 1) => {
    const currentRemaining = player.stPt || 0;
    const currentPending = pendingHp + pendingAtk + pendingDef + pendingAgi + pendingLuc;
    const currentAvailable = currentRemaining - currentPending;
    
    if (currentAvailable <= 0) {
      handleMouseUp();
      return;
    }
    
    const actualAmount = Math.min(amount, currentAvailable);
    
    switch (type) {
      case 'hp':
        setPendingHp(prev => prev + actualAmount);
        break;
      case 'atk':
        setPendingAtk(prev => prev + actualAmount);
        break;
      case 'def':
        setPendingDef(prev => prev + actualAmount);
        break;
      case 'agi':
        setPendingAgi(prev => prev + actualAmount);
        break;
      case 'luc':
        setPendingLuc(prev => prev + actualAmount);
        break;
    }
    setApplied(false);
  };
  
  const handleHalf = (type: 'hp' | 'atk' | 'def' | 'agi' | 'luc') => {
    if (availableStPt <= 0) return;
    const halfAmount = Math.floor((availableStPt + 1) / 2);
    handleAddPoint(type, halfAmount);
  };
  
  const handleAll = (type: 'hp' | 'atk' | 'def' | 'agi' | 'luc') => {
    if (availableStPt <= 0) return;
    handleAddPoint(type, availableStPt);
  };
  
  const handleCancel = () => {
    setPendingHp(0);
    setPendingAtk(0);
    setPendingDef(0);
    setPendingAgi(0);
    setPendingLuc(0);
    setApplied(true);
  };
  
  const handleConfirm = () => {
    if (pendingHp > 0) allocateStPt('hp', pendingHp);
    if (pendingAtk > 0) allocateStPt('atk', pendingAtk);
    if (pendingDef > 0) allocateStPt('def', pendingDef);
    if (pendingAgi > 0) allocateStPt('agi', pendingAgi);
    if (pendingLuc > 0) allocateStPt('luc', pendingLuc);
    
    setPendingHp(0);
    setPendingAtk(0);
    setPendingDef(0);
    setPendingAgi(0);
    setPendingLuc(0);
    setApplied(true);
  };
  
  const handleReturn = () => {
    if (!applied && pendingTotal > 0) {
      if (window.confirm('未按决定按钮，属性不会被强化，确定返回吗？')) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  const handleMouseDown = (type: 'hp' | 'atk' | 'def' | 'agi' | 'luc') => {
    if (availableStPt <= 0) return;
    holdTypeRef.current = type;
    holdModeRef.current = 'normal';
    holdFrameRef.current = 0;
    frameRef.current = 0;
    
    holdTimerRef.current = window.setInterval(() => {
      frameRef.current++;
      holdFrameRef.current++;
      
      const currentPending = pendingHp + pendingAtk + pendingDef + pendingAgi + pendingLuc;
      const currentRemaining = player.stPt || 0;
      
      let addAmount = 0;
      
      if (holdFrameRef.current <= 12) {
        if (holdFrameRef.current === 0 || holdFrameRef.current === 5 || holdFrameRef.current === 9 || holdFrameRef.current === 11) {
          addAmount = 1;
        }
      } else if (currentPending + 50000 < currentRemaining && holdFrameRef.current >= 1000) {
        addAmount = 20311;
      } else if (currentPending + 40000 < currentRemaining && holdFrameRef.current >= 1000) {
        addAmount = 15111;
      } else if (currentPending + 30000 < currentRemaining && holdFrameRef.current >= 1000) {
        addAmount = 10011;
      } else if (currentPending + 25000 < currentRemaining && holdFrameRef.current >= 1000) {
        addAmount = 5011;
      } else if (currentPending + 10000 < currentRemaining && holdFrameRef.current >= 1000) {
        addAmount = 3011;
      } else if (currentPending + 6000 < currentRemaining && holdFrameRef.current >= 1000) {
        addAmount = 2051;
      } else if (currentPending + 3000 < currentRemaining && holdFrameRef.current >= 1000) {
        addAmount = 1511;
      } else if (currentPending + 5000 < currentRemaining && holdFrameRef.current >= 1000) {
        addAmount = 1311;
      } else if (currentPending + 2000 < currentRemaining && holdFrameRef.current >= 900) {
        addAmount = 1111;
      } else if (currentPending + 1500 < currentRemaining && holdFrameRef.current >= 800) {
        addAmount = 901;
      } else if (currentPending + 800 < currentRemaining && holdFrameRef.current >= 700) {
        addAmount = 771;
      } else if (currentPending + 700 < currentRemaining && holdFrameRef.current >= 650) {
        addAmount = 651;
      } else if (currentPending + 600 < currentRemaining && holdFrameRef.current >= 600) {
        addAmount = 531;
      } else if (currentPending + 500 < currentRemaining && holdFrameRef.current >= 550) {
        addAmount = 421;
      } else if (currentPending + 400 < currentRemaining && holdFrameRef.current >= 500) {
        addAmount = 351;
      } else if (currentPending + 340 < currentRemaining && holdFrameRef.current >= 460) {
        addAmount = 291;
      } else if (currentPending + 340 < currentRemaining && holdFrameRef.current >= 420) {
        addAmount = 251;
      } else if (currentPending + 300 < currentRemaining && holdFrameRef.current >= 380) {
        addAmount = 221;
      } else if (currentPending + 250 < currentRemaining && holdFrameRef.current >= 340) {
        addAmount = 191;
      } else if (currentPending + 200 < currentRemaining && holdFrameRef.current >= 300) {
        addAmount = 161;
      } else if (currentPending + 150 < currentRemaining && holdFrameRef.current >= 270) {
        addAmount = 131;
      } else if (currentPending + 120 < currentRemaining && holdFrameRef.current >= 240) {
        addAmount = 101;
      } else if (currentPending + 90 < currentRemaining && holdFrameRef.current >= 210) {
        addAmount = 85;
      } else if (currentPending + 80 < currentRemaining && holdFrameRef.current >= 190) {
        addAmount = 74;
      } else if (currentPending + 70 < currentRemaining && holdFrameRef.current >= 170) {
        addAmount = 63;
      } else if (currentPending + 60 < currentRemaining && holdFrameRef.current >= 150) {
        addAmount = 51;
      } else if (currentPending + 50 < currentRemaining && holdFrameRef.current >= 130) {
        addAmount = 41;
      } else if (currentPending + 40 < currentRemaining && holdFrameRef.current >= 120) {
        addAmount = 35;
      } else if (currentPending + 30 < currentRemaining && holdFrameRef.current >= 110) {
        addAmount = 27;
      } else if (currentPending + 30 < currentRemaining && holdFrameRef.current >= 100) {
        addAmount = 21;
      } else if (currentPending + 20 < currentRemaining && holdFrameRef.current >= 90) {
        addAmount = 17;
      } else if (currentPending + 20 < currentRemaining && holdFrameRef.current >= 80) {
        addAmount = 14;
      } else if (currentPending + 18 < currentRemaining && holdFrameRef.current >= 75) {
        addAmount = 13;
      } else if (currentPending + 15 < currentRemaining && holdFrameRef.current >= 70) {
        addAmount = 11;
      } else if (currentPending + 15 < currentRemaining && holdFrameRef.current >= 65) {
        addAmount = 10;
      } else if (currentPending + 15 < currentRemaining && holdFrameRef.current >= 60) {
        addAmount = 9;
      } else if (currentPending + 15 < currentRemaining && holdFrameRef.current >= 55) {
        addAmount = 7;
      } else if (currentPending + 10 < currentRemaining && holdFrameRef.current >= 50) {
        addAmount = 6;
      } else if (currentPending + 8 < currentRemaining && holdFrameRef.current >= 45) {
        addAmount = 5;
      } else if (currentPending + 7 < currentRemaining && holdFrameRef.current >= 40) {
        addAmount = 4;
      } else if (currentPending + 5 < currentRemaining && holdFrameRef.current >= 35) {
        addAmount = 3;
      } else if (currentPending + 3 < currentRemaining && holdFrameRef.current >= 30) {
        addAmount = 2;
      } else {
        addAmount = 1;
      }
      
      if (addAmount > 0) {
        handleAddPoint(holdTypeRef.current, addAmount);
      }
    }, 20);
  };
  
  const handleMouseUp = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);
  
  const expPercent = (player.exp / player.expToNextLevel) * 100;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#87a8c9] border-4 border-[#2a4a6a] rounded-lg w-[90%] max-w-lg overflow-hidden">
        <div className="bg-[#5a7a9a] px-4 py-3 text-center text-white font-bold text-lg">
          属性分配
        </div>
        
        <div className="p-4">
          <div className="text-center text-gray-800 text-sm mb-2">
            将属性点分配后，可以强化属性
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#4a6a8a] rounded flex items-center justify-center text-2xl">
              🧙
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-[#1a3a5a]">
                {player.level}LV
              </div>
              <div className="text-sm text-[#3a5a7a]">
                Money {player.gold}G
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#3a5a7a] mb-1">
              <span>EXP</span>
              <span>{player.exp}/{player.expToNextLevel}</span>
            </div>
            <div className="h-2 bg-[#5a7a9a] rounded overflow-hidden">
              <div 
                className="h-full bg-[#2a6a8a] transition-all duration-300"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between bg-[#6a8aaa] rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg">HP</span>
                <span className="text-white">
                  {player.maxHp}{getBonusText(player.maxHp, pendingHp, 5)}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleHalf('hp')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Half
                </button>
                <button
                  onClick={() => handleAll('hp')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[#6a8aaa] rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg">ATK</span>
                <span className="text-white">
                  {player.attack}{getBonusText(player.attack, pendingAtk, 3)}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleHalf('atk')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Half
                </button>
                <button
                  onClick={() => handleAll('atk')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[#6a8aaa] rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg">DEF</span>
                <span className="text-white">
                  {player.defense}{getBonusText(player.defense, pendingDef, 3)}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleHalf('def')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Half
                </button>
                <button
                  onClick={() => handleAll('def')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[#6a8aaa] rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg">AGI</span>
                <span className="text-white">
                  {player.agility}{getBonusText(player.agility, pendingAgi, 2)}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleHalf('agi')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Half
                </button>
                <button
                  onClick={() => handleAll('agi')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[#6a8aaa] rounded px-3 py-2">
              <div className="flex flex-col items-start gap-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg">LUC</span>
                  <span className="text-white">
                    {player.luck}{getBonusText(player.luck, pendingLuc, 1)}
                  </span>
                </div>
                <div className="text-xs text-[#9ab8d8]">暴击率、所得物品、金额取决于LUC</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleHalf('luc')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Half
                </button>
                <button
                  onClick={() => handleAll('luc')}
                  disabled={availableStPt <= 0}
                  className="px-3 py-1 bg-[#4a6a8a] text-white text-xs font-bold rounded hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  All
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-[#7a9abb] rounded px-3 py-2 mb-4">
            <div className="text-center text-[#2a4a6a] text-xs mb-1">属性点</div>
            <div className="text-center text-xl font-bold text-white">
              {availableStPt}
              {pendingTotal > 0 && <span className="text-sm text-[#ff6666]">(-{pendingTotal})</span>}
            </div>
            <div className="text-center text-xs text-[#4a6a8a] mt-1">升级后可获得属性点</div>
          </div>
          
          <div className="text-center text-xs text-[#4a6a8a] mb-3">
            请选择强化属性(可以长按)
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              onMouseDown={() => handleMouseDown('hp')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleMouseDown('hp')}
              onTouchEnd={handleMouseUp}
              disabled={availableStPt <= 0}
              className="flex-1 bg-[#5a7a9a] text-white font-bold py-3 rounded-lg hover:bg-[#4a6a8a] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              HP
            </button>
            <button
              onMouseDown={() => handleMouseDown('atk')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleMouseDown('atk')}
              onTouchEnd={handleMouseUp}
              disabled={availableStPt <= 0}
              className="flex-1 bg-[#5a7a9a] text-white font-bold py-3 rounded-lg hover:bg-[#4a6a8a] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              ATK
            </button>
            <button
              onMouseDown={() => handleMouseDown('def')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleMouseDown('def')}
              onTouchEnd={handleMouseUp}
              disabled={availableStPt <= 0}
              className="flex-1 bg-[#5a7a9a] text-white font-bold py-3 rounded-lg hover:bg-[#4a6a8a] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              DEF
            </button>
            <button
              onMouseDown={() => handleMouseDown('agi')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleMouseDown('agi')}
              onTouchEnd={handleMouseUp}
              disabled={availableStPt <= 0}
              className="flex-1 bg-[#5a7a9a] text-white font-bold py-3 rounded-lg hover:bg-[#4a6a8a] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              AGI
            </button>
            <button
              onMouseDown={() => handleMouseDown('luc')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleMouseDown('luc')}
              onTouchEnd={handleMouseUp}
              disabled={availableStPt <= 0}
              className="flex-1 bg-[#5a7a9a] text-white font-bold py-3 rounded-lg hover:bg-[#4a6a8a] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              LUC
            </button>
          </div>
          
          <div className="flex gap-3 mb-3">
            <button
              onClick={handleCancel}
              disabled={applied}
              className="flex-1 bg-[#6a8aaa] text-white font-bold py-3 rounded-lg hover:bg-[#5a7a9a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={pendingTotal === 0}
              className="flex-1 bg-[#4a6a8a] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a7a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              决定
            </button>
          </div>
          
          <button
            onClick={handleReturn}
            className="w-full bg-[#4a6a8a] text-white font-bold py-3 rounded-lg hover:bg-[#3a5a7a]"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};
