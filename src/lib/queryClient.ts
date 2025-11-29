import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ApiError } from '@/types/api';

function handleError(error: unknown): void {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) return;
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation?.meta?.disableErrorToast) return;
      handleError(error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: ['auth', 'user'] as const,
  },

  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.projects.lists(), params] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.projects.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.projects.all, 'search', query] as const,
    members: (id: number) =>
      [...queryKeys.projects.detail(id), 'members'] as const,
    images: (id: number) =>
      [...queryKeys.projects.detail(id), 'images'] as const,
    vacancies: (id: number) =>
      [...queryKeys.projects.detail(id), 'vacancies'] as const,
  },

  users: {
    all: ['users'] as const,
    me: ['users', 'me'] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
    profile: (id: number) =>
      [...queryKeys.users.detail(id), 'profile'] as const,
    projects: (id: number) =>
      [...queryKeys.users.detail(id), 'projects'] as const,
  },

  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.tags.lists(), params] as const,
    details: () => [...queryKeys.tags.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.tags.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.tags.all, 'search', query] as const,
  },

  vacancies: {
    all: ['vacancies'] as const,
    lists: () => [...queryKeys.vacancies.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.vacancies.lists(), params] as const,
    details: () => [...queryKeys.vacancies.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.vacancies.details(), id] as const,
    responses: (id: number) =>
      [...queryKeys.vacancies.detail(id), 'responses'] as const,
  },

  technologies: {
    all: ['technologies'] as const,
    lists: () => [...queryKeys.technologies.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.technologies.lists(), params] as const,
    details: () => [...queryKeys.technologies.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.technologies.details(), id] as const,
  },

  questions: {
    all: ['questions'] as const,
    lists: () => [...queryKeys.questions.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.questions.lists(), params] as const,
    details: () => [...queryKeys.questions.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.questions.details(), id] as const,
  },

  dashboard: {
    all: ['dashboard'] as const,
    stats: ['dashboard', 'stats'] as const,
    chartData: ['dashboard', 'chartData'] as const,
    activities: ['dashboard', 'activities'] as const,
    analytics: (period: string) => ['dashboard', 'analytics', period] as const,
  },
};
