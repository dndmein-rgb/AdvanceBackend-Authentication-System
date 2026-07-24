import { AuthProvider } from "@/generated/prisma/enums";

export interface UserResponse {
  readonly id: string;
  readonly email: string;
  readonly isEmailVerified: boolean;
  readonly authProvider: AuthProvider;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AuthTokens{
  readonly accessToken: string;
  readonly refreshToken:string
}

export interface AuthRespone extends AuthTokens{
  readonly user:UserResponse
}