const config = require('./env');

const jwtOptions = {
  secret: config.jwt.secret,
  expiresIn: config.jwt.expiresIn,
  issuer: config.jwt.issuer,
  audience: config.jwt.audience,
};

module.exports = jwtOptions;
