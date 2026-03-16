import { search } from "../services/searchService";
import { z } from "zod";
import { Request, Response } from "express";

export async function searchAll(req: Request, res: Response) {
  const data = z.object({ q: z.string().min(2), type: z.string().min(2) }).parse(req.query);
  const results = await search(req.orgId!, data.type, data.q);
  return res.json(results);
}
