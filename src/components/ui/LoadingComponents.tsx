// Enhanced Loading Components - Building on existing loading.tsx
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner, LoadingSkeleton } from './loading';

// Progress Bar Component
interface LoadingProgressProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'emerald' | 'blue' | 'purple' | 'gray';
  /** Show percentage text */
  showPercent?: boolean;
  /** Additional label */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

export function LoadingProgress({
  progress,
  size = 'md',
  variant = 'emerald',
  showPercent = false,
  label,
  className
}: LoadingProgressProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    gray: 'bg-gray-600'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercent && <span className="text-sm text-gray-500">{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full transition-all duration-300 ease-out', variantClasses[variant])}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// Loading Dots Component
interface LoadingDotsProps {
  /** Size of dots */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'emerald' | 'blue' | 'purple' | 'gray';
  /** Additional CSS classes */
  className?: string;
}

export function LoadingDots({
  size = 'md',
  variant = 'emerald',
  className
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const variantClasses = {
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    gray: 'bg-gray-600'
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  return (
    <div className={cn('flex items-center', gapClasses[size], className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            sizeClasses[size],
            variantClasses[variant]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
}

// Pulse Loading Component
interface LoadingPulseProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Shape variant */
  shape?: 'circle' | 'square' | 'rectangle';
  /** Additional CSS classes */
  className?: string;
  /** Number of pulse elements */
  count?: number;
}

export function LoadingPulse({
  size = 'md',
  shape = 'circle',
  count = 1,
  className
}: LoadingPulseProps) {
  const sizeClasses = {
    sm: shape === 'circle' ? 'w-8 h-8' : shape === 'square' ? 'w-8 h-8' : 'w-16 h-4',
    md: shape === 'circle' ? 'w-12 h-12' : shape === 'square' ? 'w-12 h-12' : 'w-24 h-6',
    lg: shape === 'circle' ? 'w-16 h-16' : shape === 'square' ? 'w-16 h-16' : 'w-32 h-8',
    xl: shape === 'circle' ? 'w-24 h-24' : shape === 'square' ? 'w-24 h-24' : 'w-48 h-12'
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded',
    rectangle: 'rounded'
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {items.map((i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-200 animate-pulse',
            sizeClasses[size],
            shapeClasses[shape]
          )}
        />
      ))}
    </div>
  );
}

// Loading States Component
interface LoadingStatesProps {
  /** Current loading state */
  state: 'idle' | 'loading' | 'success' | 'error';
  /** Messages for each state */
  messages?: {
    loading?: string;
    success?: string;
    error?: string;
  };
  /** Additional CSS classes */
  className?: string;
  /** Children to render when idle */
  children?: ReactNode;
}

export function LoadingStates({
  state,
  messages = {},
  className,
  children
}: LoadingStatesProps) {
  const {
    loading = 'Loading...',
    success = 'Success!',
    error = 'Something went wrong'
  } = messages;

  switch (state) {
    case 'loading':
      return (
        <div className={cn('flex flex-col items-center gap-3', className)}>
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600">{loading}</p>
        </div>
      );

    case 'success':
      return (
        <div className={cn('flex flex-col items-center gap-3', className)}>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-emerald-600 font-medium">{success}</p>
        </div>
      );

    case 'error':
      return (
        <div className={cn('flex flex-col items-center gap-3', className)}>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      );

    default:
      return <>{children}</>;
  }
}

// Search Loading Component
interface SearchLoadingProps {
  /** Loading state */
  loading: boolean;
  /** Search term */
  searchTerm?: string;
  /** Additional CSS classes */
  className?: string;
}

export function SearchLoading({
  loading,
  searchTerm,
  className
}: SearchLoadingProps) {
  if (!loading) return null;

  return (
    <div className={cn('flex items-center gap-3 p-4', className)}>
      <LoadingSpinner size="sm" />
      <span className="text-sm text-gray-600">
        {searchTerm ? `Searching for "${searchTerm}"...` : 'Searching...'}
      </span>
    </div>
  );
}

// Form Loading Component
interface FormLoadingProps {
  /** Loading state */
  loading: boolean;
  /** Success state */
  success?: boolean;
  /** Error state */
  error?: string | null;
  /** Success message */
  successMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

export function FormLoading({
  loading,
  success,
  error,
  successMessage = 'Form submitted successfully!',
  className
}: FormLoadingProps) {
  if (loading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Submitting...</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className={cn('flex items-center gap-2 text-emerald-600', className)}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">{successMessage}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center gap-2 text-red-600', className)}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return null;
}

// Image Loading Component
interface ImageLoadingProps {
  /** Image source */
  src: string;
  /** Alt text */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Placeholder content */
  placeholder?: ReactNode;
  /** On load callback */
  onLoad?: () => void;
  /** On error callback */
  onError?: () => void;
}

export function ImageLoading({
  src,
  alt,
  className,
  placeholder,
  onLoad,
  onError
}: ImageLoadingProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

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
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center">
          {error ? (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ) : (
            placeholder || <LoadingSpinner size="md" />
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

// Enhanced Loading Grid (for card layouts)
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
  className
}: LoadingGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const skeletonVariant = variant === 'clinic' ? 'clinic-card' : 
                          variant === 'blog' ? 'blog-card' : 'card';

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      <LoadingSkeleton variant={skeletonVariant} count={count} />
    </div>
  );
}

// Export all components - no need for explicit export since they're already exported inline