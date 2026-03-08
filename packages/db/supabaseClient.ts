import { createClient } from "@supabase/supabase-js";
import { config } from "@my-knowledge/config";

const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});
