import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import useAlerts from '../hooks/useAlerts';
import { getCurrentDate } from '../utils/dateTime';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import AlertTable from '../components/alerts/AlertTable';
import { ALERT_SEVERITIES, ALERT_STATUSES } from '../utils/constants';
import './Alerts.css';

export default function Alerts() {
  const navigate = useNavigate();
  const {
    alerts, loading, error, pagination,
    loadAlerts, refresh,
  } = useAlerts();

  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handlePageChange = useCallback((page) => {
    loadAlerts({
      page,
      severity: severityFilter || undefined,
      status: statusFilter || undefined,
      search: searchText || undefined,
    });
  }, [loadAlerts, severityFilter, statusFilter, searchText]);

  const handleFilterApply = useCallback(() => {
    loadAlerts({
      page: 1,
      severity: severityFilter || undefined,
      status: statusFilter || undefined,
      search: searchText || undefined,
    });
  }, [loadAlerts, severityFilter, statusFilter, searchText]);

  const handleViewAlert = useCallback((alert) => {
    navigate(`/alerts/${alert.id}`);
  }, [navigate]);

  return (
    <div className="alerts">
      <div className="alerts__header">
        <div className="alerts__header-left">
          <h1 className="alerts__title">Alerts</h1>
          <p className="alerts__date">{getCurrentDate()}</p>
        </div>
        <div className="alerts__header-right">
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
            <FiRefreshCw size={16} className={loading ? 'alerts__spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="alerts__error">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>Retry</Button>
        </div>
      )}

      <div className="alerts__filters">
        <div className="alerts__filters-search">
          <FiSearch size={16} className="alerts__filters-search-icon" />
          <Input
            placeholder="Search alerts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          options={[
            { value: '', label: 'All Severities' },
            ...Object.values(ALERT_SEVERITIES).map((s) => ({ value: s, label: s })),
          ]}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            ...Object.values(ALERT_STATUSES).map((s) => ({ value: s, label: s })),
          ]}
        />
        <Button variant="primary" size="sm" onClick={handleFilterApply}>
          Apply Filters
        </Button>
      </div>

      <div className="alerts__table-section">
        <AlertTable
          alerts={alerts}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewAlert}
        />
      </div>
    </div>
  );
}
