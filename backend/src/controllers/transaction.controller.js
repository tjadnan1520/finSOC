const asyncHandler = require('../utils/asyncHandler');
const { successResponse, createdResponse } = require('../utils/response');
const transaction = require('../services/transaction.service');

const cashIn = asyncHandler(async (req, res) => {
  const data = { ...req.body, createdById: req.user.id };
  const result = await transaction.cashIn(data);
  return createdResponse(res, result, 'Cash-in completed');
});

const cashOut = asyncHandler(async (req, res) => {
  const data = { ...req.body, createdById: req.user.id };
  const result = await transaction.cashOut(data);
  return createdResponse(res, result, 'Cash-out completed');
});

const getTransactions = asyncHandler(async (req, res) => {
  const { page, limit, status, type, providerId, search } = req.query;
  const filters = { status, type, providerId, search };
  const pagination = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };
  const result = await transaction.getTransactions(filters, pagination);
  return successResponse(res, result);
});

const getTransaction = asyncHandler(async (req, res) => {
  const result = await transaction.getTransactionById(req.params.id);
  return successResponse(res, result);
});

const getTodaySummary = asyncHandler(async (req, res) => {
  const result = await transaction.getTodaySummary();
  return successResponse(res, result);
});

module.exports = { cashIn, cashOut, getTransactions, getTransaction, getTodaySummary };
