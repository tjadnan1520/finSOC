import api from './api';

export const getOverview = (params) => api.get('/analytics/overview', { params });

export const getKPIs = (params) => api.get('/analytics/kpis', { params });

export const getForecast = () => api.get('/analytics/forecast');

export const getRisk = (params) => api.get('/analytics/risk', { params });

export const getProviderAnalytics = () => api.get('/analytics/providers');

export const getLiquidityTrend = (params) => api.get('/analytics/liquidity', { params });

export const getPerformanceMetrics = () => api.get('/analytics/performance');
