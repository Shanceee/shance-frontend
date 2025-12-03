import { api, tokenManager } from '@/lib/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@/types/api';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('auth/login/', data);
    // API returns { access_token, refresh_token } directly
    if (response.access_token) {
      tokenManager.setToken(response.access_token);
    }
    if (response.refresh_token) {
      tokenManager.setRefreshToken(response.refresh_token);
    }
    return response;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('auth/register/', data);
    // API returns { user, tokens: { access_token, refresh_token } }
    if (response.tokens?.access_token) {
      tokenManager.setToken(response.tokens.access_token);
    }
    if (response.tokens?.refresh_token) {
      tokenManager.setRefreshToken(response.tokens.refresh_token);
    }
    return response;
  },

  logout: async (): Promise<void> => {
    const refreshToken = tokenManager.getRefreshToken();
    try {
      await api.post('auth/logout/', { refresh: refreshToken });
    } finally {
      tokenManager.clearTokens();
    }
  },

  getCurrentUser: (): Promise<User> => {
    // Prevent API call if no token exists
    if (!tokenManager.isAuthenticated()) {
      return Promise.reject(new Error('Not authenticated'));
    }
    return api.get<User>('users/me/');
  },
};
