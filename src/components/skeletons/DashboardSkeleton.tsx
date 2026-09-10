import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="w-48 h-4 bg-slate-800 rounded-lg" />
        <div className="w-72 h-8 bg-slate-800 rounded-lg" />
        <div className="w-full max-w-xl h-4 bg-slate-800/60 rounded-lg" />
      </div>

      {/* KPI Cards Skeleton (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-2 flex-1 pr-4">
              <div className="w-24 h-3 bg-slate-800 rounded" />
              <div className="w-16 h-7 bg-slate-800 rounded-lg" />
              <div className="w-32 h-3 bg-slate-800/60 rounded" />
            </div>
            <div className="w-12 h-12 bg-slate-800/80 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Table Skeleton Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-2">
            <div className="w-64 h-5 bg-slate-800 rounded-lg" />
            <div className="w-48 h-3 bg-slate-800/60 rounded" />
          </div>
          <div className="w-56 h-9 bg-slate-800 rounded-xl" />
        </div>

        {/* Table Rows Skeleton (5 rows) */}
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-12 bg-slate-950/60 border border-slate-800/60 rounded-xl flex items-center justify-between px-4">
              <div className="w-16 h-4 bg-slate-800 rounded font-mono" />
              <div className="w-24 h-4 bg-slate-800 rounded" />
              <div className="w-28 h-4 bg-slate-800 rounded font-bold" />
              <div className="w-32 h-4 bg-slate-800 rounded" />
              <div className="w-16 h-6 bg-slate-800 rounded-full" />
              <div className="w-20 h-8 bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
