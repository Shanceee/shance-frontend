// Экспорт типов
export type {
  DashboardStats,
  ChartData,
  RecentActivity,
  DashboardState,
} from './types';

// Экспорт API
export { dashboardApi } from './api/dashboardApi';

// Экспорт хуков
export { useDashboard } from './hooks/useDashboard';
