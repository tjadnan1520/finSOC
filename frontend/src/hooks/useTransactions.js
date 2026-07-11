import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transaction.service';

const DEFAULT_PAGINATION = { page: 1, limit: 20, total: 0, pages: 0 };

export default function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [todaySummary, setTodaySummary] = useState(null);

  const loadTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await transactionService.getTransactions(params);
      setTransactions(data.transactions || data.data || data);
      setPagination(data.pagination || data.meta || DEFAULT_PAGINATION);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTodaySummary = useCallback(async () => {
    try {
      const { data } = await transactionService.getTodaySummary();
      setTodaySummary(data);
    } catch {
      setTodaySummary(null);
    }
  }, []);

  const cashIn = useCallback(async (payload) => {
    const { data } = await transactionService.cashIn(payload);
    return data;
  }, []);

  const cashOut = useCallback(async (payload) => {
    const { data } = await transactionService.cashOut(payload);
    return data;
  }, []);

  const refresh = useCallback(async () => {
    await loadTransactions({ page: pagination.page, limit: pagination.limit });
  }, [loadTransactions, pagination.page, pagination.limit]);

  return {
    transactions,
    loading,
    error,
    pagination,
    todaySummary,
    loadTransactions,
    loadTodaySummary,
    cashIn,
    cashOut,
    refresh,
  };
}
