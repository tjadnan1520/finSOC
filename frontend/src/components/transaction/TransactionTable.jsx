import { useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, RefreshCw, Calendar } from 'react-icons/fi';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatter';
import Loader from '../common/Loader';
import Button from '../common/Button';
import './TransactionTable.css';

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  } else if (current >= total - 3) {
    pages.push(1);
    pages.push('...');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('...');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  }
  return pages;
}

export default function TransactionTable({
  transactions = [],
  loading = false,
  pagination = { page: 1, limit: 20, total: 0, totalPages: 1 },
  onPageChange,
  onSearch,
  onFilter,
  onView,
}) {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    provider: '',
    dateFrom: '',
    dateTo: '',
  });

  const { page, totalPages } = pagination;

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch?.(value);
  }, [onSearch]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    onFilter?.({ ...filters, [name]: value });
  }, [filters, onFilter]);

  const handleRefresh = useCallback(() => {
    setSearchText('');
    setFilters({ type: '', status: '', provider: '', dateFrom: '', dateTo: '' });
    onSearch?.('');
    onFilter?.({ type: '', status: '', provider: '', dateFrom: '', dateTo: '' });
  }, [onSearch, onFilter]);

  return (
    <div className="transaction-table">
      <div className="transaction-table__toolbar">
        <div className="transaction-table__search">
          <Search size={16} className="transaction-table__search-icon" />
          <input
            type="text"
            className="transaction-table__search-input"
            placeholder="Search transactions..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>

        <div className="transaction-table__filters">
          <select name="type" className="transaction-table__filter" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="CASH_IN">Cash In</option>
            <option value="CASH_OUT">Cash Out</option>
          </select>

          <select name="status" className="transaction-table__filter" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select name="provider" className="transaction-table__filter" value={filters.provider} onChange={handleFilterChange}>
            <option value="">All Providers</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
          </select>

          <div className="transaction-table__date-filter">
            <Calendar size={14} />
            <input
              type="date"
              name="dateFrom"
              className="transaction-table__date-input"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
            <span className="transaction-table__date-sep">—</span>
            <input
              type="date"
              name="dateTo"
              className="transaction-table__date-input"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>

          <Button variant="ghost" size="sm" onClick={handleRefresh} title="Reset filters">
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      <div className="transaction-table__table-wrapper">
        {loading && <Loader overlay />}

        {!loading && transactions.length === 0 ? (
          <div className="transaction-table__empty">
            <p>No transactions found</p>
          </div>
        ) : (
          <table className="transaction-table__table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Date</th>
                <th>Provider</th>
                <th>Agent</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="transaction-table__ref">{tx.referenceNumber || '—'}</td>
                  <td>{formatDate(tx.createdAt)}</td>
                  <td>{tx.provider}</td>
                  <td>{tx.agent}</td>
                  <td>
                    <span className={`transaction-table__type transaction-table__type--${(tx.type || '').toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="transaction-table__amount">{formatCurrency(tx.amount)}</td>
                  <td>
                    <span
                      className="transaction-table__status"
                      style={{ '--status-color': getStatusColor(tx.status) }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="transaction-table__view-btn"
                      onClick={() => onView?.(tx.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="transaction-table__pagination">
          <button
            className="transaction-table__page-btn"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers(page, totalPages).map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="transaction-table__ellipsis">...</span>
            ) : (
              <button
                key={p}
                className={`transaction-table__page-btn ${p === page ? 'transaction-table__page-btn--active' : ''}`}
                onClick={() => onPageChange?.(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="transaction-table__page-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            <ChevronRight size={16} />
          </button>

          <span className="transaction-table__page-info">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
