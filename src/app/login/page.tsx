"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Debug: Log Supabase URL on mount
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const urlPreview = supabaseUrl.substring(0, 20) + "...";
      console.log("[DEBUG] Supabase URL (first 20 chars):", urlPreview);
    } else {
      console.warn("[DEBUG] NEXT_PUBLIC_SUPABASE_URL is not set");
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      console.log("[DEBUG] Calling signUp with email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      // Detailed error logging
      console.log("[DEBUG] signUp response:");
      console.log("  - error (full object):", error);
      console.log("  - error?.message:", error?.message);
      console.log("  - error?.status:", error?.status);
      console.log("  - data (full object):", data);
      console.log("  - data?.session:", data?.session);
      console.log("  - data?.user:", data?.user);

      if (error) {
        const errorMessage = error.message ?? JSON.stringify(error) ?? "Unknown error";
        console.error("[ERROR] signUp failed:", errorMessage);
        setError(errorMessage);
        return;
      }

      // 注册成功后，如果有 session，说明自动登录成功，直接跳转
      if (data?.session) {
        console.log("[SUCCESS] Sign up and auto-login successful");
        // 直接跳转到首页，不等待
        window.location.href = "/my-restaurant-app/";
      } else {
        // 如果没有 session，可能是需要邮箱验证，但我们配置为不需要验证
        console.warn("[WARNING] signUp succeeded but no session returned");
        setError("注册成功，但登录失败，请尝试登录");
        setMode("login");
      }
    } catch (err: any) {
      console.error("[ERROR] Unexpected error in handleSignUp:", err);
      const errorMessage = err?.message ?? JSON.stringify(err) ?? "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      console.log("[DEBUG] Calling signInWithPassword with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Detailed error logging
      console.log("[DEBUG] signInWithPassword response:");
      console.log("  - error (full object):", error);
      console.log("  - error?.message:", error?.message);
      console.log("  - error?.status:", error?.status);
      console.log("  - data (full object):", data);
      console.log("  - data?.session:", data?.session);
      console.log("  - data?.user:", data?.user);

      if (error) {
        const errorMessage = error.message ?? JSON.stringify(error) ?? "Unknown error";
        console.error("[ERROR] signInWithPassword failed:", errorMessage);
        setError(errorMessage);
        return;
      }

      console.log("[SUCCESS] Sign in successful");
      // Redirect to home page with basePath consideration
      window.location.href = "/my-restaurant-app/";
    } catch (err: any) {
      console.error("[ERROR] Unexpected error in handleSignIn:", err);
      const errorMessage = err?.message ?? JSON.stringify(err) ?? "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === "login" ? handleSignIn : handleSignUp;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
          {mode === "login" ? "登录" : "注册"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              邮箱地址
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="请输入密码"
              minLength={6}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-200">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Debug: Show Supabase URL preview */}
          {process.env.NEXT_PUBLIC_SUPABASE_URL && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              Debug: Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === "login"
                ? "登录中..."
                : "注册中..."
              : mode === "login"
                ? "登录"
                : "注册"}
          </button>

          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {mode === "login" ? (
              <>
                还没有账号？{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账号？{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  立即登录
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
