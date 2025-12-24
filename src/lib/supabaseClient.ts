import { createClient } from "@supabase/supabase-js";

// Helper to get localStorage for browser environment
const getStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return undefined;
};

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Validate URL format to avoid build-time errors
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Use placeholder URLs during build if environment variables are invalid
const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : "https://placeholder.supabase.co";
const finalKey = supabaseAnonKey.length > 10 ? supabaseAnonKey : "placeholder-anon-key-for-build";

export const supabase = createClient(
  finalUrl,
  finalKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: getStorage(),
    },
  }
);

