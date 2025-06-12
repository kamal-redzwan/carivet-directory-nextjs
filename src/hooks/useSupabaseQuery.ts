import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface UseSupabaseQueryOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
}

interface UseSupabaseQueryReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  deps: unknown[] = [],
  options: UseSupabaseQueryOptions = {}
): UseSupabaseQueryReturn<T> {
  const { enabled = true, refetchOnMount = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const result = await queryFn();

      if (result.error) {
        throw new Error(result.error.message || 'Query failed');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Supabase query error:', err);
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled]);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      executeQuery();
    }
  }, [...deps, enabled, refetchOnMount]);

  return {
    data,
    loading,
    error,
    refetch: executeQuery,
  };
}
