import api from './api';

export const cashIn = (data) => api.post('/transactions/cash-in', data);

export const cashOut = (data) => api.post('/transactions/cash-out', data);

export const getTransactions = (params) => api.get('/transactions', { params });

export const getTransactionById = (id) => api.get(`/transactions/${id}`);

export const getTodaySummary = () => api.get('/transactions/today-summary');

export default { cashIn, cashOut, getTransactions, getTransactionById, getTodaySummary };
