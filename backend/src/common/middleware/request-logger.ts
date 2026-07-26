import { logger } from "@/config/logger";
import { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: req.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
};
