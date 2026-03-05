import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { TopicSchema, Topic } from "@my-knowledge/contracts";
import Link from "next/link";

export default async function TopicsPage() {
  // Fetch on server
  const { data, error } = await supabaseServer
    .from("topics")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div>Error loading topics</div>;
  }

  const normalized = (data || []).map((t) => ({
    ...t,
    created_at: t.created_at ? new Date(t.created_at).toISOString() : undefined,
  }));

  const topics = TopicSchema.array().parse(normalized);

  const rootTopics = topics.filter((t) => !t.parent_id);
  const subtopicsByParent = topics.reduce(
    (acc, t) => {
      if (t.parent_id) {
        if (!acc[t.parent_id]) acc[t.parent_id] = [];
        acc[t.parent_id].push(t);
      }
      return acc;
    },
    {} as Record<string, Topic[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          All Topics
        </h1>
        <Link
          href="/topic/new"
          className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
        >
          + New Topic
        </Link>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No topics yet</p>
          <Link
            href="/topic/new"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Create your first topic
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rootTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-200"
            >
              <Link
                href={`/topic/${topic.id}`}
                className="block p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {topic.name}
                </h2>
                {topic.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {topic.description}
                  </p>
                )}
              </Link>

              {subtopicsByParent[topic.id] && (
                <div className="px-6 pb-4 pt-2 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {subtopicsByParent[topic.id].length} subtopic(s)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subtopicsByParent[topic.id].map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/topic/${sub.id}`}
                        className="text-sm px-3 py-1 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
