import api from './api';

export const getDashboard = () => api.get('/dashboard');

export const getDashboardSummary = () => api.get('/dashboard/summary');

export const getDashboardKPIs = () => api.get('/dashboard/kpis');

export const getLiquidity = () => api.get('/dashboard/liquidity');
