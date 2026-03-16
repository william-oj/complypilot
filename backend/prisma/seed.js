import { PrismaClient } from "@prisma/client";
import { controls } from "./controls.js";
import { policyTemplates } from "./policyTemplates.js";
const prisma = new PrismaClient();
const permissions = [
    { key: "org:read", description: "View organization" },
    { key: "org:write", description: "Manage organization" },
    { key: "asset:read", description: "View assets" },
    { key: "asset:write", description: "Manage assets" },
    { key: "risk:read", description: "View risks" },
    { key: "risk:write", description: "Manage risks" },
    { key: "control:read", description: "View controls" },
    { key: "control:write", description: "Manage controls" },
    { key: "policy:read", description: "View policies" },
    { key: "policy:write", description: "Manage policies" },
    { key: "evidence:read", description: "View evidence" },
    { key: "evidence:write", description: "Manage evidence" },
    { key: "audit:read", description: "View audits" },
    { key: "audit:write", description: "Manage audits" },
    { key: "admin", description: "Organization admin" }
];
const badges = [
    { type: "RISK_MASTER", name: "Risk Master", description: "Completed risk assessments" },
    { type: "POLICY_BUILDER", name: "Policy Builder", description: "Generated core policies" },
    { type: "AUDIT_READY", name: "Audit Ready", description: "Completed internal audit" },
    { type: "SECURITY_CHAMPION", name: "Security Champion", description: "Reached 80% readiness" }
];
async function main() {
    for (const permission of permissions) {
        await prisma.permission.upsert({
            where: { key: permission.key },
            update: permission,
            create: permission
        });
    }
    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { type: badge.type },
            update: badge,
            create: badge
        });
    }
    for (const control of controls) {
        await prisma.control.upsert({
            where: { controlId: control.controlId },
            update: control,
            create: control
        });
    }
    for (const template of policyTemplates) {
        await prisma.policyTemplate.upsert({
            where: { slug: template.slug },
            update: template,
            create: template
        });
    }
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
