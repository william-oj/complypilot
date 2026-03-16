import { Client } from "@elastic/elasticsearch";
import { env } from "../config/env";
import { prisma } from "../config/db";

const client = env.ELASTICSEARCH_URL ? new Client({ node: env.ELASTICSEARCH_URL }) : null;

function indexName(orgId: string, type: string) {
  return `complypilot-${orgId}-${type}`;
}

export async function indexDocument(orgId: string, type: string, id: string, body: Record<string, any>) {
  if (!client) return;
  const index = indexName(orgId, type);
  await client.index({ index, id, document: body, refresh: true });
}

export async function search(orgId: string, type: string, query: string) {
  if (!client) {
    if (type === "assets") {
      return prisma.asset.findMany({
        where: { orgId, name: { contains: query, mode: "insensitive" } }
      });
    }
    if (type === "risks") {
      return prisma.risk.findMany({
        where: {
          orgId,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } }
          ]
        }
      });
    }
    if (type === "policies") {
      return prisma.policy.findMany({
        where: {
          orgId,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } }
          ]
        }
      });
    }
    return [];
  }

  const index = indexName(orgId, type);
  const result = await client.search({
    index,
    query: { multi_match: { query, fields: ["title", "name", "description"] } }
  });
  return result.hits.hits.map((hit) => hit._source);
}
