import { UserWithRole, AdminRole } from '@/types/auth';

export const checkPermission = (
  user: UserWithRole | null,
  resource: string,
  action: string
): boolean => {
  if (!user) return false;

  const permissions = user.permissions[resource];
  if (!permissions) return false;

  return permissions.includes(action);
};

export const hasRole = (
  user: UserWithRole | null,
  role: AdminRole['name']
): boolean => {
  if (!user) return false;
  return user.role.name === role;
};

export const isSuperAdmin = (user: UserWithRole | null): boolean => {
  return hasRole(user, 'super_admin');
};

export const canManageClinics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'clinics', 'write') || isSuperAdmin(user);
};

export const canViewAnalytics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'analytics', 'read') || isSuperAdmin(user);
};
