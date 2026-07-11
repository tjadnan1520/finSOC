'use strict';

const PRIORITY_MAP = {
  INTERVENE: 'IMMEDIATE',
  ESCALATE: 'HIGH',
  REVIEW: 'MEDIUM',
  MONITOR: 'LOW',
  APPROVE: 'LOW',
};

function determineActionType(risk, liquidity) {
  const r = (risk && typeof risk === 'object') ? risk : {};
  const l = (liquidity && typeof liquidity === 'object') ? liquidity : {};

  const riskScore = Number(r.riskScore) ?? 0;
  const riskSeverity = r.severity || 'LOW';
  const liquidityScore = Number(l.liquidityScore) ?? 100;
  const liquidityStatus = l.status || 'HEALTHY';

  if (riskSeverity === 'CRITICAL' || riskScore >= 80) {
    return 'INTERVENE';
  }
  if (riskSeverity === 'HIGH' || riskScore >= 60) {
    return 'ESCALATE';
  }
  if (liquidityStatus === 'CRITICAL' || liquidityStatus === 'LOW') {
    return 'REVIEW';
  }
  if (riskScore >= 40 || liquidityStatus === 'MODERATE') {
    return 'MONITOR';
  }
  if (riskSeverity === 'LOW' && liquidityStatus === 'HEALTHY') {
    return 'APPROVE';
  }
  return 'MONITOR';
}

function getPriority(actionType) {
  return PRIORITY_MAP[actionType] || 'LOW';
}

function generateRecommendation({ risk, liquidity, forecast, confidence } = {}) {
  const r = (risk && typeof risk === 'object') ? risk : { riskScore: 0, severity: 'LOW', category: 'COMPLIANCE', factors: [] };
  const l = (liquidity && typeof liquidity === 'object') ? liquidity : { liquidityScore: 100, totalLiquidity: 0, physicalCashRatio: 0, providerBalanceRatio: 0, status: 'HEALTHY' };
  const f = (forecast && typeof forecast === 'object') ? forecast : { predictions: [], confidence: 100 };
  const c = (confidence && typeof confidence === 'object') ? confidence : { score: 100, label: 'VERY_HIGH' };

  const action = determineActionType(r, l);
  const priority = getPriority(action);

  const score = Number(c.score) ?? 100;
  const confImpact = score >= 70 ? '' : ' (low confidence)';
  const forecastImpact = f.confidence < 50 ? ' Forecast reliability is low.' : '';

  let reason;
  switch (action) {
    case 'INTERVENE':
      reason = `Critical risk detected (${r.severity}, score: ${r.riskScore}). Immediate intervention required.${forecastImpact}`;
      break;
    case 'ESCALATE':
      reason = `High risk level (${r.severity}, score: ${r.riskScore}). Escalate to senior team.${forecastImpact}`;
      break;
    case 'REVIEW':
      reason = `Liquidity is ${l.status} (score: ${l.liquidityScore}). Manual review recommended.${forecastImpact}`;
      break;
    case 'MONITOR':
      reason = `Conditions stable with moderate indicators. Continue monitoring${confImpact}.${forecastImpact}`;
      break;
    case 'APPROVE':
      reason = 'All indicators healthy. Transaction can proceed.';
      break;
    default:
      reason = 'No specific action required.';
  }

  const riskFactors = (r.factors && r.factors.length > 0) ? r.factors.map(f => f.name) : [];
  const impact = action === 'INTERVENE' ? 'BLOCKING'
    : action === 'ESCALATE' ? 'SIGNIFICANT'
    : action === 'REVIEW' ? 'MODERATE'
    : action === 'MONITOR' ? 'MINOR'
    : 'POSITIVE';

  return {
    action,
    reason: reason.trim(),
    priority,
    impact,
    details: {
      riskScore: r.riskScore,
      liquidityScore: l.liquidityScore,
      forecastConfidence: f.confidence,
      confidenceScore: score,
      riskFactors,
    },
  };
}

module.exports = { generateRecommendation, determineActionType, getPriority };
