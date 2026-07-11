export function formatCurrency(amount, currency = 'BDT') {
  const value = Number(amount);
  if (isNaN(value)) return '—';
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value) {
  const num = Number(value);
  if (isNaN(num)) return '—';
  return `${num.toFixed(2)}%`;
}

export function formatLargeNumber(num) {
  const value = Number(num);
  if (isNaN(value)) return '—';

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatDateTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatRelativeTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';

  const now = new Date();
  const diffMs = now - d;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getSeverityColor(severity) {
  const map = {
    LOW: 'var(--color-success)',
    MEDIUM: 'var(--color-warning)',
    HIGH: 'var(--color-danger)',
    CRITICAL: 'var(--color-danger)',
  };
  return map[severity] || 'var(--color-text-secondary)';
}

export function getStatusColor(status) {
  const map = {
    PENDING: 'var(--color-warning)',
    COMPLETED: 'var(--color-success)',
    FAILED: 'var(--color-danger)',
    CANCELLED: 'var(--color-text-light)',
    OPEN: 'var(--color-info)',
    ASSIGNED: 'var(--color-primary)',
    ESCALATED: 'var(--color-danger)',
    RESOLVED: 'var(--color-success)',
  };
  return map[status] || 'var(--color-text-secondary)';
}

export function getPriorityColor(priority) {
  const map = {
    LOW: 'var(--color-success)',
    MEDIUM: 'var(--color-warning)',
    HIGH: 'var(--color-danger)',
    CRITICAL: 'var(--color-danger)',
  };
  return map[priority] || 'var(--color-text-secondary)';
}
