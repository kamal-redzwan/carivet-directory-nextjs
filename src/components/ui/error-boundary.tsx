// src/components/ui/error-boundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Error handler callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Reset callback */
  onReset?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Show error details in development */
  showDetails?: boolean;
}

interface ErrorDisplayProps {
  /** Error object */
  error?: Error;
  /** Error info */
  errorInfo?: ErrorInfo;
  /** Reset function */
  onReset?: () => void;
  /** Show detailed error information */
  showDetails?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Error display component
export function ErrorDisplay({
  error,
  errorInfo,
  onReset,
  showDetails = process.env.NODE_ENV === 'development',
  className,
}: ErrorDisplayProps) {
  return (
    <div
      className={cn(
        'min-h-[400px] flex items-center justify-center p-8',
        className
      )}
    >
      <div className='text-center max-w-md mx-auto'>
        {/* Error Icon */}
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <AlertTriangle className='w-8 h-8 text-red-600' />
        </div>

        {/* Error Message */}
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          Something went wrong
        </h2>

        <p className='text-gray-600 mb-6'>
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          {onReset && (
            <button
              onClick={onReset}
              className='inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}

          <Link
            href='/'
            className='inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>

        {/* Error Details (Development Only) */}
        {showDetails && error && (
          <details className='mt-8 text-left bg-gray-50 rounded-lg p-4'>
            <summary className='cursor-pointer text-sm font-medium text-gray-700 mb-2'>
              Error Details
            </summary>
            <div className='space-y-4 text-xs'>
              <div>
                <h4 className='font-semibold text-gray-900 mb-1'>Error:</h4>
                <pre className='bg-red-50 p-2 rounded text-red-800 overflow-auto'>
                  {error.name}: {error.message}
                </pre>
              </div>

              {error.stack && (
                <div>
                  <h4 className='font-semibold text-gray-900 mb-1'>
                    Stack Trace:
                  </h4>
                  <pre className='bg-gray-100 p-2 rounded text-gray-700 overflow-auto whitespace-pre-wrap'>
                    {error.stack}
                  </pre>
                </div>
              )}

              {errorInfo?.componentStack && (
                <div>
                  <h4 className='font-semibold text-gray-900 mb-1'>
                    Component Stack:
                  </h4>
                  <pre className='bg-gray-100 p-2 rounded text-gray-700 overflow-auto whitespace-pre-wrap'>
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// Main Error Boundary Component
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    // Reset error state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });

    // Call custom reset handler if provided
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          showDetails={this.props.showDetails}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo);
    // You could integrate with error reporting services here
    throw error;
  };
}

// Simple error fallback components
export const SimpleErrorFallback = ({
  error,
  onReset,
}: {
  error: Error;
  onReset: () => void;
}) => (
  <div className='p-4 border border-red-200 bg-red-50 rounded-lg'>
    <h3 className='text-red-800 font-medium mb-2'>Something went wrong</h3>
    <p className='text-red-700 text-sm mb-3'>{error.message}</p>
    <button
      onClick={onReset}
      className='text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'
    >
      Try again
    </button>
  </div>
);

export const MinimalErrorFallback = () => (
  <div className='p-4 text-center text-gray-500'>
    <p>Unable to load content</p>
  </div>
);

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

// Export types
export type { ErrorBoundaryProps, ErrorDisplayProps };
