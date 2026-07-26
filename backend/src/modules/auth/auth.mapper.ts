import { User } from "@/generated/prisma/client";
import { UserResponse } from "./auth.response";
import { CurrentUserDTO } from "./auth.types";

export const toUserResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    authProvider: user.authProvider,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const toCurrentUserResponse = (user: CurrentUserDTO) => {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
};
