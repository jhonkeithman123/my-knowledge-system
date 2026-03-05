"use server";

import { supabaseServer } from "@my-knowledge/db/supabaseServer";
import { NewTopicSchema, NewConceptSchema } from "@my-knowledge/contracts";
import { revalidatePath } from "next/cache";
import {
  CreationError,
  DeleteError,
  handleZodError,
  handleSupabaseError,
  toErrorResponse,
  toSuccessResponse,
  type ApiResponse,
} from "@my-knowledge/utils";

export async function createTopic(formData: FormData): Promise<ApiResponse> {
  const rawData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    parent_id: (formData.get("parent_id") as string) || null,
  };

  try {
    const validated = NewTopicSchema.parse(rawData);

    const { data, error } = await supabaseServer
      .from("topics")
      .insert(validated)
      .select()
      .single();

    if (error) throw handleSupabaseError(error, "insert", "topics");
    if (!data)
      throw new CreationError("topic", "No data returned from database");

    // Revalidate affected pages
    revalidatePath("/");
    revalidatePath("/topic");
    if (validated.parent_id) {
      revalidatePath(`/topic/${validated.parent_id}`);
    }

    return toSuccessResponse(data);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return toErrorResponse(handleZodError(error, "topic"));
    }

    return toErrorResponse(error);
  }
}

export async function deleteTopic(topicId: string): Promise<ApiResponse> {
  try {
    const { error: conceptsError } = await supabaseServer
      .from("concepts")
      .delete()
      .eq("topic_id", topicId);

    if (conceptsError) {
      throw handleSupabaseError(conceptsError, "delete", "concepts");
    }

    const { error: subtopicsError } = await supabaseServer
      .from("topics")
      .delete()
      .eq("parent_id", topicId);

    if (subtopicsError) {
      throw handleSupabaseError(subtopicsError, "delete", "subtopics");
    }

    const { error } = await supabaseServer
      .from("topics")
      .delete()
      .eq("id", topicId);

    if (error) throw handleSupabaseError(error, "delete", "topics");

    revalidatePath("/");
    revalidatePath("/topic");

    return toSuccessResponse({ deleted: true });
  } catch (error: any) {
    return toErrorResponse(new DeleteError("topic", topicId, error.message));
  }
}

export async function createConcept(formData: FormData): Promise<ApiResponse> {
  const rawData = {
    topic_id: formData.get("topic_id") as string,
    name: formData.get("name") as string,
    definition: formData.get("definition") as string,
  };

  try {
    const validated = NewConceptSchema.parse(rawData);

    const { data, error } = await supabaseServer
      .from("concepts")
      .insert(validated)
      .select()
      .single();

    if (error) throw handleSupabaseError(error, "insert", "concepts");
    if (!data)
      throw new CreationError("concept", "No data returned from database");

    revalidatePath(`/topic/${validated.topic_id}`);

    return toSuccessResponse(data);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return toErrorResponse(handleZodError(error, "concept"));
    }

    return toErrorResponse(error);
  }
}

export async function deleteConcept(
  conceptId: string,
  topicId: string,
): Promise<ApiResponse> {
  try {
    const { error } = await supabaseServer
      .from("concepts")
      .delete()
      .eq("id", conceptId);

    if (error) throw handleSupabaseError(error, "delete", "concepts");

    revalidatePath(`/topic/${topicId}`);

    return toSuccessResponse({ deleted: true });
  } catch (error: any) {
    return toErrorResponse(
      new DeleteError("concept", conceptId, error.message),
    );
  }
}
