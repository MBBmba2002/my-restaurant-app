"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeoutReached(true);
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Only redirect if loading is complete and no user
    if (!loading && !user && !timeoutReached) {
      router.push("/login");
    }
  }, [user, loading, router, timeoutReached]);

  // Show loading only for a short time
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-[#f2eada] flex items-center justify-center">
        <div className="text-[#0c0c0c] text-xl">加载中...</div>
      </div>
    );
  }

  // If timeout reached or no user, allow access (for development)
  // In production, you might want to redirect to login
  if (!user && timeoutReached) {
    // Allow access even without authentication for now
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
