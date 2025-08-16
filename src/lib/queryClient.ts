import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export type QueryKeys = {
  auth: {
    user: readonly ['auth', 'user'];
    profile: readonly ['auth', 'profile'];
  };
  dashboard: {
    stats: readonly ['dashboard', 'stats'];
    chartData: readonly ['dashboard', 'chartData'];
    recentActivities: readonly ['dashboard', 'recentActivities'];
    analytics: readonly ['dashboard', 'analytics', string];
  };
  users: {
    all: readonly ['users'];
    byId: readonly ['users', string];
    search: readonly ['users', 'search', string];
  };
};

export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    chartData: ['dashboard', 'chartData'] as const,
    recentActivities: ['dashboard', 'recentActivities'] as const,
    analytics: (period: string) => ['dashboard', 'analytics', period] as const,
  },
  users: {
    all: ['users'] as const,
    byId: (id: string) => ['users', id] as const,
    search: (query: string) => ['users', 'search', query] as const,
  },
};
