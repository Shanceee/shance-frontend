'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import type { UserUpdate } from '@/types/api';

import { usersApi } from './api';

interface UseUsersParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  enabled?: boolean;
}

export function useUsers(params: UseUsersParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => usersApi.list(queryParams),
    enabled,
  });
}

export function useUser(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.get(id),
    enabled: enabled && id > 0,
  });
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: usersApi.getMe,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdate }) =>
      usersApi.update(id, data),
    onSuccess: user => {
      queryClient.setQueryData(queryKeys.users.detail(user.id), user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdate) => usersApi.updateMe(data),
    onSuccess: user => {
      queryClient.setQueryData(queryKeys.users.me, user);
      queryClient.setQueryData(queryKeys.auth.user, user);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => usersApi.uploadAvatar(formData),
    onSuccess: user => {
      queryClient.setQueryData(queryKeys.users.me, user);
      queryClient.setQueryData(queryKeys.auth.user, user);
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

export function useUserProjects(userId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.projects(userId),
    queryFn: () => usersApi.getProjects(userId),
    enabled: enabled && userId > 0,
  });
}

export function useSearchUsers(query: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.users.all, 'search', query],
    queryFn: () => usersApi.search(query),
    enabled: enabled && query.length > 0,
  });
}
