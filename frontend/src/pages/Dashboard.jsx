import { FiRefreshCw, FiDollarSign, FiUsers, FiAlertTriangle, FiCheckCircle, FiBriefcase, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import useDashboard from '../hooks/useDashboard';
import { formatCurrency, formatLargeNumber, formatDateTime } from '../utils/formatter';
import { ROLES } from '../utils/constants';
import { getCurrentDate } from '../utils/dateTime';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import SummaryCards from '../components/dashboard/SummaryCards';
import LiquidityOverview from '../components/dashboard/LiquidityOverview';
import ProviderBalance from '../components/dashboard/ProviderBalance';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import './Dashboard.css';

export default function Dashboard() {
  const { role } = useAuth();
  const { dashboard, loading, error, lastUpdated, refresh } = useDashboard();

  const handleRefresh = () => refresh();

  if (loading && !dashboard) {
    return (
      <div className="dashboard">
        <div className="dashboard__loader"><Loader size="lg" /></div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="dashboard">
        <div className="dashboard__error">
          <FiAlertTriangle size={40} />
          <p>Failed to load dashboard</p>
          <span>{error}</span>
          <Button variant="primary" onClick={handleRefresh}>Retry</Button>
        </div>
      </div>
    );
  }

  const renderAgentDashboard = () => (
    <>
      <SummaryCards cards={[
        { icon: <FiDollarSign size={20} />, title: 'Physical Cash', value: formatCurrency(dashboard?.physicalCash?.currentBalance), color: 'var(--color-success)' },
        ...(dashboard?.todayCashIn !== undefined ? [{ icon: <FiTrendingUp size={20} />, title: "Today's Cash In", value: formatCurrency(dashboard.todayCashIn), color: 'var(--color-primary)' }] : []),
        ...(dashboard?.todayCashOut !== undefined ? [{ icon: <FiTrendingUp size={20} />, title: "Today's Cash Out", value: formatCurrency(dashboard.todayCashOut), color: 'var(--color-warning)' }] : []),
      ]} />

      <div className="dashboard__grid dashboard__grid--agent">
        <div className="dashboard__widget dashboard__widget--full">
          <ProviderBalance providers={dashboard?.providerBalances || []} />
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <RecentTransactions transactions={dashboard?.recentTransactions || []} />
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <RecentAlerts alerts={dashboard?.recentAlerts || []} />
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <LiquidityOverview data={dashboard?.liquidityOverview} />
        </div>
      </div>
    </>
  );

  const renderOperatorDashboard = () => (
    <>
      <SummaryCards cards={[
        { icon: <FiAlertTriangle size={20} />, title: 'Active Alerts', value: dashboard?.activeAlerts?.length ?? '—', color: 'var(--color-warning)' },
        { icon: <FiAlertTriangle size={20} />, title: 'Critical Alerts', value: dashboard?.activeAlerts?.filter(a => a.severity === 'CRITICAL').length ?? '—', color: 'var(--color-danger)' },
        { icon: <FiBriefcase size={20} />, title: 'Assigned Cases', value: dashboard?.assignedCases?.length ?? '—', color: 'var(--color-primary)' },
        { icon: <FiCheckCircle size={20} />, title: 'Open Cases', value: dashboard?.openCasesCount ?? '—', color: 'var(--color-info)' },
      ]} />

      <div className="dashboard__grid dashboard__grid--operator">
        <div className="dashboard__widget dashboard__widget--half">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Evidence Summary</h3>
            <p className="dashboard__widget-content">{dashboard?.evidenceSummary || 'No evidence data available'}</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Investigation Timeline</h3>
            <p className="dashboard__widget-placeholder">Timeline visualization coming soon</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Recommendation Summary</h3>
            <p className="dashboard__widget-content">{dashboard?.recommendationSummary || 'No recommendations available'}</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--full">
          <RecentAlerts alerts={dashboard?.recentAlerts || []} />
        </div>

        <div className="dashboard__widget dashboard__widget--full">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Escalation Queue</h3>
            {dashboard?.escalationQueue?.length > 0 ? (
              <div className="dashboard__escalation-list">
                {dashboard.escalationQueue.map((item, i) => (
                  <div key={i} className="dashboard__escalation-item">
                    <span>{(item.alertId || item.id)?.length > 8 ? `#${(item.alertId || item.id).slice(0, 8).toUpperCase()}` : (item.alertId || item.id)}</span>
                    <span className="dashboard__escalation-reason">{item.reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dashboard__widget-placeholder">No escalations pending</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderManagementDashboard = () => (
    <>
      <SummaryCards cards={[
        { icon: <FiDollarSign size={20} />, title: 'Overall Liquidity', value: formatCurrency(dashboard?.liquidity?.totalLiquidity), color: 'var(--color-primary)' },
        { icon: <FiBarChart2 size={20} />, title: 'Provider Health', value: dashboard?.providerHealth ?? '—', color: 'var(--color-success)' },
        { icon: <FiAlertTriangle size={20} />, title: 'Active Alerts', value: dashboard?.recentAlerts?.length ?? '—', color: 'var(--color-warning)' },
        { icon: <FiBriefcase size={20} />, title: 'Open Cases', value: dashboard?.openCasesCount ?? '—', color: 'var(--color-info)' },
      ]} />

      <div className="dashboard__grid dashboard__grid--management">
        <div className="dashboard__widget dashboard__widget--half">
          <LiquidityOverview data={dashboard?.liquidityOverview} />
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Provider Comparison</h3>
            <p className="dashboard__widget-placeholder">Provider comparison chart coming soon</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Forecast</h3>
            <p className="dashboard__widget-content">{dashboard?.forecast || 'Forecast data loading...'}</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">High Risk Areas</h3>
            <p className="dashboard__widget-placeholder">Risk heatmap coming soon</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--third">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Alert Statistics</h3>
            <p className="dashboard__widget-content">{dashboard?.alertStatistics || 'No statistics available'}</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--third">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Case Statistics</h3>
            <p className="dashboard__widget-content">{dashboard?.caseStatistics || 'No statistics available'}</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--third">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Resolution Metrics</h3>
            <p className="dashboard__widget-content">{dashboard?.resolutionMetrics || 'No metrics available'}</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Performance KPIs</h3>
            <p className="dashboard__widget-content">{dashboard?.performanceKPIs || 'No KPI data available'}</p>
          </div>
        </div>

        <div className="dashboard__widget dashboard__widget--half">
          <div className="dashboard__widget-card">
            <h3 className="dashboard__widget-title">Decision Trend</h3>
            <p className="dashboard__widget-placeholder">Decision trend chart coming soon</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__header-left">
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__date">{getCurrentDate()}</p>
        </div>
        <div className="dashboard__header-right">
          {lastUpdated && (
            <span className="dashboard__updated">Last updated: {formatDateTime(lastUpdated)}</span>
          )}
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
            <FiRefreshCw size={16} className={loading ? 'dashboard__spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {loading && <Loader overlay />}

      {role === ROLES.AGENT && renderAgentDashboard()}
      {role === ROLES.OPERATOR && renderOperatorDashboard()}
      {role === ROLES.MANAGEMENT && renderManagementDashboard()}
    </div>
  );
}
