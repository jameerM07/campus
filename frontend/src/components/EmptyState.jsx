import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = ({ title = 'No results found', description = 'Try adjusting your search filters or selected college.', icon: Icon = SearchX, actionButton }) => {
  return (
    <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-md mx-auto my-6 shadow-soft">
      <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 border border-purple-100">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-extrabold text-base text-navy-900 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-6">{description}</p>
      {actionButton}
    </div>
  );
};

export default EmptyState;

