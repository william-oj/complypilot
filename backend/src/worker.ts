import { startIndexWorker } from "./jobs/indexer";
import { logger } from "./config/logger";

const worker = startIndexWorker();
if (worker) {
  logger.info("Index worker started");
} else {
  logger.info("Index worker disabled (no Redis URL)");
}
