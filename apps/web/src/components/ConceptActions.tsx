"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteConcept } from "@/app/actions/topicActions";
import Link from "next/link";

export function ConceptActions({
  conceptId,
  conceptName,
  topicId,
  showViewLink = false,
  insideLink = false,
}: {
  conceptId: string;
  conceptName: string;
  topicId: string;
  showViewLink?: boolean;
  insideLink?: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(`Are you sure you want to delete the concept "${conceptName}"?`)
    )
      return;

    setDeleting(true);
    const result = await deleteConcept(conceptId, topicId);

    if (result.success) {
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/topic/${topicId}/concept/${conceptId}/edit`);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/topic/${topicId}/concept/${conceptId}`);
  };

  return (
    <div className="flex gap-2 ml-4 shrink-0">
      {showViewLink &&
        (insideLink ? (
          <button
            onClick={handleView}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            👁️
          </button>
        ) : (
          <Link
            href={`/topic/${topicId}/concept/${conceptId}`}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            👁️
          </Link>
        ))}
      {insideLink ? (
        <button
          onClick={handleEdit}
          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          ✏️
        </button>
      ) : (
        <Link
          href={`/topic/${topicId}/concept/${conceptId}/edit`}
          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          ✏️
        </Link>
      )}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 transition-colors"
      >
        {deleting ? "..." : "✕"}
      </button>
    </div>
  );
}
