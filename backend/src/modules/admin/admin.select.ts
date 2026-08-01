import { Prisma } from "@/generated/prisma/client";

export const adminUserSelect = {
  id: true,
  email: true,
  authProvider: true,
  isEmailVerified: true,
  createdAt: true,
} satisfies Prisma.UserSelect;
export const adminRoleSelect = {
  id: true,
  name: true,
  createdAt: true,
  isSystem: true,
} satisfies Prisma.RoleSelect;
