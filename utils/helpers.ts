
import { Participant, Group } from '../types';

// Fisher-Yates shuffle algorithm for arrays
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Parse names from text input, splitting by newlines or commas
export const parseNames = (text: string): string[] => {
  return text
    .split(/[\n,]+/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
};

// Mock data for demonstration
export const MOCK_NAMES = [
  "王小明", "李美玲", "張大衛", "林志強", "陳淑芬",
  "黃金龍", "吳欣怡", "周杰倫", "蔡依林", "徐若瑄",
  "彭于晏", "桂綸鎂", "柯佳嬿", "許光漢", "賈靜雯",
  "謝盈萱", "邱澤", "曾敬驊", "陳昊森", "李沐"
];

// Identify which participants have duplicate names
export const getDuplicateIds = (participants: Participant[]): Set<string> => {
  const nameCounts = new Map<string, number>();
  participants.forEach(p => {
    nameCounts.set(p.name, (nameCounts.get(p.name) || 0) + 1);
  });

  const duplicateIds = new Set<string>();
  participants.forEach(p => {
    if ((nameCounts.get(p.name) || 0) > 1) {
      duplicateIds.add(p.id);
    }
  });
  return duplicateIds;
};

// Export groups to CSV format
export const exportGroupsToCSV = (groups: Group[]) => {
  const header = "\uFEFF組別名稱,成員姓名\n"; // Adding BOM for Excel compatibility
  const rows = groups.flatMap(group =>
    group.members.map(member => `${group.name},${member}`)
  ).join("\n");

  const csvContent = header + rows;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export participants to CSV format
export const exportParticipantsToCSV = (participants: Participant[]) => {
  const header = "\uFEFF姓名\n"; // Adding BOM for Excel compatibility
  const rows = participants.map(p => p.name).join("\n");

  const csvContent = header + rows;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `名單備份_${new Date().toLocaleDateString()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
