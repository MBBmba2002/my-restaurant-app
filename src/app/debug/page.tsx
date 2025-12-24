"use client";

export default function DebugPage() {
  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const currentLocation = typeof window !== "undefined" ? window.location.href : "SSR";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">
          环境变量调试页面
        </h1>
        
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg">
          <pre className="text-sm text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap">
{`hasSupabaseUrl: ${hasSupabaseUrl}
hasSupabaseAnonKey: ${hasSupabaseAnonKey}
currentLocation: ${currentLocation}
`}
          </pre>
        </div>
        
        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>✓ 如果 hasSupabaseUrl 和 hasSupabaseAnonKey 都是 true，说明环境变量已正确配置</p>
          <p>⚠️ 如果都是 false，需要在 GitHub Secrets 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
        </div>
      </main>
    </div>
  );
}

