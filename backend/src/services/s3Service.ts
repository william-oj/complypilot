import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config/env";
import fs from "fs/promises";
import path from "path";

const client = env.S3_ENDPOINT ? new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: env.S3_ACCESS_KEY && env.S3_SECRET_KEY ? {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY
  } : undefined,
  forcePathStyle: !!env.S3_ENDPOINT
}) : null;

export async function uploadFile(key: string, body: Buffer, contentType: string) {
  if (!client) {
    const root = path.resolve(process.cwd(), "uploads");
    const filePath = path.join(root, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, body);
    const url = `/uploads/${key.replace(/\\\\/g, "/")}`;
    return { key, url };
  }

  await client.send(new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType
  }));

  const base = env.S3_PUBLIC_URL || "";
  const url = base ? `${base}/${key}` : key;
  return { key, url };
}
