// packages/api/src/search.ts
import { supabase } from "@my-knowledge/db";
import { TopicSchema, ConceptSchema } from "@my-knowledge/contracts";

export async function searchAll(query: string) {
  const searchTerm = query.toLowerCase();

  const [topicsResult, conceptsResult] = await Promise.all([
    supabase
      .from("topics")
      .select("id, name, description, parent_id, created_at")
      .textSearch("name", searchTerm, {
        type: "websearch",
        config: "english",
      })
      .limit(50),
    supabase
      .from("concepts")
      .select("id, name, definition, topic_id, created_at")
      .textSearch("name", searchTerm, {
        type: "websearch",
        config: "english",
      })
      .limit(50),
  ]);

  const topics = topicsResult.data
    ? TopicSchema.array().parse(
        topicsResult.data.map((t) => ({
          ...t,
          created_at: t.created_at
            ? new Date(t.created_at).toISOString()
            : undefined,
        })),
      )
    : [];

  const concepts = conceptsResult.data
    ? ConceptSchema.array().parse(
        conceptsResult.data.map((c) => ({
          ...c,
          created_at: c.created_at
            ? new Date(c.created_at).toISOString()
            : undefined,
        })),
      )
    : [];

  return {
    topics: topics.filter((t) => !t.parent_id),
    subtopics: topics.filter((t) => t.parent_id),
    concepts,
  };
}
