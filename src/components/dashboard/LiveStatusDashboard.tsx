// src/components/dashboard/LiveStatusDashboard.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Clock,
  Shield,
  MapPin,
  TrendingUp,
  Users,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clinic } from '@/types/clinic';

// ✅ IMPORT CENTRALIZED BUSINESS LOGIC
import {
  isCurrentlyOpen,
  getClinicStatus,
  formatAddress,
  getTodayHours,
  searchClinics,
} from '@/utils/formatters';

interface LiveStatusDashboardProps {
  clinics: Clinic[];
  refreshInterval?: number; // in milliseconds
}

interface StatusStats {
  total: number;
  open: number;
  closed: number;
  emergency: number;
  openPercentage: number;
}

interface StateStats {
  state: string;
  total: number;
  open: number;
  emergency: number;
}

export function LiveStatusDashboard({
  clinics,
  refreshInterval = 60000, // 1 minute
}: LiveStatusDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ✅ AUTO-REFRESH TIMER
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // ✅ REAL-TIME STATISTICS
  const stats = useMemo((): StatusStats => {
    const open = clinics.filter((clinic) =>
      isCurrentlyOpen(clinic.hours, currentTime)
    );
    const emergency = clinics.filter((clinic) => clinic.emergency);
    const total = clinics.length;
    const openCount = open.length;
    const closedCount = total - openCount;

    return {
      total,
      open: openCount,
      closed: closedCount,
      emergency: emergency.length,
      openPercentage: total > 0 ? Math.round((openCount / total) * 100) : 0,
    };
  }, [clinics, currentTime]);

  // ✅ STATE-WISE BREAKDOWN
  const stateStats = useMemo((): StateStats[] => {
    const stateMap = new Map<string, StateStats>();

    clinics.forEach((clinic) => {
      const state = clinic.state || 'Unknown';
      if (!stateMap.has(state)) {
        stateMap.set(state, { state, total: 0, open: 0, emergency: 0 });
      }

      const stateData = stateMap.get(state)!;
      stateData.total++;

      if (isCurrentlyOpen(clinic.hours, currentTime)) {
        stateData.open++;
      }

      if (clinic.emergency) {
        stateData.emergency++;
      }
    });

    return Array.from(stateMap.values()).sort((a, b) => b.total - a.total);
  }, [clinics, currentTime]);

  // ✅ RECENTLY OPENED/CLOSED CLINICS
  const recentStatusChanges = useMemo(() => {
    const now = currentTime;
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    return clinics
      .map((clinic) => ({
        ...clinic,
        status: getClinicStatus(clinic, now),
        isOpen: isCurrentlyOpen(clinic.hours, now),
      }))
      .filter((clinic) => {
        // This is a simplified version - in a real app, you'd track actual status changes
        const todayHours =
          clinic.hours?.[
            [
              'sunday',
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
            ][now.getDay()] as keyof typeof clinic.hours
          ];
        return todayHours && todayHours !== 'Closed';
      })
      .slice(0, 5);
  }, [clinics, currentTime]);

  // ✅ EMERGENCY SERVICES AVAILABLE NOW
  const emergencyServices = useMemo(() => {
    return clinics
      .filter((clinic) => clinic.emergency)
      .map((clinic) => ({
        ...clinic,
        isOpen: isCurrentlyOpen(clinic.hours, currentTime),
        status: getClinicStatus(clinic, currentTime),
      }))
      .sort((a, b) => {
        // Sort open emergency services first
        if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [clinics, currentTime]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Live Clinic Status
          </h2>
          <p className='text-gray-600'>
            Real-time monitoring • Last updated:{' '}
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size='sm'
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity
              className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`}
            />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentTime(new Date())}
          >
            Refresh Now
          </Button>
        </div>
      </div>

      {/* ✅ MAIN STATUS CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Clinics</CardTitle>
            <Building className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
            <p className='text-xs text-muted-foreground'>
              Registered veterinary clinics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Currently Open
            </CardTitle>
            <Clock className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {stats.open}
            </div>
            <div className='flex items-center gap-2'>
              <Progress value={stats.openPercentage} className='flex-1 h-2' />
              <span className='text-xs text-muted-foreground'>
                {stats.openPercentage}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Currently Closed
            </CardTitle>
            <Clock className='h-4 w-4 text-gray-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-600'>
              {stats.closed}
            </div>
            <p className='text-xs text-muted-foreground'>
              Will reopen tomorrow or later today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Emergency Services
            </CardTitle>
            <Shield className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {stats.emergency}
            </div>
            <p className='text-xs text-muted-foreground'>
              24/7 emergency care available
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* ✅ STATE-WISE BREAKDOWN */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              Status by State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {stateStats.slice(0, 6).map((stateStat) => (
                <div
                  key={stateStat.state}
                  className='flex items-center justify-between'
                >
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-sm'>
                        {stateStat.state}
                      </span>
                      <span className='text-xs text-gray-500'>
                        {stateStat.open}/{stateStat.total} open
                      </span>
                    </div>
                    <div className='flex items-center gap-2 mt-1'>
                      <Progress
                        value={
                          stateStat.total > 0
                            ? (stateStat.open / stateStat.total) * 100
                            : 0
                        }
                        className='flex-1 h-2'
                      />
                      {stateStat.emergency > 0 && (
                        <Badge variant='destructive' className='text-xs'>
                          {stateStat.emergency} Emergency
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ✅ EMERGENCY SERVICES STATUS */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5 text-red-600' />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {emergencyServices.slice(0, 5).map((clinic) => (
                <div
                  key={clinic.id}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                >
                  <div className='flex-1'>
                    <div className='font-medium text-sm'>{clinic.name}</div>
                    <div className='text-xs text-gray-600'>
                      {formatAddress(clinic, { includePostcode: false })}
                    </div>
                    <div className='text-xs text-gray-500 mt-1'>
                      {clinic.emergency_hours || 'Call for emergency hours'}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant={clinic.isOpen ? 'default' : 'secondary'}
                      className={`text-xs ${
                        clinic.isOpen
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {clinic.isOpen ? 'Open' : 'Emergency Only'}
                    </Badge>
                  </div>
                </div>
              ))}

              {emergencyServices.length === 0 && (
                <p className='text-sm text-gray-500 text-center py-4'>
                  No emergency services registered
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ REAL-TIME ACTIVITY FEED */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            Recent Status Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {recentStatusChanges.map((clinic) => (
              <div
                key={clinic.id}
                className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      clinic.isOpen ? 'bg-green-400' : 'bg-gray-400'
                    }`}
                  />
                  <div>
                    <div className='font-medium text-sm'>{clinic.name}</div>
                    <div className='text-xs text-gray-600'>
                      {clinic.city}, {clinic.state}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <Badge
                    variant={clinic.isOpen ? 'default' : 'secondary'}
                    className='text-xs'
                  >
                    {clinic.isOpen ? 'Opened' : 'Closed'}
                  </Badge>
                  <div className='text-xs text-gray-500 mt-1'>
                    Today: {getTodayHours(clinic.hours)}
                  </div>
                </div>
              </div>
            ))}

            {recentStatusChanges.length === 0 && (
              <p className='text-sm text-gray-500 text-center py-4'>
                No recent status changes detected
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
