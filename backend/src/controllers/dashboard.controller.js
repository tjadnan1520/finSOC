const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const dashboard = require('../services/dashboard.service');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboard.getDashboard(req.user);
  return successResponse(res, data);
});

const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboard.getDashboardSummary(req.user);
  return successResponse(res, data);
});

const getKPIs = asyncHandler(async (req, res) => {
  const data = await dashboard.getDashboardKPIs(req.user);
  return successResponse(res, data);
});

const getLiquidity = asyncHandler(async (req, res) => {
  const data = await dashboard.getDashboard(req.user);
  return successResponse(res, data.liquidity);
});

module.exports = { getDashboard, getSummary, getKPIs, getLiquidity };
