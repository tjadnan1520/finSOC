'use strict';

function determineSeverity(score) {
  const s = Number(score);
  if (isNaN(s) || s < 0) return 'LOW';
  if (s >= 80) return 'CRITICAL';
  if (s >= 60) return 'HIGH';
  if (s >= 40) return 'MEDIUM';
  return 'LOW';
}

function calculateConfidence(riskScore, dataCompleteness) {
  const rScore = Number(riskScore);
  const completeness = Math.min(100, Math.max(0, Number(dataCompleteness) || 0));

  if (isNaN(rScore)) return 0;
  if (completeness <= 0) return 0;

  const baseConfidence = completeness * 0.7;
  const riskCertainty = rScore >= 80 ? 90
    : rScore >= 60 ? 80
    : rScore >= 40 ? 70
    : 60;
  const riskComponent = riskCertainty * 0.3;

  return Math.min(100, Math.round(baseConfidence + riskComponent));
}

function calculateOperationalRisk({ transaction, liquidityScore, providerHealth, recentAlerts } = {}) {
  const txn = transaction || {};
  const txnAmount = Number(txn.amount) || 0;
  const isHighValue = txnAmount > 100000;
  const isUnusual = txn.isUnusual === true || txn.frequency === 'UNUSUAL';

  const liqScore = Number(liquidityScore);
  const liqRisk = isNaN(liqScore) ? 50
    : liqScore >= 70 ? 10
    : liqScore >= 40 ? 30
    : liqScore >= 20 ? 60
    : 90;

  const provHealth = (providerHealth && typeof providerHealth === 'object')
    ? Math.min(100, Math.max(0, Number(providerHealth.score) || 0))
    : 50;
  const providerRisk = 100 - provHealth;

  const alertCount = Array.isArray(recentAlerts) ? recentAlerts.length : 0;
  const alertRisk = Math.min(100, alertCount * 15);

  const amountFactor = isHighValue ? 20 : 0;
  const unusualFactor = isUnusual ? 25 : 0;
  const baseRisk = 10;

  const rawScore = baseRisk + liqRisk * 0.3 + providerRisk * 0.25 + alertRisk * 0.2 + amountFactor + unusualFactor;
  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  const factors = [];
  if (isHighValue) factors.push({ name: 'HIGH_VALUE_TRANSACTION', weight: amountFactor, detail: `Transaction amount $${txnAmount} exceeds threshold.` });
  if (isUnusual) factors.push({ name: 'UNUSUAL_PATTERN', weight: unusualFactor, detail: 'Transaction frequency pattern is unusual.' });
  if (liqRisk >= 60) factors.push({ name: 'LOW_LIQUIDITY', weight: liqRisk * 0.3, detail: `Liquidity score is ${liqScore}.` });
  if (providerRisk >= 50) factors.push({ name: 'PROVIDER_HEALTH', weight: providerRisk * 0.25, detail: `Provider health score is ${provHealth}.` });
  if (alertCount > 0) factors.push({ name: 'RECENT_ALERTS', weight: alertRisk, detail: `${alertCount} recent alert(s) detected.` });

  const category = riskScore >= 60 ? 'OPERATIONAL'
    : riskScore >= 40 ? 'LIQUIDITY'
    : 'COMPLIANCE';

  return {
    riskScore,
    severity: determineSeverity(riskScore),
    category,
    factors,
  };
}

module.exports = { calculateOperationalRisk, determineSeverity, calculateConfidence };
