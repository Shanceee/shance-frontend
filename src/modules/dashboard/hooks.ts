'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';

import { dashboardApi, type AnalyticsPeriod } from './api';

export function useDashboardStats(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardApi.getStats,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardChartData(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.chartData,
    queryFn: dashboardApi.getChartData,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardActivities(limit = 10, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.dashboard.activities, limit],
    queryFn: () => dashboardApi.getActivities(limit),
    enabled,
  });
}

export function useDashboardAnalytics(period: AnalyticsPeriod, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.analytics(period),
    queryFn: () => dashboardApi.getAnalytics(period),
    enabled,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDashboard(enabled = true) {
  const stats = useDashboardStats(enabled);
  const chartData = useDashboardChartData(enabled);
  const activities = useDashboardActivities(10, enabled);

  return {
    stats: stats.data,
    chartData: chartData.data,
    activities: activities.data,
    isLoading: stats.isLoading || chartData.isLoading || activities.isLoading,
    isError: stats.isError || chartData.isError || activities.isError,
    error: stats.error || chartData.error || activities.error,
  };
}
