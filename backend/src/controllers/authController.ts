import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { z } from "zod";
import { Request, Response } from "express";
import { verifyIdToken } from "../services/oauthService";
import { createDefaultRoles } from "../services/roleService";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  organizationName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const oauthSchema = z.object({
  provider: z.enum(["google", "microsoft"]),
  idToken: z.string().min(10),
  organizationName: z.string().optional()
});

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return res.status(400).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { email: data.email, name: data.name, passwordHash, status: "ACTIVE" }
  });

  let org = null;
  if (data.organizationName) {
    org = await prisma.organization.create({ data: { name: data.organizationName } });
    const { adminRole } = await createDefaultRoles(org.id);

    await prisma.organizationMember.create({
      data: { orgId: org.id, userId: user.id, roleId: adminRole.id, title: "Owner" }
    });
  }

  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  return res.json({ token, user, organization: org });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  return res.json({ token, user });
}

export async function oauthLogin(req: Request, res: Response) {
  const data = oauthSchema.parse(req.body);
  const audience = data.provider === "google" ? env.GOOGLE_CLIENT_ID : env.MICROSOFT_CLIENT_ID;
  let payload;
  try {
    payload = await verifyIdToken(data.provider, data.idToken, audience);
  } catch {
    return res.status(401).json({ error: "Invalid OAuth token" });
  }

  const email = payload.email as string | undefined;
  if (!email) return res.status(400).json({ error: "Email not present in token" });

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email, name: (payload.name as string) || email, status: "ACTIVE" } });
  }

  let org = null;
  if (data.organizationName) {
    org = await prisma.organization.create({ data: { name: data.organizationName } });
    const { adminRole } = await createDefaultRoles(org.id);
    await prisma.organizationMember.create({
      data: { orgId: org.id, userId: user.id, roleId: adminRole.id, title: "Owner" }
    });
  }

  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  return res.json({ token, user, organization: org });
}
