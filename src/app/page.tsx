"use client";

import RecordPage from "./record/page";

export default function HomePage() {
  // 直接返回 RecordPage 组件，避免重定向导致的加载问题
  return <RecordPage />;
}
