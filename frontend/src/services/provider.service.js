import api from './api';

export const getProviders = () => api.get('/providers');

export const getProviderById = (id) => api.get(`/providers/${id}`);

export const getProviderBalances = () => api.get('/providers/balances');

export const getProviderStatistics = (id) => api.get(`/providers/statistics/${id}`);

export const getProviderPerformance = () => api.get('/providers/performance');

export default { getProviders, getProviderById, getProviderBalances, getProviderStatistics, getProviderPerformance };
