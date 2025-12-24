import { createClient } from "@supabase/supabase-js";

// Helper to get localStorage for browser environment
const getStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return undefined;
};

// Get environment variables - these MUST be set at build time
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that environment variables are set - throw error if missing
if (!url || typeof url !== "string" || url.trim() === "") {
  throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL must be set at build time. Please set it in GitHub Secrets.");
}

if (!anon || typeof anon !== "string" || anon.trim() === "") {
  throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_ANON_KEY must be set at build time. Please set it in GitHub Secrets.");
}

// Validate URL format before passing to createClient
try {
  const testUrl = new URL(url);
  if (testUrl.protocol !== "https:" && testUrl.protocol !== "http:") {
    throw new Error(`Invalid protocol: ${testUrl.protocol}. Must be http: or https:`);
  }
} catch (error) {
  throw new Error(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: "${url}". Error: ${error}`);
}

export const supabase = createClient(
  url,
  anon,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: getStorage(),
    },
  }
);
