import { prisma } from "../config/db";
import { uploadFile } from "../services/s3Service";
import { logAudit } from "../services/auditLogService";
import { z } from "zod";
import { Request, Response } from "express";

export async function uploadEvidence(req: Request, res: Response) {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Missing file" });

  const data = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    type: z.enum(["POLICY", "SCREENSHOT", "LOG", "TRAINING", "AUDIT", "OTHER"]).optional(),
    controlImplementationId: z.string().optional(),
    riskId: z.string().optional()
  }).parse(req.body);

  if (data.controlImplementationId) {
    const impl = await prisma.controlImplementation.findFirst({
      where: { id: data.controlImplementationId, orgId: req.orgId }
    });
    if (!impl) return res.status(404).json({ error: "Control implementation not found" });
  }
  if (data.riskId) {
    const risk = await prisma.risk.findFirst({ where: { id: data.riskId, orgId: req.orgId } });
    if (!risk) return res.status(404).json({ error: "Risk not found" });
  }

  const key = `${req.orgId}/${Date.now()}-${file.originalname}`;
  const uploaded = await uploadFile(key, file.buffer, file.mimetype);

  const evidence = await prisma.evidence.create({
    data: {
      orgId: req.orgId!,
      controlImplementationId: data.controlImplementationId,
      riskId: data.riskId,
      type: data.type || "OTHER",
      title: data.title,
      description: data.description,
      fileKey: uploaded.key,
      fileUrl: uploaded.url,
      uploadedBy: req.userId
    }
  });

  await logAudit(req.orgId!, "evidence.uploaded", req.userId, evidence.id);
  return res.json(evidence);
}

export async function listEvidence(req: Request, res: Response) {
  const evidence = await prisma.evidence.findMany({ where: { orgId: req.orgId } });
  return res.json(evidence);
}
