// Comprehensive Loading Component Examples
// This file demonstrates how to use all the loading components

import React, { useState, useEffect } from 'react';
import {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingOverlay,
  LoadingButton
} from '@/components/ui/loading';
import {
  LoadingProgress,
  LoadingDots,
  LoadingPulse,
  LoadingStates,
  SearchLoading,
  FormLoading,
  ImageLoading,
  LoadingGrid
} from '@/components/ui/LoadingComponents';

// Example 1: Basic loading states for data fetching
export function DataFetchingExample() {
  const [data, setData] = useState<{ message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setData({ message: 'Data loaded successfully!' });
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading your data..." />
        <div className="mt-6">
          <LoadingSkeleton variant="content" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return <div className="p-6">Data: {data?.message}</div>;
}

// Example 2: Search with loading states
export function SearchExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = async (term: string) => {
    setSearching(true);
    // Simulate search API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setResults([`Result 1 for "${term}"`, `Result 2 for "${term}"`]);
    setSearching(false);
  };

  return (
    <div className="p-6 space-y-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (e.target.value) {
            handleSearch(e.target.value);
          }
        }}
        placeholder="Search..."
        className="w-full p-2 border rounded"
      />
      
      <SearchLoading loading={searching} searchTerm={searchTerm} />
      
      {!searching && results.length > 0 && (
        <div className="space-y-2">
          {results.map((result, i) => (
            <div key={i} className="p-2 border rounded">{result}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// Example 3: Form submission with states
export function FormSubmissionExample() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch {
      setError('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          disabled={submitting}
        />
        
        <LoadingButton
          loading={submitting}
          disabled={submitting}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Submit Form
        </LoadingButton>
      </form>

      <FormLoading 
        loading={submitting}
        success={success}
        error={error}
        successMessage="Form submitted successfully!"
      />
    </div>
  );
}

// Example 4: Progress tracking
export function ProgressExample() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 10);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <LoadingProgress
        progress={progress}
        label="Upload Progress"
        showPercent
        variant="emerald"
      />
      
      <LoadingProgress
        progress={progress * 0.8}
        size="sm"
        variant="blue"
        label="Processing"
      />
    </div>
  );
}

// Example 5: Different loading animations
export function LoadingAnimationsExample() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold">Spinners</h3>
        <div className="flex items-center gap-6">
          <LoadingSpinner size="sm" variant="primary" />
          <LoadingSpinner size="md" variant="secondary" />
          <LoadingSpinner size="lg" variant="primary" />
          <LoadingSpinner size="xl" variant="secondary" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Loading Dots</h3>
        <div className="flex items-center gap-6">
          <LoadingDots size="sm" variant="emerald" />
          <LoadingDots size="md" variant="blue" />
          <LoadingDots size="lg" variant="purple" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Pulse Loading</h3>
        <div className="space-y-3">
          <LoadingPulse size="sm" shape="circle" count={3} />
          <LoadingPulse size="md" shape="square" count={2} />
          <LoadingPulse size="lg" shape="rectangle" count={1} />
        </div>
      </div>
    </div>
  );
}

// Example 6: Loading overlay
export function LoadingOverlayExample() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <button
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 3000);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Start Loading Overlay
      </button>

      <LoadingOverlay loading={loading} spinnerSize="lg">
        <div className="bg-gray-100 p-8 rounded">
          <h3 className="text-lg font-semibold mb-4">Content Area</h3>
          <p>This content will be overlaid with a loading spinner when loading is true.</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded">Card 1</div>
            <div className="bg-white p-4 rounded">Card 2</div>
            <div className="bg-white p-4 rounded">Card 3</div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
}

// Example 7: Loading states machine
export function LoadingStateMachineExample() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleAction = async () => {
    setState('loading');
    
    // Simulate async operation with random success/failure
    await new Promise(resolve => setTimeout(resolve, 2000));
    setState(Math.random() > 0.5 ? 'success' : 'error');
    
    // Reset after 3 seconds
    setTimeout(() => setState('idle'), 3000);
  };

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={handleAction}
        disabled={state === 'loading'}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        Trigger Action
      </button>

      <LoadingStates
        state={state}
        messages={{
          loading: 'Processing your request...',
          success: 'Action completed successfully!',
          error: 'Something went wrong. Please try again.'
        }}
        className="min-h-[120px] flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          Click the button to see loading states in action
        </div>
      </LoadingStates>
    </div>
  );
}

// Example 8: Image loading with placeholder
export function ImageLoadingExample() {
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/300x200');

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => setImageUrl(`https://via.placeholder.com/300x200?t=${Date.now()}`)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Load New Image
      </button>

      <ImageLoading
        src={imageUrl}
        alt="Example image"
        className="w-72 h-48 rounded"
        placeholder={
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Loading image...</span>
          </div>
        }
      />
    </div>
  );
}

// Example 9: Loading grids for different content types
export function LoadingGridsExample() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Clinic Cards Loading</h3>
        <LoadingGrid variant="clinic" columns={3} count={6} />
      </div>

      <div>
        <h3 className="font-semibold mb-4">Blog Posts Loading</h3>
        <LoadingGrid variant="blog" columns={2} count={4} />
      </div>

      <div>
        <h3 className="font-semibold mb-4">Feature Cards Loading</h3>
        <LoadingGrid variant="feature" columns={4} count={8} />
      </div>
    </div>
  );
}

// Usage instructions in comments:
/*
// To implement loading states in your components:

// 1. Basic loading spinner
import { LoadingSpinner } from '@/components/ui';
<LoadingSpinner size="lg" text="Loading..." />

// 2. Skeleton loading for content
import { LoadingSkeleton } from '@/components/ui';
<LoadingSkeleton variant="clinic-card" count={6} />

// 3. Progress tracking
import { LoadingProgress } from '@/components/ui';
<LoadingProgress progress={uploadProgress} label="Uploading files" showPercent />

// 4. Form submission states
import { FormLoading } from '@/components/ui';
<FormLoading loading={submitting} success={success} error={error} />

// 5. Search loading
import { SearchLoading } from '@/components/ui';
<SearchLoading loading={searching} searchTerm={query} />

// 6. Loading overlay
import { LoadingOverlay } from '@/components/ui';
<LoadingOverlay loading={isProcessing}>
  <YourContentHere />
</LoadingOverlay>

// Benefits:
// - Consistent loading UX across the app
// - Better perceived performance
// - Reduced cognitive load for users
// - Professional polish and attention to detail
*/