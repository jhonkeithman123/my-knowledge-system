"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filterType, setFilterType] = useState(
    searchParams.get("type") || "all",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set("q", query);
    if (filterType !== "all") {
      params.set("type", filterType);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, subtopics, and concepts..."
            className="w-full px-4 py-2 pl-10 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
        >
          <option value="all">All</option>
          <option value="topics">Topics Only</option>
          <option value="subtopics">Subtopics Only</option>
          <option value="concepts">Concepts Only</option>
        </select>

        <button
          type="submit"
          className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
}
