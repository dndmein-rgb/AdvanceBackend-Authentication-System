import { env } from "@/config/env";
import { Response } from "express";

const OAUTH_STATE_COOKIE_NAME = "oauth_state";
const OAUTH_STATE_COOKIE_MAX_AGE = 10 * 60 * 1000; // 10 minutes

export const setOAuthStateCookie = (res: Response, state: string): void => {
  res.cookie(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    maxAge: OAUTH_STATE_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",   // path determines which request paths will receive the cookie.
  });
};

export const clearOAuthStateCookie = (res: Response): void => {
  res.clearCookie(OAUTH_STATE_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export { OAUTH_STATE_COOKIE_NAME, OAUTH_STATE_COOKIE_MAX_AGE };
