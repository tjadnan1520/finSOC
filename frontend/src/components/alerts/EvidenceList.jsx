import { formatDateTime } from '../../utils/formatter';
import './EvidenceList.css';

export default function EvidenceList({ evidence = [] }) {
  if (!evidence.length) {
    return (
      <div className="evidence-empty">
        <p>No evidence available</p>
      </div>
    );
  }

  return (
    <div className="evidence-list">
      {evidence.map((item) => (
        <div key={item.id} className="evidence-card">
          <div className="evidence-header">
            <h4 className="evidence-title">{item.title}</h4>
            <span className="evidence-source">{item.source}</span>
          </div>
          <p className="evidence-description">{item.description}</p>
          <div className="evidence-footer">
            <span className="evidence-value">{item.value}</span>
            <span className="evidence-timestamp">{formatDateTime(item.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
