export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
}

export interface RecentActivity {
  id: string;
  type: 'project_created' | 'project_completed' | 'payment_received';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
}

export interface DashboardState {
  stats: DashboardStats | null;
  chartData: ChartData | null;
  recentActivities: RecentActivity[];
  isLoading: boolean;
  error: string | null;
}
