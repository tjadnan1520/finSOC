import { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiSearch, FiDollarSign, FiActivity, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import useProviders from '../hooks/useProviders';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import './Providers.css';

function getHealthIcon(health) {
  switch ((health || '').toLowerCase()) {
    case 'healthy': return <FiCheckCircle size={16} />;
    case 'degraded': return <FiAlertTriangle size={16} />;
    case 'down': return <FiXCircle size={16} />;
    default: return <FiActivity size={16} />;
  }
}

function getHealthColor(health) {
  switch ((health || '').toLowerCase()) {
    case 'healthy': return 'var(--color-success)';
    case 'degraded': return 'var(--color-warning)';
    case 'down': return 'var(--color-danger)';
    default: return 'var(--color-text-secondary)';
  }
}

export default function Providers() {
  const { role } = useAuth();
  const { providers, balances, loading, error, refresh } = useProviders();
  const [search, setSearch] = useState('');

  const filteredProviders = providers.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q)
    );
  });

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  if (loading && !providers.length) {
    return (
      <div className="providers-page">
        <Loader overlay />
      </div>
    );
  }

  return (
    <div className="providers-page">
      <div className="providers-header">
        <div className="providers-header-left">
          <h1 className="providers-title">Providers</h1>
          <span className="providers-count">{providers.length} providers</span>
        </div>
        <div className="providers-header-right">
          <Button variant="ghost" size="sm" onClick={handleRefresh} loading={loading}>
            <FiRefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="providers-error-banner">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>Retry</Button>
        </div>
      )}

      <div className="providers-search-bar">
        <div className="providers-search-input">
          <FiSearch size={16} className="providers-search-icon" />
          <Input
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="providers-grid">
        {filteredProviders.length === 0 && (
          <div className="providers-empty">
            <FiActivity size={40} />
            <p>No providers found</p>
            <span>Try adjusting your search criteria</span>
          </div>
        )}
        {filteredProviders.map((provider) => {
          const bal = balances.find((b) => b.providerId === provider.id || b.provider === provider.name);
          const balance = bal?.balance ?? provider.balance ?? 0;
          const health = provider.health || 'Unknown';

          return (
            <div key={provider.id || provider.name} className="provider-card">
              <div className="provider-card-header">
                <div className="provider-card-avatar">
                  {provider.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="provider-card-header-info">
                  <h3 className="provider-card-name">{provider.name}</h3>
                  <span className="provider-card-code">{provider.code || provider.id}</span>
                </div>
                <div
                  className="provider-card-health"
                  style={{ color: getHealthColor(health) }}
                  title={`Health: ${health}`}
                >
                  {getHealthIcon(health)}
                </div>
              </div>

              <div className="provider-card-body">
                <div className="provider-card-stat">
                  <FiDollarSign size={14} />
                  <div className="provider-card-stat-info">
                    <span className="provider-card-stat-label">Current Balance</span>
                    <span className="provider-card-stat-value">
                      ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="provider-card-stat">
                  <FiActivity size={14} />
                  <div className="provider-card-stat-info">
                    <span className="provider-card-stat-label">Today's Transactions</span>
                    <span className="provider-card-stat-value">
                      {provider.todayTransactions?.toLocaleString() ?? provider.transactions?.toLocaleString() ?? '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="provider-card-footer">
                <span className="provider-card-status">
                  <span
                    className="provider-card-status-dot"
                    style={{ backgroundColor: getHealthColor(health) }}
                  />
                  {health}
                </span>
                <span className="provider-card-balance-label">
                  Status: {provider.status || 'Active'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
