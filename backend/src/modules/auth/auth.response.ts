import { AuthProvider } from "@/generated/prisma/enums";

export interface UserResponse {
  readonly id: string;
  readonly email: string;
  readonly isEmailVerified: boolean;
  readonly authProvider: AuthProvider;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
