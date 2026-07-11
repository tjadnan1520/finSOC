import { formatCurrency } from '../../utils/formatter';
import './ProviderBalance.css';

export default function ProviderBalance({ providers = [] }) {
  if (!providers.length) {
    return (
      <div className="provider-balance">
        <p className="provider-balance__empty">No provider data available</p>
      </div>
    );
  }

  return (
    <div className="provider-balance">
      {providers.map((provider, i) => {
        const statusClass = `provider-card__status--${(provider.status || 'active').toLowerCase()}`;
        const trendUp = provider.trend !== undefined && provider.trend >= 0;

        return (
          <div key={provider.code || i} className="provider-card">
            <div className="provider-card__header">
              <div className="provider-card__logo">
                {provider.name?.charAt(0) || '?'}
              </div>
              <span className="provider-card__name">{provider.name}</span>
            </div>

            <div className="provider-card__balance">
              {formatCurrency(provider.currentBalance)}
            </div>

            <div className="provider-card__footer">
              <span className={`provider-card__status-dot ${statusClass}`} />
              {provider.trend !== undefined && (
                <span className={`provider-card__trend ${trendUp ? 'provider-card__trend--up' : 'provider-card__trend--down'}`}>
                  {trendUp ? '\u2191' : '\u2193'} {Math.abs(provider.trend).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
