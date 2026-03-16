export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>
        <h1 className="text-3xl text-ink">{title}</h1>
        {subtitle ? <p className="text-slate-600">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        <span className="badge">Journey Mode</span>
        <button className="px-4 py-2 rounded-full bg-ink text-white text-sm">Invite teammate</button>
      </div>
    </div>
  );
}
