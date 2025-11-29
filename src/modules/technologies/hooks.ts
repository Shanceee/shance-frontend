'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import type { TechnologyCreate } from '@/types/api';

import { technologiesApi } from './api';

interface UseTechnologiesParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  enabled?: boolean;
}

export function useTechnologies(params: UseTechnologiesParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: queryKeys.technologies.list(queryParams),
    queryFn: () => technologiesApi.list(queryParams),
    enabled,
  });
}

export function useTechnology(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.technologies.detail(id),
    queryFn: () => technologiesApi.get(id),
    enabled: enabled && id > 0,
  });
}

export function useCreateTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TechnologyCreate) => technologiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.technologies.lists(),
      });
    },
  });
}

export function useUpdateTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TechnologyCreate }) =>
      technologiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.technologies.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.technologies.lists(),
      });
    },
  });
}

export function useDeleteTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => technologiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.technologies.lists(),
      });
    },
  });
}

export function useSearchTechnologies(query: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.technologies.all, 'search', query],
    queryFn: () => technologiesApi.search(query),
    enabled: enabled && query.length > 0,
  });
}
