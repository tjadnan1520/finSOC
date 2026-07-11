import './AIRecommendation.css';

export default function AIRecommendation({ recommendation }) {
  if (!recommendation) {
    return (
      <div className="ai-recommendation">
        <div className="ai-recommendation__header">
          <span className="ai-recommendation__badge">AI</span>
          <h3 className="ai-recommendation__title">AI Recommendation</h3>
        </div>
        <p className="ai-recommendation__empty">No recommendation available</p>
      </div>
    );
  }

  const { summary, reason, recommendation: rec, confidence, uncertainty } = recommendation;
  const normalizedConfidence = Math.min(100, Math.max(0, confidence || 0));

  return (
    <div className="ai-recommendation">
      <div className="ai-recommendation__header">
        <span className="ai-recommendation__badge">AI</span>
        <h3 className="ai-recommendation__title">AI Recommendation</h3>
      </div>

      {summary && <p className="ai-recommendation__summary">{summary}</p>}

      {reason && (
        <div className="ai-recommendation__section">
          <h4 className="ai-recommendation__section-title">Reason</h4>
          <p className="ai-recommendation__text">{reason}</p>
        </div>
      )}

      {rec && (
        <div className="ai-recommendation__highlight">
          <h4 className="ai-recommendation__section-title">Recommendation</h4>
          <p className="ai-recommendation__text">{rec}</p>
        </div>
      )}

      <div className="ai-recommendation__confidence">
        <div className="ai-recommendation__confidence-header">
          <span className="ai-recommendation__confidence-label">Confidence</span>
          <span className="ai-recommendation__confidence-value">{normalizedConfidence}%</span>
        </div>
        <div className="ai-recommendation__confidence-bar">
          <div
            className="ai-recommendation__confidence-fill"
            style={{ width: `${normalizedConfidence}%` }}
          />
        </div>
      </div>

      {uncertainty && (
        <div className="ai-recommendation__uncertainty">
          <span className="ai-recommendation__uncertainty-icon">&#9432;</span>
          <span>{uncertainty}</span>
        </div>
      )}
    </div>
  );
}
