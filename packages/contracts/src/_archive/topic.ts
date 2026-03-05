// packages/contracts/src/topic.ts
import { z } from "zod";

export const TopicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
  parent_id: z.string().uuid().nullable(),
  created_at: z.string().optional(),
});

export type Topic = z.infer<typeof TopicSchema>;

export const NewTopicSchema = z.object({
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
});

export type NewTopic = z.infer<typeof NewTopicSchema>;
