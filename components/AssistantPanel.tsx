import React, { useState } from 'react';
import { Bot, RefreshCw, Loader2 } from 'lucide-react';
import { Investor, PipelineStats } from '../types';
import { generateFundraisingReport } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Assuming we can use simple markdown rendering or just text

interface AssistantPanelProps {
  investors: Investor[];
  stats: PipelineStats;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ investors, stats }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    const result = await generateFundraisingReport(investors, stats);
    setReport(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-lg shadow-indigo-50/50 overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white">
          <Bot size={20} />
          <h2 className="font-semibold">AI Fundraising Assistant</h2>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={loading}
          className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {report ? 'Update Report' : 'Generate Report'}
        </button>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
            <p className="text-sm">Analyzing pipeline & dependencies...</p>
          </div>
        ) : report ? (
          <div className="prose prose-sm prose-indigo max-w-none text-slate-700 whitespace-pre-wrap">
             {/* Simple rendering of markdown-like text */}
             {report}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <Bot size={32} className="text-indigo-300" />
            </div>
            <div>
              <p className="font-medium text-slate-600 mb-1">준비되었습니다</p>
              <p className="text-xs">현재 파이프라인 상태를 분석하고<br/>다음 행동 전략을 제안받으세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
