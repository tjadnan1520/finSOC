const { body } = require('express-validator');

const cashInValidation = [
  body('type')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['CASH_IN'])
    .withMessage('Type must be CASH_IN'),
  body('providerId')
    .notEmpty()
    .withMessage('Provider ID is required')
    .isUUID()
    .withMessage('Provider ID must be a valid UUID'),
  body('agentId')
    .optional()
    .isUUID()
    .withMessage('Agent ID must be a valid UUID'),
  body('areaId')
    .optional()
    .isUUID()
    .withMessage('Area ID must be a valid UUID'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('referenceNumber')
    .optional()
    .isString()
    .withMessage('Reference number must be a string'),
  body('phoneNumber')
    .optional()
    .isString()
    .withMessage('Phone number must be a string'),
  body('remarks')
    .optional()
    .isString()
    .withMessage('Remarks must be a string'),
];

const cashOutValidation = [
  body('type')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['CASH_OUT'])
    .withMessage('Type must be CASH_OUT'),
  body('providerId')
    .notEmpty()
    .withMessage('Provider ID is required')
    .isUUID()
    .withMessage('Provider ID must be a valid UUID'),
  body('agentId')
    .optional()
    .isUUID()
    .withMessage('Agent ID must be a valid UUID'),
  body('areaId')
    .optional()
    .isUUID()
    .withMessage('Area ID must be a valid UUID'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('referenceNumber')
    .optional()
    .isString()
    .withMessage('Reference number must be a string'),
  body('phoneNumber')
    .optional()
    .isString()
    .withMessage('Phone number must be a string'),
  body('remarks')
    .optional()
    .isString()
    .withMessage('Remarks must be a string'),
];

module.exports = { cashInValidation, cashOutValidation };
