import './SummaryCards.css';

export default function SummaryCards({ cards = [] }) {
  if (!cards.length) {
    return (
      <div className="summary-cards">
        <p className="summary-cards__empty">No metrics available</p>
      </div>
    );
  }

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div key={index} className="summary-card" style={{ '--card-color': card.color || 'var(--color-primary)' }}>
          <div className="summary-card__icon">
            {card.icon}
          </div>
          <div className="summary-card__info">
            <span className="summary-card__title">{card.title}</span>
            <span className="summary-card__value">{card.value}</span>
            {card.trend !== undefined && (
              <span className={`summary-card__trend summary-card__trend--${card.trendDirection || 'up'}`}>
                {card.trendDirection === 'up' ? '\u2191' : '\u2193'} {card.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
