import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import './ProviderChart.css';

const PROVIDER_COLORS = {
  bKash: '#E2136E',
  Nagad: '#FF6600',
  Rocket: '#581A7B',
};

const DEFAULT_PROVIDERS = ['bKash', 'Nagad', 'Rocket'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;
  return (
    <div className="provider-tooltip">
      <p className="provider-tooltip-label">{entry.name}</p>
      <p className="provider-tooltip-value">
        Balance: ${(entry.currentBalance ?? 0).toLocaleString()}
      </p>
      <p className="provider-tooltip-value">
        Transactions: {entry.transactions ?? 0}
      </p>
      <p className="provider-tooltip-value">
        Health: {entry.health ?? 'N/A'}
      </p>
    </div>
  );
}

export default function ProviderChart({ data }) {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="provider-chart-card">
        <h3 className="provider-chart-title">Provider Comparison</h3>
        <div className="provider-chart-empty">No data available</div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    currentBalance: d.currentBalance ?? 0,
    transactions: d.transactions ?? 0,
  }));

  const maxBalance = Math.max(...chartData.map((d) => d.currentBalance), 0);
  const maxTx = Math.max(...chartData.map((d) => d.transactions), 0);

  return (
    <div className="provider-chart-card">
      <h3 className="provider-chart-title">Provider Comparison</h3>
      <div className="provider-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 13 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="balance"
              orientation="left"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxBalance * 1.15 || 100]}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="tx"
              orientation="right"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxTx * 1.15 || 100]}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Legend
              wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
              formatter={(value) => (
                <span style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
              )}
            />
            <Bar
              yAxisId="balance"
              dataKey="currentBalance"
              name="Current Balance"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={PROVIDER_COLORS[entry.name] || 'var(--color-primary)'}
                />
              ))}
            </Bar>
            <Bar
              yAxisId="tx"
              dataKey="transactions"
              name="Transactions"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
              fill="var(--color-primary)"
              opacity={0.65}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="provider-chart-legend">
        {DEFAULT_PROVIDERS.map((name) => (
          <span key={name} className="provider-legend-item">
            <span
              className="provider-legend-dot"
              style={{ background: PROVIDER_COLORS[name] }}
            />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
