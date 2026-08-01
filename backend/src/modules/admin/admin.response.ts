
export interface RoleResponseDTO {
  id:string;
  name:string;
  createdAt:Date;
  isSystem:boolean;
}

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

export interface RoleListResponseDTO {
  id: string;
  name: string;
  createdAt: Date;
  userCount: number;
  permissionCount: number;
  isSystem:boolean
}
export interface CursorPaginationResponseDTO<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
  };
}
