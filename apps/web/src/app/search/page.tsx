import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { TopicSchema, ConceptSchema } from "@my-knowledge/contracts";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { SortSelect } from "@/components/SortSelect";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; sort?: string }>;
}) {
  const { q: query, type = "all", sort = "relevance" } = await searchParams;

  if (!query) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Search Knowledge Base
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Search across all topics, subtopics, and concepts
          </p>
          <SearchBar />
        </div>
      </div>
    );
  }

  const searchTerm = query.toLowerCase();

  // Search topics
  const shouldSearchTopics =
    type === "all" || type === "topics" || type === "subtopics";
  // Use text search (ts_query) for better performance
  const topicsPromise = shouldSearchTopics
    ? supabaseServer
        .from("topics")
        .select("id, name, description, parent_id, created_at")
        .textSearch("name", searchTerm, {
          type: "websearch",
          config: "english",
        })
        .limit(50)
    : Promise.resolve({ data: [], error: null });

  // Search concepts - simplified without join
  const shouldSearchConcepts = type === "all" || type === "concepts";
  const conceptsPromise = shouldSearchConcepts
    ? supabaseServer
        .from("concepts")
        .select("id, name, definition, topic_id, created_at")
        .textSearch("name", searchTerm, {
          type: "websearch",
          config: "english",
        })
        .limit(50)
    : Promise.resolve({ data: [], error: null });

  const [topicsResult, conceptsResult] = await Promise.all([
    topicsPromise,
    conceptsPromise,
  ]);

  const topics = topicsResult.data
    ? TopicSchema.array().parse(
        topicsResult.data.map((t) => ({
          ...t,
          created_at: t.created_at
            ? new Date(t.created_at).toISOString()
            : undefined,
        })),
      )
    : [];

  const concepts = conceptsResult.data
    ? ConceptSchema.array().parse(
        conceptsResult.data.map((c) => ({
          ...c,
          created_at: c.created_at
            ? new Date(c.created_at).toISOString()
            : undefined,
        })),
      )
    : [];

  // Fetch topic names for concepts
  const topicIds = [...new Set(concepts.map((c) => c.topic_id))];
  const topicsForConcepts =
    topicIds.length > 0
      ? await supabaseServer
          .from("topics")
          .select("id, name")
          .in("id", topicIds)
      : { data: [] };

  const topicNamesMap = new Map(
    (topicsForConcepts.data || []).map((t) => [t.id, t.name]),
  );

  // Separate root topics and subtopics
  const rootTopics = topics.filter((t) => !t.parent_id);
  const subtopics = topics.filter((t) => t.parent_id);

  // Sort results
  const sortResults = <T extends { name: string; created_at?: string }>(
    items: T[],
  ) => {
    if (sort === "name") {
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "date") {
      return [...items].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }
    return items;
  };

  const sortedRootTopics = sortResults(rootTopics);
  const sortedSubtopics = sortResults(subtopics);
  const sortedConcepts = sortResults(concepts);

  const totalResults =
    sortedRootTopics.length + sortedSubtopics.length + sortedConcepts.length;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        <SearchBar />
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Search Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "
            {query}"
          </p>
        </div>

        {/* Sort Options */}
        <SortSelect />
      </div>

      {totalResults === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400">
            No results found for "{query}"
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Root Topics */}
          {sortedRootTopics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Topics ({sortedRootTopics.length})
              </h3>
              <div className="space-y-3">
                {sortedRootTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/topic/${topic.id}`}
                    className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                        Topic
                      </span>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {topic.name}
                      </h4>
                    </div>
                    {topic.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {topic.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Subtopics */}
          {sortedSubtopics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Subtopics ({sortedSubtopics.length})
              </h3>
              <div className="space-y-3">
                {sortedSubtopics.map((subtopic) => (
                  <Link
                    key={subtopic.id}
                    href={`/topic/${subtopic.id}`}
                    className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                        Subtopic
                      </span>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {subtopic.name}
                      </h4>
                    </div>
                    {subtopic.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {subtopic.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Concepts */}
          {sortedConcepts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Concepts ({sortedConcepts.length})
              </h3>
              <div className="space-y-3">
                {sortedConcepts.map((concept) => {
                  const topicName =
                    topicNamesMap.get(concept.topic_id) || "Unknown Topic";

                  return (
                    <Link
                      key={concept.id}
                      href={`/topic/${concept.topic_id}/concept/${concept.id}`}
                      className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                          Concept
                        </span>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {concept.name}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          in {topicName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {concept.definition}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
