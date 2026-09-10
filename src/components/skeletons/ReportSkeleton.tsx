import React from 'react';

export const ReportSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Top Toolbar Skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="w-32 h-8 bg-slate-800 rounded-lg" />
        <div className="flex space-x-3">
          <div className="w-20 h-8 bg-slate-800 rounded-lg" />
          <div className="w-24 h-8 bg-slate-800 rounded-lg" />
          <div className="w-36 h-8 bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* Paper Voucher Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-300 space-y-4">
        <div className="flex justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-300 rounded" />
            <div className="space-y-2">
              <div className="w-40 h-5 bg-slate-300 rounded" />
              <div className="w-64 h-3 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="w-24 h-6 bg-rose-200 rounded" />
        </div>

        <div className="w-full h-8 bg-slate-100 border-y border-slate-300 rounded" />

        <div className="grid grid-cols-12 gap-3 h-32 bg-slate-50 border border-slate-300 rounded p-3">
          <div className="col-span-7 space-y-2 pr-2 border-r border-slate-300">
            <div className="w-full h-4 bg-slate-200 rounded" />
            <div className="w-full h-4 bg-slate-200 rounded" />
            <div className="w-full h-4 bg-slate-200 rounded" />
          </div>
          <div className="col-span-5 space-y-2 pl-2">
            <div className="w-full h-4 bg-slate-200 rounded" />
            <div className="w-full h-4 bg-slate-200 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 h-48">
          <div className="col-span-4 bg-slate-100 border border-slate-300 rounded p-3 space-y-3">
            <div className="w-full h-6 bg-slate-300 rounded" />
            <div className="w-full h-4 bg-slate-200 rounded" />
            <div className="w-full h-4 bg-slate-200 rounded" />
          </div>
          <div className="col-span-8 bg-slate-50 border border-slate-300 rounded p-3 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-4 bg-slate-200 rounded" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 text-center">
          <div className="h-16 bg-slate-100 rounded" />
          <div className="h-16 bg-slate-100 rounded" />
          <div className="h-16 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
};
