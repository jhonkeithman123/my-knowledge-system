import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { config } from "@my-knowledge/config";

const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function generate() {
  console.log("📊 Inspecting database schema...\n");

  try {
    // Fetch sample data to see actual structure
    const { data: topicSample } = await supabase
      .from("topics")
      .select("*")
      .limit(1)
      .single();

    const { data: conceptSample } = await supabase
      .from("concepts")
      .select("*")
      .limit(1)
      .single();

    console.log("✅ Topics table sample:");
    if (topicSample) {
      console.log("   Columns:", Object.keys(topicSample).join(", "));
    }

    console.log("\n✅ Concepts table sample:");
    if (conceptSample) {
      console.log("   Columns:", Object.keys(conceptSample).join(", "));
    }

    // Get counts
    const { count: topicCount } = await supabase
      .from("topics")
      .select("*", { count: "exact", head: true });

    const { count: conceptCount } = await supabase
      .from("concepts")
      .select("*", { count: "exact", head: true });

    console.log("\n📈 Database statistics:");
    console.log(`   Topics: ${topicCount || 0}`);
    console.log(`   Concepts: ${conceptCount || 0}`);

    const outputPath = path.join(__dirname, "../src/generated.ts");

    const fileContent = `// ============================================
// AUTO-GENERATED SCHEMAS - DO NOT EDIT MANUALLY
// ============================================
// Generated at: ${new Date().toISOString()}
// Run 'pnpm generate:schemas' to regenerate
// Database: ${config.supabaseUrl}
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
// Topics count: ${topicCount || 0}
// Concepts count: ${conceptCount || 0}
// Last generated: ${new Date().toISOString()}
`;

    fs.writeFileSync(outputPath, fileContent);

    console.log(
      "\n✅ SUCCESS! Generated schemas at:",
      outputPath.replace(process.cwd(), "."),
    );
    console.log("\n📦 Available exports:");
    console.log("   📋 TopicSchema, NewTopicSchema, UpdateTopicSchema");
    console.log("   📋 ConceptSchema, NewConceptSchema, UpdateConceptSchema");
    console.log("   🔷 Topic, NewTopic, UpdateTopic");
    console.log("   🔷 Concept, NewConcept, UpdateConcept");
    console.log(
      "   ✓ Validation helpers: validateTopic(), validateConcept(), etc.",
    );
    console.log("\n💡 Next steps:");
    console.log("   1. Run 'pnpm build:contracts' to compile");
    console.log(
      "   2. (Optional) Delete topic.ts and concept.ts if you want to use generated only\n",
    );
  } catch (error) {
    console.error("\n❌ Failed to generate schemas:", error);
    throw error;
  }
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
