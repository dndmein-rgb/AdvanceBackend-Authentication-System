import { logger } from "@/config/logger";
import { redis } from "@/infrastructure/database";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(
        {
          error,
          key,
        },
        "Redis GET failed",
      );

      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (error) {
      logger.error(
        {
          error,
          key,
        },
        "Redis SET failed",
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error(
        {
          error,
          key,
        },
        "Redis DEL failed",
      );
    }
  }

  async delMany(keys: string[]): Promise<void> {
    if (!keys.length) {
      return;
    }

    try {
      await redis.del(...keys);
    } catch (error) {
      logger.error(
        {
          error,
          keys,
        },
        "Redis DEL MANY failed",
      );
    }
  }
}

export const cacheService = new CacheService();