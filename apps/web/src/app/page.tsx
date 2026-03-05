"use client";

import { useEffect, useState } from "react";
import { supabase } from "@my-knowledge/db";
import Link from "next/link";

export default function Home() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .is("parent_id", null) // Only root topics
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setTopics(data || []);
      setLoading(false);
    };
    fetchTopics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
          Welcome to Knowledge Management System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Organize your knowledge with topics, subtopics, and concepts
        </p>
        <Link
          href="/topic/new"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Create Your First Topic
        </Link>
      </div>

      {loading ? (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading topics...</p>
        </div>
      ) : topics.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Recent Topics
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.slice(0, 6).map((t) => (
              <Link
                key={t.id}
                href={`/topic/${t.id}`}
                className="block p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t.name}
                </h3>
                {t.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {t.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/topic"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View all topics →
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No topics yet</p>
          <Link
            href="/topic/new"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Create your first topic
          </Link>
        </div>
      )}
    </div>
  );
}
