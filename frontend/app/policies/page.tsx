"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { apiFetch } from "../../lib/api";
import { getOrgId } from "../../lib/org";

export default function PoliciesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      const [templatesData, policiesData] = await Promise.all([
        apiFetch("/policies/templates", {}, orgId),
        apiFetch("/policies", {}, orgId)
      ]);
      setTemplates(templatesData as any[]);
      setPolicies(policiesData as any[]);
      if (!selected && (templatesData as any[]).length) setSelected((templatesData as any[])[0].id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const generate = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      await apiFetch("/policies/generate", { method: "POST", body: JSON.stringify({ templateId: selected }) }, orgId);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageShell title="Policies" subtitle="Generate and edit core ISMS policies.">
      {error ? <div className="card p-4 text-rose-600">{error}</div> : null}
      <div className="card p-6 space-y-4">
        <div className="section-title">Generate policy</div>
        <select className="border rounded-xl px-3 py-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <button className="px-4 py-2 rounded-full bg-ink text-white" onClick={generate}>Generate</button>
      </div>

      <div className="card p-6">
        <div className="section-title mb-4">Policies</div>
        <div className="space-y-3">
          {policies.map((policy) => (
            <div key={policy.id} className="px-4 py-3 rounded-2xl bg-slate-50">
              <div className="font-medium text-slate-700">{policy.title}</div>
              <div className="text-xs text-slate-500">Status: {policy.status}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
