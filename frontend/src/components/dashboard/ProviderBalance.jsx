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
      {providers.map((item, i) => {
        const provider = item.provider || item;
        const statusClass = `provider-card__status--${(provider.status || 'active').toLowerCase()}`;
        const trendUp = item.trend !== undefined && item.trend >= 0;

        return (
          <div key={provider.code || provider.id || i} className="provider-card">
            <div className="provider-card__header">
              <div className="provider-card__logo">
                {provider.name?.charAt(0) || '?'}
              </div>
              <span className="provider-card__name">{provider.name}</span>
            </div>

            <div className="provider-card__balance">
              {formatCurrency(item.currentBalance)}
            </div>

            <div className="provider-card__footer">
              <span className={`provider-card__status-dot ${statusClass}`} />
              {item.trend !== undefined && (
                <span className={`provider-card__trend ${trendUp ? 'provider-card__trend--up' : 'provider-card__trend--down'}`}>
                  {trendUp ? '\u2191' : '\u2193'} {Math.abs(item.trend).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
