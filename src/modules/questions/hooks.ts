'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import type { QuestionCreate } from '@/types/api';

import { questionsApi } from './api';

interface UseQuestionsParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  enabled?: boolean;
}

export function useQuestions(params: UseQuestionsParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: queryKeys.questions.list(queryParams),
    queryFn: () => questionsApi.list(queryParams),
    enabled,
  });
}

export function useQuestion(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.questions.detail(id),
    queryFn: () => questionsApi.get(id),
    enabled: enabled && id > 0,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuestionCreate) => questionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: QuestionCreate }) =>
      questionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() });
    },
  });
}

export function useSearchQuestions(query: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.questions.all, 'search', query],
    queryFn: () => questionsApi.search(query),
    enabled: enabled && query.length > 0,
  });
}
