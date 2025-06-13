import { useState, useEffect, useCallback } from 'react';

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

interface QueryResult<T> {
  data: T | null;
  error: unknown;
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<QueryResult<T>>,
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
        const errorMessage =
          result.error instanceof Error
            ? result.error.message
            : typeof result.error === 'string'
            ? result.error
            : 'Query failed';
        throw new Error(errorMessage);
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
  }, [executeQuery, enabled, refetchOnMount]);

  return {
    data,
    loading,
    error,
    refetch: executeQuery,
  };
}
