import { api } from '@/lib/api';
import type { Question, QuestionCreate, PaginatedResponse } from '@/types/api';

interface QuestionListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export const questionsApi = {
  list: (params?: QuestionListParams): Promise<PaginatedResponse<Question>> =>
    api.get<PaginatedResponse<Question>>('questions/', params),

  get: (id: number): Promise<Question> => api.get<Question>(`questions/${id}/`),

  create: (data: QuestionCreate): Promise<Question> =>
    api.post<Question>('questions/', data),

  update: (id: number, data: QuestionCreate): Promise<Question> =>
    api.patch<Question>(`questions/${id}/`, data),

  delete: (id: number): Promise<void> => api.delete<void>(`questions/${id}/`),

  search: (query: string): Promise<PaginatedResponse<Question>> =>
    api.get<PaginatedResponse<Question>>('questions/', { search: query }),
};
