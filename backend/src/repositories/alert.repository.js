const prisma = require('../config/prisma');

const AlertRepository = {
  async create(data) {
    return prisma.alert.create({
      data,
      include: {
        transaction: true,
        aiAnalysis: true,
      },
    });
  },

  async findAll({ filters = {}, pagination = {} }) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = buildWhereClause(filters);

    const [data, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        skip,
        take: limit,
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
      prisma.alert.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id) {
    return prisma.alert.findUnique({
      where: { id },
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
        evidence: true,
      },
    });
  },

  async updateStatus(id, status) {
    return prisma.alert.update({
      where: { id },
      data: { status },
    });
  },

  async assign(id, operatorId) {
    return prisma.alert.update({
      where: { id },
      data: {
        case: {
          upsert: {
            create: {
              assignedToId: operatorId,
              priority: 'MEDIUM',
              status: 'OPEN',
            },
            update: {
              assignedToId: operatorId,
            },
          },
        },
      },
    });
  },

  async resolve(id) {
    return prisma.alert.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  },

  async close(id) {
    return prisma.alert.update({
      where: { id },
      data: {
        status: 'CLOSED',
        resolvedAt: new Date(),
      },
    });
  },

  async getSummaryStats() {
    const [statusCounts, severityCounts] = await Promise.all([
      prisma.alert.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.alert.groupBy({
        by: ['severity'],
        _count: true,
      }),
    ]);

    return {
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
};

function buildWhereClause(filters) {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.severity) {
    where.severity = filters.severity;
  }
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }
  if (filters.dateFrom || filters.dateTo) {
    where.generatedAt = {};
    if (filters.dateFrom) {
      where.generatedAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.generatedAt.lte = new Date(filters.dateTo);
    }
  }

  return where;
}

module.exports = AlertRepository;
