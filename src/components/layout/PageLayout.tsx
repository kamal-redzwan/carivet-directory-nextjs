// src/components/layout/PageLayout.tsx
'use client';

import { Suspense } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/loading';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  /** Page content */
  children: React.ReactNode;
  /** Custom page title for SEO */
  title?: string;
  /** Page description for SEO */
  description?: string;
  /** Hide navbar */
  hideNavbar?: boolean;
  /** Hide footer */
  hideFooter?: boolean;
  /** Custom navbar props */
  navbarProps?: Record<string, unknown>;
  /** Custom footer props */
  footerProps?: Record<string, unknown>;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | Error | null;
  /** Retry function for error state */
  onRetry?: () => void;
  /** Container max width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  /** Remove container padding */
  noPadding?: boolean;
  /** Background color */
  background?: 'white' | 'gray-50' | 'gray-100' | 'emerald-50';
  /** Additional CSS classes */
  className?: string;
  /** Loading variant */
  loadingVariant?: 'spinner' | 'skeleton' | 'overlay';
  /** Page variant */
  variant?: 'default' | 'hero' | 'centered' | 'full-width';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const backgroundClasses = {
  white: 'bg-white',
  'gray-50': 'bg-gray-50',
  'gray-100': 'bg-gray-100',
  'emerald-50': 'bg-emerald-50',
};

// Loading Components
const LoadingSpinnerComponent = () => (
  <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
    <div className='text-center'>
      <LoadingSpinner size='lg' />
      <p className='text-gray-600 mt-4'>Loading...</p>
    </div>
  </div>
);

const LoadingSkeletonComponent = () => (
  <div className='min-h-screen bg-gray-50'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <LoadingSkeleton variant='page' />
    </div>
  </div>
);

const LoadingOverlayComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className='relative'>
    {children}
    <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'>
      <LoadingSpinner size='lg' />
    </div>
  </div>
);

// Error Component
const ErrorComponent = ({
  error,
  onRetry,
}: {
  error: string | Error;
  onRetry?: () => void;
}) => (
  <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
    <div className='text-center max-w-md mx-auto px-4'>
      <div className='mb-8'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            className='w-8 h-8 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Something went wrong
        </h3>
        <p className='text-gray-600 mb-6'>
          {typeof error === 'string' ? error : error.message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors'
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);

export function PageLayout({
  children,
  title,
  description,
  hideNavbar = false,
  hideFooter = false,
  navbarProps = {},
  footerProps = {},
  loading = false,
  error = null,
  onRetry,
  maxWidth = '7xl',
  noPadding = false,
  background = 'white',
  className,
  loadingVariant = 'spinner',
  variant = 'default',
}: PageLayoutProps) {
  // Handle error state
  if (error) {
    return (
      <div className={cn('min-h-screen', backgroundClasses[background])}>
        {!hideNavbar && <Navbar {...navbarProps} />}
        <ErrorComponent error={error} onRetry={onRetry} />
        {!hideFooter && <Footer {...footerProps} />}
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    if (loadingVariant === 'skeleton') {
      return (
        <div className={cn('min-h-screen', backgroundClasses[background])}>
          {!hideNavbar && <Navbar {...navbarProps} />}
          <LoadingSkeletonComponent />
          {!hideFooter && <Footer {...footerProps} />}
        </div>
      );
    }

    if (loadingVariant === 'overlay') {
      return (
        <div className={cn('min-h-screen', backgroundClasses[background])}>
          {!hideNavbar && <Navbar {...navbarProps} />}
          <LoadingOverlayComponent>
            <main
              className={getMainClasses(
                variant,
                maxWidth,
                noPadding,
                className
              )}
            >
              {children}
            </main>
          </LoadingOverlayComponent>
          {!hideFooter && <Footer {...footerProps} />}
        </div>
      );
    }

    // Default spinner loading
    return (
      <div className={cn('min-h-screen', backgroundClasses[background])}>
        {!hideNavbar && <Navbar {...navbarProps} />}
        <LoadingSpinnerComponent />
        {!hideFooter && <Footer {...footerProps} />}
      </div>
    );
  }

  // Render normal layout
  return (
    <div className={cn('min-h-screen', backgroundClasses[background])}>
      {/* SEO Meta Tags (if using Next.js, you'd use Head component) */}
      {title && <title>{title}</title>}
      {description && <meta name='description' content={description} />}

      {/* Navbar */}
      {!hideNavbar && <Navbar {...navbarProps} />}

      {/* Main Content with Error Boundary */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinnerComponent />}>
          <main
            className={getMainClasses(variant, maxWidth, noPadding, className)}
          >
            {children}
          </main>
        </Suspense>
      </ErrorBoundary>

      {/* Footer */}
      {!hideFooter && <Footer {...footerProps} />}
    </div>
  );
}

// Helper function to get main classes based on variant
function getMainClasses(
  variant: PageLayoutProps['variant'],
  maxWidth: PageLayoutProps['maxWidth'],
  noPadding: boolean,
  className?: string
) {
  const baseClasses = 'flex-1';

  switch (variant) {
    case 'hero':
      return cn(baseClasses, className);

    case 'centered':
      return cn(
        baseClasses,
        'flex items-center justify-center',
        !noPadding && 'py-16',
        className
      );

    case 'full-width':
      return cn(baseClasses, className);

    default: // 'default'
      return cn(
        baseClasses,
        maxWidth && maxWidthClasses[maxWidth!],
        'mx-auto',
        !noPadding && 'px-4 sm:px-6 lg:px-8 py-8',
        className
      );
  }
}

// Pre-configured layout variants for common use cases
export const DefaultPageLayout = (props: Omit<PageLayoutProps, 'variant'>) => (
  <PageLayout variant='default' {...props} />
);

export const HeroPageLayout = (props: Omit<PageLayoutProps, 'variant'>) => (
  <PageLayout variant='hero' {...props} />
);

export const CenteredPageLayout = (props: Omit<PageLayoutProps, 'variant'>) => (
  <PageLayout variant='centered' {...props} />
);

export const FullWidthPageLayout = (
  props: Omit<PageLayoutProps, 'variant'>
) => <PageLayout variant='full-width' {...props} />;

// Loading layout for async components
export const AsyncPageLayout = ({ children, ...props }: PageLayoutProps) => (
  <PageLayout {...props}>
    <Suspense fallback={<LoadingSkeleton variant='content' />}>
      {children}
    </Suspense>
  </PageLayout>
);

// Export types for external use
export type { PageLayoutProps };
