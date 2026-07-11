'use strict';

const SEVERITY_ORDER = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const SEVERITY_RANK = Object.fromEntries(SEVERITY_ORDER.map((s, i) => [s, i]));

function determineAlertNecessity(riskResult, liquidityResult) {
  const risk = (riskResult && typeof riskResult === 'object') ? riskResult : { severity: 'LOW' };
  const liquidity = (liquidityResult && typeof liquidityResult === 'object') ? liquidityResult : { status: 'HEALTHY' };

  const riskSeverity = risk.severity || 'LOW';
  const liquidityStatus = liquidity.status || 'HEALTHY';

  const riskRank = SEVERITY_RANK[riskSeverity] ?? 0;
  const liquidityRank = SEVERITY_RANK[liquidityStatus] ?? 0;

  const maxRank = Math.max(riskRank, liquidityRank);
  const needsAlert = maxRank >= SEVERITY_RANK['HIGH'];

  const severity = SEVERITY_ORDER[maxRank] || 'LOW';

  return { needsAlert, severity };
}

function determineCaseNecessity(alert) {
  if (!alert || typeof alert !== 'object') return false;

  const alertSeverity = alert.severity || alert.alertSeverity || 'LOW';
  const alertRank = SEVERITY_RANK[alertSeverity] ?? 0;

  return alertRank >= SEVERITY_RANK['HIGH'];
}

function processTransactionWorkflow(transactionData, { liquidityResult, riskResult, forecastResult, aiResult } = {}) {
  const txn = transactionData || {};
  const liq = (liquidityResult && typeof liquidityResult === 'object') ? liquidityResult : {};
  const risk = (riskResult && typeof riskResult === 'object') ? riskResult : {};
  const forecast = (forecastResult && typeof forecastResult === 'object') ? forecastResult : {};
  const ai = (aiResult && typeof aiResult === 'object') ? aiResult : {};

  const alertAssessment = determineAlertNecessity(risk, liq);
  const needsCase = determineCaseNecessity(alertAssessment);

  const liquidityScore = Number(liq.liquidityScore);
  const isLiquidityLow = !isNaN(liquidityScore) && liquidityScore < 40;
  const riskScore = Number(risk.riskScore);
  const isRiskHigh = !isNaN(riskScore) && riskScore >= 60;
  const aiFlagged = ai.flagged === true || ai.requiresReview === true;

  const recommendations = [];
  if (alertAssessment.needsAlert) {
    recommendations.push(`Alert raised: ${alertAssessment.severity} severity detected.`);
  }
  if (needsCase) {
    recommendations.push('Case created for further investigation.');
  }
  if (isLiquidityLow) {
    recommendations.push('Review liquidity position and consider fund injection.');
  }
  if (isRiskHigh) {
    recommendations.push('Risk threshold exceeded. Immediate attention required.');
  }
  if (aiFlagged) {
    const aiReason = ai.reason || ai.message || 'AI analysis flagged this transaction.';
    recommendations.push(`AI review required: ${aiReason}`);
  }
  if (recommendations.length === 0) {
    recommendations.push('Transaction processed without issues.');
  }

  return {
    shouldCreateAlert: alertAssessment.needsAlert,
    severity: alertAssessment.severity,
    shouldCreateCase: needsCase,
    priority: needsCase ? 'HIGH' : alertAssessment.needsAlert ? 'MEDIUM' : 'LOW',
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { processTransactionWorkflow, determineAlertNecessity, determineCaseNecessity };
