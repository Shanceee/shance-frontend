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
    api.get<PaginatedResponse<Technology>>('vacancies/technologies/list/', params),

  get: (id: number): Promise<Technology> =>
    api.get<Technology>(`vacancies/technologies/${id}/`),

  create: (data: TechnologyCreate): Promise<Technology> =>
    api.post<Technology>('vacancies/technologies/', data),

  update: (id: number, data: TechnologyCreate): Promise<Technology> =>
    api.patch<Technology>(`vacancies/technologies/${id}/`, data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`vacancies/technologies/${id}/`),

  // Note: API doesn't have a dedicated search endpoint, filtering through list params
  search: (query: string): Promise<PaginatedResponse<Technology>> =>
    api.get<PaginatedResponse<Technology>>('vacancies/technologies/list/', { search: query }),
};
