import { prisma } from "../config/db";
import { z } from "zod";
import { Request, Response } from "express";
import { createDefaultRoles } from "../services/roleService";

const orgSchema = z.object({
  name: z.string().min(2),
  legalName: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional()
});

export async function createOrganization(req: Request, res: Response) {
  const data = orgSchema.parse(req.body);
  if (!req.userId) return res.status(401).json({ error: "Missing user" });

  const org = await prisma.organization.create({ data });
  const { adminRole } = await createDefaultRoles(org.id);

  await prisma.organizationMember.create({
    data: { orgId: org.id, userId: req.userId, roleId: adminRole.id, title: "Owner" }
  });

  return res.json(org);
}

export async function listOrganizations(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "Missing user" });
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: req.userId },
    include: { organization: true, role: true }
  });
  return res.json(memberships);
}
