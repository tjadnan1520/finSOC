import { useState, useCallback } from 'react';
import alertService from '../services/alert.service';

const DEFAULT_PAGINATION = { page: 1, limit: 20, total: 0, pages: 0 };

export default function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [summary, setSummary] = useState(null);

  const loadAlerts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await alertService.getAlerts(params);
      setAlerts(data.alerts || data.data || data);
      setPagination(data.pagination || data.meta || DEFAULT_PAGINATION);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load alerts');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    try {
      const { data } = await alertService.getAlertSummary();
      setSummary(data);
    } catch {
      setSummary(null);
    }
  }, []);

  const getAlertDetails = useCallback(async (id) => {
    const { data } = await alertService.getAlertById(id);
    return data;
  }, []);

  const assignAlert = useCallback(async (alertId, operatorId) => {
    const { data } = await alertService.assignAlert({ alertId, operatorId });
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, ...data } : a)));
    return data;
  }, []);

  const resolveAlert = useCallback(async (id) => {
    const { data } = await alertService.resolveAlert(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    return data;
  }, []);

  const closeAlert = useCallback(async (id) => {
    const { data } = await alertService.closeAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    return data;
  }, []);

  const refresh = useCallback(async () => {
    await loadAlerts({ page: pagination.page, limit: pagination.limit });
    await loadSummary();
  }, [loadAlerts, loadSummary, pagination.page, pagination.limit]);

  return {
    alerts,
    loading,
    error,
    pagination,
    summary,
    loadAlerts,
    loadSummary,
    getAlertDetails,
    assignAlert,
    resolveAlert,
    closeAlert,
    refresh,
  };
}
