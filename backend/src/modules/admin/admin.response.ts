import { Role } from "@/generated/prisma/client";

export type RoleResponseDTO = Pick<Role, "id" | "name" | "createdAt">;

export interface PermissionResponseDTO {
  id: string;
  name: string;
}
export interface UserRoleResponseDTO {
  id: string;
  email: string;
  assignedAt: Date;
}

export interface RoleDetailsResponseDTO extends RoleResponseDTO {
  permissions: {
    id: string;
    name: string;
    assignedAt: Date;
  }[];

  users: UserRoleResponseDTO[];
}