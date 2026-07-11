import { useState, useMemo } from 'react';
import { FiSearch, FiEye, FiChevronLeft, FiChevronRight, FiFolder } from 'react-icons/fi';
import { formatRelativeTime, formatDate, getPriorityColor, getStatusColor } from '../../utils/formatter';
import { CASE_PRIORITIES, CASE_STATUSES, PROVIDERS } from '../../utils/constants';
import Loader from '../common/Loader';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import './CaseTable.css';

const PAGE_SIZE = 15;

export default function CaseTable({ cases = [], loading, pagination, onPageChange, onView }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchSearch = !search ||
        c.id?.toLowerCase().includes(search.toLowerCase()) ||
        c.alertId?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || c.status === statusFilter;
      const matchPriority = !priorityFilter || c.priority === priorityFilter;
      const matchProvider = !providerFilter || c.provider?.name === providerFilter || c.alert?.transaction?.provider?.name === providerFilter;
      return matchSearch && matchStatus && matchPriority && matchProvider;
    });
  }, [cases, search, statusFilter, priorityFilter, providerFilter]);

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const pageData = filtered.slice(pageStart, pageEnd);

  if (loading) {
    return (
      <div className="case-table-wrapper">
        <div className="case-table-loader"><Loader /></div>
      </div>
    );
  }

  return (
    <div className="case-table-wrapper">
      <div className="case-table-filters">
        <div className="case-table-search">
          <FiSearch className="case-table-search-icon" />
          <Input
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            ...Object.values(CASE_STATUSES).map((s) => ({ value: s, label: s })),
          ]}
        />
        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          options={[
            { value: '', label: 'All Priorities' },
            ...Object.values(CASE_PRIORITIES).map((p) => ({ value: p, label: p })),
          ]}
        />
        <Select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          options={[
            { value: '', label: 'All Providers' },
            ...Object.values(PROVIDERS).map((p) => ({ value: p, label: p })),
          ]}
        />
      </div>

      {!filtered.length ? (
        <div className="case-table-empty">
          <FiFolder size={40} />
          <p>No cases found</p>
          <span>Try adjusting your search or filter criteria</span>
        </div>
      ) : (
        <>
          <div className="case-table-container">
            <table className="case-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Alert ID</th>
                  <th>Provider</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((c, idx) => (
                  <tr key={c.id} className="case-table-row">
                    <td className="case-table-id">{pageStart + idx + 1}</td>
                    <td className="case-table-alert-id">{c.alertId?.length > 8 ? `#${c.alertId.slice(0, 8).toUpperCase()}` : c.alertId || '—'}</td>
                    <td>{c.provider?.name || c.alert?.transaction?.provider?.name || '—'}</td>
                    <td>
                      <span
                        className="case-priority-badge"
                        style={{ backgroundColor: `${getPriorityColor(c.priority)}18`, color: getPriorityColor(c.priority) }}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td>{c.assignedTo?.name || 'Unassigned'}</td>
                    <td>
                      <span
                        className="case-status-badge"
                        style={{ backgroundColor: `${getStatusColor(c.status)}18`, color: getStatusColor(c.status) }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="case-table-time">{formatRelativeTime(c.updatedAt)}</td>
                    <td className="case-table-date">{formatDate(c.createdAt)}</td>
                    <td>
                      <Button variant="ghost" size="sm" onClick={() => onView?.(c)}>
                        <FiEye size={14} /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="case-table-pagination">
            <span className="case-table-page-info">
              Showing {pageStart + 1}–{Math.min(pageEnd, filtered.length)} of {filtered.length}
            </span>
            <div className="case-table-page-controls">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange?.(currentPage - 1)}
              >
                <FiChevronLeft size={16} />
              </Button>
              <span className="case-table-page-number">{currentPage} / {totalPages}</span>
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
