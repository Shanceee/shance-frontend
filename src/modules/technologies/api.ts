import { api } from '@/lib/api';
import type {
  Technology,
  TechnologyCreate,
  PaginatedResponse,
} from '@/types/api';

interface TechnologyListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export const technologiesApi = {
  list: (
    params?: TechnologyListParams
  ): Promise<PaginatedResponse<Technology>> =>
    api.get<PaginatedResponse<Technology>>('technologies/', params),

  get: (id: number): Promise<Technology> =>
    api.get<Technology>(`technologies/${id}/`),

  create: (data: TechnologyCreate): Promise<Technology> =>
    api.post<Technology>('technologies/', data),

  update: (id: number, data: TechnologyCreate): Promise<Technology> =>
    api.patch<Technology>(`technologies/${id}/`, data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`technologies/${id}/`),

  search: (query: string): Promise<PaginatedResponse<Technology>> =>
    api.get<PaginatedResponse<Technology>>('technologies/', { search: query }),
};
