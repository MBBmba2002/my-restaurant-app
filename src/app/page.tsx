"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/record");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f2eada] flex items-center justify-center">
      <div className="text-[#0c0c0c] text-xl">正在跳转...</div>
    </div>
  );
}
