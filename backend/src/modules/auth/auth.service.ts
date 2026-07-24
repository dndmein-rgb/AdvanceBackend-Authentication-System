import { AppError } from "@/common/errors/app-error";
import { PasswordService } from "@/common/services/password.service";

import { toUserResponse } from "./auth.mapper";

import type { IAuthRepository } from "./auth.interface";
import type { LoginUserServiceDTO, RegisterUserServiceDTO } from "./auth.types";
import { generateSessionId } from "./auth.utils";
import { JwtService } from "@/common/services/jwt.services";
import { TokenService } from "@/common/services/token.service";
import { env } from "@/config/env";
import ms from "ms";
import { AuthRespone, AuthTokens } from "./auth.response";

export class AuthService {
  constructor(private readonly authRepo: IAuthRepository) {}

  async createdAuthenticatedSession(
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthTokens> {
    const sessionId = generateSessionId();
    
    const accessToken = JwtService.signAccessToken({ userId, sessionId });
    const refreshToken = JwtService.signRefreshToken({ userId, sessionId });

    const refreshTokenHash = TokenService.hashRefreshToken(refreshToken);
    
    const refreshTokenExpiry = ms(env.JWT_REFRESH_TOKEN_EXPIRY);
    
    if (typeof refreshTokenExpiry !== "number") {
      throw new AppError("Invalid refresh token expiry configuration", 500);
    }
    
    const expiresAt = new Date(Date.now() + refreshTokenExpiry);
    await this.authRepo.createSession({
      id: sessionId,
      userId,
      expiresAt,
      refreshTokenHash,
      ipAddress,
      userAgent,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async register(data: RegisterUserServiceDTO): Promise<AuthRespone> {
    const existingUser = await this.authRepo.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    const passwordHash = await PasswordService.hash(data.password);

    const user = await this.authRepo.createUser({
      email: data.email,
      passwordHash,
    });
    const authSession = await this.createdAuthenticatedSession(
      user.id,
      data.ipAddress,
      data.userAgent,
    );
    return {
      user: toUserResponse(user),
      ...authSession,
    };
  }

  async login(data: LoginUserServiceDTO): Promise<AuthRespone> {
    const user = await this.authRepo.findUserByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or passoword", 401);
    }

    if (!user.passwordHash) {
      throw new AppError("Invalid login method", 400);
    }

    const isPasswordValid = await PasswordService.verify(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }
    const authSession = await this.createdAuthenticatedSession(
      user.id,
      data.ipAddress,
      data.userAgent,
    );

    return {
      user: toUserResponse(user),
      ...authSession,
    };
  }
}
