const prisma = require('../config/prisma');

const ProviderRepository = {
  async findAll() {
    return prisma.provider.findMany({
      where: { status: 'ACTIVE' },
    });
  },

  async findById(id) {
    return prisma.provider.findUnique({
      where: { id },
      include: {
        balance: true,
      },
    });
  },

  async updateBalance(id, { currentBalance, availableBalance }) {
    return prisma.providerBalance.update({
      where: { providerId: id },
      data: {
        ...(currentBalance !== undefined && { currentBalance }),
        ...(availableBalance !== undefined && { availableBalance }),
        lastUpdatedAt: new Date(),
      },
    });
  },

  async getStatistics(providerId) {
    const [transactionCount, totalAmounts] = await Promise.all([
      prisma.transaction.count({
        where: { providerId },
      }),
      prisma.transaction.aggregate({
        where: { providerId },
        _sum: { amount: true },
      }),
    ]);

    return {
      providerId,
      transactionCount,
      totalAmount: totalAmounts._sum.amount || 0,
    };
  },

  async getProviderHealth() {
    const providers = await prisma.provider.findMany({
      include: {
        balance: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      code: provider.code,
      status: provider.status,
      balance: provider.balance,
      transactionCount: provider._count.transactions,
    }));
  },
};

module.exports = ProviderRepository;
