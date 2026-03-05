"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteTopic } from "@/app/actions/topicActions";

export function DeleteTopicButton({
  topicId,
  topicName,
  parentId,
  hasSubtopics,
  hasConcepts,
}: {
  topicId: string;
  topicName: string;
  parentId: string | null;
  hasSubtopics: boolean;
  hasConcepts: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmMessage = hasSubtopics
      ? `This topic has subtopics. Deleting it will also delete all subtopics and concepts. Are you sure?`
      : hasConcepts
        ? `This topic has concepts. Deleting it will also delete all concepts. Are you sure?`
        : "Are you sure you want to delete this topic?";

    if (!confirm(confirmMessage)) return;

    setDeleting(true);
    const result = await deleteTopic(topicId);

    if (result.success) {
      router.push(parentId ? `/topic/${parentId}` : "/topic");
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
    >
      {deleting ? "Deleting..." : "Delete Topic"}
    </button>
  );
}
