import { PERMISSION_VALUES } from "@/common/constants/permissions";
import { z } from "zod";

export const getRoleByIdSchema = z.object({
  roleId: z.uuid(),
});

export const createRoleSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Role name must be at least 2 characters")
      .max(50, "Role name cannot exceed 50 characters")
      .transform((value) => value.toUpperCase()),
  })
  .strict();

export const updateRoleSchema = createRoleSchema;

export const roleIdSchema = z.object({
  roleId: z.uuid("Invalid role id"),
});
export const userIdSchema = z.object({
  userId: z.uuid("Invalid user id"),
});

export const assignPermissionsSchema = z
  .object({
    permissions: z
      .array(z.enum(PERMISSION_VALUES))
      .min(1, "At least one permission is required"),
  })
  .strict();

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;
export type AssignPermissionsDTO = z.infer<typeof assignPermissionsSchema>;
