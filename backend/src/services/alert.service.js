const alertRepository = require('../repositories/alert.repository');
const notificationRepository = require('../repositories/notification.repository');
const auditRepository = require('../repositories/audit.repository');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const ApiError = require('../utils/apiError');

const normalizeAlert = (alert) => {
  if (!alert) return alert;

  return {
    ...alert,
    provider: alert.transaction?.provider || null,
    agent: alert.transaction?.agent || null,
    area: alert.transaction?.area || null,
    caseId: alert.case?.id || null,
    caseStatus: alert.case?.status || null,
    assignedOperator: alert.case?.assignedTo?.name || null,
    aiSummary: alert.aiAnalysis?.summary || null,
    aiReason: alert.aiAnalysis?.reason || null,
    aiRecommendation: alert.aiAnalysis?.recommendation || null,
  };
};

const getAlerts = async (filters = {}, paginationOpts = {}) => {
  const pagination = getPagination(paginationOpts.page, paginationOpts.limit);
  const result = await alertRepository.findAll({
    filters,
    pagination: { page: pagination.page, limit: pagination.limit },
  });

  return {
    data: result.data.map(normalizeAlert),
    pagination: getPaginationMeta(result.pagination.total, pagination.page, pagination.limit),
  };
};

const getAlertById = async (id) => {
  const alert = await alertRepository.findById(id);
  if (!alert) throw new ApiError(404, 'Alert not found');
  return normalizeAlert(alert);
};

const assignAlert = async (alertId, operatorId, assignedById) => {
  const alert = await alertRepository.findById(alertId);
  if (!alert) throw new ApiError(404, 'Alert not found');
  if (alert.status === 'RESOLVED') {
    throw new ApiError(400, 'Cannot assign a resolved alert');
  }

  const updated = await alertRepository.assign(alertId, operatorId);

  await auditRepository.create({
    userId: assignedById,
    action: 'ALERT_ASSIGNED',
    resource: 'Alert',
    resourceId: alertId,
    oldValue: { assignedTo: null },
    newValue: { assignedTo: operatorId },
    ip: null,
  });

  await notificationRepository.create({
    userId: operatorId,
    title: 'Alert Assigned',
    message: `Alert "${alert.title}" has been assigned to you`,
    type: 'ALERT',
    link: `/alerts/${alertId}`,
  });

  return normalizeAlert(updated);
};

const resolveAlert = async (alertId) => {
  const alert = await alertRepository.findById(alertId);
  if (!alert) throw new ApiError(404, 'Alert not found');
  if (alert.status === 'RESOLVED') throw new ApiError(400, 'Alert is already resolved');

  return normalizeAlert(await alertRepository.resolve(alertId));
};

const closeAlert = async (alertId) => {
  const alert = await alertRepository.findById(alertId);
  if (!alert) throw new ApiError(404, 'Alert not found');

  return normalizeAlert(await alertRepository.close(alertId));
};

const getAlertSummary = async () => {
  return alertRepository.getSummaryStats();
};

module.exports = { getAlerts, getAlertById, assignAlert, resolveAlert, closeAlert, getAlertSummary };
