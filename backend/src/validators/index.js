const authValidators = require('./auth.validator');
const transactionValidators = require('./transaction.validator');
const alertValidators = require('./alert.validator');
const caseValidators = require('./case.validator');
const userValidators = require('./user.validator');
const providerValidators = require('./provider.validator');

module.exports = {
  auth: authValidators,
  transaction: transactionValidators,
  alert: alertValidators,
  case: caseValidators,
  user: userValidators,
  provider: providerValidators,
};
