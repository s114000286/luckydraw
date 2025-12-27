
import React, { useState } from 'react';
import { Participant, AppMode } from './types';
import ParticipantManager from './components/ParticipantManager';
import LuckyDraw from './components/LuckyDraw';
import GroupingBoard from './components/GroupingBoard';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.SETUP);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              HR
            </div>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Event Pro Toolbox</h1>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode(AppMode.SETUP)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                mode === AppMode.SETUP ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              名單管理
            </button>
            <button
              onClick={() => setMode(AppMode.LUCKY_DRAW)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                mode === AppMode.LUCKY_DRAW ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              獎品抽籤
            </button>
            <button
              onClick={() => setMode(AppMode.GROUPING)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                mode === AppMode.GROUPING ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              自動分組
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-8">
        {mode === AppMode.SETUP && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ParticipantManager 
              participants={participants} 
              onUpdate={setParticipants} 
            />
          </div>
        )}

        {mode === AppMode.LUCKY_DRAW && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {participants.length > 0 ? (
              <LuckyDraw participants={participants} />
            ) : (
              <EmptyState onGoToSetup={() => setMode(AppMode.SETUP)} />
            )}
          </div>
        )}

        {mode === AppMode.GROUPING && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {participants.length > 0 ? (
              <GroupingBoard participants={participants} />
            ) : (
              <EmptyState onGoToSetup={() => setMode(AppMode.SETUP)} />
            )}
          </div>
        )}
      </main>

      {/* Quick Info Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-4 flex justify-center">
        <p className="text-xs text-slate-400 font-medium">
          總人數: <span className="text-indigo-600">{participants.length}</span> • 
          目前模式: <span className="text-indigo-600 uppercase">{mode.replace('_', ' ')}</span>
        </p>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onGoToSetup: () => void }> = ({ onGoToSetup }) => (
  <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-slate-700 mb-2">尚未建立名單</h3>
    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
      請先前往「名單管理」新增參與者姓名，才能進行抽籤或分組功能。
    </p>
    <button
      onClick={onGoToSetup}
      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
    >
      立即新增名單
    </button>
  </div>
);

export default App;
