export const ROLES = {
  AGENT: 'AGENT',
  OPERATOR: 'OPERATOR',
  MANAGEMENT: 'MANAGEMENT',
};

export const TRANSACTION_TYPES = {
  CASH_IN: 'CASH_IN',
  CASH_OUT: 'CASH_OUT',
};

export const TRANSACTION_STATUSES = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

export const ALERT_SEVERITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const ALERT_STATUSES = {
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  ESCALATED: 'ESCALATED',
  RESOLVED: 'RESOLVED',
};

export const CASE_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const CASE_STATUSES = {
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  ESCALATED: 'ESCALATED',
  RESOLVED: 'RESOLVED',
};

export const PROVIDERS = {
  BKASH: 'bKash',
  NAGAD: 'Nagad',
  ROCKET: 'Rocket',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const PAGE_SIZE = 20;
