import { prisma } from "../config/db";
import { z } from "zod";
import { logAudit } from "../services/auditLogService";
import { evaluateBadges } from "../services/badgeService";
import { Request, Response } from "express";

const controlUpdateSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "IMPLEMENTED", "NOT_APPLICABLE"]).optional(),
  owner: z.string().optional(),
  notes: z.string().optional()
});

export async function listControls(req: Request, res: Response) {
  const controls = await prisma.control.findMany({
    include: {
      implementations: {
        where: { orgId: req.orgId },
        take: 1
      }
    }
  });
  return res.json(controls);
}

export async function updateControl(req: Request, res: Response) {
  const data = controlUpdateSchema.parse(req.body);
  const controlId = req.params.id;

  const control = await prisma.control.findUnique({ where: { id: controlId } });
  if (!control) return res.status(404).json({ error: "Control not found" });

  const impl = await prisma.controlImplementation.upsert({
    where: { orgId_controlId: { orgId: req.orgId!, controlId } },
    update: { ...data, ...(data.status === "IMPLEMENTED" ? { implementedAt: new Date() } : {}) },
    create: { orgId: req.orgId!, controlId, ...data, implementedAt: data.status === "IMPLEMENTED" ? new Date() : undefined }
  });

  await logAudit(req.orgId!, "control.updated", req.userId, controlId);
  if (req.userId) await evaluateBadges(req.orgId!, req.userId);
  return res.json(impl);
}
