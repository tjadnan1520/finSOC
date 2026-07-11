import { useState, useCallback } from 'react';
import caseService from '../services/case.service';

const DEFAULT_PAGINATION = { page: 1, limit: 20, total: 0, pages: 0 };

export default function useCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [summary, setSummary] = useState(null);

  const loadCases = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await caseService.getCases(params);
      setCases(data.cases || data.data || data);
      setPagination(data.pagination || data.meta || DEFAULT_PAGINATION);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load cases');
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    try {
      const { data } = await caseService.getCaseSummary();
      setSummary(data);
    } catch {
      setSummary(null);
    }
  }, []);

  const getCaseDetails = useCallback(async (id) => {
    const { data } = await caseService.getCaseById(id);
    return data;
  }, []);

  const assignCase = useCallback(async (caseId, operatorId) => {
    const { data } = await caseService.assignCase({ caseId, operatorId });
    setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, ...data } : c)));
    return data;
  }, []);

  const acceptCase = useCallback(async (caseId) => {
    const { data } = await caseService.acceptCase(caseId);
    setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, ...data } : c)));
    return data;
  }, []);

  const resolveCase = useCallback(async (id) => {
    const { data } = await caseService.resolveCase(id);
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    return data;
  }, []);

  const closeCase = useCallback(async (id) => {
    const { data } = await caseService.closeCase(id);
    setCases((prev) => prev.filter((c) => c.id !== id));
    return data;
  }, []);

  const addNote = useCallback(async (caseId, content) => {
    const { data } = await caseService.addCaseNote(caseId, content);
    return data;
  }, []);

  const refresh = useCallback(async () => {
    await loadCases({ page: pagination.page, limit: pagination.limit });
    await loadSummary();
  }, [loadCases, loadSummary, pagination.page, pagination.limit]);

  return {
    cases,
    loading,
    error,
    pagination,
    summary,
    loadCases,
    loadSummary,
    getCaseDetails,
    assignCase,
    acceptCase,
    resolveCase,
    closeCase,
    addNote,
    refresh,
  };
}
