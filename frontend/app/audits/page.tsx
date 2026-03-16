"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { apiFetch } from "../../lib/api";
import { getOrgId } from "../../lib/org";

export default function AuditsPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [mock, setMock] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      const data = await apiFetch("/audits", {}, orgId);
      setAudits(data as any[]);
      const mockData = await apiFetch("/audits/mock", {}, orgId);
      setMock(mockData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      await apiFetch("/audits", { method: "POST", body: JSON.stringify({ title }) }, orgId);
      setTitle("");
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageShell title="Audits" subtitle="Plan internal audits and track readiness.">
      {error ? <div className="card p-4 text-rose-600">{error}</div> : null}
      <div className="card p-6 space-y-4">
        <div className="section-title">Schedule internal audit</div>
        <input className="border rounded-xl px-3 py-2" placeholder="Audit title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="px-4 py-2 rounded-full bg-ink text-white" onClick={create}>Create audit</button>
      </div>

      {mock ? (
        <div className="card p-6">
          <div className="section-title">Mock audit readiness</div>
          <div className="text-3xl font-semibold mt-2">{mock.readiness}%</div>
          <div className="text-sm text-slate-500">Controls with evidence</div>
        </div>
      ) : null}

      <div className="card p-6">
        <div className="section-title mb-4">Audit history</div>
        <div className="space-y-3">
          {audits.map((audit) => (
            <div key={audit.id} className="px-4 py-3 rounded-2xl bg-slate-50">
              <div className="font-medium text-slate-700">{audit.title}</div>
              <div className="text-xs text-slate-500">Status: {audit.status}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
