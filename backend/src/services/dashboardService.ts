import { prisma } from "../config/db";

export async function getDashboard(orgId: string) {
  const [controlsTotal, controlsImplemented, policiesTotal, policiesApproved, risksOpen] = await Promise.all([
    prisma.control.count(),
    prisma.controlImplementation.count({ where: { orgId, status: "IMPLEMENTED" } }),
    prisma.policy.count({ where: { orgId } }),
    prisma.policy.count({ where: { orgId, status: "APPROVED" } }),
    prisma.risk.count({ where: { orgId, status: { in: ["OPEN", "IN_REVIEW"] } } })
  ]);

  const evidenceCount = await prisma.evidence.count({ where: { orgId } });

  const controlProgress = controlsTotal === 0 ? 0 : Math.round((controlsImplemented / controlsTotal) * 100);
  const policyProgress = policiesTotal === 0 ? 0 : Math.round((policiesApproved / policiesTotal) * 100);
  const evidenceScore = controlsImplemented === 0 ? 0 : Math.round((Math.min(evidenceCount, controlsImplemented) / controlsImplemented) * 100);
  const readiness = Math.min(100, Math.round((controlProgress * 0.6) + (policyProgress * 0.3) + (evidenceScore * 0.1)));

  return {
    controlProgress,
    policyProgress,
    readiness,
    risksOpen,
    controlsTotal,
    controlsImplemented,
    evidenceCount
  };
}
