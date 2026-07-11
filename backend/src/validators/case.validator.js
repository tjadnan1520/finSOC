const { body, param } = require('express-validator');

const assignCaseValidation = [
  body('caseId')
    .notEmpty()
    .withMessage('Case ID is required')
    .isUUID()
    .withMessage('Case ID must be a valid UUID'),
  body('operatorId')
    .notEmpty()
    .withMessage('Operator ID is required')
    .isUUID()
    .withMessage('Operator ID must be a valid UUID'),
];

const acceptCaseValidation = [
  param('id')
    .notEmpty()
    .withMessage('Case ID is required')
    .isUUID()
    .withMessage('Case ID must be a valid UUID'),
];

const resolveCaseValidation = [
  param('id')
    .notEmpty()
    .withMessage('Case ID is required')
    .isUUID()
    .withMessage('Case ID must be a valid UUID'),
];

const addNoteValidation = [
  param('id')
    .notEmpty()
    .withMessage('Case ID is required')
    .isUUID()
    .withMessage('Case ID must be a valid UUID'),
  body('content')
    .notEmpty()
    .withMessage('Note content is required')
    .isString()
    .withMessage('Note content must be a string')
    .isLength({ max: 2000 })
    .withMessage('Note content must not exceed 2000 characters'),
];

module.exports = {
  assignCaseValidation,
  acceptCaseValidation,
  resolveCaseValidation,
  addNoteValidation,
};
