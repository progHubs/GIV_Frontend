import { QueryClient } from '@tanstack/react-query';

// Create a query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 30 seconds for better pagination
      staleTime: 30 * 1000,

      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,

      // Reduce retries to minimize network overhead
      retry: 1,

      // Faster retry delay
      retryDelay: 1000,

      // Disable automatic refetching to reduce API calls
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true, // Enable refetch on mount for fresh data

      // Enable background refetching only when stale
      refetchInterval: false,
      refetchIntervalInBackground: false,

      // Reduce network waterfall
      networkMode: 'online',
    },
    mutations: {
      // Single retry for mutations
      retry: 0,

      // No retry delay for mutations
      retryDelay: 0,
    },
  },
});

// Query Keys - Centralized key management
export const queryKeys = {
  campaigns: {
    all: ['campaigns'] as const,
    lists: () => [...queryKeys.campaigns.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.campaigns.lists(), filters] as const,
    details: () => [...queryKeys.campaigns.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.campaigns.details(), id] as const,
    stats: () => [...queryKeys.campaigns.all, 'stats'] as const,
  },
} as const;

export default queryClient;
