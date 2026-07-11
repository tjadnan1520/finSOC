import { FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';
import { formatRelativeTime, formatDateTime } from '../../utils/formatter';
import { ROLES } from '../../utils/constants';
import Button from '../common/Button';
import './AssignmentPanel.css';

export default function AssignmentPanel({ assignment, operators = [], onAssign, onAccept, userRole, loading }) {
  const isOperator = userRole === ROLES.OPERATOR;
  const isAssigned = !!assignment?.operator;
  const isAccepted = !!assignment?.acceptedAt;

  return (
    <div className="assignment-panel">
      <h3 className="assignment-panel-title">Assignment</h3>

      {!isAssigned ? (
        <div className="assignment-panel-unassigned">
          <FiUser size={24} />
          <p>No operator assigned</p>
          {isOperator && (
            <Button variant="primary" size="sm" onClick={onAssign} disabled={loading}>
              Assign to Me
            </Button>
          )}
        </div>
      ) : (
        <div className="assignment-panel-details">
          <div className="assignment-panel-operator">
            <div className="assignment-panel-avatar">
              {assignment.operator.charAt(0).toUpperCase()}
            </div>
            <div className="assignment-panel-operator-info">
              <span className="assignment-panel-operator-name">{assignment.operator}</span>
              <span className={`assignment-panel-status ${isAccepted ? 'accepted' : 'pending'}`}>
                {isAccepted ? 'Accepted' : 'Pending Acceptance'}
              </span>
            </div>
          </div>

          <div className="assignment-panel-times">
            <div className="assignment-panel-time-item">
              <FiClock size={14} />
              <div>
                <span className="assignment-panel-time-label">Assigned</span>
                <span className="assignment-panel-time-value">{formatRelativeTime(assignment.assignedAt)}</span>
              </div>
            </div>
            {isAccepted && (
              <div className="assignment-panel-time-item">
                <FiCheckCircle size={14} />
                <div>
                  <span className="assignment-panel-time-label">Accepted</span>
                  <span className="assignment-panel-time-value">{formatRelativeTime(assignment.acceptedAt)}</span>
                </div>
              </div>
            )}
          </div>

          {isOperator && !isAccepted && (
            <div className="assignment-panel-actions">
              <Button variant="primary" size="sm" onClick={onAccept} disabled={loading}>
                <FiCheckCircle size={14} /> Accept Assignment
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
