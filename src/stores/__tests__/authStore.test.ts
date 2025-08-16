import { renderHook, act } from '@testing-library/react';

import { useAuthStore } from '../authStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthStore', () => {
  beforeEach(() => {
    // Очищаем состояние перед каждым тестом
    act(() => {
      useAuthStore.getState().clearAuth();
    });
    localStorageMock.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user and update authentication state', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should clear user and set authenticated to false when user is null', () => {
      const { result } = renderHook(() => useAuthStore());

      // Сначала устанавливаем пользователя
      act(() => {
        result.current.setUser({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        });
      });

      // Затем очищаем
      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useAuthStore());
      const errorMessage = 'Authentication failed';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it('should clear error when set to null', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setError('Some error');
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('clearAuth', () => {
    it('should reset all auth state to initial values', () => {
      const { result } = renderHook(() => useAuthStore());

      // Устанавливаем некоторые значения
      act(() => {
        result.current.setUser({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        });
        result.current.setLoading(true);
        result.current.setError('Some error');
      });

      // Очищаем
      act(() => {
        result.current.clearAuth();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear auth state and remove items from localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      // Устанавливаем пользователя
      act(() => {
        result.current.setUser({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        });
      });

      // Добавляем токен в localStorage
      localStorageMock.setItem('auth_token', 'test-token');
      localStorageMock.setItem(
        'auth_user',
        JSON.stringify({ id: '1', email: 'test@example.com' })
      );

      // Выходим
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('initializeFromStorage', () => {
    it('should initialize user from localStorage if valid data exists', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      localStorageMock.setItem('auth_user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initializeFromStorage();
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should not initialize if no user data in localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initializeFromStorage();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.setItem('auth_user', 'invalid-json');

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initializeFromStorage();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);

      // Проверяем, что невалидные данные были удалены
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('Persistence', () => {
    it('should persist user and authentication state', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      // Проверяем, что состояние сохранилось в localStorage
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});
