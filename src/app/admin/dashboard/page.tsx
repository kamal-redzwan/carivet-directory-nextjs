'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/data/StatsCard';
import { Users, Building, FileText, Activity } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalClinics: number;
  totalAdminUsers: number;
  pendingVerifications: number;
  recentActivity: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Load dashboard stats using the custom hook
  const {
    data: stats,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<DashboardStats>(
    async () => {
      // Get total clinics
      const { count: clinicsCount, error: clinicsError } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true });

      if (clinicsError) throw clinicsError;

      // Get total admin users
      const { count: adminUsersCount, error: adminError } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (adminError) throw adminError;

      // Get pending verifications
      const { count: pendingCount, error: pendingError } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      if (pendingError) throw pendingError;

      return {
        data: {
          totalClinics: clinicsCount || 0,
          totalAdminUsers: adminUsersCount || 0,
          pendingVerifications: pendingCount || 0,
          recentActivity: 0, // Placeholder for now
        },
        error: null,
      };
    },
    [], // No dependencies - load once on mount
    { enabled: !!user, refetchOnMount: true }
  );

  if (!user) return null;

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-4'>Error loading dashboard: {error}</p>
          <button
            onClick={refetch}
            className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Welcome Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>
          Welcome back, {user.user.email.split('@')[0]}!
        </h1>
        <p className='text-gray-600'>
          You're logged in as {user.role.display_name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatsCard
          title='Total Clinics'
          value={stats?.totalClinics || 0}
          subtitle='Active veterinary clinics'
          icon={Building}
          iconColor='blue'
          loading={loading}
        />

        <StatsCard
          title='Admin Users'
          value={stats?.totalAdminUsers || 0}
          subtitle='Active admin accounts'
          icon={Users}
          iconColor='green'
          loading={loading}
        />

        <StatsCard
          title='Pending Reviews'
          value={stats?.pendingVerifications || 0}
          subtitle='Awaiting verification'
          icon={FileText}
          iconColor='yellow'
          loading={loading}
        />

        <StatsCard
          title='Recent Activity'
          value={stats?.recentActivity || 0}
          subtitle='Actions this week'
          icon={Activity}
          iconColor='purple'
          loading={loading}
        />
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
