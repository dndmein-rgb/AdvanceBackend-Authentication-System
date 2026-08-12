import { asyncHandler } from "@/common/middleware/async-handler";
import { Request, Response } from "express";
import { googleOAuthService } from "./oauth.container";
import { sendResponse } from "@/common/utils/send-response";
import {
  clearOAuthStateCookie,
  OAUTH_STATE_COOKIE_NAME,
  setOAuthStateCookie,
} from "@/common/utils/oauth-cookie";
import { GoogleCallbackDTO } from "./oauth.types";
import { env } from "@/config/env";
import { setRefreshTokenCookie } from "@/common/utils/cookie";

export const redirectToGoogleController = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = googleOAuthService.generateGoogleAuthUrl();
    setOAuthStateCookie(res, result.state);
    sendResponse(res, 200, {
      success: true,
      message: "Google OAuth url generated successfully",
      data: {
        url: result.url,
      },
    });
  },
);

export const googleCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query as unknown as GoogleCallbackDTO;

    googleOAuthService.validateOAuthState(
      req.cookies[OAUTH_STATE_COOKIE_NAME],
      state,
    );

    clearOAuthStateCookie(res);
    const result = await googleOAuthService.handleGoogleCallback(
      code,
      req.ip as string,
      req.get("user-agent") ?? "unknown",
    );
    setRefreshTokenCookie(res, result.refreshToken);
    res.redirect(`${env.FRONTEND_URL}/dashboard`);
  },
);
