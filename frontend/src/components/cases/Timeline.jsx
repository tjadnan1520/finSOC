import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiAlertCircle, FiCheckCircle, FiUserPlus, FiMessageSquare, FiArrowUpRight } from 'react-icons/fi';
import { formatRelativeTime } from '../../utils/formatter';
import './Timeline.css';

const ACTION_ICONS = {
  CREATED: FiAlertCircle,
  ASSIGNED: FiUserPlus,
  ACCEPTED: FiCheckCircle,
  RESOLVED: FiCheckCircle,
  ESCALATED: FiArrowUpRight,
  NOTE_ADDED: FiMessageSquare,
};

const ACTION_COLORS = {
  CREATED: 'var(--color-primary)',
  ASSIGNED: 'var(--color-warning)',
  ACCEPTED: 'var(--color-success)',
  RESOLVED: 'var(--color-success)',
  ESCALATED: 'var(--color-danger)',
  NOTE_ADDED: 'var(--color-info)',
};

export default function Timeline({ events = [] }) {
  const [newestFirst, setNewestFirst] = useState(true);

  if (!events.length) {
    return (
      <div className="timeline">
        <h3 className="timeline-title">Timeline</h3>
        <div className="timeline-empty">No timeline events</div>
      </div>
    );
  }

  const sorted = [...events].sort((a, b) => {
    const diff = new Date(a.timestamp) - new Date(b.timestamp);
    return newestFirst ? -diff : diff;
  });

  return (
    <div className="timeline">
      <div className="timeline-header">
        <h3 className="timeline-title">Timeline</h3>
        <button
          className="timeline-toggle"
          onClick={() => setNewestFirst((v) => !v)}
          title={newestFirst ? 'Show oldest first' : 'Show newest first'}
        >
          {newestFirst ? 'Newest First' : 'Oldest First'}
          {newestFirst ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
      </div>

      <div className="timeline-list">
        {sorted.map((event, idx) => {
          const Icon = ACTION_ICONS[event.action] || FiAlertCircle;
          const color = ACTION_COLORS[event.action] || 'var(--color-text-secondary)';
          const isLast = idx === sorted.length - 1;

          return (
            <div key={event.id} className={`timeline-item ${isLast ? 'timeline-item-last' : ''}`}>
              <div className="timeline-line-container">
                <div className="timeline-dot" style={{ backgroundColor: color }}>
                  <Icon size={12} />
                </div>
                {!isLast && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <div className="timeline-content-header">
                  <span className="timeline-action" style={{ color }}>{event.action}</span>
                  <span className="timeline-actor">{event.actor}</span>
                  <span className="timeline-timestamp">{formatRelativeTime(event.timestamp)}</span>
                </div>
                <p className="timeline-description">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
