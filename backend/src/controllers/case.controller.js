const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const cases = require('../services/case.service');

const getCases = asyncHandler(async (req, res) => {
  const { page, limit, status, priority, type } = req.query;
  const filters = { status, priority, type };
  const pagination = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };
  const result = await cases.getCases(filters, pagination);
  return successResponse(res, result);
});

const getCase = asyncHandler(async (req, res) => {
  const result = await cases.getCaseById(req.params.id);
  return successResponse(res, result);
});

const assignCase = asyncHandler(async (req, res) => {
  const { caseId, operatorId } = req.body;
  const result = await cases.assignCase(caseId, operatorId, req.user.id);
  return successResponse(res, result, 'Case assigned');
});

const acceptCase = asyncHandler(async (req, res) => {
  const { caseId } = req.body;
  const result = await cases.acceptCase(caseId, req.user.id);
  return successResponse(res, result, 'Case accepted');
});

const resolveCase = asyncHandler(async (req, res) => {
  const result = await cases.resolveCase(req.params.id);
  return successResponse(res, result, 'Case resolved');
});

const closeCase = asyncHandler(async (req, res) => {
  const result = await cases.closeCase(req.params.id);
  return successResponse(res, result, 'Case closed');
});

const addNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const result = await cases.addCaseNote(req.params.id, req.user.id, content);
  return successResponse(res, result, 'Note added');
});

const getCaseSummary = asyncHandler(async (req, res) => {
  const result = await cases.getCaseSummary();
  return successResponse(res, result);
});

module.exports = { getCases, getCase, assignCase, acceptCase, resolveCase, closeCase, addNote, getCaseSummary };
