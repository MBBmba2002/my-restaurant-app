"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

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
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F5F3F0' }}>
      <main className="max-w-3xl mx-auto">
        <SectionHeader 
          title="环境变量调试页面" 
          accentColor="blue"
          className="mb-6"
          isPageTitle={true}
        />
        
        <Card accentColor="blue" className="mb-6">
          <pre style={{ 
            fontSize: '0.875rem', // 14px
            color: '#111827',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
{`hasSupabaseUrl: ${hasSupabaseUrl}
hasSupabaseAnonKey: ${hasSupabaseAnonKey}
supabaseUrlHost: ${supabaseUrlHost}
currentLocation: ${currentLocation}
`}
          </pre>
        </Card>

        <Card accentColor="blue" className="mb-6">
          <SectionHeader title="Health Check" accentColor="blue" className="mb-4" isPageTitle={false} />
          <Button
            onClick={handleHealthCheck}
            disabled={!hasSupabaseUrl || healthCheckLoading}
            accentColor="blue"
            variant="primary"
            size="md"
          >
            {healthCheckLoading ? "检查中..." : "Health Check"}
          </Button>
          {healthCheckResult && (
            <pre className="mt-4 p-4 rounded-lg font-mono whitespace-pre-wrap border" style={{
              fontSize: '0.875rem', // 14px
              backgroundColor: '#F5F3F0',
              color: '#111827',
              borderColor: 'rgba(0, 0, 0, 0.08)'
            }}>
              {healthCheckResult}
            </pre>
          )}
        </Card>
        
        <Card>
          <div className="space-y-2" style={{ fontSize: '0.875rem', color: 'rgba(17, 24, 39, 0.6)' }}>
            <p>✓ 如果 hasSupabaseUrl 和 hasSupabaseAnonKey 都是 true，说明环境变量已正确配置</p>
            <p>⚠️ 如果都是 false，需要在 GitHub Secrets 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
          </div>
        </Card>
      </main>
    </div>
  );
}

