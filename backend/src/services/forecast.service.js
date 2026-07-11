const forecastEngine = require('../engines/forecast.engine');
const analyticsRepository = require('../repositories/analytics.repository');
const providerRepository = require('../repositories/provider.repository');
const ApiError = require('../utils/apiError');

const generateForecast = async () => {
  try {
    const liquidityHistory = await analyticsRepository.getLiquidityHistory({ days: 30 });
    const providers = await providerRepository.findAll();

    const providerBalancesMap = {};
    for (const provider of providers) {
      const fullProvider = await providerRepository.findById(provider.id);
      if (fullProvider?.balance) {
        providerBalancesMap[provider.name] = Number(fullProvider.balance.currentBalance);
      }
    }

    const historyValues = liquidityHistory.map((h) => ({
      value: Number(h.totalLiquidity) || 0,
      timestamp: h.timestamp,
    }));

    const transactionTrend = forecastEngine.calculateTrend(historyValues);

    const forecastResult = forecastEngine.generateForecast({
      liquidityHistory: historyValues,
      transactionTrend,
      providerBalances: providerBalancesMap,
    });

    return {
      predictions: forecastResult.predictions,
      confidence: forecastResult.confidence,
      trend: transactionTrend,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new ApiError(500, `Failed to generate forecast: ${error.message}`);
  }
};

const getLatestForecast = async () => {
  const forecastHistory = await analyticsRepository.getForecastHistory({ days: 1 });
  if (!forecastHistory || forecastHistory.length === 0) {
    return generateForecast();
  }
  return forecastHistory[forecastHistory.length - 1];
};

module.exports = { generateForecast, getLatestForecast };
