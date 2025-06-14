// Fixed useSupabaseQuery.ts - Prevents infinite loops
import { useState, useEffect, useCallback, useRef } from 'react';

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
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ USE A REF TO PREVENT FUNCTION REFERENCE CHANGES
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  // ✅ MEMOIZE THE EXECUTE QUERY FUNCTION
  const executeQuery = useCallback(async (): Promise<void> => {
    if (!isInitialized) {
      setIsInitialized(true);
    }

    try {
      setLoading(true);
      setError(null);

      const result = await queryFnRef.current();

      if (result.error) {
        throw result.error;
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Query failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isInitialized]); // Only depends on isInitialized

  // ✅ INITIALIZE ON MOUNT
  useEffect(() => {
    if (enabled && refetchOnMount && !isInitialized) {
      executeQuery();
    }
  }, [enabled, refetchOnMount, isInitialized, executeQuery]);

  return {
    data,
    loading,
    error,
    refetch: executeQuery,
  };
}
