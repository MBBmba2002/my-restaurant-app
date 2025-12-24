"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // 如果已登录，自动跳转到记账页面
        router.replace("/record/");
      } else {
        // 如果未登录，跳转到登录页面
        router.replace("/login/");
      }
    }
  }, [user, loading, router]);

  // 加载中显示
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="text-lg text-zinc-600 dark:text-zinc-400">加载中...</div>
    </div>
  );
}
