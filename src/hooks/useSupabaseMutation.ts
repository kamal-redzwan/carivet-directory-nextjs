import { useState } from 'react';

interface UseSupabaseMutationReturn<T, P> {
  mutate: (params: P) => Promise<T | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

interface MutationResult<T> {
  data: T | null;
  error: unknown;
}

export function useSupabaseMutation<T, P>(
  mutationFn: (params: P) => Promise<MutationResult<T>>
): UseSupabaseMutationReturn<T, P> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await mutationFn(params);

      if (result.error) {
        const errorMessage =
          result.error instanceof Error
            ? result.error.message
            : typeof result.error === 'string'
            ? result.error
            : 'Mutation failed';
        throw new Error(errorMessage);
      }

      setSuccess(true);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Supabase mutation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    mutate,
    loading,
    error,
    success,
    reset,
  };
}
