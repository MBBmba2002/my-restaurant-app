"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Set a shorter timeout to prevent infinite loading (2 seconds)
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.log("Auth timeout - allowing access without authentication");
        setLoading(false);
      }
    }, 2000); // 2 second timeout

    // Get initial session with error handling
    const initAuth = async () => {
      try {
        // Add a timeout for the auth call itself (1.5 seconds)
        const authPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Auth timeout")), 1500)
        );
        
        try {
          const result = await Promise.race([authPromise, timeoutPromise]);
          const { data: { session }, error } = result;
          
          if (!mounted) return;
          
          if (error) {
            console.warn("Auth session error (non-blocking):", error);
            setLoading(false);
            clearTimeout(timeoutId);
            return;
          }
          
          setUser(session?.user ?? null);
          setLoading(false);
          clearTimeout(timeoutId);
        } catch (raceError) {
          // Timeout or other error - allow app to continue
          if (!mounted) return;
          console.warn("Auth check timed out or failed (non-blocking):", raceError);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      } catch (error) {
        if (!mounted) return;
        console.warn("Auth initialization failed (non-blocking):", error);
        // Allow app to continue even if auth fails
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
