'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import type { VacancyCreate, VacancyResponseCreate } from '@/types/api';

import { vacanciesApi } from './api';

interface UseVacanciesParams {
  page?: number;
  page_size?: number;
  search?: string;
  project?: number;
  ordering?: string;
  enabled?: boolean;
}

export function useVacancies(params: UseVacanciesParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: queryKeys.vacancies.list(queryParams),
    queryFn: () => vacanciesApi.list(queryParams),
    enabled,
  });
}

export function useVacancy(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.vacancies.detail(id),
    queryFn: () => vacanciesApi.get(id),
    enabled: enabled && id > 0,
  });
}

export function useProjectVacancies(projectId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.vacancies(projectId),
    queryFn: () => vacanciesApi.getByProject(projectId),
    enabled: enabled && projectId > 0,
  });
}

export function useCreateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: number;
      data: VacancyCreate;
    }) => vacanciesApi.create(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vacancies.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.vacancies(projectId),
      });
    },
  });
}

export function useUpdateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VacancyCreate> }) =>
      vacanciesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.vacancies.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.vacancies.lists() });
    },
  });
}

export function useDeleteVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vacanciesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vacancies.lists() });
    },
  });
}

export function useVacancyResponses(vacancyId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.vacancies.responses(vacancyId),
    queryFn: () => vacanciesApi.getResponses(vacancyId),
    enabled: enabled && vacancyId > 0,
  });
}

export function useRespondToVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vacancyId,
      data,
    }: {
      vacancyId: number;
      data: VacancyResponseCreate;
    }) => vacanciesApi.respond(vacancyId, data),
    onSuccess: (_, { vacancyId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.vacancies.responses(vacancyId),
      });
    },
  });
}
