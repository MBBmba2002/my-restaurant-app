"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/Card";
import { FormRow } from "@/components/ui/FormRow";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F3F0' }}>
      <div className="w-full max-w-md">
        <Card accentColor="red">
          <h1 className="mb-8 text-center" style={{ 
            fontSize: '1.875rem', // 30px
            fontWeight: 600,
            color: '#111827'
          }}>
            登录
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <FormRow label="邮箱" accentColor="red">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="请输入邮箱"
                accentColor="red"
              />
            </FormRow>

            <FormRow label="密码" accentColor="red">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="请输入密码"
                accentColor="red"
              />
            </FormRow>

            {error && (
              <div className="text-center p-3 rounded-lg" style={{ 
                fontSize: '0.875rem', // 14px
                backgroundColor: 'rgba(159, 58, 47, 0.1)',
                color: '#9F3A2F'
              }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              accentColor="red"
              variant="primary"
              size="lg"
              className="w-full"
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
