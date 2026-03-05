"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteConcept } from "@/app/actions/topicActions";

export function DeleteConceptButton({
  conceptId,
  conceptName,
  topicId,
  isSubtopic,
}: {
  conceptId: string;
  conceptName: string;
  topicId: string;
  isSubtopic: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = isSubtopic
      ? `Are you sure you want to delete the subtopic "${conceptName}" and all its content?`
      : `Are you sure you want to delete the concept "${conceptName}"?`;

    if (!confirm(message)) return;

    setDeleting(true);
    const result = await deleteConcept(conceptId, topicId);

    if (result.success) {
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
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:bg-red-400 transition-all"
    >
      {deleting ? "..." : "✕"}
    </button>
  );
}
