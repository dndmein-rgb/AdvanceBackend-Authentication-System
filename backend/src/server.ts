import { app } from "@/app.js";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { prisma } from "@/infrastructure/database/index.js";
import { Server } from "node:http";

let isShuttingDown = false;
const shutDown = async (signal: string, server: Server): Promise<void> => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  logger.info(`${signal} received. Shutting down...`);
  const forceShutdownTimeout = setTimeout(() => {
    logger.error("Graceful shutdown timed out. Forcing exit.");
    process.exit(1);
  }, 10_000);
  forceShutdownTimeout.unref();

  try {
    await prisma.$disconnect();
    logger.info("Database disconnected");
  } catch (error) {
    logger.error(error, "Failed to disconnect Prisma");
  }

  server.close(() => {
    clearTimeout(forceShutdownTimeout)
    logger.info("HTTP server closed");
    process.exit(0);
  });
};

const startServer = async () => {
  try {
    await prisma.$connect();

    logger.info("Database connected successfully");

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    process.on("SIGINT",  () => {
      void shutDown("SIGINT", server);
    });

    process.on("SIGTERM",  () => {
      void shutDown("SIGTERM", server);
    });
  } catch (error) {
    logger.fatal(error, "Application startup failed");
    process.exit(1);
  }
};

void startServer();
