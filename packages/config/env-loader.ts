import dotenv from "dotenv";
import path from "path";

// Load environment variables from packages/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Validate required environment variables
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

// Export typed configuration
export const config = {
  // Supabase
  supabaseUrl: requireEnv("SUPABASE_URL"),
  supabaseServiceKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseAnonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),

  // Environment
  env: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV !== "production",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// Type-safe config
export type Config = typeof config;

// Log loaded config (hide sensitive data)
if (config.isDevelopment) {
  console.log("📝 Loaded configuration:", {
    supabaseUrl: config.supabaseUrl,
    supabaseServiceKey: config.supabaseServiceKey.slice(0, 20) + "...",
    supabaseAnonKey: config.supabaseAnonKey.slice(0, 20) + "...",
    env: config.env,
  });
}
