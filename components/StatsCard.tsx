import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subValue, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-white border-slate-100 text-blue-700 icon-bg-blue-50',
    green: 'bg-white border-slate-100 text-green-700 icon-bg-green-50',
    orange: 'bg-white border-slate-100 text-orange-700 icon-bg-orange-50',
    red: 'bg-white border-slate-100 text-red-700 icon-bg-red-50',
  };

  const iconBgClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorClasses[color]} flex items-start justify-between shadow-sm shadow-slate-200/40 transition-all hover:shadow-md`}>
      <div className="space-y-1">
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        {subValue && <p className="text-[13px] font-semibold text-slate-400 mt-2">{subValue}</p>}
      </div>
      {icon && (
        <div className={`p-3 rounded-2xl ${iconBgClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
      )}
    </div>
  );
};