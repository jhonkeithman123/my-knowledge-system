// ============================================
// AUTO-GENERATED SCHEMAS - DO NOT EDIT MANUALLY
// ============================================
// Generated at: 2026-03-05T09:41:08.613Z
// Run 'pnpm generate:schemas' to regenerate
// Database: https://kwejallgwtyswycnhaca.supabase.co
// ============================================

import { z } from "zod";

// ============================================
// TOPICS TABLE SCHEMA
// ============================================
// Full schema for topics from database
export const TopicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(), // Matches your existing pattern
  parent_id: z.string().uuid().nullable(),
  created_at: z.string().optional(), // Matches your existing pattern
});

export type Topic = z.infer<typeof TopicSchema>;

// Schema for creating new topics (omits auto-generated fields)
export const NewTopicSchema = z.object({
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
});

export type NewTopic = z.infer<typeof NewTopicSchema>;

// Schema for updating topics (all fields optional)
export const UpdateTopicSchema = z.object({
  name: z.string().min(1, "Topic name is required").optional(),
  description: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
});

export type UpdateTopic = z.infer<typeof UpdateTopicSchema>;

// ============================================
// CONCEPTS TABLE SCHEMA
// ============================================
// Full schema for concepts from database
export const ConceptSchema = z.object({
  id: z.string().uuid(),
  topic_id: z.string().uuid(),
  name: z.string().min(1, "Concept name is required"),
  definition: z.string().min(1, "Definition is required"),
  created_at: z.string().optional(), // Matches your existing pattern
});

export type Concept = z.infer<typeof ConceptSchema>;

// Schema for creating new concepts (omits auto-generated fields)
export const NewConceptSchema = z.object({
  topic_id: z.string().uuid(),
  name: z.string().min(1, "Concept name is required"),
  definition: z.string().min(1, "Definition is required"),
});

export type NewConcept = z.infer<typeof NewConceptSchema>;

// Schema for updating concepts (all fields optional)
export const UpdateConceptSchema = z.object({
  name: z.string().min(1, "Concept name is required").optional(),
  definition: z.string().min(1, "Definition is required").optional(),
});

export type UpdateConcept = z.infer<typeof UpdateConceptSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================
export function validateTopic(data: unknown): Topic {
  return TopicSchema.parse(data);
}

export function validateNewTopic(data: unknown): NewTopic {
  return NewTopicSchema.parse(data);
}

export function validateUpdateTopic(data: unknown): UpdateTopic {
  return UpdateTopicSchema.parse(data);
}

export function validateConcept(data: unknown): Concept {
  return ConceptSchema.parse(data);
}

export function validateNewConcept(data: unknown): NewConcept {
  return NewConceptSchema.parse(data);
}

export function validateUpdateConcept(data: unknown): UpdateConcept {
  return UpdateConceptSchema.parse(data);
}

// ============================================
// DATABASE STATS (at generation time)
// ============================================
// Topics count: 5
// Concepts count: 3
// Last generated: 2026-03-05T09:41:08.613Z
