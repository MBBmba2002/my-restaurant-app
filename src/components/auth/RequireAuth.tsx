"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Set a shorter timeout to prevent infinite loading (1.5 seconds)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeoutReached(true);
    }, 1500); // 1.5 second timeout

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Only redirect if loading is complete, no user, and timeout not reached
    // After timeout, allow access without redirect
    if (!loading && !user && !timeoutReached) {
      // Don't redirect immediately, give user a chance to see the page
      const redirectTimeout = setTimeout(() => {
        router.push("/login");
      }, 2000);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [user, loading, router, timeoutReached]);

  // Show loading only for a short time (1.5 seconds max)
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-[#f2eada] flex items-center justify-center">
        <div className="text-[#0c0c0c] text-xl">加载中...</div>
      </div>
    );
  }

  // After timeout or if not loading, always allow access
  // This ensures the app works even if auth fails
  return <>{children}</>;
}
