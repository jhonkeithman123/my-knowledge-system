// packages/contracts/src/concept.ts
import { z } from "zod";

export const ConceptSchema = z.object({
  id: z.string().uuid(),
  topic_id: z.string().uuid(),
  name: z.string().min(1, "Concept name is required"),
  definition: z.string().min(1, "Definition is required"),
  created_at: z.string().optional(),
});

export type Concept = z.infer<typeof ConceptSchema>;

export const NewConceptSchema = z.object({
  topic_id: z.string().uuid(),
  name: z.string().min(1, "Concept name is required"),
  definition: z.string().min(1, "Definition is required"),
});

export type NewConcept = z.infer<typeof NewConceptSchema>;
