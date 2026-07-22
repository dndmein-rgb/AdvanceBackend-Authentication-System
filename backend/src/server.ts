import { app } from "@/app.js";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { prisma } from "@/infrastructure/database/index.js";

const startServer = async () => {
  try {
    await prisma.$connect();

    logger.info("Database connected successfully");

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });


    process.on("SIGINT", async () => {
      logger.info("SIGINT received. Shutting down...");

      await prisma.$disconnect();

      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });


    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received. Shutting down...");

      await prisma.$disconnect();

      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });


  } catch (error) {
    logger.fatal(error, "Application startup failed");
    process.exit(1);
  }
};


startServer();