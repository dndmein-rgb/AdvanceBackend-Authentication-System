import { redis } from "@/infrastructure/database";
import rateLimit from "express-rate-limit";
import RedisStore, { RedisReply } from "rate-limit-redis";

interface RateLimiterOptions {
  windowMs: number;
  limit: number;
  prefix: string;
  error: {
    message:string
    code: string,
  }
}
export const createRateLimiter = ({
  windowMs,
  limit,
  prefix,
  error,
}: RateLimiterOptions) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: async (...args: string[]) => {
        const [command, ...commandArgs] = args;
        return redis.call(command, ...commandArgs) as Promise<RedisReply>;
      },
      prefix: `rate-limit:${prefix}:`,
    }),
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        error,
      });
    },
  });
};
