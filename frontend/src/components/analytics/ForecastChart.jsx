import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';
import './ForecastChart.css';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="forecast-tooltip">
      <p className="forecast-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="forecast-tooltip-value" style={{ color: entry.color }}>
          {entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry.value}
        </p>
      ))}
    </div>
  );
}

function ConfidenceBadge({ confidence }) {
  const num = typeof confidence === 'number' ? confidence : (confidence ?? 0);
  const pct = Math.min(Math.max(num, 0), 100);
  const level = pct >= 80 ? 'high' : pct >= 50 ? 'medium' : 'low';
  return (
    <span className={`forecast-confidence forecast-confidence--${level}`}>
      {pct.toFixed(0)}% Confidence
    </span>
  );
}

export default function ForecastChart({ data }) {
  const predictions = data?.predictions;
  const confidence = data?.confidence;
  const hasData = predictions && predictions.length > 0;

  if (!hasData) {
    return (
      <div className="forecast-chart-card">
        <div className="forecast-chart-header">
          <h3 className="forecast-chart-title">Forecast</h3>
        </div>
        <div className="forecast-chart-empty">No data available</div>
      </div>
    );
  }

  const chartData = predictions.map((p) => ({
    timeframe: p.timeframe,
    expectedCash: p.expectedCash ?? 0,
    expectedProviderBalance: p.expectedProviderBalance ?? 0,
  }));

  return (
    <div className="forecast-chart-card">
      <div className="forecast-chart-header">
        <h3 className="forecast-chart-title">Forecast</h3>
        {confidence != null && <ConfidenceBadge confidence={confidence} />}
      </div>
      <div className="forecast-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 16, left: 0, bottom: 4 }} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="timeframe"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 13 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'auto']}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Legend
              wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
              formatter={(value) => (
                <span style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
              )}
            />
            <Bar
              dataKey="expectedCash"
              name="Expected Cash"
              fill="var(--color-success)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
            <Bar
              dataKey="expectedProviderBalance"
              name="Expected Provider Balance"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
