"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { apiFetch } from "../../lib/api";
import { getOrgId } from "../../lib/org";

export default function ControlsPage() {
  const [controls, setControls] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      const data = await apiFetch("/controls", {}, orgId);
      setControls(data as any[]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (controlId: string, status: string) => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      await apiFetch(`/controls/${controlId}`, { method: "PUT", body: JSON.stringify({ status }) }, orgId);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageShell title="Controls" subtitle="Track implementation across Annex A.">
      {error ? <div className="card p-4 text-rose-600">{error}</div> : null}
      <div className="card p-6">
        <div className="section-title mb-4">Control library</div>
        <div className="space-y-3">
          {controls.map((control) => {
            const impl = control.implementations?.[0];
            return (
              <div key={control.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-50">
                <div>
                  <div className="text-xs text-slate-400">{control.controlId}</div>
                  <div className="font-medium text-slate-700">{control.title}</div>
                  <div className="text-xs text-slate-500">{control.description}</div>
                </div>
                <select
                  className="border rounded-xl px-3 py-2"
                  value={impl?.status || "NOT_STARTED"}
                  onChange={(e) => update(control.id, e.target.value)}
                >
                  <option>NOT_STARTED</option>
                  <option>IN_PROGRESS</option>
                  <option>IMPLEMENTED</option>
                  <option>NOT_APPLICABLE</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
