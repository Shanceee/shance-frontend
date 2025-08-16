import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/modules/auth';
import { queryKeys } from '@/lib/queryClient';
import { useAuthStore } from '@/stores';

const isClient = typeof window !== 'undefined';

export const useCurrentUser = () => {
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getCurrentUser,
    enabled: isClient && !!localStorage.getItem('auth_token'),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  if (query.data?.success && query.data?.data) {
    setUser(query.data.data);
    localStorage.setItem('auth_user', JSON.stringify(query.data.data));
  }

  if (query.error) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  return query;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: data => {
      if (data.success && data.data) {
        const { user, token } = data.data;
        localStorage.setItem('auth_token', token);
        setUser(user);
        queryClient.setQueryData(queryKeys.auth.user, user);
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.profile,
        });
      }
    },
    onError: (error: Error) => {
      setError(error.message);
      setUser(null);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: data => {
      if (data.success && data.data) {
        const { user, token } = data.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        setUser(user);
        queryClient.setQueryData(queryKeys.auth.user, user);
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.profile,
        });
      }
    },
    onError: (error: Error) => {
      setError(error.message);
      setUser(null);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      queryClient.clear();
      queryClient.invalidateQueries();
    },
    onError: () => {
      clearAuth();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      queryClient.clear();
      queryClient.invalidateQueries();
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: data => {
      if (data.success && data.data) {
        const updatedUser = data.data;
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        queryClient.setQueryData(queryKeys.auth.user, updatedUser);
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.profile,
        });
      }
    },
    onError: (error: Error) => {
      console.error('Profile update failed:', error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error: Error) => {
      console.error('Password reset failed:', error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => authApi.changePassword(oldPassword, newPassword),
    onError: (error: Error) => {
      console.error('Password change failed:', error);
    },
  });
};
