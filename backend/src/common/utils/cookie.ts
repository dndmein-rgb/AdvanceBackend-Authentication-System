import { env } from "@/config/env";
import ms from "ms";
import { AppError } from "../errors/app-error";
import { Response } from "express";

const refreshTokenMaxAge = ms(env.JWT_REFRESH_TOKEN_EXPIRY)

if (typeof refreshTokenMaxAge !== "number") {
  throw new AppError("Invalid refresh token expiry configuration",500)
}
export const setRefreshTokenCookie = (res: Response, refreshToken: string):void=>{
  res.cookie(env.COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge:refreshTokenMaxAge
  })
}

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
       secure: env.NODE_ENV === "production",
       sameSite: "lax",
       path: "/",
  })
}