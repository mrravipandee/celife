import React from "react";

export default function ProductsLoading() {
  return (
    <div className="bg-slate-50/50 min-h-screen pb-24 animate-pulse">
      {/* Editorial Header Skeleton */}
      <section className="bg-white border-b border-slate-200/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="h-3 w-32 bg-slate-200 rounded mb-4" />
            <div className="h-10 w-96 bg-slate-200 rounded-lg mb-4" />
            <div className="h-4 w-full max-w-xl bg-slate-100 rounded mb-2" />
            <div className="h-4 w-3/4 max-w-md bg-slate-100 rounded" />
          </div>
        </div>
      </section>

      {/* Filter / Search Bar Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-hidden py-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-28 bg-slate-200 rounded-full flex-shrink-0" />
            ))}
          </div>
          <div className="h-10 w-full md:w-72 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden p-6 flex flex-col justify-between h-[420px]"
            >
              <div>
                <div className="w-full h-48 bg-slate-100 rounded-lg mb-4" />
                <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
                <div className="h-6 w-3/4 bg-slate-200 rounded mb-3" />
                <div className="h-3 w-full bg-slate-100 rounded mb-1" />
                <div className="h-3 w-2/3 bg-slate-100 rounded" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
