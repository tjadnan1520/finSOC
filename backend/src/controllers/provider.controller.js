const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const provider = require('../services/provider.service');

const getProviders = asyncHandler(async (req, res) => {
  const result = await provider.getProviders();
  return successResponse(res, result);
});

const getProvider = asyncHandler(async (req, res) => {
  const result = await provider.getProviderById(req.params.id);
  return successResponse(res, result);
});

const getBalances = asyncHandler(async (req, res) => {
  const result = await provider.getProviderBalances();
  return successResponse(res, result);
});

const getStatistics = asyncHandler(async (req, res) => {
  const result = await provider.getProviderStatistics(req.params.id);
  return successResponse(res, result);
});

const getPerformance = asyncHandler(async (req, res) => {
  const result = await provider.getProviderPerformance();
  return successResponse(res, result);
});

module.exports = { getProviders, getProvider, getBalances, getStatistics, getPerformance };
