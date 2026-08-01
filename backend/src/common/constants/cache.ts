export const CACHE_KEYS = {
  USER_PERMISSIONS: (userId: string) => `permissions :${userId}`,
} as const;

export const CACHE_TTL = {
  USER_PERMISSIONS: 60 * 10, // 10 minutes
} as const;
