import { prisma } from "../config/db";
import { z } from "zod";
import { logAudit } from "../services/auditLogService";
import { enqueueIndex } from "../jobs/indexer";
import { Request, Response } from "express";

const assetSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["HARDWARE", "SOFTWARE", "DATA", "VENDOR", "FACILITY", "PERSONNEL"]),
  owner: z.string().optional(),
  location: z.string().optional(),
  classification: z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED"]).optional(),
  criticality: z.number().int().min(1).max(5).optional(),
  confidentiality: z.number().int().min(1).max(5).optional(),
  integrity: z.number().int().min(1).max(5).optional(),
  availability: z.number().int().min(1).max(5).optional()
});

export async function listAssets(req: Request, res: Response) {
  const assets = await prisma.asset.findMany({ where: { orgId: req.orgId } });
  return res.json(assets);
}

export async function createAsset(req: Request, res: Response) {
  const data = assetSchema.parse(req.body);
  const asset = await prisma.asset.create({ data: { ...data, orgId: req.orgId } });
  await logAudit(req.orgId!, "asset.created", req.userId, asset.id, JSON.stringify(data));
  await enqueueIndex({ orgId: req.orgId!, type: "assets", id: asset.id, body: asset });
  return res.json(asset);
}

export async function updateAsset(req: Request, res: Response) {
  const data = assetSchema.partial().parse(req.body);
  const existing = await prisma.asset.findFirst({ where: { id: req.params.id, orgId: req.orgId } });
  if (!existing) return res.status(404).json({ error: "Asset not found" });
  const asset = await prisma.asset.update({ where: { id: existing.id }, data });
  await logAudit(req.orgId!, "asset.updated", req.userId, asset.id);
  await enqueueIndex({ orgId: req.orgId!, type: "assets", id: asset.id, body: asset });
  return res.json(asset);
}

export async function deleteAsset(req: Request, res: Response) {
  const existing = await prisma.asset.findFirst({ where: { id: req.params.id, orgId: req.orgId } });
  if (!existing) return res.status(404).json({ error: "Asset not found" });
  await prisma.asset.delete({ where: { id: existing.id } });
  await logAudit(req.orgId!, "asset.deleted", req.userId, req.params.id);
  return res.status(204).send();
}
