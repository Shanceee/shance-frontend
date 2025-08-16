import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardApi } from '@/modules/dashboard';
import { queryKeys } from '@/lib/queryClient';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardApi.getStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useDashboardChartData = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.chartData,
    queryFn: dashboardApi.getChartData,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useDashboardRecentActivities = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivities,
    queryFn: () => dashboardApi.getRecentActivities(limit),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};

export const useDashboardAnalytics = (
  period: 'day' | 'week' | 'month' | 'year'
) => {
  return useQuery({
    queryKey: queryKeys.dashboard.analytics(period),
    queryFn: () => dashboardApi.getAnalytics(period),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useDashboardExport = () => {
  return useMutation({
    mutationFn: ({
      format,
      period,
    }: {
      format: 'csv' | 'excel' | 'pdf';
      period?: string;
    }) => dashboardApi.exportData(format, period),
    onSuccess: response => {
      if (response.success && response.data) {
        window.open(response.data, '_blank');
      }
    },
    onError: error => {
      console.error('Export failed:', error);
    },
  });
};

export const useDashboardRefresh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.chartData,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.recentActivities,
        }),
      ]);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.chartData,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.recentActivities,
      });
    },
    onError: error => {
      console.error('Refresh failed:', error);
    },
  });
};

export const useDashboardData = () => {
  const stats = useDashboardStats();
  const chartData = useDashboardChartData();
  const recentActivities = useDashboardRecentActivities();

  return {
    stats: stats.data,
    chartData: chartData.data,
    recentActivities: recentActivities.data,
    isLoading:
      stats.isLoading || chartData.isLoading || recentActivities.isLoading,
    error: stats.error || chartData.error || recentActivities.error,
    refetch: () => {
      stats.refetch();
      chartData.refetch();
      recentActivities.refetch();
    },
  };
};
