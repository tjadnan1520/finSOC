import api from './api';

export const getAlerts = (params) => api.get('/alerts', { params });

export const getAlertById = (id) => api.get(`/alerts/${id}`);

export const assignAlert = (data) => api.patch('/alerts/assign', data);

export const resolveAlert = (id) => api.patch(`/alerts/${id}/resolve`);

export const closeAlert = (id) => api.patch(`/alerts/${id}/close`);

export const getAlertSummary = () => api.get('/alerts/summary');
