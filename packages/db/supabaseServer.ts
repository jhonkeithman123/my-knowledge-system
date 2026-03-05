import { createClient } from "@supabase/supabase-js";
import { config } from "@my-knowledge/config";

// Server-only client - uses service role key
export const supabaseServer = createClient(
  config.supabaseUrl,
  config.supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);
