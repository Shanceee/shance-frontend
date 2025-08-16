import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types';

import type { User, LoginCredentials, RegisterCredentials } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export const authApi = {
  // Вход в систему
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
  },

  // Регистрация
  async register(
    credentials: RegisterCredentials
  ): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<ApiResponse<RegisterResponse>>(
      '/auth/register',
      credentials
    );
  },

  // Выход из системы
  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/auth/logout');
  },

  // Получение текущего пользователя
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/auth/me');
  },

  // Обновление профиля
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>('/auth/profile', data);
  },

  // Сброс пароля
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/auth/reset-password', { email });
  },

  // Смена пароля
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },

  // Подтверждение email
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/auth/verify-email', { token });
  },

  // Обновление токена
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
  },
};
