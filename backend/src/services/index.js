const authService = require('./auth.service');
const transactionService = require('./transaction.service');
const dashboardService = require('./dashboard.service');
const providerService = require('./provider.service');
const alertService = require('./alert.service');
const caseService = require('./case.service');
const analyticsService = require('./analytics.service');
const aiService = require('./ai.service');
const userService = require('./user.service');
const notificationService = require('./notification.service');
const auditService = require('./audit.service');
const liquidityService = require('./liquidity.service');
const riskService = require('./risk.service');
const forecastService = require('./forecast.service');

module.exports = {
  authService,
  transactionService,
  dashboardService,
  providerService,
  alertService,
  caseService,
  analyticsService,
  aiService,
  userService,
  notificationService,
  auditService,
  liquidityService,
  riskService,
  forecastService,
};
