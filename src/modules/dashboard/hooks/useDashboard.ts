import { useCallback } from 'react';

import {
  useDashboardStats,
  useDashboardChartData,
  useDashboardRecentActivities,
} from '@/hooks';
import { useDashboardStore } from '@/stores';

export const useDashboard = () => {
  const {
    stats,
    chartData,
    recentActivities,
    isLoading,
    error,
    setStats,
    setChartData,
    setRecentActivities,
    setLoading,
    setError,
  } = useDashboardStore();

  const statsQuery = useDashboardStats();
  const chartDataQuery = useDashboardChartData();
  const recentActivitiesQuery = useDashboardRecentActivities();

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (statsQuery.data?.success && statsQuery.data?.data) {
        setStats(statsQuery.data.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ошибка загрузки статистики');
      }
    } finally {
      setLoading(false);
    }
  }, [statsQuery.data, setStats, setLoading, setError]);

  const loadChartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (chartDataQuery.data?.success && chartDataQuery.data?.data) {
        // If API returns array, take first element, otherwise use as is
        const data = Array.isArray(chartDataQuery.data.data)
          ? chartDataQuery.data.data[0]
          : chartDataQuery.data.data;
        setChartData(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ошибка загрузки данных графиков');
      }
    } finally {
      setLoading(false);
    }
  }, [chartDataQuery.data, setChartData, setLoading, setError]);

  const loadRecentActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (
        recentActivitiesQuery.data?.success &&
        recentActivitiesQuery.data?.data
      ) {
        setRecentActivities(recentActivitiesQuery.data.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ошибка загрузки активностей');
      }
    } finally {
      setLoading(false);
    }
  }, [recentActivitiesQuery.data, setRecentActivities, setLoading, setError]);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        statsQuery.refetch(),
        chartDataQuery.refetch(),
        recentActivitiesQuery.refetch(),
      ]);

      loadStats();
      loadChartData();
      loadRecentActivities();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ошибка обновления данных');
      }
    } finally {
      setLoading(false);
    }
  }, [
    statsQuery,
    chartDataQuery,
    recentActivitiesQuery,
    loadStats,
    loadChartData,
    loadRecentActivities,
    setLoading,
    setError,
  ]);

  return {
    stats,
    chartData,
    recentActivities,
    isLoading,
    error,
    loadStats,
    loadChartData,
    loadRecentActivities,
    refreshAll,
  };
};
