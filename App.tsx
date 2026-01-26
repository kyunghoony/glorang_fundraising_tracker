import React, { useMemo, useState, useEffect } from 'react';
import { TARGETS } from './constants';
import { Investor, PipelineStats } from './types';
import { pipelineApi } from './services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Target, Wallet, Plus, Loader2, Lock } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { PipelineTable } from './components/PipelineTable';
import { AssistantPanel } from './components/AssistantPanel';
import { InvestorModal } from './components/InvestorModal';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#9CA3AF'];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('glorang_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const data = await pipelineApi.fetchInvestors();
          setInvestors(data);
        } catch (error) {
          console.error("Failed to load investors", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'ghkdxodlf') {
        setIsAuthenticated(true);
        sessionStorage.setItem('glorang_auth', 'true');
        setAuthError(false);
    } else {
        setAuthError(true);
    }
  };

  const stats: PipelineStats = useMemo(() => {
    const active = investors.filter(i => i.status !== 'Dropped');
    const totalVerbal = active.filter(i => i.status === 'Verbal').reduce((acc, curr) => acc + curr.amount, 0);
    const totalHighInterest = active.filter(i => i.status === 'HighInterest').reduce((acc, curr) => acc + curr.amount, 0);
    const totalInProgress = active.filter(i => i.status === 'InProgress').reduce((acc, curr) => acc + curr.amount, 0);
    const weightedTotal = active.reduce((acc, curr) => acc + (curr.amount * curr.probability), 0);
    const maxPotential = active.reduce((acc, curr) => acc + (curr.maxAmount || curr.amount), 0);

    return {
      targetPrimary: TARGETS.primary,
      targetFinal: TARGETS.final,
      totalVerbal,
      totalHighInterest,
      totalInProgress,
      weightedTotal,
      maxPotential
    };
  }, [investors]);

  const handleAddNew = () => {
    setEditingInvestor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (investor: Investor) => {
    setEditingInvestor(investor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('투자사 정보를 삭제하시겠습니까?')) {
        const updatedList = await pipelineApi.deleteInvestor(id);
        setInvestors(updatedList);
    }
  };

  const handleSaveInvestor = async (savedInvestor: Investor) => {
    const updatedList = await pipelineApi.saveInvestor(savedInvestor);
    setInvestors(updatedList);
    setIsModalOpen(false);
    setEditingInvestor(null);
  };

  const pieData = [
    { name: 'Verbal', value: stats.totalVerbal },
    { name: 'High Interest', value: stats.totalHighInterest },
    { name: 'In Progress', value: stats.totalInProgress },
  ];

  const funnelData = [
    { name: 'Target (1st)', amount: TARGETS.primary },
    { name: 'Max Potential', amount: stats.maxPotential },
    { name: 'Weighted Exp.', amount: Math.round(stats.weightedTotal) },
    { name: 'Verbal Commit', amount: stats.totalVerbal },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
             <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-200">G</div>
             </div>
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Glorang Fundraising</h2>
                <p className="text-slate-500 mt-2">Enter access code to view dashboard</p>
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        autoFocus
                    />
                </div>
                {authError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">Incorrect password.</div>}
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100">Access Dashboard</button>
             </form>
         </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 size={40} className="animate-spin text-indigo-600" />
        <p className="font-medium tracking-tight">Syncing Pipeline Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Glorang <span className="text-slate-400 font-medium">Fundraising</span></h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-[13px] font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
               D-Day: 2026.01.27 (Series B+)
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Verbal Commits" 
            value={`${stats.totalVerbal}억`} 
            subValue={`${Math.round((stats.totalVerbal / stats.targetPrimary) * 100)}% of 1st Target`}
            color="green"
            icon={<Wallet size={20} />}
          />
          <StatsCard 
            title="Weighted Pipeline" 
            value={`${Math.round(stats.weightedTotal)}억`} 
            subValue="Probability Adjusted"
            color="blue"
            icon={<TrendingUp size={20} />}
          />
          <StatsCard 
            title="Max Potential" 
            value={`${stats.maxPotential}억`} 
            subValue="Optimistic Scenario"
            color="orange"
            icon={<Target size={20} />}
          />
           <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-200/40 flex flex-col justify-center">
             <div className="flex justify-between items-center mb-3">
               <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">1차 클로징까지</span>
               <span className="text-sm font-bold text-red-500 px-2 py-0.5 bg-red-50 rounded-lg">{Math.max(0, 200 - stats.totalVerbal)}억 남음</span>
             </div>
             <div className="w-full bg-slate-50 rounded-full h-3 overflow-hidden border border-slate-100/50">
               <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (stats.totalVerbal / 200) * 100)}%` }}></div>
             </div>
             <div className="flex justify-between items-center mt-3 text-[11px] font-semibold text-slate-400">
               <span>PROGRESS</span>
               <span className="text-indigo-600">1st Closing: 200억</span>
             </div>
           </div>
        </div>

        {/* Visual Analytics */}
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/30 h-96">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pipeline Composition</h3>
                    <div className="flex gap-2">
                        {COLORS.map((c, i) => <div key={i} className="w-2 h-2 rounded-full" style={{backgroundColor: c}}></div>)}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                        formatter={(value) => `${value}억`} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/30 h-96">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Progress vs Targets</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" unit="억" hide />
                    <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 12, fontWeight: 600, fill: '#64748B'}} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px'}} />
                    <Bar dataKey="amount" fill="#4F46E5" radius={[0, 8, 8, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>

        {/* Pipeline Table Section */}
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Pipeline Details</h3>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add New Investor</span>
                </button>
            </div>
            <PipelineTable 
              investors={investors} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
        </section>

        {/* AI Assistant Section (Full Width Bottom) */}
        <section className="pt-10 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Strategic Analysis</h3>
            </div>
            <div className="h-[550px]">
                <AssistantPanel investors={investors} stats={stats} />
            </div>
        </section>
      </main>
      
      <InvestorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvestor}
        initialData={editingInvestor}
      />
    </div>
  );
}

export default App;