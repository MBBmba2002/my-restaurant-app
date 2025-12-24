import { createClient } from "@supabase/supabase-js";

// Helper to get localStorage for browser environment
const getStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return undefined;
};

// Get environment variables - these MUST be set at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || supabaseUrl.trim() === "") {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is not set. Please set it in GitHub Secrets.");
}

if (!supabaseAnonKey || supabaseAnonKey.trim() === "") {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set. Please set it in GitHub Secrets.");
}

// Validate URL format - must be a valid HTTPS URL
let parsedUrl: URL;
try {
  parsedUrl = new URL(supabaseUrl);
  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw new Error(`Invalid protocol: ${parsedUrl.protocol}`);
  }
  if (!supabaseUrl.includes(".supabase.co")) {
    console.warn("Warning: NEXT_PUBLIC_SUPABASE_URL does not appear to be a Supabase URL");
  }
} catch (error) {
  throw new Error(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${supabaseUrl}. Error: ${error}`);
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: getStorage(),
    },
  }
);
