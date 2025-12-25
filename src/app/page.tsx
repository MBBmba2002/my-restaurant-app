"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Use window.location for static export compatibility
    // This works in both static export and regular Next.js
    if (typeof window !== "undefined" && !redirected) {
      setRedirected(true);
      // Use absolute path to ensure it works on GitHub Pages
      const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
      const targetPath = `${basePath}/record/`;
      window.location.href = targetPath;
    }
  }, [redirected]);

  return (
    <div className="min-h-screen bg-[#f2eada] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#0c0c0c] text-xl mb-4">正在跳转...</div>
        <Link 
          href="/record/" 
          className="text-[#ab322a] underline text-lg hover:text-[#ab322a]/80"
        >
          如果未自动跳转，请点击这里
        </Link>
      </div>
    </div>
  );
}
