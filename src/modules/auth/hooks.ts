'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { tokenManager } from '@/lib/api';
import { queryKeys } from '@/lib/queryClient';
import type { LoginRequest, RegisterRequest, User } from '@/types/api';

import { authApi } from './api';

export function useCurrentUser() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!tokenManager.getToken());
  }, []);

  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getCurrentUser,
    staleTime: 10 * 60 * 1000,
    retry: false,
    enabled: hasToken,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: response => {
      if (response.user) {
        queryClient.setQueryData<User>(queryKeys.auth.user, response.user);
      }
      // Navigate first, then invalidate queries
      router.push('/profile');
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: response => {
      if (response.user) {
        queryClient.setQueryData<User>(queryKeys.auth.user, response.user);
      }
      // Navigate first, then invalidate queries
      router.push('/profile');
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
    onError: () => {
      queryClient.clear();
      router.push('/login');
    },
  });
}
