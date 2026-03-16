import clsx from "clsx";

export function StatCard({ label, value, trend, accent }: { label: string; value: string; trend?: string; accent?: string }) {
  return (
    <div className={clsx("card p-5", accent)}>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="text-3xl font-semibold text-ink mt-2">{value}</div>
      {trend ? <div className="text-sm text-slate-500 mt-2">{trend}</div> : null}
    </div>
  );
}
