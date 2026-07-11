import './AlertCard.css';

export default function AlertCard({ cards = [] }) {
  if (!cards.length) return null;

  return (
    <div className="alert-card-grid">
      {cards.map((card, index) => (
        <div key={index} className="alert-card-item">
          <div className="alert-card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
            {card.icon}
          </div>
          <div className="alert-card-content">
            <span className="alert-card-value">{card.value}</span>
            <span className="alert-card-title">{card.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
