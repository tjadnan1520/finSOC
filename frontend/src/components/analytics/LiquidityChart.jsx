import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import './LiquidityChart.css';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="liquidity-tooltip">
      <p className="liquidity-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="liquidity-tooltip-value" style={{ color: entry.color }}>
          {entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function LiquidityChart({ data }) {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="liquidity-chart-card">
        <h3 className="liquidity-chart-title">Liquidity Trend</h3>
        <div className="liquidity-chart-empty">No data available</div>
      </div>
    );
  }

  return (
    <div className="liquidity-chart-card">
      <h3 className="liquidity-chart-title">Liquidity Trend</h3>
      <div className="liquidity-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
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
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeDasharray: '3 3' }} />
            <Legend
              wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
              formatter={(value) => (
                <span style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="totalLiquidity"
              name="Total Liquidity"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: 'var(--color-primary)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="physicalCash"
              name="Physical Cash"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'var(--color-success)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: 'var(--color-success)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="providerBalances"
              name="Provider Balances"
              stroke="#FF6600"
              strokeWidth={2}
              dot={{ r: 3, fill: '#FF6600', stroke: 'var(--color-surface)', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#FF6600', stroke: 'var(--color-surface)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
