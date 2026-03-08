// apps/web/src/components/ConceptCard.tsx
"use client";

import Link from "next/link";
import { ConceptActions } from "./ConceptActions";
import type { Concept } from "@my-knowledge/contracts";

export function ConceptCard({
  concept,
  topicId,
}: {
  concept: Concept;
  topicId: string;
}) {
  return (
    <Link
      href={`/topic/${topicId}/concept/${concept.id}`}
      className="block p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex-1">
          {concept.name}
        </h3>
        <div onClick={(e) => e.stopPropagation()}>
          <ConceptActions
            conceptId={concept.id}
            conceptName={concept.name}
            topicId={topicId}
            insideLink={true}
          />
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {concept.definition}
      </p>
    </Link>
  );
}
