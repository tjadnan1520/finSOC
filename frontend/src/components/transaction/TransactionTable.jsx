import { useState, useCallback } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatCurrency, formatDateTime } from '../../utils/formatter';
import Loader from '../common/Loader';
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
}) {
  const [searchText, setSearchText] = useState('');

  const { page, totalPages } = pagination;

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch?.(value);
  }, [onSearch]);

  return (
    <div className="transaction-table">
      <div className="transaction-table__toolbar">
        <div className="transaction-table__search">
          <FiSearch size={16} className="transaction-table__search-icon" />
          <input
            type="text"
            className="transaction-table__search-input"
            placeholder="Search transactions..."
            value={searchText}
            onChange={handleSearch}
          />
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
                <th>Phone</th>
                <th>Provider</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="transaction-table__ref">{tx.phoneNumber || tx.referenceNumber || '—'}</td>
                  <td>{tx.provider?.name || '—'}</td>
                  <td>
                    <span className={`transaction-table__type transaction-table__type--${(tx.type || '').toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="transaction-table__amount">{formatCurrency(tx.amount)}</td>
                  <td className="transaction-table__time">{formatDateTime(tx.createdAt)}</td>
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
            <FiChevronLeft size={16} />
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
            <FiChevronRight size={16} />
          </button>

          <span className="transaction-table__page-info">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
