"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <main className="w-full max-w-md text-center">
        <h1 className="mb-8 text-4xl font-bold text-black dark:text-zinc-50">
          蒙记肉夹馍记账
        </h1>
        
        {loading ? (
          <div className="text-zinc-600 dark:text-zinc-400">加载中...</div>
        ) : user ? (
          <div className="space-y-4">
            <p className="text-lg text-zinc-700 dark:text-zinc-300">
              已登录: {user.email}
            </p>
            <Link
              href="/test/"
              className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              进入 /test/
            </Link>
          </div>
        ) : (
          <Link
            href="/login/"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            去登录
          </Link>
        )}
      </main>
    </div>
  );
}
