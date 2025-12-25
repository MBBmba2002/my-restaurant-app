"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Set a very short timeout to prevent infinite loading (1 second)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeoutReached(true);
    }, 1000); // 1 second timeout

    return () => clearTimeout(timeoutId);
  }, []);

  // Show loading only for a very short time (1 second max)
  // After timeout, always allow access - no blocking redirects
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-[#f2eada] flex items-center justify-center">
        <div className="text-[#0c0c0c] text-xl">加载中...</div>
      </div>
    );
  }

  // Always allow access - no authentication blocking for static export
  return <>{children}</>;
}
