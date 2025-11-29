import { api } from '@/lib/api';
import type { DashboardStats, ChartData, Activity } from '@/types/api';

export interface AnalyticsData {
  period: string;
  data: Record<string, number>;
  trends: Record<string, number>;
}

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'year';

export const dashboardApi = {
  getStats: (): Promise<DashboardStats> =>
    api.get<DashboardStats>('dashboard/stats/'),

  getChartData: (): Promise<ChartData> =>
    api.get<ChartData>('dashboard/chart-data/'),

  getActivities: (limit = 10): Promise<Activity[]> =>
    api.get<Activity[]>('dashboard/activities/', { limit }),

  getAnalytics: (period: AnalyticsPeriod): Promise<AnalyticsData> =>
    api.get<AnalyticsData>('dashboard/analytics/', { period }),
};
