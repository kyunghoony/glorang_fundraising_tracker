import React, { useState, useMemo } from 'react';
import { Investor, Status } from '../types';
import { AlertCircle, CheckCircle2, Clock, XCircle, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { CURRENT_DATE } from '../constants';

interface PipelineTableProps {
  investors: Investor[];
  onEdit: (investor: Investor) => void;
  onDelete: (id: string) => void;
}

type SortConfig = {
  key: keyof Investor;
  direction: 'asc' | 'desc';
};

const statusConfig: Record<Status, { label: string; color: string; icon: React.ReactNode }> = {
  Verbal: { label: '구두 커밋', color: 'bg-green-100 text-green-800', icon: <CheckCircle2 size={16} /> },
  HighInterest: { label: '높은 감도', color: 'bg-blue-100 text-blue-800', icon: <AlertCircle size={16} /> },
  InProgress: { label: '진행 중', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} /> },
  Dropped: { label: '드랍', color: 'bg-gray-100 text-gray-500', icon: <XCircle size={16} /> },
};

export const PipelineTable: React.FC<PipelineTableProps> = ({ investors, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const getDaysSinceUpdate = (dateString: string) => {
    const diff = new Date(CURRENT_DATE).getTime() - new Date(dateString).getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  };

  const handleSort = (key: keyof Investor) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedInvestors = useMemo(() => {
    if (!sortConfig) return investors;

    return [...investors].sort((a, b) => {
      // 1. Status Priority Sorting
      if (sortConfig.key === 'status') {
        const priority: Record<string, number> = { Verbal: 1, HighInterest: 2, InProgress: 3, Dropped: 4 };
        const aVal = priority[a.status] || 99;
        const bVal = priority[b.status] || 99;
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // 2. Notes/Blocker Sorting (Blockers always on top for Ascending)
      if (sortConfig.key === 'notes') {
         if (a.isBlocker !== b.isBlocker) {
             const aBlock = a.isBlocker ? 1 : 0;
             const bBlock = b.isBlocker ? 1 : 0;
             // Ascending: Blockers (1) first
             if (sortConfig.direction === 'asc') return bBlock - aBlock;
             return aBlock - bBlock;
         }
         // Fallback to text content
         const aText = a.dependency || a.notes || '';
         const bText = b.dependency || b.notes || '';
         return sortConfig.direction === 'asc' 
            ? aText.localeCompare(bText) 
            : bText.localeCompare(aText);
      }

      // 3. General Sorting
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [investors, sortConfig]);

  const SortHeader = ({ columnKey, label, className }: { columnKey: keyof Investor, label: string, className?: string }) => {
     const isActive = sortConfig?.key === columnKey;
     return (
        <th 
            className={`px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors select-none group whitespace-nowrap ${className || ''}`}
            onClick={() => handleSort(columnKey)}
        >
            <div className="flex items-center gap-1.5">
                {label}
                <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    {!isActive && <ArrowUpDown size={14} className="text-slate-400" />}
                    {isActive && sortConfig.direction === 'asc' && <ArrowUp size={14} className="text-indigo-600" />}
                    {isActive && sortConfig.direction === 'desc' && <ArrowDown size={14} className="text-indigo-600" />}
                </span>
            </div>
        </th>
     );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader columnKey="name" label="투자사" className="min-w-[160px]" />
              <SortHeader columnKey="amount" label="금액" className="min-w-[100px]" />
              <SortHeader columnKey="status" label="상태" className="min-w-[130px]" />
              <SortHeader columnKey="lead" label="담당" className="min-w-[100px]" />
              <SortHeader columnKey="lastUpdate" label="업데이트" className="min-w-[140px]" />
              <SortHeader columnKey="notes" label="비고 / 이슈" className="w-full min-w-[250px]" />
              <th className="px-4 py-3 font-medium text-right min-w-[80px]">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedInvestors.map((investor) => {
              const status = statusConfig[investor.status];
              const daysSince = getDaysSinceUpdate(investor.lastUpdate);
              const isStale = daysSince > 14 && investor.status !== 'Dropped';

              return (
                <tr key={investor.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3 font-medium text-slate-900 align-top">
                    <button 
                      onClick={() => onEdit(investor)}
                      className="hover:text-indigo-600 hover:underline text-left font-semibold focus:outline-none"
                    >
                      {investor.name}
                    </button>
                    {investor.contact && <div className="text-xs text-slate-500 font-normal mt-0.5">{investor.contact}</div>}
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">
                    {investor.amount > 0 ? (
                      <span className="font-semibold">{investor.amount}억</span>
                    ) : (
                      <span className="text-slate-400">TBD</span>
                    )}
                    {investor.maxAmount && <span className="text-xs text-slate-500 ml-1">(Max {investor.maxAmount})</span>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 align-top whitespace-nowrap">
                    {investor.lead}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`text-sm ${isStale ? 'text-red-500 font-medium' : 'text-slate-600'} whitespace-nowrap`}>
                        {investor.lastUpdate}
                      </span>
                      {isStale && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded whitespace-nowrap">Update Req</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {investor.dependency || investor.isBlocker ? (
                      <div className="flex items-start gap-1.5 text-orange-600 bg-orange-50 p-2 rounded text-xs font-medium">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <span className="break-words">
                          {investor.isBlocker && <span className="font-bold mr-1">[BLOCKER]</span>}
                          {investor.dependency || investor.notes}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 block break-words">{investor.notes}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right align-top whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                        <button 
                            onClick={() => onEdit(investor)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button 
                            onClick={() => onDelete(investor.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
