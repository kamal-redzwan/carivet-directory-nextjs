import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  trend?: {
    value: number;
    label: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  loading?: boolean;
  className?: string;
}

const iconColorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  gray: 'bg-gray-100 text-gray-600',
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'blue',
  trend,
  loading = false,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
            <p className='text-2xl font-bold text-gray-900'>
              {loading ? '...' : value}
            </p>
            {subtitle && (
              <p className='text-xs text-gray-500 mt-1'>{subtitle}</p>
            )}
            {trend && (
              <div className='flex items-center mt-2'>
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.type === 'increase' && 'text-green-600',
                    trend.type === 'decrease' && 'text-red-600',
                    trend.type === 'neutral' && 'text-gray-600'
                  )}
                >
                  {trend.type === 'increase' && '+'}
                  {trend.value}% {trend.label}
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                iconColorClasses[iconColor]
              )}
            >
              <Icon className='w-6 h-6' />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
