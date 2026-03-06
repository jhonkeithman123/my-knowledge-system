import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { TopicSchema } from "@my-knowledge/contracts";
import { EditTopicForm } from "@/components/EditTopicForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const topicId = (await params).id;

  const { data: topicData, error } = await supabaseServer
    .from("topics")
    .select("*")
    .eq("id", topicId)
    .single();

  if (error || !topicData) {
    notFound();
  }

  const normalized = {
    ...topicData,
    created_at: topicData.created_at
      ? new Date(topicData.created_at).toISOString()
      : undefined,
  };
  const topic = TopicSchema.parse(normalized);

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
          Edit
        </span>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Edit {topic.parent_id ? "Subtopic" : "Topic"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update the details for "{topic.name}"
        </p>
      </div>

      <EditTopicForm topic={topic} />
    </div>
  );
}
