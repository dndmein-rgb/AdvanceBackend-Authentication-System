export const RATE_LIMIT = {
  GLOBAL: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
  },
} as const;
