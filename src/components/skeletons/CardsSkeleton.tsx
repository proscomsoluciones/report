import React from 'react';

export const CardsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="w-40 h-4 bg-slate-800 rounded" />
        <div className="w-80 h-8 bg-slate-800 rounded-lg" />
        <div className="w-full max-w-xl h-4 bg-slate-800/60 rounded" />
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex justify-between items-center">
            <div className="space-y-2 flex-1 pr-4">
              <div className="w-24 h-3 bg-slate-800 rounded" />
              <div className="w-16 h-7 bg-slate-800 rounded-lg" />
            </div>
            <div className="w-12 h-12 bg-slate-800/80 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Grid of Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((card) => (
          <div key={card} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                <div className="space-y-2">
                  <div className="w-36 h-4 bg-slate-800 rounded" />
                  <div className="w-24 h-3 bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="w-20 h-6 bg-slate-800/80 rounded-lg" />
            </div>

            <div className="space-y-2">
              <div className="w-full h-10 bg-slate-950 border border-slate-800/80 rounded-xl" />
              <div className="w-full h-10 bg-slate-950 border border-slate-800/80 rounded-xl" />
              <div className="w-full h-10 bg-slate-950 border border-slate-800/80 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
