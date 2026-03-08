// packages/db/index.ts
const isReactNative =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

let supabase: any;

if (isReactNative) {
  supabase = require("./supabaseClient.mobile").supabase;
} else {
  supabase = require("./supabaseClient").supabase;
}

export { supabase };
