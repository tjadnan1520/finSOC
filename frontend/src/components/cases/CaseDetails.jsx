import { FiShield, FiUser, FiCheckCircle, FiXCircle, FiArrowUpRight, FiFileText, FiMessageSquare } from 'react-icons/fi';
import { formatDateTime, formatRelativeTime, getSeverityColor, getStatusColor, getPriorityColor } from '../../utils/formatter';
import { ROLES } from '../../utils/constants';
import Button from '../common/Button';
import EvidenceList from '../alerts/EvidenceList';
import AssignmentPanel from './AssignmentPanel';
import Timeline from './Timeline';
import Notes from './Notes';
import './CaseDetails.css';

function AISummaryCard({ caseData }) {
  if (!caseData?.aiSummary && !caseData?.aiRecommendation) return null;

  return (
    <div className="case-details-ai-card">
      <div className="case-details-ai-header">
        <FiShield size={18} />
        <h3>AI Recommendation</h3>
      </div>
      <div className="case-details-ai-body">
        {caseData.aiSummary && (
          <div className="case-details-ai-item">
            <span className="case-details-ai-label">Summary</span>
            <p>{caseData.aiSummary}</p>
          </div>
        )}
        {caseData.aiReason && (
          <div className="case-details-ai-item">
            <span className="case-details-ai-label">Reason</span>
            <p>{caseData.aiReason}</p>
          </div>
        )}
        {caseData.aiRecommendation && (
          <div className="case-details-ai-item">
            <span className="case-details-ai-label">Recommendation</span>
            <p className="case-details-ai-rec">{caseData.aiRecommendation}</p>
          </div>
        )}
        {caseData.confidence !== undefined && (
          <div className="case-details-ai-item">
            <span className="case-details-ai-label">Confidence</span>
            <div className="case-details-confidence-bar-wrap">
              <div className="case-details-confidence-bar">
                <div className="case-details-confidence-fill" style={{ width: `${caseData.confidence}%` }} />
              </div>
              <span>{caseData.confidence}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseDetails({ caseData, userRole, onAssign, onAccept, onResolve, onClose, onAddNote }) {
  if (!caseData) {
    return (
      <div className="case-details-empty">
        <p>Select a case to view details</p>
      </div>
    );
  }

  const isOperator = userRole === ROLES.OPERATOR;
  const alert = caseData.alert || {};

  return (
    <div className="case-details">
      <div className="case-details-header">
        <div className="case-details-header-left">
          <h2 className="case-details-id">{caseData.id}</h2>
          <div className="case-details-badges">
            <span
              className="case-details-priority"
              style={{ backgroundColor: `${getPriorityColor(caseData.priority)}18`, color: getPriorityColor(caseData.priority) }}
            >
              {caseData.priority}
            </span>
            <span
              className="case-details-status-badge"
              style={{ backgroundColor: `${getStatusColor(caseData.status)}18`, color: getStatusColor(caseData.status) }}
            >
              {caseData.status}
            </span>
          </div>
        </div>
      </div>

      <div className="case-details-grid">
        <div className="case-details-left">
          <div className="case-details-card">
            <h3 className="case-details-section-title">Case Summary</h3>
            <div className="case-details-info-grid">
              <div className="case-details-info-item">
                <span className="case-details-label">Provider</span>
                <span className="case-details-value">{caseData.provider?.name || caseData.alert?.transaction?.provider?.name || '—'}</span>
              </div>
              <div className="case-details-info-item">
                <span className="case-details-label">Area</span>
                <span className="case-details-value">{caseData.area?.name || caseData.area || '—'}</span>
              </div>
              <div className="case-details-info-item">
                <span className="case-details-label">Created</span>
                <span className="case-details-value">{formatDateTime(caseData.createdAt)}</span>
              </div>
              <div className="case-details-info-item">
                <span className="case-details-label">Last Updated</span>
                <span className="case-details-value">{formatRelativeTime(caseData.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="case-details-card">
            <h3 className="case-details-section-title">Alert Information</h3>
            <div className="case-details-info-grid">
              <div className="case-details-info-item">
                <span className="case-details-label">Alert ID</span>
                <span className="case-details-value">{alert.id || caseData.alertId || '—'}</span>
              </div>
              <div className="case-details-info-item">
                <span className="case-details-label">Severity</span>
                {alert.severity ? (
                  <span className="case-details-severity-text" style={{ color: getSeverityColor(alert.severity) }}>
                    {alert.severity}
                  </span>
                ) : <span className="case-details-value">—</span>}
              </div>
              <div className="case-details-info-item">
                <span className="case-details-label">Category</span>
                <span className="case-details-value">{alert.category || '—'}</span>
              </div>
              <div className="case-details-info-item">
                <span className="case-details-label">Confidence</span>
                <span className="case-details-value">{alert.confidence ?? '—'}%</span>
              </div>
            </div>
          </div>

          <div className="case-details-card">
            <h3 className="case-details-section-title">Evidence Summary</h3>
            <EvidenceList evidence={alert.evidence || caseData.evidence} />
          </div>
        </div>

        <div className="case-details-right">
          <AssignmentPanel
            assignment={caseData.assignment}
            operators={caseData.operators}
            onAssign={onAssign}
            onAccept={onAccept}
            userRole={userRole}
          />

          <AISummaryCard caseData={caseData} />

          <Timeline events={caseData.timeline} />

          <Notes
            notes={caseData.notes}
            onAddNote={onAddNote}
            userRole={userRole}
          />
        </div>
      </div>

      <div className="case-details-actions">
        {isOperator ? (
          <>
            <Button variant="secondary" size="sm" onClick={onAssign}>
              <FiUser size={14} /> Assign
            </Button>
            <Button variant="primary" size="sm" onClick={onAccept}>
              <FiCheckCircle size={14} /> Accept
            </Button>
            <Button variant="ghost" size="sm" onClick={onAddNote}>
              <FiMessageSquare size={14} /> Add Note
            </Button>
            <Button variant="warning" size="sm">
              <FiArrowUpRight size={14} /> Escalate
            </Button>
            <Button variant="primary" size="sm" onClick={onResolve}>
              <FiCheckCircle size={14} /> Resolve
            </Button>
            <Button variant="danger" size="sm" onClick={onClose}>
              <FiXCircle size={14} /> Close
            </Button>
          </>
        ) : userRole === ROLES.MANAGEMENT ? (
          <>
            <Button variant="ghost" size="sm">
              <FiFileText size={14} /> Review
            </Button>
            <Button variant="ghost" size="sm">
              <FiShield size={14} /> Monitor
            </Button>
          </>
        ) : (
          <span className="case-details-readonly">Read Only Access</span>
        )}
      </div>
    </div>
  );
}
