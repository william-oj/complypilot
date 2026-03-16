import { Queue, Worker, JobsOptions } from "bullmq";
import { env } from "../config/env";
import { indexDocument } from "../services/searchService";

const connection = env.REDIS_URL ? { url: env.REDIS_URL } : null;
export const indexQueue = connection ? new Queue("indexer", { connection }) : null;

export type IndexJob = {
  orgId: string;
  type: string;
  id: string;
  body: Record<string, any>;
};

export async function enqueueIndex(job: IndexJob, opts?: JobsOptions) {
  if (!indexQueue) {
    await indexDocument(job.orgId, job.type, job.id, job.body);
    return;
  }
  await indexQueue.add("index", job, opts);
}

export function startIndexWorker() {
  if (!connection) return null;
  return new Worker(
    "indexer",
    async (job) => {
      const data = job.data as IndexJob;
      await indexDocument(data.orgId, data.type, data.id, data.body);
    },
    { connection }
  );
}
