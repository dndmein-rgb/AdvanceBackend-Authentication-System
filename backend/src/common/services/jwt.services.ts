import { env } from "@/config/env";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/app-error";

export interface AccessTokenPayload extends JwtPayload {
  readonly userId: string;
  readonly sessionId: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  readonly userId: string;
  readonly sessionId: string;
}

export const authConfig = {
  accessToken: {
    secret: env.JWT_ACCESS_TOKEN_SECRET,
    expiry: env.JWT_ACCESS_TOKEN_EXPIRY,
  },
  refreshToken: {
    secret: env.JWT_REFRESH_TOKEN_SECRET,
    expiry: env.JWT_REFRESH_TOKEN_EXPIRY,
  },
};
export class JwtService {
  static signAccessToken(payload: AccessTokenPayload): string {
    const options: SignOptions = {
      expiresIn: authConfig.accessToken.expiry,
    };

    return jwt.sign(payload, authConfig.accessToken.secret, options);
  }
  static verifyAccessToken(token: string): AccessTokenPayload {
    try {
      return jwt.verify(
        token,
        authConfig.accessToken.secret,
      ) as AccessTokenPayload;
    } catch {
      throw new AppError("Invalid or expired access token", 401);
    }
  }

  static signRefreshToken(payload: RefreshTokenPayload): string {
    const options: SignOptions = {
      expiresIn: authConfig.refreshToken.expiry,
    };
    return jwt.sign(payload, authConfig.refreshToken.secret, options);
  }
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(
        token,
        authConfig.refreshToken.secret,
      ) as RefreshTokenPayload;
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }
}
