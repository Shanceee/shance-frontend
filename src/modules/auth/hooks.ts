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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check token only on client side after mount
    setIsClient(true);
    setHasToken(tokenManager.isAuthenticated());
  }, []);

  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async () => {
      // Double-check token exists before making API call
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      return authApi.getCurrentUser();
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
    // Only enable query on client-side when we have a token
    enabled: isClient && hasToken,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
