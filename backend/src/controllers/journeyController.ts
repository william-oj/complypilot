import { prisma } from "../config/db";
import { Request, Response } from "express";

const stages = [
  { key: "org_setup", label: "Set up organization" },
  { key: "assets", label: "Identify assets" },
  { key: "risks", label: "Identify risks" },
  { key: "risk_assessment", label: "Evaluate risks" },
  { key: "controls", label: "Implement controls" },
  { key: "policies", label: "Generate policies" },
  { key: "evidence", label: "Collect evidence" },
  { key: "internal_audit", label: "Perform internal audit" },
  { key: "cert_ready", label: "Prepare for certification" }
];

export async function getJourney(req: Request, res: Response) {
  const orgId = req.orgId!;
  const [assets, risks, treatments, controls, policies, evidence, audits] = await Promise.all([
    prisma.asset.count({ where: { orgId } }),
    prisma.risk.count({ where: { orgId } }),
    prisma.riskTreatment.count({ where: { orgId } }),
    prisma.controlImplementation.count({ where: { orgId, status: "IMPLEMENTED" } }),
    prisma.policy.count({ where: { orgId } }),
    prisma.evidence.count({ where: { orgId } }),
    prisma.audit.count({ where: { orgId } })
  ]);

  const stageStatus = {
    org_setup: true,
    assets: assets > 0,
    risks: risks > 0,
    risk_assessment: treatments > 0,
    controls: controls > 0,
    policies: policies > 0,
    evidence: evidence > 0,
    internal_audit: audits > 0,
    cert_ready: audits > 0 && controls > 0 && policies > 0
  };

  const completed = stages.filter((s) => stageStatus[s.key]).length;
  const percent = Math.round((completed / stages.length) * 100);

  return res.json({
    percent,
    stages: stages.map((s) => ({
      key: s.key,
      label: s.label,
      completed: stageStatus[s.key]
    }))
  });
}
