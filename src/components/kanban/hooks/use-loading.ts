// hooks/use-loading.ts
import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export const useLoading = (initialStates?: LoadingState) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>(
    initialStates || {}
  );

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key] || false;
    },
    [loadingStates]
  );

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const resetLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  // Wrapper para operações assíncronas
  const withLoading = useCallback(
    async <T>(key: string, operation: () => Promise<T>): Promise<T> => {
      setLoading(key, true);
      try {
        const result = await operation();
        return result;
      } finally {
        setLoading(key, false);
      }
    },
    [setLoading]
  );

  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    resetLoading,
    withLoading,
  };
};

export default useLoading;
