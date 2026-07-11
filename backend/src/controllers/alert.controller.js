const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const alert = require('../services/alert.service');

const getAlerts = asyncHandler(async (req, res) => {
  const { page, limit, status, severity, type } = req.query;
  const filters = { status, severity, type };
  const pagination = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };
  const result = await alert.getAlerts(filters, pagination);
  return successResponse(res, result);
});

const getAlert = asyncHandler(async (req, res) => {
  const result = await alert.getAlertById(req.params.id);
  return successResponse(res, result);
});

const assignAlert = asyncHandler(async (req, res) => {
  const { alertId, operatorId } = req.body;
  const result = await alert.assignAlert(alertId, operatorId, req.user.id);
  return successResponse(res, result, 'Alert assigned');
});

const resolveAlert = asyncHandler(async (req, res) => {
  const result = await alert.resolveAlert(req.params.id);
  return successResponse(res, result, 'Alert resolved');
});

const closeAlert = asyncHandler(async (req, res) => {
  const result = await alert.closeAlert(req.params.id);
  return successResponse(res, result, 'Alert closed');
});

const getAlertSummary = asyncHandler(async (req, res) => {
  const result = await alert.getAlertSummary();
  return successResponse(res, result);
});

module.exports = { getAlerts, getAlert, assignAlert, resolveAlert, closeAlert, getAlertSummary };
