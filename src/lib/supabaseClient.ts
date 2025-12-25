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

// Use fallback values if env vars are not set (for development/local testing)
const trimmedUrl = (url && typeof url === "string" && url.trim() !== "") 
  ? url.trim() 
  : "https://placeholder.supabase.co";

const trimmedAnon = (anon && typeof anon === "string" && anon.trim() !== "") 
  ? anon.trim() 
  : "placeholder-anon-key";

// Validate URL format before passing to createClient
let parsedUrl: URL;
try {
  parsedUrl = new URL(trimmedUrl);
  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    console.warn(`Invalid Supabase URL protocol: ${parsedUrl.protocol}. Using placeholder.`);
  }
} catch (error: any) {
  console.warn(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: "${trimmedUrl}". Using placeholder.`);
}

// Create Supabase client with error handling
export const supabase = createClient(
  trimmedUrl,
  trimmedAnon,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: getStorage(),
    },
  }
);
