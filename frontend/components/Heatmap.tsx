export function Heatmap() {
  const rows = [5, 4, 3, 2, 1];
  const cols = [1, 2, 3, 4, 5];
  const color = (i: number) => {
    if (i >= 20) return "bg-rose-500";
    if (i >= 12) return "bg-orange-400";
    if (i >= 6) return "bg-amber-300";
    return "bg-emerald-300";
  };

  return (
    <div className="card p-6">
      <div className="section-title mb-4">Risk Heatmap</div>
      <div className="grid grid-cols-6 gap-2 text-xs text-slate-500">
        <div></div>
        {cols.map((c) => (
          <div key={c} className="text-center">{c}</div>
        ))}
        {rows.map((r) => (
          <div key={r} className="contents">
            <div className="text-center">{r}</div>
            {cols.map((c) => (
              <div key={`${r}-${c}`} className={`h-10 rounded-lg ${color(r * c)}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-500 mt-3">Likelihood (top) x Impact (left)</div>
    </div>
  );
}
