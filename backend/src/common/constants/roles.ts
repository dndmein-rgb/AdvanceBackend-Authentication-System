export const SYSTEM_ROLES = {
  USER:"USER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
  SUPER_ADMIN:"SUPER_ADMIN"
} as const 

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES]
export const IMMUTABLE_ROLES :ReadonlySet<string>= new Set([
  SYSTEM_ROLES.ADMIN,
  SYSTEM_ROLES.SUPER_ADMIN
])

export const DEFAULT_ROLE = SYSTEM_ROLES.USER;