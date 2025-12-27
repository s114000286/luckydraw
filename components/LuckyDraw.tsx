
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { shuffleArray } from '../utils/helpers';

interface Props {
  participants: Participant[];
}

const LuckyDraw: React.FC<Props> = ({ participants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentName, setCurrentName] = useState('準備好了嗎？');
  const [winners, setWinners] = useState<string[]>([]);
  const [repeatable, setRepeatable] = useState(false);
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setAvailableNames(participants.map(p => p.name));
  }, [participants]);

  const startDraw = () => {
    const list = repeatable ? participants.map(p => p.name) : availableNames;
    
    if (list.length === 0) {
      alert('名單已抽完！');
      return;
    }

    setIsDrawing(true);
    let speed = 50;
    let count = 0;

    const tick = () => {
      const randomIndex = Math.floor(Math.random() * list.length);
      setCurrentName(list[randomIndex]);
      
      count++;
      if (count < 30) {
        timerRef.current = window.setTimeout(tick, speed);
      } else if (count < 45) {
        speed += 20;
        timerRef.current = window.setTimeout(tick, speed);
      } else if (count < 55) {
        speed += 50;
        timerRef.current = window.setTimeout(tick, speed);
      } else {
        finishDraw(list[randomIndex]);
      }
    };

    tick();
  };

  const finishDraw = (winner: string) => {
    setIsDrawing(false);
    setCurrentName(winner);
    setWinners(prev => [winner, ...prev]);
    
    if (!repeatable) {
      setAvailableNames(prev => prev.filter(name => name !== winner));
    }
  };

  const resetDraw = () => {
    setWinners([]);
    setCurrentName('準備好了嗎？');
    setAvailableNames(participants.map(p => p.name));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="mb-6 flex justify-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">
            <input 
              type="checkbox" 
              checked={repeatable} 
              onChange={(e) => setRepeatable(e.target.checked)}
              disabled={isDrawing}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-sm font-medium text-slate-700">可重複中獎</span>
          </label>
          {!repeatable && (
            <div className="text-sm text-slate-500 flex items-center">
              剩餘名額: {availableNames.length}
            </div>
          )}
        </div>

        <div className="relative py-16 bg-slate-50 rounded-2xl border-2 border-slate-100 mb-8 overflow-hidden">
          <div className="absolute inset-0 slot-machine-gradient pointer-events-none z-10"></div>
          <div className={`text-6xl md:text-8xl font-black tracking-tighter ${isDrawing ? 'text-indigo-600 animate-pulse' : 'text-slate-800'}`}>
            {currentName}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={startDraw}
            disabled={isDrawing || (participants.length === 0)}
            className={`px-12 py-4 rounded-2xl text-xl font-bold shadow-lg transform transition-all active:scale-95 ${
              isDrawing || participants.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1'
            }`}
          >
            {isDrawing ? '抽籤中...' : '開始抽籤'}
          </button>
          
          <button
            onClick={resetDraw}
            disabled={isDrawing}
            className="px-6 py-4 text-slate-400 hover:text-slate-600 font-medium transition-colors"
          >
            重設紀錄
          </button>
        </div>
      </div>

      {winners.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span> 中獎名單
          </h3>
          <div className="flex flex-wrap gap-2">
            {winners.map((name, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce-in">
                <span className="text-xs bg-amber-200 w-5 h-5 flex items-center justify-center rounded-full">
                  {winners.length - i}
                </span>
                {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
