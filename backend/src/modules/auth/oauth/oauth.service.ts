import { googleService } from "@/common/services/google.service";
import { generateOAuthState } from "./oauth.utils";
import { GoogleAuthUrlResponse } from "./oauth.types";
import { AppError } from "@/common/errors/app-error";
import { authService } from "../auth.container";

export class GoogleOAuthService {
  generateGoogleAuthUrl(): GoogleAuthUrlResponse {
    const state = generateOAuthState();
    const url = googleService.generateAuthUrl(state);
    return {
      state,
      url,
    };
  }
  validateOAuthState(cookieState: string, state: string) {
    if (!cookieState || !state || cookieState !== state) {
      throw new AppError("Invalid OAuth state", 401);
    }
  }

  async handleGoogleCallback(
    code: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const tokens = await googleService.exchangeCodeForTokens(code);

    if (!tokens.id_token) {
      throw new AppError("Google ID token missing", 400);
    }

    const payload = await googleService.verifyToken(tokens.id_token);
    if (!payload.sub || !payload.email) {
      throw new AppError("Google account information is incomplete", 400);
    }

    return authService.loginWithGoogle(
      payload.sub,
      payload.email,
      ipAddress,
      userAgent,
    );
  }
}
