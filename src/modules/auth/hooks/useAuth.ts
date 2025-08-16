import { useCallback } from 'react';

import { useLogin, useRegister, useLogout, useCurrentUser } from '@/hooks';
import { useAuthStore } from '@/stores';

import type { LoginCredentials, RegisterCredentials } from '../types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    clearAuth,
  } = useAuthStore();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const currentUserQuery = useCurrentUser();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true);
        setError(null);

        const result = await loginMutation.mutateAsync(credentials);
        return result;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Произошла неизвестная ошибка');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loginMutation, setLoading, setError]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        setLoading(true);
        setError(null);

        const result = await registerMutation.mutateAsync(credentials);
        return result;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Произошла неизвестная ошибка');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [registerMutation, setLoading, setError]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await logoutMutation.mutateAsync();
      clearAuth();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [logoutMutation, setLoading, setError, clearAuth]);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await currentUserQuery.refetch();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  }, [currentUserQuery, setLoading, setError]);

  const updateProfile = useCallback(
    async (profileData: Partial<typeof user>) => {
      try {
        setLoading(true);
        setError(null);

        if (user) {
          const updatedUser = { ...user, ...profileData };
          setUser(updatedUser);
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Произошла неизвестная ошибка');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, setUser, setLoading, setError]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    clearAuth,
  };
};
