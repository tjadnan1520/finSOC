const bcrypt = require('bcrypt');
const config = require('../config/env');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/apiError');

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const updated = await userRepository.updateProfile(userId, data);
  return updated;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  if (!user.password) throw new ApiError(400, 'Password change not available');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);
  await userRepository.updatePassword(userId, hashedPassword);
  return { message: 'Password changed successfully' };
};

const getUsersByRole = async (role) => {
  return userRepository.findByRole(role);
};

module.exports = { getProfile, updateProfile, changePassword, getUsersByRole };
