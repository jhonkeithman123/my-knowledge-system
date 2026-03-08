export default function TopicLoading() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
      </div>

      {/* Header skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
      </div>

      {/* Content skeletons */}
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6 animate-pulse"
        >
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
