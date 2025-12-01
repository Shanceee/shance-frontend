import { api } from '@/lib/api';
import type { User, UserUpdate, PaginatedResponse, Project } from '@/types/api';

interface UserListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export const usersApi = {
  // Note: API doesn't have a users list endpoint
  list: (params?: UserListParams): Promise<PaginatedResponse<User>> => {
    console.warn('Users list endpoint is not available in the API');
    return Promise.resolve({ count: 0, next: null, previous: null, results: [] });
  },

  get: (id: number): Promise<User> => api.get<User>(`users/${id}/profile/`),

  getMe: (): Promise<User> => api.get<User>('users/me/'),

  updateMe: (data: UserUpdate): Promise<User> =>
    api.patch<User>('users/me/update/', data),

  uploadAvatar: (formData: FormData): Promise<User> =>
    api.upload<User>('users/me/avatar/', formData),

  deleteAvatar: (): Promise<void> => api.delete<void>('users/me/avatar/'),

  getProjects: (userId: number): Promise<PaginatedResponse<Project>> =>
    api.get<PaginatedResponse<Project>>(`users/${userId}/projects/`),

  // Note: API doesn't have a users search endpoint
  search: (query: string): Promise<PaginatedResponse<User>> => {
    console.warn('Users search endpoint is not available in the API');
    return Promise.resolve({ count: 0, next: null, previous: null, results: [] });
  },
};
