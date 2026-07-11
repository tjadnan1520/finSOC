import { useState, useCallback } from 'react';
import analyticsService from '../services/analytics.service';

export default function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOverview = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await analyticsService.getOverview(params);
      setAnalytics(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load analytics overview');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadKPIs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await analyticsService.getKPIs(params);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load KPIs');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadForecast = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await analyticsService.getForecast();
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load forecast');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRisk = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await analyticsService.getRisk(params);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load risk data');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadOverview();
  }, [loadOverview]);

  return {
    analytics,
    loading,
    error,
    loadOverview,
    loadKPIs,
    loadForecast,
    loadRisk,
    refresh,
  };
}
