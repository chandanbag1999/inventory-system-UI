// ============================================================
// QUERY CLIENT CONFIGURATION
// src/app/queryClient.ts
// ============================================================

import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/shared/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime:            5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime:               10 * 60 * 1000,
      // Retry failed requests 2 times
      retry:                (failureCount, error) => {
        const apiError = error as ApiError;
        // Don't retry on 4xx errors
        if (
          apiError?.statusCode >= 400 &&
          apiError?.statusCode < 500
        ) return false;
        return failureCount < 2;
      },
      retryDelay:           (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      // Refetch on window focus in production
      refetchOnWindowFocus: import.meta.env.PROD,
      refetchOnReconnect:   true,
    },
    mutations: {
      retry: false,
      onError: (error) => {
        const apiError = error as ApiError;
        if (apiError?.statusCode !== 422) {
          toast.error(apiError?.message ?? 'Something went wrong');
        }
      },
    },
  },
});
