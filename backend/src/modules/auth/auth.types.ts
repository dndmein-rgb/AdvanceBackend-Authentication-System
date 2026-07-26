import { LoginUserDTO, RegisterUserDTO } from "./auth.schema";

export interface CreateSessionDTO {
  readonly id: string;
  readonly userId: string;
  readonly refreshTokenHash: string;
  readonly userAgent?: string;
  readonly ipAddress?: string;
  readonly expiresAt: Date;
}

export interface RegisterUserServiceDTO extends RegisterUserDTO {
  readonly userAgent: string;
  readonly ipAddress: string;
}

export interface LoginUserServiceDTO extends LoginUserDTO {
  readonly userAgent: string;
  readonly ipAddress: string;
}

export interface CreateUserDTO {
  readonly email: string;
  readonly passwordHash: string;
}

export interface RefreshTokenPayload {
  readonly userId: string;
  readonly sessionId: string;
}

export interface RefreshTokenServiceDTO {
  readonly refreshToken: string;
}

export interface RotateSessionDTO {
  readonly sessionId: string;
  readonly refreshTokenHash: string;
  readonly expiresAt: Date;
}

export interface LogoutServiceDTO {
  readonly refreshToken?: string;
}

export interface GetCurrentUserDTO {
  userId: string;
}

export interface CurrentUserDTO {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;
}
