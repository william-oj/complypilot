"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Topbar } from "../../components/Topbar";
import { StatCard } from "../../components/StatCard";
import { StageList } from "../../components/StageList";
import { Heatmap } from "../../components/Heatmap";
import { apiFetch } from "../../lib/api";
import { getOrgId } from "../../lib/org";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [journey, setJourney] = useState<any>(null);
  const [badges, setBadges] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orgId = getOrgId();
    if (!orgId) {
      setError("Missing org context. Set orgId on the home page.");
      return;
    }
    Promise.all([
      apiFetch("/dashboard", {}, orgId),
      apiFetch("/journey", {}, orgId),
      apiFetch("/badges", {}, orgId)
    ])
      .then(([dashboard, journey, badges]) => {
        setMetrics(dashboard);
        setJourney(journey);
        setBadges(badges);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="md:flex">
      <Sidebar />
      <main className="flex-1 px-6 py-8 space-y-6">
        <Topbar title="Your ISMS cockpit" subtitle="Track readiness, risks, and next steps." />

        {error ? (
          <div className="card p-5 text-rose-600">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Readiness" value={metrics ? `${metrics.readiness}%` : "--"} trend="Audit readiness score" />
          <StatCard label="Controls" value={metrics ? `${metrics.controlsImplemented}/${metrics.controlsTotal}` : "--"} trend="Implemented controls" />
          <StatCard label="Open Risks" value={metrics ? `${metrics.risksOpen}` : "--"} trend="Open or in review" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          {journey ? <StageList stages={journey.stages} /> : <div className="card p-6">Loading journey...</div>}
          <Heatmap />
        </div>

        <div className="card p-6">
          <div className="section-title">Progress bar</div>
          <div className="mt-4 progress-track h-3">
            <div className="progress-fill h-3" style={{ width: `${journey?.percent || 0}%` }} />
          </div>
          <div className="text-sm text-slate-500 mt-2">{journey?.percent || 0}% complete</div>
        </div>

        <div className="card p-6">
          <div className="section-title">Badges</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {badges?.badges?.map((badge: any) => {
              const unlocked = badges.unlocked?.some((b: any) => b.badgeId === badge.id);
              return (
                <span key={badge.id} className={`px-3 py-1 rounded-full text-xs ${unlocked ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {badge.name}
                </span>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
