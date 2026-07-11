const prisma = require('../config/prisma');

const AuditRepository = {
  async create(data) {
    return prisma.auditLog.create({
      data,
    });
  },

  async findAll({ filters = {}, pagination = {} }) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = buildWhereClause(filters);

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
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
};

function buildWhereClause(filters) {
  const where = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }
  if (filters.action) {
    where.action = filters.action;
  }
  if (filters.resource) {
    where.resource = filters.resource;
  }
  if (filters.search) {
    where.OR = [
      { action: { contains: filters.search } },
      { resource: { contains: filters.search } },
    ];
  }
  if (filters.dateFrom || filters.dateTo) {
    where.timestamp = {};
    if (filters.dateFrom) {
      where.timestamp.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.timestamp.lte = new Date(filters.dateTo);
    }
  }

  return where;
}

module.exports = AuditRepository;
