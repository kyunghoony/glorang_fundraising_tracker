import React from 'react';
import { Investor, Status } from '../types';
import { AlertCircle, CheckCircle2, Clock, XCircle, Pencil, Trash2 } from 'lucide-react';
import { CURRENT_DATE } from '../constants';

interface PipelineTableProps {
  investors: Investor[];
  onEdit: (investor: Investor) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<Status, { label: string; color: string; icon: React.ReactNode }> = {
  Verbal: { label: '구두 커밋', color: 'bg-green-100 text-green-800', icon: <CheckCircle2 size={16} /> },
  HighInterest: { label: '높은 감도', color: 'bg-blue-100 text-blue-800', icon: <AlertCircle size={16} /> },
  InProgress: { label: '진행 중', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} /> },
  Dropped: { label: '드랍', color: 'bg-gray-100 text-gray-500', icon: <XCircle size={16} /> },
};

export const PipelineTable: React.FC<PipelineTableProps> = ({ investors, onEdit, onDelete }) => {
  
  const getDaysSinceUpdate = (dateString: string) => {
    const diff = new Date(CURRENT_DATE).getTime() - new Date(dateString).getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">투자사 (Investor)</th>
              <th className="px-6 py-4 font-medium">금액 (억 KRW)</th>
              <th className="px-6 py-4 font-medium">상태 (Status)</th>
              <th className="px-6 py-4 font-medium">담당 (Lead)</th>
              <th className="px-6 py-4 font-medium">마지막 업데이트</th>
              <th className="px-6 py-4 font-medium">비고 / 이슈</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {investors.map((investor) => {
              const status = statusConfig[investor.status];
              const daysSince = getDaysSinceUpdate(investor.lastUpdate);
              const isStale = daysSince > 14 && investor.status !== 'Dropped';

              return (
                <tr key={investor.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <button 
                      onClick={() => onEdit(investor)}
                      className="hover:text-indigo-600 hover:underline text-left font-semibold focus:outline-none"
                    >
                      {investor.name}
                    </button>
                    {investor.contact && <div className="text-xs text-slate-500 font-normal mt-0.5">{investor.contact}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {investor.amount > 0 ? (
                      <span className="font-semibold">{investor.amount}억</span>
                    ) : (
                      <span className="text-slate-400">TBD</span>
                    )}
                    {investor.maxAmount && <span className="text-xs text-slate-500 ml-1">(Max {investor.maxAmount})</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {investor.lead}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 ${isStale ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                      {investor.lastUpdate}
                      {isStale && <span className="text-[10px] bg-red-100 px-1.5 py-0.5 rounded">Update Req</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    {investor.dependency || investor.isBlocker ? (
                      <div className="flex items-start gap-1.5 text-orange-600 bg-orange-50 p-2 rounded text-xs font-medium">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <span>
                          {investor.isBlocker && <span className="font-bold mr-1">[BLOCKER]</span>}
                          {investor.dependency || investor.notes}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 truncate block">{investor.notes}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
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
