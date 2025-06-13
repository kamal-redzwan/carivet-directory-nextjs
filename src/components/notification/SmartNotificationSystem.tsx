'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Clock,
  Shield,
  MapPin,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Clinic } from '@/types/clinic';

// ✅ IMPORT CENTRALIZED BUSINESS LOGIC
import {
  isCurrentlyOpen,
  getClinicStatus,
  formatAddress,
  getTodayHours,
} from '@/utils/formatters';

interface NotificationPreferences {
  statusChanges: boolean;
  emergencyAlerts: boolean;
  favoriteClinicUpdates: boolean;
  newClinicsInArea: boolean;
}

interface Notification {
  id: string;
  type: 'status_change' | 'emergency_alert' | 'favorite_update' | 'new_clinic';
  title: string;
  message: string;
  clinic?: Clinic;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface SmartNotificationSystemProps {
  clinics: Clinic[];
  userLocation?: { state: string; city?: string };
  favoriteClinicIds?: string[];
}

export function SmartNotificationSystem({
  clinics,
  userLocation,
  favoriteClinicIds = [],
}: SmartNotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    statusChanges: true,
    emergencyAlerts: true,
    favoriteClinicUpdates: true,
    newClinicsInArea: false,
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  // ✅ GENERATE NOTIFICATIONS BASED ON CLINIC STATUS CHANGES
  const generateNotifications = useCallback(() => {
    const now = new Date();
    const newNotifications: Notification[] = [];

    clinics.forEach((clinic) => {
      const currentStatus = getClinicStatus(clinic, now);
      const isOpen = isCurrentlyOpen(clinic.hours, now);
      const isFavorite = favoriteClinicIds.includes(clinic.id);
      const isInUserArea = userLocation
        ? clinic.state === userLocation.state &&
          (!userLocation.city || clinic.city === userLocation.city)
        : false;

      // ✅ STATUS CHANGE NOTIFICATIONS
      if (preferences.statusChanges && (isFavorite || isInUserArea)) {
        // Simulate status change detection (in real app, you'd compare with previous state)
        const justOpened =
          isOpen && now.getHours() >= 8 && now.getHours() <= 10;
        const aboutToClose =
          isOpen && now.getHours() >= 17 && now.getHours() <= 18;

        if (justOpened) {
          newNotifications.push({
            id: `status-${clinic.id}-${now.getTime()}`,
            type: 'status_change',
            title: `${clinic.name} is now open`,
            message: `Open today: ${getTodayHours(clinic.hours)}`,
            clinic,
            timestamp: now,
            read: false,
            priority: isFavorite ? 'medium' : 'low',
          });
        }

        if (aboutToClose) {
          newNotifications.push({
            id: `closing-${clinic.id}-${now.getTime()}`,
            type: 'status_change',
            title: `${clinic.name} closing soon`,
            message: `Closes at ${
              getTodayHours(clinic.hours).split(' - ')[1] || 'closing time'
            }`,
            clinic,
            timestamp: now,
            read: false,
            priority: isFavorite ? 'medium' : 'low',
          });
        }
      }

      // ✅ EMERGENCY ALERTS
      if (preferences.emergencyAlerts && clinic.emergency && isInUserArea) {
        newNotifications.push({
          id: `emergency-${clinic.id}-${now.getTime()}`,
          type: 'emergency_alert',
          title: `Emergency services available`,
          message: `${clinic.name} offers 24/7 emergency care`,
          clinic,
          timestamp: now,
          read: false,
          priority: 'high',
        });
      }

      // ✅ FAVORITE CLINIC UPDATES
      if (preferences.favoriteClinicUpdates && isFavorite) {
        // Check for special hours or emergency status
        if (clinic.emergency && !isOpen) {
          newNotifications.push({
            id: `favorite-${clinic.id}-${now.getTime()}`,
            type: 'favorite_update',
            title: `${clinic.name} - Emergency Only`,
            message: `Regular hours: ${getTodayHours(
              clinic.hours
            )}, Emergency: ${clinic.emergency_hours || '24/7'}`,
            clinic,
            timestamp: now,
            read: false,
            priority: 'medium',
          });
        }
      }
    });

    // ✅ NEW CLINICS IN AREA
    if (preferences.newClinicsInArea && userLocation) {
      const newClinicsInArea = clinics.filter(
        (clinic) =>
          clinic.state === userLocation.state &&
          (!userLocation.city || clinic.city === userLocation.city)
      );

      if (newClinicsInArea.length > 0) {
        newNotifications.push({
          id: `new-clinics-${now.getTime()}`,
          type: 'new_clinic',
          title: `New clinics in ${userLocation.city || userLocation.state}`,
          message: `${newClinicsInArea.length} new veterinary clinics added to your area`,
          timestamp: now,
          read: false,
          priority: 'low',
        });
      }
    }

    // Only add notifications that are newer than last check
    const filteredNotifications = newNotifications.filter(
      (notification) => notification.timestamp > lastCheck
    );

    if (filteredNotifications.length > 0) {
      setNotifications((prev) =>
        [...filteredNotifications, ...prev].slice(0, 50)
      ); // Keep only 50 most recent
      setLastCheck(now);
    }
  }, [clinics, preferences, favoriteClinicIds, userLocation, lastCheck]);

  // ✅ CHECK FOR NOTIFICATIONS EVERY MINUTE
  useEffect(() => {
    const interval = setInterval(generateNotifications, 60000);
    return () => clearInterval(interval);
  }, [generateNotifications]);

  // ✅ INITIAL NOTIFICATION CHECK
  useEffect(() => {
    generateNotifications();
  }, [generateNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityCount = notifications.filter(
    (n) => !n.read && n.priority === 'high'
  ).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_change':
        return <Clock className='h-4 w-4' />;
      case 'emergency_alert':
        return <Shield className='h-4 w-4' />;
      case 'favorite_update':
        return <Bell className='h-4 w-4' />;
      case 'new_clinic':
        return <MapPin className='h-4 w-4' />;
      default:
        return <Bell className='h-4 w-4' />;
    }
  };

  const getNotificationColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='relative'>
      {/* ✅ NOTIFICATION BELL */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => setShowNotifications(!showNotifications)}
        className='relative'
      >
        <Bell className='h-4 w-4' />
        {unreadCount > 0 && (
          <Badge
            variant={highPriorityCount > 0 ? 'destructive' : 'default'}
            className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs'
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* ✅ NOTIFICATION PANEL */}
      {showNotifications && (
        <Card className='absolute right-0 top-12 w-96 max-h-96 overflow-hidden shadow-lg z-50'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>Notifications</CardTitle>
              <div className='flex items-center gap-2'>
                {unreadCount > 0 && (
                  <Button variant='ghost' size='sm' onClick={markAllAsRead}>
                    <Check className='h-4 w-4 mr-1' />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowNotifications(false)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className='p-0'>
            <div className='max-h-64 overflow-y-auto'>
              {notifications.length === 0 ? (
                <div className='p-4 text-center text-gray-500'>
                  <Bell className='h-8 w-8 mx-auto mb-2 text-gray-300' />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-3 flex-1'>
                        <div
                          className={`p-1 rounded ${getNotificationColor(
                            notification.priority
                          )}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2'>
                            <h4 className='font-medium text-sm truncate'>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0' />
                            )}
                          </div>
                          <p className='text-xs text-gray-600 mt-1'>
                            {notification.message}
                          </p>
                          {notification.clinic && (
                            <p className='text-xs text-gray-500 mt-1'>
                              {formatAddress(notification.clinic, {
                                includePostcode: false,
                              })}
                            </p>
                          )}
                          <p className='text-xs text-gray-400 mt-1'>
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className='opacity-0 group-hover:opacity-100 p-1'
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ NOTIFICATION PREFERENCES */}
      <Card className='mt-4'>
        <CardHeader>
          <CardTitle className='text-sm'>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <label className='text-sm font-medium'>Status Changes</label>
              <p className='text-xs text-gray-500'>
                Get notified when clinics open/close
              </p>
            </div>
            <Switch
              checked={preferences.statusChanges}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, statusChanges: checked }))
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <label className='text-sm font-medium'>Emergency Alerts</label>
              <p className='text-xs text-gray-500'>
                Emergency services in your area
              </p>
            </div>
            <Switch
              checked={preferences.emergencyAlerts}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  emergencyAlerts: checked,
                }))
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <label className='text-sm font-medium'>
                Favorite Clinic Updates
              </label>
              <p className='text-xs text-gray-500'>
                Updates from your favorite clinics
              </p>
            </div>
            <Switch
              checked={preferences.favoriteClinicUpdates}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  favoriteClinicUpdates: checked,
                }))
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <label className='text-sm font-medium'>New Clinics in Area</label>
              <p className='text-xs text-gray-500'>
                New clinics added to your location
              </p>
            </div>
            <Switch
              checked={preferences.newClinicsInArea}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  newClinicsInArea: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
