"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateConcept } from "@/app/actions/topicActions";
import type { Concept } from "@my-knowledge/contracts";

export function EditConceptForm({
  concept,
  topicId,
  topicName,
}: {
  concept: Concept;
  topicId: string;
  topicName: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateConcept(concept.id, topicId, formData);

      if (result.success) {
        router.push(`/topic/${topicId}`);
        router.refresh();
      } else {
        setError(result.error);

        if (result.details?.field) {
          setFieldErrors({ [result.details.field]: result.error });
        }
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6 space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Concept Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={concept.name}
          className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border ${
            fieldErrors.name
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-slate-600"
          } text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500`}
          placeholder="e.g., Hooks, Neural Networks, Industrial Revolution"
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="definition"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Definition *
        </label>
        <textarea
          id="definition"
          name="definition"
          required
          rows={6}
          defaultValue={concept.definition}
          className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border ${
            fieldErrors.definition
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-slate-600"
          } text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500`}
          placeholder="Provide a clear and concise definition of this concept..."
        />
        {fieldErrors.definition && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.definition}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Explain what this concept means and why it's important
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 disabled:from-green-400 disabled:to-emerald-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isPending ? "Updating..." : "Update Concept"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
