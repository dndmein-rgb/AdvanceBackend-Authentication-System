import { createRateLimiter } from "./rate-limit";

export const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  prefix: "global",
  error: {
    code: "GLOBAL_RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again later.",
  },
});

export const loginRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  prefix: "login",
  error: {
    code: "LOGIN_RATE_LIMIT_EXCEEDED",
    message: "Too many login attempts. Please try again later.",
  },
});


export const registerRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  prefix: "register",
  error: {
    code: "REGISTRATION_RATE_LIMIT_EXCEEDED",
    message: "Too many registration attempts. Please try again later.",
  },
});

export const refreshTokenRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  prefix: "refresh-token",
  error: {
    code: "REFRESH_TOKEN_RATE_LIMIT_EXCEEDED",
    message: "Too many refresh-token requests. Please try again later.",
  },
});

export const oauthStartLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  prefix: "login",
  error: {
    code: "OAUTH_START_LIMIT_EXCEEDED",
    message: "Too many oauth requests. Please try again later.",
  },
});

export const oauthCallbackLimiter = createRateLimiter({
  windowMs: 1*60*1000,
  limit: 10,
  prefix: "oauth-callback",
  error: {
    code:"OAUTH_CALLBACK_LIMIT_EXCEEDED",
    message: "Too many OAuth callback requests. Please try again later.",
  }
});

