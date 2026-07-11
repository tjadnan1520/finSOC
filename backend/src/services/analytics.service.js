const analyticsRepository = require('../repositories/analytics.repository');
const providerRepository = require('../repositories/provider.repository');
const liquidityEngine = require('../engines/liquidity.engine');
const riskEngine = require('../engines/risk.engine');
const forecastEngine = require('../engines/forecast.engine');
const ApiError = require('../utils/apiError');

const getOverview = async ({ dateRange = {} } = {}) => {
  try {
    const kpiData = await analyticsRepository.getKPIData({ dateRange });
    const transactionStats = await analyticsRepository.getTransactionStats({ dateRange });
    const alertStats = await analyticsRepository.getAlertStats({ dateRange });
    const caseStats = await analyticsRepository.getCaseStats({ dateRange });

    return {
      kpis: kpiData,
      transactions: transactionStats,
      alerts: alertStats,
      cases: caseStats,
    };
  } catch (error) {
    throw new ApiError(500, `Failed to get analytics overview: ${error.message}`);
  }
};

const getKPIs = async ({ dateRange = {} } = {}) => {
  try {
    return analyticsRepository.getKPIData({ dateRange });
  } catch (error) {
    throw new ApiError(500, `Failed to get KPIs: ${error.message}`);
  }
};

const getForecast = async () => {
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

const getRiskTrend = async ({ period = '7d' } = {}) => {
  try {
    const days = parseInt(period, 10) || 7;
    const liquidityHistory = await analyticsRepository.getLiquidityHistory({ days });
    const providerHealth = await providerRepository.getProviderHealth();

    const avgHealth = providerHealth.length > 0
      ? providerHealth.reduce((sum, p) => {
          const txCount = p.transactionCount || 0;
          return sum + Math.min(100, txCount * 5 + 50);
        }, 0) / providerHealth.length
      : 50;

    const riskTrend = liquidityHistory.map((snapshot) => {
      const riskResult = riskEngine.calculateOperationalRisk({
        liquidityScore: Number(snapshot.liquidityScore || 0),
        providerHealth: { score: avgHealth },
        recentAlerts: [],
      });

      return {
        timestamp: snapshot.timestamp,
        riskScore: riskResult.riskScore,
        severity: riskResult.severity,
        category: riskResult.category,
      };
    });

    return {
      riskTrend,
      currentRisk: riskTrend.length > 0 ? riskTrend[riskTrend.length - 1] : null,
      period,
    };
  } catch (error) {
    throw new ApiError(500, `Failed to get risk trend: ${error.message}`);
  }
};

const getProviderAnalytics = async () => {
  try {
    return analyticsRepository.getProviderPerformance();
  } catch (error) {
    throw new ApiError(500, `Failed to get provider analytics: ${error.message}`);
  }
};

const getLiquidityTrend = async ({ days = 30 } = {}) => {
  try {
    const history = await analyticsRepository.getLiquidityHistory({ days });
    const trend = forecastEngine.calculateTrend(
      history.map((h) => ({ value: Number(h.totalLiquidity) || 0, timestamp: h.timestamp }))
    );

    return {
      data: history,
      trend,
      days,
    };
  } catch (error) {
    throw new ApiError(500, `Failed to get liquidity trend: ${error.message}`);
  }
};

const getPerformanceMetrics = async () => {
  try {
    const providers = await analyticsRepository.getProviderPerformance();
    const totalTransactions = providers.reduce((sum, p) => sum + p.totalTransactions, 0);
    const totalAmount = providers.reduce((sum, p) => sum + p.totalAmount, 0);
    const avgSuccessRate = providers.length > 0
      ? providers.reduce((sum, p) => sum + p.successRate, 0) / providers.length
      : 0;

    return {
      totalTransactions,
      totalAmount,
      averageSuccessRate: parseFloat(avgSuccessRate.toFixed(2)),
      providerBreakdown: providers,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new ApiError(500, `Failed to get performance metrics: ${error.message}`);
  }
};

module.exports = { getOverview, getKPIs, getForecast, getRiskTrend, getProviderAnalytics, getLiquidityTrend, getPerformanceMetrics };
