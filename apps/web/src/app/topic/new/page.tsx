import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { NewTopicForm } from "@/components/NewTopicForm";

export default async function NewTopicPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>;
}) {
  const parentId = (await searchParams).parent;
  let parentName = "";

  if (parentId) {
    const { data } = await supabaseServer
      .from("topics")
      .select("name")
      .eq("id", parentId)
      .single();

    if (data) parentName = data.name;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {parentId ? "Add New Subtopic" : "Add New Topic"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {parentId && parentName
            ? `Create a subtopic under "${parentName}"`
            : "Create a new topic to organize your knowledge"}
        </p>
      </div>

      <NewTopicForm parentId={parentId} />
    </div>
  );
}
