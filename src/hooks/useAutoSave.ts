import { useEffect, useRef } from 'react';

interface UseAutoSaveOptions<T> {
  data: T | null;
  onSave: (data: T) => void | Promise<void>;
  enabled?: boolean;
  delay?: number;
}

export function useAutoSave<T>({
  data,
  onSave,
  enabled = true,
  delay = 3000,
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !data) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSave(data);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, enabled, delay, onSave]);
}
