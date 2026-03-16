import { prisma } from "../config/db";
import { getDashboard } from "./dashboardService";

export async function evaluateBadges(orgId: string, userId: string) {
  const [riskCount, policyApproved, auditCount, dashboard] = await Promise.all([
    prisma.risk.count({ where: { orgId } }),
    prisma.policy.count({ where: { orgId, status: "APPROVED" } }),
    prisma.audit.count({ where: { orgId, status: "COMPLETED" } }),
    getDashboard(orgId)
  ]);

  const badges = await prisma.badge.findMany();
  const byType = new Map(badges.map((b) => [b.type, b]));

  const unlock = async (type: string) => {
    const badge = byType.get(type as any);
    if (!badge) return;
    await prisma.badgeUnlock.upsert({
      where: { orgId_userId_badgeId: { orgId, userId, badgeId: badge.id } },
      update: {},
      create: { orgId, userId, badgeId: badge.id }
    });
  };

  if (riskCount >= 5) await unlock("RISK_MASTER");
  if (policyApproved >= 3) await unlock("POLICY_BUILDER");
  if (auditCount >= 1) await unlock("AUDIT_READY");
  if (dashboard.readiness >= 80) await unlock("SECURITY_CHAMPION");
}
