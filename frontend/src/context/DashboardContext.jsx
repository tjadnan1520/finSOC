import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboard.service';
import { useAuth } from './AuthContext';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await dashboardService.getDashboard();
      setDashboard(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshDashboard();
  }, [isAuthenticated, refreshDashboard]);



  const value = {
    dashboard,
    loading,
    error,
    lastUpdated,
    refreshDashboard,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within a DashboardProvider');
  return ctx;
}

export default DashboardContext;
