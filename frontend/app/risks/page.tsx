"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { apiFetch } from "../../lib/api";
import { getOrgId } from "../../lib/org";

const riskDefaults = {
  title: "",
  description: "",
  likelihood: 3,
  impact: 3
};

export default function RisksPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [form, setForm] = useState(riskDefaults);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      const data = await apiFetch("/risks", {}, orgId);
      setRisks(data as any[]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      await apiFetch("/risks", { method: "POST", body: JSON.stringify(form) }, orgId);
      setForm(riskDefaults);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageShell title="Risks" subtitle="Identify, score, and treat risks.">
      {error ? <div className="card p-4 text-rose-600">{error}</div> : null}
      <div className="card p-6 space-y-4">
        <div className="section-title">Add risk</div>
        <input className="border rounded-xl px-3 py-2" placeholder="Risk title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="border rounded-xl px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm text-slate-600">Likelihood
            <input type="number" min={1} max={5} className="border rounded-xl px-3 py-2 w-full" value={form.likelihood} onChange={(e) => setForm({ ...form, likelihood: Number(e.target.value) })} />
          </label>
          <label className="text-sm text-slate-600">Impact
            <input type="number" min={1} max={5} className="border rounded-xl px-3 py-2 w-full" value={form.impact} onChange={(e) => setForm({ ...form, impact: Number(e.target.value) })} />
          </label>
        </div>
        <button className="px-4 py-2 rounded-full bg-ink text-white" onClick={submit}>Save risk</button>
      </div>

      <div className="card p-6">
        <div className="section-title mb-4">Risk register</div>
        <div className="space-y-3">
          {risks.map((risk) => (
            <div key={risk.id} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50">
              <div>
                <div className="font-medium text-slate-700">{risk.title}</div>
                <div className="text-xs text-slate-500">Likelihood {risk.likelihood} - Impact {risk.impact}</div>
              </div>
              <div className="text-sm font-semibold">Score {risk.score}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
