import type { BaseEntity } from '@/types';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  growthRate: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface RecentActivity extends BaseEntity {
  type: 'login' | 'registration' | 'purchase' | 'update';
  description: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardState {
  stats: DashboardStats | null;
  chartData: ChartData[];
  recentActivities: RecentActivity[];
  isLoading: boolean;
  error: string | null;
}
