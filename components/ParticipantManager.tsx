
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { parseNames, MOCK_NAMES, getDuplicateIds } from '../utils/helpers';

interface Props {
  participants: Participant[];
  onUpdate: (participants: Participant[]) => void;
}

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  const duplicateIds = useMemo(() => getDuplicateIds(participants), [participants]);

  const handleAddNames = (namesToAdd?: string[]) => {
    const names = namesToAdd || parseNames(inputText);
    const newParticipants = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...participants, ...newParticipants]);
    if (!namesToAdd) setInputText('');
  };

  const handleLoadMockData = () => {
    handleAddNames(MOCK_NAMES);
  };

  const handleRemoveDuplicates = () => {
    const seenNames = new Set<string>();
    const uniqueParticipants = participants.filter(p => {
      if (seenNames.has(p.name)) return false;
      seenNames.add(p.name);
      return true;
    });
    onUpdate(uniqueParticipants);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = parseNames(text);
      const newParticipants = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      onUpdate([...participants, ...newParticipants]);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      onUpdate([]);
    }
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            名單輸入
          </h2>
          <button 
            onClick={handleLoadMockData}
            className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            💡 載入範例名單
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">貼上姓名 (以換行或逗號分隔)</label>
            <textarea
              className="w-full h-40 p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="例如：&#10;王小明&#10;李小華, 張大維"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={() => handleAddNames()}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              新增至名單
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">上傳 CSV/TXT 檔案</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">點擊上傳</span> 或拖放檔案</p>
                  <p className="text-xs text-slate-400">CSV, TXT (每行一個姓名)</p>
                </div>
                <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">目前名單 ({participants.length} 人)</h2>
            {duplicateIds.size > 0 && (
              <button
                onClick={handleRemoveDuplicates}
                className="flex items-center gap-1.5 text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-colors animate-pulse"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                移除重複項
              </button>
            )}
          </div>
          {participants.length > 0 && (
            <button onClick={handleClear} className="text-sm text-slate-400 hover:text-red-500 font-medium transition-colors">
              清空全部
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-1">
          {participants.map((p) => {
            const isDuplicate = duplicateIds.has(p.id);
            return (
              <div 
                key={p.id} 
                className={`group relative border px-3 py-2 rounded-lg flex items-center justify-between transition-all ${
                  isDuplicate 
                    ? 'bg-red-50 border-red-200 hover:border-red-400' 
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {isDuplicate && (
                    <span title="重複的姓名" className="text-red-500 flex-shrink-0">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                  <span className={`truncate text-sm font-medium ${isDuplicate ? 'text-red-700' : ''}`}>
                    {p.name}
                  </span>
                </div>
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity ml-1 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            );
          })}
          {participants.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-400 italic">
              尚未加入任何名單
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantManager;
