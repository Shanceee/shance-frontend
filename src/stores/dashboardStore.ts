import { create } from 'zustand';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
}

interface RecentActivity {
  id: string;
  type: 'project_created' | 'project_completed' | 'payment_received';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  chartData: ChartData | null;
  recentActivities: RecentActivity[];
  isLoading: boolean;
  error: string | null;
  setStats: (stats: DashboardStats) => void;
  setChartData: (chartData: ChartData) => void;
  setRecentActivities: (activities: RecentActivity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  stats: null,
  chartData: null,
  recentActivities: [],
  isLoading: false,
  error: null,
};

export const useDashboardStore = create<DashboardState>(set => ({
  ...initialState,

  setStats: stats => set({ stats }),
  setChartData: chartData => set({ chartData }),
  setRecentActivities: activities => set({ recentActivities: activities }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  reset: () => set(initialState),
}));
