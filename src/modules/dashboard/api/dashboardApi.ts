import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types';

import type { DashboardStats, ChartData, RecentActivity } from '../types';

export interface AnalyticsData {
  period: string;
  data: Record<string, number>;
  trends: Record<string, number>;
}

export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  },

  async getChartData(): Promise<ApiResponse<ChartData[]>> {
    return apiClient.get<ApiResponse<ChartData[]>>('/dashboard/chart-data');
  },

  async getRecentActivities(
    limit: number = 10
  ): Promise<ApiResponse<RecentActivity[]>> {
    const params = new URLSearchParams({ limit: limit.toString() });
    return apiClient.get<ApiResponse<RecentActivity[]>>(
      `/dashboard/recent-activities?${params}`
    );
  },

  async getAnalytics(
    period: 'day' | 'week' | 'month' | 'year'
  ): Promise<ApiResponse<AnalyticsData>> {
    const params = new URLSearchParams({ period });
    return apiClient.get<ApiResponse<AnalyticsData>>(
      `/dashboard/analytics?${params}`
    );
  },

  async exportData(
    format: 'csv' | 'excel' | 'pdf',
    period?: string
  ): Promise<ApiResponse<string>> {
    const params = new URLSearchParams({ format });
    if (period) params.append('period', period);

    return apiClient.get<ApiResponse<string>>(`/dashboard/export?${params}`);
  },
};
