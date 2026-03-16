"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { apiFetch } from "../../lib/api";
import { getOrgId } from "../../lib/org";

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      const data = await apiFetch("/evidence", {}, orgId);
      setEvidence(data as any[]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Missing orgId");
      if (!file) throw new Error("Pick a file");
      const formData = new FormData();
      formData.append("title", title || file.name);
      formData.append("file", file);
      await apiFetch("/evidence", { method: "POST", body: formData }, orgId);
      setTitle("");
      setFile(null);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageShell title="Evidence" subtitle="Upload proof for your controls.">
      {error ? <div className="card p-4 text-rose-600">{error}</div> : null}
      <div className="card p-6 space-y-4">
        <div className="section-title">Upload evidence</div>
        <input className="border rounded-xl px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="px-4 py-2 rounded-full bg-ink text-white" onClick={upload}>Upload</button>
      </div>

      <div className="card p-6">
        <div className="section-title mb-4">Evidence library</div>
        <div className="space-y-3">
          {evidence.map((item) => (
            <div key={item.id} className="px-4 py-3 rounded-2xl bg-slate-50">
              <div className="font-medium text-slate-700">{item.title}</div>
              <div className="text-xs text-slate-500">{item.type}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
