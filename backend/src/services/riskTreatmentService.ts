import { prisma } from "../config/db";

const keywordMap: Record<string, string[]> = {
  access: ["A.5.15", "A.5.16", "A.5.17", "A.5.18", "A.8.5"],
  backup: ["A.8.13", "A.5.30"],
  incident: ["A.5.24", "A.5.25", "A.5.26", "A.5.27"],
  supplier: ["A.5.19", "A.5.20", "A.5.21", "A.5.22"],
  cloud: ["A.5.23", "A.8.20"],
  malware: ["A.8.7", "A.8.8"],
  vulnerability: ["A.8.8"],
  logging: ["A.8.15", "A.8.16", "A.8.17"],
  encryption: ["A.8.24"],
  physical: ["A.7.1", "A.7.2", "A.7.3", "A.7.4"],
  continuity: ["A.5.29", "A.5.30"],
  development: ["A.8.25", "A.8.26", "A.8.27", "A.8.28", "A.8.29"],
  data: ["A.5.12", "A.5.13", "A.8.10", "A.8.11"],
  privacy: ["A.5.34"],
  vendor: ["A.5.19", "A.5.20"]
};

export async function recommendControlsForRisk(orgId: string, riskId: string, treatmentId: string) {
  const risk = await prisma.risk.findUnique({ where: { id: riskId } });
  if (!risk) return;

  const text = `${risk.title} ${risk.description || ""}`.toLowerCase();
  const matched = new Set<string>();

  Object.entries(keywordMap).forEach(([keyword, controls]) => {
    if (text.includes(keyword)) {
      controls.forEach((id) => matched.add(id));
    }
  });

  if (matched.size === 0) {
    // baseline controls if no keyword matched
    ["A.5.1", "A.5.9", "A.5.15", "A.8.15"].forEach((id) => matched.add(id));
  }

  const controlRecords = await prisma.control.findMany({
    where: { controlId: { in: Array.from(matched) } }
  });

  for (const control of controlRecords) {
    await prisma.riskTreatmentControl.upsert({
      where: { treatmentId_controlId: { treatmentId, controlId: control.id } },
      update: {},
      create: { treatmentId, controlId: control.id }
    });

    await prisma.controlImplementation.upsert({
      where: { orgId_controlId: { orgId, controlId: control.id } },
      update: {},
      create: { orgId, controlId: control.id }
    });
  }
}
