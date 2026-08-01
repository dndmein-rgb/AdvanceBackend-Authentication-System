import { AppError } from "@/common/errors/app-error";

const ensureImmutable = (role: { isSystem: boolean }, message: string) => {
  if (role.isSystem) {
    throw new AppError(message, 403);
  }
};
export const ensureRoleIsEditable = (role: { isSystem: boolean }) =>
  ensureImmutable(role, "System roles cannot be modified");

export const ensureRoleIsDeletable = (role: { isSystem: boolean }) =>
  ensureImmutable(role, "System roles cannot be deleted");

export const ensureRoleIsAssignable = (role: { isSystem: boolean }) =>
  ensureImmutable(role, "System roles cannot be assigned");
