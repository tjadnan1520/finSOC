const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const user = require('../services/user.service');

const getProfile = asyncHandler(async (req, res) => {
  const result = await user.getProfile(req.user.id);
  return successResponse(res, result);
});

const updateProfile = asyncHandler(async (req, res) => {
  const result = await user.updateProfile(req.user.id, req.body);
  return successResponse(res, result, 'Profile updated');
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await user.changePassword(req.user.id, currentPassword, newPassword);
  return successResponse(res, result, 'Password changed');
});

const getUsersByRole = asyncHandler(async (req, res) => {
  const result = await user.getUsersByRole(req.params.role);
  return successResponse(res, result);
});

module.exports = { getProfile, updateProfile, changePassword, getUsersByRole };
