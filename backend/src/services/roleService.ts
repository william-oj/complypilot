import { prisma } from "../config/db";

const roleMatrix: Record<string, string[]> = {
  Admin: ["admin"],
  Manager: [
    "org:read",
    "org:write",
    "asset:read",
    "asset:write",
    "risk:read",
    "risk:write",
    "control:read",
    "control:write",
    "policy:read",
    "policy:write",
    "evidence:read",
    "evidence:write",
    "audit:read",
    "audit:write"
  ],
  Contributor: [
    "org:read",
    "asset:read",
    "asset:write",
    "risk:read",
    "risk:write",
    "control:read",
    "policy:read",
    "policy:write",
    "evidence:read",
    "evidence:write",
    "audit:read"
  ],
  Viewer: [
    "org:read",
    "asset:read",
    "risk:read",
    "control:read",
    "policy:read",
    "evidence:read",
    "audit:read"
  ]
};

export async function createDefaultRoles(orgId: string) {
  const permissions = await prisma.permission.findMany();
  const byKey = new Map(permissions.map((p) => [p.key, p.id]));

  const createRole = async (name: string, description: string, keys: string[]) => {
    const role = await prisma.role.create({ data: { orgId, name, description } });
    const permissionIds = keys[0] === "admin"
      ? permissions.map((p) => p.id)
      : keys.map((k) => byKey.get(k)).filter(Boolean) as string[];

    await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({ roleId: role.id, permissionId }))
    });
    return role;
  };

  const adminRole = await createRole("Admin", "Organization admin", roleMatrix.Admin);
  await createRole("Manager", "Manage compliance workflow", roleMatrix.Manager);
  await createRole("Contributor", "Contribute evidence and policies", roleMatrix.Contributor);
  await createRole("Viewer", "Read-only access", roleMatrix.Viewer);

  return { adminRole };
}
