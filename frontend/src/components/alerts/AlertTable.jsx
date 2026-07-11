import { useState, useMemo } from 'react';
import { FiSearch, FiEye, FiChevronLeft, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import { formatRelativeTime, getSeverityColor, getStatusColor } from '../../utils/formatter';
import { ALERT_SEVERITIES, ALERT_STATUSES, PROVIDERS } from '../../utils/constants';
import Loader from '../common/Loader';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import './AlertTable.css';

const PAGE_SIZE = 15;

export default function AlertTable({ alerts = [], loading, pagination, onPageChange, onView }) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch = !search || 
        a.id?.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.toLowerCase().includes(search.toLowerCase());
      const matchSeverity = !severityFilter || a.severity === severityFilter;
      const matchStatus = !statusFilter || a.status === statusFilter;
      const matchProvider = !providerFilter || a.provider === providerFilter;
      return matchSearch && matchSeverity && matchStatus && matchProvider;
    });
  }, [alerts, search, severityFilter, statusFilter, providerFilter]);

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const pageData = filtered.slice(pageStart, pageEnd);

  if (loading) {
    return (
      <div className="alert-table-wrapper">
        <div className="alert-table-loader"><Loader /></div>
      </div>
    );
  }

  return (
    <div className="alert-table-wrapper">
      <div className="alert-table-filters">
        <div className="alert-table-search">
          <FiSearch className="alert-table-search-icon" />
          <Input
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
          <option value="">All Severities</option>
          {Object.values(ALERT_SEVERITIES).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.values(ALERT_STATUSES).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
          <option value="">All Providers</option>
          {Object.values(PROVIDERS).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
      </div>

      {!filtered.length ? (
        <div className="alert-table-empty">
          <FiAlertTriangle size={40} />
          <p>No alerts found</p>
          <span>Try adjusting your search or filter criteria</span>
        </div>
      ) : (
        <>
          <div className="alert-table-container">
            <table className="alert-table">
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Severity</th>
                  <th>Category</th>
                  <th>Provider</th>
                  <th>Agent</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((alert) => (
                  <tr key={alert.id} className="alert-table-row">
                    <td className="alert-table-id">{alert.id}</td>
                    <td>
                      <span
                        className="alert-severity-badge"
                        style={{ backgroundColor: `${getSeverityColor(alert.severity)}18`, color: getSeverityColor(alert.severity) }}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td>{alert.category}</td>
                    <td>{alert.provider}</td>
                    <td>{alert.agent || '—'}</td>
                    <td>
                      <div className="alert-confidence">
                        <div className="alert-confidence-bar">
                          <div
                            className="alert-confidence-fill"
                            style={{ width: `${alert.confidence || 0}%` }}
                          />
                        </div>
                        <span>{alert.confidence ?? '—'}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="alert-status-badge"
                        style={{ backgroundColor: `${getStatusColor(alert.status)}18`, color: getStatusColor(alert.status) }}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="alert-table-time">{formatRelativeTime(alert.generatedAt)}</td>
                    <td>
                      <Button variant="ghost" size="sm" onClick={() => onView?.(alert)}>
                        <FiEye size={14} /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="alert-table-pagination">
            <span className="alert-table-page-info">
              Showing {pageStart + 1}–{Math.min(pageEnd, filtered.length)} of {filtered.length}
            </span>
            <div className="alert-table-page-controls">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange?.(currentPage - 1)}
              >
                <FiChevronLeft size={16} />
              </Button>
              <span className="alert-table-page-number">{currentPage} / {totalPages}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
              >
                <FiChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
