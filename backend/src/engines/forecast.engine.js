'use strict';

function calculateTrend(dataPoints) {
  if (!Array.isArray(dataPoints) || dataPoints.length < 2) {
    return { direction: 'STABLE', percentage: 0 };
  }

  const values = dataPoints
    .map(d => (d && typeof d.value !== 'undefined') ? Number(d.value) : Number(d))
    .filter(v => !isNaN(v));

  if (values.length < 2) {
    return { direction: 'STABLE', percentage: 0 };
  }

  const first = values[0];
  const last = values[values.length - 1];

  if (first === 0) {
    return { direction: last > 0 ? 'UP' : last < 0 ? 'DOWN' : 'STABLE', percentage: last > 0 ? 100 : last < 0 ? -100 : 0 };
  }

  const percentage = parseFloat((((last - first) / Math.abs(first)) * 100).toFixed(2));

  let direction;
  if (percentage > 5) direction = 'UP';
  else if (percentage < -5) direction = 'DOWN';
  else direction = 'STABLE';

  return { direction, percentage };
}

function generateForecast({ liquidityHistory, transactionTrend, providerBalances } = {}) {
  const history = Array.isArray(liquidityHistory) ? liquidityHistory : [];
  const trend = calculateTrend(history);
  const txnTrend = transactionTrend || { direction: 'STABLE', percentage: 0 };
  const pBal = (providerBalances && typeof providerBalances === 'object')
    ? Object.values(providerBalances).reduce((s, v) => s + (Number(v) || 0), 0)
    : 0;

  const currentCash = history.length > 0 ? (Number(history[history.length - 1]?.value) || Number(history[history.length - 1]) || 0) : 0;
  const currentProviderBalance = pBal;

  const trendMultiplier = trend.direction === 'UP' ? 1.05
    : trend.direction === 'DOWN' ? 0.95
    : 1.0;
  const txnMultiplier = txnTrend.direction === 'UP' ? 0.98
    : txnTrend.direction === 'DOWN' ? 1.02
    : 1.0;

  const predictions = [
    {
      timeframe: '30min',
      expectedLiquidity: Math.round((currentCash + currentProviderBalance) * trendMultiplier * txnMultiplier * 1.0),
      expectedCash: Math.round(currentCash * trendMultiplier * txnMultiplier * 1.0),
      expectedProviderBalance: Math.round(currentProviderBalance * trendMultiplier * txnMultiplier * 1.0),
    },
    {
      timeframe: '1hour',
      expectedLiquidity: Math.round((currentCash + currentProviderBalance) * trendMultiplier * txnMultiplier * 0.98),
      expectedCash: Math.round(currentCash * trendMultiplier * txnMultiplier * 0.97),
      expectedProviderBalance: Math.round(currentProviderBalance * trendMultiplier * txnMultiplier * 0.99),
    },
    {
      timeframe: '2hours',
      expectedLiquidity: Math.round((currentCash + currentProviderBalance) * trendMultiplier * txnMultiplier * 0.95),
      expectedCash: Math.round(currentCash * trendMultiplier * txnMultiplier * 0.93),
      expectedProviderBalance: Math.round(currentProviderBalance * trendMultiplier * txnMultiplier * 0.97),
    },
  ];

  const volatility = history.length >= 4
    ? (() => {
        const vals = history.map(d => Number(d?.value) || Number(d) || 0);
        const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
        const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
        return mean > 0 ? Math.sqrt(variance) / mean : 0.5;
      })()
    : 0.3;

  const trendConfidence = Math.max(0, 100 - Math.abs(trend.percentage) * 2);
  const txnConfidence = txnTrend.direction === 'STABLE' ? 85 : 65;
  const dataConfidence = Math.min(100, (history.length / 20) * 100);
  const volatilityPenalty = Math.min(50, Math.round(volatility * 100));
  const confidence = Math.min(100, Math.max(0, Math.round((trendConfidence * 0.3 + txnConfidence * 0.3 + dataConfidence * 0.4) - volatilityPenalty)));

  return { predictions, confidence };
}

module.exports = { generateForecast, calculateTrend };
