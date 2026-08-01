export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: "manage_users",

  // Role Management
  MANAGE_ROLES: "manage_roles",

  // Product Permissions
  CREATE_PRODUCT: "create_product",
  UPDATE_PRODUCT: "update_product",
  DELETE_PRODUCT: "delete_product",
  VIEW_PRODUCT: "view_product",

  // Order Permissions
  CREATE_ORDER: "create_order",
  UPDATE_ORDER: "update_order",
  VIEW_ORDER: "view_order",
  CANCEL_ORDER: "cancel_order",

  // Analytics
  VIEW_ANALYTICS: "view_analytics",
} as const;

export const PERMISSION_VALUES = Object.values(PERMISSIONS) as [
  Permission,
  ...Permission[],
];

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
