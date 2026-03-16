import { prisma } from "../config/db";
import { z } from "zod";
import { calculateRiskScore } from "../utils/risk";
import { logAudit } from "../services/auditLogService";
import { recommendControlsForRisk } from "../services/riskTreatmentService";
import { enqueueIndex } from "../jobs/indexer";
import { evaluateBadges } from "../services/badgeService";
import { Request, Response } from "express";

const riskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  assetId: z.string().optional(),
  likelihood: z.number().int().min(1).max(5),
  impact: z.number().int().min(1).max(5),
  owner: z.string().optional()
});

const treatmentSchema = z.object({
  treatment: z.enum(["ACCEPT", "MITIGATE", "TRANSFER", "AVOID"]),
  plan: z.string().optional(),
  owner: z.string().optional(),
  targetDate: z.string().optional()
});

export async function listRisks(req: Request, res: Response) {
  const risks = await prisma.risk.findMany({ where: { orgId: req.orgId } });
  return res.json(risks);
}

export async function createRisk(req: Request, res: Response) {
  const data = riskSchema.parse(req.body);
  const { score } = calculateRiskScore(data.likelihood, data.impact);
  const risk = await prisma.risk.create({
    data: { ...data, score, orgId: req.orgId }
  });
  await logAudit(req.orgId!, "risk.created", req.userId, risk.id);
  await enqueueIndex({ orgId: req.orgId!, type: "risks", id: risk.id, body: risk });
  if (req.userId) await evaluateBadges(req.orgId!, req.userId);
  return res.json(risk);
}

export async function updateRisk(req: Request, res: Response) {
  const data = riskSchema.partial().parse(req.body);
  let score;
  const existing = await prisma.risk.findFirst({ where: { id: req.params.id, orgId: req.orgId } });
  if (!existing) return res.status(404).json({ error: "Risk not found" });
  if (data.likelihood || data.impact) {
    const likelihood = data.likelihood ?? existing.likelihood;
    const impact = data.impact ?? existing.impact;
    score = calculateRiskScore(likelihood, impact).score;
  }
  const risk = await prisma.risk.update({
    where: { id: existing.id },
    data: { ...data, ...(score !== undefined ? { score } : {}) }
  });
  await logAudit(req.orgId!, "risk.updated", req.userId, risk.id);
  await enqueueIndex({ orgId: req.orgId!, type: "risks", id: risk.id, body: risk });
  return res.json(risk);
}

export async function createTreatment(req: Request, res: Response) {
  const data = treatmentSchema.parse(req.body);
  const riskId = req.params.id;
  const risk = await prisma.risk.findFirst({ where: { id: riskId, orgId: req.orgId } });
  if (!risk) return res.status(404).json({ error: "Risk not found" });
  const treatment = await prisma.riskTreatment.create({
    data: {
      orgId: req.orgId!,
      riskId,
      treatment: data.treatment,
      plan: data.plan,
      owner: data.owner,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined
    }
  });

  if (data.treatment === "MITIGATE") {
    await recommendControlsForRisk(req.orgId!, riskId, treatment.id);
  }

  await logAudit(req.orgId!, "risk.treated", req.userId, riskId, JSON.stringify(data));
  return res.json(treatment);
}
