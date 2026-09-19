import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="bg-slate-50/50 min-h-screen pb-24 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-slate-200/60 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-4 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-4 bg-slate-200 rounded" />
          <div className="h-4 w-36 bg-slate-200 rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero split layout skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Gallery Skeleton */}
            <div className="lg:col-span-5 space-y-4">
              <div className="w-full aspect-square bg-slate-100 rounded-xl" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 bg-slate-100 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-3 w-32 bg-slate-200 rounded" />
                <div className="h-9 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-48 bg-slate-100 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded pt-4" />
                <div className="h-4 w-5/6 bg-slate-100 rounded" />

                {/* Structured specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="h-3 w-16 bg-slate-200 rounded mb-2" />
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <div className="h-12 w-56 bg-slate-200 rounded-lg" />
                <div className="h-12 w-44 bg-slate-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section Skeletons */}
        <div className="space-y-8 max-w-4xl">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-3">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-4/5 bg-slate-100 rounded" />
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="h-32 bg-slate-50 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
