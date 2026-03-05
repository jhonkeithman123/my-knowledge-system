"use client";

import { useState, useEffect } from "react";
import { supabase } from "@my-knowledge/db";
import { NewTopicSchema, NewTopic } from "@my-knowledge/contracts";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewTopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent");
  
  const [form, setForm] = useState<NewTopic>({
    name: "",
    description: "",
    parent_id: parentId || null,
  });
  const [parentName, setParentName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (parentId) {
      // Fetch parent topic name for display
      const fetchParent = async () => {
        const { data } = await supabase
          .from("topics")
          .select("name")
          .eq("id", parentId)
          .single();
        if (data) setParentName(data.name);
      };
      fetchParent();
    }
  }, [parentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validated = NewTopicSchema.parse(form);
      const { error } = await supabase.from("topics").insert(validated);

      if (error) setError(error.message);
      else router.push("/topic");
    } catch (validationError: any) {
      setError(validationError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Topic</h1>
        <p className="text-gray-600 mt-2">
          Create a new topic to organize your knowledge
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Topic Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
            placeholder="e.g., React, Machine Learning, History"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
            placeholder="Describe what this topic covers..."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Create Topic"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
