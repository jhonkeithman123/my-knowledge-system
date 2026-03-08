"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTopic } from "@/app/actions/topicActions";
import type { Topic } from "@my-knowledge/contracts";

export function EditTopicForm({ topic }: { topic: Topic }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    const result = await updateTopic(topic.id, formData);

    startTransition(() => {
      if (result.success) {
        router.push(`/topic/${topic.id}`);
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
          {topic.parent_id ? "Subtopic" : "Topic"} Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={topic.name}
          className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border ${
            fieldErrors.name
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-slate-600"
          } text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500`}
          placeholder="e.g., React, Machine Learning, History"
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={topic.description || ""}
          className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border ${
            fieldErrors.description
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-slate-600"
          } text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500`}
          placeholder="Describe what this topic covers..."
        />
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.description}
          </p>
        )}
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
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-purple-700 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isPending ? "Updating..." : "Update Topic"}
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
