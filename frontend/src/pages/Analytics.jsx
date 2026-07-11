import { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiDownload, FiTrendingUp, FiDollarSign, FiAlertTriangle, FiFolder, FiClock, FiShield } from 'react-icons/fi';
import { format } from 'date-fns';
import useAuth from '../hooks/useAuth';
import useAnalytics from '../hooks/useAnalytics';
import LiquidityChart from '../components/analytics/LiquidityChart';
import ProviderChart from '../components/analytics/ProviderChart';
import RiskChart from '../components/analytics/RiskChart';
import ForecastChart from '../components/analytics/ForecastChart';
import AreaRiskHeatmap from '../components/analytics/AreaRiskHeatmap';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import { PROVIDERS } from '../utils/constants';
import './Analytics.css';

function formatDate(date) {
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return '';
  }
}

export default function Analytics() {
  const { role } = useAuth();
  const { analytics, loading, error, loadOverview, loadKPIs, loadForecast, loadRisk, refresh } = useAnalytics();

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  const [kpiData, setKpiData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    loadOverview({});
    loadKPIs({}).then(setKpiData);
    loadForecast().then(setForecastData);
    loadRisk({}).then(setRiskData);
  }, [loadOverview, loadKPIs, loadForecast, loadRisk]);

  const handleRefresh = useCallback(() => {
    refresh();
    loadKPIs({}).then(setKpiData);
    loadForecast().then(setForecastData);
    loadRisk({}).then(setRiskData);
  }, [refresh, loadKPIs, loadForecast, loadRisk]);

  const handleApplyFilters = useCallback(() => {
    const params = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    if (providerFilter) params.provider = providerFilter;
    if (areaFilter) params.area = areaFilter;
    loadOverview(params);
    loadKPIs(params).then(setKpiData);
  }, [dateFrom, dateTo, providerFilter, areaFilter, loadOverview, loadKPIs]);

  const kpis = kpiData || analytics?.kpis || {};
  const liquidityData = analytics?.liquidity || [];
  const providerData = analytics?.providers || [];
  const riskTrend = riskData?.trend || analytics?.riskTrend || [];
  const areas = riskData?.areas || analytics?.areas || [];
  const insights = analytics?.insights || [];
  const recentMetrics = analytics?.recentMetrics || [];

  const kpiCards = [
    { title: 'Total Transactions', value: kpis?.totalTransactions?.toLocaleString() ?? '—', icon: <FiTrendingUp size={20} />, color: 'var(--color-primary)', trend: kpis?.transactionTrend },
    { title: 'Current Liquidity', value: kpis?.currentLiquidity ? `$${(kpis.currentLiquidity / 1000).toFixed(1)}k` : '—', icon: <FiDollarSign size={20} />, color: 'var(--color-success)', trend: kpis?.liquidityTrend },
    { title: 'Active Alerts', value: kpis?.activeAlerts ?? '—', icon: <FiAlertTriangle size={20} />, color: 'var(--color-warning)', trend: kpis?.alertTrend },
    { title: 'Open Cases', value: kpis?.openCases ?? '—', icon: <FiFolder size={20} />, color: 'var(--color-danger)', trend: kpis?.caseTrend },
    { title: 'Avg Resolution Time', value: kpis?.avgResolutionTime ? `${kpis.avgResolutionTime}h` : '—', icon: <FiClock size={20} />, color: 'var(--color-text-secondary)' },
    { title: 'Risk Score', value: kpis?.riskScore ?? '—', icon: <FiShield size={20} />, color: kpis?.riskScore > 60 ? 'var(--color-danger)' : kpis?.riskScore > 30 ? 'var(--color-warning)' : 'var(--color-success)' },
  ];

  if (loading && !analytics) {
    return (
      <div className="analytics-page">
        <Loader overlay />
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="analytics-header-left">
          <h1 className="analytics-title">Analytics</h1>
          <span className="analytics-date">{formatDate(new Date())}</span>
        </div>
        <div className="analytics-header-right">
          <Button variant="ghost" size="sm" onClick={handleRefresh} loading={loading}>
            <FiRefreshCw size={14} /> Refresh
          </Button>
          <Button variant="secondary" size="sm">
            <FiDownload size={14} /> Export
          </Button>
        </div>
      </div>

      <div className="analytics-filter-bar">
        <div className="analytics-filter-group">
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To" />
          <Select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} placeholder="All Providers" options={Object.values(PROVIDERS).map((p) => ({ value: p, label: p }))} />
          <Select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} placeholder="All Areas" options={(analytics?.areas || []).map((a) => ({ value: a.id || a.name || a, label: a.name || a }))} />
          <Button variant="primary" size="sm" onClick={handleApplyFilters}>Apply</Button>
        </div>
      </div>

      {error && (
        <div className="analytics-error-banner">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>Retry</Button>
        </div>
      )}

      <div className="analytics-kpi-row">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="analytics-kpi-card" style={{ '--kpi-color': kpi.color }}>
            <div className="analytics-kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
              {kpi.icon}
            </div>
            <div className="analytics-kpi-info">
              <span className="analytics-kpi-value">{kpi.value}</span>
              <span className="analytics-kpi-title">{kpi.title}</span>
              {kpi.trend !== undefined && (
                <span className="analytics-kpi-trend">
                  {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-charts-grid">
        <div className="analytics-chart-cell">
          <LiquidityChart data={liquidityData} />
        </div>
        <div className="analytics-chart-cell">
          <ProviderChart data={providerData} />
        </div>
        <div className="analytics-chart-cell">
          <RiskChart data={riskTrend} />
        </div>
        <div className="analytics-chart-cell">
          <ForecastChart data={forecastData} />
        </div>
      </div>

      <div className="analytics-section">
        <h2 className="analytics-section-title">Area Risk Overview</h2>
        <AreaRiskHeatmap areas={areas} />
      </div>

      <div className="analytics-insights-section">
        <h2 className="analytics-section-title">Operational Insights</h2>
        <div className="analytics-insights-grid">
          {insights.length === 0 && (
            <div className="analytics-empty-state">No insights available</div>
          )}
          {insights.map((insight, idx) => (
            <div key={idx} className="analytics-insight-card">
              <span className="analytics-insight-title">{insight.title}</span>
              <p className="analytics-insight-description">{insight.description}</p>
              {insight.metric !== undefined && (
                <span className="analytics-insight-metric">{insight.metric}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-performance-section">
        <h2 className="analytics-section-title">Provider Performance</h2>
        <div className="analytics-performance-table-wrapper">
          <table className="analytics-performance-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Transactions</th>
                <th>Volume</th>
                <th>Success Rate</th>
                <th>Avg Response</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {(analytics?.providerPerformance || []).length === 0 && (
                <tr>
                  <td colSpan={6} className="analytics-empty-state">No performance data</td>
                </tr>
              )}
              {(analytics?.providerPerformance || []).map((p, idx) => (
                <tr key={idx}>
                  <td className="analytics-performance-name">{p.name}</td>
                  <td>{p.transactions?.toLocaleString() ?? '—'}</td>
                  <td>${(p.volume ?? 0).toLocaleString()}</td>
                  <td>{p.successRate ?? '—'}%</td>
                  <td>{p.avgResponse ?? '—'}ms</td>
                  <td>
                    <span className={`analytics-health-badge analytics-health-badge--${(p.health || 'unknown').toLowerCase()}`}>
                      {p.health || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analytics-recent-section">
        <h2 className="analytics-section-title">Recent Metrics</h2>
        <div className="analytics-recent-grid">
          {recentMetrics.length === 0 && (
            <div className="analytics-empty-state">No recent metrics</div>
          )}
          {recentMetrics.map((m, idx) => (
            <div key={idx} className="analytics-recent-card">
              <span className="analytics-recent-label">{m.label}</span>
              <span className="analytics-recent-value">{m.value}</span>
              <span className="analytics-recent-time">{m.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
