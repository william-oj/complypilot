import { getDashboard } from "../services/dashboardService";
import { Request, Response } from "express";

export async function dashboard(req: Request, res: Response) {
  const metrics = await getDashboard(req.orgId!);
  return res.json(metrics);
}
