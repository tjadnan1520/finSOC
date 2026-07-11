const prisma = require('../config/prisma');

const TransactionRepository = {
  async create(data) {
    return prisma.transaction.create({
      data,
      include: {
        provider: true,
        agent: true,
        area: true,
      },
    });
  },

  async findById(id) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        provider: true,
        agent: true,
        area: true,
      },
    });
  },

  async findByReference(referenceNumber) {
    return prisma.transaction.findUnique({
      where: { referenceNumber },
      include: {
        provider: true,
        agent: true,
        area: true,
      },
    });
  },

  async findAll({ filters = {}, pagination = {}, sort = {} }) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = buildWhereClause(filters);

    const orderBy = {};
    if (sort.field) {
      orderBy[sort.field] = sort.order || 'desc';
    } else {
      orderBy.completedAt = 'desc';
    }

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          provider: true,
          agent: true,
          area: true,
        },
      }),
      prisma.transaction.count({ where }),
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

  async findByAgent(agentId, { pagination = {} }) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = { agentId };

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { completedAt: 'desc' },
        include: {
          provider: true,
          agent: true,
          area: true,
        },
      }),
      prisma.transaction.count({ where }),
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

  async count(filters = {}) {
    const where = buildWhereClause(filters);
    return prisma.transaction.count({ where });
  },

  async getTodaySummary() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const where = {
      completedAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    };

    const [transactions, physicalCash] = await Promise.all([
      prisma.transaction.findMany({ where }),
      prisma.physicalCash.findFirst(),
    ]);

    let totalCashIn = 0;
    let totalCashOut = 0;

    transactions.forEach((t) => {
      if (t.type === 'CASH_IN') {
        totalCashIn += Number(t.amount);
      } else if (t.type === 'CASH_OUT') {
        totalCashOut += Number(t.amount);
      }
    });

    return {
      todayCashIn: totalCashIn,
      todayCashOut: totalCashOut,
      todayCount: transactions.length,
      physicalCash: Number(physicalCash?.currentBalance || 0),
      totalCashIn,
      totalCashOut,
      totalTransactions: transactions.length,
    };
  },
};

function buildWhereClause(filters) {
  const where = {};

  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.providerId) {
    where.providerId = filters.providerId;
  }
  if (filters.agentId) {
    where.agentId = filters.agentId;
  }
  if (filters.areaId) {
    where.areaId = filters.areaId;
  }
  if (filters.search) {
    where.OR = [
      { referenceNumber: { contains: filters.search } },
      { remarks: { contains: filters.search } },
    ];
  }
  if (filters.dateFrom || filters.dateTo) {
    where.completedAt = {};
    if (filters.dateFrom) {
      where.completedAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.completedAt.lte = new Date(filters.dateTo);
    }
  }

  return where;
}

module.exports = TransactionRepository;
