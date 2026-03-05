import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { NewConceptForm } from "@/components/NewConceptForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const topicId = (await params).id;

  const { data: topic, error } = await supabaseServer
    .from("topics")
    .select("name")
    .eq("id", topicId)
    .single();

  if (error || !topic) {
    notFound();
  }

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
          {topic.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          New Concept
        </span>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Add New Concept
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create a concept for "{topic.name}"
        </p>
      </div>

      <NewConceptForm topicId={topicId} topicName={topic.name} />
    </div>
  );
}
