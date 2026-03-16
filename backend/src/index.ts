import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const app = createApp();

app.listen(Number(env.PORT), () => {
  logger.info(`ComplyPilot API listening on port ${env.PORT}`);
});
