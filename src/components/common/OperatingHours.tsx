import { Clock } from 'lucide-react';
import { formatBusinessHours, formatOperatingHours } from '@/utils/formatters';
import { Clinic } from '@/types/clinic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OperatingHoursProps {
  hours: Clinic['hours'];
  variant?: 'card' | 'inline' | 'today-only';
  showTitle?: boolean;
}

export function OperatingHours({
  hours,
  variant = 'card',
  showTitle = true,
}: OperatingHoursProps) {
  if (!hours) {
    return (
      <div className='text-gray-500 text-sm'>Operating hours not available</div>
    );
  }

  if (variant === 'today-only') {
    return (
      <div className='flex items-center gap-2'>
        <Clock size={16} className='text-muted-foreground' />
        <span className='text-sm'>Today: {formatOperatingHours(hours)}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    const businessHours = formatBusinessHours(hours);
    return (
      <div className='space-y-1'>
        {showTitle && (
          <p className='text-sm font-medium text-gray-700 mb-2'>
            Operating Hours
          </p>
        )}
        {businessHours.map(({ day, hours: dayHours, isToday }) => (
          <div
            key={day}
            className={cn(
              'flex justify-between items-center text-sm',
              isToday
                ? 'font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded'
                : 'text-gray-600'
            )}
          >
            <span>{day}</span>
            <span>{dayHours}</span>
          </div>
        ))}
      </div>
    );
  }

  // Card variant
  const businessHours = formatBusinessHours(hours);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          Operating Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {businessHours.map(({ day, hours: dayHours, isToday }) => (
            <div
              key={day}
              className={cn(
                'flex justify-between items-center py-1',
                isToday &&
                  'bg-emerald-50 px-2 rounded font-medium text-emerald-800'
              )}
            >
              <span className={isToday ? 'text-emerald-800' : 'text-gray-700'}>
                {day}
              </span>
              <span className={isToday ? 'text-emerald-700' : 'text-gray-900'}>
                {dayHours}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
