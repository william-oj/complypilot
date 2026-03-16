export function StageList({ stages }: { stages: { key: string; label: string; completed: boolean }[] }) {
  return (
    <div className="card p-6">
      <div className="section-title mb-4">Your ISO Journey</div>
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${stage.completed ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-500"}`}>
                {index + 1}
              </div>
              <div className="text-slate-700">{stage.label}</div>
            </div>
            <div className="text-xs text-slate-500">{stage.completed ? "Done" : "Next"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
