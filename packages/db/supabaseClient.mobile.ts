// packages/db/supabaseClient.mobile.ts
import { createClient } from "@supabase/supabase-js";
import { config } from "@my-knowledge/config/env-loader.mobile";

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "x-connection-pool": "true",
      },
    },
  },
);
