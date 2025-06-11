'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, FileText, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalClinics: number;
  totalAdminUsers: number;
  pendingVerifications: number;
  recentActivity: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClinics: 0,
    totalAdminUsers: 0,
    pendingVerifications: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Get total clinics
      const { count: clinicsCount } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true });

      // Get total admin users
      const { count: adminUsersCount } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get pending verifications (if verification status exists)
      const { count: pendingCount } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      setStats({
        totalClinics: clinicsCount || 0,
        totalAdminUsers: adminUsersCount || 0,
        pendingVerifications: pendingCount || 0,
        recentActivity: 0, // Placeholder for now
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className='space-y-8'>
      {/* Welcome Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>
          Welcome back, {user.user.email.split('@')[0]}!
        </h1>
        <p className='text-gray-600'>
          You&apos;re logged in as {user.role.display_name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Clinics</CardTitle>
            <Building className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {loading ? '...' : stats.totalClinics}
            </div>
            <p className='text-xs text-muted-foreground'>
              Active veterinary clinics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Admin Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {loading ? '...' : stats.totalAdminUsers}
            </div>
            <p className='text-xs text-muted-foreground'>
              Active admin accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Reviews
            </CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {loading ? '...' : stats.pendingVerifications}
            </div>
            <p className='text-xs text-muted-foreground'>
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Recent Activity
            </CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {loading ? '...' : stats.recentActivity}
            </div>
            <p className='text-xs text-muted-foreground'>Actions this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left'>
                <Building className='h-6 w-6 text-emerald-600 mb-2' />
                <h3 className='font-medium'>Add Clinic</h3>
                <p className='text-sm text-gray-600'>Register new clinic</p>
              </button>

              <button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left'>
                <Users className='h-6 w-6 text-blue-600 mb-2' />
                <h3 className='font-medium'>Manage Users</h3>
                <p className='text-sm text-gray-600'>Admin user control</p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {Object.entries(user.permissions).map(([resource, actions]) => (
                <div key={resource} className='flex justify-between'>
                  <span className='text-sm font-medium capitalize'>
                    {resource}:
                  </span>
                  <span className='text-sm text-gray-600'>
                    {Array.isArray(actions) ? actions.join(', ') : 'No access'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
