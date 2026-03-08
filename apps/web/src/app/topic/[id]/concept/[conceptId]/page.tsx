import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { ConceptSchema, TopicSchema } from "@my-knowledge/contracts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConceptActions } from "@/components/ConceptActions";

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ id: string; conceptId: string }>;
}) {
  const { id: topicId, conceptId } = await params;

  const [topicResult, conceptResult] = await Promise.all([
    supabaseServer.from("topics").select("*").eq("id", topicId).single(),
    supabaseServer.from("concepts").select("*").eq("id", conceptId).single(),
  ]);

  if (topicResult.error || !topicResult.data) {
    notFound();
  }

  if (conceptResult.error || !conceptResult.data) {
    notFound();
  }

  const topic = TopicSchema.parse({
    ...topicResult.data,
    created_at: topicResult.data.created_at
      ? new Date(topicResult.data.created_at).toISOString()
      : undefined,
  });

  const concept = ConceptSchema.parse({
    ...conceptResult.data,
    created_at: conceptResult.data.created_at
      ? new Date(conceptResult.data.created_at).toISOString()
      : undefined,
  });

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
        <span>/</span>
        <Link
          href={`/topic/${topicId}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {topic.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {concept.name}
        </span>
      </nav>

      {/* Concept Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                Concept
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                in{" "}
                <Link
                  href={`/topic/${topicId}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {topic.name}
                </Link>
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {concept.name}
            </h1>
          </div>
          <ConceptActions
            conceptId={concept.id}
            conceptName={concept.name}
            topicId={topicId}
          />
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Definition
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {concept.definition}
          </p>
        </div>

        {concept.created_at && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created on {new Date(concept.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Back to Topic */}
      <div className="flex justify-center">
        <Link
          href={`/topic/${topicId}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to {topic.name}
        </Link>
      </div>
    </div>
  );
}
