import { useDashboardContext } from '../context/DashboardContext';

export default function useDashboard() {
  const { dashboard, loading, error, lastUpdated, refreshDashboard } = useDashboardContext();

  return { dashboard, loading, error, lastUpdated, refresh: refreshDashboard };
}
