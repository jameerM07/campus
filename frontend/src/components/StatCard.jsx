import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'purple' }) => {
  const colorStyles = {
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
    },
    navy: {
      bg: 'bg-navy-50',
      text: 'text-navy-900',
      border: 'border-navy-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
  };

  const style = colorStyles[color] || colorStyles.purple;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-black text-navy-900">{value !== undefined && value !== null ? value : '-'}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 border ${style.border}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;

