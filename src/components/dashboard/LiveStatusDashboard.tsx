// src/components/dashboard/LiveStatusDashboard.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Clock,
  Shield,
  MapPin,
  TrendingUp,
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
    const _oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

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
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentTime(new Date())}
          >
            <Clock className='h-4 w-4 mr-2' />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* ✅ OVERVIEW STATS */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Clinics
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.total}
                </p>
              </div>
              <Building className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Open Now</p>
                <p className='text-2xl font-bold text-green-600'>
                  {stats.open}
                </p>
                <p className='text-xs text-gray-500'>
                  {stats.openPercentage}% of total
                </p>
              </div>
              <Clock className='h-8 w-8 text-green-600' />
            </div>
            <div className='mt-2'>
              <Progress value={stats.openPercentage} className='h-2' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Closed</p>
                <p className='text-2xl font-bold text-gray-600'>
                  {stats.closed}
                </p>
              </div>
              <Clock className='h-8 w-8 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Emergency</p>
                <p className='text-2xl font-bold text-red-600'>
                  {stats.emergency}
                </p>
              </div>
              <Shield className='h-8 w-8 text-red-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ STATE-WISE BREAKDOWN & EMERGENCY SERVICES */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* State-wise Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              By State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {stateStats.map((state) => (
                <div key={state.state} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{state.state}</span>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {state.open}/{state.total} Open
                      </Badge>
                      {state.emergency > 0 && (
                        <Badge variant='destructive' className='text-xs'>
                          {state.emergency} Emergency
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress
                    value={
                      state.total > 0
                        ? Math.round((state.open / state.total) * 100)
                        : 0
                    }
                    className='h-2'
                  />
                </div>
              ))}

              {stateStats.length === 0 && (
                <p className='text-sm text-gray-500 text-center py-4'>
                  No clinic data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Services */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {emergencyServices.slice(0, 6).map((clinic) => (
                <div
                  key={clinic.id}
                  className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        clinic.isOpen ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    />
                    <div>
                      <div className='font-medium text-sm'>{clinic.name}</div>
                      <div className='text-xs text-gray-600'>
                        {formatAddress(clinic)}
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
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
