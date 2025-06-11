'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PermissionGate } from '@/components/admin/PermissionGate';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AdminRole } from '@/types/auth';
import {
  Home,
  Building,
  Users,
  FileText,
  BarChart3,
  Settings,
  Shield,
  LucideIcon,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: {
    resource: string;
    action: string;
  };
  role?: AdminRole['name'];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
  },
  {
    name: 'Clinics',
    href: '/admin/clinics',
    icon: Building,
    permission: { resource: 'clinics', action: 'read' },
  },
  {
    name: 'Admin Users',
    href: '/admin/users',
    icon: Users,
    permission: { resource: 'users', action: 'read' },
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    permission: { resource: 'content', action: 'read' },
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: { resource: 'analytics', action: 'read' },
  },
  {
    name: 'System',
    href: '/admin/system',
    icon: Settings,
    role: 'super_admin',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className='w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen'>
      <div className='p-6'>
        <div className='flex items-center'>
          <Shield className='h-6 w-6 text-emerald-600 mr-2' />
          <span className='text-lg font-semibold text-gray-900'>
            Admin Panel
          </span>
        </div>
      </div>

      <nav className='px-6 pb-6'>
        <ul className='space-y-2'>
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <PermissionGate role={item.role} permission={item.permission}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5',
                        isActive ? 'text-emerald-500' : 'text-gray-400'
                      )}
                    />
                    {item.name}
                  </Link>
                </PermissionGate>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
