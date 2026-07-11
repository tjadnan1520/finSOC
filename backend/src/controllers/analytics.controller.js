const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const analytics = require('../services/analytics.service');

const getOverview = asyncHandler(async (req, res) => {
  const { dateRange } = req.query;
  const result = await analytics.getOverview({ dateRange });
  return successResponse(res, result);
});

const getKPIs = asyncHandler(async (req, res) => {
  const { dateRange } = req.query;
  const result = await analytics.getKPIs({ dateRange });
  return successResponse(res, result);
});

const getForecast = asyncHandler(async (req, res) => {
  const result = await analytics.getForecast();
  return successResponse(res, result);
});

const getRisk = asyncHandler(async (req, res) => {
  const { period } = req.query;
  const result = await analytics.getRiskTrend({ period });
  return successResponse(res, result);
});

const getProviderAnalytics = asyncHandler(async (req, res) => {
  const result = await analytics.getProviderAnalytics();
  return successResponse(res, result);
});

const getLiquidityTrend = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const result = await analytics.getLiquidityTrend({ days: parseInt(days) || 30 });
  return successResponse(res, result);
});

const getPerformanceMetrics = asyncHandler(async (req, res) => {
  const result = await analytics.getPerformanceMetrics();
  return successResponse(res, result);
});

module.exports = { getOverview, getKPIs, getForecast, getRisk, getProviderAnalytics, getLiquidityTrend, getPerformanceMetrics };
