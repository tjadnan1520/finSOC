const { body, param } = require('express-validator');

const assignAlertValidation = [
  body('alertId')
    .notEmpty()
    .withMessage('Alert ID is required')
    .isUUID()
    .withMessage('Alert ID must be a valid UUID'),
  body('operatorId')
    .notEmpty()
    .withMessage('Operator ID is required')
    .isUUID()
    .withMessage('Operator ID must be a valid UUID'),
];

const updateStatusValidation = [
  param('alertId')
    .notEmpty()
    .withMessage('Alert ID is required')
    .isUUID()
    .withMessage('Alert ID must be a valid UUID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['NEW', 'ASSIGNED', 'INVESTIGATING', 'ESCALATED', 'RESOLVED', 'DISMISSED'])
    .withMessage('Status must be a valid alert status'),
];

const escalateValidation = [
  param('alertId')
    .notEmpty()
    .withMessage('Alert ID is required')
    .isUUID()
    .withMessage('Alert ID must be a valid UUID'),
];

const resolveAlertValidation = [
  param('id')
    .notEmpty()
    .withMessage('Alert ID is required')
    .isUUID()
    .withMessage('Alert ID must be a valid UUID'),
];

module.exports = {
  assignAlertValidation,
  updateStatusValidation,
  escalateValidation,
  resolveAlertValidation,
};
