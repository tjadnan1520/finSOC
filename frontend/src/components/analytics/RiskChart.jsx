import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import './RiskChart.css';

const PERIODS = ['daily', 'weekly', 'monthly'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="risk-tooltip">
      <p className="risk-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="risk-tooltip-value" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  );
}

function GradientDefs() {
  return (
    <defs>
      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--color-danger)" stopOpacity={0.35} />
        <stop offset="100%" stopColor="var(--color-danger)" stopOpacity={0.02} />
      </linearGradient>
    </defs>
  );
}

export default function RiskChart({ data, period: initialPeriod = 'daily' }) {
  const [period, setPeriod] = useState(initialPeriod);
  const hasData = data && data.length > 0;

  return (
    <div className="risk-chart-card">
      <div className="risk-chart-header">
        <h3 className="risk-chart-title">Risk Trend</h3>
        <div className="risk-period-tabs">
          {PERIODS.map((p) => (
            <button
              key={p}
              className={`risk-period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {!hasData ? (
        <div className="risk-chart-empty">No data available</div>
      ) : (
        <div className="risk-chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
              <GradientDefs />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeDasharray: '3 3' }} />
              <Legend
                wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                formatter={(value) => (
                  <span style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="riskScore"
                name="Risk Score"
                stroke="var(--color-danger)"
                strokeWidth={2}
                fill="url(#riskGradient)"
                dot={{ r: 3, fill: 'var(--color-danger)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: 'var(--color-danger)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="alertCount"
                name="Alert Count"
                stroke="var(--color-warning)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--color-warning)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: 'var(--color-warning)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
