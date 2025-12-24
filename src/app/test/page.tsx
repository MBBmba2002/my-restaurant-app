"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>✅ DEPLOY CHECK</h1>
      <p>If you can see this, rendering works.</p>
    </main>
  );
}

  return <div className="p-6 text-xl">{msg}</div>;
}
