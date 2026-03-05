import { createClient } from "@supabase/supabase-js";
import { config } from "@my-knowledge/config/env-loader";

const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
