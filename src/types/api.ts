export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface TagCreate {
  name: string;
}

export interface ProjectImage {
  id?: number;
  image: string;
  caption?: string;
  position?: number;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  avatar?: string;
  specialization?: string;
  bio?: string;
  personal_info?: string;
  phone?: string;
  country?: string;
  city?: string;
  github_url?: string;
  behance_url?: string;
  website_url?: string;
  tags?: Tag[];
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  specialization?: string;
  bio?: string;
  personal_info?: string;
  phone?: string;
  country?: string;
  city?: string;
  github_url?: string;
  behance_url?: string;
  website_url?: string;
}

export type ProjectStage =
  | 'idea'
  | 'concept'
  | 'development'
  | 'testing'
  | 'launch'
  | 'growth';
export type ProjectStatus =
  | 'prototype'
  | 'mvp'
  | 'beta'
  | 'release'
  | 'archived';

export interface Project {
  id: number;
  name: string;
  title: string;
  subtitle?: string;
  description: string;
  photo?: string;
  stage?: ProjectStage;
  status?: ProjectStatus;
  highlight_date?: string;
  formatted_highlight_date?: string;
  team_capacity_label?: string;
  tags?: Tag[];
  images?: ProjectImage[];
  created_at: string;
  updated_at?: string;
}

export interface ProjectCreate {
  name: string;
  title: string;
  subtitle?: string;
  description: string;
  stage?: ProjectStage;
  status?: ProjectStatus;
  highlight_date?: string;
  team_capacity_label?: string;
  tag_ids?: number[];
}

export type ProjectUpdate = Partial<ProjectCreate>;

export interface ProjectMember {
  id: number;
  user: User;
  role: string;
  joined_at?: string;
}

export interface ProjectMemberList {
  members: ProjectMember[];
  count: number;
}

export interface ProjectInvite {
  user_id: number;
  role?: string;
}

export interface Technology {
  id: number;
  name: string;
  created_at: string;
}

export interface TechnologyCreate {
  name: string;
}

export interface Question {
  id: number;
  description: string;
  created_at: string;
}

export interface QuestionCreate {
  description: string;
}

export interface Vacancy {
  id: number;
  project: number | Project;
  title: string;
  description: string;
  technologies?: Technology[];
  questions?: Question[];
  created_at: string;
  updated_at?: string;
}

export interface VacancyCreate {
  title: string;
  description: string;
  technology_ids?: number[];
  question_ids?: number[];
}

export interface VacancyResponseAnswer {
  id: number;
  question: Question;
  answer: string;
  created_at: string;
}

export interface VacancyResponseAnswerCreate {
  question: number;
  answer: string;
}

export interface VacancyResponse {
  id: number;
  vacancy: number | Vacancy;
  user: User;
  message: string;
  answers: VacancyResponseAnswer[];
  created_at: string;
}

export interface VacancyResponseCreate {
  message: string;
  answers: VacancyResponseAnswerCreate[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user?: User;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface RegisterResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalMembers: number;
  totalVacancies: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface Activity {
  id: string;
  type:
    | 'project_created'
    | 'member_joined'
    | 'vacancy_posted'
    | 'application_received';
  message: string;
  timestamp: string;
  user?: User;
  metadata?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
