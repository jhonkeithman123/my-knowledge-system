import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { ConceptSchema } from "@my-knowledge/contracts";
import { EditConceptForm } from "@/components/EditConceptForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditConceptPage({
  params,
}: {
  params: Promise<{ id: string; conceptId: string }>;
}) {
  const { id: topicId, conceptId } = await params;

  const [topicResult, conceptResult] = await Promise.all([
    supabaseServer.from("topics").select("name").eq("id", topicId).single(),
    supabaseServer.from("concepts").select("*").eq("id", conceptId).single(),
  ]);

  if (topicResult.error || !topicResult.data) {
    notFound();
  }

  if (conceptResult.error || !conceptResult.data) {
    notFound();
  }

  const normalized = {
    ...conceptResult.data,
    created_at: conceptResult.data.created_at
      ? new Date(conceptResult.data.created_at).toISOString()
      : undefined,
  };
  const concept = ConceptSchema.parse(normalized);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
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
          {topicResult.data.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          Edit Concept
        </span>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Edit Concept
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update the details for "{concept.name}" in "{topicResult.data.name}"
        </p>
      </div>

      <EditConceptForm
        concept={concept}
        topicId={topicId}
        topicName={topicResult.data.name}
      />
    </div>
  );
}
