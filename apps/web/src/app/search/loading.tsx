export default function SearchLoading() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
