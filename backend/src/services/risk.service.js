const riskEngine = require('../engines/risk.engine');
const liquidityService = require('./liquidity.service');
const providerRepository = require('../repositories/provider.repository');
const analyticsRepository = require('../repositories/analytics.repository');
const ApiError = require('../utils/apiError');

const assessTransactionRisk = async (transactionData, liquidityData) => {
  try {
    const liquidity = liquidityData || await liquidityService.getCurrentLiquidity();
    const providerHealth = await providerRepository.getProviderHealth();
    const recentAlerts = [];

    const riskResult = riskEngine.calculateOperationalRisk({
      transaction: transactionData,
      liquidityScore: liquidity.liquidityScore,
      providerHealth: { score: calculateAverageHealth(providerHealth) },
      recentAlerts,
    });

    const confidence = riskEngine.calculateConfidence(riskResult.riskScore, 85);

    return {
      ...riskResult,
      confidence,
    };
  } catch (error) {
    throw new ApiError(500, `Failed to assess transaction risk: ${error.message}`);
  }
};

const getCurrentRiskLevel = async () => {
  try {
    const liquidity = await liquidityService.getCurrentLiquidity();
    const providerHealth = await providerRepository.getProviderHealth();

    const riskResult = riskEngine.calculateOperationalRisk({
      liquidityScore: liquidity.liquidityScore,
      providerHealth: { score: calculateAverageHealth(providerHealth) },
    });

    const confidence = riskEngine.calculateConfidence(riskResult.riskScore, 80);

    return {
      level: riskResult.severity,
      score: riskResult.riskScore,
      category: riskResult.category,
      confidence,
      factors: riskResult.factors,
    };
  } catch (error) {
    throw new ApiError(500, `Failed to get current risk level: ${error.message}`);
  }
};

const getRiskHistory = async (period = '7d') => {
  const days = parseInt(period, 10) || 7;
  const history = await analyticsRepository.getLiquidityHistory({ days });
  return history;
};

const calculateAverageHealth = (providers) => {
  if (!Array.isArray(providers) || providers.length === 0) return 50;
  const scores = providers.map((p) => {
    const txCount = p.transactionCount || 0;
    return Math.min(100, txCount * 5 + 50);
  });
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
};

module.exports = { assessTransactionRisk, getCurrentRiskLevel, getRiskHistory };
