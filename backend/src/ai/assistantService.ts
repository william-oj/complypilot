import { openai } from "./openaiClient";
import { env } from "../config/env";

const systemPrompt = `You are ISO-Easy, a helpful compliance assistant. Explain ISO 27001 concepts in plain language, suggest practical steps, and keep answers concise. Avoid jargon unless asked.`;

export async function askAssistant(prompt: string) {
  if (!env.OPENAI_API_KEY) {
    return "AI assistant is not configured. Set OPENAI_API_KEY in the backend environment.";
  }
  const response = await openai.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ]
  });

  const output = response.output_text || "";
  return output.trim();
}
