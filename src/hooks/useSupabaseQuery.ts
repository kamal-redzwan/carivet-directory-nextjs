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

  // ✅ USE A REF TO PREVENT FUNCTION REFERENCE CHANGES
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const executeQuery = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Executing Supabase query...');

      const result = await queryFnRef.current();

      if (result.error) {
        let errorMessage = 'Query failed';

        // Better error handling
        if (result.error instanceof Error) {
          errorMessage = result.error.message;
        } else if (typeof result.error === 'string') {
          errorMessage = result.error;
        } else if (result.error && typeof result.error === 'object') {
          // Handle Supabase error objects
          const supabaseError = result.error as any;
          if (supabaseError.message) {
            errorMessage = supabaseError.message;
          } else if (supabaseError.details) {
            errorMessage = supabaseError.details;
          } else if (supabaseError.hint) {
            errorMessage = supabaseError.hint;
          } else {
            errorMessage = JSON.stringify(result.error);
          }
        }

        console.error('❌ Query error details:', result.error);
        throw new Error(errorMessage);
      }

      setData(result.data);
      console.log('✅ Query successful');
    } catch (err) {
      let errorMessage = 'Unknown error';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      console.error('❌ Supabase query error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [enabled]); // ✅ ONLY DEPEND ON ENABLED, NOT THE QUERY FUNCTION

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
