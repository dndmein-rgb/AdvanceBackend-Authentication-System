import { z } from "zod"

export const getRoleByIdSchema = z.object({
  roleId:z.uuid()
})

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name must be at least 2 characters")
    .max(50, "Role name cannot exceed 50 characters")
    .transform((value) => value.toUpperCase()),
}).strict();

export const updateRoleSchema = createRoleSchema

export const roleIdSchema = z.object({
  roleId: z.uuid("Invalid role id"),
});
export const userIdSchema = z.object({
  userId: z.uuid("Invalid user id"),
});

