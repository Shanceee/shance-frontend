'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import type { ProjectCreate, ProjectUpdate, ProjectInvite } from '@/types/api';

import { projectsApi } from './api';

interface UseProjectsParams {
  page?: number;
  page_size?: number;
  search?: string;
  stage?: string;
  status?: string;
  ordering?: string;
  enabled?: boolean;
}

export function useProjects(params: UseProjectsParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: queryKeys.projects.list(queryParams),
    queryFn: () => projectsApi.list(queryParams),
    enabled,
  });
}

export function useInfiniteProjects(
  params: Omit<UseProjectsParams, 'page'> = {}
) {
  const { enabled = true, ...queryParams } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.projects.list({ ...queryParams, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      projectsApi.list({ ...queryParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages) => {
      if (!lastPage.next) return undefined;
      return _allPages.length + 1;
    },
    enabled,
  });
}

export function useProject(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectsApi.get(id),
    enabled: enabled && id > 0,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectUpdate }) =>
      projectsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
    },
  });
}

export function useProjectMembers(projectId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.members(projectId),
    queryFn: () => projectsApi.getMembers(projectId),
    enabled: enabled && projectId > 0,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: number;
      data: ProjectInvite;
    }) => projectsApi.inviteMember(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.members(projectId),
      });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
    }: {
      projectId: number;
      memberId: number;
    }) => projectsApi.removeMember(projectId, memberId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.members(projectId),
      });
    },
  });
}

export function useProjectImages(projectId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.images(projectId),
    queryFn: () => projectsApi.getImages(projectId),
    enabled: enabled && projectId > 0,
  });
}

export function useUploadProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      formData,
    }: {
      projectId: number;
      formData: FormData;
    }) => projectsApi.uploadImage(projectId, formData),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.images(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
    },
  });
}

export function useDeleteProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      imageId,
    }: {
      projectId: number;
      imageId: number;
    }) => projectsApi.deleteImage(projectId, imageId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.images(projectId),
      });
    },
  });
}

export function useSearchProjects(query: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.search(query),
    queryFn: () => projectsApi.search(query),
    enabled: enabled && query.length > 0,
  });
}

interface UseCreateProjectWithImageOptions {
  onSuccess?: (project: Awaited<ReturnType<typeof projectsApi.create>>) => void;
  onError?: (error: Error) => void;
}

export function useCreateProjectWithImage(
  options: UseCreateProjectWithImageOptions = {}
) {
  const queryClient = useQueryClient();
  const uploadImage = useUploadProjectImage();

  return useMutation({
    mutationFn: async ({
      projectData,
      imageFile,
    }: {
      projectData: ProjectCreate;
      imageFile?: File;
    }) => {
      // Step 1: Create the project
      const project = await projectsApi.create(projectData);

      // Step 2: Upload image if provided (using the correct endpoint)
      if (imageFile) {
        const formData = new FormData();
        // Important: The field name must be 'image' not 'photo'
        formData.append('image', imageFile);

        try {
          await uploadImage.mutateAsync({
            projectId: project.id,
            formData,
          });
        } catch (error) {
          console.error('Failed to upload project image:', error);
          // Don't throw - project was created successfully
          // Image upload is optional
        }
      }

      return project;
    },
    onSuccess: project => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(project.id),
      });
      options.onSuccess?.(project);
    },
    onError: error => {
      console.error('Failed to create project:', error);
      options.onError?.(error as Error);
    },
  });
}
