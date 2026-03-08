// packages/config/env-loader.mobile.ts
// For React Native/Expo
export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
};
