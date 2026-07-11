const crypto = require('crypto');
const transactionRepository = require('../repositories/transaction.repository');
const providerRepository = require('../repositories/provider.repository');
const userRepository = require('../repositories/user.repository');
const alertRepository = require('../repositories/alert.repository');
const caseRepository = require('../repositories/case.repository');
const notificationRepository = require('../repositories/notification.repository');
const auditRepository = require('../repositories/audit.repository');
const liquidityEngine = require('../engines/liquidity.engine');
const riskEngine = require('../engines/risk.engine');
const forecastEngine = require('../engines/forecast.engine');
const workflowEngine = require('../engines/workflow.engine');
const aiService = require('./ai.service');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const ApiError = require('../utils/apiError');

const executeTransactionWorkflow = async ({ type, amount, providerId, agentId, areaId, remarks, phoneNumber, referenceNumber, createdById }) => {
  try {
    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      throw new ApiError(400, 'Amount must be greater than 0');
    }

    const effectiveAgentId = agentId || createdById;
    const agent = await userRepository.findById(effectiveAgentId);
    if (!agent) throw new ApiError(404, 'Agent not found');

    const effectiveAreaId = areaId || agent.areaId;
    if (!effectiveAreaId) throw new ApiError(400, 'Area is required for this transaction');

    const provider = await providerRepository.findById(providerId);
    if (!provider) throw new ApiError(404, 'Provider not found');

    const transactionReference = referenceNumber || `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const currentBalance = Number(provider.balance?.currentBalance || 0);
    const availableBalance = Number(provider.balance?.availableBalance || 0);
    const physicalCash = await providerRepository.getPhysicalCash();
    const currentPhysicalCash = Number(physicalCash?.currentBalance || 0);

    let newCurrentBalance;
    let newAvailableBalance;
    let newPhysicalCash;

    if (type === 'CASH_IN') {
      newCurrentBalance = currentBalance - amountNum;
      newAvailableBalance = availableBalance - amountNum;
      newPhysicalCash = currentPhysicalCash + amountNum;
    } else {
      newCurrentBalance = currentBalance + amountNum;
      newAvailableBalance = availableBalance + amountNum;
      newPhysicalCash = currentPhysicalCash - amountNum;
    }

    if (newCurrentBalance < 0 || newAvailableBalance < 0) throw new ApiError(400, 'Insufficient provider balance');
    if (newPhysicalCash < 0) throw new ApiError(400, 'Insufficient physical cash');

    const transaction = await transactionRepository.create({
      referenceNumber: transactionReference,
      phoneNumber,
      type,
      amount: amountNum,
      providerId,
      agentId: effectiveAgentId,
      areaId: effectiveAreaId,
      remarks,
      status: 'COMPLETED',
      createdById,
      completedAt: new Date(),
    });

    await providerRepository.updateBalance(providerId, {
      currentBalance: newCurrentBalance,
      availableBalance: newAvailableBalance,
    });
    await providerRepository.updatePhysicalCashBalance(newPhysicalCash);

    const providers = await providerRepository.findAll();
    const providerBalancesMap = {};
    for (const prov of providers) {
      const fullProv = await providerRepository.findById(prov.id);
      if (fullProv?.balance) {
        providerBalancesMap[prov.name] = Number(fullProv.balance.currentBalance);
      }
    }

    const physicalCashAmount = newPhysicalCash;

    const liquidityResult = liquidityEngine.calculateLiquidityScore({
      physicalCash: physicalCashAmount,
      providerBalances: providerBalancesMap,
    });

    const riskResult = riskEngine.calculateOperationalRisk({
      transaction: { amount: amountNum, type },
      liquidityScore: liquidityResult.liquidityScore,
      providerHealth: { score: 70 },
      recentAlerts: [],
    });

    const providerHealthList = await providerRepository.getProviderHealth();
    const historyValues = [];
    const transactionTrend = forecastEngine.calculateTrend(historyValues);

    const forecastResult = forecastEngine.generateForecast({
      liquidityHistory: historyValues,
      transactionTrend,
      providerBalances: providerBalancesMap,
    });

    const aiData = {
      transaction: { referenceNumber: transactionReference, type, amount: amountNum, providerId, agentId: effectiveAgentId, areaId: effectiveAreaId },
      liquidity: {
        score: liquidityResult.liquidityScore,
        totalLiquidity: liquidityResult.totalLiquidity,
        status: liquidityResult.status,
        providerBalances: providerBalancesMap,
      },
      risk: {
        score: riskResult.riskScore,
        severity: riskResult.severity,
        category: riskResult.category,
        factors: riskResult.factors,
      },
      forecast: {
        predictions: forecastResult.predictions,
        confidence: forecastResult.confidence,
      },
      providers: providerHealthList,
    };

    let aiRecommendation = null;
    try {
      aiRecommendation = await aiService.getAIRecommendation(aiData);
    } catch (error) {
      aiRecommendation = {
        summary: 'AI analysis temporarily unavailable',
        reason: 'AI service is currently unavailable. Please try again later.',
        recommendation: 'Process transaction based on standard procedures',
        confidence: 0,
        uncertainty: 100,
      };
    }

    const alertDecision = workflowEngine.determineAlertNecessity
      ? workflowEngine.determineAlertNecessity({
          riskScore: riskResult.riskScore,
          liquidityScore: liquidityResult.liquidityScore,
          transactionAmount: amountNum,
        })
      : { needsAlert: riskResult.riskScore >= 40, severity: riskResult.severity };

    let alert = null;
    let caseRecord = null;

    if (alertDecision && alertDecision.needsAlert) {
      const alertData = {
        title: `${type === 'CASH_IN' ? 'Cash In' : 'Cash Out'} - ${riskResult.severity} Risk Alert`,
        severity: alertDecision.severity || riskResult.severity,
        status: 'OPEN',
        category: riskResult.category,
        confidence: aiRecommendation?.confidence || 50,
        description: `Transaction ${transactionReference}: ${type} of ${amountNum} via ${provider.name}. Risk score: ${riskResult.riskScore}. Liquidity score: ${liquidityResult.liquidityScore}. ${aiRecommendation?.summary || ''}`,
        transactionId: transaction.id,
        generatedAt: new Date(),
      };

      alert = await alertRepository.create(alertData);

      const caseData = {
        alertId: alert.id,
        priority: alertDecision.severity === 'CRITICAL' || alertDecision.severity === 'HIGH' ? 'HIGH' : 'MEDIUM',
        status: 'OPEN',
      };

      caseRecord = await caseRepository.create(caseData);

      await notificationRepository.create({
        userId: effectiveAgentId,
        title: 'Alert Generated',
        message: `Alert created for transaction ${transactionReference} with ${riskResult.severity} severity`,
        type: 'ALERT',
        link: `/alerts/${alert.id}`,
      });
    }

    await auditRepository.create({
      userId: createdById,
      action: 'TRANSACTION_CREATED',
      resource: 'Transaction',
      resourceId: transaction.id,
      oldValue: null,
      newValue: {
        referenceNumber: transactionReference,
        phoneNumber,
        type,
        amount: amountNum,
        providerId,
        status: 'COMPLETED',
      },
      ip: null,
    });

    return {
      transaction,
      liquidity: liquidityResult,
      risk: riskResult,
      forecast: forecastResult,
      aiRecommendation,
      alert,
      case: caseRecord,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Transaction processing failed: ${error.message}`);
  }
};

const getTransactions = async (filters = {}, paginationOpts = {}) => {
  const pagination = getPagination(paginationOpts.page, paginationOpts.limit);
  const sort = paginationOpts.sort || {};

  const result = await transactionRepository.findAll({
    filters,
    pagination: { page: pagination.page, limit: pagination.limit },
    sort,
  });

  return {
    data: result.data,
    pagination: getPaginationMeta(result.pagination.total, pagination.page, pagination.limit),
  };
};

const getTransactionById = async (id) => {
  const transaction = await transactionRepository.findById(id);
  if (!transaction) throw new ApiError(404, 'Transaction not found');
  return transaction;
};

const cashIn = async (data) => {
  return executeTransactionWorkflow({ ...data, type: 'CASH_IN' });
};

const cashOut = async (data) => {
  return executeTransactionWorkflow({ ...data, type: 'CASH_OUT' });
};

const getTodaySummary = async () => {
  return transactionRepository.getTodaySummary();
};

module.exports = { cashIn, cashOut, executeTransactionWorkflow, getTransactions, getTransactionById, getTodaySummary };
