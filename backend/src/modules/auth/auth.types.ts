import { LoginUserDTO, RegisterUserDTO } from "./auth.schema";

export interface CreateSessionDTO {
  readonly id: string;
  readonly userId: string;
  readonly refreshTokenHash: string;
  readonly userAgent?: string;
  readonly ipAddress?: string;
  readonly expiresAt: Date;
}

export interface RegisterUserServiceDTO extends RegisterUserDTO{
  readonly userAgent: string;
  readonly ipAddress:string
}

export interface LoginUserServiceDTO extends LoginUserDTO {
  readonly userAgent: string;
  readonly ipAddress: string;
}

export interface CreateUserDTO {
  readonly email: string;
  readonly passwordHash: string;
}