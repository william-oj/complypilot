"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { apiFetch } from "../../lib/api";
import { getOrgId } from "../../lib/org";

const assetDefaults = {
  name: "",
  type: "HARDWARE",
  classification: "INTERNAL",
  owner: "",
  location: "",
  criticality: 3,
  confidentiality: 3,
  integrity: 3,
  availability: 3
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [form, setForm] = useState(assetDefaults);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      const data = await apiFetch("/assets", {}, orgId);
      setAssets(data as any[]);
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
      await apiFetch("/assets", { method: "POST", body: JSON.stringify(form) }, orgId);
      setForm(assetDefaults);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageShell title="Assets" subtitle="Register and classify information assets.">
      {error ? <div className="card p-4 text-rose-600">{error}</div> : null}

      <div className="card p-6 space-y-4">
        <div className="section-title">Add asset</div>
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="Asset name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm text-slate-600">
            Type
            <select className="border rounded-xl px-3 py-2 w-full" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="HARDWARE">Hardware</option>
              <option value="SOFTWARE">Software</option>
              <option value="DATA">Data</option>
              <option value="VENDOR">Vendor</option>
              <option value="FACILITY">Facility</option>
              <option value="PERSONNEL">Personnel</option>
            </select>
          </label>
          <label className="text-sm text-slate-600">
            Classification
            <select className="border rounded-xl px-3 py-2 w-full" value={form.classification} onChange={(e) => setForm({ ...form, classification: e.target.value })}>
              <option value="PUBLIC">Public</option>
              <option value="INTERNAL">Internal</option>
              <option value="CONFIDENTIAL">Confidential</option>
              <option value="RESTRICTED">Restricted</option>
            </select>
          </label>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Owner"
            value={form.owner}
            onChange={(e) => setForm({ ...form, owner: e.target.value })}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          <label className="text-sm text-slate-600">Criticality
            <input type="number" min={1} max={5} className="border rounded-xl px-3 py-2 w-full" value={form.criticality} onChange={(e) => setForm({ ...form, criticality: Number(e.target.value) })} />
          </label>
          <label className="text-sm text-slate-600">Confidentiality
            <input type="number" min={1} max={5} className="border rounded-xl px-3 py-2 w-full" value={form.confidentiality} onChange={(e) => setForm({ ...form, confidentiality: Number(e.target.value) })} />
          </label>
          <label className="text-sm text-slate-600">Integrity
            <input type="number" min={1} max={5} className="border rounded-xl px-3 py-2 w-full" value={form.integrity} onChange={(e) => setForm({ ...form, integrity: Number(e.target.value) })} />
          </label>
          <label className="text-sm text-slate-600">Availability
            <input type="number" min={1} max={5} className="border rounded-xl px-3 py-2 w-full" value={form.availability} onChange={(e) => setForm({ ...form, availability: Number(e.target.value) })} />
          </label>
        </div>
        <button className="px-4 py-2 rounded-full bg-ink text-white" onClick={submit}>Save asset</button>
      </div>

      <div className="card p-6">
        <div className="section-title mb-4">Asset register</div>
        <div className="space-y-3">
          {assets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50">
              <div>
                <div className="font-medium text-slate-700">{asset.name}</div>
                <div className="text-xs text-slate-500">{asset.type} - {asset.classification}</div>
              </div>
              <div className="text-xs text-slate-500">Owner: {asset.owner || "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
