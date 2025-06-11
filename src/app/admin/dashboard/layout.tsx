'use client';

import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gray-50'>
        <AdminHeader />
        <div className='flex'>
          <AdminSidebar />
          <main className='flex-1 p-8'>{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
