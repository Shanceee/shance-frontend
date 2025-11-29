import { api } from '@/lib/api';
import type {
  Vacancy,
  VacancyCreate,
  VacancyResponse,
  VacancyResponseCreate,
  PaginatedResponse,
} from '@/types/api';

interface VacancyListParams {
  page?: number;
  page_size?: number;
  search?: string;
  project?: number;
  ordering?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export const vacanciesApi = {
  list: (params?: VacancyListParams): Promise<PaginatedResponse<Vacancy>> =>
    api.get<PaginatedResponse<Vacancy>>('vacancies/', params),

  get: (id: number): Promise<Vacancy> => api.get<Vacancy>(`vacancies/${id}/`),

  create: (projectId: number, data: VacancyCreate): Promise<Vacancy> =>
    api.post<Vacancy>(`projects/${projectId}/vacancies/`, data),

  update: (id: number, data: Partial<VacancyCreate>): Promise<Vacancy> =>
    api.patch<Vacancy>(`vacancies/${id}/`, data),

  delete: (id: number): Promise<void> => api.delete<void>(`vacancies/${id}/`),

  getByProject: (projectId: number): Promise<PaginatedResponse<Vacancy>> =>
    api.get<PaginatedResponse<Vacancy>>('vacancies/', { project: projectId }),

  getResponses: (
    vacancyId: number
  ): Promise<PaginatedResponse<VacancyResponse>> =>
    api.get<PaginatedResponse<VacancyResponse>>(
      `vacancies/${vacancyId}/responses/`
    ),

  respond: (
    vacancyId: number,
    data: VacancyResponseCreate
  ): Promise<VacancyResponse> =>
    api.post<VacancyResponse>(`vacancies/${vacancyId}/respond/`, data),
};
