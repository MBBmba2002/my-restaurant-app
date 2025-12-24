"use client";

import { useState } from "react";

export default function DebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseUrl = Boolean(supabaseUrl);
  const hasSupabaseAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const currentLocation = typeof window !== "undefined" ? window.location.href : "SSR";
  
  let supabaseUrlHost = "missing";
  try {
    if (supabaseUrl) {
      supabaseUrlHost = new URL(supabaseUrl).host;
    }
  } catch {
    supabaseUrlHost = "invalid URL";
  }

  const [healthCheckResult, setHealthCheckResult] = useState<string | null>(null);
  const [healthCheckLoading, setHealthCheckLoading] = useState(false);

  const handleHealthCheck = async () => {
    if (!supabaseUrl) {
      setHealthCheckResult("Error: Supabase URL is not set");
      return;
    }

    setHealthCheckLoading(true);
    setHealthCheckResult(null);

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/health`);
      const status = response.status;
      const statusText = response.statusText;
      const data = await response.text();
      
      setHealthCheckResult(`Status: ${status} ${statusText}\nResponse: ${data || "(empty)"}`);
    } catch (error: any) {
      setHealthCheckResult(`Error: ${error.message || String(error)}`);
    } finally {
      setHealthCheckLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">
          环境变量调试页面
        </h1>
        
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg mb-4">
          <pre className="text-sm text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap">
{`hasSupabaseUrl: ${hasSupabaseUrl}
hasSupabaseAnonKey: ${hasSupabaseAnonKey}
supabaseUrlHost: ${supabaseUrlHost}
currentLocation: ${currentLocation}
`}
          </pre>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg mb-4">
          <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Health Check</h2>
          <button
            onClick={handleHealthCheck}
            disabled={!hasSupabaseUrl || healthCheckLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {healthCheckLoading ? "检查中..." : "Health Check"}
          </button>
          {healthCheckResult && (
            <pre className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap">
              {healthCheckResult}
            </pre>
          )}
        </div>
        
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          <p>✓ 如果 hasSupabaseUrl 和 hasSupabaseAnonKey 都是 true，说明环境变量已正确配置</p>
          <p>⚠️ 如果都是 false，需要在 GitHub Secrets 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
        </div>
      </main>
    </div>
  );
}

