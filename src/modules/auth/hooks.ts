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

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authApi.login(data);

      // Verify tokens were saved before returning
      // This ensures localStorage operations are complete
      const savedToken = tokenManager.getToken();
      if (!savedToken) {
        console.error('Token was not saved to localStorage');
        throw new Error('Failed to save authentication token');
      }

      return response;
    },
    onSuccess: async response => {
      // Set user data in cache if available
      if (response.user) {
        queryClient.setQueryData<User>(queryKeys.auth.user, response.user);
      }

      // Invalidate queries to refresh any cached data
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      // Double-check token exists before redirect
      const token = tokenManager.getToken();
      console.log('Token before redirect:', token ? 'exists' : 'missing');

      if (token) {
        // Use window.location for guaranteed redirect after successful login
        window.location.href = '/profile';
      } else {
        console.error('Token missing before redirect');
      }
    },
    onError: error => {
      // Log error for debugging
      console.error('Login failed:', error);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: async response => {
      // Set user data in cache if available
      if (response.user) {
        queryClient.setQueryData<User>(queryKeys.auth.user, response.user);
      }

      // Invalidate queries to refresh any cached data
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      // Use window.location for guaranteed redirect after successful registration
      window.location.href = '/profile';
    },
    onError: error => {
      // Log error for debugging
      console.error('Registration failed:', error);
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
