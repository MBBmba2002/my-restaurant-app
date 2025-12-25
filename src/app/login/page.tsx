"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // 登录成功，跳转到记录页
      router.push("/record");
    } catch (err: any) {
      setError(err.message || "登录失败");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2eada] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-[0_8px_30px_rgb(171,50,42,0.05)]">
        <h1 className="text-3xl font-bold text-[#0c0c0c] mb-8 text-center">
          登录
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-base font-medium mb-2 text-[#3d3435]">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="请输入邮箱"
              className="w-full font-mono text-xl p-4 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c]"
            />
          </div>

          <div>
            <label className="block text-base font-medium mb-2 text-[#3d3435]">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="请输入密码"
              className="w-full font-mono text-xl p-4 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c]"
            />
          </div>

          {error && (
            <div className="text-[#ab322a] text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 text-xl font-bold bg-[#ab322a] text-[#f2eada] rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
