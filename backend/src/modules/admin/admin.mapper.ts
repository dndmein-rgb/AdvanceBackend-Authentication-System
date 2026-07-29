import { Role } from "@/generated/prisma/client";
import { RoleResponseDTO } from "./admin.types";

export const toRoleResponse = (role:Role):RoleResponseDTO => {
  return {
    id: role.id,
    name: role.name,
    createdAt:role.createdAt
  }
}