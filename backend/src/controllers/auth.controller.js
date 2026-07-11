const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const auth = require('../services/auth.service');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await auth.login(email, password);
  return successResponse(res, { token, user }, 'Login successful');
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await auth.getCurrentUser(req.user.id);
  return successResponse(res, user);
});

const logout = asyncHandler(async (req, res) => {
  return successResponse(res, null, 'Logout successful');
});

module.exports = { login, getCurrentUser, logout };
