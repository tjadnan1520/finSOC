import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiDollarSign, FiTrendingUp, FiTrendingDown, FiBriefcase } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import useTransactions from '../hooks/useTransactions';
import { ROLES } from '../utils/constants';
import { getCurrentDate, getCurrentTime } from '../utils/dateTime';
import { formatCurrency } from '../utils/formatter';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import CashInForm from '../components/transaction/CashInForm';
import CashOutForm from '../components/transaction/CashOutForm';
import TransactionTable from '../components/transaction/TransactionTable';
import './Transactions.css';

export default function Transactions() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const {
    transactions, loading, error, pagination, todaySummary,
    loadTransactions, loadTodaySummary, cashIn, cashOut, refresh,
  } = useTransactions();

  const [activeForm, setActiveForm] = useState('cashIn');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
    loadTodaySummary();
  }, [loadTransactions, loadTodaySummary]);

  const handleRefresh = () => {
    refresh();
    loadTodaySummary();
  };

  const handlePageChange = (page) => {
    loadTransactions({ page, limit: pagination?.limit || 20 });
  };

  const handleSearch = (searchText) => {
    loadTransactions({ search: searchText, page: 1, limit: pagination?.limit || 20 });
  };

  const handleFilter = (filters) => {
    loadTransactions({ ...filters, page: 1, limit: pagination?.limit || 20 });
  };

  const handleView = (txId) => {
    navigate(`/transactions/${txId}`);
  };

  const handleCashIn = async (payload) => {
    setFormLoading(true);
    try {
      await cashIn(payload);
      await refresh();
      await loadTodaySummary();
    } finally {
      setFormLoading(false);
    }
  };

  const handleCashOut = async (payload) => {
    setFormLoading(true);
    try {
      await cashOut(payload);
      await refresh();
      await loadTodaySummary();
    } finally {
      setFormLoading(false);
    }
  };

  const isAgent = role === ROLES.AGENT;

  return (
    <div className="transactions">
      <div className="transactions__header">
        <div className="transactions__header-left">
          <h1 className="transactions__title">Transactions</h1>
          <p className="transactions__date">{getCurrentDate()} — {getCurrentTime()}</p>
        </div>
        <div className="transactions__header-right">
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
            <FiRefreshCw size={16} className={loading ? 'transactions__spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="transactions__error">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>Retry</Button>
        </div>
      )}

      {todaySummary && (
        <div className="transactions__summary">
          <div className="transactions__summary-card">
            <div className="transactions__summary-icon" style={{ background: '#e8f0fe', color: 'var(--color-primary)' }}>
              <FiDollarSign size={20} />
            </div>
            <div className="transactions__summary-info">
              <span className="transactions__summary-value">{formatCurrency(todaySummary.todayCashIn || 0)}</span>
              <span className="transactions__summary-label">Cash In Today</span>
            </div>
          </div>
          <div className="transactions__summary-card">
            <div className="transactions__summary-icon" style={{ background: '#fef3e2', color: 'var(--color-warning)' }}>
              <FiTrendingUp size={20} />
            </div>
            <div className="transactions__summary-info">
              <span className="transactions__summary-value">{formatCurrency(todaySummary.todayCashOut || 0)}</span>
              <span className="transactions__summary-label">Cash Out Today</span>
            </div>
          </div>
          <div className="transactions__summary-card">
            <div className="transactions__summary-icon" style={{ background: '#e8f5e9', color: 'var(--color-success)' }}>
              <FiBriefcase size={20} />
            </div>
            <div className="transactions__summary-info">
              <span className="transactions__summary-value">{todaySummary.todayCount ?? '—'}</span>
              <span className="transactions__summary-label">Transactions Today</span>
            </div>
          </div>
          <div className="transactions__summary-card">
            <div className="transactions__summary-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
              <FiTrendingDown size={20} />
            </div>
            <div className="transactions__summary-info">
              <span className="transactions__summary-value">{formatCurrency(todaySummary.physicalCash || 0)}</span>
              <span className="transactions__summary-label">Physical Cash</span>
            </div>
          </div>
        </div>
      )}

      {isAgent && (
        <div className="transactions__forms">
          <div className="transactions__forms-toggle">
            <Button
              variant={activeForm === 'cashIn' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveForm('cashIn')}
            >
              Cash In
            </Button>
            <Button
              variant={activeForm === 'cashOut' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveForm('cashOut')}
            >
              Cash Out
            </Button>
          </div>
          <div className="transactions__form-card">
            {activeForm === 'cashIn' ? (
              <CashInForm onSubmit={handleCashIn} loading={formLoading} />
            ) : (
              <CashOutForm onSubmit={handleCashOut} loading={formLoading} />
            )}
          </div>
        </div>
      )}

      <div className="transactions__table-section">
        <h2 className="transactions__table-title">
          {isAgent ? 'My Transactions' : 'All Transactions'}
        </h2>
        <TransactionTable
          transactions={transactions}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onView={handleView}
        />
      </div>
    </div>
  );
}
