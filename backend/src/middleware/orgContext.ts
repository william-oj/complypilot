import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";

export async function requireOrgContext(req: Request, res: Response, next: NextFunction) {
  const orgId = (req.headers["x-org-id"] as string) || req.query.orgId?.toString();
  if (!orgId) return res.status(400).json({ error: "Missing org context" });
  if (!req.userId) return res.status(401).json({ error: "Missing user" });

  const membership = await prisma.organizationMember.findFirst({
    where: { orgId, userId: req.userId },
    include: { role: { include: { permissions: { include: { permission: true } } } } }
  });

  if (!membership) return res.status(403).json({ error: "Not a member of org" });

  req.orgId = orgId;
  req.permissions = membership.role.permissions.map((rp) => rp.permission.key);
  return next();
}
