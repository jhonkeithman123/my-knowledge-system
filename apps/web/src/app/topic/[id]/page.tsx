import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { TopicSchema, ConceptSchema, Topic } from "@my-knowledge/contracts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteTopicButton } from "@/components/DeleteTopicButton";
import { DeleteConceptButton } from "@/components/DeleteConceptButton";

async function buildBreadcrumbs(topicId: string): Promise<Topic[]> {
  const breadcrumbs: Topic[] = [];
  let currentId: string | null = topicId;

  while (currentId) {
    const { data } = await supabaseServer
      .from("topics")
      .select("*")
      .eq("id", currentId)
      .single();

    if (!data) break;

    const normalized = {
      ...data,
      created_at: data.created_at
        ? new Date(data.created_at).toISOString()
        : undefined,
    };
    const validated = TopicSchema.parse(normalized);

    breadcrumbs.unshift(validated);
    currentId = validated.parent_id;
  }

  breadcrumbs.pop(); // Remove current topic
  return breadcrumbs;
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const topicId = (await params).id;

  // Fetch all data in parallel on the server
  const [topicResult, subtopicsResult, conceptsResult] = await Promise.all([
    supabaseServer.from("topics").select("*").eq("id", topicId).single(),
    supabaseServer
      .from("topics")
      .select("*")
      .eq("parent_id", topicId)
      .order("created_at", { ascending: false }),
    supabaseServer
      .from("concepts")
      .select("*")
      .eq("topic_id", topicId)
      .order("created_at", { ascending: false }),
  ]);

  if (topicResult.error || !topicResult.data) {
    notFound();
  }

  const normalized = {
    ...topicResult.data,
    created_at: topicResult.data.created_at
      ? new Date(topicResult.data.created_at).toISOString()
      : undefined,
  };
  const topic = TopicSchema.parse(normalized);

  const subtopics = TopicSchema.array().parse(
    (subtopicsResult.data || []).map((t) => ({
      ...t,
      created_at: t.created_at
        ? new Date(t.created_at).toISOString()
        : undefined,
    })),
  );

  const concepts = ConceptSchema.array().parse(
    (conceptsResult.data || []).map((c) => ({
      ...c,
      created_at: c.created_at
        ? new Date(c.created_at).toISOString()
        : undefined,
    })),
  );

  const breadcrumbs = await buildBreadcrumbs(topicId);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Link
          href="/"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          href="/topic"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Topics
        </Link>
        {breadcrumbs.map((crumb) => (
          <span key={crumb.id} className="contents">
            <span>/</span>
            <Link
              href={`/topic/${crumb.id}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {crumb.name}
            </Link>
          </span>
        ))}
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {topic.name}
        </span>
      </nav>

      {/* Topic Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {topic.name}
            </h1>
            {topic.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {topic.description}
              </p>
            )}
          </div>
          <DeleteTopicButton
            topicId={topic.id}
            topicName={topic.name}
            parentId={topic.parent_id}
            hasSubtopics={subtopics.length > 0}
            hasConcepts={concepts.length > 0}
          />
        </div>
      </div>

      {/* Subtopics Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Subtopics ({subtopics.length})
          </h2>
          <Link
            href={`/topic/new?parent=${topicId}`}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
          >
            + Add Subtopic
          </Link>
        </div>

        {subtopics.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No subtopics yet. Create one to organize this topic further.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {subtopics.map((sub) => (
              <div key={sub.id} className="relative group">
                <Link
                  href={`/topic/${sub.id}`}
                  className="block p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {sub.name}
                  </h3>
                  {sub.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {sub.description}
                    </p>
                  )}
                </Link>
                <DeleteConceptButton
                  conceptId={sub.id}
                  conceptName={sub.name}
                  topicId={topicId}
                  isSubtopic={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Concepts Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Concepts ({concepts.length})
          </h2>
          <Link
            href={`/topic/${topicId}/concept/new`}
            className="px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
          >
            + Add Concept
          </Link>
        </div>

        {concepts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No concepts yet. Add concepts to build your knowledge base.
          </p>
        ) : (
          <div className="space-y-4">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className="relative group p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {concept.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {concept.definition}
                    </p>
                  </div>
                  <DeleteConceptButton
                    conceptId={concept.id}
                    conceptName={concept.name}
                    topicId={topicId}
                    isSubtopic={false}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
