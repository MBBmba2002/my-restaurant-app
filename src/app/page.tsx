"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    // Use replace instead of push to avoid adding to history
    router.replace("/record");
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setRedirecting(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f2eada] flex items-center justify-center">
      <div className="text-[#0c0c0c] text-xl">
        {redirecting ? "正在跳转..." : "跳转失败，请手动访问 /record"}
      </div>
    </div>
  );
}
