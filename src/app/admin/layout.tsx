'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show admin layout for auth pages
  const isAuthPage = pathname?.includes('/admin/auth/');

  if (isAuthPage) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className='min-h-screen bg-gray-50'>
          <AdminHeader />
          <div className='flex'>
            <AdminSidebar />
            <main className='flex-1 p-8 overflow-auto'>{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
