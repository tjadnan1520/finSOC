'use strict';

function calculateLiquidityScore({ physicalCash, providerBalances } = {}) {
  const pCash = Number(physicalCash) || 0;
  const pBal = (providerBalances && typeof providerBalances === 'object')
    ? Object.values(providerBalances).reduce((s, v) => s + (Number(v) || 0), 0)
    : 0;

  const totalLiquidity = pCash + pBal;
  const physicalCashRatio = totalLiquidity > 0
    ? parseFloat(((pCash / totalLiquidity) * 100).toFixed(2))
    : 0;
  const providerBalanceRatio = totalLiquidity > 0
    ? parseFloat(((pBal / totalLiquidity) * 100).toFixed(2))
    : 0;

  let liquidityScore;
  if (totalLiquidity <= 0) {
    liquidityScore = 0;
  } else {
    const cashComponent = Math.min(physicalCashRatio, 100) * 0.6;
    const providerComponent = Math.min(providerBalanceRatio, 100) * 0.3;
    const diversificationBonus = (pCash > 0 && pBal > 0) ? 10 : 0;
    liquidityScore = Math.min(100, Math.round(cashComponent + providerComponent + diversificationBonus));
  }

  let status;
  if (liquidityScore >= 70) status = 'HEALTHY';
  else if (liquidityScore >= 40) status = 'MODERATE';
  else if (liquidityScore >= 20) status = 'LOW';
  else status = 'CRITICAL';

  return { liquidityScore, totalLiquidity, physicalCashRatio, providerBalanceRatio, status };
}

function calculateProviderImbalance(providerBalancesArray) {
  if (!Array.isArray(providerBalancesArray) || providerBalancesArray.length === 0) {
    return { isImbalanced: false, maxDeviation: 0, recommendation: 'No provider data available.' };
  }

  const balances = providerBalancesArray.map(b => ({
    provider: b.provider || 'unknown',
    balance: Number(b.balance) || 0,
  }));

  const avg = balances.reduce((s, b) => s + b.balance, 0) / balances.length;
  const deviations = balances.map(b => ({
    provider: b.provider,
    deviation: avg > 0 ? parseFloat((((b.balance - avg) / avg) * 100).toFixed(2)) : 0,
  }));

  const maxDevEntry = deviations.reduce((max, d) => (Math.abs(d.deviation) > Math.abs(max.deviation) ? d : max), deviations[0]);
  const maxDeviation = maxDevEntry ? Math.abs(maxDevEntry.deviation) : 0;
  const isImbalanced = maxDeviation > 30;

  let recommendation;
  if (!isImbalanced) {
    recommendation = 'Provider balances are well distributed.';
  } else {
    const imbalancedProviders = deviations.filter(d => Math.abs(d.deviation) > 30).map(d => d.provider);
    recommendation = `Provider imbalance detected in: ${imbalancedProviders.join(', ')}. Consider redistributing funds to maintain optimal coverage.`;
  }

  return { isImbalanced, maxDeviation, recommendation };
}

function checkThresholds(liquidityScore) {
  const score = Number(liquidityScore);
  if (isNaN(score)) {
    return { needsAttention: false, severity: 'LOW', message: 'Invalid liquidity score.' };
  }

  if (score >= 70) {
    return { needsAttention: false, severity: 'LOW', message: 'Liquidity is healthy. No action required.' };
  }
  if (score >= 40) {
    return { needsAttention: true, severity: 'MEDIUM', message: 'Liquidity is moderate. Monitor closely.' };
  }
  if (score >= 20) {
    return { needsAttention: true, severity: 'HIGH', message: 'Liquidity is low. Consider increasing cash reserves.' };
  }
  return { needsAttention: true, severity: 'CRITICAL', message: 'Liquidity is critical. Immediate action required.' };
}

module.exports = { calculateLiquidityScore, calculateProviderImbalance, checkThresholds };
