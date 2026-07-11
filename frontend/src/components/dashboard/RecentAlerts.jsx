import { formatRelativeTime, getSeverityColor, getStatusColor } from '../../utils/formatter';
import './RecentAlerts.css';

export default function RecentAlerts({ alerts = [] }) {
  if (!alerts.length) {
    return (
      <div className="recent-alerts">
        <div className="recent-alerts__header">
          <h3 className="recent-alerts__title">Recent Alerts</h3>
        </div>
        <p className="recent-alerts__empty">No recent alerts</p>
      </div>
    );
  }

  return (
    <div className="recent-alerts">
      <div className="recent-alerts__header">
        <h3 className="recent-alerts__title">Recent Alerts</h3>
        <a href="/alerts" className="recent-alerts__view-all">View All</a>
      </div>

      <div className="recent-alerts__table-wrapper">
        <table className="recent-alerts__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td className="recent-alerts__id">{alert.id}</td>
                <td className="recent-alerts__title-text">{alert.title}</td>
                <td>
                  <span
                    className="recent-alerts__severity"
                    style={{ '--severity-color': getSeverityColor(alert.severity) }}
                  >
                    {alert.severity}
                  </span>
                </td>
                <td>
                  <span
                    className="recent-alerts__status"
                    style={{ '--status-color': getStatusColor(alert.status) }}
                  >
                    {alert.status}
                  </span>
                </td>
                <td className="recent-alerts__time">{formatRelativeTime(alert.createdAt)}</td>
                <td>
                  <a href={`/alerts/${alert.id}`} className="recent-alerts__view">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
