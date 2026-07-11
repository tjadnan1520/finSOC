'use strict';

const LABEL_THRESHOLDS = [
  { min: 90, label: 'VERY_HIGH' },
  { min: 70, label: 'HIGH' },
  { min: 45, label: 'MODERATE' },
  { min: 20, label: 'LOW' },
  { min: 0, label: 'VERY_LOW' },
];

function calculateConfidenceScore({ dataQuality, completeness, historicalAccuracy, volatility } = {}) {
  const dq = Math.min(100, Math.max(0, Number(dataQuality) || 0));
  const comp = Math.min(100, Math.max(0, Number(completeness) || 0));
  const ha = Math.min(100, Math.max(0, Number(historicalAccuracy) || 0));
  const vol = Math.min(100, Math.max(0, Number(volatility) || 50));

  const qualityComponent = dq * 0.35;
  const completenessComponent = comp * 0.25;
  const accuracyComponent = ha * 0.25;
  const volatilityPenalty = vol * 0.15;

  const score = Math.min(100, Math.max(0, Math.round(qualityComponent + completenessComponent + accuracyComponent - volatilityPenalty)));
  return score;
}

function getConfidenceLabel(score) {
  const s = Number(score);
  if (isNaN(s)) return 'VERY_LOW';

  for (const threshold of LABEL_THRESHOLDS) {
    if (s >= threshold.min) return threshold.label;
  }
  return 'VERY_LOW';
}

function adjustConfidence(score, factors) {
  const baseScore = Number(score);
  if (isNaN(baseScore)) return 0;

  const factorList = Array.isArray(factors) ? factors : [];

  let adjustment = 0;
  for (const factor of factorList) {
    if (factor && typeof factor === 'object') {
      const impact = Number(factor.impact) || 0;
      const weight = Number(factor.weight) || 1;
      adjustment += impact * weight;
    }
  }

  const adjusted = Math.min(100, Math.max(0, Math.round(baseScore + adjustment)));
  return adjusted;
}

module.exports = { calculateConfidenceScore, getConfidenceLabel, adjustConfidence };
