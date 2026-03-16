import { askAssistant } from "../ai/assistantService";
import { z } from "zod";
import { Request, Response } from "express";

export async function assist(req: Request, res: Response) {
  const data = z.object({ prompt: z.string().min(2) }).parse(req.body);
  const answer = await askAssistant(data.prompt);
  return res.json({ answer });
}
