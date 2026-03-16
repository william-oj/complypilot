import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { env } from "./config/env";
import { apiRateLimit } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import { openapiSpec } from "./openapi";
import { router } from "./routes";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(apiRateLimit);
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.use(router);

  app.use(errorHandler);
  return app;
}
