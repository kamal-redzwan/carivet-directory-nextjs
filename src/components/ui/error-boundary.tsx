// src/components/ui/error-boundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button';

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
            <Button onClick={onReset} className='flex items-center gap-2'>
              <RefreshCw className='w-4 h-4' />
              Try Again
            </Button>
          )}

          <Button variant='outline' asChild>
            <Link href='/' className='flex items-center gap-2'>
              <Home className='w-4 h-4' />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Error Details (Development Only) */}
        {showDetails && error && (
          <details className='mt-8 text-left bg-gray-50 rounded-lg p-4'>
            <summary className='font-medium text-gray-900 cursor-pointer mb-2'>
              Error Details
            </summary>
            <div className='text-sm text-gray-700 space-y-2'>
              <div>
                <strong>Error:</strong> {error.name}
              </div>
              <div>
                <strong>Message:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className='mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto whitespace-pre-wrap'>
                    {error.stack}
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className='mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto whitespace-pre-wrap'>
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
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default error display
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

// Hook for functional components to handle errors
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo);

    // In a real app, you might want to send this to an error reporting service
    // like Sentry, LogRocket, etc.
  };

  return handleError;
}

// HOC for wrapping components with error boundary
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
