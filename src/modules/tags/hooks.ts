'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import type { TagCreate } from '@/types/api';

import { tagsApi } from './api';

interface UseTagsParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  enabled?: boolean;
}

export function useTags(params: UseTagsParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: queryKeys.tags.list(queryParams),
    queryFn: () => tagsApi.list(queryParams),
    enabled,
  });
}

export function useTag(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.tags.detail(id),
    queryFn: () => tagsApi.get(id),
    enabled: enabled && id > 0,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagCreate) => tagsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TagCreate }) =>
      tagsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() });
    },
  });
}

export function useSearchTags(query: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.tags.search(query),
    queryFn: () => tagsApi.search(query),
    enabled: enabled && query.length > 0,
  });
}
