import { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiAlertCircle, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { format } from 'date-fns';
import useAuth from '../hooks/useAuth';
import useCases from '../hooks/useCases';
import CaseTable from '../components/cases/CaseTable';
import SummaryCards from '../components/dashboard/SummaryCards';
import AlertCard from '../components/alerts/AlertCard';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { CASE_STATUSES, CASE_PRIORITIES } from '../utils/constants';
import './Cases.css';

function formatDate(date) {
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return '';
  }
}

export default function Cases() {
  const { role } = useAuth();
  const {
    cases,
    loading,
    error,
    pagination,
    summary,
    loadCases,
    loadSummary,
    refresh,
  } = useCases();

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadCases({});
    loadSummary();
  }, [loadCases, loadSummary]);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handlePageChange = useCallback(
    (page) => {
      loadCases({ page, status: statusFilter || undefined, priority: priorityFilter || undefined, search: searchText || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
    },
    [loadCases, statusFilter, priorityFilter, searchText, dateFrom, dateTo]
  );

  const handleFilter = useCallback(() => {
    loadCases({ status: statusFilter || undefined, priority: priorityFilter || undefined, search: searchText || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
  }, [loadCases, statusFilter, priorityFilter, searchText, dateFrom, dateTo]);

  const summaryCards = [
    { title: 'Open Cases', value: summary?.open ?? 0, icon: <FiAlertCircle size={20} />, color: 'var(--color-primary)', trendDirection: 'up', trend: summary?.openTrend ?? 0 },
    { title: 'Assigned Cases', value: summary?.assigned ?? 0, icon: <FiClock size={20} />, color: 'var(--color-warning)', trendDirection: 'up', trend: summary?.assignedTrend ?? 0 },
    { title: 'Escalated Cases', value: summary?.escalated ?? 0, icon: <FiTrendingUp size={20} />, color: 'var(--color-danger)', trendDirection: 'down', trend: summary?.escalatedTrend ?? 0 },
    { title: 'Resolved Today', value: summary?.resolvedToday ?? 0, icon: <FiCheckCircle size={20} />, color: 'var(--color-success)', trendDirection: 'up', trend: summary?.resolvedTrend ?? 0 },
  ];

  const alertCards = [
    { title: 'Open Cases', value: summary?.open ?? 0, icon: <FiAlertCircle size={20} />, color: 'var(--color-primary)' },
    { title: 'Assigned', value: summary?.assigned ?? 0, icon: <FiClock size={20} />, color: 'var(--color-warning)' },
    { title: 'Escalated', value: summary?.escalated ?? 0, icon: <FiTrendingUp size={20} />, color: 'var(--color-danger)' },
    { title: 'Resolved Today', value: summary?.resolvedToday ?? 0, icon: <FiCheckCircle size={20} />, color: 'var(--color-success)' },
  ];

  if (loading && !cases.length) {
    return (
      <div className="cases-page">
        <Loader overlay />
      </div>
    );
  }

  return (
    <div className="cases-page">
      <div className="cases-page-header">
        <div className="cases-page-header-left">
          <h1 className="cases-page-title">Cases</h1>
          <span className="cases-page-date">{formatDate(new Date())}</span>
        </div>
        <div className="cases-page-header-right">
          <Button variant="ghost" size="sm" onClick={handleRefresh} loading={loading}>
            <FiRefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      <div className="cases-summary-row">
        <AlertCard cards={alertCards} />
      </div>

      <div className="cases-filter-bar">
        <div className="cases-filter-group">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="All Statuses"
            options={Object.values(CASE_STATUSES).map((s) => ({ value: s, label: s }))}
          />
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            placeholder="All Priorities"
            options={Object.values(CASE_PRIORITIES).map((p) => ({ value: p, label: p }))}
          />
          <Input
            placeholder="Search cases..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To"
          />
          <Button variant="primary" size="sm" onClick={handleFilter}>
            Filter
          </Button>
        </div>
      </div>

      {error && (
        <div className="cases-error-banner">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>Retry</Button>
        </div>
      )}

      <div className="cases-table-section">
        <CaseTable
          cases={cases}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={(c) => window.location.href = `/cases/${c.id}`}
        />
      </div>
    </div>
  );
}
