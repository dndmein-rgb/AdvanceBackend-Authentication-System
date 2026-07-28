import { AppError } from "@/common/errors/app-error";
import { PasswordService } from "@/common/services/password.service";

import { toCurrentUserResponse, toUserResponse } from "./auth.mapper";

import type { IAuthRepository } from "./auth.interface";
import type {
  GetCurrentUserDTO,
  LoginUserServiceDTO,
  LogoutServiceDTO,
  RefreshTokenServiceDTO,
  RegisterUserServiceDTO,
} from "./auth.types";
import { generateSessionId } from "./auth.utils";
import { JwtService } from "@/common/services/jwt.services";
import { TokenService } from "@/common/services/token.service";
import { env } from "@/config/env";
import ms from "ms";
import {
  AuthResponse,
  AuthTokens,
  CurrentUserResponse,
  RefreshTokenResponse,
} from "./auth.response";
import { Permission } from "@/common/constants/permissions";

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
  async register(data: RegisterUserServiceDTO): Promise<AuthResponse> {
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

  async login(data: LoginUserServiceDTO): Promise<AuthResponse> {
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

  async logout(data: LogoutServiceDTO): Promise<void> {
    if (!data.refreshToken) return;

    let payload;
    try {
      payload = JwtService.verifyRefreshToken(data.refreshToken);
    } catch {
      return;
    }
    await this.authRepo.revokeSession(payload.sessionId);
  }
  async refreshToken(
    data: RefreshTokenServiceDTO,
  ): Promise<RefreshTokenResponse> {
    const { refreshToken } = data;
    const jwtPayload = JwtService.verifyRefreshToken(refreshToken);
    const session = await this.authRepo.findActiveSessionById(
      jwtPayload.sessionId,
    );

    if (!session) {
      throw new AppError("Session not found", 404);
    }
    if (session.expiresAt.getTime() < Date.now()) {
      throw new AppError("Session has expired", 401);
    }

    const isRefreshTokenValid = TokenService.verifyRefreshToken(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new AppError("Invalid refresh token", 401);
    }

    const accessToken = JwtService.signAccessToken({
      userId: jwtPayload.userId,
      sessionId: jwtPayload.sessionId,
    });

    const newRefreshToken = JwtService.signRefreshToken({
      userId: jwtPayload.userId,
      sessionId: jwtPayload.sessionId,
    });

    const refreshTokenHash = TokenService.hashRefreshToken(newRefreshToken);

    const expiry = ms(env.JWT_REFRESH_TOKEN_EXPIRY);

    if (typeof expiry !== "number") {
      throw new AppError("Invalid refresh expiry configuration", 500);
    }
    await this.authRepo.rotateSessionRefreshToken({
      refreshTokenHash,
      expiresAt: new Date(Date.now() + expiry),
      sessionId: jwtPayload.sessionId,
    });
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
  async getCurrentUser(data: GetCurrentUserDTO): Promise<CurrentUserResponse> {
    const user = await this.authRepo.findUserById(data.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return toCurrentUserResponse(user);
  }
  async logoutAllSessions(userId: string): Promise<void> {
    await this.authRepo.revokeAllSessions(userId);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    

    const userRoles = await this.authRepo.getUserPermissions(userId);

    const permissions = userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name as Permission,
      ),
    );

    return [...new Set(permissions)];
  }
}
