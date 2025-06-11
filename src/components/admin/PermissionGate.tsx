'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AdminRole } from '@/types/auth';

interface PermissionGateProps {
  children: React.ReactNode;
  role?: AdminRole['name'];
  permission?: {
    resource: string;
    action: string;
  };
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  role,
  permission,
  fallback = null,
}: PermissionGateProps) {
  const { user, hasPermission, isRole } = useAuth();

  if (!user) return <>{fallback}</>;

  // Check role requirement
  if (role && !isRole(role)) {
    return <>{fallback}</>;
  }

  // Check permission requirement
  if (permission && !hasPermission(permission.resource, permission.action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
