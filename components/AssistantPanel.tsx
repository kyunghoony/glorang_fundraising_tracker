import React, { useState } from 'react';
import { Bot, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { Investor, PipelineStats } from '../types';
import { generateFundraisingReport } from '../services/geminiService';

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
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-indigo-100/30 overflow-hidden flex flex-col h-full">
      <div className="bg-indigo-600 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-xl">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold tracking-tight">AI Fundraising Agent</h2>
            <p className="text-[11px] text-indigo-100 font-medium">Powered by Gemini 2.5 Pro</p>
          </div>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={loading}
          className="text-sm bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-5 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {report ? 'Update Analysis' : 'Generate Report'}
        </button>
      </div>
      
      <div className="p-10 flex-1 overflow-y-auto bg-slate-50/30">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="relative">
                <Loader2 size={48} className="animate-spin text-indigo-500" />
                <Sparkles className="absolute -top-1 -right-1 text-purple-400 animate-pulse" size={20} />
            </div>
            <div className="text-center">
                <p className="font-bold text-slate-700">Analyzing pipeline dynamics...</p>
                <p className="text-sm mt-1">Calculating weighted risks and blocker impacts</p>
            </div>
          </div>
        ) : report ? (
          <div className="max-w-4xl mx-auto prose prose-indigo text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
             {report}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-6 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-300">
              <Bot size={40} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 mb-2">준비되었습니다</p>
              <p className="text-sm font-medium leading-relaxed">
                투자사별 확률 분포와 의존성을 분석하여<br/>
                현재 펀딩 상황에 대한 맞춤형 전략 리포트를 생성합니다.
              </p>
              <button 
                onClick={handleGenerateReport}
                className="mt-6 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                리포트 생성하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};