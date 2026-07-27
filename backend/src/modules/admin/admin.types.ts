import { Permission } from "@/common/constants/permissions";

export interface AuthServiceDTO{
  userId: string;
  permission:Permission
}