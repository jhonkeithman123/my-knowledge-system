"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@my-knowledge/db";
import { TopicSchema, Topic, ConceptSchema, Concept } from "@my-knowledge/contracts";
import Link from "next/link";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [subtopics, setSubtopics] = useState<Topic[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        // Fetch the main topic
        const { data: topicData, error: topicError } = await supabase
          .from("topics")
          .select("*")
          .eq("id", topicId)
          .single();

        if (topicError) throw topicError;

        const normalized = {
          ...topicData,
          created_at: topicData.created_at
            ? new Date(topicData.created_at).toISOString()
            : undefined,
        };
        const validatedTopic = TopicSchema.parse(normalized);
        setTopic(validatedTopic);

        // Fetch subtopics (children)
        const { data: subtopicsData, error: subtopicsError } = await supabase
          .from("topics")
          .select("*")
          .eq("parent_id", topicId)
          .order("created_at", { ascending: false });

        if (subtopicsError) throw subtopicsError;

        const normalizedSubtopics = (subtopicsData || []).map((t) => ({
          ...t,
          created_at: t.created_at
            ? new Date(t.created_at).toISOString()
            : undefined,
        }));
        const validatedSubtopics = TopicSchema.array().parse(normalizedSubtopics);
        setSubtopics(validatedSubtopics);

        // Fetch concepts
        const { data: conceptsData, error: conceptsError } = await supabase
          .from("concepts")
          .select("*")
          .eq("topic_id", topicId)
          .order("created_at", { ascending: false });

        if (conceptsError) throw conceptsError;

        const normalizedConcepts = (conceptsData || []).map((c) => ({
          ...c,
          created_at: c.created_at
            ? new Date(c.created_at).toISOString()
            : undefined,
        }));
        const validatedConcepts = ConceptSchema.array().parse(normalizedConcepts);
        setConcepts(validatedConcepts);

        // Build breadcrumbs by traversing parent_id chain
        const breadcrumbsList: Topic[] = [];
        let currentTopic = validatedTopic;
        
        while (currentTopic.parent_id) {
          const { data: parentData } = await supabase
            .from("topics")
            .select("*")
            .eq("id", currentTopic.parent_id)
            .single();

          if (parentData) {
            const normalizedParent = {
              ...parentData,
              created_at: parentData.created_at
                ? new Date(parentData.created_at).toISOString()
                : undefined,
            };
            const validatedParent = TopicSchema.parse(normalizedParent);
            breadcrumbsList.unshift(validatedParent);
            currentTopic = validatedParent;
          } else {
            break;
          }
        }
        
        setBreadcrumbs(breadcrumbsList);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load topic");
      } finally {
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [topicId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading topic...</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || "Topic not found"}</p>
        <Link href="/topic" className="text-blue-600 hover:text-blue-700">
          ← Back to topics
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/topic" className="hover:text-blue-600">
          Topics
        </Link>
        {breadcrumbs.map((crumb) => (
          <span key={crumb.id} className="flex items-center space-x-2">
            <span>/</span>
            <Link href={`/topic/${crumb.id}`} className="hover:text-blue-600">
              {crumb.name}
            </Link>
          </span>
        ))}
        <span>/</span>
        <span className="text-gray-900 font-medium">{topic.name}</span>
      </nav>

      {/* Topic Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic.name}</h1>
        {topic.description && (
          <p className="text-gray-600 text-lg">{topic.description}</p>
        )}
      </div>

      {/* Subtopics Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Subtopics</h2>
          <Link
            href={`/topic/new?parent=${topicId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + Add Subtopic
          </Link>
        </div>

        {subtopics.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No subtopics yet.{" "}
            <Link
              href={`/topic/new?parent=${topicId}`}
              className="text-blue-600 hover:text-blue-700"
            >
              Create one
            </Link>
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {subtopics.map((sub) => (
              <Link
                key={sub.id}
                href={`/topic/${sub.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {sub.name}
                </h3>
                {sub.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {sub.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Concepts Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Concepts</h2>
          <Link
            href={`/topic/${topicId}/concept/new`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            + Add Concept
          </Link>
        </div>

        {concepts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No concepts yet.{" "}
            <Link
              href={`/topic/${topicId}/concept/new`}
              className="text-blue-600 hover:text-blue-700"
            >
              Create one
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {concept.name}
                </h3>
                <p className="text-gray-700">{concept.definition}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
