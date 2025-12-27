
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { shuffleArray, exportGroupsToCSV } from '../utils/helpers';
import { generateTeamNames } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const GroupingBoard: React.FC<Props> = ({ participants }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [perGroup, setPerGroup] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState("Corporate Superheroes");

  const performGrouping = async () => {
    if (participants.length === 0) return;
    
    setIsGenerating(true);
    
    // Explicitly type the result to resolve "unknown[]" inference issues
    const shuffled: string[] = shuffleArray<string>(participants.map(p => p.name));
    const groupCount = Math.ceil(shuffled.length / perGroup);
    
    // Use Gemini to get fun team names
    const teamNames = await generateTeamNames(groupCount, theme);
    
    const newGroups: Group[] = [];
    for (let i = 0; i < groupCount; i++) {
      newGroups.push({
        id: Math.random().toString(36).substr(2, 9),
        name: teamNames[i] || `隊伍 ${i + 1}`,
        // Slice the shuffled array to get members for this specific group
        members: shuffled.slice(i * perGroup, (i + 1) * perGroup)
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const handleExport = () => {
    if (groups.length === 0) return;
    exportGroupsToCSV(groups);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">每組人數</label>
            <input 
              type="number" 
              min="2" 
              max={participants.length}
              value={perGroup}
              onChange={(e) => setPerGroup(parseInt(e.target.value) || 2)}
              className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">分組主題 (AI 命名)</label>
            <input 
              type="text" 
              placeholder="例如：復仇者聯盟, 動物, 水果"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={performGrouping}
            disabled={isGenerating || participants.length === 0}
            className="h-11 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:bg-slate-300"
          >
            {isGenerating ? 'AI 分組中...' : '開始自動分組'}
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          將 {participants.length} 位成員分成約 {Math.ceil(participants.length / perGroup)} 組
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">分組結果</h2>
        {groups.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            匯出分組 CSV
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <div key={group.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform hover:-translate-y-1 transition-all">
            <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
              <h3 className="font-bold text-indigo-900 truncate pr-2">{group.name}</h3>
              <span className="text-xs font-semibold bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full">
                {group.members.length} 人
              </span>
            </div>
            <div className="p-4 space-y-2">
              {group.members.map((member, mIdx) => (
                <div key={mIdx} className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {mIdx + 1}
                  </div>
                  <span className="text-sm font-medium">{member}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          設定人數與主題後點擊「開始自動分組」
        </div>
      )}
    </div>
  );
};

export default GroupingBoard;
