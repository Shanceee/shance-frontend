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
  list: (params?: UserListParams): Promise<PaginatedResponse<User>> =>
    api.get<PaginatedResponse<User>>('users/', params),

  get: (id: number): Promise<User> => api.get<User>(`users/${id}/`),

  getMe: (): Promise<User> => api.get<User>('users/me/'),

  update: (id: number, data: UserUpdate): Promise<User> =>
    api.patch<User>(`users/${id}/`, data),

  updateMe: (data: UserUpdate): Promise<User> =>
    api.patch<User>('users/me/', data),

  uploadAvatar: (formData: FormData): Promise<User> =>
    api.upload<User>('users/me/avatar/', formData),

  deleteAvatar: (): Promise<void> => api.delete<void>('users/me/avatar/'),

  getProjects: (userId: number): Promise<PaginatedResponse<Project>> =>
    api.get<PaginatedResponse<Project>>(`users/${userId}/projects/`),

  search: (query: string): Promise<PaginatedResponse<User>> =>
    api.get<PaginatedResponse<User>>('users/', { search: query }),
};
