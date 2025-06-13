'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/data/StatsCard';
import { Button } from '@/components/ui/button';
import { Users, Building, FileText, Activity, Eye, Plus } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import { Clinic } from '@/types/clinic';
import Link from 'next/link';

// ✅ IMPORT NEW LIVE STATUS DASHBOARD
import { LiveStatusDashboard } from '@/components/dashboard/LiveStatusDashboard';

// ✅ IMPORT PERMISSION UTILITIES
import {
  canViewClinics,
  canManageClinics,
  canManageUsers,
} from '@/utils/permissions';

interface DashboardStats {
  totalClinics: number;
  totalAdminUsers: number;
  pendingVerifications: number;
  recentActivity: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // ✅ LOAD DASHBOARD STATS
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
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

  // ✅ LOAD ALL CLINICS FOR LIVE DASHBOARD
  const {
    data: allClinics,
    loading: _clinicsLoading,
    error: _clinicsError,
    refetch: refetchClinics,
  } = useSupabaseQuery<Clinic[]>(
    async () => {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) throw error;

      return { data: data || [], error: null };
    },
    [], // No dependencies
    { enabled: !!user && canViewClinics(user), refetchOnMount: true }
  );

  if (!user) return null;

  if (statsError) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-4'>
            Error loading dashboard: {statsError}
          </p>
          <Button onClick={refetchStats}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* ✅ ENHANCED WELCOME HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome back, {user.user.email.split('@')[0]}!
          </h1>
          <p className='text-gray-600'>
            You're logged in as {user.role.display_name}
          </p>
        </div>

        {/* ✅ QUICK ACTION BUTTONS */}
        <div className='flex items-center gap-3'>
          {canViewClinics(user) && (
            <Button variant='outline' asChild>
              <Link href='/admin/clinics'>
                <Eye className='h-4 w-4 mr-2' />
                View All Clinics
              </Link>
            </Button>
          )}
          {canManageClinics(user) && (
            <Button asChild>
              <Link href='/admin/clinics/new'>
                <Plus className='h-4 w-4 mr-2' />
                Add Clinic
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ✅ ENHANCED STATS GRID */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatsCard
          title='Total Clinics'
          value={stats?.totalClinics || 0}
          subtitle='Active veterinary clinics'
          icon={Building}
          iconColor='blue'
          loading={statsLoading}
        />

        <StatsCard
          title='Admin Users'
          value={stats?.totalAdminUsers || 0}
          subtitle='Active admin accounts'
          icon={Users}
          iconColor='green'
          loading={statsLoading}
        />

        <StatsCard
          title='Pending Reviews'
          value={stats?.pendingVerifications || 0}
          subtitle='Awaiting verification'
          icon={FileText}
          iconColor='yellow'
          loading={statsLoading}
        />

        <StatsCard
          title='Recent Activity'
          value={stats?.recentActivity || 0}
          subtitle='Actions this week'
          icon={Activity}
          iconColor='purple'
          loading={statsLoading}
        />
      </div>

      {/* ✅ LIVE STATUS DASHBOARD */}
      {canViewClinics(user) && allClinics && (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Live Clinic Status
            </h2>
            <Button variant='outline' size='sm' onClick={refetchClinics}>
              Refresh Data
            </Button>
          </div>

          <LiveStatusDashboard
            clinics={allClinics}
            refreshInterval={60000} // 1 minute
          />
        </div>
      )}

      {/* ✅ ENHANCED QUICK ACTIONS */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              {canManageClinics(user) && (
                <Link href='/admin/clinics/new'>
                  <div className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left cursor-pointer transition-colors'>
                    <Building className='h-6 w-6 text-emerald-600 mb-2' />
                    <h3 className='font-medium'>Add Clinic</h3>
                    <p className='text-sm text-gray-600'>Register new clinic</p>
                  </div>
                </Link>
              )}

              {canManageUsers(user) && (
                <Link href='/admin/users'>
                  <div className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left cursor-pointer transition-colors'>
                    <Users className='h-6 w-6 text-blue-600 mb-2' />
                    <h3 className='font-medium'>Manage Users</h3>
                    <p className='text-sm text-gray-600'>User administration</p>
                  </div>
                </Link>
              )}

              {canViewClinics(user) && (
                <Link href='/admin/reports'>
                  <div className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left cursor-pointer transition-colors'>
                    <FileText className='h-6 w-6 text-purple-600 mb-2' />
                    <h3 className='font-medium'>Reports</h3>
                    <p className='text-sm text-gray-600'>View analytics</p>
                  </div>
                </Link>
              )}

              <div className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left cursor-pointer transition-colors'>
                <Activity className='h-6 w-6 text-orange-600 mb-2' />
                <h3 className='font-medium'>System Status</h3>
                <p className='text-sm text-gray-600'>Monitor health</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 text-sm'>
              Activity feed will be displayed here once implemented.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
