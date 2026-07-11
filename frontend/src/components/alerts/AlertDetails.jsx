import { FiShield, FiUser, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { formatDateTime, formatRelativeTime, formatPercentage, getSeverityColor, getStatusColor } from '../../utils/formatter';
import { ROLES } from '../../utils/constants';
import Button from '../common/Button';
import EvidenceList from './EvidenceList';
import './AlertDetails.css';

function ConfidenceBar({ value }) {
  return (
    <div className="alert-details-confidence">
      <div className="alert-details-confidence-bar">
        <div
          className="alert-details-confidence-fill"
          style={{ width: `${value || 0}%` }}
        />
      </div>
      <span>{value ?? '—'}%</span>
    </div>
  );
}

function Timeline({ events = [] }) {
  if (!events.length) return null;
  return (
    <div className="alert-details-section">
      <h3 className="alert-details-section-title">Timeline</h3>
      <div className="alert-details-timeline">
        {events.map((evt) => (
          <div key={evt.id} className="alert-details-timeline-item">
            <div className="alert-details-timeline-dot" />
            <div className="alert-details-timeline-content">
              <span className="alert-details-timeline-action">{evt.action}</span>
              <span className="alert-details-timeline-time">{formatRelativeTime(evt.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AlertDetails({ alert, onAssign, onResolve, onClose, userRole }) {
  if (!alert) {
    return (
      <div className="alert-details-empty">
        <p>Select an alert to view details</p>
      </div>
    );
  }

  const isOperator = userRole === ROLES.OPERATOR;

  return (
    <div className="alert-details">
      <div className="alert-details-header">
        <div className="alert-details-header-left">
          <h2 className="alert-details-id">{alert.id}</h2>
          <div className="alert-details-header-badges">
            <span
              className="alert-details-severity"
              style={{ backgroundColor: `${getSeverityColor(alert.severity)}18`, color: getSeverityColor(alert.severity) }}
            >
              {alert.severity}
            </span>
            <span
              className="alert-details-status"
              style={{ backgroundColor: `${getStatusColor(alert.status)}18`, color: getStatusColor(alert.status) }}
            >
              {alert.status}
            </span>
          </div>
        </div>
        <div className="alert-details-confidence-wrap">
          <span className="alert-details-label">Confidence</span>
          <ConfidenceBar value={alert.confidence} />
        </div>
      </div>

      <div className="alert-details-grid">
        <div className="alert-details-left">
          <div className="alert-details-section">
            <h3 className="alert-details-section-title">Alert Information</h3>
            <div className="alert-details-info-grid">
              <div className="alert-details-info-item">
                <span className="alert-details-label">Title</span>
                <span className="alert-details-value">{alert.title}</span>
              </div>
              <div className="alert-details-info-item">
                <span className="alert-details-label">Description</span>
                <span className="alert-details-value">{alert.description}</span>
              </div>
              <div className="alert-details-info-item">
                <span className="alert-details-label">Provider</span>
                <span className="alert-details-value">{alert.provider}</span>
              </div>
              <div className="alert-details-info-item">
                <span className="alert-details-label">Agent</span>
                <span className="alert-details-value">{alert.agent || '—'}</span>
              </div>
              <div className="alert-details-info-item">
                <span className="alert-details-label">Category</span>
                <span className="alert-details-value">{alert.category}</span>
              </div>
              <div className="alert-details-info-item">
                <span className="alert-details-label">Generated</span>
                <span className="alert-details-value">{formatDateTime(alert.generatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="alert-details-section">
            <h3 className="alert-details-section-title">Evidence</h3>
            <EvidenceList evidence={alert.evidence} />
          </div>

          <Timeline events={alert.evidence} />
        </div>

        <div className="alert-details-right">
          <div className="alert-details-section alert-details-ai-section">
            <div className="alert-details-ai-header">
              <FiShield size={18} />
              <h3 className="alert-details-section-title">AI Analysis</h3>
            </div>
            <div className="alert-details-ai-body">
              <div className="alert-details-ai-item">
                <span className="alert-details-label">Summary</span>
                <p className="alert-details-ai-text">{alert.aiSummary || 'No AI summary available'}</p>
              </div>
              <div className="alert-details-ai-item">
                <span className="alert-details-label">Reason</span>
                <p className="alert-details-ai-text">{alert.aiReason || 'No AI reason available'}</p>
              </div>
              <div className="alert-details-ai-item">
                <span className="alert-details-label">Recommendation</span>
                <p className="alert-details-ai-text alert-details-ai-recommendation">
                  {alert.aiRecommendation || 'No recommendation available'}
                </p>
              </div>
              <div className="alert-details-ai-item">
                <span className="alert-details-label">Confidence</span>
                <ConfidenceBar value={alert.confidence} />
              </div>
              {alert.uncertaintyNote && (
                <div className="alert-details-ai-item">
                  <span className="alert-details-label">Uncertainty Note</span>
                  <p className="alert-details-ai-text alert-details-ai-uncertainty">{alert.uncertaintyNote}</p>
                </div>
              )}
            </div>
          </div>

          {alert.caseId && (
            <div className="alert-details-section">
              <h3 className="alert-details-section-title">Case Information</h3>
              <div className="alert-details-info-grid">
                <div className="alert-details-info-item">
                  <span className="alert-details-label">Case ID</span>
                  <span className="alert-details-value">{alert.caseId}</span>
                </div>
                <div className="alert-details-info-item">
                  <span className="alert-details-label">Case Status</span>
                  <span
                    className="alert-details-status"
                    style={{ backgroundColor: `${getStatusColor(alert.caseStatus)}18`, color: getStatusColor(alert.caseStatus) }}
                  >
                    {alert.caseStatus}
                  </span>
                </div>
                <div className="alert-details-info-item">
                  <span className="alert-details-label">Assigned Operator</span>
                  <span className="alert-details-value">{alert.assignedOperator || 'Unassigned'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOperator && (
        <div className="alert-details-actions">
          <Button variant="secondary" size="sm" onClick={onAssign}>
            <FiUser size={14} /> Assign
          </Button>
          <Button variant="primary" size="sm" onClick={onResolve}>
            <FiCheckCircle size={14} /> Resolve
          </Button>
          <Button variant="danger" size="sm" onClick={onClose}>
            <FiXCircle size={14} /> Close
          </Button>
        </div>
      )}
    </div>
  );
}
