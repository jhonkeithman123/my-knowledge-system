// packages/api/src/topics.ts
import { supabase } from "@my-knowledge/db";
import {
  TopicSchema,
  NewTopicSchema,
  UpdateTopicSchema,
} from "@my-knowledge/contracts";

export async function getTopics() {
  const { data, error } = await supabase
    .from("topics")
    .select("id, name, description, parent_id, created_at")
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const normalized = (data || []).map((t) => ({
    ...t,
    created_at: t.created_at ? new Date(t.created_at).toISOString() : undefined,
  }));

  return TopicSchema.array().parse(normalized);
}

export async function getTopic(id: string) {
  const { data, error } = await supabase
    .from("topics")
    .select("id, name, description, parent_id, created_at")
    .eq("id", id)
    .single();

  if (error) throw error;

  const normalized = {
    ...data,
    created_at: data.created_at
      ? new Date(data.created_at).toISOString()
      : undefined,
  };

  return TopicSchema.parse(normalized);
}

export async function getSubtopics(parentId: string) {
  const { data, error } = await supabase
    .from("topics")
    .select("id, name, description, parent_id, created_at")
    .eq("parent_id", parentId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;

  const normalized = (data || []).map((t) => ({
    ...t,
    created_at: t.created_at ? new Date(t.created_at).toISOString() : undefined,
  }));

  return TopicSchema.array().parse(normalized);
}

export async function createTopic(data: {
  name: string;
  description?: string;
  parent_id?: string;
}) {
  const validated = NewTopicSchema.parse({
    name: data.name,
    description: data.description || null,
    parent_id: data.parent_id || null,
  });

  const { data: result, error } = await supabase
    .from("topics")
    .insert(validated)
    .select("id, name, description, parent_id, created_at")
    .single();

  if (error) throw error;
  return TopicSchema.parse(result);
}

export async function updateTopic(
  id: string,
  data: { name?: string; description?: string },
) {
  const validated = UpdateTopicSchema.parse(data);

  const { data: result, error } = await supabase
    .from("topics")
    .update(validated)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return TopicSchema.parse(result);
}

export async function deleteTopic(id: string) {
  // Delete concepts first
  await supabase.from("concepts").delete().eq("topic_id", id);

  // Delete subtopics
  await supabase.from("topics").delete().eq("parent_id", id);

  // Delete topic
  const { error } = await supabase.from("topics").delete().eq("id", id);

  if (error) throw error;
  return { success: true };
}
