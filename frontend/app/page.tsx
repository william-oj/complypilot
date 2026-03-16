"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "../lib/api";
import { setOrgId } from "../lib/org";

export default function Home() {
  const [token, setTokenInput] = useState("");
  const [orgId, setOrgIdInput] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = () => {
    const cleanedToken = token.trim().replace(/^["']|["']$/g, "").replace(/,+$/, "");
    const cleanedOrgId = orgId.trim().replace(/^["']|["']$/g, "").replace(/,+$/, "");

    if (!cleanedToken || !cleanedOrgId) {
      setError("Please paste both the token and organization ID.");
      setDone(false);
      return;
    }

    setToken(cleanedToken);
    setOrgId(cleanedOrgId);
    setError(null);
    setDone(true);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="card max-w-2xl w-full p-10">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">ISO made simple</div>
        <h1 className="text-4xl text-ink mt-3">ComplyPilot Quick Start</h1>
        <p className="text-slate-600 mt-4">
          Paste your API token and organization ID to connect the UI to the backend.
          You can get these by calling the `/auth/register` endpoint.
        </p>
        <div className="mt-6 grid gap-4">
          <input
            className="w-full border border-slate-200 rounded-xl px-4 py-3"
            placeholder="JWT token"
            value={token}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <input
            className="w-full border border-slate-200 rounded-xl px-4 py-3"
            placeholder="Organization ID"
            value={orgId}
            onChange={(e) => setOrgIdInput(e.target.value)}
          />
          <button onClick={handleSave} className="px-5 py-3 rounded-full bg-ink text-white">
            Connect
          </button>
        </div>
        {error ? <div className="mt-4 text-rose-600">{error}</div> : null}
        {done ? <div className="mt-4 text-emerald-600">Connected. Open the dashboard.</div> : null}
        <div className="mt-6 text-sm text-slate-500">
          Tip: Set `NEXT_PUBLIC_API_URL` to point to your backend.
        </div>
      </div>
    </main>
  );
}
