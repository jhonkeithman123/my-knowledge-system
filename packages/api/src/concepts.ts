// packages/api/src/concepts.ts
import { supabase } from "@my-knowledge/db";
import {
  ConceptSchema,
  NewConceptSchema,
  UpdateConceptSchema,
} from "@my-knowledge/contracts";

export async function getConcepts(topicId: string) {
  const { data, error } = await supabase
    .from("concepts")
    .select("id, name, definition, topic_id, created_at")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;

  const normalized = (data || []).map((c) => ({
    ...c,
    created_at: c.created_at ? new Date(c.created_at).toISOString() : undefined,
  }));

  return ConceptSchema.array().parse(normalized);
}

export async function getConcept(id: string) {
  const { data, error } = await supabase
    .from("concepts")
    .select("id, name, definition, topic_id, created_at")
    .eq("id", id)
    .single();

  if (error) throw error;

  const normalized = {
    ...data,
    created_at: data.created_at
      ? new Date(data.created_at).toISOString()
      : undefined,
  };

  return ConceptSchema.parse(normalized);
}

export async function createConcept(data: {
  topic_id: string;
  name: string;
  definition: string;
}) {
  const validated = NewConceptSchema.parse(data);

  const { data: result, error } = await supabase
    .from("concepts")
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return ConceptSchema.parse(result);
}

export async function updateConcept(
  id: string,
  data: { name?: string; definition?: string },
) {
  const validated = UpdateConceptSchema.parse(data);

  const { data: result, error } = await supabase
    .from("concepts")
    .update(validated)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return ConceptSchema.parse(result);
}

export async function deleteConcept(id: string) {
  const { error } = await supabase.from("concepts").delete().eq("id", id);

  if (error) throw error;
  return { success: true };
}

export async function searchConcepts(query: string) {
  const { data, error } = await supabase
    .from("concepts")
    .select("id, name, definition, topic_id, created_at")
    .textSearch("name", query.toLowerCase(), {
      type: "websearch",
      config: "english",
    })
    .limit(50);

  if (error) throw error;

  const normalized = (data || []).map((c) => ({
    ...c,
    created_at: c.created_at ? new Date(c.created_at).toISOString() : undefined,
  }));

  return ConceptSchema.array().parse(normalized);
}
