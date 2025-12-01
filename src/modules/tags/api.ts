import { api } from '@/lib/api';
import type { Tag, TagCreate, PaginatedResponse } from '@/types/api';

interface TagListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export const tagsApi = {
  list: (params?: TagListParams): Promise<PaginatedResponse<Tag>> =>
    api.get<PaginatedResponse<Tag>>('tags/', params),

  get: (id: number): Promise<Tag> => api.get<Tag>(`tags/${id}/`),

  create: (data: TagCreate): Promise<Tag> =>
    api.post<Tag>('tags/create/', data),

  update: (id: number, data: TagCreate): Promise<Tag> =>
    api.patch<Tag>(`tags/${id}/`, data),

  delete: (id: number): Promise<void> => api.delete<void>(`tags/${id}/`),

  search: (query: string): Promise<PaginatedResponse<Tag>> =>
    api.get<PaginatedResponse<Tag>>('tags/search/', { q: query }),
};
