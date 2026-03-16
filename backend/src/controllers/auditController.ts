import { prisma } from "../config/db";
import { z } from "zod";
import { logAudit } from "../services/auditLogService";
import { evaluateBadges } from "../services/badgeService";
import { Request, Response } from "express";

const auditSchema = z.object({
  title: z.string().min(2),
  scope: z.string().optional(),
  scheduledAt: z.string().optional(),
  auditor: z.string().optional()
});

const findingSchema = z.object({
  controlId: z.string().optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  title: z.string().min(2),
  description: z.string().optional()
});

const actionSchema = z.object({
  owner: z.string().optional(),
  action: z.string().min(2),
  dueDate: z.string().optional(),
  status: z.string().optional()
});

export async function listAudits(req: Request, res: Response) {
  const audits = await prisma.audit.findMany({ where: { orgId: req.orgId }, include: { findings: true } });
  return res.json(audits);
}

export async function createAudit(req: Request, res: Response) {
  const data = auditSchema.parse(req.body);
  const audit = await prisma.audit.create({
    data: {
      orgId: req.orgId!,
      title: data.title,
      scope: data.scope,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      auditor: data.auditor
    }
  });
  await logAudit(req.orgId!, "audit.created", req.userId, audit.id);
  return res.json(audit);
}

export async function addFinding(req: Request, res: Response) {
  const data = findingSchema.parse(req.body);
  const audit = await prisma.audit.findFirst({ where: { id: req.params.id, orgId: req.orgId } });
  if (!audit) return res.status(404).json({ error: "Audit not found" });
  const finding = await prisma.auditFinding.create({
    data: { auditId: audit.id, ...data }
  });
  await logAudit(req.orgId!, "audit.finding", req.userId, finding.id);
  return res.json(finding);
}

export async function addCorrectiveAction(req: Request, res: Response) {
  const data = actionSchema.parse(req.body);
  const finding = await prisma.auditFinding.findFirst({
    where: { id: req.params.id, audit: { orgId: req.orgId } }
  });
  if (!finding) return res.status(404).json({ error: "Finding not found" });
  const action = await prisma.correctiveAction.create({
    data: {
      findingId: finding.id,
      owner: data.owner,
      action: data.action,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      status: data.status
    }
  });
  await logAudit(req.orgId!, "audit.corrective_action", req.userId, action.id);
  return res.json(action);
}

export async function updateAudit(req: Request, res: Response) {
  const data = z.object({ status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]) }).parse(req.body);
  const existing = await prisma.audit.findFirst({ where: { id: req.params.id, orgId: req.orgId } });
  if (!existing) return res.status(404).json({ error: "Audit not found" });
  const audit = await prisma.audit.update({ where: { id: existing.id }, data });
  await logAudit(req.orgId!, "audit.updated", req.userId, audit.id);
  if (req.userId) await evaluateBadges(req.orgId!, req.userId);
  return res.json(audit);
}

export async function mockAudit(req: Request, res: Response) {
  const controls = await prisma.control.findMany();
  const implementations = await prisma.controlImplementation.findMany({ where: { orgId: req.orgId } });
  const evidence = await prisma.evidence.findMany({ where: { orgId: req.orgId } });

  const evidenceByControl = new Set(evidence.map((e) => e.controlImplementationId).filter(Boolean));
  const items = controls.map((control) => {
    const impl = implementations.find((i) => i.controlId === control.id);
    const hasEvidence = impl && evidenceByControl.has(impl.id);
    return {
      controlId: control.controlId,
      title: control.title,
      implemented: impl?.status === "IMPLEMENTED",
      hasEvidence
    };
  });

  const readiness = Math.round((items.filter((i) => i.implemented && i.hasEvidence).length / items.length) * 100);
  return res.json({ readiness, items });
}
