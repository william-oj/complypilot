import { prisma } from "../config/db";
import { z } from "zod";
import { renderTemplate, generatePdf, generateDocx } from "../documents/policyGenerator";
import { logAudit } from "../services/auditLogService";
import { enqueueIndex } from "../jobs/indexer";
import { evaluateBadges } from "../services/badgeService";
import { Request, Response } from "express";

const generateSchema = z.object({
  templateId: z.string(),
  title: z.string().optional(),
  variables: z.record(z.string()).optional(),
  format: z.enum(["pdf", "docx"]).optional()
});

export async function listPolicyTemplates(req: Request, res: Response) {
  const templates = await prisma.policyTemplate.findMany();
  return res.json(templates);
}

export async function listPolicies(req: Request, res: Response) {
  const policies = await prisma.policy.findMany({ where: { orgId: req.orgId } });
  return res.json(policies);
}

export async function generatePolicy(req: Request, res: Response) {
  const data = generateSchema.parse(req.body);
  const template = await prisma.policyTemplate.findUnique({ where: { id: data.templateId } });
  if (!template) return res.status(404).json({ error: "Template not found" });

  const org = await prisma.organization.findUnique({ where: { id: req.orgId } });
  const content = renderTemplate(template.template, {
    organization: org,
    date: new Date().toISOString().slice(0, 10),
    owner: req.userId,
    ...data.variables
  });

  const policy = await prisma.policy.create({
    data: {
      orgId: req.orgId!,
      templateId: template.id,
      title: data.title || template.name,
      content
    }
  });

  await logAudit(req.orgId!, "policy.generated", req.userId, policy.id);
  await enqueueIndex({ orgId: req.orgId!, type: "policies", id: policy.id, body: policy });
  if (req.userId) await evaluateBadges(req.orgId!, req.userId);

  if (!data.format) return res.json(policy);

  const buffer = data.format === "pdf" ? await generatePdf(content) : await generateDocx(content);
  res.setHeader("Content-Type", data.format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename="${policy.title.replace(/\s+/g, "_")}.${data.format}"`);
  return res.send(buffer);
}

export async function updatePolicy(req: Request, res: Response) {
  const data = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    status: z.enum(["DRAFT", "READY", "APPROVED"]).optional()
  }).parse(req.body);

  const existing = await prisma.policy.findFirst({ where: { id: req.params.id, orgId: req.orgId } });
  if (!existing) return res.status(404).json({ error: "Policy not found" });
  const policy = await prisma.policy.update({ where: { id: existing.id }, data });

  await logAudit(req.orgId!, "policy.updated", req.userId, policy.id);
  if (req.userId) await evaluateBadges(req.orgId!, req.userId);
  return res.json(policy);
}
