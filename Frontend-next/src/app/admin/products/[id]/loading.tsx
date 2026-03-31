export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-3 w-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-3 w-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-3.5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
          {/* Title */}
          <div className="flex items-center gap-4 mt-2">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
          <div className="h-4 w-56 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
        {/* Action buttons */}
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-10 w-36 bg-slate-300 dark:bg-slate-600 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main info card skeleton */}
          <div className="bg-white/90 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image skeleton */}
              <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-slate-200 dark:bg-slate-700" />
              {/* Content */}
              <div className="flex-1 flex flex-col gap-3 justify-center">
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-md" />
                </div>
                <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="space-y-2 mt-2">
                  <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  <div className="h-3.5 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  <div className="h-3.5 w-4/6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Variants card skeleton */}
          <div className="bg-white/90 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                    <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded-md" />
                  </div>
                  <div className="flex gap-6">
                    <div className="h-8 w-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                    <div className="h-8 w-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Revenue card */}
          <div className="bg-slate-200 dark:bg-slate-700 rounded-3xl p-6 h-32" />

          {/* Analytics card */}
          <div className="bg-white/90 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
            <div className="flex justify-between items-end pt-2">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-7 w-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-300 dark:bg-slate-600 rounded-full"
                      style={{ width: `${[65, 45, 30][i - 1]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
