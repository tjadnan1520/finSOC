const prisma = require('../config/prisma');

const AnalyticsRepository = {
  async getKPIData({ dateRange = {} }) {
    const { dateFrom, dateTo } = dateRange;

    const where = {};
    if (dateFrom || dateTo) {
      where.completedAt = {};
      if (dateFrom) where.completedAt.gte = new Date(dateFrom);
      if (dateTo) where.completedAt.lte = new Date(dateTo);
    }

    const [
      totalTransactions,
      transactionAggregation,
      totalAlerts,
      openAlerts,
      totalCases,
      openCases,
      totalUsers,
      totalProviders,
      liquiditySnapshot,
    ] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.aggregate({
        where,
        _sum: { amount: true },
      }),
      prisma.alert.count(),
      prisma.alert.count({ where: { status: { not: 'RESOLVED' } } }),
      prisma.case.count(),
      prisma.case.count({ where: { status: { not: 'RESOLVED' } } }),
      prisma.user.count(),
      prisma.provider.count(),
      prisma.liquiditySnapshot.findFirst({
        orderBy: { timestamp: 'desc' },
      }),
    ]);

    return {
      totalTransactions,
      totalTransactionAmount: transactionAggregation._sum.amount || 0,
      totalAlerts,
      openAlerts,
      totalCases,
      openCases,
      totalUsers,
      totalProviders,
      currentLiquidity: liquiditySnapshot,
    };
  },

  async getTransactionStats({ dateRange = {}, providerId } = {}) {
    const { dateFrom, dateTo } = dateRange;

    const where = {};
    if (dateFrom || dateTo) {
      where.completedAt = {};
      if (dateFrom) where.completedAt.gte = new Date(dateFrom);
      if (dateTo) where.completedAt.lte = new Date(dateTo);
    }
    if (providerId) {
      where.providerId = providerId;
    }

    const [totalCount, typeCounts, aggregation] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.groupBy({
        by: ['type'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where,
        _sum: { amount: true },
      }),
    ]);

    return {
      totalCount,
      totalAmount: aggregation._sum.amount || 0,
      byType: typeCounts.reduce((acc, curr) => {
        acc[curr.type] = {
          count: curr._count,
          totalAmount: curr._sum.amount || 0,
        };
        return acc;
      }, {}),
    };
  },

  async getAlertStats({ dateRange = {} } = {}) {
    const { dateFrom, dateTo } = dateRange;

    const where = {};
    if (dateFrom || dateTo) {
      where.generatedAt = {};
      if (dateFrom) where.generatedAt.gte = new Date(dateFrom);
      if (dateTo) where.generatedAt.lte = new Date(dateTo);
    }

    const [totalCount, statusCounts, severityCounts] = await Promise.all([
      prisma.alert.count({ where }),
      prisma.alert.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.alert.groupBy({
        by: ['severity'],
        where,
        _count: true,
      }),
    ]);

    return {
      totalCount,
      byStatus: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      }, {}),
      bySeverity: severityCounts.reduce((acc, curr) => {
        acc[curr.severity] = curr._count;
        return acc;
      }, {}),
    };
  },

  async getCaseStats({ dateRange = {} } = {}) {
    const { dateFrom, dateTo } = dateRange;

    const where = {};
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [totalCount, statusCounts, priorityCounts] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.case.groupBy({
        by: ['priority'],
        where,
        _count: true,
      }),
    ]);

    return {
      totalCount,
      byStatus: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      }, {}),
      byPriority: priorityCounts.reduce((acc, curr) => {
        acc[curr.priority] = curr._count;
        return acc;
      }, {}),
    };
  },

  async getLiquidityHistory({ days = 30 } = {}) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.liquiditySnapshot.findMany({
      where: {
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'asc' },
    });
  },

  async getForecastHistory({ days = 30 } = {}) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.forecast.findMany({
      where: {
        generatedAt: { gte: since },
      },
      orderBy: { generatedAt: 'asc' },
    });
  },

  async getProviderPerformance() {
    const providers = await prisma.provider.findMany({
      include: {
        balance: true,
        transactions: {
          select: {
            id: true,
            type: true,
            amount: true,
            status: true,
            completedAt: true,
          },
        },
      },
    });

    return providers.map((provider) => {
      const totalTransactions = provider.transactions.length;
      const totalAmount = provider.transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0,
      );
      const completedTransactions = provider.transactions.filter(
        (t) => t.status === 'COMPLETED',
      ).length;

      return {
        id: provider.id,
        name: provider.name,
        code: provider.code,
        status: provider.status,
        balance: provider.balance,
        totalTransactions,
        completedTransactions,
        totalAmount,
        successRate: totalTransactions > 0
          ? (completedTransactions / totalTransactions) * 100
          : 0,
      };
    });
  },
};

module.exports = AnalyticsRepository;
