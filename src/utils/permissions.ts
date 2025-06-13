// src/utils/permissions.ts
import { UserWithRole, AdminRole } from '@/types/auth';

// ============================================================================
// BASE PERMISSION FUNCTIONS (Existing)
// ============================================================================

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

// ============================================================================
// CLINIC PERMISSIONS (Enhanced)
// ============================================================================

export const canManageClinics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'clinics', 'write') || isSuperAdmin(user);
};

// ✅ NEW: View clinics permission
export const canViewClinics = (user: UserWithRole | null): boolean => {
  return (
    checkPermission(user, 'clinics', 'read') ||
    checkPermission(user, 'clinics', 'write') ||
    isSuperAdmin(user)
  );
};

// ✅ NEW: Delete clinics permission
export const canDeleteClinics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'clinics', 'delete') || isSuperAdmin(user);
};

// ✅ NEW: Create clinics permission
export const canCreateClinics = (user: UserWithRole | null): boolean => {
  return (
    checkPermission(user, 'clinics', 'create') ||
    checkPermission(user, 'clinics', 'write') ||
    isSuperAdmin(user)
  );
};

// ============================================================================
// USER MANAGEMENT PERMISSIONS (New)
// ============================================================================

// ✅ NEW: Manage users permission
export const canManageUsers = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'users', 'write') || isSuperAdmin(user);
};

// ✅ NEW: View users permission
export const canViewUsers = (user: UserWithRole | null): boolean => {
  return (
    checkPermission(user, 'users', 'read') ||
    checkPermission(user, 'users', 'write') ||
    isSuperAdmin(user)
  );
};

// ✅ NEW: Delete users permission
export const canDeleteUsers = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'users', 'delete') || isSuperAdmin(user);
};

// ============================================================================
// SYSTEM PERMISSIONS (New)
// ============================================================================

// ✅ NEW: System management permission
export const canManageSystem = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'system', 'write') || isSuperAdmin(user);
};

// ✅ NEW: View system settings permission
export const canViewSystem = (user: UserWithRole | null): boolean => {
  return (
    checkPermission(user, 'system', 'read') ||
    checkPermission(user, 'system', 'write') ||
    isSuperAdmin(user)
  );
};

// ============================================================================
// ANALYTICS PERMISSIONS (Enhanced)
// ============================================================================

export const canViewAnalytics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'analytics', 'read') || isSuperAdmin(user);
};

// ✅ NEW: Manage analytics permission
export const canManageAnalytics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'analytics', 'write') || isSuperAdmin(user);
};

// ============================================================================
// CONTENT PERMISSIONS (New)
// ============================================================================

// ✅ NEW: Manage content permission
export const canManageContent = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'content', 'write') || isSuperAdmin(user);
};

// ✅ NEW: View content permission
export const canViewContent = (user: UserWithRole | null): boolean => {
  return (
    checkPermission(user, 'content', 'read') ||
    checkPermission(user, 'content', 'write') ||
    isSuperAdmin(user)
  );
};

// ============================================================================
// UTILITY PERMISSION FUNCTIONS (New)
// ============================================================================

// ✅ NEW: Check multiple permissions (AND logic)
export const hasAllPermissions = (
  user: UserWithRole | null,
  permissions: Array<{ resource: string; action: string }>
): boolean => {
  if (!user || permissions.length === 0) return false;
  return permissions.every(({ resource, action }) =>
    checkPermission(user, resource, action)
  );
};

// ✅ NEW: Check multiple permissions (OR logic)
export const hasAnyPermission = (
  user: UserWithRole | null,
  permissions: Array<{ resource: string; action: string }>
): boolean => {
  if (!user || permissions.length === 0) return false;
  return (
    permissions.some(({ resource, action }) =>
      checkPermission(user, resource, action)
    ) || isSuperAdmin(user)
  );
};

// ✅ NEW: Check if user has any role from a list
export const hasAnyRole = (
  user: UserWithRole | null,
  roles: AdminRole['name'][]
): boolean => {
  if (!user || roles.length === 0) return false;
  return roles.includes(user.role.name);
};

// ✅ NEW: Get all user permissions as array
export const getUserPermissions = (user: UserWithRole | null): string[] => {
  if (!user) return [];

  const permissions: string[] = [];
  Object.entries(user.permissions).forEach(([resource, actions]) => {
    if (Array.isArray(actions)) {
      actions.forEach((action) => {
        permissions.push(`${resource}:${action}`);
      });
    }
  });

  return permissions;
};

// ============================================================================
// ROLE-BASED PERMISSION SHORTCUTS (New)
// ============================================================================

// ✅ NEW: Super admin check with specific permissions
export const isSuperAdminWith = (
  user: UserWithRole | null,
  resource: string,
  action: string
): boolean => {
  return isSuperAdmin(user) && checkPermission(user, resource, action);
};

// ✅ NEW: Admin role permissions
export const isAdmin = (user: UserWithRole | null): boolean => {
  return hasRole(user, 'admin');
};

// ✅ NEW: Moderator role permissions
export const isModerator = (user: UserWithRole | null): boolean => {
  return hasRole(user, 'moderator');
};

// ✅ NEW: Clinic owner role permissions
export const isClinicOwner = (user: UserWithRole | null): boolean => {
  return hasRole(user, 'clinic_owner');
};

// ✅ NEW: Check if user can perform action on specific clinic (for clinic owners)
export const canAccessClinic = (
  user: UserWithRole | null,
  clinicId: string,
  action: 'read' | 'write' | 'delete' = 'read'
): boolean => {
  if (!user) return false;

  // Super admins can access everything
  if (isSuperAdmin(user)) return true;

  // Check general clinic permissions first
  if (checkPermission(user, 'clinics', action)) return true;

  // For clinic owners, check if they own this specific clinic
  // Note: You'll need to implement clinic ownership logic in your database
  if (isClinicOwner(user)) {
    // This would need to be implemented based on your clinic ownership model
    // For now, clinic owners can only read
    return action === 'read';
  }

  return false;
};

// ============================================================================
// PERMISSION VALIDATION HELPERS (New)
// ============================================================================

// ✅ NEW: Validate user has minimum required permissions
export const validateMinimumPermissions = (
  user: UserWithRole | null,
  requiredPermissions: Array<{ resource: string; action: string }>
): { isValid: boolean; missing: string[] } => {
  if (!user) {
    return {
      isValid: false,
      missing: requiredPermissions.map((p) => `${p.resource}:${p.action}`),
    };
  }

  if (isSuperAdmin(user)) {
    return { isValid: true, missing: [] };
  }

  const missing: string[] = [];

  requiredPermissions.forEach(({ resource, action }) => {
    if (!checkPermission(user, resource, action)) {
      missing.push(`${resource}:${action}`);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
  };
};

// ✅ NEW: Get readable permission description
export const getPermissionDescription = (
  resource: string,
  action: string
): string => {
  const descriptions: Record<string, Record<string, string>> = {
    clinics: {
      read: 'View clinic information',
      write: 'Edit clinic details',
      create: 'Add new clinics',
      delete: 'Remove clinics',
    },
    users: {
      read: 'View user accounts',
      write: 'Edit user details',
      create: 'Create new users',
      delete: 'Remove user accounts',
    },
    analytics: {
      read: 'View analytics data',
      write: 'Manage analytics settings',
    },
    system: {
      read: 'View system settings',
      write: 'Modify system configuration',
    },
    content: {
      read: 'View content',
      write: 'Edit content',
    },
  };

  return descriptions[resource]?.[action] || `${action} ${resource}`;
};
