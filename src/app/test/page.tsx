"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";

export default function TestPage() {
  return (
    <RequireAuth>
      <main style={{ padding: 24 }}>
        <h1>✅ DEPLOY CHECK</h1>
        <p>If you can see this, rendering works.</p>
        <p className="mt-4 text-green-600 dark:text-green-400">
          这是一个受保护的页面，只有登录后才能访问。
        </p>
      </main>
    </RequireAuth>
  );
}