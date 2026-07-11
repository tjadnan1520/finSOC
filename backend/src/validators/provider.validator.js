const { param } = require('express-validator');

const providerIdParam = [
  param('providerId')
    .notEmpty()
    .withMessage('Provider ID is required')
    .isUUID()
    .withMessage('Provider ID must be a valid UUID'),
];

module.exports = { providerIdParam };
