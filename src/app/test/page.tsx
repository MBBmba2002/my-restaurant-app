"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function TestPage() {
  const [msg, setMsg] = useState("Testing...");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) setMsg("❌ " + error.message);
      else setMsg("✅ Supabase connected. Session: " + (data.session ? "Yes" : "No"));
    })();
  }, []);

  return <div className="p-6 text-xl">{msg}</div>;
}
