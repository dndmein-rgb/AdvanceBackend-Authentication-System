import { googleService } from "@/common/services/google.service";
import { generateOAuthState } from "./oauth.utils";
import { GoogleAuthUrlResponse } from "./oauth.types";
import { AppError } from "@/common/errors/app-error";

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

  async handleGoogleCallback(code: string) {
    return code;
  }
}
