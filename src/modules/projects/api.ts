import { api } from '@/lib/api';
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectMember,
  ProjectMemberList,
  ProjectInvite,
  ProjectImage,
  PaginatedResponse,
} from '@/types/api';

interface ProjectListParams {
  page?: number;
  page_size?: number;
  search?: string;
  stage?: string;
  status?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export const projectsApi = {
  list: (params?: ProjectListParams): Promise<PaginatedResponse<Project>> =>
    api.get<PaginatedResponse<Project>>('projects/', params),

  get: (id: number): Promise<Project> => api.get<Project>(`projects/${id}/`),

  create: (data: ProjectCreate): Promise<Project> =>
    api.post<Project>('projects/', data),

  update: (id: number, data: ProjectUpdate): Promise<Project> =>
    api.patch<Project>(`projects/${id}/`, data),

  delete: (id: number): Promise<void> => api.delete<void>(`projects/${id}/`),

  search: (query: string): Promise<PaginatedResponse<Project>> =>
    api.get<PaginatedResponse<Project>>('projects/', { search: query }),

  getMembers: (projectId: number): Promise<ProjectMemberList> =>
    api.get<ProjectMemberList>(`projects/${projectId}/members/`),

  inviteMember: (
    projectId: number,
    data: ProjectInvite
  ): Promise<ProjectMember> =>
    api.post<ProjectMember>(`projects/${projectId}/invite/`, data),

  removeMember: (projectId: number, memberId: number): Promise<void> =>
    api.delete<void>(`projects/${projectId}/members/${memberId}/`),

  getImages: (projectId: number): Promise<ProjectImage[]> =>
    api.get<ProjectImage[]>(`projects/${projectId}/images/`),

  uploadImage: (projectId: number, formData: FormData): Promise<ProjectImage> =>
    api.upload<ProjectImage>(`projects/${projectId}/images/`, formData),

  deleteImage: (projectId: number, imageId: number): Promise<void> =>
    api.delete<void>(`projects/${projectId}/images/${imageId}/`),

  uploadPhoto: (projectId: number, formData: FormData): Promise<Project> =>
    api.upload<Project>(`projects/${projectId}/photo/`, formData),
};
