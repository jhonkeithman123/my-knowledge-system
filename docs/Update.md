# Web App Status Update (Knowledge Management System)

## ✅ Current Setup

- Using **Next.js App Router** (`apps/web/src/app/`)
- Root layout added (`layout.tsx`) with `<html>` and `<body>` tags
- Supabase client imported from `@my-knowledge/db`
- Contracts package (`@my-knowledge/contracts`) built to JS + types and consumed in web
- Topics page (`app/topics/page.tsx`) fetches data from Supabase and validates with Zod

## ⚠️ Issues Encountered

- **ZodError**: Supabase `created_at` timestamps include `+00:00` offset, which fails strict `.datetime()` validation
  - Example error: `Invalid ISO datetime`
- Temporary fix: normalize `created_at` with `new Date(created_at).toISOString()` before validation
- Alternative: relax schema to `z.string().optional()` or regex that accepts both `Z` and `+00:00`

## 📦 Contracts Package

- `TopicSchema` and `ConceptSchema` defined with Zod
- Built via `tsc -p tsconfig.json` → outputs to `dist/`
- Web app imports contracts via `workspace:*` dependency in `apps/web/package.json`

## 🛠️ Next Steps

1. Add `NewTopicSchema` in contracts for validating user input before inserting into Supabase
2. Scaffold **Add Topic form page** (`app/topic/new/page.tsx`) in web
   - Use `NewTopicSchema` for frontend validation
   - Insert validated data into Supabase
3. Normalize Supabase timestamps before validation or adjust schema

## 🚀 Commands

- Build contracts:
  ```bash
  pnpm build:contracts
  ```

# Web + Contracts Update

## ✅ Contracts Package

### New Schema for User Input

Add a `NewTopicSchema` alongside `TopicSchema` in `packages/contracts/src/topic.ts`:

```ts
import { z } from "zod";

export const TopicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
  created_at: z.string().optional(), // Supabase returns offset timestamps
});

export type Topic = z.infer<typeof TopicSchema>;

// For frontend form validation
export const NewTopicSchema = z.object({
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
});

export type NewTopic = z.infer<typeof NewTopicSchema>;
```
