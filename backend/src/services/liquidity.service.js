const providerRepository = require('../repositories/provider.repository');
const analyticsRepository = require('../repositories/analytics.repository');
const liquidityEngine = require('../engines/liquidity.engine');
const ApiError = require('../utils/apiError');

const getCurrentLiquidity = async () => {
  try {
    const providers = await providerRepository.findAll();
    const physicalCash = await providerRepository.getPhysicalCash();
    let physicalCashAmount = Number(physicalCash?.currentBalance || 0);
    const providerBalancesMap = {};

    for (const provider of providers) {
      const fullProvider = await providerRepository.findById(provider.id);
      if (fullProvider?.balance) {
        providerBalancesMap[provider.name] = Number(fullProvider.balance.currentBalance);
      }
    }

    const liquidityResult = liquidityEngine.calculateLiquidityScore({
      physicalCash: physicalCashAmount,
      providerBalances: providerBalancesMap,
    });

    const thresholdResult = liquidityEngine.checkThresholds(liquidityResult.liquidityScore);

    const imbalanceResult = liquidityEngine.calculateProviderImbalance(
      Object.entries(providerBalancesMap).map(([provider, balance]) => ({
        provider,
        balance,
      }))
    );

    return {
      ...liquidityResult,
      thresholds: thresholdResult,
      imbalance: imbalanceResult,
      physicalCash: physicalCashAmount,
      providerBalances: providerBalancesMap,
    };
  } catch (error) {
    throw new ApiError(500, `Failed to calculate liquidity: ${error.message}`);
  }
};

const getLiquidityHistory = async (days = 30) => {
  const history = await analyticsRepository.getLiquidityHistory({ days });
  return history;
};

const checkLiquidityHealth = async () => {
  const liquidity = await getCurrentLiquidity();
  return {
    score: liquidity.liquidityScore,
    status: liquidity.status,
    totalLiquidity: liquidity.totalLiquidity,
    needsAttention: liquidity.thresholds.needsAttention,
    severity: liquidity.thresholds.severity,
    message: liquidity.thresholds.message,
    imbalance: liquidity.imbalance,
  };
};

module.exports = { getCurrentLiquidity, getLiquidityHistory, checkLiquidityHealth };
