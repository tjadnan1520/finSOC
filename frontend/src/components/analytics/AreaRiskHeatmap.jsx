import './AreaRiskHeatmap.css';

const RISK_CONFIG = {
  HIGH: { label: 'High', color: 'var(--color-danger)', bg: 'rgba(234, 67, 53, 0.10)', border: 'rgba(234, 67, 53, 0.25)' },
  MEDIUM: { label: 'Medium', color: 'var(--color-warning)', bg: 'rgba(251, 188, 4, 0.12)', border: 'rgba(251, 188, 4, 0.3)' },
  LOW: { label: 'Low', color: 'var(--color-success)', bg: 'rgba(52, 168, 83, 0.10)', border: 'rgba(52, 168, 83, 0.25)' },
};

export default function AreaRiskHeatmap({ areas }) {
  const hasData = areas && areas.length > 0;

  if (!hasData) {
    return (
      <div className="heatmap-card">
        <h3 className="heatmap-title">Area Risk Overview</h3>
        <div className="heatmap-empty">No data available</div>
      </div>
    );
  }

  return (
    <div className="heatmap-card">
      <h3 className="heatmap-title">Area Risk Overview</h3>
      <div className="heatmap-grid">
        {areas.map((area) => {
          const level = (area.riskLevel || 'LOW').toUpperCase();
          const cfg = RISK_CONFIG[level] || RISK_CONFIG.LOW;
          return (
            <div
              key={area.name}
              className="heatmap-area-card"
              style={{
                background: cfg.bg,
                borderColor: cfg.border,
              }}
            >
              <div className="heatmap-area-header">
                <span className="heatmap-area-name">{area.name}</span>
                <span
                  className="heatmap-risk-badge"
                  style={{ background: cfg.color, color: '#fff' }}
                >
                  {cfg.label}
                </span>
              </div>
              <div className="heatmap-area-metrics">
                <div className="heatmap-metric">
                  <span className="heatmap-metric-label">Risk Score</span>
                  <span className="heatmap-metric-value" style={{ color: cfg.color }}>
                    {area.score ?? 0}
                  </span>
                </div>
                <div className="heatmap-metric">
                  <span className="heatmap-metric-label">Alerts</span>
                  <span className="heatmap-metric-value">{area.alertCount ?? 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
