"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "relevance";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
    >
      <option value="relevance">Sort by Relevance</option>
      <option value="name">Sort by Name</option>
      <option value="date">Sort by Date</option>
    </select>
  );
}
