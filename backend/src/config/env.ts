import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("12h"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default("us-east-1"),
  S3_BUCKET: z.string().default("complypilot"),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_PUBLIC_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  ENCRYPTION_KEY_BASE64: z.string().optional(),
  REDIS_URL: z.string().optional(),
  ELASTICSEARCH_URL: z.string().optional(),
  AUDIT_LOG_RETENTION_DAYS: z.string().default("365")
});

export const env = schema.parse(process.env);
