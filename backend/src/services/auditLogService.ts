import { prisma } from "../config/db";

export async function logAudit(orgId: string, action: string, actorId?: string, target?: string, metadata?: string) {
  return prisma.auditLog.create({
    data: {
      orgId,
      actorId,
      action,
      target,
      metadata
    }
  });
}
