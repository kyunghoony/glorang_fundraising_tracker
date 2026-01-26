import React, { useMemo, useState } from 'react';
import { INITIAL_INVESTORS, TARGETS } from './constants';
import { Investor, PipelineStats } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Target, AlertTriangle, Wallet, Plus } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { PipelineTable } from './components/PipelineTable';
import { AssistantPanel } from './components/AssistantPanel';
import { InvestorModal } from './components/InvestorModal';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#9CA3AF'];

function App() {
  const [investors, setInvestors] = useState<Investor[]>(INITIAL_INVESTORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);

  // Calculate Stats
  const stats: PipelineStats = useMemo(() => {
    const active = investors.filter(i => i.status !== 'Dropped');
    
    const totalVerbal = active
      .filter(i => i.status === 'Verbal')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalHighInterest = active
      .filter(i => i.status === 'HighInterest')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalInProgress = active
      .filter(i => i.status === 'InProgress')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
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

  // CRUD Handlers
  const handleAddNew = () => {
    setEditingInvestor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (investor: Investor) => {
    setEditingInvestor(investor);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 이 투자사 정보를 삭제하시겠습니까? (Are you sure?)')) {
        setInvestors(prev => prev.filter(inv => inv.id !== id));
    }
  };

  const handleSaveInvestor = (savedInvestor: Investor) => {
    setInvestors(prev => {
        // Check if ID exists to determine update vs create
        const exists = prev.some(inv => inv.id === savedInvestor.id);
        if (exists) {
            return prev.map(inv => inv.id === savedInvestor.id ? savedInvestor : inv);
        } else {
            return [...prev, savedInvestor];
        }
    });
    setIsModalOpen(false);
    setEditingInvestor(null);
  };

  // Chart Data
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Glorang <span className="text-slate-400 font-normal">Fundraising</span></h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
               D-Day: Series B+ (2026.01.27)
             </div>
             <button 
                onClick={handleAddNew}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
             >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Investor</span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Verbal Commits" 
            value={`${stats.totalVerbal}억`} 
            subValue={`${Math.round((stats.totalVerbal / stats.targetPrimary) * 100)}% of 1st Target`}
            color="green"
            icon={<Wallet className="text-green-600" size={20} />}
          />
          <StatsCard 
            title="Weighted Pipeline" 
            value={`${Math.round(stats.weightedTotal)}억`} 
            subValue="Prob-adjusted value"
            color="blue"
            icon={<TrendingUp className="text-blue-600" size={20} />}
          />
          <StatsCard 
            title="Max Potential" 
            value={`${stats.maxPotential}억`} 
            subValue="Best case scenario"
            color="orange"
            icon={<Target className="text-orange-600" size={20} />}
          />
           <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-center">
             <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-medium text-slate-500">Gap to 200억</span>
               <span className="text-sm font-bold text-red-600">{Math.max(0, 200 - stats.totalVerbal)}억 Left</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
               <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (stats.totalVerbal / 200) * 100)}%` }}></div>
             </div>
             <p className="text-xs text-slate-400 mt-2 text-right">Target: 400억</p>
           </div>
        </div>

        {/* Charts & Assistant Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Charts */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
                <h3 className="text-sm font-semibold text-slate-500 mb-4">Pipeline Composition</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `${value}억`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
                <h3 className="text-sm font-semibold text-slate-500 mb-4">Progress vs Targets</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" unit="억" />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="amount" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Critical Dependency Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm text-orange-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-orange-900">Critical Dependency: Fintech Thesis</h3>
                <p className="text-orange-800 mt-1">
                  Total Impact: <span className="font-bold">80억 KRW</span> (Colopl + MUFG)
                </p>
                <p className="text-sm text-orange-700 mt-2">
                  Action Required: Secure partnership/MOU with Korean financial institution. 
                  Currently waiting on Samsung (expected this week).
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/50 rounded text-xs font-semibold text-orange-800">Lead: 경훈</span>
                  <span className="px-2 py-1 bg-white/50 rounded text-xs font-semibold text-orange-800">Status: In Progress</span>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Pipeline Details</h3>
                <div className="text-sm text-slate-500">Last Updated: Today</div>
              </div>
              <PipelineTable 
                investors={investors} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

          </div>

          {/* Right Column: AI Assistant */}
          <div className="lg:col-span-1 h-[600px] lg:h-auto sticky top-24">
            <AssistantPanel investors={investors} stats={stats} />
          </div>
        </div>
      </main>
      
      {/* Modal */}
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
