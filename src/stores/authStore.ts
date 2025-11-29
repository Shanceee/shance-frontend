import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { User } from '@/types/api';

export interface AuthState {
  // UI состояние
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Действия с состоянием (без API)
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  logout: () => void;

  // Инициализация из localStorage
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      // Начальное состояние
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Установка пользователя

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      // Установка состояния загрузки

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Установка ошибки

      setError: (error: string | null) => set({ error }),

      // Очистка авторизации
      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      // Выход из системы (только UI)
      logout: () => {
        // Очищаем localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }

        // Очищаем состояние
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Инициализация из localStorage (только для UI)
      initializeFromStorage: () => {
        // Проверяем, есть ли сохраненный пользователь
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            set({ user, isAuthenticated: true });
          } catch {
            // Если не удалось распарсить, очищаем
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Сохраняем только UI состояние
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
