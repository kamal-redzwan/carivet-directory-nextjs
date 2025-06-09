// src/components/ui/loading.tsx
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'white';
  /** Additional CSS classes */
  className?: string;
  /** Loading text */
  text?: string;
}

interface LoadingSkeletonProps {
  /** Skeleton variant */
  variant?:
    | 'text'
    | 'avatar'
    | 'card'
    | 'page'
    | 'content'
    | 'clinic-card'
    | 'blog-card';
  /** Number of items to show */
  count?: number;
  /** Additional CSS classes */
  className?: string;
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const spinnerVariants = {
  primary: 'text-emerald-600',
  secondary: 'text-gray-500',
  white: 'text-white',
};

export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          spinnerSizes[size],
          spinnerVariants[variant]
        )}
        aria-label='Loading'
      >
        <span className='sr-only'>Loading...</span>
      </div>
      {text && <p className='text-sm text-gray-600'>{text}</p>}
    </div>
  );
}

export function LoadingSkeleton({
  variant = 'text',
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  switch (variant) {
    case 'text':
      return (
        <div className={cn('space-y-2', className)}>
          {items.map((i) => (
            <div
              key={i}
              className='h-4 bg-gray-200 rounded animate-pulse'
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      );

    case 'avatar':
      return (
        <div className={cn('flex items-center space-x-3', className)}>
          <div className='w-10 h-10 bg-gray-200 rounded-full animate-pulse' />
          <div className='space-y-2 flex-1'>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-1/4' />
            <div className='h-3 bg-gray-200 rounded animate-pulse w-1/2' />
          </div>
        </div>
      );

    case 'card':
      return (
        <div className={cn('space-y-4', className)}>
          {items.map((i) => (
            <div key={i} className='border rounded-lg p-4 space-y-3'>
              <div className='h-32 bg-gray-200 rounded animate-pulse' />
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
                <div className='h-3 bg-gray-200 rounded animate-pulse w-1/2' />
              </div>
            </div>
          ))}
        </div>
      );

    case 'clinic-card':
      return (
        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
            className
          )}
        >
          {items.map((i) => (
            <div key={i} className='border rounded-lg overflow-hidden'>
              <div className='h-40 bg-gray-200 animate-pulse' />
              <div className='p-4 space-y-3'>
                <div className='h-5 bg-gray-200 rounded animate-pulse w-3/4' />
                <div className='h-4 bg-gray-200 rounded animate-pulse w-full' />
                <div className='h-3 bg-gray-200 rounded animate-pulse w-1/2' />
                <div className='flex gap-2'>
                  <div className='h-6 w-16 bg-gray-200 rounded animate-pulse' />
                  <div className='h-6 w-16 bg-gray-200 rounded animate-pulse' />
                </div>
                <div className='h-8 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>
          ))}
        </div>
      );

    case 'blog-card':
      return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
          {items.map((i) => (
            <div key={i} className='border rounded-lg overflow-hidden'>
              <div className='h-48 bg-gray-200 animate-pulse' />
              <div className='p-6 space-y-3'>
                <div className='flex gap-2'>
                  <div className='h-5 w-16 bg-gray-200 rounded animate-pulse' />
                  <div className='h-5 w-20 bg-gray-200 rounded animate-pulse' />
                </div>
                <div className='h-6 bg-gray-200 rounded animate-pulse w-full' />
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-full' />
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
                </div>
                <div className='flex justify-between'>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-24' />
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-16' />
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'page':
      return (
        <div className={cn('space-y-8', className)}>
          {/* Hero section skeleton */}
          <div className='space-y-4'>
            <div className='h-8 bg-gray-200 rounded animate-pulse w-1/2' />
            <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
          </div>

          {/* Content sections skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='space-y-4'>
                <div className='h-40 bg-gray-200 rounded animate-pulse' />
                <div className='space-y-2'>
                  <div className='h-5 bg-gray-200 rounded animate-pulse w-3/4' />
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-full' />
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-2/3' />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'content':
      return (
        <div className={cn('space-y-6', className)}>
          <div className='space-y-3'>
            <div className='h-6 bg-gray-200 rounded animate-pulse w-1/2' />
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-full' />
              <div className='h-4 bg-gray-200 rounded animate-pulse w-5/6' />
              <div className='h-4 bg-gray-200 rounded animate-pulse w-4/5' />
            </div>
          </div>

          <div className='space-y-3'>
            <div className='h-6 bg-gray-200 rounded animate-pulse w-2/3' />
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-full' />
              <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={cn('space-y-2', className)}>
          {items.map((i) => (
            <div key={i} className='h-4 bg-gray-200 rounded animate-pulse' />
          ))}
        </div>
      );
  }
}

// Loading overlay component
export function LoadingOverlay({
  children,
  loading,
  spinnerSize = 'lg',
  className,
}: {
  children: React.ReactNode;
  loading: boolean;
  spinnerSize?: LoadingSpinnerProps['size'];
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className='absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50'>
          <LoadingSpinner size={spinnerSize} text='Loading...' />
        </div>
      )}
    </div>
  );
}

// Loading state for buttons
export function LoadingButton({
  children,
  loading,
  disabled,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center',
        loading && 'cursor-not-allowed',
        className
      )}
    >
      {loading && (
        <LoadingSpinner size='sm' variant='white' className='absolute' />
      )}
      <span className={cn(loading && 'opacity-0')}>{children}</span>
    </button>
  );
}

// Export types
export type { LoadingSpinnerProps, LoadingSkeletonProps };
