import { formatCurrency } from '../../utils/formatter';
import './LiquidityOverview.css';

export default function LiquidityOverview({ data }) {
  if (!data) {
    return (
      <div className="liquidity-overview">
        <p className="liquidity-overview__empty">No liquidity data available</p>
      </div>
    );
  }

  const { physicalCash, providerBalances = [], liquidityScore, status } = data;
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (liquidityScore || 0) / 100 * circumference;
  const normalizedScore = Math.min(100, Math.max(0, liquidityScore || 0));

  const statusClass = `liquidity-status--${(status || 'HEALTHY').toLowerCase()}`;

  return (
    <div className="liquidity-overview">
      <h3 className="liquidity-overview__title">Liquidity Overview</h3>

      <div className="liquidity-overview__body">
        <div className="liquidity-overview__score">
          <svg className="liquidity-progress" width="104" height="104" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-border)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="liquidity-progress__text">
              {normalizedScore}%
            </text>
          </svg>
        </div>

        <div className="liquidity-overview__details">
          <div className="liquidity-overview__item">
            <span className="liquidity-overview__label">Physical Cash</span>
            <span className="liquidity-overview__amount">{formatCurrency(physicalCash)}</span>
          </div>

          <div className="liquidity-overview__providers">
            <span className="liquidity-overview__label">Provider Balances</span>
            {providerBalances.map((p, i) => (
              <div key={i} className="liquidity-overview__provider">
                <span className="liquidity-overview__provider-dot" />
                <span className="liquidity-overview__provider-name">{p.name}</span>
                <span className="liquidity-overview__provider-balance">{formatCurrency(p.balance)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`liquidity-status ${statusClass}`}>
          {status || 'HEALTHY'}
        </div>
      </div>
    </div>
  );
}
