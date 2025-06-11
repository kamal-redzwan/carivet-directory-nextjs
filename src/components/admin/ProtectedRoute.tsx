'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading';
import { AdminRole } from '@/types/auth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AdminRole['name'];
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/admin/auth/signin');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <LoadingSpinner size='lg' text='Loading...' />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Check role requirement
  if (requiredRole && user.role.name !== requiredRole) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Access Denied
          </h1>
          <p className='text-gray-600'>
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission) {
    const hasPermission = user.permissions[
      requiredPermission.resource
    ]?.includes(requiredPermission.action);

    if (!hasPermission) {
      if (fallback) return <>{fallback}</>;

      return (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Access Denied
            </h1>
            <p className='text-gray-600'>
              You don&apos;t have permission to perform this action.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
