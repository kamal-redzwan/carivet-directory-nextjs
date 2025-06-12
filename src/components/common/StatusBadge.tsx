import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status =
  | 'verified'
  | 'pending'
  | 'rejected'
  | 'emergency'
  | 'regular'
  | 'active'
  | 'inactive';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  verified: {
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    label: 'Verified',
  },
  pending: {
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    label: 'Pending',
  },
  rejected: {
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    label: 'Rejected',
  },
  emergency: {
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
    label: '24/7',
  },
  regular: {
    variant: 'outline' as const,
    className: '',
    icon: Clock,
    label: 'Regular',
  },
  active: {
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    label: 'Active',
  },
  inactive: {
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
    label: 'Inactive',
  },
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {showIcon && <Icon size={iconSize} className='mr-1' />}
      {config.label}
    </Badge>
  );
}
