import { createClient } from "@supabase/supabase-js";

// Helper to get localStorage for browser environment
const getStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return undefined;
};

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Validate URL format
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Use placeholder URLs only during build if environment variables are missing/invalid
// For static export, these will be replaced at build time if env vars are set
const finalUrl: string = isValidUrl(supabaseUrl) 
  ? supabaseUrl 
  : (typeof window === "undefined" ? "https://placeholder.supabase.co" : "https://placeholder.supabase.co");
const finalKey: string = (supabaseAnonKey && supabaseAnonKey.length > 10)
  ? supabaseAnonKey 
  : (typeof window === "undefined" ? "placeholder-anon-key-for-build" : "placeholder-anon-key-for-build");

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

