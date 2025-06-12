import { useState } from 'react';

interface UseSupabaseMutationReturn<T, P> {
  mutate: (params: P) => Promise<T | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export function useSupabaseMutation<T, P>(
  mutationFn: (params: P) => Promise<{ data: T | null; error: any }>
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
        throw new Error(result.error.message || 'Mutation failed');
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
