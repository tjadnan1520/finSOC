const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const authRepository = require('../repositories/auth.repository');
const ApiError = require('../utils/apiError');

const sanitizeUser = (user) => {
  const { password, ...sanitized } = user;
  return sanitized;
};

const login = async (email, password) => {
  const user = await authRepository.findByEmail(email);
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (user.status !== 'ACTIVE') throw new ApiError(403, 'Account is not active');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role.name },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn, issuer: jwtConfig.issuer }
  );

  await authRepository.updateLastLogin(user.id);

  return { user: sanitizeUser(user), token };
};

const getCurrentUser = async (userId) => {
  const user = await authRepository.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return sanitizeUser(user);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

module.exports = { login, getCurrentUser, verifyToken };
