// src/components/ui/LoadingComponents.tsx
'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// LOADING SPINNER
// ============================================================================

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'default' | 'primary' | 'white';
  /** Additional CSS classes */
  className?: string;
  /** Loading text */
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    white: 'text-white',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeClasses[size],
          colorClasses[variant]
        )}
        role='status'
        aria-label='Loading'
      />
      {text && (
        <span className={cn('text-sm', colorClasses[variant])}>{text}</span>
      )}
    </div>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

interface LoadingSkeletonProps {
  /** Skeleton variant */
  variant?: 'text' | 'card' | 'clinic-card' | 'blog-card' | 'circle' | 'rect';
  /** Number of skeleton items */
  count?: number;
  /** Additional CSS classes */
  className?: string;
  /** Custom height for rect variant */
  height?: string;
  /** Custom width for rect variant */
  width?: string;
}

export function LoadingSkeleton({
  variant = 'text',
  count = 1,
  className,
  height = '4',
  width = 'full',
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variantClasses = {
    text: `h-${height} w-${width}`,
    circle: 'w-12 h-12 rounded-full',
    rect: `h-${height} w-${width}`,
    card: 'h-48 w-full',
    'clinic-card': '',
    'blog-card': '',
  };

  if (variant === 'clinic-card') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className='border rounded-lg p-6 space-y-4'>
            <div className='flex items-start gap-4'>
              <div className='w-16 h-16 bg-gray-200 rounded-lg animate-pulse' />
              <div className='flex-1 space-y-2'>
                <div className='h-5 bg-gray-200 rounded animate-pulse w-3/4' />
                <div className='h-4 bg-gray-200 rounded animate-pulse w-1/2' />
                <div className='h-4 bg-gray-200 rounded animate-pulse w-2/3' />
              </div>
            </div>
            <div className='flex gap-2'>
              <div className='h-6 bg-gray-200 rounded-full animate-pulse w-16' />
              <div className='h-6 bg-gray-200 rounded-full animate-pulse w-20' />
              <div className='h-6 bg-gray-200 rounded-full animate-pulse w-24' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'blog-card') {
    return (
      <div className={cn('space-y-6', className)}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className='border rounded-lg overflow-hidden'>
            <div className='h-48 bg-gray-200 animate-pulse' />
            <div className='p-6 space-y-3'>
              <div className='h-6 bg-gray-200 rounded animate-pulse w-3/4' />
              <div className='h-4 bg-gray-200 rounded animate-pulse w-full' />
              <div className='h-4 bg-gray-200 rounded animate-pulse w-2/3' />
              <div className='flex items-center gap-4 pt-2'>
                <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse' />
                <div className='space-y-1 flex-1'>
                  <div className='h-3 bg-gray-200 rounded animate-pulse w-1/3' />
                  <div className='h-3 bg-gray-200 rounded animate-pulse w-1/4' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={cn(baseClasses, variantClasses[variant])} />
      ))}
    </div>
  );
}

// ============================================================================
// LOADING BUTTON
// ============================================================================

interface LoadingButtonProps {
  /** Button content when loading */
  children: ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Loading text override */
  loadingText?: string;
  /** Button variant */
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({
  children,
  loading = false,
  loadingText = 'Loading...',
  variant = 'default',
  className,
  disabled,
  onClick,
  type = 'button',
}: LoadingButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline:
      'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-blue-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {loading && (
        <LoadingSpinner
          size='sm'
          variant={variant === 'primary' ? 'white' : 'default'}
        />
      )}
      {loading ? loadingText : children}
    </button>
  );
}

// ============================================================================
// LOADING IMAGE
// ============================================================================

interface LoadingImageProps {
  /** Image source */
  src: string;
  /** Alt text */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Loading placeholder */
  placeholder?: ReactNode;
  /** Load callback */
  onLoad?: () => void;
  /** Error callback */
  onError?: () => void;
}

export function LoadingImage({
  src,
  alt,
  className,
  placeholder,
  onLoad,
  onError,
}: LoadingImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    onError?.();
  };

  return (
    <div className={cn('relative', className)}>
      {(loading || error) && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center'>
          {error ? (
            <svg
              className='w-8 h-8 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          ) : (
            placeholder || <LoadingSpinner size='md' />
          )}
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          loading ? 'opacity-0' : 'opacity-100',
          className
        )}
      />
    </div>
  );
}

// ============================================================================
// LOADING GRID
// ============================================================================

interface LoadingGridProps {
  /** Number of items */
  count?: number;
  /** Grid columns */
  columns?: 1 | 2 | 3 | 4;
  /** Card variant */
  variant?: 'clinic' | 'blog' | 'service' | 'feature';
  /** Additional CSS classes */
  className?: string;
}

export function LoadingGrid({
  count = 6,
  columns = 3,
  variant = 'clinic',
  className,
}: LoadingGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const skeletonVariant =
    variant === 'clinic'
      ? 'clinic-card'
      : variant === 'blog'
      ? 'blog-card'
      : 'card';

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      <LoadingSkeleton variant={skeletonVariant} count={count} />
    </div>
  );
}

// ============================================================================
// LOADING OVERLAY
// ============================================================================

interface LoadingOverlayProps {
  /** Show overlay */
  show: boolean;
  /** Loading text */
  text?: string;
  /** Overlay variant */
  variant?: 'default' | 'blur';
  /** Additional CSS classes */
  className?: string;
  /** Child components */
  children: ReactNode;
}

export function LoadingOverlay({
  show,
  text = 'Loading...',
  variant = 'default',
  className,
  children,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {show && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center z-50',
            variant === 'blur' ? 'backdrop-blur-sm bg-white/70' : 'bg-white/80'
          )}
        >
          <div className='text-center'>
            <LoadingSpinner size='lg' />
            {text && <p className='mt-2 text-sm text-gray-600'>{text}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
