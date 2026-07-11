const prisma = require('../config/prisma');

const DashboardRepository = {
  async getDashboardData() {
    const [physicalCash, providerBalances, recentTransactions, recentAlerts, openCasesCount, notificationsCount] =
      await Promise.all([
        prisma.physicalCash.findFirst(),
        prisma.providerBalance.findMany({
          include: { provider: true },
        }),
        prisma.transaction.findMany({
          take: 10,
          orderBy: { completedAt: 'desc' },
          include: {
            provider: true,
            agent: true,
            area: true,
          },
        }),
        prisma.alert.findMany({
          take: 10,
          orderBy: { generatedAt: 'desc' },
          include: {
            transaction: {
              include: {
                provider: true,
                agent: true,
                area: true,
              },
            },
            aiAnalysis: true,
            case: true,
          },
        }),
        prisma.case.count({
          where: { status: { not: 'RESOLVED' } },
        }),
        prisma.notification.count({
          where: { read: false },
        }),
      ]);

    return {
      physicalCash,
      providerBalances,
      recentTransactions,
      recentAlerts,
      openCasesCount,
      notificationsCount,
    };
  },

  async getAgentDashboard(agentId) {
    const [physicalCash, providerBalances, recentTransactions, recentAlerts, openCasesCount, notificationsCount] =
      await Promise.all([
        prisma.physicalCash.findFirst(),
        prisma.providerBalance.findMany({
          include: { provider: true },
        }),
        prisma.transaction.findMany({
          where: { agentId },
          take: 10,
          orderBy: { completedAt: 'desc' },
          include: {
            provider: true,
            agent: true,
            area: true,
          },
        }),
        prisma.alert.findMany({
          take: 10,
          orderBy: { generatedAt: 'desc' },
          include: {
            transaction: {
              include: {
                provider: true,
                agent: true,
                area: true,
              },
            },
            aiAnalysis: true,
          },
        }),
        prisma.case.count({
          where: { status: { not: 'RESOLVED' } },
        }),
        prisma.notification.count({
          where: { userId: agentId, read: false },
        }),
      ]);

    return {
      physicalCash,
      providerBalances,
      recentTransactions,
      recentAlerts,
      openCasesCount,
      notificationsCount,
    };
  },

  async getOperatorDashboard() {
    const [activeAlerts, assignedCases, recentAlerts, openCasesCount, notificationsCount] =
      await Promise.all([
        prisma.alert.findMany({
          where: { status: { in: ['OPEN', 'ASSIGNED', 'ESCALATED'] } },
          orderBy: { generatedAt: 'desc' },
          include: {
            transaction: {
              include: {
                provider: true,
                agent: true,
                area: true,
              },
            },
            aiAnalysis: true,
          },
        }),
        prisma.case.findMany({
          where: { assignedToId: { not: null }, status: { not: 'RESOLVED' } },
          orderBy: { createdAt: 'desc' },
          include: {
            alert: true,
            assignedTo: true,
          },
        }),
        prisma.alert.findMany({
          take: 10,
          orderBy: { generatedAt: 'desc' },
          include: {
            transaction: {
              include: {
                provider: true,
                agent: true,
                area: true,
              },
            },
            aiAnalysis: true,
          },
        }),
        prisma.case.count({
          where: { status: { not: 'RESOLVED' } },
        }),
        prisma.notification.count({
          where: { read: false },
        }),
      ]);

    return {
      activeAlerts,
      assignedCases,
      recentAlerts,
      openCasesCount,
      notificationsCount,
    };
  },

  async getManagementDashboard() {
    const [
      physicalCash,
      providerBalances,
      recentTransactions,
      recentAlerts,
      openCasesCount,
      notificationsCount,
      totalUsers,
      totalProviders,
      totalTransactions,
    ] = await Promise.all([
      prisma.physicalCash.findFirst(),
      prisma.providerBalance.findMany({
        include: { provider: true },
      }),
      prisma.transaction.findMany({
        take: 10,
        orderBy: { completedAt: 'desc' },
        include: {
          provider: true,
          agent: true,
          area: true,
        },
      }),
      prisma.alert.findMany({
        take: 10,
        orderBy: { generatedAt: 'desc' },
        include: {
          transaction: {
            include: {
              provider: true,
              agent: true,
              area: true,
            },
          },
          aiAnalysis: true,
          case: true,
        },
      }),
      prisma.case.count({
        where: { status: { not: 'RESOLVED' } },
      }),
      prisma.notification.count({
        where: { read: false },
      }),
      prisma.user.count(),
      prisma.provider.count(),
      prisma.transaction.count(),
    ]);

    return {
      physicalCash,
      providerBalances,
      recentTransactions,
      recentAlerts,
      openCasesCount,
      notificationsCount,
      totalUsers,
      totalProviders,
      totalTransactions,
    };
  },
};

module.exports = DashboardRepository;
