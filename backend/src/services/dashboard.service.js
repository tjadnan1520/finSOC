const dashboardRepository = require('../repositories/dashboard.repository');
const providerRepository = require('../repositories/provider.repository');
const liquidityEngine = require('../engines/liquidity.engine');
const riskEngine = require('../engines/risk.engine');
const aiService = require('./ai.service');
const constants = require('../utils/constants');
const ApiError = require('../utils/apiError');

const getDashboard = async (user) => {
  try {
    if (!user || !user.role) throw new ApiError(400, 'User role is required');

    let dashboardData;
    switch (user.role.name || user.role) {
      case constants.ROLES.AGENT:
        dashboardData = await dashboardRepository.getAgentDashboard(user.id);
        break;
      case constants.ROLES.OPERATOR:
        dashboardData = await dashboardRepository.getOperatorDashboard();
        break;
      case constants.ROLES.MANAGEMENT:
        dashboardData = await dashboardRepository.getManagementDashboard();
        break;
      default:
        dashboardData = await dashboardRepository.getDashboardData();
    }

    const providers = await providerRepository.findAll();
    const providerBalancesMap = {};
    for (const provider of providers) {
      const fullProvider = await providerRepository.findById(provider.id);
      if (fullProvider?.balance) {
        providerBalancesMap[provider.name] = Number(fullProvider.balance.currentBalance);
      }
    }

    const physicalCashAmount = Number(dashboardData.physicalCash?.currentBalance || 0);

    const liquidityResult = liquidityEngine.calculateLiquidityScore({
      physicalCash: physicalCashAmount,
      providerBalances: providerBalancesMap,
    });
    const liquidityThreshold = liquidityEngine.checkThresholds(liquidityResult.liquidityScore);

    const providerHealthList = await providerRepository.getProviderHealth();
    const avgHealth = providerHealthList.length > 0
      ? providerHealthList.reduce((sum, p) => {
          const txCount = p.transactionCount || 0;
          return sum + Math.min(100, txCount * 5 + 50);
        }, 0) / providerHealthList.length
      : 50;

    const riskResult = riskEngine.calculateOperationalRisk({
      liquidityScore: liquidityResult.liquidityScore,
      providerHealth: { score: avgHealth },
      recentAlerts: dashboardData.recentAlerts || [],
    });

    const aiData = {
      liquidity: liquidityResult,
      risk: {
        score: riskResult.riskScore,
        severity: riskResult.severity,
        category: riskResult.category,
      },
      providers: providerHealthList,
    };

    let aiRecommendation = null;
    try {
      aiRecommendation = await aiService.getAIRecommendation(aiData);
    } catch (error) {
      aiRecommendation = {
        summary: 'AI recommendation temporarily unavailable',
        reason: error.message,
        recommendation: 'Review dashboard data manually',
        confidence: 0,
        uncertainty: 100,
      };
    }

    return {
      ...dashboardData,
      liquidity: {
        ...liquidityResult,
        thresholds: liquidityThreshold,
      },
      risk: {
        score: riskResult.riskScore,
        severity: riskResult.severity,
        category: riskResult.category,
        factors: riskResult.factors,
      },
      aiRecommendation,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to load dashboard: ${error.message}`);
  }
};

const getDashboardSummary = async (user) => {
  const fullDashboard = await getDashboard(user);
  return {
    liquidityScore: fullDashboard.liquidity?.liquidityScore,
    liquidityStatus: fullDashboard.liquidity?.status,
    riskScore: fullDashboard.risk?.score,
    riskSeverity: fullDashboard.risk?.severity,
    openCasesCount: fullDashboard.openCasesCount,
    notificationsCount: fullDashboard.notificationsCount,
    recentTransactions: fullDashboard.recentTransactions?.slice(0, 5),
    recentAlerts: fullDashboard.recentAlerts?.slice(0, 5),
    aiRecommendation: fullDashboard.aiRecommendation,
  };
};

const getDashboardKPIs = async (user) => {
  const fullDashboard = await getDashboard(user);
  const transactions = fullDashboard.recentTransactions || [];
  const todayCashIn = transactions
    .filter((t) => t.type === 'CASH_IN')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const todayCashOut = transactions
    .filter((t) => t.type === 'CASH_OUT')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    totalLiquidity: fullDashboard.liquidity?.totalLiquidity || 0,
    liquidityScore: fullDashboard.liquidity?.liquidityScore || 0,
    riskScore: fullDashboard.risk?.score || 0,
    openCaseCount: fullDashboard.openCasesCount || 0,
    unreadNotifications: fullDashboard.notificationsCount || 0,
    recentCashIn: todayCashIn,
    recentCashOut: todayCashOut,
    providerCount: fullDashboard.providerBalances?.length || 0,
    ...(fullDashboard.totalUsers !== undefined && { totalUsers: fullDashboard.totalUsers }),
    ...(fullDashboard.totalProviders !== undefined && { totalProviders: fullDashboard.totalProviders }),
    ...(fullDashboard.totalTransactions !== undefined && { totalTransactions: fullDashboard.totalTransactions }),
  };
};

module.exports = { getDashboard, getDashboardSummary, getDashboardKPIs };
