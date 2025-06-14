'use client';

import { useCallback, useMemo, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/data/StatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building,
  FileText,
  Activity,
  Eye,
  Plus,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import { Clinic } from '@/types/clinic';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading';

interface DashboardStats {
  totalClinics: number;
  totalAdminUsers: number;
  pendingVerifications: number;
  recentActivity: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ MEMOIZE THE QUERY FUNCTION - This prevents re-renders
  const statsQueryFn = useCallback(async () => {
    try {
      // Get total clinics - simplified query
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select('id, verification_status');

      if (clinicsError) {
        if (clinicsError.message.includes('NetworkError')) {
          return {
            data: null,
            error:
              'Network connection error. Please check your internet connection.',
          };
        }
        return {
          data: null,
          error: `Clinics query failed: ${clinicsError.message}`,
        };
      }

      const totalClinics = clinicsData?.length || 0;
      const pendingVerifications =
        clinicsData?.filter(
          (clinic) => clinic.verification_status === 'pending'
        ).length || 0;

      // Try to get admin users, but don't fail if table doesn't exist
      let totalAdminUsers = 1; // Default to 1 (you're logged in)
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('is_active', true);

        if (adminError) {
          if (adminError.message.includes('NetworkError')) {
            console.warn('Network error while fetching admin users');
          } else {
            console.warn(
              'Admin users query failed (table might not exist):',
              adminError
            );
          }
        } else {
          totalAdminUsers = adminData?.length || 1;
        }
      } catch (adminErr) {
        console.warn('Admin users table does not exist:', adminErr);
      }

      const result = {
        totalClinics,
        totalAdminUsers,
        pendingVerifications,
        recentActivity: 0,
      };

      return {
        data: result,
        error: null,
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }, []); // Empty dependencies - query function never changes

  // ✅ MEMOIZE THE CLINICS QUERY FUNCTION
  const clinicsQueryFn = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) {
        if (error.message.includes('NetworkError')) {
          return {
            data: null,
            error:
              'Network connection error. Please check your internet connection.',
          };
        }
        return {
          data: null,
          error: error.message,
        };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Clinics query error:', error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }, []);

  // ✅ USE THE MEMOIZED FUNCTIONS
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useSupabaseQuery<DashboardStats>(statsQueryFn, {
    enabled: !!user,
    refetchOnMount: true,
  });

  const {
    data: allClinics,
    loading: clinicsLoading,
    error: clinicsError,
    refetch: refetchClinics,
  } = useSupabaseQuery<Clinic[]>(clinicsQueryFn, {
    enabled: !!user,
    refetchOnMount: true,
  });

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        try {
          await Promise.all([refetchStats(), refetchClinics()]);
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing dashboard data:', error);
        }
      }
    };

    initializeData();
  }, [user, refetchStats, refetchClinics]);

  // Show loading state
  if (!user || !isInitialized || statsLoading || clinicsLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner size='lg' text='Loading dashboard...' />
      </div>
    );
  }

  // Show error state
  if (statsError || clinicsError) {
    return (
      <div className='text-center py-12'>
        <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
        <p className='text-red-600 mb-4'>
          {statsError || clinicsError || 'Failed to load dashboard data'}
        </p>
        <Button
          onClick={() => {
            refetchStats();
            refetchClinics();
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* ✅ WELCOME HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome back, {user?.user?.email?.split('@')[0] || 'Admin'}!
          </h1>
          <p className='text-gray-600'>
            You're logged in as Super Administrator
          </p>
        </div>

        {/* ✅ QUICK ACTION BUTTONS */}
        <div className='flex items-center gap-3'>
          <Button variant='outline' asChild>
            <Link href='/admin/clinics'>
              <Eye className='h-4 w-4 mr-2' />
              View All Clinics
            </Link>
          </Button>
          <Button asChild>
            <Link href='/admin/clinics/new'>
              <Plus className='h-4 w-4 mr-2' />
              Add Clinic
            </Link>
          </Button>
        </div>
      </div>

      {/* ✅ STATS GRID */}
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

      {/* ✅ LIVE CLINIC STATUS */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Building className='h-5 w-5' />
              Live Clinic Status
            </CardTitle>
            <Button variant='outline' size='sm' onClick={refetchClinics}>
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clinicsLoading ? (
            <div className='text-center py-8'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-2 text-sm text-gray-600'>Loading clinics...</p>
            </div>
          ) : clinicsError ? (
            <div className='text-center py-8 text-red-600'>
              <p>Error loading clinics: {clinicsError}</p>
            </div>
          ) : allClinics && allClinics.length > 0 ? (
            <div className='space-y-4'>
              <p className='text-sm text-gray-600'>
                Showing {allClinics.length} clinics
              </p>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {allClinics.slice(0, 6).map((clinic) => (
                  <div key={clinic.id} className='p-4 border rounded-lg'>
                    <h4 className='font-medium'>{clinic.name}</h4>
                    <p className='text-sm text-gray-600'>
                      {clinic.city}, {clinic.state}
                    </p>
                    <div className='mt-2'>
                      <Badge
                        variant={
                          clinic.verification_status === 'verified'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {clinic.verification_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {allClinics.length > 6 && (
                <div className='text-center'>
                  <Button variant='outline' asChild>
                    <Link href='/admin/clinics'>
                      View All {allClinics.length} Clinics
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <Building className='h-12 w-12 mx-auto mb-4 text-gray-300' />
              <p>No clinics found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
