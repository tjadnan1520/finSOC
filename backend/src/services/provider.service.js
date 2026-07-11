const providerRepository = require('../repositories/provider.repository');
const analyticsRepository = require('../repositories/analytics.repository');
const ApiError = require('../utils/apiError');

const getProviders = async () => {
  const providers = await providerRepository.findAll();
  const enriched = [];
  for (const provider of providers) {
    const fullProvider = await providerRepository.findById(provider.id);
    enriched.push({
      ...provider,
      balance: fullProvider?.balance || null,
    });
  }
  return enriched;
};

const getProviderById = async (id) => {
  const provider = await providerRepository.findById(id);
  if (!provider) throw new ApiError(404, 'Provider not found');
  return provider;
};

const getProviderBalances = async () => {
  const providers = await providerRepository.findAll();
  const balances = [];
  for (const provider of providers) {
    const fullProvider = await providerRepository.findById(provider.id);
    if (fullProvider?.balance) {
      balances.push({
        providerId: provider.id,
        providerName: provider.name,
        providerCode: provider.code,
        currentBalance: Number(fullProvider.balance.currentBalance),
        availableBalance: Number(fullProvider.balance.availableBalance),
        reservedBalance: Number(fullProvider.balance.reservedBalance),
        lastUpdatedAt: fullProvider.balance.lastUpdatedAt,
      });
    }
  }
  return balances;
};

const getProviderStatistics = async (id) => {
  const provider = await providerRepository.findById(id);
  if (!provider) throw new ApiError(404, 'Provider not found');

  const statistics = await providerRepository.getStatistics(id);
  return {
    ...statistics,
    providerName: provider.name,
    providerCode: provider.code,
    currentBalance: Number(provider.balance?.currentBalance || 0),
    availableBalance: Number(provider.balance?.availableBalance || 0),
  };
};

const getProviderPerformance = async () => {
  return analyticsRepository.getProviderPerformance();
};

module.exports = { getProviders, getProviderById, getProviderBalances, getProviderStatistics, getProviderPerformance };
