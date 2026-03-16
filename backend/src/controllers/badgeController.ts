import { prisma } from "../config/db";
import { Request, Response } from "express";

export async function listBadges(req: Request, res: Response) {
  const badges = await prisma.badge.findMany();
  const unlocked = req.userId
    ? await prisma.badgeUnlock.findMany({ where: { orgId: req.orgId, userId: req.userId }, include: { badge: true } })
    : [];

  return res.json({ badges, unlocked });
}
