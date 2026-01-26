import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subValue, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} flex items-start justify-between shadow-sm`}>
      <div>
        <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {subValue && <p className="text-sm mt-2 opacity-90">{subValue}</p>}
      </div>
      {icon && <div className="p-2 rounded-full bg-white bg-opacity-40">{icon}</div>}
    </div>
  );
};
