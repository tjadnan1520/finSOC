import api from './api';

export const getCases = (params) => api.get('/cases', { params });

export const getCaseById = (id) => api.get(`/cases/${id}`);

export const assignCase = (data) => api.patch('/cases/assign', data);

export const acceptCase = (id) => api.patch(`/cases/${id}/accept`);

export const resolveCase = (id) => api.patch(`/cases/${id}/resolve`);

export const closeCase = (id) => api.patch(`/cases/${id}/close`);

export const addCaseNote = (id, content) => api.post(`/cases/${id}/notes`, { content });

export const getCaseSummary = () => api.get('/cases/summary');

export default { getCases, getCaseById, assignCase, acceptCase, resolveCase, closeCase, addCaseNote, getCaseSummary };
